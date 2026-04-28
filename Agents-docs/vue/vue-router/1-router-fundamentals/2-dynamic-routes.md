---
source_course: "vue-router"
source_lesson: "vue-router-dynamic-routes"
---

# Marques Dynamiques et Paramètres d'URLs Variantes

Les routes dynamiques vous permettent d'ouvrir une unique page `.vue` maîtresse pour qu'elle puisse s'adapter dynamiquement et intercepter d'innombrables URLs variables (ex: `/user/michel`, `/user/alice`, ou encore les identifiants de produits `/produits/iphone-15`).

## Les Segments Dynamiques Fondamentaux

Utilisez la syntaxe magique des deux points `:nomDuParametre` dans le `router/index.ts` :

```typescript
const routes = [
  {
    // J'Ouvre la Route /users... mais LA SUITE EST VARIABLE MAGIQUE !!!
    path: "/users/:id",
    name: "user", // Raccourcis
    component: UserDetail, // Tous Les Visiteurs finiront sur ce MÊME composant UserDetail !
  },
  {
    // J'Ouvre /posts... LA SUITE EST VARIABLE MAGIQUE !!!
    path: "/posts/:slug",
    name: "post",
    component: PostDetail,
  },
];
```

Ce Dictionnaire Intercepte d'un seul coup tout ceci :

- Si l'URL est `/users/123` → Vue extraira la donnée magique `{ id: '123' }`
- Si l'URL est `/users/abc` → Vue extraira `{ id: 'abc' }`
- Si l'URL est `/posts/mon-super-article` → Vue extraira `{ slug: 'mon-super-article' }`

## Utiliser/Lire les Paramètres capturés dans le Template HTML !

### Avec l'API de Composition (Setup)

Utilisez l'Utilitaire `useRoute()` :

```vue
<script setup>
import { useRoute } from "vue-router"; // L'Outil Lecture de la Barre URL Actuelle !

const route = useRoute();

// On lit la donnée Magique extraite au démarrage de la page !
console.log(route.params.id); // Affichera : '123'
</script>

<template>
  <!-- On affiche en direct ce qu'il y a dans la barre d'adresse ! -->
  <h1>Bonjour Utilisateur N° {{ route.params.id }} !</h1>
</template>
```

### Le Grand Danger Réactif : Écouter Magiquement les Changements de Paramètres

⚠️ Lorsque le client navigue depuis le compte `/users/1` directement vers le compte `/users/2`, **le composant HTML `UserDetail.vue` N'EST PAS RECHARGÉ ni détruit ! IL EST RÉUTILISÉ à VIF !!** Les Hook `onMounted` ne repartiront PAS !

La solution Ultime : Forcer un espion `watch` sur la barre d'URL :

```vue
<script setup>
import { watch } from "vue"; // Mon Espion
import { useRoute } from "vue-router";

const route = useRoute();
const user = ref(null);

// RÈGLE D'OR ENTERPRISE : Toujours Espionner la barre d'URL si le Composant peut boucler sur lui-même !!
watch(
  () => route.params.id, // ESPION : LA BARRE MODIFIE SON ID ??
  async (newId) => {
    // Si oui, on écrase les Datas par celles du nouveau gars cliqué !
    user.value = await fetchUser(newId);
  },
  { immediate: true }, // VITAL : Tourne aussi de Force IMMÉDIATEMENT lors du TOUT 1ER Chargement Froid de la page (Sinon ça Fetchera jamais rien au démarrage)
);
</script>
```

## Les Paramètres Multiples en Chaîne (Le Grand Chelem)

```typescript
const routes = [
  {
    // Cible :  /users/123/posts/456
    path: "/users/:userId/posts/:postId",
    component: UserPost,
  },
];
```

```vue
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
// Le router vous sortira magiquement le dictionnaire :
// route.params = { userId: '123', postId: '456' }
</script>
```

## Les Paramètres Fantômes Optionnels (`?`)

Ajoutez simplement un `?` à la fin d'un segment pour le rendre purement Facultatif (la Route ne plantera pas en 404 s'il est absent) :

```typescript
const routes = [
  {
    // Matchera l'URL '/users' TOUT COMME il matchera aussi '/users/123' !!!
    path: "/users/:id?",
    component: Users,
  },
];
```

## Les Paramètres Infinis à Répétition

L'Arme Ultime pour les Arborescence de Dossiers fichiers cloud (Google Drive, DropBox). Utilisez `+` (Au moins un) ou `*` (Aucun ou une Infinité) :

```typescript
const routes = [
  {
    // URL LUE :  /files/documents/images/vacances
    path: "/files/:path+", // Le Paramètre :path va s'Avaler une Infinité de sous dossiers d'un coup !
    component: FileExplorer,
    // Résultat du Router Moteur  : route.params.path = ['documents', 'images', 'vacances']
  },
  {
    // URL LUE : /docs ou /docs/a/b/c
    path: "/docs/:sections*",
    component: Documentation,
  },
];
```

## Restrictions de Douane Ultra Poussées par Regex

Interdisez l'Hérésie directement au niveau du Routeur Moteur avec des Expressions Récentes (Regex) :

```typescript
const routes = [
  {
    // LE MUR : Regex(\\d+) Cette route REFUSE tout ce qui n'est PAS QUE DES CHIFFRE NUMÉRIQUE !! Impossible d'écrire /users/michel, ça plantera ici !
    path: "/users/:id(\\d+)",
    component: UserDetail,
  },
  {
    // Le Bac A sable  : Intercepte tous le reste de ce qui n'a pas été intercepté au dessus (Ex : Les textes String)
    path: "/users/:username",
    component: UserProfile,
  },
];
```

C'est Ultime ! `/users/123` ira magiquement taper sur la page `UserDetail.vue`, MAIS `/users/alice` ira ouvrir sur la page `UserProfile.vue` !

## L'Art de Nommer Ses Routes (Named Routes)

**Règle d'or Inviolable de Prod** : Toujours, ABSOLUMENT TOUJOURS Nommer TOUTES VOS ROUTES :

```typescript
const routes = [
  {
    path: "/users/profiles/accounts/details/:id", // Un Chemin d'URL Très très chiant à retenir..
    name: "user-detail", // Nom De Code RACCOURCI !! MAGIQUE ET IMMUABLE !
    component: UserDetail,
  },
];
```

```vue
<!-- Dans TOUTE VOTRE APPLICATION, Utilisez LE NOM DE CODE plutôt que le TEXTE DE CHEMIN BRUT CHIANT !!! -->
<router-link :to="{ name: 'user-detail', params: { id: 123 } }">
  Voir Le mec 123
</router-link>
```

Bénéfices Massifs Entreprise :

- Plus de Liens chemins en Dur Pathétiques éparpillés partout dans l'Applicaiont (Type href).
- Transcodage URL Auto Magique (Encodage URL sécu)
- **Refactorisation Indolore Securisée** : Si un jour le patron décide de changer l'adresse `' /users/..'` par `'/clients/..' ` dans le grand fichier Dictionnaire JS `route.ts`, alors **absolument TOUS VOS LIENS MENU du site Web `<router-link name...>` marcheront encore et se mettront à jour PAR PARFAITE MAGIE car eux ne ciblent QUE le Vrai "Code Nom Immuable de Raccourcis" !!**

## Paramètre Tiers de Requête d'URLs (Query Paramètre `?q=xxx`)

Les Query Params (après le point d'interrogation) sont hors de l'architecture de la route stricte et se lisent à part :

```typescript
// Si Mon URL Totale est : /search?q=vue&page=2

const route = useRoute();

// Lecture des Paramètres :
console.log(route.query.q); // Récupère 'vue'
console.log(route.query.page); // Récupère '2' (Attention c'est TOUJOURS un string text ! Convertissez le !)
```

```vue
<!-- Créer ce lien depuis le HTML ! -->
<router-link :to="{ path: '/search', query: { q: 'vue', page: 2 } }">
  Bouton Rechercher !
</router-link>
```

## Le Niveau Dieu : Le "Props Mode" Absolu (Découplage Router)

Extraordinaire ! Vous POUVEZ ordonner au Routeur Pére d'extraire LUI MÊME tous les paramètres dégeux, pour les INJECTER proprement comme par magie en "props" propres à l'intérieur du pauvre Composant Enfant `.vue` (Ce qui lui évitera la syntaxe immonde `route.param` !) :

```typescript
const routes = [
  {
    path: "/users/:id",
    component: UserDetail,
    props: true, // ✅ AUTORISATION MAGIQUE : Transforme de force le ":id" crasseux de l'URL par une Propre "Prop JS" Enfant Impeccable !
  },
];
```

```vue
<!-- Fichier : UserDetail.vue (Un Fichier PUR PROPRE MAINTENANT !) -->
<script setup>
// BOUM !! PLUS BESOIN D'IMPORTER useRoute() ni de se farcir du route.param !! Le Routeur Papa M'ENVOIT l'ID DIRECTEMENT VIA PROP TRADITIONNELLE JS !!
defineProps<{
  id: string
}>()
</script>

<template>
  <!-- MON HTML EST PROPRE ET IMMACULÉ : -->
  <h1>Bonjour Utilisateur {{ id }}</h1>
</template>
```

L'Ingénierie à son paroxysme : Ce Composant `UserDetail.vue` est désormais **100% Découplé et Pur** du Systeme Routeur externe, il est utilisable PARTOUT sans aucune erreur et même importable tel qu'elle dans un projet ou Vue-Routeur n'existe même pas ! C'est ce qu'on appel la classe.

## Formidables Ressources Officielles

- [La Joie de le Route Paramètré (Dynamic Route Matching)](https://router.vuejs.org/guide/essentials/dynamic-matching.html) — Guide suprême du Moteur de Regex URL Vue.

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
