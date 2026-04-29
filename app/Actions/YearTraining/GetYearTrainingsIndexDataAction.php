<?php

declare(strict_types=1);

namespace App\Actions\YearTraining;

use App\Http\Resources\YearTrainingResource;
use App\Models\YearTraining;

class GetYearTrainingsIndexDataAction
{
    /**
     * @return array<string, mixed>
     */
    public function execute(): array
    {
        $yearTrainings = YearTraining::query()
            ->orderByDesc('start_date')
            ->get();

        return [
            'yearTrainings' => YearTrainingResource::collection($yearTrainings),
        ];
    }
}
