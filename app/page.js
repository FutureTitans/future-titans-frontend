'use client';

import { useEffect, useRef } from 'react';
import { HOME_HTML } from '@/components/landing/homeMarkup';
import { initHome } from '@/components/landing/homeBehavior';

// Youngpreneurs landing page — cinematic single-page scroll experience imported
// from the Claude Design project "Youngpreneurs Homepage". The design is authored
// as inline-styled HTML driven by CSS custom properties; it is injected here and
// animated by the behavior engine in components/landing/homeBehavior.js.
//
// The hero film is the YouTube landing video (autoplay, muted, loop). In-page
// anchor links (nav + scroll cues) smooth-scroll to their target sections.

const BASE_STYLES = `
#yp-home{font-family:Manrope,system-ui,sans-serif;-webkit-font-smoothing:antialiased;color:#071F1B;background:#FFFFFF}
#yp-home *,#yp-home *::before,#yp-home *::after{box-sizing:border-box}
#yp-home a{color:#087A61;text-decoration:none}
#yp-home button{font-family:inherit;border:0;background:none;cursor:pointer;color:inherit}
#yp-home h1,#yp-home h2,#yp-home h3,#yp-home p{margin:0}
#yp-home ::selection{background:#087A61;color:#fff}
#yp-home :focus-visible{outline:2px solid #D4AF37;outline-offset:3px}
@keyframes ypMarquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}
@keyframes ypDrift{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(0,-9px,0)}}
@keyframes ypPulse{0%,100%{opacity:.2}50%{opacity:.85}}
@media (prefers-reduced-motion: reduce){#yp-home *{animation-duration:1ms !important;transition-duration:1ms !important}}
`;

export default function Landing() {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const root = el.querySelector('[data-root]');

    // Smooth-scroll for in-page anchor links (nav + scroll cues).
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = el.querySelector('#' + (window.CSS && CSS.escape ? CSS.escape(id) : id));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    el.addEventListener('click', onClick);

    const cleanup = initHome(root);
    return () => {
      el.removeEventListener('click', onClick);
      cleanup();
    };
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: BASE_STYLES }} />
      <div id="yp-home" ref={containerRef} dangerouslySetInnerHTML={{ __html: HOME_HTML }} />
    </>
  );
}
