import Image from 'next/image';
import Link from 'next/link';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'Academy | Youngpreneurs' };

export default function Academy() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/yp/academy.png" alt="Academy" fill className="object-cover object-right" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/70 via-transparent to-white" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-start gap-16">
          <div className="flex-1 space-y-8 max-w-2xl">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1B2A4A]">What Makes Us <span className="text-[#C8960C]">Different</span></h2>
            {[
              { t: 'Global Learning. Indian Roots. Future-Ready Minds.', p: "At YoungPreneurs Academy, we bring world-class entrepreneurial education directly to Indian classrooms — tailored for the next generation of innovators." },
              { t: 'A Curriculum Built for the Future', p: "Rooted in the IDEA DNA Mindset Engine and guided by the S.U.R.G.E. execution framework. From ideation to prototyping, from market testing to pitching." },
              { t: 'Learning by Building, Measured by Growth', p: "Every experience is hands-on. Progress tracked through the Solution-Seeking Index (SSI) — India's first quantified metric for entrepreneurial mindset." },
              { t: 'Mentorship That Matters', p: "Students connect with global thought leaders, professors from top universities, and seasoned entrepreneurs who guide them through challenges." },
              { t: 'Turning Ideas into Impact', p: "More than a learning program — it's a launchpad. Students graduate with the ability to not just dream, but execute, measure, and scale their ideas." },
            ].map((item, i) => (
              <div key={i}>
                <h4 className="text-lg font-bold text-[#C8960C] mb-2">{item.t}</h4>
                <p className="text-gray-600 leading-relaxed">{item.p}</p>
              </div>
            ))}
          </div>
          <div className="flex-1 max-w-lg space-y-6">
            <Image src="/images/yp/aca3.jpg" alt="Students" width={600} height={450} className="w-full rounded-2xl object-cover shadow-xl border border-gray-100" />
            <Image src="/images/yp/aca4.jpg" alt="Activities" width={480} height={360} className="w-4/5 ml-auto rounded-2xl object-cover shadow-lg border border-gray-100" />
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1B2A4A]">Our Signature <span className="text-[#C8960C]">Programs</span></h2>
            {[
              { t: "Future Titans — India's Biggest School Entrepreneurship Challenge", p: "A nationwide movement where young minds dream, design, and deliver. From virtual workshops to a live national pitch." },
              { t: 'Build Like a Titan — 5-Step Innovation Journey', p: "Discover → Design → Prototype → Model → Pitch. Every participant earns a Globally Recognized Certificate." },
              { t: 'Train-the-Trainer — Empowering Educators Nationwide', p: "We equip teachers with entrepreneurial frameworks and tools to turn classrooms into innovation labs." },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-[#C8960C]/30 hover:shadow-sm transition-all">
                <h4 className="text-lg font-bold text-[#1B2A4A] mb-2">{item.t}</h4>
                <p className="text-gray-600 leading-relaxed">{item.p}</p>
              </div>
            ))}
          </div>
          <div className="flex-1 max-w-lg">
            <Image src="/images/yp/curriculum-image.jpg" alt="Entrepreneur" width={500} height={666} className="w-full rounded-2xl object-cover shadow-xl border border-gray-100" />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1B2A4A]">Our <span className="text-[#C8960C]">Vision</span></h2>
            <p className="text-xl text-gray-600 leading-relaxed">To make entrepreneurial thinking as fundamental as math and science — so every student in India learns not just to find a job, but to <strong className="text-[#1B2A4A]">create impact.</strong></p>
            {[
              { t: 'Future-Focused Curriculum', p: "From Design Thinking to Business Model Canvas — every framework is adapted from what real founders use." },
              { t: 'Learning by Building', p: "Students don't just learn about ideas — they build them, test them, and pitch them to real mentors and investors." },
            ].map((item, i) => (
              <div key={i}>
                <h4 className="text-lg font-bold text-[#C8960C] mb-2">{item.t}</h4>
                <p className="text-gray-600 leading-relaxed">{item.p}</p>
              </div>
            ))}
          </div>
          <div className="flex-1 max-w-lg">
            <Image src="/images/yp/aca1.jpg" alt="Students" width={600} height={450} className="w-full rounded-2xl object-cover shadow-xl border border-gray-100" />
          </div>
        </div>
      </section>

      <section className="bg-[#FFFBF0] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-[#1B2A4A] mb-6">Join the <span className="text-[#C8960C]">Movement</span></h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">Be part of the revolution transforming how India learns. Whether you&apos;re a student ready to build, a teacher ready to inspire, or a school ready to lead.</p>
          <Link href="/signup" className="inline-block bg-[#C8960C] text-white px-10 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-[#b5870b] transition-all shadow-lg shadow-[#C8960C]/20">
            Join YoungPreneurs Academy
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
