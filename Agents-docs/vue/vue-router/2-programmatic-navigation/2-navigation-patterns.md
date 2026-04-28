---
source_course: "vue-router"
source_lesson: "vue-router-navigation-patterns"
---

# Les Modèles Avancés de Requêtes de Navigation

Découvrons ici les designs architecturels extrêmement pointus utilisés en production dans le monde des entreprises pour manipuler le Routage à la perfection.

## Injecter du Pur Multi-Typage Strict TypeScript dans Vue Router !

```typescript
// router/index.ts
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/users/:id",
    name: "user",
    component: () => import("@/views/User.vue"),
    meta: {
      requiresAuth: true,
      title: "Profil de l'Utilisateur",
    },
  },
];

// 1. Je Forge mon Construit TypeScript Ultime des  NOMS de Code Exactes de Mes Pages App ! (Aucune Faute De Frappe Ne passera Le Compilateur !)
type RouteNames = "home" | "user" | "settings";

// 2. Je Créé un Enrobage Par-dessus Router PUSH (Un Facade Pattern) pour que mon Equipe soit Forcé en Type Strong !
function typedPush(name: RouteNames, params?: Record<string, string>) {
  return router.push({ name, params }); // Impossible Désormais de Push vers une fauteDeFrappeRoute !
}
```

## L'Art de Survivre la Conservation des Paramètres de Filtres (Query Params)

Par défaut, naviguer efface tout. Voici comment garder ces précieux filtres :

```typescript
function navigatePreservingQuery(path: string) {
  // Transfert de Malette !
  router.push({
    path,
    query: route.query, // JE RE-Injecte EXACTEMENT ce que je viens de Lire !!
  });
}

// Ajouter Uniquement un SEUL Filtre Sans Tuer Les 40 Autres du Visiteur !
function addQueryParam(key: string, value: string) {
  router.push({
    query: {
      ...route.query, // L'ARME ULTIME DESTRUCTION ARRAY EX6 !! Je Dump L'Intégralité Sans les connaitre !
      [key]: value, // ET JE RAJOUTE  A LAFIN UNIQUEMENT ET FUSELLEMENT MON PETIT NOUVEAU !
    },
  });
}

// Détruire 1 SEUL FILTRE En Douceur
function removeQueryParam(key: string) {
  const { [key]: removed, ...rest } = route.query; // Destruction JS Ex6 !
  router.push({ query: rest }); // Je renvoi le restant en bloc dans la gueule du Routeur
}
```

## La Magie Noire : L'État Fantôme du Routage (Invisible à l'URL)

Vous VOULEZ passer une donnée vitale à la page suivante... mais sans que ça ne pourrisse ou sois visible publiquement dans sa barre d'Adresse URL Chrome ! La propriété secrète `state` du Router est la solution :

```typescript
// Je M'envol !
router.push({
  name: "user",
  params: { id: 123 },
  // LA CONTREBANDE :
  state: { fromNotification: true, tokenSuperSecret: "xyz" }, // Totalement Caché Du Public !!
});

// J'atterris à la Destination !
const state = history.state; // Je Fouille La Valise du Navigateur Natif Côté Arrivé
if (state?.fromNotification) {
  showWelcomeMessage(); // Ah ok , Il vient de la notif !!
}
```

## Dompter le Comportement Sauvage de l'Ascenseur JS (Scroll Behavior)

Quand Vue détruit et Remplace les `.vue`, L'ascenseur JS latéral du client ne Remonte PAS EN HAUT ! C'est Inacceptable et donne un site Amteur qui charge les page d'accueil avec le bas de la page (Footer) en plein milieu de l'écran en démarrant ! Corrigeons Ca Absolument :

```typescript
// Dans router/index.js (L'Instanciation Globale) :
const router = createRouter({
  history: createWebHistory(),
  routes,

  // LE JURY DE L'ASCENCEUR JS ! LUI PREND LES DECISIONS A CHAQUE CHEMIN !
  scrollBehavior(to, from, savedPosition) {
    // 1. Bouton Précédent/Suivant de Google Chrome utilisé ??
    if (savedPosition) {
      return savedPosition; // Alors OUI Laisse le mec la ou il en était sur sa page exacte en Pixel !
    }

    // 2. Il cible une ancre HTML précise #Id ?
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth", // Fait un Scroll Doux d'Entreprise
      };
    }

    // 3. Il Essaye Têtu De Re-Cliquer sur l'Url de la MÊME PAGE ! ?
    if (to.path === from.path) {
      return false; // Ne bouge à rien l'Ascenceur tu es deja au bon endroit !
    }

    // 4. SOLUTION PAR DEFAUT MAITRESSE (Changement de Page Banal Normal)
    return { top: 0, behavior: "smooth" }; // Ramène Moi LE COMPTEUR DE PIXEL EN HAUT à 0, Doucement !
  },
});
```

### L'Ascenseur Avec Retardateur Logiciel (Attendre l'Apparition du DOM lourd Async)

Vous risquez de remonter l'ascenseur... ALORS que la nouvelle page Asynchrone n'a même pas eu le temps de s'afficher, Ce qui détruit le Scroll et Fera des bugs Visuels :

```typescript
scrollBehavior(to, from, savedPosition) {
  return new Promise((resolve) => {
    // MAGIE JS PRO : Ouvre Une Pause de 500 Millières Pour que les Graphes API s'Affichent.. ET  Ensuite Scroll en Top Doux
    setTimeout(() => {
      resolve({ top: 0 })
    }, 500)
  })
}
```

## Polymorphisme Spatiale : Les Aliases Magiques d'URL

Vous pouvez Rendre 1 SEUL Composant Vite dispo sur de multiples d'URLs différentes Sans Faire de Copier Coller Crad de code !

```typescript
const routes = [
  {
    path: "/users", // URL Normale Mère
    component: Users,
    alias: ["/people", "/members", "/les-gens"], //  CHACUNES  DE CES URLs AFFICHAGE EXACTEMENT LA VRAIE PAGE SOURCE !!  (Sans de Redirection, ça garde la fausse URL !! Parfait Pour l'UI Marketing SEO)
  },
  {
    path: "/home",
    component: Home,
    alias: "/", // / et /home sont désormais jumeaux identiques siamois
  },
];
```

## Le Traffic Aérien Pur : Les Redirections (Redirects)

A la grande différence de l'Alias Mignon au dessus qui "Feintait", Le _redirect_ LUI, Prends l'URL et **LA CHANGE DE FORCE VISUELLEMENT DANS LA BARRE CHROME** Vers la vraie !

```typescript
const routes = [
  // Redirection Frontale Basique Pure et Dure
  {
    path: "/old-page",
    redirect: "/new-page",
  },

  // Redirection Qui CONSERVE DE FORCE LA VALISE PARAM (Id 25 !)
  {
    path: "/user/:id/profile",
    redirect: { name: "user" }, // /user/25/profile = Devient >  /user/25
  },

  // Redirection Avec Calcul Mathématique Interne de Vol API Custom :
  {
    path: "/search/:query",
    redirect: (to) => {
      // Je Choppe L'Objet route Cible To, et je fabrique une Vraie URL au Retour
      return {
        path: "/results",
        query: { q: to.params.query },
      };
    },
  },

  // LE GOD MODE : LA CATCH ALL ! SI LE MEC TAPE NIMPORTE QUELLE DIABLE  DE LETTRES QUI N'EXISTENT PAS > ALORS JE CANNONISE TOUT CE QUI BOUGE VERS LA 404 DIRECT !!
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];
```

## Analyse Foremensique : L'Échec de Crash de Navigation Moteur

Parfois le Routeur Crash sans rien dire... Comprenez l'Autoposie d'un Push :

```typescript
import { NavigationFailureType, isNavigationFailure } from "vue-router";

async function navigate() {
  const failure = await router.push("/dashboard"); // Est-ce une Promesses de Victoire JS ?

  if (failure) {
    // AH MALHEURE  NON  ! C'est un Crash D'Objet Error !! Analysons le Sang :

    if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      console.log(
        "Tu a été FUSILLÉ par une Douane Navigation Guard à la frontiére !",
      );
    }

    if (isNavigationFailure(failure, NavigationFailureType.duplicated)) {
      console.log(
        "Tu essaie bêtement et vainement de relancer la page ou tu te TROUVES ACTUELLEMENT DEJA !! Je Bloque !",
      );
    }
  }
}
```

## L'État d'Éveil `Router isReady()`

Ne Démarrez JAMAIS l'Application Entière Vue JS tant Que le lourd Moteur routeur n'a pas Initialement lu et chargé la tout Première page Ciblée !!! Un des Bug les plus mortels du SSR Mode :

```typescript
// main.ts
// On met l'Application en PAUSE jusqu'à ce que le Routeur dise OUI !! Je comprend  ou est mon chemin actuel ! :
router.isReady().then(() => {
  app.mount("#app"); // Lancement Nucléaire VUE APP !
});

// En Mode Await dans un composant Async
await router.isReady();
console.log("Le Router A Ouvre ses Yeux, tout le Moteur est Chaud");
```

## Subjugation Intellectuelle Documentaire

- [Le Grimoire Du Router Ascenseur Scroll](https://router.vuejs.org/guide/advanced/scroll-behavior.html) — Oser Maitriser le Drag and Scroll de l'UI Côté Client.

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
