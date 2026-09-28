'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Target, CheckCircle, Upload, Loader2 } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function MissionDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const m = await studentIC.getMission(id);
      setMission(m);
      if (m.mySubmission) {
        setContent(m.mySubmission.content || '');
        setUrl(m.mySubmission.url || '');
      }
    } catch (e) {
      setError(e?.error || 'Mission not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    load();
  }, [id, router]);

  const submit = async () => {
    if (mission.submissionType === 'text' && !content.trim()) return alert('Add your response.');
    if (mission.submissionType === 'link' && !url.trim()) return alert('Add a link.');
    if (mission.submissionType === 'file' && !file && !mission.mySubmission?.fileUrl) return alert('Attach a file.');
    if (mission.submissionType === 'video' && !url.trim() && !file) return alert('Add a video URL or file.');

    setSubmitting(true);
    try {
      let fileUrl = mission.mySubmission?.fileUrl || '';
      if (file) {
        const r = await upload(
          `ic-mission-submission-${Date.now()}-${file.name}`,
          file,
          { access: 'public', handleUploadUrl: '/api/upload' }
        );
        fileUrl = r.url;
      }
      await studentIC.submitMission(id, { content, url, fileUrl });
      await load();
      alert(`Submitted! +${mission.xpAward} XP awarded.`);
    } catch (e) {
      alert(e?.error || 'Could not submit.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading mission..." />;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  const alreadySubmitted = !!mission.mySubmission;

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF8F3]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/student/innovation-club/missions" className="inline-flex items-center gap-2 text-sm text-[#0A2C22] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> All missions
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
          {mission.coverImage ? (
            <div className="h-52 md:h-64 overflow-hidden">
              <img src={mission.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-br from-[#0A2C22] to-[#0C3B2E] flex items-center justify-center">
              <Target className="w-10 h-10 text-[#D4AF37]" />
            </div>
          )}
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[11px] font-mono uppercase text-gray-500">{mission.roomId?.name}</span>
              <span className="text-[11px] uppercase text-gray-500 font-semibold">{mission.difficulty}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0A2C22]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{mission.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <span className="text-lg font-bold text-[#D4AF37]">+{mission.xpAward} XP</span>
              {mission.deadline && <span>Due {new Date(mission.deadline).toLocaleDateString()}</span>}
            </div>
            {mission.description && (
              <p className="text-sm text-gray-700 leading-relaxed mt-4 whitespace-pre-wrap">{mission.description}</p>
            )}
            {mission.steps?.length > 0 && (
              <div className="mt-6">
                <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-2">Steps</div>
                <ol className="space-y-2">
                  {mission.steps.map((s, i) => (
                    <li key={i} className="flex gap-3 items-start text-sm">
                      <span className="w-6 h-6 rounded-full bg-[#0A2C22]/10 text-[#0A2C22] text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                      <div>
                        <div className="font-semibold text-[#0A2C22]">{s.title}</div>
                        {s.hint && <div className="text-xs text-gray-500">{s.hint}</div>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="text-xs uppercase tracking-wide font-semibold text-gray-500 mb-3">Your submission</div>
              {alreadySubmitted && (
                <div className="text-sm text-green-700 bg-green-50 rounded-xl p-3 flex items-center gap-2 mb-4">
                  <CheckCircle className="w-4 h-4" /> Submitted on {new Date(mission.mySubmission.submittedAt).toLocaleDateString()}. You can update it below.
                </div>
              )}

              {(mission.submissionType === 'text' || mission.submissionType === 'video') && (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={mission.submissionType === 'text' ? 'Write your response…' : 'Describe your submission…'}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm min-h-[140px] focus:border-[#0A2C22] outline-none"
                />
              )}

              {(mission.submissionType === 'link' || mission.submissionType === 'video') && (
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={mission.submissionType === 'video' ? 'Video URL (YouTube, Loom, etc.)' : 'Link to your work'}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm mt-3 focus:border-[#0A2C22] outline-none"
                />
              )}

              {(mission.submissionType === 'file' || mission.submissionType === 'video') && (
                <div className="mt-3">
                  <label className="block text-xs font-medium text-gray-500 mb-2">
                    {mission.submissionType === 'file' ? 'File' : 'Or upload video file'}
                  </label>
                  <input
                    ref={fileRef}
                    type="file"
                    accept={mission.submissionType === 'video' ? 'video/*' : undefined}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="text-sm"
                  />
                  {mission.mySubmission?.fileUrl && !file && (
                    <a href={mission.mySubmission.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-[#D4AF37] font-semibold hover:underline block mt-1">
                      View existing file
                    </a>
                  )}
                </div>
              )}

              <button
                onClick={submit}
                disabled={submitting}
                className="mt-4 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A2C22] text-white font-bold text-sm hover:bg-[#0C3B2E] disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                {alreadySubmitted ? 'Update submission' : 'Submit mission'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
