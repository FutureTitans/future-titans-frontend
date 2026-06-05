import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'Media & Press | Youngpreneurs' };

const mediaItems = [
  { logo: '/images/yp/statesman.png', desc: "Youngpreneurs' new mantra", button: 'Read More', link: 'https://epaper.thestatesman.com/c/78671280' },
  { logo: '/images/yp/businesStandard.png', desc: "Three US-based entrepreneurs' mission to make leaders out of Indian teens...", button: 'Read More', link: 'https://www.business-standard.com/article/companies/us-based-entrepreneurs-eyes-indian-teens-to-create-future-leaders-117061200838_1.html' },
  { logo: '/images/yp/bussinessworld.png', desc: 'Our Mission Is To Connect Education And Entrepreneur Ecosystem In India...', button: 'Read More', link: 'https://www.businessworld.in/article/%E2%80%98our-mission-is-to-connect-education-and-entrepreneur-ecosystem-in-india%E2%80%99-122972' },
  { logo: '/images/yp/et.png', desc: 'Meet eight budding teenpreneurs who are giving wings to their startup ideas...', button: 'Read More', link: 'https://economictimes.indiatimes.com/small-biz/entrepreneurship/meet-eight-budding-teenpreneurs-who-are-giving-wings-to-their-startup-ideas/articleshow/59007317.cms' },
  { logo: '/images/yp/cnbc.png', desc: '', button: 'Watch Now', link: 'https://www.facebook.com/watch/?v=1062508397224697' },
  { logo: '/images/yp/enterpreneurIndia.png', desc: "It's Time The Indian Students' Entrepreneurship Streak Is Tapped in School...", button: 'Read More', link: 'https://www.entrepreneur.com/en-in/starting-a-business/its-time-the-indian-students-entrepreneurship-streak-is/294662' },
  { logo: '/images/yp/telegraph.png', desc: '', button: 'Read More', link: 'https://youngpreneurs.in/the-telegraph/' },
  { logo: '/images/yp/ibns.png', desc: 'Kolkata: Students get hands-on training at the Youngpreneurs India Camp...', button: 'Read More', link: 'https://indiablooms.com/life/kolkata-students-get-hands-on-training-at-the-youngpreneurs-india-camp/details' },
];

export default function Media() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/yp/mediaHeaderBg.png" alt="Media & Press" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/60 via-transparent to-white" />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1B2A4A] mb-4">Media & Press</h2>
          <p className="text-gray-500 text-lg">What the media is saying about YoungPreneurs</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mediaItems.map((item, i) => (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="group bg-white border border-gray-100 rounded-2xl p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-[#C8960C]/30 hover:-translate-y-1 transition-all no-underline">
              <div className="w-full h-16 flex items-center justify-center mb-4">
                <Image src={item.logo} alt="Media" width={120} height={48} className="max-h-full max-w-full object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
              </div>
              {item.desc && <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow">{item.desc}</p>}
              <span className="inline-block bg-[#C8960C] text-white px-5 py-2 rounded-full text-xs font-bold tracking-wider hover:bg-[#b5870b] transition-colors">
                {item.button}
              </span>
            </a>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
