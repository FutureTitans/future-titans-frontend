// Behavior engine for the Youngpreneurs landing page.
// Faithful reimplementation of the design's DCLogic script: it drives CSS custom
// properties from scroll position, pointer movement, hover and viewport reveals.
// Call initHome(rootEl) once the markup is mounted; it returns a cleanup fn.

const INV = [
  { n: 'Workshops', d: 'Hands-on sessions where students practise the thinking behind an idea.' },
  { n: 'Hackathons', d: 'Time-bound challenges that turn a problem into a working attempt.' },
  { n: 'Expert Sessions', d: 'Practitioners share how decisions actually get made.' },
  { n: 'Live Q&As', d: 'Students ask directly, and learn how to ask better.' },
  { n: 'Mentor Interactions', d: 'Guidance from people a few steps further along.' },
  { n: 'Innovation Activities', d: 'Structured prompts that keep ideas moving forward.' },
  { n: 'AI Learning', d: 'Using AI intelligently and responsibly as a tool.' },
  { n: 'Peer Connections', d: 'Other young minds working on their own ideas.' },
  { n: 'Resource Library', d: 'Material students can return to across the year.' },
];

const PHOTO_WASH = 0.55;

export function initHome(root) {
  if (!root) return () => {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const listeners = [];
  const on = (target, ev, fn, opts) => {
    target.addEventListener(ev, fn, opts);
    listeners.push(() => target.removeEventListener(ev, fn, opts));
  };
  const q = (s) => root.querySelector(s);
  const list = (s) => Array.prototype.slice.call(root.querySelectorAll(s));

  root.style.setProperty('--wash', PHOTO_WASH);

  // ── Hover targets (--h) ──────────────────────────────────────────────
  list('[data-hv]').forEach((el) => {
    on(el, 'mouseenter', () => el.style.setProperty('--h', 1));
    on(el, 'mouseleave', () => el.style.setProperty('--h', 0));
  });
  list('[data-hvf]').forEach((el) => {
    on(el, 'focus', () => el.style.setProperty('--h', 1));
    on(el, 'blur', () => el.style.setProperty('--h', 0));
  });

  // ── style-hover (nav links dim) ──────────────────────────────────────
  list('[data-style-hover]').forEach((el) => {
    const decls = (el.getAttribute('data-style-hover') || '')
      .split(';')
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => {
        const i = d.indexOf(':');
        return [d.slice(0, i).trim(), d.slice(i + 1).trim()];
      });
    const prev = {};
    on(el, 'mouseenter', () => {
      decls.forEach(([p, v]) => { prev[p] = el.style.getPropertyValue(p); el.style.setProperty(p, v); });
    });
    on(el, 'mouseleave', () => {
      decls.forEach(([p]) => { el.style.setProperty(p, prev[p] || ''); });
    });
  });

  // ── Group hover (hero capability web + Innovation Club list) ─────────
  list('[data-group]').forEach((group) => {
    const isInv = group.hasAttribute('data-invgroup');
    const nameEl = isInv ? root.querySelector('[data-inv-name]') : null;
    const descEl = isInv ? root.querySelector('[data-inv-desc]') : null;
    let cur = 0;
    on(group, 'mouseover', (e) => {
      const t = e.target.closest ? e.target.closest('[data-i]') : null;
      if (!t || !group.contains(t)) return;
      group.style.setProperty('--dim', 1);
      Array.prototype.slice.call(group.querySelectorAll('[data-i]')).forEach((n, k) => {
        const active = n === t;
        n.style.setProperty('--h', active ? 1 : 0);
        group.style.setProperty('--l' + k, active ? 1 : 0);
      });
      if (isInv) {
        const i = parseInt(t.getAttribute('data-i'), 10) || 0;
        if (i !== cur) {
          cur = i;
          const item = INV[i] || INV[0];
          if (nameEl) nameEl.textContent = item.n;
          if (descEl) descEl.textContent = item.d;
        }
      }
    });
    on(group, 'mouseout', () => {
      group.style.setProperty('--dim', 0);
      Array.prototype.slice.call(group.querySelectorAll('[data-i]')).forEach((n, k) => {
        n.style.setProperty('--h', 0);
        group.style.setProperty('--l' + k, 0);
      });
    });
  });

  // ── Login dropdown ───────────────────────────────────────────────────
  const loginRoot = q('[data-login]');
  const loginToggle = q('[data-login-toggle]');
  const loginMenu = q('[data-login-menu]');
  const loginCaret = q('[data-login-caret]');
  if (loginRoot && loginToggle && loginMenu) {
    let loginOpen = false;
    const setLoginOpen = (v) => {
      loginOpen = v;
      loginMenu.style.opacity = v ? '1' : '0';
      loginMenu.style.pointerEvents = v ? 'auto' : 'none';
      loginMenu.style.transform = v ? 'translateY(0)' : 'translateY(-6px)';
      if (loginCaret) loginCaret.style.transform = v ? 'rotate(180deg)' : 'rotate(0deg)';
      loginToggle.setAttribute('aria-expanded', v ? 'true' : 'false');
    };
    on(loginToggle, 'click', (e) => { e.stopPropagation(); setLoginOpen(!loginOpen); });
    on(document, 'click', (e) => {
      if (!loginRoot.contains(e.target)) setLoginOpen(false);
    });
    on(document, 'keydown', (e) => { if (e.key === 'Escape') setLoginOpen(false); });
  }

  // ── Cursor label zones (--cur) ───────────────────────────────────────
  const cursorLabel = q('[data-cursor-label]');
  list('[data-zone]').forEach((el) => {
    on(el, 'mouseenter', () => {
      const label = el.getAttribute('data-label') || 'Explore';
      if (cursorLabel) cursorLabel.textContent = label;
      root.style.setProperty('--cur', 1);
    });
    on(el, 'mouseleave', () => root.style.setProperty('--cur', 0));
  });

  // ── Pointer: custom cursor position + hero parallax ──────────────────
  const onMove = (e) => {
    root.style.setProperty('--cx', e.clientX + 'px');
    root.style.setProperty('--cy', e.clientY + 'px');
    if (reduced) return;
    const hero = q('[data-hero]');
    if (!hero) return;
    const b = hero.getBoundingClientRect();
    if (b.bottom < 0 || b.top > window.innerHeight) return;
    hero.style.setProperty('--mx', ((e.clientX - b.left) / b.width - 0.5).toFixed(3));
    hero.style.setProperty('--my', ((e.clientY - b.top) / b.height - 0.5).toFixed(3));
  };
  on(window, 'mousemove', onMove, { passive: true });

  // ── Reveal / counter / unlock collections ────────────────────────────
  let rvEls = [];
  let cntEls = [];
  let capEls = [];
  const scan = () => {
    rvEls = list('[data-rv]');
    cntEls = list('[data-to]');
    capEls = list('[data-cap]');
    rvEls.forEach((el) => {
      if (el.getAttribute('data-rv-init')) return;
      el.setAttribute('data-rv-init', '1');
      if (reduced) return;
      if (el.getBoundingClientRect().top > window.innerHeight * 0.88) {
        el.style.setProperty('--rv', 0);
        el.style.setProperty('--rvy', '26px');
      }
    });
  };

  const checkReveals = () => {
    const vh = window.innerHeight;
    rvEls.forEach((el) => {
      if (el.getAttribute('data-rv-done')) return;
      if (el.getBoundingClientRect().top >= vh * 0.88) return;
      el.setAttribute('data-rv-done', '1');
      const d = reduced ? 0 : (parseInt(el.getAttribute('data-rv'), 10) || 0);
      window.setTimeout(() => {
        el.style.setProperty('--rv', 1);
        el.style.setProperty('--rvy', '0px');
      }, d);
    });
  };

  const checkCounters = () => {
    const vh = window.innerHeight;
    cntEls.forEach((el) => {
      if (el.getAttribute('data-counted')) return;
      const b = el.getBoundingClientRect();
      if (b.top > vh * 0.82 || b.bottom < 0) return;
      el.setAttribute('data-counted', '1');
      const to = parseInt(el.getAttribute('data-to'), 10) || 0;
      if (reduced) { el.textContent = to.toLocaleString('en-IN'); return; }
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min(1, (now - t0) / 1600);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))).toLocaleString('en-IN');
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  let unlockTimer = 0;
  const checkUnlocks = () => {
    const bar = q('[data-unlock]');
    if (!bar) return;
    const vh = window.innerHeight;
    capEls.forEach((el) => {
      if (el.getAttribute('data-cap-done')) return;
      const b = el.getBoundingClientRect();
      if (b.top > vh * 0.55 || b.bottom < vh * 0.3) return;
      el.setAttribute('data-cap-done', '1');
      const label = bar.querySelector('[data-unlock-name]');
      if (label) label.textContent = el.getAttribute('data-cap');
      root.style.setProperty('--unlock', 1);
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => root.style.setProperty('--unlock', 0), 2900);
    });
  };

  // local scroll progress of a tall pinned section
  const lp = (el) => {
    const r = el.getBoundingClientRect();
    const span = el.offsetHeight - window.innerHeight;
    return Math.max(0, Math.min(1, -r.top / Math.max(1, span)));
  };
  const flags = (el, pre, n, idx, upto) => {
    for (let i = 0; i < n; i++) {
      el.style.setProperty(pre + i, upto ? (i <= idx ? 1 : 0) : (i === idx ? 1 : 0));
    }
  };

  const tick = () => {
    const de = document.documentElement;
    const y = window.scrollY || de.scrollTop;
    const p = y / Math.max(1, de.scrollHeight - window.innerHeight);
    root.style.setProperty('--prog', p.toFixed(4));
    root.style.setProperty('--nav', y > 70 ? 1 : 0);
    root.style.setProperty('--railOn', y > window.innerHeight * 0.75 ? 1 : 0);

    const th = [0.05, 0.24, 0.44, 0.62, 0.8];
    const rail = q('[data-rail]');
    if (rail) for (let i = 0; i < 5; i++) rail.style.setProperty('--r' + i, p >= th[i] ? 1 : 0);

    const story = q('[data-story]');
    if (story) {
      const v = lp(story);
      story.style.setProperty('--sp', v.toFixed(3));
      flags(story, '--f', 5, Math.min(4, Math.floor(v * 5.35)), false);
    }
    const pipe = q('[data-pipeline]');
    if (pipe) {
      const v = lp(pipe);
      pipe.style.setProperty('--pp', v.toFixed(3));
      flags(pipe, '--s', 8, Math.min(7, Math.floor(v * 9)), true);
    }
    const tit = q('[data-titans]');
    if (tit) {
      const v = lp(tit);
      tit.style.setProperty('--tp', v.toFixed(4));
      flags(tit, '--st', 8, Math.min(7, Math.floor(v * 8.4)), true);
      const track = tit.querySelector('[data-track]');
      if (track && track.parentElement) {
        const shift = track.parentElement.clientWidth - track.scrollWidth;
        tit.style.setProperty('--shift', Math.min(0, shift) + 'px');
      }
    }
    const verbs = q('[data-verbs]');
    if (verbs) {
      const v = lp(verbs);
      flags(verbs, '--v', 8, Math.min(7, Math.floor(v * 8.4)), false);
    }
    const hai = q('[data-hai]');
    if (hai) {
      const v = lp(hai);
      hai.style.setProperty('--cp', v.toFixed(4));
      flags(hai, '--q', 3, Math.min(2, Math.floor(v * 3.4)), true);
    }
    const exp = q('[data-exposure]');
    if (exp) {
      exp.style.setProperty('--ep', lp(exp).toFixed(4));
      const et = exp.querySelector('[data-track]');
      if (et && et.parentElement) {
        exp.style.setProperty('--shift', Math.min(0, et.parentElement.clientWidth - et.scrollWidth) + 'px');
      }
    }
    const fin = q('[data-final]');
    if (fin) flags(fin, '--l', 4, Math.min(3, Math.floor(lp(fin) * 4.6)), true);

    checkReveals();
    checkCounters();
    checkUnlocks();
  };

  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; tick(); });
  };
  on(window, 'scroll', onScroll, { passive: true });
  on(window, 'resize', onScroll);

  scan();
  tick();
  const t1 = window.setTimeout(() => { scan(); tick(); }, 60);
  const t2 = window.setTimeout(() => { scan(); tick(); }, 600);

  return () => {
    listeners.forEach((off) => off());
    if (raf) cancelAnimationFrame(raf);
    window.clearTimeout(t1);
    window.clearTimeout(t2);
    window.clearTimeout(unlockTimer);
  };
}
