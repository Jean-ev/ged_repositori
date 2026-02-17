import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import DocumentMenu from '@/Components/DocumentMenu';
import { Upload, Folder, FileText, MoreVertical, Info } from 'lucide-react';
import { useState } from 'react';
import UploadModal from '@/Components/UploadModal';
import FileTypeFilter from '@/Components/FileTypeFilter';
import CreateFolderModal from '@/Components/CreateFolderModal';
import { FolderPlus } from 'lucide-react';
import FolderMenu from '@/Components/FolderMenu';
import EditFolderModal from '@/Components/EditFolderModal';

export default function MyDocuments({ auth, myFolders, myDocuments, storageStats }) {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false); 
    const [isEditFolderModalOpen, setIsEditFolderModalOpen] = useState(false);  // ← AJOUTER
    const [selectedFolder, setSelectedFolder] = useState(null);  // ← AJOUTER
    const [activeFilter, setActiveFilter] = useState('all');
    // Filtrer les documents selon le type
    const filteredDocuments = activeFilter === 'all' 
    ? myDocuments.data 
    : myDocuments.data.filter(doc => doc.type === activeFilter);
    const filterTabs = ['Tous', 'PDF', 'Images', 'Tableurs'];
    const handleEditFolder = (folder) => {
    setSelectedFolder(folder);
    setIsEditFolderModalOpen(true);
    };

    return (
        <AppLayout>
            <Head title="Mes Documents" />

            <div className="space-y-8">
                {/* En-tête */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Mes documents</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Consultez vos propres fichiers, ceux autorisés par l'administrateur et vos espaces d'équipe selon votre profil.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsFolderModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                            <FolderPlus className="h-5 w-5 mr-2" />
                            Nouveau dossier
                        </button>
                        <button 
                            onClick={() => setIsUploadModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            <Upload className="h-5 w-5 mr-2" />
                            Importer un fichier
                        </button>
                    </div>
                </div>

                {/* Profil utilisateur et infos */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Carte Profil */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center">
                                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-lg font-semibold mr-3">
                                    {auth.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{auth.user.name}</h3>
                                    <p className="text-sm text-gray-500">Mon profil</p>
                                </div>
                            </div>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                                Gérer le profil
                            </button>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Rôle :</span>
                                <span className="font-medium">{auth.user.role}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Service :</span>
                                <span className="font-medium">{auth.user.service || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Localisation :</span>
                                <span className="font-medium">{auth.user.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Widget info 1 */}
                    <div className="bg-blue-50 rounded-lg p-6">
                        <div className="flex items-start">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Mes documents</h4>
                                <p className="text-sm text-gray-600">
                                    Tous les fichiers que vous avez importés.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Widget info 2 */}
                    <div className="bg-green-50 rounded-lg p-6">
                        <div className="flex items-start">
                            <Info className="h-5 w-5 text-green-600 mt-0.5 mr-3" />
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Documents autorisés</h4>
                                <p className="text-sm text-gray-600">
                                    Fichiers explicitement validés par l'administrateur pour votre profil.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accès Rapide */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Accès Rapide</h2>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {myFolders.map((folder) => (
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
                                        <FolderMenu folder={folder} onEdit={handleEditFolder} />

                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">{folder.name}</h3>
                                <p className="text-sm text-gray-600">
                                    {folder.filesCount} fichiers • {folder.totalSize}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Liste des documents */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Liste des documents</h2>
                        
                        <FileTypeFilter 
                            activeFilter={activeFilter}
                            onFilterChange={setActiveFilter}
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Dossier
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
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
                                {filteredDocuments.map((document) => (
                                    <tr key={document.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                                <div className="text-sm font-medium text-gray-900">
                                                    {document.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {document.folder?.name || 'Sans dossier'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(document.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {document.formatted_size}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <DocumentMenu document={document} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Indicateur de stockage */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900">Stockage</h3>
                        <span className="text-sm text-gray-500">
                            {storageStats.usedFormatted} / {storageStats.totalFormatted}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${storageStats.percentage}%` }}
                        />
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        {storageStats.percentage}% utilisé
                    </p>
                </div>
            </div>
            {/* Modal de création de dossier */}
            <CreateFolderModal
                isOpen={isFolderModalOpen}
                onClose={() => setIsFolderModalOpen(false)}
            />

            {/* Modal d'édition de dossier */}
            <EditFolderModal
                isOpen={isEditFolderModalOpen}
                onClose={() => {
                    setIsEditFolderModalOpen(false);
                    setSelectedFolder(null);
                }}
                folder={selectedFolder}
            />
        </AppLayout>
    );
}