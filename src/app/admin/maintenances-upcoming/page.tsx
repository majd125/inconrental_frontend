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

interface User {
    id: number;
    name: string;
    is_driver: boolean;
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
    assigned_driver_id: number | null;
    driver?: User;
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
    const [drivers, setDrivers] = useState<User[]>([]);

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
                    },
                    credentials: 'include'
                });
                
                if (response.status === 401 || response.status === 403) {
                    authService.logout();
                    window.location.href = '/login';
                    return;
                }
                
                if (!response.ok) throw new Error('Failed to fetch maintenances');
                
                const result = await response.json();
                setMaintenances(result.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchDrivers = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/chauffeurs`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authService.getToken()}`
                    },
                    credentials: 'include'
                });
                if (response.ok) {
                    const result = await response.json();
                    setDrivers(result.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch drivers", err);
            }
        };

        if (user?.is_admin) {
            fetchAllMaintenances();
            fetchDrivers();
        }
    }, [user, authLoading, router]);

    const fetchAllMaintenances = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/maintenances/all`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                credentials: 'include'
            });
            
            if (response.status === 401 || response.status === 403) {
                authService.logout();
                window.location.href = '/login';
                return;
            }
            
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
        }
    };

    const handleAssignDriver = async (mainId: number, driverId: number | null) => {
        setActionLoading(true);
        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const response = await fetch(`${API_URL}/maintenances/${mainId}/assign-driver`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({ assigned_driver_id: driverId }),
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Assignment failed');

            setSuccess('Driver assigned successfully');
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></span>
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                            Maintenances <span className="text-black">à Venir</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-lg">Calendrier d'entretien de la flotte et interventions de garage en cours.</p>
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
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 text-black flex items-center justify-center">
                                <span className="material-symbols-outlined">build</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total des Tâches</p>
                                <p className="text-3xl font-black text-gray-900">{allList.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white border border-red-500/20 rounded-2xl p-6 shadow-lg shadow-red-500/5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-500 flex items-center justify-center">
                                <span className="material-symbols-outlined animate-pulse">warning</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Urgent / En Cours</p>
                                <p className="text-3xl font-black text-red-500">{urgentList.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
                 <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
                    <button 
                        onClick={() => setActiveTab('urgent')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all flex items-center gap-2 ${activeTab === 'urgent' ? 'bg-red-500/20 text-red-400 shadow-lg border border-red-500/50' : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">warning</span>
                        Actions Urgentes ({urgentList.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all flex items-center gap-2 ${activeTab === 'all' ? 'bg-black text-white shadow-lg shadow-md' : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">list</span>
                        Tous les Dossiers ({allList.length})
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Véhicule</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Infos Tâche</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Échéance (Cible)</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Responsable</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {displayList.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">check_circle</span>
                                        <p className="text-gray-500 italic">Aucun dossier de maintenance {activeTab === 'urgent' ? 'urgent' : ''} trouvé.</p>
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
                                            daysLeftStr = `${Math.abs(diff)} jours de RETARD`;
                                            isExpiredDue = true;
                                        } else {
                                            daysLeftStr = `Échéance dans ${diff} jours`;
                                        }
                                    }

                                    return (
                                        <tr key={main.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-900 font-bold tracking-wide">
                                                        {main.vehicule?.marque} {main.vehicule?.modele}
                                                    </span>
                                                    <span className="text-gray-500 font-mono text-xs mt-1 bg-gray-50 rounded-full px-2 py-0.5 w-max">
                                                        {main.vehicule?.immatriculation}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-gray-800 font-bold">{main.nom_maintenance}</p>
                                                <p className="text-gray-500 text-[10px] uppercase font-bold mt-1 tracking-wider">
                                                    Origine : {main.date ? new Date(main.date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    {(main.prochaine_echeance_km || main.prochaine_echeance_date) ? (
                                                        <>
                                                            <span className="text-gray-900 font-bold font-mono text-sm">
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
                                                        <span className="text-gray-400 font-mono text-sm">Aucune Échéance Récurrente</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black/50 transition-all outline-none"
                                                        value={main.assigned_driver_id || ''}
                                                        onChange={(e) => handleAssignDriver(main.id, e.target.value ? parseInt(e.target.value) : null)}
                                                        disabled={actionLoading}
                                                    >
                                                        <option value="">Aucun chauffeur</option>
                                                        {drivers.map(driver => (
                                                            <option key={driver.id} value={driver.id}>{driver.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {main.statut === 'en_cours' ? (
                                                    <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 flex items-center gap-1 w-max">
                                                        <span className="material-symbols-outlined text-[12px]">build_circle</span>
                                                        Au Garage
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-white text-gray-500 border border-gray-200 w-max">
                                                        Fermé
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {main.statut === 'en_cours' && (
                                                        <button 
                                                            onClick={() => handleReceived(main.id)}
                                                            disabled={actionLoading}
                                                            className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-gray-900 px-4 py-2 rounded-lg font-bold text-xs transition-all tracking-wide whitespace-nowrap disabled:opacity-50"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                                                            Voiture Reçue
                                                        </button>
                                                    )}
                                                    {!main.is_archived && activeTab === 'urgent' && (main.prochaine_echeance_date || main.prochaine_echeance_km) && (
                                                        <Link 
                                                            href={`/admin/vehicles/${main.vehicule_id}/maintenance?renew=${main.id}`}
                                                            className="inline-flex items-center gap-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-gray-900 px-4 py-2 rounded-lg font-bold text-xs transition-all tracking-wide whitespace-nowrap"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                            Marquer Terminé
                                                        </Link>
                                                    )}
                                                    <Link 
                                                        href={`/admin/vehicles/${main.vehicule_id}/maintenance`}
                                                        className="inline-flex items-center gap-2 bg-gray-100 hover:bg-black text-black hover:text-gray-900 px-4 py-2 rounded-lg font-bold text-xs transition-all tracking-wide whitespace-nowrap"
                                                    >
                                                        Détails
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
