---
source_course: "laravel-routing-controllers"
source_lesson: "laravel-routing-controllers-middleware-parameters"
---

# Paramètres et Réponses de Middleware

Un middleware n'est pas limité à une simple vérification booléenne. Il peut accepter des paramètres et retourner différents types de réponses (redirection, erreur, JSON). Cela rend les middlewares extrêmement flexibles et réutilisables.

## Paramètres de Middleware

Pour passer des paramètres à un middleware dans une définition de route, utilisez les deux-points `:` :

```php
Route::get('/admin', [AdminController::class, 'index'])
    ->middleware('role:admin');

Route::get('/posts', [PostController::class, 'index'])
    ->middleware('role:editor,admin');  // Plusieurs valeurs séparées par une virgule
```

Pour récupérer ces paramètres dans la classe du middleware :

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserHasRole
{
    /**
     * Gère la requête entrante.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  // Paramètre variadique (...$roles) pour accepter plusieurs rôles
     */
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        if (! $request->user() || ! $request->user()->hasAnyRole($roles)) {
            abort(403, 'Action non autorisée.'); // Accès refusé
        }

        return $next($request); // Accès autorisé
    }
}
```

Enregistrez ce middleware avec un alias dans `bootstrap/app.php` :

```php
$middleware->alias([
    'role' => EnsureUserHasRole::class,
]);
```

## Middleware avec Plusieurs Paramètres Distints

Certains middlewares intégrés à Laravel, comme le limitateur de débit (Rate Limiter), utilisent plusieurs arguments distincts :

```php
// Définition de la route
Route::get('/api/data', [ApiController::class, 'data'])
    ->middleware('throttle:60,1');  // 60 requêtes autorisées pour 1 minute

// Structure typique du Middleware
public function handle(Request $request, Closure $next, int $maxAttempts, int $decayMinutes)
{
    // $maxAttempts = 60
    // $decayMinutes = 1
}
```

## Types Courants de Réponses de Middleware

Un middleware n'est pas contraint de laisser passer la requête ou de planter. Il peut retourner une vraie réponse HTTP propre.

### Réponse de Redirection (Redirect Response)

Pratique si l'utilisateur doit accomplir une action avant de continuer (ici, vérifier son email) :

```php
public function handle(Request $request, Closure $next)
{
    if (! $request->user()?->hasVerifiedEmail()) {
        return redirect()->route('verification.notice');
    }

    return $next($request);
}
```

### Réponse d'Abandon (Abort Response)

Arrête immédiatement l'exécution avec un code HTTP d'erreur :

```php
public function handle(Request $request, Closure $next)
{
    if ($request->user()?->isBanned()) {
        abort(403, 'Votre compte a été banni.');
    }

    return $next($request);
}
```

### Réponse JSON (idéal pour les API)

Si l'utilisateur interroge une API, mieux vaut renvoyer du JSON qu'une page HTML d'erreur :

```php
public function handle(Request $request, Closure $next)
{
    if (! $request->user()?->isSubscribed()) {
        return response()->json([
            'error' => 'Abonnement requis',
            'message' => 'Veuillez souscrire à un abonnement pour accéder à cette fonctionnalité.',
        ], 403);
    }

    return $next($request);
}
```

## Modifier la Requête Entrante

Un middleware peut injecter de la donnée dans l'objet `Request` avant de le passer au contrôleur :

```php
public function handle(Request $request, Closure $next)
{
    // Ajouter ou écraser des données de l'entrée (input)
    $request->merge(['valeur_injectee' => 'quelque_chose']);

    // Ou définir un attribut propre à la requête, accessible plus tard
    $request->attributes->set('heure_debut', microtime(true));

    return $next($request);
}
```

## Modifier la Réponse Sortante

Après l'exécution du contrôleur, le middleware peut modifier la réponse renvoyée au client :

```php
public function handle(Request $request, Closure $next)
{
    $response = $next($request); // Obtenir la réponse générée par le contrôleur

    // Ajouter des en-têtes (headers) de sécurité
    $response->header('X-Frame-Options', 'DENY');
    $response->header('X-Content-Type-Options', 'nosniff');

    return $response; // Retourner la réponse modifiée
}
```

## Terminable Middleware (Middleware de Terminaison)

Parfois, un middleware a besoin d'exécuter du code _après_ que la réponse HTTP ait déjà été envoyée au navigateur web de l'utilisateur. C'est utile pour des tâches d'arrière-plan lourdes (comme analyser le temps de réponse) sans ralentir l'utilisateur.

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogSlowRequests
{
    public function handle(Request $request, Closure $next)
    {
        $request->attributes->set('start_time', microtime(true));

        return $next($request);
    }

    /**
     * Gère les tâches à exécuter une fois la réponse HTTP envoyée.
     */
    public function terminate(Request $request, $response): void
    {
        $duration = microtime(true) - $request->attributes->get('start_time');

        if ($duration > 1.0) {  // Plus d'une seconde = requête lente
            Log::warning('Requête lente', [
                'url' => $request->fullUrl(),
                'duration' => round($duration, 2) . 's',
            ]);
        }
    }
}
```

Les middlewares de terminaison (terminable middleware) doivent souvent être enregistrés comme singleton dans `AppServiceProvider` s'ils conservent un état :

```php
// Dans AppServiceProvider.php
$this->app->singleton(LogSlowRequests::class);
```

## Exemple Pratique : Middleware de Versioning d'API

Un cas d'usage classique consiste à vérifier la version de l'API demandée :

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiVersion
{
    public function handle(Request $request, Closure $next, string $version)
    {
        // 1. Vérifier la version via l'en-tête Accept
        $acceptHeader = $request->header('Accept', '');

        if (str_contains($acceptHeader, "application/vnd.api.v{$version}")) {
            return $next($request);
        }

        // 2. Vérifier la version dans l'URL (ex: /api/v1/...)
        if ($request->segment(2) === "v{$version}") {
            return $next($request);
        }

        // Si aucune correspondance
        return response()->json([
            'error' => 'Incohérence de version d\'API',
            'expected' => $version,
        ], 400);
    }
}

// Utilisation dans web.php ou api.php
Route::prefix('api/v1')
    ->middleware('api.version:1') // Demande explicitement la version 1
    ->group(function () {
        // ... vos routes v1
    });
```

## Ressources

- [Paramètres de Middleware](https://laravel.com/docs/12.x/middleware#middleware-parameters) — Documentation officielle sur les paramètres de middlewares.

---

> 📘 _Cette leçon fait partie du cours [Routage & Contrôleurs Laravel](/laravel/laravel-routing-controllers/) sur la plateforme d'apprentissage RostoDev._
