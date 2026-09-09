// AUTO-GENERATED from `Learn Page.dc.html` (Claude Design import).
// Injected via dangerouslySetInnerHTML in app/student/modules/page.js.
// Behavior lives in ./learnPageBehavior.js.

export const LEARN_PAGE_STYLE = `*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{background:#FAF6EC;color:#1B2A22;font-family:Poppins,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}
a{color:#A6801A;text-decoration:none}
a:hover{color:#7E5F0C}
button{font-family:inherit}
@keyframes maskUp{from{transform:translateY(118%);letter-spacing:.09em;opacity:0}to{transform:translateY(0);letter-spacing:0;opacity:1}}
@keyframes fadeUp{from{opacity:0;transform:translate3d(0,20px,0)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes lineSweep{0%{transform:scaleX(0);opacity:0}35%{opacity:1}100%{transform:scaleX(1);opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes breathe{0%,100%{transform:scale(1);opacity:.8}50%{transform:scale(1.18);opacity:1}}
@keyframes ringPulse{0%{transform:scale(.85);opacity:.5}75%,100%{transform:scale(1.55);opacity:0}}
@keyframes edgeTravel{0%{transform:translateX(-130%)}100%{transform:translateX(330%)}}
@keyframes shimmer{0%{transform:translateX(-120%)}55%,100%{transform:translateX(340%)}}
@keyframes bob{0%,100%{transform:translateY(-3px);opacity:.6}50%{transform:translateY(4px);opacity:1}}
@keyframes sparkOut{0%{transform:translate3d(0,0,0) scale(.3);opacity:0}18%{opacity:1}100%{transform:translate3d(var(--dx,0px),var(--dy,-16px),0) scale(.15);opacity:0}}
@keyframes drawRing{from{stroke-dashoffset:70}to{stroke-dashoffset:0}}
@keyframes drawCheck{from{stroke-dashoffset:20}to{stroke-dashoffset:0}}
@keyframes successGlow{0%{opacity:0}22%{opacity:1}100%{opacity:0}}
@keyframes floatA{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(36px,-26px,0)}}
@keyframes floatB{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-30px,22px,0)}}
@keyframes rippleOut{0%{transform:scale(0);opacity:.55}100%{transform:scale(16);opacity:0}}
@keyframes headPulse{0%{transform:scale(.7);opacity:.55}80%,100%{transform:scale(2.4);opacity:0}}
@media (prefers-reduced-motion: reduce){*{animation-duration:1ms !important;animation-iteration-count:1 !important;transition-duration:1ms !important}}`;

export const LEARN_PAGE_SHELL_HTML = `<div style="position:fixed;inset:0;z-index:0;pointer-events:none;background:linear-gradient(180deg,#FCF9F1 0%,#F6F1E1 46%,#FAF7EF 100%);"></div>
<div style="position:fixed;left:-10vw;top:-14vh;width:60vw;height:60vh;z-index:0;pointer-events:none;border-radius:50%;background:radial-gradient(circle closest-side,rgba(22,72,48,.07),transparent 72%);animation:floatA 26s ease-in-out infinite;"></div>
<div style="position:fixed;right:-14vw;top:24vh;width:52vw;height:56vh;z-index:0;pointer-events:none;border-radius:50%;background:radial-gradient(circle closest-side,rgba(201,162,39,.10),transparent 72%);animation:floatB 34s ease-in-out infinite;"></div>
<canvas data-net style="position:fixed;inset:0;z-index:0;pointer-events:none;opacity:var(--net,.8);"></canvas>
<div data-light style="position:fixed;left:0;top:0;width:900px;height:900px;margin:-450px 0 0 -450px;z-index:1;pointer-events:none;opacity:calc(var(--on,0)*var(--lightMax,1));transition:opacity 700ms ease;background:radial-gradient(circle closest-side,rgba(201,162,39,.16),rgba(201,162,39,.05) 46%,transparent 72%);transform:translate3d(var(--lx,50vw),var(--ly,40vh),0);will-change:transform;"></div>

<main style="position:relative;z-index:2;max-width:1340px;margin:0 auto;padding:0 clamp(18px,3.4vw,44px);">
  <section style="position:relative;padding:clamp(44px,6.4vw,86px) 0 clamp(20px,3vw,34px);text-align:center;">
    <h1 style="margin:0;font-size:clamp(38px,6.2vw,78px);font-weight:800;letter-spacing:-.02em;line-height:1.04;color:#22313C;">
      <span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 .06em .1em;">
        <span style="display:inline-block;transform:translateY(118%);opacity:0;animation:maskUp 950ms cubic-bezier(.22,1,.36,1) 120ms forwards;">Choose</span>
      </span>
      <span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 .06em .1em;">
        <span style="display:inline-block;transform:translateY(118%);opacity:0;animation:maskUp 950ms cubic-bezier(.22,1,.36,1) 220ms forwards;">Your</span>
      </span>
      <span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding:0 .06em .1em;">
        <span style="display:inline-block;transform:translateY(118%);opacity:0;animation:maskUp 950ms cubic-bezier(.22,1,.36,1) 320ms forwards;">Level</span>
      </span>
    </h1>
    <div style="width:min(420px,62%);height:1.5px;margin:14px auto 0;transform-origin:center;background:linear-gradient(90deg,transparent,rgba(201,162,39,.9),transparent);animation:lineSweep 900ms cubic-bezier(.22,1,.36,1) 520ms both;"></div>
    <div style="display:inline-flex;align-items:center;margin-top:-9px;padding:4px 13px;border-radius:999px;background:#FFFFFF;border:1px solid rgba(201,162,39,.35);box-shadow:0 6px 16px -12px rgba(24,48,32,.5);animation:fadeUp 600ms cubic-bezier(.22,1,.36,1) 640ms both;">
      <span style="font-size:9.5px;font-weight:700;letter-spacing:.17em;color:#7E6209;">IMPORTANT</span>
    </div>
    <div style="display:flex;justify-content:center;margin-top:10px;animation:fadeIn 500ms ease 760ms both;">
      <svg viewBox="0 0 22 34" style="width:20px;height:32px;animation:bob 3.6s ease-in-out infinite;">
        <path d="M11 3V25" style="fill:none;stroke:#C9A227;stroke-width:2;stroke-linecap:round;"></path>
        <path d="M4.4 19.4 11 26.6 17.6 19.4" style="fill:none;stroke:#C9A227;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"></path>
      </svg>
    </div>

    <div style="position:relative;max-width:730px;margin:18px auto 0;text-align:center;animation:fadeUp 700ms cubic-bezier(.22,1,.36,1) 820ms both;">
      <div style="position:relative;border-radius:18px;background:#FFFEFB;border:1px solid #EDE5D2;box-shadow:0 2px 3px rgba(24,48,32,.03),0 26px 50px -34px rgba(24,48,32,.36);padding:26px clamp(22px,3vw,40px);overflow:hidden;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(180deg,#E3C567,#B4881B);"></div>
        <div style="position:absolute;left:0;right:0;top:0;height:1px;background:linear-gradient(90deg,transparent,rgba(201,162,39,.55),transparent);"></div>
        <p style="margin:0;font-size:clamp(14.5px,1.16vw,17px);line-height:1.72;color:#4C5B52;text-wrap:pretty;">You have the freedom to start anywhere! Select <span style="display:inline-block;padding:1px 10px;margin:0 2px;border-radius:7px;background:#F7EFD7;border:1px solid rgba(201,162,39,.4);font-weight:800;color:#1B2A22;">ANY</span> level that matches your interests or skill level. Complete a module to build your idea and become eligible to participate in the final challenge.</p>
      </div>
    </div>
  </section>

  <section data-journey style="position:relative;padding:clamp(18px,2.6vw,34px) 0 clamp(56px,7vw,104px);">
    <svg data-path style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:0;pointer-events:none;overflow:visible;">
      <defs>
        <linearGradient id="jg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style="stop-color:#1B9A50;"></stop>
          <stop offset="0.5" style="stop-color:#C9A227;"></stop>
          <stop offset="1" style="stop-color:#EAD59A;"></stop>
        </linearGradient>
      </defs>
      <path data-measure style="fill:none;stroke:none;"></path>
      <path data-base style="fill:none;stroke:#E6DEC8;stroke-width:2;stroke-linecap:round;"></path>
      <path data-dash style="fill:none;stroke:rgba(201,162,39,.42);stroke-width:2;stroke-linecap:round;stroke-dasharray:1 8;"></path>
      <path data-fill style="fill:none;stroke:url(#jg);stroke-width:3.6;stroke-linecap:round;"></path>
      <path data-pulse style="fill:none;stroke:#F6E4AC;stroke-width:3.2;stroke-linecap:round;opacity:0;"></path>
      <path data-surge style="fill:none;stroke:#FFF4D2;stroke-width:4.4;stroke-linecap:round;opacity:0;"></path>
      <path data-zap style="fill:none;stroke:#FFFFFF;stroke-width:5;stroke-linecap:round;opacity:0;"></path>
      <circle data-halo r="14" style="fill:rgba(201,162,39,.22);"></circle>
      <circle data-ping r="9" style="fill:none;stroke:rgba(201,162,39,.5);stroke-width:1.5;transform-box:fill-box;transform-origin:center;animation:headPulse 2.6s ease-out infinite;"></circle>
      <circle data-head r="5.5" style="fill:#FFFDF6;stroke:#C9A227;stroke-width:3;"></circle>
    </svg>

    <div style="position:relative;z-index:1;display:grid;grid-template-columns:repeat(auto-fit,minmax(298px,1fr));gap:clamp(20px,2.2vw,32px);align-items:stretch;">

      <!--CARDS-->

    </div>
  </section>
</main>`;

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const LEVEL_LABEL_BY_INDEX = ['LEVEL 1', 'LEVEL 2', 'LEVEL 3', 'LEVEL 4', 'LEVEL 5', 'LEVEL 6', 'LEVEL 7', 'LEVEL 8'];
const DIFFICULTY_LABEL = { beginner: 'BEGINNER', intermediate: 'INTERMEDIATE', advanced: 'ADVANCED' };

// Icons rendered inside the node circle above each card.
const NODE_ICON_BY_INDEX = [
  // LEVEL 1 — diploma/graduation cap (mortarboard-ish)
  '<svg viewBox="0 0 24 24" style="width:26px;height:26px;"><path d="M8 4h8v4.5a4 4 0 0 1-8 0ZM8 5.4H5.6v1.4A3 3 0 0 0 8 9.6M16 5.4h2.4v1.4a3 3 0 0 1-2.4 2.8M12 12.6v3.2M9 19.4h6M9.6 19.4c.3-2 .9-3 2.4-3.6 1.5.6 2.1 1.6 2.4 3.6" style="fill:none;stroke:#FFFFFF;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;"></path></svg>',
  // LEVEL 2+ — target rings (used for all subsequent levels)
  '<svg viewBox="0 0 24 24" style="width:26px;height:26px;"><circle cx="12" cy="12" r="8.4" style="fill:none;stroke:#C9A227;stroke-width:1.7;"></circle><circle cx="12" cy="12" r="4.6" style="fill:none;stroke:#C9A227;stroke-width:1.7;"></circle><circle cx="12" cy="12" r="1.5" style="fill:#C9A227;"></circle></svg>',
];

function nodeIcon(index, isDone) {
  // Completed nodes get the filled gold node with a trophy-like flair; otherwise use the ring node.
  if (isDone) {
    return `<div style="position:relative;width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(158deg,#DEB846,#B4881B);box-shadow:0 12px 26px -12px rgba(150,112,18,.9),inset 0 1px 0 rgba(255,255,255,.45);">${NODE_ICON_BY_INDEX[0]}</div>`;
  }
  return `<div style="position:absolute;inset:2px;border-radius:50%;border:1.5px solid rgba(201,162,39,.45);animation:ringPulse 3.8s ease-out infinite;"></div><div style="position:relative;width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:#FFFDF7;border:2px solid rgba(201,162,39,.85);box-shadow:0 10px 22px -14px rgba(120,90,14,.55),inset 0 1px 0 rgba(255,255,255,.9);">${NODE_ICON_BY_INDEX[1]}</div>`;
}

function progressBar(pct, isDone, isStarted) {
  if (isDone) {
    return `<div style="position:relative;height:7px;border-radius:99px;background:#EFE9DA;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:calc(var(--p,0)*1%);border-radius:99px;overflow:hidden;background:linear-gradient(90deg,#128F45,#25BC63);">
          <div style="position:absolute;top:0;bottom:0;width:34%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:shimmer 3s ease-in-out infinite;animation-play-state:var(--play,paused);"></div>
        </div>
        <div style="position:absolute;top:50%;left:calc(var(--p,0)*1%);width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#FFFFFF;border:2.5px solid #17A34A;box-shadow:0 0 0 4px rgba(23,163,74,.13);"></div>
      </div>`;
  }
  if (isStarted) {
    return `<div style="position:relative;height:7px;border-radius:99px;background:#EFE9DA;">
        <div style="position:absolute;left:0;top:0;bottom:0;width:calc(var(--p,0)*1%);border-radius:99px;overflow:hidden;background:linear-gradient(90deg,#B4881B,#DEB846);">
          <div style="position:absolute;top:0;bottom:0;width:34%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.6),transparent);animation:shimmer 2.6s ease-in-out infinite;animation-play-state:var(--play,paused);"></div>
        </div>
        <div style="position:absolute;top:50%;left:calc(var(--p,0)*1%);width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:#FFFFFF;border:2.5px solid #C9A227;box-shadow:0 0 0 4px rgba(201,162,39,.16);"></div>
      </div>`;
  }
  // Not started
  return `<div style="position:relative;height:7px;border-radius:99px;background:#EFE9DA;overflow:hidden;">
      <div style="position:absolute;inset:0;background:repeating-linear-gradient(115deg,rgba(201,162,39,.16) 0 4px,transparent 4px 11px);"></div>
      <div style="position:absolute;left:0;top:0;bottom:0;width:calc(var(--p,0)*1%);border-radius:99px;background:linear-gradient(90deg,#B4881B,#DEB846);"></div>
    </div>`;
}

function completionNum(pct, isDone, isStarted) {
  if (isDone) {
    return `<span style="display:flex;align-items:center;gap:6px;">
        <svg viewBox="0 0 26 26" style="width:15px;height:15px;flex:none;">
          <circle cx="13" cy="13" r="11" style="fill:none;stroke:#17A34A;stroke-width:2;stroke-dasharray:70;stroke-dashoffset:70;animation:drawRing 820ms cubic-bezier(.22,1,.36,1) 320ms forwards;animation-play-state:var(--play,paused);"></circle>
          <path d="M7.6 13.4 11.2 17 18.4 9.7" style="fill:none;stroke:#17A34A;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:20;stroke-dashoffset:20;animation:drawCheck 420ms ease-out 920ms forwards;animation-play-state:var(--play,paused);"></path>
        </svg>
        <span data-num style="font-size:12.5px;font-weight:800;color:#0E7A36;">${pct}%</span>
      </span>`;
  }
  const color = isStarted ? '#7E6209' : '#6C776F';
  return `<span data-num style="font-size:12.5px;font-weight:800;color:${color};">${pct}%</span>`;
}

function actionButton(module, isDone, isPaid, unlocked) {
  if (!isPaid || !unlocked) {
    return `<button type="button" disabled style="width:100%;height:52px;margin-top:18px;border-radius:14px;border:1px solid #E5E1D2;background:#F5F1E4;color:#8C8B7E;font-size:14.5px;font-weight:600;cursor:not-allowed;display:flex;align-items:center;justify-content:center;gap:10px;">
        <svg viewBox="0 0 20 20" style="width:16px;height:16px;flex:none;"><path d="M6 9V7a4 4 0 0 1 8 0v2M5 9h10v7H5z" style="fill:none;stroke:currentColor;stroke-width:1.6;stroke-linejoin:round;"></path></svg>
        ${isPaid ? 'Locked' : 'Payment Required'}
      </button>`;
  }
  if (isDone) {
    return `<button data-btn data-variant="ghost" data-enter="${esc(module._id)}" type="button" style="position:relative;overflow:hidden;width:100%;height:52px;margin-top:18px;border-radius:14px;border:1.5px solid rgba(201,162,39,.72);background:#FFFDF7;color:#7E6209;font-size:14.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transform:translate3d(calc(var(--bx,0)*1px),calc(var(--by,0)*1px),0) scale(calc(1 - var(--press,0)*.035));box-shadow:0 8px 18px -16px rgba(120,90,14,.8);" style-hover="border-color:#C9A227;background:#FFFAEC" style-focus="outline:2px solid #C9A227;outline-offset:3px">
        <span style="position:absolute;top:0;bottom:0;width:38%;pointer-events:none;background:linear-gradient(100deg,transparent,rgba(201,162,39,.22),transparent);transform:translateX(calc(-160% + var(--sheen,0)*440%));"></span>
        <span data-ripple style="position:absolute;left:var(--rx,50%);top:var(--ry,50%);width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:rgba(201,162,39,.35);opacity:0;transform:scale(0);pointer-events:none;"></span>
        <svg viewBox="0 0 20 20" style="width:17px;height:17px;flex:none;position:relative;"><circle cx="10" cy="10" r="7.6" style="fill:none;stroke:currentColor;stroke-width:1.7;"></circle><path d="M6.6 10.2 9 12.6 13.6 7.6" style="fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;"></path></svg>
        <span style="position:relative;">Review Stage</span>
      </button>`;
  }
  return `<button data-btn data-variant="solid" data-enter="${esc(module._id)}" type="button" style="position:relative;overflow:hidden;width:100%;height:52px;margin-top:18px;border-radius:14px;border:0;background:linear-gradient(180deg,#D4A82F,#B78C1B);color:#FFFFFF;font-size:14.5px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;transform:translate3d(calc(var(--bx,0)*1px),calc(var(--by,0)*1px),0) scale(calc(1 - var(--press,0)*.035));box-shadow:0 12px 26px -16px rgba(150,112,18,.95),inset 0 1px 0 rgba(255,255,255,.28);" style-focus="outline:2px solid #0F3021;outline-offset:3px">
      <span style="position:absolute;top:0;bottom:0;width:38%;pointer-events:none;background:linear-gradient(100deg,transparent,rgba(255,255,255,.5),transparent);transform:translateX(calc(-160% + var(--sheen,0)*440%));"></span>
      <span data-ripple style="position:absolute;left:var(--rx,50%);top:var(--ry,50%);width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:rgba(255,255,255,.5);opacity:0;transform:scale(0);pointer-events:none;"></span>
      <svg viewBox="0 0 20 20" style="width:16px;height:16px;flex:none;position:relative;"><path d="M11.4 2.2 5.2 11.2h4l-.6 6.6 6.2-9h-4Z" style="fill:#FFFFFF;stroke:none;"></path></svg>
      <span style="position:relative;">Enter Stage</span>
      <svg viewBox="0 0 20 20" style="width:15px;height:15px;flex:none;position:relative;transform:translateX(calc(var(--lift,0)*4px));"><path d="M4 10h11M10.4 5.4 15 10l-4.6 4.6" style="fill:none;stroke:rgba(255,255,255,.9);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;"></path></svg>
    </button>`;
}

function coverBlock(module) {
  const url = module.coverImage;
  if (url) {
    return `<div style="position:absolute;inset:0;background:#0E2418 center/cover no-repeat url('${esc(url)}');"></div>`;
  }
  return `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#E9E3D4,#F5EDD6);display:grid;place-items:center;color:#B4881B;font-size:11px;font-weight:700;letter-spacing:.2em;">MODULE</div>`;
}

function mentorBlock(module) {
  const url = module.mentorProfilePicture;
  if (url) {
    return `<div style="position:absolute;inset:0;background:#0E2418 center/cover no-repeat url('${esc(url)}');"></div>`;
  }
  return `<div style="position:absolute;inset:0;background:linear-gradient(135deg,#123021,#0E2418);display:grid;place-items:center;color:#E8C86A;font-size:14px;font-weight:700;">M</div>`;
}

export function buildCardHtml(module, index, isPaid) {
  const pct = Math.max(0, Math.min(100, Number(module.userProgress?.completionPercentage) || 0));
  const isDone = pct >= 100;
  const isStarted = pct > 0 && !isDone;
  const unlocked = true;
  const difficulty = DIFFICULTY_LABEL[module.difficulty] || (module.difficulty || '').toUpperCase();
  const levelLabel = LEVEL_LABEL_BY_INDEX[index] || `LEVEL ${index + 1}`;
  const timeMin = module.estimatedCompletionTime || 60;
  const chapters = module.chapters?.length || 0;
  const delayNode = 900 + index * 120;
  const delayCard = 1040 + index * 100;
  const successGlow = isDone ? 'radial-gradient(circle at 50% 30%,rgba(23,163,74,.14),transparent 66%)' : 'transparent';

  return `<div style="display:flex;flex-direction:column;align-items:center;">
    <span style="font-size:11px;font-weight:700;letter-spacing:.19em;color:#7A5F08;animation:fadeUp 600ms cubic-bezier(.22,1,.36,1) ${delayNode}ms both;">${esc(levelLabel)}</span>
    <div data-node="${index}" style="position:relative;width:86px;height:86px;margin-top:10px;display:grid;place-items:center;cursor:pointer;transform:scale(calc(1 + var(--nh,0)*.07));animation:fadeUp 620ms cubic-bezier(.22,1,.36,1) ${delayNode + 60}ms both;">
      <div style="position:absolute;inset:-2px;border-radius:50%;border:1.4px dashed rgba(201,162,39,.65);opacity:calc(var(--nh,0)*.95);animation:spin 18s linear infinite;"></div>
      <div style="position:absolute;inset:-16px;border-radius:50%;background:radial-gradient(circle closest-side,rgba(201,162,39,calc(.30*var(--nh,0))),transparent 70%);"></div>
      ${nodeIcon(index, isDone)}
    </div>

    <article data-card="${index}" data-level="${index}" data-reveal data-progress="${pct}" data-enter="${esc(module._id)}" style="position:relative;width:100%;flex:1;margin-top:20px;display:flex;flex-direction:column;border-radius:24px;background:#FFFFFF;transform-style:preserve-3d;will-change:transform;animation:fadeUp 760ms cubic-bezier(.22,1,.36,1) ${delayCard}ms both;transform:perspective(1200px) rotateX(calc(var(--rx,0)*1deg)) rotateY(calc(var(--ry,0)*1deg)) translate3d(0,calc(var(--lift,0)*-12px),0);opacity:calc(1 - var(--dim,0)*.10);box-shadow:0 2px 4px rgba(18,42,30,.04),0 24px 46px -32px rgba(18,42,30,.34),0 34px 60px -34px rgba(18,42,30,calc(.30*var(--lift,0)));">
      <div style="position:absolute;inset:0;border-radius:24px;pointer-events:none;border:1.4px solid rgba(201,162,39,calc(.60*var(--lift,0)));"></div>
      <div style="position:absolute;left:0;right:0;top:0;height:26px;border-radius:24px 24px 0 0;overflow:hidden;pointer-events:none;opacity:var(--lift,0);">
        <div style="position:absolute;top:0;left:0;height:2px;width:42%;background:linear-gradient(90deg,transparent,#F0DA9E,transparent);animation:edgeTravel 2.6s cubic-bezier(.45,0,.55,1) infinite;"></div>
      </div>
      <div style="position:absolute;inset:0;border-radius:24px;pointer-events:none;opacity:calc(var(--flash,0)*.9);background:radial-gradient(circle at 50% 40%,rgba(201,162,39,.22),transparent 68%);"></div>
      ${isDone ? '<div style="position:absolute;inset:0;border-radius:24px;pointer-events:none;background:' + successGlow + ';opacity:0;animation:successGlow 1800ms ease-out 900ms both;animation-play-state:var(--play,paused);"></div>' : ''}

      <div style="position:relative;margin:18px 18px 0;aspect-ratio:16/10;transform-style:preserve-3d;">
        <div style="position:absolute;inset:0;border-radius:16px;overflow:hidden;background:#E9E3D4;">
          <div style="position:absolute;inset:0;transform:scale(calc(1 + var(--lift,0)*.055)) translate3d(calc(var(--px,0)*-4px),calc(var(--py,0)*-4px),0);">
            ${coverBlock(module)}
          </div>
          <div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(9,26,17,0) 48%,rgba(9,26,17,.5));"></div>
        </div>
        <div style="position:absolute;left:13px;bottom:13px;pointer-events:none;transform:translateZ(30px) translate3d(calc(var(--px,0)*-5px),calc(var(--py,0)*-5px),0);">
          <span style="display:inline-block;padding:6px 13px;border-radius:999px;font-size:9.5px;font-weight:700;letter-spacing:.15em;color:#FFFFFF;background:rgba(12,33,22,calc(.62 + .25*var(--lift,0)));border:1px solid rgba(232,200,106,calc(.25 + .55*var(--lift,0)));">${esc(difficulty || 'MODULE')}</span>
        </div>
      </div>

      <div style="padding:16px 20px 20px;display:flex;flex-direction:column;flex:1;transform:translateZ(12px);">
        <div style="width:46px;height:46px;border-radius:50%;padding:2px;background:linear-gradient(170deg,#E7CE7C,#B4881B);box-shadow:0 8px 18px -12px rgba(120,90,14,.9);transform:translateZ(22px) translate3d(calc(var(--px,0)*-3px),calc(var(--py,0)*-3px),0);">
          <div style="position:relative;width:100%;height:100%;border-radius:50%;overflow:hidden;background:#0E2418;">
            ${mentorBlock(module)}
          </div>
        </div>

        <h3 style="margin:15px 0 0;font-size:clamp(16.5px,1.28vw,19px);font-weight:700;line-height:1.32;letter-spacing:-.01em;color:#22313C;min-height:2.6em;text-wrap:pretty;">${esc(module.title || 'Untitled module')}</h3>
        <p style="margin:9px 0 0;font-size:13px;line-height:1.6;color:#5F6D64;min-height:3.2em;">${esc(module.description || '')}</p>

        <div style="display:flex;align-items:center;gap:22px;margin-top:14px;">
          <span style="display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:500;color:#4C594F;">
            <svg viewBox="0 0 18 18" style="width:15px;height:15px;flex:none;"><circle cx="9" cy="9" r="6.6" style="fill:none;stroke:#96741A;stroke-width:1.5;"></circle><path d="M9 5.6V9l2.6 1.6" style="fill:none;stroke:#96741A;stroke-width:1.5;stroke-linecap:round;"></path></svg>
            ${timeMin} min
          </span>
          <span style="display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:500;color:#4C594F;">
            <svg viewBox="0 0 18 18" style="width:15px;height:15px;flex:none;"><path d="M2.6 4.4c2.2-1 3.9-1 6.4 0 2.5-1 4.2-1 6.4 0v9.2c-2.2-1-3.9-1-6.4 0-2.5-1-4.2-1-6.4 0zM9 4.4v9.2" style="fill:none;stroke:#96741A;stroke-width:1.5;stroke-linejoin:round;"></path></svg>
            ${chapters} chapters
          </span>
        </div>

        ${module.aiInteractionEnabled ? `<div style="display:flex;align-items:center;gap:9px;margin-top:11px;">
          <span style="position:relative;width:14px;height:14px;flex:none;transform:translateZ(18px);">
            <span style="position:absolute;left:4px;top:4px;width:6px;height:6px;border-radius:50%;background:#C9A227;animation:breathe 3s ease-in-out infinite;"></span>
            <span style="position:absolute;inset:0;animation:spin 7s linear infinite;">
              <span style="position:absolute;left:5.5px;top:-1px;width:3px;height:3px;border-radius:50%;background:rgba(201,162,39,.85);"></span>
            </span>
          </span>
          <span style="font-size:12.5px;font-weight:600;color:#7E6209;">AI boss available</span>
        </div>` : ''}

        <div style="margin-top:auto;padding-top:18px;transform:translateZ(16px);">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;">
            <span style="font-size:10px;font-weight:700;letter-spacing:.15em;color:#67736A;">COMPLETION</span>
            ${completionNum(pct, isDone, isStarted)}
          </div>
          ${progressBar(pct, isDone, isStarted)}

          <div style="height:1px;margin:18px 0 0;background:#F0EADB;"></div>

          ${actionButton(module, isDone, isPaid, unlocked)}
        </div>
      </div>
    </article>
  </div>`;
}

// Empty-state placeholder used when the modules list is empty.
export const EMPTY_STATE_HTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;">
  <div style="font-size:48px;margin-bottom:16px;color:#C9A227;">◆</div>
  <h3 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#22313C;">The arena is empty</h3>
  <p style="margin:0;font-size:14px;color:#5F6D64;">Check back soon for new challenge stages.</p>
</div>`;
