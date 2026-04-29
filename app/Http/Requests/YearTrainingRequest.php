<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class YearTrainingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $yearTraining = $this->route('year_training');
        $yearTrainingId = $yearTraining instanceof \App\Models\YearTraining ? $yearTraining->id : $yearTraining;

        return [
            'label' => ['required', 'string', 'max:50', 'unique:year_trainings,label,' . $yearTrainingId],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after:start_date'],
            'is_active' => ['boolean'],
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'label.required' => 'Le libellé de l\'année de formation est obligatoire.',
            'label.string' => 'Le libellé doit être une chaîne de caractères.',
            'label.max' => 'Le libellé ne doit pas dépasser 50 caractères.',
            'label.unique' => 'Ce libellé existe déjà pour une autre année de formation.',
            'start_date.required' => 'La date de début est obligatoire.',
            'start_date.date' => 'La date de début doit être une date valide.',
            'end_date.required' => 'La date de fin est obligatoire.',
            'end_date.date' => 'La date de fin doit être une date valide.',
            'end_date.after' => 'La date de fin doit être postérieure à la date de début.',
            'is_active.boolean' => 'Le statut d\'activation doit être vrai ou faux.',
        ];
    }
}
