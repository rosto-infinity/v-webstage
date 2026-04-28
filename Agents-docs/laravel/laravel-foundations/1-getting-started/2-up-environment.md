---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-setting-up-environment"
---

# Configurer votre Environnement Laravel

Avant de créer des applications Laravel, vous devez installer PHP, Composer et l'installateur Laravel. Préparons tout pour le développement.

## Prérequis

Laravel 12 nécessite :

- **PHP 8.2 ou supérieur** (nous recommandons PHP 8.4)
- **Composer** (le gestionnaire de paquets PHP)
- **Node.js et NPM** (pour les ressources frontend)
- Un éditeur de code (VS Code, PhpStorm ou Cursor)

## Étape 1 : Installer PHP et Composer

Le moyen le plus simple d'installer PHP, Composer et l'installateur Laravel est d'utiliser les scripts d'installation officiels.

### Sur macOS

```bash
/bin/bash -c "$(curl -fsSL https://php.new/install/mac/8.4)"
```

Cela installe :

- PHP 8.4
- Composer
- L'installateur Laravel

Redémarrez votre terminal après l'installation.

### Sur Windows (PowerShell en tant qu'Administrateur)

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://php.new/install/windows/8.4'))
```

### Sur Linux (Ubuntu/Debian)

```bash
/bin/bash -c "$(curl -fsSL https://php.new/install/linux/8.4)"
```

### Vérifier l'Installation

```bash
# Vérifier la version de PHP
php --version
# PHP 8.4.x

# Vérifier Composer
composer --version
# Composer version 2.x.x

# Vérifier l'installateur Laravel
laravel --version
# Laravel Installer x.x.x
```

## Étape 2 : Installer Node.js

Laravel utilise Vite pour la compilation des ressources frontend. Vous avez besoin de Node.js :

### Utilisation de l'Installateur Officiel

Téléchargez depuis https://nodejs.org (version LTS recommandée)

### Utilisation de nvm (Node Version Manager) - Recommandé

```bash
# Installer nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Installer Node.js
nvm install --lts

# Vérifier
node --version
npm --version
```

### Alternative : Utiliser Bun

Laravel supporte également Bun comme alternative plus rapide :

```bash
curl -fsSL https://bun.sh/install | bash
```

## Étape 3 : Choisir un Éditeur de Code

Nous recommandons ces éditeurs pour le développement Laravel :

### VS Code / Cursor

Installez ces extensions :

- **PHP Intelephense** - Support PHP intelligent
- **Laravel Extension Pack** - Blade, Artisan, et plus encore
- **Laravel Blade Snippets** - Support des templates Blade
- **DotENV** - Syntaxe des fichiers d'environnement

### PhpStorm

PhpStorm dispose d'un excellent support intégré pour Laravel, incluant :

- Le support des templates Blade
- L'autocomplétion des modèles Eloquent
- La navigation entre les routes et les vues
- L'intégration des commandes Artisan

## Alternative : Laravel Herd

Laravel Herd est un environnement de développement tout-en-un qui inclut PHP, Nginx, et plus encore.

### Sur macOS

1. Téléchargez depuis https://herd.laravel.com
2. L'installateur configure tout automatiquement
3. Les applications dans `~/Herd` sont accessibles sur des domaines `.test`

```bash
cd ~/Herd
laravel new my-app
cd my-app
herd open  # Ouvre http://my-app.test dans le navigateur
```

### Sur Windows

1. Téléchargez Herd pour Windows
2. Les applications vont dans `%USERPROFILE%\Herd`
3. Même fonctionnalité de domaine `.test`

## Dépannage

### "php: command not found"

Redémarrez votre terminal ou ajoutez PHP à votre PATH.

### "Permission denied" sur macOS/Linux

N'utilisez pas `sudo` avec Composer. Corrigez plutôt les permissions :

```bash
sudo chown -R $USER ~/.composer
```

### Erreurs de mémoire Composer

Augmentez la limite de mémoire :

```bash
COMPOSER_MEMORY_LIMIT=-1 composer install
```

## Ressources

- [Guide d'Installation de Laravel](https://laravel.com/docs/12.x/installation) — Guide officiel pour l'installation de Laravel sur toutes les plateformes

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
