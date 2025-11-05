<?php

declare(strict_types=1);

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'avatar' => [
                'nullable',
                File::image()
                    ->max(2048) // 2MB
                    ->dimensions(
                        Rule::dimensions()
                            ->maxWidth(2000)
                            ->maxHeight(2000)
                    ),
            ],
        ];
    }

    /**
     * Update the user's profile information and avatar.
     */
    public function updateProfile(): void
    {
        $user = $this->user();
        $data = $this->validated();

        // Gestion de l'avatar
        if ($this->hasFile('avatar')) {
            // Suppression de l'ancien avatar
            if ($user->avatar) {
                $oldAvatarPath = str_replace('storage/', '', $user->avatar);
                if (Storage::disk('public')->exists($oldAvatarPath)) {
                    Storage::disk('public')->delete($oldAvatarPath);
                }
            }

            // Stockage du nouvel avatar dans storage/app/public/avatars
            $path = $this->file('avatar')->store('avatars', 'public');

            // Sauvegarde du chemin accessible via web (public/storage/avatars)
            $data['avatar'] = 'storage/' . $path;
        } else {
            // Ne pas toucher à l'avatar si aucun fichier n'est fourni
            unset($data['avatar']);
        }

        // Mise à jour des données
        $user->fill($data);

        // Si l'email a changé, réinitialiser la vérification
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();
    }
}