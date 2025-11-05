<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;

/**
 * Class User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $password
 * @property string|null $role
 * @property string|null $avatar
 * @property string|null $github_id
 * @property string|null $github_token
 * @property string|null $github_refresh_token
 * @property string|null $google_id
 * @property string|null $google_token
 * @property string|null $google_refresh_token
 * @property Carbon|null $email_verified_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Collection<int, SocialMedia> $socialMedias
 *
 * @method static Builder|User whereRole(string $role)
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'github_id',
        'github_token',
        'github_refresh_token',
        'google_id',
        'google_token',
        'google_refresh_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'role' => 'string',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Détermine si l’utilisateur a le rôle de super‑administrateur.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role === (string) env('SUPERADMIN_ROLE', 'lolo');
    }

    /**
     * Relation : l’utilisateur possède plusieurs médias sociaux.
     *
     * @return HasMany<SocialMedia>
     */
    public function socialMedias(): HasMany
    {
        return $this->hasMany(SocialMedia::class, 'user_id', 'id');
    }

    /**
     * Relation : l’utilisateur possède plusieurs présences.
     *
     * @return HasMany<Presence>
     */
    public function presences(): HasMany  // {{-- AJOUTEZ CETTE MÉTHODE --}}
    {
        return $this->hasMany(Presence::class, 'user_id', 'id');
    }

    /**
     * Get the stages for the user.
     */
    public function stages(): HasMany
    {
        return $this->hasMany(Stage::class);
    }
}
