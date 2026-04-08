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
            setError(err.message || 'Something went wrong during registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a192f] flex flex-col justify-center items-center px-4 py-12">
            <div className="max-w-2xl w-full space-y-8 bg-slate-900/50 p-10 rounded-2xl border border-primary/20 backdrop-blur-xl">
                <div className="text-center">
                    <Link href="/" className="flex items-center justify-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-4xl text-primary">rocket_launch</span>
                        <h1 className="text-2xl font-bold tracking-tighter text-slate-100 italic">LUXE<span className="text-primary">DRIVE</span></h1>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-white">Create your account</h2>
                    <p className="mt-2 text-sm text-slate-400">Join the elite circle of luxury</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-primary uppercase tracking-tighter ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-primary uppercase tracking-tighter ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-primary uppercase tracking-tighter ml-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="+212 600 000 000"
                                    value={formData.telephone}
                                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-primary uppercase tracking-tighter ml-1">Birth Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all [color-scheme:dark]"
                                    value={formData.date_naissance}
                                    onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-primary uppercase tracking-tighter ml-1">City</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Casablanca"
                                    value={formData.ville}
                                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-primary uppercase tracking-tighter ml-1">Address</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="123 Luxury Ave"
                                    value={formData.adresse}
                                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-xs font-bold text-primary uppercase tracking-tighter">License Number</label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="accent-primary"
                                            checked={!hasLicense}
                                            onChange={(e) => setHasLicense(!e.target.checked)}
                                        />
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">No License</span>
                                    </label>
                                </div>
                                <input
                                    type="text"
                                    disabled={!hasLicense}
                                    required={hasLicense}
                                    className={`w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all ${!hasLicense ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    placeholder={hasLicense ? "A1234567" : "No license provided"}
                                    value={hasLicense ? formData.numero_permis : ''}
                                    onChange={(e) => setFormData({ ...formData, numero_permis: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-primary uppercase tracking-tighter ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-primary uppercase tracking-tighter ml-1">Confirm Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
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
                            className={`w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <span>Create Account</span>
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-slate-400">Already have an account? </span>
                        <Link href="/login" className="text-primary font-bold hover:underline">
                            Log In
                        </Link>
                    </div>
                </form>
            </div>
        </div>

    );
}
