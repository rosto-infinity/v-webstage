---
source_course: "laravel-api-development"
source_lesson: "laravel-api-development-introduction-to-apis"
---

# Introduction aux API REST dans Laravel

Les API REST (Representational State Transfer) permettent aux applications (comme une application mobile ou un front-end Vue.js/React) de communiquer avec votre serveur via HTTP. Laravel rend la création d'API élégante et directe.

## Qu'est-ce qu'une API REST ?

Les API REST utilisent les méthodes HTTP classiques pour effectuer des opérations (CRUD) sur des "ressources" :

| Méthode HTTP | Action (CRUD)          | Exemple d'URL  | Description              |
| ------------ | ---------------------- | -------------- | ------------------------ |
| GET          | Lire (Read)            | `/api/posts`   | Lister tous les articles |
| GET          | Lire (Read)            | `/api/posts/1` | Obtenir l'article n°1    |
| POST         | Créer (Create)         | `/api/posts`   | Créer un nouvel article  |
| PUT/PATCH    | Mettre à jour (Update) | `/api/posts/1` | Modifier l'article n°1   |
| DELETE       | Supprimer (Delete)     | `/api/posts/1` | Supprimer l'article n°1  |

## Les Routes d'API dans Laravel

Les routes dédiées aux API sont définies dans le fichier `routes/api.php` :

```php
// routes/api.php
use App\Http\Controllers\Api\PostController;

Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);
Route::post('/posts', [PostController::class, 'store']);
Route::put('/posts/{post}', [PostController::class, 'update']);
Route::delete('/posts/{post}', [PostController::class, 'destroy']);
```

Les spécificités des routes écrites dans `api.php` sont :

- Elles sont **automatiquement préfixées** par `/api` (ex: `mondomaine.com/api/posts`).
- Elles sont **sans état (Stateless)** : Pas de sessions PHP matérielles, pas de cookies classiques de "Login". Chaque requête doit prouver qui elle est (avec un Token).
- Elles sont soumises à une **Limitation de Débit (Rate-limited)** par défaut (ex: 60 requêtes par minute maxi) pour éviter le spam.

## Votre Premier Contrôleur d'API

Utilisez le flag `--api` pour générer un contrôleur sans les méthodes `create()` et `edit()` (puisqu'une API ne renvoie pas de formulaires HTML !) :

```bash
php artisan make:controller Api/PostController --api
```

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse; // Retourne toujours du JSON

class PostController extends Controller
{
    /**
     * Afficher une liste d'articles.
     */
    public function index(): JsonResponse
    {
        // On récupère les 15 plus récents avec pagination automatique
        $posts = Post::latest()->paginate(15);

        return response()->json($posts);
    }

    /**
     * Stocker un article nouvellement créé.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $post = Post::create($validated);

        // 201 = Status HTTP "Created" (Bonne pratique REST)
        return response()->json($post, 201);
    }

    /**
     * Afficher l'article spécifié.
     */
    public function show(Post $post): JsonResponse
    {
        // Grâce au Route Model Binding, $post est déjà récupéré depuis la base !
        return response()->json($post);
    }

    /**
     * Mettre à jour l'article spécifié.
     */
    public function update(Request $request, Post $post): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'body' => 'sometimes|required|string',
        ]);

        $post->update($validated);

        return response()->json($post);
    }

    /**
     * Supprimer l'article spécifié.
     */
    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        // 204 = Status HTTP "No Content" (Supprimé, rien de plus à dire)
        return response()->json(null, 204);
    }
}
```

## Les Réponses JSON (JSON Responses)

Laravel est magique : il convertit automatiquement les Tableaux et les Modèles Eloquent en JSON quand il les renvoie d'un contrôleur.

```php
// Les tableaux PHP standards deviennent du JSON propre
return response()->json([
    'message' => 'Succès',
    'data' => $post,
]);

// Raccourci Ultime : Retourner juste l'objet le convertit en JSON !
return $post;  // Objet Model unique
return Post::all();  // Collection entière de Modèles
```

## Les Codes de Statut HTTP (Status Codes)

Respecter les conventions permet aux développeurs Front-end de gérer correctement les erreurs.

```php
// Les Codes de Succès
return response()->json($data, 200);  // OK (Par défaut si on ne met rien)
return response()->json($post, 201);  // C'est crééé !
return response()->json(null, 204);   // Action réussie mais pas de contenu à renvoyer (Suppression)

// Les Codes d'Erreurs Client (La faute de l'utilisateur)
return response()->json(['error' => 'Article introuvable'], 404); // Typiquement géré tout seul par Laravel
return response()->json(['error' => 'Validation échouée'], 422);   // Idem, géré par $request->validate()
return response()->json(['error' => 'Non authentifié'], 401);      // Il manque le Token !
return response()->json(['error' => 'Interdit'], 403);             // Il a le token, mais pas les droits.

// Les Codes d'Erreurs Serveur (Votre faute)
return response()->json(['error' => 'Erreur critique du serveur'], 500);
```

## Les Routes de Ressources (Resource Routes)

Plutôt que d'écrire 5 lignes dans `api.php`, écrivez-en une seule !

```php
// Crée 5 routes d'un coup (index, show, store, update, destroy)
Route::apiResource('posts', PostController::class);

// Besoin d'en déclarer plusieurs ?
Route::apiResources([
    'posts' => PostController::class,
    'comments' => CommentController::class,
]);

// Ressources imbriquées (/api/posts/1/comments/5)
Route::apiResource('posts.comments', CommentController::class);
```

## Tester ses Endpoints API (Testing)

Vous pouvez utiliser un logiciel comme **Postman** ou **Insomnia**, ou bien utiliser simplement **cURL** en ligne de commande :

```bash
# GET : Tous les articles
curl http://localhost:8000/api/posts

# GET : Un article précis
curl http://localhost:8000/api/posts/1

# POST : Créer un article (Envoi de JSON)
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title": "Mon Nouvel Article", "body": "Contenu passionnant"}'

# PUT : Mettre à jour (Update)
curl -X PUT http://localhost:8000/api/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Titre Modifié"}'

# DELETE : Supprimer
curl -X DELETE http://localhost:8000/api/posts/1
```

## L'En-tête (Header) `Accept` crucial

Les applications client (Vue, React, Application Mobile) doivent **TOUJOURS** envoyer l'en-tête `Accept: application/json` dans leurs requêtes.

Pourquoi ? C'est ce qui dit à Laravel : _"Hé, je suis un robot, ne me renvoie pas de code HTML !"_.

```php
// SANS l'en-tête Accept: json :
// Si la validation échoue, Laravel va essayer de vous rediriger (Code 302)
// vers la page précédente, ce qui va planter votre application Vue/React !

// AVEC l'en-tête Accept: json :
// Laravel comprend et vous renvoie une vraie erreur JSON Code 422 :
{
    "message": "Le champ titre est requis.",
    "errors": {
        "title": ["Le champ titre est requis."]
    }
}
```

## Ressources

- [Documentation sur le Routage d'API](https://laravel.com/docs/12.x/routing#api-routes) — Officiel

---

> 📘 _Cette leçon fait partie du cours [Développement d'API Laravel](/laravel/laravel-api-development/) sur la plateforme d'apprentissage RostoDev._
