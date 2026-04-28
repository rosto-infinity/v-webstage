---
source_course: "laravel-foundations"
source_lesson: "laravel-foundations-http-request-object"
---

# Travailler avec les Requêtes HTTP

La classe `Illuminate\Http\Request` offre une approche orientée objet pour accéder à toutes les données de la requête HTTP. Laravel l'injecte automatiquement dans vos contrôleurs.

## Accéder à la Requête

Indiquez la classe `Request` comme type d'argument (type-hint) dans les méthodes du contrôleur :

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class UserController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $name = $request->input('name');

        // Enregistrer l'utilisateur...

        return redirect('/users');
    }
}
```

Avec des paramètres de route :

```php
public function update(Request $request, string $id): RedirectResponse
{
    // $request contient les données HTTP
    // $id contient le paramètre de la route

    return redirect('/users');
}
```

## Chemin (Path) et URL de la Requête

```php
// URL : https://example.com/users?page=2

$request->path();           // 'users'
$request->url();            // 'https://example.com/users'
$request->fullUrl();        // 'https://example.com/users?page=2'
$request->fullUrlWithQuery(['sort' => 'name']);
                            // 'https://example.com/users?page=2&sort=name'

// Vérifier le chemin
$request->is('users/*');    // true si le chemin correspond au motif (pattern)
$request->routeIs('users.index');  // true si le nom de la route correspond
```

## Méthode de la Requête

```php
$request->method();         // 'GET', 'POST', etc.
$request->isMethod('post'); // true si c'est POST

// Usurpation de méthode (Method spoofing) pour les formulaires HTML
// <input type="hidden" name="_method" value="PUT">
```

## Récupérer les Données (Input)

Récupérez les données depuis n'importe quelle source (chaîne de requête/query string, données de formulaire, JSON) :

```php
// Récupérer une seule valeur
$name = $request->input('name');

// Avec valeur par défaut
$name = $request->input('name', 'Invité');

// Données imbriquées : products[0][name]
$name = $request->input('products.0.name');

// Toutes les données imbriquées
$names = $request->input('products.*.name');

// Obtenir toutes les entrées
$all = $request->all();

// Obtenir uniquement des clés spécifiques
$data = $request->only(['name', 'email']);

// Obtenir tout sauf certaines clés
$data = $request->except(['password']);
```

### Chaîne de Requête (Query String) vs Données de Formulaire

```php
// Uniquement la chaîne de requête (query string) : /users?search=jean
$search = $request->query('search');

// Tous les paramètres de la chaîne de requête
$query = $request->query();

// Uniquement les données POST
$name = $request->post('name');
```

### Requêtes JSON

```php
// Pour Content-Type: application/json
$name = $request->input('user.name');

// Ou accéder au JSON brut
$data = $request->json()->all();
```

## Propriétés Dynamiques

Accédez aux entrées comme à des propriétés :

```php
$name = $request->name;  // Identique à $request->input('name')
$email = $request->email;

// Les paramètres de la route ont priorité sur les entrées de la requête
```

## Vérifier la Présence de Données

```php
// Vérifier si présent (même si vide)
if ($request->has('name')) {
    // La clé 'name' existe
}

// Vérifier plusieurs clés
if ($request->has(['name', 'email'])) {
    // Les deux existent
}

// Vérifier si au moins une est présente
if ($request->hasAny(['name', 'nickname'])) {
    // Au moins une existe
}

// Vérifier si présent ET non vide
if ($request->filled('name')) {
    // A une valeur non vide
}

// Vérifier si absent ou vide
if ($request->missing('name')) {
    // 'name' n'est pas dans la requête
}
```

## Fichiers

Gérer les fichiers téléversés (uploadés) :

```php
// Récupérer un fichier
$file = $request->file('photo');

// Ou utiliser la propriété dynamique
$file = $request->photo;

// Vérifier si un fichier a été téléversé
if ($request->hasFile('photo')) {
    // Le fichier existe
}

// Valider et stocker
if ($request->file('photo')->isValid()) {
    $path = $request->photo->store('photos');  // Stocke dans storage/app/photos
    $path = $request->photo->storeAs('photos', 'filename.jpg');
}

// Obtenir des infos sur le fichier
$name = $request->photo->getClientOriginalName();
$extension = $request->photo->extension();
$size = $request->photo->getSize();
```

## En-têtes (Headers) et Cookies

```php
// Obtenir un en-tête
$token = $request->header('X-API-Token');

// Avec valeur par défaut
$contentType = $request->header('Content-Type', 'text/html');

// Obtenir un cookie
$remember = $request->cookie('remember_token');

// Token porteur (Bearer token) depuis l'en-tête Authorization
$token = $request->bearerToken();
```

## Informations sur la Requête

```php
$request->ip();              // Adresse IP du client
$request->userAgent();       // Chaîne de l'User Agent
$request->server('SERVER_PROTOCOL');  // Variable de serveur

// Négociation de contenu
$request->accepts(['text/html', 'application/json']);
$request->wantsJson();       // Attend une réponse JSON ?
```

## Ressources

- [Requêtes HTTP](https://laravel.com/docs/12.x/requests) — Documentation officielle sur les requêtes HTTP

---

> 📘 _Cette leçon fait partie du cours [Laravel Foundations](/laravel/laravel-foundations/) sur la plateforme d'apprentissage RostoDev._
