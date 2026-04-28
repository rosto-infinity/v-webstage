---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-artisan-cli"
---

# L'Interface en Ligne de Commande Artisan

Artisan est la puissante interface en ligne de commande de Laravel. Elle propose des dizaines de commandes utiles pour les tâches de développement courantes, et vous pouvez même créer vos propres commandes personnalisées.

## Premiers Pas avec Artisan

Lancez Artisan depuis la racine de votre projet :

```bash
# Lister toutes les commandes disponibles
php artisan list

# Obtenir de l'aide pour une commande spécifique
php artisan help migrate
```

## Commandes Artisan Essentielles

### Serveur de Développement

```bash
# Démarrer le serveur de développement
php artisan serve

# Démarrer sur un port différent
php artisan serve --port=8080

# Autoriser les connexions externes
php artisan serve --host=0.0.0.0
```

### Génération de Code

Artisan peut générer du code passe-partout (boilerplate) :

```bash
# Créer un contrôleur
php artisan make:controller UserController

# Créer un contrôleur de ressource (avec les méthodes CRUD)
php artisan make:controller PostController --resource

# Créer un modèle
php artisan make:model Post

# Créer un modèle avec migration, factory et seeder
php artisan make:model Post -mfs

# Créer une migration
php artisan make:migration create_posts_table

# Créer un middleware
php artisan make:middleware EnsureUserIsAdmin

# Créer une form request (validation)
php artisan make:request StorePostRequest

# Créer un composant Blade
php artisan make:component Alert
```

### Commandes de Base de Données

```bash
# Exécuter les migrations
php artisan migrate

# Annuler le dernier lot de migrations (batch)
php artisan migrate:rollback

# Tout annuler et tout re-migrer (Supprime les données !)
php artisan migrate:fresh

# Exécuter avec les seeders
php artisan migrate:fresh --seed

# Exécuter les seeders uniquement
php artisan db:seed

# Vérifier le statut des migrations
php artisan migrate:status
```

### Gestion du Cache

```bash
# Nettoyer tous les caches (recommandé pendant le développement)
php artisan optimize:clear

# Nettoyer des caches spécifiques
php artisan cache:clear     # Cache de l'application
php artisan config:clear    # Cache de la configuration
php artisan route:clear     # Cache des routes
php artisan view:clear      # Vues compilées

# Mettre en cache pour la production
php artisan optimize        # Met en cache la config et les routes
```

### Le Shell Interactif (Tinker)

Tinker est un REPL (Read-Eval-Print Loop) pour interagir avec votre application Laravel :

```bash
php artisan tinker
```

```php
>>> User::count()
=> 5

>>> User::create(['name' => 'Jean', 'email' => 'jean@example.com', 'password' => bcrypt('secret')])
=> App\Models\User {#4567
     name: "Jean",
     email: "jean@example.com",
     ...
   }

>>> User::where('name', 'Jean')->first()
=> App\Models\User {#4568 ...}
```

### Informations sur les Routes

```bash
# Lister toutes les routes
php artisan route:list

# Filtrer les routes
php artisan route:list --path=api
php artisan route:list --name=user
```

### Gestion des Files d'Attente (Queues)

```bash
# Traiter les jobs de la file d'attente
php artisan queue:work

# Écouter avec redémarrage automatique lors des changements de code
php artisan queue:listen

# Traiter un seul job
php artisan queue:work --once
```

## Raccourcis de Commandes

Beaucoup de commandes ont des raccourcis ou acceptent des correspondances partielles :

```bash
# Ceux-ci sont équivalents :
php artisan make:controller UserController
php artisan make:con UserController  # Correspondance partielle
```

## Créer des Commandes Personnalisées

Générer une commande :

```bash
php artisan make:command SendEmails
```

Cela crée `app/Console/Commands/SendEmails.php` :

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendEmails extends Command
{
    /**
     * Le nom et la signature de la commande de console.
     */
    protected $signature = 'mail:send {user} {--queue}';

    /**
     * La description de la commande de console.
     */
    protected $description = 'Envoyer des e-mails marketing à un utilisateur';

    /**
     * Exécuter la commande de console.
     */
    public function handle(): int
    {
        $userId = $this->argument('user');
        $shouldQueue = $this->option('queue');

        $this->info("Envoi de l'e-mail à l'utilisateur {$userId}...");

        // Logique d'envoi d'e-mail ici...

        $this->info('E-mail envoyé avec succès !');

        return Command::SUCCESS;
    }
}
```

Lancez votre commande personnalisée :

```bash
php artisan mail:send 1 --queue
```

## Sortie et Interaction

Artisan propose des méthodes de sortie utiles :

```php
public function handle()
{
    // Messages de sortie
    $this->info('Ceci est une information.');    // Vert
    $this->error('Ceci est une erreur !');        // Rouge
    $this->warn('Ceci est un avertissement.');   // Jaune
    $this->line('Texte simple.');                // Normal
    $this->newLine();                            // Ligne vide

    // Demander une saisie
    $name = $this->ask('Quel est votre nom ?');

    // Confirmation
    if ($this->confirm('Souhaitez-vous continuer ?')) {
        // ...
    }

    // Barre de progression
    $users = User::all();
    $bar = $this->output->createProgressBar(count($users));

    foreach ($users as $user) {
        // Traiter l'utilisateur...
        $bar->advance();
    }

    $bar->finish();
}
```

## Ressources

- [Console Artisan](https://laravel.com/docs/12.x/artisan) — Guide complet sur la CLI Artisan de Laravel

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
