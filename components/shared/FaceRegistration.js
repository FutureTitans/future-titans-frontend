'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ScanFace, Camera, CheckCircle2, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

/**
 * FaceRegistration — shown after signup form submission for students.
 * Loads face-api.js models, opens camera with live preview,
 * captures a face descriptor (128-float array), and calls onComplete(descriptor).
 */
export default function FaceRegistration({ onComplete, onSkip }) {
  const [stage, setStage] = useState('loading'); // loading | ready | scanning | success | error
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const faceapiRef = useRef(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Load face-api.js models
  useEffect(() => {
    let cancelled = false;
    const loadModels = async () => {
      try {
        setLoadProgress(10);
        const faceapi = await import('face-api.js');
        faceapiRef.current = faceapi;
        setLoadProgress(30);

        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        if (cancelled) return;
        setLoadProgress(55);

        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        if (cancelled) return;
        setLoadProgress(75);

        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        if (cancelled) return;
        setLoadProgress(100);

        // Start camera
        await startCamera();
        if (!cancelled) setStage('ready');
      } catch (err) {
        console.error('Face model loading failed:', err);
        if (!cancelled) {
          setError('Failed to load face recognition models. Please check your connection and try again.');
          setStage('error');
        }
      }
    };

    loadModels();
    return () => { cancelled = true; };
  }, []);

  // Attach stream to video element once it mounts
  useEffect(() => {
    if ((stage === 'ready' || stage === 'scanning') && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [stage]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      streamRef.current = stream;
    } catch (err) {
      throw new Error('Camera access denied. Please allow camera access to register your face.');
    }
  };

  const handleCapture = useCallback(async () => {
    if (!faceapiRef.current || !videoRef.current) return;
    const faceapi = faceapiRef.current;

    setStage('scanning');
    setError(null);

    // Countdown 3..2..1
    for (let i = 3; i >= 1; i--) {
      setCountdown(i);
      await new Promise(r => setTimeout(r, 1000));
    }
    setCountdown(null);

    try {
      // Detect face with landmarks and descriptor
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setError('No face detected. Please position your face clearly in the frame and try again.');
        setStage('ready');
        return;
      }

      const descriptor = Array.from(detection.descriptor);
      setStage('success');

      // Brief success UX before calling back
      await new Promise(r => setTimeout(r, 1500));
      onComplete(descriptor);
    } catch (err) {
      console.error('Face detection error:', err);
      setError('Face detection failed. Please try again.');
      setStage('ready');
    }
  }, [onComplete]);

  const handleRetry = async () => {
    setError(null);
    setStage('loading');
    setLoadProgress(0);
    try {
      if (!streamRef.current || !streamRef.current.active) {
        await startCamera();
      }
      setLoadProgress(100);
      setStage('ready');
    } catch (err) {
      setError(err.message);
      setStage('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-lg mx-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60">

          {/* Header */}
          <div className="text-center mb-6">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${
              stage === 'success'
                ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/30'
                : stage === 'error'
                  ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30'
                  : 'bg-gradient-to-br from-[#D4AF37] to-[#B8952E] shadow-[#D4AF37]/30'
            }`}>
              {stage === 'success' ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : stage === 'error' ? (
                <AlertTriangle className="w-10 h-10 text-white" />
              ) : (
                <ScanFace className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {stage === 'loading' ? 'Setting Up Camera...' :
                stage === 'ready' ? 'Register Your Face' :
                  stage === 'scanning' ? 'Scanning...' :
                    stage === 'success' ? 'Face Registered!' :
                      'Setup Error'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {stage === 'loading' ? 'Loading face recognition models. This may take a moment.' :
                stage === 'ready' ? 'Position your face clearly in the frame and click capture.' :
                  stage === 'scanning' ? 'Hold still while we scan your face...' :
                    stage === 'success' ? 'Your face has been registered successfully.' :
                      error || 'Something went wrong.'}
            </p>
          </div>

          {/* Loading Bar */}
          {stage === 'loading' && (
            <div className="mb-6">
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full transition-all duration-700 ease-out relative"
                  style={{ width: `${loadProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 shimmer" />
                </div>
              </div>
              <p className="text-center text-xs text-gray-400 mt-2 font-medium">{loadProgress}% loaded</p>
            </div>
          )}

          {/* Camera Preview */}
          {(stage === 'ready' || stage === 'scanning') && (
            <div className="mb-6">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border-2 border-gray-200 shadow-inner">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Scanning overlay */}
                {stage === 'scanning' && (
                  <>
                    <div className="absolute inset-0 border-2 border-[#D4AF37]/60 rounded-2xl" />
                    <div className="absolute left-0 right-0 h-1 bg-[#D4AF37] shadow-[0_0_12px_3px_rgba(212,175,55,0.6)] animate-face-scan" />
                  </>
                )}

                {/* Countdown overlay */}
                {countdown !== null && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-7xl font-bold text-white drop-shadow-2xl animate-ping-slow">{countdown}</span>
                  </div>
                )}

                {/* Face guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-32 h-40 border-2 rounded-[50%] transition-all duration-500 ${
                    stage === 'scanning' ? 'border-[#D4AF37] animate-pulse' : 'border-white/30'
                  }`} />
                </div>

                {/* Corner guides */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/60 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/60 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/60 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/60 rounded-br-lg" />
              </div>

              {/* Scanning progress bar */}
              {stage === 'scanning' && (
                <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full animate-[progress_3s_ease-in-out_infinite]" />
                </div>
              )}
            </div>
          )}

          {/* Success animation */}
          {stage === 'success' && (
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 animate-bounce" />
              </div>
            </div>
          )}

          {/* Error display */}
          {error && stage !== 'loading' && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {stage === 'ready' && (
              <button
                onClick={handleCapture}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white text-base font-semibold shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] transition-all"
              >
                <Camera className="w-5 h-5" />
                Capture Face
              </button>
            )}

            {stage === 'scanning' && (
              <button
                disabled
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gray-200 text-gray-500 text-base font-semibold cursor-not-allowed"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Scanning...
              </button>
            )}

            {stage === 'error' && (
              <button
                onClick={handleRetry}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white text-base font-semibold shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] transition-all"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes face-scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-face-scan {
          animation: face-scan 2s ease-in-out infinite;
          position: absolute;
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-ping-slow {
          animation: ping-slow 1s ease-in-out;
        }
      `}</style>
    </div>
  );
}
