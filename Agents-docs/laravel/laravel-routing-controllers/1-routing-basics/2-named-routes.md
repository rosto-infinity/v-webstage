---
source_course: "laravel-routing-controllers"
source_lesson: "laravel-routing-controllers-named-routes"
---

# Routes Nommées et Génération d'URL

Les routes nommées (named routes) vous permettent de générer des URL ou des redirections sans avoir à écrire les chemins en dur dans votre code. Si une URL change, il vous suffit de mettre à jour la définition de la route, et non chaque lien dispersé dans votre application.

## Nommer des Routes

Utilisez la méthode `name()` :

```php
Route::get('/users', [UserController::class, 'index'])->name('users.index');
Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
Route::post('/users', [UserController::class, 'store'])->name('users.store');
```

## Générer des URL

Utilisez la fonction d'aide (helper) `route()` :

```php
// Générer une URL
$url = route('users.index');  // '/users'

// Avec des paramètres
$url = route('users.show', ['id' => 1]);  // '/users/1'

// Avec plusieurs paramètres
Route::get('/posts/{post}/comments/{comment}', ...)->name('comments.show');
$url = route('comments.show', ['post' => 1, 'comment' => 5]);
// '/posts/1/comments/5'

// Les paramètres supplémentaires deviennent une chaîne de requête (query string)
$url = route('users.index', ['page' => 2, 'sort' => 'name']);
// '/users?page=2&sort=name'
```

## Utiliser des Routes Nommées dans Blade

```blade
<!-- Lien vers une route nommée -->
<a href="{{ route('users.index') }}">Tous les utilisateurs</a>

<!-- Avec des paramètres -->
<a href="{{ route('users.show', ['id' => $user->id]) }}">{{ $user->name }}</a>

<!-- Raccourci (shorthand) avec un modèle Eloquent -->
<a href="{{ route('users.show', $user) }}">{{ $user->name }}</a>
```

## Rediriger vers des Routes Nommées

```php
// Dans un contrôleur
return redirect()->route('users.index');

// Avec des paramètres
return redirect()->route('users.show', ['id' => $user->id]);

// Avec des données flash (message éphémère en session)
return redirect()->route('users.index')->with('status', 'Utilisateur créé !');
```

## Vérifier la Route Courante

```php
// Dans un contrôleur
if ($request->routeIs('users.*')) {
    // La route actuelle correspond à 'users.index', 'users.show', etc.
}

// Dans Blade
@if (request()->routeIs('users.index'))
    <span>Vous êtes sur la page des utilisateurs</span>
@endif

// Plusieurs modèles (patterns) possibles
@if (request()->routeIs('users.*', 'profile'))
    // Correspond à n'importe quelle route users.* ou à la route 'profile'
@endif
```

## URL Signées (Signed URLs)

Créez des URL qui ne peuvent pas être altérées ou falsifiées :

```php
// Générer une URL signée
$url = URL::signedRoute('unsubscribe', ['user' => 1]);
// '/unsubscribe/1?signature=abc123...'

// URL signée temporaire (qui expire)
$url = URL::temporarySignedRoute(
    'unsubscribe',
    now()->addMinutes(30),
    ['user' => 1]
);
```

Valider des URL signées :

```php
// Dans la définition de la route ou du contrôleur
Route::get('/unsubscribe/{user}', function (Request $request) {
    if (! $request->hasValidSignature()) {
        abort(401);
    }

    // Traiter la désinscription...
})->name('unsubscribe');

// Ou utiliser un middleware
Route::get('/unsubscribe/{user}', function () {
    // ...
})->name('unsubscribe')->middleware('signed');
```

## Groupes de Routes (Route Groups)

Regroupez des routes liées pour partager des attributs :

```php
// Partager un middleware
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/profile', [ProfileController::class, 'show']);
});

// Partager un préfixe d'URL
Route::prefix('admin')->group(function () {
    Route::get('/users', ...);      // Devient /admin/users
    Route::get('/settings', ...);   // Devient /admin/settings
});

// Partager un préfixe de nom (nam)
Route::name('admin.')->group(function () {
    Route::get('/users', ...)->name('users');       // Devient admin.users
    Route::get('/settings', ...)->name('settings'); // Devient admin.settings
});

// Regrouper plusieurs éléments
Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])
             ->name('dashboard');  // Route nommée 'admin.dashboard' accessible sur l'URL /admin/dashboard
    });
```

## Routage Sous-domaine (Subdomain Routing)

```php
Route::domain('{account}.myapp.com')->group(function () {
    Route::get('/users/{id}', function ($account, $id) {
        return "Compte : {$account}, Utilisateur : {$id}";
    });
});
// ex : shop.myapp.com/users/1 → "Compte : shop, Utilisateur : 1"
```

## Liaison Modèle-Route (Route Model Binding)

Permet d'injecter automatiquement des instances de modèles depuis la base de données :

```php
// Laravel trouve automatiquement l'utilisateur (User) par son ID
Route::get('/users/{user}', function (User $user) {
    return $user->email;
});
// /users/1 → trouve l'utilisateur avec id=1
// /users/999 → retourne une erreur 404 Not Found si l'utilisateur n'existe pas

// Utiliser une colonne différente pour la recherche
Route::get('/users/{user:slug}', function (User $user) {
    return $user;
});
// /users/jean-dupont → trouve l'utilisateur (User) où la colonne slug='jean-dupont'
```

## Ressources

- [Routes Nommées](https://laravel.com/docs/12.x/routing#named-routes) — Documentation officielle sur les routes nommées dans Laravel

---

> 📘 _Cette leçon fait partie du cours [Routage & Contrôleurs Laravel](/laravel/laravel-routing-controllers/) sur la plateforme d'apprentissage RostoDev._
