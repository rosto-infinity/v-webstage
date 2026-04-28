---
source_course: "vue-foundations"
source_lesson: "vue-foundations-project-organization"
---

# Bonnes Pratiques d'Organisation de Projet

À mesure que votre application Vue grandit, une bonne organisation devient absolument indispensable pour sa survie à long terme. Établissons ensemble des modèles d'architecture qui passent à l'échelle (scale), des petits projets jusqu'aux gigantesques applications professionnelles.

## L'Architecture de Dossiers Recommandée (Standard de l'Industrie)

```
src/
├── assets/              # Fichiers statiques (images, polices SVG)
│   ├── images/
│   └── styles/          # Variables CSS natives ou SCSS
│       ├── main.css
│       └── variables.css
│
├── components/          # Composants réutilisables d'Interface (UI)
│   ├── common/          # Composants génériques, bêtes et méchants, utilisés partout
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseModal.vue
│   │   └── BaseCard.vue
│   ├── layout/          # Éléments de structure globale
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   └── AppSidebar.vue
│   └── [feature]/       # Composants spécifiques à UNE fonctionnalité (ex: 'todo' ou 'cart')
│       ├── TodoItem.vue
│       └── TodoList.vue
│
├── composables/         # Fonctions "Composition API" réutilisables (Les Hooks persos de Vue)
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── useLocalStorage.ts
│
├── views/               # Pages web entières (Accessibles via Routage URL)
│   ├── HomeView.vue
│   ├── AboutView.vue
│   └── NotFoundView.vue
│
├── types/               # Fichiers de définitions TypeScript
│   └── index.ts
│
├── utils/               # Petites fonctions utilitaires pures (Maths JS, Dates...)
│   ├── formatters.ts
│   └── validators.ts
│
├── App.vue              # Le composant Racine Suprême (Coquille de l'application)
└── main.ts              # Le point d'entrée JS (Lancement du moteur Vue complet)
```

## Conventions de Nommage des Composants

### Les Composants de Base (Base Components)

Préfixez vos composants très génériques (boutons, inputs) avec `Base`, `App` ou la première lettre du framework comme `V` (Le standard utilisé par Vuetify) :

```
BaseButton.vue      # Bouton générique stylé utilisé sur tout le site
BaseInput.vue       # Input de texte personnalisé
BaseCard.vue        # Conteneur "Carte" générique
AppHeader.vue       # L'en-tête natif de CETTE application précise
```

### Les Composants à Instance Unique (Singletons)

Préfixez tous les composants qui ne seront utilisés qu'UNE SEULE ET UNIQUE FOIS sur TOUTE la page web avec le mot `The` :

```
TheNavbar.vue       # Seulement UNE navbar en haut
TheSidebar.vue      # Seulement UNE barre latérale
TheFooter.vue       # Seulement UN footer global
```

### Les Composants Fortement Couplés (Parents/Enfants stricts)

Nommez toujours les composants enfants en utilisant le nom rigoureux du parent exact comme préfixe pour qu'ils soient triés ensemble alphabétiquement dans votre explorateur de fichiers :

```
TodoList.vue               # Fichier parent 1 (Sera listé en premier par le dossier)
TodoListItem.vue           # Fichier enfant 2 (Sera listé juste en dessous magiquement)
TodoListItemButton.vue     # Fichier petit-enfant 3

SearchForm.vue
SearchFormInput.vue
SearchFormButton.vue
```

## Astuces Rapides d'Organisation Fichier

### Gardez le Code Lié Regroupé !

Au lieu d'avoir un dossier "types" massif, ou un dossier "tests" monstrueux, regroupez tout au sein d'un dossier de Fonctionnalité ("Feature Folder") :

```
components/
└── todo/
    ├── TodoList.vue
    ├── TodoItem.vue
    ├── TodoForm.vue
    └── types.ts          # Ex: type TodoItem = { id: string } (Type lié UNIQUEMENT à la mécanique des todos)
```

### Rapprochez vos Tests (Co-locate)

```
components/
└── todo/
    ├── TodoList.vue
    ├── TodoList.spec.ts  # Le test unitaire (Jest/Vitest) collé exactement à la source de son composant
    └── ...
```

## Créer et Gérer ses Types TypeScript

```typescript
// src/types/index.ts (Fichier pour vos types globaux accessibles n'importe où)
export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
};

export type Todo = {
  id: number;
  text: string;
  done: boolean;
  createdAt: Date;
  userId: number;
};

// Un type objet très intelligent et réutilisable utilisant les Generics ("<T>")
export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};
```

## Extraire ses Fonctions Utilitaires JS Pures (Vanilla)

Ne surchargez pas (jamais) vos composants `script setup` Vue avec des formules mathématiques folles ou de manipulation de dates :

```typescript
// src/utils/formatters.ts
export function formatDate(date: Date): string {
  // Fonction native JS surpuissante (API Intl)
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
```

## Utiliser les Utilitaires externes dans vos Composants

```vue
<script setup lang="ts">
import { formatDate, formatCurrency } from "@/utils/formatters";
import type { Product } from "@/types";

const props = defineProps<{
  product: Product;
}>();
</script>

<template>
  <div class="product">
    <h3>{{ product.name }}</h3>
    <!-- Exécution classique au moment de l'affichage dans le template ! -->
    <p>{{ formatCurrency(product.price) }}</p>
    <small>Ajouté le : {{ formatDate(product.createdAt) }}</small>
  </div>
</template>
```

## La magie des Alias de Chemin Absolu (`@`)

Configurez l'alias magic de chemin absolu `@` dans le fichier cœur `vite.config.ts` pour ne plus jamais avoir de `../../../../` profondément illisibles !

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Le symbole magique '@' pointera M-A-G-I-Q-U-E-M-E-N-T toujours vers la racine absolue : le dossier `/src` complet !
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
```

Désormais, vous pouvez importer tout de manière incroyablement propre, peu importe le niveau de profondeur ou l'imbrication actuelle de votre vieux fichier de travail :

```typescript
// AVANT l'alias:
// import Button from '../../../../components/common/BaseButton.vue'

// APRÈS (Parfait) :
import BaseButton from "@/components/common/BaseButton.vue";
import { formatDate } from "@/utils/formatters";
import type { User } from "@/types";
```

## Ressources

- [Vue Style Guide (Indispensable)](https://vuejs.org/style-guide/) — Le guide de style officiel gigantesque recensant TOUS les standards de développement professionnels sur Vue ! Fortement recommandé à lire une fois.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
