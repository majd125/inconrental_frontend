'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { API_URL, authService } from '@/lib/auth';

export default function AddCar() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        marque: '',
        modele: '',
        immatriculation: '',
        annee: new Date().getFullYear(),
        categorie: 'economique',
        transmission: 'Automatique',
        carburant: 'Essence',
        statut: 'disponible',
        prix_base: '',
        description: '',
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [templateId, setTemplateId] = useState<string | null>(null);
    const [templateImagePath, setTemplateImagePath] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/catalog');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const tId = params.get('template_id');
            const marque = params.get('marque');
            const modele = params.get('modele');
            
            if (tId) {
                setTemplateId(tId);
                fetchTemplate(tId);
            } else if (marque || modele) {
                setFormData(prev => ({
                    ...prev,
                    marque: marque || prev.marque,
                    modele: modele || prev.modele
                }));
            }
        }
    }, []);

    const fetchTemplate = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/vehicules/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch template vehicle');
            const result = await response.json();
            const template = result.data;
            
            setFormData({
                marque: template.marque,
                modele: template.modele,
                immatriculation: '', // Always empty for new unit
                annee: template.annee,
                categorie: template.categorie,
                transmission: template.transmission,
                carburant: template.carburant,
                statut: 'disponible',
                prix_base: template.prix_base.toString(),
                description: template.description || '',
            });

            if (template.image) {
                setTemplateImagePath(template.image);
            }
            if (template.image_url) {
                setImagePreview(template.image_url);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

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
            // CSRF Step
            await authService.getCsrfCookie();
            const csrfToken = authService.getCookie('XSRF-TOKEN');

            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value.toString());
            });
            if (image) {
                data.append('image', image);
            } else if (templateImagePath) {
                data.append('image', templateImagePath);
            }

            const response = await fetch(`${API_URL}/vehicules`, {
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
                throw new Error(result.message || 'Failed to add vehicle');
            }

            setSuccess(true);
            setTimeout(() => router.push('/admin/vehicles'), 2000);
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
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-extrabold text-white tracking-tighter">Add New <span className="text-primary">Vehicle</span></h1>
                            {templateId && (
                                <span className="bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                                    Template Pre-filled
                                </span>
                            )}
                        </div>
                        <p className="text-slate-400 mt-2">Expand the elite collection</p>
                    </div>
                    <Link href="/admin/vehicles" className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all font-bold text-sm">
                        Back to Fleet
                    </Link>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl flex items-center gap-3 animate-pulse">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p className="font-bold">Vehicle added successfully! Redirecting...</p>
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
                        {/* Car Details Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined">directions_car</span>
                                Specifications
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Brand</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="Maserati"
                                        value={formData.marque}
                                        onChange={(e) => setFormData({ ...formData, marque: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Model</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="MC20 Cielo"
                                        value={formData.modele}
                                        onChange={(e) => setFormData({ ...formData, modele: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Immatriculation</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="12345-A-6"
                                        value={formData.immatriculation}
                                        onChange={(e) => setFormData({ ...formData, immatriculation: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Year</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        value={formData.annee}
                                        onChange={(e) => setFormData({ ...formData, annee: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Category</label>
                                    <select
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        value={formData.categorie}
                                        onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                                    >
                                        <option className="bg-slate-800" value="economique">Economique</option>
                                        <option className="bg-slate-800" value="compacte">Compacte</option>
                                        <option className="bg-slate-800" value="berline">Berline</option>
                                        <option className="bg-slate-800" value="suv">SUV</option>
                                        <option className="bg-slate-800" value="luxe">Luxe</option>
                                        <option className="bg-slate-800" value="sport">Sport</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Price per Day ($)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        placeholder="450"
                                        value={formData.prix_base}
                                        onChange={(e) => setFormData({ ...formData, prix_base: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Transmission</label>
                                    <select
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        value={formData.transmission}
                                        onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                                    >
                                        <option className="bg-slate-800" value="Automatique">Automatique</option>
                                        <option className="bg-slate-800" value="Manuelle">Manuelle</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Carburant</label>
                                    <select
                                        className="w-full bg-slate-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                                        value={formData.carburant}
                                        onChange={(e) => setFormData({ ...formData, carburant: e.target.value })}
                                    >
                                        <option className="bg-slate-800" value="Essence">Essence</option>
                                        <option className="bg-slate-800" value="Diesel">Diesel</option>
                                        <option className="bg-slate-800" value="Hybride">Hybride</option>
                                        <option className="bg-slate-800" value="Électrique">Électrique</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Visual & Description Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                                <span className="material-symbols-outlined">image</span>
                                Presentation
                            </h2>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Vehicle Media</label>
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
                                            <p className="text-sm text-slate-400">Drag and drop or click to upload vehicle image</p>
                                            <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-widest font-bold">Max size 2MB (JPG, PNG)</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Description</label>
                                <textarea
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all min-h-[120px] resize-none"
                                    placeholder="Describe the performance, luxury features, and driving experience..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
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
                                    <span>Syncing with Database...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">publish</span>
                                    <span>Add to Fleet catalogue</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
