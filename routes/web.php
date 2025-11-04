<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\PresenceController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'welcome'])->name('home');

// Conditions Générales du Stage
Route::inertia('/conditions-stage', 'statiqpages/ConditionsStage')->name('conditions.stage');
// Conditions Générales du Stage
Route::inertia('/about', 'statiqpages/About')->name('about');

// Programme de Développement d’Application
Route::inertia('/guide-stage', 'statiqpages/GuideStage')->name('guide.stage');
Route::inertia('/dev-app', 'statiqpages/DevApp')->name('dev.app');

// Programme de Génie Logiciel
Route::inertia('/genie-logiciel', 'statiqpages/GenieLogiciel')->name('genie.logiciel');

// FAQ et Support
Route::inertia('/faq', 'statiqpages/FAQ')->name('faq');
Route::get('dashboard', [UserController::class, 'index'])->middleware(['auth', 'verified', 'prevent-back'])->name('dashboard');
Route::get('dashboard/presence-list-user', [UserController::class, 'list'])->middleware(['auth', 'verified', 'prevent-back'])->name('list');
Route::get('dashboard/downloadpdf-presence', [UserController::class, 'downloadAllUser'])->middleware(['auth', 'verified', 'prevent-back'])->name('downloadpdf.presence');

Route::middleware(['auth', 'verified', 'role:admin'])->group(function (): void {
    Route::get('admin/dashboard', [DashboardController::class, 'admin'])->name('admin.dashboard');
    Route::prefix('gestions')->name('users.')->group(function (): void {
        Route::get('users', [UserController::class, 'index'])->name('index');
        Route::get('users/create', [UserController::class, 'create'])->name('create');
        Route::post('users', [UserController::class, 'store'])->name('store');
    });
});

Route::middleware(['auth', 'verified', 'role:superadmin'])->group(function (): void {
    Route::get('/superadmin/dashboard', [DashboardController::class, 'superadmin'])->name('dashboard.superadmin');
    Route::prefix('gestions')->name('users.')->group(function (): void {
        Route::get('users', [UserController::class, 'indexlist'])->name('index');
        Route::get('users/create', [UserController::class, 'create'])->name('create');
        Route::post('users', [UserController::class, 'store'])->name('store');
        Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('edit');
        Route::put('users/{user}', [UserController::class, 'update'])->name('update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('destroy');
        // Route::resource('user', UserController::class);
    });

    Route::prefix('presences')->group(function (): void {
        Route::get('/excel', [PresenceController::class, 'excel'])->name('presences.excel');
        Route::get('/download-all', [PresenceController::class, 'downloadAll'])->name('presences.downloadAll');
        Route::get('/users', [PresenceController::class, 'index'])->name('presences.users');
        Route::get('/add', [PresenceController::class, 'add'])->name('presences.add');
        Route::post('/store', [PresenceController::class, 'store'])->name('presences.store');
        Route::get('/{id}/edit', [PresenceController::class, 'edit'])->name('presences.edit');
        Route::patch('/{id}', [PresenceController::class, 'update'])->name('presences.update');
        Route::delete('/{presence}', [PresenceController::class, 'destroy'])
            ->name('presences.destroy');
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

Route::get('/{any}', fn () => Inertia::render('NotFoundPage'))->where('any', '.*')->name('notfound');
