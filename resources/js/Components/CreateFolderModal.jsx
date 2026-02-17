import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Folder } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function CreateFolderModal({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        workspace: '',
        color: '#2563EB',
    });

    const workspaces = [
        { value: '', label: 'Aucun espace de travail' },
        { value: 'Comptabilité', label: 'Comptabilité' },
        { value: 'Juridique', label: 'Juridique' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'Ressources Humaines', label: 'Ressources Humaines' },
    ];

    const colors = [
        { value: '#2563EB', label: 'Bleu', class: 'bg-blue-600' },
        { value: '#10B981', label: 'Vert', class: 'bg-green-600' },
        { value: '#F59E0B', label: 'Orange', class: 'bg-orange-600' },
        { value: '#8B5CF6', label: 'Violet', class: 'bg-purple-600' },
        { value: '#EC4899', label: 'Rose', class: 'bg-pink-600' },
        { value: '#EF4444', label: 'Rouge', class: 'bg-red-600' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post('/folders', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="div"
                                    className="flex items-center justify-between mb-4"
                                >
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                                        Créer un nouveau dossier
                                    </h3>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Nom du dossier */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nom du dossier <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Ex: Factures 2024"
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            autoFocus
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Espace de travail */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Espace de travail
                                        </label>
                                        <select
                                            value={data.workspace}
                                            onChange={(e) => setData('workspace', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            {workspaces.map((workspace) => (
                                                <option key={workspace.value} value={workspace.value}>
                                                    {workspace.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Couleur */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Couleur
                                        </label>
                                        <div className="flex gap-3">
                                            {colors.map((color) => (
                                                <button
                                                    key={color.value}
                                                    type="button"
                                                    onClick={() => setData('color', color.value)}
                                                    className={`h-10 w-10 rounded-lg ${color.class} ${
                                                        data.color === color.value
                                                            ? 'ring-2 ring-offset-2 ring-gray-900'
                                                            : 'hover:opacity-80'
                                                    } transition-all`}
                                                    title={color.label}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Prévisualisation */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-xs text-gray-500 mb-2">Aperçu</p>
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className="p-3 rounded-lg"
                                                style={{ 
                                                    backgroundColor: data.color + '20',
                                                    color: data.color
                                                }}
                                            >
                                                <Folder className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {data.name || 'Nom du dossier'}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {data.workspace || 'Aucun espace'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Boutons */}
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                            disabled={processing}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!data.name || processing}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Création...
                                                </>
                                            ) : (
                                                <>
                                                    <Folder className="h-4 w-4 mr-2" />
                                                    Créer le dossier
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}