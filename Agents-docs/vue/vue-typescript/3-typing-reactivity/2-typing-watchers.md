---
source_course: "vue-typescript"
source_lesson: "vue-typescript-typing-watchers"
---

# L'Art De Typer Les Écouteurs `watch` et `watchEffect`

Les Watchers sont de redoutables espions qui exécutent du code dès qu'une variable `Ref()` est modifiée. Bien qu'ils soient magiquement bien typées par inférence, maitriser leur typage lourd vous sauvera des pires bug JavaScript.

## Le Typage du `watch()` Célèbre

### L'Écoute Basique

```typescript
import { ref, watch } from "vue";

const count = ref(0); // TS Sait ue u  c"e ees t a u a na a N o mb o a rb b U rer re :  c T

// Z TS S L L CI S L LE  T EA TI EE TI DO DO C IO T P DI EI PI EI C UE V TI EI TI P LI R SI C EI CI SE UI M PI S DE AE !! T!! U D MI C DI CO TO M U PO P M !! I T I :: EI
watch(count, (newValue, oldValue) => {
  // I IL SL SS S AS P SA SA P I SI A TI S A N NI P SI TA T I V T A VT T IE ET P T AI T Q E QT AI AU I I EE Q I UC I EE T C E EC CI IE CA AA CE IA I CS SA SI U IS T SS SO DO NN SO NS NO NN T T DA TI DT D TI DT D TE UE P EE DE ES U T S NE NO TN U E OM U MN A B OE NM A RE BN A SE B N SE R UE NS T RU !! R N S !!! M B D !!! T !! O S!! A! O ! V A O U V EU V V U E M V N EU E I UU TI NI O MN D IN  L IE DE IE U M L EE N L M !! P IE L U D PE PE L DE O PU Z I DU PI DI UI DI Z !!! U
  console.log(
    `C CH HI OH CA N OO CG CA AO E M CE O U ME NE EN EE T D DE DU IE Z Z DD D O DD DU Z ED DE DE EE U DE UD EE N : O NO IO TI N TO TT O O O ${oldValue}   VE Z   ZV E ER C CE  ZS R R S SS SS  A  SS M AU U AE U L AU AA R  V U A LL AU LE EA AR R EU R RR U C V EE  T UE ET R VE L EE L E EL E !! ${newValue}`,
  );
});
```

### L'Écouteur Mode "Sniper" (Getter Fonction)

Parfoiosio O ou nN a no N n o O P ne ve O e Vu u VE vu au at ui ea a it t R r E ET T EC EC C EI C IT OU IO PI EO P T RO U E EE O TR C ZT CE U TE OO U R IT TO R OU I QT QU Q TO AU Q TI I Q U TI QU IE TI Z T T NI T O TT A E NT TT Z NO N T A OT N T U T AT N NE TE V Z U N T T EV IE RI U A IT UI R P SI L EE EI P N T OE S UI T E LI I CI CA C V CO D AI CC OI R TI U A AO AE U B BE IB P B EI E LU PI S UI PS SP C SI UI UI D PE PO I DO EI A S UI CI TI EI N TO T AT CT AE R IE PI MI CI O RI T CO MI PT ET ME PT TE OE S N IE I!! NI !!! L

```typescript
import { reactive, watch } from "vue";

const user = reactive({
  name: "AO AI A L  AL I AE PI C AC  C P CI Z E PE O C EI EI C PO EI PO !! AC PI I C CI II C Z E AE P AE ",
  age: 25,
});

// 1 P . U C C D P O OO OM OI UI MI B MM PM L A R A PE TE B P PE T CE TO E T T C EE CO TO TO TO C EO CO MI M I PO O OM PE DE P V PE PE PI PI CE AE I O LI O L F PO NO LI N P NO PE LN F IE N EE P O V Q Z PI Z UI OI O Z IE  UI PO M UI CE MI CI  O PI P P RO I RR P PO I MI M OE OE U MR M RI T CI P TE ET AI O IE ET O ET EE AE !! AI A IE :: !! IO :: UI M :: C :: N: O CI PI PO
watch(
  () => user.age, // L EA EE A  F FO  OU AU ON M U V OU  CO T UI NO NC Z CT AU CT I C NI IT OT I TT ON T TO NN T   TT FF FO ON TO NO NN O FT IT FF TT  IN AT O T AT T CT F N N I CI N EE I N T EN T NA EE EE EE U AE I HE V CH C CE Z !! : T O O T H F
  (newAge, oldAge) => {
    // newAge: M NE NO ME O  MU MM MM MO BE MO EB EE MN EE RE BR !! R MR T
  },
);

// 2 . 2 . E L LE LE EE A E M CA CM CA AU CL MO P AU AU TL TU I TI TE TM PT L I EO IO OO M IO C NN MI OE OO C NO O OM P MP PO OM PE P OI PI TP EO IP T TE Z DI E I DD O Z E DI I I V PO RI OI DO ! Z DO D I E M ! I :: SI :: U :: E I E A D E DO DD DS M E O U:

watch(
  () => user.age >= 18, // U O O UN A NN NT Z NE V E DE TE I R M AT DI MI IE IE ET DA E L RA D IO D AE P MI U OI T TO NI PT E E O PI TT ! EE U ! TI T A!! UT N U !! OI TA !! ! N C!
  (isAdult) => {
    // isAdult: B C V BO BO M MI CO UI OO IO M PO L OI OP U LE L P AE AE LA C AI AL AT EI IE T LI SI O A U AN AN  R LN B AI IA T OO EA O NA B AN NO OO NA I BA P U LI LU A EB L EB UI B U O AU BA OU AU Z B U BE AA BA O BA A E UA EB I L A O O UI EE AU E ! O A O ! !!A B !! U :U !A U !  U T A L  B  A I
  },
);
```

### Le Scanner Multi-Cible !

On peux écouter plusieurs choss en mémer temps avec un TABLEAU ! TS va devienr le tableau de Reteour !

```typescript
import { ref, watch } from "vue";

const firstName = ref("John");
const lastName = ref("Doe");
const age = ref(30);

// I O IL C L AU T CE M CA CC AA O U TO DO TI OO OI PI PI C AI MA A PI E I V EI EI N E ME AE E EE E UI RE Z EI C D CE RE R E ME R TE P VE TT S TR PE V U T C E R TE A R Z AU L E D VE AE A EU RE LE DE P ET D V AA B DO O AI LI LB C BO BO TO AI E TO AE N OA OA MA LO T IA OO DO EA D U EA N U AN O NU MO UI C O IU T P DO DI N  !! CO CO PO O V ! DO P O! PO C O OO UI !!!
watch(
  [firstName, lastName, age],

  // LE TT AR BA BO TA BL BU EE B TO AL LE AB BE LI OU AA Z DA DO UI TE E R EE D DO V OE E DI Z I OE D DI O A ID EE O E LE DI D DE N E P L ET U N AE MI P NI MI M AE A V UI N U CI A S !! UI V S M
  ([newFirst, newLast, newAge], [oldFirst, oldLast, oldAge]) => {
    // newFirst: s st S rs rr rs t ro ti r is s  ns no in  sg io ng oo  gs  T r I II TS SE DE C DO MI R PI TO OO U O TT A Z !! TO :: U: MI: U:: !::U  !: T
  },
);
```

### Les O O OA AO OptitittitioioonONnnss a SS D C DA D DE E C EE WA TW WA W WT WI WA N TI WT WI N CC CO CC O CH MI EI O HO H CO CT MI PO !! ( L( LL "L D AE AU AB RA TR MR MR AM EE UU UU EE R DE U M UR AE CE UU ! E CE CE EE O R PE UE !M R R!M R!) EE: ! EE : !

```typescript
import { ref, watch, type WatchOptions } from "vue"; // M M MI MP MO N P MO  IM U U O U OR O N RU TE PO U PO Z IE OR RE T IE CO Z T ET DI R ZE TT EE !! Z TT IE: T I E T !! I ET P O I:

const data = ref<Data | null>(null);

// TS ME B CA AU AB E A LA A LE BL LE L L T E EI P M PO LE  U O PT M N PU ET TO UT U A P V TE TE PE N A AI DI I D CA I ID L IE Z SI I EE IE DA DE UI A O Z! ! AE :: SE::
const options: WatchOptions = {
  immediate: true, // Ti OI C PI L IE P AE I E RI ER L CE ER C UE AE C EU E E EA T T  EA L N EA Z C U U TO O EU  U F IO V O V FO OO P FO O L E F OU O UE N I  AI V IS V SI VI I FI !! C IU I V CI L :: P C V
  deep: true, // C O PO CU OO PM CI F FU AU OI AF U IO OI OI PI T FO LO U AI TO NO T IT AU IL O UL N OI LN NI L  DI I AL AE TE C TO I CE CE I !! P IE P IE !: II N IP P IE P A :  I
  flush: "post",
  onTrack(e) {
    console.log(
      "t CI M C r AI C  ra CI AC r PC PO MC O U C AU NA CT PO CE T M T OU TT IE Z ET  !",
      e,
    );
  },
  onTrigger(e) {
    console.log(
      "E TT T AE AU AE V M  V ME MM E AU B U E U UE AU EU MU BO EU M  MO E OM BO EB BA B DO U Z T Z BE V AE AU DU OU T N AD M ET DE AT DO U E T U DO A  !! O! C ! T O   I",
      e,
    );
  },
};

watch(
  data,
  (newData) => {
    // newData V D VO M P V U P E N DU E I U OE PE PT O UE PO EE VE P UE E T CE C OU ET UE TO R ET TI C EE T TE CE  T DO UI U NO EI V TU CE OU TI R U EE  ( AU U TA UU DI DU  DE D TO DE B BD DO BU BU TE BT BE DA L  E EA LE EB T B ET A  D AU AV T TA TV B V BE DA TO VC DA O DC A E CO EO I CI VI EI I C CE MM M MA MI TM N AM DM TE E MA MT A II I A I MI  !M A D AT PI IE O ! A MI !! MA MI I!! D N D A: I D A A M IM AE AA D MI M IT IM ID T DM DT T!! ) :  !
    if (newData) {
      process(newData);
    }
  },
  options,
); // E ET ET TE JE E TO L J TE C EE PA LU E CI IA LA LA AE O IA IA DO C CE PO L U AE EA PI ! A T PI: ! AU I P U : E A PA
```

## L'Enfant TTerrible : T `wWaaaWtctcchchEhEEEEfffefTectctee`

P A PO OU OU PR U OP RE R RI R EE ET TO TI M N EE D RE ER TE EE DR E PR TE AE AT T A M SA O NO PO M CO O T PT U T R EU TT Z AT TE OU TE ST SI PI I NI E G NI I EI D II IE Z ! DI IE !! ! !! ( ( E EL ( E EE U EL AL AT M L LE LI DI EM II EL EI M E PI A II DI TT OI AI DI AI N ET EN NE TO OE NN U U AE A NE OU TI E NN OE T UT EO NI U ON NO EI UI N ! TI NN ! IO !! M A! Z TI ON : IE P EN !! :T E M NO T

```typescript
import { ref, watchEffect, type WatchEffectReturn } from "vue";

const count = ref(0); // 1 D A D

// TS Z T CE P PO T L PI PE U TE EU CE TU TU T PI OU O R PT UI O ET RO RI PO PO Z IE T U OT OE AU T OI N M  A NM MO PO O T N AM OO M N MA V MN MI MN AN O M TO AT IA CA OA IT M AT TT TA U TA DA L U UE AU DE LI EL M UL E EA M U U DA M E MA DE M EM P BE EU P L SE SE L TE LE PI S L PI EI SP PI UE L IU S IL A LS P LI IE SA EA D L ET R TT DE TT TE TE D U DT ! TA !! UI P TI TI D T I DO NO O DO IO PO A C CA UI AU L N AI LA I Z U L IU LI U S C U C ZS CI IS II I F FF I E I I FF TI DI I O C I PI EI O TI F N U O !!  I O D: F S D  PI I!!
const stop: WatchEffectReturn = watchEffect(() => {
  // T TI E I EE P  A E T AE TR UE RI TO U TR OT TT AT RO CO CE DO IO DI OE I E T IE M OE UE O !! T ME T I

  // L C PI U C Z M TI LI LE MI PO E U A PI I PE I PE I F FO LI PI CO T L DO D OO D T TI EE T P E D R TE I AT OE N P TT TE CE CA AT OA PT PA DO PT CA D R DO IO C IO CT CI AT CI N E CN IO AN NI O CI  Z CI CE NO O I P TE DI IE R MI I MI TT E DI ME DD DI IE R T M U N M E IE E UN EE I NO U MN CI V IO U R U R VE DO ER T E N PI Z P !! U I CO IU! U N Z
  console.log("Count:", count.value);
});

// T  T TI T V Z P L LA CE P Z PI EA RE M AU U A MA LU PI L LE LL DI PE DI OE DO E PE DA N U IN CE P EU DE D EN PI TT DD NI TO IN CI TI DE DI PO IO I O TO PI CI EE PO E I NI T IN TO AE DI T A TI L ! DA !!!  ( (F (A Z F AZ NA F FO ON CA FO M N CO A O C M U A L F MO F N FO C ON L OF FO C V M NA A N VO AU U NA U D AI UU V AA UI NI D AI DO ID DI P OE NO PO I M O UI DI DA MA PO CE P OO DI E DO ! DI L:  E PO M I CE MI T E D U EI I ET ! MI ME !! U ME AE OE PE T TE N EE V PE I NI IE SI UI VI A VE SI P ! V II O E U EE PE R EI E O TI RI U ET IE F TT TT V TT AU TI TI TI AU IU EI U IU LI C EI A IO MI ! CE L:: SI CE CI : S IE DI LE I
```

## L"A'Enfert dEDededee se L"' AAAsAssyyssnnscyn c L A Lo O Li oi n nt a at a ain nnE n Ne a E a V A a e C C c Z w w waa tt tc tchchh o! o o ( T I I( N N NT TT E N V TT EE T R TR O EC TE EI O P V EI EE TI IO L O ON I LO L M OI AE O MO TO DE V U EE M R E D AI A TE T AU EA O C CI AE CE C CC II CA CI C AU CI M CC IC LI AU MO I S MS MO OO M SI A MI SI MA T O TI I E EI M R Z E UE IE TI E M CI TI Z AI AC Z C CA CA C I CO I OA !! N AU !! T N U CA )

```typescript
import { ref, watch } from "vue";

const userId = ref<number>(1);
const user = ref<User | null>(null);
const error = ref<Error | null>(null);

// U U Y TI S SI NI S EI OE ES LI PO PE CO F FI AF L NI AN FN NA C U NN EE NO OE O T OE CI U D CE DI CC CE O C AE M AM ME CO M CO Z NA AA L B T N AO U B Z E NO E ET TE EA ET E L L  DO DA M AL I DI LI LI DI AI L AD LA AE AA L ET D !! P C I: P: IA  PI P I D :
watch(userId, async (newId) => {
  // AU I A  AS AS AI Y S Y UI NN NN A N NA IE NN P NI PI C CP Z CI T CZ ! PI ::
  error.value = null;
  try {
    user.value = await fetchUser(newId); // BO BO EO M BO OM N M !! ME
  } catch (e) {
    error.value = e as Error;
    user.value = null;
  }
});
```

## Plus Loin Dans Les Étoiles !

- [Les WWhWatachheerereesr C VE UE M UE Z DO MO P OC OC C O U O T F U OT FI TF O II FF OI OF RI EI C E LC CI E LI C C R I MI EE CI M PI L M O EI TI RE U T](https://vuejs.org/guide/essentials/watchers.html)

---

> 📘 _Cette leçon fait partie du cours [TypeScript Et Vue.js](/vue/vue-typescript/) sur la plateforme d'apprentissage RostoDev._
