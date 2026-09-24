import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';
import FoundersSection from '@/components/success-stories/FoundersCarousel';

export const metadata = { title: 'Success Stories | Youngpreneurs' };

const KEYFRAMES = `
@keyframes ypFloatA{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-16px,0)}}
@keyframes ypFloatB{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,14px,0)}}
@keyframes ypFloatC{0%,100%{transform:translate3d(0,0,0) rotate(-4deg)}50%{transform:translate3d(10px,-10px,0) rotate(3deg)}}
@keyframes ypSpin{to{transform:rotate(360deg)}}
@keyframes ypSpinRev{to{transform:rotate(-360deg)}}
@keyframes ypPulse{0%{transform:scale(.7);opacity:.6}70%{transform:scale(1.9);opacity:0}100%{opacity:0}}
@keyframes ypDash{to{stroke-dashoffset:-320}}
@keyframes ypSheen{0%{transform:translateX(-130%) skewX(-18deg)}55%,100%{transform:translateX(320%) skewX(-18deg)}}
@keyframes ypBob{0%,100%{transform:translateY(0);opacity:.35}50%{transform:translateY(9px);opacity:1}}
@keyframes ypNode{0%,100%{opacity:.35;transform:scale(.9)}50%{opacity:1;transform:scale(1.15)}}
.ss-wrap [data-reveal]{opacity:1 !important;transform:none !important}
.ss-wrap a{color:#0E4B3A;text-decoration:none}
.ss-wrap ::selection{background:#0E4B3A;color:#fff}
@media (max-width:980px){.ss-wrap [data-rsp~="cols"]{grid-template-columns:1fr !important}.ss-wrap [data-rsp~="hidesm"]{display:none !important}.ss-wrap [data-rsp~="stack"]{flex-direction:column !important;align-items:flex-start !important}}
@media (max-width:640px){.ss-wrap [data-rsp~="two"]{grid-template-columns:1fr !important}}
@media (prefers-reduced-motion:reduce){.ss-wrap *{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}}
`;

const rectImg = (src, alt) => `<img src="${src}" alt="${alt}" style="width:100%;height:100%;object-fit:cover;object-position:center top;display:block"/>`;
const circImg = (src, alt) => `<img src="${src}" alt="${alt}" style="width:100%;height:100%;object-fit:cover;display:block"/>`;
const vidBg = (src, alt) => `<video src="${src}" autoplay muted loop playsinline aria-label="${alt}" style="width:100%;height:100%;object-fit:cover;display:block"></video>`;

const CONTENT_HTML_TOP = `
<section id="top" style="position:relative;overflow:hidden;padding:clamp(120px,15vw,190px) clamp(20px,5vw,48px) clamp(70px,8vw,110px)">
  <div style="position:absolute;inset:0;background:radial-gradient(1100px 620px at 78% 8%,rgba(15,107,79,.10),rgba(255,255,255,0) 62%),radial-gradient(760px 520px at 6% 68%,rgba(205,163,73,.13),rgba(255,255,255,0) 60%)"></div>
  <div style="position:absolute;inset:0;opacity:.5;background-image:linear-gradient(rgba(14,75,58,.055) 1px,transparent 1px),linear-gradient(90deg,rgba(14,75,58,.055) 1px,transparent 1px);background-size:56px 56px;mask-image:radial-gradient(900px 620px at 50% 30%,#000,transparent 78%);-webkit-mask-image:radial-gradient(900px 620px at 50% 30%,#000,transparent 78%)"></div>

  <div style="position:relative;max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1.02fr .98fr;gap:clamp(36px,5vw,68px);align-items:center" data-rsp="cols">
    <div>
      <div data-reveal style="display:inline-flex;align-items:center;gap:10px;padding:7px 8px 7px 12px;border-radius:999px;border:1px solid rgba(14,75,58,.14);background:rgba(255,255,255,.8);backdrop-filter:blur(10px);box-shadow:0 10px 26px -20px rgba(7,41,31,.8)">
        <span style="position:relative;display:inline-flex;width:8px;height:8px"><span style="position:absolute;inset:0;border-radius:50%;background:#18B8A6"></span><span style="position:absolute;inset:0;border-radius:50%;background:#18B8A6;animation:ypPulse 2.4s ease-out infinite"></span></span>
        <span style="font-size:11px;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:#0E4B3A">Success Stories</span>
        <span style="display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;background:rgba(205,163,73,.16);font-size:11px;font-weight:700;letter-spacing:.14em;color:#8A6520">CLASSES 6–12</span>
      </div>

      <h1 data-reveal style="margin:26px 0 0;font-family:'DM Serif Display',Georgia,serif;font-weight:400;font-size:clamp(46px,7vw,96px);line-height:.96;letter-spacing:-.025em;color:#07291F">
        <span style="display:block">Tomorrow's Leaders.</span>
        <span style="display:block;position:relative;width:fit-content;background:linear-gradient(100deg,#0E4B3A 0%,#0F6B4F 42%,#CDA349 100%);-webkit-background-clip:text;background-clip:text;color:transparent">Today's Stories.
          <svg viewBox="0 0 420 14" preserveAspectRatio="none" style="position:absolute;left:2px;right:0;bottom:-6px;width:100%;height:12px" aria-hidden="true"><path d="M2 9C90 3 230 2 418 7" stroke="#CDA349" stroke-width="3" stroke-linecap="round" fill="none" opacity=".75"></path></svg>
        </span>
      </h1>

      <p data-reveal style="margin:34px 0 0;max-width:470px;font-size:clamp(16px,1.25vw,18.5px);line-height:1.68;color:#3C5A51">
        <span style="display:block;font-weight:700;color:#0E4B3A">Young minds. Big ideas. Real impact.</span>
        Explore how students across India are turning curiosity into change.
      </p>

      <div data-reveal style="margin:38px 0 0;display:flex;align-items:center;gap:26px;flex-wrap:wrap">
        <a href="#stories" style="display:inline-flex;align-items:center;gap:10px;padding:15px 24px;border-radius:999px;background:linear-gradient(135deg,#0E4B3A,#0B3B2E);color:#FFFFFF;font-size:14px;font-weight:700;box-shadow:0 20px 40px -22px rgba(14,75,58,1)">
          <span>Explore the stories</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5v14M5 12l7 7 7-7" stroke="#CDA349" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </a>
        <div style="display:flex;align-items:center;gap:14px">
          <div style="display:flex">
            <span style="width:34px;height:34px;border-radius:50%;border:2px solid #fff;background:linear-gradient(140deg,#0F6B4F,#0B3B2E)"></span>
            <span style="width:34px;height:34px;border-radius:50%;border:2px solid #fff;background:linear-gradient(140deg,#CDA349,#B8892F);margin-left:-11px"></span>
            <span style="width:34px;height:34px;border-radius:50%;border:2px solid #fff;background:linear-gradient(140deg,#18B8A6,#0F6B4F);margin-left:-11px"></span>
          </div>
          <span style="font-size:12.5px;font-weight:600;line-height:1.4;color:#5A7168">120+ cities<br />1,000+ ideas built</span>
        </div>
      </div>
    </div>

    <div data-reveal style="position:relative">
      <div style="position:relative;width:100%;max-width:600px;margin-left:auto;aspect-ratio:1/1">
        <svg viewBox="0 0 100 100" style="position:absolute;inset:-2%;width:104%;height:104%;animation:ypSpin 58s linear infinite;opacity:.55" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="none" stroke="#CDA349" stroke-width=".35" stroke-dasharray="1.6 3.4"></circle></svg>
        <svg viewBox="0 0 100 100" style="position:absolute;inset:9%;width:82%;height:82%;animation:ypSpinRev 44s linear infinite;opacity:.4" aria-hidden="true"><circle cx="50" cy="50" r="48" fill="none" stroke="#0E4B3A" stroke-width=".3" stroke-dasharray="0.6 5"></circle></svg>

        <div style="position:absolute;left:4%;top:3%;width:53%;aspect-ratio:3/4;border-radius:26px;overflow:hidden;border:1px solid rgba(255,255,255,.9);box-shadow:0 44px 80px -40px rgba(7,41,31,.62),0 0 0 1px rgba(14,75,58,.08);transform:rotate(-2.4deg);background:#EAF3EE">
          ${vidBg('/images/yp/naishaVoice.mp4', 'Naisha Kapoor')}
        </div>
        <div style="position:absolute;right:1%;top:22%;width:40%;aspect-ratio:1/1;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,.9);box-shadow:0 34px 64px -34px rgba(7,41,31,.6),0 0 0 1px rgba(205,163,73,.22);transform:rotate(3deg);background:#EAF3EE">
          ${vidBg('/images/yp/ShivayVoice.mp4', 'Shivay Dhar')}
        </div>
        <div style="position:absolute;left:24%;bottom:1%;width:38%;aspect-ratio:4/5;border-radius:22px;overflow:hidden;border:1px solid rgba(255,255,255,.9);box-shadow:0 34px 64px -34px rgba(7,41,31,.6),0 0 0 1px rgba(14,75,58,.08);transform:rotate(-1.4deg);background:#EAF3EE">
          ${vidBg('/images/yp/KrishikaVoice.mp4', 'Krishika Shaw')}
        </div>

        <div style="position:absolute;right:2%;bottom:14%;display:grid;place-items:center;width:62px;height:62px;border-radius:20px;background:rgba(255,255,255,.86);backdrop-filter:blur(12px);border:1px solid rgba(14,75,58,.1);box-shadow:0 20px 40px -22px rgba(7,41,31,.7);animation:ypFloatA 7s ease-in-out infinite">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.3 11 2 2 0 0 1 .8 1.6V16h5v-.4a2 2 0 0 1 .8-1.6A6 6 0 0 0 12 3z" stroke="#CDA349" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </div>
        <div style="position:absolute;left:-2%;top:36%;display:grid;place-items:center;width:56px;height:56px;border-radius:18px;background:rgba(255,255,255,.86);backdrop-filter:blur(12px);border:1px solid rgba(14,75,58,.1);box-shadow:0 20px 40px -22px rgba(7,41,31,.7);animation:ypFloatB 9s ease-in-out infinite">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 7l-5 5 5 5M16 7l5 5-5 5" stroke="#0F6B4F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </div>
        <div style="position:absolute;left:14%;top:-1%;display:grid;place-items:center;width:50px;height:50px;border-radius:16px;background:linear-gradient(140deg,#0E4B3A,#0B3B2E);box-shadow:0 20px 40px -22px rgba(14,75,58,.95);animation:ypFloatC 11s ease-in-out infinite">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19l3.5-1.2a9.5 9.5 0 0 1 6-8.6c2.2-.8 4.4-.6 5.9-.2.4 1.5.6 3.7-.2 5.9a9.5 9.5 0 0 1-8.6 6L10.4 19M5 19l1.2-3.6M5 19l3.6-1.2" stroke="#CDA349" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="15.5" cy="12.5" r="1.6" fill="#CDA349"></circle></svg>
        </div>
      </div>
    </div>
  </div>

  <div style="position:relative;max-width:1240px;margin:clamp(46px,6vw,78px) auto 0;display:flex;align-items:center;gap:12px;color:#5A7168">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="animation:ypBob 2.4s ease-in-out infinite" aria-hidden="true"><path d="M12 4v15M6 13l6 6 6-6" stroke="#0E4B3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></svg>
    <span style="font-size:11px;font-weight:700;letter-spacing:.26em;text-transform:uppercase">Scroll</span>
    <span style="flex:1;height:1px;background:linear-gradient(90deg,rgba(14,75,58,.22),rgba(14,75,58,0))"></span>
  </div>
</section>

<section style="position:relative;padding:clamp(60px,7vw,100px) clamp(20px,5vw,48px) clamp(80px,9vw,130px)">
  <div style="max-width:1240px;margin:0 auto">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,60px);align-items:end" data-rsp="cols">
      <div>
        <div data-reveal style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:28px;height:1.5px;background:#CDA349"></span>
          <span style="font-size:11px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#8A6520">Impact</span>
        </div>
        <h2 data-reveal style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-weight:400;font-size:clamp(34px,4.6vw,62px);line-height:1.02;letter-spacing:-.02em;color:#07291F">Real Stories. Real Impact.</h2>
      </div>
      <p data-reveal style="margin:0;font-size:clamp(15.5px,1.2vw,18px);line-height:1.7;color:#3C5A51;max-width:460px">Students from Classes 6–12 sharing how Youngpreneurs changed their journey.</p>
    </div>

    <div style="margin-top:clamp(36px,5vw,64px);display:grid;grid-template-columns:repeat(auto-fit,minmax(255px,1fr));gap:clamp(16px,1.6vw,22px)">

      <div data-reveal>
        <div style="position:relative;overflow:hidden;height:100%;padding:30px 28px 28px;border-radius:26px;border:1px solid rgba(14,75,58,.10);background:linear-gradient(170deg,#FFFFFF,#F5FAF7);box-shadow:0 26px 54px -42px rgba(7,41,31,.6)">
          <div style="position:absolute;top:-40px;right:-40px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(24,184,166,.18),rgba(255,255,255,0) 70%)"></div>
          <div style="position:relative;display:flex;align-items:center;justify-content:space-between">
            <span style="display:grid;place-items:center;width:46px;height:46px;border-radius:15px;background:rgba(14,75,58,.07);border:1px solid rgba(14,75,58,.1)">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12c0 4.4-4 8-9 8a10 10 0 0 1-2.9-.4L4 21l1.5-3.7A7.5 7.5 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8z" stroke="#0E4B3A" stroke-width="1.7" stroke-linejoin="round"></path></svg>
            </span>
          </div>
          <div style="margin-top:26px;font-family:'DM Serif Display',Georgia,serif;font-size:clamp(42px,4.6vw,58px);line-height:1;letter-spacing:-.02em;color:#0E4B3A">2,500+</div>
          <div style="margin-top:10px;font-size:13px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#5A7168">Student Stories</div>
          <div style="margin-top:22px;height:3px;border-radius:3px;background:rgba(14,75,58,.08);overflow:hidden"><span style="display:block;height:100%;width:100%;border-radius:3px;background:linear-gradient(90deg,#0E4B3A,#18B8A6)"></span></div>
        </div>
      </div>

      <div data-reveal>
        <div style="position:relative;overflow:hidden;height:100%;padding:30px 28px 28px;border-radius:26px;border:1px solid rgba(14,75,58,.10);background:linear-gradient(170deg,#FFFFFF,#F5FAF7);box-shadow:0 26px 54px -42px rgba(7,41,31,.6)">
          <div style="position:absolute;top:-40px;right:-40px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(242,163,60,.2),rgba(255,255,255,0) 70%)"></div>
          <div style="position:relative;display:flex;align-items:center;justify-content:space-between">
            <span style="display:grid;place-items:center;width:46px;height:46px;border-radius:15px;background:rgba(14,75,58,.07);border:1px solid rgba(14,75,58,.1)">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="#0E4B3A" stroke-width="1.7"></circle><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" stroke="#0E4B3A" stroke-width="1.5"></path></svg>
            </span>
          </div>
          <div style="margin-top:26px;font-family:'DM Serif Display',Georgia,serif;font-size:clamp(42px,4.6vw,58px);line-height:1;letter-spacing:-.02em;color:#0E4B3A">120+</div>
          <div style="margin-top:10px;font-size:13px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#5A7168">Cities Reached</div>
          <div style="margin-top:22px;height:3px;border-radius:3px;background:rgba(14,75,58,.08);overflow:hidden"><span style="display:block;height:100%;width:100%;border-radius:3px;background:linear-gradient(90deg,#0E4B3A,#F2A33C)"></span></div>
        </div>
      </div>

      <div data-reveal>
        <div style="position:relative;overflow:hidden;height:100%;padding:30px 28px 28px;border-radius:26px;border:1px solid rgba(14,75,58,.10);background:linear-gradient(170deg,#FFFFFF,#F5FAF7);box-shadow:0 26px 54px -42px rgba(7,41,31,.6)">
          <div style="position:absolute;top:-40px;right:-40px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(205,163,73,.24),rgba(255,255,255,0) 70%)"></div>
          <div style="position:relative;display:flex;align-items:center;justify-content:space-between">
            <span style="display:grid;place-items:center;width:46px;height:46px;border-radius:15px;background:rgba(14,75,58,.07);border:1px solid rgba(14,75,58,.1)">
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l2.2 5.1 5.5.5-4.2 3.7 1.3 5.4L12 14.9 7.2 17.7l1.3-5.4L4.3 8.6l5.5-.5L12 3z" stroke="#0E4B3A" stroke-width="1.6" stroke-linejoin="round"></path></svg>
            </span>
          </div>
          <div style="margin-top:26px;font-family:'DM Serif Display',Georgia,serif;font-size:clamp(42px,4.6vw,58px);line-height:1;letter-spacing:-.02em;color:#0E4B3A">1,000+</div>
          <div style="margin-top:10px;font-size:13px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#5A7168">Ideas Brought to Life</div>
          <div style="margin-top:22px;height:3px;border-radius:3px;background:rgba(14,75,58,.08);overflow:hidden"><span style="display:block;height:100%;width:100%;border-radius:3px;background:linear-gradient(90deg,#0E4B3A,#CDA349)"></span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section style="position:relative;overflow:hidden;background:linear-gradient(165deg,#0B3B2E 0%,#07291F 58%,#0B3B2E 100%);color:#FFFFFF;padding:clamp(80px,10vw,140px) clamp(20px,5vw,48px);border-radius:clamp(28px,4vw,52px);margin:0 clamp(10px,2vw,22px)">
  <div style="position:absolute;inset:0;opacity:.35;background-image:linear-gradient(rgba(205,163,73,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(205,163,73,.14) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(760px 520px at 78% 40%,#000,transparent 72%);-webkit-mask-image:radial-gradient(760px 520px at 78% 40%,#000,transparent 72%)"></div>
  <div style="position:absolute;left:-8%;bottom:-18%;width:440px;height:440px;border-radius:50%;background:radial-gradient(circle,rgba(24,184,166,.22),rgba(11,59,46,0) 65%)"></div>

  <div style="position:relative;max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:clamp(40px,5vw,80px);align-items:center" data-rsp="cols">
    <div>
      <div data-reveal style="display:flex;align-items:center;gap:12px;margin-bottom:22px">
        <span style="width:28px;height:1.5px;background:#CDA349"></span>
        <span style="font-size:11px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#CDA349">Our Belief</span>
      </div>
      <h2 data-reveal style="margin:0;font-family:'DM Serif Display',Georgia,serif;font-weight:400;font-size:clamp(34px,4.8vw,64px);line-height:1.03;letter-spacing:-.02em;color:#FFFFFF">The Power of <span style="color:#CDA349">Starting Early</span></h2>
      <p data-reveal style="margin:30px 0 0;max-width:520px;font-size:clamp(15.5px,1.2vw,18px);line-height:1.75;color:#C9DBD3">Youngpreneurs is built on a simple belief: Innovation has no age — and vision grows when young minds are given the space to explore, question, and build.</p>
      <p data-reveal style="margin:20px 0 0;max-width:520px;font-size:clamp(15.5px,1.2vw,18px);line-height:1.75;color:#C9DBD3">Meet the young founders who embody this belief. Through their experiences, they demonstrate what becomes possible when students begin shaping ideas with intention.</p>

      <div data-reveal style="margin:38px 0 0;display:flex;align-items:center;gap:14px;flex-wrap:wrap">
        <span style="display:inline-flex;align-items:center;gap:9px;padding:9px 15px;border-radius:999px;border:1px solid rgba(205,163,73,.32);background:rgba(205,163,73,.1);font-size:12px;font-weight:600;letter-spacing:.06em;color:#F0DCA8">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l2.2 5.1 5.5.5-4.2 3.7 1.3 5.4L12 14.9 7.2 17.7l1.3-5.4L4.3 8.6l5.5-.5L12 3z" fill="#CDA349"></path></svg>
          Explore
        </span>
        <span style="display:inline-flex;align-items:center;gap:9px;padding:9px 15px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);font-size:12px;font-weight:600;letter-spacing:.06em;color:#C9DBD3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9.5 15.5l-4-4M4 20l4.2-1.1a2 2 0 0 0 .9-.5l9.3-9.3a2.5 2.5 0 0 0-3.5-3.5L5.6 14.9a2 2 0 0 0-.5.9L4 20z" stroke="#18B8A6" stroke-width="1.7" stroke-linejoin="round"></path></svg>
          Question
        </span>
        <span style="display:inline-flex;align-items:center;gap:9px;padding:9px 15px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);font-size:12px;font-weight:600;letter-spacing:.06em;color:#C9DBD3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-5h4v5" stroke="#F2A33C" stroke-width="1.7" stroke-linejoin="round"></path></svg>
          Build
        </span>
      </div>
    </div>

    <div data-reveal style="position:relative;aspect-ratio:1/1;max-width:560px;margin:0 auto;width:100%">
      <svg viewBox="0 0 400 400" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">
        <defs>
          <radialGradient id="ypGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#18B8A6" stop-opacity=".28"></stop><stop offset="100%" stop-color="#0B3B2E" stop-opacity="0"></stop></radialGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="url(#ypGlow)"></circle>
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(205,163,73,.28)" stroke-width="1" stroke-dasharray="3 7"></circle>
        <circle cx="200" cy="200" r="104" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="1"></circle>
        <g stroke="#CDA349" stroke-width="1.3" fill="none" opacity=".75" stroke-dasharray="7 9" style="animation:ypDash 9s linear infinite">
          <path d="M92 118 L200 200 L308 132"></path>
          <path d="M200 200 L112 292"></path>
          <path d="M200 200 L300 288"></path>
          <path d="M92 118 L112 292"></path>
          <path d="M308 132 L300 288"></path>
        </g>
        <g fill="#18B8A6">
          <circle cx="160" cy="92" r="4" style="animation:ypNode 3.4s ease-in-out infinite"></circle>
          <circle cx="320" cy="212" r="3.4" style="animation:ypNode 4.2s ease-in-out .6s infinite"></circle>
          <circle cx="86" cy="214" r="3.4" style="animation:ypNode 3.8s ease-in-out 1.1s infinite"></circle>
          <circle cx="214" cy="320" r="4" style="animation:ypNode 4.6s ease-in-out .3s infinite"></circle>
        </g>
      </svg>

      <div style="position:absolute;left:11%;top:18%;width:23%;aspect-ratio:1/1;border-radius:50%;overflow:hidden;border:2px solid rgba(205,163,73,.55);box-shadow:0 20px 44px -22px rgba(0,0,0,.8);animation:ypFloatA 8s ease-in-out infinite;background:#0F6B4F">
        ${circImg('/images/yp/Advait-Thakur.png', 'Advait Thakur')}
      </div>
      <div style="position:absolute;right:9%;top:24%;width:19%;aspect-ratio:1/1;border-radius:50%;overflow:hidden;border:2px solid rgba(255,255,255,.35);box-shadow:0 20px 44px -22px rgba(0,0,0,.8);animation:ypFloatB 10s ease-in-out infinite;background:#0F6B4F">
        ${circImg('/images/yp/Mark-Zuckerberg.png', 'Mark Zuckerberg')}
      </div>
      <div style="position:absolute;left:22%;bottom:12%;width:21%;aspect-ratio:1/1;border-radius:50%;overflow:hidden;border:2px solid rgba(24,184,166,.5);box-shadow:0 20px 44px -22px rgba(0,0,0,.8);animation:ypFloatC 12s ease-in-out infinite;background:#0F6B4F">
        ${circImg('/images/yp/kaivalya.png', 'Kaivalya Vohra')}
      </div>

      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;width:31%;aspect-ratio:1/1;border-radius:50%;background:linear-gradient(150deg,rgba(255,255,255,.14),rgba(255,255,255,.04));backdrop-filter:blur(10px);border:1px solid rgba(205,163,73,.42);box-shadow:0 0 60px -18px rgba(205,163,73,.6)">
        <div style="text-align:center">
          <div style="font-family:'DM Serif Display',Georgia,serif;font-size:clamp(22px,3vw,34px);line-height:1;color:#CDA349">6–12</div>
          <div style="margin-top:6px;font-size:9.5px;font-weight:700;letter-spacing:.2em;color:rgba(255,255,255,.72)">CLASSES</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="stories" style="position:relative;padding:clamp(80px,10vw,140px) clamp(20px,5vw,48px)">
  <div style="max-width:1240px;margin:0 auto">
    <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:30px;flex-wrap:wrap">
      <div>
        <div data-reveal style="display:flex;align-items:center;gap:12px;margin-bottom:20px">
          <span style="width:28px;height:1.5px;background:#CDA349"></span>
          <span style="font-size:11px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#8A6520">MEET OUR BRAND AMBASSADORS</span>
        </div>
        <h2 data-reveal style="margin:0;max-width:760px;font-family:'DM Serif Display',Georgia,serif;font-weight:400;font-size:clamp(32px,4.4vw,58px);line-height:1.05;letter-spacing:-.02em;color:#07291F">Voices of Clarity, Courage, and Momentum.</h2>
      </div>
      <div data-reveal data-rsp="hidesm" style="display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:999px;border:1px solid rgba(14,75,58,.12);background:#F5FAF7">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3l2.2 5.1 5.5.5-4.2 3.7 1.3 5.4L12 14.9 7.2 17.7l1.3-5.4L4.3 8.6l5.5-.5L12 3z" fill="#CDA349"></path></svg>
        <span style="font-size:11.5px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#0E4B3A">04 Stories</span>
      </div>
    </div>

    <div style="margin-top:clamp(36px,5vw,60px);display:grid;grid-template-columns:repeat(auto-fit,minmax(248px,1fr));gap:clamp(16px,1.8vw,24px)" data-rsp="two">
      ${[
        { n: '01', name: 'NAISHA KAPOOR', video: '/images/yp/naishaVoice.mp4', quote: 'Innovation begins the moment you decide to look deeper.', desc: 'Naisha shares how a single moment of curiosity became the spark that led her to build something she never imagined possible.', bar: 'linear-gradient(90deg,#18B8A6,#0E4B3A)' },
        { n: '02', name: 'SHIVAY DHAR', video: '/images/yp/ShivayVoice.mp4', quote: 'Once you start building, the world starts opening up.', desc: 'Shivay reflects on how stepping outside the classroom unlocked a version of himself that no exam had ever asked for.', bar: 'linear-gradient(90deg,#F2A33C,#0E4B3A)' },
        { n: '03', name: 'KRISHIKA SHAW', video: '/images/yp/KrishikaVoice.mp4', quote: 'You find clarity when you start creating, not when you wait.', desc: 'Krishika talks about how building her first idea gave her a clarity and direction she had never found in any textbook.', bar: 'linear-gradient(90deg,#7C6BF2,#0E4B3A)' },
        { n: '04', name: 'KSHITIJ MANISH KALUNKE', video: '/images/yp/kshitijVoice.mp4', quote: 'Every big journey starts with one small spark.', desc: 'Kshitij describes the moment that ignited his passion — sparking a journey of curiosity and continuous growth.', bar: 'linear-gradient(90deg,#F2795B,#0E4B3A)' },
      ].map(a => `
      <div data-reveal>
        <article style="position:relative;overflow:hidden;height:100%;display:flex;flex-direction:column;border-radius:28px;border:1px solid rgba(14,75,58,.10);background:#FFFFFF;box-shadow:0 26px 54px -44px rgba(7,41,31,.7)">
          <div style="position:relative;aspect-ratio:4/5;overflow:hidden;background:#EAF3EE">
            ${vidBg(a.video, a.name)}
            <span style="position:absolute;left:16px;top:16px;display:inline-flex;align-items:center;gap:7px;padding:6px 11px;border-radius:999px;background:rgba(255,255,255,.88);backdrop-filter:blur(8px);font-size:10.5px;font-weight:800;letter-spacing:.18em;color:#0E4B3A;pointer-events:none">${a.n}</span>
          </div>
          <div style="position:relative;padding:24px 24px 28px;flex:1;display:flex;flex-direction:column">
            <div style="height:3px;width:100%;border-radius:3px;background:${a.bar}"></div>
            <h3 style="margin:18px 0 0;font-size:14px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:#07291F">${a.name}</h3>
            <p style="margin:14px 0 0;font-family:'DM Serif Display',Georgia,serif;font-size:19.5px;line-height:1.35;letter-spacing:-.01em;color:#0E4B3A">"${a.quote}"</p>
            <p style="margin:14px 0 0;font-size:14.5px;line-height:1.66;color:#5A7168">${a.desc}</p>
          </div>
        </article>
      </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- FOUNDERS_SECTION_SPLIT -->
`;

const CONTENT_HTML_BOTTOM = `
<section style="position:relative;overflow:hidden;background:linear-gradient(140deg,#07291F 0%,#0B3B2E 45%,#0E4B3A 100%);color:#FFFFFF;padding:clamp(84px,11vw,152px) clamp(20px,5vw,48px)">
  <svg viewBox="0 0 1200 420" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%;opacity:.5" aria-hidden="true">
    <g stroke="rgba(205,163,73,.42)" stroke-width="1" fill="none">
      <path d="M0 340 L160 340 L160 190 L250 130 L340 190 L340 340 L520 340"></path>
      <path d="M200 340 L200 230 M250 130 L250 340 M300 340 L300 230"></path>
      <path d="M520 340 L520 150 L640 90 L760 150 L760 340 L1200 340"></path>
      <path d="M560 340 L560 210 L720 210 L720 340"></path>
      <path d="M600 210 L600 340 M660 210 L660 340"></path>
      <path d="M820 340 L820 220 L900 170 L980 220 L980 340"></path>
      <path d="M1020 340 L1020 250 L1090 250 L1090 340"></path>
    </g>
    <g fill="rgba(24,184,166,.5)">
      <circle cx="250" cy="130" r="4"></circle>
      <circle cx="640" cy="90" r="5"></circle>
      <circle cx="900" cy="170" r="4"></circle>
    </g>
    <path d="M0 341 L1200 341" stroke="rgba(205,163,73,.6)" stroke-width="1.4"></path>
  </svg>
  <div style="position:absolute;right:-6%;top:-14%;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle,rgba(205,163,73,.22),rgba(11,59,46,0) 66%)"></div>

  <div style="position:relative;max-width:1000px;margin:0 auto;text-align:center">
    <div data-reveal style="display:inline-flex;align-items:center;gap:10px;padding:8px 16px;border-radius:999px;border:1px solid rgba(205,163,73,.35);background:rgba(205,163,73,.1)">
      <span style="width:6px;height:6px;border-radius:50%;background:#CDA349"></span>
      <span style="font-size:11px;font-weight:700;letter-spacing:.26em;text-transform:uppercase;color:#F0DCA8">The Movement</span>
    </div>
    <h2 data-reveal style="margin:28px 0 0;font-family:'DM Serif Display',Georgia,serif;font-weight:400;font-size:clamp(34px,5.6vw,76px);line-height:1.02;letter-spacing:-.025em;color:#FFFFFF">A MOVEMENT LED BY <span style="background:linear-gradient(100deg,#CDA349,#F0DCA8 55%,#CDA349);-webkit-background-clip:text;background-clip:text;color:transparent">YOUNG BUILDERS</span></h2>
    <div data-reveal style="margin:30px auto 0;width:96px;height:1.5px;background:linear-gradient(90deg,rgba(205,163,73,0),#CDA349,rgba(205,163,73,0))"></div>
    <p data-reveal style="margin:30px auto 0;max-width:800px;font-size:clamp(16px,1.3vw,19px);line-height:1.76;color:#C9DBD3">These young founders represent the mindset India needs — curious, driven, structured, and courageous. Their journeys show the power of starting early and the strength of the solution-seeking mindset.</p>
  </div>
</section>

<section style="position:relative;padding:clamp(56px,7vw,92px) clamp(20px,5vw,48px);background:#FFFFFF">
  <div style="max-width:1240px;margin:0 auto">
    <div data-reveal style="display:flex;align-items:center;gap:16px;margin-bottom:34px">
      <span style="font-size:11px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;color:#8A6520">BACKED BY</span>
      <span style="flex:1;height:1px;background:linear-gradient(90deg,rgba(14,75,58,.18),rgba(14,75,58,0))"></span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px">
      <div data-reveal><div style="display:grid;place-items:center;height:104px;border-radius:20px;border:1px solid rgba(14,75,58,.10);background:#F5FAF7"><span style="font-family:'DM Serif Display',Georgia,serif;font-size:21px;letter-spacing:-.01em;color:#0E4B3A;text-align:center;padding:0 16px">The Economic Times</span></div></div>
      <div data-reveal><div style="display:grid;place-items:center;height:104px;border-radius:20px;border:1px solid rgba(14,75,58,.10);background:#F5FAF7"><span style="font-size:19px;font-weight:700;letter-spacing:-.01em;color:#0E4B3A;text-align:center;padding:0 16px">startupindia</span></div></div>
      <div data-reveal><div style="display:grid;place-items:center;height:104px;border-radius:20px;border:1px solid rgba(14,75,58,.10);background:#F5FAF7"><span style="font-size:22px;font-weight:800;letter-spacing:.16em;color:#0E4B3A;text-align:center;padding:0 16px">AIP</span></div></div>
      <div data-reveal><div style="display:grid;place-items:center;height:104px;border-radius:20px;border:1px solid rgba(14,75,58,.10);background:#F5FAF7"><span style="font-size:19px;font-weight:700;letter-spacing:.06em;color:#0E4B3A;text-align:center;padding:0 16px">AIC BIMTECH</span></div></div>
    </div>
  </div>
</section>
`;

export default function SuccessStories() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div
        className="ss-wrap"
        style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", color: '#071A14', background: '#ffffff', overflowX: 'clip' }}
      >
        <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML_TOP }} />
        <FoundersSection />
        <div dangerouslySetInnerHTML={{ __html: CONTENT_HTML_BOTTOM }} />
      </div>
      <PublicFooter />
    </div>
  );
}
