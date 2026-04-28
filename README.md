# webStage

**webStage** est une application de suivi de présence développée avec Laravel 13, Inertia.js v3, Vue 3, Tailwind CSS v4, et Chart.js.

---

## 📦 Technologies

- **Back-end** :
  - PHP ≥ 8.3
  - Laravel 13.4+
  - Inertia.js v3 (inertiajs/inertia-laravel ^3.0)
  - Wayfinder (routage côté client) ^0.1.14
  - DomPDF ^3.1
  - Maatwebsite Excel ^3.1
- **Front-end** :
  - Vue.js ^3.5.13
  - @inertiajs/vue3 ^3.0.0
  - Tailwind CSS v4.2.4
  - Chart.js ^4.5.0 via `chart.js` et `vue-chartjs` ^5.3.2
  - lucide-vue-next ^0.468.0 (icônes)
- **Outils & dev** :
  - Vite ^6.0.0, Laravel Vite Plugin ^3.0.0
  - TypeScript ^5.2.2
  - tailwind-merge ^3.2.0, clsx ^2.1.1
  - fakerphp/faker ^1.23, pestphp/pest ^4.1, mockery/mockery ^1.6, laravel/pint ^1.18…
  - sail ^1.41, collision ^8.6, …etc.
  - **Environnement & dev** :
    - Linux Mint
    - Serveur Nginx
    - Docker (via Laravel Sail)
    - Composer
    - Node.js (>= v20.0.0)
    - MySQL 8.0 (ou MariaDB)
    - SQLite (pour les tests)

---

## 🛠️ Migration `presences`

La table `presences` est définie comme suit :

```php
$table->id();
$table->foreignId('user_id')->constrained()->onDelete('cascade');
$table->date('date');
$table->time('arrival_time')->nullable();
$table->time('departure_time')->nullable();
$table->integer('late_minutes')->default(0);
$table->boolean('absent')->default(false);
$table->boolean('late')->default(false);
$table->timestamps();
```

---

## 🚀 Installation

Clone le dépôt :

```bash
git clone <repo-url> webStage
cd webStage
```

Installe les dépendances composer & npm :

```bash
composer install
npm install
```

Configure l’environnement :

```bash
cp .env.example .env
php artisan key:generate
# renseigne tes identifiants DB…
```

Crée la base et lance la migration :

```bash
php artisan migrate
```

(Optionnel) Remplis avec des données de test via factory + seeder :

```bash
php artisan db:seed
```

Compile les assets et démarre le serveur :

```bash
npm run dev
# Dans un autre terminal
php artisan serve
```

---

## 🧩 Fonctionnalités

- Authentification Laravel native (Inertia v3)
- CRUD complet des présences (utilisateurs, status, dates, heures, retards…)
- Dashboard interactif avec statistiques graphiques :
  - Répartition des présences du jour (Pie Chart)
  - Statistiques hebdomadaires (Bar Chart)
  - Tendance mensuelle (Line Chart)
- Export des données en format Excel et PDF
- Export ZIP de tous les PDFs utilisateurs
- Interface moderne et responsive avec Tailwind CSS v4
- Navigation fluide et typée avec **Wayfinder**

---

## 💡 Utilisation

- **Présences** : accès via le menu latéral ou `/presences`
- **Dashboard** : statistiques en temps réel avec filtrage par date
- **Administration** : gestion des utilisateurs et des sauvegardes de base de données

---

## 🧪 Tests & qualité

- Tests unitaires et features avec **Pest**
- Analyse statique avec **PHPStan** et **Larastan**
- Refactorisation automatisée avec **Rector**
- Formatage du code avec **Laravel Pint** et **Prettier**

---

## 📄 Licence

MIT License - voir le fichier LICENSE.

---

## 📞 Contact
- **Waffo lele rostand**
- **+2376 915 848 19**
