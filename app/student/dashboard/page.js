'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { modules, payment, aiChat } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Trophy, CreditCard, Brain, ArrowRight, Clock, CheckCircle, Play } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [ssiScore, setSSIScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }

    const currentUser = getUser();
    setUser(currentUser);
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [modulesData, paymentData, ssiData] = await Promise.all([
        modules.getAll().catch(() => []),
        payment.getPaymentStatus().catch(() => ({ isPaid: false })),
        aiChat.getSSI().catch(() => ({ overallSSI: 0, breakdown: {} })),
      ]);

      setModulesList(modulesData);
      setPaymentStatus(paymentData);
      setSSIScore(ssiData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      if (typeof window === 'undefined' || typeof window.Razorpay === 'undefined') {
        alert('Payment system is still loading. Please wait a moment and try again.');
        return;
      }

      const orderData = await payment.initiatePayment();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Future Titans',
        description: 'Innovation Challenge Access',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            await payment.verifyPayment(response);
            setPaymentStatus({ isPaid: true });
            fetchDashboardData();
          } catch (error) {
            console.error('Payment verification failed:', error);
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: {
          color: '#DC2626',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-white-light">
      {/* Header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="container-lg py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Welcome back, {user?.name}!</h1>
              <p className="text-neutral-medium">Continue your innovation journey</p>
            </div>
            <Link href="/" className="text-primary-red hover:text-primary-darkRed transition">
              🏠 Home
            </Link>
          </div>
        </div>
      </div>

      <div className="container-lg py-8">
        {/* Payment Status */}
        {!paymentStatus?.isPaid && (
          <div className="card mb-8 border-l-4 border-l-accent-gold bg-accent-gold bg-opacity-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-accent-gold mb-2">🔓 Unlock Full Access</h3>
                <p className="text-neutral-dark">
                  Complete your payment to access all modules and AI features.
                  {paymentStatus?.price && paymentStatus.price !== 999 && (
                    <span className="block text-sm text-neutral-medium mt-1">
                      Special price via school link: <span className="font-semibold">₹{paymentStatus.price}</span> (standard ₹999)
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handlePayment}
                className="bg-accent-gold text-white px-6 py-3 rounded-lg hover:bg-accent-amber transition font-semibold flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay ₹{paymentStatus?.price || 999}
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <BookOpen className="w-12 h-12 text-primary-red mx-auto mb-4" />
            <h3 className="font-bold text-2xl gradient-text">{modulesList.length}</h3>
            <p className="text-neutral-medium">Available Modules</p>
          </div>

          <div className="card text-center">
            <Brain className="w-12 h-12 text-accent-gold mx-auto mb-4" />
            <h3 className="font-bold text-2xl gradient-text">{ssiScore?.overallSSI || 0}</h3>
            <p className="text-neutral-medium">SSI Score</p>
          </div>

          <div className="card text-center">
            <Trophy className="w-12 h-12 text-semantic-success mx-auto mb-4" />
            <h3 className="font-bold text-2xl gradient-text">0</h3>
            <p className="text-neutral-medium">Completed</p>
          </div>

          <div className="card text-center">
            <Clock className="w-12 h-12 text-semantic-info mx-auto mb-4" />
            <h3 className="font-bold text-2xl gradient-text">0h</h3>
            <p className="text-neutral-medium">Time Spent</p>
          </div>
        </div>

        {/* SSI Breakdown */}
        {ssiScore && ssiScore.overallSSI > 0 && (
          <div className="card mb-8">
            <h3 className="font-bold text-lg mb-4">🧠 Your SURGE Progress</h3>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { key: 'selfAwareness', label: 'Self Awareness', icon: '🎯' },
                { key: 'understandingOpportunities', label: 'Understanding', icon: '💡' },
                { key: 'resilience', label: 'Resilience', icon: '💪' },
                { key: 'growthExecution', label: 'Growth', icon: '🚀' },
                { key: 'entrepreneurialLeadership', label: 'Leadership', icon: '👑' },
              ].map((item) => (
                <div key={item.key} className="text-center">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-2xl font-bold gradient-text mb-1">
                    {ssiScore.breakdown?.[item.key] || 0}%
                  </div>
                  <p className="text-sm text-neutral-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modules Grid */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">📚 Learning Modules</h3>
            {paymentStatus?.isPaid && (
              <Link
                href="/student/modules"
                className="text-primary-red hover:text-primary-darkRed transition flex items-center gap-2"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {!paymentStatus?.isPaid ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h4 className="font-bold text-xl mb-2">Modules Locked</h4>
              <p className="text-neutral-medium mb-6">Complete payment to unlock all learning modules</p>
              <button
                onClick={handlePayment}
                className="bg-primary-red text-white px-8 py-3 rounded-lg hover:bg-primary-darkRed transition font-semibold"
              >
                Unlock Now - ₹{paymentStatus?.price || 999}
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {modulesList.slice(0, 4).map((module) => (
                <div
                  key={module._id}
                  className="border border-neutral-border rounded-lg p-6 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {module.mentorProfilePicture && (
                        <img 
                          src={module.mentorProfilePicture} 
                          alt="Mentor" 
                          className="w-12 h-12 rounded-full border-2 border-primary-red object-cover"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      )}
                      <h4 className="font-bold text-lg">{module.title}</h4>
                    </div>
                    <span className="badge badge-success">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Available
                    </span>
                  </div>

                  <p className="text-neutral-medium text-sm mb-4">{module.description}</p>

                  <div className="flex justify-between items-center text-sm text-neutral-medium mb-4">
                    <span>📊 {module.difficulty}</span>
                    <span>⏱️ {module.estimatedCompletionTime} min</span>
                    <span>📖 {module.chapters?.length || 0} chapters</span>
                  </div>

                  <Link
                    href={`/student/modules/${module._id}`}
                    className="w-full bg-primary-red text-white py-2 px-4 rounded-lg hover:bg-primary-darkRed transition text-center font-semibold flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Start Learning
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {paymentStatus?.isPaid && (
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Link href="/student/modules" className="card hover:shadow-lg transition text-center">
              <BookOpen className="w-12 h-12 text-primary-red mx-auto mb-4" />
              <h4 className="font-bold mb-2">Browse Modules</h4>
              <p className="text-neutral-medium text-sm">Explore all available learning content</p>
            </Link>

            <Link href="/student/submission" className="card hover:shadow-lg transition text-center">
              <Trophy className="w-12 h-12 text-accent-gold mx-auto mb-4" />
              <h4 className="font-bold mb-2">Submit Idea</h4>
              <p className="text-neutral-medium text-sm">Submit your innovation project</p>
            </Link>

            <div className="card text-center">
              <Brain className="w-12 h-12 text-semantic-info mx-auto mb-4" />
              <h4 className="font-bold mb-2">AI Mentor</h4>
              <p className="text-neutral-medium text-sm">Chat with your AI co-founder</p>
            </div>
          </div>
        )}
      </div>

      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </div>
  );
}


