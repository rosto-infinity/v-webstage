---
source_course: "laravel-authentication"
source_lesson: "laravel-authentication-roles-permissions"
---

# Implémenter des Rôles et des Permissions

Bien que l'autorisation de base fonctionne bien pour les petits projets, construire un système de Contrôle d'Accès Basé sur les Rôles (RBAC - Role-Based Access Control) flexible est vital pour les grosses applications.

_Note : Beaucoup utilisent l'excellent paquet `Spatie/laravel-permission` pour cela, mais il est tout à fait possible de le coder soi-même proprement._

## Système de Rôles de Base

### Structure de la Base de Données

```php
// Fichier de migration : create_roles_table
Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();       // Ex: 'admin', 'editor' (Nom machine)
    $table->string('display_name');         // Ex: 'Administrateur', 'Éditeur' (Nom lisible)
    $table->text('description')->nullable();
    $table->timestamps();
});

// Fichier de migration : create_role_user_table (Table Pivot / Many-to-Many)
Schema::create('role_user', function (Blueprint $table) {
    $table->foreignId('role_id')->constrained()->cascadeOnDelete();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->primary(['role_id', 'user_id']); // Clé primaire composite
});
```

### Modèles (Models)

```php
// app/Models/Role.php
class Role extends Model
{
    protected $fillable = ['name', 'display_name', 'description'];

    // Un rôle appartient à plusieurs utilisateurs
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}

// app/Models/User.php
class User extends Authenticatable
{
    // Un utilisateur possède plusieurs rôles
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Vérifie si l'utilisateur possède un rôle spécifique.
     */
    public function hasRole(string $role): bool
    {
        return $this->roles()->where('name', $role)->exists();
    }

    /**
     * Vérifie si l'utilisateur possède AU MOINS UN des rôles listés.
     */
    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('name', $roles)->exists();
    }

    /**
     * Assigne un rôle à l'utilisateur.
     */
    public function assignRole(string $role): void
    {
        $roleInfo = Role::where('name', $role)->firstOrFail();
        // syncWithoutDetaching empêche les doublons sans retirer les rôles existants
        $this->roles()->syncWithoutDetaching($roleInfo);
    }

    /**
     * Retire un rôle à l'utilisateur.
     */
    public function removeRole(string $role): void
    {
        $roleInfo = Role::where('name', $role)->firstOrFail();
        $this->roles()->detach($roleInfo);
    }
}
```

### Utiliser ces Rôles dans les Gates

```php
// Dans AppServiceProvider

// Autoriser le "Super Admin" à tout faire, tout le temps
Gate::before(function (User $user, string $ability) {
    if ($user->hasRole('super-admin')) {
        return true;
    }
});

// Définir des permissions spécifiques basées sur les rôles
Gate::define('manage-users', function (User $user) {
    return $user->hasAnyRole(['admin', 'super-admin']); // Seuls eux peuvent gérer les membres
});

Gate::define('edit-articles', function (User $user) {
    return $user->hasAnyRole(['editor', 'admin', 'super-admin']);
});
```

## Niveau Avancé : Le Système de Permissions

Pour plus de flexibilité (laisser chaque rôle avoir une liste de droits configurables), on rajoute la couche "Permissions".

### Structure de la BDD pour les Permissions

```php
// Table permissions
Schema::create('permissions', function (Blueprint $table) {
    $table->id();
    $table->string('name')->unique();  // Ex: 'posts.create', 'users.delete' (La syntaxe Moteur.Action est conseillée)
    $table->string('display_name');    // Ex: 'Créer des articles'
    $table->timestamps();
});

// Table Pivot Rôle-Permission (Un Rôle a beaucoup de Permissions)
Schema::create('permission_role', function (Blueprint $table) {
    $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
    $table->foreignId('role_id')->constrained()->cascadeOnDelete();
    $table->primary(['permission_id', 'role_id']);
});
```

### Modèles des Permissions

```php
// Modèle Permission
class Permission extends Model
{
    protected $fillable = ['name', 'display_name'];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }
}

// Mise à jour du Modèle Role
class Role extends Model
{
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    // Vérifie si le Rôle possède la Permission demandée
    public function hasPermission(string $permission): bool
    {
        return $this->permissions()->where('name', $permission)->exists();
    }
}
```

### Méthodes dans `User` pour les Permissions

Savoir si l'Utilisateur a une permission nécessite de vérifier les permissions de _tous_ ses Rôles.

```php
class User extends Authenticatable
{
    /**
     * Récupère de manière aplatie (flat) TOUTES les permissions de l'utilisateur.
     */
    public function permissions(): Collection
    {
        return $this->roles
            ->flatMap(fn ($role) => $role->permissions)
            ->unique('id'); // Retire les doublons (si l'utilisateur a 2 rôles ayant la même permission)
    }

    /**
     * Vérifie si l'utilisateur possède la permission globale demandée.
     */
    public function hasPermission(string $permission): bool
    {
        // On cherche dans la collection extraite plus haut
        return $this->permissions()->contains('name', $permission);
    }
}
```

### Intégration Dynamique aux Gates !

Voici la magie ultime : Enregistrer dynamiquement toutes les Permissions de la BDD en tant que Gates !

```php
// Dans AppServiceProvider

public function boot(): void
{
    // 1. Lire TOUTES les permissions de la BDD et créer une Gate pour chacune
    Permission::all()->each(function ($permission) {
        Gate::define($permission->name, function (User $user) use ($permission) {
            return $user->hasPermission($permission->name);
        });
    });

    // 2. Et toujours, le passe-partout du Super Admin
    Gate::before(function (User $user, string $ability) {
        if ($user->hasRole('super-admin')) {
            return true;
        }
    });
}
```

Vous pourrez alors utiliser `Gate::authorize('posts.create')` ou `@can('posts.create')` depuis n'importe où !

## Créer un Middleware de Rôle

Pour interdire l'accès à des Routes complètes par Rôle.

```php
// Fichier: app/Http/Middleware/CheckRole.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        // Interdire si 1) Pas connecté ou 2) N'a aucun des rôles exigés
        if (! $request->user() || ! $request->user()->hasAnyRole($roles)) {
            abort(403, 'Accès Non Autorisé : Rôle Insuffisant.');
        }

        return $next($request);
    }
}
```

Enregistrez-le dans `bootstrap/app.php` :

```php
->withMiddleware(function (Middleware $middleware) {
    // Crée un alias court "role" pour notre middleware
    $middleware->alias([
        'role' => \App\Http\Middleware\CheckRole::class,
    ]);
})
```

Utilisation sur vos Routes Web / API :

```php
// Requiert un rôle précis
Route::get('/admin', AdminController::class)->middleware('role:admin');

// Accepte plusieurs rôles (Le middleware fonctionnera comme un "OU")
Route::get('/dashboard', DashboardController::class)
    ->middleware('role:admin,editor');
```

## Créer des Directives Blade Personnalisées

Pour le frontend, `@can` vérifie les Permissions, mais comment vérifier un `Rôle` directement ? Créez vos directives Blade !

```php
// Dans la méthode boot() de AppServiceProvider
use Illuminate\Support\Facades\Blade;

// Directive @role('nom-du-role')
Blade::if('role', function (string $role) {
    return auth()->check() && auth()->user()->hasRole($role);
});

// Directive optionnelle pour tester l'autre logique
Blade::if('permission', function (string $permission) {
    return auth()->check() && auth()->user()->hasPermission($permission);
});
```

Ensuite dans le code HTML/Blade :

```blade
@role('admin')
    <a href="/admin">Panneau d'Administration Restreint</a>
@endrole

@permission('posts.create')
    <a href="/posts/create">Rédiger un nouvel article</a>
@endpermission
```

## Mettre en Cache les Permissions (Optimisation Massive)

Étant donné que ces requêtes s'exécutent sur pratiquement chaque route, il est fortement déconseillé de les lire en base à chaque fois.

```php
class User extends Authenticatable
{
    /**
     * Mettre en cache la liste des permissions !
     */
    public function permissions(): Collection
    {
        // Sauvegarde le résultat pendant une heure en Redis/Fichier
        return Cache::remember(
            "user.{$this->id}.permissions",
            now()->addMinutes(60),
            fn () => $this->roles
                ->flatMap(fn ($role) => $role->permissions)
                ->unique('id')
        );
    }

    /**
     * Appeler cette fonction quand vous attribuez un nouveau rôle à ce user !
     */
    public function clearPermissionCache(): void
    {
        Cache::forget("user.{$this->id}.permissions");
    }
}
```

## Ressources

- [Autorisations Logiques (Authorization)](https://laravel.com/docs/12.x/authorization) — Documentation officielle de Laravel

---

> 📘 _Cette leçon fait partie du cours [Authentification et Autorisation Laravel](/laravel/laravel-authentication/) sur la plateforme d'apprentissage RostoDev._
