'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { admin } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, User, Brain, BookOpen, Trophy } from 'lucide-react';
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
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.push('/admin/students')}
          className="flex items-center gap-2 text-primary-red hover:text-primary-darkRed transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </button>
        <h1 className="text-2xl font-bold gradient-text">Student Detail</h1>
      </div>

      {/* Basic Info */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="card flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-red-gold flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold">{student.name}</p>
            <p className="text-sm text-neutral-medium">{student.email}</p>
            <p className="text-xs text-neutral-medium mt-1">
              {student.school} · {student.city}, {student.country}
            </p>
          </div>
        </div>

        <div className="card flex items-center gap-3">
          <Brain className="w-6 h-6 text-accent-gold" />
          <div>
            <p className="text-xs text-neutral-medium mb-1">Overall SSI</p>
            <p className="text-2xl font-bold gradient-text">{student.ssiScore || 0}/100</p>
          </div>
        </div>

        <div className="card flex items-center gap-3">
          <Trophy className="w-6 h-6 text-semantic-success" />
          <div>
            <p className="text-xs text-neutral-medium mb-1">Idea Submission</p>
            <p className="font-semibold">
              {student.ideaSubmission ? 'Submitted' : 'Not submitted'}
            </p>
          </div>
        </div>
      </div>

      {/* Module Progress */}
      {modulesProgress.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Module Progress
          </h2>
          <div className="space-y-3">
            {modulesProgress.map((mp) => (
              <div
                key={mp.moduleId?._id || mp.moduleId}
                className="flex justify-between items-center border border-neutral-border rounded-lg px-4 py-3"
              >
                <div>
                  <p className="font-semibold text-sm">
                    {mp.moduleId?.title || 'Module'}
                  </p>
                  <p className="text-xs text-neutral-medium">
                    {mp.completionPercentage || 0}% complete
                  </p>
                </div>
                <div className="w-32 bg-neutral-light h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-red-gold rounded-full"
                    style={{ width: `${mp.completionPercentage || 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-Chapter SSI Breakdown */}
      {chapterSSIBreakdown.length > 0 && (
        <>
          <div className="card mb-6">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Per-Chapter SSI Scores
            </h2>
            
            {/* Table View */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-neutral-border">
                  <tr className="text-left text-sm font-semibold text-neutral-dark">
                    <th className="p-3">Module</th>
                    <th className="p-3">Chapter</th>
                    <th className="p-3">Overall SSI</th>
                    <th className="p-3">S</th>
                    <th className="p-3">U</th>
                    <th className="p-3">R</th>
                    <th className="p-3">G</th>
                    <th className="p-3">E</th>
                    <th className="p-3">Messages</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {chapterSSIBreakdown.map((chapter, idx) => (
                    <tr key={idx} className="border-b border-neutral-border hover:bg-neutral-light transition">
                      <td className="p-3 text-sm font-medium">{chapter.moduleTitle}</td>
                      <td className="p-3 text-sm">{chapter.chapterTitle}</td>
                      <td className="p-3">
                        <span className="font-bold text-primary-red">
                          {chapter.ssiScore?.overall || 0}/100
                        </span>
                      </td>
                      <td className="p-3 text-xs">{chapter.ssiScore?.selfAwareness || 0}%</td>
                      <td className="p-3 text-xs">{chapter.ssiScore?.understandingOpportunities || 0}%</td>
                      <td className="p-3 text-xs">{chapter.ssiScore?.resilience || 0}%</td>
                      <td className="p-3 text-xs">{chapter.ssiScore?.growthExecution || 0}%</td>
                      <td className="p-3 text-xs">{chapter.ssiScore?.entrepreneurialLeadership || 0}%</td>
                      <td className="p-3 text-xs text-neutral-medium">{chapter.messageCount}</td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          chapter.isCompleted 
                            ? 'bg-semantic-success bg-opacity-20 text-semantic-success' 
                            : 'bg-neutral-light text-neutral-medium'
                        }`}>
                          {chapter.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Chart View */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall SSI Chart */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-neutral-medium">Overall SSI by Chapter</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chapterSSIBreakdown.map((ch) => ({
                    name: ch.chapterTitle.length > 15 ? ch.chapterTitle.substring(0, 15) + '...' : ch.chapterTitle,
                    SSI: ch.ssiScore?.overall || 0,
                    module: ch.moduleTitle,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value) => [`${value}/100`, 'SSI Score']}
                      labelFormatter={(label, payload) => {
                        if (payload && payload[0]) {
                          return `${payload[0].payload.module} - ${label}`;
                        }
                        return label;
                      }}
                    />
                    <Bar dataKey="SSI" fill="#DC2626" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* SURGE Breakdown Chart */}
              <div>
                <h3 className="font-semibold text-sm mb-3 text-neutral-medium">SURGE Dimensions Breakdown</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chapterSSIBreakdown.map((ch) => ({
                    name: ch.chapterTitle.length > 10 ? ch.chapterTitle.substring(0, 10) + '...' : ch.chapterTitle,
                    'Self Awareness': ch.ssiScore?.selfAwareness || 0,
                    'Understanding': ch.ssiScore?.understandingOpportunities || 0,
                    'Resilience': ch.ssiScore?.resilience || 0,
                    'Growth': ch.ssiScore?.growthExecution || 0,
                    'Leadership': ch.ssiScore?.entrepreneurialLeadership || 0,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={10}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Self Awareness" stroke="#DC2626" strokeWidth={2} />
                    <Line type="monotone" dataKey="Understanding" stroke="#D97706" strokeWidth={2} />
                    <Line type="monotone" dataKey="Resilience" stroke="#10B981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Growth" stroke="#3B82F6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Leadership" stroke="#8B5CF6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* AI Chats Overview */}
      <div className="card">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          All AI Chat Sessions
        </h2>
        {(!aiChats || aiChats.length === 0) ? (
          <p className="text-sm text-neutral-medium">No AI chats recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {aiChats.map((chat) => (
              <div
                key={chat._id}
                className="border border-neutral-border rounded-lg px-4 py-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-sm">
                    {chat.moduleId?.title || 'Global'}{' '}
                    {chat.chapterId?.title ? `· ${chat.chapterId.title}` : ''}
                  </p>
                  <p className="text-xs text-neutral-medium">
                    Started: {new Date(chat.startedAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-neutral-medium">
                    Messages: {chat.conversation?.length || 0} · Completed:{' '}
                    {chat.isCompleted ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-medium mb-1">SSI (this chat)</p>
                  <p className="font-bold text-primary-red">
                    {chat.ssiScore?.overall ?? 0}/100
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


