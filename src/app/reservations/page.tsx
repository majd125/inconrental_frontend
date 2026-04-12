'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';
import Link from 'next/link';

import { useNotification } from '@/context/NotificationContext';

interface Reservation {
    id: number;
    utilisateur_id: number;
    date_debut: string;
    date_fin: string;
    lieu_depart: string;
    lieu_arrivee: string;
    montant_total: string;
    statut: 'en_attente' | 'confirme' | 'annule' | 'termine';
    nb_sieges_bebe: number;
    cancelled_by_id?: number | null;
    vehicule: {
        marque: string;
        modele: string;
        image_url: string;
    };
}

export default function MyReservations() {
    const { user, loading: authLoading } = useAuth();
    const { showNotification } = useNotification();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) return;

        const fetchReservations = async () => {
            try {
                const response = await fetch(`${API_URL}/reservations`, {
                    headers: {
                        'Authorization': `Bearer ${authService.getToken()}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch reservations');
                const result = await response.json();
                setReservations(result.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchReservations();
    }, [user, authLoading]);

    const handleCancel = async (id: number) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        try {
            const response = await fetch(`${API_URL}/reservations/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({ statut: 'annule' })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to cancel reservation');
            }

            setReservations(prev => prev.map(res => 
                res.id === id ? { ...res, statut: 'annule', cancelled_by_id: res.utilisateur_id } : res
            ));
            showNotification('Reservation cancelled successfully.', 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-white mb-4">Please log in to see your bookings</h2>
                <Link href="/login" className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-all">Login</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a192f] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                            My <span className="text-primary italic">Bookings</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium">Manage and track your luxury fleet reservations.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                {reservations.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-primary/10">
                        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">calendar_today</span>
                        <p className="text-slate-400 text-xl font-medium mb-6">You haven't made any reservations yet.</p>
                        <Link href="/catalog" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-all">
                            Browse Collection <span className="material-symbols-outlined">arrow_forward</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reservations.map((res) => (
                            <div key={res.id} className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group p-6 flex flex-col md:flex-row gap-8 items-center">
                                <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden flex-shrink-0">
                                    <div className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${res.vehicule.image_url || 'https://via.placeholder.com/800x450'})` }}></div>
                                </div>
                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Vehicle</p>
                                        <h3 className="text-xl font-bold text-white">{res.vehicule.marque} {res.vehicule.modele}</h3>
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2
                                            ${res.statut === 'en_attente' ? 'bg-yellow-500/20 text-yellow-500' : 
                                              res.statut === 'confirme' ? 'bg-green-500/20 text-green-500' : 
                                              'bg-red-500/20 text-red-500'}`}
                                        >
                                            <span className="relative flex h-2 w-2">
                                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${res.statut === 'en_attente' ? 'bg-yellow-500' : res.statut === 'confirme' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                <span className={`relative inline-flex rounded-full h-2 w-2 ${res.statut === 'en_attente' ? 'bg-yellow-500' : res.statut === 'confirme' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            </span>
                                            {res.statut === 'annule' ? (
                                                res.cancelled_by_id === res.utilisateur_id ? 'Annulée par vous' : 'Annulée par admin'
                                            ) : res.statut.replace('_', ' ')}
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Travel Dates</p>
                                        <p className="text-sm font-semibold text-white">
                                            {new Date(res.date_debut).toLocaleDateString()} → {new Date(res.date_fin).toLocaleDateString()}
                                        </p>
                                        <div className="flex flex-col gap-1 mt-2">
                                            <p className="text-xs text-slate-400">Location: {res.lieu_depart}</p>
                                            {res.nb_sieges_bebe > 0 && (
                                                <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                                                    <span className="material-symbols-outlined text-sm">child_care</span>
                                                    {res.nb_sieges_bebe} Siège(s) Bébé
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1 sm:text-right">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Price</p>
                                        <p className="text-2xl font-black text-primary">${res.montant_total}</p>
                                        {(res.statut === 'en_attente' || (res.statut === 'confirme' && new Date(res.date_debut) > new Date())) && (
                                            <button 
                                                onClick={() => handleCancel(res.id)}
                                                className="mt-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-white transition-colors flex items-center gap-1 sm:justify-end"
                                            >
                                                <span className="material-symbols-outlined text-sm">cancel</span> Annuler
                                            </button>
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
