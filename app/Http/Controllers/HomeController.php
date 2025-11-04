<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Inertia\Inertia\Response;
use App\Models\User;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Affiche la page d'accueil.
     *
     * @return Response
     */
    public function welcome()
    {
        // Compter le nombre total d'utilisateurs
        $totalUsers = User::count();

        // Récupérer tous les utilisateurs avec leurs réseaux sociaux associés
        $users = User::with('socialMedias')
            ->latest()
            ->paginate(12)
            ->through(function ($user) {
                // Assurer que l'attribut 'socialMedias' est défini, même si vide
                $user->setAttribute('socialMedias', $user->socialMedias ?? []);

                return $user;
            });

        // -Renvoyer la vue Inertia 'Welcome' avec les données compactées
        return Inertia::render('Welcome', [
            'totalUsers' => $totalUsers,
            'users' => Inertia::scroll($users),
        ]);
    }
}
