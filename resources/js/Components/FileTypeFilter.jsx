import { FileText, Image, Sheet, File } from 'lucide-react';

export default function FileTypeFilter({ activeFilter, onFilterChange }) {
    const filters = [
        { id: 'all', label: 'Tous', icon: File },
        { id: 'pdf', label: 'PDF', icon: FileText },
        { id: 'image', label: 'Images', icon: Image },
        { id: 'spreadsheet', label: 'Tableurs', icon: Sheet },
        { id: 'document', label: 'Documents', icon: FileText },
    ];

    return (
        <div className="flex items-center gap-2">
            {filters.map((filter) => {
                const Icon = filter.icon;
                const isActive = activeFilter === filter.id;
                
                return (
                    <button
                        key={filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <Icon className="h-4 w-4" />
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
}