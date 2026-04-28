---
source_course: "vue-foundations"
source_lesson: "vue-foundations-building-todo-app"
---

# Construire une Application Todo Complète

Construisons ensemble une application Todo List complète et professionnelle pour démontrer et assembler tout ce que vous avez appris. Cette application inclura :

- La création, l'édition (double-clic) et la suppression de tâches.
- Le filtrage des tâches par statut (Toutes, Actives, Complétées).
- La persistance automatique des données dans le `localStorage` du navigateur.
- Une architecture de composants découpée et propre.

## Architecture du Projet (Idéale)

```
src/
├── components/
│   └── todo/
│       ├── TodoApp.vue        # Le conteneur intelligent principal (Smart Component)
│       ├── TodoForm.vue       # Formulaire d'ajout des todos
│       ├── TodoList.vue       # Conteneur de la liste d'items (Optionnel, non utilisé ici)
│       ├── TodoItem.vue       # Composant pur pour UNE seule tâche (Dumb component)
│       └── TodoFilters.vue    # Boutons de filtres
├── composables/
│   └── useTodos.ts            # Toute la logique métier extraite hors des composants !
├── types/
│   └── todo.ts                # Définitions TypeScript
└── App.vue
```

## Définitions des Types (Interfaces)

```typescript
// src/types/todo.ts
export type Todo = {
  id: number;
  text: string;
  done: boolean;
  createdAt: number;
};

// L'union Type pour être sûr de ne rien taper d'autre !
export type FilterType = "all" | "active" | "completed";
```

## Le Composable surpuissant : `useTodos`

```typescript
// src/composables/useTodos.ts
import { ref, computed, watch } from "vue";
import type { Todo, FilterType } from "@/types/todo";

const STORAGE_KEY = "vue-todos";

export function useTodos() {
  // 1. État : On charge depuis le localStorage OU on initialise un tableau vide
  const savedTodos = localStorage.getItem(STORAGE_KEY);
  const todos = ref<Todo[]>(savedTodos ? JSON.parse(savedTodos) : []);

  const filter = ref<FilterType>("all");

  // 2. Persistance Automatique : On sauvegarde à CHAQUE changement profond du tableau !
  watch(
    todos,
    (newTodos) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos));
    },
    { deep: true }, // "deep" est vital pour observer les objets JS A L'INTERIEUR du tableau
  );

  // 3. Dérivations (Computed) calculées à la volée
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

  const stats = computed(() => ({
    total: todos.value.length,
    active: todos.value.filter((t) => !t.done).length,
    completed: todos.value.filter((t) => t.done).length,
  }));

  // 4. Actions pures (Mutations du State central)
  function addTodo(text: string) {
    if (!text.trim()) return;

    // On repousse un nouvel objet en queue de liste
    todos.value.push({
      id: Date.now(),
      text: text.trim(),
      done: false,
      createdAt: Date.now(),
    });
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo) todo.done = !todo.done;
  }

  function deleteTodo(id: number) {
    const index = todos.value.findIndex((t) => t.id === id);
    if (index > -1) todos.value.splice(index, 1); // Retire purement l'élement du tableau local
  }

  function editTodo(id: number, newText: string) {
    const todo = todos.value.find((t) => t.id === id);
    if (todo && newText.trim()) {
      todo.text = newText.trim();
    }
  }

  function clearCompleted() {
    todos.value = todos.value.filter((t) => !t.done);
  }

  // 5. On expose uniquement ce qu'on veut au monde extérieur !
  return {
    todos,
    filter,
    filteredTodos,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
  };
}
```

## Composant : `TodoForm`

```vue
<!-- src/components/todo/TodoForm.vue -->
<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  add: [text: string];
}>();

const newTodo = ref("");

function handleSubmit() {
  if (newTodo.value.trim()) {
    emit("add", newTodo.value);
    newTodo.value = ""; // On vide l'input juste après l'ajout finalisé !
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="todo-form">
    <input
      v-model="newTodo"
      type="text"
      placeholder="Que devons-nous faire aujourd'hui ?"
      class="todo-input"
    />
    <button type="submit" class="add-button">Ajouter</button>
  </form>
</template>

<style scoped>
.todo-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.todo-input:focus {
  outline: none;
  border-color: #42b883;
}

.add-button {
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.add-button:hover {
  background: #3aa876;
}
</style>
```

## Composant : `TodoItem`

```vue
<!-- src/components/todo/TodoItem.vue -->
<script setup lang="ts">
import { ref } from "vue";
import type { Todo } from "@/types/todo";

const props = defineProps<{
  todo: Todo;
}>();

const emit = defineEmits<{
  toggle: [id: number];
  delete: [id: number];
  edit: [id: number, text: string];
}>();

const isEditing = ref(false);
const editText = ref("");

function startEdit() {
  editText.value = props.todo.text;
  isEditing.value = true;
}

function saveEdit() {
  if (editText.value.trim()) {
    emit("edit", props.todo.id, editText.value);
  }
  isEditing.value = false;
}

function cancelEdit() {
  isEditing.value = false;
}
</script>

<template>
  <li class="todo-item" :class="{ done: todo.done }">
    <input
      type="checkbox"
      :checked="todo.done"
      @change="emit('toggle', todo.id)"
      class="checkbox"
    />

    <div v-if="isEditing" class="edit-mode">
      <input
        v-model="editText"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        class="edit-input"
        ref="editInput"
      />
      <!-- Les refs permetteraient par exemple de forcer le focus natif à l'ouverture de l'input JS ! -->
      <button @click="saveEdit" class="save-btn">Ok</button>
      <button @click="cancelEdit" class="cancel-btn">Annuler</button>
    </div>

    <div v-else class="view-mode">
      <!-- Le Double Clic Lance l'Edition en ligne ! -->
      <span @dblclick="startEdit" class="todo-text">
        {{ todo.text }}
      </span>
      <button @click="emit('delete', todo.id)" class="delete-btn">✕</button>
    </div>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.checkbox {
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  cursor: pointer;
}

.view-mode,
.edit-mode {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.todo-text {
  flex: 1;
  cursor: pointer;
}

.done .todo-text {
  text-decoration: line-through;
  color: #888;
}

.edit-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #42b883;
  border-radius: 4px;
}

.delete-btn {
  background: none;
  border: none;
  color: #e53e3e;
  cursor: pointer;
  font-size: 1.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.todo-item:hover .delete-btn {
  opacity: 1; /* N'apparait subtilement qu'au survol de la souris ! */
}

.save-btn,
.cancel-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background: #42b883;
  color: white;
}

.cancel-btn {
  background: #e0e0e0;
}
</style>
```

## Composant : `TodoFilters`

```vue
<!-- src/components/todo/TodoFilters.vue -->
<script setup lang="ts">
import type { FilterType } from "@/types/todo";

const props = defineProps<{
  currentFilter: FilterType;
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}>();

const emit = defineEmits<{
  // Syntaxe native très spéciale pour recréer le comportement d'un "v-model" propre depuis le Parent !
  "update:currentFilter": [filter: FilterType];
  clearCompleted: [];
}>();

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "active", label: "Restantes" },
  { value: "completed", label: "Terminées" },
];
</script>

<template>
  <div class="filters">
    <div class="filter-buttons">
      <!-- Boucle dynamique sur nos filtres -->
      <button
        v-for="f in filters"
        :key="f.value"
        :class="{ active: currentFilter === f.value }"
        @click="emit('update:currentFilter', f.value)"
      >
        {{ f.label }}
        <span class="count">
          {{
            f.value === "all"
              ? stats.total
              : f.value === "active"
                ? stats.active
                : stats.completed
          }}
        </span>
      </button>
    </div>

    <button
      v-if="stats.completed > 0"
      @click="emit('clearCompleted')"
      class="clear-btn"
    >
      Purger les terminées
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-top: 1px solid #e0e0e0;
  margin-top: 1rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
}

.filter-buttons button {
  padding: 0.5rem 1rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.filter-buttons button.active {
  border-color: #42b883;
  color: #42b883;
}

.count {
  margin-left: 0.25rem;
  font-size: 0.875rem;
  color: #888;
}

.clear-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: #e53e3e;
  cursor: pointer;
}

.clear-btn:hover {
  text-decoration: underline;
}
</style>
```

## Composant Principal d'Assemblage (Parent/App) : `TodoApp`

```vue
<!-- src/components/todo/TodoApp.vue -->
<script setup lang="ts">
import { useTodos } from "@/composables/useTodos";
import TodoForm from "./TodoForm.vue";
import TodoItem from "./TodoItem.vue";
import TodoFilters from "./TodoFilters.vue";

// Import ultra propre de TOUTE notre logique métier complexe en 1 seule petite ligne !
const {
  filter,
  filteredTodos,
  stats,
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  clearCompleted,
} = useTodos();
</script>

<template>
  <div class="todo-app">
    <h1>📝 Mes Tâches</h1>

    <TodoForm @add="addTodo" />

    <!-- TransitionGroup est totalement natif à Vue : Anime l'apparition/disparition dans les listes ! -->
    <TransitionGroup name="list" tag="ul" class="todo-list">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleTodo"
        @delete="deleteTodo"
        @edit="editTodo"
      />
    </TransitionGroup>

    <p v-if="filteredTodos.length === 0" class="empty">
      {{
        filter === "all"
          ? "Aucune tâche n'a été créée. Ajoutez-en une !"
          : filter === "active"
            ? "Aucune tâche en cours trouvée !"
            : "Aucune tâche terminée !"
      }}
    </p>

    <TodoFilters
      v-if="stats.total > 0"
      v-model:current-filter="filter"
      :stats="stats"
      @clear-completed="clearCompleted"
    />
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 12px;
}

h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.empty {
  text-align: center;
  color: #888;
  padding: 2rem;
}

/* Animations css de folie avec TransitionGroup directement branchées ! */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
```

**Cette colossale application complète démontre magistralement :**

- **La composition de composants parfaits** avec des relations Parent / Enfant très propres.
- **Le système vital de Props et d'Events** (Emits) pour une isolation UI parfaite.
- **Les fameux Composables** (Hooks) pour extraire la "logique métier" brut loin du code d'Interface.
- **TypeScript** exploité brillamment et intelligemment pour la sécurité.
- **Le LocalStorage natif** persistant pour conserver les données locales au rechargement de la page web.
- **Les propriétés calculées (Computed)** pour les dérivées comme nos filtres de tri complexes à la volée.
- **Les Transitions magiques** natives Vue (`<TransitionGroup>`) pour produire des animations fluides d'UI super facilement.

## Ressources

- [Exemples d'Applications Vue.js](https://vuejs.org/examples/) — Exemples d'applications sur le site officiel de Vue.js.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
