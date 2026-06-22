'use client';

import { useState } from 'react';
import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

const ambassadors = [
  { name: 'Naisha Kapoor', quote: 'Innovation begins the moment you decide to look deeper.', description: 'Naisha shares how a single moment of curiosity became the spark that led her to build something she never imagined possible.', video: '/images/yp/naishaVoice.mp4' },
  { name: 'Shivay Dhar', quote: 'Once you start building, the world starts opening up.', description: 'Shivay reflects on how stepping outside the classroom unlocked a version of himself that no exam had ever asked for.', video: '/images/yp/ShivayVoice.mp4' },
  { name: 'Krishika Shaw', quote: 'You find clarity when you start creating, not when you wait.', description: 'Krishika talks about how building her first idea gave her a clarity and direction she had never found in any textbook.', video: '/images/yp/KrishikaVoice.mp4' },
  { name: 'Kshitij Manish Kalunke', quote: 'Every big journey starts with one small spark.', description: 'Kshitij describes the moment that ignited his passion — sparking a journey of curiosity and continuous growth.', video: '/images/yp/kshitijVoice.mp4' },
];

const successStories = [
  { name: 'Advait Thakur', sub: 'Apex Infosys India', image: '/images/yp/Advait-Thakur.png', text: 'Founded Apex Infosys India at 12, pioneering AI and cybersecurity. By 16, became a Google-certified developer. Now 20, continues inspiring young tech entrepreneurs worldwide.' },
  { name: 'Mark Zuckerberg', sub: 'Facebook / Meta', image: '/images/yp/Mark-Zuckerberg.png', text: 'Founded Facebook at 19, transforming social networking forever. Now leads Meta, driving innovations in AI, virtual reality, and the metaverse.' },
  { name: 'Kaivalya Vohra', sub: 'Zepto', image: '/images/yp/kaivalya.png', text: "Co-founded Zepto at 19, disrupting India's quick-commerce with 10-minute delivery. Became one of India's youngest on the Hurun Rich List." },
  { name: 'Aadithyan Rajesh', sub: 'Trinet Solutions', image: '/images/yp/Aadithyan.png', text: 'Started coding at 5, first app at 9, founded Trinet Solutions at 13. Now 19, delivering cutting-edge digital solutions globally.' },
];

export default function SuccessStories() {
  const [idx, setIdx] = useState(0);

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full overflow-hidden pt-16 lg:pt-[72px] bg-[#0A101D]">
        <Image src="/hero.png" alt="Success Stories Hero" width={1920} height={1080} className="w-full h-auto object-cover" priority />
      </section>

      {/* <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1B2A4A] mb-4">Real Stories. Real Impact.</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Students aged 12–19 sharing how Youngpreneurs changed their journey.</p>
        </div>
      </section> */}

      {/* <section className="bg-[#FFFBF0] px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#C8960C] mb-6">The Power of Starting Early</h2>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            <p>YoungPreneurs is built on a simple belief: Innovation has no age — and vision grows when young minds are given the space to explore, question, and build.</p>
            <p>Meet the young founders who embody this belief. Through their experiences, they demonstrate what becomes possible when students begin shaping ideas with intention.</p>
          </div>
        </div>
      </section> */}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12 flex flex-col items-center">
          <span className="text-[#C8960C] text-xs font-bold tracking-widest uppercase">Meet Our Brand Ambassadors</span>
          <h2 className="text-3xl font-bold text-[#1B2A4A] mt-3 mb-4">Voices of Clarity, Courage, and Momentum.</h2>
          <div className="w-16 h-[2px] bg-[#C8960C]"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ambassadors.map((a, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-[#C8960C]/30 transition-all flex flex-col">
              <p className="text-[#C8960C] text-xs font-bold tracking-widest uppercase mb-3">{a.name}</p>
              <p className="text-[#1B2A4A] text-[15px] font-bold mb-4 flex-grow">&ldquo;{a.quote}&rdquo;</p>
              <div className="w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden bg-black mb-4 relative flex-shrink-0 shadow-sm">
                <video src={a.video} controls className="w-full h-full object-cover" preload="metadata" />
              </div>
              <p className="text-gray-500 leading-relaxed text-xs sm:text-sm">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-[#1B2A4A] mb-3">Greatness Begins with Belief</h2>
            <div className="w-16 h-[2px] bg-[#C8960C] mb-6"></div>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto mb-2">Every teen entrepreneur started with a spark — an idea, a dream, and most importantly,<br className="hidden sm:block" /> someone who believed in them.</p>
            <p className="text-[#1A5632] text-sm sm:text-base font-bold">Now, imagine what your child could achieve with that same belief.</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-10 shadow-lg shadow-gray-200/50 flex flex-col md:flex-row gap-8 items-center md:items-stretch">
            {/* Left side (Avatar + Info) */}
            <div className="flex flex-col items-center justify-center md:w-[35%] md:border-r border-gray-100 md:pr-8 flex-shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 border-2 border-[#C8960C] mb-4">
                <Image src={successStories[idx].image} alt={successStories[idx].name} width={128} height={128} className="w-full h-full rounded-full object-cover" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#1B2A4A] mb-1">{successStories[idx].name}</h3>
              <p className="text-[#C8960C] text-xs sm:text-sm mb-3 text-center">{successStories[idx].sub}</p>
              <div className="flex gap-1 text-[#C8960C] text-sm">{'★★★★★'}</div>
            </div>

            {/* Right side (Quote + Controls) */}
            <div className="flex flex-col justify-between md:w-[65%] md:pl-4 relative">
              <div>
                <span className="text-[#C8960C] text-6xl font-serif leading-none absolute -top-4 left-0 md:left-4">“</span>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base pt-8">{successStories[idx].text}</p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mt-8 md:mt-auto pt-4">
                <button onClick={() => setIdx(i => i === 0 ? successStories.length - 1 : i - 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-xs">&#10094;</button>
                <div className="flex gap-2 items-center">
                  {successStories.map((_, i) => (
                    <span key={i} className={`rounded-full transition-all duration-300 ${i === idx ? 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#C8960C]' : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-200'}`} />
                  ))}
                </div>
                <button onClick={() => setIdx(i => i === successStories.length - 1 ? 0 : i + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors text-xs">&#10095;</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12">
        <Image src="/images/yp/movement.png" alt="A Movement Led by Young Builders" width={1920} height={1080} className="w-full h-auto object-cover" />
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-center text-sm font-bold text-gray-400 tracking-widest uppercase mb-10">Backed by</h3>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14 lg:gap-20">
            <Image src="/images/yp/et.png" alt="Economic Times" width={262} height={148} className="h-14 sm:h-16 w-auto object-contain" />
            <Image src="/images/yp/startUpIndiaLogo.png" alt="Startup India" width={2000} height={528} className="h-12 sm:h-14 w-auto object-contain" />
            <Image src="/images/yp/AIPlogo.png" alt="Association of Indian Principals" width={339} height={149} className="h-14 sm:h-16 w-auto object-contain" />
            <Image src="/images/yp/AIClogo.png" alt="AIC BIMTECH" width={290} height={159} className="h-14 sm:h-16 w-auto object-contain" />
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
