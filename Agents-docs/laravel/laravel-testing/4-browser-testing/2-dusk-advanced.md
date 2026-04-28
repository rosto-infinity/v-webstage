---
source_course: "laravel-testing"
source_lesson: "laravel-testing-dusk-advanced"
---

# Techniques Avancées avec Dusk (Advanced Dusk Techniques)

Maîtrisez les design patterns (modèles de conception) avancés pour les tests navigateur afin de gérer des interactions complexes et des applications très riches en JavaScript.

## Objets de Page (Page Objects)

Les _Page Objects_ encapsulent toute la logique spécifique à une page web donnée dans une seule classe propre. Cela évite de répéter les mêmes sélecteurs moches dans 50 tests différents.

```bash
php artisan dusk:page LoginPage
```

```php
// tests/Browser/Pages/LoginPage.php
<?php

namespace Tests\Browser\Pages;

use Laravel\Dusk\Browser;
use Laravel\Dusk\Page;

class LoginPage extends Page
{
    // L'URL magique de cette page
    public function url(): string
    {
        return '/login';
    }

    // Ce qui prouve irréfutablement au navigateur qu'on est sur la BONNE page
    public function assert(Browser $browser): void
    {
        $browser->assertPathIs($this->url())
                ->assertSee('Se Connecter');
    }

    // Le dictionnaire de la page : On donne un joli surnom (@nom) à des sélecteurs complexes
    public function elements(): array
    {
        return [
            '@email' => 'input[name="email"]',
            '@password' => 'input[name="password"]',
            '@submit' => 'button[type="submit"]',
            '@error' => '.text-red-600',
        ];
    }

    // Des macros/raccourcis d'actions super pratiques !
    public function login(Browser $browser, string $email, string $password): void
    {
        $browser->type('@email', $email)
                ->type('@password', $password)
                ->click('@submit');
    }

    public function assertHasError(Browser $browser, string $message): void
    {
        $browser->assertSeeIn('@error', $message);
    }
}
```

**Utilisation du Page Object dans vos Tests :**

Observez comment les tests deviennent instantanément fluides à lire !

```php
public function test_un_utilisateur_peut_se_connecter(): void
{
    $user = User::factory()->create(['password' => bcrypt('password123')]);

    $this->browse(function (Browser $browser) use ($user) {
        $browser->visit(new LoginPage) // Ouvre l'URL et fait l'assert() auto !
                ->login($user->email, 'password123') // Utilise notre raccourci
                ->assertPathIs('/dashboard');
    });
}

public function test_affiche_une_erreur_pour_des_identifiants_invalides(): void
{
    $this->browse(function (Browser $browser) {
        $browser->visit(new LoginPage)
                ->login('faux@exemple.com', 'faux_mot_de_passe')
                ->on(new LoginPage)  // On stipule qu'on doit TOUJOURS être sur la page de co
                ->assertHasError('Ces identifiants ne correspondent pas');
    });
}
```

## Composants (Components)

Identique aux Page Objects, mais pour un tout petit bout d'interface réutilisable PARTOUT (ex: Un menu déroulant, un DatePicker).

```bash
php artisan dusk:component DropdownComponent
```

```php
// tests/Browser/Components/DropdownComponent.php
<?php

namespace Tests\Browser\Components;

use Laravel\Dusk\Browser;
use Laravel\Dusk\Component as BaseComponent;

class DropdownComponent extends BaseComponent
{
    // Le gabarit racine du composant
    public function selector(): string
    {
        return '.dropdown-container';
    }

    public function assert(Browser $browser): void
    {
        $browser->assertVisible($this->selector());
    }

    public function elements(): array
    {
        return [
            '@trigger' => '.dropdown-trigger', // Le bouton qui déroule
            '@menu' => '.dropdown-menu', // Le menu caché
            '@items' => '.dropdown-item', // Les liens dedans
        ];
    }

    // Une macro très utile
    public function open(Browser $browser): void
    {
        $browser->click('@trigger')
                ->waitFor('@menu'); // On gère le temps d'animation JS !
    }

    public function selectItem(Browser $browser, string $text): void
    {
        $this->open($browser);
        $browser->clickLink($text);
    }
}
```

```php
// Utilisation : On s'isole "dans" (within) ce composant !
public function test_utilisateur_peut_changer_les_parametres(): void
{
    $this->browse(function (Browser $browser) {
        $browser->loginAs($this->user)
                ->visit('/dashboard')
                ->within(new DropdownComponent, function (Browser $browser) {
                    $browser->selectItem('Paramètres');
                })
                ->assertPathIs('/settings');
    });
}
```

## Tester les Interactions JavaScript Dures (Modales, Scroll)

```php
public function test_la_modale_s_ouvre_et_se_ferme(): void
{
    $this->browse(function (Browser $browser) {
        $browser->visit('/posts')
                ->click('@create-post-button')
                ->waitFor('@modal')  // Attendre l'animation d'ouverture
                ->assertVisible('@modal')
                ->type('@modal-title', 'Mon Article')
                // "within" permet de restreindre toutes les futures requêtes à l'intérieur de la modale !
                ->within('@modal', function (Browser $modal) {
                    $modal->press('Annuler');
                })
                ->waitUntilMissing('@modal') // Attendre l'animation de fermeture
                ->assertMissing('@modal');
    });
}

// Tester un "Infinite Scroll" (Scroll Infini style Twitter/Instagram)
public function test_le_defilement_infini(): void
{
    Post::factory()->count(50)->create();

    $this->browse(function (Browser $browser) {
        $browser->visit('/posts')
                ->assertSeeIn('.post-count', '20')  // Au chargement, on en voit 20
                ->scrollToBottom() // BINGO ! Simulation d'une molette de souris jusqu'en bas
                ->waitForText('Chargement des suivants...') // Le JS affiche un petit texte
                ->waitUntilMissingText('Chargement des suivants...') // La requête Ajax est finie
                ->assertSeeIn('.post-count', '40');  // Après le scroll, on a bien récupéré la page 2 !
    });
}
```

## Gérer les Boîtes de Dialogue Navigateur (Alert, Confirm, Prompt)

Les alertes natives (`window.confirm()`) bloquent totalement l'exécution. Dusk a des méthodes spéciales pour interagir avec le navigateur système :

```php
public function test_confirmer_la_suppression(): void
{
    $post = Post::factory()->create();

    $this->browse(function (Browser $browser) use ($post) {
        $browser->loginAs($post->user)
                ->visit('/posts/' . $post->id)
                ->click('@delete-button') // Ce bouton lance un confirm('T sûr ?')
                ->acceptDialog() // On clique virtuellement sur "OK"
                ->assertPathIs('/posts')
                ->assertDontSee($post->title);
    });
}

public function test_annuler_la_suppression(): void
{
    $post = Post::factory()->create();

    $this->browse(function (Browser $browser) use ($post) {
        $browser->loginAs($post->user)
                ->visit('/posts/' . $post->id)
                ->click('@delete-button')
                ->dismissDialog() // On clique virtuellement sur "Annuler"
                ->assertPathIs('/posts/' . $post->id);
    });
}

public function test_renommer_via_une_boite_de_dialogue(): void
{
    $this->browse(function (Browser $browser) {
        $browser->visit('/settings')
                ->click('@rename-button') // Lance window.prompt()
                ->typeInDialog('Nouveau Nom de Dossier') // Remplit le champ système
                ->acceptDialog() // Valide
                ->assertSee('Nouveau Nom de Dossier');
    });
}
```

## Captures d'Écran et Logs (Indispensables pour Déboguer)

Quand un test "Headless" (invisible) plante sur un serveur d'intégration (GitHub Actions), on est aveugle. Une seule solution : La photo !

```php
public function test_avec_debogage_visuel(): void
{
    $this->browse(function (Browser $browser) {
        $browser->visit('/ma-page-ultra-complexe')
                ->screenshot('etape-1-initiale') // *Clic-Clac*
                ->click('@action')
                ->screenshot('etape-2-apres-le-click') // *Clic-Clac*
                ->assertSee('Resultat');
    });
}

// Les captures sont sauvegardées dans `tests/Browser/screenshots/`
// ! IMPORTANT : Dusk prend AUTOMATIQUEMENT une capture d'écran chaque fois qu'un test ÉCHOUE (Fail).
```

### Lire les Logs du Console.log Javascript !

Parfois l'erreur n'est pas visuelle, c'est le JS qui a crashé dans la console F12.

```php
public function test_sans_erreurs_javascript(): void
{
    $this->browse(function (Browser $browser) {
        $browser->visit('/')
                ->assertNoJavascriptErrors(); // Ne tolère aucune erreur rouge dans le F12
    });
}

public function test_verifier_la_sortie_console(): void
{
    $this->browse(function (Browser $browser) {
        $browser->visit('/');

        // On aspire tous les logs de Chrome
        $logs = $browser->driver->manage()->getLog('browser');

        foreach ($logs as $log) {
            $this->assertNotEquals('SEVERE', $log['level']); // Interdit les erreurs fatales
        }
    });
}
```

## Multijoueur : Plusieurs Navigateurs en Même Temps !

Vous voulez tester un Tchat WebSockets (Livewire/Pusher) en temps réel ? Magie pure de Dusk : Lancez DEUX navigateurs (Alice et Bob) en simultané dans le même test !

```php
public function test_tchat_en_temps_reel(): void
{
    $alice = User::factory()->create(['name' => 'Alice']);
    $bob = User::factory()->create(['name' => 'Bob']);

    // Observez les DEUX variables $first et $second
    $this->browse(function (Browser $first, Browser $second) use ($alice, $bob) {

        // Alice (Fenêtre 1) rejoint le tchat
        $first->loginAs($alice)
              ->visit('/chat')
              ->waitFor('@chat-ready');

        // Bob (Fenêtre 2) rejoint le tchat
        $second->loginAs($bob)
               ->visit('/chat')
               ->waitFor('@chat-ready');

        // L'action d'Alice
        $first->type('@message-input', 'Salut Bob !')
              ->press('Envoyer');

        // La réaction instantanée chez Bob !
        $second->waitForText('Salut Bob !')
               ->assertSee('Alice: Salut Bob !');

        // Bob répond
        $second->type('@message-input', 'Salut Alice, ça va !')
               ->press('Envoyer');

        // La réaction chez Alice
        $first->waitForText('Salut Alice, ça va !')
              ->assertSee('Bob: Salut Alice, ça va !');
    });
}
```

## Ressources

- [Dusk Pages](https://laravel.com/docs/12.x/dusk#pages) — Chapitre sur les Page Objects dans Dusk.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise des Tests Laravel](/laravel/laravel-testing/) sur la plateforme d'apprentissage RostoDev._
