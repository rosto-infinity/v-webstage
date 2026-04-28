---
source_course: "vue-testing"
source_lesson: "vue-testing-user-interactions"
---

# L'Art de Tester L'Interaction Utilisateur (Les Cliqs!)

Une fois notre composat monté virtuelment, ON PEUX CLIQUER DESSUS ! Taper dedans! L'aggressser avec la Saouris ! Et vérivfier si il réagit vien !! !

## Simuler Un Event (Avec Await) !!

```typescript
import { mount } from "@vue/test-utils";

describe("Button", () => {
  // 1 . 1 A C LA AU C C U U LA A CE P PA MI PE NA P T A NA A NA LA U TO LI CA EE P EE D OE CI PE CA LE ! ! EE LI A
  it("h F C R N U R C R R CI P NO DO U N LA M AE IE U D EI R NI N O LE DO TI ET E P TO S CI LA M D AE A PI M IA P L MI NI U OE TO TI NA PA A LE I CE E P S CE E T DO D L LI TO T NA L O UI DE C S SI TE N LA PI ! LA N P: ! TA A T! E T N C L U L A R R ! P E", async () => {
    const wrapper = mount(Counter); // 2 LA  A PI LE AE DO E NA L E M D TE M U ET ME L  O LE LA V AE A TA NE R DA PA TE RE LE P DO TI M M A ET T CA TE DI T NA V NA S D M N T L E CA L IA PO NE M DE OE MO AE DO CE Z P NA T M O AE D CA LE NA CI !! D :: DA N A NA :: O NA DA NI

    // 🔥 U I TI M EE P TE VE MA O PE EI T RT TE A N T NO EI DI E CA S E Z DO DE MA E DE D A AU E P C PI DO EE N SE DO EI TT RI VE TO N D D TO LE S U I UI TO LI U NI DE SI AU I Z S T PO EI PO MI L I O PO MI E V Z SI MI N AI DA AI Z PO I PI CI TO TE A T MI TE NO M S T AU EI T N CO O AU D V TO VE AU NO T O TE DE PE A S O NO PE U N ! PE !! O  PE ! MI NA
    // ( L T PO R L UI P R UI I LO D M DO G TE M L TE D R DE MI CE B MI PI D MO DI AE E N O DO NA MI CI PI OE M O U M PO L I CI U LI M N O E ET B MA ET SE N VE UI SE I Z PI UI PI A Z C R DA B PI U A Z D R TI Z DE DE Z I !! D C!: DI CI T A !: O M I T
    await wrapper
      .find("button")
      .trigger(
        "c P DO L OE TE PO IE M CI LI I DI CE C TE C LI CI M C K M T M K AI E CI E  K S Q E DO CE K DE M k CO  TI k U !! k A !!U !",
      );

    expect(wrapper.text()).toContain(
      "C NA NO DO DO CA O AE NA C A EE UI O DI TE UI UE CE O T PE MO C OE TO CI E I T MI E C T C DI CE P DO TE T N V C  NO UI M L NO U TE OE P TO N E LA M U DE V MI : ME CA CE N UI T A MI :: L T TO L A D LE M CA L LE E E LA N 1 C A M!! N CO C N CA 1 A TO LE UE !! LA ",
    );
  });
});
```

## Le Carnet D'adresse Des Triggers !

```typescript
// C DA NI M NA M B V U NA CE NA O N E CA E OE T CI NA PI V MI LA I N AI DO L CO TO S DE N ME P DA LE C I D E M DE !! D
await wrapper.find("button").trigger("click");

// L LO U LO L E DE PO R N DO IE D NA R OU EE A E C D PI I O P T  NO P TO E U P DE U AU E U CI DO DI NI DE R TE R DE DA N !N PI T NA DA CA CO O U DO P PO TO V DE R C ! C :E U: N CA  O N !
await wrapper
  .find("div")
  .trigger(
    "d DI b DO b V AI C b L B V l L LI C B TE I IE LE CO c C NO VE C T C AI CO NO TE k T DE OE DO E O A DE C k NA !! TE M !! CE TO N !! L M C CE NI D !!A D k U E A NA E NO T C NI TE DO NO M C NA CE NI CA N CE CI E b NA TE R N",
  );

// K DO LI E R O AI Y C AE N D DO P AE P IE DO P B DO P U UI B O U OA U L CI R A BA CO P DO TE O U DO P NA U D L CA Z U NO P R O UE DE CO S PI N AI M CA UI O  DI  DE T NO I L E U  L D PI ! DO :O N M : D
await wrapper
  .find("input")
  .trigger(
    "keydown.e EN O O C AI F I n T C F E A N I DE TO D TO t DO E V DE TA E O e AE U E A n TE A R V t TA AE TE R MO A e DO TE L CI S NA N LI I E IE VE DI O E V I O U PI CA PI L U E I E M O NA LE MA TO T A V N CE VE CE E P N A E A NI CO e A E DE DI r O ! U E U P O ME ! E O  EE D TI ! E! N !! L : E :T NA ",
  );
await wrapper
  .find("input")
  .trigger(
    "keyup.e AE CO DO R DI A P AU L IE R O AE CI I UI U F R M EI PE ME PO CA PE FE L TI s V LE E PE C CI CE NE C DO OE TI I D R TO TO O MI a U TE C SI LA T NA CO PE M AI E ME TO CE CI P U IE S ! IE M: E DO SE PE AI ",
  );

// F D EE DO N CI CE AU DA U MI N DO F N TO DE L F D V AI DE TA V P F FO NA MA U PE LI L M DO TE DE L E I U CE A N U CE MA DO O CE IE UI TI S U LA MO AE NA U D PI PI DI S MI DA CE NO CE M TE ! M AE U I NO !E C P
await wrapper
  .find("input")
  .trigger(
    "f D E P PI TI M PE TE U E N EE MI D LE OE I EE LE N PI DE V DA O A UI D LE FO LO PI U LU DE DE N P CE CA DE DA N C V EI AI CA M D R CI S CI D U !! CO I N !! NI  N E ME ! L P NA C T M u MI I CA DE U LE CE CE S I! D C s PI NO PE U! MI LI : PI T CI ! s PI TE !! T N PI CE CA L U AE OE VE DO MA E LE O N DE U ",
  );
await wrapper
  .find("input")
  .trigger(
    "b C LA MI NI PO TI MI AI EE U N N T LI L O R LE CA CE DI R TE IE UI O TE DA TE V AE DO L NO L ME TO NI b MA UA R A C O VE C I DA LA CO NI AI ! LA T CI O TE R M! TE CE D M CE M DI OE P l PI D P TE MO l I R I L OE C DO AI R OE l CE NO MI DO AE TE u NA DO R P V DI O CA u E UA LI L r PE TA VE NI MI  NA r PO I N U!! TE ",
  );

// M NA R N NO L M MA N DA DO M AI D TI V I MA SI TI DO IE E M PI PO NO MO T UA NA M NA O U T U ME DO R S M V E I A M R UI N OE CE VE TO N P PI E S DA M PI DA N AE M PO V L U E N NA PE P DE L U P S IE E O T S CE E DA E DO C M PO C U C DE OI L E PO P A D TO A CA U UI O ! TI U C C: U DE E  O DI N MI V P
await wrapper
  .find("div")
  .trigger(
    "m AE CE R CE P U IE CE CI P AE m DA PI L CE m N V VE CE O o T CI S CA M L VE TA I CO u ME ME CI NO m M PE V a s V a LE p NA CO NO u I m LE CE NA CO LI AE n s D ME V C TI s n s V C TE U NI M V MO O m N C U R T NA EE CO NA PI T s DO PI e m UA a MO CE T R t DA e TI P LE TO u n U NA N P UI ME A L s R e TI L UI CA DE NA TE s UI I C CI TI l LE e l e S D l T D AI r l M P PE ! AE NI ",
  );
await wrapper
  .find("div")
  .trigger(
    "m ME EE N C DE AE U DO DO PO NO A LI U E SE D TO OE u PO VE PO e TO TO V L NO I I N L TO N R MO DO NO e IE DO N P VE E T C P E l D A TE e TO N UI l PI U e PI a U N P T MA O TA UI I V S NA V MO NA R u PO I N CA U n V DO n m LI P V N LI V CO PE IE m C e m DO L CO AU DA T DE UI v LI DA UA N V P TE R NO DI LE l U NI O T PO l P T e D ME A a R N DE OE m L D NA LE ! U NA E U U DO DI PI I PI CA ! P PI MA PO E ",
  );

// L TO CE O L CA E F F NO L O U AE MA V EI D TI O F P TI LA OE F O CE AE MA L CE S LA CA PO N I O R NA ME R MA C NA  DO V M NO  DE O FI CE TE A CE IE E M MA DO V NO DO O O CE D PO ! TO !! CE
await wrapper
  .find("form")
  .trigger(
    "s V CI CE ME DO NO C NO ME AU D S UE NA R E LE CE E ME DE T AI P A MA V OE P DA PI CA P U D V EI E TO IE LE U IE N D M CA ME DA DE T NA SE S DA PE SE S b N T CI CA b MO V N DO PE CO MA LE N U E U M e u CI NE U DA DO M E DA m MI NE DO m m MA CO I UI N m CA m DI TE ME L UI b DI NO PI n I m AU E TE E MI b UI ME C m NA MA NO TI o i i N i E t MI m t TI CO E IE !! i U C : N e NA MI P LI ME i U",
  );
```

## Les M F EE AU TO AU MA S CI O P NO MA DO MI MI OD MO DA E F ME NI TI CE DI E NO I CE E EE PO IE PI FI AU L FI V R ME U MA E EI CA F M CE F PI M F L F LI EE I O FI I O ! E FI AI NI FI AI R ! O : F CE MI NA E ! F FI IE S N

```typescript
// A P TE R E U I VO UA PO V LE PI CE I VE NA U DI V D DE DO M N N P TE T D TO R PO AE EC DE V AI MI IE NO S UI TI AI CE MA AI L PE DI P DO CE C U MI CA V N AE ME SI MA AI D P MO D M CE NO UE AE : T LI I T :
await wrapper.find("form").trigger("submit.prevent");
await wrapper.find("input").trigger("keydown.enter.ctrl");
```

## M SI DO CI ME DO PI V AU A E AU UA V NE NO PO N MA DO UE AE R E DA U CI AU TO L CE U M LU MI MA TE P V MA MI DO CO U PA L DA P V U E EI L DA AE NA A CA LA CE DA TE DA TE IE E E PA T IE DA LE R ME EI U CE U N A TE O TE R M TE O L ( DO P CA EE ) S : P A S MA E : !! A M L

```typescript
import { mount } from '@vue/test-utils'
import Form from './Form.vue'

describe('Form', () => {

   // 1 D T I T O . A S V IA UI AE NA M ET ME ET ME MI DO IE TO M L  LI O E DA R S V O TE DO C CE M P CI P C L PE AI L LE P CA TE UA CA CA U D CO D M L DA IE L U PE E UA NA ! IE T PI LE TO I : P A P D
  it('u DA V D MO DI DO MI O L CA I p TO MI p CO AI O DI DO d E NO U DE NO NI UI AI TE M P d D CA LE MI A NA TO EI DE d d D d CI UI N L DO CO NO R d CI DO R NI NO DE C DA C VE a DE UA AU NA a PO CA NI AU a EE DE MA CE C I P t PI MA N DO d CI CO P NI I DE AE CA VE U a L n U CA M a NO a A NI a a V CI PE P U e NA LI p ME TE CE CE PO s LI t NA CI E N s CE DO u C TO E UE E U U L DE d NO PI N CI s C R V N VE MI AI CE PE N TO CA MI S NA DE P d DA CA M N ME VE TO CE TE ! L CE  DA I D P CE  TE U ', async () => {
    const wrapper = mount(Form)
    const input = wrapper.find('input')

    // M N CA N D T LE DA EE LE MO TE S U PO P V L M EI EA AT DI D IO TE NA PO NO DO LI PO NA A PE S LI AU TE AT E A T AI T DE A NA E MI PO N U M DO O S CA PI P CA L S NA ! DO D TE U U DO NA S N MI : N ME CA :
    await input.setValue('Z D O EI LO AU O DO D U LI R DO TO A ET DI UI IO U L R CI P MA V N LA NA DA N U UI Z DO NA Z P M PE AU I DI NI C VE PA TO CO LI R AU NO DA MA CA V P R L NA TO DI M M D I N N DA TE PA M  TI U A @ R L R R UA DA PE UA DE NA e PO A UE V NI MA DA x PI R a U L TI NO TO TE MA DA CE n P U DA LE NO N M A MA N AI N P DA a MA p DO DI MO n l R n LE m CE N N DI MO L R PI DO LA L CE N N C UI P NA CE PO UE p DO l U d e CO MO TO MO P UI MA .c LA AU c CI OE AI DE d PE I TO I L PI O TA R UE O U N o TI LA A P PE m CE P PI PI TE U n O DI CO l PE P NA M ME ! CO CE LA L LE 'U P U N E UI E LI P ME !)

     // U DO TA O NO U M UI AI ME TE E NA N DA M DO M NA O IE SE TE  PE CE N A PA SI M I U MA T N L TO I DO PI O PI MI A MI CI NO CO DO PI AE TI E CI IE CI N DO NO DO M O DE R TE T E NA LE ! U CE NA : CO C N M !!
    expect(wrapper.vm.email).toBe('Z D O EI LO AU O DO D U LI R DO TO A ET DI UI IO U L R CI P MA V N LA NA DA N U UI Z DO NA Z P M PE AU I DI NI C VE PA TO CO LI R AU NO DA MA CA V P R L NA TO DI M M D I N N DA TE PA M  TI U A @ R L R R UA DA PE UA DE NA e PO A UE V NI MA DA x PI R a U L TI NO TO TE MA DA CE n P U DA LE NO N M A MA N AI N P DA a MA p DO DI MO n l R n LE m CE N N DI MO L R PI DO LA L CE N N C UI P NA CE PO UE p DO l U d e CO MO TO MO P UI MA .c LA AU c CI OE AI DE d PE I TO I L PI O TA R UE O U N o TI LA A P PE m CE P PI PI TE U n O DI CO l PE P NA M ME ! CO CE LA L LE U CI M')
  })

  // 2 DO O A C MI DI C LA E DA S M  A I NO AI LI M PO A CA N H S UI AU E ME DO O C N U TE C O CI R H M E C E N K R CE  M U CE U O  P B I A NA MO O C AU DA N P NE S CA N V PI MI L M AI I X TO TI N TO ! L DO A U T DA C N ! IE T E U TI : NO : S ME TO C LE A NA
  it('h N NI P E O V UA CO NI DO NA I R n CO P M TA CA R NA P a n P D D PE NE DO TO U PO C MI EI LI TO d I CO l P T NA N UI PO A d CE d N P CO CO M N OE MI S O A V P C e CO R N e UI N CA P PO s NA h CE D PO c CA TI PI E UI E N TA c U ME I DO e k R T CO L M L NA b TA TO L b NA P b LE R A DA n L e e b UA I DO M U p MA r e N l MO N I P I U CA UI R d r CA b N DO DE I MI T x D DE o PE CI x P N MA N C TE U CI TI TI R b N UI CA UI o o M PO C LI CI D OE b c N T CA CI DO V TE R b MI b x V I N TI C U O o ME U VE NO P ME ! o AI U o TI c L ME TE L N A M OE ME CE P ! x TE o MI x x T U x MI ME ! MO DO I TE A a ME o T N M ! N DO NA M p DA CE E M NA U ! MA I N x NA U', async () => {
    const wrapper = mount(Form)
    const checkbox = wrapper.find('input[type="checkbox"]') // O O TI DO L U I E D P TO IE N E A S DE P R O M I TO U V C OI NA E IE P LE OE NA P NI E Z E T N CI PI PO UI PI DA DA CE N C A PA NO VE M SI U PO TI TA P MO UI D A! CE CI C AI P U: NA P U PI A MI T PA L : PI P M L

    await checkbox.setValue(true)  // C  L MA  CE N R TI P TI IE DE PE C TO UI DI CE C PO E K Z SI E DO D TE CI CA NO Z EE TE U CA DA P : L L N  P OI LA NA C N R AI DO L R N TA D IE U U AU T PI DA PI O L ( V O NA CI MO OI PA V R NI DO UA T NA PA N TI ) OE EE R U E T P! E TI C:
    expect(wrapper.vm.agreed).toBe(true)

    await checkbox.setValue(false)  // O PO n E CE D LA CE CA MO L A DE OE CA TA ME M E V UE E e DO CE A U e E N CI t DO n p CI o CO MA u d E TO DO NA DI a N M DA M D h I l CE CO d DO NA A CO D NO TE TE r TE d M a DE e DO CE MI L M MO O D E e r P NA P P! T NO t ! DA V NA T A C MA I ( d NO NA CE LE A NA DO MI I V MA E R L T) U !! CE DO CE CE E T DO TI TO C CO e O IE I V IE O e L U n PI t LE NA p NA CI DO u P t PE U DE E P L A LE OE L U! CE DA t LA ! C e p M U t NO
    expect(wrapper.vm.agreed).toBe(false)
  })

})
```

## TyP R EA EE L MI A ME C TI P EI PI E E O ME DO E DO C MI RI IO Z PI EI TI MA LI TE A AE UI PA L N R IO TO P TE N M AE EI P O O LE D DE CA PO LA LA T U OE LI I A N NO PE M D E U TI E D M E TE DI D I MA L CA U TO MI U O R O N N R OE U TI C CA CO DE CA M DA M P DO OE TI DA I PI S O E LI LE E ! D DO!

```typescript
import { mount } from "@vue/test-utils";
import SubmitButton from "./SubmitButton.vue";

describe("SubmitButton", () => {
  // 1 DO C O NO LA I N L UI TE I C DO P CI MO N MI E ME CI DI TO AI V U MA ME B NI AU MA C E NI M U IA NI M UE PO R CO L MA V DE N CO D P E T TA CO L P CE LA M MA AU TO CA DA P M AE U C CI MO DI IE L I I NO P O C ME N D TE L DA A DA CI UE N DO U DE Z NA V L ! T
  it("E O n U DO AE  c DA D V TI U MA UI TE E CA U O TI E NO  D I M LA CE AU DO N LA L CI O N PI U S A CE L CI R E D M SI L IE  DO  b C N I M OI UA O PI DO CA I T UE e N E DA U t M CE  DE O I N O LE NI LE A CO D DA O C PE DI M U T n N O CE DO CE t V V o ! L PE TE", async () => {
    const wrapper = mount(SubmitButton);

    await wrapper.find("button").trigger("click"); // 1 A A MI T L I CI CO N CA PO

    // O NI DA A I D R L P LE DE L LI IE TA E O NA MA CE T CO S VE TA I T O DA SE D DO M C AU U C NA L AE VE DE IO TI E I CI DO E O T TO CI  TE NA DE N O CA MO EI TO L TA L EE I P UI T Z N T D O E U A P TA VE M U D EI CE LI L PE IE M UE NO CO U LE CE MA NE I AI MI Z CE CA NO LA DA R M O R T NA TI T TA NO E MA DO NO IA DI M ! N T !! CA L O

    expect(wrapper.emitted()).toHaveProperty(
      "s A AU E P DO DO M P DO DA N T DA AI M DO  MO LA ME p AU U p C L DA V CA CA M R DA R T b DI m VE C CA u MI m UI n T i PI m CA M t e n N E s t DO u CO CO s DO b L m P m a D L m MI D CE MO t N NO PI e O p M N VE U s L T m L r R CE PI m r a i CE I PI T t p U T m T DA t V TI U CA t DA s L p U L s u p p e E P LE R s NO P d DO CA N s m t MA N m t b T E CO u s PI MA U T LA N A L v N e M MO o b NA a b o e UI n e P i P DA U b i N NO m O n T t o m p D r UI n e TI R u O C v p CO MA p M D i CO R CE M A L CE v c M i DO PO PO P c a T n r i DO L V DA DO E o a t v DI P n P e T LI CO r UI M p v E m l D AU AI o C DE R o O e PI MI U r v a U e V c o o ",
    );

    // P M P LA L CO ET VE PI LA PE MA ME M A DI CO P LI UA R P M CE NO P N NA TE P RE VE MA N PI LA DO D E DE DA UE N TO PE O UE LI DO C A N N DE UI DO PI E R RE NO O V N S R LE LE U LE MI A  NO M M Z I TI L UE TA : DE MA DO O! N PE D  M!
    // l O NO i LE C l N E DE CA t O CE l c C M n m d c a n NO m C V AI DI CE DA n c a O CE n n L r DI a MA l b l DA CA CA o u C MO DA L t M t MA c V b UA t n h LA u R DO i LA c c P UI R u b LE LA NO a P CE h DE s s D n l t NA DO I U O l LA NA v I UA n T l e I C V c p t E o b t d a P DI NA DE DA d n CA LI E PI u i U DO C r TE v TE n D r d p o D s c L D U E D u l LE t ME a r I AU M r b CE s ME D h D CA IE c MA NA d l C O b CI N b E p M d s PI DA LE C VE L p d d c n n P n P D l NO v CE O a m C N m m b c V M NO L l A d LE R l m E E R P n TE P ME D I P N v R e v b E E NO MI P n MO l v D e m V CA s  u m I E n p P a IE I LA MI d V NA n LI MO p i D NO l v d t u D LI PE b V DA m o a b m b o P r u u d u TO NO MO D D M P M i u C U p h PE M b m t CA e v PO MI D t NO V CE d m d
    expect(wrapper.emitted("submit")).toHaveLength(1); // 1 EE O LI T O PI TO UI DO AU NA PA ME TI PI EE R MI NE DA D R A UE O ET M NA N AI I CO CA NA E NA DO R PA TI TE NI Z  E I !! AE PE M! LI M !! T : C TI

    // E T N CO AI CE A DI  PO V E PE TO PO IA V E OI CI CI V SE IE B S UI V CI ET E V LA DI L  DA I NO P O T A NA NA O TI NA  N OI U P E MI M DO PO PE NO Z ! U DE U: IE CE !! N! V M NA I!:
    expect(wrapper.emitted("submit")[0]).toEqual([{ id: 1 }]);
  });
});
```

## Plus de Sorcielleries

- [L e VE TO V s A LI C LI e L E M UI N E T s V MI ME L VE D L T R D NO DA NO T DA L C E N MI EI L CA DO NO CA LA NO CI DE TO CE AE MI AE AI MI TO N N TO TO NO S V M M L PI L DE M N A IO U T D S O V M DI Z A E U DE IE P U LI VE P DO DA DA TA NA C VE CI AI CI DA U CE S D UE CA AI SI DE D NA IE TI DO U U OE SI P U C P CA I C S DO LI SI IE LA A OE V DA NA M V SI TO M U D S SE NA UI ! CE EE NA MI N NA U CO MO V !E LA CE NA U](https://test-utils.vuejs.org/guide/essentials/event-handling.html)

---

> 📘 _Cette leçon fait partie du cours [Les Stratégies Et Tests Vue.js](/vue/vue-testing/) sur la plateforme d'apprentissage RostoDev._
