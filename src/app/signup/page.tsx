'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';

export default function Signup() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        telephone: '',
        adresse: '',
        ville: '',
        numero_permis: '',
        date_naissance: '',
        password: '',
        password_confirmation: ''
    });
    const [hasLicense, setHasLicense] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const submissionData = {
            ...formData,
            numero_permis: hasLicense ? formData.numero_permis : 'N/A'
        };

        try {
            const data = await authService.register(submissionData);
            login(data.token, data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.message || "Une erreur s'est produite lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
            <div className="max-w-2xl w-full space-y-8 bg-white p-10 rounded-2xl border border-gray-200 backdrop-blur-xl">
                <div className="text-center">
                    <Link href="/" className="flex items-center justify-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-4xl text-black">rocket_launch</span>
                        <h1 className="text-2xl font-black tracking-[-0.05em] text-black">ICON<span className="text-gray-400">RENTAL</span></h1>
                    </Link>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Créez votre compte</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Rejoignez le cercle d'élite du luxe</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Nom Complet</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 h-12 text-gray-900 font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Adresse Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 h-12 text-gray-900 font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Numéro de Téléphone</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 h-12 text-gray-900 font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                    placeholder="+212 600 000 000"
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Date de Naissance</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 h-12 text-gray-900 font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all [color-scheme:light]"
                                    value={formData.date_naissance}
                                    onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Ville</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 h-12 text-gray-900 font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                    placeholder="Casablanca"
                                    value={formData.ville}
                                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Adresse</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 h-12 text-gray-900 font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 shadow-sm"
                                    placeholder="123 Luxury Ave"
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Numéro de Permis</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="accent-black"
                                            checked={!hasLicense}
                                            onChange={(e) => setHasLicense(!e.target.checked)}
                                        />
                                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-tight">Pas de Permis</span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    disabled={!hasLicense}
                                    required={hasLicense}
                                    className={`w-full bg-white border border-gray-300 rounded-xl px-4 h-12 text-gray-900 font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all ${!hasLicense ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'shadow-sm'}`}
                                    placeholder={hasLicense ? "A1234567" : "Aucun permis fourni"}
                                    value={hasLicense ? formData.numero_permis : ''}
                                    onChange={(e) => setFormData({ ...formData, numero_permis: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-black uppercase tracking-tighter ml-1">Mot de passe</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-black uppercase tracking-tighter ml-1">Confirmer le Mot de Passe</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password_confirmation}
                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-14 bg-black hover:bg-black/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-3 group active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                                    <span>Création du Compte...</span>
                                </>
                            ) : (
                                <>
                                    <span>Créer un Compte</span>
                                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">Vous avez déjà un compte ? </span>
                        <Link href="/login" className="text-black font-bold hover:underline">
                            Se Connecter
                        </Link>
                    </div>
                </form>
            </div>
        </div>

    );
}
