<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Exports\PresenceExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\PresenceRequest;
use App\Actions\Presence\StorePresenceAction;
use App\Http\Resources\PresenceResource;
use App\Http\Resources\UserResource;
use App\Models\AbsenceReason;
use App\Models\Presence;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Response;
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
    public function index(\App\Actions\Presence\GetPresenceIndexDataAction $action): InertiaResponse
    {
        $data = $action->execute();
        $data['flash'] = [
            'success' => session('success'),
            'error' => session('error'),
            'warning' => session('warning'),
        ];

        return Inertia::render('SuperAdmin/Presence/PresenceIndex', $data);
    }

    /**
     * Affiche le formulaire d’ajout d’une présence.
     */
    public function add(): InertiaResponse
    {
        $users = User::query()->where('role', '=', 'user')
            ->orderBy('name', 'asc')
            ->get(['id', 'name', 'email']);

        $absenceReasons = AbsenceReason::query()->get(['id', 'name']);

        return Inertia::render('SuperAdmin/Presence/PresenceAdd', [
            'users' => UserResource::collection($users),
            'absenceReasons' => $absenceReasons,
        ]);
    }

    /**
     * Enregistre une nouvelle présence.
     */
    public function store(PresenceRequest $request, StorePresenceAction $action): RedirectResponse
    {
        $userId = (int) $request->user_id;
        $date = (string) $request->date;

        $exists = Presence::query()->where('user_id', '=', $userId)
            ->whereDate('date', $date)
            ->exists();

        if ($exists) {
            return back()
                ->withErrors(['user_id' => "Une présence existe déjà pour cet étudiant aujourd'hui."])
                ->withInput();
        }

        $action->execute($request->validated());

        return redirect()->route('presences.users')
            ->with('success', 'Présence enregistrée avec succès.');
    }

    /**
     * Affiche le formulaire d’édition d’une présence.
     */
    public function edit(int $id): InertiaResponse
    {
        $presence = Presence::query()->with('user:id,name,email')->findOrFail($id);
        $users = User::query()->orderBy('name', 'asc')->get(['id', 'name', 'email']);
        $absenceReasons = AbsenceReason::query()->get(['id', 'name']);

        return Inertia::render('SuperAdmin/Presence/PresenceEdit', [
            'presence' => new PresenceResource($presence),
            'users' => UserResource::collection($users),
            'absenceReasons' => $absenceReasons,
        ]);
    }

    /**
     * Met à jour une présence existante.
     */
    public function update(PresenceRequest $request, int $id): RedirectResponse
    {
        /** @var Presence $presence */
        $presence = Presence::query()->findOrFail($id);

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
        /** @var Presence $presence */
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
        $presences = Presence::query()->with(['user', 'absenceReason'])
            ->latest()
            ->get();

        $filename = 'Presences_All_'.now()->format('YmdHis').'.pdf';

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
        $presences = Presence::query()->where('user_id', '=', $user->id)
            ->with(['absenceReason'])
            ->latest()
            ->get();

        // Calculer les statistiques
        $stats = $this->calculateUserStats($presences);

        $filename = 'Presences_'.str_replace(' ', '_', $user->name).'_'.now()->format('YmdHis').'.pdf';

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
        $presences = Presence::query()->where('user_id', '=', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->with(['absenceReason'])
            ->latest()
            ->get();

        $stats = $this->calculateUserStats($presences);

        $filename = 'Presences_'.str_replace(' ', '_', $user->name).'_'.$startDate.'_to_'.$endDate.'.pdf';

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

        $users = User::query()
            ->has('presences')
            ->with(['presences' => function ($query) {
                $query->with(['absenceReason'])->latest();
            }])
            ->get();
        $zipFilename = 'Presences_All_Users_'.now()->format('YmdHis').'.zip';
        $zipPath = storage_path('app/temp/'.$zipFilename);

        // Créer le dossier temp si inexistant
        if (! file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        $zip = new \ZipArchive;
        if ($zip->open($zipPath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) === true) {
            foreach ($users as $user) {
                /** @var User $user */
                $presences = $user->presences;

                $stats = $this->calculateUserStats($presences);
                $pdfFilename = 'Presences_'.str_replace(' ', '_', $user->name).'.pdf';

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