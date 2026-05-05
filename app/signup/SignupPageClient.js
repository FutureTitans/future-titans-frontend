'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken, setRefreshToken, setUser } from '@/lib/auth';
import { Eye, EyeOff, ArrowLeft, Sparkles } from 'lucide-react';
import FaceRegistration from '@/components/shared/FaceRegistration';

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
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
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

  // Face registration state
  const [showFaceRegistration, setShowFaceRegistration] = useState(false);
  const [signupResponse, setSignupResponse] = useState(null);

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
      // Store tokens immediately so face registration API call works
      setAuthToken(response.accessToken);
      setRefreshToken(response.refreshToken);
      storeSetUser(response.user);
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);

      // Save signup response for after face registration
      setSignupResponse(response);

      // Show face registration for students
      setShowFaceRegistration(true);
    } catch (error) {
      setErrors({ submit: error?.error || error?.message || (typeof error === 'string' ? error : 'Signup failed') });
    } finally {
      setIsLoading(false);
    }
  };

  // Called when face registration is complete
  const handleFaceRegistered = async (descriptor) => {
    try {
      await auth.saveFaceDescriptor(descriptor);
    } catch (err) {
      console.warn('Failed to save face descriptor:', err);
    }
    // Navigate to dashboard
    router.push('/student/dashboard');
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12 pt-24">
        {/* Background blobs */}
        <div className="absolute top-[-15%] right-[-15%] w-[55%] h-[55%] bg-[#F5D76E]/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-15%] left-[-15%] w-[55%] h-[55%] bg-[#D4AF37]/12 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-5 gap-0 glass-panel overflow-hidden shadow-2xl">
          {/* Left — Brand panel (desktop only) */}
          <div className="hidden md:flex md:col-span-2 relative overflow-hidden" style={{ borderRadius: '24px 0 0 24px' }}>
            <img src="/students_signup.png" alt="Indian high school students" className="w-full h-full object-cover" />
          </div>

          {/* Right — Form panel */}
          <div className="md:col-span-3 p-6 sm:p-8 md:p-10">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition mb-5 group text-sm">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Create Account</h1>
              <p className="text-gray-500 text-sm">Join Future Titans and start your innovation journey</p>
              {initialSlug && (
                <div className="mt-3 inline-block bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full px-4 py-1 text-xs text-[#B8952E] font-medium">
                  ✨ Special Offer applied via <span className="font-mono font-bold">{initialSlug}</span>
                </div>
              )}
            </div>

            {errors.submit && (
              <div className="bg-red-50/80 border border-red-200/50 text-red-700 px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 text-sm backdrop-blur-sm">
                <span className="text-lg">⚠️</span> {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <InputField label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} error={errors.name} disabled={isLoading} />
                <InputField label="Email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} error={errors.email} disabled={isLoading} />
                <InputField label="Phone" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={formData.phone} onChange={handleChange} error={errors.phone} disabled={isLoading} />
                <InputField label="School/Institution or Slug Code" name="school" placeholder="Your School or Slug Code" value={formData.school} onChange={handleChange} error={errors.school} disabled={isLoading} />
                <InputField label="Class/Grade" name="class" placeholder="10th or 1st Year" value={formData.class} onChange={handleChange} error={errors.class} disabled={isLoading} />
                <InputField label="City" name="city" placeholder="Mumbai" value={formData.city} onChange={handleChange} error={errors.city} disabled={isLoading} />
                <InputField label="Country" name="country" placeholder="India" value={formData.country} onChange={handleChange} error={errors.country} disabled={isLoading} />
                <InputField label="Password" name="password" placeholder="••••••••" isPassword value={formData.password} onChange={handleChange} error={errors.password} disabled={isLoading} showPw={showPassword} onTogglePw={() => setShowPassword(!showPassword)} />
                <InputField label="Confirm Password" name="confirmPassword" placeholder="••••••••" isPassword value={formData.confirmPassword} onChange={handleChange} error={errors.confirmPassword} disabled={isLoading} showPw={showConfirmPassword} onTogglePw={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="glass-button w-full py-4 text-base shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 flex justify-center items-center mt-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Login Link */}
            <p className="text-center text-gray-500 mt-6 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-[#D4AF37] font-semibold hover:text-[#B8952E] transition">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Face Registration Modal — shown after successful signup */}
      {showFaceRegistration && (
        <FaceRegistration
          onComplete={handleFaceRegistered}
        />
      )}
    </>
  );
}
