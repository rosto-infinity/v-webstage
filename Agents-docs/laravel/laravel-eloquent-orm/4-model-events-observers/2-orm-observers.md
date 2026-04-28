---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-observers"
---

# Création et Utilisation des Observateurs (Observers)

Les observateurs (Observers) sont des classes entièrement dédiées à l'écoute des événements d'un Modèle. Ils sont idéaux lorsqu'un modèle possède beaucoup de logique liée aux événements, ou lorsque cette logique devient complexe et pollue la classe du Modèle.

## Pourquoi utiliser des Observers ?

```php
// ❌ Le modèle devient pollué avec la logique métier des événements
class Post extends Model
{
    protected static function booted(): void
    {
        static::creating(function ($post) { /* 20 lignes de code */ });
        static::created(function ($post) { /* 15 lignes de code */ });
        static::updating(function ($post) { /* 25 lignes de code */ });
        static::deleting(function ($post) { /* 30 lignes de code */ });
    }
}

// ✅ Modèle propre, la logique est déportée dans une classe dédiée
class Post extends Model
{
    // C'est propre !
}

class PostObserver
{
    // Toute la logique événementielle est organisée ici de façon lisible
}
```

## Créer un Observateur

Laravel fournit une commande Artisan pour générer rapidement un Observer lié à un Modèle :

```bash
php artisan make:observer PostObserver --model=Post
```

Cela crée le fichier `app/Observers/PostObserver.php` :

```php
<?php

namespace App\Observers;

use App\Models\Post;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class PostObserver
{
    /**
     * Gère l'événement "creating" (en cours de création) du Post.
     * Se déclenche AVANT que le modèle ne soit sauvegardé pour la première fois.
     */
    public function creating(Post $post): void
    {
        // Générer le slug
        $post->slug = Str::slug($post->title);

        // Définir l'auteur s'il n'est pas déjà renseigné
        $post->user_id = $post->user_id ?? auth()->id();

        // Générer un UUID
        $post->uuid = Str::uuid();
    }

    /**
     * Gère l'événement "created" (créé) du Post.
     * Se déclenche APRÈS que le modèle ait été inséré en base.
     */
    public function created(Post $post): void
    {
        Log::info('Nouvel article créé', ['id' => $post->id, 'title' => $post->title]);

        // Exemple : Notifier les abonnés (assumant l'existence d'une relation followers)
        // Note : Il serait préférable de faire ça via une Job asynchrone pour ne pas ralentir la requête HTTP
        $post->user->followers->each(function ($follower) use ($post) {
            $follower->notify(new NewPostNotification($post));
        });
    }

    /**
     * Gère l'événement "updating" (en cours de mise à jour) du Post.
     * Se déclenche AVANT qu'un modèle existant ne soit mis à jour en base.
     */
    public function updating(Post $post): void
    {
        // Régénérer le slug uniquement si le titre a changé
        if ($post->isDirty('title')) {
            $post->slug = Str::slug($post->title);
        }
    }

    /**
     * Gère l'événement "updated" (mis à jour) du Post.
     * Se déclenche APRÈS la mise à jour en base.
     */
    public function updated(Post $post): void
    {
        // Purger le cache HTTP/Redis de l'article pour forcer son rafraîchissement
        Cache::forget("post:{$post->id}");

        Log::info('Article mis à jour', ['id' => $post->id]);
    }

    /**
     * Gère l'événement "saving" (en cours de sauvegarde) du Post.
     * Se déclenche AVANT toute sauvegarde (création OU mise à jour).
     */
    public function saving(Post $post): void
    {
        // Nettoyer le contenu HTML (exemple de sécurité de base)
        $post->body = strip_tags($post->body, '<p><br><strong><em><ul><li>');
    }

    /**
     * Gère l'événement "saved" (sauvegardé) du Post.
     * Se déclenche APRÈS toute sauvegarde (création OU mise à jour).
     */
    public function saved(Post $post): void
    {
        // Indexer le nouvel article pour un moteur de recherche (ex: Algolia/Meilisearch)
        SearchIndex::update($post);
    }

    /**
     * Gère l'événement "deleting" (en cours de suppression) du Post.
     * Retourner `false` annulera l'action de suppression en base !
     */
    public function deleting(Post $post): bool
    {
        // Empêcher la suppression si l'article possède des commentaires
        if ($post->comments()->exists()) {
            return false;
        }

        return true;
    }

    /**
     * Gère l'événement "deleted" (supprimé) du Post.
     */
    public function deleted(Post $post): void
    {
        // Nettoyer les fichiers annexes du serveur de stockage (ex: AWS S3)
        if ($post->featured_image) {
            Storage::delete($post->featured_image);
        }

        // Retirer l'article de l'index de recherche
        SearchIndex::remove($post);

        Log::info('Article supprimé', ['id' => $post->id]);
    }

    /**
     * Gère l'événement "restored" (restauré) du Post (Uniquement avec Soft Deletes).
     */
    public function restored(Post $post): void
    {
        // Ré-indexer l'article restauré
        SearchIndex::update($post);
    }

    /**
     * Gère l'événement "forceDeleted" (supprimé définitivement) du Post.
     */
    public function forceDeleted(Post $post): void
    {
        // Supprimer définitivement tous ses commentaires en cascade
        $post->comments()->forceDelete();
    }
}
```

## Enregistrer les Observers

Pour que Laravel sache qu'un Observer doit écouter un Modèle, vous devez "l'enregistrer". Il existe plusieurs manières de le faire :

### Méthode 1 : Utilisation des Attributs PHP `#[ObservedBy]` (Laravel 11+)

C'est la méthode moderne, la plus propre et recommandée depuis Laravel 11.

```php
<?php

namespace App\Models;

use App\Observers\PostObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([PostObserver::class])]
class Post extends Model
{
    // ...
}
```

### Méthode 2 : Dans la méthode `booted()` du Modèle

Si vous préférez définir cela au sein du code du modèle :

```php
<?php

namespace App\Models;

use App\Observers\PostObserver;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected static function booted(): void
    {
        static::observe(PostObserver::class);
    }
}
```

### Méthode 3 : Dans un Service Provider (Ancienne méthode)

C'était l'approche standard avant Laravel 11 (souvent dans `AppServiceProvider` ou un `EventServiceProvider` dédié).

```php
// app/Providers/AppServiceProvider.php
use App\Models\Post;
use App\Observers\PostObserver;

public function boot(): void
{
    Post::observe(PostObserver::class);
}
```

## Éviter les Boucles Infinies (Infinite Loops)

Faites extrêmement attention si vous tentez de mettre à jour un modèle _à l'intérieur_ de ses propres événements `updated` ou `saved` !

```php
// ❌ DANGER : Boucle Infinie (Crash du serveur) !
public function updating(Post $post): void
{
    // Sauvegarder dans 'updating' va redéclencher 'updating', qui va sauvegarder, qui va redéclencher...
    $post->view_count++;
    $post->save();
}

// ✅ SÉCURISÉ : Utiliser saveQuietly()
public function updated(Post $post): void
{
    $post->timestamps = false;  // Empêcher la MAJ intempestive de 'updated_at'
    $post->saveQuietly();       // Sauvegarder sans déclencher de nouveaux événements
    $post->timestamps = true;   // Rétablir le comportement normal
}

// ✅ SÉCURISÉ : Utiliser le Constructeur de Requêtes (Query Builder - DB)
// Contourne Eloquent et ne lance pas d'événements
public function updated(Post $post): void
{
    DB::table('posts')
        ->where('id', $post->id)
        ->update(['last_activity' => now()]);
}
```

## Logique Conditionnelle dans les Observers

L'utilisation de la méthode `isDirty()` (et ses cousines) est primordiale pour ne réagir qu'aux changements pertinents :

```php
public function updating(Post $post): void
{
    // Régénérer le slug UNIQUEMENT si le titre a explicitement changé
    if ($post->isDirty('title')) {
        $post->slug = Str::slug($post->title);
    }

    // Comparer la NOUVELLE valeur avec l'ANCIENNE valeur (getOriginal)
    if ($post->isDirty('status')) {
        $oldStatus = $post->getOriginal('status');
        $newStatus = $post->status;

        // Si l'article passe spécifiquement de 'Brouillon' à 'Publié'
        if ($oldStatus === 'draft' && $newStatus === 'published') {
            $post->published_at = now();
        }
    }
}
```

## Bonnes Pratiques avec les Observers

1. **Gardez vos observers concentrés** : Un seul Observer par Modèle.
2. **Ne faites jamais d'appels HTTP (API externes)** dans des observers synchrones (ex: Envoi de mails, Ping API). Préférez déclencher un Job (`dispatch()`) pour ne pas ralentir la requête web courante.
3. **Faites attention avec les Relations** : Dans les événements comme `deleted`, les relations peuvent ne pas être chargées en mémoire.
4. **Testez vos observers** : Ces actions automatiques en arrière-plan sont la cause de nombreux bugs furtifs ("Pourquoi mon document a été supprimé tout seul ?").
5. **Documentez les effets de bord** : C'est le revers de la médaille d'avoir un "Modèle Propre". Un autre développeur regardant le modèle `Post` ne sait pas qu'il existe un Observer qui modifie son comportement.

## Ressources

- [Les Observers (Observateurs)](https://laravel.com/docs/12.x/eloquent#observers) — Documentation officielle sur les Observateurs d'Eloquent

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
