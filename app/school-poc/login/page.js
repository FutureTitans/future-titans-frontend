'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { schoolPoc } from '@/lib/api';
import { setAuthToken } from '@/lib/auth';
import { School, Lock, Mail, ArrowRight } from 'lucide-react';

export default function SchoolPocLoginPage() {
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
        setLoading(true);

        try {
            const response = await schoolPoc.login(formData);
            setAuthToken(response.token);
            localStorage.setItem('schoolPocUser', JSON.stringify(response.user));
            router.push('/school-poc/dashboard');
        } catch (err) {
            setError(err?.error || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="card max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-red to-accent-gold rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <School className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold gradient-text mb-2">School POC Portal</h1>
                    <p className="text-neutral-medium text-sm">
                        Access your school's student dashboard
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-medium" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 border border-neutral-border rounded-xl focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition"
                                placeholder="poc@school.edu"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-medium" />
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className="w-full pl-11 pr-4 py-3 border border-neutral-border rounded-xl focus:ring-2 focus:ring-primary-red/20 focus:border-primary-red transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary-red to-accent-gold text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                Signing In...
                            </>
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-neutral-medium">
                        Student?{' '}
                        <Link href="/login" className="text-primary-red hover:underline font-medium">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
