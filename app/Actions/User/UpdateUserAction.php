<?php

declare(strict_types=1);

namespace App\Actions\User;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UpdateUserAction
{
    public function execute(User $user, array $data): User
    {
        $user->name = (string) $data['name'];
        $user->email = (string) $data['email'];

        if (! empty($data['password'] ?? '')) {
            $user->password = Hash::make((string) $data['password']);
        }

        $user->save();

        $user->stages()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'type_stage' => $data['type_stage'],
                'year_training_id' => $data['year_training_id'],
                'titre' => 'Stage ' . $data['type_stage'],
                'diplome' => $data['diplome'],
                'images' => $user->stages()->latest()->first()?->images ?? [],
            ]
        );

        return $user;
    }
}
