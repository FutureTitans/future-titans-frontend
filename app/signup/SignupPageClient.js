'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken, setRefreshToken, setUser } from '@/lib/auth';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function SignupPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get('slug') || '';
  const { setUser: storeSetUser, setTokens } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    city: '',
    country: '',
    password: '',
    confirmPassword: '',
    schoolSlug: initialSlug,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.school) newErrors.school = 'School is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    try {
      const response = await auth.signup(formData);
      setAuthToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      storeSetUser(response.user);
      setTokens(response.accessToken, response.refreshToken);
      router.push('/student/dashboard');
    } catch (error) {
      setErrors({ submit: error.message || 'Signup failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-200/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary-red transition mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-lg text-gray-600">Join Future Titans and start your innovation journey</p>
          {initialSlug && (
            <div className="mt-4 inline-block bg-amber-50 border border-amber-200 rounded-full px-4 py-1 text-sm text-amber-800">
              ✨ Special Offer applied via <span className="font-mono font-bold">{initialSlug}</span>
            </div>
          )}
        </div>

        <div className="glass-panel p-8 md:p-10 shadow-2xl">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
              <span className="text-xl">⚠️</span> {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-5 py-4 bg-white/50 border backdrop-blur-sm rounded-xl focus:outline-none focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 transition-all ${errors.name ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                    }`}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full px-5 py-4 bg-white/50 border backdrop-blur-sm rounded-xl focus:outline-none focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 transition-all ${errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                    }`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className={`w-full px-5 py-4 bg-white/50 border backdrop-blur-sm rounded-xl focus:outline-none focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 transition-all ${errors.phone ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                    }`}
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1 ml-1">{errors.phone}</p>}
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">School/Institution</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Your School"
                  className={`w-full px-5 py-4 bg-white/50 border backdrop-blur-sm rounded-xl focus:outline-none focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 transition-all ${errors.school ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                    }`}
                  disabled={isLoading}
                />
                {errors.school && <p className="text-red-500 text-sm mt-1 ml-1">{errors.school}</p>}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Mumbai"
                  className={`w-full px-5 py-4 bg-white/50 border backdrop-blur-sm rounded-xl focus:outline-none focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 transition-all ${errors.city ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                    }`}
                  disabled={isLoading}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1 ml-1">{errors.city}</p>}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                  className={`w-full px-5 py-4 bg-white/50 border backdrop-blur-sm rounded-xl focus:outline-none focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 transition-all ${errors.country ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                    }`}
                  disabled={isLoading}
                />
                {errors.country && <p className="text-red-500 text-sm mt-1 ml-1">{errors.country}</p>}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-5 py-4 bg-white/50 border backdrop-blur-sm rounded-xl focus:outline-none focus:border-primary-red focus:ring-4 focus:ring-primary-red/10 transition-all ${errors.confirmPassword ? 'border-red-400 bg-red-50/50' : 'border-gray-200'
                      }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="glass-button w-full py-4 text-lg shadow-xl shadow-red-500/20 hover:shadow-red-500/30 flex justify-center items-center mt-8"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-neutral-500 mt-8">
            Already have an account?{' '}
            <Link href="/login" className="text-primary-red font-semibold hover:text-red-700 transition">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
