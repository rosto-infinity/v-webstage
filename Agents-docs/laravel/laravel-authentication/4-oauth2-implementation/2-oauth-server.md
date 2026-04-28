---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-passport-oauth-server"
---

# Construire un Serveur OAuth2 avec Passport

Laravel Passport fournit une implémentation complète d'un serveur OAuth2. Utilisez-le lorsque vous avez besoin de fournir un accès API OAuth2 complet à des applications tierces (comme le fait Google ou Facebook pour votre propre application).

## Quand utiliser Passport ?

- Des développeurs externes (tiers) doivent s'intégrer à votre API.
- Vous avez **absolument** besoin de Jetons de Rafraîchissement (Refresh Tokens).
- Vous avez besoin des Codes d'Autorisation OAuth2.
- Vous construisez une API que d'autres personnes vont consommer publiquement.

_Si vous n'avez pas besoin de tout cela, utilisez plutôt Laravel Sanctum._

## Installation

```bash
composer require laravel/passport

php artisan migrate

# Installe les clés de chiffrement secrètes
php artisan passport:install
```

Ajoutez le Trait au Modèle Utilisateur (`User`) :

```php
// Attention : Remplacez Laravel\Sanctum\HasApiTokens si vous l'aviez !
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;
}
```

Configurez le gardien (guard) d'authentification dans `config/auth.php` :

```php
'guards' => [
    'api' => [
        'driver' => 'passport', // Passe de 'session' ou 'sanctum' à 'passport'
        'provider' => 'users',
    ],
],
```

## Les Types d'Accords OAuth2 (Grant Types)

Passport prend en charge tous les types d'accords (Grants) de la norme OAuth2 :

### 1. Code d'Autorisation (Authorization Code Grant - Le plus courant)

C'est pour les applications web où les utilisateurs autorisent un accès tiers (ex: "Connexion avec Google").

```text
Utilisateur → Application Tierce → Votre Serveur Auth → Utilisateur Autorise →
L'Application Tierce reçoit un Code → L'échange secrètement contre un Jeton (Token)
```

### 2. Jetons d'Accès Personnels (Personal Access Tokens)

Pour que vos utilisateurs génèrent leurs propres jetons d'API (comme dans les paramètres Github).

```php
$token = $user->createToken('Nom du Jeton')->accessToken;
```

### 3. Accord par Mot de Passe (Password Grant)

Uniquement pour vos "propres" applications (ex: votre application React Native officielle) :

```bash
# Génère un "Client" spécial pour l'accès par mot de passe
php artisan passport:client --password
```

Le front-end appelle ensuite cette URL avec les vrais identifiants :

```json
// POST /oauth/token
{
  "grant_type": "password",
  "client_id": "votre-client-id-généré",
  "client_secret": "votre-client-secret",
  "username": "user@example.com",
  "password": "mot-de-passe-secret",
  "scope": ""
}
```

### 4. Authentification Inter-Serveurs (Client Credentials Grant)

Pour l'authentification machine à machine (M2M), sans aucun utilisateur humain impliqué (ex: Microservices) :

```bash
php artisan passport:client --client
```

```json
// POST /oauth/token
{
  "grant_type": "client_credentials",
  "client_id": "client-id",
  "client_secret": "client-secret",
  "scope": "read-data"
}
```

## Créer des Clients OAuth

```bash
# Création interactive d'un client (Vous demandera le nom et l'URL de retour)
php artisan passport:client

# Création de clients spécifiques (bypass les questions)
php artisan passport:client --password
php artisan passport:client --client
php artisan passport:client --personal
```

## Le Flux du Code d'Autorisation (Authorization Code Flow)

C'est le cœur de OAuth2. Voici comment l'application B se connecte chez vous (l'application A).

### Étape 1 : Rediriger vers l'Autorisation

L'application tierce redirige son utilisateur vers VOTRE site :

```text
GET /oauth/authorize?
    client_id=VOTRE_CLIENT_ID&
    redirect_uri=https://app-tierce.com/callback&
    response_type=code&
    scope=read-posts+write-posts&
    state=CHAINE_ALEATOIRE_DE_SECURITE
```

### Étape 2 : L'Utilisateur Autorise

L'utilisateur arrive sur une page de VOTRE site (générée par Passport) disant : _"L'application X veut accéder à vos articles. Acceptez-vous ?"_. S'il dit oui...

### Étape 3 : Retour (Callback) avec le Code

Vous le redirigez vers l'application tierce avec un code temporaire :

```text
https://app-tierce.com/callback?code=CODE_D_AUTORISATION&state=CHAINE_ALEATOIRE_DE_SECURITE
```

### Étape 4 : Échanger le Code contre un Jeton

Le serveur de l'application tierce contacte secrètement (en arrière-plan) VOTRE serveur pour échanger le code vulnérable contre un vrai Jeton sécurisé :

```json
// POST /oauth/token
{
  "grant_type": "authorization_code",
  "client_id": "VOTRE_CLIENT_ID",
  "client_secret": "LE_SECRET_QUE_L_APP_TIERCE_POSSEDE",
  "redirect_uri": "https://app-tierce.com/callback",
  "code": "CODE_D_AUTORISATION_RECUPERE_A_L_ETAPE_3"
}
```

Votre Réponse (Succès) :

```json
{
  "token_type": "Bearer",
  "expires_in": 31536000,
  "access_token": "eyJ0eXAiOiJKV1Q...", // Le fameux "Access Token"
  "refresh_token": "def50200..." // Le jeton pour recommencer dans un an sans redemander le code !
}
```

## Définir des Portées (Scopes)

Les scopes informent l'utilisateur des permissions exactes que l'application tierce demande.

```php
// Dans AppServiceProvider ou AuthServiceProvider
use Laravel\Passport\Passport;

public function boot(): void
{
    // Déclare toutes les permissions possibles sur votre API
    Passport::tokensCan([
        'read-posts' => 'Lire vos articles',
        'write-posts' => 'Créer et modifier vos articles',
        'delete-posts' => 'Supprimer vos articles',
        'read-profile' => 'Lire votre profil public',
        'update-profile' => 'Mettre à jour vos informations de profil',
    ]);

    // Scopes attribués par défaut si l'application tierce n'en demande aucun
    Passport::defaultScopes([
        'read-posts',
        'read-profile',
    ]);
}
```

## Protéger les Routes

```php
// Protégé par le Token OAuth classique
Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Exige un Scope (Portée) spécifique : `scope` (Singulier = OU, `scopes` = Pluriel = ET)
Route::get('/posts', [PostController::class, 'index'])
    ->middleware(['auth:api', 'scope:read-posts']);

Route::post('/posts', [PostController::class, 'store'])
    ->middleware(['auth:api', 'scopes:read-posts,write-posts']); // Doit avoir les DEUX
```

## Expiration des Jetons

Vous pouvez (et devez) définir la durée de vie de ces jetons de sécurité.

```php
// Dans AppServiceProvider
use Laravel\Passport\Passport;

public function boot(): void
{
    // Durée de vie du Jeton principal (Access Token)
    Passport::tokensExpireIn(now()->addDays(15));

    // Le Jeton de Rafraîchissement dure plus longtemps
    Passport::refreshTokensExpireIn(now()->addDays(30));

    // Les Jetons créés manuellement par les développeurs meurent au bout de 6 mois
    Passport::personalAccessTokensExpireIn(now()->addMonths(6));
}
```

## Rafraîchir un Jeton (Refresh Token)

Quand le jeton a expiré au bout de 15 jours (cf plus haut), l'application tierce n'a pas besoin de redemander à l'utilisateur de se reconnecter. Elle utilise le `refresh_token` :

```json
// POST /oauth/token
{
  "grant_type": "refresh_token",
  "refresh_token": "LE_REFRESH_TOKEN_OBTENU_LORS_DE_LA_CONNEXION",
  "client_id": "CLIENT_ID",
  "client_secret": "CLIENT_SECRET",
  "scope": ""
}
```

## Ressources

- [Laravel Passport](https://laravel.com/docs/12.x/passport) — Documentation officielle de Laravel Passport

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
