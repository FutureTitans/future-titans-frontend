'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';

// ---- Design tokens (mirror the Future Titans Innovation Club design) ----
export const IC_FONT_LINK = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap';

const NAV_ITEMS = [
  { key: 'home',      href: '/student/innovation-club',           label: 'Home',      icon: 'M3 12L12 4l9 8M5 10v10h14V10' },
  { key: 'rooms',     href: '/student/innovation-club/rooms',     label: 'Rooms',     icon: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' },
  { key: 'live',      href: '/student/innovation-club/live',      label: 'Live',      icon: 'M4 6h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4zM18 10l4-3v10l-4-3z' },
  { key: 'missions',  href: '/student/innovation-club/missions',  label: 'Missions',  icon: 'M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z' },
  { key: 'calendar',  href: '/student/innovation-club/calendar',  label: 'Calendar',  icon: 'M4 6.5h16V20H4zM4 10.5h16M8.5 3.5v4M15.5 3.5v4' },
  { key: 'journey',   href: '/student/innovation-club/journey',   label: 'Journey',   icon: 'M4 20l4-10 4 6 4-14 4 18' },
];

const activeKey = (pathname) => {
  if (pathname === '/student/innovation-club') return 'home';
  if (pathname.startsWith('/student/innovation-club/rooms')) return 'rooms';
  if (pathname.startsWith('/student/innovation-club/live')) return 'live';
  if (pathname.startsWith('/student/innovation-club/missions')) return 'missions';
  if (pathname.startsWith('/student/innovation-club/calendar')) return 'calendar';
  if (pathname.startsWith('/student/innovation-club/journey')) return 'journey';
  return '';
};

export default function ICShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const active = activeKey(pathname);

  const [user, setUser] = useState(null);
  const [journey, setJourney] = useState(null);
  const [liveEvent, setLiveEvent] = useState(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [missions, setMissions] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    if (!u) return;
    (async () => {
      const [j, ev, rms, ms, evAll] = await Promise.all([
        studentIC.getJourney().catch(() => null),
        studentIC.listEvents({ scope: 'live', limit: 1 }).catch(() => []),
        studentIC.listRooms().catch(() => ({ rooms: [] })),
        studentIC.listMissions({ limit: 30 }).catch(() => []),
        studentIC.listEvents({ scope: 'upcoming', limit: 30 }).catch(() => []),
      ]);
      setJourney(j);
      setLiveEvent(Array.isArray(ev) && ev.length ? ev[0] : null);
      setRooms(rms?.rooms || []);
      setMissions(ms || []);
      setEvents(evAll || []);
    })();
  }, [pathname]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const roomHits = rooms.filter((r) => r.name?.toLowerCase().includes(q) || r.promise?.toLowerCase().includes(q))
      .slice(0, 4).map((r) => ({ title: r.name, kind: 'Room', href: `/student/innovation-club/rooms/${r.slug}`, accent: '#0C3B2E' }));
    const missionHits = missions.filter((m) => m.title?.toLowerCase().includes(q))
      .slice(0, 4).map((m) => ({ title: m.title, kind: 'Mission', href: `/student/innovation-club/missions/${m._id}`, accent: '#8A6414' }));
    const eventHits = events.filter((e) => e.title?.toLowerCase().includes(q))
      .slice(0, 4).map((e) => ({ title: e.title, kind: 'Event', href: `/student/innovation-club/live/${e._id}`, accent: '#C83A30' }));
    setResults([...roomHits, ...missionHits, ...eventHits]);
  }, [query, rooms, missions, events]);

  const xp = journey?.xp || 0;
  const level = journey?.level || 'Explorer';
  const nextTh = journey?.nextThreshold;
  const prevTh = journey?.prevThreshold || 0;
  const progress = nextTh ? Math.min(1, Math.max(0, (xp - prevTh) / (nextTh - prevTh))) : 1;
  const sideDash = `${(progress * 2 * Math.PI * 19).toFixed(1)} 400`;
  const streak = journey?.weeklyStreak || 0;

  const initial = (user?.name || user?.email || 'S')[0]?.toUpperCase();
  const liveTickerText = liveEvent ? `${liveEvent.roomId?.name || 'Live'} · ${liveEvent.title}` : null;

  const openLive = useCallback(() => {
    if (liveEvent) router.push(`/student/innovation-club/live/${liveEvent._id}`);
    else router.push('/student/innovation-club/live');
  }, [liveEvent, router]);

  return (
    <>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={IC_FONT_LINK} />
      <style>{`
        .ic-scope, .ic-scope *, .ic-scope *::before, .ic-scope *::after { box-sizing: border-box; font-style: normal !important; }
        .ic-scope a { color:#0C3B2E; text-decoration:none; }
        .ic-scope a:hover { color:#8A6A20; }
        .ic-scope button:focus-visible, .ic-scope input:focus-visible, .ic-scope textarea:focus-visible, .ic-scope select:focus-visible {
          outline: 2.5px solid #C9A55C; outline-offset: 2px;
        }
        .ic-scope ::-webkit-scrollbar { width: 9px; height: 9px; }
        .ic-scope ::-webkit-scrollbar-thumb { background:#DFE4E1; border-radius:9px; }
        @keyframes ftPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.35;transform:scale(.82)} }
        @keyframes ftRing { 0%{box-shadow:0 0 0 0 rgba(200,58,48,.45)} 70%{box-shadow:0 0 0 9px rgba(200,58,48,0)} 100%{box-shadow:0 0 0 0 rgba(200,58,48,0)} }
        @keyframes ftRise { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ftFade { from{opacity:0} to{opacity:1} }
        @keyframes ftSpin { to{transform:rotate(360deg)} }
        @keyframes ftBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes ftPop { 0%{opacity:0;transform:scale(.94)} 60%{transform:scale(1.01)} 100%{opacity:1;transform:scale(1)} }
        @keyframes ftDash { to{stroke-dashoffset:-32} }
      `}</style>

      <div className="ic-scope" style={{
        fontFamily: "'Instrument Sans', system-ui, sans-serif",
        color: '#101A16',
        background: '#FAF8F3',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* Sidebar — desktop */}
          <nav aria-label="Main" className="ic-sidebar" style={{
            width: 88, flex: 'none', display: 'flex', flexDirection: 'column',
            alignItems: 'center', padding: '16px 0 12px', gap: 3,
            background: '#0A2C22', overflow: 'auto',
          }}>
            <Link href="/student/dashboard" aria-label="Back to student dashboard" style={{
              width: 42, height: 42, borderRadius: 13, display: 'grid', placeItems: 'center',
              font: "700 14px 'Space Grotesk', sans-serif", color: '#0A2C22',
              background: '#C9A55C', marginBottom: 16, cursor: 'pointer', flex: 'none',
              textDecoration: 'none',
            }}>FT</Link>
            {NAV_ITEMS.map((n) => {
              const isActive = active === n.key;
              return (
                <Link key={n.key} href={n.href} title={n.label} style={{
                  width: 70, borderRadius: 14, padding: '10px 0 8px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  cursor: 'pointer', transition: 'background .16s, color .16s, transform .16s',
                  position: 'relative', flex: 'none',
                  textDecoration: 'none',
                  background: isActive ? 'rgba(201,165,92,.14)' : 'transparent',
                  color: isActive ? '#F0DDB0' : 'rgba(255,255,255,.72)',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={n.icon}></path>
                  </svg>
                  <span style={{ font: "600 13.5px/1 'Instrument Sans', sans-serif" }}>{n.label}</span>
                  {n.key === 'live' && liveEvent && (
                    <span style={{
                      position: 'absolute', top: 7, right: 16, width: 8, height: 8,
                      borderRadius: 8, background: '#FF4D4D', animation: 'ftRing 2s infinite',
                    }} />
                  )}
                </Link>
              );
            })}
            <div style={{ flex: 1, minHeight: 14 }} />
            <Link href="/student/innovation-club/journey" title="My Journey" style={{
              position: 'relative', width: 56, height: 56, cursor: 'pointer', flex: 'none',
              display: 'grid', placeItems: 'center',
            }}>
              <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="28" cy="28" r="19" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="5" />
                <circle cx="28" cy="28" r="19" fill="none" stroke="#C9A55C" strokeWidth="5" strokeLinecap="round" strokeDasharray={sideDash} style={{ transition: 'stroke-dasharray .8s' }} />
              </svg>
              <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 16 }}>⚡</span>
            </Link>
          </nav>

          {/* Main column */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
            {/* Header */}
            <header style={{
              flex: 'none', height: 66, borderBottom: '1px solid #ECE7DB',
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0 clamp(12px, 2.4vw, 26px)',
              background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(10px)',
              position: 'relative', zIndex: 30,
            }}>
              <button
                onClick={() => setMobileNav(true)}
                aria-label="Open menu"
                className="ic-mobile-menu"
                style={{
                  width: 42, height: 42, border: '1px solid #E7EAE8', background: '#fff',
                  borderRadius: 11, display: 'grid', placeItems: 'center', cursor: 'pointer', flex: 'none',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3E4C45" strokeWidth="1.8" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </button>

              <div style={{ position: 'relative', flex: 1, maxWidth: 340, minWidth: 0 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9AA6A0" strokeWidth="1.6" strokeLinecap="round" style={{ position: 'absolute', left: 12, top: 10 }}>
                  <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search rooms, missions, sessions"
                  aria-label="Search"
                  style={{
                    width: '100%', border: '1px solid #E7EAE8', background: '#FAFBFA',
                    borderRadius: 11, padding: '9px 12px 9px 34px',
                    font: "400 13px 'Instrument Sans', sans-serif", color: '#101A16',
                  }}
                />
                {results.length > 0 && (
                  <div style={{
                    position: 'absolute', top: 44, left: 0, right: 0, background: '#fff',
                    border: '1px solid #E7EAE8', borderRadius: 14,
                    boxShadow: '0 22px 48px -24px rgba(12,59,46,.45)', padding: 6,
                    maxHeight: 320, overflow: 'auto', animation: 'ftRise .18s ease both',
                    zIndex: 50,
                  }}>
                    {results.map((r, i) => (
                      <Link key={i} href={r.href} onClick={() => { setQuery(''); setResults([]); }} style={{
                        width: '100%', textAlign: 'left', border: 'none', background: 'none',
                        borderRadius: 10, padding: '10px 12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 10, color: '#101A16',
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: 6, flex: 'none', background: r.accent }} />
                        <span style={{ flex: 1, minWidth: 0, font: "500 13px 'Instrument Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</span>
                        <span style={{ font: "500 12px 'Space Grotesk', sans-serif", color: '#56635C', flex: 'none' }}>{r.kind}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {liveEvent && (
                <button onClick={openLive} className="ic-hide-sm" style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  border: '1px solid #F0D9D7', background: '#FDF5F4',
                  borderRadius: 999, padding: '7px 14px', cursor: 'pointer', flex: 'none',
                }}>
                  <span style={{ width: 7, height: 7, borderRadius: 7, background: '#C83A30', animation: 'ftPulse 1.6s ease-in-out infinite' }} />
                  <span style={{ font: "500 13px/1 'Space Grotesk', sans-serif", color: '#A8322A', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{liveTickerText}</span>
                </button>
              )}
              <div style={{ flex: 1 }} />

              <Link href="/student/innovation-club/journey" style={{
                display: 'flex', alignItems: 'center', gap: 7,
                border: '1px solid #EDE3CC', background: '#FCF8EF',
                borderRadius: 999, padding: '9px 14px', cursor: 'pointer',
                textDecoration: 'none',
              }}>
                <span style={{ fontSize: 14, lineHeight: 1 }}>⚡</span>
                <span style={{ font: "600 14px/1 'JetBrains Mono', monospace", color: '#6E5416' }}>{xp} XP</span>
              </Link>

              <Link href="/student/innovation-club/journey" className="ic-hide-sm" style={{
                display: 'flex', alignItems: 'center', gap: 8,
                border: '1px solid #E7EAE8', background: '#fff',
                borderRadius: 999, padding: '9px 14px', flex: 'none', cursor: 'pointer',
                textDecoration: 'none',
              }}>
                <span style={{ font: "600 14px/1 'Space Grotesk', sans-serif", color: '#0C3B2E' }}>{level}</span>
                <span style={{ font: "500 13px/1 'Instrument Sans', sans-serif", color: '#3E4C45' }}>🔥 {streak}w</span>
              </Link>

              <Link href="/student/innovation-club/calendar" title="Calendar" aria-label="Calendar" style={{
                width: 42, height: 42, border: '1px solid #E7EAE8', background: '#fff',
                borderRadius: 13, display: 'grid', placeItems: 'center', cursor: 'pointer',
                flex: 'none', color: '#26322C',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6.5h16V20H4zM4 10.5h16M8.5 3.5v4M15.5 3.5v4" />
                </svg>
              </Link>

              <Link href="/student/profile" aria-label="Profile" style={{
                width: 42, height: 42, borderRadius: 13, background: '#0C3B2E',
                color: '#C9A55C', font: "600 13px 'Space Grotesk', sans-serif",
                cursor: 'pointer', flex: 'none', display: 'grid', placeItems: 'center',
                textDecoration: 'none',
              }}>{initial}</Link>
            </header>

            {/* Content */}
            <main style={{ flex: 1, overflow: 'auto', minHeight: 0, position: 'relative' }}>
              <div style={{
                padding: 'clamp(18px,3vw,34px) clamp(14px,3vw,36px) 110px',
                maxWidth: 1280, margin: '0 auto',
                animation: 'ftFade .3s ease both',
              }}>
                {children}
              </div>
            </main>
          </div>
        </div>

        {/* Mobile nav sheet */}
        {mobileNav && (
          <div onClick={() => setMobileNav(false)} style={{
            position: 'fixed', inset: 0, background: 'rgba(10,44,34,.55)', zIndex: 80, backdropFilter: 'blur(4px)',
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              width: 260, height: '100%', background: '#0A2C22', padding: '20px 16px',
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ font: "700 16px/1 'Space Grotesk', sans-serif", color: '#C9A55C' }}>Innovation Club</span>
                <button onClick={() => setMobileNav(false)} aria-label="Close" style={{
                  width: 34, height: 34, border: 'none', background: 'rgba(255,255,255,.08)',
                  borderRadius: 10, color: '#fff', font: '600 16px/1 sans-serif', cursor: 'pointer',
                }}>×</button>
              </div>
              {NAV_ITEMS.map((n) => (
                <Link key={n.key} href={n.href} onClick={() => setMobileNav(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', borderRadius: 12,
                  color: active === n.key ? '#F0DDB0' : 'rgba(255,255,255,.85)',
                  background: active === n.key ? 'rgba(201,165,92,.14)' : 'transparent',
                  textDecoration: 'none',
                  font: "600 15px 'Instrument Sans', sans-serif",
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={n.icon} /></svg>
                  {n.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <style>{`
          @media (min-width: 900px) { .ic-mobile-menu { display: none !important; } }
          @media (max-width: 899px) {
            .ic-sidebar { display: none !important; }
            .ic-hide-sm { display: none !important; }
          }
        `}</style>
      </div>
    </>
  );
}
