---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-compiler-macros"
---

# Macros de Compilation : defineProps, defineEmits, et Plus

`<script setup>` fournit des macros de compilation spéciales qui n'ont pas besoin d'être importées. Elles sont transformées au moment de la compilation.

## defineProps

Déclarez les props que votre composant accepte :

```vue
<script setup lang="ts">
// Déclaration à l'exécution (Runtime)
const props = defineProps({
  title: String,
  count: {
    type: Number,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

// Déclaration basée sur les types (recommandée avec TypeScript)
const props = defineProps<{
  title?: string;
  count: number;
  disabled?: boolean;
}>();

// Accéder aux props
console.log(props.count);
</script>
```

### withDefaults pour les Props basées sur les Types

```vue
<script setup lang="ts">
type Props = {
  msg?: string;
  labels?: string[];
  count?: number;
};

const props = withDefaults(defineProps<Props>(), {
  msg: "Bonjour",
  labels: () => ["un", "deux"], // Factory function pour les non-primitifs
  count: 0,
});
</script>
```

## defineEmits

Déclarez les événements que votre composant peut émettre :

```vue
<script setup lang="ts">
// Déclaration à l'exécution
const emit = defineEmits(["update", "delete"]);

// Déclaration basée sur les types
const emit = defineEmits<{
  (e: "update", id: number, value: string): void;
  (e: "delete", id: number): void;
}>();

// Raccourci Vue 3.3+
const emit = defineEmits<{
  update: [id: number, value: string];
  delete: [id: number];
}>();

// Émettre des événements
emit("update", 1, "nouvelle valeur");
emit("delete", 1);
</script>
```

## defineModel (Vue 3.4+)

Simplifie la liaison bidirectionnelle (two-way binding) pour `v-model` :

```vue
<!-- Composant enfant -->
<script setup>
// Remplace le pattern props + emit pour v-model
const modelValue = defineModel()

// Avec des options
const count = defineModel('count', {
  type: Number,
  default: 0
})

// TypeScript
const modelValue = defineModel<string>()
const count = defineModel<number>('count', { required: true })
</script>

<template>
  <input :value="modelValue" @input="modelValue = $event.target.value" />
</template>

<!-- Parent -->
<template>
  <MyInput v-model="texte" v-model:count="compteur" />
</template>
```

## defineExpose

Exposez des propriétés au parent via les références de template (template refs) :

```vue
<!-- Enfant -->
<script setup>
import { ref } from "vue";

const count = ref(0);
const privateData = ref("secret");

function reset() {
  count.value = 0;
}

// Seuls ces éléments sont accessibles via template ref
defineExpose({
  count,
  reset,
});
</script>

<!-- Parent -->
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const childRef = ref<InstanceType<typeof Child> | null>(null)

onMounted(() => {
  console.log(childRef.value?.count)  // Fonctionne
  childRef.value?.reset()             // Fonctionne
  // childRef.value?.privateData      // undefined
})
</script>

<template>
  <Child ref="childRef" />
</template>
```

## defineOptions (Vue 3.3+)

Définissez les options du composant sans bloc `<script>` séparé :

```vue
<script setup>
defineOptions({
  name: "NomPersonnalise",
  inheritAttrs: false,
  customOptions: {
    /* ... */
  },
});
</script>
```

## defineSlots (Vue 3.3+)

Fournir des indications de type pour les slots :

```vue
<script setup lang="ts">
const slots = defineSlots<{
  default(props: { message: string }): any;
  header(props: { title: string }): any;
  footer(): any;
}>();
</script>
```

## useSlots et useAttrs

Accéder aux slots et aux attributs implicites (fallthrough attributes) :

```vue
<script setup>
import { useSlots, useAttrs } from "vue";

const slots = useSlots();
const attrs = useAttrs();

// Vérifier si le slot existe
if (slots.header) {
  console.log("Slot header fourni");
}

// Accéder aux attributs implicites
console.log(attrs.class, attrs.style);
</script>
```

## Ressources

- [defineProps et defineEmits](https://vuejs.org/api/sfc-script-setup.html#defineprops-defineemits) — Documentation officielle des macros de compilation

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
