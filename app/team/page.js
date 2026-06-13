'use client';

import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

const doers = [
  { name: 'SK Samim Mondal', description: 'The Fixer of All Things', image: '/images/yp/samim.jpg', icon: 'bank' },
  { name: 'Syeda Farhin', description: 'Architect of Aesthetics', image: '/images/yp/syeda.jpg', icon: 'pen' },
  { name: 'Chitresh Sen', description: 'Creative Disruptor', image: '/images/yp/chitresh.jpg', icon: 'bulb' },
  { name: 'Diya Tikadar', description: 'Buzz Builder-in-Chief', image: '/images/yp/diya.jpg', icon: 'star' },
  { name: 'Prashant Jadon', description: 'Technology Jedi', image: '/images/yp/prashant.jpeg', icon: 'code' },
];

function PersonCard({ member }) {
  const getIcon = (type) => {
    switch(type) {
      case 'bank': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="M3 21h18"/><path d="M4 17V7"/><path d="M8 17V7"/><path d="M12 17V7"/><path d="M16 17V7"/><path d="M20 17V7"/><path d="M22 7H2v-2l10-3 10 3z"/></svg>;
      case 'pen': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>;
      case 'bulb': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.54.55 2.8 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>;
      case 'star': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
      case 'code': return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
      default: return null;
    }
  };

  return (
    <div className="group relative rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow bg-[#0A101D] aspect-[4/4.5] w-full border-b-[6px] border-[#C8960C]">
      <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
      
      {/* Top Left Badge */}
      <div className="absolute top-0 left-6 bg-[#C8960C] px-3 pb-4 pt-3 rounded-b-xl shadow-sm z-20">
        {getIcon(member.icon)}
      </div>
      
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A101D] via-[#0A101D]/40 to-transparent z-10" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex justify-between items-end">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
          <p className="text-[#C8960C] text-sm font-medium">{member.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full overflow-hidden pt-16 lg:pt-[72px] bg-[#0A101D]">
        <Image src="/images/yp/team-hero-new.png" alt="Meet the Doers Hero" width={1920} height={1080} className="w-full h-auto object-cover" priority />
      </section>

      <section className="bg-[#F8F9FA] px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="inline-block px-5 py-1.5 border border-[#C8960C]/50 rounded-full text-[#C8960C] text-xs font-bold tracking-widest uppercase mb-6 bg-white shadow-sm">The Engine Room</span>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#1B2A4A] mb-4">
              Meet the <span className="text-[#2B4B8B]">Doers</span>
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-10 h-px bg-[#C8960C]"></div>
              <svg className="w-4 h-4 text-[#C8960C]" viewBox="0 0 24 24" fill="currentColor"><path d="M3 21h18v-2H3v2zm4-4h2V7H7v10zm6 0h2V7h-2v10zm-3 0h2V7h-2v10zm-3 0h2V7H7v10zm-4-10v10h2V7H3zm16 0h-2v10h2V7zM12 2L2 7h20L12 2z"/></svg>
              <div className="w-10 h-px bg-[#C8960C]"></div>
            </div>
            <p className="text-gray-500 text-sm md:text-base">The brilliant minds driving Future Titans forward.</p>
          </div>
          
          <div className="flex flex-col items-center gap-8">
            {/* Top Row (3 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {doers.slice(0, 3).map((m, i) => <PersonCard key={i} member={m} />)}
            </div>
            {/* Bottom Row (2 cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-2/3">
              {doers.slice(3, 5).map((m, i) => <PersonCard key={i} member={m} />)}
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
