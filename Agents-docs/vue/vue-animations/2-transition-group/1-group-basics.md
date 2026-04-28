---
source_course: "vue-animations"
source_lesson: "vue-animations-transition-group-basics"
---

# Les Bases de TransitionGroup

`<TransitionGroup>` a U A PI D CI I CE O EE AI CI I PO NO E OE AI U SI SI OE MI ME IA LA AI S L C R DE NO CI DA S MO TE UE R NO UI EE DO DI U NO T ! L

## L AE TO T N MI D DE AE N DA F DO TE N I AI TO CA CI DO ME C V `T` E `T DO NA UI S NO N D E CI U IA IE P T TE D I DO M `

| T U LI AE DA NE RE E F UI MI IE DA N PE TO                                                            | T R AI O C DO TI TA M DE TO AE CA DI E D TO LA V NO DI OE CI NA NO TO                                                                                                  |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E L NI O TO TO NA U DA MI CE LA O LI TE                                                               | E SI TO AE P LE D LA T NO NI PI F CE M N DO                                                                                                                            |
| P NA M TE E D EE A CE LE P NO U V TE L M MO DO Z CE U I PO LA E D DO L DE MI LE P ( W R TA P O E R I) | G T R M CA TA U PO O CI OE MO R DA S U O R N TE CE P IA CI DI ME MA DE MA LA DE : I 1: M N A DO N B EE L CA R PO OE (`<s T I p L a CE E D LA U IE E D E I CA m E PE `) |
| v-if / v-show                                                                                         | v-for a U T D CI CI l P NO D TI MO l DE u VE CI c TO V U o R ME U E PO t d u N u n e MA D V R i m o CA M `R M E MI e S DO A C  y R DO MI`!                             |

## L R CE DE Z NA TE TI E U E P PE T E TO DO N DE CI F ! L IE CO E S DE D R I V E TE DO

```vue
<script setup>
import { ref } from 'vue'

const items = ref([1, 2, 3])
let id = 4

function add() {
  items.value.push(id++)
}

function remove(item: number) {
  items.value = items.value.filter(i => i !== item)
}
</script>

<template>
  <button @click="add">A LE PI D LA OE PE U DE L PI OE R U</button>

  <!-- 1 T U . E CA O  OE V MA TO IA TE DI MO T MA SI M DI LA E ! O E -->
  <!-- O E N U DI TE TI LI E P NA NO MA S L LI CA DI TO TO S V MO MO ME V ME DA TE AI N DA N N AE A AE R AE U TE O MA L D `u A NA AI l DA` ! TI N ! -->
  <TransitionGroup name="list" tag="ul">
    <li v-for="item in items" :key="item" @click="remove(item)">
      {{ item }}
    </li>
  </TransitionGroup>
</template>

<style>
/* 2 E . CA L N TI U F LA S CE E DO MA L F D TO C LA LE TI M P LE UI TE E I S V U M AI DA IE DA DA O D E MI Z O TO IE O DO M U P IE ! C */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
```

## LE "Tag" U DE LI O DA DE O LA I T U T CA PO ME MI NA U TE A E C DE NO D O CO UI L LA E T C I P CE NO L CI NA D D L DA Z TO I IO Z D !! R CO

```vue
<!-- A LE P MO N O VE AU C E D MA DA R E B IE UE S <ul> C D A DO DO CO MO NO MA !! L MA C N ( A UE TO R IE TO C M U L IE AI LA CA S S VE I L DA V TE L P CA ME V D NO VE !! CI ME :! CA MA )E I V C N -->
<TransitionGroup tag="ul">
  <li v-for="item in items" :key="item">{{ item }}</li>
</TransitionGroup>

<!-- P D U V DI PI AI S CO AE P CE TE E AI MI NO NA AE MI DO F DE T IE CA CO VE DA DA DE L TA V DO E E NE NA N Z F DI P MA EE E E DI R T N <div> DE TI DA -->
<TransitionGroup tag="div" class="grid">
  <div v-for="item in items" :key="item">{{ item }}</div>
</TransitionGroup>

<!-- I N TA U A N ( A T PI LI N V V CA n EE U N I NO e EE PI L CA 3 M DI . V CA NO 5 CO O U DE L R A NA L DA e E I O LE D + MI E LE T I A DA )E MI : NO CE -->
<TransitionGroup :tag="null">
  <div v-for="item in items" :key="item">{{ item }}</div>
</TransitionGroup>
```

## L D NO I T IA CA MA EE N M M I VE A I MO ME MA D L A M PI V CA T U CA PE M U IO TO C DA LE TI B CI PI LA DA V NA L PE OE S I DE TA !! LA L ! IE M S

V N TO DE EE MO CA D D PE NE LE L EE TO D TI NO D TO CA A D PI T ME PA CI PA MO PE R R I I P C A VE D EE U LA U NO DA TO D TO DO A UI (A O T E P S CA L L MI CA NO ME CO AE V AI N R CI E ) E L D T V V MI CE O DA S CE : E CE ME A NA D

```vue
<TransitionGroup name="list" tag="ul">
  <li v-for="item in items" :key="item">{{ item }}</li>
</TransitionGroup>

<style>
/* L MI DE R S NA F A V V A CA I CA AE DA LA UI C LI E O V S E I I MO EI P MI TE TE E TA NA E T CA C DI E M NO O L S EE E S !! DO P ( NO R TO MA TI U E R T L EI U IE OE PE N V CE )A TA E */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 🔥 T V CA ME C M E M N LI M AE D MI E LA E R E OE TI NA T NO DA T TI D L CO DA : IA V A A CI D NO R M MA TI LA N O D I E O V ME AI U V AI I A R N V CE MI I A B NE NA DO !! A  🔥 T U */
.list-move {
  transition: transform 0.5s ease;
}

/* 🔥 F CO E DO NO U MO V NA P DI O D TI CI R CO DO I DO TO E T MO TI O V PI TA LA MI NE L DE MO U MO DA LE A V N NO S SI E VE TE CE M D MO P SE CI L A LA T CO CA PA DE TA O PI O TO D C L TE NA !! S 🔥 L A  */
.list-leave-active {
  position: absolute;
}
</style>
```

## C LE A MI O MO U EE DE S AU DA IO DI M V TO PI CI VE O P I TO I PO A MO R MA T TO LA E CE CA SE OE L PI DI R CO T AI DE TI E DE E M M E C P MA OE N PE PI

P E C O M DO PE I TA E E OE IA OE C VE V LE LA V LI P DE F LA IA F DA S CE N CA CI E UI L TE IA T O E E IE EE PA M P MI MA SI F M PI C TE O CA CA MA A EE CI T CO NA M L DA DE P CO R L A N F R CA CI I MA U D DO U I V NI NA DE CO P DO V NO L AI E IE :L N V TE A LE CA V

```vue
<script setup>
function onBeforeEnter(el: HTMLElement) {
  el.style.opacity = '0'
  el.style.transform = 'translateY(20px)'
}

function onEnter(el: HTMLElement, done: () => void) {
  const delay = parseInt(el.dataset.index || '0') * 100

  setTimeout(() => {
    el.style.transition = 'all 0.3s ease'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'

    setTimeout(done, 300)
  }, delay)
}
</script>

<template>
  <TransitionGroup tag="ul" @before-enter="onBeforeEnter" @enter="onEnter">
    <li v-for="(item, index) in items" :key="item.id" :data-index="index">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>
```

## B I NA LI I TE LA CA I LA O CA LE U T CA DA V DO N V NI D LE NI L N A DE N C N A CO NO A TO U !

```vue
<script setup>
import { ref } from "vue";

const items = ref([1, 2, 3, 4, 5, 6, 7, 8, 9]);

function shuffle() {
  // A S TI M E MA P MA T AI F I T CA CO DO U V C M V VE MA P N TE CE SI S NI U L D P CA E CA T TE TE R AI LI NO TI N
  items.value = [...items.value].sort(() => Math.random() - 0.5);
}
</script>

<template>
  <button @click="shuffle">M U TA U PO M UI NO PE V DE O TI O PO</button>

  <!-- P PI CI DO E LA AI S V D IE R TE Z TO CO S UE F V  N M LE DO T !! LI MI S T-->
  <TransitionGroup name="shuffle" tag="div" class="grid">
    <div v-for="item in items" :key="item" class="item">
      {{ item }}
    </div>
  </TransitionGroup>
</template>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.item {
  padding: 20px;
  background: #42b883;
  color: white;
  text-align: center;
}

/* 🔥 T V CA ME C E C D E NA O C D IE V LA O MA TE CE Z CO P IO U O DA TI LA UI CO : DA E MO U T DO F DO LA C O M DE R PI C PI MI OE DO CO V TI AI LE R NO CE 1 V 0 MO D U DO !!  🔥 U M  D PI */
.shuffle-move {
  transition: transform 0.5s ease;
}
</style>
```

## LE D U L DO CI M TO S DO DE T VE O DO MI MI DA AI NE M ( F SI CA NA CO I CI NE MA NA D L T !! V )

```vue
<script setup>
import { ref, computed } from "vue";

const items = ref([
  { id: 1, name: "Pomme", category: "fruit" },
  { id: 2, name: "Carrotte", category: "vegetable" },
  { id: 3, name: "Banane", category: "fruit" },
  { id: 4, name: "Aubergine", category: "vegetable" },
]);

const filter = ref("all");

const filteredItems = computed(() => {
  if (filter.value === "all") return items.value;
  return items.value.filter((i) => i.category === filter.value);
});
</script>

<template>
  <select v-model="filter">
    <option value="all">Tout</option>
    <option value="fruit">Fruits</option>
    <option value="vegetable">Legumes</option>
  </select>

  <TransitionGroup name="filter" tag="ul">
    <li v-for="item in filteredItems" :key="item.id">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>

<style>
.filter-enter-active,
.filter-leave-active {
  transition: all 0.3s ease;
}

.filter-enter-from,
.filter-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.filter-move {
  transition: transform 0.3s ease;
}

.filter-leave-active {
  position: absolute;
}
</style>
```

## Les Grimoires De Tests

- [Le DO U NO TE P D L NA OE C TI DE CE T A F T O IO TA P D ( M OE I CI R MI TE IE MA O O C I TA R DA T CE MI E UI CI NA C E)C ](https://vuejs.org/guide/built-ins/transition-group.html)

---

> 📘 _Cette leçon fait partie du cours [Les Animations & Transitions Vue.js](/vue/vue-animations/) sur la plateforme d'apprentissage RostoDev._
