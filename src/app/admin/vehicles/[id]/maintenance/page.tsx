'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';

interface Maintenance {
    id: number;
    vehicule_id: number;
    nom_maintenance: string;
    date: string;
    kilometrage: number;
    description: string | null;
    pieces_changees: string | null;
    cout_piece: string | null;
    cout_main_oeuvre: string | null;
    cout_total: string | null;
    garage: string | null;
    prochaine_echeance_km: number | null;
    prochaine_echeance_date: string | null;
    statut: 'en_cours' | 'terminé';
    remarques: string | null;
    is_archived?: boolean;
    created_at: string;
    updated_at: string;
}

interface Vehicle {
    id: number;
    marque: string;
    modele: string;
    immatriculation: string;
}

export default function VehicleMaintenances() {
    const router = useRouter();
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const renewId = searchParams.get('renew');
    
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'history'>('active');

    const [showForm, setShowForm] = useState(false);
    const [editingMain, setEditingMain] = useState<Maintenance | null>(null);
    const [renewingMain, setRenewingMain] = useState<Maintenance | null>(null);

    const [isReguliere, setIsReguliere] = useState(false);

    const [formData, setFormData] = useState({
        nom_maintenance: '',
        date: '',
        kilometrage: '',
        description: '',
        pieces_changees: '',
        cout_piece: '',
        cout_main_oeuvre: '',
        garage: '',
        prochaine_echeance_km: '',
        prochaine_echeance_date: '',
        statut: 'terminé',
        remarques: '',
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch Vehicle Details
            const vRes = await fetch(`${API_URL}/vehicules/${id}`, {
                headers: { 'Authorization': `Bearer ${authService.getToken()}`, 'Accept': 'application/json' }
            });
            const vData = await vRes.json();
            if (vRes.ok) setVehicle(vData.data);

            // Fetch Maintenances
            const dRes = await fetch(`${API_URL}/vehicules/${id}/maintenances`, {
                headers: { 'Authorization': `Bearer ${authService.getToken()}`, 'Accept': 'application/json' }
            });
            const dData = await dRes.json();
            if (dRes.ok) setMaintenances(dData.data);
            else throw new Error(dData.message || 'Échec de la récupération des entretiens');

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (!authLoading) {
            if (!user || !user.is_admin) {
                router.push('/catalog');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, router, fetchData]);

    // Handle auto-opening renewal form from query param
    useEffect(() => {
        if (!loading && maintenances.length > 0 && renewId) {
            const m = maintenances.find(item => item.id === parseInt(renewId));
            if (m && !renewingMain && !editingMain) {
                startRenew(m);
                // Clear the URL param without full reload
                const newUrl = window.location.pathname;
                window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
            }
        }
    }, [loading, maintenances, renewId, renewingMain, editingMain]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const url = renewingMain
                ? `${API_URL}/maintenances/${renewingMain.id}/renew`
                : editingMain 
                ? `${API_URL}/maintenances/${editingMain.id}`
                : `${API_URL}/vehicules/${id}/maintenances`;
            
            const method = renewingMain ? 'POST' : (editingMain ? 'PUT' : 'POST');

            // Automatic calculation of cout_total handled well by backend if we just send piece and MO
            const payload: any = {
                ...formData,
                cout_piece: formData.cout_piece || 0,
                cout_main_oeuvre: formData.cout_main_oeuvre || 0,
            };

            if (!isReguliere) {
                payload.prochaine_echeance_km = null;
                payload.prochaine_echeance_date = null;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'L\'action a échoué');
            }

            setSuccess(renewingMain ? 'Entretien terminé et renouvelé avec succès' : (editingMain ? 'Entretien mis à jour avec succès' : 'Entretien ajouté avec succès'));
            setShowForm(false);
            setEditingMain(null);
            setRenewingMain(null);
            resetForm();
            fetchData();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (mainId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet enregistrement d\'entretien ?')) return;
        
        setActionLoading(true);
        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const response = await fetch(`${API_URL}/maintenances/${mainId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'include',
            });

            if (!response.ok) throw new Error('La suppression a échoué');

            setSuccess('Entretien supprimé avec succès');
            fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReceived = async (mainId: number) => {
        setActionLoading(true);
        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const response = await fetch(`${API_URL}/maintenances/${mainId}/receive`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'include',
            });

            if (!response.ok) throw new Error('La mise à jour a échoué');

            setSuccess('Voiture marquée comme reçue avec succès');
            fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nom_maintenance: '',
            date: '',
            kilometrage: '',
            description: '',
            pieces_changees: '',
            cout_piece: '',
            cout_main_oeuvre: '',
            garage: '',
            prochaine_echeance_km: '',
            prochaine_echeance_date: '',
            statut: 'terminé',
            remarques: '',
        });
        setIsReguliere(false);
    };

    const startEdit = (main: Maintenance) => {
        setEditingMain(main);
        setFormData({
            nom_maintenance: main.nom_maintenance,
            date: main.date ? main.date.split('T')[0] : '',
            kilometrage: main.kilometrage?.toString() || '',
            description: main.description || '',
            pieces_changees: main.pieces_changees || '',
            cout_piece: main.cout_piece?.toString() || '',
            cout_main_oeuvre: main.cout_main_oeuvre?.toString() || '',
            garage: main.garage || '',
            prochaine_echeance_km: main.prochaine_echeance_km?.toString() || '',
            prochaine_echeance_date: main.prochaine_echeance_date ? main.prochaine_echeance_date.split('T')[0] : '',
            statut: main.statut,
            remarques: main.remarques || '',
        });
        setIsReguliere(!!main.prochaine_echeance_km || !!main.prochaine_echeance_date);
        setShowForm(true);
    };

    const startRenew = (main: Maintenance) => {
        setRenewingMain(main);
        setEditingMain(null);
        setFormData({
            nom_maintenance: main.nom_maintenance,
            date: new Date().toISOString().split('T')[0],
            kilometrage: '',
            description: '',
            pieces_changees: '',
            cout_piece: '',
            cout_main_oeuvre: '',
            garage: '',
            prochaine_echeance_km: '',
            prochaine_echeance_date: '',
            statut: 'terminé',
            remarques: '',
        });
        setIsReguliere(!!main.prochaine_echeance_km || !!main.prochaine_echeance_date);
        setShowForm(true);
    };

    // Calculate dynamic total
    const dynamicTotal = (parseFloat(formData.cout_piece) || 0) + (parseFloat(formData.cout_main_oeuvre) || 0);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></span>
            </div>
        );
    }

    const activeDocs = maintenances.filter(m => m.statut === 'en_cours' && !m.is_archived);
    const historyDocs = maintenances.filter(m => m.statut === 'terminé');
    const upcomingDocs = historyDocs.filter(m => !m.is_archived && (!!m.prochaine_echeance_date || !!m.prochaine_echeance_km));
    
    let displayDocs = activeDocs;
    if (activeTab === 'history') displayDocs = historyDocs;
    if (activeTab === 'upcoming') displayDocs = upcomingDocs;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter">
                            Gérer l'<span className="text-black">Entretien</span>
                        </h1>
                        {vehicle && (
                            <p className="text-gray-500 mt-2 font-medium tracking-wide">
                                {vehicle.marque} {vehicle.modele} — <span className="text-gray-900 font-mono">{vehicle.immatriculation}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => { setShowForm(!showForm); if(!showForm) { setEditingMain(null); setRenewingMain(null); resetForm(); } }}
                            className="px-6 py-2.5 bg-black hover:bg-black/90 text-white rounded-lg font-bold transition-all shadow-lg shadow-md flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
                            {showForm ? 'Annuler' : 'Ajouter un Entretien'}
                        </button>
                        <Link href="/admin/vehicles" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-100 transition-all font-bold text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined">arrow_back</span> Retour
                        </Link>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl flex items-center gap-3 animate-in fade-in">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p className="font-bold">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3 animate-in fade-in">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                {showForm && (
                    <div className="mb-12 bg-white p-8 rounded-2xl border border-gray-200 backdrop-blur-xl shadow-2xl animate-in slide-in-from-top duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-black">{renewingMain ? 'check_circle' : (editingMain ? 'edit' : 'build')}</span>
                            {renewingMain ? 'Terminer l\'Entretien (Enregistrer les nouvelles valeurs)' : (editingMain ? 'Mettre à jour l\'Entretien' : 'Nouvel Enregistrement d\'Entretien')}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            
                            <div className="space-y-1 lg:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nom de la Tâche (ex: Vidange, Freins)</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.nom_maintenance}
                                    onChange={(e) => setFormData({...formData, nom_maintenance: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Date de Début / Fin</label>
                                <input 
                                    type="date"
                                    required
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none [&::-webkit-calendar-picker-indicator]:invert"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Kilométrage Actuel (KM)</label>
                                <input 
                                    type="number"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none font-mono"
                                    value={formData.kilometrage}
                                    onChange={(e) => setFormData({...formData, kilometrage: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1 lg:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Pièces Changées (Optionnel)</label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.pieces_changees}
                                    placeholder="Filtre à huile, Plaquettes..."
                                    onChange={(e) => setFormData({...formData, pieces_changees: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Garage / Mécanicien</label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.garage}
                                    onChange={(e) => setFormData({...formData, garage: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Statut</label>
                                <select 
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.statut}
                                    onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
                                >
                                    <option value="en_cours">En Cours (Au Garage)</option>
                                    <option value="terminé">Terminé (Reçue)</option>
                                </select>
                            </div>

                            {/* COSTS */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Coût des Pièces (TND)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none font-mono"
                                    value={formData.cout_piece}
                                    onChange={(e) => setFormData({...formData, cout_piece: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Coût de la Main d'œuvre (TND)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none font-mono"
                                    value={formData.cout_main_oeuvre}
                                    onChange={(e) => setFormData({...formData, cout_main_oeuvre: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1 lg:col-span-2">
                                <label className="text-xs font-bold text-black uppercase">Coût Total Estimé (TND)</label>
                                <div className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2 text-black font-bold font-mono">
                                    {dynamicTotal.toFixed(2)} TND
                                </div>
                            </div>

                            {/* REGULAR MAINTENANCE TOGGLE */}
                            <div className="lg:col-span-4 mt-2">
                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors w-max">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 accent-primary"
                                        checked={isReguliere}
                                        onChange={(e) => setIsReguliere(e.target.checked)}
                                    />
                                    <span className="text-gray-900 font-bold tracking-wide">Entretien Régulier (Nécessite des mises à jour plus tard)</span>
                                </label>
                            </div>

                            {isReguliere && (
                                <>
                                    <div className="space-y-1 lg:col-span-2">
                                        <label className="text-xs font-bold text-orange-400 uppercase">Kilométrage de la Prochaine Échéance (KM)</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2 text-orange-100 focus:ring-1 focus:ring-orange-500 outline-none font-mono"
                                            value={formData.prochaine_echeance_km}
                                            onChange={(e) => setFormData({...formData, prochaine_echeance_km: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1 lg:col-span-2">
                                        <label className="text-xs font-bold text-orange-400 uppercase">Date de la Prochaine Échéance</label>
                                        <input 
                                            type="date"
                                            className="w-full bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2.5 text-orange-100 focus:ring-1 focus:ring-orange-500 outline-none [&::-webkit-calendar-picker-indicator]:invert"
                                            value={formData.prochaine_echeance_date}
                                            onChange={(e) => setFormData({...formData, prochaine_echeance_date: e.target.value})}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="lg:col-span-4 space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Description Complète / Remarques</label>
                                <textarea 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none min-h-[80px]"
                                    value={formData.description}
                                    placeholder="Any additional details or remarks..."
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                />
                            </div>

                            <div className="lg:col-span-4 pt-4 border-t border-gray-200 mt-2">
                                <button 
                                    disabled={actionLoading}
                                    className="w-full bg-black hover:bg-black/90 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-md disabled:opacity-50"
                                >
                                    {actionLoading ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : (renewingMain ? 'Terminer & Enregistrer' : (editingMain ? 'Mettre à jour l\'Entretien' : 'Enregistrer l\'Entretien'))}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex gap-4 mb-6 border-b border-gray-200 pb-4">
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all ${activeTab === 'active' ? 'bg-black text-white shadow-lg shadow-md' : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        En Cours au Garage
                    </button>
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all flex items-center gap-2 ${activeTab === 'upcoming' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">build_circle</span>
                        Échéances Prochaines
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all ${activeTab === 'history' ? 'bg-gray-800 text-gray-900 shadow-lg shadow-sm' : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        Historique des Entretiens (Terminé)
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tâche d'Entretien</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date & Garage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kilométrage</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Coût Total</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {displayDocs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">Aucun enregistrement d'entretien {activeTab === 'active' ? 'en cours' : (activeTab === 'upcoming' ? 'planifié' : 'terminé')} trouvé.</td>
                                </tr>
                            ) : (
                                displayDocs.map((main) => {
                                    let daysLeftStr = '';
                                    let isExpiredDue = false;

                                    if (main.prochaine_echeance_date && main.statut === 'terminé') {
                                        const end = new Date(main.prochaine_echeance_date);
                                        const now = new Date();
                                        const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                        
                                        if (diff < 0) {
                                            daysLeftStr = `${Math.abs(diff)} jours de RETARD`;
                                            isExpiredDue = true;
                                        } else {
                                            daysLeftStr = `Échéance dans ${diff} jours`;
                                        }
                                    }

                                    return (
                                        <tr key={main.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <p className="text-gray-900 font-bold">{main.nom_maintenance}</p>
                                            {main.pieces_changees && <p className="text-xs text-gray-500 mt-1 line-clamp-1 truncate max-w-[200px]">Pièces : {main.pieces_changees}</p>}
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-gray-600 font-medium">{main.date ? new Date(main.date).toLocaleDateString() : 'N/A'}</p>
                                            <p className="text-xs font-bold text-black mt-1">{main.garage || 'Garage Inconnu'}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-gray-900 font-mono">{main.kilometrage ? main.kilometrage.toLocaleString() : '-'} KM</p>
                                                {(main.prochaine_echeance_km || main.prochaine_echeance_date) && activeTab !== 'history' && (
                                                    <>
                                                        <div className="mt-1 flex items-center gap-1 text-[10px] uppercase font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full w-max">
                                                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                                                            Objectif : {main.prochaine_echeance_km ? main.prochaine_echeance_km.toLocaleString() + ' KM' : ''}
                                                            {(main.prochaine_echeance_km && main.prochaine_echeance_date) && ' | '}
                                                            {main.prochaine_echeance_date ? new Date(main.prochaine_echeance_date).toLocaleDateString() : ''}
                                                        </div>
                                                        {daysLeftStr && (
                                                            <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-max ${isExpiredDue ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-400'}`}>
                                                                {daysLeftStr}
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-gray-900 font-bold font-mono text-lg">{main.cout_total || '0.00'} TND</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {main.statut === 'en_cours' && (
                                                    <button onClick={() => handleReceived(main.id)} className="p-2 border border-blue-500/30 text-blue-500 hover:bg-blue-500 hover:text-gray-900 transition-colors bg-blue-500/10 rounded-lg flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap shadow-lg shadow-blue-500/5">
                                                        <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                                                        Voiture Reçue
                                                    </button>
                                                )}
                                                {!main.is_archived && activeTab !== 'history' && (main.prochaine_echeance_date || main.prochaine_echeance_km) && (
                                                    <button onClick={() => startRenew(main)} className="p-2 border border-green-500/30 text-green-500 hover:bg-green-500 hover:text-gray-900 transition-colors bg-green-500/10 rounded-lg flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest whitespace-nowrap shadow-lg shadow-green-500/5">
                                                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                                        Marquer comme Terminé
                                                    </button>
                                                )}
                                                <button onClick={() => startEdit(main)} className="p-2 hover:text-black transition-colors bg-gray-50 rounded-lg">
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(main.id)} className="p-2 hover:text-red-500 transition-colors bg-gray-50 rounded-lg">
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
