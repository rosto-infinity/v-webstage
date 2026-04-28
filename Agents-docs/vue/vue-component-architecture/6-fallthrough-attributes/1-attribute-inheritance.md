---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-attribute-inheritance"
---

# Comprendre l'Héritage des Attributs

Les attributs hérités (fallthrough) sont des attributs ou des écouteurs d'événements passés à un composant qui ne sont pas déclarés comme props ou emits. Ils se "propagent" automatiquement vers l'élément racine du composant.

## Fallthrough de Base

```vue
<!-- MyButton.vue -->
<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>
```

```vue
<!-- Parent -->
<MyButton class="primary" id="submit-btn" @click="handleClick">
  Soumettre
</MyButton>
```

HTML rendu :

```html
<button class="btn primary" id="submit-btn">Soumettre</button>
```

La `class`, l'`id` et `@click` s'appliquent automatiquement au `<button>` racine.

## Fusion des Classes et Styles

Les classes et styles fusionnent intelligemment :

```vue
<!-- MyInput.vue -->
<template>
  <input class="base-input" style="border: 1px solid gray" />
</template>
```

```vue
<!-- Parent -->
<MyInput class="large" style="padding: 1rem" />
```

Résultat :

```html
<input class="base-input large" style="border: 1px solid gray; padding: 1rem" />
```

## Héritage des Écouteurs v-on

Les écouteurs d'événements se propagent aussi :

```vue
<!-- MyButton.vue -->
<template>
  <button><slot></slot></button>
</template>
```

```vue
<!-- Parent -->
<MyButton @click="onClick" @focus="onFocus">
  Cliquer ici
</MyButton>
```

`@click` et `@focus` se déclencheront tous les deux lors de l'interaction avec le bouton.

## Désactiver l'Héritage des Attributs

Parfois vous ne voulez pas l'héritage automatique :

```vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <div class="wrapper">
    <!-- Les attributs ne s'appliquent pas automatiquement au wrapper -->
    <input class="input" />
  </div>
</template>
```

## Accéder aux Attributs Hérités

Utilisez `useAttrs()` pour accéder et appliquer manuellement les attributs :

```vue
<script setup lang="ts">
import { useAttrs } from "vue";

defineOptions({
  inheritAttrs: false,
});

const attrs = useAttrs();
</script>

<template>
  <div class="input-wrapper">
    <label>{{ label }}</label>
    <!-- Appliquer attrs à l'input, pas au wrapper -->
    <input v-bind="attrs" class="input" />
  </div>
</template>
```

```vue
<!-- Parent -->
<MyInput
  label="Email"
  type="email"
  placeholder="Saisir l'email"
  @focus="onFocus"
/>
```

Maintenant `type`, `placeholder` et `@focus` s'appliquent à `<input>`, pas au div wrapper.

## Composants Multi-Racines

Les composants avec plusieurs éléments racines n'héritent pas automatiquement :

```vue
<!-- MultiRoot.vue -->
<template>
  <header>Entête</header>
  <main>Principal</main>
  <footer>Pied de page</footer>
</template>
```

```vue
<!-- Parent -->
<MultiRoot class="styled" />
<!-- Avertissement ! Pas d'héritage automatique -->
```

Vous devez lier explicitement les attrs :

```vue
<script setup>
import { useAttrs } from "vue";

const attrs = useAttrs();
</script>

<template>
  <header>Entête</header>
  <main v-bind="attrs">Principal</main>
  <footer>Pied de page</footer>
</template>
```

## Exemple Pratique : Composant Champ de Formulaire

```vue
<!-- FormInput.vue -->
<script setup lang="ts">
import { useAttrs, computed } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  label: string;
  modelValue: string;
  error?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const attrs = useAttrs();

// Séparer la classe des autres attrs
const inputClass = computed(() => {
  const classes = ["input"];
  if (props.error) classes.push("input-error");
  if (attrs.class) classes.push(attrs.class as string);
  return classes.join(" ");
});

const inputAttrs = computed(() => {
  const { class: _, ...rest } = attrs;
  return rest;
});
</script>

<template>
  <div class="form-group">
    <label :for="attrs.id || undefined">{{ label }}</label>
    <input
      :value="modelValue"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :class="inputClass"
      v-bind="inputAttrs"
    />
    <span v-if="error" class="error">{{ error }}</span>
  </div>
</template>
```

```vue
<!-- Utilisation -->
<FormInput
  v-model="email"
  label="Adresse Email"
  type="email"
  id="email-input"
  placeholder="vous@exemple.com"
  class="large"
  required
  @focus="handleFocus"
  :error="emailError"
/>
```

## Bonnes Pratiques

1. **Gardez inheritAttrs: true** pour les composants wrappers simples
2. **Désactivez et appliquez manuellement** quand vous avez besoin de contrôler où vont les attrs
3. **Documentez** quels attributs votre composant transmet
4. **Faites attention aux événements** - ils se propagent aussi
5. **Utilisez TypeScript** pour typer vos attrs attendus si possible

## Ressources

- [Attributs Hérités](https://vuejs.org/guide/components/attrs.html) — Documentation officielle Vue sur l'héritage des attributs

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
