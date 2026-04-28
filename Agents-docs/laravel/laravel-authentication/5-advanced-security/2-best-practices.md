---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-security-best-practices"
---

# Meilleures Pratiques de Sécurité (Security Best Practices)

Laravel fournit de nombreuses fonctionnalités de sécurité prêtes à l'emploi, mais une configuration adéquate et une bonne sensibilisation sont essentielles pour construire des applications réellement sécurisées.

## Sécurité des Mots de Passe

### Exigences strictes (Strong Password Requirements)

Par défaut, Laravel n'exige que 8 caractères. Vous devriez renforcer cela :

```php
use Illuminate\Validation\Rules\Password;

$request->validate([
    // 'confirmed' exige un champ 'password_confirmation' identique dans le formulaire
    'password' => [
        'required',
        'confirmed',
        Password::min(8)
            ->letters()      // Au moins une lettre
            ->mixedCase()    // Majuscules ET minuscules
            ->numbers()      // Au moins un chiffre
            ->symbols()      // Au moins un caractère spécial (@, $, !, etc.)
            ->uncompromised(), // Magique : Vérifie l'API 'Have I Been Pwned' pour voir si le mot de passe n'a pas fuité sur internet !
    ],
]);
```

### Règles de Mot de Passe par Défaut

Au lieu de répéter ce gros bloc partout, définissez-le globalement une seule fois :

```php
// Dans AppServiceProvider
use Illuminate\Validation\Rules\Password;

public function boot(): void
{
    Password::defaults(function () {
        $rule = Password::min(8);

        // N'exige la complexité absolue qu'en mode Production (pour faciliter la vie des dévs en Local)
        return $this->app->isProduction()
            ? $rule->mixedCase()->numbers()->symbols()->uncompromised()
            : $rule;
    });
}

// Utilisation partout ailleurs dans l'application :
$request->validate([
    'password' => ['required', 'confirmed', Password::defaults()],
]);
```

## Limitation de Débit (Rate Limiting)

Pour empêcher les attaques par force brute (Brute Force).

### Limitation des Tentatives de Connexion (Throttling)

```php
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

public function login(Request $request)
{
    // Crée une clé de suivi unique combinant l'Email ET l'Adresse IP de l'attaquant
    $throttleKey = Str::lower($request->email) . '|' . $request->ip();

    // S'il a essayé plus de 5 fois de suite...
    if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
        $seconds = RateLimiter::availableIn($throttleKey);

        throw ValidationException::withMessages([
            'email' => ["Trop de tentatives. Veuillez réessayer dans {$seconds} secondes."],
        ]);
    }

    // Tentative de connexion
    if (! Auth::attempt($request->only('email', 'password'))) {
        // Enregistre un "coup" (hit). Bloque pendant 60 secondes après 5 coups.
        RateLimiter::hit($throttleKey, 60);

        throw ValidationException::withMessages([
            'email' => ['Identifiants invalides.'],
        ]);
    }

    // Réussite ! On efface l'historique de ses erreurs
    RateLimiter::clear($throttleKey);

    return redirect()->intended('/dashboard');
}
```

### Limitation de Débit des API (API Rate Limiting)

Empêche un bot de bombarder votre API d'une centaine de requêtes par seconde :

```php
// Dans AppServiceProvider
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

public function boot(): void
{
    // Autorise 60 requêtes par minute par Utilisateur (ou par IP si invité)
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    // Plus restrictif pour les actions sensibles (ex: Envoi de SMS)
    RateLimiter::for('sensitive', function (Request $request) {
        return Limit::perMinute(10)->by($request->user()->id);
    });
}
```

## Sécurité des Sessions

Ajustez ces paramètres dans votre fichier `.env` ou `config/session.php` :

```php
// config/session.php

'lifetime' => 120,        // Durée de vie de la session inactif (en minutes)
'expire_on_close' => false,
'encrypt' => true,        // IMPORTANT : Chiffrer le contenu de la session
'http_only' => true,      // IMPORTANT : JS (Front-end) ne peut pas lire le cookie de session (Anti-XSS)
'secure' => env('SESSION_SECURE_COOKIE', true), // IMPORTANT : Accepte uniquement le HTTPS
'same_site' => 'lax',     // Protection contre les failles CSRF (Cross-Site Request Forgery)
```

### Régénération de Session (Crucial)

Contre les attaques de "Fixation de Session" (Session Fixation).

```php
// Toujours régénérer l'ID de la session APRÈS une connexion réussie
public function login(Request $request)
{
    if (Auth::attempt($request->only('email', 'password'))) {
        $request->session()->regenerate(); // Détruit l'ancien ID et en crée un nouveau
        return redirect()->intended('/dashboard');
    }
}

// Nettoyer complètement à la déconnexion
public function logout(Request $request)
{
    Auth::logout();
    $request->session()->invalidate(); // Vide le contenu de la session
    $request->session()->regenerateToken(); // Régénère le jeton CSRF
    return redirect('/');
}
```

## Protection CSRF (Cross-Site Request Forgery)

Si l'attaquant vous piège en créant un faux formulaire sur son site.

```blade
{{-- Tous vos formulaires POST, PUT, PATCH, DELETE en Blade DOIVENT inclure @csrf --}}
<form method="POST" action="/profile">
    @csrf
    <!-- Champs du formulaire -->
</form>
```

Pour les requêtes AJAX (Axios, Fetch, jQuery) :

```blade
{{-- Incluez le jeton en meta dans votre layout --}}
<meta name="csrf-token" content="{{ csrf_token() }}">

{{-- Configurez Axios pour l'envoyer dans chaque header --}}
<script>
axios.defaults.headers.common['X-CSRF-TOKEN'] =
    document.querySelector('meta[name="csrf-token"]').content;
</script>
```

## Prévention des Injections SQL

```php
// ✅ SÉCURISÉ - Eloquent échappe et prépare les variables automatiquement
User::where('email', $request->email)->first();

// ✅ SÉCURISÉ - Le Query Builder avec des paramètres ($request) fait pareil
DB::table('users')->where('email', $request->email)->first();

// ❌ DANGEREUX - N'interpolez JAMAIS directement des entrées dans une chaîne brute
// Un attaquant pourrait envoyer `email = "' OR 1=1; DROP TABLE users; --"`
DB::select("SELECT * FROM users WHERE email = '{$request->email}'");

// ✅ SÉCURISÉ - Utilisez les "liaisons" (bindings) le point d'interrogation (?) sécurise
DB::select('SELECT * FROM users WHERE email = ?', [$request->email]);
```

## Prévention XSS (Cross-Site Scripting)

Un attaquant tente d'injecter du code JavaScript `<script>alert('Pirate')</script>` dans un commentaire.

```blade
{{-- ✅ SÉCURISÉ - Les doubles accolades {{ }} échappent automatiquement le HTML en texte brut --}}
<h1>{{ $user->name }}</h1>

{{-- ❌ DANGEREUX - Le {!! !!} N'ÉCHAPPE PAS (Unescaped output) --}}
{{-- N'utilisez ça QUE SI c'est VOUS qui avez écrit le HTML en base de données --}}
{!! $user->bio !!}

{{-- ✅ SÉCURISÉ POUR DU HTML RICHE - Nettoyer AVANT d'afficher (Sanitization) --}}
{!! clean($user->bio) !!}  {{-- Nécessite une librairie externe comme "mewebstudio/Purifier" pour supprimer la balise tag <script> mais garder <strong> --}}
```

## Forcer le HTTPS Partout

Si votre hébergement ne redirige pas automatiquement le HTTP vers le HTTPS :

```php
// Dans AppServiceProvider
use Illuminate\Support\Facades\URL;

public function boot(): void
{
    if ($this->app->environment('production')) {
        URL::forceScheme('https');
    }
}
```

## Middleware de Headers de Sécurité (Poussé)

Renforcer les réponses HTTP renvoyées par Laravel pour bloquer certains comportements des navigateurs :

```php
// app/Http/Middleware/SecurityHeaders.php
class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Interdit qu'un autre site charge votre site dans une balise <iframe src="votre-site">
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        // Empêche le navigateur d'essayer de "deviner" le type de fichier (risque d'exécution)
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        // Active le filtre XSS de base du navigateur
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        // Le site cible ne saura pas la page exacte d'où venait l'utilisateur
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        // Coupe l'accès aux APIs matérielles (Webcam, Micro, GPS) sur tout le site !
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

        if (app()->environment('production')) {
             // Oblige fermement le navigateur de l'utilisateur à toujours revenir en HTTPS (HSTS)
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=31536000; includeSubDomains'
            );
        }

        return $response;
    }
}
```

_(N'oubliez pas d'enregistrer ce middleware dans `bootstrap/app.php` pour qu'il s'applique partout !)_

## Sécurité de l'Environnement (.env)

```env
# Ne JAMAIS laisser cela sur 'true' sur un serveur public ! (Affiche tout votre code source en cas d'erreur)
APP_DEBUG=false
APP_ENV=production

# Gardez cette clé secrète de génération de mots de passe absolument confidentielle
APP_KEY=base64:votre-longue-cle-generee-ici
```

```php
// Ne lisez JAMAIS les fichiers .env directement dans votre code !
// ❌ Mauvais (Peut échouer si le config est en cache)
if (env('APP_DEBUG')) {}

// ✅ Bon (Passe toujours par le système de configuration)
if (config('app.debug')) {}
```

## Ressources

- [Sécurité Laravel](https://laravel.com/docs/12.x/authentication) — Documentation Laravel sur l'authentification et la sécurité

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
