'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { innovationClub } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Crown,
  CheckCircle2,
  Circle,
  Clock,
  Zap,
  TrendingUp,
  Calendar,
  Dna,
  Target,
  Brain,
  FileText,
} from 'lucide-react';

const PHASE_1_MODULES = [
  { title: 'Problem Discovery', description: 'Identify real-world problems worth solving' },
  { title: 'Customer Research', description: 'Understand your target audience deeply' },
  { title: 'Idea Validation', description: 'Test assumptions with real feedback' },
  { title: 'Solution Design', description: 'Architect a compelling product solution' },
  { title: 'Prototype Building', description: 'Create a tangible first version' },
  { title: 'First Pitch Draft', description: 'Craft your initial pitch narrative' },
];

const PHASE_2_MODULES = [
  { title: 'Pitch Deck Mastery', description: 'Build investor-grade presentation decks' },
  { title: 'Financial Modeling', description: 'Create revenue projections and unit economics' },
  { title: 'Investor Readiness', description: 'Prepare for tough questions and due diligence' },
  { title: 'Live Panel Prep', description: 'Rehearse for real investor panels' },
];

function getCompletedCount(modules, completionPercent) {
  return Math.round((completionPercent / 100) * modules.length);
}

function PhaseStatusBadge({ completion }) {
  if (completion >= 100) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
        <CheckCircle2 className="w-3 h-3" />
        Completed
      </span>
    );
  }
  if (completion > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#B8952E]">
        <Zap className="w-3 h-3" />
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">
      <Circle className="w-3 h-3" />
      Not Started
    </span>
  );
}

export default function ZunnovaJourneyPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({
    zunnovaPhase: 1,
    zunnovaProgress: {
      phase1Completion: 0,
      phase2Completion: 0,
      lastAccessedAt: null,
    },
  });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchProgress();
  }, [router]);

  const fetchProgress = async () => {
    try {
      const res = await innovationClub.getZunnovaProgress();
      if (res?.data || res?.zunnovaPhase != null) {
        setProgress(res?.data || res);
      }
    } catch (err) {
      console.error('Failed to fetch Zunnova progress:', err);
      setError('Unable to load your progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [advancing, setAdvancing] = useState(false);

  // Marks the next module of the given phase as complete and persists it
  const advancePhase = async (phase, currentCompletion, moduleCount) => {
    if (advancing) return;
    setAdvancing(true);
    try {
      const completedModules = Math.round((currentCompletion / 100) * moduleCount);
      const nextCompletion = Math.min(100, Math.round(((completedModules + 1) / moduleCount) * 100));
      const res = await innovationClub.updateZunnovaProgress({ phase, completion: nextCompletion });
      if (res?.zunnovaPhase != null) {
        setProgress(res);
      } else {
        await fetchProgress();
      }
    } catch (err) {
      console.error('Failed to update Zunnova progress:', err);
      setError('Unable to update your progress. Please try again.');
    } finally {
      setAdvancing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Zunnova++ Journey..." />;
  }

  if (!user?.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDD6] px-4">
        <div className="glass-panel p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unlock Zunnova++</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            The Zunnova++ founder journey is available exclusively to paid members. Upgrade your account to access both phases of venture-building curriculum.
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

  const { zunnovaPhase, zunnovaProgress } = progress;
  const p1 = zunnovaProgress?.phase1Completion || 0;
  const p2 = zunnovaProgress?.phase2Completion || 0;
  const phase2Unlocked = p1 >= 100;
  const overallProgress = Math.round((p1 + p2) / 2);
  const p1Completed = getCompletedCount(PHASE_1_MODULES, p1);
  const p2Completed = getCompletedCount(PHASE_2_MODULES, p2);
  const lastAccessed = zunnovaProgress?.lastAccessedAt
    ? new Date(zunnovaProgress.lastAccessedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Never';

  return (
    <div className="min-h-[calc(100dvh-4rem)] relative overflow-hidden bg-[#F5EDD6]">
      {/* Background blurs */}
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                  Zunnova++
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#1B3A2D] text-white">
                  Phase {zunnovaPhase}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-1 max-w-2xl">
                The Two-Phase Founder Journey -- from idea to investor-ready venture.
              </p>
            </div>
            <Link
              href="/student/innovation-club/zunnova/export"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-white/40 text-gray-700 rounded-xl text-sm font-medium hover:bg-white hover:shadow-sm transition-all self-start"
            >
              <FileText className="w-4 h-4" />
              Export Data
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="glass-panel p-6 mb-6 border-l-4 border-red-400">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => { setError(null); setLoading(true); fetchProgress(); }}
              className="mt-2 text-sm text-[#D4AF37] hover:text-[#B8952E] font-medium"
            >
              Try again
            </button>
          </div>
        )}

        {/* Progression Motif */}
        <div className="glass-panel p-5 sm:p-6 mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
                <Dna className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span>IDEA DNA</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 sm:hidden" />
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="w-8 h-8 rounded-lg bg-[#1B3A2D]/10 flex items-center justify-center">
                <Brain className="w-4 h-4 text-[#1B3A2D]" />
              </div>
              <span>S.U.R.G.E.</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 sm:hidden" />
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 flex items-center justify-center">
                <Target className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <span>SSI</span>
            </div>
          </div>
        </div>

        {/* Phase Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Phase 1 Card */}
          <div className="glass-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[#D4AF37]/5 to-white/50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full blur-[60px]" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#B8952E] font-semibold mb-1">Phase 1</p>
                  <h2 className="text-xl font-semibold text-gray-900">Foundations</h2>
                </div>
                <PhaseStatusBadge completion={p1} />
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                Core venture-building fundamentals: idea validation, customer discovery, first prototype.
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mb-5">
                <Clock className="w-3 h-3" />
                6 weeks, self-paced
              </p>

              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-semibold text-gray-700">{p1}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8952E] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${p1}%` }}
                  />
                </div>
              </div>

              {/* Module List */}
              <div className="space-y-2.5 mb-6">
                {PHASE_1_MODULES.map((mod, idx) => {
                  const completed = idx < p1Completed;
                  return (
                    <div
                      key={mod.title}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        completed ? 'bg-green-50/80' : 'bg-white/40'
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${completed ? 'text-gray-900' : 'text-gray-700'}`}>
                          {mod.title}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">{mod.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              {p1 < 100 && (
                <button
                  onClick={() => advancePhase(1, p1, PHASE_1_MODULES.length)}
                  disabled={advancing}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all disabled:opacity-50"
                >
                  {advancing ? 'Saving...' : p1 > 0 ? 'Complete Next Module' : 'Start Phase 1'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {p1 >= 100 && (
                <div className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Phase 1 Complete
                </div>
              )}
            </div>
          </div>

          {/* Phase 2 Card */}
          <div className={`glass-panel p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-[#1B3A2D]/5 to-white/50 ${!phase2Unlocked ? 'opacity-60' : ''}`}>
            {/* Lock Overlay */}
            {!phase2Unlocked && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] rounded-2xl pointer-events-auto">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-1">Phase 2 Locked</p>
                <p className="text-xs text-gray-500">Complete Phase 1 to unlock</p>
              </div>
            )}

            <div className={`relative z-10 ${!phase2Unlocked ? 'pointer-events-none' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-[#1B3A2D] font-semibold mb-1">Phase 2</p>
                  <h2 className="text-xl font-semibold text-gray-900">Advanced</h2>
                </div>
                {phase2Unlocked && <PhaseStatusBadge completion={p2} />}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-2">
                Mentor-reviewed pitch decks, financial modeling, live investor panel.
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mb-5">
                <Clock className="w-3 h-3" />
                4 weeks, mentor-guided
              </p>

              {/* Progress Bar */}
              {phase2Unlocked && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-gray-700">{p2}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1B3A2D] to-[#2D5A42] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${p2}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Module List */}
              <div className="space-y-2.5 mb-6">
                {PHASE_2_MODULES.map((mod, idx) => {
                  const completed = phase2Unlocked && idx < p2Completed;
                  return (
                    <div
                      key={mod.title}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                        completed ? 'bg-green-50/80' : 'bg-white/40'
                      }`}
                    >
                      {completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className={`text-sm font-medium ${completed ? 'text-gray-900' : 'text-gray-700'}`}>
                          {mod.title}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">{mod.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              {phase2Unlocked && p2 < 100 && (
                <button
                  onClick={() => advancePhase(2, p2, PHASE_2_MODULES.length)}
                  disabled={advancing}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#1B3A2D] to-[#2D5A42] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#1B3A2D]/20 transition-all disabled:opacity-50"
                >
                  {advancing ? 'Saving...' : p2 > 0 ? 'Complete Next Module' : 'Start Phase 2'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {phase2Unlocked && p2 >= 100 && (
                <div className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Phase 2 Complete
                </div>
              )}
              {!phase2Unlocked && (
                <div className="h-12" />
              )}
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="glass-panel p-5 sm:p-6 text-center">
            <Zap className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">{zunnovaPhase}</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1">
              Current Phase
            </p>
          </div>
          <div className="glass-panel p-5 sm:p-6 text-center">
            <TrendingUp className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">{overallProgress}%</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1">
              Overall Progress
            </p>
          </div>
          <div className="glass-panel p-5 sm:p-6 text-center">
            <Calendar className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-lg sm:text-xl font-light text-gray-900 tracking-tight">{lastAccessed}</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1">
              Last Accessed
            </p>
          </div>
        </div>

        {/* Your Journey Timeline */}
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Journey</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-200" />

            <div className="space-y-6">
              {/* Phase 1 Start */}
              <div className="relative flex items-start gap-4 pl-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  p1 > 0 ? 'bg-[#D4AF37] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Phase 1 Started</p>
                  <p className="text-xs text-gray-500">{p1 > 0 ? 'Foundations curriculum in progress' : 'Begin your founder journey'}</p>
                </div>
              </div>

              {/* Phase 1 Milestones */}
              <div className="relative flex items-start gap-4 pl-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  p1 >= 50 ? 'bg-[#D4AF37] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Halfway Through Phase 1</p>
                  <p className="text-xs text-gray-500">{p1 >= 50 ? 'Reached 50% completion' : 'Complete 3 modules to reach this milestone'}</p>
                </div>
              </div>

              {/* Phase 1 Complete */}
              <div className="relative flex items-start gap-4 pl-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  phase2Unlocked ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Phase 1 Complete</p>
                  <p className="text-xs text-gray-500">{phase2Unlocked ? 'Phase 2 unlocked' : 'Finish all 6 modules to unlock Phase 2'}</p>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative flex items-start gap-4 pl-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  phase2Unlocked && p2 > 0 ? 'bg-[#1B3A2D] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Phase 2 -- Advanced</p>
                  <p className="text-xs text-gray-500">
                    {phase2Unlocked && p2 >= 100
                      ? 'Journey complete -- investor ready'
                      : phase2Unlocked && p2 > 0
                      ? 'Mentor-guided modules in progress'
                      : 'Pitch decks, financial modeling, investor panels'}
                  </p>
                </div>
              </div>

              {/* Graduation */}
              <div className="relative flex items-start gap-4 pl-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  p2 >= 100 ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Target className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Investor Ready</p>
                  <p className="text-xs text-gray-500">
                    {p2 >= 100 ? 'Congratulations -- you are investor ready' : 'Complete both phases to earn this status'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
