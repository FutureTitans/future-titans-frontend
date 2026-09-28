'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Radio } from 'lucide-react';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const startOfWeek = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = (day + 6) % 7;
  x.setDate(x.getDate() - diff);
  return x;
};

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function CalendarPage() {
  const router = useRouter();
  const [view, setView] = useState('week');
  const [anchor, setAnchor] = useState(() => new Date());
  const [mine, setMine] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const range = useMemo(() => {
    if (view === 'today') {
      const s = new Date(anchor); s.setHours(0, 0, 0, 0);
      const e = new Date(s); e.setDate(e.getDate() + 1);
      return { from: s, to: e };
    }
    if (view === 'week') {
      const s = startOfWeek(anchor);
      const e = addDays(s, 7);
      return { from: s, to: e };
    }
    const s = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    const e = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
    return { from: s, to: e };
  }, [view, anchor]);

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    (async () => {
      setLoading(true);
      try {
        const res = await studentIC.getCalendar({
          from: range.from.toISOString(),
          to: range.to.toISOString(),
          mine: mine ? 'true' : 'false',
        });
        setEvents(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router, range.from.getTime(), range.to.getTime(), mine]);

  const move = (delta) => {
    const x = new Date(anchor);
    if (view === 'today') x.setDate(x.getDate() + delta);
    else if (view === 'week') x.setDate(x.getDate() + delta * 7);
    else x.setMonth(x.getMonth() + delta);
    setAnchor(x);
  };

  const eventsByDay = useMemo(() => {
    const map = new Map();
    for (const e of events) {
      const d = new Date(e.startAt);
      d.setHours(0, 0, 0, 0);
      const k = d.getTime();
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(e);
    }
    return map;
  }, [events]);

  const label = view === 'today'
    ? anchor.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : view === 'week'
      ? `${range.from.toLocaleDateString([], { month: 'short', day: 'numeric' })} — ${addDays(range.to, -1).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
      : anchor.toLocaleDateString([], { month: 'long', year: 'numeric' });

  if (loading && events.length === 0) return <LoadingSpinner message="Loading calendar..." />;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF8F3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/student/innovation-club" className="inline-flex items-center gap-2 text-sm text-[#0A2C22] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Command Center
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Calendar</h1>
            <p className="text-gray-600 text-sm mt-1">{label}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-full border border-gray-200 overflow-hidden">
              {['today', 'week', 'month'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`text-xs font-semibold px-3 py-2 ${view === v ? 'bg-[#0A2C22] text-white' : 'bg-white text-[#0A2C22]'}`}
                >
                  {v[0].toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <label className="inline-flex items-center gap-2 text-xs text-[#0A2C22] font-semibold bg-white border border-gray-200 rounded-full px-3 py-2 cursor-pointer">
              <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} className="accent-[#0A2C22]" />
              My rooms only
            </label>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <button onClick={() => move(-1)} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setAnchor(new Date())} className="text-xs font-semibold px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50">Today</button>
          <button onClick={() => move(1)} className="p-2 rounded-full border border-gray-200 hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-6">
          {view === 'today' && <DayView events={events} />}
          {view === 'week' && <WeekView from={range.from} eventsByDay={eventsByDay} />}
          {view === 'month' && <MonthView anchor={anchor} eventsByDay={eventsByDay} />}
        </div>
      </div>
    </div>
  );
}

function DayView({ events }) {
  return events.length === 0 ? (
    <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center text-gray-400">No sessions today.</div>
  ) : (
    <div className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-100">
      {events.map((e) => <EventLine key={e._id} event={e} />)}
    </div>
  );
}

function WeekView({ from, eventsByDay }) {
  const days = Array.from({ length: 7 }).map((_, i) => addDays(from, i));
  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
      {days.map((d) => {
        const key = new Date(d); key.setHours(0, 0, 0, 0);
        const list = eventsByDay.get(key.getTime()) || [];
        const isToday = sameDay(d, new Date());
        return (
          <div key={d.toISOString()} className={`rounded-2xl border p-3 min-h-[160px] ${isToday ? 'bg-[#0A2C22] text-white border-[#0A2C22]' : 'bg-white border-gray-100'}`}>
            <div className="text-[10px] uppercase font-mono opacity-70">{d.toLocaleDateString([], { weekday: 'short' })}</div>
            <div className={`text-2xl font-bold ${isToday ? '' : 'text-[#0A2C22]'}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{d.getDate()}</div>
            <div className="space-y-1 mt-2">
              {list.length === 0 ? <div className={`text-[10px] ${isToday ? 'text-white/50' : 'text-gray-400'}`}>—</div> :
                list.map((e) => (
                  <Link key={e._id} href={`/student/innovation-club/live/${e._id}`} className={`block text-[11px] rounded p-1.5 ${isToday ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-[#FAF8F3] hover:bg-gray-100 text-[#0A2C22]'}`}>
                    <div className="font-semibold truncate">{e.title}</div>
                    <div className="opacity-70">{new Date(e.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </Link>
                ))
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MonthView({ anchor, eventsByDay }) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = startOfWeek(first);
  const cells = Array.from({ length: 42 }).map((_, i) => addDays(gridStart, i));
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-7 text-[10px] uppercase font-mono text-gray-500 bg-[#FAF8F3] border-b border-gray-100">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="p-2 text-center">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((d) => {
          const key = new Date(d); key.setHours(0, 0, 0, 0);
          const list = eventsByDay.get(key.getTime()) || [];
          const inMonth = d.getMonth() === anchor.getMonth();
          const isToday = sameDay(d, new Date());
          return (
            <div key={d.toISOString()} className={`min-h-[90px] p-2 border-b border-r border-gray-100 ${inMonth ? '' : 'bg-gray-50'}`}>
              <div className={`text-xs font-semibold ${isToday ? 'text-[#D4AF37]' : inMonth ? 'text-[#0A2C22]' : 'text-gray-300'}`}>{d.getDate()}</div>
              <div className="space-y-0.5 mt-1">
                {list.slice(0, 2).map((e) => (
                  <Link key={e._id} href={`/student/innovation-club/live/${e._id}`} className="block text-[10px] truncate text-[#0A2C22] hover:underline">
                    · {e.title}
                  </Link>
                ))}
                {list.length > 2 && <div className="text-[10px] text-gray-400">+{list.length - 2} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventLine({ event }) {
  return (
    <Link href={`/student/innovation-club/live/${event._id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50">
      <div className="w-16 text-center flex-shrink-0">
        <div className="text-[10px] uppercase font-mono text-gray-500">{new Date(event.startAt).toLocaleDateString([], { weekday: 'short' })}</div>
        <div className="text-sm font-bold text-[#0A2C22]">{new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-[#0A2C22]">{event.title}</div>
        <div className="text-xs text-gray-500">{event.roomId?.name} · {event.format} · {event.durationMinutes} min</div>
      </div>
      {event.status === 'live' && (
        <span className="inline-flex items-center gap-1 text-[10px] text-[#D23A2A] font-bold uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D23A2A] animate-pulse" /> Live
        </span>
      )}
    </Link>
  );
}
