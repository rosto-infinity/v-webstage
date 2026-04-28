---
source_course: "vue-pinia"
source_lesson: "vue-pinia-defining-stores"
---

# L'Affrontement Syntaxique Final : Options API VS Setup App

Pinia vous autorise officiellement de coder et définir vos Fichier Bancaires de 2 manières TOTALEMENT DIFFÉRENTES. Et devinez quoi ? En industrie moderne en 2024, UNE seule des 2 est acceptée et validée par les Séniors : La **Syntaxe Compose Setup**. Éviscérons pourquoi.

## La Vieillerie Obsolète Horrible : L'Options Syntax (Style Vue 2)

Parfaite si vous venez de Vuex et que vous adorez les accolades Json imbriquées à en mourir :

```typescript
import { defineStore } from "pinia";

// BEUUUURK !! Une Liste D'objets  Dictionnaire Configurable !!  !!
export const useCounterStore = defineStore("counter", {
  // L'ÉTAT : Un fonction qui retourne un Objet Json Crad de données
  state: () => ({
    count: 0,
    items: [] as string[],
    lastUpdated: null as Date | null,
  }),

  // LES CALCULETTES : Des Objets De Fonctions
  getters: {
    doubleCount: (state) => state.count * 2, // Faut passer `state` OBLIGATOIRMEENT EN ARGUMENT EN PLUS ! C'est Horuble !

    // Si on Veut un Autre Getter, Faut Mettre Typecsirpt Retour, et Remplacer State par CE PIEGE MORTEL DE `this.` !!!
    quadrupleCount(): number {
      return this.doubleCount * 2; // HORREURS ! IL FAUT UTLISER "this." QUI CASSE LE CONTEXT JSS  !!!
    },
  },

  // L'ARME LOURDE FONCTIONNEL :
  actions: {
    increment() {
      this.count++; // C'EST PIRE ! L'ACCES SE FAIT ENCORE AVEC "THIS." !
      this.lastUpdated = new Date();
    },

    async fetchItems() {
      // Call API Async OK..
      const response = await fetch("/api/items");
      this.items = await response.json(); // Le L'Envoie Dans "this."
    },

    reset() {
      this.$reset(); // Oh... Pinina Me Fournit Un Bouton Reset Natif Merveilleux Dans Ce Mode là ! L'Unique point positif.
    },
  },
});
```

## Le Vrai Mode Du Présent Et Du Futur Absolu : LA SYNTAXE "SETUP" ! 🔥 (L'Or Pur)

Elle utilise de Force la toute Première Composition API Native (Comme les `.vue` en Script setup !). Une clarté, une liberté et une puissance d'Enrobage (Composables) Inégalée à L'échelle mondiale :

```typescript
import { ref, computed } from "vue"; // MAAAAN !! J'IMPORTE MES BONS VIEUX OUTILS NORMAUX DE MES VRAIS HTML !!!
import { defineStore } from "pinia";

// 💥 BOOUM : Le Deuxième Argumet N'EST PAS UN OBJET JSON POURIR ""{ state : ()}"" ! NON ! C'EST UNE BONNE FONCTION FERMURE PURE DE CODE ! "() => { ... }"
export const useCounterStore = defineStore("counter", () => {
  // 1️⃣ L'ETAT (STATE ?) => C'est JUSTE DES SIMPLES PUTAIN DE VARIABLES `ref()` ET `rectives()` HABITUELLES !!!
  const count = ref(0);
  const items = ref<string[]>([]);
  const lastUpdated = ref<Date | null>(null);

  // 2️⃣ LES GETTERS  ? => C'est JUSTE DE BONNES VIEILLES CALCULATRICE `computed()` COMME D'HABITTUDE !!
  const doubleCount = computed(() => count.value * 2);
  const quadrupleCount = computed(() => doubleCount.value * 2);

  // 3️⃣ LES ACTIONS ? => C'EST JUSTES DE BONNES VEILLLES SIMPLES FONCITON TTE BETTES !!!  (PLUS DE PIEGE DE THIS !!!!))
  function increment() {
    count.value++; // BOUM  ! PAS DE "this" ! JE VISE DIRECT LA VALEUR .VALUE ! L'OR PUR !!
    lastUpdated.value = new Date();
  }

  function addItem(item: string) {
    items.value.push(item); //
  }

  async function fetchItems() {
    const response = await fetch("/api/items");
    items.value = await response.json();
  }

  // Oh la merde : Je n'Ai Plus le `$reset()` Natif. Je doit me Tapper la fonction main à la la main moi meme .
  function reset() {
    count.value = 0;
    items.value = [];
    lastUpdated.value = null;
  }

  // 🔥 LE SACRE GRAAL OBLIGATOIRE DE CE MODE SETUP 🔥
  // IL FAUT TOUJOURS EXPLICITEMENT ET LOURDEMENT CREER LE PAQUET DU PERE NOEL CADEAUX "RETURN { }" QUI RENVVERRA AU MONDE EXTERIEUR TOUTES CES VARIABLESS.
  // SI TU NE RENTRES PAS QUELQUECHOSE DANS CET ACCOLADE > ALORS LE MONDE NE VERA JAMAIS CETTE VARIABLE (Elle restra un Secret "Privé" du Store ! Une Force Ultime Architecturale !! )
  return {
    // Les Data Révélees au monde Extérieur !
    count,
    items,
    lastUpdated,
    // Les Computed Révélée !
    doubleCount,
    quadrupleCount,
    // Mes Fonctions d'Action ! (Si je Mettrait oar "Reset", il serait Privé Invisible à tout Jamais depuis le Fichier Home.vue !!! )
    increment,
    addItem,
    fetchItems,
    reset,
  };
});
```

## Le Tableau Récapitulatif Du Choix

| La Fonctionnalité             | En Mode Vieux "Options" Object    | Le Seul Mode "Setup" Composition                                                |
| ----------------------------- | --------------------------------- | ------------------------------------------------------------------------------- |
| Courbe D'Apprentissage        | Mognon, Facile à lire pour un Nul | Demande d'avoir un cerveau Composition API                                      |
| **Vitesse Typage TypeScript** | Limité et Bordélique              | **Excellente, Naturelle, Intelligente !**                                       |
| Accès Aux Variables           | ❌ Via des `this.xxx` Crasseux !  | ✅ Libre et Native JavaScript Scope !!                                          |
| Bouton Bouton Reset           | ✅ Natif `$reset()` Tout prêt     | ❌ À Écrire Vous-même a La main comme un con                                    |
| **Injecter de l'Extérieur**   | ❌ Impossible, C't'un Bloc JSON   | ✅ On Peut Importer l'Océans (Utiliser vueuse, Localstorage, Api Fetcher...) !! |
| Libérté                       | Rigide et Prédéfinit              | Flexibilité de Programmation Absolue !                                          |

## Pourquoi le Mode "Setup" est L'Arme Suprême En Entreprise ?

### Parce Que TU PEUX TROP RIEN FAIRE AVANT : Utiliser des Composables !!

```typescript
import { computed } from "vue";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core"; // OUUUH LE COMPOSANT EXTERNE !

export const useSettingsStore = defineStore("settings-app", () => {
  // INCROYABLE !! PINIA CONNECTE DIRECTEMENT SA RAM RAM ET SE LIE ET PERSITRE TOTALEMENT AUX COOKIE DE L'UTILISATEUR SAUVEGARDES SUR SON GOOGLE CHROME HARD DISK !!! (Un refresh ne detruira pas ça !)
  const theme = useLocalStorage("theme-appli", "light");
  const fontSize = useLocalStorage("fontSize", 14);

  // Et L'Equippe l'Ui Avec ?
  const isDarkMode = computed(() => theme.value === "dark");

  function toggleTheme() {
    theme.value = theme.value === "light" ? "dark" : "light"; // SAUVEGARDERA MAGICUQUEMENT CET ETAT PHYSIQUEMENT SUR SON DISQUE DUR !!
  }

  return {
    theme,
    fontSize,
    isDarkMode,
    toggleTheme,
  };
});
```

### Le Mode Setup accepte le Gardien Suprême : "WATCH()" !!

A L'Opposé de Vuex ou du Mode Options, vous pouvez LITTÉRALEMENT Foutre Un Espions `Watch` a L'Intèrieur de votre Store qui surveillera une variable globale et lancera une Alarme Api Serveur ou une sauvegarde de Force dès qu'un truc d'un composant change le Store !!!

```typescript
import { ref, watch } from "vue";
import { defineStore } from "pinia";

export const useFormStore = defineStore("form", () => {
  const email = ref("");
  const isValid = ref(false);

  // LE GARDIEN SILANCIEUX QUI NE DORT JAMAIS MÊME SI AUCUNE PAGE ".VUE" N'EST OUVERTE.
  // QUELQUN DANS LE MONDE A MODIFIÉ L'EMAIL DE LA RAM PINIA ??! :
  watch(email, (newEmail) => {
    // BIM BAM BOUM, MÊME SANS ACTION FONCITON JE FORCE SA DÉCISION VALIDATOR DIRECT :
    isValid.value = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
  });

  return { email, isValid };
});
```

## Notre Ordre Final !

**Par Décret Industriel Absolu, Utilisez TOUJOURS au Maximum La Snytaxe SETUP** :

- Une Flexibilité Architecturale Monstrueuse
- L'Ouverture Totale Vers l'Ecosystème Tiers (`VueUse`)
- Les Espions Autonomes !
- Une Vraie Protection du Cerveau Contre les Pièges "This" JavaScript Orienté Objet.

## Plus Loin Dans Les Astres

- [Comment définir Un store Setup/Options Pinia](https://pinia.vuejs.org/core-concepts/) — Le Guide Ultime de la Doc Pinia.

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
