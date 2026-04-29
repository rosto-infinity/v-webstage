<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\User;
use App\Models\YearTraining;
use App\Enums\TypeStage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Création de l'année de formation 2024-2025
        $year2425 = YearTraining::updateOrCreate(
            ['label' => '2024-2025'],
            [
                'start_date' => '2024-09-01',
                'end_date' => '2025-06-30',
                'is_active' => true,
            ]
        );

        // Groupe 1: 10 étudiants en DQP et BTS
        $typesGroup1 = [TypeStage::DQP, TypeStage::BTS];
        for ($i = 1; $i <= 10; $i++) {
            $type = $typesGroup1[array_rand($typesGroup1)];
            $user = User::updateOrCreate(
                ['email' => "student_g1_$i@mailinator.com"],
                [
                    'name' => "Étudiant Group1 $i",
                    'password' => Hash::make('password'),
                    'role' => 'user',
                ]
            );

            $user->stages()->updateOrCreate(
                ['year_training_id' => $year2425->id],
                [
                    'type_stage' => $type,
                    'titre' => "Stage {$type->value} - Group 1",
                    'diplome' => $type->value,
                    'images' => [],
                ]
            );
        }

        // Groupe 2: 10 étudiants en CQP, BTS, DUT, Licence Pro
        $typesGroup2 = [TypeStage::CQP, TypeStage::BTS, TypeStage::DUT, TypeStage::LICENCE_PRO];
        for ($i = 1; $i <= 10; $i++) {
            $type = $typesGroup2[array_rand($typesGroup2)];
            $user = User::updateOrCreate(
                ['email' => "student_g2_$i@mailinator.com"],
                [
                    'name' => "Étudiant Group2 $i",
                    'password' => Hash::make('password'),
                    'role' => 'user',
                ]
            );

            $user->stages()->updateOrCreate(
                ['year_training_id' => $year2425->id],
                [
                    'type_stage' => $type,
                    'titre' => "Stage {$type->value} - Group 2",
                    'diplome' => $type->value,
                    'images' => [],
                ]
            );
        }
    }
}
