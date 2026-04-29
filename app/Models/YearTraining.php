<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class YearTraining extends Model
{
    use HasFactory;

    protected $fillable = [
        'label',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        // S'assurer qu'une seule année de formation est active
        static::saving(function (YearTraining $yearTraining) {
            if ($yearTraining->is_active) {
                YearTraining::query()
                    ->where('id', '!=', $yearTraining->id)
                    ->update(['is_active' => false]);
            }
        });
    }

    public function stages(): HasMany
    {
        return $this->hasMany(Stage::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
