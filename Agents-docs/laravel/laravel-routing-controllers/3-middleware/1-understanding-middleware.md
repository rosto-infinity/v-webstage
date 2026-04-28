---
source_course: "laravel-routing-controllers"
source_lesson: "laravel-routing-controllers-understanding-middleware"
---

# Comprendre les Middlewares

Les middlewares fournissent un mécanisme pour examiner, filtrer et modifier les requêtes HTTP entrant dans votre application. Imaginez les middlewares comme une série de "couches" ou de "filtres" que les requêtes doivent traverser avant d'atteindre le cœur de votre application.

## Qu'est-ce qu'un Middleware ?

Un middleware agit comme un gardien ou un poste de contrôle :

```
                    Requête HTTP
                        │
                        ▼
               ┌────────────────┐
               │  Middleware 1  │  Vérifier si l'utilisateur est authentifié
               └────────────────┘
                        │
                        ▼
               ┌────────────────┐
               │  Middleware 2  │  Vérifier le jeton CSRF
               └────────────────┘
                        │
                        ▼
               ┌────────────────┐
               │  Middleware 3  │  Enregistrer (log) la requête
               └────────────────┘
                        │
                        ▼
               ┌────────────────┐
               │  Contrôleur    │  Traiter la requête et générer la vue
               └────────────────┘
                        │
                        ▼
                     Réponse HTTP
```

Utilisations courantes des middlewares :

- **Authentification** : Cet utilisateur est-il connecté ?
- **Autorisation** : Cet utilisateur a-t-il le droit d'accéder à cette ressource ?
- **Protection CSRF** : S'agit-il d'une soumission de formulaire légitime ?
- **Limitation de Débit (Rate Limiting)** : Cet utilisateur fait-il trop de requêtes à la seconde ?
- **Journalisation (Logging)** : Enregistrer les informations de la requête.
- **CORS (Cross-Origin Resource Sharing)** : Ajouter les en-têtes HTTP pour autoriser les requêtes depuis d'autres domaines.

## Créer un Middleware

```bash
php artisan make:middleware EnsureUserIsAdmin
```

Ceci crée le fichier `app/Http/Middleware/EnsureUserIsAdmin.php` :

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Gère la requête entrante.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // On vérifie si l'utilisateur est admin
        if (! $request->user()?->isAdmin()) {
            // Si non, on le redirige vers l'accueil
            return redirect('home');
        }

        // Si oui, on laisse la requête continuer son chemin
        return $next($request);
    }
}
```

## Le Flux d'Exécution d'un Middleware

La fonction anonyme `$next` (Closure) passe la requête HTTP à la couche suivante :

```php
public function handle(Request $request, Closure $next): Response
{
    // AVANT : Ce code s'exécute avant le contrôleur
    $startTime = microtime(true);

    // Passe la requête au prochain middleware (atteignant finalement le contrôleur)
    $response = $next($request);

    // APRÈS : Ce code s'exécute après le calcul de la réponse par le contrôleur
    $duration = microtime(true) - $startTime;
    Log::info("La requête a pris {$duration} secondes");

    return $response; // On retourne la réponse HTTP modifiée ou non
}
```

## Middleware Avant (Before) vs Middleware Après (After)

### Middleware "Avant" (Before Middleware)

Effectue des actions avant que le contrôleur ne soit atteint :

```php
public function handle(Request $request, Closure $next): Response
{
    // Exécuter l'action AVANT que la requête ne soit traitée
    if ($this->isBlacklisted($request->ip())) {
        abort(403);
    }

    return $next($request);
}
```

### Middleware "Après" (After Middleware)

Effectue des actions après que le contrôleur a généré la réponse :

```php
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request);

    // Exécuter l'action APRÈS que la requête a été traitée
    // Exemple : Ajouter un en-tête personnalisé à la réponse
    $response->header('X-Custom-Header', 'ValeurPersonnalisée');

    return $response;
}
```

## Enregistrer les Middlewares

Vous pouvez configurer et enregistrer vos middlewares dans le fichier `bootstrap/app.php` :

```php
use App\Http\Middleware\EnsureUserIsAdmin;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        // Créer un alias (raccourci) pour le middleware
        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
        ]);
    })
    ->create();
```

## Assigner des Middlewares aux Routes

```php
// Un seul middleware
Route::get('/admin', [AdminController::class, 'index'])
    ->middleware('admin');

// Plusieurs middlewares
Route::get('/admin/users', [AdminController::class, 'users'])
    ->middleware(['auth', 'admin']);

// Appliqué à tout un groupe de routes
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', ...);
    Route::get('/admin/settings', ...);
});

// Assigner directement le nom de la classe
Route::get('/profile', fn() => ...)->middleware(EnsureUserIsAdmin::class);
```

## Exclure un Middleware

```php
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', ...); // Protégé par auth

    // Exclure ce middleware spécifique pour cette route
    Route::get('/public-page', ...)->withoutMiddleware(['auth']);
});
```

## Middlewares Globaux

Exécute un middleware à chaque requête HTTP, sans exception :

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->append(LogRequests::class);  // L'ajouter à la FIN de la liste
    $middleware->prepend(StartTimer::class);  // L'ajouter au DÉBUT de la liste
})
```

## Groupes de Middlewares

Laravel inclut deux groupes par défaut :

```php
// Le groupe 'web' (gère les sessions, les cookies, la protection CSRF)
$middleware->group('web', [
    EncryptCookies::class,
    AddQueuedCookiesToResponse::class,
    StartSession::class,
    ShareErrorsFromSession::class,
    VerifyCsrfToken::class,
    SubstituteBindings::class, // Active le Route Model Binding
]);

// Le groupe 'api' (sans état / stateless)
$middleware->group('api', [
    'throttle:api', // Limitation du nombre de requêtes pour l'API
    SubstituteBindings::class,
]);
```

## Ressources

- [Middleware](https://laravel.com/docs/12.x/middleware) — Documentation officielle de Laravel sur les middlewares

---

> 📘 _Cette leçon fait partie du cours [Routage & Contrôleurs Laravel](/laravel/laravel-routing-controllers/) sur la plateforme d'apprentissage RostoDev._
