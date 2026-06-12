import Image from 'next/image';
import Link from 'next/link';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

export const metadata = { title: 'For Schools | Youngpreneurs' };

export default function ForSchools() {
  /* Shield icon SVG paths for each benefit */
  const shieldIcons = [
    /* 01 – Globe/Flag */ (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="32" cy="26" r="14" stroke="#C8960C" strokeWidth="2"/>
        <ellipse cx="32" cy="26" rx="6" ry="14" stroke="#C8960C" strokeWidth="1.5"/>
        <line x1="18" y1="26" x2="46" y2="26" stroke="#C8960C" strokeWidth="1.5"/>
        <line x1="20" y1="19" x2="44" y2="19" stroke="#C8960C" strokeWidth="1"/>
        <line x1="20" y1="33" x2="44" y2="33" stroke="#C8960C" strokeWidth="1"/>
        <circle cx="22" cy="48" r="6" stroke="#C8960C" strokeWidth="2"/>
        <line x1="22" y1="42" x2="22" y2="40" stroke="#C8960C" strokeWidth="2"/>
        <line x1="32" y1="40" x2="22" y2="40" stroke="#C8960C" strokeWidth="2"/>
        <path d="M32 40 L44 44 L32 48 Z" stroke="#C8960C" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    /* 02 – Gear/Person */ (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="32" cy="22" r="8" stroke="#C8960C" strokeWidth="2"/>
        <path d="M18 50 C18 40 26 34 32 34 C38 34 46 40 46 50" stroke="#C8960C" strokeWidth="2" fill="none"/>
        <circle cx="46" cy="20" r="10" stroke="#C8960C" strokeWidth="1.5"/>
        <circle cx="46" cy="20" r="4" stroke="#C8960C" strokeWidth="1.5"/>
        <line x1="46" y1="8" x2="46" y2="11" stroke="#C8960C" strokeWidth="1.5"/>
        <line x1="46" y1="29" x2="46" y2="32" stroke="#C8960C" strokeWidth="1.5"/>
        <line x1="34" y1="20" x2="37" y2="20" stroke="#C8960C" strokeWidth="1.5"/>
        <line x1="55" y1="20" x2="58" y2="20" stroke="#C8960C" strokeWidth="1.5"/>
      </svg>
    ),
    /* 03 – Badge/Star */ (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <circle cx="32" cy="28" r="16" stroke="#C8960C" strokeWidth="2"/>
        <polygon points="32,16 35,24 44,24 37,29 39,38 32,33 25,38 27,29 20,24 29,24" stroke="#C8960C" strokeWidth="1.5" fill="none"/>
        <line x1="26" y1="44" x2="22" y2="58" stroke="#C8960C" strokeWidth="2"/>
        <line x1="38" y1="44" x2="42" y2="58" stroke="#C8960C" strokeWidth="2"/>
        <line x1="22" y1="58" x2="32" y2="52" stroke="#C8960C" strokeWidth="2"/>
        <line x1="42" y1="58" x2="32" y2="52" stroke="#C8960C" strokeWidth="2"/>
      </svg>
    ),
    /* 04 – Puzzle/Gear */ (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <rect x="12" y="12" rx="4" width="18" height="18" stroke="#C8960C" strokeWidth="2"/>
        <rect x="34" y="12" rx="4" width="18" height="18" stroke="#C8960C" strokeWidth="2"/>
        <rect x="12" y="34" rx="4" width="18" height="18" stroke="#C8960C" strokeWidth="2"/>
        <rect x="34" y="34" rx="4" width="18" height="18" stroke="#C8960C" strokeWidth="2"/>
        <circle cx="32" cy="21" r="5" stroke="#C8960C" strokeWidth="1.5"/>
        <circle cx="21" cy="32" r="5" stroke="#C8960C" strokeWidth="1.5"/>
        <path d="M38 40 L44 34 L50 40 L47 40 L47 48 L41 48 L41 40 Z" stroke="#C8960C" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    /* 05 – Trophy */ (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
        <path d="M20 12 H44 V30 C44 40 38 46 32 46 C26 46 20 40 20 30 Z" stroke="#C8960C" strokeWidth="2" fill="none"/>
        <path d="M20 18 H12 C12 18 10 28 20 28" stroke="#C8960C" strokeWidth="2" fill="none"/>
        <path d="M44 18 H52 C52 18 54 28 44 28" stroke="#C8960C" strokeWidth="2" fill="none"/>
        <line x1="32" y1="46" x2="32" y2="52" stroke="#C8960C" strokeWidth="2"/>
        <line x1="24" y1="52" x2="40" y2="52" stroke="#C8960C" strokeWidth="2"/>
        <polygon points="32,20 34,26 40,26 35,30 37,36 32,32 27,36 29,30 24,26 30,26" stroke="#C8960C" strokeWidth="1" fill="#C8960C" fillOpacity="0.3"/>
      </svg>
    ),
  ];

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

      <section className="relative w-full overflow-hidden">
        <Image src="/images/yp/forSchoolsHero.png" alt="For Schools – Students collaborating" width={1920} height={1080} className="w-full h-auto object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-[10%] left-0 right-0 px-6 sm:px-10 lg:px-16">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase leading-tight tracking-wide drop-shadow-lg max-w-4xl">
            <span className="text-[#C8960C]">The Future</span>{' '}
            <span className="text-white">of a Nation is</span>
            <br />
            <span className="text-[#C8960C]">Built</span>{' '}
            <span className="text-white">Inside Its Classrooms.</span>
            <br />
            <span className="text-white">— Dr. A.P.J. Abdul Kalam</span>
          </h1>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col gap-6">
          {benefits.map((c, i) => (
            <div key={i} className="relative flex items-start gap-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
              {/* Shield icon */}
              <div className="flex-shrink-0 w-16 h-24 flex items-center justify-center rounded-b-[2.5rem] rounded-t-lg bg-gradient-to-b from-[#1B2A4A] to-[#1A5632] shadow-md">
                {shieldIcons[i]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <span className="text-[#C8960C] font-bold text-2xl sm:text-3xl block mb-1">{c.num}</span>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#1B2A4A] mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">{c.body}</p>
              </div>

              {/* Dot pattern decoration (top-right) */}
              <div className="absolute top-3 right-3 grid grid-cols-3 gap-[3px] opacity-30">
                {[...Array(9)].map((_, d) => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#C8960C]" />
                ))}
              </div>

              {/* Gold chevron (bottom-right) */}
              <div className="absolute bottom-4 right-5 text-[#C8960C] text-xl font-bold opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                »
              </div>

              {/* Hover top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1B2A4A] via-[#C8960C] to-[#1B2A4A] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pt-4 pb-16 lg:pt-4 lg:pb-24 bg-white">
        <div className="max-w-lg mx-auto text-center">
          <Image src="/images/yp/forSchoolsMiddle.png" alt="Why Encourage Your Students" width={1080} height={1200} className="w-full h-auto rounded-2xl shadow-xl" />
          <Link href="/contact" className="inline-block mt-8 bg-[#C8960C] text-white px-10 py-4 rounded-full font-bold text-sm tracking-wider hover:bg-[#b5870b] transition-all shadow-lg shadow-[#C8960C]/20">
            Join the Movement
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
