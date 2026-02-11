<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    /**
     * Upload un nouveau document
     */
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $file = $request->file('file');
        
        // Générer un nom unique
        $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
        
        // Stocker le fichier
        $path = $file->storeAs('documents', $filename, 'public');

        // Déterminer le type de fichier
        $type = $this->determineFileType($file->getMimeType());

        // Créer l'enregistrement
        $document = Document::create([
            'name' => pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME),
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'type' => $type,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'user_id' => auth()->id(),
            'folder_id' => $request->folder_id,
        ]);

        return back()->with('success', 'Document uploadé avec succès');
    }

    /**
     * Télécharger un document
     */
    public function download(Document $document)
    {
        return Storage::disk('public')->download(
            $document->path,
            $document->original_name
        );
    }

    /**
     * Supprimer un document
     */
    public function destroy(Document $document)
    {
        // Vérifier les permissions
        if ($document->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403);
        }

        // Supprimer le fichier physique
        Storage::disk('public')->delete($document->path);

        // Supprimer l'enregistrement (soft delete)
        $document->delete();

        return back()->with('success', 'Document supprimé');
    }

    /**
     * Basculer le statut favori
     */
    public function toggleFavorite(Document $document)
    {
        $document->update([
            'is_favorite' => !$document->is_favorite
        ]);

        return back();
    }

    /**
     * Rechercher des documents
     */
    public function search(Request $request)
    {
        $query = $request->get('q');
        $type = $request->get('type'); // pdf, image, spreadsheet, document

        $documents = Document::query()
            ->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('original_name', 'like', "%{$query}%");
            })
            ->when($type && $type !== 'all', function($q) use ($type) {
                $q->where('type', $type);
            })
            ->with(['user', 'folder'])
            ->latest()
            ->get();

        return response()->json($documents);
    }

    /**
     * Déterminer le type de fichier
     */
    private function determineFileType($mimeType)
    {
        if (str_contains($mimeType, 'pdf')) {
            return 'pdf';
        }
        
        if (str_contains($mimeType, 'image')) {
            return 'image';
        }
        
        if (str_contains($mimeType, 'spreadsheet') || 
            str_contains($mimeType, 'excel') || 
            str_contains($mimeType, 'csv')) {
            return 'spreadsheet';
        }
        
        if (str_contains($mimeType, 'word') || 
            str_contains($mimeType, 'document') ||
            str_contains($mimeType, 'text')) {
            return 'document';
        }
        
        return 'other';
    }
}