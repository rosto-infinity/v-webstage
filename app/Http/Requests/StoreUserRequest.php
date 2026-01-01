<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Override;

/**
 * Requête de création d'un utilisateur.
 */
final class StoreUserRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à faire cette requête.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Règles de validation appliquées à la requête.
     *
     * @return array<string, ValidationRule|array<int, mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-ZÀ-ÿ\s\'-]+$/',  // ✅ Accepte accents, espaces, tirets, apostrophes
            ],
            'email' => [
                'required',
                'email:rfc,dns',  // ✅ Validation stricte RFC 5322 + DNS
                'regex:/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',  // ✅ Format nnnn@dddd.ddd
                'unique:users,email',  // ✅ Unique dans la table users
            ],
            'password' => [
                'required',
                'string',
                'min:8',
                'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/',  // ✅ Mot de passe fort
                'confirmed',  // ✅ Doit correspondre à password_confirmation
            ],
        ];
    }

    /**
     * Messages d'erreur personnalisés pour cette requête.
     *
     * @return array<string, string>
     */
    #[Override]
    public function messages(): array
    {
        return [
            // Validation du nom
            'name.required' => 'Le nom est obligatoire.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne peut pas dépasser :max caractères.',
            'name.regex' => 'Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes.',

            // Validation de l'email
            'email.required' => 'L\'adresse e-mail est obligatoire.',
            'email.email' => 'L\'adresse e-mail doit être valide (format: user@domain.com).',
            'email.regex' => 'L\'adresse e-mail doit respecter le format: nnnn@dddd.ddd',
            'email.unique' => 'Cette adresse e-mail est déjà utilisée par un autre utilisateur.',

            // Validation du mot de passe
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.string' => 'Le mot de passe doit être une chaîne de caractères.',
            'password.min' => 'Le mot de passe doit contenir au moins :min caractères.',
            'password.regex' => 'Le mot de passe doit contenir: une majuscule, une minuscule, un chiffre et un caractère spécial (@$!%*?&).',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ];
    }
}
