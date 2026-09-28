'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';

const UNI_ACCENT = { BUILD: '#C2410C', FUTURE: '#2D5BFF', CREATE: '#7449F5', THINK: '#0E7C78', LIFE: '#D23A2A', EXPLORE: '#8A4DDB' };

export default function LiveHub() {
  const router = useRouter();
  const [tab, setTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [replays, setReplays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    (async () => {
      setLoading(true);
      try {
        if (tab === 'replays') setReplays(await studentIC.listReplays());
        else setEvents(await studentIC.listEvents({ scope: tab }));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [tab, router]);

  const tabs = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'live', label: 'Live now' },
    { key: 'ended', label: 'Ended' },
    { key: 'replays', label: 'Replays' },
  ];

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#8A6414', marginBottom: 12 }}>Live sessions</div>
        <h1 style={{ font: "700 clamp(32px,4vw,46px)/1.02 'Space Grotesk', sans-serif", letterSpacing: '-.04em', margin: 0, color: '#0C1512' }}>Show up. Ask what you actually want to know.</h1>
        <p style={{ font: "400 16px/1.6 'Instrument Sans', sans-serif", color: '#3E4C45', margin: '10px 0 0', maxWidth: 560 }}>AMAs, build-alongs, VS. debates and confession booths. Save your seat before it starts.</p>
      </div>

      <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid #E7EAE8', marginBottom: 22, overflowX: 'auto' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            onClick={() => setTab(t.key)}
            style={{
              border: 'none', background: 'none', padding: '13px 16px',
              font: "650 15px/1 'Instrument Sans', sans-serif", cursor: 'pointer',
              whiteSpace: 'nowrap', marginBottom: -1,
              color: tab === t.key ? '#0C1512' : '#56635C',
              borderBottom: `3px solid ${tab === t.key ? '#0C3B2E' : 'transparent'}`,
            }}
          >{t.label}</button>
        ))}
      </div>

      {loading ? <div style={{ padding: 60, textAlign: 'center', color: '#56635C' }}>Loading…</div> :
        tab === 'replays' ? (
          replays.length === 0 ? <Empty text="No replays yet." icon="📼" /> :
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap: 14 }}>
              {replays.map((r) => (
                <div key={r._id} style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '16 / 9', background: '#F1F4F2' }}>
                    {r.thumbnailUrl && <img src={r.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ font: "500 12px/1 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase', marginBottom: 6 }}>{r.roomId?.name}</div>
                    <div style={{ font: "700 17px/1.25 'Space Grotesk', sans-serif", color: '#0C1512', marginBottom: 10 }}>{r.title}</div>
                    <a href={r.videoUrl} target="_blank" rel="noreferrer" onClick={() => studentIC.viewReplay(r._id).catch(() => {})} style={{
                      display: 'inline-block', background: '#0C3B2E', color: '#fff',
                      borderRadius: 12, padding: '10px 14px',
                      font: "600 13px/1 'Instrument Sans', sans-serif", textDecoration: 'none',
                    }}>▶ Watch replay</a>
                  </div>
                </div>
              ))}
            </div>
        ) : events.length === 0 ? <Empty text="Nothing to show here yet." icon="🎤" /> :
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {events.map((e) => <BigEventCard key={e._id} event={e} />)}
          </div>
      }
    </>
  );
}

function BigEventCard({ event }) {
  const isLive = event.status === 'live';
  const accent = UNI_ACCENT[event.roomId?.universe] || '#0C3B2E';
  return (
    <Link href={`/student/innovation-club/live/${event._id}`} style={{
      display: 'flex', alignItems: 'stretch', gap: 16, background: '#fff',
      border: '1px solid #E7EAE8', borderRadius: 22, padding: 18,
      textDecoration: 'none',
    }}>
      <div style={{ width: 180, aspectRatio: '16 / 9', background: '#F1F4F2', borderRadius: 16, flex: 'none', overflow: 'hidden' }}>
        {event.thumbnailUrl && <img src={event.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ font: "700 12px/1 'Space Grotesk', sans-serif", color: '#fff', background: accent, borderRadius: 8, padding: '5px 8px', letterSpacing: '.04em' }}>{event.roomId?.name}</span>
          <span style={{ font: "500 12px/1 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase' }}>{event.format}</span>
          {isLive && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: "700 12px/1 'Instrument Sans', sans-serif", color: '#A8322A', background: '#FDF5F4', border: '1px solid #F0D9D7', borderRadius: 999, padding: '5px 9px' }}>
              <span style={{ width: 6, height: 6, borderRadius: 6, background: '#C83A30', animation: 'ftPulse 1.6s ease-in-out infinite' }} />
              Live now
            </span>
          )}
        </div>
        <div style={{ font: "700 20px/1.2 'Space Grotesk', sans-serif", color: '#0C1512' }}>{event.title}</div>
        <div style={{ font: "500 13.5px/1.4 'Instrument Sans', sans-serif", color: '#3E4C45' }}>with {event.guest || 'Guest TBA'}</div>
        <div style={{ font: "500 13px/1 'JetBrains Mono', monospace", color: '#3E4C45', marginTop: 'auto' }}>
          {new Date(event.startAt).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · {event.durationMinutes} min
          {event.myRegistration && <span style={{ marginLeft: 12, color: '#6E5416' }}>✓ Going</span>}
        </div>
      </div>
    </Link>
  );
}

function Empty({ text, icon }) {
  return (
    <div style={{ border: '1.5px dashed #DCD3C0', borderRadius: 20, padding: 32, background: '#FDFBF6', display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ font: "400 15px/1.55 'Instrument Sans', sans-serif", color: '#3E4C45' }}>{text}</span>
    </div>
  );
}
