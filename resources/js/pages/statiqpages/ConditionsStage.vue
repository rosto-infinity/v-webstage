<script setup lang="ts">
import { ref, h, computed, onMounted, watch} from 'vue'

import { FileText,  Calendar, CheckCircle, Info, ChevronUp, ChevronDown,  } from 'lucide-vue-next'
import FooterSite from './FooterSite.vue'

interface Section {
  id: string
  title: string
  icon: any
  content: () => ReturnType<typeof h>
}

const expandedSections = ref<Record<string, boolean>>({})
const toggleSection = (sectionId: string) => {
  expandedSections.value = {
    ...expandedSections.value,
    [sectionId]: !expandedSections.value[sectionId]
  }
}

const sections: Section[] = [
  {
    id: 'organisation',
    title: '1. Organisation des Programmes',
    icon: Calendar,
    content: () => h('div', { class: 'text-slate-700 dark:text-slate-300 space-y-2' }, [
      h('p', 'Le stage se déroule sur une période de 2 mois (8 semaines).'),
      h('h4', { class: 'font-semibold text-primary-700 dark:text-primary-400' }, 'Horaires :'),
      h('ul', { class: 'list-disc ml-6 space-y-1' }, [
        h('li', 'Lundi à vendredi : 8h-17h (pause 12h-13h).'),
        h('li', 'Samedi : 8h-12h.')
      ])
    ])
  },
  {
    id: 'evaluation',
    title: '2. Évaluation',
    icon: CheckCircle,
    content: () => h('div', { class: 'text-slate-700 dark:text-slate-300 space-y-2' }, [
      h('ul', { class: 'list-disc ml-6 space-y-1' }, [
        h('li', 'Ponctualité (10 points).'),
        h('li', 'Aptitudes et vivre ensemble (5 points).'),
        h('li', 'Réponses aux questions et réalisation des tâches (5 points).')
      ])
    ])
  },
  {
    id: 'conseils',
    title: '3. Conseils Pratiques',
    icon: Info,
    content: () => h('div', { class: 'text-slate-700 dark:text-slate-300 space-y-2' }, [
      h('p', 'Pour tirer le meilleur parti de votre stage, nous vous recommandons de :'),
      h('ul', { class: 'list-disc ml-6 space-y-1' }, [
        h('li', 'Respecter les horaires et les délais.'),
        h('li', 'Poser des questions et être proactif.'),
        h('li', 'Collaborer efficacement avec vos collègues.')
      ])
    ])
  }
]

const currentDate = new Date().toLocaleDateString('fr-FR')

// Génération du JSON-LD pour le SEO (WebPage/Terms)
const stageJsonLd = computed(() =>
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Conditions Générales du Stage | stage.devinsto.com",
    "description": "Consultez les Conditions Générales du Stage sur stage.devinsto.com : organisation, évaluation, conseils pratiques et plus.",
    "url": "https://stage.devinsto.com/conditions-stage",
    "dateModified": new Date().toISOString().split('T')[0]
  })
)

// Injection dynamique du JSON-LD dans le <head>
const injectJsonLd = () => {
  let script = document.getElementById('stage-jsonld') as HTMLScriptElement | null
  if (script) script.remove()
  script = document.createElement('script') as HTMLScriptElement
  script.type = 'application/ld+json'
  script.id = 'stage-jsonld'
  script.text = stageJsonLd.value
  document.head.appendChild(script)
}

onMounted(() => {
  injectJsonLd()
})
watch(stageJsonLd, injectJsonLd)
</script>

<template>
  <div class="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
    <Head>
      <title>Conditions Générales du Stage | stage.devinsto.com</title>
      <meta name="description" content="Consultez les Conditions Générales du Stage sur stage.devinsto.com : organisation, évaluation, conseils pratiques et plus." />
      <meta property="og:title" content="Conditions Générales du Stage | stage.devinsto.com" />
      <meta property="og:description" content="Consultez les Conditions Générales du Stage sur stage.devinsto.com : organisation, évaluation, conseils pratiques et plus." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://stage.devinsto.com/conditions-stage" />
      <meta property="og:site_name" content="stage.devinsto.com" />
      <meta name="robots" content="index, follow" />
    </Head>
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
<!-- En-tête avec dégradé violet et contraste optimisé -->
<div class="bg-gradient-to-r from-violet-100/90 to-violet-200/90 border-b border-violet-300/30 dark:from-violet-900/20 dark:to-violet-800/30 dark:border-violet-700/30 shadow-sm">
  <div class="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
    <div class="text-center">
      <!-- Icône avec effet de profondeur -->
      <div class="flex justify-center mb-6">
        <div class="w-20 h-20 bg-gradient-to-br from-violet-600 to-violet-700 dark:from-violet-500 dark:to-violet-600 rounded-2xl flex items-center justify-center shadow-lg ring-4 ring-violet-100/50 dark:ring-violet-900/10">
          <FileText class="w-10 h-10 text-violet-50 dark:text-violet-100" />
        </div>
      </div>

      <!-- Titre avec ombre portée textuelle -->
      <h1 class="text-4xl sm:text-5xl font-extrabold text-violet-900 dark:text-violet-100 mb-3 [text-shadow:_0_2px_8px_rgb(124_58_237_/_20%)] dark:[text-shadow:_none]">
        Conditions Générales du Stage
      </h1>

      <!-- Sous-titre animé -->
      <p class="text-2xl font-medium text-violet-600 dark:text-violet-400 mb-4 transition-all hover:tracking-wide">
        stage.devinsto.com
      </p>

      <!-- Description avec effet de profondeur -->
      <div class="relative max-w-3xl mx-auto">
        <p class="text-lg text-slate-700 dark:text-slate-300 leading-relaxed bg-white/60 dark:bg-slate-900/30 backdrop-blur-sm px-6 py-4 rounded-xl border border-violet-200/50 dark:border-violet-700/30 shadow-inner">
          Ce document définit les règles et les attentes pour les stagiaires participant au programme de stage sur stage.devinsto.com. En vous inscrivant, vous acceptez ces conditions.
        </p>
        <!-- Élément décoratif -->
        <div class="absolute -bottom-3 -right-3 w-12 h-12 border-t-4 border-r-4 border-violet-500/30 dark:border-violet-400/20 rounded-tr-2xl"></div>
      </div>
    </div>
    
  </div>

  
</div>

    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="space-y-6">
        <div
          v-for="section in sections"
          :key="section.id"
          class="bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-primary-200 dark:hover:border-primary-500/30 transition-colors"
        >
          <button
            @click="toggleSection(section.id)"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="text-primary-700 dark:text-primary-500">
                <component :is="section.icon" class="w-5 h-5" />
              </div>
              <h2 class="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {{ section.title }}
              </h2>
            </div>
            <div class="text-primary-700 dark:text-primary-500">
              <ChevronUp v-if="expandedSections[section.id]" class="w-5 h-5" />
              <ChevronDown v-else class="w-5 h-5" />
            </div>
          </button>
          <div v-if="expandedSections[section.id]" class="px-6 pb-6 border-t border-slate-200 dark:border-slate-800">
            <div class="pt-4">
              <component :is="section.content" />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center py-8 border-t border-slate-200 dark:border-slate-800">
          <p class="text-slate-600 dark:text-slate-400 text-sm">
            Dernière mise à jour : {{ currentDate }}
          </p>
          <div class="mt-4 flex justify-center space-x-6">
            <button class="text-primary-700 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium">
              Retour au site
            </button>
            <button class="text-primary-700 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium">
              Nous contacter
            </button>
          </div>
        </div>
      </div>
    </div>
    <FooterSite />
  </div>
</template>
