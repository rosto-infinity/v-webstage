---
source_course: "laravel-routing-controllers"
source_lesson: "laravel-routing-controllers-built-in-middleware"
---

# Les Middlewares Intégrés de Laravel

Laravel inclut nativement ("out of the box") plusieurs middlewares qui gèrent les besoins courants des applications web. Les comprendre vous aide à construire des applications sécurisées et robustes.

## Middleware d'Authentification (auth)

Le middleware `auth` redirige les utilisateurs non connectés (invités) vers la page de connexion :

```php
// Nécessite d'être authentifié
Route::get('/dashboard', DashboardController::class)
    ->middleware('auth');

// Spécifier un gardien d'authentification (guard) particulier
Route::get('/admin', AdminController::class)
    ->middleware('auth:admin');

// Vérifier sur plusieurs gardes
Route::get('/api/user', fn() => auth()->user())
    ->middleware('auth:sanctum,api');
```

## Middleware pour Invités (guest)

Le middleware `guest` redirige les utilisateurs _déjà authentifiés_ (qui essaient par exemple d'accéder à la page de connexion) :

```php
// Uniquement pour les invités (non connectés)
Route::get('/login', [LoginController::class, 'showLoginForm'])
    ->middleware('guest');

Route::get('/register', [RegisterController::class, 'showRegistrationForm'])
    ->middleware('guest');
```

## Middleware de Limitation de Débit (throttle)

Empêchez les abus avec la limitation du taux de requêtes (rate limiting) :

```php
// 60 requêtes autorisées par minute
Route::get('/api/data', DataController::class)
    ->middleware('throttle:60,1');

// Limitateur nommé
Route::get('/api/data', DataController::class)
    ->middleware('throttle:api');
```

Définissez des limitateurs personnalisés dans `AppServiceProvider` :

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    // Limite standard pour l'API
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    // Limite différente selon le type d'utilisateur
    RateLimiter::for('uploads', function (Request $request) {
        return $request->user()?->isPremium()
            ? Limit::none() // Illimité pour les premiums
            : Limit::perMinute(10)->by($request->user()->id); // 10/min pour les autres
    });
}
```

## Protection CSRF (VerifyCsrfToken)

Le middleware `VerifyCsrfToken` protège contre les failles CSRF (Cross-Site Request Forgery) :

```blade
<!-- Inclure le jeton CSRF dans vos formulaires -->
<form method="POST" action="/users">
    @csrf  <!-- Ajoute automatiquement un champ caché _token -->
    <input type="text" name="name">
    <button type="submit">Envoyer</button>
</form>
```

Exclure certaines routes de la protection CSRF (comme les Webhooks) :

```php
// Dans bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'stripe/*',
        'webhook/*',
    ]);
})
```

## Middleware d'URL Signée (signed)

Valider que les URL signées n'ont pas été modifiées :

```php
// 1. Générer une URL signée
$url = URL::signedRoute('unsubscribe', ['user' => 1]);

// 2. Valider avec le middleware
Route::get('/unsubscribe/{user}', [UnsubscribeController::class, 'handle'])
    ->name('unsubscribe')
    ->middleware('signed');
```

## Middleware de Confirmation de Mot de Passe (password.confirm)

Exiger la saisie à nouveau du mot de passe pour des actions sensibles :

```php
Route::get('/settings/security', [SecurityController::class, 'index'])
    ->middleware(['auth', 'password.confirm']);

// L'utilisateur doit confirmer son mot de passe s'il l'a fait il y a plus de 3 heures (par défaut)
```

## Middleware d'Email Vérifié (verified)

```php
Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified']);

// Les utilisateurs non vérifiés sont redirigés vers la vue invitant à vérifier leur email
```

## Middleware de Mode Maintenance

`PreventRequestsDuringMaintenance` redirige tout le monde vers la page de maintenance :

```bash
# Activer le mode maintenance
php artisan down

# Autoriser des IP spécifiques
php artisan down --allow=192.168.1.1

# Avec un jeton secret pour contourner la maintenance
php artisan down --secret="jeton-secret-bypass"
# Visitez /jeton-secret-bypass dans le navigateur pour obtenir un cookie qui ignore la maintenance
```

## Middleware d'En-têtes de Cache (cache.headers)

Ajouter des en-têtes de mise en cache HTTP aux réponses :

```php
Route::get('/static-page', StaticController::class)
    ->middleware('cache.headers:public;max_age=2628000;etag');
```

## Exemple Pratique : Combiner les Middlewares

```php
// Routes API avec plusieurs protections
Route::prefix('api/v1')
    ->middleware(['api', 'auth:sanctum', 'throttle:api'])
    ->group(function () {
        Route::get('/user', fn(Request $request) => $request->user());

        Route::apiResource('posts', PostController::class);

        // Fonctionnalités premium avec une limitation différente
        Route::middleware('throttle:premium')
            ->group(function () {
                Route::post('/analyze', AnalyzeController::class);
            });
    });

// Routes Admin avec plusieurs gardiens
Route::prefix('admin')
    ->middleware(['auth', 'verified', 'password.confirm'])
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        // Protection supplémentaire pour les actions dangereuses
        Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])
            ->middleware('can:delete-users');
    });
```

## Ressources

- [Protection CSRF](https://laravel.com/docs/12.x/csrf) — Documentation officielle sur la protection CSRF
- [Limitation de Débit (Rate Limiting)](https://laravel.com/docs/12.x/routing#rate-limiting) — Documentation officielle sur le limitateur de requêtes

---

> 📘 _Cette leçon fait partie du cours [Routage & Contrôleurs Laravel](/laravel/laravel-routing-controllers/) sur la plateforme d'apprentissage RostoDev._
