'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { modules, payment, aiChat, achievements, auth } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import {
  ChevronDown,
  CreditCard,
  Brain,
  User,
  BookOpen,
  Trophy,
  Play,
  Settings,
  Laptop,
  Gift,
  MonitorPlay,
  CheckCircle2,
  Circle,
  Clock,
  Video,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';

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
          color: '#D4AF37',
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

  const isUserPaid = profile?.isPaid || user?.isPaid || paymentStatus?.isPaid;

  const completedModules = profile?.modulesProgress?.filter(mp => mp.completionPercentage >= 100).length || 0;
  const totalTimeSpent = profile?.modulesProgress?.reduce((sum, mp) => sum + (mp.timeSpent || 0), 0) || 0;
  const hoursSpent = Math.floor(totalTimeSpent / 3600);
  const minutesSpent = Math.floor((totalTimeSpent % 3600) / 60);
  const timeProgress = hoursSpent > 0 ? Math.min((hoursSpent / 10) * 100, 100) : 5; // Fake 10 hour goal

  const overallProgress = profile?.modulesProgress?.length > 0
    ? Math.round(profile.modulesProgress.reduce((sum, mp) => sum + (mp.completionPercentage || 0), 0) / profile.modulesProgress.length)
    : 0;

  // Build bar chart from real per-module completion
  const barChartData = modulesList.length > 0
    ? modulesList.map((mod, i) => {
      const mp = profile?.modulesProgress?.find(p => (p.moduleId?._id || p.moduleId) === mod._id);
      return { name: `M${i + 1}`, value: mp?.completionPercentage || 0, title: mod.title };
    })
    : [{ name: 'No Data', value: 0 }];

  // Build dynamic calendar from current date
  const now = new Date();
  const currentMonth = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();
  const dayOfWeek = now.getDay(); // 0=Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + mondayOffset + i);
    return d;
  });
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDate = now.getDate();

  // Build real schedule events from recent modules / last accessed
  const recentModules = (profile?.modulesProgress || [])
    .filter(mp => mp.lastAccessedAt)
    .sort((a, b) => new Date(b.lastAccessedAt) - new Date(a.lastAccessedAt))
    .slice(0, 2)
    .map(mp => {
      const mod = modulesList.find(m => m._id === (mp.moduleId?._id || mp.moduleId));
      return {
        title: mod?.title || 'Module',
        subtitle: `${mp.completionPercentage || 0}% complete · ${mp.completedChapters?.length || 0} chapters done`,
        time: new Date(mp.lastAccessedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      };
    });

  // Previous & next month names
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1).toLocaleString('default', { month: 'long' });
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F5EDD6]">
      {/* Background blobs for warm cream glassmorphism */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-[#FFFFFF]/60 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 md:px-8 xl:px-12 py-4 sm:py-6 md:py-8 relative z-10">

        {/* Payment Status Banner */}
        {!isUserPaid && (
          <div className="glass-panel p-5 mb-8 border border-[#B8952E]/30 bg-gradient-to-r from-white/60 to-[#F5D76E]/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#B8952E] mb-1">🔓 Unlock Full Access</h3>
                <p className="text-gray-700 text-sm">
                  Complete your payment to access all modules and AI features.
                  {paymentStatus?.price && paymentStatus.price !== 999 && (
                    <span className="block mt-1 font-medium text-[#B8952E]">
                      Special price via school link: ₹{paymentStatus.price} (standard ₹999)
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handlePayment}
                className="glass-button px-6 py-3 flex items-center gap-2 flex-shrink-0 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white border-0 shadow-lg shadow-[#D4AF37]/30 hover:scale-105"
              >
                <CreditCard className="w-5 h-5" />
                Pay ₹{paymentStatus?.price || 999}
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-3 sm:mb-6">
              Welcome in, <span className="font-medium text-gray-800">{user?.name?.split(' ')[0] || 'Titan'}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-xs font-medium">Modules</span>
                <span className="px-4 py-1.5 bg-[#F5D76E]/30 text-gray-800 rounded-full text-xs font-semibold">{overallProgress}%</span>
              </div>
              <div className="flex-1 min-w-[100px] sm:min-w-[200px] h-2 bg-white/50 rounded-full overflow-hidden border border-white/50">
                <div
                  className="h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.7)_4px,rgba(255,255,255,0.7)_8px)]"
                  style={{
                    width: `${overallProgress}%`,
                    backgroundColor: '#D4AF37'
                  }}
                />
              </div>
              <div className="hidden sm:block px-4 py-1.5 bg-white/60 text-gray-600 rounded-full text-xs border border-white/50">
                Progress
              </div>
            </div>
          </div>
        </div>

        {/* 3-Column Layout */}
        <div className="flex flex-col xl:flex-row gap-6">

          {/* --- LEFT COLUMN: Profile & Links (25%) --- */}
          <div className="xl:w-[25%] flex flex-col gap-6">
            {/* Profile Card */}
            <div className="glass-panel p-4 sm:p-6 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#D4AF37]/10 blur-3xl rounded-full transition-transform group-hover:scale-150 duration-700"></div>

              <div className="flex sm:flex-col items-center sm:items-center gap-4 sm:gap-0">
                <div className="w-20 h-20 sm:w-32 sm:h-32 sm:mx-auto rounded-2xl sm:rounded-3xl overflow-hidden sm:mb-6 shadow-xl relative z-10 border-4 border-white/50 flex-shrink-0">
                  {profile?.profilePicture ? (
                    <img src={profile.profilePicture} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/20 to-[#F5D76E]/20 flex items-center justify-center">
                      <User className="w-12 h-12 text-[#D4AF37]" />
                    </div>
                  )}
                </div>

                <div className="text-left sm:text-center relative z-10 flex-1 min-w-0">
                  <h3 className="font-bold text-lg sm:text-2xl text-gray-900 mb-1">{user?.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-5 font-medium">{profile?.bio || 'Innovation Student'}</p>

                  <div className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl text-xs sm:text-sm font-semibold shadow-xl shadow-gray-900/20">
                    <span className="text-[#F5D76E]">{ssiScore?.overallSSI || 0}</span> SSI Score
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links / Settings */}
            <div className="glass-panel p-2">
              <ul className="space-y-1">
                {[
                  { label: 'Profile Settings', icon: Settings, href: '/student/profile' },
                  { label: 'Learning Modules', icon: BookOpen, subtitle: `${modulesList.length} available`, href: '/student/modules' },
                  { label: 'Achievements', icon: Trophy, subtitle: `${achievementsData?.stats?.total || 0} earned`, href: '/student/profile' },
                  { label: 'SSI Breakdown', icon: Brain, subtitle: `Score: ${ssiScore?.overallSSI || 0}` },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href || '#'} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/60 transition-colors text-left group">
                      <div>
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4 text-gray-500 group-hover:text-[#D4AF37] transition-colors" />
                          <span className="text-sm font-medium text-gray-800">{item.label}</span>
                        </div>
                        {item.subtitle && (
                          <div className="flex items-center gap-2 mt-2 ml-7">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{item.subtitle}</span>
                          </div>
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* --- CENTER COLUMN: Charts & Calendar (50%) --- */}
          <div className="xl:w-[50%] flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 sm:h-[260px]">
              {/* Progress Bar Chart */}
              <div className="glass-panel p-4 sm:p-6 flex flex-col relative overflow-hidden min-h-[220px] sm:min-h-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-gray-900 font-medium text-lg">Progress</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-light text-gray-900">{hoursSpent}.{minutesSpent}h</span>
                      <span className="text-xs text-gray-500">Learning Time</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer shadow-sm">
                    <ArrowRight className="w-4 h-4 -rotate-45" />
                  </div>
                </div>

                <div className="flex-1 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} barSize={barChartData.length > 5 ? 6 : 14}>
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: '#9CA3AF' }}
                        dy={10}
                      />
                      <YAxis hide domain={[0, 100]} />
                      <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.4)' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}
                        formatter={(val, name, props) => [`${val}%`, props.payload.title || 'Progress']}
                      />
                      <Bar dataKey="value" radius={[10, 10, 10, 10]}>
                        {barChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value >= 100 ? '#D4AF37' : entry.value > 0 ? '#F5D76E' : '#E5E7EB'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Time Tracker Radial */}
              <div className="glass-panel p-4 sm:p-6 flex flex-col relative min-h-[240px] sm:min-h-0">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-gray-900 font-medium text-lg">Time tracker</h3>
                  <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-gray-500 hover:text-gray-900 cursor-pointer shadow-sm">
                    <ArrowRight className="w-4 h-4 -rotate-45" />
                  </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="relative w-36 h-36">
                    {/* Dashed background circle */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72" cy="72" r="60"
                        stroke="#E5E7EB"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4 4"
                      />
                      {/* Solid progress ring */}
                      <circle
                        cx="72" cy="72" r="60"
                        stroke="#F5D76E"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(timeProgress / 100) * 377} 377`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-light text-gray-900">{hoursSpent.toString().padStart(2, '0')}:{minutesSpent.toString().padStart(2, '0')}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Work Time</span>
                    </div>
                  </div>

                  {/* Decorative timeline markers */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-4 text-gray-400">
                    <Play className="w-4 h-4" />
                    <div className="w-px h-4 bg-gray-300"></div>
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar / Schedule Strip */}
            <div className="glass-panel p-4 sm:p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-medium text-gray-500 text-sm">{prevMonth}</h3>
                <h3 className="font-bold text-gray-900 text-lg tracking-wide">{currentMonth} {currentYear}</h3>
                <h3 className="font-medium text-gray-500 text-sm">{nextMonth}</h3>
              </div>

              <div className="flex justify-between px-2 mb-6">
                {weekDays.map((d, i) => {
                  const isToday = d.getDate() === todayDate;
                  return (
                    <div key={i} className="text-center">
                      <p className={`text-xs ${isToday ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'}`}>{dayLabels[i]}</p>
                      <p className={`text-sm mt-1 w-8 h-8 flex items-center justify-center rounded-full mx-auto ${isToday ? 'bg-[#D4AF37] text-white font-bold' : 'text-gray-600'}`}>{d.getDate()}</p>
                    </div>
                  );
                })}
              </div>

              {/* Recent Activity Events */}
              <div className="flex-1 mt-4 space-y-4">
                {recentModules.length > 0 ? recentModules.map((evt, i) => (
                  <div key={i} className={`p-3 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm gap-2 ${i === 0 ? 'bg-gray-900 text-white' : 'bg-white border border-gray-100'}`}>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold truncate ${i === 0 ? 'text-white' : 'text-gray-900'}`}>{evt.title}</p>
                      <p className={`text-[10px] mt-1 ${i === 0 ? 'text-gray-400' : 'text-gray-500'}`}>{evt.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] font-medium ${i === 0 ? 'text-gray-400' : 'text-gray-500'}`}>Last: {evt.time}</span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${i === 0 ? 'bg-[#D4AF37]' : 'bg-[#F5D76E]/30'}`}>
                        <Play className={`w-3 h-3 ${i === 0 ? 'text-black' : 'text-[#B8952E]'}`} />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10">
                    <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">No recent activity yet.</p>
                    <p className="text-gray-400 text-xs mt-1">Start a module to see your activity here!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Stats & Tasks (25%) --- */}
          <div className="xl:w-[25%] flex flex-col gap-6">

            {/* Top Minimal Stats */}
            <div className="flex justify-between items-center px-2 pt-2 glass-panel sm:bg-transparent sm:backdrop-blur-none sm:border-0 sm:shadow-none p-4 sm:p-0 sm:rounded-none">
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center gap-1 mb-1 text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                  <BookOpen className="w-3 h-3" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">{modulesList.length}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Modules</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center gap-1 mb-1 text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                  <Trophy className="w-3 h-3" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">{completedModules}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Complete</p>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="flex items-center justify-center gap-1 mb-1 text-gray-400 group-hover:text-[#D4AF37] transition-colors">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">{achievementsData?.stats?.total || 0}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1">Badges</p>
              </div>
            </div>

            {/* Overall Course Progress Mini */}
            <div className="flex items-center gap-4 bg-white/40 px-5 py-3 rounded-2xl border border-white/60">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 mb-2">Total Journey</p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#F5D76E] rounded-full transition-all duration-700" style={{ width: `${overallProgress}%` }}></div>
                </div>
              </div>
              <div className="text-xl font-light text-gray-900">{overallProgress}%</div>
            </div>

            {/* Dark Card - Module Tasks */}
            <div className="bg-[#1A1A1A] rounded-[24px] sm:rounded-[32px] p-4 sm:p-6 flex-1 shadow-2xl flex flex-col border border-gray-800 relative overflow-hidden min-h-[300px] max-h-[500px] xl:max-h-none">
              {/* Ambient top light */}
              <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50 blur-sm"></div>

              <div className="flex justify-between items-end mb-4 sm:mb-8 relative z-10">
                <h3 className="text-lg sm:text-xl font-medium text-white tracking-wide">Module Tasks</h3>
                <span className="text-2xl font-light text-[#F5D76E]">{completedModules}/{modulesList.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-4 relative z-10 custom-scrollbar-dark">
                {modulesList.map((mod, index) => {
                  const modProgress = profile?.modulesProgress?.find(p => p.moduleId?._id === mod._id || p.moduleId === mod._id);
                  const isDone = modProgress?.completionPercentage >= 100;

                  return (
                    <div key={mod._id} className="flex gap-4 group">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/10 transition-colors">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />
                        ) : (
                          <MonitorPlay className="w-5 h-5 text-gray-400 group-hover:text-[#F5D76E]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between border-b border-white/5 pb-4 group-hover:border-white/10 transition-colors">
                        <div className="pr-4 truncate">
                          <p className={`text-sm font-medium truncate ${isDone ? 'text-gray-400 line-through decoration-gray-600' : 'text-gray-100'}`}>
                            {mod.title}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">
                            {mod.chapters?.length || 0} Chapters
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center justify-center">
                          {isDone ? (
                            <div className="w-5 h-5 rounded-full bg-[#D4AF37] flex items-center justify-center text-black">
                              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          ) : (
                            <Circle className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {modulesList.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-500 text-sm">No modules available yet.</p>
                  </div>
                )}
              </div>

              <Link
                href="/student/modules"
                className="mt-4 w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white text-sm font-medium text-center transition-colors border border-white/10"
              >
                View All Modules
              </Link>
            </div>

          </div>
        </div>

      </div>

      {/* Styles for custom scrollbar in dark card */}
      <style jsx global>{`
        .custom-scrollbar-dark::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>

      {/* Razorpay Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
    </div>
  );
}
