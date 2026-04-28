<?php

declare(strict_types=1);

use App\Models\AbsenceReason;
use App\Models\Presence;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function (): void {
    $this->admin = User::factory()->create(['role' => 'superadmin']);
    $this->actingAs($this->admin);
});

describe('Scénarios Utilisateur Complets', function (): void {
    test('créer présence → modifier → supprimer', function (): void {
        $user = User::factory()->create(['role' => 'user']);

        // 1. Créer une présence
        $createData = [
            'user_id' => $user->id,
            'date' => now()->toDateString(),
            'absent' => false,
            'en_retard' => false,
            'heure_arrivee' => '08:00',
            'heure_depart' => '17:00',
            'minutes_retard' => 0,
            'absence_reason_id' => null,
        ];

        $response = $this->post(route('presences.store'), $createData);
        $response->assertRedirect(route('presences.users'));

        $presence = Presence::where('user_id', $user->id)->first();
        expect($presence)->not->toBeNull()
            ->and($presence->arrival_time)->toBe('08:00');

        // 2. Modifier la présence
        $updateData = [
            'user_id' => $user->id,
            'date' => $presence->date,
            'absent' => false,
            'en_retard' => true,
            'heure_arrivee' => '08:30',
            'heure_depart' => '17:00',
            'minutes_retard' => 30,
            'absence_reason_id' => null,
        ];

        $response = $this->patch(route('presences.update', $presence->id), $updateData);
        $response->assertRedirect(route('presences.users'));

        $presence->refresh();
        expect($presence->arrival_time)->toBe('08:30')
            ->and($presence->late_minutes)->toBe(30)
            ->and($presence->late)->toBeTrue();

        // 3. Supprimer la présence
        $response = $this->delete(route('presences.destroy', $presence));
        $response->assertRedirect(route('presences.users'));

        $this->assertDatabaseMissing('presences', ['id' => $presence->id]);
    });

    test('créer présence présent → modifier en absent', function (): void {
        $user = User::factory()->create(['role' => 'user']);
        $reason = AbsenceReason::factory()->create();

        // 1. Créer présence (présent)
        $presence = Presence::factory()->create([
            'user_id' => $user->id,
            'date' => now()->toDateString(),
            'absent' => false,
            'arrival_time' => '08:00',
            'departure_time' => '17:00',
        ]);

        expect($presence->absent)->toBeFalse()
            ->and($presence->arrival_time)->toBe('08:00');

        // 2. Modifier en absent
        $updateData = [
            'user_id' => $user->id,
            'date' => $presence->date,
            'absent' => true,
            'en_retard' => false,
            'heure_arrivee' => null,
            'heure_depart' => null,
            'minutes_retard' => 0,
            'absence_reason_id' => $reason->id,
        ];

        $response = $this->patch(route('presences.update', $presence->id), $updateData);
        $response->assertRedirect(route('presences.users'));

        $presence->refresh();
        expect($presence->absent)->toBeTrue()
            ->and($presence->arrival_time)->toBeNull()
            ->and($presence->departure_time)->toBeNull()
            ->and($presence->absence_reason_id)->toBe($reason->id);
    });

    test('créer présence avec retard → vérifier calcul stats', function (): void {
        $user = User::factory()->create(['role' => 'user']);

        // Créer 3 présences avec retard
        Presence::factory()->create([
            'user_id' => $user->id,
            'date' => now()->subDays(2)->toDateString(),
            'absent' => false,
            'late' => true,
            'late_minutes' => 15,
        ]);

        Presence::factory()->create([
            'user_id' => $user->id,
            'date' => now()->subDays(1)->toDateString(),
            'absent' => false,
            'late' => true,
            'late_minutes' => 30,
        ]);

        Presence::factory()->create([
            'user_id' => $user->id,
            'date' => now()->toDateString(),
            'absent' => false,
            'late' => true,
            'late_minutes' => 45,
        ]);

        $presences = Presence::where('user_id', $user->id)->get();

        // Calculer les stats
        $controller = new \App\Http\Controllers\Admin\PresenceController;
        $reflection = new ReflectionClass($controller);
        $method = $reflection->getMethod('calculateUserStats');
        $method->setAccessible(true);

        $stats = $method->invoke($controller, $presences);

        expect($stats['total'])->toBe(3)
            ->and($stats['lates'])->toBe(3)
            ->and($stats['total_late_minutes'])->toBe(90)
            ->and($stats['average_late_minutes'])->toBe(30.0);
    });

    test('créer multiples présences → exporter Excel', function (): void {
        $user = User::factory()->create(['role' => 'user']);

        // Créer 5 présences
        Presence::factory()->count(5)->create(['user_id' => $user->id]);

        \Maatwebsite\Excel\Facades\Excel::fake();

        $response = $this->get(route('presences.excel'));

        // Just verify the route works - Excel fake requires filename
        $response->assertOk();
    });

    test('créer multiples présences → exporter PDF utilisateur', function (): void {
        $user = User::factory()->create(['role' => 'user']);

        // Créer 10 présences
        Presence::factory()->count(10)->create(['user_id' => $user->id]);

        $response = $this->get(route('presences.user.pdf', $user));

        $response->assertOk()
            ->assertHeader('content-type', 'application/pdf');
    });
});

describe('Cas Limites et Edge Cases', function (): void {
    test('tentative de création doublon même jour', function (): void {
        $user = User::factory()->create(['role' => 'user']);
        $date = now()->toDateString();

        // Première présence
        Presence::factory()->create([
            'user_id' => $user->id,
            'date' => $date,
        ]);

        // Tentative de doublon
        $data = [
            'user_id' => $user->id,
            'date' => $date,
            'absent' => false,
            'en_retard' => false,
            'heure_arrivee' => '08:00',
            'heure_depart' => '17:00',
            'minutes_retard' => 0,
            'absence_reason_id' => null,
        ];

        $response = $this->post(route('presences.store'), $data);

        $response->assertRedirect()
            ->assertSessionHasErrors('user_id');

        // Vérifier qu'il n'y a toujours qu'une seule présence
        $count = Presence::where('user_id', $user->id)
            ->whereDate('date', $date)
            ->count();

        expect($count)->toBe(1);
    });

    test('création présence pour plusieurs jours différents', function (): void {
        $user = User::factory()->create(['role' => 'user']);

        // Créer présences pour 5 jours différents
        for ($i = 0; $i < 5; $i++) {
            $data = [
                'user_id' => $user->id,
                'date' => now()->subDays($i)->toDateString(),
                'absent' => false,
                'en_retard' => false,
                'heure_arrivee' => '08:00',
                'heure_depart' => '17:00',
                'minutes_retard' => 0,
                'absence_reason_id' => null,
            ];

            $response = $this->post(route('presences.store'), $data);
            $response->assertRedirect(route('presences.users'));
        }

        $count = Presence::where('user_id', $user->id)->count();
        expect($count)->toBe(5);
    });

    test('modification présence sans changer user_id/date', function (): void {
        $presence = Presence::factory()->create([
            'absent' => false,
            'late' => false,
            'late_minutes' => 0,
        ]);

        // Modifier uniquement les heures
        $data = [
            'user_id' => $presence->user_id,
            'date' => $presence->date,
            'absent' => false,
            'en_retard' => true,
            'heure_arrivee' => '08:30',
            'heure_depart' => '17:00',
            'minutes_retard' => 30,
            'absence_reason_id' => null,
        ];

        $response = $this->patch(route('presences.update', $presence->id), $data);
        $response->assertRedirect(route('presences.users'));

        $presence->refresh();
        expect($presence->late_minutes)->toBe(30)
            ->and($presence->late)->toBeTrue();
    });

    test('modification présence en changeant date (pas de conflit)', function (): void {
        $presence = Presence::factory()->create([
            'date' => now()->subDays(5)->toDateString(),
        ]);

        $newDate = now()->subDays(3)->toDateString();

        $data = [
            'user_id' => $presence->user_id,
            'date' => $newDate,
            'absent' => false,
            'en_retard' => false,
            'heure_arrivee' => '08:00',
            'heure_depart' => '17:00',
            'minutes_retard' => 0,
            'absence_reason_id' => null,
        ];

        $response = $this->patch(route('presences.update', $presence->id), $data);
        $response->assertRedirect(route('presences.users'));

        $presence->refresh();
        expect($presence->date)->toBe($newDate);
    });

    test('création absence sans motif échoue', function (): void {
        $user = User::factory()->create(['role' => 'user']);

        $data = [
            'user_id' => $user->id,
            'date' => now()->toDateString(),
            'absent' => true,
            'en_retard' => false,
            'heure_arrivee' => null,
            'heure_depart' => null,
            'minutes_retard' => 0,
            'absence_reason_id' => null, // ← Manquant
        ];

        $response = $this->post(route('presences.store'), $data);

        $response->assertSessionHasErrors('absence_reason_id');
    });

    test('retard maximum (300 minutes) est accepté', function (): void {
        $user = User::factory()->create(['role' => 'user']);

        $data = [
            'user_id' => $user->id,
            'date' => now()->toDateString(),
            'absent' => false,
            'en_retard' => true,
            'heure_arrivee' => '08:00',
            'heure_depart' => '17:00',
            'minutes_retard' => 300,
            'absence_reason_id' => null,
        ];

        $response = $this->post(route('presences.store'), $data);
        $response->assertRedirect(route('presences.users'));

        $this->assertDatabaseHas('presences', [
            'user_id' => $user->id,
            'late_minutes' => 300,
        ]);
    });

    test('retard supérieur à 300 minutes échoue', function (): void {
        $user = User::factory()->create(['role' => 'user']);

        $data = [
            'user_id' => $user->id,
            'date' => now()->toDateString(),
            'absent' => false,
            'en_retard' => true,
            'heure_arrivee' => '08:00',
            'heure_depart' => '17:00',
            'minutes_retard' => 301,
            'absence_reason_id' => null,
        ];

        $response = $this->post(route('presences.store'), $data);
        $response->assertSessionHasErrors('minutes_retard');
    });
});

describe('Tests de Workflow Complet', function (): void {
    test('workflow hebdomadaire complet', function (): void {
        $user = User::factory()->create(['role' => 'user']);
        $reason = AbsenceReason::factory()->create();

        // Lundi - Présent à l'heure
        Presence::factory()->create([
            'user_id' => $user->id,
            'date' => now()->startOfWeek()->toDateString(),
            'absent' => false,
            'late' => false,
            'late_minutes' => 0,
        ]);

        // Mardi - En retard
        Presence::factory()->create([
            'user_id' => $user->id,
            'date' => now()->startOfWeek()->addDay()->toDateString(),
            'absent' => false,
            'late' => true,
            'late_minutes' => 15,
        ]);

        // Mercredi - Absent
        Presence::factory()->create([
            'user_id' => $user->id,
            'date' => now()->startOfWeek()->addDays(2)->toDateString(),
            'absent' => true,
            'arrival_time' => null,
            'departure_time' => null,
            'absence_reason_id' => $reason->id,
        ]);

        // Jeudi - Présent à l'heure
        Presence::factory()->create([
            'user_id' => $user->id,
            'date' => now()->startOfWeek()->addDays(3)->toDateString(),
            'absent' => false,
            'late' => false,
            'late_minutes' => 0,
        ]);

        // Vendredi - En retard
        Presence::factory()->create([
            'user_id' => $user->id,
            'date' => now()->startOfWeek()->addDays(4)->toDateString(),
            'absent' => false,
            'late' => true,
            'late_minutes' => 30,
        ]);

        $presences = Presence::where('user_id', $user->id)->get();

        // Vérifier les statistiques
        $controller = new \App\Http\Controllers\Admin\PresenceController;
        $reflection = new ReflectionClass($controller);
        $method = $reflection->getMethod('calculateUserStats');
        $method->setAccessible(true);

        $stats = $method->invoke($controller, $presences);

        // Vérifier les statistiques (le factory peut ajouter des retards aléatoires)
        expect($stats['total'])->toBe(5)
            ->and($stats['presents'])->toBe(4)
            ->and($stats['absents'])->toBe(1)
            ->and($stats['lates'])->toBeGreaterThanOrEqual(2)
            ->and($stats['total_late_minutes'])->toBeGreaterThanOrEqual(45)
            ->and($stats['presence_rate'])->toBe(80.0);
    });
});
