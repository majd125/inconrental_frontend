'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
    vehicles: {
        total: number;
        available: number;
        in_maintenance: number;
    };
    users: {
        total: number;
        chauffeurs: number;
    };
    reservations: {
        total: number;
        car_pending: number;
        excursion_pending: number;
        transfer_pending: number;
    };
    financials: {
        total_revenue: number;
        monthly_revenue: number;
        total_expenses: number;
        monthly_expenses: number;
        net_profit: number;
        monthly_net_profit: number;
    };
    documents: {
        total: number;
        urgent: number;
    };
    maintenances: {
        total: number;
        urgent: number;
    };
    recent_activity: Array<{
        type: string;
        id: number;
        user_name: string;
        item_name: string;
        status: string;
        date: string;
        amount: number;
    }>;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_URL}/admin/statistics`, {
                    headers: { 'Authorization': `Bearer ${authService.getToken()}` }
                });

                if (!res.ok) throw new Error('Échec de la récupération des statistiques');
                
                const data = await res.json();
                setStats(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.is_admin) fetchStats();
    }, [user, authLoading, router]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!stats) return null;

    const totalPending = stats.reservations.car_pending + stats.reservations.excursion_pending + stats.reservations.transfer_pending;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                                Vue d'Ensemble <span className="text-black italic font-black">Dashboard</span>
                            </h1>
                        </div>
                        <p className="text-gray-500 text-lg">Bienvenue ! Voici un résumé de l'activité de l'agence.</p>
                    </div>
                </div>

                {/* Financial Overview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Revenue Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <span className="material-symbols-outlined text-8xl">payments</span>
                            </div>
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                            <span className="material-symbols-outlined text-2xl">trending_up</span>
                                        </div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Revenus Totaux</span>
                                    </div>
                                    <h3 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
                                        {Math.round(stats.financials.total_revenue).toLocaleString()} <span className="text-xl">TND</span>
                                    </h3>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-500">Ce mois-ci</span>
                                    <span className="text-lg font-black text-green-600">+{Math.round(stats.financials.monthly_revenue).toLocaleString()} TND</span>
                                </div>
                            </div>
                        </div>

                        {/* Expenses Card */}
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                <span className="material-symbols-outlined text-8xl">receipt_long</span>
                            </div>
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                                            <span className="material-symbols-outlined text-2xl">trending_down</span>
                                        </div>
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Dépenses Totales</span>
                                    </div>
                                    <h3 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">
                                        {Math.round(stats.financials.total_expenses).toLocaleString()} <span className="text-xl">TND</span>
                                    </h3>
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-sm font-bold text-gray-500">Ce mois-ci</span>
                                    <span className="text-lg font-black text-red-600">-{Math.round(stats.financials.monthly_expenses).toLocaleString()} TND</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Net Profit Summary */}
                    <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute -bottom-10 -right-10 opacity-10">
                            <span className="material-symbols-outlined text-[12rem]">account_balance_wallet</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-white/10 rounded-2xl">
                                    <span className="material-symbols-outlined text-2xl">savings</span>
                                </div>
                                <span className="text-xs font-black text-white/50 uppercase tracking-widest">Bénéfice Net</span>
                            </div>
                            <h3 className="text-6xl font-black tracking-tighter mb-2">
                                {Math.round(stats.financials.net_profit).toLocaleString()} <span className="text-2xl opacity-50">TND</span>
                            </h3>
                            <p className="text-white/60 font-medium text-sm">Performance globale de l'agence</p>
                        </div>
                        
                        <div className="mt-12 bg-white/5 border border-white/10 p-5 rounded-2xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-black uppercase text-white/40 tracking-widest">Objectif CA Mensuel (50K TND)</span>
                                <span className="text-sm font-black text-white">
                                    {Math.round((stats.financials.monthly_revenue / 50000) * 100)}%
                                </span>
                            </div>
                            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-3">
                                <div 
                                    className="h-full rounded-full bg-blue-400"
                                    style={{ width: `${Math.min(100, Math.max(0, (stats.financials.monthly_revenue / 50000) * 100))}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-center pt-1 border-t border-white/5">
                                <span className="text-xs font-black uppercase text-white/40 tracking-widest">Bénéfice Net Mensuel</span>
                                <span className={`text-sm font-black ${stats.financials.monthly_net_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {stats.financials.monthly_net_profit >= 0 ? '+' : ''}{Math.round(stats.financials.monthly_net_profit).toLocaleString()} TND
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {/* Vehicles Card */}
                    <Link href="/admin/vehicles" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl">directions_car</span>
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Flotte</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">{stats.vehicles.total}</h3>
                        <p className="text-sm text-gray-500 font-medium">Véhicules au total</p>
                        <div className="mt-4 flex gap-2">
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">{stats.vehicles.available} dispos</span>
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md">{stats.vehicles.in_maintenance} en maint.</span>
                        </div>
                    </Link>

                    {/* Reservations Card */}
                    <Link href="/admin/reservations" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl">calendar_month</span>
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Demandes</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">{stats.reservations.total}</h3>
                        <p className="text-sm text-gray-500 font-medium">Réservations totales</p>
                        <div className="mt-4 flex gap-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${totalPending > 0 ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50'}`}>
                                {totalPending} en attente
                            </span>
                        </div>
                    </Link>

                    {/* Users Card */}
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 transition-all duration-300 group hover:shadow-2xl hover:scale-[1.02]">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl">group</span>
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Comptes</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">{stats.users.total}</h3>
                        <p className="text-sm text-gray-500 font-medium">Utilisateurs inscrits</p>
                        <div className="mt-4 flex gap-2">
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{stats.users.chauffeurs} chauffeurs</span>
                        </div>
                    </div>

                    {/* Maintenances Card */}
                    <Link href="/admin/maintenances-upcoming" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl">build</span>
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Maintenances</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">{stats.maintenances.total}</h3>
                        <p className="text-sm text-gray-500 font-medium">Tâches gérées</p>
                        <div className="mt-4 flex gap-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${stats.maintenances.urgent > 0 ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50'}`}>
                                {stats.maintenances.urgent} urgentes/en cours
                            </span>
                        </div>
                    </Link>

                    {/* Documents Card */}
                    <Link href="/admin/documents-expiry" className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-2xl">description</span>
                            </div>
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Documents</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-1">{stats.documents.total}</h3>
                        <p className="text-sm text-gray-500 font-medium">Documents administratifs</p>
                        <div className="mt-4 flex gap-2">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${stats.documents.urgent > 0 ? 'text-red-600 bg-red-50' : 'text-gray-500 bg-gray-50'}`}>
                                {stats.documents.urgent} expirant bientôt
                            </span>
                        </div>
                    </Link>

                    {/* Pending Action Card */}
                    <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-gray-200 hover:border-black transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-black group-hover:text-white transition-colors">
                                    <span className="material-symbols-outlined text-2xl">notification_important</span>
                                </div>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Alerte</span>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">{totalPending} Urgent(s)</h3>
                            <p className="text-xs text-gray-500">Demandes nécessitant une validation immédiate.</p>
                        </div>
                        <Link href="/admin/reservations" className="mt-4 w-full bg-gray-100 text-black text-center py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                            Gérer les alertes
                        </Link>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-xl shadow-gray-200/40">
                    <div className="px-8 py-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <div className="size-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Flux d'Activité</h2>
                        </div>
                        <Link href="/admin/reservations" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 border-b-2 border-blue-600/20 hover:border-blue-600 transition-all">Voir l'historique complet</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-50 bg-white">
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Nature</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Identité Client</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Désignation</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Horodatage</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Montant</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">État</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recent_activity.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium italic">Aucun flux d'activité récent enregistré.</td>
                                    </tr>
                                ) : (
                                    stats.recent_activity.map((activity, index) => (
                                        <tr key={`${activity.type}-${activity.id}-${index}`} className="hover:bg-gray-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className={`inline-flex items-center justify-center size-10 rounded-xl ${
                                                    activity.type === 'car' ? 'bg-blue-50 text-blue-600' :
                                                    activity.type === 'excursion' ? 'bg-purple-50 text-purple-600' :
                                                    'bg-orange-50 text-orange-600'
                                                }`}>
                                                    <span className="material-symbols-outlined text-xl">
                                                        {activity.type === 'car' ? 'directions_car' : activity.type === 'excursion' ? 'explore' : 'local_taxi'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-bold group-hover:text-black transition-colors">{activity.user_name}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium tracking-wide">Client vérifié</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1 rounded-lg border border-gray-100">{activity.item_name}</span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-black text-gray-400 font-mono tracking-tight">{new Date(activity.date).toLocaleString()}</td>
                                            <td className="px-8 py-6 text-right font-black text-gray-900">{Math.round(activity.amount).toLocaleString()} TND</td>
                                            <td className="px-8 py-6 text-right">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                                    activity.status.includes('attente') ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                                                    activity.status === 'confirme' || activity.status === 'termine' ? 'bg-green-50 text-green-600 border-green-100' : 
                                                    'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                    {activity.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
