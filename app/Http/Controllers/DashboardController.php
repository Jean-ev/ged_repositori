<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Folder;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * GED Dashboard - Vue d'ensemble avec KPIs
     */
    public function index()
    {
        $user = auth()->user();

        // Calculer les KPIs
        $stats = [
            'totalDocuments' => Document::count(),
            'approvedThisWeek' => Document::where('status', 'approved')
                ->where('created_at', '>=', Carbon::now()->subWeek())
                ->count(),
            'pending' => Document::where('status', 'pending')->count(),
            'activeUsers' => User::where('updated_at', '>=', Carbon::now()->subDay())->count(),
        ];

        // Dossiers récents
        $recentFolders = Folder::withCount('documents')
            ->with('user')
            ->latest()
            ->take(4)
            ->get()
            ->map(function ($folder) {
                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'filesCount' => $folder->documents_count,
                    'totalSize' => $folder->formatted_size,
                    'color' => $folder->color,
                ];
            });

        // Fichiers récents
        $recentDocuments = Document::with(['user', 'folder'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('GEDDashboard', [
            'stats' => $stats,
            'recentFolders' => $recentFolders,
            'recentDocuments' => $recentDocuments,
            'user' => $user,
        ]);
    }

    /**
     * Document Dashboard - Accès rapide
     */
    public function documents()
    {
        $user = auth()->user();

        // Dossiers favoris
        $favoriteFolders = Folder::where('is_favorite', true)
            ->withCount('documents')
            ->take(4)
            ->get()
            ->map(function ($folder) {
                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'filesCount' => $folder->documents_count,
                    'totalSize' => $folder->formatted_size,
                    'color' => $folder->color,
                ];
            });

        // Tous les documents
        $documents = Document::with(['user', 'folder'])
            ->latest()
            ->paginate(20);

        return Inertia::render('DocumentDashboard', [
            'favoriteFolders' => $favoriteFolders,
            'documents' => $documents,
            'user' => $user,
        ]);
    }

    /**
     * My Documents - Documents personnels
     */
    public function myDocuments()
    {
        $user = auth()->user();

        // Mes dossiers
        $myFolders = Folder::where('user_id', $user->id)
            ->withCount('documents')
            ->take(4)
            ->get()
            ->map(function ($folder) {
                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'filesCount' => $folder->documents_count,
                    'totalSize' => $folder->formatted_size,
                    'color' => $folder->color,
                ];
            });

        // Mes documents
        $myDocuments = Document::where('user_id', $user->id)
            ->with('folder')
            ->latest()
            ->paginate(20);

        // Statistiques de stockage
        $storageStats = [
            'used' => Document::where('user_id', $user->id)->sum('size'),
            'total' => 10 * 1024 * 1024 * 1024, // 10 GB
        ];

        return Inertia::render('MyDocuments', [
            'user' => $user,
            'myFolders' => $myFolders,
            'myDocuments' => $myDocuments,
            'storageStats' => $storageStats,
        ]);
    }
}