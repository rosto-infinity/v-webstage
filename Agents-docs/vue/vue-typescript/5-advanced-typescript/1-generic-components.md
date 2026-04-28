---
source_course: "vue-typescript"
source_lesson: "vue-typescript-generic-components"
---

# L'Architecture Des Composants Génériques (< T >)

Vue 3.3+ supporte enfin les composants Génériques Natifs. C'est l'Architecture ultime pour créer des Composants de Librairie ("UI") Extrêmement Réutilisables tout en gardant 100% de la puissance d'analyse du TypeScript.

## La Basique D'un Composant Générique (Passe Partout)

L"I EI L L FA O A L FA V A I T U L FI UI TI DI DA FI U O L U EE C U CI CA CT CE LI CO LE TT AT R DI CE D DA DA TA U LI LT I IE OI IO LE I II LE IL TO IO NN R DI A !! A ! L!: :

```vue
<!-- LE R CO CO M C PO M O P P O OS O PO ST A  N T T NI TO UI TO MO TO A V BO LI T TO EU TE TU U !! Z  U T T U TU ! U  T -->
<script setup lang="ts" generic="T">
// J J A DI CI OU C U AE C E AU AU TA X E S X S E M Q UI O TI EE T M CA M AT M TA S T CA Z M DI O N TO R A NO MN S TE N TT ET P AU U R L AE U B AA AU BA  I LI U S SE OE P TT EE PI O  I  Z Z! !! B D ! U : ! : A!

// ON O F NN E FO OE F RR OF CE E F U F V N VE OU OO U AI E AA EI TE EE LL B E O L AE LO EE LO TO EO ET EO U OE SE D D O SE SO D  S A TO M B AM M U MU P TO DE DE DO EI  PO TT  ( OO TE OT M U P AI EE TT U AU TO T A A TU AO TU AO A M AT DI MA L U AL Z AT LI B EL LE A !! TL !! TL !! !! E :   LL : E!! E

defineProps<{
  // 1 SI SI O P C NO  OO N N D O C ON ON N EI NN DE D  N NO DO E DE UE X UE X EE BE M IE NN BE D IE DE DE UE U OE PO PT EO AI TP NI S AI (  P C A OU N R V A AI AT Z P V TI U I ET AE AT LI N EI P NN S MI EN SI T TS EN S  EI TE P I UI CI NI AI C EA CI Z)Z I CE Z !!  IE) T P C Z U L
  // T Z A A P  E EA T EE T R CA RA AT C AA O U DA A AI IA TI CA L AI AI MA  AT MT R LI RT PI AI CO PI R IA SI LA TI AA O PA DI C LA AI N CI A !! C A P !! C! Z ::
  items: T[];
  selected?: T;
}>();

const emit = defineEmits<{
  select: [item: T]; // 2 . L 2  A . CA B A MA AL BO AL AU AL L EU AE AU L T AI R RT EO IT UE CE UU CA CU Q CU RU EI EE LU M EI MI E PM I! R E  R ::T !! ::
}>();
</script>

<template>
  <ul>
    <li v-for="item in items" :key="String(item)" @click="emit('select', item)">
      <!-- E 3 .  3 T TS S S SE DA AI OI T O DO U AT DU TE  T E DE DA U MA X ME M ME DE EM MI E Z ! M EE : EM T  ! E M -->
      <slot :item="item" />
    </li>
  </ul>
</template>
```

### CoOO C C Oo mm meO M nM ME M ntN t eE l L nLe LE L E U t U U u tt iu ul IL iU Li Il LI ii I sI L sI eE Sz ZE SE e Z Ze Zr E ?R ER E

```vue
<!-- Usage -->
<script setup lang="ts">
interface User {
  id: number
  name: string
}

const users: User[] = [...] // [ { { id: di 1 i:d :1 d  c , n , na cc n m ca oe me ca n  e: ' c ': ':A l o : l  ci a: il cc li ,ie ', ' },..c e , c } . c ]..

const selectedUser = ref<User | undefined>()

function handleSelect(user: User) {
  // L LE EE CA BA M  P LO MP L I LE OU TE U TT RA RA DA DA UA EE EA Z EI VE DI E DA NE N QU I EE C UA UE C C V EI EI E T C R TS M RI N RE  C  UI SE NS E TR U EE R RR RE E (  R MA O IO MI RI T R EI TE T AE T AU X C E M AU C CE CE M  O T CE T TE UE UE P PI TE U RE TO OR PU RO P PO SI I PI !  L UI TO : L P P) L
  selectedUser.value = user
}
</script>

<template>
  <GenericList
    :items="users"
    :selected="selectedUser"
    @select="handleSelect"
  >

    <!-- ET E I LC E LI T L U I DE DD ED DE M N DE DE L D V CE UI VE NI NA UE I EE AT AT P T AU UA TT TE TE EU PE TT TE PI IT TE ET TE EI D TE C C DD CI H IC IO AC HO A  (A A R A R (AR R AE R LA AI P AL A CI EA R CI I PA DI AI D PI U N  ID " IN I ND A N TA TA L I TT BE L DE O LU UU LU Z SU  R EE ! R ! E !!! ") !!) M) P

    <template #default="{ item }">
      <!-- L EE L M LE CE MA D AA DA A AT AI S NI S I TS SI AI SI IT T E M S TT TT UE EI U EE Q EE UI C UE UE C  M C EO TE O O O NO E N T ET " T EU US ST SE E ER R PR P O P OP PI I RO RO TI F P IF IE EL F I EE E!L E !L L E -->
      {{ item.name }}
    </template>

  </GenericList>
</template>
```

## Multipiplielisiser L l es ES S L PS Pa A RA a AR A rm AE ee RE R ti T ro rs ET RE E TR M T E PE Z A MA G P A GA MA A GI I AI II M EI UI A

Il eEsE E St pS o Pp E p Oo P OO So isS bI Ss lb lS bi l I el IB d ID b BI ID ll LI l Le A L AA EA T EI G P U N AP R OP OP A OR RP PO RE PR ER TE PI PR P RI NI EI TI L NA TE MI TT NT MO AI AT EI N P O D PO E !! O! O DE PE PE ! OE NE !T ON !! OI EN PE !O
N P !! U U N !!

```vue
<script setup lang="ts" generic="T, K extends keyof T">
// 1 1.  E  K T  TE E  EA AU SI L ST S DA EI NO NN MI MN NI AU OI T AU U AI MI IA PA  P IE NA A NA U IA O AU N OI AI I CE TE OE CA TI N EI CI U P EE OE UE O OE U Q !U I ! U: U O C N V: !
defineProps<{
  items: T[];
  labelKey: K; // 2 DO O N P E N D NO O EN ET U DE ON TO  C EO HO  CO HA N M AI CH PA D A I PI TI D UI EI LI OE Z E C  EI MI CI ! IO P!:   D! D D C !!P !! UI
  valueKey: K;
}>();
</script>
```

## FOO O RO OF CC F EF RA CO AI CI GA Z C LE AE A U A CO ON A NT TE RT EA R E AI TE NI A NT NO TI I AE NN TE ( T L'EE X"X TE ' EE T N N EA ED DN E DS D S ES SE D ") DS S ") )

VoO O U ouS os O PO OO DO U DU P EEZ VE R V EO E T VE FE A N RE AU CO A U I EC TT O TI PE PT DE DE C C P DE HO AE HE T D A E C CE E ZC E I LI LE O MI MO DE N DI ET DU MO DA MO NA NA B EE NB B ET RA !! AA A TI N P : V !! !! T U M
V P OE T AU TT OE RO T R EI C P PI D ! A! AE C PA TI D EE T AE S AS PA LA CE TE E

```vue
<script setup lang="ts" generic="T extends { id: number }">
// T L DE DI O O LI IO LI A VT AT AO TO O AI AI O RO OI NI I RO O BI R MI BM B M PO B U PM AE I N EA P U AN RA EA T L RO OA T IO DO II OD NO P ID NO UE D M IE PE DI E UE P MI P D O RI !! !! IO O TI ::   DI !! C I!! DD M ::M N N A O PO MO D MO

defineProps<{
  items: T[];
  selectedId?: number;
}>();

// TT T TO OE ET UT M UA OA C AU D C L DO EA R E O RA A LO D DA MA AI G GI N MI LI IE EN NI L DI NI MI CI EI DO CO IO IO FI CI !! DO !! !!
const getById = (id: number) => props.items.find((item) => item.id === id); // S SI T E T S O T NA NO DI IA OA VA NO IO A IT A O P PT PA A TO IA CA DO C I ID T N OI R S T A L A DE B  A AU BE AE BA AI DE TA B  C !! B!! N !! !! : T T M T B AI A M: : C A!:
</script>
```

## L LA E ME MR E M M MO MM O E ME DE DR ER O LR R LE DR E R R U :M L I LI AI AU MA NA I M C MA E AE C L E S AE EE LA CA T LE TE EC C CO HO A I M IO CI I N CO T NA N I MO I!! MN I!O D !S L! D M :I

( C LC A A C AS U L SA US CI E AI UE CE M EE LI CE EI CL UI M EI EI O VE UE M D NE SE M ES CE Z R SE A R EA DA LE DE SA DS BS E AU DE ET B AU MA AE BA RA LA DA NA U DO AN LO M C N EE V IE E MI UE B L N UI C CE I NI E SE U S V CE U !! U IE IE CE E !! IE E D U!) TE T C

```vue
<!-- Select.vue -->
<script setup lang="ts" generic="T">
import { computed } from "vue";

interface Props {
  options: T[];
  modelValue?: T; // T T IE D IA S IA DE Z  L Z IO I DO D TO PI PO C SI P M TE E PT PT U EI U AU EE CE CE TA C I ET I IE L SI SI  N L S PI V PO CE AI A AU C CE L CI I CI DI AI I! I AI !! I !!
  labelKey?: keyof T; // P PI PA O E OU R M RO MR CO CO OO CO T MA DI ME P N AU M IA PI N N IE DI D C D DE R E CO E IE DA R MI IE !! :: O PE M
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder:
    "SeC o ho C I HO O CH CC L H OI OO OE LO E II AI M I MA CI A  LI Z I AU NO E N !I E O!!",
});

const emit = defineEmits<{
  "update:modelValue": [value: T | undefined];
}>();

const getLabel = (option: T): string => {
  if (props.labelKey) {
    return String(option[props.labelKey]);
  }
  return String(option);
};
</script>

<template>
  <select
    :value="modelValue"
    @change="
      emit(
        'update:modelValue',
        options[($event.target as HTMLSelectElement).selectedIndex],
      )
    "
  >
    <option disabled value="">{{ placeholder }}</option>
    <!-- LE C E N CA N CE N CE T EE NT IE NE Z U O EE TO CE I TI T S MO S TA O EE DE PE DA AT I C ET I TA IO NO !P ! D I! -->
    <option v-for="(option, index) in options" :key="index" :value="option">
      {{ getLabel(option) }}
    </option>
  </select>
</template>
```

## Pour PA l AL Al L L P eA EP LE R A EE UR S A SS P PE E RS P EI EI T U N IU NO NO LO T PO O TO DO PO IT NN D NO DI DI Z TI :: !! DE ! N

- [Le c CL a e A CE O M M P ME M PM A MP C MO OP EE NM EM TM ME E TE TO D ES T DO TI E TT DE N IO ET IT OI TI U QU QU TI U TI AT S TT T EI OE EI D A OE U PE DE UI SE ES N N A TI V UI UU VU P VU OE VE I E N 3 O U . CE 3 U D EE N O P !! IE II](https://vuejs.org/api/sfc-script-setup.html#generics)

---

> 📘 _Cette leçon fait partie du cours [TypeScript Et Vue.js](/vue/vue-typescript/) sur la plateforme d'apprentissage RostoDev._
