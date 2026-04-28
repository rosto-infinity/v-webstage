---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-script-setup-fundamentals"
---

# Comprendre l'architecture de script setup

`<script setup>` est la syntaxe recommandée et moderne pour utiliser l'API de Composition (Composition API) dans les Composants Mono-Fichiers Vue (Single-File Components). Il offre une manière beaucoup plus propre, lisible et concise d'écrire l'intelligence de vos composants Vue.

## Pourquoi utiliser script setup ?

### Avant (L'API d'Options / La très lourde fonction "setup()")

```vue
<script>
import { ref, computed } from "vue";
import MyComponent from "./MyComponent.vue";

// L'ancienne méthode historique en API d'Options (Très verbeuse et répétitive)
export default {
  components: { MyComponent }, // Il fallait enregistrer à la main
  setup() {
    const count = ref(0);
    const double = computed(() => count.value * 2);

    function increment() {
      count.value++;
    }

    // Le calvaire : Devoir retourner à la main absolument TOUT pour que le code HTML au dessus y accède :
    return {
      count,
      double,
      increment,
    };
  },
};
</script>
```

### Après (Le moderne : script setup)

```vue
<!-- On ajoute simplement l'attribut "setup" au <script> -->
<script setup>
import { ref, computed } from "vue";
import MyComponent from "./MyComponent.vue"; // Enregistré O-TO-MA-TI-QUE-MENT !

// Fini l'export default" ou le "setup()" gigantesque !
const count = ref(0);
const double = computed(() => count.value * 2);

function increment() {
  count.value++;
}
// TOUT EST AUTOMATIQUEMENT DISPONIBLE DANS LE TEMPLATE !
</script>
```

## Les Avantages Majeurs

1. **Moins de code boilerplate lourd** : Plus d'enfer de retour `return` final introuvable, ni d'option bloc énorme `components:` pour des listes infinies.
2. **Meilleur support TypeScript au monde** : Les inférences de Types coulent naturellement par magie sans annotations supplémentaires complexes requises.
3. **Meilleure performance de Runtime pure** : Le template (HTML) est directement compilé dans le même scope d'exécution pur du script. C'est en moyenne plus rapide de 30%.
4. **Auto-imports géniaux** : Absolute tous les `import` propres des composants externes (Boutons, Forms) et directives sont automatiquement branchés directement et utilisable dans l'HTML. Moins d'erreurs !

## Ce qui est Disponible dans le Template HTML

Absolument tout ce qui est défini au niveau racine ("Top level") du script setup est automatiquement et magiquement exposé au Tag `<template>` :

```vue
<script setup>
import { ref, computed } from "vue";
import BaseButton from "./BaseButton.vue"; // Un composant externe classique
import vFocus from "./directives/focus"; // Une ligne directive perso externe ("v-focus")

// Variables d'état (State) Réactives
const count = ref(0);
const user = ref({ name: "Alice" });

// Valeurs Dérivées Computed calculées à la volée
const double = computed(() => count.value * 2);

// Nos Fonctions Métiers JS et événements
function increment() {
  count.value++;
}
const greet = () => alert("Coucou le monde de Vue !");

// Les Constantes Pures globales au Composant
const MAX_COUNT = 100;
</script>

<template>
  <!-- Absolument TOUT ce HTML fonctionne par magie directe sans 'returns' ! -->
  <BaseButton @click="increment">Compteur Actuel : {{ count }}</BaseButton>
  <p>Le Grand Double : {{ double }}</p>
  <p>Mon Utilisateur Web actuel : {{ user.name }}</p>
  <p>Le Plafond Numérique Maximum autorisé : {{ MAX_COUNT }}</p>

  <input v-focus />
</template>
```

## Utiliser <script setup> en Conjonction avec un <script> Classique

Bien que plus rare en pratique, vous pouvez tout à fait utiliser parfaitement et de concert les deux `script` en même temps dans un unique et même composant `.vue` :

```vue
<script>
// Ce Script très "Classique option API historique" séparé sert particulièrement et uniquement pour :
// - Produire des 'import' pures ou des 'export' nommés
// - Déclarer des options uniques pures de composants qui ne peuvent PAS être gérées par setup() magique (Comme inheritAttrs: false)
// - Exécuter du simple Vanilla JS pur UNE SEULE ET UNIQUE FOIS pour TOUTE LA VIE de la SPA (Des Scripts d'imports persos isolés par ex).

export const componentName = "MyCounter"; // Exportable ailleur

export default {
  // Déclarer un Nom unique manuel du composant interne (Pratique au Debug)
  name: "MyCounter",
  // Bloquer l’héritage silencieux de toutes les balises styles HTML du papa
  inheritAttrs: false,
  customOptions: {
    // Mes vieilles options de plugins spécifiques
  },
};
</script>

<script setup>
import { ref } from "vue";

const count = ref(0);
// L'intelligence du composant reste ici
</script>
```

## Top-Level `await` : La Requête API natif instantanée

`<script setup>` supporte désormais de manière totalement magique le mot clé asynchrone pur et bloquant `await` directement dès le niveau racine de l'architecture. Plus besoin "d'enrober" ou englober systématiquement cela dans des grosses fonctions très lourdes :

```vue
<script setup>
// L'initialisation du Composant RESTE FRAPPÉE par un arrêt (en bloc/pause) TANT que sa grosse requête API serveur Fetch n'est pas revenue avec les données de réponse web !
const user = await fetchUser();
const posts = await fetchUserPosts(user.id);
</script>
```

**Note Majeure**: Cette puissante syntaxe très risquée transforme et métamorphose automatiquement et sournoisement la base de notre composant entier Vue directement en un grand _Composant Asynchrone_ d'architectures. Ainsi, le fonctionnement de Vue 3 imposera très férocement l’exécution dans son composant _PÈRE_ (celui au dessus de lui dans l'architecture web) la directive de balise native géniale de Vue `<Suspense>` pour simplement ne pas tout bloquer votre pauvre affichage écran au visiteur client :

```vue
<!-- Dans le Composant Parent HTML (Très Obligatoire !!) -->
<template>
  <Suspense>
    <!-- Le Composant enfant asynchrone très lourd avec son gros Await bloquant qui pré-charge -->
    <AsyncComponent />

    <!-- Ce qui s'affiche proprement et très fluidement comme "Skeleton" de base à l'utilisateur PENDANT QUE l'AsyncComponent attend désespérément de se résoudre et charger l'API serveur du dessus ! -->
    <template #fallback>
      <div>
        Chargement asynchrone lourd de notre majestueuse sublime base
        d'utilisateurs massif du backend PHP en attente locale complète...
      </div>
    </template>
  </Suspense>
</template>
```

## Les Rares Restrictions Restantes de Script Setup

Quelques petites choses purement architecturaux ne fonctionneront absolument jamais pour de simples et de bonne et grandes logique raisons JavaScript au sein global d'un robuste complet `<script setup>` :

- Aucun accès permis total, basique et vital à l'intérieur de l'objet ou de l'application avec le fameux `this` historique pure web (Il y est très littéralement non existant ou d'une indéfinition totale `undefined` complète !!).
- Impossible et purement très techniquement bloqué pour raisons globales d'es modules de générer publiquement depuis ce fameux le top block les beaux Exports majeurs Nommés natif pure type JS (`export const xyz`) (Il vous faudra purement créer un second balisage `<script>` vierge à part entière dédié classique juste pour l'occasion au-dessus).
- Souvent il demeure impossible et bloqué globalement de faire grand appel simple pour l’attribut `<script src="...">` de charger d'un lourd externe JS très lié et complet directement natifs sur du vrai Script Setup.

## Ressources Complètes Pour Approfondir :

- [script setup Documentation](https://vuejs.org/api/sfc-script-setup.html) — L'immense guide pointilleux pur officiel et de pointe de la documentation absolue officielle web de l'écosystème Vue expliquant "script setup".

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
