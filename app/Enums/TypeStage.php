<?php

declare(strict_types=1);

namespace App\Enums;

enum TypeStage: string
{
    case DQP = 'DQP';
    case BTS = 'BTS';
    case LICENCE = 'LICENCE';
    case BAC = 'BAC';

    public function label(): string
    {
        return match ($this) {
            self::DQP => 'Diplôme de Qualification Professionnelle',
            self::BTS => 'Brevet de Technicien Supérieur',
            self::LICENCE => 'Licence',
            self::BAC => 'Baccalauréat',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
