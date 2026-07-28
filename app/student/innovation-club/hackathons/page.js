'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { innovationClub } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  Trophy,
  Calendar,
  Users,
  ArrowLeft,
  ArrowRight,
  Lock,
  Crown,
  FileText,
  UserPlus,
  Lightbulb,
  Presentation,
  CheckCircle2,
  IndianRupee,
  ClipboardList,
  Award,
  Landmark,
  School,
  X,
} from 'lucide-react';

const REGIONS = ['north', 'south', 'east', 'west', 'central'];

const STATUS_STYLES = {
  registration_open: 'bg-green-100 text-green-700',
  upcoming: 'bg-blue-100 text-blue-700',
  active: 'bg-[#D4AF37]/20 text-[#8A6D1B]',
  ongoing: 'bg-[#D4AF37]/20 text-[#8A6D1B]',
  judging: 'bg-amber-100 text-amber-700',
  results_out: 'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
};

function StatusChip({ status }) {
  const s = status?.toLowerCase() || '';
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize ${STATUS_STYLES[s] || 'bg-gray-100 text-gray-600'}`}>
      {s.replace(/_/g, ' ')}
    </span>
  );
}

function fmtRange(start, end) {
  if (!start) return null;
  const opts = { day: 'numeric', month: 'short' };
  const s = new Date(start).toLocaleDateString('en-IN', opts);
  if (!end) return s;
  return `${s} – ${new Date(end).toLocaleDateString('en-IN', { ...opts, year: 'numeric' })}`;
}

function fmtINR(n) {
  if (n == null) return null;
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    if (!targetDate) return;
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
        secs: Math.floor((diff / 1000) % 60),
      });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hrs', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.mins },
    { label: 'Secs', value: timeLeft.secs },
  ];

  return (
    <div className="flex gap-2.5">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div className="w-12 h-12 bg-white/10 border border-white/15 text-white rounded-xl flex items-center justify-center text-lg font-bold">
            {String(u.value).padStart(2, '0')}
          </div>
          <p className="text-[9px] uppercase tracking-wider text-white/50 font-semibold mt-1">{u.label}</p>
        </div>
      ))}
    </div>
  );
}

function SlotsDonut({ percent }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const filled = Math.min(Math.max(percent, 0), 100);
  return (
    <div className="relative w-28 h-28">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke="#D4AF37" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${(filled / 100) * c} ${c}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-white text-xl font-bold">{filled}%</span>
        <span className="text-white/50 text-[9px] uppercase tracking-wider">Slots Filled</span>
      </div>
    </div>
  );
}

const journeySteps = [
  { icon: ClipboardList, title: 'Register', description: 'Form your team and sign up' },
  { icon: Lightbulb, title: 'Build', description: 'Create your solution and prototype' },
  { icon: Presentation, title: 'Pitch', description: 'Present to judges and get scored' },
  { icon: Trophy, title: 'Win', description: 'Earn recognition and rewards' },
];

const BADGE_STYLES = {
  winner: { chip: 'bg-[#D4AF37] text-[#123524]', label: 'Winner' },
  finalist: { chip: 'bg-gray-200 text-gray-700', label: 'Finalist' },
  spotlight: { chip: 'bg-blue-100 text-blue-700', label: 'Spotlight' },
};

export default function HackathonsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hackathons, setHackathons] = useState([]);
  const [stats, setStats] = useState(null);
  const [topScores, setTopScores] = useState(null);
  const [registerModal, setRegisterModal] = useState(null);
  const [registerForm, setRegisterForm] = useState({ teamName: '', school: '', region: '', members: '' });
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [leaderboardModal, setLeaderboardModal] = useState(null); // { title, teams, loading }

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchAll();
  }, [router]);

  const fetchAll = async () => {
    try {
      const [hackRes, statsRes] = await Promise.all([
        innovationClub.getHackathons(),
        innovationClub.getHackathonStats().catch(() => null),
      ]);
      const list = Array.isArray(hackRes) ? hackRes : hackRes?.hackathons || [];
      setHackathons(list);
      setStats(statsRes);

      // Live judges score for the hero: top scored team of the featured event
      if (list[0]) {
        innovationClub
          .getLeaderboard(list[0]._id)
          .then((teams) => {
            const top = (Array.isArray(teams) ? teams : []).find((t) => t.scores?.total > 0);
            if (top) setTopScores(top.scores);
          })
          .catch(() => {});
      }
    } catch (error) {
      console.error('Failed to fetch hackathons:', error);
      setHackathons([]);
    } finally {
      setLoading(false);
    }
  };

  const openLeaderboard = async (hackathon) => {
    setLeaderboardModal({ title: hackathon.title, teams: [], loading: true });
    try {
      const teams = await innovationClub.getLeaderboard(hackathon._id || hackathon.id);
      setLeaderboardModal({ title: hackathon.title, teams: Array.isArray(teams) ? teams : [], loading: false });
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLeaderboardModal({ title: hackathon.title, teams: [], loading: false });
    }
  };

  const handleRegisterTeam = async (hackathonId) => {
    if (!registerForm.teamName.trim()) return;
    setRegistering(true);
    setRegisterError(null);
    try {
      const membersArray = registerForm.members
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
      await innovationClub.registerTeam(hackathonId, {
        teamName: registerForm.teamName.trim(),
        school: registerForm.school.trim() || user?.school || undefined,
        region: registerForm.region || undefined,
        members: membersArray,
      });
      setRegisterSuccess(true);
      setRegisterForm({ teamName: '', school: '', region: '', members: '' });
      fetchAll();
    } catch (error) {
      console.error('Failed to register team:', error);
      setRegisterError(error?.error || error?.message || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const closeRegisterModal = () => {
    setRegisterModal(null);
    setRegisterForm({ teamName: '', school: '', region: '', members: '' });
    setRegisterSuccess(false);
    setRegisterError(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading Hackathons..." />;
  }

  if (!user?.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDD6] px-4">
        <div className="glass-panel p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unlock Hackathons</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Compete in innovation hackathons, build real solutions, and win prizes. Upgrade your account to register your team and start building.
          </p>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Access
          </Link>
        </div>
      </div>
    );
  }

  const featured = hackathons[0];
  const otherHackathons = hackathons.slice(1);
  const slotsPercent = featured?.maxTeams
    ? Math.round(((featured.teamCount || 0) / featured.maxTeams) * 100)
    : 0;

  const scoreRows = topScores
    ? [
        { label: 'Problem Solving', value: topScores.problemSolving },
        { label: 'Innovation', value: topScores.innovation },
        { label: 'Impact', value: topScores.impact },
        { label: 'Presentation', value: topScores.presentation },
      ]
    : [
        { label: 'Problem Solving', value: 9.2 },
        { label: 'Innovation', value: 9.0 },
        { label: 'Impact', value: 8.8 },
        { label: 'Presentation', value: 8.7 },
      ];
  const scoreTotal = topScores ? topScores.total : 8.93;

  const winners = hackathons
    .flatMap((h) => (h.winners || []).map((w) => ({ ...w, hackathonTitle: h.title, coverImage: h.coverImage })))
    .sort((a, b) => {
      const order = { winner: 0, finalist: 1, spotlight: 2 };
      return (order[a.badge] ?? 3) - (order[b.badge] ?? 3);
    })
    .slice(0, 3);

  const regionData = stats?.byRegion || { north: 0, south: 0, east: 0, west: 0, central: 0 };
  const maxRegion = Math.max(...Object.values(regionData), 1);

  const ctaFor = (h) => {
    const s = h.status?.toLowerCase();
    if (s === 'registration_open' || s === 'upcoming') {
      return (
        <button
          onClick={() => setRegisterModal(h._id || h.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#123524] text-white rounded-xl text-sm font-semibold hover:bg-[#1B4A32] transition-all"
        >
          Register Team
          <ArrowRight className="w-4 h-4" />
        </button>
      );
    }
    if (s === 'results_out' || s === 'completed' || s === 'judging') {
      return (
        <button
          onClick={() => openLeaderboard(h)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#123524] text-white rounded-xl text-sm font-semibold hover:bg-[#1B4A32] transition-all"
        >
          See Results
          <ArrowRight className="w-4 h-4" />
        </button>
      );
    }
    return (
      <button
        onClick={() => openLeaderboard(h)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#123524] text-white rounded-xl text-sm font-semibold hover:bg-[#1B4A32] transition-all"
      >
        Track Event
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#F7F1E3]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto grid lg:grid-cols-2 items-center">
          <div className="px-4 sm:px-6 md:px-10 xl:px-14 py-10 sm:py-14">
            <Link
              href="/student/innovation-club"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Innovation Club
            </Link>
            <p className="text-[#123524] text-xs font-bold tracking-[0.18em] uppercase mb-4">
              02 &mdash; Inter-School Hackathons &amp; Competitions
            </p>
            <h1 className="font-roca text-4xl sm:text-5xl lg:text-6xl text-[#123524] leading-[1.1] mb-5">
              Build. Pitch.<br />Compete Nationally.
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mb-8">
              Students test ideas in real challenges, compete with schools across India, and earn recognition for what they build.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#challenges"
                className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#123524] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#E5C558] transition-colors"
              >
                Explore Challenges
              </a>
              {featured && (
                <button
                  onClick={() => setRegisterModal(featured._id || featured.id)}
                  className="inline-flex items-center gap-2 bg-transparent border border-[#123524]/30 text-[#123524] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#123524]/5 transition-colors"
                >
                  Register a Team
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="relative hidden lg:block h-[420px]">
            <div className="absolute inset-0" style={{ clipPath: 'polygon(14% 0, 100% 0, 100% 100%, 0 100%)' }}>
              <Image
                src="/images/yp/aca4.jpg"
                alt="Students competing in a hackathon"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 0vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F7F1E3]/30 to-transparent" />
            </div>
            {/* Judges score card */}
            <div className="absolute bottom-6 right-6 bg-white rounded-2xl shadow-xl p-5 w-60">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-[#123524]">Judges Score {topScores ? '(Live)' : ''}</p>
                <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-2">
                {scoreRows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{row.label}</span>
                    <span className="font-bold text-[#123524]">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs font-bold text-[#123524]">Total</span>
                <span className="text-lg font-bold text-[#B8952E]">{scoreTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 xl:px-14 pb-12">
        {/* ===== STATS STRIP ===== */}
        <div className="bg-white rounded-2xl border border-[#123524]/10 shadow-sm p-6 mb-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {[
              { icon: Trophy, value: stats?.totalHackathons ?? hackathons.length, label: 'Hackathons Hosted' },
              { icon: School, value: stats?.schoolCount ? `${stats.schoolCount}+` : '—', label: 'Schools Participating' },
              { icon: Landmark, value: 'National-Level', label: 'Challenges' },
              { icon: Award, value: 'Real', label: 'Recognition' },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-4 px-2 lg:px-6 pt-4 lg:pt-0 first:pt-0">
                <div className="w-12 h-12 rounded-xl bg-[#123524]/5 flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-6 h-6 text-[#123524]" />
                </div>
                <div>
                  <p className="font-roca text-xl text-[#123524] leading-tight">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== FEATURED EVENT ===== */}
        {featured ? (
          <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 bg-gradient-to-br from-[#123524] to-[#0B2418] mb-8">
            <div className="grid lg:grid-cols-[340px_1fr_300px]">
              {/* Cover */}
              <div className="relative h-56 lg:h-auto min-h-[220px] bg-[#0B2418]">
                {featured.coverImage ? (
                  <img src={featured.coverImage} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-[#D4AF37]/30" />
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-[#D4AF37] text-[#123524] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                  Featured Event
                </span>
              </div>

              {/* Details */}
              <div className="p-6 sm:p-8">
                <h2 className="font-roca text-2xl sm:text-3xl text-white mb-5">{featured.title}</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-2 text-white/80 text-sm">
                      <Calendar className="w-4 h-4 text-[#D4AF37]" />
                      {fmtRange(featured.startDate, featured.endDate)}
                    </span>
                    <StatusChip status={featured.status} />
                  </div>
                  {featured.classes?.length > 0 && (
                    <span className="flex items-center gap-2 text-white/80 text-sm">
                      <Users className="w-4 h-4 text-[#D4AF37]" />
                      Classes {Array.isArray(featured.classes) ? featured.classes.join(', ') : featured.classes}
                    </span>
                  )}
                  {featured.prizePool != null && (
                    <span className="flex items-center gap-2 text-white/80 text-sm">
                      <IndianRupee className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-bold text-white">{fmtINR(featured.prizePool)}</span>
                      <span className="text-white/50 text-xs">Prize Pool</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6 mb-6">
                  {featured.startDate && new Date(featured.startDate) > new Date() && (
                    <div>
                      <p className="text-[#D4AF37] text-xs font-bold mb-2">
                        Closes in {Math.max(0, Math.ceil((new Date(featured.startDate) - Date.now()) / 86400000))} Days
                      </p>
                      <CountdownTimer targetDate={featured.startDate} />
                    </div>
                  )}
                  {featured.maxTeams && <SlotsDonut percent={slotsPercent} />}
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setRegisterModal(featured._id || featured.id)}
                    className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#123524] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#E5C558] transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register Team
                  </button>
                  {featured.rulebookUrl && (
                    <a
                      href={featured.rulebookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-white/25 text-white font-bold px-6 py-3 rounded-xl text-sm hover:bg-white/10 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      View Rulebook
                    </a>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 sm:p-8 lg:border-l border-white/10">
                <h3 className="text-white font-bold text-sm mb-5">Event Timeline</h3>
                {featured.timeline?.length > 0 ? (
                  <div className="space-y-5">
                    {featured.timeline.map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          {step.completed ? (
                            <span className="w-3 h-3 rounded-full bg-[#D4AF37] flex-shrink-0 mt-1" />
                          ) : (
                            <span className="w-3 h-3 rounded-full border-2 border-white/30 flex-shrink-0 mt-1" />
                          )}
                          {i < featured.timeline.length - 1 && <span className="w-px flex-1 bg-white/15 mt-1" />}
                        </div>
                        <div className="pb-1">
                          <p className={`text-sm font-semibold ${step.completed ? 'text-white' : 'text-white/60'}`}>{step.label}</p>
                          {step.date && (
                            <p className="text-white/40 text-xs mt-0.5">
                              {new Date(step.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white/40 text-sm">Timeline will be announced soon.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#123524]/10 p-12 text-center mb-8">
            <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Hackathons Available</h3>
            <p className="text-sm text-gray-500">New hackathons are being planned. Check back soon for exciting opportunities.</p>
          </div>
        )}

        {/* ===== OTHER CHALLENGES ===== */}
        {otherHackathons.length > 0 && (
          <div id="challenges" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-8 scroll-mt-24">
            {otherHackathons.map((h) => (
              <div key={h._id || h.id} className="bg-white rounded-2xl border border-[#123524]/10 p-6 flex flex-col hover:shadow-lg hover:shadow-[#123524]/5 transition-all duration-300">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-roca text-lg text-[#123524] leading-snug">{h.title}</h3>
                  </div>
                  <StatusChip status={h.status} />
                </div>
                <div className="space-y-2.5 mb-5">
                  {h.startDate && (
                    <span className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {fmtRange(h.startDate, h.endDate)}
                    </span>
                  )}
                  {h.classes?.length > 0 && (
                    <span className="flex items-center gap-2 text-gray-600 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      Classes {Array.isArray(h.classes) ? h.classes.join(', ') : h.classes}
                    </span>
                  )}
                  {h.prizePool != null && (
                    <span className="flex items-center gap-2 text-gray-600 text-sm">
                      <IndianRupee className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-[#123524]">{fmtINR(h.prizePool)} Prize Pool</span>
                    </span>
                  )}
                </div>
                {/* Winners inline once results are out */}
                {['results_out', 'completed'].includes(h.status?.toLowerCase()) && h.winners?.length > 0 && (
                  <div className="mb-5 pt-4 border-t border-gray-100">
                    <p className="text-[10px] uppercase tracking-wider text-[#B8952E] font-bold mb-2.5">Winners</p>
                    <div className="space-y-2">
                      {h.winners.slice(0, 3).map((w, i) => {
                        const badge = BADGE_STYLES[w.badge] || BADGE_STYLES.spotlight;
                        return (
                          <div key={w._id || i} className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                              i === 0 ? 'bg-[#D4AF37] text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : 'bg-amber-700 text-white'
                            }`}>
                              {w.rank || i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-[#123524] truncate">{w.teamName}</p>
                              <p className="text-[10px] text-gray-500 truncate">{w.school}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider flex-shrink-0 ${badge.chip}`}>
                              {badge.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="mt-auto">{ctaFor(h)}</div>
              </div>
            ))}
          </div>
        )}

        {/* ===== JOURNEY + REGION STATS ===== */}
        <div className="grid lg:grid-cols-[1.3fr_1fr_auto] gap-6 mb-8">
          {/* Journey */}
          <div className="bg-white rounded-2xl border border-[#123524]/10 p-6">
            <h2 className="text-lg font-bold text-[#123524] mb-6">The Competition Journey</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {journeySteps.map((step, i) => (
                <div key={step.title} className="text-center relative">
                  <div className="relative mx-auto mb-3 w-16 h-16">
                    <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37]/40 bg-[#F7F1E3]/60 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-[#123524]" />
                    </div>
                    <span className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#123524] text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#123524] mb-1">{step.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-snug">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Region bars */}
          <div className="bg-white rounded-2xl border border-[#123524]/10 p-6">
            <h2 className="text-lg font-bold text-[#123524] mb-5">Schools Registered by Region</h2>
            <div className="space-y-3">
              {REGIONS.map((region) => {
                const value = regionData[region] || 0;
                const width = Math.max(4, Math.round((value / maxRegion) * 100));
                return (
                  <div key={region} className="flex items-center gap-3" title={`${region}: ${value} teams`}>
                    <span className="w-14 text-xs text-gray-500 capitalize flex-shrink-0">{region}</span>
                    <div className="flex-1 h-4 bg-gray-100 rounded-r-[4px] overflow-hidden">
                      <div className="h-full bg-[#123524] rounded-r-[4px] transition-all duration-500" style={{ width: `${width}%` }} />
                    </div>
                    <span className="w-8 text-xs font-bold text-[#123524] text-right flex-shrink-0">{value}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teams registered */}
          <div className="rounded-2xl bg-gradient-to-br from-[#123524] to-[#0B2418] p-6 flex flex-col justify-center items-start lg:w-56">
            <Users className="w-7 h-7 text-[#D4AF37] mb-4" />
            <p className="text-white/70 text-sm font-semibold mb-1">Teams Registered</p>
            <p className="font-roca text-5xl text-white mb-2">{stats?.totalTeams ?? 0}</p>
            <p className="text-white/50 text-xs leading-relaxed">Across schools all over India</p>
          </div>
        </div>

        {/* ===== IDEAS THAT MADE IT ===== */}
        {winners.length > 0 && (
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <Trophy className="w-5 h-5 text-[#B8952E]" />
              <h2 className="font-roca text-xl text-[#123524]">Ideas That Made It</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {winners.map((w, i) => {
                const badge = BADGE_STYLES[w.badge] || BADGE_STYLES.spotlight;
                return (
                  <div key={w._id || i} className="bg-white rounded-2xl border border-[#123524]/10 p-5 flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${i === 0 ? 'bg-[#D4AF37]' : i === 1 ? 'bg-gray-300' : 'bg-amber-700'}`}>
                        <span className="text-white font-bold">{i + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#123524] truncate">{w.teamName}</p>
                      <p className="text-xs text-gray-500 truncate">{w.school}</p>
                      <p className="text-[11px] text-gray-400 truncate">{w.hackathonTitle}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${badge.chip}`}>
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ===== REGISTRATION MODAL ===== */}
      {registerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeRegisterModal} />
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl">
            {registerSuccess ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Registered</h3>
                <p className="text-sm text-gray-600 mb-6">Your team has been successfully registered for this hackathon.</p>
                <button
                  onClick={closeRegisterModal}
                  className="px-6 py-2.5 bg-[#123524] text-white rounded-xl text-sm font-semibold hover:bg-[#1B4A32] transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Register Your Team</h3>
                <p className="text-sm text-gray-500 mb-5">Enter your team details to join this hackathon.</p>

                {registerError && (
                  <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {registerError}
                  </div>
                )}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegisterTeam(registerModal);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={registerForm.teamName}
                      onChange={(e) => setRegisterForm({ ...registerForm, teamName: e.target.value })}
                      placeholder="Enter your team name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
                        School
                      </label>
                      <input
                        type="text"
                        value={registerForm.school}
                        onChange={(e) => setRegisterForm({ ...registerForm, school: e.target.value })}
                        placeholder={user?.school || 'Your school name'}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
                        Region
                      </label>
                      <select
                        value={registerForm.region}
                        onChange={(e) => setRegisterForm({ ...registerForm, region: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                      >
                        <option value="">Select region</option>
                        {REGIONS.map((r) => (
                          <option key={r} value={r} className="capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-1.5">
                      Team Members
                    </label>
                    <input
                      type="text"
                      value={registerForm.members}
                      onChange={(e) => setRegisterForm({ ...registerForm, members: e.target.value })}
                      placeholder="Member names, separated by commas"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeRegisterModal}
                      className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={registering}
                      className="flex-1 px-4 py-3 bg-[#123524] text-white rounded-xl text-sm font-semibold hover:bg-[#1B4A32] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {registering ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Registering...
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Register
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== LEADERBOARD MODAL ===== */}
      {leaderboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setLeaderboardModal(null)} />
          <div className="relative bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
                <p className="text-sm text-gray-500">{leaderboardModal.title}</p>
              </div>
              <button onClick={() => setLeaderboardModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {leaderboardModal.loading ? (
              <p className="text-sm text-gray-400 py-8 text-center">Loading teams...</p>
            ) : leaderboardModal.teams.length === 0 ? (
              <p className="text-sm text-gray-400 py-8 text-center">No teams registered yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {leaderboardModal.teams.map((t, i) => {
                  const badge = t.badge ? BADGE_STYLES[t.badge] : null;
                  return (
                    <div key={t._id || i} className="flex items-center gap-4 py-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        i === 0 ? 'bg-[#D4AF37] text-white' : i === 1 ? 'bg-gray-300 text-gray-700' : i === 2 ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {t.rank || i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#123524] truncate">{t.teamName}</p>
                        <p className="text-xs text-gray-500 truncate">{t.school}</p>
                      </div>
                      {badge && (
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${badge.chip}`}>
                          {badge.label}
                        </span>
                      )}
                      <span className="text-sm font-bold text-[#123524] w-10 text-right">{t.scores?.total || 0}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
