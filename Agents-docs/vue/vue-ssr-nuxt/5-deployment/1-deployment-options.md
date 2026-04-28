---
source_course: "vue-ssr-nuxt"
source_lesson: "vue-ssr-nuxt-deployment-options"
---

# Les Options de Déploiement (Mettre Nuxt En Production)

Nuxt peut être déployé de diverses manières selon votre stratégie de rendu.

## Les Commandes de Build

```bash
# SSR (Server-Side Rendering)
npm run build
# Crée le répertoire .output/

# SSG (Static Site Generation)
npm run generate
# Crée le répertoire .output/public/
```

## Serveur Node.js (SSR)

```bash
# Build
npm run build

# Démarrer le serveur de production
node .output/server/index.mjs
# ou
npm run preview
```

### PM2 (Process Manager)

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "nuxt-app",
      script: ".output/server/index.mjs",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

```bash
pm2 start ecosystem.config.js
```

## Hébergement Statique (SSG)

```bash
# Générer les fichiers statiques
npm run generate

# Sortie dans .output/public/
# Déployer sur n'importe quel hébergeur statique
```

Compatible avec :

- Netlify
- Vercel (statique)
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

## Vercel

```bash
# Installer CLI Vercel
npm i -g vercel

# Déployer
vercel
```

Ou connecter le dépôt GitHub au tableau de bord Vercel.

```json
// vercel.json (optionnel)
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output"
}
```

## Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".output/public"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Pour SSR :

```toml
[build]
  command = "npm run build"

[functions]
  directory = ".output/server"
```

## Cloudflare Pages

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    preset: "cloudflare-pages",
  },
});
```

## Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers package
COPY package*.json ./
RUN npm ci

# Copier le source
COPY . .

# Build
RUN npm run build

# Exposer le port
EXPOSE 3000

# Démarrer le serveur
CMD ["node", ".output/server/index.mjs"]
```

```bash
# Build et lancer
docker build -t nuxt-app .
docker run -p 3000:3000 nuxt-app
```

## Les Variables d'Environnement

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    // Serveur uniquement (JAMAIS côté client)
    apiSecret: process.env.API_SECRET,

    // Client + Serveur
    public: {
      apiBase: process.env.API_BASE || "/api",
    },
  },
});
```

```vue
<!-- Dans les composants -->
<script setup>
const config = useRuntimeConfig();

// Client + Serveur
console.log(config.public.apiBase);

// Serveur uniquement (dans le répertoire server/)
console.log(config.apiSecret);
</script>
```

## Pré-rendu de Routes Spécifiques

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ["/sitemap.xml", "/robots.txt"],
      crawlLinks: true, // Pré-rend tous les liens trouvés
    },
  },

  routeRules: {
    "/": { prerender: true }, // SSG
    "/blog/**": { isr: 3600 }, // ISR (1h de cache)
    "/dashboard/**": { ssr: false }, // CSR uniquement
  },
});
```

## Le Health Check

```typescript
// server/api/health.get.ts
export default defineEventHandler(() => {
  return {
    status: "healthy",
    timestamp: new Date().toISOString(),
  };
});
```

## Optimisations de Performance

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // Fonctionnalités expérimentales
  experimental: {
    payloadExtraction: true,
    renderJsonPayloads: true,
  },

  // Compression des assets publics
  nitro: {
    compressPublicAssets: true,
  },

  // Préconnexion aux APIs externes
  app: {
    head: {
      link: [{ rel: "preconnect", href: "https://api.example.com" }],
    },
  },
});
```

## Les Grimoires De Tests

- [Le Guide de Déploiement Nuxt (Officiel)](https://nuxt.com/docs/getting-started/deployment)

---

> 📘 _Cette leçon fait partie du cours [Vue SSR & Nuxt](/vue/vue-ssr-nuxt/) sur la plateforme d'apprentissage RostoDev._
