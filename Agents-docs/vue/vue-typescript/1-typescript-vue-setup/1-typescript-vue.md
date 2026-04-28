---
source_course: "vue-typescript"
source_lesson: "vue-typescript-why-typescript-vue"
---

# Pourquoi Marier TypeScript à Vue.js ?

TypeScript N'est pas un Langage. C'est du Javascript Normal qui n'est **COMPILÉ** dans un Editeur que si Vous N'AVIEZ PAS FAIT D'ERREUR HUMAINE ET DE CACA. Il attrape les bugs 1 milliseconde après que Vous Les Ayez tapés... Au lieu Des les découvrir en Production 2 mois après par les clients !! De Plus Vue 3 a été entièrement ré-écrit dans ce langage ! Son Support est merveilleux !

## Les Pouvoirs de L'Agence Web

### 1. Attraper Le Bug Au Vol Avant La Compilation !

```typescript
// LE VIEUX JAVASCRIPT VANILLA - L'Erreur Silencieuse de Merde.. :
const user = { name: "Alice", age: 25 };
console.log(user.email); // SILENCE RADIO... Retourne  "undefined"... MAIS Ca finira en Bug Fatal aillieurs !

// L'ARMURE TYPESCRIPT ! - L'Erreur qui t'explose au Visage Devant les Yeux :
type ProfileUser = { name: string; age: number };
const user: ProfileUser = { name: "Alice", age: 25 };

// ALERTE ROUGE SOULIGNÉE DANS VS CODE !!! "PROPRIETE 'EMAIL' N'EXISTE MAS SUR L'OBJET USER !!!!!"
console.log(user.email); // ❌
```

### 2. L'Aide à L'Écriture (L'Interligence Artificielle Gratosite TS)

- En tapant `user.`... Vscode Affiche Automatiquement Toute les variables Disponibles : `name` et `age` SANS AVOIR BESOIN DE LES CHERCHER !
- Clic Doit : "Aller à La Definition" pour voir ou ce type Extrate a Ete créer !!
- Clics DOit : "Trouver Tooutes les References" pour voir les 35 Fichiers ui utilisent cette Varible avant de vouiOir La supprimeer !

### 3. Le Code Devient Sa PRPOPRE DONUMENTATION INTERNTE !!

Plus Besoin de Lire des Livres POur comprendre comment Foonctionne Le site d'Une Aute Agence !! Lisez Ses Cadrages TH !!! :

```typescript
// TOUT DEVIENT EVIDENT !!!!
type ParametresProduit = {
  id: number;
  name: string;
  price: number;
  // LE DEV D'IL Y A 1 ANS ME DIT EXACTEMENT CE QUE J'AI LE DROIT DE MEETTTRE ! :
  category: "PC" | "Vetements" | "BOuffe";
  inStock: boolean;
};

// LA FODCNTIOUNN ME DEOT QUE JE DOIUSTY METRRE CE PROEUDTT DS LS E PARAEME T T E T !  E T QUEE UE EE LLS SR ERTTITIT E ET X T TE E R R RI A!!! :
function formatezLePrix(product: ParametresProduit): string {
  return `$${product.price.toFixed(2)}`;
}
```

### 4. Le Refactoring Devient Inratable ! (La Modification en Masse Sans Peur !)

```typescript
// SI UN JOUR LE PATTON DE L'AGENCE VEUT CHANGER LE NOM DE LA VARIBALE  'name' en 'title'
type UnPostDeBlog = {
  title: string; // je changes En 'Title' !!
  content: string;
};

// BBOOOOM !!! IMMÉDIATEMENT: TOOTS O US L ESES  3000 FICHIEHIEIEIRSR VUE JS DEU SIPSTE KI UTI UTUILSILISEZATNT ENCCOREE "name"  VONTONTT S SEU LOULILGNNEEER RR RR OOUGU G E E !!
// VOUSS A A LV VE VLEZ PLLULU S   S QUQA C CCLLILIQIQIQUEQU UER R E ET E T T  C COO RR RO  RI RI IEEGEGEEEI R U  NU PA PR P AU N  N N !
// Le Site Ne compilera jamais Tant que que ca cera Pas Reparé ! Fini les Angoisses "Oh mon dieu SI je touches À ça, Vais-Je Casser Un Truc Que J'ai Pas Vu ?" !!!!
```

## TS et Le Moteur Vue 3

Avec l'Outil "Script Setup", Vue 3 Est Taillé Pour le Tyescript :

- Le Navigateur VSCODE Pense directement Dans le HTML VUE (`<template>`) !!! Il Souligenenra meme les Ereur DAans le HU T ML L !
- Les Props Et les Emits sont SOiulignés ! Ets Secures !

## L'Initialisation VUE + TypeScript

### Le Création Magique De CLI:

```bash
npm create vue@latest mon-super-projet
# OUI !!! SELECTIONNER " TYPESCRIOIPPPT TT : OUIOU ! " !  DANS Le MenuUU !!!!!
```

### La Mano-Construction :

```bash
npm install -D typescript vue-tsc @types/node
```

### Le Cerveat : `tsconfig.json`

Le Fichier qui Dicte Les Règles Du Coder !! (Sont ElleS Dures Ou Souuuples ?) :

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true, // RULES  S T T TO TIT U TE SSSS MA AXIXMIMI M I  MM MA LE ESS !!!  (La Mort De S FaibileEsSsES ) ! !
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "skipLibCheck": true,
    "noEmit": true, // TS N NE TR TANARASFFO F RO RM M E R AA  AP PAS PA E LN N J JJ JS ! S !!
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
  "exclude": ["node_modules"]
}
```

### L'Intégration Vite

```typescript
// vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()], // VIA TT TE SAASI TT A PAARARFFAIFAIRIRTMEENTEN  G G GLUUTETIERIE R T T TS !!
});
```

## IDE Setup (Configuration Externe De VSCODE / CURSOR) !

Les Plugins Oubloigatriore a isntallser POur Quie Vosrtree Cooded Tappée E SOU ULL LL G G L I LG GN GGN EE E : E::!

- **Vue - Official** (Avantr Il C apA PEPE PE LE AIAI I T "Vooooolala ala aar rr") - Moteur Vue de C L CI L N N N !!
- **TypeScript Vue Plugin** - CA CO ON NF O O DI ND L L ES DE DD D DU UX M X OM MO NT NDN T E T S P O O UR VS SV SOC OC D CD O DO O EE D D E DE E DE S U O SO S U I LI L G G N N E E R RR E E R E S R S E SR EE ER ERE EERR R ! !

## Le Lance Flamme : `vue-tsc`

TypeScript (`tsc` natif) **NE CONNAIT PAS L'EXSTINETST E S NC EE N C E ET EL EA Z V Y R RE EA X I L L FE OO FM RR AR T T F O OF MR EM R T T N N N P P E EE PE EE S T S T N E NE ON NO D DE D DE V V U UU U E E ** !!! Si vvousU SLZ La n ce ecZ, TS Vous Carchacheara au Visaiszzzg e !! C"est pOo i r c aa a uue l a F F i r me e e e V F U UE E a a Cc e r err ere eeéé SO NOSN P PR RP RP OP PPE ER R M OOTTE EE EE E RR T TSS : "Vue-Tsc " !!!

```bash
# LAL NA C NC CE CE EE RE LL L L   "  V " E VE RR R IR I T FI IC AC CA AT TA TI TI II OO N "  N DE DES S SS B U BG BG S G G!
npx vue-tsc --noEmit

# DANS LE LE LE PA  PA PAC CA AK KA KG G GE E E. OO J J JO JS S S S S O O ON N
{
  "scripts": {

    // LE COMAMAM MA N D NE PO DO U R Z C C O R HR ME ER ECHCHER C LL EI E I E DE BS B UG GS GS   !
    "type-check": "vue-tsc --noEmit",

    // JE MME MTETS S P T T O U TO U RT RJ O JO U R U V R SV S U V V U E EUT TS TS SS EC -C N O NE NO OMIIEI T  DE DD EA AV VA AN NT TLT LL T T T EE " B BI IUI U I LI ID D" D !!! C COO MO MT MO M SE E S EA Z C CA CA B B BU UL IL IL LD DD DD N D E NE AR I AA IIM MAAI  AISIIS  S SS I  I I L LIIY Y A AY U AY UIUN  NB UB BG UB UGB BBT TY PY Y YP PT PE!!!
    "build": "vue-tsc --noEmit && vite build"

  }
}
```

## Plus Loin Dans La Galaxie

- [Le Support VUE + TypeScript Officielle](https://vuejs.org/guide/typescript/overview.html)

---

> 📘 _Cette leçon fait partie du cours [TypeScript Et Vue.js](/vue/vue-typescript/) sur la plateforme d'apprentissage RostoDev._
