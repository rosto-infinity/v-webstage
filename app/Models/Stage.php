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
        'titre',
        'url_github',
        'images',
        'diplome',
    ];

    protected $casts = [
        'images' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Constantes pour les diplômes
    public const DIPLOMES = [
        'CAP' => 'Certificat d\'Aptitude Professionnelle',
        'BEP' => 'Brevet d\'Études Professionnelles',
        'BAC' => 'Baccalauréat',
        'BAC_PRO' => 'Baccalauréat Professionnel',
        'BTS' => 'Brevet de Technicien Supérieur',
        'DUT' => 'Diplôme Universitaire de Technologie',
        'LICENCE' => 'Licence',
        'LICENCE_PRO' => 'Licence Professionnelle',
        'DQP' => 'Diplôme de Qualification Professionnelle',
        'CQP' => 'Certificat de Qualification Professionnelle',
        'DEUST' => 'Diplôme d\'Études Universitaires Scientifiques et Techniques',
        'BUT' => 'Bachelor Universitaire de Technologie',
        'AUTRE' => 'Autre',
    ];

    public function getDiplomeLabel(): string
    {
        return self::DIPLOMES[$this->diplome] ?? $this->diplome;
    }
}