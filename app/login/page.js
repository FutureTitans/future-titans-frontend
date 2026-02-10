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
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-red transition mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-lg text-gray-600">Sign in to continue your innovation journey</p>
        </div>

        <div className="glass-panel p-8 md:p-10 shadow-2xl">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <span className="text-xl">⚠️</span> {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full px-5 py-4 bg-white/50 border backdrop-blur-sm rounded-xl focus:outline-none focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 transition-all ${errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                  }`}
                disabled={isLoading}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
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
                  className={`w-full px-5 py-4 bg-white/50 border backdrop-blur-sm rounded-xl focus:outline-none focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 transition-all ${errors.password ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                    }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="glass-button w-full py-4 text-lg shadow-xl shadow-red-500/20 hover:shadow-red-500/30 flex justify-center items-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Links */}
          <div className="flex items-center justify-between mt-8 text-sm">
            <Link href="/forgot-password" className="text-neutral-500 hover:text-primary-red transition">
              Forgot Password?
            </Link>
            <p className="text-neutral-500">
              New here?{' '}
              <Link href="/signup" className="text-primary-red font-semibold hover:text-red-700 transition">
                Create Account
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200/50">
            <p className="text-xs text-gray-400 text-center mb-3 uppercase tracking-wider font-semibold">Demo Access</p>
            <div className="bg-gray-50/50 border border-gray-100 p-4 rounded-xl text-xs text-gray-500 flex flex-col items-center gap-1">
              <p>Email: <span className="font-mono text-gray-700">admin@futuretitans.com</span></p>
              <p>Password: <span className="font-mono text-gray-700">admin123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

