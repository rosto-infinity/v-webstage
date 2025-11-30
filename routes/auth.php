<?php

declare(strict_types=1);

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

Route::middleware(['auth', 'verified', 'role:admin'])->group(function (): void {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);

});
Route::middleware('guest')->group(function (): void {

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('store');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function (): void {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});

Route::get('/auth/github/redirect', fn () => Socialite::driver('github')->redirect());

Route::get('/auth/github/callback', function () {
    try {
        $githubUser = Socialite::driver('github')->user();
    } catch (Exception) {
        return redirect()->route('login')->withErrors([
            'error' => 'Échec de l\'authentification avec GitHub.',
        ]);
    }

    // 🔍 1. Cherche par github_id
    $user = User::where('github_id', $githubUser->getId())->first();

    if ($user) {
        // ✅ Compte GitHub déjà lié → mise à jour
        $user->update([
            'email' => $githubUser->getEmail(),
            'name' => $githubUser->getName() ?? $githubUser->getNickname(),
            'github_token' => $githubUser->token,
            'github_refresh_token' => $githubUser->refreshToken ?? null,
            'avatar' => $githubUser->getAvatar(),
            'email_verified_at' => $user->email_verified_at ?? now(),
        ]);
    } else {
        // 🔍 2. Cherche par email
        $user = User::where('email', $githubUser->getEmail())->first();

        if ($user) {
            // ✅ Compte local existe → fusionne avec GitHub
            $user->update([
                'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                'github_id' => $githubUser->getId(),
                'github_token' => $githubUser->token,
                'github_refresh_token' => $githubUser->refreshToken ?? null,
                'avatar' => $githubUser->getAvatar(),
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);
        } else {
            // ✅ Nouvel utilisateur → création
            $user = User::create([
                'name' => $githubUser->getName() ?? $githubUser->getNickname(),
                'email' => $githubUser->getEmail(),
                'password' => Hash::make(env('USER_PASSWORD_PASS')),
                'github_id' => $githubUser->getId(),
                'github_token' => $githubUser->token,
                'github_refresh_token' => $githubUser->refreshToken ?? null,
                'avatar' => $githubUser->getAvatar(),
                'email_verified_at' => now(),
            ]);
        }
    }

    // ✅ Connecte l'utilisateur
    Auth::login($user, true);

    return redirect()->intended(route('dashboard'));
});

Route::get('/auth/google/redirect', fn () => Socialite::driver('google')->redirect());

Route::get('/auth/google/callback', function () {
    try {
        $googleUser = Socialite::driver('google')->user();
    } catch (Exception) {
        return redirect()->route('login')->withErrors([
            'error' => 'Échec de l\'authentification avec Google.',
        ]);
    }

    // 🔍 1. Cherche par google_id (priorité haute)
    $user = User::where('google_id', $googleUser->getId())->first();

    if ($user) {
        // ✅ Compte Google déjà lié → mise à jour
        $user->update([
            'email' => $googleUser->getEmail(),
            'name' => $googleUser->getName(),
            'google_token' => $googleUser->token,
            'google_refresh_token' => $googleUser->refreshToken,
            'avatar' => $googleUser->getAvatar(),
            'email_verified_at' => $user->email_verified_at ?? now(),
        ]);
    } else {
        // 🔍 2. Cherche par email
        $user = User::where('email', $googleUser->getEmail())->first();

        if ($user) {
            // ✅ Compte local existe → fusionne avec Google
            $user->update([
                'name' => $googleUser->getName(),
                'google_id' => $googleUser->getId(),
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken,
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);
        } else {
            // ✅ Nouvel utilisateur → création
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'password' => Hash::make(env('USER_PASSWORD_PASS')),
                'google_id' => $googleUser->getId(),
                'google_token' => $googleUser->token,
                'google_refresh_token' => $googleUser->refreshToken,
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
            ]);
        }
    }

    // ✅ Connecte l'utilisateur
    Auth::login($user, true);

    return redirect()->intended('/dashboard');
});
