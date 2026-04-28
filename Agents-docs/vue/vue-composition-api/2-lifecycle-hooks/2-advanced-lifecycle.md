---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-advanced-lifecycle"
---

# Modèles de Cycle de Vie Avancés

Explorons des hooks de cycle de vie spécialisés et des modèles d'architecture plus avancés.

## `onErrorCaptured` (Le Captureur d'Erreurs Global)

Capturez toute erreur critique (JS Crashé) provenant de n'importe quel composant Enfant ou Petit-Enfant pour éviter l'Écran Blanc de la Mort :

```vue
<script setup>
import { ref, onErrorCaptured } from "vue";

const error = (ref < Error) | (null > null);

onErrorCaptured((err, instance, info) => {
  error.value = err;
  console.error("Erreur sauvage interceptée ! :", err);
  console.log("Composant coupable :", instance);
  console.log("Infos du contexte de l'erreur :", info); // ex: 'setup function', 'render function', etc.

  // Retournez `false` pour stopper la propagation de l'erreur vers le niveau supérieur (Evite le crash total de l'App)
  return false;
});
</script>

<template>
  <div v-if="error" class="error">
    Quelque chose a mal tourné : {{ error.message }}
  </div>
  <!-- Slot : On insuffle nos composants de toute l'App ici ! -->
  <slot v-else />
</template>
```

### Créer un authentique Composant "Frontière d'Erreur" (Error Boundary)

```vue
<!-- Le Garde du Corps : ErrorBoundary.vue -->
<script setup>
import { ref, onErrorCaptured } from "vue";

const error = (ref < Error) | (null > null);
const errorInfo = ref("");

function reset() {
  error.value = null;
  errorInfo.value = "";
}

onErrorCaptured((err, instance, info) => {
  error.value = err;
  errorInfo.value = info;
  return false; // Ne jamais propager la destruction plus haut
});
</script>

<template>
  <div v-if="error" class="error-boundary">
    <h2>Désolé, un composant a planté en plein vol.</h2>
    <p>{{ error.message }}</p>
    <button @click="reset">Tenter de Rafraîchir ce bloc</button>
  </div>

  <!-- S'il n'y a pas d'erreur, on affiche les enfants Normalement ! -->
  <slot v-else />
</template>

<!-- === UTILISATION === -->
<template>
  <ErrorBoundary>
    <!-- Si ce composant crash au JS aléatoirement, il détruira tout ce bloc, mais PAS l'App entière ! -->
    <RiskyComponent />
  </ErrorBoundary>
</template>
```

## `onRenderTracked` / `onRenderTriggered` (Dev Debug Uniquement)

Déboguez précisément CE QUI cause les affreux "Re-renders" successifs invisibles (Boucles d'écran) de votre Composant :

```vue
<script setup>
import { ref, onRenderTracked, onRenderTriggered } from "vue";

const count = ref(0);
const name = ref("Vue");

// Appelé quand une vraie dépendance (Ref) est "Trackée" (Lue) par Vue pendant son propre calcul du Rendu HTML
onRenderTracked((event) => {
  console.log("Dépendance Trackée :", event);
  // { effect, target, type, key }
});

// Appelé VRAIMENT quand cette dépendance précise pousse fermement Vue à redessiner brutalement un bout de l'HTML
onRenderTriggered((event) => {
  console.log("Déclenché par la modification brutale de :", event);
  debugger; // C'est magique : Mettez en pause le navigateur ICI au quart de seconde pour inspecter le coupable du Redessin !
});
</script>
```

## `onActivated` / `onDeactivated` (Pour le magique `<Keep-Alive>`)

Pour les gros composants cachés DANS la gigantesque balise magique native de Vue `<KeepAlive>` (Qui préserve les composants fantômes lourdement dans sa mémoire RAM) :

```vue
<script setup>
import { ref, onMounted, onActivated, onDeactivated } from "vue";

const visits = ref(0);

onMounted(() => {
  console.log(
    "Monté - Absolument QU'UNE et unique Seule Fois pour toute la vie web !",
  );
});

onActivated(() => {
  visits.value++;
  console.log(
    "Activé - S'Affiche à chaque fois que la vue fantôme est ressuscitée/réactivée par le KeepAlive !",
  );
  // C'est ICI qu'il faut Reprendre vos Animations visuelles, ou relancer vos gros Timers JS perdus
});

onDeactivated(() => {
  console.log(
    'Désactivé - L\'Onglet est "Caché/Misé en somneil dans la ram", mais PAS DU TOUT détruit !',
  );
  // Ex Vital: Mettre en Pause absolue les Animations bouclantes qui tournent dans le vide pour économiser votre Ordinateur.
});
</script>

<!-- Parent Gérant des Onglets -->
<template>
  <!-- <KeepAlive> Conserve la RAM Intacte ! -->
  <KeepAlive>
    <component :is="currentTab" />
  </KeepAlive>
</template>
```

## `onServerPrefetch` (SSR - Spécifique Serveur Nuxtjs)

Exclusif pour le Rendu Côté Serveur pur (Serveur Node générant l'HTML originel pour le Robot Google Indexeur) et la Récupération de données ultra Asynchrone :

```vue
<script setup>
import { ref, onServerPrefetch, onMounted } from "vue";

const data = ref(null);

// Exécuté EXCLUSIVEMENT "Derrière le dos", directement sur le Gros Serveur Node.js (SSR)
onServerPrefetch(async () => {
  data.value = await fetchData(); // On calcul le HTML 100% complété AVANT de l'envoyer au simple visiteur Web !
});

// Rendu standard classique au client web :
onMounted(() => {
  if (!data.value) {
    // Si on a raté l'Hydratation magique coté serveur, on récupère via Fetch Ajax à l'ancienne.
    fetchData().then((d) => (data.value = d));
  }
});
</script>
```

## Importer un Cycle de Vie entiers dans nos "Composables" (Les Hooks persos)

L'énorme puissance de Vue 3 est ici : n'importe quel utilitaire perso de code vanilla classique Externe en pur `.ts` PEUT SE GREFFER DE FORCE et très automatiquement au cœur du cycle de vie du DOM du composant qui fait appel à lui !

```typescript
// L'Architecte pure JS : useWindowSize.ts
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(0)
  const height = ref(0)

  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }

  // OUF !! Le hook JS exclusif s'accrochera silencieusement au cycle de vie réel Composant 'Appelant' !
  onMounted(() => {
    update()
    window.addEventListener('resize', update)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { width, height }
}

// === UTILISATION (Dans n'importe quel Composant visuel .vue) ===
<script setup>
import { useWindowSize } from './useWindowSize'

// 1. Appel du petit Hook pur Fonction.
// 2. MAGIE: Les lourds Evénements globaux de Windows s'ajouteront/détruiront tous seuls avec l'apparition de cette page !!
const { width, height } = useWindowSize()
</script>
```

## Ordre d'Exécution Ascendant/Descendant (Très Subtile)

Réfléchissez à cet ordre ultra complexe lorsque le Parent ET son Composant Enfant possèdent tous les deux les même cycles définis :

```
Le Parent setup()
L'Enfant setup()
L'Enfant onBeforeMount()
Le Parent onBeforeMount()
L'Enfant onMounted()         ← 1. L'Enfant se "Monte" à 100% visuellement le premier.
Le Parent onMounted()        ← 2. Le Parent se "Monte" APRÈS tous ses innombrables enfants prêts !

// A la Destruction visuelle :
Le Parent onBeforeUnmount()  ← 1. Le Boss Parent INITIE sa destruction totale.
L'Enfant onBeforeUnmount()
L'Enfant onUnmounted()       ← 2. Les pauvres Enfants se "Démontent/Meurent" d'abord en premier dans la cascade.
Le Parent onUnmounted()      ← 3. Le Parent s'anesthésie et meurt seulement juste après.
```

## Tableau Anti-Sèche Chronométré :

| Hook Actif        | Accès au DOM HTML ?   | Réactivité Active ? | Pour Quel Usage Idéal ?                                        |
| ----------------- | --------------------- | ------------------- | -------------------------------------------------------------- |
| `setup`           | ❌                    | ✅                  | Initialisation basique, Computed pures                         |
| `onBeforeMount`   | ❌                    | ✅                  | Lancement de logique préparatoire invisible                    |
| `onMounted`       | ✅                    | ✅                  | **Super Manipulation DOM, Fetch lourd API externe Ajax**       |
| `onBeforeUpdate`  | ✅ (Ancien Dom pur)   | ✅                  | Inspection des boites avant la grande Mise A Jour              |
| `onUpdated`       | ✅ (Le DOM Nouveau)   | ✅                  | Action forcée après le dessin DOM (Three.js par ex).           |
| `onBeforeUnmount` | ✅                    | ✅                  | Commencer votre Plan de Nettoyage !                            |
| `onUnmounted`     | ❌ (Le Dom a Explosé) | ✅                  | **Désactiver nos EventListener globaux et ClearInterval JS !** |

## Ressources

- [Le Grand Schéma du Cycle de Vie](https://vuejs.org/guide/essentials/lifecycle.html#lifecycle-diagram) — Le magnifique schéma officiel de Vue complet.

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
