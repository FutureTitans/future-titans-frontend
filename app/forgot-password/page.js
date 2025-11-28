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
      
      // Show the reset link if provided (for now, until email is implemented)
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
    <div className="min-h-screen bg-gradient-white-light flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="container-lg py-6">
          <Link href="/login" className="flex items-center gap-2 text-primary-red hover:text-primary-darkRed transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="card">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-primary-lightRed rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary-red" />
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Forgot Password?</h1>
              <p className="text-neutral-medium">Enter your email and we'll send you a reset link</p>
            </div>

            {error && (
              <div className="bg-semantic-error bg-opacity-10 border border-semantic-error text-semantic-error px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-semantic-success bg-opacity-10 border border-semantic-success text-semantic-success px-4 py-3 rounded-lg mb-6 whitespace-pre-line">
                {message}
                {message.includes('Reset Link:') && (
                  <div className="mt-3">
                    <a 
                      href={message.match(/Reset Link: (https?:\/\/[^\s]+)/)?.[1]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-darkRed transition-colors text-sm font-semibold"
                    >
                      Open Reset Password Page
                    </a>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-neutral-border rounded-lg focus:outline-none focus:border-primary-red focus:ring-2 focus:ring-primary-red focus:ring-opacity-20"
                  disabled={isLoading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:bg-primary-darkRed transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-primary-red hover:text-primary-darkRed">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

