'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-black text-white p-1.5 rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-2xl">rocket_launch</span>
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">
                            ICON<span className="font-black">RENTAL</span>
                        </h1>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-sm font-medium text-gray-600 hover:text-black transition-colors" href="/catalog">Flotte</Link>
                        <Link className="text-sm font-medium text-gray-600 hover:text-black transition-colors" href="/transfers">Transferts</Link>
                        <Link className="text-sm font-medium text-gray-600 hover:text-black transition-colors" href="/excursions">Excursions</Link>
                        {user?.is_admin && (
                            <div className="relative group py-2 ml-4">
                                <button className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                                    Administration
                                    <span className="material-symbols-outlined text-[16px] group-hover:rotate-180 transition-transform duration-300">expand_more</span>
                                </button>
                                
                                <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 w-64 z-50">
                                    <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden p-2 gap-1">
                                        <Link className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all flex items-center gap-3" href="/admin">
                                            <div className="size-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                                            </div>
                                            Tableau de Bord
                                        </Link>
                                        <Link className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all flex items-center gap-3" href="/admin/reservations">
                                            <div className="size-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[18px]">list_alt</span>
                                            </div>
                                            Toutes les Réservations
                                        </Link>
                                        <div className="h-[1px] bg-gray-100 my-1 mx-2"></div>
                                        <Link className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all flex items-center gap-3" href="/admin/vehicles">
                                            <div className="size-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[18px]">directions_car</span>
                                            </div>
                                            Gestion de la Flotte
                                        </Link>
                                        <Link className="px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black rounded-xl transition-all flex items-center gap-3" href="/admin/promotions">
                                            <div className="size-8 bg-orange-50 text-orange-600 rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[18px]">sell</span>
                                            </div>
                                            Promotions & Offres
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                        {user && !user.is_admin && user.is_driver && (
                            <div className="flex gap-6">
                                <Link className="text-sm font-medium text-gray-600 hover:text-black transition-colors" href="/chauffeur/missions">
                                    Mes Missions
                                </Link>
                                <Link className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1.5" href="/chauffeur/maintenances">
                                    <span className="material-symbols-outlined text-[16px]">build</span> Mes Maintenances
                                </Link>
                            </div>
                        )}
                        {user && !user.is_admin && !user.is_driver && (
                            <Link className="text-sm font-medium text-gray-600 hover:text-black transition-colors flex items-center gap-1.5" href="/reservations">
                                <span className="material-symbols-outlined text-[18px]">calendar_month</span> Mes Réservations
                            </Link>
                        )}
                    </nav>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/profile" className="flex items-center gap-2 group">
                                    <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 group-hover:border-black transition-all">
                                        <span className="material-symbols-outlined text-sm group-hover:text-black">person</span>
                                    </div>
                                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors">
                                        Bonjour, <span className="text-black font-semibold">{user.name}</span>
                                    </span>
                                </Link>
                                <div className="h-4 w-[1px] bg-gray-200"></div>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-black transition-colors tracking-wide"
                                >
                                    <span className="material-symbols-outlined text-sm">logout</span>
                                    Déconnexion
                                </button>
                            </div>
                        ) : (
                            <>
                                <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white rounded-lg font-medium transition-all text-sm shadow-sm">
                                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                    <span>Réserver</span>
                                </button>
                                <Link href="/login" className="size-9 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center hover:border-black hover:text-black text-gray-500 transition-all">
                                    <span className="material-symbols-outlined text-sm">person</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
