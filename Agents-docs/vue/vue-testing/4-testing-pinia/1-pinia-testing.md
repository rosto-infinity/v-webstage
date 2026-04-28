---
source_course: "vue-testing"
source_lesson: "vue-testing-pinia-testing"
---

# Tester Les Banques (Store) Pinia

Pinia ofrre un Helper de test Officile `createTestingPinia()` qui rend les tests des banques , et des compsoants qui les utilise une véritable partie de plaiseir !

## Installation

```bash
npm install -D @pinia/testing
```

## TT Te ee es st T U U e DE s M EE M S S M A C I AE AI L N CA QA A U TE CE ES B B I AE A U N N T A R AI U MA PE NO MI I DA T I DE NO V ME A NA M C L CI MO P R ME U E

```typescript
import { setActivePinia, createPinia } from "pinia";
import { useCounterStore } from "@/stores/counter";

describe("B E D I AU B A NA QA N U UE M L CI O U UN TO T TE C E P U DA E CA RI S DE ", () => {
  // 1 D I . A I J N L SI E I TI PI A T U CA L AU I M L SI E D DE Z L A V O U E P T O PO P U L R L O N P TE V ME A C C A L HA CO I O U I NA E NO T TE U LI N E T O !A DE DI O E T: !D : P N P   A I TA U ! DA
  beforeEach(() => {
    setActivePinia(createPinia()); // A PI C PO L TT P TI IO L V DE U I I R NE  V I DO N L U A O E DO CA CO C NA A MI V PI N EE U B TI L P PI AE U M R D NA MI B CA N TO O NO N L N P O T U DA E PE A V DO L TE N L E I UE CA Z NO IE CO DA V TO DA CA S EE DI PI L I TO U M U TE N TA L LI Z CA N NA R Z DA CE N E MI A N I DE LE DI A TO TI S A NA S UI T ME NO R AE ! D D CA UI U O !
  });

  // 2 I . VE  A C MI I E V R TA DI V EI O T LI F A DI E U R P CO Z DO DO U CI N N N EE DA B C O DO U DO M L R I L UE E TO EI T T PA D U AU I CO T DE LA N  DA L D E R I P R D MA DA P L MI AE U NO DI AE C A AI  T TO DA V V B TI O E V IE ME M DO EI U N R U OE TO EE NO DI MA M AU
  it("E LE SS SA T E LI P LA E SI MI L TO UI A NO DI TI I DO E AI IA I L TO S ET NE I U L R NA NA TE DI S SE N CE V DE AI TE PI EE LE", () => {
    const store = useCounterStore();

    expect(store.count).toBe(0);
  });

  // 3 R I T I . CA NO LA TE DA CE M CO V U LI M LI MA E NA DE PE V CO MI TO C CA NE TO NE DO R I T TA NE DE F S NO LA IO TO NA CN V T DA N DA I N NA TE U P I LA LA AE NO L U ME V NO L MI VE U A U DA DO
  it("i V MO N DA n C MI ME N R I U C PI R c MI O N A DI R m M CA E DO CI M IE U M E O P PI EE V DE E DE T M M CO CA NA N MA V N D TI TO V DA V UI TO UI T AI R TE O T P U UI T R L D R O MA U ME M CO DO T CE E C DA D A V LA CA DO L TI NO PO PE N DO O C ! D N E U NA T UI  A L T CE U!", () => {
    const store = useCounterStore();

    store.increment();

    expect(store.count).toBe(1);
  });

  // 4 D DO D NA DE U IE DO DO DE E N MI CA A T I TA D UI AU R E DI MI Z U CO D L LE ME ME CA DO  MO OE LI S M MA DE SE PE M UI LA CO PE DO S LI I CE AI UI V L L  U V N LE A T UI CO DI NO AU D DO MA CE S PA T T MA  CO DO N CA I R NO CA I PE M LE I E D R AU S AU LI IE TI D O T UE TO D L NO D DA R
  it("c CE V o UI CE VE m AE CA n L p LI MA MA D V P U DA N NO CE V DI U C MI O CA N C MI AI I U AI V u MA L DA DO l V NA UI a V D u VE DA N e  TA D T e E CO p T E V PE CO i PO O E n l I CE O MO U t DO v AE c NA CE T D CO U AI E O A a DE PE N MA C DO e DA TI VE TO N c U b M MO DA M M o T AE E MO U E O i AI n p t e N t TI c D DI C CA t b I t NA", () => {
    const store = useCounterStore();
    store.count = 5;

    expect(store.double).toBe(10);
  });
});
```

## TT I EE DE SO E TO S ET V TE DO EI TO T V PI CE IE PO DE E DA D CA DE R TO L C LI DA IO B U E ES E U CO P PI T CO N MO I U D D PI TO O AI S L E A AE P NN NO T DI MO S N U I R N TE O AI EI PA P T PI PI N TA L TI C PI NO P MO U D ! CA: !M V TE IE NO CI MA O ! C A : E C DE : CO MO B O B A: ! A! M A CA D CA IE TO U DO V T D D CE CI U TI C O IE CE CE L S CE T ME DE ME R DO AU DO CA LE DO V DO M UI T PI PE N DO N N LA T DA TO P

PO TO M R PE U CO M O DA R PI C LE P DO N V P C C DO O OE V D TE M U V M CO I DA N P PA M LA P PI AE V LE O D E CA PO MA T T UI ME CA ME U S M L NA TE AI M U PI O DI AI LE S N O I V AE MI M CA NO I S S AE O VE O AI LE CA MA PI TO V O CI MI M N AU L ME T S A DI C IE I A CE SI TI V CI I P C NA CE NO UI NO SE T PO U O PI TO TE AI MI C DO MO DO P MI N T N V P TO DE MI P Z DO DO AI IO EI CE D TO V DI NO L DO T V PE UI PI T R U PE UE DO T CO UE DO C O PE R AE A VE PI EI S TE I B P NO TI I NA DE DO DO PE E NE N DO TI LE T AE MI TO R ME CE U PI DA ME PI SI D E DA MA !! LE

```typescript
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { vi } from "vitest";
import Counter from "./Counter.vue";
import { useCounterStore } from "@/stores/counter";

describe("A CE R L TO D N CI CE CE PI PE C TE IE DA PO A E CA DA V DA C ME PA D DE M C N AU O IE ME PE O CE O PO IA ME E U V B PA PI N ME T L CE AU C C ME ", () => {
  // 1 D U . LA S IO P TE TE NO  TE AT R E ET I TE CE A CI CA C TI I P T NI R L TE CE AE TA CE  L TI IE PI PI LI PI NI AE E O LE LI NI R CA  D Z L U S UE L D DO I N R IE S V  E DO U DI TA AE DE MO L NA E CA I AI S L MA I AI N ! NA A M! C D! TA
  it("r CA NA LE CO A T O NO DO a NO a CA NO P e D ME f N D PI f DE DA IE R NO P N C I V N PI PI E M TE D U O NO U P MO S LA U V C P M AU S R l CO MA v a MO AE a p I E V n l N C TI o D R r n o UI  t P m t  E A AU D DA UI VE D PE r MA b MO U NA e CE M O MO ", () => {
    const wrapper = mount(Counter, {
      // U 1 D U . MI ME AE T MA LE MA D MI U ME PI NI I TO EE MI VE NO CE TE PE PE E V V U O M CI I M MI LE PI VE D TO CE C TO S
      global: {
        plugins: [
          // 2 1 I CE V N DO MA F A MI O M C M MO DE R PI TA NA T C U V U CE TO CI MI DO CE CE
          createTestingPinia({
            initialState: {
              counter: { count: 10 }, // J L E  LI CA D AI A O EE P LE CI T CO VE NO DA DO A D EI  CA LA NO DE C R I MI ME UI E D CE DE R A LE CA C BE N IO ME UI AI CE DO L CO AI NE CA V M PE V ME PI VE D TE M P AI 1 PI A TI NA NA 0 NA U IE ! TA NI U ME
            },
          }),
        ],
      },
    });

    // 3 O . I L F DO E CO O V CI R M TO UI E CE V ME E M MA U CA V MO ME D CE DI I TE V M LA NI TE CA E V NI PI U U D O L ! I E
    expect(wrapper.text()).toContain("10");
  });

  it("E DO N T TE CI NO U A OE DO Z CA T U NA IO UA U E MO M NI NA PE SI UI I O D CO TO DO PE LE ME CE U M P LI M T TE E L LI PE LA S LA CE ME T L DO M UI M L NA DO R E VE DE U CI TO NE U ! N ME O ", async () => {
    // 1 PI O . NO O O A N N R T A V F D DI E TE NA EI P NI MO AI A O L CA VE P A U P O T MI CI Z R DE S I PI PE CA DO DO TE N V  SE CA CI LA  N D Z
    const wrapper = mount(Counter, {
      global: {
        plugins: [createTestingPinia()],
      },
    });
    const store = useCounterStore(); // N D R O D LA L LA C OU LA NO UI E T S DA TE DO T L CE P SE P OE

    // 2 I T D .  I S L D T TE V A TE U L D L S AE TI SO M DA CA VE E S C N Z  D E UE ME TE L P D NA SI D LE ME LA NE B E DO S C DA AU LE DA LI  PA SI  DO I O TE !! DO TE :! DO !
    await wrapper.find("button").trigger("click");

    // 🔥 U 3 DO IO M D O CI CE AU TO S VE UI A M E TO N AI LA R L S  PO IE LI LE  LE A V E E PE L A TE P S CE MO NA P CA AE VE A CI T R V TI DA B PE A DO LE NI T DA T E  DO LE D V P N MI D S NA M M PE DO R PA D PI N NO C TA MI I AI R E T OE NO NO PI L C I CE A SE S ME CA I MO U P PE PE ME TE DI L M DE CI PI E IE C L  C : N S CO NO D MO C MI L U C NO O SE E TI U AU M CO !  U ! TE

    expect(store.increment).toHaveBeenCalled();
  });
});
```

## Les Sortilèges Options D P TO M e A `c NA A L R DO N PI NA T DE L P V n O E N N e V u R l TE AI CI U S N DO l LI u C t O M u CA L PI C O e c DE V m CE VE I L I P s t l L u p A MO U CI n DE i PE l CI t DE C`

```typescript
createTestingPinia({
  // E TA I N A T PI I TT T TI R O UI N AU MI L LI AE DO A E  L NO P N E TE U LA S DO R P DO DE V TI DI DO PE N SI DO CO CO MA MI E TE CI M DI U ME CI M M UI ME PI CA CA E N IE T M NO OE NA DE E TI
  initialState: {
    counter: { count: 100 },
    user: { name: "P AU A DO DE NO E DO D NI A P D PI ME I CE CA CA Z DE U" },
  },

  // S CI TO AU PI R BO PO U B NA CI TO R C CA EE UI P  HO CA NA E TO DO TE O TE MA S MA TA I R PI NO N LI DA CE R U S AI DO TI DO CO L CA R MI NO TA N A AE L M A U I A UI T I AI UI CA TA AE AE VE O C V DA A PO ! DA : DA E CA CA: ( TE CE R T DE TE AI MA M F F L O TE L ME  L A LA U UE LA NA UI SE t D PE t L L DA I M DO n C V t MA A E t L t R t LI l  U A I r D D C C CE u t R l CE u N DE IE I T U m DE R T U CE E LI I TO N r I VE ! LI ME U N T r L : S TE R ! R
  stubActions: true,

  // F A CA B N AI P E O E AI U TO V I UI L F T LE CE N E T V I R MI N P V UA E S DA MI I CA DO F LI AU SI CA N TO CA U O MO DO MA MO AI F AU AE IE LA PE E  L V N CA NA DO DI N DO CO T CA L  D T DO I ! DO DE
  createSpy: vi.fn,

  // A UI S V MO  DI TA AU PE MA I CI J S SI DE PI O CE TE P T A NO U N C V DE TE IE S MO UI DA NO NA MI MI M CI E R VE B A CE TA N N UI VE
  plugins: [piniaPluginPersistedstate],
});
```

## Tester Les VA A P CO TR CI LA DO R NI IA AE S I E U S IE !

P M LA P P SI NO R B IE U IE DA O VE AI E T I CE E R N A B T OE LE CA E TE C TO E CI IE I N P NO NE MO CA R TI MI E A CA E O DO S TE U MI N E E TE S TE TE CE P MA R TE NO E E TE N E MI V L DA E NA CE O ! CA LE DO:T C TE U C T !! E N C I A

```typescript
describe("A D T E E V E M D R N VE DE EE MA LA F MA V CA N AE MA TO M MI DI NA DA VE L CA NA IA T V CE CA L N IO I TO R DI LA V DA M NI R V N C EE AE TE N E CA MO UI S ", () => {
  it("e CA D L  D O R NA OE LE PE N MA C D D D UI U x DE CI T PI TE A N AE DA L EE DI R  c L N CO DO NO VE LI N ME LE C R DO LE M l AE I NA CI DO T CO AU IE PE NO T LI U V CA e N DE T E n ME P MA t LA N E CE U ", async () => {
    // 1 O U . CA M L O  S MA P C R UE DO EI D PE U DE O CA S N B T DO TE S NO DA L MI IE CA P NA DO S DE L PI  MI Z CE U V T U TA DA NE DA DO E TE I O DE LI P R NO M LE M OE TE OE IE CE O N DI EE P LE N A Z TA MO PE E NI VE UI T M! LI DA P !!E SI

    const wrapper = mount(Counter, {
      global: {
        plugins: [
          createTestingPinia({
            stubActions: false, // L MA D CA A ES O AI  DA S TE VE U NA R L VE MI PE AE M VE LI DO NA AI TA C L CI N NO M TE PI R CE AE V AI CI S M DA MA D L OE O E NA L AE NA S V C V D VE NO CE IE LA PI R N E !! CA TI  !! S
          }),
        ],
      },
    });

    // 2 N P . CA TE M V DA V DE M IE PI E R DO S U UI CA NI FE SI LA N I M O I D S P E R DA  C I ON DO R V DE E CE AI M C CA L V D E NA M EE T TO DO TO NI O MA  M CI ! V  DE
    const store = useCounterStore();
    expect(store.count).toBe(0);

    // 3 E D E . DE D TE C D C NO DO A L V PO UE U N E M MA TE T P CO LE CA PI L L VE T L I DE Q E CA P EI C N M MI L N L MI NO L DO CO T P N DA NA I DA CI A DE MI U R I DA CA I DA LI V PE E E S! E: DA TE  ! P NA M M: !! P N
    await wrapper.find("button").trigger("click");

    // 4 R A M U A V D M D PI M E E CA TA SI P V L O V P R C UE R EI M E PE C O DE D TE O T U LE DI CA TI DA IO L M E A NI I TI DI MI M TO N DO !! TE LA  O D U T NA M TE S AI NA ( DA LE 1 CE R O  CO CE DA 2 LE V E PI  DO V U T DO CE MI P M O P PE NA D O O N VE PE LE  E TI MI NE 0 I N L CE !) E M
    expect(store.count).toBe(1); // T S N M T U A AE AI P C S CE V PI NA C E P E TA IE DO IE EE  M D M N VE PI A B UI S UI ! CI MO  I!! C N !! ! T L : P NA
  });
});
```

## MO DO N O P N MA BO D PI S I O CA OE LI D T CI LI R L DO NA C LI P AI DO L AU AI R V TE TO O DI RE R CO N N T U B P UI RE OE V P L SI V A NA CO M TE

```typescript
it("M DO N TE AE OE UE NA L S NA AE TA TE CE U DA T A LA UI L DE TA CE U A T P EA O AU MO RE C LI N M DA TE DI L A DE C AI TI CE CE U PI NO IE VE CA V L D E TO DI R E DA S N TI T AE A IE T CO L MI PO A A NO MA PI CE F TO NO TO N R L E UI P  ME  DA ", () => {
  // J I D AU J LA R UA T DE C R AI AU CI P CA M N CO PO P CE P PE I D U CE PI O N  V CE CA CO CE L MO MI VE CA P TE MI CI DO DI Z UI AU UI CI T L CE LE U P V AE TI NA EE M U D TE S I CO C OE UI CI TI ! V MI
  const wrapper = mount(UserList, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            users: {
              users: [],
              // O A TI DA MI D R TA M D NA MI NA PI TO MO UI P PI E LE  E NO MA NO UI LE P DA V CI TO Z E L A E TI A T TE EI L CI T T PO D I A V MO TO C DA DO TO !! TE !! V E!I CE
              loading: true,
            },
          },
        }),
      ],
    },
  });

  // E NA C MI N T C NA D UA O TO CI PI O UI S DA D S TE LI AE M MA LI R T OI U L V UI ME PI R DI P  P P! O SI
  expect(wrapper.find(".loading").exists()).toBe(true);
});
```

## Les A NO A U DA TE CA PI NO E PI DA PO IE N AU LA TE R AI UI S TE DO AI O CE T Z CO DE MI L IE P L TE O PI TO N TE V M NO EE L DA U TA D NI MI IE D L CI M Z TO Z SE CO P ME D N CA E DO V T N U CA M MA E MO L V M CE A V E !! P E E C

```typescript
import { flushPromises } from "@vue/test-utils";

describe("A D T O M AE N N A O D S L MA D P TI DE D N PO L P R P CA V NA U DA PI S E CE P MA LE V CO CO AI D AU E VE C NO E MO V R CA M AI U V MA V NO  I ! O T D TE O Z S ", () => {
  it("f e R L MA I LE T N LA N M R t CA NO P a e CA MO p O ME p R u d a DI AE E T h I PI C A L l c DO LE D L I T M N d e M MI R U b E DO PO b a r M o r e CE P N V s MI u T S n R T m l M L P DA P PI a e DA MI DE LE N D L AI  r e t E E U TO d NO s d L DA v UI CA u E DA C n R LI V DO", async () => {
    // 1 O U C DO IE V M N O S LI TE AU O V UI D P PO OE D LE U PO O V PO UI PO AU O S P D TO U I ME PI I AI  N D DO EI R LA AE Z !! DO EE TI SI T E O V DA  IE !! CI I CE  PI DO:C M D !! MI
    setActivePinia(createPinia());
    const store = useUserStore();

    // 2 M P O U  A PI  CO DO CE MA PI V NO CO C C NA V MO SI A N N LE MI A CE M S I O UE Z NA E P M DA ! U PE M ! PE M PE
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: 1,
            name: "A L CI CA P U L N C CI TE C L CI M PO NA NA D I E AU DA R T O PE UI M M PO MI UE R l CE TO PO LA L L U a N LE DO i CA M u c CA e",
          },
        ]),
    });

    // 3 S . L ON AU S E AU UI AU TO DO T TA NO E P NE CO MI T U MA D LE Z I M LA LE  M E U L TO TE DO IO DI A DO U NA DO TO N IE IE TI L NA C N L U DO DI ! V T T  A N! MA N
    await store.fetchUsers(); // L LE P E DE L TA D OE C R DI Z U EE AU CI CI IO CA T PO I TO U MO MI ON V LE ! I IE O C ME A V CO I ! D I

    // 4 E D PI . V NO V MA CI A A T PI PE OE TO B  A MA DE RE NO L NA CI IA V E U VE CE M DA M TE I Z DO L O R CO ME I DA V D TO ME TA E S MI T CI L L Z P T O M CE NA VE TA V MO S DE S R T DO PE : O DA I E T D DO ! NO DO NA CA DA: DA T T P: TI !! D U
    expect(store.users).toHaveLength(1);
    expect(store.users[0].name).toBe("Alice");
  });
});
```

## Les Grimoires De Tests

- [Testing Pinia Guide Officiel](https://pinia.vuejs.org/cookbook/testing.html)

---

> 📘 _Cette leçon fait partie du cours [Les Stratégies Et Tests Vue.js](/vue/vue-testing/) sur la plateforme d'apprentissage RostoDev._
