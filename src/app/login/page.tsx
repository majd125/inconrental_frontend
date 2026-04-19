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
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl border border-gray-200 backdrop-blur-xl">
                <div className="text-center">
                    <Link href="/" className="flex items-center justify-center gap-3 mb-8">
                        <span className="material-symbols-outlined text-4xl text-black">rocket_launch</span>
                        <h1 className="text-2xl font-black tracking-[-0.05em] text-black">ICON<span className="text-gray-400">RENTAL</span></h1>
                    </Link>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Welcome Back</h2>
                    <p className="mt-2 text-sm text-gray-500 font-medium">Access your exclusive dashboard</p>
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

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Email Address</label>
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
                            <label className="text-[11px] font-black text-gray-900 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-white border border-gray-300 rounded-xl px-4 h-12 text-gray-900 font-bold focus:ring-1 focus:ring-black focus:border-black outline-none transition-all placeholder:text-gray-400 shadow-sm"
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
                                className="h-4 w-4 text-black focus:ring-black border-gray-200 rounded bg-gray-50"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-500">
                                Remember me
                            </label>
                        </div>

                        <div className="text-sm">
                            <a href="#" className="font-medium text-black hover:underline">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full h-14 bg-black hover:bg-black/90 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-black/20 flex items-center justify-center gap-3 group active:scale-95 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <span className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></span>
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </div>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-500">Don't have an account? </span>
                        <Link href="/signup" className="text-black font-bold hover:underline">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
