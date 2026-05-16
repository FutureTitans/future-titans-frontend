'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, isStudent } from '@/lib/auth';
import { ArrowRight, Zap, Users, Award, Sparkles, ChevronDown, Instagram, Facebook, Linkedin, Star, Rocket, Target, Phone } from 'lucide-react';

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericTarget));
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

function FloatingParticle({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: style.size,
        height: style.size,
        left: style.left,
        top: style.top,
        background: `radial-gradient(circle, ${style.color} 0%, transparent 70%)`,
        animation: `floatParticle ${style.duration}s ease-in-out infinite`,
        animationDelay: `${style.delay}s`,
        opacity: style.opacity,
      }}
    />
  );
}

export default function Landing() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) router.push('/admin');
      else if (isStudent()) router.push('/student/dashboard');
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const stat1 = useCounter('10000', 2200, statsVisible);
  const stat2 = useCounter('50', 1800, statsVisible);
  const stat3 = useCounter('1000000', 2400, statsVisible);
  const stat4 = useCounter('95', 2000, statsVisible);

  const particles = [
    { size: '6px', left: '10%', top: '20%', color: 'rgba(212,175,55,0.3)', duration: 6, delay: 0, opacity: 0.6 },
    { size: '4px', left: '80%', top: '15%', color: 'rgba(245,215,110,0.4)', duration: 8, delay: 1, opacity: 0.5 },
    { size: '8px', left: '60%', top: '70%', color: 'rgba(212,175,55,0.2)', duration: 7, delay: 2, opacity: 0.4 },
    { size: '5px', left: '25%', top: '80%', color: 'rgba(245,215,110,0.35)', duration: 9, delay: 0.5, opacity: 0.5 },
    { size: '3px', left: '90%', top: '45%', color: 'rgba(212,175,55,0.4)', duration: 5, delay: 1.5, opacity: 0.6 },
    { size: '7px', left: '45%', top: '30%', color: 'rgba(240,232,212,0.3)', duration: 10, delay: 3, opacity: 0.3 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F5EDD6]">
      {/* Background Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-[#F5D76E]/20 rounded-full blur-[120px]"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        />
        <div
          className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/15 rounded-full blur-[120px]"
          style={{ transform: `translateY(${scrollY * -0.06}px)` }}
        />
        <div
          className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-[#F0E8D4]/30 rounded-full blur-[100px]"
          style={{ transform: `translateY(${scrollY * 0.04}px)` }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden hidden sm:block" aria-hidden="true">
        {particles.map((p, i) => <FloatingParticle key={i} style={p} />)}
      </div>

      <div className="relative z-10">

        {/* ═══ HERO ═══ */}
        <section className="min-h-[calc(100dvh-4rem)] flex items-center pt-8 sm:pt-16 pb-12 sm:pb-16 px-4 relative">
          {/* Decorative rings — hidden on mobile for performance */}
          <div className="hidden lg:block" aria-hidden="true">
            <div
              className="absolute w-[500px] h-[500px] rounded-full border border-[#D4AF37]/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0003})`, opacity: Math.max(0, 1 - scrollY * 0.002) }}
            />
            <div
              className="absolute w-[700px] h-[700px] rounded-full border border-[#F5D76E]/[0.08] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0005}) rotate(${scrollY * 0.02}deg)`, opacity: Math.max(0, 1 - scrollY * 0.0015) }}
            />
          </div>

          <div className="container mx-auto max-w-7xl relative z-20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Text Column */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-gray-900 mb-6 sm:mb-8 leading-[1.08] hero-title-animate">
                  Future Titans
                  <span className="block text-xl xs:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8952E] background-animate mt-2 sm:mt-3">
                    India&apos;s First Holistic Innovation Capability Ecosystem for Schools
                  </span>
                </h1>

                <div className="max-w-3xl mx-auto lg:mx-0 mb-8 sm:mb-12">
                  <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed font-light tracking-tight text-[#15803d]">
                    Transform your ideas into impact.{' '}
                    <span className="font-semibold text-[#166534]">Experience AI-powered mentorship</span>{' '}
                    and build the solutions{' '}
                    <em className="not-italic font-medium text-[#14532d] border-b border-[#166534] pb-[2px]">
                      the world needs.
                    </em>
                  </p>
                  <div className="mt-6 flex justify-center lg:justify-start">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-900/40 to-transparent lg:from-emerald-900/40 lg:to-transparent" />
                  </div>
                </div>

                {/* Primary CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start items-center">
                  <Link
                    href="/signup"
                    className="glass-button w-full sm:w-auto px-8 sm:px-10 py-4 text-base shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <span className="relative flex items-center gap-2">
                      Student Sign Up
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-gray-700 font-semibold text-center hover:bg-white/60 transition-all hover:shadow-lg active:scale-[0.98]"
                  >
                    Student Log In
                  </Link>
                </div>

                {/* Secondary Links */}
                <div className="mt-6 flex flex-col xs:flex-row gap-3 justify-center lg:justify-start items-center text-sm">
                  <Link href="/school-poc/login" className="flex items-center gap-2 text-gray-600 hover:text-[#1A1A1A] font-semibold px-5 py-2.5 bg-white/50 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 hover:bg-white transition-all shadow-sm w-full xs:w-auto justify-center">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    School POC Login
                  </Link>
                  <Link href="/association/login" className="flex items-center gap-2 text-gray-600 hover:text-[#1A1A1A] font-semibold px-5 py-2.5 bg-white/50 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 hover:bg-white transition-all shadow-sm w-full xs:w-auto justify-center">
                    <Target className="w-4 h-4 text-[#D4AF37]" />
                    Association Login
                  </Link>
                </div>
              </div>

              {/* Image Column */}
              <div className="flex-1 w-full max-w-xs sm:max-w-sm lg:max-w-none relative z-10 flex justify-center lg:justify-end mx-auto lg:mx-0 float mt-8 lg:mt-0">
                <div className="absolute -left-2 sm:left-4 lg:-left-6 top-[20%] xl:top-[30%] glass-strong p-3 sm:p-4 rounded-2xl border border-white/60 flex items-start gap-3 shadow-[0_20px_50px_rgba(21,128,61,0.15)] z-20">
                  <div className="relative flex h-3 w-3 mt-1 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#15803d]" />
                  </div>
                  <div>
                    <div className="text-sm sm:text-base font-bold text-gray-900 leading-tight">
                      Meet Zunnova
                      <span className="block text-gray-500 font-medium text-xs sm:text-sm tracking-wide">Your AI Co-Founder</span>
                    </div>
                  </div>
                </div>
                <img
                  src="/zunnova.svg"
                  alt="Zunnova — AI mentor character that guides students through the innovation challenge"
                  className="w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-10"
                  loading="eager"
                />
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="hidden lg:flex absolute -bottom-16 left-1/2 -translate-x-1/2 flex-col items-center gap-2">
              <span className="text-xs text-gray-400 tracking-widest uppercase">Explore</span>
              <ChevronDown className="w-5 h-5 text-gray-400 animate-bounce" />
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section className="py-16 sm:py-24 lg:py-32 px-4 relative" aria-labelledby="features-heading">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
            aria-hidden="true"
          >
            <div className="absolute top-[10%] right-[-5%] w-[300px] h-[300px] bg-[#D4AF37]/[0.08] rounded-full blur-[80px]" />
            <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] bg-[#F5D76E]/10 rounded-full blur-[60px]" />
          </div>

          <div className="container mx-auto max-w-6xl relative">
            <Reveal>
              <div className="text-center mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#B8952E] text-xs font-bold mb-4 tracking-widest uppercase">
                  <Star className="w-3.5 h-3.5" />
                  Why Choose Us
                </div>
                <h2 id="features-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                  Why Future Titans?
                </h2>
                <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto">Everything you need to succeed as a young innovator</p>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: <Zap className="w-6 h-6 text-[#D4AF37]" />,
                  title: 'Zunnova AI Mentorship',
                  description: 'Get personalized feedback and guidance from our advanced AI mentor tailored to your journey.',
                  accent: 'from-[#D4AF37]/15 to-[#F5D76E]/15',
                },
                {
                  icon: <Users className="w-6 h-6 text-[#D4AF37]" />,
                  title: 'Collaborative Learning',
                  description: 'Connect with peers, form teams, and solve problems together in a global community.',
                  accent: 'from-[#F5D76E]/15 to-[#D4AF37]/10',
                },
                {
                  icon: <Award className="w-6 h-6 text-[#D4AF37]" />,
                  title: 'Global Recognition',
                  description: 'Submit your projects, get evaluated by experts, and win prestige and prizes.',
                  accent: 'from-[#B8952E]/15 to-[#D4AF37]/15',
                },
              ].map((feature, idx) => (
                <Reveal key={idx} delay={idx * 120}>
                  <div className="glass-panel p-6 sm:p-8 glass-panel-hover group relative overflow-hidden h-full">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 border border-[#D4AF37]/10`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-500 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SURGE FRAMEWORK ═══ */}
        <section className="py-16 sm:py-24 lg:py-32 px-4 relative overflow-hidden" aria-labelledby="surge-heading">
          <div className="absolute inset-0 -z-10 bg-white/20 backdrop-blur-sm" aria-hidden="true" />

          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <Reveal>
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#B8952E] text-sm font-bold mb-4 tracking-wide">
                    <Target className="w-4 h-4" />
                    METHODOLOGY
                  </div>
                  <h2 id="surge-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
                    The SURGE Framework
                  </h2>
                  <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-10 leading-relaxed">
                    Our proprietary 5-stage framework is designed to systematically build your entrepreneurial mindset from the ground up.
                  </p>

                  <div className="space-y-4 sm:space-y-5">
                    {[
                      { letter: 'S', title: 'Self Awareness', desc: 'Identify your strengths and passion' },
                      { letter: 'U', title: 'Understanding', desc: 'Find gaps and market opportunities' },
                      { letter: 'R', title: 'Resilience', desc: 'Learn to pivot and overcome failure' },
                      { letter: 'G', title: 'Growth', desc: 'Scale your solution and impact' },
                      { letter: 'E', title: 'Entrepreneurial Leadership', desc: 'Lead teams with vision' },
                    ].map((item, idx) => (
                      <Reveal key={idx} delay={idx * 80}>
                        <div className="flex items-center gap-4 sm:gap-5 group surge-item">
                          <div className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] text-white flex items-center justify-center text-base sm:text-lg font-bold shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            {item.letter}
                          </div>
                          <div>
                            <h4 className="text-base sm:text-lg font-bold text-gray-800">{item.title}</h4>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="relative hidden sm:block">
                  <div
                    className="absolute -top-8 -right-8 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-[60px] pointer-events-none"
                    style={{ transform: `translateY(${scrollY * -0.08}px)` }}
                    aria-hidden="true"
                  />
                  <div className="glass-panel p-2 rotate-1 lg:rotate-2 hover:rotate-0 transition-transform duration-500 hover:shadow-2xl">
                    <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 via-transparent to-[#F5D76E]/10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-sweep" />
                      <div className="text-center text-white p-8 relative z-10">
                        <div className="relative inline-block">
                          <Sparkles className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-6 text-[#F5D76E]" />
                          <div className="absolute inset-0 w-14 h-14 sm:w-20 sm:h-20 mx-auto bg-[#F5D76E]/20 rounded-full blur-xl animate-pulse" />
                        </div>
                        <h3 className="text-2xl sm:text-4xl font-bold mb-2 text-white">Start Your Surge</h3>
                        <p className="text-white/70">Join the movement today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══ STATS ═══ */}
        <section className="py-16 sm:py-24 px-4 relative overflow-hidden" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Platform Statistics</h2>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"
            style={{ transform: `translate(-50%, -50%) translateY(${scrollY * -0.04}px)` }}
            aria-hidden="true"
          />

          <div ref={statsRef} className="container mx-auto max-w-6xl relative z-10">
            <Reveal>
              <div className="glass-panel p-6 sm:p-10 lg:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center">
                  {[
                    { target: '10000', suffix: '+', label: 'Students', count: stat1 },
                    { target: '50', suffix: '+', label: 'Countries', count: stat2 },
                    { target: '1000000', prefix: '$', suffix: '+', label: 'Ideas Impact', count: stat3, format: true },
                    { target: '95', suffix: '%', label: 'Satisfaction', count: stat4 },
                  ].map((stat, idx) => (
                    <div key={idx} className="p-2 sm:p-4">
                      <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8952E] mb-1 sm:mb-2 tabular-nums inline-block">
                        {stat.prefix || ''}
                        {stat.format
                          ? (stat.count >= 1000000 ? `${(stat.count / 1000000).toFixed(0)}M` : stat.count >= 1000 ? `${(stat.count / 1000).toFixed(0)}K` : stat.count)
                          : (stat.count >= 1000 ? `${(stat.count / 1000).toFixed(0)}K` : stat.count)}
                        {stat.suffix}
                      </div>
                      <div className="text-gray-500 font-medium tracking-wide uppercase text-[11px] sm:text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section className="py-16 sm:py-24 lg:py-32 px-4 text-center" aria-labelledby="cta-heading">
          <Reveal>
            <div className="container mx-auto max-w-4xl bg-[#1A1A1A] rounded-3xl sm:rounded-[32px] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-gray-800">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60" aria-hidden="true" />
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-[60px]" aria-hidden="true" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#F5D76E]/10 rounded-full blur-[60px]" aria-hidden="true" />

              <Rocket className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] mx-auto mb-5 sm:mb-6 animate-pulse" />

              <h2 id="cta-heading" className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 relative">
                Ready to shape the future?
              </h2>

              <p className="text-base sm:text-lg text-gray-400 mb-8 sm:mb-10 max-w-2xl mx-auto relative">
                Join thousands of student innovators who are already building tomorrow&apos;s solutions.
              </p>

              <Link
                href="/signup"
                className="glass-button px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg inline-flex shadow-2xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Start Your Journey Now</span>
              </Link>
            </div>
          </Reveal>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer className="bg-[#1A1A1A] border-t border-gray-800 py-10 sm:py-16 px-4 rounded-t-3xl sm:rounded-t-[32px] mt-8" role="contentinfo">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-10 sm:mb-12">
              <div className="sm:col-span-2 lg:col-span-1">
                <div className="font-bold text-xl sm:text-2xl text-white mb-3">Future Titans</div>
                <p className="text-gray-500 text-sm leading-relaxed">Empowering the next generation of innovators with tools, mentorship, and community.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-300 mb-3 sm:mb-4 text-sm tracking-wide uppercase">Company</h4>
                <ul className="space-y-2.5">
                  <li><a href="https://www.youngpreneurs.ai/about-us/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#F5D76E] transition text-sm">About</a></li>
                  <li><a href="https://www.youngpreneurs.ai/contact" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#F5D76E] transition text-sm">Contact</a></li>
                  <li>
                    <a href="tel:+918031338782" className="text-gray-500 hover:text-[#F5D76E] transition text-sm flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5" />
                      +91 80313 38782
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-300 mb-3 sm:mb-4 text-sm tracking-wide uppercase">Connect</h4>
                <div className="flex gap-3">
                  {[
                    { href: 'https://www.instagram.com/youngpreneurs.ai?igsh=MThlOW93dXJtYjRpeQ==', icon: Instagram, label: 'Instagram' },
                    { href: 'https://www.facebook.com/share/1cqPc5C3LW/?mibextid=wwXIfr', icon: Facebook, label: 'Facebook' },
                    { href: 'https://www.linkedin.com/company/youngpreneurs-ai/posts/?feedView=all', icon: Linkedin, label: 'LinkedIn' },
                  ].map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-[#D4AF37]/10 hover:text-[#F5D76E] hover:border-[#D4AF37]/20 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-800 text-center text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Future Titans. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
