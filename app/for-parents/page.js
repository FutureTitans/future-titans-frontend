import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'For Parents | Youngpreneurs' };

const KEYFRAMES = `
@keyframes ypFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-14px,0)}}
@keyframes ypFloatSm{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-8px,0)}}
@keyframes ypDrift{0%{transform:translate3d(0,0,0)}50%{transform:translate3d(12px,-16px,0)}100%{transform:translate3d(0,0,0)}}
@keyframes ypSpin{to{transform:rotate(360deg)}}
@keyframes ypSpinR{to{transform:rotate(-360deg)}}
@keyframes ypPulse{0%,100%{opacity:.4;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}}
@keyframes ypGlow{0%,100%{opacity:.35}50%{opacity:.85}}
@keyframes ypShimmer{0%{transform:translateX(-140%) skewX(-18deg)}55%,100%{transform:translateX(260%) skewX(-18deg)}}
@keyframes ypTwinkle{0%,100%{opacity:.12}50%{opacity:.85}}
@keyframes ypBeam{0%,100%{opacity:.22}50%{opacity:.55}}
.fp-wrap ::selection{background:rgba(212,175,55,.28)}
.fp-wrap a{color:#0C4C3A;text-decoration:none}
@media (prefers-reduced-motion: reduce){.fp-wrap *{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}}
`;

const IMG = `<img src="/images/yp/for-parents-hero.png" alt="Future Titans students" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block"/>`;

const CONTENT_HTML = `
<section id="top" style="position:relative;overflow:hidden;padding:clamp(72px,9vw,120px) 0 clamp(56px,7vw,96px)">
  <div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(1000px 600px at 8% -10%,rgba(12,76,58,.08),rgba(255,255,255,0) 60%),radial-gradient(800px 500px at 96% 6%,rgba(212,175,55,.12),rgba(255,255,255,0) 62%)"></div>
  <div style="position:absolute;top:8%;right:2%;width:min(46vw,560px);height:min(46vw,560px);pointer-events:none;background-image:radial-gradient(circle,rgba(6,43,34,.16) 1px,transparent 1px);background-size:24px 24px;-webkit-mask-image:radial-gradient(circle at 60% 40%,#000,transparent 66%);mask-image:radial-gradient(circle at 60% 40%,#000,transparent 66%);opacity:.7"></div>
  <div style="position:absolute;bottom:-12%;left:-6%;width:340px;height:340px;border-radius:50%;border:1px solid rgba(212,175,55,.22);pointer-events:none"></div>

  <div style="position:relative;z-index:2;width:100%;max-width:1280px;margin:0 auto;padding:0 clamp(18px,3.4vw,44px);display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:clamp(28px,4vw,56px);align-items:center">

    <div>
      <h1 style="margin:0 0 22px;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(34px,4.9vw,64px);line-height:1.04;letter-spacing:-.025em;color:#062B22">Don't Let Your Child<br/><span style="position:relative;display:inline-block">
          <span style="background:linear-gradient(100deg,#D9B441,#9A711A 70%);-webkit-background-clip:text;background-clip:text;color:transparent">Fall Behind</span>
          <span style="position:absolute;left:0;right:0;bottom:.06em;height:.1em;border-radius:99px;background:linear-gradient(90deg,rgba(212,175,55,.85),rgba(212,175,55,.08));z-index:-1"></span>
        </span><br/>in the Age of AI.</h1>

      <p style="margin:0 0 24px;max-width:560px;font-size:16.5px;line-height:1.66;color:#41534D">As a parent, you want the absolute best for your teenager. But as the world rapidly accelerates with AI, automation, and constant innovation, a common fear is emerging: Will AI take away jobs? Will my child be replaced?</p>

      <div style="position:relative;max-width:580px;margin:0 0 24px;padding:19px 24px 19px 26px;border-radius:18px;background:linear-gradient(110deg,rgba(12,76,58,.06),rgba(212,175,55,.07));border:1px solid rgba(6,43,34,.09);box-shadow:0 18px 40px -28px rgba(6,43,34,.5);overflow:hidden">
        <span style="position:absolute;left:0;top:0;bottom:0;width:3px;background:linear-gradient(180deg,#F1D989,#D4AF37,rgba(212,175,55,.15))"></span>
        <span style="position:absolute;top:-30px;right:-20px;width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.2),rgba(255,255,255,0) 70%);animation:ypGlow 5s ease-in-out infinite"></span>
        <p style="position:relative;margin:0;font-family:'Sora',sans-serif;font-size:clamp(16px,1.35vw,18.5px);font-weight:600;line-height:1.5;color:#062B22">The hard truth is: AI won't replace people — <span style="text-decoration:underline;text-decoration-color:rgba(212,175,55,.95);text-decoration-thickness:2px;text-underline-offset:4px">people who know how to use AI</span> will replace those who don't.</p>
      </div>

      <p style="margin:0 0 30px;max-width:580px;font-size:16.5px;line-height:1.66;color:#41534D">At Future Titans by YoungPreneurs, we don't teach students to fear AI. We teach them to master it. We shift them from being passive consumers of technology to active creators. They learn to leverage AI as a powerful tool to build real-world solutions, completely future-proofing their careers.</p>

      <div style="margin-bottom:28px">
        <a href="/signup" style="position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:14px;padding:16px 20px 16px 28px;border-radius:999px;background:linear-gradient(100deg,#F1D989,#D4AF37 48%,#B8892B);color:#062B22;font-family:'Sora',sans-serif;font-size:clamp(14.5px,1.2vw,16.5px);font-weight:700;letter-spacing:-.01em;box-shadow:0 18px 40px -18px rgba(168,128,27,.75),inset 0 0 0 1px rgba(255,255,255,.4)">
          <span style="position:relative">Register Now — Secure Your Child's Spot</span>
          <span style="position:relative;display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:#062B22;color:#F1D989;font-size:15px;flex:0 0 auto">→</span>
          <span style="position:absolute;top:0;bottom:0;width:36%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.55),rgba(255,255,255,0));animation:ypShimmer 4.8s ease-in-out infinite"></span>
        </a>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:10px">
        <div style="display:inline-flex;align-items:center;gap:9px;padding:10px 16px;border-radius:14px;background:rgba(255,255,255,.75);border:1px solid rgba(6,43,34,.1);box-shadow:0 10px 26px -20px rgba(6,43,34,.7);backdrop-filter:blur(8px)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8801C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v6c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6l7-3z"/><path d="M9 12.2l2.3 2.3L15.6 10"/></svg>
          <span style="font-family:'Sora',sans-serif;font-size:13px;font-weight:600;color:#062B22;white-space:nowrap">Trusted by Parents</span>
        </div>
        <div style="display:inline-flex;align-items:center;gap:9px;padding:10px 16px;border-radius:14px;background:rgba(12,76,58,.05);border:1px solid rgba(6,43,34,.1);box-shadow:0 10px 26px -20px rgba(6,43,34,.7)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0C4C3A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.3S4.6 16 4.6 10.8A4.2 4.2 0 0112 8.3a4.2 4.2 0 017.4 2.5C19.4 16 12 20.3 12 20.3z"/></svg>
          <span style="font-family:'Sora',sans-serif;font-size:13px;font-weight:600;color:#062B22;white-space:nowrap">Loved by Students</span>
        </div>
        <div style="display:inline-flex;align-items:center;gap:9px;padding:10px 16px;border-radius:14px;background:rgba(255,255,255,.75);border:1px solid rgba(212,175,55,.35);box-shadow:0 10px 26px -20px rgba(168,128,27,.7)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8801C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14.5" r="5.2"/><path d="M9.2 4h5.6l-1.4 4.6h-2.8L9.2 4z"/></svg>
          <span style="font-family:'Sora',sans-serif;font-size:13px;font-weight:600;color:#062B22;white-space:nowrap">Recognized by Experts</span>
        </div>
      </div>
    </div>

    <div style="position:relative;width:100%;aspect-ratio:1/1.04;min-height:400px">
      <div style="position:absolute;inset:-3%;border-radius:50%;border:1px dashed rgba(9,59,45,.15);animation:ypSpin 70s linear infinite"></div>
      <div style="position:absolute;inset:7%;border-radius:50%;border:1px solid rgba(212,175,55,.3);animation:ypSpinR 95s linear infinite"></div>
      <div style="position:absolute;inset:12%;border-radius:50%;background:radial-gradient(circle at 50% 38%,rgba(12,76,58,.16),rgba(12,76,58,0) 68%);filter:blur(4px)"></div>

      <div style="position:absolute;inset:9% 9% 14% 9%;border-radius:47% 53% 41% 59%/53% 44% 56% 47%;overflow:hidden;background:linear-gradient(160deg,rgba(12,76,58,.1),rgba(212,175,55,.08));box-shadow:0 40px 80px -36px rgba(6,43,34,.55),inset 0 0 0 1px rgba(212,175,55,.38)">
        ${IMG}
        <div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(205deg,rgba(6,43,34,0) 42%,rgba(6,43,34,.5))"></div>
        <div style="position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px);background-size:44px 44px;opacity:.35;-webkit-mask-image:linear-gradient(200deg,#000,transparent 60%);mask-image:linear-gradient(200deg,#000,transparent 60%)"></div>
      </div>

      <div style="position:absolute;top:4%;right:2%;width:78px;height:78px;border-radius:50%;background:rgba(255,255,255,.78);backdrop-filter:blur(10px);border:1px solid rgba(212,175,55,.5);display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px -20px rgba(6,43,34,.6)">
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#A8801C" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.6l2.4 5.9 6.2.5-4.7 4.1 1.4 6.1-5.3-3.3-5.3 3.3 1.4-6.1L3.4 9l6.2-.5L12 2.6z"/></svg>
      </div>

      <div style="position:absolute;top:34%;left:-3%;width:88px;padding:12px;border-radius:16px;background:rgba(255,255,255,.82);backdrop-filter:blur(10px);border:1px solid rgba(6,43,34,.1);box-shadow:0 20px 44px -24px rgba(6,43,34,.6);animation:ypFloatSm 7s ease-in-out infinite">
        <svg width="64" height="30" viewBox="0 0 64 30" fill="none"><path d="M2 26C10 26 12 6 20 6s10 14 18 14 12-16 24-16" stroke="#0C4C3A" stroke-width="2" stroke-linecap="round"/><circle cx="62" cy="4" r="3.2" fill="#D4AF37"/></svg>
        <div style="margin-top:8px;height:4px;border-radius:99px;background:rgba(6,43,34,.08);overflow:hidden"><span style="display:block;width:72%;height:100%;border-radius:99px;background:linear-gradient(90deg,#D4AF37,#0C4C3A)"></span></div>
      </div>

      <div style="position:absolute;bottom:22%;right:-2%;width:56px;height:56px;border-radius:18px;background:linear-gradient(145deg,rgba(12,76,58,.95),rgba(6,43,34,.9));display:flex;align-items:center;justify-content:center;box-shadow:0 20px 40px -18px rgba(6,43,34,.8);animation:ypFloat 9s ease-in-out infinite">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F1D989" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8.4" stroke-dasharray="3 4"/><path d="M12 1.6v3M12 19.4v3M1.6 12h3M19.4 12h3"/></svg>
      </div>

      <div style="position:absolute;left:-2%;bottom:0;max-width:min(340px,88%);padding:20px 22px;border-radius:20px;background:linear-gradient(150deg,rgba(6,43,34,.96),rgba(12,76,58,.9));backdrop-filter:blur(12px);border:1px solid rgba(212,175,55,.3);box-shadow:0 34px 70px -28px rgba(6,43,34,.85);animation:ypFloat 11s ease-in-out infinite">
        <span style="display:block;font-family:'Sora',sans-serif;font-size:34px;line-height:.6;color:#D4AF37;margin-bottom:8px">"</span>
        <p style="margin:0 0 12px;font-size:14.8px;line-height:1.58;color:rgba(255,255,255,.95)">Behind every young child who believes in himself is a parent who believed first..</p>
        <div style="display:flex;align-items:center;gap:8px">
          <span style="width:18px;height:1.5px;background:linear-gradient(90deg,#D4AF37,rgba(212,175,55,0))"></span>
          <span style="font-family:'Sora',sans-serif;font-size:12.5px;font-weight:600;letter-spacing:.04em;color:#E8C766">— Matthew L. Jacobson</span>
        </div>
      </div>

      <span style="position:absolute;top:18%;left:14%;width:5px;height:5px;border-radius:50%;background:#D4AF37;animation:ypTwinkle 4s ease-in-out infinite"></span>
      <span style="position:absolute;top:62%;right:16%;width:4px;height:4px;border-radius:50%;background:#2FC6D6;animation:ypTwinkle 5.6s ease-in-out infinite"></span>
      <span style="position:absolute;bottom:14%;left:42%;width:6px;height:6px;border-radius:50%;background:rgba(12,76,58,.5);animation:ypTwinkle 6.4s ease-in-out infinite"></span>
    </div>
  </div>

  <div style="position:relative;z-index:2;display:flex;justify-content:center;margin-top:clamp(18px,3vw,38px)">
    <svg width="20" height="72" viewBox="0 0 20 72" fill="none"><path d="M10 0v46" stroke="rgba(6,43,34,.18)" stroke-width="1.4" stroke-dasharray="4 5"/><circle cx="10" cy="54" r="5" fill="none" stroke="#D4AF37" stroke-width="1.4"/><circle cx="10" cy="54" r="2" fill="#D4AF37"/><path d="M10 62v10" stroke="rgba(6,43,34,.12)" stroke-width="1.4" stroke-dasharray="4 5"/></svg>
  </div>
</section>

<section style="position:relative;padding:clamp(24px,4vw,48px) 0 clamp(50px,7vw,90px)">
  <div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(760px 420px at 100% 30%,rgba(12,76,58,.06),rgba(255,255,255,0) 65%)"></div>
  <div style="position:relative;z-index:2;width:100%;max-width:1280px;margin:0 auto;padding:0 clamp(18px,3.4vw,44px)">

    <div style="display:flex;align-items:flex-end;gap:clamp(16px,3vw,40px);flex-wrap:wrap;margin-bottom:clamp(26px,3.5vw,44px)">
      <h2 style="margin:0;max-width:760px;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(25px,3.5vw,44px);line-height:1.12;letter-spacing:-.015em;color:#062B22">WHY SUPPORT YOUR CHILD'S JOURNEY?</h2>
      <div style="flex:1 1 140px;min-width:120px;display:flex;align-items:center;gap:10px;padding-bottom:10px">
        <span style="flex:1;height:1px;background:linear-gradient(90deg,rgba(6,43,34,.16),rgba(212,175,55,.75))"></span>
        <span style="width:9px;height:9px;border-radius:50%;background:#D4AF37;box-shadow:0 0 12px rgba(212,175,55,.8)"></span>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(16px,1.8vw,24px)">

      <div>
        <div style="position:relative;height:100%;overflow:hidden;padding:26px 24px 28px;border-radius:24px;background:rgba(255,255,255,.9);border:1px solid rgba(6,43,34,.09);box-shadow:0 26px 60px -40px rgba(6,43,34,.8)">
          <span style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#D4AF37,rgba(212,175,55,0))"></span>
          <span style="position:absolute;top:-40px;right:-40px;width:170px;height:170px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.16),rgba(255,255,255,0) 70%)"></span>
          <span style="position:absolute;bottom:14px;right:14px;width:110px;height:70px;background-image:radial-gradient(circle,rgba(6,43,34,.18) 1px,transparent 1px);background-size:14px 14px;opacity:.5"></span>
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:17px;background:linear-gradient(150deg,rgba(212,175,55,.2),rgba(212,175,55,.06));border:1px solid rgba(212,175,55,.45);margin-bottom:20px">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#A8801C" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.4"/><path d="M8.6 15.4l6.8-6.8M15.4 8.6h-5m5 0v5"/></svg>
          </div>
          <h3 style="position:relative;margin:0 0 12px;font-family:'Sora',sans-serif;font-weight:600;font-size:clamp(19px,1.6vw,22px);line-height:1.2;letter-spacing:-.015em;color:#062B22">A Definitive Edge</h3>
          <p style="position:relative;margin:0;font-size:15.4px;line-height:1.62;color:#41534D">Future Titans isn't just a competition — it's a proven launchpad. Your child learns skills that schools don't teach but top universities and employers desperately look for.</p>
        </div>
      </div>

      <div>
        <div style="position:relative;height:100%;overflow:hidden;padding:26px 24px 28px;border-radius:24px;background:linear-gradient(160deg,#0C4C3A,#062B22);border:1px solid rgba(212,175,55,.26);box-shadow:0 30px 60px -34px rgba(6,43,34,.9)">
          <span style="position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.14) 1px,transparent 1px);background-size:22px 22px;opacity:.5;-webkit-mask-image:radial-gradient(circle at 80% 0%,#000,transparent 70%);mask-image:radial-gradient(circle at 80% 0%,#000,transparent 70%)"></span>
          <span style="position:absolute;bottom:-60px;left:-30px;width:200px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(47,198,214,.22),rgba(255,255,255,0) 70%);animation:ypGlow 7s ease-in-out infinite"></span>
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:17px;background:rgba(255,255,255,.08);border:1px solid rgba(47,198,214,.45);margin-bottom:20px;box-shadow:inset 0 0 20px rgba(47,198,214,.14)">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7FE3EC" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.9l8.3 4.6v9L12 21.1 3.7 16.5v-9L12 2.9z"/><path d="M3.7 7.5L12 12.1l8.3-4.6M12 12.1v9"/></svg>
          </div>
          <h3 style="position:relative;margin:0 0 12px;font-family:'Sora',sans-serif;font-weight:600;font-size:clamp(19px,1.6vw,22px);line-height:1.2;letter-spacing:-.015em;color:#FFFFFF">From Consumers<br/>to Creators</h3>
          <p style="position:relative;margin:0;font-size:15.4px;line-height:1.62;color:rgba(255,255,255,.86)">They will stop passively consuming content and start actively building real solutions, discovering what they're truly capable of achieving.</p>
        </div>
      </div>

      <div>
        <div style="position:relative;height:100%;overflow:hidden;padding:26px 24px 28px;border-radius:24px;background:linear-gradient(170deg,rgba(255,255,255,.95),rgba(12,76,58,.06));border:1px solid rgba(6,43,34,.09);box-shadow:0 26px 60px -40px rgba(6,43,34,.8)">
          <span style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,rgba(12,76,58,0),#0C4C3A,rgba(212,175,55,.8))"></span>
          <svg style="position:absolute;bottom:-6px;left:-10px;right:-10px;width:118%;height:110px;opacity:.55" viewBox="0 0 320 110" fill="none" preserveAspectRatio="none"><path d="M-5 100C60 100 70 42 130 42s70 34 120 34 80-46 80-46" stroke="#0C4C3A" stroke-width="1.6" stroke-linecap="round"/><circle cx="130" cy="42" r="3.4" fill="#D4AF37"/><circle cx="250" cy="76" r="3.4" fill="#2FC6D6"/></svg>
          <div style="position:relative;display:flex;align-items:center;justify-content:center;width:54px;height:54px;border-radius:17px;background:linear-gradient(150deg,rgba(12,76,58,.13),rgba(12,76,58,.04));border:1px solid rgba(12,76,58,.28);margin-bottom:20px">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0C4C3A" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M15.8 8.2l-2.3 5.3-5.3 2.3 2.3-5.3 5.3-2.3z"/></svg>
          </div>
          <h3 style="position:relative;margin:0 0 12px;font-family:'Sora',sans-serif;font-weight:600;font-size:clamp(19px,1.6vw,22px);line-height:1.2;letter-spacing:-.015em;color:#062B22">Future-Proofing<br/>their Career</h3>
          <p style="position:relative;margin:0;font-size:15.4px;line-height:1.62;color:#41534D">It's a journey that nurtures vision, courage, and tech-fluency (including AI), preparing them to lead confidently in any field they choose.</p>
        </div>
      </div>
    </div>

    <div style="position:relative;margin-top:clamp(20px,2.6vw,34px);overflow:hidden;border-radius:clamp(22px,2.4vw,32px);background:radial-gradient(900px 500px at 88% 8%,rgba(12,76,58,.9),rgba(6,43,34,1) 62%),linear-gradient(150deg,#0C4C3A,#062B22);border:1px solid rgba(212,175,55,.26);box-shadow:0 50px 90px -50px rgba(6,43,34,.95)">
      <div style="position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(255,255,255,.1) 1px,transparent 1px);background-size:26px 26px;opacity:.55;-webkit-mask-image:radial-gradient(circle at 20% 0%,#000,transparent 72%);mask-image:radial-gradient(circle at 20% 0%,#000,transparent 72%)"></div>
      <div style="position:absolute;top:-80px;left:-60px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.2),rgba(255,255,255,0) 70%);animation:ypGlow 9s ease-in-out infinite"></div>
      <span style="position:absolute;top:18%;right:28%;width:5px;height:5px;border-radius:50%;background:#D4AF37;animation:ypTwinkle 5s ease-in-out infinite"></span>
      <span style="position:absolute;bottom:26%;right:12%;width:4px;height:4px;border-radius:50%;background:#7FE3EC;animation:ypTwinkle 6.8s ease-in-out infinite"></span>

      <div style="position:relative;z-index:2;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(24px,3.4vw,48px);align-items:center;padding:clamp(28px,3.6vw,56px) clamp(22px,3.4vw,52px) clamp(18px,2.4vw,34px)">
        <div>
          <p style="margin:0 0 8px;font-family:'Sora',sans-serif;font-size:13.5px;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.62)">This is not a one-day competition.</p>
          <h3 style="margin:0 0 22px;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(28px,3.8vw,50px);line-height:1.06;letter-spacing:-.025em;background:linear-gradient(100deg,#F6E3A6,#D4AF37 60%,#C09428);-webkit-background-clip:text;background-clip:text;color:transparent">It's a year-long journey.</h3>
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:rgba(255,255,255,.84)">Most programs drop your child into a weekend event and call it "entrepreneurship." YoungPreneurs is built differently. Over 12 months, your child is continuously learning, building, iterating, and growing — guided by world-class mentors, tracked by India's first entrepreneurial mindset index (ESI), and supported by a community of equally driven peers.</p>
          <p style="margin:0;font-size:16px;line-height:1.7;color:rgba(255,255,255,.84)">Every skill compounds. Every session adds to the last. By the time your child reaches the national stage, they don't just have a pitch —<br/><span style="font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(19px,1.9vw,26px);letter-spacing:-.015em;color:#F1D989">they have a transformation.</span></p>
        </div>

        <div style="position:relative;width:100%;max-width:400px;margin:0 auto;aspect-ratio:1/1">
          <div style="position:absolute;inset:0;border-radius:50%;border:1px dashed rgba(212,175,55,.32);animation:ypSpin 80s linear infinite"></div>
          <div style="position:absolute;inset:11%;border-radius:50%;border:1px solid rgba(255,255,255,.14);animation:ypSpinR 60s linear infinite">
            <span style="position:absolute;top:-4px;left:50%;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:#D4AF37;box-shadow:0 0 14px rgba(212,175,55,.9)"></span>
            <span style="position:absolute;bottom:8%;right:-3px;width:6px;height:6px;border-radius:50%;background:#7FE3EC;box-shadow:0 0 12px rgba(127,227,236,.8)"></span>
          </div>
          <svg style="position:absolute;inset:4%" viewBox="0 0 100 100" fill="none"><circle cx="50" cy="50" r="44" stroke="url(#ypArc)" stroke-width="2.4" stroke-linecap="round" transform="rotate(-90 50 50)"/><defs><linearGradient id="ypArc" x1="0" y1="0" x2="100" y2="100"><stop offset="0" stop-color="#F6E3A6"/><stop offset="1" stop-color="#2FC6D6"/></linearGradient></defs></svg>
          <div style="position:absolute;inset:19%;border-radius:50%;overflow:hidden;background:linear-gradient(160deg,rgba(255,255,255,.12),rgba(12,76,58,.4));box-shadow:0 30px 60px -26px rgba(0,0,0,.7),inset 0 0 0 1px rgba(212,175,55,.35)">
            ${IMG}
            <div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(6,43,34,.1),rgba(6,43,34,.55))"></div>
          </div>
          <div style="position:absolute;bottom:2%;left:-2%;display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.1);backdrop-filter:blur(10px);border:1px solid rgba(212,175,55,.4);animation:ypFloatSm 8s ease-in-out infinite">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F1D989" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2l6.6 3v5.4c0 4.1-2.8 7.3-6.6 8.4-3.8-1.1-6.6-4.3-6.6-8.4V6.2l6.6-3z"/><path d="M12 8.6v4.8M9.6 11h4.8"/></svg>
          </div>
        </div>
      </div>

      <div style="position:relative;z-index:2;padding:0 clamp(22px,3.4vw,52px) clamp(26px,3vw,40px)">
        <div style="position:relative;height:36px">
          <span style="position:absolute;top:50%;left:0;right:0;height:1px;margin-top:-.5px;background:linear-gradient(90deg,rgba(212,175,55,.1),rgba(212,175,55,.65),rgba(127,227,236,.5))"></span>
          <span style="position:absolute;top:50%;left:6%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:radial-gradient(circle,#F6E3A6,#C09428);box-shadow:0 0 0 4px rgba(212,175,55,.14),0 0 16px rgba(212,175,55,.6)"></span>
          <span style="position:absolute;top:50%;left:28%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:radial-gradient(circle,#F6E3A6,#C09428);box-shadow:0 0 0 4px rgba(212,175,55,.14),0 0 16px rgba(212,175,55,.6)"></span>
          <span style="position:absolute;top:50%;left:50%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:radial-gradient(circle,#F6E3A6,#C09428);box-shadow:0 0 0 4px rgba(212,175,55,.14),0 0 16px rgba(212,175,55,.6)"></span>
          <span style="position:absolute;top:50%;left:72%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:radial-gradient(circle,#F6E3A6,#C09428);box-shadow:0 0 0 4px rgba(212,175,55,.14),0 0 16px rgba(212,175,55,.6)"></span>
          <span style="position:absolute;top:50%;left:94%;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:radial-gradient(circle,#F6E3A6,#C09428);box-shadow:0 0 0 4px rgba(212,175,55,.14),0 0 16px rgba(212,175,55,.6)"></span>
        </div>
      </div>
    </div>
  </div>
</section>

<section style="position:relative;padding:clamp(40px,6vw,86px) 0 clamp(50px,7vw,96px);overflow:hidden">
  <div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(900px 500px at 12% 100%,rgba(212,175,55,.1),rgba(255,255,255,0) 62%)"></div>
  <div style="position:absolute;top:6%;left:50%;width:min(70vw,860px);height:min(70vw,860px);margin-left:-35vw;border-radius:50%;border:1px solid rgba(6,43,34,.06);pointer-events:none"></div>

  <div style="position:relative;z-index:2;width:100%;max-width:1280px;margin:0 auto;padding:0 clamp(18px,3.4vw,44px)">
    <div style="max-width:640px;margin:0 auto clamp(34px,4.4vw,58px);text-align:center">
      <div style="display:inline-flex;align-items:center;gap:8px;margin-bottom:18px">
        <span style="width:26px;height:1px;background:linear-gradient(90deg,rgba(212,175,55,0),#D4AF37)"></span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8801C" stroke-width="1.8" stroke-linecap="round"><path d="M12 3.4v3M12 17.6v3M3.4 12h3M17.6 12h3M6.2 6.2l2.1 2.1M15.7 15.7l2.1 2.1M17.8 6.2l-2.1 2.1M8.3 15.7l-2.1 2.1"/></svg>
        <span style="width:26px;height:1px;background:linear-gradient(90deg,#D4AF37,rgba(212,175,55,0))"></span>
      </div>
      <h2 style="margin:0;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(30px,4.3vw,56px);line-height:1.06;letter-spacing:-.03em;color:#062B22">The Future They<br/>Build Today</h2>
    </div>

    <div style="position:relative">
      <svg style="position:absolute;top:44px;left:0;width:100%;height:120px;pointer-events:none" viewBox="0 0 1200 120" fill="none" preserveAspectRatio="none"><path d="M20 78C180 78 200 22 380 22s210 62 400 62 300-54 400-54" stroke="rgba(212,175,55,.55)" stroke-width="1.6" stroke-linecap="round"/></svg>

      <div style="position:relative;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:clamp(14px,1.6vw,22px)">

        <div style="padding-top:0">
          <div style="position:relative;overflow:hidden;padding:24px 22px 22px;border-radius:22px;background:rgba(255,255,255,.92);border:1px solid rgba(6,43,34,.09);box-shadow:0 30px 60px -44px rgba(6,43,34,.85);backdrop-filter:blur(8px)">
            <span style="position:absolute;top:-30px;right:-30px;width:130px;height:130px;border-radius:50%;background:radial-gradient(circle,rgba(212,175,55,.14),rgba(255,255,255,0) 70%)"></span>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
              <span style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:13px;background:rgba(12,76,58,.07);border:1px solid rgba(12,76,58,.16)">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0C4C3A" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="M12 7.4V12l3.2 2"/></svg>
              </span>
              <span style="width:9px;height:9px;border-radius:50%;background:#D4AF37;box-shadow:0 0 0 4px rgba(212,175,55,.15)"></span>
            </div>
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(30px,3.4vw,44px);line-height:1;letter-spacing:-.03em;background:linear-gradient(100deg,#D9B441,#9A711A 75%);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px">12 Months</div>
            <div style="font-size:14.6px;line-height:1.5;font-weight:500;color:#41534D">Of Transformative<br/>Learning</div>
            <div style="margin-top:18px;height:4px;border-radius:99px;background:rgba(6,43,34,.07);overflow:hidden"><span style="display:block;width:100%;height:100%;border-radius:99px;background:linear-gradient(90deg,#0C4C3A,#D4AF37)"></span></div>
          </div>
        </div>

        <div style="padding-top:clamp(0px,2.4vw,34px)">
          <div style="position:relative;overflow:hidden;padding:24px 22px 22px;border-radius:22px;background:rgba(255,255,255,.92);border:1px solid rgba(212,175,55,.3);box-shadow:0 30px 60px -44px rgba(168,128,27,.8);backdrop-filter:blur(8px)">
            <span style="position:absolute;bottom:-40px;left:-30px;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle,rgba(12,76,58,.1),rgba(255,255,255,0) 70%)"></span>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
              <span style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:13px;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.35)">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#A8801C" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8.6l8-4 8 4-8 4-8-4z"/><path d="M4 13l8 4 8-4M4 17.4l8 4 8-4"/></svg>
              </span>
              <span style="width:9px;height:9px;border-radius:50%;background:#0C4C3A;box-shadow:0 0 0 4px rgba(12,76,58,.13)"></span>
            </div>
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(30px,3.4vw,44px);line-height:1;letter-spacing:-.03em;background:linear-gradient(100deg,#D9B441,#9A711A 75%);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px">50+</div>
            <div style="font-size:14.6px;line-height:1.5;font-weight:500;color:#41534D">Hands-on Workshops<br/>&amp; Mentorship Hours</div>
            <div style="margin-top:18px;height:4px;border-radius:99px;background:rgba(6,43,34,.07);overflow:hidden"><span style="display:block;width:82%;height:100%;border-radius:99px;background:linear-gradient(90deg,#D4AF37,#0C4C3A)"></span></div>
          </div>
        </div>

        <div style="padding-top:clamp(0px,1vw,14px)">
          <div style="position:relative;overflow:hidden;padding:24px 22px 22px;border-radius:22px;background:linear-gradient(160deg,#0C4C3A,#062B22);border:1px solid rgba(212,175,55,.28);box-shadow:0 34px 64px -40px rgba(6,43,34,.95)">
            <span style="position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,.12) 1px,transparent 1px);background-size:20px 20px;opacity:.5;-webkit-mask-image:radial-gradient(circle at 90% 10%,#000,transparent 70%);mask-image:radial-gradient(circle at 90% 10%,#000,transparent 70%)"></span>
            <div style="position:relative;display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
              <span style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:13px;background:rgba(255,255,255,.08);border:1px solid rgba(212,175,55,.4)">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#F1D989" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1.2" fill="#F1D989"/></svg>
              </span>
              <span style="width:9px;height:9px;border-radius:50%;background:#D4AF37;box-shadow:0 0 12px rgba(212,175,55,.9)"></span>
            </div>
            <div style="position:relative;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(30px,3.4vw,44px);line-height:1;letter-spacing:-.03em;color:#F1D989;margin-bottom:12px">1 Goal</div>
            <div style="position:relative;font-size:14.6px;line-height:1.5;font-weight:500;color:rgba(255,255,255,.85)">Confident, Future-<br/>Ready Leaders</div>
            <div style="position:relative;margin-top:18px;height:4px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden"><span style="display:block;width:100%;height:100%;border-radius:99px;background:linear-gradient(90deg,#F1D989,#7FE3EC)"></span></div>
          </div>
        </div>

        <div style="padding-top:clamp(0px,3vw,42px)">
          <div style="position:relative;overflow:hidden;padding:24px 22px 22px;border-radius:22px;background:rgba(255,255,255,.92);border:1px solid rgba(6,43,34,.09);box-shadow:0 30px 60px -44px rgba(6,43,34,.85);backdrop-filter:blur(8px)">
            <span style="position:absolute;top:-40px;right:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,rgba(47,198,214,.16),rgba(255,255,255,0) 70%)"></span>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px">
              <span style="display:flex;align-items:center;justify-content:center;width:42px;height:42px;border-radius:13px;background:rgba(12,76,58,.07);border:1px solid rgba(12,76,58,.16)">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#0C4C3A" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.4" cy="12" r="2.6"/><circle cx="18.6" cy="6.4" r="2.6"/><circle cx="18.6" cy="17.6" r="2.6"/><path d="M7.8 10.9l8.4-3.4M7.8 13.1l8.4 3.4"/></svg>
              </span>
              <span style="width:9px;height:9px;border-radius:50%;background:#2FC6D6;box-shadow:0 0 0 4px rgba(47,198,214,.15)"></span>
            </div>
            <div style="font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(26px,3vw,40px);line-height:1;letter-spacing:-.03em;background:linear-gradient(100deg,#D9B441,#9A711A 75%);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:12px">∞ Possibilities</div>
            <div style="font-size:14.6px;line-height:1.5;font-weight:500;color:#41534D">Limitless Impact They<br/>Can Create</div>
            <div style="margin-top:18px;height:4px;border-radius:99px;background:rgba(6,43,34,.07);overflow:hidden"><span style="display:block;width:100%;height:100%;border-radius:99px;background:linear-gradient(90deg,#2FC6D6,#D4AF37)"></span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section style="position:relative;overflow:hidden;margin-top:clamp(10px,2vw,26px);border-radius:clamp(26px,3vw,44px) clamp(26px,3vw,44px) 0 0;background:radial-gradient(1100px 620px at 78% 6%,rgba(12,76,58,.95),rgba(6,43,34,1) 60%),linear-gradient(160deg,#0C4C3A,#052019);border-top:1px solid rgba(212,175,55,.32);padding:clamp(48px,6.4vw,100px) 0 clamp(52px,6.4vw,96px)">
  <div style="position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(255,255,255,.1) 1px,transparent 1px);background-size:28px 28px;opacity:.5;-webkit-mask-image:radial-gradient(1000px 600px at 20% 10%,#000,transparent 75%);mask-image:radial-gradient(1000px 600px at 20% 10%,#000,transparent 75%)"></div>
  <div style="position:absolute;top:-1px;left:0;right:0;height:120px;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.14),rgba(255,255,255,0))"></div>
  <span style="position:absolute;top:14%;left:8%;width:5px;height:5px;border-radius:50%;background:#D4AF37;animation:ypTwinkle 4.6s ease-in-out infinite"></span>
  <span style="position:absolute;top:36%;left:26%;width:4px;height:4px;border-radius:50%;background:#7FE3EC;animation:ypTwinkle 6.2s ease-in-out infinite"></span>
  <span style="position:absolute;bottom:18%;left:14%;width:6px;height:6px;border-radius:50%;background:rgba(212,175,55,.7);animation:ypTwinkle 5.4s ease-in-out infinite"></span>

  <div style="position:relative;z-index:2;width:100%;max-width:1280px;margin:0 auto;padding:0 clamp(18px,3.4vw,44px);display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:clamp(30px,4.4vw,64px);align-items:center">

    <div>
      <h2 style="margin:0 0 26px;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(28px,3.9vw,50px);line-height:1.1;letter-spacing:-.028em;color:#FFFFFF">Don't let your child<br/>miss this opportunity<br/>to shine, learn,<br/>and grow into the<br/><span style="position:relative;display:inline-block"><span style="background:linear-gradient(100deg,#F6E3A6,#D4AF37 55%,#C09428);-webkit-background-clip:text;background-clip:text;color:transparent">leader of tomorrow.</span><span style="position:absolute;left:0;right:0;bottom:.02em;height:2px;background:linear-gradient(90deg,#D4AF37,rgba(212,175,55,0))"></span></span></h2>

      <div style="display:flex;align-items:center;gap:10px;margin-bottom:34px">
        <span style="width:26px;height:1px;background:linear-gradient(90deg,#D4AF37,rgba(212,175,55,.1))"></span>
        <span style="font-family:'Sora',sans-serif;font-size:14px;font-weight:600;letter-spacing:.05em;color:#E8C766">— YoungPreneurs Competition Team</span>
      </div>

      <div style="display:flex;flex-wrap:wrap;gap:14px">
        <a href="/signup" style="position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:11px;padding:16px 30px;border-radius:999px;background:linear-gradient(100deg,#F1D989,#D4AF37 48%,#B8892B);color:#062B22;font-family:'Sora',sans-serif;font-size:15.5px;font-weight:700;box-shadow:0 22px 44px -18px rgba(212,175,55,.6),inset 0 0 0 1px rgba(255,255,255,.4)">
          <span style="position:relative">Register Now</span>
          <span style="position:relative">→</span>
          <span style="position:absolute;top:0;bottom:0;width:36%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.55),rgba(255,255,255,0));animation:ypShimmer 5.2s ease-in-out infinite"></span>
        </a>
        <a href="/contact" style="display:inline-flex;align-items:center;gap:11px;padding:16px 30px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.34);color:#FFFFFF;font-family:'Sora',sans-serif;font-size:15.5px;font-weight:600;backdrop-filter:blur(10px)">Talk to Our Team</a>
      </div>
    </div>

    <div style="position:relative;width:100%;max-width:460px;margin:0 auto;aspect-ratio:1/1.16;min-height:400px">
      <div style="position:absolute;inset:8% 6% 6% 6%;border-radius:50%;border:1px solid rgba(212,175,55,.22)"></div>
      <div style="position:absolute;inset:20% 18% 18% 18%;border-radius:50%;border:1px solid rgba(255,255,255,.1)"></div>
      <div style="position:absolute;left:50%;bottom:0;width:62%;height:78%;margin-left:-31%;background:linear-gradient(0deg,rgba(212,175,55,.3),rgba(212,175,55,0));-webkit-mask-image:linear-gradient(0deg,#000,transparent);mask-image:linear-gradient(0deg,#000,transparent);animation:ypBeam 7s ease-in-out infinite;pointer-events:none"></div>

      <div style="position:absolute;inset:7% 13% 7% 13%;border-radius:999px 999px 26px 26px;overflow:hidden;background:linear-gradient(170deg,rgba(255,255,255,.14),rgba(12,76,58,.5));box-shadow:0 46px 90px -34px rgba(0,0,0,.75),inset 0 0 0 1px rgba(212,175,55,.42)">
        ${IMG}
        <div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(6,43,34,.14) 30%,rgba(6,43,34,.72))"></div>
        <div style="position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(0deg,rgba(212,175,55,.16) 1px,transparent 1px);background-size:100% 30px;opacity:.5;-webkit-mask-image:linear-gradient(0deg,#000,transparent 55%);mask-image:linear-gradient(0deg,#000,transparent 55%)"></div>
      </div>

      <div style="position:absolute;top:12%;left:-1%;display:flex;align-items:center;justify-content:center;width:58px;height:58px;border-radius:18px;background:rgba(255,255,255,.1);backdrop-filter:blur(12px);border:1px solid rgba(212,175,55,.42);box-shadow:0 22px 44px -22px rgba(0,0,0,.7);animation:ypFloatSm 8.4s ease-in-out infinite">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F1D989" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.3" fill="#F1D989"/></svg>
      </div>
      <div style="position:absolute;top:44%;right:-2%;display:flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.08);backdrop-filter:blur(12px);border:1px solid rgba(127,227,236,.45);box-shadow:0 22px 44px -22px rgba(0,0,0,.7);animation:ypFloat 10.5s ease-in-out infinite">
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#7FE3EC" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18.6c4-1 5.4-10.4 8.4-10.4 2.6 0 3 5.4 5.6 5.4 1.4 0 2-1.6 2-1.6"/><path d="M15.6 5.2h4.6v4.6"/></svg>
      </div>
      <div style="position:absolute;bottom:6%;left:4%;display:flex;align-items:center;gap:10px;padding:11px 14px;border-radius:14px;background:rgba(6,43,34,.62);backdrop-filter:blur(12px);border:1px solid rgba(212,175,55,.34);box-shadow:0 22px 44px -22px rgba(0,0,0,.8)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F1D989" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.4l2.5 5.1 5.6.8-4.1 4 1 5.6-5-2.7-5 2.7 1-5.6-4.1-4 5.6-.8L12 3.4z"/></svg>
        <span style="display:flex;gap:4px">
          <span style="width:22px;height:4px;border-radius:99px;background:#D4AF37"></span>
          <span style="width:22px;height:4px;border-radius:99px;background:#D4AF37"></span>
          <span style="width:22px;height:4px;border-radius:99px;background:rgba(255,255,255,.28)"></span>
        </span>
      </div>
    </div>
  </div>
</section>
`;

export default function ForParents() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div
        className="fp-wrap"
        style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: '#22322D', overflowX: 'clip', background: '#ffffff' }}
        dangerouslySetInnerHTML={{ __html: CONTENT_HTML }}
      />
      <PublicFooter />
    </div>
  );
}
