'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, refreshUser, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        numero_permis: '',
        date_naissance: '',
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                telephone: user.telephone || '',
                adresse: user.adresse || '',
                ville: user.ville || '',
                numero_permis: user.numero_permis || '',
                date_naissance: user.date_naissance ? new Date(user.date_naissance).toISOString().split('T')[0] : ''
            }));
        }
    }, [user, authLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            await authService.updateProfile({
                name: formData.name,
                email: formData.email,
                telephone: formData.telephone,
                adresse: formData.adresse,
                ville: formData.ville,
                numero_permis: formData.numero_permis,
                date_naissance: formData.date_naissance,
                current_password: formData.current_password || undefined,
                new_password: formData.new_password || undefined,
                new_password_confirmation: formData.new_password_confirmation || undefined
            });
            
            await refreshUser();
            setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
            setFormData(prev => ({
                ...prev,
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            }));
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Une erreur est survenue lors de la mise à jour.' });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
                    <p className="text-gray-600 mt-2">Gérez vos informations personnelles et les paramètres de votre compte.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                                    <span className="text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                                <p className="text-gray-500 text-sm">{user?.email}</p>
                                
                                <div className="mt-6 w-full space-y-2">
                                    <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                                        <span className="text-gray-500">Statut</span>
                                        <span className="font-medium text-blue-600 px-2 py-1 bg-blue-50 rounded-full text-xs">
                                            {user?.is_admin ? 'Administrateur' : user?.is_driver ? 'Chauffeur' : 'Client'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-2">
                                        <span className="text-gray-500">Membre depuis</span>
                                        <span className="font-medium text-gray-900">Avril 2024</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Forms */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Information Form */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-600">person</span>
                                Informations Personnelles
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {message && (
                                    <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${
                                        message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                        <span className="material-symbols-outlined text-lg">
                                            {message.type === 'success' ? 'check_circle' : 'error'}
                                        </span>
                                        {message.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Nom Complet</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                            placeholder="Votre nom"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                            placeholder="votre@email.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={formData.telephone}
                                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                            placeholder="+216 -- --- ---"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Ville</label>
                                        <input
                                            type="text"
                                            value={formData.ville}
                                            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                            placeholder="Ex: Tunis"
                                        />
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <label className="text-sm font-semibold text-gray-700">Adresse</label>
                                        <input
                                            type="text"
                                            value={formData.adresse}
                                            onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                            placeholder="Votre adresse complète"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Numéro de Permis</label>
                                        <input
                                            type="text"
                                            value={formData.numero_permis}
                                            onChange={(e) => setFormData({ ...formData, numero_permis: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                            placeholder="N° Permis"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Date de Naissance</label>
                                        <input
                                            type="date"
                                            value={formData.date_naissance}
                                            onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <hr className="border-gray-100 my-8" />

                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-orange-600">lock</span>
                                    Sécurité (Optionnel)
                                </h3>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Mot de passe actuel</label>
                                        <input
                                            type="password"
                                            value={formData.current_password}
                                            onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                            placeholder="••••••••"
                                        />
                                        <p className="text-[11px] text-gray-500 italic">Requis uniquement si vous changez de mot de passe</p>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Nouveau mot de passe</label>
                                            <input
                                                type="password"
                                                value={formData.new_password}
                                                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Confirmer le nouveau mot de passe</label>
                                            <input
                                                type="password"
                                                value={formData.new_password_confirmation}
                                                onChange={(e) => setFormData({ ...formData, new_password_confirmation: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/10"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">save</span>
                                                Enregistrer les modifications
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
