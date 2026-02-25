'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { modules, payment, aiChat, achievements, auth } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Trophy, CreditCard, Brain, ArrowRight, Clock, CheckCircle, Play, User, Bell, LayoutDashboard, Zap, GraduationCap, CalendarDays, ListChecks, TrendingUp, Target } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

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
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-amber-100 to-yellow-50">
      {/* Sticky Top Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-yellow-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">YoungPreneurs</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/student/dashboard" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">Dashboard</Link>
              <Link href="/student/modules" className="text-gray-600 hover:text-amber-600 transition-colors">Modules</Link>
              <Link href="/student/mentor-connect" className="text-gray-600 hover:text-amber-600 transition-colors">Mentor Connect</Link>
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-amber-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              </button>
              <div className="flex items-center space-x-3">
                {profile?.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={user?.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-amber-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-900">{user?.name || 'Arav Sharma'}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Status */}
        {!paymentStatus?.isPaid && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-3xl p-6 mb-8 shadow-xl backdrop-blur-lg bg-white/60">
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
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-2xl hover:shadow-2xl transition-all duration-300 font-semibold flex items-center gap-2 hover:scale-105"
              >
                <CreditCard className="w-5 h-5" />
                Pay ₹{paymentStatus?.price || 999}
              </button>
            </div>
          </div>
        )}

        {/* User Profile and Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* User Profile Card */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-amber-200/50 p-6 hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              {profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={user?.name}
                  className="w-24 h-24 rounded-3xl object-cover mx-auto mb-4 border-4 border-amber-200 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto mb-4 border-4 border-amber-200 shadow-xl">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
              <h3 className="font-bold text-xl text-gray-900 mb-2">Future CEO</h3>
              <p className="text-sm text-gray-600 mb-6">
                {user?.age || '16'} year-old, {user?.nationality || 'Indian'} {user?.gender || 'male'} student
              </p>
              <div className="w-full">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-semibold text-gray-900">{overallProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                  <div
                    className="h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-3 grid grid-cols-3 gap-6">
            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-amber-200/50 p-6 text-center hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <BookOpen className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-bold text-4xl text-gray-900 mb-2">{modulesList.length}</h3>
              <p className="text-sm text-gray-600 font-medium">Available Modules</p>
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-amber-200/50 p-6 text-center hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Brain className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-bold text-4xl text-gray-900 mb-2">{ssiScore?.overallSSI || 0}</h3>
              <p className="text-sm text-gray-600 font-medium">SSI Score</p>
            </div>

            <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-amber-200/50 p-6 text-center hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="font-bold text-4xl text-gray-900 mb-2">{completedModules}</h3>
              <p className="text-sm text-gray-600 font-medium">Completed</p>
            </div>
          </div>
        </div>

        {/* Learning Progress and Project Work Time */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Learning Progress Chart */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-amber-200/50 p-6 hover:shadow-3xl transition-all duration-300">
            <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-600" />
              Learning Progress
            </h3>
            <div className="space-y-6">
              {/* Level Labels */}
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Novice</span>
                <span>Intermediate</span>
                <span>Advanced</span>
              </div>
              
              {/* Week Labels */}
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
              
              {/* Progress Lines */}
              {[
                { label: 'Marketing', values: [20, 35, 50, 75], color: 'from-yellow-400 to-amber-500' },
                { label: 'Finance', values: [15, 30, 45, 60], color: 'from-amber-400 to-yellow-600' },
              ].map((item, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-800">{item.label}</span>
                    <span className="text-sm font-bold text-amber-600">{item.values[3]}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.values.map((value, i) => (
                      <div key={i} className="flex-1 h-12 bg-gray-100 rounded-xl relative overflow-hidden shadow-inner">
                        <div
                          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t ${item.color} transition-all duration-700 ease-out shadow-lg`}
                          style={{ height: `${value}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Work Time */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-amber-200/50 p-6 hover:shadow-3xl transition-all duration-300">
            <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-amber-600" />
              Project Work Time
            </h3>
            <div className="flex flex-col items-center">
              {/* Circular Progress */}
              <div className="relative w-32 h-32 mb-6">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(overallProgress / 100) * 351.86} 351.86`}
                    className="text-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-700"
                    style={{ stroke: 'url(#goldGradient)' }}
                  />
                  <defs>
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#facc15" />
                      <stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-sm shadow-lg"></div>
                  <p className="text-sm font-bold text-gray-900 mt-2">{timeDisplay}</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
              
              {/* Time Details */}
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl">
                  <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-lg"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Market Research</p>
                    <p className="text-xs text-amber-700 font-medium">{timeDisplay} Time spent</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-2xl">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-yellow-600 rounded-full shadow-lg"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Business Model Canvas</p>
                    <p className="text-xs text-amber-700 font-medium">{timeDisplay} Time spent</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Modules and Events */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Modules */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-amber-200/50 p-6 hover:shadow-3xl transition-all duration-300">
            <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-amber-600" />
              Learning Modules
            </h3>
            {!paymentStatus?.isPaid ? (
              <div className="text-center py-16">
                <div className="text-7xl mb-6">🔒</div>
                <h4 className="font-bold text-2xl mb-3 text-gray-900">Modules Locked</h4>
                <p className="text-gray-600 mb-8 text-lg">Complete payment to unlock all learning modules</p>
                <button
                  onClick={handlePayment}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-8 py-4 rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-lg hover:scale-105"
                >
                  Unlock Now - ₹{paymentStatus?.price || 999}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {modulesList.slice(0, 2).map((module) => (
                  <div
                    key={module._id}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-amber-200/50 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-102"
                  >
                    <h4 className="font-bold text-lg text-gray-900 mb-4">
                      {module.title || 'The Entrepreneur\'s Launch Blueprint: From Idea Spark to Pitch-Ready Success by Fred Katz'}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <span className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 rounded-full font-bold capitalize shadow-md">
                        <BookOpen className="w-4 h-4" /> {module.difficulty || 'Beginner'}
                      </span>
                      <span className="flex items-center gap-2 font-medium">
                        <Clock className="w-4 h-4 text-amber-600" /> {module.estimatedCompletionTime || 80} min
                      </span>
                      <span className="flex items-center gap-2 font-medium">
                        <ListChecks className="w-4 h-4 text-amber-600" /> {module.chapters?.length || 5} chapters
                      </span>
                      <span className="flex items-center gap-2 text-green-600 ml-auto font-bold">
                        <CheckCircle className="w-4 h-4" /> Available
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                      {module.description || 'A comprehensive guide to taking your startup idea from concept to a compelling pitch. Learn market research, business modeling, and effective communication strategies.'}
                    </p>
                    <Link
                      href={`/student/modules/${module._id}`}
                      className="inline-flex items-center justify-center w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-lg"
                    >
                      <Play className="w-6 h-6 mr-3" />
                      Start Learning
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Events/Calendar */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-amber-200/50 p-6 hover:shadow-3xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <CalendarDays className="w-6 h-6 text-amber-600" />
                Events
              </h3>
            </div>
            
            {/* Mini Calendar */}
            <div className="mb-6">
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-xs text-gray-500 font-medium">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }, (_, i) => {
                  const dayNum = i - 2;
                  const isToday = dayNum === 15;
                  const isCurrentMonth = dayNum >= 1 && dayNum <= 30;
                  return (
                    <div
                      key={i}
                      className={`
                        w-8 h-8 flex items-center justify-center text-xs rounded-xl transition-all
                        ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700'}
                        ${isToday ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold shadow-lg' : 'hover:bg-amber-50'}
                      `}
                    >
                      {isCurrentMonth ? dayNum : ''}
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Events List */}
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full mt-1 shadow-lg"></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-900 mb-1">Live Masterclass</h4>
                    <p className="text-xs text-gray-700 mb-2">Idea to Reality</p>
                    <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                      <Clock className="w-3 h-3" />
                      <span>Today, 4:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200/50 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-amber-300 rounded-full mt-1"></div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-900 mb-1">Workshop</h4>
                    <p className="text-xs text-gray-700 mb-2">Idea Validation</p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>Tomorrow, 5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </div>
  );
}
