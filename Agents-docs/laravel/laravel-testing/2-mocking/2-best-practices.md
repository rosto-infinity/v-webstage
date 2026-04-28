---
source_course: "laravel-testing"
source_lesson: "laravel-testing-testing-best-practices"
---

# Bonnes Pratiques de Test (Testing Best Practices)

Écrivez des tests maintenables et fiables qui vous donnent une confiance absolue dans votre code, sans devenir un fardeau à maintenir.

## Le Modèle AAA : Arrange, Act, Assert

Structurez visuellement TOUTES vos méthodes de test en 3 paragraphes séparés par des sauts de ligne :

```php
public function test_un_utilisateur_peut_publier_un_article(): void
{
    // Arrange (Préparer) - Mettre en place le décor du test
    $user = User::factory()->create();
    $post = Post::factory()->draft()->create(['user_id' => $user->id]);

    // Act (Agir) - Lancer l'action unique à tester
    $response = $this->actingAs($user)
        ->post("/posts/{$post->id}/publish");

    // Assert (Vérifier) - Constater les résultats
    $response->assertRedirect();
    $this->assertNotNull($post->fresh()->published_at);
}
```

## Une Seule Assertion par Test (Quand c'est possible)

Un test qui vérifie 15 trucs différents est illisible et, s'il plante, on ne sait pas quelle fonctionnalité a vraiment cassé.

```php
// ❌ Trop d'assertions sans rapport direct  (Mauvais)
public function test_creation_d_article(): void
{
    $response = $this->actingAs($this->user)
        ->post('/posts', $this->donneesValides());

    $response->assertRedirect(); // Assert 1
    $this->assertDatabaseCount('posts', 1); // Assert 2
    $this->assertTrue($this->user->posts()->exists()); // Assert 3
    Mail::assertSent(PostCreatedNotification::class); // Assert 4
    Event::assertDispatched(PostCreated::class); // Assert 5
}

// ✅ Tests concentrés (Bon)
public function test_une_creation_reussie_redirige_vers_la_liste(): void
{
    $response = $this->actingAs($this->user)
        ->post('/posts', $this->donneesValides());

    $response->assertRedirect('/posts');
}

public function test_l_article_est_bien_enregistre_dans_la_bdd(): void
{
    $this->actingAs($this->user)
        ->post('/posts', $this->donneesValides());

    $this->assertDatabaseHas('posts', [
        'title' => 'Article de Test',
        'user_id' => $this->user->id,
    ]);
}

public function test_une_notification_est_envoyee_a_la_creation(): void
{
    Mail::fake();

    $this->actingAs($this->user)
        ->post('/posts', $this->donneesValides());

    Mail::assertSent(PostCreatedNotification::class);
}
```

## Pensez aux Noms Descriptifs (Très descriptifs !)

Le nom d'un test doit se lire comme une phrase française décrivant une règle métier.

```php
// ❌ Noms vagues à bannir
public function test_post(): void
public function test_validation(): void
public function test_ca_marche(): void

// ✅ Noms hyper descriptifs (Oubliez la limite de longueur !)
public function test_les_utilisateurs_authentifies_peuvent_creer_des_articles(): void
public function test_le_titre_de_l_article_est_obligatoire(): void
public function test_les_invites_sont_rediriges_vers_la_connexion_lors_d_une_creation(): void

// Avec Pest - Encore plus lisible car c'est littéralement du texte :
test('les utilisateurs authentifies peuvent creer des articles', function () { });
test('le titre de l article est obligatoire', function () { });
test('les invites sont rediriges vers la connexion', function () { });
```

## Utilisez les Fournisseurs de Données (Data Providers) pour le Répétitif

Ne faites pas 10 fonctions de tests presque identiques juste pour valider 10 champs de formulaire !

```php
/**
 * L'annotation @dataProvider connecte le test à la fonction en dessous
 * @dataProvider champsInvalidesPourArticle
 */
public function test_validation_creation_article(string $champ, mixed $valeur, string $erreurAttendu): void
{
    $data = $this->donneesValides();
    $data[$champ] = $valeur; // On injecte la panne

    $response = $this->actingAs($this->user)
        ->post('/posts', $data);

    // On vérifie que le champ précis a bien généré l'erreur précise
    $response->assertSessionHasErrors([$champ => $erreurAttendu]);
}

// Fournit un tableau de cas de tests qui seront joués un par un par la fonction du dessus
public static function champsInvalidesPourArticle(): array
{
    return [
        'titre obligatoire' => ['title', '', 'Le champ titre est requis.'],
        'titre trop long' => ['title', str_repeat('a', 256), 'Le titre ne doit pas dépasser 255 caractères.'],
        'corps obligatoire' => ['body', '', 'Le champ contenu est requis.'],
        'catégorie doit exister' => ['category_id', 999, 'La catégorie sélectionnée est invalide.'],
    ];
}
```

Avec Pest (Nativement sublime) :

```php
it('valide les donnees d un article', function (string $champ, mixed $valeur, string $erreur) {
    $data = donneesValides();
    $data[$champ] = $valeur;

    $this->actingAs($this->user)
        ->post('/posts', $data)
        ->assertSessionHasErrors([$champ => $erreur]);

})->with([ // Le Tableur de données est intégré !
    'titre requis' => ['title', '', 'Le champ titre est requis.'],
    'titre trop long' => ['title', str_repeat('a', 256), 'max 255 caractères allowed'],
]);
```

## Préparez des Données Communes (Helper Methods)

Évitez de recréer les mêmes gros tableaux de données dans chaque fonction.

```php
class PostTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->category = Category::factory()->create();
    }

    // Un générateur de tableau parfait par défaut, mais qu'on peut ajuster !
    protected function donneesValides(array $surcharges = []): array
    {
        return array_merge([
            'title' => 'Article de Test',
            'body' => 'Contenu du corps...',
            'category_id' => $this->category->id,
        ], $surcharges);
    }

    public function test_exemple(): void
    {
        $response = $this->actingAs($this->user)
            // Je veux le tableau parfait, mais je force juste le titre !
            ->post('/posts', $this->donneesValides(['title' => 'Titre Modifié']));

        $response->assertRedirect();
    }
}
```

## Testez les Cas Extrêmes (Edge Cases)

Les cas que personne n'imagine mais qui feront planter le serveur.

```php
public function test_gere_l_affichage_quand_il_n_y_a_aucun_article(): void
{
    // On ne crée AUCUN article
    $response = $this->get('/posts');

    $response->assertOk();
    $response->assertSee('Aucun article trouvé'); // S'assure que le message de secours "empty state" est là
}

public function test_gere_du_contenu_gigantesque(): void
{
    $post = Post::factory()->create([
        'body' => str_repeat('a', 100000), // 100 000 lettres
    ]);

    $response = $this->get("/posts/{$post->id}");

    $response->assertOk(); // Ça crash pas, c'est bon.
}

public function test_gere_la_securite_xss_dans_le_titre(): void
{
    $post = Post::factory()->create([
        'title' => 'Test <script>alert("XSS")</script> & "quotes"',
    ]);

    $response = $this->get('/posts');

    // Vérifie que le code a bien été neutralisé par l'échappement {{ }} de Blade
    $response->assertSee(e($post->title), false);
    $response->assertDontSee('<script>');
}
```

## Ne Testez PAS le Code de Laravel

Vous ne devez tester que VOS règles métier. Pas le fonctionnement d'un composant Laravel. (Taylor Otwell l'a déjà fait).

```php
// ❌ INUTILE : Ne testez pas si la validation "email" native de Laravel reconnait un "vrai" email.
public function test_validation_email_laravel_fonctionne(): void
{
    // Laravel a des centaines de tests pour son validateur d'email, c'est du temps perdu.
}

// ✅ VITAL : Testez que VOUS avez bien PENSÉ à obliger l'utilisation de l'email !
public function test_un_email_est_requis_pour_l_inscription(): void
{
    $response = $this->post('/register', ['email' => '']);
    $response->assertSessionHasErrors('email');
}
```

## Gardez les Tests Rapides (Fast tests)

Si vos tests prennent 10 minutes, vous arrêterez de les lancer.

```php
// ❌ LENT : Crée 100 utilisateurs pour tester une pagination de 15 éléments
public function test_la_liste_affiche_une_pagination(): void
{
    User::factory()->count(100)->create();
    // ...
}

// ✅ RAPIDE : Créez juste le strict nécessaire
public function test_la_liste_affiche_une_pagination(): void
{
    // Il suffit d'être à N+1 pour que la page 2 apparaisse !
    User::factory()->count(16)->create();
    // ...
}
```

## Ressources

- [Bonnes Pratiques de Test](https://laravel.com/docs/12.x/testing) — Documentation officielle des tests.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise des Tests Laravel](/laravel/laravel-testing/) sur la plateforme d'apprentissage RostoDev._
