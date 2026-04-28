---
source_course: "laravel-routing-controllers"
source_lesson: "laravel-routing-controllers-introduction-to-controllers"
---

# Introduction aux Contrôleurs

Les contrôleurs (controllers) regroupent la logique de traitement des requêtes associées au sein d'une seule classe. Au lieu de définir toute votre logique dans des fonctions anonymes (closures) de routes, les contrôleurs vous aident à organiser votre application.

## Pourquoi utiliser des Contrôleurs ?

```php
// ❌ Les fonctions anonymes dans les routes fonctionnent, mais deviennent vite ingérables
Route::get('/users', function () {
    $users = User::all();
    // 50 lignes de logique métier...
    return view('users.index', compact('users'));
});

Route::post('/users', function (Request $request) {
    // Encore 50 lignes de plus...
});

// ✅ Les contrôleurs organisent la logique de façon structurée
Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);
```

## Créer des Contrôleurs

Utilisez la commande Artisan pour générer des contrôleurs :

```bash
# Contrôleur basique
php artisan make:controller UserController

# Contrôleur de ressources (avec les méthodes CRUD complètes)
php artisan make:controller PostController --resource

# Contrôleur de ressources pour API (sans les méthodes create/edit qui renvoient des vues)
php artisan make:controller API/ProductController --api

# Contrôleur à action unique (invokable)
php artisan make:controller ShowProfile --invokable
```

## Structure de Base d'un Contrôleur

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * Affiche une liste des utilisateurs.
     */
    public function index(): View
    {
        $users = User::all();

        return view('users.index', ['users' => $users]);
    }

    /**
     * Affiche l'utilisateur spécifié.
     */
    public function show(User $user): View
    {
        return view('users.show', ['user' => $user]);
    }

    /**
     * Enregistre un nouvel utilisateur.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        $user = User::create($validated);

        return redirect()->route('users.show', $user);
    }
}
```

## Définir des Routes pointant vers des Contrôleurs

```php
use App\Http\Controllers\UserController;

// Méthode unique
Route::get('/users', [UserController::class, 'index']);

// Plusieurs méthodes avec routes nommées
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/users/{user}', [UserController::class, 'show'])->name('users.show');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
```

## Contrôleurs à Action Unique (Invokable)

Pour les contrôleurs qui n'ont qu'une seule action, utilisez la méthode magique `__invoke` :

```php
<?php

namespace App\Http\Controllers;

class ShowProfile extends Controller
{
    /**
     * Gère la requête entrante.
     */
    public function __invoke(Request $request)
    {
        return view('profile', [
            'user' => $request->user(),
        ]);
    }
}
```

La définition de la route devient beaucoup plus simple :

```php
// Pas besoin de spécifier le nom d'une méthode !
Route::get('/profile', ShowProfile::class);
```

## L'Injection de Dépendances

Le conteneur de services (service container) de Laravel résout automatiquement les dépendances de vos contrôleurs :

```php
<?php

namespace App\Http\Controllers;

use App\Services\UserService;

class UserController extends Controller
{
    /**
     * Injection via le constructeur
     */
    public function __construct(
        private UserService $userService
    ) {}

    public function index()
    {
        $users = $this->userService->getAllActive();

        return view('users.index', ['users' => $users]);
    }

    /**
     * Injection via une méthode
     */
    public function store(Request $request, UserService $service)
    {
        $user = $service->create($request->validated());

        return redirect()->route('users.show', $user);
    }
}
```

## Middleware dans les Contrôleurs

Vous pouvez appliquer des middlewares à toutes les méthodes d'un contrôleur ou seulement à certaines :

```php
// Dans le fichier des routes
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware('auth');

// Dans le constructeur du contrôleur (façon classique)
class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth'); // Appliqué à toutes les méthodes
        $this->middleware('admin')->only('destroy'); // Seulement la méthode destroy
        $this->middleware('throttle:60,1')->except(['index', 'show']); // Toutes sauf index et show
    }
}

// Approche moderne : utiliser les attributs PHP (PHP 8+)
#[Middleware('auth')]
class UserController extends Controller
{
    // Toutes les méthodes nécessitent d'être authentifié
}
```

## Ressources

- [Contrôleurs](https://laravel.com/docs/12.x/controllers) — Documentation officielle de Laravel sur les contrôleurs

---

> 📘 _Cette leçon fait partie du cours [Routage & Contrôleurs Laravel](/laravel/laravel-routing-controllers/) sur la plateforme d'apprentissage RostoDev._
