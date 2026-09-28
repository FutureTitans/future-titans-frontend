'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trophy, Flame, Award, Target, Users, MessageCircle, Sparkles } from 'lucide-react';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const iconFor = (kind) => {
  if (kind.startsWith('event')) return Users;
  if (kind.startsWith('mission')) return Target;
  if (kind.startsWith('room')) return Sparkles;
  if (kind === 'question') return MessageCircle;
  return Award;
};

export default function JourneyPage() {
  const router = useRouter();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    (async () => {
      try {
        const j = await studentIC.getJourney();
        setJourney(j);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [router]);

  if (loading) return <LoadingSpinner message="Loading your journey..." />;

  const xp = journey?.xp || 0;
  const level = journey?.level || 'Explorer';
  const nextTh = journey?.nextThreshold;
  const prevTh = journey?.prevThreshold || 0;
  const progress = nextTh ? Math.min(100, Math.round(((xp - prevTh) / (nextTh - prevTh)) * 100)) : 100;
  const timeline = journey?.timeline || [];
  const badges = journey?.badges || [];
  const counters = journey?.counters || {};
  const rooms = journey?.joinedRooms || [];

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF8F3]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/student/innovation-club" className="inline-flex items-center gap-2 text-sm text-[#0A2C22] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Command Center
        </Link>

        <div className="rounded-3xl bg-[#0A2C22] p-8 md:p-10 text-white relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#D4AF37]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="text-[11px] font-mono uppercase tracking-wide text-white/60">Your Journey</div>
              <div className="flex items-baseline gap-3 mt-2">
                <h1 className="text-5xl font-bold text-[#D4AF37]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{xp}</h1>
                <span className="text-sm text-white/70">XP</span>
                <span className="text-xs uppercase tracking-wide text-white/50 ml-2">{level}</span>
              </div>
              <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden max-w-md">
                <div className="h-full bg-[#D4AF37]" style={{ width: `${progress}%` }} />
              </div>
              <div className="text-xs text-white/60 mt-2">
                {nextTh ? `${nextTh - xp} XP until you reach the next level` : 'You have reached the top level. Impressive.'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatBig label="Streak" value={`${journey?.weeklyStreak || 0}w`} icon={Flame} />
              <StatBig label="Badges" value={badges.length} icon={Trophy} />
              <StatBig label="Attended" value={counters.sessionsAttended || 0} icon={Users} />
              <StatBig label="Missions" value={counters.missionsCompleted || 0} icon={Target} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6">
            <h2 className="font-bold text-[#0A2C22] mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Timeline</h2>
            {timeline.length === 0 ? (
              <div className="text-sm text-gray-400 py-10 text-center">Your milestones will appear here as you engage with the club.</div>
            ) : (
              <ol className="relative border-l border-gray-100 pl-6 space-y-4">
                {timeline.map((t) => {
                  const Icon = iconFor(t.kind);
                  return (
                    <li key={t._id || `${t.at}-${t.label}`} className="relative">
                      <span className="absolute -left-[31px] top-1 w-7 h-7 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      </span>
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <div className="text-sm text-[#0A2C22] font-semibold">{t.label}</div>
                          <div className="text-[11px] text-gray-500">{new Date(t.at).toLocaleString()}</div>
                        </div>
                        {t.xp > 0 && (
                          <span className="text-xs font-bold text-[#D4AF37]">+{t.xp} XP</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#0A2C22] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Badges</h3>
              {badges.length === 0 ? (
                <div className="text-xs text-gray-400 py-4">Earn your first badge by joining a room.</div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {badges.map((b) => (
                    <div key={b.key} className="rounded-2xl border border-gray-100 p-3 text-center">
                      <Trophy className="w-6 h-6 text-[#D4AF37] mx-auto" />
                      <div className="text-xs font-bold text-[#0A2C22] mt-1">{b.name}</div>
                      <div className="text-[10px] text-gray-400">{new Date(b.awardedAt).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <h3 className="font-bold text-[#0A2C22] mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Joined rooms</h3>
              {rooms.length === 0 ? (
                <div className="text-xs text-gray-400 py-4">
                  <Link href="/student/innovation-club/rooms" className="text-[#0A2C22] underline">Join your first room →</Link>
                </div>
              ) : (
                <ul className="space-y-2">
                  {rooms.map((r) => (
                    <li key={r._id}>
                      <Link href={`/student/innovation-club/rooms/${r.slug}`} className="flex items-center gap-2 text-sm text-[#0A2C22] hover:underline">
                        <span className="text-base">{r.iconEmoji || '•'}</span>
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBig({ label, value, icon: Icon }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 min-w-[110px]">
      <div className="flex items-center gap-1.5 text-white/60 text-[10px] uppercase font-semibold tracking-wide">
        <Icon className="w-3 h-3" /> {label}
      </div>
      <div className="text-white text-2xl font-bold mt-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    </div>
  );
}
