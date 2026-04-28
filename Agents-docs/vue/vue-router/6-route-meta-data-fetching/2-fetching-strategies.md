---
source_course: "vue-router"
source_lesson: "vue-router-data-fetching-strategies"
---

# Les Stratégies Absolues de Chargement de Données Pénibles API

L'Erreur la plus mortelle d'Un Développeur Front-End est de mal synchroniser son Routage Graphique avec ses Serveur Lourd API. L'Utilisateur sentira l'App "Lagguer" Ou pire verra une demi page blanche.

Voici Les 3 Patterns Célèbres :

## Stratégie 1 : Attendre _Après_ La Navigation (Le Mode Doucement Spinner)

Je change L'Url et Navigue Visuellement de Suite, MAIS j'affiche sur mon `App.vue` Un gros Cercle (Spinner) qui tourne longuement pendant que je Fetch en arriere plan Axios sur ce meme component.

```vue
<!-- PostDetail.vue (!DÉJÀ AFFICHÉ!) -->
<script setup>
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const user = ref(null);

const loading = ref(true); // L'ÉTAT UI !!!
const error = ref(null);

watchEffect(async () => {
  loading.value = true;
  error.value = null;

  try {
    // LE FETCH EST LANCE ALORS QUE LA PAGE EST DEJA AFFICHE A L'ECRAN !
    const response = await fetch(`/api/users/${route.params.id}`);
    if (!response.ok) throw new Error("C'est Cassé mec");
    user.value = await response.json(); // 3 Secondes D'attente..
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false; // C'EST BON ON EST PRETS ! ON COUPE LE CERCLE TOURNANT SPIN !
  }
});
</script>

<template>
  <!-- L'OSCILLATION DE LUI UX : -->

  <div v-if="loading" class="spinner-tournant-vite">
    TÉLÉCHARGEMENT LOURD DES DONNÉES EN COURS...
  </div>

  <div v-else-if="error" class="bg-red-500">
    AIE ! C'EST CASSÉ : {{ error }}
  </div>

  <div v-else>
    <!-- BOUM LE DOM FINAL VRAI APPRARAIT APRES 3 SECONDES DE SPIN CHROME ! : -->
    <h1>Salut {{ user.name }} ! Bienvenue. Voici ton Interface...</h1>
  </div>
</template>
```

**✅ Avantages :** Le mec navigue Instantanément au Click (Il a l'Impression de Vitesse Web). <br>
**❌ Défauts Majeurs :** On doit lourdement coder l'UI Affreuse de Cercle Tournant Loading sur Abosuluement CHAQUE PAGE et CHAQUE composant ! C'est Horrible en dev.

## Stratégie 2 : Attendre la Donnée **AVANT MÊME LA REDIRECTION** (API En Guard)

Je CLIQUE sur un Bouton vers la Nouvelle Page, il Lence le Fetch Axios, et... Rien ne se passe ! (L'Utilisateur _semble_ bloqué sur la page initiale). Et après 3 SECONDES, BOUM, il atteri direct et instantanément sur sa cible DÉJÀ PRÊTE ET RENDUE AVEC SES TEXTES SANS AUCUN LOADING !

```typescript
// DANS LE JSON DE VUE ROUTER  (router.ts):
const routes = [
  {
    path: "/users/:id",
    component: () => import("./UserProfile.vue"),

    // LE DOUANIER MAGIQUE !!! IL LANCE LE CALL AXIOS, LUI MÊME ! SEUL, DANS L'OMBRE JSON ! !! :
    beforeEnter: async (to) => {
      const userStore = useUserStore();

      try {
        await userStore.fetchUser(to.params.id); // ⏰ HORLOGE BLOQUÉE : J'ATTENDS 3 SECONDES EN ASYNC ICI..

        // C'EST FAIT : J'AI MIS LE USER EN MEMOIRE CACHE JS !!
        // ⏩ CA Y EST L'UI DE TÉLÉPORTATION DU CLIQUE DE PAGE SE FAIT ENFIN !!
      } catch (error) {
        return { name: "not-found" }; // Échec Secret !! Le mec Croit Juste que "C'est Pas Trouvé"
      }
    },
  },
];
```

**Alternative Suprême : Cacher dans la Valise Prop JS et La Balancer Vers le Bas (Même sans Store Pinia) !**

```typescript
const routes = [
  {
    path: "/posts/:id",
    component: PostDetail,
    props: true, // ✅  PERRMISSSION D'ENVOYER DES CACHETS A LEUX COMPOSANT DE FORCE EN TANT QUE PROPS CLASSQUE !!
    beforeEnter: async (to) => {
      const response = await fetch(`/api/posts/${to.params.id}`);
      if (!response.ok) return { name: "not-found" };

      // ✅✅ JE DETRUIT LE PARAM CIBLE, POUR LE REMPLACER DIRECTEMENT PAR L'ENTIERETÉ OBJET JSON LOURD QU'ON VIENT DE TÉLÉCHAEGWR !!!
      to.params.post = await response.json();

      return true;
    },
  },
];
// DANS PostDetail.vue , PAS BESOIN DE "Ref(loading)". CA SERA INJECTÉ MAGIQUEMENT DE FORCE DES LA 1ER MICROSECONDE VIA  "defineProps(['post'])" !!
```

**✅ Avantages :** Le composant n'est Affiché UNIQUEMENT QUE SI on a TOUTES ses données. Le DOM EST INSTANTANÉ ! Et le composant en UIX lui même est vierge de ce code asynchrone sale.<br>
**❌ Défauts Majeurs :** Le clique Visuel Initial est Ignoble (Le mec a l'impression que le site Freeze Pendant 3s au Tap de sa souris Morte !) _Sauf si_ vous Couplez-ça avec la Barre Horizontale YouTube au clic Boutons!

## Stratégie 3 : Suspendre (Suspense + Setup Async Vue 3)

La méthode moderne et officielle de Vue 3 Native. Un `await` balancé sauvagement directement pur à la racine sans fonction `onBeforeMount`. Elle fige _automatiquement_ tout son engin graphique Parent `<Suspense>` !

```vue
<!-- Bébé Cible Lourd (Ex : UserProfile.vue) -->
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

// ⚠️ IL N'Y A PLUS DE onMount() ! on Balance ca lâchement Racine Top-Level du Fichier !!!
// ⚠️⚠️ VUE JS DETECTE DIRECTEMENT CE 'AWAIT' ET LA DECLARE COMME COMPOSANT FRAPPÉ D'ASYNC LOURD !. LUI MEME, ET TOUS SES ENFANT SE METTE EN ARRET CARDIAQUE LE TEMPS QUI PARLE !
const response = await fetch(`/api/users/${route.params.id}`);
const user = await response.json();
</script>

<template>
  <h1 class="p-8 ui-glass">{{ user.name }}</h1>
  <!-- Sera Rendus Immédiatement car Bloqué Par L'aWait du Haut !-->
</template>
```

```vue
<!-- Fichier Maître Mère (App.vue) : Je Recois l'Onde de Choc du Dessus !! : -->
<template>
  <router-view v-slot="{ Component }">
    <!-- LE SEUL CHOSSI QUE POSSEDE LE BOUCLIER POUR CONTRER L'AVALANCHE CARDIAQUE DU 'AWAIT' SAUVAGE DE L'ENFANT : LE BOUCLIER SUSPENSE ! -->
    <Suspense>
      <!-- Il ESSAYE de l'Affficher... MAIS YÉ BOQUÉ EN ATTENTE FETCH  ALORS IL SKIP VERS LE FALLBACK.... -->
      <component :is="Component" />

      <!-- MAGIE NATIVE DU MOTEUR : VUE AFFICHE A L'ECRAN UNIQUEMENT CE BOUTA BOUT DE HTML *PENDANT* LES 3 SECONDES QUE L'Enfant REFUSE DE REPONDRE DANS LE TEMPLE DE L'AWAIT !! CA SERT DE SPIN LOADER AUTOMATIQUE MONDIAL !! -->
      <template #fallback>
        <div class="loading text-6xl text-red-500">
          ATTENDEZ J'AI DES AWAITS EN DESSSOU LEEEENT !!...
        </div>
      </template>
    </Suspense>
  </router-view>
</template>
```

## Bonus de Fer : La fameuse "Barre De Lading Youtube Horizontale" Globale

Puisque que Le Douanier Gardien Bloque Totalement l'UI. Vous **DEVEZ** afficher une Barres de Chargement globale Ligne en haut l'Ecran au dessus de la Bar d'Url comme sur YouTube pour Montrer que L'App est Vivante Entre 2 Pages à Chaque Fois qu'on clique sur un lien !

```vue
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isNavigating = ref(false);

// LE MEC A CLIQUÉ : ON ALLUME DIRECT L'ANIMATION LIGNE CSS !!
router.beforeEach(() => {
  isNavigating.value = true;
});

// LE FETCH LOURD EST FINIT, CA Y EST, LE DOM VA REDEMARER ET SE TELEPORTER VISUELLEMENT  : ON COUPE LA BAR CSS !!
router.afterEach(() => {
  isNavigating.value = false;
});

// CASSE API = ON COUPE AUSSI LA BAR COINCÉE ANIMATION !
router.onError(() => {
  isNavigating.value = false;
});
</script>

<template>
  <div class="app w-screen">
    <!-- La Toute Pete Barre fine Horizontale de 3px Qui S'allmme Rouge et Fait un Defiment de coté rapide : -->
    <LoadingBar
      v-if="isNavigating"
      class="h-1 bg-red-600 w-full animate-pulse z-50 fixed top-0 left-0"
    />

    <router-view />
    <!-- L'app Normale en dessous  -->
  </div>
</template>
```

## Superbe Page Officielle

- [Les Strategies de Fetches de Données Vuex](https://router.vuejs.org/guide/advanced/data-fetching.html) — Les recommandations Divines du Createur.

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
