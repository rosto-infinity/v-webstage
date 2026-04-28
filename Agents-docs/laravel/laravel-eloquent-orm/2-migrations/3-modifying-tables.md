---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-modifying-tables"
---

# Modifier des Tables Existantes

Au fur et à mesure que votre application évolue, vous aurez besoin de modifier des tables de base de données existantes. Laravel rend cela facile avec des commandes de migration dédiées pour ajouter, modifier et supprimer des colonnes.

## Ajouter des Colonnes (Adding Columns)

Pour ajouter une colonne à une table existante, créez une nouvelle migration en précisant la table cible avec l'option `--table` :

```bash
php artisan make:migration add_phone_to_users_table --table=users
```

```php
public function up(): void
{
    // Schema::table (et non Schema::create) indique une modification de table
    Schema::table('users', function (Blueprint $table) {
        $table->string('phone', 20)->nullable()->after('email'); // after() place la colonne à un endroit précis (MySQL uniquement)
        $table->date('birth_date')->nullable();
        $table->json('preferences')->nullable();
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        // En cas de rollback, on supprime ces 3 colonnes
        $table->dropColumn(['phone', 'birth_date', 'preferences']);
    });
}
```

## Modifier des Colonnes (Modifying Columns)

Avant Laravel 11, il était obligatoire d'installer le paquet `doctrine/dbal` pour modifier des colonnes existantes. Depuis Laravel 11+, c'est géré nativement dans la plupart des cas, mais pour des bases de données plus anciennes ou complexes, le paquet peut toujours s'avérer utile :

```bash
composer require doctrine/dbal
```

Ensuite, utilisez la méthode `change()` à la fin de la redéfinition de la colonne :

```php
public function up(): void
{
    Schema::table('posts', function (Blueprint $table) {
        // Changer le type d'une colonne
        $table->text('title')->change();  // C'était un VARCHAR (string), ça devient un TEXT

        // Rendre une colonne nullable
        $table->string('subtitle')->nullable()->change();

        // Changer la valeur par défaut d'une colonne existante
        $table->integer('views')->default(0)->change();

        // Renommer une colonne
        $table->renameColumn('body', 'content');
    });
}

public function down(): void
{
    Schema::table('posts', function (Blueprint $table) {
        // Inverser tous les changements pour un rollback propre
        $table->string('title', 255)->change();
        $table->string('subtitle')->nullable(false)->change();
        $table->integer('views')->default(null)->change(); // Ou enlever le default
        $table->renameColumn('content', 'body');
    });
}
```

## Supprimer des Colonnes (Dropping Columns)

```php
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        // Supprimer une seule colonne
        $table->dropColumn('legacy_field');

        // Supprimer plusieurs colonnes en passant un tableau
        $table->dropColumn(['old_field', 'unused_field']);
    });
}
```

### Supprimer avec des Index / Clés Étrangères

Il est crucial de supprimer la clé étrangère ou l'index _avant_ de pouvoir supprimer la colonne elle-même, sous peine de plantage MySQL/Postgres.

```php
public function up(): void
{
    Schema::table('posts', function (Blueprint $table) {
        // Supprimer d'abord la contrainte de clé étrangère, PUIS la colonne
        // Le nom généré par défaut par Laravel est: table_colonne_foreign
        $table->dropForeign(['user_id']);  // Supprime la contrainte 'posts_user_id_foreign'
        $table->dropColumn('user_id');

        // Supprimer un index puis la colonne
        $table->dropIndex(['status']);      // Supprime l'index 'posts_status_index'
        $table->dropColumn('status');

        // Supprimer une contrainte d'unicité
        $table->dropUnique(['email']);      // Supprime 'posts_email_unique'
    });
}
```

## Gérer les Index

```php
public function up(): void
{
    Schema::table('posts', function (Blueprint $table) {
        // Ajouter des index sur des colonnes déjà créées
        $table->index('slug');
        $table->unique('email');
        $table->index(['status', 'published_at'], 'posts_status_published_index'); // Nom d'index imposé
    });
}

public function down(): void
{
    Schema::table('posts', function (Blueprint $table) {
        // Supprimer par le nom de la colonne (Laravel déduit le nom de l'index généré)
        $table->dropIndex(['slug']);        // Supprimera 'posts_slug_index'
        $table->dropUnique(['email']);      // Supprimera 'posts_email_unique'

        // Ou supprimer via le nom explicite de l'index s'il avait été forcé
        $table->dropIndex('posts_status_published_index');
    });
}
```

## Renommer des Tables Existantess

```php
public function up(): void
{
    // Renommer la table 'posts' en 'articles'
    Schema::rename('posts', 'articles');
}

public function down(): void
{
    // Rollback : remettre l'ancien nom
    Schema::rename('articles', 'posts');
}
```

## Vérifier l'Existence d'une Table ou d'une Colonne

Cela s'avère extrêmement pratique pour éviter les erreurs "Column already exists" lors de migrations complexes ou de reprises de code legacy.

```php
public function up(): void
{
    // Vérifier si la table existe avant d'agir
    if (Schema::hasTable('users')) {
        // Modifier la table...
    }

    // Vérifier si la colonne existe
    if (Schema::hasColumn('users', 'email')) {
        // La colonne existe, on peut la modifier ou l'indexer
    }

    // Vérifier multiples colonnes en même temps
    if (Schema::hasColumns('users', ['email', 'name'])) {
        // Les deux colonnes existent
    }
}
```

## Exemples Typiques de Cas Réels

### Ajouter une colonne de Statut avec une Valeur par Défaut

```php
public function up(): void
{
    Schema::table('orders', function (Blueprint $table) {
        $table->enum('status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
            ->default('pending') // Tous les anciens enregistrements prendront cette valeur !
            ->after('total');
    });
}
```

### Convertir de Nullable à Requis (NOT NULL)

Si la colonne contenait des données `NULL`, les rendre "NOT NULL" via `->change()` provoquera une erreur SQL. Il faut assainir les données existantes d'abord !

```php
public function up(): void
{
    // 1. D'abord, on met à jour en SQL brutal les enregistrements problématiques
    DB::table('posts')
        ->whereNull('published_at')
        ->update(['published_at' => now()]);

    // 2. Ensuite on peut la passer en NOT NULL (false nullable) sans faire crasher la BDD
    Schema::table('posts', function (Blueprint $table) {
        $table->timestamp('published_at')->nullable(false)->change();
    });
}
```

### Ajouter le système de Corbeille (Soft Deletes) à une table existante

```php
public function up(): void
{
    Schema::table('posts', function (Blueprint $table) {
        $table->softDeletes();  // Ajoute magiquement la colonne `deleted_at`
    });
}

public function down(): void
{
    Schema::table('posts', function (Blueprint $table) {
        $table->dropSoftDeletes();  // Supprime la colonne `deleted_at`
    });
}
```

### Transformer une relation 1-à-Plusieurs en Plusieurs-à-Plusieurs (Créer une Table Pivot)

```php
public function up(): void
{
    // Création de la table pivot de base
    Schema::create('post_tag', function (Blueprint $table) {
        $table->foreignId('post_id')->constrained()->cascadeOnDelete();
        $table->foreignId('tag_id')->constrained()->cascadeOnDelete();

        // Assure qu'un même tag ne peut être lié qu'une seule fois au même article
        $table->primary(['post_id', 'tag_id']);

        $table->timestamps();
    });
}
```

## Ressources

- [Modifier des Colonnes](https://laravel.com/docs/12.x/migrations#modifying-columns) — Documentation officielle de Laravel sur la modification de colonnes.

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
