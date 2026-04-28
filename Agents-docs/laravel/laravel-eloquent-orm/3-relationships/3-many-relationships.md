---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-many-to-many-relationships"
---

# Relations Plusieurs-à-Plusieurs (Many-to-Many)

Les relations plusieurs-à-plusieurs connectent des enregistrements où chaque côté peut avoir plusieurs enregistrements liés. Par exemple, un Article (`Post`) peut avoir plusieurs Étiquettes (`Tag`), et une Étiquette peut appartenir à plusieurs Articles.

## La Table Pivot (Pivot Table)

Une relation plusieurs-à-plusieurs nécessite une table intermédiaire (appelée table pivot) pour relier les deux autres tables :

```text
posts                post_tag (pivot)           tags
┌────┬──────────┐    ┌─────────┬────────┐       ┌────┬─────────┐
│ id │ title    │    │ post_id │ tag_id │       │ id │ name    │
├────┼──────────┤    ├─────────┼────────┤       ├────┼─────────┤
│ 1  │ "Post A" │◄──│ 1       │ 1      │──────►│ 1  │ "PHP"   │
│    │          │◄──│ 1       │ 2      │──┐    │ 2  │ "Laravel"│
│ 2  │ "Post B" │◄──│ 2       │ 2      │──┴───►│    │         │
└────┴──────────┘    └─────────┴────────┘       └────┴─────────┘

Le Post A a les tags : PHP, Laravel
Le Post B a le tag : Laravel
Le tag PHP est sur : Post A
Le tag Laravel est sur : Post A, Post B
```

## Créer la Table Pivot

```bash
php artisan make:migration create_post_tag_table
```

```php
// Convention Laravel : Noms des deux tables au singulier, par ordre alphabétique
// (p avant t => post_tag)
Schema::create('post_tag', function (Blueprint $table) {
    $table->foreignId('post_id')->constrained()->cascadeOnDelete();
    $table->foreignId('tag_id')->constrained()->cascadeOnDelete();

    // Empêche de lier deux fois le même tag au même article
    $table->primary(['post_id', 'tag_id']);

    $table->timestamps();  // Optionnel mais souvent très utile
});
```

## Définir la Relation

### Dans le modèle `Post`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Post extends Model
{
    /**
     * Obtenir les étiquettes pour l'article.
     */
    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }
}
```

### Dans le modèle `Tag`

```php
class Tag extends Model
{
    /**
     * Obtenir les articles ayant cette étiquette.
     */
    public function posts(): BelongsToMany
    {
        return $this->belongsToMany(Post::class);
    }
}
```

## Accéder aux Enregistrements Liés

```php
// Obtenir tous les tags d'un article
$post = Post::find(1);
foreach ($post->tags as $tag) {
    echo $tag->name;  // Affiche "PHP", "Laravel"
}

// Obtenir tous les articles ayant un tag spécifique
$tag = Tag::where('name', 'Laravel')->first();
foreach ($tag->posts as $post) {
    echo $post->title;
}
```

## Lier (Attaching) et Détacher (Detaching)

C'est ici que réside la vraie puissance de cette relation.

```php
$post = Post::find(1);

// Lier un seul tag (Ajoute une ligne dans la table pivot)
$post->tags()->attach($tagId);

// Lier plusieurs tags d'un coup
$post->tags()->attach([1, 2, 3]);

// Lier AVEC des données supplémentaires dans la table pivot
$post->tags()->attach($tagId, ['added_by' => auth()->id()]);

// Lier plusieurs tags avec des données supplémentaires
$post->tags()->attach([
    1 => ['added_by' => auth()->id()],
    2 => ['added_by' => auth()->id()],
]);

// Détacher (Supprime de la table pivot)
$post->tags()->detach($tagId);       // Un seul
$post->tags()->detach([1, 2, 3]);    // Plusieurs
$post->tags()->detach();             // Détache TOUS les tags de ce post
```

## Synchronisation (Syncing)

La méthode `sync()` est extrêmement pratique : elle compare le tableau fourni avec ce qui est en base de données, et **remplace** les relations pour qu'elles correspondent exactement au tableau. Les IDs manquants sont détachés, les nouveaux sont attachés.

```php
// Remplace toutes les relations actuelles par celles-ci uniquement
$post->tags()->sync([1, 2, 3]);

// Synchroniser avec des données pivot
$post->tags()->sync([
    1 => ['added_by' => auth()->id()],
    2,  // Pas de données spécifiques pour lui
    3 => ['added_by' => auth()->id()],
]);

// Synchroniser SANS détacher ce qui existe déjà (ajoute juste les nouveaux si absents)
$post->tags()->syncWithoutDetaching([1, 2, 3]);
```

## Basculer (Toggle)

Attache l'enregistrement s'il n'est pas lié, le détache s'il est déjà lié :

```php
$post->tags()->toggle([1, 2, 3]);
// Parfait pour une interface de cases à cocher ou de favoris ("like/unlike") !
```

## Données de la Table Pivot

Par défaut, Eloquent ne remonte que l'objet lié (ex: le Tag). Pour accéder aux colonnes de la table pivot, il faut l'indiquer dans la relation :

```php
// 1. D'abord, informer Eloquent qu'il y a des colonnes supplémentaires
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)
        ->withPivot('added_by', 'approved_at') // Liste des colonnes
        ->withTimestamps();                    // Inclure created_at et updated_at de la table pivot
}

// 2. Accéder aux données de la table pivot
$post = Post::find(1);
foreach ($post->tags as $tag) {
    // La propriété magique `pivot` contient les données de la table de liaison
    echo $tag->pivot->created_at;
    echo $tag->pivot->added_by;
}
```

## Personnaliser l'Accès à la Table Pivot

Le mot `pivot` n'est pas toujours très parlant métier (ex: un abonnement). Vous pouvez le renommer :

```php
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)
        ->as('tagging')  // Renomme l'accesseur pivot
        ->withPivot('added_by')
        ->withTimestamps();
}

// Utilisation :
foreach ($post->tags as $tag) {
    echo $tag->tagging->created_at;  // Au lieu de $tag->pivot->...
}
```

## Filtrer par Valeur Pivot

```php
// Récupérer les tags de cet article, mais uniquement ceux "approuvés" dans la table pivot
$approvedTags = $post->tags()->wherePivot('approved', true)->get();

// Tags ajoutés ce mois-ci
$recentTags = $post->tags()
    ->wherePivot('created_at', '>=', now()->subMonth())
    ->get();

// Utiliser un where in sur une colonne pivot
$tags = $post->tags()->wherePivotIn('added_by', [1, 2, 3])->get();
```

## Trier par Colonne Pivot

```php
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)
        ->withTimestamps()
        ->orderByPivot('created_at', 'desc'); // Trier par la date d'association la plus récente
}
```

## Modèles Pivot Personnalisés (Custom Pivot Classes)

Si votre table pivot commence à avoir beaucoup de logique métier, transformez-la en vrai modèle :

```php
use Illuminate\Database\Eloquent\Relations\Pivot;

// Notez bien que la classe hérite de `Pivot` et non de `Model`
class PostTag extends Pivot
{
    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}

// Dans le modèle Post, utilisez la méthode `using()` :
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)
        ->using(PostTag::class) // Dit à Eloquent d'utiliser cette classe pour la relation pivot
        ->withPivot('approved_by', 'approved_at');
}
```

## Ressources

- [Relations Plusieurs-à-Plusieurs](https://laravel.com/docs/12.x/eloquent-relationships#many-to-many) — Documentation officielle sur les relations Plusieurs-à-Plusieurs

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
