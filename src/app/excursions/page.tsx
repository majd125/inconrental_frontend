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
}

export default function Excursions() {
    const { user } = useAuth();
    const [excursions, setExcursions] = useState<Excursion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="flex-1">
            {/* Hero Section */}
            <section className="px-6 lg:px-20 py-8">
                <div className="relative overflow-hidden rounded-xl h-[400px] flex flex-col justify-end bg-slate-900 shadow-2xl shadow-primary/10 border border-primary/10">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'linear-gradient(to top, rgba(10, 10, 12, 0.95) 0%, rgba(10, 10, 12, 0.4) 60%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDrJ_cacbtidQe2mxuUAewN3mijI69fGeq7-k7G4ur9VcOzrS1DBL3nUNJZtMUWtKdDWjrNt0m0-h1GT44dpPjtts5K70KR6A9A4LFiQ9RoOrq--G8D-YSvGC0okUCbN7K_XwB-wmz230KxD59LBsPOhJVVE8ereRSQ0LoOkRmldcWnpP25Sv1LRxGRQ7uzb0kx5bLB1KD0FEMDzZ3JI9wpG19C--6ncaFBFIKfZUFAdgkryhigZK1uL6wqv_KAzr38r4DgD5A9Ki2l")' }}></div>
                    <div className="relative p-8 lg:p-12 z-10 max-w-3xl">
                        <span className="inline-block py-1 px-3 bg-primary/20 text-primary border border-primary/30 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Beyond the Horizon</span>
                        <h1 className="text-white text-5xl lg:text-7xl font-black leading-tight tracking-tighter mb-4">Discover Your <span className="text-primary italic">Next Adventure</span></h1>
                        <p className="text-slate-300 text-lg lg:text-xl font-light max-w-xl">Curated travel experiences guided by experts that unlock the world's most breathtaking secrets.</p>
                    </div>
                </div>
            </section>

            {/* Admin Add Button */}
            {user?.is_admin && (
                <div className="px-6 lg:px-20 mb-8 flex justify-end">
                    <Link 
                        href="/admin/add-excursion" 
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-white px-8 transition-all shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        <p className="font-extrabold tracking-tight">ADD NEW EXCURSION</p>
                    </Link>
                </div>
            )}

            {/* Booking Bar */}
            <section className="px-6 lg:px-20 -mt-12 relative z-20">
                <div className="bg-[#0a192f]/80 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl p-6 lg:p-8">
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">location_on</span> Destination
                            </label>
                            <select className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary focus:border-primary appearance-none">
                                <option className="bg-slate-900">Bali, Indonesia</option>
                                <option className="bg-slate-900">Santorini, Greece</option>
                                <option className="bg-slate-900">Amalfi Coast, Italy</option>
                                <option className="bg-slate-900">Kyoto, Japan</option>
                                <option className="bg-slate-900">Reykjavik, Iceland</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">calendar_month</span> Preferred Date
                            </label>
                            <input className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white focus:ring-1 focus:ring-primary focus:border-primary" type="date" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">group</span> Guests
                            </label>
                            <div className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white flex items-center">
                                <button className="text-primary hover:bg-primary/10 p-1 rounded" type="button"><span className="material-symbols-outlined">remove</span></button>
                                <span className="flex-1 text-center font-bold">2 Guests</span>
                                <button className="text-primary hover:bg-primary/10 p-1 rounded" type="button"><span className="material-symbols-outlined">add</span></button>
                            </div>
                        </div>
                        <div>
                            <button className="w-full bg-primary hover:bg-primary/90 text-white font-black h-14 rounded-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2" type="submit">
                                <span className="material-symbols-outlined">search_check</span>
                                SEARCH EXCURSIONS
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Destination Grid */}
            <section className="px-6 lg:px-20 py-24">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="space-y-2">
                        <h3 className="text-primary font-bold text-xs uppercase tracking-[0.3em]">Curated Explorations</h3>
                        <h2 className="text-4xl lg:text-5xl font-black tracking-tighter">Trending <span className="text-primary italic">Destinations</span></h2>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[4/5] rounded-2xl bg-white/5 animate-pulse border border-white/10"></div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-500/5 rounded-2xl border border-red-500/10">
                        <span className="material-symbols-outlined text-5xl text-red-500 mb-4">error</span>
                        <p className="text-slate-400 font-medium">{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {excursions.map((excursion) => (
                            <div key={excursion.id} className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-primary/20 border border-white/5 hover:border-primary/30">
                                <img 
                                    alt={excursion.nom} 
                                    className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110" 
                                    src={excursion.image_url || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800'} 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a101c] via-[#0a101c]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500"></div>
                                
                                <div className="absolute top-6 right-6 bg-primary/20 backdrop-blur-md rounded-full px-4 py-1.5 flex items-center gap-1.5 text-primary border border-primary/30 text-xs font-black tracking-widest">
                                    <span className="material-symbols-outlined text-sm fill-current">star</span> 5.0
                                </div>

                                <div className="absolute bottom-8 left-8 right-8 space-y-4">
                                    <div>
                                        <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-2">{excursion.duree}</p>
                                        <h4 className="text-white text-3xl font-black leading-tight tracking-tight">{excursion.nom}</h4>
                                    </div>
                                    
                                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Starting at</span>
                                            <span className="text-white font-black text-2xl">${excursion.prix_par_personne}</span>
                                        </div>
                                        <button className="size-12 rounded-xl bg-white text-slate-900 flex items-center justify-center transition-all group-hover:bg-primary group-hover:text-white group-hover:rotate-12">
                                            <span className="material-symbols-outlined font-black">arrow_outward</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Fallback Empty State */}
                        {excursions.length === 0 && (
                            <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">explore_off</span>
                                <h3 className="text-xl font-bold text-white mb-2">No excursions available yet</h3>
                                <p className="text-slate-400">Check back soon for new extraordinary experiences.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Newsletter CTA */}
            <section className="px-6 lg:px-20 py-24 bg-[#0d1b2e] border-y border-white/5 mb-10 overflow-hidden relative">
                <div className="absolute -right-20 -top-20 size-80 rounded-full bg-primary/10 blur-3xl"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl font-black tracking-tighter text-white mb-6 underline decoration-primary underline-offset-[12px]">Join the Inner Circle</h2>
                    <p className="text-slate-400 mb-10 text-lg max-w-2xl mx-auto">Subscribe to receive exclusive access to hidden gems, early bird pricing, and bespoke travel inspiration delivered weekly.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <input className="h-14 px-8 rounded-xl bg-white/5 border border-white/10 text-white min-w-[350px] outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" placeholder="your@email.com" type="email" />
                        <button className="h-14 px-10 bg-primary text-white font-black rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 active:scale-95">SUBSCRIBE NOW</button>
                    </div>
                    <p className="mt-6 text-[10px] text-slate-600 uppercase font-black tracking-[0.2em]">We respect your privacy. Unsubscribe anytime.</p>
                </div>
            </section>
        </div>
    );
}
