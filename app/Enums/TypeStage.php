<?php

declare(strict_types=1);

namespace App\Enums;

enum TypeStage: string
{
    case DQP = 'DQP';
    case CQP = 'CQP';
    case BTS = 'BTS';
    case DUT = 'DUT';
    case LICENCE = 'LICENCE';
    case LICENCE_PRO = 'LICENCE_PRO';
    case BAC = 'BAC';

    public function label(): string
    {
        return match ($this) {
            self::DQP => 'Diplôme de Qualification Professionnelle',
            self::CQP => 'Certificat de Qualification Professionnelle',
            self::BTS => 'Brevet de Technicien Supérieur',
            self::DUT => 'Diplôme Universitaire de Technologie',
            self::LICENCE => 'Licence',
            self::LICENCE_PRO => 'Licence Professionnelle',
            self::BAC => 'Baccalauréat',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
