---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-ref-vs-reactive-decision"
---

# `ref()` vs `reactive()`: Faire le Meilleur Choix

Aussi bien `ref()` que `reactive()` créeront un "État Réactif" global, mais ils répondent de manière distincte à des besoins différents. Comprendre absolument _Quand_ utiliser l'un ou l'autre est crucial pour maintenir la stabilité en entreprise.

## Comparaison Rapide et Essentielle

| Fonctionnalité Exigée                                              | `ref()`                    | `reactive()`                    |
| ------------------------------------------------------------------ | -------------------------- | ------------------------------- |
| Accepte les valeurs Primitives (`1` , `"x"`, `true`)               | ✅ OUI                     | ❌ NON (Interdit d'usage)       |
| Exige de rajouter `.value` partout en JS pur                       | ✅ OUI                     | ❌ NON (Plus élégant)           |
| La Variable cible peut être Écrasée/Réassignée                     | ✅ OUI                     | ❌ NON (Réactivité morte sinon) |
| Déstructuration ES6 en local sécurisée                             | ✅ OUI (Sauf son `.value`) | ❌ NON (Réactivité morte)       |
| Se "Déballe" magiquement sans `.value` dans le HTML `<template>` ? | ✅ OUI                     | ✅ Sans Objet (N/A)             |

## Quand utiliser le sacro-saint `ref()`

### 1. Pour Absolument toutes les Valeurs Primitives

```typescript
import { ref } from "vue";

// ✅ PARFAIT pour de simples chiffres, textes et booléens
const count = ref(0);
const name = ref("Alice");
const isLoading = ref(false);
const selectedId = ref<number | null>(null);
```

### 2. Pour des Variables Destinées à Être Totalement Remplacées !

```typescript
import { ref } from "vue";

// ✅ L'Emballage Ref() Permettra sans danger d'Écraser et Remplacer intégralement l'Objet intérieur plus tard !
const user = ref<User | null>(null);

async function loadUser() {
  user.value = await fetchUser(); // BOUM ! Remplacement global et total sans danger de la structure entière. La réactivité est sauve (protégée par le Proxy Ref parent)
}

const items = ref<Item[]>([]);

function resetItems() {
  items.value = []; // Remplace magiquement le grand tableau array
}
```

### 3. Pour Renvoyer des API propres depuis des Composables

```typescript
import { ref, computed } from "vue";

function useCounter() {
  const count = ref(0);
  const double = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  // ✅ Toutes ces Refs peuvent alors être déstructurées violemment par sécurité car leurs proxy englobant les protègent intrinsèquement !
  return { count, double, increment };
}

// Le Développeur Consommateur lambda peut de suite les exploser pour le JS sans tuer l'App :
const { count, double, increment } = useCounter();
```

## Quand utiliser à tout prix `reactive()`

### 1. Pour Regrouper par Thème un État Fortement Lié

```typescript
import { reactive } from "vue";

// ✅ Quand des variables ont du sémantique liées entre-elles très proche.
const mouse = reactive({
  x: 0,
  y: 0,
});

window.addEventListener("mousemove", (e) => {
  // Avantage : Aucune pollution visuelle avec dix thousand `.value` !
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
```

### 2. L'État des Grands Formulaires HTML Globaux

```typescript
import { reactive } from "vue";

// ✅ Gérer visuellement un Formulaire d'Abonnement Massif
const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

// Accès super clair et limpide en Validation JS sans les `.value` !
function validate() {
  return form.email.includes("@") && form.password.length >= 8;
}
```

### 3. Les Configuration d'États Fines (Qui ne seront JAMAIS réassigné de 'A à Z')

```typescript
import { reactive } from "vue";

// ✅ L'Objet gigantesque de configuration global
const settings = reactive({
  theme: "dark",
  fontSize: 14,
  notifications: true,
});

// Mutez une par une les propriétés internes à la main. NE JAMAIS REASSIGNER L'OBTET ENTIER !!
settings.theme = "light";
```

## "La Recommandation Officielle Majeure Mondiale" de L'Équipe Vue

La consigne standard est de **toujours utiliser `ref()` comme Réflexe Ultime Principal et Majoritaire pour son App**, voici ses très grands avantages industriels :

```typescript
import { ref } from "vue";

// ✅ Sécurité Standard : On est Forcé par le code à "VOIR" un .value en JS
const count = ref(0);
const user = ref({ name: "Alice" });
const items = ref(["a", "b", "c"]);

// La Clarté Ultime Absolue de votre code :
function process(count: number) {
  // ...
}

process(count.value); // Le Code HURLENT littéralement de lui même aux autres développeurs que : "Cette Info transmise est UNE DATA RÉACTIVE et magique car j'invoque sa base .value pour lui passer de force en dur".
// Avec reactive() le JS n'affiche rien du tout de ça et le code semble banal. Le dev ne pourra pas la distinguer d'une autre pauvre variable pure et banale js non-appliante...
```

## Fusionner de Concert un Mix de `ref()` et `reactive()`

Il est tout à fait standard d'optimiser selon les cibles :

```typescript
import { ref, reactive, computed } from "vue";

// Primitives et datas instables qui seront remplacées un jour = ref !
const isLoading = ref(false);
const error = ref<Error | null>(null);
const selectedUserId = ref<number | null>(null);

// Etat Fortement Grouper par Thématique : reactive !
const filters = reactive({
  search: "",
  status: "all",
  sortBy: "name",
});

// Variables Dérivées (Computed) mixées depuis les deux sans soucis :
const activeFilters = computed(() => {
  return Object.entries(filters).filter(
    ([_, value]) => value !== "" && value !== "all",
  );
});
```

## Convertisseur Magique d'Urgence Entre ces 2 Formes (`toRef` & `toRefs`)

Si un développeur veut briser un Grand objet `reactive` en simple petite parties isolées par destructuration ES6... vous DEVEZ utiliser la fonction de survie `toRefs` !

### 1. Extirper 1 seule variable du tas (L'Extracteur Selectif `toRef()`)

```typescript
import { reactive, toRef } from "vue";

const state = reactive({ count: 0 });

// CRÉER littéralement par Magie Un Ref Isolée de secours pour se brancher discrètement et se synchroniser sur un simple state.count interne distant !
const countRef = toRef(state, "count");

countRef.value++; // ✅ Met également magiquement la source d'origine lointaine 'state.count' à Jour !!
```

### 2. Extirper MASSIVEMENT tout en Ref Isolés ! (L'Exploseur Atomique `toRefs()`)

```typescript
import { reactive, toRefs } from "vue";

const state = reactive({ count: 0, name: "Vue" });

// Convertir brutalement CHACUNE d'entre-elles en leurs propres vrais Proxy Ref Isolées et robustes, PUIS la détruire
const { count, name } = toRefs(state);

count.value++; // Met très bien à jour l'Historique lointain de state.count
name.value = "Vue 3"; // Idem ! L'UI HTML se met jour des 2 cotés !
```

## Résumé et Règles d'or Strictes Finales

1. **Par Défaut pour presque TOUT** : Prenez un `ref()`. (Surtout si vous avez Peur)
2. **Prenez un`reactive()`** uniquement pour des Objets de variables très fortement couplées et intimes entre-elles, ou pour des formulaires complets lisibles.
3. **NE MIXEZ PAS TOTALEMENT les modèles en pagaille** - Restez strict par dossier avec votre équipe !
4. **Appelez AU SECOURS `toRefs()`** IMPERATIVEMENT TOUJOURS si vous allez "Destructurer avec les `{}` JS ES6 un Objet Parent Reactive", sinon vous BRISEREZ TOUTE LAPP !!!
5. **Ayez confiance aveugle en TypeScript** pour identifier ces erreurs bêtas de `.value` ou de pertes de réactivités non souhaitées !

## Grandes Ressources Exclusives

- [La Réactivité au Peigne fin (Référence Absolue Ultime par la core Team et Evan You)](https://vuejs.org/guide/extras/reactivity-in-depth.html) — La documentation la plus folle et difficile de la team pour comprendre les rouages complet de la théorie du réactor.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
