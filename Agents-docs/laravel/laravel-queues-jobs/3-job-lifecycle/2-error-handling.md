---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-error-handling"
---

# Gestion des Tâches Échouées (Handling Failed Jobs)

Quand les tâches échouent inévitablement (bug, timeout, base de données hors ligne), Laravel fournit de puissants outils pour les gérer, les réessayer intelligemment et les déboguer.

## La Méthode `failed()`

Définissez exactement ce qui doit se passer dans l'application _après_ que la tâche ait épuisé toutes ses tentatives (`$tries`) :

```php
class ProcessOrder implements ShouldQueue
{
    public function handle(): void
    {
        // ... Traitement compliqué de la commande ...
    }

    /**
     * Gérer l'échec DÉFINITIF de la tâche.
     * Appelé automatiquement par Laravel quand on abandonne.
     */
    public function failed(?\Throwable $exception): void
    {
        // 1. Enregistrer discrètement l'échec dans les logs pour analyse ultérieure
        Log::error('Échec critique du traitement de commande', [
            'order_id' => $this->order->id,
            'exception' => $exception->getMessage(),
        ]);

        // 2. Alerter l'équipe de développement sur un canal Slack
        Notification::send(
            User::admins()->get(),
            new JobFailed($this->order, $exception)
        );

        // 3. Informer le client ou le back-office que ça a raté
        $this->order->update(['status' => 'erreur_technique']);
    }
}
```

## Échec Manuel Dlibéré (Manual Failure)

Parfois, votre code se rend compte lui-même qu'il ne doit pas continuer, mais qu'il faut marquer la tâche en rouge (Failed) :

```php
public function handle(): void
{
    if ($this->order->cancelled) {
        // La commande a été annulée entre temps ? On fait exploser la tâche avec un message clair !
        $this->fail('La commande a été annulée avant le traitement.');
        return;
    }

    // Alternative : Lancer une vraie Exception métier
    $this->fail(new OrderCancelledException());
}
```

## Effacer Proprement (Deleting Jobs)

Au lieu "d'échouer" avec fracas et de remplir la vue des erreurs, vous pouvez décider que la tâche n'a juste plus lieu d'être et qu'il faut l'arrêter en douceur :

```php
public function handle(): void
{
    if ($this->order->cancelled) {
        $this->delete();  // Retire SILENCIEUSEMENT de la file, tout va bien, on arrête là.
        return;
    }

    // Traitement normal...
}
```

## Remettre dans la File (Releasing Jobs Back to Queue)

Si l'API externe que vous appelez renvoie une "Erreur 429 Too Many Requests" ou "503 Service Unavailable", ce n'est pas un bug de votre code. Remettez la tâche dans la file pour plus tard :

```php
public function handle(): void
{
    if ($this->apiExterneEnPanne()) {
        $this->release(60);  // D'accord, je lâche l'affaire pour l'instant. Le Worker réessayera dans 60 secondes.
        return;
    }

    // Traitement normal...
}
```

## Gestionnaire Global d'Échecs (Global Handler)

Plutôt que de définir un `failed()` dans chaque Job, on peut écouter l'événement global `JobFailed` dans la mécanique principale :

Dans `App\Providers\AppServiceProvider` :

```php
use Illuminate\Queue\Events\JobFailed;
use Illuminate\Support\Facades\Queue;

public function boot(): void
{
    // Ce code s'exécutera à n'importe quel échec de N'IMPORTE QUELLE tâche
    Queue::failing(function (JobFailed $event) {
        // $event->connectionName (ex: redis)
        // $event->job (l'objet tâche complexe)
        // $event->exception (L'erreur crue)

        // Exemple : Envoyer TOUTES les erreurs globales sur Slack
        Log::channel('slack')->error('Alerte: Un Job vient de planter', [
            'job' => $event->job->resolveName(), // Nom de la classe du Job
            'exception' => $event->exception->getMessage(),
        ]);
    });
}
```

## Commandes Artisan de Gestion Outil

Supervisez vos échecs en ligne de commande :

```bash
# Lister toutes les tâches échouées chronologiquement
php artisan queue:failed

# Relancer UN Job précis via son UUID
php artisan queue:retry ce7bb17c-cdd8-41f0-a8ec-7b4fef4e5ece

# Relancer TOUTES les tâches qui avaient échoué
php artisan queue:retry all

# Purger (Pardonner) un problème passé
php artisan queue:forget ce7bb17c-cdd8-41f0-a8ec-7b4fef4e5ece

# Faire table rase (Vider la liste des échecs)
php artisan queue:flush

# Nettoyage automatique (CRON) : Supprimer les logs d'erreurs de plus de 48 heures
php artisan queue:prune-failed --hours=48
```

## Ignorer si le Modèle a disparu (Skip If Model Missing)

Rappelez-vous, si vous passez le Modèle `User` nº5 à votre Job en argument, mais que ce `User` nº5 est banni et supprimé de votre base de données avant que le Job n'ait eu le temps de démarrer... le Job va crasher (ModelNotFoundException) !

Pour dire au Job "Écoute, si l'objet n'existe plus en BDD, ne t'en fais pas, annule tout simplement le travail discretement" :

```php
use Illuminate\Queue\Middleware\SkipIfModelMissing;

class SendWelcomeEmail implements ShouldQueue
{
    use SerializesModels;

    public function __construct(
        public User $user
    ) {}

    // Option 1 : Via les Middlewares
    public function middleware(): array
    {
        return [new SkipIfModelMissing];
    }
}

// Option 2 (Plus rapide) : Via une simple propriété magique
class SendWelcomeEmail implements ShouldQueue
{
    public bool $deleteWhenMissingModels = true; // Pouf, erreur évitée élégamment !
}
```

## Attendre la Fin des Transactions de BDD (After Commit)

(Très important et très vicieux). Imaginez :

1. Vous créez un Compte en BDD dans une _Transaction_ (qui n'est pas encore finalisée).
2. Juste en dessous, vous lancez le Job `EnvoyerBienvenue::dispatch($compte)`.
3. Le Job ultra-rapide démarre en 0.1s. Il cherche le `$compte` en BDD...
4. **BAM !** Le Worker ne trouve pas le point, car la _Transaction_ principale n'était pas finie d'être sauvegardée !

La solution pour obliger Laravel attendre que la transaction soit finie avant d'envoyer le Worker :

```php
class ProcessPayment implements ShouldQueue
{
    // N'envoie ça aux Workers QUE SI la BDD a confirmé l'enregistrement de toutes les données liées.
    public bool $afterCommit = true;
}

// Ou au moment du lancement dans le contrôleur :
ProcessPayment::dispatch($payment)->afterCommit();
```

## Exemple d'un Job Blindé (Full Error Handling)

Voici un parfait condensé d'un Job hautement professionnel :

```php
<?php

namespace App\Jobs;

use App\Models\Order;
use App\Services\PaymentGateway;
use App\Notifications\PaymentFailed;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\Middleware\WithoutOverlapping;

class ProcessPayment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3; // 3 essais max
    public array $backoff = [30, 60, 120]; // Attend 30s, puis 1min, puis 2min entre chaque échec
    public int $timeout = 60; // Max 1 minute de calcul pour chaque essai
    public bool $failOnTimeout = true; // Considérez les timeout comme des échecs francs
    public bool $deleteWhenMissingModels = true; // Si la commande a été effacée de la BDD, jeter l'éponge.

    public function __construct(
        public Order $order
    ) {}

    public function middleware(): array
    {
        return [
            // On ne veut absolument pas exécuter le paiement de cette commande en double !!
            new WithoutOverlapping($this->order->id),
        ];
    }

    public function handle(PaymentGateway $gateway): void
    {
        // 1. Double check de sécurité
        if ($this->order->isPaid()) {
            $this->delete(); // Déjà payé ? S'enfuir !
            return;
        }

        // 2. Traitement à risque
        try {
            $charge = $gateway->charge($this->order);
            $this->order->markAsPaid($charge->id);

        } catch (PaymentDeclinedException $e) { // CB refusée ?
            $this->fail($e); // Fin de partie, c'est raté mon gars.

        } catch (GatewayUnavailableException $e) { // Stripe est tombé par terre ?
            $this->release(60); // OK, c'est pas de ma faute, je relance ça dans 60 secondes.
        }
    }

    // Si on a épuisé nos $tries ou si on a fait $this->fail()
    public function failed(?\Throwable $exception): void
    {
        // Mise en échec de la commande en BDD globale
        $this->order->update(['status' => 'payment_failed']);

        // Dire à l'utilisateur pourquoi
        $this->order->user->notify(new PaymentFailed($this->order, $exception));
    }
}
```

## Ressources

- [Gestion des Tâches Échouées](https://laravel.com/docs/12.x/queues#dealing-with-failed-jobs) — Documentation officielle

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
