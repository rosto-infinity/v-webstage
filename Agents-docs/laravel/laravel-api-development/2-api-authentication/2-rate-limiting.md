---
source_course: "laravel-api-development"
source_lesson: "laravel-api-development-rate-limiting"
---

# Limitation de Débit d'API (API Rate Limiting)

La limitation de débit ("Rate Limiting" en anglais) protège votre API des abus (spam, piratage par force brute, scripts devenus fous) en limitant le nombre de requêtes qu'un client peut effectuer pendant une période donnée.

## Limitation de Débit par Défaut

Les routes API de Laravel (`routes/api.php`) sont protégées par défaut. Cette protection est configurée dans `app/Providers/AppServiceProvider.php` (ou `RouteServiceProvider` sur les anciennes versions) :

```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

public function boot(): void
{
    // Configure le limiteur de débit nommé 'api'
    RateLimiter::for('api', function (Request $request) {
        // Autorise 60 requêtes par minute
        // Basé sur l'ID de l'utilisateur connecté, ou sur son adresse IP s'il est invité
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });
}
```

## Créer des Limiteurs de Débit Personnalisés

Imaginons que vous ayez des besoins précis selon les routes ou les utilisateurs :

```php
public function boot(): void
{
    // Limite standard (60 par minute)
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    // Limites différentes selon si l'utilisateur est connecté ou non
    RateLimiter::for('uploads', function (Request $request) {
        return $request->user()
            ? Limit::perMinute(100)->by($request->user()->id) // 100 uploads/min pour les membres
            : Limit::perMinute(10)->by($request->ip());       // Seulement 10/min pour les invités
    });

    // Les abonnés Premium ont le droit à l'illimité !
    RateLimiter::for('premium', function (Request $request) {
        return $request->user()?->isPremium()
            ? Limit::none() // Aucune limite !
            : Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
    });

    // Limites basées sur l'Heure (Pratique pour la génération de rapports lourds)
    RateLimiter::for('reports', function (Request $request) {
        return Limit::perHour(10)->by($request->user()->id);
    });

    // Limites basées sur la Journée (Pratique pour les APIs d'export)
    RateLimiter::for('exports', function (Request $request) {
        return Limit::perDay(5)->by($request->user()->id);
    });
}
```

## Appliquer les Limiteurs de Débit aux Routes

Une fois définis, appliquez-les via le middleware `throttle:` :

```php
// Appelle le limiteur nommé 'api'
Route::middleware('throttle:api')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
});

// Appelle notre limiteur personnalisé 'uploads'
Route::middleware('throttle:uploads')->group(function () {
    Route::post('/upload', [UploadController::class, 'store']);
});

// Cumuler plusieurs limiteurs (Les deux conditions doivent être respectées)
Route::middleware(['throttle:api', 'throttle:uploads'])->group(function () {
    // Ex: Limité à 60 requêtes générales/minute, ET max 100 uploads/minute
});
```

## Les En-têtes HTTP de Limitation (Rate Limit Headers)

Laravel est transparent. À chaque requête, il renvoie des en-têtes HTTP (Headers) pour prévenir le client de son quota restant :

```text
X-RateLimit-Limit: 60       // Le quota total autorisé
X-RateLimit-Remaining: 59   // Combien il t'en reste
Retry-After: 60             // ATTENTION: Apparaît seulement si tu as dépassé la limite ! (Attendre 60s)
```

## Personnaliser la Réponse en cas de Dépassement

Par défaut, Laravel renvoie une simple erreur texte "Too Many Attempts" (Code 429). Pour renvoyer un beau JSON :

```php
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)
        ->by($request->user()?->id ?: $request->ip())
        ->response(function (Request $request, array $headers) {

            // Format JSON propre pour l'application Front-end
            return response()->json([
                'success' => false,
                'message' => 'Trop de requêtes. Veuillez ralentir.',
                'retry_after' => $headers['Retry-After'], // Indique combien de secondes attendre
            ], 429, $headers);

        });
});
```

## Limitation de Débit Segmentée (Léger vs Lourd)

C'est une excellente pratique de séparer la limite des routes "faciles" de celle des routes "qui coûtent cher" au serveur :

```php
// Opérations Lourdes (ex: Recherche complexe, Export PDF, Appel IA)
RateLimiter::for('heavy', function (Request $request) {
    return Limit::perMinute(10)->by($request->user()->id); // Max 10/min
});

// Opérations Légères (ex: Un simple PING, Lister 10 articles)
RateLimiter::for('light', function (Request $request) {
    return Limit::perMinute(120)->by($request->user()->id); // Max 120/min
});
```

```php
// routes/api.php
Route::middleware('throttle:light')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{post}', [PostController::class, 'show']);
});

Route::middleware('throttle:heavy')->group(function () {
    Route::post('/analyze', [AnalyzeController::class, 'store']);
    Route::post('/export', [ExportController::class, 'store']);
});
```

## Cumuler Plusieurs Limites Complexes sur le même Endpoint

Parfois, "60 par minute" ne suffit pas. L'utilisateur pourrait faire 60 requêtes toutes les minutes de la journée (86 000 requêtes !).
Bloquons ça :

```php
RateLimiter::for('api', function (Request $request) {
    return [
        // Règle 1 : Max 60 rafales par minute
        Limit::perMinute(60)->by($request->user()?->id ?: $request->ip()),

        // Règle 2 : MAIS Max 1000 au total dans la journée !
        Limit::perDay(1000)->by($request->user()?->id ?: $request->ip()),
    ];
});
```

## Limitation Manuelle (En dehors du système de Routes)

Vous pouvez utiliser le Limiteur de Débit (Facade `RateLimiter`) directement dans le code de vos contrôleurs, parfait pour la validation de codes OTP ou de SMS !

```php
use Illuminate\Support\Facades\RateLimiter;

public function sendVerificationCode(Request $request)
{
    // Une clé unique "verify-phone:5"
    $key = 'verify-phone:' . $request->user()->id;

    // A-t-il essayé plus de 3 fois ?
    if (RateLimiter::tooManyAttempts($key, 3)) {
        $seconds = RateLimiter::availableIn($key); // Combien de secondes doit-il attendre ?

        return response()->json([
            'message' => "Trop de tentatives. Réessayez dans {$seconds} secondes.",
        ], 429);
    }

    // On ajoute un coup (hit), qui expire après 60 secondes
    RateLimiter::hit($key, 60);

    // ... Code pour envoyer le vrai SMS ...

    return response()->json(['message' => 'Code envoyé !']);
}

// Nettoyer l'historique des tentatives (ex: dès que le client saisit le BON code)
RateLimiter::clear('verify-phone:' . $user->id);
```

## Tester ses Limites (PHPUnit)

Comment s'assurer que ça bloque vraiment ?

```php
public function test_rate_limiting_works()
{
    // On simule 61 requêtes rapides (la limite est 60)
    for ($i = 0; $i < 61; $i++) {
        $response = $this->getJson('/api/posts');
    }

    // La 61ème requête DOIT être bloquée et retourner un code HTTP 429
    $response->assertStatus(429);
    $response->assertJson([
        'message' => 'Too many requests.', // Ou votre message personnalisé
    ]);
}
```

## Ressources

- [Limitation de Débit (Rate Limiting)](https://laravel.com/docs/12.x/routing#rate-limiting) — Documentation officielle du routage.

---

> 📘 _Cette leçon fait partie du cours [Développement d'API Laravel](/laravel/laravel-api-development/) sur la plateforme d'apprentissage RostoDev._
