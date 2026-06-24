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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8952E] px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Top Up Word Balance</h2>
            <p className="text-white/80 text-sm">Continue chatting with Zunnova</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {packages.map((pkg) => {
            const Icon = PACKAGE_ICONS[pkg.id] || Zap;
            const perAsk = Math.round(pkg.words / 100);
            return (
              <button
                key={pkg.id}
                onClick={() => handlePurchase(pkg)}
                disabled={loading}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  pkg.id === 'standard'
                    ? 'border-[#D4AF37] bg-[#D4AF37]/5 shadow-md'
                    : 'border-gray-200 hover:border-[#D4AF37]/50'
                } ${loading && selectedPkg === pkg.id ? 'opacity-60' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  pkg.id === 'standard'
                    ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8952E] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{pkg.label}</span>
                    {pkg.id === 'standard' && (
                      <span className="text-[10px] font-bold bg-[#D4AF37] text-white px-1.5 py-0.5 rounded-full">POPULAR</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{pkg.words.toLocaleString()} words (~{perAsk} asks)</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xl font-bold text-gray-900">Rs.{pkg.price}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-6 pb-5">
          <p className="text-xs text-gray-400 text-center">
            1 ask = ~100 words (50 input + 50 output). Balance never expires.
          </p>
        </div>
      </div>
    </div>
  );
}
