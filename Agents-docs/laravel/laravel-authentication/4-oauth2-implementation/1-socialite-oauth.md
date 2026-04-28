---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-socialite-oauth"
---

# Authentification Sociale avec Socialite

Laravel Socialite fournit une interface simple et fluide (fluent interface) pour gérer l'authentification OAuth avec Facebook, Google, Twitter, GitHub, et bien d'autres fournisseurs. Plus besoin de lire des documentations d'API compliquées !

## Installation de Socialite

```bash
composer require laravel/socialite
```

## Configuration

Ajoutez vos clés d'API (identifiants) dans le fichier de configuration `config/services.php` :

```php
'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => env('GITHUB_REDIRECT_URI'),
],

'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI'),
],
```

Ajoutez ensuite les vraies valeurs dans votre fichier `.env` :

```env
GITHUB_CLIENT_ID=votre-client-id
GITHUB_CLIENT_SECRET=votre-client-secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback

GOOGLE_CLIENT_ID=votre-client-id
GOOGLE_CLIENT_SECRET=votre-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

## Le Flux OAuth (OAuth Flow)

```text
1. L'utilisateur clique sur "Se connecter avec GitHub"
   ┌──────────────────────────────────────────────┐
   │ Votre App → Redirige vers la page de GitHub  │
   └──────────────────────────────────────────────┘
                    │
                    ▼
2. L'utilisateur autorise votre application sur GitHub
   ┌──────────────────────────────────────────────┐
   │ GitHub → Affiche l'écran de consentement     │
   │ L'utilisateur clique sur "Autoriser"         │
   └──────────────────────────────────────────────┘
                    │
                    ▼
3. GitHub redirige vers vous avec un "Code" d'autorisation temporaire
   ┌──────────────────────────────────────────────┐
   │ GitHub → Redirige vers votre URL de Callback │
   │ ?code=abc123456...                           │
   └──────────────────────────────────────────────┘
                    │
                    ▼
4. Votre application échange ce code contre les données de l'utilisateur
   ┌──────────────────────────────────────────────┐
   │ Socialite::driver('github')->user()          │
   │ Retourne : nom, e-mail, avatar, id, etc.     │
   └──────────────────────────────────────────────┘
                    │
                    ▼
5. Créer un compte ou connecter l'utilisateur en base de données
   ┌──────────────────────────────────────────────┐
   │ Chercher dans 'users', le connecter (Auth)   │
   └──────────────────────────────────────────────┘
```

## Définir les Routes

```php
// routes/web.php
use App\Http\Controllers\Auth\SocialiteController;

// L'URL de départ : /auth/github -> Redirige
Route::get('/auth/{provider}', [SocialiteController::class, 'redirect'])
    ->name('socialite.redirect');

// L'URL de retour de GitHub : /auth/github/callback
Route::get('/auth/{provider}/callback', [SocialiteController::class, 'callback'])
    ->name('socialite.callback');
```

## Le Contrôleur (SocialiteController)

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    /**
     * Fournisseurs pris en charge. (Sécurité pour éviter que quelqu'un tape /auth/bidule).
     */
    protected array $providers = ['github', 'google', 'facebook'];

    /**
     * Rediriger vers le fournisseur OAuth (L'étape 1 du flux).
     */
    public function redirect(string $provider)
    {
        if (! in_array($provider, $this->providers)) {
            abort(404);
        }

        return Socialite::driver($provider)->redirect();
    }

    /**
     * Gérer le callback (retour) OAuth (Les étapes 3, 4 et 5 du flux).
     */
    public function callback(string $provider)
    {
        if (! in_array($provider, $this->providers)) {
            abort(404);
        }

        try {
            // Récupérer les données depuis l'API de Github/Google
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            // Si l'utilisateur a refusé ou qu'il y a eu un bug
            return redirect()->route('login')
                ->with('error', 'Impossible de s\'authentifier avec ' . ucfirst($provider));
        }

        // updateOrCreate va :
        // 1. Chercher un User avec le bon 'provider' et 'provider_id'
        // 2. Si non trouvé, le créer avec les informations du deuxième tableau
        $user = User::updateOrCreate(
            [
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
            ],
            [
                'name' => $socialUser->getName(),
                'email' => $socialUser->getEmail(),
                'avatar' => $socialUser->getAvatar(),
                'provider_token' => $socialUser->token,
                'provider_refresh_token' => $socialUser->refreshToken, // Utile pour taper dans les API
                'password' => bcrypt(Str::random(24)),  // Mot de passe aléatoire car géré par GitHub
            ]
        );

        // Connecter manuellement l'utilisateur dans Laravel (avec le cookie Remember Me)
        Auth::login($user, remember: true);

        return redirect()->intended('/dashboard');
    }
}
```

## Migration de Base de Données

Puisque nous stockons de nouvelles informations liées aux réseaux sociaux dans notre table des utilisateurs :

```php
// Ajouter les colonnes "Social Auth" à la table users existante
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->string('provider')->nullable();     // 'github'
        $table->string('provider_id')->nullable();  // '12345678'
        $table->string('provider_token')->nullable();
        $table->string('provider_refresh_token')->nullable();
        $table->string('avatar')->nullable();

        // Modifier la colonne password pour la rendre optionnelle (Nullable)
        $table->string('password')->nullable()->change();

        // S'assurer qu'un compte Github = Un seul utilisateur chez nous
        $table->unique(['provider', 'provider_id']);
    });
}
```

## Objet Utilisateur Socialite ($socialUser)

Indépendamment du fournisseur (Google, LinkedIn, etc.), Socialite standardise les réponses :

```php
$socialUser = Socialite::driver('github')->user();

// Données standardisées :
$socialUser->getId();           // L'ID unique chez le fournisseur
$socialUser->getNickname();     // Le pseudo (si disponible, ex: Twitter)
$socialUser->getName();         // Nom complet
$socialUser->getEmail();        // Adresse e-mail
$socialUser->getAvatar();       // URL de la photo de profil

// Jetons (Tokens) :
$socialUser->token;             // Jeton d'accès (Access token pour utiliser l'API)
$socialUser->refreshToken;      // Jeton de rafraîchissement (Refresh token)
$socialUser->expiresIn;         // Expiration du jeton (en secondes)

// Les données brutes (Raw) :
$socialUser->user;              // Le tableau JSON brut renvoyé par l'API (pratique pour des infos spécifiques)
$socialUser->user['login'];     // Accéder à des champs qui existent chez GitHub mais pas standardisés
```

## Gérer les Utilisateurs Existants Intelligemment

Que se passe-t-il si un utilisateur avait déjà créé un compte avec l'adresse `marc@gmail.com` via le formulaire "classique", et qu'un jour il clique sur "Se connecter avec Google" ? Voici comment associer les deux au lieu de planter :

```php
public function callback(string $provider)
{
    $socialUser = Socialite::driver($provider)->user();

    // 1. Vérifier si l'utilisateur existe DÉJÀ avec cet e-mail
    $existingUser = User::where('email', $socialUser->getEmail())->first();

    if ($existingUser) {
        // Lier le compte social à l'utilisateur existant
        if (! $existingUser->provider) {
            $existingUser->update([
                'provider' => $provider,
                'provider_id' => $socialUser->getId(),
            ]);
        }

        Auth::login($existingUser);
    } else {
        // Créer un tout nouvel utilisateur de zéro
        $user = User::create([
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail(),
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
        ]);

        Auth::login($user);
    }

    return redirect()->intended('/dashboard');
}
```

## Intégration dans les Vues (Blade)

```blade
<div class="social-login">
    <a href="{{ route('socialite.redirect', 'github') }}"
       class="btn btn-github">
        <svg>...</svg> Se connecter avec GitHub
    </a>

    <a href="{{ route('socialite.redirect', 'google') }}"
       class="btn btn-google">
        <svg>...</svg> Se connecter avec Google
    </a>
</div>
```

## Demander des Permissions Supplémentaires (Scopes)

Même si vous avez mis d'autres réseaux, Google et Facebook veulent savoir **pourquoi** vous voulez vous connecter !

```php
// Demander des permissions additionnelles (Scopes)
// Ex: L'autorisation de modifier des dépôts (repos) Github
return Socialite::driver('github')
    ->scopes(['read:user', 'user:email', 'repo'])
    ->redirect();

// Utilisation "Sans état" (Stateless) pour des APIs Pures (Sans cookies session PHP)
$user = Socialite::driver('github')->stateless()->user();
```

## Ressources

- [Laravel Socialite](https://laravel.com/docs/12.x/socialite) — Documentation officielle de Laravel Socialite

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
