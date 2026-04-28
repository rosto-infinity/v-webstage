---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-lifecycle-overview"
---

# Le Cycle de Vie d'un Composant en API de Composition

Les hooks de cycle de vie (Lifecycle hooks) vous permettent d'exécuter du code à des moments très précis de la vie d'un composant (ex: À sa création, ou juste avant sa destruction). Dans l'API de Composition (`<script setup>`), on importe et on utilise systématiquement des fonctions préfixées par `on-` de Vue.

## Le Grand Diagramme du Cycle de Vie (L'Architecture Temporelle)

```text
┌─────────────────────────────────────────────────────────────┐
│                        CRÉATION                              │
├─────────────────────────────────────────────────────────────┤
│  Le code `setup()` s'exécute                                 │
│  └─ L'état réactif (Variables vars/refs) est créé            │
│  └─ Les Propriétés calculées et les Watchers sont activés    │
│  └─ Les Callbacks de hooks de cycle de vie sont enregistrés  │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                        MONTAGE (Création du DOM)             │
├─────────────────────────────────────────────────────────────┤
│  onBeforeMount()  ← Le HTML (DOM) n'est pas "encore" créé    │
│       ↓                                                      │
│  [ LE HTML (DOM) EST DESSINÉ PAR LE NAVIGATEUR ]             │
│       ↓                                                      │
│  onMounted()      ← Le DOM est 100% prêt à l'emploi.         │
│                     (Appel des Ref de templates possibles)   │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                    MISE A JOUR DE L'ECRAN                    │
├─────────────────────────────────────────────────────────────┤
│  [L'utilisateur a muté un État hautement réactif]            │
│       ↓                                                      │
│  onBeforeUpdate() ← Le JS sait que le HTML va devoir changer.│
│       ↓                                                      │
│  [ L'ECRAN EST DESSINÉ À NOUVEAU PAR LE NAVIGATEUR ]         │
│       ↓                                                      │
│  onUpdated()      ← L'écran de l'utilisateur est MAJ         │
└─────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────┐
│                    DEMONTAGE / DESTRUCTION                   │
├─────────────────────────────────────────────────────────────┤
│  onBeforeUnmount() ← Parfait, le Composant marche encore     │
│                      (Nettoyer les variables de timer JS ici)│
│       ↓                                                      │
│  [ COMPOSANT LITTÉRALEMENT DÉTRUIT DU NAVIGATEUR ]           │
│       ↓                                                      │
│  onUnmounted()     ← Le Nettoyage mémoriel total est fait    │
└─────────────────────────────────────────────────────────────┘
```

## L'Utilisation Basique d'un Hook

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  ref,
} from "vue";

const count = ref(0);
const element = (ref < HTMLElement) | (null > null); // Une Reference Template sur une balise HTML

// Avant même que le DOM HTML ne soit créé par le navigateur
onBeforeMount(() => {
  console.log("Le Composant est sur le point de se monter.");
  console.log(element.value); // Renvoie "null" - Le DOM visuel n'existe techniquement "pas encore"
});

// === LE MOMENT CLÉ POUR UN DÉVELOPPEUR === (Dès que le DOM HTML visuel est tout frais et prêt)
onMounted(() => {
  console.log("Succès : Composant monté public !");
  console.log(element.value); // Incroyable : Il renvoie le tag HTML "<div>...</div>"

  // Dans cette zone, il est "Safe" (sécurisé) de :
  // - Lancer notre première Fetching Data / Requête Axios lointaine API vers le serveur
  // - Accéder pour modifier matériellement des éléments purement DOM Vanilla JS
  // - Démarrer des setInterval interminables chronos
  // - Ajouter finement des écouteurs Window globaux d'événements
});

// Avant même que le DOM entier ne se mette physiquement à jour à la vue de tous :
onBeforeUpdate(() => {
  console.log(
    "Je vais rafraîchir l'écran pour le client. Mais pour le moment le compteur est encore :",
    count.value,
  );
});

// Juste après que le DOM se soit mis fraîchement à jour pour l'utilisateur
onUpdated(() => {
  console.log(
    "Terminé, l'écran a été rafraîchi et affiche bien :",
    count.value,
  );
});

// Avant de littéralement mourir ou se détacher temporairement
onBeforeUnmount(() => {
  console.log("Au revoir, je vais être démonté");
  // J'ai toujours totalement mes variables actives et accès complet au DOM existant
});

// Une fois qu'il est détruit physiquement de votre RAM et de l’écran :
onUnmounted(() => {
  console.log("Composant Définitivement démonté");
  // Le Cleanup absolu : Ici !
  // - Retirer et détruire manuellement les "Event Listeners" sur Window
  // - ClearInterval impératifs (Pour éviter une fuite JS de RAM énorme appelée Memory Leaks)
  // - Casser des requêtes réseaux en attente ou autres WebSockets
});
</script>

<template>
  <div ref="element">
    <button @click="count++">Clics majeurs : {{ count }}</button>
  </div>
</template>
```

## Astuces des Vrais "Modèles Courants" (Common Patterns) !

### 1. La Fameuse Requête de Données (Fetching Data) au Montage

Un absolu de rigueur classique pour chaque Application JS web :

```vue
<script setup>
import { ref, onMounted } from "vue";

const data = ref(null);
const loading = ref(true); // Le squelette de chargement en attente
const error = ref(null);

onMounted(async () => {
  try {
    const response = await fetch("/api/data");
    data.value = await response.json();
  } catch (e) {
    error.value = e;
  } finally {
    loading.value = false; // Désactive le Skeleton HTML loader
  }
});
</script>
```

### 2. Le Nettoyage Ultime des Écouteurs d'Événements (Event Listeners Memory Leaks)

A ne SURTOUT pas oublier ! Vue ne le retire PAS magiquement pour vous :

```vue
<script setup>
import { onMounted, onUnmounted } from "vue";

function handleResize() {
  console.log("Le visiteur resize activement sa fenêtre :", window.innerWidth);
}

onMounted(() => {
  // On pose un "espion" indélébile sur toute la TAB WINDOW du client
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // OBLIGATOIRE ET VITAL ! On ARRÊTE purement d'espionner en quittant la page
  window.removeEventListener("resize", handleResize);
});
</script>
```

### 3. Destruction des Chronos Locaux Infinis (Timer Cleanup)

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref(new Date())
let intervalId: number // L'ID natif unique du chrono Window JS!

onMounted(() => {
  intervalId = setInterval(() => {
    time.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  // Tueur de Chronomètre JS natif ! Sinon il tourne à l'infini en fond
  clearInterval(intervalId)
})
</script>
```

### 4. L'Intégration d'une Librairie Tierce Front-End Vanilla Externe

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto' // Un plugin lourd Vanilla externe

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

onMounted(() => {
  // La logique est injectée quand le Canvas est existant dans le DOM
  if (chartRef.value) {
    chartInstance = new Chart(chartRef.value, {
      type: 'bar',
      data: { /* ... Des belles data ici */ }
    })
  }
})

// Déstructuration impératives !
onUnmounted(() => {
  // Demande a Chart.JS de se purger manuellement avec sa propre méthode
  chartInstance?.destroy()
})
</script>

<template>
  <canvas ref="chartRef"></canvas>
</template>
```

## De Multiples Hooks Similaires du Même Grand Type

L'API de Composition amène cette énorme puissance de "Composition" : Vous pouvez enregistrer délibérément de multiples appels massifs de hooks distincts de exactement du `même type` (`onMounted`) !

```vue
<script setup>
import { onMounted } from "vue";

onMounted(() => {
  console.log("Le Premier très bon appel pur de code onMounted !");
});

onMounted(() => {
  console.log("Le Code magique d'Un Second onMounted indépendant !");
});

// Tous s’exécuteront à la suite dans le parfait ordre logique complet sans fusion
</script>
```

Cette particularité devient formidable lorsque des [Composables persos (Les Hooks Custom/Persos de Vue JS 3)] en externe ont le besoin vital de déclarer intérieurement leurs propres grands "Lifecycle hooks" indépendants du composant qui les utilise !

## Ressources Importantes

- [Lifecycle Hooks (Majeur)](https://vuejs.org/guide/essentials/lifecycle.html) — La majestueuse Documentation pointue des cycles de Vie.

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
