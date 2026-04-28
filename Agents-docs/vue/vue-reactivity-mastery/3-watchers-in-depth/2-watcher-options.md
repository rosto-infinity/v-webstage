---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-watcher-options"
---

# Les Options Moteurs des Watchers et Modèles Architecturaux (Patterns)

Explorons la vaste gamme d'options avancées de l'usine à Gaz des watchers pour des scénarios du monde réel exigeants.

## L'Armurerie des Options d'un Watcher

### `immediate: true` : Le Déclenchement au Démarrage T0

Par défaut cru, un espion watch() attendra toujours paresseusement le tout _premier_ vrai changement de sa cible pour s'exécuter.

```typescript
const userId = ref(1);

// Comportement Paresseux Standard  (Sans immediate)
watch(userId, (id) => {
  fetchUser(id);
});
// Le pauvre User 1 n'est virtuellement JAMAIS chargé au boot de la page ! Le code attend qu'on clique sur "User 2" pour récupérer la data 2.

// Comportement Agressif (Avec immediate)
watch(
  userId,
  (id) => {
    fetchUser(id);
  },
  { immediate: true }, // FORCE l'exécution instantanée a la seconde où Vue exécute ce code la 1ère fois !!
);
// Le User 1 est merveilleusement "Fettché" instantanément au démarrage ! Puis relancé à chaque futur changement. (Exactement comme si vous aviez couplé un onMounted + un Watch).
```

### `deep: true` : Surveillance Haute-Profondeur d'Objets Complexes

```typescript
const user = ref({
  profile: {
    name: "Alice",
    settings: {
      theme: "dark",
    },
  },
});

// Espion De Surface : (Le comportement standard). Ne déclenchera QUE si vous remplacez TOUT L'OBJET GLOBAL user.value !!
watch(user, () => {
  console.log("User Entier Écrasé");
});

// Espion Sur-Profond: (Avec deep) Fouillera frénétiquement en temps réel le moindre paramètre caché à des kilomètres de profondeur !!
watch(
  user,
  () => {
    console.log(
      "Un Micro Paramètre Inconnu enfoui au fond de l'objet à été touché !",
    );
  },
  { deep: true },
);

user.value.profile.settings.theme = "light"; // Déclenche instantanément l'Espion Sur-Profond grâce au deep: true !
```

**⚠️ Règle Moteur d'Or JS** : Un pur objet créé via `reactive()` rend AUTOMATIQUEMENT son propre "watch" en mode Sur-Profond `deep: true` implicite natif :

```typescript
const state = reactive({ nested: { value: 1 } });

// Mystiquement Profond par défaut nativement
watch(state, () => {
  console.log("State a muté !");
});

state.nested.value = 2; // Déclenche direct !!
```

### `once: true` : Le Fusil à Un Coup (Vue 3.4+)

```typescript
watch(
  source,
  (value) => {
    // Cette fonction ne s'exécutera QU'UNE et UNIQUE fois dans toute la vie de la page (Dès le Premier changement !), puis le watcher se SUICIDERA définitivement tout seul juste après ! Super pour les performances !
    initializeWithValue(value);
  },
  { once: true },
);
```

## Les Designs Patterns Pratiques Mondiaux

### L’Algorithme d'Absorbeur de Chocs "Debounce" (Moteur de Recherche)

C'est LE motif de base pour ne pas DDOS (Tuer) votre propre serveurs API quand un dev tape des lettres frénétiquement au clavier :

```typescript
import { ref, watch } from "vue";

const searchQuery = ref("");
const results = ref([]);
const isSearching = ref(false);

// La Mémoire minuterie (Tireur Fantôme JS)
let debounceTimer: number | null = null;

watch(searchQuery, (query) => {
  // 1/ ON TUE INSTANTANÉMENT L'ANCIENNE MINUTERIE AU MOINDRE TOUCHER CLAVIER !!
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Règle Sécurité : Vider l'écran si l'User efface tout.
  if (!query.trim()) {
    results.value = [];
    return;
  }

  // 3/ ON ARME LA MINUTERIE RETARDEMENT !! (Attendre 300ms de blanc et de temps mort de la part de l'utilisateur AVANT DE TIRER LA ROQUETTE RESEAU)
  debounceTimer = setTimeout(async () => {
    isSearching.value = true;
    try {
      const response = await fetch(`/api/search?q=${query}`);
      results.value = await response.json();
    } finally {
      isSearching.value = false;
    }
  }, 300);
});
```

### L'Automate Sync de Cookies `LocalStorage` Local

```typescript
import { ref, watch } from "vue";

function useLocalStorage<T>(key: string, defaultValue: T) {
  // 1. Amorcer depuis le LocalStorage si la donnée existe déjà
  const stored = localStorage.getItem(key);
  const value = ref<T>(stored ? JSON.parse(stored) : defaultValue);

  // 2. Le Watcher Magique Invisible : Dés que le script mute cette Ref à l'avenir, HOP ! on ré-écrase le local storage illico en background !!
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    },
    { deep: true }, // Vital pour les Objets de config
  );

  return value;
}

// Consommation :
const settings = useLocalStorage("settings", {
  theme: "light",
  fontSize: 14,
});
```

### Le Pistage Hardcore des Paramètres D'URL Routeur

Souvent, changer la donnée d'une URL de page `monsite.com/user/1` vers `monsite.com/user/2` ne recharge PAS VRAIMENT physiquement la page HTML. Il faut IMPÉRATIVEMENT un espion Watch pour forcer le code à réagir à ce pseudo-changement d'URL !

```typescript
import { watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const post = ref(null);

// Ciblage de la bar d'URL
watch(
  () => route.params.id, // L'ID cible dans la barre d'adresse
  async (newId) => {
    if (newId) {
      post.value = await fetchPost(newId); // Boom ! Mise à jour visuelle force de la donnée du nouvel User !
    }
  },
  { immediate: true }, // Parfait pour que ça charge aussi la TOUTE PREMIÈRE fois que l'User arrive sur cette page via un lien externe !
);
```

### La Guillotine Conditionnelle (Surveiller sous Condition stricte)

```typescript
import { ref, watch } from "vue";

const isEnabled = ref(false);
const value = ref(0);

// Espionne les deux !
watch([isEnabled, value], ([enabled, val]) => {
  // Guillotine Moteur : La Magie Moteur ne s'exécutera en fin de compte QUE SI le bouton Général Système est enclenché !!
  if (enabled) {
    processValue(val);
  }
});
```

### Le Pistage avec Filtre Frontière Validateur

Ne lancer les lours appels Apis QUE si le champ rentré est mathématiquement correct de base :

```typescript
import { ref, watch } from "vue";

const email = ref("");
const emailError = ref("");
const isValidating = ref(false);

watch(
  email,
  async (newEmail) => {
    // Remet les compteurs a zéro a chaque frappe
    emailError.value = "";

    if (!newEmail) return;

    // 1/ FILTRE FRONTIÈRE LOCAL : Check ultra basique de Format hors ligne gratuit CPU
    if (!newEmail.includes("@")) {
      emailError.value = "Hého, l'Email doit avoir un @ ..";
      return; // ONS TUE LE SCRIPT ICI !!!
    }

    // 2/ ALORS SEULEMENT ON PAYE LE VRAI PRIX DE L'APPEL RÉSEAU (Qui coûte cher) : Validation BDD distante.
    isValidating.value = true;
    try {
      const response = await fetch(`/api/check-email?email=${newEmail}`);
      const { available } = await response.json();
      if (!available) {
        emailError.value = "Cet Email est Déjà Pris mon grand !";
      }
    } finally {
      isValidating.value = false;
    }
  },
  { debounce: 500 },
); // Note interne : "debounce" en propre n'existe pas en l'option watch native, c'est pour l'exemple ! C'est généralement une Macro Lodash d'entreprise ici)
```

### "Effect Scope" - L'Exterminateur de masse de Fuites Mémoires

```typescript
import { ref, watch, effectScope } from "vue";

function useFeature() {
  const scope = effectScope(); // 1 . Crée un Conteneur Spatial Magique (Le Scope)

  scope.run(() => {
    // TOUT ce qu'on mettra la dedans (Hooks, Ref, Computeds, Watchs...) sera marqué au Fer rouge commun
    const count = ref(0);

    watch(count, () => {
      /* ... */
    });
    // Et  des dizaines d'autres watchers perdus...
  });

  // Destruction Atomique Absolue (Stop):
  function cleanup() {
    scope.stop(); // TUE INSTANTANÉMENT ET SÉCURISE, détruit d'un seul coup et sans résidus mémoire les dizaines de watchers mères enregistrés à l'intérieur de sa bulle !! Absolu contre le fuites de Ram !
  }

  return { cleanup };
}
```

## Grandes Ressources Exclusives Officielles

- [L'Art Obscur du "Callback Flush Timing" des Watchers](https://vuejs.org/guide/essentials/watchers.html#callback-flush-timing) — La documentation la plus folle et difficile de la team pour comprendre les timings pre, post, sync du V-Dom Virtuel.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
