---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-slot-basics"
---

# Comprendre les Slots

Les slots permettent aux composants parents de passer du contenu de template à leurs composants enfants. Ils sont essentiels pour créer des composants flexibles et réutilisables.

## Le Slot par Défaut

L'utilisation la plus simple d'un slot :

```vue
<!-- Card.vue -->
<template>
  <div class="card">
    <slot></slot>
  </div>
</template>
```

```vue
<!-- Parent -->
<Card>
  <h2>Titre de la Carte</h2>
  <p>Ce contenu va dans le slot !</p>
</Card>
```

Le contenu entre les balises `<Card>` remplace `<slot>`.

## Contenu de Repli (Fallback)

Fournissez un contenu par défaut quand le slot est vide :

```vue
<!-- SubmitButton.vue -->
<template>
  <button type="submit" class="btn">
    <slot>Soumettre</slot>
  </button>
</template>
```

```vue
<!-- Parent -->
<SubmitButton />
<!-- Affiche : Soumettre -->
<SubmitButton>Sauvegarder</SubmitButton>
<!-- Affiche : Sauvegarder -->
<SubmitButton>                          <!-- Affiche : Soumettre (contenu vide) -->
</SubmitButton>
```

## Slots Nommés

Créez plusieurs slots avec des noms :

```vue
<!-- BaseLayout.vue -->
<template>
  <div class="layout">
    <header>
      <slot name="header"></slot>
    </header>

    <main>
      <slot></slot>
      <!-- Slot par défaut -->
    </main>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

Utilisez la directive `v-slot` (ou le raccourci `#`) pour cibler les slots nommés :

```vue
<!-- Parent -->
<BaseLayout>
  <template #header>
    <h1>Titre de ma Page</h1>
    <nav>Navigation ici</nav>
  </template>
  
  <!-- Contenu du slot par défaut -->
  <p>Le contenu principal va ici...</p>
  <p>Plus de contenu...</p>
  
  <template #footer>
    <p>Copyright 2024</p>
  </template>
</BaseLayout>
```

## Raccourci des Slots :

Utilisez `#` à la place de `v-slot:` :

```vue
<template>
  <!-- Syntaxe complète -->
  <template v-slot:header>...</template>
  <template v-slot:footer>...</template>

  <!-- Raccourci -->
  <template #header>...</template>
  <template #footer>...</template>
</template>
```

## Slots Conditionnels

Vérifiez si un slot a du contenu avec `$slots` :

```vue
<!-- Card.vue -->
<script setup>
import { useSlots } from "vue";

const slots = useSlots();
</script>

<template>
  <div class="card">
    <header v-if="slots.header" class="card-header">
      <slot name="header"></slot>
    </header>

    <div class="card-body">
      <slot></slot>
    </div>

    <footer v-if="slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
```

## Noms de Slots Dynamiques

Utilisez des valeurs dynamiques pour les noms de slots :

```vue
<script setup>
import { ref } from "vue";

const currentSlot = ref("header");
</script>

<template>
  <BaseLayout>
    <template #[currentSlot]>
      <p>Ce contenu va dans : {{ currentSlot }}</p>
    </template>
  </BaseLayout>

  <button @click="currentSlot = 'footer'">Déplacer vers le Footer</button>
</template>
```

## Exemple Pratique : Composant Modal

```vue
<!-- Modal.vue -->
<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal">
        <header v-if="$slots.header" class="modal-header">
          <slot name="header"></slot>
          <button class="close-btn" @click="emit('close')">×</button>
        </header>

        <div class="modal-body">
          <slot></slot>
        </div>

        <footer v-if="$slots.footer" class="modal-footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </div>
  </Teleport>
</template>
```

```vue
<!-- Parent -->
<Modal :is-open="showModal" @close="showModal = false">
  <template #header>
    <h2>Confirmer l'Action</h2>
  </template>
  
  <p>Êtes-vous sûr de vouloir continuer ?</p>
  
  <template #footer>
    <button @click="showModal = false">Annuler</button>
    <button @click="confirm">Confirmer</button>
  </template>
</Modal>
```

## Ressources

- [Documentation des Slots](https://vuejs.org/guide/components/slots.html) — Documentation officielle Vue sur les slots

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
