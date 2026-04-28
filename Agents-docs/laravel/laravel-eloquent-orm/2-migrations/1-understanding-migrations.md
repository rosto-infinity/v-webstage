---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-understanding-migrations"
---

# Comprendre les Migrations de Base de Données

Les migrations fonctionnent comme un système de contrôle de version (ex: Git) pour votre schéma de base de données. Elles permettent à votre équipe de définir, modifier et partager la définition du schéma de la base de données de l'application de manière structurée et réversible.

## Pourquoi utiliser des Migrations ?

### Ce qu'il se passe SANS les Migrations

```
"Hé, j'ai ajouté une colonne à la table users."
"Elle s'appelle comment ? Quel est son type ?"
"Exécute juste ce code SQL : ALTER TABLE users ADD COLUMN..."
"Est-ce que tu as aussi mis à jour le serveur de préproduction ?"
🤯 (Le chaos s'installe...)
```

### Ce qu'il se passe AVEC les Migrations

```
git pull
php artisan migrate
✅ La base de données de chacun est parfaitement à jour !
```

## Les Avantages des Migrations

| Avantage                      | Description                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Contrôle de Version**       | Les modifications du schéma sont historisées dans Git, comme n'importe quel code source.                                                   |
| **Synchronisation d'Équipe**  | Chaque développeur a exactement la même structure de base de données en local.                                                             |
| **Parité des Environnements** | Les environnements de Dev, Staging (Préprod) et Production restent synchronisés, évitant le classique "Mais ça marchait sur ma machine !". |
| **Volte-face (Rollback)**     | Possibilité d'annuler des modifications précises si quelque chose se passe mal.                                                            |
| **Agnosticisme de BDD**       | Les mêmes migrations fonctionnent sur MySQL, PostgreSQL, SQLite, etc. Laravel gère les syntaxes SQL spécifiques en arrière-plan.           |

## Créer des Migrations

```bash
# Créer une simple migration (sans modèle associé)
php artisan make:migration create_posts_table

# Créer une migration en même temps que son modèle (-m)
php artisan make:model Post -m

# Créer une migration pour modifier une table existante (attention à bien spécifier --table)
php artisan make:migration add_views_to_posts_table --table=posts
```

Les fichiers de migration sont générés dans le dossier `database/migrations/` et sont toujours précédés d'un horodatage (timestamp) pour garantir leur ordre d'exécution :

```
database/migrations/
├── 2024_01_01_000000_create_users_table.php
├── 2024_01_01_000001_create_cache_table.php
├── 2024_01_15_143022_create_posts_table.php
└── 2024_01_20_091500_add_views_to_posts_table.php
```

## Structure d'une Migration

Par défaut, une migration renvoie une classe anonyme héritant de `Migration` :

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécuter la migration (Appliquer les changements).
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id(); // Crée une clé primaire auto-incrémentée (BIGINT UNSIGNED)
            $table->string('title'); // VARCHAR
            $table->text('body');    // TEXT
            $table->timestamps();    // Crée 'created_at' et 'updated_at' automatiques
        });
    }

    /**
     * Inverser la migration (Annuler les changements réalisés dans up).
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

## Exécuter les Migrations

```bash
# Exécuter toutes les migrations en attente (jamais exécutées sur cette BDD)
php artisan migrate

# Consulter le statut actuel des migrations
php artisan migrate:status

# Exemple de sortie :
# Nom de la migration ........................ Lot (Batch) / Statut
# 2024_01_01_000000_create_users_table ........... [1] Exécuté (Ran)
# 2024_01_15_143022_create_posts_table ........... En attente (Pending)
```

## Annuler des Migrations (Rolling Back)

Laravel gère les migrations par "Lots" (Batches). Chaque fois que vous exécutez `php artisan migrate`, les nouvelles modifications appliquées sont regroupées dans un même lot.

```bash
# Annuler le dernier "Lot" (Batch) de migrations exécuté
php artisan migrate:rollback

# Annuler spécifiquement les 3 dernières migrations (peu importe les lots)
php artisan migrate:rollback --step=3

# Annuler TOUTES les migrations (Vide la BDD de toutes vos tables définies dans les migrations)
php artisan migrate:reset

# Annuler TOUTES les migrations puis les relancer immédiatement (Rafraîchir)
php artisan migrate:refresh

# Supprimer physiquement toutes les tables de la base et relancer toutes les migrations.
# (Plus rapide, car il ne s'embête pas à exécuter les méthodes `down()`. A utiliser en dev.)
php artisan migrate:fresh

# Lancer un migrate:fresh et exécuter les Seeders dans la foulée
php artisan migrate:fresh --seed
```

## Les Méthodes `up()` et `down()`

```php
public function up(): void
{
    // Créer, modifier, ou ajouter des éléments à la base de données
    Schema::create('posts', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        // ...
    });
}

public function down(): void
{
    // Inverser STRICTEMENT tout ce que up() a fait
    // Le but est de ramener la base de données à son état précédent exact
    Schema::dropIfExists('posts');
}
```

### Pourquoi la méthode `down()` est cruciale

Une erreur classique est de mal configurer (voire d'oublier) la méthode `down()` lorsqu'on ajoute des colonnes (plutôt qu'à la création d'une table entière) :

```php
// Mauvais : down() n'inverse pas correctement l'action de up()
public function up(): void
{
    Schema::table('posts', function (Blueprint $table) {
        $table->string('subtitle')->nullable();
        $table->integer('views')->default(0);
    });
}

public function down(): void
{
    // ❌ Manquant : les colonnes ne sont pas supprimées !
    // Si on fait un rollback, les colonnes resteront en base, causant potentiellement un plantage au prochain 'migrate'.
}

// Bon : down() efface ce que up() a spécifiquement ajouté
public function down(): void
{
    Schema::table('posts', function (Blueprint $table) {
        $table->dropColumn(['subtitle', 'views']); // Supprime bien les 2 colonnes
    });
}
```

## Conseils sur les Migrations (Tips)

### 1. Ne modifiez JAMAIS une migration déjà déployée

```php
// ❌ Ne modifiez jamais un fichier de migration qui a déjà été envoyé en production (déjà exécuté ailleurs).
// ✅ Si vous devez modifier une table, créez TOUJOURS une *nouvelle* migration pour y appliquer les changements.
```

### 2. Utilisez des noms descriptifs

```bash
# Bonnes Pratiques
php artisan make:migration add_published_at_to_posts_table
php artisan make:migration create_post_category_pivot_table
php artisan make:migration drop_legacy_users_table

# Mauvaises Pratiques
php artisan make:migration update_posts
php artisan make:migration changes
```

### 3. Gardez vos Migrations petites (Atomicité)

```php
// ✅ Un seul changement logique par migration.
// ❌ Ne combinez pas deux modifications non liées ensemble dans le même fichier.
```

## Ressources

- [Migrations de Base de Données](https://laravel.com/docs/12.x/migrations) — Documentation complète officielle de Laravel sur les migrations.

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
