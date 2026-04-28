---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-what-is-laravel"
---

# Qu'est-ce que Laravel ?

Laravel est un **framework d'application web** doté d'une syntaxe expressive et élégante. Créé par Taylor Otwell en 2011, il est devenu le framework PHP le plus populaire au monde. Laravel est conçu pour rendre le développement agréable et efficace tout en étant incroyablement puissant.

## La Philosophie de Laravel

Laravel repose sur plusieurs principes clés qui le rendent unique :

### 1. Le Bonheur du Développeur

Laravel donne la priorité à l'expérience du développeur. Chaque fonctionnalité est conçue pour être intuitive et expressive. Le framework part du principe que des développeurs heureux écrivent du meilleur code.

### 2. Convention plutôt que Configuration (Convention Over Configuration)

Laravel propose des réglages par défaut judicieux qui fonctionnent immédiatement. Vous n'avez pas besoin de tout configurer manuellement — le framework fait des choix intelligents pour vous.

### 3. Ne vous répétez pas (DRY - Don't Repeat Yourself)

Laravel vous aide à éviter la duplication grâce à :

- Des composants Blade réutilisables
- Les modèles Eloquent et leurs relations
- Les fournisseurs de services (Service Providers) et l'injection de dépendances
- Des utilitaires et helpers intégrés

## L'Architecture MVC

Laravel suit le modèle **Modèle-Vue-Contrôleur** (MVC) :

```
┌─────────────────────────────────────────────────────────┐
│                      Requête HTTP                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                        Routeur                          │
│                    (routes/web.php)                      │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      Contrôleur                         │
│                (app/Http/Controllers)                    │
│      Gère les requêtes, coordonne le Modèle et la Vue    │
└─────────────────────────────────────────────────────────┘
                      │              │
                      ▼              ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│          Modèle          │  │           Vue            │
│      (app/Models)        │  │    (resources/views)     │
│  Base de données & Logique│  │     Templates Blade      │
└──────────────────────────┘  └──────────────────────────┘
```

- **Modèle** : Représente vos données et votre logique métier (ORM Eloquent)
- **Vue** : Gère la couche de présentation (templates Blade)
- **Contrôleur** : Traite les requêtes et retourne les réponses

## Pourquoi choisir Laravel ?

| Fonctionnalité                       | Avantage                                                          |
| ------------------------------------ | ----------------------------------------------------------------- |
| **Tout inclus (Batteries Included)** | Authentification, files d'attente, cache, et plus encore intégrés |
| **ORM Eloquent**                     | Interactions avec la base de données magnifiques et intuitives    |
| **CLI Artisan**                      | Outils de ligne de commande puissants                             |
| **Sécurité d'abord**                 | Protection contre le CSRF, XSS, et l'injection SQL par défaut     |
| **Scalable**                         | Propulse Laracasts, Invoice Ninja et des millions d'applications  |
| **Écosystème Exceptionnel**          | Forge, Vapor, Nova, Horizon, et plus encore                       |
| **Documentation Incroyable**         | Claire, complète et bien maintenue                                |
| **Communauté Active**                | Des millions de développeurs, mises à jour régulières             |

## Ce que vous pouvez construire avec Laravel

Laravel excelle dans la création de :

- **Applications Web** avec des interfaces utilisateur riches
- **APIs REST** pour mobile et frontends SPA
- **Plateformes E-commerce** avec intégration de paiement
- **Systèmes de Gestion de Contenu** (CMS)
- **Applications en temps réel** avec WebSockets
- **Microservices** et backends d'API

## L'Écosystème de Laravel

Laravel dispose d'un écosystème incroyable d'outils officiels :

- **Forge** : Gestion de serveurs et déploiement
- **Vapor** : Déploiement serverless sur AWS
- **Nova** : Magnifiques panneaux d'administration
- **Horizon** : Surveillance des files d'attente (queues)
- **Sanctum** : Authentification d'API
- **Livewire** : Composants réactifs sans JavaScript
- **Inertia** : SPAs modernes avec Vue/React

## Ressources

- [Documentation Laravel](https://laravel.com/docs/12.x) — Documentation officielle de Laravel 12 - votre référence principale

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
