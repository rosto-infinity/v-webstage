---
source_course: "vue-foundations"
source_lesson: "vue-foundations-reactive-objects"
---

# Les Objets Réactifs avec reactive() (Reactive Objects)

Tandis que `ref()` peut envelopper n'importe quel type de valeur, `reactive()` est spécifiquement et uniquement conçu pour les objets JavaScript (Dictionnaires et Tableaux). Il rend l'objet entier profondément réactif sans jamais avoir besoin d'utiliser `.value`.

## Utilisation Basique

```vue
<script setup>
import { reactive } from "vue";

const state = reactive({
  count: 0,
  message: "Bonjour",
  user: {
    name: "Alice",
    email: "alice@exemple.com",
  },
});

// Aucun .value n'est nécessaire ! L'accès est naturel.
state.count++;
state.message = "Bonjour Vue !";
state.user.name = "Bob";
</script>

<template>
  <p>Compteur : {{ state.count }}</p>
  <p>Message : {{ state.message }}</p>
  <p>Utilisateur : {{ state.user.name }}</p>
</template>
```

## reactive() vs ref() - Lequel dois-je utiliser ?

### Utilisez plutôt `ref()` quand :

```vue
<script setup>
import { ref } from "vue";

// ✅ Pour les valeurs Primitives
const count = ref(0);
const isLoading = ref(false);
const name = ref("Alice");

// ✅ Pour les variables qu'on pourrait réécraser entièrement plus tard
const selectedUser = ref(null);
selectedUser.value = { id: 1, name: "Bob" }; // Ça marche !

// ✅ Pour les Tableaux qu'on reçoit d'une API et qu'on remplace
const items = ref(["A", "B"]);
items.value = ["X", "Y", "Z"]; // Ça marche !
</script>
```

### Utilisez plutôt `reactive()` quand :

```vue
<script setup>
import { reactive } from "vue";

// ✅ L'état Local d'un gros Formulaire
const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

// ✅ Un objet d'état immuable dans sa structure globale
const settings = reactive({
  theme: "dark",
  language: "fr",
  notifications: {
    email: true,
    push: false,
  },
});
</script>
```

## Les 3 Grosses Limites de reactive()

### 1. Ne fonctionne QU'AVEC des Objets

```javascript
import { reactive } from "vue";

// ❌ CECI NE MARCHE PAS ET SERA IGNORÉ
const count = reactive(0); // Retourne juste 0, pas réactif !
const message = reactive("hi"); // Retourne 'hi', pas réactif !

// ✅ Doit obligatoirement être un objet JavaScript { }
const state = reactive({ count: 0 });
```

### 2. On ne peut PAS le réassigner/écraser

```javascript
import { reactive } from "vue";

let state = reactive({ count: 0 });

// ❌ CECI TUE LA RÉACTIVITÉ D'UN COUP ! (Destruction du Proxy original)
state = reactive({ count: 1 });

// ✅ À la place, on doit modifier les propriétés à la main
state.count = 1;

// Ou utiliser Object.assign pour écraser en masse les propriétés
Object.assign(state, { count: 1, message: "nouveau" });
```

### 3. La Destructuration ES6 détruit la réactivité

```javascript
import { reactive } from "vue";

const state = reactive({ count: 0, name: "Alice" });

// ❌ Ces variables "détachées" ont perdu leur connexion avec Vue !
const { count, name } = state;
count++; // Compteur JS basique, l'interface graphique ne sera pas mise à jour !

// ✅ Utilisez toRefs() si vous devez absolument destructurer un Objet Reactive
import { toRefs } from "vue";
const { count, name } = toRefs(state);
count.value++; // Réactif, et nécessite le retour du .value !
```

## Profondeur de Réactivité (Deep Reactivity)

Tout comme `ref()`, `reactive()` crée des objets réactifs **en profondeur** :

```vue
<script setup>
import { reactive } from "vue";

const state = reactive({
  level1: {
    level2: {
      level3: {
        value: "profond",
      },
    },
  },
});

// TOUS les niveaux de l'arbre sont surveillés magiquement par Vue
state.level1.level2.level3.value = "modifié"; // Déclenche la MAJ sans problème !
</script>
```

## Combiner ref() et reactive()

Il est tout à fait normal de mélanger les deux approches au sein d'un même composant :

```vue
<script setup>
import { ref, reactive } from "vue";

// Variables simples avec ref
const isLoading = ref(false);
const error = ref(null);

// Objet lourd avec reactive
const form = reactive({
  email: "",
  password: "",
});

// API d'utilisateur
const user = reactive({
  profile: null,
  preferences: {
    theme: "light",
  },
});

async function login() {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await api.login(form.email, form.password);
    user.profile = response.user; // Aucun .value, grâce à reactive !
  } catch (e) {
    error.value = e.message; // Obligatoire, car c'est une ref()
  } finally {
    isLoading.value = false;
  }
}
</script>
```

## La Recommandation Officielle

L'équipe cœur de Vue recommande aujourd'hui d'**utiliser `ref()` par défaut absolument partout** comme API principale, pour ces raisons :

1. **Syntaxe Cohérente** : Vous savez que si c'est réactif, il y a TOUJOURS un `.value` en JavaScript. Pas de piège au moment de la lecture.
2. **Plus souple** : Fonctionne avec absolument tous les types de valeurs, sans exception.
3. **Pas de problèmes d'écrasement** : Vous pouvez réassigner `.value` sans crainte de casser le lien avec l'interface.
4. **Meilleure destructuration** : Parfaitement naturel avec le retour des fonctions composables.

```vue
<script setup>
import { ref } from "vue";

// 🌟 Ce pattern moderne (Full-Ref) est le plus sûr aujourd'hui :
const count = ref(0);
const user = ref(null);
const items = ref([]);

const form = ref({
  email: "",
  password: "",
});
</script>
```

## Ressources

- [Référence de l'API : reactive()](https://vuejs.org/api/reactivity-core.html#reactive) — Documentation officielle.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
