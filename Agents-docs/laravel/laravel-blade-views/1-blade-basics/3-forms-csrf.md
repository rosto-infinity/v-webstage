---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-forms-csrf"
---

# Formulaires et Protection CSRF

Blade fournit des directives très pratiques pour travailler avec les formulaires HTML, incluant la protection CSRF et l'usurpation de méthode (Method Spoofing).

## Protection CSRF

Laravel génère automatiquement un jeton CSRF (Cross-Site Request Forgery) pour chaque session utilisateur active. Vous devez inclure ce jeton dans vos formulaires :

```blade
<form method="POST" action="/posts">
    @csrf

    <input type="text" name="title">
    <button type="submit">Créer</button>
</form>
```

`@csrf` génère un champ caché :

```html
<input type="hidden" name="_token" value="abc123..." />
```

**Sans `@csrf`**, toutes les requêtes POST, PUT, PATCH et DELETE échoueront systématiquement avec une erreur HTTP 419 (Page Expirée).

## Usurpation de Méthode (Method Spoofing)

Les formulaires HTML standard ne supportent que les méthodes `GET` et `POST`. Pour envoyer des requêtes `PUT`, `PATCH` ou `DELETE`, utilisez la directive `@method` :

```blade
{{-- Formulaire de mise à jour --}}
<form method="POST" action="/posts/{{ $post->id }}">
    @csrf
    @method('PUT')

    <input type="text" name="title" value="{{ $post->title }}">
    <button type="submit">Mettre à jour</button>
</form>

{{-- Formulaire de suppression --}}
<form method="POST" action="/posts/{{ $post->id }}">
    @csrf
    @method('DELETE')

    <button type="submit">Supprimer</button>
</form>
```

`@method('PUT')` génère le champ caché suivant :

```html
<input type="hidden" name="_method" value="PUT" />
```

## Afficher les Erreurs de Validation

### La Directive @error

```blade
<form method="POST" action="/posts">
    @csrf

    <div>
        <label for="title">Titre</label>
        <input type="text"
               name="title"
               id="title"
               value="{{ old('title') }}"
               class="@error('title') is-invalid @enderror">

        @error('title')
            <span class="error">{{ $message }}</span>
        @enderror
    </div>

    <div>
        <label for="body">Contenu</label>
        <textarea name="body">{{ old('body') }}</textarea>

        @error('body')
            <span class="error">{{ $message }}</span>
        @enderror
    </div>

    <button type="submit">Créer l'Article</button>
</form>
```

### Sacs d'Erreurs Nommés (Named Error Bags)

Utile lorsque vous avez plusieurs formulaires différents sur la même page (ex: un formulaire de connexion et un formulaire d'inscription côte à côte) :

```blade
{{-- Dans le contrôleur --}}
return back()->withErrors($validator, 'login');

{{-- Dans la vue Blade --}}
@error('email', 'login')
    <span class="error">{{ $message }}</span>
@enderror
```

### Toutes les Erreurs Globales

Pou afficher toutes les erreurs en haut du formulaire :

```blade
@if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif
```

## L'Aide old() (Vieux / Précédent)

L'aide `old()` permet de repeupler automatiquement les champs du formulaire après une erreur de validation pour que l'utilisateur n'ait pas à tout retaper :

```blade
<input type="text"
       name="title"
       value="{{ old('title') }}">

{{-- Avec une valeur par défaut (utile lors de l'édition d'une ressource existante) --}}
<input type="text"
       name="title"
       value="{{ old('title', $post->title) }}">

{{-- Pour les champs textarea --}}
<textarea name="body">{{ old('body', $post->body) }}</textarea>

{{-- Pour les cases à cocher (checkboxes) via la directive @checked --}}
<input type="checkbox"
       name="published"
       @checked(old('published', $post->published))>

{{-- Pour les listes déroulantes (select) via la directive @selected --}}
<select name="category_id">
    @foreach ($categories as $category)
        <option value="{{ $category->id }}"
                @selected(old('category_id', $post->category_id) == $category->id)>
            {{ $category->name }}
        </option>
    @endforeach
</select>
```

## Exemple de Formulaire Complet (avec Tailwind CSS)

```blade
<form method="POST" action="{{ route('posts.store') }}" enctype="multipart/form-data">
    @csrf

    {{-- Afficher toutes les erreurs en haut --}}
    @if ($errors->any())
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong>Oups !</strong> Il y a quelques problèmes avec vos données.
            <ul class="mt-2 list-disc list-inside">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    {{-- Champ Titre --}}
    <div class="mb-4">
        <label for="title" class="block font-medium">Titre</label>
        <input type="text"
               name="title"
               id="title"
               value="{{ old('title') }}"
               class="w-full border rounded p-2 @error('title') border-red-500 @enderror">
        @error('title')
            <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
        @enderror
    </div>

    {{-- Liste déroulante Catégories --}}
    <div class="mb-4">
        <label for="category_id" class="block font-medium">Catégorie</label>
        <select name="category_id" id="category_id" class="w-full border rounded p-2">
            <option value="">Sélectionnez une catégorie</option>
            @foreach ($categories as $category)
                <option value="{{ $category->id }}" @selected(old('category_id') == $category->id)>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>
        @error('category_id')
            <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
        @enderror
    </div>

    {{-- Contenu de l'article (Textarea) --}}
    <div class="mb-4">
        <label for="body" class="block font-medium">Contenu</label>
        <textarea name="body"
                  id="body"
                  rows="5"
                  class="w-full border rounded p-2 @error('body') border-red-500 @enderror">{{ old('body') }}</textarea>
        @error('body')
            <p class="text-red-500 text-sm mt-1">{{ $message }}</p>
        @enderror
    </div>

    {{-- Case à cocher Publié --}}
    <div class="mb-4">
        <label class="flex items-center">
            <input type="checkbox" name="published" value="1" @checked(old('published'))>
            <span class="ml-2">Publier immédiatement</span>
        </label>
    </div>

    {{-- Bouton de soumission --}}
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Créer l'Article
    </button>
</form>
```

## Ressources

- [Protection CSRF](https://laravel.com/docs/12.x/csrf) — Documentation officielle sur la protection CSRF
- [Formulaires et Blade](https://laravel.com/docs/12.x/blade#forms) — Documentation officielle sur la gestion des formulaires dans Blade

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
