---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-undo-redo-state"
---

# L'ingénierie d'une Machine Temporelle (État Undo/Redo)

Le Saint Graal Absolu d'un développeur front-end de haute volée : Le redouté Bouton "Annuler / Rétablir" (Le célèbre `CTRL+Z`). Apprenez à concevoir son moteur central grâce aux prodiges du système de réactivité VUE Moteur.

## La Structure Mère : La Pile Temporelle Historique (History Stack)

Au fond, le `CTRL+Z` n'est rien d'autre qu'un Array JS (Tas d'empilements) que l'on lit à reculons !

```typescript
import { ref, computed, watch, type Ref } from "vue";

export function useHistory<T>(source: Ref<T>, maxHistory = 50) {
  // Ne stockez JAMAIS L'Histoire entière. (La Limite Mémoire de 50 actions de Ctrl+Z est primordiale pour ne pas briser le DOM RAM de navigateur des utilisateurs JS !)

  const history = ref<T[]>([]) as Ref<T[]>; // Passé (Ctrl+Z)
  const future = ref<T[]>([]) as Ref<T[]>; // Futur Alternatif (Ctrl+Y)

  // Interrupteur Quantique Paradoxal Moteur (Pour ne pas s'écouter et se suicider sois-même via la boucle Update Watch du bas !)
  let ignoreUpdate = false;

  // Cloner la donnée Pure Actuelle Originelle sans traces Moteurs :
  history.value.push(structuredClone(source.value));

  // 1/ L'ESPION TEMPOREL (Suit tout le code)
  watch(
    source, // LA Grosse Cible a ne pas quitte des Yeux (l'Interface Canva Paint par ex)
    (newValue) => {
      // HOLA SI ON CLIQUE NOUS MEME SUR UNDO, ALORS LE REF BOUGE, ET CET ESPION SE DECLENCHE ET COPIERA L'ANNULATION SUR L'ANNULATION POUR LA FIN DU MONDE ET EXPLOSERA EN BOUCLE INFINIE MOTEUR !!! COUPEZ LUI LE SIFLET !!
      if (ignoreUpdate) {
        ignoreUpdate = false;
        return;
      }

      // 2/ L'utilisateur a VRAIMENT FAIT QUELQUECHOSE DE LÉGITIME ET NOUVEAU ICI :
      future.value = []; // Donc Je TUE l'entièreté son arbre "Futur Artificiel". IL a modifié l'histoire.

      // Je Snapshot et Ajoute la Nouvelle Valeur Fausse à l'Histoire Humaine !
      history.value.push(structuredClone(newValue));

      // GESTION DU DEPOTOIRE POUBELLE MÉMOIRE (La limite dure JS de 50)
      if (history.value.length > maxHistory) {
        history.value.shift(); // Tranche violemment le premier éléments tableau au début du Tas : Le Temps le plus lointain d'il y a 50 ans ! Disparu !
      }
    },
    { deep: true }, // VITAL : L'espion TOUT au moindre cheveu de mouvement pixel !
  );

  // Les Constatateurs Booleans (Puis-je ou pas le faire ?)
  const canUndo = computed(() => history.value.length > 1); // On peu Ctrl+Z Si j'ai au moins 1 évènement derrière moi sur le tableau history !
  const canRedo = computed(() => future.value.length > 0); // On peu Ctrl+Y Si y a des trucs sauvés dans le Array du futur !

  // LE BOUTON CLICK "ANNULER !" -> CTRL + Z
  function undo() {
    if (!canUndo.value) return; // Impossible Chef !

    // JE DÉCAPITE (POP) LITÉRALLEMENT LE HAUT DE MON HISTOIRE AU DECOUPAGE ARRAY !
    const current = history.value.pop()!;
    // ET JE LE METS EN PRISON AU CHAUD DANS LE TAB "FUTUR" EN VRAIAC !
    future.value.push(current);

    // RÈGLE MOTEUR : FERMER DE FORCE LES YEUX DE L4ESPION WATCH MOTEUR !! (Ou boucle de la mort JS !)
    ignoreUpdate = true;
    //  Je re-écrase LITTÉRALLEMENT le V-MODEL d'Application visuelle complète actuelle au RANG EXACT du TABLEAU MOINS L'ETAT QUE JE VIENS DE SUPPRIMER !!
    source.value = structuredClone(history.value[history.value.length - 1]);
  }

  // LE BOUTON CLICK SUPER-REFAIRE "RÉTABLIR" -> CTRL + Y
  function redo() {
    if (!canRedo.value) return; // Fini chef !

    // Hop je sors le Futur alternatif en le supprimant ,
    const next = future.value.pop()!;
    // Hop je le refous le Haut de la pile Historique Standard humaine
    history.value.push(next);

    // Je ferme les yeux et je met l'UI a jour !
    ignoreUpdate = true;
    source.value = structuredClone(next);
  }

  // Le Nuke (Bombe Nucléaire)
  function clear() {
    history.value = [structuredClone(source.value)]; // Retour L'état Init
    future.value = []; // On TUE le futur en Array vide [].
  }

  //  Je retourne Un Objet ES6 Complexe d'Usine Factory  contenant mes Moteurs !  Le Dev de Composant HTML est paré !
  return {
    canUndo,
    canRedo,
    undo,
    redo,
    clear,
    historyLength: computed(() => history.value.length),
    futureLength: computed(() => future.value.length),
  };
}
```

## Le Cas d'Usage Ébouriffant : Application Web JS de Dessin (Type Paint / Photoshop)

Votre Développeur d'UI sera aux Anges : Ce moteur "useHistory" lui simplifie à mort la vie visuelle en le protégeant de toutes logiques mathématiques Array !

```vue
<script setup>
import { reactive, toRef } from "vue";
import { useHistory } from "@/composables/useHistory";

// Une grosse Variable d'Application Complexe VUE !
const canvas = reactive({
  shapes: [], // Un Canvas Peinture est plein de Formes !
  selectedId: null,
});

// MAGIE ABSOLUE !! Je couple la puissance de l'Usine Moteur History... A LA VARIABLE REF DU CANIVA !!! 🚀🚀🚀
const { canUndo, canRedo, undo, redo } = useHistory(
  toRef(() => canvas.shapes), // En forçant à passer Un objet "Ref" grace a l'utilitaire "toRef" qu'on connait bien pour que ce soit Réactif et espionnable magiquement à 100% dans la boite History Engine !!
);

// Actions du Joueur Humain banal sur l'UI HTML
function addShape(shape) {
  canvas.shapes.push({ id: Date.now(), ...shape }); // Le Compte "History Engine" L'A VU !! Et  l'a espionner secrètement de lui-même pour l'Empiler car il surveillait ça !! On a littéralement rien à lui ré-indiquer de Coder de Plus !!!
}

function deleteSelected() {
  if (canvas.selectedId) {
    canvas.shapes = canvas.shapes.filter((s) => s.id !== canvas.selectedId); // MÊME CHOSE : Espioné ! et Empilé auto !
    canvas.selectedId = null;
  }
}
</script>

<template>
  <div class="toolbar">
    <!-- Un Clic Annuler Banal avec un disabled conditionnel calculé auto !! Merveilleux-->
    <button @click="undo" :disabled="!canUndo">↶ Défaire Pédaler (Undo)</button>
    <button @click="redo" :disabled="!canRedo">
      ↷ Rétablir Refaire (Redo)
    </button>
  </div>

  <!-- Zone Peinture Complèxe -->
</template>
```

## Le Plugin Vital : Utiliser les Touches du Clavier Fait pour cela (CTRL+Z Absolu)

Ajoutez cette Option directement à Votre Module Engine History !

```typescript
import { onMounted, onUnmounted } from "vue";

export function useHistoryKeyboard(history: ReturnType<typeof useHistory>) {
  // Prend votre usine de Moteur en Argument Paramétré Absolu JS  TyeypeScript !!!

  function handleKeydown(e: KeyboardEvent) {
    // CLIC LOURD DE MAC (META KEY) ou CTRL WINDOWS... PLUS (+) ... LA TOUCHE "Z" SEULE !
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault(); // INTERDIT DE FAIRE L'ACTION DU NAVIGATEUR NATIVE POUR ÉVITER LES BOGUES !

      if (e.shiftKey) {
        // CTRL + SHIFT + Z !!
        // Oh, Le  Gars a Appuyé Majuscule en plus ! = Equivalent de Refaire ! (Redo !)
        history.redo();
      } else {
        // Classique ! Moteur Enclanché !
        history.undo();
      }
    }
    // SI CTRL + Y (Le Redo Secret de Développeur)
    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      history.redo();
    }
  }

  // S'Accroche à la Fenêtre Mère Luttéral Global "Document" Des l'Ouverture de la page pour le traquer les Claviers  !
  onMounted(() => {
    document.addEventListener("keydown", handleKeydown);
  });

  // LE TUE EN SORTANT VITE (Sécurité absolu FUITE MEMOIRE / Memory Leak JS !)
  onUnmounted(() => {
    document.removeEventListener("keydown", handleKeydown);
  });
}
```

## Merveilleuse Ressource Documentaire

- [Le Grimoire Cœur Reactivity API](https://vuejs.org/api/reactivity-core.html) — L'API Core Native et Profonde des arcanes de la Reactivité Vue JS.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
