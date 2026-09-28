'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Radio, Calendar, Bell, Play, MessageCircle, Users, Clock, ExternalLink } from 'lucide-react';
import { studentIC } from '@/lib/api';
import { getUser } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState('');
  const [posting, setPosting] = useState(false);

  const load = async () => {
    try {
      const e = await studentIC.getEvent(id);
      setEvent(e);
    } catch (err) {
      setError(err?.error || 'Event not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getUser()) { router.push('/login'); return; }
    load();
  }, [id, router]);

  const rsvp = async () => {
    try {
      await studentIC.rsvpEvent(id);
      await load();
    } catch (e) { alert('Could not RSVP.'); }
  };

  const cancel = async () => {
    try {
      await studentIC.cancelRsvp(id);
      await load();
    } catch (e) { alert('Could not cancel.'); }
  };

  const enter = async () => {
    try {
      await studentIC.attendEvent(id);
      if (event?.streamUrl) window.open(event.streamUrl, '_blank');
      await load();
    } catch (e) { alert('Could not enter live.'); }
  };

  const submitQ = async () => {
    if (!question.trim()) return;
    setPosting(true);
    try {
      await studentIC.submitQuestion(id, question.trim());
      setQuestion('');
      await load();
    } catch (e) {
      alert(e?.error || 'Could not submit question.');
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading event..." />;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  const start = new Date(event.startAt);
  const now = new Date();
  const minutesTo = Math.round((start - now) / 60000);
  const isLive = event.status === 'live';
  const isEnded = event.status === 'ended';
  const isRegistered = !!event.myRegistration;

  const addToCal = () => {
    const dtStart = start.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const dtEnd = new Date(start.getTime() + (event.durationMinutes || 45) * 60000)
      .toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const url = `data:text/calendar;charset=utf-8,` + encodeURIComponent([
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT',
      `UID:${event._id}@youngpreneurs`,
      `DTSTAMP:${dtStart}`, `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\n'));
    const a = document.createElement('a');
    a.href = url; a.download = `${event.title}.ics`;
    a.click();
  };

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-[#FAF8F3]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/student/innovation-club/live" className="inline-flex items-center gap-2 text-sm text-[#0A2C22] hover:underline mb-6">
          <ArrowLeft className="w-4 h-4" /> Live hub
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-3xl overflow-hidden bg-white border border-gray-100">
              <div className="aspect-video bg-[#0A2C22] relative">
                {event.thumbnailUrl && <img src={event.thumbnailUrl} alt="" className="w-full h-full object-cover opacity-70" />}
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {isLive && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D23A2A] text-white text-[11px] font-bold uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
                        </span>
                      )}
                      <span className="text-[11px] font-mono uppercase text-white/80">{event.roomId?.name} · {event.format}</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{event.title}</h1>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#0A2C22]" /> {start.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#0A2C22]" /> {event.durationMinutes} min</span>
                  <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4 text-[#0A2C22]" /> {event.registrationsCount || 0} RSVPs</span>
                </div>
                {event.guest && (
                  <div className="mt-4 text-sm">
                    <span className="text-gray-500">Guest: </span>
                    <span className="font-semibold text-[#0A2C22]">{event.guest}</span>
                    <span className="text-gray-500"> · {event.guestRole}</span>
                  </div>
                )}
                {event.description && (
                  <p className="text-sm text-gray-700 leading-relaxed mt-4 whitespace-pre-wrap">{event.description}</p>
                )}
                <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                  {isEnded ? (
                    <span className="text-sm text-gray-500">This session has ended.</span>
                  ) : isLive ? (
                    <button onClick={enter} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#D23A2A] text-white font-bold text-sm hover:bg-[#B02A1F]">
                      <Play className="w-4 h-4" /> Enter Live
                    </button>
                  ) : minutesTo <= 15 ? (
                    <button onClick={enter} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A2C22] text-white font-bold text-sm hover:bg-[#0C3B2E]">
                      <Radio className="w-4 h-4" /> Enter Waiting Room
                    </button>
                  ) : (
                    isRegistered ? (
                      <button onClick={cancel} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A2C22]/10 text-[#0A2C22] font-bold text-sm">
                        Seat Saved ✓
                      </button>
                    ) : (
                      <button onClick={rsvp} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0A2C22] text-white font-bold text-sm hover:bg-[#0C3B2E]">
                        <Bell className="w-4 h-4" /> Save my seat
                      </button>
                    )
                  )}
                  {!isEnded && (
                    <button onClick={addToCal} className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-gray-200 text-sm text-[#0A2C22] font-semibold hover:bg-gray-50">
                      <Calendar className="w-4 h-4" /> Add to calendar
                    </button>
                  )}
                  {event.streamUrl && isLive && (
                    <a href={event.streamUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-3 rounded-full border border-gray-200 text-sm text-[#0A2C22] font-semibold hover:bg-gray-50">
                      <ExternalLink className="w-4 h-4" /> Open stream
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Q&A sidebar */}
          <div className="bg-white rounded-3xl border border-gray-100 p-5">
            <h3 className="font-bold text-[#0A2C22] flex items-center gap-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              <MessageCircle className="w-4 h-4" /> Questions
            </h3>
            <p className="text-xs text-gray-500 mt-1">Ask what you actually want to know. Questions go through moderation.</p>
            <div className="mt-4 space-y-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask the guest…"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:border-[#0A2C22] outline-none"
                rows={3}
              />
              <button
                onClick={submitQ}
                disabled={posting || !question.trim()}
                className="w-full py-2 rounded-full bg-[#0A2C22] text-white text-sm font-bold hover:bg-[#0C3B2E] disabled:opacity-50"
              >
                {posting ? 'Submitting…' : 'Submit question'}
              </button>
            </div>
            <div className="mt-6">
              <div className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold mb-2">Approved</div>
              {(event.questions || []).length === 0 ? (
                <div className="text-xs text-gray-400 py-4 text-center">No approved questions yet.</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-auto">
                  {event.questions.map((q) => (
                    <div key={q._id} className="rounded-xl bg-[#FAF8F3] p-3 text-sm">
                      <div className="text-[#0A2C22]">{q.content}</div>
                      <div className="text-[10px] text-gray-400 mt-1">
                        {q.status === 'selected_for_live' ? '★ Selected for live' : 'Approved'} · {q.upvotes || 0} upvotes
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
