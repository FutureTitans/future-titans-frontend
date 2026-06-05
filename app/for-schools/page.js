import Image from 'next/image';
import Link from 'next/link';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'For Schools | Youngpreneurs' };

export default function ForSchools() {
  const benefits = [
    { num: '01', title: 'Be a Flagbearer of Innovation', body: "Position your school at the forefront of a national transformation. In partnership with The Times of India, YoungPreneurs recognizes visionary institutions as Torchbearers of Innovation." },
    { num: '02', title: 'Empower Your Educators', body: "Through our Train-the-Trainer Program, your educators gain hands-on exposure to Design Thinking, Business Model Canvas, and IDEA DNA frameworks." },
    { num: '03', title: 'Certification & Recognition', body: "Partner schools receive an official certification from The Times of India and YoungPreneurs Academy, recognizing their commitment to fostering innovation." },
    { num: '04', title: 'Seamless Implementation', body: "Built on a plug-and-play model, Future Titans integrates effortlessly. With complete resources, SSI evaluation, and dedicated support at every step." },
    { num: '05', title: 'National Recognition & Impact', body: "Your school earns visibility and distinction on a national level — celebrated for fostering innovation, leadership, and the entrepreneurial spirit." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/yp/forSchoolsHeaderBg.png" alt="For Schools" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/60 via-transparent to-white" />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((c, i) => (
            <div key={i} className="relative bg-white border border-gray-100 rounded-2xl p-8 lg:p-10 hover:border-[#C8960C]/30 hover:-translate-y-1 hover:shadow-lg transition-all group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C8960C] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              <span className="text-[#C8960C] font-mono text-3xl font-black opacity-20 mb-3 block">{c.num}</span>
              <h3 className="text-xl font-bold text-[#1B2A4A] mb-3">{c.title}</h3>
              <div className="w-12 h-px bg-[#C8960C] mb-3" />
              <p className="text-gray-600 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/yp/forschools.jpg" alt="Classroom" fill className="object-cover opacity-10" />
        </div>
        <div className="relative bg-[#FFFBF0] px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-[#1B2A4A] mb-6">Why Encourage Your Students?</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">The next CEO, innovator, or changemaker might be sitting in your classroom right now. Future Titans gives them the chance — and your school, the legacy.</p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">With national exposure, investor-backed mentorship, and real startup funding on the line, this is more than participation — it&apos;s a chance to put your school&apos;s name in India&apos;s innovation story.</p>
            <p className="text-[#C8960C] font-bold text-xl mb-8">Is your school ready to make history?</p>
            <Link href="/contact" className="inline-block bg-[#C8960C] text-white px-10 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-[#b5870b] transition-all shadow-lg shadow-[#C8960C]/20">
              Join the Movement
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
