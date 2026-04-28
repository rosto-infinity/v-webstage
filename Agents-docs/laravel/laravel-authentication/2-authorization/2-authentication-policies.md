---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-policies"
---

# L'Autorisation avec les Policies (Stratégies)

Les `Policies` (Stratégies) sont des classes qui organisent la logique d'autorisation autour d'un Modèle (Model) particulier. Elles sont beaucoup plus structurées que les Gates et sont idéales pour regrouper toute la logique d'autorisation complexe liée à une ressource d'application métiers.

## Créer des Policies

Laravel fournit une commande Artisan pour générer rapidement une Policy associée à un Modèle :

```bash
# Crée une Policy dédiée au modèle Post
php artisan make:policy PostPolicy --model=Post
```

Cela crée le fichier `app/Policies/PostPolicy.php` avec toutes les méthodes CRUD de base pré-générées :

```php
<?php

namespace App\Policies;

use App\Models\Post;
use App\Models\User;

class PostPolicy
{
    /**
     * L'utilisateur peut-il voir LA LISTE de TOUS les articles ? (index)
     */
    public function viewAny(User $user): bool
    {
        return true;  // N'importe quel utilisateur connecté peut voir la liste
    }

    /**
     * L'utilisateur peut-il voir UN article spécifique ? (show)
     */
    public function view(User $user, Post $post): bool
    {
        // Autorisé si : L'article est public OU l'utilisateur est l'auteur
        return $post->is_public || $user->id === $post->user_id;
    }

    /**
     * L'utilisateur peut-il CRÉER de nouveaux articles ? (create/store)
     */
    public function create(User $user): bool
    {
        // Autorisé uniquement si l'adresse email a été vérifiée
        return $user->email_verified_at !== null;
    }

    /**
     * L'utilisateur peut-il MODIFIER cet article ? (edit/update)
     */
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * L'utilisateur peut-il SUPPRIMER cet article ? (destroy)
     */
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * L'utilisateur peut-il RESTAURER cet article (Corbeille/Soft Deletes) ?
     */
    public function restore(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /**
     * L'utilisateur peut-il SUPPRIMER DÉFINITIVEMENT cet article ?
     */
    public function forceDelete(User $user, Post $post): bool
    {
        return $user->is_admin; // Seul un admin
    }
}
```

## Enregistrer les Policies

Laravel "découvre" automatiquement les policies par convention de nommage, tant que vos dossiers respectent la norme :

```text
Modèle : App\Models\Post
Policy : App\Policies\PostPolicy
```

Si vous avez une structure personnalisée, vous devez enregistrer manuellement le mapping dans `AppServiceProvider` :

```php
use App\Models\Post;
use App\Policies\PostPolicy;
use Illuminate\Support\Facades\Gate;

public function boot(): void
{
    // Indique à Laravel que PostPolicy décide des droits du modèle Post
    Gate::policy(Post::class, PostPolicy::class);
}
```

## Utiliser les Policies

La beauté des Policies réside dans le fait qu'une fois créées, elles s'utilisent **exactement** de la même manière que les Gates !

### Dans les Contrôleurs

Le helper `$this->authorize()` est votre meilleur ami dans les contrôleurs :

```php
class PostController extends Controller
{
    public function index()
    {
        // Puisqu'il n'y a pas encore d'objet $post, on passe le Nom de la Classe Modèle
        $this->authorize('viewAny', Post::class);

        return view('posts.index', ['posts' => Post::all()]);
    }

    public function show(Post $post)
    {
        // Laravel sait automatiquement qu'il doit cibler la vue `view` de `PostPolicy` !
        $this->authorize('view', $post);

        return view('posts.show', compact('post'));
    }

    public function edit(Post $post)
    {
        $this->authorize('update', $post);

        return view('posts.edit', compact('post'));
    }

    public function update(Request $request, Post $post)
    {
        // Va lever une exception 403 HTTP si $post->user_id != l'utilisateur actuel
        $this->authorize('update', $post);

        $post->update($request->validated());

        return redirect()->route('posts.show', $post);
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        $post->delete();

        return redirect()->route('posts.index');
    }
}
```

### Via le Modèle Utilisateur en PHP

```php
if ($user->can('update', $post)) {
    // L'utilisateur peut modifier
}

if ($user->cannot('delete', $post)) {
    // L'utilisateur ne peut pas supprimer
}

// Pour des méthodes qui n'ont pas encore d'instance (comme 'create')
if ($user->can('create', Post::class)) {
    // L'utilisateur a le droit d'afficher le formulaire de création
}
```

### Via la Façade Gate

```php
if (Gate::allows('update', $post)) {
    // Autorisé
}

Gate::authorize('delete', $post); // Lance l'erreur 403
```

### Dans les Vues Blade

```blade
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Modifier</a>
@endcan

@can('create', App\Models\Post::class)
    <a href="{{ route('posts.create') }}">Créer un Article</a>
@endcan

@cannot('delete', $post)
    <p>Vous n'avez pas le profil requis pour supprimer ceci.</p>
@endcannot
```

### Via Middleware (Le moyen le plus propre !)

Sécurisez directement vos routes avec le middleware intégré `can` :

```php
// Fichier: routes/web.php

// Structure : can:action,nom_du_parametre_de_la_route
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post');

// Pour une action sans modèle existant (index, create, store)
Route::post('/posts', [PostController::class, 'store'])
    ->middleware('can:create,App\Models\Post');
```

## Référence des Méthodes de Policy

Si vous utilisez des Resources Controllers (`Route::resource`), il y a une correspondance officielle entre les méthodes classiques et le nom des capacités (abilities) de la Policy.

| Méthode Policy | Méthode du Contrôleur (Route) | Paramètre Modèle Requis ? |
| -------------- | ----------------------------- | ------------------------- |
| `viewAny`      | `index`                       | Non                       |
| `view`         | `show`                        | Oui                       |
| `create`       | `create`, `store`             | Non                       |
| `update`       | `edit`, `update`              | Oui                       |
| `delete`       | `destroy`                     | Oui                       |
| `restore`      | `restore` (Corbeille)         | Oui                       |
| `forceDelete`  | `forceDelete`                 | Oui                       |

## La Méthode Initiale `before()` (Super Admin)

Si vous définissez une méthode `before` sur une Policy, elle s'exécutera **avant toute autre méthode** de cette Policy. C'est l'endroit parfait pour donner tous les droits à un Administrateur Système.

```php
public function before(User $user, string $ability): bool|null
{
    // Les Admins peuvent tout faire sans même devoir vérifier la logique spécifique au post !
    if ($user->is_admin) {
        return true;
    }

    // Retourner null laisse Laravel poursuivre vers la méthode d'autorisation habituelle (ex: update())
    return null;
}
```

## Utilisateurs Invités (Guest Users)

Par défaut, si quelqu'un n'est pas connecté, Laravel retourne `false` immédiatement sans même exécuter la Policy. Vous pouvez modifier ce comportement en rendant l'utilisateur de la Policy typé `nullable` :

```php
// Ajouter un point d'interrogation ?User pour autoriser les non-connectés à passer dans la fonction
public function view(?User $user, Post $post): bool
{
    // N'importe qui sur Internet a le droit de lire un article public
    if ($post->is_public) {
        return true;
    }

    // Si c'est privé, on vérifie si la personne (qui peut être nulle) est le bon propriétaire
    return $user?->id === $post->user_id;
}
```

## Réponses Détaillées (Policy Responses)

Comme pour les Gates, vous pouvez renvoyer une réponse explicite plutôt qu'un bête `false` :

```php
use Illuminate\Auth\Access\Response;

public function update(User $user, Post $post): Response
{
    if ($user->id !== $post->user_id) {
        return Response::deny("Vous n'êtes pas propriétaire de cet article.");
    }

    if ($post->is_locked) {
        // En frontend ($response->message()), on pourra afficher ce texte !
        return Response::deny("Cet article a été verrouillé par la modération.");
    }

    return Response::allow();
}
```

## Ressources

- [Autorisation - Stratégies (Policies)](https://laravel.com/docs/12.x/authorization#creating-policies) — Documentation officielle sur les Policies

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
