---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-options-to-composition"
---

# Le Grand Guide de Migration : Options API vers Composition API

Apprenez à convertir pas à pas un vieux composant complexe de l'API d'Options à la splendeur et concision de l'API de Composition (`<script setup>`).

## Comparaison Côte-à-Côte Complète

### Avant: En Options API Lourd (Vue 2 et Vue 3 classique)

```vue
<script>
export default {
  // 1. Les Props (Longues à écrire)
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },

  // 2. Les Evénenements emits
  emits: ["update", "delete"],

  // 3. La Data Initiale
  data() {
    return {
      user: null,
      loading: false,
      error: null,
    };
  },

  // 4. Les Variables Dérivées
  computed: {
    fullName() {
      // CAUCHEMAR DU 'this' constant !
      return this.user ? `${this.user.firstName} ${this.user.lastName}` : "";
    },
    isAdmin() {
      return this.user?.role === "admin";
    },
  },

  // 5. Les Watchers (Complexe en Objet lourd)
  watch: {
    userId: {
      immediate: true,
      handler(newId) {
        this.fetchUser(newId);
      },
    },
  },

  // 6. Les Fonctions pures
  methods: {
    async fetchUser(id) {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`/api/users/${id}`);
        this.user = await response.json();
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    handleUpdate() {
      this.$emit("update", this.user); // Le 'this' partout
    },
    handleDelete() {
      this.$emit("delete", this.userId);
    },
  },

  // 7. Cycle de Vie totalement à la fin
  mounted() {
    console.log("Composant monté");
  },
};
</script>
```

### Après: L'Équivalent Divin en Composition API (`<script setup>`)

```vue
<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";

// 1. Props en pur TypeScript Typé !
const props = defineProps<{
  userId: number;
}>();

// 2. Emits Typés (Autocomplétion !)
const emit = defineEmits<{
  update: [user: User];
  delete: [userId: number];
}>();

// 3. Data (L'état réactif via des Variables Ref Isolées et plus petites)
const user = ref<User | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// 4. Computed (Plus aucun `this.` de partout ! Juste une lecture de .value)
const fullName = computed(() =>
  user.value ? `${user.value.firstName} ${user.value.lastName}` : "",
);
const isAdmin = computed(() => user.value?.role === "admin");

// 5. Les Methodes deviennent de SUPER SIMPLES FONCTIONS JS CLASSIQUES !
async function fetchUser(id: number) {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(`/api/users/${id}`);
    user.value = await response.json();
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}

function handleUpdate() {
  if (user.value) {
    emit("update", user.value); // Appel de la variable globale 'emit'
  }
}

function handleDelete() {
  emit("delete", props.userId); // Appel direct de 'props.userId'
}

// 6. Watch plus simple et groupé logiquement proche de la variable
watch(
  () => props.userId,
  (newId) => fetchUser(newId),
  { immediate: true },
);

// 7. Cycle de Vie à appeler où l'on veut !
onMounted(() => {
  console.log("Composant monté !");
});
</script>
```

## Le Tableau Ultime De Translation

| Options API (Le Vieux) | Composition API (Le Moderne)                                                                                                     |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `props: {}`            | `defineProps<{}>()`                                                                                                              |
| `emits: []`            | `defineEmits<{}>()`                                                                                                              |
| `data()`               | Variable Simple: `ref()` / Objet Complexe: `reactive()`                                                                          |
| `computed: {}`         | `const truc = computed(() => ...)`                                                                                               |
| `watch: {}`            | `watch(() => ...)`                                                                                                               |
| `methods: {}`          | Simples et Classiques fonctions JS !                                                                                             |
| `mounted()`            | `onMounted()`                                                                                                                    |
| `this.xxx`             | Exterminé ! Remplacé par un Accès global direct à votre variable par son nom ou par `.value` (Dépent de si c'est prop ou un Ref) |
| `this.$emit()`         | `emit()` depuis le defineEmits !                                                                                                 |

## La Puissance Absolue : Extraire Vers des Composables Externe

Soudainement pendant la migration de votre gros fichier lourd `.vue`, vous vous rendez compte que vous pouvez extraire par copie-collée la superbe logique indépendante dans un fichier JS externe propre :

```typescript
// Le grand fichier logique à part: composables/useUser.ts
import { ref, watch, computed, type Ref } from "vue";

export function useUser(userId: Ref<number>) {
  // Accepte un prop !
  // Toute les refs y vont
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchUser() {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`/api/users/${userId.value}`);
      user.value = await response.json();
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  watch(userId, fetchUser, { immediate: true });

  const fullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : "",
  );

  return { user, loading, error, fullName, refetch: fetchUser };
}
```

Ce qui fait que notre grand et lourd Composant `.vue` de l'UI Web devient **extraordinairement beau et ultra simple** :

```vue
<!-- MonComposantSuperPro.vue -->
<script setup lang="ts">
import { toRef } from "vue"; // Indispensable pour garder la réactivité d'un prop parent
import { useUser } from "@/composables/useUser";

const props = defineProps<{ userId: number }>();

const emit = defineEmits<{
  update: [user: User];
  delete: [userId: number];
}>();

// !================ MAGIQUE !================
// Plus de 25 lignes de code d'interfaces effacées et injectées par cette simple ligne !
const { user, loading, error, fullName } = useUser(toRef(props, "userId"));
// !==========================================

function handleUpdate() {
  if (user.value) emit("update", user.value);
}
</script>

<template>
  <div v-if="loading">Chargement...</div>
</template>
```

## Ressources Complémentaires

- [Section de FAQ sur l'API de Composition (FR)](https://vuejs.org/guide/extras/composition-api-faq.html) — Les grandes réponses fréquentes sur la comparaison finale et pourquoi l'API de Composition a définitivement écrasé l'ancienne API d'Options de Vue 2.

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
