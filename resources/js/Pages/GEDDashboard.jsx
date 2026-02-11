import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import DocumentMenu from '@/Components/DocumentMenu';
import { FileText, CheckCircle, Clock, Users, Folder, MoreVertical } from 'lucide-react';

export default function GEDDashboard({ auth, stats, recentFolders, recentDocuments }) {
    // Icônes pour les KPIs
    const statIcons = {
        totalDocuments: FileText,
        approvedThisWeek: CheckCircle,
        pending: Clock,
        activeUsers: Users,
    };

    const statColors = {
        totalDocuments: 'bg-blue-50 text-blue-600',
        approvedThisWeek: 'bg-green-50 text-green-600',
        pending: 'bg-orange-50 text-orange-600',
        activeUsers: 'bg-purple-50 text-purple-600',
    };

    const statLabels = {
        totalDocuments: 'Total Documents',
        approvedThisWeek: 'Approuvés cette semaine',
        pending: 'En attente',
        activeUsers: 'Utilisateurs actifs',
    };

    return (
        <AppLayout>
            <Head title="Dashboard GED" />

            <div className="space-y-8">
                {/* En-tête */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vue d'ensemble</h1>
                </div>

                {/* KPIs - 4 cartes de statistiques */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {Object.entries(stats).map(([key, value]) => {
                        const Icon = statIcons[key];
                        const colorClass = statColors[key];
                        const label = statLabels[key];

                        return (
                            <div key={key} className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{label}</p>
                                        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${colorClass}`}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Dossiers Récents */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Dossiers Récents</h2>
                        <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                            Tout voir
                        </a>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {recentFolders.map((folder) => (
                            <div key={folder.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`p-3 rounded-lg`} style={{ backgroundColor: folder.color + '20', color: folder.color }}>
                                        <Folder className="h-6 w-6" />
                                    </div>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreVertical className="h-5 w-5" />
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Fichiers Récents</h2>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date de modification
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentDocuments.map((document) => (
                                    <tr key={document.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <FileText className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {document.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {document.formatted_size}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(document.created_at).toLocaleDateString('fr-FR')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {document.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {document.status === 'approved' && (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                    Approuvé
                                                </span>
                                            )}
                                            {document.status === 'pending' && (
                                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                                    En attente
                                                </span>
                                            )}
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
            </div>
        </AppLayout>
    );
}