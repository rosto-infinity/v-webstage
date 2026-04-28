---
source_course: "laravel-api-development"
source_lesson: "laravel-api-development-api-validation"
---

# Validation et Gestion des Erreurs d'API (API Validation and Error Handling)

Une validation stricte et une gestion des erreurs prévisible sont cruciales pour la fiabilité d'une API. Laravel fournit des outils pour rendre ces deux aspects à la fois élégants et cohérents.

## Validation dans les Contrôleurs d'API

La manière la plus rapide de valider des données :

```php
public function store(Request $request): JsonResponse
{
    // Si la validation échoue, Laravel intercepte tout et retourne un JSON 422 automatiquement !
    $validated = $request->validate([
        'title' => 'required|string|max:255',
        'body' => 'required|string',
        'category_id' => 'required|exists:categories,id', // Vérifie que la catégorie existe en BDD
        'tags' => 'nullable|array',
        'tags.*' => 'exists:tags,id', // Vérifie que chaque tag du tableau existe
    ]);

    $post = Post::create($validated);

    return response()->json($post, 201);
}
```

Si le client envoie l'en-tête `Accept: application/json` et que la requête ne respecte pas les règles, Laravel génère cette belle réponse sans que vous ne codiez rien :

```json
{
  "message": "Le champ titre est requis. (et 1 erreur de plus)",
  "errors": {
    "title": ["Le champ titre est requis."],
    "body": ["Le champ contenu est requis."]
  }
}
```

## Form Request Validation (Garder le Contrôleur Propre)

Pour les validations complexes, externalisez la logique dans un fichier dédié :

```bash
php artisan make:request StorePostRequest
```

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StorePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Pensez à vérifier les Gates/Policies ici plus tard
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'body' => 'required|string|min:100',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array|max:5',
            'tags.*' => 'exists:tags,id',
            'published_at' => 'nullable|date|after:now',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Veuillez fournir un titre pour votre article.',
            'body.min' => 'Le contenu doit faire au moins 100 caractères.',
            'tags.max' => 'Vous ne pouvez sélectionner que 5 tags maximum.',
        ];
    }

    /**
     * (OPTIONNEL) Transformer totalement la forme de l'erreur renvoyée
     * au lieu d'utiliser le format standard de Laravel vu ci-dessus.
     */
    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Erreurs de validation',
                'errors' => $validator->errors(),
            ], 422) // Code HTTP "Unprocessable Entity"
        );
    }
}
```

## Réponses d'Erreurs Personnalisées Globales

Vous aimeriez que TOUTES les erreurs (404, 403, 500) renvoient du JSON avec le format `{"success": false, "message": "..."}` pour faciliter la vie des développeurs React/Vue ?

Modifiez la configuration de l'application dans `bootstrap/app.php` (Laravel 11+) :

```php
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;

return Application::configure(basePath: dirname(__DIR__))
    // ... middleware ...
    ->withExceptions(function (Exceptions $exceptions) {

        // Formater les 404 (Not Found)
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ressource introuvable.',
                ], 404);
            }
        });

        // Formater les 401 (Problème de Token/Authentification)
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Non authentifié. Veuillez vous connecter.',
                ], 401);
            }
        });

        // Formater les 422 (Validation) de TOUTE l'application API
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*') || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'La validation a échoué.',
                    'errors' => $e->errors(),
                ], 422);
            }
        });
    })
    ->create();
```

## Structure de Réponse API Uniforme (Trait)

Pour que votre API ne renvoie pas des "formes" de JSON différentes selon le développeur qui code, créez un petit outil central (`Trait`) que tous vos Contrôleurs utiliseront :

```php
// app/Traits/ApiResponses.php
<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponses
{
    protected function success($data = null, string $message = 'Succès', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function created($data = null, string $message = 'Créé avec succès !'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    protected function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    protected function error(string $message, int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    protected function notFound(string $message = 'Ressource introuvable'): JsonResponse
    {
        return $this->error($message, 404);
    }

    protected function unauthorized(string $message = 'Non autorisé'): JsonResponse
    {
        return $this->error($message, 401);
    }

    protected function forbidden(string $message = 'Interdit (Droits Insuffisants)'): JsonResponse
    {
        return $this->error($message, 403);
    }
}
```

### Utilisation Radieuse dans le Contrôleur :

```php
class PostController extends Controller
{
    use ApiResponses;

    public function index()
    {
        $posts = Post::paginate(15);
        // Le Résultat sera TOUJOURS : {"success": true, "message": "Succès", "data": {...}}
        return $this->success(PostResource::collection($posts));
    }

    public function store(StorePostRequest $request)
    {
        $post = Post::create($request->validated());
        return $this->created(new PostResource($post));
    }

    public function show(Post $post)
    {
        return $this->success(new PostResource($post));
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return $this->noContent(); // Simple code 204
    }
}
```

## "Try-Catch" pour les Opérations à Haut Risque

Quand vous concevez des API de facturation ou de création de gros objets complexes, utilisez toujours les **Transactions SQL** enveloppées d'un Try Catch :

```php
public function store(StorePostRequest $request): JsonResponse
{
    try {
        // DB::transaction gèle la base de données.
        // Si QUOI QUE CE SOIT plante ici, rien n'est sauvegardé. L'état d'avant est restauré.
        $post = DB::transaction(function () use ($request) {
            $post = Post::create($request->validated());
            $post->tags()->attach($request->tags);

            return $post;
        });

        return $this->created(new PostResource($post->load('tags')));

    } catch (\Exception $e) {

        // 1. On cache l'erreur moche SQL dans nos propres logs pour pouvoir la corriger demain
        Log::error('Échec de la création du Post', [
            'error' => $e->getMessage(),
            'user' => auth()->id(),
        ]);

        // 2. On renvoie au client un beau message courtois sans crasher son application React !
        return $this->error('Échec de la création de l\'article. Veuillez réessayer.', 500);
    }
}
```

## Ressources

- [Validation](https://laravel.com/docs/12.x/validation) — Documentation officielle sur la Validation Laravel

---

> 📘 _Cette leçon fait partie du cours [Développement d'API Laravel](/laravel/laravel-api-development/) sur la plateforme d'apprentissage RostoDev._
