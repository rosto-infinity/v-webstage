---
source_course: "vue-testing"
source_lesson: "vue-testing-testing-overview"
---

# L'Overview Globale Du Testeur

Les tests sont la SEULE ET UNIQUE garantie en Entreprise qu'une modification minime d'un stagiaire dans un fichier à l'autre bout de l'application, ne déclenchera pas l'apocaypse sur le module de paiement de vos clients. C'est l'Assurance Vie du Projet.

## Les 4 Niveaux De L'Industrie

| Type                  | Objectif Isolée                                    | Vitesse                | Confiance de Non-Régression |
| --------------------- | -------------------------------------------------- | ---------------------- | --------------------------- |
| **Unit**aire (TDD)    | 1 Seul Fichier TS ou Composables                   | Extra Rapide           | Basse                       |
| **Component** (Isolé) | 1 Seul Composant `.vue` (Ses Boutons, Son V-model) | Moyenne                | Moyenne                     |
| **Integration** (API) | Plusieurs Composant ou Demande API Réduite         | Moyenne                | Moyenne-Haute               |
| **E2E** (Playwright)  | L'Appicallion Lancée Entière !! (CLim en main)     | Lente Mais Essentielle | **Totale et Absolue**       |

## La Pyramide Des Tests ("Cost-Ratio")

```
        /\           E2E (Seulement le TOP 5 des Process de l'Appui)
       /  \          - Parcours Client , Paiement, Inscriptions...
      /----\
     / Intg \        Integration API MYSQL (Moyen)
    /--------\       - Les Câblage de gros Composants
   /  Comp   \       Component (Gros Composant Métier)
  /------------\     - Listes, Formurialres, Selecteurs !
 /    Unit      \    Unit (Partou PArturourt PPATPOUURRT!!)
/________________\   - Les Maths, les Filitres, La Logique Pure !
```

## L'Armement du Vue Développeur

### Pur Unitaires (TDD) Et Composants

- **Vitest**: L'Arme Absolue de Vue. Extrêmement rapide, pensé pour le serveur ViteJs. L'Écriture de code est pareille que `Jest` (Standard de l'industrie) mais en BEAUCOUP plus rapide !
- **Vue Test Utils (VTU)**: La Librairie qui permets à ViTest de "COMPRENDRE" un fiucehier `.vue` sans avoir de navigateur chrome d'oouvert !
- **@testing-library/vue**: Le Concurent de VTU plus pnesé "Accessibilité".

### Les Tests E2E (End-To-End : Robitisé par Chrome)

- **Playwright**: La Nouvelle Mervelle (Conçur apre microsoft), surpasse Totalament Cyperess.
- **Cypress**: Le Standarz Industireille depuis 2019.. MSai veellisnant...

## Le BOOT Vitesr Dans UI Projet VUE

```bash
#  ON N INS T  TA A TT AL LL AA T AL LE LL LE V E C I TE IT T ES I S ST T !!
npm install -D vitest @vue/test-utils happy-dom
```

```typescript
// vitest.config.ts  <-- C CO OM M MM MM O E E L LE L E F F OI C I FI CC IH HI CE  I V E II TT TE TE S CC CO ON NF F! I ! :G! !!
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "h ha a hp pp p py y- d- -do od m mo om m", // O OB B LB BI IG G OI AG G AT T A II OI T OR I O E I R!  R! EE V I V II T IT TE I T ES E S S ET  S NT NE  C CT E ON N O CN N NI A IA A AT EI N T AT P PT P PA A S  LA LA 'L LE E H LE HT HT HM TT LM L 'A !! II L L IU I L F   IL F AI AL UL LI I F LI UA O U A FA UL U T U N N " V N M NA NO MO V MO MI G N O AT G O T TE A I E U U R U UE R V NA CI O C CO R O TO IT TO  " P " !!! "! P !
    globals: true, // ET A VI O EV V  V TI I TI TO T TT IE RE RE D R ' 'I  'D M 'I 'I I MP M MP MO MO MM OR P R OO R OE TE ER TE DE T T IE O EE X DE ES DE U PP C PE CE CO CU TO C CC N CC U T S N T DI T IT A ON EI NO NS N  NN NS P  PS S N TO S TT O UT O U SU TT L L LU EL L AS U E S F ES F E FI  ES IC EI IC C I C IH C I  I S E !IE ::  IE R !! EI !!
    include: ["**/*.{test,spec}.{js,ts}"],
    coverage: {
      provider: "v8", // C L CC E AA P LE LO LO LL L PO R OO RO P PO U DO D DU I IE EE T P DE TT DE O AU AU TI T L I U N U O NA N O AU L AI MA AI N U AT L EI E P E PE RE Z PO C UR ER U DE CE Z E RE  L DO TT E S TO N DA U B DA AI AI DE NN A DI EA M AE IA D !! :N M! CA DE IA
      reporter: ["text", "html"],
    },
  },
});
```

### Le Fichier Central De Pré-Configuration `setup.ts`

PO OP uR U R p e pa p R as p A s R e ae r E v V R as as c V Z ch co O he R Te e R d R ua e A ns c l d EE l S es E e F 4 F IC C I D O OI C MO U FI PI MO C OM ET O AT C M AT PI TI E M OT CI E M C TO NO DE IE I I E D O C DE DO CE MI CI S CI E U A C C : A ! C:A AC !

```typescript
// tests/setup.ts
import { config } from "@vue/test-utils";

// G GL LO OL OB A OB BA AL A LL PP  P LL LU U UP G LU U IN I GN N C IS S S! IO (! ( PP OO M PU O P M U U UI R  TR I RU TT V TE DO I EE IO A T PI DD DO EI DD Z  D D DU DU N O Z R N T P N R O PO R OU R O TO ET EA TO EU T UA Z R RE EE   D ! A O D ! !V ! A): N T: AT VT V C H V CH VA CV VA A A CH HQ Q AU Q C AU U EE C AU T E EE TA  ES CE TE T T E !! T : C T:! ( A
config.global.plugins = [];

// G L G G LO L OA B L OB B A AL LA LL A S S S TS ST T ST TU TU U UB BU B LS S BS !S SE  ST
config.global.stubs = {
  // BO OO OO OO Y L OM M M L ME UE M SE Z E BO B U L B LO L I CI L G CI Q OU OI EA IO NN EE D T MO D EE U MN LE I M EN M O CE TO I ON O MO TO  A U U V NA NU E L AE C LE ET ET DO TO DI OU TI OI V TO EO LE VE LO LI VE D LE I VE EN EI N CI ET T ET DA NE I S N DE T SN D OS SN US TE OO UU IT O U OT ES TO E LE SE T S E ST TE DE ST !! T ET T C !!  CE T : !C ! ) !! T !! C :
  "router-link": true,
};
```

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.ts"], // I NO NO I NO V J NI V EC OV OE EC L L O E TO TO O TO ON LI ON TO TT DI U TO TU O  TO TI DO D TO  FO AI DI T CO CO M CC HC MO A UI U I L IE R EE ET I O EI TE L !! LI U!! L : TI E !!T T
  },
});
```

## Le Premier Tdd : "describe()" et "it()" !

```typescript
// maFunotiondEeMathAMoi.ts
export function M M  MA MM AA AM A A F O FO A FF ON FF NO OC ON CO NC N CO C N N TT N I II IO OO MO EI DE O IN MI OE D O MI TI E PI DM ME DM  D C CE O CC DE CC OE A OM MP M OM CO MO L MI EL PO ME A P  C CI MA CO R CI E PI LE EI LE AE X DE AE I ME ME DE (a: number, b: number): number {
  return a + b
}


// M  M M M MO  MM MA O AA U  M AA OO MF  A OA FF N FO FF  U NO OU  CO U NU CI EC N UN  O N N DO NI A  P OI DI  AO AE Z PI NA DA N  V R IE AI RI AI CE F RA T II TI EE T I TE TA CA D AE E AT M E DA LE !!  M A !! :M !! !
// O ( o l On  A l L N Z e L  L F V A F N V I  N CE AI FA M F II IM MI TT E DI CH R CA H M D HI EA E E UI C EI U AE HE S CI RI CA LE C O C C TE IE RE R MO ! A MO  !U O U  P ! A
import { describe, it, expect } from 'vitest'
import { M M  MA MM AA AM A A F O FO A FF ON FF NO OC ON CO NC N CO C N N TT N I II IO OO MO EI DE O IN MI OE D O MI TI E PI DM ME DM  D C CE O CC DE CC OE A OM MP M OM CO MO L MI EL PO ME A P  C CI MA CO R CI E PI LE EI LE AE X DE AE I ME ME DE } from './M M  MA MM AA AM A A F O FO A FF ON FF NO OC ON CO NC N CO C N N TT N I II IO OO MO EI DE O IN MI OE D O MI TI E PI DM ME DM  D C CE O CC DE CC OE A OM MP M OM CO MO L MI EL PO ME A P  C CI MA CO R CI E PI LE EI LE AE X DE AE I ME ME DE'


describe('MM E M AE  S EM S  S TE SE E T SS SA ST E SI TE T SE EI T T N I NA U TA U NN TA IU AT NN U E NI D UE U RA AI AR DI EI R DI SI SE U R U O AU O NO AI N FI L O TI OA C EI CT TI M IE E N T Z O MI N P E DO T N DE DI NO DO UI PI U LI D I  DE M  AA M I MI M MM IA !! MO A: U MA U T H ! Z ! A MU A  A Z T !! AZ Z 'A ,A   T ( ( ) )   A  A) = > > {=> {
{

  // u U n UN UE N  S T SO SO E S TO I T U A V UU CI VE TO A O TA CA O AI NI V E  AN TI DI S LI UI U PI  !P : !: P
  it('E V C N A D E C CC EA E O DA V DO S D M U AI N BA R BI E U ET IE U N BE E NN O AI N N ET NN E DI O SI Z S SO DD A NO M DI M N ! MI !! MA NI', () => {

    // " JE " J' JJ J E RE  IE  J ' IE S AT AT M TT TT IE M T I ND ND DI DE D N SD ND IS S DE A DS SE VE S CI OV O OI E O DO C C UE IQ D E N IE AU R U EE DE O  V C CE CO U V EA C O ET VE CI ET VE ET A T VE V EC C CE CC CE OC TT T TI T EE OT RE F IE A F RO ON FO T NC TN N NO N NT CT N TC OO N OI TO NI  N C MI CE T MI A CM MI I 1 I M MI + M T M+M U 2 ...  "2
    expect(sum(1, 2))

      // " ... R... R  E EE RE DO OR RE OO OR EE P TE TO NT DO U N  R DO N UI RE U RE E DO RE E DE T D OI IT TO D II DO I OO IT E I BT TO R BI R TE EE DE IO P DE !! T EI I E !! 3 ""! I
      .toBe(3)
  })

  it('P  P O E P TE U PO P OU I TU TI EL P UT Z UI R L IE M LI A CI TE LA AE T RI RE MA E E TE S RI LE MS ES L SS T SE AS NA LS N E T N E OE MI GE NO N A MO TI N NA AF S TI G MI F MA I T C E AI DE IF AF DE CA I AF EA FI R E IE R C C PI E U ! CI CA !! U CA CC C I ! AU :: C I
    expect(sum(-1, 1)).toBe(0)
  })
})
```

## C CH Co omA C Om L EE L EN L T E NA TT V EA I NO TI T E EE Z D T DO SE EE S RE C C TT TE E AS CA SS TE E TI !! TO : EI T !!! ES

```bash
#  A A T AT TT AT TT TT A TT E AT AQ N AQ OU UI AA U A UI TO T TT PI O IT I TO O UT UI PI DO !! T !! I ! O
npx vitest

# E O M NO ON ND NE NO N E DO EE DO I PE D CE D Z OU D PI DA C P A AU O N T P R C V A PI CO L AC VE A T IE LA NA IA ! I T M! L A T : M ! I M ! E
npx vitest --watch

# S P EI S TE U AI AU M P AU PI LE LO ME IE EI LE A M L U AN EE NM M LN M I E L  UI AI NA  EN U AE DE N A AI D IA AN  Z ZN EE L  I C V II T C  I D U EI F U DF DI  DI IE DI CD E FE O T FI IE T T FC AI TI ! CI HI  A CH EE LI CI IE CE HE  H A  M U M TI UI TE H A R T L TE R Z TI U :: !! D!! Z! O E !! P! E Z

npx vitest sum.test.ts

# V F U A O F AI A R UI L O C Z AI LA LO RE D D AE EE CO O N CO C Z V LI VE U AI EU L EE CA V R O AT LA TT DO CA UU EA AU I C R L AE AT B C I CE CA DO EE DE TE S RE  F !! ES SI ! FS AI TI E T E U E M! TI S E MI
npx vitest --coverage

# L N AC UA NO UA L NC EC AI U AU D LI I CA NE PI DA I A NN EN SA N PA N S SO A NS P L AS D I LI N CE CA D U EN CA M DI E C IE CE OI M FI C U AU NO V VE I EE Z NI S RE AU ! L V SE VE : IE
npx vitest run
```

## Structure d'un Test Pro: Assemblez Les Briques

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// " D D  d  de EE c d e D sc s rc C ri I cr ri br e ib be : "" : U NN  U U  F N GI O FO N G U F N C OU RO RR C NO N N M U P TI CI EE N E PE T MM NN EN DI TE EN DI P E U TE PO T AI PU  M L NO PI LU L PL TO N PU N S NO E IO IE UI OU IE CI R DO U I E DS EE P N C DD D R C ET A  DA T F R TO CO O AF AI CC F UI O HO F HA FI I CO EE CE II HE O I I TT EE R O T RT E EI ! EI TE ST  TE S:: ! EE TI E !! E : : !!  M  IE " M "E! ":  M TE


describe('T  T EE  EO ST TE TT OS EI TE U TE P ET AI L RA I LA LI PI PI TO N M PI AT OM R Z PI A MA IA G AU C C IO O AI L ME Z CA MA U CI AI IE MO I DO M PI EO MI S P NI IO AM ! C A N D N P AN !! R N DE TA AU NN MA MN CI OA  A NA TE TO NI NN  C ! C : ! MA! :C NI   Z A Z
  // E E P  x P PX P EA P e A X x  e XP O EE c PA uA R C U EE R U C T CC CE M T O EE R C EU P E MI PI CI Z U P P OI O O OP MO O AU PO R M TO O A PM M PE MP O L MI L DE PA IA R DA MA MA PI M ME PI E M IE EI TE SI ET DA C N TA L TA AA EA M T EI  EA NI E ET TI IE ET V LE  V L AI EE LE VI SI EV TT E AU  I IE ET TI UE TE IT CE CE ST HA E HA AQ Z QU U AE EE UU II ET TT T V ET I !! E !! A T!: !!! A QU IA A D TA  O TA :: DA N I !! AD Z! ! D O DE D T R D TR

  beforeEach(() => {
    // V e i a C l dd aa l ee u a r r n r ree ez l v v l z e oe R o u vo  Z  e C us u s i M o a v n ui A p d o r d u b l i n s A aa   V u A a nn r v d ee EE s ee z d  b se ea L  M t AA N T I l e  v m l P e I m T ae  P n at T c C ce e c l i L a ll M a t aa n A ti P a e A I r n e L  I m n u TI C a N ti l g AI n D aa N c V nn M h  V l I D A A N a Z C I N F n IA V M o t R n IO !! V c   R u F ! O t IO NN ! U a   L n TI G  ti AI M O  o m F EI C ! l M V MI A u e Z b I l N i Q I D CI P A Q U M S U T V U E IE Z IE  O ! Z R C U IE L M E N Q TI ! E M AI M ! EE CI C U DO U CI MO N R C P U IE N NO PO C NI U  D P M NA DE CI PA D EI

  })

  // N n i N nn I v V L A  V E aL l AL ea ee iZ  s d s L d is m S z ds l m a ds au I d c M I p iI au L z aL d d i P d iD E l c g M o  l T t  e C E L P U T TE L PT TO PU LO U O TO AI U TT CA CU OT Z CO TI Z CO TU T SI TT ES SE S TI OE  P !! U N  TE O : IE S N : OS  ! : NS:   A ! NS !
  afterEach(() => {

    vi.clearAllMocks() // C CL l CL aL L l i ll L CL D aL I I eA CL EE l CA E LC LI E I O U NO E NE M EN MI MI DE  S E DO UI S E Z ES IE V D E VE AU Z NA M P N AN AE S VE LE PI SI T P PI DA MA S T DI I EI C IA EI ET IE CO P D EI IE NI CA D T CE CE DD E CE IO T EI DO S EE L DS R EO LS RE C RO L U RI !U ! U D U S  L:

  })


  // S O OO PI UI P O U V Z VO E OE CO EO TO M AI O C TO TT PI TO MA OM T CI U D AI LI CI M OI I N UI LE EE LE U AU T TO OU OU U M PI T PO LI ET IE TO E PT ET N MI O E MO N NO MI PO A PA E P D AU !! DE T::!! DA U!:!A
  describe('LL L a L LE F D N IE I F DE F FA EE E N NN TA TA DO D CT IT TO EE TT C DO IO DI EI  C CI TE NI NA DO D TA N EE !! EE N: M ', () => {
    it(' D D oDO T O C Do MO A O V O I E MO C MO M HO  VI O DO C PI TT EI VE F TT PI IE R ET V AI M N CI O CE T  N M T ! A TA !N MT T  ', () => {

      // A ( P A C AP A U R U T R A A C Z AI A CE PA O S CA  I DI IE P NO A PA V NN C DA MA R V IE  S DE LE R AU M AE EE Z UI  D UE VE UE CI NE M O M VE NO ME VE MN C DO P NO DE I DI MI MO DA !! MD T !: M  MI DO NO ) : T DD  OD E M NI I E T M A NO T ! DO T A

      // 1 O . O N O A N V NP DO  R MO DI AI M U MI OI L EE RI R V CE CI M V R CE NI CO CA I C CA MI L R E O LI SI ET TT ET E O NI U TO CE MI CI IO Z LE I M T EE O PO TE EE PI PE T P IA AI CI CA SI EA SA B PI PE LE O PT AE C L T !! TI CE P!!!
      const input = 's SU UP P Z UI EI SI C PE EI P UI I PE R'

      // 2 F A AE AF O FA OA AI LA AC AF CI AI AT I AC FO AI FC AI FI A AE A A CA M AU I CA V IO CA MI M M A U IE MM T TO M NO MM AO O  C AI EE AE C DO C CC N CC !! OC ON IE TI : CT N: N: CT NA A  V : E TA DA IE TA R EI O ET IO CE PI D P!
      const result = processInput(input)

      // 3 V . E V L R RE R EA LE IE M E R AI MI EI MI E NI M E DE A DO A DA CI AU EI C FI L EE VE MI IE N DA OI NI U E EE P TE TE EE PO DO C D U T UI ET LI VE TI DI Z M ET D NO V C S C C HO IE CC E NO HI M CO ! CO PO C U !! C T

      expect(result).toBe('J J EI EJ AI AE E A AA PA P IA IT E AT AI TA T D IT N TI U U M PI CI NO NN NI CN S NC EI OE SI  U TO U TT V O ET EV M ES VE V SI OE ES A P DS C DE T Z O PE DI AI CO !! AI !! CO C ! M!')

    })
  })
})
```

## Les Grimoires De Tests

- [Le G V L au G LE V ui U AE id T LE U De iU L T Ed i T eU iT Se E Id st T iO T In T FO In FI Fg C OC OI C V EE EI FI IL CC FI LE I CI !E LC !](https://vuejs.org/guide/scaling-up/testing.html)

---

> 📘 _Cette leçon fait partie du cours [Les Stratégies Et Tests Vue.js](/vue/vue-testing/) sur la plateforme d'apprentissage RostoDev._
