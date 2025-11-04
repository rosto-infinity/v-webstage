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
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Gère la gestion complète des présences :
 * affichage, création, mise à jour, suppression et export (Excel/PDF).
 */
final class PresenceController extends Controller
{
    /**
     * Liste toutes les présences avec leurs relations.
     */
    public function index(): InertiaResponse
    {
        /**
         * @var Collection<int, array{id: int, date: string, arrival_time: ?string, departure_time: ?string, late_minutes: int, absent: bool, late: bool, user: array{name: string, email: string}, absence_reason: ?string}> $presences
         */
        $presences = Presence::with(['user', 'absenceReason'])
            ->orderByDesc('date')
            ->get()
            ->map(static fn (Presence $p): array => [
                'id' => $p->id,
                'date' => $p->date,
                'arrival_time' => $p->arrival_time,
                'departure_time' => $p->departure_time,
                'late_minutes' => (int) $p->late_minutes,
                'absent' => (bool) $p->absent,
                'late' => (bool) $p->late,
                'user' => [
                    'name' => $p->user?->name ?? '—',
                    'email' => $p->user?->email ?? '—',
                ],
                'absence_reason' => $p->absenceReason?->name,
            ]);

        return Inertia::render('SuperAdmin/Presence/PresenceIndex', [
            'presences' => $presences,
            'presenceCount' => Presence::count(),
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'warning' => session('warning'),
            ],
        ]);
    }

    /**
     * Affiche le formulaire d’ajout d’une présence.
     */
    public function add(): InertiaResponse
    {
        /** @var \Illuminate\Database\Eloquent\Collection<int, User> $users */
        $users = User::where('role', 'user')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        /** @var \Illuminate\Database\Eloquent\Collection<int, AbsenceReason> $absenceReasons */
        $absenceReasons = AbsenceReason::all(['id', 'name']);

        return Inertia::render('SuperAdmin/Presence/PresenceAdd', [
            'users' => $users,
            'absenceReasons' => $absenceReasons,
        ]);
    }

    /**
     * Enregistre une nouvelle présence.
     */
    public function store(PresenceRequest $request): RedirectResponse
    {
        $userId = (int) $request->user_id;
        $date = (string) $request->date;

        // ✅ Vérifie si une présence existe déjà pour cet utilisateur aujourd’hui
        $exists = Presence::where('user_id', $userId)
            ->whereDate('date', $date)
            ->exists();

        if ($exists) {
            return back()
                ->withErrors(['user_id' => "Une présence existe déjà pour cet étudiant aujourd'hui."])
                ->withInput();
        }

        // ✅ Création de la présence
        Presence::create([
            'user_id' => $userId,
            'date' => $date,
            'arrival_time' => $request->absent ? null : $request->heure_arrivee,
            'departure_time' => $request->absent ? null : $request->heure_depart,
            'late_minutes' => $request->absent ? 0 : (int) ($request->minutes_retard ?? 0),
            'absent' => (bool) $request->absent,
            'late' => $request->absent ? false : (bool) $request->en_retard,
            'absence_reason_id' => $request->absent ? $request->absence_reason_id : null,
        ]);

        return redirect()->route('presences.users')
            ->with('success', 'Présence enregistrée avec succès.');
    }

    /**
     * Affiche le formulaire d’édition d’une présence.
     */
    public function edit(int $id): InertiaResponse
    {
        /** @var Presence $presence */
        $presence = Presence::with('user:id,name,email')->findOrFail($id);

        /** @var \Illuminate\Database\Eloquent\Collection<int, User> $users */
        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('SuperAdmin/Presence/PresenceEdit', [
            'presence' => [
                'id' => $presence->id,
                'user_id' => $presence->user_id,
                'date' => $presence->date,
                'heure_arrivee' => $presence->arrival_time,
                'heure_depart' => $presence->departure_time,
                'minutes_retard' => $presence->late_minutes,
                'absent' => $presence->absent,
                'en_retard' => $presence->late,
                'absence_reason_id' => $presence->absence_reason_id,
            ],
            'users' => $users,
        ]);
    }

    /**
     * Met à jour une présence existante.
     */
    public function update(PresenceRequest $request, int $id): RedirectResponse
    {
        /** @var Presence $presence */
        $presence = Presence::findOrFail($id);

        $presence->update([
            'user_id' => $request->user_id,
            'date' => $request->date,
            'arrival_time' => $request->absent ? null : $request->heure_arrivee,
            'departure_time' => $request->absent ? null : $request->heure_depart,
            'late_minutes' => $request->absent ? 0 : (int) ($request->minutes_retard ?? 0),
            'absent' => (bool) $request->absent,
            'late' => $request->absent ? false : (bool) $request->en_retard,
            'absence_reason_id' => $request->absent ? $request->absence_reason_id : null,
        ]);

        return redirect()->route('presences.users')
            ->with('success', 'Présence mise à jour avec succès.');
    }

    /**
     * Supprime une présence.
     */
    public function destroy(Presence $presence): RedirectResponse
    {
        $presence->delete();

        return redirect()->route('presences.users')
            ->with('success', 'Présence supprimée avec succès.');
    }

    /**
     * Exporte les présences au format Excel (.xlsx)
     */
    public function excel(): BinaryFileResponse
    {
        $fileName = now()->format('d-m-Y_H.i.s');

        return Excel::download(new PresenceExport, "Presences_{$fileName}.xlsx");
    }

    public function downloadAll(): \Illuminate\Http\Response
    {

        $presences = Presence::latest()->get();
        $filename = 'Presences_'.now()->format('YmdHis').'.pdf';

        return Pdf::loadView('SuperAdmin/Presences/PdfAllPresences', [
            'presences' => $presences,
            'date' => now()->format('d/m/Y'),
        ])
            ->setPaper('A4', 'landscape')
            ->download($filename);
    }
}
