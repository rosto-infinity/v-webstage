La gestion des sauvegardes de bases de données est une tâche critique dans le développement d'applications. Plutôt que de dépendre de solutions externes, vous pouvez intégrer ce processus directement dans votre application Laravel en utilisant les commandes Artisan. Cela vous permet d'avoir un contrôle total sur l'ensemble du flux de travail de sauvegarde et de restauration.

Dans cet article, nous allons créer un ensemble de commandes qui vous permettront de sauvegarder et de restaurer votre base de données directement depuis la ligne de commande ou via une interface web.

Étape 1 : Créer la commande de sauvegarde
La première étape consiste à générer une commande Artisan qui va se connecter à votre base de données et en faire une copie de secours. Nous utiliserons mysqldump, un outil en ligne de commande standard pour les bases de données MySQL.

Tout d'abord, générez le fichier de commande avec l'outil artisan :

php artisan make:command DBBackup

Copier
Maintenant, modifions le fichier DBBackup.php pour inclure la logique de sauvegarde. Le code ci-dessous utilise le Process facade de Laravel pour exécuter la commande mysqldump et le Storage facade pour gérer les chemins de fichiers de manière sécurisée.

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

class DBBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:dbbackup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates a backup of the MySQL database.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Définit le chemin du fichier de sauvegarde.
        // Utilise l'année-mois-jour et l'heure-minute-seconde pour un nom de fichier unique.
        $path = Storage::path("backup/" . now()->format("Y-m-d_H-i-s") . ".gz");

        // Crée la commande mysqldump. On utilise gzip pour compresser le fichier.
        $command = "mysqldump --user=" . env("DB_USERNAME") . " --password=" . env("DB_PASSWORD") . " --host=" . env('DB_HOST') . " " . env('DB_DATABASE') . " | gzip > " . $path;

        // Exécute la commande et vérifie son succès.
        $process = Process::run($command);

        if ($process->successful()) {
            $this->info("Backup created successfully at: " . basename($path));
        } else {
            $this->error("Backup failed. Error: " . $process->errorOutput());
        }
    }
}

Copier
Vous pouvez maintenant lancer votre commande depuis le terminal :

Étape 2 : Créer la commande de restauration
La sauvegarde est une étape essentielle, mais la restauration est tout aussi importante. Nous allons créer une nouvelle commande Artisan capable de prendre un fichier de sauvegarde compressé et de restaurer la base de données à partir de celui-ci.

Création de la commande
Pour commencer, générez une nouvelle commande Artisan :

php artisan make:command RestoreDB

Copier
Édition du fichier RestoreDB.php
Ouvrez le fichier généré (app/Console/Commands/RestoreDB.php) et ajoutez la logique pour restaurer la base de données à partir d'un fichier de sauvegarde compressé. Voici un exemple de code :

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class RestoreDB extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:restoredb {backupFile}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Restore the database from a compressed backup file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $backupFile = $this->argument('backupFile');

        // Vérifiez si le fichier de sauvegarde existe
        if (!Storage::exists($backupFile)) {
            $this->error("Le fichier de sauvegarde n'existe pas.");
            return;
        }

        // Décompressez le fichier de sauvegarde
        $process = new Process(['gunzip', '-c', storage_path('app/' . $backupFile)]);
        $process->run();

        if (!$process->isSuccessful()) {
            $this->error('La décompression a échoué.');
            return;
        }

        // Importez la base de données
        $process = new Process(['mysql', '-u', env('DB_USERNAME'), '-p' . env('DB_PASSWORD'), env('DB_DATABASE')]);
        $process->setInput($process->getOutput());
        $process->run();

        if ($process->isSuccessful()) {
            $this->info('La base de données a été restaurée avec succès.');
        } else {
            $this->error('La restauration a échoué.');
        }
    }
}

Copier
Utilisation de la commande
Vous pouvez maintenant utiliser la commande comme suit, en spécifiant le chemin de votre fichier de sauvegarde :

php artisan app:restoredb storage/app/backup/2025-07-02_10-23-56.gz

Copier
Étape 3 : Créer une interface web (facultatif)
Pour rendre la gestion des sauvegardes et restaurations accessible via une interface web, vous pouvez créer un contrôleur qui exécute ces commandes Artisan via des appels de méthode.

Création du contrôleur
Générez un contrôleur dédié :

php artisan make:controller Settings/DBBackupController

Copier
Ajout des méthodes
Ajoutez les méthodes nécessaires pour lister les fichiers de sauvegarde et déclencher une restauration. Voici un exemple :

<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Process\Process;

class DBBackupController extends Controller
{
    /**
     * Affiche la liste des fichiers de sauvegarde.
     */
    public function index()
    {
        $backups = Storage::files('backup');
        return view('settings.db-backup', compact('backups'));
    }

    /**
     * Restaure la base de données à partir d'un fichier de sauvegarde.
     */
    public function restore(Request $request)
    {
        $backupFile = $request->input('backupFile');

        $process = new Process(['php', 'artisan', 'app:restoredb', $backupFile]);
        $process->run();

        if ($process->isSuccessful()) {
            return redirect()->back()->with('success', 'La base de données a été restaurée avec succès.');
        } else {
            return redirect()->back()->with('error', 'La restauration a échoué.');
        }
    }
}


Conclusion
Vous disposez maintenant d'un système complet pour gérer vos sauvegardes et restaurations de bases de données, entièrement intégré à votre application Laravel. Ce système peut être déclenché manuellement depuis le terminal ou programmatiquement via une interface web, offrant une grande flexibilité.

Pour aller plus loin, vous pourriez envisager de :

Planifier des sauvegardes automatiques via les tâches planifiées de Laravel.

Configurer l'envoi de vos sauvegardes vers un service de stockage externe comme Amazon S3 ou DigitalOcean Spaces.

Ajouter une validation plus robuste pour vous assurer que les fichiers de sauvegarde sont valides avant la restauration.

Ces améliorations renforceront la fiabilité et la sécurité de votre système de gestion des bases de données.