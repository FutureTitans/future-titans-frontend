'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';

const UNI_ACCENT = { BUILD: '#C2410C', FUTURE: '#2D5BFF', CREATE: '#7449F5', THINK: '#0E7C78', LIFE: '#D23A2A', EXPLORE: '#8A4DDB' };
const UNI_SOFT = { BUILD: '#FDF1E4', FUTURE: '#E9EEFF', CREATE: '#F0EAFE', THINK: '#E4F1F0', LIFE: '#FBE9E7', EXPLORE: '#EFE7F8' };

export default function RoomDetailPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try { setData(await studentIC.getRoom(slug)); }
    catch (e) { setError(e?.error || 'Room not found'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    load();
  }, [slug, router]);

  const toggle = async () => {
    try {
      if (data.joined) await studentIC.leaveRoom(slug);
      else await studentIC.joinRoom(slug);
      await load();
    } catch { alert('Could not update.'); }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#56635C' }}>Loading room…</div>;
  if (error) return <div style={{ padding: 60, textAlign: 'center', color: '#C83A30' }}>{error}</div>;
  const { room, events = [], missions = [], replays = [], joined } = data;
  const accent = UNI_ACCENT[room.universe] || '#0C3B2E';
  const soft = UNI_SOFT[room.universe] || '#F4F7F5';
  const upcoming = events.filter((e) => e.status !== 'ended');
  const past = events.filter((e) => e.status === 'ended');

  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
    { key: 'missions', label: `Missions (${missions.length})` },
    { key: 'vault', label: `Vault (${replays.length + past.length})` },
  ];

  return (
    <>
      <Link href="/student/innovation-club/rooms" style={{ background: 'none', border: 'none', font: "600 14px 'Instrument Sans', sans-serif", color: '#3E4C45', cursor: 'pointer', padding: '0 0 16px', textDecoration: 'none', display: 'inline-block' }}>← All rooms</Link>

      <div style={{
        borderRadius: 28, padding: 'clamp(22px,3vw,34px)', position: 'relative',
        overflow: 'hidden', marginBottom: 20, background: soft,
      }}>
        <div style={{ position: 'absolute', right: -90, top: -90, width: 320, height: 320, borderRadius: '50%', opacity: 0.92, background: accent }} />
        <div style={{ position: 'absolute', right: 26, top: 36, width: 250, height: 250, borderRadius: '50%', border: '1.5px dashed rgba(15,26,21,.2)', animation: 'ftSpin 70s linear infinite' }} />
        <span style={{ position: 'absolute', right: 66, top: 56, fontSize: 70, lineHeight: 1, animation: 'ftBob 6s ease-in-out infinite' }}>{room.iconEmoji || '·'}</span>

        <div style={{ position: 'relative', maxWidth: 620 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ font: "700 13px/1 'Space Grotesk', sans-serif", letterSpacing: '.05em', color: '#fff', borderRadius: 9, padding: '7px 11px', background: accent }}>{room.universe}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: "500 14px/1 'Instrument Sans', sans-serif", color: '#26322C' }}>
              <span style={{ width: 7, height: 7, borderRadius: 7, background: accent }} />
              {room.memberCount || 0} members
            </span>
          </div>
          <h1 style={{ font: "700 clamp(36px,4.6vw,56px)/1 'Space Grotesk', sans-serif", letterSpacing: '-.04em', margin: '0 0 14px', color: '#0C1512', maxWidth: 520 }}>{room.name}</h1>
          <p style={{ font: "400 18px/1.5 'Instrument Sans', sans-serif", color: '#26322C', margin: '0 0 16px', maxWidth: 500 }}>{room.promise}</p>
          {room.tags?.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 22 }}>
              {room.tags.map((t) => (
                <span key={t} style={{ font: "600 13.5px/1 'Instrument Sans', sans-serif", color: '#0C1512', background: 'rgba(255,255,255,.75)', borderRadius: 999, padding: '8px 12px' }}>#{t}</span>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={toggle} style={{
              background: joined ? '#fff' : '#0C3B2E', color: joined ? '#0C3B2E' : '#fff',
              border: '2px solid #0C3B2E', borderRadius: 15,
              padding: joined ? '15px 22px' : '15px 26px',
              font: "700 15px/1 'Instrument Sans', sans-serif", cursor: 'pointer',
            }}>{joined ? 'Joined ✓ · Leave' : 'Join Room'}</button>
          </div>
        </div>
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
              whiteSpace: 'nowrap', marginBottom: -1, transition: 'color .16s',
              color: tab === t.key ? '#0C1512' : '#56635C',
              borderBottom: `3px solid ${tab === t.key ? '#0C3B2E' : 'transparent'}`,
            }}
          >{t.label}</button>
        ))}
      </div>

      {tab === 'home' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 18 }}>
          <Card>
            <SectionTitle>Next session</SectionTitle>
            {upcoming[0] ? <EventRow event={upcoming[0]} /> : <Empty text="Nothing scheduled yet. When a session lands, it appears here first." icon="🎤" />}
          </Card>
          <Card>
            <SectionTitle>Featured mission</SectionTitle>
            {missions[0] ? (
              <>
                <div style={{ font: "700 20px/1.25 'Space Grotesk', sans-serif", color: '#0C1512', marginBottom: 8 }}>{missions[0].title}</div>
                <div style={{ font: "400 15px/1.55 'Instrument Sans', sans-serif", color: '#26322C', marginBottom: 14 }}>{missions[0].description}</div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16, font: "500 13px/1 'JetBrains Mono', monospace", color: '#3E4C45' }}>
                  <span>{missions[0].difficulty}</span>
                  <span style={{ color: '#6E5416' }}>+{missions[0].xpAward} XP</span>
                </div>
                <Link href={`/student/innovation-club/missions/${missions[0]._id}`} style={{ background: '#0C3B2E', color: '#fff', borderRadius: 13, padding: '12px 18px', font: "600 14px/1 'Instrument Sans', sans-serif", textDecoration: 'none', display: 'inline-block' }}>Start mission</Link>
              </>
            ) : <Empty text="Missions for this room are released alongside sessions." icon="🎯" />}
          </Card>
          <Card>
            <SectionTitle>Recent replay</SectionTitle>
            {replays[0] ? <ReplayRow r={replays[0]} /> : <Empty text="Replays land here after live sessions end." icon="📼" />}
          </Card>
        </div>
      )}

      {tab === 'upcoming' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {upcoming.length === 0 ? <Empty text="Nothing scheduled yet." icon="🎤" /> : upcoming.map((e) => <EventRow key={e._id} event={e} />)}
        </div>
      )}

      {tab === 'missions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,290px),1fr))', gap: 14 }}>
          {missions.length === 0 ? <Empty text="No missions here yet." icon="🎯" /> :
            missions.map((m) => (
              <Link key={m._id} href={`/student/innovation-club/missions/${m._id}`} style={{
                textAlign: 'left', border: '1px solid #E7EAE8', borderRadius: 20,
                padding: 20, background: '#fff', display: 'block', textDecoration: 'none',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ font: "500 13px/1 'Instrument Sans', sans-serif", color: '#3E4C45' }}>{m.difficulty}</span>
                  <span style={{ font: "700 13px/1 'JetBrains Mono', monospace", color: '#6E5416', background: '#FCF3DF', borderRadius: 8, padding: '6px 8px' }}>+{m.xpAward} XP</span>
                </span>
                <span style={{ display: 'block', font: "700 18px/1.25 'Space Grotesk', sans-serif", color: '#0C1512', marginBottom: 8 }}>{m.title}</span>
                <span style={{ display: 'block', font: "400 14.5px/1.5 'Instrument Sans', sans-serif", color: '#26322C' }}>{m.description}</span>
              </Link>
            ))}
        </div>
      )}

      {tab === 'vault' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: 14 }}>
          {replays.length === 0 && past.length === 0 && <Empty text="Nothing in the vault yet." icon="📼" />}
          {replays.map((r) => <ReplayCard key={r._id} r={r} />)}
          {past.map((e) => (
            <Card key={e._id}>
              <div style={{ font: "500 11px/1 'JetBrains Mono', monospace", color: '#56635C', marginBottom: 8, textTransform: 'uppercase' }}>Past event</div>
              <div style={{ font: "700 16px/1.25 'Space Grotesk', sans-serif", color: '#0C1512' }}>{e.title}</div>
              <div style={{ font: "500 13px/1 'JetBrains Mono', monospace", color: '#3E4C45', marginTop: 8 }}>{new Date(e.startAt).toLocaleDateString()}</div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

function Card({ children }) {
  return <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, padding: 22 }}>{children}</div>;
}
function SectionTitle({ children }) {
  return <h2 style={{ font: "700 21px/1.15 'Space Grotesk', sans-serif", letterSpacing: '-.02em', color: '#0C1512', margin: '0 0 14px' }}>{children}</h2>;
}
function Empty({ text, icon }) {
  return (
    <div style={{ border: '1.5px dashed #DCD3C0', borderRadius: 20, padding: 22, background: '#FDFBF6', display: 'flex', gap: 14, alignItems: 'center' }}>
      <span style={{ width: 46, height: 46, borderRadius: 15, background: '#FCF3DF', display: 'grid', placeItems: 'center', fontSize: 22, flex: 'none' }}>{icon}</span>
      <span style={{ font: "400 15px/1.55 'Instrument Sans', sans-serif", color: '#3E4C45' }}>{text}</span>
    </div>
  );
}
function EventRow({ event }) {
  return (
    <Link href={`/student/innovation-club/live/${event._id}`} style={{
      display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #E7EAE8', borderRadius: 18,
      padding: 15, background: '#FAFBFA', textDecoration: 'none',
    }}>
      <div style={{ width: 62, textAlign: 'center', flex: 'none' }}>
        <div style={{ font: "500 12px/1 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase' }}>{new Date(event.startAt).toLocaleDateString([], { weekday: 'short' })}</div>
        <div style={{ font: "700 16px/1 'Space Grotesk', sans-serif", color: '#0C1512', marginTop: 4 }}>{new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: "600 16px/1.25 'Space Grotesk', sans-serif", color: '#0C1512' }}>{event.title}</div>
        <div style={{ font: "500 13px/1.2 'Instrument Sans', sans-serif", color: '#3E4C45', marginTop: 4 }}>{event.format} · {event.guest || 'Guest TBA'}</div>
      </div>
      {event.status === 'live' && (
        <span style={{ font: "600 11px/1 'JetBrains Mono', monospace", color: '#C83A30', textTransform: 'uppercase' }}>● live</span>
      )}
    </Link>
  );
}
function ReplayCard({ r }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, overflow: 'hidden' }}>
      <div style={{ aspectRatio: '16 / 9', background: '#F1F4F2' }}>
        {r.thumbnailUrl && <img src={r.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ font: "700 16px/1.25 'Space Grotesk', sans-serif", color: '#0C1512' }}>{r.title}</div>
        <a href={r.videoUrl} target="_blank" rel="noreferrer" onClick={() => studentIC.viewReplay(r._id).catch(() => {})} style={{ font: "600 13px 'Instrument Sans', sans-serif", color: '#8A6414', marginTop: 8, display: 'inline-block' }}>▶ Watch replay</a>
      </div>
    </div>
  );
}
function ReplayRow({ r }) {
  return (
    <a href={r.videoUrl} target="_blank" rel="noreferrer" onClick={() => studentIC.viewReplay(r._id).catch(() => {})} style={{
      display: 'flex', gap: 12, alignItems: 'center', border: '1px solid #E7EAE8',
      borderRadius: 18, padding: 12, background: '#FAFBFA', textDecoration: 'none',
    }}>
      <div style={{ width: 96, aspectRatio: '16 / 9', background: '#F1F4F2', borderRadius: 12, flex: 'none', overflow: 'hidden' }}>
        {r.thumbnailUrl && <img src={r.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: "600 15px/1.25 'Space Grotesk', sans-serif", color: '#0C1512' }}>{r.title}</div>
        <div style={{ font: "500 12px/1 'JetBrains Mono', monospace", color: '#56635C', marginTop: 4 }}>{Math.round((r.durationSeconds || 0) / 60)} min</div>
      </div>
    </a>
  );
}
