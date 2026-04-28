---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-composables-patterns"
---

# Conception et Modèles de Composables Avancés

Explorons des modèles de conception puissants (Design Patterns) pour créer des composables robustes, dignes de productions professionnelles.

## Composables Asynchrones avec useFetch

Le pattern roi par excellence pour requêter proprement vos APIs :

```typescript
import { ref, unref, watchEffect, type Ref } from "vue";

// L'astuce majeure TypeScript : Accepter soit du texte pur, soit une Variable Déjà Réactive !
type MaybeRef<T> = T | Ref<T>;

export function useFetch<T>(url: MaybeRef<string>) {
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  async function execute() {
    data.value = null;
    error.value = null;
    loading.value = true;

    try {
      // unref() magique : déballe la valeur si c'est un 'ref', ou la retourne telle quelle si c'est déjà un string pur !
      const response = await fetch(unref(url));
      if (!response.ok) {
        throw new Error(`Erreur HTTP réseau ${response.status}`);
      }
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  // L'Auto-Fetch magique caché : Se relancera à chaque fois que l'URL d'entrée changera publiquement !
  watchEffect(() => {
    execute();
  });

  return {
    data,
    error,
    loading,
    refetch: execute, // On donne aussi à l'utilisateur dans l'UI web un moyen explicite de forcer Manuellement l'appel !
  };
}
```

```vue
<!-- Énorme Utilisation Ultra Propre en .vue -->
<script setup>
import { ref, computed } from "vue";
import { useFetch } from "./useFetch";

const userId = ref(1);
// L'URL devient Réactive grâce à la dérivée Computed !
const url = computed(() => `/api/users/${userId.value}`);

// La requête FETCH se refera magiquement O-TO-MA-TIQUE-MENT dès que userId visuel changera !!! Magique !
const { data: user, loading, error, refetch } = useFetch(url);
</script>
```

## Le Puissant Pattern Incontournable `MaybeRef`

Ce pattern absolu est devenu fondamental pour que vos fonctions utilitaires composables acceptent tout type de format sans crasher !

```typescript
import { ref, unref, computed, type MaybeRef } from "vue";

export function useTitle(title: MaybeRef<string>) {
  // L'ingénierie qui marche dans TOUS les cas grâce à unref()
  const titleRef = computed(() => unref(title));

  watchEffect(() => {
    document.title = titleRef.value;
  });

  return titleRef;
}

// === L'Utilisation Totale Flexible : Tout cela fonctionne très bien pour nos clients ! ===
useTitle("Titre Statique Figé"); // Juste un String littéral fixe passé : Fonctionne.
useTitle(ref("Un Titre en Ref dynamique")); // Une grosse Reactive ref complète de setup : Fonctionne !
useTitle(computed(() => `Page Web ${count.value}`)); // Une Computed property complexe entière : Fonctionne par magie !
```

## Le Pattern de "Retour API Flexible"

Une très bonne architecture Composable doit s'adapter intelligemment à la paresse de ses développeurs appelants :

```typescript
export function useCounter(initial = 0) {
  const count = ref(initial);

  function increment() {
    count.value++;
  }
  function decrement() {
    count.value--;
  }
  function reset() {
    count.value = initial;
  }

  // La Convention D'OR : Renvoyez TOUJOURS un objet destructurable en Composables Vue, presque jamais un Array JS figé (contrairement à React Native) !
  return {
    count,
    increment,
    decrement,
    reset,
  };
}

// Mode 1: L'Utilisateur Feignant qui ne veut que le simple nombre pour affichage pur UI :
const { count } = useCounter();

// Mode 2 : L'Utilisateur Avancé qui désire tout l'outillage complet complexe dispo encapsulé pour le manier librement :
const counterAPI = useCounter();
counterAPI.increment();
```

## Des Composables Flexibles Configurables avec des Objets `(options)`

Comme absolument toutes les bibliothèques pro, ajoutez toujours un deuxième argument avec bloc objet d'options global pour moduler avec élégance les super-pouvoirs avancées de votre composable secret !

```typescript
type UseFetchOptions<T> = {
  immediate?: boolean; // Lancer la logique direct au mount html ?
  initialData?: T; // Données de remplacement bidons pures
  refetchOnWindowFocus?: boolean; // Gros système Pro : Tenter de rafraichir si le visiteur revient d'un autre onglet PC Chrome ?
  transform?: (data: unknown) => T; // Moulinette pure JS interne
  onError?: (error: Error) => void;
};

export function useFetch<T>(
  url: MaybeRef<string>,
  // Argument OBTIONNEL et totalement Vide par défaut !
  options: UseFetchOptions<T> = {},
) {
  // Déstructuration pure object JS puissante à impérativement maitriser par cœur !! (Injecter vos Defaults JS via le symbole d’égalité "=" !! )
  const {
    immediate = true,
    initialData = null,
    refetchOnWindowFocus = false,
    transform = (d) => d as T,
    onError,
  } = options;

  const data = ref<T | null>(initialData);
  const error = ref<Error | null>(null);
  const loading = ref(false);

  async function execute() {
    loading.value = true;
    try {
      const response = await fetch(unref(url));
      data.value = transform(await response.json()); // La passoire d'exécution
    } catch (e) {
      error.value = e as Error;
      onError?.(error.value);
    } finally {
      loading.value = false;
    }
  }

  // Exécution d'Option 1 :
  if (immediate) {
    execute();
  }

  // Utilisation majestueuse d'Option super Pro et complexes branchées au Cycle Vie Vue Natifs en sous sols  :
  if (refetchOnWindowFocus) {
    onMounted(() => {
      window.addEventListener("focus", execute);
    });
    onUnmounted(() => {
      window.removeEventListener("focus", execute);
    });
  }

  return { data, error, loading, execute };
}
```

## Pattern Ultime Architectural : La "Type State Machine" (Machine Imperturbable à États Finis TS)

Cruez des composables architecturaux de pointe pour éradiquer en entreprise les horribles conflits boooléens manuels complexes des développeurs (Éviter le classique cauchemar UI impossible du composant coincé en mode "loading" = `vrai` qui en même temps a son erreur "error" bloqué à `true` !)

```typescript
import { ref, computed } from "vue";

// L'État Textuel Pur Strictement Infaillible ! (Impossible d'être DEUX à la fois)
type State = "idle" | "loading" | "success" | "error";

export function useAsyncState<T>() {
  // L'Unique et absolue seule grande source de vérité gérable textuellement :
  const state = ref<State>("idle");

  // Les simples variables inertes :
  const data = ref<T | null>(null);
  const error = ref<Error | null>(null);

  // Toute La belle magie d'abstraction par dérivation de variables pour l'UX HTML visuelle :
  const isIdle = computed(() => state.value === "idle");
  const isLoading = computed(() => state.value === "loading");
  const isSuccess = computed(() => state.value === "success");
  const isError = computed(() => state.value === "error");

  async function execute(promise: Promise<T>) {
    // 1 Seul État maitre à tout moment T !
    state.value = "loading";
    error.value = null;

    try {
      data.value = await promise;
      state.value = "success";
      return data.value;
    } catch (e) {
      error.value = e as Error;
      state.value = "error"; // Sécurité Infaillible et verrouillée pour l'HTML !!
      throw e;
    }
  }

  //... Les autres fonctions reset... etc.

  return {
    state,
    data,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    execute,
  };
}
```

## Le Secret Industriel Absolu : Le "Composables à État Partagé" (Store / Singleton)

Si on a la superbe intelligence subtile code de tout simplement déclarer publiquement une banale variable de fichier JS un tout petit peu _plus en HAUT en dehors_ du crochet global logique de la grande fonction composable... magie absolue incroyable... :

```typescript
import { ref } from "vue";

// ATTENTION: La data est définit TOTALEMENT et librement à l'exterieur brut du root de notre sublime fonction exportée d'après !
// En base JS pure, elle devient magiquement et du coup strictement "GLOBALE et UNIQUE". (Partagée par toute la mémoire totale du navigateur client en permanence une seule unique fois !)
const globalCount = ref(0);

export function useSharedCounter() {
  function increment() {
    globalCount.value++;
  }

  return {
    count: globalCount, // Le pointeur partagé
    increment,
  };
}

// Conclusion Incroyable de puissance : Absolument TOUS les futurs composants `.vue` frontaux massifs peu importe leur profondeur UI qui feront appels à un innocent `useSharedCounter()` ... partageront au final toujours très mystiquement entre-eux le MÊME GRAND "globalCount" réactif !! C'est la base de conception exacte du framework "Pinia" (Le Store Vue) !!
```

### Variante Complexe : La Superbe Initialisation Paresseuse Partagée ("Lazy Singletons initialization")

Idéal sur des web apps d'entreprise majeurs pour la grande performance si la donnée requise serveur partagée par beaucoup (Le Profil user) est trop lourde pour être appelée en vain ou pour rien. (Ne sera lancé qu'absolument au 1er composant réel demandant) :

```typescript
import { ref, type Ref } from "vue";

// Vierge en attente !
let sharedState: Ref<User | null> | null = null;

export function useCurrentUser() {
  // L'Architecture "Lazy" (Le faignant): On rempli le compte Global de profil QU'À LA TOUTE PREMIÈRE réelle exécution d'appel UI vue !
  if (!sharedState) {
    // Si totalement vide..
    sharedState = ref(null);

    // Le lourd appel asynchrone complexe très distant réseau serveur est enfin lancé mais pour la seule et ultime fois !
    fetchCurrentUser().then((user) => {
      sharedState!.value = user;
    });
  }

  return sharedState;
}
```

## La Bible pour conclure sa Maitrise : VueUse !

Sur Vue il existe un commandement très strict pro en or: Ne le développez surtout pas à la main si VueUse y a déjà pensé pour vous avec pureté ! ...

- [VueUse Absolu: La Librairie Ultime Mondiale de Composables magiques](https://vueuse.org/) — L'Immense et géniale très complète collection en livrets de TOUS les Modèles Composables du Web front end pures robustes et existants, le tous parfaitement prêts à l'import pur web et d'usage de la souris ou de l'UX ! Indispensable de chez indispensable !

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
