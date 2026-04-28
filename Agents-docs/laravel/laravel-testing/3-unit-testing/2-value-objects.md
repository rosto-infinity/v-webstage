---
source_course: "laravel-testing"
source_lesson: "laravel-testing-testing-value-objects"
---

# Tester des Objets de Valeur (Value Objects) et des DTOs

Les _Value Objects_ (Objets de Valeur) et les _DTOs_ (Data Transfer Objects = Objets de Transfert de Données) sont les candidats les plus parfaits au monde pour les tests unitaires : ils contiennent de la logique métier extrêmement pure et ont généralement ZÉRO dépendance externe (pas de base de données, pas d'API réseau).

## Que sont les Value Objects ?

Les Objets de Valeur sont des objets **immuables** (qui ne peuvent pas être modifiés après leur création) qui représentent une "valeur" conceptuelle (comme un Prix, une Adresse e-mail, une Coordonnée GPS). Ils sont comparés par ce qu'ils valent, et non par ce qu'ils sont en mémoire.

Prenons l'exemple incontournable d'une classe Gérant l'Argent :

```php
// app/ValueObjects/Money.php
final class Money
{
    public function __construct(
        private readonly int $cents, // Toujours stocker l'argent en centimes !
        private readonly string $currency = 'EUR'
    ) {
        if ($cents < 0) {
            throw new \InvalidArgumentException('Le montant ne peut pas être négatif');
        }
    }

    public static function fromEuros(float $euros, string $currency = 'EUR'): self
    {
        return new self((int) round($euros * 100), $currency);
    }

    public function cents(): int
    {
        return $this->cents;
    }

    public function euros(): float
    {
        return $this->cents / 100;
    }

    public function currency(): string
    {
        return $this->currency;
    }

    public function add(Money $other): self
    {
        $this->ensureSameCurrency($other);
        // IMMUTABILITÉ : On retourne un NOUVEL objet Money, on ne modifie pas l'actuel
        return new self($this->cents + $other->cents, $this->currency);
    }

    public function subtract(Money $other): self
    {
        $this->ensureSameCurrency($other);
        return new self($this->cents - $other->cents, $this->currency);
    }

    public function multiply(float $multiplier): self
    {
        return new self((int) round($this->cents * $multiplier), $this->currency);
    }

    public function equals(Money $other): bool
    {
        return $this->cents === $other->cents
            && $this->currency === $other->currency;
    }

    public function format(): string
    {
        $symbols = ['USD' => '$', 'EUR' => '€', 'GBP' => '£'];
        $symbol = $symbols[$this->currency] ?? $this->currency . ' ';
        return number_format($this->euros(), 2, ',', ' ') . ' ' . $symbol;
    }

    private function ensureSameCurrency(Money $other): void
    {
        if ($this->currency !== $other->currency) {
            throw new \InvalidArgumentException(
                "Impossible d'additionner des devises différentes : {$this->currency} et {$other->currency}"
            );
        }
    }
}
```

Tests Unitaires Exhaustifs (Très rapides à écrire et à exécuter) :

```php
<?php

namespace Tests\Unit\ValueObjects;

use App\ValueObjects\Money;
use PHPUnit\Framework\TestCase;

class MoneyTest extends TestCase
{
    // --- 1. Tests de Création ---
    public function test_cree_depuis_des_centimes(): void
    {
        $money = new Money(1000); // 1000 centimes = 10€

        $this->assertEquals(1000, $money->cents());
        $this->assertEquals(10.00, $money->euros());
    }

    public function test_cree_depuis_des_euros(): void
    {
        $money = Money::fromEuros(10.99);

        $this->assertEquals(1099, $money->cents());
    }

    public function test_gere_l_arrondi_depuis_les_euros(): void
    {
        $money = Money::fromEuros(10.999);

        $this->assertEquals(1100, $money->cents()); // Arrondi à l'entier supérieur
    }

    public function test_lance_une_erreur_pour_un_montant_negatif(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Le montant ne peut pas être négatif');

        new Money(-100);
    }

    // --- 2. Tests Mathématiques ---
    public function test_additionne_de_l_argent(): void
    {
        $a = Money::fromEuros(10.00);
        $b = Money::fromEuros(5.50);

        $result = $a->add($b);

        $this->assertEquals(1550, $result->cents());
    }

    public function test_soustrait_de_l_argent(): void
    {
        $a = Money::fromEuros(10.00);
        $b = Money::fromEuros(3.50);

        $result = $a->subtract($b);

        $this->assertEquals(650, $result->cents());
    }

    public function test_multiplie_de_l_argent(): void
    {
        $money = Money::fromEuros(10.00);

        $result = $money->multiply(1.5);

        $this->assertEquals(1500, $result->cents());
    }

    public function test_l_arithmetique_conserve_l_immutabilite(): void
    {
        $original = Money::fromEuros(10.00);
        $result = $original->add(Money::fromEuros(5.00));

        // L'objet original n'a PAS été modifié ! C'est vital.
        $this->assertEquals(1000, $original->cents());
        $this->assertEquals(1500, $result->cents());
    }

    // --- 3. Tests de Devises ---
    public function test_devise_par_defaut_est_eur(): void
    {
        $money = new Money(1000);

        $this->assertEquals('EUR', $money->currency());
    }

    public function test_accepte_des_devises_differentes(): void
    {
        $usd = new Money(1000, 'USD');

        $this->assertEquals('USD', $usd->currency());
    }

    public function test_refuse_d_additionner_des_pommes_et_des_poires(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage("Impossible d'additionner des devises différentes");

        $usd = Money::fromEuros(10.00, 'USD');
        $eur = Money::fromEuros(10.00, 'EUR');

        $usd->add($eur); // Doit planter !
    }

    // --- 4. Tests d'Égalité ---
    public function test_est_egal_si_meme_montant_et_devise(): void
    {
        $a = Money::fromEuros(10.00);
        $b = Money::fromEuros(10.00);

        $this->assertTrue($a->equals($b));
    }

    public function test_n_est_pas_egal_si_montant_different(): void
    {
        $a = Money::fromEuros(10.00);
        $b = Money::fromEuros(20.00);

        $this->assertFalse($a->equals($b));
    }

    public function test_n_est_pas_egal_si_devise_differente(): void
    {
        $a = Money::fromEuros(10.00, 'USD');
        $b = Money::fromEuros(10.00, 'EUR');

        $this->assertFalse($a->equals($b));
    }

    // --- 5. Tests de Formatage ---
    public function test_formate_en_euros(): void
    {
        $money = Money::fromEuros(1234.56, 'EUR');

        $this->assertEquals('1 234,56 €', $money->format());
    }
}
```

## Tester des DTOs (Data Transfer Objects)

Les DTOs sont de simples coquilles dures qui garantissent qu'un paquet de données (ex: venant d'une requête HTTP) est bien formé avant d'être envoyé au Modèle ou au Service métier.

```php
// app/DTOs/CreateUserData.php
final class CreateUserData
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
        public readonly ?string $phone = null,
        public readonly array $roles = ['user']
    ) {}

    // Factory Method statique très fréquente
    public static function fromRequest(array $data): self
    {
        return new self(
            name: $data['name'],
            email: strtolower(trim($data['email'])), // Nettoyage de l'email
            password: $data['password'],
            phone: $data['phone'] ?? null,
            roles: $data['roles'] ?? ['user']
        );
    }

    // Utile pour piocher dans le DTO au moment de créer le Model (User::create($dto->toArray()))
    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
            'phone' => $this->phone,
            'roles' => $this->roles,
        ];
    }

    public function hasRole(string $role): bool
    {
        return in_array($role, $this->roles, true);
    }
}
```

```php
<?php

namespace Tests\Unit\DTOs;

use App\DTOs\CreateUserData;
use PHPUnit\Framework\TestCase;

class CreateUserDataTest extends TestCase
{
    public function test_instancie_depuis_des_donnees_de_requete(): void
    {
        // On simule ce qui arrive d'un contrôleur
        $data = [
            'name' => 'Jean Michel',
            'email' => '  JEAN@EXEMPLE.COM  ', // Remarquez les espaces et majuscules
            'password' => 'secret123',
        ];

        $dto = CreateUserData::fromRequest($data);

        $this->assertEquals('Jean Michel', $dto->name);
        // Le DTO a dû nettoyer la donnée (trim + strtolower) !
        $this->assertEquals('jean@exemple.com', $dto->email);
        $this->assertEquals('secret123', $dto->password);
        $this->assertNull($dto->phone); // Optionnel par défaut
        $this->assertEquals(['user'], $dto->roles); // Rôle par défaut
    }

    public function test_accepte_les_champs_optionnels(): void
    {
        $data = [
            'name' => 'Jean',
            'email' => 'jean@exemple.com',
            'password' => 'secret',
            'phone' => '+33612345678',
            'roles' => ['admin', 'editeur'],
        ];

        $dto = CreateUserData::fromRequest($data);

        $this->assertEquals('+33612345678', $dto->phone);
        $this->assertEquals(['admin', 'editeur'], $dto->roles);
    }

    public function test_se_convertit_en_tableau(): void
    {
        $dto = new CreateUserData(
            name: 'Jean',
            email: 'jean@exemple.com',
            password: 'secret',
        );

        $array = $dto->toArray();

        // Le tableau final est prêt à être avalé par Eloquent
        $this->assertEquals('Jean', $array['name']);
        $this->assertEquals('jean@exemple.com', $array['email']);
        $this->assertArrayHasKey('phone', $array);
    }

    public function test_verifie_simplement_le_role(): void
    {
        $dto = new CreateUserData(
            name: 'Admin',
            email: 'admin@exemple.com',
            password: 'secret',
            roles: ['admin', 'editeur']
        );

        $this->assertTrue($dto->hasRole('admin'));
        $this->assertTrue($dto->hasRole('editeur'));
        $this->assertFalse($dto->hasRole('user'));
    }
}
```

## Ressources

- [Objets de Valeur (Value Objects) en PHP](https://martinfowler.com/bliki/ValueObject.html) — L'explication théorique par Martin Fowler (anglais).

---

> 📘 _Cette leçon fait partie du cours [Maîtrise des Tests Laravel](/laravel/laravel-testing/) sur la plateforme d'apprentissage RostoDev._
