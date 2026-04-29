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
    public function execute(?int $yearTrainingId = null): array
    {
        $activeYear = YearTraining::active()->first();
        $selectedYearId = $yearTrainingId ?? ($activeYear?->id);

        $presencesQuery = Presence::query()
            ->with(['user', 'absenceReason'])
            ->orderByDesc('date');

        $usersQuery = User::query()
            ->has('presences')
            ->orderBy('name', 'asc');

        if ($selectedYearId) {
            $presencesQuery->whereHas('user.stages', function ($q) use ($selectedYearId) {
                $q->where('year_training_id', $selectedYearId);
            });
            $usersQuery->whereHas('stages', function ($q) use ($selectedYearId) {
                $q->where('year_training_id', $selectedYearId);
            });
        }

        $presences = $presencesQuery->get();
        $allUsers = $usersQuery->get(['id', 'name', 'email']);
        $allYears = YearTraining::orderByDesc('start_date')->get();

        $presentCount = $presences->where('absent', false)->count();

        return [
            'presences' => PresenceResource::collection($presences),
            'presenceCount' => $presences->count(),
            'presentCount' => $presentCount,
            'allUsers' => UserResource::collection($allUsers),
            'activeYearTraining' => $activeYear ? new YearTrainingResource($activeYear) : null,
            'allYearTrainings' => YearTrainingResource::collection($allYears),
            'selectedYearId' => $selectedYearId,
        ];
    }
}
