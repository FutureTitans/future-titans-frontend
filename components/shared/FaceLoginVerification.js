'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ScanFace, CheckCircle2, AlertTriangle, Loader2, LogOut, Camera } from 'lucide-react';

const EUCLIDEAN_THRESHOLD = 0.45;

/**
 * FaceLoginVerification — shown at login for students who have a saved face descriptor.
 * Opens camera, lets user verify their identity by matching against saved descriptor.
 */
export default function FaceLoginVerification({ savedDescriptor, onVerified, onLogout }) {
  const [stage, setStage] = useState('loading'); // loading | ready | scanning | success | failed
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceapiRef = useRef(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Attach stream to video element once it mounts
  useEffect(() => {
    if ((stage === 'ready' || stage === 'scanning' || stage === 'failed') && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [stage]);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
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
        setLoadProgress(90);

        // Start camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        });
        streamRef.current = stream;

        if (cancelled) return;
        setLoadProgress(100);
        setStage('ready');
      } catch (err) {
        console.error('Face verification init failed:', err);
        if (!cancelled) {
          setError('Failed to initialize camera. Please allow camera access.');
          setStage('failed');
        }
      }
    };

    init();
    return () => { cancelled = true; };
  }, []);

  const euclideanDistance = (a, b) => {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += (a[i] - b[i]) ** 2;
    }
    return Math.sqrt(sum);
  };

  const handleVerify = useCallback(async () => {
    if (!faceapiRef.current || !videoRef.current) return;
    const faceapi = faceapiRef.current;

    setStage('scanning');
    setError(null);

    // Brief delay for positioning
    await new Promise(r => setTimeout(r, 2000));

    try {
      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.8 }))
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setError('No face detected. Please position your face in the frame and try again.');
        setStage('ready');
        return;
      }

      const distance = euclideanDistance(Float32Array.from(savedDescriptor), detection.descriptor);

      if (distance > EUCLIDEAN_THRESHOLD) {
        setError('Face does not match the registered user. Please try again or logout.');
        setStage('failed');
        return;
      }

      // Match!
      setStage('success');
      await new Promise(r => setTimeout(r, 1500));

      // Cleanup camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      onVerified();
    } catch (err) {
      console.error('Verification error:', err);
      setError('Verification failed. Please try again.');
      setStage('ready');
    }
  }, [savedDescriptor, onVerified]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg mx-4 relative z-10">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60">

          {/* Header */}
          <div className="text-center mb-6">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${
              stage === 'success'
                ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-green-500/30'
                : stage === 'failed'
                  ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30 animate-pulse'
                  : 'bg-gradient-to-br from-[#D4AF37] to-[#B8952E] shadow-[#D4AF37]/30'
            }`}>
              {stage === 'success' ? (
                <CheckCircle2 className="w-10 h-10 text-white" />
              ) : stage === 'failed' ? (
                <AlertTriangle className="w-10 h-10 text-white" />
              ) : stage === 'scanning' ? (
                <ScanFace className="w-10 h-10 text-white animate-bounce" />
              ) : (
                <ScanFace className="w-10 h-10 text-white" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {stage === 'loading' ? 'Preparing Verification...' :
                stage === 'ready' ? 'Verify Your Identity' :
                  stage === 'scanning' ? 'Scanning...' :
                    stage === 'success' ? 'Identity Verified!' :
                      'Verification Failed'}
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              {stage === 'loading' ? 'Loading face recognition system...' :
                stage === 'ready' ? 'Position your face in the frame and click verify to continue.' :
                  stage === 'scanning' ? 'Analyzing your face. Hold still...' :
                    stage === 'success' ? 'Welcome back! Redirecting to your dashboard...' :
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
          {(stage === 'ready' || stage === 'scanning' || stage === 'failed') && (
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

                {/* Scanning overlay */}
                {stage === 'scanning' && (
                  <>
                    <div className="absolute inset-0 border-2 border-[#D4AF37]/60 rounded-2xl" />
                    <div className="absolute left-0 right-0 h-1 bg-[#D4AF37] shadow-[0_0_12px_3px_rgba(212,175,55,0.6)] animate-face-scan" />
                  </>
                )}

                {/* Face guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className={`w-32 h-40 border-2 rounded-[50%] transition-all duration-500 ${
                    stage === 'scanning' ? 'border-[#D4AF37] animate-pulse' :
                      stage === 'failed' ? 'border-red-400' : 'border-white/30'
                  }`} />
                </div>

                {/* Corner guides */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#D4AF37]/60 rounded-tl-lg" />
                <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#D4AF37]/60 rounded-tr-lg" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#D4AF37]/60 rounded-bl-lg" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#D4AF37]/60 rounded-br-lg" />
              </div>

              {/* Scanning progress */}
              {stage === 'scanning' && (
                <div className="mt-4 w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full animate-[progress_2s_ease-in-out_infinite]" />
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
          {error && stage === 'failed' && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {(stage === 'ready' || stage === 'failed') && (
              <button
                onClick={handleVerify}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white text-base font-semibold shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] transition-all"
              >
                <Camera className="w-5 h-5" />
                {stage === 'failed' ? 'Try Again' : 'Verify My Face'}
              </button>
            )}

            {stage === 'scanning' && (
              <button
                disabled
                className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gray-200 text-gray-500 text-base font-semibold cursor-not-allowed"
              >
                <Loader2 className="w-5 h-5 animate-spin" />
                Verifying...
              </button>
            )}

            {/* Logout option */}
            {stage !== 'success' && stage !== 'loading' && (
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-50 text-gray-500 text-sm font-medium border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
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
      `}</style>
    </div>
  );
}
