<?php

declare(strict_types=1);

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Settings\StageController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\DBBackupController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\SocialMediaController;

Route::middleware(['auth', 'prevent-back'])->group(function (): void {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
    Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

    Route::get('settings/media', [SocialMediaController::class, 'index'])->name('media');
    Route::post('settings/media', [SocialMediaController::class, 'store'])->name('media.store');
    Route::put('settings/media/{socialMedia}', [SocialMediaController::class, 'update'])->name('media.update');
    Route::delete('settings/media/{socialMedia}', [SocialMediaController::class, 'destroy'])->name('media.destroy');

    Route::get('settings/stages', [StageController::class, 'index'])->name('stages');
    Route::post('settings/stages', [StageController::class, 'store'])->name('stages.store');
    Route::put('settings/stages/{stage}', [StageController::class, 'update'])->name('stages.update');
    Route::delete('settings/stages/{stage}', [StageController::class, 'destroy'])->name('stages.destroy');

    Route::get('settings/appearance', fn () => Inertia::render('settings/Appearance'))->name('appearance');

    Route::get('settings/dbbackup', [DBBackupController::class, 'index'])
        ->name('dbbackup');

    Route::get('settings/dbbackup/download', [DBBackupController::class, 'download'])
        ->name('dbbackup.download');

    Route::post('settings/dbbackup/create', [DBBackupController::class, 'create'])
        ->name('dbbackup.create');
});
