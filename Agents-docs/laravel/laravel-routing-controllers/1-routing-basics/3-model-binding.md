---
source_course: "laravel-routing-controllers"
source_lesson: "laravel-routing-controllers-route-model-binding"
---

# Plongée au cœur du Route Model Binding (Liaison Modèle-Route)

La liaison modèle-route (Route Model Binding) injecte automatiquement des instances de vos modèles directement dans vos routes ou vos contrôleurs. Au lieu de faire manuellement une requête à la base de données, Laravel s'en occupe pour vous.

## Liaison Implicite (Implicit Binding)

Laravel résout automatiquement les modèles Eloquent en faisant correspondre le nom de la variable avec le segment de la route :

```php
// Définition de la route
Route::get('/users/{user}', function (User $user) {
    return $user;
});

// Lorsqu'on visite /users/1 :
// 1. Laravel voit {user} dans la route
// 2. Voit le type-hint `User $user` dans la fonction
// 3. Exécute automatiquement `User::findOrFail(1)`
// 4. Injecte l'instance `User` trouvée directement dans votre fonction
```

### Dans les Contrôleurs

```php
// routes/web.php
Route::get('/posts/{post}', [PostController::class, 'show']);

// app/Http/Controllers/PostController.php
class PostController extends Controller
{
    public function show(Post $post)  // Résolu automatiquement !
    {
        return view('posts.show', ['post' => $post]);
    }
}
```

### Personnaliser la Clé de Recherche

Par défaut, les modèles sont recherchés par leur clé primaire (l'ID). Pour utiliser une autre colonne :

```php
// Dans la route
Route::get('/posts/{post:slug}', function (Post $post) {
    return $post;
});
// /posts/mon-premier-article → recherche par la colonne slug

// Ou dans le modèle
class Post extends Model
{
    /**
     * Obtenir le nom de la clé de route pour le modèle.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
// Désormais, {post} sera toujours résolu via la colonne slug
```

## Liaisons Ciblées (Scoped Bindings)

Assurez-vous que les modèles enfants appartiennent bien aux modèles parents :

```php
Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
    return $post;
});

// Sans scoping : /users/1/posts/5 retournerait l'article 5 même s'il appartient à l'utilisateur 2
// Avec scoping : Retourne une erreur 404 si l'article n'appartient pas à l'utilisateur
```

Activer le scoping :

```php
// Méthode 1 : Utiliser scopeBindings()
Route::get('/users/{user}/posts/{post}', function (User $user, Post $post) {
    return $post;
})->scopeBindings();

// Méthode 2 : Dans un groupe de routes
Route::scopeBindings()->group(function () {
    Route::get('/users/{user}/posts/{post}', ...);
});
```

Ceci nécessite que la relation `posts()` existe sur le modèle `User` :

```php
class User extends Model
{
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

## Liaison Explicite (Explicit Binding)

Personnalisez comment les modèles sont résolus dans `AppServiceProvider` :

```php
use App\Models\User;
use Illuminate\Support\Facades\Route;

public function boot(): void
{
    // Logique de résolution personnalisée
    Route::bind('user', function (string $value) {
        return User::where('name', $value)->firstOrFail();
    });
}

// Désormais, {user} se résout par le nom au lieu de l'ID
```

## Logique de Résolution Personnalisée dans les Modèles

Remplacer la façon dont un modèle résout la liaison de route :

```php
class User extends Model
{
    /**
     * Récupérer le modèle correspondant à une valeur liée.
     */
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        // Logique personnalisée : inclure les éléments supprimés (soft-deleted) pour les admins
        return $this->where($field ?? 'id', $value)
                    ->when(auth()->user()?->isAdmin(), fn ($q) => $q->withTrashed())
                    ->firstOrFail();
    }
}
```

## Gérer les Modèles Introuvables

Par défaut, si un modèle n'est pas trouvé, Laravel retourne une erreur 404. Vous pouvez personnaliser cela :

```php
Route::get('/users/{user}', function (User $user) {
    return $user;
})->missing(function (Request $request) {
    return redirect()->route('users.index')
        ->with('error', 'Utilisateur introuvable');
});
```

## Modèles Supprimés (Soft Deleted Models)

Inclure les modèles supprimés de façon logicielle (soft-deleted) :

```php
Route::get('/users/{user}', function (User $user) {
    return $user;
})->withTrashed();  // Inclure les utilisateurs supprimés (soft-deleted)
```

## Liaison d'Enum (Enum Binding)

Les Enums adossés (backed enums) de PHP 8.1+ fonctionnent avec la liaison de route :

```php
// Définir un Enum
enum Category: string
{
    case Fruits = 'fruits';
    case Vegetables = 'legumes';
}

// Utiliser dans une route
Route::get('/categories/{category}', function (Category $category) {
    return $category->value;
});
// /categories/fruits → 'fruits'
// /categories/invalide → Erreur 404
```

## Bonnes Pratiques

```php
// ✅ Bien : Utiliser le Route Model Binding
Route::get('/users/{user}', function (User $user) {
    return $user;
});

// ❌ À Éviter : Recherche manuelle
Route::get('/users/{id}', function ($id) {
    $user = User::findOrFail($id);  // Inutile
    return $user;
});

// ✅ Bien : Lier (Scoper) les ressources imbriquées
Route::get('/users/{user}/posts/{post:slug}', function (User $user, Post $post) {
    return $post;
})->scopeBindings();
```

## Ressources

- [Route Model Binding](https://laravel.com/docs/12.x/routing#route-model-binding) — Documentation officielle sur la liaison modèle-route

---

> 📘 _Cette leçon fait partie du cours [Routage & Contrôleurs Laravel](/laravel/laravel-routing-controllers/) sur la plateforme d'apprentissage RostoDev._
