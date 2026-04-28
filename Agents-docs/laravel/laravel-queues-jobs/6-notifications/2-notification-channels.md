---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-notification-channels"
---

# Canaux de Notification Personnalisés (Custom Notification Channels)

Laravel supporte de nombreux canaux de notification au-delà de l'email et de la base de données. Explorons Slack, les SMS (Vonage), et la création de canaux sur mesure.

## Notifications Slack

Le grand classique pour notifier l'équipe d'une nouvelle vente, d'une erreur critique ou d'un nouvel inscrit.

```bash
composer require laravel/slack-notification-channel
```

```php
use Illuminate\Notifications\Messages\SlackMessage;

public function via(object $notifiable): array
{
    return ['slack'];
}

public function toSlack(object $notifiable): SlackMessage
{
    // Construire un message riche pour Slack
    return (new SlackMessage)
        ->success()  // Barre verte sur le côté (ou ->warning() jaune, ->error() rouge)
        ->content('Une Facture a été payée !')
        ->attachment(function ($attachment) {
            $attachment->title('Facture #' . $this->invoice->number)
                ->fields([
                    'Montant' => $this->invoice->amount . ' €',
                    'Client' => $this->invoice->customer->name,
                ]);
        });
}
```

**Configuration de l'URL Webhook Slack :**
Comment Laravel sait sur quel serveur Slack envoyer le message ?

```php
// Dans le modèle User, ou n'importe quel modèle "Notifiable"
public function routeNotificationForSlack(): string
{
    // L'URL secrète fournie par Slack lors de la création d'un "Incoming Webhook"
    return 'https://hooks.slack.com/services/...';
}
```

## Notifications SMS (avec Vonage/Nexmo)

Pratique pour la vérification à 2 facteurs (2FA) ou une alerte de livraison urgente.

```bash
composer require laravel/vonage-notification-channel
```

```php
use Illuminate\Notifications\Messages\VonageMessage;

public function via(object $notifiable): array
{
    return ['vonage'];
}

public function toVonage(object $notifiable): VonageMessage
{
    // Les SMS coûtent cher et sont limités à 160 caractères, soyons brefs !
    return (new VonageMessage)
        ->content('Votre colis est en route ! Suivi : ' . $this->order->tracking);
}

// Dans le modèle User (Comment Laravel trouve son numéro ?)
public function routeNotificationForVonage(): string
{
    // Retourner la colonne de la base de données qui contient le numéro de téléphone international
    return $this->phone_number;
}
```

## Notifications de Diffusion Temps Réel (Broadcast)

Pour faire apparaître une notification _instantanément_ sur l'écran de l'utilisateur (via WebSockets / Laravel Reverb ou Pusher) sans avoir besoin de rafraîchir la page (F5).

```php
use Illuminate\Notifications\Messages\BroadcastMessage;

public function via(object $notifiable): array
{
    // Souvent couplé à 'database' pour que la notif persiste s'il rafraîchit la page après !
    return ['broadcast', 'database'];
}

public function toBroadcast(object $notifiable): BroadcastMessage
{
    return new BroadcastMessage([
        'invoice_id' => $this->invoice->id,
        'amount' => $this->invoice->amount,
        'message' => 'Nouvelle facture réglée !', // Ce JSON partira directement dans le navigateur en JS
    ]);
}
```

_Côté JavaScript (Front-end) :_

```javascript
Echo.private(`App.Models.User.${userId}`).notification((notification) => {
  // Faire apparaître un Toast (bulle verte) en direct !
  console.log(notification.message);
});
```

## Créer vos Propres Canaux (Custom Channels)

L'API de Telegram (ou de n'importe quel service webhook) n'est pas supportée nativement ? Créez la vôtre en 3 minutes.

1. Créez une classe qui représente le Canal (Celui qui s'occupe du transport physique) :

```php
<?php

namespace App\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Http;

class TelegramChannel
{
    /**
     * Chaque "Channel" personnalisé DOIT avoir une méthode send()
     */
    public function send($notifiable, Notification $notification)
    {
        // On demande à la notification "Donne-moi ta version Telegram"
        $message = $notification->toTelegram($notifiable);

        // On cherche le numéro d'identifiant de la personne
        $chatId = $notifiable->routeNotificationFor('telegram');

        // On fait une requête HTTP toute bête vers l'API de Telegram !
        Http::post('https://api.telegram.org/bot'.config('services.telegram.token').'/sendMessage', [
            'chat_id' => $chatId,
            'text' => $message->content,
        ]);
    }
}
```

2. Utilisez-le dans vos Notifications :

```php
use App\Channels\TelegramChannel;

public function via(object $notifiable): array
{
    // Au lieu d'une chaîne ('mail'), on passe le nom de classe complet du Canal
    return [TelegramChannel::class];
}

// Et on a juste à créer la méthode "toTelegram" correspondante
public function toTelegram(object $notifiable)
{
    // TelegramMessage est une petite classe simple que vous créez pour encapsuler du texte
    return new TelegramMessage('Votre commande a été expédiée !');
}
```

## Mettre les Notifications en File d'Attente (Queued Notifications)

Un e-mail prend 2 secondes à partir, un SMS 1 seconde, la Base de données 0.1s. Si vous envoyez les 3 sur la même requête, l'utilisateur va attendre 3 secondes avant que sa page ne se recharge.

**Mettez-les en fond !** Ajoutez simplement `implements ShouldQueue` et le Trait `Queueable`.

```php
class InvoicePaid extends Notification implements ShouldQueue
{
    use Queueable;

    // -- Options de Queue pour la Notification (Comme les Jobs) --

    public $connection = 'redis';
    public $queue = 'notifications';
    public $delay = 60;  // Partira discrètement dans 1 minute

    /**
     * Condition dynamique d'annulation (Évite de polluer la file pour rien)
     */
    public function shouldSend(object $notifiable, string $channel): bool
    {
        // Si l'utilisateur a désactivé les notifications, la tâche est tuée
        return (bool) $notifiable->wants_notifications;
    }
}
```

## Événements de Notification (Notification Events)

Savoir si une notification est bien partie ou a planté en tapant dans l'API de Vonage :

```php
use Illuminate\Notifications\Events\NotificationSent;
use Illuminate\Notifications\Events\NotificationFailed;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;

// Dans AppServiceProvider :
Event::listen(NotificationSent::class, function ($event) {
    Log::info('Notification envoyée avec succès', [
        'notifiable' => $event->notifiable->email ?? 'Inconnu',
        'notification' => get_class($event->notification),
        'channel' => $event->channel, // 'mail', 'slack', etc.
    ]);
});

Event::listen(NotificationFailed::class, function ($event) {
    Log::error('Mince ! Échec de la notification', [
        'exception' => $event->exception->getMessage(),
    ]);
});
```

## L'Exemple Ultime Multi-Canal

Voici une classe robuste, digne de la production, qui route intelligemment le message en fonction du contexte et des données :

```php
<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Messages\SlackMessage;
use Illuminate\Notifications\Notification;

class OrderShipped extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Order $order
    ) {}

    public function via(object $notifiable): array
    {
        // 1. Minimum syndical garanti pour tout le monde
        $channels = ['mail', 'database'];

        // 2. Si le client a configuré un webhook d'équipe Slack
        if ($notifiable->slack_webhook_url) {
            $channels[] = 'slack';
        }

        // 3. Si la commande dépasse 100€ ET qu'il a un numéro de téléphone, SMS premium !
        if ($notifiable->phone && $this->order->total > 100) {
            $channels[] = 'vonage';
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Votre commande est en route !')
            ->greeting('Bonne nouvelle, ' . $notifiable->name . ' !')
            ->line('Votre commande #' . $this->order->number . ' a été expédiée.')
            ->line('Suivi : ' . $this->order->tracking_number)
            ->action('Suivre le Colis', url('/orders/' . $this->order->id))
            ->line('Merci pour vos achats sur notre boutique !');
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->success()
            ->content('Commande expédiée au client !')
            ->attachment(function ($attachment) {
                $attachment->title('Commande #' . $this->order->number)
                    ->fields([
                        'Client' => $this->order->user->name,
                        'Total' => $this->order->total . ' €',
                        'Suivi' => $this->order->tracking_number,
                    ]);
            });
    }

    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'message' => 'Commande #' . $this->order->number . ' expédiée ! (Suivi: ' . $this->order->tracking_number . ')',
            'tracking' => $this->order->tracking_number,
        ];
    }
}
```

## Ressources

- [Canaux de Notification (Notification Channels)](https://laravel.com/docs/12.x/notifications#specifying-delivery-channels) — Documentation
- [Laravel Notification Channels Website](https://laravel-notification-channels.com/) — Site communautaire listant des dizaines de canaux clés en main (Discord, Telegram, Twitter, etc.).

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
