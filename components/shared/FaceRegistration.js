'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, CheckCircle, AlertCircle, RefreshCw, Shield, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/api';

export default function FaceRegistration() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const faceapiRef = useRef(null);

  const [status, setStatus] = useState('loading'); // loading, ready, detecting, capturing, success, error
  const [message, setMessage] = useState('Loading face detection models...');
  const [captureCount, setCaptureCount] = useState(0);
  const [descriptors, setDescriptors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const detectIntervalRef = useRef(null);

  const REQUIRED_CAPTURES = 3;

  // Load face-api.js models
  useEffect(() => {
    let mounted = true;

    const loadModels = async () => {
      try {
        const faceapi = await import('face-api.js');
        faceapiRef.current = faceapi;

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        ]);

        if (!mounted) return;
        setStatus('ready');
        setMessage('Camera access required. Please allow camera permissions.');
        startCamera();
      } catch (err) {
        console.error('Failed to load face models:', err);
        if (mounted) {
          setStatus('error');
          setMessage('Failed to load face detection models. Please refresh.');
        }
      }
    };

    loadModels();

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
          setStatus('detecting');
          setMessage('Position your face in the center. Keep still.');
          startDetectionLoop();
        };
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      setStatus('error');
      setMessage('Camera access denied. Please enable camera permissions and refresh.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startDetectionLoop = () => {
    if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);

    detectIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || !faceapiRef.current) return;
      const faceapi = faceapiRef.current;

      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      setFaceDetected(detections.length === 1);

      if (detections.length > 1) {
        setMessage('Multiple faces detected. Please ensure only your face is visible.');
      } else if (detections.length === 0) {
        setMessage('No face detected. Please look at the camera.');
      } else {
        setMessage('Face detected! Click "Capture" when ready.');
      }
    }, 500);
  };

  const captureFace = useCallback(async () => {
    if (!videoRef.current || !faceapiRef.current || !faceDetected) return;

    const faceapi = faceapiRef.current;
    setStatus('capturing');
    setMessage('Capturing...');

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setStatus('detecting');
      setMessage('Capture failed. Please hold still and try again.');
      return;
    }

    const newDescriptors = [...descriptors, Array.from(detection.descriptor)];
    setDescriptors(newDescriptors);
    const newCount = captureCount + 1;
    setCaptureCount(newCount);

    if (newCount >= REQUIRED_CAPTURES) {
      // Average the descriptors for robustness
      if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
      setStatus('capturing');
      setMessage('Processing your face data...');
      await submitFaceData(newDescriptors);
    } else {
      setStatus('detecting');
      setMessage(`Captured ${newCount}/${REQUIRED_CAPTURES}. Slightly move your head and capture again.`);
    }
  }, [faceDetected, descriptors, captureCount]);

  const submitFaceData = async (allDescriptors) => {
    setIsSubmitting(true);
    try {
      // Average the descriptors
      const avgDescriptor = new Array(128).fill(0);
      allDescriptors.forEach(desc => {
        desc.forEach((val, i) => {
          avgDescriptor[i] += val;
        });
      });
      avgDescriptor.forEach((val, i) => {
        avgDescriptor[i] = val / allDescriptors.length;
      });

      await auth.registerFace(avgDescriptor);

      stopCamera();
      setStatus('success');
      setMessage('Face registered successfully!');

      // Update local user data
      const storedUser = JSON.parse(localStorage.getItem('future_titans_user') || '{}');
      storedUser.faceRegistered = true;
      localStorage.setItem('future_titans_user', JSON.stringify(storedUser));

      // Also set the current session as verified so FaceMonitor starts immediately
      sessionStorage.setItem('ft_face_verified', 'true');
      sessionStorage.setItem('ft_face_descriptor', JSON.stringify(avgDescriptor));
      sessionStorage.setItem('ft_face_threshold', '0.5');

      setTimeout(() => {
        router.push('/student/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Failed to register face:', err);
      setStatus('error');
      setMessage('Failed to save face data. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    stopCamera();
    if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
    router.push('/student/dashboard');
  };

  const handleRetry = () => {
    setDescriptors([]);
    setCaptureCount(0);
    setStatus('detecting');
    setMessage('Position your face in the center. Keep still.');
    startCamera();
    startDetectionLoop();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background */}
      <div className="absolute top-[-15%] right-[-15%] w-[55%] h-[55%] bg-[#F5D76E]/15 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] left-[-15%] w-[55%] h-[55%] bg-[#D4AF37]/12 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 glass-panel overflow-hidden shadow-2xl p-6 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Face Verification Setup</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Register your face for secure identity verification. This ensures only you can access your account.
          </p>
        </div>

        {/* Camera Feed */}
        <div className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden bg-gray-900 mb-6 shadow-xl">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Face guide oval overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`w-48 h-64 border-4 rounded-[50%] transition-all duration-500 ${
                faceDetected
                  ? 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.3)]'
                  : 'border-white/40 animate-pulse'
              }`}
            />
          </div>

          {/* Status indicator */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div
              className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md ${
                faceDetected
                  ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                  : 'bg-red-500/20 text-red-300 border border-red-400/30'
              }`}
            >
              {faceDetected ? '● Face Detected' : '○ No Face'}
            </div>
            <div className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 text-white backdrop-blur-md border border-white/20">
              {captureCount}/{REQUIRED_CAPTURES} Captures
            </div>
          </div>

          {/* Capture progress dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {Array.from({ length: REQUIRED_CAPTURES }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i < captureCount
                    ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Success overlay */}
          {status === 'success' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-3 animate-bounce" />
                <p className="text-white font-semibold text-lg">Face Registered!</p>
                <p className="text-white/60 text-sm mt-1">Redirecting to dashboard...</p>
              </div>
            </div>
          )}
        </div>

        {/* Message */}
        <div className={`text-center mb-6 px-4 py-3 rounded-2xl text-sm font-medium ${
          status === 'error'
            ? 'bg-red-50 text-red-600 border border-red-200'
            : status === 'success'
            ? 'bg-green-50 text-green-600 border border-green-200'
            : 'bg-[#F5D76E]/10 text-gray-700 border border-[#D4AF37]/20'
        }`}>
          {status === 'error' && <AlertCircle className="w-4 h-4 inline mr-2" />}
          {status === 'success' && <CheckCircle className="w-4 h-4 inline mr-2" />}
          {message}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {status === 'detecting' && (
            <button
              onClick={captureFace}
              disabled={!faceDetected}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-base font-semibold transition-all ${
                faceDetected
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 hover:scale-[1.02]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Camera className="w-5 h-5" />
              Capture ({captureCount + 1}/{REQUIRED_CAPTURES})
            </button>
          )}

          {status === 'error' && (
            <button
              onClick={handleRetry}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white text-base font-semibold shadow-xl hover:scale-[1.02] transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
          )}

          {status !== 'success' && status !== 'capturing' && (
            <button
              onClick={handleSkip}
              className="flex-1 sm:flex-none sm:px-8 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white/60 text-gray-500 text-sm font-medium border border-gray-200 hover:bg-white/80 transition-all"
            >
              Skip for now
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Info text */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Your face data is securely stored and used only for identity verification on this platform.
        </p>
      </div>
    </div>
  );
}
