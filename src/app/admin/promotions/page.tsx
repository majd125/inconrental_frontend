'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';
import { useNotification } from '@/context/NotificationContext';

interface Promotion {
    id: number;
    name: string | null;
    discount_percentage: number;
    start_date: string;
    end_date: string;
    applies_to_type: 'car' | 'excursion' | 'both';
    scope_type: 'all' | 'specific';
    target_ids: number[] | null;
}

interface ItemBase {
    id: number;
    name: string; // We'll map immatriculation or nom to this for display
}

export default function AdminPromotions() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { showNotification } = useNotification();
    
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState<Partial<Promotion>>({
        applies_to_type: 'car',
        scope_type: 'all',
        discount_percentage: 10,
        target_ids: []
    });

    const [availableItems, setAvailableItems] = useState<ItemBase[]>([]);
    
    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/catalog');
            return;
        }

        if (user?.is_admin) {
            fetchPromotions();
        }
    }, [user, authLoading, router]);

    const fetchPromotions = async () => {
        try {
            const token = authService.getToken();
            const response = await fetch(`${API_URL}/admin/promotions`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch promotions');
            const result = await response.json();
            setPromotions(result.data || []);
        } catch (err: any) {
            showNotification(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch items based on applies_to_type when scope is specific
        if (formData.scope_type === 'specific' && formData.applies_to_type) {
            fetchSpecificItems(formData.applies_to_type);
        }
    }, [formData.scope_type, formData.applies_to_type]);

    const fetchSpecificItems = async (type: string) => {
        try {
            let url = '';
            if (type === 'car') url = `${API_URL}/vehicules`;
            if (type === 'excursion') url = `${API_URL}/excursions`;
            if (type === 'both') {
                // Simplified: just clear or don't allow specific for 'both' easily without complex UI
                setAvailableItems([]);
                return;
            }

            const response = await fetch(url);
            const result = await response.json();
            
            if (type === 'car') {
                setAvailableItems(result.data.map((v: any) => ({ id: v.id, name: `${v.marque} ${v.modele} [${v.immatriculation}]` })));
            } else if (type === 'excursion') {
                setAvailableItems(result.data.map((e: any) => ({ id: e.id, name: e.nom })));
            }
        } catch (error) {
            console.error("Failed to load items", error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this promotion?')) return;
        try {
            const response = await fetch(`${API_URL}/admin/promotions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authService.getToken()}` }
            });
            if (!response.ok) throw new Error('Failed to delete promotion');
            setPromotions(prev => prev.filter(p => p.id !== id));
            showNotification('Promotion deleted successfully.', 'success');
        } catch (err: any) {
            showNotification(err.message, 'error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const isUpdate = !!formData.id;
            const url = isUpdate ? `${API_URL}/admin/promotions/${formData.id}` : `${API_URL}/admin/promotions`;
            const method = isUpdate ? 'PUT' : 'POST';

            const payload = { ...formData };
            if (payload.scope_type === 'all') {
                delete payload.target_ids;
            }

            const response = await fetch(url, {
                method,
                headers: { 
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || 'Error saving promotion');
            }

            showNotification('Promotion saved successfully', 'success');
            setModalOpen(false);
            fetchPromotions();
        } catch (err: any) {
            showNotification(err.message, 'error');
        }
    };

    const openModal = (promo?: Promotion) => {
        if (promo) {
            setFormData(promo);
        } else {
            setFormData({
                applies_to_type: 'car',
                scope_type: 'all',
                discount_percentage: 10,
                target_ids: []
            });
        }
        setModalOpen(true);
    };

    const toggleTargetId = (id: number) => {
        const current = formData.target_ids || [];
        if (current.includes(id)) {
            setFormData({ ...formData, target_ids: current.filter(t => t !== id) });
        } else {
            setFormData({ ...formData, target_ids: [...current, id] });
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-fuchsia-500 border-t-transparent rounded-full"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a192f] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto pt-16">
                
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-black text-white tracking-tighter">
                                Promotion <span className="text-fuchsia-400">Settings</span>
                            </h1>
                            <div className="bg-fuchsia-500/20 text-fuchsia-400 px-3 py-1 rounded-lg text-sm font-bold border border-fuchsia-500/30 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">sell</span>
                                {promotions.length} ACTIVE
                            </div>
                        </div>
                        <p className="text-slate-400 text-lg">Manage dynamic discounts and seasonal offers across your fleet and excursions.</p>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 text-white rounded-xl font-bold transition-all shadow-lg shadow-fuchsia-500/20 transform hover:-translate-y-1"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Create Promotion
                    </button>
                </div>

                {/* Grid */}
                {promotions.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-fuchsia-500/10">
                        <span className="material-symbols-outlined text-6xl text-slate-600 mb-4 animate-bounce">money_off</span>
                        <p className="text-slate-400 text-xl font-medium">No active promotions. Create one to boost sales!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {promotions.map((promo) => {
                            const isActive = new Date(promo.start_date) <= new Date() && new Date(promo.end_date) >= new Date();
                            const isExpired = new Date(promo.end_date) < new Date();

                            return (
                                <div key={promo.id} className="bg-slate-900/40 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-fuchsia-500/30 hover:bg-slate-900/60 transition-all font-sans">
                                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-3xl group-hover:bg-fuchsia-400/20 transition-all"></div>
                                    
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-black text-white">{promo.name || 'Unnamed Promo'}</h3>
                                            <div className="flex gap-2 mt-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isActive ? 'bg-green-500/20 text-green-400' : isExpired ? 'bg-red-500/20 text-red-400' : 'bg-slate-500/20 text-slate-400'}`}>
                                                    {isActive ? 'Active' : isExpired ? 'Expired' : 'Upcoming'}
                                                </span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-fuchsia-500/20 text-fuchsia-400">
                                                    {promo.applies_to_type} ({promo.scope_type})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-black text-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]">
                                            -{promo.discount_percentage}%
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <span className="material-symbols-outlined text-[16px] text-fuchsia-400/60">event</span>
                                            {promo.start_date} to {promo.end_date}
                                        </div>
                                        {promo.scope_type === 'specific' && (
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <span className="material-symbols-outlined text-[16px] text-fuchsia-400/60">adjust</span>
                                                {promo.target_ids?.length || 0} items targeted
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-6 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => openModal(promo)}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-fuchsia-500 hover:text-white text-slate-300 font-bold py-2 rounded-lg transition-all border border-white/10 text-[10px] uppercase tracking-wider"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(promo.id)}
                                            className="w-10 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 rounded-lg transition-all border border-red-500/20 flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined text-sm">delete</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a192f]/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-slate-900 border border-fuchsia-500/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-fuchsia-900/20">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-900 to-slate-900/50">
                            <h2 className="text-2xl font-black text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-fuchsia-500">local_offer</span>
                                {formData.id ? 'Edit Promotion' : 'New Promotion'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Promotion Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all font-medium"
                                        value={formData.name || ''}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g. Summer Special"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Discount %</label>
                                    <input 
                                        type="number" 
                                        required min="0" max="100" step="1"
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-all font-black text-fuchsia-100"
                                        value={formData.discount_percentage || 0}
                                        onChange={e => setFormData({...formData, discount_percentage: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Start Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-all [color-scheme:dark]"
                                        value={formData.start_date || ''}
                                        onChange={e => setFormData({...formData, start_date: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">End Date</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-all [color-scheme:dark]"
                                        value={formData.end_date || ''}
                                        onChange={e => setFormData({...formData, end_date: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applies To</label>
                                    <select 
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-all appearance-none"
                                        value={formData.applies_to_type || 'car'}
                                        onChange={e => setFormData({...formData, applies_to_type: e.target.value as 'car'|'excursion'|'both', scope_type: 'all', target_ids: []})}
                                    >
                                        <option value="car">Cars Only</option>
                                        <option value="excursion">Excursions Only</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scope</label>
                                    <select 
                                        disabled={formData.applies_to_type === 'both'} // too complex to mix specific items in one array nicely for this MVP
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 transition-all appearance-none disabled:opacity-50"
                                        value={formData.scope_type || 'all'}
                                        onChange={e => setFormData({...formData, scope_type: e.target.value as 'all'|'specific', target_ids: []})}
                                    >
                                        <option value="all">Global (All)</option>
                                        <option value="specific">Specific Items</option>
                                    </select>
                                    {formData.applies_to_type === 'both' && (
                                        <p className="text-[10px] text-fuchsia-400 mt-1">Specific scope is not available for "Both".</p>
                                    )}
                                </div>
                            </div>
                            
                            {formData.scope_type === 'specific' && formData.applies_to_type !== 'both' && (
                                <div className="space-y-3 pt-4 border-t border-white/5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Select Targets</label>
                                    <div className="max-h-48 overflow-y-auto bg-slate-800/30 rounded-xl border border-white/5 p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {availableItems.map(item => {
                                            const isSelected = (formData.target_ids || []).includes(item.id);
                                            return (
                                                <div 
                                                    key={item.id} 
                                                    onClick={() => toggleTargetId(item.id)}
                                                    className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-all border ${isSelected ? 'bg-fuchsia-500/20 font-bold border-fuchsia-500/50 text-fuchsia-300' : 'bg-slate-800/50 border-white/5 text-slate-300 hover:bg-slate-800'}`}
                                                >
                                                    {item.name}
                                                </div>
                                            );
                                        })}
                                        {availableItems.length === 0 && (
                                            <div className="col-span-full p-4 text-center text-slate-500 text-sm">No items found to target.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-white/5 flex gap-4">
                                <button type="submit" className="flex-1 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-400 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-fuchsia-500/20">
                                    {formData.id ? 'Save Changes' : 'Create Promotion'}
                                </button>
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all border border-white/10">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

