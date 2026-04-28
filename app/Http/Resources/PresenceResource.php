<?php

namespace App\Http\Resources;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PresenceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'date' => $this->date,
            'heure_arrivee' => $this->arrival_time,
            'heure_depart' => $this->departure_time,
            'minutes_retard' => (int) $this->late_minutes,
            'absent' => (bool) $this->absent,
            'en_retard' => (bool) $this->late,
            'absence_reason_id' => $this->absence_reason_id,
            'user' => new UserResource($this->whenLoaded('user')),
            'absence_reason' => $this->whenLoaded('absenceReason', function() {
                return $this->absenceReason->name;
            }),
        ];
    }
}
