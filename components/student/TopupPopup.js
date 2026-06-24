'use client';

import { useState, useEffect } from 'react';
import { aiChat } from '@/lib/api';
import { X } from 'lucide-react';

const PACKAGE_IMAGES = {
  starter: '/starter.png',
  standard: '/standard.png',
  premium: '/premium.png',
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
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(245, 215, 110, 0.10) 100%);
        }
        .topup-option:hover {
          border-color: rgba(212, 175, 55, 0.4) !important;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.18), inset 0 1px 0 rgba(255,255,255,0.4);
          transform: translateY(-1px);
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
      `}</style>

      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xl" />

        {/* Glassmorphism Panel */}
        <div className="topup-glass-panel relative w-full max-w-[420px] rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, rgba(255, 252, 245, 0.55) 0%, rgba(255, 248, 235, 0.50) 50%, rgba(250, 245, 225, 0.45) 100%)',
            backdropFilter: 'blur(40px) saturate(2)',
            WebkitBackdropFilter: 'blur(40px) saturate(2)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.18), 0 8px 32px rgba(212,175,55,0.10), inset 0 1px 1px rgba(255,255,255,0.7), inset 0 -1px 1px rgba(255,255,255,0.15)',
            border: '1px solid rgba(255, 255, 255, 0.55)',
          }}
        >
          {/* Header — frosted gold glass banner */}
          <div className="relative px-6 py-5 text-center"
            style={{
              background: 'linear-gradient(to right, rgba(173, 142, 78, 0.75) 0%, rgba(210, 222, 130, 0.70) 100%)',
              backdropFilter: 'blur(20px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(212,175,55,0.1)',
            }}
          >
            <h2 className="text-white font-bold text-xl tracking-tight"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}
            >
              Top Up Word Balance
            </h2>
            <p className="text-white/80 text-sm mt-0.5">
              Continue chatting with Zunnova
            </p>
            {/* Close — simple × without circle */}
            <button
              onClick={onClose}
              className="absolute top-4 right-5 transition-opacity duration-200 hover:opacity-100"
              style={{ opacity: 0.6 }}
            >
              <X className="w-5 h-5 text-white" strokeWidth={2.5} />
            </button>
          </div>

          {/* Package Options */}
          <div className="px-5 pt-4 pb-2 space-y-2.5">
            {packages.map((pkg) => {
              const iconSrc = PACKAGE_IMAGES[pkg.id] || PACKAGE_IMAGES.starter;
              const perAsk = Math.round(pkg.words / 100);
              const isStandard = pkg.id === 'standard';
              return (
                <button
                  key={pkg.id}
                  onClick={() => handlePurchase(pkg)}
                  disabled={loading}
                  className={`topup-option w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-left cursor-pointer ${
                    loading && selectedPkg === pkg.id ? 'opacity-60' : ''
                  }`}
                  style={{
                    background: isStandard
                      ? 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(245,215,110,0.06) 100%)'
                      : 'rgba(255,255,255,0.35)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: isStandard
                      ? '1px solid rgba(212, 175, 55, 0.25)'
                      : '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(255,255,255,0.2)',
                  }}
                >
                  {/* Package icon image */}
                  <img
                    src={iconSrc}
                    alt={pkg.label}
                    className="w-10 h-10 flex-shrink-0 object-contain relative z-10"
                  />

                  {/* Text */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[15px]"
                        style={{ color: '#000' }}
                      >
                        {pkg.label}
                      </span>
                      {isStandard && (
                        <span className="text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, #C5A028 0%, #B8952E 100%)',
                            color: 'white',
                            letterSpacing: '0.05em',
                          }}
                        >
                          POPULAR
                        </span>
                      )}
                    </div>
                    <p className="text-[13px]"
                      style={{ color: '#000' }}
                    >
                      {pkg.words.toLocaleString()} words (~{perAsk} asks)
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0 relative z-10">
                    <span className="text-xl font-bold"
                      style={{ color: '#000' }}
                    >
                      Rs.{pkg.price}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="px-6 pt-2 pb-5">
            <p className="text-[11px] text-center leading-relaxed italic"
              style={{ color: 'rgba(120, 100, 60, 0.45)' }}
            >
              1 ask = ~100 words (50 input + 50 output). Balance never expires.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
