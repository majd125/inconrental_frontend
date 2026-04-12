'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 w-full z-50 bg-[#0a192f]/70 backdrop-blur-md border-b border-primary/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="text-primary">
                            <span className="material-symbols-outlined text-4xl">rocket_launch</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tighter text-slate-100">LUXE<span className="text-primary">DRIVE</span></h1>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link className="text-sm font-medium hover:text-primary transition-colors text-white" href="/catalog">Fleet</Link>
                        <Link className="text-sm font-medium hover:text-primary transition-colors text-white" href="/transfers">Transfers</Link>
                        <Link className="text-sm font-medium hover:text-primary transition-colors text-white" href="/excursions">Excursions</Link>
                        {user?.is_admin && (
                            <div className="flex gap-4 border-l border-primary/20 pl-4">
                                <Link className="text-sm font-bold text-primary hover:text-white transition-colors flex items-center gap-1" href="/admin/vehicles">
                                    <span className="material-symbols-outlined text-[16px]">directions_car</span> Manage Fleet
                                </Link>
                                <Link className="text-sm font-bold text-red-400 hover:text-white transition-colors flex items-center gap-1" href="/admin/documents-expiry">
                                    <span className="material-symbols-outlined text-[16px] text-red-500">warning</span> Expiring Docs
                                </Link>
                                <Link className="text-sm font-bold text-orange-400 hover:text-white transition-colors flex items-center gap-1" href="/admin/maintenances-upcoming">
                                    <span className="material-symbols-outlined text-[16px] text-orange-500">build_circle</span> Upcoming Maint
                                </Link>
                                <Link className="text-sm font-bold text-green-400 hover:text-white transition-colors flex items-center gap-1" href="/admin/reservations">
                                    <span className="material-symbols-outlined text-[16px] text-green-500">list_alt</span> Reservations
                                </Link>
                            </div>
                        )}
                        {user && !user.is_admin && (
                            <Link className="text-sm font-medium hover:text-primary transition-colors text-white flex items-center gap-1" href="/reservations">
                                <span className="material-symbols-outlined text-[18px]">calendar_month</span> My Bookings
                            </Link>
                        )}
                    </nav>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-300">Hello, <span className="text-primary font-bold">{user.name}</span></span>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors uppercase tracking-widest"
                                >
                                    <span className="material-symbols-outlined text-sm">logout</span>
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <button className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-bold transition-all transform hover:scale-105">
                                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                                    <span>Book Now</span>
                                </button>
                                <Link href="/login" className="size-10 rounded-full border-2 border-primary/30 overflow-hidden bg-[#0a192f] flex items-center justify-center hover:border-primary transition-all">
                                    <span className="material-symbols-outlined text-slate-300">person</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
