<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'service',
        'avatar',
        'location',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Relations
    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function folders()
    {
        return $this->hasMany(Folder::class);
    }

    public function sharedDocuments()
    {
        return $this->belongsToMany(Document::class, 'document_user')
                    ->withPivot('permission')
                    ->withTimestamps();
    }

    // Helpers
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}