'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/api';
import { isStudent } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, User, School, MapPin, Globe2, Trophy } from 'lucide-react';

export default function StudentProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await auth.getProfile();
        setProfile(data);
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
    <div className="min-h-screen bg-gradient-white-light">
      {/* Header */}
      <div className="bg-white border-b border-neutral-border">
        <div className="container-lg py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Your Profile</h1>
              <p className="text-neutral-medium">View your account and learning progress</p>
            </div>
            <button
              onClick={() => router.push('/student/dashboard')}
              className="text-primary-red hover:text-primary-darkRed transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container-lg py-8 space-y-6">
        {/* Top section: basic info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card md:col-span-2 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-red-gold flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-sm text-neutral-medium">{profile.email}</p>
              <p className="text-xs text-neutral-medium mt-1">
                Joined {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="card">
            <p className="text-sm text-neutral-medium mb-1">Payment Status</p>
            <p className="font-semibold">
              {profile.isPaid ? '✅ Paid' : '🔒 Not yet paid'}
            </p>
            {profile.paymentDate && (
              <p className="text-xs text-neutral-medium mt-1">
                Paid on {new Date(profile.paymentDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* School / location */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card flex items-center gap-3">
            <School className="w-5 h-5 text-primary-red" />
            <div>
              <p className="text-xs text-neutral-medium">School</p>
              <p className="font-semibold">{profile.school}</p>
              {profile.schoolSlug && (
                <p className="text-xs text-neutral-medium mt-1">
                  Cohort: <span className="font-mono">{profile.schoolSlug}</span>
                </p>
              )}
            </div>
          </div>
          <div className="card flex items-center gap-3">
            <MapPin className="w-5 h-5 text-accent-gold" />
            <div>
              <p className="text-xs text-neutral-medium">City</p>
              <p className="font-semibold">{profile.city}</p>
            </div>
          </div>
          <div className="card flex items-center gap-3">
            <Globe2 className="w-5 h-5 text-semantic-info" />
            <div>
              <p className="text-xs text-neutral-medium">Country</p>
              <p className="font-semibold">{profile.country}</p>
            </div>
          </div>
        </div>

        {/* Progress overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card">
            <p className="text-sm text-neutral-medium mb-1">Modules Started</p>
            <p className="text-2xl font-bold gradient-text">{modulesProgress.length}</p>
          </div>
          <div className="card">
            <p className="text-sm text-neutral-medium mb-1">Modules Completed</p>
            <p className="text-2xl font-bold gradient-text">{completedModules}</p>
          </div>
          <div className="card flex items-center gap-3">
            <Trophy className="w-6 h-6 text-accent-gold" />
            <div>
              <p className="text-sm text-neutral-medium mb-1">Idea Submission</p>
              {profile.ideaSubmission ? (
                <p className="font-semibold">Submitted</p>
              ) : (
                <p className="font-semibold">Not yet submitted</p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed modules list */}
        {modulesProgress.length > 0 && (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Module Progress</h3>
              <Link
                href="/student/modules"
                className="text-primary-red hover:text-primary-darkRed text-sm transition"
              >
                Go to Modules
              </Link>
            </div>
            <div className="space-y-3">
              {modulesProgress.map((mp) => (
                <div
                  key={mp.moduleId?._id || mp.moduleId}
                  className="flex justify-between items-center border border-neutral-border rounded-lg px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      {mp.moduleId?.title || 'Module'}
                    </p>
                    <p className="text-xs text-neutral-medium">
                      {mp.completionPercentage || 0}% complete
                    </p>
                  </div>
                  <div className="w-32 bg-neutral-light h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-gradient-red-gold rounded-full"
                      style={{ width: `${mp.completionPercentage || 0}%` }}
                    />
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


