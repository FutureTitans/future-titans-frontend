'use client';

import { useState, useRef, useEffect } from 'react';
import { Shield, AlertTriangle, LogOut, ScanFace, XCircle } from 'lucide-react';

export default function FreezeOverlay({ onVerify, onLogout, stream }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isVerifying && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(e => console.warn('Preview video play failed:', e));
    }
  }, [isVerifying, stream]);

  const handleVerifyClick = async () => {
    setIsVerifying(true);
    setError(null);

    // Artificial UX delay so user can position themselves
    await new Promise(r => setTimeout(r, 2000));

    try {
      await onVerify();
      // Success unmounts this component
    } catch (errMessage) {
      setError(errMessage);
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
      {/* Animated pulsing border */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 border-4 border-red-500/30 animate-pulse" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse" />
      </div>

      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 shadow-2xl shadow-red-500/10">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-xl ${isVerifying ? 'bg-blue-500/20 shadow-blue-500/30' : 'bg-gradient-to-br from-red-500 to-red-700 shadow-red-500/30 animate-pulse'}`}>
              {isVerifying ? <ScanFace className="w-10 h-10 text-blue-400 animate-bounce" /> : <AlertTriangle className="w-10 h-10 text-white" />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{isVerifying ? 'Verifying...' : 'Session Frozen'}</h2>
            {!isVerifying && (
              <p className="text-gray-400 text-sm leading-relaxed">
                Face verification failed. Your session has been frozen for security. Please verify your identity to continue.
              </p>
            )}
          </div>

          {/* Camera Preview State */}
          {isVerifying ? (
            <div className="mb-6">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/10 shadow-lg">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
                
                {/* Scanning overlay */}
                <div className="absolute inset-0 border-2 border-blue-500/50 rounded-2xl" />
                <div className="absolute left-0 right-0 h-0.5 bg-blue-400 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)] animate-scan-line" />
                
                {/* Face guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-24 h-32 border-2 border-blue-400/40 rounded-[50%] animate-pulse" />
                </div>
              </div>
              <div className="mt-4 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-[progress_2s_ease-in-out_infinite]" />
              </div>
              <p className="text-center text-blue-300 text-xs mt-3 font-medium animate-pulse">Analyzing face features...</p>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 text-sm font-medium">Verification Failed</p>
                      <p className="text-red-400/70 text-xs mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning badge (only show if no explicit error yet) */}
              {!error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-300 text-sm font-medium">Security Alert</p>
                      <p className="text-red-400/70 text-xs mt-1">
                        A different person was detected or no face was found. All interactions are blocked until the registered user verifies their identity.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleVerifyClick}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white text-base font-semibold shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] transition-all"
                >
                  <ScanFace className="w-5 h-5" />
                  Verify My Identity
                </button>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-white/5 text-gray-400 text-sm font-medium border border-white/10 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
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
