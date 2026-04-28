---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-template-inheritance"
---

# Héritage de Templates avec @extends

L'héritage de templates de Blade vous permet de définir une mise en page (layout) principale que les vues enfants peuvent "étendre". Cela élimine la duplication de code et garantit la cohérence visuelle de votre application.

## Créer une Mise en Page (Layout)

```blade
<!-- resources/views/layouts/app.blade.php -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Un emplacement réservé nommé 'title' avec une valeur par défaut 'Mon App' -->
    <title>@yield('title', 'Mon App')</title>

    <!-- Inclusion des assets compilés par Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Une pile (stack) nommée 'styles' pour que les vues enfants y injectent du CSS -->
    @stack('styles')
</head>
<body>
    <nav class="navbar">
        <!-- Inclusion d'une vue partielle (fragment) -->
        @include('partials.navigation')
    </nav>

    <main class="container">
        <!-- L'emplacement principal destiné à recevoir le contenu des vues enfants -->
        @yield('content')
    </main>

    <footer>
        @include('partials.footer')
    </footer>

    <!-- Une pile nommée 'scripts' pour le JavaScript -->
    @stack('scripts')
</body>
</html>
```

## Étendre une Mise en Page

```blade
<!-- resources/views/posts/index.blade.php -->
<!-- On indique quelle mise en page (layout) utiliser -->
@extends('layouts.app')

<!-- On remplit l'emplacement 'title' -->
@section('title', 'Tous les Articles')

<!-- On remplit l'emplacement 'content' avec du code HTML -->
@section('content')
    <h1>Tous les Articles</h1>

    @foreach ($posts as $post)
        <article>
            <h2>{{ $post->title }}</h2>
            <p>{{ $post->excerpt }}</p>
        </article>
    @endforeach
@endsection
```

## @yield et @section

### @yield

Définit un espace réservé (placeholder) dans la mise en page (le parent) :

```blade
{{-- Emplacement simple --}}
@yield('content')

{{-- Avec une valeur par défaut si la vue enfant ne définit pas cette section --}}
@yield('title', 'Titre par défaut')

{{-- Avec un bloc de contenu par défaut (via une vue) --}}
@yield('sidebar', View::make('partials.default-sidebar'))
```

### @section

Définit le contenu à injecter dans l'espace réservé (dans la vue enfant) :

```blade
{{-- Contenu sur une seule ligne --}}
@section('title', 'Titre de la Page')

{{-- Contenu multi-lignes --}}
@section('content')
    <h1>Bienvenue</h1>
    <p>Le contenu principal ici...</p>
@endsection
```

## @section avec @show vs @endsection

```blade
{{-- Dans le layout (parent) : Définir une section avec un contenu par défaut --}}
@section('sidebar')
    <p>Ceci est la barre latérale (sidebar) par défaut.</p>
@show  {{-- Utiliser @show pour l'afficher immédiatement ici --}}

{{-- Dans la vue enfant : Peut écraser OU étendre cette section --}}
@section('sidebar')
    <p>Contenu personnalisé de la sidebar</p>
@endsection
```

### Étendre les Sections Parentes avec @parent

```blade
{{-- Layout (parent) --}}
@section('sidebar')
    <div class="sidebar-header">Menu</div>
@show

{{-- Vue Enfant --}}
@section('sidebar')
    @parent  {{-- Demande d'inclure le contenu défini par le parent --}}
    <nav>Navigation personnalisée</nav>
@endsection

{{-- Résultat final généré : --}}
<div class="sidebar-header">Menu</div>
<nav>Navigation personnalisée</nav>
```

## L'inclusion de Partiels avec @include

Inclure des fragments de vue réutilisables n'importe où :

```blade
{{-- Inclusion de base --}}
@include('partials.navigation')

{{-- Passer des données spécifiques au partiel --}}
@include('partials.user-card', ['user' => $user])

{{-- Inclure uniquement si le fichier de vue existe --}}
@includeIf('partials.optional')

{{-- Inclure lorsque la condition est vraie --}}
@includeWhen($user->isAdmin, 'partials.admin-menu')

{{-- Inclure à moins que la condition ne soit vraie (inverse de when) --}}
@includeUnless($user->isGuest, 'partials.user-sidebar')

{{-- Inclure la première vue qui existe dans le tableau fourni --}}
@includeFirst(['custom.header', 'partials.header'])
```

## @each pour les Collections

Générer et afficher une vue pour chaque élément d'une collection (boucle implicite) :

```blade
{{-- Syntaxe de base --}}
{{-- 1: La vue partielle, 2: La collection, 3: Le nom de la variable dans la vue --}}
@each('partials.post-card', $posts, 'post')

{{-- Avec un état "vide" (vue de secours si la collection est vide) --}}
@each('partials.post-card', $posts, 'post', 'partials.no-posts')
```

C'est l'équivalent raccourci de :

```blade
@forelse ($posts as $post)
    @include('partials.post-card', ['post' => $post])
@empty
    @include('partials.no-posts')
@endforelse
```

## Les Piles (Stacks) pour les Scripts et les Styles

Permet de pousser dynamiquement du contenu (ex: balises `<style>` ou `<script>`) dans des `stacks` nommés, typiquement définies dans la balise `<head>` ou en fin de `<body>` du layout parent :

```blade
{{-- Dans le Layout --}}
<head>
    <link href="/css/app.css" rel="stylesheet">
    @stack('styles')
</head>
<body>
    @yield('content')

    <script src="/js/app.js"></script>
    @stack('scripts')
</body>

{{-- Dans la Vue Enfant --}}
@push('styles')
    <link href="/css/posts.css" rel="stylesheet">
@endpush

@section('content')
    <h1>Articles</h1>
@endsection

@push('scripts')
    <script src="/js/posts.js"></script>
@endpush

{{-- `@prepend` pousse le contenu au DÉBUT de la pile (avant les autres push) --}}
@prepend('scripts')
    <script>var postId = {{ $post->id }};</script>
@endprepend
```

## Exemple d'une Mise en Page Complète

```blade
<!-- resources/views/layouts/app.blade.php -->
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>@yield('title') - {{ config('app.name') }}</title>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @stack('styles')
</head>
<body class="@yield('body-class')">
    <header>
        @include('partials.navigation')
    </header>

    {{-- Vérifie s'il y a du contenu injecté dans la section 'hero' --}}
    @hasSection('hero')
        <section class="hero">
            @yield('hero')
        </section>
    @endif

    <main class="container mx-auto py-8">
        {{-- Affichage d'un message flash de succès --}}
        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        @yield('content')
    </main>

    <footer>
        @include('partials.footer')
    </footer>

    @stack('scripts')
</body>
</html>
```

## Ressources

- [Mises en Page avec Blade](https://laravel.com/docs/12.x/blade#layouts-using-template-inheritance) — Documentation officielle sur l'héritage de templates.

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
