'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';
import {
  ArrowRight,
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
  Lightbulb,
  Check,
} from 'lucide-react';

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

const STATS = [
  { value: '1200+', label: 'Innovations\nExplored', icon: Lightbulb },
  { value: '26+', label: 'Hackathons\nHosted', icon: Trophy },
  { value: '58+', label: 'Industry\nExperts', icon: Award },
  { value: '5000+', label: 'Students\nImpacted', icon: Users },
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
    icon: Lightbulb,
    title: 'Design Thinking',
    desc: 'Solve problems with creativity, empathy and innovation.',
  },
  {
    icon: Cpu,
    title: 'AI Learning',
    desc: 'Explore AI tools, automation and future technologies.',
  },
  {
    icon: TrendingUp,
    title: 'Entrepreneurship',
    desc: 'Develop business skills to become future entrepreneurs.',
  },
];

const EXPERTS = [
  { name: 'Devika Majumder', credential: 'Co-founder & CEO', specialty: 'The Inception Lab', photo: '/images/yp/devika.jpg' },
  { name: 'Prof. Fred Katz', credential: 'Adjunct Professor', specialty: 'Berkeley (USA)', photo: '/images/yp/fred.jpeg' },
  { name: 'Dr. Partha Ghosh', credential: 'Ex-CTO', specialty: 'Tata Consultancy Services', photo: '/images/yp/partha.jpg' },
  { name: 'Suman Bose', credential: 'Director - Digital', specialty: 'Transformation Tech Mahindra', photo: '/images/yp/suman.jpg' },
  { name: 'Sachin Kapoor', credential: 'Founder, CEO', specialty: 'Authbridge Research Services', photo: '/images/yp/sachin.jpeg' },
  { name: 'Dr. Julia Stamm', credential: 'Head of AI', specialty: 'Data Science Wells Fargo', photo: '/images/yp/juliya.jpeg' },
  { name: 'Rajeev Barua', credential: 'Founder and CTO', specialty: 'InMobi (Ex-Motorola)', photo: '/images/yp/rajeevbaura.jpeg' },
];

const JOURNEY_STEPS = [
  { num: '01', label: 'Join the Club', icon: Users },
  { num: '02', label: 'Attend Expert Sessions', icon: Mic },
  { num: '03', label: 'Skill Challenges', icon: Target },
  { num: '04', label: 'Hackathon Participation', icon: Trophy },
  { num: '05', label: 'Prototype Development', icon: Wrench },
  { num: '06', label: 'Mentor Review', icon: GraduationCap },
  { num: '07', label: 'National Level Competition', icon: Globe },
  { num: '08', label: 'National Level Showvation', icon: Star },
  { num: '09', label: 'Startup Review', icon: Rocket },
];

const MAJOR_PROGRAMS = [
  {
    title: 'Inter-School Hackathons',
    desc: 'Compete with the best minds and build ground-breaking solutions.',
    image: '/images/innovation-club/trophy.png',
    dark: true,
  },
  {
    title: 'Zurnovate',
    desc: "India's biggest student innovation challenge.",
    image: '/images/innovation-club/rocket.png',
    dark: false,
  },
  {
    title: 'Innovation Competitions',
    desc: 'Participate in dynamic challenges and win exciting rewards.',
    image: '/images/innovation-club/robot.png',
    dark: true,
  },
  {
    title: 'Innovation Library',
    desc: 'Access resources, research papers, case studies and innovation tools.',
    image: '/images/innovation-club/books.png',
    dark: false,
  },
];

const TIMELINE_EVENTS = [
  { month: 'AUG', label: 'Applications Open', color: 'bg-emerald-700' },
  { month: 'SEP', label: 'Innovation Bootcamp', color: 'bg-emerald-600' },
  { month: 'NOV', label: 'Inter-School Hackathon', color: 'bg-amber-700' },
  { month: 'JAN', label: 'Demo Day', color: 'bg-amber-600' },
  { month: 'APR', label: 'Grand Finale', color: 'bg-amber-500' },
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

export default function InnovationClubPage() {
  const [heroRef, heroVisible] = useScrollReveal();
  const [expRef, expVisible] = useScrollReveal();
  const [expertRef, expertVisible] = useScrollReveal();
  const [journeyRef, journeyVisible] = useScrollReveal();
  const [timelineRef, timelineVisible] = useScrollReveal();
  const [resourceRef, resourceVisible] = useScrollReveal();
  const [ctaRef, ctaVisible] = useScrollReveal();
  const expertContainerRef = useRef(null);

  const scrollExperts = useCallback((dir) => {
    const container = expertContainerRef.current;
    if (!container) return;
    container.scrollBy({ left: dir * 300, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <PublicNavbar />

      {/* ===== HERO ===== */}
      <section
        ref={heroRef}
        className="relative w-full pt-20 sm:pt-24 pb-0 bg-[#07160E]"
      >
        {/* Full-width background image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/innovation-club/hero-bg.jpeg"
            alt="Young innovators and future founders"
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          {/* Lighter gradient so the image remains bright */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07160E] via-[#07160E]/60 to-transparent md:w-[75%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07160E] via-transparent to-transparent opacity-60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`max-w-2xl py-16 sm:py-24 lg:py-32 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-block bg-transparent border border-[#D4AF37]/60 text-[#D4AF37] text-xs font-bold px-3 py-1.5 rounded-md tracking-widest uppercase mb-5">
              FUTURE TITANS
            </span>

            <div>
              <h1 className="text-[3.5rem] sm:text-6xl md:text-[5rem] lg:text-[6rem] font-bold text-white leading-none tracking-tight">
                INNOVATION<br />
                <span className="text-[#D4AF37]">CLUB</span>
              </h1>
            </div>

            <div className="mt-6 space-y-1">
              <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white leading-snug">
                Where Young Innovators <br />
                Become <span className="text-[#D4AF37] font-semibold">Future Founders.</span>
              </p>
            </div>

            <p className="mt-5 text-white/70 text-sm sm:text-base leading-relaxed max-w-lg font-light">
              An exclusive ecosystem to learn, build, compete
              and lead with the support of industry experts,
              mentors and innovators.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 bg-[#D4AF37] text-[#0A1A12] font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#E6C655] transition-all duration-200 shadow-lg shadow-[#D4AF37]/20"
              >
                Join the Club
                <div className="w-5 h-5 rounded-full bg-[#0A1A12] text-[#D4AF37] flex items-center justify-center">
                   <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
              <Link
                href="#explore"
                className="inline-flex items-center gap-3 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-semibold px-6 py-3 rounded-full text-sm hover:bg-[#D4AF37]/10 transition-all duration-200"
              >
                Explore Programs
                <div className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0A1A12] flex items-center justify-center">
                   <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="relative z-20 translate-y-1/2">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-2xl border border-[#1A3A28] py-8 px-4 sm:px-8 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 bg-[#0A1C12]"
            >
              {STATS.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex flex-1 items-center justify-center w-full relative">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Icon className="w-10 h-10 text-[#D4AF37]" strokeWidth={1.5} />
                      </div>
                      <div className="text-left">
                        <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37] leading-none mb-1">{stat.value}</p>
                        <p className="text-white/80 text-xs sm:text-sm font-medium whitespace-pre-line leading-snug">{stat.label}</p>
                      </div>
                    </div>
                    {idx < STATS.length - 1 && (
                      <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-[#D4AF37]/20" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHAT YOU'LL EXPERIENCE ===== */}
      <section ref={expRef} id="explore" className="pt-32 sm:pt-40 pb-16 sm:pb-24 bg-[#FAF8F3]">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${expVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111] tracking-wide">
              WHAT YOU&apos;LL EXPERIENCE
            </h2>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="border border-[#EBE5D9] bg-[#FDFCF9] rounded-3xl p-6 lg:p-8 max-w-7xl mx-auto shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {EXPERIENCE_CARDS.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-white rounded-2xl p-6 text-center border border-[#F2EFE9] hover:shadow-md transition-shadow flex flex-col items-center"
                  >
                    <div className="w-14 h-14 mb-5 rounded-full bg-[#0A1C12] flex items-center justify-center shadow-sm">
                      <Icon className="w-6 h-6 text-[#D4AF37]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-[#111] font-bold text-sm mb-3 leading-tight">{card.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/student/innovation-club"
              className="inline-flex items-center gap-3 bg-[#0A1C12] text-white font-medium px-8 py-3.5 rounded-full text-sm hover:bg-[#153424] transition-colors shadow-md"
            >
              View All Programs
              <div className="w-6 h-6 rounded-full bg-[#183625] flex items-center justify-center">
                <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EXPERT EXPOSURE ===== */}
      <section ref={expertRef} className="py-16 sm:py-20 bg-[#FAF8F3]">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${expertVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div
            className="rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden border border-[#D4AF37]/15"
            style={{ background: 'linear-gradient(135deg, #0B1E14 0%, #0D2818 50%, #0F1F15 100%)' }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10">
              <div className="flex items-start sm:items-center justify-between mb-2 flex-col sm:flex-row gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#D4AF37] tracking-tight">EXPERT EXPOSURE</h2>
                  <p className="text-white/50 text-sm mt-1">Learn directly from people building the future.</p>
                </div>
              </div>

              <div className="relative mt-8">
                <button
                  onClick={() => scrollExperts(-1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-9 h-9 bg-[#1A3A28] border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-white hover:bg-[#244832] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                  ref={expertContainerRef}
                  className="overflow-x-auto scrollbar-hide px-6"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {/* Top row - 4 experts */}
                  <div className="flex justify-center gap-8 sm:gap-12 lg:gap-16 mb-8">
                    {EXPERTS.slice(0, 4).map((expert) => (
                      <div key={expert.name} className="flex flex-col items-center shrink-0 min-w-[130px] max-w-[150px]">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#D4AF37]/50 overflow-hidden mb-3 relative bg-[#D4AF37]/10">
                          <Image
                            src={expert.photo}
                            alt={expert.name}
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        </div>
                        <h4 className="text-[#D4AF37] font-bold text-sm text-center leading-tight">{expert.name}</h4>
                        <p className="text-white/70 text-xs text-center mt-0.5 leading-tight">{expert.credential}</p>
                        <p className="text-white/40 text-[11px] text-center mt-0.5 leading-tight">{expert.specialty}</p>
                      </div>
                    ))}
                  </div>

                  {/* Bottom row - 3 experts */}
                  <div className="flex justify-center gap-8 sm:gap-12 lg:gap-16">
                    {EXPERTS.slice(4).map((expert) => (
                      <div key={expert.name} className="flex flex-col items-center shrink-0 min-w-[130px] max-w-[150px]">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#D4AF37]/50 overflow-hidden mb-3 relative bg-[#D4AF37]/10">
                          <Image
                            src={expert.photo}
                            alt={expert.name}
                            fill
                            className="object-cover"
                            sizes="112px"
                          />
                        </div>
                        <h4 className="text-[#D4AF37] font-bold text-sm text-center leading-tight">{expert.name}</h4>
                        <p className="text-white/70 text-xs text-center mt-0.5 leading-tight">{expert.credential}</p>
                        <p className="text-white/40 text-[11px] text-center mt-0.5 leading-tight">{expert.specialty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => scrollExperts(1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-9 h-9 bg-[#1A3A28] border border-[#D4AF37]/30 rounded-full flex items-center justify-center text-white hover:bg-[#244832] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INNOVATION JOURNEY + MAJOR PROGRAMS ===== */}
      <section ref={journeyRef} className="py-16 sm:py-20 bg-[#FAF8F3]">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${journeyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
            {/* Left - Innovation Journey */}
            <div className="flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111] tracking-tight">YOUR INNOVATION JOURNEY</h2>
              <p className="text-neutral-500 text-sm mt-1 mb-6">From curiosity to impact &mdash; we guide every step.</p>

              <div className="border border-[#EBE5D9] bg-[#FDFCF9] rounded-3xl p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-center relative">
                <div className="relative">
                  {/* Top row: steps 01 - 05 */}
                  <div className="grid grid-cols-5 gap-2 relative">
                    <div className="absolute top-[58%] left-[10%] right-[10%] h-px border-t border-dashed border-[#D4AF37]" />
                    {JOURNEY_STEPS.slice(0, 5).map((step) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.num} className="flex flex-col items-center text-center relative z-10">
                          <span className="text-gray-500 text-xs font-bold mb-2">{step.num}</span>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0A1C12] border border-[#1A3A28] flex items-center justify-center shadow-sm">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                          </div>
                          <p className="text-[#111] text-[10px] sm:text-xs font-semibold mt-3 leading-tight max-w-[60px]">{step.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Connecting loop */}
                  <div className="relative h-12 w-full">
                    <div className="absolute right-[10%] top-[-10px] bottom-[-10px] w-[10%] border-r border-dashed border-[#D4AF37] rounded-r-3xl" />
                  </div>

                  {/* Bottom row: steps 09 - 06 (reversed) */}
                  <div className="grid grid-cols-4 gap-2 relative">
                    <div className="absolute top-[58%] left-[12%] right-[12%] h-px border-t border-dashed border-[#D4AF37]" />
                    {JOURNEY_STEPS.slice(5).reverse().map((step) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.num} className="flex flex-col items-center text-center relative z-10">
                          <span className="text-gray-500 text-xs font-bold mb-2">{step.num}</span>
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0A1C12] border border-[#1A3A28] flex items-center justify-center shadow-sm">
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4AF37]" />
                          </div>
                          <p className="text-[#111] text-[10px] sm:text-xs font-semibold mt-3 leading-tight max-w-[60px]">{step.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Major Programs */}
            <div className="flex flex-col">
              <h2 className="text-xl sm:text-2xl font-bold text-[#111] tracking-tight">MAJOR PROGRAMS</h2>
              <p className="text-neutral-500 text-sm mt-1 mb-6">Programs designed to challenge, inspire and elevate.</p>

              <div className="border border-[#EBE5D9] bg-[#FDFCF9] rounded-3xl p-6 sm:p-8 shadow-sm flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                  {MAJOR_PROGRAMS.map((program) => (
                    <div
                      key={program.title}
                      className="relative border border-[#1A3A28] rounded-2xl p-5 hover:border-[#D4AF37]/40 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between min-h-[220px]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1C12] to-[#040C07]" />
                      
                      <div className="relative z-10 w-[65%]">
                        <h3 className="text-white font-bold text-sm sm:text-base leading-snug mb-2">{program.title}</h3>
                        <p className="text-white/60 text-[11px] leading-relaxed">{program.desc}</p>
                      </div>
                      
                      <div className="relative z-10 mt-6">
                        <Link
                          href="/student/innovation-club"
                          className="inline-flex items-center gap-2 border border-[#D4AF37] text-[#D4AF37] font-semibold px-4 py-1.5 rounded-full text-xs hover:bg-[#D4AF37]/10 transition-colors"
                        >
                          Explore
                          <div className="w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                            <ChevronRight className="w-2.5 h-2.5 text-[#07160E]" />
                          </div>
                        </Link>
                      </div>

                      <div className="absolute right-2 bottom-[-10%] top-[-10%] w-[75%] flex items-center justify-end pointer-events-none">
                        <div className="relative w-full h-[125%]">
                          <Image
                            src={program.image}
                            alt={program.title}
                            fill
                            className="object-contain object-right scale-110 origin-right"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ANNUAL TIMELINE + FEATURED LEARNING ===== */}
      <section ref={timelineRef} className="py-16 sm:py-20 bg-[#FAF8F3]">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${timelineVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Left - Annual Timeline */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">ANNUAL TIMELINE</h2>
              <p className="text-neutral-500 text-sm mt-1 mb-8">A year full of learning, building and winning.</p>

              <div className="relative">
                <div className="flex items-start gap-3 sm:gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                  {TIMELINE_EVENTS.map((event, i) => (
                    <div key={event.month} className="flex flex-col items-center shrink-0 min-w-[70px] sm:min-w-[80px] relative">
                      <div className={`${event.color} text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-lg mb-3 shadow-sm`}>
                        {event.month}
                      </div>
                      <div className="w-3 h-3 rounded-full bg-[#1A1A1A] border-2 border-[#D4AF37] relative z-10" />
                      <p className="text-[#1A1A1A] text-[10px] sm:text-xs font-medium mt-3 text-center leading-tight max-w-[80px]">{event.label}</p>
                      {i < TIMELINE_EVENTS.length - 1 && (
                        <ChevronRight className="absolute right-[-14px] top-[42px] w-3 h-3 text-[#D4AF37]/40" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="absolute left-6 right-6 top-[44px] h-px bg-[#1A1A1A]/15" />
              </div>
            </div>

            {/* Right - Featured Learning */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">FEATURED LEARNING</h2>
              <p className="text-neutral-500 text-sm mt-1 mb-8">Future-ready skills for future leaders.</p>

              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
                {LEARNING_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.label} className="flex flex-col items-center shrink-0 min-w-[70px] group cursor-pointer">
                      <div className="w-14 h-14 rounded-full bg-[#0B1E14] border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/50 transition-colors mb-2">
                        <Icon className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <p className="text-[#1A1A1A] text-xs font-medium text-center">{cat.label}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6">
                <Link
                  href="/student/innovation-club"
                  className="inline-flex items-center gap-2 bg-[#0B1E14] text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-[#143D26] transition-colors"
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
      <section ref={resourceRef} className="py-16 sm:py-20 bg-[#FAF8F3]">
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${resourceVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">RESOURCE LIBRARY</h2>
            <p className="text-neutral-500 text-sm mt-2">Everything you need to ideate, build and scale.</p>
            <div className="w-16 h-1 bg-[#D4AF37] mx-auto mt-4" />
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8">
            {RESOURCES.map((res) => {
              const Icon = res.icon;
              return (
                <div key={res.label} className="flex flex-col items-center group cursor-pointer min-w-[80px]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0B1E14] border border-[#D4AF37]/20 flex items-center justify-center group-hover:border-[#D4AF37]/50 group-hover:bg-[#143D26] transition-all duration-200">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
                  </div>
                  <p className="text-[#1A1A1A] text-xs font-medium mt-2 text-center max-w-[80px] leading-tight">{res.label}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/student/innovation-club/resources"
              className="inline-flex items-center gap-2 bg-[#0B1E14] text-white font-bold px-6 py-3 rounded-full text-sm hover:bg-[#143D26] transition-colors"
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
        className="py-16 sm:py-24 bg-[#FAF8F3]"
      >
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
            ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-[#0A1C12]">
            <div className="absolute inset-0">
              <Image
                src="/images/innovation-club/journey-banner.png"
                alt="Ready to build the future"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
            
            <div className="relative z-10 py-16 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-3 tracking-wide">
                READY TO BUILD THE FUTURE?
              </h2>
              <p className="text-white/80 text-sm mb-8 max-w-xl">
                Join thousands of young innovators and turn your ideas into impact.
              </p>
              
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C29B27] via-[#F3D778] to-[#C29B27] text-[#111] font-bold px-8 py-3.5 rounded-lg text-sm hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300 mb-10"
              >
                Join Innovation Club
                <div className="w-5 h-5 rounded-full bg-black/15 flex items-center justify-center ml-1">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
              
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
                {[
                  { label: 'LEARN', icon: Lightbulb },
                  { label: 'BUILD', icon: Wrench },
                  { label: 'INNOVATE', icon: Sparkles },
                  { label: 'LEAD', icon: Target }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-2.5">
                      <Icon className="w-5 h-5 text-[#D4AF37]" strokeWidth={2} />
                      <span className="text-white font-bold tracking-widest text-xs">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
