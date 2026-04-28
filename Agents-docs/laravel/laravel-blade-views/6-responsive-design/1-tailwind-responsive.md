---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-tailwind-responsive"
---

# Design Responsif avec Tailwind CSS

Tailwind CSS rend la conception responsive totalement intuitive grâce à ses préfixes de points d'arrêt (breakpoints) adaptables selon l'approche "mobile-first".

## Le Système de Points d'Arrêt (Breakpoints)

Les points d'arrêt (breakpoints) par défaut de Tailwind :

| Préfixe | Largeur Min (Min Width) | Equivalent CSS CSS           |
| ------- | ----------------------- | ---------------------------- |
| (aucun) | 0px                     | `@media (min-width: 0px)`    |
| `sm:`   | 640px                   | `@media (min-width: 640px)`  |
| `md:`   | 768px                   | `@media (min-width: 768px)`  |
| `lg:`   | 1024px                  | `@media (min-width: 1024px)` |
| `xl:`   | 1280px                  | `@media (min-width: 1280px)` |
| `2xl:`  | 1536px                  | `@media (min-width: 1536px)` |

## L'Approche "Mobile-First"

Commencez toujours par écrire les styles pour les écrans mobiles (sans préfixe), puis ajoutez des préfixes pour remplacer/surcharger ces styles sur les écrans plus grands :

```blade
{{-- Mobile: Empilés (Stack) en colonne, Bureau (Desktop): Côte à côte en ligne --}}
<div class="flex flex-col md:flex-row">
    <div class="w-full md:w-1/3">Barre latérale (Sidebar)</div>
    <div class="w-full md:w-2/3">Contenu principal</div>
</div>
```

## Modèles de Conception Responsifs Courants (Patterns)

### Barre de Navigation (Navigation Bar)

```blade
<nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
            {{-- Logo --}}
            <div class="flex items-center">
                <a href="/" class="text-xl font-bold">Logo</a>
            </div>

            {{-- Navigation sur Bureau (Cachée sur mobile, visible à partir de 'md') --}}
            <div class="hidden md:flex items-center space-x-4">
                <a href="/" class="hover:text-blue-600">Accueil</a>
                <a href="/about" class="hover:text-blue-600">À propos</a>
                <a href="/contact" class="hover:text-blue-600">Contact</a>
            </div>

            {{-- Bouton Menu Mobile (Visible sur mobile, caché à partir de 'md') --}}
            <div class="md:hidden flex items-center">
                <button @click="open = !open" class="p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    {{-- Menu Mobile Déroulant (contrôlé via Alpine.js ou JS pur) --}}
    <div class="md:hidden" x-show="open">
        <div class="px-2 pt-2 pb-3 space-y-1">
            <a href="/" class="block px-3 py-2 hover:bg-gray-100">Accueil</a>
            <a href="/about" class="block px-3 py-2 hover:bg-gray-100">À propos</a>
            <a href="/contact" class="block px-3 py-2 hover:bg-gray-100">Contact</a>
        </div>
    </div>
</nav>
```

### Grille Responsive (Responsive Grid)

```blade
{{-- 1 colonne sur mobile, 2 sur tablette (sm), 3 sur bureau (lg), 4 sur très grand écran (xl) --}}
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    @foreach ($products as $product)
        <div class="bg-white rounded-lg shadow p-4">
            <img src="{{ $product->image }}" class="w-full h-48 object-cover rounded">
            <h3 class="mt-2 font-semibold">{{ $product->name }}</h3>
            <p class="text-gray-600">{{ $product->price }} €</p>
        </div>
    @endforeach
</div>
```

### Typographie Responsive

```blade
{{-- Police plus petite sur mobile, puis s'agrandit pour chaque point d'arrêt --}}
<h1 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">
    {{ $title }}
</h1>

<p class="text-sm md:text-base lg:text-lg">
    {{ $description }}
</p>
```

### Espacements Responsifs (Margins / Paddings)

```blade
{{-- Moins de padding sur mobile, plus d'espace de respiration sur grands écrans --}}
<section class="py-8 md:py-12 lg:py-16 px-4 md:px-8">
    <div class="max-w-4xl mx-auto">
        {{ $slot }}
    </div>
</section>
```

### Section Héroïque (Hero Section)

```blade
<section class="relative bg-blue-600 text-white">
    <div class="max-w-7xl mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div class="md:w-2/3 lg:w-1/2">
            <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Construisez des Apps Incroyables
            </h1>
            <p class="text-lg md:text-xl mb-8 opacity-90">
                Commencez à créer votre prochaine grande idée dès aujourd'hui.
            </p>
            {{-- Boutons empilés sur mobile, alignés en ligne sur 'sm' --}}
            <div class="flex flex-col sm:flex-row gap-4">
                <a href="/signup" class="bg-white text-blue-600 px-6 py-3 rounded-lg
                          text-center hover:bg-gray-100">
                    Commencer
                </a>
                <a href="/learn" class="border border-white px-6 py-3 rounded-lg
                          text-center hover:bg-blue-700">
                    En savoir plus
                </a>
            </div>
        </div>
    </div>
</section>
```

### Mise en Page en Cartes (Card Layout)

```blade
<x-layout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            @foreach ($posts as $post)
                <article class="bg-white rounded-lg shadow-md overflow-hidden
                               hover:shadow-lg transition-shadow">
                    <img src="{{ $post->image }}"
                         class="w-full h-48 object-cover">
                    <div class="p-6">
                        <span class="text-sm text-blue-600">
                            {{ $post->category->name }}
                        </span>
                        {{-- line-clamp: Coupe le texte après N lignes en ajoutant '...' --}}
                        <h2 class="mt-2 text-xl font-semibold line-clamp-2">
                            {{ $post->title }}
                        </h2>
                        <p class="mt-2 text-gray-600 line-clamp-3">
                            {{ $post->excerpt }}
                        </p>
                        <div class="mt-4 flex items-center justify-between">
                            <span class="text-sm text-gray-500">
                                {{ $post->created_at->diffForHumans() }}
                            </span>
                            <a href="{{ route('posts.show', $post) }}"
                               class="text-blue-600 hover:underline">
                                Lire la suite →
                            </a>
                        </div>
                    </div>
                </article>
            @endforeach
        </div>
    </div>
</x-layout>
```

## Points d'Arrêt Personnalisés (Custom Breakpoints)

Vous pouvez redéfinir ou ajouter des points d'arrêt dans la configuration Tailwind :

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      xs: "475px", // Nouveau point d'arrêt pour très petits mobiles
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
};
```

## Requêtes de Conteneur (Container Queries - Tailwind v3.4+)

Gérez la responsivité en fonction de la taille _du conteneur parent_ (et non de la fenêtre entière de l'écran) :

```blade
{{-- Le conteneur parent est marqué avec @container --}}
<div class="@container">
    {{-- Les enfants réagissent à la taille de ce conteneur parent en utilisant le préfixe @ --}}
    <div class="@lg:flex @lg:flex-row flex-col">
        <div>Barre latérale</div>
        <div>Contenu</div>
    </div>
</div>
```

## Ressources

- [Responsive Design avec Tailwind](https://tailwindcss.com/docs/responsive-design) — Documentation officielle de Tailwind CSS sur la création d'interfaces réactives

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
