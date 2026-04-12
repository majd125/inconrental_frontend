'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface Reservation {
    id: number;
    utilisateur_id: number;
    vehicule_id: number;
    date_debut: string;
    date_fin: string;
    lieu_depart: string;
    nb_participants: number;
    nb_sieges_bebe: number;
    montant_total: string;
    statut: 'en_attente' | 'confirme' | 'annule' | 'termine';
    cancelled_by_id?: number | null;
    user: {
        name: string;
        email: string;
        telephone: string;
    };
    vehicule: {
        marque: string;
        modele: string;
        immatriculation: string;
    };
}

import { useNotification } from '@/context/NotificationContext';

export default function AdminReservations() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { showNotification } = useNotification();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'en_attente' | 'confirme' | 'annule'>('all');

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/');
            return;
        }

        const fetchAllReservations = async () => {
            try {
                const response = await fetch(`${API_URL}/admin/reservations`, {
                    headers: {
                        'Authorization': `Bearer ${authService.getToken()}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch all reservations');
                const result = await response.json();
                setReservations(result.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.is_admin) fetchAllReservations();
    }, [user, authLoading, router]);

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const response = await fetch(`${API_URL}/reservations/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({ statut: newStatus })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update reservation status');
            }

            setReservations(prev => prev.map(res => 
                res.id === id ? { 
                    ...res, 
                    statut: newStatus as any,
                    cancelled_by_id: newStatus === 'annule' ? user?.id : res.cancelled_by_id
                } : res
            ));
            showNotification(`Reservation status updated to ${newStatus}.`, 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        }
    };

    const filteredReservations = reservations.filter(res => 
        filter === 'all' ? true : res.statut === filter
    );

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a192f] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-black text-white tracking-tighter">
                                Reservation <span className="text-primary italic font-black">Control</span>
                            </h1>
                            <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-sm font-bold border border-primary/30 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">list_alt</span>
                                {reservations.length} TOTAL REQUESTS
                            </div>
                        </div>
                        <p className="text-slate-400 text-lg">Approve or manage client rental requests.</p>
                    </div>

                    <div className="flex gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/5">
                        {(['all', 'en_attente', 'confirme', 'annule'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
                                    ${filter === f ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-white'}`}
                            >
                                {f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-slate-900/30 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vehicle</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredReservations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-slate-500 font-medium italic">
                                            No reservations found matching the filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReservations.map((res) => (
                                        <tr key={res.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-white font-bold">{res.user.name}</span>
                                                    <span className="text-[11px] text-slate-500">{res.user.email}</span>
                                                    <span className="text-[11px] text-primary/70 font-mono mt-0.5">{res.user.telephone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 font-medium">
                                                <div className="flex flex-col">
                                                    <span className="text-white">{res.vehicule.marque} {res.vehicule.modele}</span>
                                                    <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-0.5 rounded-md mt-1 border border-white/5 w-fit">{res.vehicule.immatriculation}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-xs text-white">
                                                        <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
                                                        {new Date(res.date_debut).toLocaleDateString()}
                                                        <span className="text-slate-600">→</span>
                                                        {new Date(res.date_fin).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                                                        <span className="material-symbols-outlined text-slate-600 text-[14px]">location_on</span>
                                                        {res.lieu_depart}
                                                    </div>
                                                    {res.nb_sieges_bebe > 0 && (
                                                        <div className="flex items-center gap-2 text-[10px] text-primary font-black uppercase">
                                                            <span className="material-symbols-outlined text-[14px]">child_care</span>
                                                            {res.nb_sieges_bebe} Baby Seats
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
                                                    ${res.statut === 'en_attente' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : 
                                                      res.statut === 'confirme' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                                                      'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                                                >
                                                    {res.statut === 'annule' ? (
                                                        res.cancelled_by_id === res.utilisateur_id ? 'Annulé par client' : 'Annulé par admin'
                                                    ) : res.statut.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-6">
                                                <span className="text-lg font-black text-primary">${res.montant_total}</span>
                                            </td>
                                            <td className="px-6 py-6 text-right">
                                                {res.statut === 'en_attente' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => updateStatus(res.id, 'confirme')}
                                                            className="flex items-center justify-center p-2 bg-green-500/10 hover:bg-green-500 text-green-500 hover:text-white rounded-lg transition-all border border-green-500/20 group/btn"
                                                            title="Approve"
                                                        >
                                                            <span className="material-symbols-outlined text-lg group-hover/btn:scale-110">check</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => updateStatus(res.id, 'annule')}
                                                            className="flex items-center justify-center p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all border border-red-500/20 group/btn"
                                                            title="Decline"
                                                        >
                                                            <span className="material-symbols-outlined text-lg group-hover/btn:scale-110">close</span>
                                                        </button>
                                                    </div>
                                                ) : res.statut === 'confirme' && new Date(res.date_debut) > new Date() ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => updateStatus(res.id, 'annule')}
                                                            className="flex items-center justify-center p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all border border-red-500/20 group/btn"
                                                            title="Cancel Reservation"
                                                        >
                                                            <span className="material-symbols-outlined text-lg group-hover/btn:scale-110">cancel</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-slate-600 font-bold uppercase">No Actions</span>
                                                )}
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
