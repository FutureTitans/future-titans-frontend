'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { innovationClub } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  Search,
  Play,
  Clock,
  Users,
  Calendar,
  ArrowLeft,
  ArrowRight,
  Video,
  Radio,
  Lock,
  Crown,
  User,
  Eye,
  ShieldCheck,
  MessageCircle,
  Volume2,
} from 'lucide-react';

const TRACKS = ['All', 'AI', 'Business', 'Design', 'Finance'];
const FORMATS = ['All', 'Live', 'Recorded'];
const STATUSES = ['All', 'Upcoming', 'Live', 'Past'];

const TRACK_STYLES = {
  ai: 'bg-[#D4AF37] text-[#123524]',
  business: 'bg-[#123524] text-white',
  design: 'bg-purple-600 text-white',
  finance: 'bg-blue-600 text-white',
};

// Fixed pseudo-random heights for the live-card waveform
const WAVE_HEIGHTS = [8, 18, 12, 26, 15, 32, 22, 10, 28, 16, 34, 20, 12, 24, 30, 14, 26, 18, 8, 22, 32, 16, 10, 28, 20, 34, 14, 24, 12, 30, 18, 26, 8, 20, 16, 28];

function TrackBadge({ track }) {
  if (!track) return null;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${TRACK_STYLES[track.toLowerCase()] || 'bg-gray-200 text-gray-700'}`}>
      {track}
    </span>
  );
}

function FormatBadge({ format }) {
  const isLive = format?.toLowerCase() === 'live';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${isLive ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-700'}`}>
      {isLive ? <Radio className="w-3 h-3" /> : <Video className="w-3 h-3" />}
      {format}
    </span>
  );
}

function StatusBadge({ status }) {
  const s = status?.toLowerCase();
  const label = s === 'completed' || s === 'past' ? 'Replay' : status;
  const styles = {
    live: 'bg-red-500 text-white',
    upcoming: 'bg-[#F5D76E]/40 text-[#8A6D1B]',
    scheduled: 'bg-[#F5D76E]/40 text-[#8A6D1B]',
    completed: 'bg-green-100 text-green-700',
    past: 'bg-green-100 text-green-700',
    cancelled: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${styles[s] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
}

function ExpertPhoto({ photo, name, className }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`bg-gradient-to-br from-[#123524]/10 to-[#D4AF37]/10 flex items-center justify-center overflow-hidden ${className}`}>
      {photo && !failed ? (
        <img
          src={photo}
          alt={name || 'Expert'}
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <User className="w-10 h-10 text-[#123524]/30" />
      )}
    </div>
  );
}

function fmtDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', weekday: 'short' });
}

function fmtTime(d) {
  if (!d) return null;
  return new Date(d).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

function weekRangeLabel(start, end) {
  const opts = { day: 'numeric', month: 'short' };
  return `${start.toLocaleDateString('en-IN', opts)} – ${end.toLocaleDateString('en-IN', opts)}`;
}

export default function ExpertExposurePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [filters, setFilters] = useState({ track: 'All', format: 'All', status: 'All', search: '' });
  const [requestForm, setRequestForm] = useState({ schoolName: '', email: '', topic: '' });
  const [submitting, setSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [reservingId, setReservingId] = useState(null);

  const handleReserveSeat = async (session) => {
    const id = session._id || session.id;
    setReservingId(id);
    try {
      await innovationClub.reserveSessionSeat(id);
      setSessions((prev) =>
        prev.map((s) => ((s._id || s.id) === id ? { ...s, isReserved: true, attendeeCount: (s.attendeeCount || 0) + 1 } : s))
      );
    } catch (error) {
      console.error('Failed to reserve seat:', error);
      alert(error?.error || error?.message || 'Failed to save your seat. Please try again.');
    } finally {
      setReservingId(null);
    }
  };

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchSessions();
  }, [router]);

  const fetchSessions = async (appliedFilters = {}) => {
    try {
      const params = {};
      if (appliedFilters.track && appliedFilters.track !== 'All') params.track = appliedFilters.track.toLowerCase();
      if (appliedFilters.format && appliedFilters.format !== 'All') params.format = appliedFilters.format.toLowerCase();
      if (appliedFilters.status && appliedFilters.status !== 'All') params.status = appliedFilters.status.toLowerCase();
      if (appliedFilters.search) params.search = appliedFilters.search;

      const res = await innovationClub.getSessions(params);
      setSessions(Array.isArray(res) ? res : res?.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchSessions(newFilters);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestForm.schoolName || !requestForm.email || !requestForm.topic) return;
    setSubmitting(true);
    try {
      await innovationClub.requestExpert({
        schoolName: requestForm.schoolName,
        contactEmail: requestForm.email,
        topicNeeded: requestForm.topic,
      });
      setRequestSent(true);
      setRequestForm({ schoolName: '', email: '', topic: '' });
    } catch (error) {
      console.error('Failed to submit expert request:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Expert Sessions..." />;
  }

  if (!user?.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDD6] px-4">
        <div className="glass-panel p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unlock Expert Exposure</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Access live sessions with industry experts and mentors. Upgrade your account to join masterclasses, watch replays, and connect with leaders across AI, Business, Design, and Finance.
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

  const liveSession = sessions.find((s) => s.status?.toLowerCase() === 'live');
  const otherSessions = sessions.filter((s) => s !== liveSession);

  // Upcoming sessions in the next 7 days (falls back to latest three)
  const now = new Date();
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  let weekSessions = sessions
    .filter((s) => s.date && new Date(s.date) >= now && new Date(s.date) <= weekAhead)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  if (weekSessions.length === 0) {
    weekSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  }
  weekSessions = weekSessions.slice(0, 4);

  // Attendance: sum viewer counts by week for the last four weeks
  const weekBuckets = [3, 2, 1, 0].map((weeksAgo) => {
    const end = new Date(now.getTime() - weeksAgo * 7 * 24 * 60 * 60 * 1000);
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    const inWeek = sessions.filter((s) => {
      const d = s.date && new Date(s.date);
      return d && d >= start && d < end;
    });
    return {
      label: weekRangeLabel(start, end),
      value: inWeek.reduce((sum, s) => sum + (s.viewerCount || 0), 0),
      sessions: inWeek.length,
    };
  });
  const maxAttendance = Math.max(...weekBuckets.map((w) => w.value), 1);
  const totalAttendance = weekBuckets.reduce((s, w) => s + w.value, 0);
  const totalWeekSessions = weekBuckets.reduce((s, w) => s + w.sessions, 0);
  const avgAttendance = totalWeekSessions > 0 ? Math.round(totalAttendance / totalWeekSessions) : 0;

  const actionFor = (session) => {
    const s = session.status?.toLowerCase();
    if (s === 'live') {
      return (
        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all">
          <Play className="w-4 h-4" />
          Join Session
        </button>
      );
    }
    if (s === 'completed' || s === 'past') {
      return (
        <button
          onClick={() => session.videoUrl && window.open(session.videoUrl, '_blank')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#123524]/20 text-[#123524] rounded-xl text-sm font-semibold hover:bg-[#123524]/5 transition-all"
        >
          Watch Replay
          <ArrowRight className="w-4 h-4" />
        </button>
      );
    }
    if (session.isReserved) {
      return (
        <div className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
          <ShieldCheck className="w-4 h-4" />
          Seat Saved
        </div>
      );
    }
    const id = session._id || session.id;
    return (
      <button
        onClick={() => handleReserveSeat(session)}
        disabled={reservingId === id}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#123524] text-white rounded-xl text-sm font-semibold hover:bg-[#1B4A32] transition-all disabled:opacity-50"
      >
        {reservingId === id ? 'Saving...' : s === 'upcoming' ? 'Reserve Seat' : 'Save Your Seat'}
        <ArrowRight className="w-4 h-4" />
      </button>
    );
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#F7F1E3]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-[#F7F1E3]">
        <div className="w-full max-w-[1440px] mx-auto grid lg:grid-cols-2 items-center">
          <div className="px-4 sm:px-6 md:px-10 xl:px-14 py-10 sm:py-14">
            <Link
              href="/student/innovation-club"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Innovation Club
            </Link>
            <p className="text-[#B8952E] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              01 &mdash; Expert Exposure
            </p>
            <h1 className="font-roca text-3xl sm:text-4xl lg:text-5xl text-[#123524] leading-[1.15] mb-5">
              Learn Directly From<br />People Who Have Built It
            </h1>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-md mb-7">
              Live and recorded sessions with founders, operators, designers, and researchers &mdash; focused on practical decisions students can apply immediately.
            </p>
            <div className="inline-flex items-center gap-2.5 border border-[#D4AF37]/50 bg-white/60 rounded-xl px-4 py-2.5">
              <span className="w-7 h-7 rounded-full bg-[#123524] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              </span>
              <span className="text-[#123524] text-sm font-medium">Real experience. Direct student access.</span>
            </div>
          </div>

          <div className="relative hidden lg:block h-[380px]">
            <div className="absolute inset-0" style={{ clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0 100%)' }}>
              <Image
                src="/images/yp/aca2.jpg"
                alt="Students learning from an expert session"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 0vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#F7F1E3]/30 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 xl:px-14 pb-12">
        {/* ===== FILTER BAR ===== */}
        <div className="bg-white rounded-2xl border border-[#123524]/10 shadow-sm p-4 sm:p-5 -mt-2 mb-8 relative z-10">
          <div className="flex flex-col xl:flex-row xl:items-center gap-4">
            {[
              { label: 'Track', key: 'track', options: TRACKS },
              { label: 'Format', key: 'format', options: FORMATS },
              { label: 'Status', key: 'status', options: STATUSES },
            ].map((group) => (
              <div key={group.key} className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#123524] mr-1">{group.label}</span>
                {group.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleFilterChange(group.key, opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      filters[group.key] === opt
                        ? 'bg-[#123524] text-white'
                        : 'text-gray-600 hover:bg-[#123524]/5'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ))}
            <div className="flex-1 min-w-[200px] xl:max-w-xs xl:ml-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search experts or topics"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-[#F7F1E3]/60 border border-[#123524]/10 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]/50 transition-all"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== LIVE NOW FEATURED ===== */}
        {liveSession && (
          <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 bg-gradient-to-br from-[#123524] to-[#0B2418] mb-8">
            <div className="grid md:grid-cols-[240px_1fr] lg:grid-cols-[280px_1fr_auto] items-stretch">
              <ExpertPhoto
                photo={liveSession.expertPhoto}
                name={liveSession.expertName}
                className="h-56 md:h-full min-h-[220px]"
              />
              <div className="p-6 sm:p-8 flex flex-col justify-center">
                <span className="inline-flex items-center gap-1.5 bg-red-500 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md self-start mb-4">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Live Now
                </span>
                <h2 className="font-roca text-2xl sm:text-3xl text-white mb-1">{liveSession.expertName}</h2>
                <p className="text-[#D4AF37] text-sm font-medium mb-4">{liveSession.expertCredential}</p>
                <h3 className="font-roca text-xl sm:text-2xl text-white leading-snug mb-5">
                  {liveSession.topic || liveSession.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                  {liveSession.viewerCount != null && (
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      {liveSession.viewerCount} watching
                    </span>
                  )}
                  {liveSession.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {liveSession.duration} min
                    </span>
                  )}
                </div>
              </div>
              <div className="hidden lg:flex flex-col justify-between items-end p-8 min-w-[300px]">
                {/* Waveform */}
                <div className="flex items-center gap-[3px] h-16">
                  {WAVE_HEIGHTS.map((h, i) => (
                    <span
                      key={i}
                      className="w-[3px] rounded-full bg-[#D4AF37]/50"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
                <button
                  onClick={() => liveSession.videoUrl && window.open(liveSession.videoUrl, '_blank')}
                  className="inline-flex items-center gap-2 bg-[#D4AF37] text-[#123524] font-bold px-7 py-3 rounded-xl text-sm hover:bg-[#E5C558] transition-colors"
                >
                  Join Session
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="lg:hidden px-6 pb-6">
                <button
                  onClick={() => liveSession.videoUrl && window.open(liveSession.videoUrl, '_blank')}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#123524] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#E5C558] transition-colors"
                >
                  Join Session
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ===== SESSION CARDS ===== */}
        {otherSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-10">
            {otherSessions.map((session) => (
              <div
                key={session._id || session.id}
                className="bg-white rounded-2xl border border-[#123524]/10 overflow-hidden flex flex-col hover:shadow-lg hover:shadow-[#123524]/5 transition-all duration-300"
              >
                <ExpertPhoto photo={session.expertPhoto} name={session.expertName} className="h-44" />
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <TrackBadge track={session.expert?.track} />
                    {session.format && <FormatBadge format={session.format} />}
                    {session.status && <StatusBadge status={session.status} />}
                  </div>
                  <h3 className="text-lg font-bold text-[#123524]">{session.expertName}</h3>
                  <p className="text-xs text-gray-500 mb-2.5">{session.expertCredential}</p>
                  <p className="font-roca text-base text-[#123524] leading-snug mb-4">
                    {session.topic || session.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-5 mt-auto">
                    {session.date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {fmtDate(session.date)} &middot; {fmtTime(session.date)}
                      </span>
                    )}
                    {session.duration && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {session.duration} min
                      </span>
                    )}
                  </div>
                  {actionFor(session)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#123524]/10 p-12 text-center mb-10">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Sessions Found</h3>
            <p className="text-sm text-gray-500">
              {filters.track !== 'All' || filters.format !== 'All' || filters.status !== 'All' || filters.search
                ? 'Try adjusting your filters to see more sessions.'
                : 'New expert sessions are being scheduled. Check back soon.'}
            </p>
          </div>
        )}

        {/* ===== VALUE STRIP ===== */}
        <div className="rounded-2xl bg-gradient-to-br from-[#123524] to-[#0B2418] p-6 sm:p-8 mb-8">
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Learn From Real Operators',
                desc: 'Sessions led by people who are building, leading, and solving real-world problems.',
              },
              {
                icon: MessageCircle,
                title: 'Ask Questions Live',
                desc: 'Engage directly, get your doubts answered, and learn from real experiences.',
              },
              {
                icon: Volume2,
                title: 'Revisit Recorded Sessions',
                desc: 'All sessions are recorded so you can learn, revisit, and share anytime.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== THIS WEEK + ATTENDANCE ===== */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Sessions This Week */}
          <div className="bg-white rounded-2xl border border-[#123524]/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#123524]">Sessions This Week</h2>
            </div>
            {weekSessions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {weekSessions.map((s) => (
                  <div key={s._id || s.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                    <ExpertPhoto photo={s.expertPhoto} name={s.expertName} className="w-11 h-11 rounded-full flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-gray-700">
                          {fmtDate(s.date)} &middot; {fmtTime(s.date)}
                        </span>
                        {s.status?.toLowerCase() === 'live' ? (
                          <span className="inline-flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            Live
                          </span>
                        ) : s.format?.toLowerCase() === 'recorded' ? (
                          <span className="text-blue-600 text-[10px] font-bold uppercase">Recorded</span>
                        ) : (
                          <span className="text-[#B8952E] text-[10px] font-bold uppercase">Upcoming</span>
                        )}
                      </div>
                      <p className="text-sm text-[#123524] truncate">
                        <span className="font-bold">{s.expertName}</span>
                        <span className="text-gray-500"> &middot; {s.topic || s.title}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 py-6 text-center">No sessions scheduled this week.</p>
            )}
          </div>

          {/* Attendance Chart */}
          <div className="bg-white rounded-2xl border border-[#123524]/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#123524]">Student Attendance &mdash; Last 4 Weeks</h2>
            </div>
            <div className="flex items-end justify-around gap-4 h-44 px-2">
              {weekBuckets.map((w, i) => {
                const isCurrent = i === weekBuckets.length - 1;
                const barH = Math.max(6, Math.round((w.value / maxAttendance) * 130));
                return (
                  <div key={w.label} className="flex flex-col items-center gap-1.5 flex-1" title={`${w.label}: ${w.value} attendees across ${w.sessions} sessions`}>
                    <span className="text-xs font-bold text-[#123524]">{w.value}</span>
                    <div
                      className={`w-full max-w-[56px] rounded-t-[4px] transition-all duration-500 ${isCurrent ? 'bg-[#D4AF37]' : 'bg-[#123524]'}`}
                      style={{ height: `${barH}px` }}
                    />
                    <span className="text-[9px] text-gray-500 text-center leading-tight whitespace-nowrap">{w.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Average Attendance</p>
                  <p className="text-sm font-bold text-[#123524]">{avgAttendance} Students</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">Total Sessions</p>
                <p className="text-sm font-bold text-[#123524]">{totalWeekSessions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== REQUEST AN EXPERT ===== */}
        <div className="rounded-2xl bg-gradient-to-br from-[#123524] to-[#0B2418] p-6 sm:p-10">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-8 items-center">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-full border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h2 className="font-roca text-2xl sm:text-3xl text-white mb-2">
                  Need a Different <span className="text-[#D4AF37]">Expert?</span>
                </h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  Tell us what your students are building. We&apos;ll help identify the right mentor.
                </p>
              </div>
            </div>

            {requestSent ? (
              <div className="p-6 bg-white/10 border border-[#D4AF37]/40 rounded-2xl text-center">
                <p className="text-white font-medium">Your request has been submitted. We will get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-xs font-semibold mb-1.5">School Name</label>
                  <input
                    type="text"
                    placeholder="Enter your school name"
                    value={requestForm.schoolName}
                    onChange={(e) => setRequestForm({ ...requestForm, schoolName: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-xs font-semibold mb-1.5">Contact Email</label>
                  <input
                    type="email"
                    placeholder="Enter official email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all"
                    required
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 sm:items-end">
                  <div className="flex-1">
                    <label className="block text-white text-xs font-semibold mb-1.5">Topic Needed</label>
                    <input
                      type="text"
                      placeholder="What topic or expert are you looking for?"
                      value={requestForm.topic}
                      onChange={(e) => setRequestForm({ ...requestForm, topic: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37]/50 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 bg-[#D4AF37] text-[#123524] font-bold px-6 py-3 rounded-xl text-sm hover:bg-[#E5C558] transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {submitting ? 'Sending...' : 'Request an Expert'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
