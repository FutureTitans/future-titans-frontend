'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';
import {
  ArrowRight,
  Play,
  Users,
  Award,
  Lightbulb,
  BookOpen,
  Trophy,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Star,
  Zap,
  Target,
  Rocket,
  GraduationCap,
  Video,
  FileText,
  ChevronRight,
  Radio,
  Eye,
  MapPin,
  Timer,
  CheckCircle,
  School,
  Sparkles,
  BarChart3,
  TrendingUp,
  Mic,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: '340+', label: 'Schools Enrolled', icon: School },
  { value: '58', label: 'Experts', icon: Users },
  { value: '26', label: 'Hackathons Hosted', icon: Trophy },
  { value: '1,200+', label: 'Innovations Exported', icon: Rocket },
];

const TABS = [
  { id: 'experts', label: 'Expert Exposure' },
  { id: 'hackathons', label: 'Hackathons' },
  { id: 'teachers', label: 'Teachers' },
  { id: 'resources', label: 'Resource Library' },
];

const EXPERT_SESSIONS = [
  {
    id: 1,
    expert: 'Aarav Mehta',
    credential: 'Co-Founder, TechNova Labs',
    topic: 'From Classroom to Cap Table: Pitching Your First Venture',
    viewers: 342,
    duration: '45 min',
    live: true,
    avatar: 'AM',
  },
  {
    id: 2,
    expert: 'Priya Shankar',
    credential: 'Director of Innovation, EduStar India',
    topic: 'Design Thinking for Teen Entrepreneurs',
    viewers: 128,
    duration: '35 min',
    live: false,
    recorded: true,
    avatar: 'PS',
  },
  {
    id: 3,
    expert: 'Rohan Kapoor',
    credential: 'Angel Investor & Mentor',
    topic: 'How to Validate Your Startup Idea in 72 Hours',
    viewers: 89,
    duration: '40 min',
    live: false,
    recorded: true,
    avatar: 'RK',
  },
  {
    id: 4,
    expert: 'Dr. Neha Joshi',
    credential: 'Professor, IIM Ahmedabad',
    topic: 'Building a Business Model Canvas Step by Step',
    viewers: 215,
    duration: '50 min',
    live: false,
    upcoming: true,
    date: 'Aug 2, 2026',
    avatar: 'NJ',
  },
];

const HACKATHONS = [
  {
    id: 1,
    title: 'National Innovation Sprint 2026',
    theme: 'Sustainable Cities & Communities',
    registrationOpen: true,
    prize: '5,00,000',
    participants: 1200,
    deadline: '2026-08-15',
    featured: true,
  },
  {
    id: 2,
    title: 'HealthTech Challenge',
    theme: 'AI for Rural Healthcare',
    registrationOpen: true,
    prize: '2,50,000',
    participants: 480,
    deadline: '2026-09-01',
  },
  {
    id: 3,
    title: 'EduHack 2026',
    theme: 'Reinventing Learning Experiences',
    registrationOpen: false,
    prize: '3,00,000',
    participants: 760,
    deadline: '2026-07-30',
  },
  {
    id: 4,
    title: 'Green Ventures Hackathon',
    theme: 'Climate Action & Clean Energy',
    registrationOpen: true,
    prize: '2,00,000',
    participants: 320,
    deadline: '2026-10-05',
  },
];

const JOURNEY_STEPS = [
  { step: 1, title: 'Register', desc: 'Sign up your team and pick a challenge track.' },
  { step: 2, title: 'Ideate', desc: 'Brainstorm and validate your concept with mentors.' },
  { step: 3, title: 'Build', desc: 'Prototype your solution over the sprint window.' },
  { step: 4, title: 'Pitch', desc: 'Present to expert judges at the National Finals.' },
];

const TEACHER_FEATURES = [
  'Cohort-Based',
  '4-Week Program',
  'Live + Recorded',
  'Certificate of Completion',
];

const TEACHER_COHORTS = [
  {
    id: 1,
    title: 'Innovation Mentorship Cohort 8',
    starts: 'Aug 12, 2026',
    seatsLeft: 14,
    totalSeats: 40,
    modules: 12,
  },
  {
    id: 2,
    title: 'Design Thinking for Educators',
    starts: 'Sep 5, 2026',
    seatsLeft: 28,
    totalSeats: 40,
    modules: 8,
  },
  {
    id: 3,
    title: 'STEM Innovation Leadership',
    starts: 'Oct 1, 2026',
    seatsLeft: 36,
    totalSeats: 40,
    modules: 10,
  },
];

const RESOURCES = [
  {
    id: 1,
    title: 'Business Model Canvas Template',
    type: 'Template',
    category: 'Strategy',
    downloads: 2340,
    featured: true,
  },
  {
    id: 2,
    title: 'Pitch Deck Masterclass',
    type: 'Video',
    category: 'Pitching',
    downloads: 1890,
  },
  {
    id: 3,
    title: 'Market Research Toolkit',
    type: 'Guide',
    category: 'Research',
    downloads: 1560,
  },
  {
    id: 4,
    title: 'Financial Modeling for Beginners',
    type: 'Workbook',
    category: 'Finance',
    downloads: 980,
  },
  {
    id: 5,
    title: 'Customer Discovery Playbook',
    type: 'Guide',
    category: 'Strategy',
    downloads: 1320,
  },
];

const RESOURCE_CATEGORIES = ['All', 'Strategy', 'Pitching', 'Research', 'Finance'];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

function CountdownTimer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    function calc() {
      const diff = new Date(deadline) - new Date();
      if (diff <= 0) return { days: 0, hours: 0, mins: 0 };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
      };
    }
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 60000);
    return () => clearInterval(id);
  }, [deadline]);

  return (
    <div className="flex gap-3">
      {[
        { v: timeLeft.days, l: 'Days' },
        { v: timeLeft.hours, l: 'Hrs' },
        { v: timeLeft.mins, l: 'Min' },
      ].map((t) => (
        <div key={t.l} className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white font-bold text-lg min-w-[44px]">
            {String(t.v).padStart(2, '0')}
          </div>
          <span className="text-white/60 text-[10px] uppercase tracking-wider mt-1 block">{t.l}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TAB CONTENT PANELS                                                 */
/* ------------------------------------------------------------------ */

function ExpertExposurePanel() {
  const featured = EXPERT_SESSIONS[0];
  const rest = EXPERT_SESSIONS.slice(1);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Featured Session */}
      <div className="lg:col-span-2">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1B3A2D] to-[#0F2218] p-6 sm:p-8 h-full">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-red-500/90 text-white text-xs font-bold px-3 py-1 rounded-full">
                <Radio className="w-3 h-3 animate-pulse" />
                LIVE NOW
              </span>
              <span className="text-white/50 text-xs flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {featured.viewers} watching
              </span>
            </div>
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center text-gold font-bold text-sm shrink-0">
                {featured.avatar}
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">{featured.expert}</h4>
                <p className="text-white/60 text-sm">{featured.credential}</p>
              </div>
            </div>
            <h3 className="text-white text-xl sm:text-2xl font-bold mb-4 leading-snug">
              {featured.topic}
            </h3>
            <div className="flex items-center gap-4 text-white/50 text-sm">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.duration}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{featured.viewers} viewers</span>
            </div>
            <button className="mt-6 inline-flex items-center gap-2 bg-gold text-[#1B3A2D] font-bold px-6 py-2.5 rounded-full text-sm hover:bg-gold-light transition-colors">
              <Play className="w-4 h-4" />
              Join Session
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar -- Sessions This Week */}
      <div className="space-y-4">
        <h4 className="text-[#1B3A2D] font-bold text-sm uppercase tracking-wider">Sessions This Week</h4>
        {rest.map((session) => (
          <div
            key={session.id}
            className="bg-white/80 backdrop-blur-sm border border-neutral-border rounded-xl p-4 hover:shadow-glass-sm transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-cream-dark flex items-center justify-center text-[#1B3A2D] text-xs font-bold shrink-0">
                {session.avatar}
              </div>
              <div className="min-w-0">
                <p className="text-[#1B3A2D] font-semibold text-sm truncate">{session.expert}</p>
                <p className="text-neutral-medium text-xs truncate">{session.credential}</p>
              </div>
            </div>
            <p className="text-[#1B3A2D] text-sm font-medium leading-snug mb-2 line-clamp-2">{session.topic}</p>
            <div className="flex items-center justify-between text-xs text-neutral-medium">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{session.duration}</span>
              {session.recorded && (
                <span className="flex items-center gap-1 text-semantic-success font-medium">
                  <Video className="w-3 h-3" />Recorded
                </span>
              )}
              {session.upcoming && (
                <span className="flex items-center gap-1 text-gold-dark font-medium">
                  <Calendar className="w-3 h-3" />{session.date}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HackathonsPanel() {
  const featured = HACKATHONS[0];
  const rest = HACKATHONS.slice(1);

  return (
    <div className="space-y-8">
      {/* Featured Hackathon */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1B3A2D] to-[#0F2218] p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-semantic-success/20 text-semantic-success text-xs font-bold px-3 py-1 rounded-full mb-4">
              <CheckCircle className="w-3 h-3" />
              REGISTRATION OPEN
            </span>
            <h3 className="text-white text-2xl sm:text-3xl font-bold mb-2">{featured.title}</h3>
            <p className="text-white/60 text-sm mb-4">{featured.theme}</p>
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <span className="text-white/80 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-gold" />
                Prize Pool: INR {featured.prize}
              </span>
              <span className="text-white/80 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gold" />
                {featured.participants} Registered
              </span>
            </div>
            <button className="inline-flex items-center gap-2 bg-gold text-[#1B3A2D] font-bold px-6 py-2.5 rounded-full text-sm hover:bg-gold-light transition-colors">
              Register Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4">
            <p className="text-white/50 text-xs uppercase tracking-wider">Registration Closes In</p>
            <CountdownTimer deadline={featured.deadline} />
          </div>
        </div>
      </div>

      {/* Hackathon Grid + Journey */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid sm:grid-cols-3 gap-4">
          {rest.map((hack) => (
            <div key={hack.id} className="bg-white/80 backdrop-blur-sm border border-neutral-border rounded-xl p-5 hover:shadow-glass-sm transition-all duration-200 group">
              <div className="mb-3">
                {hack.registrationOpen ? (
                  <span className="text-semantic-success text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />Open
                  </span>
                ) : (
                  <span className="text-neutral-medium text-xs font-bold">Closed</span>
                )}
              </div>
              <h4 className="text-[#1B3A2D] font-bold text-sm mb-1 leading-snug">{hack.title}</h4>
              <p className="text-neutral-medium text-xs mb-3">{hack.theme}</p>
              <div className="flex items-center justify-between text-xs text-neutral-medium">
                <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-gold" />INR {hack.prize}</span>
                <span>{hack.participants} teams</span>
              </div>
            </div>
          ))}
        </div>

        {/* Competition Journey */}
        <div className="bg-cream/80 backdrop-blur-sm border border-neutral-border rounded-xl p-5">
          <h4 className="text-[#1B3A2D] font-bold text-sm uppercase tracking-wider mb-4">Competition Journey</h4>
          <div className="space-y-4">
            {JOURNEY_STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#1B3A2D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {s.step}
                  </div>
                  {i < JOURNEY_STEPS.length - 1 && (
                    <div className="w-px h-full bg-[#1B3A2D]/20 mt-1" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-[#1B3A2D] font-bold text-sm">{s.title}</p>
                  <p className="text-neutral-medium text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TeachersPanel() {
  return (
    <div className="space-y-8">
      {/* Hero text */}
      <div className="bg-gradient-to-br from-[#1B3A2D] to-[#0F2218] rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 bg-gold/20 text-gold text-xs font-bold px-3 py-1 rounded-full mb-4">
            <GraduationCap className="w-3 h-3" />
            TEACHER CERTIFICATION
          </span>
          <h3 className="text-white text-2xl sm:text-3xl font-bold mb-3 leading-snug">
            Become a Certified Innovation Mentor
          </h3>
          <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
            Our Train-the-Trainer program equips educators with practical frameworks in Design Thinking, the IDEA DNA engine, and venture-building methodology. Graduate ready to run your own school innovation lab.
          </p>
          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {TEACHER_FEATURES.map((f) => (
              <span key={f} className="bg-white/10 backdrop-blur-sm text-white/90 text-xs font-medium px-4 py-1.5 rounded-full border border-white/10">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming cohorts */}
      <div>
        <h4 className="text-[#1B3A2D] font-bold text-sm uppercase tracking-wider mb-4">Upcoming Cohorts</h4>
        <div className="grid sm:grid-cols-3 gap-4">
          {TEACHER_COHORTS.map((cohort) => {
            const seatPct = ((cohort.totalSeats - cohort.seatsLeft) / cohort.totalSeats) * 100;
            return (
              <div key={cohort.id} className="bg-white/80 backdrop-blur-sm border border-neutral-border rounded-xl p-5 hover:shadow-glass-sm transition-all duration-200 group">
                <h4 className="text-[#1B3A2D] font-bold text-sm mb-2 leading-snug">{cohort.title}</h4>
                <div className="flex items-center gap-2 text-xs text-neutral-medium mb-3">
                  <Calendar className="w-3 h-3" />
                  Starts {cohort.starts}
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-medium mb-3">
                  <BookOpen className="w-3 h-3" />
                  {cohort.modules} modules
                </div>
                {/* Seat bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-medium">Seats</span>
                    <span className="text-gold-dark font-bold">{cohort.seatsLeft} left</span>
                  </div>
                  <div className="h-1.5 bg-neutral-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${seatPct}%` }}
                    />
                  </div>
                </div>
                <button className="mt-3 w-full text-center text-sm font-bold text-[#1B3A2D] border border-[#1B3A2D]/20 rounded-full py-2 hover:bg-[#1B3A2D] hover:text-white transition-colors">
                  Enroll Now
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ResourceLibraryPanel() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = RESOURCES.filter((r) => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const typeIcon = (type) => {
    switch (type) {
      case 'Video': return <Video className="w-4 h-4" />;
      case 'Template': return <FileText className="w-4 h-4" />;
      case 'Guide': return <BookOpen className="w-4 h-4" />;
      case 'Workbook': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-medium" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-border bg-white/80 backdrop-blur-sm text-sm text-[#1B3A2D] placeholder:text-neutral-medium focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {RESOURCE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#1B3A2D] text-white'
                  : 'bg-white/80 text-neutral-medium border border-neutral-border hover:border-[#1B3A2D]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured resource */}
      {activeCategory === 'All' && !searchQuery && (
        <div className="bg-gradient-to-br from-[#1B3A2D] to-[#0F2218] rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7 text-gold" />
            </div>
            <div className="flex-1">
              <span className="text-gold text-xs font-bold uppercase tracking-wider">Featured Resource</span>
              <h4 className="text-white font-bold text-lg mt-1">Business Model Canvas Template</h4>
              <p className="text-white/60 text-sm mt-1">The most downloaded resource. Perfect for structuring your venture idea from day one.</p>
            </div>
            <button className="inline-flex items-center gap-2 bg-gold text-[#1B3A2D] font-bold px-5 py-2.5 rounded-full text-sm hover:bg-gold-light transition-colors shrink-0">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      )}

      {/* Resource grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((res) => (
          <div key={res.id} className="bg-white/80 backdrop-blur-sm border border-neutral-border rounded-xl p-5 hover:shadow-glass-sm transition-all duration-200 group cursor-pointer">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cream flex items-center justify-center text-gold-dark">
                {typeIcon(res.type)}
              </div>
              <span className="text-xs font-semibold text-neutral-medium uppercase tracking-wider">{res.type}</span>
            </div>
            <h4 className="text-[#1B3A2D] font-bold text-sm mb-2 leading-snug group-hover:text-gold-dark transition-colors">{res.title}</h4>
            <div className="flex items-center justify-between text-xs text-neutral-medium">
              <span className="bg-cream px-2 py-0.5 rounded-full">{res.category}</span>
              <span className="flex items-center gap-1"><Download className="w-3 h-3" />{res.downloads.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN PAGE COMPONENT                                                */
/* ------------------------------------------------------------------ */

export default function InnovationClubPage() {
  const [activeTab, setActiveTab] = useState('experts');
  const [heroRef, heroVisible] = useScrollReveal();
  const [statsRef, statsVisible] = useScrollReveal();
  const [tabsRef, tabsVisible] = useScrollReveal();
  const [ctaRef, ctaVisible] = useScrollReveal();

  const tabPanels = {
    experts: <ExpertExposurePanel />,
    hackathons: <HackathonsPanel />,
    teachers: <TeachersPanel />,
    resources: <ResourceLibraryPanel />,
  };

  return (
    <div className="min-h-screen bg-cream">
      <PublicNavbar />

      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden bg-gradient-to-br from-[#1B3A2D] via-[#1B3A2D] to-[#0F2218] pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-28"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gold/3 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-px h-32 bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
          <div className="absolute top-1/3 right-1/3 w-px h-24 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`grid lg:grid-cols-5 gap-12 lg:gap-16 items-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Left content -- spans 3 cols */}
            <div className="lg:col-span-3 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-gold/30 bg-gold/10 backdrop-blur-sm rounded-full px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span className="text-gold text-xs font-bold tracking-wider uppercase">
                  Innovation Club &mdash; A Future Titans Program
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-display-lg font-bold text-white leading-[1.1] tracking-tight">
                Where Future Titans{' '}
                <span className="text-gold">Build Real Ventures</span>
              </h1>

              {/* Subhead */}
              <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl">
                Expert mentors, national challenges, teacher support, and practical venture-building &mdash; all inside one school innovation ecosystem.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/student/innovation-club"
                  className="inline-flex items-center gap-2 bg-gold text-[#1B3A2D] font-bold px-6 py-3 rounded-full text-sm hover:bg-gold-light transition-all duration-200 shadow-gold"
                >
                  Go to Innovation Club
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Bottom note */}
              <p className="text-white/40 text-xs tracking-wide pt-2">
                Exclusively for paid members.
              </p>
            </div>

            {/* Right floating cards -- spans 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              {/* Card 1 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 animate-float" style={{ animationDelay: '0s' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-xs font-medium">Live Sessions This Week</span>
                  <Radio className="w-4 h-4 text-red-400 animate-pulse" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-3xl font-bold">06</span>
                  <span className="text-semantic-success text-xs font-bold uppercase tracking-wider">LIVE</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-xs font-medium">Ideas Moving to Prototype</span>
                  <TrendingUp className="w-4 h-4 text-gold" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-white text-3xl font-bold">72%</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden ml-2">
                    <div className="h-full bg-gold rounded-full" style={{ width: '72%' }} />
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/60 text-xs font-medium">National Challenge Registration</span>
                  <Zap className="w-4 h-4 text-gold" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-semantic-success/20 text-semantic-success text-sm font-bold px-3 py-1 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5" />
                    OPEN NOW
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section ref={statsRef} className="relative -mt-8 z-20 px-4 sm:px-6 lg:px-8">
        <div
          className={`max-w-5xl mx-auto bg-white/90 backdrop-blur-lg border border-neutral-border rounded-2xl shadow-glass-lg py-8 px-6 sm:px-10 transition-all duration-700 delay-200 ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gold/10 mb-3">
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-[#1B3A2D]">{stat.value}</p>
                  <p className="text-neutral-medium text-xs sm:text-sm mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== TABS SECTION ===== */}
      <section ref={tabsRef} id="explore" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className={`transition-all duration-700 delay-100 ${tabsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Section header */}
          <div className="text-center mb-10">
            <span className="text-gold text-xs font-bold tracking-widest uppercase">What We Offer</span>
            <h2 className="text-3xl sm:text-4xl lg:text-display font-bold text-[#1B3A2D] mt-2">
              Everything Inside the Club
            </h2>
          </div>

          {/* Tab bar */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex bg-white/80 backdrop-blur-sm border border-neutral-border rounded-full p-1 overflow-x-auto max-w-full">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 sm:px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-[#1B3A2D] text-white shadow-sm'
                      : 'text-neutral-medium hover:text-[#1B3A2D]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab panel */}
          <div className="animate-fade-in" key={activeTab}>
            {tabPanels[activeTab]}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden bg-gradient-to-br from-[#1B3A2D] via-[#1B3A2D] to-[#0F2218] py-16 sm:py-20 lg:py-24"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gold/3 rounded-full blur-3xl" />
        </div>
        <div
          className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-700 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-display font-bold text-white mb-4 leading-tight">
            Your Innovation Club.{' '}
            <span className="text-gold">All in One Place.</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Expert mentors, national competitions, and a community of young builders &mdash; exclusively for paid members.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/student/innovation-club"
              className="inline-flex items-center gap-2 bg-gold text-[#1B3A2D] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gold-light transition-all duration-200 shadow-gold"
            >
              Go to Innovation Club
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
