---
source_course: "vue-foundations"
source_lesson: "vue-foundations-list-rendering"
---

# Rendu de Liste avec v-for (List Rendering)

La directive `v-for` permet d'afficher une liste d'éléments à l'écran en se basant sur un Tableau (Array) ou un Objet JavaScript. C'est l'une des directives les plus couramment utilisées dans toutes les applications Vue.

## Rendu de Tableau Basique

Utilisez `v-for` avec la syntaxe `element in elements` (exactement comme une boucle for...in en JavaScript) :

```vue
<script setup>
import { ref } from "vue";

const fruits = ref(["Pomme", "Banane", "Cerise", "Datte"]);
</script>

<template>
  <ul>
    <!-- Cette balise <li> sera répétée 4 fois -->
    <li v-for="fruit in fruits" :key="fruit">
      {{ fruit }}
    </li>
  </ul>
</template>
```

## Accéder à l'Index

Récupérez la position (l'index) actuelle en utilisant un deuxième paramètre entre parenthèses :

```vue
<script setup>
import { ref } from "vue";

const tasks = ref([
  { id: 1, text: "Apprendre Vue", done: true },
  { id: 2, text: "Créer une appli", done: false },
  { id: 3, text: "Déployer en production", done: false },
]);
</script>

<template>
  <ul>
    <!-- L'index commence à 0, comme en JS -->
    <li v-for="(task, index) in tasks" :key="task.id">
      {{ index + 1 }}. {{ task.text }}
      <span v-if="task.done">✓</span>
    </li>
  </ul>
</template>
```

## L'Attribut `key` - Absolument Critique !

**Fournissez TOUJOURS une `key` (clé) unique** lorsque vous utilisez `v-for`. Cela aide considérablement le moteur de DOM Virtuel de Vue à pister chaque élément et à mettre à jour l'écran efficacement :

```vue
<script setup>
import { ref } from "vue";

const users = ref([
  { id: 1, name: "Alice", email: "alice@exemple.com" },
  { id: 2, name: "Bob", email: "bob@exemple.com" },
  { id: 3, name: "Charlie", email: "charlie@exemple.com" },
]);
</script>

<template>
  <!-- EXCELLENT : Un ID unique venant de la BDD comme clé -->
  <div v-for="user in users" :key="user.id">
    {{ user.name }} - {{ user.email }}
  </div>

  <!-- MAUVAIS ACTE : L'index comme clé (Cause de gros bugs lors des tris) -->
  <div v-for="(user, index) in users" :key="index">
    {{ user.name }}
  </div>
</template>
```

### Pourquoi les Clés sont Vitales

Sans les clés appropriées, Vue pourrait :

- Réutiliser des balises DOM de manière incorrecte quand l'ordre des éléments change.
- Mélanger ou perdre les valeurs des `<input>` si la liste est modifiée.
- Causer d'affreux bugs visuels et de lourds problèmes de performance.

## Itérer sur des Objets

Vous pouvez aussi créer une boucle sur les propriétés d'un simple objet JavaScript (Dictionnaire) :

```vue
<script setup>
import { reactive } from "vue";

const profile = reactive({
  name: "Jean Dupont",
  email: "jean@exemple.com",
  role: "Développeur",
  location: "Paris",
});
</script>

<template>
  <!-- Valeur uniquement -->
  <ul>
    <li v-for="valeur in profile" :key="valeur">
      {{ valeur }}
    </li>
  </ul>

  <!-- Valeur + Clé (Nom de la propriété) -->
  <ul>
    <li v-for="(valeur, cle) in profile" :key="cle">
      <strong>{{ cle }} :</strong> {{ valeur }}
    </li>
  </ul>

  <!-- Valeur + Clé + Index -->
  <ul>
    <li v-for="(valeur, cle, index) in profile" :key="cle">
      {{ index + 1 }}. {{ cle }} : {{ valeur }}
    </li>
  </ul>
</template>
```

## Le v-for sur une Plage de Nombres (Range)

Itérer un certain nombre de fois précis :

```vue
<template>
  <!-- Affiche 1, 2, 3, 4, 5 -->
  <span v-for="n in 5" :key="n">{{ n }}</span>

  <!-- Pratique pour créer 10 fausses cartes (Skeleton Loaders) -->
  <div v-for="i in 10" :key="i" class="skeleton-item">
    Chargement élément {{ i }}...
  </div>
</template>
```

À noter : Dans un range Vue, ça commence toujours à **1**, et non pas à 0.

## Le v-for sur une `<template>` fantôme

Générez plusieurs éléments par itération, sans wrapper HTML inutile :

```vue
<script setup>
import { ref } from "vue";

const items = ref([
  { id: 1, title: "Objet 1", description: "Description 1" },
  { id: 2, title: "Objet 2", description: "Description 2" },
]);
</script>

<template>
  <dl>
    <!-- Le v-for est sur le template, il ne générera aucune div ! -->
    <template v-for="item in items" :key="item.id">
      <dt>{{ item.title }}</dt>
      <dd>{{ item.description }}</dd>
    </template>
  </dl>
</template>
```

## Le v-for Imbriqué (Nested v-for)

Des boucles dans des boucles pour les données complexes en arborescence :

```vue
<script setup>
import { ref } from "vue";

const categories = ref([
  {
    id: 1,
    name: "Électronique",
    products: [
      { id: 101, name: "Téléphone" },
      { id: 102, name: "PC Portable" },
    ],
  },
  {
    id: 2,
    name: "Vêtements",
    products: [
      { id: 201, name: "T-Shirt" },
      { id: 202, name: "Jeans" },
    ],
  },
]);
</script>

<template>
  <div v-for="category in categories" :key="category.id">
    <h3>{{ category.name }}</h3>
    <ul>
      <!-- Le v-for à l'intérieur utilise la variable `category` du v-for parent ! -->
      <li v-for="product in category.products" :key="product.id">
        {{ product.name }}
      </li>
    </ul>
  </div>
</template>
```

## Détection des Changements de Tableaux

Vue détecte intelligemment les ascenceurs et met à jour la vue dynamiquement :

```vue
<script setup>
import { ref } from "vue";

const items = ref(["A", "B", "C"]);

function addItem() {
  items.value.push("Nouvel Objet"); // Réactif ! Vue met à jour l'écran.
}

function removeFirst() {
  items.value.shift(); // Réactif !
}

function replaceAll() {
  items.value = ["X", "Y", "Z"]; // Réactif !
}
</script>
```

### Méthodes de Mutation (Déclenchent la Réactivité Automatiquement)

- `push()`, `pop()`
- `shift()`, `unshift()`
- `splice()`
- `sort()`, `reverse()`

### Remplacer le Tableau Entier

Les méthodes JavaScript comme `filter()`, `map()`, et `slice()` ne mutent pas le tableau d'origine, elles en renvoient un tout neuf. Il faut donc réaffecter le résultat à `LaVariable.value` :

```vue
<script setup>
import { ref } from "vue";

const numbers = ref([1, 2, 3, 4, 5]);

function filterEven() {
  // On écrase la .value avec un tout nouveau tableau filtré
  numbers.value = numbers.value.filter((n) => n % 2 === 0);
}
</script>
```

## Ressources

- [Rendu de Liste](https://vuejs.org/guide/essentials/list.html) — Documentation officielle sur `v-for`.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
