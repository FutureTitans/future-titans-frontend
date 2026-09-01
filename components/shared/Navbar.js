'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { removeAuthToken, isStudent, isAdmin } from '@/lib/auth';
import { auth } from '@/lib/api';
import { Menu, X, LogOut, User, LayoutDashboard, BookOpen, Shield, Newspaper, Lightbulb, Lock } from 'lucide-react';
import Image from 'next/image';

const studentNavItems = [
  { href: '/student/dashboard', label: 'Dashboard', emoji: null },
  { href: '/student/modules', label: 'Learn', emoji: '\u{1F9E0}' },
  { href: '/student/innovation-club', label: 'Innovation Club', emoji: '\u{1F680}', lockForDemo: true },
  { href: '/student/submission', label: 'Build an Idea', emoji: '\u{1F4A1}' },
  { href: '/student/profile', label: 'My Titan Journey', emoji: '\u{1F464}' },
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
  const isStudentUser = user && isStudent();

  if (isStudentUser) {
    return (
      <>
        <nav
          className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled
            ? 'bg-[#0f1628] backdrop-blur-2xl shadow-[0_1px_24px_rgba(0,0,0,0.4)] border-[#2a3352]'
            : 'bg-[#141b2d] border-[#1e2740]'
            }`}
        >
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/student/dashboard" className="flex items-center gap-3 flex-shrink-0" onClick={closeMobileMenu}>
                <div className="w-9 h-9 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-transparent">
                  <span className="text-[#D4AF37] font-bold text-sm">Y</span>
                </div>
                <div className="hidden sm:block">
                  <div className="text-white font-bold text-sm tracking-[0.2em] leading-tight">YOUNGPRENEURS</div>
                  <div className="text-[#7b8aa8] text-[9px] tracking-[0.22em] font-medium leading-tight">MINDSET IS THE ULTIMATE EDGE</div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-1">
                {studentNavItems.map((item) => {
                  const isDemoLocked = item.lockForDemo && user?.email === 'demo@futuretitans.com';
                  if (isDemoLocked) {
                    return (
                      <div
                        key={item.href}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium text-white/30 cursor-not-allowed"
                        title="Premium Feature"
                      >
                        {item.emoji && <span className="text-sm opacity-40">{item.emoji}</span>}
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
                      className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${active
                        ? 'border border-[#D4AF37]/70 text-white'
                        : 'text-[#c8cdd8] hover:text-white'
                        }`}
                    >
                      {item.emoji && <span className="text-sm">{item.emoji}</span>}
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* User Profile Pill */}
              <div className="hidden lg:flex items-center">
                <div className="relative" ref={userMenuRef}>
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-xs">{userInitial}</span>
                    </div>
                    <span className="text-white text-sm font-medium max-w-[140px] truncate">{displayName}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a2138] border border-[#2a3352] rounded-xl shadow-xl py-1 z-50">
                      <Link
                        href="/student/profile"
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#c8cdd8] hover:text-white hover:bg-white/[0.06] transition-colors"
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
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-white/[0.08] text-gray-300 transition-colors"
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
              className="absolute top-16 right-0 left-0 bg-[#141b2d] border-b border-[#1e2740] shadow-2xl safe-bottom"
              style={{ animation: 'slideDown 0.25s ease-out' }}
            >
              <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-4 space-y-1">
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-base">{userInitial}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{displayName}</p>
                    <p className="text-[#7b8aa8] text-sm truncate">{user?.email}</p>
                  </div>
                </div>

                <div className="h-px bg-[#2a3352] mx-3 mb-2" />

                {studentNavItems.map((item) => {
                  const isDemoLocked = item.lockForDemo && user?.email === 'demo@futuretitans.com';
                  if (isDemoLocked) {
                    return (
                      <div
                        key={item.href}
                        className="flex items-center justify-between px-4 py-3.5 rounded-2xl font-medium text-white/30 cursor-not-allowed"
                      >
                        <div className="flex items-center gap-3">
                          {item.emoji && <span className="text-lg opacity-40">{item.emoji}</span>}
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
                        ? 'bg-[#D4AF37]/10 text-white border border-[#D4AF37]/30'
                        : 'text-[#c8cdd8] hover:bg-white/[0.06]'
                        }`}
                      onClick={closeMobileMenu}
                    >
                      {item.emoji && <span className="text-lg">{item.emoji}</span>}
                      {item.label}
                    </Link>
                  );
                })}

                <div className="h-px bg-[#2a3352] mx-3 my-2" />

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
