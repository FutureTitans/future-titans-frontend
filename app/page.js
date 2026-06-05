'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, isStudent } from '@/lib/auth';
import {
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Play, Plus, Minus,
  Users, Award, Lightbulb, MessageCircle, Globe, Crown,
  Search, Trophy, Flag, Megaphone, Briefcase, CheckCircle2, Star,
  Phone, Mail, Menu, X, Instagram, Facebook, Linkedin, Youtube, Twitter,
  Calendar, GraduationCap, Target, Zap, Shield, Rocket
} from 'lucide-react';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '800'],
  style: ['normal', 'italic'],
});

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function ProgressBar({ label, value, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="flex items-center gap-3">
      <span className="text-sm text-[#1B2A4A] font-medium w-32 shrink-0">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C8960C] rounded-full transition-all duration-1000 ease-out"
          style={{
            width: visible ? `${Math.min(value * 1.5, 100)}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
      <span className="text-sm font-bold text-[#C8960C] w-10 text-right">+{value}%</span>
    </div>
  );
}

function ParentCarousel({ testimonials }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [testimonials.length]);

  const go = (dir) => {
    setCurrent((prev) => (prev + dir + testimonials.length) % testimonials.length);
    resetTimer();
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {testimonials.map((t, idx) => (
            <div key={idx} className="w-full shrink-0 px-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-[#C8960C]/30 font-serif leading-none shrink-0">&ldquo;</div>
                  <div>
                    <p className={`${playfair.className} text-base sm:text-lg text-[#1B2A4A] leading-relaxed mb-4`}>
                      {t.quote}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#C8960C]">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-[#1B2A4A]">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.location}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-6">
        <button
          onClick={() => go(-1)}
          className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-1.5">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrent(idx); resetTimer(); }}
              className={`w-2 h-2 rounded-full transition-all ${idx === current ? 'bg-[#C8960C] w-6' : 'bg-gray-300'}`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => go(1)}
          className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Landing() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);



  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) router.push('/admin');
      else if (isStudent()) router.push('/student/dashboard');
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);


  const navLinks = [
    // { label: 'Programs', href: '#', hasDropdown: true },
    { label: 'Future Titans', href: '/future-titans' },
    { label: 'For Parents', href: '/for-parents' },
    { label: 'For Schools', href: '/for-schools' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'About Us', href: '/about-us' },
  ];

  const skills = [
    { icon: <Target className="w-7 h-7" />, title: 'Confidence', desc: 'Speak up, lead fearlessly' },
    { icon: <Crown className="w-7 h-7" />, title: 'Leadership', desc: 'Inspire & take initiative' },
    { icon: <MessageCircle className="w-7 h-7" />, title: 'Communication', desc: 'Express ideas with impact' },
    { icon: <Lightbulb className="w-7 h-7" />, title: 'Creativity', desc: 'Think differently, build solutions' },
    { icon: <Search className="w-7 h-7" />, title: 'Problem Solving', desc: 'Tackle real-world challenges' },
    { icon: <Globe className="w-7 h-7" />, title: 'Future Readiness', desc: 'AI-ready, life-ready' },
  ];


  const parentTestimonials = [
    {
      quote: 'My daughter went from being shy to presenting her idea in front of 200 people. Youngpreneurs changed her life.',
      name: 'Priya Sharma, Parent',
      location: 'Mumbai',
    },
    {
      quote: 'The mentors are world-class. My son now thinks about problems like an entrepreneur — at age 15.',
      name: 'Rajan Mehta, Parent',
      location: 'Delhi',
    },
    {
      quote: 'Best investment we made in our child\'s education. The confidence boost is visible every single day.',
      name: 'Anita Nair, Parent',
      location: 'Bangalore',
    },
    {
      quote: 'Unlike any other program — structured, inspiring, and results-driven. Couldn\'t recommend it more.',
      name: 'Suresh Pillai, Parent',
      location: 'Hyderabad',
    },
  ];

  const faqsLeft = [
    { q: 'What is Future Titans?', a: 'Future Titans is India\'s biggest entrepreneurial hunt for students aged 12–19, designed to nurture innovation, creativity, and leadership skills through a structured capability-building journey.' },
    { q: 'Who can join?', a: 'Students aged 12–19 from across India can participate in Youngpreneurs programs and the Future Titans competition.' },
    { q: 'How much time does it take?', a: 'The program is designed to fit around school schedules, requiring just 2-3 hours per week.' },
    { q: 'Will this affect my child\'s board exam preparation?', a: 'Not at all. The program is designed to complement — not compete with — academics. Sessions are flexible and only require 2–3 hours per week. Many of our top-performing students are board exam toppers who credit the program for improving their critical thinking and time management.' },
  ];

  const faqsRight = [
    { q: 'Is it safe for my child?', a: 'Absolutely. We maintain strict safety protocols, verified mentors, and age-appropriate content throughout the journey.' },
    { q: 'What does the ₹1,500/yr fee include?', a: 'Everything — all learning modules, AI mentorship access, competition entry, certificates, expert sessions, and access to the national finale. No hidden charges.' },
    { q: 'Will my child get a certificate?', a: 'Yes, all participants receive a completion certificate. Top performers get additional recognition, awards, and incubation opportunities.' },
    { q: 'What if my child doesn\'t make it past Phase 1?', a: 'Every participant completes the full workshop series regardless of competition results. The real value is in the capability-building journey — the competition is a bonus. Your child gains skills, certificates, and confidence no matter what.' },
  ];


  const competitionFeatures = [
    { icon: <Trophy className="w-6 h-6" />, label: '₹10 LAKHS+', sub: 'Prize Pool' },
    { icon: <GraduationCap className="w-6 h-6" />, label: 'Top Mentors', sub: '& Judges' },
    { icon: <Megaphone className="w-6 h-6" />, label: 'Media', sub: 'Recognition' },
    { icon: <Briefcase className="w-6 h-6" />, label: 'Investor', sub: 'Access' },
    { icon: <Globe className="w-6 h-6" />, label: 'National', sub: 'Finale' },
    { icon: <Award className="w-6 h-6" />, label: 'Certificates', sub: 'for All' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* ═══ FLOATING WHATSAPP BUTTON ═══ */}
      <a
        href="https://wa.me/919038428532"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 hover:-translate-y-0.5 transition-all group"
        aria-label="Chat with us on WhatsApp"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="text-sm font-semibold">Chat with Us</span>
      </a>

      {/* ═══ NAVBAR ═══ */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-md' : 'shadow-sm'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            <Link href="/" className="shrink-0">
              <img src="/images/yp/yp-logo-full.webp" alt="Youngpreneurs" className="h-10 sm:h-12 w-auto object-contain" />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-[#1B2A4A] hover:text-[#C8960C] transition-colors"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2 rounded-full border border-[#1B2A4A] text-[#1B2A4A] text-sm font-semibold hover:bg-[#1B2A4A] hover:text-white transition-all"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 rounded-full bg-[#C8960C] text-white text-sm font-semibold hover:bg-[#b5870b] transition-all flex items-center gap-1.5"
              >
                See If Your Child Qualifies
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <button
              className="lg:hidden p-2 text-[#1B2A4A]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 z-40">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative bg-white border-t border-gray-100 shadow-xl max-h-[80vh] overflow-y-auto">
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block px-4 py-3 text-[#1B2A4A] font-medium rounded-xl hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-3 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-3 rounded-xl border border-[#1B2A4A] text-[#1B2A4A] font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full text-center px-4 py-3 rounded-xl bg-[#C8960C] text-white font-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    See If Your Child Qualifies
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="bg-[#FFFBF0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-12 lg:pt-0 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="-mt-12 lg:-mt-20">
              <h1 className={`${playfair.className} text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-[#1B2A4A] leading-[1.1] mb-4`}>
                Raise a child<br />
                who <span className="text-[#C8960C]">creates</span><br />
                solutions.
              </h1>

              <p className="text-[#C8960C] font-semibold text-sm mb-3">
                For students aged 12–19 | Across India
              </p>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 max-w-lg">
                Youngpreneurs builds confident, creative, future-ready students through India&apos;s most powerful <span className="font-semibold text-[#1B2A4A]">innovation platform.</span>
              </p>

              {/* Prize Money — Big & Bold */}
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-[#C8960C]" />
                <span className="text-lg sm:text-xl font-bold text-[#1B2A4A]">Compete for <span className="text-[#C8960C]">₹10 Lakhs+</span> in prizes, incubation & mentorship</span>
              </div>

              {/* Board Exam Reassurance */}
              <p className="text-gray-500 text-xs sm:text-sm mb-5 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-green-600 shrink-0" />
                Designed to complement — not compete with — your child&apos;s academic schedule. Just 2–3 hrs/week.
              </p>

              <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-100 w-fit mb-6">
                <img src="/images/yp/iit-kharagpur.svg" alt="IIT Kharagpur" className="h-8 w-8 object-contain" />
                <span className="text-sm font-bold text-[#1B2A4A]">Knowledge Partner: IIT Kharagpur</span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <Link
                  href="/signup"
                  className="px-6 py-3.5 rounded-full bg-[#C8960C] text-white font-semibold text-sm hover:bg-[#b5870b] transition-all flex items-center gap-2 shadow-lg shadow-[#C8960C]/20"
                >
                  Check Eligibility & Enroll — ₹1,500/yr
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {['/images/yp/devika.jpg', '/images/yp/partha.jpg', '/images/yp/sachin.jpeg', '/images/yp/pankaj.jpg'].map((src, i) => (
                    <img key={i} src={src} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8960C] text-[#C8960C]" />
                  ))}
                </div>
                <span className="text-sm text-gray-600"><span className="font-bold text-[#1B2A4A]">4.8/5</span> · Trusted by 10,000+ families</span>
              </div>
            </div>

            <div className="relative lg:-mr-16 xl:-mr-24">
              <div className="relative w-full lg:w-[120%] xl:w-[130%] aspect-[3/4] sm:aspect-[4/4] lg:aspect-[4/3]">
                <img
                  src="/images/yp/hero-students.jpg"
                  alt="Real students at Youngpreneurs"
                  className="w-full h-full object-cover scale-110"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 80%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 80%, transparent 100%)',
                    WebkitMaskComposite: 'source-in',
                  }}
                />
              </div>
              <div className="flex justify-center sm:justify-end -mt-4 relative z-10 px-4">
                <div className="bg-[#1B2A4A] text-white rounded-xl p-4 sm:p-5 w-full sm:w-56 shadow-xl">
                  <div className="text-[#C8960C] font-bold text-lg sm:text-xl tracking-wider mb-1">FUTURE TITANS</div>
                  <p className="text-xs text-gray-300 mb-3">India&apos;s Biggest Entrepreneurial Hunt for Students</p>
                  <div className="border-t border-white/20 pt-2">
                    <div className="text-xs text-gray-400">Prize Pool</div>
                    <div className="text-[#C8960C] font-bold text-lg">₹10 LAKHS+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GUIDED BY GLOBAL FACULTY ═══ */}
      <section className="py-10 lg:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">Guided By Global Faculty</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto">
              {[
                { name: 'Prof. Fred Katz', title: 'Johns Hopkins Business School', image: '/images/yp/fred.jpeg' },
                { name: 'Dr. Partha Ghosh', title: 'Former Senior Partner, McKinsey', image: '/images/yp/partha.jpg' },
                { name: 'Suman Bose', title: 'Former CEO & MD, Siemens', image: '/images/yp/suman.jpg' },
                { name: 'Sandipan Chattopadhyay', title: 'Former CTO, Justdial', image: '/images/yp/sandipan.jpeg' },
              ].map((mentor, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <img src={mentor.image} alt={mentor.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#C8960C]/20 mb-2 group-hover:border-[#C8960C]/60 transition-all" />
                  <h4 className="text-xs sm:text-sm font-bold text-[#1B2A4A] leading-tight">{mentor.name}</h4>
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-tight mt-0.5">{mentor.title}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ WHAT YOUR CHILD WILL GAIN ═══ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className={`${playfair.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B2A4A] mb-3`}>
                What Your Child Will Gain
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">Ages 12–19 · Building skills classrooms don&apos;t teach</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:gap-10 max-w-4xl mx-auto">
            {skills.map((skill, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] flex items-center justify-center text-[#C8960C] mb-3 group-hover:scale-110 group-hover:bg-[#C8960C] group-hover:text-white transition-all duration-300">
                    {skill.icon}
                  </div>
                  <h3 className="text-sm font-bold text-[#1B2A4A] mb-1">{skill.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{skill.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ REAL GROWTH / SSI SECTION ═══ */}
      <section className="py-16 lg:py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            <Reveal>
              <div>
                <h2 className={`${playfair.className} text-2xl sm:text-3xl lg:text-[2.5rem] font-bold text-[#1B2A4A] leading-tight mb-6`}>
                  Real Growth.<br />
                  Real Numbers.
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Our proprietary SSI (Solution Seeking Index) measures 21st century skills that classrooms can&apos;t.
                </p>
                <ul className="space-y-3">
                  {[
                    'AI-powered assessment',
                    'Personalized growth roadmap',
                    'Track progress over time',
                    'Skills that colleges & future employers value',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-[#1B2A4A] text-lg mb-1">Average improvement in 3 months</h3>
                <p className="text-xs text-gray-500 mb-5">via SSI (Solution Seeking Index)</p>
                <div className="space-y-4">
                  <ProgressBar label="Confidence" value={37} delay={0} />
                  <ProgressBar label="Problem Solving" value={42} delay={100} />
                  <ProgressBar label="Creativity" value={45} delay={200} />
                  <ProgressBar label="Leadership" value={40} delay={300} />
                  <ProgressBar label="Communication" value={35} delay={400} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="bg-[#166534] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="text-5xl text-white/20 font-serif absolute top-4 left-6">&ldquo;</div>
                <div className="relative z-10 pt-6">
                  <p className={`${playfair.className} text-lg sm:text-xl leading-relaxed mb-6`}>
                    My daughter went from being shy to presenting her idea in front of 200 people. Youngpreneurs changed her life.
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20" />
                    <div>
                      <div className="font-semibold text-sm">Priya Sharma, Parent</div>
                      <div className="text-xs text-white/60">Mumbai</div>
                    </div>
                  </div>
                </div>
                <div className="text-5xl text-white/20 font-serif absolute bottom-4 right-6">&rdquo;</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ BACKED BY INSTITUTIONS ═══ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={`${playfair.className} text-xl sm:text-2xl lg:text-3xl font-bold text-[#1B2A4A] text-center mb-10`}>
              Backed By Institutions Parents Trust
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14 lg:gap-20">
              <img src="/images/yp/ttoi.png" alt="Times of India" className="h-12 sm:h-16 w-auto object-contain" />
              <img src="/images/yp/et.png" alt="Economic Times" className="h-12 sm:h-16 w-auto object-contain" />
              <img src="/images/yp/startUpIndiaLogo.png" alt="Startup India" className="h-10 sm:h-14 w-auto object-contain" />
              <img src="/images/yp/AIPlogo.png" alt="Association of Indian Principals" className="h-12 sm:h-16 w-auto object-contain" />
              <img src="/images/yp/AIClogo.png" alt="AIC BIMTECH" className="h-12 sm:h-16 w-auto object-contain" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ STUDENT SUCCESS STORIES ═══ */}
      <section className="py-16 lg:py-20 bg-[#FFFBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={`${playfair.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B2A4A] text-center mb-3`}>
              Hear It From Our Students
            </h2>
            <p className="text-gray-500 text-sm sm:text-base text-center mb-10">Real students. Real outcomes. Real confidence.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: 'Kshitij, Class 10', location: 'Kolkata', quote: 'Before Youngpreneurs, I had ideas but no clue how to build them. Now I\'ve built a working prototype and pitched it to real mentors. My confidence has gone through the roof.', avatar: '🧑‍💻' },
              { name: 'Naisha, Class 9', location: 'Delhi', quote: 'I used to be terrified of public speaking. After the workshops, I presented my solution in front of 150 people — and loved it. My parents couldn\'t believe the change.', avatar: '👩‍🎓' },
              { name: 'Shivay, Class 11', location: 'Bangalore', quote: 'The SURGE framework taught me to think like an entrepreneur. I now look at every problem as an opportunity. It\'s completely changed how I approach challenges.', avatar: '🎯' },
            ].map((student, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md hover:border-[#C8960C]/30 transition-all h-full">
                  <div className="text-3xl mb-3">{student.avatar}</div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">&ldquo;{student.quote}&rdquo;</p>
                  <div className="border-t border-gray-100 pt-3">
                    <div className="font-semibold text-sm text-[#1B2A4A]">{student.name}</div>
                    <div className="text-xs text-gray-500">{student.location}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARENT TESTIMONIALS ═══ */}
      <section className="py-16 lg:py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={`${playfair.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B2A4A] text-center mb-3`}>
              What Parents Are Saying
            </h2>
            <p className="text-gray-500 text-sm sm:text-base text-center mb-10">Real feedback from families across India</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {parentTestimonials.map((t, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-7 shadow-sm hover:shadow-md hover:border-[#C8960C]/20 transition-all h-full">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="text-3xl text-[#C8960C]/25 font-serif leading-none shrink-0">&ldquo;</div>
                    <p className={`${playfair.className} text-base sm:text-lg text-[#1B2A4A] leading-relaxed`}>
                      {t.quote}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-[#FFF8E7] flex items-center justify-center text-[#C8960C]">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#1B2A4A]">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.location}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FUTURE TITANS — HERO ═══ */}
      <section className="bg-[#1B2A4A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <Reveal>
                <p className="text-[#C8960C] font-bold text-xs tracking-[0.2em] uppercase mb-4">
                  Be Seen. Be Heard. Build the Future.
                </p>
                <h2 className={`${playfair.className} text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3`}>
                  FUTURE TITANS
                </h2>
                <p className="text-gray-300 text-base sm:text-lg mb-2">
                  India&apos;s Biggest Entrepreneurial Hunt for Students
                </p>
                <p className="text-gray-400 text-sm mb-6">
                  Ages 12–19 · ₹10 Lakhs+ Prize Pool · National Finale
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-lg">
                  A national challenge designed to equip India&apos;s teens with the solution-seeking mindset. Before the competition, every participant goes through a 5-part &quot;Build Like a Titan&quot; workshop series.
                </p>
              </Reveal>

              <Reveal delay={150}>
                <div className="flex flex-wrap gap-4 sm:gap-6 mb-8">
                  {competitionFeatures.map((feat, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white mb-2">
                        {feat.icon}
                      </div>
                      <div className="text-white text-xs font-bold">{feat.label}</div>
                      <div className="text-gray-400 text-[10px]">{feat.sub}</div>
                    </div>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={250}>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8960C] text-white font-bold text-sm hover:bg-white hover:text-[#1B2A4A] transition-all"
                  >
                    Check Eligibility & Fees
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/future-titans"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-white/20 text-white font-bold text-sm hover:border-[#C8960C] hover:text-[#C8960C] transition-all"
                  >
                    Learn More
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <div className="relative w-full lg:w-[120%] xl:w-[130%] aspect-[3/4] sm:aspect-[4/4] lg:aspect-[4/3]">
                <img
                  src="/images/yp/hero-students.jpg"
                  alt="Real students at Youngpreneurs"
                  className="w-full h-full object-cover scale-110"
                  style={{
                    maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 80%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 80%, transparent 100%)',
                    WebkitMaskComposite: 'source-in',
                  }}
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FUTURE TITANS — FRAMEWORKS ═══ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B2A4A] mb-3`}>
                How Your Child Learns to <span className="text-[#C8960C]">Think & Build</span>
              </h2>
              <p className="text-gray-500 text-base max-w-2xl mx-auto">Here&apos;s how we teach your child to think and build — in 4 clear steps. No jargon, just a proven curriculum.</p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {[
              { title: 'IDEA DNA', sub: 'Step 1: From Problem to Solution', body: 'Your child picks a real problem they care about, brainstorms solutions, builds a simple prototype, and tests it — learning to think like an innovator.' },
              { title: 'S.U.R.G.E.', sub: 'Step 2: A Thinking Framework', body: 'A simple 5-step method that teaches your child how to break down any challenge, ask the right questions, and turn ideas into clear action plans.' },
              { title: 'SSI', sub: 'Step 3: Track Your Child\'s Growth', body: 'We measure your child\'s progress across confidence, creativity, leadership, and problem-solving — so you can see real improvement, not just grades.' },
              { title: 'AI Co-Founder', sub: 'Step 4: A Smart Study Buddy', body: 'An AI assistant that helps your child refine their ideas, prepare their pitch, and think through challenges — like having a mentor available anytime.' },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-6 hover:border-[#C8960C]/30 hover:-translate-y-1 hover:shadow-lg transition-all group h-full">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C8960C]/10 text-xs font-bold text-[#C8960C] ring-1 ring-[#C8960C]/25">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-lg font-bold text-[#1B2A4A]">{c.title}</h3>
                      <p className="text-[#C8960C] text-xs mt-0.5">{c.sub}</p>
                      <p className="text-gray-600 text-sm leading-relaxed mt-2">{c.body}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FUTURE TITANS — WORKSHOP LADDER ═══ */}
      <section className="py-16 lg:py-20 bg-[#FFFBF0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B2A4A]`}>
                Build Like a Titan: <span className="text-[#C8960C]">5-Step Journey</span>
              </h2>
              <p className="mt-3 text-gray-500 max-w-2xl mx-auto">Five connected workshops — each step prepares you for the next, from empathy to pitch.</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Discover & Define', body: 'Empathy-driven exploration of real-world challenges' },
              { step: '02', title: 'Design the Difference', body: 'Master ideation tools to uncover what makes their solution stand out' },
              { step: '03', title: 'Prototype to Pitch', body: 'Bring ideas to life using no-code tools, rapid testing, and iteration' },
              { step: '04', title: 'Map Your Model', body: 'Learn monetization and scalability — turning ideas into viable models' },
              { step: '05', title: 'Pitch Like a Pro', body: 'A masterclass in influence, refining delivery and confidence' },
            ].map((w, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#C8960C]/30 transition-all h-full">
                  <span className="text-[#C8960C] font-mono text-2xl font-black opacity-30 block mb-2">{w.step}</span>
                  <h4 className="text-sm font-bold text-[#1B2A4A] mb-1.5">{w.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{w.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FUTURE TITANS — COMPETITION FORMAT ═══ */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-[#C8960C]`}>
                The Competition Format
              </h2>
              <p className="mt-3 text-gray-500">Three milestones from idea to national stage.</p>
            </div>
          </Reveal>
          <div className="space-y-5">
            {[
              { phase: 'Phase 1', title: 'Idea Submission (Virtual)', body: 'Participants submit their refined concepts shaped using IDEA DNA, S.U.R.G.E., and early-level experimentation.' },
              { phase: 'Phase 2', title: 'Pitch Video (Virtual)', body: 'Participants communicate their concept through a short video pitch showcasing their problem insight, structured approach, and prototype.' },
              { phase: 'Phase 3', title: 'The Grand Finale (Live Bootcamp)', body: 'The Top 50 Titans join a national bootcamp — deepening innovation models, receiving guidance from mentors, and pitching to a national jury.' },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="flex gap-4 sm:gap-6">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full bg-[#C8960C] text-white text-sm font-bold shadow-lg shadow-[#C8960C]/20">{i + 1}</div>
                  <div className="flex-1 bg-[#FAFAFA] border border-gray-100 rounded-2xl p-5 sm:p-6 hover:border-[#C8960C]/30 transition-all">
                    <span className="text-[#C8960C] font-mono font-bold text-xs tracking-wider">{p.phase}</span>
                    <h4 className="text-base sm:text-lg font-bold text-[#1B2A4A] mt-1 mb-2">{p.title}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={400}>
            <div className="text-center mt-10">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#C8960C] text-white font-bold text-sm tracking-wider hover:bg-[#b5870b] transition-all shadow-lg shadow-[#C8960C]/20"
              >
                Check Eligibility & Enroll — ₹1,500/yr
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ CONNECT WITH YOUNGPRENEURS ═══ */}
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={`${playfair.className} text-2xl sm:text-3xl font-bold text-[#1B2A4A] text-center mb-8`}>
              Connect with Youngpreneurs
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href="tel:+919038428532"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-[#1B2A4A] text-sm font-medium hover:border-[#C8960C] hover:text-[#C8960C] transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Us
              </a>
              <a
                href="mailto:yes@youngpreneurs.ai"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-[#1B2A4A] text-sm font-medium hover:border-[#C8960C] hover:text-[#C8960C] transition-all"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
              <a
                href="https://wa.me/919038428532"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-[#1B2A4A] text-sm font-medium hover:border-[#25D366] hover:text-[#25D366] transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="py-16 lg:py-20 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={`${playfair.className} text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B2A4A] text-center mb-12`}>
              Questions Parents Ask (We Answer)
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid sm:grid-cols-2 gap-x-6 gap-y-0">
              {[...faqsLeft, ...faqsRight].map((faq, idx) => (
                <div key={idx} className="border-b border-gray-200">
                  <button
                    className="w-full flex items-center justify-between py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span className="text-sm font-medium text-[#1B2A4A] pr-4">{faq.q}</span>
                    {openFaq === idx ? (
                      <Minus className="w-4 h-4 text-[#C8960C] shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>
                  <div className={`faq-answer-collapse ${openFaq === idx ? 'open' : ''}`}>
                    <div>
                      <p className="text-sm text-gray-600 pb-4">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Reveal delay={200}>
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm text-center">
                <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">Still have questions?</h3>
                <p className="text-sm text-gray-500 mb-6">Our team is here to help you.</p>
                <a
                  href="tel:+919038428532"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1B2A4A] text-[#1B2A4A] font-semibold text-sm hover:bg-[#1B2A4A] hover:text-white transition-all"
                >
                  <Phone className="w-4 h-4" />
                  TALK TO OUR COUNSELOR
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#1B2A4A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
            <div className="col-span-2 sm:col-span-3 lg:col-span-1">
              <div className="flex items-center gap-1.5 mb-4">
                <div className="w-8 h-8 bg-[#C8960C] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  YP
                </div>
                <div>
                  <div className="font-bold text-sm">YOUNGPRENEURS</div>
                  <div className="text-[10px] text-gray-400">Future Ready. Nurtured Today.</div>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-4">
                {[Instagram, Facebook, Linkedin, Youtube, Twitter].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-[#C8960C] hover:text-white transition-all"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {[
              { title: 'Programs', links: ['Future Titans', 'Workshops', 'Innovation Labs', 'AI Co-Founder'] },
              { title: 'For Parents', links: ['Overview', 'FAQ', 'Resources', 'Blog'] },
              { title: 'For Schools', links: ['Overview', 'Benefits', 'Partner With Us', 'Success Stories'] },
              { title: 'About Us', links: ['Our Story', 'Our Team', 'Media', 'Careers'] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-sm mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 text-sm hover:text-[#C8960C] transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="font-bold text-sm mb-3">Stay Updated</h4>
              <p className="text-gray-400 text-xs mb-3">Get updates on programs, events & opportunities.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 min-w-0 px-3 py-2 bg-white/10 border border-white/10 !rounded-l-lg !rounded-r-none text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C8960C] !min-h-0 h-10"
                />
                <button className="px-3 py-2 bg-[#C8960C] rounded-r-lg hover:bg-[#b5870b] transition-colors">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} youngpreneurs.ai · All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-[#C8960C] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#C8960C] transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-[#C8960C] transition-colors">Data Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
