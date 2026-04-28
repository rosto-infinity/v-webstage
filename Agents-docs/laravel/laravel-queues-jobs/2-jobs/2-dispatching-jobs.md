---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-dispatching-jobs"
---

# Lancement des Tâches (Dispatching Jobs)

Une fois que vous avez défini votre tâche dans une classe dédiée, vous devez la propulser (dispatcher) vers la file d'attente pour qu'un travailleur (Worker) l'exécute quand viendra son tour.

## Lancement Basique

```php
use App\Jobs\ProcessPodcast;

// Dans un contrôleur classique
public function store(Request $request)
{
    $podcast = Podcast::create($request->validated());

    // On lance la tâche dans la file d'attente
    ProcessPodcast::dispatch($podcast);

    // On retourne IMMÉDIATEMENT la réponse à l'utilisateur,
    // l'encodage du podcast se fera en tâche de fond !
    return redirect()->route('podcasts.index')
        ->with('status', 'Votre Podcast a été envoyé et est en cours de traitement !');
}
```

## Méthodes de Lancement (Dispatch Methods)

Le trait `Dispatchable` offre plusieurs méthodes particulièrement utiles :

```php
// Lancement standard (mis en file d'attente classique)
ProcessPodcast::dispatch($podcast);

// Lancer UNIQUEMENT SI une condition est vraie
ProcessPodcast::dispatchIf($shouldProcess, $podcast);

// Lancer À MOINS QUE la condition soit vraie
ProcessPodcast::dispatchUnless($skipProcessing, $podcast);

// Lancement SYNCHRONE (Bloque la navigation de l'utilisateur, exécute immédiatement la tâche sans file)
ProcessPodcast::dispatchSync($podcast);

// Lancer juste après avoir envoyé la réponse HTTP à l'utilisateur (Génial pour les petites tâches rapides)
ProcessPodcast::dispatchAfterResponse($podcast);
```

## Lancement Différé (Delayed Dispatching)

Vous n'êtes pas obligé d'exécuter la tâche tout de suite. Vous pouvez la programmer dans le futur !

```php
// Attendre 10 minutes avant de traiter le podcast
ProcessPodcast::dispatch($podcast)
    ->delay(now()->addMinutes(10));

// Envoyer un mail de rappel dans 24 heures exactement
SendReminder::dispatch($user)
    ->delay(now()->addHours(24));

// Exécuter à une date pivot dynamique (Ex: Mettre un article "En Ligne" à la date prévue)
PublishPost::dispatch($post)
    ->delay($post->scheduled_at); // Champ Carbon SQL
```

## Spécifier la File et la Connexion Cible

```php
// Forcer l'envoi dans une file d'attente de traitement spécifique (ex: Serveurs dédiés à la vidéo)
ProcessPodcast::dispatch($podcast)
    ->onQueue('processing-video');

// Changer carrément le serveur (Ex: Utiliser AWS SQS au lieu de la base locale juste pour cette tâche)
ProcessPodcast::dispatch($podcast)
    ->onConnection('sqs');

// Cumuler les deux !
ProcessPodcast::dispatch($podcast)
    ->onConnection('redis') // Va sur le serveur Redis
    ->onQueue('high');      // Va sur le canal prioritaire
```

## Chaîner les Tâches (Job Chaining)

Très pratique : Exécuter une série de tâches l'une APRÈS l'autre. Si l'une d'entre elles échoue, les suivantes seront annulées.

```php
use Illuminate\Support\Facades\Bus;

Bus::chain([
    new ProcessPodcast($podcast),    // 1. D'abord on encode (ex: 5 minutes)
    new OptimizeAudio($podcast),     // 2. Ensuite on lisse le son (ex: 2 minutes)
    new PublishPodcast($podcast),    // 3. Enfin on publie l'épisode
    new NotifySubscribers($podcast), // 4. Et on prévient tout le monde par mail
])->dispatch();

// Chaînage AVEC Gestion d'erreur (Nouveauté pratique)
Bus::chain([
    new ProcessPodcast($podcast),
    new PublishPodcast($podcast),
])->catch(function (Throwable $e) {
    // Que faire si N'IMPORTE QUELLE tâche de la chaîne a lamentablement échoué ?
    Log::error('Catastrophe lors du traitement du podcast', ['error' => $e->getMessage()]);
})->dispatch();
```

## Le Traitement par Lots (Job Batching)

Alors que le chaînage exécute _séquentiellement_ (l'un après l'autre), le "Batching" permet d'exécuter des dizaines de tâches _en même temps_ (en parallèle par vos nombreux Workers) tout en gardant oeil sur la progression globale de toutes ces tâches combinées.

_⚠️ Nécessite la migration de base de données (table `job_batches`) : `php artisan queue:batches-table` puis `php artisan migrate`._

```php
use Illuminate\Bus\Batch;
use Illuminate\Support\Facades\Bus;

$batch = Bus::batch([
    new ImportCsv($file1), // Tâche 1 envoyée au Worker A
    new ImportCsv($file2), // Tâche 2 envoyée au Worker B
    new ImportCsv($file3), // Tâche 3 envoyée au Worker C
])->then(function (Batch $batch) {
    // Succès total : TOUTES les 3 tâches ont réussi !
    Log::info('Import CSV massif terminé à 100% !');
})->catch(function (Batch $batch, Throwable $e) {
    // Au moins UNE tâche parmi les 3 a échoué (Annule automatiquement les autres par défaut)
    Log::error('L\'importation a échoué en plein milieu', ['error' => $e->getMessage()]);
})->finally(function (Batch $batch) {
    // Terminé. Succès total ou Échec, peu importe.
})->name('Gros Import CSV') // Nom visible dans le tableau de bord Laravel Horizon
  ->allowFailures() // Option : Permettre l'échec d'un fichier sans annuler les 2 autres !
  ->dispatch();

// Vous pouvez stocker cet ID dans la session de l'utilisateur pour afficher une barre de progression !
$batchId = $batch->id;
```

### Vérifier l'État d'un Lot (Batch Status)

Pour nourrir votre barre de progression frontend, interrogez la base de données avec le `$batchId` :

```php
use Illuminate\Support\Facades\Bus;

$batch = Bus::findBatch($batchId);

$batch->id;               // ID (Chaîne UUID)
$batch->name;             // 'Gros Import CSV'
$batch->totalJobs;        // Le nombre total de tâches au départ (Ex: 3)
$batch->pendingJobs;      // Combien en reste-t-il à process ?
$batch->processedJobs();  // Combien sont finies et réussies ?
$batch->failedJobs;       // Combien ont explosé en vol ?
$batch->progress();       // Le pourcentage d'avancement (entier : 0 à 100). Parfait pour une jauge UI !
$batch->finished();       // Booléen : Vrai si tout est terminé
$batch->cancelled();      // Booléen : Vrai si annulé manuellement
```

### Ajouter dynamiquement des Tâches à un Lot existant

Exemple : Vous lancez un Lot pour traiter un dossier géant de photos. La 1ère tâche du lot découvre qu'il y a 50 photos dedans, elle peut elle-même rajouter 50 nouvelles tâches au Lot original !

```php
// À l'intérieur du handle() de votre Job de base
public function handle(): void
{
    // Ne rien faire si on a manuellement annulé le lot entier
    if ($this->batch()->cancelled()) {
        return;
    }

    // Le Job rajoute lui-même ses "bébés" au registre de progression parent !
    $this->batch()->add([
        new TraiterPhoto($laPhotoUn),
        new TraiterPhoto($laPhotoDeux),
    ]);
}
```

## Ressources

- [Lancer des Tâches (Dispatching Jobs)](https://laravel.com/docs/12.x/queues#dispatching-jobs) — Documentation officielle sur l'envoi de tâches

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
