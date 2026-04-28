---
source_course: "vue-foundations"
source_lesson: "vue-foundations-creating-first-project"
---

# Créer votre Premier Projet Vue (First Project)

Créons ensemble votre tout premier projet Vue en utilisant l'outil officiel de génération (`create-vue`). Cet outil configure un projet Vue moderne propulsé par **Vite**, vous offrant une expérience de développement incroyablement rapide.

## Créer un Nouveau Projet

Ouvrez votre terminal et tapez :

```bash
npm create vue@latest
```

Ou avec d'autres gestionnaires de paquets :

```bash
# Avec pnpm (Recommandé)
pnpm create vue@latest

# Avec yarn
yarn create vue

# Avec bun
bun create vue@latest
```

## Configuration du Projet

L'outil va vous poser plusieurs questions. Pour votre tout premier projet, nous vous recommandons ces réponses :

```text
✔ Nom du projet : my-vue-app
✔ Add TypeScript? Yes  (Oui, toujours !)
✔ Add JSX Support? No  (Non)
✔ Add Vue Router? No   (Non, nous l'ajouterons plus tard)
✔ Add Pinia? No        (Non, nous l'ajouterons plus tard)
✔ Add Vitest? No       (Non)
✔ Add an End-to-End Testing Solution? No (Non)
✔ Add ESLint for code quality? Yes       (Oui)
✔ Add Prettier for code formatting? Yes  (Oui)
✔ Add Vue DevTools extension? Yes        (Oui)
```

## Installer les Dépendances et Lancer

```bash
cd my-vue-app
npm install  # (ou pnpm install)
npm run dev  # (ou pnpm dev)
```

Vous verrez apparaître dans votre terminal :

```text
  VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Ouvrez **http://localhost:5173** dans votre navigateur web pour voir votre application Vue tourner parfaitement !

## Structure du Projet

Votre projet possède l'arborescence suivante :

```text
my-vue-app/
├── node_modules/        # Les dépendances (ne jamais toucher)
├── public/              # Assets statiques (servis tels quels, ex: favicon)
│   └── favicon.ico
├── src/                 # VOS CODES SOURCES (Là où on travaille)
│   ├── assets/          # Assets qui seront moulinés par Vite (images, vrai CSS)
│   ├── components/      # Vos composants Vue réutilisables (.vue)
│   │   └── HelloWorld.vue
│   ├── App.vue          # Le composant RACINE de l'application
│   └── main.ts          # Le Point d'Entrée JavaScript de l'application
├── index.html           # Le Point d'Entrée HTML de l'application
├── package.json         # Liste des dépendances et scripts
├── tsconfig.json        # Configuration TypeScript
├── vite.config.ts       # Configuration de Vite (le moteur de compilation)
└── .eslintrc.cjs        # Configuration du linter ESLint
```

## Comprendre les Fichiers Clés

### `index.html`

Le point d'entrée HTML pur qui charge votre application Vue :

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <!-- C'est ICI que Vue va injecter toute son interface dynamique -->
    <div id="app"></div>

    <!-- Vite charge notre Main.ts principal comme un Module JS Moderne -->
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

La balise `<div id="app">` est la coquille vide où Vue va "monter" (mount) votre application.

### `src/main.ts`

Le point d'entrée JavaScript qui "allume" le moteur :

```typescript
import { createApp } from "vue"; // 1. Importe le moteur
import App from "./App.vue"; // 2. Importe notre composant Racine

import "./assets/main.css"; // Charge le CSS global

createApp(App).mount("#app"); // 3. Crée l'App et l'injecte dans le div #app
```

Ce code :

1. Importe la fonction usine `createApp` depuis Vue.
2. Importe votre composant racine hiérarchique principal (`App.vue`).
3. Crée une instance (en mémoire) de l'application Vue.
4. "Monte" (attache) cette instance à l'élément HTML portant l'ID `#app`.

### `src/App.vue`

Le composant racine absolu de votre application :

```vue
<script setup lang="ts">
// On importe un composant enfant
import HelloWorld from "./components/HelloWorld.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <!-- On l'utilise ici comme une balise HTML classique ! -->
      <HelloWorld msg="Bravo, vous l'avez fait !" />
    </div>
  </header>
</template>

<style scoped>
header {
  line-height: 1.5;
}
</style>
```

## Modifier votre Premier Composant

Faisons un peu de nettoyage. Modifiez complètement `App.vue` pour créer votre propre base :

```vue
<script setup lang="ts">
import { ref } from "vue";

const message = ref("Bonjour, Vue !");
const count = ref(0); // Un compteur réactif

function increment() {
  count.value++; // Fait monter le compteur
}
</script>

<template>
  <div class="app">
    <h1>{{ message }}</h1>
    <p>Compteur : {{ count }}</p>

    <!-- On écoute le clic avec @click -->
    <button @click="increment">Incrémenter</button>
  </div>
</template>

<style scoped>
.app {
  text-align: center;
  padding: 2rem;
}

button {
  background: #42b883;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #3aa876;
}
</style>
```

Sauvegardez le fichier et regardez votre navigateur se mettre à jour AUTOMATIQUEMENT sans rafraîchir la page — c'est la magie du **HMR (Hot Module Replacement)** offert par Vite !

## Commandes de Développement Fréquentes

```bash
# Démarrer le serveur local ultra-rapide
npm run dev

# Compiler tout le code pour la production (Hébergement)
npm run build

# Prévisualiser la version de production compilée
npm run preview

# Lancer le nettoyeur de code (ESLint)
npm run lint

# Formater joliment le code (Prettier)
npm run format
```

## Ressources

- [Créer une Application Vue](https://vuejs.org/guide/essentials/application.html) — Documentation officielle sur la création et la configuration (en anglais).

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
