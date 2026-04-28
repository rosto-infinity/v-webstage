---
source_course: "vue-foundations"
source_lesson: "vue-foundations-form-input-bindings"
---

# Liaison de Champs de Formulaire avec v-model (Input Bindings)

La directive magique `v-model` crée une **liaison de données bidirectionnelle** (two-way data binding) sur les champs de formulaire. Elle synchronise instantanément et automatiquement ce que tape l'utilisateur avec la variable d'état de votre composant.

## Utilisation Basique

SANS `v-model`, vous devriez gérer manuellement la valeur DANS LES DEUX SENS :

```vue
<script setup>
import { ref } from 'vue'

const message = ref('')

function handleInput(event: Event) {
  // L'utilisateur tape -> On met à jour la variable manuellement
  message.value = (event.target as HTMLInputElement).value
}
</script>

<template>
  <!-- Liaison bidirectionnelle MANUELLE super lourde -->
  <input :value="message" @input="handleInput" />
</template>
```

AVEC `v-model`, c'est infiniment plus simple :

```vue
<script setup>
import { ref } from "vue";

const message = ref("");
</script>

<template>
  <!-- Liaison bidirectionnelle TOTALEMENT AUTOMATIQUE -->
  <input v-model="message" />

  <p>Vous avez tapé : {{ message }}</p>
</template>
```

## Champs Texte (Inputs & Textareas)

```vue
<script setup>
import { ref } from "vue";

const username = ref("");
const bio = ref("");
</script>

<template>
  <!-- Champ sur une seule ligne -->
  <input v-model="username" placeholder="Nom d'utilisateur" />

  <!-- Zone de texte multiligne -->
  <textarea v-model="bio" placeholder="Parlez-nous de vous..."></textarea>
</template>
```

**Très Important** : N'utilisez JAMAIS d'interpolation `{{ }}` à l'intérieur d'un `<textarea>` en Vue, cela ne fonctionnera pas :

```vue
<!-- ❌ MAUVAIS : HTML standard, mais refusé par Vue -->
<textarea>{{ message }}</textarea>

<!-- ✅ EXCELLENT : La "Vue way" -->
<textarea v-model="message"></textarea>
```

## Cases à Cocher (Checkboxes)

### Case Unique (Vrai / Faux)

```vue
<script setup>
import { ref } from "vue";

const isAgreed = ref(false);
const receiveNewsletter = ref(true); // Coché par défaut !
</script>

<template>
  <label>
    <input type="checkbox" v-model="isAgreed" />
    J'accepte les conditions générales
  </label>
  <p>Accepté : {{ isAgreed }}</p>

  <label>
    <input type="checkbox" v-model="receiveNewsletter" />
    S'abonner à la newsletter
  </label>
</template>
```

### Cases Multiples (Tableau)

Plusieurs cases peuvent partager LA MÊME variable `v-model` si celle-ci est un Tableau (Array). Vue y poussera/retirera intelligemment l'attribut `value` de chaque case au moindre clic :

```vue
<script setup>
import { ref } from 'vue'

const selectedFruits = ref<string[]>([])
</script>

<template>
  <label>
    <input type="checkbox" value="pomme" v-model="selectedFruits" />
    Pomme
  </label>
  <label>
    <input type="checkbox" value="banane" v-model="selectedFruits" />
    Banane
  </label>
  <label>
    <input type="checkbox" value="cerise" v-model="selectedFruits" />
    Cerise
  </label>

  <!-- Affichera par exemple "pomme, cerise" au clic -->
  <p>Sélectionnés : {{ selectedFruits.join(", ") }}</p>
</template>
```

## Boutons Radio (Radio Buttons)

Les boutons radio partagent le même `v-model`. La variable stockera uniquement la `value` du boutton selectionné à l'instant T :

```vue
<script setup>
import { ref } from "vue";

// "medium" sera le bouton coché par défaut au chargement
const selectedSize = ref("medium");
</script>

<template>
  <div>
    <label>
      <input type="radio" value="small" v-model="selectedSize" /> Petit
    </label>

    <label>
      <input type="radio" value="medium" v-model="selectedSize" /> Moyen
    </label>

    <label>
      <input type="radio" value="large" v-model="selectedSize" /> Grand
    </label>

    <p>Taille sélectionnée : {{ selectedSize }}</p>
  </div>
</template>
```

## Menus Déroulants (Selects)

### Choix Unique

```vue
<script setup>
import { ref } from "vue";

const selectedCountry = ref("");
</script>

<template>
  <select v-model="selectedCountry">
    <!-- Option par défaut non-sélectionnable (Placeholder de select) -->
    <option value="" disabled>Choisissez un pays</option>

    <option value="fr">France</option>
    <option value="be">Belgique</option>
    <option value="ch">Suisse</option>
    <option value="ca">Canada</option>
  </select>

  <p>Code du pays sélectionné : {{ selectedCountry }}</p>
</template>
```

### Choix Multiples (Select Multiple)

```vue
<script setup>
import { ref } from 'vue'

// Doit absolument être un tableau vide au départ !
const selectedSkills = ref<string[]>([])
</script>

<template>
  <select v-model="selectedSkills" multiple>
    <option value="javascript">JavaScript</option>
    <option value="typescript">TypeScript</option>
    <option value="vue">Vue.js</option>
    <option value="react">React</option>
  </select>

  <p>Compétences : {{ selectedSkills.join(", ") }}</p>
</template>
```

### Options avec un v-for (Dynamique)

L'exemple ultra classique dans une vraie application :

```vue
<script setup>
import { ref } from "vue";

const categories = ref([
  { id: 1, name: "Électronique" },
  { id: 2, name: "Vêtements" },
  { id: 3, name: "Livres" },
]);

const selectedCategory = ref(null);
</script>

<template>
  <select v-model="selectedCategory">
    <option :value="null" disabled>Choisir une catégorie...</option>

    <!-- On utilise v-bind (:) pour lier l'objet complet ou son ID -->
    <!-- et on boucle sur le tableau fourni par l'API -->
    <option
      v-for="category in categories"
      :key="category.id"
      :value="category.id"
    >
      {{ category.name }}
    </option>
  </select>
</template>
```

## Les Modificateurs pour v-model

### `.lazy` - Attendre la perte de Focus (Dépassement)

```vue
<template>
  <!-- Se met à jour instantanément à CHAQUE frappe au clavier (par défaut) -->
  <input v-model="message" />

  <!-- Ne se met à jour QUE lorsque l'input perd le focus (clic ailleurs) ou qu'on tape Entrée -->
  <!-- Excellent pour ne pas spammer brutalement une recherche serveur API ! -->
  <input v-model.lazy="message" />
</template>
```

### `.number` - Forcer un Vrai Nombre JS (Typecast)

Quand on tape dans un HTML `<input type="number">`, le navigateur renvoie toujours un string natif en JS (ex: `"42"`) ! Le modificateur `.number` force purement la conversion en nombre JS entier/flottant (`42`).

```vue
<script setup>
import { ref } from "vue";

const age = ref(0); // Sera et RESTERA pour toujours un nombre JS
const quantity = ref(1);
</script>

<template>
  <!-- Sans .number, age + 1 ferait "251" concaténé au lieu de 26 ! -->
  <input v-model.number="age" type="number" />
  <p>L'année prochaine : {{ age + 1 }} ans.</p>

  <!-- Magie : Ça marche même sur un bête champ texte ! -->
  <input v-model.number="quantity" type="text" />
</template>
```

### `.trim` - Nettoyer les Espaces Blancs

Retire automatiquement les espaces invisibles (barre d'espace) que l'utilisateur aurait pu laisser sans faire exprès au début ou à la fin de son texte :

```vue
<script setup>
import { ref } from "vue";

const username = ref("");
</script>

<template>
  <!-- Parfait pour s'assurer que l'email, ou le pseudo est propre -->
  <input v-model.trim="username" />
  <p>Utilisateur : "{{ username }}"</p>
</template>
```

### Combiner Tous les Modificateurs

Bien sûr, vous pouvez (et devez souvent) les chaîner ensemble :

```vue
<template>
  <!-- Supprime les espaces en trop + Attends sagement la perte de focus -->
  <input v-model.lazy.trim="email" type="email" />

  <!-- Transforme en vrai nombre JS + Attends la perte de focus -->
  <input v-model.number.lazy="price" type="text" />
</template>
```

## Ressources

- [Liaisons de Formulaire](https://vuejs.org/guide/essentials/forms.html) — Documentation officielle sur `v-model`.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
