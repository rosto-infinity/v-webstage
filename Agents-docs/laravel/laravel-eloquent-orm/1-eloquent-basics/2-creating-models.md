---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-creating-models"
---

# Création de Modèles Eloquent

Apprenez à générer des modèles, à les configurer et à personnaliser les conventions d'Eloquent pour répondre à vos besoins spécifiques.

## Générer des Modèles

Utilisez Artisan pour créer des modèles (Models) :

```bash
# Modèle simple
php artisan make:model Post

# Modèle avec sa migration (-m)
php artisan make:model Post -m

# Modèle avec migration, factory, seeder et contrôleur (-mfsc)
php artisan make:model Post -mfsc

# Modèle avec TOUS les fichiers liés (--all)
php artisan make:model Post --all

# Modèle avec tous les fichiers liés, incluant un contrôleur d'API ressources (--api)
php artisan make:model Post -mfscr --api
```

## Structure de Base d'un Modèle

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    // Le trait HasFactory permet d'utiliser les Model Factories pour les tests
    use HasFactory;
}
```

## Personnaliser le Nom de la Table

Surcharger le nom de la table par défaut (qui serait `posts` pour un modèle `Post`) :

```php
class Post extends Model
{
    /**
     * La table associée au modèle.
     */
    protected $table = 'blog_posts';
}
```

## Personnaliser la Clé Primaire (Primary Keys)

```php
class Post extends Model
{
    /**
     * La clé primaire du modèle (par défaut 'id').
     */
    protected $primaryKey = 'post_id';

    /**
     * Indique si la clé primaire est auto-incrémentée (par défaut true).
     */
    public $incrementing = false;

    /**
     * Le type de données de la clé primaire (par défaut 'int').
     */
    protected $keyType = 'string';  // Utile pour les UUIDs
}
```

### Utiliser des UUIDs comme Clés Primaires

```php
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Post extends Model
{
    use HasUuids;

    // Eloquent génèrera automatiquement des UUIDs (chape de caractères unique)
}

// OU utiliser les ULIDs (Universally Unique Lexicographically Sortable Identifier)
// Les ULIDs sont triables chronologiquement, contrairement aux UUIDs
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Post extends Model
{
    use HasUlids;
}
```

## Configuration des Horodatages (Timestamps)

```php
class Post extends Model
{
    /**
     * Désactiver entièrement les horodatages (created_at, updated_at).
     */
    public $timestamps = false;

    /**
     * Personnaliser le nom des colonnes d'horodatage.
     */
    const CREATED_AT = 'creation_date';
    const UPDATED_AT = 'last_updated';
}
```

## Connexion à la Base de Données

Utiliser une connexion à la base de données différente de celle par défaut :

```php
class Post extends Model
{
    /**
     * La connexion à la base de données pour le modèle.
     */
    protected $connection = 'mysql_secondary';
}
```

## Valeurs par Défaut des Attributs

```php
class Post extends Model
{
    /**
     * Valeurs par défaut pour certains attributs.
     */
    protected $attributes = [
        'status' => 'draft',
        'is_featured' => false,
    ];
}

// Utilisation
$post = new Post;
$post->status;  // 'draft' (par défaut)
```

## Le Mode Strict (Recommandé)

Activer le mode strict pour détecter les problèmes dès le développement :

```php
// Dans la méthode boot() de AppServiceProvider
use Illuminate\Database\Eloquent\Model;

public function boot(): void
{
    // Empêche le chargement paresseux (Lazy Loading). Oblige à utiliser Eager Loading en dev.
    Model::preventLazyLoading(! $this->app->isProduction());

    // Empêche l'ignorance silencieuse d'attributs non "fillable" lors d'une assignation de masse
    Model::preventSilentlyDiscardingAttributes(! $this->app->isProduction());

    // Empêche l'accès à des attributs manquants ou non initialisés
    Model::preventAccessingMissingAttributes(! $this->app->isProduction());
}
```

## Protection contre l'Assignation de Masse (Mass Assignment)

Contrôlez quels attributs peuvent être assignés massivement, par exemple via `User::create($request->all())` :

```php
class Post extends Model
{
    /**
     * Les attributs SONT assignables en masse ("liste blanche").
     */
    protected $fillable = [
        'title',
        'body',
        'category_id',
    ];
}

// OU spécifiez quels attributs NE SONT PAS assignables ("liste noire")
class Post extends Model
{
    /**
     * Les attributs qui NE SONT PAS assignables en masse.
     */
    protected $guarded = [
        'id',
        'is_admin',
    ];

    // Ou ne protéger aucun attribut (attention danger !)
    protected $guarded = [];
}
```

### Pourquoi s'en protéger ?

```php
// SANS protection, des utilisateurs malveillants pourraient faire :
// POST /users avec le payload JSON {"name": "John", "is_admin": true}

User::create($request->all());  // "is_admin" serait affecté !! Fail d'autorisation.

// AVEC $fillable = ['name', 'email'] :
User::create($request->all());  // L'attribut "is_admin" est tout simplement ignoré.
```

## Exemple Complet de Modèle

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    // HasFactory pour les tests, SoftDeletes pour la suppression douce
    use HasFactory, SoftDeletes;

    /**
     * Les attributs assignables en masse ("liste blanche").
     */
    protected $fillable = [
        'title',
        'slug',
        'body',
        'published_at',
        'user_id',
        'category_id',
    ];

    /**
     * Les attributs qui doivent être cachés lors de la sérialisation (tableaux/JSON).
     */
    protected $hidden = [
        'internal_notes', // Ne sera jamais renvoyé via API
    ];

    /**
     * Typage (Cast) des attributs. Très puissant pour transformer automatiquement les données.
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'is_featured' => 'boolean',
            'metadata' => 'array', // Transforme automatiquement la colonne TEXT JSON en tableau PHP
        ];
    }
}
```

## Ressources

- [Conventions des Modèles Eloquent](https://laravel.com/docs/12.x/eloquent#eloquent-model-conventions) — Documentation officielle sur les conventions des modèles

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
