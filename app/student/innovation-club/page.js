'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Radio, Users, ArrowRight, Target, Calendar as CalendarIcon,
  Trophy, Flame, Sparkles, Lock, Crown, Compass, Play,
} from 'lucide-react';
import { studentIC, payment } from '@/lib/api';
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

const fmtTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const fmtDate = (d) =>
  new Date(d).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

const minutesUntil = (d) => Math.max(0, Math.round((new Date(d) - new Date()) / 60000));

export default function InnovationClubCommandCenter() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push('/login'); return; }
    setUser(u);
    (async () => {
      try {
        const paymentRes = await payment.getPaymentStatus().catch(() => ({ isPaid: false }));
        const paid = u.isPaid || paymentRes?.isPaid || false;
        setIsPaid(paid);
        if (!paid) { setLoading(false); return; }
        const dash = await studentIC.getDashboard();
        setData(dash);
      } catch (e) {
        setError('Failed to load your command center.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  if (loading) return <LoadingSpinner message="Loading Innovation Club..." />;

  if (!isPaid) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-[#FAF8F3] px-4">
        <div className="bg-white rounded-3xl border border-gray-100 p-10 max-w-lg text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A2C22] mb-3">Unlock Innovation Club</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            The Innovation Club is available to paid members only. Upgrade to join rooms, RSVP to live sessions, take on missions and grow your journey.
          </p>
          <Link href="/student/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-[#0A2C22] text-white rounded-full font-semibold text-sm hover:bg-[#0C3B2E]">
            <Crown className="w-4 h-4 text-[#D4AF37]" /> Upgrade to Access
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  const { heroEvent, upcomingEvents = [], myRooms = [], weekEvents = [], openMissions = [], recommendedRooms = [], journey = {} } = data || {};
  const firstName = (user?.name || user?.firstName || 'there').split(' ')[0];
  const level = journey?.level || 'Explorer';
  const xp = journey?.xp || 0;
  const nextTh = journey?.nextThreshold;
  const prevTh = journey?.prevThreshold || 0;
  const progress = nextTh ? Math.min(100, Math.round(((xp - prevTh) / (nextTh - prevTh)) * 100)) : 100;

  const heroIsLive = heroEvent?.status === 'live';

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF8F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold tracking-[0.2em] text-[#0A2C22]/60 uppercase">
              Innovation Club · Command Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A2C22] mt-2" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName}
            </h1>
          </div>
          <div className="flex gap-2">
            <NavPill href="/student/innovation-club/rooms" icon={Compass} label="Rooms" />
            <NavPill href="/student/innovation-club/live" icon={Radio} label="Live" />
            <NavPill href="/student/innovation-club/missions" icon={Target} label="Missions" />
            <NavPill href="/student/innovation-club/calendar" icon={CalendarIcon} label="Calendar" />
            <NavPill href="/student/innovation-club/journey" icon={Trophy} label="Journey" />
          </div>
        </div>

        {/* Hero: Live / Starting Soon */}
        {heroEvent ? (
          <Link
            href={`/student/innovation-club/live/${heroEvent._id}`}
            className="relative block rounded-3xl overflow-hidden bg-[#0A2C22] border border-[#0C3B2E] shadow-xl group"
            style={{ minHeight: 260 }}
          >
            {heroEvent.thumbnailUrl && (
              <img src={heroEvent.thumbnailUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2C22] via-[#0A2C22]/85 to-[#0A2C22]/40" />
            <div className="relative p-8 md:p-12 flex flex-col md:flex-row md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  {heroIsLive ? (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D23A2A] text-white text-xs font-bold uppercase tracking-wide">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Live now
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A55C]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wide">
                      Live in {minutesUntil(heroEvent.startAt)} min
                    </span>
                  )}
                  <span className="text-xs text-white/60 font-mono uppercase">{heroEvent.roomId?.name} · {heroEvent.format}</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {heroEvent.title}
                </h2>
                {heroEvent.guest && (
                  <p className="text-white/70 text-sm">With {heroEvent.guest}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0A2C22] rounded-full font-bold text-sm shadow-lg group-hover:translate-y-[-2px] transition-transform">
                  {heroIsLive ? <Play className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  {heroIsLive ? 'Enter Live' : 'Save my seat'}
                </span>
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-3xl bg-white border border-gray-100 p-8 text-center text-gray-500">
            Nothing live right now. Check <Link href="/student/innovation-club/live" className="text-[#0A2C22] font-semibold underline">upcoming sessions</Link>.
          </div>
        )}

        {/* Row: My Rooms + Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>My Rooms</h3>
              <Link href="/student/innovation-club/rooms" className="text-xs text-[#0A2C22] font-semibold hover:underline flex items-center gap-1">
                Explore rooms <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {myRooms.length === 0 ? (
              <div className="text-sm text-gray-500 py-8 text-center">
                You haven&apos;t joined a room yet. <Link href="/student/innovation-club/rooms" className="text-[#0A2C22] underline">Pick your first room →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {myRooms.map((r) => (
                  <Link
                    key={r._id}
                    href={`/student/innovation-club/rooms/${r.slug}`}
                    className="group relative rounded-2xl border border-gray-100 hover:border-[#0A2C22]/30 hover:shadow-md transition-all overflow-hidden bg-[#FAF8F3] p-4"
                    style={{ borderLeft: `4px solid ${UNIVERSE_COLORS[r.universe] || '#0A2C22'}` }}
                  >
                    <div className="text-lg mb-2">{r.iconEmoji || '•'}</div>
                    <div className="font-semibold text-sm text-[#0A2C22] group-hover:text-[#0C3B2E]">{r.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono uppercase mt-1">{r.universe}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-[#0A2C22] rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Your Journey</h3>
                <Link href="/student/innovation-club/journey" className="text-xs text-[#D4AF37] font-semibold hover:underline flex items-center gap-1">
                  Timeline <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="text-4xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{xp}</div>
              <div className="text-white/60 text-xs uppercase tracking-wide font-semibold">XP · {level}</div>
              <div className="mt-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4AF37]" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-[11px] text-white/50 mt-1">
                {nextTh ? `${nextTh - xp} XP to next level` : 'Max level reached'}
              </div>
              <div className="grid grid-cols-3 gap-2 mt-5">
                <StatMini label="Streak" value={`${journey?.weeklyStreak || 0}w`} icon={Flame} />
                <StatMini label="Badges" value={journey?.badges?.length || 0} icon={Trophy} />
                <StatMini label="Attend" value={journey?.counters?.sessionsAttended || 0} icon={Users} />
              </div>
            </div>
          </div>
        </div>

        {/* This Week */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>This Week</h3>
            <Link href="/student/innovation-club/calendar" className="text-xs text-[#0A2C22] font-semibold hover:underline flex items-center gap-1">
              Open calendar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {weekEvents.length === 0 ? (
            <div className="text-sm text-gray-500 py-8 text-center">No sessions scheduled this week yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {weekEvents.map((ev) => (
                <Link key={ev._id} href={`/student/innovation-club/live/${ev._id}`} className="flex items-center gap-4 py-3 hover:bg-gray-50 -mx-3 px-3 rounded-lg">
                  <div className="w-14 text-center flex-shrink-0">
                    <div className="text-[10px] font-mono uppercase text-gray-500">{fmtDate(ev.startAt).split(',')[0]}</div>
                    <div className="text-sm font-bold text-[#0A2C22]">{fmtTime(ev.startAt)}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#0A2C22] truncate">{ev.title}</div>
                    <div className="text-xs text-gray-500 truncate">{ev.roomId?.name} · {ev.format}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Missions + Recommended */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Open Missions</h3>
              <Link href="/student/innovation-club/missions" className="text-xs text-[#0A2C22] font-semibold hover:underline flex items-center gap-1">
                All missions <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {openMissions.length === 0 ? (
              <div className="text-sm text-gray-500 py-8 text-center">No open missions yet.</div>
            ) : (
              <div className="space-y-3">
                {openMissions.slice(0, 4).map((m) => (
                  <Link key={m._id} href={`/student/innovation-club/missions/${m._id}`} className="block rounded-2xl border border-gray-100 hover:border-[#D4AF37]/50 hover:shadow-md p-4 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-mono uppercase text-gray-500 mb-1">{m.roomId?.name}</div>
                        <div className="font-semibold text-sm text-[#0A2C22]">{m.title}</div>
                        {m.mySubmission && (
                          <div className="text-[11px] text-green-600 font-semibold mt-1">✓ Submitted</div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold text-[#D4AF37]">+{m.xpAward}</div>
                        <div className="text-[10px] text-gray-500 uppercase">XP</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Recommended Rooms</h3>
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            </div>
            {recommendedRooms.length === 0 ? (
              <div className="text-sm text-gray-500 py-8 text-center">You&apos;ve joined every room. Impressive.</div>
            ) : (
              <div className="space-y-3">
                {recommendedRooms.map((r) => (
                  <Link
                    key={r._id}
                    href={`/student/innovation-club/rooms/${r.slug}`}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 hover:border-[#0A2C22]/30 p-3 transition-all"
                    style={{ borderLeft: `4px solid ${UNIVERSE_COLORS[r.universe] || '#0A2C22'}` }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg">{r.iconEmoji || '•'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-[#0A2C22] truncate">{r.name}</div>
                      <div className="text-[11px] text-gray-500 truncate">{r.promise || r.universe}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NavPill({ href, icon: Icon, label }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 hover:border-[#0A2C22]/30 text-sm text-[#0A2C22] font-medium hover:shadow-sm transition-all">
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
}

function StatMini({ label, value, icon: Icon }) {
  return (
    <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
      <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase tracking-wide font-semibold">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="text-white font-bold text-lg mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    </div>
  );
}
