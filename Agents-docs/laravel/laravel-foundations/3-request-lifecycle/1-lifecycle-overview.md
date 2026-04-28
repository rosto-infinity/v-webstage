---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-request-lifecycle-overview"
---

# Le Cycle de Vie d'une Requête Laravel

Comprendre comment Laravel traite une requête vous aide à écrire de meilleures applications et à déboguer les problèmes efficacement. Traçons le chemin d'une requête, du navigateur à la réponse.

## Le Voyage d'une Requête

```
┌───────────────────────────────────────────────────────────────┐
│                        Requête HTTP                           │
│                   GET /users?page=1                           │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ 1. Point d'Entrée : public/index.php                          │
│    - Charge l'autoloader de Composer                          │
│    - Crée l'instance de l'Application                         │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ 2. Noyau HTTP (HTTP Kernel)                                   │
│    - Charge la configuration                                  │
│    - Enregistre les Service Providers                         │
│    - Initialise (boot) les Service Providers                  │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ 3. Pipeline des Middlewares                                   │
│    - Middlewares globaux (HTTPS, mode maintenance)            │
│    - Middlewares de route (auth, limitation de requêtes)      │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ 4. Routeur                                                    │
│    - Fait correspondre l'URL à une route                      │
│    - Résout le contrôleur/la fonction anonyme (closure)       │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ 5. Contrôleur/Action                                          │
│    - Applique la logique métier (business logic)              │
│    - Retourne une réponse                                     │
└───────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────────┐
│ 6. Réponse                                                    │
│    - Repasse à travers les middlewares en sens inverse        │
│    - Envoyée au navigateur                                    │
└───────────────────────────────────────────────────────────────┘
```

## Étape 1 : Le Point d'Entrée

Chaque requête entre par `public/index.php` :

```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Enregistre l'autoloader de Composer
require __DIR__.'/../vendor/autoload.php';

// Initialise Laravel et traite la requête
(require_once __DIR__.'/../bootstrap/app.php')
    ->handleRequest(Request::capture());
```

Le fichier `bootstrap/app.php` crée l'Application :

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Configurer les middlewares ici
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Configurer la gestion des exceptions ici
    })->create();
```

## Étape 2 : Le Noyau HTTP (HTTP Kernel)

Le noyau HTTP (HTTP Kernel) initialise l'application :

1. **Charge l'environnement** (fichier `.env`)
2. **Charge la configuration** (`config/*.php`)
3. **Enregistre les Service Providers** (méthodes `register()`)
4. **Initialise les Service Providers** (méthodes `boot()`)

## Étape 3 : Le Pipeline des Middlewares

Les middlewares filtrent les requêtes avant qu'elles n'atteignent votre code :

```php
// Middlewares globaux - s'exécutent sur chaque requête
$middleware = [
    TrustProxies::class,
    PreventRequestsDuringMaintenance::class,
    ValidatePostSize::class,
    TrimStrings::class,
    ConvertEmptyStringsToNull::class,
];

// Groupe de middlewares 'web'
$middlewareGroups = [
    'web' => [
        EncryptCookies::class,
        AddQueuedCookiesToResponse::class,
        StartSession::class,
        ShareErrorsFromSession::class,
        VerifyCsrfToken::class,
        SubstituteBindings::class,
    ],
];
```

Les middlewares s'exécutent dans l'ordre :

```
Requête → M1 → M2 → M3 → Contrôleur → M3 → M2 → M1 → Réponse
```

## Étape 4 : Le Routage (Routing)

Le routeur fait correspondre l'URL à une route :

```php
// routes/web.php
Route::get('/users', [UserController::class, 'index']);

// Requête : GET /users
// Correspondance : UserController@index
```

Le routage exécute également les middlewares spécifiques à la route :

```php
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth');  // Uniquement pour les utilisateurs authentifiés
```

## Étape 5 : Le Contrôleur/L'Action

Le contrôleur gère la requête :

```php
class UserController extends Controller
{
    public function index()
    {
        $users = User::paginate(15);

        return view('users.index', ['users' => $users]);
    }
}
```

Les dépendances sont automatiquement injectées :

```php
public function store(StoreUserRequest $request)  // Validé automatiquement !
{
    User::create($request->validated());
    return redirect()->route('users.index');
}
```

## Étape 6 : La Réponse

La réponse voyage en retour à travers les middlewares :

```php
// Un middleware peut modifier les réponses
public function handle($request, Closure $next)
{
    $response = $next($request);  // Récupère la réponse depuis le contrôleur

    // Modifie la réponse
    $response->header('X-Custom-Header', 'Valeur');

    return $response;
}
```

Enfin, la réponse est envoyée au navigateur.

## Ressources

- [Cycle de Vie d'une Requête](https://laravel.com/docs/12.x/lifecycle) — Documentation officielle sur le cycle de vie des requêtes dans Laravel

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
