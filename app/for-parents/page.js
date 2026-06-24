import Image from 'next/image';
import Link from 'next/link';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'For Parents | Youngpreneurs' };

export default function ForParents() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <PublicNavbar />

      {/* 1. Hero Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-24 lg:pb-20 lg:pt-32">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F4F8] mb-8">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#1B2A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21" stroke="#1B2A4A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm font-bold text-[#1B2A4A]">For Parents</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1B2A4A] leading-[1.1] mb-4">
              Don&apos;t Let Your Child<br />
              <span className="text-[#C8960C]">Fall Behind</span><br />
              in the Age of AI.
            </h1>

            {/* Gold underline */}
            <div className="w-16 h-[3px] bg-[#C8960C] mb-8"></div>

            {/* Body */}
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed mb-8">
              <p>As a parent, you want the absolute best for your teenager. But as the world rapidly accelerates with AI, automation, and constant innovation, a common fear is emerging: Will AI take away jobs? Will my child be replaced?</p>

              <div className="border-l-4 border-green-600 pl-5 py-1 my-6 bg-green-50/50 rounded-r-lg">
                <p className="text-gray-900 font-bold">The hard truth is: AI won&apos;t replace people — people who know how to use AI will replace those who don&apos;t.</p>
              </div>

              <p>At Future Titans by YoungPreneurs, we don&apos;t teach students to fear AI. We teach them to master it. We shift them from being passive consumers of technology to active creators. They learn to leverage AI as a powerful tool to build real-world solutions, completely future-proofing their careers.</p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-[#C8960C] text-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide hover:bg-[#b5870b] transition-all shadow-lg shadow-[#C8960C]/20">
                Register Now — Secure Your Child&apos;s Spot
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              {/* <button className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-[#1B2A4A] bg-white px-8 py-4 rounded-xl font-bold text-sm tracking-wide hover:border-gray-300 hover:bg-gray-50 transition-all">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download Brochure
              </button> */}
            </div>

            {/* Trust markers */}
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8960C" strokeWidth="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Trusted by Parents</span>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8960C" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Loved by Students</span>
              <span className="text-gray-300 hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C8960C" strokeWidth="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg> Recognized by Experts</span>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 w-full relative flex lg:justify-end mt-12 lg:mt-20">
            <div className="relative w-full max-w-2xl">
              <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl">
                <Image src="/images/yp/for-parents-hero.png" fill className="object-cover object-top" alt="Students with AI hologram" priority />
              </div>

              {/* Floating Quote Box */}
              <div className="absolute -bottom-16 lg:-bottom-20 left-1/2 -translate-x-1/2 bg-cover bg-center bg-no-repeat p-6 lg:p-8 rounded-2xl border border-[#C8960C]/40 shadow-2xl w-[90%] sm:w-[450px] max-w-full z-10 rounded-br-[2rem] rounded-tl-[1rem]" style={{ backgroundImage: "url('/new-footer-bg.jpg')" }}>
                <div className="text-[#C8960C] text-5xl font-serif leading-[0] mb-5">“</div>
                <p className="text-white text-base lg:text-lg font-medium leading-relaxed mb-4">
                  Behind every young child who believes in himself is a parent who believed first..
                </p>
                <p className="text-gray-300 text-sm">— Matthew L. Jacobson</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Middle Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col xl:flex-row gap-10 lg:gap-14 items-center xl:items-start">

          {/* Left Cards */}
          <div className="w-full xl:w-[58%]">
            <h3 className="text-sm font-bold text-[#1B2A4A] tracking-widest uppercase mb-8">Why Support Your Child&apos;s Journey?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6">
              {[
                {
                  title: 'A Definitive Edge',
                  text: "Future Titans isn't just a competition — it's a proven launchpad. Your child learns skills that schools don't teach but top universities and employers desperately look for.",
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 22c-.88-.88-2.61-3.15-2.61-3.15L8.5 19v-4.5L5.35 11.35c-2.3-2.3-2.3-6.04 0-8.34a5.9 5.9 0 0 1 8.34 0l3.15 3.15H21v2.39l-3.15 2.39S15.58 12.62 14.7 13.5z"></path><path d="m8.5 19-3-3"></path><path d="m14 14-3 3"></path></svg>
                },
                {
                  title: 'From Consumers to Creators',
                  text: "They will stop passively consuming content and start actively building real solutions, discovering what they're truly capable of achieving.",
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path></svg>
                },
                {
                  title: 'Future-Proofing their Career',
                  text: "It's a journey that nurtures vision, courage, and tech-fluency (including AI), preparing them to lead confidently in any field they choose.",
                  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 lg:p-8 hover:border-[#C8960C]/30 hover:shadow-md transition-all shadow-sm flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#0E514B] text-white flex items-center justify-center mb-5 shrink-0">
                    {item.icon}
                  </div>
                  <h4 className="text-[#1B2A4A] font-extrabold text-base lg:text-lg mb-3">{item.title}</h4>
                  <p className="text-gray-500 text-xs lg:text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image (Dark section) */}
          <div className="w-full xl:w-[42%] max-w-lg mx-auto xl:mr-0 xl:ml-auto">
            <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl bg-[#031A15]">
              <Image
                src="/images/yp/for-parents-middle.png"
                alt="Year long journey"
                width={800}
                height={800}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Stats Strip */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 lg:p-12 flex flex-col xl:flex-row items-center gap-10">
          <h3 className="text-3xl font-bold text-[#1B2A4A] w-full xl:w-[250px] leading-tight text-center xl:text-left">
            The Future They Build Today
          </h3>

          <div className="flex-1 flex flex-col sm:flex-row flex-wrap xl:flex-nowrap justify-between w-full divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[
              {
                num: '12 Months',
                text: 'Of Transformative Learning',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"></path><path d="M12 12 2.1 7.1"></path><path d="m12 12 9.9 4.9"></path></svg>
              },
              {
                num: '50+',
                text: 'Hands-on Workshops & Mentorship Hours',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
              },
              {
                num: '1 Goal',
                text: 'Confident, Future-Ready Leaders',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              },
              {
                num: '∞ Possibilities',
                text: 'Limitless Impact They Can Create',
                icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"></path></svg>
              },
            ].map((stat, i) => (
              <div key={i} className="flex-1 flex flex-col items-center text-center px-4 py-6 sm:py-0">
                <div className="text-[#0E514B] mb-4">
                  {stat.icon}
                </div>
                <div className="text-2xl font-extrabold text-[#C8960C] mb-2">{stat.num}</div>
                <div className="text-sm font-bold text-[#1B2A4A] max-w-[160px]">{stat.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Section */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="relative rounded-[2.5rem] overflow-hidden w-full bg-[#051912] min-h-[400px] flex items-center">
          {/* Background Image */}
          <Image
            src="/images/yp/for-parents-cta.png"
            fill
            className="object-cover object-right"
            alt="Child looking at future"
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#051912] via-[#051912]/90 to-transparent"></div>

          <div className="relative z-10 p-10 lg:p-16 max-w-2xl w-full">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.2] mb-6">
              Don&apos;t let your child miss this opportunity to shine, learn, and grow into the <span className="text-[#C8960C]">leader of tomorrow.</span>
            </h2>

            <p className="text-white text-lg font-medium mb-10 flex items-center gap-3">
              <span className="w-6 h-[2px] bg-white inline-block"></span>
              YoungPreneurs Competition Team
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-[#C8960C] text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-[#b5870b] transition-all">
                Register Now
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white bg-transparent px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide hover:bg-white/10 transition-all backdrop-blur-sm">
                Talk to Our Team
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
