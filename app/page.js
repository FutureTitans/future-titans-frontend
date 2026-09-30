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
#yp-home details>summary{-webkit-tap-highlight-color:transparent}
@media (hover:none){#yp-home [data-cursor]{display:none !important}}
#yp-home [data-touch="1"] [data-cursor]{display:none !important}
@media (max-width:1080px){
#yp-home nav[aria-label="Primary"]{display:none !important}
#yp-home header a[data-href="/start"]{display:none !important}
#yp-home [data-login]{display:none !important}
#yp-home [data-m="burger"],#yp-home [data-m="menu"]{display:flex !important}
#yp-home [data-rail]{left:50% !important;top:auto !important;bottom:calc(10px + env(safe-area-inset-bottom,0px)) !important;transform:translateX(-50%) !important;flex-direction:row !important;align-items:center !important;gap:clamp(7px,2.4vw,14px) !important;padding:7px 14px;border-radius:100px;background:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);border:1px solid rgba(6,61,53,.1);box-shadow:0 8px 24px rgba(6,61,53,.1)}
#yp-home [data-rail]>span:first-child{writing-mode:horizontal-tb !important;margin:0 !important;padding:0 !important;font-size:clamp(6.5px,2vw,8px) !important;letter-spacing:.2em !important}
#yp-home [data-rail]>span:not(:first-child){flex-direction:column !important;align-items:flex-start !important;gap:4px !important;padding:0 !important}
#yp-home [data-rail]>span:not(:first-child)>span:last-child{font-size:clamp(7px,2.2vw,9px) !important;letter-spacing:.1em !important;white-space:nowrap}
#yp-home [data-unlock]{top:calc(80px + env(safe-area-inset-top,0px)) !important;bottom:auto !important;left:50% !important;transform:translate3d(-50%,calc((1 - var(--unlock,0)) * -10px),0) !important}
#yp-home [data-m="club-grid"]{grid-template-columns:minmax(0,1fr) !important}
#yp-home [data-invgroup]{width:100%;max-width:720px;margin:0 auto}
}
@media (max-width:760px){
#yp-home details>summary{min-height:44px}
#yp-home section[data-screen-label="00 Landing film"]{height:100svh !important}
#yp-home [data-hero]{min-height:100svh !important;flex-direction:column !important;align-items:stretch !important;padding:104px 20px 44px !important}
#yp-home [data-m="hero-grid"]{grid-template-columns:minmax(0,1fr) !important;gap:34px !important}
#yp-home [data-hero] h1{font-size:clamp(30px,10vw,46px) !important}
#yp-home [data-hero] [data-cap]{width:calc(100% - 8px);margin:10px auto 26px;min-height:0 !important;max-height:none !important;aspect-ratio:1/1.08 !important}
#yp-home [data-hero] [data-cap]>div:first-child{left:14% !important;right:14% !important;top:12% !important;bottom:12% !important}
#yp-home [data-hero] [data-i="0"]{left:0 !important;top:6% !important}
#yp-home [data-hero] [data-i="1"]{right:0 !important;top:14% !important}
#yp-home [data-hero] [data-i="2"]{left:0 !important;top:38% !important}
#yp-home [data-hero] [data-i="3"]{right:0 !important;top:46% !important}
#yp-home [data-hero] [data-i="4"]{left:0 !important;bottom:14% !important}
#yp-home [data-hero] [data-i="5"]{right:2% !important;bottom:4% !important}
#yp-home [data-hero] [data-i="6"]{left:30% !important;top:-2% !important}
#yp-home [data-hero] [data-i="7"]{left:38% !important;bottom:-3% !important}
#yp-home [data-hero] [data-i="8"]{right:0 !important;top:70% !important}
#yp-home [data-hero] [data-i]>span:last-child{width:132px !important;padding:6px 9px;background:rgba(255,255,255,.95);border:1px solid rgba(6,61,53,.12);color:#3D4A45 !important;z-index:3}
#yp-home [data-hero] [data-i="0"]>span:last-child,#yp-home [data-hero] [data-i="2"]>span:last-child,#yp-home [data-hero] [data-i="4"]>span:last-child{left:0 !important;text-align:left !important;transform:translate3d(0,calc((1 - var(--h,0)) * -5px),0) !important}
#yp-home [data-hero] [data-i="1"]>span:last-child,#yp-home [data-hero] [data-i="3"]>span:last-child,#yp-home [data-hero] [data-i="5"]>span:last-child,#yp-home [data-hero] [data-i="8"]>span:last-child{left:auto !important;right:0 !important;text-align:right !important;transform:translate3d(0,calc((1 - var(--h,0)) * -5px),0) !important}
#yp-home [data-hero] [data-i="5"]>span:last-child,#yp-home [data-hero] [data-i="7"]>span:last-child{top:auto !important;bottom:calc(100% + 7px)}
#yp-home [data-hero]>a{position:relative !important;left:auto !important;bottom:auto !important;transform:none !important;align-self:center;margin-top:6px}
#yp-home [data-m="story-stick"]{height:100svh !important;grid-template-columns:minmax(0,1fr) !important;grid-template-rows:auto minmax(0,1fr);align-content:center;gap:18px !important;padding:118px 20px 66px !important}
#yp-home [data-m="story-stick"]>div:first-child{top:76px !important;left:20px !important;right:20px !important}
#yp-home [data-m="story-stick"]>div:first-child>span:first-child{white-space:normal !important;font-size:9px !important;letter-spacing:.2em !important;line-height:1.5}
#yp-home [data-m="story-stick"]>div:nth-child(2){min-height:26svh !important}
#yp-home [data-m="story-stick"]>div:nth-child(3){height:min(44svh,380px) !important}
#yp-home [data-m="story-chips"]{gap:7px !important}
#yp-home [data-m="story-chips"]>span{padding:11px 9px !important;font-size:12px !important}
#yp-home [data-m="pair"]{grid-template-columns:minmax(0,1fr) !important;gap:20px !important}
#yp-home section[data-screen-label^="05"] h2{font-size:clamp(26px,9vw,44px) !important}
#yp-home [data-pipeline]>div{height:100svh !important;padding:100px 20px 64px !important}
#yp-home [data-pipeline]>div>div>div:first-child{margin-bottom:26px !important}
#yp-home [data-m="pipe-grid"]{grid-template-columns:minmax(0,1fr) !important;gap:clamp(4px,1.1svh,10px) !important}
#yp-home [data-m="pipe-grid"]>span:nth-child(1){left:5.5px !important;right:auto !important;top:6px !important;bottom:6px !important;width:1px !important;height:auto !important}
#yp-home [data-m="pipe-grid"]>span:nth-child(2){left:5.5px !important;top:6px !important;width:1px !important;height:calc(var(--pp,0) * (100% - 12px)) !important;background:linear-gradient(180deg,#D4AF37,#F3D98B) !important}
#yp-home [data-m="pipe-grid"]>span:nth-child(n+3){flex-direction:row !important;align-items:center !important;gap:14px !important}
#yp-home [data-m="pipe-grid"]>span:nth-child(n+3)>span:first-child{margin-top:0 !important;flex:none}
#yp-home [data-m="pipe-grid"]>span:nth-child(n+3)>span:last-child{flex-direction:row !important;align-items:baseline !important;gap:10px !important}
#yp-home [data-m="pipe-grid"]>span:nth-child(n+3)>span:last-child>span:last-child{font-size:16px !important}
#yp-home [data-zone][data-label="Discover"]{grid-template-columns:repeat(2,minmax(0,1fr)) !important;grid-auto-rows:minmax(150px,auto) !important;gap:8px !important}
#yp-home [data-zone][data-label="Discover"]>article{padding:16px !important}
#yp-home [data-zone][data-label="Discover"]>article p{max-height:none !important;opacity:1 !important}
#yp-home [data-zone][data-label="Discover"]>article:first-child>span[style*="absolute"]{font-size:11px !important;padding:5px 9px !important}
#yp-home [data-zone][data-label="Discover"]>article:nth-child(5){min-height:372px}
#yp-home [data-zone][data-label="Discover"]>article:first-child{min-height:340px}
#yp-home section[data-screen-label="08 Future Titans"]{padding-top:132px !important}
#yp-home section[data-screen-label="08 Future Titans"]>span{font-size:8px !important;letter-spacing:.14em !important;top:88px !important}
#yp-home section[data-screen-label="08 Future Titans"] h2{font-size:clamp(34px,11.5vw,60px) !important}
#yp-home [data-titans]>div{height:100svh !important;padding:100px 0 64px 20px !important;gap:20px !important}
#yp-home [data-titans]>div>div:first-child{padding-right:20px !important}
#yp-home [data-m="tit-grid"]{grid-template-columns:minmax(0,1fr) !important;gap:18px !important}
#yp-home [data-m="tit-grid"]>div:first-child{width:min(46vw,30svh);max-height:none !important}
#yp-home [data-m="tit-grid"] article{width:clamp(196px,62vw,240px) !important}
#yp-home [data-verbs]>div{height:100svh !important}
#yp-home [data-verbs]>div>div:first-child{top:78px !important;left:20px !important;right:20px !important}
#yp-home [data-verbs]>div>div:first-child span{font-size:9px !important;letter-spacing:.16em !important}
#yp-home [data-verbs]>div>div:nth-child(2){inset:126px 20px 66px !important}
#yp-home [data-verbs]>div>div:nth-child(2)>div:nth-child(4)>span:first-child{left:0 !important}
#yp-home [data-verbs]>div>div:nth-child(2)>div>span[style*="padding"]{font-size:12px !important;padding:8px 12px !important}
#yp-home [data-invgroup]{aspect-ratio:1/1.22 !important;min-height:0 !important}
#yp-home [data-invgroup]>svg{left:12% !important;right:12% !important;width:76% !important}
#yp-home [data-invgroup]>span:not([data-i]){padding:13px 18px !important}
#yp-home [data-invgroup]>span[data-i]{white-space:normal !important;max-width:88px;text-align:center;font-size:10.5px !important;line-height:1.25;padding:6px 8px !important}
#yp-home [data-invgroup]>span[data-i="1"]{left:72.5% !important}
#yp-home [data-invgroup]>span[data-i="2"]{left:84.4% !important}
#yp-home [data-invgroup]>span[data-i="3"]{left:80.2% !important}
#yp-home [data-invgroup]>span[data-i="4"]{left:61.9% !important}
#yp-home [data-invgroup]>span[data-i="5"]{left:38.1% !important}
#yp-home [data-invgroup]>span[data-i="6"]{left:19.8% !important}
#yp-home [data-invgroup]>span[data-i="7"]{left:15.6% !important}
#yp-home [data-invgroup]>span[data-i="8"]{left:27.5% !important}
#yp-home [data-m="impact"]{grid-template-columns:repeat(2,minmax(0,1fr)) !important;row-gap:34px !important}
#yp-home [data-m="impact"]>div>span:first-child{font-size:clamp(34px,11vw,56px) !important}
#yp-home [data-hai]>div{height:100svh !important;padding:94px 20px 66px !important}
#yp-home [data-m="hai-grid"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important;grid-template-rows:auto auto;align-content:center;row-gap:clamp(14px,3svh,30px) !important}
#yp-home [data-m="hai-grid"]>div:nth-child(2){grid-column:1 / -1;grid-row:2;min-height:0 !important;padding:16px 0}
#yp-home [data-m="hai-grid"]>div:nth-child(1){transform:translate3d(calc((1 - var(--cp,0)) * -4vw),0,0) !important;gap:7px !important}
#yp-home [data-m="hai-grid"]>div:nth-child(3){transform:translate3d(calc((1 - var(--cp,0)) * 4vw),0,0) !important;gap:7px !important}
#yp-home [data-m="hai-grid"]>div:nth-child(1)>span:not(:first-child),#yp-home [data-m="hai-grid"]>div:nth-child(3)>span:not(:first-child){font-size:14px !important}
#yp-home [data-exposure]>div{height:100svh !important;padding:100px 0 66px 20px !important}
#yp-home [data-exposure]>div>div:first-child,#yp-home [data-exposure]>div>div:last-child{padding-right:20px !important}
#yp-home [data-exposure]>div>div:last-child>span:first-child{white-space:normal !important;font-size:9px !important;letter-spacing:.16em !important;max-width:62%}
#yp-home [data-exposure] figure{width:clamp(180px,56vw,236px) !important;max-height:46svh !important}
#yp-home [data-zone][data-label="Open"]{min-height:0 !important;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;gap:10px;padding:0 20px 30px;scroll-padding:0 20px;border-top:0 !important;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}
#yp-home [data-zone][data-label="Open"]::-webkit-scrollbar{display:none}
#yp-home [data-zone][data-label="Open"]>[data-i]{flex:0 0 84% !important;scroll-snap-align:center;min-height:min(78svh,640px);border:1px solid rgba(6,61,53,.1) !important;padding:24px !important}
#yp-home [data-zone][data-label="Open"]>[data-i]>div{max-height:calc(var(--h,0) * 820px) !important}
#yp-home [data-final]>div{height:100svh !important;padding:100px 20px 66px !important}
}
@media (max-width:760px){
#yp-home [data-invgroup]>span:not([data-i]){padding:11px 13px !important}
#yp-home [data-invgroup]>span:not([data-i])>span:first-child{font-size:8px !important;letter-spacing:.2em !important}
#yp-home [data-invgroup]>span:not([data-i])>span:last-child{font-size:15px !important}
#yp-home [data-invgroup]>span[data-i]{max-width:78px;font-size:10px !important;padding:5px 7px !important}
#yp-home [data-invgroup]>span[data-i="4"]{left:65% !important}
#yp-home [data-invgroup]>span[data-i="5"]{left:35% !important}
#yp-home [data-invgroup]>span[data-i="2"]{left:86% !important}
#yp-home [data-invgroup]>span[data-i="7"]{left:14% !important}
}
@media (max-width:360px){
#yp-home [data-invgroup]>svg{left:10% !important;right:10% !important;width:80% !important}
#yp-home [data-invgroup]>span[data-i]{max-width:70px;font-size:9.5px !important;padding:5px 6px !important}
#yp-home [data-invgroup]>span[data-i="0"]{top:6% !important}
#yp-home [data-invgroup]>span[data-i="2"]{left:88% !important}
#yp-home [data-invgroup]>span[data-i="7"]{left:12% !important}
#yp-home [data-invgroup]>span[data-i="4"]{left:67% !important}
#yp-home [data-invgroup]>span[data-i="5"]{left:33% !important}
#yp-home [data-invgroup]>span:not([data-i]){padding:9px 10px !important}
#yp-home [data-invgroup]>span:not([data-i])>span:last-child{font-size:13.5px !important}
#yp-home [data-zone][data-label="Discover"]>article{padding:12px !important}
#yp-home [data-zone][data-label="Discover"]>article h3{font-size:14px !important}
}
#yp-home [data-zone][data-label="Discover"]>article h3,#yp-home [data-zone][data-label="Discover"]>article p{overflow-wrap:anywhere;-webkit-hyphens:auto;hyphens:auto}
@media (max-width:760px) and (max-height:700px){
#yp-home [data-m="story-stick"]>div:nth-child(3){height:36svh !important}
#yp-home [data-m="pipe-grid"]{gap:2px !important}
#yp-home [data-m="pair"] p{font-size:16px}
#yp-home [data-pipeline] [data-m="pair"]{margin-top:20px !important}
#yp-home [data-pipeline] [data-m="pair"] p{font-size:17px !important}
#yp-home [data-m="hai-grid"]>div:nth-child(1),#yp-home [data-m="hai-grid"]>div:nth-child(3){gap:4px !important}
#yp-home [data-m="hai-grid"]>div:nth-child(1)>span:not(:first-child),#yp-home [data-m="hai-grid"]>div:nth-child(3)>span:not(:first-child){font-size:12.5px !important}
#yp-home [data-final] h2{margin-bottom:18px !important}
#yp-home [data-final]>div>div>p:last-of-type{margin-top:16px !important}
#yp-home [data-final]>div>div>p:nth-last-of-type(2){font-size:19px !important}
}
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
