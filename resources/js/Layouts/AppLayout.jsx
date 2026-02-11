import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Toast from '@/Components/Toast';
import { 
    Home, 
    FileText, 
    Users, 
    Star, 
    Trash2, 
    Settings,
    Building,
    Scale,
    BriefcaseBusiness,
    Menu,
    X
} from 'lucide-react';


export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Tableau de bord', href: '/dashboard', icon: Home },
        { name: 'Mes Documents', href: '/my-documents', icon: FileText },
        { name: 'Documents', href: '/documents', icon: FileText },
        { name: 'Partagés avec moi', href: '#', icon: Users },
        { name: 'Favoris', href: '#', icon: Star },
    ];

    const workspaces = [
        { name: 'Comptabilité', href: '#', icon: BriefcaseBusiness },
        { name: 'Juridique', href: '#', icon: Scale },
        { name: 'Ressources Humaines', href: '#', icon: Building },
    ];

    const otherLinks = [
        { name: 'Corbeille', href: '#', icon: Trash2 },
        { name: 'Paramètres', href: '#', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar Desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
                    {/* Logo */}
                    <div className="flex h-16 shrink-0 items-center">
                        <h1 className="text-2xl font-bold text-white">DocFlow</h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            {/* Menu Principal */}
                            <li>
                                <div className="text-xs font-semibold leading-6 text-gray-400 mb-2">
                                    MENU PRINCIPAL
                                </div>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
                                            >
                                                <item.icon className="h-5 w-5 shrink-0" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {/* Espaces de travail */}
                            <li>
                                <div className="text-xs font-semibold leading-6 text-gray-400 mb-2">
                                    ESPACES DE TRAVAIL
                                </div>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {workspaces.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
                                            >
                                                <item.icon className="h-5 w-5 shrink-0" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {/* Autre */}
                            <li>
                                <div className="text-xs font-semibold leading-6 text-gray-400 mb-2">
                                    AUTRE
                                </div>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {otherLinks.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-400 hover:text-white hover:bg-gray-800"
                                            >
                                                <item.icon className="h-5 w-5 shrink-0" />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>

                            {/* Stockage */}
                            <li className="mt-auto">
                                <div className="text-xs font-semibold leading-6 text-gray-400 mb-2">
                                    Stockage
                                </div>
                                <div className="relative">
                                    <div className="overflow-hidden rounded-full bg-gray-700 h-2">
                                        <div className="h-2 rounded-full bg-blue-500" style={{ width: '75%' }} />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        7.5 Go utilisés sur 10 Go
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Zone de contenu */}
            <div className="lg:pl-64">
                {/* Header mobile */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                        <div className="flex flex-1"></div>
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            {/* Profil utilisateur */}
                            <div className="flex items-center gap-x-3">
                                <div className="text-sm leading-6">
                                    <p className="font-semibold text-gray-900">{auth.user.name}</p>
                                    <p className="text-gray-500">{auth.user.role}</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                    {auth.user.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenu principal */}
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
             <Toast />
        </div>
    );
}