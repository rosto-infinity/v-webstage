---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-component-v-model"
---

# Le v-model sur les Composants pour la Liaison Bidirectionnelle

`v-model` sur les composants crée une liaison bidirectionnelle entre parent et enfant. C'est du sucre syntaxique pour une combinaison prop + événement.

## Comment Fonctionne v-model sur les Composants

Quand vous écrivez :

```vue
<CustomInput v-model="searchText" />
```

Cela se développe en :

```vue
<CustomInput
  :model-value="searchText"
  @update:model-value="searchText = $event"
/>
```

## Implémenter v-model

Le composant enfant doit :

1. Accepter une prop `modelValue`
2. Émettre des événements `update:modelValue`

```vue
<!-- CustomInput.vue -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<template>
  <input :value="modelValue" @input="handleInput" class="custom-input" />
</template>
```

## Utiliser defineModel() (Vue 3.4+)

Syntaxe simplifiée avec la macro `defineModel` :

```vue
<!-- CustomInput.vue -->
<script setup lang="ts">
const model = defineModel<string>();
</script>

<template>
  <input v-model="model" class="custom-input" />
</template>
```

`defineModel()` retourne un ref qui :

- Se synchronise avec la valeur du parent
- Émet automatiquement lors des changements
- Fonctionne avec `v-model` dans les templates

## v-model Nommé

Utilisez un nom personnalisé à la place de `modelValue` :

```vue
<!-- Parent -->
<UserName v-model:first-name="firstName" v-model:last-name="lastName" />
```

```vue
<!-- UserName.vue -->
<script setup lang="ts">
const firstName = defineModel<string>("firstName");
const lastName = defineModel<string>("lastName");
</script>

<template>
  <input v-model="firstName" placeholder="Prénom" />
  <input v-model="lastName" placeholder="Nom" />
</template>
```

## Liaisons v-model Multiples

Les composants peuvent avoir plusieurs liaisons v-model :

```vue
<!-- Parent -->
<UserForm
  v-model:email="email"
  v-model:password="password"
  v-model:remember="rememberMe"
/>
```

```vue
<!-- UserForm.vue -->
<script setup lang="ts">
const email = defineModel<string>("email");
const password = defineModel<string>("password");
const remember = defineModel<boolean>("remember");
</script>

<template>
  <form>
    <input v-model="email" type="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Mot de passe" />
    <label>
      <input v-model="remember" type="checkbox" />
      Se souvenir de moi
    </label>
  </form>
</template>
```

## Modificateurs v-model

### Modificateurs Intégrés

Les parents peuvent utiliser des modificateurs :

```vue
<CustomInput v-model.trim="text" />
<CustomInput v-model.number="quantity" />
<CustomInput v-model.lazy="message" />
```

### Modificateurs Personnalisés

Accédez aux modificateurs dans l'enfant :

```vue
<script setup lang="ts">
const [model, modifiers] = defineModel<string>({
  set(value) {
    // Appliquer le modificateur capitalize
    if (modifiers.capitalize && value) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
    return value;
  },
});
</script>

<template>
  <input v-model="model" />
</template>
```

```vue
<!-- Parent -->
<CustomInput v-model.capitalize="name" />
```

## Exemple Pratique : Composant de Notation par Étoiles

```vue
<!-- StarRating.vue -->
<script setup lang="ts">
const rating = defineModel<number>({ default: 0 });

const props = withDefaults(
  defineProps<{
    maxStars?: number;
    readonly?: boolean;
  }>(),
  {
    maxStars: 5,
    readonly: false,
  },
);

function setRating(value: number) {
  if (!props.readonly) {
    rating.value = value;
  }
}
</script>

<template>
  <div class="star-rating" :class="{ readonly }">
    <button
      v-for="star in maxStars"
      :key="star"
      type="button"
      :class="{ filled: star <= rating }"
      @click="setRating(star)"
      :disabled="readonly"
    >
      ★
    </button>
  </div>
</template>

<style scoped>
.star-rating button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ddd;
  cursor: pointer;
}

.star-rating button.filled {
  color: #f5c518;
}

.star-rating.readonly button {
  cursor: default;
}
</style>
```

```vue
<!-- Utilisation -->
<template>
  <StarRating v-model="productRating" />
  <StarRating v-model="reviewRating" :max-stars="10" />
  <StarRating :model-value="averageRating" readonly />
</template>
```

## Ressources

- [v-model sur les Composants](https://vuejs.org/guide/components/v-model.html) — Documentation officielle Vue sur le v-model de composant

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
