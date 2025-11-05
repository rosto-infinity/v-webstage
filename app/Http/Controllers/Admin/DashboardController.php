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
 * Fournit les statistiques globales pour les super administrateurs et administrateurs.
 */
final class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord principal du super administrateur.
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
        $userName = $validated['user'] ?? '';
        $filterType = $validated['filterType'] ?? 'day';

        [$startDate, $endDate] = $this->resolvePeriod($filterType, $date, $week, $month);

        /** @var array<int, string> $users */
        $users = User::pluck('name')->toArray();

        $query = Presence::query()
            ->with('absenceReason')
            ->when($userName !== '', static fn ($q) => $q->whereHas('user', fn ($u) => $u->where('name', $userName)))
            ->whereBetween('date', [$startDate, $endDate]);

        $stats = $this->computePresenceStats($query);

        return Inertia::render('SuperAdmin/Dashboard', [
            'totalUsers' => $userName !== '' ? 1 : User::count(),
            'presenceCount' => $stats['total'],
            'countPresent' => $stats['present'],
            'countAbsent' => $stats['absent'],
            'countLate' => $stats['late'],
            'selectedDate' => $date,
            'selectedMonth' => $month,
            'selectedWeek' => $week,
            'selectedUser' => $userName,
            'users' => $users,
            'filterType' => $filterType,
            'weeklyPresence' => $this->getWeeklyStats($week, $userName),
            'monthlyTrend' => $this->getMonthlyStats($month, $userName),
            'absenceReasons' => $this->getAbsenceReasons($month, $userName),
        ]);
    }

    /**
     * Détermine la période de filtrage.
     *
     * @return array{0: string, 1: string} [startDate, endDate]
     */
    private function resolvePeriod(string $filterType, string $date, string $week, string $month): array
    {
        return match ($filterType) {
            'month' => [
                Carbon::parse($month)->startOfMonth()->toDateString(),
                Carbon::parse($month)->endOfMonth()->toDateString(),
            ],
            'week' => [
                Carbon::parse($week)->startOfWeek()->toDateString(),
                Carbon::parse($week)->endOfWeek()->toDateString(),
            ],
            default => [$date, $date],
        };
    }

    /**
     * Calcule les statistiques globales sur les présences/absences/retards.
     *
     * @param  \Illuminate\Database\Eloquent\Builder<Presence>  $query
     * @return array{total: int, present: int, absent: int, late: int}
     */
    private function computePresenceStats($query): array
    {
        $base = (clone $query);
        $stats = [
            'total' => $base->count(),
            'present' => (clone $base)->where('absent', false)->count(),
            'absent' => (clone $base)->where('absent', true)->count(),
            'late' => (clone $base)->where('late', true)->count(),
        ];

        return $stats;
    }

    /**
     * Statistiques hebdomadaires (présent/absent par jour).
     */
    private function getWeeklyStats(string $week, string $user = ''): array
    {
        $startOfWeek = Carbon::parse($week)->startOfWeek();
        $query = Presence::query()
            ->when($user !== '', static fn ($q) => $q->whereHas('user', fn ($u) => $u->where('name', $user)));

        return collect(range(0, 6))
            ->map(static function (int $day) use ($startOfWeek, $query): array {
                $date = $startOfWeek->copy()->addDays($day);
                $base = (clone $query)->whereDate('date', $date);

                return [
                    'day' => $date->isoFormat('ddd'),
                    'present' => (clone $base)->where('absent', false)->count(),
                    'absent' => (clone $base)->where('absent', true)->count(),
                ];
            })
            ->toArray();
    }

    /**
     * Tendances mensuelles (taux de présence par jour du mois).
     */
    private function getMonthlyStats(string $month, string $user = ''): array
    {
        $start = Carbon::parse($month)->startOfMonth();
        $end = Carbon::parse($month)->endOfMonth();

        $query = Presence::query()
            ->when($user !== '', static fn ($q) => $q->whereHas('user', fn ($u) => $u->where('name', $user)));

        $totalUsers = $user !== '' ? 1 : User::count();
        $dayExpr = DB::getDriverName() === 'sqlite'
            ? "strftime('%d', date)"
            : 'DAY(date)';

        $result = $query
            ->whereBetween('date', [$start, $end])
            ->selectRaw("$dayExpr as day, COUNT(*) as count")
            ->groupBy('day')
            ->orderBy('day')
            ->get();

        return $result->map(static fn ($item): array => [
            'day' => (string) $item->day,
            'rate' => $totalUsers > 0 ? ($item->count / $totalUsers) * 100 : 0.0,
        ])->toArray();
    }

    /**
     * Statistiques sur les motifs d’absence du mois.
     */
    private function getAbsenceReasons(string $month, string $user = ''): array
    {
        $start = Carbon::parse($month)->startOfMonth();
        $end = Carbon::parse($month)->endOfMonth();

        $query = Presence::query()
            ->where('absent', true)
            ->with('absenceReason')
            ->when($user !== '', static fn ($q) => $q->whereHas('user', fn ($u) => $u->where('name', $user)))
            ->whereBetween('date', [$start, $end]);

        return $query->get()
            ->groupBy(static fn (Presence $p): ?string => $p->absenceReason?->name ?? null)
            ->map(static fn (Collection $group, ?string $reason): array => [
                'label' => $reason ?? 'Sans motif',
                'value' => $group->count(),
                'color' => $reason ? sprintf('#%06X', random_int(0, 0xFFFFFF)) : '#EF4444',
            ])
            ->values()
            ->toArray();
    }

    /**
     * Tableau de bord standard pour les administrateurs.
     */
    public function admin(Request $request): Response
    {
        return Inertia::render('Admin/Dashboard');
    }
}
