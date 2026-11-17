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
@media (max-width:640px){.mp-wrap [data-press-header]{grid-template-columns:1fr !important}.mp-wrap [data-quote]{padding:64px 20px !important}.mp-wrap [data-quote-media]{height:220px !important}}
`;

const TICKER = [...MEDIA_ITEMS, ...MEDIA_ITEMS];

export default function Media() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      <div className="mp-wrap">
        {/* ─── Hero (image-only) ─────────────────────────────── */}
        <section style={{ position: 'relative', width: '100%', background: '#03170F', overflow: 'hidden' }}>
          <img src="/images/media/hero-interview.jpg" alt="Featured by India's Leading Media Networks — Youngpreneurs" style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }} />
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
