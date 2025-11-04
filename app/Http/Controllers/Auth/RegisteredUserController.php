<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur pour l’enregistrement des utilisateurs.
 */
class RegisteredUserController extends Controller
{
    /**
     * Affiche le formulaire d’inscription.
     */
    public function create(): Response
    {
        return Inertia::render('auth/Register');
    }

    /**
     * Traite la requête d’inscription.
     *
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Password::defaults()],
        ], [
            'name.required' => 'Merci de renseigner votre nom complet.',
            'name.string' => 'Le nom doit être une chaîne de caractères.',
            'name.max' => 'Le nom ne peut pas contenir plus de :max caractères.',
            'email.required' => 'Merci de renseigner une adresse email.',
            'email.string' => 'L’adresse email doit être une chaîne de caractères.',
            'email.lowercase' => 'L’adresse email doit être en minuscules.',
            'email.email' => 'Merci de renseigner une adresse email valide.',
            'email.max' => 'L’adresse email ne peut pas dépasser :max caractères.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'password.required' => 'Merci de renseigner un mot de passe.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'password.min' => 'Le mot de passe doit contenir au moins :min caractères.',
            // selon Rules\Password::defaults(), d’autres règles peuvent s’appliquer
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return to_route('dashboard');
    }
}
