'use client';

import { useEffect, useState } from 'react';

const FOUNDERS = [
  { name: 'Advait Thakur', sub: 'Apex Infosys India', img: '/images/yp/Advait-Thakur.png', text: 'Founded Apex Infosys India at 12, pioneering AI and cybersecurity. By 16, became a Google-certified developer. Now 20, continues inspiring young tech entrepreneurs worldwide.' },
  { name: 'Mark Zuckerberg', sub: 'Facebook / Meta', img: '/images/yp/Mark-Zuckerberg.png', text: 'Founded Facebook at 19, transforming social networking forever. Now leads Meta, driving innovations in AI, virtual reality, and the metaverse.' },
  { name: 'Kaivalya Vohra', sub: 'Zepto', img: '/images/yp/kaivalya.png', text: "Co-founded Zepto at 19, disrupting India's quick-commerce with 10-minute delivery. Became one of India's youngest on the Hurun Rich List." },
  { name: 'Aadithyan Rajesh', sub: 'Trinet Solutions', img: '/images/yp/Aadithyan.png', text: 'Started coding at 5, first app at 9, founded Trinet Solutions at 13. Now 19, delivering cutting-edge digital solutions globally.' },
];

const AUTO_MS = 7000;

export default function FoundersSection() {
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const startedAt = Date.now();
    const tick = setInterval(() => {
      const p = Math.min(100, ((Date.now() - startedAt) / AUTO_MS) * 100);
      setProgress(p);
      if (p >= 100) setIdx((i) => (i + 1) % FOUNDERS.length);
    }, 60);
    return () => clearInterval(tick);
  }, [idx]);

  const goPrev = () => setIdx((i) => (i - 1 + FOUNDERS.length) % FOUNDERS.length);
  const goNext = () => setIdx((i) => (i + 1) % FOUNDERS.length);

  return (
    <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg,#FFFFFF,#F2F8F5 22%,#F2F8F5 78%,#FFFFFF)', padding: 'clamp(80px,10vw,140px) clamp(20px,5vw,48px)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(700px 420px at 84% 18%,rgba(205,163,73,.14),rgba(255,255,255,0) 62%)' }} />
      <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto' }}>

        <div className="fs-intro-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(24px,4vw,60px)', alignItems: 'end' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 28, height: 1.5, background: '#CDA349' }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.26em', textTransform: 'uppercase', color: '#8A6520' }}>Founder Spotlight</span>
            </div>
            <h2 style={{ margin: 0, fontFamily: "'DM Serif Display',Georgia,serif", fontWeight: 400, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.03, letterSpacing: '-.02em', color: '#07291F' }}>Greatness Begins with Belief</h2>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 'clamp(15.5px,1.2vw,17.5px)', lineHeight: 1.72, color: '#3C5A51' }}>Every teen entrepreneur started with a spark — an idea, a dream, and most importantly, someone who believed in them.</p>
            <p style={{ margin: '14px 0 0', fontSize: 'clamp(15.5px,1.2vw,17.5px)', lineHeight: 1.72, color: '#0E4B3A', fontWeight: 600 }}>Now, imagine what your child could achieve with that same belief.</p>
          </div>
        </div>

        <div style={{ marginTop: 'clamp(36px,5vw,58px)', position: 'relative' }}>
          <div style={{ position: 'relative', minHeight: 420 }}>
            {FOUNDERS.map((f, i) => {
              const active = i === idx;
              return (
                <div
                  key={f.name}
                  aria-hidden={!active}
                  style={{
                    position: i === 0 ? 'relative' : 'absolute',
                    inset: i === 0 ? undefined : 0,
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateY(0) scale(1)' : 'translateY(18px) scale(.985)',
                    pointerEvents: active ? 'auto' : 'none',
                    transition: 'opacity .7s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1)',
                  }}
                >
                  <FounderCard f={f} />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button type="button" onClick={goPrev} aria-label="Previous founder" style={{ display: 'grid', placeItems: 'center', width: 46, height: 46, borderRadius: '50%', border: '1px solid rgba(14,75,58,.16)', background: '#FFFFFF', cursor: 'pointer' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="#0E4B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button type="button" onClick={goNext} aria-label="Next founder" style={{ display: 'grid', placeItems: 'center', width: 46, height: 46, borderRadius: '50%', border: '1px solid rgba(14,75,58,.16)', background: '#0E4B3A', cursor: 'pointer' }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 5l7 7-7 7" stroke="#CDA349" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {FOUNDERS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Founder ${i + 1}`}
                  style={{
                    height: 10,
                    width: i === idx ? 34 : 10,
                    borderRadius: 999,
                    border: 0,
                    padding: 0,
                    cursor: 'pointer',
                    background: i === idx ? '#CDA349' : 'rgba(14,75,58,.22)',
                    transition: 'all .4s cubic-bezier(.16,1,.3,1)',
                  }}
                />
              ))}
            </div>

            <div style={{ flex: 1, minWidth: 140, display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ flex: 1, height: 2, borderRadius: 2, background: 'rgba(14,75,58,.12)', overflow: 'hidden' }}>
                <span style={{ display: 'block', height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg,#0E4B3A,#CDA349)' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.14em', color: '#5A7168' }}>
                {String(idx + 1).padStart(2, '0')} / {String(FOUNDERS.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width:980px){
          .fs-intro-grid{grid-template-columns:1fr !important}
          .ss-founder-card{grid-template-columns:1fr !important;justify-items:start !important}
        }
      `}</style>
    </section>
  );
}

function FounderCard({ f }) {
  return (
    <div className="ss-founder-card" style={{ position: 'relative', overflow: 'hidden', height: '100%', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'clamp(24px,4vw,56px)', alignItems: 'center', padding: 'clamp(28px,3.6vw,52px)', borderRadius: 32, border: '1px solid rgba(14,75,58,.10)', background: 'linear-gradient(150deg,#FFFFFF,#FBFDFC)', boxShadow: '0 40px 90px -56px rgba(7,41,31,.75)' }}>
      <div style={{ position: 'relative', width: 'clamp(150px,17vw,214px)', aspectRatio: '1/1' }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', inset: '-7%', width: '114%', height: '114%', animation: 'ypSpin 30s linear infinite' }} aria-hidden="true">
          <circle cx="50" cy="50" r="48" fill="none" stroke="#CDA349" strokeWidth=".7" strokeDasharray="2 5" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,.9)', boxShadow: '0 26px 50px -26px rgba(7,41,31,.75)', background: '#EAF3EE' }}>
          <img src={f.img} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
        <span style={{ position: 'absolute', right: -6, bottom: 6, display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(140deg,#CDA349,#B8892F)', boxShadow: '0 14px 26px -12px rgba(184,137,47,.9)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 4h8v5a4 4 0 1 1-8 0V4z" stroke="#FFFFFF" strokeWidth="1.7" strokeLinejoin="round" /><path d="M16 5h3v2a3 3 0 0 1-3 3M8 5H5v2a3 3 0 0 0 3 3M10 18h4M9 21h6" stroke="#FFFFFF" strokeWidth="1.7" strokeLinecap="round" /></svg>
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <svg width="46" height="34" viewBox="0 0 48 36" fill="none" style={{ opacity: .28, marginBottom: 12 }} aria-hidden="true"><path d="M20 4C10 8 4 16 4 26c0 4 2 6 6 6s6-2.4 6-6-2.6-6-6-6c0-5 3.6-9 10-11l-0-1zm24 0c-10 4-16 12-16 22 0 4 2 6 6 6s6-2.4 6-6-2.6-6-6-6c0-5 3.6-9 10-11l0-1z" fill="#CDA349" /></svg>
        <h3 style={{ margin: 0, fontFamily: "'DM Serif Display',Georgia,serif", fontWeight: 400, fontSize: 'clamp(28px,3.4vw,44px)', lineHeight: 1.08, letterSpacing: '-.02em', color: '#07291F' }}>{f.name}</h3>
        <div style={{ margin: '12px 0 0', display: 'inline-flex', alignItems: 'center', gap: 9, padding: '7px 14px', borderRadius: 999, background: 'rgba(14,75,58,.06)', border: '1px solid rgba(14,75,58,.1)' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CDA349' }} />
          <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: '#0E4B3A' }}>{f.sub}</span>
        </div>
        <p style={{ margin: '22px 0 0', maxWidth: 620, fontSize: 'clamp(15.5px,1.2vw,18px)', lineHeight: 1.72, color: '#3C5A51' }}>{f.text}</p>
      </div>
    </div>
  );
}
