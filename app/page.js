"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, isStudent } from '@/lib/auth';
import PublicFooter from '@/components/shared/PublicFooter';
import {
  ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Play, Plus, Minus,
  Users, Award, Lightbulb, MessageCircle, Globe, Crown,
  Search, Trophy, Flag, Megaphone, Briefcase, CheckCircle2, Star,
  Phone, Mail, Menu, X, Instagram, Facebook, Linkedin, Youtube, Twitter,
  Calendar, GraduationCap, Target, Zap, Shield, Rocket, Clock, Check
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
    { label: 'Future Titans', href: '/future-titans' },
    { label: 'For Parents', href: '/for-parents' },
    { label: 'For Schools', href: '/for-schools' },
    { label: 'Success Stories', href: '/success-stories' },
    { label: 'About Us', href: '/about-us' },
  ];

  const skills = [
    { icon: <Target className="w-7 h-7" />, title: 'Unshakeable Confidence', desc: 'No more stage fright. Watch them speak up, present ideas, and own a room fearlessly.' },
    { icon: <Crown className="w-7 h-7" />, title: 'Real-World Leadership', desc: 'They stop waiting for permission and start taking initiative — at 14.' },
    { icon: <MessageCircle className="w-7 h-7" />, title: 'Persuasive Communication', desc: 'The ability to articulate complex thoughts clearly and with massive impact.' },
    { icon: <Lightbulb className="w-7 h-7" />, title: 'Innovative Creativity', desc: 'From playing games to actually building real, working solutions people use.' },
    { icon: <Search className="w-7 h-7" />, title: 'Critical Problem Solving', desc: 'Stop memorising textbooks; start tackling real-world, dynamic challenges.' },
    { icon: <Globe className="w-7 h-7" />, title: 'AI Mastery & Future Readiness', desc: 'They won\'t fear AI taking jobs — they\'ll master AI to create their own opportunities.' },
  ];

  const parentTestimonials = [
    {
      quote: 'My child has become more proactive and confident after participating in these sessions. The exposure to entrepreneurship has been incredibly valuable.',
      name: 'Priya Sharma, Parent',
      location: 'Mumbai',
    },
    {
      quote: 'Youngpreneurs.ai has helped my child see challenges as opportunities and inspired them to think bigger about their future.',
      name: 'Parent of a High School Student',
      location: '',
    },
    {
      quote: 'The program combines innovation, leadership, and practical learning in a way that truly resonates with today\'s generation.',
      name: 'Parent',
      location: '',
    },
    {
      quote: 'I\'ve noticed a significant improvement in my child\'s communication skills and willingness to take initiative.',
      name: 'Parent of a Participant',
      location: '',
    },
    {
      quote: 'I was worried this would affect her board prep. It didn\'t — if anything, her focus improved. She manages her time better now.',
      name: 'Parent of a Participant',
      location: '',
    },
  ];

  const faqsLeft = [
    { q: 'What is Future Titans?', a: 'India\'s biggest entrepreneurial challenge for students aged 12–19 — combining a full workshop journey with a national competition. The workshops are the core; the competition is the stage.' },
    { q: 'Who can join?', a: 'Any student aged 12–19 from anywhere in India. We have students from 120+ cities — metros and smaller towns alike.' },
    { q: 'How much time does it take?', a: 'Just 2–3 hours per week. Sessions are designed to fit around school schedules, board exams, and holidays. Flexible, not rigid.' },
    { q: 'Will this affect my child\'s board exam preparation?', a: 'Not at all. Many of our top-performing students are board exam toppers who say the program improved their critical thinking and time management. The skills complement each other.' },
  ];

  const faqsRight = [
    { q: 'What about the AI part — is it safe and appropriate?', a: 'Completely. The AI tools are age-appropriate, supervised, and purposeful. We don\'t teach students to consume AI — we teach them to direct it. It\'s the difference between watching TV and learning to direct films.' },
    { q: 'What if my child doesn\'t make it past Phase 1?', a: 'Every participant completes the full 5-part workshop series regardless of competition results. They receive their certificate, their SSI score improvement, and the skills — no matter what. The competition is a bonus, not the product.' },
    { q: 'What does the enrollment fee include?', a: 'Everything: all 5 workshops, AI Co-Founder tool access, SSI assessment and growth roadmap, competition entry, mentor sessions, nationally recognised certificate, and access to the national finale for top performers. No hidden charges.' },
    { q: 'Is it safe for my child?', a: 'Yes. Strict safety protocols, verified mentors, age-appropriate content, and secure digital environments throughout.' },
  ];

  const competitionFeatures = [
    { icon: <Trophy className="w-6 h-6" />, label: '₹40 LAKHS', sub: 'Prize Pool' },
    { icon: <GraduationCap className="w-6 h-6" />, label: 'Top Mentors', sub: '& Judges' },
    { icon: <Megaphone className="w-6 h-6" />, label: 'National', sub: 'Recognition' },
    { icon: <Briefcase className="w-6 h-6" />, label: 'Investor', sub: 'Access' },
    { icon: <Globe className="w-6 h-6" />, label: 'Grand', sub: 'Finale' },
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
      <nav className={`sticky top-0 z-50 transition-all duration-300 bg-white ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
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
                Register Now
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
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="bg-[#FFFBF0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-14 pb-12 lg:pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#1B2A4A] leading-[1.12] mb-4`}>
                Will Your Child Be Replaced by AI,<br className="hidden sm:block" />
                or Will They <span className="text-[#C8960C]">Lead It?</span>
              </h1>

              <p className="text-[#C8960C] font-semibold text-sm mb-3">
                For students aged 12–19 | Across India
              </p>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-4 max-w-lg">
                The world is changing faster than ever. While millions fear AI taking over jobs, the smartest parents are doing something different — they&apos;re making sure their child knows how to use it. Youngpreneurs transforms teenagers into confident problem-solvers, creators, and future leaders through India&apos;s most powerful innovation platform. Give them the ultimate unfair advantage.
              </p>

              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                  <Trophy className="w-5 h-5 text-[#C8960C] shrink-0 mt-0.5" />
                  <span><span className="font-bold text-[#1B2A4A]">Compete for ₹40 Lakhs</span> in prizes, incubation & real mentorship.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                  <Shield className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <span>Designed to complement academics — not compete with them. Just 2–3 hrs/week.</span>
                </li>
                <li className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                  <Zap className="w-5 h-5 text-[#C8960C] shrink-0 mt-0.5" />
                  <span>Your child won&apos;t just survive the AI era — they&apos;ll build with it.</span>
                </li>
              </ul>

              <div className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-lg shadow-sm border border-gray-100 w-fit mb-6">
                <img src="/images/yp/iit-kharagpur.svg" alt="IIT Kharagpur" className="h-8 w-8 object-contain" />
                <span className="text-sm font-bold text-[#1B2A4A]">Knowledge Partner: IIT Kharagpur</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
                <Link
                  href="/signup"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#C8960C] text-white font-semibold text-sm hover:bg-[#b5870b] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#C8960C]/20"
                >
                  Register Now — Secure Your Child&apos;s Spot
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="#video"
                  className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-full border border-gray-300 text-[#1B2A4A] font-semibold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 text-[#C8960C]" />
                  See Their Transformation
                </Link>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#C8960C] text-[#C8960C]" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-600"><span className="font-bold text-[#1B2A4A]">4.8/5</span> · Trusted by 10,000+ families across 120+ cities</span>
              </div>
            </div>

            <div className="relative lg:-mr-16 xl:-mr-24">
              <div className="relative w-full lg:w-[120%] xl:w-[130%] aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3]">
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
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">Backed by institutions Indian parents trust</p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-10">
              {[
                { name: 'IIT Kharagpur', img: '/images/yp/iit-kharagpur.svg', desc: 'Curriculum co-developed with India\'s top engineering institution' },
                { name: 'Times of India', img: '/images/yp/ttoi.png', desc: 'Nationally recognised program covered by India\'s #1 newspaper' },
                { name: 'Startup India', img: '/images/yp/startUpIndiaLogo.png', desc: 'Officially backed by the Government of India\'s flagship startup initiative' },
                { name: 'AIP', img: '/images/yp/AIPlogo.png', desc: 'Endorsed by India\'s national body of school principals' },
                { name: 'AIC BIMTEC', img: '/images/yp/AIClogo.png', desc: 'Atal Incubation Centre — supporting next-generation innovators' },
              ].map((partner, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <img src={partner.img} alt={partner.name} className="h-12 sm:h-14 w-auto object-contain mb-3" />
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">{partner.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOUNDER STORY ═══ */}
      <section className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <Reveal>
              <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square w-full max-w-md mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/yp/devika.jpg"
                  alt="Devika Majumder - Founder"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className={`${playfair.className} text-2xl font-bold text-white mb-1`}>Devika Majumder</h3>
                  <p className="text-[#C8960C] font-semibold text-sm">Founder & CEO, Youngpreneurs</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div>
                <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#1B2A4A] leading-tight mb-6`}>
                  Why This Program Exists
                </h2>
                <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
                  <p>
                    Devika Majumder left India at 17 with a suitcase of dreams and a mind built for building. She earned degrees in Computer Science and Mathematics in the USA, then founded NetIQ Consulting — working with Fortune 50 to Fortune 500 companies including JP Morgan, ADP, State Street Global Advisors, and Santander.
                  </p>
                  <p>
                    When her entrepreneurial instincts pushed her further, she launched mobileSPA — the US&apos;s first mobile day spa experience, which grew into a premium corporate wellness and PR activation platform serving Google, Microsoft, PricewaterhouseCoopers, McKinsey, and BCG, and was featured at the Oscars alongside Coca-Cola and Aveeno.
                  </p>
                  <p>
                    Navigating between the US and India, she saw a critical void: the world had no real system for nurturing teen talent or helping young creators find their footing. That gap led her to file two foundational AI patents — and to build Youngpreneurs.ai, India&apos;s first youth innovation ecosystem powered by a patent-pending Mindset Engine™ and the Solution-Seeking Index™, India&apos;s first measurable mindset metric.
                  </p>
                  <p>
                    Her story has been featured in The Wall Street Journal, CNBC, The Economic Times, USA Today, Entrepreneur, and Business World. She has been nominated as one of Business Today&apos;s Most Powerful Women in Business.
                  </p>
                  <p className="font-semibold text-[#1B2A4A] text-base sm:text-lg italic mt-6 border-l-4 border-[#C8960C] pl-4">
                    "But the chapter she speaks about most is not in any publication — it&apos;s the moment she watched a brilliant teenager shrink in a room where she should have owned it. Not because the idea was weak. Because no one had ever given her the tools. That moment built Youngpreneurs. The mission is simple: find the leaders hiding inside India&apos;s classrooms. Give them everything they need to step forward. Not someday. Now."
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ AI MASTERY SECTION ═══ */}
      <section className="py-16 lg:py-24 bg-[#1B2A4A] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className={`${playfair.className} text-3xl sm:text-4xl lg:text-5xl font-bold mb-6`}>
              In the Age of AI, Your Child Doesn&apos;t Need to Fear It. <span className="text-[#C8960C]">They Need to Lead It.</span>
            </h2>
            <p className="text-xl text-gray-300 font-medium mb-8">Here&apos;s the truth no school is telling you:</p>
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8 mb-12 shadow-xl backdrop-blur-sm">
              <p className="text-xl sm:text-2xl font-bold leading-relaxed text-white">
                AI will not replace your child. But a teenager who knows how to work with AI <span className="text-[#C8960C]">will replace one who doesn&apos;t.</span>
              </p>
            </div>
            <p className="text-gray-300 mb-8 max-w-3xl mx-auto">
              At Youngpreneurs, AI isn&apos;t a subject — it&apos;s a tool your child picks up and uses from Day 1. Here&apos;s exactly what that looks like:
            </p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            {[
              "They use our AI Co-Founder tool to pressure-test their ideas — the same way a startup founder would use a co-founder to challenge their thinking",
              "They learn to frame problems using AI-assisted research — going from 'I have an idea' to 'I have data, insight, and a structured solution'",
              "They build and refine pitches with AI feedback before presenting to real mentors",
              "They leave the program understanding how to use AI as a creative and business partner — a skill that top universities and employers are already looking for"
            ].map((text, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="flex items-start gap-4 p-5 rounded-xl bg-white/5 border border-white/10 h-full">
                  <CheckCircle2 className="w-6 h-6 text-[#C8960C] shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-200 leading-relaxed">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHAT YOUR CHILD WILL GAIN ═══ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12 lg:mb-16">
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-3`}>
                What Your Child Will Gain
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">Class 8–12 · Building the thinking, confidence, and capability tomorrow&apos;s world demands</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-5xl mx-auto">
            {skills.map((skill, idx) => (
              <Reveal key={idx} delay={idx * 80}>
                <div className="flex flex-col items-center text-center group bg-[#FAFAFA] rounded-2xl p-6 border border-gray-100 hover:border-[#C8960C]/30 hover:shadow-lg transition-all h-full">
                  <div className="w-16 h-16 rounded-2xl bg-[#FFF8E7] flex items-center justify-center text-[#C8960C] mb-4 group-hover:scale-110 group-hover:bg-[#C8960C] group-hover:text-white transition-all duration-300 shadow-sm">
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1B2A4A] mb-2">{skill.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{skill.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ACADEMIC OUTCOMES ═══ */}
      <section className="py-16 lg:py-24 bg-[#FFFBF0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12 lg:mb-16 max-w-3xl mx-auto">
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-4`}>
                Academic Outcomes — Why Schools See Better Results
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                This is not an extracurricular. Every skill built here makes a student sharper, clearer, and more capable — <span className="font-bold">inside the classroom.</span>
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'Conceptual Clarity', desc: 'Students stop memorising and start understanding deeply. Innovation training rewires how a student approaches any subject — not as content to reproduce, but as a system to understand and apply.' },
              { title: 'Exam Performance', desc: 'Problem-solving improves especially in Maths & Science. Breaking a business problem into steps is the same cognitive skill that cracks a multi-part Maths question. Students don\'t freeze. They have a method.' },
              { title: 'Communication', desc: 'Students write better, think clearer, express with confidence. Pitching to industry leaders teaches communication under pressure. That skill shows up in vivas, essays, and class participation immediately.' },
              { title: 'CBSE · ICSE · IB', desc: 'Application-based learning improves performance in modern exam patterns. Future Titans masters application, analysis, and logical justification — exactly what boards are increasingly demanding.' },
              { title: 'Discipline & Focus', desc: 'Students who take responsibility for their own ideas stop waiting to be told what to do in class. Self-direction is not taught — it is triggered. And it stays.' },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8960C]/10 h-full flex flex-col">
                  <h4 className="text-[#C8960C] font-bold text-lg mb-3">{item.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={500}>
            <div className="mt-12 max-w-3xl mx-auto text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <p className="text-xl font-bold text-[#1B2A4A] mb-2">The same thinking that builds startups is the thinking that builds toppers.</p>
              <p className="text-gray-500">This is not an alternative to academics. This is what makes academics meaningful.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ REAL GROWTH / SSI SECTION ═══ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            <Reveal>
              <div>
                <h2 className={`${playfair.className} text-3xl sm:text-4xl lg:text-[2.5rem] font-bold text-[#1B2A4A] leading-tight mb-6`}>
                  Real Growth.<br />
                  Real Numbers.
                </h2>
                <p className="text-gray-600 text-base mb-6">
                  Our proprietary SSI (Solution Seeking Index) is India&apos;s first metric that measures 21st century skills — the skills classrooms can&apos;t grade.
                </p>
                <ul className="space-y-4">
                  {[
                    'AI-powered assessment',
                    'Personalised growth roadmap',
                    'Track progress over time',
                    'Skills that colleges & future employers value',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-base text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="bg-[#FAFAFA] rounded-3xl p-8 shadow-inner border border-gray-200">
                <h3 className="font-bold text-[#1B2A4A] text-xl mb-1">Average improvement in 3 months</h3>
                <p className="text-sm text-gray-500 mb-6">Measured via SSI</p>
                <div className="space-y-5">
                  <ProgressBar label="Confidence" value={37} delay={0} />
                  <ProgressBar label="Problem Solving" value={42} delay={100} />
                  <ProgressBar label="Creativity" value={45} delay={200} />
                  <ProgressBar label="Leadership" value={40} delay={300} />
                  <ProgressBar label="Communication" value={35} delay={400} />
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className="bg-[#1B2A4A] rounded-3xl p-8 text-white relative overflow-hidden shadow-xl h-full flex flex-col justify-center">
                <div className="text-6xl text-white/10 font-serif absolute top-4 left-6">&ldquo;</div>
                <div className="relative z-10 pt-6">
                  <p className={`${playfair.className} text-lg sm:text-xl leading-relaxed mb-8 text-gray-200 italic`}>
                    My child has become more proactive and confident after participating in these sessions. The exposure to entrepreneurship has been incredibly valuable.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#C8960C] flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-white">Priya Sharma</div>
                      <div className="text-sm text-[#C8960C]">Parent · Mumbai</div>
                    </div>
                  </div>
                </div>
                <div className="text-6xl text-white/10 font-serif absolute bottom-4 right-6">&rdquo;</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ MENTORS ═══ */}
      <section className="py-16 lg:py-20 bg-[#FAFAFA] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-4`}>
                Meet the Minds Behind the Program
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Every mentor, practitioner, and educator on our team brings one thing: a genuine investment in what young people are capable of.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 max-w-6xl mx-auto">
              {[
                { name: 'Prof. Fred Katz', title: 'Johns Hopkins Carey Business School', image: '/images/yp/fred.jpeg' },
                { name: 'Dr. Partha Ghosh', title: 'Former Senior Partner, McKinsey; Professor, MIT', image: '/images/yp/partha.jpg' },
                { name: 'Suman Bose', title: 'Former CEO & MD, Siemens', image: '/images/yp/suman.jpg' },
                { name: 'Sachin Kapoor', title: 'Former Sr Director, LinkedIn India', image: '/images/yp/sachin.jpeg' },
                { name: 'Dr. Julia Stamm', title: 'Founder, She Shapes AI, London', image: '/images/yp/julia.jpg' },
                { name: 'Rajeev Barua', title: 'Professor of CS, UMD · Ph.D. MIT', image: '/images/yp/rajeev.jpg' },
              ].map((mentor, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <img src={mentor.image} alt={mentor.name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md mb-3 group-hover:border-[#C8960C] transition-all" />
                  <h4 className="text-sm font-bold text-[#1B2A4A] leading-tight mb-1">{mentor.name}</h4>
                  <p className="text-xs text-gray-500 leading-tight">{mentor.title}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ FUTURE TITANS — HERO ═══ */}
      <section className="bg-[#1B2A4A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Reveal>
                <p className="text-[#C8960C] font-bold text-sm tracking-[0.2em] uppercase mb-4">
                  India's Flagship Innovation Capability Ecosystem
                </p>
                <h2 className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight`}>
                  BE SEEN.<br />BE HEARD.<br /><span className="text-[#C8960C]">BUILD THE FUTURE.</span>
                </h2>
                <p className="text-gray-300 text-base sm:text-lg font-medium mb-6">
                  Class 8–12 · ₹40 Lakhs Prize Pool · National Finale · Real Investors · Real Mentors
                </p>
                <div className="space-y-4 text-gray-400 text-sm leading-relaxed mb-8 max-w-lg">
                  <p>
                    India&apos;s first school-embedded Innovation Capability Ecosystem. Not a course. Not a competition. A system installed inside your school.
                  </p>
                  <p>
                    What a standard entrepreneurship course delivers: Business Model Canvas, how to pitch an idea, basic market research, customer discovery, one final project.
                  </p>
                  <p>
                    Future Titans delivers all of that — inside a system that permanently changes how students think.
                  </p>
                  <ul className="list-disc pl-5 space-y-1 mt-2 text-gray-300">
                    <li><span className="text-white font-semibold">S.U.R.G.E.™</span> — a patent-pending cognitive framework, not a curriculum.</li>
                    <li><span className="text-white font-semibold">SSI™</span> — a measurable thinking score, reportable to parents and boards.</li>
                    <li><span className="text-white font-semibold">Zunnova™</span> — an AI co-founder that asks questions, never gives answers.</li>
                    <li>A year-round <span className="text-white font-semibold">Innovation Club</span> installed inside your school.</li>
                    <li>Real stakes: <span className="text-white font-semibold">national challenge · global mentors · ₹40 Lakhs prize pool.</span></li>
                  </ul>
                  <p className="font-semibold text-white italic mt-4 border-l-4 border-[#C8960C] pl-4">
                    &ldquo;Everything a course promises. The infrastructure to make it permanent.&rdquo;
                  </p>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="bg-white/10 border border-[#C8960C]/50 rounded-xl p-5 backdrop-blur-sm mb-8">
                  <p className="text-white font-medium text-sm leading-relaxed">
                    Here&apos;s the most important thing: every participant — whether they win or not — walks away with skills, a nationally recognised certificate, and measurable growth in their SSI score. The program delivers value regardless of competition results.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={300}>
                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h4 className="text-[#C8960C] font-bold mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" /> Why Students Love It
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• ₹40 Lakhs Prize Pool & Access to Real Investors</li>
                      <li>• Building something real that solves a real problem</li>
                      <li>• National recognition and a stage to be seen</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[#C8960C] font-bold mb-3 flex items-center gap-2">
                      <Users className="w-5 h-5" /> Why Parents Love It
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Massive, visible confidence boost — parents notice it within weeks</li>
                      <li>• Mentorship from global leaders — IIT Kharagpur faculty, industry veterans, and world-class practitioners</li>
                      <li>• Nationally recognised certificates valued by top colleges</li>
                      <li>• AI skills that future-proof their career — regardless of which field they choose</li>
                      <li>• Results whether they win or not — the learning is the prize</li>
                    </ul>
                  </div>
                </div>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#C8960C] text-white font-bold text-xs sm:text-sm hover:bg-white hover:text-[#1B2A4A] transition-all shadow-lg text-center"
                >
                  <span>Register Your Child for Future Titans</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <div className="relative w-full aspect-[4/3] sm:aspect-square lg:aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img
                  src="/images/yp/hero-students.jpg"
                  alt="Future Titans"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A] via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8">
                  <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6">
                    {competitionFeatures.map((feat, idx) => (
                      <div key={idx} className="flex flex-col items-center text-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#C8960C] mb-1 sm:mb-2">
                          {feat.icon}
                        </div>
                        <div className="text-white text-[10px] sm:text-xs font-bold">{feat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FUTURE TITANS — INNOVATION ARCHITECTURE ═══ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-4`}>
                The Innovation Architecture Behind Future Titans
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                A patent-pending innovation architecture designed for the next generation:
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { title: 'IDEA DNA', sub: 'The Innovation Pipeline', body: 'A four-stage process: Innovate → Design → Experiment → Apply. Gives students a repeatable, structured way to go from idea to solution — every time.' },
              { title: 'S.U.R.G.E.', sub: 'Cognitive Sequencing Protocol', body: 'A five-step mental framework that teaches students how to break down any challenge and convert it into clear, actionable steps.' },
              { title: 'SSI', sub: 'Solution-Seeking Index', body: 'India\'s first measurement tool for entrepreneurial mindset. Tracks your child\'s growth across creativity, problem framing, experimentation, and pitch quality.' },
              { title: 'AI Co-Founder', sub: 'Guided Thinking Tool', body: 'An AI assistant that works like a co-founder — helping students pressure-test ideas, refine pitches, and break down complex problems step by step.' },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="bg-[#FFFBF0] border border-[#C8960C]/20 rounded-2xl p-8 hover:bg-[#C8960C] hover:text-white transition-all group h-full flex flex-col items-center text-center shadow-sm hover:shadow-xl">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#C8960C] text-xl font-black mb-6 shadow-sm group-hover:bg-white/20 group-hover:text-white transition-colors">
                    0{i + 1}
                  </div>
                  <h3 className="text-xl font-bold text-[#1B2A4A] group-hover:text-white mb-2 transition-colors">{c.title}</h3>
                  <p className="text-[#C8960C] font-semibold text-xs uppercase tracking-wider mb-4 group-hover:text-white/80 transition-colors">{c.sub}</p>
                  <p className="text-gray-600 text-sm leading-relaxed group-hover:text-white/90 transition-colors">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FUTURE TITANS — WORKSHOP LADDER ═══ */}
      <section className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#1B2A4A]`}>
                Build Like a Titan: <span className="text-[#C8960C]">The 5-Workshop Journey</span>
              </h2>
              <p className="mt-4 text-gray-600 text-lg max-w-3xl mx-auto">
                Five connected workshops — each step prepares students for the next, building from empathy all the way to a live pitch:
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Discover & Define', body: 'Empathy-driven exploration of real-world challenges. Understand users, not just problems.', outcome: 'A clearly defined challenge they care about solving' },
              { step: '02', title: 'Design the Difference', body: 'Master ideation tools to uncover what makes their solution genuinely stand out.', outcome: 'A unique, validated solution concept' },
              { step: '03', title: 'Prototype to Pitch', body: 'Bring ideas to life using no-code tools, rapid testing, and iteration — including AI tools.', outcome: 'A working prototype they can demo' },
              { step: '04', title: 'Map Your Model', body: 'Monetisation and scalability — turning ideas into viable real-world models.', outcome: 'A basic business model canvas' },
              { step: '05', title: 'Pitch Like a Pro', body: 'A masterclass in influence and delivery. Present with confidence to real judges.', outcome: 'A competition-ready pitch' },
            ].map((w, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:-translate-y-2 hover:shadow-xl hover:border-[#C8960C] transition-all h-full flex flex-col">
                  <span className="text-[#C8960C] font-mono text-3xl font-black opacity-20 block mb-4">{w.step}</span>
                  <h4 className="text-base font-bold text-[#1B2A4A] mb-3">{w.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">{w.body}</p>
                  <div className="pt-4 border-t border-gray-100 mt-auto">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Outcome</p>
                    <p className="text-sm font-semibold text-[#1B2A4A]">{w.outcome}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COMPETITION FORMAT ═══ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#C8960C]`}>
                The Competition Format
              </h2>
              <p className="mt-4 text-gray-600 text-lg">Three milestones from idea to national stage:</p>
            </div>
          </Reveal>
          <div className="space-y-8">
            {[
              { phase: 'Phase 1', format: 'Virtual', title: 'Idea Submission', body: 'Submit their refined solution concept — shaped using IDEA DNA, S.U.R.G.E., and early prototyping' },
              { phase: 'Phase 2', format: 'Virtual', title: 'Pitch Video', body: 'A short video pitch showcasing their problem insight, structured approach, and prototype' },
              { phase: 'Phase 3', format: 'Live National Bootcamp', title: 'Grand Finale', body: 'Top 50 Titans compete at a national bootcamp — mentorship, deep-dives, and a live pitch to a national jury of investors and leaders' },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1B2A4A] text-[#C8960C] text-2xl font-bold shadow-lg shadow-[#1B2A4A]/20">
                    {i + 1}
                  </div>
                  <div className="flex-1 bg-[#FFFBF0] border border-[#C8960C]/20 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                      <span className="text-[#1B2A4A] font-bold text-lg">{p.title}</span>
                      <span className="bg-white text-[#C8960C] text-xs font-bold px-3 py-1 rounded-full border border-[#C8960C]/20">{p.format}</span>
                    </div>
                    <span className="text-[#C8960C] font-mono font-bold text-sm tracking-wider block mb-2">{p.phase}</span>
                    <p className="text-gray-600 text-base leading-relaxed">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STUDENT SUCCESS STORIES ═══ */}
      <section className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-4`}>
                Hear It From Our Students
              </h2>
              <p className="text-gray-600 text-lg">Real students. Real outcomes. Real confidence. From 120+ cities across India.</p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Ronobir', quote: 'Before Youngpreneurs, I had ideas but no clue how to build them. Now I\'ve built a working prototype and pitched it to real mentors. My confidence has gone through the roof.' },
              { name: 'Anushka', quote: 'I used to be terrified of public speaking. After the workshops, I presented my solution in front of 150 people — and loved it. My parents couldn\'t believe the change.' },
              { name: 'Sri', quote: 'The SURGE framework taught me to think like an entrepreneur. I now look at every problem as an opportunity. It\'s completely changed how I approach challenges.' },
            ].map((student, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all h-full flex flex-col">
                  <div className="text-[#C8960C] mb-4">
                    <QuoteIcon className="w-8 h-8 opacity-50" />
                  </div>
                  <p className="text-gray-700 text-base leading-relaxed italic mb-8 flex-1">&ldquo;{student.quote}&rdquo;</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <div className="w-12 h-12 bg-[#FFFBF0] rounded-full flex items-center justify-center text-[#C8960C] font-bold text-xl">
                      {student.name.charAt(0)}
                    </div>
                    <div className="font-bold text-[#1B2A4A] text-lg">{student.name}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PARENT TESTIMONIALS ═══ */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#1B2A4A] mb-4`}>
                What Parents Are Saying
              </h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Real feedback from families across India — including students who didn't win the competition and still saw life-changing results:
              </p>
            </div>
          </Reveal>
          <div className="max-w-4xl mx-auto">
            <ParentCarousel testimonials={parentTestimonials} />
          </div>
        </div>
      </section>

      {/* ═══ FAQ SECTION ═══ */}
      <section className="py-16 lg:py-24 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#1B2A4A] text-center mb-12`}>
              Questions Parents Ask (We Answer)
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="space-y-4">
              {faqsLeft.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === `left-${idx}` ? null : `left-${idx}`)}
                  >
                    <span className="text-base font-bold text-[#1B2A4A] pr-4">{faq.q}</span>
                    {openFaq === `left-${idx}` ? (
                      <Minus className="w-5 h-5 text-[#C8960C] shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === `left-${idx}` ? 'max-h-96' : 'max-h-0'}`}>
                    <p className="text-sm text-gray-600 px-6 pb-6 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-4">
              {faqsRight.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === `right-${idx}` ? null : `right-${idx}`)}
                  >
                    <span className="text-base font-bold text-[#1B2A4A] pr-4">{faq.q}</span>
                    {openFaq === `right-${idx}` ? (
                      <Minus className="w-5 h-5 text-[#C8960C] shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-gray-400 shrink-0" />
                    )}
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === `right-${idx}` ? 'max-h-96' : 'max-h-0'}`}>
                    <p className="text-sm text-gray-600 px-6 pb-6 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Reveal delay={200}>
            <div className="mt-12 text-center">
              <p className="text-gray-600 mb-6 font-medium">Still have questions? Our team is here to help.</p>
              <a
                href="tel:+919038428532"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-[#1B2A4A] text-[#1B2A4A] font-bold tracking-wider hover:bg-[#1B2A4A] hover:text-white transition-all shadow-sm"
              >
                <Phone className="w-5 h-5" />
                TALK TO OUR COUNSELOR — +91 9038428532
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══ URGENCY & PROMISE (NEW SECTIONS) ═══ */}
      <section className="py-16 lg:py-24 bg-[#1B2A4A] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <Reveal>
              <div>
                <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#C8960C] mb-6`}>
                  Why Enroll Now?
                </h2>
                <p className="text-xl font-medium mb-8">The next cohort begins soon — and seats are limited.</p>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-[#C8960C]" />
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-1">New cohort starting soon</p>
                      <p className="text-gray-300 text-sm">Enroll before the deadline to secure your child's spot</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Target className="w-5 h-5 text-[#C8960C]" />
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-1">Limited seats available</p>
                      <p className="text-gray-300 text-sm">We keep cohorts small to ensure high mentorship quality</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5 text-[#C8960C]" />
                    </div>
                    <div>
                      <p className="font-bold text-lg mb-1">Priority Access</p>
                      <p className="text-gray-300 text-sm">Early enrollees get priority access to mentor sessions and workshop scheduling</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="bg-white text-[#1B2A4A] rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden h-full flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFFBF0] rounded-bl-full -mr-16 -mt-16 z-0" />
                <div className="relative z-10">
                  <h3 className={`${playfair.className} text-3xl font-bold mb-6 flex items-center gap-3`}>
                    <Shield className="w-8 h-8 text-[#C8960C]" />
                    Our Promise to You
                  </h3>
                  <p className="text-gray-600 mb-6 font-medium text-lg leading-relaxed">
                    We are so confident your child will see a measurable change that we back it with a simple promise:
                  </p>
                  <div className="bg-[#FFFBF0] p-6 rounded-2xl border border-[#C8960C]/20 mb-6">
                    <p className="text-[#1B2A4A] font-bold text-lg leading-relaxed">
                      If your child completes the full program and you don't see a meaningful, visible change in their confidence and thinking — we'll refund every rupee. No questions asked.
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 italic">
                    We've made this promise because we've never had to honour it. Over 10,000 families trust us — and counting.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-14 sm:py-20 lg:py-28 bg-[#FFFBF0] text-center border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B2A4A] mb-6 sm:mb-8 leading-tight`}>
              Don't Let Your Child Watch the Future Happen to Them.
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
              10,000+ families have already given their children the unfair advantage. Seats in the next cohort are limited.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
              <Link
                href="/signup"
                className="px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-[#C8960C] text-white font-bold text-base sm:text-lg tracking-wide hover:bg-[#b5870b] transition-all shadow-xl shadow-[#C8960C]/30 flex items-center gap-3 w-full sm:w-auto justify-center hover:-translate-y-1"
              >
                Register Now — Secure Your Child's Spot
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              </Link>
            </div>
            <p className="text-gray-500 font-medium text-sm">
              Questions? Call or WhatsApp: <a href="tel:+919038428532" className="text-[#1B2A4A] font-bold hover:underline">+91 9038428532</a> · <a href="mailto:yes@youngpreneurs.ai" className="text-[#1B2A4A] font-bold hover:underline">yes@youngpreneurs.ai</a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <PublicFooter />
    </div>
  );
}

// QuoteIcon component added for student stories
function QuoteIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}
