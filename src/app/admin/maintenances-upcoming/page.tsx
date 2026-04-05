'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';

interface Vehicle {
    id: number;
    marque: string;
    modele: string;
    immatriculation: string;
}

interface Maintenance {
    id: number;
    vehicule_id: number;
    nom_maintenance: string;
    date: string;
    kilometrage: number;
    description: string | null;
    pieces_changees: string | null;
    cout_piece: string | null;
    cout_main_oeuvre: string | null;
    cout_total: string | null;
    garage: string | null;
    prochaine_echeance_km: number | null;
    prochaine_echeance_date: string | null;
    statut: 'en_cours' | 'terminé';
    remarques: string | null;
    is_archived?: boolean;
    vehicule?: Vehicle;
}

export default function MaintenancesUpcoming() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'urgent' | 'all'>('urgent');

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/catalog');
            return;
        }

        const fetchAllMaintenances = async () => {
            try {
                const response = await fetch(`${API_URL}/maintenances/all`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authService.getToken()}`
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch maintenances');
                
                const result = await response.json();
                setMaintenances(result.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.is_admin) {
            fetchAllMaintenances();
        }
    }, [user, authLoading, router]);

    const fetchAllMaintenances = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/maintenances/all`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch maintenances');
            
            const result = await response.json();
            setMaintenances(result.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleReceived = async (mainId: number) => {
        setActionLoading(true);
        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const response = await fetch(`${API_URL}/maintenances/${mainId}/receive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Update failed');

            setSuccess('Car marked as received successfully');
            fetchAllMaintenances();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const isUrgent = (main: Maintenance) => {
        if (main.is_archived) return false;

        // En Cours (at garage right now)
        if (main.statut === 'en_cours') return true;

        // Date approaches within 30 days or is passed
        if (main.prochaine_echeance_date) {
            const expDate = new Date(main.prochaine_echeance_date);
            const today = new Date();
            const diffTime = expDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays <= 30) return true;
        }
        
        return false;
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
            </div>
        );
    }

    const urgentList = maintenances.filter(isUrgent).sort((a, b) => {
        if (a.statut === 'en_cours' && b.statut !== 'en_cours') return -1;
        if (a.statut !== 'en_cours' && b.statut === 'en_cours') return 1;
        if (a.prochaine_echeance_date && b.prochaine_echeance_date) {
             return new Date(a.prochaine_echeance_date).getTime() - new Date(b.prochaine_echeance_date).getTime();
        }
        return 0;
    });
    
    // Sort all by most recent
    const allList = [...maintenances].filter(m => !m.is_archived).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const displayList = activeTab === 'urgent' ? urgentList : allList;

    return (
        <div className="min-h-screen bg-[#0a192f] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            Upcoming <span className="text-primary">Maintenance</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">Global fleet service schedule and ongoing garage interventions.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl flex items-center gap-3 animate-in fade-in duration-500">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p>{success}</p>
                    </div>
                )}

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-900/50 border border-primary/20 rounded-2xl p-6 shadow-lg shadow-primary/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
                                <span className="material-symbols-outlined">build</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total Tasks</p>
                                <p className="text-3xl font-black text-white">{allList.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900/50 border border-red-500/20 rounded-2xl p-6 shadow-lg shadow-red-500/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center">
                                <span className="material-symbols-outlined animate-pulse">warning</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Urgent / Current</p>
                                <p className="text-3xl font-black text-red-500">{urgentList.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                    <button 
                        onClick={() => setActiveTab('urgent')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all flex items-center gap-2 ${activeTab === 'urgent' ? 'bg-red-500/20 text-red-400 shadow-lg border border-red-500/50' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">warning</span>
                        Urgent Actions ({urgentList.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all flex items-center gap-2 ${activeTab === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">list</span>
                        All Records ({allList.length})
                    </button>
                </div>

                <div className="bg-slate-900/30 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Task Info</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Next Due (Target)</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {displayList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">check_circle</span>
                                        <p className="text-slate-500 italic">No {activeTab} maintenance records found.</p>
                                    </td>
                                </tr>
                            ) : (
                                displayList.map((main) => {
                                    // Calculate Days Left
                                    let daysLeftStr = '';
                                    let isExpiredDue = false;

                                    if (main.prochaine_echeance_date && main.statut === 'terminé') {
                                        const end = new Date(main.prochaine_echeance_date);
                                        const now = new Date();
                                        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                        
                                        if (diff < 0) {
                                            daysLeftStr = `${Math.abs(diff)} days OVERDUE`;
                                            isExpiredDue = true;
                                        } else {
                                            daysLeftStr = `Due in ${diff} days`;
                                        }
                                    }

                                    return (
                                        <tr key={main.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold tracking-wide">
                                                        {main.vehicule?.marque} {main.vehicule?.modele}
                                                    </span>
                                                    <span className="text-slate-400 font-mono text-xs mt-1 bg-white/5 rounded-full px-2 py-0.5 w-max">
                                                        {main.vehicule?.immatriculation}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-slate-200 font-bold">{main.nom_maintenance}</p>
                                                <p className="text-slate-500 text-[10px] uppercase font-bold mt-1 tracking-wider">
                                                    Originated: {main.date ? new Date(main.date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    {(main.prochaine_echeance_km || main.prochaine_echeance_date) ? (
                                                        <>
                                                            <span className="text-white font-bold font-mono text-sm">
                                                                {main.prochaine_echeance_km ? `${main.prochaine_echeance_km.toLocaleString()} KM` : ''} 
                                                                {(main.prochaine_echeance_km && main.prochaine_echeance_date) ? ' | ' : ''} 
                                                                {main.prochaine_echeance_date ? new Date(main.prochaine_echeance_date).toLocaleDateString() : ''}
                                                            </span>
                                                            {daysLeftStr && (
                                                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-max ${isExpiredDue ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-400'}`}>
                                                                    {daysLeftStr}
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-600 font-mono text-sm">No Recurring Due</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {main.statut === 'en_cours' ? (
                                                    <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 flex items-center gap-1 w-max">
                                                        <span className="material-symbols-outlined text-[12px]">build_circle</span>
                                                        In Garage
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-slate-800 text-slate-400 border border-slate-700 w-max">
                                                        Closed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {main.statut === 'en_cours' && (
                                                        <button 
                                                            onClick={() => handleReceived(main.id)}
                                                            disabled={actionLoading}
                                                            className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition-all tracking-wide whitespace-nowrap disabled:opacity-50"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                                                            Car Received
                                                        </button>
                                                    )}
                                                    {!main.is_archived && activeTab === 'urgent' && (main.prochaine_echeance_date || main.prochaine_echeance_km) && (
                                                        <Link 
                                                            href={`/admin/vehicles/${main.vehicule_id}/maintenance?renew=${main.id}`}
                                                            className="inline-flex items-center gap-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition-all tracking-wide whitespace-nowrap"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                            Mark Completed
                                                        </Link>
                                                    )}
                                                    <Link 
                                                        href={`/admin/vehicles/${main.vehicule_id}/maintenance`}
                                                        className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition-all tracking-wide whitespace-nowrap"
                                                    >
                                                        Details
                                                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
