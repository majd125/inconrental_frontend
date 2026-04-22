'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';

import { useNotification } from '@/context/NotificationContext';

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
    const { showNotification } = useNotification();
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
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Échec de la récupération des véhicules');
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
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette unité de véhicule et tous ses documents ? Cette action est irréversible.')) return;
        
        try {
            const response = await fetch(`${API_URL}/vehicules/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });
            
            if (!response.ok) throw new Error('Échec de la suppression du véhicule');
            
            setVehicles(prev => prev.filter(v => v.id !== id));
            showNotification('Véhicule supprimé avec succès.', 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                                Administration de la <span className="text-black">Flotte</span>
                            </h1>
                            <div className="bg-gray-100 text-black px-3 py-1 rounded-lg text-sm font-bold border border-gray-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">directions_car</span>
                                {vehicles.length} UNITÉS TOTALES
                            </div>
                        </div>
                        <p className="text-gray-500 text-lg">Gérez votre collection d'élite par marque et par unité individuelle.</p>
                    </div>
                    <div className="flex gap-4">
                        <Link 
                            href="/admin/add-car" 
                            className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-black/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-md"
                        >
                            <span className="material-symbols-outlined">add_circle</span>
                            Ajouter une Voiture
                        </Link>
                        <Link href="/catalog" className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all">
                            <span className="material-symbols-outlined">visibility</span>
                            Catalogue Public
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
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">directions_car_paused</span>
                        <p className="text-gray-500 text-xl font-medium">Aucun véhicule enregistré dans la flotte pour le moment.</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {brands.map((brand) => (
                            <section key={brand} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 mb-6">
                                    <h2 className="text-2xl font-black text-black uppercase tracking-widest">{brand}</h2>
                                    <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent"></div>
                                    <span className="text-gray-500 font-bold text-xs uppercase tracking-wider bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                        {Object.values(groupedByBrandAndModel[brand]).flat().length} Unité(s)
                                    </span>
                                </div>

                                <div className="space-y-8">
                                    {Object.keys(groupedByBrandAndModel[brand]).sort().map((model) => (
                                        <div key={model} className="bg-white border border-gray-200 rounded-2xl p-6">
                                            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 tracking-wide">{model}</h3>
                                                    <p className="text-xs text-gray-500 font-medium">Variante du Modèle</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <span className="flex items-center text-gray-500 font-bold text-xs bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                                                        {groupedByBrandAndModel[brand][model].length} Unité(s)
                                                    </span>
                                                    <Link 
                                                        href={`/admin/add-car?marque=${encodeURIComponent(brand)}&modele=${encodeURIComponent(model)}&template_id=${groupedByBrandAndModel[brand][model][0].id}`}
                                                        className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white bg-white hover:bg-black transition-all px-4 py-1.5 rounded-full border border-gray-200 shadow-sm"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                                        Ajouter Unité
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Units list */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {groupedByBrandAndModel[brand][model].map(vehicle => (
                                                    <div key={vehicle.id} className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-4 font-sans shadow-lg">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`material-symbols-outlined ${vehicle.statut === 'disponible' ? 'text-green-500/80' : 'text-gray-500'}`}>directions_car</span>
                                                                <span className="text-gray-900 font-mono font-bold tracking-wider">{vehicle.immatriculation}</span>
                                                            </div>
                                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                                                                vehicle.statut === 'disponible' ? 'bg-green-500/20 text-green-400' : 
                                                                vehicle.statut === 'maintenance' ? 'bg-orange-500/20 text-orange-400' :
                                                                'bg-red-500/20 text-red-400'
                                                            }`}>
                                                                {vehicle.statut === 'disponible' ? 'Disponible' : vehicle.statut === 'maintenance' ? 'Maintenance' : 'Loué'}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                                                            <Link 
                                                                href={`/admin/vehicles/${vehicle.id}/documents`}
                                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-black text-gray-900 hover:text-white font-bold py-2 rounded-xl transition-all border border-gray-200 text-[10px] uppercase tracking-widest shadow-sm"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">description</span>
                                                                Docs
                                                            </Link>
                                                            <Link 
                                                                href={`/admin/vehicles/${vehicle.id}/maintenance`}
                                                                className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-amber-500 text-gray-900 hover:text-white font-bold py-2 rounded-xl transition-all border border-gray-200 text-[10px] uppercase tracking-widest shadow-sm"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">build</span>
                                                                Entretien
                                                            </Link>
                                                            <button 
                                                                onClick={() => handleDelete(vehicle.id)}
                                                                className="w-10 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 flex items-center justify-center group shadow-sm"
                                                                title="Supprimer l'Unité"
                                                            >
                                                                <span className="material-symbols-outlined text-[16px] group-hover:scale-110 transition-transform">delete</span>
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
