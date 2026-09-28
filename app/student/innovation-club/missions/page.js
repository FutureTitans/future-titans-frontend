'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';

const UNI_ACCENT = { BUILD: '#C2410C', FUTURE: '#2D5BFF', CREATE: '#7449F5', THINK: '#0E7C78', LIFE: '#D23A2A', EXPLORE: '#8A4DDB' };

export default function MissionsList() {
  const router = useRouter();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    (async () => {
      try { setMissions(await studentIC.listMissions()); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [router]);

  const list = missions.filter((m) => {
    if (filter === 'submitted') return !!m.mySubmission;
    if (filter === 'open') return !m.mySubmission;
    return true;
  });

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <div style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#8A6414', marginBottom: 12 }}>Missions</div>
        <h1 style={{ font: "700 clamp(32px,4vw,46px)/1.02 'Space Grotesk', sans-serif", letterSpacing: '-.04em', margin: 0, color: '#0C1512' }}>Turn what you learn into something real.</h1>
        <p style={{ font: "400 16px/1.6 'Instrument Sans', sans-serif", color: '#3E4C45', margin: '10px 0 0', maxWidth: 560 }}>Every mission awards XP toward your next level. Do them fast, don&apos;t polish.</p>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
        {['all', 'open', 'submitted'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              border: 'none', borderRadius: 999, padding: '9px 16px',
              font: "600 13.5px/1 'Instrument Sans', sans-serif", cursor: 'pointer',
              background: filter === f ? '#0C3B2E' : '#fff',
              color: filter === f ? '#fff' : '#0C1512',
              boxShadow: filter === f ? 'none' : '0 0 0 1px #E7EAE8 inset',
            }}
          >{f[0].toUpperCase() + f.slice(1)}</button>
        ))}
      </div>

      {loading ? <div style={{ padding: 60, textAlign: 'center', color: '#56635C' }}>Loading…</div> :
        list.length === 0 ? (
          <div style={{ border: '1.5px dashed #DCD3C0', borderRadius: 20, padding: 32, background: '#FDFBF6', textAlign: 'center', color: '#3E4C45' }}>No missions to show.</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,290px),1fr))', gap: 14 }}>
            {list.map((m) => {
              const submitted = !!m.mySubmission;
              const accent = UNI_ACCENT[m.roomId?.universe] || '#8A6414';
              return (
                <Link key={m._id} href={`/student/innovation-club/missions/${m._id}`} style={{
                  textAlign: 'left', border: '1px solid #E7EAE8', borderRadius: 20,
                  padding: 20, background: '#fff', display: 'block', textDecoration: 'none',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ font: "600 12px/1 'Instrument Sans', sans-serif", color: accent }}>{m.roomId?.name}</span>
                    <span style={{ font: "700 13px/1 'JetBrains Mono', monospace", color: '#6E5416', background: '#FCF3DF', borderRadius: 8, padding: '6px 8px' }}>+{m.xpAward} XP</span>
                  </span>
                  <span style={{ display: 'block', font: "700 18px/1.25 'Space Grotesk', sans-serif", color: '#0C1512', marginBottom: 8 }}>{m.title}</span>
                  <span style={{ display: 'block', font: "400 14.5px/1.5 'Instrument Sans', sans-serif", color: '#26322C', marginBottom: 14 }}>{m.description}</span>
                  <span style={{ display: 'flex', gap: 10, alignItems: 'center', font: "500 13px/1 'JetBrains Mono', monospace", color: '#3E4C45' }}>
                    <span>{m.difficulty}</span>
                    {m.deadline && <span>· due {new Date(m.deadline).toLocaleDateString()}</span>}
                    <span style={{ marginLeft: 'auto', font: "600 13px 'Instrument Sans', sans-serif", color: submitted ? '#0C3B2E' : '#8A6414' }}>
                      {submitted ? '✓ Submitted' : 'Start →'}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        )}
    </>
  );
}
