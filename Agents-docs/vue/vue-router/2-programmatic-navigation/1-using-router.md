---
source_course: "vue-router"
source_lesson: "vue-router-using-router"
---

# Piloter la Navigation avec `useRouter`

Bien que la balise HTML `<router-link>` soit fabuleuse pour la navigation basique, vous finirez inévitablement par devoir déclencher une redirection logiciellement (ex: redigier l'utilisateur juste APRES que son login et son mot de passe API soient validés).

## La Différence Piège : useRouter vs useRoute

```typescript
import { useRouter, useRoute } from "vue-router";

// LE MOTEUR (Action) : useRouter() - Il sert à AGIR et NAVIGUER (Contient les fonctions push, replace...)
const router = useRouter();

// LE THERMOMETRE (Lecture) : useRoute() - Il sert UNIQUEMENT À LIRE la barre actuelle réactivement (Contient les Params, les Querys...)
const route = useRoute();
```

## Le Pistolet Principal : `router.push()`

Vous expulse violemment l'utilisateur vers une nouvelle URL, **En L'AJOUTANT à l'Historique de son Navigateur** ! (Il pourra cliquer sur la Flèche <- "Précédent" de son Chrome pour revenir en arrière).

```vue
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

// 1. Navigation en Dur Lente (Risque de casse si l'URL change)
function goHome() {
  router.push("/");
}

function goToUser(id) {
  router.push({ path: `/users/${id}` });
}

// 2. LA SEULE ET UNIQUE BONNE PRATIQUE : Nom de Code Magique !
function goToUserNamed(id) {
  router.push({ name: "user", params: { id } });
}

// 3. Navigation avec des Paramètres de filtre (?q=vue)
function search(query) {
  router.push({
    path: "/search",
    query: { q: query, page: 1 },
  });
}

// 4. Cibler des Ancres de pages Web ID (#anchor)
function goToSection() {
  router.push({ path: "/docs", hash: "#installation" });
}
</script>
```

### Le Push vous donne une Promesse JS Asynchrone !

Le routeur peut prendre du temps... ou échouer si un gardien API bloque l'accès :

```typescript
async function handleSubmit() {
  await saveData(); // Enristrement lent API

  try {
    await router.push("/success"); // Pause JS jusqu'à ce que la page soit vraiment affichée !
    console.log("Victoire ! Me Voila bien arrivé sur la page Succès !!");
  } catch (error) {
    // HORREUR : Un Douanier "Navigation Guard" m'a fusillé sur la route (ex: Token Expiré !)
    console.error("La route est bloquée:", error);
  }
}
```

## L'Exécuteur Silencieux : `router.replace()`

Exactement pareil que `push()` **SAUF QU'IL DETRUIT L'HISTORIQUE PRECEDANT** : Le visiteur ne pourra JAMAIS APPUYER SUR LE BOUTON <-- "Précédent" DU NAVIGATEUR POUR REVENIR !!

```typescript
// LE MEC VIENT DE SE DÉCONNECTER !!! ON DETRUIT SA TRACE SINON S'IL FAIT FLÉCHE GAUCHE IL REVERRA SES DONNEES CACHÉES !!!
router.replace("/login");

// Option alternative équivalente
router.push({ path: "/new-page", replace: true });
```

**Scénarios Industriels Cibles** :

- Le Bouton "Déconnexion" (Log Out)
- Le Bouton Valider mon Achat (Mieux vaux ne pas faire arrière de le Re-Valider 3 fois et vider sa carte bleu !)
- Les Redirections Clandestines automatiques .

## La Machine Temporelle : `router.go()`

Promenez-vous Dans les méandres de l'Historique système de Navigation !

```typescript
// Identique au bouton <- Flèche Arrière de Google Chrome !
router.go(-1);

// Identique au bouton -> Flèche Avant Chrome
router.go(1);

// Revient de 3 pages en arrières sec !
router.go(-3);

// Les Petits Alias Mignons !
router.back(); // Pareil que .go(-1)
router.forward(); // Pareil que .go(1)
```

## Modèles Concrets Quotidiens en Agence

### 1. Sauvegarde d'un Formulaire Création

```vue
<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({ name: "", email: "" });

async function handleSubmit() {
  // Submit Button...
  const result = await api.createUser(form); // Réponse Lente API

  // Succès ! => Je catapulte d'autorité le mec Mignon :
  router.push({
    name: "user",
    params: { id: result.id },
  });
}
</script>
```

### 2. Le Filtrage de Douane Mixte

```typescript
function proceedToCheckout() {
  if (!isLoggedIn.value) {
    // HORS DE QUESTION TU AS PAS PAYÉ ! DEVIES !
    router.push({
      name: "login",
      query: { redirect: "/checkout" }, // Fourberie Ultime: Je grave dans l'URL de connexion ou le mec voulait aller initialement à la base !
    });
  } else {
    router.push("/checkout"); // Oh pardon Mossieur !
  }
}
```

### 3. La Célèbre Redirection POST-Connexion !!

```typescript
async function login(credentials) {
  await authStore.login(credentials); // Vérifié

  // Je lis ma Fourberie gravée au dessus dans le query Param !!! "redirect" :
  const redirect = route.query.redirect;
  //  Je le renvoie PILE la ou il voulait etre AVANT D'AVOIR ETE ARRETE PAR LA POLICE !!  S'il avait rien, On le vire au Dashboard Banale.
  router.push(redirect || "/dashboard");
}
```

## 🚨 ALERTE ROUGE : Le Piège Mortel Params vs Path

C'est LE bug Number 1 des développeurs Junior sur le Routeur qui s'arrachent les cheveux pendant 3 heures :

```typescript
// ❌ CATASTROPHE ET ÉCHEC TOTAL !!! VUE IGNORERA LITTÉRALEMENT LES PARAMÈTRES ET REDIRIGERA FAUSSEMENT EN 404 !!!
router.push({ path: "/user", params: { id: 123 } });

// ✅ LA BONNE PRATIQUE ABSOLUE REQUISE PAR VUE JS MOTEUR (Le Name De Code !!)
router.push({ name: "user", params: { id: 123 } });

// ✅ OU ALORS (Le Mode Bourrin en Dur Interpolé)
router.push({ path: `/user/${123}` });
```

## Bloquer La Flèche Précédent du Mec S'il n'a Pas Sauvegardé !

```typescript
import { onBeforeRouteLeave } from "vue-router";

// Dans le composant de Formulaire
onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    // OUVRE LA FENETRE NATIVE BLOQUANTE WINDOW OS
    return confirm(
      "Minute Papillon ! Tu as un Formulaire pas sauvegardé, t'es certain de vouloir fermer l'onglet / quitter la page !!?",
    );
  }
});
```

## Ressources Fabuleuses

- [Navigation Programmatique VUE ROUTER OFFICIEL](https://router.vuejs.org/guide/essentials/navigation.html) — Guide sur les Poussés Router

---

> 📘 _Cette leçon fait partie du cours [Vue Router : Le Guide de Navigation Ultime](/vue/vue-router/) sur la plateforme d'apprentissage RostoDev._
