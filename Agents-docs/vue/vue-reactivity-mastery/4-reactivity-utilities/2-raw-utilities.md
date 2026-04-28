---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-shallow-raw-utilities"
---

# `shallowRef`, `shallowReactive`, `toRaw`, et `markRaw`

Ces utilitaires très avancés vous donnent le contrôle ultime et absolu sur la réactivité pour des optimisations de performances extrêmes, et l'intégration parfaite avec des bibliothèques systèmes JS tierces complexes (ThreeJS, Charts, Maps).

## `shallowRef()` : La Ref Surficielle Rapide

Définit que SEUL l'emballage principal `.value` lui-même est réactif, **JAMAIS les propriétés enfants nichées profondément** :

```typescript
import { shallowRef } from "vue";

const state = shallowRef({
  nested: {
    count: 0,
  },
});

// ❌ NE DÉCLENCHE ABSOLUMENT AUCUNE RÉACTIVITÉ !! (Car "nested" est une propriété enfant et Vue n'en a espionné aucune !)
state.value.nested.count++;

// ✅ DÉCLENCHE LA MISE À JOUR (Car on touche directement et On Remplacer de Force et violemment le pauvre petit .value parent entier autorisé)
state.value = {
  nested: {
    count: 1,
  },
};
```

### Cas D'Usage Magistraux pour ShallowRef

```typescript
import { shallowRef, triggerRef } from "vue";

// Vider l'UI d'un Gigantesque Set de Datas provenant d'une BDD Lointaine !!
const largeData = shallowRef<BigDataset | null>(null);

async function loadData() {
  const data = await fetchHugeDataset(); // Ce truc comporte 100,000 objets JSON !!! Un Ref Classique aurait mis 10 secondes a créer 100,000 proxies dessus !!
  largeData.value = data; // Super Rapide : 1 Seul et Unique proxy a été crée pour afficher toute la grille !!!
}

// Le Système de "Coup de Pied Aux Fesses Moteur" Manuel :
function updateItem(index: number) {
  largeData.value!.items[index].processed = true; // Le DOM ne Bouge pas...
  triggerRef(largeData); // 🚨 JE TIRE À LA MAIN LE PISTOLET D'ALARME MOTEUR : VUE MET À JOUR TOUTE LA DONNÉE MANUELLEMENT ET AFFICHE LE CHANGEMENT AU-DESSUS SANS POSER DE QUESTION !!
}
```

## `shallowReactive()` : Le Reactive de Surface

Seules les immenses propriétés situées au RANG NUMERO 1 de la racine sont protégées par le proxy:

```typescript
import { shallowReactive } from "vue";

const state = shallowReactive({
  count: 0, // Rang 1: RÉACTIF MAGIQUE
  nested: {
    // Rang 1: L'Objet "nested" lui-même est Réactif
    value: 1, // Rang 2 Profond : CECI EST PERDU ET MORT, TOTALEMENT IGNORÉ !
  },
});

state.count++; // ✅ Le DOM Vue se Met a jour !
state.nested = {}; // ✅ Le DOM Vue se Met a jour !
state.nested.value++; // ❌ IL NE SE PASSERA RIEN DU TOUT !!
```

## L'Incroyable `toRaw()` : (Extraction du Code de la Matrice)

Permet d'extraire de force et de retourner le "Véritable Objet JS Banale et Mort Parfait" qui est enfermé au fond de son emballage Proxy Magique de Réactivité :

```typescript
import { reactive, toRaw } from "vue";

const original = { count: 0 };
const proxy = reactive(original);

console.log(toRaw(proxy) === original); // VRAI ABSOLU ! C'est le clone original retrouvé !

// Extremment Puissant Pour :
// 1. Comparer avec les originaux sans déclencher les getters Vue espions
// 2. Transmettre en force à des bibliothèques externes JS non-vue qui haïssent les Proxies ES6
// 3. Éviter un coût de CPU colossal dans des boucles While extrêmement mathématiques et limitées !
```

### Cas D'Usage Industriels pour `toRaw`

```typescript
import { reactive, toRaw } from "vue";

const state = reactive({ items: [1, 2, 3] });

// La bibliothèque tierce capricieuse qui va planter misérablement si elle voit un ES6 Proxy :
thirdPartyLibrary.process(toRaw(state.items));

// Sérialisation JSON Pure parfaite (Même si les proxy Vue passent, le toRaw est d'une grande clarté formelle)
const json = JSON.stringify(toRaw(state));

// LA Boucle De La Mort Critique de Performance :
const raw = toRaw(state);
for (let i = 0; i < 1000000; i++) {
  // Grace a un appel de variable morte "raw", AUCUN coût de Proxy Moteur de Vue ne sera calculé ni traqué ici à 1 million de reprises !! Gain CPU massif !
  raw.items[i % 3];
}
```

## Le Tatouage Maudit : `markRaw()` (La Marque de la Bête)

Ce tatouage va brûler de façon permanente et irréversible un objet pour lui interdire ABSOLUMENT et A TOUT JAMAIS de devenir "Réactif" si on essaye de le mettre dans une ref() ou un reactive() !!

```typescript
import { markRaw, reactive } from "vue";

const thirdPartyInstance = markRaw(new SomeHeavyClass());

const state = reactive({
  count: 0,
  external: thirdPartyInstance, // EST TOTALEMENT IGNORÉ PAR REACTIVE ET NE SERA JAMAIS MAGIQUE !!
});

// thirdPartyInstance Restera exactement comme il est pour l'éternité, sans le moindre wrapper proxy qui pourrait tuer ses fonctions internes !
```

### Quand Sortir le Tatouage Maudit `markRaw`

```typescript
import { markRaw, ref } from "vue";

// 1. Des très très lourdes Classes ES6 Pures Externes qui plantent si Vue les touche
class ExpensiveRenderer {
  canvas: HTMLCanvasElement;
  // ... des milliers de trucs internes ThreeJS ou WebGL fragiles
}

const renderer = ref(markRaw(new ExpensiveRenderer()));

// 2. Un gigantesque JSON lourd statique Immuable
const staticConfig = markRaw({
  // Des dizaine de milliers de valeurs mathématique ou géographique PURES JS !
  countries: [
    /* ... */
  ],
  currencies: [
    /* ... */
  ],
});

// 3. Les immenses bibliothèques de DOM et canvas tierces ! (Ex: ChartJS / LeafLetJS...)
import { Chart } from "chart.js";

const chart = ref<Chart | null>(null);

// LE CLASSIQUE MONDIAL POUR INTEGRER UNE LIB EXTERNE !
onMounted(() => {
  chart.value = markRaw(new Chart(/* ... l'instance lourde de graphique .. */));
});
```

## Différentiel De Performance Extrême Comparatif !

```typescript
import { ref, shallowRef, reactive, shallowReactive } from "vue";

// Réactivité Totale Moteur par Défaut : ~ CRÉE LITTÉRALEMENT + de 1000 OBJET CACHÉS PROXIES EN RAM !
const deepData = reactive({
  level1: {
    level2: {
      // ... hyper complexe en profondeur infinie
    },
  },
});

// Merveilleuse Réactivité de Surface : Ne Crée que SEULEMENT 1 SEUL ET UNIQUE PROXY EN RAM CPU!
const shallowData = shallowReactive({
  level1: {
    // Vide. L'intérieur ne coûte rien.
  },
});

// Cas d'École Ultime pour l'Analyse Big Data sans crash Front-End :
const bigData = shallowRef(generateLargeDataset()); // Pui utilisation des triggerRefs manuels !
```

## Guide de Survie Rapide en Entreprise

| Scenario Affronté                                                                     | Fonction Vital Armée !                                   |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| L'UI Data réactive banale quotidienne                                                 | Standard Classique : `ref()` / `reactive()`              |
| Les très lourd Datasets, Datas de Maps ou de Grilles Excel                            | Combo Gagnant : `shallowRef()` + `triggerRef()` Manuel ! |
| Je veux un Super form Object ou seul la base racine alarme le moteur                  | Mode Avancé : `shallowReactive()`                        |
| On donne la donnée a un plugin Jquery/ChartJS chiant                                  | Le Nettoyeur : `toRaw()`                                 |
| On stocke dans une ref les instances JS tierces géantes Type (Google Maps, ThreeJS..) | Le Tatouage : `markRaw()`                                |
| Boucles et Mathématiques Extrêmes Bloquantes ?                                        | L'Échappatoire : `toRaw()` durant la lecture !           |

## Grandes Ressources Exclusives Officielles

- [La Toute Puissance de la Reactivity Avancé et des Utilitaires de L'ombre](https://vuejs.org/api/reactivity-advanced.html) — Les vrais fondements des API de bas niveau pour experts.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
