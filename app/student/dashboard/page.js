'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { modules as modulesApi, payment, auth, aiChat, submission } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import {
  Lock, ChevronRight, ChevronDown, ArrowRight, CheckCircle, Zap, Play,
  Compass, Trophy, Award, Star, Clock, TrendingUp,
  MessageCircle, Flame, Target, Users, Volume2, GraduationCap, Rocket, Hexagon, Lightbulb, Flag,
  Instagram, Facebook, Linkedin, X
} from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const MODULE_IMAGES = [
  '/FounderMindset.png',
  '/SolutionSeekerJourney.png',
  '/TheEntreprenuerLaunch.png',
];

const SUCCESS_STORIES = [
  { name: 'Krishika', url: '/images/yp/KrishikaVoice.mp4', label: 'Success Story 01' },
  { name: 'Naisha', url: '/images/yp/naishaVoice.mp4', label: 'Success Story 02' },
  { name: 'Shivay', url: '/images/yp/ShivayVoice.mp4', label: 'Success Story 03' },
];

const faqData = {
  Students: [
    { q: "Who can participate in Future Titans?", a: "Students from Classes 8 to 12, from any school board across India, can participate." },
    { q: "Do I need to have an idea before joining?", a: "No. You will first go through structured learning modules (IDEA DNA™ and S.U.R.G.E.™), where you will identify a problem and develop your idea step by step." },
    { q: "Can I participate individually or do I need a team?", a: "You can participate individually or with a co-founder. Both options are allowed, and you can choose what works best for you." },
    { q: "Do I need any special skills to participate?", a: "No. You do not need any prior knowledge of business, startups, or technology. Everything is taught from the basics." },
    { q: "Will there be mentors or someone to guide us?", a: "Yes. Guidance is provided through structured modules, ZUNOVA AI interactions during chapters, and expert inputs in advanced stages." },
    { q: "Will I get a chance to try different types of ideas?", a: "Yes. During the learning journey, you will explore multiple problems before finalizing one idea for submission." },
    { q: "How can this help me in the future?", a: "You will learn how to identify problems, build solutions, test ideas and present them skills useful for any career path." },
    { q: "Will this actually help me build my own startup?", a: "It helps you understand how startups are built from idea to validation and presentation, giving you a strong foundation to pursue it in the future. The Youngpreneurs team is also here to guide you through the building of your entire startup journey." },
    { q: "What are the main steps I will go through after registering?", a: "After registration, students enter a structured, progression-based learning journey designed to take them from curiosity to creation. They go through curated modules - Founder’s Mindset, Solution Seeker Index, and Entrepreneur Launch Blueprint, divided into chapters with ZUNOVA AI interactions that contribute to their Solution Seeker Index (SSI) and track their progress.\nAfter completing the modules, students develop and submit their ideas, which go through a multi-stage screening and evaluation process.\nEvery student who registers and logs in automatically becomes a part of the Future Titans Innovation Club, where community features including student interaction, knowledge bank, and projects, will be introduced soon.\nThe Top 50 students are then selected for a Bootcamp at IIT Kharagpur, where they receive advanced exposure, mentorship and opportunities to take their ideas forward." },
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
    { q: "How do you ensure students stay engaged throughout the program?", a: "Through structured modules, interactive ZUNOVA AI sessions and progressive stages that require active participation." },
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

// YouTube video IDs (hosted on YouTube for reliable mobile playback)
const YT_STARTING_YOUNG = 'J2CXXOB7eGs';
const YT_INCUBATION = 'HrUvb2mrbH8';
const YT_SNEAK_PEEK = 'JKeL1nJySzM';
const YT_CLICK_ME_FIRST = 'GiqT3Ulbdxg';

function YouTubeEmbed({ id, className = '', aspectClass = 'aspect-video', title = 'Video' }) {
  return (
    <div className={`${aspectClass} bg-black rounded-2xl overflow-hidden ${className}`}>
      <iframe
        className="w-full h-full"
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&playsinline=1&modestbranding=1`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function StoryThumbnail({ story }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setStarted(true);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden border border-[#E7E3D6] bg-white hover:border-[#D4AF37]/60 transition-all shadow-sm">
      <div className="relative aspect-video bg-black rounded-t-xl overflow-hidden">
        <video
          ref={videoRef}
          src={story.url}
          controls={started}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          onPlay={() => setStarted(true)}
        />
        {!started && (
          <button
            onClick={handlePlay}
            aria-label={`Play ${story.name}`}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          >
            <div className="w-11 h-11 rounded-full bg-[#E5C872] hover:bg-[#D4AF37] flex items-center justify-center shadow-lg transition-transform hover:scale-110">
              <Play className="w-4 h-4 text-[#0E2A1B] fill-[#0E2A1B] ml-0.5" />
            </div>
          </button>
        )}
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[#0E2A1B] text-[13px] font-bold leading-tight">{story.name}</p>
        <p className="text-[#8A9A8E] text-[10px] font-medium mt-0.5">{story.label}</p>
      </div>
    </div>
  );
}

function YouTubeModal({ id, title, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 hover:text-white text-sm font-semibold flex items-center gap-1.5"
        >
          Close &#10005;
        </button>
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}

// Numbered rail section wrapper — the vertical 01..10 hex stepper down the left edge
function RailSection({ n, children, className = '', filled = true }) {
  return (
    <section className={`relative ${className}`}>
      <span
        className={`hidden md:flex absolute -left-[54px] top-0 w-9 h-9 text-[12px] font-extrabold items-center justify-center z-10 tabular-nums disp ${filled ? 'bg-[#C9A84C] text-[#0E2A1B]' : 'bg-[#F3F1E9] text-[#C9A84C] ring-2 ring-inset ring-[#C9A84C]'}`}
        style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
      >
        {n}
      </span>
      {children}
    </section>
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
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [activeFaqTab, setActiveFaqTab] = useState('Students');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

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
      const [modulesData, paymentData, profileData, ssi, wordBal, sub, lb] = await Promise.all([
        modulesApi.getAll().catch(() => []),
        payment.getPaymentStatus().catch(() => ({ isPaid: false })),
        auth.getProfile().catch(() => null),
        aiChat.getSSI().catch(() => null),
        aiChat.getWordBalance().catch(() => null),
        submission.get().catch(() => null),
        modulesApi.getLeaderboard(10).catch(() => null),
      ]);
      setModulesList(modulesData);
      setPaymentStatus(paymentData);
      setProfile(profileData);
      setSsiData(ssi);
      setWordBalance(wordBal);
      setSubmissionData(sub);
      setLeaderboardData(lb);
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

  const zunnovaPosRef = useRef({ x: 50, y: 50 });
  const evadeCooldownRef = useRef(false);
  const flickerTimerRef = useRef(null);

  const moveZunnova = useCallback(() => {
    const x = Math.random() * 70 + 10;
    const y = Math.random() * 70 + 10;
    zunnovaPosRef.current = { x, y };
    setZunnovaPos({ x, y });
    setShowZunnova(true);
    // Flicker: briefly vanish and reappear at a new spot
    if (flickerTimerRef.current) clearTimeout(flickerTimerRef.current);
    flickerTimerRef.current = setTimeout(() => {
      setShowZunnova(false);
      setTimeout(() => {
        const fx = Math.random() * 70 + 10;
        const fy = Math.random() * 70 + 10;
        zunnovaPosRef.current = { x: fx, y: fy };
        setZunnovaPos({ x: fx, y: fy });
        setShowZunnova(true);
      }, 150 + Math.random() * 200);
    }, 400 + Math.random() * 400);
  }, []);

  const evadeZunnova = useCallback((mouseX, mouseY) => {
    if (evadeCooldownRef.current) return;
    const area = gameAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const mousePctX = ((mouseX - rect.left) / rect.width) * 100;
    const mousePctY = ((mouseY - rect.top) / rect.height) * 100;
    const cur = zunnovaPosRef.current;
    const dx = cur.x - mousePctX;
    const dy = cur.y - mousePctY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 40) {
      evadeCooldownRef.current = true;
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 1.2;
      const jumpDist = 40 + Math.random() * 35;
      let newX = cur.x + Math.cos(angle) * jumpDist;
      let newY = cur.y + Math.sin(angle) * jumpDist;
      newX = Math.max(5, Math.min(92, newX));
      newY = Math.max(5, Math.min(92, newY));
      zunnovaPosRef.current = { x: newX, y: newY };
      setZunnovaPos({ x: newX, y: newY });
      setTimeout(() => { evadeCooldownRef.current = false; }, 30);
    }
  }, []);

  const handleGameMouseMove = useCallback((e) => {
    if (gameState !== 'playing' || !showZunnova) return;
    evadeZunnova(e.clientX, e.clientY);
  }, [gameState, showZunnova, evadeZunnova]);

  const handleGameClick = useCallback((e) => {
    if (gameState !== 'playing' || !showZunnova) return;
    const area = gameAreaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const clickPctX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickPctY = ((e.clientY - rect.top) / rect.height) * 100;
    const cur = zunnovaPosRef.current;
    const dx = cur.x - clickPctX;
    const dy = cur.y - clickPctY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 50) {
      const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.8;
      const jumpDist = 45 + Math.random() * 30;
      let newX = cur.x + Math.cos(angle) * jumpDist;
      let newY = cur.y + Math.sin(angle) * jumpDist;
      newX = Math.max(5, Math.min(92, newX));
      newY = Math.max(5, Math.min(92, newY));
      zunnovaPosRef.current = { x: newX, y: newY };
      setZunnovaPos({ x: newX, y: newY });
    }
  }, [gameState, showZunnova]);

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
        if (prev >= 39) {
          endGame();
          return prev;
        }
        return prev + 1;
      });
      moveZunnova();
    }, 700);
  }, [moveZunnova]);

  const endGame = useCallback(() => {
    setGameState('ended');
    clearInterval(gameTimerRef.current);
    clearInterval(moveTimerRef.current);
    clearTimeout(flickerTimerRef.current);
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
      clearTimeout(flickerTimerRef.current);
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

  const totalModules = sortedModules.length || 3;
  const completedModules = sortedModules.filter(m => (m.userProgress?.completionPercentage || 0) >= 100).length;
  const totalTimeMinutes = Math.round((profile?.totalTimeSpent || sortedModules.reduce((acc, m) => acc + (m.userProgress?.timeSpent || 0), 0)) / 60);
  const overallProgress = sortedModules.length > 0 ? Math.round(sortedModules.reduce((acc, m) => acc + (m.userProgress?.completionPercentage || 0), 0) / sortedModules.length) : 0;
  const ssiScore = profile?.ssiScore || ssiData?.overallScore || 0;
  const totalWords = wordBalance?.totalWords || 2000;
  const usedWords = wordBalance?.usedWords || 0;
  const remainingWords = wordBalance?.remainingWords || totalWords - usedWords;
  const wordPercent = totalWords > 0 ? Math.round((remainingWords / totalWords) * 100) : 100;
  const canSubmitIdea = completedModules >= 1;

  const activityRows = sortedModules
    .filter(m => (m.userProgress?.completionPercentage || 0) > 0)
    .slice(0, 4)
    .map((m) => ({
      lesson: m.title,
      time: `${Math.max(1, Math.round((m.userProgress?.timeSpent || 0) / 60))} min`,
      done: (m.userProgress?.completionPercentage || 0) >= 100,
      points: `+${Math.max(1, Math.round((m.userProgress?.completionPercentage || 0) / 10))}`,
    }));

  const badges = [
    { name: 'Founder', moduleIndex: 0 },
    { name: 'Seeker', moduleIndex: 1 },
    { name: 'Builder', moduleIndex: 2 },
    { name: 'Launcher', moduleIndex: -1 },
    { name: 'Titan', moduleIndex: -1 },
  ];
  const isBadgeUnlocked = (badge) =>
    badge.moduleIndex >= 0 && sortedModules[badge.moduleIndex]
      ? (sortedModules[badge.moduleIndex].userProgress?.completionPercentage || 0) >= 100
      : badge.name === 'Launcher' ? completedModules >= 3
        : badge.name === 'Titan' ? completedModules >= 3 && !!submissionData
          : false;
  const badgesEarned = badges.filter(isBadgeUnlocked).length;

  const ssiPct = Math.min(100, Math.max(0, ssiScore));
  const ssiCirc = 2 * Math.PI * 42;

  return (
    <div className="gamified-dash gamified-dash-bg min-h-screen pb-20">

      {/* ── BODY with numbered rail (top nav comes from the global <Navbar /> in app/layout.js) ── */}
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="relative md:pl-[70px]">
          {/* the gold rail line */}
          <div className="hidden md:block absolute left-[16px] top-4 bottom-24 w-px bg-gradient-to-b from-[#C9A84C]/70 via-[#C9A84C]/35 to-transparent" />
          <div className="hidden md:block absolute left-[16px] bottom-4 h-24 border-l border-dashed border-[#C9A84C]/30" />

          <div className="space-y-8 sm:space-y-10">

            {/* ── 01 · GREETING + SSI ── */}
            <RailSection n="01">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col justify-center">
                  <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[0.95] text-[#0E2A1B]">
                    Hey, <span className="text-[#2E7D46]">{firstName}</span>
                  </h1>
                  <p className="text-[#3B4A40] text-lg sm:text-xl mt-4 font-medium">What&apos;s your next move?</p>

                  {/* decorative progress marker row */}
                  <div className="flex items-center gap-2.5 mt-6">
                    <span className="w-3 h-3 border-2 border-[#C9A84C] rotate-45 inline-block" />
                    <span className="w-12 h-[3px] bg-[#0E2A1B]" />
                    <span className="w-7 h-[3px] bg-[#C9A84C]/45" />
                    <span className="w-5 h-[3px] bg-[#C9A84C]/30" />
                    <span className="w-3 h-[3px] bg-[#C9A84C]/20" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-6">
                    <button
                      onClick={() => setShowIntroVideo(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#0E2A1B] text-[#E5C872] text-sm font-bold hover:bg-[#123420] transition-colors"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                      <Play className="w-4 h-4" /> Click Me First
                    </button>
                    <button
                      onClick={() => setShowFAQ(true)}
                      className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#0E2A1B]/20 bg-white/60 text-[#0E2A1B] text-sm font-bold hover:border-[#C9A84C] transition-all"
                      style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                    >
                      <MessageCircle className="w-4 h-4" /> Got Questions?
                    </button>
                  </div>
                </div>

                {/* SSI Score card — double-cut corners + segmented gauge */}
                <div
                  className="relative bg-[linear-gradient(150deg,#123420,#08160D)] p-6 sm:p-7 flex items-center gap-4 overflow-hidden"
                  style={{ clipPath: 'polygon(0 22px, 22px 0, 100% 0, 100% 100%, 22px 100%, 0 calc(100% - 22px))' }}
                >
                  <div className="absolute -top-8 -right-8 w-48 h-48 bg-[#E5C872]/10 blur-[70px] rounded-full pointer-events-none" />
                  <div className="relative z-10 flex-1">
                    <p className="text-[#E5C872] text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5" fill="currentColor" /> Your SSI Score
                    </p>
                    <p className="text-[#9FB5A6] text-[13px] mt-2 leading-snug max-w-[200px]">SSI adds up module progress, badges and Catch Zunnova points.</p>
                    <div className="flex items-center gap-1 mt-4">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <span key={i} className="w-6 h-[3px] bg-[#C9A84C]/25" />
                      ))}
                    </div>
                  </div>
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <svg viewBox="0 0 120 120" className="w-full h-full">
                      {Array.from({ length: 48 }).map((_, i) => {
                        const ang = (i / 48) * 2 * Math.PI - Math.PI / 2;
                        const on = (i / 48) <= (ssiPct / 100) && ssiPct > 0;
                        const x1 = 60 + 46 * Math.cos(ang), y1 = 60 + 46 * Math.sin(ang);
                        const x2 = 60 + 54 * Math.cos(ang), y2 = 60 + 54 * Math.sin(ang);
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? '#E5C872' : 'rgba(229,200,114,0.18)'} strokeWidth="2.5" strokeLinecap="round" />;
                      })}
                      <circle cx="60" cy="14" r="2.5" fill="#E5C872" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-extrabold text-white leading-none disp">{Math.round(ssiScore)}</span>
                      <span className="text-[10px] text-[#C9A84C] uppercase tracking-[0.25em] mt-1">Points</span>
                    </div>
                  </div>
                </div>
              </div>
            </RailSection>

            {/* ── 02 · UNLOCK FULL ACCESS ── */}
            {!isUserPaid && (
              <RailSection n="02">
                <div
                  className="bg-[linear-gradient(120deg,#123420,#08160D)] px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative overflow-hidden"
                  style={{ clipPath: 'polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px)' }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_120%,rgba(201,168,76,0.18),transparent_55%)] pointer-events-none" />
                  {/* fanned gold hairline texture */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 700 200" preserveAspectRatio="none" aria-hidden="true">
                    {Array.from({ length: 48 }).map((_, i) => {
                      const ox = 725, oy = 220;
                      const ang = Math.PI * (1.02 + i * 0.0102);
                      const len = 1200;
                      return (
                        <line
                          key={i}
                          x1={ox} y1={oy}
                          x2={ox + Math.cos(ang) * len}
                          y2={oy + Math.sin(ang) * len}
                          stroke="#C9A84C"
                          strokeWidth="0.5"
                          strokeOpacity={0.16}
                        />
                      );
                    })}
                  </svg>
                  {/* gold corner brackets */}
                  <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#C9A84C]/70 pointer-events-none" />
                  <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#C9A84C]/70 pointer-events-none" />

                  <div className="flex items-start gap-3.5 relative z-10">
                    <div className="w-10 h-10 bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                      <Lock className="w-4 h-4 text-[#E5C872]" />
                    </div>
                    <div>
                      <h3 className="text-[#E5C872] font-extrabold text-xl sm:text-2xl">Unlock Full Access</h3>
                      <p className="text-[#9FB5A6] text-sm mt-1.5 max-w-xl leading-relaxed">All 3 modules, unlimited Zunnova AI, IIT mentorship and the Innovation Club — everything below is waiting for you.</p>
                      <div className="flex items-center gap-1.5 mt-4">
                        {[0, 1, 2, 3].map((i) => (
                          <span key={i} className="w-8 h-[3px] bg-[#C9A84C]/25" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex-shrink-0">
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#C9A84C] pointer-events-none" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#C9A84C] pointer-events-none" />
                    <button
                      onClick={handlePayment}
                      className="flex items-center gap-2 bg-[linear-gradient(135deg,#E5C872,#C9A84C)] text-[#0E2A1B] px-7 py-3.5 font-extrabold text-sm hover:brightness-105 transition-all shadow-[0_8px_24px_rgba(201,168,76,0.3)]"
                      style={{ clipPath: 'polygon(11px 0, 100% 0, 100% calc(100% - 11px), calc(100% - 11px) 100%, 0 100%, 0 11px)' }}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Pay &#8377;1500 + 18% GST
                    </button>
                  </div>
                </div>
              </RailSection>
            )}

            {/* ── 03 · QUICK ACTION CARDS ── */}
            <RailSection n="03" filled={false}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { href: '/student/modules', step: '01', tag: `${totalModules} MODULES WAITING`, Icon: GraduationCap, title: 'Learn something new', desc: 'Three modules, from founder mindset to launch.', locked: false, filledIcon: false, marker: 'bars' },
                  { href: canSubmitIdea ? '/student/submission' : '/student/modules', step: '02', tag: 'UNLOCKS AFTER MODULE 1', Icon: Lightbulb, title: 'Build an idea', desc: 'Turn what you learn into a real submission.', locked: !canSubmitIdea, filledIcon: false, marker: 'bars' },
                  { href: '/student/innovation-club', step: '03', tag: 'MENTORS & COMMUNITY', Icon: Rocket, title: 'Explore the Club', desc: 'Mentorship, incubation and the wider Youngpreneurs community.', locked: false, filledIcon: true, marker: 'diamonds' },
                ].map((c) => {
                  const Icon = c.Icon;
                  const lk = c.locked;
                  const TL_CUT = 'polygon(18px 0, 100% 0, 100% 100%, 0 100%, 0 18px)';
                  return (
                    <Link key={c.step} href={c.href} className="group">
                      <div
                        className={`relative pt-12 px-6 pb-5 h-full flex flex-col border transition-all ${lk ? 'bg-[#EDECE6] border-[#DEDCD3]' : 'bg-white border-[#E7E3D6] hover:shadow-lg hover:border-[#C9A84C]/40'}`}
                        style={{ clipPath: TL_CUT }}
                      >
                        {/* angled number tab */}
                        <div
                          className={`absolute top-0 left-0 pl-4 pr-6 py-1.5 text-[12px] font-extrabold disp ${lk ? 'bg-[#C7CBC3] text-[#5B6B60]' : 'bg-[#0E2A1B] text-[#E5C872]'}`}
                          style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)' }}
                        >
                          {c.step}
                        </div>
                        <span className={`absolute top-[15px] left-[52px] w-8 h-[2px] ${lk ? 'bg-[#C7CBC3]' : 'bg-[#C9A84C]/50'}`} />
                        {/* right tag */}
                        <div className={`absolute top-3.5 right-5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] ${lk ? 'text-[#9A9E96]' : 'text-[#0E2A1B]/55'}`}>
                          {lk && <Lock className="w-3 h-3" />}
                          {!lk && <span className="w-2 h-2 border border-[#C9A84C] rotate-45 inline-block" />}
                          {c.tag}
                        </div>

                        {/* hex icon */}
                        <div
                          className={`w-14 h-14 flex items-center justify-center mb-4 ${c.filledIcon ? 'bg-[#0E2A1B]' : lk ? 'bg-[#E2E1DB]' : 'bg-[#EAF0EA]'}`}
                          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                        >
                          <Icon className={`w-6 h-6 ${c.filledIcon ? 'text-[#E5C872]' : lk ? 'text-[#9A9E96]' : 'text-[#1E5233]'}`} />
                        </div>

                        <h3 className={`font-extrabold text-[19px] mb-1.5 ${lk ? 'text-[#6B7268]' : 'text-[#0E2A1B]'}`}>{c.title}</h3>
                        <p className={`text-[13px] leading-snug mb-4 ${lk ? 'text-[#9A9E96]' : 'text-[#8A9A8E]'}`}>{c.desc}</p>

                        {/* footer markers + arrow */}
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {c.marker === 'bars' ? (
                              <>
                                <span className={`w-5 h-[3px] ${lk ? 'bg-[#D3D1C9]' : 'bg-[#D8D5CA]'}`} />
                                <span className={`w-5 h-[3px] ${lk ? 'bg-[#D3D1C9]' : 'bg-[#D8D5CA]'}`} />
                                <span className={`w-5 h-[3px] ${lk ? 'bg-[#D3D1C9]' : 'bg-[#D8D5CA]'}`} />
                                <span className={`w-2.5 h-2.5 border rotate-45 inline-block ml-0.5 ${lk ? 'border-[#B9B7AE]' : 'border-[#C9A84C]'}`} />
                              </>
                            ) : (
                              <>
                                <span className="w-2.5 h-2.5 border border-[#2E7D46]/50 rotate-45 inline-block" />
                                <span className="w-2.5 h-2.5 border border-[#2E7D46]/50 rotate-45 inline-block" />
                                <span className="w-2.5 h-2.5 border border-[#2E7D46]/50 rotate-45 inline-block" />
                              </>
                            )}
                          </div>
                          <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${lk ? 'text-[#9A9E96]' : 'text-[#C9A84C]'}`} />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </RailSection>

            {/* ── 04 · MY TITAN JOURNEY ── */}
            <RailSection n="04">
              <div className="bg-white cut-panel border border-[#E7E3D6] overflow-hidden">
                {/* header tab */}
                <div className="relative bg-[linear-gradient(120deg,#123420,#08160D)] px-6 sm:px-8 h-16 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="hex w-9 h-9 bg-[#C9A84C] flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-[#0E2A1B]" />
                    </div>
                    <h3 className="text-white text-xl sm:text-2xl font-extrabold">My Titan Journey</h3>
                  </div>
                  <Link
                    href="/student/profile"
                    className="flex items-center gap-1.5 px-4 py-2 border border-[#C9A84C]/60 text-[#E5C872] text-[13px] font-bold hover:bg-[#C9A84C]/10 transition-all"
                    style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <div className="absolute left-0 bottom-0 translate-y-full w-48 h-3.5 bg-[#123420]" style={{ clipPath: 'polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%)' }} />
                </div>

                {/* body */}
                <div className="p-6 sm:p-8">
                  {/* modules % + segmented progress */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[#8A9A8E] text-[11px] font-bold uppercase tracking-widest">Modules</span>
                    <span className="text-[#0E2A1B] text-2xl font-extrabold disp">{overallProgress}%</span>
                    <div className="flex-1 h-3 bg-[#EDEBE2] relative overflow-hidden ml-2">
                      <div className="absolute inset-y-0 left-0 bg-[#C9A84C] transition-all duration-700" style={{ width: `${overallProgress}%` }} />
                      <div className="absolute inset-0 flex">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <span key={i} className="flex-1 border-r border-white/70 last:border-r-0" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* journey map */}
                  <div className="relative bg-[#FAFAF6] border border-[#ECEAE0] cut-card p-6 sm:p-8 mb-6 overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 300" preserveAspectRatio="none" aria-hidden="true">
                      {[70, 140, 210, 280].map((r) => (
                        <circle key={'a' + r} cx="150" cy="150" r={r} fill="none" stroke="rgba(46,125,70,0.06)" strokeWidth="1" />
                      ))}
                      {[70, 140, 210].map((r) => (
                        <circle key={'b' + r} cx="820" cy="180" r={r} fill="none" stroke="rgba(46,125,70,0.05)" strokeWidth="1" />
                      ))}
                    </svg>

                    <div className="relative">
                      {/* connector track */}
                      <div className="absolute top-7 left-8 right-8 border-t-2 border-dashed border-[#D8D5CA]" />
                      <div className="absolute top-7 left-8 border-t-2 border-[#C9A84C] transition-all duration-700" style={{ width: `calc((100% - 4rem) * ${Math.max(0, overallProgress) / 100})` }} />

                      <div className="relative flex items-center justify-between px-2">
                        {[0, 1, 2].map((i) => {
                          const mod = sortedModules[i];
                          const done = (mod?.userProgress?.completionPercentage || 0) >= 100;
                          const started = (mod?.userProgress?.completionPercentage || 0) > 0;
                          const active = i === 0 || started || done;
                          const locked = i > 0 && !((sortedModules[i - 1]?.userProgress?.completionPercentage || 0) >= 100);
                          return (
                            <div key={i} className="relative z-10 flex flex-col items-center" style={{ minWidth: 56 }}>
                              <div className={`hex w-14 h-14 flex items-center justify-center text-lg font-extrabold disp shadow-sm ${active ? 'bg-[#C9A84C] text-[#0E2A1B]' : 'bg-white text-[#9A9E96] ring-2 ring-inset ring-[#DAD7CC]'}`}>
                                {String(i + 1).padStart(2, '0')}
                              </div>
                              {active && <span className="mt-2 w-10 h-[3px] bg-[#C9A84C]" />}
                              {locked && (
                                <div className="mt-2 w-6 h-6 rounded-full bg-white border border-[#E0DDD2] flex items-center justify-center">
                                  <Lock className="w-3 h-3 text-[#B9B7AE]" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* milestone flag */}
                    <div className="relative flex items-center justify-center gap-2 mt-6">
                      <div className="hex w-9 h-9 bg-white ring-2 ring-inset ring-[#DAD7CC] flex items-center justify-center">
                        <Flag className="w-4 h-4 text-[#B9B7AE]" />
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-[#9A9E96] font-semibold">{completedModules}/{totalModules} Milestones</span>
                    </div>
                  </div>

                  {/* stats row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                    {[
                      { val: totalTimeMinutes > 0 ? `${(totalTimeMinutes / 60).toFixed(1)}h` : '0.0h', label: 'Time Tracked', Icon: Clock, gold: false },
                      { val: `${completedModules}/${totalModules}`, label: 'Modules', Icon: CheckCircle, gold: false },
                      { val: `${completedModules}/${totalModules}`, label: 'Milestones', Icon: Target, gold: false },
                      { val: `${badgesEarned}`, label: 'Badges', Icon: Trophy, gold: true },
                    ].map((s, i) => {
                      const Icon = s.Icon;
                      return (
                        <div key={i} className={`relative cut-card p-4 ${s.gold ? 'bg-[#FBF3DA] border border-[#EAD9A0]' : 'bg-[#F6F5EF] border border-[#ECEAE0]'}`}>
                          <Icon className={`absolute top-3 right-3 w-4 h-4 ${s.gold ? 'text-[#B8952E]' : 'text-[#BDBBB2]'}`} />
                          <p className={`text-3xl font-extrabold disp ${s.gold ? 'text-[#B8952E]' : 'text-[#0E2A1B]'}`}>{s.val}</p>
                          <p className="text-[11px] text-[#8A9A8E] font-medium uppercase tracking-wide mt-1">{s.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* recent activity + streak/badges */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[#0E2A1B] font-extrabold text-lg">Recent Activity</h4>
                        <Link href="/student/modules" className="text-[11px] text-[#B8952E] font-bold uppercase tracking-wide">View All</Link>
                      </div>
                      <div className="overflow-x-auto border border-[#EEECE3] cut-card">
                        <table className="w-full text-left min-w-[440px]">
                          <thead>
                            <tr className="text-[10px] uppercase tracking-wider text-[#9A9E96] bg-[#F6F5EF]">
                              <th className="font-semibold px-4 py-2.5">Lesson</th>
                              <th className="font-semibold px-2 py-2.5">Time</th>
                              <th className="font-semibold px-2 py-2.5">Status</th>
                              <th className="font-semibold px-2 py-2.5">Points</th>
                              <th className="font-semibold px-4 py-2.5 text-right">Added On</th>
                            </tr>
                          </thead>
                          <tbody>
                            {activityRows.length > 0 ? activityRows.map((r, i) => (
                              <tr key={i} className="border-t border-[#EEECE3]">
                                <td className="px-4 py-3 text-[13px] text-[#0E2A1B] font-semibold truncate max-w-[180px] border-l-2 border-[#2E7D46]">{r.lesson}</td>
                                <td className="px-2 py-3 text-[12px] text-[#8A9A8E]">{r.time}</td>
                                <td className="px-2 py-3">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 inline-flex items-center gap-1 ${r.done ? 'bg-[#E7F2EC] text-[#2C7A57]' : 'bg-[#FBF3DA] text-[#B8952E]'}`}>
                                    <span className="w-1.5 h-1.5 rotate-45 bg-current inline-block" />{r.done ? 'Done' : 'New'}
                                  </span>
                                </td>
                                <td className="px-2 py-3 text-[13px] text-[#B8952E] font-bold">{r.points}</td>
                                <td className="px-4 py-3 text-[12px] text-[#8A9A8E] text-right">—</td>
                              </tr>
                            )) : (
                              <tr className="border-t border-[#EEECE3]">
                                <td colSpan="5" className="px-4 py-5 text-[13px] text-[#9A9E96] text-center">No activity yet — start a module to begin your journey.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex flex-col gap-5">
                      <div className="cut-card bg-white border border-[#E7E3D6] p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Flame className="w-4 h-4 text-[#E5936B]" />
                          <h4 className="text-[#0E2A1B] font-extrabold text-base">Learning Streak</h4>
                        </div>
                        <p className="text-[13px] text-[#8A9A8E]"><span className="text-[#0E2A1B] font-bold">0 Days.</span> Keep going! Consistency is the key to success.</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[12px] font-bold text-[#B8952E] flex items-center gap-1.5">
                            <span className="w-2 h-2 rotate-45 bg-[#C9A84C] inline-block" /> 3-day streak
                          </span>
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="w-5 h-[4px] bg-[#E0DDD2]" />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[#0E2A1B] font-extrabold text-base mb-3">Badges</h4>
                        <div className="flex items-center gap-2">
                          {[Award, Star, Trophy].map((Ic, i) => {
                            const unlocked = isBadgeUnlocked(badges[i]);
                            return (
                              <div key={i} className="flex items-center gap-2">
                                <div className={`hex w-11 h-11 flex items-center justify-center ${unlocked ? 'bg-[#FBF3DA] ring-2 ring-inset ring-[#EAD9A0]' : 'bg-[#F3F1E9] ring-1 ring-inset ring-[#E0DDD2]'}`} title={badges[i]?.name}>
                                  <Ic className={`w-4 h-4 ${unlocked ? 'text-[#C9A84C]' : 'text-[#C3C1B8]'}`} />
                                </div>
                                {i < 2 && <span className="w-4 border-t border-dashed border-[#D8D5CA]" />}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </RailSection>

            {/* ── 05 · FROM CAMPUS IDEA TO REAL IMPACT ── */}
            <RailSection n="05">
              <div
                className="bg-[linear-gradient(120deg,#123420,#0A1E13)] relative overflow-hidden p-8 sm:p-10"
                style={{ clipPath: 'polygon(28px 0, 100% 0, 100% 100%, 0 100%, 0 28px)' }}
              >
                {/* faint grid texture */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.5] bg-[linear-gradient(rgba(201,168,76,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.05)_1px,transparent_1px)] bg-[length:38px_38px]" />
                <div className="absolute -top-8 -right-8 w-72 h-72 bg-[#E5C872]/8 blur-[90px] rounded-full pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
                  {/* left — text */}
                  <div>
                    <p className="text-[#C9A84C] text-[11px] font-bold uppercase tracking-[0.25em] flex items-center gap-2.5 mb-5">
                      <span className="w-6 h-[2px] bg-[#C9A84C]" /> Success Stories
                    </p>
                    <h2 className="text-white text-4xl sm:text-5xl font-extrabold leading-[0.95] mb-4">From Campus Idea<br />to Real Impact</h2>
                    <p className="text-[#9FB5A6] text-[15px] leading-relaxed max-w-md">See how youngpreneurs turned ideas into impactful ventures and inspired others.</p>
                    <div className="flex items-center gap-2.5 mt-6">
                      <span className="w-3 h-3 border-2 border-[#C9A84C] rotate-45 inline-block" />
                      <span className="w-10 h-[2px] bg-[#C9A84C]" />
                      <span className="w-5 h-[2px] bg-[#C9A84C]/40" />
                      <span className="w-3 h-[2px] bg-[#C9A84C]/25" />
                    </div>
                  </div>

                  {/* right — framed video */}
                  <div className="relative aspect-video">
                    <span className="absolute -top-1.5 -left-1.5 w-7 h-7 border-t-2 border-l-2 border-[#C9A84C]/70 z-10 pointer-events-none" />
                    <span className="absolute -top-1.5 -right-1.5 w-7 h-7 border-t-2 border-r-2 border-[#C9A84C]/70 z-10 pointer-events-none" />
                    <span className="absolute -bottom-1.5 -left-1.5 w-7 h-7 border-b-2 border-l-2 border-[#C9A84C]/70 z-10 pointer-events-none" />
                    <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 border-b-2 border-r-2 border-[#C9A84C]/70 z-10 pointer-events-none" />
                    <YouTubeEmbed id={YT_STARTING_YOUNG} title="From Campus Idea to Real Impact" aspectClass="aspect-video" className="w-full h-full shadow-2xl" />
                  </div>
                </div>
              </div>
            </RailSection>

            {/* ── 06 · THIS IS WHAT STARTING YOUNG LOOKS LIKE ── */}
            <RailSection n="06">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E2A1B]">This is what starting Young looks like</h2>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full border border-[#0E2A1B]/15 flex items-center justify-center text-[#0E2A1B]"><ChevronRight className="w-4 h-4 rotate-180" /></span>
                  <span className="w-8 h-8 rounded-full border border-[#0E2A1B]/15 flex items-center justify-center text-[#0E2A1B]"><ChevronRight className="w-4 h-4" /></span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {SUCCESS_STORIES.map((story, i) => (
                  <StoryThumbnail key={i} story={story} />
                ))}
              </div>
            </RailSection>

            {/* ── 07 · INNOVATION ECOSYSTEM ── */}
            <RailSection n="07">
              <div className="mb-4">
                <p className="text-[#B8952E] text-[11px] font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5">
                  <Hexagon className="w-3.5 h-3.5" fill="currentColor" /> Innovation Club
                </p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0E2A1B]">From Idea to Venture — The Innovation Ecosystem</h2>
                <p className="text-[#8A9A8E] text-sm mt-2 max-w-2xl">The Club is where the learning turns into a venture — mentor circles, live builds and a cohort that ships alongside you.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                <div className="lg:col-span-3 bg-[linear-gradient(160deg,#123420,#0A1E13)] cut-card p-5 relative">
                  <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-[#E5C872] text-[#0E2A1B] rounded-full text-[10px] font-bold uppercase tracking-wider">2 min tour</span>
                  <YouTubeEmbed id={YT_INCUBATION} title="Innovation Club tour" className="shadow-lg" />
                  <p className="text-[#E5C872] text-[11px] font-bold uppercase tracking-widest mt-4">Innovation Club · The Tour</p>
                  <h3 className="text-white font-bold text-lg mt-1">See what a week in the Club looks like</h3>
                  <p className="text-[#9FB5A6] text-sm mt-1">Mentor circles, build sessions and demo day — filmed inside the last cohort.</p>
                </div>
                <div className="lg:col-span-2 bg-white cut-card p-6 border border-[#E7E3D6] flex flex-col">
                  <h3 className="font-extrabold text-[#0E2A1B] text-lg mb-4">What you get inside</h3>
                  <div className="space-y-3 flex-1">
                    {[
                      { n: '01', t: 'Webinar', d: 'Sessions with IIT mentors and working founders.' },
                      { n: '02', t: 'Inter-School Hackathons', d: '' },
                      { n: '03', t: 'Innovation Library', d: '' },
                      { n: '04', t: 'Live Q&A', d: '' },
                    ].map((item) => (
                      <div key={item.n} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-md bg-[#FBF3DA] text-[#B8952E] flex items-center justify-center text-[10px] font-bold flex-shrink-0 tabular-nums">{item.n}</span>
                        <div>
                          <p className="text-[#0E2A1B] font-bold text-sm">{item.t}</p>
                          {item.d && <p className="text-[#8A9A8E] text-xs mt-0.5">{item.d}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#8A9A8E] flex items-center gap-1.5 mt-4 mb-4">
                    <CheckCircle className="w-3.5 h-3.5 text-[#2E7D46]" /> Included with full access
                  </p>
                  {!isUserPaid ? (
                    <button onClick={handlePayment} className="w-full py-3 bg-[#0E2A1B] text-[#E5C872] rounded-xl font-bold text-sm hover:bg-[#123420] transition-colors flex items-center justify-center gap-2">
                      Explore the Club <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link href="/student/innovation-club" className="w-full py-3 bg-[#0E2A1B] text-[#E5C872] rounded-xl font-bold text-sm hover:bg-[#123420] transition-colors flex items-center justify-center gap-2">
                      Explore the Club <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </RailSection>

            {/* ── 08 · ZUNNOVA AI + AI CO-FOUNDER ── */}
            <RailSection n="08">
              <div className="bg-[linear-gradient(160deg,#123420,#0A1E13)] cut-panel p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#E5C872]/8 blur-[140px] rounded-full pointer-events-none" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[#E5C872] text-[11px] font-bold uppercase tracking-[0.2em]">Zunnova AI · Our Own AI</p>
                    <span className="px-3 py-1 bg-[#E5C872]/15 text-[#E5C872] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[#E5C872]/25">Members Only</span>
                  </div>
                  <YouTubeEmbed id={YT_SNEAK_PEEK} title="Zunnova AI teaser" className="shadow-2xl mb-6" />
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 leading-tight">Watch what Zunnova can do for your startup</h2>
                  <p className="text-[#9FB5A6] text-sm leading-relaxed mb-6 max-w-xl">
                    A 2-minute look at Zunnova building pitch decks, business plans and market research on command. Full members get unlimited word balance.
                  </p>
                  {!isUserPaid ? (
                    <button onClick={handlePayment} className="px-6 py-3 bg-[#E5C872] text-[#0E2A1B] rounded-full font-bold text-sm hover:bg-[#D4AF37] transition-colors shadow-[0_8px_24px_rgba(229,200,114,0.25)]">
                      Unlock Zunnova AI &rarr;
                    </button>
                  ) : (
                    <Link href="/student/modules" className="inline-flex px-6 py-3 bg-[#E5C872] text-[#0E2A1B] rounded-full font-bold text-sm hover:bg-[#D4AF37] transition-colors shadow-[0_8px_24px_rgba(229,200,114,0.25)] items-center gap-2">
                      Chat with Zunnova <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>

              {/* word balance bar */}
              <div className="relative z-20 mx-4 sm:mx-8 -mt-6">
                <div className="bg-white rounded-2xl p-4 shadow-xl border border-[#E7E3D6]">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="hex w-10 h-10 bg-[#0E2A1B] flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-[#E5C872]" />
                      </div>
                      <div>
                        <span className="font-bold text-[#0E2A1B] text-sm">Zunnova AI</span>
                        <p className="text-[10px] text-[#B8952E] font-bold uppercase tracking-wider">Word Balance</p>
                      </div>
                      <span className="text-[#0E2A1B] font-extrabold text-3xl ml-4">{totalWords.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#8A9A8E]">{wordPercent}% asks left on free plan</span>
                      <Link href="/student/modules" className="px-4 py-2 bg-[#0E2A1B] text-[#E5C872] rounded-lg text-xs font-bold hover:bg-[#123420] transition-colors">
                        View Packages
                      </Link>
                    </div>
                  </div>
                  <div className="w-full bg-[#F3F1E9] rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-[#E5C872] rounded-full transition-all duration-700" style={{ width: `${wordPercent}%` }} />
                  </div>
                </div>
              </div>

              {/* AI CO-FOUNDER — standalone light banner */}
              <div className="relative mt-10 bg-[#EDF1EA] border border-[#DDE4D9] cut-panel overflow-hidden min-h-[260px]">
                {/* faint grid texture */}
                <div className="absolute inset-0 pointer-events-none opacity-60 bg-[linear-gradient(rgba(46,125,70,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(46,125,70,0.05)_1px,transparent_1px)] bg-[length:34px_34px]" />

                <div className="relative z-10 p-8 sm:p-10 max-w-[62%]">
                  {/* signal + marker row */}
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="flex items-end gap-0.5">
                      <span className="w-1 h-1.5 bg-[#2E7D46]" />
                      <span className="w-1 h-2.5 bg-[#2E7D46]" />
                      <span className="w-1 h-3.5 bg-[#2E7D46]" />
                      <span className="w-1 h-4 bg-[#2E7D46]/40" />
                    </div>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D46]" />
                    <span className="w-16 border-t border-dashed border-[#B9C4B8]" />
                    <span className="w-8 h-2 bg-[#C9A84C]/40" />
                  </div>

                  <h2 className="text-4xl sm:text-5xl font-extrabold text-[#0E2A1B] leading-none mb-6">Ai Co-founder</h2>

                  <div className="flex items-center gap-4">
                    <Link
                      href="/student/modules"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#CBD3C8] text-[#0E2A1B] text-sm font-bold hover:border-[#C9A84C] transition-all"
                      style={{ clipPath: 'polygon(9px 0, 100% 0, 100% calc(100% - 9px), calc(100% - 9px) 100%, 0 100%, 0 9px)' }}
                    >
                      See all messages <ArrowRight className="w-4 h-4" />
                    </Link>
                    <div className="hidden sm:flex items-center gap-1.5">
                      <span className="w-6 h-[3px] bg-[#2E7D46]/40" />
                      <span className="w-4 h-[3px] bg-[#C9A84C]/40" />
                      <span className="w-4 h-[3px] bg-[#D3D8CE]" />
                    </div>
                  </div>
                </div>

                {/* character + orbit */}
                <div className="absolute right-2 sm:right-10 bottom-0 top-0 flex items-end pointer-events-none">
                  <div className="relative flex items-end">
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-72 sm:h-72 rounded-full border border-dashed border-[#C9A84C]/30" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-52 sm:h-52 rounded-full border border-[#C9A84C]/15" />
                    <img
                      src="/AIcofounderzunnva.png"
                      alt="Zunnova AI Co-Founder"
                      className="relative w-[200px] sm:w-[260px] md:w-[300px] h-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </RailSection>

            {/* ── 09 · CATCH ZUNNOVA + TOP CATCHERS ── */}
            <RailSection n="09">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-[linear-gradient(160deg,#0A1E13,#06120B)] cut-panel p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E5C872] mb-2">Mini Game</p>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Catch Zunnova</h3>
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-bold text-[#E5936B]">
                        {gameState === 'playing' ? `0:${gameTimeLeft.toString().padStart(2, '0')}` : '0:20'}
                      </span>
                      <span className="px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-medium text-white">Caught {catches}</span>
                      <span className="px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-medium text-white">{gameScore} pts</span>
                      {gameState !== 'playing' && (
                        <button
                          onClick={startGame}
                          className="px-6 py-1.5 bg-[#E5C872] text-[#0E2A1B] rounded-full text-xs font-bold hover:bg-[#D4AF37] transition-all shadow-[0_0_15px_rgba(229,200,114,0.2)]"
                        >
                          {gameState === 'ended' ? 'Play Again' : 'Start'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    ref={gameAreaRef}
                    onMouseMove={handleGameMouseMove}
                    onClick={handleGameClick}
                    className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-[#050D08] border border-white/5 mb-5 select-none flex-1 min-h-[250px]"
                    style={{ cursor: gameState === 'playing' ? 'crosshair' : 'default' }}
                  >
                    {gameState === 'idle' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#E5C872]/20 blur-xl rounded-full" />
                          <img src="/AIcofounderzunnva.png" alt="Zunnova" className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-80 mb-6 animate-float" />
                        </div>
                        <p className="text-[#9FB5A6] text-xs text-center px-8 font-medium">
                          Press Start, then click Zunnova before it slips away. Every catch is 5 points.
                        </p>
                      </div>
                    )}
                    {gameState === 'playing' && showZunnova && (
                      <button
                        onClick={(e) => { e.stopPropagation(); catchZunnova(); }}
                        className="absolute active:scale-75"
                        style={{
                          left: `${zunnovaPos.x}%`,
                          top: `${zunnovaPos.y}%`,
                          transform: 'translate(-50%, -50%)',
                          transition: 'left 0.05s linear, top 0.05s linear',
                          padding: 0,
                        }}
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#E5C872]/15 blur-md rounded-full" />
                          <img
                            src="/zunnova.svg"
                            alt="Catch me!"
                            className={`relative w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-lg ${catchAnim ? 'scale-150 opacity-0' : ''} transition-all duration-100`}
                          />
                        </div>
                      </button>
                    )}
                    {gameState === 'ended' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050D08]/90 backdrop-blur-sm">
                        <Trophy className="w-12 h-12 text-[#E5C872] mb-3" />
                        <p className="text-2xl font-extrabold text-white">{gameScore} pts</p>
                        <p className="text-sm text-[#9FB5A6] mt-1">You caught {catches} Zunnovas!</p>
                        {catches >= 5 && <p className="text-xs text-[#E5C872] font-bold mt-2">Bonus earned!</p>}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <span className="text-[#9FB5A6] mr-2">Best today <span className="text-[#E5C872] font-bold">{catchGameScores.length > 0 ? Math.max(...catchGameScores.map(s => s.score)) : 0}</span></span>
                    <span className="px-3.5 py-1.5 rounded-full text-[#9FB5A6] border border-white/10">1 catch = 5 points</span>
                    <span className="px-3.5 py-1.5 rounded-full text-[#9FB5A6] border border-white/10">5 catches = +20 bonus</span>
                    <span className="px-3.5 py-1.5 rounded-full text-[#9FB5A6] border border-white/10">8+ = +50 bonus</span>
                  </div>
                </div>

                {/* Top Catchers */}
                <div className="lg:col-span-1 bg-[linear-gradient(160deg,#123420,#0A1E13)] cut-panel p-6 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-white text-xl">Top Catchers</h3>
                    <span className="px-3 py-1 border border-white/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-[#9FB5A6]">Today</span>
                  </div>
                  <p className="text-xs text-[#9FB5A6] mb-5 font-medium">Catch Zunnova high scores</p>

                  <div className="space-y-2 flex-1">
                    {catchGameScores.length > 0 ? (
                      catchGameScores.slice(0, 5).map((entry, i) => (
                        <div key={i} className="flex items-center gap-3 py-2.5 px-3.5 rounded-xl bg-white/[0.04] border border-white/5">
                          <span className={`w-6 h-6 hex flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 0 ? 'bg-[#E5C872] text-[#0E2A1B]' : 'bg-white/10 text-[#9FB5A6]'}`}>{i + 1}</span>
                          <span className="text-sm text-white font-medium flex-1 truncate">{entry.name}</span>
                          <span className={`text-sm font-bold ${i === 0 ? 'text-[#E5C872]' : 'text-[#C4D2C8]'}`}>{entry.score}</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <Target className="w-10 h-10 text-white/20 mb-3" />
                        <p className="text-sm text-[#9FB5A6] font-medium">No scores yet</p>
                        <p className="text-xs text-[#8FA596] mt-1">Play the game to see your scores here</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4">
                    <div className="flex items-center gap-3 py-2.5 px-3.5 bg-[#E5C872] rounded-xl shadow-lg">
                      <span className="w-6 h-6 hex bg-[#0E2A1B] text-[#E5C872] flex items-center justify-center text-[10px] font-bold flex-shrink-0">&ndash;</span>
                      <span className="text-sm text-[#0E2A1B] font-bold flex-1">You</span>
                      <span className="text-sm font-extrabold text-[#0E2A1B]">{catchGameScores.length > 0 ? Math.max(...catchGameScores.map(s => s.score)) : 0}</span>
                    </div>
                    <p className="text-[10px] text-[#9FB5A6] mt-3 font-medium">Beat 120 pts to enter the top 5.</p>
                  </div>
                </div>
              </div>
            </RailSection>

            {/* ── 10 · LATEST FROM US ── */}
            <RailSection n="10">
              <div className="bg-white cut-card p-6 sm:p-7 border border-[#E7E3D6] shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg sm:text-xl font-extrabold text-[#0E2A1B]">Latest From Us</h3>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#DC2626] rounded-full text-[10px] font-bold uppercase tracking-wider border border-red-100">
                      <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full animate-pulse" /> Live
                    </span>
                    <span className="text-sm text-[#8A9A8E] font-medium">Auto-updates from our socials</span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <a href="https://www.instagram.com/youngpreneurs.ai?igsh=MWtlMW9weHU0NnUwOA==" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none text-center px-5 py-2.5 rounded-full border border-[#0E2A1B]/15 text-sm font-semibold text-[#0E2A1B] hover:bg-[#F3F1E9] transition-colors">
                      Follow us
                    </a>
                    <Link href="/student/innovation-club" className="flex-1 sm:flex-none text-center px-6 py-2.5 rounded-full bg-[#0E2A1B] text-[#E5C872] text-sm font-semibold hover:bg-[#123420] transition-all">
                      See all posts
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { href: 'https://www.instagram.com/youngpreneurs.ai?igsh=MWtlMW9weHU0NnUwOA==', color: '#C1354C', Icon: Instagram, title: 'Cohort 4 demo day highlights', net: 'Instagram · 2h ago', fill: false },
                    { href: 'https://www.facebook.com/share/16jUKyEemq/?mibextid=wwXIfr', color: '#1A2847', Icon: Facebook, title: 'Zunnova AI just crossed 10k asks', net: 'Facebook · 1d ago', fill: true },
                    { href: 'https://www.linkedin.com/company/youngpreneurs-ai/', color: '#142845', Icon: Linkedin, title: 'IIT mentor AMA — recap and slides', net: 'LinkedIn · 3d ago', fill: true },
                  ].map((p, i) => (
                    <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className="bg-[#F3F1E9] rounded-2xl p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer border border-[#E7E3D6]">
                      <div className="w-11 h-11 rounded-[14px] flex items-center justify-center flex-shrink-0 text-white shadow-sm" style={{ backgroundColor: p.color }}>
                        <p.Icon className={`w-5 h-5 ${p.fill ? 'fill-current' : ''}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0E2A1B] text-sm leading-tight mb-1">{p.title}</h4>
                        <p className="text-xs text-[#8A9A8E] font-medium">{p.net}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </RailSection>

          </div>
        </div>
      </div>

      {showIntroVideo && (
        <YouTubeModal id={YT_CLICK_ME_FIRST} title="Click Me First" onClose={() => setShowIntroVideo(false)} />
      )}

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm faq-modal-overlay">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl faq-modal-content border border-[#D4AF37]/20 relative overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-[#F5EDD6]/50 to-white relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How Can We Help?</h2>
              <button
                onClick={() => setShowFAQ(false)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6 sm:px-8 mt-4 overflow-x-auto hide-scrollbar gap-8">
              {['Students', 'Parents', 'School'].map(tab => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveFaqTab(tab);
                    setOpenFaqIndex(null);
                  }}
                  className={`pb-4 text-sm sm:text-base font-semibold transition-colors relative whitespace-nowrap ${
                    activeFaqTab === tab ? 'text-[#D4AF37]' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab === 'School' ? 'School / Principal FAQ' : `${tab} FAQ`}
                  {activeFaqTab === tab && (
                    <div className="absolute bottom-[-1px] left-0 right-0 h-1 bg-[#D4AF37] rounded-t-full"></div>
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
                      <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {item.a}
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

      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <style jsx global>{`
        .hex { clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); }
        .gamified-dash { font-family: var(--font-rajdhani), ui-sans-serif, system-ui, sans-serif; }
        .gamified-dash h1, .gamified-dash h2, .gamified-dash h3, .gamified-dash .disp { font-family: var(--font-oxanium), ui-sans-serif, system-ui, sans-serif; }
        .cut-panel { clip-path: polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px); }
        .cut-card { clip-path: polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px); }
        .gamified-dash-bg {
          background-color: #F3F1E9;
          background-image:
            repeating-linear-gradient(60deg, rgba(14,42,27,0.04) 0 1px, transparent 1px 46px),
            repeating-linear-gradient(-60deg, rgba(14,42,27,0.04) 0 1px, transparent 1px 46px);
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(212, 175, 55, 0.3); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.5); }
        .faq-answer-collapse { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
        .faq-answer-collapse.open { max-height: 800px; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
