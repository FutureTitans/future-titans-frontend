'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { modules, payment } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Clock, Users, Star, ArrowLeft, ArrowDown, Lock, Play, CheckCircle, Trophy, Target, Shield, Zap } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentModulesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }

    const currentUser = getUser();
    setUser(currentUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const [modulesData, paymentData] = await Promise.all([
        modules.getAll(),
        payment.getPaymentStatus()
      ]);

      setModulesList(modulesData);
      setPaymentStatus(paymentData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedModules = [...modulesList].sort((a, b) => {
    const weights = { beginner: 1, intermediate: 2, advanced: 3 };
    const weightA = weights[a.difficulty] || 4;
    const weightB = weights[b.difficulty] || 4;
    return weightA - weightB;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-400 to-green-600';
      case 'intermediate': return 'from-[#D4AF37] to-[#B8952E]';
      case 'advanced': return 'from-red-500 to-red-700';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading modules..." />;
  }

  return (
    <div className="min-h-screen relative" style={{ zIndex: 1 }}>
      <div className="container-lg py-8 pb-32 space-y-6">
        {/* Payment Check */}
        {!paymentStatus?.isPaid && (
          <div className="glass-panel border-l-4 border-l-[#D4AF37] p-6 mb-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#B8952E] mb-1">🔒 Access Restricted</h3>
                <p className="text-gray-600 text-sm">Complete payment to unlock all learning stages and AI tools</p>
              </div>
              <Link
                href="/student/dashboard"
                className="glass-button px-6 py-3 flex-shrink-0"
              >
                Complete Payment
              </Link>
            </div>
          </div>
        )}

        <div className="text-center md:mb-6 mb-4 mt-4 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 mb-12 tracking-tight">Choose Your Level</h1>

          {/* Highlighted Instruction Box */}
          <div className="relative max-w-2xl mx-auto mt-8">
            {/* Floating animated arrow pointing down */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce flex flex-col items-center">
              <span className="text-[10px] font-extrabold text-[#D4AF37] uppercase tracking-widest mb-1 bg-white/80 px-2 py-0.5 rounded-full shadow-sm backdrop-blur-sm">Important</span>
              <ArrowDown className="w-8 h-8 text-[#B8952E] drop-shadow-lg" />
            </div>

            <div className="glass-panel bg-gradient-to-br from-white/90 to-[#F5EDD6]/90 border-2 border-[#D4AF37] p-6 md:p-8 rounded-3xl shadow-2xl shadow-[#D4AF37]/20 relative overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[#D4AF37] to-[#F5D76E]"></div>
              <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-[#F5D76E]/10 rounded-full blur-2xl pointer-events-none"></div>
              <p className="text-gray-800 text-sm md:text-base leading-relaxed font-semibold relative z-10">
                You have the freedom to start anywhere! Select <strong className="text-black bg-gradient-to-r from-[#D4AF37]/30 to-[#F5D76E]/30 px-2 py-0.5 rounded shadow-sm text-lg mx-1">ANY</strong> level that matches your interests or skill level. Complete a module to build your idea and become eligible to participate in the final challenge. The path is yours to decide!
              </p>
            </div>
          </div>
        </div>

        {/* 🏆 Tournament Bracket Container 🏆 */}
        <div className="relative w-full overflow-hidden mt-4 md:mt-6">
          {/* Central Connecting Background Line */}
          <div className="absolute top-[40%] left-0 right-0 h-1.5 md:h-2 bg-gradient-to-r from-gray-200 via-white/80 to-gray-200 shadow-[0_0_15px_rgba(212,175,55,0.2)] -translate-y-1/2 z-0 hidden md:block"></div>

          {/* Horizontal Scroller */}
          <div className="flex md:flex-row flex-col gap-12 md:gap-8 overflow-x-auto pb-16 pt-4 snap-x snap-mandatory hide-scrollbar relative z-10 px-4 md:px-12 items-center justify-start min-h-[500px]">

            {sortedModules.map((module, index) => {
              const isDone = (module.userProgress?.completionPercentage || 0) >= 100;
              const unlocked = true;

              // Highlight only the modules that are currently started but not finished, 
              // or the very first module if none are started.
              const isStarted = (module.userProgress?.completionPercentage || 0) > 0 && !isDone;
              // To avoid all 0% stages pulsing at once, let's say "isActive" is just whether you've started it.
              // Or you can just make all non-done stages look "ready to enter".
              const isActive = !isDone;

              return (
                <div key={module._id} className="snap-center shrink-0 w-full md:w-[360px] relative group flex flex-col md:block items-center">

                  {/* Connection Node / Dot */}
                  <div className="hidden md:flex absolute top-[40%] -left-[45px] w-full items-center -z-10 translate-y-[-50%] pointer-events-none">
                    {index !== 0 && (
                      <div className={`h-1.5 w-[80px] bg-gradient-to-r ${unlocked ? 'from-[#D4AF37] to-[#F5D76E]' : 'from-gray-300 to-gray-300'} transition-all duration-1000 origin-left`}></div>
                    )}
                  </div>

                  {/* Stage Label Hovering Above */}
                  <div className={`text-center mb-4 transition-all duration-300 ${isActive ? 'scale-110 translate-y-[-5px]' : ''}`}>
                    <div className="inline-flex flex-col items-center justify-center">
                      <span className={`text-[10px] md:text-xs font-bold tracking-widest uppercase mb-1 ${unlocked ? 'text-[#D4AF37]' : 'text-gray-400'}`}>
                        Level {index + 1}
                      </span>
                      {isDone ? (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/40 ring-4 ring-white">
                          <Trophy className="w-5 h-5 text-white" />
                        </div>
                      ) : isActive ? (
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-xl shadow-[#D4AF37]/30 ring-4 ring-[#D4AF37] animate-pulse">
                          <Target className="w-5 h-5 text-[#B8952E]" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white shadow-inner">
                          <Shield className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Boss Fight Card */}
                  <div
                    className={`card overflow-hidden p-0 w-full transition-all duration-500 border-2
                      ${isDone ? 'border-[#D4AF37]/50 shadow-xl shadow-[#D4AF37]/20 bg-gradient-to-br from-white to-[#F5D76E]/5' :
                        isActive ? 'border-[#D4AF37] shadow-2xl scale-[1.02] bg-white ring-8 ring-[#D4AF37]/10' :
                          'border-gray-200 opacity-70 grayscale-[0.6] hover:grayscale-0 bg-gray-50/80'}
                    `}
                  >
                    {/* Lock Overlay if completely locked visually */}
                    {!unlocked && (
                      <div className="absolute inset-0 bg-gray-100/50 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <div className="bg-white/90 p-3 rounded-full shadow-lg text-gray-500">
                          <Lock className="w-6 h-6" />
                        </div>
                      </div>
                    )}

                    {/* Cover Image */}
                    {module.coverImage ? (
                      <div className="w-full h-40 bg-gray-100 relative overflow-hidden">
                        <img src={module.coverImage} alt={module.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-4 flex gap-2">
                          <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm backdrop-blur-md bg-white/20 text-white border border-white/30`}>
                            {module.difficulty}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className={`w-full h-24 bg-gradient-to-br flex items-center justify-center ${isActive ? 'from-[#D4AF37]/20 to-[#F5D76E]/10' : 'from-gray-200 to-gray-100'}`}>
                        <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm  border ${isActive ? 'bg-white text-[#B8952E] border-[#D4AF37]/30' : 'bg-gray-100/50 text-gray-500 border-gray-300'}`}>
                          {module.difficulty}
                        </span>
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {module.mentorProfilePicture && (
                            <div className="relative">
                              <img
                                src={module.mentorProfilePicture}
                                alt="Mentor"
                                className={`w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm ${isActive ? 'ring-2 ring-[#D4AF37]' : ''}`}
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            </div>
                          )}
                          {!paymentStatus?.isPaid && (
                            <Lock className="w-4 h-4 text-gray-300 ml-2" />
                          )}
                        </div>
                      </div>

                      <h3 className={`font-bold text-lg mb-2 line-clamp-2 mt-1 transition-colors ${isActive ? 'text-gray-900 group-hover:text-[#D4AF37]' : 'text-gray-700'}`}>
                        {module.title}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-y-2 gap-x-2 mb-5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{module.estimatedCompletionTime} min</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{module.chapters?.length || 0} chapters</span>
                        </div>
                        {module.aiInteractionEnabled && (
                          <div className="flex items-center gap-1.5 text-xs text-[#B8952E] font-bold col-span-2 mt-1">
                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse shadow-[0_0_5px_#D4AF37]"></span>
                            AI boss available
                          </div>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-5 pb-5 border-b border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] uppercase font-bold text-gray-400">Completion</span>
                          <span className={`text-[10px] font-bold ${isDone ? 'text-green-500' : 'text-gray-700'}`}>{module.userProgress?.completionPercentage || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-1.5 rounded-full transition-all duration-1000 ${isDone ? 'bg-green-500' : 'bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]'}`}
                            style={{ width: `${module.userProgress?.completionPercentage || 0}%` }}></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {paymentStatus?.isPaid ? (
                        <Link
                          href={unlocked ? `/student/modules/${module._id}` : '#'}
                          className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300
                            ${!unlocked
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none'
                              : isDone
                                ? 'bg-white border-2 border-[#D4AF37] text-[#B8952E] hover:bg-[#D4AF37]/5'
                                : 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/40 hover:-translate-y-0.5'
                            }
                          `}
                        >
                          {!unlocked ? (
                            <><Lock className="w-4 h-4" /> Locked</>
                          ) : isDone ? (
                            <><CheckCircle className="w-4 h-4" /> Review Stage</>
                          ) : (
                            <><Zap className="w-4 h-4 fill-white animate-pulse" /> Enter Stage</>
                          )}
                        </Link>
                      ) : (
                        <button
                          disabled
                          className="w-full bg-gray-50 text-gray-400 py-3 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200 text-sm font-bold"
                        >
                          <Lock className="w-4 h-4" />
                          Payment Required
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {sortedModules.length === 0 && (
              <div className="w-full card text-center py-16 mx-auto max-w-2xl">
                <div className="text-6xl mb-4 text-[#D4AF37]">⚔️</div>
                <h3 className="font-bold text-2xl mb-2 text-gray-800">The Arena is Empty</h3>
                <p className="text-gray-500 mb-6">
                  Check back soon for new challenge stages.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
