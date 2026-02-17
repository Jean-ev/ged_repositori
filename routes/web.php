<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\FolderController;
use Illuminate\Support\Facades\Route;

// Page d'accueil (redirection vers dashboard si authentifié)
Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Routes authentifiées
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Dashboards
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/documents', [DashboardController::class, 'documents'])->name('documents');
    Route::get('/my-documents', [DashboardController::class, 'myDocuments'])->name('my-documents');

    // Documents
    Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');
    Route::delete('/documents/{document}', [DocumentController::class, 'destroy'])->name('documents.destroy');
    Route::post('/documents/{document}/favorite', [DocumentController::class, 'toggleFavorite'])->name('documents.favorite');
    Route::get('/search', [DocumentController::class, 'search'])->name('documents.search');

    // Folders
    Route::post('/folders', [FolderController::class, 'store'])->name('folders.store');
    Route::put('/folders/{folder}', [FolderController::class, 'update'])->name('folders.update'); 
    Route::delete('/folders/{folder}', [FolderController::class, 'destroy'])->name('folders.destroy');
    Route::post('/folders/{folder}/favorite', [FolderController::class, 'toggleFavorite'])->name('folders.favorite');

    // Profil (conservé de l'original)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Routes d'authentification (login, register, etc.)
require __DIR__.'/auth.php';