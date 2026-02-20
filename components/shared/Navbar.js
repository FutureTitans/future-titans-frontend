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
    <nav className="glass-strong border-b border-white/20 sticky top-0 z-50">
      <div className="container-lg">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">YP</span>
            </div>
            <span className="font-bold text-lg text-gray-800 hidden sm:inline">YoungPreneurs</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {!user ? (
              <>
                <Link href="/login" className="text-gray-700 hover:text-red-600 transition font-medium">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-xl hover:shadow-lg transition font-semibold"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {isStudent() && (
                  <>
                    <Link href="/student/dashboard" className="text-gray-700 hover:text-red-600 transition font-medium">
                      Dashboard
                    </Link>
                    <Link href="/student/modules" className="text-gray-700 hover:text-red-600 transition font-medium">
                      Modules
                    </Link>
                  </>
                )}
                {isAdmin() && (
                  <>
                    <Link href="/admin" className="text-gray-700 hover:text-red-600 transition font-medium">
                      Admin
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      if (isStudent()) {
                        router.push('/student/profile');
                      } else if (isAdmin()) {
                        router.push('/admin');
                      }
                    }}
                    className="text-sm text-gray-700 hover:text-red-600 transition font-medium"
                    title="View profile"
                  >
                    {user?.name}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition"
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
            className="md:hidden p-2 text-gray-700"
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
          <div className="md:hidden pb-4 space-y-3 border-t border-gray-200 pt-4">
            {!user ? (
              <>
                <Link href="/login" className="block text-gray-700 hover:text-red-600 transition py-2 font-medium">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-xl hover:shadow-lg text-center transition font-semibold"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {isStudent() && (
                  <>
                    <Link href="/student/dashboard" className="block text-gray-700 hover:text-red-600 transition py-2 font-medium">
                      Dashboard
                    </Link>
                    <Link href="/student/modules" className="block text-gray-700 hover:text-red-600 transition py-2 font-medium">
                      Modules
                    </Link>
                  </>
                )}
                {isAdmin() && (
                  <>
                    <Link href="/admin" className="block text-gray-700 hover:text-red-600 transition py-2 font-medium">
                      Admin Dashboard
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition font-medium"
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

