'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { innovationClub } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Users,
  Lock,
  Crown,
  BookOpen,
  Award,
  ClipboardCheck,
  Lightbulb,
  Presentation,
  HeartHandshake,
  Quote,
  CheckCircle2,
  Clock,
  Video,
} from 'lucide-react';

const learningJourney = [
  {
    step: 1,
    title: 'Facilitation Basics',
    description: 'Learn the foundations of guiding student-led innovation sessions.',
    icon: BookOpen,
  },
  {
    step: 2,
    title: 'Innovation Rubrics',
    description: 'Master frameworks to evaluate creative problem-solving and ideation.',
    icon: ClipboardCheck,
  },
  {
    step: 3,
    title: 'Pitch Evaluation',
    description: 'Develop skills to assess and coach student presentations effectively.',
    icon: Presentation,
  },
  {
    step: 4,
    title: 'Student Venture Support',
    description: 'Guide students from idea validation to building real ventures.',
    icon: HeartHandshake,
  },
];

const featurePills = [
  { label: 'Cohort-Based Learning', icon: Users },
  { label: '4-Week Program', icon: Calendar },
  { label: 'Live + Recorded', icon: Video },
  { label: 'Completion Certificate', icon: Award },
];

function SeatsIndicator({ seatsLeft, totalSeats }) {
  const percent = totalSeats > 0 ? ((totalSeats - seatsLeft) / totalSeats) * 100 : 0;
  let color = 'bg-green-500';
  let textColor = 'text-green-700';
  let bgColor = 'bg-green-50';
  if (seatsLeft <= 5) {
    color = 'bg-red-500';
    textColor = 'text-red-700';
    bgColor = 'bg-red-50';
  } else if (seatsLeft <= 15) {
    color = 'bg-amber-500';
    textColor = 'text-amber-700';
    bgColor = 'bg-amber-50';
  }

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className={`font-semibold ${textColor}`}>{seatsLeft} seats left</span>
        <span className="text-gray-400">{totalSeats} total</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
}

export default function TeachersTrainingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cohorts, setCohorts] = useState([]);
  const [reservingId, setReservingId] = useState(null);
  const [reserveSuccess, setReserveSuccess] = useState(null);
  const [reserveError, setReserveError] = useState(null);

  useEffect(() => {
    const currentUser = getUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(currentUser);
    fetchCohorts();
  }, [router]);

  const fetchCohorts = async () => {
    try {
      const res = await innovationClub.getTrainingCohorts();
      setCohorts(Array.isArray(res) ? res : res?.cohorts || []);
    } catch (error) {
      console.error('Failed to fetch training cohorts:', error);
      setCohorts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReserveSeat = async (cohortId) => {
    setReservingId(cohortId);
    setReserveError(null);
    setReserveSuccess(null);
    try {
      const currentUser = getUser();
      await innovationClub.reserveSeat(cohortId, {
        name: currentUser?.name,
        email: currentUser?.email,
        school: currentUser?.school,
      });
      setReserveSuccess(cohortId);
      fetchCohorts();
      setTimeout(() => setReserveSuccess(null), 4000);
    } catch (error) {
      console.error('Failed to reserve seat:', error);
      setReserveError(error?.error || error?.message || 'Failed to reserve seat. Please try again.');
      setTimeout(() => setReserveError(null), 4000);
    } finally {
      setReservingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading Teachers' Training..." />;
  }

  if (!user?.isPaid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5EDD6] px-4">
        <div className="glass-panel p-8 sm:p-12 max-w-lg w-full text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center shadow-lg shadow-[#D4AF37]/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Unlock Teachers' Training</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            Access cohort-based training programs designed to equip educators with innovation facilitation skills. Upgrade your account to enroll.
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 -left-[10%] w-[50%] h-[50%] bg-white/60 rounded-full blur-[100px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-[#D4AF37]/10 rounded-full blur-[100px]" />
      </div>

      {/* Reserve Error Toast */}
      {reserveError && (
        <div className="fixed top-6 right-6 z-50">
          <div className="glass-panel p-4 flex items-center gap-3 shadow-xl border border-red-200 bg-red-50/90 max-w-sm">
            <p className="text-sm text-red-700">{reserveError}</p>
            <button onClick={() => setReserveError(null)} className="text-red-400 hover:text-red-600 ml-auto text-lg leading-none">x</button>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8 xl:px-12 py-6 sm:py-8 relative z-10">
        {/* Back + Header */}
        <div className="mb-6 sm:mb-8">
          <Link
            href="/student/innovation-club"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Innovation Club
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 tracking-tight">
            Teachers' Training
          </h1>
        </div>

        {/* Hero Section */}
        <div className="glass-panel p-6 sm:p-10 mb-6 sm:mb-8 relative overflow-hidden bg-gradient-to-br from-[#1B3A2D] to-[#2D5A45] text-white">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <GraduationCap className="w-10 h-10 text-[#D4AF37] mb-4" />
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-3 leading-tight">
              Great Founders Often Begin with <span className="font-semibold">Great Teachers</span>
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              A structured, cohort-based program designed to equip educators with the skills, frameworks, and confidence to facilitate innovation in their classrooms.
            </p>
          </div>
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-3 mb-8 sm:mb-10">
          {featurePills.map((pill) => (
            <div
              key={pill.label}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 border border-white/50 rounded-full shadow-sm"
            >
              <pill.icon className="w-4 h-4 text-[#B8952E]" />
              <span className="text-xs font-semibold text-gray-700">{pill.label}</span>
            </div>
          ))}
        </div>

        {/* Upcoming Cohorts */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Upcoming Cohorts</h2>
          <p className="text-sm text-gray-600 mb-6">Reserve your seat in the next training batch. Limited spots available.</p>

          {cohorts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {cohorts.map((cohort) => {
                const totalSeats = cohort.capacity || cohort.totalSeats || 30;
                const seatsLeft = totalSeats - (cohort.seatsBooked || cohort.reservedSeats || 0);
                return (
                  <div
                    key={cohort._id || cohort.id}
                    className="glass-panel p-5 sm:p-6 flex flex-col group hover:shadow-glass-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          {cohort.title || (cohort.startDate
                            ? `${new Date(cohort.startDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} Cohort`
                            : 'Training Cohort')}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {cohort.startDate && new Date(cohort.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          {cohort.endDate && ` - ${new Date(cohort.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#F5D76E]/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-[#B8952E]" />
                      </div>
                    </div>

                    {cohort.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{cohort.description}</p>
                    )}

                    <div className="mb-4">
                      <SeatsIndicator seatsLeft={seatsLeft} totalSeats={totalSeats} />
                    </div>

                    <div className="mt-auto pt-2">
                      {reserveSuccess === (cohort._id || cohort.id) ? (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Seat Reserved
                        </div>
                      ) : (
                        <button
                          onClick={() => handleReserveSeat(cohort._id || cohort.id)}
                          disabled={reservingId === (cohort._id || cohort.id) || seatsLeft <= 0}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {reservingId === (cohort._id || cohort.id) ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Reserving...
                            </>
                          ) : seatsLeft <= 0 ? (
                            'Fully Booked'
                          ) : (
                            <>
                              Reserve a Seat
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center">
              <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Upcoming Cohorts</h3>
              <p className="text-sm text-gray-500">New training cohorts are being organized. Check back soon for enrollment dates.</p>
            </div>
          )}
        </div>

        {/* Learning Journey */}
        <div className="glass-panel p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your 4-Step Learning Journey</h2>
          <p className="text-sm text-gray-600 mb-8">A progressive curriculum that takes you from basics to mastery.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {learningJourney.map((item, i) => (
              <div key={item.title} className="relative group">
                <div className="p-5 bg-white/60 rounded-2xl border border-white/40 hover:bg-white/80 hover:shadow-sm transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37]/10 to-[#F5D76E]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#D4AF37]/20 group-hover:to-[#F5D76E]/20 transition-all">
                      <item.icon className="w-5 h-5 text-[#B8952E]" />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-[#B8952E] font-bold">Step {item.step}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
                </div>
                {i < learningJourney.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 w-6 items-center">
                    <div className="w-full h-px bg-[#D4AF37]/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="glass-panel p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">What Educators Say</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                quote: 'This program gave me the tools to transform my classroom into an innovation lab. My students are now solving real problems.',
                name: 'Priya Sharma',
                role: 'Science Teacher, Delhi Public School',
              },
              {
                quote: 'The rubrics and frameworks I learned have completely changed how I evaluate student projects. It is more structured and fair now.',
                name: 'Rahul Mehta',
                role: 'Computer Science Faculty, Ryan International',
              },
              {
                quote: 'I went from being a traditional teacher to an innovation facilitator. The cohort format made learning practical and collaborative.',
                name: 'Anita Desai',
                role: 'Economics Teacher, Presidency School',
              },
            ].map((testimonial, i) => (
              <div key={i} className="p-5 bg-white/60 rounded-2xl border border-white/40">
                <Quote className="w-6 h-6 text-[#D4AF37]/40 mb-3" />
                <p className="text-sm text-gray-700 leading-relaxed mb-4 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
