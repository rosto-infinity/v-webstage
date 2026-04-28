---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-one-to-many-relationships"
---

# Relations Un-à-Plusieurs (One-to-Many)

C'est le type de relation le plus courant. Un enregistrement parent possède plusieurs enregistrements enfants. Par exemple, un Utilisateur (`User`) a écrit plusieurs Articles (`Post`), ou un Article possède plusieurs Commentaires (`Comment`).

## Définir une relation Un-à-Plusieurs

### `hasMany` (Côté Parent)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    /**
     * Obtenir les articles de l'utilisateur.
     * Notez le nom au pluriel "posts()"
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
```

### `belongsTo` (Côté Enfant)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    /**
     * Obtenir l'utilisateur qui a écrit cet article.
     * Notez le nom au singulier "user()"
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
```

## Structure de la Base de Données

```text
users                          posts
┌────┬──────────┐              ┌────┬─────────┬─────────────────┐
│ id │ name     │              │ id │ user_id │ title           │
├────┼──────────┤              ├────┼─────────┼─────────────────┤
│ 1  │ "John"   │◄────────────│ 1  │ 1       │ "Premier Article"│
│    │          │◄────────────│ 2  │ 1       │ "Second Article" │
│ 2  │ "Jane"   │◄────────────│ 3  │ 2       │ "L'article de Jane"│
└────┴──────────┘              └────┴─────────┴─────────────────┘
                                   Un utilisateur possède PLUSIEURS articles
```

## Accéder aux Enregistrements Liés

```php
// Obtenir tous les articles d'un utilisateur (retourne une Collection Eloquent)
$user = User::find(1);
$posts = $user->posts;  // C'est une Collection de modèles Post

// On peut itérer dessus
foreach ($user->posts as $post) {
    echo $post->title;
}

// Interroger la relation (Ne pas ajouter de parenthèses pour obtenir la Collection, les ajouter pour obtenir le constructeur de requête)
$publishedPosts = $user->posts() // Notez les parenthèses ()
    ->where('published', true)
    ->orderBy('created_at', 'desc')
    ->get(); // Exécute la requête avec les filtres supplémentaires

// Compter sans charger tous les modèles en mémoire (Très performant)
$postCount = $user->posts()->count();

// Obtenir le parent depuis l'enfant
$post = Post::find(1);
$author = $post->user;  // Retourne le modèle User

echo $post->user->name;  // "John"
```

## Créer des Enregistrements Liés

```php
$user = User::find(1);

// Méthode 1 : save() - Enregistre une seule instance déjà créée
$post = new Post(['title' => 'Mon Article', 'body' => '...']);
$user->posts()->save($post);

// Méthode 2 : create() - Crée et enregistre en une seule étape (utilise $fillable)
$post = $user->posts()->create([
    'title' => 'Mon Article',
    'body' => '...',
]);

// Méthode 3 : saveMany() - Enregistre plusieurs instances existantes
$user->posts()->saveMany([
    new Post(['title' => 'Article 1']),
    new Post(['title' => 'Article 2']),
]);

// Méthode 4 : createMany() - Crée plusieurs enregistrements via des tableaux
$user->posts()->createMany([
    ['title' => 'Article 1', 'body' => '...'],
    ['title' => 'Article 2', 'body' => '...'],
]);
```

## Mettre à jour le Parent depuis l'Enfant

```php
$post = Post::find(1);

// Associer un nouvel utilisateur (Changer d'auteur)
$newUser = User::find(2);
$post->user()->associate($newUser);
$post->save();

// Dissocier l'utilisateur (Met user_id à NULL - nécessite que la colonne soit nullable)
$post->user()->dissociate();
$post->save();
```

## Propriétés Magiques vs Méthodes de Relation

Il est vital de comprendre la différence entre `$user->posts` et `$user->posts()` :

```php
// Accès via la propriété magique - Exécute la requête, la met en cache, et retourne la Collection
$posts = $user->posts;  // Fait un SELECT * FROM posts WHERE user_id = 1
$posts = $user->posts;  // ⚡ Ne refait PAS de requête, retourne la Collection mise en cache

// Accès via la méthode - Retourne le constructeur de requête (Query Builder)
$query = $user->posts();  // Ne fait aucune requête SQL !
$query = $user->posts()->where('published', true)->get(); // Vous décidez quand faire la requête et avec quels filtres
```

## Restreindre le Chargement Anticipé (Eager Loading Constraints)

```php
// Ne charger que les articles publiés pour chaque utilisateur
$users = User::with(['posts' => function ($query) {
    $query->where('published', true)
          ->orderBy('created_at', 'desc');
}])->get();

// Raccourci pour des contraintes simples (Limiter les colonnes retournées)
// Toujours inclure la clé étrangère ('user_id') sinon Eloquent ne pourra pas faire le lien !
$users = User::with('posts:id,user_id,title')->get();
```

## Compter les Enregistrements Liés

```php
// Compter tous les articles lors du chargement des utilisateurs (Eager load count)
$users = User::withCount('posts')->get();

foreach ($users as $user) {
    // Une nouvelle propriété magique {relation}_count a été ajoutée
    echo $user->posts_count;
}

// Compter avec des conditions
$users = User::withCount(['posts' => function ($query) {
    $query->where('published', true);
}])->get();

foreach ($users as $user) {
    echo $user->posts_count;  // Nombre d'articles publiés uniquement
}

// Compter plusieurs relations
$users = User::withCount(['posts', 'comments'])->get();
// Vous aurez accès à : $user->posts_count et $user->comments_count
```

## Vérifier l'Existence d'Enregistrements Liés

```php
// Utilisateurs ayant au moins un article
$usersWithPosts = User::has('posts')->get();

// Utilisateurs ayant au moins 5 articles
$activeAuthors = User::has('posts', '>=', 5)->get();

// WHERE HAS : Utilisateurs ayant des articles répondant à une condition
$usersWithPublished = User::whereHas('posts', function ($query) {
    $query->where('published', true);
})->get();

// DOESN'T HAVE : Utilisateurs n'ayant AUCUN article
$usersWithoutPosts = User::doesntHave('posts')->get();
```

## Ressources

- [Relations Un-à-Plusieurs](https://laravel.com/docs/12.x/eloquent-relationships#one-to-many) — Documentation officielle sur les relations Un-à-Plusieurs

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
