import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'About Us | Youngpreneurs' };

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/yp/headerBg.png" alt="About Us" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/60 via-transparent to-white" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6 max-w-2xl">
            <h2 className="text-3xl lg:text-5xl font-bold text-[#1B2A4A] leading-tight">
              YoungPreneurs — India&apos;s First <span className="text-[#C8960C]">Neuro-Adaptive</span> Entrepreneurial Ecosystem
            </h2>
            <div className="space-y-5 text-gray-600 text-lg leading-relaxed">
              <p>The future belongs not to those who wait for opportunities, but to those who create them. YoungPreneurs is India&apos;s first patent-pending neuro-adaptive entrepreneurial ecosystem, designed to transform young minds into innovators, problem-solvers, and future leaders.</p>
              <p>Powered by our proprietary <strong className="text-[#1B2A4A]">IDEA DNA Mindset Engine</strong> and the <strong className="text-[#1B2A4A]">S.U.R.G.E.</strong> execution framework, it builds the internal architecture of innovation — teaching students to generate ideas, navigate complexity, and convert challenges into actionable solutions.</p>
              <p>Through immersive workshops, structured innovation models, real-world challenges, and guided execution, students progress from sparks of imagination to validated, scalable solutions. Their growth is tracked using the <strong className="text-[#1B2A4A]">Solution-Seeking Index (SSI)</strong> — India&apos;s first metric to quantify entrepreneurial mindset.</p>
              <p>Guided by global experts and backed by The Times of India, YoungPreneurs fuels <strong className="text-[#C8960C]">Future Titans</strong>, India&apos;s premier entrepreneurship challenge for school students.</p>
            </div>
          </div>
          <div className="flex-1 max-w-lg">
            <div className="relative rounded-3xl overflow-hidden shadow-xl">
              <Image src="/images/yp/about-main.png" alt="Young team" width={600} height={750} className="w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {[
            { title: 'Our Vision', text: "A Generation That Sees Problems as Opportunities. A future where every teen looks at a challenge and thinks — \"Let's solve it.\" Where every classroom becomes a catalyst for change, and education becomes the engine that innovates tomorrow." },
            { title: 'Our Mission', text: "To build a nation of solution-seekers, not just job-seekers. By fusing AI, neuroscience, and education, we inspire every teen to see possibilities, create meaningful solutions, and shape the future." }
          ].map((card, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 lg:p-10 shadow-sm hover:shadow-md hover:border-[#C8960C]/30 transition-all">
              <h3 className="text-2xl font-bold text-[#C8960C] mb-4">{card.title}</h3>
              <p className="text-gray-600 leading-relaxed text-lg">{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h2 className="text-3xl lg:text-5xl font-bold text-[#1B2A4A] text-center mb-12">
          Building an Entrepreneurial India,<br /><span className="text-[#C8960C]">One Teen at a Time</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            "The world is evolving faster than ever. AI, automation, and emerging technologies are reshaping careers. The skill that matters most is the entrepreneurial mindset: the ability to solve problems, create solutions, and lead with purpose.",
            "Future Titans by YoungPreneurs is India's national entrepreneurship movement for students aged 12–19 — a launchpad empowering young innovators to act decisively, think boldly, and build solutions that matter.",
            "Students transform problems into prototypes and ideas into ventures using the proven framework: IDEA DNA → S.U.R.G.E. → SSI. Guided by global faculty including Prof. Fred Katz (Johns Hopkins) and Sandipan Chattopadhyay (Former CTO, Justdial)."
          ].map((text, i) => (
            <div key={i} className="bg-[#FAFAFA] border border-gray-100 rounded-2xl p-8 hover:-translate-y-1 hover:shadow-lg hover:border-[#C8960C]/30 transition-all">
              <p className="text-gray-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xl text-[#1B2A4A] font-light max-w-3xl mx-auto text-center leading-relaxed">
          With mentorship from innovators and leaders from MIT, IIT, Fortune 50 companies, Siemens, Justdial — students gain early exposure to world-class thinking. <strong className="font-semibold">Here, innovation is not just learned — it is experienced, built, and embodied.</strong>
        </p>
      </section>

      <PublicFooter />
    </div>
  );
}
