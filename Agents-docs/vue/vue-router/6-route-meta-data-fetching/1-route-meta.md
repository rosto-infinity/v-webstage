---
source_course: "vue-router"
source_lesson: "vue-router-route-meta"
---

# L'Architecture des Métadonnées (Route Meta)

L'objet Fantôme `meta` vous donne la liberté d'attacher un dictionnaire complet d'informations invisibles à une Route. Idéal pour construire dynamiquement des Bannières Titres, des Fils d'Arianes (Breadcrumbs), et des Portes de Sécurité (Auth).

## Assigner les Etiquettes Magiques

```typescript
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
    meta: {
      title: "Accueil",
      requiresAuth: false,
      transition: "fade", // Utile pour <Transition :name="route.meta.transition"> !
    },
  },
  {
    path: "/dashboard",
    component: Dashboard,
    meta: {
      title: "Mon Super Tableau De Bord",
      requiresAuth: true,
      roles: ["user", "admin"], // La Police lira ça : Interdit Aux Invités
    },
  },
  {
    path: "/admin",
    component: AdminPanel,
    meta: {
      title: "Tour De Contrôle Admin",
      requiresAuth: true,
      roles: ["admin"], // Police : Reste Dehors Le Paysan !!
      layout: "admin", // Servira à App.vue pour Charger l'Enorme Menu Admin Noir Sur Côté !!
    },
  },
];
```

## Extraire l'Etiquette Depuis L'UI En Direct (Vue.js Component)

```vue
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

// On Fouille La Poche du Routeur Moteur :
console.log(route.meta.title); // 'Accueil'
console.log(route.meta.requiresAuth); // false
</script>

<template>
  <h1>Mégatitre de page : {{ route.meta.title }}</h1>
</template>
```

## Le Dieu Meta à l'Usage de la Douane (Navigation Guards)

Là où la puissance s'exprime vraiment : bloquer les Utilisateurs Pédestres loin de de vos Forteresses `requiresAuth`.

```typescript
router.beforeEach((to, from) => {
  // SOUDAINEMENT : Un Paysant Essaye de forcer le Mur vers L'URL /Admin :
  if (to.meta.requiresAuth) {
    // ALERTE : Il a Passé Une Route Protégée par "requiresAuth" !

    const auth = useAuthStore(); // API PINIA !

    if (!auth.isAuthenticated) {
      // Papiers SVP... IL EST PAS RECONNU !!
      return { name: "login", query: { redirect: to.fullPath } }; // EXPULSEZ-LE SUR LA CASE LOGIN !!
    }

    // IL AVAIT SON PASS ! On Pousse L'Interogatoir : Quel est son Rôle Exigent ?
    if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
      return { name: "forbidden" }; // ALERTE ROUGE : C'EST UN UTILISATEUR BANAL ! PAS ADMIN : EXPULSEZ !
    }
  }
});
```

## Changer Le Vrai Titre de l'Onglet Mac/Windows Dynamiquement (SEO)

```typescript
// S'Exécute Globalement a chaque Navigation Fini :
router.afterEach((to) => {
  const title = to.meta.title;

  // Utilise L'API Native Navigatgion OS Vanilla JS pur (`document`) pour Forcer son Onglet de Nom :
  document.title = title ? `${title} | Agence Rosto` : "Agence Rosto";
});
```

## La Surcouche Ultime TypeScript JS !!

TypeScript Véra Rouge vif si vous balancez sans le prévenir "{ title: 'Toto' }" Dans Le JSON de vue Router (Qui n'accepte rien nativement en Meta !). Forcez sa Tolérance en redéfinissant L'interface Mère :

```typescript
// Fichier Racine Router Global type
import "vue-router";

// J'INONDE LE SYSTEME DE MON PROPRE ADN CODE :
declare module "vue-router" {
  // JE DECIDE CE QUI EXISTE COMME CLES JSON DANS L'OBJET META !! :
  interface RouteMeta {
    title?: string; // Un TItre text
    requiresAuth?: boolean; // Un Vrais/Faux Poliice
    roles?: ("user" | "admin" | "moderator")[]; // 🔥 LE GRAAL : INTERDIT D'ECRIRE UNE FAUTE DE FARAPPE ROLE QUI EXISTE MEME PAS GRACE A TS !
    layout?: "default" | "admin" | "auth";
    transition?: string;
    breadcrumb?: string | ((route: RouteLocationNormalized) => string); // WOW : L'Etiquette peut MÊME ÊTRE UN OBJET FONCTION JS CALLBACK !!
  }
}
```

## Automatiser Entièrement Ses Filtres d'Ariane ! (Breadcrumbs)

Les `BreadCrumbs` Sont ce Petit En-tête avec les Flèches du style (Accueil / Admin / Produit n12). Ne les codez PAS en Dur HTML ! Usez C'EST l'Abre Généalogique de votre Router !

```vue
<!-- Composant Gloal de Header Menu BreadCrumb !  -->
<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();

// UNE PUISSANCE COMPUTED :
const breadcrumbs = computed(() => {
  const crumbs = [];

  // 'route.matched' EST LA MAGIE ABSOLUE !!!
  // IL RETOURNE UN ARRAY QUI CONTIENT LITTÉRALEMENT TOUT L'ARBRE GÉNÉALOGIQUE DES GABARITS PÈRES DE LA ROUTE ENFANT !! (GrandPère -> Pere -> Fils Actuel ! )
  route.matched.forEach((record) => {
    if (record.meta.breadcrumb) {
      // Est ce qu'un De es ancêtre a une Étiquette "BreadCrumb" ???
      const label =
        typeof record.meta.breadcrumb === "function" // Magie du Callback Exec !
          ? record.meta.breadcrumb(route)
          : record.meta.breadcrumb;

      // Super, Cet ancêtre voulait s'Afficher sur la petite ligne de L'En-Tête !
      crumbs.push({
        label,
        path: record.path,
      });
    }
  });

  return crumbs;
});
</script>

<template>
  <nav class="breadcrumbs text-gray-500 font-bold">
    <!-- Racine -->
    <router-link to="/">Accueil</router-link>

    <!-- L'Arbre Mathématique !! -->
    <template v-for="crumb in breadcrumbs" :key="crumb.path">
      <span class="opacity-50 mx-2"> / </span>
      <router-link :to="crumb.path">{{ crumb.label }}</router-link>
      <!-- Ex : "Admin" -->
    </template>
  </nav>
</template>
```

## Formidable Ressource

- [Le Route Meta Fields Officiel](https://router.vuejs.org/guide/advanced/meta.html) — La doc sur les Meta de VueRouter.

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
