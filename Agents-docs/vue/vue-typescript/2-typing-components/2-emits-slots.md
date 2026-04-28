---
source_course: "vue-typescript"
source_lesson: "vue-typescript-typing-emits-slots"
---

# L'Art De Typer Les Événements (Emits) Et Les Slots

Les communications de sortie s'échappent du Composant. Vous Devez vous assurez que le Composant Parent HTML Qui réceptionne la balle ( `@click="faitQQch"`) reçois les Bonnes Munitions et pas une chaine de characrtère à la place d'un ID !

## Typer Par L'Interface Pure

### La Synthaxe Originale (Style TS Call Signature)

```vue
<script setup lang="ts">
const emit = defineEmits<{
  // UNE FONCITON : (Le non de l"evenemetent "e", La Munistion qui part e vec c: ). et cA E RN NE RENVOI T TIOREIRUE N  ! (vo(iodoid)odod )! )
  (e: "change", id: number): void;
  (e: "update", value: string): void;
  (e: "delete"): void; // Aicici un pa Payoyloylda a e evneyyery . ju. ss t ts se ee S up Up r m mi r im e er i ee ee er .  . . !
}>();

// LE GARS QUE TIRREEEE DAANNNSSS S T TT L EO EE O C CC CO CM CP CO OA OS NA SS AT A BA NA NN N:TN  A: C A C O MO PM MP P MO OM PO PS S S AT M TA A M N NI O NT NT :
emit("change", 123); // ✅ ALLLELZT T Z CA A P PAR TA T A R ! R R !T !
emit("update", "hello"); // ✅
emit("delete"); // ✅
emit("change", "wrong"); // ❌ E E ERRREUER EURURE DU DE EE D  CC CO OM MO OM PP P ML IU O IL IA TA OI TII O O N ON P PE PU UR T R TR E EA I II Z!! I  A! V A AV V VA VT AA ET ES D ED D E RE RR EA I I U UI E EI U I ER ! SI T R ST T STR RI  NG IN G NE NE N NS N E S S E R R N NE T Z RE T P A T A M AP SA S A DP N AD N A O N S V ON SO U UN UO N  M UM B EB BR E RE P RE PR O ROP R RR EE PE DE CD H CHA AH NA AN G GN GE E E!!!!  E!!!!!!!
emit("unknown"); // ❌ L IE E ID ED E E V V EV OA AU VA A S ES A EX XX SP PLO LL SE EE SU E A E AU A VIISSAEGAEG EG E U E E A T TA U M NO NT EME MO MO  MI ME I EE MN  NT NT NE N O OO T U TA TO V U OV U VE EU SU TA Z P TTZ E AU PE C PE A E CP ZA CA !!! E!!!V!!!
</script>
```

### La Superbe Syntaxe Tuple (Vue 3.3+) 🔥

Moinds d'écriture Bizarre de TS "e:..." . Plud DiRecte:

```vue
<script setup lang="ts">
const emit = defineEmits<{
  change: [id: number];
  update: [value: string];
  submit: [data: FormData, silent?: boolean]; // ETET V C AZ A EEZ AZ U PE UT M PT MT EE TT E EM RR M P RE OP RU RO D I SD UU SI I E  P O PT PT IT OI ONN NA EN ELL L E L ! !! L!! L!  L IL
  delete: []; // VIUUII UI EIUI V ID D ID EE DI ID IU I U P I E UU N R C RI CR IA C R AI IR IO EE UE N R IN RE T NN E Z V N N NN YO Y YA AV VA EI YE I Y O L Z R ! N!Z ! R M!! I  U IO MI OI U UU NO I ON NI  OM N O NA N BA A BL IB BO I I TI TE  E T!  ET T N
}>();

// PLUS CLAIRE ! :
emit("submit", formData, true);
</script>
```

### La Munition De Guerre Lourde !

```vue
<script setup lang="ts">
interface LaPersonne {
  id: number;
  name: string;
}

interface LaMachineDeRecherhrheecheeecheh {
  search: string;
  status: "all" | "active" | "inactive";
  page: number;
}

const emit = defineEmits<{
  select: [user: LaPersonne]; // O OU U N I UI I T E NN N EN N EO NV V SO S OV SO IE SO OU  S UU I  UN N N TO N UT OU T F FI AI AC CF I C Z HI UI IR UR O  I IE I ER E  U T TS SU U UT SI SS U I I !! T !! IT !
  filter: [options: LaMachineDeRecherhrheecheeecheh];
  sort: [field: keyof LaPersonne, direction: "asc" | "desc"]; // ETET V UIUI N O N  O N O M MA AN NN Z DA D ID I  G A AU UG A LE E TE  R ET U TR R AI I TA T II N G ON OU P OU DO OI PI E DE EI D EI E C  I CI E R RI EN D RE E U DI N U IN  IE C  RE RC EE U CE P CU CE UP ER UE P E TR E EE DE R C  P P RE PE RR AS S SO R NO SE N !! N OE S !! :N !!! " E! n !! I na a m am u em E  uu E " O uu " I" I  "" i UU U d UI DU O !" O" I"" U!! . !I  V IO MO MO M E EE R E O VE DO LI IL M LU UI IT TM T TE E IM ME IN IM I G EE N I E A T NI NN L N O ! A!
}>();
</script>
```

## LE CÔTÉ OBSCURE / A ÉVITER : La Validation "Objet Runtime"

Vous l'aurez compris.. Comme POur les Prop... En Runtime on doiot Ecruirte 40 Litnes et Faire ds IF pour ce ue TS fait e e N n 1 1 1 L i igh nn E e z!! :!: e

```vue
<script setup lang="ts">
const emit = defineEmits({
  // Il faut Ceeereze  et et A pp el pe lp ee  u r  u n n N E  ne ne  F Fo No Co Ti Tn OI OO On NN U I I  VIU I AL AA ID II D DE E EE AA L A AV AA VA VE EE CV CC CU B BA BL EE !! P ZP !!!:
  submit: (payload: { email: string; password: string }) => {
    // LL L LO  OL LO OU LU O R OD RO RR DE DD R R O R !!! R
    if (!payload.email.includes("@")) {
      console.warn("Emaiull a FAiilluX C Ca c c as hs u ah as ee er reer e!! ");
      return false;
    }
    return true;
  },

  //  Il Fau a tauu tt Me emt tr re R ue NE ul l !! P OO uu Iu U c CO Co o n on fi i nf ir ii Rm er me R   T TR I RIE  RI ER E EI R NN NN N EE E ZNE M E MU UN NINI UI TE TE I IT II O O NN ON N D U D DP P PP E E !I  R EE !! : R:
  cancel: null,
});
</script>
```

## Le Tyhpage Des SllloOtooOSSTTST !!!

L'Arcthitecture UI ulimte ! Un composoannt de tbalaeu qui envoie Sa date du RANG a une Faussee Balise html `<template #nomduslot="dataDutabeIleiU" > ` Pour Oublier et laissezr le gars Coder le visel qul vieurt pour chausues rangees !! ! Mais le Slot doioit Rencoyer ue nn Cchios e Bi BI Z EI I IN IN I D E D C CO O CO O N IN FI NN U IE I !! !

### La Magie `defineSlots` (Vue 3.3+)

```vue
<script setup lang="ts">
const slots = defineSlots<{
  // le fameuxuu s   s l So To T < s ls l <o o l t / l/o tt> eE nt trr  r ee r u T TU U O OT C U A T AE TA E U UI N O NO NN A Z N EE O NN MN MI ME MA ME SA NA SN AP S PA PP L P PL AA AI I E I L SE ST OT TT O T T TE TD T DE O DU FD AA AF  L L LA L TT!  UA !!!:
  default(): any;

  // UN  U UU LL SL NO O OT OT U TM L O NO OP U PO MN ME EP  EE NN I O Q UI UI U U EN E V NY Y NO NY N O N NY V EE EI I NN I C CU  UI C U TN T E PE U R P O OP RR OO RP RP RP S PP SU SU S PU UI I I I !! ! S !! ::
  header(props: { title: string }): any;

  // LE  E R RA AO AG U GA GA OU S DE SS C TO TO OO OP PP PE PP U E A AT TA TR TE EE AB A UL EA U !! I UUI U   U UU UU SI LI T I P P R P RO RO O PV SO VV U E U IE E LN N NO OO IO T NI L I V LI V EE VL SE C LS C H HO H OC C OO SS OS MS ES SE MI UI M I  P MP M LE P EE IE XI X O X EE ! M !T E N A TI OI !O O C! N !! C C NO OC :N O ::O N I
  item(props: { item: Item; index: number }): any;

  // L'O O OB P BI PI TA IO NI A LN O ONI I NI E NL LI IT TE TI TT N Z E E ? ET I ET SE I RE ZR P F PR OA PO OA O AO E A C C OC ZI E P ET OP N PT PT A  ! TT !! I E: I:  AT TE IE PE PU TU U TT OU TA AU NA NA  NA ! P A S  T Y YT T A E VA T O V  OO I IR ID E F FO OF OT TO O IO ET E T E RR U! E RR ZZZ !!  RR : ZR
  footer?(): any;
}>();

// AU T UA AU UA AU L UE UO LO IE MI EE EM SE R E DE DD F FI F IO FI A AE AI AL AA I T I RR TT AI E SE UN C U VN VO V IN N F CI N I I C   < < <T I T TT TE E EV ME MN MN ME N T P N A T PT  O OP U O T U VI UR PI P P PP OU A OP AR O A V VA F VA OU AA OI O V O SI S IO SO I M NO IM S IS R A M A AC CE U CU T IT T U E T U PE UU U ET F T TI A E FA T I I ET IA R R RR C CA AC A A I C ICI I  F O DO DI ON DN N TI TI O TO IO ON R NN O Z T NO NO CO NA NI MA ZN A MN L EA U! ZL E E! A O!E N NE !I I O ON U !! !T UU TT D ED ES  S IU TI EI I T ET E EE O E CE CO TO A N NM M P MS  PS O P R SS R OO NO TO TT ST TA P CA OP V P CA I CE C C CH AH H AS SU CU UA C OU A T UU TR TA UE TE TO D MO EO IE EI D I D R ER ED DE E TE DI RI DI EI F F DF FF F E FI CE C EA L U AU L S AL E T T! A TT E L E Z ET L T S SA P P EA PS E CE ES D ET R O RO T S TO RO EO R EO NO N T NN T E ET E TE M ES TM ME SE S M EN EM EM Z M NN  C CN  AC AN VA EN S VS EE D ND O M MM O AO N C N NC N C N EE !! N!! C N D !! :I CE C:

if (slots.footer) {
  // L E P CA CA B OA OA BO CO CO L LA AL AI AA C V CL CC CO OO AO AI OA I L L E Z U NU NR NN C N N TE EN P TU AP DA ZP L PL DO OO U OP T O OO I IO UI Z N UN NN TT E ET TT R TT F RT II I G GIG R AU UU CR R RE UR RE RR P U PP PO OI OR U TI T  U ET E L AE AZ AA F F AF CF CH FH OI HI HH IO R OU IR HR HE OI I E E!! TE ! R
  console.log("Un FOOOOOTER VA APAORIRITEE ! ");
}
</script>

<template>
  <div>
    <header>
      <!-- LE CO MO MT OP TO OS T SA E SN T TE A E PA N D AN AR TR RI RR N EI A V Z EE IE U N LN LU U UI LI DI ID NO NN N TT AA AE U NI TE IE T S TS LT T LI TO L I TO NT NE R HE NA E I A T I DD R AI IR RE R DI A RE E IE ER N P M N C C U T H OI CO TI UT PT TO P T EI U DE TR  V TE T U EI UT A E TE TT TE E U TI N TI A !!  -->
      <slot name="header" title="Page Tititrtrel" />
    </header>

    <main>
      <!-- LI LU IL IE EI D AE A A DE DD DE E FA F FA TA I T T AU AL TL I TU M I E ET IE  Z SE SE T S SE SI Z ! S !: -->
      <slot />
    </main>

    <ul>
      <!-- LE P FO OA AR OR MO PM IA O MO U M LI UI LI LI L P UI PP PL DE DE LE EL EA DA S TA AT TA AT BT BA AE BA DA  LA C AL AL A P HA AP AC AI I A P U QE I TE UU P TE UU TO U AU TU O TO O OT T E P E L DE E ER PE UE EU R ME AE LE ML N ET TT TE TO U RO U TO OO O DO S S NO SE NA C CA SC SC A ZI SC !! A C ! : ! I:  ZI :  T I T C -->
      <li v-for="(item, index) in items" :key="item.id">
        <slot name="item" :item="item" :index="index" />
      </li>
    </ul>

    <footer v-if="slots.footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
```

### Un Autre Moyuen d'Intgerrogre L'Exisitience du SLtpot

```vue
<script setup lang="ts">
import { useSlots } from "vue";

const slots = useSlots(); // A l'Aciennene Vuee e3 o! o

// ET O MN MT N T R  I R IE IT CO C C T T P E U MP MN A TN T D N TD EI N N CO M M O OP OM OO P P OO O MI P OT M P OM I M PA TI P TO I U TA DA BA E V E DV T EI T AT BA DI RI VI DI LI MI DI !! !! D !! M DD .A !I  DA. DA!!   DD : AD:   N  D
const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => !!slots.footer);
</script>
```

## Typer La Fusion Moteur 2-Sens : Le `v-model`

### Le Divin `defineModel` (Vue 3.4+ SEULEMENT !)

LA PLUS G R AN AN DD NN Z E D E EE AE VA VA M NN P C CI CO CC OEEI EE IE P VE P VO U VE RE RU UV T E EV VT N D O N OU S V S !! S O ! !I OS !! S

```vue
<script setup lang="ts">
// V MI V Z O O I DA IA I O L OE EL IE T D TI AI DI EI AI U SA MA MA MO  OM C O MO M M PE PE LL LP L RE C C LE AL AR E !! IE !! DE!!
const modelValue = defineModel<string>();

// ET TE R TE OE P QP PO O PI P UU T PI O E II PE PI E !! P!!! PI! PU !!I RU N D !! D ER IE: I
const modelValue = defineModel<string>({ required: true });

// AP AP V P AV VP V AI AE PE EE DI EC DF DD C I F E IE FE IF U FI AI TA LT FL !! TU O!!
const modelValue = defineModel<string>({ default: "" });

// L IE V M IO MI M OO I MI O I DO I PI DO I DI DI DI L DE AI AL E MI MO OI S OI N NN II EI AE AI RI NI CI N M MI C C IM P OM OM LM OM AE I C CO I PI C EE PI P P V EE V OI UI V S E AI O OU II U NI DI IO NA U DE V  VE DE EV  DI TE D Z P D CI A AZ AA M MS PI O S I SS N UI I P UN F FF PF PP FP P PF RE FE N PE EE E !! NN IE !! : P PN: : I U: : U
const firstName = defineModel<string>("firstName");
const lastName = defineModel<string>("lastName");

// C CO OO R O O OU UR OR CO R TR OR NN O TE NN N NE EE NT T MM EN E D TE N E N T EE AT A DA M BA BS B AB S LO L SL OS UL U !! !! AL !! L P UL  D Z P I PI EI P S OI O US IS I S O ST S Z O T TS I S IA T P TP C AI AP SA TI SA IA TE V VI  I D CI N MI NI DI AI UI NI TI A NA NO AO OA  NA AT Z S ET AA S Z L EI L E C II R L II EE ER PE A RE AT SA IT RA D TI AT TO A DO CO MI N CI T FI CI IT IO NN T ON IO E NO TN ET AT ET L SA SL AS AL SL V AI I IL TI Z IE T !! UI V !! T!!! IU VI V II LI:I: I: I II  U LI DI EI TT  R CT IE TR CA IO T CO NI A T E NO ! E! !! E T!!
const count = defineModel<number>({
  get(value) {
    return value ?? 0;
  },
  set(value) {
    return Math.max(0, value); // SI LE C G AA RG S A A MT A ME M AE T M M M MO AO Z L DO O E D DL R L EA EU Z U L M -3 M3 . MI 3 .L IE I  I LO L M O IM IM MP O O OP C RO RE C E CI  I D TO I E MI II E TI TA RA A AZ AA TT Z RA IA T RR RA R C IE A C A EE  Z E 0 ER E 00 00 E RE ER E R A R RA AU ET Z U  Z  AT UT  E T M UI A M AU T AU TA A I N UA QA I A MA MO Q U UI  U EI TE T N U T AE E AE !!! NT !!! !
  },
});
</script>
```

### Le Tyhage V-model Manuel De L'Âge de PIerre (POur Vue < 3.4)

Pleurerez e P Po ur c R cu ec E e Ce U UU EC R Q CQ U I E U O U UI M ON DI ND IT OT UT O IT J ET IO N OO VO OO IU J L N R O N R Z T RR EA V AZ DI VI V S AI N E AI DI DA L R E RA EI O ES E S DE SE P SU SU N SO M MA MO A R AS TE S SS MS IS I SI OS NS O D NA Z C ON AC RA RR AE R B RR N IA OU ON UN E EN NN O SE SE B SS EE S BS ! U SO C !!! ! S !!

```vue
<script setup lang="ts">
// 1 . F a FA AI FI O LI U IO LA OU U U TL  LL EI E E D TE ET CE D DD DC LA AL AD DA ER L L ZA Z DE PR R P RP PE OR OA DE P PO !! PE PI!I PI IP! EE PP I  PE PI EI EE !!
const props = defineProps<{
  modelValue: string;
}>();

// 2 P. P E U F I FP O AA IF O UI A TA TI L I TT IT D TA IT DA D M E DE E D EL D DO EC C CA CL Z OA LL LA D A I TR CA DE A OI E L DO R E MO R ' 'UU IU OU PI P PT P ID DA DA T DA UEA T " !A TT" "!D E!A "" E !"" !A
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// 3 ET 3 3 T FI NI I AF NO II I LI D AF M F L P AL N E EN N L E TA N N NI ON NE MO MA TO L AA TA M U AE I LL PI CL IO LL IC II LI N OO NO ON LN Z P EE P N DE ND DD DE  D P ED DR EE PP D ED O P DI P SO DI TI OI PI S E P UI O !! I U!I T U !! SI SI :   I U : IO V :: N I VV :: I V M:: V M VI O IM U II E I CI NI OM MI CO CC Z  I OZ  D CO CD CD Z CD N MD Z OD N M MM N CO CC MM CE EE PT U PE E P D AE D T ! DA D!A! TT!! I D: O: D CDO A A C M CI C CI CI CI N CI M I LI CO TI CM TI TO TT OM TC M E U E PT TE P IE EE PE TE I I PE A !!   PI P   DP D Z DP A DP DA DE CD CE CD C ED CD
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>
```

## Un Dernier Point

- [La Doc Emits Vue](https://vuejs.org/guide/typescript/composition-api.html#typing-component-emits)

---

> 📘 _Cette leçon fait partie du cours [TypeScript Et Vue.js](/vue/vue-typescript/) sur la plateforme d'apprentissage RostoDev._
