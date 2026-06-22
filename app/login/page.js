'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken, setRefreshToken, setUser } from '@/lib/auth';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

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

      if (response.user.role === 'association') {
        throw new Error('Please use the dedicated Association Portal (/association/login) to login.');
      }

      if (response.user.role === 'admin') {
        router.push('/admin');
      } else if (response.user.role === 'school_poc') {
        router.push('/school-poc');
      } else {
        router.push('/student/dashboard');
      }
    } catch (error) {
      let errMsg = error.error || error.message || 'Incorrect credentials';
      if (errMsg === 'Invalid credentials' || errMsg === 'Login failed') {
        errMsg = 'Incorrect credentials';
      }
      setErrors({ submit: errMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center relative overflow-hidden px-4 py-8 sm:py-12">
      <div className="absolute -top-[15%] -left-[15%] w-[55%] h-[55%] bg-[#F5D76E]/15 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-[15%] -right-[15%] w-[55%] h-[55%] bg-[#D4AF37]/[0.12] rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-2 gap-0 glass-panel overflow-hidden shadow-2xl">
        <div className="hidden md:flex relative overflow-hidden" style={{ borderRadius: '24px 0 0 24px' }}>
          <img src="/students_login.png" alt="Students collaborating on innovation projects" className="w-full h-full object-cover" />
        </div>

        <div className="p-6 sm:p-8 md:p-12">
          <div className="mb-6 sm:mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition mb-5 sm:mb-6 group text-sm">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <img src="/logo.png" alt="Youngpreneurs" className="h-12 sm:h-14 w-auto object-contain mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">Welcome Back</h1>
            <p className="text-gray-500 text-sm sm:text-base">Log in to continue your innovation journey</p>
          </div>

          {errors.submit && (
            <div className="bg-red-50/80 border border-red-200/50 text-red-700 px-4 py-3 rounded-2xl mb-5 text-sm backdrop-blur-sm" role="alert">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`glass-input ${errors.email ? 'error' : ''}`}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`glass-input pr-12 ${errors.password ? 'error' : ''}`}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition rounded-lg"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="glass-button w-full py-4 text-base shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Log In'
              )}
            </button>

          </form>

          <div className="flex flex-col xs:flex-row items-center justify-between gap-3 mt-6 sm:mt-8 text-sm">
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
        </div>
      </div>
    </div>
  );
}
