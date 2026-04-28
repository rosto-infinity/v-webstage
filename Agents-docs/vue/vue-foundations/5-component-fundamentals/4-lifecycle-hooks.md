---
source_course: "vue-foundations"
source_lesson: "vue-foundations-lifecycle-hooks"
---

# Hooks de Cycle de Vie (Lifecycle Hooks)

Chaque composant Vue passe par une série d'étapes d'initialisation invisibles — préparer les données réactives, compiler les templates, s'insérer dans le DOM, et se mettre à jour quand ses données changent. Tout au long de ce processus, Vue exécute des **Hooks de cycle de vie** (des fonctions "crochet" automatiques) qui vous permettent d'exécuter votre propre code à des étapes très précises de la vie du composant.

## Le Cycle de Vie d'un Composant

```
┌─────────────────────────────────────────┐
│             Composant Créé              │
│       (Données réactives prêtes)        │
└─────────────────────────────────────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │    onBeforeMount    │
         │ (Avant insertion DOM)│
         └─────────────────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │      onMounted      │  ← C'est ICI qu'on peut enfin
         │     (DOM inséré)    │    manipuler les balises HTML !
         └─────────────────────┘
                    │
           ┌───────┴───────┐
           │ Mise à jour ? │
           └───────┬───────┘
                   │ oui
                   ▼
         ┌─────────────────────┐
         │   onBeforeUpdate    │
         │(Avant patch du DOM) │
         └─────────────────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │      onUpdated      │
         │ (Le DOM a été MAJ)  │
         └─────────────────────┘
                    │
           ┌───────┴───────┐
           │ Destruction ? │
           └───────┬───────┘
                   │ oui
                   ▼
         ┌─────────────────────┐
         │   onBeforeUnmount   │
         │(Tourne encore bien) │
         └─────────────────────┘
                    │             ← C'est ICI qu'on doit nettoyer
                    ▼               nos écouteurs globaux ou intervalles !
         ┌─────────────────────┐
         │     onUnmounted     │
         │  (Composant détruit)│
         └─────────────────────┘
```

## `onMounted` - Le Hook le plus utilisé

`onMounted()` s'exécute jute _après_ que le composant ait été physiquement ajouté, rendu et dessiné à l'écran (dans le DOM du navigateur). C'est le moment parfait pour :

- Faire la toute première requête API (`fetch`) pour charger les données.
- Configurer des écouteurs d'événements globaux lourds sur `window`.
- Initialiser des bibliothèques JavaScript externes (Chart.js graphiques, Three.js, etc.).
- Accéder physiquement à des balises DOM (ex: Scroll automatique en bas de page).

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";

const users = ref<User[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

// S'exécute UNE SEULE FOIS dès que le composant est affiché à l'écran :
onMounted(async () => {
  try {
    const response = await fetch("/api/users");
    users.value = await response.json();
  } catch (e) {
    error.value = "Échec du chargement des utilisateurs";
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div v-if="isLoading">Chargement en cours massif...</div>
  <div v-else-if="error">{{ error }}</div>
  <ul v-else>
    <li v-for="user in users" :key="user.id">{{ user.name }}</li>
  </ul>
</template>
```

## `onUnmounted` - L'indispensable Nettoyage (Cleanup)

`onUnmounted()` s'exécute exactement à l'instant où le composant est détruit/effacé de la page Web (Exemple: L'utilisateur a changé de page avec le menu, ou un `v-if` a supprimé le composant). Si vous ne faites pas le ménage ici, vous créerez de graves **fuites de mémoire** (Memory Leaks). Utilisez-le pour :

- Retirer vos propres écouteurs d'événements attachés globalement à `window` ou `document`.
- Casser vos boucles infinies `setInterval` ou `setTimeout`.
- Se déconnecter proprement des WebSockets réseau.
- Annuler des requêtes HTTP interminables en cours.

```vue
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const mouseX = ref(0);
const mouseY = ref(0);

function handleMouseMove(event: MouseEvent) {
  mouseX.value = event.clientX;
  mouseY.value = event.clientY;
}

onMounted(() => {
  // On attache un écouteur de souris très lourd AU NAVIGATEUR ENTIER au rendu du composant !
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  // IMPERATIF : On supprime absoluement cet écouteur persistant si l'utilisateur quitte la page.
  // Sinon, le navigateur écoutera la souris pour le reste de sa vie en arrière-plan, faisant ramer l'ordinateur !
  window.removeEventListener("mousemove", handleMouseMove);
});
</script>
```

## `onBeforeMount` & `onBeforeUnmount`

Ces hooks s'exécutent juste _avant_ la phase de montage ou de démontage complète :

```vue
<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount } from "vue";

onBeforeMount(() => {
  console.log("Le composant VAA être monté dans une fraction de milliseconde");
  // Le code HTML (DOM) n'existe pas ENCORE ici. Juste le JS.
});

onBeforeUnmount(() => {
  console.log("Le composant VAA complètement mourir");
  // Le composant est pourtant toujours 100% fonctionnel et interactif au moment de cette exécution.
});
</script>
```

## `onUpdated` & `onBeforeUpdate`

Ces hooks se déclenchent uniquement lorsque des _DONNÉES RÉACTIVES_ logiques du composant mutent et forcent donc Vue à re-dessiner et modifier le DOM (HTML) du composant :

```vue
<script setup lang="ts">
import { ref, onUpdated, onBeforeUpdate } from "vue";

const count = ref(0);

onBeforeUpdate(() => {
  // `count` vient d'être modifié en JS par l'utilisateur (!= 0)
  // Mais si vous inspectez le composant, il affiche TOUJOURS "0" à l'écran !
  console.log(
    "Sur le point de rafraîchir l'écran avec la nouvelle donnée :",
    count.value,
  );
});

onUpdated(() => {
  // Le composant vient d'être re-dessiné de force par le moteur Vue
  // Si vous vérifier le composant, le DOM affiche ENFIN la nouvelle valeur :
  console.log("Mis à jour ! L'écran HTML affiche enfin la valeur !");
});
</script>

<template>
  <button @click="count++">Nombre de clics : {{ count }}</button>
</template>
```

**⚠️ Avertissement Mortel** : Ne modifiez JAMAIS vos variables réactives à l'intérieur de `onUpdated()` — Cela forcerait l'écran à se redessiner _encore_, ce qui déclencherait `onUpdated()` à nouveau, modifiant votre variable, redessinant l'écran indéfiniment... C'est la **boucle infinie (Infinite Loop) (Crash de l'onglet garanti)** !

## Cas Pratique du Monde Réel : Auto-Sauvegarde silencieuse

```vue
<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

const content = ref("");
const lastSaved = ref<Date | null>(null);
const saveStatus = ref<"idle" | "saving" | "saved">("idle");

// On stocke l'ID numéraire de l'Interval JS
let autoSaveInterval: number | null = null;

async function save() {
  if (!content.value) return;

  saveStatus.value = "saving";
  try {
    await fetch("/api/document", {
      method: "POST",
      body: JSON.stringify({ content: content.value }),
    });
    lastSaved.value = new Date();
    saveStatus.value = "saved";
  } catch (e) {
    saveStatus.value = "idle";
  }
}

// 1. Déclenché AUTOMATIQUEMENT à l'ouverture de la page Editeur Text :
onMounted(() => {
  // On charge le texte du brouillon existant depuis l'API
  fetch("/api/document")
    .then((res) => res.json())
    .then((data) => {
      content.value = data.content || "";
    });

  // On configure surtout LA SAUVEGARDE AUTO EN ARRIERE-PLAN TOUTES LES 30 SECONDES exactes !
  autoSaveInterval = window.setInterval(save, 30000);
});

// 2. Déclenché AUTOMATIQUEMENT à la FERMETURE de l'editeur (Redirection par exemple) :
onUnmounted(() => {
  // On coupe court à l'intervalle JS infini pour ne pas faire fuir la RAM ou spammer l'API bêtement !!
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }

  // On fait une "Toute dernière Sauvegarde finale de secours" avant fermeture et fuite !
  save();
});
</script>

<template>
  <div class="editor">
    <div class="toolbar">
      <span v-if="saveStatus === 'saving'">Sauvegarde automatique...</span>
      <span v-else-if="saveStatus === 'saved'">
        Enregistré proprement à {{ lastSaved?.toLocaleTimeString() }}
      </span>
      <button @click="save">Forcer la Sauvegarde</button>
    </div>

    <textarea
      v-model="content"
      placeholder="Commencez à rédiger votre roman !"
    ></textarea>
  </div>
</template>
```

## Résumé et Antisèche

| Hook de Vue       | Quand se déclenche-t-il exactement ?       | Cas d'usages courants                                                                    |
| ----------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `onBeforeMount`   | Avant de créer le code HTML                | Très rare.                                                                               |
| `onMounted`       | **Après l'insertion finale à l'écran**     | **Requêtes Fetch BDD, Connexions de base, Manipulation directe du DOM**                  |
| `onBeforeUpdate`  | Avant de repeindre l'écran                 | Analyser l'état d'un tag avant son altération.                                           |
| `onUpdated`       | Après avoir repeint l'écran                | Opérations complexes liées à la nouvelle taille des boîtes (Resize).                     |
| `onBeforeUnmount` | Juste avant le démantèlement absolu        | Dernières actions manuelles possibles.                                                   |
| `onUnmounted`     | **Une fois arraché / jeté de la page web** | **Retrait impératif de timers js ou d'écouteurs pour éviter les fuites (Leaks de RAM).** |

## Ressources

- [Hooks de Cycle de Vie](https://vuejs.org/guide/essentials/lifecycle.html) — Documentation officielle du site Vue.js.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
