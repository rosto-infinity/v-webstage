---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-sanctum-fundamentals"
---

# Les Fondamentaux de Laravel Sanctum

Laravel Sanctum fournit un système d'authentification poids plume pour les SPA (Single Page Applications - ex: React/Vue), les applications mobiles, et les API simples basées sur des jetons (tokens). C'est la solution incontournable pour la quasi-totalité des besoins d'authentification API avec Laravel.

## Quand utiliser Sanctum ?

| Cas d'Usage                       | Fonctionnalité Sanctum                                            |
| --------------------------------- | ----------------------------------------------------------------- |
| SPA interne (React, Vue, Angular) | Authentification de session basée sur les Cookies (très sécurisé) |
| Applications Mobiles              | Authentification par Jeton API (API token)                        |
| Clients d'API tiers (Third-party) | Authentification par Jeton API                                    |
| Authentification API simple       | N'importe quelle des deux approches                               |

## Sanctum vs Passport

Il existe deux paquets officiels pour les requêtes API dans Laravel :

```text
┌─────────────────────────────────────────────────────────────────┐
│                     SANCTUM (Le plus courant)                   │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Très léger                                                    │
│ ✓ Jetons d'API (Tokens) simples                                 │
│ ✓ Authentification SPA avec de vrais cookies sécurisés          │
│ ✓ Pas la complexité du protocole OAuth2                         │
│ ✓ Parfait pour vos propres applications ("First-party")         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     PASSPORT (Pour les pros)                    │
├─────────────────────────────────────────────────────────────────┤
│ ✓ Implémentation complète d'un serveur OAuth2 (Comme Google/FB) │
│ ✓ Codes d'autorisation, Jetons de rafraîchissement              │
│ ✓ Authentification serveur à serveur (Client credentials)       │
│ ✓ Parfait si vous offrez une API pour créer des apps tierces    │
│ ✗ Mise en place nettement plus complexe                         │
└─────────────────────────────────────────────────────────────────┘
```

**Règle d'or** : Utilisez _Sanctum_ à moins que vous n'ayez spécifiquement besoin de la norme OAuth2.

## Installer Sanctum

Sanctum est pré-installé dans les nouvelles applications Laravel (si vous choisissez l'option API lors de la création). Si vous devez l'installer manuellement :

```bash
composer require laravel/sanctum

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

php artisan migrate
```

Ceci crée la table de base de données `personal_access_tokens` chargée de stocker temporairement les jetons.

## Configuration du Modèle Utilisateur

Ajoutez le trait `HasApiTokens` (A des Jetons API) à votre modèle `User` :

```php
<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    // C'est HasApiTokens qui va donner la méthode createToken() à l'utilisateur
    use HasApiTokens, Notifiable;

    // ...
}
```

## Comment fonctionne l'Authentification par Jeton ?

```text
1. L'utilisateur se connecte avec ses identifiants classiques depuis le mobile
   ┌─────────────────────────────────────────────┐
   │ POST /api/login                             │
   │ { "email": "...", "password": "..." }       │
   └─────────────────────────────────────────────┘
                     │
                     ▼
2. Le serveur valide ce mot de passe et génère un jeton
   ┌─────────────────────────────────────────────┐
   │ $user->createToken('iphone-marc')           │
   │ Retourne : { "token": "1|abc123..." }       │
   └─────────────────────────────────────────────┘
                     │
                     ▼
3. Le téléphone stocke ce jeton et l'envoie à CHAQUE future requête
   ┌─────────────────────────────────────────────┐
   │ GET /api/user                               │
   │ Header : Authorization: Bearer 1|abc123...  │
   └─────────────────────────────────────────────┘
                     │
                     ▼
4. Le serveur valide ce jeton et agit en tant qu'utilisateur connecté
   ┌─────────────────────────────────────────────┐
   │ auth('sanctum')->user() retourne le $user   │
   └─────────────────────────────────────────────┘
```

## Créer des Jetons (Tokens)

```php
// Création d'un jeton simple (Le nom est indicatif, souvent le nom de l'appareil)
$token = $user->createToken('iphone-marc');

// /!\ IMPORTANT : plainTextToken est L'UNIQUE moment où vous pourrez lire le jeton en clair !
$plainTextToken = $token->plainTextToken;  // Renvoie "1|abc123..." à renvoyer au client Vue3 / React Native

// Jeton avec des capacités (Permissions/Abilities)
$token = $user->createToken('clef-api-developpeur', ['posts:read', 'posts:write']);

// Pour les règles d'expiration, elles se configurent globalement dans config/sanctum.php
// 'expiration' => 525600, // Durée de vie en minutes
```

## Stockage des Jetons

Les jetons sont stockés de manière sécurisée (hashés au format SHA-256) dans la table `personal_access_tokens` :

```sql
| id | tokenable_type  | tokenable_id | name        | token (haché)    | abilities   |
|----|-----------------|--------------|-------------|------------------|-------------|
| 1  | App\Models\User | 5            | iphone-marc | 7f3a8b2c...      | ["*"]       |
| 2  | App\Models\User | 5            | ipad-salon  | 9e4d1f5a...      | ["read"]    |
```

## Exemple Complet de Contrôleur d'Authentification API

```php
// routes/api.php
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Seulement ceux ayant un TOKEN valide peuvent accéder à ces routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

```php
// app/Http/Controllers/Api/AuthController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required', // Demande explicitement le nom de l'appareil
        ]);

        $user = User::where('email', $request->email)->first();

        // Si l'utilisateur n'existe pas ou que le mot de passe est faux
        if (! $user || ! Hash::check($request->password, $user->password)) {
            // Renvoie automatiquement une erreur HTTP 422 Unprocessable Entity
            throw ValidationException::withMessages([
                'email' => ['Les identifiants fournis sont incorrects.'],
            ]);
        }

        // Succès ! On crée la clef.
        return response()->json([
            'user' => $user,
            'token' => $user->createToken($request->device_name)->plainTextToken,
        ]);
    }

    public function user(Request $request)
    {
        // Retournera l'objet $user correspondant au token fourni dans le Header de la requête
        return $request->user();
    }

    public function logout(Request $request)
    {
        // Détruit UNIQUEMENT le jeton utilisé pour faire cette requête (Déconnecte ce téléphone)
        $request->user()->currentAccessToken()->delete();

        // Note: Pour déconnecter TOUS ses appareils : $request->user()->tokens()->delete();

        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}
```

## Protéger vos Routes API de manière classique

C'est exactement comme l'authentification web standard, mais avec le suffixe `sanctum` :

```php
// Protégé par Sanctum (Exige le Header "Authorization: Bearer <token>")
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
});
```

## Ressources

- [Laravel Sanctum](https://laravel.com/docs/12.x/sanctum) — Documentation officielle de Laravel Sanctum

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
