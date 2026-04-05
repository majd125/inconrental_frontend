'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';

export default function AddExcursion() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        nom: '',
        description: '',
        duree: '',
        lieux_visites: '',
        prix_par_personne: '',
        nombre_personnes_min: '1',
        nombre_personnes_max: '10',
        actif: true,
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/excursions');
        }
    }, [user, authLoading, router]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value.toString());
            });
            if (image) {
                data.append('image', image);
            }

            const response = await fetch(`${API_URL}/excursions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authService.getToken()}`,
                    'Accept': 'application/json',
                    ...(csrfToken ? { 'X-XSRF-TOKEN': csrfToken } : {}),
                },
                credentials: 'include',
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to add excursion');
            }

            setSuccess(true);
            setTimeout(() => router.push('/excursions'), 2000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user || !user.is_admin) {
        return (
            <div className="min-h-screen bg-[#0a192f] flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a192f] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tighter">Add New <span className="text-primary">Excursion</span></h1>
                        <p className="text-slate-400 mt-2">Create a new extraordinary adventure</p>
                    </div>
                    <Link href="/excursions" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all font-bold text-sm">
                        Back to Excursions
                    </Link>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl flex items-center gap-3 animate-pulse">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p className="font-bold">Excursion added successfully! Redirecting...</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/50 p-8 rounded-2xl border border-primary/20 backdrop-blur-xl shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Excursion Details Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined">map</span>
                                Details
                            </h2>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Excursion Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                    placeholder="Ubud Spiritual Journey"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Duration</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="6 hours"
                                        value={formData.duree}
                                        onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Price per Person ($)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="85"
                                        value={formData.prix_par_personne}
                                        onChange={(e) => setFormData({ ...formData, prix_par_personne: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Min People</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        value={formData.nombre_personnes_min}
                                        onChange={(e) => setFormData({ ...formData, nombre_personnes_min: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Max People</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        value={formData.nombre_personnes_max}
                                        onChange={(e) => setFormData({ ...formData, nombre_personnes_max: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Visited Places (Comma separated)</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all min-h-[100px] resize-none"
                                    placeholder="Monkey Forest, Tegalalang Rice Terrace, Tirta Empul"
                                    value={formData.lieux_visites}
                                    onChange={(e) => setFormData({ ...formData, lieux_visites: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        {/* Presentation Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined">image</span>
                                Presentation
                            </h2>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Excursion Image</label>
                                <div className="relative group border-2 border-dashed border-white/10 rounded-2xl p-4 text-center hover:border-primary/50 transition-all cursor-pointer bg-white/5">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview ? (
                                        <div className="relative aspect-video rounded-xl overflow-hidden">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white font-bold">Change Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <span className="material-symbols-outlined text-4xl text-slate-500 mb-2">add_photo_alternate</span>
                                            <p className="text-sm text-slate-400">Drag and drop or click to upload image</p>
                                            <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-bold">Max size 2MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Description</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all min-h-[150px] resize-none"
                                    placeholder="Describe the excursion itinerary and experience..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                                <input
                                    type="checkbox"
                                    id="actif"
                                    className="w-5 h-5 accent-primary"
                                    checked={formData.actif}
                                    onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                                />
                                <label htmlFor="actif" className="text-sm font-bold text-white cursor-pointer">Active and Visible to Users</label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                                    <span>Creating Excursion...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">publish</span>
                                    <span>Create Excursion</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
