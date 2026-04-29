<?php

declare(strict_types=1);

namespace App\Actions\Presence;

use App\Http\Resources\PresenceResource;
use App\Http\Resources\UserResource;
use App\Models\Presence;
use App\Models\User;
use App\Models\YearTraining;
use App\Http\Resources\YearTrainingResource;

class GetPresenceIndexDataAction
{
    /**
     * Exécute l'action pour récupérer toutes les données nécessaires
     * à l'affichage de l'index des présences.
     *
     * @return array<string, mixed>
     */
    public function execute(): array
    {
        $activeYear = YearTraining::active()->first();

        $presencesQuery = Presence::query()
            ->with(['user', 'absenceReason'])
            ->orderByDesc('date');

        $usersQuery = User::query()
            ->has('presences')
            ->orderBy('name', 'asc');

        if ($activeYear) {
            $presencesQuery->whereHas('user.stages', function ($q) use ($activeYear) {
                $q->where('year_training_id', $activeYear->id);
            });
            $usersQuery->whereHas('stages', function ($q) use ($activeYear) {
                $q->where('year_training_id', $activeYear->id);
            });
        }

        $presences = $presencesQuery->get();
        $allUsers = $usersQuery->get(['id', 'name', 'email']);

        $presentCount = $presences->where('absent', false)->count();

        return [
            'presences' => PresenceResource::collection($presences),
            'presenceCount' => $presences->count(),
            'presentCount' => $presentCount,
            'allUsers' => UserResource::collection($allUsers),
            'activeYearTraining' => $activeYear ? new YearTrainingResource($activeYear) : null,
        ];
    }
}
