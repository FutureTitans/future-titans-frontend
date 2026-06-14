'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { setAuthToken, setRefreshToken, setUser } from '@/lib/auth';
import Link from 'next/link';
import { ArrowLeft, Rocket, Loader2, AlertTriangle } from 'lucide-react';

export default function DemoAccessPage() {
  const router = useRouter();
  const { setUser: storeSetUser, setTokens } = useAuthStore();
  const [status, setStatus] = useState('loading'); // 'loading' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loginDemo = async () => {
      try {
        const response = await auth.login({ email: 'demo@futuretitans.com', password: 'demo123' });
        setAuthToken(response.accessToken);
        setRefreshToken(response.refreshToken);
        setUser(response.user);
        storeSetUser(response.user);
        setTokens(response.accessToken, response.refreshToken);

        router.push('/student/dashboard');
      } catch (error) {
        setErrorMsg(error.error || error.message || 'Failed to access demo account');
        setStatus('error');
      }
    };

    loginDemo();
  }, []);

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center relative overflow-hidden px-4 py-8">
      {/* Background blurs */}
      <div className="absolute -top-[15%] -left-[15%] w-[55%] h-[55%] bg-[#F5D76E]/15 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-[15%] -right-[15%] w-[55%] h-[55%] bg-[#D4AF37]/[0.12] rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="w-full max-w-md relative z-10 glass-panel p-8 sm:p-12 text-center shadow-2xl" style={{ borderRadius: '24px' }}>
        {status === 'loading' ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
                <Rocket className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Launching Demo</h1>
            <p className="text-gray-500 mb-8">Setting up your demo experience...</p>
            <div className="flex justify-center">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Demo Unavailable</h1>
            <p className="text-gray-500 mb-4">{errorMsg}</p>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => { setStatus('loading'); location.reload(); }}
                className="glass-button w-full py-3 text-sm"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 text-gray-500 hover:text-[#D4AF37] transition text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
