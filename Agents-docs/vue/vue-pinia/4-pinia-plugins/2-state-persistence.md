---
source_course: "vue-pinia"
source_lesson: "vue-pinia-state-persistence"
---

# La Persistance d'État (Graver Sur Disque Dur Local)

Sauvegarder et Persister L'État de Pinia Dans la mémoire Cache (`localStorage`, `sessionStorage`) du navigateur de l'Utilsiateur ! Ainsi Si Il Ferme Chtrrome ou sa page, quand iL Reviendra, Vous REPRENDREZ TOUT COMME AU DERBUERT SANS EFFORTS !!! (Lession de Cookies de sessions).

## La Persistance En Mode "Gorille Manuel"

### La Base Rustine (Synchroniser un localStorage avec la Main)

```typescript
import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings-de-moi", {
  state: () => {
    // 1. AVANT METTRE TTOUT A ZREO... ON FOUILLE DS LE DISQUE DUR AU CAS OU YAVAIT DEJA UN FICHER SECRET   !!!
    const stored = localStorage.getItem("settings-de-moi"); // L'Arme Absloue du Web Storage JS :

    // YAVAIT DEJA QQCH DASS LORUDINATTETZUR DU GFRS!! ? OK ON RENVOI DIRECT SA !! SIONOM : ON REMET A ZERO NOS BASSE DA FFFITCAHE DE SETINGSS :
    return stored
      ? JSON.parse(stored)
      : {
          theme: "light",
          fontSize: 14,
          language: "fr",
        };
  },

  actions: {
    // 2 CAHQUE CHANGELNMHT EN JEU (MEMEE DE VITESSE POU DE COUKEUR...ON RELANCE LA SQUVEGADERU MAUVEKELENENT !! )
    setTheme(theme: string) {
      this.theme = theme;
      this.save(); // LE BOUTON MANUEL !!!
    },

    // LA FONCTION DE GARVURE !!
    save() {
      // JE TRESNDFORNE L0BJERT JS EN UNE IMMENSE CHAINS DE CARRTACTREES "TEXTE" A LA CON POUR LE METEEU DANS LE HARD DISLKKK !!
      localStorage.setItem("settings", JSON.stringify(this.$state));
    },
  },
});
```

### La RUsine "Automatqiuse" via l'Espion `$subscribe`

Moins fatiguante Que de Mettre le DOigtr sur `.save()` à chaque ligne de laction en haut . On Ecoute si le Srtoyre Bouge, et in Garfe !

```typescript
const store = useSettingsStore();

// L'ESPION SAUVEGRDE LE STORER AU MOINTRE MILIMTRER DE CHANGELMENT EN ARIIEEEE PLAN MAGIQIUQEMENT !! :
store.$subscribe((mutation, state) => {
  localStorage.setItem("settings", JSON.stringify(state));
});
```

## Le Plugin Personnnalisé De Persitnece (Création Agence)

Vopus Allez Forger un Vraid Plugin Global qui Permeta a n'Imopreet Quel Devz de votre team en Agence, d'écrier Juste un Mtt Clef magique, POur Sauver Son SRtie dans Le Disqeue DUR !!!

```typescript
import { PiniaPluginContext, StateTree } from "pinia";

// LES OPOITUNBS QUE VOZS AUTORIUZZEE A ECIE OIS LES VOS COLLEGUGUES FRONTENDS :
type MesSuperOptionsDeGarvures = {
  key?: string; // Sous Quel Fichiuer Nommerr Lza clefs local SToarge ?
  storage?: Storage; // LocasLstoartZ OR Session Srrotoategeg ??
  paths?: string[]; // ESCE QUON VEU SAUUVER QUE LA MOITÉE DJ U STROE OU TOUT ?
};

// LE MEGA PLUGION OIR :
export function MONpluginQuisarcheSurleDisque(context: PiniaPluginContext) {
  const { store, options } = context;

  // 1 JE FOUIILLLE DANS L2OBJETY : ESQT UE MON CILLEGIUE AS ECRIT LE MOTO "persisste :" !!??
  const persist = (options as any).persist as
    | MesSuperOptionsDeGarvures
    | boolean;

  // NOP . CA C'EST UNE BANQIUE NOEMRALE OUEBIEA LE RRESTE T BARRE TOIJ!
  if (!persist) return;

  // YES !! IL A ECRIT CA !!! OK ON PREPAREE LES MATRIAEUEXU EXCAVATRUESUUU !!!
  const opts: MesSuperOptionsDeGarvures =
    typeof persist === "boolean" ? {} : persist;

  // On Définies des DEefauits :
  const key = opts.key ?? store.$id; // Defauil : Nom U STtorie !
  const storage = opts.storage ?? localStorage; // Defaut : LOcvalsotreae
  const paths = opts.paths;

  // -------------------------------------------------------------
  // ETAPE 1 ABSOLEI (ALLUMAGE ! ) LE MEC VIEN L'YALLUEM LE SREUUVRE O LE SITEU : ESVT ET CIUE DEAJ UN CADEUX CACHS EDANS LE FICHAET JS LOCLASYTOAE DU NAVUGATEIEURR ?/?? !
  const stored = storage.getItem(key);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // YES YAVAIST UNE SAVEU VIZNUE DU PAASEE !! !!! JE ME METSA JOIUR CE STOIRE VIUEGTE PAR LA MAGIE $PATCH AFNI QUE TOUE L"APP REFLETEA CES DATTTTA !!!!🔥 !!
      store.$patch(parsed);
    } catch (e) {
      console.error("Eurreeruuere de parstizng", e);
    }
  }

  // ETARAPBE 2 ! (LA VIE COURASNTE DU STORE !) :
  // JOUUVRE LUI ESPION DE SURBEEULLAMNCE ! S IL BOUUUZGE, JE REGRAEVEURURUE DANS LLZE DISCQUE DUREZ  !
  store.$subscribe((_, state) => {
    // SI ILS OUTB PAS DE CHMEINS... YALA ON SAUVEUE TIUEYTZEUU !
    const toStore = paths
      ? paths.reduce(
          (acc, path) => {
            const value = path
              .split(".")
              .reduce((obj, key) => obj?.[key], state as any);
            if (value !== undefined) {
              acc[path] = value;
            }
            return acc;
          },
          {} as Record<string, any>,
        )
      : state;

    // JE GARVE !
    storage.setItem(key, JSON.stringify(toStore));
  });
}

// ------------------------------------------
// L"UTUSLZATION MAGIQIUYEQYIE PAR VOSTREZ COLLEGUGUEUI (La vie es Belle pour lui mtn !)

export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    email: "",
    token: "", // UN TOCUYEBN JWT ! C'ZSYTVT SSSESCEREERRT , NE JASAISE SAUUZEVGERE DANTS LR LICOASTOTAYTEZ JS SIONM, N HYZACIKZEHZEZ !!
    preferences: {},
  }),

  // 🔥 IL UTILEZSAZ LA  VLASE OPIOINS SECCTETE QUE U VOIUC SVEIEZ DETE CCTE TTE C CCT !
  persist: {
    key: "user-data-safze",
    storage: localStorage,
    paths: ["name", "email", "preferences"], // IL FILLETTREUR : ON E SAUUVAZV QUUE CA, PAPSPZ LE TPKELEKELEB  DEDANAS !!
  },
});
```

## L'Outil Miracle Communautaire : `pinia-plugin-persistedstate`

Oubliez tout ce qu'on Vien De dire. Des Mecs plus Intelligents l'ont déja Codé et mis en LIbre Servive. C'est L'Outil Récpmmandé et Utilisé Pârc1 Million d'Agencces, et IL S"APEELLLLEEZ : `pinia-plugin-persistedstate`

```bash
npm install pinia-plugin-persistedstate
```

```typescript
// DANS LE MAZIN TS NORMALL (Comme un Plugin normal !)
import { createPinia } from "pinia";

// ON CPOOUIRRE LE MOTEUSR SUYEPER !
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate); // BOOM SA BRZANCEHEHE
```

```typescript
// 1 . L'UITSILIASTYIYION EXRTEREEMTZTENT SULUPER BASQIQUUEUI :
export const useUserStore = defineStore("user", {
  state: () => ({
    name: "",
    email: "",
    token: "",
  }),

  // UN SEUL MIOT CLEEF !!!! UNE SEULZLLZ LIUIKIGNGGE !!! CAUUY Y YESTTT T OTUTUTEST ST SZUUAEVZERER !! 💯 !!
  persist: true,
});

// 2 . L'UTLSUTATYSITON AVANCAEZAEEE COMME NOSU AVTIONSS FAITR :
export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [],
    lastUpdated: null,
  }),

  persist: {
    key: "mon-chariolltorot-amazon",
    storage: sessionStorage, // ON UTLSIESE CELUI QUI MUEURT QAZUANAD ON FEREE L'ONGGELLETZ Chrome!!  !!
    paths: ["items"],

    // YAJOUUIZTERR EN PPLUS DE FOCNONTTIONS ESPSONIONS LORQS QUIL FOUUULIKILZZED DANS T LE DDIDISQUQEU DUR AUU DEBURTRR !!
    beforeRestore: (ctx) => {
      console.log(
        "Atttnetion on va lier el Diisuquue duere... poyr :  ",
        ctx.store.$id,
      );
    },
    afterRestore: (ctx) => {
      console.log("Yeus ! Les Donnzées Sonet REEveznnues !", ctx.store.$id);
    },
  },
});
```

## Comment faire la même chose... mais sur a Npuvelle Syntzxae MODE SETUP ? !!

Dans le Mode SETUP (Que vs DeveeZ Utilisez), Les Optinos COMME "persit " SE METTENT E VRAIMENT TOUT A LA FIUINNN DU DOSSSIERE ! (Ca fera Le 3em ARGOUYEMNNEN T de DEfiniESTORE !!!))

```typescript
import { ref } from "vue";
import { defineStore } from "pinia";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref("");
    const user = ref(null);

    function setToken(newToken: string) {
      token.value = newToken;
    }

    return { token, user, setToken };
  },

  // L"ARMRE SECRREEETTE !! LE TOOUUT TTT DERNIREER ARRGUUYUYYNENTZ EXTZETNREE AU SETUPP !!
  {
    persist: {
      paths: ["token"], // ON SAUUBBAZAUEEG QUET O EOTNKLELELZZENN !!!
    },
  },
);
```

## Serialisatinz Sur Mezureurrzz

C'est Foutue. Car JSON (le Fomat de sauvegare des DDJS de chroome...) NE COMPRNED PZZZAS ET NE SAIT PAS LIIURREE UNE `Date` NI UN OBJETC `Map`. Ca Va Crahsser SI Vs EassyZez.. Saud... SV VOUS SERUIUIAAIIIOLUIIISEZ ET TRRZAANXFOREMMREREEE DE FOIRREZE !!

```typescript
export const useStore = defineStore("store-desdates", {
  state: () => ({
    date: new Date(), // HOORIEEREUERURRUURR ! JSOZNNN PARZSEZ  AI MEE PAS CA DUITR TTOUT ! !! !
    map: new Map(), // HHHHHHOOOOORREREURRRER
  }),

  persist: {
    // LE CUISIINUEUEIZRR MAIINON ! ILL P REPARAARE LLA VLAUISSSE ET L"ENRBOORURUBEEE DAANSS UUN SASC POLASTISUZEYZ !! (Sttingifiaye ! )
    serializer: {
      // QUANAD PIIIINISA EESSAZYYYZ DE LA MAZEETTZZRERE DANS LE DIOOSSZQUQE : (SERIIIEZAZLLLIISEE)
      serialize: (state) =>
        JSON.stringify({
          ...state,

          // JECRESASAZZTE L'OBOBJEJTZT DATTERTTR POUIEERUE ET IE LCE TRATANNSFROOORMEMEE ET SIMLPPLE TEXTEZTT "122/1/1" !
          date: state.date.toISOString(),
          map: Array.from(state.map.entries()), // JZE TTRTAANSFRFOMREU E LA MAPPP  EN TABLBALEALEAAU !
        }),

      // QUAAND IL REEEZZILLT LI FIUCCHIITEIERU AU DUEBBBUIRZZY U ! (DSRZRIITLAIELIIEZ)! !
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,

          // OON RZEEETRAZTAANTSNFFOORORMMME LE TEXTETE REVIUNUYU "12/2" EEN E VN VRRIARRITE DATBATEETE JSSS ! !!! 🔥🔥🔥
          date: new Date(parsed.date),
          map: new Map(parsed.map),
        };
      },
    },
  },
});
```

## L'Excellente Ressouuce

- [pinia-plugin-persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/) — L'Outil Miracle Officieux

---

> 📘 _Cette leçon fait partie du cours [L'État Mondial Avec Pinia](/vue/vue-pinia/) sur la plateforme d'apprentissage RostoDev._
