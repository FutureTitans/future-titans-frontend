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
    <div className="min-h-screen bg-gradient-white-light flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="container-lg py-6">
          <Link href="/" className="flex items-center gap-2 text-primary-red hover:text-primary-darkRed transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back</h1>
              <p className="text-neutral-medium">Sign in to continue your learning journey</p>
            </div>

            {errors.submit && (
              <div className="bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error px-4 py-3 rounded-lg mb-6">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20 ${
                    errors.email ? 'border-semantic-error' : 'border-neutral-border'
                  }`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-semantic-error text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20 ${
                      errors.password ? 'border-semantic-error' : 'border-neutral-border'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-medium"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-semantic-error text-sm mt-1">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#305c4d] text-white py-3 rounded-lg font-semibold hover:bg-primary-darkRed transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Forgot Password Link */}
            <div className="text-center mt-4">
              <Link href="/forgot-password" className="text-sm text-primary-red hover:text-primary-darkRed">
                Forgot Password?
              </Link>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-neutral-medium mt-6">
              Don't have an account?{' '}
              <Link href="/signup" className="text-[#305c4d] font-semibold hover:text-[#dbb016]">
                Sign Up
              </Link>
            </p>

            {/* Admin Login Credentials */}
            <div className="mt-8 pt-6 border-t border-neutral-border">
              <p className="text-sm text-neutral-medium text-center mb-4">Demo Admin Credentials:</p>
              <div className="bg-neutral-light p-4 rounded-lg text-sm space-y-2">
                <p><strong>Email:</strong> admin@futuretitans.com</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

