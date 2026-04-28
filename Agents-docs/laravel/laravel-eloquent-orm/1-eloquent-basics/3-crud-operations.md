---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-crud-operations"
---

# Opérations CRUD avec Eloquent

Apprenez à Créer, Lire, Mettre à jour et Supprimer (CRUD - Create, Read, Update, Delete) des enregistrements en utilisant l'API expressive d'Eloquent.

## Opérations de Création (Create)

### Utiliser `save()`

```php
// Créer une instance, définir les propriétés, puis sauvegarder
$post = new Post;
$post->title = 'Mon Premier Article';
$post->body = 'Le contenu de l\'article ici...';
$post->user_id = auth()->id();
$post->save();

// Maintenant, l'instance possède un ID généré par la base de données
echo $post->id;  // 1
```

### Utiliser `create()`

```php
// Créer et sauvegarder en une seule étape (Assignation de masse)
$post = Post::create([
    'title' => 'Mon Premier Article',
    'body' => 'Le contenu de l\'article ici...',
    'user_id' => auth()->id(),
]);
```

**Remarque** : La méthode `create()` exige que les attributs passés en tableau soient déclarés dans la propriété `$fillable` du modèle.

### `firstOrCreate` et `firstOrNew`

```php
// Trouver ou Créer (sauvegarde directement en base de données si non trouvé)
$user = User::firstOrCreate(
    ['email' => 'john@example.com'],      // Critères de recherche
    ['name' => 'John', 'password' => ...] // Champs supplémentaires si création nécessaire
);

// Trouver ou Instancier (ne sauvegarde PAS automatiquement en base de données)
$user = User::firstOrNew(
    ['email' => 'john@example.com'],
    ['name' => 'John']
);
$user->save();  // Nécessite une sauvegarde manuelle
```

### `updateOrCreate` (Upsert / Insérer ou Mettre à jour)

```php
// Met à jour si l'enregistrement existe, sinon le crée
$post = Post::updateOrCreate(
    ['slug' => 'mon-article'],           // Critères de recherche
    ['title' => 'Titre Mis à Jour', ...] // Valeurs à mettre à jour / créer
);
```

## Opérations de Lecture (Read)

### Récupérer un Seul Enregistrement

```php
// Trouver par la clé primaire
$post = Post::find(1);

// Trouver plusieurs enregistrements par leurs clés primaires
$posts = Post::find([1, 2, 3]);

// Trouver ou Échouer (lance une ModelNotFoundException si introuvable, ce qui génère une erreur 404 automatique)
$post = Post::findOrFail(1);

// Exemple très pratique dans une route :
Route::get('/posts/{id}', function ($id) {
    $post = Post::findOrFail($id);  // 404 automatique si l'article n'existe pas
    return view('posts.show', compact('post'));
});

// Le premier enregistrement correspondant aux critères
$post = Post::where('slug', 'mon-article')->first();
$post = Post::where('slug', 'mon-article')->firstOrFail();
```

### Récupérer Plusieurs Enregistrements

```php
// Tous les enregistrements (attention aux grosses tables !)
$posts = Post::all();

// Avec des conditions
$posts = Post::where('published', true)->get();

// Combinaisons de conditions (AND) et tris
$posts = Post::where('published', true)
    ->where('category_id', 1)
    ->orderBy('created_at', 'desc')
    ->get();

// Conditions OU (OR)
$posts = Post::where('featured', true)
    ->orWhere('views', '>', 1000)
    ->get();
```

### Traitement par Lots pour les Grands Volumes de Données

Pour traiter des milliers d'enregistrements sans saturer la mémoire (RAM) :

```php
// Traiter par blocs de 100 enregistrements à la fois
Post::chunk(100, function ($posts) {
    foreach ($posts as $post) {
        // Traiter chaque article
    }
});

// Utilisation d'un générateur `lazy()` (plus moderne et efficace en mémoire)
foreach (Post::lazy() as $post) {
    // Processus un par un
}

// `cursor()` pour une efficacité mémoire optimale (n'hydrate qu'un seul modèle Eloquent à la fois)
foreach (Post::cursor() as $post) {
    // A utiliser pour lire d'immenses bases de données
}
```

### Fonctions d'Agrégation (Aggregates)

```php
$count = Post::count(); // Compter
$max = Post::max('views'); // Maximum
$min = Post::min('views'); // Minimum
$avg = Post::avg('views'); // Moyenne
$sum = Post::sum('views'); // Somme

// Vérifier l'existence de façon optimisée (ne récupère pas toutes les données)
$exists = Post::where('slug', 'mon-article')->exists();
$doesntExist = Post::where('slug', 'mon-article')->doesntExist();
```

## Opérations de Mise à Jour (Update)

### Mettre à Jour un Seul Enregistrement

```php
$post = Post::find(1);
$post->title = 'Titre Mis à Jour';
$post->save();

// Ou en une seule ligne (nécessite $fillable)
$post = Post::find(1);
$post->update(['title' => 'Titre Mis à Jour']);
```

### Mises à Jour de Masse

```php
// Mettre à jour plusieurs enregistrements d'un coup
Post::where('published', false)
    ->update(['status' => 'draft']);

// Incrémenter / Décrémenter une valeur numérique
Post::where('id', 1)->increment('views');
Post::where('id', 1)->increment('views', 5);  // Incrémenter de 5
Post::where('id', 1)->decrement('stock');

// Incrémenter avec des mises à jour de champs supplémentaires
$post->increment('views', 1, ['last_viewed_at' => now()]);
```

### Vérifier les Changements (Dirty State)

Eloquent garde en mémoire l'état initial pour savoir si des propriétés ont été modifiées avant la sauvegarde.

```php
$post = Post::find(1);
$post->title = 'Nouveau Titre';

$post->isDirty();           // true - des attributs non sauvegardés ont changé
$post->isDirty('title');    // true - cet attribut précis a changé
$post->isDirty('body');     // false - cet attribut n'a pas changé
$post->isClean();           // false - le modèle a des modifications non sauvegardées

$post->save(); // On sauvegarde

$post->wasChanged();        // true - le modèle vient d'être sauvegardé avec des changements
$post->wasChanged('title'); // true
```

## Opérations de Suppression (Delete)

```php
// Supprimer une instance spécifique de modèle
$post = Post::find(1);
$post->delete();

// Supprimer directement par clé primaire (sans charger le modèle avant)
Post::destroy(1);
Post::destroy([1, 2, 3]);
Post::destroy(1, 2, 3); // Même résultat

// Supprimer avec des conditions
Post::where('published', false)->delete();

// Vider complètement la table (Truncate)
Post::truncate();  // Attention : les événements de modèle (Model events) NE SERONT PAS déclenchés !
```

## La Suppression Douce (Soft Deletes)

Permet de "supprimer" des enregistrements dans l'application, tout en les conservant physiquement dans la base de données (corbeille).

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    // Ajoute le comportement de "corbeille" au modèle
    use SoftDeletes;
}
```

Nécessite d'ajouter la colonne `deleted_at` dans votre migration :

```php
$table->softDeletes();  // Ajoute la colonne `deleted_at`
```

Utilisation :

```php
$post->delete();  // Remplit la colonne deleted_at avec la date du jour; la ligne reste en BDD.

// Requêtes avec la suppression douce
Post::all();                     // Ne retournera PAs les articles supprimés !

Post::withTrashed()->get();      // Inclure les articles supprimés ET non supprimés
Post::onlyTrashed()->get();      // UNIQUEMENT les articles supprimés (la corbeille)

// Restaurer un enregistrement
$post->restore(); // Vide la colonne deleted_at

// Supprimer définitivement de la base de données
$post->forceDelete();
```

## Ressources

- [Insérer & Mettre à jour des Modèles](https://laravel.com/docs/12.x/eloquent#inserting-and-updating-models) — Documentation officielle sur les opérations CRUD

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
