---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-query-builder"
---

# Construction Avancée de Requêtes (Query Builder)

Eloquent est construit par-dessus le Constructeur de Requêtes de Laravel (Query Builder), ce qui vous donne accès à de puissantes capacités de requêtage tout en travaillant avec des objets modèles.

## Les Clauses Where

### Where de Base

```php
// Les deux écritures ci-dessous sont identiques (l'opérateur '=' est sous-entendu)
$posts = Post::where('status', 'published')->get();
$posts = Post::where('status', '=', 'published')->get();

// Différents opérateurs
$posts = Post::where('views', '>', 100)->get();
$posts = Post::where('views', '>=', 100)->get();
$posts = Post::where('views', '<>', 0)->get();  // Différent de
$posts = Post::where('title', 'like', '%Laravel%')->get();
```

### Conditions Multiples

```php
// Conditions ET (AND) chainées
$posts = Post::where('status', 'published')
    ->where('category_id', 1)
    ->get();

// Conditions ET sous forme de tableau (plus propre pour de multiples requêtes strictes)
$posts = Post::where([
    ['status', 'published'],
    ['category_id', 1],
])->get();

// Conditions OU (OR)
$posts = Post::where('status', 'published')
    ->orWhere('featured', true)
    ->get();

// Conditions groupées (utilisation de parenthèses pour forcer la priorité logique)
$posts = Post::where('status', 'published')
    ->where(function ($query) {
        $query->where('views', '>', 1000)
              ->orWhere('featured', true);
    })
    ->get();
// SQL généré : WHERE status = 'published' AND (views > 1000 OR featured = true)
```

### Clauses Where Avancées

```php
// whereIn / whereNotIn (Vérifier la présence dans un tableau)
$posts = Post::whereIn('category_id', [1, 2, 3])->get();
$posts = Post::whereNotIn('status', ['draft', 'archived'])->get();

// whereBetween / whereNotBetween (Filtrer sur une plage de valeurs)
$posts = Post::whereBetween('views', [100, 1000])->get();
$posts = Post::whereNotBetween('created_at', [$start, $end])->get();

// whereNull / whereNotNull (Vérifier si une colonne est NULL ou non)
$posts = Post::whereNull('published_at')->get();
$posts = Post::whereNotNull('published_at')->get();

// whereDate / whereMonth / whereYear (Fonctions de dates pratiques)
$posts = Post::whereDate('created_at', '2024-01-15')->get();
$posts = Post::whereMonth('created_at', 12)->get();
$posts = Post::whereYear('created_at', 2024)->get();

// whereColumn (Comparer deux colonnes d'une même table entre elles)
$posts = Post::whereColumn('created_at', 'updated_at')->get();
$posts = Post::whereColumn('views', '>', 'comments_count')->get();
```

## Tri et Pagination

```php
// Order by (Trier par)
$posts = Post::orderBy('created_at', 'desc')->get();
$posts = Post::latest()->get();  // Raccourci pour orderBy('created_at', 'desc')
$posts = Post::oldest()->get();  // Raccourci pour orderBy('created_at', 'asc')
$posts = Post::inRandomOrder()->get(); // Ordre aléatoire (utile pour afficher un contenu "au hasard")

// Tris multiples
$posts = Post::orderBy('featured', 'desc') // D'abord les articles mis en avant
    ->orderBy('created_at', 'desc')        // Puis par date de création plus récente
    ->get();

// Pagination automatisée (remplace le `->get()`)
$posts = Post::paginate(15);  // 15 résultats par page, compte le total des pages
$posts = Post::simplePaginate(15);  // Plus léger en SQL (pas de compte total), affiche juste "Précédent/Suivant"
$posts = Post::cursorPaginate(15);  // Pagination via curseur (ultra performant pour les TRES grandes bases de données)

// Dans votre vue Blade, affichez les liens de pagination :
{{ $posts->links() }}
```

## Sélection de Colonnes Spécifiques

Toujours sélectionner uniquement les colonnes dont vous avez besoin optimise grandement l'utilisation mémoire.

```php
// Sélectionner des colonnes spécifiques
$posts = Post::select('title', 'slug', 'published_at')->get();

// Ajouter des colonnes dynamiquement à une sélection
$posts = Post::select('title')
    ->addSelect('body')
    ->get();

// Distinct (Récupérer des valeurs uniques)
$categories = Post::distinct()->pluck('category_id'); // pluck() récupère un tableau plat d'une seule colonne
```

## Agrégations et Groupements (Group By)

```php
// Agrégations basiques
$count = Post::where('published', true)->count();
$maxViews = Post::max('views');
$avgRating = Post::avg('rating');
$totalViews = Post::sum('views');

// Group by (Grouper par) avec du SQL Brut (Raw)
$postsByCategory = Post::select('category_id', DB::raw('COUNT(*) as count'))
    ->groupBy('category_id')
    ->get();

// Clause Having (Filtrer sur le résultat d'un GROUP BY)
$popularCategories = Post::select('category_id', DB::raw('COUNT(*) as count'))
    ->groupBy('category_id')
    ->having('count', '>', 10)
    ->get();
```

## Les Jointures (Joins)

Bien qu'Eloquent propose des "Relations" (bien plus puissantes que de simples joins SQL), il est souvent nécessaire d'utiliser des JOIN pour des raisons de performances sur des requêtes complexes :

```php
// Inner join (Jointure interne classique)
$posts = Post::join('users', 'posts.user_id', '=', 'users.id')
    ->select('posts.*', 'users.name as author_name')
    ->get();

// Left join (Jointure externe gauche)
$posts = Post::leftJoin('comments', 'posts.id', '=', 'comments.post_id')
    ->select('posts.*', DB::raw('COUNT(comments.id) as comments_count'))
    ->groupBy('posts.id')
    ->get();
```

## Les Portées de Requête Locales (Local Query Scopes)

Les "Scopes" vous permettent de définir des contraintes de requêtes réutilisables dans vos modèles. C'est une excellente pratique pour rendre votre code plus lisible et DRY (Don't Repeat Yourself).

```php
class Post extends Model
{
    /**
     * Scope : Articles publiés uniquement.
     * Le nom de la méthode doit commencer par "scope"
     */
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    /**
     * Scope : Articles mis en avant.
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope paramétré : Articles d'une catégorie spécifique.
     */
    public function scopeOfCategory($query, int $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }
}
```

Utilisation très intuitive et enchaînable :

```php
// Notez qu'on n'utilise pas le préfixe "scope" lors de l'appel !
$posts = Post::published()->get();
$posts = Post::published()->featured()->get();
$posts = Post::published()->ofCategory(1)->latest()->get();
```

## Portées Globales (Global Scopes)

Une portée globale s'applique automatiquement à TOUTES les requêtes effectuées sur un modèle donné.

```php
// Dans le modèle Post
protected static function booted(): void
{
    // Ajoute une condition 'whereNotNull' sur toutes les requêtes Post::...
    static::addGlobalScope('published', function ($query) {
        $query->whereNotNull('published_at');
    });
}

// Si par exception vous souhaitez annuler temporairement cette portée globale :
Post::withoutGlobalScope('published')->get(); // Récupère même les articles non-publiés
```

## Expressions SQL Brutes (Raw Expressions)

Dans certains cas, la complexité du SQL nécessite d'écrire du code brut directement :

```php
// Select Brut (Raw Select)
$posts = Post::select(DB::raw('YEAR(created_at) as year, COUNT(*) as count'))
    ->groupBy('year')
    ->get();

// Where Brut (Raw Where)
$posts = Post::whereRaw('views > comments_count * 10')->get();

// Order Brut (Raw Order)
$posts = Post::orderByRaw('FIELD(status, "featured", "published", "draft")')->get();
```

## Ressources

- [Le Constructeur de Requêtes (Query Builder)](https://laravel.com/docs/12.x/queries) — Documentation complète sur les constructeurs de requêtes dans Laravel

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
