---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-http-responses"
---

# Créer des Réponses HTTP

Laravel offre plusieurs moyens de retourner des réponses depuis vos routes et vos contrôleurs. Le framework convertit automatiquement différents types de retours en réponses HTTP appropriées.

## Réponses Simples

### Chaînes de Caractères (Strings)

Si vous retournez une chaîne de caractères, Laravel l'enveloppera dans une réponse :

```php
Route::get('/hello', function () {
    return 'Bonjour tout le monde';
});
// Réponse : 200 OK, Content-Type: text/html
```

### Tableaux (Arrays) et JSON

Les tableaux et les modèles Eloquent sont automatiquement convertis en JSON :

```php
Route::get('/user', function () {
    return ['name' => 'Jean', 'email' => 'jean@example.com'];
});
// Réponse : 200 OK, Content-Type: application/json
// {"name":"Jean","email":"jean@example.com"}

Route::get('/user/{user}', function (User $user) {
    return $user;  // Modèle Eloquent converti en JSON
});
```

### Objets Response

Pour un contrôle total, utilisez le helper `response()` :

```php
return response('Bonjour tout le monde', 200)
    ->header('Content-Type', 'text/plain');

// Avec plusieurs en-têtes (headers)
return response($content)
    ->header('Content-Type', 'text/plain')
    ->header('X-Custom-Header', 'Valeur')
    ->withHeaders([
        'X-Header-One' => 'Valeur',
        'X-Header-Two' => 'Valeur',
    ]);
```

### Définir des Cookies

```php
return response('Bonjour')
    ->cookie('name', 'valeur', $minutes);

// Options avancées pour les cookies
return response('Bonjour')
    ->cookie('name', 'valeur', $minutes, $path, $domain, $secure, $httpOnly);
```

## Réponses JSON

Retourner explicitement du JSON :

```php
return response()->json([
    'name' => 'Jean',
    'status' => 'success',
]);

// Avec un code de statut personnalisé
return response()->json(['error' => 'Non trouvé'], 404);

// Réponse JSONP
return response()
    ->json(['name' => 'Jean'])
    ->withCallback($request->input('callback'));
```

## Réponses Vue (View)

Retourner une vue Blade :

```php
// En utilisant le helper view()
return view('welcome');

// Avec des données
return view('users.show', ['user' => $user]);

// Avec personnalisation de la réponse
return response()
    ->view('users.show', ['user' => $user], 200)
    ->header('Content-Type', 'text/html');
```

## Redirections

Rediriger vers une autre URL :

```php
// Redirection basique
return redirect('/home');

// Vers une route nommée (named route)
return redirect()->route('login');

// Avec des paramètres de route
return redirect()->route('users.show', ['id' => 1]);

// Vers l'action d'un contrôleur
return redirect()->action([UserController::class, 'index']);

// Retourner à la page précédente
return back();
return back()->withInput();  // Conserver les saisies de formulaire

// Vers une URL externe
return redirect()->away('https://google.com');
```

### Redirections avec des Données Éphémères (Flash Data)

```php
// Ajouter un message flash à la session
return redirect('/home')->with('status', 'Profil mis à jour !');

// Dans la vue :
@if (session('status'))
    <div class="alert">{{ session('status') }}</div>
@endif

// Erreurs flash
return back()->withErrors(['email' => 'Adresse e-mail invalide']);

// Conserver les anciennes saisies (old input)
return back()->withInput()->withErrors($errors);
```

## Réponses de Téléchargement

Télécharger des fichiers :

```php
// Télécharger un fichier
return response()->download($pathToFile);

// Avec un nom de fichier personnalisé
return response()->download($path, 'rapport.pdf');

// Avec des en-têtes
return response()->download($path, $name, $headers);

// Supprimer le fichier après le téléchargement
return response()->download($path)->deleteFileAfterSend();
```

## Réponses de Flux (Streamed Responses)

Diffuser (stream) le contenu directement, utile pour les gros fichiers générés à la volée :

```php
return response()->stream(function () {
    echo "Premier morceau\n";
    ob_flush();
    flush();
    sleep(1);
    echo "Deuxième morceau\n";
    ob_flush();
    flush();
}, 200, ['Content-Type' => 'text/plain']);
```

## Réponses Fichier (File Responses)

Afficher des fichiers dans le navigateur (inline) au lieu de les télécharger :

```php
// Afficher une image dans le navigateur
return response()->file($pathToFile);

// Avec des en-têtes
return response()->file($path, ['Content-Type' => 'image/png']);
```

## Macros de Réponse

Définir des types de réponse personnalisés :

```php
// Dans la méthode boot() de AppServiceProvider
Response::macro('success', function ($data = null, $message = 'Succès') {
    return Response::json([
        'success' => true,
        'message' => $message,
        'data' => $data,
    ]);
});

Response::macro('error', function ($message, $status = 400) {
    return Response::json([
        'success' => false,
        'message' => $message,
    ], $status);
});

// Utilisation
return response()->success($user, 'Utilisateur créé');
return response()->error('La validation a échoué', 422);
```

## Ressources

- [Réponses HTTP](https://laravel.com/docs/12.x/responses) — Documentation officielle sur les réponses HTTP

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
