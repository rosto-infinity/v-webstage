---
source_course: "vue-foundations"
source_lesson: "vue-foundations-understanding-ref"
---

# Comprendre ref() pour l'État Réactif (Understanding ref)

La réactivité est le cœur battant de Vue. Lorsque vous modifiez vos données, l'interface utilisateur (UI) se met à jour automatiquement. La fonction `ref()` est le moyen principal et privilégié pour créer un état réactif avec l'API de Composition (Composition API).

## Qu'est-ce que ref() ?

`ref()` prend une valeur initiale et retourne un objet mutable et réactif, possédant une seule propriété `.value` qui pointe vers vos données :

```vue
<script setup>
import { ref } from "vue";

// Création d'états réactifs
const count = ref(0);
const message = ref("Bonjour Vue !");
const isActive = ref(true);
const user = ref({ name: "Alice", age: 25 });

// Lire et Modifier la valeur via .value
console.log(count.value); // 0
count.value++;
console.log(count.value); // 1

message.value = "Bonjour le Monde !";
isActive.value = false;
user.value.name = "Bob";
</script>
```

## Pourquoi .value ?

Les primitives JavaScript (nombres, chaînes de caractères, booléens) sont passées **par valeur**, et non par référence. Vue ne peut physiquement pas espionner les changements sur des variables simples :

```javascript
// CECI NE MARCHE PAS - Vue est aveugle à ce changement
let count = 0;
count++; // Vue n'a absolument aucune idée que ça s'est produit

// CECI MARCHE - Vue piste l'objet ref
const count = ref(0);
count.value++; // Vue détecte l'accès et la modification
```

La propriété `.value` est un "piège" (un getter/setter Proxy) qui permet à Vue d'intercepter la lecture et l'écriture, et donc de traquer les dépendances pour mettre à jour l'écran au bon moment.

## Le Déballage Automatique dans les Templates (Unwrapping)

Bonne nouvelle ! Vous n'avez **jamais** besoin d'écrire `.value` dans le HTML de vos composants. Vue s'occupe de "déballer" (unwrap) les refs automatiquement pour vous :

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
const message = ref("Bonjour");
</script>

<template>
  <!-- Aucun .value ici ! -->
  <p>Compteur : {{ count }}</p>
  <p>Message : {{ message }}</p>

  <!-- Fonctionne aussi pour lier des attributs HTML -->
  <input :value="message" />

  <!-- Et dans les expressions JavaScript -->
  <p>Le double : {{ count * 2 }}</p>
</template>
```

## Travailler avec Différents Types de Données

### Les Valeurs Primitives

```vue
<script setup>
import { ref } from "vue";

// Les Nombres
const price = ref(29.99);
const quantity = ref(1);

// Les Textes (Strings)
const firstName = ref("Jean");
const lastName = ref("Dupont");

// Les Booléens
const isLoading = ref(false);
const hasError = ref(false);

// Les Vides (Null/Undefined)
const selectedItem = ref(null);
const optionalValue = ref(undefined);
</script>
```

### Tableaux et Objets Complèxes

`ref()` fonctionne aussi merveilleusement bien avec les objets et les tableaux — ils deviennent **profondément réactifs** (deeply reactive) :

```vue
<script setup>
import { ref } from "vue";

const user = ref({
  name: "Alice",
  email: "alice@exemple.com",
  settings: {
    theme: "dark",
    notifications: true,
  },
});

const items = ref(["Pomme", "Banane", "Cerise"]);

// TOUTES ces lignes déclenchent la réactivité et la mise à jour de la page :
user.value.name = "Bob";
user.value.settings.theme = "light"; // Même super loin dans l'objet !
items.value.push("Datte"); // Même avec les méthodes de tableau !
items.value[0] = "Abricot"; // Même en changeant un index !
</script>
```

## TypeScript avec ref()

TypeScript devine (infère) le type automatiquement, mais vous pouvez aussi être ultra-explicite :

```typescript
import { ref } from "vue";

// Inféré automatiquement par TS
const count = ref(0); // Ref<number>
const message = ref("hello"); // Ref<string>

// Typage Explicite (Forcé)
const id = ref<number | null>(null); // Accepte un nombre OU null
const items = ref<string[]>([]); // Un tableau de strings

// Avec une Interface
type User = {
  id: number;
  name: string;
  email: string;
};

const user = ref<User | null>(null);

// Plus tard dans le code :
user.value = {
  id: 1,
  name: "Alice",
  email: "alice@exemple.com",
}; // TS vérifiera si tout est valide !
```

## Modèles Courants de Développement (Patterns)

### 1. Basculer un Booléen (ex: Menu Burger)

```vue
<script setup>
import { ref } from "vue";

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value; // Inverse la valeur (true -> false -> true)
}
</script>

<template>
  <button @click="toggle">
    {{ isOpen ? "Fermer" : "Ouvrir" }}
  </button>

  <div v-if="isOpen">Le menu déroulant est ici !</div>
</template>
```

### 2. Le Compteur Classique

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}

function decrement() {
  count.value--;
}

function reset() {
  count.value = 0;
}
</script>

<template>
  <p>Compteur : {{ count }}</p>
  <button @click="decrement">-</button>
  <button @click="increment">+</button>
  <button @click="reset">Remettre à zéro</button>
</template>
```

### 3. Lier au Formulaire avec `v-model` (Bidirectionnel)

```vue
<script setup>
import { ref } from "vue";

const searchQuery = ref("");
const selectedOption = ref("all");

function handleSearch() {
  console.log("Recherche pour :", searchQuery.value);
}
</script>

<template>
  <!-- v-model met à jour le champ ET la variable JS en même temps ! -->
  <input v-model="searchQuery" placeholder="Rechercher..." />

  <select v-model="selectedOption">
    <option value="all">Tous</option>
    <option value="active">Actifs</option>
    <option value="completed">Terminés</option>
  </select>
</template>
```

## Ressources

- [Fondamentaux de la Réactivité](https://vuejs.org/guide/essentials/reactivity-fundamentals.html) — Documentation officielle sur `ref()` et la réactivité de base.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
