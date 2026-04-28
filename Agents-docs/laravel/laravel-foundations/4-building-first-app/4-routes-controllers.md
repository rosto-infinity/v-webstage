---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-routes-controllers"
---

# Créer des Routes et des Contrôleurs

Il est maintenant temps de connecter nos modèles au web en créant des routes et des contrôleurs.

## Planifier nos Routes

Nous avons besoin des routes suivantes pour notre gestionnaire de tâches :

| Méthode | URI                  | Action  | Description                                |
| ------- | -------------------- | ------- | ------------------------------------------ |
| GET     | /dashboard           | index   | Afficher le tableau de bord avec les stats |
| GET     | /tasks               | index   | Lister toutes les tâches                   |
| GET     | /tasks/create        | create  | Afficher le formulaire de création         |
| POST    | /tasks               | store   | Enregistrer une nouvelle tâche             |
| GET     | /tasks/{task}        | show    | Afficher une seule tâche                   |
| GET     | /tasks/{task}/edit   | edit    | Afficher le formulaire de modification     |
| PUT     | /tasks/{task}        | update  | Mettre à jour une tâche                    |
| DELETE  | /tasks/{task}        | destroy | Supprimer une tâche                        |
| PATCH   | /tasks/{task}/toggle | toggle  | Basculer l'état (terminé/non terminé)      |

## Créer le Contrôleur Task

Générez un contrôleur de type ressource (resource controller) :

```bash
php artisan make:controller TaskController --resource
```

Ceci crée un contrôleur contenant toutes les méthodes CRUD requises. Éditez `app/Http/Controllers/TaskController.php` :

```php
<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Afficher une liste de tâches.
     */
    public function index(Request $request): View
    {
        $query = Auth::user()->tasks()->with('category');

        // Filtrer par état de complétion
        if ($request->has('status')) {
            if ($request->status === 'completed') {
                $query->completed();
            } elseif ($request->status === 'incomplete') {
                $query->incomplete();
            }
        }

        // Filtrer par catégorie
        if ($request->filled('category')) {
            $query->where('category_id', $request->category);
        }

        // Filtrer par priorité
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        $tasks = $query->latest()->paginate(10);
        $categories = Auth::user()->categories;

        return view('tasks.index', [
            'tasks' => $tasks,
            'categories' => $categories,
        ]);
    }

    /**
     * Afficher le formulaire pour créer une nouvelle tâche.
     */
    public function create(): View
    {
        $categories = Auth::user()->categories;

        return view('tasks.create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Enregistrer une tâche nouvellement créée.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'due_date' => 'nullable|date|after_or_equal:today',
            'priority' => 'required|in:low,medium,high',
        ]);

        // Vérifier que la catégorie appartient bien à l'utilisateur
        if (isset($validated['category_id'])) {
            $category = Category::find($validated['category_id']);
            if ($category->user_id !== Auth::id()) {
                abort(403);
            }
        }

        Auth::user()->tasks()->create($validated);

        return redirect()->route('tasks.index')
            ->with('success', 'Tâche créée avec succès !');
    }

    /**
     * Afficher la tâche spécifiée.
     */
    public function show(Task $task): View
    {
        // S'assurer que l'utilisateur est bien propriétaire de cette tâche
        $this->authorize('view', $task);

        return view('tasks.show', [
            'task' => $task->load('category'),
        ]);
    }

    /**
     * Afficher le formulaire pour modifier la tâche.
     */
    public function edit(Task $task): View
    {
        $this->authorize('update', $task);

        $categories = Auth::user()->categories;

        return view('tasks.edit', [
            'task' => $task,
            'categories' => $categories,
        ]);
    }

    /**
     * Mettre à jour la tâche spécifiée.
     */
    public function update(Request $request, Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'nullable|exists:categories,id',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:low,medium,high',
        ]);

        $task->update($validated);

        return redirect()->route('tasks.index')
            ->with('success', 'Tâche mise à jour avec succès !');
    }

    /**
     * Supprimer la tâche spécifiée.
     */
    public function destroy(Task $task): RedirectResponse
    {
        $this->authorize('delete', $task);

        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Tâche supprimée avec succès !');
    }

    /**
     * Basculer l'état de complétion de la tâche.
     */
    public function toggle(Task $task): RedirectResponse
    {
        $this->authorize('update', $task);

        $task->update([
            'completed' => !$task->completed,
        ]);

        $status = $task->completed ? 'terminée' : 'marquée comme à faire';

        return back()->with('success', "Tâche {$status} !");
    }
}
```

## Créer la Policy (Stratégie d'Autorisation) pour les Tâches

Pour gérer les autorisations de qui peut faire quoi, créez une Policy :

```bash
php artisan make:policy TaskPolicy --model=Task
```

Éditez `app/Policies/TaskPolicy.php` :

```php
<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

class TaskPolicy
{
    /**
     * Détermine si l'utilisateur peut voir la tâche.
     */
    public function view(User $user, Task $task): bool
    {
        return $user->id === $task->user_id;
    }

    /**
     * Détermine si l'utilisateur peut modifier la tâche.
     */
    public function update(User $user, Task $task): bool
    {
        return $user->id === $task->user_id;
    }

    /**
     * Détermine si l'utilisateur peut supprimer la tâche.
     */
    public function delete(User $user, Task $task): bool
    {
        return $user->id === $task->user_id;
    }
}
```

## Définir les Routes

Éditez `routes/web.php` :

```php
<?php

use App\Http\Controllers\TaskController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Routes nécessitant une authentification
Route::middleware(['auth', 'verified'])->group(function () {
    // Tableau de bord
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Tâches
    Route::resource('tasks', TaskController::class);
    Route::patch('/tasks/{task}/toggle', [TaskController::class, 'toggle'])
        ->name('tasks.toggle');

    // Catégories
    Route::resource('categories', CategoryController::class);
});

// Inclure les routes d'authentification générées par Breeze
require __DIR__.'/auth.php';
```

## Créer le Contrôleur du Tableau de Bord (Dashboard)

```bash
php artisan make:controller DashboardController
```

Éditez `app/Http/Controllers/DashboardController.php` :

```php
<?php

namespace App\Http\Controllers;

use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(): View
    {
        $user = Auth::user();

        $stats = [
            'total' => $user->tasks()->count(),
            'completed' => $user->tasks()->completed()->count(),
            'incomplete' => $user->tasks()->incomplete()->count(),
            'overdue' => $user->tasks()->overdue()->count(),
            'due_today' => $user->tasks()->dueToday()->count(),
        ];

        $recentTasks = $user->tasks()
            ->with('category')
            ->incomplete()
            ->latest()
            ->take(5)
            ->get();

        $upcomingTasks = $user->tasks()
            ->with('category')
            ->incomplete()
            ->whereNotNull('due_date')
            ->where('due_date', '>=', today())
            ->orderBy('due_date')
            ->take(5)
            ->get();

        return view('dashboard', [
            'stats' => $stats,
            'recentTasks' => $recentTasks,
            'upcomingTasks' => $upcomingTasks,
        ]);
    }
}
```

## Lister les Routes

Vérifiez vos routes :

```bash
php artisan route:list --path=tasks
```

```
  GET|HEAD   tasks ............... tasks.index › TaskController@index
  POST       tasks ............... tasks.store › TaskController@store
  GET|HEAD   tasks/create ........ tasks.create › TaskController@create
  GET|HEAD   tasks/{task} ........ tasks.show › TaskController@show
  PUT|PATCH  tasks/{task} ........ tasks.update › TaskController@update
  DELETE     tasks/{task} ........ tasks.destroy › TaskController@destroy
  PATCH      tasks/{task}/toggle . tasks.toggle › TaskController@toggle
```

Maintenant, créons les vues !

## Ressources

- [Contrôleurs](https://laravel.com/docs/12.x/controllers) — Documentation officielle sur les contrôleurs Laravel
- [Routage](https://laravel.com/docs/12.x/routing) — Documentation complète sur les routes

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
