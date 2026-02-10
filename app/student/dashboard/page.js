'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { modules, payment, aiChat, achievements } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Trophy, CreditCard, Brain, ArrowRight, Clock, CheckCircle, Play } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [ssiScore, setSSIScore] = useState(null);
  const [achievementsData, setAchievementsData] = useState(null);
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
      const [modulesData, paymentData, ssiData, achievementsRes] = await Promise.all([
        modules.getAll().catch(() => []),
        payment.getPaymentStatus().catch(() => ({ isPaid: false })),
        aiChat.getSSI().catch(() => ({ overallSSI: 0, breakdown: {} })),
        achievements.getAll().catch(() => ({ achievements: [], stats: { total: 0 } })),
      ]);

      setModulesList(modulesData);
      setPaymentStatus(paymentData);
      setSSIScore(ssiData);
      setAchievementsData(achievementsRes);
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
    <div className="min-h-screen pt-24 pb-12 px-4 selection:bg-red-500 selection:text-white">
      {/* Background Decor */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-100/20 via-transparent to-transparent pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="glass-panel p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-gradient-to-br from-yellow-200/30 to-red-200/30 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-2">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">{user?.name}</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Your innovation journey continues. You've made great progress—keep pushing boundaries.
            </p>
          </div>
        </div>

        {/* Payment Status (Glass Alert) */}
        {!paymentStatus?.isPaid && (
          <div className="glass-panel p-6 border-l-4 border-l-amber-500 bg-amber-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-bold text-xl text-amber-700 mb-1">🔓 Unlock Full Access</h3>
              <p className="text-gray-700">
                Complete your payment to access all modules, AI mentorship, and certificates.
                {paymentStatus?.price && paymentStatus.price !== 999 && (
                  <span className="block text-sm text-gray-500 mt-1">
                    Special price via school link: <span className="font-semibold text-gray-900">₹{paymentStatus.price}</span> (standard ₹999)
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={handlePayment}
              className="glass-button bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30 w-full md:w-auto flex justify-center items-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Pay ₹{paymentStatus?.price || 999}
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="glass-panel glass-panel-hover p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-3xl text-gray-900">{modulesList.length}</h3>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Modules</p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mb-4">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-3xl text-gray-900">{ssiScore?.overallSSI || 0}</h3>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">SSI Score</p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-3xl text-gray-900">0</h3>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Completed</p>
          </div>

          <div className="glass-panel glass-panel-hover p-6 text-center">
            <div className="w-12 h-12 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-3xl text-gray-900">0h</h3>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">Time Spent</p>
          </div>
        </div>

        {/* SSI Breakdown */}
        {ssiScore && ssiScore.overallSSI > 0 && (
          <div className="glass-panel p-8">
            <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-amber-500" />
              SURGE Progress
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {[
                { key: 'selfAwareness', label: 'Self Awareness', icon: '🎯' },
                { key: 'understandingOpportunities', label: 'Understanding', icon: '💡' },
                { key: 'resilience', label: 'Resilience', icon: '💪' },
                { key: 'growthExecution', label: 'Growth', icon: '🚀' },
                { key: 'entrepreneurialLeadership', label: 'Leadership', icon: '👑' },
              ].map((item) => (
                <div key={item.key} className="text-center p-4 rounded-xl bg-white/40 hover:bg-white/60 transition duration-300">
                  <div className="text-3xl mb-3 shadow-sm inline-block p-2 bg-white rounded-full">{item.icon}</div>
                  <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-1">
                    {ssiScore.breakdown?.[item.key] || 0}%
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modules Section */}
        <div className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Learning Modules</h2>
              <p className="text-gray-500">Your curated roadmap to success</p>
            </div>
            {paymentStatus?.isPaid && (
              <Link
                href="/student/modules"
                className="text-primary-red font-semibold hover:text-red-700 transition flex items-center gap-1 group"
              >
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>

          <div className="glass-panel p-6 md:p-8">
            {!paymentStatus?.isPaid ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔒</span>
                </div>
                <h4 className="font-bold text-2xl mb-2 text-gray-900">Modules Locked</h4>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Complete your payment to unlock the full entrepreneurship curriculum and start your journey.</p>
                <button
                  onClick={handlePayment}
                  className="glass-button text-lg px-8 py-4 shadow-xl shadow-red-500/20"
                >
                  Unlock Now - ₹{paymentStatus?.price || 999}
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {modulesList.slice(0, 4).map((module) => (
                  <div
                    key={module._id}
                    className="group bg-white/50 hover:bg-white p-6 rounded-2xl border border-white/60 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="flex justify-between items-start mb-4 pl-3">
                      <div className="flex items-center gap-4">
                        {module.mentorProfilePicture && (
                          <div className="relative">
                            <img
                              src={module.mentorProfilePicture}
                              alt="Mentor"
                              className="w-14 h-14 rounded-full border-2 border-white shadow-md object-cover"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-lg text-gray-900 leading-tight mb-1">{module.title}</h4>
                          <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            Available
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-6 pl-3 line-clamp-2">{module.description}</p>

                    <div className="flex justify-between items-center text-xs font-medium text-gray-500 mb-6 pl-3 bg-gray-50/50 p-2 rounded-lg">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> {module.difficulty}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {module.estimatedCompletionTime} min</span>
                      <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {module.chapters?.length || 0} chapters</span>
                    </div>

                    <Link
                      href={`/student/modules/${module._id}`}
                      className="w-full glass-button flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Start Learning
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements Section */}
        {achievementsData && achievementsData.stats.total > 0 && (
          <div className="glass-panel p-8">
            <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {achievementsData.achievements.slice(0, 5).map((achievement) => (
                <div key={achievement._id} className="text-center group p-4 rounded-xl hover:bg-white/40 transition">
                  <div className={`achievement-badge achievement-${achievement.rarity} mx-auto mb-3 transform group-hover:scale-110 transition-transform shadow-lg`}></div>
                  <p className="text-sm font-bold text-gray-900">{achievement.title}</p>
                  <p className="text-xs font-medium text-gray-500 capitalize mt-1">{achievement.rarity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {paymentStatus?.isPaid && (
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/student/modules" className="glass-panel glass-panel-hover p-6 text-center group cursor-pointer">
              <div className="w-14 h-14 mx-auto bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                <BookOpen className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-lg mb-2">Browse Modules</h4>
              <p className="text-sm text-gray-500">Explore all available learning content</p>
            </Link>

            <Link href="/student/submission" className="glass-panel glass-panel-hover p-6 text-center group cursor-pointer">
              <div className="w-14 h-14 mx-auto bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mb-4 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300">
                <Trophy className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-lg mb-2">Submit Idea</h4>
              <p className="text-sm text-gray-500">Submit your innovation project</p>
            </Link>

            <div className="glass-panel glass-panel-hover p-6 text-center group cursor-pointer">
              <div className="w-14 h-14 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Brain className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-lg mb-2">AI Mentor</h4>
              <p className="text-sm text-gray-500">Chat with ZUNOVA</p>
            </div>
          </div>
        )}
      </div>

      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </div>
  );
}


