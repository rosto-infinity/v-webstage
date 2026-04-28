import '../css/app.css';

import { createInertiaApp } from '@inertiajs/vue3';
import { MotionPlugin } from '@vueuse/motion'; // Importez Motion
import { initializeTheme } from './composables/useAppearance';

const appName = import.meta.env.VITE_APP_NAME || 'WebStage';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    withApp(app) {
        app.use(MotionPlugin);
    },
    progress: {
        color: '#654bc3',
    },
});

// Initialise le thème (light/dark mode) au chargement de la page
initializeTheme();
