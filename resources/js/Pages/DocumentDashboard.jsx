import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import UploadModal from '@/Components/UploadModal';
import { Search, Upload, Folder, FileText, MoreVertical, Filter } from 'lucide-react';
import { useState } from 'react';
import DocumentMenu from '@/Components/DocumentMenu';

export default function DocumentDashboard({ auth, favoriteFolders, documents }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    // Récupérer tous les dossiers pour le modal
    const allFolders = favoriteFolders;

    return (
        <AppLayout>
            <Head title="Documents" />

            <div className="space-y-8">
                {/* En-tête avec recherche et bouton upload */}
                <div className="flex items-center justify-between">
                    <div className="flex-1 max-w-2xl">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher des documents, dossiers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="ml-4 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <Upload className="h-5 w-5 mr-2" />
                        Nouveau fichier
                    </button>
                </div>

                {/* Accès Rapide */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Accès rapide</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {favoriteFolders.map((folder) => (
                            <div 
                                key={folder.id} 
                                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div 
                                        className="p-3 rounded-lg" 
                                        style={{ 
                                            backgroundColor: folder.color + '20', 
                                            color: folder.color 
                                        }}
                                    >
                                        <Folder className="h-6 w-6" />
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <DocumentMenu document={document} />
                                        </td>
                                    </button>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{folder.name}</h3>
                                <p className="text-sm text-gray-600">
                                    {folder.filesCount} fichiers • {folder.totalSize}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fichiers Récents */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Fichiers récents</h2>
                        <div className="flex items-center space-x-2">
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtrer
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Propriétaire
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date de modification
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Taille
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {documents.data.map((document) => (
                                    <tr key={document.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                                <div className="text-sm font-medium text-gray-900">
                                                    {document.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-semibold mr-2">
                                                    {document.user.name.charAt(0)}
                                                </div>
                                                <div className="text-sm text-gray-900">{document.user.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(document.created_at).toLocaleDateString('fr-FR', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {document.formatted_size}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <DocumentMenu document={document} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal d'upload */}
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                folders={allFolders}
            />
        </AppLayout>
    );
}