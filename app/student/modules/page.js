'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { modules, payment } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Clock, Users, Star, ArrowLeft, Lock, Play, CheckCircle, Filter, Sparkles, Brain, Trophy } from 'lucide-react';
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

  const isPaid = user?.isPaid || paymentStatus?.isPaid;

  // Group modules by difficulty for the adventure zones
  const getNormalizedDifficulty = (diff) => {
    const normalized = (diff || '').toLowerCase();
    if (['intermediate', 'advanced'].includes(normalized)) return normalized;
    return 'beginner'; // Default unknown to beginner
  };

  const groupedModules = {
    beginner: modulesList.filter(m => getNormalizedDifficulty(m.difficulty) === 'beginner'),
    intermediate: modulesList.filter(m => getNormalizedDifficulty(m.difficulty) === 'intermediate'),
    advanced: modulesList.filter(m => getNormalizedDifficulty(m.difficulty) === 'advanced')
  };

  // Flatten keeping the order B -> I -> A to calculate continuous level numbers
  const sequencedModules = [...groupedModules.beginner, ...groupedModules.intermediate, ...groupedModules.advanced];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-400 to-green-600';
      case 'intermediate': return 'from-[#D4AF37] to-[#B8952E]';
      case 'advanced': return 'from-red-500 to-red-700';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  // Helper to determine stars based on completion %
  const getStars = (percentage) => {
    if (percentage === undefined || percentage === null) return 0;
    if (percentage === 0) return 0;
    if (percentage > 0 && percentage < 50) return 1;
    if (percentage >= 50 && percentage < 100) return 2;
    if (percentage >= 100) return 3;
    return 0;
  };

  if (loading) {
    return <LoadingSpinner message="Loading your adventure..." />;
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#F5EDD6]" style={{ zIndex: 1 }}>
      {/* Background ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[-10%] w-[50%] h-[50%] bg-[#FFFFFF]/60 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full filter blur-[100px]"></div>
      </div>

      <div className="container-lg py-8 space-y-6 relative z-10 w-full max-w-5xl">
        
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#B8952E] via-[#D4AF37] to-[#B8952E] bg-clip-text text-transparent hero-title-animate">
            Your Innovation Journey
          </h1>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto font-medium">
            Embark on your path to becoming a Future Titan. Complete levels to earn stars, unlock new zones, and build your startup from scratch.
          </p>
        </div>

        {/* Payment Check */}
        {!isPaid && (
          <div className="glass-panel border border-[#D4AF37]/30 p-6 bg-gradient-to-r from-white/80 to-[#F5D76E]/10 mb-8 mx-auto max-w-3xl transform hover:scale-[1.02] transition-transform shadow-lg shadow-[#D4AF37]/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <Lock className="w-6 h-6 text-[#B8952E]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">Adventure Locked</h3>
                  <p className="text-gray-600 text-sm">Complete your payment to unlock all levels & AI mentors.</p>
                </div>
              </div>
              <Link
                href="/student/dashboard"
                className="glass-button px-8 py-3 flex-shrink-0 whitespace-nowrap shadow-md shadow-[#D4AF37]/20"
              >
                Unlock Full Access
              </Link>
            </div>
          </div>
        )}

        {/* --- THE ADVENTURE MAP --- */}
        <div className="relative py-10 w-full mt-8">
          
          {/* Vertical Path Line */}
          {sequencedModules.length > 0 && <div className="adventure-path-line"></div>}

          {/* Empty State */}
          {sequencedModules.length === 0 && (
            <div className="card text-center py-16 shadow-xl max-w-2xl mx-auto">
              <div className="text-6xl mb-4 animate-bounce">🗺️</div>
              <h3 className="font-bold text-2xl mb-2 text-gray-800">Map Not Found</h3>
              <p className="text-gray-500 mb-6">
                Your journey hasn't been charted yet. Check back soon for new levels!
              </p>
            </div>
          )}

          {/* Zones Render */}
          {['beginner', 'intermediate', 'advanced'].map((zoneKey) => {
            const zoneModules = groupedModules[zoneKey];
            if (zoneModules.length === 0) return null;

            // Determine zone aesthetics
            const zoneTitles = {
              beginner: "🌱 Beginner Forest",
              intermediate: "🌿 Intermediate Valley",
              advanced: "🌳 Advanced Summit"
            };
            
            const zoneColors = {
              beginner: "text-green-600",
              intermediate: "text-[#B8952E]",
              advanced: "text-red-600"
            };

            return (
              <div key={zoneKey} className="mb-16 w-full">
                
                {/* Zone Header */}
                <div className="zone-header-banner">
                  <div className="zone-header-content">
                    <span className={`text-xl ${zoneColors[zoneKey]}`}>{zoneTitles[zoneKey].split(' ')[0]}</span>
                    <span>{zoneTitles[zoneKey].split(' ').slice(1).join(' ')}</span>
                  </div>
                </div>

                {/* Modules in this zone */}
                <div className="flex flex-col w-full relative">
                  {zoneModules.map((module) => {
                    const globalLevelNumber = sequencedModules.findIndex(m => m._id === module._id) + 1;
                    const completionPct = module.userProgress?.completionPercentage || 0;
                    const isCompleted = completionPct >= 100;
                    const isLocked = !isPaid;
                    const isActive = completionPct > 0 && completionPct < 100;
                    // Auto-activate level 1 if paid and 0%
                    const isLevel1AndPaid = globalLevelNumber === 1 && isPaid && completionPct === 0;
                    const isPlayable = isActive || isLevel1AndPaid || (isCompleted && isPaid); // For simplicity, let them replay completed if paid

                    const stars = getStars(completionPct);

                    return (
                      <div key={module._id} className="level-node-container w-full">
                        
                        {/* Dot on the central line */}
                        <div className="path-connector-dot hidden md:block"></div>

                        {/* The Level Card */}
                        <div className="level-node-content w-full md:w-[45%]">
                          <div className={`card level-card p-0 h-full ${
                            isCompleted ? 'level-completed' : 
                            (isActive || isLevel1AndPaid) && !isLocked ? 'level-active' : 
                            isLocked ? 'level-locked' : 'bg-white/80 border-white/60 shadow-md'
                          }`}>
                            
                            {/* Inner Padding Container */}
                            <div className="p-5 sm:p-6 h-full flex flex-col">
                              
                              <div className="flex justify-between items-start mb-4">
                                {/* Level Badge */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${
                                  isCompleted ? 'bg-gradient-to-br from-[#F5D76E] to-[#D4AF37] text-white' :
                                  isLocked ? 'bg-gray-200 text-gray-400' :
                                  'bg-gray-900 text-white'
                                }`}>
                                  L{globalLevelNumber}
                                </div>
                                
                                {/* Status Icons / Stars */}
                                <div className="flex flex-col items-end">
                                  {isLocked ? (
                                    <Lock className="w-6 h-6 text-gray-400" />
                                  ) : (
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3].map((star) => (
                                        <Star 
                                          key={star} 
                                          className={`w-5 h-5 ${star <= stars ? 'fill-[#D4AF37] text-[#D4AF37] star-icon star-filled star-' + star : 'text-gray-200'}`} 
                                        />
                                      ))}
                                    </div>
                                  )}
                                  {isCompleted && (
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#D4AF37] mt-1">Completed</span>
                                  )}
                                </div>
                              </div>

                              {/* Title & Desc */}
                              <div className="flex-1">
                                <h3 className={`font-bold text-lg leading-tight mb-2 ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                                  {module.title}
                                </h3>
                                <p className={`text-sm line-clamp-2 ${isLocked ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {module.description}
                                </p>
                              </div>

                              {/* Gamified Stats Footer */}
                              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
                                  <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                                    <BookOpen className="w-3.5 h-3.5" />
                                    {module.chapters?.length || 0} Ch.
                                  </span>
                                  <span className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md">
                                    <Clock className="w-3.5 h-3.5" />
                                    {module.estimatedCompletionTime}m
                                  </span>
                                  {module.aiInteractionEnabled && !isLocked && (
                                    <span className="flex items-center gap-1 text-[#B8952E]">
                                      <Brain className="w-3.5 h-3.5" /> AI
                                    </span>
                                  )}
                                </div>

                                {/* Radial Progress or Action Button */}
                                <div>
                                  {isLocked ? (
                                    <div className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                      <Lock className="w-3 h-3" /> Locked
                                    </div>
                                  ) : (
                                    <Link
                                      href={`/student/modules/${module._id}`}
                                      className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-transform hover:scale-105 ${
                                        isCompleted ? 'bg-white text-[#B8952E] border border-[#D4AF37]/30 shadow-sm' :
                                        isActive || isLevel1AndPaid ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white shadow-md shadow-[#D4AF37]/30' :
                                        'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                      }`}
                                    >
                                      {isCompleted ? (
                                        <>Replay <Play className="w-3 h-3" /></>
                                      ) : isActive ? (
                                        <>Resume <Play className="w-3 h-3" /></>
                                      ) : (
                                        <>Play <Play className="w-3 h-3" /></>
                                      )}
                                    </Link>
                                  )}
                                </div>
                              </div>

                            </div>
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

