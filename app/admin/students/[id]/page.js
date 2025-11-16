'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { admin } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { ArrowLeft, User, Brain, BookOpen, Trophy } from 'lucide-react';

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

  const { student, aiChats } = data;
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

      {/* AI Chats Overview */}
      <div className="card">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          SURGE AI Sessions
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


