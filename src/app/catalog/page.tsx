'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/auth';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';

interface Vehicle {
    id: number;
    marque: string;
    modele: string;
    annee: number;
    categorie: string;
    transmission: string;
    carburant: string;
    prix_base: string;
    description: string;
    image_url: string | null;
    statut: string;
    immatriculation?: string;
    prix_final?: number;
    active_promotion_percent?: number;
}

// ── helpers ──────────────────────────────────────────────────────────────────
const PRICE_RANGES = [
    { label: 'Any Price', min: 0, max: Infinity },
    { label: 'Under $100 / day', min: 0, max: 100 },
    { label: '$100 – $300 / day', min: 100, max: 300 },
    { label: '$300 – $600 / day', min: 300, max: 600 },
    { label: '$600+ / day', min: 600, max: Infinity },
];

const LOCATIONS = [
    "Aéroport international de Tunis-Carthage (TUN)",
    "Aéroport international de Djerba-Zarzis (DJE)",
    "Aéroport international d'Enfidha-Hammamet (NBE)",
    "Aéroport international de Monastir Habib-Bourguiba (MIR)",
    "Our local office in Hammamet Nabeul",
    "Other location"
];

const TAB_CATEGORIES = ['All', 'Economy', 'Compact', 'Sedan', 'SUV', 'Luxury', 'Sports'];

function unique<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
}

// Small dropdown component used for Category, Price Range, Transmission
function FilterDropdown({
    label,
    options,
    value,
    onChange,
}: {
    label: string;
    options: string[];
    value: string;
    onChange: (v: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const active = value !== options[0];

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((p) => !p)}
                className={`flex h-11 items-center justify-center gap-2 rounded-xl px-4 transition-all border
                    ${active
                        ? 'bg-black text-white border-black ring-4 ring-black/5'
                        : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900 shadow-sm'
                    }`}
            >
                <p className="text-sm font-bold tracking-tight">{active ? value : label}</p>
                <span
                    className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${open ? 'rotate-180' : ''} ${active ? 'text-white' : 'text-gray-400'}`}
                >
                    expand_more
                </span>
            </button>

            {open && (
                <div className="absolute top-13 left-0 z-50 min-w-[220px] rounded-2xl bg-white border border-gray-200 shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors
                                ${opt === value
                                    ? 'bg-gray-50 text-black font-bold'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-black'
                                }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

import { useNotification } from '@/context/NotificationContext';

// ── main page ─────────────────────────────────────────────────────────────────
export default function Catalog() {
    const { user } = useAuth();
    const router = useRouter();
    const { showNotification } = useNotification();
    const searchParams = useSearchParams();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    // ── reservation state ──────────────────────────────────────────────────────
    const [modalStep, setModalStep] = useState<'vehicle' | 'form' | 'summary'>('vehicle');
    const [reservationLoading, setReservationLoading] = useState(false);
    const [reservationError, setReservationError] = useState<string | null>(null);
    const [reservationSuccess, setReservationSuccess] = useState(false);

    const pickup = searchParams.get('pickup');
    const return_loc = searchParams.get('return_loc');
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const babySeats = parseInt(searchParams.get('baby_seats') || '0');

    // ── local search state (for when coming directly to catalog) ─────────────
    const [localSearchData, setLocalSearchData] = useState({
        lieu_depart: pickup || LOCATIONS[0],
        lieu_depart_autre: '',
        lieu_arrivee: return_loc || pickup || LOCATIONS[0],
        lieu_arrivee_autre: '',
        date_debut: start || '',
        date_fin: end || '',
        nb_sieges_bebe: babySeats || 0
    });

    const isMissingDetails = !localSearchData.date_debut || !localSearchData.date_fin || !localSearchData.lieu_depart;

    const handleActionClick = () => {
        if (!user) {
            router.push('/login');
            return;
        }
        
        if (isMissingDetails) {
            setModalStep('form');
        } else {
            setModalStep('summary');
        }
    };

    const handleReservation = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        const finalPickup = localSearchData.lieu_depart === "Other location" 
            ? localSearchData.lieu_depart_autre 
            : localSearchData.lieu_depart;
            
        const finalReturn = localSearchData.lieu_arrivee === "Other location" 
            ? localSearchData.lieu_arrivee_autre 
            : localSearchData.lieu_arrivee;

        if (!localSearchData.date_debut || !localSearchData.date_fin || !finalPickup) {
            setReservationError("Please fill in all rental details.");
            return;
        }

        if (!selectedVehicle) return;

        setReservationLoading(true);
        setReservationError(null);

        try {
            const response = await fetch(`${API_URL}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                },
                body: JSON.stringify({
                    vehicule_id: selectedVehicle.id,
                    date_debut: localSearchData.date_debut,
                    date_fin: localSearchData.date_fin,
                    lieu_depart: finalPickup,
                    lieu_arrivee: finalReturn || finalPickup,
                    nb_participants: 1,
                    option_chauffeur: false,
                    nb_sieges_bebe: localSearchData.nb_sieges_bebe
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to create reservation');
            }

            setReservationSuccess(true);
            showNotification('Reservation submitted successfully!', 'success');
            setTimeout(() => {
                router.push('/reservations');
            }, 2000);

        } catch (err: any) {
            setReservationError(err.message);
            showNotification(err.message, 'error');
        } finally {
            setReservationLoading(false);
        }
    };


    // ── filter state ──────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [priceFilter, setPriceFilter] = useState('Any Price');
    const [transmissionFilter, setTransmissionFilter] = useState('All Transmissions');

    // ── fetch ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                let url = `${API_URL}/vehicules`;
                const queryParams = new URLSearchParams();
                if (start) queryParams.append('start', start);
                if (end) queryParams.append('end', end);
                
                const qs = queryParams.toString();
                if (qs) {
                    url += `?${qs}`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch fleet data');
                const result = await response.json();
                setVehicles(result.data || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchVehicles();
    }, [start, end]);

    // Close modal on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSelectedVehicle(null);
                setModalStep('vehicle');
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

    // Close modal resets inner form
    useEffect(() => {
        if (!selectedVehicle) {
            setModalStep('vehicle');
            setReservationSuccess(false);
            setReservationError(null);
        }
    }, [selectedVehicle]);

    // ── derived filter options from real data ─────────────────────────────────
    const categoryOptions = ['All Categories', ...unique(vehicles.map((v) => v.categorie)).sort()];
    const transmissionOptions = ['All Transmissions', ...unique(vehicles.map((v) => v.transmission)).sort()];
    const priceRangeOptions = PRICE_RANGES.map((p) => p.label);

    // ── filtering logic ────────────────────────────────────────────────────────
    const selectedPriceRange = PRICE_RANGES.find((p) => p.label === priceFilter) ?? PRICE_RANGES[0];

    const filteredVehicles = vehicles.filter((v) => {
        if (activeTab !== 'All') {
            const tabLower = activeTab.toLowerCase();
            const catLower = v.categorie.toLowerCase();
            
            // Mapping English tabs to French backend categories
            const mapping: Record<string, string> = {
                'economy': 'economique',
                'compact': 'compacte',
                'sedan': 'berline',
                'luxury': 'luxe',
                'sports': 'sport'
            };

            const mappedCategory = mapping[tabLower] || tabLower;

            if (catLower !== mappedCategory && !catLower.includes(tabLower) && !tabLower.includes(catLower)) {
                return false;
            }
        }
        if (categoryFilter !== 'All Categories' && v.categorie !== categoryFilter) return false;
        const price = parseFloat(v.prix_base);
        if (!isNaN(price) && (price < selectedPriceRange.min || price > selectedPriceRange.max)) return false;
        if (transmissionFilter !== 'All Transmissions' && v.transmission !== transmissionFilter) return false;
        return true;
    });

    const hasActiveFilters =
        activeTab !== 'All' ||
        categoryFilter !== 'All Categories' ||
        priceFilter !== 'Any Price' ||
        transmissionFilter !== 'All Transmissions';

    const clearAllFilters = () => {
        setActiveTab('All');
        setCategoryFilter('All Categories');
        setPriceFilter('Any Price');
        setTransmissionFilter('All Transmissions');
    };

    interface GroupedVehicle extends Vehicle {
        availableCount: number;
        totalCount: number;
    }

    const groupedModels = Object.values(
        filteredVehicles.reduce((acc, vehicle) => {
            const key = `${vehicle.marque}-${vehicle.modele}`;
            if (!acc[key]) {
                acc[key] = {
                    ...vehicle,
                    availableCount: vehicle.statut === 'disponible' ? 1 : 0,
                    totalCount: 1
                };
            } else {
                acc[key].totalCount += 1;
                if (vehicle.statut === 'disponible') {
                    acc[key].availableCount += 1;
                    if (acc[key].statut !== 'disponible') {
                        const counts = { availableCount: acc[key].availableCount, totalCount: acc[key].totalCount };
                        acc[key] = { ...vehicle, ...counts };
                    }
                }
            }
            return acc;
        }, {} as Record<string, GroupedVehicle>)
    );

    const days = Math.ceil((new Date(localSearchData.date_fin).getTime() - new Date(localSearchData.date_debut).getTime()) / (1000 * 60 * 60 * 24)) || 1;
    const vehiclePricePerDay = selectedVehicle ? (selectedVehicle.prix_final || parseFloat(selectedVehicle.prix_base)) : 0;
    const vehicleTotal = vehiclePricePerDay * days;
    const babySeatsTotal = localSearchData.nb_sieges_bebe * days * 10;
    const computedTotal = (vehicleTotal + babySeatsTotal).toFixed(2);

    return (
        <div className="flex-1 px-6 md:px-20 py-8 max-w-7xl mx-auto w-full">
            {/* Search Summary (Minimal) */}
            {pickup && (
                <div className="bg-black/5 border border-gray-200 rounded-xl p-3 mb-6 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-500">Results for: <span className="text-black">{pickup}</span></p>
                    <Link href="/" className="text-[10px] font-black text-black uppercase tracking-widest hover:underline">New search</Link>
                </div>
            )}

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div className="flex flex-col gap-2">
                    <h1 className="text-gray-900 text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                        Exquisite <span className="text-black">Collection</span>
                    </h1>
                    <p className="text-gray-500 text-base md:text-lg max-w-2xl font-medium">
                        A curated selection of premium vehicles combining luxury, comfort, and performance.
                    </p>
                </div>
                
                {user?.is_admin && (
                    <Link 
                        href="/admin/add-car" 
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-black text-white px-8 transition-all shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-xl">add_circle</span>
                        <p className="font-extrabold tracking-tight">ADD NEW CAR</p>
                    </Link>
                )}
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
                <FilterDropdown label="Category" options={categoryOptions} value={categoryFilter} onChange={setCategoryFilter} />
                <FilterDropdown label="Price Range" options={priceRangeOptions} value={priceFilter} onChange={setPriceFilter} />
                <FilterDropdown label="Transmission" options={transmissionOptions} value={transmissionFilter} onChange={setTransmissionFilter} />
                <div className="h-6 w-px bg-gray-100 mx-1 hidden md:block" />
                {hasActiveFilters && (
                    <button onClick={clearAllFilters} className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-4 transition-all text-red-500">
                        <span className="material-symbols-outlined text-lg">filter_list_off</span>
                        <p className="text-sm font-semibold">Clear All</p>
                    </button>
                )}
                {!loading && (
                    <p className="ml-auto text-gray-500 text-sm font-medium">
                        {groupedModels.length} model{groupedModels.length !== 1 ? 's' : ''} available
                    </p>
                )}
            </div>

            {/* Category Tabs */}
            <div className="border-b border-gray-200 mb-8 overflow-x-auto">
                <div className="flex gap-10 min-w-max">
                    {TAB_CATEGORIES.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`border-b-2 pb-4 font-bold text-sm tracking-wide transition-all ${
                                activeTab === tab
                                    ? 'border-black text-black'
                                    : 'border-transparent text-gray-500 hover:text-slate-900 dark:hover:text-slate-100'
                            }`}
                        >
                            {tab.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-[400px] rounded-xl bg-slate-100 dark:bg-white animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-500/5 rounded-2xl border border-red-500/10">
                    <p className="text-gray-400 dark:text-gray-500 font-medium">{error}</p>
                </div>
            ) : groupedModels.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-black/5 rounded-2xl border border-gray-200">
                    <p className="text-gray-400 dark:text-gray-500 font-medium text-lg">No vehicles match your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupedModels.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            onClick={() => setSelectedVehicle(vehicle)}
                            className="group flex flex-col bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-black/10 transition-all cursor-pointer shadow-sm hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden aspect-[16/9]">
                                <div className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${vehicle.image_url || 'https://via.placeholder.com/800x450?text=No+Image'})` }}></div>
                                <div className="absolute top-4 right-4">
                                    <div className={`text-[10px] font-black px-3 py-1 rounded shadow-sm ${vehicle.statut === 'disponible' ? 'bg-white text-black' : 'bg-red-500 text-white'}`}>
                                        {vehicle.statut === 'disponible' ? 'Available' : 'Reserved'}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-gray-900 text-xl font-bold tracking-tight">{vehicle.marque} {vehicle.modele}</h3>
                                        <div className="flex gap-2 items-center mt-1.5">
                                            <span className="text-gray-500 font-bold text-[11px] uppercase tracking-wider px-2 py-0.5 bg-gray-50 border border-gray-200 rounded-md">{vehicle.categorie}</span>
                                            {vehicle.active_promotion_percent > 0 && (
                                                <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">-{vehicle.active_promotion_percent}% PROMO</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {vehicle.active_promotion_percent > 0 ? (
                                            <>
                                                <p className="text-gray-400 text-xs font-bold line-through">${vehicle.prix_base}</p>
                                                <p className="text-black text-2xl font-black tracking-tighter">${vehicle.prix_final}</p>
                                            </>
                                        ) : (
                                            <p className="text-black text-2xl font-black tracking-tighter">${vehicle.prix_base}</p>
                                        )}
                                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">/ Day</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedVehicle && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md"
                    onClick={() => {
                        setSelectedVehicle(null);
                        setModalStep('vehicle');
                    }}
                >
                    <div
                        className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {modalStep === 'vehicle' ? (
                            <>
                                <div className="relative aspect-video w-full overflow-hidden">
                                    <div className="absolute inset-0 bg-center bg-cover transition-transform duration-[2s] scale-110" style={{ backgroundImage: `url(${selectedVehicle.image_url || 'https://via.placeholder.com/800x450?text=No+Image'})` }}></div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <button onClick={() => setSelectedVehicle(null)} className="absolute top-6 right-6 size-10 bg-white/10 backdrop-blur-md hover:bg-white text-white hover:text-black rounded-full flex items-center justify-center transition-all z-10">
                                        <span className="material-symbols-outlined text-xl">close</span>
                                    </button>
                                    
                                    <div className="absolute bottom-8 left-8 right-8 text-white">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-black px-3 py-1 bg-white text-black rounded-full uppercase tracking-widest">{selectedVehicle.categorie}</span>
                                            {selectedVehicle.active_promotion_percent > 0 && (
                                                <span className="text-[10px] font-black px-3 py-1 bg-black text-white rounded-full border border-white/20 uppercase tracking-widest">Special Offer</span>
                                            )}
                                        </div>
                                        <h2 className="text-4xl font-black tracking-tighter">{selectedVehicle.marque} {selectedVehicle.modele}</h2>
                                    </div>
                                </div>

                                <div className="p-6 md:p-8">
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center text-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Transmission</p>
                                            <p className="text-gray-900 font-bold text-xs">{selectedVehicle.transmission}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center text-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Fuel Type</p>
                                            <p className="text-gray-900 font-bold text-xs">{selectedVehicle.carburant}</p>
                                        </div>
                                        <div className="p-3 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center text-center">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Year</p>
                                            <p className="text-gray-900 font-bold text-xs">{selectedVehicle.annee}</p>
                                        </div>
                                    </div>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                        {selectedVehicle.description || "Experience the pinnacle of automotive engineering combining luxury, comfort, and performance."}
                                    </p>
                                    
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Daily Rate</p>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-2xl font-black text-black tracking-tighter">${selectedVehicle.prix_final || selectedVehicle.prix_base}</span>
                                                <span className="text-gray-400 font-medium text-xs">/ day</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleActionClick} 
                                            className="flex-1 py-3.5 bg-black text-white text-sm font-bold rounded-2xl shadow-xl hover:shadow-black/20 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                                        >
                                            {!user ? "Login to Secure" : "Initialize Booking"}
                                            <span className="material-symbols-outlined text-lg">trending_flat</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : modalStep === 'form' ? (
                            <div className="p-8 animate-in slide-in-from-right-8 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tighter">Rental Configuration</h2>
                                        <p className="text-gray-500 text-sm">Fine-tune your rental settings</p>
                                    </div>
                                    <button onClick={() => setModalStep('vehicle')} className="size-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-all">
                                        <span className="material-symbols-outlined text-gray-400">arrow_back</span>
                                    </button>
                                </div>

                                <div className="space-y-6 mb-10">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Departure</label>
                                            <select 
                                                value={localSearchData.lieu_depart}
                                                onChange={(e) => setLocalSearchData({...localSearchData, lieu_depart: e.target.value})}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold text-gray-900 focus:border-black transition-all outline-none appearance-none"
                                            >
                                                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Arrival</label>
                                            <select 
                                                value={localSearchData.lieu_arrivee}
                                                onChange={(e) => setLocalSearchData({...localSearchData, lieu_arrivee: e.target.value})}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold text-gray-900 focus:border-black transition-all outline-none appearance-none"
                                            >
                                                {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {(localSearchData.lieu_depart === "Other location" || localSearchData.lieu_arrivee === "Other location") && (
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 animate-in slide-in-from-top-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Custom Address Details</p>
                                            <div className="space-y-4">
                                                {localSearchData.lieu_depart === "Other location" && (
                                                    <input type="text" placeholder="Full Pick-up Address..." className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-black" value={localSearchData.lieu_depart_autre} onChange={(e) => setLocalSearchData({...localSearchData, lieu_depart_autre: e.target.value})} />
                                                )}
                                                {localSearchData.lieu_arrivee === "Other location" && (
                                                    <input type="text" placeholder="Full Drop-off Address..." className="w-full bg-white border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium outline-none focus:border-black" value={localSearchData.lieu_arrivee_autre} onChange={(e) => setLocalSearchData({...localSearchData, lieu_arrivee_autre: e.target.value})} />
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Starts</label>
                                            <input type="datetime-local" value={localSearchData.date_debut} onChange={(e) => setLocalSearchData({...localSearchData, date_debut: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-black" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Ends</label>
                                            <input type="datetime-local" value={localSearchData.date_fin} onChange={(e) => setLocalSearchData({...localSearchData, date_fin: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 px-4 text-sm font-bold outline-none focus:border-black" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add-ons</p>
                                            <p className="text-gray-900 font-bold">Child Safety Seats</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-black text-black">{localSearchData.nb_sieges_bebe}</span>
                                            <div className="flex gap-1.5">
                                                <button onClick={() => setLocalSearchData({...localSearchData, nb_sieges_bebe: Math.max(0, localSearchData.nb_sieges_bebe - 1)})} className="size-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
                                                    <span className="material-symbols-outlined text-[16px]">remove_circle</span>
                                                </button>
                                                <button onClick={() => setLocalSearchData({...localSearchData, nb_sieges_bebe: localSearchData.nb_sieges_bebe + 1})} className="size-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm">
                                                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={() => setModalStep('summary')}
                                    disabled={isMissingDetails}
                                    className="w-full py-5 bg-black text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl hover:shadow-black/20 hover:-translate-y-1 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center justify-center gap-3"
                                >
                                    Proceed to Summary
                                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                </button>
                            </div>
                        ) : modalStep === 'summary' ? (
                            <div className="p-10 animate-in slide-in-from-right-8 duration-500">
                                <div className="text-center mb-10">
                                    <div className="size-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                        <span className="material-symbols-outlined text-black size-8">fact_check</span>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter">Review Order</h2>
                                    <p className="text-gray-500">Verify your reservation details</p>
                                </div>
                                
                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Vehicle</span>
                                        <span className="font-bold text-gray-900">{selectedVehicle.marque} {selectedVehicle.modele}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Duration</span>
                                        <span className="font-bold text-gray-900">{days} day{days > 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total Price</span>
                                        <span className="text-2xl font-black text-black">${computedTotal}</span>
                                    </div>
                                </div>

                                {reservationSuccess ? (
                                    <div className="bg-black text-white p-6 rounded-2xl text-center font-bold animate-in zoom-in duration-500">
                                        <p>Reservation Confirmed. Thank you!</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4">
                                        <button onClick={() => setModalStep('form')} className="py-4 bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold rounded-2xl transition-all">Back</button>
                                        <button 
                                            onClick={handleReservation}
                                            disabled={reservationLoading}
                                            className="py-4 bg-black text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl hover:shadow-black/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                                        >
                                            {reservationLoading ? "Processing..." : "Confirm & Pay"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
