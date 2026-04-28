---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-understanding-auth"
---

# Comprendre l'Authentification de Laravel

L'authentification est le processus qui permet de vérifier **qui** est un utilisateur. Laravel fournit un système d'authentification robuste et prêt à l'emploi (out of the box), gérant tout, des formulaires de connexion classiques aux jetons d'API (API tokens).

## Authentification vs Autorisation

```text
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTIFICATION (Authentication)           │
│               "Qui êtes-vous ?"                                 │
│                                                                 │
│    Identifiants (Login) → Vérifier l'identité → Créer session   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AUTORISATION (Authorization)                │
│               "Que pouvez-vous faire ?"                         │
│                                                                 │
│    Vérifier les permissions → Autoriser/Refuser l'accès → Action│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

- **Authentification** : Vérification de l'identité (Connexion/Déconnexion). Suis-je connecté au site ?
- **Autorisation** : Contrôle de l'accès (Permissions, Rôles). Ai-je le droit de supprimer cet article ?

## Architecture de l'Authentification Laravel

### Les Gardiens (Guards)

Les _Guards_ définissent **comment** les utilisateurs sont authentifiés pour chaque type de requête entrante :

```php
// config/auth.php
'guards' => [
    'web' => [
        'driver' => 'session',      // Utilise les Cookies/Sessions traditionnels
        'provider' => 'users',
    ],
    'api' => [
        'driver' => 'sanctum',      // Utilise des Jetons (Tokens) pour les API Rest
        'provider' => 'users',
    ],
],
```

### Les Fournisseurs (Providers)

Les _Providers_ définissent **d'où** proviennent les données des utilisateurs (comment aller les chercher) :

```php
// config/auth.php
'providers' => [
    'users' => [
        'driver' => 'eloquent',     // Utilise l'ORM Eloquent et les Modèles intelligents
        'model' => App\Models\User::class,
    ],
    // Il est aussi possible d'utiliser directement le Query Builder sans Modèle
    'legacy_users' => [
        'driver' => 'database',
        'table' => 'users',
    ],
],
```

## Le Modèle User Par Défaut

Dès son installation, Laravel inclut un modèle `User` pré-configuré avec les _Traits_ d'authentification nécessaires :

```php
<?php

namespace App\Models;

// Hérite d'un modèle "Authenticatable" au lieu d'un modèle Eloquent classique
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    // Ces champs n'apparaîtront JAMAIS lors des exports d'Arrays ou de JSON (Sécurité !)
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',  // Hashage automatique du mot de passe lors de sa sauvegarde
        ];
    }
}
```

## Flux Basique d'Authentification (Flow)

```text
1. L'utilisateur soumet son formulaire de connexion (Email + Mot de passe)
                 │
                 ▼
2. La méthode Auth::attempt() vérifie ces identifiants en base de données
                 │
                 ▼
3. Si c'est valide → Le serveur crée une session ET renvoie un "Cookie" chiffré au navigateur
   Si c'est invalide → Renvoie une erreur de connexion
                 │
                 ▼
4. Pour toutes les requêtes suivantes :
   Le navigateur renvoie le Cookie automatiquement → Laravel lit la session correspondante → Le serveur sait qui vous êtes
```

## Accéder à l'Utilisateur Connecté

C'est l'une des actions que vous ferez le plus souvent en développant.

```php
// En utilisant la Facade Auth (Traditionnel)
use Illuminate\Support\Facades\Auth;

$user = Auth::user();      // Récupère l'instance du Modèle User (ou null si invité)
$id = Auth::id();          // Récupère juste l'ID de l'utilisateur (ou null)
$check = Auth::check();    // Renvoie true si quelqu'un est connecté
$guest = Auth::guest();    // Renvoie true si personne n'est connecté (l'inverse de check)

// En utilisant la fonction helper globale (Moderne et rapide)
$user = auth()->user();
$id = auth()->id();

// En passant par l'objet Request (Très performant dans les contrôleurs)
public function index(Request $request)
{
    $user = $request->user();  // Identique à Auth::user()
}
```

Dans les vues HTML / **Blade** :

```html
<!-- La directive @auth s'affiche UNIQUEMENT si connecté -->
@auth
<p>Bienvenue, {{ auth()->user()->name }} !</p>
@endauth

<!-- La directive @guest s'affiche UNIQUEMENT si NON-connecté -->
@guest
<a href="/login">Se connecter</a>
@endguest
```

## Le Hashage (Hashing) du Mot de Passe

Il est formellement interdit (et c'est une hérésie totale en sécurité) de stocker un mot de passe en texte brut dans une base de données. Laravel s'occupe de faire un cryptage unidirectionnel sécurisé (généralement Bcrypt ou Argon2).

```php
use Illuminate\Support\Facades\Hash;

// Hacher manuellement un mot de passe
$hashed = Hash::make('mon-super-mot-de-passe');

// La méthode Hash::check vérifie si un mot de passe classique donné en formulaire correspond au Hash en base
if (Hash::check('password', $hashedPassword)) {
    // Les mots de passe correspondent !
}

// 🪄 Magie : Le Casting d'attribut 'hashed' (Laravel 10+) s'occupe de tout
class User extends Authenticatable
{
    protected function casts(): array
    {
        return [
            'password' => 'hashed',  // S'auto-hache lors de l'assignation en PHP
        ];
    }
}

// Maintenant vous pouvez faire cela en toute sécurité :
$user->password = 'nouveau_mdp';  // Il sera automatiquement stocké haché en BDD crypté comme "$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoE..."
```

## Kits de Démarrage (Starter Kits)

Bien qu'il soit essentiel de comprendre comment marche l'authentification (ce sera l'objet du chapitre sur l'authentification manuelle), dans le monde réel, vous ne devriez **jamais** redévelopper tout un système d'authentification vous-même. Laravel propose des Starter Kits robustes pour la production.

### Laravel Breeze

Le kit de base, minimaliste, générant de la simple vue HTML Blade (ou Vue/React).

```bash
composer require laravel/breeze --dev
php artisan breeze:install

# Il vous demandera ensuite quelle architecture vous préférez :
# - Blade (par défaut, avec du CSS Tailwind)
# - Livewire
# - React / Vue (avec Inertia)
# - Ou "API Only"

npm install && npm run dev
php artisan migrate
```

**Breeze** fournit un système "Clé-en-main" hyper complet et sécurisé avec :

- Formulaire Connexion / Inscription / Déconnexion
- Mot de passe Oublié & Reset
- Vérification de l'E-mail
- Gestion de page de Profil simple

### Laravel Jetstream

Un Starter Kit beaucoup plus volumineux, conçu pour des grosses applications complexes :

- Authentification à Deux Facteurs (2FA par Google Auth/SMS)
- Gestion d'Équipes (Teams : Slack, Trello, etc.)
- Gestion manuelle des Jetons d'API (API Tokens) et Autorisation
- Gestion des alertes et sessions simultanées
- Exclusivement disponible en Livewire ou Vue/Inertia

## Ressources

- [L'Authentification](https://laravel.com/docs/12.x/authentication) — Documentation officielle de l'authentification
- [Laravel Breeze](https://laravel.com/docs/12.x/starter-kits#laravel-breeze) — Documentation des Starter Kits

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
