---
source_course: "laravel-routing-controllers"
source_lesson: "laravel-routing-controllers-resource-controllers"
---

# Les Contrôleurs de Ressources (Resource Controllers)

Les contrôleurs de ressources lient les opérations CRUD classiques (Create, Read, Update, Delete) aux méthodes du contrôleur avec une seule ligne de définition de route. Cela suit les conventions RESTful.

## Créer un Contrôleur de Ressources

```bash
php artisan make:controller PostController --resource
```

Cette commande génère un contrôleur avec toutes les méthodes CRUD :

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Affiche une liste de la ressource.
     */
    public function index()
    {
        //
    }

    /**
     * Affiche le formulaire pour créer une nouvelle ressource.
     */
    public function create()
    {
        //
    }

    /**
     * Enregistre une nouvelle ressource.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Affiche la ressource spécifiée.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Affiche le formulaire pour modifier la ressource spécifiée.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Met à jour la ressource spécifiée en base de données.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Supprime la ressource spécifiée de la base de données.
     */
    public function destroy(Post $post)
    {
        //
    }
}
```

## Enregistrer les Routes de Ressources

Une seule ligne crée les 7 routes :

```php
Route::resource('posts', PostController::class);
```

Ceci crée :

| Verbe     | URI                | Action  | Nom de la Route |
| --------- | ------------------ | ------- | --------------- |
| GET       | /posts             | index   | posts.index     |
| GET       | /posts/create      | create  | posts.create    |
| POST      | /posts             | store   | posts.store     |
| GET       | /posts/{post}      | show    | posts.show      |
| GET       | /posts/{post}/edit | edit    | posts.edit      |
| PUT/PATCH | /posts/{post}      | update  | posts.update    |
| DELETE    | /posts/{post}      | destroy | posts.destroy   |

## Ressources Partielles

N'inclure que certaines méthodes :

```php
// Uniquement ces méthodes
Route::resource('posts', PostController::class)->only([
    'index', 'show'
]);

// Toutes sauf celles-ci
Route::resource('posts', PostController::class)->except([
    'create', 'store', 'edit', 'update', 'destroy'
]);
```

## Contrôleurs de Ressources API

Pour les API, vous n'avez pas besoin des méthodes `create` et `edit` (puisqu'elles renvoient généralement des vues de formulaires HTML) :

```bash
php artisan make:controller API/PostController --api
```

Déclarer des routes API :

```php
// Uniquement 5 routes (sans create ni edit)
Route::apiResource('posts', PostController::class);

// Plusieurs ressources API en même temps
Route::apiResources([
    'posts' => PostController::class,
    'comments' => CommentController::class,
]);
```

## Ressources Imbriquées (Nested Resources)

Pour les relations parent-enfant :

```php
// /posts/1/comments, /posts/1/comments/5
Route::resource('posts.comments', CommentController::class);
```

Le contrôleur reçoit les deux modèles (grâce au Route Model Binding) :

```php
class CommentController extends Controller
{
    public function show(Post $post, Comment $comment)
    {
        // Les deux objets $post et $comment sont injectés
    }
}
```

### Imbrication Légère (Shallow Nesting)

Utiliser l'ID parent uniquement lorsque c'est nécessaire (création) :

```php
Route::resource('posts.comments', CommentController::class)->shallow();
```

Cela crée :

- `/posts/{post}/comments` (pour index, create, store)
- `/comments/{comment}` (pour show, edit, update, destroy)

## Nommer les Routes de Ressources

Personnaliser les noms de routes :

```php
Route::resource('posts', PostController::class)->names([
    'create' => 'posts.build',
    'store' => 'posts.save',
]);

// Ou préfixer tous les noms
Route::resource('posts', PostController::class)->names('admin.posts');
// admin.posts.index, admin.posts.create, etc.
```

## Paramètres de Route Personnalisés

Changer le nom du paramètre dans l'URL :

```php
Route::resource('users', UserController::class)->parameters([
    'users' => 'admin_user'
]);
// La route deviendra /users/{admin_user}
```

## Exemple d'un Contrôleur de Ressources Complet

```php
<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PostController extends Controller
{
    public function index(): View
    {
        $posts = Post::latest()->paginate(10);

        return view('posts.index', ['posts' => $posts]);
    }

    public function create(): View
    {
        return view('posts.create');
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $post = Post::create($request->validated());

        return redirect()->route('posts.show', $post)
            ->with('success', 'Article créé avec succès !');
    }

    public function show(Post $post): View
    {
        return view('posts.show', ['post' => $post]);
    }

    public function edit(Post $post): View
    {
        return view('posts.edit', ['post' => $post]);
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $post->update($request->validated());

        return redirect()->route('posts.show', $post)
            ->with('success', 'Article mis à jour avec succès !');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('posts.index')
            ->with('success', 'Article supprimé avec succès !');
    }
}
```

## Ressources

- [Contrôleurs de Ressources](https://laravel.com/docs/12.x/controllers#resource-controllers) — Documentation officielle sur les contrôleurs de ressources

---

> 📘 _Cette leçon fait partie du cours [Routage & Contrôleurs Laravel](/laravel/laravel-routing-controllers/) sur la plateforme d'apprentissage RostoDev._
