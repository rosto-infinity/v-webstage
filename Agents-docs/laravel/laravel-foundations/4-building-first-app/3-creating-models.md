---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-creating-models"
---

# Créer des Modèles Eloquent

Les modèles sont le cœur de votre application Laravel. Ils représentent vos données, définissent les relations et contiennent la logique métier.

## Créer le Modèle Category

Générez le modèle :

```bash
php artisan make:model Category
```

Éditez `app/Models/Category.php` :

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    /**
     * Les attributs qui peuvent être assignés en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'color',
    ];

    /**
     * Obtenir l'utilisateur auquel appartient la catégorie.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtenir les tâches de cette catégorie.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
}
```

### Comprendre le Modèle

- **`$fillable`** : Liste les colonnes qui peuvent être assignées en masse (protection de sécurité contre l'assignation de masse (mass assignment)).
- **`user()`** : Définit la relation "appartient à" (belongs to) avec le modèle User.
- **`tasks()`** : Définit la relation "possède plusieurs" (has many) avec le modèle Task.

## Créer le Modèle Task

Générez le modèle :

```bash
php artisan make:model Task
```

Éditez `app/Models/Task.php` :

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Task extends Model
{
    /**
     * Les attributs qui peuvent être assignés en masse.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'description',
        'completed',
        'due_date',
        'priority',
    ];

    /**
     * Obtenir les attributs qui doivent être castés (convertis).
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'completed' => 'boolean',
            'due_date' => 'date',
        ];
    }

    /**
     * Obtenir l'utilisateur propriétaire de la tâche.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtenir la catégorie de la tâche.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Scope (Portée) : Uniquement les tâches terminées.
     */
    public function scopeCompleted(Builder $query): Builder
    {
        return $query->where('completed', true);
    }

    /**
     * Scope : Uniquement les tâches non terminées.
     */
    public function scopeIncomplete(Builder $query): Builder
    {
        return $query->where('completed', false);
    }

    /**
     * Scope : Tâches à faire pour aujourd'hui.
     */
    public function scopeDueToday(Builder $query): Builder
    {
        return $query->whereDate('due_date', today());
    }

    /**
     * Scope : Tâches en retard.
     */
    public function scopeOverdue(Builder $query): Builder
    {
        return $query->where('completed', false)
                     ->whereDate('due_date', '<', today());
    }

    /**
     * Vérifie si la tâche est en retard.
     */
    public function isOverdue(): bool
    {
        return !$this->completed
            && $this->due_date
            && $this->due_date->isPast();
    }
}
```

### Explication des Nouveaux Concepts

#### Typage d'Attribut (Attribute Casting)

```php
protected function casts(): array
{
    return [
        'completed' => 'boolean',  // Convertit 0/1 en true/false
        'due_date' => 'date',      // Convertit en un objet de date Carbon
    ];
}
```

Le typage (casting) convertit automatiquement les valeurs de la base de données vers les types PHP attendus.

#### Portées de Requête (Query Scopes)

Les portées (scopes) sont des contraintes de requête réutilisables :

```php
// Définir une portée (scope)
public function scopeCompleted(Builder $query): Builder
{
    return $query->where('completed', true);
}

// Utiliser une portée
Task::completed()->get();               // Toutes les tâches terminées
Task::incomplete()->dueToday()->get();  // Tâches non terminées pour aujourd'hui
$user->tasks()->overdue()->get();       // Tâches en retard de l'utilisateur
```

#### Méthodes Personnalisées

```php
public function isOverdue(): bool
{
    return !$this->completed
        && $this->due_date
        && $this->due_date->isPast();
}

// Utilisation
if ($task->isOverdue()) {
    // Afficher un avertissement
}
```

## Mettre à jour le Modèle User

Ajoutez les relations au modèle `User` existant. Éditez `app/Models/User.php` :

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Obtenir les tâches de l'utilisateur.
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Obtenir les catégories de l'utilisateur.
     */
    public function categories(): HasMany
    {
        return $this->hasMany(Category::class);
    }
}
```

## Tester les Modèles avec Tinker

Testons nos modèles :

```bash
php artisan tinker
```

```php
// D'abord créer un utilisateur de test
>>> $user = User::create(['name' => 'Jean', 'email' => 'jean@example.com', 'password' => bcrypt('password')])

// Créer une catégorie
>>> $category = $user->categories()->create(['name' => 'Travail', 'color' => '#ef4444'])

// Créer une tâche
>>> $task = $user->tasks()->create([
...     'title' => 'Terminer le cours Laravel',
...     'description' => 'Finir toutes les leçons et les défis',
...     'category_id' => $category->id,
...     'due_date' => now()->addDays(7),
...     'priority' => 'high'
... ])

// Interroger les tâches
>>> $user->tasks()->count()
=> 1

>>> $user->tasks()->incomplete()->get()
=> [Collection de tâches...]

>>> $task->category->name
=> "Travail"

>>> $task->isOverdue()
=> false
```

## Résumé des Relations

```php
// Depuis l'Utilisateur (User)
$user->tasks;              // Toutes les tâches de l'utilisateur
$user->tasks()->create();  // Créer une tâche pour l'utilisateur
$user->categories;         // Toutes les catégories de l'utilisateur

// Depuis la Tâche (Task)
$task->user;               // Le propriétaire de la tâche
$task->category;           // La catégorie de la tâche
$task->isOverdue();        // Vérifier si elle est en retard

// Depuis la Catégorie (Category)
$category->user;           // Le propriétaire de la catégorie
$category->tasks;          // Les tâches dans cette catégorie
```

Maintenant, créons les routes et les contrôleurs !

## Ressources

- [Modèles Eloquent](https://laravel.com/docs/12.x/eloquent) — Guide complet de l'ORM Eloquent
- [Relations Eloquent](https://laravel.com/docs/12.x/eloquent-relationships) — Comprendre les relations Eloquent

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
