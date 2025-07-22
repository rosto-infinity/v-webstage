<template>
    <footer class="bg-gray-50 border-t-violet-100 border-t-4 dark:bg-gray-900 text-gray-600 dark:text-gray-300 mt-14 pt-6 rounded-2xl">
        <section class="px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
            <div class="mx-auto max-w-7xl"> 
                <!-- Section supérieure -->
                <div class="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                    <!-- Colonne 1 : Description -->
                   <div class="md:col-span-2">
    <span class="text-2xl font-bold mb-4 text-primary dark:text-primary">Web Stage</span>
    <p class="leading-relaxed">
        Gestion des présences, suivi des stages, innovation digitale... Avec WebStage, je partage mon expertise pour 
        simplifier et optimiser la gestion des stages et des présences. Notre plateforme offre des solutions complètes : 
        suivi en temps réel, rapports détaillés et outils intuitifs, tout en accompagnant les formateurs et les stagiaires 
        dans un environnement numérique en constante évolution.
    </p>
</div>


                    <!-- Colonne 2 : À propos -->
                    <div>
                        <h3 class="text-lg font-semibold mb-4 text-violet-800 dark:text-primary">À propos</h3>
                        <ul class="space-y-2">
                            <li>
                                <Link :href="route('about')" prefetch class="hover:text-primary dark:hover:text-violet-400 transition">À propos de nous</Link>
                            </li>
                            <li>
                                <Link :href="route('guide.stage')" prefetch class="hover:text-primary dark:hover:text-violet-400 transition">Guide du stage</Link>
                            </li>
                            <li>
                                <Link :href="route('genie.logiciel')" prefetch class="hover:text-primary dark:hover:text-violet-400 transition">Génie logiciel</Link>
                            </li>
                        </ul>
                    </div>

                    <!-- Colonne 3 : Ressources -->
                    <div>
                        <h3 class="text-lg font-semibold mb-4 text-violet-800 dark:text-primary">Ressources</h3>
                        <ul class="space-y-2">
                            <li>
                                <Link :href="route('dev.app')" prefetch class="hover:text-primary dark:hover:text-violet-400 transition">Développement d'applications</Link>
                            </li>
                            <li>
                                <Link :href="route('faq')" prefetch class="hover:text-primary dark:hover:text-violet-400 transition">FAQ</Link>
                            </li>
                            <li>
                                <Link :href="route('conditions.stage')" prefetch class="hover:text-primary dark:hover:text-violet-400 transition">Conditions du stage</Link>
                            </li>
                        </ul>
                    </div>

                    <!-- Colonne 4 : Legal -->
                    <div>
                        <h3 class="text-lg font-semibold mb-4 text-violet-800 dark:text-primary">Legal</h3>
                        <ul class="space-y-2">
                            <li>
                                <Link :href="route('conditions.stage')" prefetch class="hover:text-primary dark:hover:text-violet-400 transition">Conditions générales</Link>
                            </li>
                            <li>          
                                <Link href="#" prefetch class="hover:text-violet-600 dark:hover:text-violet-400 transition">Politique de confidentialité</Link>
                            </li>
                            <li>          
                                <Link href="#" prefetch class="hover:text-violet-600 dark:hover:text-violet-400 transition">Support technique</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Ligne de séparation -->
                <div class="border-t border-violet-200 dark:border-violet-950 mb-2"></div>
                <!-- Section inférieure -->
                <div class="flex flex-col md:flex-row justify-between ">
                    <div class="text-sm mb-4 md:mb-0 flex items-center gap-2">
                        <div>
                            ©2025 - {{ currentYear }} Stage.devinsto.com.
                            Tous droits réservés. Conçu avec <span class="text-red-500">❤</span> par Devinsto, inc.
                        </div>
                    </div>
                    <div style="margin-top: -1rem;">
                        <a
                            href="https://hostinger.fr/?REFERRALCODE=1ROSTO35"
                            target="_blank"
                            rel="noopener"
                            aria-label="Hostinger"
                        >
                            <div class="flex flex-col  justify-center">
                                <span class=" md:inline-block mx-2 text-sm"> Hosted by</span>
                                <div class="flex  gap-2 ">
                                    <svg class="w-7 h-7"
                                        clip-rule="evenodd" fill-rule="evenodd" height="2500" stroke-linejoin="round" stroke-miterlimit="2" viewBox="7.002 8.287 148.203 175.426" width="2112" xmlns="http://www.w3.org/2000/svg"><path d="m7.002 8.287 39.319 21.172v39.32h57.467l36.295 21.172h-133.081zm148.203 75.615v-54.443l-42.344-21.172v51.418zm0 99.811-39.319-21.172v-39.32h-57.467l-36.295-21.172h133.081zm-148.203-75.615v54.443l42.343 21.172v-51.418z" fill="#6747c7"/></svg>
                                    <span style="color:#673de6; font-weight:bold; font-family:system-ui, sans-serif; font-size: 1.2rem;">Hostinger</span>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div class="flex gap-4 mt-5">
                        <!-- Facebook -->
                        <a
                            href="https://www.facebook.com/DevinstoInc"
                            target="_blank"
                            rel="noopener"
                            aria-label="Facebook"
                            class="group transition"
                        >
                            <svg class="w-6 h-6 fill-violet-400 group-hover:fill-[#1877F3] transition" viewBox="0 0 24 24">
                                <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                            </svg>
                        </a>
                        <!-- X (ex-Twitter) -->
                        <a
                            href="https://x.com/Rostandlele"
                            target="_blank"
                            rel="noopener"
                            aria-label="X"
                            class="group transition"
                        >
                            <svg class="w-6 h-6 fill-violet-400 group-hover:fill-black transition" viewBox="0 0 24 24">
                                <path d="M17.53 3H21.5l-7.19 8.21L23 21h-7.19l-5.66-6.49L3.5 21H-.5l7.78-8.89L1 3h7.19l5.13 5.88L17.53 3zm-2.1 15.5h2.13l-5.97-6.85-2.13 2.43L15.43 18.5zm-8.86-13l5.97 6.85 2.13-2.43L8.57 5.5H6.57zm13.86 13l-5.97-6.85-2.13 2.43L15.43 18.5h2.13z"/>
                            </svg>
                        </a>
                        <!-- LinkedIn -->
                        <a
                            href="https://www.linkedin.com/in/waffolelerostand/"
                            target="_blank"
                            rel="noopener"
                            aria-label="LinkedIn"
                            class="group transition"
                        >
                            <svg class="w-6 h-6 fill-violet-400 group-hover:fill-[#0077B5] transition" viewBox="0 0 24 24">
                                <path d="M22.23 0H1.77C.792 0 0 .771 0 1.723v20.554C0 23.229.792 24 1.77 24h20.46C23.208 24 24 23.229 24 22.277V1.723C24 .771 23.208 0 22.23 0zM7.12 20.452H3.56V9h3.56v11.452zM5.34 7.633a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM20.452 20.452h-3.554v-5.605c0-1.336-.025-3.057-1.865-3.057-1.867 0-2.153 1.454-2.153 2.957v5.705h-3.554V9h3.414v1.561h.049c.476-.899 1.637-1.847 3.37-1.847 3.602 0 4.267 2.37 4.267 5.455v6.283z"/>
                            </svg>
                        </a>
                        <!-- Instagram -->
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener"
                            aria-label="Instagram"
                            class="group transition"
                        >
                            <svg class="w-6 h-6 fill-gray-400 group-hover:fill-[#E4405F] transition" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.013 7.052.072 5.775.13 4.602.398 3.635 1.365 2.668 2.332 2.4 3.505 2.342 4.782 2.283 6.062 2.27 6.471 2.27 12c0 5.529.013 5.938.072 7.218.058 1.277.326 2.45 1.293 3.417.967.967 2.14 1.235 3.417 1.293 1.28.059 1.689.072 7.218.072s5.938-.013 7.218-.072c1.277-.058 2.45-.326 3.417-1.293.967-.967 1.235-2.14 1.293-3.417.059-1.28.072-1.689.072-7.218s-.013-5.938-.072-7.218c-.058-1.277-.326-2.45-1.293-3.417C21.05.398 19.877.13 18.6.072 17.32.013 16.911 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/>
                            </svg>
                        </a>
                        <!-- YouTube -->
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener"
                            aria-label="YouTube"
                            class="group transition"
                        >
                            <svg class="w-6 h-6 fill-gray-400 group-hover:fill-[#FF0000] transition" viewBox="0 0 24 24">
                                <path d="M23.498 6.186a2.993 2.993 0 0 0-2.107-2.117C19.771 3.5 12 3.5 12 3.5s-7.771 0-9.391.569A2.993 2.993 0 0 0 .502 6.186C0 7.807 0 12 0 12s0 4.193.502 5.814a2.993 2.993 0 0 0 2.107 2.117C4.229 20.5 12 20.5 12 20.5s7.771 0 9.391-.569a2.993 2.993 0 0 0 2.107-2.117C24 16.193 24 12 24 12s0-4.193-.502-5.814zM9.545 15.568V8.432l6.545 3.568-6.545 3.568z"/>
                            </svg>
                        </a>
                        <!-- GitHub -->
                        <a
                            href="https://github.com/rosto-infinity"
                            target="_blank"
                            rel="noopener"
                            aria-label="GitHub"
                            class="group transition"
                        >
                            <svg class="w-6 h-6 fill-gray-400 group-hover:fill-black transition" viewBox="0 0 24 24">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.372.823 1.104.823 2.226v3.293c0 .322.218.694.825.576C20.565 21.796 24 17.297 24 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                        </a>
                    </div>   
                </div> 
            </div>
        </section>
    </footer>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3'
const currentYear = new Date().getFullYear();
</script>

<style scoped>
a.group:hover svg {
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.10));
  transform: scale(1.12);
}
</style>
