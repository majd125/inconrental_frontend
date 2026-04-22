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
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
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
                if (key === 'actif') {
                    data.append(key, value ? '1' : '0');
                } else {
                    data.append(key, value.toString());
                }
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
                if (response.status === 422 && result.errors) {
                    setFieldErrors(result.errors);
                    console.error('Validation errors:', result.errors);
                }
                throw new Error(result.message || 'Failed to add excursion');
            }

            setSuccess(true);
            setFieldErrors({});
            setTimeout(() => router.push('/excursions'), 2000);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user || !user.is_admin) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <span className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tighter">Ajouter une Nouvelle <span className="text-black">Excursion</span></h1>
                        <p className="text-gray-500 mt-2">Créez une nouvelle aventure extraordinaire</p>
                    </div>
                    <Link href="/excursions" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 hover:bg-gray-100 transition-all font-bold text-sm">
                        Retour aux Excursions
                    </Link>
                </div>

                {success && (
                    <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl flex items-center gap-3 animate-pulse">
                        <span className="material-symbols-outlined">check_circle</span>
                        <p className="font-bold">Excursion ajoutée avec succès ! Redirection...</p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl border border-gray-200 backdrop-blur-xl shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Excursion Details Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-black flex items-center gap-2">
                                <span className="material-symbols-outlined">map</span>
                                Détails
                            </h2>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nom de l'Excursion</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                    placeholder="Ubud Spiritual Journey"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                />
                                {fieldErrors.nom && (
                                    <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.nom[0]}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Durée</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                        placeholder="6 hours"
                                        value={formData.duree}
                                        onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                                    />
                                    {fieldErrors.duree && (
                                        <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.duree[0]}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Prix par Personne (TND)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                        placeholder="85"
                                        value={formData.prix_par_personne}
                                        onChange={(e) => setFormData({ ...formData, prix_par_personne: e.target.value })}
                                    />
                                    {fieldErrors.prix_par_personne && (
                                        <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.prix_par_personne[0]}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Personnes Min</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                        value={formData.nombre_personnes_min}
                                        onChange={(e) => setFormData({ ...formData, nombre_personnes_min: e.target.value })}
                                    />
                                    {fieldErrors.nombre_personnes_min && (
                                        <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.nombre_personnes_min[0]}</p>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Personnes Max</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all"
                                        value={formData.nombre_personnes_max}
                                        onChange={(e) => setFormData({ ...formData, nombre_personnes_max: e.target.value })}
                                    />
                                    {fieldErrors.nombre_personnes_max && (
                                        <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.nombre_personnes_max[0]}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Lieux Visités (Séparés par des virgules)</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all min-h-[100px] resize-none"
                                    placeholder="Monkey Forest, Tegalalang Rice Terrace, Tirta Empul"
                                    value={formData.lieux_visites}
                                    onChange={(e) => setFormData({ ...formData, lieux_visites: e.target.value })}
                                ></textarea>
                                {fieldErrors.lieux_visites && (
                                    <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.lieux_visites[0]}</p>
                                )}
                            </div>
                        </div>

                        {/* Presentation Section */}
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-black flex items-center gap-2">
                                <span className="material-symbols-outlined">image</span>
                                Présentation
                            </h2>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Image de l'Excursion</label>
                                <div className="relative group border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-gray-2000 transition-all cursor-pointer bg-gray-50">
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
                                                <span className="text-white font-bold">Changer l'Image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <span className="material-symbols-outlined text-4xl text-gray-500 mb-2">add_photo_alternate</span>
                                            <p className="text-sm text-gray-500">Glissez-déposez ou cliquez pour télécharger l'image</p>
                                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Taille max 2Mo</p>
                                        </div>
                                    )}
                                </div>
                                {fieldErrors.image && (
                                    <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.image[0]}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Description</label>
                                <textarea
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-1 focus:ring-black focus:border-black outline-none transition-all min-h-[150px] resize-none"
                                    placeholder="Décrivez l'itinéraire et l'expérience de l'excursion..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                                {fieldErrors.description && (
                                    <p className="text-red-400 text-xs mt-1 ml-1">{fieldErrors.description[0]}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <input
                                    type="checkbox"
                                    id="actif"
                                    className="w-5 h-5 accent-primary"
                                    checked={formData.actif}
                                    onChange={(e) => setFormData({ ...formData, actif: e.target.checked })}
                                />
                                <label htmlFor="actif" className="text-sm font-bold text-gray-900 cursor-pointer">Active et Visible pour les Utilisateurs</label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black hover:bg-black/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-md flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                                    <span>Création de l'Excursion...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">publish</span>
                                    <span>Créer l'Excursion</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
