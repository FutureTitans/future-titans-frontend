'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { getUser } from '@/lib/auth';
import FaceRegistration from './FaceRegistration';
import FaceLoginVerification from './FaceLoginVerification';
import LoadingSpinner from './LoadingSpinner';

const FACE_SESSION_KEY = 'moduleFaceVerifiedAt';
const SESSION_MS = 60 * 60 * 1000; // 1 hour

function sessionValid() {
  if (typeof window === 'undefined') return false;
  const ts = sessionStorage.getItem(FACE_SESSION_KEY);
  return ts ? Date.now() - parseInt(ts, 10) < SESSION_MS : false;
}

function stampSession() {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(FACE_SESSION_KEY, String(Date.now()));
  }
}

/**
 * ModuleFaceGuard
 *
 * Wraps module learning pages. On first visit (or after the 1-hour window
 * expires) it shows a face check before revealing content:
 *   - No face stored → FaceRegistration (capture + save descriptor)
 *   - Face stored     → FaceLoginVerification (match against saved descriptor)
 *
 * After a successful check the timestamp is stored in sessionStorage.
 * Subsequent visits within the same hour pass through immediately.
 */
export default function ModuleFaceGuard({ children }) {
  const router = useRouter();
  const { logout } = useAuthStore();
  // 'checking' | 'register' | 'verify' | 'cleared'
  const [status, setStatus] = useState('checking');
  const [savedDescriptor, setSavedDescriptor] = useState(null);

  // Skip face verification entirely for demo accounts
  const currentUser = getUser();
  const isDemoUser = currentUser?.email === 'demo@futuretitans.com';

  useEffect(() => {
    // Demo users bypass face verification completely
    if (isDemoUser) {
      setStatus('cleared');
      return;
    }

    if (sessionValid()) {
      setStatus('cleared');
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const faceData = await auth.getFaceDescriptor();
        if (cancelled) return;
        if (!faceData?.hasDescriptor) {
          setStatus('register');
        } else {
          setSavedDescriptor(faceData.descriptor);
          setStatus('verify');
        }
      } catch {
        // On network/auth error don't block learning; stamp session to avoid loop
        if (!cancelled) {
          stampSession();
          setStatus('cleared');
        }
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const handleRegistered = useCallback(async (descriptor) => {
    try {
      await auth.saveFaceDescriptor(descriptor);
    } catch {
      // Save failed — still allow access so learning isn't blocked
    }
    stampSession();
    setStatus('cleared');
  }, []);

  const handleVerified = useCallback(() => {
    stampSession();
    setStatus('cleared');
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    router.push('/login');
  }, [logout, router]);

  if (status === 'checking') {
    return <LoadingSpinner message="Verifying identity..." />;
  }

  if (status === 'register') {
    return <FaceRegistration onComplete={handleRegistered} />;
  }

  if (status === 'verify') {
    return (
      <FaceLoginVerification
        savedDescriptor={savedDescriptor}
        onVerified={handleVerified}
        onLogout={handleLogout}
      />
    );
  }

  return <>{children}</>;
}
