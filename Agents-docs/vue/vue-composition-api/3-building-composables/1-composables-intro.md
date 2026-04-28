---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-composables-intro"
---

# Mais que sont vraiment les Composables ?

Les Composables sont tout simplement des fonctions JavaScript pures qui utilisent intelligemment l'API de Composition de Vue pour encapsuler et réutiliser une "logique métier avec état propre" ("stateful logic"). Ce sont les équivalents parfaits et ultra modernes des vieux "mixins" de Vue 2, mais en infiniment supérieurs, plus propres et typables.

## Composable vs Mixin de l'Ancien Temps

### Les Mixins (Style Vue 2 - Un cauchemar problématique absolu)

```javascript
// mixin.js
export const counterMixin = {
  data() {
    return { count: 0 }; // TRAGÉDIE 1 : D'où vient ce mystérieux 'count' quand on lit le composant final vu de l'écran ??
  },
  methods: {
    increment() {
      this.count++;
    }, // TRAGÉDIE 2 : Si mon composant a DÉJÀ une méthode increment(), qui gagne le bug et le conflit de nommage ??
  },
};

// === Le Composant appelant (Component.vue) ===
export default {
  mixins: [counterMixin, anotherMixin], // TRAGÉDIE 3 : Et si les DEUX mixins injectés possèdent une variable 'count' ? Code silencieux écrasé !
  // Il est strictement IMPOSSIBLE à la froide lecture du fichier de savoir quel mixin externe fournit exactement quoi. C'est l'Enfer !
};
```

### Les Composables (La Magie Vue 3 - Code Clair, Explicite, Sécurisé)

```typescript
// === L'Architecte Extérieur Typé : useCounter.ts ===
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  // On renvoi juste un dictionnaire d'outils propres
  return { count, increment, decrement }
}

// === Utilisation dans le Composant (Component.vue) ====
<script setup>
import { useCounter } from './useCounter'

// 1. Déstructuration Explicite : On SAIT visuellement et exactement l'origine de 'count' et 'increment' importées juste au dessus !
const { count, increment } = useCounter(10)

// 2. Gestion totalement native des conflits avec de simples Renommages (Alias JS pur) :
const { count: countPlayer2, increment: incrementPlayer2 } = useCounter(0)

// Fini les conflits maudits et cachés, renommage très facile de code !
</script>
```

## L'Anatomie Parfaite d'un Composable Moderne

```typescript
import { ref, computed, onMounted, onUnmounted } from "vue";

export function useFeature(options = {}) {
  // 1. L'État Réactif isolé (Les variables Refs)
  const state = ref(initialValue);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // 2. Les Propriétés Calculées Dérivées (Les fameux 'Computed')
  const derived = computed(() => state.value * 2);

  // 3. Toutes nos Méthodes métiers complexes pures (Mutations)
  function doSomething() {
    state.value++;
  }

  async function fetchData() {
    loading.value = true;
    try {
      state.value = await api.getData();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  // 4. Exécuter un Accrochage aux Hooks fantômes du Cycle de Vie
  onMounted(() => {
    // Initialisation lourde au démarrage sans attendre le composant parent
  });

  onUnmounted(() => {
    // Le Nettoyage de fin impératif de fuite JS (Ex: Remove EventListener souris)
  });

  // 5. Exposer les super Outils au Composant.vue qui s'abonnera !
  return {
    // L'État Reactif retourné
    state,
    loading,
    error,
    derived,
    // Méthodes exportées
    doSomething,
    fetchData,
  };
}
```

## Convention de Nommage Architecturale stricte

Tous vos Composables réutilisables devraient techniquement toujours démarrer précisément par le mot anglais `use` :

```typescript
// ✅ Excellents Noms Professionnels (Standards d'Industrie)
useCounter();
useMouse();
useLocalStorage();
useFetch();
useAuth();

// ❌ Mauvais noms trompeurs interdits car on croit à de bêtes fonctions calculatrices mathématiques !
counter();
getMouse();
localStorageHelper();
```

## Exemple 1 en réel : Un Traqueur Magique (useMouse)

Un composable incroyablement courant pour extraire la gestion de l'événement complexe de la souris très lourde de l'interface graphique :

```typescript
// useMouse.ts
import { ref, onMounted, onUnmounted } from "vue";

export function useMouse() {
  const x = ref(0);
  const y = ref(0);

  function update(event: MouseEvent) {
    x.value = event.clientX;
    y.value = event.clientY;
  }

  onMounted(() => {
    window.addEventListener("mousemove", update);
  });

  onUnmounted(() => {
    window.removeEventListener("mousemove", update);
  });

  return { x, y };
}
```

```vue
<!-- Utilisation transparente et propre dans L'UI ! -->
<script setup>
import { useMouse } from "./useMouse";

const { x, y } = useMouse();
</script>

<template>
  <p>Coordonnées du Pointeur Souris vif : {{ x }}, {{ y }}</p>
</template>
```

## Exemple 2 Magistral : useLocalStorage

Ne vous embêtez plus jamais dans votre UI avec des codes pour sauvegarder péniblement au format long Date String dans le vieux grand `localStorage` :

```typescript
// useLocalStorage.ts
import { ref, watch } from "vue";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  // Lire directement dans le vrai localStorage au départ ou bien choper doucement la valeur par défaut passée en arg !
  const stored = localStorage.getItem(key);
  const value = ref<T>(stored !== null ? JSON.parse(stored) : defaultValue);

  // Synchroniser et Sauvegarder magiquement par un Espion (Watch) à CHAQUE FOIS que la variable unique s'est fait modifier dans n'importe quel code de l'application !!
  watch(
    value,
    (newValue) => {
      if (newValue === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue)); // Save Locale Web & Cast finalisé String
      }
    },
    { deep: true }, // OBLIGATOIRE et CRUCIAL: Inspecter la donnée même profondément à l'intérieur des Arrays/Objects complexes
  );

  return value;
}
```

```vue
<!-- Énorme Utilisation Ultra Propre du Code -->
<script setup>
import { useLocalStorage } from "./useLocalStorage";

// En 1 ligne on attache des Data réactives à la Mèmoire Ram Persistance !
const theme = useLocalStorage("theme", "light"); // Mon Thème sera sauvé automatiquement a chaque clic!
const savedItems = useLocalStorage("cart", []); // Mon vrai Panier de client sauvé pour toujours

function toggleTheme() {
  theme.value = theme.value === "light" ? "dark" : "light";
  // Ce misérable changement de variable super simple va activer mystiquement le gros "watch" secret ci-dessus et sauvegardera tout de suite en background de l'ordinateur !
}
</script>
```

## Les Composables Peuvent Utiliser... D'Autres Composables (Inception !)

La puissance architecturale démentielle :

```typescript
// useMouseInElement.ts
import { ref, computed } from "vue";
import { useMouse } from "./useMouse"; // Appel d'un Composable dans notre propre Composable
import { useElementBounds } from "./useElementBounds"; // Appel d'un second gros composable complexe

export function useMouseInElement(target: Ref<HTMLElement | null>) {
  // L'architecte intelligent demande l'aide pure à ses collègues fonctions réutilisables qui injecteront tout sans code manuel !
  const { x: mouseX, y: mouseY } = useMouse();
  const { left, top, width, height } = useElementBounds(target);

  const x = computed(() => mouseX.value - left.value);
  const y = computed(() => mouseY.value - top.value);

  const isInside = computed(
    () =>
      x.value >= 0 &&
      x.value <= width.value &&
      y.value >= 0 &&
      y.value <= height.value,
  );

  return { x, y, isInside };
}
```

## Ressources Complémentaires

- [Les Composables (FR)](https://vuejs.org/guide/reusability/composables.html) — Guide complet Web officiel complet et majestueux natif sur la création d'architectures de super composables robustes.

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
