---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-practical-components"
---

# Construire des Composants Pratiques

Créons des composants du monde réel que vous utiliserez dans presque tous vos projets Laravel.

## Composant Champ de Formulaire (Input Component)

```bash
php artisan make:component Forms/Input
```

```php
<?php

namespace App\View\Components\Forms;

use Illuminate\View\Component;
use Illuminate\View\View;

class Input extends Component
{
    public function __construct(
        public string $name,
        public string $type = 'text',
        public ?string $label = null,
        public ?string $value = null,
        public bool $required = false,
    ) {
        $this->label = $label ?? ucfirst(str_replace('_', ' ', $name));
        $this->value = old($name, $value);
    }

    public function render(): View
    {
        return view('components.forms.input');
    }
}
```

```blade
<!-- resources/views/components/forms/input.blade.php -->
<div class="mb-4">
    <label for="{{ $name }}" class="block text-sm font-medium text-gray-700">
        {{ $label }}
        @if ($required)
            <span class="text-red-500">*</span>
        @endif
    </label>

    <input
        type="{{ $type }}"
        name="{{ $name }}"
        id="{{ $name }}"
        value="{{ $value }}"
        {{ $attributes->merge([
            'class' => 'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500'
                . ($errors->has($name) ? ' border-red-500' : '')
        ]) }}
        @if($required) required @endif
    >

    @error($name)
        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
    @enderror
</div>
```

Utilisation :

```blade
<x-forms.input name="email" type="email" required />
<x-forms.input name="phone" label="Numéro de Téléphone" />
<x-forms.input name="title" :value="$post->title" />
```

## Composant Bouton (Button Component)

```blade
<!-- resources/views/components/button.blade.php -->
@props([
    'type' => 'button',
    'variant' => 'primary',
    'size' => 'md',
])

@php
$variants = [
    'primary' => 'bg-blue-600 hover:bg-blue-700 text-white',
    'secondary' => 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    'danger' => 'bg-red-600 hover:bg-red-700 text-white',
    'success' => 'bg-green-600 hover:bg-green-700 text-white',
];

$sizes = [
    'sm' => 'px-3 py-1.5 text-sm',
    'md' => 'px-4 py-2',
    'lg' => 'px-6 py-3 text-lg',
];
@endphp

<button
    type="{{ $type }}"
    {{ $attributes->merge([
        'class' => 'rounded font-medium transition-colors ' . $variants[$variant] . ' ' . $sizes[$size]
    ]) }}
>
    {{ $slot }}
</button>
```

Utilisation :

```blade
<x-button>Cliquez-moi</x-button>
<x-button type="submit" variant="success">Enregistrer</x-button>
<x-button variant="danger" size="sm" onclick="confirm('Êtes-vous sûr ?')">Supprimer</x-button>
```

## Composant Fenêtre Modale (Modal Component)

Ce composant utilise Alpine.js pour la gestion de l'affichage.

```blade
<!-- resources/views/components/modal.blade.php -->
@props([
    'name',
    'title' => '',
    'maxWidth' => 'md',
])

@php
$maxWidthClasses = [
    'sm' => 'max-w-sm',
    'md' => 'max-w-md',
    'lg' => 'max-w-lg',
    'xl' => 'max-w-xl',
    '2xl' => 'max-w-2xl',
];
@endphp

<div
    x-data="{ open: false }"
    x-on:open-modal.window="$event.detail === '{{ $name }}' ? open = true : null"
    x-on:close-modal.window="$event.detail === '{{ $name }}' ? open = false : null"
    x-on:keydown.escape.window="open = false"
    x-show="open"
    class="fixed inset-0 z-50 overflow-y-auto"
    style="display: none;"
>
    <!-- Arrière-plan (Backdrop) -->
    <div
        x-show="open"
        x-transition:enter="ease-out duration-300"
        x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100"
        class="fixed inset-0 bg-gray-500 bg-opacity-75"
        @click="open = false"
    ></div>

    <!-- Modale (Modal) -->
    <div class="flex min-h-screen items-center justify-center p-4">
        <div
            x-show="open"
            x-transition:enter="ease-out duration-300"
            x-transition:enter-start="opacity-0 scale-95"
            x-transition:enter-end="opacity-100 scale-100"
            class="relative bg-white rounded-lg shadow-xl {{ $maxWidthClasses[$maxWidth] }} w-full"
        >
            @if ($title)
                <div class="px-6 py-4 border-b">
                    <h3 class="text-lg font-semibold">{{ $title }}</h3>
                </div>
            @endif

            <div class="px-6 py-4">
                {{ $slot }}
            </div>

            @isset($footer)
                <div class="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
                    {{ $footer }}
                </div>
            @endisset
        </div>
    </div>
</div>
```

Utilisation :

```blade
<x-button @click="$dispatch('open-modal', 'confirm-delete')">
    Supprimer
</x-button>

<x-modal name="confirm-delete" title="Confirmation de Suppression">
    <p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>

    <x-slot:footer>
        <x-button variant="secondary" @click="$dispatch('close-modal', 'confirm-delete')">
            Annuler
        </x-button>
        <x-button variant="danger" type="submit" form="delete-form">
            Supprimer
        </x-button>
    </x-slot>
</x-modal>
```

## Composant Carte (Card Component)

```blade
<!-- resources/views/components/card.blade.php -->
@props(['padding' => true])

<div {{ $attributes->merge(['class' => 'bg-white rounded-lg shadow']) }}>
    @isset($header)
        <div class="px-6 py-4 border-b font-semibold">
            {{ $header }}
        </div>
    @endisset

    <div @class(['px-6 py-4' => $padding])>
        {{ $slot }}
    </div>

    @isset($footer)
        <div class="px-6 py-4 border-t bg-gray-50">
            {{ $footer }}
        </div>
    @endisset
</div>
```

## Exemple de Formulaire Complet avec Composants

```blade
<x-layout>
    <x-slot:title>Créer un Article</x-slot>

    <x-card class="max-w-2xl mx-auto">
        <x-slot:header>Créer un Nouvel Article</x-slot>

        <form method="POST" action="{{ route('posts.store') }}" id="create-post-form">
            @csrf

            <x-forms.input name="title" label="Titre" required />
            <x-forms.input name="slug" label="Lien permanent (Slug)" />

            <x-forms.textarea name="body" label="Contenu" rows="10" required />

            <x-forms.select name="category_id" label="Catégorie" :options="$categories" required />

            <x-forms.checkbox name="published" label="Publier immédiatement" />
        </form>

        <x-slot:footer>
            <x-button variant="secondary" href="{{ route('posts.index') }}">
                Annuler
            </x-button>
            <x-button type="submit" form="create-post-form">
                Créer l'Article
            </x-button>
        </x-slot>
    </x-card>
</x-layout>
```

## Ressources

- [Composants Blade](https://laravel.com/docs/12.x/blade#components) — Documentation complète sur les composants Blade de Laravel

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
