<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Class SocialMedia
 *
 * @property int $id
 * @property int $user_id
 * @property string $platform
 * @property string $url
 * @property string $display_name
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read \App\Models\User      $user
 * @property-read \Illuminate\Database\Eloquent\Collection<int, SocialMedia> $socialMedias
 */
class SocialMedia extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'social_media';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'platform',
        'url',
        'display_name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'platform' => 'string',
    ];

    /**
     * Relationship : SocialMedia belongs to a User.
     *
     * @return BelongsTo<\App\Models\User, SocialMedia>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Relationship : a SocialMedia may have many child SocialMedia entries.
     *
     * @return HasMany<SocialMedia>
     */
    public function socialMedias(): HasMany
    {
        return $this->hasMany(self::class, 'user_id', 'user_id');
    }
}
