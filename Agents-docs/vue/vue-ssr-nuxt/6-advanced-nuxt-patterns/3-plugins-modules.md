---
source_course: "vue-ssr-nuxt"
source_lesson: "vue-ssr-nuxt-plugins-modules"
---

# Plugins et Modules : Étendre Nuxt

Étendez Nuxt avec des **plugins** (pour les fonctionnalités Vue) et des **modules** (pour les fonctionnalités Nuxt core).

## Les Plugins

Les plugins s'exécutent quand l'application Vue est créée.

### Plugin Basique

```typescript
// plugins/mon-plugin.ts
export default defineNuxtPlugin(() => {
  console.log("Plugin chargé !");
});
```

### Fournir des Helpers (`provide`)

```typescript
// plugins/format.ts
export default defineNuxtPlugin(() => {
  return {
    provide: {
      formatDate: (date: Date) => {
        return new Intl.DateTimeFormat("fr-FR").format(date);
      },
      formatCurrency: (amount: number) => {
        return new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(amount);
      },
    },
  };
});
```

Utilisation :

```vue
<script setup>
const { $formatDate, $formatCurrency } = useNuxtApp();

const dateFormatee = $formatDate(new Date());
const prix = $formatCurrency(29.99); // "29,99 €"
</script>
```

### Plugin de Directive Vue

```typescript
// plugins/directives.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("focus", {
    mounted(el) {
      el.focus(); // Focus automatique au montage
    },
  });

  nuxtApp.vueApp.directive("click-outside", {
    mounted(el, binding) {
      el._clickOutside = (event: Event) => {
        if (!el.contains(event.target)) {
          binding.value(); // Appelle la fonction passée en argument
        }
      };
      document.addEventListener("click", el._clickOutside);
    },
    unmounted(el) {
      document.removeEventListener("click", el._clickOutside);
    },
  });
});
```

### Plugin pour une Bibliothèque Tierce

```typescript
// plugins/dayjs.ts
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";

export default defineNuxtPlugin(() => {
  dayjs.extend(relativeTime);
  dayjs.locale("fr"); // Français !

  return {
    provide: {
      dayjs,
    },
  };
});
```

### Plugins Client/Serveur Uniquement

```typescript
// plugins/client-analytics.client.ts  ← .client.ts = navigateur uniquement
export default defineNuxtPlugin(() => {
  // S'exécute UNIQUEMENT dans le navigateur
  window.analytics.init("key");
});

// plugins/server-logger.server.ts  ← .server.ts = serveur uniquement
export default defineNuxtPlugin(() => {
  // S'exécute UNIQUEMENT sur le serveur
  console.log("Serveur démarré");
});
```

## Les Modules

Les modules étendent les fonctionnalités core de Nuxt.

### Installer des Modules

```bash
npm install @nuxtjs/tailwindcss @pinia/nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxt/image",
    "@vueuse/nuxt",
  ],
});
```

### Les Modules Populaires

```typescript
export default defineNuxtConfig({
  modules: [
    // Styling
    "@nuxtjs/tailwindcss",
    "@nuxt/ui",

    // State Management
    "@pinia/nuxt",

    // Images
    "@nuxt/image",

    // Contenu (Markdown, etc.)
    "@nuxt/content",

    // SEO
    "@nuxtjs/seo",

    // Auth
    "@sidebase/nuxt-auth",

    // Utilitaires VueUse
    "@vueuse/nuxt",
  ],
});
```

### Créer un Module Local

```typescript
// modules/mon-module.ts
import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";

export default defineNuxtModule({
  meta: {
    name: "mon-module",
    configKey: "monModule",
  },
  defaults: {
    enabled: true,
  },
  setup(options, nuxt) {
    if (!options.enabled) return;

    const { resolve } = createResolver(import.meta.url);

    // Ajouter un plugin
    addPlugin(resolve("./runtime/plugin"));

    // Ajouter des composables
    addImportsDir(resolve("./runtime/composables"));

    // Ajouter des composants
    addComponentsDir({ path: resolve("./runtime/components") });
  },
});
```

## Les Grimoires De Tests

- [Les Plugins Nuxt (Guide Officiel)](https://nuxt.com/docs/guide/directory-structure/plugins)

---

> 📘 _Cette leçon fait partie du cours [Vue SSR & Nuxt](/vue/vue-ssr-nuxt/) sur la plateforme d'apprentissage RostoDev._
