'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { modules, payment, aiChat, achievements, auth } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Trophy, CreditCard, Brain, ArrowRight, Clock, CheckCircle, Play, User, Bell } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [ssiScore, setSSIScore] = useState(null);
  const [achievementsData, setAchievementsData] = useState(null);
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
      const [modulesData, paymentData, ssiData, achievementsRes, profileData] = await Promise.all([
        modules.getAll().catch(() => []),
        payment.getPaymentStatus().catch(() => ({ isPaid: false })),
        aiChat.getSSI().catch(() => ({ overallSSI: 0, breakdown: {} })),
        achievements.getAll().catch(() => ({ achievements: [], stats: { total: 0 } })),
        auth.getProfile().catch(() => null),
      ]);

      setModulesList(modulesData);
      setPaymentStatus(paymentData);
      setSSIScore(ssiData);
      setAchievementsData(achievementsRes);
      setProfile(profileData);
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

  const completedModules = profile?.modulesProgress?.filter(mp => mp.completionPercentage >= 100).length || 0;
  const totalTimeSpent = profile?.modulesProgress?.reduce((sum, mp) => sum + (mp.timeSpent || 0), 0) || 0;
  const hoursSpent = Math.floor(totalTimeSpent / 3600);
  const minutesSpent = Math.floor((totalTimeSpent % 3600) / 60);
  const timeDisplay = hoursSpent > 0 ? `${hoursSpent}h ${minutesSpent}m` : `${minutesSpent}m`;

  // Calculate overall progress
  const overallProgress = profile?.modulesProgress?.length > 0
    ? Math.round(profile.modulesProgress.reduce((sum, mp) => sum + (mp.completionPercentage || 0), 0) / profile.modulesProgress.length)
    : 0;

  return (
    <div className="min-h-screen relative" style={{ zIndex: 1 }}>
      <div className="container-lg py-8 space-y-8">
        {/* Payment Status */}
        {!paymentStatus?.isPaid && (
          <div className="glass border-l-4 border-l-yellow-500 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-yellow-700 mb-2">🔓 Unlock Full Access</h3>
                <p className="text-gray-700">
                  Complete your payment to access all modules and AI features.
                  {paymentStatus?.price && paymentStatus.price !== 999 && (
                    <span className="block text-sm text-gray-600 mt-1">
                      Special price via school link: <span className="font-semibold">₹{paymentStatus.price}</span> (standard ₹999)
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handlePayment}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-semibold flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay ₹{paymentStatus?.price || 999}
              </button>
            </div>
          </div>
        )}

        {/* Top Row: Profile Card + Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* User Profile Card */}
          <div className="card flex flex-col items-center text-center order-1">
            {profile?.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={user?.name}
                className="w-24 h-24 rounded-2xl object-cover mb-4 border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mb-4 border-4 border-white shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            <h3 className="font-bold text-lg text-gray-800 mb-1">Future CEO</h3>
            <p className="text-sm text-gray-600 mb-4">
              {user?.age || '16'} year-old, {user?.gender || 'Indian'} {user?.role || 'student'}
            </p>
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600">Progress</span>
                <span className="text-xs font-semibold text-gray-800">{overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="card flex flex-col items-center justify-center text-center order-2">
            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-red-500 mb-2 md:mb-3" />
            <h3 className="font-bold text-2xl md:text-3xl text-gray-800 mb-1">{modulesList.length}</h3>
            <p className="text-xs md:text-sm text-gray-600">Available Modules</p>
          </div>

          <div className="card flex flex-col items-center justify-center text-center order-3">
            <Brain className="w-8 h-8 md:w-10 md:h-10 text-yellow-500 mb-2 md:mb-3" />
            <h3 className="font-bold text-2xl md:text-3xl text-gray-800 mb-1">{ssiScore?.overallSSI || 0}</h3>
            <p className="text-xs md:text-sm text-gray-600">SSI Score</p>
          </div>

          <div className="card flex flex-col items-center justify-center text-center order-4">
            <Trophy className="w-8 h-8 md:w-10 md:h-10 text-orange-500 mb-2 md:mb-3" />
            <h3 className="font-bold text-2xl md:text-3xl text-gray-800 mb-1">{completedModules}</h3>
            <p className="text-xs md:text-sm text-gray-600">Completed</p>
          </div>
        </div>

        {/* Project Work Time Card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h3 className="font-bold text-lg md:text-xl text-gray-800">Project Work Time</h3>
            <Link href="/student/modules" className="text-xs md:text-sm text-gray-600 hover:text-red-600 transition">
              View All →
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
            <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(overallProgress / 100) * 351.86} 351.86`}
                  className="text-yellow-500 transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
                <p className="text-xs font-semibold text-gray-800 mt-1">{timeDisplay}</p>
                <p className="text-xs text-gray-600">Today</p>
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Market Research</p>
                  <p className="text-xs text-gray-600">{timeDisplay} Time spent</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Business Model Canvas</p>
                  <p className="text-xs text-gray-600">{timeDisplay} Time spent</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Progress Graph */}
        {ssiScore && ssiScore.overallSSI > 0 && (
          <div className="card">
            <h3 className="font-bold text-xl text-gray-800 mb-6">Learning Progress</h3>
            <div className="grid grid-cols-5 gap-4">
              {[
                { key: 'selfAwareness', label: 'Marketing', color: 'yellow' },
                { key: 'understandingOpportunities', label: 'Finance', color: 'orange' },
                { key: 'resilience', label: 'Strategy', color: 'red' },
                { key: 'growthExecution', label: 'Growth', color: 'yellow' },
                { key: 'entrepreneurialLeadership', label: 'Leadership', color: 'orange' },
              ].map((item, index) => {
                const value = ssiScore.breakdown?.[item.key] || 0;
                return (
                  <div key={item.key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-800">{value}%</span>
                    </div>
                    <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-${item.color}-500 to-${item.color}-400 transition-all duration-1000 ease-out`}
                        style={{ height: `${value}%` }}
                      />
                      <div className="absolute inset-0 flex items-end justify-center pb-2">
                        <span className="text-xs font-semibold text-white drop-shadow">{value}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Learning Modules */}
        <div className="card">
          <h3 className="font-bold text-lg md:text-xl text-gray-800 mb-4 md:mb-6 text-center">Learning Modules</h3>
          {!paymentStatus?.isPaid ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h4 className="font-bold text-xl mb-2">Modules Locked</h4>
              <p className="text-gray-600 mb-6">Complete payment to unlock all learning modules</p>
              <button
                onClick={handlePayment}
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 rounded-xl hover:shadow-lg transition font-semibold"
              >
                Unlock Now - ₹{paymentStatus?.price || 999}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {modulesList.slice(0, 2).map((module) => (
                <div
                  key={module._id}
                  className="glass-subtle border border-white/30 rounded-xl p-5 hover:shadow-lg transition group"
                >
                  <div className="flex items-start gap-4 mb-3">
                    {module.mentorProfilePicture && (
                      <img
                        src={module.mentorProfilePicture}
                        alt="Mentor"
                        className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold text-base text-gray-800 mb-1 group-hover:text-red-600 transition">
                        {module.title}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                        <span className="capitalize">{module.difficulty}</span>
                        <span>•</span>
                        <span>{module.estimatedCompletionTime} min</span>
                        <span>•</span>
                        <span>{module.chapters?.length || 0} chapters</span>
                        <span className="ml-auto flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Available
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{module.description}</p>
                      <Link
                        href={`/student/modules/${module._id}`}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition font-semibold text-sm"
                      >
                        <Play className="w-4 h-4" />
                        Start Learning
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements Section */}
        {achievementsData && achievementsData.stats.total > 0 && (
          <div className="card">
            <h3 className="font-bold text-xl text-gray-800 mb-6">Recent Achievements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {achievementsData.achievements.slice(0, 5).map((achievement) => (
                <div key={achievement._id} className="text-center">
                  <div className={`achievement-badge achievement-${achievement.rarity} mx-auto mb-3`}></div>
                  <p className="text-xs font-semibold text-gray-800">{achievement.title}</p>
                  <p className="text-xs text-gray-500 capitalize">{achievement.rarity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </div>
  );
}
