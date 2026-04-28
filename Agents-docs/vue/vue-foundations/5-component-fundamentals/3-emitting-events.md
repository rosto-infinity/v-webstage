---
source_course: "vue-foundations"
source_lesson: "vue-foundations-emitting-events"
---

# Émettre des Événements vers les Parents (Emits)

Alors que les _Props_ font descendre la donnée pure (du Parent vers l'Enfant), les _Événements_ ("Emits") font **remonter** des signaux et de l'information (de l'Enfant vers le Parent). C'est ainsi qu'un composant Enfant communique à son Parent qu'il s'est passé quelque chose (ex: un clic, une demande de suppression) sans jamais muter lui-même la donnée.

## Déclarer des Événements

Utilisez la macro `defineEmits()` pour déclarer quels événements précis votre composant Enfant a le droit d'émettre vers l'extérieur :

```vue
<!-- src/components/CounterButton.vue -->
<script setup lang="ts">
// On définit l'interface (TS) des évènements que je peux lancer
const emit = defineEmits<{
  increment: []; // Aucun paramètre supplémentaire (Payload)
  decrement: []; // Aucun paramètre
  change: [newValue: number]; // AVEC un paramètre (Payload) de type 'number'
}>();

function handleIncrement() {
  emit("increment"); // On cri/émet "increment" vers le composant parent qui nous utilise
}

function handleDecrement() {
  emit("decrement"); // On émet "decrement"
}
</script>

<template>
  <div class="counter-buttons">
    <button @click="handleDecrement">-</button>
    <button @click="handleIncrement">+</button>
  </div>
</template>
```

## Écouter ces Événements (Le Parent)

Le Parent écoute ces événements personnalisés exactement comme des événements natifs HTML classiques (`click`, `input`), en utilisant l'arobase `@nom-de-l-evenement` :

```vue
<!-- Composant Parent (App.vue) -->
<script setup lang="ts">
import CounterButton from "./components/CounterButton.vue";
import { ref } from "vue";

const count = ref(0);

// C'est le Parent qui possède et qui MUTE la variable d'état !
function handleIncrement() {
  count.value++;
}

function handleDecrement() {
  count.value--;
}
</script>

<template>
  <div>
    <p>Compteur : {{ count }}</p>

    <!-- On écoute les "cris" personnalisés de notre composant enfant -->
    <CounterButton @increment="handleIncrement" @decrement="handleDecrement" />
  </div>
</template>
```

## Événements avec de la Donnée interne (Payloads)

Vous pouvez tout à fait passer de la donnée pure (un ID, un texte, un objet entier) avec l'événement que vous émettez :

```vue
<!-- src/components/SearchBox.vue (Enfant) -->
<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  search: [query: string]; // On va envoyer un texte (la requête de recherche)
  clear: []; // On n'envoie rien
}>();

const query = ref("");

function handleSubmit() {
  if (query.value.trim()) {
    // Émission avec PAYLOAD (le mot cherché à l'intérieur du paramètre)
    emit("search", query.value.trim());
  }
}

function handleClear() {
  query.value = "";
  emit("clear");
}
</script>

<template>
  <!-- La soumission HTML @submit déclenche NOTRE logique handleSubmit interne -->
  <form @submit.prevent="handleSubmit" class="search-box">
    <input v-model="query" placeholder="Rechercher..." />
    <button type="submit">Go</button>
    <button type="button" @click="handleClear">Vider</button>
  </form>
</template>
```

```vue
<!-- Parent qui utilise la barre de recherche -->
<script setup lang="ts">
import SearchBox from "./components/SearchBox.vue";
import { ref } from "vue";

const searchResults = ref<string[]>([]);

// La fonction parent REÇOIT l'argument textuel envoyé par l'enfant !
function handleSearch(query: string) {
  console.log("Lancement d'une requête API serveur pour le mot :", query);
  // ... ex: fetch(`/api/search?q=${query}`) ...
}

function handleClear() {
  searchResults.value = [];
}
</script>

<template>
  <!-- L'écoute est extrêmement naturelle et "propre" -->
  <SearchBox @search="handleSearch" @clear="handleClear" />
</template>
```

## Convention de Nommage des Événements

Utilisez **toujours le kebab-case** (mots séparés par des tirets) pour le nom des événements lorsque vous les écoutez dans le Template HTML, même si vous les avez déclarés en camelCase propre côté TypeScript (Vue fait la transformation) :

```vue
<!-- L'Enfant (Script) -->
<script setup lang="ts">
const emit = defineEmits<{
  itemSelected: [id: number]; // camelCase en TS (Convention JS/TS)
  updateValue: [value: string];
}>();

emit("itemSelected", 42);
emit("updateValue", "bonjour");
</script>

<!-- Le Parent (Template) -->
<template>
  <!-- Utilisez ABSOLUMENT le kebab-case (Convention HTML standard) lors de l'écoute ! -->
  <ChildComponent @item-selected="handleSelect" @update-value="handleUpdate" />
</template>
```

## Gestionnaires d'Événements "En Ligne"

Pour les cas très basiques, utilisez des fonctions fléchées en ligne ou la variable magique `$event` (qui contiendra le 1er payload) directement dans le HTML du parent :

```vue
<template>
  <!-- Accéder au "Payload" (la donnée transmise) avec la variable magique $event -->
  <SearchBox @search="searchQuery = $event" />

  <!-- OU via une belle et claire fonction fléchée ES6 en ligne -->
  <SearchBox @search="(q) => performSearch(q)" />

  <!-- Indispensable s'il y a PLUSIEURS arguments (payloads) transmis !! : -->
  <DataTable @sort="(colonne, direction) => trier(colonne, direction)" />
</template>
```

## L'Exemple Complet Magistral : Un Élément Todo list

```vue
<!-- src/components/TodoItem.vue (L'Enfant pur) -->
<script setup lang="ts">
import { ref } from "vue";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

// L'enfant REÇOIT l'objet de données complet
const props = defineProps<{
  todo: Todo;
}>();

// L'enfant DECLARE toutes les requêtes d'actions qu'il peut faire remonter à son chef
const emit = defineEmits<{
  toggle: [id: number];
  delete: [id: number];
  edit: [id: number, newText: string]; // 2 paramètres !
}>();

const isEditing = ref(false);
const editText = ref("");

function startEdit() {
  editText.value = props.todo.text;
  isEditing.value = true;
}

function saveEdit() {
  if (editText.value.trim()) {
    // Il s'est passé qq chose, on l'annonce avec les deux payloads :
    emit("edit", props.todo.id, editText.value.trim());
  }
  isEditing.value = false;
}

function cancelEdit() {
  isEditing.value = false;
}
</script>

<template>
  <li class="todo-item" :class="{ done: todo.done }">
    <!-- Un clic sur la case EMET un toggle de SON ID -->
    <input
      type="checkbox"
      :checked="todo.done"
      @change="emit('toggle', todo.id)"
    />

    <!-- Mode Edition Active -->
    <template v-if="isEditing">
      <input
        v-model="editText"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
      />
      <button @click="saveEdit">✓</button>
      <button @click="cancelEdit">✗</button>
    </template>

    <!-- Mode Affichage Normal -->
    <template v-else>
      <span @dblclick="startEdit">{{ todo.text }}</span>
      <button @click="emit('delete', todo.id)">Poubelle</button>
    </template>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
}

.done span {
  text-decoration: line-through;
  color: #888;
}
</style>
```

```vue
<!-- Parent Principal : TodoList.vue (Le Boss du state) -->
<script setup lang="ts">
import TodoItem from "./TodoItem.vue";
import { ref } from "vue";

const todos = ref([
  { id: 1, text: "Apprendre Vue 3", done: true },
  { id: 2, text: "Maîtriser les Emits", done: false },
]);

// C'EST LUI, LE PARENT, QUI DETIENT ET MUTE PHYSIQUEMENT LA DONNÉE.
function toggleTodo(id: number) {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) todo.done = !todo.done;
}

function deleteTodo(id: number) {
  // On écrase le tableau
  todos.value = todos.value.filter((t) => t.id !== id);
}

function editTodo(id: number, newText: string) {
  const todo = todos.value.find((t) => t.id === id);
  if (todo) todo.text = newText;
}
</script>

<template>
  <ul>
    <!-- On parcourt l'état tous les todos, on les passe au composant enfant, et on ECOUTE tous les signaux ! -->
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="toggleTodo"
      @delete="deleteTodo"
      @edit="editTodo"
    />
  </ul>
</template>
```

## Ressources

- [Événements de Composant (Emits)](https://vuejs.org/guide/components/events.html) — La documentation officielle de Vue.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
