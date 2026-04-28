---
source_course: "vue-ssr-nuxt"
source_lesson: "vue-ssr-nuxt-file-based-routing"
---

# Le Routage Basé sur les Fichiers (La Magie Nuxt)

Nuxt crée automatiquement des routes en se basant sur la structure de fichiers dans le répertoire `pages/`. Pas de router.js, pas de `router.addRoute(...)`. Juste des fichiers.

## Les Routes Basiques

```
pages/
├── index.vue        → /
├── about.vue        → /about
├── contact.vue      → /contact
└── pricing.vue      → /pricing
```

## Les Routes Imbriquées (Nested)

```
pages/
├── users/
│   ├── index.vue    → /users
│   └── profile.vue  → /users/profile
└── blog/
    ├── index.vue    → /blog
    └── [slug].vue   → /blog/:slug  ← Dynamique !
```

## Les Routes Dynamiques (Les Crochets `[]`)

Utilisez des crochets pour les segments dynamiques :

```
pages/
├── users/
│   ├── index.vue      → /users
│   └── [id].vue       → /users/:id
└── posts/
    └── [slug].vue     → /posts/:slug
```

```vue
<!-- pages/users/[id].vue -->
<script setup>
const route = useRoute();
const userId = route.params.id; // '123' depuis /users/123
</script>

<template>
  <h1>Utilisateur {{ userId }}</h1>
</template>
```

## Les Routes "Attrape-Tout" (`[...slug]`)

```
pages/
└── [...slug].vue    → Correspond à n'importe quel chemin
```

```vue
<!-- pages/[...slug].vue -->
<script setup>
const route = useRoute();
// /docs/a/b/c → params.slug = ['a', 'b', 'c']
console.log(route.params.slug);
</script>
```

## Les Layouts Imbriqués avec Parent

```
pages/
└── users/
    ├── index.vue       → /users
    └── [id]/
        ├── index.vue   → /users/:id
        ├── posts.vue   → /users/:id/posts
        └── settings.vue → /users/:id/settings
```

Avec un layout parent :

```
pages/
└── users/
    ├── index.vue
    └── [id].vue         → Parent avec <NuxtPage />
        └── index.vue    → Enfant imbriqué
```

## La Navigation

### Le Composant NuxtLink

```vue
<template>
  <!-- Navigation interne -->
  <NuxtLink to="/">Accueil</NuxtLink>
  <NuxtLink to="/about">À Propos</NuxtLink>

  <!-- Avec params -->
  <NuxtLink :to="{ path: '/users/' + user.id }">
    {{ user.name }}
  </NuxtLink>

  <!-- Route nommée -->
  <NuxtLink :to="{ name: 'users-id', params: { id: user.id } }">
    {{ user.name }}
  </NuxtLink>

  <!-- Lien externe -->
  <NuxtLink to="https://vuejs.org" external> Vue.js </NuxtLink>
</template>
```

### Navigation Programmatique

```vue
<script setup>
const router = useRouter()

function allerVersUtilisateur(id: number) {
  router.push(`/users/${id}`)
}

function retour() {
  router.back()
}
</script>
```

### L'Utilitaire `navigateTo`

```vue
<script setup>
async function handleLogin() {
  await login();
  // Fonctionne côté client ET serveur !
  await navigateTo("/dashboard");
}

// Avec options
await navigateTo("/login", {
  replace: true,
  redirectCode: 301, // Redirection permanente
});

// URL externe
await navigateTo("https://nuxt.com", {
  external: true,
});
</script>
```

## Les Métadonnées de Page

```vue
<!-- pages/about.vue -->
<script setup>
definePageMeta({
  title: "À Propos",
  layout: "default",
  middleware: "auth",
  keepalive: true,

  // Transition de page personnalisée
  pageTransition: {
    name: "page",
    mode: "out-in",
  },
});

// Head dynamique
useHead({
  title: "À Propos | Mon App",
  meta: [
    { name: "description", content: "En savoir plus sur notre entreprise" },
  ],
});
</script>
```

## Les Grimoires De Tests

- [Le Routage Nuxt (Guide Officiel)](https://nuxt.com/docs/getting-started/routing)

---

> 📘 _Cette leçon fait partie du cours [Vue SSR & Nuxt](/vue/vue-ssr-nuxt/) sur la plateforme d'apprentissage RostoDev._
