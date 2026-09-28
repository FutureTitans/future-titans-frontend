'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentIC, payment } from '@/lib/api';
import { getUser } from '@/lib/auth';

const UNI_ACCENT = {
  BUILD: '#C2410C', FUTURE: '#2D5BFF', CREATE: '#7449F5',
  THINK: '#0E7C78', LIFE: '#D23A2A', EXPLORE: '#8A4DDB',
};
const UNI_SOFT = {
  BUILD: '#FDF1E4', FUTURE: '#E9EEFF', CREATE: '#F0EAFE',
  THINK: '#E4F1F0', LIFE: '#FBE9E7', EXPLORE: '#EFE7F8',
};

const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const daysDiff = (d) => Math.round((new Date(d) - new Date()) / (1000 * 60 * 60 * 24));

export default function ICHome() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/login'); return; }
    setUser(u);
    (async () => {
      try {
        const ps = await payment.getPaymentStatus().catch(() => ({ isPaid: false }));
        const paid = u.isPaid || ps?.isPaid || false;
        setIsPaid(paid);
        if (paid) setData(await studentIC.getDashboard());
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [router]);

  if (loading) return <Loading />;
  if (!isPaid) return <PaidGate />;

  const { heroEvent, upcomingEvents = [], myRooms = [], weekEvents = [], openMissions = [], recommendedRooms = [], journey = {}, formats = [] } = data || {};
  const firstName = (user?.name || 'there').split(' ')[0];
  const dateLine = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = `${new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}, ${firstName}.`;

  const heroLive = heroEvent?.status === 'live';
  const heroSoon = heroEvent && !heroLive;

  const xp = journey.xp || 0;
  const level = journey.level || 'Explorer';
  const nextTh = journey.nextThreshold;
  const prevTh = journey.prevThreshold || 0;
  const progressPct = nextTh ? Math.min(1, (xp - prevTh) / (nextTh - prevTh)) : 1;
  const ringDash = `${(progressPct * 2 * Math.PI * 46).toFixed(1)} 400`;

  const weekDaysArr = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    const has = weekEvents.some((e) => new Date(e.startAt).toDateString() === d.toDateString());
    return { d, dow: d.toLocaleDateString([], { weekday: 'short' }).slice(0, 2), day: d.getDate(), has, isToday: i === 0 };
  });

  return (
    <>
      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 24, animation: 'ftRise .4s ease both' }}>
        <div>
          <div style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#8A6414', marginBottom: 12 }}>{dateLine}</div>
          <h1 style={{ font: "700 clamp(34px,4.4vw,52px)/1 'Space Grotesk', sans-serif", letterSpacing: '-.04em', margin: 0, color: '#0C1512' }}>{greeting}</h1>
        </div>
        <div style={{ font: "400 15px/1.5 'Instrument Sans', sans-serif", color: '#3E4C45', maxWidth: 360 }}>
          Pick a room, save a seat, ship a mission. Your Innovation Club, live.
        </div>
      </div>

      {/* Hero — Live now / Live soon / None */}
      <div style={{
        background: '#0A2C22', borderRadius: 28, padding: 'clamp(22px,3vw,34px)',
        position: 'relative', overflow: 'hidden', marginBottom: 18,
        animation: 'ftRise .5s ease both',
      }}>
        <div style={{ position: 'absolute', right: -120, top: -170, width: 520, height: 520, borderRadius: '50%', border: '1px solid rgba(201,165,92,.3)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: -30, top: -80, width: 360, height: 360, borderRadius: '50%', border: '1px dashed rgba(127,224,184,.26)', pointerEvents: 'none', animation: 'ftSpin 80s linear infinite' }} />
        <div style={{ position: 'absolute', left: '45%', bottom: -80, width: 180, height: 180, borderRadius: '50%', background: 'rgba(45,91,255,.24)', filter: 'blur(34px)', pointerEvents: 'none' }} />

        {heroEvent ? (
          <div style={{ position: 'relative', display: 'flex', gap: 30, flexWrap: 'wrap', alignItems: 'stretch' }}>
            <div style={{ flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  border: `1px solid ${heroLive ? 'rgba(200,58,48,.55)' : 'rgba(201,165,92,.4)'}`,
                  background: heroLive ? 'rgba(200,58,48,.18)' : 'rgba(201,165,92,.14)',
                  borderRadius: 999, padding: '8px 13px',
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: 8, animation: 'ftPulse 1.4s ease-in-out infinite', background: heroLive ? '#FF7A6D' : '#C9A55C' }} />
                  <span style={{ font: "700 13px/1 'Instrument Sans', sans-serif", color: heroLive ? '#FFC9C2' : '#F0DDB0' }}>
                    {heroLive ? 'Live now' : 'Starting soon'}
                  </span>
                </span>
                <span style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#B9D3C7' }}>
                  {heroEvent.roomId?.name} · {heroEvent.format}
                </span>
              </div>
              <h2 style={{ font: "700 clamp(28px,3.4vw,42px)/1.04 'Space Grotesk', sans-serif", letterSpacing: '-.035em', color: '#fff', margin: '0 0 12px', maxWidth: 620 }}>{heroEvent.title}</h2>
              <div style={{ font: "400 16px/1.5 'Instrument Sans', sans-serif", color: '#B9D3C7', marginBottom: 24 }}>with {heroEvent.guest || 'Special guest'}</div>
              <div style={{ flex: 1 }} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href={`/student/innovation-club/live/${heroEvent._id}`} style={{
                  background: '#C9A55C', color: '#1A1405', borderRadius: 15,
                  padding: '15px 24px', font: "700 15px/1 'Instrument Sans', sans-serif",
                  textDecoration: 'none',
                }}>{heroLive ? 'Enter Live' : 'Save My Seat'}</Link>
                <Link href="/student/innovation-club/live" style={{
                  background: 'none', color: '#D9E6E0', border: '1px solid rgba(255,255,255,.2)',
                  borderRadius: 15, padding: '15px 20px', font: "600 15px/1 'Instrument Sans', sans-serif",
                  textDecoration: 'none',
                }}>See all sessions</Link>
              </div>
            </div>

            <div style={{ flex: '0 1 270px', minWidth: 230, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 22, padding: 22 }}>
              <div style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#A9C2B7', marginBottom: 12 }}>
                {heroLive ? 'Live · in progress' : 'Starts in'}
              </div>
              <div style={{ font: "600 40px/1 'JetBrains Mono', monospace", color: '#fff', letterSpacing: '-.02em' }}>
                {heroLive ? 'NOW' : formatCountdown(heroEvent.startAt)}
              </div>
              <div style={{ font: "400 14px/1.4 'Instrument Sans', sans-serif", color: '#A9C2B7', marginTop: 10 }}>
                {new Date(heroEvent.startAt).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ height: 1, background: 'rgba(255,255,255,.12)', margin: '18px 0' }} />
              <div style={{ font: "600 15px/1.4 'Instrument Sans', sans-serif", color: '#fff' }}>{heroEvent.registrationsCount || 0} students saved a seat</div>
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative', display: 'flex', gap: 30, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: '1 1 380px', minWidth: 0 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid rgba(201,165,92,.4)', background: 'rgba(201,165,92,.14)', borderRadius: 999, padding: '8px 13px', marginBottom: 18 }}>
                <span style={{ width: 8, height: 8, borderRadius: 8, background: '#C9A55C', animation: 'ftPulse 2.4s ease-in-out infinite' }} />
                <span style={{ font: "700 13px/1 'Instrument Sans', sans-serif", color: '#F0DDB0' }}>Live · Coming soon</span>
              </div>
              <h2 style={{ font: "700 clamp(30px,3.6vw,46px)/1.02 'Space Grotesk', sans-serif", letterSpacing: '-.035em', color: '#fff', margin: '0 0 14px' }}>Nothing scheduled yet. Your next experience will appear here.</h2>
              <div style={{ font: "400 16px/1.55 'Instrument Sans', sans-serif", color: '#B9D3C7', marginBottom: 24, maxWidth: 520 }}>
                Some conversations are better live — ask, vote, react and challenge an idea while the person is right there.
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Link href="/student/innovation-club/rooms" style={{ background: '#C9A55C', color: '#1A1405', borderRadius: 15, padding: '15px 22px', font: "700 15px/1 'Instrument Sans', sans-serif", textDecoration: 'none' }}>Explore rooms</Link>
              </div>
            </div>
            <div style={{ flex: '0 1 300px', minWidth: 240 }}>
              <div style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#A9C2B7', marginBottom: 12 }}>Same Club. Different energy.</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {formats.slice(0, 5).map((f) => (
                  <div key={f.key} style={{ border: '1px solid rgba(255,255,255,.14)', background: 'rgba(255,255,255,.06)', borderRadius: 14, padding: '12px 14px', font: "600 15px/1 'Instrument Sans', sans-serif", color: '#fff' }}>{f.name}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Row: My Rooms + This Week */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 18, marginBottom: 18 }}>
        <Card>
          <CardHeader title="My Rooms" href="/student/innovation-club/rooms" hrefLabel="Explore →" />
          <div style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '4px 2px 8px' }}>
            {myRooms.map((r) => (
              <Link key={r._id} href={`/student/innovation-club/rooms/${r.slug}`} style={{
                flex: 'none', width: 160, textAlign: 'left', border: '1px solid #E7EAE8', borderRadius: 20,
                padding: 16, display: 'flex', flexDirection: 'column', gap: 12, textDecoration: 'none',
                background: UNI_SOFT[r.universe] || '#F4F7F5',
              }}>
                <span style={{ fontSize: 30, lineHeight: 1 }}>{r.iconEmoji || '·'}</span>
                <span style={{ font: "700 16px/1.2 'Space Grotesk', sans-serif", color: '#0C1512' }}>{r.name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: "500 13px/1.2 'Instrument Sans', sans-serif", color: '#3E4C45' }}>
                  <span style={{ width: 7, height: 7, borderRadius: 7, background: UNI_ACCENT[r.universe] || '#0C3B2E' }} />
                  {r.memberCount || 0} members
                </span>
              </Link>
            ))}
            <Link href="/student/innovation-club/rooms" style={{
              flex: 'none', width: 130, border: '1.5px dashed #D5DCD8', borderRadius: 20,
              background: '#FBFCFB', color: '#26322C', font: "600 14px/1.3 'Instrument Sans', sans-serif",
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, minHeight: 142, textDecoration: 'none',
            }}>
              <span style={{ fontSize: 24 }}>＋</span>Explore Rooms
            </Link>
          </div>
        </Card>

        <Card>
          <CardHeader title="This Week" href="/student/innovation-club/calendar" hrefLabel="Calendar →" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, marginBottom: 14 }}>
            {weekDaysArr.map((d, i) => (
              <div key={i} style={{
                border: `1px solid ${d.isToday ? '#0C3B2E' : '#EDF0EE'}`, borderRadius: 14,
                padding: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                background: d.isToday ? '#0C3B2E' : '#FAFBFA',
                color: d.isToday ? '#fff' : '#26322C',
              }}>
                <span style={{ font: "500 13.5px/1 'Instrument Sans', sans-serif" }}>{d.dow}</span>
                <span style={{ font: "700 17px/1 'Space Grotesk', sans-serif" }}>{d.day}</span>
                <span style={{ width: 5, height: 5, borderRadius: 5, background: d.has ? (d.isToday ? '#C9A55C' : '#C9A55C') : 'transparent' }} />
              </div>
            ))}
          </div>
          {weekEvents.length === 0 ? (
            <div style={{ border: '1.5px dashed #DCD3C0', borderRadius: 18, padding: '16px 18px', background: '#FDFBF6', display: 'flex', gap: 14, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>🗓️</span>
              <span style={{ font: "400 14.5px/1.5 'Instrument Sans', sans-serif", color: '#3E4C45' }}>
                <span style={{ display: 'block', font: "600 15.5px/1.3 'Instrument Sans', sans-serif", color: '#0C1512' }}>Your week is clear.</span>
                Sessions land here with RSVP, reminders and a join link.
              </span>
            </div>
          ) : (
            weekEvents.slice(0, 4).map((e) => (
              <Link key={e._id} href={`/student/innovation-club/live/${e._id}`} style={{
                display: 'flex', alignItems: 'center', gap: 12, borderRadius: 14,
                padding: '11px 12px', textAlign: 'left', width: '100%',
                marginBottom: 6, background: '#FAF8F3', textDecoration: 'none',
              }}>
                <span style={{ width: 4, height: 34, borderRadius: 4, flex: 'none', background: UNI_ACCENT[e.roomId?.universe] || '#0C3B2E' }} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', font: "600 15px/1.3 'Instrument Sans', sans-serif", color: '#101A16', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</span>
                  <span style={{ display: 'block', font: "500 13px/1 'JetBrains Mono', monospace", color: '#3E4C45', marginTop: 5 }}>
                    {new Date(e.startAt).toLocaleDateString([], { weekday: 'short' })} {new Date(e.startAt).getDate()} · {fmtTime(e.startAt)} · {e.format}
                  </span>
                </span>
                {e.myRegistration && (
                  <span style={{ font: "600 12.5px/1 'Instrument Sans', sans-serif", color: '#6E5416', background: '#FCF8EF', border: '1px solid #EDE3CC', borderRadius: 7, padding: '5px 8px' }}>Going</span>
                )}
              </Link>
            ))
          )}
        </Card>
      </div>

      {/* Row: Journey + Open missions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,340px),1fr))', gap: 18, marginBottom: 18 }}>
        <Card style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -60, bottom: -60, width: 190, height: 190, borderRadius: '50%', background: '#FCF3DF', pointerEvents: 'none' }} />
          <CardHeader title="Continue your journey" href="/student/innovation-club/journey" hrefLabel="My Journey →" />
          <div style={{ position: 'relative', display: 'flex', gap: 22, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 116, height: 116, flex: 'none' }}>
              <svg width="116" height="116" viewBox="0 0 116 116" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="58" cy="58" r="46" fill="none" stroke="#EFEAE0" strokeWidth="11" />
                <circle cx="58" cy="58" r="46" fill="none" stroke="#0C3B2E" strokeWidth="11" strokeLinecap="round" strokeDasharray={ringDash} style={{ transition: 'stroke-dasharray .9s cubic-bezier(.2,.8,.2,1)' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ font: "700 27px/1 'Space Grotesk', sans-serif", color: '#0C1512' }}>{xp}</span>
                <span style={{ font: "600 13px/1 'Instrument Sans', sans-serif", color: '#3E4C45', marginTop: 3 }}>XP</span>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 170 }}>
              <div style={{ font: "700 27px/1.05 'Space Grotesk', sans-serif", letterSpacing: '-.02em', color: '#0C1512' }}>{level}</div>
              <div style={{ font: "500 14px/1.4 'Instrument Sans', sans-serif", color: '#3E4C45', margin: '6px 0 12px' }}>
                {nextTh ? `${nextTh - xp} XP to next level` : 'Max level reached'}
              </div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 14 }}>
                {['Explorer', 'Maker', 'Builder', 'Solver', 'Catalyst', 'Titan'].map((n) => (
                  <span key={n} title={n} style={{ flex: 1, height: 7, borderRadius: 7, background: (['Explorer', 'Maker', 'Builder', 'Solver', 'Catalyst', 'Titan'].indexOf(level) >= ['Explorer', 'Maker', 'Builder', 'Solver', 'Catalyst', 'Titan'].indexOf(n)) ? '#0C3B2E' : '#EFEAE0' }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(journey.badges || []).slice(0, 3).map((b) => (
                  <span key={b.key} title={b.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid #EDE3CC', background: '#FCF8EF', borderRadius: 10, padding: '7px 10px', font: "600 13px/1 'Instrument Sans', sans-serif", color: '#6E5416' }}>
                    ⚡ {b.name}
                  </span>
                ))}
                {(journey.badges || []).length === 0 && (
                  <span style={{ font: "500 13px/1.4 'Instrument Sans', sans-serif", color: '#56635C' }}>Earn a badge by joining a room.</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Open missions" href="/student/innovation-club/missions" hrefLabel="All missions →" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {openMissions.length === 0 ? (
              <div style={{ border: '1.5px dashed #DCD3C0', borderRadius: 18, padding: '16px 18px', background: '#FDFBF6', font: "400 14.5px/1.5 'Instrument Sans', sans-serif", color: '#3E4C45' }}>
                No open missions yet. Join a room to unlock its missions.
              </div>
            ) : openMissions.slice(0, 4).map((m) => (
              <Link key={m._id} href={`/student/innovation-club/missions/${m._id}`} style={{
                textAlign: 'left', border: '1px solid #E7EAE8', borderRadius: 18,
                padding: 15, background: '#fff', display: 'flex', gap: 14, alignItems: 'center',
                textDecoration: 'none',
              }}>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', font: "600 13px/1 'Instrument Sans', sans-serif", marginBottom: 7, color: UNI_ACCENT[m.roomId?.universe] || '#8A6414' }}>{m.roomId?.name}</span>
                  <span style={{ display: 'block', font: "700 16px/1.25 'Space Grotesk', sans-serif", color: '#0C1512', marginBottom: 6 }}>{m.title}</span>
                  <span style={{ display: 'block', font: "500 13px/1 'JetBrains Mono', monospace", color: '#6E5416' }}>+{m.xpAward} XP · {m.difficulty}</span>
                </span>
                <span style={{ color: '#0C3B2E', font: "600 22px/1 'Instrument Sans', sans-serif" }}>→</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommended rooms */}
      {recommendedRooms.length > 0 && (
        <Card style={{ marginBottom: 18 }}>
          <CardHeader title="For you" href="/student/innovation-club/rooms" hrefLabel="More →" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,240px),1fr))', gap: 12 }}>
            {recommendedRooms.map((r) => (
              <Link key={r._id} href={`/student/innovation-club/rooms/${r.slug}`} style={{
                border: '1px solid #E7EAE8', borderRadius: 18, padding: 14,
                display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none',
                background: '#fff',
              }}>
                <span style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', fontSize: 22, background: UNI_SOFT[r.universe] || '#F4F7F5' }}>{r.iconEmoji || '·'}</span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span style={{ display: 'block', font: "700 15px/1.2 'Space Grotesk', sans-serif", color: '#0C1512' }}>{r.name}</span>
                  <span style={{ display: 'block', font: "500 12.5px/1.35 'Instrument Sans', sans-serif", color: '#3E4C45', marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.promise}</span>
                </span>
              </Link>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, padding: 22, minWidth: 0, ...(style || {}) }}>
      {children}
    </div>
  );
}
function CardHeader({ title, href, hrefLabel }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
      <h2 style={{ font: "700 21px/1.15 'Space Grotesk', sans-serif", letterSpacing: '-.02em', color: '#0C1512', margin: 0 }}>{title}</h2>
      {href && <Link href={href} style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#0C3B2E', textDecoration: 'none' }}>{hrefLabel}</Link>}
    </div>
  );
}
function Loading() {
  return <div style={{ padding: '80px 20px', textAlign: 'center', font: "500 14px 'Instrument Sans', sans-serif", color: '#56635C' }}>Loading Innovation Club…</div>;
}
function PaidGate() {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, padding: 32 }}>
        <div style={{ width: 56, height: 56, margin: '0 auto 18px', borderRadius: 18, background: '#0C3B2E', color: '#C9A55C', display: 'grid', placeItems: 'center', font: "700 20px 'Space Grotesk', sans-serif" }}>🔒</div>
        <h2 style={{ font: "700 24px/1.15 'Space Grotesk', sans-serif", color: '#0C1512', margin: 0 }}>Unlock Innovation Club</h2>
        <p style={{ font: "400 15px/1.55 'Instrument Sans', sans-serif", color: '#3E4C45', margin: '10px 0 22px' }}>Available to paid members only. Upgrade to join rooms, save seats, ship missions and grow your journey.</p>
        <Link href="/student/dashboard" style={{ display: 'inline-block', background: '#0C3B2E', color: '#fff', padding: '13px 22px', borderRadius: 15, font: "700 14px 'Instrument Sans', sans-serif", textDecoration: 'none' }}>Upgrade to access</Link>
      </div>
    </div>
  );
}

function formatCountdown(dateStr) {
  const ms = new Date(dateStr) - new Date();
  if (ms <= 0) return 'NOW';
  const totalMin = Math.floor(ms / 60000);
  const d = Math.floor(totalMin / (60 * 24));
  const h = Math.floor((totalMin - d * 60 * 24) / 60);
  const m = totalMin % 60;
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}m`;
}
