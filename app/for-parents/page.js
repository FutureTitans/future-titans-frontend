import Image from 'next/image';
import Link from 'next/link';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'For Parents | Youngpreneurs' };

export default function ForParents() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/yp/forParentsHeader.png" alt="For Parents" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/60 via-transparent to-white" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-6 max-w-2xl">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#C8960C] leading-tight">
              Don&apos;t Let Your Child Fall Behind in the Age of AI.
            </h2>
            <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
              <p>As a parent, you want the absolute best for your teenager. But as the world rapidly accelerates with AI, automation, and constant innovation, a common fear is emerging: Will AI take away jobs? Will my child be replaced?</p>
              <p>The hard truth is: <strong className="text-[#1B2A4A]">AI won&apos;t replace people — people who know how to use AI will replace those who don&apos;t.</strong></p>
              <p>At Future Titans by YoungPreneurs, we don&apos;t teach students to fear AI. We teach them to master it. We shift them from being passive consumers of technology to active creators. They learn to leverage AI as a powerful tool to build real-world solutions, completely future-proofing their careers.</p>
            </div>
            <Link href="/signup" className="inline-block bg-[#C8960C] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-[#b5870b] transition-all shadow-lg shadow-[#C8960C]/20">
              Register Now — Secure Your Child&apos;s Spot
            </Link>
          </div>
          <div className="flex-1 space-y-5">
            <h3 className="text-xl font-bold text-[#1B2A4A] uppercase tracking-wider">Why Support Your Child&apos;s Journey?</h3>
            {[
              { title: 'A Definitive Edge', text: "Future Titans isn't just a competition — it's a proven launchpad. Your child learns skills that schools don't teach but top universities and employers desperately look for." },
              { title: 'From Consumers to Creators', text: "They will stop passively consuming content and start actively building real solutions, discovering what they're truly capable of achieving." },
              { title: 'Future-Proofing Their Career', text: "It's a journey that nurtures vision, courage, and tech-fluency (including AI), preparing them to lead confidently in any field they choose." },
            ].map((item, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-6 hover:border-[#C8960C]/30 hover:shadow-sm transition-all">
                <h4 className="text-[#1B2A4A] font-bold text-base mb-2">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl lg:text-3xl font-bold text-[#1B2A4A] text-center mb-6">This is not a one-day competition. It&apos;s a year-long journey.</h3>
          <div className="bg-white border border-gray-100 rounded-2xl p-8 lg:p-10 shadow-sm">
            <p className="text-gray-600 text-lg leading-relaxed mb-4">Most programs drop your child into a weekend event and call it &ldquo;entrepreneurship.&rdquo; Youngpreneurs is built differently. Over 12 months, your child is continuously learning, building, iterating, and growing — guided by world-class mentors, tracked by India&apos;s first entrepreneurial mindset index (SSI), and supported by a community of equally driven peers.</p>
            <p className="text-gray-600 text-lg leading-relaxed">Every skill compounds. Every session adds to the last. By the time your child reaches the national stage, they don&apos;t just have a pitch — <strong className="text-[#1B2A4A]">they have a transformation.</strong></p>
          </div>
        </div>
      </section>

      <section className="bg-[#FFFBF0] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-3xl md:text-4xl font-bold text-[#1B2A4A] leading-tight mb-6">
            Don&apos;t let your child miss this opportunity to shine, learn, and grow into the <span className="text-[#C8960C]">leader of tomorrow.</span>
          </p>
          <p className="text-gray-500 text-lg mb-8">— YoungPreneurs Competition Team</p>
          <Link href="/signup" className="inline-block bg-[#C8960C] text-white px-10 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-[#b5870b] transition-all shadow-lg shadow-[#C8960C]/20">
            Register Now
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
