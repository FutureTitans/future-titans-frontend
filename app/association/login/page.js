'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/api';
import { setAuthToken, setRefreshToken, setUser } from '@/lib/auth';
import { Lock, Mail, ArrowRight, LayoutDashboard } from 'lucide-react';

export default function AssociationLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!formData.email || !formData.password) {
            setError('Please enter both email and password.');
            return;
        }
        
        setLoading(true);

        try {
            const response = await auth.login(formData);
            
            if (response.user.role !== 'association') {
               throw new Error('Unauthorized Access: Please use the correct login portal.');
            }

            setAuthToken(response.accessToken);
            setRefreshToken(response.refreshToken);
            setUser(response.user);
            
            router.push('/association/dashboard');
        } catch (err) {
            setError(err.message || 'Invalid credentials. Please check your email and password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDF9EE] relative overflow-hidden px-4">
            {/* Minimalist Background Elements specific to Association theme */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FAEDCD]/40 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-8 sm:p-10 shadow-2xl shadow-[#D4AF37]/10">
                    
                    {/* Header */}
                    <div className="text-center mb-8">
                        <img src="/logo.png" alt="Youngpreneurs" className="h-12 sm:h-14 w-auto object-contain mx-auto mb-5" />
                        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight mb-2">Association Portal</h1>
                        <p className="text-sm text-neutral-500 font-medium">
                            Manage your registered schools and metrics
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50/80 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
                            <span className="text-lg">⚠️</span> {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">
                                Association Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all duration-200 outline-none font-medium"
                                    placeholder="director@association.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest pl-1">
                                Secure Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-11 pr-4 py-3.5 bg-neutral-50/50 border border-neutral-200 rounded-xl text-neutral-900 focus:bg-white focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37] transition-all duration-200 outline-none font-medium"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-[#175C36] to-[#0F4225] hover:from-[#0F4225] hover:to-[#0A2F1A] border border-[#175C36]/50 text-white py-3.5 px-6 rounded-xl font-bold hover:shadow-lg hover:shadow-[#175C36]/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none translate-y-2 mb-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Access Dashboard</span>
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-[#D4AF37]/10 text-center flex flex-col items-center gap-3">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm text-neutral-400 font-bold hover:text-[#D4AF37] transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            Return to General Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
