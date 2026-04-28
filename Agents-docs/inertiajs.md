Voici un **résumé de la documentation Inertia.js** :

## Qu'est-ce qu'Inertia.js ?
Inertia est une approche moderne pour créer des applications monolithiques. Il permet de construire des **SPA (Single Page Apps)** sans avoir besoin d'une API, en utilisant vos frameworks backend (Laravel, Rails, Phoenix) avec des composants frontend (React, Vue, Svelte).

## Concepts clés

**Comment ça fonctionne :**
- Inertia intercepte les clics sur les liens et fait des requêtes XHR au lieu de recharger la page
- Le serveur retourne du JSON avec le composant et les props, pas du HTML complet

**Installation :**
1. Côté serveur : `composer require inertiajs/inertia-laravel`
2. Côté client : `npm install @inertiajs/vue3` (ou react/svelte)

**Fonctionnalités principales :**
- **Pages & Layouts** : Composants JS qui reçoivent des props du serveur
- **Links** : Composant `<Link>` pour navigation SPA
- **Forms** : Composant `<Form>` ou helper `useForm()` pour soumissions
- **Validation** : Erreurs automatiquement partagées via `page.props.errors`
- **Partial Reloads** : Recharger seulement certaines props avec `only`/`except`
- **Prefetching** : Précharger les données au survol des liens
- **Events** : Hooks pour `before`, `start`, `success`, `error`, `finish`

```suggestions
(Introduction)[/v2/getting-started/index]
(Installation client)[/v2/installation/client-side-setup]
(Formulaires)[/v2/the-basics/forms]
```