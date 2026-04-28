---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-attribute-casting"
---

# Le Casting d'Attributs (Attribute Casting)

Le "Casting" d'attributs permet de convertir automatiquement les valeurs brutes de la base de données vers des types de données PHP courants (comme des tableaux, des dates, des booléens ou des objets JSON). Au lieu de convertir manuellement ces valeurs partout dans votre code, vous le définissez une seule fois dans votre modèle Eloquent.

## Casting de Base

La méthode `casts()` permet de lister les attributs et la façon dont ils doivent être interprétés en PHP.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * Obtenir les attributs qui doivent être "castés" (convertis).
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'is_admin' => 'boolean', // La BDD stocke '1' ou '0', PHP vera `true` ou `false`
            'settings' => 'array',
            'birthday' => 'date',
            'balance' => 'decimal:2', // Décimale avec toujours 2 chiffres après la virgule
        ];
    }
}
```

## Types de Cast Disponibles

### Types Primitifs

```php
protected function casts(): array
{
    return [
        'is_active' => 'boolean',      // true/false
        'age' => 'integer',            // int
        'price' => 'float',            // float
        'price' => 'double',           // identique à float
        'amount' => 'decimal:2',       // chaîne de caractères (string) avec 2 décimales (évite les bugs de flottants en PHP)
        'data' => 'string',            // string
    ];
}
```

### Types Date et Heure

Eloquent convertit automatiquement ces attributs en instances de **Carbon** (La puissante librairie de manipulation de dates de Laravel).

```php
protected function casts(): array
{
    return [
        'created_at' => 'datetime',           // Instance Carbon (Date + Heure)
        'published_at' => 'datetime:Y-m-d',   // Carbon avec format par défaut pour la sérialisation (tableaux/JSON)
        'birthday' => 'date',                 // Instance Carbon (Date uniquement)
        'time_slot' => 'timestamp',           // Entier (Timestamp Unix)
        'expires_at' => 'immutable_datetime', // CarbonImmutable (Empêche la modification accidentelle de l'objet date)
    ];
}
```

Utilisation :

```php
$user = User::find(1);

$user->birthday;                    // C'est un objet Carbon !
$user->birthday->age;               // 25 (Calcule l'âge automatiquement)
$user->birthday->format('d/m/Y');   // "15/01/1999"
$user->birthday->diffForHumans();   // "Il y a 25 ans"
```

### Tableaux (Array) et JSON

C'est l'un des types de cast les plus utiles. Les bases de données modernes gèrent très bien le type JSON, Eloquent le rend transparent.

```php
protected function casts(): array
{
    return [
        'settings' => 'array',             // Chaîne JSON en base -> Tableau PHP
        'preferences' => 'json',           // Identique à 'array' (alias informatif)
        'metadata' => 'object',            // Chaîne JSON en base -> Objet stdClass PHP
        'collection' => 'collection',      // Chaîne JSON en base -> Instance Illuminate\Support\Collection
        'options' => AsCollection::class,  // IDEM, mais via la classe de cast native
    ];
}
```

Utilisation :

```php
// Ce qu'il y a dans la BDD (Chaîne de caractères brute) : {"theme":"dark","notifications":true}

$user = User::find(1);

// En PHP, c'est vu comme un vrai tableau associatif
$user->settings;                    // ['theme' => 'dark', 'notifications' => true]
$user->settings['theme'];           // 'dark'

// Modification totale (Écrase tout)
$user->settings = ['theme' => 'light', 'notifications' => false];
$user->save();  // Eloquent reconvertit le tableau en chaîne JSON avant de sauvegarder !

// Mise à jour d'une seule valeur (Modification partielle)
// Important : Il faut redéclarer tout le tableau pour que le modèle détecte le changement
$settings = $user->settings;
$settings['language'] = 'fr';
$user->settings = $settings;
$user->save();
```

### Castings Chiffrés (Encrypted Casting)

Si vous stockez des données hautement sensibles, Laravel peut les chiffrer automatiquement en base.

```php
protected function casts(): array
{
    return [
        'secret' => 'encrypted',              // Chaîne de caractères chiffrée
        'api_keys' => 'encrypted:array',      // Tableau chiffré
        'token' => 'encrypted:collection',    // Collection chiffrée
        'credentials' => 'encrypted:object',  // Objet chiffré
    ];
}
```

Les données sont inintelligibles dans la base de données :

```php
$user->secret = 'ma-cle-api-secrete';  // Est hachée/chiffrée au moment du `save`
$user->secret;                         // Est déchiffrée magiquement à la lecture : "ma-cle-api-secrete"
```

### Castings Hachés (Hashed Casting) (Laravel 10+)

```php
protected function casts(): array
{
    return [
        'password' => 'hashed', // Utilise l'algorithme par défaut de l'application (ex: Bcrypt)
    ];
}
```

```php
$user->password = 'secret';  // Automatiquement haché !
// Plus besoin de faire manuellement : $user->password = Hash::make('secret');
```

## Casting avec les Énumérations PHP (Enums)

Depuis PHP 8.1, vous pouvez utiliser les Enums natifs. Eloquent s'interface parfaitement avec eux.

```php
// app/Enums/UserStatus.php
enum UserStatus: string
{
    case Pending = 'pending';
    case Active = 'active';
    case Suspended = 'suspended';
}
```

```php
// Dans le modèle User
protected function casts(): array
{
    return [
        'status' => UserStatus::class, // La colonne pointe vers l'Enum
    ];
}
```

Utilisation :

```php
$user = User::find(1);

$user->status;                           // Retourne l'instance UserStatus::Active
$user->status === UserStatus::Active;    // true
$user->status->value;                    // "active" (Valeur réelle en base)

// Définir à l'aide de l'Enum (Empêche de mettre une valeur invalide !)
$user->status = UserStatus::Suspended;

// Requêter la BDD
User::where('status', UserStatus::Active)->get();
```

## Classes de Cast Personnalisées (Custom Casts)

Si le cast désiré n'existe pas, vous pouvez créer le vôtre avec une classe dédiée. Idéal pour extraire la logique d'un Modèle.

```bash
php artisan make:cast Money
```

```php
<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;

// Doit implémenter l'interface CastsAttributes
class Money implements CastsAttributes
{
    public function __construct(
        protected string $currency = 'EUR' // Devise par défaut
    ) {}

    /**
     * Cast de la valeur (de la BDD vers PHP).
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): Money
    {
        return new Money(
            $value, // Le montant en centimes depuis la BDD
            $this->currency
        );
    }

    /**
     * Préparer la valeur pour le stockage (de PHP vers la BDD).
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): int
    {
        // Retourne la valeur en centimes à stocker en base
        return $value instanceof Money
            ? $value->cents
            : $value;
    }
}
```

Utilisation :

```php
protected function casts(): array
{
    return [
        // Utilisation du Custom Cast avec des paramètres
        'price' => Money::class . ':USD',
        'cost' => Money::class . ':EUR',
    ];
}
```

## Ressources

- [Le Casting d'Attributs (Attribute Casting)](https://laravel.com/docs/12.x/eloquent-mutators#attribute-casting) — Documentation officielle sur le Casting

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
