---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-queue-workers"
---

# Configuration des Travailleurs de File d'Attente (Queue Workers)

Les travailleurs de file d'attente (Queue workers) sont des processus longue durée (qui tournent en permanence) chargés de dépiler et d'exécuter les tâches l'une après l'autre. Une bonne configuration est absolument essentielle pour les applications en production.

## Les Commandes du Travailleur (Worker Commands)

```bash
# Lancer un travailleur de base (Utilisera la connexion par défaut du fichier .env)
php artisan queue:work

# Forcer une connexion spécifique (ex: redis) et un nom de file spécifique (ex: emails)
php artisan queue:work redis --queue=emails

# Options courantes indispensables en production :
php artisan queue:work \
    --tries=3 \           # Tenter 3 fois avant de déclarer la tâche "Échouée"
    --timeout=60 \         # Laisser maximum 60 secondes pour terminer UNE tâche
    --memory=128 \         # Redémarrer le processus si la mémoire dépasse 128Mo (Évite les fuites)
    --sleep=3 \            # S'il n'y a plus de tâches, s'endormir 3 secondes avant de revérifier la base
    --max-jobs=1000 \      # Tuer le processus après 1000 tâches (Supervisor le relancera "proprement")
    --max-time=3600        # Tuer le processus après 1 heure de fonctionnement
```

## `queue:work` vs `queue:listen`

```bash
# queue:work - Garde l'application chargée en mémoire vive (RAM) => TRÈS RAPIDE
php artisan queue:work

# queue:listen - Redémarre l'application à chaque tâche => LENT (Mais pratique en Dev)
php artisan queue:listen
```

| Mode     | Performances   | Changements de Code (Développement)                                                      |
| -------- | -------------- | ---------------------------------------------------------------------------------------- |
| `work`   | Ultras rapides | Nécessite un redémarrage manuel (`queue:restart`) pour prendre en compte le nouveau code |
| `listen` | Lentes         | Détecte automatiquement les changements de code                                          |

## Priorités des Files d'Attente

Vous pouvez forcer un travailleur à vider une file spécifique _avant_ d'en regarder une autre. L'ordre des mots-clés est crucial !

```bash
# Il videra TOUJOURS 'high' avant de regarder s'il y a quelque chose dans 'default'
php artisan queue:work --queue=high,default,low
```

Comment envoyer les tâches dans les bonnes files depuis votre code PHP ?

```php
// Envoyer dans la file prioritaire 'high'
SendUrgentEmail::dispatch($user)->onQueue('high');

// Priorité normale (va dans 'default' par défaut)
ProcessReport::dispatch($data);

// Grosse tâche très lente, à faire quand le serveur n'a plus rien d'autre à faire
CleanupOldFiles::dispatch()->onQueue('low');
```

## Configuration de Supervisor (Pour la Production)

En production, vous ne pouvez pas juste taper `php artisan queue:work` dans votre terminal et fermer la fenêtre ! Le processus s'arrêterait.
Il faut un outil Linux comme **Supervisor** pour maintenir ces processus en vie et les redémarrer s'ils plantent.

```ini
# Fichier : /etc/supervisor/conf.d/laravel-worker.conf
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/votre-site/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=8 # Important : Lancement de 8 Workers en parallèle (Accélère grandement le traitement)
redirect_stderr=true
stdout_logfile=/var/www/votre-site/storage/logs/worker.log
stopwaitsecs=3600
```

```bash
# Appliquer cette nouvelle configuration Linux
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start "laravel-worker:*"
```

## Redémarrer les Travailleurs

**Règle d'Or :** Après avoir déployé un nouveau bout de code en production, vous DEVEZ redémarrer les travailleurs, sinon ils continueront d'utiliser l'ancien code gardé en RAM !

```bash
# Redémarrage en douceur (Laisse la tâche en cours se terminer avant de mourir et d'être relancé par Supervisor)
php artisan queue:restart
```

## Gérer les Tâches Échouées (Failed Jobs)

Une tâche peut échouer (API externe en panne, bug dans le code, etc.).

```bash
# Voir la liste des tâches qui ont planté
php artisan queue:failed

# Réessayer une tâche spécifique (via son ID fourni par la commande ci-dessus)
php artisan queue:retry 5

# Réessayer TOUTES les tâches échouées d'un coup
php artisan queue:retry all

# Supprimer définitivement une tâche plantée sans la relancer
php artisan queue:forget 5

# Tout vider la corbeille !
php artisan queue:flush
```

Ces erreurs sont méticuleusement enregistrées dans la table de base de données `failed_jobs` :

```php
Schema::create('failed_jobs', function (Blueprint $table) {
    $table->id();
    $table->string('uuid')->unique();
    $table->text('connection');
    $table->text('queue');
    $table->longText('payload'); // Ce que la tâche devait faire
    $table->longText('exception'); // La grosse trace d'erreur PHP qui explique POURQUOI ça a planté
    $table->timestamp('failed_at')->useCurrent();
});
```

## Monitoring avec Laravel Horizon

Si (et seulement si) vous utilisez **Redis** pour vos files d'attentes, Laravel fournit gratuitement "Horizon", un magnifique tableau de bord visuel intégré à votre site.

```bash
composer require laravel/horizon
php artisan horizon:install
php artisan migrate
```

Ensuite, au lieu d'utiliser Supervisor pour lancer `queue:work`, vous lancerez `php artisan horizon`.
Accédez au tableau de bord visuel via la route : `votre-site.com/horizon`.

## Vérifier le "Bilan de Santé" (Health Checks)

Vous pouvez demander à Laravel de vous envoyer une alerte mail/slack si une file d'attente devient beaucoup trop longue :

```php
// Dans les tâches planifiées (par exemple dans routes/console.php)
$schedule->command('queue:monitor redis:default,redis:emails --max=100')
    ->everyMinute();
// Alertera si les files 'default' ou 'emails' dépassent 100 tâches en attente !
```

## Ressources

- [Exécuter les Queue Workers](https://laravel.com/docs/12.x/queues#running-the-queue-worker) — Documentation officielle sur les travailleurs

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
