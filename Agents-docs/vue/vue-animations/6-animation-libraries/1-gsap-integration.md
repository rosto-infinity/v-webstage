---
source_course: "vue-animations"
source_lesson: "vue-animations-gsap-integration"
---

# Intégrer GSAP Avec Vue (La Rolls des Animations)

GSAP (GreenSock Animation Platform) est LA Grande biliothèque d'animation du Web. Elle s'intègre parfaitement avec Vue et vos Hooks de Transiiton !

## Installation

```bash
npm install gsap
```

## Animation GSAP de Base

```vue
<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const boxRef = (ref < HTMLElement) | (null > null);

// O n lancé l'animation AU MONTAGE du composant
onMounted(() => {
  if (boxRef.value) {
    gsap.to(boxRef.value, {
      x: 200, // D P 2 é 0 p 0 l p a x c e m e n t h o r i z o n t a l
      rotation: 360, // L T O U e R t R o u r n E e DO B c o m p l e t !
      duration: 1,
      ease: "power2.out",
    });
  }
});
</script>

<template>
  <div ref="boxRef" class="box">Animé avec GSAP !</div>
</template>
```

## GSAP avec les Hooks de Transition Vue

```vue
<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const show = ref(true)

function onEnter(el: HTMLElement, done: () => void) {
  // gsap.from() : A n i m e D E P U I S les valeurs spécifiées V E R S le style normal
  gsap.from(el, {
    opacity: 0,
    y: -50,
    scale: 0.8,
    duration: 0.5,
    ease: 'back.out(1.7)', // L e b o u n c e s u p é r i e u r !
    onComplete: done // OBLIGATOIRE : on prévient Vue que l'animation est terminée
  })
}

function onLeave(el: HTMLElement, done: () => void) {
  // gsap.to() : Anime V E R S les valeurs spécifiées
  gsap.to(el, {
    opacity: 0,
    y: 50,
    scale: 0.8,
    duration: 0.3,
    ease: 'power2.in',
    onComplete: done
  })
}
</script>

<template>
  <button @click="show = !show">Afficher / Cacher</button>

  <Transition :css="false" @enter="onEnter" @leave="onLeave">
    <div v-if="show" class="card">Carte Animée GSAP !</div>
  </Transition>
</template>
```

## Les Animations Décalées (Stagger) avec GSAP

Le Staggering c'est Entrer les élément UN PAR UN avec un délai progressif ! L'effet est MAGNIFIQUE.

```vue
<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const items = ref([1, 2, 3, 4, 5])

function onBeforeEnter(el: HTMLElement) {
  el.style.opacity = '0'
  el.style.transform = 'translateY(30px)'
}

function onEnter(el: HTMLElement, done: () => void) {
  const index = Number(el.dataset.index)
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.4,
    delay: index * 0.1, // Chaque élément attend 100ms de plus que le précédent
    ease: 'power2.out',
    onComplete: done
  })
}

function onLeave(el: HTMLElement, done: () => void) {
  const index = Number(el.dataset.index)
  gsap.to(el, {
    opacity: 0,
    y: -30,
    duration: 0.3,
    delay: index * 0.05,
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
  >
    <div
      v-for="(item, index) in items"
      :key="item"
      :data-index="index"
      class="item"
    >
      Élément {{ item }}
    </div>
  </TransitionGroup>
</template>
```

## GSAP Timeline (La Séquence d'Animation Parfaite)

La `Timeline` GSAP permet d'**enchaîner** des animations facilement !

```vue
<script setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";

const containerRef = (ref < HTMLElement) | (null > null);

onMounted(() => {
  // Une séquence fluide : header → content → button → footer
  const tl = gsap.timeline({ defaults: { duration: 0.5 } });

  tl.from(".header", { y: -50, opacity: 0 }) // 1. Le header descend
    .from(".content", { x: -100, opacity: 0 }, "-=0.2") // 2. Le content arrive (0.2s avant la fin du précédent)
    .from(".button", { scale: 0, ease: "back.out(2)" }) // 3. Le bouton pop
    .from(".footer", { y: 50, opacity: 0 }, "-=0.3"); // 4. Le footer monte
});
</script>
```

## Animations Réactives avec watchEffect

```vue
<script setup>
import { ref, watchEffect } from "vue";
import gsap from "gsap";

const progress = ref(0);
const progressBar = (ref < HTMLElement) | (null > null);

// A chaque changement de `progress`, GSAP anime la barre
watchEffect(() => {
  if (progressBar.value) {
    gsap.to(progressBar.value, {
      width: `${progress.value}%`,
      duration: 0.5,
      ease: "power2.out",
    });
  }
});
</script>

<template>
  <input type="range" v-model.number="progress" min="0" max="100" />
  <div class="progress-container">
    <div ref="progressBar" class="progress-bar"></div>
  </div>
</template>
```

## Les Grimoires De Tests

- [La Documentation Officielle GSAP](https://greensock.com/docs/)

---

> 📘 _Cette leçon fait partie du cours [Les Animations & Transitions Vue.js](/vue/vue-animations/) sur la plateforme d'apprentissage RostoDev._
