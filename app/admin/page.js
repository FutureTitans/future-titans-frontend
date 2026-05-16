'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { admin } from '@/lib/api';
import { Users, BookOpen, FileText, TrendingUp, Award, Clock, ChevronRight } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await admin.getDashboard();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform overview and quick actions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Students', value: stats?.totalStudents || 0, accent: 'from-blue-500 to-blue-600' },
          { icon: FileText, label: 'Paid Students', value: stats?.paidStudents || 0, accent: 'from-emerald-500 to-emerald-600' },
          { icon: BookOpen, label: 'Total Modules', value: stats?.totalModules || 0, accent: 'from-purple-500 to-purple-600' },
          { icon: TrendingUp, label: 'Submissions', value: stats?.totalSubmissions || 0, accent: 'from-[#D4AF37] to-[#B8952E]' },
        ].map((stat, idx) => (
          <div key={idx} className="card group hover:scale-[1.02] transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${stat.accent} shadow-lg`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Clock className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <h3 className="font-semibold text-gray-700">Pending Reviews</h3>
          </div>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8952E]">
            {stats?.pendingReviews || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Submissions awaiting review</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-700">Average SSI</h3>
          </div>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">
            {Math.round(stats?.averageSSI || 0)}<span className="text-lg text-gray-400">/100</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">Solution-Seeking Index</p>
        </div>

        <div className="card sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-700">Payment Rate</h3>
          </div>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">
            {stats?.totalStudents ? Math.round((stats.paidStudents / stats.totalStudents) * 100) : 0}%
          </p>
          <p className="text-xs text-gray-500 mt-1">Of registered students</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-bold text-lg text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/admin/students', label: 'View Students', desc: 'Manage enrolled students', color: 'from-blue-500 to-blue-600' },
            { href: '/admin/modules', label: 'Manage Modules', desc: 'Create and edit content', color: 'from-purple-500 to-purple-600' },
            { href: '/admin/submissions', label: 'Review Submissions', desc: 'Score and shortlist ideas', color: 'from-[#D4AF37] to-[#B8952E]' },
            { href: '/admin/analytics', label: 'View Analytics', desc: 'Platform insights', color: 'from-emerald-500 to-emerald-600' },
            { href: '/admin/schools', label: 'School Slugs', desc: 'Manage school codes', color: 'from-pink-500 to-pink-600' },
            { href: '/admin/settings', label: 'Settings', desc: 'Platform configuration', color: 'from-gray-600 to-gray-700' },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center justify-between p-4 rounded-xl glass-subtle hover:shadow-md transition-all"
            >
              <div>
                <p className="font-semibold text-gray-800 text-sm group-hover:text-[#B8952E] transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#D4AF37] group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
