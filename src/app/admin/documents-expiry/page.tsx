'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';

interface Vehicle {
    id: number;
    marque: string;
    modele: string;
    immatriculation: string;
}

interface DocumentVehicule {
    id: number;
    vehicule_id: number;
    type: 'carte_grise' | 'assurance' | 'vignette' | 'visite_technique';
    numero: string | null;
    date_debut: string | null;
    date_expiration: string | null;
    organisme: string | null;
    montant: string | null;
    statut: 'validé' | 'expiré';
    Remarques: string | null;
    vehicule?: Vehicle;
}

export default function DocumentsExpiry() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    
    const [documents, setDocuments] = useState<DocumentVehicule[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    // Renewal Modal
    const [renewingDoc, setRenewingDoc] = useState<DocumentVehicule | null>(null);
    const [renewLoading, setRenewLoading] = useState(false);
    const [renewData, setRenewData] = useState({
        numero: '',
        date_debut: '',
        date_expiration: '',
        montant: '',
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/documents/all`, {
                headers: { 'Authorization': `Bearer ${authService.getToken()}`, 'Accept': 'application/json' },
                credentials: 'include'
            });
            
            if (res.status === 401 || res.status === 403) {
                authService.logout();
                window.location.href = '/login';
                return;
            }
            
            const data = await res.json();
            if (res.ok) setDocuments(data.data);
            else throw new Error(data.message || 'Failed to fetch documents');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authLoading) {
            if (!user || !user.is_admin) {
                router.push('/catalog');
            } else {
                fetchData();
            }
        }
    }, [user, authLoading, router, fetchData]);

    const handleRenewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!renewingDoc) return;
        
        setRenewLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const response = await fetch(`${API_URL}/documents/${renewingDoc.id}/renew`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'include',
                body: JSON.stringify({
                    numero: renewData.numero,
                    date_debut: renewData.date_debut,
                    date_expiration: renewData.date_expiration,
                    montant: renewData.montant,
                    statut: 'validé',
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Renewal failed');
            }

            setSuccess('Document renewed successfully! Old document stored in history.');
            setRenewingDoc(null);
            fetchData();
            
            // clear success after 3s
            setTimeout(() => setSuccess(null), 3000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setRenewLoading(false);
        }
    };

    const startRenew = (doc: DocumentVehicule) => {
        setRenewingDoc(doc);
        setRenewData({
            numero: doc.numero || '',
            date_debut: '',
            date_expiration: '',
            montant: '',
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
            </div>
        );
    }

    const activeDocs = documents.filter(d => d.statut === 'validé');
    const historyDocs = documents.filter(d => d.statut === 'expiré');

    // Find urgent docs (expiring within 30 days)
    const today = new Date();
    const urgentDocs = activeDocs.filter(d => {
        if (!d.date_expiration) return false;
        const expDate = new Date(d.date_expiration);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30; // already expired or expires within 30 days
    });

    const displayDocs = activeTab === 'active' ? activeDocs : historyDocs;

    return (
        <div className="min-h-screen bg-[#0a192f] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between border-b border-primary/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tighter">
                            Documents <span className="text-primary">Expiry Manager</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-sm font-medium tracking-wide">
                            Track expirations, renew administrative documents, and view payment history.
                        </p>
                    </div>
                    <Link href="/admin/vehicles" className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all font-bold text-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">directions_car</span> Manage Fleet
                    </Link>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl flex items-center gap-3 animate-in fade-in">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p className="font-bold">{success}</p>
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 animate-in fade-in">
                        <span className="material-symbols-outlined">error</span>
                        <p className="font-bold">{error}</p>
                    </div>
                )}

                {/* Urgent Warning */}
                {urgentDocs.length > 0 && activeTab === 'active' && (
                    <div className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 shadow-lg shadow-red-500/5">
                        <h3 className="text-red-400 font-bold flex items-center gap-2 mb-4">
                            <span className="material-symbols-outlined">warning</span>
                            Urgent Actions Required
                        </h3>
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {urgentDocs.map(doc => {
                                const isExpired = new Date(doc.date_expiration!) < today;
                                return (
                                    <div key={doc.id} className="min-w-[300px] bg-slate-900/50 border border-red-500/20 rounded-xl p-4 flex flex-col gap-3">
                                        <div className="flex justify-between">
                                            <span className="text-white font-bold capitalize">{doc.type.replace('_', ' ')}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isExpired ? 'bg-red-500 text-white' : 'bg-orange-500/20 text-orange-400'}`}>
                                                {isExpired ? 'EXPIRED' : 'Expiring Soon'}
                                            </span>
                                        </div>
                                        <div className="text-slate-400 text-sm">
                                            {doc.vehicule?.marque} {doc.vehicule?.modele} <span className="text-white font-mono ml-1">{doc.vehicule?.immatriculation}</span>
                                        </div>
                                        <button onClick={() => startRenew(doc)} className="mt-2 w-full bg-red-500/20 hover:bg-red-500 text-red-100 font-bold py-2 rounded-lg transition-colors text-xs uppercase tracking-wider">
                                            Renew Now
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all ${activeTab === 'active' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                    >
                        Active / Expiring
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2.5 rounded-full font-bold text-sm tracking-wide transition-all ${activeTab === 'history' ? 'bg-slate-700 text-white shadow-lg shadow-slate-900/50' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
                    >
                        History (Renewed)
                    </button>
                </div>

                <div className="bg-slate-900/30 rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Document Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount Paid</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {displayDocs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">No {activeTab} documents found.</td>
                                </tr>
                            ) : (
                                displayDocs.map((doc) => {
                                    const isExpired = doc.date_expiration ? new Date(doc.date_expiration) < today : false;
                                    return (
                                        <tr key={doc.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-5">
                                                <p className="text-white font-bold">{doc.vehicule?.marque} {doc.vehicule?.modele}</p>
                                                <p className="text-slate-500 font-mono text-sm tracking-wider">{doc.vehicule?.immatriculation}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-slate-300 font-bold capitalize">{doc.type.replace('_', ' ')}</span>
                                                {doc.organisme && <p className="text-[10px] text-slate-500 uppercase">{doc.organisme}</p>}
                                                <p className="text-xs font-mono text-slate-400 mt-1">{doc.numero || 'No ID'}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-xs text-slate-400">Start: <span className="text-slate-300">{doc.date_debut ? new Date(doc.date_debut).toLocaleDateString() : 'N/A'}</span></p>
                                                <p className={`text-xs font-bold ${activeTab === 'active' && isExpired ? 'text-red-400' : 'text-primary'}`}>
                                                    Ends: {doc.date_expiration ? new Date(doc.date_expiration).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                {(() => {
                                                    if (activeTab === 'active') {
                                                        return isExpired ? (
                                                            <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-red-500/20 text-red-500 border border-red-500/30">
                                                                Expired
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/20">
                                                                Valid
                                                            </span>
                                                        );
                                                    } else {
                                                        return (
                                                            <span className="text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/30">
                                                                Payed
                                                            </span>
                                                        );
                                                    }
                                                })()}
                                            </td>
                                            <td className="px-6 py-5 text-slate-300 font-bold">
                                                {doc.montant ? `$${doc.montant}` : '-'}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {activeTab === 'active' ? (
                                                    <button 
                                                        onClick={() => startRenew(doc)} 
                                                        className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg transition-all text-xs font-bold tracking-wide border border-primary/20 hover:shadow-lg uppercase"
                                                    >
                                                        Mark as Payed
                                                    </button>
                                                ) : (
                                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full">Archived</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Renew Modal */}
            {renewingDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-primary/20 rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <button 
                            onClick={() => setRenewingDoc(null)}
                            className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        
                        <h2 className="text-2xl font-bold text-white mb-2">Renew Document</h2>
                        <p className="text-slate-400 mb-6 text-sm">
                            Marking <strong>{renewingDoc.type.replace('_', ' ')}</strong> for <span className="font-mono text-white">{renewingDoc.vehicule?.immatriculation}</span> as payed.
                        </p>

                        <form onSubmit={handleRenewSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">New ID / Document # (optional)</label>
                                <input 
                                    type="text"
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
                                    value={renewData.numero}
                                    placeholder={renewingDoc.numero || ''}
                                    onChange={(e) => setRenewData({...renewData, numero: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">New Start Date</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
                                        value={renewData.date_debut}
                                        onChange={(e) => setRenewData({...renewData, date_debut: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">New Expiry</label>
                                    <input 
                                        type="date"
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
                                        value={renewData.date_expiration}
                                        onChange={(e) => setRenewData({...renewData, date_expiration: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Amount Paid ($)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary outline-none"
                                    value={renewData.montant}
                                    onChange={(e) => setRenewData({...renewData, montant: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={renewLoading}
                                className="w-full mt-6 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {renewLoading ? (
                                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">payments</span>
                                        Confirm Renewal
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
