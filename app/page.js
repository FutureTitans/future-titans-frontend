'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, isStudent } from '@/lib/auth';
import { ArrowRight, Zap, Users, Award, Sparkles, ChevronDown, Instagram, Facebook, Linkedin, Star, Rocket, Target } from 'lucide-react';

/* ─── Animated Counter Hook ─── */
function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * numericTarget));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

/* ─── Scroll‑reveal wrapper ─── */
function RevealOnScroll({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const directionStyles = {
    up: 'translate-y-12',
    down: '-translate-y-12',
    left: 'translate-x-12',
    right: '-translate-x-12',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0 translate-x-0' : `opacity-0 ${directionStyles[direction]}`
        } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── Floating Particle ─── */
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
  const heroRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        router.push('/admin');
      } else if (isStudent()) {
        router.push('/student/dashboard');
      }
    }
  }, [router]);

  /* ─── Parallax scroll listener ─── */
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ─── Stats intersection observer ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  /* ─── Animated counters ─── */
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
    { size: '4px', left: '15%', top: '55%', color: 'rgba(212,175,55,0.25)', duration: 7.5, delay: 2.5, opacity: 0.45 },
    { size: '6px', left: '70%', top: '85%', color: 'rgba(245,215,110,0.3)', duration: 6.5, delay: 1.2, opacity: 0.5 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#F5EDD6]">

      {/* ── Background Mesh Gradients ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#F5D76E]/20 rounded-full blur-[120px]"
          style={{ transform: `translateY(${scrollY * 0.08}px)` }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/15 rounded-full blur-[120px]"
          style={{ transform: `translateY(${scrollY * -0.06}px)` }}
        />
        <div
          className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-[#F0E8D4]/30 rounded-full blur-[100px]"
          style={{ transform: `translateY(${scrollY * 0.04}px) scale(${1 + scrollY * 0.0001})` }}
        />
      </div>

      {/* ── Floating Particles ── */}
      <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <FloatingParticle key={i} style={p} />
        ))}
      </div>

      <div className="relative z-10">

        {/* ════════════════════════════════════════════
            HERO SECTION — Full‑screen parallax
           ════════════════════════════════════════════ */}
        <section ref={heroRef} className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 relative">
          {/* Parallax decorative rings */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full border border-[#D4AF37]/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0003})`, opacity: Math.max(0, 1 - scrollY * 0.002) }}
          />
          <div
            className="absolute w-[700px] h-[700px] rounded-full border border-[#F5D76E]/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ transform: `translate(-50%, -50%) scale(${1 + scrollY * 0.0005}) rotate(${scrollY * 0.02}deg)`, opacity: Math.max(0, 1 - scrollY * 0.0015) }}
          />

          <div
            className="container mx-auto text-center max-w-5xl"
            style={{ transform: `translateY(${scrollY * 0.3}px)`, opacity: Math.max(0, 1 - scrollY * 0.0018) }}
          >


            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.08] hero-title-animate">
              Future Titans
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#B8952E] background-animate">
                India's First Holistic Innovation Capability Ecosystem for Schools
              </span>
            </h1>

            <div className="relative max-w-3xl mx-auto mb-12 text-center">
              {/* Main tagline */}
              <p
                className="text-xl sm:text-2xl md:text-3xl leading-[1.6] font-light tracking-tight"
                style={{ color: '#15803d' }}
              >
                Transform your ideas into impact.{' '}
                <span className="font-semibold" style={{ color: '#166534' }}>
                  Experience AI-powered mentorship
                </span>{' '}
                and build the solutions{' '}
                <em
                  className="not-italic font-medium"
                  style={{
                    color: '#14532d',
                    borderBottom: '1px solid #166534',
                    paddingBottom: '2px',
                  }}
                >
                  the world needs.
                </em>
              </p>

              {/* Bottom ornament */}
              <div className="mt-8 flex justify-center">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-emerald-900 to-transparent" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <Link
                href="/signup"
                className="glass-button px-10 py-4 sm:py-5 text-base sm:text-lg shadow-xl shadow-[#D4AF37]/20 hover:shadow-[#D4AF37]/30 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="flex items-center gap-2 relative">
                  Student Sign Up
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link
                href="/login"
                className="px-10 py-4 sm:py-5 rounded-full bg-white/40 backdrop-blur-md border border-white/50 text-gray-700 font-semibold hover:bg-white/60 transition-all hover:scale-105 hover:shadow-lg"
              >
                Student Log In
              </Link>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center text-sm mb-4">
              <Link href="/school-poc/login" className="flex items-center gap-2 text-gray-600 hover:text-[#1A1A1A] font-semibold px-5 py-2.5 bg-white/50 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 hover:bg-white transition-all shadow-sm">
                <Users className="w-4 h-4 text-[#D4AF37]" />
                School POC Login
              </Link>
              <Link href="/association/login" className="flex items-center gap-2 text-gray-600 hover:text-[#1A1A1A] font-semibold px-5 py-2.5 bg-white/50 rounded-full border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 hover:bg-white transition-all shadow-sm">
                <Target className="w-4 h-4 text-[#D4AF37]" />
                Association Login
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
              <span className="text-xs text-gray-400 tracking-widest uppercase">Explore</span>
              <ChevronDown className="w-5 h-5 text-gray-400 animate-bounce" />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            FEATURES SECTION — Staggered reveal
           ════════════════════════════════════════════ */}
        <section className="py-20 sm:py-32 px-4 relative">
          {/* Parallax background accent */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            <div className="absolute top-[10%] right-[-5%] w-[300px] h-[300px] bg-[#D4AF37]/8 rounded-full blur-[80px]" />
            <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] bg-[#F5D76E]/10 rounded-full blur-[60px]" />
          </div>

          <div className="container mx-auto max-w-6xl relative">
            <RevealOnScroll>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#B8952E] text-xs font-bold mb-4 tracking-widest uppercase">
                  <Star className="w-3.5 h-3.5" />
                  Why Choose Us
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Why Future Titans?
                </h2>
                <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">Everything you need to succeed as a young innovator</p>
              </div>
            </RevealOnScroll>

            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: <Zap className="w-7 h-7 text-[#D4AF37]" />,
                  title: 'Zunnova AI Mentorship',
                  description: 'Get personalized feedback and guidance from our advanced AI mentor tailored to your journey.',
                  accent: 'from-[#D4AF37]/15 to-[#F5D76E]/15',
                },
                {
                  icon: <Users className="w-7 h-7 text-[#D4AF37]" />,
                  title: 'Collaborative Learning',
                  description: 'Connect with peers, form teams, and solve problems together in a global community.',
                  accent: 'from-[#F5D76E]/15 to-[#D4AF37]/10',
                },
                {
                  icon: <Award className="w-7 h-7 text-[#D4AF37]" />,
                  title: 'Global Recognition',
                  description: 'Submit your projects, get evaluated by experts, and win prestige and prizes.',
                  accent: 'from-[#B8952E]/15 to-[#D4AF37]/15',
                },
              ].map((feature, idx) => (
                <RevealOnScroll key={idx} delay={idx * 150} direction={idx === 0 ? 'left' : idx === 2 ? 'right' : 'up'}>
                  <div className="glass-panel p-8 glass-panel-hover group relative overflow-hidden h-full">
                    {/* Shimmer line on top */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.accent} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 border border-[#D4AF37]/10`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            SURGE FRAMEWORK — Parallax split layout
           ════════════════════════════════════════════ */}
        <section className="py-20 sm:py-32 px-4 relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10"
            style={{ transform: `translateY(${scrollY * -0.03}px)` }}
          >
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
          </div>

          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <RevealOnScroll direction="left">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#B8952E] text-sm font-bold mb-4 tracking-wide">
                    <Target className="w-4 h-4" />
                    METHODOLOGY
                  </div>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">The SURGE Framework</h2>
                  <p className="text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed">
                    Our proprietary 5-stage framework is designed to systematically build your entrepreneurial mindset from the ground up.
                  </p>

                  <div className="space-y-5">
                    {[
                      { letter: 'S', title: 'Self Awareness', desc: 'Identify your strengths and passion' },
                      { letter: 'U', title: 'Understanding', desc: 'Find gaps and market opportunities' },
                      { letter: 'R', title: 'Resilience', desc: 'Learn to pivot and overcome failure' },
                      { letter: 'G', title: 'Growth', desc: 'Scale your solution and impact' },
                      { letter: 'E', title: 'Entrepreneurial Leadership', desc: 'Lead teams with vision' },
                    ].map((item, idx) => (
                      <RevealOnScroll key={idx} delay={idx * 100} direction="left">
                        <div className="flex items-center gap-5 group surge-item">
                          <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-[#D4AF37]/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            {item.letter}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-gray-800">{item.title}</h4>
                            <p className="text-gray-500 text-sm">{item.desc}</p>
                          </div>
                        </div>
                      </RevealOnScroll>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>

              <RevealOnScroll direction="right" delay={200}>
                <div className="relative">
                  {/* Floating accent behind card */}
                  <div
                    className="absolute -top-8 -right-8 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-[60px] pointer-events-none"
                    style={{ transform: `translateY(${scrollY * -0.08}px)` }}
                  />
                  <div className="glass-panel p-2 rotate-2 hover:rotate-0 transition-transform duration-500 hover:shadow-2xl">
                    <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#1A1A1A] flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
                      {/* Animated light sweep */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-sweep" />
                      <div className="text-center text-white p-8 relative z-10">
                        <div className="relative inline-block">
                          <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-[#F5D76E]" />
                          <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-[#F5D76E]/20 rounded-full blur-xl animate-pulse" />
                        </div>
                        <h3 className="text-3xl sm:text-4xl font-bold mb-2 text-white">
                          Start Your Surge
                        </h3>
                        <p className="text-white/70">Join the movement today</p>
                      </div>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            STATS SECTION — Animated counters + parallax
           ════════════════════════════════════════════ */}
        <section className="py-20 sm:py-28 px-4 relative overflow-hidden">
          {/* Parallax background orb */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none"
            style={{ transform: `translate(-50%, -50%) translateY(${scrollY * -0.04}px)` }}
          />

          <div ref={statsRef} className="container mx-auto max-w-6xl relative z-10">
            <RevealOnScroll>
              <div className="glass-panel p-8 sm:p-12 relative overflow-hidden">
                {/* Top shine line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                  {[
                    { target: '10000', suffix: '+', label: 'Students', count: stat1 },
                    { target: '50', suffix: '+', label: 'Countries', count: stat2 },
                    { target: '1000000', prefix: '$', suffix: '+', label: 'Ideas Impact', count: stat3, format: true },
                    { target: '95', suffix: '%', label: 'Satisfaction', count: stat4 },
                  ].map((stat, idx) => (
                    <RevealOnScroll key={idx} delay={idx * 100}>
                      <div className="p-4 group">
                        <div className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8952E] mb-2 tabular-nums group-hover:scale-110 transition-transform duration-300 inline-block">
                          {stat.prefix || ''}
                          {stat.format ? (stat.count >= 1000000 ? `${(stat.count / 1000000).toFixed(0)}M` : stat.count >= 1000 ? `${(stat.count / 1000).toFixed(0)}K` : stat.count) : (stat.count >= 1000 ? `${(stat.count / 1000).toFixed(0)}K` : stat.count)}
                          {stat.suffix}
                        </div>
                        <div className="text-gray-500 font-medium tracking-wide uppercase text-xs sm:text-sm">{stat.label}</div>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* ════════════════════════════════════════════
            CTA SECTION — Parallax dark card
           ════════════════════════════════════════════ */}
        <section className="py-24 sm:py-32 px-4 text-center">
          <RevealOnScroll>
            <div
              className="container mx-auto max-w-4xl bg-[#1A1A1A] rounded-[32px] p-10 sm:p-16 relative overflow-hidden shadow-2xl border border-gray-800"
              style={{ transform: `translateY(${Math.max(0, (scrollY - 2200)) * -0.03}px)` }}
            >
              {/* Animated gold line at top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 blur-[1px]" />
              {/* Corner accent glows */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#D4AF37]/15 rounded-full blur-[60px]" />
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#F5D76E]/10 rounded-full blur-[60px]" />

              <div className="relative">
                <Rocket className="w-12 h-12 text-[#D4AF37] mx-auto mb-6 animate-pulse" />
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 relative">
                Ready to shape the future?
              </h2>

              <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative">
                Join thousands of student innovators who are already building tomorrow's solutions.
              </p>

              <Link
                href="/signup"
                className="glass-button px-10 sm:px-12 py-5 sm:py-6 text-lg sm:text-xl inline-block shadow-2xl shadow-[#D4AF37]/30 hover:shadow-[#D4AF37]/40 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative">Start Your Journey Now</span>
              </Link>
            </div>
          </RevealOnScroll>
        </section>

        {/* ════════════════════════════════════════════
            FOOTER
           ════════════════════════════════════════════ */}
        <footer className="bg-[#1A1A1A] border-t border-gray-800 py-12 sm:py-16 px-4 rounded-t-[32px] mt-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
              <div className="sm:col-span-2 md:col-span-1">
                <div className="font-bold text-2xl text-white mb-4">Future Titans</div>
                <p className="text-gray-500 mb-4 text-sm leading-relaxed">Empowering the next generation of innovators with tools, mentorship, and community.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-300 mb-4 text-sm tracking-wide uppercase">Company</h4>
                <ul className="space-y-2.5">
                  <li><a href="https://youngpreneurs.in/about-us/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#F5D76E] transition text-sm">About</a></li>
                  <li><a href="https://youngpreneurs.in/contact/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#F5D76E] transition text-sm">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-300 mb-4 text-sm tracking-wide uppercase">Connect</h4>
                <div className="flex gap-3">
                  <a href="https://www.instagram.com/youngpreneurs.ai?igsh=MThlOW93dXJtYjRpeQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-[#D4AF37]/10 hover:text-[#F5D76E] hover:border-[#D4AF37]/20 transition cursor-pointer hover:scale-110">
                    <Instagram className="w-4.5 h-4.5" />
                  </a>
                  <a href="https://www.facebook.com/share/1cqPc5C3LW/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-[#D4AF37]/10 hover:text-[#F5D76E] hover:border-[#D4AF37]/20 transition cursor-pointer hover:scale-110">
                    <Facebook className="w-4.5 h-4.5" />
                  </a>
                  <a href="https://www.linkedin.com/company/youngpreneurs-ai/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:bg-[#D4AF37]/10 hover:text-[#F5D76E] hover:border-[#D4AF37]/20 transition cursor-pointer hover:scale-110">
                    <Linkedin className="w-4.5 h-4.5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-800 text-center text-gray-600 text-sm">
              &copy; 2025 Future Titans. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
