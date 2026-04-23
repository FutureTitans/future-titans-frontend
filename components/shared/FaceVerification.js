'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, CheckCircle, AlertCircle, RefreshCw, LogOut, ScanFace } from 'lucide-react';
import { auth } from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';

export default function FaceVerification() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceapiRef = useRef(null);

  const [status, setStatus] = useState('loading'); // loading, verifying, success, failed
  const [message, setMessage] = useState('Loading face detection models...');
  const [attempts, setAttempts] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const detectIntervalRef = useRef(null);
  
  // Use refs to avoid stale closures in setInterval
  const storedDescriptorRef = useRef(null);
  const thresholdRef = useRef(0.5);

  const MAX_ATTEMPTS = 3;

  // Euclidean distance for face comparison (runs in browser)
  const euclideanDistance = (desc1, desc2) => {
    let sum = 0;
    for (let i = 0; i < desc1.length; i++) {
      sum += Math.pow(desc1[i] - desc2[i], 2);
    }
    return Math.sqrt(sum);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Load models and fetch stored descriptor in parallel
        const faceapi = await import('face-api.js');
        faceapiRef.current = faceapi;

        const [, descriptorData] = await Promise.all([
          Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
          ]),
          auth.getFaceDescriptor().catch(() => null),
        ]);

        if (!mounted) return;

        if (!descriptorData || !descriptorData.faceDescriptor) {
          // No face registered - redirect to register
          router.push('/face-register');
          return;
        }

        storedDescriptorRef.current = descriptorData.faceDescriptor;
        thresholdRef.current = descriptorData.faceMatchThreshold || 0.5;

        setStatus('verifying');
        setMessage('Look at the camera to verify your identity.');
        startCamera();
      } catch (err) {
        console.error('Init failed:', err);
        if (mounted) {
          setStatus('failed');
          setMessage('Failed to initialize face verification. Please try again.');
        }
      }
    };

    init();

    return () => {
      mounted = false;
      stopCamera();
      if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          startAutoVerification();
        };
      }
    } catch (err) {
      setStatus('failed');
      setMessage('Camera access denied. Please enable camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startAutoVerification = () => {
    if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);

    // Try to verify every 2 seconds automatically
    detectIntervalRef.current = setInterval(async () => {
      await attemptVerification();
    }, 2000);
  };

  const attemptVerification = async () => {
    if (!videoRef.current || !faceapiRef.current || !storedDescriptorRef.current || isScanning) return;

    setIsScanning(true);
    const faceapi = faceapiRef.current;

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage('No face detected. Please look at the camera.');
        setIsScanning(false);
        return;
      }

      const liveDescriptor = Array.from(detection.descriptor);
      const distance = euclideanDistance(liveDescriptor, storedDescriptorRef.current);

      if (distance < thresholdRef.current) {
        // Match!
        if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
        stopCamera();
        setStatus('success');
        setMessage('Identity verified!');

        // Store face verified state
        sessionStorage.setItem('ft_face_verified', 'true');
        // Also store the descriptor for continuous monitoring
        sessionStorage.setItem('ft_face_descriptor', JSON.stringify(storedDescriptorRef.current));
        sessionStorage.setItem('ft_face_threshold', String(thresholdRef.current));

        setTimeout(() => {
          const user = JSON.parse(localStorage.getItem('future_titans_user') || '{}');
          if (user.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/student/dashboard');
          }
        }, 1500);
      } else {
        setAttempts(prev => {
          const newAttempts = prev + 1;
          setMessage(`Face did not match (attempt ${newAttempts}/${MAX_ATTEMPTS}). Try again.`);
          
          if (newAttempts >= MAX_ATTEMPTS) {
            if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
            stopCamera();
            setStatus('failed');
            setMessage('Maximum verification attempts reached. Please login again.');
          }
          return newAttempts;
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
    }

    setIsScanning(false);
  };

  const handleRetry = () => {
    setAttempts(0);
    setStatus('verifying');
    setMessage('Look at the camera to verify your identity.');
    startCamera();
  };

  const handleLogout = async () => {
    stopCamera();
    if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background */}
      <div className="absolute top-[-15%] left-[-15%] w-[55%] h-[55%] bg-[#F5D76E]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[55%] h-[55%] bg-[#D4AF37]/12 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-lg relative z-10 glass-panel overflow-hidden shadow-2xl p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
            status === 'success'
              ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-400/30'
              : status === 'failed'
              ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-400/30'
              : 'bg-gradient-to-br from-[#D4AF37] to-[#B8952E] shadow-[#D4AF37]/30'
          }`}>
            {status === 'success' ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : status === 'failed' ? (
              <AlertCircle className="w-8 h-8 text-white" />
            ) : (
              <ScanFace className="w-8 h-8 text-white" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Face Verification</h1>
          <p className="text-gray-500 text-sm">Confirm your identity to continue</p>
        </div>

        {/* Camera Feed */}
        {(status === 'verifying' || status === 'loading') && (
          <div className="relative mx-auto w-full aspect-[4/3] rounded-3xl overflow-hidden bg-gray-900 mb-6 shadow-xl">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />

            {/* Scanning animation overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Face oval guide */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-52 border-3 border-[#D4AF37]/60 rounded-[50%] animate-pulse" />
              </div>

              {/* Scanning line */}
              {isScanning && (
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent animate-scan-line" />
              )}
            </div>

            {/* Status pill */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <div className="px-4 py-1.5 rounded-full text-xs font-semibold bg-black/40 text-white backdrop-blur-md border border-white/20 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-[#D4AF37] animate-pulse' : 'bg-white/50'}`} />
                {isScanning ? 'Scanning...' : 'Waiting for face'}
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        <div className={`text-center mb-6 px-4 py-3 rounded-2xl text-sm font-medium ${
          status === 'failed'
            ? 'bg-red-50 text-red-600 border border-red-200'
            : status === 'success'
            ? 'bg-green-50 text-green-600 border border-green-200'
            : 'bg-[#F5D76E]/10 text-gray-700 border border-[#D4AF37]/20'
        }`}>
          {message}
        </div>

        {/* Attempt indicators */}
        {status === 'verifying' && (
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-1.5 rounded-full transition-all ${
                  i < attempts ? 'bg-red-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {status === 'failed' && (
            <>
              <button
                onClick={handleRetry}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white text-base font-semibold shadow-xl hover:scale-[1.02] transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/60 text-gray-500 text-sm font-medium border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          )}

          {status === 'success' && (
            <div className="text-center text-gray-400 text-sm">
              Redirecting to dashboard...
            </div>
          )}
        </div>
      </div>

      {/* Scanning line animation CSS */}
      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
          position: absolute;
        }
      `}</style>
    </div>
  );
}
