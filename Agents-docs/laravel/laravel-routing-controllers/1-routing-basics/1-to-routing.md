---
source_course: "laravel-routing-controllers"
source_lesson: "laravel-routing-controllers-introduction-to-routing"
---

# Introduction au Routage

Le routage (routing) est le mécanisme qui fait le lien entre les URL et le code spécifique de votre application. Lorsqu'un utilisateur visite `/users`, comment Laravel sait-il ce qu'il doit afficher ? Ce sont les routes qui définissent cette correspondance.

## Qu'est-ce qu'une Route ?

Une route se compose de :

1. Une **méthode HTTP** (GET, POST, PUT, DELETE, etc.)
2. Un **modèle d'URI (chemin)** (`/users`, `/posts/{id}`)
3. Une **action** (fonction anonyme/closure ou méthode de contrôleur)

```php
// Quand quelqu'un visite /hello via une requête GET
Route::get('/hello', function () {
    return 'Bonjour tout le monde !';
});
```

## Les Fichiers de Routes

Laravel organise les routes dans des fichiers séparés :

```
routes/
├── web.php      # Routes web (avec sessions, protection CSRF)
├── api.php      # Routes de l'API (sans état / stateless)
├── console.php  # Commandes Artisan
└── channels.php # Canaux de diffusion (Broadcast)
```

### routes/web.php

Pour les pages web traditionnelles utilisant des sessions et la protection CSRF :

```php
// routes/web.php
Route::get('/', function () {
    return view('welcome');
});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth']);
```

### routes/api.php

Pour les points d'entrée (endpoints) d'API sans état (stateless). Les routes de ce fichier sont automatiquement préfixées par `/api` :

```php
// routes/api.php
// L'URL devient /api/users
Route::get('/users', function () {
    return User::all();
});
```

## Définition Basique de Route

### Requêtes GET

Pour récupérer des données :

```php
// Visitez /users pour voir tous les utilisateurs
Route::get('/users', function () {
    return view('users.index', ['users' => User::all()]);
});

// Visitez /about pour voir la page "À propos"
Route::get('/about', function () {
    return view('about');
});
```

### Requêtes POST

Pour soumettre et envoyer des données :

```php
Route::post('/users', function (Request $request) {
    User::create($request->all());
    return redirect('/users');
});
```

### Autres Méthodes HTTP

```php
// Mettre à jour une ressource
Route::put('/users/{id}', function ($id) {
    // Mettre à jour l'utilisateur
});

Route::patch('/users/{id}', function ($id) {
    // Mise à jour partielle
});

// Supprimer une ressource
Route::delete('/users/{id}', function ($id) {
    // Supprimer l'utilisateur
});

// Accepter plusieurs méthodes spécifiques
Route::match(['get', 'post'], '/form', function () {
    // Gérer une requête GET ou POST
});

// Accepter N'IMPORTE QUELLE méthode
Route::any('/webhook', function () {
    // Gérer n'importe quelle méthode HTTP
});
```

## Paramètres de Route

Capturez des segments (parties) de l'URI :

```php
// Paramètre obligatoire
Route::get('/users/{id}', function (string $id) {
    return "ID Utilisateur : {$id}";
});
// /users/1 → "ID Utilisateur : 1"
// /users/42 → "ID Utilisateur : 42"
// /users → Erreur 404 (Not Found)

// Paramètre optionnel
Route::get('/users/{name?}', function (?string $name = 'Invité') {
    return "Bonjour, {$name}";
});
// /users → "Bonjour, Invité"
// /users/Jean → "Bonjour, Jean"

// Paramètres multiples
Route::get('/posts/{post}/comments/{comment}', function ($postId, $commentId) {
    return "Article {$postId}, Commentaire {$commentId}";
});
```

## Contraintes de Route (Route Constraints)

Limitez ce à quoi les paramètres peuvent correspondre :

```php
// Uniquement des ID numériques
Route::get('/users/{id}', function ($id) {
    return User::findOrFail($id);
})->where('id', '[0-9]+');

// Uniquement des noms alphabétiques
Route::get('/users/{name}', function ($name) {
    return "Bonjour, {$name}";
})->where('name', '[A-Za-z]+');

// Plusieurs contraintes
Route::get('/posts/{id}/{slug}', function ($id, $slug) {
    // ...
})->where(['id' => '[0-9]+', 'slug' => '[a-z-]+']);

// Méthodes d'aide (helpers)
Route::get('/users/{id}', $action)->whereNumber('id');          // Seulement des nombres
Route::get('/users/{name}', $action)->whereAlpha('name');       // Seulement des lettres
Route::get('/users/{name}', $action)->whereAlphaNumeric('name');// Lettres et chiffres
Route::get('/users/{uuid}', $action)->whereUuid('uuid');        // Seulement des UUID valides
```

## Contraintes Globales

Appliquez des contraintes à toutes les routes contenant un paramètre spécifique dans `AppServiceProvider` :

```php
public function boot(): void
{
    Route::pattern('id', '[0-9]+');
}

// Désormais, tous les paramètres {id} doivent systématiquement être numériques
```

## Ressources

- [Le Routage (Routing)](https://laravel.com/docs/12.x/routing) — Documentation officielle de Laravel sur le routage

---

> 📘 _Cette leçon fait partie du cours [Routage & Contrôleurs Laravel](/laravel/laravel-routing-controllers/) sur la plateforme d'apprentissage RostoDev._
