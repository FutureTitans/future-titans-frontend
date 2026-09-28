'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Radio, Video, ArrowRight } from 'lucide-react';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const fmt = (d) => new Date(d).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export default function LiveHubPage() {
  const router = useRouter();
  const [tab, setTab] = useState('upcoming');
  const [events, setEvents] = useState([]);
  const [replays, setReplays] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadList = async (scope) => {
    setLoading(true);
    try {
      if (scope === 'replays') {
        const rp = await studentIC.listReplays();
        setReplays(rp);
      } else {
        const ev = await studentIC.listEvents({ scope });
        setEvents(ev);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    loadList(tab);
  }, [tab, router]);

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF8F3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/student/innovation-club" className="inline-flex items-center gap-2 text-sm text-[#0A2C22] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Command Center
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Live sessions
        </h1>
        <p className="text-gray-600 text-sm mt-2 max-w-2xl">
          AMAs, build-alongs, VS. debates and confession booths. Save your seat before it starts.
        </p>

        <div className="flex gap-1 border-b border-gray-200 mt-8">
          {[
            { key: 'upcoming', label: 'Upcoming' },
            { key: 'live', label: 'Live now' },
            { key: 'ended', label: 'Ended' },
            { key: 'replays', label: 'Replays' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-sm font-semibold px-4 py-3 border-b-2 transition-all ${tab === t.key ? 'border-[#0A2C22] text-[#0A2C22]' : 'border-transparent text-gray-500 hover:text-[#0A2C22]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="text-sm text-gray-400 py-10 text-center">Loading…</div>
          ) : tab === 'replays' ? (
            replays.length === 0 ? <Empty text="No replays yet." /> :
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {replays.map((r) => (
                  <div key={r._id} className="rounded-2xl border border-gray-100 overflow-hidden bg-white hover:shadow-md transition-all">
                    <div className="aspect-video bg-gray-100">
                      {r.thumbnailUrl && <img src={r.thumbnailUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] font-mono uppercase text-gray-400">{r.roomId?.name}</div>
                      <div className="text-sm font-semibold text-[#0A2C22] line-clamp-2 mt-1">{r.title}</div>
                      <a href={r.videoUrl} target="_blank" rel="noreferrer" onClick={() => studentIC.viewReplay(r._id).catch(() => {})} className="text-xs text-[#D4AF37] font-semibold hover:underline inline-flex items-center gap-1 mt-3">
                        <Video className="w-3 h-3" /> Watch replay
                      </a>
                    </div>
                  </div>
                ))}
              </div>
          ) : events.length === 0 ? <Empty text="Nothing here yet." /> :
            <div className="space-y-3">
              {events.map((e) => (
                <Link
                  key={e._id}
                  href={`/student/innovation-club/live/${e._id}`}
                  className="flex items-center gap-4 rounded-2xl bg-white border border-gray-100 hover:shadow-md p-4 transition-all"
                >
                  {e.thumbnailUrl ? (
                    <img src={e.thumbnailUrl} alt="" className="w-28 h-16 object-cover rounded-xl flex-shrink-0" />
                  ) : (
                    <div className="w-28 h-16 rounded-xl bg-[#0A2C22]/10 flex items-center justify-center flex-shrink-0">
                      <Radio className="w-6 h-6 text-[#0A2C22]/40" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-[11px] font-mono uppercase text-gray-500">
                      <span>{e.roomId?.name}</span> · <span>{e.format}</span>
                      {e.status === 'live' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#D23A2A] text-white ml-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> live
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-[#0A2C22] mt-1">{e.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {fmt(e.startAt)} · {e.durationMinutes} min · {e.guest || 'Guest TBA'}
                      {e.myRegistration && <span className="ml-2 text-green-600 font-semibold">· ✓ RSVPed</span>}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

function Empty({ text }) {
  return <div className="text-sm text-gray-400 py-12 text-center bg-white rounded-2xl border border-gray-100">{text}</div>;
}
