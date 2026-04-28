---
source_course: "laravel-routing-controllers"
source_lesson: "laravel-routing-controllers-form-requests"
---

# Validation avec les Form Requests

Les Form Requests (Requêtes de formulaire) sont des classes de requêtes personnalisées qui contiennent toute la logique de validation. Elles permettent de garder vos contrôleurs propres et rendent les règles de validation réutilisables.

## Créer des Form Requests

```bash
php artisan make:request StorePostRequest
```

Ceci crée le fichier `app/Http/Requests/StorePostRequest.php` :

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête.
     */
    public function authorize(): bool
    {
        return true;  // ou ajoutez votre propre logique d'autorisation ici
    }

    /**
     * Déclare les règles de validation qui s'appliquent à la requête.
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'category_id' => 'required|exists:categories,id',
        ];
    }
}
```

## Utiliser les Form Requests dans les Contrôleurs

Utilisez l'injection de dépendances (type-hint) avec la classe Form Request au lieu de `Request` :

```php
use App\Http\Requests\StorePostRequest;

class PostController extends Controller
{
    public function store(StorePostRequest $request)
    {
        // La validation s'effectue automatiquement !
        // Si la validation échoue, l'utilisateur est redirigé avec les messages d'erreur

        // Récupérer les données validées
        $validated = $request->validated();

        $post = Post::create($validated);

        return redirect()->route('posts.show', $post);
    }
}
```

## Autorisation dans les Form Requests

```php
public function authorize(): bool
{
    // Vérifier si l'utilisateur est le propriétaire de la ressource
    $post = $this->route('post');  // Récupérer le modèle via le Route Model Binding

    return $post && $this->user()->id === $post->user_id;
}

// Ou utiliser les Policies (Stratégies)
public function authorize(): bool
{
    return $this->user()->can('create', Post::class);
}
```

Si l'autorisation échoue, Laravel renvoie automatiquement une réponse HTTP 403 (Accès Refusé).

## Messages d'Erreur Personnalisés

```php
public function messages(): array
{
    return [
        'title.required' => 'Veuillez saisir un titre pour votre article.',
        'title.max' => 'Le titre ne peut pas dépasser 255 caractères.',
        'body.required' => 'Le contenu de l\'article est obligatoire.',
        'category_id.exists' => 'Veuillez sélectionner une catégorie valide.',
    ];
}
```

## Noms d'Attributs Personnalisés

```php
public function attributes(): array
{
    return [
        'category_id' => 'catégorie',
        'user_id' => 'auteur',
    ];
}
// Au lieu de "Le champ category_id est requis."
// Laravel affichera : "Le champ catégorie est requis."
```

## Préparer les Données avant Validation

Modifier ou formater les données avant qu'elles ne soient validées :

```php
protected function prepareForValidation(): void
{
    $this->merge([
        'slug' => Str::slug($this->title),
        'user_id' => $this->user()->id,
    ]);
}
```

## Accéder aux Données Validées

```php
public function store(StorePostRequest $request)
{
    // Toutes les données validées sous forme de tableau
    $validated = $request->validated();

    // Seulement certaines clés spécifiques (safe() retourne un objet sécurisé)
    $validated = $request->safe()->only(['title', 'body']);

    // Toutes les clés sauf certaines
    $validated = $request->safe()->except(['category_id']);

    // Fusionner des données supplémentaires aux données validées
    $validated = $request->safe()->merge(['user_id' => auth()->id()]);
}
```

## Règles de Validation Conditionnelles

```php
public function rules(): array
{
    return [
        'email' => 'required|email',
        'role' => 'required|string',
        // Ne valider le mot de passe que pour les requêtes POST (création)
        'password' => $this->isMethod('post')
            ? 'required|string|min:8'
            : 'nullable|string|min:8',
    ];
}

// Ou utiliser la méthode sometimes (parfois)
protected function withValidator($validator)
{
    $validator->sometimes('reason', 'required', function ($input) {
        return $input->role === 'admin';
    });
}
```

## Actions Après Validation (After Validation Hook)

```php
protected function passedValidation(): void
{
    // Appelée uniquement si la validation réussit.
    // Idéal pour nettoyer ou transformer les données.

    $this->replace([
        'title' => strip_tags($this->title),
    ]);
}
```

## Exemple Pratique : UpdatePostRequest

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        $post = $this->route('post');

        return $this->user()->can('update', $post);
    }

    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
                // Unique sauf pour cet article en particulier
                Rule::unique('posts')->ignore($this->route('post')),
            ],
            'body' => 'required|string|min:100',
            'category_id' => 'required|exists:categories,id',
            'tags' => 'nullable|array',
            'tags.*' => 'exists:tags,id',
            'published_at' => 'nullable|date|after:now',
        ];
    }

    public function messages(): array
    {
        return [
            'body.min' => 'Les articles doivent comporter au moins 100 caractères.',
            'tags.*.exists' => 'Un ou plusieurs tags sélectionnés sont invalides.',
        ];
    }
}
```

## Ressources

- [Validation de Form Request](https://laravel.com/docs/12.x/validation#form-request-validation) — Documentation officielle sur la validation de requêtes de formulaire

---

> 📘 _Cette leçon fait partie du cours [Routage & Contrôleurs Laravel](/laravel/laravel-routing-controllers/) sur la plateforme d'apprentissage RostoDev._
