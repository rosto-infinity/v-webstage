---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-notifications-introduction"
---

# Introduction aux Notifications

Le système de notifications de Laravel fournit une API unifiée, élégante et expressive pour envoyer de petits messages d'information à travers divers canaux : Email, SMS (via Vonage), Slack, dans votre Base de Données, et bien d'autres (Discord, Telegram...).

## Créer une Notification

```bash
php artisan make:notification InvoicePaid
```

Cela génère le fichier `app/Notifications/InvoicePaid.php`. Regardez comme c'est simple !

```php
<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue; // <--- OUI ! Les Notifs peuvent être envoyées en arrière-plan !
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Invoice $invoice
    ) {}

    /**
     * Canaux de Notification.
     * Détermine PAR QUEL(S) MOYEN(S) cette notif doit être envoyée.
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database']; // Enverra un Mail ET enregistrera en BDD
    }

    /**
     * Représentation "Email" de la notification.
     * Pas besoin de créer une Vue (Blade), Laravel le fait pour vous !
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Facture Acquittée')
            ->greeting('Bonjour !')
            ->line('Votre facture a bien été payée.')
            ->line('Montant : ' . number_format($this->invoice->amount, 2) . ' €')
            ->action('Voir la Facture', url('/invoices/' . $this->invoice->id))
            ->line('Merci pour votre confiance !');
    }

    /**
     * Représentation "Base de Données" (ou Tableau JSON).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'amount' => $this->invoice->amount,
            'message' => 'La facture #' . $this->invoice->number . ' a été payée.',
        ];
    }
}
```

## Envoyer des Notifications

### Via le Trait "Notifiable" (Méthode Recommandée)

Si votre Modèle (ex: `User`) utilise le trait `Illuminate\Notifications\Notifiable` (c'est le cas par défaut), vous pouvez envoyer la notif directement dessus :

```php
use App\Notifications\InvoicePaid;

// Envoie la notif à CE client précis
$user->notify(new InvoicePaid($invoice));
```

### Via la Facade (Pratique pour le multi-envoi)

```php
use Illuminate\Support\Facades\Notification;

// Envoie la MÊME notif à une COLLECTION entière d'utilisateurs
Notification::send($users, new InvoicePaid($invoice));

// "On-Demand Notifications" : Envoyer à quelqu'un qui N'EST PAS en base de données !
Notification::route('mail', 'comptable-externe@entreprise.com')
    ->route('slack', 'https://hooks.slack.com/...')
    ->notify(new InvoicePaid($invoice));
```

## Les Canaux de Notification (Channels)

### Rendre la méthode `via()` intelligente

La méthode `via()` reçoit l'objet `$notifiable` (souvent le `User`). Vous pouvez donc personnaliser les canaux selon ses préférences !

```php
public function via(object $notifiable): array
{
    // Option 1 : Toujours par email
    return ['mail'];

    // Option 2 : Basé sur les préférences du User en Base de données !
    // S'il a cliqué "Je veux des SMS", on renvoie ['vonage']
    return $notifiable->notification_preferences;

    // Option 3 : Canaux Conditionnels selon les données métiers
    $channels = ['database'];

    if ($notifiable->wants_email) {
        $channels[] = 'mail'; // On lui envoie un mail s'il a coché la case "Abonné"
    }

    if ($this->invoice->amount > 1000) {
        $channels[] = 'slack'; // On prévient le patron sur Slack si c'est une très grosse facture !
    }

    return $channels;
}
```

## Notifications par Email (Mail Notifications)

Les méthodes fluides (builder) de `MailMessage` permettent de construire des emails magnifiques en 3 lignes de code.

```php
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->subject('Commande Expédiée')
        ->greeting('Bonjour ' . $notifiable->name . ' !')
        ->line('Votre commande a été préparée et remise au transporteur.')
        ->line('Numéro de suivi : ' . $this->order->tracking_number)
        ->action('Suivre mon colis', url('/orders/' . $this->order->id))
        ->line('Merci pour vos achats sur notre boutique !')
        ->salutation('Bien cordialement, L\'Équipe');
}

// Option A : Utiliser une VRAIE VUE BLADE personnalisée si le design par défaut ne vous va pas
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->subject('Votre Facture')
        ->view('emails.invoices.monthly', [
            'invoice' => $this->invoice,
            'user' => $notifiable,
        ]);
}

// Option B : Les Pièces Jointes !
public function toMail(object $notifiable): MailMessage
{
    return (new MailMessage)
        ->subject('Rapport Mensuel')
        ->line('Veuillez trouver ci-joint votre rapport mensuel comptable.')
        ->attach('/path/to/report.pdf') // Attacher un fichier physique
        ->attachData($this->pdfData, 'rapport.pdf', [ // Attacher des octets bruts générés en RAM
            'mime' => 'application/pdf',
        ]);
}
```

## Notifications en Base de Données (Database Notifications)

Très utile pour créer le fameux "Menu Cloche" en haut à droite de votre tableau de bord, comme sur Facebook !

Pour l'activer, il faut créer la table qui stockera ces cloches :

```bash
php artisan make:notifications-table
php artisan migrate
```

Assurez-vous que votre modèle `User` contient bien le trait :

```php
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable; // <--- Indispensable pour la BDD
}
```

### Lire et Manipuler les Notifications (Côté Back-end)

Le trait `Notifiable` inclut une vraie relation Eloquent (HasMany) cachée :

```php
// Obtenir TOUTES les notifications (anciennes et récentes)
$notifications = $user->notifications;

// Extraire UNIQUEMENT Celles que l'utilisateur n'a pas encore "vues" (Unread)
$unread = $user->unreadNotifications;

// Tout marquer comme "Lu" d'un seul coup ! (Idéal pour le bouton "Tout marquer comme lu")
$user->unreadNotifications->markAsRead();

// Marquer UNE seule notification comme lue
$notification->markAsRead();

// Supprimer les notifications vieilles de plus d'un mois
$user->notifications()->where('created_at', '<', now()->subMonth())->delete();
```

### Les afficher côté Visuel (Blade)

Le tableau retourné par `toArray()` (ou `toDatabase()`) dans votre classe Notification est stocké en JSON dans la base de données. Il est décodé automatiquement pour vous via `$notification->data`.

```blade
@foreach($user->unreadNotifications as $notification)
    <div class="alert alert-info">
        <!-- Accéder aux valeurs JSON -->
        {{ $notification->data['message'] }}

        <!-- Accéder à la date de création en langage humain (ex: "Il y a 2 heures") -->
        <small class="text-muted">{{ $notification->created_at->diffForHumans() }}</small>
    </div>
@endforeach
```

## Ressources

- [Système de Notifications](https://laravel.com/docs/12.x/notifications) — Documentation officielle détaillée.

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
