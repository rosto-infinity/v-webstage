---
source_course: "vue-foundations"
source_lesson: "vue-foundations-text-interpolation"
---

# Interpolation de Texte et Expressions (Text Interpolation)

La syntaxe de template de Vue vous permet de lier (bind) de manière déclarative le DOM affiché aux données sous-jacentes du composant. Au cœur de ce système se trouve **l'interpolation de texte** — la forme la plus basique de liaison de données (Data Binding).

## La Syntaxe Moustache (The Mustache Syntax)

La forme la plus courante de liaison de données est l'interpolation de texte, qui utilise des doubles accolades `{{ }}`, affectueusement surnommées "les moustaches" :

```vue
<script setup>
import { ref } from "vue";

const message = ref("Bonjour, Vue !");
const username = ref("Alice");
</script>

<template>
  <p>{{ message }}</p>
  <p>Bienvenue, {{ username }} !</p>
</template>
```

Le tag Moustache est automatiquement remplacé par la valeur de la propriété correspondante. Mieux encore : il se met à jour instantanément et de façon autonome à chaque fois que cette propriété change dans votre code JavaScript.

## Expressions JavaScript

Vue ne se contente pas d'afficher des variables simples. Vous pouvez écrire de véritables expressions JavaScript valides _à l'intérieur_ des moustaches :

```vue
<script setup>
import { ref } from "vue";

const count = ref(10);
const price = ref(29.99);
const firstName = ref("Jean");
const lastName = ref("Dupont");
const isActive = ref(true);
const items = ref(["Pomme", "Banane", "Cerise"]);
</script>

<template>
  <!-- Arithmétique basique -->
  <p>Compte + 5 = {{ count + 5 }}</p>
  <p>Total : {{ (price * count).toFixed(2) }} €</p>

  <!-- Manipulation de chaînes de caractères (Strings) -->
  <p>Nom complet : {{ firstName + " " + lastName }}</p>
  <p>En majuscules : {{ firstName.toUpperCase() }}</p>

  <!-- Opérateur Ternaire (Hyper fréquent dans Vue) -->
  <p>Statut : {{ isActive ? "Actif" : "Inactif" }}</p>

  <!-- Appels de méthodes natives -->
  <p>Articles : {{ items.join(", ") }}</p>
  <p>Inversé : {{ message.split("").reverse().join("") }}</p>
</template>
```

## Limites des Expressions

Chaque liaison de données ne peut contenir qu'**UNE SEULE expression JavaScript**. Les exemples suivants **NE FONCTIONNENT PAS** et feront planter la page :

```vue
<!-- CECI EST UNE INSTRUCTION (Statement), pas une expression ! -->
{{ let x = 1 }}

<!-- Les blocs If/Else ne sont pas autorisés ici, utilisez des Ternaires à la place -->
{{ if (ok) { return message } }}

<!-- Vous ne pouvez pas chaîner plusieurs expressions avec un point-virgule -->
{{ message; count++ }}
```

### C'est quoi la différence entre une Expression et une Instruction (Statement) ?

- **Expression** : Produit un résultat/une valeur (`count + 1`, `ok ? 'oui' : 'non'`) -> **AUTORISÉ**
- **Instruction** : Réalise une action ou déclare quelque chose (`if`, `for`, `let x = 1`) -> **INTERDIT**

## Appeler des Fonctions

Vous pouvez parfaitement appeler les fonctions/méthodes de votre composant depuis l'intérieur de vos moustaches :

```vue
<script setup>
import { ref } from "vue";

const birthday = ref("1990-05-15");

// Fonction utilitaire classique
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Autre fonction de calcul
function calculateAge(dateString) {
  const birth = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
</script>

<template>
  <p>Date de naissance : {{ formatDate(birthday) }}</p>
  <p>Âge : {{ calculateAge(birthday) }} ans</p>
</template>
```

**⚠️ Attention Danger** : Les fonctions appelées directement dans les templates (les moustaches) seront ré-exécutées **à chaque fois** que le composant se met à jour (re-render) pour n'importe quelle raison. Ces fonctions ne doivent donc produire **AUCUN effet secondaire** (elles ne doivent pas modifier d'autres variables, et encore moins faire des requêtes API/Ajax !).

## Rendu de HTML Brut (v-html)

Les doubles moustaches interprètent toujours vos données comme du "Texte pur" pour des raisons de sécurité. Écrire `<br>` dans une variable affichera littéralement les lettres `<br>` à l'écran.
Pour interpréter de véritables balises HTML, utilisez la _directive_ `v-html` :

```vue
<script setup>
import { ref } from "vue";

const rawHtml = ref('<span style="color: red">Ceci est rouge</span>');
const description = ref(
  "Texte en <strong>Gras</strong> et en <em>italique</em>",
);
</script>

<template>
  <!-- Affiche en texte pur : <span style="color: red">... -->
  <p>{{ rawHtml }}</p>

  <!-- INTERPRÈTE le HTML et l'ajoute au DOM grâce à v-html="" -->
  <p v-html="rawHtml"></p>
  <p v-html="description"></p>
</template>
```

**⚠️ Alerte de Sécurité Critique** : L'affichage dynamique de code HTML provenant d'utilisateurs ouvre la porte aux attaques par injection XSS (Cross-Site Scripting). N'utilisez `v-html` QUE sur du contenu dont vous avez le **contrôle absolu** ! Ne l'utilisez **jamais** pour afficher des commentaires d'utilisateurs ou des entrées de formulaires publics non nettoyés.

## L'Accès Réduit des Expressions

Pour faire simple : le code que vous tapez dans les doubles moustaches `{{ }}` est exécuté dans une "Sandbox" (un bac à sable hyper sécurisé) par Vue. Il n'a accès qu'à :

- Vos variables (`ref`) et fonctions déclarées dans le `<script>`
- Une [liste restrictive et officielle d'objets Javascript globaux](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts) autorisés par Vue (Comme l'objet `Math`, `Date`, `Array`, etc.).

Par exemple, vous ne pouvez pas utiliser `window` ou `document` directement dans les moustaches. Si vous devez absolument y avoir accès, exportez-les d'abord via `app.config.globalProperties` (très rare en pratique).

## Ressources

- [La Syntaxe de Template](https://vuejs.org/guide/essentials/template-syntax.html) — Documentation officielle sur l'interpolation.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
