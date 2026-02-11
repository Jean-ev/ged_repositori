import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { MoreVertical, Download, Trash2, Star, Eye, Edit } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function DocumentMenu({ document }) {
    const handleDownload = () => {
        window.location.href = route('documents.download', document.id);
    };

    const handleDelete = () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
            router.delete(route('documents.destroy', document.id), {
                preserveScroll: true,
            });
        }
    };

    const handleToggleFavorite = () => {
        router.post(route('documents.favorite', document.id), {}, {
            preserveScroll: true,
        });
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-5 w-5" />
            </Menu.Button>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleDownload}
                                    className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    <Download className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                    Télécharger
                                </button>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleToggleFavorite}
                                    className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    <Star 
                                        className={`mr-3 h-5 w-5 ${
                                            document.is_favorite 
                                                ? 'text-yellow-400 fill-yellow-400' 
                                                : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                    />
                                    {document.is_favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                </button>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            {({ active }) => (
                                
                                <a    href={document.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${
                                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                                    } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    <Eye className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                    Prévisualiser
                                </a>
                            )}
                        </Menu.Item>

                        <div className="border-t border-gray-100"></div>

                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={handleDelete}
                                    className={`${
                                        active ? 'bg-red-50 text-red-900' : 'text-red-700'
                                    } group flex w-full items-center px-4 py-2 text-sm`}
                                >
                                    <Trash2 className="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500" />
                                    Supprimer
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}