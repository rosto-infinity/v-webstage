---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-database-setup"
---

# Configurer la Base de Données

Maintenant, créons la structure de la base de données pour notre gestionnaire de tâches. Nous utiliserons les migrations Laravel pour définir nos tables.

## Comprendre les Migrations

Les migrations sont comme un **système de contrôle de version pour votre base de données**. Elles vous permettent de :

- Définir le schéma de base de données en code PHP
- Partager les modifications de base de données avec votre équipe
- Annuler les modifications si quelque chose se passe mal
- Suivre toutes les modifications au fil du temps

## Créer la Migration des Catégories

Tout d'abord, créons la table des catégories (categories) :

```bash
php artisan make:migration create_categories_table
```

Ouvrez `database/migrations/xxxx_xx_xx_create_categories_table.php` :

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécuter les migrations.
     */
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();  // ID auto-incrémenté

            // Clé étrangère vers la table users
            $table->foreignId('user_id')
                  ->constrained()  // Fait référence à users.id
                  ->cascadeOnDelete();  // Supprimer les catégories si l'utilisateur est supprimé

            $table->string('name');  // Nom de la catégorie
            $table->string('color', 7)->default('#6366f1');  // Code couleur hexadécimal

            $table->timestamps();  // created_at et updated_at
        });
    }

    /**
     * Annuler les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

### Comprendre le Schéma

| Méthode                        | Description                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `$table->id()`                 | Crée une colonne `id` auto-incrémentée                                         |
| `$table->foreignId('user_id')` | Crée la colonne `user_id` pour la clé étrangère                                |
| `->constrained()`              | Ajoute la contrainte de clé étrangère vers `users.id`                          |
| `->cascadeOnDelete()`          | Supprime les catégories si l'utilisateur est supprimé (suppression en cascade) |
| `$table->string('name')`       | Colonne VARCHAR pour le nom de la catégorie                                    |
| `$table->string('color', 7)`   | VARCHAR(7) pour le code couleur hexa (#RRGGBB)                                 |
| `$table->timestamps()`         | Ajoute les colonnes `created_at` et `updated_at`                               |

## Créer la Migration des Tâches

Maintenant, créez la table des tâches (tasks) :

```bash
php artisan make:migration create_tasks_table
```

Éditez `database/migrations/xxxx_xx_xx_create_tasks_table.php` :

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécuter les migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            // Clé étrangère vers la table users
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Clé étrangère vers categories (nullable - la tâche peut ne pas avoir de catégorie)
            $table->foreignId('category_id')
                  ->nullable()  // La tâche ne nécessite pas de catégorie
                  ->constrained()
                  ->nullOnDelete();  // Définir à null si la catégorie est supprimée

            // Détails de la tâche
            $table->string('title');
            $table->text('description')->nullable();
            $table->boolean('completed')->default(false);
            $table->date('due_date')->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');

            $table->timestamps();

            // Index pour des requêtes plus rapides
            $table->index(['user_id', 'completed']);
            $table->index(['user_id', 'due_date']);
        });
    }

    /**
     * Annuler les migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
```

### Explication des Nouveaux Concepts

| Méthode             | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `->nullable()`      | La colonne peut contenir la valeur NULL                      |
| `->nullOnDelete()`  | Définit à NULL quand l'enregistrement lié est supprimé       |
| `$table->text()`    | Colonne TEXT pour un contenu plus long                       |
| `$table->boolean()` | Colonne BOOLEAN/TINYINT (booléen)                            |
| `$table->date()`    | Colonne DATE (sans l'heure)                                  |
| `$table->enum()`    | Colonne ENUM avec des valeurs spécifiques autorisées         |
| `$table->index()`   | Crée un index de base de données pour accélérer les requêtes |

## Exécuter les Migrations

Appliquez les migrations pour créer les tables :

```bash
php artisan migrate
```

Vous devriez voir ceci :

```
   INFO  Running migrations.

  2024_01_15_100000_create_categories_table .......... 5.42ms DONE
  2024_01_15_100001_create_tasks_table ............... 8.31ms DONE
```

## Vérifier la Base de Données

Utilisez Tinker pour vérifier que les tables existent :

```bash
php artisan tinker
```

```php
>>> Schema::hasTable('categories')
=> true

>>> Schema::hasTable('tasks')
=> true

>>> Schema::getColumnListing('tasks')
=> [
     "id",
     "user_id",
     "category_id",
     "title",
     "description",
     "completed",
     "due_date",
     "priority",
     "created_at",
     "updated_at",
   ]
```

## Référence des Commandes de Migration

```bash
# Exécuter toutes les migrations en attente
php artisan migrate

# Annuler le dernier lot de migrations exécutées
php artisan migrate:rollback

# Annuler toutes les migrations (vider la base)
php artisan migrate:reset

# Annuler puis ré-exécuter toutes les migrations
php artisan migrate:refresh

# Supprimer toutes les tables (DROP) et ré-exécuter les migrations
php artisan migrate:fresh

# Vérifier le statut des migrations (quelles ont été exécutées)
php artisan migrate:status
```

## Diagramme de la Base de Données

Notre structure de base de données complète :

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │   categories    │     │     tasks       │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │◄────│ user_id (FK)    │     │ id (PK)         │
│ name            │     │ id (PK)         │◄────│ category_id (FK)│
│ email           │     │ name            │     │ user_id (FK)    │────►
│ password        │     │ color           │     │ title           │
│ created_at      │     │ created_at      │     │ description     │
│ updated_at      │     │ updated_at      │     │ completed       │
└─────────────────┘     └─────────────────┘     │ due_date        │
                                                │ priority        │
                                                │ created_at      │
                                                │ updated_at      │
                                                └─────────────────┘
```

Ensuite, nous allons créer les modèles Eloquent pour interagir avec ces tables !

## Ressources

- [Migrations de Base de Données](https://laravel.com/docs/12.x/migrations) — Guide complet sur les migrations de Laravel

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
