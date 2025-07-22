<template>
  <div class="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
     <!-- nav -->
        <nav class="mx-auto mb-0 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
            <nav class="flex items-center justify-center gap-4 py-6">
                <AppearanceTabs class="" />
                <Link
                    v-if="$page.props.auth.user"
                    :href="route('dashboard')"
                    prefetch
                    class="inline-block rounded-lg border border-primary/20 px-5 py-2 text-sm leading-normal text-primary transition-colors hover:bg-primary/10"
                >
                    Dashboard
                </Link>
                <template v-else>
                    <Link
                        :href="route('login')"
                        prefetch
                        class="inline-block rounded-lg bg-primary px-5 py-2 text-sm leading-normal text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                        Connexion
                    </Link>
                </template>
            </nav>
        </nav>
    <!-- Header -->
    <header class="bg-gradient-to-r from-violet-100 to-violet-200 border-b border-violet-200 dark:from-violet-900/20 dark:to-violet-800/20 dark:border-violet-500/20">
      <div class="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-violet-700 dark:bg-violet-500 rounded-xl flex items-center justify-center">
              <Terminal class="w-8 h-8 text-slate-100 dark:text-slate-900" />
            </div>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Environnement de Développement et Outils
          </h1>
          <p class="text-slate-700 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Découvrez les technologies et outils utilisés pour gérer et déployer vos applications.
          </p>
        </div>
        <!-- Liens horizontaux avec icônes -->
    <div class="flex justify-center mt-6 space-x-6 flex-wrap bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg">
    
      <!-- À propos -->
      <Link :href="route('about')" class="flex items-center text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 transition">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        About
      </Link>
      <!-- Guide du Stage -->
      <Link :href="route('guide.stage')" class="flex items-center text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 transition">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        Guide
      </Link>
      <!-- Développement d'App -->
      <Link :href="route('dev.app')" class="flex items-center text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 transition">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
        DA
      </Link>
      <!-- Génie Logiciel -->
      <Link :href="route('genie.logiciel')" class="flex items-center text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 transition">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
        </svg>
        GL
      </Link>
      <!-- FAQ -->
      <Link :href="route('faq')" class="flex items-center text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:hover:text-violet-300 transition">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        FAQ
      </Link>
    </div>
      </div>
    </header>

    <!-- Content -->
    <main>
      <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div class="space-y-6">
       <!-- Section Environnement de Développement -->
<section class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
  <h2 class="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-4">Environnement de Développement</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Linux Mint -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
        <Terminal class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Linux Mint</h3>
      </div>
      <p class="text-slate-700 dark:text-slate-300 mt-2">
        Système d'exploitation principal, version 22.1, avec le noyau 6.8.0-64-generic.
      </p>
    </div>

    <!-- Nginx -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
        <Server class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Nginx</h3>
      </div>
      <p class="text-slate-700 dark:text-slate-300 mt-2">
        Serveur web utilisé pour héberger et gérer les applications.
      </p>
    </div>

    <!-- Composer -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
        <Package class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Composer</h3>
      </div>
      <p class="text-slate-700 dark:text-slate-300 mt-2">
        Gestionnaire de dépendances PHP pour les projets Laravel.
      </p>
    </div>

    <!-- Node.js (npm) -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
        <Code class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Node.js (npm)</h3>
      </div>
      <p class="text-slate-700 dark:text-slate-300 mt-2">
        Environnement d'exécution JavaScript pour les outils front-end.
      </p>
    </div>

    <!-- PostgreSQL -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
        <Database class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">PostgreSQL</h3>
      </div>
      <p class="text-slate-700 dark:text-slate-300 mt-2">
        Base de données relationnelle puissante et flexible.
      </p>
    </div>

    <!-- Front-end : Vue.js + shadcn -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
      <Code2 class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Front-end : Vue.js + shadcn</h3>
      </div>
      <p class="text-slate-700 dark:text-slate-300 mt-2">
        Composants partiellement conçus avec shadcn, une bibliothèque de composants magnifiquement designés.
      </p>
    </div>

    <!-- Back-end : Laravel + Outils Modernes -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
        <Cpu class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Back-end : Laravel + Outils Modernes</h3>
      </div>
     <p class="text-slate-700 dark:text-slate-300 mt-2">
  Utilisation d'outils modernes comme <strong>Pest</strong> (test), <strong>Pint</strong> (formatage), <strong>Peck</strong> (analyse statique), <strong>PHPStan</strong>, et <strong>Rector</strong> (refactoring). Ces outils ont été développés par <strong>Nuno Maduro</strong>, un contributeur clé de l'écosystème Laravel.
</p>

    </div>

    <!-- Éditeur de Code : VSCode -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
        <FileCode class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Éditeur de Code : VSCode</h3>
      </div>
      <p class="text-slate-700 dark:text-slate-300 mt-2">
        Éditeur de code principal, configuré pour le développement web moderne.
      </p>
    </div>

    <!-- Bloc-notes Numérique : CherryTree -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
        <NotebookText class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Bloc-notes Numérique : CherryTree</h3>
      </div>
      <p class="text-slate-700 dark:text-slate-300 mt-2">
        Outil de prise de notes hiérarchique pour organiser les idées et les projets.
      </p>
    </div>

    <!-- Bloc-notes Numérique : Logseq -->
    <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
      <div class="flex items-center space-x-3">
        <NotebookPen class="w-6 h-6 text-violet-700 dark:text-violet-400" />
        <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Bloc-notes Numérique : Logseq</h3>
      </div>
      <p class="text-slate-700 dark:text-slate-300 mt-2">
        Outil de gestion des connaissances basé sur des graphes, idéal pour la productivité et l'organisation.
      </p>
    </div>
  </div>
</section>


        <!-- Section Déploiement avec Dokploy -->
<section class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
  <h2 class="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-4">Déploiement avec Dokploy</h2>
  <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
    <div class="flex items-center space-x-3">
      <UploadCloud class="w-6 h-6 text-violet-700 dark:text-violet-400" />
      <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Dokploy</h3>
    </div>
    <p class="text-slate-700 dark:text-slate-300 mt-2">
      Outil de déploiement PHP qui permet de déployer des applications <strong class="text-primary">n'importe où</strong> avec une grande liberté et facilité. Il automatise les processus de déploiement et est compatible avec Laravel.
    </p>
    <div class="mt-4 space-y-3">
      <!-- Simplicité -->
      <div class="flex items-start space-x-3">
        <CheckCircle class="w-5 h-5 text-primary" />
        <p class="text-slate-700 dark:text-slate-300">
          <strong class="text-primary">Simplicité</strong> : Configuration et gestion faciles des déploiements.
        </p>
      </div>
      <!-- Flexibilité -->
      <div class="flex items-start space-x-3">
        <Settings class="w-5 h-5 text-primary" />
        <p class="text-slate-700 dark:text-slate-300">
          <strong class="text-primary">Flexibilité</strong> : Prend en charge une large gamme d'applications et de bases de données.
        </p>
      </div>
      <!-- Open Source -->
      <div class="flex items-start space-x-3">
        <Github class="w-5 h-5 text-primary" />
        <p class="text-slate-700 dark:text-slate-300">
          <strong class="text-primary">Open Source</strong> : Logiciel libre et open source, disponible pour tous.
        </p>
      </div>
    </div>
    <div class="mt-4">
      <h4 class="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">Problèmes et Solutions</h4>
      <p class="text-slate-700 dark:text-slate-300">
        Par défaut, Dokploy propose plusieurs types de builds pour déployer votre application, le plus courant étant <strong class="text-primary">nixpacks</strong> et <strong class="text-primary">Heroku Buildpacks</strong>. Cependant, cela peut poser des problèmes, notamment une consommation élevée de ressources (RAM, CPU) lors de la création de l'application, ce qui peut entraîner des délais d'attente ou même le blocage du serveur.
      </p>
      <div class="mt-3 space-y-3">
        <div class="flex items-start space-x-3">
          <AlertCircle class="w-5 h-5 text-primary" />
          <p class="text-slate-700 dark:text-slate-300">
            <strong class="text-primary">Solution 1</strong> : Augmentez les ressources de votre serveur (CPU, RAM, disque). Cependant, ce n'est pas toujours la solution la plus économique ou efficace.
          </p>
        </div>
        <div class="flex items-start space-x-3">
          <CheckCircle class="w-5 h-5 text-primary" />
          <p class="text-slate-700 dark:text-slate-300">
            <strong class="text-primary">Solution 2</strong> : Créez et publiez l'application dans un pipeline CI/CD, par exemple <strong class="text-primary">GitHub Actions</strong>, <strong class="text-primary">GitLab CI</strong>, ou <strong class="text-primary">Gitea Actions</strong>. Cette méthode est recommandée pour éviter les problèmes de ressources.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>


          <!-- Section Outils sur VPS Hostinger -->
          <section class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 class="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-4">Outils sur VPS Hostinger</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <Server class="w-6 h-6 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Gestion des Applications</h3>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mt-2">
                  Configuration pour gérer plusieurs applications simultanément sur le même VPS.
                </p>
              </div>
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <Workflow class="w-6 h-6 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">n8n</h3>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mt-2">
                  Outil d'automatisation des flux pour connecter et automatiser les tâches entre différentes applications et services.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="text-center py-8 border-t border-slate-200 dark:border-slate-800">
      <p class="text-slate-600 dark:text-slate-400 text-sm">
        Dernière mise à jour : {{ currentDate }}
      </p>
    </footer>
    <FooterSite />
  </div>
</template>

<script setup lang="ts">

import { Terminal, Server, Package, Code, Database, UploadCloud, Workflow, NotebookPen, NotebookText, FileCode, Cpu, Code2, CheckCircle, AlertCircle, Github, Settings } from 'lucide-vue-next'
import FooterSite from './FooterSite.vue';
import { Link } from '@inertiajs/vue3'

const currentDate = new Date().toLocaleDateString('fr-FR')
</script>
