'use client';

import Image from 'next/image';
import Link from 'next/link';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

const testimonials = [
  { name: 'Devika Majumder', title: 'Founder & CEO', image: '/images/yp/devika.jpg', quote: "As a founder, I believe in the power of an innovator's eye, a founder's grit, and an entrepreneurial mindset—not just for building businesses, but for shaping fearless, future-ready individuals." },
  { name: 'Suman Bose', title: 'Former CEO & MD Siemens', image: '/images/yp/suman.jpg', quote: "In a world that's changing faster than ever, an entrepreneurial mindset isn't just an advantage—it's a necessity. Future Titans is about building fearless, future-ready leaders!" },
  { name: 'Sandipan Chattopadhyay', title: 'Former CTO Justdial', image: '/images/yp/sandipan.jpeg', quote: "Entrepreneurship is about problem-solving, adaptability, and resilience. Future Titans ignites that mindset in young minds." },
  { name: 'Dr. Julia Stamm', title: 'Founder & CEO, She Shapes AI, UK', image: '/images/juliya.jpg', quote: "Equipping our youth with an entrepreneurial mindset will create a generation of future leaders who can connect the dots and solve today's complex problems." },
  { name: 'Fred Katz', title: 'Johns Hopkins Carey Business School', image: '/images/yp/fred.jpeg', quote: "Entrepreneurship is about thinking big, understanding risks, and solving real-world problems. Future Titans is giving young minds the platform they need." },
  { name: 'Dr. Partha Ghosh', title: 'Former Senior Partner at McKinsey', image: '/images/yp/partha.jpg', quote: "To succeed, leaders have to think and act beyond borders, keeping in focus the locale — both requirements and assets." },
];

export default function FutureTitans() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative overflow-hidden min-h-[70vh] flex items-end pb-12 pt-28 px-4 sm:px-6 lg:px-8">
        {/* Background image */}
        <Image
          src="/images/yp/hero-bg-ft.png"
          alt="Future Titans hero"
          fill
          className="object-cover object-[center_30%]"
          priority
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1a12] via-[#0a1a12]/75 to-transparent" />

        <div className="max-w-7xl mx-auto relative z-10 w-full">
          {/* Badges */}
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <span className="rounded-full bg-white px-5 py-2 text-xs font-bold text-[#123c1f] shadow-sm">Youngpreneurs Presents</span>
            <span className="rounded-full bg-[#C8960C] px-5 py-2 text-xs font-bold text-white shadow-sm">National Challenge</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-2">
            Future Titans
          </h1>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#C8960C] leading-[1.1] mb-6">
            Build. Compete. Lead.
          </h2>

          {/* Description */}
          <p className="text-gray-300 text-base max-w-md mb-8 leading-relaxed">
            India&apos;s innovation challenge for students 12–19 —<br />
            a hands-on workshop journey before you pitch<br />
            on the national stage.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-5 mb-10">
            <Link href="/signup" className="inline-flex items-center gap-2 border-2 border-[#C8960C] bg-[#C8960C] text-white px-7 py-3 rounded-full font-bold text-sm tracking-wider hover:bg-transparent hover:text-[#C8960C] transition-all">
              Register Now
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
          </div>

          {/* Stat cards */}
          <div className="flex flex-wrap gap-4">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="7" r="3" stroke="#C8960C" strokeWidth="1.5" /><circle cx="13" cy="7" r="3" stroke="#C8960C" strokeWidth="1.5" /><path d="M3 17c0-3 2-5 5-5h4c3 0 5 2 5 5" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" /></svg>
                ), k: 'Ages', v: '12 – 19'
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="3" y="3" width="14" height="14" rx="2" stroke="#C8960C" strokeWidth="1.5" /><path d="M7 7h6M7 10h6M7 13h4" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" /></svg>
                ), k: 'Format', v: 'Workshops + Mentoring'
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="#C8960C" strokeWidth="1.5" /><circle cx="10" cy="10" r="3" stroke="#C8960C" strokeWidth="1.5" /><circle cx="10" cy="10" r="1" fill="#C8960C" /></svg>
                ), k: 'Scope', v: 'Innovation Market'
              },
            ].map((item) => (
              <div key={item.k} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
                <div className="flex items-center justify-center w-9 h-9 rounded-full border border-[#C8960C]/30 bg-[#C8960C]/10 shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-[#C8960C]/80 uppercase">{item.k}</p>
                  <p className="text-sm font-semibold text-white">{item.v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#ffe794] px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-black text-lg mb-10 max-w-xl mx-auto font-medium">A USA–India initiative backed by leaders in education, policy, and media.</p>
          <div className="flex flex-nowrap items-center justify-center gap-8 sm:gap-10 lg:gap-14 overflow-x-auto">
            <Image src="/images/yp/iit-kharagpur.svg" alt="IIT Kharagpur" width={200} height={100} className="h-20 sm:h-24 w-auto object-contain shrink-0" />
            <Image src="/images/yp/startUpIndiaLogo.png" alt="Startup India" width={2000} height={528} className="h-18 sm:h-22 w-auto object-contain shrink-0" />
            <Image src="/images/yp/AIPlogo.png" alt="Association of Indian Principals" width={339} height={149} className="h-20 sm:h-24 w-auto object-contain shrink-0" />
            <Image src="/images/yp/AIClogo.png" alt="AIC BIMTECH" width={290} height={159} className="h-20 sm:h-24 w-auto object-contain shrink-0" />
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1B2A4A]">Building India&apos;s <span className="text-[#C8960C]">tomorrow</span>, today</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>We&apos;re entering an age where AI creates faster than we can imagine. The future belongs to young innovators who see possibilities and build solutions.</p>
              <p>Future Titans is a nationwide program that to equips students with the mindset, tools, and mentorship to turn ideas into impact - and pitch on the nation stage.</p>
            </div>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#C8960C] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-[#b5870b] transition-all">
              Start your journey →
            </Link>
          </div>
          <div className="flex-1 max-w-lg">
            <Image src="/images/yp/classroom2.png" alt="Students learning" width={600} height={450} className="w-full rounded-2xl object-cover shadow-xl border border-gray-100" />
          </div>
        </div>
      </section>

      <section className="bg-[#ffe794] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <p className="text-center text-[#C8960C] text-sm font-bold tracking-[0.25em] uppercase mb-14">THE ARCHITECTURE BEHIND FUTURE TITANS</p>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* IDEA DNA — clipboard with pencil icon */}
          <div className="bg-white rounded-2xl p-7 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="mb-5">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="8" width="20" height="32" rx="2" stroke="#1B2A4A" strokeWidth="1.5" />
                <path d="M18 8V6a4 4 0 018 0v2" stroke="#1B2A4A" strokeWidth="1.5" />
                <line x1="17" y1="18" x2="27" y2="18" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="17" y1="23" x2="27" y2="23" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="17" y1="28" x2="23" y2="28" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M34 22l-8 8-2 6 6-2 8-8-4-4z" fill="white" stroke="#C8960C" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M30 26l4 4" stroke="#C8960C" strokeWidth="1.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">IDEA DNA</h3>
            <p className="text-[#C8960C] text-sm mb-3">The Structured Innovation Pipeline</p>
            <p className="text-gray-500 text-sm leading-relaxed">A four-stage framework — Design → Experiment → Apply → Adapt, structured for repeatable innovation.</p>
          </div>

          {/* S.U.R.G.E. — interlocking gears icon */}
          <div className="bg-white rounded-2xl p-7 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="mb-5">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 12h-2l-1-3h-2l-1 3h-2l-1.5 1.5v2L13 17v2l-1.5 1.5v2L13 24v2l-1.5 1.5" stroke="none" />
                <circle cx="20" cy="20" r="7" stroke="#1B2A4A" strokeWidth="1.5" />
                <circle cx="20" cy="20" r="3" stroke="#1B2A4A" strokeWidth="1.5" />
                <path d="M20 9v4M20 27v4M9 20h4M27 20h4M12.2 12.2l2.8 2.8M25 25l2.8 2.8M12.2 27.8l2.8-2.8M25 15l2.8-2.8" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="32" cy="30" r="5.5" stroke="#C8960C" strokeWidth="1.5" />
                <circle cx="32" cy="30" r="2" stroke="#C8960C" strokeWidth="1.5" />
                <path d="M32 22v3M32 33v3M24.5 30h3M35 30h3M26.6 24.1l2 2M35.4 33.9l2 2M26.6 35.9l2-2M35.4 26.1l2-2" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">S.U.R.G.E.</h3>
            <p className="text-[#C8960C] text-sm mb-3">The Cognitive Supremacy Model</p>
            <p className="text-gray-500 text-sm leading-relaxed">A five-step cognitive protocol guiding how students process challenges and convert them into actionable steps.</p>
          </div>

          {/* SSI — puzzle pieces icon */}
          <div className="bg-white rounded-2xl p-7 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="mb-5">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 10H12a2 2 0 00-2 2v10h4a3 3 0 010 6h-4v10a2 2 0 002 2h10v-4a3 3 0 016 0v4h10a2 2 0 002-2V28h-4a3 3 0 010-6h4V12a2 2 0 00-2-2H28v4a3 3 0 01-6 0v-4z" stroke="#1B2A4A" strokeWidth="1.5" strokeLinejoin="round" />
                <line x1="24" y1="10" x2="24" y2="40" stroke="#C8960C" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
                <line x1="10" y1="25" x2="38" y2="25" stroke="#C8960C" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">SSI</h3>
            <p className="text-[#C8960C] text-sm mb-3">Solution Seeking Index</p>
            <p className="text-gray-500 text-sm leading-relaxed">A proprietary measurement that captures clarity in framing, depth of idea solving, impact potential, experimentation, and ability to adapt.</p>
          </div>

          {/* AI Co-Founder — lightbulb with brain icon */}
          <div className="bg-white rounded-2xl p-7 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="mb-5">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 6C17.4 6 12 11.4 12 18c0 4.2 2.1 7.8 5.4 10.1V34a2 2 0 002 2h9.2a2 2 0 002-2v-5.9C33.9 25.8 36 22.2 36 18c0-6.6-5.4-12-12-12z" stroke="#1B2A4A" strokeWidth="1.5" />
                <path d="M19 38h10M21 42h6" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 18c0-2.2 1.8-4 4-4" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M24 12c1.5 0 3 .8 3.8 2" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="24" cy="20" r="1.5" fill="#C8960C" />
                <path d="M24 22v6" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M21 17c0 2 3 3 3 5" stroke="#C8960C" strokeWidth="1" strokeLinecap="round" />
                <path d="M27 17c0 2-3 3-3 5" stroke="#C8960C" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#1B2A4A] mb-1">AI Co-Founder</h3>
            <p className="text-[#C8960C] text-sm mb-3">Guided Human + AI Co-creation</p>
            <p className="text-gray-500 text-sm leading-relaxed">A structured assistant supporting problem analysis, idea refinement, zero-to-prototype translation, and pitch-building with AI collaboration norms.</p>
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold tracking-[0.25em] uppercase mb-2"><span className="text-[#C8960C]">THE LEARNING LADDER:</span> <span className="text-[#1B2A4A]">BUILD LIKE A TITAN</span></p>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Five connected workshops — each step prepares you for the next, from empathy to pitch.</p>
          </div>

          {/* Desktop: horizontal cards with arrows */}
          <div className="hidden lg:flex items-start justify-center gap-0">
            {/* Card 01 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 max-w-[220px] text-center hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[#C8960C] font-mono text-xs font-bold block mb-3">01</span>
              <div className="flex justify-center mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="10" stroke="#1B2A4A" strokeWidth="1.5" />
                  <line x1="25" y1="25" x2="34" y2="34" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="18" cy="18" r="4" stroke="#C8960C" strokeWidth="1" strokeDasharray="2 2" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-[#1B2A4A] italic mb-2">Discover &amp; Define</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Find real-world challenges and validate with empathy.</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center px-2 pt-16 shrink-0">
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none"><path d="M0 8h20M16 3l5 5-5 5" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            {/* Card 02 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 max-w-[220px] text-center hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[#C8960C] font-mono text-xs font-bold block mb-3">02</span>
              <div className="flex justify-center mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 30L20 6l10 24" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="14" y1="22" x2="26" y2="22" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="30" cy="12" r="5" stroke="#C8960C" strokeWidth="1.5" />
                  <path d="M30 9v6M27 12h6" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-[#1B2A4A] italic mb-2">Design the Difference</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Ideate and refine solutions with structure and user-centric design.</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center px-2 pt-16 shrink-0">
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none"><path d="M0 8h20M16 3l5 5-5 5" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            {/* Card 03 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 max-w-[220px] text-center hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[#C8960C] font-mono text-xs font-bold block mb-3">03</span>
              <div className="flex justify-center mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 28l-6-4V16l6-4 6 4v8l-6 4z" stroke="#1B2A4A" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M8 16l6 4 6-4" stroke="#1B2A4A" strokeWidth="1.5" strokeLinejoin="round" />
                  <line x1="14" y1="20" x2="14" y2="28" stroke="#1B2A4A" strokeWidth="1.5" />
                  <path d="M26 24l-6-4V12l6-4 6 4v8l-6 4z" stroke="#C8960C" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M20 12l6 4 6-4" stroke="#C8960C" strokeWidth="1.5" strokeLinejoin="round" />
                  <line x1="26" y1="16" x2="26" y2="24" stroke="#C8960C" strokeWidth="1.5" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-[#1B2A4A] italic mb-2">Prototype to Pitch</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Build, test, and iterate — turning ideas into real-world value.</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center px-2 pt-16 shrink-0">
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none"><path d="M0 8h20M16 3l5 5-5 5" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            {/* Card 04 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 max-w-[220px] text-center hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[#C8960C] font-mono text-xs font-bold block mb-3">04</span>
              <div className="flex justify-center mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6" y="22" width="6" height="12" rx="1" stroke="#1B2A4A" strokeWidth="1.5" />
                  <rect x="14" y="16" width="6" height="18" rx="1" stroke="#1B2A4A" strokeWidth="1.5" />
                  <rect x="22" y="10" width="6" height="24" rx="1" stroke="#C8960C" strokeWidth="1.5" />
                  <path d="M30 8l4-2M30 8l2 4" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-[#1B2A4A] italic mb-2">Market Mindset</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Understand your audience, craft your story, and fine-tune your pitch.</p>
            </div>

            {/* Arrow */}
            <div className="flex items-center px-2 pt-16 shrink-0">
              <svg width="24" height="16" viewBox="0 0 24 16" fill="none"><path d="M0 8h20M16 3l5 5-5 5" stroke="#C8960C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            {/* Card 05 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm flex-1 max-w-[220px] text-center hover:-translate-y-1 hover:shadow-md transition-all">
              <span className="text-[#C8960C] font-mono text-xs font-bold block mb-3">05</span>
              <div className="flex justify-center mb-4">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6v20" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M14 14l6-8 6 8" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 26c0-2 4-4 12-4s12 2 12 4v4H8v-4z" stroke="#C8960C" strokeWidth="1.5" strokeLinejoin="round" />
                  <line x1="8" y1="34" x2="32" y2="34" stroke="#1B2A4A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-[#1B2A4A] italic mb-2">Pitch Like a Pro</h4>
              <p className="text-gray-500 text-xs leading-relaxed">Confidently present and compete on the national stage.</p>
            </div>
          </div>

          {/* Mobile: stacked cards */}
          <div className="grid sm:grid-cols-2 gap-4 lg:hidden">
            {[
              { step: '01', title: 'Discover & Define', body: 'Find real-world challenges and validate with empathy.' },
              { step: '02', title: 'Design the Difference', body: 'Ideate and refine solutions with structure and user-centric design.' },
              { step: '03', title: 'Prototype to Pitch', body: 'Build, test, and iterate — turning ideas into real-world value.' },
              { step: '04', title: 'Market Mindset', body: 'Understand your audience, craft your story, and fine-tune your pitch.' },
              { step: '05', title: 'Pitch Like a Pro', body: 'Confidently present and compete on the national stage.' },
            ].map((w, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all text-center">
                <span className="text-[#C8960C] font-mono text-xs font-bold block mb-2">{w.step}</span>
                <h4 className="text-sm font-bold text-[#1B2A4A] italic mb-2">{w.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        className="relative bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8 py-16 lg:py-24" 
        style={{ backgroundImage: "url('/leaders-bg.jpg')" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-roca text-3xl md:text-5xl font-bold tracking-tight"><span className="text-white">What the </span><span className="text-[#C8960C]">leaders</span><span className="text-white"> say</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-[#C8960C]/30 transition-all relative">
                <span className="absolute top-4 right-6 text-5xl text-[#C8960C]/10 leading-none">&ldquo;</span>
                <div className="flex items-center gap-3 mb-4">
                  <Image src={t.image} alt={t.name} width={56} height={56} className="w-14 h-14 rounded-full object-cover border-2 border-[#C8960C]/30" />
                  <div>
                    <cite className="not-italic text-sm font-bold text-[#1B2A4A]">{t.name}</cite>
                    <p className="text-[#C8960C] text-xs">{t.title}</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{t.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold tracking-[0.25em] uppercase mb-2"><span className="text-[#C8960C]">THE COMPETITION</span> <span className="text-[#1B2A4A]">FORMAT</span></p>
            <p className="mt-4 text-gray-500">Three milestones from idea to national stage.</p>
          </div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block">
            {/* Timeline bar with numbered circles */}
            <div className="relative flex items-center justify-between max-w-2xl mx-auto mb-10">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-[#C8960C]/30 -translate-y-1/2" />
              {/* Circle 1 */}
              <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-[#C8960C] text-white text-xl font-bold shadow-lg shadow-[#C8960C]/25">1</div>
              {/* Circle 2 */}
              <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-[#C8960C] text-white text-xl font-bold shadow-lg shadow-[#C8960C]/25">2</div>
              {/* Circle 3 */}
              <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full bg-[#C8960C] text-white text-xl font-bold shadow-lg shadow-[#C8960C]/25">3</div>
            </div>

            {/* Phase cards */}
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <span className="text-[#C8960C] font-mono font-bold text-xs tracking-wider uppercase">PHASE 1</span>
                <h4 className="text-lg font-bold text-[#1B2A4A] mt-2 mb-3">Idea Submission (Virtual)</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Participants submit their refined concepts shaped using IDEA DNA, S.U.R.G.E., and early-level experimentation.</p>
              </div>
              <div>
                <span className="text-[#C8960C] font-mono font-bold text-xs tracking-wider uppercase">PHASE 2</span>
                <h4 className="text-lg font-bold text-[#1B2A4A] mt-2 mb-3">Pitch Video (Virtual)</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Participants communicate their concept through a short video pitch showcasing their problem insight, structured approach, and prototype.</p>
              </div>
              <div>
                <span className="text-[#C8960C] font-mono font-bold text-xs tracking-wider uppercase">PHASE 3</span>
                <h4 className="text-lg font-bold text-[#1B2A4A] mt-2 mb-3">The Grand Finale (Live Bootcamp)</h4>
                <p className="text-gray-500 text-sm leading-relaxed">Top 10-15 teams join a national bootcamp — deepening innovation models, receiving guidance from mentors, and pitching to a national jury.</p>
              </div>
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="md:hidden space-y-6">
            {[
              { num: '1', phase: 'PHASE 1', title: 'Idea Submission (Virtual)', body: 'Participants submit their refined concepts shaped using IDEA DNA, S.U.R.G.E., and early-level experimentation.' },
              { num: '2', phase: 'PHASE 2', title: 'Pitch Video (Virtual)', body: 'Participants communicate their concept through a short video pitch showcasing their problem insight, structured approach, and prototype.' },
              { num: '3', phase: 'PHASE 3', title: 'The Grand Finale (Live Bootcamp)', body: 'Top 10-15 teams join a national bootcamp — deepening innovation models, receiving guidance from mentors, and pitching to a national jury.' },
            ].map((p, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C8960C] text-white text-lg font-bold shadow-lg shadow-[#C8960C]/25">{p.num}</div>
                <div>
                  <span className="text-[#C8960C] font-mono font-bold text-xs tracking-wider">{p.phase}</span>
                  <h4 className="text-base font-bold text-[#1B2A4A] mt-1 mb-2">{p.title}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl min-h-[280px] flex items-center">
            {/* Background image */}
            <Image
              src="/images/yp/cta-trophy-bg.png"
              alt="Innovation platform"
              fill
              className="object-cover object-right"
              priority
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#051912]/95 via-[#051912]/80 to-[#051912]/30" />

            <div className="relative z-10 px-8 sm:px-12 lg:px-16 py-12 w-full">
              <div className="max-w-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">
                  More than a competition —
                </h2>
                <h2 className="text-2xl md:text-3xl font-bold text-[#C8960C] mb-5 leading-tight">
                  a national innovation platform.
                </h2>
                <p className="text-gray-300 text-sm mb-2 leading-relaxed">It replaces guesswork with a clear, engineered pathway —<br />so students work through validated processes, not vague creativity.</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-6">
                  <p className="text-[#C8960C] text-sm font-medium italic">The next emerging innovator could be you.</p>
                  <Link href="/signup" className="inline-flex items-center gap-2 border-2 border-[#C8960C] text-[#C8960C] px-6 py-2.5 rounded-full font-bold text-sm tracking-wider hover:bg-[#C8960C] hover:text-white transition-all whitespace-nowrap">
                    Register Now
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div >
  );
}
