import Image from 'next/image';
import Link from 'next/link';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'About Us | Youngpreneurs' };

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full overflow-hidden pt-16 lg:pt-[72px] bg-[#0A101D]">
        <Image src="/images/yp/about-hero-new.png" alt="About Us Hero" width={1920} height={1080} className="w-full h-auto object-cover" priority />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          <div className="flex-1 space-y-8 max-w-2xl z-10">
            {/* Header Area */}
            <div>
              <span className="text-[#C8960C] text-xs font-bold tracking-widest uppercase mb-4 block">About Youngpreneurs</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#1B2A4A] leading-tight mb-6">
                India&apos;s First<br />
                <span className="text-[#C8960C]">Neuro-Adaptive</span><br />
                Entrepreneurial<br />
                Ecosystem
              </h2>
              <p className="text-gray-600 text-base leading-relaxed max-w-lg">
                We combine neuroscience, technology and entrepreneurship to create a learning experience that adapts to every student&apos;s unique cognitive strengths and learning style.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {[
                { title: 'Neuro-Adaptive Learning', desc: 'AI-powered paths tailored to how you think & learn.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /> },
                { title: 'Real-World Entrepreneurship', desc: 'Build, launch and scale real projects with real impact.', icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
                { title: 'Future-Ready Skills', desc: 'Critical thinking, creativity, leadership & innovation.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477-4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
                { title: 'Vibrant Community', desc: 'Connect, collaborate & grow with like-minded peers.', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /> }
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#FFFDF8] border border-[#F2EFE8] flex items-center justify-center shrink-0 text-[#C8960C] shadow-sm">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-[#1B2A4A] font-bold text-base mb-1">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature Area */}
            <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
              {/* <div className="text-4xl pr-2" style={{ fontFamily: 'cursive', color: '#1B2A4A', opacity: 0.9 }}>
                Tarcy
              </div> */}
              {/* <div className="text-xs text-gray-500 border-l-2 border-gray-100 pl-6 space-y-1"> */}
              <p>Mentored by Industry Leaders</p>
              <p>Backed by Educators &amp; Innovators</p>
              {/* </div> */}
            </div>
          </div>

          <div className="flex-1 w-full lg:max-w-none relative z-10">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/4.5] group bg-[#0A101D]">
              <Image src="/images/yp/about-main.png" alt="Young team" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />

              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A101D] via-[#0A101D]/40 to-transparent opacity-90 z-10" />

              {/* <div className="absolute bottom-8 right-8 flex items-center gap-4 cursor-pointer group/btn z-20">
                <div className="text-right">
                  <span className="block text-white text-sm font-medium mb-0.5">See How We</span>
                  <span className="block text-white/80 text-xs">Make It Possible</span>
                </div>
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform duration-300 text-[#1B2A4A]">
                  <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div> */}
            </div>
          </div>

        </div>
      </section >

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative" style={{ backgroundImage: 'radial-gradient(#E8E4D9 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Vision Card */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 lg:p-10 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow items-start">
            <div className="w-16 h-16 rounded-full bg-[#FFF5E6] flex items-center justify-center shrink-0 text-[#1B2A4A]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1B2A4A] mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-sm">To create a world where every young mind is empowered to solve meaningful problems, build impactful solutions and lead a better tomorrow.</p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="bg-white border border-gray-100 rounded-[2rem] p-8 lg:p-10 flex flex-col sm:flex-row gap-6 shadow-sm hover:shadow-md transition-shadow items-start">
            <div className="w-16 h-16 rounded-full bg-[#FFF5E6] flex items-center justify-center shrink-0 text-[#1B2A4A]">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 3l-8 8" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 3h5v5" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1B2A4A] mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-sm">To nurture entrepreneurial thinkers through neuro-adaptive learning, real-world exposure and a supportive ecosystem that helps them grow, fail, learn and succeed.</p>
            </div>
          </div>
        </div>
      </section>

      <section 
        className="w-full relative bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-8 py-20 lg:py-28 overflow-hidden"
        style={{ backgroundImage: "url('/leaders-bg.jpg')" }}
      >

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#C8960C] text-xs font-bold tracking-widest uppercase mb-4 block">Our Approach</span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Building an Entrepreneurial India,<br />
              <span className="text-[#C8960C]">One Teen at a Time</span>
            </h2>
            <div className="w-24 h-1 bg-[#C8960C] mx-auto rounded-full opacity-80"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Card 1: Think Differently */}
            <div className="bg-white border border-[#C8960C]/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_rgba(200,150,12,0.1)] hover:-translate-y-2 transition-all duration-300 group">
              <svg className="w-14 h-14 text-[#C8960C] mb-6 drop-shadow-[0_0_10px_rgba(200,150,12,0.6)] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-xl font-bold text-[#1B2A4A] mb-4">Think Differently</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Neuro-adaptive tools that help students understand their cognitive strengths and think in new dimensions.
              </p>
            </div>

            {/* Card 2: Build Confidently */}
            <div className="bg-white border border-purple-500/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:-translate-y-2 transition-all duration-300 group">
              <svg className="w-14 h-14 text-purple-400 mb-6 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <h3 className="text-xl font-bold text-[#1B2A4A] mb-4">Build Confidently</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Hands-on projects, mentorship and challenges to build confidence through real world action.
              </p>
            </div>

            {/* Card 3: Collaborate & Grow */}
            <div className="bg-white border border-orange-500/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_rgba(249,115,22,0.1)] hover:-translate-y-2 transition-all duration-300 group">
              <svg className="w-14 h-14 text-orange-400 mb-6 drop-shadow-[0_0_10px_rgba(249,115,22,0.6)] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-bold text-[#1B2A4A] mb-4">Collaborate &amp; Grow</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                A pan-India community of young innovators, mentors and changemakers collaborating together.
              </p>
            </div>

            {/* Card 4: Create Impact */}
            <div className="bg-white border border-blue-500/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:-translate-y-2 transition-all duration-300 group">
              <svg className="w-14 h-14 text-blue-400 mb-6 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <h3 className="text-xl font-bold text-[#1B2A4A] mb-4">Create Impact</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Transform ideas into impactful ventures that create value for society and the economy.
              </p>
            </div>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
              We&apos;re not just teaching business. We&apos;re building a movement of young innovators and problem solvers &mdash; the <span className="text-[#C8960C] font-semibold">future of India</span>, and the world.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-[#0F172A] border border-gray-800">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <Image src="/images/yp/about-cta-bg.png" alt="CTA Background" fill className="object-cover object-center" />
            </div>

            {/* Content */}
            <div className="relative z-10 py-16 lg:py-24 px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8 md:pl-48 lg:pl-64">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Ready to start your entrepreneurial journey?</h2>
                <p className="text-gray-300">Join thousands of young minds building the future, together.</p>
              </div>
              <div className="shrink-0">
                <Link href="/signup" className="inline-flex items-center justify-center bg-[#C8960C] hover:bg-[#a67c0a] text-[#1B2A4A] font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 min-w-[160px]">
                  Enroll Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div >
  );
}
