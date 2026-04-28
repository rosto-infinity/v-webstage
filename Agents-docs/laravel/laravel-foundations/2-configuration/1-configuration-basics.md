---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-configuration-basics"
---

# Comprendre la Configuration de Laravel

Le système de configuration de Laravel est à la fois puissant et flexible. Tous les fichiers de configuration sont stockés dans le répertoire `config`, et chaque option y est documentée.

## Le Répertoire config

Laravel inclut des fichiers de configuration pour chaque fonctionnalité majeure :

```
config/
├── app.php         # Paramètres de l'application (nom, fuseau horaire, langue)
├── auth.php        # Gardes et fournisseurs d'authentification
├── cache.php       # Pilotes et paramètres de mise en cache
├── database.php    # Connexions aux bases de données
├── filesystems.php # Disques de stockage de fichiers
├── mail.php        # Paramètres de messagerie
├── queue.php       # Connexions aux files d'attente (queues)
├── services.php    # Identifiants pour les services tiers
└── session.php     # Pilote et paramètres de session
```

## Accéder aux Valeurs de Configuration

Utilisez le helper `config()` pour accéder aux valeurs de configuration :

```php
// Récupérer une valeur de configuration
$appName = config('app.name');          // 'Laravel'
$timezone = config('app.timezone');     // 'UTC'

// Configuration imbriquée
$driver = config('database.default');   // 'sqlite'

// Avec une valeur par défaut
$value = config('app.cle_perso', 'valeur_par_defaut');
```

### La Notation par Point (Dot Notation)

La configuration utilise la notation par point où :

- Le premier segment = le nom du fichier (sans .php)
- Les segments suivants = les clés du tableau

```php
// config/app.php
return [
    'name' => env('APP_NAME', 'Laravel'),
    'env' => env('APP_ENV', 'production'),
    'debug' => env('APP_DEBUG', false),
];

// Accès à ces valeurs
config('app.name');   // 'app' = fichier, 'name' = clé
config('app.debug');
```

## Définir la Configuration à l'Exécution (Runtime)

Vous pouvez définir des valeurs de configuration pendant l'exécution d'un script :

```php
// Définir une valeur unique
config(['app.timezone' => 'Europe/Paris']);

// Définir plusieurs valeurs
config([
    'app.timezone' => 'Europe/Paris',
    'app.debug' => true,
]);
```

**Note** : Les modifications de configuration faites au runtime ne durent que le temps de la requête actuelle.

## Structure de la Configuration

Chaque fichier de configuration retourne un tableau PHP :

```php
// config/app.php
<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Nom de l'Application
    |--------------------------------------------------------------------------
    |
    | Cette valeur est le nom de votre application, utilisé par le framework
    | lorsqu'il doit placer le nom de l'application dans une notification
    | ou d'autres éléments d'interface.
    |
    */

    'name' => env('APP_NAME', 'Laravel'),

    'env' => env('APP_ENV', 'production'),

    'debug' => (bool) env('APP_DEBUG', false),

    'url' => env('APP_URL', 'http://localhost'),

    'timezone' => env('APP_TIMEZONE', 'UTC'),

    'locale' => env('APP_LOCALE', 'en'),
];
```

## Le Fichier config/app.php

La configuration principale de l'application inclut :

```php
return [
    // Nom de l'application
    'name' => env('APP_NAME', 'Laravel'),

    // Environnement (local, staging, production)
    'env' => env('APP_ENV', 'production'),

    // Mode debug (affiche les erreurs détaillées)
    'debug' => (bool) env('APP_DEBUG', false),

    // URL de l'application
    'url' => env('APP_URL', 'http://localhost'),

    // Fuseau horaire pour les fonctions date de PHP
    'timezone' => env('APP_TIMEZONE', 'UTC'),

    // Langue pour les traductions
    'locale' => env('APP_LOCALE', 'en'),

    // Langue de repli (fallback)
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    // Clé de l'application (pour le chiffrement)
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
];
```

## Mode Debug

Le **mode debug** affiche des messages d'erreur détaillés avec des traces d'appels :

```php
// .env
APP_DEBUG=true   // Développement : affiche les erreurs complètes
APP_DEBUG=false  // Production : affiche une page d'erreur générique
```

**Avertissement** : N'activez JAMAIS le mode debug en production ! Cela expose des informations sensibles.

## Mode Maintenance

Laravel peut mettre votre application en mode maintenance :

```bash
# Activer le mode maintenance
php artisan down

# Avec un message personnalisé
php artisan down --message="Mise à jour de la base de données"

# Autoriser certaines adresses IP
php artisan down --allow=127.0.0.1

# Désactiver le mode maintenance
php artisan up
```

## Ressources

- [Configuration](https://laravel.com/docs/12.x/configuration) — Documentation officielle sur la configuration de Laravel

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
