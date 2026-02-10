'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { removeAuthToken, isStudent, isAdmin } from '@/lib/auth';
import { Menu, X, LogOut, User } from 'lucide-react';
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, hydrateUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by hydrating auth state on client only
  useEffect(() => {
    hydrateUser();
    setMounted(true);
  }, [hydrateUser]);

  // Hide navbar on School POC pages
  if (pathname?.startsWith('/school-poc')) {
    return null;
  }

  if (!mounted) {
    // Render nothing until client-side auth state is hydrated
    return null;
  }

  const handleLogout = () => {
    logout();
    removeAuthToken();
    router.push('/');
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-4 px-4 md:px-8">
      <nav className="max-w-7xl mx-auto glass-panel px-6 py-3 flex justify-between items-center transition-all duration-300">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Youngpreneurs Logo"
            width={180}
            height={50}
            className="object-contain" // improved logo handling
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {!user ? (
            <>
              <Link href="/login" className="text-neutral-dark font-medium hover:text-primary-red transition">
                Sign In
              </Link>
              <Link
                href="/signup"
                className="glass-button text-sm"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {isStudent() && (
                <>
                  <Link href="/student/dashboard" className="text-neutral-dark hover:text-primary-red transition font-medium">
                    Dashboard
                  </Link>
                  <Link href="/student/modules" className="text-neutral-dark hover:text-primary-red transition font-medium">
                    Modules
                  </Link>
                </>
              )}
              {isAdmin() && (
                <>
                  <Link href="/admin" className="text-neutral-dark hover:text-primary-red transition font-medium">
                    Admin
                  </Link>
                </>
              )}
              <div className="flex items-center gap-4 pl-4 border-l border-neutral-border/30">
                <button
                  type="button"
                  onClick={() => {
                    if (isStudent()) {
                      router.push('/student/profile');
                    } else if (isAdmin()) {
                      router.push('/admin');
                    }
                  }}
                  className="flex items-center gap-2 text-sm font-semibold text-neutral-dark hover:text-primary-red transition"
                  title="View profile"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center text-primary-red">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  {user?.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="text-neutral-medium hover:text-semantic-error transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-neutral-dark"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </nav>

      {/* Mobile Menu Dropdown (Floating) */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-4 right-4 z-40">
          <div className="glass-panel p-4 space-y-4 flex flex-col">
            {!user ? (
              <>
                <Link href="/login" className="text-neutral-dark font-medium hover:text-primary-red py-2 px-2 hover:bg-neutral-light rounded-lg transition">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="glass-button text-center justify-center flex"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {isStudent() && (
                  <>
                    <Link href="/student/dashboard" className="text-neutral-dark font-medium hover:text-primary-red py-2 px-2 hover:bg-neutral-light rounded-lg transition">
                      Dashboard
                    </Link>
                    <Link href="/student/modules" className="text-neutral-dark font-medium hover:text-primary-red py-2 px-2 hover:bg-neutral-light rounded-lg transition">
                      Modules
                    </Link>
                  </>
                )}
                {isAdmin() && (
                  <>
                    <Link href="/admin" className="text-neutral-dark font-medium hover:text-primary-red py-2 px-2 hover:bg-neutral-light rounded-lg transition">
                      Admin Dashboard
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="text-left text-semantic-error font-medium hover:bg-red-50 py-2 px-2 rounded-lg transition w-full"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

