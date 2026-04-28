---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-job-configuration"
---

# Options de Configuration des Tâches (Job Configuration)

Vous pouvez configurer précisément le comportement de chaque tâche (Job) en ajoutant des propriétés et des méthodes spécifiques directement dans sa classe.

## Configuration des Relances (Retries)

Si une tâche échoue (ex: appel d'API externe qui timeout), Laravel peut la relancer automatiquement.

```php
class ProcessPodcast implements ShouldQueue
{
    /**
     * Nombre maximum de tentatives AVANT de déclarer la tâche définitivement "Échouée".
     */
    public int $tries = 3;

    /**
     * Nombre d'exceptions (erreurs critiques) autorisées avant d'échouer.
     * Utile si vous avez des blocages gérés séparément des erreurs pures.
     */
    public int $maxExceptions = 3;

    /**
     * Temps d'attente FIXE (en secondes) avant chaque nouvelle tentative.
     */
    public int $backoff = 10;

    /**
     * Temps d'attente EXPONENTIEL (Idéal pour laisser un serveur respirer).
     * 1er échec => 10s d'attente. 2ème échec => 30s. 3ème échec => 60s.
     */
    public array $backoff = [10, 30, 60];
}
```

### Relances basées sur le Temps (Time-Based Retries)

Au lieu d'un nombre d'essais fixe, essayez en boucle jusqu'à une date/heure précise :

```php
class ProcessPodcast implements ShouldQueue
{
    /**
     * Continuer d'essayer jusqu'à 24h après la création, peu importe le nombre d'essais.
     */
    public function retryUntil(): \DateTime
    {
        return now()->addHours(24);
    }
}
```

## Configuration du Délai d'Attente (Timeout)

```php
class ProcessVideo implements ShouldQueue
{
    /**
     * Durée de vie maximale accordée à la tâche (en secondes).
     * Si elle dépasse, le processus du Worker est tué et la tâche échoue.
     */
    public int $timeout = 300;  // 5 minutes max pour encoder la vidéo

    /**
     * Par défaut, un timeout n'est pas toujours compté comme un "échec" classique.
     * Mettez ceci sur 'true' pour forcer l'enregistrement dans "failed_jobs".
     */
    public bool $failOnTimeout = true;
}
```

## Tâches Uniques (Unique Jobs)

Empêche qu'une même tâche soit empilée 50 fois si l'utilisateur clique frénétiquement sur un bouton !

```php
use Illuminate\Contracts\Queue\ShouldBeUnique;

// Ajouter l'interface `ShouldBeUnique`
class UpdateSearchIndex implements ShouldQueue, ShouldBeUnique
{
    public function __construct(
        public Product $product
    ) {}

    /**
     * L'identifiant unique de la tâche.
     * Pour Laravel, "Mettre à jour l'index du Produit 123" est UNE seule intention.
     */
    public function uniqueId(): string
    {
        return (string) $this->product->id;
    }

    /**
     * Combien de temps verrouille-t-on la création de doublons (en secondes) ?
     */
    public int $uniqueFor = 3600;  // Verrouillé pour 1 heure
}

// Exemple d'utilisation dans un Contrôleur :
UpdateSearchIndex::dispatch($product); // Acceptée et mise en file
UpdateSearchIndex::dispatch($product); // IGNORÉE SILENCIEUSEMENT (Doublon selon UniqueId)
```

### Unique Jusqu'au Traitement (Unique Until Processing)

L'exemple précédent bloque les doublons pendant _toute_ la durée de `uniqueFor` (1 heure complet), même si le Worker a fini la tâche en 2 secondes !
Pour débloquer dès que le Worker **commence** le travail :

```php
use Illuminate\Contracts\Queue\ShouldBeUniqueUntilProcessing;

class GenerateReport implements ShouldQueue, ShouldBeUniqueUntilProcessing
{
    // Permet à un autre Job pour le même ID d'être mis en file DÈS QUE celui-ci aura DÉMARRÉ.
}
```

## Limiter le Débit des Tâches (Rate Limiting)

Vous traitez des milliers de commandes, mais l'API de facturation externe que vous appelez n'accepte que 60 requêtes/minute ?

```php
use Illuminate\Queue\Middleware\RateLimited;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

// 1. Définir la limite dans AppServiceProvider (méthode boot)
RateLimiter::for('api-facturation', function ($job) {
    return Limit::perMinute(60); // 60 appels par minute globalement
});

// 2. Appliquer ce Middleware (Filtre) à votre Tâche
class CallExternalApi implements ShouldQueue
{
    public function middleware(): array
    {
        return [new RateLimited('api-facturation')];
    }
}
```

## Empêcher le Chevauchement (Without Overlapping)

Si vous avez 5 Workers en parallèle, deux Workers pourraient prendre la tâche "Mettre à jour la balance de Paul" et la "Mettre à jour le statut de Paul" _en même temps_, causant un conflit BDD.

```php
use Illuminate\Queue\Middleware\WithoutOverlapping;

class UpdateUserBalance implements ShouldQueue
{
    public function __construct(
        public User $user
    ) {}

    public function middleware(): array
    {
        return [
            // Aucun autre Job concernant CET UTILISATEUR ($user->id) ne pourra s'exécuter en même temps.
            new WithoutOverlapping($this->user->id),
        ];
    }
}
```

### Comportement en cas de chevauchement

Que faire si un Worker tombe sur un dossier verrouillé ?

```php
public function middleware(): array
{
    return [
        (new WithoutOverlapping($this->user->id))
            // Ne pas "échouer", juste remettre la tâche dans la file pour dans 60 secondes !
            ->releaseAfter(60)
            // Par sécurité globale, faire sauter le verrou si le 1er Worker crash complètement
            ->expireAfter(180),
    ];
}
```

## Middlewares de Tâche (Job Middleware)

Les "Middlewares" sont des couches de code qui entourent votre tâche pour lui donner des capacités supplémentaires sans polluer votre `handle()`.

Exemple : Freiner les exceptions. Si l'API renvoie des erreurs aléatoires, on limite la casse.

```php
use Illuminate\Queue\Middleware\ThrottlesExceptions;

class ProcessWebhook implements ShouldQueue
{
    public function middleware(): array
    {
        return [
            // Max 10 exceptions autorisées toutes les 5 minutes
            new ThrottlesExceptions(10, 5),
        ];
    }
}
```

### Créer un Middleware Personnalisé

Très utile pour faire du logging ou du monitoring sans salir chaque classe de Job.

```php
// Créer un fichier app/Jobs/Middleware/LogJobMiddleware.php
class LogJobMiddleware
{
    public function handle($job, $next)
    {
        Log::info('Démarrage de la tâche', ['class' => get_class($job)]);

        // Exécute la VRAIE tâche ($job->handle())
        $result = $next($job);

        Log::info('Tâche terminée avec succès', ['class' => get_class($job)]);

        return $result;
    }
}

// Utilisation dans n'importe quel Job :
public function middleware(): array
{
    return [new LogJobMiddleware];
}
```

## Ressources

- [Job Middleware](https://laravel.com/docs/12.x/queues#job-middleware) — Documentation officielle sur les Middlewares de tâches

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
