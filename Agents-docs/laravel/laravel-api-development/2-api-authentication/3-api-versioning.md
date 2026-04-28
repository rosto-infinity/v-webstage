---
source_course: "laravel-api-development"
source_lesson: "laravel-api-development-api-versioning"
---

# Versionnage d'API (API Versioning)

Le versionnage d'API vous permet d'apporter des modifications critiques (qui "cassent" la compatibilité) sans détruire les applications existantes (ou les vieux smartphones non mis à jour) qui consomment votre API. Explorons les stratégies les plus courantes.

## Versionnage par URL (Le plus courant)

La version est explicitement dans le chemin de l'URL :

```
/api/v1/posts
/api/v2/posts
```

### Organisation des Routes

```php
// routes/api.php

// Version 1 (Celle qui tourne depuis 3 ans)
Route::prefix('v1')->group(function () {
    Route::apiResource('posts', App\Http\Controllers\Api\V1\PostController::class);
    Route::apiResource('users', App\Http\Controllers\Api\V1\UserController::class);
});

// Version 2 (La nouvelle, toute belle)
Route::prefix('v2')->group(function () {
    Route::apiResource('posts', App\Http\Controllers\Api\V2\PostController::class);
    Route::apiResource('users', App\Http\Controllers\Api\V2\UserController::class);
});
```

### Organisation des Contrôleurs

Vous dupliquez (ou héritez) physiquement vos dossiers de code :

```
app/Http/Controllers/Api/
├── V1/
│   ├── PostController.php
│   └── UserController.php
├── V2/
│   ├── PostController.php
│   └── UserController.php
└── Controller.php
```

### Ressources Spécifiques par Version

Pareil pour la mise en forme JSON. Si la V1 renvoyait `"first_name"`, mais la V2 renvoie `"firstName"` :

```
app/Http/Resources/
├── V1/
│   ├── PostResource.php
│   └── UserResource.php
└── V2/
    ├── PostResource.php
    └── UserResource.php
```

## Versionnage par En-tête (Header Versioning)

Plus puriste selon les standards REST, on garde la même URL mais c'est l'En-tête `Accept` qui demande la version :

```
Accept: application/vnd.monapi.v1+json
Accept: application/vnd.monapi.v2+json
```

### Implémentation via Middleware

Vous pouvez créer un petit vérificateur :

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ApiVersion
{
    public function handle(Request $request, Closure $next, string $version)
    {
        $accept = $request->header('Accept', '');

        // Cherche le motif "application/vnd.monapi.v{CHIFFRE}+json"
        if (preg_match('/application\/vnd\.monapi\.v(\d+)\+json/', $accept, $matches)) {
            $requestedVersion = $matches[1];

            // Si le client demande la v1 mais tombe sur la route v2, on l'éjecte gentiement
            if ($requestedVersion !== $version) {
                return response()->json([
                    'error' => 'Incohérence de version API',
                    'message' => "Ce endpoint nécessite la v{$version}",
                ], 406); // 406 = Not Acceptable
            }
        }

        return $next($request);
    }
}
```

## Versionnage par Paramètre GET (Query Parameter)

```
/api/posts?version=1
/api/posts?version=2
```

_(Généralement déconseillé pour les API de production sérieuses, car c'est brouillon et peu propice à un bon système de cache)._

## Un Setup Réaliste pour le Versionnage par URL

Ne mélangez pas tout dans `api.php`. Découpez vos fichiers de routes !

```php
// Fichier : routes/api/v1.php
<?php

use App\Http\Controllers\Api\V1\PostController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\CommentController;

Route::apiResource('posts', PostController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('posts.comments', CommentController::class)->shallow();
```

```php
// Fichier : routes/api/v2.php
<?php

use App\Http\Controllers\Api\V2\PostController;
use App\Http\Controllers\Api\V2\UserController;

// Changements de la V2 : les posts ont un format JSON de réponse très différent
Route::apiResource('posts', PostController::class);
Route::apiResource('users', UserController::class);

// Nouveau point d'accès (endpoint) EXCLUSIF à la V2
Route::get('posts/{post}/related', [PostController::class, 'related']);
```

```php
// Le fichier maître : routes/api.php
<?php

// Inclure toutes les anciennes routes de la V1 intactes
Route::prefix('v1')
    ->middleware(['auth:sanctum', 'throttle:api'])
    ->group(base_path('routes/api/v1.php'));

// Inclure les toutes nouvelles routes de la V2
Route::prefix('v2')
    ->middleware(['auth:sanctum', 'throttle:api'])
    ->group(base_path('routes/api/v2.php'));

// Pour les petits malins qui oublient de préciser la version (Optionnel ou Déconseillé)
Route::middleware(['auth:sanctum', 'throttle:api'])
    ->group(base_path('routes/api/v2.php'));
```

## Contrôleurs Spécifiques à la Version (Exemple)

Regardons comment les choses évoluent :

```php
// app/Http/Controllers/Api/V1/PostController.php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\PostResource;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        // En V1, on renvoyait juste les articles basiques
        return PostResource::collection(Post::paginate(15));
    }
}
```

```php
// app/Http/Controllers/Api/V2/PostController.php
namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Resources\V2\PostResource;
use App\Models\Post;

class PostController extends Controller
{
    public function index()
    {
        // En V2 : Grosse évolution, on inclut l'auteur et on compte les commentaires !
        return PostResource::collection(
            Post::with('user')->withCount('comments')->paginate(15)
        );
    }

    // Nouveauté V2 : Retourne les articles similaires
    public function related(Post $post)
    {
        $related = Post::where('category_id', $post->category_id)
            ->where('id', '!=', $post->id)
            ->limit(5)
            ->get();

        return PostResource::collection($related);
    }
}
```

## Bonnes Pratiques

1. **Maintenez plusieurs versions simultanément** pendant les périodes de transition (1 an est courant). Surtout pour les applications mobiles téléchargées via les Stores qui traînent à faire leurs mises à jour.
2. **Documentez vos délais de dépréciation (Sunsetting)** clairement pour que vos clients sachent à l'avance quand une version s'arrêtera.
3. **Mettez le versionnage dès le J1** (`/api/v1`) — C'est toujours plus facile à faire quand la V2 arrive, que de devoir tout casser pour rajouter un `v1` au milieu.
4. **Ne sur-versionnez pas** — Un petit changement additionnel (Ajout d'un champ non-obligatoire) n'exige PAS une nouvelle version, juste un manuel à jour.
5. **Utilisez le versionnage sémantique (SemVer)** uniquement en cas de changements drastiques (La suppression/renommage d'un champ indispensable casse la v1 -> Créez la v2).

```php
// Astuce Pro : Prévenir les développeurs intégrateurs via les En-têtes (Headers) !
public function index()
{
    return PostResource::collection(Post::all())
        ->response()
        ->header('X-API-Deprecation-Date', '2025-01-01')
        ->header('X-API-Deprecation-Info', 'Veuillez migrer vers /api/v2/posts');
}
```

## Ressources

- [Groupes de Routes (Route Groups)](https://laravel.com/docs/12.x/routing#route-groups) — Bonne pratique pour le versionnage d'API.

---

> 📘 _Cette leçon fait partie du cours [Développement d'API Laravel](/laravel/laravel-api-development/) sur la plateforme d'apprentissage RostoDev._
