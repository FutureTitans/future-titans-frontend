import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'Media & Press | Youngpreneurs' };

const mediaItems = [
  { logo: '/images/yp/statesman.png', desc: "Youngpreneurs' new mantra for future-ready education and entrepreneurship.", button: 'Read More', link: 'https://epaper.thestatesman.com/c/78671280' },
  { logo: '/images/yp/businesStandard.png', desc: "Three US-based entrepreneurs' mission to make leaders out of Indian teens.", button: 'Read More', link: 'https://www.business-standard.com/article/companies/us-based-entrepreneurs-eyes-indian-teens-to-create-future-leaders-117061200838_1.html' },
  { logo: '/images/yp/bussinessworld.png', desc: 'Our Mission Is To Connect Education And Entrepreneur Ecosystem In India.', button: 'Read More', link: 'https://www.businessworld.in/article/%E2%80%98our-mission-is-to-connect-education-and-entrepreneur-ecosystem-in-india%E2%80%99-122972' },
  { logo: '/images/yp/et.png', desc: 'Meet eight budding teenpreneurs who are giving wings to their startup ideas.', button: 'Read More', link: 'https://economictimes.indiatimes.com/small-biz/entrepreneurship/meet-eight-budding-teenpreneurs-who-are-giving-wings-to-their-startup-ideas/articleshow/59007317.cms' },
  { logo: '/images/yp/cnbc.png', desc: "Young entrepreneurs redefining India's innovation story at school level.", button: 'Watch Now', link: 'https://www.facebook.com/watch/?v=1062508397224697' },
  { logo: '/images/yp/enterpreneurIndia.png', desc: "It's Time The Indian Students' Entrepreneurship Streak Is Tapped in School.", button: 'Read More', link: 'https://www.entrepreneur.com/en-in/starting-a-business/its-time-the-indian-students-entrepreneurship-streak-is/294662' },
  { logo: '/images/yp/telegraph.png', desc: 'Schools nurturing future founders through experiential learning.', button: 'Read More', link: 'https://youngpreneurs.in/the-telegraph/' },
  { logo: '/images/yp/ibns.png', desc: 'Kolkata: Students get hands-on training at the Youngpreneurs India Camp.', button: 'Read More', link: 'https://indiablooms.com/life/kolkata-students-get-hands-on-training-at-the-youngpreneurs-india-camp/details' },
  { logo: '/images/yp/ttoi.png', desc: 'Youngpreneurs featured on The Times of India for empowering the next generation of student entrepreneurs.', button: 'View Feature', link: 'https://7zyndjjpfgoyixzt.public.blob.vercel-storage.com/Times%20of%20India%20Youngpreneurs%20feature%20copy%201.pdf' },
];

export default function Media() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full overflow-hidden pt-16 lg:pt-[72px] bg-[#0A101D]">
        <Image src="/images/yp/media-hero-new.png" alt="Media & Press Hero" width={1920} height={1080} className="w-full h-auto object-cover" priority />
      </section>

      <section className="bg-[#FFFDF8] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative" style={{ backgroundImage: 'radial-gradient(#E8E4D9 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#C8960C]"></div>
              <span className="text-[#C8960C] text-xs font-bold tracking-widest uppercase">IN THE SPOTLIGHT</span>
              <div className="w-8 h-px bg-[#C8960C]"></div>
            </div>
            <h2 className="text-4xl lg:text-5xl font-serif text-[#1B2A4A] mb-6">Media & Press</h2>
            <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
              Explore how leading media houses are covering the stories, achievements, and impact of Youngpreneurs and Future Titans.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaItems.map((item, i) => (
              <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="group bg-[#FAFAFA] border border-[#E8E4D9] rounded-xl p-8 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all no-underline relative overflow-hidden">
                {/* Bookmark Icon */}
                <div className="absolute top-6 right-6 text-[#C8960C]">
                  <svg className="w-6 h-6 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M10 8h4v8l-2-1.5L10 16V8z" />
                  </svg>
                </div>
                
                {/* Logo */}
                <div className="h-10 flex flex-col justify-center items-start mb-6 w-[80%]">
                  <Image src={item.logo} alt="Media" width={140} height={40} className="max-h-full w-auto object-contain object-left mix-blend-multiply" />
                </div>
                
                {/* Description */}
                <p className="text-[#1B2A4A] text-[15px] leading-relaxed mb-6 flex-grow font-medium">
                  {item.desc}
                </p>
                
                {/* Divider */}
                <div className="w-8 h-px bg-[#C8960C] opacity-50 mb-6"></div>
                
                {/* Button */}
                <div className="mt-auto flex">
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C8960C] to-[#D4A017] text-white px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all">
                    {item.button}
                    {item.button === 'Watch Now' ? (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    ) : (
                      <span>&rarr;</span>
                    )}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-[#FFFDF8] pb-12">
        <Image src="/images/yp/media-bottom-cta.png" alt="Youngpreneurs Media Impact" width={1920} height={1080} className="w-full h-auto object-cover" />
      </section>

      <PublicFooter />
    </div>
  );
}
