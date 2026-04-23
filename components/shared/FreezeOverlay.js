'use client';

import { Shield, AlertTriangle, LogOut, ScanFace, RefreshCw } from 'lucide-react';

export default function FreezeOverlay({ onVerify, onLogout }) {
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
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-xl shadow-red-500/30 animate-pulse">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Session Frozen</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Face verification failed. Your session has been frozen for security.
              Please verify your identity to continue.
            </p>
          </div>

          {/* Warning badge */}
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

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onVerify}
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
        </div>
      </div>
    </div>
  );
}
