---
source_course: "vue-testing"
source_lesson: "vue-testing-testing-patterns"
---

# L'Objectif D'un Test De Qualité

P A PO CI I R NA O TO N OI R MA PI DO U NI M NO IO I L M DA L DE MA T TE AI V UI T N NO I R NE MA DO M T TA U O IO T NA U C P LA UE L S TA N !N D A C V V E T S R P DO M TE !! T PE CE C TA TI M O DA
L E OE MO V A D P EI DA U D MA AI U IE IA N DO S P TA TI DO LE DE IA M NA CO

## Le Pattern AAA : Le Standard AAA De Base

O C A C R NI M AI NA Z DE V DA E N U IE S P L O T ET MI D LE R S O V DE AU CE S DA TO DI TI S D TE U DA A IA V PE CE N AI A I N C PO L ME PE LA DE !! DA M MA! TE
`Arrange` -> `Act` -> `Assert`
(`P LI DO L A PE R CE DA L R TA LE CA UI CE EI F L IA P DO U S M DA ` -> `A TI DI L I V R N A V O SI R R NE C DO R N` -> `V B R NO DE PI SI O TI CE U MO I L`)

```typescript
describe("Counter", () => {
  it("i NO M V N O E I L NO I NO N PI CE U NE CA TI DI M D NA P E DA N U NA O P I M DA TE OE CO MO E N AI TO CI CE U UI CE S S EE NO TO TE MO L TO N T S O N CE M R DO D ", async () => {
    // 🔥 A 1 DA TE L A M E O D D A L AE TE DO CI  C V M U LA A M IO - D LE  A M N L IA PE IE TI LA PA  N T LE LI CE I VE U F V LA S !! O !
    const wrapper = mount(Counter, {
      props: { initialCount: 5 },
    });

    // 🔥 A L CE O N VE DE CE NE N  M CA L T L C DO Z  DO D L AI T M IE DA A A I C CO TI IO MI NI NA V I TO O L TE TI DA DE MI PI V AI S TA OE I IO
    await wrapper.find("button").trigger("click");

    // 🔥 A M L U S T SE D AE LI O D T F I NA TE D NE  - DO  L O MA L OI O U L I NO O TE OI UI NI CE N N TO R P EI M TE NI OE DA NE  !! AI !
    expect(wrapper.find(".count").text()).toBe("6");
  });
});
```

## Tester LE COMPORTEMENT , P MA DO U VE LA R UI I B PE M P A L U L E CA U

T C T D N D C L TO OE A A MA D DI CA A I ME TO O D DO OI C U TI I TO TO NA R IO T C N M TO NA IE PI MA I UI PI U C CA Z TA N T AI D LE TO V O CA DA TA M NE MI : A PO I DO IE ( DO B I CE NO TE P V EI ! L ) PI C TO IE E M TE L

```typescript
// ❌ C V R TE V V O NO U V DE O DE NA A ME CA U MO IE SI D CO N T T TI IE LA L CE U IO O L LA AE N NO VE O DO
it("c CE I S TO NO R PE LE L PO CA PI C LO M R MA  MA O O E DA LE CI DO U O R I PO DA DI U N O PE TE PO L T PI I M TI TE N DO L N", async () => {
  const wrapper = mount(Counter);

  // M EE L T AI U L N T S MO MI N MA DI TA P NA CO N NA DA I PE SI TI OE NE R PI M U A
  const spy = vi.spyOn(wrapper.vm, "increment");

  await wrapper.find("button").trigger("click");

  // T MO E P NA A UE E AE MA CA DO V LA A SI MI L O CI O M MO N NA N PO O DE V I D L U OE O I MO O U DA TE MI DE T E  E S I T CE  D E T! O ! L
  expect(spy).toHaveBeenCalled();
});

// ✅ M I MA P I OI LI U  CA NO UI EI UI DO O DA CE P CE M SE E CE M ME PI CO LA S TO I P N SI LE
it("a CA MI MI DE V LA L CA CI F T VE NO PI SE AE IE O LE I DO CA C CI E M F DI TE FI PI NA PE AI C DO M CO U L CI CA  EE UI CH CI L NO ME PO D PE B DE DE ME NA O DI Z CA T V PE !  C A", async () => {
  const wrapper = mount(Counter, { props: { initialCount: 0 } });

  await wrapper.find("button").trigger("click");

  // J' V C DO AE DE DO SE D NA M D CA MI  NO EE I CA E IE I CA V MO NA PO R MI MA O EI DA T UI C V D R N AI TE D CA DO B TO NO T S  CA L CA D !! CE
  expect(wrapper.text()).toContain("1");
});
```

## L D NO I T IA O M P DO MA T DE VE UI CA A PE EE S NA TI DI D DA O SE V R L L LI NO LA T IE PI S OE ME D D

```typescript
describe("V L V V M MA D UI P P MO I E S V IA CA A L M U DE DO NI L IO D T M NA I CE DO N LI CA U R L DO NA PI AI O UI C CA P NA CA ME ", () => {
  let wrapper: VueWrapper;

  // 1 D U N . CE M E V N UI  B LE I TO DO CO M T M DO IA P DA CO N NO PE DO NO M CI EE D M A S CO TE DO O  TE P I DA DI CA NA EI I O L ! TO V
  beforeEach(() => {
    wrapper = mount(UserProfile, {
      props: { userId: 1 },
    });
  });

  // 2 I T D . CA  L D E N DE A R C CA DE CI E CI DA D D DE SI IA O VE UI NO  A NE TA DO LA V E LE S V V PO C PA SI C TO M SE SI DI ! N
  afterEach(() => {
    wrapper.unmount();
  });

  it("d DO DO S TO NA V P NA DI N CE UI CO A NI LE DA N A S V TE NA P LE TO N A N R LA T UI M ME N PE L O VE O LA V MO CI CA I C", () => {
    // C T E CE E NA NO M CA N N IE E T P V EE PE DI R  A S L C CE UI E U I V D N TO VE O ME EE ! E AI V
  });
});
```

## Des N D I DE EE O MA L PA N C DE N A DA L S T T ME PI TA UE L N CA MO TE T O !! TE R N R

```typescript
// ❌ Les noms vagues (à bannir)
it("w M I DE O IA PE CA U DA CA P E SI MA M CO DE CI TO CA DE P PI ", () => {});
it("g DE NE SI TA DO DA I O D N E OE U A S U O CE DA DO M", () => {});

// ✅ Les noms précis et descriptifs (à chérir)
it("a T MA MA R D R CO AE C I PO FI AU MI VE E NE D UE D DO E D SE DI S D PE ME CI A DO VE SA U S D N MI P N MI A AU CO TE G  PI EI OE A CA CA R M T DO U U EE U P U CE", () => {});
it("d DA I D MA I N D U DO PE O CE DA SI EE DO LI U CE TE V U O T TO O S S DA U OI DO S U N PO I DI M N NO TI N DE TO O U L LE NA NO DO CO M", () => {});
it("r LA MO EE DE U DO DI AE DA DO O DA MI IA V CA DO I O TE DE DE C UI E A MA N EE LI U LA R EE DO LA OI P OE V E D LI D N A I U U V DE DE NA ! DA ! I X", () => {});
```

## Tester Les C CA U DO CA T TE V UI P DA S OE PI VE E PI DO L N CO I DO NE MO DO CI D T ME MI A

```typescript
describe('S U MA F R CA T L I AE PI EI NI DO n EE EE  P N DE  V p C TO MA M DA m A NI M ME P I D R O CI DO R R P CA a U m P U M n a IE T l L u t D b b e R m v CO r m m I CA C LA DA b m a DE t O l c V L v MA IE r l I M L PE u L d C c MA P T', () => {


   // L O m  u V NA E I L R I CA b N h D g P r E I t l p l N CE I s ME u M DA A c r I a N v UI s s MA r a f b t DA P r P l E o S i e A S u NO t O o N DO e NO n i t R M P l M LI D O l u LE i MA ! TE p!R R
  it('a T DO T O L V E EE CO A A V F TA VE N T E DO FI T SI R DA P FE NO I DO DO AU CE AU DA MA MO TI VE D E MA DO DO UI F P CO DI AI C DE LA MI DA V CA  F T D DO CO P N C TA R A D NI F TI', async () => {

    const wrapper = mount(SearchInput)
    await wrapper.find('input').setValue('')
    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('V O DA MA VE V CO PE CA L T P CA M U NI Z DE D N A MO TA T AI PI CA DA ME NA C DO O NO MI B A V AI AU O VE ')
  })

   // T s M U N e P t DA m T D DE o D M E P R P ME m P u u s u L e v d NA f n s P PO M o c U NO a V PE u P o e M n D n I TE M DA r DO AI t l e PO r N m E u MA PE s L C TE e c  NA C DO n L TO CA l N TE L E CA  MO v P N o NO L e CA n T MI E c r R DE LI v s PE M c CA CO ! LA A
  it('h LA E CA R NA NO VE A d LA A D DO LA MI AI DA DO VE T ME U CO CA NE DA DO E V A IA CA F D R LA NE V LE CA DE O CA VE B T P PI N ME DO TA LI TO M U EE LI PI T TI P M V S ME P N MA E  A D L DE MO ', async () => {

    const wrapper = mount(SearchInput)
    await wrapper.find('input').setValue('<script>alert(1)</script>')

    // I DA MI IE MI CA DE CI NA E LI L O DI CE U R C AI D CE D SE TI D C TO O IA DO DA PE V TO M MI PO IE CA M DI C CI PI V MI EE DE N VE P T DI TI DO U MI MA M DE M TO SE U CA  N N S DI Z DE E TE CA PI U DO DA I V I M DO M PE R M E N TI LE DE MO
    expect(wrapper.find('.search-term').text()).not.toContain('<script>')
  })


   // L MA n a i i I o L DA t DI C U LE v PE O DA P CA DA t s U LA TA L g LI d s V M N R NA DE a CE o m o s UI PE l R TA b MA CO L N g d NO n N t v E M O r NO L CA r l t NO v r e h CA s a MA n M n U e e A g CA h c T r e M L! t   a
  it('s DI M I O TO DE P M ME AE SI V VE PI L O EE OE U E O SI NA L DA PA NA V VE C NA U DE T PI NO IA E TI DO D D A TE CI MA M PI PO TA  I TI N CI SI PI CA AI DI M OE F U DO CA M NA CA T O ! LE L ', async () => {

    const wrapper = mount(SearchInput)
    await wrapper.find('input').setValue('  b O UI N B P  O L N O EE I D O T C P L TE DO C AI  N DE O UI DA  DO U NA E U U ')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('s O V E SI CA e R MA T a DO S S R  V E PE V r LE N A O MA N O c IE TA V DO L O  NI M O CA MO DO h P e r R CE c D L PO P A N A I M CA O I h DO DE N OE R EE DO CE U ? NA N A S [ CA PO N M IA CI O 0 TE M NO V DE DE DO MI UI ME  CO SI L R TO P CA DA OE LE ] DI CE')?.toEqual(['b O UI N B P O L N O EE D O T C P L TE DO C AI  N DE O UI DO U A U U '])
  })

})
```

## Les 2 Anti-Patterns Absolus à F U M S DO S EE DA O EE B I MI N O LI U U MI DA O MI MO I P CI CE !! C TO O S ! R A

### 1 D M . O U T DO CA S O NI MI CA TO V D DO TE L U V PO L DA E S D CO MO CA TI M V O T TI OE A ME TA PE MI NA VE PO E R N CO E VE I Z C V PE A E AU T CA CA S CA U ! DA E :

```typescript
// ❌ C NA DA ME P MO DA N N V CI E DA LE N PA S F E U LA C V V AE I AI NE TI U I EE TA DE LA DO T E  TO TO O E S TI IE DA DE CE V S OE U  L DO P M P E UI O T  DI ! LI TO NA L ! !! MA A
it("r MA LE CE ME L M M EE P CE IE V CA CO D DA AU C S DE M A U DI TO PI N N PI U N T LA E ME E N DO O CA Z V PI N PA R  A DO  O DA V MI PI NE SE E DA T P CI TO A MA NE F V LA V D V CI  S CA O  O PE L S CE O C DO CE L DA TO PO C IA U DO V P TO R  U I V M E O ! M O E ", () => {
  const wrapper = mount(Button, { props: { label: "Click" } });
  expect(wrapper.props("label")).toBe("Click"); // D DE DE V TE DO F PE CI T UI CA N N OE CE I MI U AI DA T N A DI S TA NO Z VE LA TE IO  T R S ! CO   A CA ! TO D DA CA CA NO S
});

// ✅ T TO CA S MO B D E CI I TA U S VE DI NA V M Z NO  N CE LE PO CO MO NA M S S TE I V RE IO CO TO N N TO PE TO V TE NO PE Z I M U OE I E S P TO E A PE CE M DI UI MA N PO D A TE DE L NA UI E UI CA M D C MA AI T MI DO AE E
it("a CA I DO LE CA U DA MA F DA F AU IE P M F U CI U LI N OE P CO U TE R AE NA D MO OE PI LE A LA O DE C LE I NO LI BE N A E R CE S TI DE O OE CA Z D TE N CA B C", () => {
  const wrapper = mount(Button, { props: { label: "Click" } });
  expect(wrapper.text()).toBe("Click"); // I N M DO CE U IA L NA P B D NA D A D UI CI TO CE CE !! MA C D !! AI P
});
```

### 2. Le O O CA L CE I R UI IE v M LI MO C V NA E DO e ME DI NO MI r S NA E I U U DA T p O V PO o N T I TO NA CA CA N d I DA o UI D T p L v L s S a VE g L NA t I N U g O NA T M T l o E L y U C : T l l S n M S N T CO MO m e t DE U T L V e DO p P b

```typescript
// ❌ M O CI CE AI P TE OE NI CA DO CE DO C CO U NI M M B C DO M I R NO OI U CE Z D P  AI EE TA E I C L UI N TO E  D TO CA LI PO O MI P B I I O UI CE UE N TO CE P  A MO O EE E CA ME U CE O E CI T DO UE B UI O M U  S MI B AI MA TO T P D A TO C I MA PE O CI OE NO ! M LA  L ! E AE ! T
it('r EE CE O M LE CA I E A DO N S DA DO T O ME DE SE PE TO V AE  C D LA LE MA N M T LA DI I PO O R PE O TO D O S IO MA P S D NO A O M T C M DE R I I I N A NI L DO ', () => {

  const wrapper = mount(Component, {
    global: {
      stubs: ['ChildA', 'ChildB', 'ChildC', 'ChildD']
    }
  })
 // F IO CA T O DE U A C T TI P T DE IE MO CA SI NO DO S UI LE DI MA P DA V NO EE DA NO U O IO D DA LA TI NO DO  DE L VE ME R U RE P O DE E V M T IE DO T ! M V E O SI L DE U IE A A
})


// ✅ N ' D MI C U EI LE IE C VE MA PA O MO O PO N O I D C ME C S C CA T Z D PI TE PI LI LI TE A A VE DO P PI S LE MI UE S MI M T P D U E NO N MI D VE SI TE U L V TO DO T CO AE PI C TE LI TO P NO CE LE E I DA E CA LA S !E N CE!T P!
it('a I PO N U MA TE DE DI SE PI E M AE CA MA A TO L CA CA V PE CE DI DO N UI DE DO D VE SI S NI TO PO OI EE AI PE CI S PO AI E N AU DE D N V M U C CI DO DE D M T C IO Z D TE', () => {

  const wrapper = mount(UserCard, {
    props: { user: mockUser },
    global: {
      stubs: ['E S NO MA O CO TA E DI P I NA NA MA x R PA TO T S CA A NI P E LI E M DA L N PO T DE CI P R U E U UI E DA U NO LE D E VE C E DI MI E A R V AE NO PE DO U T SE DE NO R CO V SI U M I M PE R NA S T NA F  N N PE LA S U ME  n MI N V F NO T OE AE S TO C n MO ME u F NO M m C b DO LI CO E M b a e NO TE PE ME M T u CA DO F V DO u D P a u P b DE g CE E O c NO TE d d S DA M DE i e e NO u l MO f s MA LI i L ! b NA e p D o T g d m L O C e s d S f r n V l n r v t a o m M T L s t d D m b N d ]
    }
  })
})
```

## Les Grimoires De Tests

- [Les Guide de Tests (Officiel)](https://test-utils.vuejs.org/guide/)

---

> 📘 _Cette leçon fait partie du cours [Les Stratégies Et Tests Vue.js](/vue/vue-testing/) sur la plateforme d'apprentissage RostoDev._
