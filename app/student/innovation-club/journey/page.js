'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';

const LEVELS = ['Explorer', 'Maker', 'Builder', 'Solver', 'Catalyst', 'Titan'];

export default function JourneyPage() {
  const router = useRouter();
  const [j, setJ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    (async () => {
      try { setJ(await studentIC.getJourney()); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [router]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#56635C' }}>Loading your journey…</div>;
  const xp = j?.xp || 0;
  const level = j?.level || 'Explorer';
  const nextTh = j?.nextThreshold;
  const prevTh = j?.prevThreshold || 0;
  const pct = nextTh ? Math.min(1, (xp - prevTh) / (nextTh - prevTh)) : 1;
  const ringDash = `${(pct * 2 * Math.PI * 60).toFixed(1)} 500`;
  const timeline = j?.timeline || [];
  const badges = j?.badges || [];
  const counters = j?.counters || {};
  const rooms = j?.joinedRooms || [];
  const currentLevelIdx = LEVELS.indexOf(level);

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#8A6414', marginBottom: 12 }}>My Journey</div>
        <h1 style={{ font: "700 clamp(32px,4vw,46px)/1.02 'Space Grotesk', sans-serif", letterSpacing: '-.04em', margin: 0, color: '#0C1512' }}>Level up. Ship. Show it.</h1>
      </div>

      <div style={{ background: '#0A2C22', borderRadius: 28, padding: 'clamp(22px,3vw,34px)', color: '#fff', position: 'relative', overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ position: 'absolute', right: -80, top: -80, width: 260, height: 260, borderRadius: '50%', background: 'rgba(201,165,92,.16)', filter: 'blur(24px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 30, alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 148, height: 148, flex: 'none' }}>
            <svg width="148" height="148" viewBox="0 0 148 148" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="74" cy="74" r="60" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="12" />
              <circle cx="74" cy="74" r="60" fill="none" stroke="#C9A55C" strokeWidth="12" strokeLinecap="round" strokeDasharray={ringDash} style={{ transition: 'stroke-dasharray .9s cubic-bezier(.2,.8,.2,1)' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ font: "700 40px/1 'Space Grotesk', sans-serif", color: '#fff' }}>{xp}</div>
              <div style={{ font: "500 13px/1 'JetBrains Mono', monospace", color: '#B9D3C7', marginTop: 4 }}>XP</div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ font: "500 13px/1 'JetBrains Mono', monospace", color: '#B9D3C7', textTransform: 'uppercase' }}>Current level</div>
            <div style={{ font: "700 32px/1 'Space Grotesk', sans-serif", color: '#C9A55C', letterSpacing: '-.02em', marginTop: 6 }}>{level}</div>
            <div style={{ font: "500 14px/1.4 'Instrument Sans', sans-serif", color: '#B9D3C7', marginTop: 6 }}>
              {nextTh ? `${nextTh - xp} XP until you reach the next level` : 'You have reached the top level.'}
            </div>
            <div style={{ display: 'flex', gap: 5, marginTop: 14 }}>
              {LEVELS.map((n, i) => (
                <span key={n} title={n} style={{ flex: 1, height: 7, borderRadius: 7, background: i <= currentLevelIdx ? '#C9A55C' : 'rgba(255,255,255,.1)' }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <Stat label="Streak" value={`${j?.weeklyStreak || 0}w`} />
              <Stat label="Badges" value={badges.length} />
              <Stat label="Attended" value={counters.sessionsAttended || 0} />
              <Stat label="Missions" value={counters.missionsCompleted || 0} />
              <Stat label="Questions" value={counters.questionsAsked || 0} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 18 }}>
        <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, padding: 22, gridColumn: 'span 2', minWidth: 0 }}>
          <h2 style={{ font: "700 21px/1.15 'Space Grotesk', sans-serif", letterSpacing: '-.02em', color: '#0C1512', margin: '0 0 14px' }}>Timeline</h2>
          {timeline.length === 0 ? (
            <div style={{ border: '1.5px dashed #DCD3C0', borderRadius: 18, padding: 18, background: '#FDFBF6', font: "400 14px 'Instrument Sans', sans-serif", color: '#3E4C45' }}>Milestones appear here as you attend sessions, ship missions and join rooms.</div>
          ) : (
            <ol style={{ position: 'relative', borderLeft: '2px solid #EFEAE0', paddingLeft: 20, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {timeline.slice(0, 30).map((t) => (
                <li key={t._id || `${t.at}-${t.label}`} style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: -28, top: 3, width: 12, height: 12, borderRadius: 12, background: '#C9A55C', border: '3px solid #fff', boxShadow: '0 0 0 1px #EFEAE0' }} />
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ font: "600 15px 'Instrument Sans', sans-serif", color: '#0C1512' }}>{t.label}</div>
                      <div style={{ font: "500 12px 'JetBrains Mono', monospace", color: '#56635C', marginTop: 3 }}>{new Date(t.at).toLocaleString()}</div>
                    </div>
                    {t.xp > 0 && <span style={{ font: "700 13px 'JetBrains Mono', monospace", color: '#6E5416', background: '#FCF3DF', borderRadius: 8, padding: '5px 8px', flex: 'none' }}>+{t.xp} XP</span>}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, padding: 22 }}>
            <h3 style={{ font: "700 18px 'Space Grotesk', sans-serif", color: '#0C1512', margin: '0 0 12px' }}>Badges</h3>
            {badges.length === 0 ? (
              <div style={{ font: "400 13.5px 'Instrument Sans', sans-serif", color: '#56635C' }}>Earn your first by joining a room or shipping a mission.</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
                {badges.map((b) => (
                  <div key={b.key} style={{ border: '1px solid #EDE3CC', background: '#FCF8EF', borderRadius: 14, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 22 }}>⚡</div>
                    <div style={{ font: "600 13px 'Space Grotesk', sans-serif", color: '#6E5416', marginTop: 4 }}>{b.name}</div>
                    <div style={{ font: "500 11px 'JetBrains Mono', monospace", color: '#8A6414', marginTop: 3 }}>{new Date(b.awardedAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, padding: 22 }}>
            <h3 style={{ font: "700 18px 'Space Grotesk', sans-serif", color: '#0C1512', margin: '0 0 12px' }}>Joined rooms</h3>
            {rooms.length === 0 ? (
              <div style={{ font: "400 13.5px 'Instrument Sans', sans-serif", color: '#56635C' }}>
                <Link href="/student/innovation-club/rooms" style={{ color: '#0C3B2E', textDecoration: 'underline' }}>Join your first room →</Link>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {rooms.map((r) => (
                  <li key={r._id}>
                    <Link href={`/student/innovation-club/rooms/${r.slug}`} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px', borderRadius: 10, font: "600 14px 'Instrument Sans', sans-serif", color: '#0C1512', textDecoration: 'none', background: '#FAF8F3' }}>
                      <span style={{ fontSize: 18 }}>{r.iconEmoji || '·'}</span>
                      {r.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 14, padding: '10px 12px', minWidth: 90 }}>
      <div style={{ font: "500 11px/1 'JetBrains Mono', monospace", color: '#B9D3C7', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ font: "700 20px/1 'Space Grotesk', sans-serif", color: '#fff', marginTop: 4 }}>{value}</div>
    </div>
  );
}
