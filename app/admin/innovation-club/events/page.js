'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Save, X, AlertCircle, Radio, EyeOff } from 'lucide-react';
import { adminICPanel } from '@/lib/api';

const emptyEvent = {
  roomId: '',
  format: 'ama',
  title: '',
  description: '',
  guest: '',
  guestRole: 'expert',
  startAt: '',
  durationMinutes: 45,
  xpAward: 20,
};

const STATUS_ORDER = ['upcoming', 'starting_soon', 'live', 'ended'];

const statusColor = (s) => ({
  upcoming: 'bg-gray-100 text-gray-700',
  starting_soon: 'bg-amber-100 text-amber-800',
  live: 'bg-red-100 text-red-700',
  ended: 'bg-gray-50 text-gray-500',
}[s] || 'bg-gray-50 text-gray-500');

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(emptyEvent);
  const [filter, setFilter] = useState({ status: '', roomId: '' });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.roomId) params.roomId = filter.roomId;
      const [ev, rms, m] = await Promise.all([
        adminICPanel.listEvents(params),
        adminICPanel.listRooms(),
        adminICPanel.getMeta(),
      ]);
      setEvents(ev);
      setRooms(rms);
      setMeta(m);
    } catch (e) {
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter.status, filter.roomId]);

  const roomOptions = useMemo(() => rooms.map((r) => ({ id: r._id, name: r.name })), [rooms]);

  const submit = async () => {
    if (!draft.roomId || !draft.title || !draft.startAt) {
      alert('Room, title and start time are required.');
      return;
    }
    try {
      await adminICPanel.createEvent(draft);
      setDraft(emptyEvent);
      setCreating(false);
      load();
    } catch (e) {
      alert(e?.error || 'Failed to publish event');
    }
  };

  const setStatus = async (id, status) => {
    try {
      await adminICPanel.setEventStatus(id, status);
      load();
    } catch (e) {
      alert(e?.error || 'Failed to change status');
    }
  };

  const unpublish = async (id) => {
    if (!confirm('Unpublish this event? Students who saved a seat will be notified.')) return;
    await adminICPanel.unpublishEvent(id);
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    await adminICPanel.deleteEvent(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-500 text-sm mt-1">Publish sessions and drive their lifecycle.</p>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="inline-flex items-center gap-2 bg-[#0C3B2E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0A2C22]"
        >
          {creating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {creating ? 'Cancel' : 'Create event'}
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={draft.roomId} onChange={(e) => setDraft({ ...draft, roomId: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Select room…</option>
              {roomOptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <select value={draft.format} onChange={(e) => setDraft({ ...draft, format: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {(meta?.eventFormats || []).map((f) => <option key={f.key} value={f.key}>{f.name}</option>)}
            </select>
            <input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Guest name" value={draft.guest} onChange={(e) => setDraft({ ...draft, guest: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <select value={draft.guestRole} onChange={(e) => setDraft({ ...draft, guestRole: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {(meta?.roles || []).map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <input type="datetime-local" value={draft.startAt} onChange={(e) => setDraft({ ...draft, startAt: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="number" min="5" placeholder="Duration (min)" value={draft.durationMinutes} onChange={(e) => setDraft({ ...draft, durationMinutes: Number(e.target.value) })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="number" min="0" placeholder="XP award" value={draft.xpAward} onChange={(e) => setDraft({ ...draft, xpAward: Number(e.target.value) })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} />
          </div>
          <button onClick={submit} className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#B8952E]">
            <Save className="w-4 h-4" /> Publish
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3">
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUS_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filter.roomId} onChange={(e) => setFilter({ ...filter, roomId: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
          <option value="">All rooms</option>
          {roomOptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4" /> {error}</div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          Nothing scheduled yet. Publish the club's first session.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Room</th>
                <th className="text-left px-4 py-3">Format</th>
                <th className="text-left px-4 py-3">Start</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="w-64"></th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{ev.title}</td>
                  <td className="px-4 py-3 text-gray-600">{ev.roomId?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{ev.format}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(ev.startAt).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(ev.status)}`}>{ev.status}</span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-1 flex-wrap">
                    {STATUS_ORDER.map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(ev._id, s)}
                        disabled={ev.status === s}
                        className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        title={`Move to ${s}`}
                      >
                        {s === 'live' && <Radio className="inline w-3 h-3 mr-1" />}
                        {s}
                      </button>
                    ))}
                    <button onClick={() => unpublish(ev._id)} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 text-gray-500" title="Unpublish">
                      <EyeOff className="inline w-3 h-3" />
                    </button>
                    <button onClick={() => remove(ev._id)} className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-red-50 text-red-500">
                      <Trash2 className="inline w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
