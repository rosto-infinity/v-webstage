---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-scoped-slots"
---

# Slots Scopés pour le Passage de Données

Les slots scopés permettent aux composants enfants de passer des données au contenu du slot du parent. Cela ouvre de puissants schémas où l'enfant gère la logique tandis que le parent contrôle le rendu.

## Slot Scopé de Base

L'enfant passe des données via les props du slot :

```vue
<!-- UserList.vue -->
<script setup lang="ts">
import { ref, onMounted } from "vue";

type User = { id: number; name: string; email: string };

const users = ref<User[]>([]);
const loading = ref(true);

onMounted(async () => {
  const response = await fetch("/api/users");
  users.value = await response.json();
  loading.value = false;
});
</script>

<template>
  <div class="user-list">
    <div v-if="loading">Chargement...</div>
    <template v-else>
      <!-- Passer des données au parent via les props du slot -->
      <slot
        v-for="user in users"
        :key="user.id"
        :user="user"
        :index="users.indexOf(user)"
      ></slot>
    </template>
  </div>
</template>
```

Le parent reçoit les données dans le slot :

```vue
<!-- Parent -->
<UserList v-slot="{ user, index }">
  <div class="user-card">
    <span>{{ index + 1 }}.</span>
    <strong>{{ user.name }}</strong>
    <span>{{ user.email }}</span>
  </div>
</UserList>
```

## Slots Nommés Scopés

Combinez les slots nommés avec les props de slot :

```vue
<!-- DataTable.vue -->
<script setup lang="ts">
type Column = { key: string; label: string };

const props = defineProps<{
  columns: Column[];
  data: Record<string, any>[];
}>();
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="col in columns" :key="col.key">
          <slot :name="`header-${col.key}`" :column="col">
            {{ col.label }}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <td v-for="col in columns" :key="col.key">
          <slot
            :name="`cell-${col.key}`"
            :value="row[col.key]"
            :row="row"
            :rowIndex="rowIndex"
          >
            {{ row[col.key] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>
```

```vue
<!-- Parent -->
<DataTable :columns="columns" :data="users">
  <!-- En-tête personnalisé pour la colonne 'name' -->
  <template #header-name="{ column }">
    <strong>👤 {{ column.label }}</strong>
  </template>
  
  <!-- Cellule personnalisée pour la colonne 'status' -->
  <template #cell-status="{ value }">
    <span :class="['badge', value]">{{ value }}</span>
  </template>
  
  <!-- Cellule personnalisée pour la colonne 'actions' -->
  <template #cell-actions="{ row }">
    <button @click="edit(row)">Modifier</button>
    <button @click="remove(row)">Supprimer</button>
  </template>
</DataTable>
```

## Composants Sans Rendu (Renderless)

Des composants qui ne fournissent que de la logique, sans rendu visuel :

```vue
<!-- MouseTracker.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const x = ref(0);
const y = ref(0);

function update(event: MouseEvent) {
  x.value = event.clientX;
  y.value = event.clientY;
}

onMounted(() => window.addEventListener("mousemove", update));
onUnmounted(() => window.removeEventListener("mousemove", update));
</script>

<template>
  <!-- Aucun affichage visuel, juste un passage de données -->
  <slot :x="x" :y="y"></slot>
</template>
```

```vue
<!-- Le parent contrôle le rendu -->
<MouseTracker v-slot="{ x, y }">
  <div class="cursor-display">
    Souris : {{ x }}, {{ y }}
  </div>
</MouseTracker>

<MouseTracker v-slot="{ x, y }">
  <div 
    class="follower"
    :style="{ left: x + 'px', top: y + 'px' }"
  ></div>
</MouseTracker>
```

## Schéma de Composant Fetch

```vue
<!-- FetchData.vue -->
<script setup lang="ts">
import { ref, watchEffect } from "vue";

const props = defineProps<{
  url: string;
}>();

const data = ref(null);
const error = ref<Error | null>(null);
const loading = ref(true);

watchEffect(async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(props.url);
    if (!response.ok) throw new Error("Échec de la requête");
    data.value = await response.json();
  } catch (e) {
    error.value = e as Error;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <slot
    :data="data"
    :error="error"
    :loading="loading"
    :refetch="
      () => {
        /* déclencher un rechargement */
      }
    "
  ></slot>
</template>
```

```vue
<!-- Parent -->
<FetchData url="/api/users" v-slot="{ data, error, loading }">
  <div v-if="loading">Chargement...</div>
  <div v-else-if="error">Erreur : {{ error.message }}</div>
  <ul v-else>
    <li v-for="user in data" :key="user.id">{{ user.name }}</li>
  </ul>
</FetchData>
```

## TypeScript pour les Props de Slot

Typez vos props de slot :

```vue
<script setup lang="ts">
import { defineSlots } from "vue";

type User = { id: number; name: string };

defineSlots<{
  default(props: { user: User; index: number }): any;
  header(props: { title: string }): any;
  empty(props: {}): any;
}>();
</script>
```

## Ressources

- [Slots Scopés](https://vuejs.org/guide/components/slots.html#scoped-slots) — Documentation officielle Vue sur les slots scopés

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
