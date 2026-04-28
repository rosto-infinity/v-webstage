---
source_course: "vue-ssr-nuxt"
source_lesson: "vue-ssr-nuxt-usefetch-useasyncdata"
---

# `useFetch` et `useAsyncData` : La Récupération de Données SSR-Ready

Nuxt fournit des composables pour récupérer des données qui fonctionnent parfaitement avec le SSR. Fini les appels API qui échouent côté serveur !

## useFetch : La Méthode Principale

```vue
<script setup>
// Récupère côté serveur ET côté client, sans doublon !
const { data, pending, error, refresh } = await useFetch("/api/users");
</script>

<template>
  <div v-if="pending">Chargement...</div>
  <div v-else-if="error">Erreur : {{ error.message }}</div>
  <ul v-else>
    <li v-for="user in data" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

## Les Options de useFetch

```vue
<script setup>
const { data } = await useFetch("/api/users", {
  // Méthode HTTP
  method: "POST",

  // Corps de la requête
  body: { name: "Jean" },

  // Paramètres de query (?page=1&limit=10)
  query: { page: 1, limit: 10 },

  // Headers
  headers: { Authorization: "Bearer token" },

  // Transformer la réponse
  transform: (response) => response.data,

  // Ne choisir que certains champs
  pick: ["id", "name", "email"],

  // Valeur par défaut (évite le null initial)
  default: () => [],

  // Clé de cache
  key: "users-list",

  // Serveur uniquement (pas de fetch côté client)
  server: true,

  // Lazy (ne bloque pas la navigation)
  lazy: true,

  // Immédiat (fetch au montage)
  immediate: true,

  // Re-fetche quand ces refs changent
  watch: [page, filter],
});
</script>
```

## useAsyncData : Pour les Opérations Async Personnalisées

```vue
<script setup>
const { data: user } = await useAsyncData("user", () => {
  return $fetch(`/api/users/${route.params.id}`);
});

// Avec options
const { data: posts } = await useAsyncData("posts", () => fetchPosts(), {
  transform: (posts) => posts.filter((p) => p.published),
  default: () => [],
});
</script>
```

## Le Lazy Fetching (Ne Pas Bloquer La Navigation)

```vue
<script setup>
// useLazyFetch - ne bloque PAS la navigation
const { data, pending } = useLazyFetch("/api/posts");

// useLazyAsyncData
const { data: comments } = useLazyAsyncData("comments", fetchComments);
</script>

<template>
  <div v-if="pending">Chargement des posts...</div>
  <PostList v-else :posts="data" />
</template>
```

## Rafraîchir les Données

```vue
<script setup>
const { data, refresh, pending } = await useFetch("/api/users");

// Rafraîchissement manuel
async function handleRefresh() {
  await refresh();
}

// Vider le cache et re-fetcher
await refresh({ dedupe: true });
</script>

<template>
  <button @click="handleRefresh" :disabled="pending">
    {{ pending ? "Rafraîchissement..." : "Rafraîchir" }}
  </button>
</template>
```

## Surveiller les Changements

```vue
<script setup>
const page = ref(1);
const category = ref("all");

const { data: products } = await useFetch("/api/products", {
  query: { page, category },
  // Re-fetche automatiquement quand ces refs changent
  watch: [page, category],
});
</script>

<template>
  <select v-model="category">
    <option value="all">Tout</option>
    <option value="electronics">Électronique</option>
  </select>

  <button @click="page++">Page Suivante</button>
</template>
```

## La Gestion d'Erreurs

```vue
<script setup>
const { data, error } = await useFetch("/api/users");

if (error.value) {
  // Lancer une erreur Nuxt (affiche la page d'erreur)
  throw createError({
    statusCode: 404,
    message: "Utilisateurs introuvables",
  });
}
</script>

<template>
  <div v-if="error">
    <h2>Erreur</h2>
    <p>{{ error.message }}</p>
    <pre>{{ error.data }}</pre>
  </div>
</template>
```

## `$fetch` : Pour les Appels Non-Réactifs

```vue
<script setup>
// Pour des event handlers ou des besoins non-réactifs
async function createUser(userData: UserData) {
  const user = await $fetch('/api/users', {
    method: 'POST',
    body: userData
  })
  return user
}

async function deleteUser(id: number) {
  await $fetch(`/api/users/${id}`, {
    method: 'DELETE'
  })
}
</script>
```

## Le Cache

```vue
<script setup>
// Même clé = données partagées (cache)
const { data: user1 } = await useFetch("/api/user/1", { key: "user-1" });
const { data: user2 } = await useFetch("/api/user/1", { key: "user-1" });
// user1 et user2 partagent les mêmes données en cache

// Forcer un fetch frais (bypass du cache)
const { data: freshUser } = await useFetch("/api/user/1", {
  key: "user-1-fresh",
  getCachedData: () => null, // Ignore le cache
});
</script>
```

## Les Grimoires De Tests

- [La Récupération de Données Nuxt (Guide Officiel)](https://nuxt.com/docs/getting-started/data-fetching)

---

> 📘 _Cette leçon fait partie du cours [Vue SSR & Nuxt](/vue/vue-ssr-nuxt/) sur la plateforme d'apprentissage RostoDev._
