import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef(null);

    // Fermer les résultats quand on clique en dehors
    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Rechercher avec un délai (debounce)
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        
        const timer = setTimeout(() => {
            fetch(`/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    setResults(data);
                    setIsOpen(true);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Erreur de recherche:', error);
                    setIsLoading(false);
                });
        }, 300); // Attendre 300ms après la dernière frappe

        return () => clearTimeout(timer);
    }, [query]);

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    const handleResultClick = (documentId) => {
        // Vous pouvez rediriger vers la page du document ou ouvrir un modal
        setIsOpen(false);
        setQuery('');
    };

    const highlightMatch = (text, query) => {
        if (!query) return text;
        
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) => 
            part.toLowerCase() === query.toLowerCase() 
                ? <mark key={index} className="bg-yellow-200">{part}</mark>
                : part
        );
    };

    return (
        <div ref={searchRef} className="relative flex-1 max-w-2xl">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Rechercher des documents, dossiers..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setIsOpen(true)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                {/* Bouton clear ou loading */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    ) : query && (
                        <button
                            onClick={handleClear}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Résultats de recherche */}
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
                    <div className="p-2">
                        <p className="text-xs text-gray-500 px-3 py-2">
                            {results.length} résultat{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
                        </p>
                        
                        {results.map((document) => (
                            <button
                                key={document.id}
                                onClick={() => handleResultClick(document.id)}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
                            >
                                <div className="flex-shrink-0">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {highlightMatch(document.name, query)}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span>{document.formatted_size}</span>
                                        <span>•</span>
                                        <span>{document.user.name}</span>
                                        {document.folder && (
                                            <>
                                                <span>•</span>
                                                <span>{document.folder.name}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                        {document.type}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Message aucun résultat */}
            {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500 text-center">
                        Aucun document trouvé pour "{query}"
                    </p>
                </div>
            )}
        </div>
    );
}