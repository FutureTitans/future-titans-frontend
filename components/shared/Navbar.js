'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { removeAuthToken, isStudent, isAdmin } from '@/lib/auth';
import { auth } from '@/lib/api';
import { Menu, X, LogOut, User, ChevronRight } from 'lucide-react';
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, hydrateUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileName, setProfileName] = useState(null);

  useEffect(() => {
    hydrateUser();
    setMounted(true);
  }, [hydrateUser]);

  // Fetch latest name from API so navbar always shows current name
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/school-poc')) return null;
  if (!mounted) return null;

  const handleLogout = () => {
    logout();
    removeAuthToken();
    router.push('/');
  };

  const isActive = (path) => pathname === path;

  const navLinkClass = (path) =>
    `relative px-1 py-1 text-sm font-medium transition-colors duration-200 ${isActive(path)
      ? 'text-[#D4AF37]'
      : 'text-gray-300 hover:text-[#F5D76E]'
    }`;

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? 'bg-black/95 backdrop-blur-2xl shadow-[0_1px_24px_rgba(0,0,0,0.2)] border-b border-gray-700'
        : 'bg-black/80 backdrop-blur-xl border-b border-gray-700/50'
        }`}
    >
      <div className="container-lg">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Future Titans"
              width={140}
              height={140}
              className="object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-5">
            {!user ? (
              <>
                <Link href="/login" className={navLinkClass('/login')}>
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 font-semibold text-sm hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {isStudent() && (
                  <>
                    <Link href="/student/dashboard" className={navLinkClass('/student/dashboard')}>
                      Dashboard
                    </Link>
                    <Link href="/student/modules" className={navLinkClass('/student/modules')}>
                      Modules
                    </Link>
                  </>
                )}
                {isAdmin() && (
                  <Link href="/admin" className={navLinkClass('/admin')}>
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200/50">
                  <button
                    type="button"
                    onClick={() => {
                      if (isStudent()) router.push('/student/profile');
                      else if (isAdmin()) router.push('/admin');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-all text-sm font-medium text-gray-200"
                    title="View profile"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#F5D76E] flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="max-w-[100px] truncate">{profileName || user?.name}</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all"
                    title="Logout"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-700 text-gray-300 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="pt-3 space-y-1 border-t border-gray-200/30">
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-200 hover:bg-gray-700 transition font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
                <Link
                  href="/signup"
                  className="block bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-white px-4 py-3 rounded-2xl hover:shadow-lg text-center transition font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {isStudent() && (
                  <>
                    <Link
                      href="/student/dashboard"
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl transition font-medium ${isActive('/student/dashboard') ? 'bg-[#D4AF37]/20 text-[#F5D76E]' : 'text-gray-200 hover:bg-gray-700'
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                    <Link
                      href="/student/modules"
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl transition font-medium ${isActive('/student/modules') ? 'bg-[#D4AF37]/20 text-[#F5D76E]' : 'text-gray-200 hover:bg-gray-700'
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Modules
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </>
                )}
                {isAdmin() && (
                  <Link
                    href="/admin"
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl transition font-medium ${isActive('/admin') ? 'bg-[#D4AF37]/20 text-[#F5D76E]' : 'text-gray-200 hover:bg-gray-700'
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Link>
                )}
                <button
                  onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition font-medium"
                >
                  Logout
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
