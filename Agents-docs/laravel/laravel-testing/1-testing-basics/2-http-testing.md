---
source_course: "laravel-testing"
source_lesson: "laravel-testing-http-testing"
---

# Tests HTTP et Fonctionnels (HTTP and Feature Testing)

Les tests fonctionnels (Feature tests) vous permettent de tester votre application en simulant de véritables requêtes HTTP vers vos routes, et en vérifiant (assert) les réponses (Le HTML retourné, le JSON, les redirections...). Ils testent comment les multiples composants (Route -> Contrôleur -> Modèle -> Vue) fonctionnent ensemble.

## Effectuer des Requêtes HTTP

C'est extrêmement simple grâce aux méthodes magiques de Laravel :

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;

class PostTest extends TestCase
{
    public function test_les_utilisateurs_peuvent_voir_les_articles(): void
    {
        // On visite virtuellement l'URL /posts (Méthode GET)
        $response = $this->get('/posts');

        // On vérifie que le serveur a répondu par un grand "Oui" (Code HTTP 200)
        $response->assertStatus(200);
    }

    public function test_les_utilisateurs_peuvent_creer_des_articles(): void
    {
        // On simule la soumission globale d'un formulaire (Méthode POST)
        $response = $this->post('/posts', [
            'title' => 'Article de Test',
            'body' => 'Voici le corps de mon article de test.',
        ]);

        // On vérifie que la ressource a bien été créée (Code HTTP 201)
        // (Ou 302 si c'était une soumission classique avec redirection automatique)
        $response->assertStatus(201);
    }
}
```

## Toutes les Méthodes HTTP (Verbes)

```php
$this->get('/posts'); // Lire
$this->post('/posts', $data); // Créer
$this->put('/posts/1', $data); // Mettre à jour (Remplacer)
$this->patch('/posts/1', $data); // Mettre à jour (Partiellement)
$this->delete('/posts/1'); // Supprimer

// Simuler des En-têtes spécifiques (Headers)
$this->withHeaders([
    'X-Custom-Header' => 'ValeurPersonnalisee',
])->get('/api/posts');

// Spécial JSON (Ajoute automatiquement "Accept: application/json" en fond)
$this->getJson('/api/posts');
$this->postJson('/api/posts', $data);
$this->putJson('/api/posts/1', $data);
$this->deleteJson('/api/posts/1');
```

## Les Assertions de Réponse (Vérifications)

Une fois que vous avez le `$response`, voici ce que vous pouvez lui demander :

### Codes de Statut (Status Codes)

```php
$response->assertStatus(200);    // Doit être 200 peu importe le reste
$response->assertOk();           // Raccourci explicite pour 200 (OK)
$response->assertCreated();      // Raccourci pour 201 (Créé avec succès)
$response->assertNoContent();    // Raccourci pour 204 (Vide)
$response->assertNotFound();     // Raccourci pour 404 (Introuvable)
$response->assertForbidden();    // Raccourci pour 403 (Interdit / Droits insuffisants)
$response->assertUnauthorized(); // Raccourci pour 401 (Non identifié / Pas de login)
$response->assertUnprocessable(); // Raccourci pour 422 (Erreur de Validation)
```

### Contenu de la Réponse (HTML ou Vues)

```php
// --- Assertions sur les Vues (Blade) ---
$response->assertViewIs('posts.index'); // Est-ce qu'on est bien sur la bonne vue Blade ?
$response->assertViewHas('posts'); // Est-ce que la vue a bien reçu la variable $posts ?
$response->assertViewHas('posts', $expectedPosts); // A-t-elle reçu EXACTEMENT cette liste d'articles ?

// --- Assertions sur le Texte rendu (Le HTML visible final) ---
$response->assertSee('Bienvenue'); // Voit-on le mot Bienvenue sur la page ?
$response->assertDontSee('Erreur Critique'); // On ne DOIT PAS voir ce message !
$response->assertSeeText('Bienvenue'); // Cherche le texte sans tenir compte des balises HTML parasites (<span>)
```

### Contenu de la Réponse (JSON API)

```php
// Cherche n'importe où dans le JSON ce p'tit bout-là (S'il y en a d'autres, pas grave)
$response->assertJson([
    'id' => 1,
    'title' => 'Article de Test',
]);

// Vérifier une clé précise
$response->assertJsonPath('data.0.title', 'Premier Article');

// Vérifier la longueur d'un tableau
$response->assertJsonCount(3, 'data'); // data héberge 3 éléments

// Vérifier le Gabarit global (Structure) du JSON, peu importe ses données exactes
$response->assertJsonStructure([
    'data' => [
        '*' => ['id', 'title', 'body'], // Chaque étoile (*) correspond à un élément de la boucle
    ],
    'meta' => ['total', 'per_page'],
]);

$response->assertExactJson([...]);  // Doit être LA COPIE CONFORME (Aucun champ en plus)
$response->assertJsonMissing(['secret_field']); // On est sûr que le mot de passe n'a pas fuité !
```

### Redirections (Redirects)

Très utile quand on teste de la soumission de formulaires côté Web :

```php
$response->assertRedirect('/dashboard'); // Vérifie la redirection absolue vers /dashboard
$response->assertRedirectToRoute('dashboard'); // Vérifie la redirection grâce au NOM de la route
```

## Tester avec de l'Authentification (Agir en tant que : actingAs)

Imaginons une route bloquée par le middleware `auth`. L'astuce magique est la méthode `actingAs` qui vous connecte temporairement avant d'attaquer la route.

```php
use App\Models\User;

public function test_les_membres_peuvent_creer_des_articles(): void
{
    // 1. On donne naissance à un vrai Faux Utilisateur dans la DB de test
    $user = User::factory()->create();

    // 2. On Agit EN TANT QUE (actingAs) lui
    $response = $this->actingAs($user)
        ->post('/posts', [
            'title' => 'Article Super cool',
            'body' => 'Le texte de mon article...',
        ]);

    $response->assertRedirect('/posts'); // On espère être jeté gentiment vers la liste
}

public function test_les_visiteurs_sont_rejetes(): void
{
    // On ne fait PAS le actingAs, le système croit donc qu'on est un inconnu sur internet
    $response = $this->post('/posts', [
        'title' => 'Article de Hackeur',
    ]);

    // Allez, dégage sur la page de connexion, mon gars !
    $response->assertRedirect('/login');
}

// Spécial API (Jetons Sanctum)
public function test_api_authentication(): void
{
    $user = User::factory()->create();

    // On s'authentifie pour l'API en précisant la mécanique 'sanctum'
    $response = $this->actingAs($user, 'sanctum')
        ->getJson('/api/user');

    $response->assertOk();
    $response->assertJson(['id' => $user->id]);
}
```

## Test de la Session et des Flash Data (Erreurs de formulaires)

```php
// "Injecter" une valeur dans la session AVANT d'attraper la route (Plus rare)
$this->withSession(['cle' => 'valeur'])
    ->get('/dashboard');

// --- LE VRAI USAGE COURANT : Les erreurs de validation de formulaire ---
$response->assertSessionHas('status', 'success'); // Notre fameux retour flash('status', 'success')
$response->assertSessionHasErrors(['email', 'password']); // Y-a-t-il bien une erreur sur l'email ET le mot de passe ?
$response->assertSessionHasErrors(['email' => 'L\'email est invalide']); // Le message est-il EXACTEMENT celui-là ?
$response->assertSessionDoesntHaveErrors(); // Parfait, la requête est passée sans aucune bosse !
```

## Tester les Uploads de Fichiers (File Uploads)

Le problème en testant des Uploads de fichiers, c'est que ça remplit vraiment votre vrai disque dur (S3, public/storage...).
Laravel fournit le faux-disque miracle (`Storage::fake()`) !

```php
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

public function test_les_utilisateurs_peuvent_uploader_un_avatar(): void
{
    // 1. Laravel coupe la connexion avec le VRAI disque 'avatars' et le remplace par un Disque Fictif (Fake) éphémère
    Storage::fake('avatars');

    // 2. Génère une fausse image (Même pas pesant !)
    $file = UploadedFile::fake()->image('mon_super_avatar.jpg');

    $response = $this->actingAs($this->user)
        ->post('/avatar', [
            'avatar' => $file, // On injecte le fichier dans le formulaire
        ]);

    $response->assertOk();

    // 3. LA PREUVE IRRÉFUTABLE : L'image a atterri sur le "Disque Fictif".
    // Magie : Ce disque sera nettoyé juste après la fin du test.
    Storage::disk('avatars')->assertExists($file->hashName());
}

public function test_seules_les_images_sont_acceptees(): void
{
    Storage::fake('avatars');

    // Tiens, on lui donne un document PDF de 100ko à la place !
    $file = UploadedFile::fake()->create('hacked.pdf', 100);

    $response = $this->actingAs($this->user)
        ->post('/avatar', ['avatar' => $file]);

    // Bing ! Le validateur du contrôleur ('avatar' => 'image|mimes:jpeg,png') devait lever une erreur. Le test vérifie s'il l'a bien fait.
    $response->assertSessionHasErrors(['avatar']);
}
```

## Un Exemple Complet et Réaliste

Observez comment 4 méthodes arrivent à verrouiller l'intégralité d'un contrôleur.

```php
<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostTest extends TestCase
{
    // NETTOYAGE EXTRÊME DE LA BDD (Généralement en SQLite en mémoire)
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        // Créer un utilisateur humain lambda ("Moi" pour la suite des tests)
        $this->user = User::factory()->create();
    }

    public function test_les_visiteurs_peuvent_voir_les_articles(): void
    {
        // On crée un faux article vite fait
        Post::factory()->create(['title' => 'Article Public']);

        $response = $this->get('/posts');

        $response->assertOk();
        $response->assertSee('Article Public');
    }

    public function test_les_membres_peuvent_creer_des_articles(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/posts', [
                'title' => 'Nouvel Article',
                'body' => 'Corps du post...',
            ]);

        $response->assertRedirect('/posts'); // Normalement ça redirige

        // Vérification blindée : La BDD contient-elle VRAIMENT l'article ?
        $this->assertDatabaseHas('posts', [
            'title' => 'Nouvel Article',
            'user_id' => $this->user->id, // Il m'appartient bien.
        ]);
    }

    public function test_le_titre_est_obligatoire_pour_creer_un_article(): void
    {
        $response = $this->actingAs($this->user)
            ->post('/posts', [
                // Oops, y'a pas de titre !
                'body' => 'Corps du post sans le titre vital...',
            ]);

        // La sécurité Laravel (FormRequest/Validator) a bien fonctionné !
        $response->assertSessionHasErrors(['title']);
    }

    public function test_un_utilisateur_ne_peut_pas_modifier_un_article_qui_ne_lui_appartient_pas(): void
    {
        // Cet article est créé "à blanc". En coulisses, la Factory va créer un AUTRE User $post->user pour remplir la clé étrangère.
        $post = Post::factory()->create();

        // Or là, j'agis en tant que "MOI" ($this->user), qui N'EST PAS l'autre User de la Factory.
        $response = $this->actingAs($this->user)
            ->put("/posts/{$post->id}", [
                'title' => 'Titre Volé',
            ]);

        // BOOM ! Les Policies de Sécurité de Laravel ont bien interdit le passage ! (403)
        $response->assertForbidden();
    }
}
```

## Ressources

- [Tests HTTP (HTTP Tests)](https://laravel.com/docs/12.x/http-tests) — Documentation officielle du module.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise des Tests Laravel](/laravel/laravel-testing/) sur la plateforme d'apprentissage RostoDev._
