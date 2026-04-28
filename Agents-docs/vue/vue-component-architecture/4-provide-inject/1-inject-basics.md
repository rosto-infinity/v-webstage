---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-provide-inject-basics"
---

# Injection de Dépendances avec Provide/Inject

Provide/Inject est le système d'injection de dépendances de Vue. Il permet aux composants ancêtres de fournir des données que n'importe quel descendant peut injecter, quelle que soit la profondeur d'imbrication.

## Le Problème : Le Prop Drilling

Sans provide/inject, passer des données sur plusieurs niveaux nécessite du "prop drilling" :

```
Grand-Parent → Parent → Enfant → Petit-Enfant
   (prop)       (prop)   (prop)   (l'utilise)
```

Chaque composant intermédiaire doit accepter et transmettre la prop, même s'il ne l'utilise pas.

## Provide/Inject de Base

### Composant Fournisseur

```vue
<!-- App.vue ou composant ancêtre -->
<script setup lang="ts">
import { provide } from "vue";

// Fournir une valeur statique
provide("appName", "Mon Application");
provide("version", "1.0.0");
provide("apiUrl", "https://api.example.com");
</script>
```

### Composant Injecteur

```vue
<!-- N'importe quel composant descendant -->
<script setup lang="ts">
import { inject } from "vue";

const appName = inject("appName");
const version = inject("version");
const apiUrl = inject("apiUrl");
</script>

<template>
  <footer>{{ appName }} v{{ version }}</footer>
</template>
```

## Fournir un État Réactif

Fournissez des valeurs réactives qui se mettent à jour dans tous les injecteurs :

```vue
<!-- ThemeProvider.vue -->
<script setup lang="ts">
import { ref, provide, readonly } from "vue";

const theme = ref<"light" | "dark">("light");
const primaryColor = ref("#42b883");

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
}

function setPrimaryColor(color: string) {
  primaryColor.value = color;
}

// Fournir des valeurs réactives et des méthodes
provide("theme", {
  current: readonly(theme), // En lecture seule pour empêcher la mutation directe
  primaryColor: readonly(primaryColor),
  toggle: toggleTheme,
  setPrimaryColor,
});
</script>

<template>
  <div :class="['app', theme]">
    <slot></slot>
  </div>
</template>
```

```vue
<!-- N'importe quel descendant -->
<script setup lang="ts">
import { inject } from "vue";

const theme = inject("theme");
</script>

<template>
  <div :style="{ color: theme.primaryColor }">
    Thème actuel : {{ theme.current }}
    <button @click="theme.toggle">Basculer le Thème</button>
  </div>
</template>
```

## Valeurs par Défaut

Fournissez des replis quand la clé d'injection n'est pas trouvée :

```vue
<script setup lang="ts">
import { inject } from "vue";

// Avec valeur par défaut
const theme = inject("theme", "light");
const config = inject("config", { debug: false });

// Avec fonction factory (pour les objets)
const user = inject("user", () => ({ name: "Invité" }));
</script>
```

## Clés Symbol pour la Sécurité des Types

Utilisez des Symbols pour éviter les collisions de noms :

```typescript
// src/injection-keys.ts
import type { InjectionKey, Ref } from "vue";

export type Theme = "light" | "dark";

export type ThemeContext = {
  current: Readonly<Ref<Theme>>;
  toggle: () => void;
};

export const ThemeKey: InjectionKey<ThemeContext> = Symbol("theme");
export const UserKey: InjectionKey<User | null> = Symbol("user");
```

```vue
<!-- Fournisseur -->
<script setup lang="ts">
import { provide, ref, readonly } from "vue";
import { ThemeKey } from "@/injection-keys";

const theme = ref<"light" | "dark">("light");

provide(ThemeKey, {
  current: readonly(theme),
  toggle: () => {
    theme.value = theme.value === "light" ? "dark" : "light";
  },
});
</script>
```

```vue
<!-- Consommateur -->
<script setup lang="ts">
import { inject } from "vue";
import { ThemeKey } from "@/injection-keys";

// TypeScript connaît le type exact !
const theme = inject(ThemeKey);

if (theme) {
  console.log(theme.current.value); // 'light' | 'dark'
}
</script>
```

## Provide au Niveau Application

Fournissez des valeurs disponibles pour toute l'application :

```typescript
// main.ts
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// Disponible dans tous les composants
app.provide("globalConfig", {
  apiUrl: import.meta.env.VITE_API_URL,
  appVersion: "1.0.0",
});

app.mount("#app");
```

## Bonnes Pratiques

1. **Utilisez readonly** pour les refs fournies afin d'éviter les mutations incontrôlées
2. **Fournissez des fonctions de mise à jour** plutôt que des refs mutables
3. **Utilisez des clés Symbol** pour la sécurité des types et éviter les collisions
4. **Fournissez au bon niveau** - tout n'a pas besoin d'être au niveau application
5. **Documentez ce que vous fournissez** pour la clarté de l'équipe

## Ressources

- [Provide/Inject](https://vuejs.org/guide/components/provide-inject.html) — Documentation officielle Vue sur provide/inject

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
