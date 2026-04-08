'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/auth';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
}

// ── helpers ──────────────────────────────────────────────────────────────────
const PRICE_RANGES = [
    { label: 'Any Price', min: 0, max: Infinity },
    { label: 'Under $100 / day', min: 0, max: 100 },
    { label: '$100 – $300 / day', min: 100, max: 300 },
    { label: '$300 – $600 / day', min: 300, max: 600 },
    { label: '$600+ / day', min: 600, max: Infinity },
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
    const active = value !== options[0]; // first option is always "All / Any"

    // close on outside click
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
                className={`flex h-10 items-center justify-center gap-2 rounded-lg px-4 transition-all group border
                    ${active
                        ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                        : 'bg-primary/10 hover:bg-primary/20 border-primary/30 text-slate-900 dark:text-slate-100'
                    }`}
            >
                <p className="text-sm font-semibold">{active ? value : label}</p>
                <span
                    className={`material-symbols-outlined text-lg transition-transform ${open ? 'rotate-180' : ''} ${active ? 'text-white' : 'text-primary'}`}
                >
                    expand_more
                </span>
            </button>

            {open && (
                <div className="absolute top-12 left-0 z-40 min-w-[180px] rounded-xl bg-white dark:bg-[#0d1b2e] border border-primary/20 shadow-2xl shadow-primary/10 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {options.map((opt) => (
                        <button
                            key={opt}
                            onClick={() => { onChange(opt); setOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors
                                ${opt === value
                                    ? 'bg-primary/10 text-primary font-bold'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-primary/5'
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

// ── main page ─────────────────────────────────────────────────────────────────
export default function Catalog() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

    // ── query status ──────────────────────────────────────────────────────────
    const pickup = searchParams.get('pickup');

    // ── filter state ──────────────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('All');
    const [categoryFilter, setCategoryFilter] = useState('All Categories');
    const [priceFilter, setPriceFilter] = useState('Any Price');
    const [transmissionFilter, setTransmissionFilter] = useState('All Transmissions');

    // ── fetch ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await fetch(`${API_URL}/vehicules`);
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
    }, []);

    // Close modal on Escape key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedVehicle(null);
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, []);

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
            if (!catLower.includes(tabLower) && !tabLower.includes(catLower)) return false;
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

    return (
        <div className="flex-1 px-6 md:px-20 py-8 max-w-7xl mx-auto w-full">
            {/* Search Summary (Minimal) */}
            {pickup && (
                <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-6 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400">Results for: <span className="text-primary">{pickup}</span></p>
                    <Link href="/" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">New search</Link>
                </div>
            )}

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div className="flex flex-col gap-4">
                    <h1 className="text-slate-900 dark:text-slate-100 text-5xl font-black leading-tight tracking-tighter">
                        Exquisite <span className="text-primary">Collection</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
                        Uncompromising performance meets absolute luxury. Select from our curated fleet of the world&apos;s most prestigious vehicles.
                    </p>
                </div>
                
                {user?.is_admin && (
                    <Link 
                        href="/admin/add-car" 
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-white px-8 transition-all shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 whitespace-nowrap"
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
                <div className="h-6 w-px bg-primary/20 mx-1 hidden md:block" />
                {hasActiveFilters && (
                    <button onClick={clearAllFilters} className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-4 transition-all text-red-500">
                        <span className="material-symbols-outlined text-lg">filter_list_off</span>
                        <p className="text-sm font-semibold">Clear All</p>
                    </button>
                )}
                {!loading && (
                    <p className="ml-auto text-slate-500 text-sm font-medium">
                        {groupedModels.length} model{groupedModels.length !== 1 ? 's' : ''} available
                    </p>
                )}
            </div>

            {/* Category Tabs */}
            <div className="border-b border-primary/10 mb-8 overflow-x-auto">
                <div className="flex gap-10 min-w-max">
                    {TAB_CATEGORIES.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`border-b-2 pb-4 font-bold text-sm tracking-wide transition-all ${
                                activeTab === tab
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
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
                        <div key={i} className="h-[400px] rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-500/5 rounded-2xl border border-red-500/10">
                    <p className="text-slate-600 dark:text-slate-400 font-medium">{error}</p>
                </div>
            ) : groupedModels.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 dark:bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">No vehicles match your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {groupedModels.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            onClick={() => setSelectedVehicle(vehicle)}
                            className="group flex flex-col bg-slate-50 dark:bg-primary/5 rounded-xl overflow-hidden border border-primary/10 hover:border-primary/40 transition-all cursor-pointer shadow-sm hover:shadow-primary/10 hover:shadow-lg hover:-translate-y-1"
                        >
                            <div className="relative overflow-hidden aspect-[16/9]">
                                <div className="w-full h-full bg-center bg-cover transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${vehicle.image_url || 'https://via.placeholder.com/800x450?text=No+Image'})` }}></div>
                                <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                                    <div className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest ${vehicle.statut === 'disponible' ? 'bg-primary text-white' : 'bg-red-500 text-white'}`}>
                                        {vehicle.statut === 'disponible' ? 'Available' : 'Reserved'}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col gap-4 text-left">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-slate-900 dark:text-slate-100 text-xl font-bold">{vehicle.marque} {vehicle.modele}</h3>
                                        <p className="text-primary font-medium text-sm capitalize">{vehicle.categorie}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-900 dark:text-slate-100 text-xl font-black">${vehicle.prix_base}</p>
                                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">/ day</p>
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
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    onClick={() => setSelectedVehicle(null)}
                >
                    <div
                        className="relative w-full max-w-xl bg-white dark:bg-[#0d1b2e] rounded-2xl overflow-hidden border border-primary/20 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative aspect-video w-full overflow-hidden">
                            <div className="absolute inset-0 bg-center bg-cover" style={{ backgroundImage: `url(${selectedVehicle.image_url || 'https://via.placeholder.com/800x450?text=No+Image'})` }}></div>
                            <button onClick={() => setSelectedVehicle(null)} className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 hover:bg-primary transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-8 text-left">
                            <h2 className="text-slate-900 dark:text-white text-3xl font-bold mb-2">{selectedVehicle.marque} {selectedVehicle.modele}</h2>
                            <p className="text-primary font-bold uppercase tracking-widest text-xs mb-6">{selectedVehicle.categorie}</p>
                            <p className="text-slate-600 dark:text-slate-400 mb-8">{selectedVehicle.description || "Uncompromising performance meets luxury."}</p>
                            <button className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">Rent Now</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
