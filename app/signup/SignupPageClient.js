'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken, setRefreshToken, setUser } from '@/lib/auth';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

function InputField({ label, name, type = 'text', placeholder, isPassword = false, value, onChange, error, disabled, showPw, onTogglePw }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">{label}</label>
      <div className="relative">
        <input
          type={isPassword ? (showPw ? 'text' : 'password') : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`glass-input ${error ? 'error' : ''}`}
          disabled={disabled}
        />
        {isPassword && (
          <button
            type="button"
            onClick={onTogglePw}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 transition rounded-lg"
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
    </div>
  );
}

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
    class: '',
    section: '',
    rollNumber: '',
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
    if (!formData.phone) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit Indian phone number';
    }
    if (!formData.school) newErrors.school = 'School is required';
    if (!formData.class) newErrors.class = 'Class is required';
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
      setUser(response.user);
      router.push('/student/dashboard');
    } catch (err) {
      const errorMessage = err?.error || err?.response?.data?.error || err?.message || (typeof err === 'string' ? err : 'Signup failed. Please try again.');
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center relative overflow-hidden px-4 py-6 sm:py-10">
      <div className="absolute -top-[15%] -right-[15%] w-[55%] h-[55%] bg-[#F5D76E]/15 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-[15%] -left-[15%] w-[55%] h-[55%] bg-[#D4AF37]/[0.12] rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-5 gap-0 glass-panel overflow-hidden shadow-2xl">
        <div className="hidden md:flex md:col-span-2 relative overflow-hidden" style={{ borderRadius: '24px 0 0 24px' }}>
          <img src="/students_signup.png" alt="Students working together on innovation projects" className="w-full h-full object-cover" />
        </div>

        <div className="md:col-span-3 p-5 sm:p-8 md:p-10">
          <div className="mb-5">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition mb-4 group text-sm">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <img src="/logo.png" alt="Youngpreneurs" className="h-12 sm:h-14 w-auto object-contain mb-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Create Account</h1>
            <p className="text-gray-500 text-sm">Join Future Titans and start your innovation journey</p>
            {initialSlug && (
              <div className="mt-3 inline-block bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1 text-xs text-[#B8952E] font-medium">
                Special Offer applied via <span className="font-mono font-bold">{initialSlug}</span>
              </div>
            )}
          </div>

          {errors.submit && (
            <div className="bg-red-50/80 border border-red-200/50 text-red-700 px-4 py-3 rounded-2xl mb-5 text-sm backdrop-blur-sm" role="alert">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} error={errors.name} disabled={isLoading} />
              <InputField label="Email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} error={errors.email} disabled={isLoading} />
              <InputField label="Phone" name="phone" type="tel" placeholder="98XXXXXXXX" value={formData.phone} onChange={handleChange} error={errors.phone} disabled={isLoading} />
              <InputField label="School/Institution or Slug Code" name="school" placeholder="Your School or Slug Code" value={formData.school} onChange={handleChange} error={errors.school} disabled={isLoading} />
              <div>
                <label htmlFor="signup-class" className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Class/Grade</label>
                <select
                  id="signup-class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={`glass-input ${errors.class ? 'error' : ''}`}
                >
                  <option value="">Select your class</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
                {errors.class && <p className="text-red-500 text-xs mt-1.5 ml-1">{errors.class}</p>}
              </div>
              <InputField label="Section" name="section" placeholder="e.g. A, B, C" value={formData.section} onChange={handleChange} error={errors.section} disabled={isLoading} />
              <InputField label="Roll Number" name="rollNumber" placeholder="e.g. 42" value={formData.rollNumber} onChange={handleChange} error={errors.rollNumber} disabled={isLoading} />
              <InputField label="City" name="city" placeholder="Mumbai" value={formData.city} onChange={handleChange} error={errors.city} disabled={isLoading} />
              <InputField label="Country" name="country" placeholder="India" value={formData.country} onChange={handleChange} error={errors.country} disabled={isLoading} />
              <InputField label="Password" name="password" placeholder="Min 6 characters" isPassword value={formData.password} onChange={handleChange} error={errors.password} disabled={isLoading} showPw={showPassword} onTogglePw={() => setShowPassword(!showPassword)} />
              <InputField label="Confirm Password" name="confirmPassword" placeholder="Re-enter password" isPassword value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} disabled={isLoading} showPw={showConfirmPassword} onTogglePw={() => setShowConfirmPassword(!showConfirmPassword)} />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="glass-button w-full py-4 text-base shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-5 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-[#D4AF37] font-semibold hover:text-[#B8952E] transition">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
