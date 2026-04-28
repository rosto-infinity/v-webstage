---
source_course: "laravel-testing"
source_lesson: "laravel-testing-mocking-basics"
---

# Création d'Objets Fictifs dans Laravel (Mocking and Faking)

Le Mocking (ou la création de doublons de test) vous permet de remplacer les dépendances de votre code (comme une API externe ou l'envoi d'emails) par des "cascades" virtuelles. L'objectif ? Isoler complètement le code que vous êtes en train de tester. Mieux encore : Laravel fournit d'excellents _Fakes_ (Doublons officiels) pour la plupart de ses propres services !

## Pourquoi faire du Mocking ?

```text
Sans Mocking :                Avec Mocking :
┌──────────────┐              ┌──────────────┐
│   Ton Test   │              │   Ton Test   │
└──────────────┘              └──────────────┘
       │                             │
       ▼                             ▼
┌──────────────┐              ┌──────────────┐
│  Ton Service │              │  Ton Service │
└──────────────┘              └──────────────┘
       │                             │
       ▼                             ▼
┌──────────────┐              ┌──────────────┐
│  Vrai Serveur│              │  Faux Serveur│
│    Email     │              │  (Pas d'envoi│
└──────────────┘              └──────────────┘
  Lent, Risqué, Coûteux        Ultra-rapide, Isolé
```

## Les Fakes Intégrés (Built-in Fakes)

Laravel propose des "Doublons Officiels" (Fakes) d'une simplicité enfantine pour ses services courants :

### Mail Fake (Faux Serveur Mail)

```php
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeEmail;

public function test_l_email_de_bienvenue_est_bien_envoye(): void
{
    // 1. On coupe les fils ! Les vrais emails ne partiront plus à partir d'ici.
    Mail::fake();

    // 2. On exécute l'action de notre application qui est censée envoyer un email
    $user = User::factory()->create();
    $this->post('/register', [...]);

    // 3. On VERIFIE que l'email de Bienvenue a bien été mis dans la boîte d'envoi
    Mail::assertSent(WelcomeEmail::class);

    // On peut même vérifier QUI était le destinataire !
    Mail::assertSent(WelcomeEmail::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });

    // Vérifier combien de fois il a été envoyé
    Mail::assertSent(WelcomeEmail::class, 1);

    // Vérifier qu'un email n'a SURTOUT PAS été envoyé (Ex: Reset Password)
    Mail::assertNotSent(PasswordResetEmail::class);

    // Vérifier le silence radio absolu
    Mail::assertNothingSent();
}
```

### Notification Fake

Très similaire au Mail Fake, mais pour le système multi-canaux de Laravel :

```php
use Illuminate\Support\Facades\Notification;
use App\Notifications\InvoicePaid;

public function test_une_notification_est_envoyee(): void
{
    Notification::fake();

    $user = User::factory()->create();
    $invoice = Invoice::factory()->create(['user_id' => $user->id]);

    $invoice->markAsPaid();

    // Vérifier que CET utilisateur a reçu CETTE notification précise
    Notification::assertSentTo($user, InvoicePaid::class);

    // Vérification avancée : S'assurer que la notification concernait bien CETTE facture
    Notification::assertSentTo(
        $user,
        InvoicePaid::class,
        function ($notification, $channels) use ($invoice) {
            return $notification->invoice->id === $invoice->id;
        }
    );

    Notification::assertNotSentTo($user, OtherNotification::class);
}
```

### Event Fake (Faux Événements)

Parfois, déclencher un événement entraîne une cascade d'actions lourdes (Listeners) qu'on ne veut pas tester maintenant. On peut "Bouchonner" (Fake) les événements !

```php
use Illuminate\Support\Facades\Event;
use App\Events\OrderShipped;

public function test_l_evenement_commande_expediee_est_declenche(): void
{
    // Bloque le lancement de TOUS les Listeners
    Event::fake();

    $order = Order::factory()->create();
    $order->ship();

    // L'événement a-t-il bien crié dans le vide ?
    Event::assertDispatched(OrderShipped::class);

    // Était-ce bien la bonne commande ?
    Event::assertDispatched(OrderShipped::class, function ($event) use ($order) {
        return $event->order->id === $order->id;
    });

    // Bouchonner (Fake) UNIQUEMENT certains événements précis (Laisser les autres s'exécuter normalement)
    Event::fake([OrderShipped::class]);
}
```

### Queue Fake (Fausse File d'Attente)

Pour vérifier qu'un "Job" lourd a bien été poussé dans la file d'attente (Redis/SQS), sans jamais exécuter son code !

```php
use Illuminate\Support\Facades\Queue;
use App\Jobs\ProcessPodcast;

public function test_le_traitement_du_podcast_est_mis_en_attente(): void
{
    Queue::fake();

    ProcessPodcast::dispatch($podcast);

    // Le Job est-il dans la file d'attente ? YES !
    Queue::assertPushed(ProcessPodcast::class);

    // A-t-il été mis sur le bon canal (tube) spécifique ?
    Queue::assertPushedOn('podcasts', ProcessPodcast::class);

    Queue::assertPushed(ProcessPodcast::class, function ($job) use ($podcast) {
        return $job->podcast->id === $podcast->id;
    });

    // A-t-on bien conservé la Chaîne de Jobs ?
    Queue::assertPushedWithChain(ProcessPodcast::class, [
        OptimizePodcast::class, // Celui-là en 2ème
        PublishPodcast::class,  // Puis ça à la fin
    ]);
}
```

### Storage Fake (Faux Disque Dur)

Comme vu dans la leçon `HTTP Testing`, indispensable pour ne pas remplir son vrai disque d'images factices :

```php
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

public function test_un_fichier_est_bien_uploade(): void
{
    Storage::fake('avatars'); // Isole totalement le disque 'avatars'

    // fake()->image() crée une image vide valide de 10x10 pixels en mémoire !
    $file = UploadedFile::fake()->image('avatar.jpg');

    $this->actingAs($user)->post('/avatar', ['avatar' => $file]);

    // OUI, le contrôleur l'a bien posé sur le disque !
    Storage::disk('avatars')->assertExists('avatars/' . $file->hashName());

    // Le disque doit s'être correctement auto-nettoyé avant si besoin
    Storage::disk('avatars')->assertDirectoryEmpty('empty-folder');
}
```

### HTTP Fake (Faux Appels API Externes)

C'est LE Fake le plus révolutionnaire. Si votre application contacte Stripe, GitHub, ou une API météo... vous NE DEVEZ PAS faire ces appels réseau en test (trop lent, nécessite internet, quota d'API coûteux).

```php
use Illuminate\Support\Facades\Http;

public function test_appel_api_externe_github(): void
{
    // On dresse une carte des "Mirages" (Mock Responses)
    Http::fake([
        // Si le code tente de joindre GitHub, on lui retourne IMMEDIATEMENT un faux JSON (Code 200)
        'api.github.com/*' => Http::response(['login' => 'octocat'], 200),

        // Si ça touche Stripe, on donne un faux ID de transaction
        'api.stripe.com/*' => Http::response(['id' => 'ch_123'], 200),
    ]);

    // Dans le contrôleur, Http::get va tomber dans notre piège et recevoir ['login' => 'octocat']
    $response = Http::get('https://api.github.com/users/1');

    // On peut vérifier A POSTERIORI que l'application a bien cherché à joindre la bonne URL
    Http::assertSent(function ($request) {
        return $request->url() === 'https://api.github.com/users/1';
    });

    Http::assertSentCount(1);

    // Simuler des Instabilités de l'API externe (Erreurs 500 aléatoires) !
    Http::fake([
        '*' => Http::sequence()
            ->push(['status' => 'ok'], 200)   // Le 1er appel marchera
            ->push(['status' => 'error'], 500),// Le 2ème appel va crasher salement ! (Code 500)
    ]);
}
```

## Mockery : Mocking Avancé sur vos propres Classes

Si vous voulez "mocker" une classe personnalisée (Ex: `PaymentGateway`) en utilisant la robuste librairie `Mockery`, sans utiliser les Fakes intégrés de Laravel.

```php
use Mockery;
use App\Services\PaymentGateway;

public function test_le_paiement_est_bien_traite(): void
{
    // 1. Créer une "copie en carton" de notre vraie classe
    $mock = Mockery::mock(PaymentGateway::class);

    // 2. Dresser le Mock (On lui dicte son comportement à l'avance)
    $mock->shouldReceive('charge')    // Il DEVRA être appelé sur la méthode 'charge'
        ->once()                      // EXACTEMENT UNE SEULE FOIS (sinon le test plantera !)
        ->with(100, Mockery::type('string')) // Avec ces arguments précis
        ->andReturn(['success' => true, 'id' => 'txn_123']); // Et voilà ce qu'il devra répondre !

    // 3. Forcer Laravel à utiliser notre "Fake" plutôt que le vrai quand il en a besoin via le Container
    $this->app->instance(PaymentGateway::class, $mock);

    // Action ! Le contrôleur appellera le PaymentGateway (qui est notre Mock déguisé)
    $response = $this->post('/checkout', ['amount' => 100]);

    $response->assertOk();
}

// Toujours refermer le coffre à jouets Mockery à la fin !
protected function tearDown(): void
{
    Mockery::close();
    parent::tearDown();
}
```

## Facilité de Mocking native de Laravel (Raccourcis)

Heureusement, Laravel a simplifié Mockery pour vous dans la classe `TestCase` de base :

```php
use App\Services\PaymentGateway;

public function test_paiement_avec_le_raccourci_laravel_mock(): void
{
    // Identique à l'exemple précédent, mais en 1 seule étape (pas de app->instance, ni de tearDown !)
    $this->mock(PaymentGateway::class, function ($mock) {
        $mock->shouldReceive('charge')
            ->once()
            ->andReturn(['success' => true]);
    });

    $response = $this->post('/checkout', ['amount' => 100]);
    $response->assertOk();
}

// --- Le Mock Partiel (Partial Mock) ---
// Seule la méthode 'charge' est faussée. Toutes les autres méthodes de PaymentGateway agiront "pour de vrai".
$this->partialMock(PaymentGateway::class, function ($mock) {
    $mock->shouldReceive('charge')->andReturn(['success' => true]);
});

// --- L'Espion (Spy) ---
// À l'inverse d'un Mock (où on dicte le comportement AVANT),
// L'Espion laisse la classe agir, et on l'interroge APRÈS pour voir ce qu'il a "vu".
$spy = $this->spy(PaymentGateway::class);

$this->post('/checkout', ['amount' => 100]);

// Alors, l'espion, as-tu vu passer la fonction 'charge' ?
$spy->shouldHaveReceived('charge')->once();
```

## Ressources

- [Le Mocking](https://laravel.com/docs/12.x/mocking) — La section officielle expliquant comment faire illusion.

---

> 📘 _Cette leçon fait partie du cours [Maîtrise des Tests Laravel](/laravel/laravel-testing/) sur la plateforme d'apprentissage RostoDev._
