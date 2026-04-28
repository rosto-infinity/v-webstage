---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-token-abilities"
---

# Capacités et Portées des Jetons (Token Abilities & Scopes)

Les capacités (Abilities) d'un jeton vous permettent de limiter les actions que ce jeton est autorisé à effectuer. C'est crucial pour implémenter un contrôle d'accès basé sur le principe du "moindre privilège" (Least Privilege).

## Créer des Jetons avec des Capacités

```php
// Jeton avec TOUTES les capacités (Le joker '*' donne un accès total)
$token = $user->createToken('acces-total');
// Ce jeton aura la capacité : ['*']

// Jeton avec des capacités spécifiques (Lecture seule)
$token = $user->createToken('lecture-seule', [
    'posts:read',
    'comments:read',
]);

// Jeton plus granulaire (Gestionnaire d'articles mais pas d'utilisateurs)
$token = $user->createToken('gestionnaire-articles', [
    'posts:read',
    'posts:create',
    'posts:update',
    'posts:delete',
]);
```

## Vérifier les Capacités

### Dans les Contrôleurs

La méthode `tokenCan()` sur l'instance `$request->user()` est utilisée pour vérifier si le jeton actuel possède la capacité demandée.

```php
class PostController extends Controller
{
    public function index(Request $request)
    {
        // Vérifie si le jeton a le droit de LIRE les articles
        if (! $request->user()->tokenCan('posts:read')) {
            abort(403, "Le jeton n'a pas la permission de lire les articles.");
        }

        return Post::all();
    }

    public function store(Request $request)
    {
        // Vérifie si le jeton a le droit de CRÉER des articles
        if (! $request->user()->tokenCan('posts:create')) {
            abort(403, "Le jeton n'a pas la permission de créer des articles.");
        }

        return Post::create($request->validated());
    }
}
```

### En Utilisant les Middlewares

Laravel Sanctum fournit deux middlewares très pratiques pour vérifier les capacités directement dans l'enregistrement de la route, permettant de nettoyer les contrôleurs.

Il faut d'abord s'assurer qu'ils sont enregistrés dans l'application (normalement natif depuis Laravel 11+) :

```php
// Exiger des capacités spécifiques via Middleware
Route::get('/posts', [PostController::class, 'index'])
    ->middleware(['auth:sanctum', 'ability:posts:read']); // ability (singulier) = OU

Route::post('/posts', [PostController::class, 'store'])
    ->middleware(['auth:sanctum', 'ability:posts:create']);

// Exiger N'IMPORTE LAQUELLE parmi une liste (OU)
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware(['auth:sanctum', 'ability:posts:update,posts:admin']); // Si posts:update OU posts:admin = OK

// Exiger TOUTES les capacités listées (ET) -> abilities (PLURIEL)
Route::delete('/posts/{post}', [PostController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'abilities:posts:delete,posts:admin']); // Doit avoir posts:delete ET posts:admin
```

### Différence cruciale : `ability` vs `abilities` dans le Middleware

```php
// ability (Singulier) : N'IMPORTE LAQUELLE des capacités listées (OU logique)
->middleware('ability:read,write')  // Jeton a besoin de 'read' OU 'write'

// abilities (Pluriel)  : TOUTES les capacités listées (ET logique)
->middleware('abilities:read,write')  // Jeton a besoin obligatoirement de 'read' ET 'write'
```

## Organiser ses Capacités (Bonne Pratique)

Pour éviter les fautes de frappe avec les "magic strings" (`'posts:read'`), créez une énumération (Enum) ou une classe centralisée pour vos capacités :

```php
// app/Enums/TokenAbility.php
<?php

namespace App\Enums;

class TokenAbility
{
    // Capacités pour les Articles (Posts)
    public const POSTS_READ = 'posts:read';
    public const POSTS_CREATE = 'posts:create';
    public const POSTS_UPDATE = 'posts:update';
    public const POSTS_DELETE = 'posts:delete';

    // Capacités pour les Commentaires
    public const COMMENTS_READ = 'comments:read';
    public const COMMENTS_CREATE = 'comments:create';
    public const COMMENTS_DELETE = 'comments:delete';

    // Capacités pour les Utilisateurs
    public const USERS_READ = 'users:read';
    public const USERS_UPDATE = 'users:update';

    // Groupes (Sets) prédéfinis !
    public const READ_ONLY = [
        self::POSTS_READ,
        self::COMMENTS_READ,
        self::USERS_READ,
    ];

    public const STANDARD_USER = [
        self::POSTS_READ,
        self::POSTS_CREATE,
        self::COMMENTS_READ,
        self::COMMENTS_CREATE,
        self::USERS_READ,
        self::USERS_UPDATE,
    ];

    public const ADMIN = ['*']; // Accès total
}
```

Utilisation propre de cette classe :

```php
use App\Enums\TokenAbility;

// Créer un jeton avec un groupe prédéfini
$token = $user->createToken('application-mobile', TokenAbility::STANDARD_USER);

// Vérifier une capacité sans faute de frappe possible
if ($request->user()->tokenCan(TokenAbility::POSTS_CREATE)) {
    // ...
}
```

## Expiration des Jetons

Dans le fichier `config/sanctum.php`, vous pouvez définir la durée de vie globale d'un jeton (en minutes).

```php
// Expire 7 jours plus tard
'expiration' => 60 * 24 * 7,  // 7 jours en minutes

// Ou `null` pour qu'il n'expire jamais
'expiration' => null,
```

### Nettoyer les Jetons Expirés (Pruning)

Les jetons expirés encombrent la base de données. Il faut faire le ménage :

```bash
# Supprime manuellement tous les jetons expirés
php artisan sanctum:prune-expired

# Supprime ceux qui sont expirés depuis plus de 24h (donne le temps au visiteur de se reconnecter)
php artisan sanctum:prune-expired --hours=24
```

L'idéal est de le planifier automatiquement (Cron/Task Scheduler) dans `routes/console.php` :

```php
use Illuminate\Support\Facades\Schedule;

// Tous les jours à minuit, nettoye les jetons expirés depuis un jour
Schedule::command('sanctum:prune-expired --hours=24')->daily();
```

## Gérer les Jetons de l'Utilisateur (Révocation)

```php
// Obtenir tous les jetons actifs de cet utilisateur (Collection Eloquent)
$tokens = $user->tokens;

// Obtenir le jeton actuellement utilisé pour cette requête API
$currentToken = $request->user()->currentAccessToken();

// Révoquer le jeton actuel (Déconnexion de cet appareil spécifique)
$request->user()->currentAccessToken()->delete();

// Révoquer un jeton spécifique par son ID (Déconnecter un appareil à distance)
$user->tokens()->where('id', $tokenId)->delete();

// Révoquer TOUS les jetons (Déconnexion brutale de TOUS les appareils)
$user->tokens()->delete();

// Révoquer TOUS les jetons SAUF celui actuellement utilisé ! ("Se déconnecter des autres sessions")
$user->tokens()->where('id', '!=', $currentToken->id)->delete();
```

## Exemple d'API Complète de Gestion des Jetons

Si vous voulez permettre à vos utilisateurs de générer eux-mêmes leurs clés API (comme Github ou Stripe) :

```php
// Contrôleur dédié à la gestion des Jetons Personnels
class TokenController extends Controller
{
    // Lister
    public function index(Request $request)
    {
        return $request->user()->tokens;
    }

    // Créer une clé d'API perso
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'abilities' => 'array',
            'abilities.*' => 'string',
        ]);

        $token = $request->user()->createToken(
            $validated['name'],
            $validated['abilities'] ?? ['*'] // Accès total par défaut s'il n'a rien coché
        );

        // On DOIT renvoyer le `plainTextToken` car c'est la seule fois où il sera visible !
        return response()->json([
            'token' => $token->plainTextToken,
            'abilities' => $token->accessToken->abilities, // Les capacités enregistrées
        ], 201);
    }

    // Supprimer une clé
    public function destroy(Request $request, $tokenId)
    {
        $request->user()->tokens()->where('id', $tokenId)->delete();

        return response()->json(['message' => 'Jeton révoqué avec succès']);
    }
}
```

## Ressources

- [Capacités des Jetons (Abilities)](https://laravel.com/docs/12.x/sanctum#token-abilities) — Documentation officielle Sanctum

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
