<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Folder extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'user_id',
        'parent_id',
        'is_favorite',
        'workspace',
        'color',
    ];

    protected $casts = [
        'is_favorite' => 'boolean',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(Folder::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Folder::class, 'parent_id');
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    // Accessors
    public function getFilesCountAttribute()
    {
        return $this->documents()->count();
    }

    public function getTotalSizeAttribute()
    {
        return $this->documents()->sum('size');
    }

    public function getFormattedSizeAttribute()
    {
        return $this->formatBytes($this->total_size);
    }

    // Helpers
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['o', 'Ko', 'Mo', 'Go', 'To'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}