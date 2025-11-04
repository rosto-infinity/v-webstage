<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * Class Presence
 *
 * @property int $id
 * @property int $user_id
 * @property string $date Format Y‑m‑d
 * @property string|null $arrival_time Heure d’arrivée (HH:MM ou NULL)
 * @property string|null $departure_time Heure de départ (HH:MM ou NULL)
 * @property int $late_minutes Nombre de minutes de retard
 * @property bool $absent Indique si l’utilisateur est absent
 * @property bool $late Indique si l’utilisateur est en retard
 * @property int|null $absence_reason_id Référence au motif d’absence
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\User               $user
 * @property-read \App\Models\AbsenceReason|null $absenceReason
 */
class Presence extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'presences';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'date',
        'arrival_time',
        'departure_time',
        'late_minutes',
        'absent',
        'late',
        'absence_reason_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'late_minutes' => 'integer',
        'absent' => 'boolean',
        'late' => 'boolean',
        'arrival_time' => 'string', // custom cast if needed, else default
        'departure_time' => 'string', // likewise
    ];

    /**
     * Relation : présence appartient à un utilisateur.
     *
     * @return BelongsTo<\App\Models\User, Presence>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Relation : présence peut avoir un motif d’absence (nullable).
     *
     * @return BelongsTo<\App\Models\AbsenceReason, Presence>
     */
    public function absenceReason(): BelongsTo
    {
        return $this->belongsTo(AbsenceReason::class, 'absence_reason_id', 'id');
    }
}
