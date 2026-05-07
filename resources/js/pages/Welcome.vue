<script setup lang="ts">
import AppearanceTabs from '@/components/AppearanceTabs.vue';
import { Head, Link } from '@inertiajs/vue3';
import { useMotion } from '@vueuse/motion';
import * as routes from '@/routes';
import {
    BarChart3,
    ChevronDown,
    Clock,
    Download,
    GraduationCap,
    LayoutDashboard,
    LogIn,
    ShieldCheck,
    Users,
} from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import FooterSite from './statiqpages/FooterSite.vue';
import { dashboard, login } from '@/routes';
import conditionsStage from '@/routes/conditions';
import AppLogo from '@/components/AppLogo.vue';

const heroTitle = ref<HTMLElement>();
const heroSubtitle = ref<HTMLElement>();
const ctaButton = ref<HTMLElement>();
const featureCards = ref<HTMLElement[]>([]);

useMotion(heroTitle, {
    initial: { opacity: 0, y: 50 },
    enter: {
        opacity: 1,
        y: 0,
        transition: { duration: 800, delay: 200, ease: [0.25, 0.1, 0.25, 1] },
    },
});

useMotion(heroSubtitle, {
    initial: { opacity: 0, y: 30 },
    enter: {
        opacity: 1,
        y: 0,
        transition: { duration: 800, delay: 400, ease: [0.25, 0.1, 0.25, 1] },
    },
});

useMotion(ctaButton, {
    initial: { opacity: 0, scale: 0.8 },
    enter: {
        opacity: 1,
        scale: 1,
        transition: { duration: 800, delay: 600, ease: [0.175, 0.885, 0.32, 1.1] },
    },
});

onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    useMotion(el, {
                        initial: { opacity: 0, y: 30 },
                        enter: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 600, ease: 'easeOut' },
                        },
                    });
                }
            });
        },
        { threshold: 0.1 },
    );
    featureCards.value.forEach((el) => observer.observe(el));
});

const features = [
    {
        icon: Clock,
        title: 'Suivi des présences',
        description: 'Enregistrez les arrivées et départs en temps réel. Visualisez les retards et absences avec des rapports détaillés.',
    },
    {
        icon: BarChart3,
        title: 'Analyses & Statistiques',
        description: 'Tableaux de bord interactifs avec graphiques dynamiques (Chart.js) pour analyser les tendances de présence.',
    },
    {
        icon: Users,
        title: 'Gestion des utilisateurs',
        description: 'Administrez les profils, rôles et permissions. Gérez les promotions et années de formation.',
    },
    {
        icon: GraduationCap,
        title: 'Suivi des stages',
        description: 'Gérez les fiches de stage, diplômes, et projets GitHub de chaque étudiant.',
    },
    {
        icon: Download,
        title: 'Exports PDF & Excel',
        description: 'Générez des rapports personnalisés et exportez les données de présence en PDF ou Excel.',
    },
    {
        icon: ShieldCheck,
        title: 'Sécurité & Fiabilité',
        description: 'Authentification sécurisée, OAuth (GitHub, Google), sauvegardes automatiques de la base de données.',
    },
];

defineProps<{
    totalUsers: number;
    users: {
        data: {
            id: number;
            name: string;
            email: string;
            avatar: string;
        }[];
    };
}>();
</script>

<template>
    <div class="relative min-h-screen overflow-hidden bg-gradient-to-b from-background via-background to-background/95">
        <Head title="Bienvenue">
            <link rel="preconnect" href="https://rsms.me/" />
            <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>

        <div class="pointer-events-none fixed inset-0 -z-10">
            <div class="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
            <div class="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-500/5 blur-3xl" />
            <div class="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <header class="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
            <Link :href="routes.home().url"  prefetch>
            <div class="flex items-center gap-3">
                <AppLogo class="mr-2 size-2 fill-current text-white" />
            </div>
        </Link>

            <div class="flex items-center gap-4">
                <AppearanceTabs />
                <Link
                    v-if="$page.props.auth.user"
                    :href="dashboard().url"
                    prefetch
                    class="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                >
                    <LayoutDashboard class="h-4 w-4" />
                    Dashboard
                </Link>
                <Link
                    v-else
                    :href="login().url"
                    prefetch
                    class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
                >
                    <LogIn class="h-4 w-4" />
                    Connexion
                </Link>
            </div>
        </header>

        <main>
            <section class="relative px-6 pb-24 pt-16 sm:pb-32 sm:pt-24 lg:px-8">
                <div class="mx-auto max-w-4xl text-center">
                    <div
                        class="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
                    >
                        <GraduationCap class="h-4 w-4" />
                        Solution de gestion de présence
                    </div>

                    <h1
                        ref="heroTitle"
                        class="mb-6 text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
                    >
                        Optimisez votre suivi de présence avec
                        <span class="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">webStage</span>
                    </h1>

                    <p
                        ref="heroSubtitle"
                        class="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
                    >
                        WebStage est une solution moderne et intuitive pour gérer les présences, analyser les données et améliorer
                        la productivité. Développée avec les dernières technologies (Laravel, Vue.js, Inertia.js, Tailwind CSS et
                        Chart.js), elle offre une expérience utilisateur fluide et des fonctionnalités puissantes.
                    </p>

                    <div ref="ctaButton" class="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            :href="conditionsStage.stage().url"
                            prefetch
                            class="group inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-lg"
                        >
                            Conditions de stage
                            <ChevronDown class="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                        </Link>
                        <Link
                            v-if="!$page.props.auth.user"
                            :href="login().url"
                            prefetch
                            class="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-8 py-3 text-base font-medium text-foreground transition-all hover:bg-muted"
                        >
                            <LogIn class="h-4 w-4" />
                            Se connecter
                        </Link>
                    </div>
                </div>
            </section>

            <section class="relative border-t border-gray-700/40 bg-gray-900 px-6 py-20 lg:px-8">
                <div class="mx-auto max-w-7xl">
                    <div class="mb-14 text-center">
                        <h2 class="mb-4 text-3xl font-bold text-white sm:text-4xl">
                            Tout ce dont vous avez besoin
                        </h2>
                        <p class="mx-auto max-w-xl text-gray-400">
                            Une plateforme complète pour gérer, analyser et optimiser le suivi des présences et des stages.
                        </p>
                    </div>

                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <div
                            v-for="(feature, index) in features"
                            :key="index"
                            ref="featureCards"
                            class="group rounded-xl border border-gray-700/50 bg-gray-800/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                        >
                            <div
                                class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground transition-colors group-hover:bg-primary group-hover:text-white"
                            >
                                <component :is="feature.icon" class="h-6 w-6" />
                            </div>
                            <h3 class="mb-2 text-lg font-semibold text-gray-100">{{ feature.title }}</h3>
                            <p class="text-sm leading-relaxed text-gray-400">{{ feature.description }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-t border-border/40 bg-background/50 px-6 py-20 lg:px-8">
                <div class="mx-auto max-w-7xl text-center">
                    <h2 class="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
                        Prêt à simplifier votre gestion ?
                    </h2>
                    <p class="mx-auto mb-10 max-w-lg text-muted-foreground">
                        Rejoignez-nous et découvrez une nouvelle façon de gérer les présences et les stages.
                    </p>
                    <div class="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            v-if="!$page.props.auth.user"
                            :href="login().url"
                            prefetch
                            class="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-lg"
                        >
                            <LogIn class="h-4 w-4" />
                            Commencer maintenant
                        </Link>
                        <Link
                            :href="conditionsStage.stage().url"
                            prefetch
                            class="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-8 py-3 text-base font-medium text-foreground transition-all hover:bg-muted"
                        >
                            En savoir plus
                        </Link>
                    </div>
                </div>
            </section>
        </main>

        <FooterSite />
    </div>
</template>

<style scoped>
h1 {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    line-height: 1.15;
}
</style>
