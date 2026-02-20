'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, achievements } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, User, School, MapPin, Globe2, Trophy, Palette, Save, Award, Sparkles } from 'lucide-react';

const themes = [
  { id: 'default', name: 'Default', gradient: 'from-gray-400 to-gray-600' },
  { id: 'ocean', name: 'Ocean', gradient: 'from-blue-400 to-cyan-500' },
  { id: 'sunset', name: 'Sunset', gradient: 'from-orange-400 to-pink-500' },
  { id: 'forest', name: 'Forest', gradient: 'from-green-400 to-emerald-500' },
  { id: 'cosmic', name: 'Cosmic', gradient: 'from-purple-500 to-indigo-600' },
  { id: 'royal', name: 'Royal', gradient: 'from-yellow-400 to-orange-500' },
];

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [achievementsData, setAchievementsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }

    loadProfile();
  }, [router]);

  const loadProfile = async () => {
    try {
      const [profileData, achievementsRes] = await Promise.all([
        auth.getProfile(),
        achievements.getAll().catch(() => ({ achievements: [], stats: { total: 0 } })),
      ]);

      setProfile(profileData);
      setAchievementsData(achievementsRes);
      setSelectedTheme(profileData?.profileTheme || 'default');
      setDisplayName(profileData?.displayName || '');
      setBio(profileData?.bio || '');
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await auth.updateProfile({
        profileTheme: selectedTheme,
        displayName: displayName || undefined,
        bio: bio || undefined,
      });
      await loadProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your profile..." />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Unable to load profile.</p>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white hover:shadow-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const modulesProgress = profile.modulesProgress || [];
  const completedModules = modulesProgress.filter(mp => mp.completionPercentage >= 100).length;
  const selectedThemeData = themes.find(t => t.id === selectedTheme) || themes[0];

  return (
    <div className="min-h-screen relative" style={{ zIndex: 1 }}>
      <div className="container-lg py-8 space-y-6">
        {/* Profile Header Card */}
        <div className="card">
          <div className="flex items-center gap-6">
            {profile.profilePicture ? (
              <img
                src={profile.profilePicture}
                alt={profile.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
              />
            ) : (
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${selectedThemeData.gradient} flex items-center justify-center shadow-lg`}>
                <User className="w-12 h-12 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{profile.displayName || profile.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{profile.email}</p>
              {bio && <p className="text-sm text-gray-700 italic">{bio}</p>}
              <p className="text-xs text-gray-500 mt-2">
                Joined {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="glass-subtle px-4 py-2 rounded-xl inline-block mb-2">
                <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                <p className="font-semibold text-gray-800">
                  {profile.isPaid ? '✅ Paid' : '🔒 Not yet paid'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-sm text-gray-600 mb-1">Modules Started</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {modulesProgress.length}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-600 mb-1">Modules Completed</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {completedModules}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-600 mb-1">Achievements</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {achievementsData?.stats?.total || 0}
            </p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-gray-600 mb-1">SSI Score</p>
            <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              {profile.ssiScore || 0}
            </p>
          </div>
        </div>

        {/* Profile Customization */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-gray-700" />
            <h3 className="font-bold text-xl text-gray-800">Profile Customization</h3>
          </div>

          {/* Theme Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Theme</label>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all ${selectedTheme === theme.id
                    ? 'border-gray-800 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className={`w-full h-16 rounded-lg bg-gradient-to-br ${theme.gradient} mb-2`}></div>
                  <p className="text-xs font-medium text-gray-700">{theme.name}</p>
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Display Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name (Optional)</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={profile.name}
              className="w-full glass-subtle border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Bio */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bio (Optional)</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              rows={3}
              maxLength={500}
              className="w-full glass-subtle border border-white/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">{bio.length}/500 characters</p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Achievements Section */}
        {achievementsData && achievementsData.achievements.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-yellow-500" />
              <h3 className="font-bold text-xl text-gray-800">Your Achievements</h3>
              <span className="glass-subtle px-3 py-1 rounded-full text-sm font-semibold text-gray-700">
                {achievementsData.stats.total}
              </span>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center glass-subtle p-3 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Common</p>
                <p className="text-xl font-bold text-gray-800">{achievementsData.stats.byRarity.common}</p>
              </div>
              <div className="text-center glass-subtle p-3 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Rare</p>
                <p className="text-xl font-bold text-blue-600">{achievementsData.stats.byRarity.rare}</p>
              </div>
              <div className="text-center glass-subtle p-3 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Epic</p>
                <p className="text-xl font-bold text-purple-600">{achievementsData.stats.byRarity.epic}</p>
              </div>
              <div className="text-center glass-subtle p-3 rounded-xl">
                <p className="text-xs text-gray-600 mb-1">Legendary</p>
                <p className="text-xl font-bold text-yellow-600">{achievementsData.stats.byRarity.legendary}</p>
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {achievementsData.achievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className={`glass-subtle p-4 rounded-xl border-2 transition-all hover:scale-105 ${achievement.rarity === 'legendary' ? 'border-yellow-400' :
                    achievement.rarity === 'epic' ? 'border-purple-400' :
                      achievement.rarity === 'rare' ? 'border-blue-400' :
                        'border-gray-200'
                    }`}
                >
                  <div className={`achievement-badge achievement-${achievement.rarity} mx-auto mb-3`}></div>
                  <h4 className="font-bold text-sm text-gray-800 mb-1 text-center">{achievement.title}</h4>
                  <p className="text-xs text-gray-600 text-center mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${achievement.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-700' :
                      achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-gray-500 text-center mt-2">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module Progress */}
        {modulesProgress.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-xl text-gray-800 mb-4">Module Progress</h3>
            <div className="space-y-4">
              {modulesProgress.map((mp) => (
                <div key={mp.moduleId?._id || mp.moduleId} className="glass-subtle p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-gray-800">
                      {mp.moduleId?.title || 'Module'}
                    </p>
                    <span className="text-sm font-semibold text-gray-700">
                      {mp.completionPercentage || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all"
                      style={{ width: `${mp.completionPercentage || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card flex items-center gap-3">
            <School className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-xs text-gray-600">School</p>
              <p className="font-semibold text-gray-800">{profile.school}</p>
            </div>
          </div>
          <div className="card flex items-center gap-3">
            <MapPin className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-xs text-gray-600">City</p>
              <p className="font-semibold text-gray-800">{profile.city}</p>
            </div>
          </div>
          <div className="card flex items-center gap-3">
            <Globe2 className="w-5 h-5 text-yellow-500" />
            <div>
              <p className="text-xs text-gray-600">Country</p>
              <p className="font-semibold text-gray-800">{profile.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
