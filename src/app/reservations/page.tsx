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

interface ExcursionReservation {
    id: number;
    excursion_id: number;
    date_reservation: string;
    lieu_depart: string;
    nb_adultes: number;
    nb_enfants: number;
    nb_bebes: number;
    montant_total: string;
    statut: 'en_attente' | 'confirme' | 'annule' | 'termine';
    excursion: {
        nom: string;
        image_url: string;
        duree: string;
    };
}

interface TransferReservation {
    id: number;
    utilisateur_id: number;
    lieu_depart: string;
    lieu_destination: string;
    date_heure_depart: string;
    type_trajet: string;
    duree_attente: string | null;
    date_heure_retour: string | null;
    nb_adultes: number;
    nb_enfants: number;
    nb_bebes: number;
    montant_total: string | null;
    statut: 'en_attente_prix' | 'en_attente_confirmation' | 'confirme' | 'annule';
}

export default function MyReservations() {
    const { user, loading: authLoading } = useAuth();
    const { showNotification } = useNotification();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [excursionReservations, setExcursionReservations] = useState<ExcursionReservation[]>([]);
    const [transferReservations, setTransferReservations] = useState<TransferReservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [activeTab, setActiveTab] = useState<'vehicles' | 'excursions' | 'transfers'>('vehicles');

    useEffect(() => {
        if (!authLoading && !user) return;

        const fetchData = async () => {
            try {
                const [vehRes, excRes, transRes] = await Promise.all([
                    fetch(`${API_URL}/reservations`, {
                        headers: { 
                            'Authorization': `Bearer ${authService.getToken()}`,
                            'Accept': 'application/json'
                        }
                    }),
                    fetch(`${API_URL}/excursion-reservations`, {
                        headers: { 
                            'Authorization': `Bearer ${authService.getToken()}`,
                            'Accept': 'application/json'
                        }
                    }),
                    fetch(`${API_URL}/transfer-reservations`, {
                        headers: { 
                            'Authorization': `Bearer ${authService.getToken()}`,
                            'Accept': 'application/json'
                        }
                    })
                ]);

                if (!vehRes.ok || !excRes.ok || !transRes.ok) throw new Error('Failed to fetch data');

                const [vehData, excData, transData] = await Promise.all([
                    vehRes.json(),
                    excRes.json(),
                    transRes.json()
                ]);

                setReservations(vehData.data || []);
                setExcursionReservations(excData.data || []);
                setTransferReservations(transData.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user, authLoading]);

    const confirmTransfer = async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/transfer-reservations/${id}/confirm`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });
            if (!response.ok) throw new Error('Failed to confirm');
            setTransferReservations(prev => prev.map(t => t.id === id ? { ...t, statut: 'confirme' } : t));
            showNotification('Transfer confirmed! Safe travels.', 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        try {
            const response = await fetch(`${API_URL}/reservations/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
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
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                            My <span className="text-primary italic">Bookings</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium">Manage and track your active luxury reservations.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                {/* Tab Switcher */}
                <div className="flex p-1.5 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/5 mb-10 w-fit mx-auto lg:mx-0">
                    <button 
                        onClick={() => setActiveTab('vehicles')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'vehicles' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined text-sm">directions_car</span>
                        Vehicles
                        <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === 'vehicles' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-600'}`}>
                            {reservations.length}
                        </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('excursions')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'excursions' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined text-sm">explore</span>
                        Excursions
                        <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === 'excursions' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-600'}`}>
                            {excursionReservations.length}
                        </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('transfers')}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'transfers' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <span className="material-symbols-outlined text-sm">local_taxi</span>
                        Transfers
                        <span className={`ml-2 px-1.5 py-0.5 rounded-md text-[9px] ${activeTab === 'transfers' ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-600'}`}>
                            {transferReservations.length}
                        </span>
                    </button>
                </div>

                <div className="min-h-[400px]">
                    {activeTab === 'vehicles' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {reservations.length === 0 ? (
                                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-white/10">
                                    <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">calendar_today</span>
                                    <p className="text-slate-400 text-xl font-medium mb-6">No vehicle reservations yet.</p>
                                    <Link href="/catalog" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-all">
                                        Browse Fleet <span className="material-symbols-outlined">arrow_forward</span>
                                    </Link>
                                </div>
                            ) : (
                                reservations.map((res) => (
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
                                                        res.cancelled_by_id === res.utilisateur_id ? 'Annulée' : 'Refusée'
                                                    ) : res.statut.replace('_', ' ')}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Rental Period</p>
                                                <p className="text-sm font-semibold text-white">
                                                    {new Date(res.date_debut).toLocaleDateString()} → {new Date(res.date_fin).toLocaleDateString()}
                                                </p>
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <p className="text-xs text-slate-400">Location: {res.lieu_depart}</p>
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
                                                        <span className="material-symbols-outlined text-sm">cancel</span> Cancel
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : activeTab === 'excursions' ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {excursionReservations.length === 0 ? (
                                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-white/10">
                                    <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">explore</span>
                                    <p className="text-slate-400 text-xl font-medium mb-6">No excursion reservations yet.</p>
                                    <Link href="/excursions" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-all">
                                        Explore Excursions <span className="material-symbols-outlined">arrow_forward</span>
                                    </Link>
                                </div>
                            ) : (
                                excursionReservations.map((res) => (
                                    <div key={res.id} className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group p-6 flex flex-col md:flex-row gap-8 items-center">
                                        <div className="w-full md:w-64 h-40 rounded-xl overflow-hidden flex-shrink-0">
                                            <div className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${res.excursion.image_url || 'https://via.placeholder.com/800x450'})` }}></div>
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Excursion</p>
                                                <h3 className="text-xl font-bold text-white">{res.excursion.nom}</h3>
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2
                                                    ${res.statut === 'en_attente' ? 'bg-yellow-500/20 text-yellow-500' : 
                                                      res.statut === 'confirme' ? 'bg-green-500/20 text-green-500' : 
                                                      'bg-red-500/20 text-red-500'}`}
                                                >
                                                    <span className="relative flex h-2 w-2">
                                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${res.statut === 'en_attente' ? 'bg-yellow-500' : res.statut === 'confirme' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${res.statut === 'en_attente' ? 'bg-yellow-500' : res.statut === 'confirme' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                    </span>
                                                    {res.statut.replace('_', ' ')}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Reservation Date</p>
                                                <p className="text-sm font-semibold text-white">
                                                    {new Date(res.date_reservation).toLocaleDateString()}
                                                </p>
                                                <div className="flex flex-col gap-1 mt-2">
                                                    <p className="text-xs text-slate-400">Departure: {res.lieu_depart}</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold mt-1">
                                                        <span className="material-symbols-outlined text-[14px]">group</span>
                                                        {res.nb_adultes}A, {res.nb_enfants}E, {res.nb_bebes}B
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1 sm:text-right">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Price</p>
                                                <p className="text-2xl font-black text-primary">${res.montant_total}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{res.excursion.duree}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {transferReservations.length === 0 ? (
                                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-white/10">
                                    <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">local_taxi</span>
                                    <p className="text-slate-400 text-xl font-medium mb-6">No transfer reservations yet.</p>
                                    <Link href="/transfers" className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-all">
                                        Book a Transfer <span className="material-symbols-outlined">arrow_forward</span>
                                    </Link>
                                </div>
                            ) : (
                                transferReservations.map((res) => (
                                    <div key={res.id} className="bg-slate-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-all group p-6 flex flex-col md:flex-row gap-8 items-center">
                                        <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                            <span className="material-symbols-outlined text-4xl">local_taxi</span>
                                        </div>
                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">Transfer Journey</p>
                                                <h3 className="text-lg font-bold text-white mb-2">{res.lieu_depart} → {res.lieu_destination}</h3>
                                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest
                                                    ${res.statut === 'en_attente_prix' ? 'bg-orange-500/20 text-orange-500' : 
                                                      res.statut === 'en_attente_confirmation' ? 'bg-yellow-500/20 text-yellow-500' :
                                                      res.statut === 'confirme' ? 'bg-green-500/20 text-green-500' : 
                                                      'bg-red-500/20 text-red-500'}`}
                                                >
                                                    {res.statut === 'en_attente_prix' ? 'Reviewing' : res.statut.replace('_', ' ')}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Schedule & Passengers</p>
                                                <p className="text-sm font-semibold text-white">
                                                    {new Date(res.date_heure_depart).toLocaleString()}
                                                </p>
                                                <p className="text-xs text-slate-400">{res.type_trajet.replace('_', ' ')} • {res.nb_adultes}A, {res.nb_enfants}C, {res.nb_bebes}B</p>
                                            </div>
                                            <div className="space-y-1 sm:text-right">
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Price Quote</p>
                                                {res.montant_total ? (
                                                    <>
                                                        <p className="text-2xl font-black text-primary">${res.montant_total}</p>
                                                        {res.statut === 'en_attente_confirmation' && (
                                                            <button 
                                                                onClick={() => confirmTransfer(res.id)}
                                                                className="mt-3 px-6 py-2 bg-green-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-green-500/20"
                                                            >
                                                                Confirm
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p className="text-sm italic text-slate-500">Waiting for admin quote</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
