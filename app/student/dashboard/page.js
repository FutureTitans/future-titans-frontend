'use client';

import { useEffect, useState, useRef } from 'react';
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
  ArrowRight,
  Star,
  Award,
  Shield,
  CheckCircle,
  X,
  ChevronUp,
  HelpCircle,
  Search
} from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';

const faqData = {
  Students: [
    { q: "Who can participate in Future Titans?", a: "Students from Classes 8 to 12, from any school board across India, can participate." },
    { q: "Do I need to have an idea before joining?", a: "No. You will first go through structured learning modules (IDEA DNA™ and S.U.R.G.E.™), where you will identify a problem and develop your idea step by step." },
    { q: "Can I participate individually or do I need a team?", a: "You can participate individually or with a co-founder. Both options are allowed, and you can choose what works best for you." },
    { q: "Do I need any special skills to participate?", a: "No. You do not need any prior knowledge of business, startups, or technology. Everything is taught from the basics." },
    { q: "Will there be mentors or someone to guide us?", a: "Yes. Guidance is provided through structured modules, Zunnova AI interactions during chapters, and expert inputs in advanced stages." },
    { q: "Will I get a chance to try different types of ideas?", a: "Yes. During the learning journey, you will explore multiple problems before finalizing one idea for submission." },
    { q: "How can this help me in the future?", a: "You will learn how to identify problems, build solutions, test ideas and present them skills useful for any career path." },
    { q: "Will this actually help me build my own startup?", a: "It helps you understand how startups are built from idea to validation and presentation, giving you a strong foundation to pursue it in the future. The Youngpreneurs team is also here to guide you through the building of your entire startup journey." },
    { q: "What are the main steps I will go through after registering?", a: "After registration, students enter a structured, progression-based learning journey designed to take them from curiosity to creation. They go through curated modules - Founder’s Mindset, Solution Seeker Index, and Entrepreneur Launch Blueprint, divided into chapters with Zunnova AI interactions that contribute to their Solution Seeker Index (SSI) and track their progress.\nAfter completing the modules, students develop and submit their ideas, which go through a multi-stage screening and evaluation process.\nEvery student who registers and logs in automatically becomes a part of the Future Titans Innovation Club, where community features including student interaction, knowledge bank, and projects, will be introduced soon.\nThe Top 50 students are then selected for a Bootcamp at IIT Kharagpur, where they receive advanced exposure, mentorship and opportunities to take their ideas forward." },
    { q: "How many rounds are there in the competition?", a: "The journey includes multiple stages: idea submission, AI-based screening, video pitch with AI interaction, physical assessment and final selection." },
    { q: "How does my idea grow from the first stage to the final stage?", a: "Your idea starts with identifying a problem, then becomes structured using frameworks, validated through early testing, and refined at each stage." },
    { q: "When does it go from just learning to actually building something real?", a: "This shift happens during the idea submission phase, where you apply what you’ve learned to build and present your own idea." }
  ],
  Parents: [
    { q: "What kind of skills will my child develop through this?", a: "Students develop problem-solving, structured thinking, creativity, communication and the ability to apply ideas in real-world contexts." },
    { q: "How is this different from regular workshops or competitions?", a: "Future Titans is not a one-time workshop or competition, it is a multi-phase innovation ecosystem. Students first learn through structured modules, then apply their learning across progressive stages and evaluations. They also get opportunities to showcase their work through Pan-India channels in association with The Times of India. Selected students are inducted into the Future Titans Innovation Club, where they continue their journey. At its core, the program focuses on building a long-term innovation mindset." },
    { q: "How does this prepare students for future opportunities?", a: "It builds a strong foundation in thinking, execution and communication skills essential for higher education, entrepreneurship, and careers." },
    { q: "How is this program designed for students of this age group?", a: "The program is simplified, structured, and interactive, ensuring students from Classes 8–12 can easily understand and apply concepts. The learning journey is designed across beginner, intermediate, and advanced levels, so each student can progress at a comfortable pace while building a strong understanding of the concepts." },
    { q: "How will this complement my child’s academic journey?", a: "It strengthens application-based and experience-based learning, helping students connect concepts with real-world problem-solving. The program is aligned with NEP and focuses on building critical thinking in the age of AI, preparing students for an AI-driven world. Students also receive a certificate upon completion." },
    { q: "Will my child receive feedback that helps them improve?", a: "Students receive evaluation-based insights during key stages, helping them refine and strengthen their ideas." },
    { q: "How do you ensure students stay engaged throughout the program?", a: "Through structured modules, interactive Zunnova AI sessions and progressive stages that require active participation." },
    { q: "What kind of exposure will my child receive through this?", a: "Students experience real-world problem-solving, structured evaluation processes, and advanced-stage interactions at national-level platforms. With IIT Kharagpur as our knowledge partner and The Times of India as our media partner, students also gain wider exposure and visibility through these platforms." },
    { q: "What is the sequence of stages my child will go through?", a: "Modules → idea development → idea submission → AI screening → video pitch → AI interaction → advanced selection stages." },
    { q: "How does each phase contribute to my child’s learning?", a: "Each phase builds on the previous one - learning concepts, applying them, refining ideas and presenting them." },
    { q: "How does my child’s learning evolve across different phases of the program?", a: "Students move from understanding concepts to applying them, improving through evaluation and strengthening execution." },
    { q: "How does the journey balance learning, application, and evaluation?", a: "The program begins with structured learning, followed by idea application and then evaluation through multiple stages. The entire journey is built around our core framework ‘Skill Challenge Community’ which focuses on helping students develop skills, take on real challenges, and grow within a connected ecosystem." }
  ],
  School: [
    { q: "What makes this experience meaningful for school students?", a: "It introduces structured problem-solving and application-based learning, helping students move beyond theoretical knowledge." },
    { q: "What does the school gain by being a part of Future Titans?", a: "Schools gain enhanced student outcomes, national-level exposure, and association with a structured innovation program. The initiative provides an NEP-aligned innovation infrastructure that is readily available for schools.\nFuture Titans is built as a complete ecosystem across three key pillars—Skill, Showcase, and Community. Students first build skills through structured learning, then showcase their work, and become part of the Future Titans Innovation Club, where every registered student is inducted.\nThe model is fully digital and plug-and-play, requiring zero development cost for schools. Schools can also opt for a phygital (physical + digital) model, which is seamlessly integrated.\nOverall, schools get access to a complete, ready-to-deploy innovation ecosystem without any operational burden." },
    { q: "How does this initiative support innovation within schools?", a: "It provides frameworks like IDEA DNA™ and S.U.R.G.E.™ that guide students in identifying problems and building solutions." },
    { q: "How is the program structured from start to finish?", a: "The program follows a structured journey: modules, idea development, submission, AI screening, pitch stages and final selection." },
    { q: "What is the overall timeline of the program?", a: "The program runs in defined phases, ensuring structured progression without disrupting academic schedules." },
    { q: "How is communication managed between your team and the school?", a: "Through designated coordinators, structured updates and clear communication channels." },
    { q: "What kind of support does your team provide to the school?", a: "We provide onboarding, student guidance, coordination support and regular updates throughout the program." },
    { q: "How do you manage coordination and execution with schools?", a: "Through a defined system with clear processes, ensuring smooth execution with minimal operational load on the school." },
    { q: "What is the structure of the multi-stage selection process?", a: "The process includes idea submission, AI screening, video pitch with AI interaction, physical assessment and final selection." },
    { q: "What distinguishes each stage in terms of expectations and outcomes?", a: "Each stage increases in depth, from idea clarity to validation, presentation and real-world evaluation." },
    { q: "How does the multi-phase approach support student growth?", a: "It allows students to progressively build, test, and refine their ideas at each stage." },
    { q: "How does each phase contribute to identifying top-performing students?", a: "Each phase evaluates thinking, execution, validation, and communication, ensuring a comprehensive selection process. This is guided by our core framework ‘Skill Challenge Community’ where students build skills, apply them through real-world challenges and grow within a larger innovation community. This helps schools develop well-rounded, future-ready students." }
  ]
};

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [ssiScore, setSSIScore] = useState(null);
  const [achievementsData, setAchievementsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // New states for buttons & modals
  const [showFAQ, setShowFAQ] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [activeFaqTab, setActiveFaqTab] = useState('Students');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const videoRef = useRef(null);

  // First-login auto-show video
  useEffect(() => {
    const hasSeenVideo = localStorage.getItem('ft_video_seen');
    if (!hasSeenVideo) {
      setShowVideo(true);
      localStorage.setItem('ft_video_seen', 'true');
    }
  }, []);


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
          name: profile?.name || user?.name,
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

  // Sort modules by difficulty: beginner → intermediate → advanced
  const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
  const sortedModules = [...modulesList].sort((a, b) => {
    return (difficultyOrder[a.difficulty] || 4) - (difficultyOrder[b.difficulty] || 4);
  });

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
    <div className="min-h-[calc(100dvh-4rem)] relative overflow-hidden bg-[#F5EDD6]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[50%] bg-white/60 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-4 sm:py-6 md:py-8 relative z-10">

        {/* Payment Status Banner */}
        {!isUserPaid && (
          <div className="glass-panel p-5 mb-8 border border-[#B8952E]/30 bg-gradient-to-r from-white/60 to-[#F5D76E]/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#B8952E] mb-1">🔓 Unlock Full Access</h3>
                <p className="text-gray-700 text-sm">
                  Complete your payment to access all modules and AI features.
                  {paymentStatus?.price && paymentStatus.price !== 1500 && (
                    <span className="block mt-1 font-medium text-[#B8952E]">
                      Special price via school link: ₹{paymentStatus.price} (standard 1500)
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handlePayment}
                className="glass-button px-6 py-3 flex items-center gap-2 flex-shrink-0 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white border-0 shadow-lg shadow-[#D4AF37]/30 hover:scale-105"
              >
                <CreditCard className="w-5 h-5" />
                Pay ₹{paymentStatus?.price || 1500}
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="mb-5 sm:mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-tight mb-3 sm:mb-5">
              Welcome in, <span className="font-medium text-gray-800">{profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Titan'}</span>
            </h1>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm">
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="px-3 sm:px-4 py-1.5 bg-gray-900 text-white rounded-full text-xs font-medium">Modules</span>
                <span className="px-3 sm:px-4 py-1.5 bg-[#F5D76E]/30 text-gray-800 rounded-full text-xs font-semibold">{overallProgress}%</span>
              </div>
              <div className="flex-1 min-w-[80px] h-2 bg-white/50 rounded-full overflow-hidden border border-white/50">
                <div
                  className="h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.7)_4px,rgba(255,255,255,0.7)_8px)]"
                  style={{ width: `${overallProgress}%`, backgroundColor: '#D4AF37' }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 overflow-x-auto pb-1">
            <button
              onClick={() => setShowFAQ(true)}
              className="flex items-center gap-2 sm:gap-3 px-1 py-1 pl-4 bg-white border-2 border-[#D4AF37]/30 shadow-sm rounded-full text-gray-800 font-semibold hover:shadow-md transition-all group flex-shrink-0"
            >
              <span className="text-sm whitespace-nowrap">👋 How Can We Help ?</span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8952E] flex items-center justify-center">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className="flex items-center gap-2 sm:gap-3 px-1 py-1 pl-4 bg-white border-2 border-[#D4AF37]/30 shadow-sm rounded-full text-gray-800 font-semibold hover:shadow-md transition-all group flex-shrink-0"
            >
              <span className="text-sm whitespace-nowrap">🚀 Click Me First</span>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8952E] flex items-center justify-center">
                <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </button>
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
                    <img src={profile.profilePicture} alt={profile?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/20 to-[#F5D76E]/20 flex items-center justify-center">
                      <User className="w-12 h-12 text-[#D4AF37]" />
                    </div>
                  )}
                </div>

                <div className="text-left sm:text-center relative z-10 flex-1 min-w-0">
                  <h3 className="font-bold text-lg sm:text-2xl text-gray-900 mb-1">{profile?.name || user?.name}</h3>
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

            {/* Submit Your Idea CTA */}
            <div className={`glass-panel p-5 relative overflow-hidden group border ${completedModules > 0 ? 'border-[#D4AF37]/30 bg-gradient-to-br from-white to-[#F5D76E]/10' : 'border-gray-200 bg-gray-50/50'}`}>
              {completedModules > 0 && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
              )}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${completedModules > 0 ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8952E]' : 'bg-gray-300'}`}>
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-base ${completedModules > 0 ? 'text-gray-900' : 'text-gray-400'}`}>Submit Your Idea</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Innovation Submission</p>
                  </div>
                </div>
                {completedModules > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      You&apos;ve completed {completedModules} module{completedModules > 1 ? 's' : ''}! Submit your idea now.
                    </p>
                    <Link
                      href="/student/submission"
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all font-semibold text-sm shadow-md"
                    >
                      <Trophy className="w-4 h-4" />
                      Submit Your Idea
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                      Complete at least one module to unlock idea submission.
                    </p>
                    <div className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-200 text-gray-400 rounded-2xl font-semibold text-sm cursor-not-allowed">
                      <Trophy className="w-4 h-4" />
                      Locked
                    </div>
                  </>
                )}
              </div>
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

            {/* --- NEW: Fun Badges Section --- */}
            <div className="glass-panel p-4 sm:p-6 flex flex-col mt-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-gray-900 font-medium text-lg">Your Badges</h3>
                  <p className="text-xs text-gray-500 mt-1">Earned by completing modules</p>
                </div>
                <div className="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  {completedModules} / {modulesList.length}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
                {sortedModules.map((mod, i) => {
                  const modProgress = profile?.modulesProgress?.find(p => (p.moduleId?._id || p.moduleId) === mod._id);
                  const isDone = modProgress?.completionPercentage >= 100;

                  // Vary the icons slightly based on index for "fun" variety
                  const icons = [Trophy, Star, Award, Shield, CheckCircle];
                  const Icon = icons[i % icons.length];

                  return (
                    <div
                      key={mod._id}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${isDone
                        ? 'border-[#D4AF37]/50 bg-gradient-to-br from-white to-[#F5D76E]/10 shadow-lg shadow-[#D4AF37]/20 hover:-translate-y-1 group'
                        : 'border-gray-200 bg-gray-50 opacity-60 grayscale'
                        }`}
                      title={mod.title}
                    >
                      {isDone && (
                        <div className="absolute inset-0 bg-white/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      )}

                      <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center shadow-inner ${isDone
                        ? 'bg-gradient-to-br from-[#F5D76E] to-[#D4AF37]'
                        : 'bg-gray-200'
                        }`}>
                        <Icon className={`w-6 h-6 ${isDone ? 'text-white' : 'text-gray-400'}`} />
                      </div>

                      <p className={`text-[10px] sm:text-xs text-center font-semibold line-clamp-2 leading-tight ${isDone ? 'text-gray-800' : 'text-gray-400'}`}>
                        {mod.title}
                      </p>

                      {isDone && (
                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {modulesList.length === 0 && (
                  <div className="col-span-full text-center py-6 text-sm text-gray-500">
                    No badges available yet.
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
                {sortedModules.map((mod, index) => {
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

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-4 bg-black/40 backdrop-blur-sm faq-modal-overlay" onClick={() => setShowFAQ(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl max-h-[92vh] sm:max-h-[85vh] flex flex-col shadow-2xl faq-modal-content border border-[#D4AF37]/20 relative overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-4 sm:p-8 shrink-0 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#F5EDD6]/50 to-white relative z-10">
              <h2 className="text-xl sm:text-3xl font-bold text-gray-900">How Can We Help?</h2>
              <button
                onClick={() => setShowFAQ(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors flex-shrink-0"
                aria-label="Close FAQ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex border-b border-gray-100 px-4 sm:px-8 pt-3 sm:pt-4 overflow-x-auto gap-4 sm:gap-8 shrink-0" style={{ scrollbarWidth: 'none' }}>
              {['Students', 'Parents', 'School'].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveFaqTab(tab); setOpenFaqIndex(null); }}
                  className={`pb-3 sm:pb-4 text-sm sm:text-lg font-bold transition-colors relative whitespace-nowrap flex-shrink-0 ${activeFaqTab === tab ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {tab === 'School' ? 'School / Principal' : tab}
                  {activeFaqTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4AF37] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* FAQ List */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar relative z-10">
              <div className="space-y-4">
                {faqData[activeFaqTab].map((item, idx) => (
                  <div
                    key={idx}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaqIndex === idx ? 'border-[#D4AF37] bg-gradient-to-br from-[#F5EDD6]/20 to-white shadow-md' : 'border-gray-100 bg-white hover:border-[#D4AF37]/50'}`}
                  >
                    <button
                      className="w-full text-left p-5 flex justify-between items-center gap-4 focus:outline-none"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    >
                      <h3 className={`font-medium text-sm sm:text-base ${openFaqIndex === idx ? 'text-[#B8952E]' : 'text-gray-800'}`}>
                        {idx + 1}. {item.q}
                      </h3>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${openFaqIndex === idx ? 'bg-[#D4AF37]/20 rotate-180' : 'bg-gray-50'}`}>
                        <ChevronDown className={`w-4 h-4 ${openFaqIndex === idx ? 'text-[#B8952E]' : 'text-gray-400'}`} />
                      </div>
                    </button>
                    <div className={`faq-answer-collapse ${openFaqIndex === idx ? 'open' : ''}`}>
                      <div className="min-h-0">
                        <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Background blobs for modal */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#F5D76E]/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      )}

      {/* Video Popup Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90" onClick={() => setShowVideo(false)}>
          <div className="w-full max-w-4xl bg-black rounded-2xl relative shadow-2xl overflow-hidden border border-white/10" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors border border-white/20"
              aria-label="Close video"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="relative w-full aspect-video">
              <video
                ref={videoRef}
                controls
                playsInline
                webkit-playsinline="true"
                preload="auto"
                className="w-full h-full object-contain rounded-lg"
                src="https://videosfuturetitans.s3.amazonaws.com/dashboard/Click me first video final.mp4"
              />
            </div>
          </div>
        </div>
      )}

      {/* Styles for custom scrollbar in dark card */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.3);
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.6);
        }
        
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
