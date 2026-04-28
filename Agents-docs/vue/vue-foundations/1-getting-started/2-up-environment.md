---
source_course: "vue-foundations"
source_lesson: "vue-foundations-setting-up-environment"
---

# Configurer votre Environnement de Développement (Environment Setup)

Avant de créer des applications Vue, vous devez mettre en place votre environnement de développement. Vue utilise un outillage JavaScript ultra-moderne propulsé par **Vite**, un outil de compilation de nouvelle génération qui offre une expérience de développement incroyablement rapide.

## Prérequis

Pour développer avec Vue 3.5+, vous avez besoin de :

- **Node.js 18.3 ou supérieur** (nous recommandons la dernière version LTS)
- Un éditeur de code moderne (VS Code, Cursor, ou WebStorm)
- Une application Terminal (Ligne de commande)

## Étape 1 : Installer Node.js

### Sur macOS

En utilisant l'installateur officiel :

1. Téléchargez depuis https://nodejs.org (Version LTS)
2. Lancez l'installateur

Ou en utilisant Homebrew (pour les barbus) :

```bash
brew install node
```

### Sur Windows

1. Téléchargez depuis https://nodejs.org (Version LTS)
2. Lancez l'installateur
3. **Important** : Cochez bien la case "Add to PATH" pendant l'installation

### Sur Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Vérifier l'Installation

Ouvrez un _nouveau_ terminal et tapez :

```bash
node --version
# Doit afficher v20.x.x ou supérieur

npm --version
# Doit afficher 10.x.x ou supérieur
```

## Étape 2 : Choisir un Gestionnaire de Paquets

Vue fonctionne avec n'importe quel gestionnaire de paquets JavaScript. Nous recommandons chaudement **pnpm** pour sa vitesse bluffante et son efficacité d'espace disque :

```bash
# Installer pnpm globalement sur votre machine
npm install -g pnpm

# Vérifier que ça a marché
pnpm --version
```

Les alternatives :

- **npm** : Livré par défaut avec Node.js (aucune installation supplémentaire requise)
- **yarn** : `npm install -g yarn`
- **bun** : Téléchargeable depuis https://bun.sh

## Étape 3 : Configurer votre Éditeur de Code

### VS Code / Cursor (Fortement Recommandé)

Installez ces extensions essentielles dans l'onglet Extensions :

1. **Vue - Official** (anciennement Volar)
   - Autocomplétion (IntelliSense) pour les fichiers `.vue` (SFC)
   - Coloration syntaxique
   - Vérification des types dans le HTML (template)

2. **TypeScript Vue Plugin**
   - Meilleur support de TypeScript dans les fichiers Vue

3. **ESLint**
   - Garantit la qualité et l'homogénéité du code

4. **Prettier**
   - Formatage automatique du code (pour que tout soit bien aligné)

### WebStorm / IntelliJ IDEA

Le support de Vue y est nativement intégré et excellent. Assurez-vous juste de :

- Activer le plugin "Vue.js"
- Activer le support de TypeScript

## Étape 4 : Installer Vue DevTools

Vue DevTools est une extension de navigateur vitale pour déboguer les applications Vue :

- **Chrome** : [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- **Firefox** : [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
- **Edge** : [Vue.js devtools](https://microsoftedge.microsoft.com/addons/detail/vuejs-devtools/olofadcdnkkjdfgjcmjaadnlehnnihnl)

Vue DevTools vous permet de :

- Inspecter l'arbre (la hiérarchie) de vos composants
- Voir et modifier l'état (les données) d'un composant en temps réel
- Traquer les événements et modifications (Pinia/Vuex)
- Déboguer les problèmes de performance (Profiler)

## Configuration Recommandée de l'Éditeur

Créez un fichier `.vscode/settings.json` à la racine de votre projet pour avoir des réglages consistants :

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[vue]": {
    "editor.defaultFormatter": "Vue.volar"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Résolution des Problèmes Fréquents (Troubleshooting)

### "node: command not found" (Commande introuvable)

Redémarrez complètement votre terminal après avoir installé Node.js, ou ajoutez Node à votre variable d'environnement PATH manuellement.

### Erreurs de Permission (EACCES) sur macOS/Linux

N'utilisez JAMAIS `sudo` avec npm. Réparez plutôt vos permissions locales :

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
# Ajoutez ceci à votre fichier ~/.bashrc ou ~/.zshrc :
export PATH=~/.npm-global/bin:$PATH
```

### Version de Node.js trop ancienne

Utilisez `nvm` (Node Version Manager) pour gérer facilement plusieurs versions de Node sur votre machine :

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

## Ressources

- [Démarrage Rapide Vue.js](https://vuejs.org/guide/quick-start.html) — Guide officiel de démarrage.

---

> 📘 _Cette leçon fait partie du cours [Fondamentaux de Vue.js](/vue/vue-foundations/) sur la plateforme d'apprentissage RostoDev._
