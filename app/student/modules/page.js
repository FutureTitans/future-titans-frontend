'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { modules, payment } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { BookOpen, Clock, Users, Star, ArrowRight, Lock, Play, CheckCircle } from 'lucide-react';
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
    if (filter === 'beginner') return module.difficulty === 'beginner';
    if (filter === 'intermediate') return module.difficulty === 'intermediate';
    if (filter === 'advanced') return module.difficulty === 'advanced';
    return true;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-semantic-success';
      case 'intermediate': return 'text-accent-gold';
      case 'advanced': return 'text-semantic-error';
      default: return 'text-neutral-medium';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '🌱';
      case 'intermediate': return '🌿';
      case 'advanced': return '🌳';
      default: return '📚';
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading modules..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-white-light">
      {/* Header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="container-lg py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Learning Modules</h1>
              <p className="text-neutral-medium">Master entrepreneurship with AI-powered learning</p>
            </div>
            <Link href="/student/dashboard" className="text-primary-red hover:text-primary-darkRed transition">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="container-lg py-8">
        {/* Payment Check */}
        {!paymentStatus?.isPaid && (
          <div className="card mb-8 border-l-4 border-l-semantic-error bg-semantic-error bg-opacity-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-semantic-error mb-2">🔒 Access Restricted</h3>
                <p className="text-neutral-dark">Complete payment to unlock all learning modules</p>
              </div>
              <Link
                href="/student/dashboard"
                className="bg-semantic-error text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-semibold"
              >
                Complete Payment
              </Link>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex flex-wrap gap-4">
            <h3 className="font-semibold text-neutral-dark mr-4">Filter by difficulty:</h3>
            {[
              { key: 'all', label: 'All Modules', icon: '📚' },
              { key: 'beginner', label: 'Beginner', icon: '🌱' },
              { key: 'intermediate', label: 'Intermediate', icon: '🌿' },
              { key: 'advanced', label: 'Advanced', icon: '🌳' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  filter === item.key
                    ? 'bg-primary-red text-white'
                    : 'bg-neutral-light text-neutral-dark hover:bg-neutral-border'
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
            <div key={module._id} className="card hover:shadow-xl transition-all group">
              {/* Module Header */}
              <div className="mb-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getDifficultyIcon(module.difficulty)}</span>
                    <span className={`badge capitalize ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </span>
                  </div>
                  {paymentStatus?.isPaid ? (
                    <CheckCircle className="w-5 h-5 text-semantic-success" />
                  ) : (
                    <Lock className="w-5 h-5 text-neutral-medium" />
                  )}
                </div>
                
                <h3 className="font-bold text-xl mb-2 group-hover:text-primary-red transition">
                  {module.title}
                </h3>
                <p className="text-neutral-medium text-sm line-clamp-3">
                  {module.description}
                </p>
              </div>

              {/* Module Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-neutral-medium" />
                  <span>{module.estimatedCompletionTime} min</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-neutral-medium" />
                  <span>{module.chapters?.length || 0} chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-neutral-medium" />
                  <span>Interactive</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent-gold" />
                  <span>AI Powered</span>
                </div>
              </div>

              {/* Progress Bar (if started) */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-medium">Progress</span>
                  <span className="text-sm font-semibold">0%</span>
                </div>
                <div className="w-full bg-neutral-light rounded-full h-2">
                  <div className="bg-gradient-red-gold h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              {/* Action Button */}
              {paymentStatus?.isPaid ? (
                <Link
                  href={`/student/modules/${module._id}`}
                  className="w-full bg-primary-red text-white py-3 px-4 rounded-lg hover:bg-primary-darkRed transition font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg"
                >
                  <Play className="w-4 h-4" />
                  Start Learning
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-neutral-light text-neutral-medium py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Locked
                </button>
              )}

              {/* AI Feature Badge */}
              {module.aiInteractionEnabled && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-accent-gold">
                  <span className="w-2 h-2 bg-accent-gold rounded-full animate-pulse"></span>
                  AI Co-Founder Available
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="font-bold text-xl mb-2">No modules found</h3>
            <p className="text-neutral-medium mb-6">
              {filter === 'all' 
                ? 'No modules are available yet. Check back soon!' 
                : `No ${filter} modules available. Try a different filter.`
              }
            </p>
            <button
              onClick={() => setFilter('all')}
              className="bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-primary-darkRed transition"
            >
              Show All Modules
            </button>
          </div>
        )}

        {/* Learning Path Info */}
        {paymentStatus?.isPaid && modulesList.length > 0 && (
          <div className="card mt-8 bg-gradient-red-gold text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xl mb-2">🎯 Your Learning Path</h3>
                <p className="opacity-90">
                  Complete modules in order to maximize your learning experience and SSI score
                </p>
              </div>
              <ArrowRight className="w-8 h-8 opacity-75" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
