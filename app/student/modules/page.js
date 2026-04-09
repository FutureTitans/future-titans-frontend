'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { modules, payment } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Clock, Users, Star, ArrowLeft, Lock, Play, CheckCircle, Trophy, Target, Shield, Zap } from 'lucide-react';
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

  // Calculate overall progress to "fill" the spine
  const lastActiveIndex = sortedModules.reduce((lastIdx, mod, idx) => {
    if ((mod.userProgress?.completionPercentage || 0) > 0) return idx;
    return lastIdx;
  }, 0);
  // Estimate height of filled spine based on last active index
  const spineFillPercentage = sortedModules.length > 0 
      ? Math.min(((lastActiveIndex + 0.5) / sortedModules.length) * 100, 100) 
      : 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAF8F3]" style={{ zIndex: 1 }}>
      
      {/* Immersive Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
         <div className="absolute top-[40%] right-[-10%] w-[60%] h-[60%] bg-[#F5D76E]/10 rounded-full blur-[150px]"></div>
         <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-white/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="container-lg pt-12 pb-32 relative z-10">
        
        {/* Payment Check */}
        {!paymentStatus?.isPaid && (
          <div className="glass-panel border-l-4 border-l-[#D4AF37] p-6 mb-12 max-w-3xl mx-auto shadow-2xl backdrop-blur-2xl bg-white/70">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#B8952E] mb-1">🔒 Full Access Restricted</h3>
                <p className="text-gray-600 text-sm">Complete payment to unlock premium AI tools and advanced chapters.</p>
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

        <div className="text-center md:mb-20 mb-12 relative z-10">
          <span className="text-[#B8952E] font-bold tracking-[0.2em] uppercase text-xs mb-3 block">Your Innovation Roadmap</span>
          <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">The <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] to-[#B8952E]">Journey</span> Begins</h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">Follow the golden path. Master essential skills, challenge the status quo, and forge your idea into reality.</p>
        </div>

        {/* 🗺️ Premium Vertical S-Curve / Spine 🗺️ */}
        <div className="relative max-w-5xl mx-auto w-full px-4 sm:px-8 mt-12 pb-24">
           
           {/* Central Spine */}
           <div className="absolute left-[34px] md:left-1/2 top-0 bottom-0 w-2 bg-gray-200/50 md:-translate-x-1/2 rounded-full overflow-hidden shadow-inner">
              {/* Dynamic Gold Fill */}
              <div 
                 className="w-full bg-gradient-to-b from-[#D4AF37] via-[#F5D76E] to-[#D4AF37] transition-all duration-[2000ms] rounded-full shadow-[0_0_15px_#D4AF37]" 
                 style={{ height: `${spineFillPercentage}%` }}
              ></div>
           </div>

           <div className="flex flex-col gap-12 md:gap-24 relative w-full pt-8">
            {sortedModules.map((module, index) => {
              const isDone = (module.userProgress?.completionPercentage || 0) >= 100;
              const isStarted = (module.userProgress?.completionPercentage || 0) > 0 && !isDone;
              
              const isLeft = index % 2 === 0;

              return (
                <div key={module._id} className={`w-full flex items-center relative group ${isLeft ? 'md:justify-start' : 'md:justify-end'}`}>
                  
                  {/* Central Node on the Spine */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-20 transition-transform duration-500 group-hover:scale-125">
                     {isDone ? (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/50 border-4 border-white">
                           <Trophy className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                     ) : isStarted ? (
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-xl border-4 border-[#D4AF37] ring-4 ring-[#D4AF37]/20 animate-pulse">
                           <Target className="w-4 h-4 md:w-5 md:h-5 text-[#B8952E]" />
                        </div>
                     ) : (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center border-[3px] border-gray-300 shadow-sm text-gray-400 font-bold text-xs md:text-sm transition-colors group-hover:border-[#D4AF37] group-hover:text-[#D4AF37]">
                           {index + 1}
                        </div>
                     )}
                  </div>

                  {/* Connecting Horizontal Line (Desktop only) */}
                  <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 h-[2px] w-[5%] bg-gradient-to-r transition-all duration-700 z-10
                     ${isLeft 
                        ? `right-1/2 rounded-l-full pointer-events-none ${isDone || isStarted ? 'from-transparent to-[#D4AF37]' : 'from-transparent to-gray-300'}` 
                        : `left-1/2 rounded-r-full pointer-events-none ${isDone || isStarted ? 'from-[#D4AF37] to-transparent' : 'from-gray-300 to-transparent'}`
                     }
                  `}></div>

                  {/* Quest Card Container */}
                  <div className={`pl-20 md:pl-0 md:w-[45%] w-full relative z-30 transition-all duration-500`}>
                     
                     {/* The Card */}
                     <div className={`glass-panel border-2 rounded-[2rem] overflow-hidden p-6 sm:p-8 transition-all duration-500 ease-out flex flex-col sm:flex-row gap-6 items-start
                        ${isDone ? 'border-[#D4AF37]/40 shadow-xl shadow-[#D4AF37]/10 bg-white/80' : 
                        isStarted ? 'border-[#D4AF37] shadow-2xl scale-[1.02] bg-white ring-8 ring-[#D4AF37]/5' : 
                        'border-white/60 bg-white/40 hover:bg-white/70 hover:-translate-y-1'}
                     `}>
                        
                        {/* Left Side: Thumbnail & Badges */}
                        <div className="w-full sm:w-1/3 flex-shrink-0 flex flex-col gap-4">
                           <div className={`w-full aspect-square rounded-2xl overflow-hidden relative shadow-md transition-transform duration-700 group-hover:scale-105 ${!isDone && !isStarted ? 'grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100' : ''}`}>
                              {module.coverImage ? (
                                 <img src={module.coverImage} alt={module.title} className="w-full h-full object-cover" />
                              ) : (
                                 <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <BookOpen className="w-10 h-10 text-gray-400" />
                                 </div>
                              )}
                              
                              {/* Difficulty Overlay badge */}
                               <div className="absolute top-2 left-2 flex gap-2">
                                 <span className={`text-[9px] px-2.5 py-1 rounded-full uppercase tracking-widest font-bold shadow-sm backdrop-blur-md border 
                                    ${isDone || isStarted ? 'bg-black/60 text-white border-black/40' : 'bg-white/80 text-gray-600 border-white'}
                                 `}>
                                   {module.difficulty}
                                 </span>
                               </div>
                           </div>
                           
                           {/* Stats pills */}
                           <div className="flex flex-col gap-2">
                              <div className="bg-gray-50 rounded-xl p-2 flex items-center gap-2 border border-gray-100">
                                 <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                 <span className="text-xs font-semibold text-gray-600 truncate">{module.estimatedCompletionTime} min</span>
                              </div>
                              <div className="bg-gray-50 rounded-xl p-2 flex items-center gap-2 border border-gray-100">
                                 <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
                                 <span className="text-xs font-semibold text-gray-600 truncate">{module.chapters?.length || 0} chapters</span>
                              </div>
                           </div>
                        </div>

                        {/* Right Side: Content & Actions */}
                        <div className="w-full sm:w-2/3 flex flex-col h-full justify-between">
                           
                           <div>
                              {/* Pre-title status */}
                              <div className="flex items-center gap-2 mb-2">
                                 <span className={`text-[10px] font-bold uppercase tracking-wider ${isDone ? 'text-green-500' : isStarted ? 'text-[#B8952E]' : 'text-gray-400'}`}>
                                    {isDone ? 'Quest Completed' : isStarted ? 'Quest Active' : 'New Quest'}
                                 </span>
                                 {paymentStatus?.isPaid && module.aiInteractionEnabled && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#B8952E] text-[9px] font-bold border border-[#D4AF37]/20 flex items-center gap-1">
                                       <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-pulse"></span>
                                       AI Enabled
                                    </span>
                                 )}
                              </div>

                              <h3 className={`font-bold text-xl md:text-2xl mb-3 leading-tight ${isStarted ? 'text-gray-900' : 'text-gray-800'} transition-colors group-hover:text-[#B8952E]`}>
                                 {module.title}
                              </h3>
                              <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                                 {module.description}
                              </p>
                           </div>

                           <div className="mt-auto">
                              {/* Progress Track */}
                              <div className="mb-4">
                                 <div className="flex justify-between items-center mb-1.5">
                                 <span className="text-[10px] uppercase font-bold text-gray-400">Mastery</span>
                                 <span className={`text-[10px] font-extrabold ${isDone ? 'text-green-500' : 'text-gray-700'}`}>{module.userProgress?.completionPercentage || 0}%</span>
                                 </div>
                                 <div className="w-full bg-gray-200/60 rounded-full h-1.5 overflow-hidden">
                                 <div className={`h-1.5 rounded-full transition-all duration-1000 ${isDone ? 'bg-green-500' : 'bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]'}`} 
                                       style={{ width: `${module.userProgress?.completionPercentage || 0}%` }}></div>
                                 </div>
                              </div>

                              {/* Action Button */}
                              {paymentStatus?.isPaid ? (
                                 <Link
                                 href={`/student/modules/${module._id}`}
                                 className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 border-2
                                    ${isDone 
                                       ? 'bg-transparent border-[#D4AF37] text-[#B8952E] hover:bg-[#D4AF37] hover:text-white hover:shadow-lg hover:shadow-[#D4AF37]/20' 
                                       : isStarted
                                          ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/30 hover:shadow-xl hover:shadow-[#D4AF37]/50 hover:-translate-y-0.5'
                                          : 'bg-white border-gray-200 text-gray-700 hover:border-[#D4AF37] hover:text-[#B8952E]'
                                    }
                                 `}
                                 >
                                 {isDone ? (
                                    <><CheckCircle className="w-4 h-4" /> Review Mastery</>
                                 ) : isStarted ? (
                                    <><Zap className="w-4 h-4 fill-white" /> Continue Quest</>
                                 ) : (
                                    <><Play className="w-4 h-4" /> Begin Quest</>
                                 )}
                                 </Link>
                              ) : (
                                 <button
                                 disabled
                                 className="w-full bg-gray-50 text-gray-400 py-3.5 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200 text-sm font-bold"
                                 >
                                 <Lock className="w-4 h-4" />
                                 Premium Required
                                 </button>
                              )}
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              );
            })}

            {sortedModules.length === 0 && (
              <div className="w-full flex justify-center mt-12 relative z-30">
                 <div className="glass-panel backdrop-blur-xl border border-white/60 p-12 max-w-2xl text-center shadow-2xl rounded-3xl">
                    <div className="text-6xl mb-6 inline-block opacity-80">🗺️</div>
                    <h3 className="font-bold text-2xl mb-3 text-gray-800">The Map is Uncharted</h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                     Your innovation journey hasn't begun yet. Check back shortly for newly mapped territories and learning quests.
                    </p>
                 </div>
              </div>
            )}
           </div>
        </div>

      </div>
    </div>
  );
}
