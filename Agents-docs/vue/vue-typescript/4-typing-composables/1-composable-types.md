---
source_course: "vue-typescript"
source_lesson: "vue-typescript-composable-types"
---

# L'Art De Typer Les Composables

Les Composables sont le Coeur de La Reusabilités dans Vue 3. Des composants Intéllgigements Typé offrent à vous et vos collèques une Expérience de déveoppeur incrrpyabelment Sécurisnte !

## Le Typage Basique D'un Compoosable

Il faut S'asuruere e C qu E Q T ue ue TS D Do on oT O no E DO NO n EE nn l a L E L BA l BA L B A I BA R B RA T RA G TA TG EA C EA TE TE E C ED TE OO E M BO BM B P O B P M ! C R

```typescript
import { ref, computed, type Ref, type ComputedRef } from "vue";

// 1. Z A L A R R Z LA A F AF IO IC FI HO HC HO R IE CE CA AT TE RT AI RI A I TE T C SE ES TU C UT D CU UD TT O EU PE E U T TE !! TT !! I:: :
interface RetourDuCompsotableuseCouCunter {
  count: Ref<number>; //  L P L L L Z U OU ON O M N RM RM MA O BA L EE AL TE NT MT OE IN NI D T EE U R TE EE EF R SE S ET SE ES T Z RE RI EI C R !!I !! :
  double: ComputedRef<number>; // L U UI U TT O U E O EE UE TI UI RI L C I U A I LU  A!! A L:!: A L
  increment: () => void; // FO CT FI OI FO N IO VN IO DI NO OI VD IO OD  OD
  decrement: () => void;
  reset: () => void;
}

// 2 . 2 O O O ON N M ON M O TE L TI IE NI IN L I U ET LU L I EI SI TE SI TI I II L T O NO E CO EE DO ED D IO NI SI DO SS PI O SS AI LS L OA ! OA ! O
export function useCounter(initialValue = 0): RetourDuCompsotableuseCouCunter {
  const count = ref(initialValue);
  const double = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function reset() {
    count.value = initialValue;
  }

  // 3 O E O R E N P RE R EV NO EO II O I U I VO MO VO TO OT R TE UE TU TE TU E CE CT OC M R M EE MR EI L EI !I L E:I L
  return {
    count,
    double,
    increment,
    decrement,
    reset,
  };
}
```

## L'Outil Suprême : `MaybeRef` (Tolerer Les Réf Ou Les Chaines Simples !)

Parfroi io is v vs o ou os o vo vl vl ea ue E ll U E LE P CE R PE RO RE RE E M M A MM A MA L E E A Z A UE LE R UU EI Q V IQ T TO I IT P UI OU EU V RO AU V EI N R EI OI R ER D R DI ( E DE ( UE Z UI E NE N V CE HA N HA IA TI N TE S M N SI MP LL " H E " B B O OO BN O ON U " U OO S UI O V I I T N UI UE R E NF E " FR ( "" R "E( R B E C BA OI L OJ R O" )U !! ) !! I!! Q !! T CA UA DA AA ND MD AD M AN T DS DS I TS AI AT NO L IO T NO T EN D T ET C " " I MA O IM PO BA L LE L OE L B OE L BE L !!! ! !! "

```typescript
import { ref, unref, computed, type Ref, type MaybeRef } from 'vue'

// E 1 E . 1 O R L  V AU AU AE LA O A Z R AE  LE A IE LI A E T G R AE G V O AE V UI T U L IA EL  U O  T U ET Z ET E !! DE: : !: E :: E :!
export function useDoubled(value: MaybeRef<number>) {

  // L LA L AU A M U C M AC G U I EG I E CE U VE TE ME U Z T O N TO O NO A N TA FA CI R AC N HA IE HA EE ! ! :
  //  'u ur nr er fe() f)' M ' M AU U P AT R IT LI CE SI Z Q T O UI PO I UE PI N OE C NI Z NE C P CO NA OA P M NA E M DE ET Z N E D U EE D TE LE EE TT M EL SE TT NE T EI PE AE PI PE MI M C MI EI TE NI TA ET ET ET S AE T SE TI TE !I TE:! TE M !! ET ! EM
  return computed(() => unref(value) * 2)

}

// V O U LO US O T V AI CA FI PI SE TE D LI IT Z IE TO TO DE D !! TI U E U :
useDoubled(5)          // CI C HI OH F IO F FF I R FE E FR FE I T BA AS I B AI A SQ SA UI IO T I UE U ! ! U : !! (C(a( F F P F M OA N OM RO I N TC TO HT HI IT EE !)H E! ! ) T I
useDoubled(ref(5))     // R RR E E F R TI F FE R I E RE EE O MI N MI E !! L!I EE ) E! ! T CE CA AI MA NA NA CA AE MA I! M AI A  )

const M MB BB O L DO MI BO B IE L EI = ref(10)
useDoubled(M MB BB O L DO MI BO B IE L EI)      // C R Ca C C m MM a MA A m e R M E U R CH M H EE CH E CC HO E U AO MU MO !U   A! MI S M M   OO!   !

```

## A En A c R o R C re r M o M M ei U e iu il l A u UU EE LR L R U :R Z L ` U M MEaL aL yA b y E eb R A V eb R E A Y ef EB OR F er OG E O R eg RE Rt O G T t T R er I O rI E GR T RO ER T !! A M E Y B E R E F O R G E T E T R R !!! !! G :! E R :

Les Geta r e g t ae g a G ra s G o T a S Z r TT r O RR i o z OO EE R EE TO O E A M E MA C L EC S LE R M CE AU I TE R UE I T U S C P ES CI RI AE CI A C LI E T LE CE R SI ST UI SE N E DE S SN AS EA SA PE E EA LE AI PA TE Z E E! E V: EV VI A !! O N V!:

```typescript
import { toValue, type MaybeRefOrGetter } from "vue";

// O MaybeRefOrGetter<T> = T | Ref<T> | (() => T)
export function useTitle(title: MaybeRefOrGetter<string>) {
  watchEffect(() => {
    // "T OT ' V O  oV V T To V al u le l  (e ue  N NO N NO U U VE E N VE  O OU L L AU LI I TT DE DE E E VE D VE IE E 3 3 . P 3  D D M I AA AI AG IE IO Q G QI IU M I EI !! EI UI! !!E I  I IE
    document.title = toValue(title);
  });
}

// 💥 TT O TO O U OU S T TU O CE C T C SE  M EE O S M S DA OD EE L S F SE I L TO OS T S N FO T OC O CN FI TC C OI TI T I NO OO NO NN E NE MN T EE : N T N T T TO : U

useTitle("S T St ta T a ti tt c  c i T T c ai tt it l lt le el  "); // L E C SH TS R TI IS NR IN N GG I N
useTitle(
  ref(
    "R a ea e Z Ac Aa A a Cc Ct Cc CE C TI TI P II I VI I E EE TV II EV  TI ET O LI TT IL RE M ",
  ),
); // L A L A T  R T  EE  R  EE E EFF E F
useTitle(
  () =>
    `P ag l a S P PP AO AI AU AG AE G AG N G R NA UE E AA ME ${count.value}`,
); // ET UI N T N TE EE FO N O NO NN A FI CT N IT CI Z PI T OO E O NT !! ON ! L !! ! L
```

## Le COMoPomsosabalE Ael A sy S nS cnh y yn c N o A H D r E o R U H n C e o HU c HU A T C HE OU HO L CU D RE D OE U E DD LO O O U LU U R LU ID O D !

```typescript
import { ref, shallowRef, type Ref, type ShallowRef } from "vue";

interface UseFetchOptions<T> {
  immediate?: boolean;
  initialData?: T;
}

interface UseFetchReturn<T> {
  data: ShallowRef<T | null>;
  error: ShallowRef<Error | null>;
  loading: Ref<boolean>;
  execute: () => Promise<void>;
}

// L E EA EE Z M  A MI A C M U AC H AU I CC NN EI I CI AE PI E ! PI DE E V AE S E A P AP AA LA PE !!A : P LE : PP : P P A !!! E! AA L !
export function useFetch<T>(
  url: MaybeRefOrGetter<string>,
  options: UseFetchOptions<T> = {},
): UseFetchReturn<T> {
  const { immediate = true, initialData = null } = options;

  const data = shallowRef<T | null>(initialData);
  const error = shallowRef<Error | null>(null);
  const loading = ref(false);

  async function execute(): Promise<void> {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(toValue(url)); // AU D AO  H A AT AU IA CA A T CA AC AA I TI A TI TE T M A !! V A : V A!! C A ! : A U! T AU  TI C :
      if (!response.ok) {
        throw new Error(
          `HE TI O TT IP EI E CO HT ET IT PP TO T A HP EE TE  HE ${response.status}`,
        );
      }
      data.value = await response.json();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  if (immediate) {
    execute();
  }

  return { data, error, loading, execute };
}
```

## C CP Comompompooos s as L ab a N ab AE C L N E L E G B EE EE GB CE GN NE N R ER NN R A EI A RI E E QR IO QI IEU UE U E E U UE

O N O ON O A NP AI AP AE L U VE V LI N I LU IL O A EI AI LA LI TT TI A LI AT T C IO C AI OO L I NO U R CO OE S E Z M AU V O M CO BO CO A !! BI !!!:I !! C! IE

```typescript
import { ref, type Ref } from "vue";

interface UseLocalStorageOptions<T> {
  serializer?: {
    read: (raw: string) => T;
    write: (value: T) => string;
  };
}

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageOptions<T> = {},
): Ref<T> {
  const {
    serializer = {
      read: JSON.parse,
      write: JSON.stringify,
    },
  } = options;

  const stored = localStorage.getItem(key);
  const data = ref<T>(
    stored !== null ? serializer.read(stored) : defaultValue,
  ) as Ref<T>; // A U IA AL TT LI TI O T AI IO NO SI NN Z NI OE DE DA Z DO TO TE TO I C TI ET OO ! T C!E ! C T

  watch(
    data,
    (value) => {
      localStorage.setItem(key, serializer.write(value));
    },
    { deep: true },
  );

  return data;
}

// O O MI U D C A TA IL LE DI IA U T PI E AE N T NO UI DO NN TI DE IO U NO OI Z T  U DO F E PI IE O FF IA !! IA O!! T NI O: U

const theme = useLocalStorage("theme", "l S i li ig gi g  ghl hi hl gt  t"); // R EE LF E< E S R  <t EF E T L EE F C E L F SI FL SF SE L TE > R LI  IR > < N N T R > II N R I NI O > T G !! R II I N IE > R EI T :

const count = useLocalStorage("count", 0); // R E R RI RE EF U <  n EI  E FU T U< < N NN NU NA U N U E M U MB EE BM MR L R R DE  I  UU !E E T M U!! B  M T : O BR L M U O BO BE MR B EE RE R B!! E R E   T N B MO D DO MO UM E C UU R CI P CO

const user = useLocalStorage<User>("user", { name: "", email: "" }); // TS F TS AE  SA O U V U SA B N AI O E TE S B L R CA LA MA BA EA L TO OE TT B ET T IE Z LE A V V  AE  !! E DE E T E !!!
```

## Le c CU LU U CO U LE O LU EE TO C LA A A LL LI CO IL OO CA BO OI OM NO MO PE MP PT P TO OO C MO DO I C IO S IO DI A NA T NA AB LA V AE EC AU AB DA B E N AD U DO AE U U EN B AU P C P CA CU AA AU V L AC P UE V U U AL A PI PE T T PE TI PP P TO T T AP N PA T TO DE TA NA ! AE T E L U PE ! V TE

```typescript
import { ref, onMounted, onUnmounted, type Ref } from "vue";

interface PositionMouse {
  x: Ref<number>;
  y: Ref<number>;
}

export function useMouse(): PositionMouse {
  const x = ref(0);
  const y = ref(0);

  function update(event: MouseEvent): void {
    x.value = event.clientX;
    y.value = event.clientY;
  }

  // A A C AA UC BA CU RA R RO RR RA TO U CR CC CA N AU HC HE CR DO E T LE O U M M C E EI Z SE DO R D OI DE SI D D R N SI U DS SS DO RE UR E DA S E ! DS E! S V! ! D
  onMounted(() => {
    window.addEventListener(
      "m AU m O mo R ou AO I s Mo OU C R e T Mm T Oo I u E V s MO UE EI MO I V R R VE m M U m O M v Mo Oe O U V O v N UE VO U EO  O !m V R Vo E E UI VE I ! U v V M V m e M R u OE e VM O",
      update,
    );
  });

  // Q N D L CO S C O E DI C SO MO MO P AI OS MO PO S SO A E MS DE CA O E CO E D R DI ET RU IE T DO U R O ! Z IL ET DI II IE ET DO PI D L D R E !! U N I!
  onUnmounted(() => {
    window.removeEventListener(
      "mu E U AU mo N EA u A A AE  s AO AO UI m E MA v AU O AA OA S M N e MO m NO MO P AA E VO P AU AU O O D M U m MO EU O PE VO O PM VU P I N U e AI E AO MA AO N AA ! OU E  O e m VU OE UE IE MO VE EM AI PM U M EM VM N VE !! e U AU e U VO OA P O IE R VU OU EE I O E OE m MU o O IE R N D",
      update,
    );
  }); // B OI BO V DO OA DO BO MO B AI B DO MA AI OO BO OA PA BO C AU AO IA CA R C E TE A T !! !! AE CI AU !! AE A!!

  return { x, y };
}
```

## Plus LOon C V I O C P AI R PA DE N LE PA NO LE CA A CI LO P NI G OI OO D U

- [L L O CI AI AI O IO P CE PI S CE CI EI M EE T CE PT C P OP OO MI OO N PO PI MI N Z T P SI OO T PO U DI E D IO OS SO TI T Z PI E TE E ! Z O!! U E](https://vuejs.org/guide/reusability/composables.html)

---

> 📘 _Cette leçon fait partie du cours [TypeScript Et Vue.js](/vue/vue-typescript/) sur la plateforme d'apprentissage RostoDev._
