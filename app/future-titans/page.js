'use client';

import Image from 'next/image';
import Link from 'next/link';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

const testimonials = [
  { name: 'Devika Majumder', title: 'Founder & CEO', image: '/images/yp/devika.jpg', quote: "As a founder, I believe in the power of an innovator's eye, a founder's grit, and an entrepreneurial mindset—not just for building businesses, but for shaping fearless, future-ready individuals." },
  { name: 'Suman Bose', title: 'Former CEO & MD Siemens', image: '/images/yp/suman.jpg', quote: "In a world that's changing faster than ever, an entrepreneurial mindset isn't just an advantage—it's a necessity. Future Titans is about building fearless, future-ready leaders!" },
  { name: 'Sandipan Chattopadhyay', title: 'Former CTO Justdial', image: '/images/yp/sandipan.jpeg', quote: "Entrepreneurship is about problem-solving, adaptability, and resilience. Future Titans ignites that mindset in young minds." },
  { name: 'Dr. Julia Stamm', title: 'Founder & CEO, She Shapes AI, UK', image: '/images/yp/juliya.jpeg', quote: "Equipping our youth with an entrepreneurial mindset will create a generation of future leaders who can connect the dots and solve today's complex problems." },
  { name: 'Fred Katz', title: 'Johns Hopkins Carey Business School', image: '/images/yp/fred.jpeg', quote: "Entrepreneurship is about thinking big, understanding risks, and solving real-world problems. Future Titans is giving young minds the platform they need." },
  { name: 'Dr. Partha Ghosh', title: 'Former Senior Partner at McKinsey', image: '/images/yp/partha.jpg', quote: "To succeed, leaders have to think and act beyond borders, keeping in focus the locale — both requirements and assets." },
];

export default function FutureTitans() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="bg-[#1B2A4A] relative overflow-hidden min-h-[80vh] flex items-end pb-16 pt-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B2A4A] via-transparent to-[#1B2A4A]/80" />
        <div className="max-w-4xl mx-auto relative z-10 text-center lg:text-left w-full">
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
            <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/90">YoungPreneurs presents</span>
            <span className="rounded-full bg-[#C8960C]/15 px-4 py-1.5 text-xs font-semibold text-[#C8960C] ring-1 ring-[#C8960C]/30">National Challenge</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            Future Titans
            <span className="block text-[#C8960C] mt-2">Build. Compete. Lead.</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-8">
            India&apos;s innovation challenge for students aged <strong className="text-white">12–19</strong> — with a hands-on workshop journey before you pitch on the national stage.
          </p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-[#C8960C] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-white hover:text-[#1B2A4A] transition-all">
            Register Now
          </Link>
          <div className="mt-10 flex flex-wrap gap-3 justify-center lg:justify-start">
            {[{ k: 'AGES', v: '12–19' }, { k: 'FORMAT', v: 'Workshops + 3 Phases' }, { k: 'FOCUS', v: 'Innovation Mindset' }].map((item) => (
              <div key={item.k} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm min-w-[140px]">
                <p className="text-[10px] font-bold tracking-widest text-[#C8960C]/80">{item.k}</p>
                <p className="mt-1 text-sm font-semibold text-white">{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
        <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">A USA–India initiative backed by leaders in education, policy, and media.</p>
        <div className="flex justify-center mb-12">
          <div className="rounded-2xl border border-gray-100 bg-white px-12 py-8 shadow-sm">
            <Image src="/images/yp/ttoi.png" alt="Times of India" width={220} height={122} className="h-16 sm:h-20 w-auto mx-auto" />
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14 lg:gap-20">
          <Image src="/images/yp/startUpIndiaLogo.png" alt="Startup India" width={2000} height={528} className="h-12 sm:h-16 w-auto object-contain" />
          <Image src="/images/yp/AIPlogo.png" alt="Association of Indian Principals" width={339} height={149} className="h-14 sm:h-18 w-auto object-contain" />
          <Image src="/images/yp/AIClogo.png" alt="AIC BIMTECH" width={290} height={159} className="h-14 sm:h-18 w-auto object-contain" />
        </div>
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1B2A4A]">Building India&apos;s <span className="text-[#C8960C]">tomorrow</span>, today</h2>
            <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
              <p>We&apos;re entering an age where AI creates faster than we can imagine. The future belongs to young innovators who see possibilities where others see limits.</p>
              <p>Future Titans by YoungPreneurs — a national challenge designed to equip India&apos;s teens with the solution-seeking mindset.</p>
              <p>Before the competition, every participant goes through a 5-part &quot;Build Like a Titan&quot; workshop series — a hands-on, globally benchmarked journey.</p>
            </div>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-[#C8960C] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-[#b5870b] transition-all">
              Start your journey →
            </Link>
          </div>
          <div className="flex-1 max-w-lg">
            <Image src="/images/yp/classroom.jpg" alt="Students learning" width={600} height={450} className="w-full rounded-2xl object-cover shadow-xl border border-gray-100" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-5xl font-bold text-[#1B2A4A] mb-4">The architecture behind <span className="text-[#C8960C]">Future Titans</span></h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">A patent-pending innovation architecture designed for the next generation.</p>
        </div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {[
            { title: 'IDEA DNA', sub: 'The Structured Innovation Pipeline', body: 'A four-stage progression: Innovate → Design → Experiment → Apply. A clear, structured, and repeatable innovation sequence.' },
            { title: 'S.U.R.G.E.', sub: 'The Cognitive Sequencing Protocol', body: 'A five-step cognitive protocol guiding how students process challenges and convert them into actionable steps.' },
            { title: 'SSI', sub: 'Solution-Seeking Index', body: 'A proprietary measurement index capturing clarity in framing challenges, quality of idea design, approach to experimentation, and ability to apply insights.' },
            { title: 'AI Co-Founder', sub: 'A Guided Thinking Companion', body: 'A structured assistant supporting problem analysis, idea refinement, step-by-step breakdown, and pitch clarity. Introduces the human–AI collaboration model.' },
          ].map((c, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-[#C8960C]/30 hover:-translate-y-1 hover:shadow-lg transition-all group">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#C8960C]/10 text-sm font-bold text-[#C8960C] ring-1 ring-[#C8960C]/25">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-xl font-bold text-[#1B2A4A]">{c.title}</h3>
                  <p className="text-[#C8960C] text-sm mt-1">{c.sub}</p>
                  <div className="w-12 h-px bg-[#C8960C]/30 my-3" />
                  <p className="text-gray-600 leading-relaxed">{c.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1B2A4A]">The learning ladder: <span className="text-[#C8960C]">Build Like a Titan</span></h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">Five connected workshops — each step prepares you for the next, from empathy to pitch.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Discover & Define', body: 'Empathy-driven exploration of real-world challenges' },
              { step: '02', title: 'Design the Difference', body: 'Master ideation tools to uncover what makes their solution stand out' },
              { step: '03', title: 'Prototype to Pitch', body: 'Bring ideas to life using no-code tools, rapid testing, and iteration' },
              { step: '04', title: 'Map Your Model', body: 'Learn monetization and scalability — turning ideas into viable models' },
              { step: '05', title: 'Pitch Like a Pro', body: 'A masterclass in influence, refining delivery and confidence' },
            ].map((w, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#C8960C]/30 transition-all">
                <span className="text-[#C8960C] font-mono text-2xl font-black opacity-30 block mb-2">{w.step}</span>
                <h4 className="text-sm font-bold text-[#1B2A4A] mb-2">{w.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A4A]">What the <span className="text-[#C8960C]">leaders</span> say</h2>
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
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#C8960C]">The competition format</h2>
            <p className="mt-4 text-gray-500">Three milestones from idea to national stage.</p>
          </div>
          <div className="space-y-6">
            {[
              { phase: 'Phase 1', title: 'Idea Submission (Virtual)', body: 'Participants submit their refined concepts shaped using IDEA DNA, S.U.R.G.E., and early-level experimentation.' },
              { phase: 'Phase 2', title: 'Pitch Video (Virtual)', body: 'Participants communicate their concept through a short video pitch showcasing their problem insight, structured approach, and prototype.' },
              { phase: 'Phase 3', title: 'The Grand Finale (Live Bootcamp)', body: 'The Top 50 Titans join a national bootcamp — deepening innovation models, receiving guidance from mentors, and pitching to a national jury.' },
            ].map((p, i) => (
              <div key={i} className="flex gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C8960C] text-white text-sm font-bold shadow-lg shadow-[#C8960C]/20">{i + 1}</div>
                <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#C8960C]/30 transition-all">
                  <span className="text-[#C8960C] font-mono font-bold text-xs tracking-wider">{p.phase}</span>
                  <h4 className="text-lg font-bold text-[#1B2A4A] mt-1 mb-2">{p.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <div className="bg-[#1B2A4A] rounded-3xl p-10 lg:p-14 relative overflow-hidden">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
            More than a competition — <span className="text-[#C8960C]">a national innovation platform</span>
          </h2>
          <p className="text-gray-300 text-lg mb-4 max-w-2xl mx-auto">It replaces guesswork with a clear, engineered pathway — so students work through defined processes, not vague creativity.</p>
          <p className="text-[#C8960C] text-xl mt-6 mb-8">The next emerging innovator could be you.</p>
          <Link href="/signup" className="inline-block bg-[#C8960C] text-white px-10 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-white hover:text-[#1B2A4A] transition-all">
            Register Now
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
