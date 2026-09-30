'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LandingNavbar from '@/components/shared/LandingNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

const PARTNERS = [
  { name: 'IIT Kharagpur', src: '/images/yp/iit-kharagpur.svg' },
  { name: 'Startup India', src: '/images/yp/startUpIndiaLogo.png' },
  { name: 'Association of Indian Principals', src: '/images/yp/AIPlogo.png' },
  { name: 'AIC BIMTECH', src: '/images/yp/AIClogo.png' },
];

const ARCH = [
  {
    k: 'idea',
    code: '01',
    title: 'IDEA DNA',
    sub: 'The Structured Innovation Pipeline',
    desc: 'A four-stage framework — Design → Experiment → Apply → Adapt; structured for repeatable innovation.',
    icon: 'M4.4 12a3.8 3.8 0 0 1 7.6 0 3.8 3.8 0 0 0 7.6 0M4.4 12a3.8 3.8 0 0 0 7.6 0 3.8 3.8 0 0 1 7.6 0',
  },
  {
    k: 'surge',
    code: '02',
    title: 'S.U.R.G.E.',
    sub: 'The Cognitive Supremacy Model',
    desc: 'A five-step cognitive protocol guiding how students process challenges and convert them into actionable steps.',
    icon: 'M3.4 17.4 7.2 11.6l3 1.8 3.6-6.4 2.8 4.4 4-2.6',
  },
  {
    k: 'ssi',
    code: '03',
    title: 'SSI',
    sub: 'Solution Seeking Index',
    desc: 'A proprietary measurement that captures clarity in framing, depth of idea solving, impact potential, experimentation, and ability to adapt.',
    icon: 'M4 17.2a8.6 8.6 0 1 1 16 0M12 12.6 16.2 9.6M12 3.4v1.8M4.6 8.2 6.2 9M19.4 8.2 17.8 9',
  },
  {
    k: 'ai',
    code: '04',
    title: 'AI Co-Founder',
    sub: 'Guided Human + AI Co-creation',
    desc: 'A structured assistant supporting problem analysis, idea refinement, zero-to-prototype translation, and pitch-building within AI collaboration norms.',
    icon: 'M7.6 4.6a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM16.4 13.4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM10.2 10.2 13.8 13.8M16.4 4.6h4M18.4 2.6v4',
  },
];

const LADDER = [
  { n: '01', title: 'Discover & Define', desc: 'Find real-world challenges and validate with empathy.', icon: 'M10.4 3.6a6.9 6.9 0 1 0 0 13.8 6.9 6.9 0 0 0 0-13.8zM15.4 15.4 20.8 20.8' },
  { n: '02', title: 'Design the Difference', desc: 'Ideate and refine solutions with structure and user-centric design.', icon: 'M6 4.8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM18 4.8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM12 15.2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM8 6.8h8M7.6 8.8 10.8 14M16.4 8.8 13.2 14' },
  { n: '03', title: 'Prototype to Pitch', desc: 'Build, test, and iterate — turning ideas into real-world value.', icon: 'M3.6 13.4h7v7h-7zM13.4 13.4h7v7h-7zM8.5 3.6h7v7h-7z' },
  { n: '04', title: 'Market Mindset', desc: 'Understand your audience, craft your story, and fine-tune your pitch.', icon: 'M3.4 19.6h17.2M6 15.4l4.2-4.4 3 3 5.2-6.2M14.4 7.8h4v4' },
  { n: '05', title: 'Pitch Like a Pro', desc: 'Confidently present and compete on the national stage.', icon: 'M12 3v9M8.4 6.6 12 3l3.6 3.6M3.6 14.4h16.8M6.6 14.4v6M17.4 14.4v6' },
];

const LEADERS = [
  { name: 'Devika Majumder', role: 'Founder & CEO', image: '/images/yp/devika.jpg', quote: "As a founder, I believe in the power of an innovator's eye, a founder's grit, and an entrepreneurial mindset—not just for building businesses, but for shaping fearless, future-ready individuals." },
  { name: 'Suman Bose', role: 'Former CEO & MD Siemens', image: '/images/yp/suman.jpg', quote: "In a world that's changing faster than ever, an entrepreneurial mindset isn't just an advantage—it's a necessity. Future Titans is about building fearless, future-ready leaders!" },
  { name: 'Sandipan Chattopadhyay', role: 'Former CTO Justdial', image: '/images/yp/sandipan.jpeg', quote: 'Entrepreneurship is about problem-solving, adaptability, and resilience. Future Titans ignites that mindset in young minds.' },
  { name: 'Dr. Julia Stamm', role: 'Founder & CEO, She Shapes AI, UK', image: '/images/juliya.jpg', quote: 'Equipping our youth with an entrepreneurial mindset will create a generation of future leaders who can connect the dots and solve today’s complex problems.' },
  { name: 'Fred Katz', role: 'Johns Hopkins Carey Business School', image: '/images/yp/fred.jpeg', quote: 'Entrepreneurship is about thinking big, understanding risks, and solving real-world problems. Future Titans is giving young minds the platform they need.' },
  { name: 'Dr. Partha Ghosh', role: 'Former Senior Partner at McKinsey', image: '/images/yp/partha.jpg', quote: 'To succeed, leaders have to think and act beyond borders, keeping in focus the locale—both requirements and assets.' },
];

const PHASES = [
  { label: 'PHASE 1', title: 'Idea Submission (Virtual)', desc: 'Participants submit their refined concepts shaped using IDEA DNA, S.U.R.G.E., and early-level experimentation.', icon: 'M6.4 3.4h7.2l4 4v13.2H6.4zM13.6 3.4v4h4M9.4 12.4h5.2M9.4 16h3.6' },
  { label: 'PHASE 2', title: 'Pitch Video (Virtual)', desc: 'Participants communicate their concept through a short video pitch showcasing their problem insight, structured approach, and prototype.', icon: 'M3.4 6.6h12.2v10.8H3.4zM15.6 10.4 20.6 7.6v8.8l-5-2.8z' },
  { label: 'PHASE 3', title: 'The Grand Finale (Live Bootcamp)', desc: 'Top 10-15 teams join a national bootcamp — deepening innovation models, receiving guidance from mentors, and pitching to a national jury.', icon: 'M3.4 20.6h17.2M5.8 20.6v-4.6h4.4v4.6M13.8 20.6v-8.2h4.4v8.2M9.2 9.6 12 5.4l2.8 4.2' },
];

const CSS = `
@keyframes ftDrift{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes ftDriftB{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
@keyframes ftPulse{0%,100%{opacity:.35;transform:scale(1)}50%{opacity:1;transform:scale(1.5)}}
@keyframes ftSpin{to{transform:rotate(360deg)}}
@keyframes ftSpinR{to{transform:rotate(-360deg)}}
@keyframes ftDraw{from{stroke-dashoffset:var(--l,600)}to{stroke-dashoffset:0}}
@keyframes ftDash{to{stroke-dashoffset:-44}}
@keyframes ftTravel{0%{left:0%;opacity:0}12%{opacity:1}88%{opacity:1}100%{left:100%;opacity:0}}
@keyframes ftSeq{0%,100%{opacity:.28;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}
@keyframes ftGlow{0%,100%{opacity:.42}50%{opacity:.9}}
@keyframes ftRise{0%{transform:scaleY(.35);opacity:.45}50%{transform:scaleY(1);opacity:1}100%{transform:scaleY(.35);opacity:.45}}
@keyframes ftSweep{from{transform:rotate(0)}to{transform:rotate(360deg)}}
#ft-page [data-reveal="1"]{opacity:0;transform:translateY(18px);transition:opacity 720ms cubic-bezier(.22,1,.36,1),transform 720ms cubic-bezier(.22,1,.36,1)}
#ft-page [data-reveal="1"].ft-in{opacity:1;transform:translateY(0)}
#ft-page a{text-decoration:none}
#ft-page ::selection{background:#D7AA16;color:#04251A}
@media (prefers-reduced-motion: reduce){#ft-page *{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}}
`;

export default function FutureTitans() {
  const rootRef = useRef(null);
  const [arch, setArch] = useState(0);
  const [leader, setLeader] = useState(0);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const on = () => setNarrow(window.innerWidth < 860);
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  // Reveal-on-scroll for [data-reveal="1"] elements.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = root.querySelectorAll('[data-reveal="1"]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('ft-in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const nextLeader = useCallback(() => setLeader((i) => (i + 1) % LEADERS.length), []);
  const prevLeader = useCallback(() => setLeader((i) => (i - 1 + LEADERS.length) % LEADERS.length), []);
  const activeArch = ARCH[arch];
  const activeLeader = LEADERS[leader];

  return (
    <div id="ft-page" ref={rootRef} style={{ fontFamily: 'Manrope,Inter,system-ui,-apple-system,sans-serif', color: '#171A18', background: '#fff', textWrap: 'pretty' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <LandingNavbar />

      {/* ─── Hero ────────────────────────────────────────────────────── */}
      <section aria-labelledby="ft-hero-h" style={{ position: 'relative', overflow: 'hidden', background: '#05301F', color: '#fff' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,.10) 1px,transparent 1px)', backgroundSize: '28px 28px', opacity: 0.5 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 540px at 74% 14%,rgba(215,170,22,.17),transparent 68%),radial-gradient(760px 580px at 4% 96%,rgba(16,156,138,.16),transparent 72%)' }} />
        <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 140, background: 'linear-gradient(180deg,transparent,rgba(4,37,26,.55))' }} />

        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: 'clamp(48px,6vw,88px) clamp(20px,5vw,56px) clamp(76px,8vw,116px)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(34px,5vw,62px)', alignItems: 'center' }}>
          <div style={{ flex: '1 1 430px', minWidth: 0 }}>
            <div data-reveal="1" style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 15px', borderRadius: 999, border: '1px solid rgba(255,255,255,.20)', background: 'rgba(255,255,255,.07)', fontSize: 12, fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase', color: '#E6F0E9' }}>
                <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: '#7BE3C2', animation: 'ftPulse 2.6s ease-in-out infinite' }} />
                Youngpreneurs Presents
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 15px', borderRadius: 999, border: '1px solid rgba(215,170,22,.42)', background: 'rgba(215,170,22,.12)', fontSize: 12, fontWeight: 700, letterSpacing: '.13em', textTransform: 'uppercase', color: '#F0D782' }}>
                National Challenge
              </span>
            </div>

            <h1 id="ft-hero-h" data-reveal="1" style={{ margin: '24px 0 0', fontSize: 'clamp(3.2rem,6vw,5.6rem)', lineHeight: 0.93, fontWeight: 800, letterSpacing: '-.035em' }}>Future Titans</h1>
            <p data-reveal="1" style={{ margin: '16px 0 0', fontSize: 'clamp(1.45rem,2.4vw,2.05rem)', lineHeight: 1.15, fontWeight: 700, letterSpacing: '-.02em', color: '#E9C555' }}>Build. Compete. Lead.</p>
            <p data-reveal="1" style={{ margin: '22px 0 0', maxWidth: '53ch', fontSize: 'clamp(16px,1.2vw,18px)', lineHeight: 1.64, color: '#CFDDD4' }}>
              India&apos;s innovation challenge for students in Classes 6–12 — a hands-on workshop journey before you pitch on the national stage.
            </p>

            <div data-reveal="1" style={{ margin: '32px 0 0' }}>
              <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 54, padding: '0 28px', borderRadius: 15, background: '#D7AA16', color: '#04251A', fontSize: 16.5, fontWeight: 700, letterSpacing: '-.01em', boxShadow: '0 14px 34px rgba(215,170,22,.24)' }}>
                Register Now<span aria-hidden="true">→</span>
              </Link>
            </div>

            <div data-reveal="1" style={{ margin: '40px 0 0', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {[
                { k: 'CLASSES', v: '6–12' },
                { k: 'FORMAT', v: 'Workshops + Mentoring' },
                { k: 'SCOPE', v: 'Innovation Market' },
              ].map((s) => (
                <div key={s.k} style={{ flex: '1 1 148px', minWidth: 0, padding: '15px 17px', borderRadius: 18, border: '1px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.055)' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', color: '#A8C7B4' }}>{s.k}</div>
                  <div style={{ marginTop: 7, fontSize: s.k === 'CLASSES' ? 'clamp(20px,1.8vw,24px)' : 'clamp(16px,1.25vw,18px)', fontWeight: s.k === 'CLASSES' ? 800 : 700, letterSpacing: '-.02em', color: '#fff', lineHeight: 1.25 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: '1 1 400px', minWidth: 0, position: 'relative' }}>
            <div data-reveal="1" style={{ position: 'relative' }}>
              <div aria-hidden="true" style={{ position: 'absolute', left: -16, top: -16, right: 26, bottom: 26, border: '1px solid rgba(215,170,22,.38)', borderRadius: 26 }} />
              <div aria-hidden="true" style={{ position: 'absolute', left: 26, top: 26, right: -16, bottom: -16, border: '1px solid rgba(255,255,255,.14)', borderRadius: 26 }} />
              <div style={{ position: 'relative', aspectRatio: '1 / 1.08', maxHeight: 'min(70vh,520px)', borderRadius: 26, overflow: 'hidden', background: 'rgba(255,255,255,.05)', clipPath: 'polygon(0 0,100% 0,100% 82%,82% 82%,82% 100%,0 100%)' }}>
                <Image src="/images/yp/hero-students.png" alt="Future Titans students" fill sizes="(max-width:900px) 90vw, 44vw" style={{ objectFit: 'cover' }} priority />
              </div>

              {/* Floating decorations */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-1%', top: '12%' }}>
                <div style={{ animation: 'ftDrift 7s ease-in-out infinite', padding: '13px 15px', borderRadius: 15, background: 'rgba(6,42,29,.82)', border: '1px solid rgba(215,170,22,.32)', boxShadow: '0 18px 40px rgba(0,0,0,.28)', backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', gap: 7, width: 104 }}>
                  <div style={{ height: 3, width: '66%', borderRadius: 3, background: '#D7AA16' }} />
                  <div style={{ height: 3, width: '100%', borderRadius: 3, background: 'rgba(255,255,255,.26)' }} />
                  <div style={{ height: 3, width: '44%', borderRadius: 3, background: 'rgba(255,255,255,.18)' }} />
                </div>
              </div>
              <div aria-hidden="true" style={{ position: 'absolute', right: '-2%', top: '34%' }}>
                <div style={{ animation: 'ftDriftB 9s ease-in-out infinite', width: 74, height: 74, borderRadius: '50%', background: 'rgba(6,42,29,.8)', border: '1px solid rgba(255,255,255,.16)', boxShadow: '0 18px 40px rgba(0,0,0,.26)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 48 48" style={{ width: 48, height: 48 }}>
                    <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="3" />
                    <circle cx="24" cy="24" r="18" fill="none" stroke="#7BE3C2" strokeWidth="3" strokeLinecap="round" strokeDasharray="113" strokeDashoffset="34" transform="rotate(-90 24 24)" />
                    <circle cx="24" cy="24" r="4" fill="#D7AA16" />
                  </svg>
                </div>
              </div>
              <div aria-hidden="true" style={{ position: 'absolute', left: '4%', bottom: '6%' }}>
                <div style={{ animation: 'ftDrift 8s ease-in-out infinite .7s', padding: 14, borderRadius: 15, background: 'rgba(6,42,29,.82)', border: '1px solid rgba(123,227,194,.28)', boxShadow: '0 18px 40px rgba(0,0,0,.26)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', gap: 6, height: 56 }}>
                  <div style={{ width: 8, height: '40%', borderRadius: 2, background: 'rgba(255,255,255,.3)', transformOrigin: 'bottom', animation: 'ftRise 3.2s ease-in-out infinite' }} />
                  <div style={{ width: 8, height: '70%', borderRadius: 2, background: '#7BE3C2', transformOrigin: 'bottom', animation: 'ftRise 3.2s ease-in-out infinite .35s' }} />
                  <div style={{ width: 8, height: '100%', borderRadius: 2, background: '#D7AA16', transformOrigin: 'bottom', animation: 'ftRise 3.2s ease-in-out infinite .7s' }} />
                </div>
              </div>
              <div aria-hidden="true" style={{ position: 'absolute', right: '16%', bottom: '3%', width: 9, height: 9, borderRadius: '50%', background: '#D7AA16', boxShadow: '0 0 0 6px rgba(215,170,22,.16)', animation: 'ftPulse 3.4s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Partners ────────────────────────────────────────────────── */}
      <section aria-labelledby="ft-partners-h" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#FCF7E9,#FDFBF4)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(7,61,43,.07) 1px,transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5 }} />
        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: 'clamp(72px,8vw,112px) clamp(20px,5vw,56px) clamp(64px,7vw,96px)' }}>
          <p id="ft-partners-h" data-reveal="1" style={{ margin: '0 auto', maxWidth: '34ch', textAlign: 'center', fontSize: 'clamp(19px,1.9vw,25px)', lineHeight: 1.42, fontWeight: 700, letterSpacing: '-.02em', color: '#0A3A28' }}>
            A USA–India initiative backed by leaders in education, policy, and media.
          </p>
          <ul style={{ position: 'relative', listStyle: 'none', margin: 'clamp(40px,5vw,64px) 0 0', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 'clamp(16px,2vw,26px)' }}>
            {PARTNERS.map((p) => (
              <li key={p.name} data-reveal="1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
                <div style={{ width: '100%', padding: '22px 20px', borderRadius: 20, background: '#fff', border: '1px solid rgba(7,61,43,.09)', boxShadow: '0 14px 38px rgba(5,55,38,.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 140 }}>
                  <img src={p.src} alt={p.name} style={{ maxWidth: '100%', maxHeight: 96, objectFit: 'contain' }} />
                </div>
                <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: '#0B4A35', boxShadow: '0 0 0 5px rgba(11,74,53,.10)' }} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Story ───────────────────────────────────────────────────── */}
      <section aria-labelledby="ft-story-h" style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(760px 520px at 88% 8%,rgba(11,74,53,.06),transparent 70%)' }} />
        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: 'clamp(72px,8vw,120px) clamp(20px,5vw,56px)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(36px,5vw,72px)', alignItems: 'center' }}>
          <div style={{ flex: '1 1 420px', minWidth: 0 }}>
            <div data-reveal="1" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, padding: '7px 14px', borderRadius: 999, border: '1px solid rgba(7,61,43,.14)', background: '#F6FAF7', fontSize: 11.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#0A3A28' }}>
              <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: '#D7AA16' }} />
              The Mission
            </div>
            <h2 id="ft-story-h" data-reveal="1" style={{ margin: '22px 0 0', fontSize: 'clamp(2.4rem,4.5vw,4rem)', lineHeight: 1.02, fontWeight: 800, letterSpacing: '-.035em', color: '#0A2C1E' }}>
              Building India&apos;s<br /><span style={{ color: '#B38310' }}>tomorrow</span>, today
            </h2>
            <p data-reveal="1" style={{ margin: '26px 0 0', maxWidth: '58ch', fontSize: 'clamp(16.5px,1.2vw,18px)', lineHeight: 1.66, color: '#33413A' }}>
              We&apos;re entering an age where AI creates faster than we can imagine. The future belongs to young innovators who see possibilities and build solutions.
            </p>
            <p data-reveal="1" style={{ margin: '18px 0 0', maxWidth: '58ch', fontSize: 'clamp(16.5px,1.2vw,18px)', lineHeight: 1.66, color: '#33413A' }}>
              Future Titans is a nationwide program that equips students with the mindset, tools, and mentorship to turn ideas into impact — and pitch on the national stage.
            </p>
            <div data-reveal="1" style={{ margin: '34px 0 0' }}>
              <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 52, padding: '0 26px', borderRadius: 15, background: '#08402C', color: '#fff', fontSize: 16, fontWeight: 700, boxShadow: '0 14px 34px rgba(5,55,38,.18)' }}>
                Start your journey<span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div style={{ flex: '1 1 400px', minWidth: 0, position: 'relative' }}>
            <div data-reveal="1" style={{ position: 'relative' }}>
              <div aria-hidden="true" style={{ position: 'absolute', left: -18, bottom: -18, width: '56%', height: '62%', borderLeft: '1px solid rgba(11,74,53,.22)', borderBottom: '1px solid rgba(11,74,53,.22)', borderBottomLeftRadius: 22 }} />
              <div aria-hidden="true" style={{ position: 'absolute', right: -14, top: -14, width: '40%', height: '34%', borderRight: '1px solid rgba(215,170,22,.55)', borderTop: '1px solid rgba(215,170,22,.55)', borderTopRightRadius: 22 }} />
              <div style={{ position: 'relative', aspectRatio: '1 / 0.86', maxHeight: 'min(62vh,460px)', overflow: 'hidden', background: '#F2F6F3', clipPath: 'polygon(0 10%,10% 0,100% 0,100% 90%,90% 100%,0 100%)' }}>
                <Image src="/images/yp/classroom2.png" alt="Students prototyping" fill sizes="(max-width:900px) 90vw, 44vw" style={{ objectFit: 'cover' }} />
              </div>
              <div aria-hidden="true" style={{ position: 'absolute', left: '16%', bottom: -14, width: 8, height: 8, borderRadius: '50%', background: '#D7AA16', boxShadow: '0 0 0 5px rgba(215,170,22,.14)' }} />
              <div aria-hidden="true" style={{ position: 'absolute', right: '28%', top: -10, width: 6, height: 6, borderRadius: '50%', background: '#0B4A35', boxShadow: '0 0 0 4px rgba(11,74,53,.12)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Architecture ────────────────────────────────────────────── */}
      <section aria-labelledby="ft-arch-h" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#FDFBF4,#FAF5E6 45%,#FCFAF3)' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(7,61,43,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(7,61,43,.045) 1px,transparent 1px)', backgroundSize: '56px 56px', opacity: 0.9 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(700px 480px at 50% 40%,rgba(255,255,255,.85),transparent 72%)' }} />

        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: 'clamp(76px,8vw,116px) clamp(20px,5vw,56px)' }}>
          <div data-reveal="1" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h2 id="ft-arch-h" style={{ margin: 0, fontSize: 'clamp(1.55rem,2.9vw,2.5rem)', lineHeight: 1.12, fontWeight: 800, letterSpacing: '-.02em', color: '#0A2C1E', textTransform: 'uppercase' }}>The Architecture Behind Future Titans</h2>
            <div aria-hidden="true" style={{ flex: '1 1 40px', height: 1, background: 'linear-gradient(90deg,rgba(215,170,22,.7),rgba(7,61,43,0))' }} />
          </div>

          <div style={{ marginTop: 'clamp(34px,4vw,54px)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(20px,2.4vw,28px)', alignItems: 'stretch' }}>
            <div aria-label="Core systems" style={{ flex: '1 1 300px', minWidth: 0, display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 'clamp(12px,1.5vw,18px)', alignContent: 'start' }}>
              {ARCH.map((n, i) => {
                const active = i === arch;
                return (
                  <button key={n.k} type="button" aria-pressed={active} onClick={() => setArch(i)} onMouseEnter={() => setArch(i)} style={{
                    textAlign: 'left', padding: '20px 18px', borderRadius: 22, cursor: 'pointer', WebkitTapHighlightColor: 'transparent',
                    transition: 'all 320ms cubic-bezier(.22,1,.36,1)', display: 'flex', flexDirection: 'column', gap: 12, minHeight: 148,
                    border: `1px solid ${active ? 'rgba(215,170,22,.55)' : 'rgba(7,61,43,.10)'}`,
                    background: active ? '#fff' : '#fff',
                    boxShadow: active ? '0 20px 44px rgba(215,170,22,.18)' : '0 10px 24px rgba(5,55,38,.05)',
                    transform: active ? 'translateY(-4px)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9, fontSize: 11, fontWeight: 800, letterSpacing: '.16em', color: active ? '#B38310' : '#3C4A43' }}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 23, height: 23 }}>
                          <path d={n.icon} fill="none" stroke={active ? '#D7AA16' : '#0A3A28'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {n.code}
                      </span>
                      <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#D7AA16' : 'rgba(7,61,43,.25)', transition: 'all 300ms cubic-bezier(.22,1,.36,1)' }} />
                    </div>
                    <span style={{ fontSize: 'clamp(18px,1.5vw,21px)', fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.16, color: '#0A2C1E' }}>{n.title}</span>
                    <span aria-hidden="true" style={{ display: 'block', marginTop: 'auto', height: 2, borderRadius: 2, background: 'rgba(7,61,43,.08)', overflow: 'hidden' }}>
                      <span style={{ display: 'block', height: '100%', borderRadius: 2, transition: 'width 420ms cubic-bezier(.22,1,.36,1)', width: active ? '100%' : '30%', background: active ? '#D7AA16' : 'rgba(7,61,43,.2)' }} />
                    </span>
                  </button>
                );
              })}
            </div>

            <div aria-live="polite" style={{ flex: '1 1 380px', minWidth: 0, position: 'relative', padding: 'clamp(24px,2.6vw,34px)', borderRadius: 26, background: '#08402C', color: '#fff', overflow: 'hidden', boxShadow: '0 30px 70px rgba(5,55,38,.22)' }}>
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,.08) 1px,transparent 1px)', backgroundSize: '24px 24px', opacity: 0.6 }} />
              <div aria-hidden="true" style={{ position: 'absolute', right: -90, top: -90, width: 300, height: 300, borderRadius: '50%', border: '1px dashed rgba(215,170,22,.28)', animation: 'ftSpin 44s linear infinite' }} />
              <div aria-hidden="true" style={{ position: 'absolute', right: -50, top: -50, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(255,255,255,.1)', animation: 'ftSpinR 60s linear infinite' }} />
              <div style={{ position: 'relative', height: 'clamp(140px,15vw,178px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div aria-hidden="true" style={{ position: 'absolute', width: 'clamp(150px,16vw,196px)', height: 'clamp(150px,16vw,196px)', borderRadius: '50%', background: 'radial-gradient(circle,rgba(215,170,22,.16),transparent 66%)', animation: 'ftGlow 5s ease-in-out infinite' }} />
                <svg viewBox="0 0 200 120" style={{ position: 'relative', width: '100%', maxWidth: 320, height: 'auto' }}>
                  <path d={activeArch.icon} fill="none" stroke="#D7AA16" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" transform="translate(88 48)" />
                </svg>
              </div>
              <div style={{ position: 'relative', marginTop: 22, paddingTop: 22, borderTop: '1px solid rgba(255,255,255,.14)' }}>
                <div style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: '.16em', textTransform: 'uppercase', color: '#E9C555' }}>{activeArch.sub}</div>
                <p style={{ margin: '14px 0 0', maxWidth: '52ch', fontSize: 'clamp(16px,1.15vw,17.5px)', lineHeight: 1.62, color: '#DCE8E1' }}>{activeArch.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Learning Ladder ─────────────────────────────────────────── */}
      <section aria-labelledby="ft-ladder-h" style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(7,61,43,.05) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(620px 420px at 12% 84%,rgba(215,170,22,.09),transparent 70%)' }} />

        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: 'clamp(76px,8vw,116px) clamp(20px,5vw,56px)' }}>
          <div data-reveal="1">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <h2 id="ft-ladder-h" style={{ margin: 0, fontSize: 'clamp(1.55rem,2.9vw,2.5rem)', lineHeight: 1.12, fontWeight: 800, letterSpacing: '-.02em', color: '#0A2C1E', textTransform: 'uppercase' }}>The Learning Ladder: Build Like a Titan</h2>
              <div aria-hidden="true" style={{ flex: '1 1 30px', height: 1, background: 'linear-gradient(90deg,rgba(215,170,22,.7),rgba(7,61,43,0))' }} />
            </div>
            <p style={{ margin: '18px 0 0', maxWidth: '62ch', fontSize: 'clamp(17px,1.35vw,21px)', lineHeight: 1.56, color: '#33413A' }}>
              Five connected workshops — each step prepares you for the next, from empathy to pitch.
            </p>
          </div>

          {!narrow ? (
            <div style={{ position: 'relative', marginTop: 'clamp(44px,5vw,70px)' }}>
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 21, height: 3, borderRadius: 3, background: 'linear-gradient(90deg,rgba(7,61,43,0),rgba(7,61,43,.13) 9%,rgba(7,61,43,.13) 91%,rgba(7,61,43,0))' }} />
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 21, height: 3, borderRadius: 3, background: 'linear-gradient(90deg,rgba(11,74,53,0),#0B4A35 14%,#D7AA16)', width: '82%' }} />
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 'clamp(10px,1.4vw,20px)' }}>
                {LADDER.map((l) => (
                  <div key={l.n} data-reveal="1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13.5, fontWeight: 800, letterSpacing: '.02em', border: '2px solid #D7AA16', background: '#fff', color: '#0A2C1E', boxShadow: '0 6px 16px rgba(215,170,22,.22)' }}>{l.n}</div>
                    <div aria-hidden="true" style={{ width: 1, height: 26, background: 'linear-gradient(180deg,rgba(7,61,43,.22),rgba(7,61,43,.06))' }} />
                    <div style={{ width: '100%', padding: '22px 18px 24px', borderRadius: 22, background: '#fff', border: '1px solid rgba(7,61,43,.08)', boxShadow: '0 12px 28px rgba(5,55,38,.07)' }}>
                      <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 26, height: 26, display: 'block', margin: '0 auto 14px' }}><path d={l.icon} fill="none" stroke="#0A3A28" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <h3 style={{ margin: 0, fontSize: 'clamp(17px,1.35vw,20px)', fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.2, color: '#0A2C1E' }}>{l.title}</h3>
                      <p style={{ margin: '10px 0 0', fontSize: 15, lineHeight: 1.55, color: '#3C4A43' }}>{l.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', marginTop: 40, paddingLeft: 34 }}>
              <div aria-hidden="true" style={{ position: 'absolute', left: 21, top: 10, bottom: 10, width: 3, borderRadius: 3, background: 'rgba(7,61,43,.12)' }} />
              <div aria-hidden="true" style={{ position: 'absolute', left: 21, top: 10, width: 3, borderRadius: 3, background: 'linear-gradient(180deg,#0B4A35,#D7AA16)', height: '90%' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {LADDER.map((l) => (
                  <div key={l.n} data-reveal="1" style={{ position: 'relative', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ position: 'absolute', left: -34, top: 14, width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13.5, fontWeight: 800, border: '2px solid #D7AA16', background: '#fff', color: '#0A2C1E', boxShadow: '0 6px 16px rgba(215,170,22,.22)' }}>{l.n}</div>
                    <div style={{ flex: '1 1 auto', minWidth: 0, marginLeft: 26, padding: '20px 20px 22px', borderRadius: 20, background: '#fff', border: '1px solid rgba(7,61,43,.08)', boxShadow: '0 12px 28px rgba(5,55,38,.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 24, height: 24, flex: '0 0 auto' }}><path d={l.icon} fill="none" stroke="#0A3A28" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, letterSpacing: '-.02em', lineHeight: 1.2, color: '#0A2C1E' }}>{l.title}</h3>
                      </div>
                      <p style={{ margin: '10px 0 0', fontSize: 15.5, lineHeight: 1.56, color: '#3C4A43' }}>{l.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Leaders ─────────────────────────────────────────────────── */}
      <section aria-labelledby="ft-leaders-h" style={{ position: 'relative', overflow: 'hidden', background: '#05301F', color: '#fff' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,.09) 1px,transparent 1px)', backgroundSize: '30px 30px', opacity: 0.5 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(820px 560px at 82% 12%,rgba(215,170,22,.15),transparent 70%),radial-gradient(700px 520px at 6% 88%,rgba(16,156,138,.14),transparent 72%)' }} />

        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: 'clamp(76px,8vw,116px) clamp(20px,5vw,56px)' }}>
          <h2 id="ft-leaders-h" data-reveal="1" style={{ margin: 0, fontSize: 'clamp(2.4rem,4.5vw,3.6rem)', lineHeight: 1.04, fontWeight: 800, letterSpacing: '-.035em' }}>
            What the <span style={{ color: '#E9C555' }}>leaders</span> say
          </h2>

          <div data-reveal="1" style={{ marginTop: 'clamp(36px,4vw,56px)', display: 'flex', flexWrap: 'wrap', gap: 'clamp(24px,3vw,44px)', alignItems: 'center' }}>
            <div style={{ flex: '0 1 316px', minWidth: 0, maxWidth: 340, position: 'relative' }}>
              <div aria-hidden="true" style={{ position: 'absolute', left: -14, top: -14, right: 22, bottom: 22, border: '1px solid rgba(215,170,22,.42)', borderRadius: 24 }} />
              <div style={{ position: 'relative', aspectRatio: '1 / 1.14', maxHeight: 'min(58vh,400px)', borderRadius: 24, overflow: 'hidden', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.14)' }}>
                <Image key={activeLeader.name} src={activeLeader.image} alt={activeLeader.name} fill sizes="340px" style={{ objectFit: 'cover', transition: 'opacity 420ms ease' }} />
              </div>
              <div aria-hidden="true" style={{ position: 'absolute', right: -10, bottom: 6, width: 9, height: 9, borderRadius: '50%', background: '#D7AA16', boxShadow: '0 0 0 6px rgba(215,170,22,.16)' }} />
            </div>

            <div style={{ flex: '1 1 400px', minWidth: 0 }}>
              <div aria-hidden="true" style={{ width: 44, height: 3, borderRadius: 3, background: '#D7AA16' }} />
              <blockquote aria-live="polite" style={{ margin: '22px 0 0', fontSize: 'clamp(18px,1.85vw,26px)', lineHeight: 1.46, fontWeight: 600, letterSpacing: '-.018em', color: '#F2F7F4', maxWidth: '34ch' }}>
                &ldquo;{activeLeader.quote}&rdquo;
              </blockquote>
              <div style={{ marginTop: 26, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18 }}>
                <div>
                  <div style={{ fontSize: 'clamp(17px,1.4vw,20px)', fontWeight: 800, letterSpacing: '-.02em', color: '#fff' }}>{activeLeader.name}</div>
                  <div style={{ marginTop: 5, fontSize: 14, fontWeight: 600, color: '#A8C7B4' }}>{activeLeader.role}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span aria-hidden="true" style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '.1em', color: '#A8C7B4' }}>{String(leader + 1).padStart(2, '0')} / {String(LEADERS.length).padStart(2, '0')}</span>
                  <button type="button" aria-label="Previous leader" onClick={prevLeader} style={{ width: 46, height: 46, borderRadius: 14, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.06)', color: '#fff', fontSize: 17, cursor: 'pointer' }}>←</button>
                  <button type="button" aria-label="Next leader" onClick={nextLeader} style={{ width: 46, height: 46, borderRadius: 14, border: '1px solid rgba(255,255,255,.2)', background: 'rgba(255,255,255,.06)', color: '#fff', fontSize: 17, cursor: 'pointer' }}>→</button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {LEADERS.map((l, i) => (
              <button key={l.name} type="button" aria-label={`Show quote from ${l.name}`} aria-pressed={i === leader} onClick={() => setLeader(i)} style={{ width: 44, height: 44, border: 0, background: 'transparent', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <span style={{ display: 'block', height: 7, borderRadius: 7, transition: 'all 340ms cubic-bezier(.22,1,.36,1)', width: i === leader ? 32 : 12, background: i === leader ? '#D7AA16' : 'rgba(255,255,255,.28)' }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Competition Format ──────────────────────────────────────── */}
      <section aria-labelledby="ft-comp-h" style={{ position: 'relative', overflow: 'hidden', background: '#fff' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(90deg,rgba(7,61,43,.04) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(660px 460px at 88% 18%,rgba(11,74,53,.07),transparent 70%)' }} />

        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: 'clamp(76px,8vw,116px) clamp(20px,5vw,56px)' }}>
          <div data-reveal="1">
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <h2 id="ft-comp-h" style={{ margin: 0, fontSize: 'clamp(1.55rem,2.9vw,2.5rem)', lineHeight: 1.12, fontWeight: 800, letterSpacing: '-.02em', color: '#0A2C1E', textTransform: 'uppercase' }}>The Competition Format</h2>
              <div aria-hidden="true" style={{ flex: '1 1 30px', height: 1, background: 'linear-gradient(90deg,rgba(215,170,22,.7),rgba(7,61,43,0))' }} />
            </div>
            <p style={{ margin: '18px 0 0', maxWidth: '52ch', fontSize: 'clamp(17px,1.35vw,21px)', lineHeight: 1.56, color: '#33413A' }}>Three milestones from idea to national stage.</p>
          </div>

          {!narrow ? (
            <div style={{ position: 'relative', marginTop: 'clamp(46px,5vw,72px)' }}>
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 25, height: 3, borderRadius: 3, background: 'linear-gradient(90deg,rgba(7,61,43,0),rgba(7,61,43,.13) 14%,rgba(7,61,43,.13) 86%,rgba(7,61,43,0))' }} />
              <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 25, height: 3, borderRadius: 3, background: 'linear-gradient(90deg,rgba(11,74,53,0),#0B4A35 18%,#D7AA16)', width: '78%' }} />
              <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 'clamp(16px,2vw,30px)' }}>
                {PHASES.map((p, i) => (
                  <div key={p.label} data-reveal="1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, border: '2px solid rgba(255,255,255,.9)', background: '#D7AA16', color: '#04251A', boxShadow: '0 12px 28px rgba(215,170,22,.28)' }}>{i + 1}</div>
                    <div aria-hidden="true" style={{ width: 1, height: 28, background: 'linear-gradient(180deg,rgba(7,61,43,.22),rgba(7,61,43,.06))' }} />
                    <div style={{ width: '100%', padding: 'clamp(22px,2.2vw,30px)', borderRadius: 24, background: '#fff', border: '1px solid rgba(7,61,43,.08)', boxShadow: '0 14px 32px rgba(5,55,38,.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.17em', color: '#B38310' }}>{p.label}</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 28, height: 28 }}><path d={p.icon} fill="none" stroke="#0A3A28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <h3 style={{ margin: '16px 0 0', fontSize: 'clamp(19px,1.6vw,23px)', fontWeight: 800, letterSpacing: '-.022em', lineHeight: 1.2, color: '#0A2C1E' }}>{p.title}</h3>
                      <p style={{ margin: '12px 0 0', fontSize: 15.5, lineHeight: 1.6, color: '#3C4A43' }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ position: 'relative', marginTop: 40, paddingLeft: 38 }}>
              <div aria-hidden="true" style={{ position: 'absolute', left: 25, top: 14, bottom: 14, width: 3, borderRadius: 3, background: 'rgba(7,61,43,.12)' }} />
              <div aria-hidden="true" style={{ position: 'absolute', left: 25, top: 14, width: 3, borderRadius: 3, background: 'linear-gradient(180deg,#0B4A35,#D7AA16)', height: '85%' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {PHASES.map((p, i) => (
                  <div key={p.label} data-reveal="1" style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: -38, top: 16, width: 52, height: 52, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, border: '2px solid #fff', background: '#D7AA16', color: '#04251A', boxShadow: '0 12px 28px rgba(215,170,22,.28)' }}>{i + 1}</div>
                    <div style={{ marginLeft: 32, padding: 22, borderRadius: 22, background: '#fff', border: '1px solid rgba(7,61,43,.08)', boxShadow: '0 14px 32px rgba(5,55,38,.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '.17em', color: '#B38310' }}>{p.label}</span>
                        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: 26, height: 26 }}><path d={p.icon} fill="none" stroke="#0A3A28" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      <h3 style={{ margin: '14px 0 0', fontSize: 19, fontWeight: 800, letterSpacing: '-.022em', lineHeight: 1.22, color: '#0A2C1E' }}>{p.title}</h3>
                      <p style={{ margin: '11px 0 0', fontSize: 15.5, lineHeight: 1.6, color: '#3C4A43' }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────────── */}
      <section id="register" aria-labelledby="ft-final-h" style={{ position: 'relative', overflow: 'hidden', background: '#05301F', color: '#fff' }}>
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,.09) 1px,transparent 1px)', backgroundSize: '30px 30px', opacity: 0.45 }} />
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 560px at 50% 116%,rgba(215,170,22,.22),transparent 68%),radial-gradient(700px 480px at 12% 8%,rgba(16,156,138,.12),transparent 70%)' }} />
        <svg aria-hidden="true" viewBox="0 0 1200 90" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 90 }}>
          <g fill="none" stroke="rgba(215,170,22,.42)" strokeWidth="1">
            <path d="M80 0 L600 86" /><path d="M260 0 L600 86" /><path d="M440 0 L600 86" /><path d="M600 0 L600 86" /><path d="M760 0 L600 86" /><path d="M940 0 L600 86" /><path d="M1120 0 L600 86" />
          </g>
          <circle cx="600" cy="86" r="4.5" fill="#D7AA16" />
        </svg>

        <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: 'clamp(96px,10vw,140px) clamp(20px,5vw,56px) clamp(76px,8vw,110px)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 id="ft-final-h" data-reveal="1" style={{ margin: 0, maxWidth: '24ch', fontSize: 'clamp(2.4rem,4.5vw,4rem)', lineHeight: 1.04, fontWeight: 800, letterSpacing: '-.035em' }}>
            More than a competition — <span style={{ color: '#E9C555' }}>a national innovation platform.</span>
          </h2>
          <p data-reveal="1" style={{ margin: '26px 0 0', maxWidth: '60ch', fontSize: 'clamp(16.5px,1.25vw,18.5px)', lineHeight: 1.64, color: '#CFDDD4' }}>
            It replaces guesswork with a clear, engineered pathway — so students work through validated processes, not vague creativity.
          </p>
          <p data-reveal="1" style={{ margin: '30px 0 0', fontSize: 'clamp(18px,1.6vw,23px)', fontWeight: 700, letterSpacing: '-.02em', color: '#fff' }}>The next emerging innovator could be you.</p>
          <div data-reveal="1" style={{ margin: '34px 0 0' }}>
            <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 54, padding: '0 30px', borderRadius: 15, background: '#D7AA16', color: '#04251A', fontSize: 16.5, fontWeight: 700, boxShadow: '0 16px 40px rgba(215,170,22,.3)' }}>
              Register Now<span aria-hidden="true">→</span>
            </Link>
          </div>

          <div aria-hidden="true" data-reveal="1" style={{ margin: 'clamp(48px,6vw,76px) auto 0', position: 'relative', width: 'min(470px,100%)', height: 'clamp(186px,21vw,244px)' }}>
            <div style={{ position: 'absolute', left: '50%', bottom: 6, transform: 'translateX(-50%)', width: '80%', height: 80, borderRadius: '50%', background: 'radial-gradient(ellipse at center,rgba(215,170,22,.34),transparent 68%)', animation: 'ftGlow 6s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 12 }}>
              <div style={{ width: '27%', height: 64, clipPath: 'polygon(7% 0,93% 0,100% 100%,0 100%)', background: 'linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.04))', borderTop: '1px solid rgba(255,255,255,.34)' }} />
              <div style={{ width: '32%', height: 108, clipPath: 'polygon(6% 0,94% 0,100% 100%,0 100%)', background: 'linear-gradient(180deg,rgba(215,170,22,.46),rgba(215,170,22,.08))', borderTop: '1.5px solid rgba(233,197,85,.95)' }} />
              <div style={{ width: '27%', height: 48, clipPath: 'polygon(7% 0,93% 0,100% 100%,0 100%)', background: 'linear-gradient(180deg,rgba(255,255,255,.12),rgba(255,255,255,.03))', borderTop: '1px solid rgba(255,255,255,.26)' }} />
            </div>
            <svg viewBox="0 0 180 140" style={{ position: 'absolute', left: '50%', bottom: 98, transform: 'translateX(-50%)', width: 'clamp(140px,17vw,192px)' }}>
              <path d="M28 126 A62 62 0 0 1 152 126" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="1.3" />
              <path d="M46 126 A44 44 0 0 1 134 126" fill="none" stroke="rgba(215,170,22,.55)" strokeWidth="1.4" />
              <path d="M64 126 A26 26 0 0 1 116 126" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1.3" />
              <path d="M90 126 V44" stroke="#D7AA16" strokeWidth="2.2" strokeLinecap="round" />
              <circle cx="90" cy="38" r="6" fill="#D7AA16" />
              <path d="M90 22 V6" stroke="rgba(215,170,22,.55)" strokeWidth="1.3" strokeDasharray="3 5" />
            </svg>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
