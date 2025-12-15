'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { removeAuthToken, isStudent, isAdmin } from '@/lib/auth';
import { Menu, X, LogOut, User } from 'lucide-react';
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const { user, logout, hydrateUser } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by hydrating auth state on client only
  useEffect(() => {
    hydrateUser();
    setMounted(true);
  }, [hydrateUser]);

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
    <nav className="bg-[#5B532C] border-b border-neutral-border sticky top-0 z-40">
      <div className="container-lg">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center ">
          <Image 
    src="/images/logo.png" 
    alt="Youngpreneurs Logo" 
    width={280} 
    height={90} 
    priority
  />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {!user ? (
              <>
                <Link href="/login" className="text-white hover:text-[#dbb016] transition">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-[#305c4d] px-6 py-2 rounded-lg hover:bg-primary-darkRed hover:text-[#dbb016] transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {isStudent() && (
                  <>
                    <Link href="/student/dashboard" className="text-neutral-dark hover:text-primary-red transition">
                      Dashboard
                    </Link>
                    <Link href="/student/modules" className="text-neutral-dark hover:text-primary-red transition">
                      Modules
                    </Link>
                  </>
                )}
                {isAdmin() && (
                  <>
                    <Link href="/admin" className="text-neutral-dark hover:text-primary-red transition">
                      Admin
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-4 pl-4 border-l border-neutral-border">
                  <button
                    type="button"
                    onClick={() => {
                      if (isStudent()) {
                        router.push('/student/profile');
                      } else if (isAdmin()) {
                        router.push('/admin');
                      }
                    }}
                    className="text-sm text-neutral-medium hover:text-primary-red transition"
                    title="View profile"
                  >
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
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-4 border-t border-neutral-border">
            {!user ? (
              <>
                <Link href="/login" className="block text-neutral-dark hover:text-[#305c4d] transition py-2">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block bg-[#305c4d] text-white px-4 py-2 rounded-lg hover:bg-[#dbb016] text-center transition"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {isStudent() && (
                  <>
                    <Link href="/student/dashboard" className="block text-neutral-dark hover:text-primary-red transition py-2">
                      Dashboard
                    </Link>
                    <Link href="/student/modules" className="block text-neutral-dark hover:text-primary-red transition py-2">
                      Modules
                    </Link>
                  </>
                )}
                {isAdmin() && (
                  <>
                    <Link href="/admin" className="block text-neutral-dark hover:text-primary-red transition py-2">
                      Admin Dashboard
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-semantic-error hover:bg-semantic-error hover:bg-opacity-10 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

