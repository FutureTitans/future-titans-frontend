'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { modules, payment } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Clock, Users, Star, Lock, Play, CheckCircle, ChevronDown, Trophy, Map } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentModulesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

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

  const scrollToZone = (difficulty) => {
    const element = document.getElementById(`zone-${difficulty}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your adventure..." />;
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
        
        {/* Header & Map Legend */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-white/60 shadow-sm sticky top-4 z-50">
          <div>
            <h1 className="text-3xl md:text-5xl font-light text-gray-900 tracking-tight flex items-center gap-3">
              <Map className="w-8 h-8 md:w-10 md:h-10 text-[#D4AF37]" />
              Journey Map
            </h1>
            <p className="text-gray-600 mt-2 font-medium">Choose your level and start learning.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {difficultyOrder.map(diff => {
              if (groupedModules[diff].length === 0) return null;
              const info = getDifficultyTitle(diff);
              return (
                <button
                  key={diff}
                  onClick={() => scrollToZone(diff)}
                  className="px-4 py-2 bg-white rounded-full text-sm font-bold shadow-sm border border-gray-100 flex items-center gap-2 hover:scale-105 hover:shadow-md transition-all text-gray-700"
                >
                  <span>{info.icon}</span>
                  <span className="capitalize">{diff}</span>
                </button>
              );
            })}
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
            <div className="text-6xl mb-4 animate-bounce">🗺️</div>
            <h3 className="font-bold text-2xl mb-2 text-gray-800">The Map is Empty</h3>
            <p className="text-gray-500 mb-6 font-medium">
              New regions are currently being built. Check back soon for your first quest!
            </p>
          </div>
        )}

        {/* Adventure Map Progression */}
        <div className="relative py-10 w-full max-w-4xl mx-auto" ref={mapRef}>
          
          {difficultyOrder.map((difficulty) => {
            const modulesInZone = groupedModules[difficulty];
            if (modulesInZone.length === 0) return null;
            const zoneInfo = getDifficultyTitle(difficulty);

            return (
              <div key={difficulty} id={`zone-${difficulty}`} className="mb-24 relative">
                
                {/* Zone Header */}
                <div className="sticky top-[120px] z-20 flex justify-center mb-16">
                  <div className={`glass-strong px-8 py-3 rounded-full shadow-lg shadow-black/5 flex items-center gap-3 border-b-4 border-b-${zoneInfo.color.split(' ')[0].replace('from-', '')}`}>
                    <span className="text-2xl">{zoneInfo.icon}</span>
                    <h2 className="text-xl font-black text-gray-800 tracking-wide uppercase">
                      {zoneInfo.title}
                    </h2>
                  </div>
                </div>

                {/* Modules in Zone */}
                <div className="space-y-16 sm:space-y-24 relative">
                  {/* The Golden Path Line Behind Nodes */}
                  <div className="absolute top-10 bottom-10 left-1/2 -translate-x-1/2 w-3 sm:w-4 bg-gradient-to-b from-[#F5D76E]/40 to-[#D4AF37]/40 rounded-full z-0 pointer-events-none"></div>

                  {modulesInZone.map((module, index) => {
                    const isEven = module.levelNum % 2 === 0;
                    const completion = module.userProgress?.completionPercentage || 0;
                    const stars = getStars(completion);
                    const isCompleted = completion >= 100;
                    const isActive = module.levelNum === currentActiveLevel;
                    const isLocked = !paymentStatus?.isPaid;

                    // Alternating layout logic
                    const alignmentClass = isEven 
                      ? "flex-row-reverse sm:flex-row-reverse pl-12 pr-4 sm:pr-[50%] sm:pl-0 sm:justify-end" 
                      : "flex-row pl-12 pr-4 sm:pl-[50%] sm:pr-0 sm:justify-start";

                    return (
                      <div key={module._id} className={`relative z-10 flex w-full items-center ${alignmentClass}`}>
                        
                        {/* Connecting Node/Dot on the path */}
                        <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center bg-white z-20">
                          {isCompleted ? (
                            <div className="w-full h-full bg-[#D4AF37] rounded-full flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                          ) : isActive ? (
                            <div className="w-full h-full bg-[#F5D76E] rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(212,175,55,0.6)]">
                              <div className="w-4 h-4 bg-[#D4AF37] rounded-full"></div>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center">
                              {isLocked ? <Lock className="w-4 h-4 text-gray-400" /> : <div className="w-3 h-3 bg-gray-400 rounded-full"></div>}
                            </div>
                          )}
                        </div>

                        {/* Distancing from the center line */}
                        <div className={`w-full sm:w-[90%] ${isEven ? 'sm:pr-10' : 'sm:pl-10'}`}>
                          
                          {/* Module Card */}
                          <div className={`card p-0 overflow-hidden transform transition-all duration-300 ${isActive ? 'scale-105 shadow-xl shadow-[#D4AF37]/20 border-[#D4AF37]' : 'hover:scale-[1.02]'} ${isLocked ? 'grayscale-[0.5] opacity-80' : ''}`}>
                            
                            {/* Card Content Row */}
                            <div className="flex flex-col sm:flex-row h-full">
                              
                              {/* Left Thumbnail Area */}
                              <div className="w-full sm:w-1/3 h-40 sm:h-auto bg-gray-100 relative flex-shrink-0">
                                {module.coverImage ? (
                                  <img src={module.coverImage} alt={module.title} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-[#D4AF37]/20 to-[#F5D76E]/20 flex items-center justify-center">
                                    <BookOpen className="w-12 h-12 text-[#D4AF37]/50" />
                                  </div>
                                )}
                                
                                {/* Level Badge Overflowing */}
                                <div className="absolute -bottom-4 -right-4 sm:-right-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 bg-gradient-to-br from-[#D4AF37] to-[#B8952E] text-white w-16 h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg transform rotate-3 border-2 border-white z-10">
                                  <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Level</span>
                                  <span className="text-2xl font-black leading-none">{module.levelNum}</span>
                                </div>
                              </div>

                              {/* Right Content Area */}
                              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                                <div>
                                  {/* Stars Rating */}
                                  <div className="flex gap-1 mb-2">
                                    {[1, 2, 3].map(star => (
                                      <Star key={star} className={`w-5 h-5 ${star <= stars ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200 fill-gray-200'} transition-all`} />
                                    ))}
                                  </div>

                                  <h3 className="font-bold text-xl text-gray-900 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                                    {module.title}
                                  </h3>
                                  
                                  <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-[#D4AF37]" /> {module.estimatedCompletionTime}m
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="w-3 h-3 text-[#D4AF37]" /> {module.chapters?.length || 0} Ch
                                    </div>
                                    {module.aiInteractionEnabled && (
                                      <div className="flex items-center gap-1 text-[#B8952E]">
                                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></div> AI
                                      </div>
                                    )}
                                  </div>
                                  
                                  <p className="text-gray-500 text-sm line-clamp-2 mt-3 mb-4">
                                    {module.description}
                                  </p>
                                </div>

                                {/* Progress & Action row */}
                                <div className="mt-auto">
                                  {isLocked ? (
                                    <button disabled className="w-full bg-gray-100 text-gray-400 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-semibold">
                                      <Lock className="w-4 h-4" /> Locked
                                    </button>
                                  ) : (
                                    <div className="flex items-center gap-4">
                                      <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-[10px] font-bold text-gray-400 uppercase leading-none">Progress</span>
                                          <span className="text-[10px] font-bold text-gray-700 leading-none">{completion}%</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                          <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] h-full rounded-full" style={{ width: `${completion}%` }}></div>
                                        </div>
                                      </div>
                                      
                                      <Link
                                        href={`/student/modules/${module._id}`}
                                        className={`shrink-0 h-10 px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                                          isCompleted 
                                            ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-[#D4AF37] hover:text-[#D4AF37]' 
                                            : 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white shadow-md shadow-[#D4AF37]/30 hover:scale-105'
                                        }`}
                                      >
                                        {isCompleted ? 'Review' : completion > 0 ? 'Resume' : 'Start'}
                                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                                      </Link>
                                    </div>
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
          
          {/* End of Journey Marker */}
          {sortedAllModules.length > 0 && (
            <div className="flex flex-col items-center justify-center mt-8 relative z-10 w-full text-center">
              <div className="w-16 h-16 rounded-full bg-white border-4 border-[#D4AF37] shadow-xl flex items-center justify-center z-20 mb-4">
                <Trophy className="w-8 h-8 text-[#D4AF37]" />
              </div>
              <h3 className="text-xl font-black text-gray-900 tracking-wide">To Be Continued...</h3>
              <p className="text-gray-500 font-medium text-sm mt-1">More modules are being forged by the masters.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

