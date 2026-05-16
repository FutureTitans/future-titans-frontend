'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Award } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const COLORS = ['#D4AF37', '#B8952E', '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try { const data = await admin.getAnalytics(); setAnalytics(data); }
    catch (error) { console.error('Failed to fetch analytics:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <LoadingSpinner message="Loading analytics..." />;
  if (!analytics) return <div className="card text-center py-12"><p className="text-gray-500">No data available</p></div>;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Platform insights and metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-50"><Users className="w-5 h-5 text-blue-600" /></div>
            <h3 className="font-semibold text-gray-700 text-sm">Students</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{analytics.totalStudents}</p>
          <p className="text-xs text-gray-500 mt-1">{analytics.paidStudents} paid ({analytics.completionRate}%)</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[#D4AF37]/10"><Award className="w-5 h-5 text-[#D4AF37]" /></div>
            <h3 className="font-semibold text-gray-700 text-sm">Average SSI</h3>
          </div>
          <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8952E]">{Math.round(analytics.averageSSI)}</p>
          <p className="text-xs text-gray-500 mt-1">Solution-Seeking Index</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-emerald-50"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
            <h3 className="font-semibold text-gray-700 text-sm">Completion Rate</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-600">{analytics.completionRate}%</p>
          <p className="text-xs text-gray-500 mt-1">Of total registrations</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-5">
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">SSI Score Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={analytics.ssiDistribution || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
              <Bar dataKey="count" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Submissions by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={analytics.submissionsByCategory || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ _id, count }) => `${_id}: ${count}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="count"
              >
                {(analytics.submissionsByCategory || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Countries */}
      <div className="card">
        <h3 className="font-bold text-gray-800 mb-4">Students by Country</h3>
        <div className="space-y-3">
          {(analytics.studentsByCountry || []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="text-sm text-gray-700 w-32 truncate">{item._id || 'Unknown'}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full transition-all"
                  style={{ width: `${(item.count / (analytics.studentsByCountry[0]?.count || 1)) * 100}%` }}
                />
              </div>
              <span className="font-semibold text-sm text-gray-700 w-10 text-right">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
