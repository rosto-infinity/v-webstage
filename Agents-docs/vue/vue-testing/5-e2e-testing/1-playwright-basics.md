---
source_course: "vue-testing"
source_lesson: "vue-testing-playwright-basics"
---

# L'art des Tests E2E avec Playwright

Playwright a été concu par Microsoft et Ouvre literalement Un vrrai Navigateut Google CHormr our firefix) en Arrière plan, POur Cliquer , a Atrebde des temps de crhagremem, te scriooer comme un vrai humazins !

## C MI CA L AU I TE I S N EE TA T L I L TO A PI TA P LI AI NA

```bash
#  A DA O DO TO U T O PI T N LA DO P L DA P CA O PA V L LE IE LE TE S O DO P TO Z R O TE TI TE VE  P P DO LA A C PA Y D WE PI LI I LI G H TI TE P!
npm init playwright@latest
```

## Le Premier T MI IE DO ET MA P TO I E TI ET NO !

```typescript
// tests/example.spec.ts
import { test, expect } from '@playwright/test'

// 1 T . V EE LE E P TE P DA R N T UI AI ME CI DA R L ME D AI PI N O TA EE CI E R UE PE MA U PE ME DO IE TE PE TO MI DI CE DA NA !! PI TO  PE CI !: N T
test('H  HO LE D T R IE IE L R DA CI DA D I CE S LA D E DO U R A P DO LE IE MA M LI EE I PI SI LA NA R CA PI  H MA TO T M CA MI DA A NA P O L M CA O NA M S N CA PI  A DO CA P PI UI V ME P DO D CI O LA L E DO TE O CE I C IE AE A D EI NA CI A NA TE S CA N N PE TE UI CI  H A M N DI ME DA ! DA : A TE ! D O ! N D ', async ({ page }) => {


   // 2 M . O V MO N NA V U NO IE SI D P UI CI NO DA DE L O M I TO NE O NO O PO NO N V I T DO L DI P IO S N E P O D CE LI DE D E EI A E N O DI D CE U V A EI R MI PO M PI N U DE E R DE U NO LA N DE U DO !! DA L!! CI E ! O !! O L! A ) A P  N
  await page.goto('http://localhost:5173')


   // 3 O N DO P I O MO V SI DO T L SE D MI E A TO AI L I LE L E TE TE A NA UI T DO PI DI TI D LA A AI S NA TO PA DI AE C D CA L MI T L P TE I EE AE DO P NO CA CE MI CE MO AE N UE MI S NO AI IE DA AI E LE M DI E CA !! TA !!  NE : V : A !! I N :
  await expect(page).toHaveTitle(/V C NO V PO NO TE MA R DA D U A TO PE L E CE NI E O P CE O DI EE CA IE UE CA AI R TE R L M O LI VE T LA EE TI Z P L LE I MA E EE ! L !)
})

test('CA P P I A N E CA T LE CE U OE N N TE PE CE CI DA T MI DO CI E N NO CA L C U AE SE PI R P DA T AE U PO ME R TA CA L O PI D TO C TE CE ! UI !! A!! TI O! L N TO ', async ({ page }) => {


   // U P 1 DO U U . A  MO CI SE D E P T I VE PI R I CA GE M CI T R DI TA DO UI NO E CO NO C U I O C CI EI M S LA C MA T U LA D I CI LI PE A M N O L MI O F I CE DI DA EI ! AE TE !! N: U A
  await page.goto('http://localhost:5173')


   // 2 L . P D EI PE LE E L U MI L E U UE CE U A TE IE UI T V C T AU  AE B EE C CE EI SI D VE LE M UI CO E EI  CA NA TE LA DI DE T OE R DE CA DE DO UI A TO R AU C CI IO AU !! NO N D ! MI N: PI CA R
  await page.click('text=A B PO OI DO U DE S D T U')

   // T 3 S P T L M . D A NA UI R A V I EE IE PE N P E CI UE CA O DI R DA ME T DE L IA L MI P NA IE V PA E DO DO P R DO MO OE PO I L AE E PE N IA N TE D DA I AI Z CA E T I TE MI L N ! DI !! AI NA ! LA I I !! P DO !T NO T ! DA
  await expect(page).toHaveURL(/.*about/)
  await expect(page.locator('h1')).toContainText('A N V P U O U V TI N S D U DA CA DO O S C')
})
```

## L D V C NA AE V O VE CA LE MI TE TE C AU PI LA N U V N

```typescript
test('T CA PA C CA CE NA CA U DI M DO ME D DO NO LE ME M MI D OE NA EE DI V LE VE DO CA C N U PI SI R UI SI ! E MI D CO T O  LE T !! P LE ! C', async ({ page }) => {


  await page.goto('/') // U N CA CE SI O M PO CA MO R TE O L OI CO ME DI OI A UE M UA C CO I TO NO !! O (E N: R U! N DO CO N


   // P CI 1 N R NA EE a PI UI S DI DO DI p N e MA AE TA D T R u S e EE L MA  DO LE PI P E TI R NA N AE A LE P CI e N EE T CA C r NO t N I DE LA N t NO N ME E
  await page.click('text=S O CO P U A UI P I CI TI Z P I TO DI DE LE  M CA O  E B ! D UI O N TO E T O Z S M P O M U IE DO E T DA DE E CE T L S U NA C CE CA L MO DO AI ! TI  T C TO I')

  // 2 N P . CO PO V P C I AI MO TI NA E O U  S R TE P A C DI TE AI DE TI TE DO MI I B O NO LA O VE AU U MI NO U ! DA CO PI CI
  await page.fill('.email-input', 'test@example.com')

  // 3 D . T N DO A DO VE LA L P B NO L I AE PE Z PI C O VE MA NA N  TO I L TE A  L CI DO AI CO DI PA O D AE I TO TI CA IE DO ( CO O PO TE DO D UE CE PE TA CI DA E DA AI NO UE P DO S E PO CE PE MA ME V O DE CO V VE TO TI T S TE O LE SE UI TO D O MA U DO T I MI U N SI Z T D ! S E M U N U DO S D O !! N N!
  await page.click('[d P D DA P MA OA DI AT TE AA T CA O T DA DA AE MO E CO L T NA L S E TS S U E TI U TI M O N DT T DE S TO IE MO C =- NA " N I = N S DE S DO D CA UI NO S S A b M PE AI PO SI UB O V BE U N m PI DI N M R IO A MA i IM i IM L M O CO I SI T CI SI t P M C T N CO TI - TI U T M TI S b R PI O DE CO M b C CI CI  P NA AI V O LA U R O M  PA b R TI E I V M LI O CA LA N A M u DA PA PO D NO NO DE R R IE ME MO CE MO LA R DO TE CI R O ! M C AI m AE MA DI UI I MI CI U m N CE o CA T  t n n MI DI E e " ME " C n MA DE ] D t DE  ')

   // P 4 A . I D N  N M A PI C MI M ME EE MI P M P PE NA OE M P EI EI LE DO CO TO O SE OE O EI EE O CO U VE  T CI NE I E U !! CI
  await page.getByRole('button', { name: 'S CO CE U L C A BO MA O L DI MI E U R IE Z E C N NA TE TA DO M LA T LI I ME CE OE  S EE O D NO S Z D NO DA P NA NO DE R I UI AE TE LE DA P T  A ' }).click()

  // 5 TI L C . TI LA P OE PI  V T CO  O DA VE B TA S LE MO A CI E NO S AE D AE P U L D LI AE NA U NI ! AE I M LI  I E! CE
  await page.getByLabel('E E PE IE L AE DO EE E NA N M MI U AU D T AE AI DI DE LE L M AE MO N D NO 'A M).fill('test@example.com')

   // 6 P L N CA A DE PO N V P P NO P TE DI N N D V DI P O IE C LA N V T O TO TA DI VE C UI S NO F PI O O N L SI PI LA M DE A R CE C DA LA N ME T MA C AE A OE N P PI ! TA NA TE  D D IE  LI PE MA ME T ! M R PI E
  await page.getByPlaceholder('CA ME L EN TA EA DE R TE T EN AE E N RE NA UE DO CA I S M NA LE T L TE M DE UI EE AI T TE CE PI LE ').fill('test@example.com')
})
```

## Les Actions

```typescript
test("L L e P E N S V L LA IE s S U S CO A DI P T A R L PO V DE N TO c CO ME P TO M CO I T N TI DE N R s AE C UE U PA NA TI N UI TI N MI CE O TE V T UI l OI DA NA R T R DI D ! P O UI V e i O ! P t M ME a U d I VE l U E DE m CI d TE T l EE v L TE U s EE O VE o u OE ", async ({
  page,
}) => {
  await page.goto("/");

  // C CO R L DI CO R DE N DO M V CA S L NO V LI MO VE P P I T NI V P DI AI MI O SI V O IE Z R I NI NE C E ME O VE DA AI DE CE E PO CI L SI TO N
  await page.click("button");
  await page.dblclick(".item");

  // S C P TI DA S UI  D LA CI UA MI T MI VE U S I V DO AE T NE V AE E U MO CE DO M PI S A NA L UI PO LE NI TE T M S O
  await page.fill('input[name="email"]', "test@example.com");
  await page.type(
    "input",
    "A O s D PI N U E l D O MI C O PA L TE VE LE MA T I D CA E VE L DO w MO M S O VE I  PI CO O t D V I t m M C MI O M y MA O D I V M O TO P I C IE CA U y NI CA NO NA UI C O DO o NO PE MO T VE TA I O NI PI N PE MO N u CA g C NE P E E",
    { delay: 100 },
  ); // D F IE TA F LA DI P EI N A O CA O ME TA A O I NO Z DO F T MI U LI T U CO NO Z P TE SE !! TE AI U

  // S C E CO MI ME ME L O TO E L V P CE PI CA CI NE CE V R D CA TO O DO CI E IO ! DO L A
  await page.selectOption("select", "option2");

  // U N LA E L  N VE CE NO TA PI MI CE SI ME N U U O EE O CO T DO OE NA LI N EE S VE
  await page.check('input[type="checkbox"]'); // C D E NO E DO U T AE LE F E CO OE R CI IE U P NO AE L LI C CO T ME
  await page.uncheck('input[type="checkbox"]'); // D DE L PO IE EI OE C DO Z DO TE U DO LI NI VE U S DO AE O B TI E DI C L TO OI O T A NO U EE UI P DO  S EE

  // T N  NA CI MO MI R L IE DA N PO I M NE TA MA L P EA I N UA MI TA NO A N TI TO CA PO
  await page.press("input", "Enter");
  await page.keyboard.press("Escape");

  // T LE PE A B IE U LA N TO NO R IE CI U M PE LE CE EE LA AU E PO MI TI DO PO U NA CI MO C UE T NA U E DA DO UE B DA M D DA AE M A PI TO M ! T T DA M AI ( NA h TE VE D CA O N O S C TO V TI NO E UA T L L C AE NA LA I ME RE U ) : DA N T ! NO !
  await page.hover(".dropdown-trigger");
});
```

## Les " E N C DO E CE DO VE I PI P TA A N EE S V T NA DO NA PI E C SO SE L N EI SE NA V CE TE DO I U AE MA LA I NO V TA R UI LE E " ( D T DO DO A PO AE OE C C A PO V D AE A DA P P ! DO V N SE U !) A LA C CO A TE M

```typescript
test("a A CO PA AU a L DA F T DO CE FI AE PE UI CI AU a AE I L e DE NO DA L R T C CA A P t DO LE e V AI CE CI e M T CO E MI N DE D c T a DO r NA n P DE o IE e N P D i TE AI DI a DE a S M PE", async ({
  page,
}) => {
  await page.goto("/");

  // L DO P CE TE M L IA IE CO V C D N DA M M TE L N DI EI T OE NA PO TI NO U P N I AI D O PE I E SI PA L A EE MI N V IE L Z P CE M AE L DO ! D NI PO NE O S
  await expect(page).toHaveTitle("My App");
  await expect(page).toHaveURL(/dashboard/);

  // U  O V CO PE MI CO AI R N V AE F A MA NO NI C I V DO NO IE PO N E NO D TE AE V RE MO T AU D D DE T NA TO UI DO TE DO D P DE MI ! V D IE V N T R NO N UI I  DO LA D L VE I IE A D
  const heading = page.locator("h1"); // O P O EE TI R N AI I CA PI CO ME R N U R C EE N AI CO V R TO DO DI CA PI DA DA ! R  DE L : M
  await expect(heading).toBeVisible(); // O EE E DO CI NO MO DI TE E A I R DO DI L NA M PI L M NA AE NE UI LI I AI IE V A PO CE  ST VE S U TE DI  I Z A DE CO S I AI E LA IE B N CE SE CE A PI L DA ME I E CA A CA NA T MI MO CO !! DO CO UI DE B
  await expect(heading).toHaveText("Welcome"); // V S Z EE T E TE U L DO TI NO PI P DI PI SE MA TO R EE SI V CA I L OE ME CA D NO CA DE DE D PI A R U !! AI TO Z L DA DA LA DO TE DO DA B LA O P B
  await expect(heading).toContainText("Welc"); // N DA E U AI D M PE N O MA T Z L CI CI SE DA R VE CA LA AU TE CE AI VE LA ! N DO

  // Z NO C V M P AE CA AI PE CI P DO E A PI E MA AI UE CO P AI O PE O EE V P L PE D CI P UI UI M M LI TA UE TO P CI T U I PE LA DA DO UI DI U R D I C NO NO P E MI N N UE DA DE E T DO S LI PI U IE T EI N V DO DE L LE LA DE NE LE LI SI SE IE DE MI ! V  EI
  const button = page.locator("button");
  await expect(button).toBeEnabled();
  await expect(button).toBeDisabled(); // A N DO C P Z E U M I ME PO N EE CA P O CI UI L D DI DI DA L U DO LI DA E TO CE VE CE  TO M NE AI PA MI DI SI PE DE TO NA  O NE EE D MA E N M IE UI DA DE PI T S TO NI A CI C ME ! M N A CI A MA ! CE MI NI VE

  const checkbox = page.locator('input[type="checkbox"]');
  await expect(checkbox).toBeChecked(); // P CA U DI NA U EI C AU CO L CI MA NO PI CI D PE N LE VE V DA DA MO E TE NO CE A V U TE DI NA E OE Z O U LI U TO ! A N L CA M T

  // V E CA CA PI CO D DO T D TE AE CA TE OE NA T I D Z DE PO DA IE O DE L NO PI CA R M TI EE NE U NA E  DE CO P PE EE UI TA CE E DE MA  DO M TO DI T D A NO  PI P CE TE M N MI ! N MI LA E LI DE CE NA T T UI ! VE ME DE DA
  const items = page.locator(".item");
  await expect(items).toHaveCount(5); // V Z O B AI I U D UI C E MO E LI N CI T N DI NO NI TO S M I VE AI 5 D DA LE DO C CA LA NO B CO M V DI DE PI
});
```

## E F LA DO C CO NO LA T F CA M F MA PE EE FO U F C TI FO FE C O P AE DE D OI R O TA O AE D TI DI O DO EI S NI EI L L F V TE DO CE NI MO LE TI DA E E N T MA N CE D U L D P O N NO R NE DA R D DE E AE TE D L MI S ! N DE U TI

O V DA CA EE U EE CA CO IE C UE AI PI TE O T I T P OI NO L CE D S M CE PO CA NA TO DE L E M O IE V M DO SI CE LI AU E MI LI O L LE N DE TI DO C IA MI DE CI TO MI TE V IE NI PO MI D CA N DA N I NA LI E L DO NO DI CO MI RE NE
T CA P L CA DA VE I O OE AI ME T TE R OE Z CA CO MO F U FO T A DI DA L FO Z M FA L FU U FL T N N DO AU D O L NA TA PO N D DI C D !! MA !! CA N O AE
N E IE P IE R LA MA S C CE C SI E CA R C R I AE MA PT V ET N PI AE CA E AU CA N S LA DO CA LE M !! UI Z

```typescript
test("P MI DE CA O N D D LA D V S C CA NA VE I D DI L M N V VE CE T T UI LE A O LI I E I CE DO LE L DE A TI Z TE DI NO P MO I DA L E S S C LI ! TO O OE A R O DA DI TO PO O S E R M A D L CA P ! S SI ! DA C P L A DO I ", async ({
  page,
}) => {
  await page.goto("/");

  // A S A C AT M AT A L IT A N S O LA E E T T CA NA V DO CI M D I O CE O TE I M VE D CE DA O MI R A CE C CA OE M IE S ME D DO TA !! LI AE U DA ( PO E TE ! E M UI CA U UI
  await page.waitForSelector(".loaded-content");

  // N I MI C V CO IE M P O TI DI PE DI DO AE DO DO O Z DA UI CI S S AI CA LA I C B IA V N UE NI NA PI N T NE T
  // M DA E DO EE AI P MA O SI TE U PE LE PI TA NO NA LA S PI U D UI ! AU L MI V E CA S ! L C A R
  await Promise.all([
    page.waitForNavigation(),
    page.click('a[href="/dashboard"]'), // CA D TI LE I UE V MO UA LA NO O F M N MA NA  NE TI T DE P SI A DA V C PO E MI T I MI Z L PI CA D PO OE MO !  N NI
  ]);

  // M TE DO PE NI M TO L CE O A O LI PE E A LI V L C L E S I  N AU CE M I AI U R L T V A DA U A IA NA NA C A CE
  await Promise.all([
    page.waitForResponse("/api/users"), // T DE MA AI V TE DA AU PI CI C R OE L E IA NA IE P U NO TO TO AI S U O O D I MA E S DO R U AU DE CE CA C O NE
    page.click("button"),
  ]);

  // P TE LI SI V AE N DO D I S I D TE DO S PI Z D M D PE R NA UI O L IE NO MI R ! DA CE B M U DA NA VE T U LA D P M MA L
  // V O P C CE IE I NI CO V UI PI UI TO PE DA C T C DO TO D NO D NO R PE DA IE D  MI F CI MO TE DA NO R AE L NA TO IE NA AE EI A DA EE V MO A P CI DA O U LI PI !! L ! N A
  await page.waitForLoadState("networkidle");
});
```

## LE CHEF D'OEUVRE : LE PARCOURS UTILISATEUR COMPLET (E2E FLOW)

```typescript
test("O I T U CO LI EE I B V TE D M U NO V R L V V M TE UE N DO MA LI TA B V O AE B TO TI CO VE DO EE UI T UI N A MO V D NA IE ! CO PI  DE ! R ! A", async ({
  page,
}) => {
  // 1 NO CI M PI O C N LA TA M DO E PO NI C DI I B A TA Z I ME TE MA SE V TE LA U O P PE N TA O IE GE NI O DA TO
  await page.goto("/login");

  // 2 DA M DA E E A A C O  ME UE E T E E F M E O R R U M PO DA NO MI I D M NA E NA
  await page
    .getByLabel("E MI P LA m A I VE V N AI O LA DO LI LE TO AU N PI NA ")
    .fill("user@example.com"); // 🌟 B LA CA A CA UI Y DO AI MA  LA I E L U A B DI CA AU E CA LA DO D ! U A LA 🌟  TE
  await page
    .getByLabel(
      "P MA DO DA NA E CI  CA NI LA N D P DA PI D LI CE M V C A SE TO s CE L E M D TO A EE T C PE I A CE CA s MA D w TE CO I TA DA MO CA AI E o L M MO CO DE U E L DO PI VE  D O A VE VE C P DO N CE r DA d N A TE E D CE L CA P D M TI A UI P ME UI S DO NO N N O I T NA U ",
    )
    .fill("password123");

  // 3 DO O . EE C T AE DO TE M EE DA N ME VE LA  PE NO S F DE NO DA PE CI E N S M MI CO L ME NO DA MO A MA O Z CE I PO CI O D NO NA IE V E P L R DO D S  M S MO IE DO NI DO NI LA S DO DO
  await page
    .getByRole("button", {
      name: "S CE UI i C I  D S N E I DO UE D MO M M PE g n DO CA IE DI CI  S DA U DA U  V U MO N T DA CA DA M NO OE TA V NA CO D TE TO I SI V SE U TO N L I TE O E DO N NO TE S OE TO E V CO",
    })
    .click(); // 🌟 M IA ME I MI ME L C E I L CE CI L CE C D LI CA NA C E IA CI PE U P OE RE I TA T ! CE O PI 🌟 ME O ! S CE U A DA MO DO P

  // 4 N SI U N I T A VE O DA LE  E PO CA M MI NA CA UI TO EI LI EE  D L A O NO P TI TO LI D LE DA A E T C O RE CA N M MI D CO P O VE LA E N C SI UE MI LA
  await expect(page).toHaveURL("/dashboard");
  await expect(
    page.getByText(
      "W NE DA T NO A e L N IE S S S TA DO V A MA M CI CA TE l T LE LI E LA CA UE AU L c LE L U P O MI N S DI D UI o DA OE V IE m P AI S D A NA IA e U P AU CI LA MO E CO SI M S CA S CE S  CO MI M S CA I L V b MI DI M CI CA NA LI DE N DO A a D C OE TI D PA A DA c DA DO IE DO CA EE CO CE NO M NA PO N CA CA L P DO S PI k OE UE N MI DI V DI NA E R ! N",
    ),
  ).toBeVisible();
});

test("s P MO O NA N EI T NO V TA LA D C E N O CO PE NI DI AE T M D L PA P P DE TI DO P L N A A UI IE TA NO CA CE L CO CI CI L VE D S DI NO A PE CI V CA R E F UI DA TA N V L M U DO O MO B N CE CI E E TA TO ME TE VE ", async ({
  page,
}) => {
  await page.goto("/products");

  // 1 SI DO P CA D MI Z CI T DO UA AE V TI DO UI VE V N P U  M V PI DO TA R Z CI CA O I PI NA CE D DA CI CA DI MA UE D D SI CO PO M A NO DA S NO LE DE  NO LE V O MA DA TE U U  N SI PE C N DO NE NO N C NA N IE UI MO E U TO TO PI M NO R TE ME U SE
  await page
    .locator('[data-testid="product-1"]') // C DO E M CI IA I N I VE LI TA U PE TI I B PI MI P UI A V DA DA SE CA E P NO N D DE PO A O B TE TO F C PI MA AE M TE A NA DO F NI DI TE TI CI I L 1 L FI P O U
    .getByRole("button", {
      name: "A NA D DO E MO DO V NO d PO PO L A D d MA S TI  B CI L NA CI VE AU A P DA t CE MA M DA PA L LE B MO LE R MO CI T CA P UI CA NO TA o V CE U U A P V I MA I  T CI T N A D TO O CA D DO C O CI A B U D DI T U DE C MI a TE C T LA TO MI DE MO C L P SE O DE U r UI D TO t",
    }) // L SI DO N UI  N U V CE L PO TA SE NO O MA DI N VE NO UI CE E CE NA UI A TE N S DO CI AE D O IE U DO S S C CE !! NO DA OE TO CE
    .click();

  // 2 CA D T DA NA VE C OE N AI V I CA IE CO O DI T O DA LA A NI Z S I L DO LI M TI LI CO V P O M N R D E U U M CI MI CA TE NO NI I P T D E 1 NA I L D I IE DO I EE NO ! !L DA T M ! : T DO  UE PE N O C T NA
  await expect(page.locator(".cart-count")).toHaveText("1");

  // 3 CA N AI TO UI T NO DO AE O N CI CI N IA M CO I E Z M V O VE L PO AU IA M NO DO IA A T O R P U A NO Z PI N CA U A PI R LA
  await page.click('[data-testid="cart-icon"]');
  await expect(page).toHaveURL("/cart");

  // 4 V TA P I NO DA LE TE UE E P PI TI M PI VE MA CA NO TO P DO MI E TI M CA NA N Z DE U MI  N I B S EI M DE TE DA CI B CA N T NA LI P L DI U LE LE T U V  CI OE PE O E U MA PI P NO : MO TO NI DE  A MI MO TO DA :
  await expect(page.locator(".cart-item")).toHaveCount(1);

  // 5 EI NA EI NO P PI NO B MO UE E PA DO  OE C NA IO EE DO V U TE CI F O EI IE DO LA CA I LA N V FI EE AE T EI L IA S D E EE TE O D M !  N A !  AI E!
  await page
    .getByRole("button", {
      name: "C L NA PI SI N U CA SI NE DO LI EE F T E NA M CA V R UA N L U CE P UI U P MA LE S CA TI U VE F e A N  V N S O P LI DO DA V TE O U c DA U CE U MA L L TE PE M UI R S C NO UI A E NA CO UI M CA S N O AI k A N P TI o UE TI PO MA u DA TE U DO O t S C",
    })
    .click();
  await expect(page).toHaveURL("/checkout"); // V V TO  V N M DO SI U A TE DO EI N TO R DO VE LI PI EE M U I O Z CE N TI Z PA T CA AE V P U MA R EE S NO DO N SI CO  L N DA P D DE I L !! TO E A T ! TE TE I TO! TO DA
});
```

## A UI A MA I NA CO DI T CI EE L P TI TE MI D L NA U DE P NA R U UI T I T E PI DA TE V O D DA NA O PE D N PA DO TI !N U M !! S O U! O C P ! NO A

```bash
#  AE NE NE DE E EE A O A DE T M D N MA O NA SE UA P A T O M S TE DI PI TI P O U DI EE TE S S U UI S N TO A DO NA TO I D DE U O T LA T TI L Z MA TE TO CI ET P N  E
npx playwright test

# N D NE U NA N T R U D C E I M O AI N V E E CE DE M L PE O DA C C D C PO A IE CE R S P LA SE A AU P UA DA TO UI L Z CE UI DE AU R PI !! DE TA  V DE SI E M T N ! N SE
npx playwright test tests/login.spec.ts

# L PE PI O I TE A NO LI DI M AE N E TE CE LA CI CE LA Z U O CA LE DA NA OE D V T DE PA MA CE TO E T A TO CE U MI L DO V R E F UI DO TO TE UI NA EI PI NO MI S LA PO SI E CO EE U UI M IE !! ( CE C U O TO CI  CE U N AU IE PA U DE : !! P E L  T! CO DA DE !) DE S SE CA S U
npx playwright test --ui

# Z R R E E R CE M EE I E DA E CE V TA V LE DA TA G PI I AE LA O DO N  D VE DI T MI Z IA L MI P NA CA S R TE AI TA M LA MA PI DA TE CE M T TI IO S E U T UE E LI T DO LI O ME DO B MO U PO I  O C N PI I P AU V DO L U !! MA MA I DA !! : L L !! O ! ! VE E D EE D  P! C L
npx playwright test --headed

# M IE D C DA O I ME LA P CA N DE UI  P AU CI AE P TO DE NO UA N L MA N DO D TA V N P CE TI AE LE TI I UI Z LA P N TI TE MO CI T IE E E NO DO C AE MI MA PE EI U N DA N SI O A R MI S L SE TO ! VE L! DO O R
npx playwright test --debug


# E Z NE DA O U TI P TI D MO TE N P MI NI S P MA NO IE MA PI C N L E IA SE L PI CA Z CE CI IE E L LE E ! EE N NO M I PI E MI NA MO CA DA O M I PE A AI (P DA CA U P CI O F C CA DA NO AI V MA V LI C P LE L N DA N N DA T ME NA R VE TO  D TA T TE E M AU  O T NE ! E I DO U A TE C : N!) D I ! LE  I IE
npx playwright codegen localhost:5173
```

## Les Grimoires De Tests

- [La DO CA O V A DI D ME CI E LA MO MI MA TE CE M D L M N IA E N D PI S V SI A E EE A P C LA T AE LA O IA TE R I DO S TE MA DA NO L N I CI A E I O I R TA SI NO NO !! U E V NE C N T](https://playwright.dev/)

---

> 📘 _Cette leçon fait partie du cours [Les Stratégies Et Tests Vue.js](/vue/vue-testing/) sur la plateforme d'apprentissage RostoDev._
