---
source_course: "vue-router"
source_lesson: "vue-router-layout-patterns"
---

# L'Architecture des Vues Globales (Layout Patterns)

Toutes les applications d'Entreprise ont besoin de gabarits massifs différents en fonction d'où se trouve le visiteur (Un Utilisateur Connecté ne verra jamais la barre de publicité du Visiteur Inconnu !). Voici comment les maîtres bâtissent ceci avec la splendeur Vue Router.

## Le Schéma Des Multiples Gabarits Layouts Principaux (Enfant Imbriquation)

C'est LE pattern d'Agence le plus connu au monde :

```typescript
const routes = [
  // ZONE 1 :  Gabarit Public Marketing (Pages Visitur Anonyme Vitrine)
  {
    path: "/",
    component: PublicLayout, // Gabarit avec Pub et Gros Boutons Ventes
    children: [
      { path: "", component: Home },
      { path: "about", component: About },
      { path: "pricing", component: Pricing },
    ],
  },

  // ZONE 2 : Gabarit Sans Logo Pur Noir et Blanc Pour la Zone Mot de passe et Authentification
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      { path: "login", component: Login },
      { path: "signup", component: Signup },
      { path: "forgot-password", component: ForgotPassword },
    ],
  },

  // ZONE 3 : L'Armurerie (Le  Gros Tableau de bord Complexe Utilisateur une Fois connecté !)
  {
    path: "/app",
    component: DashboardLayout, // Mégastructure Massive
    meta: { requiresAuth: true }, // Accès Interdit !
    children: [
      { path: "", component: Dashboard },
      { path: "settings", component: Settings },
      { path: "profile", component: Profile },
    ],
  },
];
```

## Rédaction des Fichiers Grossiers Gabarits (Layout Components)

A quoi ressemblent physiquement ces fichiers "Mère" des routeurs ?

```vue
<!-- layouts/PublicLayout.vue -->
<template>
  <div class="public-layout border-rose-500">
    <PublicHeader />
    <!-- Fichier Enfant Logo -->
    <main class="w-[1200px] h-screen">
      <router-view />
      <!-- ZONE DE SPAWN CHROME DES PAGES DU DESSOUS !! (Home, about, pricing..) -->
    </main>
    <PublicFooter />
  </div>
</template>

<!-- layouts/DashboardLayout.vue -->
<template>
  <div class="dashboard-layout dark-theme w-full flex">
    <DashboardSidebar />
    <div class="main-content w-full">
      <DashboardHeader />
      <main class="p-4">
        <router-view />
        <!-- APP SPAWN C'EST ICI !! (Settings, Profil, Board !) -->
      </main>
    </div>
  </div>
</template>

<!-- layouts/AuthLayout.vue -->
<template>
  <div class="auth-layout h-screen bg-black flex justify-center items-center">
    <div class="auth-card ui-glass width-900 border-yellow p-8">
      <Logo width="Massif 500p" />
      <router-view />
      <!-- SPAWN DES PAGES : LOGIN OU FORGOT PASS !! -->
    </div>
  </div>
</template>
```

## Le Pattern Déstructuré Alternatif : Par Les Métadonnées !

Si vous détestez avoir un Tableau de Routes imbriquées infinies et complexes avec 5 niveau d'`children`, Il existe une Autre Mode d'Agence très connue pour ça (Particulièrement celle utilisée de force nativement si vous Bossez Sur Nuxt.js / Next.js) :

**Dites la Vérité dans L'Objet Data Fantôme de La Route (meta)**

```typescript
// fichier : router.ts (Toutes vos routes sont Plates et au Niveau Zéro 0 de votre Fichier !!! (Sans Dossier enfants !!) )
{
  path: '/login',
  component: Login,
  meta: { layout: 'auth' } // LE PETIT TAG CODE BARRE SECRET COLLÉ SUR  L'URL !
},
{
  path: '/dashboard',
  component: Dashboard,
  meta: { layout: 'dashboard' } // Bip !!
}
```

Puis, Le Génie Intervient **Dans le tout Premier Fichier de Vote Grand Parent à Tous `App.vue` :**

```vue
<!-- App.vue (Le Tout Tout Premier Fichier Ultime de l'application) -->
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

// J'importe tous les Gabarits mères Physiques existant ici :
import PublicLayout from "./layouts/Public.vue";
import AuthLayout from "./layouts/Auth.vue";
import DashboardLayout from "./layouts/Dashboard.vue";

const route = useRoute();

// L'Usine  Des Paires de Layouts Dispo
const layouts = {
  public: PublicLayout,
  auth: AuthLayout,
  dashboard: DashboardLayout,
};

// 💥 LE TESTEUR : Quel est LE code du Layout écrit sur L'Etiquette Secrette "Meta"  De l'URL Qu'on me demande de lire ??
const currentLayout = computed(
  () => layouts[route.meta.layout] || PublicLayout, // Par défaut sinon balance sur Public !
);
</script>

<template>
  <!-- WAOUWWWWWW LA GROSSE MAGNIFICENCE !!! -->
  <!-- <component :is=""> Charge Un GROS FICHIER .VUE Dynamiquement à Partir D'Une simple variable Mot clé JavaScript en Texte Existant !! -->
  <component :is="currentLayout">
    <!-- L'Aspirtateur Trou Noir !! -->
    <router-view />
  </component>
</template>
```

C'est LE Design par excellence pour une Application de Prod Colossale Totalement Flexible et Indépendante et non Liée à 100% au Fichier Json des `routes.ts`.

## Des Effets CSS Visuels Incroyables Entre Deux Routes !!

Grâce à `<Transition>`, transformez votre Application en de la Magie Hollywood !

```vue
<template>
  <router-view v-slot="{ Component, route }">
    <!-- LE BLINDEUR MAGIQUE DE TRANSITION : "Mode Out, IN" Veut dire : Attend que L'ancienne Page Soit Complètment Sortie avant de Charger la Nouvelle.  !!  -->
    <Transition :name="route.meta.transition || 'fade'" mode="out-in">
      <!-- Le Nouveau Composant Arrive à Chaude Vitesse et Claque !!   -->
      <component :is="Component" :key="route.path" />
    </Transition>
  </router-view>
</template>

<style>
/* CLASSE CSS MAGIQUES INTERCEPTÉ PAR VUE DES QU'IL VOIT UNE TRANSITION ! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
```

## Garder Vivant Pour Toujours (Keep-Alive Cache) avec Les Vues !!

Vous ne voulez PAS que votre page énorme de Paramètre Dashboard (Pleine de Textes et Checkbox) Se Vident du Travail de l'utilisateur Cocheur parce qu'il à malencontreusement navigué 1 sec vers Accueil... Et puis Revenu en arrière pleurant ??
Utilisez L'Aspirateur à RAM Mémoire Caché Côté Navigateur `<KeepAlive>` :

```vue
<router-view v-slot="{ Component }">
  <!-- MAGIE BLANCHE  ! Les fichier Vues.js ayant nom Composant "Dashboard" et "Settings" NE SERONT JAMAIS DETRUITS CACHÉ ET RELANCÉ SI ON LES A DÉJÀ TÉLÉCHARGÉ UNE FOIS ! ILS APPARAÎTRONS EN MILLISECONDES SANS API EN CLIQUANT SUR LE MENU CAR ILS ÉTAIT "CHACHÉ" VIVANT !!  -->
  <KeepAlive :include="['Dashboard', 'Settings']">
    <component :is="Component" />
  </KeepAlive>
</router-view>
```

```vue
<!-- Version Avec Filtre intelligent des Code barres Secrets de Meta tag  ! :  -->
<router-view v-slot="{ Component, route }">
  <KeepAlive>
    <component 
      :is="Component" 
      :key="route.meta.keepAlive ? undefined : route.path" 
    />
  </KeepAlive>
</router-view>
```

## Ultra-Bourrinage de Trous : Les Trous à Nom (Nested Named Views)

Des Trous Vues Enfants qui Définissent d'Autres Trous Vue Enfant Spécifique sur Un Unique Chemin Route !! (Exemple: A la fois Écraser tout le corps central **ET EN PLUS** forcer l'écrasement en direct du Fichier Enfant `Menu Gauche DashboardSidebar` par un sous fichier Nouveau Différent `StatsSidebar` Juste pource composant enfant précis ciblé ! ) :

```typescript
{
  path: '/dashboard', // MERE Dashboard
  components: {
    default: DashboardMain, // Trou A
    sidebar: DashboardSidebar // Trou B
  },
  children: [
    {
      path: 'stats', // BEBE Stats
      components: {
        default: Stats, // Surcharge le Trou A Par la Page Stats !
        sidebar: StatsSidebar  // Oulala, Surcharge AUSSI Le Menu Trou B Normal de La Mère  et Remplace de Force le Menu du site Complet Par Un Menu Coudé "StatsSidebar" juste pour se bébé URL 'stats' !!!   C'est Incensé !
      }
    }
  ]
}
```

## Formidable Ressource

- [Les Multiples Named Views](https://router.vuejs.org/guide/essentials/named-views.html) — La Puissance Incommensurable d'utiliser d'innombrables `<router-view>` d'un coup sur une seule pauvre route .

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
