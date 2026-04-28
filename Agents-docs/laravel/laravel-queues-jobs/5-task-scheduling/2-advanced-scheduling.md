---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-advanced-scheduling"
---

# Fonctionnalités Avancées de Planification (Advanced Scheduling)

Le planificateur de Laravel inclut des outils très puissants pour contrôler exactement **quand** et **comment** les tâches s'exécutent.

## Empêcher le Chevauchement des Tâches (Preventing Task Overlaps)

Imaginez une tâche de génération de rapport prévue toutes les minutes. Si exceptionnellement le rapport prend 3 minutes à se générer, la minute suivante, un **deuxième** processus va se lancer en parallèle, puis un 3ème ! Le serveur risque d'exploser.

```php
Schedule::command('emails:send')
    ->withoutOverlapping()  // Magique : Ignore l'exécution si la précédente n'a pas fini !
    ->daily();

// Sécurité : "Si la tâche bloque pendant plus de 10 minutes, on force l'expiration du verrou de sécurité"
Schedule::command('reports:generate')
    ->withoutOverlapping(10)  // Le verrou expire après 10 minutes quoiqu'il arrive
    ->hourly();
```

_(Note : Cela nécessite un pilote de cache capable de gérer les verrous/locks comme Redis, Memcached ou la Base de données locale)._

## Exécution sur un Seul Serveur (On One Server)

Si vous avez une application de haute disponibilité déployée sur 3 serveurs Web équilibrés (Load Balancers), le `cron` tournera sur les 3 serveurs en même temps ! Vous enverriez les emails 3 fois.

```php
Schedule::command('report:generate')
    ->onOneServer()  // Le premier serveur qui attrape la tâche verrouille les autres
    ->daily();
```

_(Nécessite que tous vos serveurs partagent le même cache central, souvent Redis)._

## Tâches en Arrière-plan (Background Tasks)

Par défaut, les tâches planifiées simultanément sont exécutées séquentiellement l'une après l'autre.
Si `emails:send` et `analytics:import` sont prévus la nuit à 00:00, et que les mails prennent 2 heures... `analytics` ne commencera pas avant 02h00 !

```php
// Fait tourner la ligne de commande linux en arrière-plan (avec &)
// Libère immédiatement la suite du calendrier !
Schedule::command('analytics:import')
    ->runInBackground()
    ->daily();
```

## Planification Conditionnelle (Conditional Scheduling)

Vous pouvez dicter les règles métier pour exécuter ou zapper une tâche de manière dynamique :

```php
// Exécuter UNIQUEMENT SI c'est vrai
Schedule::command('emails:send')
    ->daily()
    ->when(function () {
        return config('mail.enabled'); // Ex: Désactivé en pré-production
    });

// ZAPPER SI c'est vrai (L'inverse logique)
Schedule::command('backup:run')
    ->daily()
    ->skip(function () {
        return app()->isDownForMaintenance(); // Le site est en maintenance
    });

// Exécuter uniquement dans des environnements d'infrastructures précis
Schedule::command('telescope:prune')
    ->environments(['staging', 'production']) // Jamais en 'local' ou 'testing'
    ->daily();
```

## Contraintes de Jours de la Semaine

```php
// Uniquement les jours ouvrés (Du Lundi au Vendredi)
Schedule::command('report:generate')
    ->weekdays()
    ->at('08:00');

// Uniquement le week-end (Samedi et Dimanche)
Schedule::command('cleanup:run')
    ->weekends()
    ->at('02:00');

// Les jours pointilleux choisis à la carte
Schedule::command('task')
    ->days([Schedule::MONDAY, Schedule::WEDNESDAY, Schedule::FRIDAY])
    ->at('09:00');
```

## Contraintes Horaires strictes

```php
// Uniquement dans une plage horaire
Schedule::command('process:queue')
    ->everyMinute()
    ->between('8:00', '17:00');  // Horaires de bureau

// Sauf pendant la journée (ex: Nettoyage massif la nuit)
Schedule::command('heavy:task')
    ->hourly()
    ->unlessBetween('9:00', '17:00');
```

## Mémoriser la Sortie (Task Output)

Que se passe-t-il dans une commande lancée par Cron ? Elle est aveugle. Vous voulez garder une trace textuelle du résultat (`echo`, `dump`, ou les `Log`).

```php
// Écraser un fichier log avec le texte de sortie
Schedule::command('emails:send')
    ->daily()
    ->sendOutputTo('/var/log/email-output.log');

// Ajouter du texte à un fichier existant sans l'écraser (Append)
Schedule::command('emails:send')
    ->daily()
    ->appendOutputTo('/var/log/email-output.log');

// Envoyer la sortie complète par email ! (Nécessite mail configuré)
Schedule::command('report:generate')
    ->daily()
    ->emailOutputTo('admin@example.com');

// Moins spammy : Envoyer un mail QUE si la commande plante (Code retour 1)
Schedule::command('backup:run')
    ->daily()
    ->emailOutputOnFailure('admin@example.com');
```

## Les Hooks (Crochets d'Événements)

Vous voulez lancer des actions avant ou après même si la tâche n'est pas un concept d'événement ?

```php
Schedule::command('emails:send')
    ->daily()
    ->before(function () {
        // Appelé pile avant le lancement natif
        Log::info('Je m\'apprête à envoyer des emails');
    })
    ->after(function () {
        // Appelé à la fin (succès OU échec)
        Log::info('J\'ai fini d\'essayer d\'envoyer des emails');
    })
    ->onSuccess(function () {
        // Uniquement si tout a fonctionné sans planter
        Notification::send($admin, new TaskSucceeded('emails:send'));
    })
    ->onFailure(function () {
        // Uniquement en cas d'erreur fatale
        Notification::send($admin, new TaskFailed('emails:send'));
    });
```

## URLs de Pulses de Santé (Heartbeats)

Pratique si vous utilisez des services de supervision de serveurs (monitoring) comme Envoyer, OhDear ou Healthchecks.io.

```php
// Envoyer un "PONG" (GET Request HTTP) au service de monitoring avant ou après
Schedule::command('backup:run')
    ->daily()
    ->pingBefore('https://healthchecks.io/ping/start')
    ->thenPing('https://healthchecks.io/ping/end')
    ->pingOnSuccess('https://healthchecks.io/ping/success')
    ->pingOnFailure('https://healthchecks.io/ping/failure'); // Déclenche l'alarme du monitoring !
```

## Outils pour Visualiser le Calendrier

Ne devinez pas ce que fait votre Cron, demandez-lui en utilisant Artisan :

```bash
# Lister le beau tableau de toutes les tâches programmées
php artisan schedule:list
```

Sortie typique :

```text
+--------------------+-----------+---------------------+-------------------------------+
| Command            | Interval  | Next Due            | Description                   |
+--------------------+-----------+---------------------+-------------------------------+
| emails:send        | Daily     | 2024-01-16 00:00:00 | Envoi de tous les mails prev  |
| backup:run         | Daily 2am | 2024-01-16 02:00:00 | Sauvegarde brute              |
+--------------------+-----------+---------------------+-------------------------------+
```

## L'Exemple Ultime en Environnement Produit

Voici à quoi ressemble un fichier `routes/console.php` pour un gros projet commercial :

```php
use Illuminate\Support\Facades\Schedule;

// == SAUVEGARDES (Nuit profonde)
Schedule::command('backup:clean')->daily()->at('01:00');
Schedule::command('backup:run')->daily()->at('02:00');

// == RAPPORTS (Pour l'ouverture des bureaux)
Schedule::command('report:daily')
    ->dailyAt('08:00')
    ->weekdays()
    ->emailOutputOnFailure('admin@example.com');

// == NETTOYAGES PROPRES
Schedule::command('telescope:prune --hours=48') // Nettoyage de l'outil debogueur
    ->daily()
    ->environments(['production']);

Schedule::command('queue:prune-failed --hours=168') // Effacer les vieilles erreurs
    ->weekly();

// == TRAVAUX DE CALCUL PERMAMENTS
Schedule::command('process:pending-orders')
    ->everyFiveMinutes()
    ->withoutOverlapping() // Sécurité ultime
    ->onOneServer();       // Éviter le double-facturation sur plusieurs serveurs WEB !

// == MAINTENANCE BDD LOURDE
Schedule::command('db:optimize') // Refonte des index MySQL
    ->weekly()
    ->sundays()
    ->at('03:00') // Pendant les heures creuses
    ->unlessBetween('08:00', '22:00');
```

## Ressources

- [Commandes Planifiées](https://laravel.com/docs/12.x/scheduling) — Documentation de référence très exhaustive.

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
