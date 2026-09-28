'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Users, Radio, Target, Video, Calendar } from 'lucide-react';
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

export default function RoomDetailPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const d = await studentIC.getRoom(slug);
      setData(d);
    } catch (e) {
      setError(e?.error || 'Room not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    load();
  }, [slug, router]);

  const toggleJoin = async () => {
    try {
      if (data.joined) await studentIC.leaveRoom(slug);
      else await studentIC.joinRoom(slug);
      await load();
    } catch (e) {
      alert('Could not update membership.');
    }
  };

  if (loading) return <LoadingSpinner message="Loading room..." />;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  const { room, events = [], missions = [], replays = [], joined } = data;

  const accent = UNIVERSE_COLORS[room.universe] || '#0A2C22';
  const upcoming = events.filter((e) => e.status !== 'ended');
  const past = events.filter((e) => e.status === 'ended');

  const tabs = [
    { key: 'home', label: 'Home' },
    { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
    { key: 'missions', label: `Missions (${missions.length})` },
    { key: 'vault', label: `Vault (${replays.length + past.length})` },
  ];

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF8F3]">
      <div className="relative">
        {room.coverImage ? (
          <div className="h-56 md:h-64 overflow-hidden relative">
            <img src={room.coverImage} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 20%, ${accent}44 60%, #0A2C22 100%)` }} />
          </div>
        ) : (
          <div className="h-40" style={{ background: `linear-gradient(135deg, ${accent}, #0A2C22)` }} />
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <Link href="/student/innovation-club/rooms" className="inline-flex items-center gap-2 text-xs text-white hover:underline mb-4">
          <ArrowLeft className="w-3 h-3" /> All rooms
        </Link>
        <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wide" style={{ color: accent }}>{room.universe}</div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#0A2C22] mt-1 flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <span>{room.iconEmoji || '•'}</span>
                {room.name}
              </h1>
              <p className="text-gray-600 text-sm mt-2 max-w-2xl">{room.promise}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-gray-500 inline-flex items-center gap-1"><Users className="w-3 h-3" /> {room.memberCount || 0} members</span>
                {room.tags?.map((t) => <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t}</span>)}
              </div>
            </div>
            <button
              onClick={toggleJoin}
              className={`text-sm font-bold px-6 py-3 rounded-full transition-all flex-shrink-0 ${joined ? 'bg-[#0A2C22]/10 text-[#0A2C22]' : 'bg-[#0A2C22] text-white hover:bg-[#0C3B2E]'}`}
            >
              {joined ? 'Joined ✓' : 'Join Room'}
            </button>
          </div>

          <div className="flex gap-1 border-b border-gray-100 mt-8 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`text-sm font-semibold px-4 py-3 border-b-2 transition-all ${tab === t.key ? 'border-[#0A2C22] text-[#0A2C22]' : 'border-transparent text-gray-500 hover:text-[#0A2C22]'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="pt-6">
            {tab === 'home' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SectionCard title="Next up" icon={Radio} accent={accent}>
                  {upcoming[0] ? (
                    <EventRow event={upcoming[0]} />
                  ) : (
                    <Empty text="Nothing scheduled yet." />
                  )}
                </SectionCard>
                <SectionCard title="Featured mission" icon={Target} accent={accent}>
                  {missions[0] ? (
                    <MissionRow mission={missions[0]} />
                  ) : (
                    <Empty text="No missions in this room yet." />
                  )}
                </SectionCard>
              </div>
            )}

            {tab === 'upcoming' && (
              <div className="space-y-3">
                {upcoming.length === 0 ? <Empty text="Nothing scheduled." /> :
                  upcoming.map((e) => <EventRow key={e._id} event={e} />)}
              </div>
            )}

            {tab === 'missions' && (
              <div className="space-y-3">
                {missions.length === 0 ? <Empty text="No missions." /> :
                  missions.map((m) => <MissionRow key={m._id} mission={m} />)}
              </div>
            )}

            {tab === 'vault' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {replays.length === 0 && past.length === 0 && <Empty text="Nothing in the vault yet." />}
                {replays.map((r) => (
                  <div key={r._id} className="rounded-2xl border border-gray-100 overflow-hidden bg-white hover:shadow-md transition-all">
                    <div className="aspect-video bg-gray-100">
                      {r.thumbnailUrl && <img src={r.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-3">
                      <div className="text-sm font-semibold text-[#0A2C22] line-clamp-2">{r.title}</div>
                      <a href={r.videoUrl} target="_blank" rel="noreferrer" onClick={() => studentIC.viewReplay(r._id).catch(() => {})} className="text-xs text-[#D4AF37] font-semibold hover:underline inline-flex items-center gap-1 mt-2">
                        <Video className="w-3 h-3" /> Watch replay
                      </a>
                    </div>
                  </div>
                ))}
                {past.map((e) => (
                  <div key={e._id} className="rounded-2xl border border-gray-100 p-4 bg-white text-sm text-gray-600">
                    <div className="text-[11px] uppercase font-mono text-gray-400 mb-1">Past event</div>
                    <div className="font-semibold text-[#0A2C22]">{e.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(e.startAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, accent, children }) {
  return (
    <div className="rounded-2xl bg-[#FAF8F3] border border-gray-100 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4" style={{ color: accent }} />
        <h3 className="text-sm font-bold text-[#0A2C22] uppercase tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function EventRow({ event }) {
  return (
    <Link href={`/student/innovation-club/live/${event._id}`} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:shadow-sm">
      <div className="w-14 text-center flex-shrink-0">
        <div className="text-[10px] font-mono uppercase text-gray-500">{new Date(event.startAt).toLocaleDateString([], { weekday: 'short' })}</div>
        <div className="text-sm font-bold text-[#0A2C22]">{new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-[#0A2C22]">{event.title}</div>
        <div className="text-xs text-gray-500 truncate">{event.format} · {event.guest || 'Guest TBA'}</div>
      </div>
    </Link>
  );
}

function MissionRow({ mission }) {
  return (
    <Link href={`/student/innovation-club/missions/${mission._id}`} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 hover:shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-[#0A2C22]">{mission.title}</div>
        <div className="text-xs text-gray-500 line-clamp-1">{mission.description}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-bold text-[#D4AF37]">+{mission.xpAward}</div>
        <div className="text-[10px] uppercase text-gray-400">XP</div>
      </div>
    </Link>
  );
}

function Empty({ text }) {
  return <div className="text-sm text-gray-400 py-6 text-center">{text}</div>;
}
