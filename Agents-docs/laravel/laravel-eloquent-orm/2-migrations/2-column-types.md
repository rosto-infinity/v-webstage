---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-column-types"
---

# Types de Colonnes et Modificateurs (Migrations)

Le constructeur de schéma de Laravel (Schema Builder) fournit une API fluide pour définir les colonnes de vos tables de base de données. Explorons l'ensemble des types de colonnes et des modificateurs disponibles.

## Types de Colonnes Courants

### Chaînes de caractères et Texte

```php
$table->char('code', 4);           // Chaîne de longueur fixe (VARCHAR toujours rempli d'espaces à 4)
$table->string('name', 100);       // VARCHAR(100) (Longueur max, 255 par défaut)
$table->text('description');       // TEXT (Max ~64Ko)
$table->mediumText('content');     // MEDIUMTEXT (Max ~16Mo)
$table->longText('body');          // LONGTEXT (Max ~4Go)
```

### Nombres

```php
$table->integer('quantity');          // INTEGER (Entier de base : -2 milliards à +2 milliards)
$table->tinyInteger('status');        // TINYINT (-128 à 127)
$table->smallInteger('order');        // SMALLINT (-32 768 à 32 767)
$table->mediumInteger('medium');      // MEDIUMINT (-8 millions à +8 millions)
$table->bigInteger('views');          // BIGINT (Entier très grand)

// Version (Non signé - Unsigned) (Uniquement positif, double la capacité maximum)
$table->unsignedInteger('count');     // UNSIGNED INTEGER (0 à 4 milliards)
$table->unsignedBigInteger('user_id'); // INDISPENSABLE pour servir de clé étrangère vers un id()

// Nombres à virgule (Flottants et Décimaux)
$table->float('amount', 8, 2);        // FLOAT(8, 2) - Flottant avec 8 chiffres au total, dont 2 après la virgule
$table->double('latitude', 15, 8);    // DOUBLE(15, 8) - Précision double
$table->decimal('price', 10, 2);      // DECIMAL(10, 2) - Idéal pour les prix exacts (stocké sous forme de chaîne précise)
```

### Booléens

```php
$table->boolean('is_active');         // BOOLLEN (En MySQL, c'est converti en TINYINT(1))
```

### Dates et Heures

```php
$table->date('birth_date');                   // DATE (AAAA-MM-JJ)
$table->time('alarm_time');                   // TIME (HH:MM:SS)
$table->dateTime('published_at');             // DATETIME (Date + Heure)
$table->timestamp('verified_at');             // TIMESTAMP (Soumis aux fuzaux horaires et limites de ~2038)
$table->timestamps();                         // Crée magiquement created_at & updated_at (TIMESTAMP)
$table->timestampTz('created_at');            // TIMESTAMP avec timezone
$table->year('graduation_year');              // YEAR
```

### JSON

```php
$table->json('settings');             // JSON
$table->jsonb('settings');            // JSONB (Format JSON optimisé, exclusif à PostgreSQL)
```

### Données Binaires

```php
$table->binary('data');               // BLOB (Pour stocker des fichiers images/PDF directement, déconseillé en général)
```

### Types Spéciaux

```php
$table->id();                         // Clé primaire BIGINT UNSIGNED AUTO-INCRÉMENTÉE par défaut
$table->uuid('id');                   // Colonne UUID (Identifiant unique universel de 36 caractères)
$table->ulid('id');                   // Colonne ULID (UUID triable chronologiquement de 26 caractères)
$table->foreignId('user_id');         // Raccourci pour UNSIGNED BIGINT, utilisé pour les clés étrangères
$table->ipAddress('visitor_ip');      // Adresse IPv4 ou IPv6 (VARCHAR(45))
$table->macAddress('device_mac');     // Adresse Physique MAC (VARCHAR(17))
$table->enum('status', ['draft', 'published', 'archived']); // Suite de valeurs figées (souvent déconseillé par rapport à de simples strings Laravel Enums)
$table->set('options', ['a', 'b', 'c']);  // Type SET (Choix multiples parmi une liste figée)
```

## Les Modificateurs de Colonnes (Modifiers)

Les modificateurs (modifiers) permettent de modifier le comportement des colonnes ou d'ajouter des contraintes. Ils peuvent être chaînés.

```php
$table->string('email')->nullable();           // Autoriser la valeur NULL (très commun)
$table->string('email')->nullable(false);      // Interdire NULL (comportement par défaut)
$table->integer('votes')->default(0);          // Valeur par défaut si non précisée lors de l'insertion
$table->string('email')->unique();             // Contrainte d'unicité sur la table
$table->integer('order')->unsigned();          // Interdire les valeurs négatives
$table->string('title')->comment('Titre de l\'article'); // Ajouter un commentaire visible dans le gestionnaire MySQL
$table->timestamp('added_at')->useCurrent();   // Valeur par défaut: CURRENT_TIMESTAMP
$table->timestamp('updated_at')->useCurrentOnUpdate(); // Mettre à jour automatiquement avec CURRENT_TIMESTAMP à chaque modification de ligne (comportement de updated_at)
```

### Positionner les Colonnes (MySQL uniquement)

```php
$table->string('city')->after('address');      // Placer la colonne `city` jute après `address`
$table->string('id')->first();                 // Forcer la colonne en tant que toute première colonne de la table
```

### Colonnes Invisibles (MySQL 8.0.23+)

```php
$table->string('secret')->invisible();         // Exclue la colonne lors d'un "SELECT *" global (requiert MySQL 8+)
```

## Les Clés Primaires (Primary Keys)

```php
// Clé primaire standard auto-incrémentée (la convention Laravel)
$table->id();                              // Génère `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
$table->id('post_id');                     // Même chose mais avec un nom de colonne personnalisé

// Clé primaire composée (Composite Primary Key - utile pour les tables pivots)
$table->primary(['user_id', 'post_id']);

// Clé primaire basée sur des UUID (et non des entiers)
$table->uuid('id')->primary();
```

## Les Index (Indexes)

Ajouter des index permet de grandement accélérer les requêtes de recherche/filtrage (au prix d'insertions légèrement plus lentes).

```php
// Index sur une seule colonne
$table->string('email')->unique();         // Index unique (accélère les recherches + empêche les doublons)
$table->string('slug')->index();           // Index normal (accélère simplement les recherches type WHERE slug =)

// Index composé sur plusieurs colonnes (utile si vous filtrez souvent avec une condition "AND")
$table->unique(['email', 'tenant_id']);    // Index composé unique (L'email doit être unique par rapport au tenant_id uniquement)
$table->index(['status', 'created_at']);   // Index composé normal

// Noms d'index personnalisés
// (Laravel génère généralement des noms corrects automatiquement, mais ils peuvent parfois dépasser la limite de caractères MySQL)
$table->index('email', 'users_email_index');

// Index "Plein Texte" (Full-text index) (pour la recherche de texte complexe comme avec MATCH() AGAINST())
$table->text('body');
$table->fullText('body');

// Index Spatial (pour les coordonnées GPS)
$table->point('location');
$table->spatialIndex('location');
```

## Les Clés Étrangères (Foreign Keys)

Les clés étrangères lient les tables entre elles pour assurer l'intégrité référentielle des données (ex: on ne peut pas créer un post pour un utilisateur qui n'existe pas en base).

```php
// Méthode 1 : Déclaration explicite classique
$table->unsignedBigInteger('user_id'); // 1) Créer la colonne du bon type (UNSIGNED BIGINT)
$table->foreign('user_id')             // 2) La désigner comme étrangère
    ->references('id')                 // 3) Elle pointe vers la colonne `id`
    ->on('users')                      // 4) De la table `users`
    ->onDelete('cascade');             // 5) Règle: Supprimer le Post automatiquement si le User est supprimé !

// Méthode 2 : Raccourci magique / Modèle (très recommandé)
// Identique à ci-dessus : devine automatiquement 'users' à partir de 'user_id'
$table->foreignId('user_id')->constrained()->cascadeOnDelete();

// Avec options explicites
$table->foreignId('user_id')
    ->constrained()             // Fait référence à users.id
    ->onUpdate('cascade')
    ->onDelete('cascade');

// Pointe vers une table spécifique non-standard
$table->foreignId('author_id')
    ->constrained('users', 'id')
    ->nullOnDelete();

// Clé étrangère autorisant une valeur NULL (Optionnelle)
$table->foreignId('category_id')
    ->nullable() // Indispensable de mettre nullable() AVANT constrained()
    ->constrained()
    ->nullOnDelete();  // Règle: Si la catégorie mère est supprimée, la valeur de la colonne 'category_id' des posts passera simplement à NULL.
```

## Exemple Complet de Migration de Table

Voici à quoi ressemble la création complète de table avec toutes ces notions de colonnes, modificateurs, index et contraintes relationnelles :

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Création de la table `posts`
        Schema::create('posts', function (Blueprint $table) {
            $table->id();

            // Clés étrangères
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

            // Colonnes classiques
            $table->string('title');
            $table->string('slug')->unique(); // Doit être unique
            $table->text('excerpt')->nullable(); // Optionnel
            $table->longText('body');
            $table->string('featured_image')->nullable();
            $table->json('metadata')->nullable(); // Pour des données supplémentaires optionnelles

            // Valeurs par défaut
            $table->unsignedInteger('views')->default(0); // Pas de vues ngatives
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();

            // Horodatages et suppressions douces
            $table->timestamps();
            $table->softDeletes();

            // Ajout d'Index Supplémentaires (au-delà de la clé primaire et des UUID déjà indexés)
            // Cet index composé va grandement accélérer les requêtes: where('is_featured', true)->orderBy('published_at') !
            $table->index(['published_at', 'is_featured']);
            // Index plein-texte pour la recherche dans les articles
            $table->fullText('body');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
```

## Ressources

- [Types de Colonnes Disponibles](https://laravel.com/docs/12.x/migrations#available-column-types) — Liste complète de tous les types de colonnes pris en charge par le Schema Builder de Laravel.

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
