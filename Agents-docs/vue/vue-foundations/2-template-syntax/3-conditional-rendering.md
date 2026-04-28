---
source_course: "vue-foundations"
source_lesson: "vue-foundations-conditional-rendering"
---

# Rendu Conditionnel avec v-if et v-show (Conditional Rendering)

Vue propose deux directives principales pour afficher conditionnellement des éléments : `v-if` (pour une création/destruction réelle dans le DOM) et `v-show` (pour basculer la visibilité CSS). Comprendre quand utiliser l'un ou l'autre est essentiel pour les performances de votre application.

## La Directive v-if

La directive `v-if` affiche l'élément uniquement si l'expression passée est vraie (truthy) :

```vue
<script setup>
import { ref } from "vue";

const isLoggedIn = ref(false);
const hasPermission = ref(true);
</script>

<template>
  <div v-if="isLoggedIn">
    <p>Heureux de vous revoir !</p>
    <button>Se déconnecter</button>
  </div>

  <div v-if="hasPermission">
    <p>Vous avez le droit de voir ce contenu.</p>
  </div>
</template>
```

Quand `isLoggedIn` est `false` (faux), la balise `<div>` et tous ses enfants sont **totalement supprimés physiquement** du DOM. Ils n'existent littéralement plus.

## v-else et v-else-if

Vous pouvez fournir des blocs alternatifs via `v-else` et `v-else-if` (exactement comme en JavaScript) :

```vue
<script setup>
import { ref } from "vue";

const userRole = ref("admin");
const isAuthenticated = ref(true);
</script>

<template>
  <!-- if/else simple -->
  <div v-if="isAuthenticated">
    <p>Bienvenue sur votre tableau de bord !</p>
  </div>
  <div v-else>
    <p>Veuillez vous connecter pour continuer.</p>
    <button>Connexion</button>
  </div>

  <!-- Conditions multiples -->
  <div v-if="userRole === 'admin'">
    <h2>Panel Administrateur</h2>
    <p>Vous avez tous les droits.</p>
  </div>
  <div v-else-if="userRole === 'editor'">
    <h2>Espace Rédacteur</h2>
    <p>Vous pouvez éditer le contenu.</p>
  </div>
  <div v-else-if="userRole === 'viewer'">
    <h2>Lecteur</h2>
    <p>Vous ne pouvez que regarder.</p>
  </div>
  <div v-else>
    <h2>Invité</h2>
    <p>Inscrivez-vous pour avoir accès.</p>
  </div>
</template>
```

**Très Important** : Un élément `v-else` ou `v-else-if` DOIT suivre immédiatement un élément avec `v-if` ou `v-else-if` (sans aucune autre balise HTML entre les deux), sinon Vue ne le reconnaîtra pas et plantera.

## v-if sur un `<template>` invisible

Si vous voulez appliquer une condition `v-if` sur _plusieurs éléments à la fois_ sans vouloir ajouter de balise `<div>` inutile dans le HTML final, utilisez la balise invisible `<template>` :

```vue
<script setup>
import { ref } from "vue";

const showDetails = ref(true);
</script>

<template>
  <template v-if="showDetails">
    <h2>Détails du Produit</h2>
    <p>La belle description super longue ici...</p>
    <p>Prix : 99.99 €</p>
  </template>
  <!-- Aucun conteneur inutile n'est généré dans le HTML final ! -->
</template>
```

La balise `<template>` est purement fantôme, elle ne pollue pas la structure de la page.

## La Directive v-show

À l'inverse, `v-show` ne détruit pas les balises, il se contente d'ajouter ou de retirer la propriété CSS `display: none` :

```vue
<script setup>
import { ref } from "vue";

const isVisible = ref(true);
</script>

<template>
  <div v-show="isVisible">
    J'existe TOUJOURS dans le DOM (la page web), je suis juste masqué avec
    'display: none' si beoin.
  </div>

  <button @click="isVisible = !isVisible">Basculer la Visibilité</button>
</template>
```

## v-if vs v-show : Lequel choisir ?

| Aspect                 | v-if                               | v-show                                          |
| ---------------------- | ---------------------------------- | ----------------------------------------------- |
| **La Balise (DOM)**    | Ajoute/Détruit l'élément           | Toujours présente                               |
| **Initialisation**     | Paresseux (Ne fait rien si faux)   | S'affiche (invisible)                           |
| **Coût d'Inversion**   | Élevé (Reconstruit tout l'élément) | Très faible (C'est juste du CSS)                |
| **Quand l'utiliser ?** | Cas Rares / Grosse logique JS      | Menus déroulants / Boutons cliqués très souvent |

### Utilisez `v-if` quand :

```vue
<script setup>
import { ref } from "vue";

const userType = ref("free"); // 'free' ou 'premium'
</script>

<template>
  <!-- Cette condition a très peu de chances de changer 50 fois par seconde -->
  <PremiumFeatures v-if="userType === 'premium'" />
  <FreeFeatures v-else />
</template>
```

### Utilisez `v-show` quand :

```vue
<script setup>
import { ref } from "vue";

const activeTab = ref("details");
</script>

<template>
  <!-- Le système d'onglets (Tabs) est cliqué frénétiquement par l'utilisateur -->
  <div v-show="activeTab === 'details'">Détails du produit...</div>
  <div v-show="activeTab === 'reviews'">Avis clients...</div>
  <div v-show="activeTab === 'specs'">Spécifications techniques...</div>
</template>
```

## Pièges Fréquents (À Éviter absolument)

### v-show ne marche PAS sur la balise `<template>` !

```vue
<!-- CA NE MARCHERA JAMAIS ! Vue ignorera le v-show -->
<template v-show="condition">
  <p>Mon contenu</p>
</template>
```

Si vous utilisez `<template>`, vous DEVEZ utiliser `v-if`. Si vous voulez vraiment un `v-show`, vous devez créer un vrai `<div>`.

### Le Pire Crime : v-if sur la même ligne qu'un v-for

**Ne mettez JAMAIS un `v-if` et un `v-for` sur le même élément !** C'est formellement interdit par l'ESLint officiel de Vue. Le `v-if` a la priorité la plus forte et tentera de s'exécuter AVANT la boucle de la ligne, ce qui finira immanquablement par un beau crash.

```vue
<!-- MAUVAIS : CATASTROPHE - Crash -->
<li v-for="user in users" v-if="user.isActive">...</li>

<!-- BIEN : On enveloppe d'abord, on filtre ensuite -->
<template v-for="user in users" :key="user.id">
  <li v-if="user.isActive">{{ user.name }}</li>
</template>

<!-- EXCELLENT (La Méthode Royale) : On filtre via une Propriété Calculée (Computed JS) -->
<li v-for="user in activeUsers" :key="user.id">{{ user.name }}</li>
```

## Ressources

- [Rendu Conditionnel](https://vuejs.org/guide/essentials/conditional.html) — Documentation officielle sur v-if, v-else, et v-show.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
