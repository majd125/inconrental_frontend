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
    annee: number;
    categorie: string;
    statut: string;
    image_url: string | null;
}

export default function AdminVehicles() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/catalog');
            return;
        }

        const fetchVehicles = async () => {
            try {
                const response = await fetch(`${API_URL}/vehicules`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authService.getToken()}`
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch vehicles');
                const result = await response.json();
                setVehicles(result.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user?.is_admin) {
            fetchVehicles();
        }
    }, [user, authLoading, router]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this vehicle unit and all its documents? This action cannot be undone.')) return;
        
        try {
            const response = await fetch(`${API_URL}/vehicules/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to delete vehicle');
            
            setVehicles(prev => prev.filter(v => v.id !== id));
        } catch (err: any) {
            alert(err.message);
        }
    };

    // Grouping vehicles by Brand (Marque) then by Modele
    const groupedByBrandAndModel = vehicles.reduce((acc: { [brand: string]: { [model: string]: Vehicle[] } }, vehicle) => {
        const brand = vehicle.marque;
        const model = vehicle.modele;
        if (!acc[brand]) acc[brand] = {};
        if (!acc[brand][model]) acc[brand][model] = [];
        acc[brand][model].push(vehicle);
        return acc;
    }, {});

    const brands = Object.keys(groupedByBrandAndModel).sort();

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a192f] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter">
                            Fleet <span className="text-primary">Administration</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">Manage your elite collection by brand and individual unit.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link 
                            href="/admin/add-car" 
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            Add New Car
                        </Link>
                        <Link href="/catalog" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all">
                            <span className="material-symbols-outlined">visibility</span>
                            Public Catalog
                        </Link>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                {brands.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-primary/10">
                        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">directions_car_paused</span>
                        <p className="text-slate-400 text-xl font-medium">No vehicles registered in the fleet yet.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {brands.map((brand) => (
                            <section key={brand} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-black text-primary uppercase tracking-widest">{brand}</h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent"></div>
                                    <span className="text-slate-500 font-bold text-xs uppercase tracking-wider bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                        {Object.values(groupedByBrandAndModel[brand]).flat().length} Unit(s)
                                    </span>
                                </div>

                                <div className="space-y-8">
                                    {Object.keys(groupedByBrandAndModel[brand]).sort().map((model) => (
                                        <div key={model} className="bg-slate-900/30 border border-white/5 rounded-2xl p-6">
                                            <div className="flex items-center justify-between mb-6 border-b border-primary/10 pb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white tracking-wide">{model}</h3>
                                                    <p className="text-xs text-slate-500 font-medium">Model Variant</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="flex items-center text-slate-500 font-bold text-xs bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                                        {groupedByBrandAndModel[brand][model].length} Unit(s)
                                                    </span>
                                                    <Link 
                                                        href={`/admin/add-car?marque=${encodeURIComponent(brand)}&modele=${encodeURIComponent(model)}`}
                                                        className="flex items-center gap-1 text-xs font-bold text-primary hover:text-white bg-primary/10 hover:bg-primary transition-all px-4 py-1.5 rounded-full border border-primary/20"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                                        Add Unit
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Units list */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {groupedByBrandAndModel[brand][model].map(vehicle => (
                                                    <div key={vehicle.id} className="bg-slate-900/80 border border-white/5 rounded-xl p-4 flex flex-col gap-4 font-sans shadow-lg">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`material-symbols-outlined ${vehicle.statut === 'disponible' ? 'text-green-500/80' : 'text-slate-500'}`}>directions_car</span>
                                                                <span className="text-white font-mono font-bold tracking-wider">{vehicle.immatriculation}</span>
                                                            </div>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${vehicle.statut === 'disponible' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                                {vehicle.statut}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2 mt-auto pt-2 border-t border-white/5">
                                                            <Link 
                                                                href={`/admin/vehicles/${vehicle.id}/documents`}
                                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-primary hover:border-primary text-slate-300 hover:text-white font-bold py-2 rounded-lg transition-all border border-white/10 text-[10px] uppercase tracking-wider"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">description</span>
                                                                Docs
                                                            </Link>
                                                            <Link 
                                                                href={`/admin/vehicles/${vehicle.id}/maintenance`}
                                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-orange-500 hover:border-orange-500 text-slate-300 hover:text-white font-bold py-2 rounded-lg transition-all border border-white/10 text-[10px] uppercase tracking-wider"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">build</span>
                                                                Maint
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDelete(vehicle.id)}
                                                                className="w-10 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 rounded-lg transition-all border border-red-500/20 flex items-center justify-center group"
                                                                title="Delete Unit"
                                                            >
                                                                <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
