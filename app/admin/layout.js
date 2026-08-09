'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/auth';
import { LayoutDashboard, Users, BookOpen, FileText, BarChart3, School, Building2, Settings, Rocket, Menu, X, Home, Newspaper, Lightbulb, Contact } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/modules', label: 'Modules', icon: BookOpen },
  { href: '/admin/submissions', label: 'Submissions', icon: FileText },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/grant-simulation', label: 'Grant Sim', icon: Rocket, highlight: true },
  { href: '/admin/schools', label: 'Schools', icon: School },
  { href: '/admin/associations', label: 'Associations', icon: Building2 },
  { href: '/admin/blogs', label: 'Blogs', icon: Newspaper },
  { href: '/admin/leads', label: 'Lead Management', icon: Contact },
  { href: '/admin/innovation-club', label: 'Innovation Club', icon: Lightbulb },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = getUser();
      if (!user || user.role !== 'admin') { router.push('/login'); return; }
      setIsAuthorized(true);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (loading || !isAuthorized) {
    return <div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-gray-400">Loading...</div></div>;
  }

  const isActive = (href) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)]">
      <div className="flex">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`fixed lg:sticky top-16 left-0 h-[calc(100dvh-4rem)] w-64 z-50 lg:z-auto transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-full glass-strong border-r border-white/20 flex flex-col">
            <div className="p-5 border-b border-gray-100/50">
              <h3 className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8952E]">Admin Panel</h3>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8952E] text-white shadow-md'
                        : item.highlight
                        ? 'text-[#B8952E] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/10'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : ''}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-gray-100/50">
              <Link href="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100/60 transition">
                <Home className="w-4 h-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Top Bar */}
          <div className="lg:hidden sticky top-16 z-30 glass-strong border-b border-white/20 px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition">
              <Menu className="w-5 h-5 text-gray-700" />
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
