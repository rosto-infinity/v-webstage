---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-accessors-mutators"
---

# Accesseurs et Mutateurs (Accessors and Mutators)

Les accesseurs et les mutateurs vous permettent de transformer la valeur des attributs (colonnes) d'Eloquent au moment où vous les récupérez ou les définissez sur une instance de modèle. Ils sont parfaits pour formater les données de manière cohérente dans toute l'application.

## Définir des Accesseurs (Accessors)

Les accesseurs transforment les attributs lorsque vous les **récupérez** (get) depuis la base de données vers votre code PHP.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * Obtenir le nom complet de l'utilisateur (Propriété virtuelle).
     * Combine first_name et last_name.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }

    /**
     * Toujours retourner l'email en minuscules.
     * Prend la valeur brute issue de la BDD en paramètre.
     */
    protected function email(): Attribute
    {
        return Attribute::make(
            get: fn (string $value) => strtolower($value),
        );
    }

    /**
     * Formater la date de création (`created_at`) pour l'affichage public.
     */
    protected function createdAtFormatted(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->created_at->format('d/m/Y'),
        );
    }
}
```

### Utiliser les Accesseurs

Une fois défini avec la syntaxe `camelCase` (`fullName()`), vous y accédez en notation `snake_case` classique :

```php
$user = User::find(1);

// Si en base on a: first_name: "John", last_name: "Doe"
echo $user->full_name;  // Affiche : "John Doe"

// Bien que `$user->email` accède à la vraie colonne, notre accesseur intercepte la valeur !
echo $user->email;      // "john@example.com" (toujours en minuscules)

// Accesseur "virtuel" : La colonne `created_at_formatted` n'existe pas en BDD
echo $user->created_at_formatted;  // "15/01/2024"
```

## Définir des Mutateurs (Mutators)

Les mutateurs transforment les attributs lorsque vous les **définissez** (set) en PHP, avant qu'ils ne soient stockés en base de données.

```php
class User extends Model
{
    /**
     * Toujours stocker l'email en minuscules en base.
     */
    protected function email(): Attribute
    {
        return Attribute::make(
            // La valeur qu'on tente d'assigner est interceptée et manipulée
            set: fn (string $value) => strtolower($value),
        );
    }

    /**
     * Hasher automatiquement le mot de passe quand on l'assigne.
     */
    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => bcrypt($value),
        );
    }

    /**
     * Définir plusieurs vraies colonnes à partir d'une seule assignation "virtuelle".
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            set: function (string $value) {
                $parts = explode(' ', $value, 2);

                // Retourne un tableau Clé (colonne) => Valeur
                return [
                    'first_name' => $parts[0],
                    'last_name' => $parts[1] ?? '',
                ];
            },
        );
    }
}
```

### Utiliser les Mutateurs

```php
$user = new User;

// Intercepté par le mutateur `email`
$user->email = 'JOHN@EXAMPLE.COM';
// Sera stocké en base de données de manière propre : "john@example.com"

// Intercepté par le mutateur `password`
$user->password = 'secret';
// Sera stocké en base de manière sécurisée (hash Bcrypt)

// Manipule une propriété virtuelle pour remplir plusieurs vraies colonnes
$user->full_name = 'John Doe';
// En arrière-plan, cela fait : $user->first_name = "John", $user->last_name = "Doe"
```

## Accesseur et Mutateur Combinés

Il est très fréquent (et recommandé depuis Laravel 9) de combiner l'accesseur et le mutateur d'une même colonne dans une unique méthode `Attribute::make()`.

```php
protected function phoneNumber(): Attribute
{
    return Attribute::make(
        // Get : Formate pour l'affichage frontend : (555) 123-4567
        get: fn (string $value) => sprintf(
            '(%s) %s-%s',
            substr($value, 0, 3),
            substr($value, 3, 3),
            substr($value, 6)
        ),

        // Set : Nettoie tout sauf les chiffres avant sauvegarde en BDD : "5551234567"
        set: fn (string $value) => preg_replace('/[^0-9]/', '', $value),
    );
}
```

### À l'utilisation :

```php
$user->phone_number = '(555) 123-4567';
// Sera stocké purement en tant que : "5551234567"

echo $user->phone_number;
// Mais à la lecture, affichera : "(555) 123-4567"
```

## Mettre en Cache les Accesseurs Lourds

Pour les opérations complexes ou coûteuses (comme un appel HTTP ou un long calcul), vous pouvez demander à Laravel de "mettre en cache" le résultat de l'accesseur. Il ne s'exécutera ainsi qu'une seule fois par instance de modèle.

```php
protected function avatarUrl(): Attribute
{
    return Attribute::make(
        get: fn () => $this->calculateGravatarUrl(), // Exemple de tâche lourde
    )->shouldCache();  // Cache le résultat dans la mémoire de l'objet
}

// L'appel lourd ne se déclenche qu'une seule fois !
echo $user->avatar_url;  // Calcule et affiche
echo $user->avatar_url;  // Utilise instantanément la valeur du cache de l'instance
```

## Ajouter des Accesseurs virtuels lors des réponses JSON (API)

Les accesseurs "virtuels" (ceux pour qui `full_name` n'existe pas en tant que colonne réelle dans la base de données) ne seront pas renvoyés lors des réponses API (comme `$user->toArray()` ou `return $user;` en JSON). Pour corriger cela, il faut utiliser la propriété `$appends` :

```php
class User extends Model
{
    /**
     * Les accesseurs virtuels à inclure lors d'une sérialisation array/JSON.
     */
    protected $appends = ['full_name', 'avatar_url'];

    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }
}
```

Désormais :

```php
// En PHP Array
$user->toArray();
// ['id' => 1, 'first_name' => 'John', ..., 'full_name' => 'John Doe']

// Ou en renvoyant le modèle dans un contrôleur d'API
$user->toJson();
// {"id": 1, "first_name": "John", ..., "full_name": "John Doe"}
```

## Exemples Concrets (Devises et Formats)

Un cas classique consiste à manipuler les Prix en **Cents (Entiers)** dans la base de données pour éviter les problèmes d'arrondis des flottants, mais de manipuler des **Euros (Décimales)** dans le code côté PHP.

```php
class Product extends Model
{
    /**
     * Formater le prix avec le symbole devise. (Accesseur virtuel)
     */
    protected function priceFormatted(): Attribute
    {
        return Attribute::make(
            get: fn () => number_format($this->price / 100, 2, ',', ' ') . ' €',
        );
    }

    /**
     * Conversion automatique Cents <-> Euros (Accesseur/Mutateur réel)
     */
    protected function price(): Attribute
    {
        return Attribute::make(
            get: fn (int $value) => $value / 100,  // Cents vers Euros (2599 => 25.99)
            set: fn (float $value) => $value * 100, // Euros vers Cents (25.99 => 2599)
        );
    }
}

class Post extends Model
{
    /**
     * Génère un extrait automatique à partir du corps de l'article.
     */
    protected function excerpt(): Attribute
    {
        return Attribute::make(
            get: fn () => Str::limit(strip_tags($this->body), 150),
        );
    }

    /**
     * Calcule le temps de lecture estimé.
     */
    protected function readingTime(): Attribute
    {
        return Attribute::make(
            get: function () {
                $words = str_word_count(strip_tags($this->body));
                $minutes = ceil($words / 200);  // Un adulte lit environ 200 mots/minute
                return "{$minutes} min de lecture";
            },
        );
    }
}
```

## Ressources

- [Accesseurs et Mutateurs](https://laravel.com/docs/12.x/eloquent-mutators#accessors-and-mutators) — Documentation officielle sur la modification des attributs Eloquent

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
