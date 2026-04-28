---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-what-is-eloquent"
---

# Qu'est-ce qu'Eloquent ORM ?

Eloquent est l'**Object-Relational Mapper (ORM)** de Laravel. Il fournit une implémentation ActiveRecord magnifique et simple pour interagir avec votre base de données, où chaque table de base de données correspond à une classe "Modèle" (Model).

## Qu'est-ce qu'un ORM ?

Un ORM associe (mappe) :

- **Les classes PHP** → Les tables de la base de données
- **Les propriétés des classes** → Les colonnes de la table
- **Les instances de classes** (objets) → Les lignes de la table

```
Classe PHP : User                   Table BDD : users
┌─────────────────────────┐        ┌────┬───────────┬─────────────────┐
│ class User extends Model │        │ id │ name      │ email           │
│ {                        │        ├────┼───────────┼─────────────────┤
│   // Propriétés mappées  │   ───► │ 1  │ "John"    │ "john@mail.com" │
│   // automatiquement     │        │ 2  │ "Jane"    │ "jane@mail.com" │
│ }                        │        └────┴───────────┴─────────────────┘
└─────────────────────────┘
```

## Pourquoi utiliser Eloquent ?

### L'approche SQL traditionnelle

```php
// Sans ORM - PDO ou SQL brut
$pdo = new PDO('mysql:host=localhost;dbname=app', 'root', 'password');
$stmt = $pdo->prepare('SELECT * FROM users WHERE id = ?');
$stmt->execute([1]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$name = $user['name']; // Accès via un tableau
```

### L'approche Eloquent

```php
// Avec Eloquent - élégant et simple
$user = User::find(1);
$name = $user->name; // Accès via une propriété d'objet
```

## Les avantages d'Eloquent

| Fonctionnalité                             | Avantage                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| **Syntaxe expressive**                     | Écriture d'un code de base de données lisible et intuitif                |
| **Relations**                              | Définir des données liées avec des méthodes simples                      |
| **Assignation de masse (Mass Assignment)** | Créer ou mettre à jour plusieurs champs de manière sécurisée             |
| **Suppression douce (Soft Deletes)**       | "Supprimer" des enregistrements sans effacer la donnée réelle            |
| **Événements & Observateurs**              | Se greffer sur les événements du cycle de vie du modèle                  |
| **Portées de requêtes (Query Scopes)**     | Contraintes de requêtes réutilisables                                    |
| **Mutateurs & Casts**                      | Transformer les données automatiquement lors de la lecture ou l'écriture |
| **Sérialisation**                          | Conversion facile en JSON ou tableaux (très utile pour les API)          |

## Votre Premier Modèle

Un modèle Eloquent simple :

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    // C'est tout ! Eloquent gère tout le reste.
}
```

Avec cette simple classe, vous pouvez déjà faire tout cela :

```php
// Créer (Create)
$post = Post::create(['title' => 'Bonjour', 'body' => '...']);

// Lire (Read)
$post = Post::find(1);
$posts = Post::all();
$posts = Post::where('published', true)->get();

// Mettre à jour (Update)
$post->title = 'Titre mis à jour';
$post->save();

// Supprimer (Delete)
$post->delete();
```

## Conventions d'Eloquent

Eloquent utilise des valeurs par défaut intelligentes basées sur des conventions :

### Noms de tables

```php
// Eloquent met le nom de la classe en minuscules et au pluriel (anglais)
class User extends Model {}      // Table : users
class Post extends Model {}      // Table : posts
class Category extends Model {}  // Table : categories (pluriel géré correctement)
class Person extends Model {}    // Table : people (pluriel irrégulier pris en charge)
```

### Clés primaires (Primary Keys)

```php
// Par défaut : utilise la colonne `id` comme entier auto-incrémenté
$user = User::find(1);  // Cherchera un User dont la colonne 'id' vaut 1
```

### Horodatages (Timestamps)

```php
// Par défaut : Laravel s'attend à trouver les colonnes `created_at` et `updated_at`.
// Elles sont gérées automatiquement par Eloquent à chaque création/modification.
$post->created_at;  // Retourne une instance de Carbon (librairie de gestion de date)
$post->updated_at;  // Retourne une instance de Carbon
```

## Le Dossier des Modèles

Les modèles sont stockés dans le dossier `app/Models/` :

```
app/Models/
├── User.php        # Modèle Utilisateur
├── Post.php        # Modèle Article
├── Comment.php     # Modèle Commentaire
└── Category.php    # Modèle Catégorie
```

## Modèle vs Constructeur de requêtes (Query Builder)

Eloquent est construit **par-dessus** le Constructeur de requêtes de Laravel (Query Builder) :

```php
// Query Builder - Retourne des objets génériques PHP stdClass
DB::table('users')->where('active', true)->get();

// Eloquent - Retourne des instances enrichies du modèle User
User::where('active', true)->get();
```

Les modèles Eloquent disposent de fonctionnalités supplémentaires très puissantes par rapport au simple Query Builder :

- Les relations (hasMany, belongsTo, etc.)
- Les événements et observateurs
- Les accesseurs et mutateurs
- Des options de sérialisation

## Ressources

- [Démarrer avec Eloquent](https://laravel.com/docs/12.x/eloquent) — Introduction officielle à Eloquent ORM

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
