'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/auth';
import Link from 'next/link';

interface Excursion {
    id: number;
    nom: string;
    description: string;
    duree: string;
    lieux_visites: string;
    prix_par_personne: string;
    nombre_personnes_min: number;
    nombre_personnes_max: number;
    actif: boolean;
    image_url: string | null;
    prix_final: number;
    active_promotion_percent: number;
}

export default function Excursions() {
    const { user } = useAuth();
    const [excursions, setExcursions] = useState<Excursion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Reservation State
    const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null);
    const [reservationData, setReservationData] = useState({
        date: '',
        location: '',
        adults: 1,
        children: 0,
        babies: 0
    });

    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchExcursions = async () => {
            try {
                const response = await fetch(`${API_URL}/excursions`);
                if (!response.ok) throw new Error('Failed to fetch excursions');
                const result = await response.json();
                setExcursions(result.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExcursions();
    }, []);

    const handleReservationSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedExcursion) return;
        
        if (!user) {
            setError('Please login to make a reservation');
            return;
        }

        setSubmitting(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/excursion-reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    excursion_id: selectedExcursion.id,
                    date_reservation: reservationData.date,
                    lieu_depart: reservationData.location,
                    nb_adultes: reservationData.adults,
                    nb_enfants: reservationData.children,
                    nb_bebes: reservationData.babies
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to submit reservation');
            }

            setSuccessMessage('Reservation submitted successfully!');
            setTimeout(() => {
                setSelectedExcursion(null);
                setSuccessMessage(null);
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex-1">
            {/* Hero Section */}
            <section className="px-6 lg:px-20 py-8">
                <div className="relative overflow-hidden rounded-xl h-[400px] flex flex-col justify-end bg-white shadow-2xl shadow-primary/10 border border-gray-200">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.1) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrJ_cacbtidQe2mxuUAewN3mijI69fGeq7-k7G4ur9VcOzrS1DBL3nUNJZtMUWtKdDWjrNt0m0-h1GT44dpPjtts5K70KR6A9A4LFiQ9RoOrq--G8D-YSvGC0okUCbN7K_XwB-wmz230KxD59LBsPOhJVVE8ereRSQ0LoOkRmldcWnpP25Sv1LRxGRQ7uzb0kx5bLB1KD0FEMDzZ3JI9wpG19C--6ncaFBFIKfZUFAdgkryhigZK1uL6wqv_KAzr38r4DgD5A9Ki2l")' }}></div>
                    <div className="relative p-8 lg:p-12 z-10 max-w-3xl">
                        <span className="inline-block py-1 px-3 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Beyond the Horizon</span>
                        <h1 className="text-white text-5xl lg:text-7xl font-black leading-tight tracking-tighter mb-4">Discover Your <span className="text-white italic">Next Adventure</span></h1>
                        <p className="text-white/80 text-lg lg:text-xl font-light max-w-xl">Curated travel experiences guided by experts that unlock the world's most breathtaking secrets.</p>
                    </div>
                </div>
            </section>

            {/* Admin Add Button */}
            {user?.is_admin && (
                <div className="px-6 lg:px-20 mb-8 flex justify-end">
                    <Link 
                        href="/admin/add-excursion" 
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-black text-white px-8 transition-all shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        <p className="font-extrabold tracking-tight">ADD NEW EXCURSION</p>
                    </Link>
                </div>
            )}


            {/* Destination Grid */}
            <section className="px-6 lg:px-20 py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-black font-bold text-xs uppercase tracking-[0.3em]">Curated Explorations</h3>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter">Trending <span className="text-black italic">Destinations</span></h2>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[4/5] rounded-2xl bg-gray-50 animate-pulse border border-gray-200"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-500/5 rounded-2xl border border-red-500/10">
                        <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
                        <p className="text-gray-500 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {excursions.map((excursion) => (
                            <div 
                                key={excursion.id} 
                                onClick={() => {
                                    setSelectedExcursion(excursion);
                                    setReservationData({
                                        date: '',
                                        location: '',
                                        adults: excursion.nombre_personnes_min,
                                        children: 0,
                                        babies: 0
                                    });
                                }}
                                className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-md border border-gray-200 hover:border-gray-200"
                            >
                                <img 
                                    alt={excursion.nom} 
                                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110" 
                                    src={excursion.image_url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                                
                                <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                                    <div className="bg-white/90 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-1.5 text-black border border-gray-100 text-[10px] font-black tracking-widest shadow-sm">
                                        <span className="material-symbols-outlined text-[14px] fill-current">star</span> 5.0
                                    </div>
                                    {excursion.active_promotion_percent > 0 && (
                                        <div className="bg-black text-white rounded-full px-3 py-1 text-[10px] font-black tracking-widest shadow-xl border border-white/10">
                                            -{excursion.active_promotion_percent}% OFF
                                        </div>
                                    )}
                                </div>

                                <div className="absolute bottom-8 left-8 right-8 space-y-4">
                                    <div>
                                        <p className="text-white/70 font-black text-[10px] uppercase tracking-[0.3em] mb-2">{excursion.duree}</p>
                                        <h4 className="text-white text-3xl font-black leading-tight tracking-tight">{excursion.nom}</h4>
                                    </div>
                                    
                                    <div className="flex items-center justify-between border-t border-white/20 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">Starting at</span>
                                            {excursion.active_promotion_percent > 0 ? (
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-white font-black text-2xl">${excursion.prix_final}</span>
                                                    <span className="text-white/40 text-sm line-through">${excursion.prix_par_personne}</span>
                                                </div>
                                            ) : (
                                                <span className="text-white font-black text-2xl">${excursion.prix_par_personne}</span>
                                            )}
                                        </div>
                                        <button className="size-12 rounded-xl bg-white text-black flex items-center justify-center transition-all group-hover:bg-black group-hover:text-white group-hover:rotate-12">
                                            <span className="material-symbols-outlined font-black">arrow_outward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Fallback Empty State */}
                        {excursions.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">explore_off</span>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No excursions available yet</h3>
                                <p className="text-gray-500">Check back soon for new extraordinary experiences.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Newsletter CTA */}
            <section className="px-6 lg:px-20 py-24 bg-white border-y border-gray-200 mb-10 overflow-hidden relative">
                <div className="absolute -right-20 -top-20 size-80 rounded-full bg-gray-100 blur-3xl"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl font-black tracking-tighter text-black mb-6 underline decoration-black/5 underline-offset-[12px]">Join the Inner Circle</h2>
                    <p className="text-gray-500 mb-10 text-lg max-w-2xl mx-auto font-medium">Subscribe to receive exclusive access to hidden gems, early bird pricing, and bespoke travel inspiration delivered weekly.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <input className="h-14 px-8 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 min-w-[350px] outline-none focus:ring-1 focus:ring-black focus:border-black transition-all font-bold placeholder:text-gray-400" placeholder="your@email.com" type="email" />
                        <button className="h-14 px-10 bg-black text-white font-black rounded-xl hover:bg-black/90 transition-all shadow-xl shadow-black/10 active:scale-95">SUBSCRIBE NOW</button>
                    </div>
                    <p className="mt-6 text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">We respect your privacy. Unsubscribe anytime.</p>
                </div>
            </section>

            {/* Reservation Modal / Centered */}
            {selectedExcursion && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                        onClick={() => setSelectedExcursion(null)}
                    ></div>

                    {/* Centered panel */}
                    <div className="relative w-full max-w-2xl bg-white border border-gray-200 rounded-2xl flex flex-col max-h-full shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-300">
                        <div className="p-6 md:p-8 flex-1 flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 pr-4">{selectedExcursion.nom}</h2>
                                    <p className="text-black text-sm font-bold tracking-widest uppercase mt-1">Reserve Your Spot</p>
                                </div>
                                <button 
                                    onClick={() => setSelectedExcursion(null)}
                                    className="p-2 rounded-full bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors flex-shrink-0"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Left Side: Info */}
                                <div className="flex-1">
                                    <div className="mb-6 rounded-xl overflow-hidden aspect-video relative border border-gray-200">
                                        <img 
                                            src={selectedExcursion.image_url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'} 
                                            alt={selectedExcursion.nom} className="object-cover w-full h-full"
                                        />
                                        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur text-black px-3 py-1 rounded-md text-xs font-bold font-mono tracking-wider flex border border-gray-100 gap-2 items-center">
                                            <span className="material-symbols-outlined text-sm">schedule</span>
                                            {selectedExcursion.duree}
                                        </div>
                                    </div>

                                    <div className="mb-8 lg:mb-0">
                                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{selectedExcursion.description}</p>
                                        
                                        {selectedExcursion.lieux_visites && (
                                            <div className="mt-4 bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-start gap-3">
                                                <div className="p-2 bg-white border border-gray-100 rounded-lg text-black">
                                                    <span className="material-symbols-outlined text-xl">map</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-900 font-black block text-[10px] uppercase tracking-[0.2em] mb-1">Places Visited</span>
                                                    <span className="text-gray-500 text-sm leading-snug block">{selectedExcursion.lieux_visites}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Side: Form */}
                                <div className="flex-1 flex flex-col lg:min-w-[300px]">
                                     <form className="space-y-6 flex-1 flex flex-col" onSubmit={handleReservationSubmit}>
                                         {/* Status Messages */}
                                         {error && (
                                             <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                                 <span className="material-symbols-outlined text-sm">error</span>
                                                 {error}
                                             </div>
                                         )}
                                         {successMessage && (
                                             <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 rounded-xl text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                                 <span className="material-symbols-outlined text-sm">check_circle</span>
                                                 {successMessage}
                                             </div>
                                         )}

                                         {/* Date */}
                                         <div className="flex flex-col gap-2">
                                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                 <span className="material-symbols-outlined text-base">calendar_today</span> Starting Date
                                             </label>
                                             <input 
                                                 required
                                                 type="date" 
                                                 className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none"
                                                 value={reservationData.date}
                                                 onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                                                 min={new Date().toISOString().split("T")[0]}
                                             />
                                         </div>

                                         {/* Location */}
                                         <div className="flex flex-col gap-2">
                                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                 <span className="material-symbols-outlined text-base">location_on</span> Departure & Arrival
                                             </label>
                                             <select 
                                                 className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none appearance-none cursor-pointer"
                                                 value={reservationData.location}
                                                 onChange={(e) => setReservationData({ ...reservationData, location: e.target.value })}
                                                 required
                                             >
                                                 <option value="" disabled className="bg-white text-gray-500">Select location</option>
                                                 <option value="Tunis" className="bg-white">Tunis</option>
                                                 <option value="Nabeul/Hammamet" className="bg-white">Nabeul / Hammamet</option>
                                                 <option value="Sousse/Monastir" className="bg-white">Sousse / Monastir</option>
                                             </select>
                                         </div>

                                         {/* Guests */}
                                         <div className="flex flex-col gap-3">
                                             <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                 <span className="material-symbols-outlined text-base">group</span> Number of Guests
                                             </label>
                                             <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-gray-200">
                                                 {/* Adultes */}
                                                 <div className="flex items-center justify-between">
                                                     <div>
                                                         <span className="text-gray-900 text-sm font-bold block">Adultes</span>
                                                         <span className="text-[10px] text-gray-500 font-normal">Plein tarif</span>
                                                     </div>
                                                     <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                                                         <button 
                                                             className="text-black disabled:text-gray-400 hover:bg-gray-50 disabled:hover:bg-transparent p-1 rounded transition-all size-8 flex items-center justify-center" 
                                                             type="button"
                                                             disabled={reservationData.adults <= 1 || (reservationData.adults + reservationData.children + reservationData.babies) <= selectedExcursion.nombre_personnes_min}
                                                             onClick={() => setReservationData(prev => ({ ...prev, adults: prev.adults - 1 }))}
                                                         >
                                                             <span className="material-symbols-outlined text-sm">remove</span>
                                                         </button>
                                                         <span className="w-8 text-center text-sm font-bold text-gray-900">{reservationData.adults}</span>
                                                         <button 
                                                             className="text-black disabled:text-gray-400 hover:bg-gray-50 disabled:hover:bg-transparent p-1 rounded transition-all size-8 flex items-center justify-center" 
                                                             type="button"
                                                             disabled={(reservationData.adults + reservationData.children + reservationData.babies) >= selectedExcursion.nombre_personnes_max}
                                                             onClick={() => setReservationData(prev => ({ ...prev, adults: prev.adults + 1 }))}
                                                         >
                                                             <span className="material-symbols-outlined text-sm">add</span>
                                                         </button>
                                                     </div>
                                                 </div>

                                                 {/* Enfants */}
                                                 <div className="flex items-center justify-between">
                                                     <div>
                                                         <span className="text-gray-900 text-sm font-bold block">Enfants</span>
                                                         <span className="text-[10px] text-green-400 font-bold bg-green-400/10 px-1.5 py-0.5 rounded ml-[-2px] mt-1 inline-block">-20% sur le tarif</span>
                                                     </div>
                                                     <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                                                         <button 
                                                             className="text-black disabled:text-gray-400 hover:bg-gray-50 disabled:hover:bg-transparent p-1 rounded transition-all size-8 flex items-center justify-center" 
                                                             type="button"
                                                             disabled={reservationData.children <= 0 || (reservationData.adults + reservationData.children + reservationData.babies) <= selectedExcursion.nombre_personnes_min}
                                                             onClick={() => setReservationData(prev => ({ ...prev, children: prev.children - 1 }))}
                                                         >
                                                             <span className="material-symbols-outlined text-sm">remove</span>
                                                         </button>
                                                         <span className="w-8 text-center text-sm font-bold text-gray-900">{reservationData.children}</span>
                                                         <button 
                                                             className="text-black disabled:text-gray-400 hover:bg-gray-50 disabled:hover:bg-transparent p-1 rounded transition-all size-8 flex items-center justify-center" 
                                                             type="button"
                                                             disabled={(reservationData.adults + reservationData.children + reservationData.babies) >= selectedExcursion.nombre_personnes_max}
                                                             onClick={() => setReservationData(prev => ({ ...prev, children: prev.children + 1 }))}
                                                         >
                                                             <span className="material-symbols-outlined text-sm">add</span>
                                                         </button>
                                                     </div>
                                                 </div>

                                                 {/* Bébés */}
                                                 <div className="flex items-center justify-between">
                                                     <div>
                                                         <span className="text-gray-900 text-sm font-bold block">Bébés</span>
                                                         <span className="text-[10px] text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded ml-[-2px] mt-1 inline-block">-50% sur le tarif</span>
                                                     </div>
                                                     <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
                                                         <button 
                                                             className="text-black disabled:text-gray-400 hover:bg-gray-50 disabled:hover:bg-transparent p-1 rounded transition-all size-8 flex items-center justify-center" 
                                                             type="button"
                                                             disabled={reservationData.babies <= 0 || (reservationData.adults + reservationData.children + reservationData.babies) <= selectedExcursion.nombre_personnes_min}
                                                             onClick={() => setReservationData(prev => ({ ...prev, babies: prev.babies - 1 }))}
                                                         >
                                                             <span className="material-symbols-outlined text-sm">remove</span>
                                                         </button>
                                                         <span className="w-8 text-center text-sm font-bold text-gray-900">{reservationData.babies}</span>
                                                         <button 
                                                             className="text-black disabled:text-gray-400 hover:bg-gray-50 disabled:hover:bg-transparent p-1 rounded transition-all size-8 flex items-center justify-center" 
                                                             type="button"
                                                             disabled={(reservationData.adults + reservationData.children + reservationData.babies) >= selectedExcursion.nombre_personnes_max}
                                                             onClick={() => setReservationData(prev => ({ ...prev, babies: prev.babies + 1 }))}
                                                         >
                                                             <span className="material-symbols-outlined text-sm">add</span>
                                                         </button>
                                                     </div>
                                                 </div>

                                                 <div className="flex justify-between items-center text-[10px] text-gray-500 font-medium px-1 mt-2 pt-2 border-t border-gray-200">
                                                     <span>Total {reservationData.adults + reservationData.children + reservationData.babies} pers.</span>
                                                     <span>Min: {selectedExcursion.nombre_personnes_min} | Max: {selectedExcursion.nombre_personnes_max}</span>
                                                 </div>
                                             </div>
                                         </div>

                                         <div className="mt-auto pt-8">
                                             <div className="flex justify-between items-end mb-4 px-1">
                                                 <span className="text-gray-500 font-medium pb-1">Total Amount:</span>
                                                 <div className="flex items-end gap-1">
                                                     <span className="text-sm font-bold text-black mb-1">$</span>
                                                     <span className="text-4xl font-black text-gray-900 leading-none">
                                                         {(( (selectedExcursion.prix_final || parseFloat(selectedExcursion.prix_par_personne)) * reservationData.adults) + 
                                                           ( (selectedExcursion.prix_final || parseFloat(selectedExcursion.prix_par_personne)) * 0.8 * reservationData.children) + 
                                                           ( (selectedExcursion.prix_final || parseFloat(selectedExcursion.prix_par_personne)) * 0.5 * reservationData.babies)).toFixed(2)}
                                                     </span>
                                                 </div>
                                             </div>
                                             <button 
                                                 disabled={submitting}
                                                 type="submit"
                                                 className="w-full bg-black hover:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black h-14 rounded-xl transition-all shadow-lg shadow-md active:scale-95 flex items-center justify-center gap-2"
                                             >
                                                 <span className="material-symbols-outlined">{submitting ? 'sync' : 'lock'}</span>
                                                 {submitting ? 'PROCESSING...' : 'CONFIRM RESERVATION'}
                                             </button>
                                         </div>
                                     </form>
                                 </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
