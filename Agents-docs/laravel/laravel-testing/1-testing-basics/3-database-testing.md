---
source_course: "laravel-testing"
source_lesson: "laravel-testing-database-testing"
---

# Tests de Base de Données (Database Testing)

Laravel fournit des outils surpuissants pour tester vos interactions avec la base de données sans jamais polluer vos vraies données de développement, incluant les migrations, les factories et les seeders.

## Le Trait Magique `RefreshDatabase`

La règle d'or des tests : **Chaque test doit être indépendant.** La BDD doit être à l'état neuf au début de chaque test.

```php
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PostTest extends TestCase
{
    // C'est LUI ! Il vide et recrée tout.
    use RefreshDatabase;

    public function test_les_articles_peuvent_etre_crees(): void
    {
        // La BDD est toute propre ici pour ce test unique
    }
}
```

**Options de réinitialisation** :

- `RefreshDatabase` (Recommandé) : Exécute les migrations une seule fois au début, puis enveloppe tous les tests dans des _Transactions SQL_ qu'il annule à la fin. Ultra-rapide.
- `DatabaseMigrations` : Détruit et recrée (Drop & Re-run) toutes les migrations avant chaque test. Assez lent.
- `DatabaseTransactions` : Variante utile si votre BDD ne supporte pas bien certaines commandes de RefreshDatabase (rare aujourd'hui).

## Assertions de Base de Données

Prouver par a + b que les données existent bel et bien (ou pas) dans les tables.

```php
use App\Models\Post;

public function test_l_article_est_bien_enregistre_en_bdd(): void
{
    $user = User::factory()->create();

    $this->actingAs($user)->post('/posts', [
        'title' => 'Article de Test',
        'body' => 'Contenu génial',
    ]);

    // OUI ! La ligne existe dans la table 'posts'.
    $this->assertDatabaseHas('posts', [
        'title' => 'Article de Test',
        'user_id' => $user->id,
    ]);

    // NON ! Cette ligne n'existe pas.
    $this->assertDatabaseMissing('posts', [
        'title' => 'Article inexistant',
    ]);

    // Vérifier précisément le nombre total d'articles dans la table
    $this->assertDatabaseCount('posts', 1);

    // Vérifier qu'une table est parfaitement vide
    $this->assertDatabaseEmpty('comments');
}

public function test_suppression_douce_soft_deletes(): void
{
    $post = Post::factory()->create();
    $post->delete();

    // L'article est toujours en BDD, mais la colonne 'deleted_at' n'est plus nulle.
    $this->assertSoftDeleted('posts', ['id' => $post->id]);

    // Variante plus élégante directement avec l'instance du modèle
    $this->assertSoftDeleted($post);

    // "Il n'est PAS corbeillisé"
    $this->assertNotSoftDeleted('posts', ['id' => $post->id]);
}

public function test_le_modele_a_bien_disparu(): void
{
    // Idéal pour vérifier qu'une suppression physique a bien eu lieu
    $post = Post::factory()->create();
    $postId = $post->id;

    $this->actingAs($post->user)
        ->delete("/posts/{$postId}");

    // Variante élégante à assertDatabaseMissing
    $this->assertModelMissing($post);
}
```

## Model Factories (Usines à faux Modèles)

Les Factories sont des générateurs de fausses données (via la librairie Faker) indispensables pour tester efficacement.

```php
// Créer un utilisateur et le SAUVEGARDER en BDD (Insert)
$user = User::factory()->create();

// Créer une armée de 3 utilisateurs en BDD
$users = User::factory()->count(3)->create();

// Forcer des attributs précis sur certaines colonnes
$admin = User::factory()->create([
    'name' => 'Jean Admin',
    'is_admin' => true, // On force true au lieu de ce que Faker allait inventer
]);

// FABRIQUER un utilisateur en Mémoire, SANS le sauvegarder en BDD
$user = User::factory()->make();

// Création avancée en chaîne :
// Crée 1 Post qui appartient à un tout nouveau User,
// et on donne 3 Comments tout neufs à notre Post !
$post = Post::factory()
    ->for(User::factory(), 'author') // ->user_id
    ->has(Comment::factory()->count(3))
    ->create();
```

## Créer une Factory

```bash
php artisan make:factory PostFactory
```

```php
<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    protected $model = Post::class;

    public function definition(): array
    {
        return [
            // Crée automatiquement le User parent si on ne le précise pas à la main !
            'user_id' => User::factory(),
            // fake() utilise la géniale librairie FakerPHP
            'title' => fake()->sentence(),
            'slug' => fake()->slug(),
            'body' => fake()->paragraphs(3, true),
            'published_at' => fake()->optional()->dateTime(),
        ];
    }

    // --- Les ÉTATS de Factory (States) ---
    // Permet de définir des variations de votre Modèle pour les tests

    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => now(), // Force la date
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'published_at' => null, // Force le brouillon
        ]);
    }

    // État basé sur un paramètre dynamique
    public function byUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
```

Utilisation de l'usine :

```php
// Utiliser les États
$articleEnLigne = Post::factory()->published()->create();
$articleBrouillon = Post::factory()->draft()->create();

// Enchaîner frénétiquement les États !
$post = Post::factory()
    ->published()
    ->byUser($user) // Attribue le $user existant au lieu d'en créer un nouveau
    ->create();
```

## Les Relations Fluviales dans les Factories

Construire des arborescences de données complexes en une phrase :

```php
// Un User avec 3 Posts
$user = User::factory()
    ->has(Post::factory()->count(3))
    ->create();

// Raccourci magique fourni par Laravel ("has" + NomPlurielDuModele)
$user = User::factory()
    ->hasPosts(3)
    ->create();

// Avec des Posts personnalisés (Seulement des brouillons)
$user = User::factory()
    ->has(
        Post::factory()
            ->count(3)
            ->state(['published_at' => null])
    )
    ->create();

// Appartenance inversée (For)
$posts = Post::factory()
    ->count(3)
    ->for(User::factory()->state(['name' => 'Propriétaire de ces articles']))
    ->create();

// Relations Many-to-Many (Plusieurs-à-Plusieurs) avec Pivot
$post = Post::factory()
    ->hasAttached(
        Tag::factory()->count(3), // Attache 3 tags existants/neufs
        ['added_by_user_id' => $user->id]  // Données de la table pivot !
    )
    ->create();
```

## Les Seeders dans les Tests

Vous avez des tables de configurations de base (Rôles, Pays, Catégories) obligatoires pour que l'app fonctionne ?

```php
use Database\Seeders\CategorySeeder;

public function test_les_articles_peuvent_etre_tries_par_categorie(): void
{
    // Lancer juste le Seeder voulu
    $this->seed(CategorySeeder::class);

    // Ou lancer la totale (DatabaseSeeder run())
    $this->seed();

    // Maintenant on a la certitude d'avoir nos catégories dans la BDD vide
    $categories = Category::all();
    $this->assertGreaterThan(0, $categories->count());
}
```

## SQLite en Mémoire : L'accélérateur ultime

Pour passer de 1 minute à 2 secondes d'exécution pour 200 tests, on dit adieu au vrai MySQL et coucou au SQLite dans la Mémoire vive (RAM) de l'ordinateur !

```xml
<!-- Modifiez simplement votre phpunit.xml -->
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/>
```

## Tester la logique interne du Modèle (Les Événements Boot)

Si vous avez mis de la logique dans la fonction `boot()` ou `booted()` de vos modèles (Ex: Créer un Slug automatiquement quand un titre est défini).

```php
public function test_un_slug_st_cree_automatiquement_a_la_sauvegarde(): void
{
    // On lance la factory
    $post = Post::factory()->create(['title' => 'Mon Gros Article']);

    // Le Slug a-t-il été fait par l'Observer/Event Model de Laravel ?
    $this->assertEquals('mon-gros-article', $post->slug);
}

public function test_supprimer_user_supprime_ses_articles(): void
{
    // Cascadera-t-il ?
    $user = User::factory()->hasPosts(3)->create();
    $postIds = $user->posts->pluck('id');

    $user->delete();

    // Je vérifie chaque ID pour être sûr que tout a disparu
    $postIds->each(fn ($id) =>
        $this->assertDatabaseMissing('posts', ['id' => $id])
    );
}
```

## Ressources

- [Tests de Base de Données](https://laravel.com/docs/12.x/database-testing) — La documentation inépuisable.
- [Factories Eloquent](https://laravel.com/docs/12.x/eloquent-factories) — L'art de maîtriser ses Factories.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise des Tests Laravel](/laravel/laravel-testing/) sur la plateforme d'apprentissage RostoDev._
