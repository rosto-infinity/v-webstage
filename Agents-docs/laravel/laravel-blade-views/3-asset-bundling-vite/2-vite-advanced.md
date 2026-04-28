---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-vite-advanced"
---

# Configuration Avancée de Vite

Maîtrisez les fonctionnalités avancées de Vite pour gérer des applications Laravel complexes.

## Gestion des Fichiers Statiques (Assets)

### Images et Polices de Caractères (Fonts)

Référencez vos fichiers statiques directement dans votre CSS :

```css
/* resources/css/app.css */
.hero {
  /* Vite réécrira cette URL et copiera l'image dans le dossier build en production */
  background-image: url("../images/hero.jpg");
}

@font-face {
  font-family: "CustomFont";
  src: url("../fonts/CustomFont.woff2") format("woff2");
}
```

Référencez-les dans votre JavaScript :

```javascript
// resources/js/app.js
import logoUrl from "../images/logo.svg";

// Vite remplace logoUrl par le chemin final correct du fichier
document.getElementById("logo").src = logoUrl;
```

### L'aide globale et la Façade Vite dans Blade

```blade
{{-- Pour les images stockées à la racine dans le dossier /public (non traitées par Vite) --}}
<img src="{{ asset('images/logo.png') }}" alt="Logo">

{{-- Pour les images stockées dans /resources traitées et optimisées par Vite (recommandé) --}}
<img src="{{ Vite::asset('resources/images/logo.svg') }}" alt="Logo">
```

## Découpage du Code (Code Splitting)

Vite découpe automatiquement votre code pour optimiser le temps de chargement initial :

```javascript
// Import dynamique pour le code splitting
const loadChart = async () => {
  // Vite va créer un fichier JS séparé pour chart.js qui ne sera chargé que si nécessaire
  const { Chart } = await import("chart.js");
  return Chart;
};

// Utilisé uniquement au moment où l'utilisateur en a besoin
document.getElementById("show-chart").addEventListener("click", async () => {
  const Chart = await loadChart();
  // Initialisation du graphique
});
```

## Configuration des Alias

Les alias vous évitent d'écrire de longs chemins relatifs `../../` lors des imports.

```javascript
// vite.config.js
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.js"],
      refresh: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "resources/js"),
      "@components": path.resolve(__dirname, "resources/js/components"),
      "@utils": path.resolve(__dirname, "resources/js/utils"),
    },
  },
});
```

Utilisation :

```javascript
// Au lieu d'écrire : import { helper } from '../../utils/helper'
import { helper } from "@utils/helper";
import Button from "@components/Button";
```

## Intégration de React

```bash
npm install react react-dom @vitejs/plugin-react
```

```javascript
// vite.config.js
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.jsx"],
      refresh: true,
    }),
    react(), // Ajout du plugin React
  ],
});
```

```jsx
// resources/js/app.jsx
import "../css/app.css";
import { createRoot } from "react-dom/client";
import App from "./components/App";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App />);
```

```blade
{{-- Dans Blade --}}
<!DOCTYPE html>
<html lang="fr">
<head>
    {{-- Directive indispensable pour React Refresh (HMR) --}}
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

## Intégration de Vue.js

```bash
npm install vue @vitejs/plugin-vue
```

```javascript
// vite.config.js
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.js"],
      refresh: true,
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
});
```

```javascript
// resources/js/app.js
import "../css/app.css";
import { createApp } from "vue";
import App from "./components/App.vue";

createApp(App).mount("#app");
```

## Variables d'Environnement

Pour accéder aux variables d'environnement dans votre JavaScript avec Vite, elles doivent impérativement commencer par `VITE_`.

```env
# .env
VITE_APP_NAME="Mon App"
VITE_API_URL="https://api.example.com"

# Cette variable ne sera PAS accessible car elle ne commence pas par VITE_
SECRET_KEY="12345"
```

```javascript
// Accès via import.meta.env
console.log(import.meta.env.VITE_APP_NAME);
console.log(import.meta.env.VITE_API_URL);

// Variables intégrées utiles (Built-in)
console.log(import.meta.env.MODE); // 'development' ou 'production'
console.log(import.meta.env.DEV); // vaut true en mode développement
console.log(import.meta.env.PROD); // vaut true en mode production
```

## Rafraîchissement de Blade Personnalisé

Si vous avez des dossiers spécifiques que vous voulez que Vite surveille pour recharger la page :

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    laravel({
      input: ["resources/css/app.css", "resources/js/app.js"],
      // Spécifiez un tableau pour surveiller des dossiers supplémentaires
      refresh: [
        "resources/views/**",
        "routes/**",
        "app/View/Components/**",
        "lang/**", // Exemple: recharger quand on modifie les traductions
      ],
    }),
  ],
});
```

## Support du Rendu Côté Serveur (SSR)

Pour le Server-Side Rendering (très utile avec Inertia.js ou Nuxt/Next) :

```javascript
// vite.config.js
export default defineConfig({
  plugins: [
    laravel({
      input: "resources/js/app.js",
      ssr: "resources/js/ssr.js", // Point d'entrée serveur
      refresh: true,
    }),
  ],
});
```

## Intégrité des Sous-Ressources (Subresource Integrity - SRI)

Pour des raisons de sécurité strictes, ajoutez un hash d'intégrité aux balises `<script>` et `<link>` générées.

```php
// Dans la méthode boot() de AppServiceProvider
use Illuminate\Support\Facades\Vite;

Vite::useIntegrityKey('custom-integrity');

// Ou désactiver globalement l'intégrité
Vite::useIntegrityKey(false);
```

## Préchargement (Prefetching)

Pour indiquer au navigateur de précharger les assets pour une navigation perçue plus rapide.

```php
// Précharge les ressources (nécessite vite plugin > 0.8)
Vite::prefetch(concurrency: 3);
```

## Ressources

- [Configuration Vite](https://vitejs.dev/config/) — Documentation officielle complète sur la configuration de Vitejs

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
