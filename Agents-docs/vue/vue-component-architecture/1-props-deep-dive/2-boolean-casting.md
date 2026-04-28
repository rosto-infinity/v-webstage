---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-boolean-casting"
---

# Transtypage Booléen et Bonnes Pratiques des Props

Les props booléennes ont un comportement spécial dans Vue qui reflète celui des attributs booléens HTML. Comprendre ce mécanisme est essentiel pour construire des APIs de composants intuitives.

## Règles de Transtypage Booléen

Lorsqu'une prop est déclarée avec le type `Boolean` :

```vue
<script setup>
const props = defineProps({
  disabled: Boolean,
  visible: Boolean,
  loading: Boolean,
});
</script>
```

Ces usages sont équivalents :

```vue
<!-- Présence = true -->
<MyButton disabled />
<MyButton :disabled="true" />

<!-- Absence = false -->
<MyButton />
<MyButton :disabled="false" />
```

Cela imite le comportement natif HTML comme `<button disabled>`.

## Types Mixtes avec Boolean

Lorsqu'on combine Boolean avec d'autres types, l'ordre compte :

```vue
<script setup>
const props = defineProps({
  // Boolean avant String - transtypage booléen actif
  disabled: [Boolean, String],

  // String avant Boolean - pas de transtypage booléen
  label: [String, Boolean],
});
</script>
```

```vue
<!-- Avec [Boolean, String] -->
<MyComponent disabled />
<!-- disabled = true -->
<MyComponent disabled="" />
<!-- disabled = true -->

<!-- Avec [String, Boolean] -->
<MyComponent label />
<!-- label = '' (chaîne vide) -->
<MyComponent label="" />
<!-- label = '' (chaîne vide) -->
```

## Flux de Données Unidirectionnel

Les props forment un **flux descendant unidirectionnel** :

- Les changements de prop du parent descendent vers l'enfant
- L'enfant ne doit jamais muter les props

```vue
<script setup>
const props = defineProps(["initialValue"]);

// ❌ NE JAMAIS faire ça
function handleClick() {
  props.initialValue = "nouvelle valeur"; // Avertissement !
}
</script>
```

### Schéma 1 : Données Locales depuis une Prop

Utiliser la prop comme valeur initiale :

```vue
<script setup>
import { ref } from "vue";

const props = defineProps(["initialCounter"]);

// Créer un état local initialisé depuis la prop
const counter = ref(props.initialCounter);

// counter est maintenant indépendant et peut être modifié
function increment() {
  counter.value++;
}
</script>
```

### Schéma 2 : Computed depuis une Prop

Dériver des valeurs sans mutation :

```vue
<script setup>
import { computed } from "vue";

const props = defineProps(["size"]);

// Transformer la prop, sans la muter
const normalizedSize = computed(() => {
  return props.size.trim().toLowerCase();
});
</script>
```

### Schéma 3 : Émettre les Changements au Parent

Demander au parent de mettre à jour :

```vue
<script setup>
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

function handleInput(event) {
  // Ne pas muter - émettre !
  emit("update:modelValue", event.target.value);
}
</script>

<template>
  <input :value="modelValue" @input="handleInput" />
</template>
```

## Conventions de Nommage des Props

### camelCase en JavaScript

```vue
<script setup>
const props = defineProps({
  greetingMessage: String,
  itemCount: Number,
  isVisible: Boolean,
});
</script>
```

### kebab-case dans les Templates

```vue
<template>
  <MyComponent greeting-message="Bonjour" :item-count="5" is-visible />
</template>
```

Vue convertit automatiquement entre les deux.

## Props Objet : Passer Plusieurs Valeurs

Liez un objet pour passer toutes ses propriétés comme props :

```vue
<script setup>
import { reactive } from "vue";

const post = reactive({
  id: 1,
  title: "Mon Article",
  author: "Jean",
  publishedAt: "2024-01-15",
});
</script>

<template>
  <!-- Passer les props individuellement -->
  <BlogPost
    :id="post.id"
    :title="post.title"
    :author="post.author"
    :published-at="post.publishedAt"
  />

  <!-- Ou étaler toutes les props d'un coup -->
  <BlogPost v-bind="post" />
</template>
```

## Résumé des Bonnes Pratiques

1. **Utilisez TypeScript** pour la vérification des types à la compilation
2. **Validez toujours** les props dans les composants réutilisables
3. **Utilisez des fonctions factory** pour les valeurs par défaut objet/tableau
4. **Ne mutez jamais les props** - utilisez un état local ou émettez des événements
5. **Nommez les booléens positivement** (`isVisible` et non `isHidden`)
6. **Documentez clairement les props requises**
7. **Fournissez des valeurs par défaut sensées** quand c'est possible

## Ressources

- [Flux de Données Unidirectionnel](https://vuejs.org/guide/components/props.html#one-way-data-flow) — Comprendre le flux de données unidirectionnel de Vue

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
