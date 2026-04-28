---
source_course: "vue-ssr-nuxt"
source_lesson: "vue-ssr-nuxt-nuxt-overview"
---

# Qu'est-ce Que Nuxt ?

Nuxt est un framework construit sur Vue qui fournit le SSR, SSG, le routage basé sur les fichiers et de nombreuses améliorations de l'expérience développeur directement "out of the box".

## Pourquoi Nuxt ? (Le Vue Naked VS Le Vue Armé)

### Sans Nuxt (SSR Manuel, La Galère)

- Configurer webpack/Vite pour le SSR
- Mettre en place un serveur Node.js
- Gérer l'hydration manuellement
- Configurer le routage
- Gérer les balises `head`/`meta`
- Gérer la récupération de données
- Mettre en place l'environnement de développement

### Avec Nuxt (La Rolls)

- ✅ SSR/SSG/ISR configuré automatiquement
- ✅ Routage basé sur les fichiers
- ✅ Auto-imports (fini les `import` partout)
- ✅ Gestion `<head>` intégrée
- ✅ Composables de récupération de données (`useFetch`)
- ✅ Routes API côté serveur
- ✅ Support TypeScript natif
- ✅ Outils de développement intégrés

## Créer un Projet Nuxt

```bash
npx nuxi@latest init mon-app-nuxt
cd mon-app-nuxt
npm install
npm run dev
```

## La Structure du Projet

```
mon-app-nuxt/
├── .nuxt/              # Sortie du build (dans .gitignore)
├── assets/             # Assets non-compilés (Sass, images)
├── components/         # Composants Vue auto-importés
├── composables/        # Composables auto-importés
├── layouts/            # Composants de mise en page
├── middleware/         # Middleware de route
├── pages/              # Routes basées sur les fichiers ← LE CŒUR
├── plugins/            # Plugins Vue
├── public/             # Fichiers statiques
├── server/             # Routes & middleware côté serveur
│   ├── api/            # Points d'entrée API
│   └── middleware/     # Middleware serveur
├── utils/              # Utilitaires auto-importés
├── app.vue             # Composant racine
├── nuxt.config.ts      # La Config Nuxt
└── package.json
```

## Le Point d'Entrée de l'Application

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- `<NuxtLayout>` - Affiche le layout en cours
- `<NuxtPage>` - Affiche la page en cours

## La Configuration (nuxt.config.ts)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Activer les devtools
  devtools: { enabled: true },

  // Mode SSR (par défaut: true)
  ssr: true,

  // Modules
  modules: ["@nuxt/ui", "@pinia/nuxt", "@nuxtjs/tailwindcss"],

  // Config runtime
  runtimeConfig: {
    // Privé (serveur uniquement)
    apiSecret: "",
    // Public (client & serveur)
    public: {
      apiBase: "/api",
    },
  },

  // Config de l'app
  app: {
    head: {
      title: "Mon App Nuxt",
      meta: [{ name: "description", content: "Mon application incroyable" }],
    },
  },

  // Règles de routes (Le Rendu Hybride !)
  routeRules: {
    "/": { prerender: true },
    "/admin/**": { ssr: false },
  },
});
```

## Les Auto-Imports (Le Super-Pouvoir Nuxt)

Nuxt importe **automatiquement** les APIs Vue et ses propres composables :

```vue
<script setup>
// APIs Vue - auto-importées (pas besoin d'import !)
const count = ref(0);
const double = computed(() => count.value * 2);

// Composables Nuxt - auto-importés
const route = useRoute();
const { data } = await useFetch("/api/users");

// Vos composables dans /composables - auto-importés
const { user } = useAuth();
</script>
```

Plus besoin d'importer :

- La réactivité Vue (`ref`, `computed`, `watch`)
- Le cycle de vie Vue (`onMounted`, `onUnmounted`)
- Les composables Nuxt (`useFetch`, `useRoute`, `useState`)
- Vos composables dans `/composables`
- Vos utilitaires dans `/utils`
- Les composants dans `/components`

## Lancer Nuxt

```bash
# Développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Générer un site statique
npm run generate
```

## Les Grimoires De Tests

- [La Documentation Officielle Nuxt](https://nuxt.com/docs)

---

> 📘 _Cette leçon fait partie du cours [Vue SSR & Nuxt](/vue/vue-ssr-nuxt/) sur la plateforme d'apprentissage RostoDev._
