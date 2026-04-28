---
source_course: "laravel-api-development"
source_lesson: "laravel-api-development-api-documentation"
---

# Générer la Documentation d'API (API Documentation)

Une bonne documentation d'API est LA condition sine qua non pour que d'autres développeurs (ou vos collègues du Front-end) veuillent bien utiliser votre API sans crise nerveuse. Apprenons à la générer automatiquement.

## Options de Documentation

| Outil                    | Type         | Avantages                                                    |
| ------------------------ | ------------ | ------------------------------------------------------------ |
| **Scribe** (Le Meilleur) | Auto-générée | Analyse votre code Laravel, génère du HTML et du OpenAPI     |
| **L5-Swagger**           | Auto/Manuel  | Le standard de l'industrie (Swagger), mais un peu plus lourd |
| **Postman Collections**  | Manuel       | Parfait pour tester interactivement, exportable facilement   |

## Utiliser Scribe (Recommandé pour Laravel)

Scribe est de loin le générateur de documentation API le plus populaire et le plus "magique" dans l'écosystème Laravel :

```bash
# Installation en dépendance de développement (--dev)
composer require --dev knuckleswtf/scribe

# Publier le fichier de configuration
php artisan vendor:publish --tag=scribe-config
```

### Configuration Initiale

Modifiez `config/scribe.php` selon vos besoins :

```php
return [
    'title' => 'Documentation de mon API',
    'description' => 'API RESTful pour la gestion du Blog',
    'base_url' => env('APP_URL'),

    'routes' => [
        [
            'match' => [
                'prefixes' => ['api/*'], // Ne documente QUE ce qui commence par /api
                'domains' => ['*'],
            ],
            'include' => [],
            'exclude' => [],
        ],
    ],

    'auth' => [
        'enabled' => true,
        'default' => true,
        'in' => 'bearer', // Précise que l'API utilise des Bearer Tokens (Sanctum)
        'name' => 'Authorization',
        'use_value' => 'Bearer {token}',
        'placeholder' => '{token}',
    ],
];
```

### Documenter un Endpoint (Point d'accès)

Toute la magie réside dans les blocs de commentaires PHP (`DocBlocks`) au-dessus de vos contrôleurs et de vos méthodes. Scribe les lit comme un livre ouvert !

```php
/**
 * @group Articles (Posts)
 *
 * Points d'accès pour gérer les articles du blog.
 */
class PostController extends Controller
{
    /**
     * Lister les articles
     *
     * Obtenir une liste paginée de tous les articles publiés.
     *
     * @queryParam page integer Le numéro de la page. Example: 1
     * @queryParam per_page integer Le nombre de résultats par page. Example: 15
     * @queryParam status string Filtrer par statut. Example: published
     *
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "title": "Mon Premier Article",
     *       "body": "Le contenu ici...",
     *       "created_at": "2024-01-15T10:30:00Z"
     *     }
     *   ],
     *   "meta": {
     *     "current_page": 1,
     *     "total": 50
     *   }
     * }
     */
    public function index(Request $request)
    {
        return PostResource::collection(
            Post::paginate($request->per_page ?? 15)
        );
    }

    /**
     * Créer un article
     *
     * Créer un tout nouvel article de blog, lié à l'utilisateur connecté.
     *
     * @authenticated
     *
     * @bodyParam title string required Le titre de l'article. Example: Mon Nouvel Article
     * @bodyParam body string required Le contenu de l'article. Example: Ceci est le début de mon texte...
     * @bodyParam category_id integer L'ID de la catégorie. Example: 1
     * @bodyParam tags array Liste des IDs des tags. Example: [1, 2, 3]
     *
     * @response 201 {
     *   "data": {
     *     "id": 1,
     *     "title": "Mon Nouvel Article",
     *     "body": "Ceci est le début de mon texte..."
     *   }
     * }
     *
     * @response 422 {
     *   "message": "Le champ titre est requis.",
     *   "errors": {
     *     "title": ["Le champ titre est requis."]
     *   }
     * }
     */
    public function store(StorePostRequest $request) // Magie : Scribe lit même le FormRequest !
    {
        $post = Post::create($request->validated());
        return new PostResource($post);
    }

    /**
     * Afficher un article
     *
     * Récupérer les détails d'un article unique grâce à son ID.
     *
     * @urlParam id integer required L'ID de l'article. Example: 1
     *
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "title": "Mon Premier Article",
     *     "body": "Le contenu ici..."
     *   }
     * }
     *
     * @response 404 {
     *   "message": "Article introuvable"
     * }
     */
    public function show(Post $post) // Magie : Scribe lit le paramètre d'URL $post !
    {
        return new PostResource($post);
    }
}
```

### Lancer la Génération de la Documentation

Une fois vos commentaires rédigés, tapez cette ligne magique :

```bash
php artisan scribe:generate
```

Scribe va mouliner votre code, simuler des requêtes (si vous utilisez le tag astucieux `@responseField`), et générer deux choses incroyables :

- `public/docs/index.html` - Une documentation HTML **complète et interactive** (style Stripe) où les développeurs peuvent tester l'API directement !
- `public/docs/openapi.yaml` - Le fichier standard OpenAPI.

### Les Balises de Réponse (Le secret pro)

Plutôt que d'écrire tout le JSON à la main, précisez juste des scénarios classiques !

```php
/**
 * @response 200 scenario="Succès" {"data": {"id": 1}}
 * @response 401 scenario="Non authentifié" {"message": "Unauthenticated"}
 * @response 403 scenario="Interdit (Forbidden)" {"message": "Cette action n'est pas autorisée."}
 * @response 404 scenario="Introuvable" {"message": "Ressource introuvable"}
 * @response 422 scenario="Erreur de Validation" {"message": "...", "errors": {}}
 */
```

## Norme OpenAPI (Anciennement Swagger)

Même si vous utilisez Scribe, il génère le fichier `openapi.yaml`. C'est le Graal de l'API. Vous pouvez l'importer dans 1000 outils (Swagger UI, Redocly, générateurs de SDK...).

Il ressemble à ça :

```yaml
# public/docs/openapi.yaml
openapi: 3.0.3
info:
  title: "Documentation de mon API"
  version: "1.0.0"
paths:
  /api/posts:
    get:
      summary: "Lister les articles"
      parameters:
        - name: page
          in: query
          schema:
            type: integer
      responses:
        "200":
          description: "Succès"
```

## Exporter vers Postman

Parce que l'équipe Front-end va forcément vous le demander :

```bash
php artisan scribe:generate --postman
```

Hop, un fichier `public/docs/collection.json` est prêt à être glissé-déposé (importé) directement dans le logiciel Postman de vos collègues !

## Conclusion sur les Bonnes Pratiques

Mettez le mot "@group" et "@authenticated" méthodiquement sur vos Classes et contrôleurs :

```php
/**
 * @group Sécurité & Authentification
 *
 * API pour la connexion, l'inscription et les mots de passe.
 */
class AuthController extends Controller
{
    /**
     * Se Connecter (Login)
     *
     * Authentifier un utilisateur et lui retourner un Jeton d'Accès (Token).
     *
     * @unauthenticated
     *
     * @bodyParam email string required L'email de l'utilisateur. Example: jean@test.fr
     * @bodyParam password string required Le mot de passe (min: 8 caractères). Example: secret123
     * @bodyParam device_name string required Le nom de l'appareil demandeur. Example: iPhone 15 Pro
     *
     * @response 200 { ... }
     * @response 422 { ... }
     */
    public function login(LoginRequest $request)
    {
        // ...
    }
}
```

## Ressources

- [Documentation de Scribe](https://scribe.knuckles.wtf/laravel) — La documentation sur comment faire de la documentation ! Exemples très complets inclus.

---

> 📘 _Cette leçon fait partie du cours [Développement d'API Laravel](/laravel/laravel-api-development/) sur la plateforme d'apprentissage RostoDev._
