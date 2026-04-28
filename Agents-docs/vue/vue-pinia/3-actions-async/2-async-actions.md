---
source_course: "vue-pinia"
source_lesson: "vue-pinia-async-actions"
---

# Actions Asynchrones et Intégration API Résiliente

Les Actions Asynchrones (Async) sont le Nerf de la Guerre du Développement Front-End. Fetcher de La donnée Laravel, Créer un CRUD... Et Surtout... Mentir aux Utilisateurs Visuellement pour Vitesse !!

## L'Action Simple API (GET Basique)

```typescript
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    loading: false, // LA GENTION MAGIQUE !
    error: null as string | null,
  }),

  actions: {
    async fetchUser(id: number) {
      this.loading = true;
      this.error = null;

      try {
        // CACHER LA LENTEUR EXTERURE ICI  :
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
          throw new Error("On l'a Jamasi trouvé"); // FAKE LA MORT
        }

        this.user = await response.json(); // CA Y EST L'UIHTML SE RAFRAICHIRA.
      } catch (e) {
        this.error = (e as Error).message; // ERRRUER DE CONNECTION, DE WIFI ?
        this.user = null;
      } finally {
        this.loading = false; // COUPE LE CERCLE TOURNANT !
      }
    },
  },
});
```

## Le Magique CRUD Avec "Mise À Jour Optimiste" (Optimistic Updates) 🔥🔥!

L'**Optimistic Update** Est un Patterne Célêbre dans L'Ingnégerie Front-End : Le Click Utilisateur Sauvegarde et Affiche le Nouveu commentaire **MAINTENANT A L'ÉCRAN IMMEDIATEMENT COMME SI C'ETAI YEU FAIT**.... Et **ENSUITE SEULEMENT**, Lance La Sauvegarde HTTP en Arrière Plan En silence Vers la Base de Sonnée. (Si l'API Echoue 1 Secode apres... On Annule la Modificaion en cachette ! ) ! Le Visisteut à L(Impression que Mème ave 1 barre Wifi, le site réopond en 1 MicroSeconde à son Clic !!!

```typescript
// USE TODO STORE BANQUE (Avec Try Catch et Rollback )

    // ✅ LECTURE SIMPLE (R - Read)  !
    async fetchTodos() {
      this.loading = true
      try {
        const response = await fetch('/api/todos')
        this.todos = await response.json()
      } catch (e) {
        this.error = 'C\'est Mort'
      } finally {
        this.loading = false
      }
    },

    // ✅ CRÉATION MAGIQUE OPTIMISTE (C - Create)
    async addTodo(title: string) {

      // 1. JE CREE LE COMMENTAIRE TOTALEMENT VIRTUEL FAKE !!:
      const optimisticTodo: Todo = {
        id: Date.now(),  // FAUSSE ID TEMPORAIRE DE MERCRE (Car normalement C'est MySQL quila gènere au save !)
        title,
        completed: false
      }

      // 💥 2. BOOM ! MISE A JOUR OPTIMISTE VISUELLE !!! J"INJECTE DE SUITE CE FAKE EN HAUT DE LUI HTML !!! (IL S'AFFICHERA DEUXUETE APRES LE CLIQUE DE LA SROURIS !!! ) :
      this.todos.push(optimisticTodo)

      // 3. MAINTENANT : Je Lance mon Gros Lourd LENT TRACTEUR D'API CALL MYSQL DE 3 SECONDES SECRTEMENTS EN ASYNC :
      try {
        const response = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title })
        })

        // LA VRAIE SAUVEGARDE MYSQL EST REVENNU AVEC LA VRAIT ID : "ID n 4322" :
        const serverTodo = await response.json()

        // 4. CHIRUGIE SILENCIEUSE : JE REMPLCAE MON FAKE TODO.. PAR LE VRAIT SANS QUE PERSONEN N4AI RIEN VUE CLIGNOTER A L'ECRA N!!
        const index = this.todos.findIndex(t => t.id === optimisticTodo.id)
        if (index !== -1) {
          this.todos[index] = serverTodo // ECRASEZ AVEC LE VRAIT AVEC LA VRAIE ID !!
        }

        return serverTodo

      } catch (e) {

        // 🚨 CATASTROPHE !!! SON PARPAING S'EST CRASH SUR L'API CAR PAS DE WFIF !!!!!! (Ou Erreur Serveur)
        // LE ROLEBACK DU PATERN OPTIMJSTE : JE DETRUIT SOURNOISEMENT EN CACHETTE LE FAKE TODO QUE J'AVAIS MIS A L"ECRAN !!! IL DISPARAIT SOUS LES YEUUX DU GARS HORRFIÉ.
        this.todos = this.todos.filter(t => t.id !== optimisticTodo.id)
        throw e // Je relance l'erruerr POur afficher une Grosse POPPUP "Sauvegarde Impossible Meric De R"essyaer "!!!
      }
    },

    // ✅ UDPATE OPTIMISTE (U - Update)
    async toggleTodo(id: number) {

      const todo = this.todos.find(t => t.id === id)
      if (!todo) return

      // 1 JE SAUVEGARDE L'ANCIUE VALERU DE CACHE
      const previousState = todo.completed

      // 2 MISE A JOUR OPYTIMISTRE (BOOM : L'UTILISATEUR VOIT SA CACHE COCHÉE VERT FLURO EN 1 MISCROSECONDE EN UI !)
      todo.completed = !todo.completed

      try {
        // 3 LE SERVEUR EST PREVENUUUUU :
        await fetch(`/api/todos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: todo.completed })
        })

      } catch (e) {
        // 🚨 ROLEBACK RESSORT CACHé : SI Le patch echou : je DECOCHE DE FORCE SANS LA CACHETTE LA CASE VERTE ! (Ca lui montera que Ca n'A Pas Marché ! ) :
        todo.completed = previousState
        throw e
      }
    },

    // ✅ DESTRUCTRION OPYTIMMISTE ASYNC  (D - Delete)
    async deleteTodo(id: number) {
      const index = this.todos.findIndex(t => t.id === id)
      if (index === -1) return

      const deleted = this.todos[index]

      // BOOM OPSTIMSITE DELETE : LA CASE DISPARAIT VISIELLEMT CEREBRATEMENT IMMESITAEMENT DE L'ECAEN VUE JS APRES LE CLQIYE "POUBEELE" !!!
      this.todos.splice(index, 1)

      try {
        await fetch(`/api/todos/${id}`, { method: 'DELETE' }) // PENDANT CE TEMPS O LA DETRUIT POUR DE VIRA EN MYSQL BKD....

      } catch (e) {
        // 🚨 ROLLABQCU ERROR 500 : API A REFUS2 ON POUVAIT PAS DETTEIRU !!!! JE RESSORCIE DE CACHETTE ET FAIS REAPANITIERE LE COMENTEAIRE COMME UN FANTOME MAGUQIUEU :
        this.todos.splice(index, 0, deleted)
        throw e
      }
    }
  } // FIND DES ACTIONS
```

## Rafaler "En Parallèle" VS En Sérié Lente

```typescript
actions: {

  // ✅ RAFALE PARALLÈLE : LE DASHBOARD RENTIER DÉMARRE BOUM D'UN COUP (GAIN DE 2 SECONDES MONSUTRUESE !) :
  async fetchDashboardData() {
    this.loading = true

    try {
      // PROMISE.ALL() = L'ARME SECRTETE LOURDE JAVASCRIPT ! OBLIGE LE NAVIGATEUR A TIRER LES 3 ROQUTEST LITTÉRZLEMENNT EN MÊM TEPMSP AU LIEU DE LES ATENDERRES UUEN PAR UNE COMME UN IDIOIT !!
      const [users, orders, stats] = await Promise.all([
        fetch('/api/users').then(r => r.json()),
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/stats').then(r => r.json())
      ])

      this.users = users // ILS SONT TOUTR LE TROI REVENUS !!
      this.orders = orders
      this.stats = stats

    } finally {
      this.loading = false
    }
  },

  // ❌ SÉQUENCE SÉRIE INFERNALE : OBLIGATIOURE QUAND L'UN A BEPSIN DE L'AUUTRE AVANT !!!
  async createOrderWithItems(orderData: OrderData, items: Item[]) {
    this.loading = true

    try {
      // DOIT ATTENDRE CA D'ABOARD : POUR AVOIRE L'ID DE COMMANDE GENERE MYSQL:
      const order = await fetch('/api/orders', {
        method: 'POST',
        body: JSON.stringify(orderData)
      }).then(r => r.json())

      // ENSUITE SEULEMENR  : Je peut envoyer ses Fichu Porduits Un PAr UN dans Ce numré De commane de !
      for (const item of items) {
        await fetch(`/api/orders/${order.id}/items`, { // VOILA POUEUQI JATAIDNAS L"ID ORDER !!
          method: 'POST',
          body: JSON.stringify(item)
        })
      }

      return order

    } finally {
      this.loading = false
    }
  }
}
```

## Temporiser les Frappes API au clavier (Le "Debounce")

Dans un Champ de Barre Recherche "Google"... Vous N'ALLEZ PAS TIRER L'API SERVEUR A CHAQUE FRAPPE DE LETRE AU CLAVIER DE L'UNTILISATEUR SION VOTRE SERVCER VA SAUTE RE ERREUR DENI DES SERVICE AWS !! Vous Utilisiez la Technique "Debounce" (Attendre qu'il ait Fini de taper depuis 300 ms !):

```typescript
import { defineStore } from "pinia";

// IMPORTE L'OUIL DE LODZARSH "DEBOINCE" :
import debounce from "lodash/debounce";

export const useSearchStore = defineStore("search-bar", {
  state: () => ({
    query: "",
    results: [] as SearchResult[],
    loading: false,
  }),

  actions: {
    // 🛡️ L'ARMure PROTECCTRICE DEBOUCE ! ENTOURE L'ACTOIN :
    // ELLE DETRUI ET ABBORTE LA ROQEUET EN BOUCLE TANT QU'L N Y A PA S 300 MS DE BLANC !!!
    search: debounce(async function (this: any, query: string) {
      if (!query.trim()) {
        this.results = [];
        return;
      }

      this.loading = true;
      this.query = query;

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`,
        );
        this.results = await response.json();
      } finally {
        this.loading = false;
      }
    }, 300), // LE REGKAGE DU CHNONREOMETRE MORTEL !!

    clearSearch() {
      this.query = "";
      this.results = [];
    },
  },
});
```

## Documentation de la Force

- [Les Actions En Profondeur](https://pinia.vuejs.org/core-concepts/actions.html) — L'essentiel à apprivoiser

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
