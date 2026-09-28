'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, ArrowRight } from 'lucide-react';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const UNIVERSE_COLORS = {
  BUILD: '#C2410C',
  FUTURE: '#2D5BFF',
  CREATE: '#7449F5',
  THINK: '#0E7C78',
  LIFE: '#D23A2A',
  EXPLORE: '#8A4DDB',
};

export default function RoomsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    (async () => {
      try {
        const [rooms, j] = await Promise.all([studentIC.listRooms(), studentIC.getJourney()]);
        setData(rooms);
        setJourney(j);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const joinedSet = useMemo(() => new Set((journey?.joinedRoomIds || []).map(String)), [journey]);

  const grouped = useMemo(() => {
    if (!data) return {};
    const byU = {};
    for (const r of data.rooms) {
      if (filter !== 'ALL' && r.universe !== filter) continue;
      if (!byU[r.universe]) byU[r.universe] = [];
      byU[r.universe].push(r);
    }
    return byU;
  }, [data, filter]);

  const toggleJoin = async (room) => {
    try {
      if (joinedSet.has(room._id.toString())) {
        await studentIC.leaveRoom(room.slug);
      } else {
        await studentIC.joinRoom(room.slug);
      }
      const j = await studentIC.getJourney();
      setJourney(j);
    } catch (e) {
      alert('Could not update room membership.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading rooms..." />;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/student/innovation-club" className="inline-flex items-center gap-2 text-sm text-[#0A2C22] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Command Center
        </Link>

        <div className="mb-8">
          <div className="text-xs font-bold tracking-[0.2em] text-[#0A2C22]/60 uppercase">Rooms</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0A2C22] mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Pick your rooms. Find your people.
          </h1>
          <p className="text-gray-600 text-sm mt-2 max-w-2xl">
            Rooms are the identity layer of the club. Join what you care about — every room has live sessions, missions, replays and a moderated lounge.
          </p>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          <UPill active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="All" />
          {(data?.universes || []).map((u) => (
            <UPill key={u.key} active={filter === u.key} onClick={() => setFilter(u.key)} label={`${u.emoji} ${u.name}`} color={UNIVERSE_COLORS[u.key]} />
          ))}
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center text-gray-500">
            No rooms published yet. Check back soon.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([universe, rooms]) => (
              <section key={universe}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-2 h-2 rounded-full" style={{ background: UNIVERSE_COLORS[universe] || '#0A2C22' }} />
                  <h2 className="text-lg font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{universe}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rooms.map((r) => {
                    const joined = joinedSet.has(r._id.toString());
                    const accent = UNIVERSE_COLORS[universe] || '#0A2C22';
                    return (
                      <div key={r._id} className="group relative rounded-3xl bg-white border border-gray-100 overflow-hidden hover:shadow-lg transition-all" style={{ borderTop: `4px solid ${accent}` }}>
                        {r.coverImage && (
                          <div className="h-32 overflow-hidden">
                            <img src={r.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{r.iconEmoji || '•'}</span>
                              <h3 className="font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{r.name}</h3>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono uppercase inline-flex items-center gap-1">
                              <Users className="w-3 h-3" /> {r.memberCount || 0}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed min-h-[2.5rem]">{r.promise || 'A community for building, thinking and sharing.'}</p>
                          {r.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {r.tags.slice(0, 4).map((t) => (
                                <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t}</span>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => toggleJoin(r)}
                              className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${joined ? 'bg-[#0A2C22]/10 text-[#0A2C22]' : 'bg-[#0A2C22] text-white hover:bg-[#0C3B2E]'}`}
                            >
                              {joined ? 'Joined ✓' : 'Join Room'}
                            </button>
                            <Link href={`/student/innovation-club/rooms/${r.slug}`} className="text-xs text-[#0A2C22] font-semibold hover:underline inline-flex items-center gap-1">
                              Open <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UPill({ active, onClick, label, color }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${active ? 'bg-[#0A2C22] text-white border-[#0A2C22]' : 'bg-white text-[#0A2C22] border-gray-200 hover:border-[#0A2C22]/40'}`}
      style={active && color ? { background: color, borderColor: color } : {}}
    >
      {label}
    </button>
  );
}
