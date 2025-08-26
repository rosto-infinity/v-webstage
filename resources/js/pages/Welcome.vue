<script setup lang="ts">
import AppearanceTabs from '@/components/AppearanceTabs.vue';
import { Head, Link } from '@inertiajs/vue3';
import { useMotion } from '@vueuse/motion';
import { Facebook, Github, Globe, Instagram, Linkedin, ShieldAlert, Twitter, Youtube } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import FooterSite from './statiqpages/FooterSite.vue';

// État de chargement
const isLoading = ref(true);

// Simulation de chargement (remplacer par un vrai chargement si nécessaire)
onMounted(() => {
    setTimeout(() => {
        isLoading.value = false;
    }, 1500);
});

// Références pour les animations
const spinner = ref<HTMLElement>();
const heroTitle = ref<HTMLElement>();
const heroSubtitle = ref<HTMLElement>();
const ctaButton = ref<HTMLElement>();
const userCards = ref<HTMLElement[]>([]);
const statCards = ref<HTMLElement[]>([]);

// Animation du spinner
useMotion(spinner, {
    initial: { opacity: 0, scale: 0.8 },
    enter: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 500,
            ease: 'easeOut',
        },
    },
    leave: {
        opacity: 0,
        scale: 1.2,
        transition: {
            duration: 400,
            ease: 'easeIn',
        },
    },
});

// Configuration des animations principales
useMotion(heroTitle, {
    initial: { opacity: 0, y: 50 },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 800,
            delay: 300,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
});

useMotion(heroSubtitle, {
    initial: { opacity: 0, y: 30 },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 800,
            delay: 500,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
});

useMotion(ctaButton, {
    initial: { opacity: 0, scale: 0.8 },
    enter: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 800,
            delay: 700,
            ease: [0.175, 0.885, 0.32, 1.1],
        },
    },
});

// Animation au défilement
onMounted(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    useMotion(el, {
                        initial: { opacity: 0, y: 20 },
                        enter: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 600,
                                ease: 'easeOut',
                            },
                        },
                    });
                }
            });
        },
        { threshold: 0.1 },
    );

    userCards.value.forEach((el) => observer.observe(el));
    statCards.value.forEach((el) => observer.observe(el));
});

// Définition des propriétés
defineProps<{
    totalUsers: number;
    users: {
        id: number;
        name: string;
        email: string;
        avatar: string;
        socialMedias: {
            id: number;
            platform: string;
            url: string;
            display_name: string;
        }[];
    }[];
}>();
</script>

<template>
    <!-- Écran de chargement -->
    <Transition name="fade">
        <div v-if="isLoading" class="dark:bg-background-dark fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background">
            <div
                ref="spinner"
                class="dark:border-primary-dark h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"
            ></div>
            <p class="dark:text-muted-foreground-dark text-lg font-medium text-muted-foreground">Chargement en cours...</p>
        </div>
    </Transition>

    <!-- Contenu principal -->
    <div
        v-show="!isLoading"
        class="dark:from-background-dark/10 dark:to-background-dark min-h-screen bg-gradient-to-b from-background/10 to-background"
    >
        <Head title="Welcome">
            <link rel="preconnect" href="https://rsms.me/" />
            <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        </Head>

        <!-- Header -->
        <header class="mx-auto mb-0 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
            <nav class="flex items-center justify-center gap-4 py-6">
                <AppearanceTabs />
                <Link
                    v-if="$page.props.auth.user"
                    :href="route('dashboard')"
                    prefetch
                    class="inline-block rounded-lg border border-primary/20 px-5 py-2 text-sm leading-normal text-primary transition-colors hover:bg-primary/10 dark:hover:bg-primary/20"
                >
                    Dashboard
                </Link>
                <template v-else>
                    <Link
                        :href="route('login')"
                        prefetch
                        class="dark:bg-primary-dark dark:hover:bg-primary-dark/90 inline-block rounded-lg bg-primary px-5 py-2 text-sm leading-normal text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                        Connexion
                    </Link>
                </template>
            </nav>
        </header>

        <!-- Section Hero -->
        <section class="welcome-section relative overflow-hidden pb-7 text-center">
            <div class="relative z-10 mx-auto max-w-7xl px-6 py-0 sm:py-32 lg:px-8">
                <div class="parallax-layer" data-depth="0.2">
                    <h1
                        ref="heroTitle"
                        class="dark:text-foreground-dark mb-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
                    >
                        Optimisez votre suivi de présence avec <span class="dark:text-primary-dark text-primary">webStage</span>
                    </h1>
                    <p
                        ref="heroSubtitle"
                        class="dark:text-muted-foreground-dark text-center text-sm leading-relaxed text-muted-foreground md:text-xl"
                    >
                        WebStage est une solution moderne et intuitive pour gérer les présences, analyser les données et améliorer la productivité.
                        Développée avec les dernières technologies (Laravel, Vue.js, Inertia.js Tailwind CSS et Chart.js), elle offre une expérience
                        utilisateur fluide et des fonctionnalités puissantes.
                    </p>
                </div>

                <div class="mt-12 flex items-center justify-center gap-4 sm:flex-row">
                    <Link
                        ref="ctaButton"
                        :href="route('conditions.stage')"
                        prefetch
                        class="btn dark:bg-violet-600-dark dark:hover:shadow-lg-dark rounded-lg border-1 border-primary bg-primary px-8 py-3 text-base font-medium text-white transition-all duration-300 hover:shadow-lg"
                    >
                        <span class="flex items-center gap-2">
                            Conditions de stage
                            <ShieldAlert />
                        </span>
                    </Link>
                </div>

                <div class="absolute bottom-10 left-1/2 -translate-x-1/2 transform">
                    <div class="mouse-scroll animate-bounce bg-violet-400 dark:bg-white">
                        <div class="mouse-wheel dark:bg-primary-dark bg-primary"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Utilisateurs -->
        <section class="users-section dark:bg-background-dark/80 bg-background/80 py-20 backdrop-blur-sm">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <h2 class="dark:text-foreground-dark mb-8 text-3xl font-bold text-foreground">Liste des Utilisateurs</h2>
                <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div
                        v-for="user in users"
                        :key="user.id"
                        ref="userCards"
                        class="user-card dark:border-border-dark dark:bg-background-dark dark:hover:shadow-md-dark rounded-xl border border-border bg-background p-8 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                        <div class="flex items-center gap-4">
                            <img
                                :src="user.avatar || '/storage/avatars/no-image.png'"
                                :alt="user.name"
                                class="dark:border-border-dark h-12 w-12 rounded-full border border-border object-cover"
                            />
                            <div>
                                <h3 class="dark:text-foreground-dark text-xl font-semibold text-foreground">{{ user.name }}</h3>
                            </div>
                        </div>
                        <div class="mt-4">
                            <h4 class="dark:text-primary-dark text-lg font-semibold text-primary">Médias Sociaux</h4>
                            <div v-if="user.socialMedias?.length" class="mt-3 flex flex-wrap gap-3">
                                <a
                                    v-for="social in user.socialMedias"
                                    :key="social.id"
                                    :href="social.url"
                                    target="_blank"
                                    class="dark:bg-muted-dark dark:hover:bg-primary-dark/10 dark:hover:text-primary-dark dark:border-1-primary-dark flex items-center gap-2 rounded-full border-l-2 border-primary bg-muted px-2 py-2 text-sm transition-all hover:bg-primary/10 hover:text-primary"
                                    :title="social.display_name"
                                >
                                    <component
                                        :is="
                                            social.platform === 'github'
                                                ? Github
                                                : social.platform === 'twitter'
                                                  ? Twitter
                                                  : social.platform === 'linkedin'
                                                    ? Linkedin
                                                    : social.platform === 'facebook'
                                                      ? Facebook
                                                      : social.platform === 'instagram'
                                                        ? Instagram
                                                        : social.platform === 'youtube'
                                                          ? Youtube
                                                          : Globe
                                        "
                                        class="h-4 w-4"
                                    />
                                    <span class="sr-only">{{ social.platform }}</span>
                                </a>
                            </div>
                            <p v-else class="dark:text-muted-foreground-dark text-sm text-muted-foreground">Aucun média social associé.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section Statistiques -->
        <section class="stats-section dark:bg-background-dark/80 bg-background/80 py-20 backdrop-blur-sm">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div
                        v-for="(stat, index) in [
                            { title: 'Etudiants BTS encadrés', value: totalUsers < 10 ? `0${totalUsers}` : totalUsers },
                            { title: 'Apprenants DQP encadrés', value: totalUsers < 10 ? `0${totalUsers}` : totalUsers },
                            { title: '8h-17h/Jours', value: '6J/7J' },
                        ]"
                        :key="index"
                        ref="statCards"
                        class="stat-card dark:border-border-dark dark:bg-background-dark dark:hover:shadow-md-dark rounded-xl border border-border bg-background p-8 shadow-sm transition-all duration-300 hover:shadow-md"
                    >
                        <div class="dark:text-primary-dark mb-2 text-5xl font-bold text-primary">
                            {{ stat.value }}
                        </div>
                        <div class="dark:text-muted-foreground-dark text-muted-foreground">{{ stat.title }}</div>
                    </div>
                </div>
            </div>
        </section>
        <FooterSite />
    </div>
</template>

<style scoped>
/* Animation de fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Spinner animation */
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.animate-spin {
    animation: spin 1s linear infinite;
}

/* Effets de particules */
.particles {
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(circle at 20% 50%, rgba(var(--primary), 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: particleMove 150s linear infinite;
}

@keyframes particleMove {
    100% {
        background-position: 1200px 600px;
    }
}

/* Typographie */
h1 {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    line-height: 1.2;
}

/* Cartes interactives */
.user-card,
.stat-card {
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.user-card:hover,
.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

/* Mode sombre */
.dark .user-card:hover,
.dark .stat-card:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

/* Indicateur de scroll */
.mouse-scroll {
    width: 24px;
    height: 40px;
    border: 2px solid rgba(var(--primary), 0.5);
    border-radius: 12px;
}

.mouse-wheel {
    width: 4px;
    height: 8px;
    border-radius: 2px;
    margin: 8px auto;
}
</style>
