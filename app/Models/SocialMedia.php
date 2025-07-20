<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SocialMedia extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'platform',
        'url',
        'display_name',
    ];

    protected $casts = [
        'platform' => 'string',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function socialMedias()
    {
        return $this->hasMany(SocialMedia::class);
    }
}
