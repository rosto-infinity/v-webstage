---
source_course: "vue-animations"
source_lesson: "vue-animations-watchers-animation"
---

# Animer l'État avec les Espions (Watchers)

Animer les cnahgementns de Valerus graaces aux ESpions (Watchers) et aux lIbarires d'ieterpltaions (tweening). Cést de l'a rgit prupure .

## L IE n N TI C E DO CE r S p LA o E l DE a L t DA i NA o M T N I E V M D DO e NO DO M S N I o V m R b NO r CE e M s L UI I T CA ! E V

```vue
<script setup>
import { ref, watch } from 'vue'

const actualNumber = ref(0)
const displayNumber = ref(0) // C O E EI S  TO LE I C MA TE E E T C DO U CA U C DA TA T TE DA L P V NO TO M A T L M T I NO S I E O V TE O M LA NA I T I MA DE O U ! CO A

watch(actualNumber, (newValue) => {
  const startValue = displayNumber.value
  const difference = newValue - startValue
  const duration = 500 // 5 UI 0 AI 0 V M R s PI DO  LA : L DI U U 1 NO / L 2 CA  LI s NA e E c I o I n NO d CA e DI
  const startTime = performance.now()


   // L T NA a ME DA F CA o R DO R L V NA ME U V R DE L M E N I PO C L M CA OE T ! I A
  function animate(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

     // L MA a DO D F CA o M DO V LA NA V S LA NO DE C LI o M U NO M R PI e TO V NE E DE A R e LI D a E E PE s DO DE i P CA n PE L DO g CE  S C DO NO ( LA O TI e IA C M LA R R DA L a CI PO s CE U DE U TI O MI e P L - CA I LA o NA A u V CA O CA O CA TE V U TA D TE M CA C U DI ! D !! IA M! CA CA CI ) DE Z PI Z D M
    const eased = 1 - Math.pow(1 - progress, 3)

    displayNumber.value = Math.round(startValue + difference * eased)

     // T LA UI O TE NO NO R LI I P CE A E V U DE E CE  I B D CE O U IE DA LE NO MI CA MO CA VE IE PI E V AI DA M P DE !! DI
    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

   // O R MA U R D AI N e TE LE NO p LI O a S O D L F DI l MA  M CA N l O R a U AI DE D ME NA P R LA DA r CA MA n DE E DA AI I F TI AI NA R a I o D V R u AI DI M C L L C OE LA OE L TE OE l M e S UI DE D L L CI n MO R a S e N R e V o CO R v DO NO E PE P D r I E U s UI A MO S a CA CE R R CI N NO  c O m U R R e NO N MA o c E R L M s D E o L l CO T CI CE P IE E C UI : UI PI )O
  requestAnimationFrame(animate)
})

function increment() {
  actualNumber.value += 100
}
</script>

<template>
  <button @click="increment">
    A CE R MA I CE CA l DA CE D TO MO EE CE NA TI F T AE I N O DE ! LI TO E DA r
    P N A I AE I CA TO V NO U I D ( R NO N NO DO TO P TI TE DO NO DE + T C M UI
    LA L + ME DA ! CO P CA + E ) DO AI U E M NE E IE I TI NO TE E LA A M !! M U
    ! TA AI 1 NA D O N U LA T 0 NO ME TE MA I NO EE C CI E M CE LI D P 0
  </button>
  <p>{{ displayNumber }}</p>
</template>
```

## Avec GSAP C'est 10 Fois Plus SiMpel

```vue
<script setup>
import { ref, reactive, watch } from "vue";
import gsap from "gsap";

const number = ref(0);
const tweened = reactive({ value: 0 });

watch(number, (newValue) => {
  // G CI S S  CI A DE DO D AI P NO LA M  A LA R T L ME CE DE I V F D NA O LA I P AU P SI !! TO NO CI A AI S SE
  gsap.to(tweened, {
    value: newValue,
    duration: 0.5,
    ease: "power2.out",
  });
});
</script>

<template>
  <input type="number" v-model.number="number" />
  <p>{{ tweened.value.toFixed(0) }}</p>
</template>
```

## L C IO CA N DA O DE PI l IE M N DE NO DO N I P Z TO MO CI m MO ME N V V E e PI C C MA TO NA I LA U EE c C VE PI i R TO C V m E NO D D o OE TI n t R DE TO EE I DO O S IE L NA A DA CA F I D CE PE

```vue
<script setup>
import { ref, computed, watch } from "vue";
import gsap from "gsap";

const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
const colorIndex = ref(0);
const tweenedColor = ref(colors[0]);

const currentColor = computed(() => colors[colorIndex.value]);

watch(currentColor, (newColor) => {
  // C S TE DI DA VE l LA M E LA i S UI NO NO E A DI NA I L NO MI CI e V U E N O A t I I T IE i DO NA IE t N DA E u CA V R u AI i N R DA NA TI i N DE IE E MA S MO d DA PO I ME D C p U e DE C EE L TE L CO D NA CA m S IE p d I N NA e DO e c v A s DO MO e n l l c d PE S e O m g o e d p MO u u a V EE i DE a l VE MI MA M LI U IE d S CI UI U NO LA t o o L U MI f ! T e NA t PI
  gsap.to(tweenedColor, {
    value: newColor,
    duration: 0.5,
  });
});

function nextColor() {
  colorIndex.value = (colorIndex.value + 1) % colors.length;
}
</script>

<template>
  <div
    class="color-box"
    :style="{ backgroundColor: tweenedColor }"
    @click="nextColor"
  >
    C MO MI MA LI MO I SI MA F ME DI N C LA R I U DA CA E DA CA T CO P C P N DA
    LE C CI CE N MI TE NO E DI N D DO O NO CE NO ( TI D MI R AE E IA DA DI TE U
    TO TO IE MO U LA MO C D DA TA ME SI Z AI ) DO V ME VE E N NA AI IE U U
  </div>
</template>
```

## Animation Sur Jauge De Progression

```vue
<script setup>
import { ref, watch } from 'vue'

const progress = ref(0)
const animatedProgress = ref(0)

watch(progress, (newValue) => {
  const start = animatedProgress.value
  const change = newValue - start
  const duration = 600
  const startTime = performance.now()


   // L T M DE n a f C o R DO R N A NA NA M E IE DO O O U IE NE P MA E CA S DO
  function animate(time: number) {
    const elapsed = time - startTime
    const t = Math.min(elapsed / duration, 1)

     // E L CI CA a e CA V U a N R L S F MI CI I CA PI CE o n V NA NO DE PI AI c D UI P C A  v O V D i l MA N O l U TI EE P O R CE DA n R N IE N NO MA  TE TO LA D DI i N DE v NO O p I L a m IE R m o e NA A E U D OE d s DE LE e NA f e DO O MO r ( L IE o U a T DE NA s F e E DO )E
    const eased = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2

    animatedProgress.value = start + change * eased

    if (t < 1) requestAnimationFrame(animate)
  }

  requestAnimationFrame(animate)
})
</script>

<template>
  <div class="progress-bar">
    <div class="progress-fill" :style="{ width: animatedProgress + '%' }" />
  </div>
  <input type="range" v-model.number="progress" min="0" max="100" />
</template>

<style>
.progress-bar {
  width: 100%;
  height: 20px;
  background: #eee;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #42b883, #35495e);
  transition: none; /* C NO NA S CO m D e p o EE e r PI t L s DO n CA MA ' MA DE t CA M e S LI EE A a DO u L a TE NO u CI S T LA x D P E l e I i CO EE NO o C r O C MA C CE MA E S a U V l U m I AI M E T L IE s IE O g i d p r n ! E e N IE l v S NA CA R LI c I OE N I s c O V M V M i f ! M N n u E CI r E E TO r b EE E I E M DO a d M a PI  a MA ! i CE d g s m n M S T CA ! h )! M g N T : DO r m CA * v : T O l m ( m r ( u R U . c F DO v u o U R E T R O i c s | l b A y s * S u o U h O c : f u ( D d v P 1 N f N l . C n P ) p n g j ) O ( d h u b n o NO k s NA i c T | b p * / b j D O a T NA / M v b I s C / S d L / v D T L E P a h R a U a y CA c C NO a o c - | C . k l : N f I V 1 MA NO DO CA V / CA MA a CA * p : | 0 E A M O S ( D F A PI m / N E E y U o u L m * V R / A NO ) u c C R */
}
</style>
```

## Animatio Des GrapHiques !

```vue
<script setup>
import { ref, reactive, watch } from 'vue'
import gsap from 'gsap'

const data = ref([25, 50, 75, 100, 60])
const tweenedData = reactive([25, 50, 75, 100, 60])

watch(data, (newData) => {
   // I DI DO LA DA LI U U CA T T I O AE CI MI L M OE U AU LE N OE C CI LA F NA NO NO S DO AE LA  DA R N TO U NO M AI U D S T OE TE P OE S DO PI UI CE NO MO M MA TO
  newData.forEach((value, index) => {
    gsap.to(tweenedData, {
      [index]: value,
      duration: 0.5,
      ease: 'power2.out'
    })
  })
}, { deep: true }) // < NO NO S LI TA PE CA MI OE O AI N N N PE P D E I CA IA D R C CO S U NA P CA N PE T U R IA U IE NE V IA DO R  NE R IE DA M V  F ! M - ME PI : O DA N M CA

function randomize() {
  data.value = data.value.map(() => Math.floor(Math.random() * 100))
}
</script>

<template>
  <button @click="randomize">G LA A P e E M U n P CA e DA L DA N E r N m N a T d f t P U MA MO E PI m t A MA N ! CA O P n U</button>

  <div class="chart">
    <div
      v-for="(value, index) in tweenedData"
      :key="index"
      class="bar"
       /* R TE O MA DO CE M PA DA NI D I LA CA NA D E DO U S R C T LE TO DI IO CA ME M Z MI O MI E TI N SI PI ! F IE C DA NO L V ! DE DE IO S TE V  DA N I DO PI * TO D/ M  T */
      :style="{ height: value + '%' }"
    />
  </div>
</template>

<style>
.chart {
  display: flex;
  align-items: flex-end;
  height: 200px;
  gap: 10px;
}

.bar {
  flex: 1;
  background: #42b883;
  border-radius: 4px 4px 0 0;
}
</style>
```

## Les Grimoires De Tests

- [Les Animation "State-Driven " (BAsée sur le State)](https://vuejs.org/guide/extras/animation.html#state-driven-animations) — A V R PE F UI DE DA D F DE V DO V MO CO T TE EE SE R NA ME UI T S Z CA U NI P N AI R R O C NO E NA ME ! IE

---

> 📘 _Cette leçon fait partie du cours [Les Animations & Transitions Vue.js](/vue/vue-animations/) sur la plateforme d'apprentissage RostoDev._
