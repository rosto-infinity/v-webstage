---
source_course: "vue-component-architecture"
source_lesson: "vue-component-architecture-define-emits"
---

# Définir et Émettre des Événements Personnalisés

Les événements personnalisés permettent aux composants enfants de communiquer avec leurs parents. Dans Vue 3, on utilise `defineEmits()` pour déclarer et typer nos événements.

## Émission d'Événements de Base

```vue
<script setup lang="ts">
const emit = defineEmits<{
  submit: [];
  cancel: [];
}>();

function handleSubmit() {
  // Effectuer la logique de soumission...
  emit("submit");
}

function handleCancel() {
  emit("cancel");
}
</script>

<template>
  <div class="form-actions">
    <button @click="handleCancel">Annuler</button>
    <button @click="handleSubmit">Soumettre</button>
  </div>
</template>
```

## Événements avec Payload

Passez des données avec vos événements :

```vue
<script setup lang="ts">
type User = {
  id: number;
  name: string;
  email: string;
};

const emit = defineEmits<{
  select: [user: User];
  delete: [userId: number];
  search: [query: string, filters: string[]];
}>();

function handleUserSelect(user: User) {
  emit("select", user);
}

function handleDelete(userId: number) {
  if (confirm("Êtes-vous sûr ?")) {
    emit("delete", userId);
  }
}

function handleSearch(query: string) {
  emit("search", query, ["active", "recent"]);
}
</script>
```

## Déclaration Runtime

Syntaxe alternative sans TypeScript :

```vue
<script setup>
const emit = defineEmits({
  // Sans validation
  click: null,

  // Avec validation
  submit: (payload) => {
    if (payload.email && payload.password) {
      return true;
    } else {
      console.warn("Payload de soumission invalide");
      return false;
    }
  },

  // Validation simple
  increment: (amount) => typeof amount === "number",
});
</script>
```

## Écouter les Événements

Les composants parents utilisent `@nom-evenement` :

```vue
<script setup lang="ts">
import UserCard from "./UserCard.vue";

function handleSelect(user) {
  console.log("Sélectionné :", user);
}

function handleDelete(userId) {
  console.log("Suppression de :", userId);
}
</script>

<template>
  <UserCard @select="handleSelect" @delete="handleDelete" />
</template>
```

## Gestionnaires Inline

Pour les cas simples :

```vue
<template>
  <!-- Accéder au payload avec $event -->
  <SearchBox @search="searchQuery = $event" />

  <!-- Fonction fléchée pour plusieurs arguments -->
  <SearchBox @search="(query, filters) => performSearch(query, filters)" />

  <!-- Référence directe à une méthode (payload passé automatiquement) -->
  <UserCard @select="selectUser" />
</template>
```

## Convention de Nommage des Événements

Utilisez camelCase dans `defineEmits`, kebab-case dans les templates :

```vue
<script setup>
const emit = defineEmits({
  updateValue: null, // camelCase en JS
  itemSelected: null,
  formSubmitted: null,
});

emit("updateValue", newValue);
emit("itemSelected", item);
</script>
```

```vue
<!-- Le template parent utilise le kebab-case -->
<MyComponent
  @update-value="handleUpdate"
  @item-selected="handleSelect"
  @form-submitted="handleSubmit"
/>
```

## Validation des Événements en Développement

Les événements validés émettent des avertissements en développement :

```vue
<script setup>
const emit = defineEmits({
  submit: (payload) => {
    if (!payload.email) {
      console.warn("événement submit : email manquant");
      return false;
    }
    if (!payload.password || payload.password.length < 8) {
      console.warn("événement submit : mot de passe invalide");
      return false;
    }
    return true;
  },
});

// Ceci émettra un avertissement en développement
emit("submit", { email: "test@test.com" }); // Mot de passe manquant !
</script>
```

## Bonnes Pratiques

1. **Déclarez toujours les événements** avec `defineEmits`
2. **Utilisez des noms descriptifs** qui décrivent ce qui s'est passé
3. **Validez les payloads** pour les données complexes
4. **Documentez les payloads attendus** avec les types TypeScript
5. **Gardez les payloads simples** - évitez les objets profondément imbriqués

## Ressources

- [Événements de Composants](https://vuejs.org/guide/components/events.html) — Documentation officielle sur l'émission d'événements personnalisés

---

> 📘 _Cette leçon fait partie du cours [Architecture des Composants Vue](https://stanza.dev/courses/vue-component-architecture) sur [Stanza](https://stanza.dev) — la plateforme d'apprentissage native à l'IDE pour les développeurs._
