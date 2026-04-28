import { wayfinder } from '@laravel/vite-plugin-wayfinder'
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.ts'],
            ssr: 'resources/js/ssr.ts',
            refresh: true,
        }),
        tailwindcss(),
         wayfinder({
            formVariants: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
    ],
     resolve: {
        alias: {
            '@': '/resources/js',
            '@components': '/resources/js/components',
            '@components/ui': '/resources/js/components/ui',
            '@layouts': '/resources/js/layouts',
            '@pages': '/resources/js/pages',
            '@types': '/resources/js/types',
        },
    },
});
