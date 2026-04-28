---
source_course: "vue-router"
source_lesson: "vue-router-nested-routes-basics"
---

# Comprendre les Routes Imbriquées (Nested Routes)

Les Routes Imbriquées vous octroient le don inestimable de bâtir des UI grand format. Une très grande partie de l'écran restera fixe et de "Marbre" peu importe la navigation (ex: Menus Latéraux, En-têtes, Bannières Profil), pendant que seule une toute petite fenêtre vitrée interne au milieu de la page fera défiler dynamiquement le contenu en dessous !

## Le Schéma Explicatif

```text
/user/123           →  Gabarit de base du Dashboard User   +   Contenu enfant (Accueil du User)
/user/123/profile   →  Gabarit de base du Dashboard User   +   Contenu enfant (Page d'Edition de Profil du User)
/user/123/posts     →  Gabarit de base du Dashboard User   +   Contenu enfant (Mur des Posts du User)
```

Toute le squelette externe Mère gigantesque de l'Application Vue.js (Barres Systèmes, Menus, Asides) restent fixe. C'est magique.

## La Recette de Base

```typescript
// router/index.ts
const routes = [
  {
    path: "/user/:id",
    component: UserLayout, // LE GRAND GABARIT MERE QUI CONTIENT LA TOUTE PREMIÈRE <ROUTER-VIEW> !

    // SES BÉBÉS (Ce sont eux qui atterriront dans la 'router-view' de 'UserLayout' !)
    children: [
      {
        path: "", // Matchera l'URL exacte racine : /user/:id !!
        name: "user-home",
        component: UserHome,
      },
      {
        path: "profile", // Matchera l'URL cumulée : /user/:id/profile !!
        name: "user-profile",
        component: UserProfile,
      },
      {
        path: "posts", // Matchera l'URL cumulée : /user/:id/posts !!
        name: "user-posts",
        component: UserPosts,
      },
    ],
  },
];
```

**⚠️ Alerte Syntaxe Vitale** : NE METTEZ Surtout JAMAIS de Slash Barrière `/` Devant les chemins enfants !! Un Slash ramène à la racine Universelle du domaine (Site.com/). Les bébés enfants n'en ont pas ! Ils se cumulent à leurs pères (`'profile'`).

## Le Composant Mère qui reçoit l'Ovule : `Route-View` Enfant :

```vue
<!-- UserLayout.vue (Ceci est un Gabarit Maître) -->
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const userId = computed(() => route.params.id); // Sera dispo pour TOUS LES SOUS ENFANTS de par LA BARRE !
</script>

<template>
  <!-- Le Squelette Geant Mère : -->
  <div class="user-layout">
    <header class="h-96 w-full flex">
      <h1>Bienvenue sur Le Portail de Gestion du Mec N° {{ userId }}</h1>
      <nav>
        <router-link :to="{ name: 'user-home', params: { id: userId } }"
          >Acceuil</router-link
        >
        <router-link :to="{ name: 'user-profile', params: { id: userId } }"
          >Modifier Son Profil</router-link
        >
        <router-link :to="{ name: 'user-posts', params: { id: userId } }"
          >Voir ses Posts</router-link
        >
      </nav>
    </header>

    <main class="au-milieur-de-lecran">
      <!-- 🔥 LA ROUTER VIEW DES BÉBÉS !! 🔥 : -->
      <!-- TOUT LE RESTE DU GROS GABARIT HAUT  RESTE DE MARBRE ET BOUGE PAS :   -->
      <!-- C'EST ICI SOUS CE TROU QUE VONT SE SUCÉDER A 100 A L'HEURE LES PAGES : Home.vue... Profile.vue.... Posts.vue !!!! -->

      <router-view />
    </main>
  </div>
</template>
```

## L'Inception Folle : L'Imbriquation Multi-Niveaux Infini !

C'est ainsi qu'on bâtit le panneau Administration de Facebook ou Salesforce ! Des Pères, Qui Ont des Sous-Pères, Qui ont des Sous-Enfants :

```typescript
const routes = [
  {
    path: "/admin",
    component: AdminLayout, // GABARIT MERE ADMIN (Menu Gauche Admin)
    children: [
      {
        path: "users",
        component: AdminUsersLayout, // 2EME GABARIT FRERE (Menu Des Sous Options de La Page Utilisateur Admin !)
        children: [
          { path: "", component: UserList }, // Niveau 3
          { path: ":id", component: UserDetail }, // Niveau 3
          { path: ":id/edit", component: UserEdit }, // Niveau 3
        ],
      },
      {
        path: "settings", // Frere de 'Users'
        component: AdminSettings,
      },
    ],
  },
];
```

## L'Astuce Vitale du "Chemin Vide `''`"

Par défaut un dossier est Vide. Utilisez le _string vide_ pour dire _Qui_ doit apparaître lorsqu'on tape exactement sur le nom de Dossier / Pere ! :

```typescript
{
  path: '/dashboard',
  component: DashboardLayout,
  children: [
    {
      path: '',  // CELA VA EXPLOSER A LA FACE DE L'ECRAN des qu'on ira visiter : monsite.com/dashboard/ !!!
      name: 'dashboard-overview',
      component: DashboardOverview
    },
    {
      path: 'analytics', // Ca explosera à monsite.com/dashboard/analytics
      component: Analytics
    }
  ]
}
```

## Architecture Fantôme "Sans Parent" (Le Dossier Muet)

Vous VOULEZ un Regroupement Logique de 4 fichiers ensemble dans l'URL pour vos visiteurs `/settings/...` , MAIS par-contre Vous ne voulez PAS d'un Gabarit Layout de base commun et Fixe à tous qui englobe le bazarre ! :

```typescript
{
  path: '/settings',
  // REGARDEZ : Component est volontairement ABSENT ! Par Conséquent ce mot "settings" n'est plus qu'un "Dossier Logique Fantôme"
  // Ses 3 de Bébés iront rebondir et se cogner s'afficher directement à L'ETAGE DU DESUS dans la Pute Route-View de App.vue Principale !!
  children: [
    { path: 'profile', component: ProfileSettings },
    { path: 'account', component: AccountSettings },
    { path: 'notifications', component: NotificationSettings }
  ]
}
```

## Extraire l'ADN Du Parent !

Les composants Bébé peuvent espioner en douce la barre URL du Parent :

```vue
<!-- Fichier Bébé: UserPosts.vue (enfant caché dans dans la route /user/:id/posts) -->
<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
console.log(route.params.id); // OUI OUI ! Bien que ce soit dans l'URL Du Père "/user/2", le Bébé y a Totalement Accès magiquement !!
</script>
```

## La Redirection Vers le Bébé Préféré

Si on tente de fouiner directement sur Monsite.Com/User/2... Je te force de force a te pointer vers son bébé fille "/profile" ! :

```typescript
{
  path: '/user/:id',
  component: UserLayout,
  redirect: { name: 'user-profile' },  // BOOM DÉGAGÉ DIRECT SUR LE SOUS-ENFANT !!
  children: [
    {
      path: 'profile',
      name: 'user-profile',
      component: UserProfile
    },
    // ...
  ]
}
```

## Ultra-Bourrinage de Niveaux : Les `Router-View` Multiples avec Noms de Codes !!

Attachez votre ceinture. Vous POUVEZ ordonner à Un unique Pere `<DashboardLayout>` de charger d'un coup 3 SOUS FICHIER `.vue` DIFFERENTS dans 3 ENDROITS DIFFERENTS DE LA MEME PAGE en un seul clic !

```typescript
{
  path: '/dashboard',

  // ATTENTION AU S : componentS !!!
  components: {
    default: DashboardMain, // Le Trou standard
    sidebar: DashboardSidebar, // Le Trou "Maison Menu"
    header: DashboardHeader // Le Trou pour  L'Entete !
  }
}
```

```vue
<!-- Et dans L'UI ça donne CETTE DInguerie  : -->
<template>
  <router-view name="header" />
  <!-- Va Aspirer Fichier DashboardHeader.vue !! -->

  <div class="layout h-screen flex">
    <router-view name="sidebar" />
    <!-- Va Aspirer fichier DashboardHeader.vue !! -->

    <router-view />
    <!-- Le standard Vide : Va aspirer DashboardMain.vue par défaut !! -->
  </div>
</template>
```

## Très Bonnes Ressources

- [Les Routes Imbriquées](https://router.vuejs.org/guide/essentials/nested-routes.html) — La doc du grand dieu Evan You.

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
