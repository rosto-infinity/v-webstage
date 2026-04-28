---
source_course: "vue-foundations"
source_lesson: "vue-foundations-event-modifiers"
---

# Les Modificateurs d'Événements (Event Modifiers)

Les modificateurs d'événements sont des suffixes spéciaux (mots-clés) qui permettent de manipuler le comportement standard des événements HTML, directement depuis le template. Ils vous évitent d'avoir à écrire les barbants `event.preventDefault()` ou `event.stopPropagation()` à l'intérieur de vos fonctions JavaScript.

## Les Modificateurs d'Événement Courants

### `.prevent` - Empêcher le Comportement par Défaut

```vue
<template>
  <!-- SANS modificateur -->
  <form @submit="handleSubmit">
    <!-- Obligation d'ajouter event.preventDefault() dans handleSubmit pour empêcher la page de recharger -->
  </form>

  <!-- AVEC modificateur - Tellement plus propre ! -->
  <!-- La soumission classique (rechargement) du formulaire est instantanément bloquée -->
  <form @submit.prevent="handleSubmit"></form>

  <!-- Empêcher le comportement sans même exécuter de fonction derrière -->
  <form @submit.prevent></form>

  <!-- Empêcher un lien <a> de nous rediriger ailleurs -->
  <a href="/" @click.prevent="handleClick"
    >Rester sur cette page et exécuter du JS</a
  >
</template>
```

### `.stop` - Stopper la Propagation (Bubbling)

```vue
<script setup>
function handleParentClick() {
  console.log("Parent cliqué");
}

function handleChildClick() {
  console.log("Enfant cliqué");
}
</script>

<template>
  <!-- Un clic à l'intérieur déclenche ça : -->
  <div @click="handleParentClick" class="parent">
    <!-- SANS .stop, cliquer sur ce bouton loguera "Enfant cliqué" PUIS "Parent cliqué" (Remontée / Bubbling) -->
    <button @click="handleChildClick">Normal</button>

    <!-- AVEC .stop, SEUL l'enfant s'exécutera. L'événement est tué avant de remonter à la DIV parente. -->
    <button @click.stop="handleChildClick">Stoppé</button>
  </div>
</template>
```

### `.once` - Se déclencher UNE SEULE fois

```vue
<template>
  <!-- Le gestionnaire ne s'exécutera que lors du TOUT PREMIER clic -->
  <button @click.once="showWelcome">Afficher la Bienvenue</button>

  <!-- Très pratique pour des initialisations uniques (comme lancer une vidéo) -->
  <video @play.once="trackVideoStart" />
</template>
```

### `.self` - Déclencher uniquement sur l'élément exact

```vue
<template>
  <!-- L'événement 'click' doit provenir exactement de CETTE <div> pure, et pas de ses balises enfants -->
  <div @click.self="handleDivClick" class="container">
    <button>Cliquer ici ne déclenchera PAS le click sur la div parente</button>
    <p>Cliquer ici non plus</p>
  </div>
</template>
```

### `.capture` - Utiliser le Mode Capture

```vue
<template>
  <!-- Capture l'événement en "descente" (phase capture de JS), donc AVANT l'élément interne affecté -->
  <div @click.capture="handleCapture">
    <button @click="handleClick">Cliquer</button>
  </div>
  <!-- handleCapture s'exécutera TOUJOURS AVANT a fonction handleClick ! -->
</template>
```

### `.passive` - Améliorer les Performances de Scroll

```vue
<template>
  <!-- Indique au navigateur qu'on ne fera JAMAIS de preventDefault(), accélérant le défilement ! -->
  <div @scroll.passive="onScroll">Un très long contenu défilant...</div>

  <!-- Extrêmement utile pour les événements tactiles sur mobile -->
  <div @touchmove.passive="onTouchMove">...</div>
</template>
```

## Chaîner les Modificateurs

Vous pouvez parfaitement assembler plusieurs modificateurs les uns à la suite des autres :

```vue
<template>
  <!-- Stoppe la propagation ET Empêche la redirection -->
  <a @click.stop.prevent="handleClick" href="/">Lien</a>

  <!-- Ne se lance qu'une seule fois ET Empêche la redirection -->
  <form @submit.once.prevent="handleSubmit">...</form>

  <!-- L'ordre importe ! ".self.prevent" n'empêchera le comportement que si le clic est SUR l'élément lui-même -->
  <div @click.self.prevent="onClick">...</div>
</template>
```

## Les Modificateurs de Clavier (Key Modifiers)

Une des _killer features_ de Vue : écouter des touches précises du clavier hyper facilement :

```vue
<template>
  <!-- Les touches classiques fréquentes -->
  <input @keyup.enter="submit" />
  <!-- Touche "Entrée" -->
  <input @keyup.tab="nextField" />
  <!-- Tabulation -->
  <input @keyup.delete="clearInput" />
  <!-- Captent Delete ET Retour Arrière ! -->
  <input @keyup.esc="cancel" />
  <!-- Touche Échap -->
  <input @keyup.space="togglePlay" />
  <!-- Barre d'Espace -->

  <!-- Flèches directionnelles -->
  <input @keyup.up="previousItem" />
  <input @keyup.down="nextItem" />
  <input @keyup.left="goBack" />
  <input @keyup.right="goForward" />
</template>
```

### Les Touches Systèmes

```vue
<template>
  <!-- Combos avec Ctrl / Cmd -->
  <input @keyup.ctrl.enter="submitForm" />
  <!-- Ctrl + Entrée -->
  <input @keyup.meta.s="saveDocument" />
  <!-- Cmd sur Mac / Touche Windows sur PC  -->
  <input @keyup.alt.a="selectAll" />
  <input @keyup.shift.tab="previousField" />

  <!-- Combiner plusieurs touches de contrôle en même temps !! -->
  <input @keyup.ctrl.shift.s="saveAs" />
</template>
```

### Le Modificateur `.exact`

Exige que SEULEMENT la stricte combinaison demandée soit pressée, aucune autre touche parasite :

```vue
<template>
  <!-- Se déclenche même si Alt ou Shift sont pressées en même temps que Ctrl -->
  <button @click.ctrl="onClick">A</button>

  <!-- Se déclenche UNIQUEMENT si SEUL Ctrl est pressé, et rien d'autre -->
  <button @click.ctrl.exact="onCtrlClick">A</button>

  <!-- Se déclenche UNIQUEMENT si AUCUNE touche spéciale (ctrl/alt/shift) n'est pressée -->
  <button @click.exact="onClick">A</button>
</template>
```

## Modificateurs pour les Clics de Souris

```vue
<template>
  <!-- N'écouter que certains boutons précis de la souris -->
  <button @click.left="onLeftClick">Clic Gauche (Par défaut)</button>
  <button @click.right="onRightClick">Clic Droit</button>
  <button @click.middle="onMiddleClick">Clic Molette centrale</button>

  <!-- Bloquer le menu par défaut natif de Windows lors d'un vrai clic droit -->
  <div @contextmenu.prevent="showCustomMenu">
    Faites un clic droit pour ouvrir MON propre menu personnalisé !
  </div>
</template>
```

## Cas Pratique : Navigation Totale au Clavier d'une Liste

```vue
<script setup>
import { ref } from "vue";

const items = ref(["Accueil", "À Propos", "Contact", "Aide"]);
const selectedIndex = ref(0); // On traque l'élément actuellement sélectionné

function selectPrevious() {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
}

function selectNext() {
  if (selectedIndex.value < items.value.length - 1) {
    selectedIndex.value++;
  }
}

function activateItem() {
  console.log("Section confirmée :", items.value[selectedIndex.value]);
}
</script>

<template>
  <!-- Un composant de menu génial, 100% navigable au clavier de manière accessible ! -->
  <ul
    tabindex="0"
    @keyup.up.prevent="selectPrevious"
    @keyup.down.prevent="selectNext"
    @keyup.enter="activateItem"
  >
    <li
      v-for="(item, index) in items"
      :key="item"
      :class="{ selected: index === selectedIndex }"
      @click="selectedIndex = index"
    >
      {{ item }}
    </li>
  </ul>
</template>
```

## Ressources

- [Modificateurs d'Événements](https://vuejs.org/guide/essentials/event-handling.html#event-modifiers) — Documentation officielle.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
