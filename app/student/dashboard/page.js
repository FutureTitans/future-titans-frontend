'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { modules, payment, auth } from '@/lib/api';
import { isStudent, getUser } from '@/lib/auth';
import { Lock, ChevronRight, ArrowRight, CheckCircle, Zap } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [modulesList, setModulesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!isStudent()) {
      router.push('/login');
      return;
    }
    const currentUser = getUser();
    setUser(currentUser);
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const [modulesData, paymentData, profileData] = await Promise.all([
        modules.getAll().catch(() => []),
        payment.getPaymentStatus().catch(() => ({ isPaid: false })),
        auth.getProfile().catch(() => null),
      ]);
      setModulesList(modulesData);
      setPaymentStatus(paymentData);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    try {
      if (typeof window === 'undefined' || typeof window.Razorpay === 'undefined') {
        alert('Payment system is loading. Please wait.');
        return;
      }
      const orderData = await payment.initiatePayment();
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Future Titans',
        description: 'Innovation Challenge Access',
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            await payment.verifyPayment(response);
            setPaymentStatus({ isPaid: true });
            fetchDashboardData();
          } catch (error) {
            console.error('Payment verification failed:', error);
          }
        },
        prefill: {
          name: profile?.name || user?.name,
          email: user?.email,
        },
        theme: { color: '#D4AF37' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your dashboard..." />;

  const isUserPaid = profile?.isPaid || user?.isPaid || paymentStatus?.isPaid;

  const sortedModules = [...modulesList].sort((a, b) => {
    const weights = { beginner: 1, intermediate: 2, advanced: 3 };
    return (weights[a.difficulty] || 4) - (weights[b.difficulty] || 4);
  });

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pb-20">
      {/* Background accents */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-[#F5EDD6] to-transparent -z-10" />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, <span className="text-[#B8952E]">{profile?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'Titan'}</span> 👋
            </h1>
            <p className="text-gray-500 mt-2 text-lg">Let&apos;s continue your innovation journey.</p>
          </div>
          {!isUserPaid && (
            <button onClick={handlePayment} className="bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-[#D4AF37]/30 hover:scale-105 transition-transform flex items-center gap-2">
              <Lock className="w-4 h-4" /> Unlock Full Access
            </button>
          )}
        </div>

        <div className="flex flex-col gap-12">
          
          {/* LEARN SECTION */}
          <section className="relative">
            <div className="flex items-center gap-3 mb-6">
              <img src="/compass.png" alt="Compass" className="w-8 h-8 object-contain drop-shadow-md" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Learn & Build</h2>
            </div>
            
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
              {sortedModules.map((module, index) => {
                const isDone = (module.userProgress?.completionPercentage || 0) >= 100;
                const isActive = !isDone;
                return (
                  <div key={module._id} className="snap-center shrink-0 w-[320px] md:w-[380px] relative group">
                    <div className={`card overflow-hidden p-0 w-full transition-all duration-300 border-2 rounded-3xl h-full flex flex-col
                      ${isDone ? 'border-[#D4AF37]/50 shadow-xl bg-gradient-to-br from-white to-[#F5D76E]/5' :
                        isActive ? 'border-[#D4AF37] shadow-2xl bg-white ring-4 ring-[#D4AF37]/10' :
                        'border-gray-200 bg-gray-50'}`}
                    >
                      {!isUserPaid && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-3xl">
                          <div className="bg-white p-4 rounded-full shadow-xl text-[#B8952E] flex flex-col items-center">
                            <Lock className="w-8 h-8 mb-1" />
                            <span className="text-xs font-bold uppercase tracking-widest">Locked</span>
                          </div>
                        </div>
                      )}
                      {/* Image */}
                      {module.coverImage ? (
                        <div className="w-full h-48 bg-gray-100 relative">
                          <img src={module.coverImage} alt={module.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          <div className="absolute top-4 left-4">
                            <span className="text-[10px] px-3 py-1.5 rounded-full uppercase tracking-wider font-bold shadow-sm backdrop-blur-md bg-white/20 text-white border border-white/30">
                              Level {index + 1}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className={`w-full h-40 bg-gradient-to-br flex flex-col items-start p-6 justify-end ${isActive ? 'from-[#D4AF37]/20 to-[#F5D76E]/10' : 'from-gray-200 to-gray-100'}`}>
                          <span className={`text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold shadow-sm border mb-2 ${isActive ? 'bg-white text-[#B8952E] border-[#D4AF37]/30' : 'bg-gray-100/50 text-gray-500 border-gray-300'}`}>
                            Level {index + 1}
                          </span>
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <h3 className="font-extrabold text-xl mb-2 text-gray-900 line-clamp-2">{module.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4">{module.description}</p>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 mt-auto">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{module.estimatedCompletionTime || 30} min</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                            <span>{module.chapters?.length || 0} chapters</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-5 pb-5 border-b border-gray-100">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] uppercase font-bold text-gray-400">Completion</span>
                            <span className={`text-[10px] font-bold ${isDone ? 'text-green-500' : 'text-gray-700'}`}>{module.userProgress?.completionPercentage || 0}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full transition-all duration-1000 ${isDone ? 'bg-green-500' : 'bg-gradient-to-r from-[#D4AF37] to-[#F5D76E]'}`}
                              style={{ width: `${module.userProgress?.completionPercentage || 0}%` }}></div>
                          </div>
                        </div>

                        <div className="mt-auto pt-2">
                          {isUserPaid ? (
                            <div 
                              onClick={() => {
                                if (isUserPaid) {
                                  router.push('/student/modules');
                                }
                              }}
                              className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 cursor-pointer
                                ${isDone ? 'bg-white border-2 border-[#D4AF37] text-[#B8952E]' : 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white shadow-lg shadow-[#D4AF37]/30'}`
                              }
                            >
                              {isDone ? <><CheckCircle className="w-4 h-4"/> Go to Modules</> : <><Zap className="w-4 h-4"/> Go to Modules</>}
                            </div>
                          ) : (
                            <button onClick={handlePayment} className="w-full bg-gray-100 text-gray-400 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm">
                              <Lock className="w-4 h-4" /> Unlock to Access
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* GRID LAYOUT FOR THE REST */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* INCUBATION VIDEO */}
            <section className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Future Titans Innovation Club</h2>
              <p className="text-gray-500 mb-6 text-sm">Join the elite club of young innovators and bring your ideas to life.</p>
              <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden relative group shadow-inner flex-1">
                <video 
                  controls 
                  className="w-full h-full object-cover"
                >
                  <source src="https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/Incubation%20video%20.mp4" type="video/mp4" />
                </video>
              </div>
            </section>

            {/* ZUNNOVA AI */}
            <section className="bg-gradient-to-br from-[#1A1A1A] to-[#2D2D2D] rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/20 blur-[100px] rounded-full pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <div className="flex-1">
                  <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-4">
                    AI Co-Founder
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">Meet Zunnova</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Your personal AI co-founder is here to help you brainstorm, build business models, and validate your ideas in real-time.
                  </p>
                  <Link href="/student/modules" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-[#F5EDD6] transition-colors">
                    Chat with Zunnova <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="w-32 sm:w-1/3 flex-shrink-0">
                  <img src="/AIcofounderzunnva.png" alt="Zunnova AI" className="w-full h-auto object-contain drop-shadow-2xl animate-float" />
                </div>
              </div>
            </section>

          </div>

          {/* STARTING YOUNG */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
            <div className="absolute -top-24 -right-24 opacity-10 pointer-events-none">
              <img src="/bulbrocket.png" alt="Decoration" className="w-96 h-96 object-contain" />
            </div>
            <div className="flex flex-col md:flex-row gap-10 relative z-10 items-center">
              <div className="w-full md:w-1/2 aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl relative">
                <video 
                  controls 
                  className="w-full h-full object-cover"
                >
                  <source src="https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/this%20is%20what%20starting%20young%20looks%20like.mp4" type="video/mp4" />
                </video>
              </div>
              <div className="w-full md:w-1/2">
                <div className="flex items-center gap-3 mb-4">
                  <img src="/bulbrocket.png" alt="Rocket" className="w-10 h-10 object-contain drop-shadow-md" />
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">This is what starting young looks like</h2>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  Age is just a number. Dive into the world of entrepreneurship, learn the ropes, and start building your empire today. The future belongs to those who start early.
                </p>
                <Link href="/student/modules" className="inline-flex bg-gray-900 text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-black transition-colors items-center gap-2">
                  Start Your Journey <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </section>

          {/* SUCCESS STORIES */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">Success Stories</h2>
              <span className="text-[#B8952E] font-bold text-sm uppercase tracking-widest cursor-pointer hover:text-gray-900">View All</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Krishika', url: 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/KrishikaVoice.mp4', title: 'A Journey of Innovation' },
                { name: 'Naisha', url: 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/naishaVoice.mp4', title: 'Building for the Future' },
                { name: 'Shivay', url: 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/ShivayVoice.mp4', title: 'Turning Ideas to Reality' }
              ].map((story, i) => (
                <div key={i} className="bg-white rounded-3xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100 group hover:-translate-y-1 transition-transform">
                  <div className="w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-inner mb-4 max-h-[400px]">
                    <video 
                      controls 
                      className="w-full h-full object-cover"
                    >
                      <source src={story.url} type="video/mp4" />
                    </video>
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-lg text-gray-900">{story.name}</h3>
                    <p className="text-sm text-gray-500">{story.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
