---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-manual-authentication"
---

# Implémentation de l'Authentification Manuelle

Bien que les Starter Kits (comme Breeze ou Jetstream) gèrent l'authentification pour vous de manière automatisée, comprendre l'implémentation manuelle est indispensable pour pouvoir personnaliser et déboguer l'authentification dans vos projets.

## Implémentation de la Connexion (Login)

Voici un exemple classique de contrôleur gérant la connexion :

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Afficher le formulaire de connexion.
     */
    public function showLoginForm()
    {
        return view('auth.login');
    }

    /**
     * Gérer une requête de connexion.
     */
    public function login(Request $request)
    {
        // 1. Validation des données du formulaire
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Tentative d'authentification
        // attempt() va chercher l'utilisateur par l'email, puis vérifier que le mot de passe correspond au hash
        if (Auth::attempt($credentials, $request->boolean('remember'))) {

            // 3. Régénérer l'ID de session pour éviter les attaques de "Fixation de Session" (Sécurité vitale)
            $request->session()->regenerate();

            // 4. Rediriger là où l'utilisateur voulait aller (ou vers le dashboard par défaut)
            return redirect()->intended('dashboard');
        }

        // 5. L'authentification a échoué (Mauvais email ou mot de passe)
        return back()->withErrors([
            'email' => 'Les identifiants fournis ne correspondent pas à nos enregistrements.',
        ])->onlyInput('email'); // Renvoyer uniquement l'email pour préremplir le champ
    }
}
```

### Détails sur la Méthode `attempt()`

La méthode `Auth::attempt()` est le cœur de l'authentification manuelle. Elle renvoie `true` si les identifiants sont corrects, `false` sinon.

```php
// Tentative basique
Auth::attempt(['email' => $email, 'password' => $password]);

// Avec la fonctionnalité "Se souvenir de moi" (Remember Me)
// Cela pose un cookie "indéfini" dans le navigateur pour ne pas avoir à se reconnecter
Auth::attempt($credentials, $remember = true);

// Ajouter des conditions de sécurité supplémentaires
Auth::attempt([
    'email' => $email,
    'password' => $password,
    'active' => true,  // Le compte utilisateur DOIT être actif dans la base de données
]);

// Utiliser un "Guard" spécifique (ex: Espace Administration isolé des Clients)
Auth::guard('admin')->attempt($credentials);
```

## Implémentation de la Déconnexion (Logout)

Se déconnecter correctement nécessite plusieurs étapes de sécurité :

```php
// Doit toujours se faire via une requête POST par sécurité (éviter les failles CSRF)
public function logout(Request $request)
{
    // 1. Déconnecter l'utilisateur (nettoie les informations liées à Auth)
    Auth::logout();

    // 2. Invalider complètement la session active (Nettoie toutes les données temporaires, paniers, etc.)
    $request->session()->invalidate();

    // 3. Régénérer le jeton CSRF pour éviter les attaques
    $request->session()->regenerateToken();

    // 4. Rediriger
    return redirect('/');
}
```

## Inscription (Registration)

Un contrôleur d'inscription classique :

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function showRegistrationForm()
    {
        return view('auth.register');
    }

    public function register(Request $request)
    {
        // 1. Valider drastiquement les données
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users', // L'email doit être unique dans la table `users`
            'password' => 'required|string|min:8|confirmed', // Confirmed vérifie si 'password' == 'password_confirmation' dans le formulaire
        ]);

        // 2. Créer l'utilisateur
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']), // Toujours Hacher soi-même si $casts n'est pas activé sur le Modèle !
        ]);

        // 3. Connecter l'utilisateur automatiquement après l'inscription
        Auth::login($user);

        return redirect('dashboard');
    }
}
```

## Réinitialisation de Mot de Passe (Password Reset)

Construire tout un système de "Mot de passe oublié" est extrêmement complexe (génération de token, envois d'emails, vérification de validité, etc.). Laravel fournit tout cela nativement via la façade `Password` :

```php
// routes/web.php
use Illuminate\Support\Facades\Password;

// 1. Afficher le formulaire "Mot de passe oublié ?"
Route::get('/forgot-password', function () {
    return view('auth.forgot-password');
})->middleware('guest')->name('password.request');

// 2. Envoyer le lien de réinitialisation par email
Route::post('/forgot-password', function (Request $request) {
    $request->validate(['email' => 'required|email']);

    // La façade gère la création du Token, son stockage et l'envoi de l'email
    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::RESET_LINK_SENT
        ? back()->with(['status' => __($status)])
        : back()->withErrors(['email' => __($status)]);
})->middleware('guest')->name('password.email');

// 3. Afficher le formulaire de réinitialisation (en cliquant sur le lien reçu par email)
Route::get('/reset-password/{token}', function (string $token) {
    return view('auth.reset-password', ['token' => $token]);
})->middleware('guest')->name('password.reset');

// 4. Traiter la soumission du nouveau mot de passe
Route::post('/reset-password', function (Request $request) {
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (User $user, string $password) { // Le code exécuté si le token et l'email sont valides
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60)); // Régénérer le token "Se souvenir de moi"

            $user->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? redirect()->route('login')->with('status', __($status))
        : back()->withErrors(['email' => [__($status)]]);
})->middleware('guest')->name('password.update');
```

## Protection des Routes

Pour empêcher qu'un visiteur accède au Dashboard, utilisez le middleware `auth` :

```php
// Protéger une route individuelle
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth');

// Protéger un groupe de routes entier (Beaucoup plus propre)
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'show']);
});

// À L'INVERSE : Protéger les pages de connexion pour les gens DÉJÀ connectés (Guest = Invité)
// Si un utilisateur connecté tente d'aller sur /login, il sera redirigé vers l'accueil !
Route::get('/login', [LoginController::class, 'showLoginForm'])
    ->middleware('guest');
```

## La Redirection Intelligente (`intended`)

Rappelez-vous le bout de code du login : `redirect()->intended('dashboard')`. C'est une fonctionnalité géniale de Laravel :

```php
return redirect()->intended('dashboard');

// Que fait `intended` exactement ?
// 1. Un Invité clique sur un lien "/facture-secrete" (Protégé par le middleware 'auth').
// 2. Laravel intercepte la demande, sauvegarde secrètement "/facture-secrete" en session, et redirige vers "/login".
// 3. Le visiteur se connecte avec succès.
// 4. `intended()` sait qu'il voulait aller sur "/facture-secrete", il l'y envoie DONT directement au lieu du Dashboard par défaut ! Magique.
```

## Limitation des Tentatives de Connexion (Throttling / Protection Brute Force)

Par défaut, si vous implémentez l'authentification manuellement, elle n'est pas protégée contre quelqu'un essayant 1000 mots de passe à la seconde. Voici comment ajouter une sécurité anti-brute-force :

```php
use Illuminate\Support\Facades\RateLimiter;

public function login(Request $request)
{
    // Clé unique basée sur l'Email testé ET l'adresse IP de l'attaquant
    $throttleKey = strtolower($request->email).'|'.$request->ip();

    // 1. Bloquer s'il y a plus de 5 tentatives ratées
    if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
        $seconds = RateLimiter::availableIn($throttleKey);
        return back()->withErrors([
            'email' => "Trop de tentatives. Veuillez réessayer dans {$seconds} secondes.",
        ]);
    }

    // 2. Essayer
    if (Auth::attempt($request->only('email', 'password'))) {
        // Connexion réussie : On nettoie le compteur d'erreurs pour cet IP/Email
        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();
        return redirect()->intended('dashboard');
    }

    // 3. Connexion ratée : On ajoute "1 coup" au compteur pour cet IP/Email
    RateLimiter::hit($throttleKey);
    return back()->withErrors(['email' => 'Identifiants invalides.']);
}
```

## Ressources

- [Authentification Manuelle des Utilisateurs](https://laravel.com/docs/12.x/authentication#authenticating-users) — Guide d'implémentation de l'authentification manuelle
- [Réinitialisation de Mot de Passe](https://laravel.com/docs/12.x/passwords) — Documentation sur la réinitialisation de mot de passe

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
