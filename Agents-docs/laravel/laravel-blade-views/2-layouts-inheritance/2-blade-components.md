---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-blade-components"
---

# Les Composants Blade (Blade Components)

Les composants Blade sont des éléments d'interface utilisateur (UI) réutilisables, ayant leurs propres templates et leur propre logique. C'est l'approche la plus moderne pour construire des mises en page et des portions de vue réutilisables dans Laravel.

## Créer des Composants

### Composants Anonymes (Vue Uniquement)

Si votre composant n'a pas besoin de logique PHP complexe, créez simplement un fichier dans `resources/views/components/` :

```blade
<!-- resources/views/components/alert.blade.php -->
<div class="alert alert-{{ $type ?? 'info' }}">
    {{ $slot }}
</div>
```

Utilisation dans n'importe quelle vue :

```blade
<x-alert type="success">
    Votre profil a été mis à jour avec succès !
</x-alert>
```

_(Remarquez le préfixe `x-` obligatoire pour appeler un composant Blade)._

### Composants Basés sur une Classe (Class-Based)

Si votre composant nécessite des traitements complexes :

```bash
php artisan make:component Alert
```

Cette commande crée deux fichiers :

- `app/View/Components/Alert.php` (la logique PHP)
- `resources/views/components/alert.blade.php` (le template HTML)

```php
<?php

namespace App\View\Components;

use Illuminate\View\Component;
use Illuminate\View\View;

class Alert extends Component
{
    // Les propriétés publiques sont automatiquement disponibles dans la vue du composant
    public function __construct(
        public string $type = 'info',
        public bool $dismissible = false
    ) {}

    public function render(): View
    {
        return view('components.alert');
    }

    /**
     * Une méthode publique pour obtenir les classes CSS selon le type d'alerte.
     */
    public function typeClass(): string
    {
        return match($this->type) {
            'success' => 'bg-green-100 text-green-800',
            'error' => 'bg-red-100 text-red-800',
            'warning' => 'bg-yellow-100 text-yellow-800',
            default => 'bg-blue-100 text-blue-800',
        };
    }
}
```

```blade
<!-- resources/views/components/alert.blade.php -->
<div {{ $attributes->merge(['class' => 'p-4 rounded ' . $typeClass()]) }}>
    {{ $slot }}

    @if ($dismissible)
        <button onclick="this.parentElement.remove()">×</button>
    @endif
</div>
```

## Passer des Données aux Composants

### Attributs (Props)

```blade
{{-- Valeurs sous forme de chaîne de caractères simple --}}
<x-alert type="error">
    Pardon, une erreur est survenue !
</x-alert>

{{-- Évaluer des expressions PHP en ajoutant deux-points (:) devant l'attribut --}}
<x-alert :type="$alertType" :dismissible="$canDismiss">
    {{ $message }}
</x-alert>

{{-- Raccourci pour un booléen (vrai par défaut si présent) --}}
<x-alert dismissible>
    Cette alerte peut être fermée.
</x-alert>
```

### Slots (Emplacements)

Un slot est une zone où vous pouvez injecter du contenu dynamiquement à l'intérieur du composant.

```blade
{{-- Emplacement principal par défaut ($slot) --}}
<x-card>
    <p>Ce texte sera injecté dans la variable $slot.</p>
</x-card>

{{-- Emplacements nommés (Named slots) --}}
<x-card>
    <x-slot:header>
        <h2>Titre de la Carte</h2>
    </x-slot>

    <p>Le contenu principal de la carte.</p>

    <x-slot:footer>
        <button>Valider l'action</button>
    </x-slot>
</x-card>
```

Code du composant Card :

```blade
<!-- resources/views/components/card.blade.php -->
<div class="card">
    @isset($header)
        <div class="card-header">{{ $header }}</div>
    @endisset

    <!-- $slot contient tout ce qui n'est pas dans un <x-slot:nom> spécifique -->
    <div class="card-body">{{ $slot }}</div>

    @isset($footer)
        <div class="card-footer">{{ $footer }}</div>
    @endisset
</div>
```

## Fusion d'Attributs (Attribute Merging)

La variable `$attributes` contient tous les attributs HTML passés au composant qui ne font pas partie de son constructeur PHP.

```blade
<!-- Code du Composant -->
<div {{ $attributes->merge(['class' => 'alert']) }}>
    {{ $slot }}
</div>

<!-- Utilisation -->
<x-alert class="mb-4" id="main-alert">
    Contenu
</x-alert>

<!-- Résultat HTML généré (les classes sont fusionnées intelligemment) -->
<div class="alert mb-4" id="main-alert">
    Contenu
</div>
```

### Classes Conditionnelles

```blade
<div {{ $attributes->class(['alert', 'alert-'.$type, 'font-bold' => $important]) }}>
    {{ $slot }}
</div>
```

### Filtrer les Attributs

```blade
{{-- Conserver uniquement certains attributs spécifiques --}}
{{ $attributes->only(['class', 'id']) }}

{{-- Tous les attributs SAUF ceux spécifiés --}}
{{ $attributes->except(['class']) }}

{{-- Vérifier si un attribut existe --}}
@if ($attributes->has('required'))
    <span class="required">*</span>
@endif

{{-- Récupérer la valeur d'un attribut précis --}}
{{ $attributes->get('class', 'classe-par-defaut') }}
```

## Mise en Page avec les Composants (Component Layout)

L'approche moderne (au lieu des `@extends`) pour définir le Layout principal :

```blade
<!-- resources/views/components/layout.blade.php -->
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>{{ $title ?? 'Mon Application' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <nav>@include('partials.nav')</nav>

    <main>{{ $slot }}</main>

    <footer>@include('partials.footer')</footer>
</body>
</html>
```

Utilisation du Layout en composant :

```blade
<!-- resources/views/posts/index.blade.php -->
<x-layout>
    <x-slot:title>Tous les Articles</x-slot>

    <h1>Tous les Articles</h1>

    @foreach ($posts as $post)
        <x-post-card :post="$post" />
    @endforeach
</x-layout>
```

## Sous-dossiers (Composants Imbriqués)

Pour organiser vos composants :

```bash
php artisan make:component Forms/Input
```

Ceci crée `app/View/Components/Forms/Input.php` et `resources/views/components/forms/input.blade.php`.

```blade
{{-- Utilisation de la notation point (dot notation) pour appeler un composant dans un sous-dossier --}}
<x-forms.input name="email" type="email" />
```

## Composants en Ligne (Inline Components)

Pour les petits composants qui n'ont pas besoin d'un fichier `.blade.php` séparé :

```php
abstract class ColorPicker extends Component
{
    public function __construct(
        public string $color = '#000000'
    ) {}

    public function render(): string
    {
        return <<<'blade'
            <div>
                <input type="color" {{ $attributes->merge(['value' => $color]) }}>
            </div>
        blade;
    }
}
```

## Composants Dynamiques

Si vous devez afficher un composant, mais que vous ne connaissez son nom qu'à l'exécution :

```blade
<!-- Si $componentName vaut 'alert', affichera <x-alert> -->
<x-dynamic-component :component="$componentName" :message="$message" />

{{-- Equivalent technique : --}}
@php
    $component = 'x-' . $componentName;
@endphp
<{{ $component }} :message="$message" />
```

## Ressources

- [Composants Blade](https://laravel.com/docs/12.x/blade#components) — Documentation officielle sur les composants Blade de Laravel

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
