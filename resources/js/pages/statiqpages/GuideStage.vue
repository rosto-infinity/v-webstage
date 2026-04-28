<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';

import { ChevronDown, ChevronUp, FileText, Home, Info, LayoutDashboard, List, Mail, Shield } from 'lucide-vue-next';
import { h, ref } from 'vue';
import FooterSite from './FooterSite.vue';
// import FooterSite from './FooterSite.vue';

interface Section {
    id: string;
    title: string;
    icon: any;
    content: () => ReturnType<typeof h>;
}

const expandedSections = ref<Record<string, boolean>>({});

const toggleSection = (sectionId: string) => {
    expandedSections.value = {
        ...expandedSections.value,
        [sectionId]: !expandedSections.value[sectionId],
    };
};

const sections: Section[] = [
    {
        id: 'introduction',
        title: '1. Introduction',
        icon: Info,
        content: () =>
            h('section', { class: 'space-y-4', 'aria-labelledby': 'introduction' }, [
                h('p', { class: 'text-slate-700 dark:text-slate-300 leading-relaxed' }, [
                    'Bienvenue dans le guide de stage de Devinsto. Ce document vous fournit toutes les informations nécessaires pour comprendre les attentes, les règles et les ressources disponibles pendant votre stage.',
                ]),
            ]),
    },
    {
        id: 'conditions-generales',
        title: '2. Conditions Générales du Stage',
        icon: FileText,
        content: () =>
            h('section', { class: 'space-y-4', 'aria-labelledby': 'conditions-generales' }, [
                h('div', { class: 'bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-100 dark:border-primary-500/20' }, [
                    h('h3', { class: 'text-primary-700 dark:text-primary-400 font-semibold mb-2 text-lg' }, 'Horaires'),
                    h(
                        'p',
                        { class: 'text-slate-700 dark:text-slate-300' },
                        'Les stagiaires sont tenus de respecter les horaires de travail définis par leur tuteur.',
                    ),
                ]),
                h('div', { class: 'bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-100 dark:border-primary-500/20' }, [
                    h('h3', { class: 'text-primary-700 dark:text-primary-400 font-semibold mb-2 text-lg' }, 'Retards et Absences'),
                    h('p', { class: 'text-slate-700 dark:text-slate-300' }, "Tout retard ou absence doit être signalé à l'avance et justifié."),
                ]),
                h('div', { class: 'bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-100 dark:border-primary-500/20' }, [
                    h('h3', { class: 'text-primary-700 dark:text-primary-400 font-semibold mb-2 text-lg' }, 'Engagements'),
                    h(
                        'p',
                        { class: 'text-slate-700 dark:text-slate-300' },
                        "Les stagiaires s'engagent à respecter les règles de l'entreprise et à participer activement aux projets.",
                    ),
                ]),
            ]),
    },
    {
        id: 'programme-dev-app',
        title: '3. Programme de Développement d’Application',
        icon: List,
        content: () =>
            h('section', { class: 'space-y-4', 'aria-labelledby': 'programme-dev-app' }, [
                h('div', { class: 'bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-100 dark:border-primary-500/20' }, [
                    h('h3', { class: 'text-primary-700 dark:text-primary-400 font-semibold mb-2 text-lg' }, 'Modules'),
                    h(
                        'p',
                        { class: 'text-slate-700 dark:text-slate-300' },
                        'Les modules couvrent les bases du développement web, les frameworks modernes et les bonnes pratiques.',
                    ),
                ]),
                h('div', { class: 'bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-100 dark:border-primary-500/20' }, [
                    h('h3', { class: 'text-primary-700 dark:text-primary-400 font-semibold mb-2 text-lg' }, 'Projets'),
                    h(
                        'p',
                        { class: 'text-slate-700 dark:text-slate-300' },
                        'Les stagiaires participeront à des projets concrets pour appliquer leurs connaissances.',
                    ),
                ]),
            ]),
    },
    {
        id: 'programme-genie-logiciel',
        title: '4. Programme de Génie Logiciel',
        icon: Shield,
        content: () =>
            h('section', { class: 'space-y-4', 'aria-labelledby': 'programme-genie-logiciel' }, [
                h('div', { class: 'bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-100 dark:border-primary-500/20' }, [
                    h('h3', { class: 'text-primary-700 dark:text-primary-400 font-semibold mb-2 text-lg' }, 'Concepts Clés'),
                    h(
                        'p',
                        { class: 'text-slate-700 dark:text-slate-300' },
                        'Les stagiaires apprendront les concepts fondamentaux du génie logiciel.',
                    ),
                ]),
                h('div', { class: 'bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-100 dark:border-primary-500/20' }, [
                    h('h3', { class: 'text-primary-700 dark:text-primary-400 font-semibold mb-2 text-lg' }, 'Cas Pratiques'),
                    h(
                        'p',
                        { class: 'text-slate-700 dark:text-slate-300' },
                        'Des études de cas seront proposées pour approfondir les compétences techniques.',
                    ),
                ]),
            ]),
    },
    {
        id: 'faq-support',
        title: '5. FAQ et Support',
        icon: Mail,
        content: () =>
            h('section', { class: 'space-y-4', 'aria-labelledby': 'faq-support' }, [
                h('div', { class: 'bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-100 dark:border-primary-500/20' }, [
                    h('h3', { class: 'text-primary-700 dark:text-primary-400 font-semibold mb-2 text-lg' }, 'Questions Fréquentes'),
                    h('p', { class: 'text-slate-700 dark:text-slate-300' }, 'Consultez notre FAQ pour trouver des réponses aux questions courantes.'),
                ]),
                h('div', { class: 'bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 border border-primary-100 dark:border-primary-500/20' }, [
                    h('h3', { class: 'text-primary-700 dark:text-primary-400 font-semibold mb-2 text-lg' }, 'Contact Support'),
                    h('p', { class: 'text-slate-700 dark:text-slate-300' }, 'Pour toute question supplémentaire, contactez notre équipe de support.'),
                ]),
            ]),
    },
];

const currentDate = new Date().toLocaleDateString('fr-FR');
</script>

<template>
    <Head title="Guide de Stage">
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    </Head>
    <div class="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <nav class="mx-auto mb-0 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
            <nav class="flex items-center justify-center gap-4 py-6">
                <Link
                    :href="route('home')"
                    prefetch
                    class="inline-block rounded-lg bg-primary px-5 py-2 text-sm leading-normal text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                    <div class="flex"><Home class="mr-2 size-4" /> Home</div>
                </Link>
                <Link
                    v-if="$page.props.auth.user"
                    :href="route('dashboard')"
                    prefetch
                    class="inline-block rounded-lg border border-primary/20 px-5 py-2 text-sm leading-normal text-primary transition-colors hover:bg-primary/10"
                >
                    <div class="flex"><LayoutDashboard class="mr-2 size-4" /> Dashboard</div>
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
        <!-- Header avec dégradé violet et contraste optimisé -->
        <header
            class="border-b border-violet-200 bg-gradient-to-r from-violet-100 to-violet-200 dark:border-violet-500/20 dark:from-violet-500/10 dark:to-violet-600/10"
        >
            <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                <div class="text-center">
                    <!-- Icône avec fond violet -->
                    <div class="mb-4 flex justify-center">
                        <div class="flex h-16 w-16 items-center justify-center rounded-xl bg-violet-700 dark:bg-violet-500">
                            <FileText class="h-8 w-8 text-slate-100 dark:text-slate-900" />
                        </div>
                    </div>

                    <!-- Titre principal -->
                    <h1 class="mb-4 text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">Guide de Stage</h1>

                    <!-- Sous-titre -->
                    <p class="mb-2 text-xl font-semibold text-violet-700 dark:text-violet-400">stage.devinsto.com</p>

                    <!-- Description -->
                    <p class="mx-auto max-w-2xl leading-relaxed text-slate-700 dark:text-slate-400">
                        Ce document définit les règles et les attentes pour les stagiaires participant au programme de stage sur stage.devinsto.com.
                        En vous inscrivant, vous acceptez ces conditions.
                    </p>
                </div>
                <div class="mt-6 flex flex-wrap justify-center space-x-6 rounded-lg bg-violet-50 p-4 dark:bg-violet-900/20">
                    <!-- Conditions du Stage -->

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
                    <section
                        v-for="section in sections"
                        :key="section.id"
                        :id="section.id"
                        class="hover:border-primary-200 dark:hover:border-primary-500/30 overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900/50"
                        itemscope
                        itemtype="https://schema.org/FAQPage"
                    >
                        <button
                            @click="toggleSection(section.id)"
                            class="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/30"
                            :aria-expanded="expandedSections[section.id]"
                            :aria-controls="`content-${section.id}`"
                            :id="`button-${section.id}`"
                        >
                            <div class="flex items-center space-x-3">
                                <div class="text-primary-700 dark:text-primary-500">
                                    <component :is="section.icon" class="h-5 w-5" />
                                </div>
                                <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100" :itemprop="'name'">
                                    {{ section.title }}
                                </h2>
                            </div>
                            <div class="text-primary-700 dark:text-primary-500">
                                <ChevronUp v-if="expandedSections[section.id]" class="h-5 w-5" />
                                <ChevronDown v-else class="h-5 w-5" />
                            </div>
                        </button>
                        <div
                            v-if="expandedSections[section.id]"
                            :id="`content-${section.id}`"
                            :aria-labelledby="`button-${section.id}`"
                            class="border-t border-slate-200 px-6 pb-6 dark:border-slate-800"
                            itemscope
                            itemprop="acceptedAnswer"
                            itemtype="https://schema.org/Answer"
                        >
                            <div class="pt-4" itemprop="text">
                                <component :is="section.content" />
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
                    class="text-primary-700 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium transition-colors"
                >
                    Retour au site
                </Link>
                <Link
                    href="#"
                    class="text-primary-700 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm font-medium transition-colors"
                >
                    Nous contacter
                </Link>
            </div>
        </footer>
        <FooterSite />
    </div>
</template>
