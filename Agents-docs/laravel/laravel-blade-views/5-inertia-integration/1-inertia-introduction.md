---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-inertia-introduction"
---

# Introduction à Inertia.js

Inertia.js vous permet de construire des applications monopages modernes (SPA - Single Page Applications) en conservant le système de routage et les contrôleurs côté serveur classiques. Pas besoin de créer une API REST : connectez directement votre backend Laravel à votre frontend Vue ou React.

## Qu'est-ce qu'Inertia ?

Inertia, c'est la "colle" (le liant) entre votre backend Laravel et votre frontend JavaScript :

```
┌─────────────────────────────────────────────────────────────────┐
│                    SPA Traditionnelle (Classique)                │
│                                                                 │
│  Frontend (React/Vue)  ←─── API REST ───→  Backend (Laravel)    │
│       (routage client,                     (contrôleurs,        │
│        état/state,                          logique métier,     │
│        composants)                          base de données)    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Inertia.js                                    │
│                                                                 │
│  Frontend (React/Vue)  ←── Intertia ──→  Backend (Laravel)      │
│       (UNIQUEMENT les                    (contrôleurs,          │
│        composants visuels!)               routage serveur,      │
│                                           logique métier,       │
│                                           base de données)      │
└─────────────────────────────────────────────────────────────────┘
```

Avantages avec Inertia :

- Aucune API à concevoir, développer ou maintenir.
- Routage côté serveur (comme dans une application Laravel classique).
- Expérience utilisateur complète d'une SPA (navigation sans rechargement de page).
- Utilisation de composants modernes Vue ou React.
- Compatible avec le référencement (SEO) grâce au rendu côté serveur (SSR) disponible.

## Installation avec Laravel Breeze

La méthode la plus rapide et simple pour démarrer :

```bash
composer require laravel/breeze --dev
php artisan breeze:install

# L'assistant vous demandera de choisir votre pile technologique (stack) :
# [1] React avec Inertia
# [2] Vue avec Inertia
```

## Installation Manuelle

```bash
# Côté serveur (Laravel)
composer require inertiajs/inertia-laravel

# Côté client (Node/NPM)
npm install @inertiajs/vue3  # ou @inertiajs/react
```

## Comment ça Fonctionne

### Côté Serveur (Laravel)

```php
// routes/web.php
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
```

```php
// app/Http/Controllers/UserController.php
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // Inertia::render remplace view()
        // 1er arg: Le nom du composant Vue/React (ex: resources/js/Pages/Users/Index.vue)
        // 2ème arg: Les données à envoyer au composant (props)
        return Inertia::render('Users/Index', [
            'users' => User::all(),
        ]);
    }

    public function show(User $user)
    {
        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
        ]);

        User::create($validated);

        // Une redirection standard suffit; Inertia la gérera intelligemment côté client
        return redirect()->route('users.index');
    }
}
```

### Côté Client (Exemple avec Vue.js)

```vue
<!-- resources/js/Pages/Users/Index.vue -->
<script setup>
import { Link } from "@inertiajs/vue3";

// On déclare les props reçues depuis le contrôleur Laravel
defineProps({
  users: Array,
});
</script>

<template>
  <h1>Utilisateurs</h1>

  <Link href="/users/create">Créer un Utilisateur</Link>

  <ul>
    <li v-for="user in users" :key="user.id">
      <Link :href="`/users/${user.id}`">{{ user.name }}</Link>
    </li>
  </ul>
</template>
```

```vue
<!-- resources/js/Pages/Users/Show.vue -->
<script setup>
defineProps({
  user: Object,
});
</script>

<template>
  <h1>{{ user.name }}</h1>
  <p>{{ user.email }}</p>
</template>
```

## Le Composant Lien (<Link>)

Le composant `<Link>` d'Inertia remplace les balises `<a>` HTML standard pour permettre une navigation SPA (sans rechargement complet de la page) :

```vue
<script setup>
import { Link } from "@inertiajs/vue3";
</script>

<template>
  <!-- Lien basique -->
  <Link href="/users">Utilisateurs</Link>

  <!-- Changer la méthode HTTP (utile pour la déconnexion par exemple) -->
  <Link href="/logout" method="post" as="button">Déconnexion</Link>

  <!-- Conserver la position de défilement de la page -->
  <Link href="/users" preserve-scroll>Utilisateurs</Link>

  <!-- Envoyer des données avec la requête -->
  <Link href="/users" :data="{ page: 2 }">Page 2</Link>
</template>
```

## Les Formulaires

Utilisez l'assistant de formulaire (form helper) intégré à Inertia, qui gère nativement l'état de chargement et la récupération des erreurs de validation de Laravel :

```vue
<script setup>
import { useForm } from "@inertiajs/vue3";

const form = useForm({
  name: "",
  email: "",
});

const submit = () => {
  // Envoie la requête POST à Laravel
  form.post("/users");
};
</script>

<template>
  <!-- On empêche le comportement par défaut du navigateur (rechargement de page) -->
  <form @submit.prevent="submit">
    <div>
      <input v-model="form.name" placeholder="Nom" />
      <!-- form.errors contient automatiquement les erreurs de validation de Laravel -->
      <span v-if="form.errors.name">{{ form.errors.name }}</span>
    </div>

    <div>
      <input v-model="form.email" type="email" placeholder="Email" />
      <span v-if="form.errors.email">{{ form.errors.email }}</span>
    </div>

    <!-- Désactiver le bouton pendant l'envoi -->
    <button type="submit" :disabled="form.processing">
      {{
        form.processing ? "Enregistrement en cours..." : "Créer l'utilisateur"
      }}
    </button>
  </form>
</template>
```

## Données Partagées (Shared Data)

Vous pouvez partager des données avec absolument _toutes_ les pages de votre application via un middleware (par exemple, l'utilisateur connecté ou des messages flash) :

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        // L'utilisateur authentifié
        'auth' => [
            'user' => $request->user(),
        ],
        // Les messages flash de session
        'flash' => [
            'success' => $request->session()->get('success'),
            'error' => $request->session()->get('error'),
        ],
    ]);
}
```

Pour y accéder dans n'importe quel composant côté client :

```vue
<script setup>
import { usePage } from "@inertiajs/vue3";

// On récupère la page entière et ses props
const page = usePage();
const user = page.props.auth.user;
const flash = page.props.flash;
</script>

<template>
  <div v-if="flash.success" class="alert-success">
    {{ flash.success }}
  </div>

  <p v-if="user">Bienvenue, {{ user.name }}</p>
</template>
```

## Ressources

- [Documentation Inertia.js](https://inertiajs.com/) — Documentation officielle d'Inertia.js

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
