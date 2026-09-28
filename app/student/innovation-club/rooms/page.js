'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';

const UNI_ACCENT = { BUILD: '#C2410C', FUTURE: '#2D5BFF', CREATE: '#7449F5', THINK: '#0E7C78', LIFE: '#D23A2A', EXPLORE: '#8A4DDB' };
const UNI_SOFT   = { BUILD: '#FDF1E4', FUTURE: '#E9EEFF', CREATE: '#F0EAFE', THINK: '#E4F1F0', LIFE: '#FBE9E7', EXPLORE: '#EFE7F8' };
const UNI_BLURB  = {
  BUILD: 'Founders, side hustles and everything in between.',
  FUTURE: 'AI, robotics, space and future tech.',
  CREATE: 'Content, design, music and style.',
  THINK: 'Creativity, problem solving and self-mastery.',
  LIFE: 'The real stuff — failure, comebacks, discipline.',
  EXPLORE: 'The unexpected. The unconventional.',
};

export default function RoomsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    (async () => {
      try {
        const [d, j] = await Promise.all([studentIC.listRooms(), studentIC.getJourney()]);
        setData(d); setJourney(j);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [router]);

  const joined = useMemo(() => new Set((journey?.joinedRoomIds || []).map(String)), [journey]);
  const grouped = useMemo(() => {
    const map = {};
    (data?.rooms || []).forEach((r) => {
      (map[r.universe] = map[r.universe] || []).push(r);
    });
    return map;
  }, [data]);

  const toggleJoin = async (r) => {
    setBusy(r._id);
    try {
      if (joined.has(r._id.toString())) await studentIC.leaveRoom(r.slug);
      else await studentIC.joinRoom(r.slug);
      setJourney(await studentIC.getJourney());
    } catch (e) { alert('Could not update room.'); }
    finally { setBusy(null); }
  };

  const openRoom = useCallback((slug) => {
    router.push(`/student/innovation-club/rooms/${slug}`);
  }, [router]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#56635C' }}>Loading rooms…</div>;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#8A6414', marginBottom: 12 }}>
            Pick your space · {(data?.universes || []).length} universes · {(data?.rooms || []).length} rooms
          </div>
          <h1 style={{ font: "700 clamp(32px,4vw,46px)/1.02 'Space Grotesk', sans-serif", letterSpacing: '-.04em', margin: 0, color: '#0C1512' }}>
            Build. Future. Create. Think. Life. Explore.
          </h1>
          <p style={{ font: "400 16px/1.6 'Instrument Sans', sans-serif", color: '#3E4C45', margin: '10px 0 0', maxWidth: 560 }}>
            Start where you feel at home. Then explore what you haven&apos;t tried yet.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        {(data?.universes || []).map((u) => {
          const rooms = grouped[u.key] || [];
          if (rooms.length === 0) return null;
          return (
            <section key={u.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{
                  font: "700 14px/1 'Space Grotesk', sans-serif", letterSpacing: '.05em', color: '#fff',
                  borderRadius: 11, padding: '9px 13px', background: UNI_ACCENT[u.key],
                }}>{u.emoji} {u.name}</span>
                <span style={{ font: "400 15px/1.4 'Instrument Sans', sans-serif", color: '#3E4C45' }}>
                  {UNI_BLURB[u.key]}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap: 14 }}>
                {rooms.map((r) => {
                  const isJoined = joined.has(r._id.toString());
                  const accent = UNI_ACCENT[r.universe] || '#0C3B2E';
                  const soft = UNI_SOFT[r.universe] || '#F4F7F5';
                  return (
                    <div key={r._id} style={{
                      background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22,
                      padding: 20, display: 'flex', flexDirection: 'column', gap: 13,
                    }}>
                      <button
                        onClick={() => openRoom(r.slug)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14, background: 'none',
                          border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', width: '100%',
                        }}
                      >
                        <span style={{
                          width: 54, height: 54, borderRadius: 18, display: 'grid', placeItems: 'center',
                          fontSize: 27, flex: 'none', background: soft,
                        }}>{r.iconEmoji || u.emoji}</span>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: 'block', font: "700 19px/1.15 'Space Grotesk', sans-serif", letterSpacing: '-.015em', color: '#0C1512' }}>{r.name}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6, font: "500 13px/1.2 'Instrument Sans', sans-serif", color: '#3E4C45', marginTop: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: 6, background: accent }} />
                            {r.memberCount || 0} members
                          </span>
                        </span>
                      </button>
                      <div style={{ font: "400 15px/1.5 'Instrument Sans', sans-serif", color: '#26322C', flex: 1 }}>
                        {r.promise || 'A community for building, thinking and sharing.'}
                      </div>
                      {r.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {r.tags.slice(0, 4).map((t) => (
                            <span key={t} style={{
                              font: "500 13px/1 'Instrument Sans', sans-serif", color: '#26322C',
                              background: '#F1F4F2', borderRadius: 8, padding: '6px 9px',
                            }}>#{t}</span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => toggleJoin(r)}
                          disabled={busy === r._id}
                          style={{
                            flex: 1, borderRadius: 13, padding: 12,
                            font: "600 14px/1 'Instrument Sans', sans-serif",
                            cursor: 'pointer',
                            border: isJoined ? `1.5px solid ${accent}` : '1.5px solid #0C3B2E',
                            background: isJoined ? soft : '#0C3B2E',
                            color: isJoined ? accent : '#fff',
                          }}
                        >{isJoined ? 'Joined ✓' : 'Join Room'}</button>
                        <button
                          onClick={() => openRoom(r.slug)}
                          style={{
                            border: '1px solid #E7EAE8', background: '#fff', color: '#0C1512',
                            borderRadius: 13, padding: '12px 16px',
                            font: "600 14px/1 'Instrument Sans', sans-serif", cursor: 'pointer',
                          }}
                        >Enter</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
