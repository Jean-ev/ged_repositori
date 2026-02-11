<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'original_name',
        'path',
        'type',
        'mime_type',
        'size',
        'user_id',
        'folder_id',
        'is_favorite',
        'status',
        'description',
    ];

    protected $casts = [
        'is_favorite' => 'boolean',
        'size' => 'integer',
    ];

    protected $appends = [
        'formatted_size',
        'icon',
        'url',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

    public function sharedWith()
    {
        return $this->belongsToMany(User::class, 'document_user')
                    ->withPivot('permission')
                    ->withTimestamps();
    }

    // Accessors
    public function getFormattedSizeAttribute()
    {
        return $this->formatBytes($this->size);
    }

    public function getIconAttribute()
    {
        return match($this->type) {
            'pdf' => 'FileText',
            'image' => 'Image',
            'spreadsheet' => 'Sheet',
            'document' => 'FileEdit',
            default => 'File',
        };
    }

    public function getUrlAttribute()
    {
        return asset('storage/' . $this->path);
    }

    // Helpers
    private function formatBytes($bytes, $precision = 2)
    {
        $units = ['o', 'Ko', 'Mo', 'Go'];
        
        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }
        
        return round($bytes, $precision) . ' ' . $units[$i];
    }
}