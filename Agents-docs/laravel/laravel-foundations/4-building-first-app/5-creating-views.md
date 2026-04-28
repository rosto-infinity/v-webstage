---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-creating-views"
---

# Construire les Vues

Créons maintenant les templates Blade pour notre gestionnaire de tâches. Nous utiliserons Tailwind CSS (inclus avec Breeze) pour le style.

## Vue de la Liste des Tâches (Index)

Créez `resources/views/tasks/index.blade.php` :

```blade
<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                {{ __('Mes Tâches') }}
            </h2>
            <a href="{{ route('tasks.create') }}"
               class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                + Nouvelle Tâche
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {{-- Message de Succès --}}
            @if (session('success'))
                <div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    {{ session('success') }}
                </div>
            @endif

            {{-- Filtres --}}
            <div class="mb-6 bg-white overflow-hidden shadow-sm sm:rounded-lg p-4">
                <form method="GET" action="{{ route('tasks.index') }}" class="flex flex-wrap gap-4">
                    <select name="status" class="rounded-md border-gray-300">
                        <option value="">Tous les statuts</option>
                        <option value="incomplete" @selected(request('status') === 'incomplete')>À faire</option>
                        <option value="completed" @selected(request('status') === 'completed')>Terminé</option>
                    </select>

                    <select name="category" class="rounded-md border-gray-300">
                        <option value="">Toutes les catégories</option>
                        @foreach ($categories as $category)
                            <option value="{{ $category->id }}" @selected(request('category') == $category->id)>
                                {{ $category->name }}
                            </option>
                        @endforeach
                    </select>

                    <select name="priority" class="rounded-md border-gray-300">
                        <option value="">Toutes les priorités</option>
                        <option value="high" @selected(request('priority') === 'high')>Haute</option>
                        <option value="medium" @selected(request('priority') === 'medium')>Moyenne</option>
                        <option value="low" @selected(request('priority') === 'low')>Basse</option>
                    </select>

                    <button type="submit" class="bg-gray-800 text-white px-4 py-2 rounded-md">
                        Filtrer
                    </button>
                    <a href="{{ route('tasks.index') }}" class="text-gray-600 px-4 py-2">
                        Effacer
                    </a>
                </form>
            </div>

            {{-- Liste des Tâches --}}
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                @forelse ($tasks as $task)
                    <div class="p-6 border-b border-gray-200 flex items-center justify-between
                                @if($task->completed) bg-gray-50 @endif
                                @if($task->isOverdue()) bg-red-50 @endif">
                        <div class="flex items-center gap-4">
                            {{-- Bouton (Toggle) de Complétion --}}
                            <form method="POST" action="{{ route('tasks.toggle', $task) }}">
                                @csrf
                                @method('PATCH')
                                <button type="submit"
                                        class="w-6 h-6 rounded-full border-2 flex items-center justify-center
                                               {{ $task->completed ? 'bg-green-500 border-green-500' : 'border-gray-300' }}">
                                    @if ($task->completed)
                                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                                        </svg>
                                    @endif
                                </button>
                            </form>

                            <div>
                                <a href="{{ route('tasks.show', $task) }}"
                                   class="text-lg font-medium {{ $task->completed ? 'line-through text-gray-400' : 'text-gray-900' }}">
                                    {{ $task->title }}
                                </a>

                                <div class="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                    @if ($task->category)
                                        <span class="px-2 py-1 rounded text-xs"
                                              style="background-color: {{ $task->category->color }}20; color: {{ $task->category->color }}">
                                            {{ $task->category->name }}
                                        </span>
                                    @endif

                                    @if ($task->due_date)
                                        <span class="@if($task->isOverdue()) text-red-600 font-medium @endif">
                                            Échéance : {{ $task->due_date->format('d M Y') }}
                                        </span>
                                    @endif

                                    <span class="px-2 py-1 rounded text-xs
                                        @if($task->priority === 'high') bg-red-100 text-red-800
                                        @elseif($task->priority === 'medium') bg-yellow-100 text-yellow-800
                                        @else bg-green-100 text-green-800
                                        @endif">
                                        {{ ucfirst($task->priority) }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <a href="{{ route('tasks.edit', $task) }}"
                               class="text-indigo-600 hover:text-indigo-900">Modifier</a>

                            <form method="POST" action="{{ route('tasks.destroy', $task) }}"
                                  onsubmit="return confirm('Êtes-vous sûr(e) ?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:text-red-900">
                                    Supprimer
                                </button>
                            </form>
                        </div>
                    </div>
                @empty
                    <div class="p-6 text-center text-gray-500">
                        <p>Aucune tâche pour le moment !</p>
                        <a href="{{ route('tasks.create') }}" class="text-indigo-600 hover:underline">
                            Créez votre première tâche
                        </a>
                    </div>
                @endforelse
            </div>

            {{-- Pagination --}}
            <div class="mt-4">
                {{ $tasks->links() }}
            </div>
        </div>
    </div>
</x-app-layout>
```

## Vue de Création de Tâche

Créez `resources/views/tasks/create.blade.php` :

```blade
<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Créer une Tâche') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <form method="POST" action="{{ route('tasks.store') }}">
                    @csrf

                    {{-- Titre --}}
                    <div class="mb-4">
                        <label for="title" class="block text-sm font-medium text-gray-700">Titre *</label>
                        <input type="text"
                               name="title"
                               id="title"
                               value="{{ old('title') }}"
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500
                                      @error('title') border-red-500 @enderror"
                               required>
                        @error('title')
                            <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                        @enderror
                    </div>

                    {{-- Description --}}
                    <div class="mb-4">
                        <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description"
                                  id="description"
                                  rows="4"
                                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">{{ old('description') }}</textarea>
                    </div>

                    {{-- Catégorie --}}
                    <div class="mb-4">
                        <label for="category_id" class="block text-sm font-medium text-gray-700">Catégorie</label>
                        <select name="category_id"
                                id="category_id"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <option value="">Aucune catégorie</option>
                            @foreach ($categories as $category)
                                <option value="{{ $category->id }}" @selected(old('category_id') == $category->id)>
                                    {{ $category->name }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    {{-- Date d'Échéance --}}
                    <div class="mb-4">
                        <label for="due_date" class="block text-sm font-medium text-gray-700">Date d'échéance</label>
                        <input type="date"
                               name="due_date"
                               id="due_date"
                               value="{{ old('due_date') }}"
                               min="{{ date('Y-m-d') }}"
                               class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    </div>

                    {{-- Priorité --}}
                    <div class="mb-6">
                        <label for="priority" class="block text-sm font-medium text-gray-700">Priorité *</label>
                        <select name="priority"
                                id="priority"
                                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                required>
                            <option value="low" @selected(old('priority') === 'low')>Basse</option>
                            <option value="medium" @selected(old('priority', 'medium') === 'medium')>Moyenne</option>
                            <option value="high" @selected(old('priority') === 'high')>Haute</option>
                        </select>
                    </div>

                    {{-- Boutons --}}
                    <div class="flex items-center justify-end gap-4">
                        <a href="{{ route('tasks.index') }}" class="text-gray-600 hover:text-gray-900">
                            Annuler
                        </a>
                        <button type="submit"
                                class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                            Créer la tâche
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>
```

## Vue du Tableau de Bord (Dashboard)

Mettez à jour `resources/views/dashboard.blade.php` :

```blade
<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            {{ __('Tableau de Bord') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {{-- Grille de Statistiques --}}
            <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-3xl font-bold text-gray-900">{{ $stats['total'] }}</div>
                    <div class="text-gray-500">Total Tâches</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-3xl font-bold text-green-600">{{ $stats['completed'] }}</div>
                    <div class="text-gray-500">Terminées</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-3xl font-bold text-blue-600">{{ $stats['incomplete'] }}</div>
                    <div class="text-gray-500">En cours</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-3xl font-bold text-red-600">{{ $stats['overdue'] }}</div>
                    <div class="text-gray-500">En retard</div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow">
                    <div class="text-3xl font-bold text-yellow-600">{{ $stats['due_today'] }}</div>
                    <div class="text-gray-500">Pour aujourd'hui</div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                {{-- Tâches Récentes --}}
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 border-b border-gray-200 font-semibold">
                        Tâches Récentes
                    </div>
                    @forelse ($recentTasks as $task)
                        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <a href="{{ route('tasks.show', $task) }}" class="font-medium text-gray-900 hover:text-indigo-600">
                                    {{ $task->title }}
                                </a>
                                @if ($task->category)
                                    <span class="ml-2 text-xs px-2 py-1 rounded" style="background-color: {{ $task->category->color }}20; color: {{ $task->category->color }}">
                                        {{ $task->category->name }}
                                    </span>
                                @endif
                            </div>
                            <span class="text-sm text-gray-500">{{ $task->created_at->diffForHumans() }}</span>
                        </div>
                    @empty
                        <div class="p-4 text-gray-500">Aucune tâche récente</div>
                    @endforelse
                </div>

                {{-- Échéances à Venir --}}
                <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6 border-b border-gray-200 font-semibold">
                        Échéances à Venir
                    </div>
                    @forelse ($upcomingTasks as $task)
                        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <a href="{{ route('tasks.show', $task) }}" class="font-medium text-gray-900 hover:text-indigo-600">
                                    {{ $task->title }}
                                </a>
                            </div>
                            <span class="text-sm @if($task->due_date->isToday()) text-yellow-600 font-medium @else text-gray-500 @endif">
                                {{ $task->due_date->format('d M') }}
                                @if($task->due_date->isToday())
                                    (Aujourd'hui)
                                @endif
                            </span>
                        </div>
                    @empty
                        <div class="p-4 text-gray-500">Aucune échéance à venir</div>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
```

Vous avez maintenant un gestionnaire de tâches fonctionnel ! Créez la vue d'édition de la même manière que la vue de création, et ajoutez la vue `show` (affichage) pour voir les détails d'une tâche.

## Tester Votre Application

1. Inscrivez un nouvel utilisateur sur `/register`
2. Créez une catégorie
3. Créez quelques tâches
4. Marquez les tâches comme terminées
5. Filtrez par statut, catégorie ou priorité
6. Consultez les statistiques de votre tableau de bord

Félicitations ! Vous avez construit une application Laravel complète ! 🎉

## Ressources

- [Templates Blade](https://laravel.com/docs/12.x/blade) — Documentation complète sur le système de template Blade
- [Tailwind CSS](https://tailwindcss.com/docs) — Documentation Tailwind CSS pour le style

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
