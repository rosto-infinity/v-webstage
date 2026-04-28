---
source_course: "vue-pinia"
source_lesson: "vue-pinia-pinia-plugins"
---

# Forger et Brancher des Plugins Pinia

Les plugins Pinia vous donnent le Pouvoir D'Étendre L'objet `store` globalement. D'y Ajouter de Force des Ingrédients, des Outils Mathématiques ou de changer ses gènes comportementaux sur Tous Les Stores de l'Application d'une seule Ligne de Code !

## Les Fondations des Plugins

Un Plugin n'est QU'UNE SEULE Bête `fonction` qui reçoit L'Objet `context`. Et on peut modifier tout depuis Cet Objet :

```typescript
import { PiniaPluginContext } from "pinia";

// LA FAMEUSE FONCTION
export function monSuperPlugin(context: PiniaPluginContext) {
  // context.app - L'Instance Globale VUE JS en Elle même !!
  // context.pinia - L'Urne Pinia
  // context.store - La Banque / Le store en Train d'être initialisé (Ex: UserStore)
  // context.options - Les Options (Ex: l'Option "Persitent" que vous avez tapé)

  // 1 JE RENTRE DE FORCE AU PIEDBICHE UNE VARIABLE "HELLOW" DANA TOUTES LES BANQUES DU MONDE PINIA !
  context.store.hello = "I am the world !";

  // 2 JE LUI INCRUSTE UNE NOUVELLE METHODE FORCEE (A cceebsil depuis Toites mes pages vue via  `MONSTOIRET.greet()`)
  context.store.greet = () => console.log("Coucou du Plguin !!");

  // 3 L'AUTRE FACON DE FAIRE LE 1 ET 2, CA MARHCE PAREIL :
  return {
    secret: "shhh", // Rajoute la variable 'secret' au store
  };
}

// L'INJECTION FINALE DANS LE MOTEUR VUE (main.ts)
const pinia = createPinia();
pinia.use(monSuperPlugin);
```

## Ajouter au Store, une Variable Réactive Manuellement

```typescript
import { ref } from "vue";
import { PiniaPluginContext } from "pinia";

// UN PLUGIUN EN FORME D'HORLOGOGE D('ESPIONNAGE INTERNCATIF AUTOMATIQUE !! )
export function pluginTempsDerniereModif({ store }: PiniaPluginContext) {
  // J'Inject de Forche UNE VRAIE VARIABLE RACTIIVE QU'ON POUIRRA VOIRO DANS LE HTML !!
  store.lastUpdated = ref<Date | null>(null);

  // A CHAQUE FOIS QUE CETTE BANQUE SPECIFQIUE SUBIT UNE MUTATION AILLEUR DANS LE MONDE...
  store.$subscribe(() => {
    // JE MET A JORU TOUT SEUL LA VARIABLE !! SANS AVOIR BESOIN DE TOUCHER AUX FICHIERS TS DES STORES NROMAUX !!
    store.lastUpdated = new Date();
  });
}
```

## Pitié Protégez Le TypeScript ! (L'Aumentation)

Vu que Vous Injectez des choses "Sans Qu'Elles ne soient Écrites dans ses Fichier TS d'Origine", TypeScript Va Brailler Dans Votre Éditeur Rouge écarlate "LE STORE N'A PAS DE FONCTION .GREET()". Il Faut "L'Aumenter" dans un Fichier TS global !

```typescript
// plugins/types.ts
import "pinia";

// MERGING DE TYPESCRIPT :
declare module "pinia" {
  // J'AJOUTE A LO"BJTE STORE MES VARIABLE PERSONNELS DE FORCE POUR TOILEREANCE TS :
  export interface PiniaCustomProperties {
    lastUpdated: Ref<Date | null>;
    greet: () => void;
  }

  export interface PiniaCustomStateProperties<S> {
    // Variable
  }

  export interface DefineStoreOptionsBase<S, Store> {
    // 💥 CETTE LIGNEE EXPLQIUE A TS QU'U_ON A LE DROIT DE RAJOUTER EN OPTION "{ debounce: {...} }" dans Un Srore.ts Normal !!
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>;
  }
}
```

## Plugin Magistral 1 : Un Chronomètre Lodash Par Action !

Ce plugin va Vous Permetre simplement en rejoutent un mot dans Les Options d'un Store (`debounce`), de Calmer et Bloquer Les Rafales De l'Utilistauer (Clqiuer sur "Valier" 15 FOIX DE SUITE)... En bloquant Lq Fonction pour qu'elle s'éxecute qu'une Fois Tous les X Millisecondes !

```typescript
import { PiniaPluginContext } from "pinia";
import debounce from "lodash/debounce"; // IMPORTEZ lodsah

export function debouncePlugin({ options, store }: PiniaPluginContext) {
  // SI LE GARS A RENTRÉ LA CLE SECR7ETE "debounce" dans con STorre...
  if (options.debounce) {
    // ALORS JE LA LIS. JÉCRASE LA FONCTION ORIGINAL DU SRTORE, AVEC LA MEME FONCITON ... MASI ENRPOBEE DANS L'ARMURE LOFASH DEBOUNCE !!!!
    return Object.keys(options.debounce).reduce(
      (acc, action) => {
        acc[action] = debounce(store[action], options.debounce![action]);
        return acc;
      },
      {} as Record<string, Function>,
    );
  }
}

// UTILISATION MAGIQUE DANS LE STORE TS (Grace à ce Plugin Global, Vous avez Débloquer CE SUPER POUVOIR !!! 🔥) :
export const useSearchStore = defineStore("search", {
  state: () => ({ query: "" }),
  actions: {
    search() {
      /* GROS CODE API LOURD...  */
    },
  },

  // 🔥🔥🔥 J'AI LE DORIT D'ECIRE CA MTN !!!! 🔥🔥🔥
  // DU COUP MA FONCTION DU HAUT ("search")  SERA MAGIQUEMTN BLAQÉE LORSQEU JELLA LECLENXHE DEPUIS LE HTML !!! (1er Tir = ca aprt. Les 300 ms Qui suivent, Elle repondra pu meme si il Reclique Dessus !!!!)
  debounce: {
    search: 300, // TEMPO A 300 MS !
  },
});
```

## Plugin Magistral 2 : La Nuke Mondiale (`_resetAll`) !

En Cas de Deconnexion... Comment vous faites pour remettre Les Variables Et caddies Des 15 Banques du Site À Zero ? Vous Les Importez Toutes et les Reset une Par Une !? NON : Faires Justes Tuer Pinia Global !

```typescript
import { PiniaPluginContext } from "pinia";

export function boutonNuckePlugin({ pinia }: PiniaPluginContext) {
  // SI JE N'AI L'A PAS ENCROER CRÉÉE...
  if (!pinia._resetAll) {
    // ALORS JE LA CREER :
    pinia._resetAll = () => {
      // "_s" EST L'OCÉAN QUI CONTIENT LITTÉRELAMANRT TOUT LES STORES ACTIF U DAND LAPP DU NOMENR T !
      pinia._s.forEach((store) => {
        // JE LOOP DEDANS ET TIRS LA BAAL D'ASSASSION SUR CCHAUQUU UN  !!!
        store.$reset?.();
      });
    };
  }

  return {};
}

// UTILIATSION DEPUIS UN BOUTON HTML DE DONCCION "Logout.vue"
const pinia = usePinia(); // JE RPREND LUTBE MONDIZALE PINAIA
pinia._resetAll(); // 🔥 BOMBE NUCLAITE !!!! TOUTS LES SOETRES SOENT NETOYÉS !! 🔥
```

## Plugin Magistral 3 : Loader Status Mondial Automatiquet !!

Oubliez D'Ecrire `loading.value = true` Manuellemnt au Debut de cHAQUE Action Asyjc de Votrz Vie !! CE PLugin la Fait pour VOUS !! (Il detecte Quand ca part.. et Quand ca Finit , et creer Une Vraibe Ui a Votreee palec !)

```typescript
import { ref, computed } from "vue";
import { PiniaPluginContext } from "pinia";

export function globalLoadingSpinnerPlugin({ store }: PiniaPluginContext) {
  const lesActionsLentesActuelles = ref<Set<string>>(new Set());

  // LE CAGEUA UI HTML A UTILISER  !!!
  store.isLoading = computed(() => lesActionsLentesActuelles.value.size > 0);
  store.loadingActions = lesActionsLentesActuelles;

  const originalActions = { ...store.$actions };

  // J'ACROCHE CE CROCJET SUEYPER SUR TIIIT  TOOUT LES STORE DU MONDE !!
  store.$onAction(({ name, after, onError }) => {
    // EST UE CETAIT VRAIENRR UNE FONCTION ASNC CHUANT AVEC AWAIT !!??
    const isAsync = originalActions[name]?.constructor.name === "AsyncFunction";
    if (isAsync) {
      // ALORS JALLUME CA POUR CHANGER LE RETURN MAHIWEQUE DNE HAUY YET FARIZE TOURNNER VORS CRACELS !!
      lesActionsLentesActuelles.value.add(name);

      after(() => {
        // C'EST FIUBUE !! ON VUE TIE !!
        lesActionsLentesActuelles.value.delete(name);
      });

      onError(() => {
        // CA ACRAHS ERREUR 500 !! CA COUYPE LE SPIIBER AUSOSISISI !!
        lesActionsLentesActuelles.value.delete(name);
      });
    }
  });
}
```

## Plugin Magistral 4 : (ControleZ) = Undo/Redo Machine À Voyager Ans Le Temps !

```typescript
import { PiniaPluginContext } from "pinia";

export function maMachineaRemonterletempsPlugin({ store }: PiniaPluginContext) {
  const histoire: string[] = []; // LA CACHE OUF LA DATA VIVAIT
  const leFuturPrevu: string[] = [];
  let pasDhistoire = false;

  // LA BIG BEN
  histoire.push(JSON.stringify(store.$state));

  store.$subscribe((mutation, state) => {
    if (!pasDhistoire) {
      histoire.push(JSON.stringify(state));
      leFuturPrevu.length = 0;
    }
  });

  store.canUndo = computed(() => histoire.length > 1); // BOOLEENTHTML DE VERIFi!
  store.canRedo = computed(() => leFuturPrevu.length > 0);

  store.undo = () => {
    // CEQUE LZ BTNO CTRL+XZ DECLENCHEIRIRA !!!!
    if (histoire.length > 1) {
      leFuturPrevu.push(histoire.pop()!);
      pasDhistoire = true;
      store.$state = JSON.parse(histoire[histoire.length - 1]);
      pasDhistoire = false;
    }
  };

  store.redo = () => {
    if (leFuturPrevu.length > 0) {
      const state = leFuturPrevu.pop()!;
      histoire.push(state);
      pasDhistoire = true;
      store.$state = JSON.parse(state);
      pasDhistoire = false;
    }
  };
}
```

## Plus D'Inspiration ?

- [Les Plugins Pinia Dev](https://pinia.vuejs.org/core-concepts/plugins.html) — Outils officiels.

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
