---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-gates-introduction"
---

# L'Autorisation avec les Gates (Portes)

Les _Gates_ (Portes en français) sont des fermetures (closures) qui déterminent si un utilisateur est autorisé à effectuer une action donnée. Elles sont parfaites pour des vérifications d'autorisation simples et rapides qui ne nécessitent pas une classe `Policy` entière.

## Définir des Gates

Définissez les Gates dans la méthode `boot` de votre `AppServiceProvider` (ou dans un Service Provider dédié à l'autorisation comme `AuthServiceProvider` sur les anciennes versions de Laravel) :

```php
<?php

namespace App\Providers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        // 1. Gate simple (Vérifie juste le rôle de l'utilisateur)
        Gate::define('access-admin', function (User $user) {
            return $user->is_admin;
        });

        // 2. Gate avec un paramètre Modèle
        Gate::define('update-post', function (User $user, Post $post) {
            // Seul l'auteur de l'article a le droit de le modifier
            return $user->id === $post->user_id;
        });

        // 3. Gate renvoyant une réponse détaillée (et non juste true/false)
        Gate::define('delete-post', function (User $user, Post $post) {
            if ($user->id === $post->user_id) {
                return true;
            }

            // Retourne une réponse avec un message d'erreur personnalisé
            return Response::deny("Vous n'êtes pas propriétaire de cet article.");
        });
    }
}
```

## Utiliser les Gates

Il existe plusieurs façons de vérifier une Gate, selon l'endroit où vous vous trouvez dans le code.

### Dans les Contrôleurs

```php
use Illuminate\Support\Facades\Gate;

class PostController extends Controller
{
    public function update(Request $request, Post $post)
    {
        // Méthode 1 : allows() (Renvoie true si autorisé)
        if (Gate::allows('update-post', $post)) {
            // L'utilisateur peut modifier
        }

        // Méthode 2 : denies() (L'inverse direct de allows)
        if (Gate::denies('update-post', $post)) {
            abort(403); // Interrompt avec une erreur HTTP 403 Forbidden
        }

        // Méthode 3 : authorize() - Lance automatiquement l'exception 403 (Le plus propre !)
        Gate::authorize('update-post', $post);
        // Si la ligne ci-dessus échoue, cette ligne ne sera jamais lue

        $post->update($request->validated());
        return redirect()->route('posts.show', $post);
    }
}
```

### Via le Modèle Utilisateur (User)

Très pratique pour une lecture fluide du code :

```php
if ($request->user()->can('update-post', $post)) {
    // L'utilisateur peut modifier
}

if ($request->user()->cannot('update-post', $post)) {
    abort(403);
}
```

### Dans les Vues Blade

Indispensable pour masquer les boutons d'édition à ceux qui n'ont de toute façon pas le droit de les utiliser :

```blade
@can('update-post', $post)
    <a href="{{ route('posts.edit', $post) }}">Modifier</a>
@endcan

@cannot('delete-post', $post)
    <p>Vous ne pouvez pas supprimer cet article.</p>
@endcannot

{{-- Autorisé s'il a le droit de faire L'UNE des actions listées --}}
@canany(['update-post', 'delete-post'], $post)
    <div class="admin-actions">
        <!-- Boutons d'édition... -->
    </div>
@endcanany
```

## Réponses Détaillées (Gate Responses)

Puisque renvoyer simplement `false` ne donne aucune indication à l'utilisateur sur _pourquoi_ son accès est refusé, Laravel permet de renvoyer de vraies réponses :

```php
use Illuminate\Auth\Access\Response;

Gate::define('edit-settings', function (User $user) {
    if ($user->is_admin) {
        return Response::allow();
    }

    return Response::deny('Vous devez être administrateur pour voir cela.');
});

// À l'utilisation : inspect() permet d'analyser la réponse sans jeter d'erreur
$response = Gate::inspect('edit-settings');

if ($response->allowed()) {
    // Peut éditer
}

if ($response->denied()) {
    echo $response->message();  // Affiche : "Vous devez être administrateur pour voir cela."
}
```

## Les Crochets "Avant/Après" (Before and After Hooks)

Idéal pour, par exemple, donner tous les droits à un Super Administrateur sans avoir à modifier chaque Gate 1 par 1 :

```php
// S'exécute AVANT toutes les vérifications de Gate
Gate::before(function (User $user, string $ability) {
    // Les Super Admins peuvent TOUT faire (ignore le reste)
    if ($user->isSuperAdmin()) {
        return true;
    }

    // Retourner null permet à la vérification normale de la Gate de continuer
    return null;
});

// S'exécute APRÈS toutes les vérifications de Gate
Gate::after(function (User $user, string $ability, bool|null $result) {
    // Bonne pratique : Logger la tentative d'accès pour des raisons de sécurité de l'application
    Log::info("Vérification d'accès : {$ability}", [
        'user' => $user->id,
        'result' => $result,
    ]);
});
```

## Autorisation Rapide en Ligne (Inline)

Si vous ne voulez pas polluer le AppServiceProvider avec une vérification unique :

```php
// Vérification rapide à la volée
Gate::allowIf(fn (User $user) => $user->is_admin);
Gate::denyIf(fn (User $user) => $user->banned);

// Lance une exception en cas d'échec
try {
    Gate::allowIf(fn (User $user) => $user->is_admin);
} catch (AuthorizationException $e) {
    // Gérer l'échec
}
```

## Autoriser les Contrôleurs de Ressources (Resource)

Laravel peut mapper automatiquement les méthodes d'un Resource Controller aux règles d'autorisation !

```php
class PostController extends Controller
{
    public function __construct()
    {
        // Autorise automatiquement toutes les méthodes en lien avec le modèle "Post" !
        $this->authorizeResource(Post::class, 'post');
    }

    // Ce mapping "Magique" des rôles (abilities) aux méthodes s'appliquera :
    // index() → vérifie 'viewAny'
    // show() → vérifie 'view'
    // create() → vérifie 'create'
    // store() → vérifie 'create'
    // edit() → vérifie 'update'
    // update() → vérifie 'update'
    // destroy() → vérifie 'delete'
}
```

## Paramètres Multiples

```php
// Gate qui vérifie deux éléments à la fois
Gate::define('move-post', function (User $user, Post $post, Category $category) {
    return $user->id === $post->user_id
        && $category->accepts_posts; // Ex: vérifie que cette catégorie n'est pas verrouillée
});

// Utilisation (en passant un tableau de paramètres)
Gate::allows('move-post', [$post, $category]);
```

## Gérer les Utilisateurs Invités (Guest)

Normalement, une Gate échoue tout de suite si la personne n'est pas connectée. Mais vous pouvez "autoriser le null" :

```php
// Rendre le paramètre utilisateur optionnel (Nullable type : ?User)
Gate::define('view-post', function (?User $user, Post $post) {
    if ($post->is_public) {
        return true;  // N'importe qui (même sans compte) peut voir ce post public
    }

    // Si le post est privé, il faut obligatoirement qu'il soit à lui
    return $user?->id === $post->user_id; // Le `?->` Nullsafe est ultra pratique ici
});
```

## Ressources

- [Autorisation - Les Gates](https://laravel.com/docs/12.x/authorization#gates) — Documentation officielle sur les Gates

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
