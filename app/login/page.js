'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken, setRefreshToken, setUser } from '@/lib/auth';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import FaceRegistration from '@/components/shared/FaceRegistration';
import FaceLoginVerification from '@/components/shared/FaceLoginVerification';

export default function LoginPage() {
  const router = useRouter();
  const { setUser: storeSetUser, setTokens } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Face states
  const [showFaceRegistration, setShowFaceRegistration] = useState(false);
  const [showFaceVerification, setShowFaceVerification] = useState(false);
  const [savedDescriptor, setSavedDescriptor] = useState(null);

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
        // Student — check face descriptor
        try {
          const faceData = await auth.getFaceDescriptor();
          if (!faceData?.hasDescriptor) {
            // No face registered yet — show registration
            setShowFaceRegistration(true);
          } else {
            // Has face — verify identity before allowing in
            setSavedDescriptor(faceData.descriptor);
            setShowFaceVerification(true);
          }
        } catch (faceErr) {
          // If face check fails, just let them in
          console.warn('Face descriptor check failed:', faceErr);
          router.push('/student/dashboard');
        }
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

  // Face registration complete (first time)
  const handleFaceRegistered = async (descriptor) => {
    try {
      await auth.saveFaceDescriptor(descriptor);
    } catch (err) {
      console.warn('Failed to save face descriptor:', err);
    }
    router.push('/student/dashboard');
  };

  // Face verification success (returning user)
  const handleFaceVerified = () => {
    router.push('/student/dashboard');
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
        {/* Background blobs */}
        <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] bg-[#F5D76E]/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-[#D4AF37]/12 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-5xl relative z-10 grid md:grid-cols-2 gap-0 glass-panel overflow-hidden shadow-2xl">
          {/* Left — Brand panel (desktop only) */}
          <div className="hidden md:flex relative overflow-hidden" style={{ borderRadius: '24px 0 0 24px' }}>
            <img src="/students_login.png" alt="Indian school students" className="w-full h-full object-cover" />
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
          </div>
        </div>
      </div>

      {/* Face Registration Modal — shown if student has no face descriptor */}
      {showFaceRegistration && (
        <FaceRegistration
          onComplete={handleFaceRegistered}
        />
      )}

      {/* Face Login Verification — shown if student has face descriptor */}
      {showFaceVerification && savedDescriptor && (
        <FaceLoginVerification
          savedDescriptor={savedDescriptor}
          onVerified={handleFaceVerified}
          onLogout={async () => {
            const store = useAuthStore.getState();
            await store.logout();
            setShowFaceVerification(false);
            setSavedDescriptor(null);
          }}
        />
      )}
    </>
  );
}
