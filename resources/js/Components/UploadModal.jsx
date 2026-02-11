import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';
import { useForm } from '@inertiajs/react';

export default function UploadModal({ isOpen, onClose, folders = [] }) {
    const [dragActive, setDragActive] = useState(false);
    const { data, setData, post, processing, errors, progress, reset } = useForm({
        file: null,
        folder_id: '',
    });

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setData('file', e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setData('file', e.target.files[0]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        post(route('documents.store'), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'Ko', 'Mo', 'Go'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                                        Importer un fichier
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Zone de drag & drop */}
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-8 text-center ${
                                            dragActive
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-300 bg-gray-50'
                                        }`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        
                                        {!data.file ? (
                                            <label
                                                htmlFor="file-upload"
                                                className="cursor-pointer"
                                            >
                                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                                                <p className="text-sm text-gray-600 mb-1">
                                                    <span className="font-semibold text-blue-600 hover:text-blue-700">
                                                        Cliquez pour uploader
                                                    </span>
                                                    {' '}ou glissez-déposez
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PDF, PNG, JPG, DOCX, XLSX jusqu'à 10MB
                                                </p>
                                            </label>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-3">
                                                <FileText className="h-8 w-8 text-blue-600" />
                                                <div className="text-left">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {data.file.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(data.file.size)}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('file', null)}
                                                    className="text-gray-400 hover:text-gray-500"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {errors.file && (
                                        <p className="text-sm text-red-600">{errors.file}</p>
                                    )}

                                    {/* Sélection du dossier */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Dossier de destination (optionnel)
                                        </label>
                                        <select
                                            value={data.folder_id}
                                            onChange={(e) => setData('folder_id', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            <option value="">Sans dossier</option>
                                            {folders.map((folder) => (
                                                <option key={folder.id} value={folder.id}>
                                                    {folder.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Barre de progression */}
                                    {progress && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">Upload en cours...</span>
                                                <span className="font-medium text-blue-600">
                                                    {progress.percentage}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                                    style={{ width: `${progress.percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Boutons */}
                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                            disabled={processing}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!data.file || processing}
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Upload...
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-4 w-4 mr-2" />
                                                    Importer
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