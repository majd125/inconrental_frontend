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
            if (!response.ok) throw new Error('Échec de la récupération des promotions');
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
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) return;
        try {
            const response = await fetch(`${API_URL}/admin/promotions/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${authService.getToken()}` }
            });
            if (!response.ok) throw new Error('Échec de la suppression de la promotion');
            setPromotions(prev => prev.filter(p => p.id !== id));
            showNotification('Promotion supprimée avec succès.', 'success');
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
                throw new Error(errData.message || 'Erreur lors de l\'enregistrement de la promotion');
            }

            showNotification('Promotion enregistrée avec succès', 'success');
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto pt-16">
                
                {/* Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
                                Paramètres de <span className="text-black">Promotion</span>
                            </h1>
                            <div className="bg-gray-100 text-black px-3 py-1 rounded-lg text-sm font-bold border border-gray-200 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">sell</span>
                                {promotions.length} ACTIF
                            </div>
                        </div>
                        <p className="text-gray-500 text-lg">Gérez les remises dynamiques et les offres saisonnières sur votre flotte et vos excursions.</p>
                    </div>
                    <button 
                        onClick={() => openModal()}
                        className="flex items-center gap-2 px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-sm transform hover:-translate-y-1"
                    >
                        <span className="material-symbols-outlined">add_circle</span>
                        Créer une Promotion
                    </button>
                </div>

                {/* Grid */}
                {promotions.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <span className="material-symbols-outlined text-6xl text-gray-400 mb-4 animate-bounce">money_off</span>
                        <p className="text-gray-500 text-xl font-medium">Aucune promotion active. Créez-en une pour booster les ventes !</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {promotions.map((promo) => {
                            const isActive = new Date(promo.start_date) <= new Date() && new Date(promo.end_date) >= new Date();
                            const isExpired = new Date(promo.end_date) < new Date();

                            return (
                                <div key={promo.id} className="bg-white border border-gray-200 rounded-2xl p-8 relative flex flex-col justify-between hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 group">
                                    {/* Status Badge */}
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-black animate-pulse' : isExpired ? 'bg-gray-300' : 'bg-gray-400'}`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                                                {isActive ? 'Actif Maintenant' : isExpired ? 'Archivé' : 'À Venir'}
                                            </span>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{promo.applies_to_type}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2 group-hover:text-black transition-colors">{promo.name || 'Promotion sans titre'}</h3>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-black text-black tracking-tighter">{promo.discount_percentage}%</span>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">DE REMISE</span>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="space-y-4 pt-6 border-t border-gray-100">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Période de Validité</span>
                                            <div className="flex items-center gap-2 text-sm text-gray-900 font-bold">
                                                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                                {promo.start_date} — {promo.end_date}
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button 
                                                onClick={() => openModal(promo)}
                                                className="flex-1 h-11 bg-black hover:bg-gray-800 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">edit_square</span>
                                                CONFIGURER
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(promo.id)}
                                                className="w-11 h-11 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-xl transition-all border border-gray-100 flex items-center justify-center"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Simple minimal corner accent */}
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gray-50 to-transparent pointer-events-none"></div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-50/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-xl">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-black">local_offer</span>
                                {formData.id ? 'Modifier la Promotion' : 'Nouvelle Promotion'}
                            </h2>
                            <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-900 transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nom de la Promotion</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-medium"
                                        value={formData.name || ''}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        placeholder="ex. Spécial Été"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">% de Remise</label>
                                    <input 
                                        type="number" 
                                        required min="0" max="100" step="1"
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-black transition-all font-black"
                                        value={formData.discount_percentage || 0}
                                        onChange={e => setFormData({...formData, discount_percentage: Number(e.target.value)})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Date de Début</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-black transition-all [color-scheme:light] font-bold"
                                        value={formData.start_date || ''}
                                        onChange={e => setFormData({...formData, start_date: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Date de Fin</label>
                                    <input 
                                        type="date" 
                                        required
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-black transition-all [color-scheme:light] font-bold"
                                        value={formData.end_date || ''}
                                        onChange={e => setFormData({...formData, end_date: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">S'applique à</label>
                                    <select 
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-black transition-all appearance-none"
                                        value={formData.applies_to_type || 'car'}
                                        onChange={e => setFormData({...formData, applies_to_type: e.target.value as 'car'|'excursion'|'both', scope_type: 'all', target_ids: []})}
                                    >
                                        <option value="car">Voitures Uniquement</option>
                                        <option value="excursion">Excursions Uniquement</option>
                                        <option value="both">Les deux</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Portée</label>
                                    <select 
                                        disabled={formData.applies_to_type === 'both'} // too complex to mix specific items in one array nicely for this MVP
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-black transition-all appearance-none disabled:opacity-50"
                                        value={formData.scope_type || 'all'}
                                        onChange={e => setFormData({...formData, scope_type: e.target.value as 'all'|'specific', target_ids: []})}
                                    >
                                        <option value="all">Global (Tout)</option>
                                        <option value="specific">Articles Spécifiques</option>
                                    </select>
                                    {formData.applies_to_type === 'both' && (
                                        <p className="text-[10px] text-black mt-1">La portée spécifique n'est pas disponible pour "Les deux".</p>
                                    )}
                                </div>
                            </div>
                            
                            {formData.scope_type === 'specific' && formData.applies_to_type !== 'both' && (
                                <div className="space-y-3 pt-4 border-t border-gray-200">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Sélectionner les Cibles</label>
                                    <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-xl border border-gray-200 p-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {availableItems.map(item => {
                                            const isSelected = (formData.target_ids || []).includes(item.id);
                                            return (
                                                <div 
                                                    key={item.id} 
                                                    onClick={() => toggleTargetId(item.id)}
                                                    className={`cursor-pointer px-3 py-2 rounded-lg text-sm transition-all border ${isSelected ? 'bg-gray-100 font-bold border-gray-300 text-black' : 'bg-white border-gray-200 text-gray-600 hover:bg-white'}`}
                                                >
                                                    {item.name}
                                                </div>
                                            );
                                        })}
                                        {availableItems.length === 0 && (
                                            <div className="col-span-full p-4 text-center text-gray-500 text-sm">Aucun article trouvé à cibler.</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="pt-6 border-t border-gray-200 flex gap-4">
                                <button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sm">
                                    {formData.id ? 'Enregistrer les Modifications' : 'Créer une Promotion'}
                                </button>
                                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold py-3 rounded-xl transition-all border border-gray-200">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

