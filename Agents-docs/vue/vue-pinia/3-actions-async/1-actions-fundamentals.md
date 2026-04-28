---
source_course: "vue-pinia"
source_lesson: "vue-pinia-actions-fundamentals"
---

# Les Fondations des Mutations (Les Actions)

Les **Actions** dans Pinia sont les "méthodes" de votre Banque Centrale. Contrairement au cauchemar architectural de Vuex, il n'y a STRICTEMENT AUCUNE distinction entre une "Mutation" (synchrone basique) et une "Action" (logique lourde). Virez les mutations. Pinia autorise les Actions à détruire et muter l'État librement !

## Les Actions Basiques

### En Vieux Style Options

```typescript
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({
    count: 0,
    history: [] as number[],
  }),

  actions: {
    // Action ultra Simple
    increment() {
      // ⚠️ LE PIEGE DES ANNEES 2000 : J'utilises "this." obligatoitrement !
      this.count++;
    },

    // Action Avec Paramètre externe (Payload)
    incrementBy(amount: number) {
      this.count += amount;
    },

    // Action Complexe de Validation ! On bloque les Négatifs !
    setCount(value: number) {
      if (value < 0) {
        console.warn("Interdit de passer sous le Zero absolu !");
        return;
      }
      this.history.push(this.count);
      this.count = value;
    },

    // Action qui appelle un simple Getter comme Variable !
    doubleAndIncrement() {
      this.count = this.doubleCount + 1; // this.doubleCount a été Coder dans "getters : {}"
    },

    // Action d'Execution de Code qui ... Lance une Autre Action !
    reset() {
      this.setCount(0); // BOOM ! Je tire L'actioo du Haut depuis l'interieu
      this.history = [];
    },
  },
});
```

### En Style Parfait "Setup" Composition

```typescript
import { ref } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter-setup", () => {
  // 1. LES VARIABLES
  const count = ref(0);
  const history = ref<number[]>([]);

  // 2. LES ACTIONS NEST QUE DES SIMPLES FONCTION JAVACRIPT NOMRALES !!!
  function increment() {
    count.value++; // ZERO 'THIS' !! J'ACCEDE AVEC LE '.VALUE' DE REF ! TOUT EST PROPRE !!!
  }

  function incrementBy(amount: number) {
    count.value += amount;
  }

  function setCount(value: number) {
    if (value < 0) {
      console.warn("Interdit de creuser !!");
      return;
    }
    history.value.push(count.value); // Zero PIEGES !
    count.value = value;
  }

  function reset() {
    setCount(0); // Execution Normale
    history.value = [];
  }

  // N'OUBLIEZ PAS DE LES "PUBLIER/EXPORTER" COMME DANS UN PACKAGE NOE !
  return { count, history, increment, incrementBy, setCount, reset };
});
```

## Extraire un Statut de Réussite depuis Le Front-End (Returns)

Parfois, un Bouton Front-end doit afficher "Rouge" ou "Vert" d'alerte, Si LA Banque à réussie ou Foiré (Ou Retourner l'Objet Frais !) :

```typescript
// (...) ACTIONS :

  // RETOURNE LA VICTOIRE (Boolean)
  addItem(item: Item): boolean {
    if (this.items.length >= this.maxItems) { // (Trop d'Articles)
      return false // J'INFORME LE VISITEUR QUE C'EST RATE !
    }
    this.items.push(item)
    return true // C'EST GAGNÉ
  },

  // RETOURNER L'ARTICLE TOUT NEUIF PARFAIT A LA PAGE UI !
  createItem(data: ItemData): Item {
    const item = {
      id: Date.now(), // ID TEMPORAIRE EN ATTENDANT L'API !
      ...data,
      createdAt: new Date()
    }
    this.items.push(item)
    return item // TIENS, RÉCUPÉRE TA NOUVELLE CARTE DE PROFILE GÉNÉRÉE !
  }

// --- --- ---
// UTILISATION DANS LA PAGE HTML  VUE.JS :
const store = useBagStore()

// LA RÉPONSE ARRIVE DE SUITE !
const success = store.addItem(newItem)
if (!success) {
  alert('Panier Bloqué Mon Capitaine !')
}
```

## Opérations Interbancaires : Tirer L'Alerte D'Une Autre Banque !

C'est LE pattern Ultime en Agence Pro : L'**UI Store / Notification Store** est Globalement dispo !

```typescript
import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { useNotificationStore } from "./notification";

export const useCartStore = defineStore("cart-amazon", {
  state: () => ({
    items: [] as CartItem[],
  }),

  actions: {
    async checkout() {
      // J'INVENTE LES 2 BANQUES EXTERNES DIRECTEMENT DANS MON ACTION E-COMMERCE  !!!!🔥
      const userStore = useUserStore();
      const notificationStore = useNotificationStore();

      // EST IL LOGUÉ ?
      if (!userStore.isLoggedIn) {
        // BAM ! J'ENVOIE UN NOTIIIF ROUGE GLOBAL QUI APAPARITRA EN HAUT A DROITE SUR TOUT LE SITE GRACE A CE SOUS-STORE !!
        notificationStore.show("Connectex vous pour Payer", "error");
        return;
      }

      try {
        // ON TENTE L'ACHAT API CARTE BLEU :
        await api.checkout(this.items, userStore.id); // SUCCESS !!
        this.items = [];
        notificationStore.show("VENDU !! MERCIS DE VOTRE ARGENT ! ", "success"); // MESSAGE VERT FLUO DE JOIS UI !!
      } catch (error) {
        // ECHEC PAIEMENT
        notificationStore.show("Paiement Rejeté. Dommage !! ", "error");
      }
    },
  },
});
```

## Mettre Un Compteur Sous Ecoute ! (`$onAction`)

L'espion de la NSA Pinia :

```typescript
const store = useCartStore();

// S'ABONNER DE FORCE A TOUT CE QUI BOUGE :
const unsubscribe = store.$onAction(
  ({
    name, // Le Nom de l'Action Tirée
    store, // L'Objet De La Banque elle meme
    args, // Qu'est ce qu'il à envoyyé edans ?
    after, // Un CROCHET : Faire CA SI ca marche !
    onError, // UN CRocheht : Faire ca SI Il lève une Erreur TryCatch/API !!
  }) => {
    const startTime = Date.now(); // DEmmarage Chronometerre !
    console.log(
      `Le Sniper dit : L'action "${name}" Est partie avec les balles :`,
      args,
    );

    after((result) => {
      // ENFIN ! L'ACTION SAUVEGARDE DB EST REVENUT !!
      console.log(
        `Elle c'et fini  en ${Date.now() - startTime}ms`,
        "Il a cracher les Résutats :",
        result,
      );
    });

    onError((error) => {
      // L'API EST TOMBÉ !
      console.error(`DRAME ! "${name}" A Échoué !:`, error);
    });
  },
);

// POUR TUER L'ESPION A LA FERMTURE DE LA PAGE :
unsubscribe();

// POUR LAISSER L'ESPION INFININIMENT MÊME SI LA PAGE DE CONNEXION EST FERMÉE :
store.$onAction(callback, true); // detached: true
```

## Les Blocs Try/Catch : La Forteresse Imprenable

TOUTE ACTION PINIA LOURDE DOIT ÊTRE UN TRY / CATCH FINAL BÈTO !!! :

```typescript
import { defineStore } from "pinia";

export const useDataStore = defineStore("mon-gros-backend", {
  state: () => ({
    data: null as Data | null,
    error: null as Error | null, // L'ETAT D'ESPRIT
    loading: false, // LE CERCLE TOURNANT !
  }),

  actions: {
    async fetchData() {
      this.loading = true; // J'ALLUME LE DOM GRAPHQUE DE CHARGEMENT POUR LUIUX  !
      this.error = null; // JE REZESR DE FORCE LES ERREURE !!

      try {
        const response = await fetch("/api/data");

        // LE FETCH JS EST DÉBILE : IL NE CRASH PAS SUR UNE ERREUR 404 OU 500 SERVER EN VRAI... ALORS ON LA DETCTE ET ON S'AUTO PETE A LA GUEULE DE FORCE :
        if (!response.ok) {
          throw new Error(
            `SERVEUR EXPLOSÉ EN ERREUR 500/400 HTTP ${response.status}`,
          );
        }

        // GENIAL ON SAUVE MA DATA
        this.data = await response.json();
      } catch (e) {
        this.error = e as Error; // ON SAUVE LA TRACES ERROR DANS LE STATE HTML POIR L'AFFFICHER EN ROUGE !!
        throw e; // ON RELANCE DE FORCE LA GRENADNE VERS LE HTML POUR QUIL S'OCCUPE DE REDIRIGER OU DE LUIUX !
      } finally {
        this.loading = false; // QUOI QUIL RRIVE (SUCCES OU MASSACRE ) : JE COUPE TOUJOURS LE LOADER SPINNER HORRILE SINON LE MEC POETRTA JAMAIS SURFER AILLEURS !!
      }
    },
  },
});
```

## Ressouces

- [Les Actions Pinia](https://pinia.vuejs.org/core-concepts/actions.html) — La Fiche technique complète.

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
