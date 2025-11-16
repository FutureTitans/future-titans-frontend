'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const COLORS = ['#DC2626', '#D97706', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await admin.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading analytics..." />;
  if (!analytics) return <div className="text-center">No data available</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 gradient-text">Analytics Dashboard</h1>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="font-semibold text-neutral-medium mb-2">Total Students</h3>
          <p className="text-4xl font-bold gradient-text">{analytics.totalStudents}</p>
          <p className="text-sm text-neutral-medium mt-2">
            {analytics.paidStudents} paid ({analytics.completionRate}%)
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-neutral-medium mb-2">Average SSI</h3>
          <p className="text-4xl font-bold gradient-text">{Math.round(analytics.averageSSI)}</p>
          <p className="text-sm text-neutral-medium mt-2">Solution-Seeking Index</p>
        </div>
        <div className="card">
          <h3 className="font-semibold text-neutral-medium mb-2">Completion Rate</h3>
          <p className="text-4xl font-bold gradient-text">{analytics.completionRate}%</p>
          <p className="text-sm text-neutral-medium mt-2">Of total registrations</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* SSI Distribution */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4">SSI Score Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.ssiDistribution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#DC2626" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Submissions by Category */}
        <div className="card">
          <h3 className="font-bold text-lg mb-4">Submissions by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.submissionsByCategory || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {(analytics.submissionsByCategory || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Countries */}
      <div className="card">
        <h3 className="font-bold text-lg mb-4">Students by Country (Top 10)</h3>
        <div className="space-y-3">
          {(analytics.studentsByCountry || []).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="text-neutral-dark">{item._id || 'Unknown'}</span>
              <div className="flex items-center gap-4 flex-1 ml-4">
                <div className="flex-1 bg-neutral-light rounded-full h-2">
                  <div
                    className="bg-gradient-red-gold h-full rounded-full"
                    style={{
                      width: `${(item.count / (analytics.studentsByCountry[0]?.count || 1)) * 100}%`,
                    }}
                  ></div>
                </div>
                <span className="font-semibold text-neutral-dark w-12">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

