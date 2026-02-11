<?php

namespace App\Http\Controllers;

use App\Models\Folder;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    /**
     * Créer un nouveau dossier
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'workspace' => 'nullable|string',
            'parent_id' => 'nullable|exists:folders,id',
        ]);

        $folder = Folder::create([
            'name' => $request->name,
            'workspace' => $request->workspace,
            'parent_id' => $request->parent_id,
            'user_id' => auth()->id(),
            'color' => $request->color ?? '#2563EB',
        ]);

        return back()->with('success', 'Dossier créé avec succès');
    }

    /**
     * Supprimer un dossier
     */
    public function destroy(Folder $folder)
    {
        // Vérifier les permissions
        if ($folder->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403);
        }

        $folder->delete();

        return back()->with('success', 'Dossier supprimé');
    }

    /**
     * Basculer le statut favori
     */
    public function toggleFavorite(Folder $folder)
    {
        $folder->update([
            'is_favorite' => !$folder->is_favorite
        ]);

        return back();
    }
}