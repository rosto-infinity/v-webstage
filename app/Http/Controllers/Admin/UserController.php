<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\Presence;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * Contrôleur de gestion des utilisateurs pour l'administration.
 */
final class UserController extends Controller
{
    /**
     * Affiche la liste paginée des utilisateurs (pour les super admins).
     *
     * @param  Request  $request  Requête HTTP entrante
     * @return InertiaResponse Réponse Inertia contenant la liste des utilisateurs
     */
    public function indexlist(Request $request): InertiaResponse
    {
        /** @var LengthAwarePaginator<int, User> $paginatedUsers */
        $paginatedUsers = User::latest()->paginate(7);

        return Inertia::render('SuperAdmin/Users/UserIndex', [
            'users' => $paginatedUsers,
            'totalUsers' => User::count(),
        ]);
    }

    /**
     * Affiche la liste des présences de l’utilisateur connecté.
     *
     * @return InertiaResponse Vue Inertia avec les présences utilisateur
     */
    public function list(): InertiaResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if ($user === null) {
            abort(403, 'Utilisateur non authentifié.');
        }

        /**
         * @var Collection<int, array{id: int, date: string, arrival_time: ?string, departure_time: ?string, late_minutes: int, absent: bool, late: bool, absence_reason: ?string}> $presences */
        $presences = Presence::where('user_id', $user->id)
            ->with('absenceReason')
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
                'absence_reason' => $p->absenceReason?->name,
            ]);

        $presenceCount = $presences->count();

        return Inertia::render('User/presenceListeUser', [
            'presences' => $presences,
            'presenceCount' => $presenceCount,
        ]);
    }

    /**
     * Affiche le tableau de bord de l’utilisateur connecté avec ses statistiques.
     *
     * @return InertiaResponse Vue Inertia avec les statistiques de présence utilisateur
     */
    public function index(): InertiaResponse
    {
        /** @var User|null $user */
        $user = Auth::user();

        if ($user === null) {
            abort(403, 'Utilisateur non authentifié.');
        }

        // Statistiques globales
        $total = Presence::where('user_id', $user->id)->count();
        $present = Presence::where('user_id', $user->id)->where('absent', false)->count();
        $absent = Presence::where('user_id', $user->id)->where('absent', true)->count();
        $late = Presence::where('user_id', $user->id)->where('late', true)->count();
        $lateMinutes = Presence::where('user_id', $user->id)->sum('late_minutes');

        // Statistiques hebdomadaires
        $weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        /** @var array<string, array{present: int, absent: int}> $weekStats */
        $weekStats = [];
        foreach ($weekDays as $day) {
            $weekStats[$day] = ['present' => 0, 'absent' => 0];
        }

        /** @var Collection<string, Collection<int, Presence>> $weekData */
        $weekData = Presence::where('user_id', $user->id)
            ->whereBetween('date', [now()->startOfWeek(), now()->endOfWeek()])
            ->get()
            ->groupBy(static fn (Presence $item): string => Carbon::parse($item->date)->format('D'));

        foreach ($weekData as $day => $items) {
            $weekStats[$day]['present'] = $items->where('absent', false)->count();
            $weekStats[$day]['absent'] = $items->where('absent', true)->count();
        }

        // Statistiques mensuelles
        /** @var array<int, array{month: string, rate: float}> $monthlyStats */
        $monthlyStats = Presence::where('user_id', $user->id)
            ->selectRaw('MONTH(date) as month, COUNT(*) as total, SUM(CASE WHEN absent = 0 THEN 1 ELSE 0 END) as presents')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(static fn ($row): array => [
                'month' => Carbon::create()->month((int) $row->month)->format('M'),
                'rate' => $row->total > 0 ? round($row->presents / $row->total * 100, 1) : 0.0,
            ])->toArray();

        return Inertia::render('Dashboard', [
            'total' => $total,
            'present' => $present,
            'absent' => $absent,
            'late' => $late,
            'lateMinutes' => $lateMinutes,
            'weekStats' => $weekStats,
            'monthlyStats' => $monthlyStats,
            'isSuperAdmin' => $user->isSuperAdmin(),
        ]);
    }

    /**
     * Affiche le formulaire de création d’un utilisateur.
     */
    public function create(): InertiaResponse
    {
        return Inertia::render('SuperAdmin/Users/UserCreate');
    }

    /**
     * Enregistre un nouvel utilisateur en base de données.
     *
     * @param  StoreUserRequest  $request  Requête de création validée
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        User::create([
            'name' => (string) $data['name'],
            'email' => (string) $data['email'],
            'password' => Hash::make((string) $data['password']),
        ]);

        return redirect()->route('users.index')->with('success', 'Utilisateur créé');
    }

    /**
     * Affiche le formulaire d’édition d’un utilisateur.
     *
     * @param  User  $user  L’utilisateur à éditer
     */
    public function edit(User $user): InertiaResponse
    {
        return Inertia::render('SuperAdmin/Users/UserEdit', [
            'user' => $user,
        ]);
    }

    /**
     * Met à jour un utilisateur existant.
     *
     * @param  UpdateUserRequest  $request  Requête d’édition validée
     * @param  User  $user  L’utilisateur à mettre à jour
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        $user->name = (string) $data['name'];
        $user->email = (string) $data['email'];

        if (! empty($data['password'] ?? '')) {
            $user->password = Hash::make((string) $data['password']);
        }

        $user->save();

        return redirect()->route('users.index')->with('success', 'Utilisateur mis à jour');
    }

    /**
     * Supprime un utilisateur.
     *
     * @param  User  $user  L’utilisateur à supprimer
     */
    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return redirect()->route('users.index')->with('success', 'Utilisateur supprimé');
    }

    public function downloadAllUser(): \Illuminate\Http\Response
    {
        /** @var User|null $user */
        $user = Auth::user();

        if ($user === null) {
            abort(403, 'Utilisateur non authentifié.');
        }

        $presences = Presence::where('user_id', $user->id)->latest()->get();

        $totalDays = $presences->count();
        $weekNumber = now()->weekOfYear;
        $monthName = now()->monthName;
        $totalLateHours = $presences->sum('late_minutes') / 60.0;
        $totalAbsenceDays = $presences->where('absent', true)->count();

        $filename = 'Presences_'.now()->format('YmdHis').'.pdf';

        return Pdf::loadView('User/PdfAllUser', [
            'presences' => $presences,
            'date' => now()->format('d/m/Y'),
            'user' => $user,
            'totalDays' => $totalDays,
            'weekNumber' => $weekNumber,
            'monthName' => $monthName,
            'totalLateHours' => $totalLateHours,
            'totalAbsenceDays' => $totalAbsenceDays,
        ])
            ->setPaper('A4', 'landscape')
            ->download($filename);
    }
}
