---
source_course: "vue-foundations"
source_lesson: "vue-foundations-what-is-vue"
---

# Qu'est-ce que Vue.js ? (What is Vue.js?)

Vue (qui se prononce /vjuː/, comme le mot anglais **view**) est un **framework JavaScript progressif** pour construire des interfaces utilisateur. Créé par Evan You en 2014, Vue a grandi pour devenir l'un des frameworks frontend les plus populaires au monde.

## Le Framework Progressif

Vue est qualifié de "progressif" car il peut s'adapter et passer d'une simple petite librairie à un framework ultra-complet, selon vos besoins :

- **Améliorer du HTML statique** existant, sans aucune étape de compilation (build)
- **S'intégrer comme Web Components** n'importe où sur une page existante
- **Construire des Applications Single-Page** (SPA - Single-Page Applications)
- **Créer des applications Fullstack** avec du Rendu Côté Serveur (SSR - Server-Side Rendering)
- **Générer des Sites Statiques** (SSG) avec l'approche Jamstack
- **Cibler de multiples plateformes** : bureau (desktop), mobile, WebGL, et même le terminal

Vous n'avez pas besoin de tout apprendre d'un coup en amont. Vue grandit avec vous au fur et à mesure que les exigences de votre projet évoluent.

## Fonctionnalités Clés

La puissance de Vue provient de deux fondations majeures :

### 1. Le Rendu Déclaratif (Declarative Rendering)

Vue étend le HTML standard avec une syntaxe de _template_ qui vous permet de décrire facilement à quoi doit ressembler le HTML, en fonction de l'état (state) actuel de vos données JavaScript :

```vue
<template>
  <div id="app">
    <h1>{{ message }}</h1>
    <p>Compteur : {{ count }}</p>
  </div>
</template>
```

Les doubles accolades `{{ }}` (appelées "moustaches") affichent automatiquement et dynamiquement la valeur de vos variables JavaScript.

### 2. La Réactivité (Reactivity)

Vue traque automatiquement les changements d'état de votre JavaScript et met à jour le DOM (la page web) de manière extrêmement efficace quand des modifications surviennent. Vous n'avez jamais à mettre à jour la page manuellement — Vue s'en occupe pour vous :

```javascript
import { ref } from "vue";

const count = ref(0); // Une variable réactive

function increment() {
  count.value++; // Vue met immédiatement à jour le DOM tout seul en tâche de fond !
}
```

## Les Composants à Fichier Unique (SFC - Single-File Components)

Vue utilise un format de fichier ultra-pratique appelé **Single-File Components** (les fameux fichiers `.vue`) qui combine de manière élégante le HTML, le JavaScript et le CSS en un seul et même endroit :

```vue
<script setup>
import { ref } from "vue";

const greeting = ref("Bonjour Vue !");
</script>

<template>
  <p class="greeting">{{ greeting }}</p>
</template>

<style scoped>
/* L'attribut "scoped" garantit que ce CSS ne fuyera PAS ailleurs dans l'application ! */
.greeting {
  color: #42b883;
  font-weight: bold;
}
</style>
```

Cette structure permet de garder le code interconnecté au même endroit, ce qui rend les composants beaucoup plus faciles à lire et à maintenir.

## Les Styles d'API : Options vs Composition

Vue propose deux manières très différentes d'écrire la logique de vos composants :

### L'API d'Options (Options API - L'approche traditionnelle)

Organise le code en "tiroirs" stricts par **type d'option** (`data()`, `methods`, `computed`, etc.) :

```vue
<script>
export default {
  data() {
    return { count: 0 };
  },
  methods: {
    increment() {
      this.count++;
    },
  },
};
</script>
```

### L'API de Composition (Composition API - Moderne et Recommandée)

Organise le code en regroupant la **logique par fonctionnalité métier**, en important spécifiquement les fonctions de Vue dont on a besoin :

```vue
<script setup>
import { ref } from "vue";

const count = ref(0);

function increment() {
  count.value++;
}
</script>
```

**Ce cours utilise 100% l'API de Composition avec le raccourci `<script setup>`, car c'est l'approche recommandée et standard pour Vue 3.5+.** Elle offre :

- Moins de code "robot" inutile (boilerplate)
- Un support de TypeScript infiniment plus robuste
- Une organisation du code nettement plus souple
- Une réutilisation de la logique ultra-facile grâce aux fameux _composables_

## Pourquoi Choisir Vue ?

| Caractéristique                  | Bénéfice direct                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Courbe d'apprentissage douce** | Se base sur les fondations HTML, CSS et JS que vous connaissez déjà.                                                     |
| **Excellente Documentation**     | L'une des plus réputées, claires et exhaustives de tout l'écosystème.                                                    |
| **Polyvalent**                   | Merveilleux pour les tout petits "widgets" comme pour les immenses applications.                                         |
| **Performant**                   | Un DOM Virtuel très rapide et un système de réactivité granulaire redoutable.                                            |
| **Super Outillage**              | Vue DevTools pour inspecter le navigateur, Vite pour le chargement instantané local, et de super librairies officielles. |
| **Écosystème Actif**             | Vue Router (Navigation), Pinia (State Global), Nuxt (Framework fullstack), et des milliers d'outils.                     |
| **Forte Communauté**             | Des millions de développeurs, et des mises à jour majeures très constantes depuis 10 ans.                                |

## Ressources

- [Introduction Officielle à Vue.js](https://vuejs.org/guide/introduction.html) — L'introduction officielle couvrant les concepts de base.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
