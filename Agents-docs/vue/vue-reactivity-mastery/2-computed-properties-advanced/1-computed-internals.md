---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-computed-internals"
---

# Le Fonctionnement Cœur des Propriétés Calculées (Computed Properties)

Les propriétés calculées (`computed`) comptent parmi les fonctionnalités les plus puissantes, impressionnantes et redoutables de Vue. Principalement car elles mettent en cache d'elles-mêmes sans aucun effort de votre part le résultat de leurs valeurs dérivées complexes et ne se recalculent magiquement QUE lorsque l'une de leurs sous-dépendances primaires vient de muter.

## L'Incroyable Mécanisme Interne de Mise en Cache

Contrairement aux simples fonctions (`methods()`) que vous appelez bêtement dans le template à l'ancienne (qui se ré-exécutent aveuglément à CHAQUE micro-mouvement de souris sur la page), les propriétés `computed` ont un vrai cerveau et **mettent en cache permanent** tous leurs résultats informatiques :

```vue
<script setup>
import { ref, computed } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");

// Propriété Calculée (Computed) : EST MISE EN CACHE, et son code lourd ne s'exécutera au final QU'UNE SEULE FOIS dans la vie du site (tant que les dépendances ref restent inchangées)
const fullName = computed(() => {
  console.log("Traitement Lourd CPU de fullName..."); // N'apparaitra qu'une fois dans la console !
  return `${firstName.value} ${lastName.value}`;
});

// Méthode standard : S'exécute bêtement indéfiniment à chaque frappe de clavier sur toute la page
function getFullName() {
  console.log("Exécution Bête de getFullName..."); // Apparaitra des centaines de fois dans la console !
  return `${firstName.value} ${lastName.value}`;
}
</script>

<template>
  <!-- Computed : Le script JS ne log qu'une seule fois dans la console ! Vue a tapé dans le Cache Gratuit pour les afficher tous -->
  <p>{{ fullName }}</p>
  <p>{{ fullName }}</p>
  <p>{{ fullName }}</p>

  <!-- Méthode : Le script JS log lamentablement et lourdement 3 fois de suite la fonction -->
  <p>{{ getFullName() }}</p>
  <p>{{ getFullName() }}</p>
  <p>{{ getFullName() }}</p>
</template>
```

## Le Traçage "Mental" des Dépendances (Dependency Tracking)

Vue track et espionne avec intelligence **exactement** quelles valeurs natives réactives une propriété calculée a osé lire à l'intérieur de sa fonction, et comment :

```typescript
import { ref, computed } from "vue";

const price = ref(100);
const quantity = ref(2);
const taxRate = ref(0.1);
const applyDiscount = ref(false);
const discountPercent = ref(0.2);

const total = computed(() => {
  // ICi au premier passage, Vue traquera religieusement et liera son existence à ces trois-là : price, quantity, taxRate
  let subtotal = price.value * quantity.value;
  let tax = subtotal * taxRate.value;

  // ICI Vue conditionnera dynamiquement sa dépendance absolue aux autres:  applyDiscount et même parfois discountPercent
  if (applyDiscount.value) {
    subtotal -= subtotal * discountPercent.value;
  }

  return subtotal + tax;
});
```

**Concept Majeur & Foudroyant** : Les dépendances intimes sont piochées et abandonnées **dynamiquement**. Si `applyDiscount` est `false`, n'importe de quel changement ou mutation sur la variable `discountPercent` ne déclenchera **ABSOLUMENT AUCUN** recalcul du Total ! Car le moteur sait qu'on n'y arrive jamais.

## Différences strictes Industrielles : Computed vs Méthodes vs Watchers

| Cas d'Usage Exact et Exclusif !                                                                                                                    | Que Dois-je Utiliser l'Ingénieur ?    |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Dériver par pur calcul logique une pure variable complexe depuis l'état natif                                                                      | `computed()`                          |
| Formater, Nettoyer ou Transformer du texte pur pour un affichage visuel HTML                                                                       | `computed()`                          |
| Un traitement qui aurait BESOIN de paramètres entrants `(arg)` extérieurs                                                                          | Fonction `method()` stricte           |
| Un Traitement qui exécute du pur "Effet de Bord" réseau ou système (Appel API HTTP fetch, timer setInterval, modifier soudainement l'HTML , etc..) | Les `watch()` / `watchEffect()` purs  |
| De Très Gros Calculs très lents et immenses de Math appelés sans arrêts                                                                            | Le `computed()` pur mis en base Cache |

## Les Enchaînements Infernaux de Cascades (Chained Computed Properties)

Les propriétés calculées sont capables sans problème de dépendre viscéralement d'autres propriétés calculées mères :

```typescript
import { ref, computed } from "vue";

const items = ref([
  { name: "Apple", price: 1.5, quantity: 3 },
  { name: "Banana", price: 0.75, quantity: 5 },
  { name: "Orange", price: 2, quantity: 2 },
]);

// Premiere Couche Computed (Total Individuel Ligne de Panier)
const itemTotals = computed(() =>
  items.value.map((item) => ({
    ...item,
    total: item.price * item.quantity,
  })),
);

// Seconde Couche Sous-Computed (Le Total Global Du Panier : dépend à 100% de la Première Couche !)
const subtotal = computed(() =>
  itemTotals.value.reduce((sum, item) => sum + item.total, 0),
);

// Troisième Couche d'Enchaînement (La Taxe unique : Dépend de la 2e Couche Sous-Computed)
const tax = computed(() => subtotal.value * 0.1);

// Quatrième et dernière Couche Finale : (L'addition Final TTC, croise deux immenses Computed Mère du niveau du dessus !)
const grandTotal = computed(() => subtotal.value + tax.value);
```

Soyez tranquille : Le système atomique de Vue.js gère tout l'arbre entier des dépendances en cascade comme un pro mathématique sans broncher !

## Deboguer ses "Computed Properties" Folles en Developpement

Vue 3 Offre deux APIs secrets ultimes incroyables de pur débug (`onTrack` et `onTrigger`) pour observer ce que le moteur pense à l'intérieur d'un refComputed particulier :

```typescript
import { ref, computed } from "vue";

const count = ref(0);

const double = computed(() => count.value * 2, {
  onTrack(e) {
    // EST DÉCLENCHÉ au premier run : Quand Vue s'est rendu compte secrètement "AHAH !! toi mon grand, tu as sniffé la dépendance 'count' !"
    console.log("[DEBUG VUE INTERNE] Le Tracking Radar à vu une Cible :", e);
  },
  onTrigger(e) {
    // ET CA EST DÉCLENCHÉ A CHAQUE NOUVEAU RUN : Quand l'IA moteur force le computed à se recalculer dans la douleur !
    console.log(
      "[DEBUG VUE RE-ECRITURE] J'ai Re-Déclencher la Calculette car Mutée par cette ref :",
      e,
    );
    debugger; // Force l'arrêt et la pause Dev-Tools navigateur du navigateur ici net pour analyser
  },
});
```

## Règles d'Or d'Architecture de Performance des Computeds

### Quand le "Computed" Brille de Mille Feux et Divinise Votre App !

```typescript
// ✅ PARFAIT et SUBLIME : Un énorme calcul infernal (Gros Array Mapping map, filtre lourd filter, classements complexes lourds JS sort) utilisé aléatoirement plus tard n'importe par qui n'importe quand !
const filteredItems = computed(() => {
  return largeArray.value
    .filter((item) => item.active)
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);
});
```

### Ce qu'il ne faut SURTOUT JAMAIS FAIRE avec un Computed !!

```typescript
// ❌ TOTALEMENT INUTILE, RIDICULE ET LENT POUR LE MOTEUR : 1 Ligne Inutile Accès à Une Simple ref Native imbriquée !! Mais Pourquoi faire  ?!
const userName = computed(() => user.value.name);

// ✅ LISEZ SIMPLEMENT DANS VOTRE HTML :
// L'accès direct {{ user.name }} suffit amplement !!

// ❌ INTERDICTION FORMELLE DE FAIRE UN EFFET DE BORD RESEAU HTTP ICI (API FETCH / DB !!!) CA VA PLANTER
const data = computed(() => {
  console.log("Fetching..."); // Ceci en plus est illégal ! Le Computed doit se taire.
  return fetchData(); // HORREURE ! Du Fetch Async API dans une Formule Mathématique de Computed ! C'est STRICTEMENT interdit ! (Et d'ailleurs ca marche même pas en Vue 3) Utilisez le composant 'Aysnc Vue'  ou un 'Watcher' natif !
});
```

## Les Setters Secrets des "Computed" Modernes (Getters and Setters)

Et OUI !! Un Développeur pro niveau senior peut tout à fait écrire en FORCE une valeur vers (ou à l'intérieur de) une Computed Property et inverser le processus Moteur !! Si il définie proprement la méthode `set()` à l'intérieur bien sûr :

```typescript
import { ref, computed } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");

// Syntaxe OBJET secrète avancée pour le JS
const fullName = computed({
  // 1- LE GIVER : Le calcul traditionnel d'envoi classique  (John + Doe)
  get() {
    return `${firstName.value} ${lastName.value}`;
  },

  // 2 - LE RECEVEUR EN FLUX INVERSE : Ce code d'urgence va éclater et détruire la chaîne en petit bouts pour modifier A L'ENVERS ses variables parents mères originelles et secrètes !!
  set(newValue: string) {
    const parts = newValue.split(" "); // Je coupe le string 'Jane Smith' par les espaces (" ")
    firstName.value = parts[0] || ""; // J’écrase le pauvre petit parent originel ref ("John")
    lastName.value = parts.slice(1).join(" ") || ""; // J’écrase l'autre parent ref ("Doe")
  },
});

// Et Là, d'un coup de Baguette magique.. Mon App Devient dingue :
fullName.value = "Jane Smith"; // Je PEUX écrire DANS ma Formule !! Ça Pousse Magiquement TOUTES ses refs parentes 'firstName'='Jane', et 'lastName'='Smith' aux antipodes du composant ! La boucle magique infinie !
```

## Ressources Primordiales Officielles

- [Les Incroyables Propriétés Calculées](https://vuejs.org/guide/essentials/computed.html) — La doc fondamentale et fondatrice la plus dingue de Vue sur les merveilles des Computeds !

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
