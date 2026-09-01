'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { modules as modulesApi, payment, auth, aiChat, submission } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import {
  Lock, ChevronRight, ArrowRight, CheckCircle, Zap, Play,
  Compass, Trophy, Award, Star, Clock, TrendingUp,
  MessageCircle, Flame, Target, Users, Volume2
} from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const MODULE_IMAGES = [
  '/FounderMindset.png',
  '/SolutionSeekerJourney.png',
  '/TheEntreprenuerLaunch.png',
];

const SUCCESS_STORIES = [
  { name: 'Krishika', url: 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/KrishikaVoice.mp4', label: 'Success Story 01', color: 'from-pink-500 to-rose-600' },
  { name: 'Naisha', url: 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/naishaVoice.mp4', label: 'Success Story 02', color: 'from-violet-500 to-purple-600' },
  { name: 'Shivay', url: 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/ShivayVoice.mp4', label: 'Success Story 03', color: 'from-blue-500 to-indigo-600' },
];

const STARTING_YOUNG_VIDEO = 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/this%20is%20what%20starting%20young%20looks%20like.mp4';
const INCUBATION_VIDEO = 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/Incubation%20video%20.mp4';

function VideoWithPlayButton({ src, className = '', aspectClass = 'aspect-video', poster }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={`relative group ${aspectClass} bg-black rounded-2xl overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        controls={isPlaying}
        className="w-full h-full object-cover"
        poster={poster}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={src} type="video/mp4" />
      </video>
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer z-10"
        >
          <div className="w-16 h-16 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110">
            <Play className="w-6 h-6 text-gray-900 fill-gray-900 ml-1" />
          </div>
        </button>
      )}
    </div>
  );
}

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ssiData, setSsiData] = useState(null);
  const [wordBalance, setWordBalance] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(null);

  // Catch Zunnova game state
  const [gameState, setGameState] = useState('idle');
  const [gameScore, setGameScore] = useState(0);
  const [catches, setCatches] = useState(0);
  const [zunnovaPos, setZunnovaPos] = useState({ x: 50, y: 50 });
  const [gameRound, setGameRound] = useState(0);
  const [showZunnova, setShowZunnova] = useState(true);
  const [catchAnim, setCatchAnim] = useState(false);
  const gameAreaRef = useRef(null);
  const gameTimerRef = useRef(null);
  const moveTimerRef = useRef(null);
  const [gameTimeLeft, setGameTimeLeft] = useState(30);
  const [catchGameScores, setCatchGameScores] = useState([]);

  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }
    const currentUser = getUser();
    setUser(currentUser);
    fetchDashboardData();
    const saved = localStorage.getItem('catchZunnovaScores');
    if (saved) setCatchGameScores(JSON.parse(saved));
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [modulesData, paymentData, profileData, ssi, wordBal, sub] = await Promise.all([
        modulesApi.getAll().catch(() => []),
        payment.getPaymentStatus().catch(() => ({ isPaid: false })),
        auth.getProfile().catch(() => null),
        aiChat.getSSI().catch(() => null),
        aiChat.getWordBalance().catch(() => null),
        submission.get().catch(() => null),
      ]);
      setModulesList(modulesData);
      setPaymentStatus(paymentData);
      setProfile(profileData);
      setSsiData(ssi);
      setWordBalance(wordBal);
      setSubmissionData(sub);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      if (typeof window === 'undefined' || typeof window.Razorpay === 'undefined') {
        alert('Payment system is loading. Please wait.');
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
        theme: { color: '#D4AF37' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  // ── CATCH ZUNNOVA GAME LOGIC ──
  const moveZunnova = useCallback(() => {
    const x = Math.random() * 70 + 10;
    const y = Math.random() * 70 + 10;
    setZunnovaPos({ x, y });
    setShowZunnova(true);
  }, []);

  const startGame = useCallback(() => {
    setGameState('playing');
    setGameScore(0);
    setCatches(0);
    setGameRound(0);
    setGameTimeLeft(30);
    setShowZunnova(true);
    moveZunnova();

    gameTimerRef.current = setInterval(() => {
      setGameTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    moveTimerRef.current = setInterval(() => {
      setGameRound(prev => {
        if (prev >= 19) {
          endGame();
          return prev;
        }
        return prev + 1;
      });
      moveZunnova();
    }, 1500);
  }, [moveZunnova]);

  const endGame = useCallback(() => {
    setGameState('ended');
    clearInterval(gameTimerRef.current);
    clearInterval(moveTimerRef.current);
    setShowZunnova(false);
  }, []);

  useEffect(() => {
    if (gameState === 'ended') {
      const firstName = profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'You';
      const newScore = { name: firstName, score: gameScore, date: new Date().toISOString() };
      setCatchGameScores(prev => {
        const updated = [...prev, newScore].sort((a, b) => b.score - a.score).slice(0, 10);
        localStorage.setItem('catchZunnovaScores', JSON.stringify(updated));
        return updated;
      });
    }
  }, [gameState]);

  useEffect(() => {
    return () => {
      clearInterval(gameTimerRef.current);
      clearInterval(moveTimerRef.current);
    };
  }, []);

  const catchZunnova = useCallback(() => {
    if (gameState !== 'playing' || !showZunnova) return;
    const newScore = gameScore + 5;
    const bonus = (catches + 1) % 5 === 0 ? 100 : 0;
    setGameScore(newScore + bonus);
    setCatches(prev => prev + 1);
    setCatchAnim(true);
    setShowZunnova(false);
    setTimeout(() => setCatchAnim(false), 300);
    setTimeout(() => {
      moveZunnova();
    }, 400);
  }, [gameState, showZunnova, gameScore, catches, moveZunnova]);

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  const isUserPaid = profile?.isPaid || user?.isPaid || paymentStatus?.isPaid;
  const firstName = profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Titan';

  const sortedModules = [...modulesList].sort((a, b) => {
    const weights = { beginner: 1, intermediate: 2, advanced: 3 };
    return (weights[a.difficulty] || 4) - (weights[b.difficulty] || 4);
  });

  const completedModules = sortedModules.filter(m => (m.userProgress?.completionPercentage || 0) >= 100).length;
  const totalTimeMinutes = Math.round((profile?.totalTimeSpent || sortedModules.reduce((acc, m) => acc + (m.userProgress?.timeSpent || 0), 0)) / 60);
  const overallProgress = sortedModules.length > 0 ? Math.round(sortedModules.reduce((acc, m) => acc + (m.userProgress?.completionPercentage || 0), 0) / sortedModules.length) : 0;
  const ssiScore = profile?.ssiScore || ssiData?.overallScore || 0;
  const totalWords = wordBalance?.totalWords || 2000;
  const usedWords = wordBalance?.usedWords || 0;
  const remainingWords = wordBalance?.remainingWords || totalWords - usedWords;
  const wordPercent = totalWords > 0 ? Math.round((remainingWords / totalWords) * 100) : 100;
  const canSubmitIdea = completedModules >= 1;

  return (
    <div className="min-h-screen bg-[#F5F3EE] font-sans pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── SECTION 1: UNLOCK FULL ACCESS BANNER ── */}
        {!isUserPaid && (
          <div className="mt-4 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Unlock Full Access</h3>
                <p className="text-white/80 text-sm mt-0.5">All 3 modules, unlimited Zunnova AI, IIT mentorship and the Innovation Club -- everything below is waiting for you.</p>
              </div>
            </div>
            <button
              onClick={handlePayment}
              className="bg-[#141b2d] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1a2240] transition-colors flex-shrink-0 shadow-lg"
            >
              Pay &#8377;1500 + 18% GST
            </button>
          </div>
        )}

        {/* ── SECTION 2: GREETING ── */}
        <div className="mt-8 mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Hey, <span className="text-gray-900">{firstName}</span>
            </h1>
            <p className="text-[#DC2626] font-bold text-sm uppercase tracking-[0.15em] mt-2">What&apos;s your next move?</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/student/modules"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-200 bg-white text-gray-700 text-sm font-semibold hover:border-[#D4AF37] hover:text-[#B8952E] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Got Questions ?
            </Link>
            <Link
              href="/student/modules"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141b2d] text-white text-sm font-semibold hover:bg-[#1a2240] transition-colors"
            >
              <Play className="w-4 h-4" />
              Click Me First
            </Link>
          </div>
        </div>

        {/* ── SECTION 3: QUICK ACTION CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <Link href="/student/modules" className="group">
            <div className="bg-[#FFF9E6] border border-[#F5D76E]/30 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-[#D4AF37]/40 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                <img src="/bulbrocket.png" alt="" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-[15px]">Learn something new</h3>
                <p className="text-gray-500 text-xs mt-0.5">{sortedModules.length} modules waiting</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 ml-auto group-hover:text-[#D4AF37] transition-colors" />
            </div>
          </Link>
          <Link href="/student/submission" className="group">
            <div className="bg-[#FFF9E6] border border-[#F5D76E]/30 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-[#D4AF37]/40 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                <img src="/bulbrocket.png" alt="" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-[15px]">Build an Idea</h3>
                <p className="text-gray-500 text-xs mt-0.5">submit your first submission</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 ml-auto group-hover:text-[#D4AF37] transition-colors" />
            </div>
          </Link>
          <Link href="/student/innovation-club" className="group">
            <div className="bg-[#FFF9E6] border border-[#F5D76E]/30 rounded-2xl p-5 flex items-center gap-4 hover:shadow-lg hover:border-[#D4AF37]/40 transition-all cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                <img src="/compass.png" alt="" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-[15px]">Explore the Club</h3>
                <p className="text-gray-500 text-xs mt-0.5">Mentors & community</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 ml-auto group-hover:text-[#D4AF37] transition-colors" />
            </div>
          </Link>
        </div>

        {/* ── SECTION 4: SUCCESS STORIES + MY TITAN JOURNEY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
          {/* Success Stories - Left (3 cols) */}
          <div className="lg:col-span-3 bg-[#141b2d] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-4">Success Stories</p>
            <h2 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight mb-2">
              This is What Starting<br />Young Looks Like
            </h2>
            <p className="text-gray-400 text-sm mb-5">Meet the youngpreneurs who turned<br className="hidden sm:block" />their ideas into something real</p>

            <VideoWithPlayButton src={STARTING_YOUNG_VIDEO} className="shadow-2xl mb-5" />

            {/* Success Story Thumbnails */}
            <div className="grid grid-cols-3 gap-3">
              {SUCCESS_STORIES.map((story, i) => (
                <div key={i} className="rounded-xl overflow-hidden border-2 border-transparent hover:border-[#D4AF37]/50 transition-all cursor-pointer">
                  {activeStoryIndex === i ? (
                    <div className="aspect-video bg-black relative rounded-xl overflow-hidden">
                      <video controls autoPlay className="w-full h-full object-cover" onEnded={() => setActiveStoryIndex(null)}>
                        <source src={story.url} type="video/mp4" />
                      </video>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveStoryIndex(i)}
                      className={`w-full aspect-video bg-gradient-to-br ${story.color} relative flex flex-col items-center justify-center rounded-xl`}
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-2">
                        <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                      </div>
                      <p className="text-white text-xs font-bold">{story.name}</p>
                      <p className="text-white/60 text-[9px] mt-0.5">{story.label}</p>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* My Titan Journey - Right (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-bold text-gray-900 text-lg">My Titan Journey</h3>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#F5F3EE] rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold text-gray-900">{Math.round(ssiScore)}</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">SSI</p>
              </div>
              <div className="bg-[#F5F3EE] rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold text-gray-900">{totalTimeMinutes > 0 ? `${(totalTimeMinutes / 60).toFixed(1)}h` : '0.0h'}</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">Time</p>
              </div>
              <div className="bg-[#F5F3EE] rounded-xl p-3 text-center">
                <p className="text-2xl font-extrabold text-gray-900">{overallProgress}%</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase mt-1">Done</p>
              </div>
            </div>

            <div className="space-y-2.5 mb-5">
              {[
                { label: 'Self-Awareness', key: 'selfAwareness' },
                { label: 'Understanding', key: 'understanding' },
                { label: 'Resilience', key: 'resilience' },
                { label: 'Growth', key: 'growth' },
                { label: 'E. Leadership', key: 'entrepreneurialLeadership' },
              ].map((dim) => {
                const val = profile?.ssiBreakdown?.[dim.key] || ssiData?.breakdown?.[dim.key] || 0;
                return (
                  <div key={dim.key} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-24 flex-shrink-0">{dim.label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className="h-full bg-[#D4AF37] rounded-full transition-all duration-700" style={{ width: `${val}%` }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-8 text-right">{Math.round(val)}</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-sm font-bold text-gray-900 mb-3">Recent Activity</p>
              {sortedModules.some(m => (m.userProgress?.completionPercentage || 0) > 0) ? (
                <div className="space-y-2">
                  {sortedModules.filter(m => (m.userProgress?.completionPercentage || 0) > 0).slice(0, 3).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="truncate">{m.title} - {m.userProgress?.completionPercentage || 0}%</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No activity yet. Start learning!</p>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <p className="text-sm font-bold text-gray-900">Learning Streak</p>
              </div>
              <p className="text-xs text-gray-500">Complete a module to start your streak</p>
            </div>

            <div className="mt-auto pt-3">
              <Link
                href="/student/profile"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#141b2d] text-white rounded-xl font-semibold text-sm hover:bg-[#1a2240] transition-colors"
              >
                View Full Journey <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── SECTION 5: LEARN ── */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <img src="/compass.png" alt="" className="w-8 h-8 object-contain drop-shadow-md" />
            <h2 className="text-3xl font-extrabold text-gray-900">Learn</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6 ml-11">Three modules: from founder mindset to launch.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedModules.map((module, index) => {
              const isDone = (module.userProgress?.completionPercentage || 0) >= 100;
              const progress = module.userProgress?.completionPercentage || 0;
              const chaptersCount = module.chapters?.length || 0;
              const completedChapters = module.userProgress?.completedChapters?.length || 0;
              const lockedChapters = chaptersCount - completedChapters;
              const coverImg = module.coverImage || MODULE_IMAGES[index] || MODULE_IMAGES[0];
              const hasStarted = progress > 0;

              return (
                <div key={module._id} className="relative group">
                  <div className={`bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 h-full flex flex-col
                    ${isDone ? 'border-green-300 shadow-lg' : 'border-gray-100 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/30'}`}>

                    {!isUserPaid && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-3xl">
                        <div className="bg-white p-4 rounded-full shadow-xl text-[#B8952E] flex flex-col items-center">
                          <Lock className="w-8 h-8 mb-1" />
                          <span className="text-xs font-bold uppercase tracking-widest">Locked</span>
                        </div>
                      </div>
                    )}

                    <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                      <img src={coverImg} alt={module.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold bg-white/90 text-gray-700 shadow-sm">
                          Module {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                      {isDone && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] px-3 py-1 rounded-full font-bold bg-green-500 text-white shadow-sm">100%</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-extrabold text-lg text-gray-900 mb-1 line-clamp-2">{module.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">{module.description}</p>

                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 mt-auto">
                        <span>{chaptersCount} chapters</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>{lockedChapters > 0 ? `${lockedChapters} locked` : 'All unlocked'}</span>
                      </div>

                      <div className="mb-4">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-700 ${isDone ? 'bg-green-500' : 'bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]'}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {isUserPaid ? (
                        <Link
                          href={`/student/modules`}
                          className={`w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all
                            ${isDone
                              ? 'bg-green-50 border border-green-200 text-green-700 hover:bg-green-100'
                              : hasStarted
                                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white hover:shadow-gold'
                                : 'bg-[#141b2d] text-white hover:bg-[#1a2240]'
                            }`}
                        >
                          {isDone ? (
                            <><CheckCircle className="w-4 h-4" /> Completed</>
                          ) : hasStarted ? (
                            <><Zap className="w-4 h-4" /> Continue</>
                          ) : (
                            <><Play className="w-3.5 h-3.5" /> Start Learning</>
                          )}
                        </Link>
                      ) : (
                        <button onClick={handlePayment} className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold text-sm bg-gray-100 text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
                          <Lock className="w-3.5 h-3.5" /> Unlock to Access
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── SECTION 6: BUILD AN IDEA ── */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <img src="/bulbrocket.png" alt="" className="w-8 h-8 object-contain drop-shadow-md" />
            <h2 className="text-3xl font-extrabold text-gray-900">Build an Idea</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6 ml-11">Let&apos;s see what&apos;s next in your next submission.</p>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FFF9E6] flex items-center justify-center flex-shrink-0">
                  <img src="/bulbrocket.png" alt="" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Idea Submission</p>
                  <h3 className="font-bold text-gray-900 text-lg">Submit Your Idea</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {canSubmitIdea
                      ? 'You have completed a module. Submit your idea now!'
                      : 'Complete at least one module to unlock idea submission.'}
                  </p>
                  <p className="text-gray-400 text-xs mt-2">{completedModules} of {sortedModules.length} modules complete</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {submissionData ? (
                  <Link href="/student/submission" className="px-5 py-2.5 bg-[#D4AF37] text-white rounded-xl font-bold text-sm hover:bg-[#B8952E] transition-colors">
                    View Submission
                  </Link>
                ) : canSubmitIdea ? (
                  <Link href="/student/submission" className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl font-bold text-sm hover:shadow-gold transition-all">
                    Submit Now
                  </Link>
                ) : (
                  <span className="px-4 py-2 bg-red-50 text-[#DC2626] rounded-full text-xs font-bold border border-red-100">locked</span>
                )}
              </div>
            </div>
            {!canSubmitIdea && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link href="/student/modules" className="text-sm text-[#DC2626] font-semibold flex items-center gap-1.5 hover:underline">
                  Start The Founder&apos;s Mindset <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ── SECTION 7: INNOVATION CLUB ── */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/15 flex items-center justify-center">
              <Star className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Innovation Club</h2>
          </div>
          <p className="text-gray-500 text-sm mb-6 ml-11">Mentorship, incubation and the wider Youngpreneurs community.</p>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
            <span className="inline-block px-4 py-1.5 bg-[#D4AF37] text-white rounded-full text-xs font-bold uppercase tracking-wider mb-6">
              Mentorship & Incubation
            </span>

            <VideoWithPlayButton src={INCUBATION_VIDEO} className="shadow-lg mb-6" />

            <h3 className="font-bold text-gray-900 text-xl mb-4">Incubated and mentored by IIT mentors</h3>
            <div className="space-y-3 mb-6">
              {[
                'One-on-one incubation sessions',
                'Idea, business model and pitch reviews',
                'Direct access through the Innovation Club',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D4AF37]/15 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
                  </div>
                  <p className="text-gray-600 text-sm">{item}</p>
                </div>
              ))}
            </div>

            {!isUserPaid ? (
              <button onClick={handlePayment} className="px-6 py-3 bg-[#DC2626] text-white rounded-xl font-bold text-sm hover:bg-[#b91c1c] transition-colors">
                Get mentored &rarr; join full access
              </button>
            ) : (
              <Link href="/student/innovation-club" className="inline-flex px-6 py-3 bg-[#D4AF37] text-white rounded-xl font-bold text-sm hover:bg-[#B8952E] transition-colors items-center gap-2">
                Enter Innovation Club <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </section>

        {/* ── SECTION 8: SNEAK PEEK ── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">Sneak Peek</p>
            <span className="px-3 py-1 bg-[#DC2626] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">Students Only</span>
          </div>
          <div className="bg-[#141b2d] rounded-3xl p-4 sm:p-6 overflow-hidden">
            <VideoWithPlayButton src={STARTING_YOUNG_VIDEO} className="shadow-2xl" />
          </div>
        </section>

        {/* ── SECTION 9: ZUNNOVA AI + AI CO-FOUNDER HERO (combined like design) ── */}
        <section className="mb-10">
          <div className="bg-gradient-to-br from-[#141b2d] to-[#1a2240] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="flex flex-col lg:flex-row gap-6 items-start relative z-10">
              <div className="flex-1 pt-4">
                <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] mb-3">Zunnova AI &middot; Your Own AI</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">Watch what Zunnova can do for your startup</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  A 2-minute look at Zunnova building pitch decks, business plans and market research on command. Full members get unlimited word balance.
                </p>
                {!isUserPaid ? (
                  <button onClick={handlePayment} className="px-6 py-3 bg-[#D4AF37] text-white rounded-full font-bold text-sm hover:bg-[#B8952E] transition-colors shadow-gold">
                    Unlock Zunnova AI &rarr;
                  </button>
                ) : (
                  <Link href="/student/modules" className="inline-flex px-6 py-3 bg-[#D4AF37] text-white rounded-full font-bold text-sm hover:bg-[#B8952E] transition-colors shadow-gold items-center gap-2">
                    Chat with Zunnova <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
              <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                <img
                  src="/AIcofounderzunnva.png"
                  alt="Zunnova AI"
                  className="w-72 sm:w-80 lg:w-[420px] h-auto object-contain drop-shadow-2xl animate-float relative z-10"
                />
              </div>
            </div>

            {/* Word Balance Bar */}
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm">Zunnova AI</span>
                    <p className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">Word Balance</p>
                  </div>
                  <span className="text-white font-extrabold text-2xl ml-4">{totalWords.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">{wordPercent}% left on free plan</span>
                  <Link href="/student/modules" className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg text-xs font-bold hover:bg-white/20 transition-colors">
                    View Packages
                  </Link>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full transition-all duration-700" style={{ width: `${wordPercent}%` }} />
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 10: AI CO-FOUNDER HERO ── */}
        <section className="mb-10 relative">
          <div className="bg-gradient-to-br from-[#F5F3EE] to-[#E8E3D8] rounded-3xl overflow-hidden relative min-h-[500px] sm:min-h-[600px] flex items-end justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
              <h2 className="text-[7rem] sm:text-[10rem] lg:text-[14rem] font-extrabold text-gray-300/30 tracking-tighter whitespace-nowrap leading-none">
                AI CO-FOUNDER
              </h2>
            </div>
            <div className="relative z-10 flex flex-col items-center">
              <img
                src="/AIcofounderzunnva.png"
                alt="Zunnova AI Co-Founder"
                className="w-80 sm:w-[420px] lg:w-[520px] h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </section>

        {/* ── SECTION 11: CATCH ZUNNOVA GAME ── */}
        <section className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Game Area - Left */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Mini Game</p>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-4">Catch Zunnova</h3>

              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">{catches}/20</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-500">Caught: {catches}</span>
                <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-500">{gameScore} pts</span>
                {gameState === 'playing' && (
                  <span className="px-3 py-1.5 bg-red-50 rounded-lg text-xs font-bold text-red-600">{gameTimeLeft}s</span>
                )}
                {gameState !== 'playing' ? (
                  <button
                    onClick={startGame}
                    className="px-5 py-1.5 bg-[#D4AF37] text-white rounded-lg text-xs font-bold hover:bg-[#B8952E] transition-colors"
                  >
                    {gameState === 'ended' ? 'Play Again' : 'Start'}
                  </button>
                ) : null}
              </div>

              {/* Game Circle */}
              <div
                ref={gameAreaRef}
                className="relative w-full aspect-square max-w-[400px] mx-auto rounded-full border-4 border-dashed border-gray-200 overflow-hidden bg-gray-50 mb-6 select-none"
                style={{ cursor: gameState === 'playing' ? 'crosshair' : 'default' }}
              >
                {gameState === 'idle' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/AIcofounderzunnva.png" alt="Zunnova" className="w-28 h-28 object-contain opacity-20" />
                  </div>
                )}
                {gameState === 'playing' && showZunnova && (
                  <button
                    onClick={catchZunnova}
                    className="absolute transition-all duration-200 hover:scale-110 active:scale-90"
                    style={{
                      left: `${zunnovaPos.x}%`,
                      top: `${zunnovaPos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <img
                      src="/AIcofounderzunnva.png"
                      alt="Catch me!"
                      className={`w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-lg ${catchAnim ? 'scale-150 opacity-0' : ''} transition-all duration-200`}
                    />
                  </button>
                )}
                {gameState === 'ended' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                    <Trophy className="w-12 h-12 text-[#D4AF37] mb-3" />
                    <p className="text-2xl font-extrabold text-gray-900">{gameScore} pts</p>
                    <p className="text-sm text-gray-500 mt-1">You caught {catches} Zunnovas!</p>
                    {catches >= 5 && <p className="text-xs text-[#D4AF37] font-bold mt-2">Bonus earned!</p>}
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Press Start, then click Zunnova before it jumps away. Every catch is 5 points.
                </p>
                <div className="flex flex-wrap gap-3 mt-3 text-[10px] font-medium text-gray-400">
                  <span>1 catch = 5 points</span>
                  <span>5 catches = 100 bonus</span>
                  <span>10+ = VIP status</span>
                </div>
              </div>
            </div>

            {/* Top Catchers - Right */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Top Catchers</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Your Scores</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">Your best games</p>

              <div className="space-y-2 flex-1">
                {catchGameScores.length > 0 ? (
                  catchGameScores.slice(0, 5).map((entry, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                        ${i === 0 ? 'bg-[#D4AF37] text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-gray-700 font-medium flex-1">{entry.name}</span>
                      <span className="text-sm font-bold text-gray-900">{entry.score}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                    <Target className="w-10 h-10 text-gray-200 mb-3" />
                    <p className="text-sm text-gray-400 font-medium">No scores yet</p>
                    <p className="text-xs text-gray-300 mt-1">Play the game to see your scores here</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 py-2 px-3 bg-[#FFF9E6] rounded-xl border border-[#D4AF37]/20">
                  <span className="w-7 h-7 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-xs font-bold text-[#B8952E]">
                    {firstName.charAt(0)}
                  </span>
                  <span className="text-sm text-[#B8952E] font-semibold flex-1">{firstName}</span>
                  <span className="text-sm font-bold text-[#B8952E]">
                    {catchGameScores.length > 0 ? Math.max(...catchGameScores.map(s => s.score)) : 0} best
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 12: LEADERBOARD & BADGES ── */}
        <section className="mb-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-5">Leaderboard & Badges</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Leaderboard */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <Trophy className="w-6 h-6 text-[#D4AF37]" />
                <h3 className="text-xl font-extrabold text-gray-900">Leaderboard</h3>
              </div>
              <p className="text-xs text-gray-400 mb-4">This week &middot; all students</p>

              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Trophy className="w-12 h-12 text-gray-200 mb-3" />
                <p className="text-sm font-medium text-gray-500">Leaderboard coming soon</p>
                <p className="text-xs text-gray-400 mt-1">Complete modules and improve your SSI to climb the ranks</p>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center gap-3 py-3 px-4 bg-[#FFF9E6] rounded-xl border border-[#D4AF37]/20">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-white text-xs font-bold">
                    {firstName.charAt(0)}
                  </div>
                  <span className="text-sm text-[#B8952E] font-semibold flex-1">You &rarr; {firstName}</span>
                  <span className="text-sm font-bold text-[#B8952E]">SSI: {Math.round(ssiScore)}</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-3">Complete all modules to appear on the leaderboard.</p>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-[#D4AF37]" />
                  <h3 className="text-xl font-extrabold text-gray-900">Your Badges</h3>
                </div>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500">{completedModules}/5</span>
              </div>
              <p className="text-xs text-gray-400 mb-6">Earned by completing modules</p>

              <div className="grid grid-cols-5 gap-3">
                {[
                  { name: 'Founder', moduleIndex: 0 },
                  { name: 'Seeker', moduleIndex: 1 },
                  { name: 'Builder', moduleIndex: 2 },
                  { name: 'Launcher', moduleIndex: -1 },
                  { name: 'Titan', moduleIndex: -1 },
                ].map((badge, i) => {
                  const unlocked = badge.moduleIndex >= 0 && sortedModules[badge.moduleIndex]
                    ? (sortedModules[badge.moduleIndex].userProgress?.completionPercentage || 0) >= 100
                    : badge.name === 'Launcher' ? completedModules >= 3
                    : badge.name === 'Titan' ? completedModules >= 3 && !!submissionData
                    : false;
                  return (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${unlocked ? 'bg-[#D4AF37]/15 shadow-gold' : 'bg-gray-100'}`}>
                        {unlocked ? (
                          <Star className="w-6 h-6 text-[#D4AF37]" />
                        ) : (
                          <Lock className="w-5 h-5 text-gray-300" />
                        )}
                      </div>
                      <span className={`text-[10px] font-medium ${unlocked ? 'text-gray-700' : 'text-gray-400'}`}>{badge.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 bg-gradient-to-br from-[#FFF9E6] to-[#FEF3C7] rounded-2xl p-5 flex items-center gap-4 border border-[#D4AF37]/20">
                <div className="w-16 h-16 flex-shrink-0">
                  <Star className="w-full h-full text-[#D4AF37] drop-shadow-lg" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Complete modules to earn badges</p>
                  <p className="text-xs text-gray-500 mt-1">Each module unlocks a unique badge. Collect all 5 to become a Future Titan.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 13: LATEST FROM US ── */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-extrabold text-gray-900">Latest From Us</h3>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-[#DC2626] text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Live
              </span>
              <span className="text-xs text-gray-400 hidden sm:inline">Audio updates from our world</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 cursor-pointer hover:text-[#D4AF37]">Follow us</span>
              <Link href="/student/innovation-club" className="text-xs font-semibold text-[#D4AF37] hover:text-[#B8952E]">See all posts</Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Cohort 4 demo day highlights', color: 'from-[#DC2626] to-[#991b1b]' },
              { title: 'Zunnova AI just crossed 10k asks', color: 'from-[#D4AF37] to-[#B8952E]' },
              { title: 'IIT mentor AMA -- recap and slides', color: 'from-[#141b2d] to-[#1a2240]' },
            ].map((post, i) => (
              <div key={i} className={`bg-gradient-to-br ${post.color} rounded-2xl p-5 text-white cursor-pointer hover:scale-[1.02] transition-transform`}>
                <div className="flex items-center gap-2 mb-3">
                  <Volume2 className="w-4 h-4 text-white/60" />
                  <span className="text-[10px] font-medium text-white/60 uppercase tracking-wider">Update</span>
                </div>
                <h4 className="font-bold text-sm leading-snug">{post.title}</h4>
              </div>
            ))}
          </div>
        </section>

      </div>

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
