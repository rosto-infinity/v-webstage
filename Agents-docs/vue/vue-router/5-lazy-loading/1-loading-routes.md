---
source_course: "vue-router"
source_lesson: "vue-router-lazy-loading-routes"
---

# Le Chargement à La Demande des Pages Composantes (Lazy Loading)

Dans une application massive (100+ pages), vous ne voulez **SURTOUT PAS** que votre visiteur doive télécharger dans un seul Mégabit massif les 100 pages de votre site s'il ne vient que visiter la page "Contat" : Il attendrait 15 secondes d'écran blanc !

La "Feignantise au Chargement" (Lazy loading) fractionne l'ADN de votre App (Build) en de myriades de minis paquets ("Chunks") qui ne se téléchageront du Cloud _que_ lorsque que le visiteur clique enfin physiquement sur l'URL d'un des boutons !

## La Recette Basique (Dynamic Imports JS)

```typescript
const routes = [
  {
    path: "/",
    // LOURDEUR BOURRINE CLASSIQUE  : Téléchargée physiquement au Démarrage absolu même si Inutile pour l'instant !
    component: Home,
  },
  {
    path: "/about",
    // LE LAZY LOAD !! Ne se télécharge JAMAIS tant que son URL '/'about' n'est pas cliqué ni visité !!
    component: () => import("@/views/About.vue"),
  },
  {
    path: "/dashboard",
    // LAZY LOAD EGALEMENT : Importation Dynamique différée !
    component: () => import("@/views/Dashboard.vue"),
  },
];
```

## Regrouper en Paquet Nommés (Named Chunks)

Parfois vous voulez par stratégie ordonner et forcer à VueJS qu'il télécharge d'un coup "Toute un Groupe Complet d'une Famille Entière de Page", même s'il n'en visite qu'une seule ! (Ex: S'il visite la Page "Paramètres Profil", téléchargez au Profil, les Paramètres de Compte, Les Notifications, Les Factures en Arrière Plan car il ira sûrement dessus après !)

```typescript
// Avec Webpack (Vieux Compilateurs) : Les Commentaires Diaboliques !
const routes = [
  {
    path: "/user/:id",
    component: () =>
      import(
        /* webpackChunkName: "Utilisateurs-Paquet-Groupé" */
        "@/views/User.vue"
      ),
  },
  {
    path: "/user/:id/profile",
    component: () =>
      import(
        /* webpackChunkName: "Utilisateurs-Paquet-Groupé" */
        "@/views/UserProfile.vue"
      ),
  },
  {
    path: "/user/:id/posts",
    component: () =>
      import(
        /* webpackChunkName: "Utilisateurs-Paquet-Groupé" */
        "@/views/UserPosts.vue"
      ),
  },
];

// RESULTAT INCROYABLE : Le Fait de visier 1 Seul de ces Lien téléchargera LE GROUPE "Utilisateurs-Paquet-Groupé" complet d'un seul coup (les 3 pages) !
```

⚠️ **Avec Vite (Moteur Rollup Moderne) :**

```typescript
// Vite n'utilise plus ce système de Commentaires immondes magiques.
const UserProfile = () => import("@/views/UserProfile.vue");
// Vite Groupera et Nommera magiquement les paquets basé sur de L'Analyse d'Intelligence de l'Abre des dépendances des fichiers et des noms seuls !
```

## L'Art de Lier l'UI à l'Attente Reseau (Loading State) !!

Puisqu'imposer du Lazy Loading veut dire que le Visiteur **DOIT ATTENDRE physiquement le téléchargement réel de la nouvelle page `.vue` depuis le serveur avant de la VOIR**, CELA IMPLIQUE une coupure et une latence VISUELLE ! C'est la mort de l'UI si on ne le gère pas :

```vue
<!-- App.vue (Le Tout Tout Premier Fichier Ultime de l'application) -->
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isLoading = ref(false);

// ON DETECTE AVEC LE GARDIEN LE MOMENT EXACT DU CLI BOUTON -> ET DU REEL TELECHARGEMENT !
router.beforeEach(() => {
  isLoading.value = true; // ALLUMEZ LA BARRE UI DE CHARGEMENT YOUTUBE !!
});

router.afterEach(() => {
  isLoading.value = false; // TELECHARGMEET FINIT VISIBLE : COUPEZ LA BARRE RAPIDEMENT !!
});
</script>

<template>
  <div v-if="isLoading" class="loading-bar-rouge-youtube"></div>
  <router-view />
</template>
```

## L'Alternative Moderne Vue 3 : Suspense !!

Ne vous Tracassez pas avec les Guards. Enfermez Juste le `router-view` dans l'Armure `<Suspense>` !

```vue
<template>
  <router-view v-slot="{ Component }">
    <Suspense>
      <!-- PLAN A : SI LE COMPOSANT EST LA ET PREY A S'AFFICHER  -->
      <template #default>
        <component :is="Component" />
      </template>

      <!-- PLAN B (L'ATTENTE)  : SI LE COMPOSANT EST EN COURS DE TELECHARGEMENT LAZY-LOAD DEPUIS LE NUAGE !! -->
      <template #fallback>
        <LoadingSpinnerTournant />
      </template>
    </Suspense>
  </router-view>
</template>
```

## L'"Aspirateur Hover" d'Intelligence Prédictive ! (Prefetching)

Vous VOULEZ un Lazy Load (Gain de Poigt initiale)... MAIS sans un Loading Pénible de latence ? TÉLÉCHARGEZ LE FICHIER `.vue` **JUSTE AU MOMENT OÙ LE GARS PASSE SA SOURIS (HOVER) SUR LE BOUTON !!!!** (Ce qui laisse environ 300 millisecondes humain avant qu'il ne clique vraiment : LE TEMPS EXACT DU TÉLÉCHARGEMENT !)

```typescript
// LE SCRIPT QUI "FORCE" LE TELECHARGEMENT SANS CLIQUER !
function prefetchRoute(routeName: string) {
  // 1. On cherche La Cible Json
  const route = router.resolve({ name: routeName });
  // 2. On Trouve L'Objet "() => import(..)" Caché dedans !!
  const component = route.matched[0]?.components?.default;

  if (typeof component === "function") {
    // 🔥🔥 ON EXECUTE DE FORCE L'IMPORT DYNAMIQUE AFIN DE DECLENCHER DE FORCE LE TELECHARCHEMENT BACKGROUND DE LA PAGE VUE !!! 🔥🔥
    component();
  }
}
```

```vue
<template>
  <!-- QUAND SA SOURIC PASSE AU DESSUX DU LIEN (Même sans Clic) -> JE DECLENCHE L'ASPIRARTUER !!  -->
  <router-link to="/about" @mouseenter="prefetchRoute('about')">
    Bouton Magique About Page Lourd
  </router-link>
</template>
```

## Les 4 Seaux Sacrés Des Architectes Prod

```typescript
const routes = [
  // ✅ Règle 1 : La LOURDEUR BOURRINE Uniquement pour les Touts Premiers Vraies Choses que le Visiteur Voit au Point 0 ! (Acceuil)
  {
    path: "/",
    component: Home, // PAS DE lAZY LOADY !  ON VEUT DE L'IMMEDIATTÉTÉ CEREBRAL POUR REBOND
  },

  // ✅ Règle 2 : Le Mode Lazy  Oblitératoire pour les Grosse Zone de Travail (Dashboard Applicatif)
  {
    path: "/settings",
    component: () => import("@/views/Settings.vue"),
  },

  // ✅ Règle 3 : Regrouper les Outils Métiers Lourds qui Vont ensembles
  {
    path: "/reports",
    component: () => import("@/views/reports/Layout.vue"), // Lazy Load
    children: [
      {
        path: "sales",
        component: () => import("@/views/reports/Sales.vue"), // Lazy Load !!
      },
    ],
  },

  // ✅ Règle 4 : Et BIEN ÉVIDEMMENT le Saint Graal Obligatoire : LE Lazy laoding De L'Administration ! L'Utilisateur Paysan N'A AUCUNE RAISON de télécharger 15 Mo de Librairie Graphique Chart.js Admin !!!
  {
    path: "/admin",
    component: () => import("@/views/Admin.vue"),
    meta: { requiresAdmin: true },
  },
];
```

## Formidables Ressources Officielles

- [Les Lazy Loading Routes (Guide Evant You)](https://router.vuejs.org/guide/advanced/lazy-loading.html) — La Fiche de Réference Ultime.

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
