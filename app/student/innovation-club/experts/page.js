'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { innovationClub } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  Search,
  Filter,
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
  Send,
  Eye,
  Bookmark,
} from 'lucide-react';

const TRACKS = ['All', 'AI', 'Business', 'Design', 'Finance'];
const FORMATS = ['All', 'Live', 'Recorded'];
const STATUSES = ['All', 'Upcoming', 'Live', 'Past'];

function StatusBadge({ status }) {
  const styles = {
    live: 'bg-red-500 text-white animate-pulse',
    upcoming: 'bg-[#D4AF37]/20 text-[#B8952E]',
    past: 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[status?.toLowerCase()] || styles.upcoming}`}>
      {status?.toLowerCase() === 'live' && <Radio className="w-3 h-3" />}
      {status}
    </span>
  );
}

function FormatBadge({ format }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${format?.toLowerCase() === 'live' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
      {format?.toLowerCase() === 'live' ? <Radio className="w-3 h-3" /> : <Video className="w-3 h-3" />}
      {format}
    </span>
  );
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
      if (appliedFilters.track && appliedFilters.track !== 'All') params.track = appliedFilters.track;
      if (appliedFilters.format && appliedFilters.format !== 'All') params.format = appliedFilters.format;
      if (appliedFilters.status && appliedFilters.status !== 'All') params.status = appliedFilters.status;
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
      await innovationClub.requestExpert(requestForm);
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

  return (
    <div className="min-h-[calc(100dvh-4rem)] relative overflow-hidden bg-[#F5EDD6]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[50%] bg-white/60 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 relative z-10">
        {/* Back + Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/student/innovation-club"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Innovation Club
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
            Expert Exposure
          </h1>
          <p className="text-gray-600 text-sm mt-2 max-w-2xl">
            Learn directly from industry leaders through live sessions, recorded masterclasses, and interactive workshops.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel p-4 sm:p-5 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Track */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold self-center mr-1">Track</span>
              {TRACKS.map((t) => (
                <button
                  key={t}
                  onClick={() => handleFilterChange('track', t)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filters.track === t ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-white/60 text-gray-600 hover:bg-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Format */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold self-center mr-1">Format</span>
              {FORMATS.map((f) => (
                <button
                  key={f}
                  onClick={() => handleFilterChange('format', f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filters.format === f ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-white/60 text-gray-600 hover:bg-white'}`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Status */}
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold self-center mr-1">Status</span>
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleFilterChange('status', s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filters.status === s ? 'bg-[#D4AF37] text-white shadow-sm' : 'bg-white/60 text-gray-600 hover:bg-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sessions..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/60 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Now Featured Card */}
        {liveSession && (
          <div className="glass-panel p-6 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden border-2 border-red-200 bg-gradient-to-br from-red-50/30 to-white">
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                <Radio className="w-3 h-3" />
                Live Now
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center flex-shrink-0 border border-gray-100">
                {liveSession.expertPhoto ? (
                  <img src={liveSession.expertPhoto} alt={liveSession.expertName} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <User className="w-10 h-10 text-gray-400" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1">
                  {liveSession.topic || liveSession.title}
                </h2>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-800">{liveSession.expertName}</span>
                  {liveSession.expertCredential && (
                    <span className="text-gray-500"> -- {liveSession.expertCredential}</span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                  {liveSession.viewerCount != null && (
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {liveSession.viewerCount} watching
                    </span>
                  )}
                  {liveSession.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {liveSession.duration} min
                    </span>
                  )}
                  {liveSession.track && <FormatBadge format={liveSession.track} />}
                </div>

                <button className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl font-semibold text-sm hover:bg-red-600 hover:shadow-lg transition-all">
                  <Play className="w-4 h-4" />
                  Join Session
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sessions Grid */}
        {otherSessions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {otherSessions.map((session) => (
              <div key={session._id || session.id} className="glass-panel p-5 sm:p-6 flex flex-col group hover:shadow-glass-lg transition-all duration-300">
                {/* Expert photo + info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {session.expertPhoto ? (
                      <img src={session.expertPhoto} alt={session.expertName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{session.expertName}</p>
                    <p className="text-[10px] text-gray-500 truncate">{session.expertCredential}</p>
                  </div>
                </div>

                {/* Topic */}
                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug">
                  {session.topic || session.title}
                </h3>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-gray-500">
                  {session.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(session.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  {session.time && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.time}
                    </span>
                  )}
                  {session.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {session.duration} min
                    </span>
                  )}
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {session.format && <FormatBadge format={session.format} />}
                  {session.status && <StatusBadge status={session.status} />}
                </div>

                {/* Action */}
                <div className="mt-auto pt-2">
                  {session.status?.toLowerCase() === 'past' ? (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white/80 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                      <Video className="w-4 h-4" />
                      Watch Replay
                    </button>
                  ) : session.status?.toLowerCase() === 'live' ? (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all">
                      <Play className="w-4 h-4" />
                      Join Session
                    </button>
                  ) : (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all">
                      <Bookmark className="w-4 h-4" />
                      Save Your Seat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center mb-10">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Sessions Found</h3>
            <p className="text-sm text-gray-500">
              {filters.track !== 'All' || filters.format !== 'All' || filters.status !== 'All' || filters.search
                ? 'Try adjusting your filters to see more sessions.'
                : 'New expert sessions are being scheduled. Check back soon.'}
            </p>
          </div>
        )}

        {/* Request Expert Section */}
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Need a Different Expert?</h2>
          <p className="text-sm text-gray-600 mb-6">
            Tell us what topic or industry you would like covered. We will work to bring in the right expert for your school.
          </p>

          {requestSent ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-2xl text-center">
              <p className="text-green-800 font-medium">Your request has been submitted. We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="School name"
                value={requestForm.schoolName}
                onChange={(e) => setRequestForm({ ...requestForm, schoolName: e.target.value })}
                className="px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                required
              />
              <input
                type="email"
                placeholder="Your email"
                value={requestForm.email}
                onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                className="px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                required
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Topic you want covered"
                  value={requestForm.topic}
                  onChange={(e) => setRequestForm({ ...requestForm, topic: e.target.value })}
                  className="flex-1 px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all disabled:opacity-50 flex items-center gap-2 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
