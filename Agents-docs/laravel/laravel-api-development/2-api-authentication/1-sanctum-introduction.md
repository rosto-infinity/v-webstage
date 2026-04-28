---
source_course: "laravel-api-development"
source_lesson: "laravel-api-development-sanctum-introduction"
---

# Introduction à Laravel Sanctum

Laravel Sanctum fournit un système d'authentification poids-plume (lightweight) parfait pour les applications monopages (SPA comme Vue/React), les applications mobiles, et les API simples basées sur des jetons (Tokens).

## Quand utiliser Sanctum ?

| Cas d'Usage (Use Case)                       | Fonctionnalité de Sanctum                                     |
| -------------------------------------------- | ------------------------------------------------------------- |
| SPA Interne (React, Vue sur le même domaine) | Authentification par Cookie (Sécurisé contre les failles XSS) |
| Applications Mobiles (iOS/Android)           | Authentification par Jeton d'API (API Token)                  |
| Consommateurs d'API Tiers (Bots, Scripts)    | Authentification par Jeton d'API (API Token)                  |
| Petites API simples                          | Au choix (Les deux approches fonctionnent)                    |

_(Note : Pour des systèmes complexes avec des "Mémoriser l'appareil" ou de la délégation d'authentification "Se connecter avec Spotify", tournez-vous vers **Laravel Passport**)._

## Installer Sanctum

Sanctum est livré pré-installé avec Laravel 11+ par défaut !
Si vous devez l'installer manuellement :

```bash
# Vérifier l'installation
composer require laravel/sanctum

# Publier la configuration et les migrations de base de données
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Lancer la création de la table en BDD
php artisan migrate
```

Ceci crée la table vitale `personal_access_tokens` qui stockera vos clés secrètes.

## Authentification par Jeton d'API (API Token Authentication)

Idéal pour les applications mobiles et les services tiers.

### 1. Ajouter le Trait au Modèle `User`

Assurez-vous que votre modèle `User` peut générer des jetons :

```php
<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens; // <--- CELUI-CI
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens; // Permet de faire $user->createToken()

    // ...
}
```

### 2. Créer un Endpoint (Route) de Délivrance de Jeton

Le client mobile doit envoyer son email/mot de passe une première fois pour obtenir sa clé secrète (Token).

```php
// routes/api.php
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        // device_name est très important pour lister/révoquer les appareils plus tard (ex: "iPhone 15 Pro")
        'device_name' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    // On vérifie MANUELLEMENT le mot de passe (Hash::check) car il n'y a pas de session Web ici
    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Les identifiants fournis sont incorrects.'],
        ]);
    }

    // On génère le fameux Token incraquable et on l'envoie en Clair (plainTextToken)
    // C'est la SEULE et UNIQUE fois où ce token sera visible ! Le client mobile DOIT le stocker !
    return response()->json([
        'token' => $user->createToken($request->device_name)->plainTextToken,
        'user' => $user,
    ]);
});
```

### 3. Protéger vos Routes

Utilisez le middleware `auth:sanctum` pour bloquer les intrus.

```php
// routes/api.php
Route::middleware('auth:sanctum')->group(function () {

    // Seul un porteur de Token valide passera ici
    Route::get('/user', function (Request $request) {
        return $request->user(); // Magique : Laravel a reconnu le User à partir du token envoyé !
    });

    Route::apiResource('posts', PostController::class);
});
```

### 4. Utiliser le Jeton (Côté Client)

L'application Mobile/Vue js doit maintenant attacher cette clé dans l'en-tête (Header) **Authorization** de chaque requête HTTP, sous le nom conventionnel `Bearer` :

```bash
# Exemple de requête sécurisée via le terminal (cURL)
curl http://localhost:8000/api/user \
  -H "Authorization: Bearer 1|qwertzuiopasdfghjkl12345678" \
  -H "Accept: application/json"
```

## Capacités des Jetons (Token Abilities / Permissions)

Vous pouvez limiter ce qu'un jeton spécifique a le droit de faire. Très utile si vous générez des "Clés d'API" en lecture seule pour des clients.

```php
// Créer un jeton qui n'a que le droit "posts:read" (Lire les articles)
$token = $user->createToken('api-token', ['posts:read']);

// Créer le "Jeton Maître" de l'Admin qui a tous les droits
$token = $user->createToken('admin-token', ['*']);

// Vérifier les droits MANUELLEMENT dans un contrôleur
Route::get('/posts', function (Request $request) {
    if (! $request->user()->tokenCan('posts:read')) {
        abort(403, 'Votre jeton n\'a pas le droit de lire les articles.');
    }

    return Post::all();
});

// Vérifier AUTOMATIQUEMENT via les Middlewares (Bien plus propre !)
// Note : Nécessite d'ajouter les alias 'ability'/'abilities' dans bootstrap/app.php
Route::get('/posts', [PostController::class, 'index'])
    ->middleware(['auth:sanctum', 'ability:posts:read']);

Route::post('/posts', [PostController::class, 'store'])
    ->middleware(['auth:sanctum', 'ability:posts:write']); // Bloquera le jeton précédent !
```

## Révoquer des Jetons (Déconnexion)

Que faire quand l'utilisateur clique sur "Se déconnecter" sur son iPhone ? Vous tuez le jeton de SON iPhone.

```php
// Révoquer le jeton ACTUELLEMENT utilisé (L'iPhone qui fait la requête)
$request->user()->currentAccessToken()->delete();

// Option Nucléaire : L'utilisateur s'est fait pirater, on révoque TOUT sur TOUS ses appareils
$user->tokens()->delete();

// Révoquer un appareil précis (ex: Depuis une page "Gérer mes appareils connectés")
$user->tokens()->where('id', $tokenId)->delete();

// -- Exemple concret d'Endpoint de Déconnexion --
Route::post('/logout', function (Request $request) {
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Déconnecté avec succès']);
})->middleware('auth:sanctum'); // Il faut déjà être connecté pour se déconnecter !
```

## Expiration des Jetons

Par sécurité, vous ne voulez peut-être pas qu'un jeton soit valide à vie.
Configurez-le dans `config/sanctum.php` :

```php
// Les jetons expirent après 1 semaine (en minutes)
'expiration' => 60 * 24 * 7,

// Ou null pour des jetons valides à vie (Clés d'API permanentes)
'expiration' => null,
```

Supprimer les jetons périmés de la base de données automatiquement (pour faire de la place) :

```bash
php artisan sanctum:prune-expired

# Vous pouvez ajouter ça à votre cron journalier dans routes/console.php :
Schedule::command('sanctum:prune-expired --hours=24')->daily();
```

## Le Contrôleur d'Authentification Complet (Copier/Coller)

Voici une base solide pour démarrer n'importe quel projet d'API mobile :

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8|confirmed', // Necessite un champ password_confirmation
            'device_name' => 'required|string',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            // Hashage VITAL !
            'password' => Hash::make($validated['password']),
        ]);

        // Connecte l'utilisateur immédiatement après l'inscription locale
        return response()->json([
            'token' => $user->createToken($validated['device_name'])->plainTextToken,
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            // Empêche de deviner si c'est l'email ou le mot de passe qui est mauvais
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        return response()->json([
            'token' => $user->createToken($request->device_name)->plainTextToken,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        // Supprime la clé BDD de l'appareil courant
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function user(Request $request)
    {
        // Renvoie l'objet Utilisateur
        return response()->json($request->user());
    }
}
```

Définition des Routes `api.php` :

```php
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Zone Sécurisée
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
});
```

## Ressources

- [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum) — Documentation officielle complète.

---

> 📘 _Cette leçon fait partie du cours [Développement d'API Laravel](/laravel/laravel-api-development/) sur la plateforme d'apprentissage RostoDev._
