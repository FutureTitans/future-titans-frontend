'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { modules, payment } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Clock, Users, Star, Lock, Play, CheckCircle, Trophy, Map } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentModulesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Group modules by difficulty and assign a global level number
  const difficultyOrder = ['beginner', 'intermediate', 'advanced'];
  const groupedModules = {
    beginner: [],
    intermediate: [],
    advanced: []
  };

  let levelCounter = 1;

  // First sort all modules
  const sortedAllModules = [...modulesList].sort((a, b) => {
    const weights = { beginner: 1, intermediate: 2, advanced: 3 };
    const weightA = weights[a.difficulty] || 4;
    const weightB = weights[b.difficulty] || 4;
    if (weightA !== weightB) return weightA - weightB;
    return 0; // maintain relative order if same difficulty
  });

  // Then group and assign levels
  sortedAllModules.forEach(module => {
    const diff = module.difficulty || 'beginner';
    if (groupedModules[diff]) {
      groupedModules[diff].push({ ...module, levelNum: levelCounter++ });
    }
  });

  const getDifficultyTitle = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return { title: 'The Starter Vales', icon: '🌱', color: 'from-green-400 to-green-600', text: 'text-green-600' };
      case 'intermediate': return { title: 'The Intermediate Hills', icon: '🌿', color: 'from-[#D4AF37] to-[#B8952E]', text: 'text-[#B8952E]' };
      case 'advanced': return { title: 'The Advanced Summit', icon: '🌳', color: 'from-red-500 to-red-700', text: 'text-red-600' };
      default: return { title: 'Unknown Zone', icon: '❓', color: 'from-gray-400 to-gray-600', text: 'text-gray-600' };
    }
  };

  const getStars = (percentage) => {
    if (percentage >= 100) return 3;
    if (percentage >= 60) return 2;
    if (percentage > 0) return 1;
    return 0;
  };

  if (loading) {
    return <LoadingSpinner message="Loading Level Map..." />;
  }

  // Calculate highest unlocked level (simulate purely visually based on previous module completion if desired,
  // but keeping it simple: all are playable if paid, but we highlight the "current" one)
  let highestCompletedLevel = 0;
  sortedAllModules.forEach(mod => {
    if ((mod.userProgress?.completionPercentage || 0) >= 100) {
      highestCompletedLevel = mod.levelNum;
    }
  });
  const currentActiveLevel = highestCompletedLevel + 1;

  return (
    <div className="min-h-screen relative bg-[#F5EDD6] overflow-hidden" style={{ zIndex: 1 }}>
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden fixed">
        <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-[#FFFFFF]/60 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="container-lg py-8 space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm sticky top-4 z-50">
          <div>
            <h1 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight flex items-center gap-3">
              <Map className="w-8 h-8 md:w-10 md:h-10 text-[#D4AF37]" />
              Level Select
            </h1>
            <p className="text-gray-600 mt-2 font-medium">Choose your stage and master skills.</p>
          </div>

          <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-bold text-gray-600 uppercase tracking-widest">Progress</h3>
            <div className="text-2xl font-black text-[#D4AF37] flex items-center gap-1">
              <Star className="w-5 h-5 fill-[#D4AF37] text-[#D4AF37]" />
              {sortedAllModules.reduce((acc, mod) => acc + getStars(mod.userProgress?.completionPercentage || 0), 0)} / {sortedAllModules.length * 3}
            </div>
          </div>
        </div>

        {/* Payment Check */}
        {!paymentStatus?.isPaid && (
          <div className="glass-panel border-l-4 border-l-[#D4AF37] p-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#B8952E] mb-1">🔒 Access Restricted</h3>
                <p className="text-gray-600 text-sm">Complete payment to unlock all levels</p>
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

        {/* Empty State */}
        {sortedAllModules.length === 0 && (
          <div className="card text-center py-16">
            <div className="text-6xl mb-4 animate-bounce">🕹️</div>
            <h3 className="font-bold text-2xl mb-2 text-gray-800">No Levels Available</h3>
            <p className="text-gray-500 mb-6 font-medium">
              New regions are currently being built. Check back soon for your first quest!
            </p>
          </div>
        )}

        {/* Level Grids by Zone */}
        <div className="w-full mx-auto space-y-12">
          
          {difficultyOrder.map((difficulty) => {
            const modulesInZone = groupedModules[difficulty];
            if (modulesInZone.length === 0) return null;
            const zoneInfo = getDifficultyTitle(difficulty);

            return (
              <div key={difficulty} id={`zone-${difficulty}`} className="relative glass-panel p-6 sm:p-8 bg-white/40">
                
                {/* Zone Header */}
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/60">
                  <span className="text-3xl">{zoneInfo.icon}</span>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-wide uppercase">
                      {zoneInfo.title}
                    </h2>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mt-1">Zone {difficultyOrder.indexOf(difficulty) + 1}</p>
                  </div>
                </div>

                {/* Grid of Levels */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modulesInZone.map((module) => {
                    const completion = module.userProgress?.completionPercentage || 0;
                    const stars = getStars(completion);
                    const isCompleted = completion >= 100;
                    const isActive = module.levelNum === currentActiveLevel;
                    const isLocked = !paymentStatus?.isPaid;

                    return (
                      <div key={module._id} className={`card p-0 overflow-hidden transform transition-all duration-300 flex flex-col ${isActive ? 'scale-[1.03] shadow-xl shadow-[#D4AF37]/20 border-[#D4AF37]' : 'hover:scale-[1.02]'} ${isLocked ? 'grayscale-[0.5] opacity-80' : ''}`}>
                        
                        {/* Thumbnail Area */}
                        <div className="w-full h-40 bg-gray-100 relative shrink-0 overflow-hidden border-b border-gray-100">
                          {module.coverImage ? (
                            <img src={module.coverImage} alt={module.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/10 to-[#F5D76E]/10 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-[#D4AF37]/30" />
                            </div>
                          )}
                          
                          {/* Top Level Badge Overlay */}
                          <div className={`absolute top-0 left-0 w-full px-4 py-2 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent ${isCompleted ? 'from-[#D4AF37]/80' : ''}`}>
                            <span className="text-white font-black text-lg drop-shadow-md">Level {module.levelNum}</span>
                            {isCompleted && <CheckCircle className="w-5 h-5 text-white drop-shadow-md" />}
                            {isActive && <div className="text-xs font-bold text-[#F5D76E] uppercase tracking-widest drop-shadow-md animate-pulse">Up Next</div>}
                          </div>
                        </div>

                        {/* Content Area */}
                        <div className="p-5 flex-1 flex flex-col bg-white/70">
                          <div className="mb-4">
                            {/* Star Rating Center */}
                            <div className="flex justify-center gap-1 mb-3 bg-[#D4AF37]/10 py-1.5 rounded-full border border-[#D4AF37]/20 w-fit px-4 mx-auto">
                              {[1, 2, 3].map(star => (
                                <Star key={star} className={`w-4 h-4 ${star <= stars ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-300 fill-gray-200'} transition-all`} />
                              ))}
                            </div>

                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-2 text-center leading-tight">
                              {module.title}
                            </h3>
                            
                            <p className="text-gray-500 text-sm line-clamp-2 mt-3 text-center">
                              {module.description}
                            </p>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-2 mt-auto mb-4 border-t border-b border-gray-100 py-3 text-xs font-semibold text-gray-500 text-center">
                            <div className="flex flex-col items-center gap-1"><Clock className="w-3 h-3 text-[#D4AF37]" /> {module.estimatedCompletionTime}m</div>
                            <div className="flex flex-col items-center gap-1"><BookOpen className="w-3 h-3 text-[#D4AF37]" /> {module.chapters?.length || 0} Ch</div>
                            <div className="flex flex-col items-center gap-1">
                              {module.aiInteractionEnabled ? (
                                <><div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></div> AI Ready</>
                              ) : (
                                <><Users className="w-3 h-3 text-[#D4AF37]" /> Classic</>
                              )}
                            </div>
                          </div>

                          {/* Action row */}
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">Progress</span>
                              <span className="text-[10px] font-bold text-gray-700 leading-none">{completion}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3 overflow-hidden shadow-inner">
                              <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] h-full rounded-full transition-all" style={{ width: `${completion}%` }}></div>
                            </div>
                            
                            {isLocked ? (
                              <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold">
                                <Lock className="w-4 h-4" /> Locked
                              </button>
                            ) : (
                              <Link
                                href={`/student/modules/${module._id}`}
                                className={`w-full h-11 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                                  isCompleted 
                                    ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]' 
                                    : isActive 
                                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white shadow-md shadow-[#D4AF37]/30 hover:scale-[1.02]'
                                      : 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white border border-[#B8952E]/30 shadow-none opacity-90 hover:opacity-100'
                                }`}
                              >
                                {isCompleted ? 'Review Level' : isActive ? 'Play Level' : completion > 0 ? 'Resume' : 'Start'}
                                {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                              </Link>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
        </div>

      </div>
    </div>
  );
}

