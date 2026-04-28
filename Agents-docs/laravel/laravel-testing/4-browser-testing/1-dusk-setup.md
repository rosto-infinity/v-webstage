---
source_course: "laravel-testing"
source_lesson: "laravel-testing-dusk-setup"
---

# Démarrer avec Laravel Dusk (Getting Started)

Laravel Dusk permet de réaliser des tests d'interface utilisateur (UI) fluides et expressifs pour vos applications. Contrairement aux tests fonctionnels classiques, Dusk pilote un **véritable navigateur web** (Chrome), simulant à la perfection les actions d'un véritable être humain devant son écran.

## Qu'est-ce qu'un Test Navigateur (Browser Testing) ?

Les tests navigateur (souvent appelés Tests Bout-en-Bout ou E2E) :

- S'exécutent dans un VRAI navigateur Chrome (souvent en mode "Headless", c'est-à-dire sans afficher la fenêtre graphique pour aller plus vite).
- Sont capables de tester les interactions **JavaScript** complexes (ex: Vue.js, React, Alpine.js, Livewire).
- Vérifient l'expérience utilisateur réelle (Le bouton est-il visible ? Le texte est-il de la bonne couleur ?).
- Sont techniquement **plus lents** à exécuter et plus fragiles, c'est pourquoi on en écrit moins que des tests unitaires.

```text
┌─────────────────────────────────────────────────────────┐
│                 La Pyramide des Tests                   │
│                                                         │
│                        /\                               │
│                       /  \                              │
│                      / E2E\   <- Dusk (Quelques-uns)    │
│                     /──────\                            │
│                    /Feature \  <- Tests HTTP (Beaucoup) │
│                   /──────────\                          │
│                  /    Unit    \ <- Tests Unitaire (Énormément)
│                 ────────────────                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Installation

Dusk n'est pas inclus par défaut dans Laravel, car il installe des binaires ChromeDriver lourds.

```bash
# On l'installe uniquement pour le développement
composer require laravel/dusk --dev

# On initialise l'arborescence
php artisan dusk:install
```

Cela va créer :

- `tests/Browser/` - Le dossier exclusif pour les tests Dusk.
- `tests/Browser/ExampleTest.php` - Un test d'exemple.
- `tests/DuskTestCase.php` - La classe mère pour tous vos tests navigateur.

## Un Premier Test Dusk Basique

```php
<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    public function test_exemple_basique(): void
    {
        // $this->browse() lance le navigateur Chrome !
        $this->browse(function (Browser $browser) {
            $browser->visit('/') // Le navigateur tape l'URL /
                    ->assertSee('Laravel'); // Le navigateur inspecte visuellement la page
        });
    }
}
```

## Lancer les Tests Dusk

Dusk a sa propre commande artisan, séparée de `artisan test` car on ne veut pas lancer les lourds tests navigateur à la légère.

```bash
# Lancer TOUS les tests Dusk
php artisan dusk

# Lancer un fichier spécifique
php artisan dusk tests/Browser/LoginTest.php

# Lancer une méthode de test spécifique
php artisan dusk --filter test_utilisateur_peut_se_connecter

# Option très sympa : Voir le navigateur s'ouvrir et cliquer tout seul à toute vitesse !
php artisan dusk --browse
```

## Configuration de l'Environnement

Créez un fichier `.env.dusk.local` spécifique pour Dusk. C'est vital car Dusk a besoin d'attaquer une VRAIE base de données de test (pas une BDD en RAM SQLite comme les autres tests, car le navigateur lui, tape sur le port 8000 via un vrai serveur local).

```env
APP_ENV=testing
APP_URL=http://localhost:8000
DB_CONNECTION=mysql
DB_DATABASE=dusk_testing
```

> **Attention :** Avant de lancer Dusk, vous devez avoir un serveur local qui tourne ! (`php artisan serve` dans un autre terminal).

## Navigation et URLs

```php
$this->browse(function (Browser $browser) {
    // Visiter une URL
    $browser->visit('/posts');
    $browser->visit(route('posts.index')); // Mieux !

    // Raccourcis de navigation classiques
    $browser->back(); // Page précédente
    $browser->forward(); // Page suivante
    $browser->refresh(); // F5 (Rafraîchir)

    // Suivre un lien hypertexte
    $browser->clickLink('Voir l\'article');

    // Vérifier où le navigateur se trouve actuellement
    $browser->assertPathIs('/posts');
    $browser->assertPathIsNot('/login');
    $browser->assertUrlIs('http://localhost:8000/posts');
    $browser->assertRouteIs('posts.index');

    // Y-a-t il un paramètre dans l'URL ? (Ex: /posts?page=2)
    $browser->assertQueryStringHas('page');
    $browser->assertQueryStringHas('page', '2');
});
```

## Interagir avec les Éléments

### Cliquer

```php
$browser->click('.submit-button'); // Sélecteur CSS classique
$browser->click('@submit-button'); // Sélecteur Dusk magique (Voir plus bas)
$browser->clickLink('Se Connecter'); // Cherche une balise <a> avec ce texte précis
$browser->clickAtXPath('//button[@id="submit"]'); // Pour les puristes XML
```

### Taper du texte (Clavier)

```php
$browser->type('email', 'test@exemple.com'); // Nom de l'attribut HTML "name"
$browser->type('@email-input', 'test@exemple.com'); // Sélecteur Dusk
$browser->typeSlowly('email', 'test@exemple.com'); // Tape comme une vraie grand-mère (pratique pour tester l'autocomplétion)
$browser->clear('email'); // Efface le champ
$browser->append('email', '.fr'); // Ajoute à la fin
```

### Manipuler les Formulaires

```php
$browser->select('country', 'FR'); // Menus déroulants <select>
$browser->select('country');  // Sélection au hasard !

$browser->check('terms');   // Coche la case (Checkbox)
$browser->uncheck('newsletter'); // Décoche

$browser->radio('plan', 'premium'); // Boutons d'options circulaires

$browser->attach('resume', __DIR__ . '/fichiers/cv.pdf'); // Upload de vrai fichier (Input de type file)

$browser->press('Envoyer'); // Cherche un bouton submit avec ce texte
$browser->press('@submit-button');
```

## Les Sélecteurs Dusk (@) : La bonne pratique absolue

Ne basez jamais vos tests E2E sur des classes CSS esthétiques (comme `.text-red-500` ou `.btn-primary`). Si un designer change la classe demain, votre test plantera (Faux Positif) alors que la fonctionnalité marche !

Dusk a inventé l'attribut HTML `dusk="..."` pour les sélecteurs immuables.

```html
<!-- Dans votre template Blade -->
<button class="bg-blue-500 rounded" dusk="submit-button">Envoyer</button>
<input type="email" class="border p-2" dusk="email-input" />
```

```php
// Dans votre test Dusk (Le '@' est un raccourci pour chercher l'attribut dusk=)
$browser->click('@submit-button');
$browser->type('@email-input', 'test@exemple.com');
```

Maintenant, les designers peuvent poudrer le CSS autant qu'ils veulent, le test tiendra bon !

## Attendre des Éléments (Le cauchemar des Single Page Apps)

En JavaScript (Vue/React/Livewire), les éléments n'apparaissent pas instantanément sur la page. Il faut parfois attendre 1 petite seconde le temps que le serveur réponde.

```php
// Attendre qu'un élément finisse d'apparaître sur la page
$browser->waitFor('.modal');
$browser->waitFor('@modal', 10);  // Attendre jusqu'à 10 secondes maximum avant de crasher

// Attendre qu'un texte précis s'affiche à l'écran
$browser->waitForText('Succès de l\'opération');

// Attendre qu'un "Spinner" de chargement DISPARAISSE enfin
$browser->waitUntilMissing('.loading');

// Parfois, le navigateur met du temps à changer de page en SPA
$browser->waitForLocation('/dashboard');

// Attendre qu'une simple redirection complète de page se termine
$browser->waitForReload();

// La pause brutale à "l'ancienne" (À éviter, mais ça sauve parfois la vie)
$browser->pause(1000);  // S'endort 1 seconde chrono en main

// Wait avec logique PHP + JS complexe
$browser->waitUsing(10, 100, function () use ($browser) {
    return $browser->element('.m-status-ready') !== null;
});
```

## Un Test de Connexion Complet et Réaliste

```php
<?php

namespace Tests\Browser;

use App\Models\User;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class LoginTest extends DuskTestCase
{
    public function test_un_utilisateur_peut_se_connecter(): void
    {
        // 1. On fabrique notre utilisateur d'essai dans la BDD
        $user = User::factory()->create([
            'email' => 'test@exemple.com',
            'password' => bcrypt('password123'),
        ]);

        // 2. On lâche le robot Navigateur !
        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login') // Va sur la page de co
                    ->type('email', 'test@exemple.com') // Tape l'email
                    ->type('password', 'password123') // Tape le mdp
                    ->press('Se Connecter') // Clique sur le gros bouton
                    ->assertPathIs('/dashboard') // Est-on bien redirigé ?
                    ->assertSee('Tableau de bord'); // Lit-on le message de bienvenue ?
        });
    }

    public function test_la_connexion_echoue_avec_un_mauvais_mot_de_passe(): void
    {
        $user = User::factory()->create();

        $this->browse(function (Browser $browser) use ($user) {
            $browser->visit('/login')
                    ->type('email', $user->email)
                    ->type('password', 'mot_de_passe_qui_n_a_rien_a_voir')
                    ->press('Se Connecter')
                    ->assertPathIs('/login') // On doit rebondir (rester) sur la même page
                    ->assertSee('Ces identifiants ne correspondent pas'); // Et voir l'erreur rouge
        });
    }

    public function test_un_utilisateur_peut_se_deconnecter(): void
    {
        $user = User::factory()->create();

        $this->browse(function (Browser $browser) use ($user) {
            // "loginAs" est un hack ultra-rapide prisé par Dusk pour
            // injecter artificiellement la session sans avoir à re-remplir le formulaire !
            $browser->loginAs($user)
                    ->visit('/dashboard')
                    ->clickLink('Se Déconnecter')
                    ->assertPathIs('/');
        });
    }
}
```

## Ressources

- [Laravel Dusk](https://laravel.com/docs/12.x/dusk) — La documentation officielle pour aller plus loin.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise des Tests Laravel](/laravel/laravel-testing/) sur la plateforme d'apprentissage RostoDev._
