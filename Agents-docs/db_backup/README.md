# DB Backup — Documentation consolidée

Ce répertoire contient les éléments nécessaires à la gestion des sauvegardes et restaurations de la base de données pour l'application.

## Objectif
- Fournir des commandes Artisan pour créer et restaurer des sauvegardes compressées (.gz).
- Offrir une interface utilisateur Inertia/Vue pour lister, télécharger et déclencher des sauvegardes.

## Contenu des fichiers

- **articles.md** : Présentation pas-à-pas du concept, exemples d'implémentation et suggestions d'améliorations (planification, stockage externe, validations).
- **DBBackup.php.md** : Implémentation de la commande `app:dbbackup` (classe `App\\Console\\Commands\\DBBackup`). Crée un répertoire `private/backup`, génère un fichier compressé via `mysqldump | gzip` et le stocke.
- **RestoreDatabase.php.md** : Implémentation de la commande `app:restoredb {file}` (classe `App\\Console\\Commands\\RestoreDatabase`). Décompresse et restaure une sauvegarde via `gunzip | mysql`.
- **DBBackupController.php.md** : Contrôleur `App\\Http\\Controllers\\Settings\\DBBackupController` pour :
  - lister les fichiers de `private/backup`,
  - déclencher la commande de création de sauvegarde (`Artisan::call('app:dbbackup')`),
  - proposer le téléchargement d'un fichier via `Storage::download()`.
- **DbBackup.vue.md** : Composant Inertia/Vue3 affichant la table des sauvegardes, boutons pour créer et télécharger une sauvegarde, et formatage des tailles/dates.
- **settings.php.md** : Routes associées (`dbbackup`, `dbbackup.download`, `dbbackup.create`) à ajouter à vos routes.

## Utilisation rapide

1. Créer une sauvegarde (ligne de commande) :

```
php artisan app:dbbackup
```

2. Restaurer une sauvegarde (ligne de commande) :

```
php artisan app:restoredb storage/app/private/backup/<FICHIER>.gz
```

3. Via l'interface web (si intégrée) :
- Accéder à la page `settings/dbbackup` (route `dbbackup`).
- Cliquer sur « Créer une nouvelle sauvegarde » ou télécharger une sauvegarde existante.

## Bonnes pratiques et recommandations

- Sécuriser l'accès aux routes et aux fichiers (authentification, autorisations, stockage privé).
- Ne pas stocker d'identifiants en clair dans le dépôt. Utiliser `env()` et configurer correctement `config/database.php`.
- Planifier des sauvegardes automatisées via le scheduler (`app/Console/Kernel.php`).
- Envoyer les sauvegardes vers un stockage externe (S3, Backblaze) pour redondance.
- Tester régulièrement les restaurations sur une instance isolée.

## Que vérifier si ça ne fonctionne pas

- Présence des binaires `mysqldump`, `mysql`, `gunzip` sur le serveur.
- Droits d'écriture du dossier `storage` et existence du répertoire `private/backup`.
- Variables de configuration `database.connections.mysql.*` correctement renseignées.

## Fichiers sources
Voir les fichiers présents dans ce dossier pour le code complet et les exemples :

- [Agents-docs/db_backup/articles.md](Agents-docs/db_backup/articles.md)
- [Agents-docs/db_backup/DBBackup.php.md](Agents-docs/db_backup/DBBackup.php.md)
- [Agents-docs/db_backup/RestoreDatabase.php.md](Agents-docs/db_backup/RestoreDatabase.php.md)
- [Agents-docs/db_backup/DBBackupController.php.md](Agents-docs/db_backup/DBBackupController.php.md)
- [Agents-docs/db_backup/DbBackup.vue.md](Agents-docs/db_backup/DbBackup.vue.md)
- [Agents-docs/db_backup/settings.php.md](Agents-docs/db_backup/settings.php.md)

---

Si vous voulez, je peux :
- générer le `README.md` en français plus détaillé pour chaque méthode,
- créer des extraits de tests pour valider la création/téléchargement,
- proposer un patch pour envoyer les sauvegardes vers S3.
