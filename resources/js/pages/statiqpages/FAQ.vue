<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { Head, Link } from '@inertiajs/vue3';
import { Briefcase, ChevronDown, HelpCircle, Home, LayoutDashboard } from 'lucide-vue-next';
import FooterSite from './FooterSite.vue';
// import FooterSite from './FooterSite.vue'

const faqs = [
    {
        question: 'Comment préparer mon stage efficacement ?',
        answer: `Pour bien préparer votre stage :<ul class="list-disc ml-6 space-y-1 mt-2">
      <li><strong>Étudiez l'entreprise</strong> : Mission, produits/services, culture</li>
      <li><strong>Revoyez les bases techniques</strong> : Langages, outils, méthodologies</li>
      <li><strong>Préparez vos questions</strong> : Objectifs, attentes, modalités</li>
      <li><strong>Organisez vos documents</strong> : CV, contrat, convention</li>
    </ul>`,
    },
    {
        question: 'Quels sont mes droits et obligations en stage ?',
        answer: `<div class="space-y-3 mt-2">
      <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <h4 class="font-semibold text-violet-700 dark:text-violet-300">📜 Droits</h4>
        <ul class="list-disc ml-6 mt-1">
          <li>Encadrement par un tuteur</li>
          <li>Accès aux ressources nécessaires</li>
          <li>Gratification si stage > 2 mois</li>
        </ul>
      </div>
      <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <h4 class="font-semibold text-violet-700 dark:text-violet-300">⚖️ Obligations</h4>
        <ul class="list-disc ml-6 mt-1">
          <li>Respect des horaires et règles internes</li>
          <li>Confidentialité des informations</li>
          <li>Réalisation des missions confiées</li>
        </ul>
      </div>
    </div>`,
    },
    {
        question: 'Comment gérer mon temps entre stage et cours ?',
        answer: `Adoptez ces bonnes pratiques :<ul class="list-disc ml-6 space-y-1 mt-2">
      <li><strong>Planifiez</strong> : Utilisez un agenda/outil de gestion</li>
      <li><strong>Priorisez</strong> : Identifiez les tâches urgentes/importantes</li>
      <li><strong>Communiquez</strong> : Informez vos encadrants de vos contraintes</li>
      <li><strong>Équilibrez</strong> : Réservez du temps pour vous détendre</li>
    </ul>`,
    },
    {
        question: 'Comment tirer le meilleur parti de mon stage ?',
        answer: `<div class="space-y-3 mt-2">
      <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <h4 class="font-semibold text-violet-700 dark:text-violet-300">💡 Proactivité</h4>
        <p>Proposez des idées, posez des questions, montrez votre intérêt</p>
      </div>
      <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <h4 class="font-semibold text-violet-700 dark:text-violet-300">🤝 Collaboration</h4>
        <p>Participez aux réunions, échangez avec vos collègues</p>
      </div>
      <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <h4 class="font-semibold text-violet-700 dark:text-violet-300">📚 Apprentissage</h4>
        <p>Profitez de chaque opportunité pour apprendre de nouvelles compétences</p>
      </div>
    </div>`,
    },
    {
        question: 'Comment rédiger un bon rapport de stage ?',
        answer: `Structurez votre rapport ainsi :<ol class="list-decimal ml-6 space-y-2 mt-2">
      <li><strong>Introduction</strong> : Présentation du stage et objectifs</li>
      <li><strong>Contexte</strong> : Entreprise, service, missions</li>
      <li><strong>Réalisations</strong> : Projets, tâches, méthodes</li>
      <li><strong>Bilan</strong> : Compétences acquises, difficultés, perspectives</li>
      <li><strong>Conclusion</strong> : Retour d'expérience, recommandations</li>
    </ol>`,
    },
    {
        question: 'Comment valoriser mon stage dans mon CV ?',
        answer: `<div class="space-y-3 mt-2">
      <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <h4 class="font-semibold text-violet-700 dark:text-violet-300">📌 Informations clés</h4>
        <ul class="list-disc ml-6 mt-1">
          <li>Nom de l'entreprise et durée</li>
          <li>Poste occupé et missions principales</li>
          <li>Compétences techniques et soft skills développées</li>
        </ul>
      </div>
      <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <h4 class="font-semibold text-violet-700 dark:text-violet-300">💡 Conseils</h4>
        <ul class="list-disc ml-6 mt-1">
          <li>Utilisez des verbes d'action</li>
          <li>Quantifiez vos réalisations si possible</li>
          <li>Adaptez en fonction du poste visé</li>
        </ul>
      </div>
    </div>`,
    },
    {
        question: 'Comment gérer le stress pendant le stage ?',
        answer: `Adoptez ces stratégies :<ul class="list-disc ml-6 space-y-1 mt-2">
      <li><strong>Organisation</strong> : Planifiez vos tâches</li>
      <li><strong>Communication</strong> : Exprimez vos difficultés</li>
      <li><strong>Pause</strong> : Prenez des moments de détente</li>
      <li><strong>Apprentissage</strong> : Considérez les erreurs comme des opportunités</li>
    </ul>`,
    },
    {
        question: 'Comment intégrer une équipe en stage ?',
        answer: `<div class="space-y-3 mt-2">
      <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <h4 class="font-semibold text-violet-700 dark:text-violet-300">👋 Premiers jours</h4>
        <ul class="list-disc ml-6 mt-1">
          <li>Présentez-vous à vos collègues</li>
          <li>Observez les dynamiques d'équipe</li>
          <li>Participez aux réunions</li>
        </ul>
      </div>
      <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
        <h4 class="font-semibold text-violet-700 dark:text-violet-300">🤝 Collaboration</h4>
        <ul class="list-disc ml-6 mt-1">
          <li>Écoutez activement</li>
          <li>Proposez votre aide</li>
          <li>Partagez vos idées</li>
        </ul>
      </div>
    </div>`,
    },
    {
        question: 'Comment demander des feedbacks pendant le stage ?',
        answer: `Suivez ces étapes :<ol class="list-decimal ml-6 space-y-2 mt-2">
      <li><strong>Préparez</strong> : Identifiez les points à discuter</li>
      <li><strong>Planifiez</strong> : Convenez d'un moment approprié</li>
      <li><strong>Écoutez</strong> : Soyez ouvert aux critiques</li>
      <li><strong>Agissez</strong> : Mettez en pratique les conseils reçus</li>
    </ol>`,
    },
];

const openIndex = ref<number | null>(null);
const toggle = (idx: number) => {
    openIndex.value = openIndex.value === idx ? null : idx;
};

const faqJsonLd = computed(() =>
    JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    }),
);

const injectJsonLd = () => {
    let script = document.getElementById('faq-jsonld') as HTMLScriptElement | null;
    if (script) script.remove();
    script = document.createElement('script') as HTMLScriptElement;
    script.type = 'application/ld+json';
    script.id = 'faq-jsonld';
    script.text = faqJsonLd.value;
    document.head.appendChild(script);
};

onMounted(() => {
    injectJsonLd();
});
watch(faqJsonLd, injectJsonLd);
</script>

<template>
    <Head title="FAQ Stage - Questions Fréquemment Posées">
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
    </Head>
    <div class="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Head>
            <title>FAQ Stage - Questions Fréquentes | www.stage.devinsto.com</title>
            <meta
                name="description"
                content="Retrouvez toutes les réponses aux questions fréquentes sur les stages et les cours : préparation, droits, obligations, gestion du temps, valorisation et plus."
            />
            <meta property="og:title" content="FAQ Stage - Questions Fréquentes | www.stage.devinsto.com" />
            <meta
                property="og:description"
                content="Toutes les réponses aux questions fréquentes sur les stages et les cours : préparation, droits, obligations, gestion du temps, valorisation."
            />
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://stage.devinsto.com/faq-stage" />
            <meta property="og:image" content="https://stage.devinsto.com/images/faq-stage-og.jpg" />
            <meta name="robots" content="index, follow" />
        </Head>

         <nav class="mx-auto mb-0 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
            <nav class="flex items-center justify-center gap-4 py-6">
                <Link
                        :href="route('home')"
                        prefetch
                        class="inline-block rounded-lg bg-primary px-5 py-2 text-sm leading-normal text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                    >
                    <div class="flex">
                     <Home class="size-4 mr-2"/> Home
                    </div>   
                    </Link>
                <Link
                    v-if="$page.props.auth.user"
                    :href="route('dashboard')"
                    prefetch
                    class="inline-block rounded-lg border border-primary/20 px-5 py-2 text-sm leading-normal text-primary transition-colors hover:bg-primary/10"
                >
                     <div class="flex">
                     <LayoutDashboard class="size-4 mr-2"/> Dashboard
                    </div>
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
        <main class="flex-1">
            <div
                class="border-b border-violet-200 bg-gradient-to-r from-violet-100 to-violet-200 dark:border-violet-500/20 dark:from-violet-900/20 dark:to-slate-800/20"
            >
                <div class="mx-auto max-w-3xl px-4 py-10 text-center sm:px-6 lg:px-8">
                    <div class="animate-fade-in-down mb-4 flex justify-center">
                        <div
                            class="flex h-16 w-16 items-center justify-center rounded-xl bg-violet-700 shadow-lg shadow-violet-200/40 dark:bg-violet-500 dark:shadow-violet-900/40"
                        >
                            <Briefcase class="h-8 w-8 text-slate-100 dark:text-slate-900" />
                        </div>
                    </div>
                    <h1 class="mb-2 text-3xl font-bold sm:text-4xl">FAQ Stage - Questions Fréquemment Posées</h1>
                    <p class="mb-2 text-xl font-semibold text-violet-700 dark:text-violet-400">www.stage.devinsto.com</p>
                    <p class="mx-auto max-w-2xl leading-relaxed text-slate-700 dark:text-slate-400">
                        Voici les réponses aux questions les plus fréquentes concernant les stages et les cours.<br />
                        Si vous avez d’autres interrogations,
                        <a href="#" class="text-violet-700 underline transition hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                            >contactez-nous</a
                        >
                        !
                    </p>
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
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                ></path>
                            </svg>
                            DA
                        </Link>
                        <!-- Génie Logiciel -->
                        <Link
                            :href="route('genie.logiciel')"
                            class="flex items-center text-violet-700 transition hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300"
                        >
                            <svg class="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                ></path>
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
            </div>

            <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div class="space-y-4" itemscope itemtype="https://schema.org/FAQPage">
                    <TransitionGroup name="faq-fade" tag="div">
                        <div
                            v-for="(faq, idx) in faqs"
                            :key="faq.question"
                            class="mb-3 rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/60"
                            itemscope
                            itemprop="mainEntity"
                            itemtype="https://schema.org/Question"
                        >
                            <button
                                class="group flex w-full items-center justify-between border-b-2 border-b-violet-100 bg-slate-100 px-6 py-5 text-left focus:outline-none dark:border-b-violet-900 dark:bg-slate-800/40"
                                @click="toggle(idx)"
                                :aria-expanded="openIndex === idx"
                                :aria-controls="'faq-answer-' + idx"
                                :id="'faq-question-' + idx"
                            >
                                <span class="flex items-center gap-3 text-lg font-semibold text-slate-900 transition-colors dark:text-slate-100">
                                    <span class="mr-2 flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900">
                                        <HelpCircle class="h-5 w-5 text-violet-700 dark:text-violet-400" />
                                    </span>
                                    <span itemprop="name">{{ idx + 1 }}. {{ faq.question }}</span>
                                </span>
                                <span
                                    class="transition-transform duration-300"
                                    :class="
                                        openIndex === idx ? 'rotate-180 text-violet-700 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500'
                                    "
                                >
                                    <ChevronDown class="h-6 w-6" />
                                </span>
                            </button>
                            <transition name="accordion">
                                <div
                                    v-if="openIndex === idx"
                                    class="animate-fade-in px-6 pt-1 pb-6 text-base text-slate-700 dark:text-slate-300"
                                    :id="'faq-answer-' + idx"
                                    :aria-labelledby="'faq-question-' + idx"
                                    itemscope
                                    itemprop="acceptedAnswer"
                                    itemtype="https://schema.org/Answer"
                                >
                                    <div v-if="faq.answer.startsWith('<')" v-html="faq.answer" itemprop="text"></div>
                                    <div v-else v-html="faq.answer" itemprop="text"></div>
                                </div>
                            </transition>
                        </div>
                    </TransitionGroup>
                </div>
            </div>
        </main>
        <FooterSite />
    </div>
</template>

<style scoped>
@keyframes fade-in-down {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
.animate-fade-in-down {
    animation: fade-in-down 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.accordion-enter-active,
.accordion-leave-active {
    transition:
        max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
        opacity 0.3s;
    overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
    max-height: 0;
    opacity: 0;
}
.accordion-enter-to,
.accordion-leave-from {
    max-height: 500px;
    opacity: 1;
}
.faq-fade-move,
.faq-fade-enter-active,
.faq-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.faq-fade-enter-from,
.faq-fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
.faq-fade-enter-to,
.faq-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}
</style>
