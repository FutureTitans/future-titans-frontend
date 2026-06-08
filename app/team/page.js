'use client';

import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

const doers = [
  { name: 'SK Samim Mondal', description: 'The Fixer of All Things', image: '/images/yp/samim.jpg' },
  { name: 'Syeda Farhin', description: 'Architect of Aesthetics', image: '/images/yp/syeda.jpg' },
  { name: 'Chitresh Sen', description: 'Creative Disruptor', image: '/images/yp/chitresh.jpg' },
  { name: 'Diya Tikadar', description: 'Buzz Builder-in-Chief', image: '/images/yp/diya.jpg' },
  { name: 'Prashant Jadon', description: 'Technology Jedi', image: '/images/yp/prashant.jpeg' },
];

function PersonCard({ member }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#C8960C]/30 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[3/4] shrink-0">
        <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A] via-transparent to-transparent" />
      </div>
      <div className="p-5 relative -mt-14 z-10 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-1.5">{member.name}</h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-1">{member.description}</p>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/yp/teamHeaderBg.png" alt="Meet the Doers" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/60 via-transparent to-white" />
      </section>

      <section className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 border border-[#C8960C]/50 rounded-full text-[#C8960C] text-xs font-bold tracking-widest uppercase mb-4">The Engine Room</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#1B2A4A]">Meet the Doers</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {doers.map((m, i) => <PersonCard key={i} member={m} />)}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
