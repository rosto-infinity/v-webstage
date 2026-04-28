# Gestion des Conflits de Routes Wayfinder avec Spatie Permissions

Ce document explique comment résoudre un problème spécifique de dépendance circulaire lors de l'utilisation de **Laravel Wayfinder** avec **Spatie Laravel Permission** dans une stack VILT (Vue, Inertia, Laravel, Tailwind).

## Le Problème

Lorsqu'on structure les routes d'administration pour gérer les rôles et permissions, il est tentant d'utiliser une convention de nommage comme celle-ci :

```php
// routes/admin-permissions.php (AVANT - CAUSE DE L'ERREUR)

Route::prefix('admin/permissions')
    ->name('admin.permissions.') // Le préfixe du groupe est 'admin.permissions.'
    ->group(function () {
        // ...
        // La ressource 'permissions' crée des routes comme 'admin.permissions.permissions.index'
        // Mais si on l'appelle juste 'permissions' dans un groupe 'admin.permissions'
        // Wayfinder peut s'embrouiller dans la génération des types TS.
        Route::resource('permissions', PermissionController::class);
    });
```

### Symptôme

Lors de la compilation avec `npm run build` ou `npm run dev`, Wayfinder génère des fichiers TypeScript pour les routes. Si le nom du groupe de routes (ex: `permissions`) est identique au nom d'une ressource enfant (ex: `permissions`), Wayfinder génère un fichier `index.ts` qui contient une **référence circulaire** ou un conflit de nom de variable :

```typescript
// Erreur typique dans resources/js/routes/admin/permissions/index.ts
import permissions from './permissions'; // Le sous-dossier
// ...
const permissions = { ... }; // La variable du groupe => CONFLIT !
```

Cela empêche le build de se terminer correctement.

## La Solution

La solution la plus propre et durable est d'éviter ce conflit de nommage en **renommant le groupe de routes parent**.

Au lieu d'appeler le groupe `admin.permissions`, utilisez un terme plus générique comme `admin.security`, `admin.access` ou `admin.authorization`.

### 1. Renommer le Groupe de Routes

Modifiez votre fichier de routes (ex: `routes/admin-permissions.php` ou `routes/web.php`) :

```php
// routes/admin-permissions.php (APRÈS - CORRIGÉ)

Route::middleware(['auth', 'verified', 'role:superadmin'])
    ->prefix('admin/security') // Nouveau préfixe URL
    ->name('admin.security.')  // Nouveau préfixe de nom
    ->group(function () {

        // Les routes s'appelleront maintenant :
        // admin.security.permissions.index
        // admin.security.roles.index

        Route::resource('permissions', PermissionController::class);

        Route::prefix('roles')->name('roles.')->group(function () {
             Route::resource('/', RoleController::class);
        });

        // ...
    });
```

### 2. Mettre à jour les Contrôleurs

Mettez à jour les redirections dans vos contrôleurs pour utiliser les nouveaux noms de routes :

```php
// PermissionController.php
return redirect()->route('admin.security.index');

// RoleController.php
return redirect()->route('admin.security.roles.index');
```

### 3. Mettre à jour le Frontend (Vue.js)

Mettez à jour vos imports et vos liens `<Link>` dans vos composants Vue.

**Imports Wayfinder :**

```javascript
// AVANT
import { index } from '@/routes/admin/permissions';

// APRÈS
import { index } from '@/routes/admin/security';
```

**Liens Inertia :**

```html
<!-- AVANT -->
<Link href="/admin/permissions/roles">Rôles</Link>

<!-- APRÈS -->
<Link href="/admin/security/roles">Rôles</Link>
```

## Pourquoi cette approche ?

Cette approche évite d'avoir à exécuter des scripts de "fix" manuels après chaque génération de routes. Elle suit les conventions de Wayfinder en garantissant que la structure des dossiers générés (basée sur les noms de routes) ne crée pas de collisions entre un dossier et un fichier d'index portant le même nom importé comme variable.
