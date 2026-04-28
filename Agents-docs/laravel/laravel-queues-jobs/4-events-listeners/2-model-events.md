---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-model-events"
---

# Événements de Modèles et Observateurs (Model Events and Observers)

Les modèles Eloquent déclenchent nativement des événements tout au long de leur cycle de vie. Cela vous permet "d'accrocher" du code (hook) à des moments clés comme la création, la modification ou la suppression d'une donnée en base.

## Les Événements de Modèle (Model Events)

Un Modèle Eloquent lance automatiquement ces événements :

| Événement       | Quand est-il déclenché ?                                                |
| --------------- | ----------------------------------------------------------------------- |
| `retrieved`     | APRES que le modèle ait été récupéré depuis la base de données.         |
| `creating`      | JUSTE AVANT que le modèle ne soit créé en BDD (`INSERT`).               |
| `created`       | APRES que le modèle ait été créé avec succès.                           |
| `updating`      | JUSTE AVANT que le modèle ne soit mis à jour (`UPDATE`).                |
| `updated`       | APRES que le modèle ait été mis à jour avec succès.                     |
| `saving`        | JUSTE AVANT que le modèle ne soit créé OU mis à jour.                   |
| `saved`         | APRES que le modèle ait été créé OU mis à jour.                         |
| `deleting`      | JUSTE AVANT que le modèle ne soit supprimé (`DELETE`).                  |
| `deleted`       | APRES que le modèle ait été supprimé avec succès.                       |
| `trashed`       | APRES que le modèle ait été supprimé en mode "Soft Delete" (Corbeille). |
| `forceDeleting` | JUSTE AVANT la suppression définitive (Ignorant le Soft Delete).        |
| `forceDeleted`  | APRES la suppression définitive.                                        |
| `restoring`     | JUSTE AVANT de restaurer un modèle depuis la corbeille.                 |
| `restored`      | APRES l'avoir restauré.                                                 |
| `replicating`   | Quand un modèle est dupliqué (`$model->replicate()`).                   |

## Utiliser des Fonctions Anonymes (Closures) dans le Modèle

Pour de petites actions, vous pouvez définir la réaction directement dans la méthode statique `booted()` de votre Modèle :

```php
use Illuminate\Support\Str;

class User extends Model
{
    protected static function booted(): void
    {
        // Avant chaque création, générer un UUID automatiquement
        static::creating(function (User $user) {
            $user->uuid = Str::uuid();
        });

        // Après chaque création, lui créer un Profil vide par défaut
        static::created(function (User $user) {
            $user->profile()->create();
        });

        // Avant de le supprimer, effacer manuellement tous ses articles (Cascade silencieuse)
        static::deleting(function (User $user) {
            $user->posts()->delete();
        });
    }
}
```

## Créer des Observateurs (Observers)

Si vous avez beaucoup de logique, ne polluez pas le Modèle. Créez une classe dédiée appelée `Observer`.

```bash
php artisan make:observer UserObserver --model=User
```

Cela génère `app/Observers/UserObserver.php`. Vous n'y mettez que les méthodes dont vous avez besoin :

```php
<?php

namespace App\Observers;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class UserObserver
{
    public function creating(User $user): void
    {
        $user->uuid = Str::uuid();
    }

    public function created(User $user): void
    {
        $user->profile()->create(['bio' => '']); // Son profil est créé
        $user->notify(new WelcomeNotification()); // Le mail de bienvenue part automatiquement !
    }

    public function updated(User $user): void
    {
        // Si (et seulement si) on vient de modifier son adresse email !
        if ($user->isDirty('email')) {
            $user->email_verified_at = null; // On annule sa vérification
            $user->saveQuietly();  // IMPORTANT: Sauvegarde SANS déclencher d'autre évenement `updated` en boucle !
            $user->sendEmailVerificationNotification(); // On renvoie un mail de verif
        }
    }

    public function deleted(User $user): void
    {
        Log::info('Utilisateur envoyé à la corbeille', ['user_id' => $user->id]);
    }

    public function forceDeleted(User $user): void
    {
        // S'il est définitivement supprimé pour le RGPD, on efface vraiment sa photo de notre serveur
        Storage::delete($user->avatar_path);
    }
}
```

## Enregistrer les Observateurs

Comment Laravel sait qu'il doit exécuter ce fichier ?

### Option 1 : Via l'AppServiceProvider (Classique)

```php
use App\Models\User;
use App\Observers\UserObserver;

public function boot(): void
{
    // On dit au Modèle User qu'il est surveillé par UserObserver
    User::observe(UserObserver::class);
}
```

### Option 2 : Via les Attributs PHP 8 (Moderne et Propre)

Vous pouvez lier l'observateur directement au-dessus du Modèle ciblé !

```php
use App\Observers\UserObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy(UserObserver::class)] // <-- La Magie est là
class User extends Model
{
    // ...
}
```

## Prévenir les Boucles Infinies (`saveQuietly`)

🚨 **LE PIÈGE CLASSIQUE :** Mettre à jour un Modèle depuis son propre événement `updating` ou `updated` !

```php
public function updated(User $user): void
{
    // 💥 CATASTROPHE : Ça va relancer l'événement `updated`, qui va relancer `updated` à l'infini jusqu'au crash du serveur !
    // $user->update(['last_activity' => now()]);

    // ✅ SOLUTION : Utiliser saveQuietly() qui sauvegarde en ignorant les événements
    $user->last_activity = now();
    $user->saveQuietly();
}
```

## Logique Conditionnelle (Annuler une action)

Dans les événements qui finissent en **"ing"** (`creating`, `updating`, `deleting`...) vous pouvez **annuler** l'action qui était en cours en retournant simplement `false` !

```php
public function saving(User $user): bool|void
{
    // Si l'utilisateur est banni, on bloque TOUTE sauvegarde sur lui de part et d'autre de l'application !
    if ($user->isBanned()) {
        return false;
    }
}

public function deleting(User $user): bool|void
{
    // Empêcher la destruction d'un compte s'il a encore un abonnement premium actif
    if ($user->hasActiveSubscription()) {
        return false; // L'appel à $user->delete() échouera silencieusement
    }
}
```

## Exemple Complet d'un Observateur en Production

```php
<?php

namespace App\Observers;

use App\Models\Post;
use App\Jobs\NotifySubscribers;
use Illuminate\Support\Str;

class PostObserver
{
    public function creating(Post $post): void
    {
        // On assigne automatiquement l'auteur s'il a été oublié
        $post->user_id ??= auth()->id();

        // On génère son URL (slug) s'il n'en a pas
        $post->slug ??= Str::slug($post->title);
    }

    public function created(Post $post): void
    {
        // On nettoie le cache du nombre total d'articles
        cache()->forget('posts:count');

        // S'il est créé directement "Publié", on envoie les mails (en tâche de fond)
        if ($post->published_at) {
            NotifySubscribers::dispatch($post);
        }
    }

    public function updating(Post $post): void
    {
        // Si le titre a changé pendant l'édition, on recalcule le URL (slug)
        if ($post->isDirty('title')) {
            $post->slug = Str::slug($post->title);
        }
    }

    public function updated(Post $post): void
    {
        // On purge le cache qui stockait le contenu de cet article précis
        cache()->forget("post:{$post->id}");
        // On purge la page d'accueil (les 10 derniers articles)
        cache()->forget('posts:latest');
    }

    public function deleted(Post $post): void
    {
        cache()->forget("post:{$post->id}");
        cache()->forget('posts:count');
    }
}
```

## Ressources

- [Observateurs Eloquent (Observers)](https://laravel.com/docs/12.x/eloquent#observers) — Documentation officielle

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
