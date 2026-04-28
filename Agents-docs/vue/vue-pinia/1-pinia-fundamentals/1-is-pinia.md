---
source_course: "vue-pinia"
source_lesson: "vue-pinia-what-is-pinia"
---

# Qu'est-ce que Pinia ?

Pinia est L'Officielle Bibliothèque de "State Management" (Gestionnaire d'état) Globale et Mondiale pour Vue 3. Elle remplace et enterre l'ancien dinosaure Vuex en tant que solution officielle et recommandée, en offrant une API monstrueusement plus simple, intuitive et un support TypeScript absolu.

## Pourquoi utiliser Pinia ?

### Le Duel Pinia VS Vuex 4

| Fonctionnalité     | Pinia (L'Avenir)                       | Vuex 4 (Le Passé Obsolète)              |
| ------------------ | -------------------------------------- | --------------------------------------- |
| **Mutations**      | ❌ TERMINÉES ! Plus d'Enfers Mutations | ✅ Obligatoire (Complexe & Lourd)       |
| **Modules**        | ❌ Stores Plats Indépendants Uniques   | ✅ Arbres Gigantesques Imbriqués (Lent) |
| **TypeScript**     | ✅ Incroyable et Intégré 100% Natif.   | 🟡 Un enfer et un clavaire à paramétrer |
| Devtools Vue       | ✅ Support Total Merveilleux           | ✅ Supporté                             |
| **Poids (Bundle)** | Extrêmement Léger : ~1.5kb             | Lourd : ~10kb                           |
| Architecture Cible | Setup (V3) ET Options Api              | Uniquement la vieille Option (V2)       |

### Ses Pouvoirs Principaux (Bénéfices)

1. **Suppression des horribles "Mutations"** : Les Actions (Méthodes) ont enfin le pouvoir Absolu de Modifier les Variables d'états !
2. **Adieu les Sous-Modules géants lents** : Désormais chaque Store (Banque) Vit Seul à Plat, totalement importable et gérable un par un à la carte !
3. **TypeScript Natif** : L'Éditeur JS devinera et Auto-complétera TOUT le code tout seul, c'est Magique.
4. **Voyage Dans Le Temps** : Le DevTool Vue permet de remonter l'état de l'application dans le passé de 5 minutes visuellement !

## Quand avez-vous réellement BESOIN de Pinia ?

### ✅ Utilisez Pinia pour les Banques VITALES suivantes :

- Des Données / États d'UI qui DOIVENT IMPÉRATIVEMENT être **partagés entre 5 ou 15 `composants.vue` différents très éloignés !!**
- De La Donnée qui DOIT impérativement survivre, (Même SI la page ou le Composant meurt ou est démontée à l'écran) !!
- Gérer Le Panier E-Commerce Amazon D'Acheteur.
- Gérer Des Données Caches d'API Lourdes (Éviter de refaire 5x fois la requête AXIOS).
- Gérer La Boite Noire d'Authentification : "L'Utilisateur est Logué / Il s'appelle Michel / Son ID de base de Donnée Centrale" !

### ❌ Ne SUR-Utilisez PAS Pinia pour :

- Si la variable ne concerne QUE LA SEULE Page actuelle de ce pauvre composant ? (👉 Utilisez De simples `ref()` !!)
- SI on veut envoyer une pauvre Ligne De texte Du Bouton Fils au Parent Juste au Dessus ? (👉 Utiliser `props/emits` !!)

## Armement Et Installation (Par le Terminal Node)

```bash
npm install pinia
# ou
yarn add pinia
```

## Le Montage Global Dans Main.js

```typescript
// main.ts
import { createApp } from "vue";
import { createPinia } from "pinia"; // 1. L'URNE MONDIALE PINIA
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia(); // 2. ALLOCATION MEMOIRE RAM PINPIA !

app.use(pinia); // 3. INJECTION DANS LE MOTEUR NUCLEAIRE VUE
app.mount("#app");
```

## Graver sa Première Banque Céleste : Le Store 🏦

_Ici illustré dans la vieille structure Option API pour les nostalgiques (Dernière fois abordé) :_

```typescript
// FICHIER : stores/counter.ts
import { defineStore } from "pinia"; // L'OUTIL DE FRAPPAGE !

// Règle D'Or : TOUJOURS "useXXXStore" -> export const useCounterStore !!
export const useCounterStore = defineStore("counter-unique", {
  // 1️⃣ STATE : LA DONNÉE (LA VALISE !)
  state: () => ({
    count: 0,
    name: "Mon Super Compteur De Base",
  }),

  // 2️⃣ GETTERS : LES CALCULATRICES DÉDIÉES (Computed)
  getters: {
    doubleCount: (state) => state.count * 2,
  },

  // 3️⃣ ACTIONS : LES BOUTONS BOURRINS (Modifieurs De Valise Mutateur !)
  actions: {
    increment() {
      // ⚠️ PLUS BESOIN DE MUTATIONS ! LES ACTIONS PEUVENT LITTÉRALEMENT CHNAGER LE STATE TOUTE SEULES COMME DES GRANDES !!
      this.count++;
    },
    decrement() {
      this.count--;
    },
  },
});
```

## Dépenser L'Argent De La Banque ! (Récupérer L'État Côté HTML ! )

```vue
<!-- PAGE Bateau.vue -->
<script setup>
// BOUM ! J'IMPORTE JUSRTE LA FONCTION CONSTRUITE EN HAUT DEPUIS MON IMPORT GLOBALE :
import { useCounterStore } from "@/stores/counter";

// J'EXECUTE !! (BIM ! LA BANQUE TOTALE MONDIALE ARRIVE ENTIÈRE EN CACHE MEMOIRE DANS CETTE VARAIABLE !! )
const MABANQUE = useCounterStore();
</script>

<template>
  <div class="ui-panel">
    <!-- JE LIS LA BANQUE EN DIRECT !! (Totalement reactif aux Modifs des autres pages !! ) -->
    <p>Le Nom : {{ MABANQUE.name }}</p>
    <p>Le Solde Secret : {{ MABANQUE.count }}</p>

    <!-- JE LIS LA CALCULETTE MAISON ! -->
    <p>Solde Double : {{ MABANQUE.doubleCount }}</p>

    <!-- JE LANCE LES BOUTONS BOURRINS DE BOMBARMENT BANCAIRE !!  -->
    <button @click="MABANQUE.increment" class="bg-black text-white p-4">
      Ajouter 1 Milliard !!
    </button>
  </div>
</template>
```

## Les Lois Militaires Universelles : "Conventions De Nommage" !

Vous DEVEZ respecter les Ordres : Le Non du Store DOIT TOUJOURS Écrire `use` en Premier , et `Store` à la fin !!

```typescript
// ✅ MAGNIFIQUE 10/10
const useUserStore = ...
const useCartStore = ...
const useAuthStore = ...
const useNotificationStore = ...

// ❌ AFFREUX ET REFUSÉ EN PULL REQUEST :
const user = ...
const cartStore = ...
const Auth = ...
```

## L'Architecture Arborescente Cible

```text
src/
├── stores/                #  LE GROS DOSSIER SECRET EN FER PLATÉ DE TOUTES LES BANQUE :
│   ├── index.ts           #  (Optionel: Exporteur Géant Global)
│   ├── useUserStore.ts    # Toute la boite Noir du Login Utilisateur / Token JWT !
│   ├── useCartStore.ts    # L'Achat E-Comerce !
│   ├── useProductStore.ts # Cache API des Produits Lourdes du Catalogue !
│   └── useUiStore.ts      # Menu Latéral Ouvert ? Le site est-il en Theme Noir `isDarkMode` ?
```

## Extrème Ressource d'Apprentissage

- [Pinia Documentation Officielle](https://pinia.vuejs.org/) — La Bible Sacrée de l'Ananas Jaune (Pinia).

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
