---
source_course: "laravel-queues-jobs"
source_lesson: "laravel-queues-jobs-events-introduction"
---

# Introduction aux Événements (Events)

Les événements fournissent une implémentation simple du patron de conception (design pattern) "Observateur". Ils vous permettent de "publier" un événement n'importe où dans votre code, auquel d'autres parties de votre application peuvent "s'abonner" et réagir, sans qu'elles aient besoin de se connaître directement.

## Pourquoi utiliser les Événements ?

Pour découpler (séparer) votre code métier et éviter qu'une seule fonction ne fasse des dizaines de choses.

```text
Sans Événements (Code très couplé) :        Avec Événements (Découplé) :
┌───────────────────────┐                   ┌───────────────────────┐
│   OrderController     │                   │   OrderController     │
│                       │                   │                       │
│ - Traiter le paiement │                   │ - Traiter le paiement │
│ - Envoyer confirmation│                   │ - Lancer l'Événement  │
│ - Déduire les stocks  │                   │   'CommandePassée'    │
│ - Prévenir l'entrepôt │                   └───────────────────────┘
│ - Ajouter aux stats   │                              │
│ - Envoyer au CRM      │                              ▼
│   (Une énorme usine   │                   ┌────────────────────────┐
│    à gaz !)           │                   │ Événement: OrderPlaced │
└───────────────────────┘                   └────────────────────────┘
                                                       │
                                ┌──────────────────────┼──────────────────────┐
                                ▼                      ▼                      ▼
                         ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
                         │ Écouteur 1  │        │ Écouteur 2  │        │ Écouteur 3  │
                         │(SendEmail)  │        │(UpdateStock)│        │(Analytics)  │
                         └─────────────┘        └─────────────┘        └─────────────┘
```

## Créer des Événements

```bash
php artisan make:event OrderPlaced
```

Cela crée un fichier très simple `app/Events/OrderPlaced.php`.
Un "Événement" en Laravel est souvent juste une coquille vide qui transporte des données publiques.

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets; // Pour les WebSockets (Pusher/Reverb)
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels; // Identique aux Jobs : Ne stocke que l'ID de l'objet

class OrderPlaced
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Stocke publiquement la commande qui vient d'être passée.
     * C'est tout ce que fait un Événement : Transporter des données aux Écouteurs.
     */
    public function __construct(
        public Order $order
    ) {}
}
```

## Créer des Écouteurs (Listeners)

Les écouteurs contiennent la _vraie logique_ qui réagit à l'événement.

```bash
php artisan make:listener SendOrderConfirmation --event=OrderPlaced
```

Cela crée `app/Listeners/SendOrderConfirmation.php` :

```php
<?php

namespace App\Listeners;

use App\Events\OrderPlaced; // Il connaît l'événement qu'il doit écouter
use App\Notifications\OrderConfirmation;

class SendOrderConfirmation
{
    /**
     * Cette méthode 'handle' est lancée automatiquement dès que l'événement a lieu.
     * Laravel lui donne l'objet Événement en argument, qui contient la fameuse $order !
     */
    public function handle(OrderPlaced $event): void
    {
        // On envoie le mail de confirmation
        $event->order->user->notify(
            new OrderConfirmation($event->order)
        );
    }
}
```

## Enregistrer la Liaison (Événements -> Écouteurs)

Historiquement, Laravel exigeait qu'on "déclare" quels écouteurs réagissaient à quels événements dans `EventServiceProvider`.
Depuis Laravel 11, la découverte automatique des événements fait le travail toute seule ! _(Laravel scanne vos paramètres typés)._

Cependant, si vous avez besoin de le brancher manuellement (ex: dans `AppServiceProvider`) :

```php
use App\Events\OrderPlaced;
use App\Listeners\SendOrderConfirmation;
use App\Listeners\UpdateInventory;
use Illuminate\Support\Facades\Event;

public function boot(): void
{
    // Dès qu'une OrderPlaced a lieu, lance l'écouteur SendOrderConfirmation
    Event::listen(
        OrderPlaced::class,
        SendOrderConfirmation::class
    );

    // ET lance AUSSI cet autre écouteur
    Event::listen(
        OrderPlaced::class,
        UpdateInventory::class
    );
}
```

### Écouteurs Anonymes (Closures)

Pour les toutes petites actions (comme logger), vous n'avez pas besoin de créer une classe Listener entière :

```php
Event::listen(function (OrderPlaced $event) {
    Log::info('Nouvelle commande passée en boutique !', ['order_id' => $event->order->id]);
});
```

## Publier (Lancer) des Événements

C'est extrêmement épuré dans votre code principal :

```php
use App\Events\OrderPlaced;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        // 1. On sauvegarde l'essentiel
        $order = Order::create($request->validated());

        // 2. On CRÉE un événement en lui passant la $order, puis on le propage (`dispatch()`)
        OrderPlaced::dispatch($order);

        // (Alternative procédurale plus ancienne :)
        // event(new OrderPlaced($order));

        // 3. Et on quitte directement ! Le code est très propre.
        return redirect()->route('orders.show', $order);
    }
}
```

## Mettre les Écouteurs en File d'Attente (Queued Listeners)

De base, quand un événement (`OrderPlaced::dispatch`) est lancé, tous les écouteurs s'exécutent **synchronement** de suite, ce qui bloque le retour de la page (comme si on n'avait rien fait) !

Pour dire "Ce listener est lent, envoie-le dans une File d'Attente de Worker", c'est magique : il suffit d'ajouter l'interface `ShouldQueue` à votre classe d'Écouteur.

```php
<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue; // <--- LA MAGIE OPÈRE ICI

class UpdateInventory implements ShouldQueue
{
    public function handle(OrderPlaced $event): void
    {
        // Ce calcul de stock avec la BDD se fera silencieusement en arrière-plan
        // par le processus php artisan queue:work !
        foreach ($event->order->items as $item) {
            $item->product->decrement('stock', $item->quantity);
        }
    }
}
```

### Configuration Avancée du Queued Listener

Exactement comme pour les Tâches (Jobs), un Écouteur en file d'attente peut être hyper-configuré :

```php
class UpdateInventory implements ShouldQueue
{
    public $connection = 'redis';
    public $queue = 'inventory'; // Forcer une file spécifique
    public $delay = 10;  // Attendre 10 secondes après l'événement avant d'exécuter

    // Si vous préférez des méthodes dynamiques :
    public function viaQueue(): string
    {
        return 'inventory';
    }

    // Le plus fort : Déterminer dynamiquement s'il FAUT le mettre en queue ou pas
    public function shouldQueue(OrderPlaced $event): bool
    {
        // On ne met à jour l'inventaire en différé QUE SI la commande dépasse 100€
        return $event->order->total > 100;
    }
}
```

## Abonnés aux Événements (Event Subscribers)

Plutôt que d'avoir un fichier `Listener` pour la Création d'un article, un autre `Listener` pour la Suppression d'un article... on regroupe tout !
Un abonné est une grosse classe capable d'intercepter PLUSIEURS événements et d'y réagir.

```php
<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use App\Events\OrderShipped;
use App\Events\OrderCancelled;
use Illuminate\Events\Dispatcher;

class OrderEventSubscriber
{
    // Ce qu'il fait quand une commande est passée
    public function handleOrderPlaced(OrderPlaced $event): void
    {
        Log::info('OrderPlaced intercepté');
    }

    // Ce qu'il fait quand expédiée
    public function handleOrderShipped(OrderShipped $event): void
    {
        Log::info('OrderShipped intercepté');
    }

    /**
     * Enregistre les abonnements de la classe.
     * C'est SON rôle de dire à Laravel ce qu'elle écoute.
     */
    public function subscribe(Dispatcher $events): void
    {
        $events->listen(
            OrderPlaced::class,
            [self::class, 'handleOrderPlaced']
        );

        $events->listen(
            OrderShipped::class,
            [self::class, 'handleOrderShipped']
        );
    }
}
```

Pour inscrire ce Subscriber géant, dans `AppServiceProvider` :

```php
use Illuminate\Support\Facades\Event;
Event::subscribe(OrderEventSubscriber::class);
```

## Ressources

- [Événements (Events)](https://laravel.com/docs/12.x/events) — Documentation officielle des Événements Laravel

---

> 📘 _Cette leçon fait partie du cours [Traitement en Arrière-plan dans Laravel](/laravel/laravel-queues-jobs/) sur la plateforme d'apprentissage RostoDev._
