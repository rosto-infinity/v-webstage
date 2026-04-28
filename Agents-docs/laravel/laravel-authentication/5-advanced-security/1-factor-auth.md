---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-two-factor-auth"
---

# Authentification à Deux Facteurs (2FA)

L'authentification à deux facteurs (2FA/A2F) ajoute une couche de sécurité supplémentaire en exigeant que les utilisateurs fournissent une seconde méthode de vérification en plus de leur simple mot de passe.

## Comment fonctionne le 2FA

```text
┌─────────────────────────────────────────────────────────────────┐
│                 AUTHENTIFICATION À DEUX FACTEURS                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Étape 1 : Connexion avec Email + Mot de passe                  │
│          ┌──────────────────────────────────────┐               │
│          │ Quelque chose que vous CONNAISSEZ    │               │
│          └──────────────────────────────────────┘               │
│                         │                                       │
│                         ▼                                       │
│  Étape 2 : Vérification avec un Code (Appli Type Authy/Google)  │
│          ┌──────────────────────────────────────┐               │
│          │ Quelque chose que vous POSSÉDEZ      │               │
│          └──────────────────────────────────────┘               │
│                         │                                       │
│                         ▼                                       │
│  Accès Autorisé                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Utiliser Laravel Fortify (La méthode facile)

Laravel Fortify (le moteur sous le capot de Jetstream) fournit le 2FA clé en main :

```bash
composer require laravel/fortify

php artisan fortify:install

php artisan migrate
```

Activez le 2FA dans le fichier `config/fortify.php` :

```php
'features' => [
    Features::registration(),
    Features::resetPasswords(),
    Features::emailVerification(),
    Features::updateProfileInformation(),
    Features::updatePasswords(),

    // Il suffit de décommenter cette ligne !
    Features::twoFactorAuthentication([
        'confirm' => true, // Exige que l'utilisateur tape un 1er code pour prouver que ça marche
        'confirmPassword' => true, // Exige de retaper son mot de passe avant les gros changements
    ]),
],
```

Fortify gérera automatiquement les routes, les codes de récupération (Recovery Codes) et la génération du QR Code.

## Implémentation Manuelle (Pour comprendre la mécanique)

Si vous ne voulez pas utiliser Fortify, voici comment construire un système 2FA (basé sur TOTP - Time-Based One-Time Password) de zéro.

### Installation des dépendances

```bash
# Librairie pour générer et valider les clés TOTP
composer require pragmarx/google2fa-laravel

# Librairie pour dessiner le QR Code à flasher avec le téléphone
composer require bacon/bacon-qr-code

php artisan vendor:publish --provider="PragmaRX\Google2FALaravel\ServiceProvider"
```

### Modification de la Base de Données

```php
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->text('two_factor_secret')->nullable(); // La clé secrète partagée
        $table->text('two_factor_recovery_codes')->nullable(); // Les 8 codes de secours
        $table->timestamp('two_factor_confirmed_at')->nullable(); // Date d'activation
    });
}
```

### Le Modèle User

```php
use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    // Cacher ces données sensibles des réponses JSON
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    // Chiffrer automatiquement ces colonnes dans la BDD (Nouveauté Laravel 11)
    protected function casts(): array
    {
        return [
            'two_factor_secret' => 'encrypted',
            'two_factor_recovery_codes' => 'encrypted:array', // Tableau chiffré
        ];
    }

    public function hasTwoFactorEnabled(): bool
    {
        return ! is_null($this->two_factor_confirmed_at);
    }

    // Étape 1 : Préparation
    public function enableTwoFactor(): void
    {
        $google2fa = new Google2FA();

        $this->two_factor_secret = $google2fa->generateSecretKey();
        $this->two_factor_recovery_codes = $this->generateRecoveryCodes();
        $this->save();
    }

    // Étape 2 : L'utilisateur tape le 1er code pour tester
    public function confirmTwoFactor(string $code): bool
    {
        $google2fa = new Google2FA();

        // Le composant vérifie si le code correspond bien à la clé secrète à l'instant T
        if ($google2fa->verifyKey($this->two_factor_secret, $code)) {
            $this->two_factor_confirmed_at = now();
            $this->save();
            return true;
        }

        return false;
    }

    public function disableTwoFactor(): void
    {
        $this->two_factor_secret = null;
        $this->two_factor_recovery_codes = null;
        $this->two_factor_confirmed_at = null;
        $this->save();
    }

    // Générer 8 codes de secours format XXXXXXXXXX-XXXXXXXXXX
    protected function generateRecoveryCodes(): array
    {
        return collect(range(1, 8))
            ->map(fn () => Str::random(10) . '-' . Str::random(10))
            ->all();
    }

    // Fournir l'URL magique (otpauth://) que l'application de scan va lire
    public function getQrCodeUrl(): string
    {
        $google2fa = new Google2FA();

        return $google2fa->getQRCodeUrl(
            config('app.name'), // S'affichera comme ça dans Google Authenticator
            $this->email,
            $this->two_factor_secret
        );
    }
}
```

### Le Contrôleur de Gestion du 2FA

Ce contrôleur sert à configurer le 2FA dans les paramètres de profil.

```php
class TwoFactorController extends Controller
{
    // Afficher la page de configuration
    public function show(Request $request)
    {
        $user = $request->user();

        if ($user->hasTwoFactorEnabled()) {
            return view('settings.two-factor.enabled');
        }

        // S'il n'a pas encore de clé générée, on la crée
        if (! $user->two_factor_secret) {
            $user->enableTwoFactor();
        }

        // On dessine le QR Code final en image SVG (Très propre)
        $qrCode = (new \BaconQrCode\Renderer\Image\SvgImageBackEnd())
            ->render($user->getQrCodeUrl());

        return view('settings.two-factor.setup', [
            'qrCode' => $qrCode,
            'secret' => $user->two_factor_secret,
            'recoveryCodes' => $user->two_factor_recovery_codes,
        ]);
    }

    // Traiter la validation du 1er code
    public function confirm(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6', // Le code fait toujours 6 chiffres
        ]);

        if ($request->user()->confirmTwoFactor($request->code)) {
            return redirect()->route('settings')
                ->with('success', 'Authentification 2FA activée avec succès !');
        }

        return back()->withErrors(['code' => 'Code de vérification invalide. Veuillez réessayer.']);
    }

    public function disable(Request $request)
    {
        // Toujours redemander le mot de passe actuel avant de désactiver une sécurité
        $request->validate([
            'password' => 'required|current_password',
        ]);

        $request->user()->disableTwoFactor();

        return redirect()->route('settings')
            ->with('success', 'Authentification 2FA désactivée.');
    }
}
```

### Le Contrôleur de Connexion avec 2FA

Lorsqu'un utilisateur se connecte, nous devons intercepter le flux.

```php
class LoginController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 1. Essayer le mot de passe
        if (! Auth::attempt($credentials)) {
            return back()->withErrors(['email' => 'Identifiants invalides.']);
        }

        $user = Auth::user();

        // 2. Si le l'utilisateur a activé le 2FA
        if ($user->hasTwoFactorEnabled()) {

            // On le DÉCONNECTE immédiatement ! Oui, c'est étrange mais vital pour la sécurité
            Auth::logout();

            // On stocke juste son ID dans la session temporaire
            $request->session()->put('login.id', $user->id);

            // On le renvoie vers la page où il devra taper les 6 chiffres
            return redirect()->route('two-factor.challenge');
        }

        // 3. Pas de 2FA ? Connexion normale
        return redirect()->intended('/dashboard');
    }

    // Méthode pour traiter le formulaire des 6 chiffres (non implémentée entièrement ici pour alléger)
    public function challenge(Request $request)
    {
         // 1. Récupérer l'ID depuis $request->session()->get('login.id')
         // 2. Charger le nom d'utilisateur
         // 3. Vérifier le code avec $google2fa->verifyKey()
         // 4. Si c'est bon : Auth::loginUsingId($id) puis redirection vers /dashboard
    }
}
```

## Ressources

- [Laravel Fortify (2FA)](https://laravel.com/docs/12.x/fortify#two-factor-authentication) — Documentation officielle sur l'authentification à deux facteurs
- [PragmaRX/Google2FA](https://github.com/antonioribeiro/google2fa) — Le paquet PHP standard pour le TOTP

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
