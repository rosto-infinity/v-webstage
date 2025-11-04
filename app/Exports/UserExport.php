<?php

declare(strict_types=1);

namespace App\Exports;

use Illuminate\Support\Collection;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromCollection;

class UserExport implements FromCollection
{
    /**
     * @return Collection
     */
    public function collection()
    {
        return User::all();
    }
}
