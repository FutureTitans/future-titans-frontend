'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin, getUser } from '@/lib/auth';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const user = getUser();
        if (!user || user.role !== 'admin') {
          router.push('/login');
          return;
        }
        setIsAuthorized(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white">Loading...</div>;
  }

  if (!isAuthorized) {
    return <div className="flex items-center justify-center min-h-screen bg-white">Redirecting...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-light">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-neutral-border min-h-screen">
          <nav className="p-6 space-y-4">
            <div className="mb  -8">
              <h3 className="font-bold text-lg gradient-text">Admin Panel</h3>
            </div>
            <a href="/admin" className="block px-4 py-2 rounded-lg hover:bg-primary-lightRed text-neutral-dark hover:text-primary-red transition">
              📊 Dashboard
            </a>
            <a href="/admin/students" className="block px-4 py-2 rounded-lg hover:bg-primary-lightRed text-neutral-dark hover:text-primary-red transition">
              👥 Students
            </a>
            <a href="/admin/modules" className="block px-4 py-2 rounded-lg hover:bg-primary-lightRed text-neutral-dark hover:text-primary-red transition">
              📚 Modules
            </a>
            <a href="/admin/submissions" className="block px-4 py-2 rounded-lg hover:bg-primary-lightRed text-neutral-dark hover:text-primary-red transition">
              📋 Submissions
            </a>
            <a href="/admin/analytics" className="block px-4 py-2 rounded-lg hover:bg-primary-lightRed text-neutral-dark hover:text-primary-red transition">
              📈 Analytics
            </a>
            <a href="/admin/schools" className="block px-4 py-2 rounded-lg hover:bg-primary-lightRed text-neutral-dark hover:text-primary-red transition">
              🏫 School Slugs
            </a>
            <hr className="my-4" />
            <a href="/" className="block px-4 py-2 rounded-lg hover:bg-primary-lightRed text-neutral-dark hover:text-primary-red transition text-sm">
              🏠 Back to Home
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

