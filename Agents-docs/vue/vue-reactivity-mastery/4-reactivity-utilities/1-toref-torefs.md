---
source_course: "vue-reactivity-mastery"
source_lesson: "vue-reactivity-mastery-toref-torefs"
---

# L'API `toRef` et `toRefs` pour une Déstructuration ES6 Saine

Lorsque vous travaillez avec des objets purement réactifs de grande taille (`reactive`), utiliser la fameuse déstructuration ES6 basique les pulvérise et vous fait perdre définitivement toute forme de réactivité UI ! Les méthodes `toRef()` et `toRefs()` sont les seuls sauveurs mondiaux capables de résoudre ce drame.

## Le Grand Danger de la Déstructuration Inconsciente

```typescript
import { reactive } from "vue";

const state = reactive({
  count: 0,
  name: "Vue",
});

// ❌ DANGER DE MORT : Perte définitive Totale de toute réactivité Moteur !!
let { count, name } = state; // count devient un misérable nombre JS mort de type Int
count++; // Ca change 0 => 1 dans la variable morte, mais IL NE SE PASSERA RIEN SUR LA PAGE WEB HTML
name = "Vue 3"; // L'UI Reste bloqué à "Vue" !!
```

## Le Bouclier `toRef()` : Pour 1 Seule Propriété Unique

`toRef()` "Découpe virtuellement" une propriété depuis l'intérieur d'un Gros Objet `reactive()`, et en crée par magie une `ref()` autonome et indépendante mais qui continuera secrètement de "Rester Synchronisée dans les 2 sens" avec la variable mère !

```typescript
import { reactive, toRef } from "vue";

const state = reactive({
  count: 0,
  name: "Vue",
});

// Créer littéralement par Magie Un Ref Isolée de secours pour se brancher discrètement et se synchroniser sur un simple state.count interne distant commun !
const countRef = toRef(state, "count");

countRef.value++; // ✅ Met magiquement AUSSI à jour l'ancêtre 'state.count' par procuration
console.log(state.count); // 1

state.count = 10; // ✅ Et Vice/Versa dans l'autre sens si le parent change !!
console.log(countRef.value); // Sort : 10
```

### Optionnel `toRef` avec Valeurs de Repli par Défaut (Depuis Vue 3.3+)

```typescript
import { reactive, toRef } from "vue";

const state = reactive<{ name?: string }>({});

// Permet de Fournir très salement une énorme  valeur de secours !
const name = toRef(state, "name", "Invité Anonyme");
console.log(name.value); // 'Invité Anonyme'

state.name = "Alice"; // On fini par peupler la case
console.log(name.value); // 'Alice'
```

## L'Arsenal Lourd `toRefs()` : L'Arme Nucléaire de Masse

`toRefs()` va brutalement et intégralement convertir simultanément TOUTES LES SOUS PROPRIÉTÉS de votre Parent en une gigantesque armée armée de milliers de Ref individuelles !

```typescript
import { reactive, toRefs } from "vue";

const state = reactive({
  count: 0,
  name: "Vue",
  active: true,
});

// Le Convertisseur Massif
const { count, name, active } = toRefs(state);

//  Absolument TOUS MAINTIENNENT UNE LIAISON CACHÉE  BI-DIRECTIONNELLE SYNCHRONISÉE PARFAITE avec le grand Object Proxy !
count.value++;
console.log(state.count); // 1

name.value = "Vue 3";
console.log(state.name); // 'Vue 3'

state.active = false;
console.log(active.value); // false
```

## Cas D'Usage Primordiaux en Entreprise

### 1. Renvois de Datas en fin Composables Magiques

C'est LE Moteur essentiel pour concevoir des Composables modernes sans tuer le dev :

```typescript
import { reactive, toRefs } from "vue";

function useMouse() {
  const state = reactive({
    x: 0,
    y: 0,
  });

  function update(event: MouseEvent) {
    state.x = event.clientX;
    state.y = event.clientY;
  }

  window.addEventListener("mousemove", update);

  // Renvoyez TOUJOURS vos états avec toRefs() pour que les imbéciles de consommateurs extérieurs puissent sauvagement le déstructurer en JS sans risquer la perte de vie !!!
  return toRefs(state);
}

// Le Développeur Consommateur lambda peut de suite l'exploser pour le JS du template sans tuer l'App :
const { x, y } = useMouse();
```

### 2. Explosion Totale (Déstructuration) Violente des Composants `props` Enfant

```vue
<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{
  count: number;
  label: string;
}>();

// ❌ LE JS TUE L'APP ET PERD SA MAJ UI !!!
// const { count, label } = props

// ✅ CONSERVE LA MAGIE DES UPDATES PARENTS MOTEUR GRACE A L’ARMURE DES REFS
const { count, label } = toRefs(props);

// Vous pouvez utiliser au poil maintenant `count.value` and `label.value`
// Et OUI ILS SERONT TOTALEMENT MIS A JOUR QUAND LE COMPOSANT PARENT ENVERRA UNE NOUVELLE PROP !!!
</script>
```

### 3. Le Passage Fin aux Autres Composables Exigents Ref

```typescript
import { toRef } from "vue";

function useFeature(value: Ref<number>) {
  // Il exige d'avoir une Ref en argument absolu !
  watch(value, (newVal) => {
    /* ... */
  });
}

const state = reactive({ count: 0 });

// On ne lui donne pas un bête un Int : On explose chirurgicalement en  ref() cette petite sous-partie demandée
useFeature(toRef(state, "count"));
```

## Le Combat Difficile : `toRef` Vs `computed` ?

```typescript
import { reactive, toRef, computed } from "vue";

const state = reactive({ count: 0 });

// toRef: OFFRE UNE SYNCHRONISATION ÉNORMISIME A DEUX SENS
const countRef = toRef(state, "count");
countRef.value = 5; // Mute en retour magiquement la structure mère state.count  !! Boom

// computed: EST STRICTEMENT UNIDIRECTIONNEL A SENT UNIQUE (À Moins d'en faire un lourd 'Writable Computed')
const countComputed = computed(() => state.count);
// countComputed.value = 5  // ❌ ERREUR COMPILATEUR ! Les Computeds de base sont figés en Lecture Seule Read-Only Absolue !
```

Le Concept Clé Final :
Utilisez de Force `toRef` pour lier de bêtes valeurs à 2 sens dans vos architectures et variables JS (Formulaires..). Utilisez à contrario un Grand `computed` pour tous vos calculs finaux "Dérivés" Maths ou String !

## Immenses Ressources Utiles

- [API Officielle de toRef and toRefs](https://vuejs.org/api/reactivity-utilities.html#toref) — Document très complexe de toutes les astuces API de base de vue sur le sujet !

---

> 📘 _Cette leçon fait partie du cours [Maîtrise de la Réactivité Vue](/vue/vue-reactivity-mastery/) sur la plateforme d'apprentissage RostoDev._
