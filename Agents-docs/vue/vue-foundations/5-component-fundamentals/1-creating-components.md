---
source_course: "vue-foundations"
source_lesson: "vue-foundations-creating-components"
---

# Créer et Utiliser des Composants (Creating Components)

Les composants sont les véritables briques de construction (Lego) des applications Vue. Ce sont des morceaux d'interface utilisateur (UI) réutilisables et autonomes, qui encapsulent leur propre structure HTML, leur propre logique JavaScript et leur propre style CSS.

## Pourquoi les Composants ?

Les composants vous permettent de :

- **Réutiliser les mêmes éléments d'interface** (des boutons stylisés, des cartes profil) partout sur votre site.
- **Organiser votre code** en le découpant en petits morceaux gérables au lieu d'un fichier monstrueux.
- **Encapsuler la complexité** derrière des interfaces très simples à utiliser.
- **Tester en isolation** chaque brique pour garantir la fiabilité de votre application.

## Créer un Composant

Créez simplement un nouveau fichier `.vue` pour chaque composant unique :

```vue
<!-- src/components/WelcomeMessage.vue -->
<script setup lang="ts">
import { ref } from "vue";

const isVisible = ref(true);
</script>

<template>
  <div v-if="isVisible" class="welcome">
    <h2>Bienvenue sur Vue !</h2>
    <p>Vous avez créé un composant avec succès.</p>
    <button @click="isVisible = false">Fermer</button>
  </div>
</template>

<style scoped>
/* Ce style n'affectera QUE cette <div> exacte, sans jamais casser le reste du site ! */
.welcome {
  background: #e8f5e9;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #42b883;
}

h2 {
  margin: 0 0 0.5rem;
  color: #2e7d32;
}

button {
  margin-top: 0.5rem;
}
</style>
```

## Utiliser un Composant (L'Importer)

Importez et utilisez le composant `WelcomeMessage` fraîchement créé à l'intérieur d'un autre composant Parent :

```vue
<!-- src/App.vue (Le Composant Racine / Boss) -->
<script setup lang="ts">
// On importe le fichier .vue !
import WelcomeMessage from "./components/WelcomeMessage.vue";
import UserProfile from "./components/UserProfile.vue";
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <div class="app">
    <!-- On utilise le composant comme une banale balise HTML personnalisée -->
    <NavBar />

    <main>
      <WelcomeMessage />

      <!-- On peut appeler le même composant plusieurs fois si on veut ! -->
      <UserProfile />
      <UserProfile />
    </main>
  </div>
</template>
```

Grâce à `<script setup>`, les composants importés sont **automatiquement disponibles et prêts à l'emploi** dans la partie `<template>`. Aucune configuration manuelle complexe n'est nécessaire !

## Règles de Nommage des Composants (Conventions)

### Noms de Fichiers

Utilisez **TOUJOURS le PascalCase** (Majuscule à chaque mot, sans espaces ni tirets) pour nommer vos fichiers de composants :

```
✅ UserProfile.vue
✅ NavigationBar.vue
✅ TodoListItem.vue

❌ userProfile.vue (Alerte : casse possible du serveur sur Linux/Mac)
❌ user-profile.vue
```

### Dans les Templates (HTML)

Vous pouvez utiliser le `PascalCase` ou le `kebab-case` :

```vue
<template>
  <!-- Les deux conventions fonctionnent techniquement -->
  <UserProfile />
  <user-profile />

  <!-- Le PascalCase est cependant HAUTEMENT RECOMMANDÉ aujourd'hui car il permet de faire 
       la distinction instantanément avec les balises HTML de base (comme <header>) -->
  <NavigationBar />
  <TodoListItem />
</template>
```

### Des Noms Multi-Mots (Toujours)

Utilisez **toujours** des noms composés de plusieurs mots pour éviter tout conflit futur avec de nouvelles balises HTML standard :

```vue
<!-- ❌ MAUVAIS - Pourrait entrer en conflit avec les normes HTML5/HTML6 -->
<Header />
<Footer />
<Button />

<!-- ✅ EXCELLENT - Définitivement des composants personnalisés (App ou Base) -->
<AppHeader />
<AppFooter />
<BaseButton />
```

## Organisation Type des Composants (Architecture)

Organisez vos composants dans une structure de dossiers très logique (Dossier principal : `src/`) :

```
src/
├── components/
│   ├── common/           # Composants bêtes et génériques (Boutons, Inputs, Cards...)
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   └── BaseCard.vue
│   ├── layout/           # Structure globale de l'UI (Header, Footer, Sidebar...)
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   └── AppSidebar.vue
│   └── features/         # Composants liés à des fonctionnalités métiers précises
│       ├── UserProfile.vue
│       ├── ProductCard.vue
│       └── CommentList.vue
├── views/                # Un composant = Une Page web entière de votre site (Routage)
│   ├── HomeView.vue
│   ├── AboutView.vue
│   └── UserView.vue
└── App.vue               # Le composant Racine Absolue (Qui lance l'App)
```

## Les Balises Auto-fermantes (Self-Closing)

Si un composant ne nécessite aucun contenu supplémentaire imbriqué entre ses balises, utilisez systématiquement l'auto-fermeture `/>` :

```vue
<template>
  <!-- ✅ EXCELLENT - Propre et professionnel -->
  <UserAvatar />
  <LoadingSpinner />

  <!-- ❌ Très laid et visuellement polluant -->
  <UserAvatar></UserAvatar>
</template>
```

## Exemple Pratique : Des Composants Imbriqués

Construisons un système de fiches (Cards) très simple à utiliser :

```vue
<!-- src/components/BaseCard.vue -->
<script setup lang="ts">
// Ce composant encapsule juste le design CSS d'une carte blanche avec une ombre
</script>

<template>
  <div class="card">
    <!-- L'élément magique natif <slot> dit à Vue : 
         "Le contenu passé par le développeur sera injecté EXACTEMENT ICI" -->
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}
</style>
```

```vue
<!-- src/components/UserCard.vue -->
<script setup lang="ts">
import BaseCard from "./BaseCard.vue";
</script>

<template>
  <!-- On utilise notre design blanc, on injecte nos balises JS natives dedans (dans le 'slot' donc) -->
  <BaseCard>
    <h3>Jean Dupont</h3>
    <p>Développeur Logiciel</p>
  </BaseCard>
</template>
```

```vue
<!-- src/App.vue -->
<script setup lang="ts">
// Le composant final importe la composition complète !
import UserCard from "./components/UserCard.vue";
</script>

<template>
  <div class="app">
    <h1>Membres de l'Équipe</h1>

    <!-- On affiche 3 superbes cartes (Puis on apprendra à les afficher dynamiquement) -->
    <UserCard />
    <UserCard />
    <UserCard />
  </div>
</template>
```

## Ressources

- [Bases des Composants](https://vuejs.org/guide/essentials/component-basics.html) — La documentation officielle pour débuter.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
