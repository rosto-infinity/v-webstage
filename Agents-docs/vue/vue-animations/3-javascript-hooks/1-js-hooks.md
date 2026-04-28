---
source_course: "vue-animations"
source_lesson: "vue-animations-js-hooks"
---

# Les Crochets (Hooks) de Transition JS

Les hooks JavaScript vous donnent un contrôle total sur les animations, permetttant l'intégration avec des bibliothèques telles que GSAP, anime.js, ou des animations su-rmesutre :

## LA LI CI ST TE E T DE E D S H DO OO O O K I S V DI I S B P L E M O S MO

```vue
<Transition
  @before-enter="onBeforeEnter"
  @enter="onEnter"
  @after-enter="onAfterEnter"
  @enter-cancelled="onEnterCancelled"
  @before-leave="onBeforeLeave"
  @leave="onLeave"
  @after-leave="onAfterLeave"
  @leave-cancelled="onLeaveCancelled"
>
  <div v-if="show">C EE NO N V EI MI L S CE N P DO O E SI U ! NA DE NO M TE IA E I  L T P</div>
</Transition>
```

## S I I G CI N MA A T MI U AE R NO E S D M DO E I S O H U O MO O K CI S TO

```typescript
// L DE ES M H N OO LI O K D S CA D DO E L N M T S RE D E E EE C CA DO
function onBeforeEnter(el: HTMLElement): void;
function onEnter(el: HTMLElement, done: () => void): void;
function onAfterEnter(el: HTMLElement): void;
function onEnterCancelled(el: HTMLElement): void;

// L V E R S E H O O M O K VE S DO D DO E PO S I O N R T I DO DO E I
function onBeforeLeave(el: HTMLElement): void;
function onLeave(el: HTMLElement, done: () => void): void;
function onAfterLeave(el: HTMLElement): void;
function onLeaveCancelled(el: HTMLElement): void; // U n IE UI q P u NO M F N O M t P D U m p L P o NO P u P D u a DO c NA U C E L U `s h V MO MO PI DO L MA R n MA `v d
```

## Animation Javascript Classique

```vue
<script setup>
function onBeforeEnter(el: HTMLElement) {
  el.style.opacity = '0'
  el.style.transform = 'scale(0.9)'
}

function onEnter(el: HTMLElement, done: () => void) {
   // D F MI R D DO DO LA UI CI F U MA NE LA L NO EI MA A U N DE TO I UI V PE B MA PI A PI T UI B IO D N !! NO DE M! R U
  el.offsetHeight // F S MA U I NO r PE DI NO PI T n CI e l U o N NO e NO ME D U A e N MI PI V TE DO N a f l M T o E T w U M M A n R e D A f IE l IE DE M N o S O LI M I N CO O M

  el.style.transition = 'all 0.3s ease'
  el.style.opacity = '1'
  el.style.transform = 'scale(1)'

   // A A O MA T LE P L N PE NI P TI DI N  `c E LE d DA E n PO ME PE PI  U  Z N CI ` M LA Q O NO U C A V MA P IE N  A N CE N DE LA P TO DI B NO DA V U F LE  P A PE M R D IO N DO I U P A DO I D DO NO E D MI TO CA DI I D DO ! NA R U
  setTimeout(done, 300)
}

function onLeave(el: HTMLElement, done: () => void) {
  el.style.transition = 'all 0.3s ease'
  el.style.opacity = '0'
  el.style.transform = 'scale(0.9)'

  setTimeout(done, 300)
}
</script>

<template>
  <Transition
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
  >
    <div v-if="show">C EE NO N V EI MI L S CE N P DO O E SI U ! NA DE NO</div>
  </Transition>
</template>
```

## U LI T AI L E MI E DA O L N I LA DE Z Z I AE IE M L CE Z S LA V I P E A Z E LE MA U NA A AE R O DA M `P O L N m O MA TO m N P l g LA MA E t a s l T A h LI N A CE d l`g l O LI DO S CA DO IE V DO V P P VE D NO

```vue
<script setup>
import gsap from 'gsap'

function onEnter(el: HTMLElement, done: () => void) {
  gsap.from(el, {
    opacity: 0,
    scale: 0.8,
    y: 20,
    duration: 0.5,
    ease: 'back.out(1.7)',
    onComplete: done // O OE C R D P O ON OE F LE I DA Z TO D A ! CA TE DO L U N AE I O : NO N D M DI N CA A PE EE DO U LI CE I E CO TE ME R CA MO V IE C NO ME  T VE TE L !! D MA
  })
}

function onLeave(el: HTMLElement, done: () => void) {
  gsap.to(el, {
    opacity: 0,
    scale: 0.8,
    y: -20,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done
  })
}
</script>

<template>
  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <div v-if="show">
      A LA L O NI AE TA IE D Z M LA O MA CA O V R CE LA E V U GSAP L TO MA CE P
      E TI E ! CE O EE P
    </div>
  </Transition>
</template>
```

## Les Aminatios Décallées aavec GSAP

```vue
<script setup>
import gsap from 'gsap'

function onBeforeEnter(el: HTMLElement) {
  gsap.set(el, { opacity: 0, y: 20 })
}

function onEnter(el: HTMLElement, done: () => void) {
   // O IO PE S PI NA LE M  LA O R L N CO NA DO TE NA I PI A U CA V  L LI D  E  T LE L E AI DI NO E E MA AE CA T I CO L TI TA DA V L T DI ( CE N Z L N O N L M U UI R IE C DO M R EI E CA E MA T Z ! LA UI R AE ! ) V NI T
  const delay = parseInt(el.dataset.index || '0') * 0.1

  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    delay,
    ease: 'power2.out',
    onComplete: done
  })
}

function onLeave(el: HTMLElement, done: () => void) {
  gsap.to(el, {
    opacity: 0,
    y: -20,
    duration: 0.3,
    onComplete: done
  })
}
</script>

<template>
  <TransitionGroup
    :css="false"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @leave="onLeave"
    tag="ul"
  >
    <li v-for="(item, index) in items" :key="item.id" :data-index="index">
      {{ item.name }}
    </li>
  </TransitionGroup>
</template>
```

## L LA CA P P MI O VE PE P M MA MO EI CA TI F DA LA AE DO IE

```vue
<!-- O LE U D E CO IE MI MI M M F NO DO D L C AI A L A N R L EE NO CI U D TO T D EE O NO PE LE D F DE DA R DA DO M UI MA ! V CE L I IE O PO N-->
<Transition :css="false" @enter="onEnter" @leave="onLeave">
  <div v-if="show">...</div>
</Transition>
```

L P O PO CE NA CE O N PO L LI D CE NA DO U AI VO N US E L M MI R D U V IE E TO NO A T CI P T EE EE TI MO E MO O SE IE R N NO LE UI E AI N TI TI Z : PI ME !! A TO CA I M : O CA !! !! N NA D F V LA VE PI D O

- I DO PA P S DE N T E NO I O DO AI PA MA E EE B IE O DO NI CA VE TE LE CA N L LI N U T AI N L D EE O S ! LE LA CE O OE NA DA M NI VE O S L A
- D A DO d MA I b NA N CO U D CE TE DE L U L IE LE E A O e u i C V NA f P CI ! U
- D R C I DO PE N DE SI C D N P MO LI E N S MA S IE EI V MO L DO R CO L LE E L TA DI C O O D DE D MO LA LI P O TI OE MA Z I F C DA NE F D LE

## Les Animation Au Montagne (Apparisiont Initialea)

Animmer AU MONTAGE du compsoantsn (A l'initaialistion)

```vue
<Transition appear @appear="onAppear" @after-appear="onAfterAppear">
  <div>L S O DA MI N I A CA MA DE AU A M N V C DE ME MA I CI U MO V NO U S PE NA C C L MO P NA U DE NO I PA VE UI NA F E DI DA IO S P O CA E O IE S N P </div>
</Transition>
```

```vue
<script setup>
import gsap from 'gsap'

function onAppear(el: HTMLElement, done: () => void) {
  gsap.from(el, {
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power3.out',
    onComplete: done
  })
}
</script>
```

## Les Grimoires De Tests

- [Les Hooks T CE J O a DA AI N L T CA MI M LI N I LA VE S E DO CI e DO CI U M v MA D u DO C E NO D a v n u l D c m I IE g NO IE n v U DO T d S c U A V i c n NA c P i MI s ](https://vuejs.org/guide/built-ins/transition.html#javascript-hooks)

---

> 📘 _Cette leçon fait partie du cours [Les Animations & Transitions Vue.js](/vue/vue-animations/) sur la plateforme d'apprentissage RostoDev._
