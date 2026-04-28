---
source_course: "laravel-blade-views"
source_lesson: "laravel-blade-views-livewire-forms-validation"
---

# Formulaires et Validation avec Livewire

Construisez des formulaires puissants avec une validation en temps réel en utilisant Livewire.

## Formulaire de Base

```php
<?php

namespace App\Livewire;

use App\Models\Post;
use Livewire\Component;

class CreatePost extends Component
{
    public string $title = '';
    public string $body = '';

    // Définition des règles de validation
    protected array $rules = [
        'title' => 'required|min:3|max:255',
        'body' => 'required|min:10',
    ];

    public function save(): void
    {
        // Valide les données selon les $rules. Si ça échoue, une exception est lancée et l'erreur est affichée.
        $validated = $this->validate();

        Post::create($validated);

        $this->reset();  // Réinitialise les propriétés (vide le formulaire)
        session()->flash('success', 'Article créé avec succès !');
    }

    public function render()
    {
        return view('livewire.create-post');
    }
}
```

```blade
<div>
    @if (session('success'))
        <div class="bg-green-100 p-4 mb-4">{{ session('success') }}</div>
    @endif

    <form wire:submit="save">
        <div class="mb-4">
            <label>Titre</label>
            <input type="text" wire:model="title" class="w-full border p-2">
            @error('title')
                <span class="text-red-500 text-sm">{{ $message }}</span>
            @enderror
        </div>

        <div class="mb-4">
            <label>Contenu</label>
            <textarea wire:model="body" rows="5" class="w-full border p-2"></textarea>
            @error('body')
                <span class="text-red-500 text-sm">{{ $message }}</span>
            @enderror
        </div>

        <button type="submit" class="bg-blue-500 text-white px-4 py-2">
            Créer l'Article
        </button>
    </form>
</div>
```

## Validation en Temps Réel

Validez les données au fur et à mesure que l'utilisateur tape sur son clavier :

```php
class CreatePost extends Component
{
    public string $title = '';
    public string $body = '';

    protected array $rules = [
        'title' => 'required|min:3|max:255',
        'body' => 'required|min:10',
    ];

    // Appelée automatiquement lorsqu'une propriété QUELCONQUE est mise à jour
    public function updated(string $propertyName): void
    {
        // Ne valide que la propriété qui vient de changer
        $this->validateOnly($propertyName);
    }

    // OU pour des propriétés SPÉCIFIQUES (ex: updatedTitle)
    public function updatedTitle(): void
    {
        $this->validateOnly('title');
    }

    public function save(): void
    {
        $this->validate();
        // ...
    }
}
```

```blade
{{-- Utilisez wire:model.live avec debounce pour éviter de faire une requête à chaque touche enfoncée --}}
<input type="text" wire:model.live.debounce.500ms="title">
```

## Les Objets de Formulaire (Form Objects)

Pour les formulaires complexes avec de nombreux champs, utilisez les Objets de Formulaire de Livewire (Nouveauté Livewire 3) pour séparer la logique du formulaire de la logique du composant d'interface :

```bash
php artisan make:livewire-form PostForm
```

```php
<?php

namespace App\Livewire\Forms;

use Livewire\Form;
use App\Models\Post;

class PostForm extends Form
{
    public ?Post $post = null;

    public string $title = '';
    public string $body = '';
    public bool $published = false;

    // Définir les règles ici dans le Form Object
    protected function rules(): array
    {
        return [
            'title' => 'required|min:3|max:255',
            'body' => 'required|min:10',
            'published' => 'boolean',
        ];
    }

    // Hydrater le formulaire avec un modèle existant pour l'édition
    public function setPost(Post $post): void
    {
        $this->post = $post;
        $this->title = $post->title;
        $this->body = $post->body;
        $this->published = $post->published;
    }

    public function store(): Post
    {
        $this->validate();

        return Post::create($this->only(['title', 'body', 'published']));
    }

    public function update(): void
    {
        $this->validate();

        $this->post->update($this->only(['title', 'body', 'published']));
    }
}
```

Utilisation du formulaire dans votre composant Livewire :

```php
class ManagePost extends Component
{
    // Instancie l'Objet de Formulaire
    public PostForm $form;

    // S'exécute lors du chargement initial du composant
    public function mount(?Post $post = null): void
    {
        if ($post) {
            $this->form->setPost($post);
        }
    }

    public function save(): void
    {
        if ($this->form->post) {
            $this->form->update();
        } else {
            $this->form->store();
        }

        $this->redirect(route('posts.index'));
    }

    public function render()
    {
        return view('livewire.manage-post');
    }
}
```

```blade
<form wire:submit="save">
    <!-- Remarquez l'utilisation du préfixe 'form.' -->
    <input type="text" wire:model="form.title">
    @error('form.title') <span>{{ $message }}</span> @enderror

    <textarea wire:model="form.body"></textarea>
    @error('form.body') <span>{{ $message }}</span> @enderror

    <label>
        <input type="checkbox" wire:model="form.published">
        Publié
    </label>

    <button type="submit">Enregistrer</button>
</form>
```

## Téléchargement de Fichiers (File Uploads)

```php
use Livewire\WithFileUploads;

class UploadPhoto extends Component
{
    // Le trait WithFileUploads est requis pour gérer les fichiers
    use WithFileUploads;

    public $photo;

    protected array $rules = [
        'photo' => 'required|image|max:1024',  // Max 1Mo (en Ko)
    ];

    public function save(): void
    {
        $this->validate();

        // Enregistrer la photo sur le disque 'public' dans le dossier 'photos'
        $path = $this->photo->store('photos', 'public');

        auth()->user()->update(['avatar' => $path]);

        session()->flash('success', 'Photo téléchargée avec succès !');
    }

    public function render()
    {
        return view('livewire.upload-photo');
    }
}
```

```blade
<form wire:submit="save">
    <input type="file" wire:model="photo">

    {{-- Prévisualisation de l'image avant l'envoi définitif --}}
    @if ($photo)
        <img src="{{ $photo->temporaryUrl() }}" class="w-32 h-32">
    @endif

    @error('photo') <span>{{ $message }}</span> @enderror

    <!-- Désactiver le bouton pendant le chargement pour éviter les doubles clics -->
    <button type="submit" wire:loading.attr="disabled">
        <span wire:loading.remove>Télécharger</span>
        <span wire:loading>Envoi en cours...</span>
    </button>
</form>
```

## Messages de Validation Personnalisés

```php
// Personnaliser les messages d'erreur d'un composant
protected array $messages = [
    'title.required' => 'Veuillez saisir un titre.',
    'title.min' => 'Le titre doit faire au moins :min caractères.',
    'body.required' => 'N\'oubliez pas de rédiger le contenu de l\'article !',
];

// Personnaliser le nom des attributs dans les messages d'erreur génériques
protected array $validationAttributes = [
    'title' => 'titre de l\'article',
    'body' => 'contenu de l\'article',
];
```

## Ressources

- [Formulaires Livewire](https://livewire.laravel.com/docs/forms) — Documentation officielle sur les formulaires et la validation sous Livewire (version 3).

---

> 📘 _Cette leçon fait partie du cours [Moteur de Templates Laravel Blade](/laravel/laravel-blade-views/) sur la plateforme d'apprentissage RostoDev._
