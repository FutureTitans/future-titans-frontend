'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users, Trophy, GraduationCap, BookOpen, Settings,
  Sparkles, ArrowRight, AlertCircle, Clock, RefreshCw,
  Radio, Grid, Target, Video, ShieldAlert,
} from 'lucide-react';
import { adminICPanel } from '@/lib/api';

// V7 sections (adminpanelinnovationclub microservice)
const v7Links = [
  { href: '/admin/innovation-club/rooms',       label: 'Rooms',       icon: Grid,       description: '14 rooms across 6 universes' },
  { href: '/admin/innovation-club/events',      label: 'Events',      icon: Radio,      description: 'Create sessions, drive live status' },
  { href: '/admin/innovation-club/missions',    label: 'Missions',    icon: Target,     description: 'Steps, XP, deadlines and gates' },
  { href: '/admin/innovation-club/replays',     label: 'Replays',     icon: Video,      description: 'Published recordings by room' },
  { href: '/admin/innovation-club/moderation',  label: 'Moderation',  icon: ShieldAlert,description: 'Reports, questions, confessions' },
];

// Legacy sections (still routed to the monolith backend)
const legacyLinks = [
  { href: '/admin/innovation-club/experts',    label: 'Experts',            icon: Users,          description: 'Expert profiles and sessions (legacy)' },
  { href: '/admin/innovation-club/hackathons', label: 'Hackathons',         icon: Trophy,         description: 'Hackathon events (legacy)' },
  { href: '/admin/innovation-club/training',   label: "Teachers' Training", icon: GraduationCap,  description: 'Cohorts and modules (legacy)' },
  { href: '/admin/innovation-club/resources',  label: 'Resource Library',   icon: BookOpen,       description: 'Learning resources (legacy)' },
  { href: '/admin/innovation-club/settings',   label: 'Settings',           icon: Settings,       description: 'Global IC settings (legacy)' },
];

export default function InnovationClubDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminICPanel.getDashboard();
      setDashboard(data);
    } catch (err) {
      console.error('Error fetching IC dashboard:', err);
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

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
  const todaysSchedule = dashboard?.todaysSchedule || [];
  const mostActiveRooms = dashboard?.mostActiveRooms || [];
  const auditLog = dashboard?.auditLog || [];

  const statCards = [
    { label: 'Published sessions',   value: stats.publishedSessions   ?? 0, color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Live now',             value: stats.liveSessions        ?? 0, color: 'text-red-600',    bg: 'bg-red-50' },
    { label: 'Registrations',        value: stats.registrations       ?? 0, color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Attendance',           value: stats.attendance          ?? 0, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Questions',            value: stats.questions           ?? 0, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Mission completions',  value: stats.missionCompletions  ?? 0, color: 'text-amber-600',  bg: 'bg-amber-50' },
    { label: 'Moderation queue',     value: stats.moderationPending   ?? 0, color: 'text-rose-600',   bg: 'bg-rose-50' },
    { label: 'Ended sessions',       value: stats.endedSessions       ?? 0, color: 'text-gray-600',   bg: 'bg-gray-50' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Innovation Club — Command Center</h1>
        <p className="text-gray-500 text-sm mt-1">V7 admin. Everything is real; empty states show until real data lands.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Today's schedule + Most active rooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Today's schedule</h2>
          </div>
          {todaysSchedule.length === 0 ? (
            <div className="p-10 text-center text-gray-400">Nothing scheduled today.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {todaysSchedule.map((ev) => (
                <li key={ev._id} className="px-5 py-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{ev.title}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {ev.roomId?.name || 'Room'} · {ev.format} · {new Date(ev.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${ev.status === 'live' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                    {ev.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Most active rooms</h2>
          </div>
          {mostActiveRooms.length === 0 ? (
            <div className="p-10 text-center text-gray-400">No rooms yet.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {mostActiveRooms.map((r) => (
                <li key={r.roomId} className="px-5 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{r.name}</p>
                    <p className="text-xs text-gray-500">{r.universe}</p>
                  </div>
                  <span className="text-xs font-mono text-gray-500">{r.eventCount} events</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* V7 sections */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">V7 sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {v7Links.map((link) => {
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

      {/* Legacy sections */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Legacy sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {legacyLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{link.label}</h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
                </div>
                <p className="text-sm text-gray-500">{link.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Audit log */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent activity</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {auditLog.length === 0 ? (
            <div className="p-10 text-center text-gray-400 flex flex-col items-center">
              <Clock className="w-10 h-10 text-gray-300 mb-3" />
              <p>No recent activity to display.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {auditLog.map((entry) => (
                <li key={entry._id} className="px-6 py-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{entry.message || entry.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {entry.actorEmail ? `${entry.actorEmail} · ` : ''}
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
