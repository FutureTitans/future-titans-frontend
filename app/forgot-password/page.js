'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await auth.forgotPassword({ email });
      let messageText = response.message || 'If an account with that email exists, a password reset link has been sent.';

      if (response.resetLink) {
        messageText += `\n\nReset Link: ${response.resetLink}\n\nClick the link above or copy it to reset your password.`;
      }

      setMessage(messageText);
    } catch (error) {
      setError(error?.error || error?.message || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="glass-strong border-b border-white/20">
        <div className="container-lg py-5">
          <Link href="/login" className="flex items-center gap-2 text-[#D4AF37] hover:text-[#B8952E] transition-colors text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-500">Enter your email and we'll send you a reset link</p>
            </div>

            {error && (
              <div className="bg-red-50/80 border border-red-200/50 text-red-700 px-4 py-3 rounded-2xl mb-6 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50/80 border border-green-200/50 text-green-700 px-4 py-3 rounded-2xl mb-6 text-sm whitespace-pre-line backdrop-blur-sm">
                {message}
                {message.includes('Reset Link:') && (
                  <div className="mt-3">
                    <a
                      href={message.match(/Reset Link: (https?:\/\/[^\s]+)/)?.[1]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block glass-button px-4 py-2 text-sm"
                    >
                      Open Reset Password Page
                    </a>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="glass-input"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="glass-button w-full py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
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
    </div>
  );
}
