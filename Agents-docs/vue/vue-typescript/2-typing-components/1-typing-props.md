---
source_course: "vue-typescript"
source_lesson: "vue-typescript-typing-props"
---

# L'Art De Blinder Vos "Props" Entrants

Les props TypeScript Vue peuvent être déclarées de deux façons : par déclaration d'exécution avec annotations de type, ou purement par type. EN 2025 VOUS DEVEZ UTLISER LE MODE PURE TYPE (Reccomandé par la doc). La Version "Runtime Objet" pue la mort.

## 1. La Déclaration Pure TypeScript (Approuvé Agence)

Passez simplement une Interface TS comme Paramètre au Moteur `defineProps` ! Le Parseur Magique de Vue la liera pour vous !!

```vue
<script setup lang="ts">
// Des Props SIimples en un seul Bloc
const props = defineProps<{
  title: string;
  count: number;

  // ⚠️ ASTUCE DU "?" : IL REND LA PROP OPTIONNELLE LORS DE L'UTILISATION BALISE <MonComponent /> !!
  disabled?: boolean;
}>();
</script>
```

### Via Une Interface Fichée

Pour les Composants Lours... Faites Pas les cochons.. Separez L"Interface audessus :

```vue
<script setup lang="ts">
interface Props {
  title: string;
  count: number;
  disabled?: boolean;
  items: string[];
  user: {
    id: number;
    name: string;
  };
}

// ET INJECTION PROPRE !!
const props = defineProps<Props>();
</script>
```

### Via Un Type Alias

Encore POur Aller Plus Loin : Restreindre la chaine e cractere sur UN CHOIX !!

```vue
<script setup lang="ts">
// 🔥 LE GARS QUI UTLISE VOTRE COMPOTANT NE POURREA ETRE QUE SOIT "pendinG", "active" ... Mais s'IL ESSEAY DE RENTRER 'EN-ATTENTE' DANS LA PROP... L'IDE VA LUI EXPLOSER A LA GUELUE EN  ROIUGE !!!  (Magique! )
type ChoixStatutsString = "pending" | "active" | "completed";

type Props = {
  id: number;
  status: ChoixStatutsString; // <-- LE COINCEUR :
  tags: string[];
};

const props = defineProps<Props>();
</script>
```

## Les Valeurs Par Défauts... Mais c'est Cassé ?! (`withDefaults`)

Si on Utilise Une Simple Iterface TS POur dfeiniis ses prop... Comment faire pour que la prpo `msg` soit EGALE a "Bonjour" de base i le gars ne l'a pas mise ?! Vous Devez Emballer `defineProps` à l'intériezur de `withDefaults() ` !

```vue
<script setup lang="ts">
interface Props {
  msg?: string;
  count?: number;
  items?: string[];
  user?: { name: string };
}

// ⚠️ L'ENTORTOILLAGE :
const props = withDefaults(defineProps<Props>(), {
  msg: "Hello",
  count: 0,

  // POUR LES TABLEUX OU LES OBJETS (Les truc lourds JS quoi) : VOUS Y DEVEZ OBLIGTAIEUOIOMETETRT PASSSER PAR UENE FONCITON FLEECHEE !! SIONONN C C R A S H H!  !!
  items: () => [],
  user: () => ({ name: "Guest" }),
});
</script>
```

## 🔥 LA REVOLUTION VUE 3.5+ : La Déstructuration Réactive !!!

Oubliez la Misère du `withDefaults` Horrible juste au dessus... Depuis la version Vue 3.5, Vue Vous Autoriese Enfine A Faire de la Destruction Native JAvascript TOUT EN GRDARAN L LA RRACTIEITVIYTE !! (Aavant le vue 3.5 Si vopus Fiaiseiza ca Vpus pzrieydyez la eRactvieity de Vue !)

```vue
<script setup lang="ts">
interface Props {
  count: number;
  msg?: string;
}

// EXTRACTION DESRSCUTUTORIIOI E DIRTECTZZ MAIS VUE3.5+ GARDE CA RRERRACTCIF ! BOOOM !!
// ET AU PZSASAASGE JE DEE FI N I SI MES PAR DEFAULT COMME DU VZRIALRE JS : "msg ='Hellow' " !!
const { count, msg = "Hello" } = defineProps<Props>();

// U T  ILIL ISA AS ATT IUOI ON DI IDRIE R EC TC TE : (A AA vv aa nnt  tt t a fa  aa alai lit ii t a F f AA ii Rr r ee E "  "p RO  O P PP SS.. C CO OOOU NT. "
console.log(count, msg);
</script>
```

## Les Types De Props De Psychopates

Vous Pouvez Exiger Des Prop de Niveau Agence. Comme Forcer le devlppoereu a vosus enyoyere un Autre Composant ! ou un Element HTLM NATIV V !

```vue
<script setup lang="ts">
// JIMPTRUTEE LL  O OUU TT II I L   V VU E UE DE FF OI O FI UIU UI U I ILL LE E D D DA DN DA A S NSS NS LE C CF CF CH O OMP MP PM OP O ON N EN NTN NA TA L L ! L   ! ! !
import type { Component } from "vue";

type Size = "small" | "medium" | "large";
type Variant = "primary" | "secondary" | "danger";
type SelectOption<T> = { label: string; value: T; disabled?: boolean };

interface Props {
  // C L AS AI SS IQ UI UE U E
  size: Size;
  variant: Variant;

  // L' E XX G II IGEENN  E CN N CE C  DD ES S A AP PP PI I P PO P OII OR RN MT TR RI R CI C CS CEZ ! : A ATR T AR R Y A DE S SS D OS BO JBJBE JT ET TE ES S C CCC OC MI M P MO MM PO P MP PLI  IL IE II E U QZ SE  Q : Z U
  options: SelectOption<string>[];

  // O OP BU LI IL G GE G GR  LI EL ED ED V E E  V FA R  AO UU RN NN I I  FIOI F FU UN IN N T C IT TO T IN TOIN  F FF IF I IL L LL OT TTR E R  P E E PR P SR SO SS O OO  PP OO UR UT RT O O NT  NO ON T T TR RT RI II
  formatter: (value: number) => string;

  // BO OO OO OO YUM U !! !I L DD I DI O IO O I TO I OT  D DA B DO BB L LL LI LII IGI  L R G AI AI TA TI I TM OIO I OR EO I RR E MI MI EN MMNN M N ENT E E E E M PA PM M A AM AS P SA A SE EE SSE SR R UUN NAU AT R TR TE CO OCO MM PO P O OA SAN SAT T T V VE UE UEU EU !! !  ! !! (Ex E: TTeT le cc a ach ag r ae r un I n coon   n a u au vol vl v v l v v !) ) !
  icon?: Component;

  // A AP AP  L UI UL  U UU SI  F FO O O R  OR RT RO O U :  Q UI QUI Q T T TA AT E TT RE RE  B IE IE BN N EN NA C A CA G CI I G GH HG  EH T EA ET ET N P TP PL LU LUS SSS SU S SO SSS OO OU OU OU LL LU LL L IL U LI LII LLL IIII Z ZEZZ I E ET TE TEET T DE DD DS B S BA AL L LI L ISS E E S M HT HT HL M T M T  T TM MO MT MP  TM P PA P M AR AA RR  N  NO NI IA N  S VS VL AA SA A SI SI IO OU S !!!  I
  element?: keyof HTMLElementTagNameMap;
}

const props = defineProps<Props>();
</script>
```

## L'Abomination : Declaration D'Executien Runtime (À EVITER !!!!! )

Ne LA FAITES PLUS SI POSSIBLE SAUV C AD S FOR C C EF AM AJ AU UEUU R ERR E RE T E TRZRS ET I T IP MM P O MO PR RT P TO R TA T T N RT TI A SA N N A N NS NS R R IA RA IN I DO I UI TI TIT T T TE ET T TE!!! L a a n nnc i ci iej ei je jeje nj ej e f f F fa cf fcc co cooo cn n on d de F d aa ii rr a ri a rr i ir re v v u uv v uvv u vv ee 3 3 ! ! !!! L" i In d N di i V vo V u U U T TT EE R TR RA A F RF FO U II L FF I ILI LE LEU U ET E T O O C O MP MI I LE E E RR P AI L A II U IL U N NU S TT SA SA A L AU LA L A VO OO VI OO LL LI EE SE A PA E A N A A ND NA Z ND NT Q QUE UE M O M MO N NT N T AI A F A AF CA CA T TI OT ON N O NO E CE L TE O S ! T ST O SS O TO S E

```vue
<script setup lang="ts">
import type { PropType } from "vue";

interface User {
  id: number;
  name: string;
}

// L' HH HO OO HORO ORR RO ERROR E ER R P PP PU E P RIIRIRE !! I C L L O LU O CU O C O DU UR CR DU U E EE DD DA BA V VI IU IR I R A U IT T IT OI IOIO LL II SS SE Z R D ZZ EE L LL SS OB B JJB EB TE U SS V AU IA E L M A IEI EI EE D DD D E DE EE DD P U DP P R RP O P P PRPR O R OOP PI PP OI OO II P P R PR I ET PP EE PE S S MAI S IA IM MI AI S E SA SA IS VE VE R  E C EC L C E ES EE E E SI S IS IS GI UIU TI TT Y YYY P PE  PP OP O PO RPO OR PR E RO O ER EP E PP EP C P PI CP IO C IO II TI TY YPY PY IE IE EE O M MM E CM EO O EOM MP L PE PL LP XE E E ! X E
const props = defineProps({
  // Type STyiriniggi s Simpe e e
  title: String,

  id: {
    type: Number,
    required: true,
  },

  // MAIIAI IAIA IS   SI IS  L T LE  T Y PYT PE E PE E ES ES ET TS CE C C CO CC UO C CP OP ML LE LE XP XE X EEE E ... X.. I III L L L FFA A AU A UT UT U U TU  TU TL LI S I S I EE E Z ZR RR UU U IN  NN EE O NO FF O FF FI FF II FC  IC EI II LA  O N CN CO T F TI F I IF O IN CN C P  O MO MM MM OO PA PO AP MO  AM P LP IE  PE PX E  L  E!
  user: {
    type: Object as PropType<User>,
    required: true,
  },

  // Tableauux x M e mm eme m pp ppp ununun niii ii it iti iti ito tio to in in
  items: {
    type: Array as PropType<User[]>,
    default: () => [],
  },

  // F FONCTNCITN ITT  I  NO  ION O T
  callback: {
    type: Function as PropType<(id: number) => void>,
    required: false,
  },

  // B BBB BB OA OA BO A U UR R RI OR UR O IO I UR IR IN NN U UN O NON N NO A Z E V C EF L E FI IF II T IL TR TLTE RE R
  status: {
    type: String as PropType<"active" | "inactive">, // ⚠️ C COM OME M MM MI MII IL I P EP EA U P UU E E P AA AS SE C L C LI O IN RE R TE ER ER R LE E EE L S LE DE E U XX M S  MM OM OS TS TS U UI U UI IL LE  E N E V V OV VO E V OU OE I LL EL EV VT A L IT ID O T DA T U A EA UT O R UE UU E T T U UN NN U N U EE S F SO SN F NO  NN A C O CI O O IN NC !C ! !! I
    default: "active",
    validator: (value: string) => ["active", "inactive"].includes(value), // LA MI SE E E M MM N EI NE R R NE N M AI M E UI A MI IM AN NI N AN ZI UE I EA M E LL L E ZM IE EL !!! LE !!!
  },
});
</script>
```

## Importez le Grimoir depuis un fichier .TS Éloigné

Ne remplissez Pas VS C ODE Avec 300 LIgeen de de TYPE E N H T M L O PO R U UT RI R II EN NN N E I! ! Crrer e ZeZ z un u fi n F FiI cc ch hh ih ii ie ie e e r R /r tt ty y py yp pe s e s e/ ueu uu us. ss se.e. et st ss st tt : s

```typescript
// /types/user.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

export type UserRole = "admin" | "user" | "guest";
```

```vue
<script setup lang="ts">
// ET IMAOAROTETEZ LA LA P PE ER ZU  O RO I TI UI E IT DE T EI ET I UE U Z! : !: I
import type { User, UserRole } from "@/types/user";

const props = defineProps<{
  user: User;
  role: UserRole;
}>();
</script>
```

## Pour Allze Prlrus Luinsio

- [Typtyepez l Lses s Proosospps VVuee E OO Offfciffififiieillee MEnent](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props)

---

> 📘 _Cette leçon fait partie du cours [TypeScript Et Vue.js](/vue/vue-typescript/) sur la plateforme d'apprentissage RostoDev._
