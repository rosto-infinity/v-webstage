---
source_course: "laravel-api-development"
source_lesson: "laravel-api-development-api-testing-basics"
---

# Tester les Endpoints d'API (Testing API Endpoints)

Tester votre API de manière automatisée garantit qu'elle fonctionne correctement dès le premier jour, et surtout qu'elle continuera de fonctionner même après des mois de modifications (non-régression). Laravel fournit des outils PHPUnit magiques pour tester les API.

## Configurer les Tests d'API

Créez un fichier de test fonctionnel (Feature test) :

```bash
php artisan make:test Api/PostTest
```

Cela crée `tests/Feature/Api/PostTest.php` :

```php
<?php

namespace Tests\Feature\Api;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostTest extends TestCase
{
    // Vide et recrée la base de données SQLite en mémoire avant CHAQUE test
    use RefreshDatabase;

    protected User $user;

    // S'exécute avant chaque fonction de test (Pratique pour préparer le terrain)
    protected function setUp(): void
    {
        parent::setUp();
        // On crée un faux utilisateur de test
        $this->user = User::factory()->create();
    }
}
```

## Tester les Réponses JSON (JSON Responses)

### Requêtes GET (Lire)

```php
public function test_can_list_posts(): void
{
    // Fabriquer 3 faux articles en BDD
    $posts = Post::factory()->count(3)->create();

    // Simuler une requête HTTP GET
    $response = $this->getJson('/api/posts');

    // Les Assertions (Vérifications)
    $response->assertStatus(200) // Le code HTTP doit être 200 OK
        ->assertJsonCount(3, 'data') // Le tableau 'data' doit contenir 3 éléments
        ->assertJsonStructure([ // L'empreinte JSON doit correspondre exactement
            'data' => [
                '*' => ['id', 'title', 'body', 'created_at'], // * = pour chaque élément
            ],
        ]);
}

public function test_can_show_single_post(): void
{
    $post = Post::factory()->create();

    $response = $this->getJson("/api/posts/{$post->id}");

    $response->assertStatus(200)
        ->assertJson([ // assertJson cherche un "morceau" exact de JSON
            'data' => [
                'id' => $post->id,
                'title' => $post->title,
            ],
        ]);
}
```

### Requêtes POST (Créer)

```php
public function test_can_create_post(): void
{
    $data = [
        'title' => 'Article de Test',
        'body' => 'Ceci est le contenu du faux article.',
    ];

    // On agit "en tant que" (actingAs) l'utilisateur via Sanctum,
    // puis on poste le JSON.
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/posts', $data);

    // Vérifier la réponse de l'API (Retourne généralement l'objet créé)
    $response->assertStatus(201) // 201 = Created
        ->assertJson([
            'data' => [
                'title' => 'Article de Test',
            ],
        ]);

    // Vérifier QUE LA BASE DE DONNÉES CONTIENT BIEN LA LIGNE ! (Ultime certitude)
    $this->assertDatabaseHas('posts', [
        'title' => 'Article de Test',
        'user_id' => $this->user->id, // Vérifier qu'il m'appartient bien
    ]);
}
```

### Requêtes PUT/PATCH (Mettre à jour)

```php
public function test_can_update_post(): void
{
    // On crée un post lié à NOTRE utilisateur
    $post = Post::factory()->for($this->user)->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson("/api/posts/{$post->id}", [
            'title' => 'Titre mis à jour',
        ]);

    $response->assertStatus(200)
        ->assertJson([
            'data' => [
                'title' => 'Titre mis à jour',
            ],
        ]);

    // La base de données doit avoir été mutée
    $this->assertDatabaseHas('posts', [
        'id' => $post->id,
        'title' => 'Titre mis à jour',
    ]);
}
```

### Requêtes DELETE (Supprimer)

```php
public function test_can_delete_post(): void
{
    $post = Post::factory()->for($this->user)->create();

    $response = $this->actingAs($this->user, 'sanctum')
        ->deleteJson("/api/posts/{$post->id}");

    $response->assertStatus(204); // Typique pour une suppression réussie

    // Vérifier que la ligne a bien disparu !
    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
}
```

## Tester l'Authentification (Sécurité)

Protéger votre API c'est bien, mais si une mise à jour désactive accidentellement le middleware, c'est le drame. Un test vous protège contre ça.

```php
public function test_unauthenticated_user_cannot_create_post(): void
{
    // Zéro authentification ici ($this->actingAs(...) manque)
    $response = $this->postJson('/api/posts', [
        'title' => 'Test',
        'body' => 'Corps',
    ]);

    // Il DOIT se faire jeter
    $response->assertStatus(401);
}

public function test_user_cannot_update_others_post(): void
{
    $otherUser = User::factory()->create();
    // Le post appartient à l'AUTRE mec
    $post = Post::factory()->for($otherUser)->create();

    // J'essaie de le modifier avec MON compte
    $response = $this->actingAs($this->user, 'sanctum')
        ->putJson("/api/posts/{$post->id}", [
            'title' => 'Hacked!',
        ]);

    // Accès refusé par les Policies !
    $response->assertStatus(403);
}
```

## Tester la Validation

```php
public function test_post_creation_requires_title(): void
{
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/posts', [
            'body' => 'Corps sans titre',
        ]);

    // Le contrôleur a refusé l'action
    $response->assertStatus(422) // Unprocessable Entity
        // Et a bien spécifié que c'est le champ "title" qui pose problème
        ->assertJsonValidationErrors(['title']);
}

public function test_post_title_must_be_string(): void
{
    $response = $this->actingAs($this->user, 'sanctum')
        ->postJson('/api/posts', [
            'title' => 12345, // Un nombre au lieu d'une chaîne
            'body' => 'Contenu',
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['title']);
}
```

## Tester les Jetons Sanctum avec leurs Pouvoirs (Abilities)

```php
public function test_can_authenticate_with_token(): void
{
    // Génère manuellement un jeton dans la BDD pour ce test
    $token = $this->user->createToken('test-token')->plainTextToken;

    // Envoi explicite de l'en-tête (Pas de raccourci "actingAs")
    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/user');

    $response->assertStatus(200)
        ->assertJson([
            'id' => $this->user->id,
            'email' => $this->user->email,
        ]);
}

public function test_token_with_limited_abilities(): void
{
    // Ce token n'a le droit QUE de lire
    $token = $this->user->createToken('read-only', ['posts:read'])->plainTextToken;

    // Lire fonctionne (200 OK)
    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->getJson('/api/posts');
    $response->assertStatus(200);

    // Créer plante ! (403 Forbidden)
    $response = $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/posts', ['title' => 'Test', 'body' => 'Body']);
    $response->assertStatus(403);
}
```

## Méthodes d'Assertion JSON (Aide-mémoire)

```php
// Vérifier que le JSON correspond EXACTEMENT à ce tableau (aucun champ supplémentaire autorisé)
$response->assertExactJson(['key' => 'value']);

// Vérifier que le JSON CONTIENT ce fragment (il peut y avoir plein d'autres choses autour)
$response->assertJson(['key' => 'value']);

// Vérifier que le SQUELETTE de clés existe (Peu importe la valeur)
$response->assertJsonStructure([
    'data' => ['id', 'title'],
    'meta' => ['current_page', 'total'],
]);

// Vérifier la valeur exacte d'un point précis dans l'arborescence
$response->assertJsonPath('data.0.title', 'Titre Attendu');

// Vérifier le nombre d'éléments dans un tableau
$response->assertJsonCount(5, 'data');

// Vérifier que l'API renvoie bien des erreurs de validation sur ces champs
$response->assertJsonValidationErrors(['title', 'category_id']);

// Vérifier qu'il N'y a PAS d'erreur sur ce champ
$response->assertJsonMissingValidationErrors(['body']);
```

## Ressources

- [Tests HTTP (HTTP Tests)](https://laravel.com/docs/12.x/http-tests) — Documentation officielle sur les tests HTTP.

---

> 📘 _Cette leçon fait partie du cours [Développement d'API Laravel](/laravel/laravel-api-development/) sur la plateforme d'apprentissage RostoDev._
