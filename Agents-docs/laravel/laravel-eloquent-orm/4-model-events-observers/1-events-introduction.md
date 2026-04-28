---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-model-events-introduction"
---

# Introduction aux Événements de Modèles (Model Events)

Les modèles Eloquent déclenchent de nombreux événements au cours de leur cycle de vie, vous permettant de vous y "greffer" (hook) à des moments clés comme la création, la mise à jour ou la suppression d'enregistrements. Cela vous permet d'automatiser des actions de manière centralisée et de garder vos contrôleurs propres et concis.

## Événements de Modèles Disponibles

Eloquent déclenche ces événements pendant le cycle de vie d'un modèle :

```text
┌─────────────────────────────────────────────────────────────────┐
│                    CYCLE DE VIE DES ÉVÉNEMENTS                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  CREATING ─────► CREATED                                        │
│  (avant l'encodage) (après la création en base)                 │
│                                                                  │
│  UPDATING ─────► UPDATED                                        │
│  (avant la MAJ)  (après la mise à jour en base)                 │
│                                                                  │
│  SAVING ───────► SAVED                                          │
│  (avant création (après toute sauvegarde :                      │
│   ou MAJ)         création ou mise à jour)                      │
│                                                                  │
│  DELETING ─────► DELETED                                        │
│  (avant supprim.)(après la suppression)                         │
│                                                                  │
│  TRASHED ─────── (suppression douce unique, après deleted)      │
│                                                                  │
│  RESTORING ────► RESTORED                                       │
│  (avant restau.) (après restauration d'une suppression douce)   │
│                                                                  │
│  FORCE_DELETING ► FORCE_DELETED                                 │
│  (suppression     (après la suppression permanente)             │
│   définitive)                                                   │
│                                                                  │
│  REPLICATING                                                    │
│  (lors de l'utilisation de la méthode replicate())              │
│                                                                  │
│  RETRIEVED                                                      │
│  (après la récupération depuis la base de données)              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Séquence des Événements

### Lors de la Création d'un Nouveau Modèle

```php
$post = Post::create([...]);

// 1. saving     (avant l'insertion)
// 2. creating   (avant l'insertion, spécifique aux nouveaux enregistrements)
// 3. REQUÊTE SQL (INSERT INTO posts ...)
// 4. created    (après l'insertion)
// 5. saved      (après l'insertion)
```

### Lors de la Mise à Jour d'un Modèle Existant

```php
$post->update([...]);

// 1. saving     (avant la mise à jour)
// 2. updating   (avant la mise à jour, spécifique à l'existant)
// 3. REQUÊTE SQL (UPDATE posts SET ...)
// 4. updated    (après la mise à jour)
// 5. saved      (après la mise à jour)
```

## Définir des Événements avec les Fermetures (Closures)

La façon la plus simple d'écouter les événements de modèle est d'utiliser des fermetures (fonctions anonymes) dans la méthode `booted()` du modèle lui-même :

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class Post extends Model
{
    /**
     * La méthode "booted" du modèle (lancée au démarrage).
     */
    protected static function booted(): void
    {
        // Générer un slug AVANT de créer (creating)
        static::creating(function (Post $post) {
            $post->slug = Str::slug($post->title);
        });

        // Logger l'info APRÈS la création (created)
        static::created(function (Post $post) {
            logger()->info('Nouvel article créé', ['id' => $post->id]);
        });

        // Empêcher la suppression AVANT de supprimer (deleting)
        static::deleting(function (Post $post) {
            if ($post->comments()->exists()) {
                // Retourner `false` permet d'annuler complètement l'action !
                return false;
            }
        });

        // Nettoyer des fichiers annexes APRÈS la suppression (deleted)
        static::deleted(function (Post $post) {
            // Supprime l'image à la une du disque
            Storage::delete($post->featured_image);
        });
    }
}
```

## Cas Pratiques d'Utilisation Fréquents

### Génération Automatique de Valeurs

```php
static::creating(function (Post $post) {
    // Générer un UUID
    $post->uuid = Str::uuid();

    // Générer le slug basé sur le titre
    $post->slug = Str::slug($post->title);

    // Assigner des valeurs par défaut intelligentes
    $post->status = $post->status ?? 'draft';

    // Assigner automatiquement l'auteur
    $post->user_id = $post->user_id ?? auth()->id();
});
```

### Maintien des Données Liées (Intégrité Manuelle)

```php
static::updating(function (Post $post) {
    // Mettre à jour le slug UNIQUEMENT si le titre a été modifié (isDirty)
    if ($post->isDirty('title')) {
        $post->slug = Str::slug($post->title);
    }
});

static::deleted(function (Post $post) {
    // Supprimer manuellement tous les commentaires en cascade
    $post->comments()->delete();

    // Ou détacher les tags de la table pivot
    $post->tags()->detach();
});
```

### Validation et Prévention

```php
static::deleting(function (User $user) {
    // Empêcher la suppression d'administrateurs avec une erreur explicite
    if ($user->is_admin) {
        throw new \Exception('Suppression des administrateurs interdite.');
    }

    // Ou annuler silencieusement si l'utilisateur possède des articles
    if ($user->posts()->exists()) {
        return false;
    }
});
```

### Mise en Cache Automatique

```php
static::saved(function (Setting $setting) {
    // Vider le cache des paramètres d'application quand n'importe quel paramètre est MAJ
    Cache::forget('app_settings');
});

static::deleted(function (Setting $setting) {
    Cache::forget('app_settings');
});
```

## Annuler des Événements

Si vous retournez manuellement `false` depuis les événements `creating`, `updating`, `saving`, `deleting`, ou `restoring`, l'opération parente ciblée (la requête vers la base de données) sera **annulée et ne s'exécutera pas** !

```php
static::creating(function (Post $post) {
    if ($post->containsSpam()) { // Méthode hypothétique
        return false;  // Empêche purement et simplement la création !
    }
});
```

## Notes Très Importantes

### Les Mises à Jour Simultanées (Mass Updates) ne Lancent PAS d'Événements

Comme les "Mises à jour de masse" s'exécutent en une seule grosse requête SQL sans d'abord récupérer (hydrater) chaque modèle individuellement, Eloquent ne peut pas lancer les événements pour chacun.

```php
// ❌ Les événements (saving/updating) NE SONT PAS déclenchés !
Post::where('published', false)->update(['status' => 'draft']);

// ✅ Les événements (saving/updating) SONT déclenchés pour chaque modèle trouvé
Post::where('published', false)->get()->each->update(['status' => 'draft']);
```

Bien que plus propre avec les événements, prenez conscience que la seconde méthode fera autant de requêtes SQL Update qu'il y a d'articles !

### Opérations Silencieuses (Quiet Operations)

Il est possible de sauter l'exécution des événements si c'est nécessaire. Très utile pour des scripts d'importation massifs ou pour faire des modifications "sans alerter le système" :

```php
// Sauvegarder sans déclencher 'saving' / 'saved'
$post->saveQuietly();

// Supprimer sans déclencher 'deleting' / 'deleted'
$post->deleteQuietly();

// À l'intérieur d'une fermeture (closure) - aucun événement n'est déclenché
Post::withoutEvents(function () {
    Post::where('old', true)->delete();
});
```

## Ressources

- [Événements Eloquent](https://laravel.com/docs/12.x/eloquent#events) — Documentation officielle sur les événements de modèles Eloquent

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
