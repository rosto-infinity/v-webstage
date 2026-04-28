<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un Admin
        User::create([
            'name' => env('SUPERADMIN_NAME'),
            'email' => env('SUPERADMIN_EMAIL'),
            'password' => Hash::make(env('SUPERADMIN_PASS')),
            'role' => env('SUPERADMIN_ROLE'),
        ]);
    }
}
