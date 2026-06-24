'use client';

import { useState, useEffect } from 'react';
import { aiChat } from '@/lib/api';
import { X, Zap, Sparkles, Crown } from 'lucide-react';

const PACKAGE_ICONS = {
  starter: Zap,
  standard: Sparkles,
  premium: Crown,
};

export default function TopupPopup({ isOpen, onClose, onSuccess }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    aiChat.getTopupPackages().then(data => setPackages(data.packages || [])).catch(() => {});
  }, [isOpen]);

  const handlePurchase = async (pkg) => {
    if (typeof window === 'undefined' || typeof window.Razorpay === 'undefined') {
      alert('Payment system is still loading. Please wait a moment and try again.');
      return;
    }

    setLoading(true);
    setSelectedPkg(pkg.id);

    try {
      const orderData = await aiChat.initiateTopup(pkg.id);

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Zunnova AI Top-up',
        description: `${pkg.label} - ${pkg.words.toLocaleString()} words`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            const result = await aiChat.verifyTopup({
              ...response,
              packageId: pkg.id,
            });
            onSuccess?.(result.wordBalance);
            onClose();
          } catch (error) {
            console.error('Topup verification failed:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        theme: { color: '#D4AF37' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        setLoading(false);
        setSelectedPkg(null);
      });
      rzp.open();
    } catch (error) {
      console.error('Topup initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPkg(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Inline styles for glassmorphism hover animations */}
      <style jsx>{`
        .topup-option {
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .topup-option::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.0) 0%, rgba(245, 215, 110, 0.0) 100%);
          transition: background 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 0;
        }
        .topup-option:hover::before {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.18) 0%, rgba(245, 215, 110, 0.12) 100%);
        }
        .topup-option:hover {
          border-color: #D4AF37 !important;
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.25), inset 0 1px 0 rgba(255,255,255,0.4);
          transform: translateY(-2px) scale(1.01);
        }
        .topup-option:hover .topup-icon-box {
          background: linear-gradient(135deg, #D4AF37 0%, #F5D76E 100%) !important;
          color: white !important;
          box-shadow: 0 4px 16px rgba(212, 175, 55, 0.4);
        }
        .topup-option:hover .topup-label {
          color: #B8952E !important;
        }
        .topup-option:hover .topup-price {
          color: #D4AF37 !important;
          text-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
        }
        .topup-option:hover .topup-desc {
          color: #8B7A3D !important;
        }
        .topup-option:active {
          transform: translateY(0) scale(0.99);
        }
        .topup-glass-panel {
          animation: topupSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes topupSlideIn {
          0% { opacity: 0; transform: scale(0.92) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes topupShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .topup-shimmer-text {
          background: linear-gradient(
            90deg,
            #D4AF37 0%,
            #F5D76E 25%,
            #D4AF37 50%,
            #F5D76E 75%,
            #D4AF37 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: topupShimmer 4s linear infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

        {/* Glassmorphism Panel */}
        <div className="topup-glass-panel relative w-full max-w-[420px] rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(255,252,242,0.88) 0%, rgba(255,248,230,0.82) 50%, rgba(250,240,210,0.78) 100%)',
            backdropFilter: 'blur(24px) saturate(1.8)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.15), 0 8px 32px rgba(212,175,55,0.12), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(212,175,55,0.1)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
            style={{
              background: 'rgba(0,0,0,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {/* Header */}
          <div className="pt-7 pb-1 px-8 text-center">
            <h2 className="topup-shimmer-text text-2xl font-bold tracking-tight">
              Top Up Word Balance
            </h2>
            <p className="text-sm mt-1.5" style={{ color: 'rgba(120, 100, 60, 0.7)' }}>
              Continue chatting with Zunnova
            </p>
          </div>

          {/* Package Options */}
          <div className="px-6 pt-4 pb-2 space-y-3">
            {packages.map((pkg) => {
              const Icon = PACKAGE_ICONS[pkg.id] || Zap;
              const perAsk = Math.round(pkg.words / 100);
              const isStandard = pkg.id === 'standard';
              return (
                <button
                  key={pkg.id}
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading}
                  className={`topup-option w-full flex items-center gap-4 p-4 rounded-2xl text-left cursor-pointer ${
                    loading && selectedPkg === pkg.id ? 'opacity-60' : ''
                  }`}
                  style={{
                    background: isStandard
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(245,215,110,0.08) 100%)'
                      : 'rgba(255,255,255,0.45)',
                    border: isStandard
                      ? '1.5px solid rgba(212, 175, 55, 0.45)'
                      : '1.5px solid rgba(212, 175, 55, 0.15)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: isStandard
                      ? '0 4px 20px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255,255,255,0.5)'
                      : '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)',
                  }}
                >
                  {/* Icon */}
                  <div
                    className={`topup-icon-box w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300`}
                    style={{
                      background: isStandard
                        ? 'linear-gradient(135deg, #D4AF37 0%, #F5D76E 100%)'
                        : 'rgba(212, 175, 55, 0.1)',
                      color: isStandard ? 'white' : '#C5A028',
                      boxShadow: isStandard ? '0 4px 12px rgba(212,175,55,0.35)' : 'none',
                    }}
                  >
                    <Icon className="w-5 h-5 relative z-10" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="topup-label font-bold text-[15px] transition-colors duration-300"
                        style={{ color: isStandard ? '#9A7B1A' : '#3D3520' }}
                      >
                        {pkg.label}
                      </span>
                      {isStandard && (
                        <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, #D4AF37 0%, #C5A028 100%)',
                            color: 'white',
                            letterSpacing: '0.06em',
                            boxShadow: '0 2px 6px rgba(212,175,55,0.3)',
                          }}
                        >
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="topup-desc text-[13px] transition-colors duration-300"
                      style={{ color: 'rgba(100, 85, 50, 0.6)' }}
                    >
                      {pkg.words.toLocaleString()} words (~{perAsk} asks)
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0 relative z-10">
                    <span className="topup-price text-xl font-bold transition-all duration-300"
                      style={{ color: '#3D3520' }}
                    >
                      Rs.{pkg.price}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="px-6 pt-2 pb-6">
            <p className="text-[11px] text-center leading-relaxed"
              style={{ color: 'rgba(120, 100, 60, 0.5)' }}
            >
              1 ask = ~100 words (50 input + 50 output). Balance never expires.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
