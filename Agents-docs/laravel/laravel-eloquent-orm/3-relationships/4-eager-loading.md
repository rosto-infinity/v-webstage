---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-eager-loading"
---

# Le Chargement Anticipé (Eager Loading) et le Problème N+1

Le problème N+1 est un souci de performance très courant où votre application effectue un nombre excessif de requêtes en base de données de manière silencieuse. Le chargement anticipé (Eager Loading) est la solution à ce problème.

## Le Problème N+1

Imaginez que vous voulez afficher une liste de 100 articles avec le nom de leur auteur.

```php
// ❌ MAUVAIS : Problème des N+1 requêtes (Lazy Loading)
$posts = Post::all();  // 1 requête pour récupérer TOUS les articles

foreach ($posts as $post) {
    echo $post->user->name;  // ⚠️ 1 NOUVELLE requête pour CHAQUE utilisateur d'article !
}

// Si vous avez 100 articles = 101 requêtes au total !
```

Voici ce qu'il se passe côté base de données MySQL :

```sql
-- Requête 1
SELECT * FROM posts;

-- Requête 2 (pour l'article 1)
SELECT * FROM users WHERE id = 1;

-- Requête 3 (pour l'article 2)
SELECT * FROM users WHERE id = 2;

-- ... et 98 autres requêtes identiques !
```

Le temps de latence réseau pour faire ces 100 allers-retours vers la base de données va ralentir considérablement votre page web.

## Le Chargement Anticipé avec `with()`

La solution est de dire à Eloquent de "_charger au préalable_" la relation `user` en même temps que les articles.

```php
// ✅ BON : Seulement 2 requêtes (Eager Loading)
$posts = Post::with('user')->get();

foreach ($posts as $post) {
    echo $post->user->name;  // Plus aucune requête supplémentaire ! La donnée est déjà en mémoire.
}
```

Voici ce que fait Eloquent en arrière-plan :

```sql
-- Requête 1
SELECT * FROM posts;

-- Requête 2
SELECT * FROM users WHERE id IN (1, 2, 3, ...);  -- Tous les utilisateurs d'un coup !
```

Eloquent se charge ensuite d'associer en mémoire PHP chaque utilisateur avec le bon article. C'est extrêmement rapide.

## Charger Plusieurs Relations

```php
// Charger plusieurs relations d'un coup
$posts = Post::with(['user', 'category', 'tags'])->get(); // 4 requêtes au total

// Relations imbriquées (Nested relationships) grâce au "Point" (.)
$posts = Post::with('user.profile')->get();  // Charge l'article, son auteur, et le profil de l'auteur

// Multiples relations imbriquées
$posts = Post::with([
    'user.profile',
    'comments.author', // L'article, ses commentaires, et les auteurs de ces commentaires !
    'tags',
])->get();
```

## Restreindre le Chargement Anticipé (Constraints)

Parfois, charger _tous_ les enregistrements liés est une mauvaise idée, ou bien vous n'avez besoin que de données très précises.

```php
// Ne charger que des colonnes spécifiques pour optimiser la RAM
// ⚠️ Attention : Vous DEVEZ inclure la clé étrangère (id) sinon le lien ne pourra pas se faire !
$posts = Post::with('user:id,name,email')->get();
$posts = Post::with('comments:id,post_id,body')->get();

// Avec des conditions avancées (closures)
$posts = Post::with(['comments' => function ($query) {
    $query->where('approved', true) // Ne charge que les commentaires approuvés
          ->orderBy('created_at', 'desc');
}])->get();

// Combiner les chargements : Utilisateurs, ET pour chacun uniquement leurs commentaires approuvés
$users = User::with(['posts', 'posts.comments' => function ($query) {
    $query->where('approved', true);
}])->get();
```

## Le Chargement Anticipé a Posteriori (Lazy Eager Loading)

Que faire si vous avez déjà un objet, mais que vous réalisez _plus tard_ dans le code que vous allez avoir besoin d'une relation ?

```php
$posts = Post::all();  // Chargé sans relations

// Plus tard, si une certaine condition est remplie
if ($showComments) {
    $posts->load('comments');  // Exécute 1 seule requête pour charger les commentaires de TOUS les articles
}

// Avec contraintes
$posts->load(['comments' => function ($query) {
    $query->where('approved', true);
}]);

// Charger uniquement si ça n'a pas déjà été chargé
$posts->loadMissing('user');
```

## Chargement Anticipé par Défaut (Always Eager Load)

Si une relation est absolument _toujours_ requise (ex: le statut d'un article ou son auteur), vous pouvez forcer Eloquent à la charger par défaut sur le modèle.

```php
class Post extends Model
{
    /**
     * Les relations qui doivent TOUJOURS être chargées.
     */
    protected $with = ['user', 'category'];
}

// Désormais, l'utilisateur est toujours là
$posts = Post::all();  // Inclut automatiquement 'user' et 'category' (3 requêtes)

// Surcharger le comportement si pour *cette* requête vous n'en voulez pas
$posts = Post::without('category')->get();
```

## Interdire le Lazy Loading (Mode Strict)

La meilleure façon de résoudre le problème N+1 est d'empêcher les développeurs de le créer ! Laravel permet de faire "planter" le code s'il détecte un N+1, ce qui vous force à le corriger avant de mettre en production.

```php
// Dans la méthode boot() de AppServiceProvider
use Illuminate\Database\Eloquent\Model;

public function boot(): void
{
    // Ne "plante" qu'en développement local, reste silencieux en production
    Model::preventLazyLoading(! $this->app->isProduction());
}
```

Maintenant, accéder à une relation non chargée génèrera une erreur :

```php
$post = Post::first();  // Pas de with('user')
$post->user;  // 🔴 Lève une exception "LazyLoadingViolationException" en mode dev !
```

## Compter les Enregistrements Liés sans les Charger

Très souvent, on veut juste savoir _combien_ de commentaires il y a, sans avoir besoin du contenu entier des milliers de commentaires.

```php
// Compter (en SQL) sans charger les données
$posts = Post::withCount('comments')->get();

foreach ($posts as $post) {
    echo $post->comments_count;  // C'est un intègre, pas une Collection !
}

// Compter plusieurs sous-relations
$users = User::withCount(['posts', 'comments'])->get();
// Vous donne : $user->posts_count, $user->comments_count

// Compter avec des conditions
$posts = Post::withCount(['comments' => function ($query) {
    $query->where('approved', true);
}])->get();
```

## Autres Fonctions d'Agrégation sur les Relations

Depuis Laravel 8+, vous pouvez faire plus que juste "compter" :

```php
// Somme
$posts = Post::withSum('comments', 'upvotes')->get();
// Crée la propriété : $post->comments_sum_upvotes

// Moyenne
$posts = Post::withAvg('ratings', 'score')->get();
// Crée la propriété : $post->ratings_avg_score

// Min / Max
$posts = Post::withMin('comments', 'created_at')->get();
$posts = Post::withMax('comments', 'created_at')->get();

// Vérifier simplement l'existence (EXISTS sql)
$posts = Post::withExists('comments')->get();
// Crée la propriété booléenne : $post->comments_exists
```

## Bonnes Pratiques en Résumé

```php
// ✅ TOUJOURS utiliser Eager Loading si vous itérez sur une Collection
$posts = Post::with('user')->get();
foreach ($posts as $post) {
    echo $post->user->name;
}

// ✅ Être précis sur ce que l'on charge pour la mémoire Serveur
$posts = Post::with('user:id,name')->get();

// ✅ Utiliser withCount() si on a juste besoin d'un nombre
$posts = Post::withCount('comments')->get();

// ❌ NE PAS tout charger aveuglement
$posts = Post::with(['user', 'comments', 'tags', 'category', 'files'])->get();

// ❌ Éviter de charger des choses qui ne seront peut-être pas affichées
if ($showAuthor) {
    $posts->load('user');  // ->load() au moment venu est plus intelligent
}
```

## Ressources

- [Le Chargement Anticipé (Eager Loading)](https://laravel.com/docs/12.x/eloquent-relationships#eager-loading) — Documentation officielle sur l'Eager Loading

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
