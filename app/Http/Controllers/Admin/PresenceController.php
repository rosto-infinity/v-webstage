<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Exports\PresenceExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\PresenceRequest;
use App\Models\AbsenceReason;
use App\Models\Presence;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Response as InertiaResponse;
use Illuminate\Http\RedirectResponse;
class PresenceController extends Controller
{
    public function index()
    {
        $presences = Presence::with('user', 'absenceReason')
            ->orderBy('date', 'desc')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'date' => $p->date,
                'arrival_time' => $p->arrival_time,
                'departure_time' => $p->departure_time,
                'late_minutes' => $p->late_minutes,
                'absent' => $p->absent,
                'late' => $p->late,
                'user' => [
                    'name' => $p->user->name,
                    'email' => $p->user->email,
                ],
                'absence_reason' => $p->absenceReason ? $p->absenceReason->name : null,
            ]);

        $presenceCount = Presence::count();

        return Inertia::render('SuperAdmin/Presence/PresenceIndex', [
            'presences' => $presences,
            'presenceCount' => $presenceCount,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
            ],
        ]);
    }

    public function add()
    {
        $users = User::where('role', 'user')->orderBy('name')->get(['id', 'name', 'email']);
        $absenceReasons = AbsenceReason::all(['id', 'name']);

        return Inertia::render('SuperAdmin/Presence/PresenceAdd', compact('users', 'absenceReasons'));
    }

    public function store(PresenceRequest $request)
    {
        // Vérification finale avant création
        if (Presence::where('user_id', $request->user_id)
            ->whereDate('date', $request->date)
            ->exists()) {
            return back()
                ->withErrors(['user_id' => 'Une présence existe déjà pour cet étudiant aujourd\'hui.'])
                ->withInput();
        }

        // Création de la présence
        Presence::create([
            'user_id' => $request->user_id,
            'date' => $request->date,
            'arrival_time' => $request->absent ? null : $request->heure_arrivee,
            'departure_time' => $request->absent ? null : $request->heure_depart,
            'late_minutes' => $request->absent ? 0 : $request->minutes_retard,
            'absent' => $request->absent,
            'late' => $request->absent ? false : $request->en_retard,
            'absence_reason_id' => $request->absent
                ? $request->absence_reason_id
                : null, // Bien géré
        ]);

        return redirect()->route('presences.users')
            ->with('success', 'Présence enregistrée avec succès.');
    }

   public function edit($id): InertiaResponse
    {
        // Récupérer la présence avec ses relations
        $presence = Presence::with('user:id,name,email')->findOrFail($id);

        // Récupérer tous les utilisateurs
        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('SuperAdmin/Presence/PresenceEdit', [
            'presence' => [
                'id' => $presence->id,
                'user_id' => $presence->user_id,
                'date' => $presence->date,
                // ⚠️ ATTENTION : Mapper les noms de colonnes BD → Frontend
                'heure_arrivee' => $presence->arrival_time,      // ← arrival_time → heure_arrivee
                'heure_depart' => $presence->departure_time,     // ← departure_time → heure_depart
                'minutes_retard' => $presence->late_minutes,     // ← late_minutes → minutes_retard
                'absent' => $presence->absent,
                'en_retard' => $presence->late,                  // ← late → en_retard
                'absence_reason_id' => $presence->absence_reason_id,
            ],
            'users' => $users,
        ]);
    }

    public function update(PresenceRequest $request, $id): RedirectResponse
    {
        $presence = Presence::findOrFail($id);

        // Préparer les données en mappant correctement
        $data = [
            'user_id' => $request->user_id,
            'date' => $request->date,
            'arrival_time' => $request->absent ? null : $request->heure_arrivee,    // ← heure_arrivee → arrival_time
            'departure_time' => $request->absent ? null : $request->heure_depart,   // ← heure_depart → departure_time
            'late_minutes' => $request->absent ? 0 : ($request->minutes_retard ?? 0), // ← minutes_retard → late_minutes
            'absent' => $request->absent,
            'late' => $request->absent ? false : $request->en_retard,               // ← en_retard → late
            'absence_reason_id' => $request->absent ? $request->absence_reason_id : null,
        ];

        $presence->update($data);

        return redirect()
            ->route('presences.users')
            ->with('success', 'Présence mise à jour avec succès.');
    }

    /**
     * Supprime une présence
     */
    public function destroy(Presence $presence)
    {

        $presence->delete();

        return redirect()->route('presences.users')
            ->with('success', 'Présence supprimée avec succès.');
    }

    public function excel()
    {
        // --Génère un nom de fichier basé sur la date et l'heure actuelles
        $fileName = now()->format('d-m-Y H.i.s');

        // -- Télécharge le fichier Excel avec les données d'historique des emplois
        return Excel::download(new PresenceExport, 'Presences_'.$fileName.'.xlsx');
    }

    public function downloadAll()
    {
        $presences = Presence::latest()->get();
        $filename = 'Presences_'.now()->format('YmdHis').'.pdf';

        return Pdf::loadView('SuperAdmin/Presences/PdfAllPresences', [
            'presences' => $presences,
            'date' => now()->format('d/m/Y'),
        ])
            ->setPaper('A4', 'landscape')  // Doit être appelé avant download()
            ->download($filename);
    }
}
