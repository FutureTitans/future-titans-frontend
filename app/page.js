'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, isStudent } from '@/lib/auth';
import { ArrowRight, Zap, Users, Award, Sparkles, ChevronDown } from 'lucide-react';

export default function Landing() {
  const router = useRouter();
  const parallaxRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        router.push('/admin');
      } else if (isStudent()) {
        router.push('/student/dashboard');
      }
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        const scrolled = window.scrollY;
        parallaxRef.current.style.backgroundPosition = `center ${scrolled * 0.5}px`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/30 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-200/30 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10">
        {/* Navigation is handled by external Navbar component */}

        {/* Hero Section */}
        <section className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4">
          <div className="container mx-auto text-center max-w-5xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-amber-200/30 bg-white/40 mb-8 animate-fade-in-up">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase">The Future of Innovation</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-[#0F5132] mb-8 leading-[1.1]">
              Future Titans
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0F5132] to-[#1B6B4C]">
                Innovation Challenge
              </span>

            </h1>

            <p className="text-xl md:text-2xl text-[#2E2E2E] max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Transform your ideas into impact. Experience AI-powered mentorship and build the solutions the world needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/signup"
                className="glass-button px-10 py-5 text-lg shadow-xl shadow-[#1B6B4C]/20 hover:shadow-[#1B6B4C]/30 group"
              >
                <div className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
              <Link
                href="/login"
                className="px-10 py-5 rounded-full bg-white/30 backdrop-blur-md border border-white/40 text-gray-700 font-semibold hover:bg-[#c7a536] transition-all hover:scale-105"
              >
                Sign In
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
              <ChevronDown className="w-6 h-6 text-gray-400" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#0F5132] mb-4">
                Why Future Titans?
              </h2>


              <p className="text-xl text-[#2E2E2E]-500">Everything you need to succeed as a young innovator</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-8 h-8 text-[#D4AF37]" />,
                  title: 'ZUNOVA AI Mentorship',
                  description: 'Get personalized feedback and guidance from our advanced AI mentor tailored to your journey.'
                },
                {
                  icon: <Users className="w-8 h-8 text-[#D4AF37]" />,
                  title: 'Collaborative Learning',
                  description: 'Connect with peers, form teams, and solve problems together in a global community.'
                },
                {
                  icon: <Award className="w-8 h-8 text-[#D4AF37]" />,
                  title: 'Global Recognition',
                  description: 'Submit your projects, get evaluated by experts, and win prestige and prizes.'
                },
              ].map((feature, idx) => (
                <div key={idx} className="glass-panel p-8 glass-panel-hover group">
                  <div className="w-16 h-16 rounded-2xl bg-white/60 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F5132] mb-4">{feature.title}</h3>
                  <p className="text-[#2E2E2E] leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SURGE Framework Section */}
        <section className="py-24 px-4 relative">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-sm -z-10"></div>
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block px-4 py-1 rounded-full bg-purple-100/50 text-[#D4AF37] text-sm font-bold mb-4">METHODOLOGY</div>
                <h2 className="text-4xl md:text-5xl font-bold text-[#0F5132] mb-6">The SURGE Framework</h2>
                <p className="text-xl text-[#2E2E2E] mb-10 leading-relaxed">
                  Our proprietary 5-stage framework is designed to systematically build your entrepreneurial mindset from the ground up.
                </p>

                <div className="space-y-6">
                  {[
                    { letter: 'S', title: 'Self Awareness', desc: 'Identify your strengths and passion' },
                    { letter: 'U', title: 'Understanding', desc: 'Find gaps and market opportunities' },
                    { letter: 'R', title: 'Resilience', desc: 'Learn to pivot and overcome failure' },
                    { letter: 'G', title: 'Growth', desc: 'Scale your solution and impact' },
                    { letter: 'E', title: 'Entrepreneurial Leadership', desc: 'Lead teams with vision' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 group">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                        {item.letter}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-[#0F5132]">{item.title}</h4>
                        <p className="text-[#2E2E2E]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="glass-panel p-2 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-[#6B8E6E] via-[#5A7D5D] to-[#4C6F4F] opacity-90 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-30"></div>
                    <div className="text-center text-white p-8 relative z-10">
                      <Sparkles className="w-20 h-20 mx-auto mb-6 text-white animate-pulse" />
                      <h3 className="text-4xl font-bold mb-2 text-white">
                        Start Your Surge
                      </h3>


                      <p className="text-white/80">Join the movement today</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-4 bg-orange text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(172, 139, 55, 0.1),transparent_50%)]"></div>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
              {[
                { number: '10K+', label: 'Students' },
                { number: '50+', label: 'Countries' },
                { number: '$1M+', label: 'Ideas Impact' },
                { number: '95%', label: 'Satisfaction' },
              ].map((stat, idx) => (
                <div key={idx} className="p-4">
                  <div className="text-5xl font-bold text-white mb-2">
                    {stat.number}
                  </div>

                  <div className="text-white/70 font-medium tracking-wide uppercase text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 text-center">
          <div className="container mx-auto max-w-4xl glass-panel bg-[#6B8E6E] p-16 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2"></div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to shape the future?
            </h2>

            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of student innovators who are already building tomorrow's solutions.
            </p>

            <Link
              href="/signup"
              className="glass-button px-12 py-6 text-xl inline-block shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/40 hover:-translate-y-1 transition-transform"
            >
              Start Your Journey Now
            </Link>
          </div>




        </section>

        {/* Footer */}
        <footer className="bg-[#D4AF37] backdrop-blur-lg border-t border-gray-200 py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
              <div className="col-span-1 md:col-span-1">
                <div className="font-bold text-2xl text-gray-900 mb-4">Future Titans</div>
                <p className="text-white/80 mb-4">Empowering the next generation of innovators with tools, mentorship, and community.</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Platform</h4>
                <ul className="space-y-2 ">
                  <li><Link href="/" className="text-gray-900 hover:text-amber-600 transition">Modules</Link></li>
                  <li><Link href="/" className="text-gray-900 hover:text-amber-600 transition">Challenges</Link></li>
                  <li><Link href="/" className="text-gray-900 hover:text-amber-600 transition">Community</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Company</h4>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/" className="text-gray-900 hover:text-amber-600 transition">About</Link></li>
                  <li><Link href="/" className="text-gray-900 hover:text-amber-600 transition">Contact</Link></li>
                  <li><Link href="/" className="text-gray-900 hover:text-amber-600 transition">Privacy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-4">Connect</h4>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/youngpreneurs.ai?igsh=MThlOW93dXJtYjRpeQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-600 transition cursor-pointer">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://www.facebook.com/share/1cqPc5C3LW/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-600 transition cursor-pointer">
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a href="https://www.linkedin.com/company/youngpreneurs-ai/posts/?feedView=all" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-amber-100 hover:text-amber-600 transition cursor-pointer">
                    <Linkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-200 text-center text-gray-900 text-sm">
              &copy; 2025 Future Titans. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

