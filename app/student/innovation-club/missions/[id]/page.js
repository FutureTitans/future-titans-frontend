'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function MissionDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    try {
      const m = await studentIC.getMission(id);
      setMission(m);
      if (m.mySubmission) { setContent(m.mySubmission.content || ''); setUrl(m.mySubmission.url || ''); }
    } catch (e) { setError(e?.error || 'Mission not found'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    load();
  }, [id, router]);

  const submit = async () => {
    if (mission.submissionType === 'text' && !content.trim()) return alert('Add your response.');
    if (mission.submissionType === 'link' && !url.trim()) return alert('Add a link.');
    if (mission.submissionType === 'file' && !file && !mission.mySubmission?.fileUrl) return alert('Attach a file.');
    setBusy(true);
    try {
      let fileUrl = mission.mySubmission?.fileUrl || '';
      if (file) {
        const r = await upload(`ic-mission-submission-${Date.now()}-${file.name}`, file, { access: 'public', handleUploadUrl: '/api/upload' });
        fileUrl = r.url;
      }
      await studentIC.submitMission(id, { content, url, fileUrl });
      await load();
      alert(`Submitted! +${mission.xpAward} XP awarded.`);
    } catch (e) { alert(e?.error || 'Could not submit.'); }
    finally { setBusy(false); }
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#56635C' }}>Loading mission…</div>;
  if (error) return <div style={{ padding: 60, textAlign: 'center', color: '#C83A30' }}>{error}</div>;

  const submitted = !!mission.mySubmission;

  return (
    <>
      <Link href="/student/innovation-club/missions" style={{ background: 'none', border: 'none', font: "600 14px 'Instrument Sans', sans-serif", color: '#3E4C45', padding: '0 0 16px', display: 'inline-block', textDecoration: 'none' }}>← All missions</Link>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,360px)', gap: 18, alignItems: 'start' }}>
        <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, padding: 26, minWidth: 0 }}>
          {mission.coverImage && (
            <div style={{ margin: '-26px -26px 22px', height: 200, overflow: 'hidden', borderRadius: '22px 22px 0 0' }}>
              <img src={mission.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 12 }}>
            <span style={{ font: "700 12px/1 'Space Grotesk', sans-serif", color: '#fff', background: '#0C3B2E', borderRadius: 8, padding: '5px 8px', letterSpacing: '.04em' }}>{mission.roomId?.name}</span>
            <span style={{ font: "500 12px/1 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase' }}>{mission.difficulty}</span>
            <span style={{ font: "700 13px/1 'JetBrains Mono', monospace", color: '#6E5416', background: '#FCF3DF', borderRadius: 8, padding: '5px 8px' }}>+{mission.xpAward} XP</span>
            {mission.deadline && <span style={{ font: "500 12px 'JetBrains Mono', monospace", color: '#3E4C45' }}>due {new Date(mission.deadline).toLocaleDateString()}</span>}
          </div>
          <h1 style={{ font: "700 clamp(28px,3.6vw,40px)/1.05 'Space Grotesk', sans-serif", letterSpacing: '-.02em', color: '#0C1512', margin: '0 0 14px' }}>{mission.title}</h1>
          {mission.description && <p style={{ font: "400 16px/1.6 'Instrument Sans', sans-serif", color: '#26322C', margin: '0 0 20px' }}>{mission.description}</p>}

          {mission.steps?.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ font: "500 11px/1 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase', marginBottom: 10 }}>Steps</div>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 0, margin: 0, listStyle: 'none' }}>
                {mission.steps.map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ width: 26, height: 26, borderRadius: 999, background: '#0C3B2E', color: '#C9A55C', display: 'grid', placeItems: 'center', font: "700 13px 'JetBrains Mono', monospace", flex: 'none' }}>{i + 1}</span>
                    <div>
                      <div style={{ font: "600 15px/1.35 'Instrument Sans', sans-serif", color: '#0C1512' }}>{s.title}</div>
                      {s.hint && <div style={{ font: "400 13.5px/1.5 'Instrument Sans', sans-serif", color: '#56635C' }}>{s.hint}</div>}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, padding: 20, minWidth: 0, position: 'sticky', top: 20 }}>
          <div style={{ font: "500 11px/1 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase', marginBottom: 12 }}>Your submission</div>
          {submitted && (
            <div style={{ background: '#EAF3EE', border: '1px solid #C7DED2', borderRadius: 12, padding: 10, font: "500 13px/1.4 'Instrument Sans', sans-serif", color: '#0C3B2E', marginBottom: 12 }}>
              ✓ Submitted on {new Date(mission.mySubmission.submittedAt).toLocaleDateString()}. You can update it.
            </div>
          )}

          {(mission.submissionType === 'text' || mission.submissionType === 'video') && (
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={mission.submissionType === 'text' ? 'Write your response…' : 'Describe your submission…'} rows={5} style={{ width: '100%', border: '1px solid #E7EAE8', borderRadius: 12, padding: 10, font: "400 14px 'Instrument Sans', sans-serif", background: '#FAFBFA', resize: 'vertical' }} />
          )}
          {(mission.submissionType === 'link' || mission.submissionType === 'video') && (
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={mission.submissionType === 'video' ? 'Video URL (optional if uploading)' : 'Link to your work'} style={{ width: '100%', border: '1px solid #E7EAE8', borderRadius: 12, padding: 10, font: "400 14px 'Instrument Sans', sans-serif", background: '#FAFBFA', marginTop: 10 }} />
          )}
          {(mission.submissionType === 'file' || mission.submissionType === 'video') && (
            <div style={{ marginTop: 10 }}>
              <div style={{ font: "500 12px/1 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase', marginBottom: 6 }}>
                {mission.submissionType === 'file' ? 'File' : 'Or upload'}
              </div>
              <input ref={fileRef} type="file" accept={mission.submissionType === 'video' ? 'video/*' : undefined} onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ font: "400 13px 'Instrument Sans', sans-serif" }} />
              {mission.mySubmission?.fileUrl && !file && <a href={mission.mySubmission.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'block', font: "600 12px 'Instrument Sans', sans-serif", color: '#8A6414', marginTop: 6 }}>View existing file</a>}
            </div>
          )}

          <button onClick={submit} disabled={busy} style={{
            width: '100%', marginTop: 14, background: '#0C3B2E', color: '#fff', border: 'none',
            borderRadius: 14, padding: '13px 16px',
            font: "700 15px 'Instrument Sans', sans-serif", cursor: 'pointer', opacity: busy ? 0.6 : 1,
          }}>{busy ? 'Submitting…' : submitted ? 'Update submission' : 'Submit mission'}</button>
        </div>
      </div>
    </>
  );
}
