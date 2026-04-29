<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'year_training_id',
        'titre',
        'url_github',
        'images',
        'diplome',
        'type_stage',
    ];

    protected $casts = [
        'images' => 'array',
        'type_stage' => \App\Enums\TypeStage::class,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function yearTraining(): BelongsTo
    {
        return $this->belongsTo(YearTraining::class);
    }

    // Constantes pour les diplômes
    public const DIPLOMES = [
        'BAC' => 'Baccalauréat',
        'BTS' => 'Brevet de Technicien Supérieur',
        'DUT' => 'Diplôme Universitaire de Technologie',
        'LICENCE' => 'Licence',
        'LICENCE_PRO' => 'Licence Professionnelle',
        'DQP' => 'Diplôme de Qualification Professionnelle',
        'CQP' => 'Certificat de Qualification Professionnelle',
        'AUTRE' => 'Autre',
    ];

    public function getDiplomeLabel(): string
    {
        return self::DIPLOMES[$this->diplome] ?? $this->diplome;
    }
}
