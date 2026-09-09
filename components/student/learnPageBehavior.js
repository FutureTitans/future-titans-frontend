// Behavior for the "Choose Your Level" learn page.
// Ported from the DCLogic <script data-dc-script> block inside `Learn Page.dc.html`
// (Claude Design import). Call initLearnPage(rootEl) after the HTML is mounted;
// it returns a cleanup fn. The optional `onNav(href)` handler is called when a
// nav button or Enter/Review button is clicked so callers can route via Next.js.

export function initLearnPage(root, { onNav, motion = 'Cinematic', networkDensity = 0.8, cursorLight = true } = {}) {
  if (!root) return () => {};
  const listeners = [];
  const on = (target, ev, fn, opts) => { target.addEventListener(ev, fn, opts); listeners.push(() => target.removeEventListener(ev, fn, opts)); };
  const q = (sel) => Array.prototype.slice.call(document.querySelectorAll(sel));
  const doc = document;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  let reduced = prefersReduced || motion === 'Off';
  let slow = motion === 'Calm' ? 0.45 : 1;

  const state = {
    mx: 0.5, my: 0.34, sx: 0.5, sy: 0.34,
    rx: -9999, ry: -9999,
    vars: [], nodes: [], pulses: [],
    jour: { c: 0, t: 0 },
    surge: { c: 0, t: 0, a: 0, at: 0 },
    trav: 0, zapT: 1, focusI: -1,
    last: performance.now(), needPath: true,
    framesRan: false, staticPainted: false, journeyStarted: false,
    lightEl: null, canvas: null, ctx: null, nodeCount: 0,
    pathEl: null, fillEl: null, pulseEl: null, surgeEl: null, zapEl: null,
    headEl: null, haloEl: null, pingEl: null, pathLen: 0, nodeT: [0],
    cards: [], nodeEls: [], btnList: [],
  };

  const fmt = (n) => String(Math.round(n * 1000) / 1000);

  // Interpolated CSS variables, driven by RAF loop.
  const v = (el, name, target, k) => {
    if (!el) return;
    const store = el.__v || (el.__v = {});
    let s = store[name];
    if (!s) { s = store[name] = { el, name, c: 0, t: 0, k: k || 0.14 }; state.vars.push(s); }
    s.t = target; if (k) s.k = k;
    if (reduced) { s.c = target; el.style.setProperty('--' + name, fmt(target)); }
  };

  // ── style-hover / style-focus (from dc-runtime `support.js`) ─────────
  const applyStyleAttr = (el, attr, prev) => {
    const decls = (el.getAttribute(attr) || '').split(';').map((d) => d.trim()).filter(Boolean);
    decls.forEach((decl) => {
      const idx = decl.indexOf(':');
      if (idx <= 0) return;
      const prop = decl.slice(0, idx).trim();
      const val = decl.slice(idx + 1).trim();
      if (!(prop in prev)) prev[prop] = el.style.getPropertyValue(prop);
      el.style.setProperty(prop, val);
    });
  };
  const revertStyleAttr = (el, prev) => {
    Object.keys(prev).forEach((prop) => { el.style.setProperty(prop, prev[prop] || ''); delete prev[prop]; });
  };
  q('[style-hover]').forEach((el) => {
    const prev = {};
    on(el, 'mouseenter', () => applyStyleAttr(el, 'style-hover', prev));
    on(el, 'mouseleave', () => revertStyleAttr(el, prev));
  });
  q('[style-focus]').forEach((el) => {
    const prev = {};
    on(el, 'focus', () => applyStyleAttr(el, 'style-focus', prev));
    on(el, 'blur', () => revertStyleAttr(el, prev));
  });

  // ── Client-side navigation for nav buttons and card enter buttons ────
  const nav = (href) => { if (onNav) onNav(href); else window.location.assign(href); };
  q('[data-nav-href]').forEach((el) => on(el, 'click', () => nav(el.getAttribute('data-nav-href'))));

  // ── Reveal (progress bar animation) ──────────────────────────────────
  const reveal = (el) => {
    if (!el || el.__rv) return; el.__rv = 1;
    el.style.setProperty('--play', 'running');
    const target = parseFloat(el.getAttribute('data-progress') || '0');
    const num = el.querySelector('[data-num]');
    if (reduced) {
      el.style.setProperty('--p', String(target));
      if (num) num.textContent = Math.round(target) + '%';
      return;
    }
    const t0 = performance.now() + 200; const dur = 1150;
    const step = () => {
      const p = Math.max(0, Math.min(1, (performance.now() - t0) / dur));
      const e = 1 - Math.pow(1 - p, 3);
      const val = target * e;
      el.style.setProperty('--p', val.toFixed(2));
      if (num) num.textContent = Math.round(val) + '%';
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // ── Focus (card + node hover; drives 3D tilt via CSS vars) ───────────
  const focus = (i) => {
    if (state.focusI === i) return;
    state.focusI = i;
    state.cards.forEach((c, k) => {
      v(c, 'lift', k === i ? 1 : 0, 0.13);
      v(c, 'dim', i >= 0 && k !== i ? 1 : 0, 0.11);
      if (k !== i) { v(c, 'rx', 0, 0.1); v(c, 'ry', 0, 0.1); v(c, 'px', 0, 0.1); v(c, 'py', 0, 0.1); }
    });
    state.nodeEls.forEach((n, k) => v(n, 'nh', k === i ? 1 : 0, 0.18));
    if (i >= 0 && state.nodeT) { state.surge.t = state.nodeT[i]; state.surge.at = 0.95; }
    else state.surge.at = 0;
  };

  const zap = () => { if (!reduced) state.zapT = 0; };

  const ripple = (b, e) => {
    const rp = b.querySelector('[data-ripple]');
    if (!rp) return;
    const r = b.getBoundingClientRect();
    rp.style.setProperty('--rx', (e.clientX - r.left) + 'px');
    rp.style.setProperty('--ry', (e.clientY - r.top) + 'px');
    rp.style.animation = 'none';
    // Force reflow so the animation restarts.
    void rp.offsetWidth;
    rp.style.animation = 'rippleOut 640ms cubic-bezier(.22,1,.36,1)';
  };

  // ── Wire cards / nodes / buttons ─────────────────────────────────────
  const wire = () => {
    if (!state.lightEl) state.lightEl = doc.querySelector('[data-light]');
    if (!state.canvas) {
      state.canvas = doc.querySelector('[data-net]');
      if (state.canvas) { sizeCanvas(); initNet(); }
    }

    q('[data-reveal]').forEach((el) => {
      if (el.__ob) return; el.__ob = 1;
      if (io) io.observe(el); else reveal(el);
    });

    state.cards = q('[data-card]');
    state.cards.forEach((card, i) => {
      if (card.__w) return; card.__w = 1;
      if (fine) {
        on(card, 'pointerenter', () => focus(i));
        on(card, 'pointerleave', () => focus(-1));
        on(card, 'pointermove', (e) => {
          if (reduced) return;
          const b = card.getBoundingClientRect();
          const nx = ((e.clientX - b.left) / b.width - 0.5) * 2;
          const ny = ((e.clientY - b.top) / b.height - 0.5) * 2;
          v(card, 'ry', nx * 3.1, 0.13);
          v(card, 'rx', -ny * 2.1, 0.13);
          v(card, 'px', nx, 0.13);
          v(card, 'py', ny, 0.13);
        });
      } else {
        on(card, 'pointerdown', () => focus(state.focusI === i ? -1 : i));
      }
    });

    state.nodeEls = q('[data-node]');
    state.nodeEls.forEach((n, i) => {
      if (n.__w) return; n.__w = 1;
      if (fine) {
        on(n, 'pointerenter', () => focus(i));
        on(n, 'pointerleave', () => focus(-1));
      }
      on(n, 'click', () => { focus(i); zap(); });
    });

    state.btnList = q('[data-btn]');
    state.btnList.forEach((b) => {
      if (b.__w) return; b.__w = 1;
      if (fine) {
        on(b, 'pointerenter', () => { b.__s = performance.now(); });
        on(b, 'pointermove', (e) => {
          if (reduced) return;
          const r = b.getBoundingClientRect();
          v(b, 'bx', ((e.clientX - r.left) / r.width - 0.5) * 9, 0.2);
          v(b, 'by', ((e.clientY - r.top) / r.height - 0.5) * 4, 0.2);
        });
        on(b, 'pointerleave', () => { v(b, 'bx', 0, 0.16); v(b, 'by', 0, 0.16); });
      }
      on(b, 'pointerdown', (e) => { v(b, 'press', 1, 0.42); ripple(b, e); });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => on(b, t, () => v(b, 'press', 0, 0.2)));
      on(b, 'click', () => {
        const card = b.closest('[data-card]');
        if (card) {
          const i = parseInt(card.getAttribute('data-level'), 10) || 0;
          focus(i);
          v(card, 'flash', 1, 0.5);
          setTimeout(() => v(card, 'flash', 0, 0.09), 110);
        }
        zap();
        const enter = b.getAttribute('data-enter');
        if (enter) nav('/student/modules/' + enter);
      });
    });
  };

  // Intersection observer for revealing cards when they scroll into view.
  const io = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); } });
  }, { threshold: 0.22 }) : null;

  // ── SVG journey path connecting the node circles ─────────────────────
  const buildPath = () => {
    const wrap = doc.querySelector('[data-journey]');
    const svg = doc.querySelector('[data-path]');
    if (!wrap || !svg) return;
    const nodes = q('[data-node]');
    if (nodes.length < 2) return;
    const r = wrap.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const pts = nodes.map((n) => {
      const b = n.getBoundingClientRect();
      return { x: b.left - r.left + b.width / 2, y: b.top - r.top + b.height / 2 };
    });
    svg.setAttribute('viewBox', '0 0 ' + r.width.toFixed(1) + ' ' + r.height.toFixed(1));
    svg.setAttribute('width', r.width.toFixed(1));
    svg.setAttribute('height', r.height.toFixed(1));
    const seg = (a, b) => {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      if (Math.abs(b.y - a.y) > Math.abs(b.x - a.x)) {
        return ' C ' + a.x.toFixed(1) + ' ' + my.toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + my.toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
      }
      return ' C ' + mx.toFixed(1) + ' ' + a.y.toFixed(1) + ', ' + mx.toFixed(1) + ' ' + b.y.toFixed(1) + ', ' + b.x.toFixed(1) + ' ' + b.y.toFixed(1);
    };
    let d = 'M ' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    const prefixes = [];
    for (let i = 1; i < pts.length; i++) { d += seg(pts[i - 1], pts[i]); prefixes.push(d); }
    ['[data-base]', '[data-dash]', '[data-fill]', '[data-pulse]', '[data-surge]', '[data-zap]'].forEach((s) => {
      const el = svg.querySelector(s); if (el) el.setAttribute('d', d);
    });
    state.pathEl = svg.querySelector('[data-base]');
    state.fillEl = svg.querySelector('[data-fill]');
    state.pulseEl = svg.querySelector('[data-pulse]');
    state.surgeEl = svg.querySelector('[data-surge]');
    state.zapEl = svg.querySelector('[data-zap]');
    state.headEl = svg.querySelector('[data-head]');
    state.haloEl = svg.querySelector('[data-halo]');
    state.pingEl = svg.querySelector('[data-ping]');
    state.pathLen = state.pathEl.getTotalLength();
    const measure = svg.querySelector('[data-measure]');
    state.nodeT = [0];
    if (measure && state.pathLen) {
      prefixes.forEach((dd) => { measure.setAttribute('d', dd); state.nodeT.push(Math.min(1, measure.getTotalLength() / state.pathLen)); });
    } else { state.nodeT = pts.map((_, i) => i / Math.max(1, pts.length - 1)); }
    const g = svg.querySelector('#jg');
    if (g && pts.length > 1) {
      const last = pts[pts.length - 1];
      const vert = Math.abs(last.y - pts[0].y) > Math.abs(last.x - pts[0].x);
      g.setAttribute('x1', '0'); g.setAttribute('y1', '0');
      g.setAttribute('x2', vert ? '0' : '1'); g.setAttribute('y2', vert ? '1' : '0');
    }
    state.needPath = false;
    if (!state.journeyStarted) {
      state.journeyStarted = true;
      // Aggregate progress across all cards to drive how far the golden head has traveled.
      const totalPct = state.cards.reduce((sum, c) => sum + (parseFloat(c.getAttribute('data-progress')) || 0), 0);
      const total = totalPct / Math.max(1, state.cards.length * 100);
      state.surge.c = total;
      if (reduced) state.jour.t = total;
      else state.timers.push(setTimeout(() => { state.jour.t = total; }, 950));
    }
  };

  const paintPathStatic = () => {
    if (!state.pathLen || !state.fillEl || state.staticPainted || state.framesRan) return;
    const L = state.pathLen;
    const totalPct = state.cards.reduce((sum, c) => sum + (parseFloat(c.getAttribute('data-progress')) || 0), 0);
    const t = totalPct / Math.max(1, state.cards.length * 100);
    state.fillEl.style.strokeDasharray = (t * L).toFixed(1) + ' ' + (L + 40);
    const pt = state.pathEl.getPointAtLength(t * L);
    [state.headEl, state.haloEl, state.pingEl].forEach((el) => {
      if (!el) return; el.setAttribute('cx', pt.x.toFixed(1)); el.setAttribute('cy', pt.y.toFixed(1));
    });
    state.staticPainted = true;
    if (reduced) state.jour.c = t;
  };

  const updatePath = (dt) => {
    if (state.needPath) buildPath();
    if (!state.pathLen || !state.fillEl) return;
    const L = state.pathLen;
    state.jour.c += (state.jour.t - state.jour.c) * Math.min(1, dt * 2.4);
    state.fillEl.style.strokeDasharray = (state.jour.c * L).toFixed(1) + ' ' + (L + 40);
    const pt = state.pathEl.getPointAtLength(Math.max(0.001, state.jour.c * L));
    [state.headEl, state.haloEl, state.pingEl].forEach((el) => {
      if (!el) return;
      el.setAttribute('cx', pt.x.toFixed(1));
      el.setAttribute('cy', pt.y.toFixed(1));
      el.style.opacity = state.jour.c > 0.01 ? '1' : '0';
    });
    if (!reduced && state.pulseEl) {
      state.trav += dt * 0.15 * slow;
      if (state.trav > 1.18) state.trav = -0.08;
      const seg = 0.055 * L;
      state.pulseEl.style.strokeDasharray = seg.toFixed(1) + ' ' + (L + 40);
      state.pulseEl.style.strokeDashoffset = (-state.trav * L).toFixed(1);
      const fade = Math.max(0, Math.min(1, Math.min(state.trav * 7, (1 - state.trav) * 7)));
      state.pulseEl.style.opacity = (fade * 0.85).toFixed(2);
    }
    if (state.surgeEl) {
      state.surge.c += (state.surge.t - state.surge.c) * Math.min(1, dt * 5.5);
      state.surge.a += (state.surge.at - state.surge.a) * Math.min(1, dt * 7);
      const seg = 0.11 * L;
      state.surgeEl.style.strokeDasharray = seg.toFixed(1) + ' ' + (L + 40);
      state.surgeEl.style.strokeDashoffset = (-(state.surge.c * L - seg / 2)).toFixed(1);
      state.surgeEl.style.opacity = (state.surge.a * 0.9).toFixed(2);
    }
    if (state.zapEl) {
      if (state.zapT < 1) {
        state.zapT = Math.min(1, state.zapT + dt / 0.78);
        const seg = 0.14 * L;
        const e = 1 - Math.pow(1 - state.zapT, 2.2);
        state.zapEl.style.strokeDasharray = seg.toFixed(1) + ' ' + (L + 40);
        state.zapEl.style.strokeDashoffset = (-(e * (L + seg) - seg)).toFixed(1);
        state.zapEl.style.opacity = (Math.sin(Math.PI * state.zapT) * 0.9).toFixed(2);
      } else if (state.zapEl.style.opacity !== '0') state.zapEl.style.opacity = '0';
    }
  };

  // ── Background canvas network (particles + connecting lines) ─────────
  const targetCount = () => {
    const base = window.innerWidth < 760 ? 16 : 38;
    const d = networkDensity == null ? 0.8 : networkDensity;
    return Math.max(6, Math.round(base * (0.4 + d * 0.75)));
  };
  const sizeCanvas = () => {
    const c = state.canvas; if (!c) return;
    const d = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth, h = window.innerHeight;
    c.width = Math.round(w * d); c.height = Math.round(h * d);
    c.style.width = w + 'px'; c.style.height = h + 'px';
    state.ctx = c.getContext('2d');
    if (state.ctx) state.ctx.setTransform(d, 0, 0, d, 0, 0);
    state.drewOnce = false;
  };
  const initNet = () => {
    const w = window.innerWidth, h = window.innerHeight;
    const n = targetCount();
    state.nodeCount = n;
    state.nodes = [];
    for (let i = 0; i < n; i++) {
      state.nodes.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 9, vy: (Math.random() - 0.5) * 9,
        g: Math.random() < 0.22, s: 1 + Math.random() * 1.1,
      });
    }
    state.pulses = [{}, {}, {}].map((p) => { assignPulse(p); return p; });
    state.drewOnce = false;
  };
  const assignPulse = (p) => {
    const n = state.nodes.length;
    p.a = Math.floor(Math.random() * n); p.b = Math.floor(Math.random() * n); p.t = 0;
  };
  const drawNet = (dt) => {
    const ctx = state.ctx; if (!ctx || !state.nodes.length) return;
    if (reduced && state.drewOnce) return;
    const w = window.innerWidth, h = window.innerHeight;
    const ns = state.nodes, px = state.rx, py = state.ry;
    ctx.clearRect(0, 0, w, h);
    if (!reduced) {
      for (let i = 0; i < ns.length; i++) {
        const n = ns[i];
        n.x += n.vx * dt * slow; n.y += n.vy * dt * slow;
        if (px > -500) {
          const dx = px - n.x, dy = py - n.y, d2 = dx * dx + dy * dy;
          if (d2 < 44000) { const f = 1 - Math.sqrt(d2) / 210; n.x += dx * f * 0.014; n.y += dy * f * 0.014; }
        }
        if (n.x < -30) n.x = w + 30; else if (n.x > w + 30) n.x = -30;
        if (n.y < -30) n.y = h + 30; else if (n.y > h + 30) n.y = -30;
      }
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i], b = ns[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 172) {
          ctx.strokeStyle = 'rgba(20,64,44,' + ((1 - d / 172) * 0.12).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (let i = 0; i < ns.length; i++) {
      const n = ns[i];
      let al = 0.15, rr = n.s;
      if (px > -500) {
        const dx = px - n.x, dy = py - n.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < 230) { const f = 1 - d / 230; al += f * 0.5; rr += f * 1.5; }
      }
      ctx.fillStyle = n.g
        ? 'rgba(201,162,39,' + Math.min(0.85, al + 0.12).toFixed(3) + ')'
        : 'rgba(18,58,40,' + al.toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(n.x, n.y, rr, 0, 6.2832); ctx.fill();
    }
    if (!reduced) {
      for (let i = 0; i < state.pulses.length; i++) {
        const p = state.pulses[i];
        p.t += dt * 0.2 * slow;
        if (p.t > 1) { assignPulse(p); continue; }
        const a = ns[p.a], b = ns[p.b];
        if (!a || !b) { assignPulse(p); continue; }
        const dx = b.x - a.x, dy = b.y - a.y;
        if (Math.sqrt(dx * dx + dy * dy) > 340) { assignPulse(p); continue; }
        const fade = Math.sin(Math.PI * p.t);
        ctx.strokeStyle = 'rgba(201,162,39,' + (0.1 * fade).toFixed(3) + ')';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        ctx.fillStyle = 'rgba(214,178,58,' + (0.6 * fade).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(a.x + dx * p.t, a.y + dy * p.t, 1.8, 0, 6.2832); ctx.fill();
      }
    }
    state.drewOnce = true;
  };

  // ── Pointer / resize / scroll ────────────────────────────────────────
  const onMove = (e) => { state.rx = e.clientX; state.ry = e.clientY; state.mx = e.clientX / window.innerWidth; state.my = e.clientY / window.innerHeight; };
  const onLeave = () => { state.rx = -9999; state.ry = -9999; };
  const onResize = () => { state.needPath = true; sizeCanvas(); };
  const onScroll = () => { state.needPath = true; };
  if (fine) {
    on(window, 'pointermove', onMove, { passive: true });
    on(window, 'pointerleave', onLeave);
  }
  on(window, 'resize', onResize);
  on(window, 'scroll', onScroll, { passive: true });

  // ── Set initial CSS vars driven by props ─────────────────────────────
  doc.body.style.setProperty('--net', String(motion === 'Off' ? networkDensity * 0.5 : networkDensity));
  doc.body.style.setProperty('--lightMax', cursorLight && motion !== 'Off' ? '1' : '0');

  state.timers = [];
  wire();
  buildPath();
  [120, 420, 1000, 2000].forEach((t) => state.timers.push(setTimeout(() => { wire(); buildPath(); paintPathStatic(); }, t)));
  state.timers.push(setTimeout(() => { q('[data-reveal]').forEach((el) => reveal(el)); }, 2800));

  // Force any finite entrance animations to their end state if the timeline
  // never advances (hidden tab, print, etc.) so content is never stuck invisible.
  const settleEntrances = () => {
    if (!doc.getAnimations) return;
    doc.getAnimations().forEach((a) => {
      try { const t = a.effect && a.effect.getComputedTiming(); if (t && t.iterations !== Infinity) a.finish(); }
      catch (e) { /* still running or unfinishable */ }
    });
  };
  [1200, 2600, 5000].forEach((t) => state.timers.push(setTimeout(settleEntrances, t)));
  const onVis = () => { settleEntrances(); if (!doc.hidden) { state.needPath = true; state.last = performance.now(); } };
  on(doc, 'visibilitychange', onVis);

  // ── rAF loop ────────────────────────────────────────────────────────
  let raf = 0;
  const tick = (now) => {
    raf = requestAnimationFrame(tick);
    state.framesRan = true;
    const dt = Math.min(0.05, (now - state.last) / 1000);
    state.last = now;
    if (fine && !reduced && state.lightEl) {
      const e = Math.min(1, dt * 6);
      state.sx += (state.mx - state.sx) * e; state.sy += (state.my - state.sy) * e;
      state.lightEl.style.setProperty('--lx', (state.sx * window.innerWidth).toFixed(1) + 'px');
      state.lightEl.style.setProperty('--ly', (state.sy * window.innerHeight).toFixed(1) + 'px');
      state.lightEl.style.setProperty('--on', state.rx > -500 ? '1' : '0');
    }
    for (let i = 0; i < state.vars.length; i++) {
      const s = state.vars[i];
      if (Math.abs(s.t - s.c) > 0.0008) {
        s.c += (s.t - s.c) * Math.min(1, s.k * dt * 60);
        s.el.style.setProperty('--' + s.name, fmt(s.c));
      } else if (s.c !== s.t) {
        s.c = s.t; s.el.style.setProperty('--' + s.name, fmt(s.c));
      }
    }
    if (state.btnList) {
      for (let i = 0; i < state.btnList.length; i++) {
        const b = state.btnList[i];
        if (b.__s != null) {
          const p = (now - b.__s) / 720;
          if (p >= 1) { b.__s = null; b.style.setProperty('--sheen', '0'); }
          else b.style.setProperty('--sheen', (1 - Math.pow(1 - p, 2)).toFixed(3));
        }
      }
    }
    updatePath(dt);
    drawNet(dt);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    listeners.forEach((off) => off());
    if (raf) cancelAnimationFrame(raf);
    (state.timers || []).forEach(clearTimeout);
    if (io) io.disconnect();
    doc.body.style.removeProperty('--net');
    doc.body.style.removeProperty('--lightMax');
  };
}
