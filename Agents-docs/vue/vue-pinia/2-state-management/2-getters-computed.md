---
source_course: "vue-pinia"
source_lesson: "vue-pinia-getters-computed"
---

# Les Getters et L'État Calculé Automatique (Computed)

Les Getters de Pinia sont vos ouvriers mathématiciens Personnels : Ils lisent Les Donnés d'État `State` Normales... Et Utilisent ces Ingrédients pour Fabriquer et Cuisiner Un Gâteau Final (`Computed`) Merveilleux qui sera servi tout Prêt Aux Pages Visuels Html SANS Que la Page Html n'ait rien à faire ! (Exemple: Compter De Montant Total Du Panier ). Ils ont une memoire infinie Cachée.

## Créer les Getters

### En Vieux Style "Options"

```typescript
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart-amazon", {
  state: () => ({
    // LE FRIGO INGREIDENTS:
    items: [] as CartItem[],
    taxRate: 0.2, // 20 % TVA Macron
  }),

  getters: {
    // LES CUISINERS MACHINES :

    // Ouvrier 1 :  Me Compte just combien on a d''Articles
    itemCount: (state) => state.items.length,

    // Ouvrier 2 : Le Mathematician. II Somme Tout pour Donner Le Prix HT Total Complet !
    subtotal: (state) =>
      state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),

    // Ouvrier 3 (L'Inspecteurs des Impôts). Note: Comme il appelle l'Houvrier 2 DANS LA FONCTITON (`this.subtotal`), IL DOIT ETRE ECRTIT SANS ARROWS FAT "()" POUR AVOIR ACCES A "THIS.", ET DEFOIT DEFINIER DE FORCE SON RETOUT : NUMBER :
    tax(): number {
      return this.subtotal * this.taxRate;
    },

    // Ouvrard 4 (Le Caissieur FInal)
    total(): number {
      return this.subtotal + this.tax;
    },

    // OUVRIER 5 : LA MATRICE (Une Fonction qui Crache Une Autre Fonction !). CA SERT A PASSER UN PARAMETRZE () EXETRNE HTML POUR FOUILLER AU DELA !
    getItemById: (state) => {
      // Return Une Fonction ArrayFind Interne !
      return (id: number) => state.items.find((item) => item.id === id);
    },
  },
});
```

### Le Merveilleux Mode Moderne Setup

C'est simple : CE NEST QUE DES `computed() ` NATIVES VUE ! Point !!

```typescript
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", () => {
  // LES INGREDIENTS : (Simples Refs !!)
  const items = ref<CartItem[]>([]);
  const taxRate = ref(0.2);

  // LES OUVRIERS MATHEMATICIENS : (De Bonness Vielles Computed() pures Vue JS Normales !)
  const itemCount = computed(() => items.value.length);

  const subtotal = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
  );
  const tax = computed(() => subtotal.value * taxRate.value);
  const total = computed(() => subtotal.value + tax.value); // BOOM ! Je lit Les 2 Variable Calucue D'en Haut D'Un Coups Facilement !!!

  // L'Ouvrier Chercheur à Paramètre : (Une Fonction Native Ultra Basique Sans Artifices !!!)
  function getItemById(id: number) {
    return items.value.find((item) => item.id === id);
  }

  // ON RETOURNE TOUT CA AU MONDE EXTÉRIEUR
  return {
    items,
    taxRate,
    itemCount,
    subtotal,
    tax,
    total,
    getItemById,
  };
});
```

## L'Ingénierie Interbancaire : Appeler Une Banque Dans Une Autre !

Une Puissance Redoutable De Pinia : Son Inbrication. Et si Notre Caddy Amazon Avait Besoin de Connaitre S'il Le Profil D'A côté de mon Compte à Cocher La Case "Abonnement VIP Premium" Pour Calvuler Les Fais de ports ?! :

```typescript
import { defineStore } from "pinia";

import { useUserStore } from "./user"; // 1. OUI ! C'EST LÉGAL !  J'IMPORTE LA BANQUE EXTERNE DU COMPTE  !

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    discountedTotal(): number {
      const BANQUE_VOISINE = useUserStore(); // 2. JE L'INITIALISE DIRECTEMENT A L'INTERIUR DE L'OUVRIER !!

      const discount = BANQUE_VOISINE.isPremium ? 0.3 : 0; // 3. LE GARS AVAIT IL SON LABEL VIP COMPTET ? SI OUI 30% DE REMISES DE OUF !!!

      return this.total * (1 - discount); // La Magie Opère. Si Le Store User Est Modifié (Annulation VIP d'Abbonement.. Le Pris Du Pagnier Changera Instantaénnément MAGIYQUEMENT EN HAUT SUR L'APP.VUE !)
    },
  },
});
```

## Les Getters À Paramètres (Ce Qu'Il Faut Eviter)

Nous l'avions vu Au-dessus, Un Getter Ne peux Pas Recevoir D'Argument direct, c'est ce que VUE Moteur Oublige. Ils doivent Lâcher (Returner) Une autre fonction :

```typescript
// (...)
getters: {
  // UN GETTER NORMAL : getByCategory(state, L'ARGUMENT CATEGORX ICI NE MARCHE PAS  !!)

  // LA FEINTE DE  SIOUX :
  getByCategory: (state) => {
    return (
      category: string, // LUI PEUT RECEVOIR LA PARMETRER POUR FILTRER !!!
    ) => state.products.filter((p) => p.category === category);
  };
}
// UTILISABLE DEPOUIS HML :     const ecrans = MABANQUE.getByCategory('ecrans-plat')
```

**🚨 HORREUR DE PERFORMANCE** : Pinia Est Formel : Les Getters à Paramètre **NE METTENT PAS EN CACHE MEMOIRE LEUR RESUTAT !!!!**. Ils referons le code LOUDS MATEMATIQUES EN BOUCLE DE OUF EN RAM 500x Fois S'Ils Sont Appellées Pâr le DOm !! _Utiliser des Vrais Actions Natives pour Ca Si possible !_

## Le Mystère du Caching Getters Standard (Super Vitesse)

```typescript
getters: {
  // ✅ EN CACHE EXTRÈME : Cette Méthode NE S'AFFICHÉRA ET NE CALCULÉRA QU'UNE SEULE E UMIQUE FOIS LE NOMNRE D'ARTCILE ! MEME SI VOUS L'APPELLEZ 10 000 FOIS SUR L'APP.VUE HTML, IL NE REFERA PLUS JAMAIS LE CALCUL TANT QU'UN ARTICLE N'A PAS ETE AJOUTER PHYSIQUEENT ! C'EST L'OR DES COMPUTED PROPERTIES !!!
  itemCount: (state) => {
    console.log('Je Calcule Lourdemet Et Fatigué ! ....')
    return state.items.length
  },

  // ❌ LE GAUFFRE LENTE (Pas De cache !) : Une Vraie Fonction à Paramètre C'Est un Enfert Cérébral. Il refera le Calcul Bêtement de FOrce a Chageu fois !!
  getExpensiveItems: (state) => (minPrice: number) => {
    console.log('Je Refiltre Encore Encore Encore Mon Tableu 1 Million de Fois ... !!')
    return state.items.filter(i => i.price > minPrice)
  }
}
```

## L'Atelier Du Génie : Un Dashboard Lourd En Temps Réel

On utilise toute La puissance Pinia pour regrouper un Affichage Analytics De Data Google. On Va Fabriquer un Entonoir Getter Complexe qui utilise la Méthode `.reduce` Javascript !!

```typescript
export const useAnalyticsStore = defineStore("analytics-google", {
  state: () => ({
    // LE TABLEAU CRADE BRUT VENANT DE L'API BASE DONNEE !
    orders: [] as Order[],
  }),

  getters: {
    // Ouvrier 1 : ON CLASSE LES MILLIERS BRUTES EN GROUPES CLASSÉ MENSUELEMENT ! (reduce array) !
    ordersByMonth(): Record<string, Order[]> {
      return this.orders.reduce(
        (acc, order) => {
          const month = order.date.toISOString().slice(0, 7);
          if (!acc[month]) acc[month] = [];
          acc[month].push(order);
          return acc;
        },
        {} as Record<string, Order[]>,
      );
    },

    // Ouvrier 2 : ON LI LE GROUP MENSUEL DE L"OUVRIER 1... POUR FAIRE LA SOMME D'ARGENR GAGNÉ POUR CE SPECIFQIYE MOIS DE MERDE !
    monthlyTotals(): Record<string, number> {
      const result: Record<string, number> = {};
      for (const [month, orders] of Object.entries(this.ordersByMonth)) {
        result[month] = orders.reduce((sum, o) => sum + o.total, 0);
      }
      return result;
    },

    // L'OUVRIER ROI (3) : ON PREND L"OUVRIER 2 QUI A TOIT COMPTÉ, POUR FAIRE UN PODIUM DU MOUILLOEUR MOIS ABSOLU !!!
    bestMonth(): { month: string; total: number } | null {
      const entries = Object.entries(this.monthlyTotals);
      if (entries.length === 0) return null;

      return entries.reduce(
        (best, [month, total]) =>
          total > best.total ? { month, total } : best,
        { month: "", total: 0 },
      );
    },
  },
});
// AU FNAL DANS HTML : Le Visieur Na qu'A Taper "BANQUEGOOGLE.bestMonth" et le Tour a êté fait Par 3 Ouvriers  qui ont travaill"s en Chaine sans Lag !
```

## Magnifica Documentation

- [Les Getters Pinia](https://pinia.vuejs.org/core-concepts/getters.html) — L'Official Documentation De l'Etat Calculé.

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
