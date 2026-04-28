---
source_course: "vue-foundations"
source_lesson: "vue-foundations-computed-properties"
---

# Les Propriétés Calculées (Computed Properties)

Les propriétés calculées (`computed`) vous permettent de déclarer un **état dérivé** — c'est-à-dire des valeurs qui dépendent mathématiquement ou logiquement d'autres valeurs réactives, et qui se mettent à jour 100% automatiquement lorsque leurs dépendances changent.

## Pourquoi utiliser Computed ?

Vous pourriez techniquement mettre toute votre logique complexe directement dans le HTML de vos templates :

```vue
<template>
  <!-- Ça "marche", mais c'est très sale, lourd à lire, et hyper répétitif -->
  <p>{{ items.filter((item) => item.done).length }} terminés</p>
  <p>{{ items.filter((item) => item.done).length }} sur {{ items.length }}</p>
</template>
```

Les propriétés calculées résolvent ce problème technique majeur en :

- Sortant toute la logique métier complexe hors des templates HTML.
- **Mettant en cache** (caching) les résultats pour des performances optimales.
- Se mettant à jour de manière purement automatique quand et _seulement_ quand les dépendances ont muté.

## Utilisation Basique

```vue
<script setup>
import { ref, computed } from "vue";

const firstName = ref("Jean");
const lastName = ref("Dupont");

// Propriété Calculée - Se met à jour AUTO quand firstName ou lastName change !
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});
</script>

<template>
  <p>Prénom : {{ firstName }}</p>
  <p>Nom : {{ lastName }}</p>
  <p>Complet : {{ fullName }}</p>
  <!-- S'utilise comme une variable normale -->

  <input v-model="firstName" placeholder="Prénom" />
  <input v-model="lastName" placeholder="Nom" />
</template>
```

Dès que vous tapez dans l'un des deux inputs, la variable `fullName` se reconstruit et se rafraîchit magiquement !

## Computed vs Methods (Calculées vs Fonctions)

### L'approche par Fonction (Aïe !)

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

// Fonction classique - Appelée À CHAQUE FOIS que TOUT le composant se rafraîchit
function doubleCount() {
  console.log("Fonction appelée !"); // Logué à CHAQUE rendu
  return count.value * 2;
}
</script>

<template>
  <p>{{ doubleCount() }}</p>
  <p>{{ doubleCount() }}</p>
  <p>{{ doubleCount() }}</p>
  <!-- La fonction est exécutée 3 FOIS DE SUITE pour strictement rien ! -->
</template>
```

### L'approche Computed (Ouf !)

```vue
<script setup>
import { ref, computed } from "vue";

const count = ref(0);

// Computed - Mise en CACHE absolue
const doubleCount = computed(() => {
  console.log("Computed évaluée !"); // Logué UNE SEULE FOIS !
  return count.value * 2;
});
</script>

<template>
  <p>{{ doubleCount }}</p>
  <p>{{ doubleCount }}</p>
  <p>{{ doubleCount }}</p>
  <!-- Vue réutilise instantanément la valeur en mémoire cache 3 fois ! -->
</template>
```

**La différence absolue** : Les propriétés calculées sont **mises en cache** par le moteur de Vue. Elles ne recalculeront leur contenu _que_ si l'une de leurs dépendances réactives (ici `count`) a changé de valeur. C'est inestimable pour les grosses opérations (comme parcourir un tableau de 10 000 objets).

## Exemples Concrets (Patterns Réels)

### Filtrer Automatiquement une Liste

```vue
<script setup>
import { ref, computed } from "vue";

const todos = ref([
  { id: 1, text: "Apprendre Vue", done: true },
  { id: 2, text: "Créer une appli", done: false },
  { id: 3, text: "Déployer", done: false },
]);

const filter = ref("all"); // Peut être 'all', 'active', 'completed'

// La liste filtrée "magique" qu'on va utiliser côté HTML
const filteredTodos = computed(() => {
  switch (filter.value) {
    case "active":
      return todos.value.filter((t) => !t.done);
    case "completed":
      return todos.value.filter((t) => t.done);
    default:
      return todos.value;
  }
});

// Des statistiques ré-évaluées au vol
const stats = computed(() => ({
  total: todos.value.length,
  completed: todos.value.filter((t) => t.done).length,
  remaining: todos.value.filter((t) => !t.done).length,
}));
</script>

<template>
  <div>
    <button @click="filter = 'all'">Tous ({{ stats.total }})</button>
    <button @click="filter = 'active'">Actifs ({{ stats.remaining }})</button>
    <button @click="filter = 'completed'">
      Terminés ({{ stats.completed }})
    </button>
  </div>

  <ul>
    <!-- On boucle PUREMENT sur la Computed, PAS sur la ref originale !! -->
    <li v-for="todo in filteredTodos" :key="todo.id">
      {{ todo.text }}
    </li>
  </ul>
</template>
```

### Validation Intuitive d'un Formulaire

```vue
<script setup>
import { ref, computed } from "vue";

const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// Un gros tableau de textes d'erreurs calculé au vol pendant qu'on tape
const errors = computed(() => {
  const errs = [];

  if (!email.value) {
    errs.push("L'email est requis");
  } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(email.value)) {
    errs.push("Format d'email invalide");
  }

  if (password.value.length < 8) {
    errs.push("Le mot de passe doit faire 8 caractères min.");
  }

  if (password.value !== confirmPassword.value) {
    errs.push("Les mots de passe ne correspondent pas !");
  }

  return errs; // Renvoie un tableau plat : ['Erreur 1', 'Erreur 2']
});

// Un vrai/faux bête et méchant pour déverrouiller le bouton Submit
const isValid = computed(() => errors.value.length === 0);
</script>

<template>
  <form @submit.prevent>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <input v-model="confirmPassword" type="password" placeholder="Confirmer" />

    <!-- On parcourt et affiche le tableau d'erreur ! -->
    <ul v-if="errors.length" class="erreurs-rouges">
      <li v-for="error in errors" :key="error">{{ error }}</li>
    </ul>

    <!-- On bloque le bouton si ce n'est pas "Valide" ! -->
    <button :disabled="!isValid">Envoyer</button>
  </form>
</template>
```

## Computed "Writable" (En Écriture)

Par défaut, une _Computed_ est mathématiquement en "Lecture Seule" (Read-Only). Vous ne pouvez pas coder `maComputed.value = "truc"`, Vue va planter. Si vous voulez l'autoriser, vous devez écrire un duo `get()` / `set()` :

```vue
<script setup>
import { ref, computed } from "vue";

const firstName = ref("Jean");
const lastName = ref("Dupont");

const fullName = computed({
  // Comment LIRE la valeur
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  // Comment ÉCRIRE la valeur si quelqu'un veut forcer un texte dedans
  set(newValue) {
    const parts = newValue.split(" "); // Coupe le nom et le prénom par les espaces
    firstName.value = parts[0] || "";
    lastName.value = parts.slice(1).join(" ") || "";
  },
});
</script>

<template>
  <!-- La liaison Bidirectionnelle (v-model) MARCHE via le set() ! -->
  <input v-model="fullName" />

  <p>Prénom : {{ firstName }}</p>
  <p>Nom : {{ lastName }}</p>
</template>
```

## Ressources

- [Propriétés Calculées](https://vuejs.org/guide/essentials/computed.html) — Documentation officielle sur `computed()`.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
