'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';

const UNI_ACCENT = { BUILD: '#C2410C', FUTURE: '#2D5BFF', CREATE: '#7449F5', THINK: '#0E7C78', LIFE: '#D23A2A', EXPLORE: '#8A4DDB' };

const startOfWeek = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export default function CalendarPage() {
  const router = useRouter();
  const [view, setView] = useState('week');
  const [anchor, setAnchor] = useState(() => new Date());
  const [mine, setMine] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const range = useMemo(() => {
    if (view === 'today') { const s = new Date(anchor); s.setHours(0, 0, 0, 0); const e = new Date(s); e.setDate(e.getDate() + 1); return { from: s, to: e }; }
    if (view === 'week') { const s = startOfWeek(anchor); const e = addDays(s, 7); return { from: s, to: e }; }
    const s = new Date(anchor.getFullYear(), anchor.getMonth(), 1); const e = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1); return { from: s, to: e };
  }, [view, anchor]);

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    (async () => {
      setLoading(true);
      try { setEvents(await studentIC.getCalendar({ from: range.from.toISOString(), to: range.to.toISOString(), mine: mine ? 'true' : 'false' })); }
      catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [router, range.from.getTime(), range.to.getTime(), mine]);

  const move = (delta) => {
    const x = new Date(anchor);
    if (view === 'today') x.setDate(x.getDate() + delta);
    else if (view === 'week') x.setDate(x.getDate() + delta * 7);
    else x.setMonth(x.getMonth() + delta);
    setAnchor(x);
  };

  const byDay = useMemo(() => {
    const m = new Map();
    for (const e of events) {
      const d = new Date(e.startAt); d.setHours(0, 0, 0, 0);
      const k = d.getTime();
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(e);
    }
    return m;
  }, [events]);

  const label = view === 'today'
    ? anchor.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : view === 'week'
      ? `${range.from.toLocaleDateString([], { month: 'short', day: 'numeric' })} — ${addDays(range.to, -1).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
      : anchor.toLocaleDateString([], { month: 'long', year: 'numeric' });

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', marginBottom: 24 }}>
        <div>
          <div style={{ font: "600 14px/1 'Instrument Sans', sans-serif", color: '#8A6414', marginBottom: 12 }}>Calendar</div>
          <h1 style={{ font: "700 clamp(32px,4vw,46px)/1.02 'Space Grotesk', sans-serif", letterSpacing: '-.04em', margin: 0, color: '#0C1512' }}>{label}</h1>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 4, border: '1px solid #E7EAE8', background: '#fff', borderRadius: 14, padding: 4 }}>
            {['today', 'week', 'month'].map((v) => (
              <button key={v} onClick={() => setView(v)} style={{
                border: 'none', borderRadius: 10, padding: '10px 16px',
                font: "600 14px/1 'Instrument Sans', sans-serif", cursor: 'pointer',
                background: view === v ? '#0C3B2E' : 'transparent',
                color: view === v ? '#fff' : '#26322C',
              }}>{v[0].toUpperCase() + v.slice(1)}</button>
            ))}
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: "600 13px/1 'Instrument Sans', sans-serif", color: '#0C1512', background: '#fff', border: '1px solid #E7EAE8', borderRadius: 999, padding: '10px 14px', cursor: 'pointer' }}>
            <input type="checkbox" checked={mine} onChange={(e) => setMine(e.target.checked)} style={{ accentColor: '#0C3B2E' }} />
            My rooms only
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        <button onClick={() => move(-1)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #E7EAE8', background: '#fff', cursor: 'pointer' }}>←</button>
        <button onClick={() => setAnchor(new Date())} style={{ height: 40, borderRadius: 12, border: '1px solid #E7EAE8', background: '#fff', padding: '0 14px', font: "600 13px 'Instrument Sans', sans-serif", cursor: 'pointer' }}>Today</button>
        <button onClick={() => move(1)} style={{ width: 40, height: 40, borderRadius: 12, border: '1px solid #E7EAE8', background: '#fff', cursor: 'pointer' }}>→</button>
      </div>

      {loading ? <div style={{ padding: 60, textAlign: 'center', color: '#56635C' }}>Loading…</div> :
        view === 'today' ? <DayView events={events} /> :
        view === 'week' ? <WeekView from={range.from} byDay={byDay} /> :
        <MonthView anchor={anchor} byDay={byDay} />}
    </>
  );
}

function DayView({ events }) {
  return events.length === 0 ? (
    <Empty text="No sessions today." icon="🗓️" />
  ) : (
    <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, overflow: 'hidden' }}>
      {events.map((e) => <EventLine key={e._id} event={e} />)}
    </div>
  );
}

function WeekView({ from, byDay }) {
  const days = Array.from({ length: 7 }).map((_, i) => addDays(from, i));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,150px),1fr))', gap: 10 }}>
      {days.map((d) => {
        const key = new Date(d); key.setHours(0, 0, 0, 0);
        const list = byDay.get(key.getTime()) || [];
        const isToday = sameDay(d, new Date());
        return (
          <div key={d.toISOString()} style={{
            borderRadius: 18, padding: 12, minHeight: 200,
            background: isToday ? '#0C3B2E' : '#fff',
            border: isToday ? '1px solid #0C3B2E' : '1px solid #E7EAE8',
            color: isToday ? '#fff' : '#0C1512',
          }}>
            <div style={{ font: "500 12px/1 'JetBrains Mono', monospace", opacity: 0.7, textTransform: 'uppercase' }}>{d.toLocaleDateString([], { weekday: 'short' })}</div>
            <div style={{ font: "700 26px/1 'Space Grotesk', sans-serif", marginTop: 4, letterSpacing: '-.02em' }}>{d.getDate()}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {list.length === 0 ? <div style={{ font: "500 12px/1.4 'Instrument Sans', sans-serif", opacity: 0.55 }}>—</div> :
                list.map((e) => (
                  <Link key={e._id} href={`/student/innovation-club/live/${e._id}`} style={{
                    display: 'block', font: "500 12px/1.35 'Instrument Sans', sans-serif",
                    borderRadius: 8, padding: '6px 8px',
                    background: isToday ? 'rgba(255,255,255,.1)' : '#FAF8F3',
                    color: isToday ? '#fff' : '#0C1512', textDecoration: 'none',
                  }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
                    <div style={{ opacity: 0.7, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{new Date(e.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
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

function MonthView({ anchor, byDay }) {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = startOfWeek(first);
  const cells = Array.from({ length: 42 }).map((_, i) => addDays(gridStart, i));
  return (
    <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', background: '#FAF8F3', borderBottom: '1px solid #EDF0EE' }}>
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => (
          <div key={d} style={{ padding: '10px 8px', textAlign: 'center', font: "500 11px/1 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
        {cells.map((d) => {
          const key = new Date(d); key.setHours(0, 0, 0, 0);
          const list = byDay.get(key.getTime()) || [];
          const inMonth = d.getMonth() === anchor.getMonth();
          const isToday = sameDay(d, new Date());
          return (
            <div key={d.toISOString()} style={{
              minHeight: 100, padding: 8, borderBottom: '1px solid #F0F2F0', borderRight: '1px solid #F0F2F0',
              background: inMonth ? '#fff' : '#FAFBFA',
            }}>
              <div style={{ font: "700 13px 'Space Grotesk', sans-serif", color: isToday ? '#C9A55C' : inMonth ? '#0C1512' : '#C9CFCA' }}>{d.getDate()}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginTop: 5 }}>
                {list.slice(0, 2).map((e) => (
                  <Link key={e._id} href={`/student/innovation-club/live/${e._id}`} style={{
                    display: 'block', font: "500 11.5px/1.3 'Instrument Sans', sans-serif",
                    color: '#0C3B2E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    textDecoration: 'none',
                  }}>· {e.title}</Link>
                ))}
                {list.length > 2 && <div style={{ font: "500 11px 'JetBrains Mono', monospace", color: '#56635C' }}>+{list.length - 2} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EventLine({ event }) {
  const accent = UNI_ACCENT[event.roomId?.universe] || '#0C3B2E';
  return (
    <Link href={`/student/innovation-club/live/${event._id}`} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      borderBottom: '1px solid #F0F2F0', textDecoration: 'none',
    }}>
      <span style={{ width: 4, height: 40, borderRadius: 4, flex: 'none', background: accent }} />
      <div style={{ width: 72, flex: 'none' }}>
        <div style={{ font: "500 11px 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase' }}>{new Date(event.startAt).toLocaleDateString([], { weekday: 'short' })}</div>
        <div style={{ font: "700 15px 'Space Grotesk', sans-serif", color: '#0C1512', marginTop: 4 }}>{new Date(event.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: "600 15px 'Space Grotesk', sans-serif", color: '#0C1512' }}>{event.title}</div>
        <div style={{ font: "500 12.5px 'Instrument Sans', sans-serif", color: '#3E4C45', marginTop: 3 }}>{event.roomId?.name} · {event.format} · {event.durationMinutes} min</div>
      </div>
      {event.myRegistration && <span style={{ font: "600 12px 'Instrument Sans', sans-serif", color: '#6E5416', background: '#FCF8EF', border: '1px solid #EDE3CC', borderRadius: 7, padding: '5px 8px' }}>Going</span>}
    </Link>
  );
}

function Empty({ text, icon }) {
  return (
    <div style={{ border: '1.5px dashed #DCD3C0', borderRadius: 20, padding: 32, background: '#FDFBF6', display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: 28 }}>{icon}</span>
      <span style={{ font: "400 15px 'Instrument Sans', sans-serif", color: '#3E4C45' }}>{text}</span>
    </div>
  );
}
