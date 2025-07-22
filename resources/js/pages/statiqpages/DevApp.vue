<template>
    <Head title="Programme de Développement d’Application">
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    </Head>
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
        <header
            class="border-b border-violet-200 bg-gradient-to-r from-violet-100 to-violet-200 dark:border-violet-500/20 dark:from-violet-900/20 dark:to-violet-800/20"
        >
            <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                <div class="text-center">
                    <div class="mb-4 flex justify-center">
                        <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-violet-700 dark:bg-violet-500">
                            <Code class="h-8 w-8 text-slate-100 dark:text-slate-900" />
                        </div>
                    </div>
                    <h1 class="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">Programme de Développement d’Application</h1>
                    <p class="mb-2 text-xl font-semibold text-violet-700 dark:text-violet-400">Devinsto.com</p>
                    <p class="mx-auto max-w-2xl leading-relaxed text-slate-700 dark:text-slate-400">
                        Maîtriser les technologies modernes pour développer des applications web et mobiles.
                    </p>
                </div>
                <!-- Liens horizontaux avec icônes -->
                <div class="mt-6 flex flex-wrap justify-center space-x-6 rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
                    <!-- À propos -->
                    <Link
                        :href="route('about')"
                        class="flex items-center text-violet-700 transition hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        <svg class="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        About
                    </Link>
                    <!-- Guide du Stage -->
                    <Link
                        :href="route('guide.stage')"
                        class="flex items-center text-violet-700 transition hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        <svg class="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            ></path>
                        </svg>
                        Guide
                    </Link>
                    <!-- Développement d'App -->
                    <Link
                        :href="route('dev.app')"
                        class="flex items-center text-violet-700 transition hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        <svg class="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                        DA
                    </Link>
                    <!-- Génie Logiciel -->
                    <Link
                        :href="route('genie.logiciel')"
                        class="flex items-center text-violet-700 transition hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        <svg class="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                        </svg>
                        GL
                    </Link>
                    <!-- FAQ -->
                    <Link
                        :href="route('faq')"
                        class="flex items-center text-violet-700 transition hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                        <svg class="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        FAQ
                    </Link>
                </div>
            </div>
        </header>

        <!-- Content -->
        <main>
            <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div class="space-y-6">
                    <!-- Modules -->
                    <section class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
                        <h2 class="mb-4 text-2xl font-bold text-violet-700 dark:text-violet-400">Modules et Contenu</h2>
                        <div class="space-y-4">
                            <div
                                v-for="(module, index) in modules"
                                :key="index"
                                class="rounded-lg border border-violet-100 bg-violet-50 p-4 dark:border-violet-500/20 dark:bg-violet-900/20"
                            >
                                <div class="flex items-center space-x-3">
                                    <component :is="module.icon" class="h-5 w-5 text-violet-700 dark:text-violet-400" />
                                    <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">{{ module.title }}</h3>
                                </div>
                                <p class="mt-2 text-slate-700 dark:text-slate-300">{{ module.description }}</p>
                            </div>
                        </div>
                    </section>

                    <!-- Projets Pratiques -->
                    <section class="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/50">
                        <h2 class="mb-4 text-2xl font-bold text-violet-700 dark:text-violet-400">Projets Pratiques (TP)</h2>
                        <div class="space-y-4">
                            <div
                                v-for="(project, index) in projects"
                                :key="index"
                                class="rounded-lg border border-violet-100 bg-violet-50 p-4 dark:border-violet-500/20 dark:bg-violet-900/20"
                            >
                                <div class="flex items-center space-x-3">
                                    <component :is="project.icon" class="h-5 w-5 text-violet-700 dark:text-violet-400" />
                                    <h3 class="text-lg font-semibold text-violet-700 dark:text-violet-400">{{ project.title }}</h3>
                                </div>
                                <p class="mt-2 text-slate-700 dark:text-slate-300">{{ project.description }}</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </main>

        <!-- Footer -->
        <footer class="border-t border-slate-200 py-8 text-center dark:border-slate-800">
            <p class="text-sm text-slate-600 dark:text-slate-400">Dernière mise à jour : {{ currentDate }}</p>
            <div class="mt-4 flex justify-center space-x-6">
                <Link
                    href="/"
                    class="text-sm font-medium text-violet-700 transition-colors hover:text-violet-600 dark:text-violet-500 dark:hover:text-violet-400"
                >
                    Retour au site
                </Link>
                <Link
                    href="#"
                    class="text-sm font-medium text-violet-700 transition-colors hover:text-violet-600 dark:text-violet-500 dark:hover:text-violet-400"
                >
                    Nous contacter
                </Link>
            </div>
        </footer>
        <FooterSite />
    </div>
</template>

<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Box, Code, Database, FileText, GitBranch, Layout, PenTool, Shield, Smartphone, Users } from 'lucide-vue-next';
import FooterSite from './FooterSite.vue';

const modules = [
    {
        title: 'PHP et Programmation Orientée Objet (POO) en PHP',
        description:
            'Concepts de base de PHP : syntaxe, variables, fonctions. Introduction à la POO : classes, objets, héritage, encapsulation. TP : Créer une classe simple pour gérer des utilisateurs.',
        icon: Code,
    },
    {
        title: 'CSS, JavaScript et Tailwind CSS',
        description:
            'Fondamentaux de CSS et JavaScript. Utilisation de Tailwind CSS pour des interfaces modernes et réactives. TP : Concevoir une page d’accueil responsive avec Tailwind CSS.',
        icon: Layout,
    },
    {
        title: 'Laravel',
        description:
            'Installation et configuration de Laravel. Création de routes, contrôleurs et vues. TP : Réaliser un CRUD simple (ex. : gestion de tâches).',
        icon: Box,
    },
    {
        title: 'Dart et Flutter',
        description:
            'Introduction à Dart et Flutter pour le développement mobile. Création d’interfaces utilisateur avec Flutter. TP : Développer une application mobile basique (ex. : liste de courses).',
        icon: Smartphone,
    },
    {
        title: 'React.js',
        description:
            'Fondamentaux de React.js : composants, état, props. Intégration avec une API Laravel. TP : Créer une application React.js pour afficher des données dynamiques.',
        icon: Code,
    },
    {
        title: 'Git et GitHub',
        description:
            'Gestion de version avec Git : commit, branches, fusion. Collaboration sur GitHub : pull requests, gestion des issues. TP : Publier un projet Laravel sur GitHub.',
        icon: GitBranch,
    },
    {
        title: 'Hostinger',
        description:
            'Déploiement d’applications web sur Hostinger. Gestion des bases de données et des fichiers en ligne. TP : Déployer un projet Laravel sur Hostinger.',
        icon: Box,
    },
];

const projects = [
    {
        title: 'Portfolio avec Laravel et Dashboard',
        description: 'Créer un portfolio personnel avec un tableau de bord administrateur.',
        icon: PenTool,
    },
    {
        title: 'CRUD en Laravel',
        description: 'Développer une application de gestion de contenu (ex. : blog).',
        icon: Database,
    },
    {
        title: 'Rôles et Permissions',
        description: 'Implémenter un système de rôles (admin, utilisateur).',
        icon: Users,
    },
    {
        title: 'Export/Import Excel et Impression PDF',
        description: 'Exporter des données en Excel et générer des PDF.',
        icon: FileText,
    },
    {
        title: 'Gestion des Comptes Admin et User',
        description: 'Créer des interfaces distinctes pour les administrateurs et les utilisateurs.',
        icon: Shield,
    },
];

const currentDate = new Date().toLocaleDateString('fr-FR');
</script>
