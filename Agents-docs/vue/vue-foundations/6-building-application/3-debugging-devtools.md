---
source_course: "vue-foundations"
source_lesson: "vue-foundations-debugging-devtools"
---

# Débogage avec Vue DevTools

Vue DevTools est une extension de navigateur absolument essentielle (voire obligatoire) pour développer des applications Vue. Elle vous offre de puissants outils d'inspection, de manipulation en temps réel et de débogage visuel.

## Installer Vue DevTools

1. **Chrome / Brave** : Cherchez "Vue.js devtools" dans le Chrome Web Store.
2. **Firefox** : Cherchez "Vue.js devtools" dans les modules complémentaires Firefox.
3. **Edge** : Cherchez "Vue.js devtools" dans les modules complémentaires Microsoft Edge.

Après l'installation (et un rafraîchissement de page), vous verrez un tout nouvel onglet "Vue" ultra-complet dans les outils de développement (F12) de votre navigateur.

## L'Inspecteur de Composants (Component Inspector)

L'inspecteur vous permet d'explorer l'arbre (Tree) complet de votre application :

### Voir la Hiérarchie des Composants

- Visualisez exactement comment vos composants sont imbriqués.
- Cliquez sur n'importe quel composant pour le cibler et l'inspecter.
- Mettez rapidement en évidence le composant survolé directement dans la page web.

### Inspecter l'État Interne (State)

Pour chaque composant sélectionné, vous pourrez voir en temps réel :

- **Props** : Les valeurs passées par son Parent.
- **Setup** (refs / reactive) : Les variables d'état privées du composant.
- **Computed** : La valeur actuelle en live de toutes les propriétés calculées.
- **Provide/Inject** : Les données globales injectées.

### Édition en Temps Réel (Live Editing)

C'est la _killer feature_ absolue : Vous pouvez éditer les variables directement depuis les DevTools :

1. Sélectionnez un composant.
2. Trouvez la variable d'état (ex: `count: 0`) ou la prop que vous voulez altérer.
3. Cliquez dessus et changez sa valeur (ex: `969`).
4. **Appuyez sur Entrée et regardez votre interface web se mettre à jour instantanément !**

## L'Onglet "Timeline" (Chronologie)

La ligne de temps enregistre absolument tous les événements invisibles qui se produisent à la milliseconde près :

- **Événements de Composants** : Montage, Mise à jour de l'écran (Render), Démontage.
- **Événements Utilisateurs** : Clics, Frappes au clavier, Émissions (Emits) des composants.
- **Performance** : Temps nécessaire pour dessiner chaque morceau de la page.

## Astuces de Débogage Utiles au Quotidien

### Inspection via la Console ($vm)

Accédez directement à l'état du composant sélectionné dans la Console JS traditionnelle de votre navigateur :

```javascript
// Après avoir cliqué sur un composant dans l'onglet "Vue"
$vm; // L'objet entier. Affiche l'instance technique brute du composant.
$vm.count; // Permet de lire et modifier sa variable de count (Pas besoin de .value ici !)
$vm.props; // Permet de fouiller ses props externes.
```

### Ajouter des Points d'Arrêts (Debug Points)

```vue
<script setup lang="ts">
import { ref, watch } from "vue";

const count = ref(0);

// Pister très précisément une variable avec watch + le mot clé natif JS "debugger"
watch(count, (newVal, oldVal) => {
  console.log(`Le compteur a brutalement changé : ${oldVal} → ${newVal}`);
  debugger; // Met en PAUSE TOTALE le navigateur exactement sur cette ligne de code !
});
</script>
```

### Débogage "Sale" mais Rapide dans le Template HTML

```vue
<template>
  <!-- La fameuse technique d'affichage JSON complet (Très utile en plein de milieu d'un div) -->
  <pre>{{ JSON.stringify(someComplexObject, null, 2) }}</pre>

  <!-- Cacher du debug (Mettre true pour vérifier lors de grosses requêtes) -->
  <div v-if="false">Valeur Actuelle : {{ complexValue }}</div>
</template>
```

### Diagnostics Console Évolués natifs JS

```vue
<script setup lang="ts">
import { ref, onMounted } from "vue";

const items = ref([]);

onMounted(async () => {
  console.time("Temps de chargement Fetch");
  const response = await fetch("/api/items");
  items.value = await response.json();

  console.timeEnd("Temps de chargement Fetch"); // Loguera : "Temps de chargement Fetch: 234ms"

  console.table(items.value); // Affiche un MA-GNI-FIQUE tableau ordonné dans la console
});
</script>
```

## Problèmes Courants et Leurs Solutions

### ❌ "Ma Réactivité ne marche pas, l'écran HTML ne se met pas à jour !"

```vue
<script setup lang="ts">
import { reactive, toRefs } from "vue";

// ❌ L'erreur classique : Détruire la réactivité avec la Destructuration Object JS standard
const state = reactive({ count: 0 });
let { count } = state; // Catastrophe : 'count' n'est plus qu'un bête nombre entier figé (0) !
count++; // Le JS passe à 1, mais Vue s'en fiche complètement et l'écran restera bloqué à 0 !

// ✅ Solution 1 : Utiliser toujours l'objet entier (Le proxy magique de Vue fera son taf)
state.count++;

// ✅ Solution 2 : Utiliser l'utilitaire spécifique toRefs de Vue si vous tenez ABSOLUMENT à destructurer
const { count } = toRefs(state); // 'count' devient un vrai ref() à part entière
count.value++; // Ça marche, l'écran va se redessiner !
</script>
```

### ❌ "Mon Tableau (ou objet) de données ne rafraîchit pas l'écran !"

Attention à Mutuer intelligemment la référence globale !

```vue
<script setup lang="ts">
import { ref } from "vue";

const items = ref([{ id: 1, name: "Item" }]);

// ❌ Parfois, muter violemment une propriété très très profonde peut échouer à déclencher le rendu total
items.value[0].name = "Nouveau Nom";

// ✅ Forcer un rendu total ET ultra propre en recréant un nouveau tableau "frais" via le spread operator
items.value = [...items.value];
</script>
```

### ❌ "Mon Événement Pére/Enfant Emit ne se lance pas au clic !"

```vue
<!-- ❌ Le drame de la Case Différente (Casing) -->
<ChildComponent @updateValue="handler" />
<!-- Attention à l'interdit camelCase en HTML ! -->

<!-- Dans le composant ChildComponent.vue : -->
emit('update-value')
<!-- Le parent ne recevra JAMAIS rien ! Les nom sont différent ! -->

<!-- ✅ Soyez Cohérent et utilisez TOUJOURS le stricte kebab-case dans le HTML ! -->
<ChildComponent @update-value="handler" />
```

## Ressources

- [Vue DevTools](https://devtools.vuejs.org/) — Documentation officielle des merveilleux Vue DevTools.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
