---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-blade-directives"
---

# Les Directives Blade

Blade propose de nombreuses directives, qui sont des raccourcis pour les structures de contrôle PHP courantes, rendant ainsi vos templates beaucoup plus lisibles et expressifs.

## Directives Conditionnelles

### @if, @elseif, @else, @endif

```blade
@if (count($posts) === 0)
    <p>Aucun article disponible.</p>
@elseif (count($posts) === 1)
    <p>Un article trouvé !</p>
@else
    <p>{{ count($posts) }} articles trouvés.</p>
@endif
```

### @unless (Inverse de @if)

```blade
@unless (auth()->check())
    <a href="/login">Veuillez vous connecter</a>
@endunless

{{-- Équivalent à : @if (!auth()->check()) --}}
```

### @isset et @empty

```blade
@isset($user)
    <p>Bienvenue, {{ $user->name }} !</p>
@endisset

@empty($posts)
    <p>Aucun article à afficher.</p>
@endempty
```

### @auth et @guest

```blade
@auth
    <p>Heureux de vous revoir, {{ auth()->user()->name }} !</p>
    <a href="/logout">Déconnexion</a>
@endauth

@guest
    <a href="/login">Connexion</a>
    <a href="/register">Inscription</a>
@endguest

{{-- Avec un gardien (guard) d'authentification spécifique --}}
@auth('admin')
    <a href="/admin">Panneau d'administration</a>
@endauth
```

### @env

```blade
@env('local')
    <div class="debug-bar">Session de débogage (Mode Local)</div>
@endenv

@env(['local', 'staging'])
    <div class="warning">Environnement hors production</div>
@endenv
```

## Les Boucles

### @foreach

```blade
@foreach ($posts as $post)
    <article>
        <h2>{{ $post->title }}</h2>
        <p>{{ $post->excerpt }}</p>
    </article>
@endforeach
```

### @forelse (Gère les collections vides)

Ce raccourci combine `@foreach` et `@empty`. Si la boucle n'a aucun élément, le bloc `@empty` est affiché.

```blade
@forelse ($posts as $post)
    <article>
        <h2>{{ $post->title }}</h2>
    </article>
@empty
    <p>Aucun article disponible.</p>
@endforelse
```

### @for

```blade
@for ($i = 0; $i < 10; $i++)
    <p>Itération numéro {{ $i }}</p>
@endfor
```

### @while

```blade
@while (true)
    <p>Boucle infinie (à éviter en production !)</p>
    @break
@endwhile
```

### @continue et @break

```blade
@foreach ($posts as $post)
    @if ($post->hidden)
        @continue
    @endif

    <h2>{{ $post->title }}</h2>

    @if ($loop->iteration > 10)
        @break
    @endif
@endforeach

{{-- Version raccourcie avec condition intégrée --}}
@foreach ($posts as $post)
    @continue($post->hidden)

    <h2>{{ $post->title }}</h2>

    @break($loop->iteration > 10)
@endforeach
```

## La Variable $loop

À l'intérieur des directives `@foreach` et `@forelse`, vous avez accès à une variable magique nommée `$loop` :

```blade
@foreach ($posts as $post)
    @if ($loop->first)
        <p>C'est le tout premier article !</p>
    @endif

    <article class="@if($loop->even) even @endif">
        <span>{{ $loop->iteration }} sur {{ $loop->count }}</span>
        <h2>{{ $post->title }}</h2>
    </article>

    @if ($loop->last)
        <p>C'est le dernier article !</p>
    @endif
@endforeach
```

### Propriétés disponibles sur $loop

| Propriété          | Description                                                             |
| ------------------ | ----------------------------------------------------------------------- |
| `$loop->index`     | L'index de l'itération courante (commence à 0)                          |
| `$loop->iteration` | L'itération courante (commence à 1)                                     |
| `$loop->remaining` | Le nombre d'itérations restantes                                        |
| `$loop->count`     | Le nombre total d'éléments parcourus                                    |
| `$loop->first`     | Vrai si c'est la première itération                                     |
| `$loop->last`      | Vrai si c'est la dernière itération                                     |
| `$loop->even`      | Vrai si c'est une itération paire                                       |
| `$loop->odd`       | Vrai si c'est une itération impaire                                     |
| `$loop->depth`     | Le niveau d'imbrication de la boucle                                    |
| `$loop->parent`    | Accès à la variable `$loop` de la boucle parente (en cas d'imbrication) |

### Boucles Imbriquées

```blade
@foreach ($categories as $category)
    <h2>{{ $category->name }}</h2>

    @foreach ($category->posts as $post)
        <p>
            Catégorie {{ $loop->parent->iteration }},
            Article {{ $loop->iteration }}
        </p>
    @endforeach
@endforeach
```

## Switch / Case (Instructions de commutation)

```blade
@switch($user->role)
    @case('admin')
        <span class="badge badge-red">Administrateur</span>
        @break

    @case('editor')
        <span class="badge badge-blue">Éditeur</span>
        @break

    @default
        <span class="badge">Utilisateur standard</span>
@endswitch
```

## Directives pour les Classes et les Styles

```blade
{{-- Classes appliquées conditionnellement --}}
<div @class([
    'p-4',
    'bg-red-500' => $isError,
    'bg-green-500' => $isSuccess,
    'font-bold' => $isImportant,
])>
    Message
</div>

{{-- Styles CSS appliqués conditionnellement --}}
<div @style([
    'background-color: red' => $isError,
    'font-weight: bold' => $isImportant,
])>
    Contenu stylisé
</div>
```

## Directives Checked, Selected, Disabled, etc.

Ces directives facilitent la gestion dynamique des éléments de formulaires HTML :

```blade
<input type="checkbox"
       name="active"
       @checked($user->active) />

<select name="status">
    @foreach ($statuses as $status)
        <option value="{{ $status }}" @selected($status === $user->status)>
            {{ $status }}
        </option>
    @endforeach
</select>

<button @disabled($form->isProcessing)>Envoyer</button>

<input type="text" @readonly($user->isAdmin) />

<input type="text" @required($isRequired) />
```

## Ressources

- [Directives Blade](https://laravel.com/docs/12.x/blade#blade-directives) — Liste complète et détaillée des directives Blade

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
