<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Presence;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Contrôleur du tableau de bord administratif.
 *
 * Gère les statistiques globales (présences, absences, retards)
 * pour les super administrateurs et administrateurs standards.
 */
final class DashboardController extends Controller
{
    /**
     * Tableau de bord principal du super administrateur.
     *
     * @param  Request  $request  Requête HTTP entrante
     * @return Response Réponse Inertia contenant les statistiques globales
     */
    public function superadmin(Request $request): Response
    {
        /** @var array{
         *     date?: string,
         *     month?: string,
         *     week?: string,
         *     user?: string,
         *     filterType?: string
         * } $validated
         */
        $validated = $request->validate([
            'date' => 'nullable|date_format:Y-m-d',
            'month' => 'nullable|date_format:Y-m',
            'week' => 'nullable|date_format:Y-m-d',
            'user' => 'nullable|string|exists:users,name',
            'filterType' => 'nullable|in:day,week,month',
        ]);

        $date = $validated['date'] ?? now()->toDateString();
        $month = $validated['month'] ?? now()->format('Y-m');
        $week = $validated['week'] ?? now()->toDateString();
        $user = $validated['user'] ?? '';
        $filterType = $validated['filterType'] ?? 'day';

        /** @var string $startDate */
        /** @var string $endDate */
        $startDate = match ($filterType) {
            'month' => Carbon::parse($month)->startOfMonth()->toDateString(),
            'week' => Carbon::parse($week)->startOfWeek()->toDateString(),
            default => $date,
        };

        $endDate = match ($filterType) {
            'month' => Carbon::parse($month)->endOfMonth()->toDateString(),
            'week' => Carbon::parse($week)->endOfWeek()->toDateString(),
            default => $date,
        };

        /** @var array<int, string> $users */
        $users = User::pluck('name')->toArray();

        $query = Presence::query()->with('absenceReason');

        if ($user !== '') {
            $query->whereHas('user', static fn ($q) => $q->where('name', $user));
        }

        $presenceCount = (clone $query)->whereBetween('date', [$startDate, $endDate])->count();
        $countPresent = (clone $query)->whereBetween('date', [$startDate, $endDate])
            ->where('absent', false)->count();
        $countAbsent = (clone $query)->whereBetween('date', [$startDate, $endDate])
            ->where('absent', true)->count();
        $countLate = (clone $query)->whereBetween('date', [$startDate, $endDate])
            ->where('late', true)->count();

        return Inertia::render('SuperAdmin/Dashboard', [
            'totalUsers' => $user !== '' ? 1 : User::count(),
            'presenceCount' => $presenceCount,
            'Countpresent' => $countPresent,
            'Countabsent' => $countAbsent,
            'Countlate' => $countLate,
            'selectedDate' => $date,
            'selectedMonth' => $month,
            'selectedWeek' => $week,
            'selectedUser' => $user,
            'users' => $users,
            'filterType' => $filterType,
            'weeklyPresence' => $this->getWeeklyStats($week, $user),
            'monthlyTrend' => $this->getMonthlyStats($month, $user),
            'absenceReasons' => $this->getAbsenceReasons($month, $user),
        ]);
    }

    /**
     * Récupère les statistiques hebdomadaires pour la semaine donnée.
     *
     * @param  string  $week  Date de référence dans la semaine (format Y-m-d)
     * @param  string  $user  Nom d’utilisateur facultatif pour filtrer
     * @return array<int, array{day: string, present: int, absent: int}>
     */
    private function getWeeklyStats(string $week, string $user = ''): array
    {
        $startOfWeek = Carbon::parse($week)->startOfWeek();
        $query = Presence::query();

        if ($user !== '') {
            $query->whereHas('user', static fn ($q) => $q->where('name', $user));
        }

        /** @var array<int, array{day: string, present: int, absent: int}> $stats */
        $stats = collect(range(0, 6))
            ->map(function (int $day) use ($startOfWeek, $query): array {
                $currentDate = $startOfWeek->copy()->addDays($day);

                return [
                    'day' => $currentDate->isoFormat('ddd'),
                    'present' => (clone $query)->whereDate('date', $currentDate)
                        ->where('absent', false)->count(),
                    'absent' => (clone $query)->whereDate('date', $currentDate)
                        ->where('absent', true)->count(),
                ];
            })
            ->toArray();

        return $stats;
    }

    /**
     * Récupère les tendances mensuelles pour le mois donné.
     *
     * @param  string  $month  Mois ciblé (format Y-m)
     * @param  string  $user  Nom d’utilisateur facultatif
     * @return array<int, array{day: string, rate: float}>
     */
    private function getMonthlyStats(string $month, string $user = ''): array
    {
        $startOfMonth = Carbon::parse($month)->startOfMonth();
        $endOfMonth = Carbon::parse($month)->endOfMonth();

        $query = Presence::query();
        if ($user !== '') {
            $query->whereHas('user', static fn ($q) => $q->where('name', $user));
        }

        $totalUsers = $user !== '' ? 1 : User::count();
        $dayExpr = DB::getDriverName() === 'sqlite'
            ? "strftime('%d', date)"
            : 'DAY(date)';

        /** @var Collection<int, object{day: string, count: int}> $result */
        $result = $query->whereBetween('date', [$startOfMonth, $endOfMonth])
            ->selectRaw("$dayExpr as day, COUNT(*) as count")
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        /** @var array<int, array{day: string, rate: float}> $stats */
        $stats = $result->map(static fn ($item): array => [
            'day' => (string) $item->day,
            'rate' => $totalUsers > 0 ? ($item->count / $totalUsers) * 100 : 0.0,
        ])->toArray();

        return $stats;
    }

    /**
     * Récupère les motifs d’absence pour le mois donné.
     *
     * @param  string  $month  Mois ciblé (format Y-m)
     * @param  string  $user  Nom d’utilisateur facultatif
     * @return array<int, array{label: string, value: int, color: string}>
     */
    private function getAbsenceReasons(string $month, string $user = ''): array
    {
        $startOfMonth = Carbon::parse($month)->startOfMonth();
        $endOfMonth = Carbon::parse($month)->endOfMonth();

        $query = Presence::query()
            ->where('absent', true)
            ->with('absenceReason');

        if ($user !== '') {
            $query->whereHas('user', static fn ($q) => $q->where('name', $user));
        }

        /** @var Collection<int, Presence> $presences */
        $presences = $query->whereBetween('date', [$startOfMonth, $endOfMonth])->get();

        /** @var array<int, array{label: string, value: int, color: string}> $reasons */
        $reasons = $presences
            ->groupBy(
                static fn (Presence $presence): ?string => $presence->absenceReason?->name ?? null
            )
            ->map(static fn (Collection $group, ?string $reason): array => [
                'label' => $reason ?? 'Sans motif',
                'value' => $group->count(),
                'color' => $reason
                    ? sprintf('#%06X', random_int(0, 0xFFFFFF))
                    : '#EF4444',
            ])
            ->values()
            ->toArray();

        return $reasons;
    }

    /**
     * Tableau de bord standard pour les administrateurs.
     */
    public function admin(Request $request): Response
    {
        return Inertia::render('Admin/Dashboard', []);
    }
}
