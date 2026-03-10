'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
    const router = useRouter();
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (searchParams.get('signup') === 'success') {
            setSuccess('Account created successfully! Please log in.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await authService.login(formData);
            login(data.token, data.user);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a192f] flex flex-col justify-center items-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-slate-900/50 p-10 rounded-2xl border border-primary/20 backdrop-blur-xl">
                <div className="text-center">
                    <Link href="/" className="flex items-center justify-center gap-3 mb-6">
                        <span className="material-symbols-outlined text-4xl text-primary">rocket_launch</span>
                        <h1 className="text-2xl font-bold tracking-tighter text-slate-100 italic">LUXE<span className="text-primary">DRIVE</span></h1>
                    </Link>
                    <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
                    <p className="mt-2 text-sm text-slate-400">Log in to your elite dashboard</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-lg text-sm">
                            {success}
                        </div>
                    )}

                    <div className="space-y-4">
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
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-primary focus:ring-primary border-white/10 rounded bg-white/5"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-primary hover:underline">
                                Forgot password?
                            </a>
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
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-slate-400">Don't have an account? </span>
                        <Link href="/signup" className="text-primary font-bold hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
