---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-project-planning"
---

# Planifier votre Application

Avant d'écrire le moindre code, prenons le temps de planifier l'application de gestion de tâches que nous allons construire. Une bonne planification fait gagner du temps et vous aide à comprendre comment les différentes pièces de Laravel s'assemblent.

## Ce que nous construisons

Nous allons créer un **Gestionnaire de Tâches** (Task Manager) avec les fonctionnalités suivantes :

- Inscription et authentification des utilisateurs
- Créer, lire, mettre à jour et supprimer (CRUD) des tâches
- Marquer les tâches comme terminées/en cours
- Organiser les tâches par catégories
- Filtrer et rechercher des tâches
- Un tableau de bord avec des statistiques sur les tâches

## Architecture de l'Application

```
┌─────────────────────────────────────────────────────────────────┐
│                     Gestionnaire de Tâches                       │
├─────────────────────────────────────────────────────────────────┤
│  Routes          │  Contrôleurs      │  Vues                    │
│  ─────────────   │  ─────────────    │  ─────────────           │
│  /               │  HomeController   │  home.blade.php           │
│  /dashboard      │  DashboardCtrl    │  dashboard.blade.php      │
│  /tasks          │  TaskController   │  tasks/index.blade.php    │
│  /tasks/create   │  TaskController   │  tasks/create.blade.php   │
│  /tasks/{id}     │  TaskController   │  tasks/show.blade.php     │
│  /tasks/{id}/edit│  TaskController   │  tasks/edit.blade.php     │
│  /categories     │  CategoryCtrl     │  categories/*.blade.php   │
├─────────────────────────────────────────────────────────────────┤
│  Modèles                                                         │
│  ─────────────────────────────────────────────────────────────   │
│  User (Utilisa.) │  Task (Tâche)     │  Category (Catégorie)     │
│  - id            │  - id             │  - id                     │
│  - name          │  - user_id (FK)   │  - user_id (FK)           │
│  - email         │  - category_id    │  - name                   │
│  - password      │  - title          │  - color                  │
│                  │  - description    │  - created_at             │
│                  │  - completed      │  - updated_at             │
│                  │  - due_date       │                           │
│                  │  - created_at     │                           │
│                  │  - updated_at     │                           │
└─────────────────────────────────────────────────────────────────┘
```

## Relations dans la Base de Données

```
User (1) ──────< (Plusieurs) Task
  │
  └──────< (Plusieurs) Category

Category (1) ──────< (Plusieurs) Task
```

- Un **Utilisateur** (User) a plusieurs **Tâches** (Tasks)
- Un **Utilisateur** (User) a plusieurs **Catégories** (Categories)
- Une **Catégorie** (Category) a plusieurs **Tâches** (Tasks)
- Une **Tâche** (Task) appartient à un **Utilisateur** et à une **Catégorie**

## Scénarios Utilisateurs (User Stories)

Définissons ce que les utilisateurs peuvent faire :

1. **En tant que visiteur**, je peux m'inscrire pour créer un compte
2. **En tant que visiteur**, je peux me connecter à mon compte
3. **En tant qu'utilisateur**, je peux créer de nouvelles tâches avec un titre, une description et une date d'échéance
4. **En tant qu'utilisateur**, je peux voir toutes mes tâches
5. **En tant qu'utilisateur**, je peux marquer des tâches comme terminées ou non terminées
6. **En tant qu'utilisateur**, je peux modifier mes tâches
7. **En tant qu'utilisateur**, je peux supprimer mes tâches
8. **En tant qu'utilisateur**, je peux créer des catégories pour organiser mes tâches
9. **En tant qu'utilisateur**, je peux assigner des tâches à des catégories
10. **En tant qu'utilisateur**, je peux filtrer les tâches par catégorie ou par statut (terminé/en cours)
11. **En tant qu'utilisateur**, je peux voir des statistiques sur mon tableau de bord

## Stack Technologique

| Couche           | Technologie    | Rôle                                      |
| ---------------- | -------------- | ----------------------------------------- |
| Backend          | Laravel 12     | Framework principal                       |
| Base de données  | SQLite         | Base de données de développement          |
| ORM              | Eloquent       | Interactions avec la base de données      |
| Templating       | Blade          | Rendu côté serveur                        |
| CSS              | Tailwind CSS   | Style et design                           |
| Authentification | Laravel Breeze | Structure de base pour l'authentification |

## Étapes de Développement

1. **Configuration** : Créer le projet, installer Breeze pour l'authentification
2. **Base de données** : Créer les migrations pour les tâches et les catégories
3. **Modèles** : Définir les modèles Eloquent et leurs relations
4. **Routes** : Définir les routes web pour toutes les pages
5. **Contrôleurs** : Créer les contrôleurs avec les méthodes CRUD
6. **Vues** : Construire les templates Blade avec Tailwind CSS
7. **Validation** : Ajouter la validation des formulaires
8. **Autorisation** : S'assurer que les utilisateurs n'accèdent qu'à leurs propres données
9. **Finitions** : Ajouter les filtres, la recherche et les statistiques

## Configuration du Projet

Commençons par créer le projet :

```bash
# Créer un nouveau projet Laravel
laravel new task-manager

# Aller dans le dossier du projet
cd task-manager

# Installer Laravel Breeze pour l'authentification
composer require laravel/breeze --dev

# Installer Breeze avec Blade (configuration simple)
php artisan breeze:install blade

# Installer les dépendances NPM (frontend)
npm install

# Exécuter les migrations (crée les tables de base dont celle des utilisateurs)
php artisan migrate

# Démarrer le serveur de développement
composer run dev
```

Visitez maintenant http://localhost:8000 - vous devriez voir la page d'accueil de Laravel avec des liens "Register" (S'inscrire) et "Log in" (Se connecter) fonctionnels !

## Ce que vous offre Breeze

Laravel Breeze fournit d'emblée :

- **Page d'inscription** sur `/register`
- **Page de connexion** sur `/login`
- **Flux de réinitialisation de mot de passe**
- **Vérification d'e-mail** (optionnel)
- **Gestion du profil** sur `/profile`
- **Tableau de bord** (Dashboard) sur `/dashboard`
- **Style Tailwind CSS** intégré
- **Alpine.js** pour l'interactivité frontend

## Prochaines Étapes

Avec l'authentification en place, nous allons :

1. Créer la structure de la base de données
2. Construire les modèles Task et Category
3. Créer les contrôleurs et les vues
4. Ajouter la logique métier

Commençons à construire !

## Ressources

- [Laravel Breeze](https://laravel.com/docs/12.x/starter-kits#laravel-breeze) — Documentation officielle du kit de démarrage d'authentification Laravel Breeze

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
