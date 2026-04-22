'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';

interface DocumentVehicule {
    id: number;
    vehicule_id: number;
    type: 'carte_grise' | 'assurance' | 'vignette' | 'visite_technique';
    numero: string;
    date_debut: string;
    date_expiration: string;
    organisme: string | null;
    montant: string | null;
    statut: 'validé' | 'expiré';
    Remarques: string | null;
    created_at: string;
    updated_at: string;
}

interface Vehicle {
    id: number;
    marque: string;
    modele: string;
    immatriculation: string;
}

export default function VehicleDocuments() {
    const router = useRouter();
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [documents, setDocuments] = useState<DocumentVehicule[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    const [showForm, setShowForm] = useState(false);
    const [editingDoc, setEditingDoc] = useState<DocumentVehicule | null>(null);

    const [formData, setFormData] = useState({
        type: 'carte_grise',
        numero: '',
        date_debut: '',
        date_expiration: '',
        organisme: '',
        montant: '',
        statut: 'validé',
        Remarques: '',
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

            // Fetch Documents
            const dRes = await fetch(`${API_URL}/vehicules/${id}/documents`, {
                headers: { 'Authorization': `Bearer ${authService.getToken()}`, 'Accept': 'application/json' }
            });
            const dData = await dRes.json();
            if (dRes.ok) setDocuments(dData.data);
            else throw new Error(dData.message || 'Échec de la récupération des documents');

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const url = editingDoc 
                ? `${API_URL}/documents/${editingDoc.id}`
                : `${API_URL}/vehicules/${id}/documents`;
            
            const method = editingDoc ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'L\'action a échoué');
            }

            setSuccess(editingDoc ? 'Document mis à jour avec succès' : 'Document ajouté avec succès');
            setShowForm(false);
            setEditingDoc(null);
            resetForm();
            fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (docId: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
        
        setActionLoading(true);
        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const response = await fetch(`${API_URL}/documents/${docId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'include',
            });

            if (!response.ok) throw new Error('La suppression a échoué');

            setSuccess('Document supprimé avec succès');
            fetchData();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'carte_grise',
            numero: '',
            date_debut: '',
            date_expiration: '',
            organisme: '',
            montant: '',
            statut: 'validé',
            Remarques: '',
        });
    };

    const startEdit = (doc: DocumentVehicule) => {
        setEditingDoc(doc);
        setFormData({
            type: doc.type,
            numero: doc.numero,
            date_debut: doc.date_debut ? doc.date_debut.split('T')[0] : '',
            date_expiration: doc.date_expiration ? doc.date_expiration.split('T')[0] : '',
            organisme: doc.organisme || '',
            montant: doc.montant || '',
            statut: doc.statut,
            Remarques: doc.Remarques || '',
        });
        setShowForm(true);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></span>
            </div>
        );
    }

    const activeDocs = documents.filter(d => d.statut === 'validé');
    const historyDocs = documents.filter(d => d.statut === 'expiré');
    const displayDocs = activeTab === 'active' ? activeDocs : historyDocs;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter">
                            Gérer les <span className="text-black">Documents</span>
                        </h1>
                        {vehicle && (
                            <p className="text-gray-500 mt-2">
                                {vehicle.marque} {vehicle.modele} — <span className="text-gray-900 font-mono">{vehicle.immatriculation}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => { setShowForm(!showForm); if(!showForm) { setEditingDoc(null); resetForm(); } }}
                            className="px-6 py-2.5 bg-black hover:bg-black/90 text-white rounded-lg font-bold transition-all shadow-lg shadow-md flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">{showForm ? 'close' : 'add'}</span>
                            {showForm ? 'Annuler' : 'Ajouter un Document'}
                        </button>
                        <Link href="/catalog" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-100 transition-all font-bold text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined">arrow_back</span> Retour
                        </Link>
                    </div>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p className="font-bold">{success}</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                {showForm && (
                    <div className="mb-12 bg-white p-8 rounded-2xl border border-gray-200 backdrop-blur-xl shadow-2xl animate-in slide-in-from-top duration-300">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="material-symbols-outlined text-black">{editingDoc ? 'edit' : 'add_circle'}</span>
                            {editingDoc ? 'Mettre à jour le Document' : 'Nouveau Document Administratif'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Type</label>
                                <select 
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                                >
                                    <option value="carte_grise">Carte Grise</option>
                                    <option value="assurance">Assurance</option>
                                    <option value="vignette">Vignette</option>
                                    <option value="visite_technique">Visite Technique</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Numéro / ID</label>
                                <input 
                                    type="text"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.numero}
                                    onChange={(e) => setFormData({...formData, numero: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Date de Début</label>
                                <input 
                                    type="date"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.date_debut}
                                    onChange={(e) => setFormData({...formData, date_debut: e.target.value})}
                                />
                            </div>
                            {formData.type !== 'carte_grise' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Date d'Expiration</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                        value={formData.date_expiration}
                                        onChange={(e) => setFormData({...formData, date_expiration: e.target.value})}
                                    />
                                </div>
                            )}
                            {formData.type === 'assurance' && (
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Organisme</label>
                                    <input 
                                        type="text"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                        value={formData.organisme}
                                        onChange={(e) => setFormData({...formData, organisme: e.target.value})}
                                    />
                                </div>
                            )}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Montant (TND)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.montant}
                                    onChange={(e) => setFormData({...formData, montant: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Statut</label>
                                <select 
                                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:ring-1 focus:ring-black outline-none"
                                    value={formData.statut}
                                    onChange={(e) => setFormData({...formData, statut: e.target.value as any})}
                                >
                                    <option value="validé">Validé</option>
                                    <option value="expiré">Expiré</option>
                                </select>
                            </div>
                            <div className="lg:col-span-4 space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase">Remarques</label>
                                <textarea 
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-1 focus:ring-black outline-none min-h-[80px]"
                                    value={formData.Remarques}
                                    onChange={(e) => setFormData({...formData, Remarques: e.target.value})}
                                />
                            </div>
                            <div className="lg:col-span-4 pt-4">
                                <button 
                                    disabled={actionLoading}
                                    className="w-full bg-black hover:bg-black/90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {actionLoading ? <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span> : (editingDoc ? 'Mettre à jour' : 'Enregistrer')}
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
                        Documents Actifs
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all ${activeTab === 'history' ? 'bg-gray-800 text-gray-900 shadow-lg shadow-sm' : 'bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`}
                    >
                        Historique (Expirés)
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Numéro</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Validité</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Montant</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {displayDocs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 italic">Aucun document {activeTab === 'active' ? 'actif' : 'historique'} trouvé pour ce véhicule.</td>
                                </tr>
                            ) : (
                                displayDocs.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900 font-bold capitalize">{doc.type.replace('_', ' ')}</span>
                                            {doc.organisme && <p className="text-[10px] text-gray-500 uppercase">{doc.organisme}</p>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 font-mono text-sm">{doc.numero}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-gray-600">Du : {doc.date_debut ? new Date(doc.date_debut).toLocaleDateString() : 'N/A'}</p>
                                            <p className="text-xs font-bold text-black">Au : {doc.date_expiration ? new Date(doc.date_expiration).toLocaleDateString() : 'N/A'}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {(() => {
                                                if (activeTab === 'active') {
                                                    const isExpired = doc.date_expiration ? new Date(doc.date_expiration) < new Date() : false;
                                                    return isExpired ? (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-red-500/20 text-red-400">
                                                            Expiré
                                                        </span>
                                                    ) : (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-green-500/20 text-green-400">
                                                            Valide
                                                        </span>
                                                    );
                                                } else {
                                                    return (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                                            Payé
                                                        </span>
                                                    );
                                                }
                                            })()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-bold">
                                            {doc.montant ? `${doc.montant} TND` : '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => startEdit(doc)} className="p-2 hover:text-black transition-colors">
                                                    <span className="material-symbols-outlined text-xl">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete(doc.id)} className="p-2 hover:text-red-500 transition-colors">
                                                    <span className="material-symbols-outlined text-xl">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
