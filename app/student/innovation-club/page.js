'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { innovationClub, payment } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  Users,
  Trophy,
  BookOpen,
  ArrowRight,
  Lock,
  Crown,
} from 'lucide-react';

export default function InnovationClubHub() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [stats, setStats] = useState({ sessions: 0, hackathons: 0, resources: 0 });

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchData(currentUser);
  }, [router]);

  const fetchData = async (currentUser) => {
    try {
      const [sessionsRes, hackathonsRes, resourcesRes, paymentRes] = await Promise.all([
        innovationClub.getSessions({}).catch(() => []),
        innovationClub.getHackathons().catch(() => []),
        innovationClub.getResourceStats().catch(() => ({})),
        payment.getPaymentStatus().catch(() => ({ isPaid: false })),
      ]);
      setStats({
        sessions: Array.isArray(sessionsRes) ? sessionsRes.length : 0,
        hackathons: Array.isArray(hackathonsRes) ? hackathonsRes.length : 0,
        resources: resourcesRes?.totalResources || 0,
      });
      setIsPaid(currentUser?.isPaid || paymentRes?.isPaid || false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Innovation Hub..." />;
  }

  if (!isPaid) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center bg-[#FAF8F3] px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 -left-[10%] w-[50%] h-[50%] bg-white/60 rounded-full blur-[100px]" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="bg-white/80 backdrop-blur-md border border-white p-8 sm:p-12 max-w-lg w-full text-center rounded-3xl shadow-xl relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unlock Innovation Club</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            The Innovation Club is available exclusively to paid members. Upgrade your account to access expert sessions, hackathons, and a curated resource library.
          </p>
          <Link
            href="/student/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0A1610] text-white rounded-full font-semibold text-sm hover:bg-[#152e22] transition-all shadow-md"
          >
            <Crown className="w-4 h-4 text-[#D4AF37]" />
            Upgrade to Access
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] relative overflow-hidden bg-[#FAF8F3]">
      {/* Background Image Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0">
          <Image
            src="/images/innovation-club/hero-section-bg.png"
            alt="Innovation Hub Background"
            fill
            className="object-cover object-center opacity-100"
            priority
          />
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 flex flex-col justify-center min-h-[calc(100dvh-4rem)]">
        
        {/* Header */}
        <div className="max-w-xl mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-bold tracking-[0.2em] text-[#1B3A2D] uppercase">YOUR INNOVATION HUB</span>
            <div className="h-px w-16 bg-[#D4AF37]"></div>
          </div>
          <h1 className="text-[3rem] sm:text-[4rem] md:text-[4.5rem] font-bold text-[#111] leading-[1.05] tracking-tight mb-6">
            Your Innovation Hub
          </h1>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-md">
            Your gateway to expert mentorship, competitive hackathons, and a curated resource library built for the next generation of innovators.
          </p>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Row 1: Stats */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-blue-500/30 flex items-center justify-center bg-blue-50 shadow-inner">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-500 leading-none">{stats.sessions || 1}</h3>
                <p className="text-[#111] font-bold text-xs mt-1">Active Sessions</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <ArrowRight className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-purple-500/30 flex items-center justify-center bg-purple-50 shadow-inner">
                <Trophy className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-purple-600 leading-none">{stats.hackathons || 1}</h3>
                <p className="text-[#111] font-bold text-xs mt-1">Open Hackathons</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-purple-600" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl p-5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border border-[#D4AF37]/30 flex items-center justify-center bg-[#D4AF37]/10 shadow-inner">
                <BookOpen className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-[#D4AF37] leading-none">{stats.resources || 11}</h3>
                <p className="text-[#111] font-bold text-xs mt-1">Resources Available</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>

          {/* Row 2: Feature Sections */}
          <Link href="/student/innovation-club/experts" className="relative block rounded-3xl overflow-hidden h-[240px] group border border-white/10 shadow-xl bg-[#08101a]">
            <Image
              src="/images/innovation-club/expert-section.png"
              alt="Expert Exposure"
              fill
              className="object-cover object-right group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030914] via-[#030914]/80 to-transparent w-[80%]" />
            
            <div className="relative h-full flex flex-col p-6 z-10 w-[85%]">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 leading-tight">Expert Exposure</h3>
              <p className="text-white/70 text-xs leading-relaxed mb-auto max-w-[200px]">
                Connect with industry leaders through live sessions, masterclasses, and curated mentorship experiences.
              </p>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors mt-2">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </Link>

          <Link href="/student/innovation-club/hackathons" className="relative block rounded-3xl overflow-hidden h-[240px] group border border-white/10 shadow-xl bg-[#14081c]">
            <Image
              src="/images/innovation-club/hackathons-card.png"
              alt="Hackathons"
              fill
              className="object-cover object-right group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0413] via-[#0d0413]/80 to-transparent w-[80%]" />
            
            <div className="relative h-full flex flex-col p-6 z-10 w-[85%]">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20 mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 leading-tight">Hackathons</h3>
              <p className="text-white/70 text-xs leading-relaxed mb-auto max-w-[200px]">
                Compete in innovation challenges, build real solutions, and showcase your ideas on a national stage.
              </p>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-purple-600 transition-colors mt-2">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </Link>

          <Link href="/student/innovation-club/resources" className="relative block rounded-3xl overflow-hidden h-[240px] group border border-white/10 shadow-xl bg-[#1c1308]">
            <Image
              src="/images/innovation-club/resources-card.png"
              alt="Resource Library"
              fill
              className="object-cover object-right group-hover:scale-105 transition-transform duration-700 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#120a03] via-[#120a03]/80 to-transparent w-[80%]" />
            
            <div className="relative h-full flex flex-col p-6 z-10 w-[85%]">
              <div className="w-12 h-12 rounded-2xl bg-[#986E00] flex items-center justify-center shadow-lg shadow-[#986E00]/20 mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2 leading-tight">Resource Library</h3>
              <p className="text-white/70 text-xs leading-relaxed mb-auto max-w-[200px]">
                Curated books, worksheets, templates, and videos to support every stage of your innovation journey.
              </p>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#986E00] transition-colors mt-2">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>
          </Link>

          {/* Zunnova Banner */}
          <div className="mt-4 md:col-span-3 rounded-2xl bg-[#08120d] border border-[#14291f] p-4 flex flex-col sm:flex-row items-center justify-center gap-3 shadow-lg relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 opacity-30 pointer-events-none flex items-center justify-end overflow-hidden w-64">
               <div className="w-48 h-48 bg-[#D4AF37] rounded-full blur-[80px] -mr-16"></div>
               <span className="absolute right-4 text-[#D4AF37] text-8xl font-black opacity-20 -mt-8 font-serif">?</span>
            </div>
            
            <div className="w-1 h-6 bg-[#D4AF37] rounded-full hidden sm:block"></div>
            <p className="text-[#D4AF37] font-bold text-sm sm:text-base relative z-10 text-center sm:text-left">
              Zunnova: <span className="text-white/80 font-normal">Every great founder starts with a question. Let&apos;s find yours.</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
