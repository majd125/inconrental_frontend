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

interface ExcursionReservation {
    id: number;
    utilisateur_id: number;
    excursion_id: number;
    date_reservation: string;
    lieu_depart: string;
    nb_adultes: number;
    nb_enfants: number;
    nb_bebes: number;
    montant_total: string;
    statut: 'en_attente' | 'confirme' | 'annule' | 'termine';
    utilisateur: {
        name: string;
        email: string;
        telephone: string;
    };
    excursion: {
        nom: string;
    };
}

interface TransferReservation {
    id: number;
    utilisateur_id: number;
    chauffeur_id?: number | null;
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
    statut: 'en_attente_prix' | 'en_attente_confirmation' | 'confirme' | 'annule' | 'termine';
    utilisateur: {
        name: string;
        email: string;
        telephone: string;
    };
    chauffeur?: {
        id: number;
        name: string;
    } | null;
}

interface Chauffeur {
    id: number;
    name: string;
}

import { useNotification } from '@/context/NotificationContext';

export default function AdminReservations() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { showNotification } = useNotification();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [excursionReservations, setExcursionReservations] = useState<ExcursionReservation[]>([]);
    const [transferReservations, setTransferReservations] = useState<TransferReservation[]>([]);
    const [chauffeurs, setChauffeurs] = useState<Chauffeur[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'en_attente' | 'en_attente_prix' | 'confirme' | 'annule' | 'termine'>('all');
    const [activeTab, setActiveTab] = useState<'vehicles' | 'excursions' | 'transfers'>('vehicles');

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/');
            return;
        }

        const fetchData = async () => {
            try {
                const [vehRes, excRes, transRes, chauffeurRes] = await Promise.all([
                    fetch(`${API_URL}/admin/reservations`, {
                        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
                    }),
                    fetch(`${API_URL}/admin/excursion-reservations`, {
                        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
                    }),
                    fetch(`${API_URL}/admin/transfer-reservations`, {
                        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
                    }),
                    fetch(`${API_URL}/admin/chauffeurs`, {
                        headers: { 'Authorization': `Bearer ${authService.getToken()}` }
                    })
                ]);

                if (!vehRes.ok || !excRes.ok || !transRes.ok || !chauffeurRes.ok) throw new Error('Failed to fetch reservations');
                
                const [vehData, excData, transData, chauffeurData] = await Promise.all([
                    vehRes.json(),
                    excRes.json(),
                    transRes.json(),
                    chauffeurRes.json()
                ]);

                setReservations(vehData.data || []);
                setExcursionReservations(excData.data || []);
                setTransferReservations(transData.data || []);
                setChauffeurs(chauffeurData.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.is_admin) fetchData();
    }, [user, authLoading, router]);

    const setTransferPrice = async (id: number, price: string) => {
        try {
            const response = await fetch(`${API_URL}/admin/transfer-reservations/${id}/price`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({ quoted_price: price })
            });

            if (!response.ok) throw new Error('Failed to set price');

            setTransferReservations(prev => prev.map(res => 
                res.id === id ? { ...res, quoted_price: price, status: 'en_attente_confirmation' } : res
            ));
            showNotification('Price quote sent to client.', 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        }
    };

    const assignChauffeur = async (reservationId: number, chauffeurId: number | null) => {
        try {
            const response = await fetch(`${API_URL}/admin/transfer-reservations/${reservationId}/assign-chauffeur`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({ chauffeur_id: chauffeurId })
            });

            if (!response.ok) throw new Error('Failed to assign chauffeur');

            const data = await response.json();
            setTransferReservations(prev => prev.map(res => 
                res.id === reservationId ? { ...res, chauffeur_id: chauffeurId, chauffeur: data.data.chauffeur } : res
            ));
            showNotification(chauffeurId ? 'Chauffeur assigned successfully.' : 'Chauffeur unassigned.', 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        }
    };

    const updateStatus = async (id: number, newStatus: string, type: 'vehicle' | 'excursion' | 'transfer' = 'vehicle') => {
        try {
            const endpoint = type === 'vehicle' 
                ? `${API_URL}/reservations/${id}/status`
                : type === 'excursion'
                ? `${API_URL}/excursion-reservations/${id}/status`
                : `${API_URL}/transfer-reservations/${id}/status`;

            const response = await fetch(endpoint, {
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

            if (type === 'vehicle') {
                setReservations(prev => prev.map(res => 
                    res.id === id ? { 
                        ...res, 
                        statut: newStatus as any,
                        cancelled_by_id: newStatus === 'annule' ? user?.id : res.cancelled_by_id
                    } : res
                ));
            } else if (type === 'excursion') {
                setExcursionReservations(prev => prev.map(res => 
                    res.id === id ? { ...res, statut: newStatus as any } : res
                ));
            } else if (type === 'transfer') {
                setTransferReservations(prev => prev.map(res => 
                    res.id === id ? { ...res, status: newStatus as any } : res
                ));
            }

            showNotification(`Reservation status updated to ${newStatus}.`, 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        }
    };

    const filteredVehicles = reservations.filter(res => 
        filter === 'all' ? true : res.statut === filter
    );

    const filteredExcursions = excursionReservations.filter(res => 
        filter === 'all' ? true : res.statut === filter
    );

    const filteredTransfers = transferReservations.filter(res => {
        if (filter === 'all') return true;
        if (filter === 'en_attente') return res.statut === 'en_attente_prix' || res.statut === 'en_attente_confirmation';
        return res.statut === filter;
    });

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
                <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <div>
                        <div className="flex flex-wrap items-center gap-4 mb-3">
                            <h1 className="text-4xl font-black text-white tracking-tighter">
                                Agency <span className="text-primary italic font-black">Dashboard</span>
                            </h1>
                            <div className="flex gap-2">
                                <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border border-primary/30 uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px]">directions_car</span>
                                    {reservations.length} Vehicles
                                </div>
                                <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border border-primary/30 uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px]">explore</span>
                                    {excursionReservations.length} Excursions
                                </div>
                                <div className="bg-primary/20 text-primary px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border border-primary/30 uppercase flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[14px]">local_taxi</span>
                                    {transferReservations.length} Transfers
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-lg">Manage all client requests and reservation statuses.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Tab Switcher */}
                        <div className="flex p-1 bg-slate-900/80 rounded-xl border border-white/5">
                            <button 
                                onClick={() => setActiveTab('vehicles')}
                                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'vehicles' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                Vehicles
                            </button>
                            <button 
                                onClick={() => setActiveTab('excursions')}
                                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'excursions' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                Excursions
                            </button>
                            <button 
                                onClick={() => setActiveTab('transfers')}
                                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'transfers' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                            >
                                Transfers
                            </button>
                        </div>

                        <div className="flex gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5">
                            {(['all', 'en_attente', 'confirme', 'annule', 'termine'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all
                                        ${filter === f ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                >
                                    {f === 'all' ? 'All Status' : f.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <div className="bg-slate-900/30 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm animate-in fade-in duration-500">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/5">
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        {activeTab === 'vehicles' ? 'Vehicle' : activeTab === 'excursions' ? 'Excursion' : 'Transfer Journey'}
                                    </th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail/Contact</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    {activeTab === 'transfers' && <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Chauffeur</th>}
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {activeTab === 'vehicles' ? (
                                    filteredVehicles.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-500 font-medium italic">No vehicle reservations found.</td></tr>
                                    ) : (
                                        filteredVehicles.map((res) => (
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
                                                            {new Date(res.date_debut).toLocaleDateString()} → {new Date(res.date_fin).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                                                            <span className="material-symbols-outlined text-slate-600 text-[14px]">location_on</span>
                                                            {res.lieu_depart}
                                                        </div>
                                                        {res.nb_sieges_bebe > 0 && <span className="text-[10px] text-primary font-black uppercase">{res.nb_sieges_bebe} Baby Seats</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-[9px] font-black uppercase tracking-widest">
                                                    <span className={`px-3 py-1 rounded-full ${res.statut === 'en_attente' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : res.statut === 'confirme' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                        {res.statut === 'annule' ? (res.cancelled_by_id === res.utilisateur_id ? 'Client' : 'Admin') : res.statut.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-lg font-black text-primary">${res.montant_total}</td>
                                                <td className="px-6 py-6 text-right">
                                                    {res.statut === 'en_attente' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => updateStatus(res.id, 'confirme', 'vehicle')} className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all"><span className="material-symbols-outlined">check</span></button>
                                                            <button onClick={() => updateStatus(res.id, 'annule', 'vehicle')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><span className="material-symbols-outlined">close</span></button>
                                                        </div>
                                                    ) : res.statut === 'confirme' ? (
                                                        <button onClick={() => updateStatus(res.id, 'annule', 'vehicle')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><span className="material-symbols-outlined">cancel</span></button>
                                                    ) : <span className="text-[10px] text-slate-600 uppercase font-black">History</span>}
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : activeTab === 'excursions' ? (
                                    filteredExcursions.length === 0 ? (
                                        <tr><td colSpan={6} className="px-6 py-20 text-center text-slate-500 font-medium italic">No excursion reservations found.</td></tr>
                                    ) : (
                                        filteredExcursions.map((res) => (
                                            <tr key={res.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold">{res.utilisateur.name}</span>
                                                        <span className="text-[11px] text-slate-500">{res.utilisateur.email}</span>
                                                        <span className="text-[11px] text-primary/70 font-mono mt-0.5">{res.utilisateur.telephone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-medium">
                                                    <span className="text-white text-base font-bold">{res.excursion.nom}</span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-xs text-white">
                                                            <span className="material-symbols-outlined text-primary text-sm">calendar_today</span>
                                                            {new Date(res.date_reservation).toLocaleDateString()}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                                                            <span className="material-symbols-outlined text-slate-600 text-[14px]">location_on</span>
                                                            {res.lieu_depart}
                                                        </div>
                                                        <div className="flex gap-2 text-[10px] font-black text-slate-400 uppercase mt-1">
                                                            <span>{res.nb_adultes}A</span>
                                                            {res.nb_enfants > 0 && <span>{res.nb_enfants}C</span>}
                                                            {res.nb_bebes > 0 && <span>{res.nb_bebes}B</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-[9px] font-black uppercase tracking-widest text-white">
                                                    <span className={`px-3 py-1 rounded-full ${res.statut === 'en_attente' ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' : res.statut === 'confirme' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                        {res.statut.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 text-lg font-black text-primary">${res.montant_total}</td>
                                                <td className="px-6 py-6 text-right">
                                                    {res.statut === 'en_attente' ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button onClick={() => updateStatus(res.id, 'confirme', 'excursion')} className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all"><span className="material-symbols-outlined">check</span></button>
                                                            <button onClick={() => updateStatus(res.id, 'annule', 'excursion')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><span className="material-symbols-outlined">close</span></button>
                                                        </div>
                                                    ) : res.statut === 'confirme' ? (
                                                        <button onClick={() => updateStatus(res.id, 'annule', 'excursion')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><span className="material-symbols-outlined">cancel</span></button>
                                                    ) : <span className="text-[10px] text-slate-600 uppercase font-black">History</span>}
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    filteredTransfers.length === 0 ? (
                                        <tr><td colSpan={7} className="px-6 py-20 text-center text-slate-500 font-medium italic">No transfer requests found.</td></tr>
                                    ) : (
                                        filteredTransfers.map((res) => (
                                            <tr key={res.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold">{res.utilisateur.name}</span>
                                                        <span className="text-[11px] text-slate-500">{res.utilisateur.email}</span>
                                                        <span className="text-[11px] text-primary/70 font-mono mt-0.5">{res.utilisateur.telephone}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 font-medium">
                                                    <div className="flex flex-col">
                                                        <span className="text-white font-bold">{res.lieu_depart}</span>
                                                        <span className="text-primary text-[10px]">TO</span>
                                                        <span className="text-white font-bold">{res.lieu_destination}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-xs text-white">
                                                            <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                                                            {new Date(res.date_heure_depart).toLocaleString()}
                                                        </div>
                                                        <div className="flex gap-2 text-[10px] font-black text-slate-400 uppercase mt-1">
                                                            <span>{res.nb_adultes}A, {res.nb_enfants}C, {res.nb_bebes}B</span>
                                                            <span className="bg-white/5 px-2 rounded">{res.type_trajet.replace('_', ' ')}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 text-[9px] font-black uppercase tracking-widest">
                                                    <span className={`px-3 py-1 rounded-full ${
                                                        res.statut === 'en_attente_prix' ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' : 
                                                        res.statut === 'confirme' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                                                        res.statut === 'termine' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                                                        'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                                        {res.statut.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6">
                                                    {res.statut !== 'termine' && res.statut !== 'annule' ? (
                                                        <select 
                                                            className="bg-slate-800 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none focus:border-primary w-full cursor-pointer"
                                                            value={res.chauffeur_id || ''}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                assignChauffeur(res.id, val ? parseInt(val) : null);
                                                            }}
                                                        >
                                                            <option value="" className="bg-slate-800 text-white">No Driver</option>
                                                            {chauffeurs.map(c => (
                                                                <option key={c.id} value={c.id} className="bg-slate-800 text-white">
                                                                    {c.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                                                            <span className="material-symbols-outlined text-sm">person</span>
                                                            {res.chauffeur?.name || (res.statut === 'termine' ? 'Driver Assigned' : '-')}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6">
                                                    {res.statut === 'en_attente_prix' ? (
                                                        <div className="flex flex-col gap-2">
                                                            <input 
                                                                type="number" 
                                                                placeholder="Price" 
                                                                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary w-24"
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        setTransferPrice(res.id, (e.target as HTMLInputElement).value);
                                                                    }
                                                                }}
                                                            />
                                                            <span className="text-[8px] text-slate-500">Press Enter</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-lg font-black text-primary">{res.montant_total ? `$${res.montant_total}` : '-'}</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-6 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {res.statut === 'en_attente_prix' && (
                                                            <button 
                                                                onClick={(e) => {
                                                                    const input = (e.currentTarget.parentElement?.parentElement?.previousElementSibling?.querySelector('input') as HTMLInputElement);
                                                                    if (input.value) setTransferPrice(res.id, input.value);
                                                                    else showNotification('Please enter a price first.', 'error');
                                                                }} 
                                                                className="p-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                                                            >
                                                                <span className="material-symbols-outlined">send</span>
                                                            </button>
                                                        )}
                                                        <button onClick={() => updateStatus(res.id, 'annule', 'transfer')} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><span className="material-symbols-outlined">close</span></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
