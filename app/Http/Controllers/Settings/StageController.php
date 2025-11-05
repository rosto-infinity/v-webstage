<?php

declare(strict_types=1);

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Stage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StageController extends Controller
{
    public function index()
    {
        return Inertia::render('settings/Stages', [
            'stages' => Auth::user()->stages()->latest()->get()->map(function ($stage) {
                return [
                    'id' => $stage->id,
                    'titre' => $stage->titre,
                    'url_github' => $stage->url_github,
                    'images' => $stage->images,
                    'diplome' => $stage->diplome,
                    'diplome_label' => $stage->getDiplomeLabel(),
                    'created_at' => $stage->created_at?->format('d/m/Y'),
                ];
            }),
            'diplomes' => Stage::DIPLOMES,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'url_github' => [
                'nullable',
                'url',
                function ($attribute, $value, $fail): void {
                    if ($value && ! str_contains($value, 'github.com')) {
                        $fail('L\'URL doit être un lien GitHub valide.');
                    }
                },
            ],
            'images.*' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'diplome' => ['required', Rule::in(array_keys(Stage::DIPLOMES))],
        ], [
            'titre.required' => 'Le titre est obligatoire',
            'images.*.required' => 'Veuillez ajouter au moins 3 images',
            'diplome.required' => 'Le diplôme est obligatoire',
        ]);

        // Vérifier le nombre d'images
        $images = $request->file('images');
        if (! $images || ! is_array($images) || count($images) < 3 || count($images) > 5) {
            return back()->withErrors([
                'images' => 'Vous devez ajouter entre 3 et 5 images',
            ]);
        }

        // Upload des images
        $imagePaths = [];
        foreach ($images as $image) {
            $path = $image->store('stages', 'public');
            $imagePaths[] = $path;
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->stages()->create([
            'titre' => $validated['titre'],
            'url_github' => $validated['url_github'],
            'images' => $imagePaths,
            'diplome' => $validated['diplome'],
        ]);

        return back()->with('success', 'Stage ajouté avec succès');
    }

    public function update(Request $request, Stage $stage)
    {
        // Vérification de l'autorisation
        if (auth()->id() !== $stage->user_id) {
            abort(403, 'Action non autorisée.');
        }

        $validated = $request->validate([
            'titre' => 'required|string|max:255',
            'url_github' => [
                'nullable',
                'url',
                function ($attribute, $value, $fail): void {
                    if ($value && ! str_contains($value, 'github.com')) {
                        $fail('L\'URL doit être un lien GitHub valide.');
                    }
                },
            ],
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'diplome' => ['required', Rule::in(array_keys(Stage::DIPLOMES))],
        ]);

        $data = [
            'titre' => $validated['titre'],
            'url_github' => $validated['url_github'],
            'diplome' => $validated['diplome'],
        ];

        // Si de nouvelles images sont uploadées
        if ($request->hasFile('images')) {
            $images = $request->file('images');
            
            // Vérifier le nombre d'images
            if (is_array($images) && (count($images) < 3 || count($images) > 5)) {
                return back()->withErrors([
                    'images' => 'Vous devez ajouter entre 3 et 5 images',
                ]);
            }

            // Supprimer les anciennes images
            foreach ($stage->images as $oldImage) {
                Storage::disk('public')->delete($oldImage);
            }

            // Upload des nouvelles images
            $imagePaths = [];
            foreach ($images as $image) {
                $path = $image->store('stages', 'public');
                $imagePaths[] = $path;
            }

            $data['images'] = $imagePaths;
        }

        $stage->update($data);

        return back()->with('success', 'Stage mis à jour avec succès');
    }

    public function destroy(Stage $stage)
    {
        // Vérification de l'autorisation
        if (auth()->id() !== $stage->user_id) {
            abort(403, 'Action non autorisée.');
        }

        // Supprimer les images
        foreach ($stage->images as $image) {
            Storage::disk('public')->delete($image);
        }

        $stage->delete();

        return back()->with('success', 'Stage supprimé avec succès');
    }
}