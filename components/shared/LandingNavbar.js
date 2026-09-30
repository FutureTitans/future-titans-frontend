'use client';

// Reusable landing-style pill navbar for all public pages.
// Mirrors the visual in components/landing/homeMarkup.js so every page shows
// the same navbar. Scroll-reactive `--nav` variable — starts solid on pages
// whose hero isn't dark; on the true landing page the inline version stays.

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const NAV_LINKS = [
  { label: 'About', href: '/about-us' },
  { label: 'Future Titans', href: '/future-titans' },
  { label: 'For Parents', href: '/for-parents' },
  { label: 'Schools', href: '/for-schools' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Media', href: '/media' },
];

const NAV_CSS = `
#yp-nav{font-family:Manrope,system-ui,sans-serif;--nav:1;--h:0;--menu:0;--menuPe:none}
#yp-nav *,#yp-nav *::before,#yp-nav *::after{box-sizing:border-box}
#yp-nav a{color:inherit;text-decoration:none}
#yp-nav button{font-family:inherit;border:0;background:none;cursor:pointer;color:inherit}
#yp-nav [data-nav-link]:hover{opacity:.62}
#yp-nav [data-login-menu-a]:hover{background:#F5FFFB}
#yp-nav .yp-cta:hover{--h:1}
#yp-nav .yp-cta-outline:hover{background:rgba(255,255,255,.9)}
#yp-nav [data-m="burger"]{display:none}
#yp-nav [data-m="menu"]{display:none}
@media (max-width:1080px){
  #yp-nav nav[aria-label="Primary"]{display:none !important}
  #yp-nav .yp-cta,#yp-nav [data-login]{display:none !important}
  #yp-nav [data-m="burger"]{display:flex !important}
  #yp-nav [data-m="menu"]{display:flex !important}
}
@media (prefers-reduced-motion: reduce){#yp-nav *{animation-duration:1ms !important;transition-duration:1ms !important}}
`;

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);

  // Scroll flag (kept for future dark-hero variant; keeps navValue at 1 for solid look).
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    if (!loginOpen) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setLoginOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [loginOpen]);

  useEffect(() => {
    try { document.body.style.overflow = menuOpen ? 'hidden' : ''; } catch {}
    return () => { try { document.body.style.overflow = ''; } catch {} };
  }, [menuOpen]);

  const navValue = 1; // solid state on all non-landing pages
  const menuValue = menuOpen ? 1 : 0;

  const rootStyle = {
    '--nav': navValue,
    '--menu': menuValue,
    '--menuPe': menuOpen ? 'auto' : 'none',
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: NAV_CSS }} />

      <div id="yp-nav" ref={rootRef} style={rootStyle}>
        <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 110, padding: 'calc(20px - var(--nav) * 8px) 0', transition: 'padding .45s cubic-bezier(.2,.7,.2,1)' }}>
          <div style={{ maxWidth: 1460, margin: '0 auto', padding: '0 clamp(16px,3.4vw,48px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(8px,1.5vw,34px)', padding: '10px 12px 10px 20px', borderRadius: 100, background: 'rgba(255,255,255,calc(.04 + .93 * var(--nav)))', backdropFilter: 'blur(20px) saturate(1.4)', border: '1px solid rgba(212,175,55,calc(.3 - .16 * var(--nav)))', boxShadow: '0 calc(var(--nav) * 16px) calc(var(--nav) * 40px) rgba(6,61,53,calc(var(--nav) * .09))', transition: 'background .55s ease,border-color .55s ease,box-shadow .55s ease' }}>
              <Link href="/" style={{ position: 'relative', display: 'block', width: 'clamp(122px,12.5vw,182px)', height: 28, flex: 'none' }}>
                <img src="/images/yp-landing/yp-logo-gold.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center', opacity: 'calc(1 - var(--nav))', transition: 'opacity .5s ease' }} />
                <img src="/images/yp-landing/yp-logo-green.png" alt="Youngpreneurs" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left center', opacity: 'var(--nav)', transition: 'opacity .5s ease' }} />
              </Link>

              <nav aria-label="Primary" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(7px,1.15vw,23px)', marginLeft: 'auto', fontSize: 13.5, fontWeight: 600, letterSpacing: '.01em' }}>
                {NAV_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} data-nav-link="1" style={{ color: 'color-mix(in oklab, #F1EFE4 calc((1 - var(--nav)) * 100%), #123F30)', padding: '6px 2px', whiteSpace: 'nowrap', transition: 'color .5s ease,opacity .3s ease' }}>{l.label}</Link>
                ))}
              </nav>

              <div data-login style={{ position: 'relative', flex: 'none' }}>
                <button
                  type="button"
                  onClick={() => setLoginOpen((v) => !v)}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 18px', borderRadius: 100, border: '1px solid rgba(6,61,53,calc(.18 + .3 * var(--nav)))', background: 'rgba(255,255,255,calc(.06 + .35 * var(--nav)))', color: 'color-mix(in oklab, #F1EFE4 calc((1 - var(--nav)) * 100%), #123F30)', fontFamily: "'Space Grotesk',monospace", fontSize: 10.5, fontWeight: 500, letterSpacing: '.19em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background .4s ease,border-color .4s ease,color .5s ease' }}
                >
                  Login <span style={{ display: 'inline-block', fontSize: 9, transition: 'transform .3s ease', transform: loginOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▾</span>
                </button>
                <div
                  style={{
                    position: 'absolute', top: 'calc(100% + 12px)', right: 0, minWidth: 210, padding: 8,
                    background: '#FFFFFF', border: '1px solid rgba(6,61,53,.1)', borderRadius: 18,
                    boxShadow: '0 20px 44px rgba(6,61,53,.16)',
                    opacity: loginOpen ? 1 : 0, pointerEvents: loginOpen ? 'auto' : 'none',
                    transform: loginOpen ? 'translateY(0)' : 'translateY(-6px)',
                    transition: 'opacity .25s ease,transform .25s ease', zIndex: 120,
                  }}
                >
                  <Link href="/login" data-login-menu-a="1" style={{ display: 'block', padding: '11px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#063D35', transition: 'background .2s ease' }}>Student Login</Link>
                  <Link href="/school-poc/login" data-login-menu-a="1" style={{ display: 'block', padding: '11px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#063D35', transition: 'background .2s ease' }}>School POC Login</Link>
                  <Link href="/association/login" data-login-menu-a="1" style={{ display: 'block', padding: '11px 14px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#063D35', transition: 'background .2s ease' }}>Association Login</Link>
                </div>
              </div>

              <Link
                href="/signup"
                className="yp-cta"
                style={{
                  flex: 'none', display: 'inline-flex', alignItems: 'center', gap: 9,
                  padding: '12px 20px', borderRadius: 100,
                  background: 'linear-gradient(135deg,#063D35,#087A61)', color: '#ECFDF5',
                  fontFamily: "'Space Grotesk',monospace", fontSize: 10.5, fontWeight: 500,
                  letterSpacing: '.19em', textTransform: 'uppercase',
                  border: '1px solid rgba(243,217,139,calc(.3 + .5 * var(--h)))',
                  transform: 'translate3d(0,calc(var(--h) * -2px),0)',
                  boxShadow: '0 calc(var(--h) * 12px) calc(var(--h) * 26px) rgba(6,61,53,calc(var(--h) * .3))',
                  transition: 'transform .35s cubic-bezier(.2,.7,.2,1),box-shadow .35s ease,border-color .35s ease',
                }}
              >
                Enroll Now <span style={{ transform: 'translate3d(calc(var(--h) * 4px),0,0)', transition: 'transform .35s cubic-bezier(.2,.7,.2,1)' }}>→</span>
              </Link>

              <button
                data-m="burger"
                type="button"
                aria-label="Menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                style={{ flex: 'none', marginLeft: 'auto', width: 44, height: 44, borderRadius: '50%', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, background: 'rgba(255,255,255,calc(.08 + .6 * max(var(--nav), var(--menu))))', border: '1px solid rgba(212,175,55,.42)', transition: 'background .45s ease' }}
              >
                <span style={{ display: 'block', width: 18, height: 1.5, borderRadius: 2, background: 'color-mix(in oklab, #F1EFE4 calc((1 - max(var(--nav), var(--menu))) * 100%), #063D35)', transform: 'translate3d(0,calc(var(--menu) * 3.25px),0) rotate(calc(var(--menu) * 45deg))', transition: 'transform .45s cubic-bezier(.2,.7,.2,1),background .45s ease' }} />
                <span style={{ display: 'block', width: 18, height: 1.5, borderRadius: 2, background: 'color-mix(in oklab, #F1EFE4 calc((1 - max(var(--nav), var(--menu))) * 100%), #063D35)', transform: 'translate3d(0,calc(var(--menu) * -3.25px),0) rotate(calc(var(--menu) * -45deg))', transition: 'transform .45s cubic-bezier(.2,.7,.2,1),background .45s ease' }} />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile fullscreen menu */}
        <div
          data-m="menu"
          aria-hidden={!menuOpen}
          style={{
            position: 'fixed', inset: 0, zIndex: 105,
            flexDirection: 'column', justifyContent: 'space-between', gap: 32,
            padding: 'calc(100px + env(safe-area-inset-top,0px)) 24px calc(32px + env(safe-area-inset-bottom,0px))',
            background: 'linear-gradient(180deg,#FFFFFF,#F5FFFB 70%,#ECFDF5)',
            opacity: 'var(--menu)', pointerEvents: 'var(--menuPe)',
            transition: 'opacity .45s ease', overflowY: 'auto',
          }}
        >
          <nav aria-label="Primary mobile" style={{ display: 'flex', flexDirection: 'column' }}>
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', minHeight: 56, padding: '10px 0', borderBottom: '1px solid rgba(6,61,53,.1)', fontSize: 'clamp(24px,7.4vw,34px)', fontWeight: 800, letterSpacing: '-.026em', color: '#071F1B', opacity: 'var(--menu)', transform: 'translate3d(0,calc((1 - var(--menu)) * 14px),0)', transition: `opacity .5s ease ${0.04 + i * 0.04}s,transform .6s cubic-bezier(.2,.7,.2,1) ${0.04 + i * 0.04}s` }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 24, borderTop: '1px solid rgba(6,61,53,.12)', opacity: 'var(--menu)', transform: 'translate3d(0,calc((1 - var(--menu)) * 14px),0)', transition: 'opacity .5s ease .28s,transform .6s cubic-bezier(.2,.7,.2,1) .28s' }}>
            <Link href="/login" onClick={() => setMenuOpen(false)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 22px', borderRadius: 100, background: '#FFFFFF', border: '1px solid rgba(6,61,53,.18)', color: '#063D35', fontFamily: "'Space Grotesk',monospace", fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase' }}>Student Login</Link>
            <Link href="/signup" onClick={() => setMenuOpen(false)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '14px 22px', borderRadius: 100, background: 'linear-gradient(135deg,#063D35,#087A61)', color: '#ECFDF5', fontFamily: "'Space Grotesk',monospace", fontSize: 11, fontWeight: 600, letterSpacing: '.2em', textTransform: 'uppercase' }}>Enroll Now <span>→</span></Link>
          </div>
        </div>
      </div>
    </>
  );
}
