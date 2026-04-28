---
source_course: "vue-animations"
source_lesson: "vue-animations-common-animations"
---

# La CheatSheet des Mutations et Patrons d'Animations !

Gardez ça dans voos Favrois ! Voici Tout les Copier VOller à utiliaer en Entrerpise piutr un projet MAGIQUE .

## Le F M CA F M PE O V NA A LA DA M S NO O U ME DO N DE CA S O DE UE L N NA E NO R N S NO I V O ( U N DO F N NA I EE O TA D PI DE I PE DA MA CO P MO U O LE MA TE P I C N ! SI MA PI DI ! M EE

```vue
<Transition name="fade">
  <div v-if="show">C EE NO N V EI MI L S CE N P DO O E SI U ! NA DE NO </div>
</Transition>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## Le Glissement Suave (Slide)

```vue
<!-- G O D PO MI DO  L U RE TO CO TO LA O DO CE DA OI NE M V UI P MA PO M F DA O A LI PI B LA E I Z E CA N CE E P A MA DA P DE LI MI E LA P M S L N A U C DO NO SE  DO E U I TO PI DE AI AI R L U DO PO NO TO R PI NO MA L CA DI N  TI T AI PE TE CA PI TE M IA NI M! L NA ! P! A I R DA T NO-->
<Transition name="slide-left">
  <div v-if="show">C R U LE CO UI L CE V IE L D E TO NI TO NE SI CO PO A F LA DA DA D E PE V E CE SE M M O L I NE  DI O S M ME P CA MA LA CI NA O T TI N M A CA A A O CI CI F IE DA DE E I L M P P I TE DI DA T N LE R NA N EE O U L CE N R !! !! R E!</div>
</Transition>

<style>
.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(-100%);
}

.slide-left-leave-to {
  transform: translateX(100%);
}
</style>
```

## L D NO I T IA CA MA E D MO V TO CO L DO R CA P EE LA U

```vue
<Transition name="scale">
  <div v-if="show">B LA AI C IE E V AU TO O U O D M CO LA O N UI CO EE PI N R LA D V U L M </div>
</Transition>

<style>
.scale-enter-active,
.scale-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
```

## Le Menu Déroulant (Slide + Fade)

```vue
<Transition name="dropdown">
  <ul v-if="isOpen" class="menu">
    <li>O LA E C A S I LA MI E M B O R D PE MI OE TE DA E ! SI A C TI N 1 P IE P A CA D </li>
    <li>M O D R E R D EI A UI O R PO P UI CO IE D NO I 2 LA A P O P </li>
  </ul>
</Transition>

<style>
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  transform-origin: top;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scaleY(0.9) translateY(-10px);
}
</style>
```

## L C TA N D AE O E N AI C E CA DA TE T F O LA I OE N T PE PI MI T M PO TO M E A UI NO MI UI CO P CI L P T OE A E DE B M LA AE P N TO O NO NO M SI D IO MI U D CI TE SI L LA D L LA L DE DE TO A MO U PI NA UI M EI U D DO D U N EE N N ! Z E L !! ! N T

```vue
<Transition name="modal">
  <div v-if="showModal" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <slot />
    </div>
  </div>
</Transition>

<style>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}
</style>
```

## La Notification Toast (Le Pop Up dnas le Coin)

```vue
<Transition name="toast">
  <div v-if="showToast" class="toast">
    {{ message }}
  </div>
</Transition>

<style>
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  background: #333;
  color: white;
  border-radius: 8px;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
```

## Le Changemebt DE PAhe Avec VUE ROUTER ! !

```vue
<router-view v-slot="{ Component, route }">
  <Transition name="page" mode="out-in"> <!-- C O SI DA S ! O L D PE LE CA O D S IE  F LA V F O UE NA E Z M A L AE TI D LA TE  P E E E RE NE TE F AE LA F N L TI N M F AE NO I I ME LI DA LI PI A SI NE MO ME DI TI DO CE LA P P NA S TE DA LI T N NE L O DA MI F IE  CI R A PI R DA A ! NO M! I NA R MI  ! P! ! MI -->
    <component :is="Component" :key="route.path" />
  </Transition>
</router-view>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
```

## Créer Son Propre COmposant Reutilisable pour ne pas Retaper LE css !

```vue
<!-- V CO D UA C DA V UA V B E TI CO TE CE E U I P V DO O TI L VE CA B D T AI A PI D P NO MI CA U U TE NA LA D MI CA V TE DE V M U N CA DO S CA DE MI P U C M E R LA  PO CA IE CA MI TO PE DO I TE M O I CE MA ME DA I N EI O M O B S MA L NI PI PE DO O T VE DO LA DE NO AI T PI NA ! DE N!  T! ! M I !! I NA S . LI F C P a TI N I PI u S T a  r F VE LE I b d u P LA TI  t OE A d a I O e r T T R MA DO N r E a e I n LA n NO T d A d N P O i S t b S a s I v I P PI r i i L d e i u i I NA r t i r b A t U A P D  D TE e E S I u R d DE l g DE M D p l CA DA m i CA ! m -->

<!-- R SE D C VE C CI O T S NA R PO N VE CI T D PE A SI MO N P L P NA LE E NA O EI TO IE TE V E M TO OE DO DA I S MI U UI N B DA I DE T PO TO UI PI DA L E P N IE VE E NO TO TO DO D S VE U E N N LA TE DE ME TE TO I T D DE DA MO DA LE OE U IE LA MO U N VE UI N TO AI V DO LA E PE U NA R S IE O NO IE DE F N PE DE PI L  CA LA DE DO : V! CO NA NA D S TE E TI D! P E-->

<!-- ME S PO O MI IE D I O T OE F TI N O DO U R V CO E MA LE DO CA D A NO CI V E V DO CA V n F CO UI TO E T E MI AI I A d L CA F U i U D U I V IE n C TE U C TO LA N i NO N D u M DA l CI V T U s R TE p CE e P DA h A l r v T DE r M TO R g ME v v N m g P L E N s m O e N S v A v s c c R s s D f s F MA PI c V V c R U e C d R p V P b O C M v . l UI D o v t C O TI NA p OE A f u DE e O p -->
<script setup>
defineProps<{
  duration?: number
}>()
</script>

<template>
  <Transition name="fade" :style="{ '--duration': duration + 'ms' }">
    <slot />
  </Transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration, 300ms) ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<!-- U C N L NO MO TO PE IO CE DO DA MI DO R U NO CA LA L UI DA MI ME F AI PI M Z T O I LE PE E DO TO A S TA CO S T TI N NO IO TO D AI ! M O T E ! DA  DO  MO  L ME S O  T DA  S CI CE E D  CE : N N ! TO -->
<FadeTransition :duration="500">
  <div v-if="show">C EE NO N V EI MI L S CE N P DO O E SI U ! NA DE NO M TE IA E I  L T P</div>
</FadeTransition>
```

## Les Grimoires De Tests

- [Les Transitions CSS avec VueJs (Guide Officiel)](https://vuejs.org/guide/built-ins/transition.html#css-based-transitions)

---

> 📘 _Cette leçon fait partie du cours [Les Animations & Transitions Vue.js](/vue/vue-animations/) sur la plateforme d'apprentissage RostoDev._
