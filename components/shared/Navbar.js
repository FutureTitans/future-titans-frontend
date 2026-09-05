'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { removeAuthToken, isStudent, isAdmin } from '@/lib/auth';
import { auth } from '@/lib/api';
import { Menu, X, LogOut, User, LayoutDashboard, LayoutGrid, BookOpen, Compass, Flag, GraduationCap, Shield, Newspaper, Lightbulb, Lock } from 'lucide-react';
import Image from 'next/image';

const HEX_CLIP = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

const studentNavItems = [
  { href: '/student/dashboard', label: 'Dashboard', Icon: LayoutGrid },
  { href: '/student/modules', label: 'Learn', Icon: BookOpen },
  { href: '/student/innovation-club', label: 'Innovation Club', Icon: Compass, lockForDemo: true },
  { href: '/student/submission', label: 'Build an Idea', Icon: Lightbulb },
  { href: '/student/profile', label: 'My Titan Journey', Icon: Flag },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, hydrateUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileName, setProfileName] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

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
        .catch(() => { });
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  const publicPages = ['/', '/about-us', '/team', '/for-parents', '/for-schools', '/future-titans', '/academy', '/success-stories', '/media', '/contact', '/innovation-club', '/signup'];
  if (publicPages.includes(pathname) || pathname?.startsWith('/school-poc') || pathname?.startsWith('/association')) return null;
  if (!mounted) return null;

  const handleLogout = () => {
    logout();
    removeAuthToken();
    closeMobileMenu();
    setShowUserMenu(false);
    router.push('/');
  };

  const isActive = (path) => pathname === path;
  const isActivePrefix = (path) => pathname?.startsWith(path);

  const displayName = profileName || user?.name;
  const userInitial = displayName ? displayName.charAt(0).toUpperCase() : 'U';
  const userInitials = displayName
    ? displayName.trim().split(/\s+/).slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join('')
    : 'U';
  const isStudentUser = user && isStudent();

  if (isStudentUser) {
    return (
      <>
        <nav
          className={`sticky top-0 z-50 transition-all duration-300 border-b border-[#E5C872]/15 ${scrolled
            ? 'bg-[#0A1E13] backdrop-blur-2xl shadow-[0_1px_24px_rgba(0,0,0,0.4)]'
            : 'bg-[linear-gradient(90deg,#0E2A1B_0%,#0A1E13_100%)]'
            }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 font-[family-name:var(--font-rajdhani)]">
            <div className="flex justify-between items-center h-16 gap-4">
              {/* Logo */}
              <Link href="/student/dashboard" className="flex items-center flex-shrink-0" onClick={closeMobileMenu}>
                <img src="/images/yp/yp-logo-full.png" alt="Youngpreneurs" className="h-8 sm:h-9 w-auto object-contain" />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1.5">
                {studentNavItems.map((item) => {
                  const Icon = item.Icon;
                  const isDemoLocked = item.lockForDemo && user?.email === 'demo@futuretitans.com';
                  if (isDemoLocked) {
                    return (
                      <div
                        key={item.href}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-white/25 cursor-not-allowed border border-transparent"
                        title="Premium Feature"
                      >
                        <Icon className="w-4 h-4 opacity-50" />
                        {item.label}
                        <Lock className="w-3.5 h-3.5 ml-0.5 opacity-60" />
                      </div>
                    );
                  }
                  const active = isActivePrefix(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 border ${active
                        ? 'border-[#E5C872] bg-[#E5C872]/10 text-[#E5C872]'
                        : 'border-transparent text-[#C4D2C8] hover:text-white hover:bg-white/[0.06]'
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-[#E5C872]' : 'text-[#8FA596]'}`} />
                      {item.label}
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-[#E5C872] ml-0.5" />}
                    </Link>
                  );
                })}
              </div>

              {/* Right cluster: Knowledge Partner + User pill */}
              <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/12 bg-white/[0.03]">
                  <GraduationCap className="w-5 h-5 text-[#8FA596] flex-shrink-0" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[8px] uppercase tracking-[0.14em] text-[#8FA596] font-semibold">Knowledge Partner</span>
                    <span className="text-[11px] text-white font-bold tracking-wide">IIT KHARAGPUR</span>
                  </div>
                </div>

                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2.5 pl-1.5 pr-3.5 py-1.5 rounded-full border border-[#E5C872]/60 hover:border-[#E5C872] hover:bg-[#E5C872]/5 transition-all"
                  >
                    <div className="w-7 h-7 flex items-center justify-center flex-shrink-0 bg-[#E5C872]" style={{ clipPath: HEX_CLIP }}>
                      <span className="text-[#0E2A1B] font-bold text-[11px]">{userInitials}</span>
                    </div>
                    <span className="text-white text-sm font-bold max-w-[140px] truncate">{displayName}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#0E2A1B] border border-[#E5C872]/20 rounded-xl shadow-xl py-1 z-50">
                      <Link
                        href="/student/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#C4D2C8] hover:text-white hover:bg-white/[0.06] transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/[0.08] text-[#E5C872] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Student Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" aria-modal="true" role="dialog">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeMobileMenu}
              style={{ animation: 'fadeInOverlay 0.2s ease-out' }}
            />
            <div
              className="absolute top-16 right-0 left-0 bg-[#0E2A1B] border-b border-[#E5C872]/15 shadow-2xl safe-bottom"
              style={{ animation: 'slideDown 0.25s ease-out' }}
            >
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 space-y-1">
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-[#E5C872]" style={{ clipPath: HEX_CLIP }}>
                    <span className="text-[#0E2A1B] font-bold text-sm">{userInitials}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{displayName}</p>
                    <p className="text-[#7d9184] text-sm truncate">{user?.email}</p>
                  </div>
                </div>

                {/* Knowledge partner */}
                <div className="flex items-center gap-2 mx-4 mb-2 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03]">
                  <GraduationCap className="w-5 h-5 text-[#8FA596] flex-shrink-0" />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[8px] uppercase tracking-[0.14em] text-[#8FA596] font-semibold">Knowledge Partner</span>
                    <span className="text-[11px] text-white font-bold tracking-wide">IIT KHARAGPUR</span>
                  </div>
                </div>

                <div className="h-px bg-white/10 mx-3 mb-2" />

                {studentNavItems.map((item) => {
                  const Icon = item.Icon;
                  const isDemoLocked = item.lockForDemo && user?.email === 'demo@futuretitans.com';
                  if (isDemoLocked) {
                    return (
                      <div
                        key={item.href}
                        className="flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium text-white/30 cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 opacity-50" />
                          {item.label}
                        </div>
                        <Lock className="w-4 h-4 opacity-60" />
                      </div>
                    );
                  }
                  const active = isActivePrefix(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors font-medium ${active
                        ? 'bg-[#E5C872]/10 text-[#E5C872] border border-[#E5C872]/40'
                        : 'text-[#C4D2C8] hover:bg-white/[0.06]'
                        }`}
                      onClick={closeMobileMenu}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-[#E5C872]' : 'text-[#8FA596]'}`} />
                      {item.label}
                    </Link>
                  );
                })}

                <div className="h-px bg-white/10 mx-3 my-2" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Non-student navbar (admin, logged out)
  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-black/95 backdrop-blur-2xl shadow-[0_1px_24px_rgba(0,0,0,0.25)] border-b border-white/[0.06]'
            : 'bg-black/85 backdrop-blur-xl border-b border-white/[0.04]'
          }`}
      >
        <div className="container-lg">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0" onClick={closeMobileMenu}>
              <Image
                src="/logo.png"
                alt="Youngpreneurs"
                width={200}
                height={32}
                className="object-contain"
                priority
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {!user ? (
                <div className="flex items-center gap-3">
                  <NavLink href="/blog" active={isActive('/blog')} icon={<Newspaper className="w-4 h-4" />}>
                    Blog
                  </NavLink>
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${isActive('/login')
                        ? 'text-[#F5D76E] bg-white/[0.08]'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.06]'
                      }`}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 hover:shadow-[0_8px_24px_rgba(212,175,55,0.35)] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <NavLink href="/blog" active={isActive('/blog')} icon={<Newspaper className="w-4 h-4" />}>
                    Blog
                  </NavLink>
                  {isAdmin() && (
                    <NavLink href="/admin" active={isActive('/admin')} icon={<Shield className="w-4 h-4" />}>
                      Admin
                    </NavLink>
                  )}

                  <div className="flex items-center gap-2 ml-3 pl-3 border-l border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        if (isAdmin()) router.push('/admin');
                      }}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.08] hover:bg-white/[0.12] transition-all text-sm font-medium text-gray-200"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="max-w-[120px] truncate">{displayName}</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/[0.08] text-gray-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" aria-modal="true" role="dialog">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobileMenu}
            style={{ animation: 'fadeInOverlay 0.2s ease-out' }}
          />
          <div
            className="absolute top-16 right-0 left-0 bg-black/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl safe-bottom"
            style={{ animation: 'slideDown 0.25s ease-out' }}
          >
            <div className="container-lg py-4 space-y-1">
              <MobileNavLink href="/blog" onClick={closeMobileMenu} active={isActive('/blog')} icon={<Newspaper className="w-5 h-5" />}>
                Blog
              </MobileNavLink>
              {!user ? (
                <>
                  <MobileNavLink href="/login" onClick={closeMobileMenu} active={isActive('/login')}>
                    Log In
                  </MobileNavLink>
                  <div className="pt-2 px-1">
                    <Link
                      href="/signup"
                      className="block w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white px-4 py-3.5 rounded-2xl text-center font-semibold transition-all hover:shadow-[0_8px_24px_rgba(212,175,55,0.3)]"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">{displayName}</p>
                      <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="h-px bg-white/[0.06] mx-3 mb-2" />

                  {isAdmin() && (
                    <MobileNavLink href="/admin" onClick={closeMobileMenu} active={isActive('/admin')} icon={<Shield className="w-5 h-5" />}>
                      Admin Dashboard
                    </MobileNavLink>
                  )}

                  <div className="h-px bg-white/[0.06] mx-3 my-2" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, active, icon, children }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active
          ? 'text-[#F5D76E] bg-white/[0.1]'
          : 'text-gray-300 hover:text-white hover:bg-white/[0.06]'
        }`}
    >
      {icon}
      {children}
    </Link>
  );
}

function MobileNavLink({ href, onClick, active, icon, children }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-colors font-medium ${active
          ? 'bg-[#D4AF37]/15 text-[#F5D76E]'
          : 'text-gray-200 hover:bg-white/[0.06]'
        }`}
      onClick={onClick}
    >
      {icon && <span className={active ? 'text-[#D4AF37]' : 'text-gray-400'}>{icon}</span>}
      {children}
    </Link>
  );
}
