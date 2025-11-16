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
    <div className="min-h-screen bg-gradient-white-light flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="container-lg py-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-primary-red hover:text-primary-darkRed transition-colors"
          >
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
              <h1 className="text-3xl font-bold gradient-text mb-2">Create Account</h1>
              <p className="text-neutral-medium">Join Future Titans and start your innovation journey</p>
              {initialSlug && (
                <p className="mt-2 text-xs text-neutral-medium">
                  You are registering via a special school link (<span className="font-mono">{initialSlug}</span>).
                  Your course fee will be adjusted accordingly.
                </p>
              )}
            </div>

            {errors.submit && (
              <div className="bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error px-4 py-3 rounded-lg mb-6">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20 ${
                    errors.name ? 'border-semantic-error' : 'border-neutral-border'
                  }`}
                  disabled={isLoading}
                />
                {errors.name && <p className="text-semantic-error text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20 ${
                    errors.email ? 'border-semantic-error' : 'border-neutral-border'
                  }`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-semantic-error text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20 ${
                    errors.phone ? 'border-semantic-error' : 'border-neutral-border'
                  }`}
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-semantic-error text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* School */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">School/Institution</label>
                <input
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="Your School"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20 ${
                    errors.school ? 'border-semantic-error' : 'border-neutral-border'
                  }`}
                  disabled={isLoading}
                />
                {errors.school && <p className="text-semantic-error text-sm mt-1">{errors.school}</p>}
              </div>

              {/* City & Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20 ${
                      errors.city ? 'border-semantic-error' : 'border-neutral-border'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.city && <p className="text-semantic-error text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20 ${
                      errors.country ? 'border-semantic-error' : 'border-neutral-border'
                    }`}
                    disabled={isLoading}
                  />
                  {errors.country && <p className="text-semantic-error text-sm mt-1">{errors.country}</p>}
                </div>
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20 ${
                      errors.confirmPassword ? 'border-semantic-error' : 'border-neutral-border'
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-medium"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-semantic-error text-sm mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:bg-primary-darkRed transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-neutral-medium mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-red font-semibold hover:text-primary-darkRed">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


