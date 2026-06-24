'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';
import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '700', '800'],
  style: ['normal', 'italic'],
});

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(el); } },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

const doers = [
  { name: 'SK Samim Mondal', description: 'The Fixer of All Things', image: '/images/yp/samim.jpg', icon: 'bank' },
  { name: 'Syeda Farhin', description: 'Architect of Aesthetics', image: '/images/yp/syeda.jpg', icon: 'pen' },
  { name: 'Chitresh Sen', description: 'Creative Disruptor', image: '/images/yp/chitresh.jpg', icon: 'bulb' },
  { name: 'Diya Tikadar', description: 'Buzz Builder-in-Chief', image: '/images/yp/diya.jpg', icon: 'star' },
  { name: 'Prashant Jadon', description: 'Technology Jedi', image: '/images/yp/prashant.jpeg', icon: 'code' },
];

const minds = [
  { name: 'Devika Majumder', description: 'Founder & CEO · WSJ Featured · TedX Speaker · Business Today Most Powerful Women', image: '/images/yp/devika.jpg', icon: 'star' },
  { name: 'Prof. Fred Katz', description: 'Senior Professional Faculty, Johns Hopkins Carey Business School · President/CEO, Wise Products', image: '/images/yp/fred.jpeg', icon: 'bank' },
  { name: 'Dr. Partha Ghosh', description: 'Founder, Partha Ghosh Leadership Academy IIT Kharagpur · Former McKinsey Senior Partner · MIT Professor', image: '/images/yp/partha.jpg', icon: 'bulb' },
  { name: 'Suman Bose', description: 'Founder, Project KREEA · Former CEO & MD, Siemens · Building India\'s Deeptech Hub', image: '/images/yp/suman.jpg', icon: 'bank' },
  { name: 'Sachin Kapoor', description: 'Former Sr Director & Head of BD, LinkedIn India · Founder & CEO, Trumsy.Ai', image: '/images/yp/sachin.jpeg', icon: 'star' },
  { name: 'Dr. Julia Stamm', description: 'Founder & CEO, She Shapes AI, London · Responsible Tech & AI for Impact · Fellow, Royal Society of Arts', image: '/images/juliya.jpg', icon: 'bulb' },
  { name: 'Rajeev Barua', description: 'Founder & CEO, SecondWrite · Professor of CS, University of Maryland · Ph.D. MIT · Contributed to chip dev with IBM', image: '/images/rajeev.jpg', icon: 'code' },
];

function PersonCard({ member }) {
  return (
    <div className="group relative rounded-[2rem] overflow-hidden hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow bg-[#0A101D] aspect-[4/4.5] w-full border-b-[6px] border-[#C8960C]">
      <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
      
      {/* Top Left Badge Removed */}
      
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

      {/* ═══ MENTORS ═══ */}
      <section className="py-16 lg:py-20 bg-[#FAFAFA] border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className={`${playfair.className} text-3xl sm:text-4xl font-bold text-[#123c1f] mb-4`}>
                Meet the Minds Behind the Program
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Every mentor, practitioner, and educator on our team brings one thing: a genuine investment in what young people are capable of.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-col items-center gap-8 max-w-6xl mx-auto">
              {/* Row 1 (3 cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {minds.slice(0, 3).map((m, i) => <PersonCard key={i} member={m} />)}
              </div>
              {/* Row 2 (3 cards) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {minds.slice(3, 6).map((m, i) => <PersonCard key={i} member={m} />)}
              </div>
              {/* Row 3 (1 card) */}
              <div className="grid grid-cols-1 gap-6 w-full md:w-1/2 lg:w-1/3">
                {minds.slice(6, 7).map((m, i) => <PersonCard key={i} member={m} />)}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="inline-block px-5 py-1.5 border border-[#C8960C]/50 rounded-full text-[#C8960C] text-xs font-bold tracking-widest uppercase mb-6 bg-white shadow-sm">The Engine Room</span>
            <h2 className="text-4xl lg:text-5xl font-serif font-bold text-[#123c1f] mb-4">
              Meet the <span className="text-[#123c1f]">Doers</span>
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
