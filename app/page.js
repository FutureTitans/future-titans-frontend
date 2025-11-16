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
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <section
        ref={parallaxRef}
        className="parallax relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(220, 38, 38, 0.95) 0%, rgba(153, 27, 27, 0.95) 100%)`,
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-accent-gold rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-72 h-72 bg-accent-amber rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container-lg text-center text-white slide-up relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Future Titans
            <br />
            <span className="gradient-text">Innovation Challenge</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-100 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into impact. Learn from AI-powered mentorship while building the solutions the world needs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/signup"
              className="bg-white text-primary-red px-8 py-4 rounded-lg font-semibold hover:bg-primary-lightRed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-red transition-all duration-300"
            >
              Sign In
            </Link>
          </div>

          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 mx-auto text-white" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container-lg">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">Why Future Titans?</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-12 h-12 text-accent-gold" />,
                title: 'AI Co-Founder',
                description: 'Get personalized mentorship from an AI that understands your entrepreneurial journey',
              },
              {
                icon: <Users className="w-12 h-12 text-accent-gold" />,
                title: 'Learn Together',
                description: 'Access structured modules designed to build entrepreneurial mindset and resilience',
              },
              {
                icon: <Award className="w-12 h-12 text-accent-gold" />,
                title: 'Get Recognized',
                description: 'Submit your ideas, get evaluated, and join a network of innovators',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="card hover:border-primary-red group cursor-pointer slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary-red transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SURGE Framework Section */}
      <section className="py-20 bg-primary-lightRed">
        <div className="container-lg">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-primary-darkRed">The SURGE Framework</h2>
              <p className="text-lg text-neutral-dark mb-6">
                We use a proprietary 5-stage framework to develop your entrepreneurial mindset:
              </p>

              <ul className="space-y-4">
                {[
                  { letter: 'S', title: 'Self Awareness', desc: 'Understand your strengths and opportunities' },
                  { letter: 'U', title: 'Understanding', desc: 'Spot market opportunities and gaps' },
                  { letter: 'R', title: 'Resilience', desc: 'Build the grit to overcome challenges' },
                  { letter: 'G', title: 'Growth', desc: 'Execute and scale your solutions' },
                  { letter: 'E', title: 'Entrepreneurial Leadership', desc: 'Lead teams and inspire change' },
                ].map((item, idx) => (
                  <li key={idx} className="flex gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-red text-white flex items-center justify-center font-bold flex-shrink-0">
                      {item.letter}
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary-darkRed">{item.title}</h4>
                      <p className="text-neutral-medium text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <div className="absolute inset-0 bg-gradient-red-gold opacity-20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-24 h-24 text-primary-red mx-auto mb-4 animate-bounce" />
                  <p className="text-2xl font-bold text-primary-red">Your Journey Starts Here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container-lg">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10K+', label: 'Students' },
              { number: '50+', label: 'Countries' },
              { number: '$1M+', label: 'Ideas Submitted' },
              { number: '95%', label: 'Success Rate' },
            ].map((stat, idx) => (
              <div key={idx} className="fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <p className="text-4xl font-bold gradient-text mb-2">{stat.number}</p>
                <p className="text-neutral-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-red text-white">
        <div className="container-lg text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of young innovators transforming ideas into solutions that change the world.
          </p>

          <Link
            href="/signup"
            className="inline-block bg-white text-primary-red px-10 py-4 rounded-lg font-semibold hover:bg-primary-lightRed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Your Journey Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-dark text-white py-12">
        <div className="container-lg">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Future Titans</h3>
              <p className="text-neutral-medium">Empowering the next generation of innovators.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-neutral-medium">
                <li><Link href="/modules">Modules</Link></li>
                <li><Link href="/challenges">Challenges</Link></li>
                <li><Link href="/community">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-medium">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-neutral-medium">
                <li><Link href="#">Twitter</Link></li>
                <li><Link href="#">LinkedIn</Link></li>
                <li><Link href="#">Instagram</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-medium pt-8 text-center text-neutral-medium">
            <p>&copy; 2025 Future Titans. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

