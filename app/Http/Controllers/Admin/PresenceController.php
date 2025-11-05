<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Presence;
use App\Models\AbsenceReason;
use Illuminate\Http\Response;
use App\Exports\PresenceExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Collection;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\PresenceRequest;
use Inertia\Response as InertiaResponse;
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
        // Récupérer toutes les présences
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
                    'id' => $p->user?->id,           // ✅ AJOUT DE L'ID
                    'name' => $p->user?->name ?? '—',
                    'email' => $p->user?->email ?? '—',
                ],
                'absence_reason' => $p->absenceReason?->name,
            ]);

        // ✅ NOUVEAU : Récupérer tous les utilisateurs uniques
        $allUsers = User::has('presences')
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);

        return Inertia::render('SuperAdmin/Presence/PresenceIndex', [
            'presences' => $presences,
            'presenceCount' => Presence::count(),
            'allUsers' => $allUsers,  // ✅ AJOUT DES UTILISATEURS
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

 /**
     * Télécharger le PDF de toutes les présences
     */
    public function downloadAll(): Response
    {
        $presences = Presence::with(['user', 'absenceReason'])
            ->latest()
            ->get();
            
        $filename = 'Presences_All_' . now()->format('YmdHis') . '.pdf';

        return Pdf::loadView('SuperAdmin/Presences/PdfAllPresences', [
            'presences' => $presences,
            'date' => now()->format('d/m/Y'),
            'title' => 'Toutes les Présences',
        ])
            ->setPaper('A4', 'landscape')
            ->download($filename);
    }

    /**
     * Télécharger le PDF des présences d'un utilisateur spécifique
     */
    public function downloadUserPdf(User $user): Response
    {
        $presences = Presence::where('user_id', $user->id)
            ->with(['absenceReason'])
            ->latest()
            ->get();

        // Calculer les statistiques
        $stats = $this->calculateUserStats($presences);

        $filename = 'Presences_' . str_replace(' ', '_', $user->name) . '_' . now()->format('YmdHis') . '.pdf';

        return Pdf::loadView('SuperAdmin/Presences/PdfUserPresences', [
            'user' => $user,
            'presences' => $presences,
            'stats' => $stats,
            'date' => now()->format('d/m/Y H:i'),
        ])
            ->setPaper('A4', 'portrait')
            ->download($filename);
    }

    /**
     * Télécharger le PDF des présences d'un utilisateur pour une période
     */
    public function downloadUserPdfPeriod(User $user, string $startDate, string $endDate): Response
    {
        $presences = Presence::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->with(['absenceReason'])
            ->latest()
            ->get();

        $stats = $this->calculateUserStats($presences);

        $filename = 'Presences_' . str_replace(' ', '_', $user->name) . '_' . $startDate . '_to_' . $endDate . '.pdf';

        return Pdf::loadView('SuperAdmin/Presences/PdfUserPresences', [
            'user' => $user,
            'presences' => $presences,
            'stats' => $stats,
            'date' => now()->format('d/m/Y H:i'),
            'period' => "Du $startDate au $endDate",
        ])
            ->setPaper('A4', 'portrait')
            ->download($filename);
    }

    /**
     * Télécharger les PDFs de tous les utilisateurs (ZIP)
     */
    public function downloadAllUsersPdf()
    {
        set_time_limit(120);
        
        $users = User::has('presences')->get();
        $zipFilename = 'Presences_All_Users_' . now()->format('YmdHis') . '.zip';
        $zipPath = storage_path('app/temp/' . $zipFilename);

        // Créer le dossier temp si inexistant
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        $zip = new \ZipArchive();
        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
            foreach ($users as $user) {
                $presences = Presence::where('user_id', $user->id)
                    ->with(['absenceReason'])
                    ->latest()
                    ->get();

                $stats = $this->calculateUserStats($presences);
                $pdfFilename = 'Presences_' . str_replace(' ', '_', $user->name) . '.pdf';
                
                $pdf = Pdf::loadView('SuperAdmin/Presences/PdfUserPresences', [
                    'user' => $user,
                    'presences' => $presences,
                    'stats' => $stats,
                    'date' => now()->format('d/m/Y H:i'),
                ]);

                $zip->addFromString($pdfFilename, $pdf->output());
            }
            $zip->close();
        }

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }

    /**
     * Calculer les statistiques d'un utilisateur
     */
    private function calculateUserStats(Collection $presences): array
    {
        $totalPresences = $presences->count();
        $presents = $presences->where('arrival_time', '!=', null)->count();
        $absents = $presences->whereNull('arrival_time')->whereNull('departure_time')->count();
        $lates = $presences->where('late_minutes', '>', 0)->count();
        $totalLateMinutes = $presences->sum('late_minutes');

        return [
            'total' => $totalPresences,
            'presents' => $presents,
            'absents' => $absents,
            'lates' => $lates,
            'total_late_minutes' => $totalLateMinutes,
            'presence_rate' => $totalPresences > 0 ? round(($presents / $totalPresences) * 100, 2) : 0,
            'average_late_minutes' => $lates > 0 ? round($totalLateMinutes / $lates, 2) : 0,
        ];
    }
}