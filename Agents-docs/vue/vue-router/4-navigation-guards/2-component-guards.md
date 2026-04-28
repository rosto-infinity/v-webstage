---
source_course: "vue-router"
source_lesson: "vue-router-component-guards"
---

# Les Gardes Individuels (Routes & Composants Cibles)

Au-delà de l'énorme Mur de Berlin des Gardes "Globaux", vous avez entièrement le droit de définir de microscopiques sentinelles ciblées uniquement sur Une Seule Route, ou encore mieux : Cousus PUREMENT A L'INTÉRIEUR MÊME du fichier logique d'un code de composant HTML Cible `.vue` !

## Les Gardes d'Une Seule Unique Route ciblée (`beforeEnter`)

Cousez le code du Douanier directement DANS le Grand Fichier Moteur de Construit Objet Json `router/index.ts` !

```typescript
const routes = [
  {
    path: "/admin",
    component: Admin,
    // LE DOUANIER CIBLÉ EXACTEMENT A LA FRONTIÈRE DE CETTE VILLE DE L'URL UNIQUEMENT !
    beforeEnter: (to, from) => {
      if (!isAdmin()) {
        return "/unauthorized"; // DÉGAGÉ SALE PAUVRE !
      }
    },
  },
  {
    path: "/user/:id",
    component: User,
    // L'ARMURE MULTI-DOUANIER ARRAY INFINIE ! :
    beforeEnter: [checkAuth, checkOwnership, logAccess],
  },
];

// Les Exemples D'Usines de Sous-Fonctions Douanières Pures Importables ! :
function checkAuth(to, from) {
  if (!isLoggedIn()) return "/login";
}

function checkOwnership(to, from) {
  // Si c'est PAS MON PROFIL PERSONNELLE, ON ME VIRE ! J'Ai po le Droit !
  if (!canAccessUser(to.params.id)) return "/unauthorized";
}

function logAccess(to) {
  console.log(
    "Un Visiteur est Entré Sur ce profil public Utilisateur n°:",
    to.params.id,
  );
}
```

## Les Gardes Directement Cousus Dans l'App API Composition (`.vue`)

Directement intégré à l'intérieur de L'Anatomie De la Fenetre Code du Composant Front-End pour des réactions Extrêmement Intéractives Avec l'Humain du DOM.

### L'Arme d'Evasion de Sauvegarde : `onBeforeRouteLeave`

Criez sur l'Utilisateur avant qu'il ne fuit ou clique sur le logo du site !! Très utiliser sur L'Edition d'Article Ou les Fiches Profils :

```vue
<script setup>
import { ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const hasUnsavedChanges = ref(false); // Si l'Utlisateur Commence a taper dans un Input HTML !

// LE DOUANIER DE FUITE SORTANTE DU COMPOSANT !  IL VEILLE AU REBOT !
onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    // HEEEEE HOOOOO MICHOU T OU OU LA !!

    // Popup Natif OS Windows / Mac :
    const answer = window.confirm(
      "ALERTE : Vous avec de formidables Données Non Sauvegardées ! Étes-Vous SÛR de Vouloir Fuir cette Page pour Toujours ?",
    );
    if (!answer) return false; // ❌ IL TAPE 'ANNULER' !! ON TUE SA NAVIGATION !! IL RESTE LOCKÉ ICI !!
  }
});
</script>
```

### Le Rénovateur Caché Parfait : `onBeforeRouteUpdate`

Mettez l'UI Et l'API à jour Magiquement et de Force parce le Mot de L'Url Dynamique (`/user/1/` a juste été cliqué sur le Link `user/2` ET que La page Composant NE S'EST DONC JAMAIS RE-DEMARRÉE NI RE-AFFICHER , Juste recyclé visuellement !) :

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'

const route = useRoute()
const user = ref(null)

async function fetchUser(id: string) {
  user.value = await api.getUser(id)
}

onMounted(() => {
  fetchUser(route.params.id as string) // Démarrage Normal Standard Initial
})

// 💥 EXPLOSION INTERNE : EXÉCUTÉ DE FORCE SI l'URL A MUTE "/user/1" DIRECT VERS "/user/2" SUR LA MEME PAGE COURANTE !!
onBeforeRouteUpdate(async (to, from) => {

  if (to.params.id !== from.params.id) { // OU IL A VRAIMENT MUTÉ EN UN AUTRE GARS EN CLIQUANT !

    await fetchUser(to.params.id as string) // ON TÉLÉCHARGE LES NOUVELLES DONNES MAGIQUEMENT DU GARS SUR L'UI ! BOUM !

  }
})
</script>
```

## L'Ancien Monde : Component Guards (L'Ancienne Options API Dépréciée !)

(Juste pour votre mémoire collective de L'Histoire du Jurassique JavaScript VueJS) :

```javascript
export default {
  beforeRouteEnter(to, from, next) {
    // ⚠️ ATTTTTENTION C'EST MORTEL : Cette Horreur s'exécute AVANT MÊME que le composant ne sois monté/cérrée dans le Javascript !!
    // VOUS N'AVEZ DONC ABSOLUMENT ACCES A AUCUNE DONNÉE DE `this.` !!! Rien. Vous êtes Un fantôme du néant
    next((vm) => {
      // Pour s'en sortir, C'est à L'Interieur de Ce "next(vm)" crasseux que vous avrez enfin Accès Moteur Instance !
      vm.initializeFromRoute(to);
    });
  },

  beforeRouteUpdate(to, from) {
    // Has access to 'this'
    this.fetchData(to.params.id);
  },

  beforeRouteLeave(to, from) {
    // Has access to 'this'
    if (this.hasUnsavedChanges) {
      return confirm("Fuire En Lâche Tout Nus ?");
    }
  },
};
```

## L'Ordre de Résolution Nucléaire Céleste Des Douaniers (Chronologie)

Voici exactement, chronologiquement l'Ordre Dans Lequel VueRouter exécute CHAQUE GARDE si tout est paramétré à tous les niveaux :

1. `beforeRouteLeave` (Le Fuyard Quitte sa route d'où il vient)
2. **Le Pilier Mondial** : Le Global `beforeEach` de `router.ts` (Le Grand Dieu de la Frontière Mondiale tape !)
3. `beforeRouteUpdate` (Recharge Les Pièces du Mécanisme Moteur Paramétré Dynamique Interne Composant Cible)
4. `beforeEnter` (Douanier Fixé Physique dans le Dictionnaire Routier JSON)
5. Résolution Interne Cache Memory RAM des Fichier Composants Async Route (.vue Lourd Fetch)
6. `beforeRouteEnter` (L'entrée Brutale dans le Fichier.vue lui-même)
7. Global `beforeResolve` (Quand tout a Chargé Async)
8. **LA NAVIGATION EST SCELLÉE ET MAGNIFIÉE DANS TOUTE L'HISTOIRE DU PC DU GARS ET L'URL DANS LA BARRE EST MODIFIÉE !**
9. Global `afterEach` (Google Analystics Trace L'Entrée Validée)
10. Moteur V-Dom VUE JS UPDATE !! MISE A JOUR GRAPHIQUE AFFICHÉE LOURDEMENT !
11. Les Horribles Callback `next` lancés Dans les Méthodes des vieux code Options API.

## Les Modèles Pratiques Les Plus Célèbres De la TERRE !

### 1/ Protéger De La Fugue Et Perte de Formulaire Utilisateur ! (Classique UIX Absolu)

```vue
<script setup>
import { ref, computed } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const originalData = ref({ name: "", email: "" }); // Ce qu'il y'a au tout début du chargement de bdd
const formData = ref({ name: "", email: "" }); // Ce que l'User  Tape actutellement sur son claver !!

const isDirty = computed(
  () =>
    // BOOLEAN SALE : Vrai Si L'User à modifier de force Même UN SEUL CARACTÈRE QUI DU DEPART !!!
    JSON.stringify(formData.value) !== JSON.stringify(originalData.value),
);

onBeforeRouteLeave(() => {
  if (isDirty.value) {
    // S'IL SORT DE LA PAGE ET QUE C'EST SALE ?
    return confirm(
      "Êtes-vous certains d'abandonner cette formidable création textuelle pour toujours ? !!",
    );
  }
});
</script>
```

### 2/ Télécharger Absolument La Data API LOURDE **AVANT** DE MEME NAVIFUER ET AFFICHER !

Elimine Complètement Les Chargeurs Tournants Spinners UI Horribles sur Vos Ecrans Utilisateur Car Ça Cible Direct Dans La Console Moteur Lente De Fetch ! :

```typescript
const routes = [
  {
    path: "/post/:id",
    component: Post,
    beforeEnter: async (to) => {
      try {
        // LA PAUSE DU TEMPS MAGIC ! On Fetch Et Attend L'API (L'URL NE BOUGE PAS TANT QUE C'EST PAS FINI ! L'User croit qu'il reste sur ça page)
        const post = await api.getPost(to.params.id);

        // J'INJECTE DIRECT LE RÉSULTAT DU RESEAU API LENT SERVEUR DANS LA VALISE DATA META CAHCÉE DE CETTE NOUVELLE ROUTE CIBLE !!!  Le Composant en Dessous LIRA ca EN INSTANTANÉ ET SERA DEJA AFFICHER PUR !!!
        to.meta.post = post;
      } catch (error) {
        // C'ETAT DE LA DAUBE L4ETAT SERVEUR : ON LE DEGAGE AVANT MEME DAFFICHER LAM OINDRE ERREUR 404 !!!
        return { name: "not-found" };
      }
    },
  },
];
```

### 3/ La Protection Militaire de Police : Role-Based Route Protection !

Interdit au Paysan. OUI OUI : Un Enrobage de Fausse Fonction Paramétrée TypeScript pour Fabriquer une Vraie Fonction Garde a L'Arrache !! Colossale Classe Absolue !

```typescript
// LA FABRIQUE DE GARDIEN (Génrateur Militaire : Elle pond un Double Function a Volee Garde)
function requireRole(...roles: string[]) {
  return (to, from) => {
    const authStore = useAuthStore()

    // Le Mec N'Est Même Pas Logué ? => JAIL CELL PRISON DIRECT !
    if (!authStore.isLoggedIn) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }

    // Le Mec EST LOGGÉ OUI... MAIS PAS ADMIN  NI SUPER ADMIN ? => REDIRECTION BOULANGERIE !!
    if (!roles.some(role => authStore.hasRole(role))) {
      return { name: 'unauthorized' }
    }
  }
}

// L"USAGE MAGIQUE INCROYABLE LE PLUS COURT POSSIBLE DU MONDE DU JS EN PRODUCTION JSON :
{
  path: '/admin',
  component: Admin,
  beforeEnter: requireRole('admin', 'superadmin') // WAOUW L'INGÉNIERIE JSS !!  !!! 🚀🚀
}
```

## Absolument Fabuleuses Ressources

- [Les Gardes In-The-Matrix (Dans Le Composant.Vue)](https://router.vuejs.org/guide/advanced/navigation-guards.html#In-Component-Guards) — Oser Maitriser La Fuite DOM Native (BeforeLeave) de très Haut Niveau.

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
