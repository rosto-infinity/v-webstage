---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-vite-fundamentals"
---

# Introduction à Vite dans Laravel

Vite est l'outil de construction frontal (frontend build tool) par défaut de Laravel, remplaçant l'ancien Laravel Mix (basé sur Webpack). Vite offre un environnement de développement ultra-rapide avec le remplacement de modules à chaud (HMR - Hot Module Replacement) et génère des paquets optimisés pour la production.

## Pourquoi Vite ?

| Fonctionnalité                 | Vite             | Laravel Mix (Webpack) |
| ------------------------------ | ---------------- | --------------------- |
| **Démarrage du Serveur Dev**   | ~300ms           | ~10s                  |
| **Rechargement à Chaud (HMR)** | Instantané       | 1-3s                  |
| **Temps de Compilation**       | Rapide (esbuild) | Plus lent (Webpack)   |
| **Configuration**              | Simple           | Complexe              |
| **Modules ES Natifs (ESM)**    | Oui              | Non                   |

## Configuration du Projet

Les nouveaux projets Laravel incluent Vite par défaut. Vérifiez votre fichier `package.json` :

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.0",
    "laravel-vite-plugin": "^1.0.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "vite": "^5.0.0"
  }
}
```

## Le Fichier de Configuration

```javascript
// vite.config.js
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.js"],
      refresh: true, // Rafraîchissement automatique du navigateur lors de modifications des vues Blade
    }),
  ],
});
```

## La Directive @vite

Pour inclure les assets compilés dans vos vues Blade :

```blade
<!DOCTYPE html>
<html lang="fr">
<head>
    <title>Mon Application</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    {{ $slot }}
</body>
</html>
```

**En Développement** (lorsque `npm run dev` tourne), cela génère :

```html
<script type="module" src="http://localhost:5173/@vite/client"></script>
<link rel="stylesheet" href="http://localhost:5173/resources/css/app.css" />
<script type="module" src="http://localhost:5173/resources/js/app.js"></script>
```

**En Production** (après avoir exécuté `npm run build`), cela pointe vers les fichiers compilés de votre application :

```html
<link rel="stylesheet" href="/build/assets/app-BrYLxZ9n.css" />
<script type="module" src="/build/assets/app-DfJk2XMz.js"></script>
```

## Flux de Travail de Développement (Workflow)

Pour développer avec Vite et Laravel, vous avez besoin de deux terminaux ouverts en même temps :

```bash
# Terminal 1 : Démarrer le serveur HTTP Laravel
php artisan serve

# Terminal 2 : Démarrer le serveur de développement Vite
npm run dev
```

Votre navigateur se connecte alors à Laravel via `localhost:8000`, et Vite sert simultanément vos CSS/JS depuis `localhost:5173` tout en gérant le HMR (rechargement à chaud).

## CSS avec Vite

### Tailwind CSS (Par Défaut)

```css
/* resources/css/app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Styles personnalisés */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
}
```

### Configuration PostCSS

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### Importer du CSS dans JavaScript

Vite permet d'importer vos fichiers CSS directement depuis vos fichiers JavaScript.

```javascript
// resources/js/app.js
import "../css/app.css";

// Votre code JavaScript
console.log("Application chargée !");
```

## JavaScript avec Vite

### Modules ES (ES Modules)

```javascript
// resources/js/app.js
import "./bootstrap";
import { formatDate } from "./utils/date";
import Alpine from "alpinejs";

window.Alpine = Alpine;
Alpine.start();

console.log(formatDate(new Date()));
```

```javascript
// resources/js/utils/date.js
export function formatDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
```

### Installer des Paquets NPM

```bash
npm install alpinejs
npm install axios
npm install lodash-es  # Version Module ES de lodash, recommandée
```

```javascript
// resources/js/app.js
import Alpine from "alpinejs";
import axios from "axios";
import { debounce } from "lodash-es";

window.Alpine = Alpine;
window.axios = axios;
window.axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

Alpine.start();
```

## Points d'Entrée Multiples (Multiple Entry Points)

Si vous avez des sections distinctes dans votre application (ex: un espace public et une zone d'administration) :

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    laravel({
      input: [
        "resources/css/app.css",
        "resources/js/app.js",
        "resources/css/admin.css",
        "resources/js/admin.js",
      ],
      refresh: true,
    }),
  ],
});
```

```blade
{{-- Layout principal de l'application --}}
@vite(['resources/css/app.css', 'resources/js/app.js'])

{{-- Layout de l'administration --}}
@vite(['resources/css/admin.css', 'resources/js/admin.js'])
```

## Compilation pour la Production (Build)

```bash
npm run build
```

Cette commande crée vos assets optimisés dans le dossier `public/build/` :

- Fichiers CSS et JavaScript minifiés pour réduire leur taille.
- Ajout de hachages (hash) dans les noms de fichiers pour forcer le nettoyage du cache du navigateur (cache busting).
- Fichier `manifest.json` qui permet à Laravel de retrouver les bons fichiers à inclure.

```
public/build/
├── assets/
│   ├── app-BrYLxZ9n.css
│   └── app-DfJk2XMz.js
└── manifest.json
```

## Dépannage (Troubleshooting)

Il est souvent utile d'afficher un message en mode local lorsque Vite ne tourne pas :

```blade
{{-- Vérifier si Vite est en cours d'exécution --}}
@if (app()->environment('local'))
    <p>N'oubliez pas d'exécuter la commande : <code>npm run dev</code></p>
@endif
```

**Problèmes courants :**

1. **Page blanche / Styles non chargés en mode dev** : Le serveur de développement Vite (`npm run dev`) n'est pas lancé.
2. **Erreurs CORS** : Vérifiez l'URL de votre serveur Vite dans la configuration si ce n'est pas localhost.
3. **Assets introuvables en production** : Vous avez oublié d'exécuter `npm run build` avant ou pendant le déploiement.

## Ressources

- [Vite dans Laravel](https://laravel.com/docs/12.x/vite) — Documentation officielle de Laravel sur Vite

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
