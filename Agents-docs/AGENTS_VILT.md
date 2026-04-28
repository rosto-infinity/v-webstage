# Règles de Développement - Stack VILT (Laravel 12 + Inertia + Vue 3 + Wayfinder)

Ce document définit les règles strictes de développement pour ce projet. **TOUS les agents et développeurs doivent suivre ces règles.**
les fichier a consulter sont :
maitrisez-le-nouveau-composant-form-dinertiajs-et-routes-avec-wayfinder-optimisez-vos-projets-laravel-avec-vue.md
AGENTS_VILT.md
AGENTS_VILT2.md
docs.scroll.md

## 1. Stack Technique

- **Backend**: Laravel 12 (PHP 8.3+)
- **Frontend**: Vue.js 3.5+ (Composition API, Script Setup, TypeScript)
- **Bridge**: Inertia.js v2.3
- **Routing**: Laravel Wayfinder (Strictement typé)
- **Styling**: Tailwind CSS v4

## 2. Palette de Couleurs Sémantique

Nous utilisons des variables CSS sémantiques définies dans `resources/css/app.css`. **N'utilisez jamais de couleurs "hardcodées"** (ex: `bg-white`, `text-black`). Utilisez toujours les variables sémantiques pour garantir la compatibilité Dark Mode.

### Structure Globale

| Variable Tailwind       | Rôle                                    | Utilisation Typique                           |
| :---------------------- | :-------------------------------------- | :-------------------------------------------- |
| `bg-background`         | Fond principal de l'application         | Le `<body>`, les pages entières.              |
| `text-foreground`       | Texte principal                         | Typographie par défaut, paragraphes.          |
| `bg-card`               | Conteneurs (cartes, panneaux, tableaux) | Blocs de contenu détachés du fond principal.  |
| `text-card-foreground`  | Texte dans les cartes                   | Titres et textes dans une `x-ui.card`.        |
| `bg-muted`              | Arrière-plans secondaires               | En-têtes de tableaux grisés, badgets neutres. |
| `text-muted-foreground` | Texte secondaire                        | Sous-titres, labels, textes d'aide.           |
| `border-border`         | Bordures génériques                     | Lignes de séparation, bordures de cartes.     |

RÈGLES STRICTES:
✅ declare(strict_types=1); au début
✅ Typage complet (paramètres + retours)
✅ Eloquent ORM (jamais DB::)
✅ Form Request pour validation
✅ Validation + Autorisation
✅ Routes nommées
✅ Eager loading
✅ PHPDoc documenté
✅ Vérifier fichiers adjacents
  
````

## Wayfinder Routes - Correction Automatique

### Problème de Référence Circulaire

Le fichier `resources/js/routes/admin/permissions/index.ts` généré par Wayfinder contient une référence circulaire :

```typescript
// ❌ Problème : 'permissions' est utilisé avant d'être défini
import permissions from './permissions'
const permissions = {
    permissions: Object.assign(permissions, permissions), // Erreur !
}
````

### Solution Automatique

Un script bash corrige automatiquement ce problème après chaque génération :

**Fichier** : `scripts/fix-permissions-routes.sh`

**Utilisation** :

```bash
# Après génération des routes
npm run fix-routes

# Ou combiné avec la génération
npm run routes:generate
```

**Correction appliquée** :

```typescript
// ✅ Solution : Renommer les imports pour éviter la collision
import permissionsSubRoutes from './permissions';
import rolesSubRoutes from './roles';
import usersSubRoutes from './users';

const permissionsRoutes = {
    index: Object.assign(index, index),
    permissions: Object.assign(permissionsSubRoutes, permissionsSubRoutes),
    roles: Object.assign(rolesSubRoutes, rolesSubRoutes),
    users: Object.assign(usersSubRoutes, usersSubRoutes),
};

export default permissionsRoutes;
```

## PHP

- Always use strict typing at the head of a `.php` file: `declare(strict_types=1);`.
- Always use curly braces for control structures, even if it has one line.

### Constructors

- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function \_\_construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations

- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments

- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex going on.

## PHPDoc Blocks

- Add useful array shape type definitions for arrays when appropriate.

## Enums

- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.

=== laravel/v12 rules ===

## Laravel 12

- Use the `search-docs` tool to get version specific documentation.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

### Laravel 12 Structure

- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php` for console configuration.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available and do not require manual registration.

### Database

- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 11 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models

- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.

---

=== tailwindcss/v4 rules ===

## Tailwind 4

- Always use Tailwind CSS v4 - do not use the deprecated utilities.
- `corePlugins` is not supported in Tailwind v4.
- In Tailwind v4, configuration is CSS-first using the `@theme` directive — no separate `tailwind.config.js` file is needed.
  <code-snippet name="Extending Theme in CSS" lang="css">
  @theme {
  --color-brand: oklch(0.72 0.11 178);
  }
  </code-snippet>

- In Tailwind v4, you import Tailwind using a regular CSS `@import` statement, not using the `@tailwind` directives used in v3:

<code-snippet name="Tailwind v4 Import Tailwind Diff" lang="diff">
   - @tailwind base;
   - @tailwind components;
   - @tailwind utilities;
   + @import "tailwindcss";
</code-snippet>

### Replaced Utilities

- Tailwind v4 removed deprecated utilities. Do not use the deprecated option - use the replacement.
- Opacity values are still numeric.

| Deprecated | Replacement |
|------------+--------------|
| bg-opacity-_ | bg-black/_ |
| text-opacity-_ | text-black/_ |
| border-opacity-_ | border-black/_ |
| divide-opacity-_ | divide-black/_ |
| ring-opacity-_ | ring-black/_ |
| placeholder-opacity-_ | placeholder-black/_ |
| flex-shrink-_ | shrink-_ |
| flex-grow-_ | grow-_ |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |

Laravel Wayfinder Logo
Introduction
Laravel Wayfinder bridges your Laravel backend and TypeScript frontend with zero friction. It automatically generates fully-typed, importable TypeScript functions for your controllers and routes — so you can call your Laravel endpoints directly in your client code just like any other function. No more hardcoding URLs, guessing route parameters, or syncing backend changes manually.

Important

Wayfinder is currently in Beta, the API is subject to change prior to the v1.0.0 release. All notable changes will be documented in the changelog.

Note

Want to try the next version of Wayfinder? You can find the beta here.

Installation
To get started, install Wayfinder via the Composer package manager:

composer require laravel/wayfinder
Next, install the Wayfinder Vite plugin to ensure that your routes are generated during Vite's build step and also whenever your files change while running the Vite's dev server.

First, install the plugin via NPM:

npm i -D @laravel/vite-plugin-wayfinder
Then, update your application's vite.config.js file to watch for changes to your application's routes and controllers:

import { wayfinder } from "@laravel/vite-plugin-wayfinder";

export default defineConfig({
plugins: [
wayfinder(),
// ...
],
});
You can read about all of the plugin's configuration options in the documentation.

Generating TypeScript Definitions
The wayfinder:generate command can be used to generate TypeScript definitions for your routes and controller methods:

php artisan wayfinder:generate
By default, Wayfinder generates files in three directories (wayfinder, actions, and routes) within resources/js, but you can configure the base path:

php artisan wayfinder:generate --path=resources/js/wayfinder
The --skip-actions and --skip-routes options may be used to skip TypeScript definition generation for controller methods or routes, respectively:

php artisan wayfinder:generate --skip-actions
php artisan wayfinder:generate --skip-routes
You can safely .gitignore the wayfinder, actions, and routes directories as they are completely re-generated on every build.

Usage
Wayfinder functions return an object that contains the resolved URL and default HTTP method:

import { show } from "@/actions/App/Http/Controllers/PostController";

show(1); // { url: "/posts/1", method: "get" }
If you just need the URL, or would like to choose a method from the HTTP methods defined on the server, you can invoke additional methods on the Wayfinder generated function:

import { show } from "@/actions/App/Http/Controllers/PostController";

show.url(1); // "/posts/1"
show.head(1); // { url: "/posts/1", method: "head" }
Wayfinder functions accept a variety of shapes for their arguments:

import { show, update } from "@/actions/App/Http/Controllers/PostController";

// Single parameter action...
show(1);
show({ id: 1 });

// Multiple parameter action...
update([1, 2]);
update({ post: 1, author: 2 });
update({ post: { id: 1 }, author: { id: 2 } });
Note

If you are using a JavaScript reserved word such as delete or import, as a method in your controller, Wayfinder will rename it to [method name]Method (deleteMethod, importMethod) when generating its functions. This is because these words are not allowed as variable declarations in JavaScript.

If you've specified a key for the parameter binding, Wayfinder will detect this and allow you to pass the value in as a property on an object:

import { show } from "@/actions/App/Http/Controllers/PostController";

// Route is /posts/{post:slug}...
show("my-new-post");
show({ slug: "my-new-post" });
Invokable Controllers
If your controller is an invokable controller, you may simply invoke the imported Wayfinder function directly:

import StorePostController from "@/actions/App/Http/Controllers/StorePostController";

StorePostController();
Importing Controllers
You may also import the Wayfinder generated controller definition and invoke its individual methods on the imported object:

import PostController from "@/actions/App/Http/Controllers/PostController";

PostController.show(1);
Note

In the example above, importing the entire controller prevents the PostController from being tree-shaken, so all PostController actions will be included in your final bundle.

Importing Named Routes
Wayfinder can also generate methods for your application's named routes as well:

import { show } from "@/routes/post";

// Named route is `post.show`...
show(1); // { url: "/posts/1", method: "get" }
Conventional Forms
If your application uses conventional HTML form submissions, Wayfinder can help you out there as well. First, opt into form variants when generating your TypeScript definitions:

php artisan wayfinder:generate --with-form
Then, you can use the .form variant to generate <form> object attributes automatically:

import { store, update } from "@/actions/App/Http/Controllers/PostController";

const Page = () => (
<form {...store.form()}>
{/_ <form action="/posts" method="post"> _/}
{/_ ... _/}
</form>
);

const Page = () => (
<form {...update.form(1)}>
{/_ <form action="/posts/1?_method=PATCH" method="post"> _/}
{/_ ... _/}
</form>
);
If your form action supports multiple methods and would like to specify a method, you can invoke additional methods on the form:

import { store, update } from "@/actions/App/Http/Controllers/PostController";

const Page = () => (
<form {...update.form.put(1)}>
{/_ <form action="/posts/1?_method=PUT" method="post"> _/}
{/_ ... _/}
</form>
);
Query Parameters
All Wayfinder methods accept an optional, final options argument to which you may pass a query object. This object can be used to append query parameters onto the resulting URL:

import { show } from "@/actions/App/Http/Controllers/PostController";

const options = {
query: {
page: 1,
sort_by: "name",
},
};

show(1, options); // { url: "/posts/1?page=1&sort_by=name", method: "get" }
show.get(1, options); // { url: "/posts/1?page=1&sort_by=name", method: "get" }
show.url(1, options); // "/posts/1?page=1&sort_by=name"
show.form.head(1, options); // { action: "/posts/1?page=1&sort_by=name&\_method=HEAD", method: "get" }
You can also merge with the URL's existing parameters by passing a mergeQuery object instead:

import { show } from "@/actions/App/Http/Controllers/PostController";

// window.location.search = "?page=1&sort_by=category&q=shirt"

const options = {
mergeQuery: {
page: 2,
sort_by: "name",
},
};

show.url(1, options); // "/posts/1?page=2&sort_by=name&q=shirt"
If you would like to remove a parameter from the resulting URL, define the value as null or undefined:

import { show } from "@/actions/App/Http/Controllers/PostController";

// window.location.search = "?page=1&sort_by=category&q=shirt"

const options = {
mergeQuery: {
page: 2,
sort_by: null,
},
};

show.url(1, options); // "/posts/1?page=2&q=shirt"
Wayfinder and Inertia
When using Inertia, you can pass the result of a Wayfinder method directly to the submit method of useForm, it will automatically resolve the correct URL and method:

https://inertiajs.com/forms#wayfinder

import { useForm } from "@inertiajs/react";
import { store } from "@/actions/App/Http/Controllers/PostController";

const form = useForm({
name: "My Big Post",
});

form.submit(store()); // Will POST to `/posts`...
You may also use Wayfinder in conjunction with Inertia's Link component:

https://inertiajs.com/links#wayfinder

import { Link } from "@inertiajs/react";
import { show } from "@/actions/App/Http/Controllers/PostController";

const Nav = () => <Link href={show(1)}>Show me the first post</Link>;
Contributing
Thank you for considering contributing to Wayfinder! You can read the contribution guide here.

Code of Conduct
In order to ensure that the Laravel community is welcoming to all, please review and abide by the Code of Conduct.

Security Vulnerabilities
Please review our security policy on how to report security vulnerabilities.

License

## 2. Règle D'OR : Routing avec Wayfinder

**INTERDIT**: Utiliser `route('nom.route')` ou des chaînes de caractères brutes pour les URLs.
**OBLIGATOIRE**: Utiliser les fonctions générées par Wayfinder.

### Pourquoi ?

Wayfinder génère des définitions TypeScript pour toutes les routes Laravel. Cela garantit que si une route change dans le backend, le build frontend échoue, prévenant les liens morts en production.

### Exemple Correct

```vue
<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
// Importez la route spécifique depuis le dossier généré
import { index, edit, destroy } from '@/routes/users';

const props = defineProps<{ user: User }>();
</script>

<template>
    <!-- Navigation -->
    <Link :href="index()">Liste des utilisateurs</Link>

    <!-- Avec paramètres -->
    <Link :href="edit(props.user.id)">Modifier</Link>

    <!-- Dans les méthodes script -->
    <button @click="router.delete(destroy(props.user.id))">Supprimer</button>
</template>
```

### Commandes Wayfinder

- Générer les routes : `php artisan wayfinder:generate`
- Watcher (dev) : `php artisan wayfinder:generate --watch`

---

## 3. Backend (Laravel 12)

### Contrôleurs & Inertia

- **Retour**: Toujours typer le retour : `public function index(): Response`
- **Données**: Passer des `Resource` (API Resources) et non des modèles bruts.
- **Partials**: Utiliser `Inertia::lazy()` pour les données lourdes si nécessaire.

```php
public function index(): Response
{
    return Inertia::render('Users/Index', [
        'users' => UserResource::collection(User::paginate(10)),
        'filters' => Request::only(['search', 'role']),
    ]);
}
```

### Form Requests

- **TOUJOURS** utiliser des Form Requests pour les opérations `store` et `update`.
- **Ne jamais** valider directement dans le contrôleur.

### Modèles

- Utiliser `$fillable` strictement.
- Définir les relations avec les types de retour (`: BelongsTo`).

---

## 4. Frontend (Vue 3 + Inertia)

### Structure des Fichiers

- `resources/js/pages/`: Pages Inertia (correspondent aux contrôleurs).
- `resources/js/components/`: Composants réutilisables (UI).
- `resources/js/layouts/`: Layouts principaux (AppLayout, GuestLayout).
- `resources/js/routes/`: **NE PAS TOUCHER** (Généré par Wayfinder).

### <script setup> (TypeScript)

Utiliser exclusivement `<script setup lang="ts">`. Ne jamais utiliser l'Options API.

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';

// Props typées
const props = defineProps<{
    user: User;
}>();

// Formulaire Inertia
const form = useForm({
    name: props.user.name,
    email: props.user.email,
});

const submit = () => {
    // Utilisation de Wayfinder pour l'URL
    import { update } from '@/routes/users';
    form.put(update(props.user.id), {
        onSuccess: () => form.reset(),
    });
};
</script>
```

### Inertia Utils

- Utiliser `Head` pour les titres de page.
- Utiliser `Link` pour la navigation interne (SPA).
- Utiliser `router` pour les actions manuelles (visites programmatiques).

---

## 5. Bonnes Pratiques Globales

1.  **Typage**: Tout doit être typé en TypeScript autant que possible.
2.  **Nommage**:
    - Classes PHP: PascalCase (`UserController`)
    - Fichiers Vue: PascalCase (`UserIndex.vue`)
    - Variables JS: camelCase (`userData`)
3.  **Refactoring**: Si vous changez le nom d'une route dans `web.php`, lancez `php artisan wayfinder:generate` immédiatement pour voir les erreurs TypeScript et corriger le frontend.

## 6. Résumé des Commandes

- `npm run dev`: Lance Vite + Wayfinder watcher (si configuré).
- `php artisan serve`: Serveur Laravel.
- `opencode`: Commande personnalisée (si installée) pour l'IDE.
  #Introduction
  Le nouveau composant <Form> d'Inertia.js révolutionne la gestion des formulaires en encapsulant le hook useForm et en automatisant le code répétitif. Il gère automatiquement la validation serveur, les erreurs, l'état de traitement et le téléchargement de fichiers, le tout sans rechargement de page. Cet article vous montre comment l'utiliser efficacement dans vos projets Laravel avec Vue.js.

#Sommaire
Prérequis techniques
Comprendre Wayfinder et la génération des routes
Concepts clés du composant Form
Création d'un formulaire
Modification avec formulaire
Propriétés et options essentielles
Bonnes pratiques
Conclusion
#1. Prérequis techniques
#Backend Laravel
Laravel 12 avec inertiajs/inertia-laravel ≥ v2.0.10
Routes resourceful et Form Request pour validation
laravel/wayfinder
Contrôleur RESTful
#Frontend Vue.js
Vue.js 3 avec Composition API
Inertiajs/vue3 version 2.1.0+
TypeScript configuré
#Route Laravel
Route::middleware(['auth', 'verified'])->group(function (): void {
Route::resource('students', StudentController::class);
});
#2. Comprendre Wayfinder et la génération des routes
#Qu'est-ce que Wayfinder?
Wayfinder est un package Laravel officiel qui génère automatiquement des helpers TypeScript pour vos routes Laravel côté frontend. Il élimine les URL codées en dur et garantit la synchronisation parfaite entre votre backend et frontend.

#Génération des routes
Wayfinder analyse vos routes Laravel et crée des helpers JavaScript/TypeScript:

// Route Laravel
Route::resource('students', StudentController::class);
Génère côté frontend:

// resources/js/routes/students/index.ts
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
url: index.url(options),
method: 'get',
})

index.definition = {
methods: ["get","head"],
url: '/students',
} satisfies RouteDefinition<["get","head"]>

export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
url: create.url(options),
method: 'get',
})

create.definition = {
methods: ["get","head"],
url: '/students/create',
} satisfies RouteDefinition<["get","head"]>
.
.
.

export const destroy = (args: { student: number | { id: number } } | [student: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
url: destroy.url(args, options),
method: 'delete',
})

destroy.definition = {
methods: ["delete"],
url: '/students/{student}',
}
#Intégration avec le composant Form
Au lieu d'écrire manuellement:

<Form action="/students" method="post">
Vous utilisez Wayfinder avec le pattern de liaison dynamique:

<Form v-bind="StudentController.store.form()">
    ou
    <Form :action="studentsRoutes.store.form().url">
Cette syntaxe se décompose ainsi:

StudentController.store correspond à la méthode store de votre contrôleur
.form() retourne un objet contenant { action: '/students', method: 'POST' }
v-bind distribue ces propriétés au composant Form
:action définit dynamiquement l'URL de soumission du formulaire
#Avantages de Wayfinder
Type Safety: TypeScript détecte les erreurs de routes à la compilation.

// ✅ Correct
StudentController.store.form()

// ❌ Erreur TypeScript
StudentController.stor.form() // Typo détectée
Paramètres dynamiques: Pour les routes avec paramètres:

<!-- Pour create/store: pas de paramètre -->
<Form v-bind="StudentController.store.form()">
 
<!-- Pour update: ID requis -->
<Form v-bind="StudentController.update.form(props.student.id)">
 
<!-- Pour delete: ID requis -->
<Link v-bind="StudentController.destroy.link(student.id)" method="delete">
Refactoring sécurisé: Si vous renommez une route Laravel, Wayfinder met à jour automatiquement les helpers et TypeScript vous alertera sur tous les usages obsolètes.

#Différence entre action manuelle et Wayfinder
Approche manuelle (sans Wayfinder):

<template>
    <!-- URL codée en dur, risque d'erreur -->
    <Form action="/students" method="post">
        <!-- Champs -->
    </Form>
 
    <!-- Pour update, vous devez construire l'URL manuellement -->
    <Form :action="`/students/${student.id}`" method="put">
        <!-- Champs -->
    </Form>
</template>
Problèmes:

URL codées en dur
Pas de vérification TypeScript
Erreurs difficiles à détecter
Maintenance complexe lors de changements de routes
Approche Wayfinder (recommandée):

<script setup lang="ts">
import StudentController from '@/actions/App/Http/Controllers/StudentController';
import type { Student } from '@/types/student';
 
interface Props {
    student?: Student;
}
const props = defineProps<Props>();
</script>

<template>
    <!-- Pour création -->
    <Form v-bind="StudentController.store.form()">
        <!-- Champs -->
    </Form>
 
    <!-- Pour mise à jour -->
    <Form v-bind="StudentController.update.form(props.student.id)">
        <!-- Champs -->
    </Form>
</template>
Avantages:

Type safety complet
Auto-complétion dans l'IDE
Détection des erreurs à la compilation
Maintenance simplifiée
#Structure des fichiers générés
resources/js/
├── actions/
│ └── App/
│ └── Http/
│ └── Controllers/
│ └── StudentController.ts
├── routes/
│ └── students/
│ └── index.ts
└── types/
└── student.ts
Le fichier StudentController.ts expose des méthodes correspondant aux actions de votre contrôleur:

export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
url: store.url(options),
method: 'post',
})

store.definition = {
methods: ["post"],
url: '/students',
} satisfies RouteDefinition<["post"]>

store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
url: store.url(options),
method: 'post',
})
.
.
.
#3. Concepts clés du composant Form
#Structure de base
Le composant nécessite deux attributs essentiels: action et method.

<Form action="/users" method="post">
  <input type="text" name="name" />
  <button type="submit">Créer</button>
</Form>
Point clé: Pas besoin de v-model, juste l'attribut name suffit. Le composant collecte automatiquement les valeurs.

#Accès à l'état via slot props

<Form action="/users" method="post" #default="{ errors, processing, wasSuccessful }">
  <input type="text" name="name" />
  <span v-if="errors.name">{{ errors.name }}</span>
 
  <button type="submit" :disabled="processing">
    {{ processing ? 'Création...' : 'Créer' }}
  </button>
</Form>
Propriétés disponibles:

errors: Erreurs de validation
processing: État de soumission
wasSuccessful: Succès de la dernière soumission
isDirty: Formulaire modifié
setError, clearErrors: Manipulation des erreurs
#Support des structures imbriquées

<Form action="/users" method="post">
  <input type="text" name="user.name" />
  <input type="text" name="address.street" />
  <input type="text" name="tags[]" />
</Form>
Génère automatiquement:

{
"user": { "name": "John" },
"address": { "street": "123 Main" },
"tags": ["tag1"]
}
#4. Création d'un formulaire
#Contrôleur Laravel
public function store(StudentRequest $request)
{
    $validated = $request->validated();
    $validated['profile'] = $this->handleProfileUpload($request);

    Student::create($validated);

    return redirect()->route('students.index')
        ->with('success', 'Étudiant créé avec succès.');

}
#Form Request
public function rules(): array
{
return [
'name' => ['required', 'string', 'max:255'],
'email' => ['required', 'email', 'unique:students'],
'profile' => ['nullable', 'image', 'max:2048'],
'bio' => ['nullable', 'string', 'max:500'],
];
}
#Composant Vue.js

<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import StudentController from '@/actions/App/Http/Controllers/StudentController';
import * as studentsRoute from '@/routes/students';
import type { Student } from '@/types/student';
 
interface Props {
    student?: Student | null;
}
defineProps<Props>();
</script>

<template>
    <Head title="Créer un étudiant" />
 
    <Form
        v-bind="StudentController.store.form()"
        enctype="multipart/form-data"
        v-slot="{ errors, processing }"
    >
        <div class="form-group">
            <label for="name">Nom complet</label>
            <input
                id="name"
                name="name"
                type="text"
            />
            <span v-if="errors.name" class="text-red-500">{{ errors.name }}</span>
        </div>
 
        <div class="form-group">
            <label for="email">Email</label>
            <input
                id="email"
                name="email"
                type="email"
            />
            <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
        </div>
 
        <div class="form-group">
            <label for="profile">Photo de profil</label>
            <input id="profile" name="profile" type="file" />
            <span v-if="errors.profile" class="text-red-500">{{ errors.profile }}</span>
        </div>
 
        <div class="form-group">
            <label for="bio">Biographie</label>
            <textarea id="bio" name="bio" :value="student?.bio"></textarea>
            <span v-if="errors.bio" class="text-red-500">{{ errors.bio }}</span>
        </div>
 
        <div class="form-actions">
            <Link :href="studentsRoute.index().url" class="btn-secondary">
                Retour
            </Link>
            <button type="submit" :disabled="processing" class="btn-primary">
              {{ processing ? "Ajout en cours... ": "Ajouter un étudiant" }}
            </button>
        </div>
    </Form>
</template>
Points clés:

v-bind="StudentController.store.form()": Génère automatiquement action et method via Wayfinder
enctype="multipart/form-data": Pour les uploads de fichiers
Pas de v-model
processing pour désactiver les boutons pendant la soumission
#5. Modification avec formulaire
#Contrôleur
public function update(StudentRequest $request, Student $student)
{
    $validated = $request->validated();
    $validated['profile'] = $this->handleProfileUpload($request, $student);

    $student->update($validated);

    return redirect()->route('students.index')
        ->with('success', 'Étudiant mis à jour.');

}
#Règles de validation avec ignore
public function rules(): array
{
$studentId = $this->route('student')?->id;

    return [
        'email' => ['required', 'email', Rule::unique('students')->ignore($studentId)],
        // Autres règles...
    ];

}
#Composant Vue.js

<script setup lang="ts">
import { Form, Head, Link } from '@inertiajs/vue3';
import StudentController from '@/actions/App/Http/Controllers/StudentController';
import type { Student } from '@/types/student';
 
interface Props {
    student: Student;
}
 defineProps<Props>();
</script>

<template>
    <Head title="Modifier un étudiant" />
 
    <Form
        v-bind="StudentController.update.form(props.student.id)"
        enctype="multipart/form-data"
        v-slot="{ errors, processing }"
    >
        <div class="form-group">
            <label for="name">Nom complet</label>
            <input id="name" name="name" type="text" :value="student.name" />
            <span v-if="errors.name" class="text-red-500">{{ errors.name }}</span>
        </div>
 
        <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" :value="student.email" />
            <span v-if="errors.email" class="text-red-500">{{ errors.email }}</span>
        </div>
 
        <div class="form-group">
            <label for="bio">Biographie</label>
            <textarea id="bio" name="bio" :value="student.bio"></textarea>
            <span v-if="errors.bio" class="text-red-500">{{ errors.bio }}</span>
        </div>
 
        <div class="form-actions">
            <button type="submit" :disabled="processing" class="btn-primary">
                <span v-if="processing">Enregistrement...</span>
                <span v-else>Mettre à jour</span>
            </button>
        </div>
    </Form>
</template>
Différences avec la création:

StudentController.update.form(props.student.id): Route dynamique avec ID
Méthode PUT et PATCH générée automatiquement par Wayfinder
Valeurs pré-remplies depuis props.student
#6. Propriétés et options essentielles
#Transform: Modifier les données avant soumission
La propriété transform vous permet de manipuler les données du formulaire juste avant leur envoi au serveur. Cette fonction intercepte les données collectées et retourne l'objet final qui sera soumis.

Cas d'usage courants:

Ajouter des champs cachés ou calculés
Formatter des dates ou des nombres
Nettoyer ou transformer des valeurs
Ajouter des métadonnées (timestamps, user_id, etc.)

<Form
  action="/posts"
  method="post"
  :transform="(data) => ({
    ...data,
    user_id: currentUser.id,
    timestamp: Date.now(),
    slug: data.title.toLowerCase().replace(/\s+/g, '-')
  })"
>
  <input type="text" name="title" />
  <textarea name="content"></textarea>
  <button type="submit">Publier</button>
</Form>
Exemple avec formatage de données:

<script setup>
const transformStudentData = (data) => {
  return {
    ...data,
    // Convertir le tableau en JSON si nécessaire
    programs: JSON.stringify(data.programs),
    // Formatter la date de naissance
    birth_date: data.birth_date ? new Date(data.birth_date).toISOString() : null,
    // Nettoyer les espaces
    name: data.name.trim(),
    email: data.email.toLowerCase().trim()
  };
};
</script>

<template>
  <Form action="/students" method="post" :transform="transformStudentData">
    <!-- Champs du formulaire -->
  </Form>
</template>
#Options de visite
Les options de visite contrôlent le comportement d'Inertia lors de la soumission du formulaire. Elles sont regroupées sous la propriété options pour éviter la confusion entre les propriétés de soumission et celles de rechargement.

<Form
  action="/profile"
  method="put"
  :options="{
    preserveScroll: true,
    preserveState: true,
    only: ['user', 'flash']
  }"
>
Explication des options principales:

preserveScroll (boolean): Maintient la position de défilement de la page après la soumission. Très utile pour les formulaires situés en milieu de page.

<!-- Idéal pour un formulaire de commentaire au milieu d'une longue page -->
<Form
  action="/comments"
  method="post"
  :options="{ preserveScroll: true }"
>
preserveState (boolean): Conserve l'état local des composants qui ne sont pas rechargés. Empêche la perte de données dans d'autres parties de votre interface.

<!-- Garde l'état d'un formulaire de recherche ouvert -->
<Form
  action="/profile/update"
  method="put"
  :options="{ preserveState: true }"
>
preserveUrl (boolean): Empêche la modification de l'URL du navigateur après la soumission. Utile pour les formulaires modaux ou les actions qui ne devraient pas changer l'URL.

<Form
  action="/newsletter/subscribe"
  method="post"
  :options="{ preserveUrl: true }"
>
replace (boolean): Remplace l'entrée actuelle de l'historique au lieu d'en créer une nouvelle. Évite que l'utilisateur ne revienne sur des états intermédiaires.

<Form
  action="/wizard/step-2"
  method="post"
  :options="{ replace: true }"
>
only (array): Ne recharge que les propriétés spécifiées depuis le serveur. Optimise les performances en réduisant la taille de la réponse.

<!-- Ne recharge que le profil utilisateur et les messages flash -->
<Form
  action="/profile"
  method="put"
  :options="{ only: ['user', 'flash'] }"
>
except (array): Exclut certaines propriétés du rechargement. Utile pour éviter de recharger des données volumineuses non affectées.

<!-- Ne pas recharger la liste des produits lors de la mise à jour du profil -->
<Form
  action="/profile"
  method="put"
  :options="{ except: ['products', 'categories'] }"
>
reset (array): Réinitialise des propriétés spécifiques à leurs valeurs par défaut après la visite.

<Form
  action="/search"
  method="get"
  :options="{ reset: ['page', 'filters'] }"
>
Exemple combiné complet:

<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import type { User } from '@/types';
 
interface Props {
  user: User;
}
const props = defineProps<Props>();
</script>

<template>
  <Form
    v-bind="ProfileController.update.form(props.user.id)"
    :options="{
      preserveScroll: true,        // Garde la position
      preserveState: true,         // Conserve l'état des autres composants
      only: ['user', 'flash'],     // Ne recharge que user et flash
      onSuccess: () => {
        // Callback après succès
        console.log('Profil mis à jour');
      }
    }"
  >
    <!-- Champs du formulaire -->
  </Form>
</template>
#Réinitialisation automatique
Les propriétés de réinitialisation automatisent le nettoyage des formulaires après soumission, améliorant l'expérience utilisateur.

resetOnSuccess: Réinitialise le formulaire après une soumission réussie.

<!-- Réinitialiser tous les champs - Idéal pour formulaires de création -->
<Form action="/users" method="post" resetOnSuccess>
  <input type="text" name="name" />
  <input type="email" name="email" />
  <button type="submit">Créer</button>
</Form>
Réinitialisation sélective: Ne réinitialise que certains champs spécifiques.

<!-- Réinitialiser uniquement le mot de passe après soumission -->
<Form action="/profile" method="put" :resetOnSuccess="['password', 'password_confirmation']">
  <input type="text" name="name" value="John Doe" />
  <input type="password" name="password" />
  <input type="password" name="password_confirmation" />
  <button type="submit">Mettre à jour</button>
</Form>
resetOnError: Réinitialise le formulaire en cas d'erreur. Moins courant mais utile pour certains cas.

<!-- Réinitialiser tout en cas d'erreur -->
<Form action="/payment" method="post" resetOnError>
  <input type="text" name="card_number" />
  <button type="submit">Payer</button>
</Form>
 
<!-- Réinitialiser des champs sensibles uniquement -->
<Form action="/payment" method="post" :resetOnError="['cvv', 'pin']">
  <input type="text" name="card_number" />
  <input type="text" name="cvv" />
  <button type="submit">Payer</button>
</Form>
setDefaultsOnSuccess: Définit les valeurs actuelles comme nouvelles valeurs par défaut après succès. Très utile pour les formulaires d'édition.

<Form action="/profile" method="put" setDefaultsOnSuccess>
  <input type="text" name="name" :value="user.name" />
  <input type="email" name="email" :value="user.email" />
  <button type="submit">Sauvegarder</button>
</Form>
Pourquoi c'est important: Sans setDefaultsOnSuccess, après avoir sauvegardé un formulaire d'édition, le formulaire serait marqué comme "modifié" (isDirty: true) même sans changement, car les valeurs par défaut seraient toujours les anciennes. Cette propriété synchronise les valeurs par défaut avec les nouvelles valeurs sauvegardées.

Exemple pratique combiné:

<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
 
const handleSuccess = () => {
  // Afficher une notification
  toast.success('Profil mis à jour avec succès');
};
</script>

<template>
  <!-- Formulaire d'édition avec mise à jour des valeurs par défaut -->
  <Form
    action="/profile"
    method="put"
    setDefaultsOnSuccess
    @success="handleSuccess"
  >
    <input type="text" name="name" :value="user.name" />
    <button type="submit">Sauvegarder</button>
  </Form>
 
  <!-- Formulaire de création avec réinitialisation complète -->
  <Form
    action="/posts"
    method="post"
    resetOnSuccess
    @success="handleSuccess"
  >
    <input type="text" name="title" />
    <textarea name="content"></textarea>
    <button type="submit">Publier</button>
  </Form>
 
  <!-- Formulaire sensible avec réinitialisation sélective -->
  <Form
    action="/password/update"
    method="put"
    :resetOnSuccess="['current_password', 'password', 'password_confirmation']"
  >
    <input type="password" name="current_password" />
    <input type="password" name="password" />
    <input type="password" name="password_confirmation" />
    <button type="submit">Changer le mot de passe</button>
  </Form>
</template>
#Désactivation pendant traitement
La propriété disable-while-processing ajoute automatiquement l'attribut HTML inert au formulaire pendant sa soumission. Cet attribut natif du navigateur désactive toutes les interactions avec le formulaire.

<Form
  action="/users"
  method="post"
  disable-while-processing
  class="inert:opacity-50 inert:pointer-events-none"
>
  <input type="text" name="name" />
  <button type="submit">Créer</button>
</Form>
Comment ça fonctionne:

L'utilisateur clique sur "Soumettre"
Le formulaire reçoit l'attribut inert
Tous les champs et boutons deviennent non interactifs
Les styles CSS s'appliquent automatiquement via le sélecteur :inert
Après la réponse du serveur, l'attribut inert est retiré
Styles CSS/Tailwind pour l'état inert:

<Form
  disable-while-processing
  class="
    inert:opacity-50
    inert:pointer-events-none
    inert:cursor-not-allowed
    transition-opacity duration-200
  "
>
Avantages:

Empêche les doubles soumissions
Feedback visuel immédiat pour l'utilisateur
Aucun JavaScript manuel nécessaire
Compatible avec tous les éléments du formulaire
Exemple avec indicateur de chargement personnalisé:

<script setup>
import { ref } from 'vue';
</script>

<template>
  <Form
    action="/users"
    method="post"
    disable-while-processing
    class="relative inert:opacity-70"
    v-slot="{ processing }"
  >
    <!-- Overlay de chargement -->
    <div
      v-if="processing"
      class="absolute inset-0 flex items-center justify-center bg-white/80 z-10"
    >
      <svg class="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>
 
    <input type="text" name="name" />
    <button type="submit" :disabled="processing">
      {{ processing ? 'Création...' : 'Créer' }}
    </button>
  </Form>
</template>
#Événements
Le composant <Form> émet tous les événements du cycle de vie d'une visite Inertia. Ces événements permettent d'exécuter du code à différentes étapes de la soumission.

<Form
  action="/users"
  method="post"
  @before="handleBefore"
  @start="handleStart"
  @progress="handleProgress"
  @success="handleSuccess"
  @error="handleError"
  @finish="handleFinish"
  @cancel="handleCancel"
>
Description détaillée de chaque événement:

@before: Se déclenche avant l'envoi de la requête. Retourner false annule la soumission.

<script setup>
const handleBefore = (visit) => {
  // Validation personnalisée avant soumission
  if (!confirm('Êtes-vous sûr de vouloir continuer ?')) {
    return false; // Annule la soumission
  }
 
  // Logger l'action
  console.log('Formulaire sur le point d\'être soumis', visit);
};
</script>

<template>
  <Form action="/users" method="post" @before="handleBefore">
    <input type="text" name="name" />
  </Form>
</template>
. . .

La suite voir la Docs

#7. Bonnes pratiques
#1. Composant wrapper centralisé
Créez un composant wrapper pour centraliser la configuration commune de vos formulaires. Cela évite la répétition et facilite la maintenance.

<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
 
interface Props {
  action: string;
  method: string;
  preserveScroll?: boolean;
}
 
const props = withDefaults(defineProps<Props>(), {
  preserveScroll: true
});
</script>

<template>
  <Form
    :action="props.action"
    :method="props.method"
    :options="{ preserveScroll: props.preserveScroll }"
    disable-while-processing
    class="inert:opacity-50 inert:pointer-events-none transition-opacity"
  >
    <slot />
  </Form>
</template>
Utilisation:

<template>
  <AppForm action="/users" method="post">
    <input type="text" name="name" />
    <button type="submit">Créer</button>
  </AppForm>
</template>
Avantages:

Configuration DRY (Don't Repeat Yourself)
Styles et comportements cohérents dans toute l'application
Modifications centralisées faciles
#2. Composant de champ réutilisable
Encapsulez vos champs de formulaire dans des composants réutilisables incluant labels, erreurs et styles.

<script setup lang="ts">
interface Props {
  name: string;
  label: string;
  type?: string;
  error?: string;
  modelValue?: string;
  placeholder?: string;
  required?: boolean;
}
 
const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false
});
</script>

<template>
  <div class="form-group mb-4">
    <label
      :for="props.name"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
 
    <input
      :id="props.name"
      :name="props.name"
      :type="props.type"
      :value="props.modelValue"
      :placeholder="props.placeholder"
      :required="props.required"
      class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      :class="{ 'border-red-500': props.error }"
    />
 
    <span v-if="props.error" class="text-red-500 text-sm mt-1 block">
      {{ props.error }}
    </span>
  </div>
</template>
Utilisation:

<template>
  <Form v-bind="StudentController.store.form()" v-slot="{ errors }">
    <FormField
      name="name"
      label="Nom complet"
      :error="errors.name"
      :model-value="student?.name"
      placeholder="ex: Jean Dupont"
      required
    />
 
    <FormField
      name="email"
      label="Email"
      type="email"
      :error="errors.email"
      :model-value="student?.email"
      required
    />
 
    <button type="submit">Créer</button>
  </Form>
</template>
#3. Validation avant soumission
Implémentez une validation côté client avant d'envoyer la requête au serveur pour améliorer l'expérience utilisateur.

<script setup>
import { ref } from 'vue';
 
const localErrors = ref({});
 
const handleBefore = (event) => {
  localErrors.value = {};
 
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');
 
  // Validation email
  if (!email || !email.includes('@')) {
    localErrors.value.email = 'Format d\'email invalide';
  }
 
  // Validation mot de passe
  if (!password || password.length < 8) {
    localErrors.value.password = 'Le mot de passe doit contenir au moins 8 caractères';
  }
 
  // Annuler si erreurs
  if (Object.keys(localErrors.value).length > 0) {
    return false;
  }
 
  return true;
};
</script>

<template>
  <Form action="/users" method="post" @before="handleBefore" v-slot="{ errors }">
    <div class="form-group">
      <input type="email" name="email" />
      <span v-if="localErrors.email || errors.email" class="text-red-500">
        {{ localErrors.email || errors.email }}
      </span>
    </div>
 
    <div class="form-group">
      <input type="password" name="password" />
      <span v-if="localErrors.password || errors.password" class="text-red-500">
        {{ localErrors.password || errors.password }}
      </span>
    </div>
 
    <button type="submit">Créer</button>
  </Form>
</template>
Avantages:

Feedback immédiat sans attendre la réponse serveur
Réduit le nombre de requêtes inutiles
Meilleure expérience utilisateur
#4. Accès programmatique
Utilisez les refs pour contrôler le formulaire depuis l'extérieur ou déclencher des actions personnalisées.

<script setup>
import { ref } from 'vue';
import { Form } from '@inertiajs/vue3';
 
const formRef = ref();
const autoSaveEnabled = ref(true);
 
// Soumission manuelle
const submitForm = () => {
  if (formRef.value) {
    formRef.value.submit();
  }
};
 
// Réinitialisation manuelle
const resetForm = () => {
  if (formRef.value) {
    formRef.value.reset();
  }
};
 
// Auto-save toutes les 30 secondes
setInterval(() => {
  if (autoSaveEnabled.value && formRef.value) {
    formRef.value.submit();
  }
}, 30000);
</script>

<template>
  <div>
    <Form ref="formRef" action="/draft/save" method="post">
      <textarea name="content" rows="10"></textarea>
    </Form>
 
    <div class="actions mt-4 space-x-2">
      <button @click="submitForm" class="btn-primary">
        Sauvegarder maintenant
      </button>
 
      <button @click="resetForm" class="btn-secondary">
        Réinitialiser
      </button>
 
      <label class="inline-flex items-center">
        <input
          type="checkbox"
          v-model="autoSaveEnabled"
          class="mr-2"
        />
        Auto-save activé
      </label>
    </div>
  </div>
</template>
Cas d'usage:

Auto-save de brouillons
Soumission via raccourcis clavier
Validation personnalisée complexe
Intégration avec d'autres composants
#Conclusion
Le composant <Form> d'Inertia.js simplifie drastiquement la gestion des formulaires en éliminant le code répétitif. Avec Wayfinder pour la génération automatique des routes et la gestion intégrée des erreurs de validation, vous pouvez construire des formulaires robustes et maintenables en quelques lignes de code. Adoptez ces patterns pour optimiser vos projets Laravel avec Vue.js.

#Ressources officielles
Composant de formulaire
Wayfinder

Introduction
Laravel Wayfinder bridges your Laravel backend and TypeScript frontend with zero friction. It automatically generates fully-typed, importable TypeScript functions for your controllers and routes — so you can call your Laravel endpoints directly in your client code just like any other function. No more hardcoding URLs, guessing route parameters, or syncing backend changes manually.

Important

Wayfinder is currently in Beta, the API is subject to change prior to the v1.0.0 release. All notable changes will be documented in the changelog.

Note

Want to try the next version of Wayfinder? You can find the beta here.

Installation
To get started, install Wayfinder via the Composer package manager:

composer require laravel/wayfinder
Next, install the Wayfinder Vite plugin to ensure that your routes are generated during Vite's build step and also whenever your files change while running the Vite's dev server.

First, install the plugin via NPM:

npm i -D @laravel/vite-plugin-wayfinder
Then, update your application's vite.config.js file to watch for changes to your application's routes and controllers:

import { wayfinder } from "@laravel/vite-plugin-wayfinder";

export default defineConfig({
plugins: [
wayfinder(),
// ...
],
});
You can read about all of the plugin's configuration options in the documentation.

Generating TypeScript Definitions
The wayfinder:generate command can be used to generate TypeScript definitions for your routes and controller methods:

php artisan wayfinder:generate
By default, Wayfinder generates files in three directories (wayfinder, actions, and routes) within resources/js, but you can configure the base path:

php artisan wayfinder:generate --path=resources/js/wayfinder
The --skip-actions and --skip-routes options may be used to skip TypeScript definition generation for controller methods or routes, respectively:

php artisan wayfinder:generate --skip-actions
php artisan wayfinder:generate --skip-routes
You can safely .gitignore the wayfinder, actions, and routes directories as they are completely re-generated on every build.

Usage
Wayfinder functions return an object that contains the resolved URL and default HTTP method:

import { show } from "@/actions/App/Http/Controllers/PostController";

show(1); // { url: "/posts/1", method: "get" }
If you just need the URL, or would like to choose a method from the HTTP methods defined on the server, you can invoke additional methods on the Wayfinder generated function:

import { show } from "@/actions/App/Http/Controllers/PostController";

show.url(1); // "/posts/1"
show.head(1); // { url: "/posts/1", method: "head" }
Wayfinder functions accept a variety of shapes for their arguments:

import { show, update } from "@/actions/App/Http/Controllers/PostController";

// Single parameter action...
show(1);
show({ id: 1 });

// Multiple parameter action...
update([1, 2]);
update({ post: 1, author: 2 });
update({ post: { id: 1 }, author: { id: 2 } });
Note

If you are using a JavaScript reserved word such as delete or import, as a method in your controller, Wayfinder will rename it to [method name]Method (deleteMethod, importMethod) when generating its functions. This is because these words are not allowed as variable declarations in JavaScript.

If you've specified a key for the parameter binding, Wayfinder will detect this and allow you to pass the value in as a property on an object:

import { show } from "@/actions/App/Http/Controllers/PostController";

// Route is /posts/{post:slug}...
show("my-new-post");
show({ slug: "my-new-post" });
Invokable Controllers
If your controller is an invokable controller, you may simply invoke the imported Wayfinder function directly:

import StorePostController from "@/actions/App/Http/Controllers/StorePostController";

StorePostController();
Importing Controllers
You may also import the Wayfinder generated controller definition and invoke its individual methods on the imported object:

import PostController from "@/actions/App/Http/Controllers/PostController";

PostController.show(1);
Note

In the example above, importing the entire controller prevents the PostController from being tree-shaken, so all PostController actions will be included in your final bundle.

Importing Named Routes
Wayfinder can also generate methods for your application's named routes as well:

import { show } from "@/routes/post";

// Named route is `post.show`...
show(1); // { url: "/posts/1", method: "get" }
Conventional Forms
If your application uses conventional HTML form submissions, Wayfinder can help you out there as well. First, opt into form variants when generating your TypeScript definitions:

php artisan wayfinder:generate --with-form
Then, you can use the .form variant to generate <form> object attributes automatically:

import { store, update } from "@/actions/App/Http/Controllers/PostController";

const Page = () => (
<form {...store.form()}>
{/_ <form action="/posts" method="post"> _/}
{/_ ... _/}
</form>
);

const Page = () => (
<form {...update.form(1)}>
{/_ <form action="/posts/1?_method=PATCH" method="post"> _/}
{/_ ... _/}
</form>
);
If your form action supports multiple methods and would like to specify a method, you can invoke additional methods on the form:

import { store, update } from "@/actions/App/Http/Controllers/PostController";

const Page = () => (
<form {...update.form.put(1)}>
{/_ <form action="/posts/1?_method=PUT" method="post"> _/}
{/_ ... _/}
</form>
);
Query Parameters
All Wayfinder methods accept an optional, final options argument to which you may pass a query object. This object can be used to append query parameters onto the resulting URL:

import { show } from "@/actions/App/Http/Controllers/PostController";

const options = {
query: {
page: 1,
sort_by: "name",
},
};

show(1, options); // { url: "/posts/1?page=1&sort_by=name", method: "get" }
show.get(1, options); // { url: "/posts/1?page=1&sort_by=name", method: "get" }
show.url(1, options); // "/posts/1?page=1&sort_by=name"
show.form.head(1, options); // { action: "/posts/1?page=1&sort_by=name&\_method=HEAD", method: "get" }
You can also merge with the URL's existing parameters by passing a mergeQuery object instead:

import { show } from "@/actions/App/Http/Controllers/PostController";

// window.location.search = "?page=1&sort_by=category&q=shirt"

const options = {
mergeQuery: {
page: 2,
sort_by: "name",
},
};

show.url(1, options); // "/posts/1?page=2&sort_by=name&q=shirt"
If you would like to remove a parameter from the resulting URL, define the value as null or undefined:

import { show } from "@/actions/App/Http/Controllers/PostController";

// window.location.search = "?page=1&sort_by=category&q=shirt"

const options = {
mergeQuery: {
page: 2,
sort_by: null,
},
};

show.url(1, options); // "/posts/1?page=2&q=shirt"
Wayfinder and Inertia
When using Inertia, you can pass the result of a Wayfinder method directly to the submit method of useForm, it will automatically resolve the correct URL and method:

https://inertiajs.com/forms#wayfinder

import { useForm } from "@inertiajs/react";
import { store } from "@/actions/App/Http/Controllers/PostController";

const form = useForm({
name: "My Big Post",
});

form.submit(store()); // Will POST to `/posts`...
You may also use Wayfinder in conjunction with Inertia's Link component:

https://inertiajs.com/links#wayfinder

import { Link } from "@inertiajs/react";
import { show } from "@/actions/App/Http/Controllers/PostController";

const Nav = () => <Link href={show(1)}>Show me the first post</Link>;
Contributing
Thank you for considering contributing to Wayfinder! You can read the contribution guide here.

Code of Conduct
In order to ensure that the Laravel community is welcoming to all, please review and abide by the Code of Conduct.

Security Vulnerabilities
Please review our security policy on how to report security vulnerabilities.

License
Wayfinder is open-sourced software licensed under the MIT license.
