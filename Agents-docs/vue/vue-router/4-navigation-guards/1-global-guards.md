---
source_course: "vue-router"
source_lesson: "vue-router-global-guards"
---

# Les Gardiens de Frontière (Global Navigation Guards)

Les Gardiens de navigation (Navigation guards) vous octroient le pouvoir absolu de trancher la vie ou la mort d'une redirection en vol : Accepter, Refuser, Annuler ou Rediriger silencieusement avant même que la nouvelle page ne s'affiche visuellement !

## L'Armée des Gardes Disponibles

| Le Garde            | Le Rayon d'Action (Scope)       | Cas Pratique Principal (Use Case)                                       |
| ------------------- | ------------------------------- | ----------------------------------------------------------------------- |
| `beforeEach`        | **Mondial !** (Intercepte Tout) | Vérification de Login ! Logging, Analytics                              |
| `beforeResolve`     | Mondial                         | L'Arme Lourde : S'exécute quand tout le code Async compliqué est résolu |
| `afterEach`         | Mondial                         | Google Analytics, Changement dynamique de la balise HTML Title Page     |
| `beforeEnter`       | 1 Seule Route ciblée            | Douanier VIP Spécifique à 1 seule Page                                  |
| `beforeRouteEnter`  | A l'intérieur d'ici (Composant) | Attraper par API la donnée AVANT de l'afficher visuellement             |
| `beforeRouteUpdate` | A l'intérieur d'ici (Composant) | Le composant se redessine suite à un changement de mot d'URL interne    |
| `beforeRouteLeave`  | A l'intérieur d'ici (Composant) | AVERTIR de force sur les données non-sauvegardées en fuyant !           |

## Le Grand Chef de la Frontière : `router.beforeEach`

S'exécute impitoyablement à la Demie-Milliseconde avant CHAQUE tentative de navigation dans le code de tout votre site Web !

```typescript
const router = createRouter({
  /* ... */
});

router.beforeEach((to, from) => {
  console.log(
    `Le suspect vient de ${from.path} et il essaye de rentrer au ${to.path}`,
  );

  // to - L'URL Cible espérée
  // from - L'URL d'où il vient de sauter

  // DECISION DES DOUANES : (Le Return Final) :
  // - return Rien Ou True : ✅ La porte S'ouvre, le gars Passe a temps !
  // - return false : ❌ TAISEZ-VOUS ! La Navigation est annulée brutalement, Rien ne charge !
  // - return '/route' : 🔀 REDIRECTION FORCÉE ET DE FORCE VERS AILLEURS (EX: Login) !
});
```

### Cas D'Entreprise N°1 : La Douane d'Authentification

```typescript
router.beforeEach((to, from) => {
  const authStore = useAuthStore(); // Je Check s'il est Loggé à Sa banque en Store Pinia !

  // Si (La Route exige le Meta Secret d'Auth) MAIS QU'IL (n'est pas Loggué)
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // 🔀 PRISON DIRECTE (VERS LE LOGIN) EN SAUVEGARDANT DANS SA POCHE LA PREUVE DE OU IL VOULAIT ALLER (to.fullPath)
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
  }

  // SYSTEME DE ROLE ADMIN COMPLET
  if (to.meta.requiredRole) {
    // T'ES MEMBRE, C'EST BIEN, MAIS EST CE QUE T'ES VIP ADMIN ??
    if (!authStore.hasRole(to.meta.requiredRole)) {
      return { name: "unauthorized" }; // NON ! INTERDIT !
    }
  }
});
```

### Cas D'Entreprise N°2 : Le Caméléon de l'Onglet Chrome ! (Page Title)

```typescript
router.beforeEach((to) => {
  // JE REGARDE SI UNE ETIQUETTE DE META NOM A ETE ECRITE SUR LA ROUTE..
  // SI OUI JE CHANGE LITTÉRALEMENT LE NOM DE L'ONGLET NOUVELLE WINDOWS CHROME (My APP) EN LE NOM CIBLE !
  document.title = to.meta.title ? `${to.meta.title} | My App` : "My App";
});
```

## Le Notaire Validationnaire : `router.afterEach`

S'exécute pile après que la Navigation ait réussie et sois terminée ! (Attention : Elle ne peut donc plus ni l'Annuler, ni l'affecter ! C'est trop tard, c'est fait !).

```typescript
router.afterEach((to, from, failure) => {
  // Le pisteur Google Analytics pour analyser d'où viennent vraiment les clics !
  analytics.pageView(to.path);

  // Ouhla... la Navigation qu'on a essayé de faire tout à l'heure à merdée ! (failure)
  if (failure) {
    console.log("Navigation Crashée:", failure);
  }

  // ASTUCE UTILE : Forcer à remonter le Scrolling Bar en Haut Par Défaut à la fin !
  window.scrollTo(0, 0);
});
```

## Le Gardien Résolveur Asynchrone : `router.beforeResolve`

C'est LE DERNIER GARDIEN Avant d'Afficher La Page Cible ! Il s'exécute pile _après_ que **TOUS** les composants asynchrones lourds `.vue` aient finis d'être intégralement téléchargé sur le navigateur (Lazy Load API) !

```typescript
router.beforeResolve(async (to) => {
  // Ultra-Parfait pour exécuter et forcer les gros Call Axios REST API de données 100% vitales dont La Page A besoin !
  if (to.meta.requiresData) {
    try {
      await fetchRequiredData(to.params); // Je fetch la donnée API asynchrone Vtale !
    } catch (error) {
      // CA A CRASHÉ (Serveur HS) ! ON DETRUIT LA NATIVATION ET ON L'ENVOI SUR 404 PAGE ERROR !!
      return { name: "error" };
    }
  }
});
```

## Les Gardes Asynchrones (Lents)

Les gardes acceptent absolument des requêtes `await` qui prennent du temps (Call API Auth Serveur lent) :

```typescript
router.beforeEach(async (to) => {
  // Le Moteur met en PAUSE ABSOLUE le chargement de la page visuel TANT QUE CET API SERVEUR N'A PAS VERIFIÉ SUR SA BDD MONDIALE L'ACCES DE L'ILOT !!!
  const canAccess = await checkAccess(to);

  if (!canAccess) {
    return "/login"; // Hop Dégagé
  }
});
```

## L'Armée Multipartite (Plusieurs Gardes)

Les gardes s'exécutent militairement en série les uns après les autres :

```typescript
// Garde N°1 (Douane de Police)
router.beforeEach((to) => {
  console.log("Passeport OK, Tu peux passer à la douane 2");
  // Le Code Continue naturellement à vivre en bas...
});

// Garde N°2 (Douane de Vaccin Aéroport)
router.beforeEach((to) => {
  console.log(
    "ATTENDEZ ! VACCINATION INVALIDE !! JE TUE LA NAVIGATION ICI MÊME !",
  );
  return false; // ❌ LE MOTEUR S'ARRÊTTE A TOUT JAMAIS ! NAVIGATION CRAPUT ANNULÉE !
});

// Garde N°3 (Douane Douanière Bagage) (NE SERA JAMAIS LU CAR LA 2 LUI A COUPÉ LE TICKET DE FORCE !)
router.beforeEach((to) => {
  console.log("Guard 3 Bagage Ok ");
});
```

## L'Ingénierie des Champs Meta Routes ! (`meta`)

Attachez solidement de puissantes Informations Secrètes Datées à l'ADN de vos Routes !

```typescript
const routes = [
  {
    path: "/admin",
    component: Admin,
    // THE GOD MODE META ATTRIBUT :
    meta: {
      requiresAuth: true, // EXIGE LOGIN : OUI
      requiredRole: "admin", // ROLE EXIGE : LE ROI ADMIN
      title: "Mégastructure Administration", // Titre pour Google
      transition: "slide", // L'effet hollywoodien demandé
    },
  },
];

// Lecture Divine Mondiale (Guard beforeEach) :
router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    // La Route Où il  va a t'elle une étiquette ExigeAuth = VRAI ?
    // ALors Procédure Policière Auth !
  }
});

// LE PATTERN D'HÉRITAGE  A CASCADE POUR LES ENFANTS DE ROUTES !!! (Ultra Avancé)
router.beforeEach((to) => {
  // CE SOUS BEBE ROUTE HERITE T'IL INDIRECTEMENT DE L'ETIQUETTE METAE  REQUIRES AUTH D'UN DE SES PERES, GAND-PERE OU ARRIERE GRAND-PERE ?!?!  OUI :
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // ALORS AU MOINS 1 PERE L'A EXIGÉE : ON LE BLOQUE COMME S'IL ÉTAIT SON PÈRE !
  }
});
```

## Le Char d'Assaut TypeScript : Typer Strictement vos Etiquettes Meta !

TypeScript ne sait absolument pas ce que veux dire `{ requiresAuth: true }` sur le `meta` original, il va hurler ! Injectez cette règle et modelez son propre moteur :

```typescript
// Fichier Racine: router.d.ts  (Définition globale)
import "vue-router";

// J'INJECTE DANS LE CŒUR DE VUE-ROUTER CODE BASE CE NOUVEAU MOULAGE TYPESCRIPT :  !
declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiredRole?: string;
    title?: string;
    transition?: string;
  }
}
```

Bravo ! TypeScript vous guidera et validera désormais la frappe parfaite de vos noms de variables Etiquettes Meta sur chaque définition !

## Céleste Documentation Officielle

- [Les Navigation Guards Complets](https://router.vuejs.org/guide/advanced/navigation-guards.html) — L'Essentiel et le Must du Guide Cœur Officiel

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
