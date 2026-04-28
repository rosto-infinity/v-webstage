<?php

namespace App\Actions\Presence;

use App\Models\Presence;
use Illuminate\Support\Facades\DB;

class StorePresenceAction
{
    /**
     * Exécute la création d'une fiche de présence.
     *
     * @param array<string, mixed> $data
     */
    public function execute(array $data): Presence
    {
        return DB::transaction(function () use ($data) {
            return Presence::create([
                'user_id'           => $data['user_id'],
                'date'              => $data['date'],
                'arrival_time'      => $data['absent'] ? null : $data['heure_arrivee'],
                'departure_time'    => $data['absent'] ? null : $data['heure_depart'],
                'late_minutes'      => $data['absent'] ? 0 : (int) ($data['minutes_retard'] ?? 0),
                'absent'            => (bool) $data['absent'],
                'late'              => $data['absent'] ? false : (bool) $data['en_retard'],
                'absence_reason_id' => $data['absent'] ? $data['absence_reason_id'] : null,
            ]);
        });
    }
}
