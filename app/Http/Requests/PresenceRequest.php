<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Override;

class PresenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $presenceId = $this->route('id') ?? $this->route('presence'); // Support des deux formats de route

        return [
            'user_id' => [
                'required',
                'exists:users,id',
                Rule::unique('presences')
                    ->where(fn ($query) => $query->whereDate('date', $this->date))
                    ->ignore($presenceId), // ← Ignorer l'enregistrement actuel
            ],
            'date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],
            'heure_arrivee' => [
                'nullable',
                'required_if:absent,false',
                'date_format:H:i',
                function ($attribute, $value, $fail): void {
                    if ($value && $this->absent) {
                        $fail("Incohérence : heure d'arrivée renseignée alors que marqué absent.");
                    }
                },
            ],
            'heure_depart' => [
                'nullable',
                'required_if:absent,false',
                'date_format:H:i',
                'after:heure_arrivee',
                function ($attribute, $value, $fail): void {
                    if ($value && ! $this->heure_arrivee && ! $this->absent) {
                        $fail("Le départ nécessite une heure d'arrivée.");
                    }
                    if ($value && $this->absent) {
                        $fail('Incohérence : heure de départ renseignée alors que marqué absent.');
                    }
                },
            ],
            'minutes_retard' => [
                'nullable',
                'integer',
                'min:0',
                'max:300',
                'required_if:en_retard,true',
                function ($attribute, $value, $fail): void {
                    if ($value && $this->absent) {
                        $fail('Incohérence : retard renseigné alors que marqué absent.');
                    }
                },
            ],
            'absent' => 'required|boolean',
            'en_retard' => [
                'required',
                'boolean',
            ],
            'absence_reason_id' => [
                'required_if:absent,true',
                'nullable',
                'exists:absence_reasons,id',
                function ($attribute, $value, $fail): void {
                    if ($value && ! $this->absent) {
                        $fail("Incohérence : motif d'absence renseigné alors que non absent.");
                    }
                },
            ],
        ];
    }

    #[Override]
    public function messages(): array
    {
        return [
            'user_id.unique' => 'Cet étudiant a déjà une présence enregistrée pour cette date.',
            'date.before_or_equal' => 'La date ne peut pas être future.',
            'heure_arrivee.required_if' => "L'heure d'arrivée est obligatoire si non absent.",
            'minutes_retard.required_if' => 'Veuillez renseigner le nombre de minutes de retard.',
            'minutes_retard.max' => 'Le retard maximum autorisé est de 300 minutes (5h).',
            'heure_depart.after' => "L'heure de départ doit être postérieure à l'arrivée.",
            'absence_reason_id.required_if' => 'Un motif est obligatoire pour les absences.',
            'absence_reason_id.exists' => 'Le motif sélectionné est invalide.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Normaliser les formats d'heure (assurer HH:mm car 'H:i' attend les zéros initiaux)
        // Les navigateurs envoient généralement HH:mm mais on s'assure de la compatibilité
        if ($this->heure_arrivee && preg_match('/^(\d):(\d{2})$/', $this->heure_arrivee, $matches)) {
            $this->merge(['heure_arrivee' => '0'.$matches[1].':'.$matches[2]]);
        }

        if ($this->heure_depart && preg_match('/^(\d):(\d{2})$/', $this->heure_depart, $matches)) {
            $this->merge(['heure_depart' => '0'.$matches[1].':'.$matches[2]]);
        }

        // Si absent, on force les valeurs à null/false
        if ($this->absent) {
            $this->merge([
                'heure_arrivee' => null,
                'heure_depart' => null,
                'minutes_retard' => 0,
                'en_retard' => false,
            ]);

            return;
        }

        // Si non absent et pas de départ, mettre 17:00 par défaut
        if (! $this->heure_depart) {
            $this->merge([
                'heure_depart' => '17:00',
            ]);
        }
    }
}
