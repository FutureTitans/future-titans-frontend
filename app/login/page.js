'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken, setRefreshToken, setUser } from '@/lib/auth';
import { Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser: storeSetUser, setTokens } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await auth.login(formData);
      setAuthToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      setUser(response.user);
      storeSetUser(response.user);
      setTokens(response.accessToken, response.refreshToken);

      if (response.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/student/dashboard');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background blobs */}
      <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] bg-[#F5D76E]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-[#D4AF37]/12 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-2 gap-0 glass-panel overflow-hidden shadow-2xl">
        {/* Left — Brand panel (desktop only) */}
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-[#0F5132] to-[#1B6B4C] relative overflow-hidden" style={{ borderRadius: '24px 0 0 24px' }}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 bg-[#D4AF37] rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#F5D76E] rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 text-center">
            <Sparkles className="w-14 h-14 text-[#F5D76E] mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-3">Future Titans</h2>
            <p className="text-white/70 text-lg leading-relaxed max-w-xs mx-auto">
              Innovation starts here. Log In to continue your journey.
            </p>
          </div>
        </div>

        {/* Right — Form panel */}
        <div className="p-8 sm:p-10 md:p-12">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition mb-6 group text-sm">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-500">Log In to continue your innovation journey</p>
          </div>

          {errors.submit && (
            <div className="bg-red-50/80 border border-red-200/50 text-red-700 px-4 py-3 rounded-2xl mb-6 flex items-center gap-2 text-sm backdrop-blur-sm">
              <span className="text-lg">⚠️</span> {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`glass-input ${errors.email ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`glass-input ${errors.password ? 'error' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="glass-button w-full py-4 text-base shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="flex items-center justify-between mt-8 text-sm">
            <Link href="/forgot-password" className="text-gray-500 hover:text-[#D4AF37] transition">
              Forgot Password?
            </Link>
            <p className="text-gray-500">
              New here?{' '}
              <Link href="/signup" className="text-[#D4AF37] font-semibold hover:text-[#B8952E] transition">
                Create Account
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200/30">
            <p className="text-[10px] text-gray-400 text-center mb-3 uppercase tracking-widest font-semibold">Demo Access</p>
            <div className="bg-white/40 border border-white/50 p-4 rounded-2xl text-xs text-gray-500 flex flex-col items-center gap-1 backdrop-blur-sm">
              <p>Email: <span className="font-mono text-gray-700">admin@futuretitans.com</span></p>
              <p>Password: <span className="font-mono text-gray-700">admin123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
