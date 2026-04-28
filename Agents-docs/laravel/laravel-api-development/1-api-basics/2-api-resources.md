---
source_course: "laravel-api-development"
source_lesson: "laravel-api-development-api-resources"
---

# Ressources d'API (API Resources) : Transformer les Données

Les "Ressources d'API" (API Resources) fournissent une couche de transformation entre vos modèles Eloquent bruts et les réponses JSON finales envoyées au client. Elles vous donnent un **contrôle total et granulaire** sur la structure de vos données.

## Pourquoi utiliser les Ressources ?

Parce qu'un modèle Eloquent contient souvent des secrets (mot de passe, `remember_token`, champs d'administration cachés) que vous ne voulez **jamais** exposer au public. Et parfois, vous voulez concaténer un "prénom" et un "nom" en "nom_complet".

```php
// SANS Ressources (DANGEREUX !) - Expose toute la table base de données
return User::find(1);
// {"id":1, "name":"John", "email":"john@ex.com", "password":"$2y$...", "remember_token":"abc"}

// AVEC Ressources (SÉCURISÉ) - Contrôle strict de ce qui sort
return new UserResource(User::find(1));
// {"id":1, "name":"John", "email":"john@ex.com"}
```

## Créer des Ressources

```bash
# Pour formater UN SEUL modèle (ex: voir un profil)
php artisan make:resource UserResource

# Pour formater une COLLECTION de modèles (ex: lister tous les utilisateurs)
php artisan make:resource UserCollection
```

## Une Ressource de Base

Le fichier généré définit une méthode `toArray()` qui dicte à quoi ressemblera l'objet JSON final :

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transforme la ressource en tableau PHP (qui sera converti en JSON).
     */
    public function toArray(Request $request): array
    {
        return [
            // $this fait référence au modèle Eloquent sous-jacent (le User)
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            // Formatage propre de la date ISO 8601 pour les APIs REST
            'created_at' => $this->created_at->toISOString(),
            // On a VOLONTAIREMENT omis le mot de passe !
        ];
    }
}
```

### Utilisation dans le Contrôleur

```php
use App\Http\Resources\UserResource;

// Retourner UNE seule ressource
public function show(User $user)
{
    return new UserResource($user); // On utilise 'new'
}

// Retourner TOUTE UNE COLLECTION
public function index()
{
    // On utilise la méthode statique ::collection()
    return UserResource::collection(User::all());
}

// Avec la Pagination (Laravel inclut magiquement les liens prev/next !)
public function index()
{
    return UserResource::collection(User::paginate(15));
}
```

## Ressources avec Relations (Relationships)

Votre réponse API peut inclure des entités liées (ex: Un Article avec son Auteur). Vous pouvez **imbriquer** des Ressources !

```php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            // L'Auteur est un simple objet UserResource (relation HasOne/BelongsTo)
            'author' => new UserResource($this->user),
            // Les Commentaires sont un tableau d'objets (relation HasMany)
            'comments' => CommentResource::collection($this->comments),
            'tags' => TagResource::collection($this->tags),
        ];
    }
}
```

## Attributs Conditionnels (Conditional Attributes)

Le VRAI pouvoir des Ressources : n'envoyer des données que sous certaines conditions.

```php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,

            // 1. NE l'inclure QUE SI la relation a été chargée via `with('user')`
            // 🚨 Cela empêche le dramatique problème des requêtes N+1 de BDD !!
            'author' => new UserResource($this->whenLoaded('user')),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),

            // 2. Condition basée sur une valeur externe (Ex: Si c'est un Admin qui fait la requête)
            'secret' => $this->when($request->user()?->isAdmin(), $this->secret),

            // 3. Condition basée sur l'URL de la requête (?include_body=1)
            'body' => $this->when($request->has('include_body'), $this->body),

            // 4. Fusionner plusieurs champs uniquement sous condition
            $this->mergeWhen($request->user()?->isAdmin(), [
                'internal_id' => $this->internal_id,
                'notes' => $this->admin_notes,
            ]),
        ];
    }
}
```

## Les "Collections" de Ressources (Resource Collections)

Parfois vous voulez rajouter des métadonnées globales à votre liste, autour des résultats bruts. Au lieu de `UserResource::collection()`, créez une vraie classe `UserCollection`.

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class PostCollection extends ResourceCollection
{
    /**
     * Quel type d'objet unique cette collection contient-elle ?
     */
    public $collects = PostResource::class;

    public function toArray(Request $request): array
    {
        return [
            // $this->collection donne le tableau d'items (le tableau des PostResources)
            'data' => $this->collection,

            // On ajoute nos Méta-données personnalisées à la racine du JSON
            'meta' => [
                'total' => $this->collection->count(),
                'has_more' => $this->hasMorePages(), // Seulement si c'est paginate()
            ],
        ];
    }
}
```

## Ajouter des Méta-données à la volée (Meta Data)

Même dans une simple Resource (article unique), vous pouvez ajouter des métas via la méthode `with()`.

```php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
        ];
    }

    public function with(Request $request): array
    {
        // Ces clées seront à côté de la clé 'data' tout en haut !
        return [
            'meta' => [
                'version' => '1.0',
                'generated_at' => now()->toISOString(),
            ],
        ];
    }
}
```

Résultat :

```json
{
  "data": {
    "id": 1,
    "title": "Mon super Titre"
  },
  "meta": {
    "version": "1.0",
    "generated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

## Désactiver l'enveloppe "data" (Wrapping Data)

Par défaut, Laravel enveloppe toujours l'objet principal dans une clé `"data": { ... }`. Si votre client front-end déteste ça, vous pouvez le retirer globalement :

```php
// Dans AppServiceProvider (méthode boot) pour tout désactiver partout :
JsonResource::withoutWrapping();
```

Ou bien le changer par classe pour donner un nom plus précis :

```php
class UserResource extends JsonResource
{
    public static $wrap = null;  // Pas du tout d'enveloppe
    // OU
    public static $wrap = 'user'; // Le JSON commencera par {"user": {...}} au lieu de "data"
}
```

## Personnaliser les En-têtes HTTP de Réponse

Si un profil est premium, rajoutez un en-tête (Header) caché !

```php
class PostResource extends JsonResource
{
    public function withResponse(Request $request, JsonResponse $response): void
    {
        $response->header('X-Resource-Version', '1.0');

        if ($this->is_premium) {
            $response->header('X-Premium-Content', 'true');
        }
    }
}
```

## Exemple Complet d'un PostResource Idéal

```php
class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => Str::limit($this->body, 150),

            // On ne donne le corps entier de l'article QUE SI on est sur la page DÉTAIL !
            'body' => $this->when($request->routeIs('posts.show'), $this->body),

            // Formatage de l'URL absolue de l'image
            'featured_image' => $this->featured_image
                ? asset('storage/' . $this->featured_image)
                : null,

            'is_published' => $this->published_at !== null,
            'published_at' => $this->published_at?->toISOString(),

            // Relations ultra-sûres avec whenLoaded (Zéro requêtes N+1)
            'author' => new UserResource($this->whenLoaded('user')),
            'category' => new CategoryResource($this->whenLoaded('category')),
            'tags' => TagResource::collection($this->whenLoaded('tags')),

            // Les données compteurs avec whenCounted()
            'comments_count' => $this->whenCounted('comments'),

            // Bonnes pratiques HATEOAS (Fournir l'URL de soi-même)
            'links' => [
                'self' => route('api.posts.show', $this),
            ],
        ];
    }
}
```

## Ressources

- [Ressources API Eloquent](https://laravel.com/docs/12.x/eloquent-resources) — Documentation officielle de Laravel.

---

> 📘 _Cette leçon fait partie du cours [Développement d'API Laravel](/laravel/laravel-api-development/) sur la plateforme d'apprentissage RostoDev._
