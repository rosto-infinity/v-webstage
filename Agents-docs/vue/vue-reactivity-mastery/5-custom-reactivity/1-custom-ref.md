---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-custom-ref"
---

# Forger des Refs Secrètes Sur-Mesure avec `customRef`

L'API de bas niveau absolue `customRef()` vous offre le don de Dieu de créer vous-même intégralement le comportement interne du Get (Lecture) et du Set (Écriture) d'une "fausse" Ref Maison ! Cela ouvre la porte à des Designs Patterns d'ingénieurs architectes incroyables : Les Refs avec délai (Debouncing), Les Refs Auto-Validées, et Celles qui transforment la donnée à la volée. !

## La Structure Anatomique Interne d'une CustomRef

```typescript
import { customRef } from "vue";

function myCustomRef<T>(initialValue: T) {
  // customRef exige le retour direct de ces 2 Dieux Moteurs: (Track "Pister", et Trigger "Tirer!")
  return customRef<T>((track, trigger) => {
    let value = initialValue;

    // Vous DEVEZ religieusement retourner cet Objet JS qui définit l'Âme Absolue de votre Ref :
    return {
      get() {
        track(); // 1. Dites secrètement à Vue Engine de marquer cette donnée au fer rouge dans ses registres V-DOM
        return value;
      },
      set(newValue) {
        value = newValue;
        trigger(); // 2. TIREZ L'ALARME GÉNÉRALE INCENDIE ! Dites a Vue de Relancer la machine à Update UI !
      },
    };
  });
}
```

## L'Oeuvre D'Art 1 : La Ref "Retardatrice" Moteur (`Debounce`)

C'est l'Exemple le plus classique au monde que l'on donne en Entretien d'Embauche Sénior Vue — Retarder intentionnellement l'envoi réseau et d'UI d'une barre de recherche tant que le mec n'a pas fini de s'exciter sur son clavier ! :

```typescript
import { customRef } from "vue";

function useDebouncedRef<T>(initialValue: T, delay = 300) {
  let timeout: number | null = null;

  return customRef<T>((track, trigger) => {
    let value = initialValue;

    return {
      get() {
        track(); // Le Pistage au demarrage
        return value;
      },
      set(newValue) {
        // Au MOINDRE FRAPPEMENT DE CLAVIER : ON TUE LA MINUTERIE EXPLOSIVE PRECEDENTE Morte
        if (timeout) {
          clearTimeout(timeout);
        }

        // ET ON EN RE-ENCLENCHE UNE TOUTE NEUVE POUR UN DELAI COMPLET
        timeout = setTimeout(() => {
          value = newValue;
          trigger(); // BOUM : Le Temps est Écoulé => JE TIRE L'ALARME VUE RE-RENDU D'UI !
        }, delay);
      },
    };
  });
}

// Consommation :
const searchQuery = useDebouncedRef("", 500);

// Dans le template: <input v-model="searchQuery" />
// La requête Ultime Ne partira et UI Bougera que EXACTEMENT  500ms APRÈS que le gars ai fini sa phrase et laché les touches du PC !!
```

## L'Oeuvre D'Art 2 : La Ref "Étranglée" Limitatrice de Vitesse (`Throttled`)

Pour limiter la fréquence d'actualisation extrême (idéal pour le drag and drop à la souris !) :

```typescript
import { customRef } from "vue";

function useThrottledRef<T>(initialValue: T, interval = 100) {
  let lastUpdate = 0;
  let pendingValue: T | null = null;
  let timeout: number | null = null;

  return customRef<T>((track, trigger) => {
    let value = initialValue;

    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        const now = Date.now();
        const timeSinceLastUpdate = now - lastUpdate;

        if (timeSinceLastUpdate >= interval) {
          // Assez de temps a coulé ! Ok tu as le droit de passer, met direct à jour !
          value = newValue;
          lastUpdate = now;
          trigger();
        } else {
          // HOLA ! Tu vas trop vite Michel !! Je te stock dans une file d'attente "Pending" forcé !
          pendingValue = newValue;

          if (!timeout) {
            // J'ouvre un sas de décompression Minuterie
            timeout = setTimeout(() => {
              if (pendingValue !== null) {
                value = pendingValue;
                pendingValue = null;
                lastUpdate = Date.now();
                trigger(); // Hop c'est à ton tour !
              }
              timeout = null;
            }, interval - timeSinceLastUpdate);
          }
        }
      },
    };
  });
}
```

## L'Oeuvre D'Art 3 : La Force Douanière Ref (`Validated`)

Une Ref qui N'ACCEPTE littéralement que des données valides à ses yeux !

```typescript
import { customRef, ref } from "vue";

type Validator<T> = (value: T) => boolean | string;

function useValidatedRef<T>(initialValue: T, validator: Validator<T>) {
  const error = ref<string | null>(null); // Une petite balise GPS ref soeur attache pour dénoncer

  const valueRef = customRef<T>((track, trigger) => {
    let value = initialValue;

    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        const result = validator(newValue); // LE PASSAGE EN DOUANE !

        if (result === true) {
          // OK ! Validation Réussie = Tout Passe
          value = newValue;
          error.value = null;
          trigger();
        } else {
          // DOUANE INTERDITE : Validation Échouée !! = CA BOUGE PAS LE DOM, VALEUR BRISÉE et ERREUR LEVÉE !!
          error.value =
            typeof result === "string"
              ? result
              : "Valeur Totalement Invalide Chef";
        }
      },
    };
  });

  // On renvoie un Objet ES6 avec Nos DEUX ref d'un coup
  return { value: valueRef, error };
}

// Usage Impressionnant en Prod :
const { value: age, error: ageError } = useValidatedRef(0, (v) => {
  if (v < 0) return "Dites, l'age peut pas être Négatif...";
  if (v > 150) return "Personne ne vit 150 Ans !";
  return true; // Oui !
});
```

## L'Oeuvre D'Art 4 : Le Miroir Inifini du Navigateur (`LocalStorage Synced`)

```typescript
import { customRef, watch } from "vue";

function useLocalStorageRef<T>(key: string, defaultValue: T) {
  // On Fouille au 1er Lancement la Base interne du navigateur Web !
  const stored = localStorage.getItem(key);
  const initial: T = stored ? JSON.parse(stored) : defaultValue;

  return customRef<T>((track, trigger) => {
    let value = initial;

    // BONUS MAGIE ULTIME EXTRÊME : On Écoute en mode Espion les Événements Système Windows OS des AUTRES ONGLETS CHROME OUVERTS EN MÊME TEMPS !!
    window.addEventListener("storage", (e) => {
      // SI LE MEC MET À JOUR DEPUIS UN AUTRE ONGLET ? ALORS MA VARIABLE REF À MOI DE CET ONGLET SE MET SECRÈTEMENT À JOUR POUR LES RESYNCHRONISERS INSTANT! C'est de la Magie Pure !
      if (e.key === key && e.newValue) {
        value = JSON.parse(e.newValue);
        trigger(); // Alarme Incendie !
      }
    });

    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        value = newValue;
        localStorage.setItem(key, JSON.stringify(newValue)); // Le vrai Set LocalStorage de L'OS System Windows
        trigger(); // Alarme
      },
    };
  });
}

// L'Usage Magique en 1 ligne partout dans l'App !
const theme = useLocalStorageRef("theme", "light");
theme.value = "dark"; // Sera INSTANNTANÉMENT MAJ aussi dans la ROM mémoire morte du Pc User !!
```

## L'Oeuvre D'Art 5 : La Machine à Remonter le Temps Totale (Undo/Redo / CTRL+Z Moteur)

```typescript
import { customRef, ref, computed } from "vue";

function useHistoryRef<T>(initialValue: T, maxHistory = 50) {
  // Limitons à 50 Actions de Ctrl+Z
  const history = ref<T[]>([initialValue]);
  const currentIndex = ref(0); // Le pointeur laser temporel

  const canUndo = computed(() => currentIndex.value > 0);
  const canRedo = computed(() => currentIndex.value < history.value.length - 1);

  const valueRef = customRef<T>((track, trigger) => {
    return {
      get() {
        track();
        return history.value[currentIndex.value]; // LIT CEUX QU'IL Y A SOUS LE POINTEUR !
      },
      set(newValue) {
        // Le Paradoxe Temporel : Tuer impitoyablement tout le "futur" restant si on vient de réécrire le temps depuis le Passé !!
        history.value = history.value.slice(0, currentIndex.value + 1);

        // Ajouter la nouvelle Data au Fil du Temps
        history.value.push(newValue);

        // Elagage des vieux souvenirs (Si y'en a trop, on vire le plus vieux au fond du sac !)
        if (history.value.length > maxHistory) {
          history.value.shift();
        } else {
          currentIndex.value++; // On avance le pointeur Temporel !
        }

        trigger(); // Alarme Incendir !
      },
    };
  });

  // Fonction Machine : Marche Dé-arriere (Ctrl+Z)
  function undo() {
    if (canUndo.value) {
      currentIndex.value--;
    }
  }
  // Fonction Machine : Marche Avant (Ctrl+Y)
  function redo() {
    if (canRedo.value) {
      currentIndex.value++;
    }
  }

  return {
    value: valueRef,
    history,
    canUndo,
    canRedo,
    undo,
    redo,
  };
}
```

## Immenses Ressources Utiles

- [L'API Absolue De customRef Officiel (EN)](https://vuejs.org/api/reactivity-advanced.html#customref) — Documentation la plus avancée et bas niveau jamais édité sur la customisation Track/Trigger.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
