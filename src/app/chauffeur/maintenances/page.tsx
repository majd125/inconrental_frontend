'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface Vehicle {
    id: number;
    marque: string;
    modele: string;
    immatriculation: string;
}

interface Maintenance {
    id: number;
    nom_maintenance: string;
    date: string;
    statut: string;
    vehicule: Vehicle;
    description: string | null;
    garage: string | null;
    kilometrage?: number;
    pieces_changees?: string | null;
    cout_piece?: string | null;
    cout_main_oeuvre?: string | null;
    prochaine_echeance_km?: number | null;
    prochaine_echeance_date?: string | null;
}

export default function ChauffeurMaintenances() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [maintenances, setMaintenances] = useState<Maintenance[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Renewal Form States
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

    const fetchMaintenances = async () => {
        try {
            const response = await fetch(`${API_URL}/chauffeur/maintenances`, {
                headers: { 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}` 
                },
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Échec de la récupération des tâches d\'entretien');
            
            const data = await response.json();
            setMaintenances(data.data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && (!user || !user.is_driver)) {
            router.push('/');
            return;
        }

        if (user?.is_driver) fetchMaintenances();
    }, [user, authLoading, router]);

    const startRenew = (main: Maintenance) => {
        setRenewingMain(main);
        setFormData({
            nom_maintenance: main.nom_maintenance,
            date: new Date().toISOString().split('T')[0],
            kilometrage: '',
            description: '',
            pieces_changees: '',
            cout_piece: '',
            cout_main_oeuvre: '',
            garage: main.garage || '',
            prochaine_echeance_km: '',
            prochaine_echeance_date: '',
            statut: 'terminé',
            remarques: '',
        });
        setIsReguliere(true); // Default to regular so they can log the next date easily
    };

    const cancelRenew = () => {
        setRenewingMain(null);
    };

    const handleRenewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!renewingMain) return;
        
        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const payload: any = {
                ...formData,
                cout_piece: formData.cout_piece || 0,
                cout_main_oeuvre: formData.cout_main_oeuvre || 0,
            };

            if (!isReguliere) {
                payload.prochaine_echeance_km = null;
                payload.prochaine_echeance_date = null;
            }

            const response = await fetch(`${API_URL}/maintenances/${renewingMain.id}/renew`, {
                method: 'POST',
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

            setSuccess('Entretien mis à jour et enregistré avec succès !');
            setRenewingMain(null);
            fetchMaintenances();
            
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const dynamicTotal = (parseFloat(formData.cout_piece) || 0) + (parseFloat(formData.cout_main_oeuvre) || 0);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="mb-10 text-center sm:text-left">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 uppercase">
                        Mes <span className="text-black italic">Tâches</span> d'Entretien
                    </h1>
                    <p className="text-gray-500 text-lg">Interventions sur les véhicules qui vous sont assignées.</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-8 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl flex items-center gap-3 animate-in fade-in duration-500">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p>{success}</p>
                    </div>
                )}

                {/* MODAL / FORM SECTION */}
                {renewingMain && (
                    <div className="mb-12 bg-white border-2 border-black/40 rounded-2xl p-6 shadow-2xl shadow-primary/10 animate-in slide-in-from-top duration-300">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                                    <span className="material-symbols-outlined text-black">edit_document</span>
                                    Enregistrer les Détails du Service
                                </h2>
                                <p className="text-gray-500 text-sm mt-1">
                                    Mise à jour de <strong className="text-gray-900">{renewingMain.nom_maintenance}</strong> pour <strong className="text-gray-900">{renewingMain.vehicule.marque} {renewingMain.vehicule.modele}</strong> ({renewingMain.vehicule.immatriculation})
                                </p>
                            </div>
                            <button onClick={cancelRenew} className="w-10 h-10 bg-gray-50 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-full flex items-center justify-center transition-all">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleRenewSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-1 lg:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Nom de la Tâche</label>
                                <input 
                                    type="text" required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.nom_maintenance}
                                    onChange={(e) => setFormData({...formData, nom_maintenance: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Date de Fin</label>
                                <input 
                                    type="date" required
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none [&::-webkit-calendar-picker-indicator]:invert"
                                    value={formData.date}
                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Kilométrage (KM)</label>
                                <input 
                                    type="number" required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none font-mono"
                                    value={formData.kilometrage}
                                    onChange={(e) => setFormData({...formData, kilometrage: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1 lg:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Pièces Changées (Optionnel)</label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.pieces_changees}
                                    placeholder="Filtre, Plaquettes, etc."
                                    onChange={(e) => setFormData({...formData, pieces_changees: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1 lg:col-span-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Garage / Mécanicien</label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.garage}
                                    onChange={(e) => setFormData({...formData, garage: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Coût des Pièces (TND)</label>
                                <input 
                                    type="number" step="0.01"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none font-mono"
                                    value={formData.cout_piece}
                                    onChange={(e) => setFormData({...formData, cout_piece: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Coût de la Main d'œuvre (TND)</label>
                                <input 
                                    type="number" step="0.01"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none font-mono"
                                    value={formData.cout_main_oeuvre}
                                    onChange={(e) => setFormData({...formData, cout_main_oeuvre: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1 lg:col-span-2">
                                <label className="text-xs font-bold text-black uppercase">Coût Total (TND)</label>
                                <div className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-black font-bold font-mono">
                                    {dynamicTotal.toFixed(2)} TND
                                </div>
                            </div>

                            <div className="lg:col-span-4 mt-2">
                                <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors w-max">
                                    <input 
                                        type="checkbox" 
                                        className="w-5 h-5 accent-primary"
                                        checked={isReguliere}
                                        onChange={(e) => setIsReguliere(e.target.checked)}
                                    />
                                    <span className="text-gray-900 font-bold tracking-wide">Entretien Récurrent (Définir la prochaine échéance)</span>
                                </label>
                            </div>

                            {isReguliere && (
                                <>
                                    <div className="space-y-1 lg:col-span-2">
                                        <label className="text-xs font-bold text-orange-400 uppercase">Kilométrage de la Prochaine Échéance (KM)</label>
                                        <input 
                                            type="number"
                                            className="w-full bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2.5 text-orange-100 focus:ring-1 focus:ring-orange-500 outline-none font-mono"
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

                            <div className="lg:col-span-4 pt-4 border-t border-gray-200 mt-2">
                                <button 
                                    disabled={actionLoading}
                                    type="submit"
                                    className="w-full bg-black hover:bg-black/90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-md disabled:opacity-50 tracking-widest uppercase"
                                >
                                    {actionLoading ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : 'Enregistrer l\'Entretien'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {!renewingMain && (
                    maintenances.length === 0 ? (
                        <div className="bg-white border border-gray-200 rounded-3xl p-20 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-700 mb-4 font-light">
                                build_circle
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Aucun entretien en attente
                            </h3>
                            <p className="text-gray-500">
                                Super ! Vous n'avez aucune réparation ou tâche d'entretien assignée pour le moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {maintenances.map((main) => (
                                <div key={main.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-200 transition-all group shadow-xl">
                                    <div className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-yellow-500/30 flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[12px]">build</span>
                                                    Tâche Assignée
                                                </span>
                                                <span className="text-[10px] text-gray-500 font-mono tracking-tighter uppercase">ID: #{main.id}</span>
                                            </div>
                                            
                                            <div className="grid sm:grid-cols-2 gap-8 mb-6">
                                                <div>
                                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Véhicule</p>
                                                    <div className="flex flex-col">
                                                        <p className="text-gray-900 font-bold text-xl">{main.vehicule.marque} {main.vehicule.modele}</p>
                                                        <p className="text-gray-500 font-mono text-sm mt-1">{main.vehicule.immatriculation}</p>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <span className="material-symbols-outlined text-black">engineering</span>
                                                        <div>
                                                            <p className="text-[10px] font-black text-gray-500 uppercase">Nom de la Tâche</p>
                                                            <p className="text-gray-900 font-bold">{main.nom_maintenance}</p>
                                                        </div>
                                                    </div>
                                                    {main.garage && (
                                                        <div className="flex items-start gap-3">
                                                            <span className="material-symbols-outlined text-black">apartment</span>
                                                            <div>
                                                                <p className="text-[10px] font-black text-gray-500 uppercase">Garage / Emplacement</p>
                                                                <p className="text-gray-900 font-bold">{main.garage}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {main.description && (
                                                <div className="pt-4 border-t border-gray-200 italic text-gray-500 text-sm">
                                                    "{main.description}"
                                                </div>
                                            )}
                                        </div>

                                        <div className="md:w-48 flex flex-col gap-2">
                                            <button 
                                                onClick={() => startRenew(main)}
                                                disabled={actionLoading}
                                                className="w-full flex items-center justify-center gap-2 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold text-xs shadow-lg shadow-green-500/20 disabled:opacity-50 uppercase tracking-widest"
                                            >
                                                <span className="material-symbols-outlined text-sm">edit_document</span>
                                                Mettre à jour & Enregistrer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
