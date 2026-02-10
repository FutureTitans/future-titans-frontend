'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, achievements } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, User, School, MapPin, Globe2, Trophy, Award } from 'lucide-react';

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [achievementsData, setAchievementsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const [profileData, achievementsRes] = await Promise.all([
          auth.getProfile(),
          achievements.getAll().catch(() => ({ achievements: [], stats: { total: 0 } })),
        ]);
        setProfile(profileData);
        setAchievementsData(achievementsRes);
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-medium">Unable to load profile.</p>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="mt-4 px-4 py-2 rounded-lg bg-primary-red text-white hover:bg-primary-darkRed transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const modulesProgress = profile.modulesProgress || [];
  const completedModules = modulesProgress.filter(
    (m) => (m.completionPercentage || 0) >= 100
  ).length;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-200/30 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Your Profile</h1>
            <p className="text-lg text-gray-600">Manage your account and view your progress</p>
          </div>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="px-5 py-2.5 rounded-full bg-white/50 hover:bg-white/80 border border-gray-200 text-gray-700 font-medium transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Top Profile Card */}
        <div className="glass-panel p-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-amber-500 p-1 shadow-xl">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h2>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-lg border border-white/50">
                  <School className="w-4 h-4 text-purple-600" />
                  {profile.school}
                </div>
                {profile.schoolSlug && (
                  <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-lg border border-white/50">
                    <span className="font-mono text-xs font-bold text-amber-600">#{profile.schoolSlug}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-lg border border-white/50">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  {profile.city}, {profile.country}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className={`px-4 py-2 rounded-xl text-sm font-semibold border ${profile.isPaid ? 'bg-green-50 border-green-200 text-green-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                  {profile.isPaid ? '✅ Premium Member' : '🔒 Free Account'}
                </div>
                {profile.ideaSubmission && (
                  <div className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-50 border border-purple-200 text-purple-700">
                    🚀 Idea Submitted
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Achievements</p>
              <p className="text-2xl font-bold text-gray-900">{achievementsData?.stats?.total || 0}</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Modules Started</p>
              <p className="text-2xl font-bold text-gray-900">{modulesProgress.length}</p>
            </div>
          </div>

          <div className="glass-panel p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Modules Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedModules}</p>
            </div>
          </div>
        </div>

        {/* Detailed Achievements */}
        {achievementsData && achievementsData.achievements.length > 0 && (
          <div className="glass-panel p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Earned Badges
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {achievementsData.achievements.map((achievement) => (
                <div key={achievement._id} className="text-center group">
                  <div className={`aspect-square rounded-2xl mb-3 flex items-center justify-center transition-transform group-hover:scale-105 border-2 ${achievement.rarity === 'legendary' ? 'bg-amber-50 border-amber-200' :
                    achievement.rarity === 'epic' ? 'bg-purple-50 border-purple-200' :
                      'bg-white border-gray-100'
                    }`}>
                    <div className={`achievement-badge achievement-${achievement.rarity} w-12 h-12`}></div>
                  </div>
                  <p className="font-semibold text-sm text-gray-900 truncate">{achievement.title}</p>
                  <p className="text-xs text-gray-500 capitalize">{achievement.rarity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modules Progress List */}
        {modulesProgress.length > 0 && (
          <div className="glass-panel p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Learning Progress</h3>
              <Link href="/student/modules" className="text-sm font-semibold text-primary-red hover:underline">
                Continue Learning
              </Link>
            </div>

            <div className="space-y-4">
              {modulesProgress.map((mp) => (
                <div key={mp.moduleId?._id || mp.moduleId} className="bg-white/40 border border-white/50 rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold text-gray-900">{mp.moduleId?.title || 'Module'}</span>
                      <span className="text-sm text-gray-500">{mp.completionPercentage || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-primary-red rounded-full"
                        style={{ width: `${mp.completionPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


