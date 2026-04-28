---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-introduction-to-blade"
---

# Introduction aux Templates Blade

Blade est le puissant moteur de templates fourni avec Laravel. Contrairement aux autres moteurs de templates PHP, Blade ne vous empêche pas d'utiliser du code PHP brut dans vos vues — mais il offre de nombreux raccourcis qui rendent vos templates beaucoup plus propres et lisibles.

## Qu'est-ce que Blade ?

Les templates Blade :

- Utilisent l'extension de fichier `.blade.php`
- Se trouvent dans le dossier `resources/views/`
- Sont compilés en code PHP natif puis mis en cache
- N'ajoutent pratiquement aucune charge supplémentaire (overhead) au temps d'exécution de votre application

## Créer des Vues (Views)

Les vues sont stockées dans le dossier `resources/views/` :

```
resources/views/
├── welcome.blade.php
├── layouts/
│   └── app.blade.php
├── posts/
│   ├── index.blade.php
│   ├── show.blade.php
│   └── create.blade.php
└── components/
    └── alert.blade.php
```

## Retourner des Vues

Depuis des routes :

```php
// Vue simple
Route::get('/', function () {
    return view('welcome');
});

// Vue imbriquée dans un sous-dossier (posts/index.blade.php)
Route::get('/posts', function () {
    // On utilise le point (.) pour séparer les dossiers du nom du fichier
    return view('posts.index');
});
```

Depuis des contrôleurs :

```php
class PostController extends Controller
{
    public function index()
    {
        $posts = Post::all();

        // Le second argument de view() est un tableau de données qu'on passe à la vue
        return view('posts.index', ['posts' => $posts]);
    }

    // Syntaxe alternative plus courte : utiliser la fonction compact() de PHP
    public function show(Post $post)
    {
        return view('posts.show', compact('post'));
    }

    // Autre syntaxe : utiliser la méthode en chaîne with()
    public function create()
    {
        return view('posts.create')
            ->with('categories', Category::all());
    }
}
```

## Afficher des Données

Les doubles accolades (`{{ }}`) de Blade servent à afficher (echo) des données. Elles filtrent automatiquement la sortie HTML (`htmlspecialchars`) pour éviter les attaques XSS.

```blade
<!-- Sortie protégée (sécurisée contre les failles XSS) -->
<h1>{{ $title }}</h1>
<p>{{ $user->name }}</p>

<!-- Gérer les valeurs nulles avec l'opérateur de coalescence nulle (??) -->
<p>{{ $user->bio ?? 'Aucune biographie disponible' }}</p>

<!-- Les entités HTML sont protégées/échappées -->
{{ '<script>alert("XSS")</script>' }}
<!-- Sortie : &lt;script&gt;alert("XSS")&lt;/script&gt; -->
```

### Données Non Protégées (Unescaped Data)

Si vous voulez afficher du contenu HTML tel quel (à utiliser avec grande prudence !) :

```blade
<!-- Non protégé - UNIQUEMENT pour du contenu en qui vous avez une totale confiance -->
{!! $post->html_content !!}

<!-- ATTENTION : C'est vulnérable aux failles XSS si la donnée ne provient pas d'une source sûre -->
```

## Utiliser du PHP dans Blade

Vous pouvez écrire du code PHP natif quand c'est nécessaire :

```blade
@php
    $currentYear = date('Y');
    $greeting = $hour < 12 ? 'Bonjour' : 'Bonsoir';
@endphp

<footer>&copy; {{ $currentYear }}</footer>
```

## Commentaires

```blade
{{-- Ce commentaire Blade n'apparaîtra PAS dans le code HTML affiché au client --}}

<!-- Ce commentaire HTML APPARAÎTRA dans le code source de la page -->
```

## Affichage Brut (Échapper la syntaxe Blade)

Blade utilise `{{ }}`. Si vous utilisez un framework JavaScript (comme Vue.js) qui emploie la même syntaxe, indiquez à Blade de l'ignorer :

```blade
<!-- Pour échapper un seul élément, ajoutez un @ devant -->
@{{ vueVariable }}

<!-- Pour échapper tout un bloc de code (verbatim) -->
@verbatim
    <div id="app">
        {{ message }}
        {{ user.name }}
    </div>
@endverbatim
```

## Vérifier si une Vue Existe

```php
if (View::exists('posts.show')) {
    return view('posts.show', $data);
}

// Ou retourner la première vue qui existe dans la liste
return view()->first(['custom.posts', 'posts.show'], $data);
```

## Partager des Données avec Toutes les Vues (View Share)

```php
// Dans la méthode boot() de AppServiceProvider
View::share('appName', config('app.name'));
View::share('currentUser', auth()->user());

// Ces variables seront désormais disponibles dans TOUTES vos vues (ex: welcome.blade.php)
<title>{{ $appName }}</title>
```

## Les Vue Composers

Pour automatiquement fournir certaines données ("bind data") à des vues spécifiques avant qu'elles ne soient affichées :

```php
// Dans la méthode boot() de AppServiceProvider (avec une fonction anonyme)
View::composer('layouts.app', function ($view) {
    $view->with('notifications', auth()->user()?->unreadNotifications);
});

// Cibler plusieurs vues en même temps (avec caractère générique *)
View::composer(['posts.*', 'pages.*'], function ($view) {
    $view->with('categories', Category::all());
});

// Déléguer la logique à une classe dédiée pour plus de propreté (fortement recommandé)
View::composer('profile', ProfileComposer::class);
```

```php
// app/View/Composers/ProfileComposer.php
class ProfileComposer
{
    public function compose(View $view): void
    {
        $view->with('stats', [
            'posts' => auth()->user()->posts()->count(),
            'followers' => auth()->user()->followers()->count(),
        ]);
    }
}
```

## Ressources

- [Documentation sur les Templates Blade](https://laravel.com/docs/12.x/blade) — Documentation officielle de Laravel Blade

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
