---
source_course: "vue-ssr-nuxt"
source_lesson: "vue-ssr-nuxt-what-is-ssr"
---

# Qu'est-ce Que Le SSR ? (Server-Side Rendering)

Le rendu côté serveur (SSR) génère le HTML sur le **serveur** au lieu du navigateur, améliorant le temps de chargement initial et le SEO.

## CSR (SPA Classique) VS SSR

### CSR (L'Ancienne Manière, La Single Page App)

```
Le Navigateur demande la page
       ↓
Le Serveur envoie un HTML minimal + un gros bundle JS
       ↓
Le Navigateur télécharge le JS (LENT !)
       ↓
Le JS s'exécute, récupère les données (API)
       ↓
Le JS génère le contenu
       ↓
L'Utilisateur voit enfin le contenu (TRÈS LENT !)
```

**Les problèmes :**

- Page blanche jusqu'au chargement du JS
- Mauvais SEO (les bots voient du HTML vide)
- Temps d'affichage du contenu très lent

### SSR (La Manière Moderne et Intelligente)

```
Le Navigateur demande la page
       ↓
Le Serveur exécute Vue, récupère les données
       ↓
Le Serveur génère le HTML complet
       ↓
Le Navigateur reçoit le HTML complet (RAPIDE !)
       ↓
L'Utilisateur voit le contenu immédiatement
       ↓
Le JS charge et "hydrate" le contenu
       ↓
La page devient interactive
```

**Les avantages :**

- Contenu initial ultra-rapide
- SEO-friendly (les bots voient le HTML complet)
- Meilleure performance perçue

## Les Concepts Clés

### L'Hydration (La Magie Côté Client)

L'"Hydration" c'est quand Vue "prend possession" du HTML déjà généré par le serveur :

1. Le serveur envoie du HTML avec le contenu
2. Le navigateur affiche le HTML statique immédiatement
3. Le bundle Vue JS se charge
4. Vue "hydrate" - attache les event listeners, rend le tout réactif
5. La page est maintenant TOTALEMENT interactive

### Le Code Universel / Isomorphe

Code qui tourne à la fois sur le serveur ET le client. Attention aux pièges :

```javascript
// ❌ Ne fonctionnera PAS sur le serveur - `window` n'existe pas
const width = window.innerWidth;

// ✅ Vérifier l'environnement d'abord
if (typeof window !== "undefined") {
  const width = window.innerWidth;
}

// ✅ Ou utiliser process.client de Nuxt
if (process.client) {
  const width = window.innerWidth;
}
```

## Les Modes de Rendu

| Mode | Quand c'est Rendu    | Cas d'Utilisation |
| ---- | -------------------- | ----------------- |
| SSR  | À chaque requête     | Contenu dynamique |
| SSG  | Au moment du build   | Contenu statique  |
| ISR  | À la demande + cache | Semi-dynamique    |
| CSR  | Dans le navigateur   | Dashboards, apps  |

### SSR (Server-Side Rendering)

```
Requête → Serveur génère → HTML frais
```

Bon pour : Contenu dynamique, pages personnalisées

### SSG (Static Site Generation)

```
Build → Pré-génération de toutes les pages → Servir des fichiers statiques
```

Bon pour : Blogs, documentation, sites marketing

### ISR (Incremental Static Regeneration)

```
1ère requête → Génère & cache → Sert depuis le cache jusqu'à péremption
```

Bon pour : Grands sites avec contenu semi-dynamique

### Le Rendu Hybride (Le Super-Pouvoir de Nuxt 3)

Nuxt 3 permet de **mélanger les modes** par route !

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    "/": { prerender: true }, // SSG pour la home
    "/blog/**": { isr: 3600 }, // ISR (renouvelle toutes les heures)
    "/dashboard/**": { ssr: false }, // CSR uniquement (protégé)
    "/api/**": { cors: true }, // Routes API
  },
});
```

## Quand Utiliser Le SSR ?

✅ **Utilisez le SSR quand :**

- Le SEO est important (site public)
- Le temps du premier affichage est critique
- Le contenu change fréquemment
- Le partage sur les réseaux sociaux (balises meta)

❌ **Évitez le SSR quand :**

- Vous construisez des outils/dashboards internes
- Le contenu est derrière une authentification
- Apps interactives en temps réel
- Sites statiques simples (utilisez plutôt SSG)

## Les Grimoires De Tests

- [Le Guide SSR VueJs (Officiel)](https://vuejs.org/guide/scaling-up/ssr.html)

---

> 📘 _Cette leçon fait partie du cours [Vue SSR & Nuxt](/vue/vue-ssr-nuxt/) sur la plateforme d'apprentissage RostoDev._
