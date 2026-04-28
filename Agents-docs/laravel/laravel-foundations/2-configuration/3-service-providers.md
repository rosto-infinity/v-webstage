---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-service-providers"
---

# Fournisseurs de Services (Service Providers) et Initialisation

Les fournisseurs de services (Service Providers) sont l'endroit central pour configurer et initialiser votre application Laravel. Chaque fonctionnalité majeure de Laravel est initialisée via un fournisseur de services.

## Que sont les Service Providers ?

Les fournisseurs de services sont des classes chargées de :

1. **Enregistrer** des éléments dans le conteneur de services (service container)
2. **Initialiser** (boot) l'application avec la configuration nécessaire

```
Processus d'Initialisation de Laravel
┌─────────────────────────────────────────┐
│  1. Charger la Configuration            │
│  2. Enregistrer les Service Providers   │
│     - méthode register() appelée        │
│  3. Initialiser les Service Providers   │
│     - méthode boot() appelée            │
│  4. Traiter la Requête                  │
└─────────────────────────────────────────┘
```

## Créer un Service Provider

Générer un nouveau fournisseur :

```bash
php artisan make:provider RiakServiceProvider
```

Cela crée `app/Providers/RiakServiceProvider.php` :

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RiakServiceProvider extends ServiceProvider
{
    /**
     * Enregistrer tous les services de l'application.
     */
    public function register(): void
    {
        // Lier des services au conteneur (container binding)
    }

    /**
     * Initialiser tous les services de l'application.
     */
    public function boot(): void
    {
        // S'exécute après que tous les fournisseurs ont été enregistrés
    }
}
```

## La Méthode register()

Utilisez `register()` pour lier des éléments dans le conteneur de services :

```php
public function register(): void
{
    // Lier une classe
    $this->app->bind(PaymentGateway::class, function ($app) {
        return new StripeGateway(config('services.stripe.key'));
    });

    // Lier un singleton (une seule instance partagée)
    $this->app->singleton(ReportGenerator::class, function ($app) {
        return new ReportGenerator();
    });
}
```

**Règle** : On ne fait que des liaisons (bindings) dans `register()`. N'utilisez pas d'autres services ici — ils pourraient ne pas être encore enregistrés.

## La Méthode boot()

Utilisez `boot()` après que tous les fournisseurs ont été enregistrés :

```php
public function boot(): void
{
    // Configurer des view composers
    View::composer('dashboard', function ($view) {
        $view->with('notifications', auth()->user()->notifications);
    });

    // Enregistrer des règles de validation personnalisées
    Validator::extend('telephone', function ($attribute, $value) {
        return preg_match('/^[0-9]{10}$/', $value);
    });

    // Publier les ressources d'un paquet (package assets)
    $this->publishes([
        __DIR__.'/../config/package.php' => config_path('package.php'),
    ]);
}
```

## Service Providers Intégrés

Laravel inclut plusieurs fournisseurs dans `bootstrap/providers.php` :

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
];
```

Laravel 12 utilise la découverte automatique de paquets (package discovery), donc la plupart des fournisseurs sont chargés automatiquement.

## L'AppServiceProvider

Votre fournisseur principal d'application se trouve dans `app/Providers/AppServiceProvider.php` :

```php
<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;
use Illuminate\Pagination\Paginator;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Enregistrer les liaisons de l'application
    }

    public function boot(): void
    {
        // Forcer le HTTPS en production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // Utiliser Bootstrap pour la pagination
        Paginator::useBootstrap();

        // Paramétrage personnalisé du modèle
        Model::preventLazyLoading(! $this->app->isProduction());
    }
}
```

## Enregistrer votre Fournisseur

Ajoutez vos fournisseurs personnalisés dans `bootstrap/providers.php` :

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\RiakServiceProvider::class,  // Ajoutez votre fournisseur ici
];
```

## Fournisseurs Différés (Deferred Providers)

Pour de meilleures performances, différez le chargement jusqu'à ce qu'il soit nécessaire :

```php
<?php

namespace App\Providers;

use App\Services\Riak\Connection;
use Illuminate\Contracts\Support\DeferrableProvider;
use Illuminate\Support\ServiceProvider;

class RiakServiceProvider extends ServiceProvider implements DeferrableProvider
{
    public function register(): void
    {
        $this->app->singleton(Connection::class, function () {
            return new Connection(config('riak'));
        });
    }

    /**
     * Récupère les services fournis par le fournisseur.
     */
    public function provides(): array
    {
        return [Connection::class];
    }
}
```

## Le Conteneur de Services (Service Container)

Les fournisseurs de services travaillent avec le conteneur de services de Laravel. Le conteneur gère les dépendances des classes et effectue l'injection de dépendances.

```php
// Lorsque vous indiquez le type d'une classe (type-hint), Laravel la résout depuis le conteneur
class UserController extends Controller
{
    public function __construct(
        private PaymentGateway $gateway  // Injecté automatiquement !
    ) {}

    public function charge()
    {
        $this->gateway->charge(100);
    }
}
```

## Ressources

- [Fournisseurs de Services](https://laravel.com/docs/12.x/providers) — Documentation officielle sur les service providers
- [Conteneur de Services](https://laravel.com/docs/12.x/container) — Comprendre le conteneur d'injection de dépendances de Laravel

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
