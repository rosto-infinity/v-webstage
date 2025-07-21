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
              <User class="w-8 h-8 text-slate-100 dark:text-slate-900" />
            </div>
          </div>
          <h1 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            À Propos de l'Auteur
          </h1>
          <p class="text-xl text-violet-700 dark:text-violet-400 font-semibold mb-2">Prof Waffo Lele Rostand</p>
          <p class="text-slate-700 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Formateur-Développeur et Graphiste | PDG de Devinsto, Inc.
          </p>
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
      </div>
    </header>

    <!-- Content -->
    <main>
      <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div class="space-y-6">
          <!-- Section Présentation -->
          <section class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 class="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-4">Présentation</h2>
            <div class="space-y-4">
              <p class="text-slate-700 dark:text-slate-300">
                <strong>Prof Waffo Lele Rostand</strong> est un expert polyvalent dans les domaines du développement logiciel, de la formation et du design graphique. Avec plus de 5 ans d'expérience, il a contribué à la création de solutions innovantes et à la formation de nombreux professionnels dans le secteur des technologies de l'information.
              </p>
              <p class="text-slate-700 dark:text-slate-300">
                En tant que <strong>PDG de Devinsto, Inc.</strong>, il dirige une équipe talentueuse qui conçoit et développe des applications web et mobiles de haute qualité, répondant aux besoins des entreprises modernes.
              </p>
            </div>
          </section>

          <!-- Section Expertise -->
          <section class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 class="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-4">Expertise</h2>
            <div class="space-y-4">
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <Code class="w-5 h-5 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Développement Logiciel</h3>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mt-2">
                  Maîtrise des langages de programmation tels que PHP, JavaScript, Dart et des frameworks comme Laravel, vue.js et Flutter.
                </p>
              </div>
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <Users class="w-5 h-5 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Formation</h3>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mt-2">
                  Expérience dans la formation de professionnels et d'étudiants en développement web, mobile et en conception graphique.
                </p>
              </div>
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <PenTool class="w-5 h-5 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Design Graphique</h3>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mt-2">
                  Création d'interfaces utilisateur modernes et esthétiques avec des outils comme Adobe XD et Tailwind CSS.
                </p>
              </div>
            </div>
          </section>

          <!-- Section Réalisations -->
          <section class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-sale-800 p-6">
            <h2 class="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-4">Réalisations</h2>
            <div class="space-y-4">
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <Smartphone class="w-5 h-5 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Applications Web et Mobiles</h3>
                </div>
                <p class="text-slate-700 dark:text-sale-300 mt-2">
                  Conception et développement de plusieurs applications réussies pour des clients dans divers secteurs.
                </p>
              </div>
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <FileText class="w-5 h-5 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Projets de Formation</h3>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mt-2">
                  Organisation de formations pratiques et de workshops pour partager ses connaissances et compétences.
                </p>
              </div>
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <Shield class="w-5 h-5 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Leadership</h3>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mt-2">
                  Direction d'une équipe de développeurs et de designers pour réaliser des projets innovants et performants.
                </p>
              </div>
            </div>
          </section>

          <!-- Section Wew Stage -->
          <section class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 class="text-2xl font-bold text-violet-700 dark:text-violet-400 mb-4">Wew Stage</h2>
            <div class="space-y-4">
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <Calendar class="w-5 h-5 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Gestion des Présences</h3>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mt-2">
                  Wew Stage est une application innovante conçue pour simplifier la gestion des présences et des stages. Elle offre des fonctionnalités avancées pour suivre les horaires, les absences et les performances des stagiaires.
                </p>
              </div>
              <div class="bg-violet-50 dark:bg-violet-900/20 p-4 rounded-lg border border-violet-100 dark:border-violet-500/20">
                <div class="flex items-center space-x-3">
                  <Settings class="w-5 h-5 text-violet-700 dark:text-violet-400" />
                  <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">Gestion des Stages</h3>
                </div>
                <p class="text-slate-700 dark:text-slate-300 mt-2">
                  L'application permet également de gérer les stages, en offrant des outils pour planifier, évaluer et améliorer l'expérience des stagiaires et des formateurs.
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
      <div class="mt-4 flex justify-center space-x-6">
        <Link href="/" class="text-violet-700 dark:text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm font-medium">
          Retour au site
        </Link>
        <Link href="/contact" class="text-violet-700 dark:text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm font-medium">
          Nous contacter
        </Link>
      </div>
    </footer>
    <FooterSite />
  </div>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
import { User, Code, Smartphone, PenTool, Settings, FileText, Users, Shield, Calendar } from 'lucide-vue-next'
import FooterSite from './FooterSite.vue';

const currentDate = new Date().toLocaleDateString('fr-FR')
</script>
