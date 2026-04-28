---
source_course: "laravel-testing"
source_lesson: "laravel-testing-unit-test-fundamentals"
---

# Fondamentaux des Tests Unitaires (Unit Test Fundamentals)

Les tests unitaires vérifient que des morceaux de code individuels fonctionnent correctement et de manière isolée. Ils constituent la fondation granitique d'une suite de tests solide.

## Qu'est-ce qu'un Test Unitaire ?

Un test unitaire pur :

- Teste une SEULE "unité" (une classe de base, une méthode spécifique, ou une fonction pure).
- S'exécute en ISOLEMENT COMPLET du reste du code de l'application.
- **NE TOUCHE PAS** à la base de données, ni au système de fichiers, ni aux services externes.
- Est par conséquent **extrêmement rapide** (généralement mesuré en millisecondes).

```text
┌─────────────────────────────────────────────────────────┐
│                 Votre Application Laravel               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│    ┌──────────┐   ┌──────────┐   ┌──────────┐           │
│    │  Classe  │   │ Logique  │   │ Fonction │           │
│    │  Service │   │ du Modèle│   │  Helper  │           │
│    └──────────┘   └──────────┘   └──────────┘           │
│         ▲              ▲              ▲                 │
│         │              │              │                 │
│    Test Unitaire 1  Test Unitaire 2  Test Unitaire 3    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Créer des Tests Unitaires

Laravel a une commande dédiée pour ça, en ajoutant le flag `--unit` :

```bash
php artisan make:test UserTest --unit
```

Cela crée le fichier `tests/Unit/UserTest.php` :

```php
<?php

namespace Tests\Unit;

// ATTENTION: C'est le TestCase de base de PHPUnit, PAS celui de Laravel !
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    // Vos tests iront ici
}
```

**Important** : Les tests unitaires étendent `PHPUnit\Framework\TestCase`, et NON PAS `Tests\TestCase`. Cela signifie formellement que **le gros moteur de l'application Laravel n'est pas démarré** (pas de Façades, pas de Model Query Builder). Cela maintient vos tests unitaires ultra-légers et véloces.

## Tester la Logique Métier d'un Modèle (Business Logic)

Prenons l'exemple d'un modèle `User` (Utilisateur) qui contient des règles de gestion internes :

```php
// app/Models/User.php
class User extends Model
{
    // Mutateur "AccessR" (Prend First et Last name pour faire le concat)
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => trim("{$this->first_name} {$this->last_name}")
        );
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function age(): int
    {
        return $this->birth_date->age;
    }

    public function canAccessPremiumContent(): bool
    {
        return $this->isAdmin() || $this->subscription_tier === 'premium';
    }
}
```

Les tests unitaires pour ce modèle (sans jamais frapper la base de données) :

```php
<?php

namespace Tests\Unit;

use App\Models\User;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function test_le_nom_complet_combine_le_prenom_et_le_nom(): void
    {
        // On INSTANCIE un User en mémoire, sans chercher à le sauvegarder
        $user = new User([
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
        ]);

        $this->assertEquals('Jean Dupont', $user->full_name);
    }

    public function test_le_nom_complet_gere_l_absence_de_nom_de_famille(): void
    {
        $user = new User(['first_name' => 'Jean']);

        $this->assertEquals('Jean', $user->full_name);
    }

    public function test_isAdmin_retourne_vrai_pour_le_role_admin(): void
    {
        $user = new User(['role' => 'admin']);

        $this->assertTrue($user->isAdmin());
    }

    public function test_isAdmin_retourne_faux_pour_les_autres_roles(): void
    {
        $user = new User(['role' => 'user']);

        $this->assertFalse($user->isAdmin());
    }

    public function test_acces_premium_accorde_pour_les_admins(): void
    {
        $user = new User(['role' => 'admin']);

        $this->assertTrue($user->canAccessPremiumContent());
    }

    public function test_acces_premium_accorde_pour_les_abonnes_premium(): void
    {
        $user = new User(['subscription_tier' => 'premium']);

        $this->assertTrue($user->canAccessPremiumContent());
    }

    public function test_acces_premium_refuse_pour_les_utilisateurs_basiques(): void
    {
        $user = new User([
            'role' => 'user',
            'subscription_tier' => 'basic',
        ]);

        $this->assertFalse($user->canAccessPremiumContent());
    }
}
```

## Tester des Classes de Service (Service Classes)

Les "Classes de Service" contenant une forte logique conditionnelle mathématique ou métier sont les candidates idéales (et prioritaires) pour les tests unitaires :

```php
// app/Services/PricingCalculator.php (Calculateur de prix)
class PricingCalculator
{
    public function __construct(
        private readonly float $taxRate = 0.20 // TVA par défaut à 20%
    ) {}

    public function calculateSubtotal(array $items): float
    {
        return array_sum(array_map(
            fn ($item) => $item['price'] * $item['quantity'],
            $items
        ));
    }

    public function calculateTax(float $subtotal): float
    {
        return round($subtotal * $this->taxRate, 2);
    }

    public function calculateTotal(array $items): float
    {
        $subtotal = $this->calculateSubtotal($items);
        $tax = $this->calculateTax($subtotal);
        return $subtotal + $tax;
    }

    public function applyDiscount(float $amount, float $discountPercent): float
    {
        if ($discountPercent < 0 || $discountPercent > 100) {
            throw new \InvalidArgumentException('La remise doit être entre 0 et 100%');
        }
        return round($amount * (1 - $discountPercent / 100), 2);
    }
}
```

```php
<?php

namespace Tests\Unit;

use App\Services\PricingCalculator;
use PHPUnit\Framework\TestCase;

class PricingCalculatorTest extends TestCase
{
    private PricingCalculator $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        // S'exécute avant chaque test pour repartir sur une calculatrice neuve
        $this->calculator = new PricingCalculator(taxRate: 0.10); // TVA à 10% pour ces tests
    }

    public function test_calcule_le_sous_total(): void
    {
        $items = [
            ['price' => 10.00, 'quantity' => 2], // 20€
            ['price' => 5.00, 'quantity' => 3],  // 15€
        ];

        $subtotal = $this->calculator->calculateSubtotal($items);

        $this->assertEquals(35.00, $subtotal);
    }

    public function test_calcule_la_taxe(): void
    {
        $tax = $this->calculator->calculateTax(100.00);

        $this->assertEquals(10.00, $tax); // 10% de 100€
    }

    public function test_calcule_le_total_avec_la_taxe(): void
    {
        $items = [
            ['price' => 100.00, 'quantity' => 1],
        ];

        $total = $this->calculator->calculateTotal($items);

        $this->assertEquals(110.00, $total);
    }

    public function test_applique_une_remise(): void
    {
        $discounted = $this->calculator->applyDiscount(100.00, 20); // -20%

        $this->assertEquals(80.00, $discounted);
    }

    public function test_la_remise_lance_une_exception_pour_un_pourcentage_negatif(): void
    {
        // On s'attend à ce que la calculatrice "crache" (throw) une exception ! Le test sera vert si elle le fait.
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('La remise doit être entre 0 et 100');

        $this->calculator->applyDiscount(100.00, -10);
    }

    public function test_la_remise_lance_une_exception_si_superieure_a_100(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->calculator->applyDiscount(100.00, 150);
    }

    public function test_un_panier_vide_renvoie_zero(): void
    {
        $subtotal = $this->calculator->calculateSubtotal([]);

        $this->assertEquals(0.00, $subtotal);
    }
}
```

## Tester des Fonctions Isolées (Helper Functions)

Si vous avez créé des fonctions utilitaires dans un fichier `app/Helpers/...` :

```php
// app/Helpers/StringHelper.php
function slugify(string $text): string
{
    $text = preg_replace('~[^\pL\d]+~u', '-', $text);
    $text = trim($text, '-');
    $text = strtolower($text);
    return preg_replace('~-+~', '-', $text);
}

function excerpt(string $text, int $length = 100): string
{
    if (strlen($text) <= $length) {
        return $text;
    }
    return substr($text, 0, $length) . '...';
}
```

Ce sont les fonctions les plus satisfaisantes à tester !

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class StringHelperTest extends TestCase
{
    public function test_slugify_convertit_les_espaces_en_tirets(): void
    {
        $this->assertEquals('hello-world', slugify('Hello World'));
    }

    public function test_slugify_supprime_la_ponctuation(): void
    {
        $this->assertEquals('hello-world', slugify('Hello! World?'));
    }

    public function test_slugify_gere_bien_les_accents(): void
    {
        $this->assertEquals('cafe', slugify('Café'));
    }

    public function test_excerpt_retourne_le_texte_entier_s_il_est_court(): void
    {
        $text = 'Texte court';
        $this->assertEquals('Texte court', excerpt($text, 100)); // Limite à 100
    }

    public function test_excerpt_tronque_et_met_des_points_de_suspension_si_trop_long(): void
    {
        $text = str_repeat('a', 150); // Mots de 150 lettres
        $result = excerpt($text, 100);

        $this->assertEquals(103, strlen($result)); // 100 lettres + les 3 points "..."
        $this->assertStringEndsWith('...', $result); // Se termine bien par ...
    }
}
```

## Ressources

- [Documentation PHPUnit](https://phpunit.de/documentation.html) — La documentation complète du moteur PHPUnit sous-jacent.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise des Tests Laravel](/laravel/laravel-testing/) sur la plateforme d'apprentissage RostoDev._
