'use client';

import Image from 'next/image';
import PublicNavbar from '@/components/shared/PublicNavbar';
import PublicFooter from '@/components/shared/PublicFooter';

const teamMembers = [
  { name: 'Devika Majumder', title: 'Founder & CEO', description: 'Wall Street Journal Featured · TedX Speaker · Nominated by Business Today as one of the most powerful women in business', image: '/images/yp/devika.jpg', linkedin: 'https://www.linkedin.com/in/devika-majumder' },
  { name: 'Fred Katz', title: 'Senior Advisor', description: 'Senior Professional Faculty, Johns Hopkins Carey Business School · President/CEO, Wise Products', image: '/images/yp/fred.jpeg', linkedin: 'https://www.linkedin.com/in/fred-katz-748b242' },
  { name: 'Suman Bose', title: 'Advisor', description: 'Founder, Project KREEA · Former CEO & MD, Siemens · Building India\'s Deeptech Hub', image: '/images/yp/suman.jpg', linkedin: 'https://www.linkedin.com/in/sumanbose' },
  { name: 'Partha Ghosh', title: 'Advisor', description: 'Founder, Partha Ghosh Leadership Academy IIT Kharagpur · Former McKinsey Senior Partner · MIT Professor', image: '/images/yp/partha.jpg', linkedin: 'https://www.linkedin.com/in/partha-ghosh-820b4a/' },
  { name: 'Dr. Julia Stamm', title: 'Advisor', description: 'Founder & CEO, She Shapes AI, London · Responsible Tech & AI for Impact · Fellow, Royal Society of Arts', image: '/images/yp/juliya.jpeg', linkedin: 'https://www.linkedin.com/in/dr-julia-stamm/' },
  { name: 'Pankaj Dubey', title: 'Advisor', description: 'Former Country Head & MD, Polaris India · Top 50 Indian Icon · ET Global Visionary Leader', image: '/images/yp/pankaj.jpg', linkedin: 'https://www.linkedin.com/in/pankajdubey1967' },
  { name: 'Jayesh Ranjan', title: 'Advisor', description: 'Special Chief Secretary, IT, Industries & Commerce, Government of Telangana', image: '/images/yp/jayesh.png', linkedin: 'https://www.linkedin.com/in/jayesh-ranjan-37415963/' },
  { name: 'Sachin Kapoor', title: 'Advisor', description: 'Former Sr Director & Head of BD, LinkedIn India · Founder & CEO, Trumsy.Ai', image: '/images/yp/sachin.jpeg', linkedin: 'https://www.linkedin.com/in/sachinkapoor/' },
  { name: 'Rajeev Barua', title: 'Advisor', description: 'Founder & CEO, SecondWrite · Professor of CS, University of Maryland · Ph.D. MIT · Contributed to chip dev with IBM', image: '/images/yp/rajeevbaura.jpeg', linkedin: 'https://www.linkedin.com/in/rajeev-barua/' },
];

const doers = [
  { name: 'SK Samim Mondal', description: 'The Fixer of All Things', image: '/images/yp/samim.jpg' },
  { name: 'Syeda Farhin', description: 'Architect of Aesthetics', image: '/images/yp/syeda.jpg' },
  { name: 'Chitresh Sen', description: 'Creative Disruptor', image: '/images/yp/chitresh.jpg' },
  { name: 'Diya Tikadar', description: 'Buzz Builder-in-Chief', image: '/images/yp/diya.jpg' },
  { name: 'Prashant Jadon', description: 'Technology Jedi', image: '/images/yp/prashant.jpeg' },
];

function PersonCard({ member, showLinkedIn = false }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#C8960C]/30 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      <div className="relative overflow-hidden aspect-[3/4] shrink-0">
        <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A4A] via-transparent to-transparent" />
      </div>
      <div className="p-5 relative -mt-14 z-10 flex-1 flex flex-col">
        {member.title && <p className="text-[#C8960C] text-xs font-bold tracking-widest uppercase mb-1">{member.title}</p>}
        <h3 className="text-lg font-bold text-white mb-1.5">{member.name}</h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-1">{member.description}</p>
        {showLinkedIn && member.linkedin && (
          <div className="mt-3">
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-8 h-8 bg-[#C8960C] hover:bg-[#1B2A4A] text-white text-xs font-bold rounded-full transition-colors">in</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Team() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Image src="/images/yp/teamHeaderBg.png" alt="Our Team" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B2A4A]/60 via-transparent to-white" />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#1B2A4A] mb-4">Meet Our Team</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">Real mentors don&apos;t just teach; they inspire, guide, and unlock potential. Meet the experts shaping the solution-seekers of tomorrow!</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((m, i) => <PersonCard key={i} member={m} showLinkedIn />)}
        </div>
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
