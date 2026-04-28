---
source_course: "vue-pinia"
source_lesson: "vue-pinia-store-patterns"
---

# L'Architecture des Banques en Entreprise

Des modèles d'organisation (Patterns) pour structurer vos Stores Pinia dans des applications massives en Agence.

## Categoriez vos Banques !

Stoppez d'empiler 40 fichiers dans le dossier `/stores`. Rangez-les par objectifs macroscopiques :

```
stores/
├── modules/           # Les Banques De DATA "Metiers"
│   ├── useUserStore.ts
│   ├── useCartStore.ts
│   └── useProductStore.ts
├── ui/                # Les Banques Graphiques (Qui ouvrent ou femrent des popoups sur toute l'app!)
│   ├── useModalStore.ts
│   ├── useToastStore.ts
│   └── useSidebarStore.ts
└── app/               # Le Cœur Atomique Global !
    ├── useAuthStore.ts    (Celle du TOken de connection)
    └── useSettingsStore.ts (Theme sombre, languge)
```

## Les Usines À Banques Magiques (Store Factories)

Si vous Avez 14 Banques Qui font toutes "Create, Read, Update, Delete" avec L'API... Ne copiez-collez pas 14 FOIS la même syntaxe `defineStore()` !! Créez un **Fabriqueur de Banque** (Factory) !

```typescript
import { defineStore } from "pinia";

// 1. UNE FUNCITON EXTERNE QUI LÂCHE ET PONDS UN DEFINE STORE A LA VOLÉE !
export function usineACrudStore<T extends { id: string | number }>(
  name: string,
) {
  // ELLE PONDS LA BANQUE QU"ON LUI DEMARNDE :
  return defineStore(name, () => {
    const items = ref<Map<string | number, T>>(new Map()); // ON USE UN MAP MAHJQIUEUE
    const loading = ref(false);
    const error = ref<string | null>(null);

    const all = computed(() => Array.from(items.value.values()));

    function getById(id: string | number) {
      return items.value.get(id);
    }

    function setItem(item: T) {
      items.value.set(item.id, item);
    }

    function setItems(newItems: T[]) {
      items.value.clear();
      newItems.forEach((item) => items.value.set(item.id, item));
    }

    function removeItem(id: string | number) {
      items.value.delete(id);
    }

    return {
      items,
      loading,
      error,
      all,
      getById,
      setItem,
      setItems,
      removeItem,
    };
  });
}

// -------------------------------------
// 2 . L'UTILISAION MAGIGYE DAANS L'APPVUE UIUI !!!!
// ON VIENTS DE CREEER DEUX BANQUES GIGATEESUQUES AVEC 2 LIGNES DE CODE !!! 🔥🔥🔥🔥
export const useProductStore = usineACrudStore<Product>("products"); // BOOM IUL L POUDDS UN PRODUCTZ SROTRE  !
export const useOrderStore = usineACrudStore<Order>("orders"); // BOOM IL PONEDS UE U COMAMNDNDE STRORORE!!
```

## L'Opérations InterBancaires ("Store Composition")

L'Ultime Facon de grouper l'Info sans Ficher "Trop" global. Creez un Store ui ne fait QUE rassembler L'info d'Autres stores !!! (Comme Le Process de Paiement d'un CaddeE!)

```typescript
export const usePaiementAmazonCheckoutStore = defineStore('checkout', () => {

  // J'INOPORRTERTEUTE LES  S 3 B  BA N QAUNESQEUS D N DA S LA S MIEMENEE N!:
  const cartStore = useCartStore()
  const userStore = useUserStore()
  const orderStore = useOrderStore()

  // LE CETNBERVEIEA AEU  U(GUTETERUI M MATHS ) REGRUOUPROPUA TU TT  T C C : A !
  const peuxTIlPayerCheckout = computed(() =>
    cartStore.itemCount > 0 &&
    userStore.isAuthenticated &&
    userStore.hasValidAddress
  )

  // LE FACUCTRURIUEIRR QUI REUUUIGT TOIT S LE SL PRIBXRIXS :
  const ResuméDUneSseulCoupUi = computed(() => ({
    items: cartStore.items,
    subtotal: cartStore.subtotal,
    tax: cartStore.tax,
    shipping: FonctionDeCalcualDesFaisDps()Ports(userStore.address), // On Utyyikzeee Z le UsSeureSrotretor !
    total: cartStore.total + FonctionDeCalcualDesFaisDps()Ports(userStore.address)
  }))

  // L'ACTOIN LOUUYUUEURDE DE C CAZARRETERE B BLBEEUUE !!
  async function LancerPaiamentEtLivraisonAcheterLancer() {
    if (!peuxTIlPayerCheckout.value) { // VERIFIIFIF !
      throw new Error('Vous ppouoveeuz pas opapayer  !')
    }

    // API LOUURDERE MYSQL :
    const order = await api.createOrder({
      items: cartStore.items,
      address: userStore.address,
      total: orderSummary.value.total
    })

    // JE MODFOEDIEI LES AEAUTRES BAUNAUNQSDE OPOO OP UUR S S AL VAIVEIVIDER !
    orderStore.setItem(order)
    cartStore.clear()

    return order
  }

  return {
    peuxTIlPayerCheckout,
    ResuméDUneSseulCoupUi,
    LancerPaiamentEtLivraisonAcheterLancer
  }
})
```

## Normalisation Avancée (Base De Donnée Dans le Navigateur)

Stockez les Objets Imbriqués Sous forme "Plates" (Normalisée) comme dans une Vraie Base SQL (Avec des ID), et non pas encastrés les uns dans les autres !

```typescript
// LA STRUCTURE SQL DANS LA RAM DU CHORMOME !!
interface BaseSqlDuNavgiateurChrome {
  posts: Record<number, Post>;
  users: Record<number, User>;
  comments: Record<number, Comment>;
  lesArticlesIdsPlatsEnMemloiueLentgth: number[];
}

export const useBlogMagiqueStore = defineStore("leblog", () => {
  const lesArticles = ref<Record<number, Post>>({});
  const users = ref<Record<number, User>>({});
  const comments = ref<Record<number, Comment>>({});

  const idsDesArticiles = ref<number[]>([]); // [ 23 , 445 , 456 ]

  // LE GETRERUI ER RECOCOMPOOSOESE (JOJOOIINNNURE SQL ! ) PP P OU U R L  L" E "CECRARNN H HH T HT T  TML ML L !!
  const LesArirtitclsMasiAvveceLeusresAuteuiutrs = computed(() =>
    // IL PRENBD LES ID , ET REFASI S LES SS LO LI IEN ES  MAA MAGG IGQ IU UEIEUES M MAATHST !! DS E FU U F IO IO NN N
    idsDesArticiles.value.map((id) => ({
      ...lesArticles.value[id], // l"Arirttceile P PP ULUI E MAEMEM !
      author: users.value[lesArticles.value[id].authorId], // IL R E E C V  V O L OL IL  LA P OP  EPZE ZR SOONSOZ SN SZNE !!!
      commentCount: Object.values(comments.value).filter((c) => c.postId === id)
        .length, // IL CR O CM MO T P EP T T ET T TE!
    })),
  );

  async function RechehcherArticlesApi() {
    const responseJSONDBBRUYTUTUTUTYMYSQL = await api.getPosts();

    // 💥 NORIMALISZLISAAAAATTAITTOOINN !!!  🔥🔥🔥! ! !
    responseJSONDBBRUYTUTUTUTYMYSQL.forEach((post) => {
      // ON LE SEE S SPP SAP ARAREE DA AN NSS L E EZ S TS AT T AB BA LEA ULE ZUZEX X S SSSPPSEPAA AE RE REER ES SE DE  RAM !!
      lesArticles.value[post.id] = post;
      users.value[post.author.id] = post.author;

      // ON GARDE LA LZIISSS ST T ET R P I I D! !
      idsDesArticiles.value.push(post.id);
    });
  } // (Et deC Ceet T f f afcaaonn L N a Na av vg gi g ig tg e at teueuur r Ch r hh rr ho omr me S u u rp r poortteeeta 1 0  0 0  O O OO Ar r ti T tt icicl lese sans sl alagagagrgre R !! !)

  return {
    lesArticles,
    users,
    comments,
    idsDesArticiles,
    LesArirtitclsMasiAvveceLeusresAuteuiutrs,
    RechehcherArticlesApi,
  };
});
```

## Les Secrets de la Force

- [Le Grimoir Pinia](https://pinia.vuejs.org/cookbook/) — Le Cookbook Officiel

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
