---
source_course: "vue-composition-api"
source_lesson: "vue-composition-api-provide-inject-basics"
---

# Les Fondamentaux de Provide/Inject

L'architecture Provide/Inject permet aux composants ancestraux de servir de grands "Fournisseurs de Dépendances" (dependency providers) globaux pour l'ensemble de tous leurs très lointains descendants. Ceci aide radicalement à éviter le cauchemar qu'est le "prop drilling" (la stupide cascade de passage de propriétés de relais à travers des parents/composants intermédiaires).

## Le Problème Architectural : Le "Prop Drilling"

```text
GrandParent (Possède le thème d'interface web)
    └─ Parent (Reçoit bêtement la prop thème pour la passer)
        └─ Enfant (Reçoit bêtement la prop thème aussi pour passer au suivant)
            └─ PetitEnfant (Utilise le fameux thème pour son Bouton !)
```

C'est désastreux : Chaque microscopique composant intermédiaire dans l'arbre doit déclarer inutilement dans son code propre des `defineProps` et passer la prop en tant qu'attribut au suivant !

## La Solution Divine : Provide/Inject

```text
GrandParent (Fournit son thème dans sa bulle Provide spatio-temporelle)
    └─ Parent (N'est même pas au courant des conflits)
        └─ Enfant (N'est même pas au courant non plus)
            └─ PetitEnfant (Injecte magiquement le thème directement depuis le grand espace)
```

## L'Utilisation Basique

### 1. Le Composant "Fournisseur" (Provider)

```vue
<script setup>
import { provide, ref } from "vue";

const theme = ref("dark");
const user = ref({ name: "Alice", role: "admin" });

// 1. Fournir de Simples Valeurs ('clé chaine Web' , et La Valeur ou la variable à partager)
provide("theme", theme);
provide("user", user);

// 2. On peut même Fournir à tout le monde des Méthodes d'Actions
function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
}
provide("toggleTheme", toggleTheme);
</script>
```

### 2. Le Composant "Consommateur" (Enfant Consumer profond)

```vue
<script setup>
import { inject } from "vue";

// On capture instantanément Les valeurs (On rappelle juste leurs Clé string précise)
const theme = inject("theme");
const user = inject("user");
const toggleTheme = inject("toggleTheme");
</script>

<template>
  <div :class="theme">
    <p>Bienvenue sur RostoDev, incroyable {{ user.name }}</p>
    <button @click="toggleTheme">Basculer le Thème Global Sombre</button>
  </div>
</template>
```

## Sécuriser nos injects avec des Valeurs Par Défaut

```vue
<script setup>
import { inject } from "vue";

// Injecter mais avec une bête valeur "Fallback" (Sauvegarde/Secours) absolue en 2nd argument !
const theme = inject("theme", "light");

// Injecter avec une belle de fonction d'instanciation (Factory function)
// Indispensable et Obligatoire pour créer par défaut des Objets lourds ou des Listes/Arrays Complexes `() => []`  !
const heavyDefault = inject("heavy", () => createExpensiveObject(), true);
</script>
```

## Fournir au Niveau Ultime : Globalement au Framework Complet ! (NuxtJs)

```typescript
// main.ts (Le Fichier le plus Haut : Racine JS Pure !)
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

// Fournitures GLOBALES ET TOTALES PURES DE L'APPLICATION
app.provide("appName", "Mon Super CRM Vue.js App");
app.provide("apiBase", "https://api.monsite.com/v2"); // Génial pour des endpoints globaux

app.mount("#app");
```

## L'Atout Majeur : Réactivité Merveilleuse de Provide/Inject !

Contrairement à des technologies concurrentes comme React Context, vos composants en Refs de Vue _Restent Magiquement Fluides et Réactifs_ en temps réel peu importe la profondeur d'UI :

```vue
<!-- Provider Parent hyper lointain -->
<script setup>
import { ref, provide } from "vue";

const count = ref(0);
provide("count", count); // Ref Complètement Réactif pour toute sa lointaine descendance !

setInterval(() => count.value++, 1000);
</script>

<!-- Consumer l'Enfant très profond de Niveau 15 -->
<script setup>
import { inject } from "vue";

const count = inject("count"); // Ce Ref Vue va muter TOUT SEUL O-TO-MA-TI-QUE-MENT dès la modification de ses lointains Aïeux !!
</script>

<template>
  <p>Mon Compte très distant : {{ count }}</p>
  <!-- Clignotera à l'écran et s'incrémentera ! -->
</template>
```

## L'Obligation de Sécurité Majeur : Fournir en Lecture Seule (`readonly`)

Vous devriez toujours empêcher férocement n'importe quel enfant de muter sauvagement à tort depuis son code sa variable "Fournie" globale ! :

```vue
<script setup>
import { ref, provide, readonly } from "vue";

const count = ref(0);

// 1. Fournir EXCLUSIVEMENT l'accès limités de vue magique (Lecture Seule `readonly` sécurisée)
provide("count", readonly(count)); // Crash immédiat DEV d'erreur si un enfant idiot tente le fameux:  `count.value++` !

// 2. Il faudra alors Fournir Séparément Une méthode/fonction "Contrante" stricte et maitrisée par NOS SOINS :
provide("incrementCount", () => count.value++);
</script>
```

## Architectures Pour Les Équipes en TypeScript Pur Industriels

Problème de l'inject simple : De base TS vous hurle dessus car le paramètre que l'on vient humblement capturer avec un `inject(str)` est défini nativement comme totalement Vide par erreur TS (`unknown / any`) !

### La Solution Majeure Vue 3 : Toujours Utiliser la folie TS des "Clés d'Interjection Symboliques" (Injection Keys)

```typescript
// Le grand Fichier à part 'keys.ts' global
import type { InjectionKey, Ref } from "vue";

export type Theme = "light" | "dark"; // Mon vrai typage complet customisé.

// La Formule Magique Absolue de Vue 3 (On crée simplement un "Symbol JS" typé abstrait !)
export const themeKey: InjectionKey<Ref<Theme>> = Symbol("theme");
export const toggleThemeKey: InjectionKey<() => void> = Symbol("toggleTheme");
```

```vue
<!-- ========== Le Super Provider Intact ========== -->
<script setup lang="ts">
import { ref, provide } from "vue";
// L'importation des Grandes Clefs Magiques Symbol.
import { themeKey, toggleThemeKey, type Theme } from "./keys";

const theme = ref<Theme>("dark");

provide(themeKey, theme); // Tout est sécurisée et typé par magie sans forcer
provide(toggleThemeKey, () => {
  theme.value = theme.value === "dark" ? "light" : "dark";
});
</script>

<!-- ========== Le Petit Consumer Heureux ============ -->
<script setup lang="ts">
import { inject } from "vue";
import { themeKey, toggleThemeKey } from "./keys";

const theme = inject(themeKey)!; // Autocomplétion folle et dev heure : L'IDE sait maintenant que c'est un pur Ref<Theme> garanti a 100% !
const toggleTheme = inject(toggleThemeKey)!; // Fonction Typé complète avec autocomplétion : () => void garantie!
</script>
```

## Le Quand ? Quand Faut-il Vraiment Utiliser un Modèle Provide/Inject ?

✅ **D'Excellents Cas d'Usage en Entreprise** :

- Des Thèmes CSS Globaux UI d'Ecrans
- La Langue Actuelle globale (Locale i18n d'internationalisation) de la webApp entière
- La grosse partie Authentification (Connexion / Role) et Profil d'un Utilisateur
- Concevoir astucieusement une immense UI Framework (Libraire de Gros Composants HTML) où Parent et enfants se parlent secrètement de pair ! (Exemple: Créer des onglets Vue : Une Balise Père <Tabs> qui "fournit" magiquement son état à ses dizaines de tag fils intérieurs <TabItem>)

❌ **A Ne Surtout JAMAIS Utiliser Par Facilité pour :**

- De toutes petites communications basiques très simples de Parent-à-Fils (Utilisez les simples Props, c'est fait pour ça !)
- Tenter à tord de se faire un gros et immense "Magasin de gestion d'état central très structuré" pour la maintenance lourde (Il PFAUT utiliser une vraie librairie taillées pour : **Pinia** !!).
- Communiquer entre deux composant simples "Frères" (De même Niveau HIérarchique, côte-à-côte).

## Ressources Pour l'Architecture

- [Documentation sur Provide/Inject (FR complète)](https://vuejs.org/guide/components/provide-inject.html) — La Documentation Officielle Absolue de la coreTeam pour le Pattern Provide.

---

> 📘 _Cette leçon fait partie du cours [API de Composition & Composables](/vue/vue-composition-api/) sur la plateforme d'apprentissage RostoDev._
