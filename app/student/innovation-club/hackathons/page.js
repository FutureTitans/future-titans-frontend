'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
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
  Clock,
  Star,
  Award,
  Lock,
  Crown,
  FileText,
  UserPlus,
  Rocket,
  Lightbulb,
  Presentation,
  CheckCircle2,
  Circle,
  Medal,
} from 'lucide-react';

function StatusBadge({ status }) {
  const styles = {
    'registration open': 'bg-green-50 text-green-700 border-green-200',
    ongoing: 'bg-[#D4AF37]/10 text-[#B8952E] border-[#D4AF37]/20',
    'results out': 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const key = status?.toLowerCase() || '';
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[key] || styles.ongoing}`}>
      {status}
    </span>
  );
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
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Mins', value: timeLeft.mins },
    { label: 'Secs', value: timeLeft.secs },
  ];

  return (
    <div className="flex gap-3">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-900 text-white rounded-xl flex items-center justify-center text-xl sm:text-2xl font-light tracking-tight">
            {String(u.value).padStart(2, '0')}
          </div>
          <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold mt-1.5">{u.label}</p>
        </div>
      ))}
    </div>
  );
}

const journeySteps = [
  { icon: UserPlus, title: 'Register', description: 'Form your team and sign up' },
  { icon: Rocket, title: 'Build', description: 'Develop your solution' },
  { icon: Presentation, title: 'Pitch', description: 'Present to judges' },
  { icon: Trophy, title: 'Win', description: 'Claim your prize' },
];

function BadgeIcon({ badge }) {
  const styles = {
    winner: { bg: 'bg-gradient-to-br from-[#D4AF37] to-[#B8952E]', icon: Trophy },
    finalist: { bg: 'bg-gradient-to-br from-gray-400 to-gray-500', icon: Medal },
    spotlight: { bg: 'bg-gradient-to-br from-blue-400 to-blue-500', icon: Star },
  };
  const s = styles[badge?.toLowerCase()] || styles.spotlight;
  const Icon = s.icon;
  return (
    <div className={`w-8 h-8 rounded-full ${s.bg} flex items-center justify-center shadow-md`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
  );
}

export default function HackathonsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hackathons, setHackathons] = useState([]);
  const [registerModal, setRegisterModal] = useState(null);
  const [registerForm, setRegisterForm] = useState({ teamName: '', members: '' });
  const [registering, setRegistering] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [registerError, setRegisterError] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchHackathons();
  }, [router]);

  const fetchHackathons = async () => {
    try {
      const res = await innovationClub.getHackathons();
      setHackathons(res?.hackathons || []);
    } catch (error) {
      console.error('Failed to fetch hackathons:', error);
      setHackathons([]);
    } finally {
      setLoading(false);
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
        members: membersArray,
      });
      setRegisterSuccess(true);
      setRegisterForm({ teamName: '', members: '' });
      fetchHackathons();
    } catch (error) {
      console.error('Failed to register team:', error);
      setRegisterError(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const closeRegisterModal = () => {
    setRegisterModal(null);
    setRegisterForm({ teamName: '', members: '' });
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

  const registrationPercent = featured
    ? Math.round(((featured.registeredTeams || 0) / (featured.maxTeams || 100)) * 100)
    : 0;

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
            Hackathons
          </h1>
          <p className="text-gray-600 text-sm mt-2 max-w-2xl">
            Compete, build, and innovate. Register your team, develop solutions, and showcase your ideas to industry judges.
          </p>
        </div>

        {/* Featured Hackathon */}
        {featured ? (
          <div className="glass-panel p-6 sm:p-8 mb-6 sm:mb-8 relative overflow-hidden border border-[#D4AF37]/20 bg-gradient-to-br from-white to-[#F5D76E]/5">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#D4AF37]/5 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                <div className="flex-1 min-w-0">
                  <StatusBadge status={featured.status} />
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900 mt-3 mb-2">
                    {featured.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {featured.startDate && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(featured.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        {featured.endDate && ` - ${new Date(featured.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                      </span>
                    )}
                    {featured.classes && (
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-400" />
                        {featured.classes}
                      </span>
                    )}
                    {featured.prizePool && (
                      <span className="flex items-center gap-1.5 font-semibold text-[#B8952E]">
                        <Trophy className="w-4 h-4" />
                        {featured.prizePool}
                      </span>
                    )}
                  </div>
                </div>

                {/* Countdown */}
                {featured.deadlineDate && (
                  <div className="flex-shrink-0">
                    <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Time Remaining</p>
                    <CountdownTimer targetDate={featured.deadlineDate} />
                  </div>
                )}
              </div>

              {/* Registration Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Registration Progress</span>
                  <span className="font-semibold text-gray-900">{featured.registeredTeams || 0} / {featured.maxTeams || 100} teams</span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8952E] transition-all duration-700"
                    style={{ width: `${Math.min(registrationPercent, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">{registrationPercent}% filled</p>
              </div>

              {/* Timeline */}
              {featured.timeline && featured.timeline.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
                  {featured.timeline.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        {step.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-xs font-medium whitespace-nowrap ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                      </div>
                      {i < featured.timeline.length - 1 && (
                        <div className={`w-8 h-px flex-shrink-0 ${step.completed ? 'bg-[#D4AF37]' : 'bg-gray-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setRegisterModal(featured._id || featured.id)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all"
                >
                  <UserPlus className="w-4 h-4" />
                  Register Team
                </button>
                {featured.rulebookUrl && (
                  <a
                    href={featured.rulebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 border border-gray-200 text-gray-700 rounded-2xl font-medium text-sm hover:bg-gray-50 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    View Rulebook
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel p-12 text-center mb-8">
            <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Hackathons Available</h3>
            <p className="text-sm text-gray-500">New hackathons are being planned. Check back soon for exciting opportunities.</p>
          </div>
        )}

        {/* Other Hackathons Grid */}
        {otherHackathons.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {otherHackathons.map((h) => (
              <div key={h._id || h.id} className="glass-panel p-5 sm:p-6 flex flex-col group hover:shadow-glass-lg transition-all duration-300">
                <StatusBadge status={h.status} />
                <h3 className="text-base font-semibold text-gray-900 mt-3 mb-2 line-clamp-2">{h.title}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                  {h.startDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(h.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                  {h.prizePool && (
                    <span className="flex items-center gap-1 text-[#B8952E] font-semibold">
                      <Trophy className="w-3 h-3" />
                      {h.prizePool}
                    </span>
                  )}
                  {h.registeredTeams != null && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {h.registeredTeams} teams
                    </span>
                  )}
                </div>
                <div className="mt-auto pt-2">
                  <button
                    onClick={() => setRegisterModal(h._id || h.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all"
                  >
                    Register Team
                    <UserPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Competition Journey */}
        <div className="glass-panel p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">The Competition Journey</h2>
          <p className="text-sm text-gray-600 mb-8">Four stages from idea to victory. Every step builds on the last.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {journeySteps.map((step, i) => (
              <div key={step.title} className="text-center group">
                <div className="relative mx-auto mb-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#D4AF37]/10 to-[#F5D76E]/10 flex items-center justify-center group-hover:from-[#D4AF37]/20 group-hover:to-[#F5D76E]/20 transition-all duration-300 border border-[#D4AF37]/10">
                    <step.icon className="w-7 h-7 text-[#B8952E]" />
                  </div>
                  {i < journeySteps.length - 1 && (
                    <div className="hidden sm:block absolute top-1/2 -right-3 sm:-right-4 w-6 sm:w-8 h-px bg-[#D4AF37]/30" />
                  )}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-[#B8952E] font-bold mb-1">Step {i + 1}</p>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Past Winners */}
        {hackathons.some((h) => h.winners && h.winners.length > 0) && (
          <div className="glass-panel p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Past Winners</h2>
            <p className="text-sm text-gray-600 mb-6">Teams that set the standard in previous competitions.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hackathons
                .flatMap((h) => (h.winners || []).map((w) => ({ ...w, hackathonTitle: h.title })))
                .slice(0, 6)
                .map((winner, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 bg-white/60 rounded-2xl border border-white/40 hover:shadow-sm transition-all"
                  >
                    <BadgeIcon badge={winner.badge} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{winner.teamName}</p>
                      <p className="text-[10px] text-gray-500 truncate">{winner.hackathonTitle}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 flex-shrink-0">
                      {winner.badge}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {registerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeRegisterModal} />
          <div className="relative glass-panel p-6 sm:p-8 max-w-md w-full shadow-2xl">
            {registerSuccess ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Registered</h3>
                <p className="text-sm text-gray-600 mb-6">Your team has been successfully registered for this hackathon.</p>
                <button
                  onClick={closeRegisterModal}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
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
                      className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                      required
                    />
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
                      className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30 focus:border-[#D4AF37]/50 transition-all"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeRegisterModal}
                      className="flex-1 px-4 py-3 bg-white/80 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={registering}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
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
    </div>
  );
}
