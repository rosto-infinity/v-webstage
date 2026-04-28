---
source_course: "vue-pinia"
source_lesson: "vue-pinia-accessing-state"
---

# Accéder et Muter l'État Bancaire Mondial (State)

Maitriser exactement comment extirper la Data de votre Banque Globale vers la Page Html Utilisateur (Sans briser sa Réactivité VueJs magique) est la clef vitale !

## L'Art de l'Accès en Lecture (Accessing)

### La Lecture Simple Banale Directe (Direct Access)

C'est simple, c'est comme s'il était directement Dans la même pièce que vous !:

```vue
<!-- Fichier : Settings.vue -->
<script setup>
import { useUserStore } from "@/stores/user";

const BANQUE = useUserStore(); // Je connecte Le Tuyaux D'aspiration RAM !!

console.log(BANQUE.name); // 'Alice'
console.log(BANQUE.isAdmin); // true
</script>

<template>
  <!-- La Banque Magique est AUTOMATIQUEMENT Réactive à l'Écran ! Si un Admin la modifie d'une autre Page.. Ca Change ici en DIRECT LIVE !! -->
  <p>Enchanté Mon Seigneur, {{ BANQUE.name }}</p>

  <span v-if="BANQUE.isAdmin" class="ui-tag">Badge Role : D.DIEUX</span>
</template>
```

### Le Piège Mortel de JS DESTRUCTURATION !: Entrez `storeToRefs` !

**⚠️ DANGER DE MORT JAVASCRIPT :** C'est l'Érreur la Plus Connue sur Pinia ! Si vous utilisez l'Extraction ES6 `{ }` pour "raccourcir" votre Banque dans la Volée, JS Détruit Physiquement le Lien de Sang Réactif Interne et vos données ne se mettront JAMAIS à jour si elles bougent Ailleur ! :

```vue
<script setup>
import { useUserStore } from "@/stores/user";
// L'ARME DE SAUVEGARDE REACCTIVE FOURNIE PAR VUE :
import { storeToRefs } from "pinia";

const BANQUE = useUserStore();

// ❌ ASSASSINAT EN RÈGLE : La Réactivité Meurt sur le champ. Ne se rafraichira plus JAMAIS MÊME SI LOGUÉ !
const { name, email } = BANQUE;

// ✅ LA RESCUSITATION : Extraction Propre  !
const { name, email } = storeToRefs(BANQUE); // ON EXTRAIT EN PASSANT PAR LE DOUANIER PINIA QUI PRESERVE LES LIENS !!

// (Bon à Savoir) : PAR CONTRE, Vous Pouvez Detruire Directement Les Fonctions (Actions) Sans Outil CAR ce Sont des Methodes Figees, pas de la data changeante :
const { updateProfile, logout } = BANQUE;
</script>
```

## L'Art de l'Écriture (Modifier la Banque)

### Le Mode "Gorille Bourrin" (Direct Mutation)

Contrairement a Lhorrible "Mutations Vuex" Ou il fallait Ecrire une Enorme Fonction Dediée a rallonge pour simplement changer `True` en `False`... Avec Pinia, C'est Open Bar Complet !! (C'est D'Ailleurs la Raison Numero 1 de Sa Création par l'Equipe Vue !!) :

```typescript
const store = useCounterStore();

// L'ATTACK FRONTALE ABSOLUE (C'EST AUTORISÉ ET OFFICIEL !)
store.count++;
store.name = "Le Nouveau Maitre des Lieux";
store.items.push("Le Nouvel Element");
```

### L'Opération Chirurgicale Massive : La Rustine `$patch()`

Mais Imaginez si vous deviez mettre à jour 15 lignes Différentes d'un Coups : Le Bouton "Modifier" gorille au dessus déclencherait 15 Actualisations Graphiques VUE DOM d'Afhilée dans le Navigateur ! C'est trop lourd ! Utilisez le Lot :

```typescript
const store = useUserStore();

// SYNTAXE OBJET : (Une Bonne Grosse Caisse En Bois Livrée Amazon D'Un Coups !) :
store.$patch({
  // CA NE DECLENCHERA QU'UN SEUL RE-RENDU GRAPHIQUE !!
  name: "Alice",
  email: "alice@example.com",
  age: 30,
});

// SYNTAXE FONCTIONNELLE : (Pour des Logiques  Mathématiques Math Compliquées Avant la Livraison) :
store.$patch((state) => {
  state.items.push("La Super Formule");
  state.total = state.items.length;
  state.hasItems = state.items.length > 0; // Calcule Automatique direct !
});
```

### Le Mode Elegant "Action" (Méthode Encapsulée)

Réservez Le Gros Code (Comme Au Dessus) et Mettez Les Au chaud à L'Intérieur Dans Le Fichier Du Store Lui même (Les Functions ACTIONS) !!!

```typescript
// DANS LA BANQUE PINIA : useXXXstore.ts
actions: {
  updateUser(userData: Partial<User>) {
    this.name = userData.name ?? this.name // ?? C'est le Famas TS  (Nullish Coalescing)
    this.email = userData.email ?? this.email
    this.lastUpdated = new Date()
  }
}

// UTILISATION  PROPRE DANS LA PAGE VUE :
store.updateUser({ name: 'Bob L\'Eponge', email: 'bob@eponge.com' })
```

## Le Grand Bouton Rouge "Reset"

A La Déconnexion, Détruisez La Banque !

### Avec Le Vieux Mode "Options Syntax" : `$reset()` Est Gratos !

```typescript
const store = useCounterStore();

store.count = 100;
store.$reset(); // PINIA ECRASE AUTOMATIQUEMENT LA RAM ET REMET TOUT A ZERO !!
```

### Avec le Merveilleux Mode "Setup Syntax" : (A Coder a La Main)

Pinia NE PEUT PLUS Deviner comment Réset vos varibales Libre. Il Faut La Fabriquer Vous Même !

```typescript
export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const name = ref("Le Ccmptreur ");

  // LE BOUTON ROUGE CONSTRUIT MANUALLEMENT :
  function $reset() {
    count.value = 0; // On Remet les Variable à Leurs Valeur du Début Manuellement ...
    name.value = "Le Ccmptreur ";
  }

  return { count, name, $reset };
});
```

## L'Annihilation Totale de L'Etat (`$state`)

Pour Les Cas Extrêmes de L'Hydratation SSR : Remplacer l'Univers Complet et Absolu, par un Nouveau !

```typescript
const store = useUserStore();

// ECRASE TOUTE LA VALISE CACHE COMPLETE PAR CA   :
store.$state = {
  name: "L\Usurpateur d\Identité",
  email: "hack@hack.com",
  settings: { theme: "dark-black" },
};
```

## Les Snipers de Mutations (Subscribing : `$subscribe`)

Etre Informé Immédiatement et Magiquement Des qu'Une Valeur Dans Le store Commence a Bouger d'1 Millimetres (Parfauit POur sauver les Caddie E-Comerce en Arrière Plan sans Action D'Utilisateur ! )

```typescript
const store = useUserStore();

// L'ESPION SECRET : J'Avertit Console Des Qu'Une Action Interne S'Est Faite dans Cette Banque  !!
const unsubscribe = store.$subscribe(
  (mutation, state) => {
    console.log(
      "Un Mec de l\Extérieur à Modifié la Donée ! Mution de Type :",
      mutation.type,
    );
    console.log("LA NOUVELLE VALISE EST APPARUE :", state);

    // LE GRAAL DES ANNEES 2020 : Sauvegarder dans Ce Hook Le caddie Sur LE HARD DISC DU GARS !!
    localStorage.setItem("caddie-e-commerce", JSON.stringify(state));
  },
  { detached: true },
); // VITAL: detached: true Veux Dire QUE L'ESPION CONTINUE DE SURVEILLER MEME SI LE COMPOSANT DANS LEQUEL IL A ETE INITIALISÉ DISPARAIT ET DESTRUIT !

// POUR TUER LE SNIPER :
unsubscribe();
```

## Bonus de L'Architecte Typesteur TS

Toujors Isoler La Caresse Initiale !

```typescript
import { defineStore } from "pinia";

// LE PLAN (Interface TypeScript) DU COFFRE FORT !
type UserState = {
  id: number | null;
  name: string;
  email: string;
  roles: string[];
};

export const useUserStore = defineStore("user", {
  // JE FORCE QUE LE COFFRE FORT OBTEIENNENT EXACTEMENT L'INTERFACE TS DU PLAN DU HAUT ! (La MOindre Erreur Lève Un Exception Rouhe Bloquane Dev) !!
  state: (): UserState => ({
    id: null,
    name: "",
    email: "",
    roles: [],
  }),
});
```

## Le Livre Céleste

- [La State Officielle De Pinia](https://pinia.vuejs.org/core-concepts/state.html) — L'Essentiel sur la Mutabilité de la Data (State).

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
