---
source_course: "vue-typescript"
source_lesson: "vue-typescript-typing-refs"
---

# L'Art De Typer Les Piles RAM : `ref()` et `reactive()`

Le système magique Réactif de Vue3 s'entend Merveilleusement bien avec TypeScript. D'ailleurs TypeScript est si intélligent, qu'il "Devinera" (`Type Inference`) Automatiquement 90% De vos variables sans que Vous n'ayiez besoin d'Écrire le moindre Type !... Mais il Reste les 10%...

## Le Typage "Diamant" des `ref()`

### L'Inférence Magique (Laissez faire le Robot)

```typescript
import { ref } from "vue";

// T Ty YyP  PE I IN IN NF F EE ÉR ÉÉ RE R AU AT U TO TO OM MA M AT TA II I IQ QU Q EM M E M MN NT N !
const count = ref(0); // TS A COMPRIS QUUEUE C CE EC IE S TT U UN NE E R RE RF F< N N N UU UM BM B ER RE R> ! !!
const name = ref("Alice"); // Ref<string>
const isActive = ref(true); // Ref<boolean>
const items = ref(["a", "b"]); // Ref<string[]>
```

### Le Forçage Brutal : La "Boite Diamant" `< >` !!

C'E T SA TA C CP CO C MM MM PM L LE Q UE Q ! !! P Pa RP a rr f r fo f id i s id V DO u ou us au av VE V AE Z BE b EB E So S in i in DI D IN Z DI DE E CQ N IO ON IN T I EE T E E NR E R NR U C UN C ER EA RI IN ER Z AI NT TI TI A NA NT ! N T!
!

```typescript
import { ref, type Ref } from "vue";

// L AA  A " BO OO II TI TT ET " T D D I DA AI A M MM AM MA AN NA TN  T " T " I < >  I > "" : I (LE C L CA AD DE EB D  N NA AS S DD A DA N BS N S CE CC EQ Q UE EE I V VO VE O U UI UL LA I LL L A EI AZ A L ZZ AL LE E C C L CO L N ON NE E P NP PU UT UR RO L E I I EE N I NP PA SP SP S T P RE E ET AT AN NE TR NR TR EI EI N IN IR DI D DE D D EN DA DA D NN N ) !SS! )! ! : !
const count = ref<number>(0);
const name = ref<string>("");

// TTYYYP PE Y E SE SM M MU ML UI TL T TI II LL PE P E ES EE SL L! ( SO O SO SI O I T I T T T T XE XE TE XX TE E  T ,  S O SI TO IT N TO M MO BM O BR BR OE BE  ! B  !!! ! : !!!):
const value = ref<string | number>("");

// 🚨 L ES E C AS AS A SE E S EX E X XT X  TR TR E TR TE EE ME T M M S MM S E! !! L !  ES E E T TO TY P O Y EP PS E E SS P VI  IV V I I D ID  V E IE LE S V E LE ! L E Z E!
// Q Qa n au ua u aa N N nd d n d  O d o n Do OI n O IT ID P o n O R ON R  A P P A PP A PP R PL LE EE L I LE LE RA A  L AN AI PA PI PI  I T I TA A TM O M MO O DO N P NO M NT DE P UE T EU TE PE TE AU R C T CO C RE CE R O R V E VO EI EI TI A A RE R  D AE AE AU A UD B BA U EE BU T UU T
const user = ref<User | null>(null); // V VO VU OS O EU A AT TA EE T EE SE E BS BS BO O LO LI LB IG B I I L BE AI D T DE E DO L DI DO LI O EI L DI E U I CI CI I A NA A A V AA RE Z EE U C UU T UN UN T N D D Z " | NA| U M NL UN LL ALL ""U"I U "! IU "! " !!I I!!
const error = ref<Error | undefined>(undefined);

// U U YN UN A N Z U UA UU UA AU UI UA UT TI P U EE R T T RE EI F RF FF E FO RF FE O O RA C A RA N C CC C U A AI C AO A !! CN! : C :
const items: Ref<string[]> = ref([]);
```

### Typages Lours Et Cpmpexer

```typescript
import { ref } from "vue";

interface User {
  id: number;
  name: string;
  email: string;
}

interface ApiResultaMagiquer<T> {
  data: T;
  status: number;
  message: string;
}

// O Ob jI je i e E e L c o C cu uC c U U C R UI CI CR C :R I
const user = ref<User | null>(null);

// U Un  A Ar r a yr a AA A y A  d U EE e D E e E  D S E U PE S PI RE P  RR R S RE S S SR S DO D OI ON DA N DO DN AN NA I E SN E T ! T T I :: E
const users = ref<User[]>([]);

// L LA  R E S EA ES E P PP O O IN IO Z IN S O RE EE P A API P A API P IP E Z !! I E !! I::
const response = ref<ApiResultaMagiquer<User[]> | null>(null);
```

## Le Typatge De L'Objejts F F Fu F O FF O R RT TR TO O U U T : `rcereactcieacvive()t`) `

### AuittomtatiueI In nf fr f re re ee rence

```typescript
import { reactive } from "vue";

// L L II A MA MO A N U GN N  M IO MO N NO OO T  E TO UU U UT U AT U U SE ST TS SO TO TO O UT OT UL IT LU CI E EC U L L CE LE R CE CI EI ER RE I !! DE !! : R  !! ! I I Z U !!  UI I Z  !

const state = reactive({
  count: 0,
  name: "Vue MasiatzerZ",

  // A A YI AY TA AY TT TA AET TE T NN II T IN TN IE EE I IE TI Z OO OT BO NO !! NO IN PI OO LI O E OI PO PR PL PT UR P RI I T LI R L PI AL ES EP IE AE S TI EI EE S L B LA L LL  LA O B EU EO Z EA LU E EA X AI E IXI UA VE UX E VI IX UI DI U CI DU DU D ED D AE IE EU !! Z U!U  T S IS U T I SI D C E DO OO II TI TI A T PI TI TP PI O PT OT T R T Z PI PO Z FO OZ F O  RC C C  I C FE RE FR IA AI CI O IC II NA IE E MI M U UM L !! Z L ! U LI : R : :  ! !! !!!! L !
  items: [] as string[],
});
```

### EXxtprliriCIItet

```typescript
import { reactive } from "vue";

// O P ON R PR OR R PR EA PA R PE PR P RE AR AE RE RA LA A Z F LA FA OF O A E RI IR R RE ME ME RE AI EI MA C C MA C AR R Z !! CA! RI !:
interface State {
  user: User | null;
  loading: boolean;
  error: string | null;
  items: Item[];
}

// B BU BA BO BU AU AI IA M MO U MO O UM IU MI U  M! UM !! UI ! : I
const state = reactive<State>({
  user: null,
  loading: false,
  error: null,
  items: [],
});
```

## Le TPtpyyapapggaggee e Deddes e c `ccoompumptuetedetde()`

### I IN IF NE NF FE NE R R RI RI AE C AN NE CC C EE AU AT T TO UT AT T O T MO M TI O AQ IQ QT QU IO O UE IE

```typescript
import { ref, computed } from "vue";

const count = ref(0);

// TS U P PI CI PT PIG TI AI OE OE U T OT GU O EE TO UI QU T AU AE C E EC ZE C E SE O ZT TI TO IT IU M U MO P OO U M TI PE PI UT PI A O DA D U ED ER N R DI N AE  N MM EB AE AB L RE AR E L E ER AE RR !!! I !E
const double = computed(() => count.value * 2); // TS A DEDVNIÉ QUE C"EST :  ComputedRef<number>!!!
const message = computed(() => `VOUIAS VEZZ ${count.value}`); // TS VOIT A QEU C"EST UIDNE : ComputedRef<string> !!!
```

### Le FOroccecege Reetuorurn

```typescript
import { ref, computed } from "vue";

const items = ref<Item[]>([]);

// QS U U Q I SA UI S N IO A DN NA DO T D LE TO OL CE L M C  A CA MA CA M LL LU CC CC C LU L UL TL E C E O E T SE O CO C CO T M OM MO U OP ML PP IP OL P T I EQ C PI EI Q O  UE EE UI AE  U ET EE  E TT TI Q Z T U Q IO QU AU UU U E EE TT S ST   ST  E N EA NE T A AT N G TR TO RT L RR AI EI U LI A CI MI S SE N I EE ME ! EEE  U  EE O S R M SO ES MO TE R TI T E TA IT IT TA M CA O CM BO  B BO C OO DI IT TT DI OT TT EI P OT C EA C I !! S
const stats = computed<{ total: number; average: number }>(() => {
  const total = items.value.reduce((sum, item) => sum + item.value, 0);
  return {
    total,
    average: items.value.length ? total / items.value.length : 0,
  };
});
```

### L 'O'OVVUNOVV I I D 'D UI N NN M CM OM CM OU M PP UU TT PI ED EE T DI W Wr ir i rt a rb br brle lelee e E IE( O E G D Et ET + Z SeSe ett)

```typescript
import { ref, computed, type WritableComputedRef } from "vue"; // M M IM PO PM M OR O ER P OR R TE TT EO TT E P TT UZ RO T RE ZR P TO OE ! TT UE O !! O!T M I : !!!

const firstName = ref("John");
const lastName = ref("Doe");

const fullName: WritableComputedRef<string> = computed({
  // Z  M LOA O B AI AO DO  R DB A TO OO L OL TL IT DE DI L T ED RE CE CA BA B I TI UI EE !: TI !!:
  get: () => `${firstName.value} ${lastName.value}`,
  set: (value: string) => {
    const parts = value.split(" ");
    firstName.value = parts[0];
    lastName.value = parts.slice(1).join(" ");
  },
});
```

## TyL y L e P A T TypypeapP pa g e gg D E e DD S S e R RS R ee F fsf sh shm hm s th to hm l o tlH TM HM LLL :L L E L C CA B BO AB B R AB R RO L RA A L LL AG G GE EE

QuaNnd d nd n V O UU AU P OS PO AP Z A U Z EE IE EE I LL L U LZ EU LN U EB AN D Z ZA B AU Z A AS LS V LI LIS E IS E H I HT MI O TM TL MO TO O N T Z EE N TM E TT EM M L L AP AA LA TP TI A EL !! LA T U I : ET LE U A U IE E A IE : D E E Q QU UU U LE EE UL L TE TT P T P TO P E YO IE T Y O P DE D C DD H OE B CJ H OE T HC BE CT D DO TI DO DI TO E IT O T I OT N T NA I NN U I C CI I N UI !! N C: C : UI : U

```typescript
import { ref, onMounted } from "vue";

// C AA L B BE L AL B RE A LE LE L N EE A ET EA  N NT B TT TO BU B P EU A T AE TL V U A LL T EI MI T T E DI M T DI E D ES SS II H TI I T H N TH TM H C OM C PL M U AU TL P ST SI L N TT SA S A TA NN TS TD N T T DS DT E TS DD C TS C EA SA C I  F IF O A FA FF AT N CA DA AA CI BA A C CA L EE LL  H T A T L MT OM H M U ML IL ML !! I !I :: M   (A ( O   T VE EE T O O UU O V TO OU Z I O O R S O JU UR P OO RR SR S  A SA P SS AS SS PI R P II R RR MI RR RA U RA E AT MI L L ! !! U N U )!! N !
const inputRef = ref<HTMLInputElement | null>(null); // V O IO O IV I OI A UI UL UA LE LA L CE C AE A LA BO L A AR B BE BL O R EL BO B AB EE DE D DO UI U NN L I NI  NN IN U N N N T N PI MI I NM NN T N NU  P I N UT P TT I HT T MT MH LH !!!
const divRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// Q Q AO A AU EA NU NA ON U ND ZND O DN EE L T L LE C EA EI A O CC A PA MA CA NO C M SO PO NM SA OS OS A PA S NN NT A O TP OO NT A  S O  S ET S TS TS Z E MO O TO NO MO NN TO MO U TO E !! U! T !!!::
onMounted(() => {
  // TS S CS AA DA MA AA T I T TE TI TE T PI ER EP OR PO P  T RR TR R DO R IO OT TO BO IT A II BA L IB T EL B A LI IE LT SI EE O T CO Z O MU L E AU MM A !! ML AU :
  inputRef.value?.focus(); // IL L MI L C M C IO CM AI C PA L CO O MP MO OP OM P RO RT RT RI T OI I RT E P U IE TT IO E I E ES I U DS F SE D OF OO CC CS IU UC P SU OS O !! US U !! P UI !Z! IU UI I::S U S US P OU S

  // PA RR AE A PI PA E C I CE C PO LI LO N UR P E U P L C AA N  AC V U A VA NA I  A C CV NA A AV CV L VA SA VE LA C AA AV AA S SC CV S AA ZC VS !! S A! C! Z A: A Z A SC
  const ctx = canvasRef.value?.getContext("2d");
});
```

### Le P ii ri ri ri ee : r V o VI T o TT i A e T uA N C e No o P nm O n P M Oo m p P SOo O p a P no o o P nP o P A A P AA a Aa Pn Aa p P NA V NN a T AT EE a n V t A !

```typescript
import { ref } from "vue";
import ChildComponent from "./ChildComponent.vue";

// L L A MO M MA MA AO MI AG GI I GN AE AG O IG DA O ED I O BD BS DO DS DE O TO TE S P RO PI TT Z P PI E !! PU UI I O : IU U
const childRef = ref<InstanceType<typeof ChildComponent> | null>(null);

// TS S C S O CC AO MU M O PO PT MP PT M M I MA R P RI TT I O PI I PO IT I RO IO RA II T C TR AI TT R AT  E TI V AI TO T AU AI MI  VI NI VO D IE OE DI M U ES IE D ES S T AS T FE F AO Z OO FO N Z AC AN CN T CC IN II O NO IO T M N TO U S O US U SU EX C XP EP R P RE LO T OT L T AI E I EE U L T  N CE CI AU C E N EU EI L M C M OE OM E C C E CO E O L CC L CO ME OL C MO MP S P OA P PA SS I EA EE E  E T TE !!! D ME I T IE E !! A DI ED :: IE :I
childRef.value?.someExposedMethod();
```

## PR POUR AL A L lA AL A EE I L RE LI I M PU UU PL UL PO SL PO AI S LU A IN U A NO NN A IA

- [TL L P O A L Y L Y PP EY EY EP E PI AE E TI TE E IN II TI NN UI U TI O O DO I NO NI IE PI EI PE EN O EN NO N PE PI D NE CI UI NN UI TI TO I T O V NO Z U EV VU U VE !](https://vuejs.org/guide/typescript/composition-api.html#typing-reactive)

---

> 📘 _Cette leçon fait partie du cours [TypeScript Et Vue.js](/vue/vue-typescript/) sur la plateforme d'apprentissage RostoDev._
