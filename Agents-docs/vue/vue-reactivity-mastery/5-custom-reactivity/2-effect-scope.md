---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-effect-scope"
---

# L'Architecture Suprême : Gérer la Mémoire avec `effectScope`

Dans les applications Entreprise, les fuites de mémoires JavaScript causées par des Watchers non détruits sont le fléau #1. L'API fantastique `effectScope()` crée une "Bulle d'Espace-Temps" (un Scope) capable de capturer religieusement tous les effets réactifs générés en son sein, permettant de les détruire massivement et proprement d'un seul coup de hache de manière synchronisée !

## L'Exemple Ultime de Base

```typescript
import { effectScope, ref, computed, watch, watchEffect } from "vue";

const scope = effectScope(); // 1. Ouvre la Bulle de capture

// 2. ON LANCE LE RUN DANS LA BULLE MAGIQUE :
scope.run(() => {
  const count = ref(0);
  const double = computed(() => count.value * 2);

  // Ces DEUX gros effets Moteurs sont désormais Prisonniers de la Bulle "Scope" à vie !!
  watch(count, () => console.log("Le compteur a muté !"));
  watchEffect(() => console.log("Le Double est : ", double.value));
});

// Bien plus tard, lors du démontage de la page Web : ON TUE ABSOLUMENT TOUS LES EFFETS PRISONNIERS D'UN COUP !!
scope.stop(); // La RAM du PC est Libérée INSTANNTANÉMENT sans aucune fuite memory leak possible !
```

## Mais Pourquoi Diable Utiliser effectScope M. Anderson ?

Sans les scopes, un Architècte Devrait traquer lamentablement chaque effet a la main COMME CECI :

```typescript
// ❌ SUIVI MANUEL ATROCE : (Propice aux erreurs et oublis !)
const stopWatch1 = watch(/* ... */);
const stopWatch2 = watch(/* ... */);
const stopEffect = watchEffect(/* ... */);

function cleanup() {
  stopWatch1();
  stopWatch2();
  stopEffect();
  // Vous en avez oublié un au fond du fichier ? PAN ! Fuite de Mémoire (Memory Leak) !
}

// ✅ LE MONDE MODERNE MAGIQUE DE VUE : Le Cleanup propre
const scope = effectScope();

scope.run(() => {
  watch(/* ... */);
  watch(/* ... */);
  watchEffect(/* ... */);
});

function cleanup() {
  scope.stop(); // TUE TOUT CE QUI EST DEDANS. L'Oubli est désormais mathématiquement impossible.
}
```

## Construire les Meilleurs Composables Universels au Monde

```typescript
import { effectScope, onScopeDispose } from "vue";

function useMouseTracker() {
  const scope = effectScope();

  return scope.run(() => {
    const x = ref(0);
    const y = ref(0);

    function update(event: MouseEvent) {
      x.value = event.clientX;
      y.value = event.clientY;
    }

    window.addEventListener("mousemove", update); // Écoute Lourde du DOM Browser

    // NETTOYAGE ABSOLU DE SÉCURITÉ : La méthode Magique de Vue "Quand la Bulle Pète" :
    onScopeDispose(() => {
      window.removeEventListener("mousemove", update); // Détruit le Listener Javascript OS natif !
    });

    return { x, y };
  })!;
}

// L'Appel est transparent dans le composant .vue :
const { x, y } = useMouseTracker();
// Sera AUTOMATIQUEMENT Nettoyé quand Vue tuera le composant V-Node UI  !!
```

## L'API des Ombres : `getCurrentScope` et `onScopeDispose`

Pour créer des outils qui s'adaptent et sentent s'ils sont dans une bulle ou non !

```typescript
import { getCurrentScope, onScopeDispose, effectScope, watchEffect } from "vue";

function useEventListener(
  target: EventTarget,
  event: string,
  callback: EventListener,
) {
  // L'IA MOTEUR : "Chef, Est-ce que je suis actuellement enfermé dans une prison Scope ??"
  if (getCurrentScope()) {
    target.addEventListener(event, callback);

    // Si Oui, ok parfait j'attache mon suicide sur son arrêt !
    onScopeDispose(() => {
      target.removeEventListener(event, callback);
    });
  } else {
    // Sinon, j'alerte le dev console d'urgence !!! : "Tu as oublié ton Scope Gars !"
    console.warn(
      "L'Utilitaire Event a été appelé bêtement hors cadre scope ! Fuite Mémoire Détecté !",
    );
  }
}

// Utilisation Propre
const scope = effectScope();

scope.run(() => {
  useEventListener(window, "resize", handleResize);
  useEventListener(document, "click", handleClick);
});

// Les deux Event Listeners DOM Seront détruit proprement !
scope.stop();
```

## L'Inception d'État : Les Scopes Imbriqués Infini (Multi-Nested)

Les bulles Scope ont le don incroyable de pouvoir créer d'autres scopes ENFANT dans elles même !!

```typescript
import { effectScope } from "vue";

const parentScope = effectScope();

parentScope.run(() => {
  const childScope = effectScope(); // L'Inception a débutée

  childScope.run(() => {
    // Sous Effets de l'enfant
  });

  // LE SCOPE ENFANT SERA MAGIQUEMENT DÉTRUIT DE FORCE SI LE PARENT MEURT ! Une Cascade Parfaite !
});

parentScope.stop(); // Tue le Papa, QUI TUE AUSSI  childScope secrètement !
```

### Le Mode Rebelle Actif : Les Scopes Détachés Indépendants

```typescript
import { effectScope } from "vue";

const parentScope = effectScope();

parentScope.run(() => {
  // Le Paramètre (true) détache L'Enfant du Papa !! L'enfant est Hors-Contrôle
  const detachedScope = effectScope(true);

  detachedScope.run(() => {
    // CES EFFETS SURVIVRONT A L'APOCALYPSE PERE !! MÊME SI parent.stop() EST EXÉCUTÉ !
  });
});

parentScope.stop(); // detachedScope continue de tourner en bruit de fond indéfiniment !!
```

## Un Vrai Pattern Industriel : Le Basculeur de Code "Feature Toggle" UI Dynamique

```typescript
import { effectScope, ref, computed, watch } from "vue";

function useFeature(enabled: Ref<boolean>) {
  let scope: EffectScope | null = null;
  const data = ref<Data | null>(null);

  watch(
    enabled,
    (isEnabled) => {
      if (isEnabled) {
        // LE BOUTON HTML TOGGLE EST ALLUMÉ ON !

        // ON OUVRE LA BULLE ET ON FAIT CRAMER LE RESEAU VITE !
        scope = effectScope();
        scope.run(() => {
          // Démarre l'Horlogerie  D'Effet d'API Data Fetch !
          const interval = setInterval(fetchData, 5000);
          watchEffect(() => processData(data.value));

          onScopeDispose(() => {
            clearInterval(interval);
          });
        });
      } else {
        // LE BOUTON HTML TOGGLE EST ÉTEINT OFF PAR L'USER !
        // ARRRCHHH ARRET TOTAL D'URGENCE DU REACTEUR MOTEUR IMMEDIAT !!!
        scope?.stop();
        scope = null;
        data.value = null; // Vide la Data
      }
    },
    { immediate: true },
  );

  return { data };
}
```

## Le Cas VueUse (La Bibliothèque des Dieux de Evan You)

La célébrissime bibliothèque internationale VueUse utilise `effectScope` en interne de tous ses outils magiques ! :

```typescript
// Voici en Vrai comment marche les entrailles de la fabuleuse libération VueUse : `createSharedComposable`
import { effectScope } from "vue";

function createSharedComposable<T>(composable: () => T): () => T {
  let subscribers = 0;
  let state: T | null = null;
  let scope: EffectScope | null = null;

  return () => {
    subscribers++;

    if (!scope) {
      scope = effectScope(true);
      state = scope.run(composable)!;
    }

    onScopeDispose(() => {
      subscribers--;
      if (subscribers === 0) {
        scope?.stop();
        scope = null;
        state = null;
      }
    });

    return state!;
  };
}
```

## Merveilleuse Ressource Officielle

- [Les Secrets Esotériques de EffectScope](https://vuejs.org/api/reactivity-advanced.html#effectscope) — La Page doc API pour tout piger de l'Architecture de la fuite de mémoire JS.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
