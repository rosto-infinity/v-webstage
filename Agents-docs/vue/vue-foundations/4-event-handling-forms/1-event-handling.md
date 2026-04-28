---
source_course: "vue-foundations"
source_lesson: "vue-foundations-event-handling"
---

# Gestion des Événements avec v-on (Event Handling)

Vue utilise la directive `v-on` pour écouter (listener) les événements du DOM et exécuter du code JavaScript lorsqu'ils sont déclenchés. C'est exactement comme cela que vous rendez vos applications interactives.

## Écoute d'Événement Basique

Utilisez la syntaxe `v-on:nom_evenement="fonction"` pour écouter les événements natifs :

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}
</script>

<template>
  <p>Compteur : {{ count }}</p>
  <!-- On écoute l'événement 'click' natif -->
  <button v-on:click="increment">Cliquez-moi</button>
</template>
```

## Le Raccourci Ultime : `@`

Le symbole `@` est le raccourci universel pour `v-on:` :

```vue
<template>
  <!-- Ces deux lignes font EXACTEMENT la même chose -->
  <button v-on:click="increment">Cliquer</button>
  <button @click="increment">Cliquer</button>

  <!-- L'Arobase (@) est la convention standard absolue que tout le monde utilise -->
  <button @click="handleClick">Cliquer</button>
  <input @input="handleInput" />
  <form @submit="handleSubmit">...</form>
</template>
```

## Gestionnaires "En Ligne" (Inline Handlers)

Pour des opérations toutes simples (comme incrémenter une valeur), vous pouvez écrire le code JavaScript directement dans le template :

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);
const message = ref("");
</script>

<template>
  <!-- Expression simple en ligne -->
  <button @click="count++">Incrémenter</button>
  <button @click="count--">Décrémenter</button>
  <button @click="count = 0">Reset</button>

  <!-- Fonction fléchée complète en ligne (Plus rare) -->
  <button @click="() => (count += 10)">Ajouter 10</button>

  <!-- Multiples instructions (séparées par un point-virgule) -->
  <button
    @click="
      count++;
      message = 'A cliqué !';
    "
  >
    Cliquer
  </button>
</template>
```

## Gestionnaires par Méthode (Method Handlers)

Pour des logiques plus lourdes, pointez toujours vers une fonction définie dans votre `<script setup>` :

```vue
<script setup>
import { ref } from 'vue'

// Tableau typé en TypeScript
const items = ref<string[]>([])

function addItem() {
  const item = `Élément ${items.value.length + 1}`
  items.value.push(item)
}

function removeItem(index: number) {
  items.value.splice(index, 1)
}

function clearAll() {
  if (confirm('Voulez-vous vraiment tout supprimer ?')) {
    items.value = []
  }
}
</script>

<template>
  <button @click="addItem">Ajouter Élément</button>
  <button @click="clearAll">Tout vider</button>

  <ul>
    <li v-for="(item, index) in items" :key="index">
      {{ item }}
      <!-- On passe l'index en argument direct de la fonction ! -->
      <button @click="removeItem(index)">Supprimer</button>
    </li>
  </ul>
</template>
```

## Accéder à l'Objet Événement Natif (`event`)

Vue passe toujours l'objet d'événement natif du DOM (`Event` ou `MouseEvent`) par défaut au premier paramètre de votre fonction si vous ne mettez pas de parenthèses de votre côté :

```vue
<script setup>
function handleClick(event: MouseEvent) {
  console.log('Bouton cliqué !')
  console.log('Cible (Tag HTML ciblé) :', event.target)
  console.log('Position de la souris :', event.clientX, event.clientY)
}

function handleInput(event: Event) {
  // L'attribut `.value` est propre aux inputs. On doit typer en HTMLInputElement pour TS.
  const target = event.target as HTMLInputElement
  console.log('Valeur tapée au clavier :', target.value)
}
</script>

<template>
  <!-- Aucun argument passé = Vue injecte automatique `event` ! -->
  <button @click="handleClick">Cliquez-moi</button>
  <input @input="handleInput" />
</template>
```

### Passer des Arguments ET récupérer l'Événement (`$event`)

Parfois, vous avez besoin de passer vos propres paramètres (ex: un ID) MAIS vous avez VRAIMENT besoin aussi du `event` envoyé par le navigateur. Dans ce cas, utilisez la variable magique `$event` fournie par Vue :

```vue
<script setup>
function handleAction(action: string, event: MouseEvent) {
  console.log(`Action demandée : ${action}`)
  console.log('Objet Événement natif :', event)
}

function handleItemClick(itemId: number, event: MouseEvent) {
  // Par exemple, pour l'empêcher de bouillonner vers les DIV parents (Bubbling)
  event.stopPropagation()
  console.log(`Clic sur l'élément N°${itemId}`)
}
</script>

<template>
  <!-- On passe "save" ET l'événement système magique $event -->
  <button @click="handleAction('save', $event)">Sauvegarder</button>

  <div @click="console.log('Le parent est cliqué !')">
    <button @click="handleItemClick(42, $event)">Objet 42</button>
  </div>
</template>
```

## Liste des Événements Courants

```vue
<template>
  <!-- Événements Souris -->
  <button @click="onClick">Clic</button>
  <button @dblclick="onDoubleClick">Double Clic</button>
  <div @mouseenter="onMouseEnter">Souris qui entre (Hover)</div>
  <div @mouseleave="onMouseLeave">Souris qui sort</div>

  <!-- Événements Clavier -->
  <input @keydown="onKeyDown" />
  <input @keyup="onKeyUp" />

  <!-- Événements de Formulaires -->
  <input @input="onInput" />
  <!-- À chaque touche frappée -->
  <input @change="onChange" />
  <!-- Uniquement quand on perd le focus -->
  <input @focus="onFocus" />
  <input @blur="onBlur" />
  <form @submit="onSubmit">...</form>

  <!-- Autres événements utiles -->
  <div @scroll="onScroll">Contenu scrollable (barre défilante)</div>
  <img @load="onImageLoad" />
  <!-- Image chargée avec succès -->
  <img @error="onImageError" />
  <!-- Échec lors du chargement -->
</template>
```

## Ressources

- [Gestion des Événements](https://vuejs.org/guide/essentials/event-handling.html) — Documentation officielle.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
