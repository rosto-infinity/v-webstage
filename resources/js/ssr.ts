import { createInertiaApp } from '@inertiajs/vue3';
import { MotionPlugin } from '@vueuse/motion';

const appName = import.meta.env.VITE_APP_NAME || 'WebStage';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    withApp(app) {
        app.use(MotionPlugin);
    },
});
