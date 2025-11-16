'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { Users, BookOpen, FileText, TrendingUp } from 'lucide-react';
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

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card hover:shadow-lg transition-all">
      <div className="flex items-center gap-4">
        <div className={`p-4 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div>
          <p className="text-neutral-medium text-sm">{label}</p>
          <p className="text-3xl font-bold text-neutral-dark">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 gradient-text">Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          label="Total Students"
          value={stats?.totalStudents || 0}
          color="bg-primary-red"
        />
        <StatCard
          icon={FileText}
          label="Paid Students"
          value={stats?.paidStudents || 0}
          color="bg-accent-gold"
        />
        <StatCard
          icon={BookOpen}
          label="Total Modules"
          value={stats?.totalModules || 0}
          color="bg-semantic-info"
        />
        <StatCard
          icon={TrendingUp}
          label="Submissions"
          value={stats?.totalSubmissions || 0}
          color="bg-semantic-success"
        />
      </div>

      {/* More Stats */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Pending Reviews</h3>
          <p className="text-3xl font-bold gradient-text">{stats?.pendingReviews || 0}</p>
          <p className="text-sm text-neutral-medium mt-2">Submissions awaiting review</p>
        </div>
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Average SSI Score</h3>
          <p className="text-3xl font-bold gradient-text">{Math.round(stats?.averageSSI || 0)}/100</p>
          <p className="text-sm text-neutral-medium mt-2">Student Solution-Seeking Index</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="font-bold text-lg mb-6">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <a
            href="/admin/students"
            className="p-4 bg-gradient-red-gold text-white rounded-lg hover:shadow-lg transition-all text-center font-semibold"
          >
            📊 View Students
          </a>
          <a
            href="/admin/modules"
            className="p-4 bg-gradient-red-gold text-white rounded-lg hover:shadow-lg transition-all text-center font-semibold"
          >
            📚 Create Module
          </a>
          <a
            href="/admin/submissions"
            className="p-4 bg-gradient-red-gold text-white rounded-lg hover:shadow-lg transition-all text-center font-semibold"
          >
            📋 Review Submissions
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-neutral-medium text-sm">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

