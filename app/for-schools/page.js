import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'For Schools | Youngpreneurs' };

const KEYFRAMES = `
:root{--gold:#C9A227;--gold-rich:#B8901F;--gold-soft:#E1C76A;--g-deep:#0A2E24;--g:#0F3B2E;--g-surf:#164A3A;--ink:#111111;--muted:#263238;--cream:#F8F5EE;--mist:rgba(15,59,46,0.10);--amb:running}
@keyframes ypUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}
@keyframes ypFade{from{opacity:0}to{opacity:1}}
@keyframes ypSpin{to{transform:rotate(360deg)}}
@keyframes ypSpinRev{to{transform:rotate(-360deg)}}
@keyframes ypFloat{0%,100%{transform:translateY(-12px)}50%{transform:translateY(14px)}}
@keyframes ypFloat2{0%,100%{transform:translate(0,10px)}50%{transform:translate(-12px,-12px)}}
@keyframes ypGlow{0%,100%{opacity:.5;transform:scale(.95)}50%{opacity:1;transform:scale(1.05)}}
@keyframes ypShimmer{0%{background-position:-160% 0}100%{background-position:260% 0}}
@keyframes ypRing{0%{transform:scale(.8);opacity:.5}70%{opacity:0}100%{transform:scale(1.55);opacity:0}}
@keyframes ypCue{0%{transform:translateY(-70%);opacity:0}35%{opacity:1}100%{transform:translateY(130%);opacity:0}}
@keyframes ypDrift{to{background-position:280px 280px}}
.fs-wrap [data-reveal]{opacity:1 !important;transform:none !important}
.fs-wrap a{color:#0F3B2E;text-decoration:none}
.fs-wrap ::selection{background:rgba(201,162,39,.28)}
@media (prefers-reduced-motion: reduce){.fs-wrap *{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important}}
`;

const CONTENT_HTML = `
<section style="position:relative;isolation:isolate;overflow:hidden;display:flex;align-items:center;min-height:min(100svh,940px);padding:clamp(120px,15vh,180px) clamp(20px,5vw,80px) clamp(96px,14vh,170px);background:linear-gradient(155deg,#0A2E24 0%,#0F3B2E 52%,#123F31 100%)">
  <div aria-hidden="true" style="position:absolute;inset:0;background-image:radial-gradient(rgba(225,199,106,.16) 1px,transparent 1px);background-size:28px 28px;animation:ypDrift 90s linear infinite;mask-image:radial-gradient(120% 90% at 30% 20%,#000 20%,transparent 75%);-webkit-mask-image:radial-gradient(120% 90% at 30% 20%,#000 20%,transparent 75%)"></div>
  <div aria-hidden="true" style="position:absolute;top:-12%;left:-8%;width:44vw;height:44vw;max-width:620px;max-height:620px;border-radius:50%;background:radial-gradient(circle,rgba(22,74,58,.85),rgba(10,46,36,0) 68%);filter:blur(14px)"></div>
  <div aria-hidden="true" style="position:absolute;bottom:-18%;right:-6%;width:38vw;height:38vw;max-width:520px;max-height:520px;border-radius:50%;background:radial-gradient(circle,rgba(201,162,39,.22),rgba(201,162,39,0) 66%);filter:blur(22px)"></div>
  <div aria-hidden="true" style="position:absolute;left:0;right:0;bottom:-1px;height:clamp(90px,14vh,180px);background:linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.05) 45%,#FFFFFF 100%)"></div>

  <div style="position:relative;z-index:2;display:flex;flex-wrap:wrap;align-items:center;gap:clamp(36px,5vw,76px);width:100%;max-width:1320px;margin:0 auto">
    <div style="flex:1 1 540px;min-width:min(100%,300px)">
      <svg aria-hidden="true" viewBox="0 0 64 44" width="58" height="40" style="display:block;margin-bottom:clamp(18px,2.6vw,30px)">
        <path d="M0 44V26C0 11.6 9.4 2 24 0v8C15.4 9.6 10.6 15.2 10.4 22H24v22H0Zm40 0V26C40 11.6 49.4 2 64 0v8c-8.6 1.6-13.4 7.2-13.6 14H64v22H40Z" fill="url(#ypQuote)" opacity=".9"></path>
        <defs><linearGradient id="ypQuote" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E1C76A"></stop><stop offset="1" stop-color="#B8901F"></stop></linearGradient></defs>
      </svg>
      <h1 style="font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(34px,6.2vw,90px);line-height:1.03;letter-spacing:-.03em;color:#FFFFFF">
        <span style="display:block">THE FUTURE OF A NATION</span>
        <span style="display:block">IS BUILT INSIDE</span>
        <span style="display:block;background-image:linear-gradient(96deg,#E1C76A 12%,#C9A227 58%,#E1C76A 96%);-webkit-background-clip:text;background-clip:text;color:transparent">ITS CLASSROOMS.</span>
      </h1>
      <div style="display:flex;align-items:center;gap:clamp(14px,2vw,22px);margin-top:clamp(26px,3.6vw,44px)">
        <span aria-hidden="true" style="display:block;width:clamp(48px,7vw,104px);height:1px;background:linear-gradient(90deg,rgba(225,199,106,0),#E1C76A)"></span>
        <span style="font-weight:600;font-size:clamp(12px,1.15vw,15px);letter-spacing:.2em;color:#E1C76A">— DR. A.P.J. ABDUL KALAM</span>
      </div>
      <div aria-hidden="true" style="display:flex;align-items:center;gap:14px;margin-top:clamp(40px,6vh,72px)">
        <span style="position:relative;display:block;width:1px;height:56px;overflow:hidden;background:rgba(225,199,106,.2)">
          <span style="position:absolute;left:0;top:0;width:1px;height:22px;background:linear-gradient(180deg,rgba(225,199,106,0),#E1C76A);animation:ypCue 2.6s ease-in-out infinite"></span>
        </span>
        <span style="display:block;width:6px;height:6px;border-radius:50%;background:#C9A227;box-shadow:0 0 0 5px rgba(201,162,39,.14)"></span>
      </div>
    </div>

    <div aria-hidden="true" style="flex:1 1 420px;min-width:min(100%,280px);max-width:600px;position:relative;aspect-ratio:1/1">
      <div style="position:absolute;inset:6%;border-radius:50%;background:radial-gradient(circle at 50% 50%,rgba(201,162,39,.26),rgba(201,162,39,0) 64%);filter:blur(8px);animation:ypGlow 9s ease-in-out infinite"></div>
      <svg viewBox="0 0 400 400" style="position:absolute;inset:0;width:100%;height:100%">
        <defs>
          <linearGradient id="ypG1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E1C76A"></stop><stop offset="1" stop-color="#B8901F" stop-opacity=".2"></stop></linearGradient>
          <linearGradient id="ypG2" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#E1C76A" stop-opacity=".05"></stop><stop offset="1" stop-color="#E1C76A" stop-opacity=".75"></stop></linearGradient>
        </defs>
        <circle cx="200" cy="200" r="186" fill="none" stroke="rgba(225,199,106,.16)" stroke-width="1"></circle>
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(225,199,106,.3)" stroke-width="1" stroke-dasharray="3 9" style="transform-origin:200px 200px;animation:ypSpin 80s linear infinite"></circle>
        <circle cx="200" cy="200" r="150" fill="none" stroke="url(#ypG1)" stroke-width="2" stroke-linecap="round" stroke-dasharray="210 730" style="transform-origin:200px 200px;animation:ypSpinRev 28s linear infinite"></circle>
        <circle cx="200" cy="200" r="112" fill="none" stroke="url(#ypG2)" stroke-width="1.4" stroke-dasharray="120 584" stroke-linecap="round" style="transform-origin:200px 200px;animation:ypSpin 18s linear infinite"></circle>
        <g stroke="rgba(225,199,106,.42)" stroke-width="1">
          <path d="M200 8v20M200 372v20M8 200h20M372 200h20"></path>
          <path d="M64 64l14 14M336 64l-14 14M64 336l14-14M336 336l-14-14" stroke-opacity=".6"></path>
        </g>
        <g style="transform-origin:200px 200px;animation:ypSpinRev 44s linear infinite">
          <circle cx="200" cy="50" r="4.5" fill="#E1C76A"></circle>
          <circle cx="350" cy="200" r="3" fill="#C9A227"></circle>
          <circle cx="200" cy="350" r="3.5" fill="#E1C76A" fill-opacity=".7"></circle>
        </g>
        <g style="transform-origin:200px 200px;animation:ypSpin 34s linear infinite">
          <circle cx="88" cy="200" r="3" fill="#E1C76A" fill-opacity=".85"></circle>
          <circle cx="288" cy="112" r="2.4" fill="#E1C76A" fill-opacity=".5"></circle>
        </g>
      </svg>
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg);width:min(42%,230px);aspect-ratio:1/1;border-radius:34px;background:linear-gradient(145deg,rgba(255,255,255,.14),rgba(255,255,255,.03));border:1px solid rgba(225,199,106,.34);box-shadow:0 40px 90px -40px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.18);backdrop-filter:blur(6px)"></div>
      <div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;gap:14px;text-align:center">
        <svg viewBox="0 0 48 48" width="62" height="62" fill="none" stroke="#E1C76A" stroke-width="1.4" stroke-linecap="round" style="filter:drop-shadow(0 0 18px rgba(201,162,39,.5))">
          <path d="M24 5l4.6 12.2L41 21.6l-12.4 4.4L24 38l-4.6-12L7 21.6l12.4-4.4L24 5Z" stroke-linejoin="round"></path>
          <path d="M24 42v2M38 36l1.6 1.6M10 36l-1.6 1.6"></path>
        </svg>
        <span style="display:block;width:44px;height:1px;background:linear-gradient(90deg,rgba(225,199,106,0),#E1C76A,rgba(225,199,106,0))"></span>
      </div>
      <div style="position:absolute;top:6%;right:4%;display:grid;place-items:center;width:clamp(52px,7vw,74px);height:clamp(52px,7vw,74px);border-radius:20px;background:linear-gradient(150deg,rgba(255,255,255,.16),rgba(255,255,255,.04));border:1px solid rgba(225,199,106,.3);backdrop-filter:blur(8px);animation:ypFloat 11s ease-in-out infinite">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#E1C76A" stroke-width="1.5" stroke-linecap="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"></rect><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"></rect><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"></rect><path d="M14 17h6.5M17.2 13.8v6.4"></path></svg>
      </div>
      <div style="position:absolute;bottom:10%;left:2%;display:grid;place-items:center;width:clamp(48px,6.4vw,66px);height:clamp(48px,6.4vw,66px);border-radius:50%;background:linear-gradient(150deg,rgba(255,255,255,.14),rgba(255,255,255,.03));border:1px solid rgba(225,199,106,.26);backdrop-filter:blur(8px);animation:ypFloat2 13s ease-in-out infinite">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#E1C76A" stroke-width="1.5" stroke-linecap="round"><path d="M5 19l5.5-6.5L14 16l5-8"></path><path d="M14.5 8H19v4.5"></path></svg>
      </div>
      <div style="position:absolute;bottom:2%;right:18%;width:12px;height:12px;border-radius:50%;background:#C9A227;box-shadow:0 0 0 8px rgba(201,162,39,.12);animation:ypFloat 8s ease-in-out infinite"></div>
    </div>
  </div>
</section>

<section style="position:relative;overflow:hidden;padding:clamp(56px,9vh,120px) clamp(20px,5vw,80px) clamp(64px,10vh,130px);background:linear-gradient(180deg,#FFFFFF 0%,#FFFFFF 62%,#FCFAF4 100%)">
  <div aria-hidden="true" style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:1px;height:clamp(60px,9vh,110px);background:linear-gradient(180deg,rgba(201,162,39,.7),rgba(201,162,39,0))"></div>
  <div aria-hidden="true" style="position:absolute;top:14%;right:-14%;width:42vw;height:42vw;max-width:560px;max-height:560px;border-radius:50%;background:radial-gradient(circle,rgba(201,162,39,.10),rgba(201,162,39,0) 68%)"></div>
  <div aria-hidden="true" style="position:absolute;inset:0;background-image:radial-gradient(rgba(15,59,46,.09) 1px,transparent 1px);background-size:30px 30px;mask-image:radial-gradient(90% 60% at 12% 85%,#000,transparent 70%);-webkit-mask-image:radial-gradient(90% 60% at 12% 85%,#000,transparent 70%);opacity:.7"></div>

  <div style="position:relative;display:flex;flex-wrap:wrap;align-items:flex-start;gap:clamp(28px,4vw,64px);max-width:1320px;margin:0 auto">
    <div style="flex:1 1 330px;max-width:430px;min-width:min(100%,280px);position:sticky;top:clamp(96px,12vh,140px);align-self:flex-start">
      <div data-reveal>
        <div style="position:relative;overflow:hidden;padding:clamp(26px,3vw,38px);border-radius:30px;background:linear-gradient(160deg,#0A2E24 0%,#0F3B2E 58%,#164A3A 100%);box-shadow:0 60px 110px -60px rgba(10,46,36,.75),inset 0 0 0 1px rgba(225,199,106,.16)">
          <div aria-hidden="true" style="position:absolute;inset:0;background-image:radial-gradient(rgba(225,199,106,.14) 1px,transparent 1px);background-size:22px 22px;opacity:.7"></div>
          <div aria-hidden="true" style="position:absolute;top:-40%;right:-30%;width:80%;aspect-ratio:1/1;border-radius:50%;background:radial-gradient(circle,rgba(201,162,39,.22),rgba(201,162,39,0) 66%);animation:ypGlow 11s ease-in-out infinite"></div>

          <div style="position:relative;display:grid;place-items:center;width:clamp(150px,17vw,190px);height:clamp(150px,17vw,190px);margin:0 auto clamp(20px,2.6vw,30px)">
            <svg viewBox="0 0 160 160" style="position:absolute;inset:0;width:100%;height:100%;transform:rotate(-90deg)">
              <circle cx="80" cy="80" r="64" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="3"></circle>
              <circle cx="80" cy="80" r="64" fill="none" stroke="#C9A227" stroke-width="3" stroke-linecap="round" stroke-dasharray="402.1" stroke-dashoffset="321.7" style="filter:drop-shadow(0 0 8px rgba(201,162,39,.6))"></circle>
              <circle cx="80" cy="80" r="74" fill="none" stroke="rgba(225,199,106,.22)" stroke-width="1" stroke-dasharray="2 8" style="transform-origin:80px 80px;animation:ypSpin 60s linear infinite"></circle>
            </svg>
            <span style="font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(42px,4.6vw,64px);line-height:1;letter-spacing:-.04em;background-image:linear-gradient(140deg,#E1C76A,#C9A227);-webkit-background-clip:text;background-clip:text;color:transparent">01</span>
            <span aria-hidden="true" style="position:absolute;top:2px;right:2px;display:grid;place-items:center;width:clamp(42px,5vw,52px);height:clamp(42px,5vw,52px);border-radius:16px;background:linear-gradient(150deg,#164A3A,#0A2E24);border:1px solid rgba(225,199,106,.34);box-shadow:0 16px 30px -18px rgba(0,0,0,.8)">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#E1C76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18"></path><path d="M6 4h11l-2.4 4L17 12H6"></path></svg>
            </span>
          </div>

          <div style="position:relative;display:flex;flex-direction:column;gap:2px">
            <a href="#yp-step-1" style="display:flex;align-items:center;gap:14px;padding:11px 10px;border-radius:12px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;letter-spacing:.1em;color:#C9A227">
              <span style="display:block;width:9px;height:9px;flex:0 0 auto;border-radius:50%;border:1px solid #C9A227;background:#C9A227;box-shadow:0 0 0 4px rgba(201,162,39,.18);transform:scale(1.25)"></span>
              <span style="display:block;height:1px;width:26px;background:linear-gradient(90deg,#E1C76A,rgba(225,199,106,0))"></span>
              <span>01</span>
            </a>
            <a href="#yp-step-2" style="display:flex;align-items:center;gap:14px;padding:11px 10px;border-radius:12px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;letter-spacing:.1em;color:rgba(255,255,255,.5)">
              <span style="display:block;width:9px;height:9px;flex:0 0 auto;border-radius:50%;border:1px solid rgba(225,199,106,.35);background:transparent"></span>
              <span style="display:block;height:1px;width:10px;opacity:.4;background:linear-gradient(90deg,#E1C76A,rgba(225,199,106,0))"></span>
              <span>02</span>
            </a>
            <a href="#yp-step-3" style="display:flex;align-items:center;gap:14px;padding:11px 10px;border-radius:12px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;letter-spacing:.1em;color:rgba(255,255,255,.5)">
              <span style="display:block;width:9px;height:9px;flex:0 0 auto;border-radius:50%;border:1px solid rgba(225,199,106,.35);background:transparent"></span>
              <span style="display:block;height:1px;width:10px;opacity:.4;background:linear-gradient(90deg,#E1C76A,rgba(225,199,106,0))"></span>
              <span>03</span>
            </a>
            <a href="#yp-step-4" style="display:flex;align-items:center;gap:14px;padding:11px 10px;border-radius:12px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;letter-spacing:.1em;color:rgba(255,255,255,.5)">
              <span style="display:block;width:9px;height:9px;flex:0 0 auto;border-radius:50%;border:1px solid rgba(225,199,106,.35);background:transparent"></span>
              <span style="display:block;height:1px;width:10px;opacity:.4;background:linear-gradient(90deg,#E1C76A,rgba(225,199,106,0))"></span>
              <span>04</span>
            </a>
            <a href="#yp-step-5" style="display:flex;align-items:center;gap:14px;padding:11px 10px;border-radius:12px;font-family:'Sora',sans-serif;font-weight:700;font-size:14px;letter-spacing:.1em;color:rgba(255,255,255,.5)">
              <span style="display:block;width:9px;height:9px;flex:0 0 auto;border-radius:50%;border:1px solid rgba(225,199,106,.35);background:transparent"></span>
              <span style="display:block;height:1px;width:10px;opacity:.4;background:linear-gradient(90deg,#E1C76A,rgba(225,199,106,0))"></span>
              <span>05</span>
            </a>
          </div>
          <div aria-hidden="true" style="position:relative;margin-top:clamp(18px,2.4vw,26px);height:1px;background:linear-gradient(90deg,rgba(225,199,106,.5),rgba(225,199,106,0))"></div>
        </div>
      </div>
    </div>

    <div style="flex:1 1 560px;min-width:min(100%,280px);display:flex;flex-direction:column;gap:clamp(18px,2.4vw,30px)">

      <div data-reveal>
        <article id="yp-step-1" style="position:relative;overflow:hidden;padding:clamp(26px,3.2vw,44px);border:1px solid rgba(15,59,46,.10);border-radius:26px;background:linear-gradient(180deg,#FFFFFF,#FDFBF6);box-shadow:0 2px 0 rgba(15,59,46,.03)">
          <span aria-hidden="true" style="position:absolute;top:-24px;right:10px;font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(92px,10vw,152px);line-height:1;letter-spacing:-.05em;color:rgba(15,59,46,.045);pointer-events:none">01</span>
          <div style="position:relative;display:flex;align-items:center;gap:16px;margin-bottom:clamp(18px,2.2vw,26px)">
            <span aria-hidden="true" style="display:grid;place-items:center;width:58px;height:58px;flex:0 0 auto;border-radius:18px;background:linear-gradient(145deg,#0F3B2E,#164A3A);box-shadow:inset 0 0 0 1px rgba(225,199,106,.34),0 20px 36px -24px rgba(10,46,36,.9)">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#E1C76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v18"></path><path d="M6 4h11l-2.4 4L17 12H6"></path></svg>
            </span>
            <span style="display:flex;flex-direction:column;gap:7px">
              <span style="font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(20px,2.1vw,26px);line-height:1;letter-spacing:-.01em;color:#0F3B2E">01</span>
              <span aria-hidden="true" style="display:block;width:36px;height:2px;border-radius:2px;background:linear-gradient(90deg,#C9A227,rgba(201,162,39,0))"></span>
            </span>
          </div>
          <h3 style="position:relative;margin:0 0 12px;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(21px,2.5vw,31px);line-height:1.16;letter-spacing:-.02em;color:#0F3B2E">Be a Flagbearer of Innovation</h3>
          <p style="position:relative;margin:0;max-width:64ch;font-size:clamp(15px,1.1vw,17.5px);line-height:1.76;color:#263238">Position your school at the forefront of a national transformation. In partnership with The Times of India, YoungPreneurs recognizes visionary institutions as Torchbearers of Innovation.</p>
        </article>
      </div>

      <div data-reveal>
        <article id="yp-step-2" style="position:relative;overflow:hidden;padding:clamp(26px,3.2vw,44px);border:1px solid rgba(15,59,46,.10);border-radius:26px;background:linear-gradient(180deg,#FFFFFF,#FDFBF6);box-shadow:0 2px 0 rgba(15,59,46,.03)">
          <span aria-hidden="true" style="position:absolute;top:-24px;right:10px;font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(92px,10vw,152px);line-height:1;letter-spacing:-.05em;color:rgba(15,59,46,.045);pointer-events:none">02</span>
          <div style="position:relative;display:flex;align-items:center;gap:16px;margin-bottom:clamp(18px,2.2vw,26px)">
            <span aria-hidden="true" style="display:grid;place-items:center;width:58px;height:58px;flex:0 0 auto;border-radius:18px;background:linear-gradient(145deg,#0F3B2E,#164A3A);box-shadow:inset 0 0 0 1px rgba(225,199,106,.34),0 20px 36px -24px rgba(10,46,36,.9)">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#E1C76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="3.2"></circle><path d="M4 20c1.5-3.7 4.4-5.5 8-5.5s6.5 1.8 8 5.5"></path></svg>
            </span>
            <span style="display:flex;flex-direction:column;gap:7px">
              <span style="font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(20px,2.1vw,26px);line-height:1;letter-spacing:-.01em;color:#0F3B2E">02</span>
              <span aria-hidden="true" style="display:block;width:36px;height:2px;border-radius:2px;background:linear-gradient(90deg,#C9A227,rgba(201,162,39,0))"></span>
            </span>
          </div>
          <h3 style="position:relative;margin:0 0 12px;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(21px,2.5vw,31px);line-height:1.16;letter-spacing:-.02em;color:#0F3B2E">Empower Your Educators</h3>
          <p style="position:relative;margin:0;max-width:64ch;font-size:clamp(15px,1.1vw,17.5px);line-height:1.76;color:#263238">Through our Train-the-Trainer Program, your educators gain hands-on exposure to Design Thinking, Business Model Canvas, and IDEA DNA frameworks.</p>
        </article>
      </div>

      <div data-reveal>
        <article id="yp-step-3" style="position:relative;overflow:hidden;padding:clamp(26px,3.2vw,44px);border:1px solid rgba(15,59,46,.10);border-radius:26px;background:linear-gradient(180deg,#FFFFFF,#FDFBF6);box-shadow:0 2px 0 rgba(15,59,46,.03)">
          <span aria-hidden="true" style="position:absolute;top:-24px;right:10px;font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(92px,10vw,152px);line-height:1;letter-spacing:-.05em;color:rgba(15,59,46,.045);pointer-events:none">03</span>
          <div style="position:relative;display:flex;align-items:center;gap:16px;margin-bottom:clamp(18px,2.2vw,26px)">
            <span aria-hidden="true" style="display:grid;place-items:center;width:58px;height:58px;flex:0 0 auto;border-radius:18px;background:linear-gradient(145deg,#0F3B2E,#164A3A);box-shadow:inset 0 0 0 1px rgba(225,199,106,.34),0 20px 36px -24px rgba(10,46,36,.9)">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#E1C76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9.2" r="5.4"></circle><path d="M8.8 14.2 8 22l4-2.3L16 22l-.8-7.8"></path></svg>
            </span>
            <span style="display:flex;flex-direction:column;gap:7px">
              <span style="font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(20px,2.1vw,26px);line-height:1;letter-spacing:-.01em;color:#0F3B2E">03</span>
              <span aria-hidden="true" style="display:block;width:36px;height:2px;border-radius:2px;background:linear-gradient(90deg,#C9A227,rgba(201,162,39,0))"></span>
            </span>
          </div>
          <h3 style="position:relative;margin:0 0 12px;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(21px,2.5vw,31px);line-height:1.16;letter-spacing:-.02em;color:#0F3B2E">Certification &amp; Recognition</h3>
          <p style="position:relative;margin:0;max-width:64ch;font-size:clamp(15px,1.1vw,17.5px);line-height:1.76;color:#263238">Partner schools receive an official certification from The Times of India and YoungPreneurs Academy, recognizing their commitment to fostering innovation.</p>
        </article>
      </div>

      <div data-reveal>
        <article id="yp-step-4" style="position:relative;overflow:hidden;padding:clamp(26px,3.2vw,44px);border:1px solid rgba(15,59,46,.10);border-radius:26px;background:linear-gradient(180deg,#FFFFFF,#FDFBF6);box-shadow:0 2px 0 rgba(15,59,46,.03)">
          <span aria-hidden="true" style="position:absolute;top:-24px;right:10px;font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(92px,10vw,152px);line-height:1;letter-spacing:-.05em;color:rgba(15,59,46,.045);pointer-events:none">04</span>
          <div style="position:relative;display:flex;align-items:center;gap:16px;margin-bottom:clamp(18px,2.2vw,26px)">
            <span aria-hidden="true" style="display:grid;place-items:center;width:58px;height:58px;flex:0 0 auto;border-radius:18px;background:linear-gradient(145deg,#0F3B2E,#164A3A);box-shadow:inset 0 0 0 1px rgba(225,199,106,.34),0 20px 36px -24px rgba(10,46,36,.9)">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#E1C76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="7" height="7" rx="1.6"></rect><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"></rect><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"></rect><path d="M14 17h6.5M17.2 13.8v6.4"></path></svg>
            </span>
            <span style="display:flex;flex-direction:column;gap:7px">
              <span style="font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(20px,2.1vw,26px);line-height:1;letter-spacing:-.01em;color:#0F3B2E">04</span>
              <span aria-hidden="true" style="display:block;width:36px;height:2px;border-radius:2px;background:linear-gradient(90deg,#C9A227,rgba(201,162,39,0))"></span>
            </span>
          </div>
          <h3 style="position:relative;margin:0 0 12px;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(21px,2.5vw,31px);line-height:1.16;letter-spacing:-.02em;color:#0F3B2E">Seamless Implementation</h3>
          <p style="position:relative;margin:0;max-width:64ch;font-size:clamp(15px,1.1vw,17.5px);line-height:1.76;color:#263238">Built on a plug-and-play model, Future Titans integrates effortlessly. With complete resources, SSI evaluation, and dedicated support at every step.</p>
        </article>
      </div>

      <div data-reveal>
        <article id="yp-step-5" style="position:relative;overflow:hidden;padding:clamp(26px,3.2vw,44px);border:1px solid rgba(15,59,46,.10);border-radius:26px;background:linear-gradient(180deg,#FFFFFF,#FDFBF6);box-shadow:0 2px 0 rgba(15,59,46,.03)">
          <span aria-hidden="true" style="position:absolute;top:-24px;right:10px;font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(92px,10vw,152px);line-height:1;letter-spacing:-.05em;color:rgba(15,59,46,.045);pointer-events:none">05</span>
          <div style="position:relative;display:flex;align-items:center;gap:16px;margin-bottom:clamp(18px,2.2vw,26px)">
            <span aria-hidden="true" style="display:grid;place-items:center;width:58px;height:58px;flex:0 0 auto;border-radius:18px;background:linear-gradient(145deg,#0F3B2E,#164A3A);box-shadow:inset 0 0 0 1px rgba(225,199,106,.34),0 20px 36px -24px rgba(10,46,36,.9)">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#E1C76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"></circle><path d="M3.4 12h17.2M12 3.4c3 3.2 3 14 0 17.2M12 3.4c-3 3.2-3 14 0 17.2"></path></svg>
            </span>
            <span style="display:flex;flex-direction:column;gap:7px">
              <span style="font-family:'Sora',sans-serif;font-weight:800;font-size:clamp(20px,2.1vw,26px);line-height:1;letter-spacing:-.01em;color:#0F3B2E">05</span>
              <span aria-hidden="true" style="display:block;width:36px;height:2px;border-radius:2px;background:linear-gradient(90deg,#C9A227,rgba(201,162,39,0))"></span>
            </span>
          </div>
          <h3 style="position:relative;margin:0 0 12px;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(21px,2.5vw,31px);line-height:1.16;letter-spacing:-.02em;color:#0F3B2E">National Recognition &amp; Impact</h3>
          <p style="position:relative;margin:0;max-width:64ch;font-size:clamp(15px,1.1vw,17.5px);line-height:1.76;color:#263238">Your school earns visibility and distinction on a national level — celebrated for fostering innovation, leadership, and the entrepreneurial spirit.</p>
        </article>
      </div>

    </div>
  </div>
</section>

<section style="position:relative;overflow:hidden;padding:clamp(56px,9vh,120px) clamp(20px,5vw,80px) clamp(64px,10vh,130px);background:linear-gradient(180deg,#FCFAF4 0%,#FFFFFF 40%,#FFFFFF 100%)">
  <div aria-hidden="true" style="position:absolute;top:-6%;left:50%;transform:translateX(-50%);width:min(1100px,120vw);aspect-ratio:1/1;border-radius:50%;border:1px solid rgba(15,59,46,.07)"></div>
  <div aria-hidden="true" style="position:absolute;bottom:-20%;left:-10%;width:40vw;height:40vw;max-width:540px;max-height:540px;border-radius:50%;background:radial-gradient(circle,rgba(201,162,39,.12),rgba(201,162,39,0) 68%)"></div>
  <div aria-hidden="true" style="position:absolute;top:8%;right:6%;width:clamp(120px,16vw,220px);aspect-ratio:1/1;border-radius:50%;border:1px dashed rgba(201,162,39,.32);animation:ypSpin 90s linear infinite"></div>

  <div data-reveal style="position:relative;max-width:1180px;margin:0 auto">
    <div style="position:relative;overflow:hidden;border-radius:36px;padding:clamp(34px,5vw,86px) clamp(24px,5vw,80px);background:linear-gradient(155deg,#0A2E24 0%,#0F3B2E 55%,#164A3A 100%);box-shadow:0 80px 140px -70px rgba(10,46,36,.7),inset 0 0 0 1px rgba(225,199,106,.18)">
      <div aria-hidden="true" style="position:absolute;inset:0;background-image:radial-gradient(rgba(225,199,106,.12) 1px,transparent 1px);background-size:26px 26px;mask-image:radial-gradient(90% 80% at 50% 0%,#000,transparent 72%);-webkit-mask-image:radial-gradient(90% 80% at 50% 0%,#000,transparent 72%)"></div>
      <div aria-hidden="true" style="position:absolute;top:-30%;left:50%;transform:translateX(-50%);width:70%;aspect-ratio:1/1;border-radius:50%;background:radial-gradient(circle,rgba(201,162,39,.28),rgba(201,162,39,0) 62%);animation:ypGlow 12s ease-in-out infinite"></div>
      <span aria-hidden="true" style="position:absolute;inset:clamp(12px,1.4vw,18px);border:1px solid rgba(225,199,106,.26);border-radius:26px;pointer-events:none"></span>
      <span aria-hidden="true" style="position:absolute;top:clamp(20px,2vw,28px);left:clamp(20px,2vw,28px);width:26px;height:26px;border-top:2px solid #C9A227;border-left:2px solid #C9A227;border-radius:8px 0 0 0;pointer-events:none"></span>
      <span aria-hidden="true" style="position:absolute;top:clamp(20px,2vw,28px);right:clamp(20px,2vw,28px);width:26px;height:26px;border-top:2px solid #C9A227;border-right:2px solid #C9A227;border-radius:0 8px 0 0;pointer-events:none"></span>
      <span aria-hidden="true" style="position:absolute;bottom:clamp(20px,2vw,28px);left:clamp(20px,2vw,28px);width:26px;height:26px;border-bottom:2px solid #C9A227;border-left:2px solid #C9A227;border-radius:0 0 0 8px;pointer-events:none"></span>
      <span aria-hidden="true" style="position:absolute;bottom:clamp(20px,2vw,28px);right:clamp(20px,2vw,28px);width:26px;height:26px;border-bottom:2px solid #C9A227;border-right:2px solid #C9A227;border-radius:0 0 8px 0;pointer-events:none"></span>

      <div style="position:relative;display:flex;flex-direction:column;align-items:center;text-align:center">
        <span aria-hidden="true" style="display:grid;place-items:center;width:62px;height:62px;margin-bottom:clamp(20px,2.6vw,30px);border-radius:20px;background:linear-gradient(150deg,rgba(255,255,255,.14),rgba(255,255,255,.03));border:1px solid rgba(225,199,106,.34);backdrop-filter:blur(6px)">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#E1C76A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.6l7.4 3.2v5.6c0 4.4-3 8-7.4 9.9-4.4-1.9-7.4-5.5-7.4-9.9V5.8L12 2.6Z"></path><path d="M9 12.2l2.2 2.2L15.4 10"></path></svg>
        </span>
        <h2 style="margin:0;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(28px,4.4vw,58px);line-height:1.08;letter-spacing:-.028em;color:#FFFFFF">Why Encourage <span style="background-image:linear-gradient(96deg,#E1C76A,#C9A227 70%,#E1C76A);-webkit-background-clip:text;background-clip:text;color:transparent">Your Students?</span></h2>
        <span aria-hidden="true" style="display:flex;align-items:center;gap:12px;margin:clamp(24px,3vw,38px) 0 clamp(26px,3.4vw,42px)">
          <span style="display:block;width:clamp(40px,8vw,120px);height:1px;background:linear-gradient(90deg,rgba(225,199,106,0),#E1C76A)"></span>
          <span style="display:block;width:9px;height:9px;transform:rotate(45deg);background:#C9A227;box-shadow:0 0 14px rgba(201,162,39,.8)"></span>
          <span style="display:block;width:clamp(40px,8vw,120px);height:1px;background:linear-gradient(90deg,#E1C76A,rgba(225,199,106,0))"></span>
        </span>
        <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(22px,3.4vw,54px);width:100%;max-width:960px;text-align:left">
          <p style="margin:0;flex:1 1 320px;min-width:min(100%,260px);font-size:clamp(15.5px,1.2vw,18.5px);line-height:1.78;color:rgba(255,255,255,.88)">The next CEO, innovator, or changemaker might be sitting in your classroom right now. Future Titans gives them the chance — and your school, the legacy.</p>
          <p style="margin:0;flex:1 1 320px;min-width:min(100%,260px);font-size:clamp(15.5px,1.2vw,18.5px);line-height:1.78;color:rgba(255,255,255,.88)">With national exposure, investor-backed mentorship, and real startup funding on the line, this is more than participation — It's a chance to put your school's name in India's innovation story.</p>
        </div>
        <p style="margin-top:clamp(30px,4vw,54px);font-family:'Sora',sans-serif;font-weight:600;font-size:clamp(20px,2.6vw,36px);line-height:1.24;letter-spacing:-.02em;background-image:linear-gradient(96deg,#E1C76A 10%,#FFFFFF 50%,#E1C76A 90%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;color:transparent;animation:ypShimmer 7s linear infinite">Is your school ready to make history?</p>
      </div>
    </div>
  </div>
</section>

<section style="position:relative;overflow:hidden;padding:clamp(60px,10vh,130px) clamp(20px,5vw,80px) clamp(70px,11vh,140px);background:linear-gradient(180deg,#FFFFFF 0%,#F8F5EE 100%)">
  <div aria-hidden="true" style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:1px;height:clamp(50px,8vh,96px);background:linear-gradient(180deg,rgba(201,162,39,.65),rgba(201,162,39,0))"></div>
  <div aria-hidden="true" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(760px,150vw);aspect-ratio:1/1;border-radius:50%;border:1px solid rgba(15,59,46,.08)"></div>
  <div aria-hidden="true" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(540px,110vw);aspect-ratio:1/1;border-radius:50%;border:1px dashed rgba(201,162,39,.3);animation:ypSpin 70s linear infinite"></div>
  <div aria-hidden="true" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(330px,80vw);aspect-ratio:1/1;border-radius:50%;background:radial-gradient(circle,rgba(201,162,39,.18),rgba(201,162,39,0) 66%)"></div>
  <div data-reveal style="position:relative;display:grid;place-items:center;gap:clamp(22px,3vw,34px)">
    <span aria-hidden="true" style="display:block;width:9px;height:9px;transform:rotate(45deg);background:#C9A227;box-shadow:0 0 0 7px rgba(201,162,39,.12)"></span>
    <div style="position:relative;display:grid;place-items:center">
      <span aria-hidden="true" style="position:absolute;width:112%;height:150%;border-radius:999px;border:1px solid rgba(201,162,39,.4);animation:ypRing 4.6s ease-out infinite;pointer-events:none"></span>
      <span aria-hidden="true" style="position:absolute;width:112%;height:150%;border-radius:999px;border:1px solid rgba(201,162,39,.3);animation:ypRing 4.6s ease-out infinite;animation-delay:1.5s;pointer-events:none"></span>
      <a href="/signup" style="position:relative;overflow:hidden;display:inline-flex;align-items:center;gap:14px;padding:clamp(17px,1.9vw,23px) clamp(30px,3.6vw,52px);border:1px solid rgba(201,162,39,.55);border-radius:999px;background:linear-gradient(135deg,#0F3B2E 0%,#164A3A 100%);color:#FFFFFF;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(15.5px,1.5vw,20px);letter-spacing:.01em;box-shadow:0 34px 64px -30px rgba(10,46,36,.65),inset 0 1px 0 rgba(255,255,255,.08)">
        <span style="position:relative">Join the Movement</span>
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#E1C76A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="position:relative"><path d="M4 12h15"></path><path d="M13 6l6 6-6 6"></path></svg>
      </a>
    </div>
    <span aria-hidden="true" style="display:block;width:min(260px,60vw);height:1px;background:linear-gradient(90deg,rgba(201,162,39,0),rgba(201,162,39,.55),rgba(201,162,39,0))"></span>
  </div>
</section>
`;

export default function ForSchools() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <div
        className="fs-wrap"
        style={{ fontFamily: "'Manrope', system-ui, sans-serif", color: '#111111', overflowX: 'clip', background: '#ffffff' }}
        dangerouslySetInnerHTML={{ __html: CONTENT_HTML }}
      />
      <PublicFooter />
    </div>
  );
}
