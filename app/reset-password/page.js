'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/api';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await auth.resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      setError(error?.error || error?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-8 sm:py-12 relative">
      <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="w-full max-w-md relative z-10">
        <div className="card">
          <div className="mb-6 sm:mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
              <p className="text-gray-500">Enter your new password</p>
            </div>

            {error && (
              <div className="bg-red-50/80 border border-red-200/50 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50/80 border border-green-200/50 text-green-700 px-4 py-3 rounded-2xl mb-6 text-sm backdrop-blur-sm">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="glass-input"
                    disabled={isLoading || !token}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="glass-input"
                    disabled={isLoading || !token}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="glass-button w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-[#D4AF37] hover:text-[#B8952E] transition font-medium">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
