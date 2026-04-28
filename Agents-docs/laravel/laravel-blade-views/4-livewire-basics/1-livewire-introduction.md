---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-livewire-introduction"
---

# Introduction à Livewire

Livewire est un framework full-stack pour Laravel qui simplifie grandement la création d'interfaces dynamiques, sans vous obliger à quitter le confort de Laravel et de ses templates Blade.

## Qu'est-ce que Livewire ?

Livewire vous permet de construire des interfaces réactives et dynamiques en utilisant PHP au lieu de JavaScript. Vos modèles Blade se mettent à jour en temps réel via des requêtes AJAX automatiques en arrière-plan, sans que vous n'ayez besoin d'écrire une seule ligne de JavaScript.

```
┌───────────────────────────────────────────────────────────┐
│                     Navigateur Web                         │
├───────────────────────────────────────────────────────────┤
│  ┌─────────────────┐                                      │
│  │ Composant       │  1. L'utilisateur clique             │
│  │ Livewire        │  sur un bouton       ────────────────►
│  │ (Blade + PHP)   │                                      │
│  │                 │  4. Le DOM HTML est mis à            │
│  │                 │     jour automatiquement ◄───────────│
│  └─────────────────┘                                      │
└───────────────────────────────────────────────────────────┘
          │                         ▲
          │ 2. Requête AJAX         │ 3. Le serveur renvoie
          │    avec l'action à      │    le nouveau code HTML
          │    exécuter             │    impacté
          ▼                         │
┌───────────────────────────────────────────────────────────┐
│                     Serveur Laravel                        │
│  ┌─────────────────┐                                      │
│  │ Classe du       │                                      │
│  │ Composant       │                                      │
│  │ Livewire (PHP)  │                                      │
│  └─────────────────┘                                      │
└───────────────────────────────────────────────────────────┘
```

## Installation

```bash
composer require livewire/livewire
```

Incluez les scripts et styles de Livewire dans votre mise en page principale (layout) :

```blade
<!DOCTYPE html>
<html lang="fr">
<head>
    <!-- Inclure les styles de base Livewire -->
    @livewireStyles
</head>
<body>
    {{ $slot }}

    <!-- Inclure les scripts Livewire juste avant la fin du body -->
    @livewireScripts
</body>
</html>
```

## Créer un Composant

```bash
php artisan make:livewire Counter
```

Cette commande crée deux fichiers :

- `app/Livewire/Counter.php` - La classe PHP du composant (la logique)
- `resources/views/livewire/counter.blade.php` - La vue Blade (l'interface)

```php
<?php

namespace App\Livewire;

use Livewire\Component;

class Counter extends Component
{
    // Les propriétés publiques sont automatiquement disponibles dans la vue
    public int $count = 0;

    public function increment(): void
    {
        $this->count++;
    }

    public function decrement(): void
    {
        $this->count--;
    }

    public function render()
    {
        return view('livewire.counter');
    }
}
```

```blade
<!-- resources/views/livewire/counter.blade.php -->
<!-- IMPORTANT : Un composant Livewire doit toujours avoir un seul élément racine DIV -->
<div>
    <button wire:click="decrement">-</button>
    <span>{{ $count }}</span>
    <button wire:click="increment">+</button>
</div>
```

## Utiliser les Composants

Incluez le composant n'importe où dans vos vues Blade :

```blade
<livewire:counter />

{{-- Ou avec la syntaxe alternative --}}
@livewire('counter')

{{-- Passer des valeurs initiales aux propriétés --}}
<livewire:counter :count="5" />
```

## Liaison de Données (Data Binding)

Liez facilement des champs de formulaire à des propriétés PHP avec la directive `wire:model` :

```php
class SearchUsers extends Component
{
    public string $search = '';
    public array $users = [];

    // Cette méthode magique est appelée automatiquement à chaque fois
    // que la propriété $search est modifiée.
    public function updatedSearch(): void
    {
        $this->users = User::where('name', 'like', '%' . $this->search . '%')
            ->take(10)
            ->get()
            ->toArray();
    }

    public function render()
    {
        return view('livewire.search-users');
    }
}
```

```blade
<div>
    <!-- wire:model.live met à jour la propriété à chaque frappe -->
    <input type="text" wire:model.live="search" placeholder="Rechercher des utilisateurs...">

    <ul>
        @foreach ($users as $user)
            <li>{{ $user['name'] }}</li>
        @endforeach
    </ul>
</div>
```

### Modificateurs de Modèle (Model Modifiers)

```blade
{{-- Mettre à jour la propriété à chaque frappe (temps réel) --}}
<input wire:model.live="search">

{{-- Mettre à jour à chaque frappe, mais avec un délai (anti-rebond/debounce) --}}
<input wire:model.live.debounce.300ms="search">

{{-- Mettre à jour uniquement lorsque l'utilisateur quitte le champ (blur) --}}
<input wire:model.blur="email">

{{-- Mettre à jour lors de l'événement change (listes déroulantes, cases à cocher) --}}
<select wire:model.change="country">
```

## Les Actions

Déclencher des vraies méthodes PHP depuis l'interface client (le navigateur) :

```php
class TodoList extends Component
{
    public array $todos = [];
    public string $newTodo = '';

    public function addTodo(): void
    {
        if (empty($this->newTodo)) return;

        $this->todos[] = [
            'id' => uniqid(),
            'text' => $this->newTodo,
            'completed' => false,
        ];

        $this->newTodo = '';
    }

    public function toggleTodo(string $id): void
    {
        foreach ($this->todos as &$todo) {
            if ($todo['id'] === $id) {
                $todo['completed'] = !$todo['completed'];
            }
        }
    }

    public function deleteTodo(string $id): void
    {
        $this->todos = array_filter(
            $this->todos,
            fn ($todo) => $todo['id'] !== $id
        );
    }

    public function render()
    {
        return view('livewire.todo-list');
    }
}
```

```blade
<div>
    <!-- Lors de la soumission du formulaire, appelle addTodo() en empêchant le rechargement de la page (submit.prevent par défaut) -->
    <form wire:submit="addTodo">
        <input type="text" wire:model="newTodo" placeholder="Nouvelle tâche...">
        <button type="submit">Ajouter</button>
    </form>

    <ul>
        @foreach ($todos as $todo)
            <li>
                <input
                    type="checkbox"
                    wire:click="toggleTodo('{{ $todo['id'] }}')"
                    @checked($todo['completed'])
                >
                <span class="{{ $todo['completed'] ? 'line-through' : '' }}">
                    {{ $todo['text'] }}
                </span>
                <!-- Appliquer une fonction PHP avec des paramètres -->
                <button wire:click="deleteTodo('{{ $todo['id'] }}')">×</button>
            </li>
        @endforeach
    </ul>
</div>
```

## État de Chargement (Loading States)

Indiquer visuellement à l'utilisateur qu'une requête est en cours :

```blade
<button wire:click="save">
    <!-- Caché pendant le chargement -->
    <span wire:loading.remove>Enregistrer</span>
    <!-- Affiché uniquement pendant le chargement -->
    <span wire:loading>Enregistrement en cours...</span>
</button>

{{-- Cibler une action (méthode) spécifique --}}
<span wire:loading wire:target="save">Sauvegarde en cours...</span>

{{-- Ajouter dynamiquement une classe CSS pendant le chargement --}}
<button wire:loading.class="opacity-50" wire:click="save">Enregistrer</button>

{{-- Ajouter un attribut HTML (ex: disabled) pendant le chargement --}}
<button wire:loading.attr="disabled" wire:click="save">Enregistrer</button>
```

## Ressources

- [Documentation de Livewire](https://livewire.laravel.com/docs) — Documentation officielle et complète de Livewire (version 3)

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
