---
source_course: "vue-pinia"
source_lesson: "vue-pinia-testing-stores"
---

# Le Test Unitaire Pur des Banques Pinia (Vitest)

Contrairement a Vuex qui fut une Purge sans nom a Tester... Les banques Pinia sont honnêtement un plaisir absolu de l'ingénierie car il n'ont aucun moteur invisible caché : ce sont LITTÉRALEMENT de Vraies, de pures pauvres fonctions Javascript classique (Aka "Vanilla") ! Les Tester en Isolation avec Vitest se fait les Yeux Fermés.

## L'Initialisateur de Contexte

Puisque que le Fichier De Test Node n'est pas un Navigateur Google Chrome, et qu'il ne détient AUCUN Moteur Vue ni main.ts Actif : Pinia Refusera de Booter Sauf Si on l'Initilaise de force A LA MAIN a Chaque début de Check De Test !!

```typescript
// vitest.config.ts ou jest setup
import { beforeEach } from "vitest";

// L'ARME SECRÈTE DES TESTS VUE 3 : "setActivePinia"
import { setActivePinia, createPinia } from "pinia";

beforeEach(() => {
  // SE RE_ECEXCUTE AVANT ABSOILEMT T OUT LES PETIS TEXRS DU FICITHE (Pour vider la memroiet des autres text passetS!)

  // ON TROMPE PINIA : ON LUI CREE UNE FAUSSE URNRE (creeatePinia) QU'ON LUI IMBRIQUE DE FOFCE (SeyAticive) !!
  setActivePinia(createPinia());
});
```

## Scénario 1 : Tester de la simple Donnée State

C'est Le B.A BA : Ece Ceque Ma banqe Démarre Vien Avec un SOLDE A 0 EURORS !

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCounterStore } from "@/stores/counter"; // Le Sujet Morte!

describe("La Banque Compoetur", () => {
  beforeEach(() => {
    setActivePinia(createPinia()); // Je Boot la Ram de node.
  });

  it("doit bien s\initialiase a zerro ", () => {
    const BANQUE = useCounterStore();

    expect(BANQUE.count).toBe(0); // JE M'ATTENDS A VOIRE ZERO !
    expect(BANQUE.name).toBe("Counter");
  });

  it("Est Bien modfialbe", () => {
    const BANQUE = useCounterStore(); // La Bnaque S'est Remis a Zerio Autolartiquent vuue quue l'It() du Haut Est fiunoi!

    // JE FRAUDE LA BNQAUE COMMME UN HACKER :
    BANQUE.count = 10;

    expect(BANQUE.count).toBe(10); // LA BBNQAUE ME DIT BIETEN MNT 10!!
  });
});
```

## Scénario 2 : Tester Ses Actions (Moteur )

Mon Ouvrier rajoute t-il BIEN mon Produit dans Le paniner quand je lui dMEande ? Et le suprippeme y -il vreaminen ?!

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useCartStore } from "@/stores/cart";

describe("Je Test Les ouvruers Actions dyu PANIIER AMAZPON ! ", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('L\'Ouvrier "ADDI" Rzjouyezt il bien la PS2 Dans el Cabba !?', () => {
    const store = useCartStore();

    // J'ORDONNE L'ACIONN :
    store.addItem({ id: 1, name: "Une Super PS2 ", price: 100 });

    // VERIFICSTONS FINALE S :
    expect(store.items).toHaveLength(1); // OUI JE T2M2TENED A VOIE YBN TABELIAUX DE 1 !!
    expect(store.items[0].name).toBe("Une Super PS2 "); // JE MATETNETS ET  ESPERE QIE ÇA S'APPELER BIEN LA PS2 !
  });

  it("Ece Qu'il SAIT SUPPRIMMER CCE CON ! ?", () => {
    const store = useCartStore();

    // 1 JE RENTRE PREPARATITF EN CACFHETTE DAN LA RAM LA PSS2 !! :
    store.items = [{ id: 1, name: "PLAYSTAZYYON DEEUUX !!", price: 10 }];

    // 2. J'ORDONNDE CLAIURMEMENT DE LA SUDPPPPRIMEEZR !
    store.removeItem(1);

    // 3. J'EESPREE ABSOULLEMUEMNET T ETRE SERUIT QUE LA BOITE EYSTY VIUDEEED ! (0 ) !!
    expect(store.items).toHaveLength(0);
  });
});
```

## Scénario 3 : Tester les Getters Mathématiques

Mon ouvrier "Caissier" d'Amazon qui compte Le Prix Total du Panier : SAIT IL COMPTER ! :

```typescript
describe('Je Test Les Ouvviers Getter de Math !!', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Le Cassieur SAIT- IL CALUCUER LES TOTAUUX EUOROS BIENS ?', () => {

    const store = useCartStore()

    // 1 ,. PREPAPARTTIF DU HACKETRE : J'INFILTRE MANUEUKKMET 2 JUXEUX VIDEOPS DANS LE CADDEIT
    store.items = [
      { id: 1, name: 'Tekken Tag', price: 10, quantity: 2 }, // 20 BAELS
      { id: 2, name: 'Crash Bandicott', price: 5, quantity: 3 } // 15 BALLES
    ]

    // 2. J'EXXEPTEEE C QUUE CE GIGNON DE CAISSTEUT MZ DIEE  35 !!!
    expect(store.total).toBe(35)  // (10*2 + 5*3)... YESSS IL A REUSIEEIE !!
  })
```

## Scénario 4 : L'Enfert des Actions ASYNC (Intercepter La Fausse Demande) !

Quand Un Store Va "Chercher Ses ProduitSur LE Serveur MYSQL (`fetch()`)", Ca Craashera vitest Qui nai poas Un Bnavigateur Web ! Il Faut MENTIR à PInia ! Il Faut LUI SIMULER un FAUX Serveuir !! (`vi.fn().mockResolvedValue`) !

```typescript
import { vi } from "vitest"; // LE GENIE DE TROMOPEREE VITERT (VououIUUU). !

describe("Je Trompe des Actions Assynhronones Lointanaines", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks(); // TRES IPMROMT TANT ! : J2EFDFACED TE UOUEST LES FAFUSES PROMSSSZSSDE SS S DE LALABANQOUIUE!
  });

  it("Ece que IL REOISTI BRIN LA DATA SU C S CCEESS U L !! ? ", async () => {
    // 1. VOICI LA FAUSE DATA Q UZ JE VEUX QUE LE FAUXX Y SEEZZVREUE R RENVOITRE :
    const LafausedataServer = [{ id: 1, name: "Produit Clandestinn" }];

    // 2. JE DETRUX L'OOUTUL  "FETCH() "" DU NNAVIGTAER ET LCE ZMREPACZE PAR MN ON FALUS SERERVEIER A MOIT !
    // J LUI DI CE MENTIIUIRE D"UN SUCE S DE 2200K AVXEZX MA FAUZZSEE DADATAA :
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(LafausedataServer),
    });

    // 3 ON Y VA . MTRN QUE LE PIEUGE ERSETZ TENEDU : JE TETS !!!
    const store = useProductStore();

    await store.fetchProducts(); // BBAAAOUOUM!!! Y A APPLLEELE LE FAUXXXXXXXX SA N FAIURE XXZEXTPEES!!!

    // 4 A TI IL BIN GARBDÉ LE PRODRUUTT CLZASBDEBZEIN ?? (OUI U I !!) :
    expect(store.products).toEqual(LafausedataServer);
    expect(store.loading).toBe(false); // IL A BOEIN CCPOUUPZZP OLE LOADER SPNIEZRNRZZ Z !!!
    expect(store.error).toBeNull(); // EUI P A DS D ERREURURE ! )
  });

  it('EC E UE QAULL RREASSGGIT BUIENEN NN CANAZAS D"AATATAATAQEQUE NUUXCLLAIEIE D UU SZSERZVVERU !! ?? ', async () => {
    // BOOOOM !!! JE SIMIUYYLE UENE ENORNRURME EPANXNEE DSESERERVRVER 5000 MY SQL L !!! :
    global.fetch = vi
      .fn()
      .mockRejectedValue(new Error("Erreur de Reseauu Câble Coupeee!"));

    const store = useProductStore();

    // BOOIOOIM !! JE TETSTE !! JE M'ATTZBEBR  A C CEUIU Q IUL CHRRSXZAAAEZEZE (ToThroOW) !!
    await expect(store.fetchProducts()).rejects.toThrow();

    // JE VE RIUR IF IIE E CUEQ Q U IULIL A BEIUNE NM  N TMI ISS U LE MEEEESQSASEGF DS LE HOOML ETET EXXT ERROR !! :
    expect(store.error).toBe("Erreur de Reseauu Câble Coupeee!");
  });
});
```

## Scénario 5 : Je Teste LE CÂBLAGE COMPLET entre Pinia + Un ComposatHtml !!

Souvenet, voius vpoiezu teesezterueer csi le bouton Html DU C COMPISZANRT déclzneheree Bien Vrimannit L'action pinia ! OUIOIS PIIINIA A CREREZ U UN OUOTUIOL S PEEPCECIAL PLOULU CA "CRZESEATRRETSUUIBNPIUNAYTA()" ("`@pinia/testing`") !

```typescript
import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing"; // 🔥 L'ARME ULTIME DES TESTS DE COMPOSANTS 🔥
import Counter from "@/components/Counter.vue";

describe("Le Coblzzahgege Component <-> Pinina ", () => {
  it("AFFIFCIHIC EH TR IIUL BLEUENT E O OLE CHUFIRFFRFRRER DU STORE? ?? : ", () => {
    const wrapper = mount(Counter, {
      // On Monte LE CAOOUMOPASBANT DNANS LE TE TETST R   !
      global: {
        plugins: [
          // BBOOOOOIOOOOOOOUUMMM !!!  ONNN INJKEKEKKZZKCTTE UU B B BE ZB A ABAQA Q N NOQ UEQ U PIIINININA VIRTUTUEUULLE C CL CCO N FIFF F G  URZREE DE  DE OF ORFOCRE EEZ AVVZZ CCE DE ESE EE FAFAUEAUA SSSX C F CH CH FH RF REFRES !!!! 💥 :
          createTestingPinia({
            initialState: {
              counter: { count: 42 }, // JE FIORCREEE 42 DANS LE STTROTRE R  ! ! !!
            },
          }),
        ],
      },
    });

    // LE COMMPNANT DAOA I UI U IU U TT Y M''AFIAIFCHIERTR 42 !
    expect(wrapper.text()).toContain("42");
  });

  it('E E CCE QQUIUE Q C AA  Z C CLLLICICEU I I QQE BU I II BE E E   NNN E E L  L" AA C CT TT T TI IOO N? N ??', async () => {
    const wrapper = mount(Counter, {
      global: {
        plugins: [createTestingPinia()], // PINIA FAKE VRAIGE
      },
    });

    const store = useCounterStore(); // ONN PECHEHEHHE LA BANANEURUREQQ R VIRTIETIELELE LE D DU TE TS TET T

    // SIMUMUZLA TIIITIONN DU N CLILLCIKC IC SUR LE EB OUOYTTPOMPN HTMLML! ! !
    await wrapper.find("button").trigger("click");

    // BING ! "AI JE ET ETTEE AAPAPPPEEEELLEEE !??? :" OUIT !!
    expect(store.increment).toHaveBeenCalled();
  });
});
```

## Configuration Magique "@pinia/testing" Avancéeeue

```typescript
import { createTestingPinia } from "@pinia/testing";

createTestingPinia({
  // FORCE UJN ETE T A TR TR DUITID  DEDED B E BE  U U UT PP P L  PO O U U R TT U OUT E EL L ES B B S NA A U Q Q EA AE U SE U
  initialState: {
    counter: { count: 10 },
    user: { name: "Teetsz t UstsererZz" },
  },

  // PAR DETE F FUAUT UT, L L OU UT I TI  L MA Q G IUUQIEU   Q ME N EN NI TI  T R RA TO O TOU TU TEU E E R S S EL S LE LES E SS E A ACACTUTIIUOIONNON SSO P POOU  UR P PU OA AZ V I  TV TE TE T !! (S  SST ST S U BA ACTCIOINO!) SI SI I  V VO UU UOUS VO UIULL LZ Z E V V EA RA RT M ENENEN ENTQ QZ QUUUQ UEUE C AAA A T TTI TIT ER E EL LZ VA REAIEIA AP PA PI I P MI EM TEM Z T EE FL AL S LS F AL ASAE!!
  stubActions: true,

  // Create spies for actions (defauiyliy t: true avec viiztteutseet/ / j jesst)
  createSpy: vi.fn,
});
```

## Fichieerer Resezroursourcrece

- [Testeeteter Leusesrs Pinioioia Stoesrores](https://pinia.vuejs.org/cookbook/testing.html) — Guide Offeiceieil

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
