'use client';

import { useState } from 'react';
import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

const ambassadors = [
  { name: 'Naisha Kapoor', quote: 'Innovation begins the moment you decide to look deeper.', description: 'Naisha shares how observing the world around her led her to channel her curiosity into building something of value.', video: '/images/yp/naishaVoice.mp4' },
  { name: 'Shivay Dhar', quote: 'Once you start building, the world starts opening up.', description: 'Shivay reflects on how experimenting with ideas broadened his perspective and helped him recognise hidden opportunities.', video: '/images/yp/ShivayVoice.mp4' },
  { name: 'Krishika Shaw', quote: 'You find clarity when you start creating, not when you wait.', description: 'Krishika talks about how taking her first step brought focus, structure, and direction to her journey.', video: '/images/yp/KrishikaVoice.mp4' },
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

      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/yp/voicesBanner.png" alt="Success Stories" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/60 via-transparent to-white" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1B2A4A] mb-4">Real Stories. Real Impact.</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Students aged 12–19 sharing how Youngpreneurs changed their journey.</p>
        </div>
      </section>

      <section className="bg-[#FFFBF0] px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#C8960C] mb-6">The Power of Starting Early</h2>
          <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
            <p>YoungPreneurs is built on a simple belief: Innovation has no age — and vision grows when young minds are given the space to explore, question, and build.</p>
            <p>Meet the young founders who embody this belief. Through their experiences, they demonstrate what becomes possible when students begin shaping ideas with intention.</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="text-[#C8960C] text-xs font-bold tracking-widest uppercase">Meet Our Brand Ambassadors</span>
          <h2 className="text-3xl font-bold text-[#1B2A4A] mt-3">Voices of clarity, courage, and momentum.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {ambassadors.map((a, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-md hover:border-[#C8960C]/30 transition-all">
              <p className="text-[#C8960C] text-xs font-bold tracking-widest uppercase mb-2">{a.name}</p>
              <p className="text-[#1B2A4A] text-lg font-bold mb-4">&ldquo;{a.quote}&rdquo;</p>
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-4">
                <video src={a.video} controls className="w-full h-full object-cover" preload="metadata" />
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B2A4A] mb-4">Greatness Begins with Belief</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">Every teen entrepreneur started with a spark — an idea, a dream, and most importantly, someone who believed in them.</p>
          <p className="text-[#1B2A4A] text-lg font-bold">Now, imagine what your child could achieve with that same belief.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
            <Image src={successStories[idx].image} alt={successStories[idx].name} width={128} height={128} className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-[#C8960C]/20" />
            <h3 className="text-xl font-bold text-[#1B2A4A] mb-1">{successStories[idx].name}</h3>
            <p className="text-[#C8960C] text-sm mb-4">{successStories[idx].sub}</p>
            <div className="flex justify-center gap-1 text-[#C8960C] text-lg mb-4">{'★★★★★'}</div>
            <p className="text-gray-600 leading-relaxed">{successStories[idx].text}</p>
          </div>
          <div className="flex justify-center gap-6 mt-6">
            <button onClick={() => setIdx(i => i === 0 ? successStories.length - 1 : i - 1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xl">&#10094;</button>
            <button onClick={() => setIdx(i => i === successStories.length - 1 ? 0 : i + 1)} className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 text-xl">&#10095;</button>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#1B2A4A] rounded-2xl p-8 lg:p-10">
          <p className="text-[#C8960C] text-xs font-bold tracking-widest uppercase mb-3">A Movement Led by Young Builders</p>
          <p className="text-gray-300 text-lg leading-relaxed">These young founders represent the mindset India needs — curious, driven, structured, and courageous. Their journeys show the power of starting early and the strength of the solution-seeking mindset.</p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-center text-sm font-bold text-gray-400 tracking-widest uppercase mb-10">Backed by</h3>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14 lg:gap-20">
            <Image src="/images/yp/ttoi.png" alt="Times of India" width={220} height={122} className="h-14 sm:h-16 w-auto object-contain" />
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
