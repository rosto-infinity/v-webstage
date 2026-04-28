---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-watch-fundamentals"
---

# Comprendre l'Architecture de `watch()` et `watchEffect()`

Les observateurs (Watchers) vous permettent en tant que développeur, d'exécuter l'équivalent de puissants "effets de bord" (appels API, logs, timers, manipulations du DOM brut) spécifiquement **en réaction** à des changements internes profonds de l'état réactif de votre app. Vue fournit deux immenses APIs pour cela : `watch()` pour un ciblage explicite et chirurgical, et `watchEffect()` pour un pistage automatique global massif des dépendances.

## Les Fondamentaux Architéturaux de `watch()`

`watch()` prend un Espion source (ce qu'il doit surveiller) et une Fonction de Retour Callback explicite (ce qu'il doit exécuter quand ça saute) :

```typescript
import { ref, watch } from "vue";

const count = ref(0);

// 1. Observer une ref pure spécifique
watch(count, (newValue, oldValue) => {
  console.log(`Le compteur vient de bouger !! : ${oldValue} → ${newValue}`);
});

// 2. Déclencher le piège en modifiant sa valeur de nulle part ailleurs (Déclenchera le Callback ci-dessus !)
count.value = 1; // La console log immédiatement "Le compteur vient de bouger !! 0 → 1"
```

## Écouter Magiquement Différentes Sources Difficiles

### Une Simple `Ref` Isolée

```typescript
const name = ref("Alice");

watch(name, (newName, oldName) => {
  console.log(`Nom: ${oldName} → ${newName}`);
});
```

### Un Getter Fonctionnel (La Technique Parapluie)

Vous pouvez tout à fait écouter une équation mathématique "Computed" abstraite ou une sous-propriété perdue au fond d'un grand Objet `reactive` !

```typescript
import { reactive, watch } from "vue";

const user = reactive({ name: "Alice", age: 25 });

// Observer TRES spécifiquement UNE SEULE sous-propriété isolée de l'objet !
watch(
  () => user.age, // L'Espion
  (newAge, oldAge) => {
    console.log(`Age a bougé : ${oldAge} → ${newAge}`);
  },
);

// Observer carrément le RÉSULTAT d'une EQUATION !
watch(
  () => user.age * 2, // L'Espion Mathématique
  (doubled) => {
    console.log(`Doublement de l'age détecté: ${doubled}`);
  },
);
```

### Le Pistolet Multi-Sources (Array)

```typescript
const firstName = ref("John");
const lastName = ref("Doe");

// Placer DEUX grands espions sur deux cibles asynchrones aléatoires différentes EN MÊME TEMPS !
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(
    `L'UN DES DEUX A BOUGÉ !  Nouveau nom complet : ${newFirst} ${newLast}`,
  );
});
```

## L'Incroyable Arme Nucléaire : `watchEffect()`

`watchEffect()` ne demande ni Source, ni Ancien.. Il s'exécute **UNE FOIS IMMÉDIATEMENT** de force dès le lancement (Contrairement à `watch`), puis il piste automatiquement, secrètement de lui même et en arrière plan CHACUNE des centaines de variables réactives natives qu'il aura simplement "lu" par hasard lors de cet appel inaugural !

```typescript
import { ref, watchEffect } from "vue";

const count = ref(0);
const name = ref("Vue");

// Exécute 1 FOIS, mais comme il aura "Lu" "count.value" et "name.value" secrètement de l'interieur... Il lie son Destin à ces deux refs À VIE !!
watchEffect(() => {
  console.log(`Le Count EST à ${count.value}, et Nom EST à ${name.value}`);
});
// Boom : Désormais, dés que count ou name change... La fonction au-dessus va se refaire exécuter de Re-chef par magie !
```

## Le Combat des Titans : `watch()` vs `watchEffect()`

| Fonctionnalité Exigée                        | `watch()`                                       | `watchEffect()`                                                                                       |
| -------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Sources Explicites dures                     | ✅ Oui                                          | ❌ Non (Pistage auto-magique de ce qu'il a sous les yeux)                                             |
| Avoir Accès Physique à L'**Ancienne Valeur** | ✅ Oui (oldValue)                               | ❌ Impossible                                                                                         |
| Paresseux (Lazy) au démarrage ?              | ✅ Oui (Attends la 1ère Modif)                  | ❌ Non (S'Exécute de force 1x immédiatement de suite !)                                               |
| Meilleur cas d'Usage Absolu                  | Surveiller une seule (ou x) var ciblée de force | Agir comme un Méga "Computed" invisible qui manipule et fait des milliers d'Effets et des API calls ! |

### Quand dégainer l'un ou l'autre

```typescript
// Utilisez le chirurgical watch() OBLIGATOIREMENT QUAND :
// 1/ Vous avez vitalement besoin de voir la variable d'avant (le vieil Historique):
watch(count, (newVal, oldVal) => {
  analytics.track("count_changed", { from: oldVal, to: newVal });
});

// 2/ Vous VOULEZ un sniper espion posé sur un element ultra-spécifique du layout (Ex Route)
watch(
  () => route.params.id, // Tir le SNIPER
  (id) => fetchData(id), // Et va Chercher en BDD la donnée correspondante que à ce signal !
);

// Utilisez par contre LA BOMBE watchEffect() UNIQUEMENT QUAND :
// 1/ Vous avez des dizaines de dépendances complexes partout :
watchEffect(() => {
  const url = `${baseUrl.value}/users/${userId.value}`;
  // Hop : Il s'est couplé TOUT SEUL et PENDANT TOUT SA VIE sur "baseUrl" ET sur "userId" en seulement 1 simple lecture !
});

// 2/ Vous voulez de toute façon son Exécution Immédiate au boot 1, PUIS ENSUITE seulement une Écoute en fond ! (Ex Title)
watchEffect(() => {
  document.title = `${pageName.value} | Mon Super App`; // Parfait ! Le titre du DOM est écrasé direct dès le boot de la vue, puis si jamais en naviguant pageName vient a changer, ca se remettra à jour. Le top absolu !
});
```

## La Chirurgie Fine du Timing du Callback (flush)

Par défaut, tous les Watchers de la Terre sont exécutés systématiquement par le moteur Vue **Juste AVANT** la mise à jour Physique de la Vue Composant (L'HTML). MAIS vous avez les droits divins de changer cela !

### Rendu par défaut - Le `flush: 'pre'` (Avant mis a jours UI)

Comportement par défaut, tourne toujours AVANT que Vue ne modifie le DOM sur votre écran, ce qui veut qu'il verra l'anciène version du DOM, un peu useless.

```typescript
watch(count, callback, { flush: "pre" });
```

### Le Rendu POST-DOM (Le Plus Utile et Populaire ! )

Fait tourner L'Observeur UNIQUEMENT APRÈS le rendu visuel total de la page vue !! :

```typescript
import { ref, watch, watchPostEffect } from "vue";

const count = ref(0);
// Option Explicite
watch(count, callback, { flush: "post" });

// Alias Pratique Moteur Magique (Même effet)
watchPostEffect(() => {
  // Ici il tourne avec un décalage, mais au moins, vous VOYEZ la nouvelle donnée si vous ciblez le DOM visuel directement !!
});
```

### Le Rendu SYNC Interdit (Super Dangereux !)

```typescript
import { watchSyncEffect } from "vue";

// TUE L'APPLICATION  (Fonctionne de manière synchrone blocante absolue du navigateur total à CHAQUE microscopique millième de changement tick JS)
watchSyncEffect(() => {
  console.log("count is now", count.value);
});

// Son jumeau sur option
watch(count, callback, { flush: "sync" });
```

**⚠️ Avertissement Ultime d'Alerte** : Les "Sync watchers" bloquent la mémoire thread, utilisent 100% du CPU du navigateur et gèlent l'utilisateur : N'Utilisez cela QU'EN CAS D'URGENCE ABSOLUE, et seulement si vous êtes expert Sénior Vue !

## Nettoyage des Débris des Watchers Morts Moteur

### Cas Général 1 : Tuer un Watcher Moteur Manuel (L'Arrêt d'Urgence)

Les Watchers se suicident tous automatiquement et très silencieusement de façon sécurisée quand leur Composant Mère qui les abrite meurt depuis l'écran de l'utilisateur. MAIS pour un contrôle précis, tout le système Watch return une fonction divine d'arrêt et de désamorçage immédiate (Abort) de sa surveillance :

```typescript
// On récupère sa télécommande de désactivation en créant l'Espion :
const stop = watch(source, callback);
const stopEffect = watchEffect(() => {
  /* ... */
});

// ... Plus tard, bien plus tard dans le code : Si On veux éteindre le radar manuellement avant la mort du composant
stop(); // On stop l'Espion Watch !
stopEffect(); // On stop l'Espion Bomb watchEffect !
```

### Cas Gigantesque 2 : L'API de "Cleanup" Interne aux Re-Run Moteur

À TOUS les passages ou avant de mourir et de désarmer le gros objet en mémoire, VUE expose dans ses propres callbacks de Watch une option vitale de nettoyage (OnCleanUp) qui tourne et annule toutes les vielles conneries en instances mortes du précédent Run (Idéal pour l’Annulation des appels réseau API massifs perdus !) :

```typescript
import { watchEffect } from "vue";

watchEffect((onCleanup) => {
  // 1/ J'invoque L'Objet Standard JS ES6 qui avorte des trucs
  const controller = new AbortController();

  // 2/ Je lance mon Fetch Lourd en l'accrochant a ce filet Abort
  fetch(url.value, { signal: controller.signal }).then(/* ... */);

  // 3/ ET LE SECRET EST ICI : Si jamais le composant Meurs, Ou que L'URL change subitement et relance à toute vitesse ce WatchEffect une seconde et dixième fois ??
  onCleanup(() => {
    // Bam ! Je tue de force l'ancienne et lente requête Morte précédente si elle était en cours au lieu d’en lancer des millions qui se croient sur le réseau pour rien !
    controller.abort();
  });
});
```

## Ressources Fondamentales

- [Le Grimoire des Watchers](https://vuejs.org/guide/essentials/watchers.html) — La doc la plus puissante sur tous les types absurdes de Watchers Vue

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
