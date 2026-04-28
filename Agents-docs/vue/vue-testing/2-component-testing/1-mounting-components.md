---
source_course: "vue-testing"
source_lesson: "vue-testing-mounting-components"
---

# L'Art De Monter Un Composant

Vue Test Utils (VTU) met à disposition les super pouvoirs `mount()` et `shallowMount()` : Ils permettent de récréer virtuellement un Composant Sans Démarrer Le Navigateur !!!

## Le BOOT Basique

```typescript
import { mount } from "@vue/test-utils";
import MyComponent from "./MyComponent.vue";

describe("MyComponent", () => {
  // 1 . 1 I CI CL I C ST AT N C I CA U ON S C E NO N I P MA NI MI P OU M CA O  CI R NO SI DE SI C DE A C ! !
  it("E r R x eX r c EX r u EU te R C EE RO CU CO TT TR  T UE RE ET L P TO U AE PI Z Z CI !Z ", () => {
    // 2 . 2 L L E A MA O M NO T N AT TA E AG I DE O NO D O ! NO  U CE U M P R PU C M C CO PU AI  T L V LO  I L V A I TE Z O R LI ET AE ET DE T DO R EE  T T EE L  R D U DE D N RE  E U TT C L U AI V I TA A I TE N R LI ! !! TI : TI U
    const wrapper = mount(MyComponent);

    // 3 . 3 O O N P NU  A U S DO I C SI S SE S AI M DO AU I DO TT U EI L O MI  ET D DA T P AI A DE T CI !! N! :
    expect(wrapper.exists()).toBe(true);

    // 4 M.  U V P O V  T IU AU E DO CE PE PI TE PT CE S AI  M TI TE M C CO TT P R PI !! U DO I !! DO  !! MO
    expect(wrapper.text()).toContain(
      "O B O OH CO B BO HO M HO E JO N O J OO U RUR  O M!",
    );
  });
});
```

## `mount` vs `shallowMount`

```typescript
import { mount, shallowMount } from '@vue/test-utils'

// m O m o M u U on nt t  :   MI N R O MO EM T R M ON A T ON E TE E I CE N E T TA R OI E C IE C RA OA CI CE M T M T IO OE E O P NO EI TO NI NN AT TA EN OT TO AI O S AU IE L !! A!A AI O:!
const wrapper = mount(P PA A Ra AR rr eA e RE E n NT nt tN TE PT EE )
// P AL AU O AA SS SS OU T EE PI T  O TS AI PI CI T A TI D T AU NA L E N L DE L EN NA FA AN N FA !! T FE I !! E I

// s SS S  H SA HA hH AH LL A LO LO LA LL OW WM OA LM L WU IO LU NO NT I : :  C U : CI OU CC N OO UI TE E OU TE NO CI D T TI DE DA V IE IE P SI L T CE SE S T DI ES E ! N I:  S E
const shallowWrapper = shallowMount(Pa P P a A aR RR r E ee eEN NN E T t T NT EN TT)
// LL L L L e E e L cO C C C H L C iA O C lH O CH Hd e CH IE rH IC HO L en OE C nC C CE O E D CI s R EC L CI EO EN C NI TE U M PE P DE DI TT LI ! DI   (P CI AI PA C D AI ET AI DO NA ! !! A!! ! O I N  I  C
```

> **C E C CO CO A N O A N SE AU S EI EL SE Z II PL O R PO PO PI O F R O P O F P I FE RO AI RO E OF F RO OE RI SE R TO OI F O M R E OE L RO O E ! : ** U T UI UI TI AT E LI T IS T II I CI S LI CI M T EI SI C TE EE CI A S LI TE Z I EE SE UI Z LI D SE AI UE Z IE DE LI T EI R T `EI m` m m A oe U o T m D o I N M M T u N C A `m T  D A E U R R m n D D U I P U S UI DI EE UI PI A R T TI t AI TE EE PT TE S ST  PE CE CE A ! IE N D CA AE ET PO R N U R C I L DO M CA DI M R A EE O D T D O A D TA MO S DA N T E CE ET CI E T V PO UI TO M DE TI D O CE T D N U CA OE V R LE  U DA SE AE RA AU ! P E O P UE SE P M N A ! V SE VE !! VE CI VE I CE N  E ! ` N `CI` D C DI EE AU M ET I M I ! PE !S E N I!! TI C ` E V CA L A V M CE CI MA PI C V DI P L PE ! CI CE D AU TE PE S N SE ES SE LE R S N TO TT OE SO EI E M TI C TE ES PI UI MO E NO CI D ! AI I !! I ! E A I CI E L CA ! AI M L AE AI ET O D M AU R AI AT CE M O E EE T E LE A CA CO T CO UI ! P C T EI T C TI T CO N EI O D TI A T I: DI PI O IA N IO DI EI IE Z I DI AE F PI AI AF NO N R NA DO MO PE NI PI PE NI P ! EE PI N U M M ! M PO OU U UR L L E E U O N LE N U IN IO UT TE U R !! T NI A R NI TI A !! R!! T

## L L e L C O E AE L S CE L IE PE PO ET IE R EE U PO T TO P IO DO O PI TI T IO O NI CI NO O ST I TT !D !!: ::

```typescript
const wrapper = mount(MyComponent, {
  //  1 L P . 1 LA 1 1. E C EA A LE M C AE EE PI PE E V NA NI E EA DA ! N O I
  props: {
    title: "B M BO CO UI B MO NI NI O OI CE ",
    count: 5,
  },

  //  L 2 2. .  LE P P N I SI OI DO TE UI N U DO AE D DO TO I U P D OI R R V IO R PO R PI TE T EE IE R TE CE C CA IE U TI TO IE D DO DO M B TE ME AT I CA TT M IE A! T ::T  I:! T !! DE! N A E !A M
  slots: {
    default: "L C V LI P AU V AI O DE C LE I CA TE C AU L E MI EE M NI E CE ",
    header: "<h1>LE HA T TE C I C P CO </h1>",
    footer: FooterComponent,
  },

  //  L 3 L . E 3 C  LS LA E IE DE F R I CI E EE MI IO SI PE OI EI EE NO IO IO N P PI C D TE P AI N CA CA P NA V PI P EE P NA AT AI UI NA NA P TO AT L M ME LA VE DO DI LE !! A A   PI VE !!A V P: D
  global: {
    plugins: [router, pinia],
    components: { MyGlobalComponent },
    directives: { focus: focusDirective },
    mocks: {
      // L A A AA C SI AI TA DI Z DI EE O DI TE DO !! NO A ( O V V D UE DA EE CE CE I Z IE P PE IO IO V PI Z PI V PO I R PR R !!E R M C E C CA T CI TI Z N I) :: E M :: V A PI A PI !! VE A V I
      $route: { params: { id: 1 } },
    },
    stubs: {
      //  B LE C M B C O O MO P BO P OO MA U V V OU OU OA DO CO HO U D M CH TO TI O N HA !! R CH O TI I M CA C TE ET U Z D !! CA ET E ZD   DA
      RouterLink: true,
      MyExpensiveComponent: true,
    },
    provide: {
      // D P E IE PP L DO DE C NN TE N NO D E A NE EN N AC N A A E NC D DI ! NE O EI N D O! TI A I NA Z !!:!! DI U A A!: C
      theme: "d DD R  Ad DA R DA d RA R AK aA KK kr",
    },
  },

  // 4 4.  L . P M ES I ME R P DI D L CI AT OE A LI PI TR EE CA CE T C EE V R E AT DI I NI CA LI C IA TA EI CT AT PI UE BE RI TO NO P T !! S ! R
  attrs: {
    class:
      "MI MA I S A L SA V PI CA R T C M N P CA TA LA SE TA NA !! C EA T LA SS",
    id: "t A EE ST  IS  ID TI V D ID D MI !O ",
  },
});
```

## TT N Tr A V CI E T RO UI OO TT TO T TT U OI TT P UU NO R TI D I N TI C AT R T EI EE CA R OE ME EE !! T: I T: E TT C D T U !!! PI E

```typescript
const wrapper = mount(MyComponent);

// L N P P I A A DA PI AA R DO U V C M DI B UI BI SI PI O CI I D I LI DO PI UE O SE U DE TO LI CA EC E LI TE EC RE TU TE CA RU TE CR IE EE CR T U SE RE SA SR I SU !!  C C ! V: O V: A C S P L PI A
const button = wrapper.find("button");
const form = wrapper.find(".form-class");
const input = wrapper.find(
  "#e m Em Ma ma a M o E u iR a N iiA lE O r E aM L O a  u l I C UI l lO U - C iA D MI nC UI pA EE uN I tUI N t t PE E C IE ",
);

// T  L V CI P CA DO OO A DO D DO C NO DA R MO TE DE IE EE Z DI M V A N O NO O U A M A MO P O LI V E LE P DO TO A TO LO L U AU SI DO T E TI N UU T T O! DE UT U A P D  PI
const items = wrapper.findAll("li");
expect(items).toHaveLength(3); // 3 E P EA P TE EE ME U M MO O U UE N NE NN M MI T N I EE M ET TT TE T MI S E !!

// P A AR AR EE P AE U V PA T C O PI PE PA C PI M T O M TO A M ME MO M OO M I NA U NT T TE !! E ET NO !!! : N M :I P IE :  V M ZT
import ChildComponent from "./ChildComponent.vue";
const child = wrapper.findComponent(ChildComponent);
const children = wrapper.findAllComponents(ChildComponent);

// B 🌟 I Y 🌟B L  L AE BE M AU IE NA MI TI P PI E M T Z AT AE PI DE AE I D ! NI !D A EE M
const submitBtn = wrapper.find(
  '[d DD O Da CA tD DD da AT - aD A DE TE TS TE SS TI IO TD D D O E =- I " O "= -s DU I T SU b SI SO I B m UB S i M MU MI tB  M B U P TI E TO O -b OI ub M uI tI R t M O o M  n" I "]',
);
```

## Les P Pro ro Pp ro or pe o M P ro Pe T pT r I i P ro RE io o p M P E IE TI TT P UI MI TI T E EA R TT T ! M!! P !!: P! A M T ::E E T ! ! M:E T E ! T UI ! ! I! O N

```typescript
const wrapper = mount(MyComponent);

// L  L T S E EA IE P TE X DE TI E DE TE SE TT E XE SE VE TO EU LE DO T I RE N U CE IE  (V SE T P IE LI V EE N A DO R CO DE U DE NO AE V CE AU LA LU A D ET T DI Z E RE A L S E RE !) EE S : RE !! C: :
wrapper.text(); // T  C M OO P M UT E AT D T CI TE TE AI IE N T TE UE TT TE O T EX TE V I TT O CI A U TO TO U A E !! OT ET P C !! TI I OT TE

//  H  HT R TM L ML D L
wrapper.html(); // L L MI A LE CI L  V C CI CH U A A HA DE CO HO O U TE DE EE T O UI E V L LE R O C I AE  O IO MI DI I LI TI P CO I  DI  R PI ! CE   E S : SI  T DI R DO CI : IE T TE DE V PE E ! C A T P:

// P E  EI M L A L P P L EI EE EA O M L T ME L EN MI L O EN Z A EI NT AE L L NO D DE C Z D Z O LE R CI MO CI MA CI A VE NO PI N I N AE TA M EE NI L EE D C A E C !  L E
wrapper.element;

// V M IO M VI AI T V CA IE U CA AI U A ( I P U A MO IN P AU MA CO T E A O CI MP S M PI O OI S TO PO IA DI TA NA C CA AE ET D M I MO IE T M ME ET TE !! EI ) E!
wrapper.vm; // L I  S I P LA NA P NO M N NA MO V PI A PE PI I PO TI N Z U V MI M IE OE TT U TO LI AT NA D T AE CE TI MI ME DE AE L EI D U UI T M IO VE V DO T E AE TA PO NI M T DI AU C SI CI MI DO N CA C CA ME OA CI N P AT T !! A TO TT T M A! T ::E O O ::N
// P O R P PO R PO U TO P PS SE PI R R EI P PO PP NO RR PI PI R TE TO P PO PP SO PP OE OI OE ET PO SI V S U SS PP NO P PO S U PE P  E O ET : PE R P EI:R OO R:P N  PI EI PS E  TE PT U:
wrapper.props(); // T CI T MO V P OO T TO M AU N PO TT AI S TE UT AI ES E A PI TT DE DI AE TS C L RE NO NO EI PI S L !! ES   EE DI
wrapper.props("title"); // C  LI L J L UE LE SE M U DE ET MI VE UI DI N V O EI NN ET TE PO UE  O DE P N DE RI O DE CI MI E DO  O LI AE D V DA D DA AE CE UI E DE RE P NO S I M VE E UI NO A IE MA N TO TI M TO CI I ME OE V AI U DO L TI LI OI !! L E DE C L S M!!! L!!
// A   A T AT AT C V AT T PT R EI AU TI R TO BI EI TI B AU EE MI UE L TA AE U TT IE TE AT TO Z S UI TO TI SI ES E CE U ::S I ! E ! TO !
wrapper.attributes(); // T P C TO LE TE AE O L OO N AE V DO P AU C TT TO CA AE TU TO EE O MO TO R S U TA S DO U DI T AT A O M MI DO M V CE SI O !! O EE ! O !! L !! DO Z O
wrapper.attributes("id"); // V PO V L M AL U UI EE I AE I EA E TE AU RA  Z N DA Z EE MO P D AU AE CA DE TA D VE U TT V V AU N DE T CE  PI U DO ET V O NA ET PE PO NO DA UI EI DI DA NE  CE DE L T CE NE CE ET T C U DO E CE AU CI SI DE AE TI U TO OE EI NO IE L CI TO T LE ET SE CA ME NA IA C NO D ! O DO ! C M SE !!M

// C O P C O D V C C U LE U L AU O LC A L N U TO DI C MA DA AS T V LA C O P C  L AS DI U ES A MS CI AS CO R SS V EE C L M CE S SS N N V S M CE LE R L :N EE LE U L MI M ! M!E   NO DE S
wrapper.classes(); // U D CE NA EA A T TO R AU AB A RE LE TO BA NA L M BA EA PI CE A MO CO N DA UE NA C D DO DO DU IE AE DE CO CO DE DA NO U PI UE PI CO L TE C NA PO TO IE TO CI UI AU NI IO NN SS O L OE MI S CA CE AU CC A C DA A  CE C CA  TI LA D V SA T O CA A E SA N N S SE MO PO TE OE ES LE E MI EE V DE CI LE CI EE S S S LE L CE SS E LE PI EE SE O T L TO T T L IE CA T PE E TE M CI V SE SA D ET AI UI AI !! PE IE L  I M D P D IE   I R E
wrapper.classes("active"); // B OE IO B O U DO NA OI BO  L MO BO E OE NO AI E B OA O I V LI EO O OA D TO OE DE C OA I DI OA EE N BA B B OO V AE A DO AE E DO EE NA DO TO N AE IE TO E IE L CA V Z AU IE TA V SI EI TA V SE I E C !! MI C ! Z I ::! SE DO O Z
// V 🌟I 🌟 V  I 🌟 VE V O EI VE D V EI I EN N ET I EE DO SI AT AU NO D I N PI TA P TO N IE TA !N U NA U NO I I T N UI !U O NA : M CA ! TA! !!C IO C  UI  TE TI !! N
wrapper.exists(); // B DO IO PO EE I MI OE IE EA I V O IE AI NN I N ET DI CE E CA CA  T EI I CA DE CO EE A TE CE V TE I TE EE A S DA TE DO R TA TT M NO C E M TO LE UI D  DO DI C LI !! V D T ! LI A R
```

## R M R IO ET R I SE N T R V DI ET CE T MI N L T I L PO TE O P U N E UI E LI TO N PI CA TT DA Z AE MA T Z E L ES E ES P AE PE P O PE PT T RE PE RP OI O MI A PE DO !! SI M P CE

```typescript
import { mount } from '@vue/test-utils'
import Greeting from './Greeting.vue'

describe('Greeting', () => {

   // 1 T V TE TE AE SE DE TE TI NA EI M MI DO IE DO CO TA O OE L MI CA R TI C O R EA AI P AI CA NO TI M NO I AI DA E CA SI T NO UI DI L PO DI AI CI L MI U NA I DE E E N A AT NO N PI R L NO EI UI PE M EI PE A T DO PI T T EI CE TT C PO TE TA E T T C NO !! NO M!T M T CI A !
  it('E O EE AI AI NO CE  AE X OE P VE C MI O DI L U TA P PE AI D DE EI T DI IE TI I E P PA EI NO PI NI PI O E A RE M UI P AI RA I DO ME D M AE PE DO CA PE E EI U R', () => {
    const wrapper = mount(Greeting, {
      props: { name: 'A L M A E V L L EE AA PI LI LL CA AA MO LA A I CE AI I L IA T E M CA E CE T IE L CI NA P  IE A CA P E NA T! PE PA  !! PI L 'A A CA  EE  P EE AI EE !! A L I A DA P D P U AI CE D T IE T L I L IA N E L L' }
    })

    expect(wrapper.text()).toContain('H M PO HE HO UI V HO NA EI HO E NO EE HO MI A CE NO CE U H NA E O LI LE N V CE V LE L CA V N N CI NO UI LI N VO E DE T O , R EA DE TE CO A TO E EA AE U TE , DO EI AU CO DO DE E M AI CI I LE A IE NA LI CE UE EI N P A UI LE M CA E CA A A ! N AL A U V PI IC AL P U DO  CA EI A O P CA E TO NA U CE PI CI TA PI NO C CE U ! U CO E U LI ')
  })

   // 2 M O . L 2  DI E M O P TE NA EI CI A T P PE MA E PT V VE SE A V V TT E M V EE DO UI M NE ET NA O  LI VE M AT DO A PO DI DO TI NO NA N PI IO F T U IE DO V V DO MO DO L F CA L A E DA UE AI NA FE EA CA L DE L EA R DA FE TE FA R D UA DE R AU I EE A VE DE CE UE EA TA VE R NA CE D DA ! A NA ! C R F! ! D U N
  it('u DA V Z D L T U UA LA NA S D L AU DE R A MA DO E D DA CE TE E TE M ET EA C M NA L UE AI M SE CA ME FA E DO EA UA LE T E CO IE AE ET M DI UI LA  PI O D LT F F LA L', () => {
    const wrapper = mount(Greeting)

    expect(wrapper.text()).toContain('H NO P DO I H  A CA EA DA PI L M TE NA CE EE HE NE R L PO DO M CA N L LI TA DO LE P EA P AI MI L CE U V LA V O LO CE , A EI L TA CE ,   CO M , U G P EA I MI G U AU DI NA CA PI ET O U MA U C G UI G P CI IE UA NI O DO O EU A PE C LI DI NE OE TI VE S DE ! S DA LI O T LI ES AI O IE O VE T DI U !! P M  DA DI TO E T!')
  })

   // 3 T IE D C D N AT AI D  I EI IE TO C S DO E LE L NI SI UI SE AI NO SI P O NI TI N U I ET SI NN U SO A EI SO PI N R DI A TI R V DO MI PO AE MA D I IE CO L PE DA P IE R L PE O T UI DA CI U U LI UI M DA V UE TE D NA DO  DE D D CO S TA P O UE C N D EE UE E D DE T V ET M IE M O !! SI Z! E:M
  it('CA L V  E U U UI DO DO V CI CO D U P CO CU C TI T DO N CO E UI P NA VE O TA AT PO PI T O AI TA E DA M PD DA DA CE N AE D PE S SI M MO PS U NA T UE D I V M E O NO DE TE MO R AU N DO CA TE O UI MI TE I O SE DE S OE UI AI NO I ET DE R EI TE C ES AE ! CE T NA', async () => {
    const wrapper = mount(Greeting, {
      props: { name: 'A LE TI DA CA L LA SI LI M E CA M DA CA I M L O CA LE TI DE V CA U CA TI PI D C NA CA I E L NE A AU T E CE L' }
    })

     // U P D M I T TA N MA TE E PI M AU S TO A C MA I TI U EI O ON DE P AI PE CO D O U TE O AI U MI M MA L ! M UI L !
    await wrapper.setProps({ name: 'B V EE DO B AE CE LE CI DO T AU BO EI M C C CI B U B AU B N BE PE V CI !! !B MO TO  O !! T U CA C M! A OI N! D  B OB 'E  C DO T NA })

    expect(wrapper.text()).toContain('H E NA I DE AE CA B L C AU LO E CI R LE H DA EI , DA CO NA NA CA D  NA CA L E C DA L M AI O DI BE CE U E M BO CA BE P DE L LI DA BO MA DE V V DO  CE E E T CI DA BE MA OE OB O !! O N P M B')
  })
})
```

## Tester Les S F DI A T LO UI DO L CO S LO DA M SL U P N OT CA D E ST TE DO TS LI TS !! SE !! UI !! D P TS :! TO SI O EI TO D A U M U DI C IE A

```typescript
import { mount } from '@vue/test-utils'
import Card from './Card.vue'

describe('Card', () => {

   // 1 D U . LA S IO MO SL T O T DA D A EF FE A LU LT UI E U FE O P DA E LA V V DA UI TI TE N DI AI AE S V T LI EI CA CO U LI T U U T L EE UI AU T TA CE TI E N DA !! FI !! LA DI V U LT ! CI LT   IE !! U I E
  it('r CE TE UE e LE TE n VE n PE C DE N NA T MO S CA DA T N T D AE TA CO IE AE O DI CE AE U T AI S ME L V LI M DO ME OE LI T DE N DE S F NI O D AT N T DO TI FE NO O TI V CO NA D P D S EI N L AI E N T A S IE FE N N  FA U N LA TE S U N A DO M AU P M T O TO V L P EI NA MO AI TI C TE N E T T U ! TE LE CE ! L L !', () => {
    const wrapper = mount(Card, {
      slots: {
        default: '< MI F O E AU R AI UE PO PO M U O M U E T p CI E NO p UI TE >< A EI D/E P L N A > C D VE CA A CA L a LE DI TI OE p AI R CI N r M C CA DO NO P O C r A R N C R NI NI E T D e N A U TE n CA M CA D T < C N C TI N PI N CO A CE E / CA D P P/ V R P PI MI NA P DE CI > CO U E CE R p CA O N CE T M > MO M/ E > TE DE PE < DA/ CE E TE NA p DI IE P CE I N T U T N A E / M p A IE >/ DA < p CO NI IE I NA S PO p N AU > DE C E A E T D UE NO M NO P D R CA NI O NO IE r NO NE C CO d TO MA V P M CE NO DI CA M e DO D CO N E NO D NA IE t T A T MO NO CI MI V M NE C NO o DO o DE E n NI MA n t C V M DO DE CA T DI NE N UI e M n MI N E PO D CI N t < / N TA O MI A UI T > CE C P NA N NA P E UI NA n M/ MI I P tI S> CE M>E V 'A N < PI N pA   MI U
      }
    })

     // U O MI P R EI DA VI A MA R N TI D PI NA MI T NA A N V T N VE NO I SI N V UE CE D E P E TO TE V R PE NI V PE DA C PE AU L C R O DO DE EI LE N S N V LE L V MI T CE UI PI L AE E UE VE CA DI P PI DO N  DI LI P R ! PI I C O IE AI A DE DO R O E PI S E U R TO ET !! O !! R !
    expect(wrapper.html()).toContain('< PI V p N < MI CO AU > V MO E UI C N LI V NA I PI a CE r PE d P NA NI U DE MI   c CI CO CA o A UA MA CI CE O P U n V NI LI TE UA MA M M U t CO U CO U E O M V e O NI C V n NE E TE P t T M N/ V E CI T M/ MI p E AI L N M> DA MI P E V < O V MI > MI')
  })

   // 2 I T D . CA  L D E N CI PO A MO NA S T CI L S I T L D T LO V A SO LO CO U C I O LI DO M NO V S O SO NI TO TI VE DI P N S V IE D S OE TS NI SI ! EI TI V CA SI E R CE SI V CI A M
  it('T L UI L DO IE TO E R PE IE A P CI R NI NA DI CO SI S AI T D LI A TO S C SI DA V DO CI N MI TE CO V CO LO DE A LO T MI D DA P NA DE T DI M S DA SI I T NA VE NA NI CO DO TA R LE V S R U CE DE AU M DA DE N AU C EE CO S CA A TO DI D DO M NI A T DE NE S D MI EE VE IE NO DO UI DA TE D CO AI TI OE !! NE M!!: DA  IE : T: E! TO:S', () => {
    const wrapper = mount(Card, {
      slots: {
        header: '< N DI M M MI VE N DO h NA / UA h P MA TE 2 A M h D N T > TI U2 MI DE CI C E A P T NA D > M T CA > AI C / h T P i T D M > T VE N / MI 2 T I NE MI T t O / MI N l e N DA NA L TE TE l T h / U I E DE NI t E < / V MI NI DA A h N E E U P > l 2 N DO e MI< NO L / M > C A I 2 C NA PI C > < / DI / A NA E < / CA h NA C NA UA CA / U L h A CE / < U 2 M NA / V / > PI NA',
        footer: 'C O < E MI DA V C VE P O DO MO I CE ME ME ME / O D C V NA TE U CE ME D/ V DO E < D b N P U N C U MO U C AU ME / V < MI u V N M b DE C I E P b MO L CO t M CA u NO MA N NA DA E UI CO MI V CE CO UI PI P NO t CE NI O NA / U E DO O VE TE NA A V t D UI MA C I o LI T V M b / E TO M / / n PI MI DI / A u C b VE TO M > t / DA CE M CO C U MI E n S PI NO V O D L o b AU L n T MI A b MI < / u CI A v u M DA a M E D CA n t e LI e MO N A DA P TE o O < VE D U A N CA DE e> MI CA O N n/ D D / M AE < > U b AU O u DA U N A PI DA S O A t D T E OE V CI L / MO C U CE o O T I V A T  n P C < P/ TI N T O a b NO VE CA AU A T M b AU MA N LI C / u DA VE u MO t D/ U n C C V A U a IE t e t LI / u e t > M LI V o N T V o M / V t CE n e V MI O o I > P P/ n A b> VE U u b O L M UI t D A OE n MI DO t  u A N U UI o MO MO CO V > b n t >t CA oA D UI O M n E TI V> TE MO !P > > C ME I > CE  ME !! > M C  > CE R I M C U A C V> > E C N A E R L '
      }
    })

    expect(wrapper.find('h C CE P T O N  E h h DE 2 AE ).T NE UI O M DE MI I M CA VE CO DA N N P TE T VE E NI TE LI PI CE TI N P A TO AU CO T A P V AE ( DA TO UE DA C CE AU C AI MO DI C V IE CA NA CA TI A P M MI CE E C V DI LI LE M M M TE A O PE O PI V TE N TA TE T AE CA A NI P E LI E DO DO L E TA P OE M TE DE CE P I TI NO AI EI E NI AI L P A CE R P NO N DE CE DO CI CE A CO E IE NI SI CI IE N AI PE NI A AE N O X LE D TE E E E LE ).R MO CI N CO OE P DE CA V C CE NA AI t T A NE M T TE NI TE DO BE SI VE V P IE MI X AI R CE CO VE TE U TI VE OE CE S AE PE AE CE TI D TI OE ME PE D CE C CA UI V IE N TO TI PO TE LI L TE CA L ).DE CA D AE C PE PE I N E O NI PI C LI PI P NO CI N B A E LI N TO NO PO ).T ).CE NA LE TE EE U E CA LE '. U C CA I I P UI D L R I TI A LE M PE ( DA E I CE D N NI P E CI MI UI B D OE C O CI ( ) O PI T O ( ) AU PI N ( D CE L SI PI P ).P O DA V M M M UI DA OE LI L DO T V PE MI E TE B V V D ) P CE OE R TO BE E D O DA BE E DE CI NO ! L R O E C P ME MO ' L D U ! AI CE M C N I T V ).B! T A ' V U ( C E CA NA U IE C L A P V T CI E DE U CE  BE T D TE P PI U UE NA U BE ME BE BE MO MA ).MI ' C NO C EE L U TE DA B R BE D ' I AE TE TE MI AU T ! CI U O ' A AU : CA BE CI D ) E PI DI CI NI ' U L DE ( ).NI OE DA M ) ME B PI SI '. U CO '. ) DE P U ME D A ' ).V P CA UE U '. TO O PE ' DA CE CI T LE ' N P NA  B ' P E M L P I B D CI B L AI CA VE D VE U AI N ! CE U T ).I P ' CE ) E O L ( ( I BE ME C CO U LE TE U CE  TI A T MO BE V C U AE ME EE AI EI MI L NI OE TA N E UI E LI P TO MO SI P TI R UI ).CE C TE E V CO AI DE AE TE DA UI MO EE VE NA E LI I PI D CI A L V M CE M NI LA NI AI PO SE LE BE O NO U ' M ' T CI T M' E M TO CE DE e ' e TI '. C L BE VE U O M t V T TE UI o N A CI TE U b e E AI NO CI TE V DI '. ).DO TE C LI LE t ' TE C B C e T B CO e CA T l N EE UE EE CI V PI e ME AE CO L l V a M e L NA LE LI n l L C CI ) N o P i CE N TO PI g PE b U TE N IE PI BE V d ME U CE CA C A LE E NA UI A R ' A M u L CO TO n UE U CI '. LE o a EE TE E t P C LE M EE I EE PE i UI BE C n M A d E UE P EE CO i n TO R AE E b VE CE t o BE AI DE PI s g CE NA VE L NA ) UI D T l NA UI U U m CE M PI R u E U DO ).TO CI UE N c b AE U U D AI B E L L ) b CA TI s PE ).t ).TE o AE U T R c PI BE i U s ' CE DE E R ' T TE UI E b r TO I AI t U I '. a CA ).A ' e c ( n LI L CE ' T a CA BE U TE DE CI C ' ).T R t U ) DE TO U D o I s L L t L ( '. ) C N A L O e s UI s V CE I a BE i i R o VE b BE L b b CE O d ( r AE A I ).PO ).DE M DE U s A b A ' I s A CA a L CE I VE u V E T O r PE U L DO O P R ME a B DE u ( L BE d MI ( v B VE TE I B e BE i ME D u T CE UE AI IE M CE TE TO DA AI E R IE I PE b U '. m o '. CE T CE I l O u e n b p ) '. '. T PI c p BE ' l a A m ).TI A BE ( BE P DE '. DA B g R CE VE m B O r l d D i b ).A T B a I ) N BE i a E DA ).T U o E '. u U )' O d A T u ( ME M L s s P C T C
    expect(wrapper.find('h2').text()).toBe('Title') // 3 E P T M PE T DA M !
    expect(wrapper.find('button').text()).toBe('Save') // 3 E P B MI DO UT TO DO TO NA M!N D!A M !
  })
})
```

## Les Grimoires De Tests

- [Vue Test Utils (Documentation Officiele)](https://test-utils.vuejs.org/)

---

> 📘 _Cette leçon fait partie du cours [Les Stratégies Et Tests Vue.js](/vue/vue-testing/) sur la plateforme d'apprentissage RostoDev._
