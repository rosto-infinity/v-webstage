# 🚀 Guide de Déploiement : Rôles & Permissions

Ce document récapitule les étapes essentielles pour déployer la gestion des rôles et permissions Spatie sur l'environnement de production.

## 1. Mise à jour de la Base de Données

Ces commandes doivent être exécutées à chaque fois que vous modifiez les fichiers de Seeders ou de Migrations.

```bash
# Force l'exécution des migrations (structure DB)
php artisan migrate --force

# Force l'exécution des seeders (création des permissions/rôles)
# Le PermissionsSeeder est idempotent : il ne crée pas de doublons.
php artisan db:seed --class=PermissionsSeeder --force
```

## 2. Nettoyage du Cache

Spatie met en cache les permissions. Il est **impératif** de vider ce cache après toute modification (ajout de permission, changement de rôle).

```bash
php artisan permission:cache-reset
```

Puis, optimisez l'application :

```bash
php artisan optimize
```

## 3. Attribution du Rôle SuperAdmin (Première fois)

En production, vous ne pouvez pas vous attribuer le rôle SuperAdmin via l'interface si vous n'avez pas encore d'accès. Vous devez utiliser **Tinker**.

### Étapes via Tinker

1.  Ouvrez la console interactive Tinker sur le serveur :

    ```bash
    php artisan tinker

    php artisan tinker --execute="echo App\Models\User::all(['id', 'name', 'email']);"


    php artisan tinker --execute="App\Models\User::where('name', 'like', '%waffo rosto%')->first(['id', 'name', 'email']);" '%waffo rosphp artisan tinker --execute="App\Models\User::where('name', 'like', '%waffo rosto%')->first(['id', 'name', 'email']);" '%waffo rosphp artisan tinker --execute="App\Models\User::where('name', 'like', '%waffo rosto%')->first(['id', 'name', 'email']);" '%waffo rosphp artisan tinker --execute="echo App\Models\User::all(['id', 'name', 'email']);"
[{"id":1,"name":"Brandon Blake","email":"regyqi@mailinator.com"},{"id":2,"name":"Francesca Kline","email":"roga@mailinator.com"},{"id":3,"name":"waffo rostphp artisan tinker --execute="\$user = \App\Models\User::find(3); echo 'Current Roles: ' . \$user->getRoleNames() . PHP_EOL; \$user->assignRole('superadmin'); echo 'New Roles: ' . \$user->getRoleNames();"@mailinator.com"}]
Current Roles: []in'); echo 'New Roles: ' . \$user->getRoleNames();" \$user->assi
New Roles: ["superadmin"]
    ```

2.  Exécutez les commandes suivantes (adaptez l'adresse email) :

    ```php
    // 1. Trouver votre utilisateur
    $user = \App\Models\User::where('email', 'votre@email.com')->first();

    // Exemple si vous connaissez l'ID (ex: 3)
    // $user = \App\Models\User::find(3);

    // 2. Assigner le rôle ultime
    $user->assignRole('superadmin');

    // 3. Vérifier que c'est pris en compte
    $user->getRoleNames();
    // Sortie attendue : ["superadmin"]

    // 4. Quitter
    exit
    ```

3.  Videz le cache une dernière fois par sécurité :
    ```bash
    php artisan permission:cache-reset
    ```

## 4. Gestion via l'Interface (Une fois connecté)

Une fois que vous avez le rôle `superadmin` :

1.  Accédez à **Dashboard Admin** > **Sécurité** > **Utilisateurs**.
2.  Vous pouvez désormais assigner des rôles (Admin, Manager, Commercial...) aux autres utilisateurs via l'interface graphique.

---

## Résumé des Rôles

- **🛡️ SuperAdmin** :
    - **Pouvoir** : Absolu. Peut tout voir, tout supprimer, tout modifier.
    - **Accès** : Dashboard SuperAdmin, Gestion des Rôles/Permissions, Logs.
    - **Usage** : Réservé aux développeurs et aux propriétaires techniques.

- **👤 Admin** :
    - **Pouvoir** : Gestion opérationnelle.
    - **Accès** : Dashboard Admin, Gestion des Utilisateurs (sauf SuperAdmin), CRM, Blog.
    - **Usage** : Gestionnaires du site au quotidien.

- **💼 Business Owner** :
    - **Pouvoir** : Gestion métier.
    - **Accès** : Module CRM complet (Clients, Événements, Relances).
    - **Usage** : Équipes commerciales et event managers.
