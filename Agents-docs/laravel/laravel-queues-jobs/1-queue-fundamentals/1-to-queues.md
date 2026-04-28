---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-introduction-to-queues"
---

# Introduction aux Files d'Attente (Queues)

Les files d'attente (queues) vous permettent de différer l'exécution de tâches chronophages (qui prennent du temps, comme l'envoi d'e-mails ou le traitement de vidéos) pour qu'elles soient traitées en arrière-plan (background). Cela permet de garder les temps de réponse de votre site web extrêmement rapides.

## Pourquoi utiliser des Files d'Attente ?

```text
Sans Files d'Attente :                    Avec Files d'Attente :
┌─────────────────────┐                   ┌─────────────────────┐
│ Requête Utilisateur │                   │ Requête Utilisateur │
└─────────┬───────────┘                   └─────────┬───────────┘
          │                                         │
          ▼                                         ▼
┌─────────────────────┐                   ┌─────────────────────┐
│ Enregistrer Commande│                   │ Enregistrer Commande│
│ (100ms)             │                   │ (100ms)             │
└─────────┬───────────┘                   └─────────┬───────────┘
          │                                         │
          ▼                                         ▼
┌─────────────────────┐                   ┌─────────────────────┐
│ Envoyer Email       │                   │ Mettre Email en File│ ◄── Retourne immédiatement !
│ (2000ms)            │                   │ (5ms)               │
└─────────┬───────────┘                   └─────────┬───────────┘
          │                                         │
          ▼                                         ▼
┌─────────────────────┐                   ┌─────────────────────┐
│ Générer PDF         │                   │ Réponse UI: 105ms   │
│ (3000ms)            │                   └─────────────────────┘
└─────────┬───────────┘
          │                               Travailleur en arrière-plan (Worker) :
          ▼                               ┌─────────────────────┐
┌─────────────────────┐                   │ Envoyer Email       │
│ Réponse UI: 5100ms  │                   │ Générer PDF         │
└─────────────────────┘                   │ (L'utilisateur n'attend pas) │
                                          └─────────────────────┘
```

## Les Avantages des Files d'Attente

| Avantage                      | Description                                                             |
| ----------------------------- | ----------------------------------------------------------------------- |
| **Réponses plus rapides**     | Les utilisateurs n'attendent pas la fin d'opérations lentes.            |
| **Meilleure Expérience (UX)** | Retour visuel immédiat, le vrai travail se fait en arrière-plan.        |
| **Évolutivité (Scalability)** | Vous pouvez ajouter plusieurs "Workers" pour gérer une charge énorme.   |
| **Fiabilité**                 | Relance automatiquement les tâches qui échouent (Retry).                |
| **Gestion des Ressources**    | Contrôler _quand_ les tâches lourdes s'exécutent (par exemple la nuit). |

## Les Pilotes de Files d'Attente (Queue Drivers)

Laravel supporte plusieurs technologies (backends) pour stocker sa file d'attente :

```php
// Fichier : config/queue.php
'connections' => [

    // Le plus simple, stocke les tâches dans une table MySQL/PostgreSQL
    'database' => [
        'driver' => 'database',
        'connection' => env('DB_QUEUE_CONNECTION'),
        'table' => env('DB_QUEUE_TABLE', 'jobs'), // La table s'appelle 'jobs'
        'queue' => env('DB_QUEUE', 'default'),
        'retry_after' => (int) env('DB_QUEUE_RETRY_AFTER', 90),
        'after_commit' => false,
    ],

    // Le standard pour la production, stocke les tâches en RAM (Ultra rapide)
    'redis' => [
        'driver' => 'redis',
        'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
        'queue' => env('REDIS_QUEUE', 'default'),
        'retry_after' => (int) env('REDIS_QUEUE_RETRY_AFTER', 90),
        'block_for' => null,
        'after_commit' => false,
    ],

    // Solution Cloud native sur Amazon Web Services
    'sqs' => [
        'driver' => 'sqs',
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/votre-compte-id'),
        'queue' => env('SQS_QUEUE', 'default'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
        'after_commit' => false,
    ],

    // Le pilote par défaut en développement : exécute la tâche immédiatement (Bloquant)
    'sync' => [
        'driver' => 'sync',  // Idéal pour tester sans devoir lancer de worker !
    ],
],
```

### Choisir un Pilote

| Pilote (Driver) | Cas d'Usage Recommandé                                                        |
| --------------- | ----------------------------------------------------------------------------- |
| **sync**        | Développement local (par défaut), Tests unitaires. Tout s'exécute à la suite. |
| **database**    | Projets simples, parfait pour commencer sans installer d'outils externes.     |
| **redis**       | Applications en Production, très hautes performances (in-memory).             |
| **sqs**         | Déploiements massifs sur l'infrastructure AWS cloud.                          |
| **beanstalkd**  | Alternative historique et robuste à Redis.                                    |

## Configuration avec Base de Données (Database Queue)

Laravel 12 inclut les migrations de files d'attente par défaut lors de l'installation.

```bash
# Si jamais vous aviez besoin de les créer manuellement :
php artisan make:queue-table
php artisan migrate
```

Voici à quoi ressemble la structure de la table `jobs` (tâches) créée :

```php
Schema::create('jobs', function (Blueprint $table) {
    $table->id();
    $table->string('queue')->index(); // Nom de la file d'attente (ex: 'emails', 'high-priority')
    $table->longText('payload');      // Le code sérialisé de la tâche à exécuter
    $table->unsignedTinyInteger('attempts'); // Nombre d'essais (si elle a échoué avant)
    $table->unsignedInteger('reserved_at')->nullable(); // Quand un travailleur l'a prise
    $table->unsignedInteger('available_at'); // Quand elle doit s'exécuter
    $table->unsignedInteger('created_at');
});
```

## Configurer la Connexion Actuelle

Cela se passe dans votre fichier caché `.env` à la racine :

```env
# .env

# Utiliser la base de données relationnelle classique (MySQL/PostgreSQL) :
QUEUE_CONNECTION=database

# Ou alors utiliser Redis (Si le serveur Redis est installé) :
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

## Exécuter les Travailleurs (Queue Workers)

Un "Worker" est un processus PHP qui tourne en boucle à l'infini en arrière-plan. Il surveille la base de données (ou Redis) et dès qu'une tâche est ajoutée, il l'attrape et l'exécute.

```bash
# Démarrer le traitement des tâches (La commande de base)
php artisan queue:work

# Ne traiter que les tâches spécifiques d'une liste (et prioriser 'high' avant 'default')
php artisan queue:work --queue=high,default,low

# Traiter UNE seule tâche puis quitter (pratique dans certains scripts cron)
php artisan queue:work --once

# Options de configuration avancées (Sécurité)
# Limite à 3 essais en cas d'erreur / 60s max par tâche / 128MB de RAM max !
php artisan queue:work --tries=3 --timeout=60 --memory=128

# Mode Écouteur (Redémarre le processus à chaque changement de votre code source !)
php artisan queue:listen
```

## Le Serveur de Développement Laravel 12

Aujourd'hui, Laravel 12 simplifie la vie des développeurs. Si vous lancez le serveur de développement via Composer, il démarrera **automatiquement** le serveur web ET un worker (`queue:listen`) :

```bash
composer dev
# Exécute en même temps : php artisan serve, php artisan queue:listen, pail (pour les logs) et Vite (pour le front-end)
```

## Ressources

- [Files d'Attente (Queues)](https://laravel.com/docs/12.x/queues) — Documentation officielle de Laravel

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
