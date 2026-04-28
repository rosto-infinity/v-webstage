---
source_course: "laravel-eloquent-orm"
source_lesson: "laravel-eloquent-orm-one-to-one-relationships"
---

# Relations Un-à-Un (One-to-One)

Une relation de type un-à-un lie directement un enregistrement d'une table à un seul enregistrement d'une autre table. Par exemple, un Utilisateur (`User`) peut avoir un seul et unique Profil (`Profile`).

## Définir une relation Un-à-Un

### `hasOne` (Côté Parent)

La table parent est celle qui ne stocke pas la clé étrangère.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class User extends Model
{
    /**
     * Obtenir le profil associé à l'utilisateur.
     */
    public function profile(): HasOne
    {
        // On indique à Eloquent : "L'utilisateur A UN profil"
        // Eloquent ira par défaut chercher un 'user_id' dans la table 'profiles'
        return $this->hasOne(Profile::class);
    }
}
```

### `belongsTo` (Côté Enfant)

La table enfant est celle qui stocke physiquement la clé étrangère.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Profile extends Model
{
    /**
     * Obtenir l'utilisateur auquel appartient ce profil.
     */
    public function user(): BelongsTo
    {
        // On indique à Eloquent : "Ce profil APPARTIENT À un utilisateur"
        // Eloquent utilisera la valeur de sa propre colonne 'user_id' pour trouver l'utilisateur.
        return $this->belongsTo(User::class);
    }
}
```

## Structure de la Base de Données

```text
users                          profiles
┌────┬──────────┐              ┌────┬─────────┬─────────────┐
│ id │ name     │              │ id │ user_id │ bio         │
├────┼──────────┤              ├────┼─────────┼─────────────┤
│ 1  │ "John"   │◄────────────│ 1  │ 1       │ "Développeur"│
│ 2  │ "Jane"   │◄────────────│ 2  │ 2       │ "Designer"   │
└────┴──────────┘              └────┴─────────┴─────────────┘
```

### Migration pour la table `profiles` (L'enfant)

```php
Schema::create('profiles', function (Blueprint $table) {
    $table->id();

    // foreignId() crée une colonne BIGINT UNSIGNED.
    // constrained() ajoute la contrainte de clé étrangère vers la table `users`.
    // cascadeOnDelete() supprimera automatiquement le profil si le user est supprimé.
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();

    $table->text('bio')->nullable();
    $table->string('website')->nullable();
    $table->string('location')->nullable();
    $table->timestamps();
});
```

## Utiliser la Relation

Vous pouvez accéder aux enregistrements liés comme s'il s'agissait de simples propriétés, grâce aux "Propriétés Dynamiques" (Dynamic Properties) d'Eloquent.

```php
// Accéder au profil depuis l'utilisateur
$user = User::find(1);
$profile = $user->profile;  // Retourne le modèle Profile ou null s'il n'en a pas

echo $user->profile->bio;   // Affiche : "Développeur"

// Accéder à l'utilisateur depuis le profil
$profile = Profile::find(1);
$user = $profile->user;     // Retourne le modèle User

echo $profile->user->name;  // Affiche : "John"
```

## Créer des Enregistrements Liés

Eloquent permet de créer facilement des objets en les associant automatiquement à leurs parents :

```php
$user = User::find(1);

// Méthode 1 : Créer en mémoire, puis sauvegarder via la relation
$profile = new Profile(['bio' => 'Développeur']);
$user->profile()->save($profile); // Associe $profile à $user (remplit user_id) ET sauvegarde

// Méthode 2 : Créer directement depuis la relation (le plus rapide)
$user->profile()->create([
    'bio' => 'Développeur'
]);

// Méthode 3 : Depuis le côté enfant (BelongsTo)
$profile = new Profile(['bio' => 'Développeur']);
$profile->user()->associate($user); // Remplit le champ user_id avec l'ID du User
$profile->save();                   // Sauvegarde manuelle requise avec associate()
```

## Personnaliser les Clés (Routage Non-Standard)

Si vous ne respectez pas les conventions de nommage de Laravel (`user_id`), vous pouvez spécifier explicitement les noms de colonnes :

```php
// Dans User (hasOne)
// Si la clé étrangère dans la table profiles s'appelle 'author_id' au lieu de 'user_id'
public function profile(): HasOne
{
    return $this->hasOne(Profile::class, 'author_id');
}

// Si en plus, la clé locale n'est pas 'id' mais 'user_uuid'
public function profile(): HasOne
{
    return $this->hasOne(Profile::class, 'user_id', 'user_uuid');
}

// Du côté BelongsTo (Profile)
// Si la clé étrangère locale est 'author_id'
public function user(): BelongsTo
{
    return $this->belongsTo(User::class, 'author_id');
}
```

## Modèle par Défaut (Null-Object Pattern)

Pour éviter les erreurs "Trying to get property of non-object" ou de devoir vérifier si la relation existe avec `?->`, vous pouvez retourner un modèle "vide" par défaut :

```php
public function profile(): HasOne
{
    // Retournera un nouveau profil instancié (non sauvegardé) si aucun n'existe en base
    return $this->hasOne(Profile::class)->withDefault();
}

// Optionnel : spécifier des valeurs par défaut pour ce modèle fantôme
public function profile(): HasOne
{
    return $this->hasOne(Profile::class)->withDefault([
        'bio' => 'Aucune biographie fournie',
    ]);
}

// Utilisation - Ne renvoie jamais null ni d'erreur
$user->profile->bio;  // Affiche "Aucune biographie fournie" si aucun profil n'existe
```

## Comprendre : `hasOne` (Avoir Un) vs `belongsTo` (Appartenir À)

Il est crucial de comprendre où placer chaque méthode :

```text
User (Parent)           Profile (Enfant)
┌─────────────┐         ┌─────────────────┐
│             │ hasOne  │                 │
│   User      │────────►│    Profile      │
│             │         │                 │
│             │◄────────│   Clé Étrangère │ (user_id est stocké ici)
│             │belongsTo│                 │
└─────────────┘         └─────────────────┘

- hasOne (A Un) : "Je possède un élément du type..." (L'utilisateur possède un Profil).
- belongsTo (Appartient À) : "J'appartiens à un élément du type..." (Le Profil appartient à un Utilisateur).
- Indice infaillible : La méthode belongsTo() se trouve TOUJOURS dans le modèle dont la table contient physiquement la colonne de la Clé Étrangère (Ex: la colonne `user_id` est dans la table `profiles`).
```

## Exemple Pratique

```php
// Dans un contrôleur
public function show(User $user)
{
    // ⚠️ Lazy loading (Chargement paresseux)
    // Cela fera 2 requêtes SQL distinctes à des moments différents :
    // 1 au moment de trouver le User, 1 au moment d'afficher son profil dans la vue.
    return view('users.show', [
        'user' => $user,
        'profile' => $user->profile,
    ]);

    // ✅ Meilleur (Eager loading - Chargement anticipé)
    // Cela ne fera qu'UNE SEULE requête SQL optimisée gérant la jointure/le IN.
    // Très important pour les performances réseau et BDD.
    $user = User::with('profile')->findOrFail($user->id);

    return view('users.show', compact('user'));
}
```

```blade
{{-- Dans Blade --}}
<h1>{{ $user->name }}</h1>
{{-- Utilisation de l'opérateur Nullsafe (?->) au cas où le profil n'existe pas,
     et du Null Coalescing (??) pour afficher une valeur par défaut. --}}
<p>{{ $user->profile?->bio ?? 'Aucune bio renseignée' }}</p>
```

## Ressources

- [Les Relations Un-à-Un](https://laravel.com/docs/12.x/eloquent-relationships#one-to-one) — Documentation officielle complète sur la relation Has-One

---

> 📘 _Cette leçon fait partie du cours [Laravel Eloquent ORM](/laravel/laravel-eloquent-orm/) sur la plateforme d'apprentissage RostoDev._
