---
source_course: "vue-foundations"
source_lesson: "vue-foundations-understanding-sfc"
---

# Comprendre les Composants à Fichier Unique (SFC)

Les Composants à Fichier Unique (Single-File Components ou **SFCs**) sont la fonctionnalité la plus emblématique de Vue. Ils vous permettent de définir la logique métier, la structure HTML (template), et le design (styles) d'un composant dans un seul et même fichier `.vue`, gardant ainsi le code intimement lié au même endroit.

## Anatomie d'un SFC

Chaque fichier `.vue` peut contenir trois types de blocs de premier niveau :

```vue
<script setup lang="ts">
// La logique JavaScript / TypeScript
</script>

<template>
  <!-- Le template HTML -->
</template>

<style scoped>
/* Les styles CSS */
</style>
```

### Le Bloc `<script setup>`

Il contient la logique JavaScript ou TypeScript de votre composant :

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import MonComposant from "./MonComposant.vue";

// État réactif (State)
const count = ref(0);
const name = ref("Vue");

// Propriétés calculées (Computed)
const doubleCount = computed(() => count.value * 2);

// Fonctions classiques
function increment() {
  count.value++;
}
</script>
```

L'attribut `setup` est une indication magique pour le compilateur qui offre d'énormes avantages :

- **Exposition automatique** : Absolument toutes les variables de premier niveau sont immédiatement disponibles dans le `<template>`
- **Moins de boilerplate** : Plus besoin des interminables instructions `return { ... }` ou `export default`
- **Meilleures performances** : Le code généré final est bien plus optimisé pour le navigateur

### Le Bloc `<template>`

Il contient votre structure HTML, enrichie par la fantastique syntaxe de template de Vue :

```vue
<template>
  <div class="container">
    <h1>{{ name }}</h1>
    <p>Compteur : {{ count }}</p>
    <p>Le double : {{ doubleCount }}</p>

    <button @click="increment">+1</button>

    <!-- Injection directe d'un composant enfant ! -->
    <MonComposant />
  </div>
</template>
```

Fonctionnalités clés :

- **Interpolation** : `{{ expression }}` pour afficher des valeurs à l'écran.
- **Directives** : `v-if`, `v-for`, `@click`, `:prop` pour le comportement dynamique.
- **Utilisation de composants** : Importez et utilisez d'autres composants comme de simples balises HTML.

### Le Bloc `<style>`

Il abrite vos styles CSS applicables à ce composant :

```vue
<style scoped>
.container {
  padding: 1rem;
}

button {
  background: #42b883;
  color: white;
}
</style>
```

L'attribut `scoped` (portée locale) est **absolument crucial** — il s'assure que les styles définis ici ne s'appliqueront _qu'à CE_ composant précis, empêchant à 100% que votre CSS ne "fuie" et ne casse le design d'autres pages.

## Plongée dans les Styles Scoped (Portée Locale)

SANS l'attribut `scoped`, le CSS redevient global et polluera toute votre application :

```vue
<!-- Styles Globaux - Affectera TOUS les boutons de toute l'application Vue ! -->
<style>
button {
  background: red;
}
</style>
```

AVEC `scoped`, Vue ajoute intelligemment des attributs uniques aux balises de votre composant lors de la compilation :

```vue
<!-- Styles Scoped - N'affectera QUE le bouton de ce fichier -->
<style scoped>
button {
  background: green;
}
</style>

<!-- Résultat final compilé par Vite :
<button data-v-7ba5bd90>Cliquer</button>

button[data-v-7ba5bd90] {
  background: green;
}
-->
```

## Fonctionnalités CSS Avancées dans les SFCs

### Les Modules CSS (CSS Modules)

Une alternative à `scoped` : générer des noms de classes mathématiquement uniques :

```vue
<template>
  <!-- Remarquez l'objet $style -->
  <p :class="$style.rubis">Texte magnifique</p>
</template>

<style module>
.rubis {
  color: red;
}
</style>
```

### Le spectaculaire `v-bind()` en plein CSS

Vous pouvez injecter directement des valeurs dynamiques JavaScript AU BEAU MILIEU d'un fichier CSS !

```vue
<script setup>
import { ref } from "vue";

const color = ref("red");
const fontSize = ref(16);
</script>

<template>
  <p class="text">Design totalement dynamique !</p>
  <button @click="color = 'blue'">Passer au Bleu</button>
</template>

<style scoped>
.text {
  /* Le CSS se mettra à jour en temps réel si la variable color change dans le JS ! */
  color: v-bind(color);
  font-size: v-bind(fontSize + "px");
}
</style>
```

### Multiples Blocs de Style

Il est tout à fait autorisé de mélanger CSS global et CSS local dans le même fichier SFC :

```vue
<style>
/* CSS Global pour toute l'app */
body {
  margin: 0;
}
</style>

<style scoped>
/* CSS Local pour le composant actuel */
.wrapper {
  padding: 1rem;
}
</style>
```

## Les Préprocesseurs (SCSS / Less)

Si vous n'aimez pas le CSS classique, vous pouvez utiliser SCSS, Less, ou Stylus directement :

```vue
<style lang="scss" scoped>
$primary: #42b883;

.button {
  background: $primary;

  &:hover {
    background: darken($primary, 10%);
  }
}
</style>
```

N'oubliez pas d'installer le moteur correspondant une seule fois sur votre projet via npm :

```bash
npm install -D sass
```

## Les Bonnes Pratiques Essentielles

1. **Utilisez TOUJOURS `scoped`** par défaut, sauf si vous avez une raison extrêmement spécifique d'avoir besoin d'un style global.
2. **Gardez vos composants ultra concentrés** - Si votre fichier `.vue` commence à dépasser les 300 lignes, scindez-le en plusieurs petits sous-composants enfants.
3. **Privilégiez TypeScript** avec `lang="ts"` pour un code plus strict, autocomplété et robuste.
4. **Rangez vos blocs toujours dans le même ordre strict** : d'abord le `<script setup>`, puis la `<template>`, puis le `<style>`.

## Ressources

- [Les Composants à Fichier Unique (SFC)](https://vuejs.org/guide/scaling-up/sfc.html) — Documentation officielle sur l'anatomie de ces fichiers.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
