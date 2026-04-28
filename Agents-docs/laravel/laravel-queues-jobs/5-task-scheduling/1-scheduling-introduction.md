---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-scheduling-introduction"
---

# Introduction à la Planification des Tâches (Task Scheduling)

Le planificateur de tâches de Laravel (Task Scheduler) vous permet de définir tout votre calendrier de commandes directement dans le code PHP de Laravel. L'énorme avantage est que **vous n'avez besoin que d'une seule entrée Cron sur votre serveur**, peu importe le nombre de tâches que vous avez.

## Pourquoi utiliser le Planificateur ?

```text
Cron Traditionnel Linux (L'Enfer) :      Planificateur Laravel (Le Paradis) :
┌─────────────────────────────────┐      ┌─────────────────────────────────┐
│ # Crontab du Serveur (Complexe) │      │ # Crontab du Serveur (Simple)   │
│ 0 * * * * /chemin/vers/report.php│      │ * * * * * cd /mon-app &&       │
│ */5 * * * * /chemin/vers/clean.php│      │       artisan schedule:run >>/log│
│ 0 0 * * * /chemin/vers/backup.php│      └─────────────────────────────────┘
│ 30 2 * * 0 /chemin/vers/prune.php│
│ ...et bien d'autres lignes...    │      TOUT le planning défini en PHP !
└─────────────────────────────────┘
```

## Définir les Planifications

Depuis Laravel 11, vous définissez vos planifications de manière très claire dans le fichier `routes/console.php` :

```php
use Illuminate\Support\Facades\Schedule;

// Exécute la commande d'envoi d'emails TOUS LES JOURS à minuit
Schedule::command('emails:send')->daily();

// Génère les rapports TOUTES LES SEMAINES le Lundi (1) à 8h00 du matin
Schedule::command('reports:generate')->weeklyOn(1, '8:00');

// Vide le cache système TOUTES LES HEURES
Schedule::command('cache:clear')->hourly();
```

## Planifier des Commandes Artisan

```php
// Lancer une commande Artisan personnalisée
Schedule::command('emails:send --force')->daily();

// Passer des arguments de manière structurée
Schedule::command('user:cleanup', ['--days' => 30])->weekly();

// Utiliser le nom de la classe de la Console Command (Méthode propre)
Schedule::command(CleanupUsersCommand::class)->monthly();
```

## Planifier des Tâches en Arrière-plan (Queued Jobs)

Si vous avez de gros Jobs, ne bloquez pas le Schedule ! Lancez simplement les Jobs dans la file d'attente (Queue) :

```php
use App\Jobs\ProcessReports;
use App\Jobs\CleanupDatabase;

// Met un Job dans la file tous les jours
Schedule::job(new ProcessReports)->daily();

// Met le Job dans une file spécifique nommée 'maintenance' toutes les semaines
Schedule::job(new CleanupDatabase, 'maintenance')->weekly();
```

## Planifier des Commandes Système (Shell Commands)

Vous pouvez même lancer des scripts bash externes ou d'autres langages :

```php
// Lancer un script Node.js tous les jours
Schedule::exec('node /home/user/scripts/backup.js')->daily();

// Lancer une sauvegarde brute de la BDD à 2h du matin
Schedule::exec('mysqldump mapremiere_database > backup.sql')->dailyAt('02:00');
```

## Planifier de simples Fonctions (Closures)

Pour les tout petits nettoyages, pas besoin de créer un grosse classe, une simple fonction suffit :

```php
Schedule::call(function () {
    DB::table('recent_users')->delete();
})->daily();

// Version ultra-courte (Arrow function PHP 7.4/8)
Schedule::call(fn () => cache()->flush())->weekly();
```

## Les Options de Fréquence (Schedule Frequency)

Laravel propose une syntaxe humaine magnifique pour remplacer les compliqués `* * * * *` de Cron :

```php
// Basées sur le temps court
Schedule::command('task')->everyMinute();          // Chaque minute
Schedule::command('task')->everyTwoMinutes();      // Toutes les 2 min
Schedule::command('task')->everyFiveMinutes();     // Toutes les 5 min
Schedule::command('task')->everyTenMinutes();      // Toutes les 10 min
Schedule::command('task')->everyFifteenMinutes();  // Toutes les 15 min
Schedule::command('task')->everyThirtyMinutes();   // Toutes les 30 min
Schedule::command('task')->hourly();               // À chaque heure pile (x:00)
Schedule::command('task')->hourlyAt(17);           // À chaque heure à la minute 17 (x:17)
Schedule::command('task')->everyTwoHours();        // Toutes les 2 heures

// Basées sur la journée
Schedule::command('task')->daily();                // Tous les jours à minuit
Schedule::command('task')->dailyAt('13:00');       // Tous les jours à 13h00
Schedule::command('task')->twiceDaily(1, 13);      // 2 fois par jour : à 1h00 et à 13h00

// Basées sur la semaine/mois/année
Schedule::command('task')->weekly();               // Le Dimanche à minuit
Schedule::command('task')->weeklyOn(1, '8:00');    // Le Lundi(1) à 08h00
Schedule::command('task')->monthly();              // Le 1er du mois
Schedule::command('task')->monthlyOn(4, '15:00');  // Le 4 du mois à 15h00
Schedule::command('task')->quarterly();            // Chaque trimestre
Schedule::command('task')->yearly();               // Tous les ans
Schedule::command('task')->yearlyOn(6, 1, '17:00');// Le 1er Juin (6) à 17h00

// La puissance brute (Syntaxe Cron pure)
Schedule::command('task')->cron('0 * * * *');
```

## Gérer le Fuseau Horaire (Timezone)

Parce que 9h00 du matin à Paris n'est pas 9h00 du matin à New York !

```php
Schedule::command('report:generate')
    ->timezone('Europe/Paris') // Garantit l'exécution à notre horloge vitale
    ->dailyAt('09:00');
```

## Lancer le Planificateur (Running the Scheduler)

C'est là toute la beauté du système. En production, vous n'ajoutez qu'**UNE SEULE LIGNE** de Cron sur le serveur Linux. Cette ligne demande à Laravel toutes les minutes : "As-tu des trucs de prévus pour maintenant ?".

Ouvrez le fichier Cron du serveur via `crontab -e` :

```bash
# S'exécute chaque minute, entre dans le dossier du projet, et lance schedule:run
* * * * * cd /var/www/votre-projet && php artisan schedule:run >> /dev/null 2>&1
```

### Pour le Développement Local

Pas besoin d'installer le système Cron sur votre machine Windows/Mac. Laravel propose une commande qui tourne en boucle à l'écran juste pour dev :

```bash
php artisan schedule:work  # S'endort et se réveille chaque minute pour simuler le serveur !
```

## Ressources

- [Planification de Tâches](https://laravel.com/docs/12.x/scheduling) — Documentation officielle du Laravel Scheduler

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
