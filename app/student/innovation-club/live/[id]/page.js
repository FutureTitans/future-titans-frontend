'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';

const UNI_ACCENT = { BUILD: '#C2410C', FUTURE: '#2D5BFF', CREATE: '#7449F5', THINK: '#0E7C78', LIFE: '#D23A2A', EXPLORE: '#8A4DDB' };

// Extract a YouTube video ID from many URL shapes, or accept a bare 11-char ID.
function youtubeIdFrom(input) {
  if (!input) return null;
  const s = String(input).trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
  try {
    const u = new URL(s);
    if (u.hostname.includes('youtu.be')) {
      const id = u.pathname.replace(/^\//, '').split('/')[0];
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (u.hostname.includes('youtube.com')) {
      // Watch: /watch?v=ID
      const v = u.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      // /live/ID or /embed/ID or /shorts/ID
      const m = u.pathname.match(/\/(?:live|embed|shorts)\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[1];
    }
  } catch { /* not a URL */ }
  return null;
}

export default function EventStage() {
  const router = useRouter();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const [posting, setPosting] = useState(false);
  const [tab, setTab] = useState('questions');

  const load = async () => {
    try { setEvent(await studentIC.getEvent(id)); }
    catch (e) { setError(e?.error || 'Event not found'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    load();
    // Poll for new questions / status changes while the tab is open.
    const t = setInterval(() => { studentIC.getEvent(id).then(setEvent).catch(() => {}); }, 12000);
    return () => clearInterval(t);
  }, [id, router]);

  const rsvp = async () => { try { await studentIC.rsvpEvent(id); await load(); } catch { alert('Could not RSVP.'); } };
  const cancel = async () => { try { await studentIC.cancelRsvp(id); await load(); } catch { alert('Could not cancel.'); } };
  const enter = async () => { try { await studentIC.attendEvent(id); await load(); } catch { alert('Could not enter live.'); } };

  const submitQ = async () => {
    const text = question.trim();
    if (text.length < 3) return alert('Question is a bit short.');
    setPosting(true);
    try {
      await studentIC.submitQuestion(id, text);
      setQuestion('');
      await load();
    } catch (e) {
      alert(e?.error || 'Could not submit question.');
    } finally { setPosting(false); }
  };

  const addToCal = () => {
    const start = new Date(event.startAt);
    const dtStart = start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const dtEnd = new Date(start.getTime() + (event.durationMinutes || 45) * 60000).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const url = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(['BEGIN:VCALENDAR','VERSION:2.0','BEGIN:VEVENT',`UID:${event._id}@youngpreneurs`,`DTSTAMP:${dtStart}`,`DTSTART:${dtStart}`,`DTEND:${dtEnd}`,`SUMMARY:${event.title}`,`DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,'END:VEVENT','END:VCALENDAR'].join('\n'));
    const a = document.createElement('a'); a.href = url; a.download = `${event.title}.ics`; a.click();
  };

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#56635C' }}>Loading event…</div>;
  if (error) return <div style={{ padding: 60, textAlign: 'center', color: '#C83A30' }}>{error}</div>;

  const isLive = event.status === 'live';
  const isEnded = event.status === 'ended';
  const registered = !!event.myRegistration;
  const accent = UNI_ACCENT[event.roomId?.universe] || '#0C3B2E';
  const ytId = youtubeIdFrom(event.streamUrl);
  const canWatch = isLive && !!ytId;

  const questions = event.questions || [];
  const myIds = new Set(event.myQuestionIds || []);
  // Approved first (already sorted by backend), pending/removed for the submitter at the bottom.
  const approvedList = questions.filter((q) => ['approved', 'selected_for_live'].includes(q.status));
  const myPending = questions.filter((q) => myIds.has(String(q._id)) && !['approved', 'selected_for_live'].includes(q.status));

  return (
    <>
      <button onClick={() => router.push('/student/innovation-club/live')} style={{ background: 'none', border: 'none', font: "600 14px 'Instrument Sans', sans-serif", color: '#3E4C45', padding: '0 0 16px', cursor: 'pointer' }}>← Live sessions</button>

      <div className="ic-stage-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,360px)', gap: 18, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          {/* Stage */}
          <div style={{ background: '#0A2C22', borderRadius: 24, overflow: 'hidden', position: 'relative' }}>
            <div style={{ aspectRatio: '16 / 9', background: '#08201A', position: 'relative' }}>
              {canWatch ? (
                <iframe
                  key={ytId}
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                  title={event.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 0 }}
                />
              ) : (
                <>
                  {event.thumbnailUrl && <img src={event.thumbnailUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }} />}
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
                    {isLive && !ytId ? (
                      <div style={{ color: '#FFC9C2', font: "500 14px 'Instrument Sans', sans-serif", maxWidth: 380 }}>
                        This session is live, but no stream URL has been set yet. Ask the host to add a YouTube link.
                      </div>
                    ) : isEnded ? (
                      <div style={{ color: '#B9D3C7', font: "600 15px 'Instrument Sans', sans-serif" }}>This session has ended.</div>
                    ) : (
                      <div style={{ color: '#B9D3C7', font: "500 14px 'Instrument Sans', sans-serif" }}>
                        Starts {new Date(event.startAt).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })}.
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div style={{ padding: 22 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 10 }}>
                <span style={{ font: "700 12px/1 'Space Grotesk', sans-serif", color: '#fff', background: accent, borderRadius: 8, padding: '5px 8px', letterSpacing: '.04em' }}>{event.roomId?.name}</span>
                <span style={{ font: "500 12px/1 'JetBrains Mono', monospace", color: '#A9C2B7', textTransform: 'uppercase' }}>{event.format}</span>
                {isLive && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, font: "700 12px/1 'Instrument Sans', sans-serif", color: '#FFC9C2' }}>
                    <span style={{ width: 6, height: 6, borderRadius: 6, background: '#FF7A6D', animation: 'ftPulse 1.6s ease-in-out infinite' }} />
                    Live now
                  </span>
                )}
              </div>
              <h1 style={{ font: "700 clamp(22px,3vw,32px)/1.1 'Space Grotesk', sans-serif", letterSpacing: '-.02em', color: '#fff', margin: '0 0 8px' }}>{event.title}</h1>
              {event.guest && <div style={{ font: "500 15px/1.4 'Instrument Sans', sans-serif", color: '#B9D3C7', marginBottom: 12 }}>with {event.guest}</div>}
              {event.description && <div style={{ font: "400 14.5px/1.6 'Instrument Sans', sans-serif", color: '#B9D3C7', maxWidth: 620 }}>{event.description}</div>}
            </div>
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
            {isEnded ? null : isLive ? (
              <button onClick={enter} style={{ background: '#C9A55C', color: '#1A1405', border: 'none', borderRadius: 15, padding: '14px 22px', font: "700 15px 'Instrument Sans', sans-serif", cursor: 'pointer' }}>
                {canWatch ? '👀 Marked as attending' : '▶ Enter live'}
              </button>
            ) : registered ? (
              <button onClick={cancel} style={{ background: '#fff', color: '#0C3B2E', border: '2px solid #0C3B2E', borderRadius: 15, padding: '14px 22px', font: "700 15px 'Instrument Sans', sans-serif", cursor: 'pointer' }}>Seat saved ✓ · Cancel</button>
            ) : (
              <button onClick={rsvp} style={{ background: '#0C3B2E', color: '#fff', border: '2px solid #0C3B2E', borderRadius: 15, padding: '14px 26px', font: "700 15px 'Instrument Sans', sans-serif", cursor: 'pointer' }}>Save my seat</button>
            )}
            {!isEnded && <button onClick={addToCal} style={{ background: '#fff', color: '#0C1512', border: '1px solid #E7EAE8', borderRadius: 15, padding: '14px 20px', font: "600 15px 'Instrument Sans', sans-serif", cursor: 'pointer' }}>Add to calendar</button>}
            {ytId && (
              <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noreferrer" style={{ background: '#fff', color: '#0C1512', border: '1px solid #E7EAE8', borderRadius: 15, padding: '14px 20px', font: "600 15px 'Instrument Sans', sans-serif", textDecoration: 'none' }}>
                Open on YouTube ↗
              </a>
            )}
          </div>
        </div>

        {/* Right column: interaction */}
        <div style={{ background: '#fff', border: '1px solid #E7EAE8', borderRadius: 22, padding: 20, minWidth: 0 }}>
          <div role="tablist" style={{ display: 'flex', gap: 4, borderBottom: '1px solid #EDF0EE', marginBottom: 14 }}>
            {[{ k: 'questions', l: `Q&A (${approvedList.length}${myPending.length ? ` +${myPending.length}` : ''})` }, { k: 'about', l: 'About' }].map((t) => (
              <button key={t.k} onClick={() => setTab(t.k)} style={{
                border: 'none', background: 'none', padding: '10px 12px',
                font: "600 13.5px/1 'Instrument Sans', sans-serif", cursor: 'pointer',
                color: tab === t.k ? '#0C1512' : '#56635C',
                borderBottom: `3px solid ${tab === t.k ? '#0C3B2E' : 'transparent'}`,
                marginBottom: -1,
              }}>{t.l}</button>
            ))}
          </div>

          {tab === 'questions' && (
            <>
              <div style={{ marginBottom: 12 }}>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => { if (e.metaKey && e.key === 'Enter') submitQ(); }}
                  placeholder="Ask the guest a real question…"
                  rows={3}
                  disabled={isEnded}
                  style={{ width: '100%', border: '1px solid #E7EAE8', borderRadius: 12, padding: 10, font: "400 14px 'Instrument Sans', sans-serif", background: '#FAFBFA', resize: 'none' }}
                />
                <button onClick={submitQ} disabled={posting || !question.trim() || isEnded} style={{
                  marginTop: 8, width: '100%', background: '#0C3B2E', color: '#fff',
                  border: 'none', borderRadius: 12, padding: '10px 12px',
                  font: "600 13.5px 'Instrument Sans', sans-serif", cursor: 'pointer',
                  opacity: (posting || !question.trim() || isEnded) ? 0.5 : 1,
                }}>{posting ? 'Submitting…' : isEnded ? 'Session ended' : 'Submit question'}</button>
                <div style={{ font: "500 11.5px/1.4 'Instrument Sans', sans-serif", color: '#56635C', marginTop: 6 }}>
                  Questions go to a moderator first. You&apos;ll see yours appear below with a status.
                </div>
              </div>

              {myPending.length > 0 && (
                <>
                  <div style={{ font: "500 11px/1 'JetBrains Mono', monospace", color: '#8A6414', textTransform: 'uppercase', marginBottom: 8 }}>Your questions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
                    {myPending.map((q) => (
                      <div key={q._id} style={{ background: '#FCF8EF', border: '1px solid #EDE3CC', borderRadius: 12, padding: 12 }}>
                        <div style={{ font: "500 14px/1.4 'Instrument Sans', sans-serif", color: '#101A16' }}>{q.content}</div>
                        <div style={{ font: "500 12px/1 'JetBrains Mono', monospace", color: q.status === 'removed' ? '#C83A30' : '#8A6414', marginTop: 6, textTransform: 'uppercase' }}>
                          {q.status === 'removed' ? '✗ Removed by moderator' : '⏳ Under review'}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div style={{ font: "500 11px/1 'JetBrains Mono', monospace", color: '#56635C', textTransform: 'uppercase', marginBottom: 8 }}>Approved</div>
              {approvedList.length === 0 ? (
                <div style={{ font: "400 14px/1.5 'Instrument Sans', sans-serif", color: '#56635C' }}>
                  No approved questions yet. Submitted ones show up here after a moderator approves.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflow: 'auto' }}>
                  {approvedList.map((q) => {
                    const mine = myIds.has(String(q._id));
                    return (
                      <div key={q._id} style={{ background: '#FAF8F3', borderRadius: 12, padding: 12, border: mine ? '1px solid #C7DED2' : '1px solid transparent' }}>
                        <div style={{ font: "500 14px/1.4 'Instrument Sans', sans-serif", color: '#101A16' }}>{q.content}</div>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', font: "500 12px/1 'JetBrains Mono', monospace", color: '#56635C', marginTop: 6, textTransform: 'uppercase', flexWrap: 'wrap' }}>
                          {q.status === 'selected_for_live' && <span style={{ color: '#A8322A' }}>★ Selected for live</span>}
                          <span>{q.upvotes || 0} upvotes</span>
                          {mine && <span style={{ color: '#0C3B2E' }}>· your question</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {tab === 'about' && (
            <div style={{ font: "400 14px/1.6 'Instrument Sans', sans-serif", color: '#26322C' }}>
              <div style={{ marginBottom: 8 }}><strong style={{ color: '#0C1512' }}>Format</strong>: {event.format}</div>
              <div style={{ marginBottom: 8 }}><strong style={{ color: '#0C1512' }}>When</strong>: {new Date(event.startAt).toLocaleString()}</div>
              <div style={{ marginBottom: 8 }}><strong style={{ color: '#0C1512' }}>Duration</strong>: {event.durationMinutes} min</div>
              <div style={{ marginBottom: 8 }}><strong style={{ color: '#0C1512' }}>RSVPs</strong>: {event.registrationsCount || 0}</div>
              {event.guest && <div style={{ marginBottom: 8 }}><strong style={{ color: '#0C1512' }}>Guest</strong>: {event.guest} · {event.guestRole}</div>}
              {ytId && <div style={{ marginBottom: 8 }}><strong style={{ color: '#0C1512' }}>Stream</strong>: <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noreferrer" style={{ color: '#0C3B2E' }}>youtu.be/{ytId}</a></div>}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 899px) {
          .ic-stage-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
