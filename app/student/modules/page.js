'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { modules, payment } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Clock, Users, Star, ArrowLeft, Lock, Play, CheckCircle, Filter } from 'lucide-react';
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

  const filteredModules = modulesList.filter(module => {
    if (filter === 'all') return true;
    return module.difficulty === filter;
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
      <div className="container-lg py-8 space-y-6">
        {/* Payment Check */}
        {!paymentStatus?.isPaid && (
          <div className="glass-panel border-l-4 border-l-[#D4AF37] p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#B8952E] mb-1">🔒 Access Restricted</h3>
                <p className="text-gray-600 text-sm">Complete payment to unlock all learning modules</p>
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

        {/* Filters */}
        <div className="glass-panel p-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-600 mr-2 text-sm">Filter:</span>
            {[
              { key: 'all', label: 'All Modules', icon: '📚' },
              { key: 'beginner', label: 'Beginner', icon: '🌱' },
              { key: 'intermediate', label: 'Intermediate', icon: '🌿' },
              { key: 'advanced', label: 'Advanced', icon: '🌳' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-4 py-2 rounded-full transition-all flex items-center gap-2 text-sm font-medium ${filter === item.key
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white shadow-md shadow-[#D4AF37]/15'
                  : 'bg-white/50 text-gray-600 hover:bg-white/70 border border-white/40'
                  }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <div key={module._id} className="card group cursor-pointer overflow-hidden p-0">
              {/* Cover Image */}
              {module.coverImage ? (
                <div className="w-full h-48 bg-gray-100 relative">
                  <img src={module.coverImage} alt={module.title} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                    <span className={`text-sm bg-gradient-to-r ${getDifficultyColor(module.difficulty)} bg-clip-text text-transparent font-bold capitalize`}>
                      {module.difficulty}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="w-full h-32 bg-gradient-to-br from-[#D4AF37]/5 to-[#F5D76E]/5 flex items-center justify-center border-b border-white/30">
                  <BookOpen className="w-12 h-12 text-[#D4AF37]/30" />
                </div>
              )}

              <div className="p-6">
                {/* Module Header */}
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {module.mentorProfilePicture && (
                        <div className="flex items-center gap-2">
                          <img
                            src={module.mentorProfilePicture}
                            alt="Mentor"
                            className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-md"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                          <span className="text-xs text-gray-400 font-medium">Instructor</span>
                        </div>
                      )}
                      {!module.coverImage && (
                        <span className={`text-xl bg-gradient-to-r ${getDifficultyColor(module.difficulty)} bg-clip-text text-transparent font-bold capitalize`}>
                          {module.difficulty}
                        </span>
                      )}
                    </div>
                    {paymentStatus?.isPaid ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-300" />
                    )}
                  </div>

                  <h3 className="font-bold text-xl mb-2 text-gray-800 group-hover:text-[#D4AF37] transition line-clamp-2 mt-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {module.description}
                  </p>
                </div>

                {/* Module Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{module.estimatedCompletionTime} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <BookOpen className="w-4 h-4" />
                    <span>{module.chapters?.length || 0} chapters</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>Interactive</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#D4AF37]">
                    <Star className="w-4 h-4" />
                    <span>AI Powered</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">Progress</span>
                    <span className="text-xs font-semibold text-gray-700">0%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] h-2 rounded-full transition-all" style={{ width: '0%' }}></div>
                  </div>
                </div>

                {/* Action Button */}
                {paymentStatus?.isPaid ? (
                  <Link
                    href={`/student/modules/${module._id}`}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white py-3 px-4 rounded-2xl hover:shadow-lg hover:shadow-[#D4AF37]/20 transition font-semibold flex items-center justify-center gap-2 group-hover:scale-[1.02]"
                  >
                    <Play className="w-4 h-4" />
                    Start Learning
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full bg-white/50 text-gray-400 py-3 px-4 rounded-2xl cursor-not-allowed flex items-center justify-center gap-2 border border-white/40"
                  >
                    <Lock className="w-4 h-4" />
                    Locked
                  </button>
                )}

                {/* AI Feature Badge */}
                {module.aiInteractionEnabled && (
                  <div className="mt-3 flex items-center justify-center gap-2 text-xs text-[#B8952E] bg-[#D4AF37]/8 py-2 rounded-xl">
                    <span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"></span>
                    ZUNOVA AI Available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="font-bold text-xl mb-2 text-gray-800">No modules found</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all'
                ? 'No modules are available yet. Check back soon!'
                : `No ${filter} modules available. Try a different filter.`
              }
            </p>
            <button
              onClick={() => setFilter('all')}
              className="glass-button px-6 py-3"
            >
              Show All Modules
            </button>
          </div>
        )}


      </div>
    </div>
  );
}
