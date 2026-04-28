---
source_course: "vue-foundations"
source_lesson: "vue-foundations-attribute-bindings"
---

# Liaison d'Attributs avec v-bind (Attribute Bindings)

Les doubles accolades (moustaches) `{{ }}` ne peuvent **absolument pas** être utilisées à l'intérieur d'un attribut HTML (comme `id`, `class`, `src`, `href`, etc.). À la place, vous devez impérativement utiliser la directive `v-bind` pour lier dynamiquement un attribut HTML à une expression JavaScript.

## La Liaison d'Attribut Basique

La directive `v-bind` ordonne à Vue : "Garde cet attribut HTML synchronisé avec cette variable JavaScript" :

```vue
<script setup>
import { ref } from "vue";

const imageUrl = ref("/images/logo.png");
const linkUrl = ref("https://vuejs.org");
const inputId = ref("mon-email-input");
</script>

<template>
  <!-- On lie (bind) l'attribut src -->
  <img v-bind:src="imageUrl" alt="Logo de l'app" />

  <!-- On lie l'attribut href -->
  <a v-bind:href="linkUrl">Site Officiel de Vue.js</a>

  <!-- On lie l'attribut id -->
  <input v-bind:id="inputId" type="email" />
  <label v-bind:for="inputId">Votre Email :</label>
</template>
```

## La Syntaxe Raccourcie Ultime : `:`

Parce que `v-bind` est incontestablement la directive la plus utilisée dans Vue, elle possède son propre raccourci universel : il suffit de mettre le caractère deux-points `:` juste devant l'attribut :

```vue
<template>
  <!-- La syntaxe lourde habituelle -->
  <img v-bind:src="imageUrl" />

  <!-- La syntaxe raccourcie (FORTEMENT RECOMMANDÉE) -->
  <img :src="imageUrl" />
  <a :href="linkUrl">Lien Dynamique</a>
  <input :id="inputId" />
</template>
```

Ce raccourci `:` est la convention absolue que vous verrez à 99% dans les projets professionnels Vue.

## Le Raccourci Ultime (Même nom) (Vue 3.4+)

Généralement, le nom de la variable JavaScript est exactement le même que l'attribut HTML (`id="id"`). Depuis Vue 3.4, vous pouvez raccourcir cela encore plus :

```vue
<script setup>
import { ref } from "vue";

const id = ref("mon-element");
const src = ref("/images/photo.jpg");
const href = ref("https://exemple.com");
</script>

<template>
  <!-- Strictement équivalent à :id="id" -->
  <div :id>Le Contenu</div>

  <!-- Strictement équivalent à :src="src" -->
  <img :src alt="Photo de profil" />

  <!-- Strictement équivalent à :href="href" -->
  <a :href>Visiter le lien</a>
</template>
```

## Les Attributs Booléens (Vrai/Faux)

Les attributs booléens en HTML (comme `disabled`, `readonly`, `checked`, `required`) indiquent une vérité par leur simple **présence** sur la balise. Vue les gère de manière intelligente avec `v-bind` :

```vue
<script setup>
import { ref } from "vue";

const isDisabled = ref(true);
const isRequired = ref(false);
const isChecked = ref(true);
</script>

<template>
  <!-- Puisque isDisabled est VRAI, le HTML final sera : <button disabled>...</button> -->
  <button :disabled="isDisabled">Vous ne pouvez pas cliquer ici</button>

  <!-- Puisque isRequired est FAUX, Vue supprime carrément l'attribut -->
  <!-- Résultat HTML : <input> (pas de required !) -->
  <input :required="isRequired" />

  <!-- Résultat : <input type="checkbox" checked> -->
  <input type="checkbox" :checked="isChecked" />
</template>
```

Règles magiques de Vue pour les attributs booléens :

- **Si la valeur est vraie (Truthy)** (y compris une chaîne de caractères vide `""`) : L'attribut est gardé (intégré).
- **Si la valeur est fausse (Falsy)** (`false`, `null`, `undefined`) : L'attribut est physiquement supprimé de la balise HTML.

## Lier de Multiples Attributs d'un seul coup

Si vous avez beaucoup de données dynamiques à passer, pas la peine d'écrire 50 fois `:param="valeur"`. Vous pouvez lier tout un objet d'un coup avec le `v-bind` pur (sans argument) :

```vue
<script setup>
import { ref, reactive } from "vue";

const inputAttrs = reactive({
  id: "email-field",
  type: "email",
  placeholder: "Entrez votre adresse email",
  required: true,
});

const imageAttrs = ref({
  src: "/images/avatar.jpg",
  alt: "Avatar Utilisateur",
  width: 100,
  height: 100,
});
</script>

<template>
  <!-- Déballe ("splat") absolument tous les attributs de l'objet d'un coup ! -->
  <input v-bind="inputAttrs" />
  <!-- Rendu HTML : <input id="email-field" type="email" placeholder="..." required> -->

  <img v-bind="imageAttrs" />
  <!-- Rendu HTML : <img src="/images/avatar.jpg" alt="..." width="100" height="100"> -->
</template>
```

## Noms d'Attributs Dynamiques

Le graal du dynamisme : vous pouvez même remplacer le nom _lui-même_ de l'attribut grâce à la syntaxe entre crochets `[]` :

```vue
<script setup>
import { ref } from "vue";

const attributeName = ref("title"); // L'attribut ciblé est "title"
const attributeValue = ref("Ceci est une infobulle !");
</script>

<template>
  <!-- Vue va générer :votre_nom_d_attribut="Valeur" -->
  <div :[attributeName]="attributeValue">Survolez-moi avec la souris !</div>
  <!-- Résultat : <div title="Ceci est une infobulle !">...</div> -->
</template>
```

## Modèles Courants de Développement (Patterns)

### Classes et Styles conditionnels (Ternaires)

Hyper puissant pour le Web Design !

```vue
<script setup>
import { ref } from "vue";

const isActive = ref(true);
const fontSize = ref(16);
</script>

<template>
  <!-- Liaisons par expressions ternaires -->
  <div :class="isActive ? 'carte-active' : 'carte-grisee'">Mon statut</div>

  <!-- Design CSS "Style En Ligne" dynamique hyper facile -->
  <p :style="{ fontSize: fontSize + 'px' }">Texte stylisé au vol</p>
</template>
```

### URLs Dynamiques pour les Images (Le plus crucial en E-Commerce/CMS)

Générer des URLs selon des ID d'objets :

```vue
<script setup>
import { ref, computed } from "vue";

const userId = ref(42);

// computed : La variable se recalcule automatiquement si userId change
const avatarUrl = computed(() => `/api/users/${userId.value}/avatar`);
</script>

<template>
  <!-- Construction d'une balise 'alt' complète avec l'interpolation dans une chaine template littérale ` ` -->
  <img :src="avatarUrl" :alt="`Avatar de l'utilisateur numéro ${userId}`" />
</template>
```

### Attributs Aria (ARIA Attributes) pour l'Accessibilité (Handicap Visuel / Liseuses)

Idéal pour des menus Burger, des "Accordéons"...

```vue
<script setup>
import { ref } from "vue";

const isExpanded = ref(false);
const menuId = ref("navigation-principale");
</script>

<template>
  <button
    :aria-expanded="isExpanded"
    :aria-controls="menuId"
    @click="isExpanded = !isExpanded"
  >
    Ouvrir le Menu
  </button>

  <nav :id="menuId" v-show="isExpanded">
    <!-- Liens de menu -->
  </nav>
</template>
```

## Ressources

- [Liaisons d'Attributs (Attribute Bindings)](https://vuejs.org/guide/essentials/template-syntax.html#attribute-bindings) — Documentation officielle sur `v-bind`.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
