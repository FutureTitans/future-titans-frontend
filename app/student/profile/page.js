'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { upload } from '@vercel/blob/client';
import { auth, achievements } from '@/lib/api';
import { isStudent, getUser, setUser as persistUser } from '@/lib/auth';
import { useAuthStore } from '@/store/useAuthStore';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, User, School, MapPin, Globe2, Trophy, Save, Award, Sparkles } from 'lucide-react';



export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [achievementsData, setAchievementsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

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
      setEditName(profileData?.name || '');
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
      const submitData = {
        name: editName || undefined,
        bio: bio || undefined,
      };

      if (profilePicture instanceof File) {
        const uploadResult = await upload(profilePicture.name, profilePicture, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        submitData.profilePicture = uploadResult.url;
      }

      await auth.updateProfile(submitData);
      // Sync name to localStorage and auth store so navbar updates immediately
      const currentUser = getUser();
      if (currentUser && editName) {
        const updatedUser = { ...currentUser, name: editName };
        persistUser(updatedUser);
        useAuthStore.getState().setUser(updatedUser);
      }
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
          <p className="text-gray-500">Unable to load profile.</p>
          <button
            onClick={() => router.push('/student/dashboard')}
            className="mt-4 glass-button px-6 py-3"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const modulesProgress = profile.modulesProgress || [];
  const completedModules = modulesProgress.filter(mp => mp.completionPercentage >= 100).length;


  return (
    <div className="min-h-[calc(100dvh-4rem)] relative" style={{ zIndex: 1 }}>
      <div className="container-lg py-5 sm:py-8 space-y-4 sm:space-y-6 pb-24">
        {/* Profile Header Card */}
        <div className="card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
            <div className="relative group flex-shrink-0">
              {profilePicturePreview || profile.profilePicture ? (
                <img
                  src={profilePicturePreview || profile.profilePicture}
                  alt={profile.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:opacity-80 transition"
                />
              ) : (
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center shadow-lg group-hover:opacity-80 transition`}>
                  <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">{profile.name}</h2>
              {profile.studentId && (
                <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37]/10 to-[#F5D76E]/10 border border-[#D4AF37]/30 rounded-lg px-3 py-1 mb-2">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Student ID</span>
                  <span className="text-sm font-mono font-bold text-[#B8952E] tracking-widest">{profile.studentId}</span>
                </div>
              )}
              <p className="text-sm text-gray-500 mb-2">{profile.email}</p>
              {bio && <p className="text-sm text-gray-600 italic">{bio}</p>}
              <p className="text-xs text-gray-400 mt-2">
                Joined {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="glass-subtle px-4 py-2 rounded-xl inline-block">
                <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                <p className="font-semibold text-gray-800">
                  {profile.isPaid ? '✅ Paid' : '🔒 Not yet paid'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Modules Started', value: modulesProgress.length },
            { label: 'Modules Completed', value: completedModules },
            { label: 'Achievements', value: achievementsData?.stats?.total || 0 },
            { label: 'SSI Score', value: profile.ssiScore || 0 },
          ].map((stat, idx) => (
            <div key={idx} className="card text-center py-5">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8952E]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Edit Profile */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-bold text-xl text-gray-800">Edit Profile</h3>
          </div>

          {/* Name */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Your full name"
              className="glass-input"
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Profile Picture (Optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    e.target.value = '';
                    return;
                  }
                  setProfilePicture(file);
                  setProfilePicturePreview(URL.createObjectURL(file));
                }
              }}
              className="glass-input"
            />
            <p className="text-xs text-gray-400 mt-1.5">Leave empty to keep your current picture. JPG, JPEG, PNG, or WebP. Max 5MB.</p>
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
              className="glass-input resize-none"
            />
            <p className="text-xs text-gray-400 mt-1.5">{bio.length}/500 characters</p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="glass-button px-6 py-3 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Achievements Section */}
        {achievementsData && achievementsData.achievements.length > 0 && (
          <div className="card">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-bold text-xl text-gray-800">Your Achievements</h3>
              <span className="glass-subtle px-3 py-1 rounded-full text-sm font-semibold text-gray-600">
                {achievementsData.stats.total}
              </span>
            </div>

            {/* Achievement Stats */}
            <div className="grid grid-cols-4 gap-3 sm:gap-4 mb-6">
              {[
                { label: 'Common', value: achievementsData.stats.byRarity.common, color: 'text-gray-700' },
                { label: 'Rare', value: achievementsData.stats.byRarity.rare, color: 'text-blue-600' },
                { label: 'Epic', value: achievementsData.stats.byRarity.epic, color: 'text-purple-600' },
                { label: 'Legendary', value: achievementsData.stats.byRarity.legendary, color: 'text-[#D4AF37]' },
              ].map((item, idx) => (
                <div key={idx} className="text-center glass-subtle p-3 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {achievementsData.achievements.map((achievement) => (
                <div
                  key={achievement._id}
                  className={`glass-subtle p-4 rounded-xl border-2 transition-all hover:scale-105 ${achievement.rarity === 'legendary' ? 'border-[#D4AF37]/40' :
                    achievement.rarity === 'epic' ? 'border-purple-300' :
                      achievement.rarity === 'rare' ? 'border-blue-300' :
                        'border-gray-200/50'
                    }`}
                >
                  <div className={`achievement-badge achievement-${achievement.rarity} mx-auto mb-3`}></div>
                  <h4 className="font-bold text-sm text-gray-800 mb-1 text-center">{achievement.title}</h4>
                  <p className="text-xs text-gray-500 text-center mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${achievement.rarity === 'legendary' ? 'bg-[#D4AF37]/10 text-[#B8952E]' :
                      achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                        achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                      }`}>
                      {achievement.rarity}
                    </span>
                  </div>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-gray-400 text-center mt-2">
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
                    <span className="text-sm font-semibold text-gray-600">
                      {mp.completionPercentage || 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full transition-all"
                      style={{ width: `${mp.completionPercentage || 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Location Info */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="card flex items-center gap-3 py-5">
            <School className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <p className="text-xs text-gray-500">School</p>
              <p className="font-semibold text-gray-800">{profile.school}</p>
            </div>
          </div>
          <div className="card flex items-center gap-3 py-5">
            <MapPin className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <p className="text-xs text-gray-500">City</p>
              <p className="font-semibold text-gray-800">{profile.city}</p>
            </div>
          </div>
          <div className="card flex items-center gap-3 py-5">
            <Globe2 className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <p className="text-xs text-gray-500">Country</p>
              <p className="font-semibold text-gray-800">{profile.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
