---
source_course: "vue-ssr-nuxt"
source_lesson: "vue-ssr-nuxt-layouts-system"
---

# Le Système de Layouts de Nuxt

Les layouts enveloppent vos pages pour fournir une structure cohérente comme les headers, footers et navigations.

## Le Layout par Défaut

```vue
<!-- layouts/default.vue -->
<template>
  <div class="layout">
    <AppHeader />
    <main class="content">
      <slot />
      <!-- Le contenu de la page s'insère ici -->
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  padding: 2rem;
}
</style>
```

## Utiliser le Layout dans l'App

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

## Les Layouts Personnalisés

```vue
<!-- layouts/dashboard.vue -->
<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="dashboard-main">
      <DashboardHeader />
      <slot />
      <!-- Le contenu de la page du dashboard -->
    </div>
  </div>
</template>
```

Utilisation dans une page :

```vue
<!-- pages/dashboard/index.vue -->
<script setup>
definePageMeta({
  layout: "dashboard", // Le nom du fichier dans /layouts/
});
</script>

<template>
  <h1>Accueil du Dashboard</h1>
</template>
```

## Les Layouts Dynamiques

```vue
<script setup>
const route = useRoute();

// Désactiver le layout automatique
definePageMeta({
  layout: false,
});

const layoutName = computed(() => {
  return route.meta.isAdmin ? "admin" : "default";
});
</script>

<template>
  <NuxtLayout :name="layoutName">
    <h1>Page avec Layout Dynamique</h1>
  </NuxtLayout>
</template>
```

## Les Transitions de Layout

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.layout-enter-active,
.layout-leave-active {
  transition: opacity 0.3s;
}
.layout-enter-from,
.layout-leave-to {
  opacity: 0;
}
</style>
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    layoutTransition: { name: "layout", mode: "out-in" },
  },
});
```

## Les Named Slots dans les Layouts

```vue
<!-- layouts/with-sidebar.vue -->
<template>
  <div class="layout-with-sidebar">
    <aside class="sidebar">
      <slot name="sidebar" />
      <!-- Slot nommé pour la sidebar -->
    </aside>
    <main class="main">
      <slot />
      <!-- Slot par défaut pour le contenu principal -->
    </main>
  </div>
</template>
```

```vue
<!-- pages/docs.vue -->
<script setup>
definePageMeta({ layout: "with-sidebar" });
</script>

<template>
  <NuxtLayout>
    <template #sidebar>
      <nav>
        <NuxtLink to="/docs/intro">Introduction</NuxtLink>
        <NuxtLink to="/docs/setup">Installation</NuxtLink>
      </nav>
    </template>

    <h1>Contenu de la Documentation</h1>
  </NuxtLayout>
</template>
```

## Les Grimoires De Tests

- [Les Layouts Nuxt (Guide Officiel)](https://nuxt.com/docs/guide/directory-structure/layouts)

---

> 📘 _Cette leçon fait partie du cours [Vue SSR & Nuxt](/vue/vue-ssr-nuxt/) sur la plateforme d'apprentissage RostoDev._
