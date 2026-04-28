---
source_course: "laravel-testing"
source_lesson: "laravel-testing-introduction-to-testing"
---

# Introduction aux Tests dans Laravel (Introduction to Testing)

Les tests garantissent que votre application fonctionne comme prévu, jour après jour. Laravel a été conçu dès le premier jour en pensant aux tests, et fournit d'excellents outils pour tous les types de vérification.

## Pourquoi Tester ?

| Bénéfice                      | Description                                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| **Confiance absolue**         | Savoir pertinemment que votre code fonctionne avant de le déployer en ligne.              |
| **Refactoring sans peur**     | Modifier le cœur de l'application sans risquer de tout casser sans le savoir.             |
| **Documentation Vivante**     | Les tests montrent concrètement comment le code est _censé_ se comporter.                 |
| **Développement plus rapide** | Détecter les bugs très tôt, pendant le développement, pas en production à 2h du matin.    |
| **Meilleur Design**           | Écrire du code "testable", c'est écrire du code naturellement mieux découpé et structuré. |

## Les Types de Tests (La Pyramide)

```
┌─────────────────────────────────────────────────────────┐
│              Tests E2E (Bout en Bout)                   │
│          (Navigateur réel, parcours complets)           │
│              Les plus lents, les moins nombreux         │
├─────────────────────────────────────────────────────────┤
│            Tests Fonctionnels (Feature Tests)           │
│        (Requêtes HTTP, interactions Base de données)    │
│            Vitesse moyenne, quantité moyenne            │
├─────────────────────────────────────────────────────────┤
│               Tests Unitaires (Unit Tests)              │
│      (Une classe unique, une fonction mathématique)     │
│             Les plus rapides, les plus nombreux         │
└─────────────────────────────────────────────────────────┘
```

- **Tests Unitaires (Unit Tests)** : Testent un morceau de code isolé (ex: une fonction qui calcule la TVA). Ils ne touchent JAMAIS à la base de données.
- **Tests Fonctionnels (Feature Tests)** : Testent une fonctionnalité complète, comme la soumission d'un formulaire, l'enregistrement en BDD et l'envoi d'un email.
- **Tests Navigateur (E2E/Browser)** : Pilotent un vrai navigateur (Chrome/Firefox) pour simuler un humain qui clique. (Laravel Dusk).

## Structure des Tests dans Laravel

```
tests/
├── Feature/             # Vos tests fonctionnels (Ceux que vous ferez le plus)
│   ├── ExampleTest.php
│   └── PostTest.php
├── Unit/                # Vos tests unitaires isolés
│   ├── ExampleTest.php
│   └── UserTest.php
├── TestCase.php         # La classe parente de tous vos tests
└── CreatesApplication.php
```

## PHPUnit contre Pest

Laravel supporte nativement DEUX frameworks de test majeurs :

### PHPUnit (Le Traditionnel / Historique)

Basé sur la Programmation Orientée Objet classique :

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    // Le nom de la méthode DOIT commencer par 'test_'
    public function test_l_application_retourne_un_succes(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
```

### Pest (Le Moderne / Élégant)

L'approche de Laravel version 11+, inspirée de Jest en JavaScript. C'est le standard de facto aujourd'hui.

```php
<?php

// Syntaxe extraordinairement pure, sans classes ni namespaces imposés
test('l application retourne un succes', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});
```

_(Note : Dans ce cours, nous utiliserons principalement la syntaxe PHPUnit car elle est universelle, mais la logique est 100% identique avec Pest)._

## Exécuter les Tests

L'outil central est la commande `artisan test` :

```bash
# Lancer TOUS les tests du projet
php artisan test

# Avec PHPUnit directement (L'ancienne méthode)
./vendor/bin/phpunit

# Ne lancer qu'un fichier précis (Gain de temps énorme)
php artisan test tests/Feature/PostTest.php

# Ne lancer qu'UNE SEULE méthode de test grâce à son nom
php artisan test --filter test_l_application_retourne_un_succes

# Lancer les tests en Parallèle (Utilise tous les cœurs de votre Processeur = Très rapide)
php artisan test --parallel

# S'arrêter net au premier test qui échoue (Pratique pour déboguer pas à pas)
php artisan test --stop-on-failure

# Obtenir un rapport de Couverture de code (Quelles lignes n'ont pas été testées ?)
php artisan test --coverage
```

## Créer de Nouveaux Tests

```bash
# Créer un test Fonctionnel (par défaut)
php artisan make:test PostTest

# Créer un test Unitaire
php artisan make:test UserTest --unit

# Créer un test avec PEST (Si Pest est installé)
php artisan make:test PostTest --pest
```

## L'Environnement de Test

Quand vous lancez les tests, Laravel bascule intelligemment sur l'environnement `testing`. Cela est configuré dans le fichier `phpunit.xml` :

```xml
<!-- Extrait de phpunit.xml -->
<env name="APP_ENV" value="testing"/>
<env name="DB_CONNECTION" value="sqlite"/>
<env name="DB_DATABASE" value=":memory:"/> <!-- La base est générée dans la RAM = Ultra rapide -->
```

Vous pouvez aussi créer un fichier `.env.testing` si vous avez besoin de remplacer des variables spécifiques (ex: utiliser une fausse clé API Stripe).

## Les Assertions de Base (Vérifications)

Une `assertion` est le moment où vous demandez au test de vérifier si une valeur correspond à ce que vous attendez. Si c'est faux, le test "échoue".

```php
// --- Assertions PHPUnit ---
$this->assertTrue($valeur);        // Vérifie que c'est Vrai (True)
$this->assertFalse($valeur);       // Vérifie que c'est Faux (False)
$this->assertEquals($attendu, $actuel); // Vérifie que "Chat" == "Chat"
$this->assertNull($valeur);        // Vérifie que c'est null
$this->assertNotNull($valeur);     // Vérifie que ce n'est PAS null
$this->assertCount(3, $tableau);   // Vérifie que le tableau a 3 éléments
$this->assertContains('pomme', $tableau); // Vérifie que "pomme" est dans le tableau
$this->assertInstanceOf(User::class, $utilisateur); // Vérifie que l'objet est bien de type User

// --- L'équivalent avec Pest (Expectation API) ---
expect($valeur)->toBeTrue();
expect($valeur)->toBeFalse();
expect($actuel)->toBe($attendu);
expect($actuel)->toEqual($attendu);
expect($valeur)->toBeNull();
expect($tableau)->toHaveCount(3);
expect($tableau)->toContain('pomme');
expect($utilisateur)->toBeInstanceOf(User::class);
```

## Votre Premier Test

Créons un test unitaire très simple sur un Modèle `User` :

```php
<?php

namespace Tests\Unit;

use App\Models\User;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function test_nom_complet_utilisateur(): void
    {
        // 1. Arrange (Préparer)
        $user = new User([
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
        ]);

        // 2. Act & 3. Assert (Agir et Vérifier)
        $this->assertEquals('Jean Dupont', $user->fullName);
    }

    public function test_utilisateur_n_est_pas_admin_par_defaut(): void
    {
        $user = new User();

        $this->assertFalse($user->is_admin);
    }
}
```

La même chose élégamment écrite avec Pest :

```php
<?php

use App\Models\User;

test('nom complet utilisateur', function () {
    $user = new User([
        'first_name' => 'Jean',
        'last_name' => 'Dupont',
    ]);

    expect($user->fullName)->toBe('Jean Dupont');
});

test('utilisateur n est pas admin par defaut', function () {
    $user = new User();

    expect($user->is_admin)->toBeFalse();
});
```

## Ressources

- [Tests : Démarrage Rapide (Testing: Getting Started)](https://laravel.com/docs/12.x/testing) — Documentation officielle des tests Laravel.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise des Tests Laravel](/laravel/laravel-testing/) sur la plateforme d'apprentissage RostoDev._
