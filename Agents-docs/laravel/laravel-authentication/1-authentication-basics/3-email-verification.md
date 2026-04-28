---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-email-verification"
---

# Vérification d'E-mail (Email Verification)

La vérification par e-mail garantit que les utilisateurs sont bien propriétaires des adresses e-mail avec lesquelles ils s'inscrivent (empêchant ainsi la création de faux comptes et les spams). Laravel facilite grandement son implémentation.

## Configurer la Vérification d'E-mail

### 1. Implémenter le Contrat dans le Modèle User

Pour dire à Laravel qu'un utilisateur DOIT vérifier son email, implémentez l'interface `MustVerifyEmail` sur le modèle `User` existant :

```php
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;  // 1. Ajoutez ceci
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

// 2. Ajoutez "implements MustVerifyEmail" à la déclaration de classe
class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable;

    // ...
}
```

### 2. Migration de la Base de Données

La table `users` a besoin d'une colonne `email_verified_at` (c'est le cas par défaut sur les nouvelles installations de Laravel) :

```php
$table->timestamp('email_verified_at')->nullable();
```

### 3. Définir les Routes

Vous devez définir trois routes essentielles. (Si vous utilisez _Laravel Breeze_, elles sont déjà générées).

```php
use Illuminate\Foundation\Auth\EmailVerificationRequest;

// 1. La page d'Avertissement : Demande à l'utilisateur d'aller cliquer sur le lien dans son e-mail
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');

// 2. Le Gestionnaire (Handler) de Vérification : L'URL unique sur laquelle l'utilisateur clique dans le courriel
Route::get('/email/verify/{id}/{hash}', function (EmailVerificationRequest $request) {
    // La méthode fulfill() gère tout : elle vérifie le hash sécurisé et marque l'email en TIMESTAMP actuel.
    $request->fulfill();

    return redirect('/dashboard');
})->middleware(['auth', 'signed'])->name('verification.verify');

// 3. Le bouton "Renvoyer l'e-mail de vérification" (au cas où il ne l'a pas reçu)
Route::post('/email/verification-notification', function (Request $request) {
    $request->user()->sendEmailVerificationNotification();

    return back()->with('message', 'Le lien de vérification a été transféré !');
})->middleware(['auth', 'throttle:6,1'])->name('verification.send'); // throttle évite qu'il ne spam le bouton (max 6 fois par minute)
```

### 4. Protéger vos Routes Sécurisées

Maintenant, vous pouvez empêcher l'accès aux pages sensibles à tous ceux n'ayant pas cliqué sur le lien avec le middleware `verified` :

```php
// Requiert QUE l'email SOIT vérifié (en plus d'être authentifié)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified']);

// Ou protéger tout un groupe de routes d'un coup
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/billing', [BillingController::class, 'index']);
});
```

Si un utilisateur non-vérifié tente d'accéder à `/dashboard`, Laravel le renverra discrètement vers la route nommée `verification.notice`.

## La Vue d'Avertissement de Vérification (`verify-email`)

```blade
<!-- resources/views/auth/verify-email.blade.php -->

<x-layout>
    <div class="container">
        <h1>Vérifiez Votre Adresse E-mail</h1>

        @if (session('message'))
            <div class="alert alert-success">
                {{ session('message') }}
            </div>
        @endif

        <p>Avant de continuer, veuillez vérifier vos e-mails pour cliquer sur le lien de confirmation.</p>
        <p>Si vous n'avez pas reçu l'e-mail :</p>

        <form method="POST" action="{{ route('verification.send') }}">
            @csrf
            <button type="submit">Renvoyer l'e-mail de vérification</button>
        </form>
    </div>
</x-layout>
```

## Personnaliser l'E-mail de Vérification (Notification)

Par défaut, Laravel envoie un email basique en anglais. Voici comment le modifier.

```php
<?php

namespace App\Models;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements MustVerifyEmail
{
    /**
     * Surcharger la méthode pour envoyer NOTRE propre notification.
     */
    public function sendEmailVerificationNotification(): void
    {
        // $this->notify(new VerifyEmail); // Comportement par défaut

        // Utiliser plutôt notre propre modèle de notification
        $this->notify(new \App\Notifications\CustomVerifyEmail);
    }
}
```

### Le Code de la Notification Personnalisée (CustomVerifyEmail)

Créée via `php artisan make:notification CustomVerifyEmail` :

```php
<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail as BaseVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

// Hérite de la classe native VerifyEmail de Laravel
class CustomVerifyEmail extends BaseVerifyEmail
{
    public function toMail($notifiable): MailMessage
    {
        // Génère le l'URL magique signée et sécurisée
        $verificationUrl = $this->verificationUrl($notifiable);

        // Crée le contenu de l'e-mail avec une chaîne MailMessage
        return (new MailMessage)
            ->subject('Bienvenue ! Veuillez vérifier votre adresse e-mail')
            ->greeting('Bonjour ' . $notifiable->name . ' !')
            ->line('Merci pour votre inscription. Veuillez cliquer sur le bouton ci-dessous pour vérifier votre compte.')
            ->action('Vérifier mon E-mail', $verificationUrl)
            ->line('Pour des raisons de sécurité, ce lien expirera dans 60 minutes.')
            ->line("Si vous n'êtes pas à l'origine de cette inscription, veuillez ignorer ce message.");
    }
}
```

## Vérifier le Statut de Vérification en PHP

Parfois, vous n'utilisez pas le middleware `verified` mais vous voulez afficher quelque chose de différent si la personne a validé oui ou non son email.

```php
// Dans un contrôleur
if ($request->user()->hasVerifiedEmail()) {
    // L'e-mail est correctement vérifié
}

// Dans le code HTML (Blade)
@if (auth()->user()->hasVerifiedEmail())
    <span class="badge text-bg-success">✓ Vérifié</span>
@else
    <span class="badge text-bg-warning">En attente de vérification</span>
@endif
```

## Événements (Events) Liés à la Vérification

Laravel émet un événement `Verified` exact au moment où la personne a cliqué sur le lien (pratique pour lui débloquer des cadeaux virtuels, envoyer un e-mail de "succès", ou l'abonner à une Newsletter Mailchimp etc).

```php
// Dans un EventServiceProvider.php
protected $listen = [
    Registered::class => [
        SendEmailVerificationNotification::class, // Envoi auto. à l'inscription
    ],
    Verified::class => [
        \App\Listeners\AssignWelcomeBadgeListener::class, // Débloque une récompense interne
        \App\Listeners\LogVerifiedUser::class,            // Enregistre l'action
    ],
];
```

```php
// app/Listeners/LogVerifiedUser.php
class LogVerifiedUser
{
    public function handle(Verified $event): void
    {
        Log::info('L\'utilisateur vient de valider son e-mail ! 🎉', [
            'user_id' => $event->user->id,
            'email' => $event->user->email,
        ]);
    }
}
```

## Vérification Manuelle (Code pur)

En cas d'intervention en base de données, lors d'un test, ou si votre client appelle le support technique :

```php
// Marquer un utilisateur comme vérifié sans clic sur e-mail
$user->markEmailAsVerified(); // Exécute un `$user->save()` en arrière plan

// Vérifier si vérifié
$user->hasVerifiedEmail();  // Retourne un booléen (true/false)

// Obtenir la vraie date/heure de création si besoin
$user->email_verified_at;  // Retourne une instance de Carbon, ou NULL
```

## Ressources

- [Vérification d'E-mail (Email Verification)](https://laravel.com/docs/12.x/verification) — Documentation officielle

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
