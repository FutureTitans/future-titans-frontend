'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, ArrowRight, User, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { isAuthenticated, isStudent, isAdmin } from '@/lib/auth';
import { auth } from '@/lib/api';

const NAV_LINKS = [
  { label: 'Future Titans', href: '/future-titans' },
  { label: 'For Parents', href: '/for-parents' },
  { label: 'For Schools', href: '/for-schools' },
  { label: 'Success Stories', href: '/success-stories' },
  { label: 'Media', href: '/media' },
  { label: 'Team', href: '/team' },
  { label: 'About Us', href: '/about-us' },
];

const SECONDARY_LINKS = [
  { label: 'Contact', href: '/contact' },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const { user, hydrateUser } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [loginDropdownOpen, setLoginDropdownOpen] = useState(false);
  const [mobileLoginDropdownOpen, setMobileLoginDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileName, setProfileName] = useState(null);
  const dropdownRef = useRef(null);
  const dropdownTimeout = useRef(null);
  const loginDropdownRef = useRef(null);
  const loginDropdownTimeout = useRef(null);

  useEffect(() => {
    hydrateUser();
    setMounted(true);
  }, [hydrateUser]);

  useEffect(() => {
    if (user && (isStudent() || isAdmin())) {
      auth.getProfile()
        .then((profile) => {
          if (profile?.name) setProfileName(profile.name);
        })
        .catch(() => {});
    }
  }, [user]);

  const loggedIn = mounted && user && isAuthenticated();
  const displayName = profileName || user?.name;
  const dashboardHref = isAdmin() ? '/admin' : '/student/dashboard';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target)) {
        setLoginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const closeMobile = useCallback(() => setMobileMenuOpen(false), []);

  const isActive = (href) => {
    if (!href) return false;
    return pathname === href || pathname?.startsWith(href + '/');
  };

  const handleDropdownEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const handleLoginDropdownEnter = () => {
    clearTimeout(loginDropdownTimeout.current);
    setLoginDropdownOpen(true);
  };

  const handleLoginDropdownLeave = () => {
    loginDropdownTimeout.current = setTimeout(() => setLoginDropdownOpen(false), 150);
  };

  return (
    <>
      <nav
        className="absolute top-0 left-0 w-full z-50 bg-[rgba(10,16,29,0.85)] backdrop-blur-md transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img src="/images/yp/yp-logo-full.png" alt="Youngpreneurs" className="h-7 sm:h-9 w-auto object-contain" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) =>
                link.dropdown ? (
                  <div
                    key={link.label}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleDropdownEnter}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => setDropdownOpen((o) => !o)}
                      className={`flex items-center gap-1 px-2 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${dropdownOpen
                        ? 'text-[#C8960C]'
                        : 'text-white/90 hover:text-[#C8960C]'
                        }`}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {dropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2.5 text-sm font-medium transition-colors ${isActive(item.href)
                              ? 'text-[#C8960C] bg-[#FFF8E7]'
                              : 'text-[#1B2A4A] hover:text-[#C8960C] hover:bg-gray-50'
                              }`}
                            onClick={() => setDropdownOpen(false)}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`flex items-center gap-1 px-2 py-2 text-sm font-medium transition-colors rounded-lg whitespace-nowrap ${isActive(link.href)
                      ? 'text-[#C8960C]'
                      : 'text-white/90 hover:text-[#C8960C]'
                      }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Desktop Right */}
            <div className="hidden lg:flex items-center gap-3">
              {loggedIn ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2.5 px-4 py-2 rounded-md bg-white/10 border border-white/15 hover:bg-white/15 transition-all text-sm font-medium text-white"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center flex-shrink-0">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                  </Link>
                  <Link
                    href={dashboardHref}
                    className="px-5 py-2 rounded-md bg-[#C8960C] text-white text-sm font-semibold hover:bg-[#b5870b] transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <div
                    ref={loginDropdownRef}
                    className="relative"
                    onMouseEnter={handleLoginDropdownEnter}
                    onMouseLeave={handleLoginDropdownLeave}
                  >
                    <button
                      onClick={() => setLoginDropdownOpen((o) => !o)}
                      className="px-5 py-2 rounded-md border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-all flex items-center gap-1 whitespace-nowrap"
                    >
                      Login
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${loginDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {loginDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 overflow-hidden">
                        <Link
                          href="/login"
                          className="block px-4 py-3 text-sm font-medium text-[#1B2A4A] hover:text-[#C8960C] hover:bg-gray-50 transition-colors border-b border-gray-50"
                          onClick={() => setLoginDropdownOpen(false)}
                        >
                          Student Login
                        </Link>
                        <Link
                          href="/school-poc/login"
                          className="block px-4 py-3 text-sm font-medium text-[#1B2A4A] hover:text-[#C8960C] hover:bg-gray-50 transition-colors border-b border-gray-50"
                          onClick={() => setLoginDropdownOpen(false)}
                        >
                          School POC Login
                        </Link>
                        <Link
                          href="/association/login"
                          className="block px-4 py-3 text-sm font-medium text-[#1B2A4A] hover:text-[#C8960C] hover:bg-gray-50 transition-colors"
                          onClick={() => setLoginDropdownOpen(false)}
                        >
                          Association Login
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/signup"
                    className="px-5 py-2 rounded-md bg-[#C8960C] text-white text-sm font-semibold hover:bg-[#b5870b] transition-all flex items-center gap-1.5 whitespace-nowrap"
                  >
                    Enroll Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeMobile}
          />
          <div className="relative bg-white border-t border-gray-100 shadow-xl max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {NAV_LINKS.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <button
                      className="flex items-center justify-between w-full px-4 py-3 text-[#1B2A4A] font-medium rounded-xl hover:bg-gray-50"
                      onClick={() => setMobileDropdownOpen((o) => !o)}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : ''
                          }`}
                      />
                    </button>
                    {mobileDropdownOpen && (
                      <div className="ml-4 space-y-1">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2.5 text-sm font-medium rounded-lg ${isActive(item.href)
                              ? 'text-[#C8960C] bg-[#FFF8E7]'
                              : 'text-[#1B2A4A] hover:bg-gray-50'
                              }`}
                            onClick={closeMobile}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`block px-4 py-3 font-medium rounded-xl ${isActive(link.href)
                      ? 'text-[#C8960C] bg-[#FFF8E7]'
                      : 'text-[#1B2A4A] hover:bg-gray-50'
                      }`}
                    onClick={closeMobile}
                  >
                    {link.label}
                  </Link>
                )
              )}

              <div className="h-px bg-gray-100 my-2" />

              {SECONDARY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block px-4 py-3 font-medium rounded-xl ${isActive(link.href)
                    ? 'text-[#C8960C] bg-[#FFF8E7]'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 space-y-2">
                {loggedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[#1B2A4A] font-semibold truncate">{displayName}</p>
                      </div>
                    </div>
                    <Link
                      href={dashboardHref}
                      className="block w-full text-center px-4 py-3 rounded-xl bg-[#C8960C] text-white font-semibold"
                      onClick={closeMobile}
                    >
                      Go to Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl border border-[#1B2A4A] overflow-hidden">
                      <button
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-[#1B2A4A] font-semibold transition-colors"
                        onClick={() => setMobileLoginDropdownOpen((o) => !o)}
                      >
                        Login
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileLoginDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {mobileLoginDropdownOpen && (
                        <div className="bg-gray-50 border-t border-gray-100 divide-y divide-gray-100">
                          <Link
                            href="/login"
                            className="block w-full text-center px-4 py-3 text-[#1B2A4A] font-medium hover:text-[#C8960C] transition-colors"
                            onClick={closeMobile}
                          >
                            Student Login
                          </Link>
                          <Link
                            href="/school-poc/login"
                            className="block w-full text-center px-4 py-3 text-[#1B2A4A] font-medium hover:text-[#C8960C] transition-colors"
                            onClick={closeMobile}
                          >
                            School POC Login
                          </Link>
                          <Link
                            href="/association/login"
                            className="block w-full text-center px-4 py-3 text-[#1B2A4A] font-medium hover:text-[#C8960C] transition-colors"
                            onClick={closeMobile}
                          >
                            Association Login
                          </Link>
                        </div>
                      )}
                    </div>
                    <Link
                      href="/signup"
                      className="block w-full text-center px-4 py-3 rounded-xl bg-[#C8960C] text-white font-semibold"
                      onClick={closeMobile}
                    >
                      Enroll Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
