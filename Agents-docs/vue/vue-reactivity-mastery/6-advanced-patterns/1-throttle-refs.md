---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-debounce-throttle-refs"
---

# Les Refs Retardatrices (Debounced) et Limitatrices (Throttled)

Prenez un contrôle absolu et militaire sur l'extrême fréquence à laquelle vos variables réactives se propagent dans l'interface pour sauver le CPU, le Produit et l'Expérience Utilisateur (UX).

## 1. La Ref Retardatrice (Debounced Ref)

Cette variable magique refusera d'impacter le DOM pour de vrai **Tant Que L'Utilisateur n'aura pas ARRÊTÉ Définitivement** de taper sur son clavier depuis X millisecondes ! (L'Utilisation #1 Mondiale pour les Barres de Recherche API !)

```typescript
import { ref, watch, type Ref } from "vue";

// L'Usine à Retardement :
export function useDebouncedRef<T>(value: T, delay = 300): Ref<T> {
  const debouncedValue = ref(value) as Ref<T>;
  let timeout: ReturnType<typeof setTimeout>;

  // Le Pire Ennemi : On espionne la vraie valeur brute
  watch(
    () => value,
    (newValue) => {
      clearTimeout(timeout); // Au moindre millième de seconde de frappe on TUE la minuterie existante
      // Et on en relance une toute neuve de P Zéro !
      timeout = setTimeout(() => {
        debouncedValue.value = newValue; // SEULEMENT SI LE TIMER ARRIVE AU BOUT ALORS ON PROPAGE LE VRAI RÉSULTAT A LA PAGE WEB UI !!
      }, delay);
    },
  );

  return debouncedValue;
}

// Utilisation Magique :
const searchInput = ref("");
const debouncedSearch = useDebouncedRef(searchInput.value, 500);
```

### Méthode Hardcore Avancée en Fabriquant sa propre API avec `customRef`

L'exemple du dessus utilisait bidouille un Watch. Celui-ci modifie VUE en créant un faux Ref Custom natif !

```typescript
import { customRef } from "vue";

export function useDebouncedRef<T>(initialValue: T, delay = 300) {
  let timeout: ReturnType<typeof setTimeout>;
  let value = initialValue;

  return customRef((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue: T) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        value = newValue;
        trigger(); // Alarme Incendie du Moteur VUE ! Retardée par Minuterie !
      }, delay);
    },
  }));
}
```

## 2. La Ref Limitatrice Étranglée (Throttled Ref)

Contrairement à la première qui Attend le "Blanc Auditif Sans Bruit" de l'utilisateur... Celle-ci va au contraire **Restreindre d'une main de fer la quantité maximale de Mise à Jour de Frame Possible par Seconde**. Peut importe votre Vitesse, elle ne laissera passer qu'Une Info toutes les `interval` ms ! Parfait pour l'UI du Scrolling, ou le Drag&Drop a la souris !

```typescript
import { customRef } from "vue";

export function useThrottledRef<T>(initialValue: T, interval = 100) {
  let value = initialValue;
  let lastUpdate = 0;
  let pendingValue: T | null = null;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  // Ref Falsifiée sur Mesure !
  return customRef((track, trigger) => ({
    get() {
      track();
      return value;
    },
    set(newValue: T) {
      const now = Date.now();

      // LA CONDITION DE LA DOUANE :
      if (now - lastUpdate >= interval) {
        // Assez de temps à coulé, OK tu sors, vas mettre la page visuel à Jour !
        value = newValue;
        lastUpdate = now;
        trigger();
      } else {
        // DOUANE REFUSÉE, TES TROP RAPIDE ! On te fou en salle d'attente Morte :
        pendingValue = newValue;
        if (!timeout) {
          timeout = setTimeout(
            () => {
              if (pendingValue !== null) {
                value = pendingValue;
                pendingValue = null;
                lastUpdate = Date.now();
                trigger(); // OK Ta peine est purgé tu peu sortir
              }
              timeout = null;
            },
            interval - (now - lastUpdate),
          ); // On attend le reste du temps manquant
        }
      }
    },
  }));
}
```

## Le Scénario Ultime Pratique de Prod : L'API de Recherche Anti-DDos !

Voici pourquoi et comment vous utilisez cela dans votre App :

```vue
<script setup>
import { ref, watch } from "vue";
import { useDebouncedRef } from "@/composables/useDebouncedRef";

// Je crée ma Variable Fausse de 400 Millisecondes (Presque une demi-seconde)
const searchQuery = useDebouncedRef("", 400);
const results = ref([]);
const loading = ref(false);

// L'ESPION SUR LA FAUSSE VARIABLE !!
// Ce code ne s'exécutera physiquement JAMAIS tant que son utilisateur n'aura pas posé ses doigts et lâché le clavier pendant 400ms  !
watch(searchQuery, async (query) => {
  if (!query) {
    results.value = []; // Vide au char retour backspace complet
    return;
  }

  loading.value = true;
  try {
    // 1 SEUL APPEL RÉSEAU ENVOYÉ ! Évitant que l’entreprise paye la facture serveur 100 fois pour un mot de 100 Lettres a cause des events de keyup JS !
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    results.value = await response.json();
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <!-- Le V-Model est branché sur la MAGIC REF ! -->
  <input v-model="searchQuery" placeholder="Rechercher ici..." />
  <p v-if="loading">Veuillez Patienter Monsieur...</p>
  <ul>
    <li v-for="result in results" :key="result.id">{{ result.name }}</li>
  </ul>
</template>
```

## Formidables Ressources Officielles

- [La MasterClass "customRef"](https://vuejs.org/api/reactivity-advanced.html#customref) — La documentation native Vue ultra poussée sur le cœur de CustomRef.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
