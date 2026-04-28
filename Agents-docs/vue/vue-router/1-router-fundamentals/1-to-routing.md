---
source_course: "vue-router"
source_lesson: "vue-router-introduction-to-routing"
---

# Introduction au Routage Côté Client (Client-Side Routing)

Vue Router est la Bibliothèque de Route officielle de Vue.js, vous octroyant le don de concevoir des Applications Multi-Vues foudroyantes appelées (Single-Page Applications "SPA").

## Qu'est-ce que le Routage Côté Client (SPA) ?

Dans un vieux site web daté traditionnel PHP, cliquer sur n'importe quel banal lien cassait le monde et déclenchait un rechargement Lourd (Refresh) total blanc de la page :

```
Navigateur Blanc → Demande HTTP de /about → Serveur Lent → Calcule une Entière page HTML → Rend le Site
```

Avec le Routage sur-vitamminé Côté Navigateur (Client-side) SPA :

```
Navigateur → Fausse un Changement de texte d'URL → Le code JavaScript intercepte à la vitesse de la lumière → Change 1 petit Composant visuel → AUCUN VOYAGE RESEAU NI RECHARGEMENT SERVEUR N'EST FAIT !
```

## Les Immenses Bénéfices des SPAs avec Vue Router

1. **Navigation Éclair Quasi-Instantanée** : Fini les pages blanches et les rafraîchissements réseaux !
2. **Une Interface (UX) Fluide Magnifique** : Possibilité de faire des "Transitions de Fondu" somptueuses entre deux vues !
3. **Persistance Ultime d'État** : Le son de votre lecteur de Musique ou Vos Variables JavaScript JS ne se reset plus JAMAIS quand vous changez de Page !!
4. **Sensation Native d'App Mobile** : Des réponses tactiles instantanées sur le téléphone.

## Installation du Moteur

```bash
npm install vue-router@4
# ou les pros modernes :
pnpm add vue-router@4
```

## Configuration Fondamentale OBLIGATOIRE

### 1. Forger Le Saint fichier Fichier de Configuration "Router"

```typescript
// router/index.ts (Le Fichier Maitre)
import { createRouter, createWebHistory } from "vue-router";
// J'Importe les pages Géantes Fichiers .vue :
import Home from "@/views/Home.vue";
import About from "@/views/About.vue";

// Le Dictionnaire de la Route (Le Plan Cadastral) :
const routes = [
  {
    path: "/", // Si la bar d'adresse affiche exactement çà..
    name: "home", // Je donne un Nom de code raccourci à cette page..
    component: Home, // .. ALORS affiche sur l'écran CE gros fichier physique .vue ! (Home.vue)
  },
  {
    path: "/about",
    name: "about",
    component: About,
  }, // ... etc avec 50 autres pages de votre site ..
];

// L'Instanciation Physique de l'Objet Moteur Router
const router = createRouter({
  history: createWebHistory(), // La méthode de gestion des URL
  routes, // Mon Dictionnaire !
});

export default router; // Je le met à disposition du monde JS !
```

### 2. Le Greffer dans le Grand Fichier d'Amorçage de l'Application

```typescript
// main.ts
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // J'Importe Mon Instance exporté juste au dessus !

const app = createApp(App);
app.use(router); // JE L'INJECTE DANS LES VEINES DE VUE.JS GLOBALEMENT A TOUT JAMAIS !
app.mount("#app");
```

### 3. Installer les Tags Vitaux dans le Giga Fichier App.vue

```vue
<!-- App.vue -->
<template>
  <nav>
    <!-- Les Faux-Liens Magiques SPA sans rechargement web : -->
    <router-link to="/">La Page d'Accueil</router-link>
    <router-link to="/about">A Propos de Nous</router-link>
  </nav>

  <!-- LE GRAND TROU D'AFFICHAGE !!! C'EST ICI ET NULLE PART AILLEURS QUE LE ROUTER INJECTERA LA PAGE '.VUE' COMPOSANT CLIQUEE DANS LA NAVIGATION ! -->
  <router-view />
</template>
```

## Les Deux Tags HTML Cœurs !

### `<router-link>` (L'Ancienne balise tag `<a>`)

C'est LE lien Hypertexte de navigation de votre App :

```vue
<!-- Mode Lien HTML Bête et méchant  -->
<router-link to="/about">About</router-link>

<!-- Mode PRO CODE (Par appel du Raccourci de Nom de Code défini en JS !! BEAUCOUP PIUS SUR car si l'URL URL '/about' change de nom un jour, le code marchera !) -->
<router-link :to="{ name: 'about' }">About</router-link>

<!-- Mode Envoi De Variable Paramètres Dynamiques (/user/123) -->
<router-link :to="{ name: 'user', params: { id: 123 } }">
  Profil de Michel (123)
</router-link>

<!-- Mode Envoi Paramètres de Requêtes de Tri (?q=vue) -->
<router-link :to="{ path: '/search', query: { q: 'vue' } }">
  Tri de la recherche URL
</router-link>

<!-- Le Styling Automatique des Menu Actif en Cours !! -->
<router-link to="/" active-class="active" exact-active-class="exact-active">
  Home  (Aura la classe CSS "active" collé sur lui SEUL SI nous somme sur cette URL !! Parfait pour styliser les menus Actuels )
</router-link>
```

### `<router-view>` (Le Trou Noir)

La boîte vide Universelle où tout va se passer sur votre site :

```vue
<template>
  <header>
    ... Un Super header Logo Noir Statique de 30 mètres permanent ...
  </header>

  <!-- LE TROU MAGIQUE : Le fichier (La Page) Correspondante  s'affichera au milieu de Rien D'autre à cet endroit précis ! -->
  <router-view />

  <footer>... Un Pied de Page de 40 mètres qui bouge jamais ...</footer>
</template>
```

## Les Modes d'Historiques (History Modes)

### L'Officiel Par Défaut `createWebHistory` (Mode HTML5 Pur)

```typescript
import { createWebHistory } from "vue-router";

// URLs Normales Et Propres  : /about, /users/123
const router = createRouter({
  history: createWebHistory(),
  routes,
});
```

**⚠️ Alerte Rouge Attention Déploiement** : Ce prodige technique exige impérativement un paramétrage du serveur Back-End (Nginx, Apache, Laravel) pour renvoyer toutes les requêtes 404 du serveur brute vers ce fichier `index.html` racine (Afin que Ce Soit le JS Vue SPA qui la gère). Si vous oubliez le code serveur, rafraîchir la page fera une sublime erreur 404 Nginx mortelle !

### Le Mode Bourrin Déprécié `createWebHashHistory` (Le Mode Hachage #)

```typescript
import { createWebHashHistory } from "vue-router";

// URLs Très Moches Polluées par un '#/'  : /#/about, /#/users/123
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
```

Absolument aucune configuration serveur requise (Idéal en pur développement Local sans back), C'est juste que les URLs produites sont atrocement laides et mauvaises pour le référencement naturel SEO des robots Google.

### Le Mode Fantôme `createMemoryHistory` (SSR/Tests Unitaire Jest)

```typescript
import { createMemoryHistory } from "vue-router";

// Aucun changement d'URL réel dans la barre du navigateur - Uniquement Stocké en Ram JS (Excellent pour les robots Tester, ou le SSR Nuxt)
const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
```

## Architecture Projet Mondiales

```
src/
├── router/
│   └── index.ts       # Toute la Grosse Configuration Router et ses Règle (Le Gardien)
├── views/             #  DOSSIER MAITRE ! C'est Ici qu'on stock vos PLEINES PAGES GRANDES de Routes !
│   ├── Home.vue
│   ├── About.vue
│   └── users/
│       ├── UserList.vue
│       └── UserDetail.vue
└── components/        # DOSSIER ENFANTS  : Des Tout Petits Composants Boutons et Cartes réutilisables qui vont dans les Pages Views !
    └── ... Un BoutonBleu.vue, Un FooterNoir.vue..
```

**Règle d'or Conventionnelle de l'Entreprise** : Prenez l'habitude Mortelle de Séparer Absolument le dossier `views/` (Où l'on pose seulement les "Grandes Pages Composants Entière de Destinations URLs) du dossier enfants `components/` (Boutons réutilisables de merde).

## Documentation Puissante

- [Documentation Officielle Vue Router](https://router.vuejs.org/) — La Bible du Routage Client

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
