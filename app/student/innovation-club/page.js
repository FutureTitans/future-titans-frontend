'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { innovationClub } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  Lightbulb,
  Users,
  Trophy,
  GraduationCap,
  BookOpen,
  ArrowRight,
  Zap,
  Lock,
  Crown,
} from 'lucide-react';

const sections = [
  {
    title: 'Expert Exposure',
    description: 'Connect with industry leaders through live sessions, masterclasses, and curated mentorship experiences.',
    href: '/student/innovation-club/experts',
    icon: Users,
    gradient: 'from-[#D4AF37]/10 to-[#F5D76E]/5',
  },
  {
    title: 'Hackathons',
    description: 'Compete in innovation challenges, build real solutions, and showcase your ideas on a national stage.',
    href: '/student/innovation-club/hackathons',
    icon: Trophy,
    gradient: 'from-[#1B3A2D]/5 to-[#D4AF37]/5',
  },
  {
    title: "Teachers' Training",
    description: 'Cohort-based programs designed to empower educators with innovation facilitation skills.',
    href: '/student/innovation-club/teachers',
    icon: GraduationCap,
    gradient: 'from-[#D4AF37]/5 to-[#1B3A2D]/5',
  },
  {
    title: 'Resource Library',
    description: 'Curated books, worksheets, templates, and videos to support every stage of your innovation journey.',
    href: '/student/innovation-club/resources',
    icon: BookOpen,
    gradient: 'from-[#F5D76E]/5 to-[#D4AF37]/10',
  },
];

export default function InnovationClubHub() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ sessions: 0, hackathons: 0, resources: 0 });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      const [sessionsRes, hackathonsRes, resourcesRes] = await Promise.all([
        innovationClub.getSessions({}).catch(() => ({ sessions: [] })),
        innovationClub.getHackathons().catch(() => ({ hackathons: [] })),
        innovationClub.getResourceStats().catch(() => ({ total: 0 })),
      ]);
      setStats({
        sessions: sessionsRes?.sessions?.length || sessionsRes?.total || 0,
        hackathons: hackathonsRes?.hackathons?.length || hackathonsRes?.total || 0,
        resources: resourcesRes?.total || 0,
      });
    } catch (error) {
      console.error('Failed to fetch innovation club stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Innovation Club..." />;
  }

  if (!user?.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDD6] px-4">
        <div className="glass-panel p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unlock Innovation Club</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            The Innovation Club is available exclusively to paid members. Upgrade your account to access expert sessions, hackathons, training programs, and a curated resource library.
          </p>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-2xl font-semibold text-sm hover:shadow-lg hover:shadow-[#D4AF37]/30 transition-all"
          >
            <Crown className="w-4 h-4" />
            Upgrade to Access
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] relative overflow-hidden bg-[#F5EDD6]">
      {/* Background blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[50%] bg-white/60 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 md:py-10 relative z-10">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-md shadow-[#D4AF37]/20">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Your Innovation Hub</p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
                Innovation Club
              </h1>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-3 max-w-2xl leading-relaxed">
            Your gateway to expert mentorship, competitive hackathons, educator training, and a curated resource library built for the next generation of innovators.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {[
            { label: 'Active Sessions', value: stats.sessions, icon: Zap },
            { label: 'Open Hackathons', value: stats.hackathons, icon: Trophy },
            { label: 'Resources Available', value: stats.resources, icon: BookOpen },
          ].map((stat) => (
            <div key={stat.label} className="glass-panel p-4 sm:p-6 text-center">
              <stat.icon className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
              <p className="text-2xl sm:text-3xl font-light text-gray-900 tracking-tight">{stat.value}</p>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-semibold mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {sections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className={`glass-panel p-6 sm:p-8 relative overflow-hidden group hover:shadow-glass-lg transition-all duration-300 bg-gradient-to-br ${section.gradient}`}
            >
              {/* Hover shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-md shadow-[#D4AF37]/20 group-hover:scale-110 transition-transform duration-300">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/60 flex items-center justify-center text-gray-400 group-hover:text-[#D4AF37] group-hover:bg-[#D4AF37]/10 transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {section.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
