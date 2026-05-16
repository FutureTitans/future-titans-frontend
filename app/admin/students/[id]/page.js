'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { admin } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, User, Brain, BookOpen, Trophy, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminStudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;
    const fetchDetail = async () => {
      try {
        const detail = await admin.getStudentDetail(studentId);
        setData(detail);
      } catch (err) {
        console.error('Failed to load student detail:', err);
        router.push('/admin/students');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [studentId, router]);

  if (loading) return <LoadingSpinner message="Loading student detail..." />;
  if (!data) return null;

  const { student, aiChats, chapterSSIBreakdown = [] } = data;
  const modulesProgress = student.modulesProgress || [];

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/students')}
          className="flex items-center gap-1.5 text-sm font-medium text-[#B8952E] hover:text-[#D4AF37] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </button>
      </div>

      {/* Student Info Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-800 truncate">{student.name}</p>
            <p className="text-xs text-gray-500 truncate">{student.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">{student.school} · {student.city}, {student.country}</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-purple-50">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Overall SSI</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8952E]">{student.ssiScore || 0}<span className="text-sm text-gray-400">/100</span></p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-emerald-50">
            <Trophy className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Idea Submission</p>
            <p className="font-semibold text-gray-800">{student.ideaSubmission ? 'Submitted' : 'Not submitted'}</p>
          </div>
        </div>
      </div>

      {/* Module Progress */}
      {modulesProgress.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="font-bold text-gray-800">Module Progress</h2>
          </div>
          <div className="space-y-3">
            {modulesProgress.map((mp) => (
              <div key={mp.moduleId?._id || mp.moduleId} className="glass-subtle rounded-xl px-4 py-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-sm text-gray-800">{mp.moduleId?.title || 'Module'}</p>
                  <span className="text-xs font-bold text-[#B8952E]">{mp.completionPercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-[#D4AF37] to-[#F5D76E] rounded-full transition-all" style={{ width: `${mp.completionPercentage || 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-Chapter SSI Breakdown */}
      {chapterSSIBreakdown.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-4 h-4 text-[#D4AF37]" />
            <h2 className="font-bold text-gray-800">Per-Chapter SSI Scores</h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto mb-6 -mx-5 sm:-mx-6 px-5 sm:px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-600">Module</th>
                  <th className="text-left p-3 font-semibold text-gray-600">Chapter</th>
                  <th className="text-center p-3 font-semibold text-gray-600">SSI</th>
                  <th className="text-center p-3 font-semibold text-gray-600">S</th>
                  <th className="text-center p-3 font-semibold text-gray-600">U</th>
                  <th className="text-center p-3 font-semibold text-gray-600">R</th>
                  <th className="text-center p-3 font-semibold text-gray-600">G</th>
                  <th className="text-center p-3 font-semibold text-gray-600">E</th>
                  <th className="text-center p-3 font-semibold text-gray-600">Msgs</th>
                  <th className="text-center p-3 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {chapterSSIBreakdown.map((chapter, idx) => (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-[#D4AF37]/[0.03] transition-colors">
                    <td className="p-3 text-xs text-gray-600">{chapter.moduleTitle}</td>
                    <td className="p-3 text-xs font-medium text-gray-800">{chapter.chapterTitle}</td>
                    <td className="p-3 text-center">
                      <span className="font-bold text-[#B8952E]">{chapter.ssiScore?.overall || 0}</span>
                    </td>
                    <td className="p-3 text-center text-xs text-gray-600">{chapter.ssiScore?.selfAwareness || 0}</td>
                    <td className="p-3 text-center text-xs text-gray-600">{chapter.ssiScore?.understandingOpportunities || 0}</td>
                    <td className="p-3 text-center text-xs text-gray-600">{chapter.ssiScore?.resilience || 0}</td>
                    <td className="p-3 text-center text-xs text-gray-600">{chapter.ssiScore?.growthExecution || 0}</td>
                    <td className="p-3 text-center text-xs text-gray-600">{chapter.ssiScore?.entrepreneurialLeadership || 0}</td>
                    <td className="p-3 text-center text-xs text-gray-500">{chapter.messageCount}</td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${chapter.isCompleted ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {chapter.isCompleted ? 'Done' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-sm text-gray-600 mb-3">Overall SSI by Chapter</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chapterSSIBreakdown.map((ch) => ({
                  name: ch.chapterTitle.length > 12 ? ch.chapterTitle.substring(0, 12) + '...' : ch.chapterTitle,
                  SSI: ch.ssiScore?.overall || 0,
                  module: ch.moduleTitle,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => [`${value}/100`, 'SSI']} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                  <Bar dataKey="SSI" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-600 mb-3">SURGE Dimensions</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chapterSSIBreakdown.map((ch) => ({
                  name: ch.chapterTitle.length > 10 ? ch.chapterTitle.substring(0, 10) + '...' : ch.chapterTitle,
                  'Self': ch.ssiScore?.selfAwareness || 0,
                  'Understand': ch.ssiScore?.understandingOpportunities || 0,
                  'Resilience': ch.ssiScore?.resilience || 0,
                  'Growth': ch.ssiScore?.growthExecution || 0,
                  'Leadership': ch.ssiScore?.entrepreneurialLeadership || 0,
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={10} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB' }} />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="Self" stroke="#D4AF37" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Understand" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Resilience" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Growth" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="Leadership" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* AI Chats */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          <h2 className="font-bold text-gray-800">AI Chat Sessions</h2>
          <span className="text-xs text-gray-400 ml-1">({aiChats?.length || 0})</span>
        </div>
        {(!aiChats || aiChats.length === 0) ? (
          <p className="text-sm text-gray-500">No AI chats recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {aiChats.map((chat) => (
              <div key={chat._id} className="glass-subtle rounded-xl px-4 py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium text-sm text-gray-800">
                    {chat.moduleId?.title || 'Global'}{chat.chapterId?.title ? ` · ${chat.chapterId.title}` : ''}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                    <p className="text-xs text-gray-500">Started: {new Date(chat.startedAt).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-500">{chat.conversation?.length || 0} msgs</p>
                    {chat.timeSpent && <p className="text-xs text-gray-500">{Math.floor(chat.timeSpent / 60)}m {chat.timeSpent % 60}s</p>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">SSI</p>
                  <p className="font-bold text-[#B8952E]">{chat.ssiScore?.overall ?? 0}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
