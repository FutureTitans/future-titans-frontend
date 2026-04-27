'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { auth } from '@/lib/api';
import { getUser } from '@/lib/auth';
import FreezeOverlay from './FreezeOverlay';

const VERIFY_INTERVAL_MS = 50 * 1000; // 10 seconds for testing
const EUCLIDEAN_THRESHOLD = 0.55;

// Pages where face verification should NOT run
const EXCLUDED_PATHS = [
  '/', '/login', '/signup', '/forgot-password', '/reset-password',
  '/admin', '/association', '/school-poc',
];

function isExcludedPath(pathname) {
  if (!pathname) return false;
  return EXCLUDED_PATHS.some(p =>
    pathname === p || pathname.startsWith(p + '/')
  );
}

/**
 * FaceVerificationProvider
 *
 * Wraps student pages. On mount (or when navigating to a student route), 
 * fetches the saved face descriptor, starts a background camera, and periodically
 * does a silent face check. If it fails, the site freezes via FreezeOverlay.
 */
export default function FaceVerificationProvider({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isFrozen, setFrozen, logout } = useAuthStore();
  const [savedDescriptor, setSavedDescriptor] = useState(null);
  const [isStudentWithFace, setIsStudentWithFace] = useState(false);

  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const faceapiRef = useRef(null);
  const intervalRef = useRef(null);
  const initInProgressRef = useRef(false);

  const stopSystem = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.parentNode) {
      videoRef.current.parentNode.removeChild(videoRef.current);
      videoRef.current = null;
    }
    setIsStudentWithFace(false);
    setSavedDescriptor(null);
  }, []);

  // Handle route changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if we're on an excluded path
    if (isExcludedPath(pathname)) {
      stopSystem();
      return;
    }

    const user = getUser();
    if (!user || user.role !== 'student') {
      stopSystem();
      return;
    }

    // If system is already running or initializing, do nothing
    if (streamRef.current || initInProgressRef.current) return;

    let cancelled = false;

    const initSystem = async () => {
      initInProgressRef.current = true;
      try {
        // Fetch saved face descriptor
        const faceData = await auth.getFaceDescriptor();
        if (!faceData?.hasDescriptor || !faceData.descriptor) {
          initInProgressRef.current = false;
          return;
        }

        if (cancelled) return;
        const descriptor = Float32Array.from(faceData.descriptor);
        setSavedDescriptor(descriptor);
        setIsStudentWithFace(true);

        // Load face-api.js
        const faceapi = await import('face-api.js');
        faceapiRef.current = faceapi;

        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        if (cancelled) return;

        // Start a background camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } },
        });

        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;

        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        video.style.left = '-9999px';
        video.style.width = '320px';
        video.style.height = '240px';
        video.style.opacity = '0';
        video.style.pointerEvents = 'none';
        document.body.appendChild(video);

        // Ensure video is playing before capturing frames
        await video.play().catch(e => console.warn('Background video play failed:', e));
        videoRef.current = video;

        if (cancelled) {
          stopSystem();
          return;
        }

        // Start periodic verification
        intervalRef.current = setInterval(() => {
          verifyFace(descriptor);
        }, VERIFY_INTERVAL_MS);

      } catch (err) {
        console.warn('FaceVerificationProvider init error:', err);
      } finally {
        initInProgressRef.current = false;
      }
    };

    initSystem();

    return () => {
      cancelled = true;
    };
  }, [pathname, stopSystem]);

  // Clean up completely on unmount
  useEffect(() => {
    return () => {
      stopSystem();
    };
  }, [stopSystem]);

  const euclideanDistance = (a, b) => {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += (a[i] - b[i]) ** 2;
    }
    return Math.sqrt(sum);
  };

  const verifyFace = useCallback(async (descriptor) => {
    const desc = descriptor || savedDescriptor;
    if (!faceapiRef.current || !videoRef.current || !desc) return;
    const faceapi = faceapiRef.current;

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        console.warn('Silent check: No face detected. Freezing...');
        setFrozen(true);
        return;
      }

      const distance = euclideanDistance(desc, detection.descriptor);
      if (distance > EUCLIDEAN_THRESHOLD) {
        console.warn('Silent check: Face mismatch! Distance:', distance, '. Freezing...');
        setFrozen(true);
      } else {
        console.log('Silent check passed. Distance:', distance);
      }
    } catch (err) {
      console.warn('Face verification check failed:', err);
      setFrozen(true);
    }
  }, [savedDescriptor, setFrozen]);

  const handleVerify = useCallback(async () => {
    if (!faceapiRef.current || !videoRef.current || !savedDescriptor) {
      throw 'Face verification system not ready. Please try again.';
    }
    const faceapi = faceapiRef.current;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      throw 'No face detected. Please position your face in front of the camera.';
    }

    const distance = euclideanDistance(savedDescriptor, detection.descriptor);
    if (distance > EUCLIDEAN_THRESHOLD) {
      throw 'Face does not match the registered user. Access denied.';
    }

    setFrozen(false);
  }, [savedDescriptor, setFrozen]);

  const handleLogout = useCallback(async () => {
    stopSystem();
    await logout();
    router.push('/login');
  }, [logout, router, stopSystem]);

  // If not a student with face registered, just render children
  if (!isStudentWithFace) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      {isFrozen && (
        <FreezeOverlay
          onVerify={handleVerify}
          onLogout={handleLogout}
          stream={streamRef.current}
        />
      )}
    </>
  );
}
