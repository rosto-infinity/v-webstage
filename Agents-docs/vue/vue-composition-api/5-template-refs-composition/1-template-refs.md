---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-template-refs"
---

# Le ciblage des Template Refs pour l'Accès DOM (Références)

Les `Template refs` (références de template) vous octroient un "droit de passage absolu" pour accéder _directement et physiquement_ aux éléments matériels du vrai DOM HTML du navigateur ou aux instances architecturales complètes de vos composants enfants sous-jacents. Essentiel pour de la de manipulation DOM pure et les opérations impératives strictes de l'UI (Comme lancer un `play()` sur une vidéo ou un `focus()` sur un input form).

## Le Ciblage Matériel Basique d'un Tag Élément HTML (DOM Ref)

```vue
<script setup>
import { ref, onMounted } from "vue";

// 1. Créez simplement une variable `ref` vide portant EXACTEMENT le MÊME NOM (string) que l'attribut plus bas  !
const inputRef = (ref < HTMLInputElement) | (null > null);

// 3. Dès le montage : Accès magique et total à l'élément physique du DOM Vanilla JS (Il s'est auto-remplis) !
onMounted(() => {
  inputRef.value?.focus(); // Apporte le focus souris
});

function selectAll() {
  inputRef.value?.select(); // Méthode native vanilla sur un pur objet HTML JS !
}
</script>

<template>
  <!-- 2. Connectez visuellement la balise via l'attribut spécial magique natif `ref` -->
  <input ref="inputRef" type="text" />
  <button @click="selectAll">Tout sélectionner le texte</button>
</template>
```

## Attention Critique : Les Refs visuelles sont inévitablement Nul (null) jusqu'au vrai "Montage" !

Le tag HTML visé n'existe pas matériellement en mémoire tant que l'HTML entier n'a pas été dessiné par le navigateur...

```vue
<script setup>
import { ref, onMounted, watchEffect } from "vue";

const divRef = (ref < HTMLDivElement) | (null > null);

// ❌ ERREUR DE DEV COMMUNE : C'est 'null' ici - le composant HTML n'est pas "encore" physiquement monté à l'écran !
console.log(divRef.value); // Renvoie piteusement null !

onMounted(() => {
  // ✅ SUCCÈS : L'Elément a finit par exister sur l'écran (C'est bon !) !
  console.log(divRef.value); // Renvoie bien le vrai gros node <div>...</div>
});

// Magie : Fonctionne tout aussi bien avec un 'watchEffect' (car ce dernier s'exécutera toujours en retard une fois just APRÈS le premier gros rendu HTML du composant)
watchEffect(() => {
  if (divRef.value) {
    console.log(
      "Mesure dimensionnelle visuelle de ma vraie Div :",
      divRef.value.offsetWidth,
    );
  }
});
</script>
```

## Les Multiples Refs dynamiques couplés avec la boucle `v-for`

```vue
<script setup>
import { ref, onMounted } from 'vue'

const items = ref(['A', 'B', 'C'])

// 1. On Créer obligatoirement un Tableau TS de type `Refs` pour attraper la multitude qui arrive :
const itemRefs = ref<HTMLLIElement[]>([])

onMounted(() => {
  console.log(itemRefs.value)  // Résultat: Un Tableau peuplé de tag: [li, li, li]
  console.log(itemRefs.value.length)  // 3
})
</script>

<template>
  <ul>
    <!-- 2. Le v-for va automatiquement lier et Pousser magiquement chaque élément dans le gros tableau 'itemRefs' plus haut ! -->
    <li v-for="item in items" :key="item" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

**Note Majeure**: Contrairement à ce que l'on pourrait croire en React, l'ordre définitif du grand tableau JS d'arrivée `itemRefs` n'est absolument PAS logiquement garanti pour correspondre à l'ordre chronologique exact de votre tableau textuel source `items` du v-for. Prudence.

## La Liberté des "Fonctions Refs" (Refs Callbacks)

Pour obtenir enfin un contrôle absolu et granulaire sur l'association du ciblage, utilisez une fonction fléchée callback directement dans l'attribut html ! :

```vue
<script setup>
import { ref } from 'vue'

const items = ref(['A', 'B', 'C'])
// Une superbe Map JS ultra performante ! :  Clé (Text) -> Element HTML lié
const itemRefs = ref<Map<string, HTMLElement>>(new Map())

// La fonction attrapeuse magique :
function setItemRef(el: HTMLElement | null, key: string) {
  if (el) {
    itemRefs.value.set(key, el)  // Insère/MAJ
  } else {
    itemRefs.value.delete(key)  // Très Important : Suppression propre et nettoyage d'écran de l'entrée !
  }
}
</script>

<template>
  <ul>
    <!-- 💥 Le Callback dans le Ref !! C'est très puissant ! -->
    <li v-for="item in items" :key="item" :ref="(el) => setItemRef(el, item)">
      {{ item }}
    </li>
  </ul>
</template>
```

## Ciblage Absolu : Accéder à l'instance Entière d'un Autre Sous-Composant (Component Refs)

On ne vise plus un pauvre petit `<div/>` Vanilla, mais bien la logique gigantesque interne d'un autre composant "Fils" `.vue` de l'architecture !

```vue
<script setup>
import { ref, onMounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

// L'Astuce TypeScript "InstanceType" + "typeof" :
const childRef = ref<InstanceType<typeof ChildComponent> | null>(null)

onMounted(() => {
  // On accède à l'entièreté de l'API exposé et des variables privées de notre Enfant direct !
  console.log(childRef.value?.count) // Lit la valeur cachée !
  childRef.value?.increment() // EXÉCUTE de force une fonction de l'Enfant à distance !!
})
</script>

<template>
  <ChildComponent ref="childRef" />
</template>
```

### 🛑 IMPORTANT : Le Composant "Enfant" Visé (ChildComponent) DOIT AVOIR un `defineExpose` !

Rappelez-vous : Dans la nouvelle API de Composition, tous les `<script setup>` sont fermés hermétiquement, cryptés et muets par sécurité. Sauf si le gentil développeur de l'Enfant l'Autorise un parent à l'espionner de cette façon :

```vue
<!-- Le fameux Composant visé : ChildComponent.vue -->
<script setup>
import { ref } from "vue";

const count = ref(0);
const privateData = ref("Ce code est très secret");

function increment() {
  count.value++;
}

// Seulement ces "Outils très exacts" seront accessibles au parent inquisiteur !
defineExpose({
  count,
  increment,
});
</script>
```

## Très Grands Cas d'Usage Communs des Vue Refs !

### 1. La Gestion Pro du Focus Input (Focus Management)

```vue
<script setup>
import { ref, nextTick } from "vue";

const inputRef = (ref < HTMLInputElement) | (null > null);
const showInput = ref(false); // Il est d'abord caché du DOM v-if

async function openAndFocus() {
  showInput.value = true; // Le V-if passe vrai MAIS le navigateur doit prendre quelques microsecondes pour le dessiner !

  await nextTick(); // INDISPENSABLE ! Pause absolue du Script d'attente magique jusqu’à ce que Vue ait vraiment fini de mettre visuellement ce champs input à jour dans tout le DOM !

  inputRef.value?.focus(); // Bam ! On a le Focus du clavier propre
}
</script>

<template>
  <button @click="openAndFocus">Ouvrir l'input de Saisie V2</button>
  <input v-if="showInput" ref="inputRef" />
</template>
```

### 2. Le Super "Défilement Magique jusqu'à la section" (Scroll Into View)

Idéal pour du design de SPA One-Page ou un Sommaire :

```vue
<script setup>
import { ref } from 'vue'

const sectionRefs = ref<HTMLElement[]>([])

function scrollToSection(index: number) {
  // scrollIntoView : Une incroyable méthode JS Vanilla pure !
  sectionRefs.value[index]?.scrollIntoView({
    behavior: 'smooth', // Glissade magnifique !
    block: 'start'
  })
}
</script>
```

### 3. L'Intégration et l'Accrochage Parfait et Incontournable de Librairies Tiers Vanilla Lointaines (Des Plugins Sans Lien natif vers Vue !)

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sortable from 'sortablejs' // Une fameuse Librairie drag/drop Vanilla très JS vieille et rustique

const listRef = ref<HTMLElement | null>(null)
let sortable: Sortable | null = null

onMounted(() => {
  if (listRef.value) {
    // La Magie Noire : On passe brutalement notre pur élément de tag HTML à cette vieille la librarie pour qu'elle s'y greffe violemment par dessus tout !
    sortable = new Sortable(listRef.value, {
      animation: 150,
      onEnd: handleSort
    })
  }
})

// Nettoyage absolu du Memory Leak de Ram de la librairie extérieure obligatoire
onUnmounted(() => {
  sortable?.destroy()
})
</script>

<template>
  <ul ref="listRef">
    <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  </ul>
</template>
```

### 4. L'Accès Matériel Pur Bas Niveau à un Canvas 2D/3D ou une Balise `<Video>`

```vue
<script setup>
import { ref, onMounted } from "vue";

const canvasRef = (ref < HTMLCanvasElement) | (null > null);

// Accès impossible depuis des "Templates tag HTML" : Il faut dessiner en code pur Vanilla le contexte JS 2D !
onMounted(() => {
  const ctx = canvasRef.value?.getContext("2d"); // Contexte de dessin 2D
  if (ctx) {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, 100, 100);
  }
});
</script>

<template>
  <!-- Le Tag Vide d'origine -->
  <canvas ref="canvasRef" width="400" height="300" />
</template>
```

## Ressources Complètes Absolues

- [Template Refs (Refs Magiques FR)](https://vuejs.org/guide/essentials/template-refs.html) — La surpuissante documentation source Vue sur les références de template.

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
