---
source_course: "vue-foundations"
source_lesson: "vue-foundations-watchers-intro"
---

# Introduction aux Observateurs (Watchers)

Tandis que les propriétés calculées (`computed`) gèrent l'état dérivé pur (mathématique/logique), les observateurs (`watchers`) vous permettent d'exécuter des **effets secondaires** (side effects) en réaction à des changements d'état — comme par exemple faire des requêtes API (`fetch`), logguer des infos, ou modifier le DOM manuellement.

## Quand utiliser les Observateurs (Watchers) ?

Utilisez un watcher de préférence quand vous devez :

- Récupérer de la donnée (Fetch data) depuis une API quand un ID change.
- Effectuer des opérations asynchrones.
- Logguer ou déboguer des changements d'état.
- Interagir avec des systèmes externes (LocalStorage, Librairies Tierces, Canvas...).

## Le watch() Basique

La fonction `watch()` prend deux paramètres majeurs : une source à observer, et une fonction de rappel (callback) à exécuter :

```vue
<script setup>
import { ref, watch } from "vue";

const searchQuery = ref("");

// On observe UNE seule ref
watch(searchQuery, (newValue, oldValue) => {
  console.log(`La recherche est passée de "${oldValue}" à "${newValue}"`);
});
</script>

<template>
  <input v-model="searchQuery" placeholder="Rechercher..." />
</template>
```

## Observer Différentes Sources

### Une Ref Simple

```vue
<script setup>
import { ref, watch } from "vue";

const count = ref(0);

watch(count, (newVal, oldVal) => {
  console.log(`Compteur : ${oldVal} → ${newVal}`);
});
</script>
```

### Une Fonction Getter (Pour les Objets Reactive)

Pour observer une propriété précise d'un objet `reactive` ou des variables complexes, il faut passer une fonction "Getter" (une fonction fléchée qui retourne la valeur) en 1er paramètre :

```vue
<script setup>
import { reactive, watch } from "vue";

const user = reactive({ name: "Alice", age: 25 });

// Observer UNE propriété spécifique avec un getter () =>
watch(
  () => user.name,
  (newName) => {
    console.log(`Le nom a changé en : ${newName}`);
  },
);

// Observer une expression logique complexe
watch(
  () => user.age >= 18,
  (isAdult) => {
    console.log(`L'utilisateur est ${isAdult ? "majeur" : "mineur"}`);
  },
);
</script>
```

### Multiples Sources

Observer un tableau complet de plusieurs variables en même temps :

```vue
<script setup>
import { ref, watch } from "vue";

const firstName = ref("Jean");
const lastName = ref("Dupont");

watch(
  [firstName, lastName], // Tableau des sources
  ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log(
      `Nom complet : ${oldFirst} ${oldLast} → ${newFirst} ${newLast}`,
    );
  },
);
</script>
```

## Le Magique watchEffect()

`watchEffect()` traque **automatiquement** absolument toutes les dépendances réactives qui sont lues à l'intérieur de sa fonction !

```vue
<script setup>
import { ref, watchEffect } from "vue";

const count = ref(0);
const multiplier = ref(2);

// Traque automatiquement `count` ET `multiplier` sans avoir besoin de les lister !
watchEffect(() => {
  console.log(`Résultat immédiat : ${count.value * multiplier.value}`);
});
// Log immédiatement au chargement de la page : "Résultat immédiat : 0"
// Loggera à nouveau N'IMPORTE QUAND count OU multiplier changera.
</script>
```

### watch() vs watchEffect()

| Fonctionnalité                       | watch()                                        | watchEffect()                                        |
| ------------------------------------ | ---------------------------------------------- | ---------------------------------------------------- |
| Dépendances explicites               | Oui (Il faut les lister au début)              | Non (Détectées automatiquement)                      |
| Accès à l'Ancienne Valeur (`oldVal`) | Oui                                            | Non                                                  |
| Paresseux par défaut                 | Oui (Ne s'exécute qu'au _prochain_ changement) | Non (S'exécute _immédiatement_ au lancement)         |
| Meilleur pour                        | Des changements d'état ultra-ciblés            | Une logique utilisant plein de variables différentes |

## Exemples Concrets (Patterns Réels)

### "Fetch Data" : Faire une Requête API au changement

```vue
<script setup>
import { ref, watch } from "vue";

const userId = ref(1);
const userData = ref(null);
const isLoading = ref(false);

watch(userId, async (newId) => {
  isLoading.value = true; // Affiche le spinner de chargement instantanément
  try {
    const response = await fetch(`/api/users/${newId}`);
    userData.value = await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération utilisateur:", error);
  } finally {
    isLoading.value = false; // Cache le spinner quoi qu'il arrive
  }
});
</script>

<template>
  <select v-model="userId">
    <option :value="1">Utilisateur 1</option>
    <option :value="2">Utilisateur 2</option>
    <option :value="3">Utilisateur 3</option>
  </select>

  <div v-if="isLoading">Chargement en cours...</div>
  <div v-else-if="userData">
    <h2>{{ userData.name }}</h2>
    <p>{{ userData.email }}</p>
  </div>
</template>
```

### "Debounce" : Attendre que l'utilisateur arrête de taper

```vue
<script setup>
import { ref, watch } from "vue";

const searchQuery = ref("");
const searchResults = ref([]);

let debounceTimeout;

watch(searchQuery, (query) => {
  // Annule la requête précédente en attente si je tape encore une lettre
  clearTimeout(debounceTimeout);

  if (!query) {
    searchResults.value = [];
    return;
  }

  // Attendre 300 millisecondes COMPLÈTES de silence avant de lancer la requête API
  debounceTimeout = setTimeout(async () => {
    const response = await fetch(`/api/search?q=${query}`);
    searchResults.value = await response.json();
  }, 300);
});
</script>
```

### Sauvegarder en permanence dans le LocalStorage

```vue
<script setup>
import { ref, watch } from "vue";

// Charge la valeur initiale depuis le localStorage (ou 'light' par défaut)
const theme = ref(localStorage.getItem("theme") || "light");

// Sauvegarde dans le localStorage À CHAQUE changement
watch(theme, (newTheme) => {
  localStorage.setItem("theme", newTheme);
  document.documentElement.setAttribute("data-theme", newTheme);
});
</script>

<template>
  <select v-model="theme">
    <option value="light">Clair</option>
    <option value="dark">Sombre</option>
    <option value="system">Système</option>
  </select>
</template>
```

## Options Avancées des Watchers

### `immediate: true` (Lancer Immédiatement)

Pour forcer un `watch()` standard à s'exécuter aussi une toute première fois lors du chargement de la page :

```vue
<script setup>
import { ref, watch } from "vue";

const userId = ref(1);

watch(
  userId,
  async (id) => {
    await fetchUser(id);
  },
  { immediate: true }, // Fetche immédiatement l'utilisateur 1 à l'ouverture de la page !
);
</script>
```

### `deep: true` (Observation Profonde)

Nécessaire pour observer manuellement les modifications à l'intérieur d'un objet "profond" :

```vue
<script setup>
import { ref, watch } from "vue";

const settings = ref({
  notifications: {
    email: true,
    push: false,
  },
});

watch(
  settings,
  (newSettings) => {
    console.log("Les paramètres généraux ont changé !", newSettings);
  },
  { deep: true }, // Sans ça, Vue ne verrait pas le changement interne de "push" !
);
</script>
```

## Ressources

- [Observateurs (Watchers)](https://vuejs.org/guide/essentials/watchers.html) — Documentation officielle sur `watch()` et `watchEffect()`.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
