'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/context/NotificationContext';

interface Mission {
    id: number;
    lieu_depart: string;
    lieu_destination: string;
    date_heure_depart: string;
    type_trajet: string;
    nb_adultes: number;
    nb_enfants: number;
    nb_bebes: number;
    montant_total: string;
    statut: string;
    utilisateur: {
        name: string;
        telephone: string;
    };
}

export default function ChauffeurMissions() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { showNotification } = useNotification();
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || !user.is_driver)) {
            router.push('/');
            return;
        }

        const fetchAllMissions = async () => {
            try {
                const response = await fetch(`${API_URL}/chauffeur/missions`, {
                    headers: { 'Authorization': `Bearer ${authService.getToken()}` }
                });

                if (!response.ok) throw new Error('Failed to fetch missions');
                
                const data = await response.json();
                setMissions(data.data || []);
            } catch (err: any) {
                setError(err.message);
                showNotification(err.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        if (user?.is_driver) fetchAllMissions();
    }, [user, authLoading, router, showNotification]);

    const markAsDone = async (id: number) => {
        if (!confirm('Are you sure you have completed this transfer?')) return;
        setActionLoading(true);
        try {
            const response = await fetch(`${API_URL}/transfer-reservations/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({ statut: 'termine' })
            });

            if (!response.ok) throw new Error('Failed to update transfer status');
            
            setMissions(prev => prev.map(m => m.id === id ? { ...m, statut: 'termine' } : m));
            showNotification('Transfer marked as completed!', 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const activeMissions = missions.filter(m => m.statut !== 'termine');
    const historyMissions = missions.filter(m => m.statut === 'termine');
    
    const displayMissions = activeTab === 'active' ? activeMissions : historyMissions;

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2">
                        My <span className="text-black italic">Missions</span>
                    </h1>
                    <p className="text-gray-500 text-lg">Manage your upcoming transfer assignments.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex p-1 bg-gray-50 rounded-2xl border border-gray-200 mb-8 w-fit mx-auto lg:mx-0">
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-gray-600'}`}
                    >
                        Active ({activeMissions.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-black text-white shadow-lg' : 'text-gray-500 hover:text-gray-600'}`}
                    >
                        History ({historyMissions.length})
                    </button>
                </div>

                {displayMissions.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-3xl p-20 text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">
                            {activeTab === 'active' ? 'event_busy' : 'history'}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {activeTab === 'active' ? 'No active missions' : 'No mission history'}
                        </h3>
                        <p className="text-gray-500">
                            {activeTab === 'active' 
                                ? 'When an administrator assigns you a task, it will appear here.'
                                : 'Completed tasks will be stored in this section.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {displayMissions.map((mission) => (
                            <div key={mission.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-200 transition-all group">
                                <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="bg-gray-100 text-black px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-gray-200">
                                                Active Transfer
                                            </span>
                                            <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">ID: #{mission.id}</span>
                                        </div>
                                        
                                        <div className="grid sm:grid-cols-2 gap-8 mb-6">
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-black ring-4 ring-black/20"></div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Pickup Location</p>
                                                        <p className="text-gray-900 font-bold text-lg">{mission.lieu_depart}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-1 w-2 h-2 rounded-full bg-orange-500 ring-4 ring-orange-500/20"></div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Destination</p>
                                                        <p className="text-gray-900 font-bold text-lg">{mission.lieu_destination}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="material-symbols-outlined text-black">schedule</span>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-500 uppercase">Departure Time</p>
                                                        <p className="text-gray-900 font-bold">{new Date(mission.date_heure_depart).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="material-symbols-outlined text-black">person</span>
                                                    <div>
                                                        <p className="text-[10px] font-black text-gray-500 uppercase">Client</p>
                                                        <p className="text-gray-900 font-bold">{mission.utilisateur.name}</p>
                                                        <p className="text-[11px] text-gray-500 font-mono">{mission.utilisateur.telephone}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-200">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase">
                                                <span className="material-symbols-outlined text-[16px]">groups</span>
                                                {mission.nb_adultes} Adults, {mission.nb_enfants} Children, {mission.nb_bebes} Babies
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase">
                                                <span className="material-symbols-outlined text-[16px]">point_of_sale</span>
                                                Quoted: <span className="text-gray-900">${mission.montant_total}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:w-48 flex flex-col gap-2">
                                        <a 
                                            href={`tel:${mission.utilisateur.telephone}`}
                                            className="w-full flex items-center justify-center gap-2 py-4 bg-gray-100 text-black rounded-xl hover:bg-gray-100 transition-all font-bold text-xs border border-gray-200"
                                        >
                                            <span className="material-symbols-outlined text-sm">call</span>
                                            Call Client
                                        </a>
                                        {mission.statut !== 'termine' && (
                                            <button 
                                                onClick={() => markAsDone(mission.id)}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold text-xs shadow-lg shadow-green-500/20"
                                            >
                                                <span className="material-symbols-outlined text-sm">check_circle</span>
                                                Mark as Done
                                            </button>
                                        )}
                                        {mission.statut === 'termine' && (
                                            <div className="w-full py-4 text-center border border-dashed border-green-500/30 rounded-xl">
                                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Completed</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
