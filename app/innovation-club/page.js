'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';
import {
  ArrowRight,
  ArrowLeft,
  Users,
  Award,
  BookOpen,
  Trophy,
  Calendar,
  Download,
  Star,
  Target,
  Rocket,
  GraduationCap,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BarChart3,
  TrendingUp,
  Mic,
  Monitor,
  Code,
  Briefcase,
  Palette,
  Brain,
  DollarSign,
  FileText,
  Wrench,
  PenTool,
  Globe,
  Cpu,
  CircleDot,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  SCROLL REVEAL HOOK                                                 */
/* ------------------------------------------------------------------ */

function useScrollReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */

const STATS = [
  { value: '1200+', label: 'Innovations Exported' },
  { value: '26+', label: 'Hackathons Hosted' },
  { value: '58+', label: 'Industry Experts' },
  { value: '5000+', label: 'Students Impacted' },
];

const EXPERIENCE_CARDS = [
  {
    icon: Users,
    title: 'Expert Exposure',
    desc: 'Learn from founders, CEOs and industry pioneers.',
  },
  {
    icon: Rocket,
    title: 'Startup Projects',
    desc: 'Build real-world solutions and launch your own ideas.',
  },
  {
    icon: Trophy,
    title: 'Hackathons',
    desc: 'Compete, collaborate and create impact at national level.',
  },
  {
    icon: Palette,
    title: 'Design Thinking',
    desc: 'Solve problems with creativity, empathy and innovation.',
  },
  {
    icon: Brain,
    title: 'AI Learning',
    desc: 'Explore AI tools, automation and future technologies.',
  },
  {
    icon: Briefcase,
    title: 'Entrepreneurship',
    desc: 'Develop business skills to become future entrepreneurs.',
  },
];

const EXPERTS = [
  { name: 'Devika Majumder', credential: 'Founder & CEO', specialty: 'WSJ Featured, TedX Speaker', photo: '/images/yp/devika.jpg' },
  { name: 'Prof. Fred Katz', credential: 'Johns Hopkins Carey Business School', specialty: 'Senior Professional Faculty', photo: '/images/yp/fred.jpeg' },
  { name: 'Dr. Partha Ghosh', credential: 'IIT Kharagpur, Former McKinsey', specialty: 'Leadership Academy', photo: '/images/yp/partha.jpg' },
  { name: 'Suman Bose', credential: 'Former CEO & MD, Siemens', specialty: 'Founder, Project KREEA', photo: '/images/yp/suman.jpg' },
  { name: 'Sachin Kapoor', credential: 'Former Sr Director, LinkedIn India', specialty: 'Founder & CEO, Trumsy.Ai', photo: '/images/yp/sachin.jpeg' },
  { name: 'Dr. Julia Stamm', credential: 'Founder, She Shapes AI', specialty: 'Responsible Tech & AI', photo: '/images/yp/juliya.jpeg' },
  { name: 'Rajeev Barua', credential: 'Professor of CS, Univ. of Maryland', specialty: 'Founder & CEO, SecondWrite', photo: '/images/yp/rajeevbaura.jpeg' },
];

const JOURNEY_STEPS = [
  { num: '01', label: 'Join the Club', icon: Users },
  { num: '02', label: 'Attend Expert Sessions', icon: Mic },
  { num: '03', label: 'Skill Challenges', icon: Target },
  { num: '04', label: 'Hackathon Participation', icon: Trophy },
  { num: '05', label: 'Prototype Development', icon: Wrench },
  { num: '06', label: 'Mentor Review', icon: GraduationCap },
  { num: '07', label: 'National Level Competition', icon: Globe },
  { num: '08', label: 'Innovation Showcase', icon: Star },
  { num: '09', label: 'Startup Review', icon: Rocket },
];

const MAJOR_PROGRAMS = [
  {
    title: 'Inter-School Hackathons',
    desc: 'Compete with the best minds and build groundbreaking solutions.',
    color: 'from-emerald-900 to-emerald-950',
  },
  {
    title: 'Zunnovate',
    desc: "India's biggest student innovation challenge.",
    color: 'from-amber-900 to-amber-950',
  },
  {
    title: 'Innovation Competitions',
    desc: 'Participate in thematic challenges and win exciting rewards.',
    color: 'from-emerald-900 to-emerald-950',
  },
  {
    title: 'Innovation Library',
    desc: 'Access resources, research papers, case studies and innovation tools.',
    color: 'from-amber-900 to-amber-950',
  },
];

const TIMELINE_EVENTS = [
  { month: 'AUG', label: 'Applications Open', color: 'bg-emerald-600' },
  { month: 'SEP', label: 'Innovation Bootcamp', color: 'bg-emerald-600' },
  { month: 'NOV', label: 'Inter-School Hackathon', color: 'bg-orange-500' },
  { month: 'JAN', label: 'Demo Day', color: 'bg-amber-500' },
  { month: 'APR', label: 'Grand Finale', color: 'bg-amber-400' },
];

const LEARNING_CATEGORIES = [
  { icon: Brain, label: 'AI & ML' },
  { icon: DollarSign, label: 'Finance' },
  { icon: Palette, label: 'Design Thinking' },
  { icon: BarChart3, label: 'Marketing' },
  { icon: Code, label: 'Coding' },
  { icon: Users, label: 'Leadership' },
  { icon: Briefcase, label: 'Entrepreneurship' },
];

const RESOURCES = [
  { icon: FileText, label: 'Templates' },
  { icon: Monitor, label: 'Pitch Decks' },
  { icon: Briefcase, label: 'Business Canvas' },
  { icon: DollarSign, label: 'Funding Guides' },
  { icon: BookOpen, label: 'Research Papers' },
  { icon: PenTool, label: 'Design Kits' },
  { icon: Cpu, label: 'AI Tools' },
  { icon: Globe, label: 'Startup Laws' },
  { icon: TrendingUp, label: 'Marketing Resources' },
  { icon: BarChart3, label: 'Finance Guides' },
];

/* ------------------------------------------------------------------ */
/*  MAIN PAGE COMPONENT                                                */
/* ------------------------------------------------------------------ */

export default function InnovationClubPage() {
  const [heroRef, heroVisible] = useScrollReveal();
  const [expRef, expVisible] = useScrollReveal();
  const [expertRef, expertVisible] = useScrollReveal();
  const [journeyRef, journeyVisible] = useScrollReveal();
  const [timelineRef, timelineVisible] = useScrollReveal();
  const [resourceRef, resourceVisible] = useScrollReveal();
  const [ctaRef, ctaVisible] = useScrollReveal();
  const [expertScroll, setExpertScroll] = useState(0);
  const expertContainerRef = useRef(null);

  const scrollExperts = useCallback((dir) => {
    const container = expertContainerRef.current;
    if (!container) return;
    const scrollAmount = 240;
    container.scrollBy({ left: dir * scrollAmount, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <PublicNavbar />

      {/* ===== HERO SECTION ===== */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden bg-[#0A0A0A] pt-24 sm:pt-28 lg:pt-32 pb-0"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 right-0 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-gold/3 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="space-y-6 py-8 lg:py-12">
              <div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight">
                  INNOVATION
                </h1>
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-gold leading-[0.9] tracking-tight">
                  CLUB
                </h1>
              </div>

              <div className="space-y-1">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
                  Where Young Innovators
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug">
                  Become <span className="text-gold">Future Founders.</span>
                </p>
              </div>

              <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg">
                An exclusive ecosystem for students to learn, build, compete
                and lead with the support of industry experts,
                mentors and innovators.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-white text-[#0A0A0A] font-bold px-6 py-3 rounded-full text-sm hover:bg-white/90 transition-all duration-200"
                >
                  Join the Club
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#explore"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-white/20 transition-all duration-200 backdrop-blur-sm"
                >
                  Explore Programs
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative w-full h-[420px] rounded-3xl overflow-hidden">
                <Image
                  src="/images/yp/hero-students.png"
                  alt="Young innovators and future founders"
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 1024px) 50vw, 0vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0A0A0A]/30" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative z-10 mt-8 lg:mt-12 border-t border-white/10 bg-[#0A0A0A]/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-center"
                >
                  <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-white/50 text-xs sm:text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU'LL EXPERIENCE ===== */}
      <section ref={expRef} id="explore" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${expVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] tracking-tight">
              WHAT YOU&apos;LL EXPERIENCE
            </h2>
            <div className="w-16 h-1 bg-gold mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {EXPERIENCE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="bg-[#0F1A14] rounded-2xl p-5 text-center hover:bg-[#162820] transition-colors duration-200 group"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                    <Icon className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2">{card.title}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{card.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/student/innovation-club"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#1A1A1A] transition-colors"
            >
              View All Programs
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EXPERT EXPOSURE ===== */}
      <section ref={expertRef} className="py-16 sm:py-20 bg-cream">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${expertVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="border border-[#1A1A1A]/10 rounded-3xl bg-[#0F1A14] p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">EXPERT EXPOSURE</h2>
                  <p className="text-white/50 text-sm mt-1">Learn directly from the people building the future.</p>
                </div>
                <Link
                  href="/student/innovation-club/experts"
                  className="inline-flex items-center gap-2 bg-gold/20 border border-gold/30 text-gold font-semibold px-4 py-2 rounded-full text-xs hover:bg-gold/30 transition-colors whitespace-nowrap"
                >
                  View All Experts
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="relative mt-8">
                <button
                  onClick={() => scrollExperts(-1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-9 h-9 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                  ref={expertContainerRef}
                  className="flex gap-6 sm:gap-8 overflow-x-auto scrollbar-hide py-4 px-2"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {EXPERTS.map((expert) => (
                    <div key={expert.name} className="flex flex-col items-center shrink-0 min-w-[130px] max-w-[140px]">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gold/50 overflow-hidden mb-3 relative bg-gold/10">
                        <Image
                          src={expert.photo}
                          alt={expert.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <h4 className="text-white font-bold text-sm text-center leading-tight">{expert.name}</h4>
                      <p className="text-gold/70 text-xs text-center mt-0.5 leading-tight">{expert.credential}</p>
                      <p className="text-white/40 text-[11px] text-center mt-0.5 leading-tight">{expert.specialty}</p>
                      <span className="inline-flex items-center gap-1 mt-2 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full">
                        <CircleDot className="w-2.5 h-2.5" />
                        Live Session
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => scrollExperts(1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-9 h-9 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INNOVATION JOURNEY + MAJOR PROGRAMS ===== */}
      <section ref={journeyRef} className="py-16 sm:py-20 bg-white">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${journeyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left - Innovation Journey */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">YOUR INNOVATION JOURNEY</h2>
              <p className="text-neutral-medium text-sm mt-1 mb-8">From curiosity to impact &mdash; we guide every step.</p>

              {/* Top row: steps 01 - 05 */}
              <div className="relative">
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {JOURNEY_STEPS.slice(0, 5).map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.num} className="flex flex-col items-center text-center">
                        <div className="relative">
                          <span className="text-gold/60 text-xs font-bold mb-1 block">{step.num}</span>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0F1A14] border-2 border-gold/30 flex items-center justify-center mx-auto">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                          </div>
                        </div>
                        <p className="text-[#1A1A1A] text-[10px] sm:text-xs font-semibold mt-2 leading-tight">{step.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Connecting line between rows */}
                <div className="flex justify-end pr-6 my-2">
                  <div className="w-px h-8 bg-gold/20" />
                </div>

                {/* Bottom row: steps 09 - 06 (reversed) */}
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {JOURNEY_STEPS.slice(5).reverse().map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.num} className="flex flex-col items-center text-center">
                        <div className="relative">
                          <span className="text-gold/60 text-xs font-bold mb-1 block">{step.num}</span>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0F1A14] border-2 border-gold/30 flex items-center justify-center mx-auto">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
                          </div>
                        </div>
                        <p className="text-[#1A1A1A] text-[10px] sm:text-xs font-semibold mt-2 leading-tight">{step.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Dashed connecting path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <line x1="10%" y1="32%" x2="90%" y2="32%" stroke="rgba(212,175,55,0.15)" strokeWidth="2" strokeDasharray="6 4" />
                  <line x1="10%" y1="82%" x2="80%" y2="82%" stroke="rgba(212,175,55,0.15)" strokeWidth="2" strokeDasharray="6 4" />
                </svg>
              </div>
            </div>

            {/* Right - Major Programs */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">MAJOR PROGRAMS</h2>
              <p className="text-neutral-medium text-sm mt-1 mb-8">Programs designed to challenge, inspire and elevate.</p>

              <div className="grid grid-cols-2 gap-4">
                {MAJOR_PROGRAMS.map((program) => (
                  <div
                    key={program.title}
                    className={`bg-gradient-to-br ${program.color} rounded-2xl p-5 flex flex-col justify-between min-h-[180px] group hover:shadow-lg transition-shadow`}
                  >
                    <div>
                      <h3 className="text-white font-bold text-sm sm:text-base leading-snug mb-2">{program.title}</h3>
                      <p className="text-white/50 text-xs leading-relaxed">{program.desc}</p>
                    </div>
                    <button className="mt-4 inline-flex items-center gap-1.5 bg-gold/20 border border-gold/30 text-gold font-semibold px-3 py-1.5 rounded-full text-xs hover:bg-gold/30 transition-colors self-start">
                      Explore
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ANNUAL TIMELINE + FEATURED LEARNING ===== */}
      <section ref={timelineRef} className="py-16 sm:py-20 bg-cream">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left - Annual Timeline */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">ANNUAL TIMELINE</h2>
              <p className="text-neutral-medium text-sm mt-1 mb-8">A year full of learning, building and winning.</p>

              <div className="relative">
                <div className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                  {TIMELINE_EVENTS.map((event, i) => (
                    <div key={event.month} className="flex flex-col items-center shrink-0 min-w-[70px] sm:min-w-[80px] relative">
                      <div className={`${event.color} text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg mb-3 shadow-sm`}>
                        {event.month}
                      </div>
                      <div className="w-3 h-3 rounded-full bg-[#1A1A1A] border-2 border-gold relative z-10" />
                      <p className="text-[#1A1A1A] text-[10px] sm:text-xs font-medium mt-3 text-center leading-tight max-w-[80px]">{event.label}</p>
                    </div>
                  ))}
                </div>
                <div className="absolute left-6 right-6 top-[52px] h-px bg-[#1A1A1A]/15" />
              </div>
            </div>

            {/* Right - Featured Learning */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">FEATURED LEARNING</h2>
              <p className="text-neutral-medium text-sm mt-1 mb-8">Future-ready skills for future leaders.</p>

              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                {LEARNING_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.label} className="flex flex-col items-center shrink-0 min-w-[70px] group cursor-pointer">
                      <div className="w-14 h-14 rounded-xl bg-[#0F1A14] border border-gold/20 flex items-center justify-center group-hover:border-gold/50 transition-colors mb-2">
                        <Icon className="w-6 h-6 text-gold" />
                      </div>
                      <p className="text-[#1A1A1A] text-xs font-medium text-center">{cat.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <Link
                  href="/student/innovation-club"
                  className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[#1A1A1A] transition-colors"
                >
                  Explore All Learning Paths
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RESOURCE LIBRARY ===== */}
      <section ref={resourceRef} className="py-16 sm:py-20 bg-white">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${resourceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">RESOURCE LIBRARY</h2>
            <p className="text-neutral-medium text-sm mt-2">Everything you need to ideate, build and scale.</p>
            <div className="w-16 h-1 bg-gold mx-auto mt-4" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
            {RESOURCES.map((res) => {
              const Icon = res.icon;
              return (
                <div key={res.label} className="flex flex-col items-center group cursor-pointer min-w-[80px]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0F1A14] border border-gold/20 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-[#162820] transition-all duration-200">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                  </div>
                  <p className="text-[#1A1A1A] text-xs font-medium mt-2 text-center max-w-[80px] leading-tight">{res.label}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/student/innovation-club/resources"
              className="inline-flex items-center gap-2 bg-[#0A0A0A] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#1A1A1A] transition-colors"
            >
              Explore Library
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section
        ref={ctaRef}
        className="relative overflow-hidden bg-[#0A0A0A] py-16 sm:py-20 lg:py-24"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-gold/3 rounded-full blur-[100px]" />
        </div>
        <div
          className={`max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 transition-all duration-700 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            READY TO BUILD THE FUTURE?
          </h2>
          <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Join thousands of young innovators and turn your ideas into impact.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gold text-[#0A0A0A] font-bold px-8 py-3.5 rounded-full text-sm hover:bg-gold-light transition-all duration-200 shadow-gold"
          >
            Join Innovation Club
            <ArrowRight className="w-4 h-4" />
          </Link>
          <div className="flex items-center justify-center gap-4 sm:gap-6 mt-8">
            {['LEARN', 'BUILD', 'INNOVATE', 'LEAD'].map((word, i) => (
              <div key={word} className="flex items-center gap-4 sm:gap-6">
                {i > 0 && <span className="text-gold text-xs">&#9670;</span>}
                <span className="text-white/70 text-xs sm:text-sm font-bold tracking-wider">{word}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
