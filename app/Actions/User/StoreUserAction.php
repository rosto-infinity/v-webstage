<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class StoreUserAction
{
    public function execute(array $data): User
    {
        $user = User::create([
            'name' => (string) $data['name'],
            'email' => (string) $data['email'],
            'password' => Hash::make((string) $data['password']),
        ]);

        $user->stages()->create([
            'type_stage' => $data['type_stage'],
            'year_training_id' => $data['year_training_id'],
            'titre' => 'Stage ' . $data['type_stage'],
            'diplome' => $data['diplome'],
            'images' => [],
        ]);

        return $user;
    }
}
