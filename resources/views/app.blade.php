<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Meta Description pour le référencement et l'accessibilité --}}
        <meta name="description" content="Optimisez votre suivi de présence avec WebStage. Une solution moderne et intuitive pour gérer les présences, analyser les données et améliorer la productivité. Développée avec Laravel, Vue.js, Inertia.js, Tailwind CSS et Chart.js.">
        <meta name="keywords" content="WebStage, suivi de présence, gestion des présences, productivité, analyse de données, Laravel, Vue.js, Inertia.js, Tailwind CSS, Chart.js">
        <meta name="author" content="Équipe WebStage">
        <meta name="robots" content="index, follow">

        {{-- Open Graph Meta Tags pour les réseaux sociaux --}}
        <meta property="og:title" content="WebStage - Suivi de Présence Moderne et Intuitif">
        <meta property="og:description" content="Optimisez votre suivi de présence avec WebStage. Une solution moderne et intuitive pour gérer les présences, analyser les données et améliorer la productivité.">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ config('app.url') }}">
        

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @routes
        @vite(['resources/js/app.ts', "resources/js/pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
