'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { getUser } from '@/lib/auth';
import FreezeOverlay from './FreezeOverlay';

// Paths that should NOT trigger face monitoring
const EXCLUDED_PATHS = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/face-register',
  '/face-verify',
  '/admin',
  '/association',
  '/school-poc',
];

const CHECK_INTERVAL_MS = 60000; // 1 minute
const NO_FACE_TIMEOUT_MS = 120000; // 2 minutes
const MAX_CONSECUTIVE_FAILURES = 2;

export default function FaceMonitor() {
  const pathname = usePathname();
  const router = useRouter();
  const { isFrozen, setFrozen, setFaceVerified } = useAuthStore();

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceapiRef = useRef(null);
  const checkIntervalRef = useRef(null);
  const noFaceTimerRef = useRef(null);
  const consecutiveFailsRef = useRef(0);
  const storedDescriptorRef = useRef(null);
  const thresholdRef = useRef(0.5);
  const modelsLoadedRef = useRef(false);
  const isVerifyingRef = useRef(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Euclidean distance for client-side face comparison
  const euclideanDistance = useCallback((desc1, desc2) => {
    let sum = 0;
    for (let i = 0; i < desc1.length; i++) {
      sum += Math.pow(desc1[i] - desc2[i], 2);
    }
    return Math.sqrt(sum);
  }, []);

  // Check if the current path should be monitored
  const shouldMonitor = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const user = getUser();
    if (!user) return false;

    // Only monitor students
    if (user.role !== 'student') return false;

    // Check if face was verified this session
    if (sessionStorage.getItem('ft_face_verified') !== 'true') return false;

    // Check excluded paths
    for (const excluded of EXCLUDED_PATHS) {
      if (pathname === excluded || pathname.startsWith(excluded + '/')) return false;
    }

    return true;
  }, [pathname]);

  // Initialize monitor
  useEffect(() => {
    if (!shouldMonitor()) {
      cleanup();
      setIsActive(false);
      return;
    }

    // Get stored descriptor from session (set during face-verify)
    const storedDesc = sessionStorage.getItem('ft_face_descriptor');
    const storedThreshold = sessionStorage.getItem('ft_face_threshold');

    if (!storedDesc) {
      setIsActive(false);
      return;
    }

    try {
      storedDescriptorRef.current = JSON.parse(storedDesc);
      thresholdRef.current = parseFloat(storedThreshold) || 0.5;
    } catch {
      setIsActive(false);
      return;
    }

    setIsActive(true);
    initMonitor();

    return () => {
      cleanup();
    };
  }, [pathname, shouldMonitor]);

  const initMonitor = async () => {
    try {
      // Load models if not loaded
      if (!modelsLoadedRef.current) {
        const faceapi = await import('face-api.js');
        faceapiRef.current = faceapi;

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);
        modelsLoadedRef.current = true;
      }

      // Start hidden camera
      await startHiddenCamera();
      startCheckInterval();
    } catch (err) {
      console.warn('[FaceMonitor] Init failed:', err.message);
    }
  };

  const startHiddenCamera = async () => {
    if (streamRef.current) return; // Already running

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });
      streamRef.current = stream;

      // Create or reuse hidden video element
      if (!videoRef.current) {
        const video = document.createElement('video');
        video.setAttribute('autoplay', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        video.style.position = 'fixed';
        video.style.top = '-9999px';
        video.style.left = '-9999px';
        video.style.width = '1px';
        video.style.height = '1px';
        video.style.opacity = '0';
        video.style.pointerEvents = 'none';
        document.body.appendChild(video);
        videoRef.current = video;
      }

      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch (err) {
      console.warn('[FaceMonitor] Camera access failed:', err.message);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current && videoRef.current.parentNode) {
      videoRef.current.parentNode.removeChild(videoRef.current);
      videoRef.current = null;
    }
  };

  const startCheckInterval = () => {
    if (checkIntervalRef.current) clearInterval(checkIntervalRef.current);

    // First check after a delay, then every CHECK_INTERVAL_MS
    checkIntervalRef.current = setInterval(() => {
      performCheck();
    }, CHECK_INTERVAL_MS);
  };

  const performCheck = async () => {
    if (!videoRef.current || !faceapiRef.current || !storedDescriptorRef.current || isVerifyingRef.current) return;

    isVerifyingRef.current = true;

    try {
      const faceapi = faceapiRef.current;

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.3 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        // No face detected — start no-face timer
        if (!noFaceTimerRef.current) {
          noFaceTimerRef.current = setTimeout(() => {
            triggerFreeze();
          }, NO_FACE_TIMEOUT_MS);
        }
        isVerifyingRef.current = false;
        return;
      }

      // Face found — clear no-face timer
      if (noFaceTimerRef.current) {
        clearTimeout(noFaceTimerRef.current);
        noFaceTimerRef.current = null;
      }

      const liveDescriptor = Array.from(detection.descriptor);
      const distance = euclideanDistance(liveDescriptor, storedDescriptorRef.current);

      if (distance < thresholdRef.current) {
        // Match — reset failures
        consecutiveFailsRef.current = 0;
      } else {
        // No match — increment failures
        consecutiveFailsRef.current += 1;
        console.warn(`[FaceMonitor] Face mismatch! Distance: ${distance.toFixed(3)}, Threshold: ${thresholdRef.current}, Fails: ${consecutiveFailsRef.current}`);

        if (consecutiveFailsRef.current >= MAX_CONSECUTIVE_FAILURES) {
          triggerFreeze();
        }
      }
    } catch (err) {
      console.warn('[FaceMonitor] Check error:', err.message);
    }

    isVerifyingRef.current = false;
  };

  const triggerFreeze = () => {
    console.warn('[FaceMonitor] FREEZING SESSION');
    setShowOverlay(true);
    setFrozen(true);
    setFaceVerified(false);

    // Stop interval while frozen
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  };

  const handleVerify = async () => {
    // Attempt re-verification
    if (!videoRef.current || !faceapiRef.current || !storedDescriptorRef.current) {
      // Try to restart camera
      await startHiddenCamera();
    }

    isVerifyingRef.current = true;

    try {
      const faceapi = faceapiRef.current;

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert('No face detected. Please ensure your face is visible to the camera.');
        isVerifyingRef.current = false;
        return;
      }

      const liveDescriptor = Array.from(detection.descriptor);
      const distance = euclideanDistance(liveDescriptor, storedDescriptorRef.current);

      if (distance < thresholdRef.current) {
        // Match! Unfreeze
        setShowOverlay(false);
        setFrozen(false);
        setFaceVerified(true);
        consecutiveFailsRef.current = 0;

        if (noFaceTimerRef.current) {
          clearTimeout(noFaceTimerRef.current);
          noFaceTimerRef.current = null;
        }

        // Restart monitoring
        startCheckInterval();
      } else {
        alert('Face verification failed. The detected face does not match the registered user.');
      }
    } catch (err) {
      console.error('[FaceMonitor] Re-verify error:', err);
      alert('Verification failed. Please try again.');
    }

    isVerifyingRef.current = false;
  };

  const handleLogout = async () => {
    cleanup();
    const { logout } = useAuthStore.getState();
    sessionStorage.removeItem('ft_face_verified');
    sessionStorage.removeItem('ft_face_descriptor');
    sessionStorage.removeItem('ft_face_threshold');
    await logout();
    router.push('/login');
  };

  const cleanup = () => {
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
    if (noFaceTimerRef.current) {
      clearTimeout(noFaceTimerRef.current);
      noFaceTimerRef.current = null;
    }
    stopCamera();
  };

  // Don't render anything if not active
  if (!isActive && !showOverlay) return null;

  return (
    <>
      {showOverlay && (
        <FreezeOverlay
          onVerify={handleVerify}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
