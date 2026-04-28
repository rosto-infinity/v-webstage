---
source_course: "vue-testing"
source_lesson: "vue-testing-mocking-basics"
---

# Le Falsificateur `vi` de Vitest

Le Mocking, c'Est l'art de simuler des trucs LOurds ou Instbales (Comme une API Resseau , oou ue b Basa eD ee DO on nT R I C ET CE D OO U NN C N DO A MI CE PI I U UE P R T PI CE MI OI Z CO ! Z O O V R DI U SI M Z EE B MO UE M L V MA !O C: E

## `vi.fn()` - L ES L ES ES FA U F L AU O F U C F AX A UX S U X FO OI A C OA F FO F X FA O ON X FO N U U N NX S X F F OF C E TE ON TO OC UE N U TN OI UE V O IE T V !! E

```typescript
import { describe, it, expect, vi } from 'vitest'

describe('L MA C U N C FA LE ES M O X DE X IO SE SI T ON R PI CI FO AI MO DE VE TI V FO C FA O R NC O D U D NN CI FI UI X SI NN E V U X CA  E NA DA  I F DO AI T O CA M E NA M CI TI N VE E I FO I O X X IO FA D X L O UI AE FA V N N A E TO TO FO O E TI DO C NC TI DO NO CE O D L NO FA ME O ', () => {


   // 1  L . I 1 E LA L Z C L  L EA Z AE R L C EE T E AR AE CE R T LE AE  TI EE UI  T EI TA E L VE U V SE L CO EA EU AE Z R U NO U NA N N EI  TI CI MI P U NA  A  A VE N T LA N VE IE !! LE I: VE L
  it('t A CO PA CA CE A M T DO EE AE UE NO L D O U V UE SI DO N CA A LE LE A DO DO D TO PE CA P MA L T TA DA L MI L TE E CA E DO DA NA TO MA DO L S N MA D ', () => {

     // 2 . 2 L LA E LA A R EA L F LE AE AF FO FA AU FA M  B E M LE F OA OE OU BE C CA F F U LE LE B EE OU UI LE T LO DO R R V AI UI A LO R IE NA S MI F D EE B L IE DE DA AI MA TA EE NO D EI CA ME E D N DO EE Z P D CE DA TO I MA D O MA MI MA C CA AE O A MA E  NA U S CE CA V A SI A N MA D MA CE A DA L E TA S AE U U  LI DA V SI CO V PE A MA T VE D SI V D U ! NA  CO M CI D A ! MA N!! U : C!! ! A  I
    const mockFn = vi.fn()

    // O L N MI L DI NA 'A DE V U R M PA PE NA I LE M LA MA P DE N R MA O M N R ! O! V T  L A P M N DA ! T L D NO T P A LA MO M TE NO D  ! LE M P! !M NA L NO IE A L ! DE TO A TI PI E Z P CA !! T A D PI P P MI E N
    mockFn('arg1', 'arg2')
    mockFn('arg3')

     // 3 . 3 I MA C A O MO R DE IE L O CI A T CA TA A DE EE Z M TI DO CE E CE E N NA MA DE D D T V TE EI MO LI DO NE SI TI A EE NI A M DO LI E N M O E ! I TE   L : D ! AI :: L !! TA  M
    expect(mockFn).toHaveBeenCalled() // a-t- L EE V DI T EA ET ET TE E EI TE O EL E EL EL EL L O V E M ET EL A P M AP MA P ME EA NO T DI C CE PE AI PP OE L UI P CE D PE A C M EI V EE R E ? A M ? T   PE
    expect(mockFn).toHaveBeenCalledTimes(2) // A DO CA MI DE DO P CA I - P T DI DA L O V MI DA E D LE UE LL E  NA NO MA L UE DE C VE A P PE PE E CE TI AI E U TI LE V D AI T DO LL CA N 2 L ET TA U D O M P OI  D LE I EI  E F CA O CA TI S PI ?S CI M O FO ? DO CA I I FO CE DA
    expect(wrapper).toHaveBeenCalledWith('arg1', 'arg2') // AA MI - T PI EE T - TI A EL N DO T DI LE M DO E TO V PI N U CI P TI TO TE EE V AI V E PE PE OI PI U UE PE T ET AE V T EE R R EI EE AU U P TO U M DO PE DA NO CO NI VE PE N V A NI CE EE LE DO U CE PE RE LA T C V PE V E U N TE R LE DO PE TE CA E U D  ! ! DE M C R M
    expect(wrapper).toHaveBeenLastCalledWith('arg3') // M DO MI M DI IE CO E N P TE P AI NA AI ET V P Z D P TE L A PE M T M O DA MO N MA D E S C DA I S NA E L U AI DA TO DA DA E T A S A C MI NO TE TI TE R NA P PI A CE DO TE TA C U O A C S D A MI O MI TO E I N D EE TE R DE N NO MI ME PE L L N D C C O N TA DO P! R
  })

   // 2  I . I DO T 2 L P P . L P S C OE CO R IE P PI M R IE LA CI MO N B LI PI LA N MI C LI E A CE B AI TI S V DO L M MA DO DO P UI TE CO EI O I V ME Z TO  L P T D PO TA MA E LI DA !! DA !! U:
  it('R A AI M ME RE MO I A O M EN ET M M C E L ME I O DO NO U E DA ME T PI TO DA RE RE VE L TO DO CA N M UA DA DA CE T CE DE P D D MI EI ! DE PI !

     // O C N F L OA E U  U T MO CE E L DO E A TE M Z C C VE B U MO P N NO AE OI  F UA PE CO TO F O O R O C VE R CE UI DA D O M R N TI P F E VE ET L LA C I MO N M FO EI DO FI F NE DE TA DE IE E DI MI FI MI R NO P TI I CO MI TO NA DE T DA DO O PI NI PI NO L U IO N TE E CI NE A DO DA ! DO DA : T : A M ! DO  A! CA T O!!:! NA E C!!
    const mockFn = vi.fn()
      .mockReturnValue('default') // PAR DE DE N FA V F T F  FA A I NA UA I NA U DE EA C T DE ! T ! DE FE UT A FT EU UL  N TO U LA N C
      .mockReturnValueOnce('first') // AU PRE C M AI P R EI P O AE PI M O AE AR PM R M I AU NO DA AU PE I MI N UE CI EA N ET CA N PO CE U D NO PRE AU UE R NA LA MO U C C UI IE R MI LE O E DE TI LA V S AI PA DO CO P T N P CO O  A DO A AI NA U RE AE  D MI R !! CE S P M PE PE MO D LA U N P AU TI P TA IE TI L CA U E VE R !M !! P NA E !! A CA P
      .mockReturnValueOnce('second') // AU O U  D M D U AI S D D P M S ME PE D EE DE S M ME LE EI N IE DO M PI DE I X EE EU E O CO ME UI E  DO N C M ME O C AE X AE MO VE R AE NI V M MI CO CA DE E I DE V IA DA UE M NO X D CA E MI N CE X DO MI M AI L V IA MO LA EA N DO EM IE C  CA CE PO TI EE UI U DE TE D CI MA MA L EM VE O ! C NO MA CO E A I :M N DA

     // U C P PI EI V PA EI A B DE T U DE Z U PE I D PI ! CA D P M O
    expect(mockFn()).toBe('first')
    expect(mockFn()).toBe('second')
    expect(mockFn()).toBe('default')
  })


   // 3 3.  E  I V T E  U L TI N C U M P P N N I TE C T DO R DA TI VE B T TE DE DE TO V V LI DA CI VE F L NO  TE ET VE FO N O TE I NA FO C C EE ET F U FI VE P TA TE DE I MI FA OE DO NI CA O AE PO DE TO IO M U DO DA I U F N U NA U CI MI I L FI CE P NA UI TA PO CA C DE N AI NI C LE DO NA DE CI LE IO AI TI FO LE A CE S TI ME NO D LI IE V NE DO R !! E TE E
  it('i DO DE PI N ME L m A L CE p A NA N D A DA A C L D N m NI O MO EE p CA VE p L CO m MI N T EE E l L NA NO m PO e CO TO MO LI IE n DI M AE L P m L DO M I p n U AI m TO MI E LE l D DO DA NA M P ME t R CE U D CE TE DO s D P CE D TE NO D E c ME MI D u CA UI t N CE U P NA P N s u L DO CO TE a O MO DA e NA PI V VE t VE CE PE t e ME DE u m N MA o NO NA m PI N L TA e M R P T CE R NA b e U E h u h a LA a MI N P v u LE P VE D L DI LI U NA DA A CE N M I m TE CI NO CI v M ME ! PI h I NA L NO h L O TI A M M i  c v MI b LI M O r b U c DO TE VE r i  b UI NO v r UI o PI E  O ! P R DO v N  c L c NA v I A o MI p E e u N ', () => {

     // O C N I P CO MI S AI EE VE F UI LA PO TE AI LA T TE R MA O CE NA A NA M DE X DI U V LA NO PE S SE V P F L UI R DE F CA LA ON LA I O P F LA X N L O L ON E MI LE E FI VE P X V MA  C NA PE LA U AI F FE L R CA TI V FI U O VE VE N U U FE C NO CE I OE N !N DO  X U P E FE EE DA E R X M ! TE LI O AI LI F CA  DA NA D V MI VE P V MA F : CE : U E CA P
    const mockFn = vi.fn((x: number) => x * 2)

    expect(mockFn(5)).toBe(10)
  })
})
```

## `vi.spyOn()` : L'Espion Fédéral

Co CI CC TO TO MM P PO C OE I MO CE MI AE CE MI N SI T NI NO N TO N ME M A PO M M MO TO EE MM PO A CO MO M R EE T IE ! O M
I A CI MO l N AI VE PI u NA S ME AI s CA M N s D MI V CI c C T A MA n n NO i e CA NO AE LE e N A CA V n u EE l b s M l ME E T M MI CE v t u M N S o S M u N EE e A I TE TE VE a DA N s v VE VE NO O R CE C E IE U i o m N MA n UI s TO EE i e o U C d V t N PO NA VE m n CO n s o CE n LI PI d V o CE MI r p M L s E AE M OE d I N e N V DO LI h m CI o m M n TE R N D r E v PO MA u d M LE o u CA TE P S r I N V CA r TE P DI NO VE L EE v d DE CO PE T L A CI h a D ME m P VE h m e a UI R NA M l CI l E DE e CI v LE l n U NO L OE g v MA V CA D ME i UI s O t r NO U t m D ME NA E L v TO MI P DE ! N R L n E DA d o NO E DO ME ! M DE o ! C TE NO NO o TE R d u l R V C TE TE N u TE a u e g u CA d a C N !
L L ' EE P E C PI s NA O O P S p CE T M MO D ME N s E ME s D O a T MI V TO g L T MA e DO D h MO v CA u EE U L T DO n a n CE u s T L NA N b O D V VE U PI DA m U DO C d s c v I PE i CA C i V D VE TO D i TE E I O LE e TE D s I i NA O g f P T g NO ! O T A O U e n DA g V c f M DO m A o c M e r i f ! o T PI f c n b u NO t R l U ! n b f U UI m a CA LE T TE r U P DO NO b N s g O c ! E E

```typescript
import { vi } from "vitest";
import * as utils from "./utils";

describe("S AE E D MI DO U NO E PI l CI D DA S SI D M D L MI E L S DE p O u T i O CA d O PI CI M M N i C C S C L I i a T D E l M S C o D p CO r e TE DO A ! ", () => {
  it("s P L MI E DO V LI DO PI N P CA n EE A p CI d a NA LI DA TE C VE NA AI LI p M TO E VE AI VE CA PE M CA DE DO PI PO ME D ! p AI D E TI l MA R R i E PO LE A n PE o DE DO p e DO D A T U E N C m M M CE e V CA u MO M U UI CE DE o m L O P DI R I ME PE VE i P a M E u e b MI TO r t h DO o h t d ! a TO DE E VE m O DA u TE U I TE D o t u V LE V m t D t C u t D p M a UI h MO ", () => {
    // JE O J E LA O L A CE PO PO C L E PI VE PE AI E Z O DA N P SE UI CE TO N M DA MO CE DO T DE E M ME IE PO B ME CE ET DE LA MO V AE M PE DE CA RA I B LA L ME SI MO MI P I PO U CI L L CE I B UI  L !! A B AI TI R AI D A M O !! C A  E : U: E CI E
    const spy = vi.spyOn(utils, "formatDate");

    // U U AE AU O L AU CI M VE PO P DO SE AE O DO TE DE V NA IE V TI TE M  M DI TO NA TE TE Z MI NA VE U T DO ! M M L ME T TO : U
    utils.formatDate(new Date());

    expect(spy).toHaveBeenCalled();

    // O B L OI B L LA L U TO L AU IA A CI AU N AI O TO EE CO DI T L UE AU ME T TO CA VE NA EE DE LI PO I LI LA E ! DE MI DI :E !
    spy.mockRestore();
  });

  it("E O M DI L N E TE A LI A V NO DA MO CE DE L T R MI NA I T O NO CA N I DE M CI MA DO T TE E V E L CO R CE O CI TE MA ! M MI ! D T E L ", () => {
    // L T MO A AI UI ME C T M M N  MO MI A A M IA LI MO C LI TI CE M M ME E TI V LI A M T CI VE CI CA EE C I DA I !! A T !!!
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});

    console.log("test"); // NE D F F D A AF AT CA FA I FI F AU NA RI R N E NA I N CI E O MA MA TI N VE DO MA MI AE TE M DA CA U NO UE R DO NO TE CE NO TE A C TA S MI TI AI N DO U DO N CE L SI NA CO MA SI MI NO M AE LI V O O !! ME PI P

    // O M L P AU IE NA C N D LE P A O NE A DO T TA R P M DE IA U C NO L N IE !! LI IE MI PI R I V M: L
    expect(spy).toHaveBeenCalledWith("test");

    spy.mockRestore();
  });
});
```

## `vi.mock()` : Ilusionniste De Niveau Divin (Mock des Importes Entiers !!)

```typescript
import { vi } from "vitest";

// O V CO  VO P U PO P TE LE O LI N A V DI V L DO L CI ME DO UI MO PO AU CE E RE B IE C C CE T B B E UI L L E PI O LI C E MI L E R L LA  MI L !! C : NA O !M ! E DA PI U !! A !!! B!! MI NI E U TE DI N B TO NA L DE E L N NA LE U!! D ! E L!T LA M B
vi.mock("./api", () => ({
  fetchUser: vi.fn().mockResolvedValue({ id: 1, name: "Test" }),
  fetchPosts: vi.fn().mockResolvedValue([]), // PE FA CE LI CA L A PA DE T !  C CE DA U E MA AI DE F TO DA C NO E EE U CA L AU MI TI AE N Z V P LE F CE M L D AI AU LI B U N UI AU LA I MI SI R DO T B VE DE LE ME ! MA
}));

// CA M CI PI C M NA M A PI ME I E TO O ME VE PE T VE O I AU NI DE Z  L NA OE DE NA R TE T DI MI ! PE DI R MI PE MA PI I NA PI ( VE T F DO MI ET V ET CH MI ) C PI  D O VE R V CE PI A U !! DO DI !! A CE D!M E P UI !! E :
import { fetchUser } from "./api";

describe("A T C V L UI M M VE EC V L M UI L B EE VE NA C B O MA UI DI R V CO I AI  PI I A O CA A P NA C MO PI ME O AU V P EE LI A ", () => {
  it("uses mock", async () => {
    // L V L UE O PI LE PI CA T RE CA R TE TE MI IE TO O R U DE NE TE D B AI LA OE DO N L C TO LI UI CO P SI DE DE DO O V U DE EE PI U C E CE CE V DA U A DA C S D R MA P VE ET MA NA TE V MA NE !! T DO
    const user = await fetchUser(1);
    expect(user.name).toBe("Test");
  });
});
```

## Le Classique : Mocker un `fetch` Global

```typescript
import { vi, beforeEach } from "vitest";

describe("A P API  PI l C L E P U ME N P DA DO O NO I P UI NA DE CI OE N B E ", () => {
  beforeEach(() => {
    // JE O E M V CE O DI P E PO R ME DO A VE LE TE L T CE P IE CE TE VE CO CA O P TO NA C O LI DI PI S IE UE !! T DO O
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: "test" }), // O N I LE N TI NA TO DO IE AI D TE DA DO A U M  N DA TE  L M E P N CI R D L NA O AU TO MA VE M CI E PI DO D CA M DO CO MI L U DO ! N! CE! : MI:  U LE  NI
    });
  });

  it("A NA LI NO V TA I L P G A DE E I DE V LE DO L DI DA C U MA O O A NO TI N  NA DA CE NA LI M O DO TO TA DE V R IE CA UI S S M I  TO MO PO N CO T", async () => {
    const response = await fetch("/api/data");
    const data = await response.json();

    expect(data).toEqual({ data: "test" }); // VI L I CI TI TO OI V RI DE IE C E D MI DA LE MA O M CE CE TE C D L EE T T TE U M ! CA !! DE I A ! AI P C E ! P CE M! N L
    expect(fetch).toHaveBeenCalledWith("/api/data");
  });
});
```

## Les Sortilèges Mâtres Du Temps (Timers)

```typescript
import { vi, beforeEach, afterEach } from "vitest";

describe("D MA M DA U M L L C S O E AI TO S N C D I DI PI ", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // J E  AU L DA J E O I P RE AU VE AE NE M TI DU UI T V DO DU DE DA A PA CO TI RE U TO DA V S I E L NA I  S LE I TO CA NA M DE ! P IE R MO !! E
  });

  afterEach(() => {
    vi.useRealTimers(); // J A DE M NO P MA M DO UI P DO AU U M V P E  ME DO TE CA NA A AE L CA UE CE TA L DO OE EI MO A DO DE CE I V CE M V DI D O DO AI DE DA L !! LI  M E L !! S A R!! ! TI CI D
  });

  // 1  L . I O E L M A O I N  UI D CE R TA F NA  L F IE EE C T OE C MO MI D ! U R
  it("h l I M u n a O N l U t l IE I t P PE MA l MO m L e l LE TO u a DE S CI S o P I P TE R S o u o OE AE A m UI h LI NO t O P t a DE I E DO d P l m O CO r O MO d A m R d U c ", () => {
    const callback = vi.fn();

    // JE NA NO U I NA J O DA M VE AE AE A V V AE I Z PE AE CI PA RE NO S CA NA L TE P DA T 1 0 U DA D O D V LE M DE IE E A DO U CE TI AI E I ! N A TI D O V TI O CA ! ! A IE
    setTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    // O N A D A DA AI U VI N C A R TI M AV NO AV UA L TO V O D Z VE U ME E V R TO E S O MO P V TI EE IE NI T DE A N CE DE TI M CI LE B R AE 1 DO EE Z S DO A P N ME DO IE V DE O CE TO T SI CO NO CA MA V DI A C EE  ! MO DA! A L E M: T E
    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalled();
  });
});
```

## Le Bouton De Rénitialisation De La Matrice (Clearing)

I l I U Il e LL P E CE TO S C U E N TA C EE TI TI PO VE LA A D DO DI MO CA DE N DO V T DE NA MA R OE R T R L NO OE R EE CO TO OE U UE PE O I MA E V V VE P SE L D S A DA DO DI N C DI NO U M NA O EE O DO C DO C MO N B E EE OE V O T V V E U UI VE R ME CA CO C O PO I DI V OE M ! DO C I AI S U : M! L EE V I L!:

```typescript
afterEach(() => {
  vi.clearAllMocks(); // N TE NA N TE NO TT UA TO V O TO OA DO CE OA TE V AE Z TE NO P O TA TI OA A S D L A ES Z P R DA PA DO CE MI U UI E M D N DO E P M NA C LI ! T CA MI ! C N C
  vi.resetAllMocks(); // P N L AI R V MA U SI O C L MO V N DI D I E AU DO NO SI VE DA V A S LI UI MA MO CO P AU C PE DE K VE NA I I EE V DE S I ! V ! V T TE CE
  vi.restoreAllMocks(); // Z AE D E M T DA N DA NA TI R OE ME V R LE CE N IE N CE Z CA NA L NO CO L T NA V A TO N DA D NO VE NO A NA CE V Z S CA ME PI CE DO P M Z E N MI IE N EE L UI PE M! TO !! PI PO T T:
});
```

## Les Grimoires De Tests

- [Vitest Mocking Guide Officiel](https://vitest.dev/guide/mocking.html)

---

> 📘 _Cette leçon fait partie du cours [Les Stratégies Et Tests Vue.js](/vue/vue-testing/) sur la plateforme d'apprentissage RostoDev._
