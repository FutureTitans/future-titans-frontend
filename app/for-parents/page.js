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
              Every great change in the world started with a young mind daring to imagine.
            </h2>
            <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
              <p>At Future Titans by YoungPreneurs, we provide your child not just guidance, but the space, mentorship, and tools to become a true change-maker. This is where curiosity sparks action, ideas find their wings, and potential unfolds into impact.</p>
              <p>As the world accelerates with AI, automation, and constant innovation, the most valuable gift you can give your child isn&apos;t answers — it&apos;s the ability to question, create, and take bold steps.</p>
              <p>Future Titans is more than a challenge. It&apos;s a movement of young innovators, problem-solvers, and creators — a journey that shapes character, ignites purpose, and equips them to lead in a world defined by constant change.</p>
            </div>
            <Link href="/signup" className="inline-block bg-[#C8960C] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-[#b5870b] transition-all shadow-lg shadow-[#C8960C]/20">
              Get Started
            </Link>
          </div>
          <div className="flex-1 space-y-5">
            <h3 className="text-xl font-bold text-[#1B2A4A] uppercase tracking-wider">Why Support Your Child&apos;s Journey?</h3>
            {[
              "Future Titans is not just any competition — it's India's first national entrepreneurship movement for school students, where ideas meet opportunity.",
              "Your child will explore uncharted challenges, test their own solutions, and discover what they're truly capable of.",
              "It's a journey that nurtures vision, courage, and leadership, preparing them not just to compete, but to create, impact, and lead."
            ].map((text, i) => (
              <div key={i} className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-6 hover:border-[#C8960C]/30 hover:shadow-sm transition-all">
                <p className="text-gray-600 leading-relaxed">{text}</p>
              </div>
            ))}
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
