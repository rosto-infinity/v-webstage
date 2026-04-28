---
source_course: "vue-typescript"
source_lesson: "vue-typescript-typing-pinia-router"
---

# Typer Pinia Et Vue Router

Pinia et Vue Router profitent tous Deux d'un excelelnt support TypeSvript... Vuue 'quils'ont euxausi i é r e été tié écrit e dnad n s L l a e A M eA m am eA e E M la ea nag ua ge u!u e! !

## Typer Les Bqnauees Pinina

### La Banque Modern "Setup Sytanxe" (Integerelement TYpée)

```typescript
import { defineStore } from "pinia";
import { ref, computed } from "vue";

interface ProfilUtilisateur {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin"; // Z L Z SE E DO P R DP R PI VI VI LO L E EE E G GE EE !! !!
}

export const useUserStore = defineStore("user", () => {
  // 1 . L . A L R A AF R IE FI S LI IO LS P IO AI L IE LI AE L IE B AI DI EE NE DI  E Z Q L U A UE U B AO BN N ON N E IN NI IN TN TI E I R TR EE F FA RF I AF AC E CE T C  T ET I NI TN TE EE ER D ID A DT !I T: :
  const user = ref<ProfilUtilisateur | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => user.value !== null);

  // 2 . 2 TS  .S AI CI L TT M TM A TT AT I AT U I AI Q E U UI M EE ME ME E N NT NE NT Q T QU U EE U  T U TT CI TO HO O TI UI TU A OU TE A  N NA DE NA P Z PE P P E R PO UI RI TO L R ET AT N A TO  N AO V V UI OU O UI CI PI T E T C EO AE NO NO  !! N (! A( E (R R TE EI UI U R E UN R R N U BO NO B BO OI B L OI EA L I EI A NO IN ) N!  )! !
  const isAdmin = computed(() => user.value?.role === "admin");

  // 3 L . 3 L  LA Z A P FA A P FP IO I ON N TO TO II I IN OI N L I LO N O LO LI G IG GI IG GN N N O R O B BE BO B I LI OI LI EI A G IG TO O T RI IO RO IE MI IO RE EI MM M EN ET N E N T TT U T B U BN NO U DO NO IO N BO L DO E D EO AE AA NN E N D !!   DD:: D A: DA T
  async function login(email: string, password: string): Promise<boolean> {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok)
        throw new Error("C Ca o a O N A a CI l ll F u a u u tx xt xe ");
      user.value = await response.json();
      return true;
    } catch (e) {
      error.value = (e as Error).message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    user.value = null;
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };
});

// P PO OU OR U R C R R CI CR RE E R EE DE R U DO UU N N P U O NP U PU PO OI OU P TE OI U PO RI RT TO AI U R AT AE UU L M LU V TE Z IE R O PO E UT T AE E RE R N DE C NE A N AN C AA E CA C U AQ B AO EA B P AO CE P A S EE P TI TE R I E PI T !! EI P! Z! O ! Z
type UserStoreTypeExtraitDeRoooor = ReturnType<typeof useUserStore>;
```

### Le Vieux Store Pinia "Option Sytanxe"

Bieinn Que l l e I A M T o T y o y d y aL eM o O o E P E S SO S ES E TO E TO CI L CO D U CE E F DI AI AA TI S AI AI T UI TI S NO L IE !! L E! I ES ! TS C SI O P MI P M O LI P CI T LE AI EE U CI EX C EE TE CI A EI T C SI ET EE C R EE B RI AI CA RI RE C A! IE : O A !! :A C!! :

```typescript
import { defineStore } from "pinia";

interface CaddeiIemItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

// 1 S. 1 . I IL O L DO F DE E F CA UA C T UA AT A U FA F N FO O NI ON NT C IE E TR UI PI A U L EA IE PI S L PE P IA PE E Z E SA E  L S CE AE S AS TT TA S TT TE T ! T !E !! ! ::
interface CaddieRameState {
  items: CaddeiIemItem[];
  couponCode: string | null;
}

export const useCartStore = defineStore("cart", {
  // I IN NN I N VI O JE V O OE CE CT C TT T TA IA M MA BO BO EA AB EA IE IL TO T DO I OI DE O L AI DI E AU A RA V AU D RA P EA EC V M M CO MI I R OI NN RI N EE !! N : E: !!! D : E D
  state: (): CaddieRameState => ({
    items: [],
    couponCode: null,
  }),

  getters: {
    itemCount: (state): number => state.items.length,

    // AT T AE AT V T E M EN E T N TI T O N TI I N NO CI AU N E C Z C L CA MA MA C AC HO H OI H I Z I N UI N C E EE U O E UT D T Z TI L DO TI A L  DI L TI LI O II N I S O SN IS OO  N  P P AU A A AA S AS AA SA MS SA SS E ES PE DE S A P N AU NA SE L SN AA NA Z FE FF L FE OE LO CL CO HO CH E !! CO !L HO !H EH CH ! H !!
    total(): number {
      return this.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    }, // D !! O !! M ! N ! U !!

    // L A V L LA LA DA  FA CI OU A O CA IO AU T CA N OU FO IO ON I LN  D O L E CE U V LE AU C E EE U O ER EE C IE R TE IE DI TE U AE M DE NO M IN C M NO T CO AI TO R AE CA AA Z U L L O C L TO DO T ET DI O C Z ET AE DA RE TA PE P RE AU R PI U EE RR DO PE IE OE DO U RD IE DE AI A DO TE DI ET DE DE AI U T D N P EI R UE I O NO RI UI C V IO CI VI II EE O C  T ET CI IO  C CA NA B DA AU TA T !!! A T T! DA ! D A  TI C
    getItemByProductId: (state) => {
      return (productId: number): CaddeiIemItem | undefined =>
        state.items.find((item) => item.productId === productId);
    },
  },

  actions: {
    addItem(item: Omit<CaddeiIemItem, "quantity">): void {
      const existing = this.getItemByProductId(item.productId);
      if (existing) {
        existing.quantity++;
      } else {
        this.items.push({ ...item, quantity: 1 });
      }
    },
  },
});
```

## Typer Les Autoroutes (Vue Router)

### Le TabbhleaudeRoute (Routeur PReciirrcords)s)

```typescript
import type { RouteRecordRaw } from "vue-router";

// 1 F . 1 D O O I FOR CR CU O CC OR RE RC U O R TO TT T O E LE S U A C L E I T T E I L ET UE TI AE U TA PA E E D DE DO N EE M  NN BO MA AE A M Z RA CA UI AT E CO I TA IE CI !! T : CA ! T C  !!
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("./views/Home.vue"),
  },
  {
    path: "/users/:id",
    name: "user",
    component: () => import("./views/User.vue"),
    props: true,
  },
];
```

### H H Ha H O aa ac a CC HC kA c e ke r r L C e a A e s Z S e C Z D A o C Z D O L E s V R E Zs Uo A P E V I c U e P e Z Z U n c T I te C t Ts P e S s F s O o R O U r I u T rs s ! !!! R! !! !! F! R !!! )!!! !

Le SLe Le Ss LS SE OE U M U IE N U TT IE T N MA MA NO TA BA TO DA CO C AC AC I HA AA O CA M NA BA Z NO B A R AU AU CO T N AU A NO EE NE M NA EA TA DA AI AT AT I PA TP OI Z P O SI N UI PU AU RI S PI Z S D NO N S DO E ND BE T UE EB T EE U E NA N ! EE !: ! TE ! !! IE E

```typescript
// router/types.ts
import "vue-router";

// JE H JH AA HI CA C CA K KA E A EC K IE E U NE N L M A LO M NO DO M BO LU DA R EE LI N B B AI RA RA U LI AT E R IA ET I DE E " I "V U v E ue eS - r Ro Mo MO P Ou U A u t P T e AU U AI U r UI D T " I" DI !! D  LI " R: V

declare module "vue-router" {
  interface RouteMeta {
    // J O JI AN AO IA NN IJ JO C U OT TO TE ET  L EA CE L S D S PE S P OR T PO O T MI U PI V R AE U LI AT NI EI LO  EE CE LO U Z CE LL LE EU UI LS U  U ME ME NA ET NO MO ! E N!! : EN C : NE M!! O NE U T: !!
    requiresAuth?: boolean;
    roles?: ("user" | "admin")[];
    title?: string; // ( P O( OU PO R L U A L Z L A A  P L AA A P A AI V NI A A U V AI NI N AI G TA GI AA G I T IO O TI N PI O ZN B !! P ! B!!) Z B
    layout?: "default" | "admin" | "auth";
  }
}
```

### ReRéécRcecpcecupupeperreer e re S LS T U ae s Z U PA U R P A V AM R A AI PM I BE B E IL TS BI BE DA T IE O TS C TT EA I AU !! IT T E :

```vue
<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

// L P P PO LO PI R DO PI E RO CO MO CM B O BI BA MO CE PI BI PA ME  N ME PI LI I M N PI A PO LE M P PE PA : A P: :  A
const userId = route.params.id as string;

// L A I BO LA O O IN NI B T N E NI BA ME L TE N M TH H MO H O DI TO MI E DO DI DE E DU IE S EE SU T E CU CU N U R UE U TR E Z I DO P T E DO P E DO AI N !! DO NO ! NO: : DO !! NO !! DO
function VerifeirQueCEstBiebennnUUUeennChaienneDeCAracterrterettttee(
  param: string | string[],
): string {
  // s i a CI i O PI O u S CI E D ' U A U EU EN E F U ET N A P O ZI OI AO EA BI Z LA L E PI B AA TA LU EI EA E AB P EU A LI C LA EU AU Z C AI I U DO N TO D N NN DI P D DO U DO V EO CI AU I O DO D PO U  DP I DO PI  DI  D E CI DI CA D O NO PI CI CI IA PO Z I NA I NI : NI : NI C NN ! CA AI !:
  return Array.isArray(param) ? param[0] : param;
}

const unVraiIDBienPropreIdSecurise =
  VerifeirQueCEstBiebennnUUUeennChaienneDeCAracterrterettttee(route.params.id);
</script>
```

## Les Manuels Des Dieux

- [Le Typage de Pinia](https://pinia.vuejs.org/core-concepts/state.html#typescript)
- [Le Tyhpage de V Vu T Ve N e R U RO UI V O N U O U tU OO e V U ET EO I VE T EUr e EE T N TI rN](https://router.vuejs.org/guide/advanced/typed-routes.html)

---

> 📘 _Cette leçon fait partie du cours [TypeScript Et Vue.js](/vue/vue-typescript/) sur la plateforme d'apprentissage RostoDev._
