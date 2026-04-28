---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-creating-jobs"
---

# Création des Classes de Tâches (Creating Job Classes)

Les tâches (Jobs) sont des classes PHP isolées qui encapsulent un travail spécifique à effectuer en arrière-plan. La règle d'or : "Une classe Job = Une action précise".

## Générer des Tâches

Utilisez Artisan pour créer la structure de base :

```bash
php artisan make:job ProcessPodcast
```

Cela crée le fichier `app/Jobs/ProcessPodcast.php` :

```php
<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue; // <--- TRÈS IMPORTANT
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

// ShouldQueue indique à Laravel : "Ne me lance JAMAIS tout de suite, mets-moi dans la file"
class ProcessPodcast implements ShouldQueue
{
    // Ce sont des Traits : Ils ajoutent des capacités magiques à la classe
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Crée une nouvelle instance de tâche.
     * C'est ici qu'on reçoit les données passées depuis le contrôleur.
     */
    public function __construct(
        public Podcast $podcast
    ) {}

    /**
     * Exécute la tâche.
     * C'est la fonction appelée par le Worker quand c'est son tour.
     */
    public function handle(): void
    {
        // Traiter le format audio du podcast en arrière-plan...
    }
}
```

## Anatomie d'une Tâche (Job)

### Explication des Traits

| Trait                | À quoi ça sert ?                                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `Dispatchable`       | Permet d'appeler la méthode statique `$job::dispatch()` pour lancer la tâche facilement depuis un contrôleur.                              |
| `InteractsWithQueue` | Donne accès aux commandes de la file (ex: `$this->delete()` au milieu d'un travail si on veut l'annuler).                                  |
| `Queueable`          | Permet de configurer le délai (`delay(10)`), le nom de la connexion et de la file depuis le contrôleur.                                    |
| `SerializesModels`   | **La Magie d'Eloquent** : Convertit vos gros objets Eloquent en simples ID pour ne pas surcharger la base de données de la file d'attente. |

### L'Interface `ShouldQueue`

```php
// AVEC ShouldQueue : La tâche sera mise en attente pour un Worker en arrière-plan
class EnvoyerEmail implements ShouldQueue { }

// SANS ShouldQueue : La tâche s'exécutera IMMEDIATEMENT dans la requête de l'utilisateur (Bloquant)
class EnvoyerEmail { }
```

## Passer des Données aux Tâches

C'est extrêmement simple grâce au PHP 8+ (Promotion des propriétés dans le constructeur) :

```php
<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Report;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    // Recevoir les données requises pour travailler
    public function __construct(
        public User $user,
        public string $reportType,
        public array $options = []
    ) {}

    public function handle(): void
    {
        // On fait le gros calcul de BDD via une classe externe imaginaire
        $report = Report::generate($this->reportType, $this->options);

        // Puis on envoie une notification à l'utilisateur ciblé
        $this->user->notify(new ReportReady($report));
    }
}
```

### Mécanique de Sérialisation des Modèles (Crucial à comprendre)

Grâce au trait `SerializesModels`, Laravel est intelligent avec les modèles de base de données (Eloquent) :

```php
// Au moment de lancer la tâche dans le Contrôleur
GenerateReport::dispatch($user, 'ventes');

// Si $user est le User n°123 :
// En base de données (table `jobs`), Laravel ne stocke PAS toutes les infos du User.
// Il stocke juste un petit JSON : {"class": "App\\Models\\User", "id": 123}

//----------------- PLUS TARD DANS LE TEMPS -----------------//

// Quand le Worker lit cette tâche dans la BDD pour la traiter,
// il refait discrètement un `User::find(123)` pour recharger un objet $user "frais" et à jour !
```

**⚠️ Avertissement de Sécurité** : Si le modèle (ex: User 123) est **supprimé** de la BDD _avant_ que le Worker n'ait eu le temps de s'occuper de son Job, la tâche va planter silencieusement en `ModelNotFoundException` !

## La Méthode `handle()` et l'Injection de Dépendances

La méthode `handle()` n'est pas limitée ! Elle supporte parfaitement l'injection de dépendances pour utiliser les services natifs de Laravel.

```php
// Demandez directement une classe AudioProcessor et le système de fichiers (Storage)
public function handle(
    AudioProcessor $processor,
    Storage $storage
): void {
    // 1. Appel du paquet externe qui encode la vidéo/audio
    $processedFile = $processor->process($this->podcast->audio_path);

    // 2. Sauvegarde via le Storage de Laravel sur un vieux disque poussiéreux
    $storage->put(
        "podcasts/{$this->podcast->id}/processed.mp3",
        $processedFile
    );

    // 3. Mise à jour de la Base de données : "Maman, c'est prêt !"
    $this->podcast->update(['processed' => true]);
}
```

## Exemple Complet de Tâche en Production

Voici à quoi ressemble un vrai Job robuste de traitement de commande, prêt pour la production (avec gestion des erreurs).

```php
<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\PaymentGateway;
use App\Notifications\OrderConfirmation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log; // Pour écrire dans storage/logs/laravel.log

class ProcessOrder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Nombre maximum d'essais si le serveur de paiement Stripe/Paypal est momentanément HS.
     */
    public int $tries = 3;

    /**
     * Délai maximum pour traiter la tâche avant de la déclarer en "Timeout" (en secondes).
     */
    public int $timeout = 120;

    public function __construct(
        public Order $order
    ) {}

    public function handle(PaymentGateway $gateway): void
    {
        Log::info('Début du traitement de la commande', ['order_id' => $this->order->id]);

        // 1. Facturer le client (Appel API externe)
        $charge = $gateway->charge(
            $this->order->user,
            $this->order->total
        );

        // 2. Mettre à jour le statut en base
        $this->order->update([
            'status' => 'payé',
            'charge_id' => $charge->id,
        ]);

        // 3. Envoyer le reçu par email
        $this->order->user->notify(new OrderConfirmation($this->order));
    }

    /**
     * Que faire si la tâche échoue (après les 3 tentatives) ?
     * Cette méthode spéciale est appelée automatiquement.
     */
    public function failed(?\Throwable $exception): void
    {
        // 1. Alerter l'administrateur dans les logs avec l'erreur PHP exacte
        Log::error('Échec critique du traitement de commande', [
            'order_id' => $this->order->id,
            'error' => $exception->getMessage(),
        ]);

        // 2. Changer le statut de la commande en BDD pour que le support s'en occupe
        $this->order->update(['status' => 'echoué']);
    }
}
```

## Ressources

- [Création de Tâches](https://laravel.com/docs/12.x/queues#creating-jobs) — Documentation officielle sur la création de tâches

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
