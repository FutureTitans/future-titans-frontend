'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Linkedin, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

const SOCIAL_LINKS = [
  { Icon: Instagram, href: 'https://www.instagram.com/youngpreneurs.ai?igsh=MWtlMW9weHU0NnUwOA==' },
  { Icon: Facebook, href: 'https://www.facebook.com/share/16jUKyEemq/?mibextid=wwXIfr' },
  { Icon: Linkedin, href: 'https://www.linkedin.com/company/youngpreneurs-ai/' },
];

const COLUMNS = [
  {
    title: 'Programs',
    links: [
      { label: 'Future Titans', href: '/future-titans' },
    ],
  },
  {
    title: 'For Parents',
    links: [
      { label: 'Overview', href: '/for-parents' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    title: 'For Schools',
    links: [
      { label: 'Overview', href: '/for-schools' },
      { label: 'Success Stories', href: '/success-stories' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { label: 'Our Story', href: '/about-us' },
      { label: 'Our Team', href: '/team' },
      { label: 'Media', href: '/media' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

export default function PublicFooter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5006/api';
      const res = await fetch(`${apiUrl}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        // Reset to idle after 4 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 4000);
      } else {
        setStatus('error');
        setMessage(data.message || 'Something went wrong.');
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 4000);
      }
    } catch (err) {
      setStatus('error');
      setMessage('Unable to connect. Please try again later.');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 4000);
    }
  };

  return (
    <footer className="bg-[#1B2A4A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {/* Logo + Social */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <div className="mb-4">
              <img src="/images/yp/yp-logo-full.png" alt="Youngpreneurs" className="h-12 w-auto object-contain brightness-0 invert" />
            </div>
            <div className="flex items-center gap-3 mt-4">
              {SOCIAL_LINKS.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href !== '#' ? '_blank' : undefined}
                  rel={href !== '#' ? 'noopener noreferrer' : undefined}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:bg-[#C8960C] hover:text-white transition-all"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-[#F5D76E] text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(({ label, href }) => (
                  <li key={label}>
                    {href === '#' ? (
                      <a href="#" className="text-white text-sm hover:text-[#C8960C] transition-colors">
                        {label}
                      </a>
                    ) : (
                      <Link href={href} className="text-white text-sm hover:text-[#C8960C] transition-colors">
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stay Updated */}
          <div>
            <h4 className="font-bold text-[#F5D76E] text-sm mb-3">Stay Updated</h4>
            <p className="text-white text-xs mb-3">Get updates on programs, events &amp; opportunities.</p>
            <form onSubmit={handleSubscribe}>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success'}
                  className="flex-1 min-w-0 px-3 py-2 bg-white/10 border border-white/10 !rounded-l-lg !rounded-r-none text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#C8960C] !min-h-0 h-10 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || status === 'success'}
                  className="px-3 py-2 bg-[#C8960C] rounded-r-lg hover:bg-[#b5870b] transition-colors disabled:opacity-50 flex items-center justify-center min-w-[40px]"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </form>
            {message && (
              <p className={`text-xs mt-2 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>&copy; 2026 youngpreneurs.ai &middot; All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
