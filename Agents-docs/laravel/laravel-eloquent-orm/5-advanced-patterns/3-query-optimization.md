---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-query-optimization"
---

# Techniques d'Optimisation des Requêtes

Optimiser les requêtes vers la base de données est crucial pour les performances de votre application. Apprenez les techniques pour écrire des requêtes efficaces et éviter les pièges les plus courants de l'ORM.

## Prévenir le Problème des N+1 Requêtes

C'est LE problème de performance le plus fréquent avec n'importe quel ORM :

```php
// ❌ Problème N+1 : 101 requêtes pour afficher 100 articles
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->user->name;  // Exécute 1 nouvelle requête à chaque itération !
}

// ✅ Eager loading (Chargement anticipé) : 2 requêtes au total
$posts = Post::with('user')->get();
foreach ($posts as $post) {
    echo $post->user->name;  // Aucune requête supplémentaire, récupéré de la mémoire
}
```

### Activer le Mode Strict (Strict Mode) en Développement

Pour éviter que cela ne se produise accidentellement, demandez à Laravel de planter dès qu'il détecte un N+1, mais uniquement en local !

```php
// Dans AppServiceProvider.php
use Illuminate\Database\Eloquent\Model;

public function boot(): void
{
    // Lève une exception si l'application n'est pas en mode "production"
    Model::preventLazyLoading(! app()->isProduction());
}
```

Maintenant, tout `Lazy Loading` non prévu fera planter le code avec une erreur explicite pendant votre développement !

## Sélectionner Uniquement ce Dont Vous Avez Besoin (Select)

Le légendaire `SELECT *` consomme beaucoup de RAM côté serveur si la table a beaucoup de colonnes ou de longues chaînes de texte (`LONGTEXT`).

```php
// ❌ Sélectionne toutes les colonnes de tous les utilisateurs
$users = User::all();

// ✅ Sélectionne uniquement l'ID, le nom et l'email
$users = User::select('id', 'name', 'email')->get();

// ✅ Lors du chargement anticipé (with), vous pouvez aussi filtrer les colonnes
// ⚠️ Attention : Vous DEVEZ inclure la clé primaire/étrangère sinon Eloquent ne pourra pas faire le lien !
$posts = Post::with('user:id,name')->get();

// ❌ Pluck executé sur la Collection (après get/all) va d'abord récupérer TOUTES les colonnes !
$names = User::all()->pluck('name'); // Très gourmand

// ✅ Pluck exécuté directement sur la Requête limitera les colonnes depuis SQL
$names = User::pluck('name'); // Effectue un: SELECT name FROM users
```

## Utiliser le "Chunking" (Morcellement) pour les Grandes Tables

```php
// ❌ Charge 50 000 utilisateurs en mémoire RAM d'un coup. Le serveur va planter (Allowed memory size exhausted)
$users = User::all();
foreach ($users as $user) {
    // Traitement...
}

// ✅ Traite par lots de 100 (Utilise un LIMIT et OFFSET en SQL)
User::chunk(100, function ($users) {
    foreach ($users as $user) {
        // Traitement...
    }
});

// ✅ Encore plus lisible : le Lazy Loading (Yields / Générateurs PHP)
// Laravel gère les requêtes par paquets de 1000 magiquement en arrière-plan.
foreach (User::lazy() as $user) {
    // Processus un par un
}

// ✅ Le TOP pour la mémoire : curseur (Cursor)
// Garde une seule connexion SQL ouverte et stream les résultats 1 par 1.
foreach (User::cursor() as $user) {
    // Utilisation minimale de la RAM, très performant
}
```

### Quand utiliser quelle méthode ?

| Méthode    | Consommation RAM | Cas d'usage idéal                                          |
| ---------- | ---------------- | ---------------------------------------------------------- |
| `get()`    | Élevée           | Petits ensembles de données (< 1000 lignes)                |
| `chunk()`  | Moyenne          | Mettre à jour des données en masse (avec appel à `save()`) |
| `lazy()`   | Faible           | Opérations de lecture (reports, export CSV)                |
| `cursor()` | Très Faible      | Très grands jeux de données (millions de lignes)           |

## Optimiser les Comptages (Counts)

```php
// ❌ Charge TOUS les modèles en RAM PHP juste pour en compter la taille !
$count = Post::all()->count();

// ✅ Compte directement au niveau de la base de données SQL (Extrêmement rapide)
$count = Post::count(); // Fait un SELECT COUNT(*) FROM posts;

// ❌ Charge tous les attributs de tous les commentaires juste pour les compter !
$posts = Post::all();
foreach ($posts as $post) {
    echo $post->comments->count();
}

// ✅ Utilisez withCount() pour créer une propriété dynamique
$posts = Post::withCount('comments')->get();  // Fait une requête très performante
foreach ($posts as $post) {
    echo $post->comments_count;  // La donnée est déjà chargée, c'est juste un chiffre !
}
```

## Chargement Anticipé Conditionnel (Conditional Eager Loading)

```php
// Charger que si une condition PHP est vraie
$posts = Post::when($includeAuthor, function ($query) {
    $query->with('user');
})->get();

// Charger après-coup (Lazy Eager Loading)
$posts = Post::all();
if ($showComments) {
    $posts->load('comments');  // Exécute 1 requête pour tous au lieu de N+1
}

// Ne pas recharger si cela a déjà été fait ailleurs dans le code
$posts->loadMissing('tags');
```

## L'Indexation dans la Base de Données

Tout bon développeur backend doit comprendre ce qu'est un Index SQL. Eloquent vous aide à les créer.

```php
// Dans un fichier de migration - Ajouter des index sur les colonnes souvent ciblées par `where()`
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->string('status');
    $table->timestamp('published_at')->nullable();
    $table->timestamps();

    // Index composé pour les requêtes très courantes cherchant les articles publiés avant X date
    $table->index(['status', 'published_at']);

    // Index pour cibler le statut des posts d'un utilisateur spécifique
    $table->index(['user_id', 'status']);
});
```

Requêtes qui profiteront désormais d'une vitesse foudroyante :

```php
// Utilise parfaitement l'index ['status', 'published_at'] !
Post::where('status', 'published')
    ->where('published_at', '<=', now())
    ->get();
```

## Optimiser les Vérifications d'Existence (Exists)

```php
// ❌ Charge le modèle entier et tous ses attributs depuis la BDD (et donc le parsing PHP)
if (User::find($id)) {
    // ...
}

// ✅ Fait une requête ultra rapide et retourne juste true ou false
if (User::where('id', $id)->exists()) {
    // ...
}

// ❌ Charge TOUS les articles en RAM pour juste vérifier si la taille dépasse 0
if ($user->posts->count() > 0) {
    // ...
}

// ✅ Vérifie l'existence directement au niveau SQL (La requête s'arrête dès qu'elle trouve 1 résultat)
if ($user->posts()->exists()) {
    // Notez l'utilisation primordiale des parenthèses ->posts() pour taper sur la BDD !
}
```

## Utiliser le Cache de Requête

```php
use Illuminate\Support\Facades\Cache;

// Mettre en cache les requêtes coûteuses
// Le résultat ne sera recalculé que toutes les 3600 secondes (1 heure)
$posts = Cache::remember('popular_posts', 3600, function () {
    return Post::withCount('comments')
        ->orderBy('comments_count', 'desc')
        ->take(10)
        ->get();
});

// Purger/Invalider le cache lorsque la donnée change !
// (À placer par exemple dans le PostObserver :)
public function saved(Post $post): void
{
    Cache::forget('popular_posts');
}
```

## Requêtes Nues (Raw Queries) pour les Opérations Complexes

Parfois, faire une requête SQL à la main est bien plus performant qu'utiliser les modèles d'Eloquent ou sa conversion "Objet".

```php
// Exécuter du SQL pur
$results = DB::select('
    SELECT users.*, COUNT(posts.id) as posts_count
    FROM users
    LEFT JOIN posts ON users.id = posts.user_id
    WHERE users.active = 1
    GROUP BY users.id
    HAVING posts_count > 10
    ORDER BY posts_count DESC
    LIMIT 10
');

// Ou utiliser les expressions Raw du Query Builder
$users = User::select('users.*')
    ->selectRaw('COUNT(posts.id) as posts_count')
    ->leftJoin('posts', 'users.id', '=', 'posts.user_id')
    ->where('users.active', true)
    ->groupBy('users.id')
    ->havingRaw('COUNT(posts.id) > 10')
    ->orderByDesc('posts_count')
    ->limit(10)
    ->get();
```

## Monitorer (Surveiller) Vos Requêtes

```php
// Logger toutes les requêtes en environnement de développement
DB::listen(function ($query) {
    Log::debug('Requête SQL Exécutée', [
        'sql' => $query->sql,            // La requête brute avec ?
        'bindings' => $query->bindings,   // Les variables remplaçant les ?
        'time' => $query->time,           // Temps d'exécution en millisecondes
    ]);
});

// Astuce : Utilisez les excellents paquets "Laravel Debugbar" ou "Laravel Telescope" !
```

## Ressources

- [Performance des Bases de Données](https://laravel.com/docs/12.x/eloquent#retrieving-models) — Conseils de récupération et de performances d'Eloquent

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
