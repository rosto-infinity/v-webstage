---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-async-components"
---

# Chargement Paresseux avec les Composants Asynchrones

Les composants asynchrones ne se chargent que lorsqu'ils sont nécessaires, réduisant la taille du bundle initial et améliorant les performances de l'application.

## Composant Asynchrone de Base

Utilisez `defineAsyncComponent` pour créer des composants chargés à la demande :

```typescript
import { defineAsyncComponent } from "vue";

// Utilisation basique
const AsyncModal = defineAsyncComponent(() => import("./components/Modal.vue"));

// Avec états de chargement et d'erreur
const AsyncUserProfile = defineAsyncComponent({
  loader: () => import("./components/UserProfile.vue"),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200, // Afficher le chargement après 200ms
  timeout: 10000, // Timeout après 10 secondes
});
```

## Utiliser les Composants Asynchrones

```vue
<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";

// Le composant ne se charge que quand la modal s'ouvre
const AsyncModal = defineAsyncComponent(
  () => import("./components/HeavyModal.vue"),
);

const showModal = ref(false);
</script>

<template>
  <button @click="showModal = true">Ouvrir la Modal</button>

  <!-- Le composant se charge quand v-if devient true -->
  <AsyncModal v-if="showModal" @close="showModal = false" />
</template>
```

## États de Chargement et d'Erreur

Gérez les scénarios de chargement et d'erreur :

```vue
<script setup lang="ts">
import { defineAsyncComponent, h } from "vue";

// Composant de chargement
const LoadingSpinner = {
  render() {
    return h("div", { class: "loading" }, "Chargement...");
  },
};

// Composant d'erreur
const ErrorComponent = {
  props: ["error"],
  render() {
    return h("div", { class: "error" }, `Erreur : ${this.error.message}`);
  },
};

const AsyncDashboard = defineAsyncComponent({
  loader: () => import("./components/Dashboard.vue"),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorComponent,
  delay: 200, // Ne pas afficher le chargement pour les charges rapides
  timeout: 30000, // Échec après 30 secondes
  onError(error, retry, fail, attempts) {
    if (error.message.includes("network") && attempts < 3) {
      retry(); // Réessayer en cas d'erreur réseau
    } else {
      fail(); // Abandonner
    }
  },
});
</script>
```

## Découpage de Code par Route

Combinez avec Vue Router pour un découpage au niveau des routes :

```typescript
// router/index.ts
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/HomeView.vue"),
    },
    {
      path: "/dashboard",
      component: () => import("@/views/DashboardView.vue"),
    },
    {
      path: "/admin",
      component: () => import("@/views/AdminView.vue"),
    },
  ],
});
```

## Schéma de Chargement Conditionnel

```vue
<script setup lang="ts">
import { defineAsyncComponent, shallowRef, markRaw } from "vue";

type ChartType = "line" | "bar" | "pie";

const chartComponents = {
  line: defineAsyncComponent(() => import("./charts/LineChart.vue")),
  bar: defineAsyncComponent(() => import("./charts/BarChart.vue")),
  pie: defineAsyncComponent(() => import("./charts/PieChart.vue")),
};

const currentChart = shallowRef(markRaw(chartComponents.line));

function setChartType(type: ChartType) {
  currentChart.value = markRaw(chartComponents[type]);
}
</script>

<template>
  <div class="chart-selector">
    <button @click="setChartType('line')">Ligne</button>
    <button @click="setChartType('bar')">Barres</button>
    <button @click="setChartType('pie')">Camembert</button>
  </div>

  <component :is="currentChart" :data="chartData" />
</template>
```

## Analyse du Bundle

Les composants asynchrones créent des chunks séparés. Utilisez l'analyse de build de Vite :

```bash
npx vite build --mode development
npx vite-bundle-visualizer
```

Vous verrez des chunks comme :

- `Modal.vue` → `Modal-abc123.js`
- `Dashboard.vue` → `Dashboard-def456.js`

Ces fichiers se chargent à la demande plutôt que dans le bundle initial.

## Ressources

- [Composants Asynchrones](https://vuejs.org/guide/components/async.html) — Documentation officielle Vue sur les composants asynchrones

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
