import LandingNavbar from '@/components/shared/LandingNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'Media & Press | Youngpreneurs' };

const MEDIA_ITEMS = [
  { logo: '/images/yp/statesman.png', head: "Youngpreneurs' new mantra for future-ready education and entrepreneurship.", cta: 'Read More', link: 'https://epaper.thestatesman.com/c/78671280', pub: 'The Statesman' },
  { logo: '/images/yp/businesStandard.png', head: "Three US-based entrepreneurs' mission to make leaders out of Indian teens.", cta: 'Read More', link: 'https://www.business-standard.com/article/companies/us-based-entrepreneurs-eyes-indian-teens-to-create-future-leaders-117061200838_1.html', pub: 'Business Standard' },
  { logo: '/images/yp/bussinessworld.png', head: 'Our mission is to connect education and entrepreneurship ecosystem in India.', cta: 'Read More', link: 'https://www.businessworld.in/article/%E2%80%98our-mission-is-to-connect-education-and-entrepreneur-ecosystem-in-india%E2%80%99-122972', pub: 'BusinessWorld' },
  { logo: '/images/yp/et.png', head: 'Meet eight budding teenpreneurs giving wings to their startup ideas.', cta: 'Read More', link: 'https://economictimes.indiatimes.com/small-biz/entrepreneurship/meet-eight-budding-teenpreneurs-who-are-giving-wings-to-their-startup-ideas/articleshow/59007317.cms', pub: 'The Economic Times' },
  { logo: '/images/yp/cnbc.png', head: "Young entrepreneurs redefining India's innovation story at school level.", cta: 'Watch Now', link: 'https://www.facebook.com/watch/?v=1062508397224697', pub: 'CNBC' },
  { logo: '/images/yp/enterpreneurIndia.png', head: "It's time the Indian students' entrepreneurship streak is tapped in school.", cta: 'Read More', link: 'https://www.entrepreneur.com/en-in/starting-a-business/its-time-the-indian-students-entrepreneurship-streak-is/294662', pub: 'Entrepreneur India' },
  { logo: '/images/yp/telegraph.png', head: 'Schools nurturing future founders through experiential learning.', cta: 'Read More', link: 'https://youngpreneurs.in/the-telegraph/', pub: 'The Telegraph' },
  { logo: '/images/yp/ibns.png', head: 'Kolkata: Students get hands-on training at the Youngpreneurs India Camp.', cta: 'Read More', link: 'https://indiablooms.com/life/kolkata-students-get-hands-on-training-at-the-youngpreneurs-india-camp/details', pub: 'IBNS' },
  { logo: '/images/yp/ttoi.png', head: 'Youngpreneurs featured on The Times of India for empowering the next generation.', cta: 'View Feature', link: 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/Times%20of%20India%20Youngpreneurs%20feature%20copy%201.pdf', pub: 'The Times of India' },
];

const KEYFRAMES = `
@keyframes mpSpin{to{transform:rotate(360deg)}}
@keyframes mpSpinRev{to{transform:rotate(-360deg)}}
@keyframes mpTravel{0%{transform:translateX(-30%);opacity:0}20%{opacity:1}80%{opacity:1}100%{transform:translateX(130%);opacity:0}}
@keyframes mpTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes mpPulse{0%,100%{transform:scale(1);opacity:.55}50%{transform:scale(1.4);opacity:0}}
.mp-wrap{font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,-apple-system,sans-serif;color:#0B2F22;background:#FBF9F3;overflow-x:clip}
.mp-wrap a{text-decoration:none}
.mp-wrap ::selection{background:#D6A73A;color:#03170F}
.mp-serif{font-family:'Crimson Pro','DM Serif Display',Georgia,serif}
.mp-wrap [data-card]{transition:transform .35s cubic-bezier(.22,1,.36,1),box-shadow .35s cubic-bezier(.22,1,.36,1),border-color .3s}
.mp-wrap [data-card]:hover{transform:translateY(-6px);box-shadow:0 32px 62px -30px rgba(3,23,15,.4);border-color:rgba(181,138,42,.55)}
.mp-wrap [data-card]:hover [data-arrow-btn]{background:#D6A73A;transform:translateX(4px)}
.mp-wrap [data-mod]{transition:border-color .3s,background .3s}
.mp-wrap [data-mod]:hover{border-color:rgba(225,198,120,.45);background:rgba(255,255,255,.09)}
.mp-wrap [data-stat]{transition:background .35s}
.mp-wrap [data-stat]:hover{background:linear-gradient(180deg,rgba(12,64,44,1),#062618)}
@media (prefers-reduced-motion:reduce){.mp-wrap *{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}}
@media (max-width:900px){.mp-wrap [data-hero-body]{flex-direction:column !important}.mp-wrap [data-hero-media]{position:relative !important;width:100% !important;height:280px !important;margin-top:24px}.mp-wrap [data-hero-content]{padding-top:0 !important}}
@media (max-width:640px){.mp-wrap [data-stats]{grid-template-columns:1fr 1fr !important}.mp-wrap [data-press-header]{grid-template-columns:1fr !important}.mp-wrap [data-quote]{padding:64px 20px !important}.mp-wrap [data-quote-media]{height:220px !important}}
`;

const STATS = [
  { icon: 'M3 4h18v16H3zM7 8h5v4H7zM14.5 8.5h3M14.5 11.5h3M7 16h10', num: '150+', title: 'Media Mentions', sub: 'Across leading platforms' },
  { icon: 'M8.5 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM16 5.6a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2zM3 19.5c.7-3.2 2.9-5.2 5.5-5.2s4.8 2 5.5 5.2M14.4 14.3c2.8-.4 5 1.3 5.8 4.9', num: '25,000+', title: 'Students Impacted', sub: 'Through the Youngpreneurs movement' },
  { icon: 'M2.5 20.5h19M4.5 20.5V11l7.5-4.2 7.5 4.2v9.5M12 6.8V2.6h3.2v1.8H12M10 20.5v-4h4v4', num: '1,200+', title: 'Schools Engaged', sub: 'Pan India presence' },
  { icon: 'M7.5 3.5h9v5.5a4.5 4.5 0 0 1-9 0zM7.5 5.5H4.5a3.2 3.2 0 0 0 3.4 4.4M16.5 5.5h3a3.2 3.2 0 0 1-3.4 4.4M12 13.5v3.5M9 20.5h6M10 17h4v3.5h-4z', num: '500+', title: 'Young Changemakers', sub: 'Ideas turning into impact' },
];

const TICKER = [...MEDIA_ITEMS, ...MEDIA_ITEMS];

export default function Media() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div className="mp-wrap">
        {/* ─── Hero (dark green radial) ─────────────────────────────── */}
        <section style={{ position: 'relative', isolation: 'isolate', color: '#FFFFFF', background: 'radial-gradient(1100px 760px at 76% 32%,#0C4A33 0%,#062A1D 44%,#03170F 80%)', paddingTop: 96, paddingBottom: 96, overflow: 'hidden' }}>
          {/* Ambient background decorators */}
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', left: '-4%', bottom: '6%', width: '56%', height: '62%', backgroundImage: 'radial-gradient(rgba(225,198,120,.22) 1px,transparent 1.4px)', backgroundSize: '22px 22px', WebkitMaskImage: 'radial-gradient(closest-side,#000,transparent)', maskImage: 'radial-gradient(closest-side,#000,transparent)', opacity: 0.55 }} />
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(225,198,120,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(225,198,120,.05) 1px,transparent 1px)', backgroundSize: '96px 96px', WebkitMaskImage: 'linear-gradient(115deg,transparent 30%,#000 55%,transparent 85%)', maskImage: 'linear-gradient(115deg,transparent 30%,#000 55%,transparent 85%)', opacity: 0.6 }} />
          </div>

          {/* Hero image on right */}
          <div data-hero-media aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '58%', zIndex: 1, overflow: 'hidden', pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', inset: 0, WebkitMaskImage: 'linear-gradient(90deg,transparent 0%,#000 26%),linear-gradient(180deg,#000 62%,transparent 98%)', WebkitMaskComposite: 'source-in', maskImage: 'linear-gradient(90deg,transparent 0%,#000 26%),linear-gradient(180deg,#000 62%,transparent 98%)', maskComposite: 'intersect' }}>
              <img src="/images/media/hero-interview.jpg" alt="Youngpreneurs student giving a media interview" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 12%' }} />
            </div>
            <svg width="560" height="560" viewBox="0 0 560 560" style={{ position: 'absolute', left: '19%', top: '47%', marginLeft: -280, marginTop: -280, mixBlendMode: 'screen' }}>
              <circle cx="280" cy="280" r="96" fill="none" stroke="rgba(225,198,120,.26)" strokeWidth="1" />
              <circle cx="280" cy="280" r="160" fill="none" stroke="rgba(225,198,120,.18)" strokeWidth="1" strokeDasharray="2 7" />
              <circle cx="280" cy="280" r="224" fill="none" stroke="rgba(225,198,120,.12)" strokeWidth="1" />
              <path d="M 280 40 A 240 240 0 0 1 505 200" fill="none" stroke="rgba(225,198,120,.42)" strokeWidth="1.2" />
              <circle cx="505" cy="200" r="3" fill="#E1C678" />
            </svg>
          </div>

          {/* Hero content */}
          <div data-hero-body style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)', display: 'flex' }}>
            <div data-hero-content style={{ maxWidth: 760, paddingTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ display: 'block', width: 34, height: 1, background: '#D6A73A' }} />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D6A73A" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M3 5.5c3-1 6-.7 9 1 3-1.7 6-2 9-1V19c-3-1-6-.7-9 1-3-1.7-6-2-9-1z" /><path d="M12 6.5V20" /></svg>
                <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, letterSpacing: '.18em', color: '#E1C678' }}>AS SEEN. AS TRUSTED. AS RECOGNIZED.</p>
              </div>
              <h1 className="mp-serif" style={{ margin: '22px 0 0', fontWeight: 600, fontSize: 'clamp(42px,5.1vw,78px)', lineHeight: 0.98, letterSpacing: '-.005em', color: '#FFFFFF' }}>
                <span style={{ display: 'block', color: '#FFFFFF' }}>FEATURED BY</span>
                <span style={{ display: 'block', backgroundImage: 'linear-gradient(95deg,#F0CF7A 0%,#D6A73A 55%,#C08F27 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', color: 'transparent' }}>INDIA&rsquo;S LEADING</span>
                <span style={{ display: 'block', color: '#FFFFFF' }}>MEDIA NETWORKS</span>
              </h1>
              <p style={{ margin: '26px 0 0', maxWidth: 500, fontSize: 'clamp(16px,1.25vw,18px)', lineHeight: 1.62, color: 'rgba(255,255,255,.85)', textWrap: 'pretty' }}>
                From national publications to business leaders — India&rsquo;s top media platforms are recognizing the Youngpreneurs and Future Titans movement.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 36 }}>
                {[
                  { title: 'Amplifying Student Voices', sub: 'Inspiration that reaches millions.', icon: <><path d="M4 10v4h3l6 4V6L7 10H4z" /><path d="M16.5 9a4 4 0 0 1 0 6" /><path d="M19 6.5a7.5 7.5 0 0 1 0 11" /></> },
                  { title: 'Celebrating Young Changemakers', sub: 'Spotlighting ideas that shape tomorrow.', icon: <><path d="M12 2.8l2.2 1.6 2.7-.1.8 2.6 2.2 1.6-.9 2.5.9 2.5-2.2 1.6-.8 2.6-2.7-.1L12 21.2l-2.2-1.6-2.7.1-.8-2.6-2.2-1.6.9-2.5-.9-2.5 2.2-1.6.8-2.6 2.7.1z" /><path d="M12 8.6l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3z" /></> },
                ].map((m) => (
                  <div key={m.title} data-mod style={{ position: 'relative', flex: '1 1 250px', maxWidth: 340, display: 'flex', gap: 14, alignItems: 'flex-start', padding: '16px 18px', borderRadius: 14, border: '1px solid rgba(225,198,120,.18)', background: 'rgba(255,255,255,.035)', backdropFilter: 'blur(6px)' }}>
                    <span aria-hidden="true" style={{ flex: 'none', width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(225,198,120,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E1C678' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">{m.icon}</svg>
                    </span>
                    <span style={{ display: 'block' }}>
                      <span style={{ display: 'block', fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>{m.title}</span>
                      <span style={{ display: 'block', marginTop: 4, fontSize: 13.5, lineHeight: 1.45, color: 'rgba(255,255,255,.7)' }}>{m.sub}</span>
                    </span>
                  </div>
                ))}
              </div>

              {/* Stat grid */}
              <div data-stats style={{ position: 'relative', marginTop: 60, borderRadius: 18, overflow: 'hidden', background: 'rgba(225,198,120,.16)', border: '1px solid rgba(225,198,120,.22)', boxShadow: '0 18px 30px -24px rgba(3,23,15,.45)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,168px),1fr))', gap: 1 }}>
                {STATS.map((s) => (
                  <div key={s.title} data-stat style={{ position: 'relative', background: 'linear-gradient(180deg,rgba(12,64,44,.96),#062618)', padding: '26px clamp(16px,2vw,26px) 24px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 16px', alignItems: 'flex-start' }}>
                      <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#D6A73A" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" style={{ flex: 'none' }}><path d={s.icon} /></svg>
                      <div>
                        <p style={{ margin: 0, fontSize: 'clamp(30px,2.8vw,40px)', fontWeight: 600, letterSpacing: '-.025em', lineHeight: 1, color: '#E9C66A', fontVariantNumeric: 'tabular-nums' }}>{s.num}</p>
                        <p style={{ margin: '10px 0 0', fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>{s.title}</p>
                        <p style={{ margin: '4px 0 0', fontSize: 13, lineHeight: 1.45, color: 'rgba(255,255,255,.66)' }}>{s.sub}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <svg aria-hidden="true" viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ position: 'absolute', left: 0, bottom: -1, width: '100%', height: 'clamp(70px,9vw,128px)', zIndex: 1, display: 'block' }}>
            <path d="M0 120 L0 74 C 320 18, 1120 18, 1440 74 L1440 120 Z" fill="#FBF9F3" />
            <path d="M0 74 C 320 18, 1120 18, 1440 74" fill="none" stroke="rgba(214,167,58,.55)" strokeWidth="1" />
          </svg>
        </section>

        {/* ─── Media & Press header + ticker + press archive ─────── */}
        <main style={{ position: 'relative', background: '#FBF9F3', paddingBottom: 'clamp(80px,9vw,130px)' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(7,61,44,.13) 1px,transparent 1.3px)', backgroundSize: '30px 30px', WebkitMaskImage: 'linear-gradient(180deg,#000 0%,rgba(0,0,0,.35) 40%,rgba(0,0,0,.6) 100%)', maskImage: 'linear-gradient(180deg,#000 0%,rgba(0,0,0,.35) 40%,rgba(0,0,0,.6) 100%)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '0 clamp(20px,4vw,48px)' }}>

            {/* Section header */}
            <section id="media" style={{ padding: 'clamp(72px,8vw,120px) 0 clamp(40px,5vw,64px)' }}>
              <div data-press-header style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,420px),1fr))', gap: '28px 64px', alignItems: 'end' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span style={{ display: 'block', width: 36, height: 1, background: '#C9A24A' }} />
                    <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, letterSpacing: '.2em', color: '#8A6718' }}>IN THE SPOTLIGHT</p>
                  </div>
                  <h2 className="mp-serif" style={{ margin: '18px 0 0', fontWeight: 500, fontSize: 'clamp(60px,9.6vw,150px)', lineHeight: 0.9, letterSpacing: '-.025em', color: '#073D2C' }}>
                    Media <span style={{ color: '#B58A2A' }}>&amp;</span> Press
                  </h2>
                </div>
                <div style={{ paddingBottom: 'clamp(6px,1.4vw,22px)' }}>
                  <p style={{ margin: 0, maxWidth: 470, fontSize: 'clamp(16px,1.3vw,19px)', lineHeight: 1.62, color: '#58625C', textWrap: 'pretty' }}>
                    Explore how leading media houses are covering the stories, achievements, and impact of Youngpreneurs and Future Titans.
                  </p>
                  <span aria-hidden="true" style={{ display: 'block', marginTop: 26, width: 'min(100%,470px)', height: 1, background: 'linear-gradient(90deg,#C9A24A,rgba(201,162,74,0))' }} />
                </div>
              </div>
            </section>

            {/* Ticker */}
            <div aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', marginBottom: 'clamp(32px,4vw,48px)', padding: '18px 0', borderTop: '1px solid rgba(7,61,44,.10)', borderBottom: '1px solid rgba(7,61,44,.10)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)', maskImage: 'linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 64, width: 'max-content', animation: 'mpTicker 32s linear infinite' }}>
                {TICKER.map((t, i) => (
                  <img key={i} src={t.logo} alt="" loading="lazy" style={{ height: 34, width: 'auto', display: 'block', filter: 'grayscale(1)', opacity: 0.5, flex: 'none' }} />
                ))}
              </div>
            </div>

            {/* Press archive grid */}
            <section aria-label="Media coverage" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: 'clamp(14px,1.6vw,22px)' }}>
              {MEDIA_ITEMS.map((p, i) => (
                <a
                  key={p.link}
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-card
                  style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 20, padding: 'clamp(24px,2.2vw,32px)', minHeight: 260, background: '#FFFFFF', border: '1px solid rgba(7,61,44,.1)', borderRadius: 14, overflow: 'hidden', color: '#0B2F22', isolation: 'isolate', boxShadow: '0 2px 0 rgba(15,59,46,.02)' }}
                >
                  <span aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: -1, background: 'radial-gradient(400px circle at 30% 0%,rgba(214,167,58,.08),transparent 62%)' }} />
                  <span aria-hidden="true" style={{ position: 'absolute', right: 0, bottom: 0, width: '62%', height: '70%', zIndex: -1, backgroundImage: 'radial-gradient(rgba(7,61,44,.16) 1px,transparent 1.4px)', backgroundSize: '14px 14px', WebkitMaskImage: 'radial-gradient(circle at 100% 100%,#000,transparent 70%)', maskImage: 'radial-gradient(circle at 100% 100%,#000,transparent 70%)', opacity: 0.5 }} />
                  <span aria-hidden="true" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: 'linear-gradient(90deg,#C9A24A,rgba(225,198,120,.25) 70%,transparent)' }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, minHeight: 60 }}>
                    <img src={p.logo} alt={p.pub} loading="lazy" style={{ height: 42, width: 'auto', maxWidth: '70%', display: 'block', objectFit: 'contain', objectPosition: 'left center', mixBlendMode: 'multiply' }} />
                    <span aria-hidden="true" style={{ flex: 'none', width: 22, height: 22, borderRadius: '50%', border: '1px solid rgba(181,138,42,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C9A24A' }} />
                    </span>
                  </div>

                  <h3 className="mp-serif" style={{ flex: 1, margin: 0, fontWeight: 500, fontSize: 'clamp(19px,1.5vw,22px)', lineHeight: 1.2, letterSpacing: '-.005em', color: '#0B2F22', textWrap: 'pretty' }}>
                    {p.head}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'flex-start' }}>
                    <span aria-hidden="true" style={{ display: 'block', height: 1, width: 44, background: '#C9A24A' }} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 600, color: '#073D2C', whiteSpace: 'nowrap' }}>
                      {p.cta}
                      <span data-arrow-btn style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: '50%', background: 'rgba(214,167,58,.22)', color: '#052117', fontSize: 15, transition: 'transform .3s cubic-bezier(.22,1,.36,1),background .3s' }}>
                        {p.cta === 'Watch Now' ? '▶' : '→'}
                      </span>
                    </span>
                  </div>
                </a>
              ))}
            </section>
          </div>
        </main>

        {/* ─── Quote section (dark) ────────────────────────────────── */}
        <section data-quote style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', color: '#FFFFFF', background: 'radial-gradient(900px 620px at 28% 42%,#0B4230 0%,#052117 48%,#03170F 82%)', padding: 'clamp(72px,8vw,120px) clamp(20px,4vw,48px)' }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: '-10% 0', backgroundImage: 'repeating-linear-gradient(90deg,rgba(225,198,120,.05) 0 1px,transparent 1px 120px)', WebkitMaskImage: 'linear-gradient(90deg,#000,transparent 60%)', maskImage: 'linear-gradient(90deg,#000,transparent 60%)', pointerEvents: 'none' }} />
          <div data-quote-media aria-hidden="true" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '64%', overflow: 'hidden', zIndex: 0 }}>
            <div style={{ position: 'absolute', inset: '-9% 0', WebkitMaskImage: 'linear-gradient(90deg,transparent 0%,#000 34%),linear-gradient(180deg,transparent 0%,#000 16%,#000 76%,transparent 100%)', WebkitMaskComposite: 'source-in', maskImage: 'linear-gradient(90deg,transparent 0%,#000 34%),linear-gradient(180deg,transparent 0%,#000 16%,#000 76%,transparent 100%)', maskComposite: 'intersect' }}>
              <img src="/images/media/quote-students.jpg" alt="Youngpreneurs students collaborating around a laptop" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'right center', display: 'block' }} />
            </div>
          </div>

          <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto' }}>
            <figure style={{ margin: 0, maxWidth: 600 }}>
              <blockquote style={{ margin: 0, display: 'flex', gap: 'clamp(12px,1.6vw,22px)', alignItems: 'flex-start' }}>
                <span className="mp-serif" aria-hidden="true" style={{ flex: 'none', fontWeight: 700, fontSize: 'clamp(90px,9vw,140px)', lineHeight: 0.72, color: '#D6A73A', marginTop: '.04em' }}>&ldquo;</span>
                <p className="mp-serif" style={{ margin: 0, fontWeight: 400, fontSize: 'clamp(30px,3.4vw,52px)', lineHeight: 1.16, letterSpacing: '-.005em', color: '#FFFFFF' }}>
                  When young minds are given the right mindset and mentorship, they build the future.&rdquo;
                </p>
              </blockquote>
              <figcaption className="mp-serif" style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 30, paddingLeft: 'clamp(64px,7.6vw,118px)', fontSize: 'clamp(20px,1.7vw,26px)', color: '#E1C678' }}>&ndash; Youngpreneurs</figcaption>
            </figure>
          </div>
        </section>
      </div>

      <PublicFooter />
    </div>
  );
}
