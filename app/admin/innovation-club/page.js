'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Lightbulb, Users, Trophy, GraduationCap, BookOpen, Settings,
  Sparkles, ArrowRight, AlertCircle, Clock, RefreshCw,
} from 'lucide-react';
import { adminIC } from '@/lib/api';

const quickLinks = [
  { href: '/admin/innovation-club/experts', label: 'Experts', icon: Users, description: 'Manage expert profiles and sessions' },
  { href: '/admin/innovation-club/hackathons', label: 'Hackathons', icon: Trophy, description: 'Create and manage hackathon events' },
  { href: '/admin/innovation-club/training', label: "Teachers' Training", icon: GraduationCap, description: 'Manage training cohorts and modules' },
  { href: '/admin/innovation-club/resources', label: 'Resource Library', icon: BookOpen, description: 'Curate and publish learning resources' },
  { href: '/admin/innovation-club/settings', label: 'Settings', icon: Settings, description: 'Configure global Innovation Club settings' },
];

export default function InnovationClubDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminIC.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Error fetching IC dashboard:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-gray-400">Loading Innovation Club dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-600">{error}</p>
        <button onClick={fetchDashboard} className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#B8952E] font-medium">
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const stats = dashboard?.stats || {};
  const auditLog = dashboard?.auditLog || [];

  const statCards = [
    { label: 'Draft Items', value: stats.draftItems ?? 0, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Published Items', value: stats.publishedItems ?? 0, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Teachers', value: stats.activeTeachers ?? 0, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Requests', value: stats.pendingRequests ?? 0, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Innovation Club Manager</h1>
        <p className="text-gray-500 text-sm mt-1">Oversee all Innovation Club features and content from one place.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-[#D4AF37]/30 transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{link.label}</h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#D4AF37] transition" />
                </div>
                <p className="text-sm text-gray-500">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Audit Log */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {auditLog.length === 0 ? (
            <div className="p-10 text-center text-gray-400 flex flex-col items-center">
              <Clock className="w-10 h-10 text-gray-300 mb-3" />
              <p>No recent activity to display.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {auditLog.map((entry, idx) => (
                <li key={idx} className="px-6 py-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{entry.message || entry.action || 'Action performed'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : 'Recently'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
