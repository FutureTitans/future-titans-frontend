'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { modules, payment, aiChat, achievements, auth } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Trophy, CreditCard, Brain, ArrowRight, Clock, CheckCircle, Play, User, Bell, LayoutDashboard, Zap, GraduationCap, CalendarDays, ListChecks, TrendingUp, Target, Circle, Square } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
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
    <div className="min-h-screen bg-gradient-to-br from-[#f6eddc] via-[#f3e4c2] to-[#ecd59a] relative overflow-hidden">
      {/* Abstract wave decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-300 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-300 rounded-full filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6 relative z-10">
        
        {/* Payment Status */}
        {!paymentStatus?.isPaid && (
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-amber-800 mb-2">🔓 Unlock Full Access</h3>
                <p className="text-amber-700">
                  Complete your payment to access all modules and AI features.
                  {paymentStatus?.price && paymentStatus.price !== 999 && (
                    <span className="block text-sm mt-1">
                      Special price via school link: <span className="font-semibold">₹{paymentStatus.price}</span> (standard ₹999)
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handlePayment}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all duration-300 font-semibold flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Pay ₹{paymentStatus?.price || 999}
              </button>
            </div>
          </div>
        )}

        {/* Main Dashboard Container */}
        <div className="w-full bg-gradient-to-br from-[#f7f3e8] to-[#f1e6c9] p-6 rounded-2xl">
          <div className="flex gap-6">
            
            {/* LEFT SIDEBAR CARD - Profile */}
            <div className="w-[300px] bg-white/90 backdrop-blur-sm rounded-[20px] shadow-lg p-5">
              {/* Profile Image */}
              <div className="w-full aspect-square rounded-[16px] overflow-hidden mb-4">
                {profile?.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={user?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-200 to-amber-200 flex items-center justify-center">
                    <User className="w-16 h-16 text-amber-600" />
                  </div>
                )}
              </div>
              
              {/* Title */}
              <h3 className="font-bold text-[20px] text-gray-900 mb-1">Future CEO</h3>
              
              {/* Subtitle */}
              <p className="text-sm text-gray-500 mb-4">
                {user?.age || '16'} year-old, {user?.nationality || 'Indian'} {user?.gender || 'male'} student
              </p>
              
              {/* Progress Bar */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-600">Progress</span>
                  <span className="text-xs font-semibold text-gray-900">65%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-[#FFD84D] rounded-full transition-all duration-500"
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </div>

            {/* CENTER CONTENT */}
            <div className="flex-1 space-y-6">
              
              {/* TOP STAT CARDS */}
              <div className="flex gap-6">
                {/* Available Modules Card */}
                <div className="flex-1 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-[16px] shadow-md p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#FFD84D]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{modulesList.length}</h3>
                    <p className="text-sm text-gray-600">Available Modules</p>
                  </div>
                </div>

                {/* SSI Score Card */}
                <div className="flex-1 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-[16px] shadow-md p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#FFD84D]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{ssiScore?.overallSSI || 0}</h3>
                    <p className="text-sm text-gray-600">SSI Score</p>
                  </div>
                </div>

                {/* Completed Card */}
                <div className="flex-1 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-[16px] shadow-md p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-[#FFD84D]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{completedModules}</h3>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </div>

              {/* LEARNING PROGRESS CARD */}
              <div className="bg-white/90 backdrop-blur-sm rounded-[20px] shadow-lg p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-6">Learning Progress</h3>
                
                {/* Chart Area */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={[
                      { week: 'Week 1', marketing: 20, finance: 15 },
                      { week: 'Week 2', marketing: 35, finance: 30 },
                      { week: 'Week 3', marketing: 50, finance: 45 },
                      { week: 'Week 4', marketing: 65, finance: 55 },
                      { week: 'Week 5', marketing: 75, finance: 60 },
                      { week: 'Week 6', marketing: 85, finance: 70 },
                      { week: 'Week 7', marketing: 90, finance: 75 },
                      { week: 'Week 8', marketing: 95, finance: 80 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="week" 
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        ticks={[0, 25, 50, 75, 100]}
                        tickFormatter={(value) => value === 0 ? 'Novice' : value === 25 ? 'Intermediate' : value === 50 ? 'Advanced' : value === 75 ? 'Expert' : 'Master'}
                        tick={{ fontSize: 12 }}
                        axisLine={false}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="marketing" 
                        stroke="#FFD84D" 
                        strokeWidth={3}
                        dot={{ fill: "#FFD84D", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="finance" 
                        stroke="#C9A84E" 
                        strokeWidth={3}
                        dot={{ fill: "#C9A84E", r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR CARD - Project Work Time */}
            <div className="w-[260px] bg-white/90 backdrop-blur-sm rounded-[20px] shadow-lg p-5">
              <h3 className="font-bold text-lg text-gray-900 mb-6">Project Work Time</h3>
              
              {/* Circular Progress Ring */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#FFD84D"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${0.65 * 351.86} 351.86`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-lg font-bold text-gray-900">1h 45m</p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                </div>
              </div>
              
              {/* List Items */}
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-[#FFD84D] rounded-full mt-1.5"></div>
                  <div>
                    <p className="text-sm text-gray-700">Market Research</p>
                    <p className="text-xs text-gray-500">1h 45m</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-[#C9A84E] rounded-full mt-1.5"></div>
                    <div>
                      <p className="text-sm text-gray-700">Business Model Canvas</p>
                      <p className="text-xs text-gray-500">1h 45m</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        {/* Learning Modules Section */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl text-gray-900">Learning Modules</h3>
            <Link href="/student/modules" className="text-amber-600 hover:text-amber-700 transition-colors">
              View All →
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {/* Left Module Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6">
              <h4 className="font-bold text-lg text-gray-900 mb-3">
                The Entrepreneur's Launch Blueprint: From Idea Spark to Pitch-Ready Success by Fred Katz
              </h4>
              
              {/* Badges */}
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Beginner</span>
                <span>80 min</span>
                <span>5 chapters</span>
                <span className="text-green-600 font-semibold">Available</span>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-600 mb-6">
                A comprehensive guide to taking your startup idea from concept to a compelling pitch. Learn market research, business modeling, and effective communication strategies.
              </p>
              
              {/* CTA Button */}
              <Link
                href={`/student/modules/${modulesList[0]?._id || '#'}`}
                className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-yellow-400 to-red-400 hover:from-yellow-500 hover:to-red-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Learning ▶
              </Link>
            </div>

            {/* Calendar Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6">
              {/* Weekday Row */}
              <div className="grid grid-cols-6 gap-1 text-center mb-4">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, i) => (
                  <div key={i} className="text-xs text-gray-600 font-medium">{day}</div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-6 gap-1 mb-6">
                {Array.from({ length: 30 }, (_, i) => {
                  const dayNum = i + 1;
                  const isHighlighted = dayNum === 15;
                  return (
                    <div
                      key={i}
                      className={`
                        w-8 h-8 flex items-center justify-center text-xs rounded-lg transition-all
                        ${isHighlighted ? 'bg-yellow-400 text-white font-bold' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      {dayNum}
                    </div>
                  );
                })}
              </div>
              
              {/* Events */}
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 rounded-2xl border border-yellow-200">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-gray-900">Nov 15</span>
                    <span className="text-xs text-amber-600">4 PM</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Live Masterclass: Idea to Reality</h4>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-semibold text-gray-900">Nov 20</span>
                    <span className="text-xs text-gray-600">5 PM</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 mb-1">Idea Validation Workshop</h4>
                </div>
              </div>
            </div>

            {/* Right Module Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6">
              <h4 className="font-bold text-lg text-gray-900 mb-3">
                The Solution Seeker's Journey: From Ideas to Action by Naisha Kapoor
              </h4>
              
              {/* Badges */}
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Beginner</span>
                <span>28 min</span>
                <span>5 chapters</span>
                <span className="text-green-600 font-semibold">Available</span>
              </div>
              
              {/* Description */}
              <p className="text-sm text-gray-600 mb-6">
                Discover how to identify real-world problems and develop innovative solutions. Learn design thinking, prototyping, and validation techniques.
              </p>
              
              {/* CTA Button */}
              <Link
                href={`/student/modules/${modulesList[1]?._id || '#'}`}
                className="w-full py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-yellow-400 to-red-400 hover:from-yellow-500 hover:to-red-500 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Learning ▶
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </div>
  );
}
