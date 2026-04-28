---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-environment-variables"
---

# Variables d'Environnement et Fichiers .env

Laravel utilise des variables d'environnement pour gérer les paramètres qui diffèrent entre le développement, la pré-production (staging) et la production. Cela permet de garder les informations sensibles hors de votre code source.

## Pourquoi des Variables d'Environnement ?

```
┌─────────────────────────────────────────────────────────────┐
│                    Votre Code Source                        │
│                  (gestion de version Git)                   │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  config/database.php                                   │  │
│  │  'host'     => env('DB_HOST', 'localhost')            │  │
│  │  'database' => env('DB_DATABASE', 'forge')            │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                       │
          Utilise les valeurs de l'environnement
                       │
     ┌─────────────────┴─────────────────┐
     ▼                                   ▼
┌──────────────┐                 ┌──────────────┐
│  .env (local) │                 │.env (prod)   │
│  DB_HOST=     │                 │  DB_HOST=    │
│   localhost   │                 │  prod-db.aws │
│  DB_DATABASE= │                 │  DB_DATABASE=│
│   mon_app_dev │                 │  mon_app_prod│
└──────────────┘                 └──────────────┘
```

## Le Fichier .env

Le fichier `.env` contient vos paramètres spécifiques à l'environnement :

```env
# Application
APP_NAME="Mon Application"
APP_ENV=local
APP_KEY=base64:une_cle_aleatoire_ici
APP_DEBUG=true
APP_URL=http://localhost

# Base de données
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mon_app
DB_USERNAME=root
DB_PASSWORD=secret

# E-mail
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="bonjour@example.com"
MAIL_FROM_NAME="${APP_NAME}"  # Peut référencer d'autres variables

# Services Tiers
STRIPE_KEY=sk_test_...
STRIPE_SECRET=pk_test_...
```

## Le Helper env()

Accédez aux variables d'environnement avec la fonction `env()` :

```php
// Récupérer une variable d'environnement
$debug = env('APP_DEBUG');

// Avec une valeur par défaut
$hote = env('DB_HOST', 'localhost');

// Dans les fichiers de configuration
// config/database.php
return [
    'default' => env('DB_CONNECTION', 'sqlite'),
    'connections' => [
        'mysql' => [
            'host'     => env('DB_HOST', '127.0.0.1'),
            'database' => env('DB_DATABASE', 'forge'),
            'username' => env('DB_USERNAME', 'forge'),
            'password' => env('DB_PASSWORD', ''),
        ],
    ],
];
```

## Important : N'utilisez env() QUE dans les Fichiers Config

**Ne jamais** utiliser `env()` directement dans le code de votre application (contrôleurs, modèles, etc.) :

```php
// ❌ Mauvais - Ne faites pas ça dans les contrôleurs, modèles, etc.
public function index()
{
    $cleApi = env('API_KEY');  // Peut retourner null en production !
}

// ✅ Bon - Utilisez config() à la place
public function index()
{
    $cleApi = config('services.api.key');
}

// Et définissez-le dans config/services.php
return [
    'api' => [
        'key' => env('API_KEY'),
    ],
];
```

Pourquoi ? Parce qu'en production, la configuration est mise en cache pour de meilleures performances, et les appels à `env()` en dehors des fichiers de config retourneront `null`.

## Détection de l'Environnement

Vérifier l'environnement actuel :

```php
// Utilisation de la facade App
use Illuminate\Support\Facades\App;

if (App::environment('local')) {
    // Exécution locale
}

if (App::environment(['local', 'staging'])) {
    // Local ou staging
}

// Utilisation du helper app()
if (app()->environment('production')) {
    // Environnement de production
}

// Utilisation de la config
if (config('app.env') === 'local') {
    // Environnement local
}
```

## Le Fichier .env.example

Le fichier `.env.example` est un modèle qui **doit** être présent dans votre gestion de version (Git) :

```env
# .env.example - Commité dans Git
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true

DB_CONNECTION=sqlite
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=laravel
# DB_USERNAME=root
# DB_PASSWORD=
```

Lorsqu'une personne clone votre projet, elle copie `.env.example` vers `.env` et remplit ses propres valeurs.

## Mise en Cache de la Configuration

En production, mettez la configuration en cache pour plus de performance :

```bash
# Cache toute la configuration dans un seul fichier
php artisan config:cache

# Effacer le cache
php artisan config:clear
```

**Important** : Une fois mis en cache, les appels à `env()` ne fonctionnent plus qu'à l'intérieur des fichiers de configuration !

## Différents Environnements

Vous pouvez avoir plusieurs fichiers d'environnement :

```
.env              # Par défaut (développement)
.env.local        # Surcharges locales
.env.staging      # Environnement de pré-production
.env.production   # Production (souvent défini via le serveur directement)
.env.testing      # Environnement de tests
```

Définir quel fichier utiliser :

```bash
# Utiliser un fichier d'environnement spécifique
APP_ENV=staging php artisan migrate
```

## Ressources

- [Configuration - Environnement](https://laravel.com/docs/12.x/configuration#environment-configuration) — Guide officiel sur la configuration de l'environnement

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
