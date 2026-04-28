---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-creating-first-project"
---

# Créer votre Premier Projet Laravel

Créons votre premier projet Laravel et explorons sa structure. Cette expérience pratique vous aidera à comprendre comment Laravel organise le code.

## Créer un Nouveau Projet

Avec PHP, Composer et l'installateur Laravel prêts :

```bash
# Créer un nouveau projet Laravel
laravel new mon-premier-projet
```

L'installateur vous proposera plusieurs options :

1. **Starter Kit** : Choisissez "No starter kit" pour l'instant (nous les explorerons plus tard)
2. **Testing Framework** : Choisissez "Pest" ou "PHPUnit"
3. **Database** : Choisissez "SQLite" pour la simplicité
4. **Git Repository** : "Yes" pour initialiser Git

## Structure du Projet

Laravel génère cette structure :

```
mon-premier-projet/
├── app/                    # Code de l'application
│   ├── Http/
│   │   ├── Controllers/    # Gestionnaires de requêtes (Controllers)
│   │   └── Middleware/     # Filtres de requêtes
│   ├── Models/             # Modèles Eloquent
│   └── Providers/          # Fournisseurs de services (Service Providers)
├── bootstrap/              # Initialisateurs du framework
├── config/                 # Fichiers de configuration
├── database/
│   ├── factories/          # Usines de modèles (Factories)
│   ├── migrations/         # Migrations de base de données
│   └── seeders/            # Semeurs de données (Seeders)
├── public/                 # Racine web (index.php)
├── resources/
│   ├── css/                # Fichiers CSS
│   ├── js/                 # Fichiers JavaScript
│   └── views/              # Templates Blade
├── routes/
│   ├── web.php             # Routes Web
│   └── api.php             # Routes API
├── storage/                # Logs, cache, fichiers téléversés
├── tests/                  # Fichiers de tests
├── vendor/                 # Paquets Composer
├── .env                    # Variables d'environnement
├── artisan                 # Outil CLI
├── composer.json           # Dépendances PHP
└── package.json            # Dépendances Node
```

## Comprendre les Répertoires Clés

### app/

Contient le code de votre application :

```php
// app/Models/User.php - Modèle Eloquent
class User extends Authenticatable
{
    // Définition du modèle
}

// app/Http/Controllers/UserController.php
class UserController extends Controller
{
    public function index()
    {
        return view('users.index');
    }
}
```

### config/

Fichiers de configuration pour tous les aspects de Laravel :

```
config/
├── app.php         # Paramètres de l'application
├── database.php    # Connexions aux bases de données
├── mail.php        # Configuration des e-mails
├── cache.php       # Paramètres de mise en cache
└── ...             # Et bien d'autres
```

### routes/

Définit comment les URLs sont liées aux contrôleurs :

```php
// routes/web.php
Route::get('/', function () {
    return view('welcome');
});

Route::get('/users', [UserController::class, 'index']);
```

### resources/views/

Templates Blade pour le rendu HTML :

```blade
<!-- resources/views/welcome.blade.php -->
<html>
    <head>
        <title>Laravel</title>
    </head>
    <body>
        <h1>Bienvenue sur Laravel !</h1>
    </body>
</html>
```

## Démarrer le Serveur de Développement

Laravel inclut un serveur de développement :

```bash
cd mon-premier-projet

# Démarrer tous les services (serveur, queue, vite)
composer run dev

# Ou juste le serveur PHP
php artisan serve
```

Vous verrez :

```
   INFO  Server running on [http://127.0.0.1:8000].

  Press Ctrl+C to stop the server
```

Ouvrez **http://127.0.0.1:8000** dans votre navigateur pour voir la page d'accueil de Laravel !

## Le Fichier .env

Laravel utilise des variables d'environnement pour la configuration :

```env
# .env
APP_NAME=Laravel
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=

MAIL_MAILER=log
```

**Important** : Ne commitez jamais `.env` dans votre gestion de version (Git). Utilisez `.env.example` comme modèle.

## Première Migration de Base de Données

Laravel est livré avec des migrations pour les utilisateurs et les sessions :

```bash
php artisan migrate
```

Résultat :

```
   INFO  Running migrations.

  0001_01_01_000000_create_users_table ............... 12.45ms DONE
  0001_01_01_000001_create_cache_table ............... 3.22ms DONE
  0001_01_01_000002_create_jobs_table ................ 8.91ms DONE
```

Cela crée la base de données SQLite et configure les tables par défaut.

## Ressources

- [Structure des Répertoires](https://laravel.com/docs/12.x/structure) — Documentation officielle sur la structure des répertoires de Laravel

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
