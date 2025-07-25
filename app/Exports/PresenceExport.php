<?php

namespace App\Exports;

use App\Models\Presence;
use App\Models\User;
use Illuminate\Contracts\View\View; // --Importe l'interface View pour le type de retour
use Maatwebsite\Excel\Concerns\FromView; // ---Importe l'interface FromView pour l'exportation Excel

class PresenceExport implements FromView
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function view(): View
    {
        //    $users   = User::pluck('name', 'id');
        //   $presences = Presence::with(['user']);SuperAdmin/Presences/ExSuperAdmin/Presences/ExcelAllPresences'celAllPresences'
        return view(
            'SuperAdmin/Presences/ExcelAllPresences',
            [
                'users' => User::all(),
                'presences' => Presence::all(),
            ]
        );
    }
}
