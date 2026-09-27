'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { adminICPanel } from '@/lib/api';

const empty = { roomId: '', title: '', videoUrl: '', thumbnailUrl: '', durationSeconds: 0 };

export default function AdminReplaysPage() {
  const [replays, setReplays] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(empty);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [rp, rms] = await Promise.all([adminICPanel.listReplays(), adminICPanel.listRooms()]);
      setReplays(rp);
      setRooms(rms);
    } catch {
      setError('Failed to load replays');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const roomOptions = useMemo(() => rooms.map((r) => ({ id: r._id, name: r.name })), [rooms]);

  const submit = async () => {
    if (!draft.roomId || !draft.title || !draft.videoUrl) {
      alert('Room, title and video URL required');
      return;
    }
    try {
      await adminICPanel.createReplay(draft);
      setDraft(empty);
      setCreating(false);
      load();
    } catch (e) {
      alert(e?.error || 'Failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete replay?')) return;
    await adminICPanel.deleteReplay(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Replays</h1>
          <p className="text-gray-500 text-sm mt-1">Recorded sessions available in room vaults and the Live hub.</p>
        </div>
        <button onClick={() => setCreating((v) => !v)} className="inline-flex items-center gap-2 bg-[#0C3B2E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0A2C22]">
          {creating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {creating ? 'Cancel' : 'Add replay'}
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select value={draft.roomId} onChange={(e) => setDraft({ ...draft, roomId: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <option value="">Select room…</option>
              {roomOptions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <input placeholder="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Video URL" value={draft.videoUrl} onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Thumbnail URL (optional)" value={draft.thumbnailUrl} onChange={(e) => setDraft({ ...draft, thumbnailUrl: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="number" min="0" placeholder="Duration (seconds)" value={draft.durationSeconds} onChange={(e) => setDraft({ ...draft, durationSeconds: Number(e.target.value) })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button onClick={submit} className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#B8952E]">
            <Save className="w-4 h-4" /> Add replay
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4" /> {error}</div>
      ) : replays.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">No replays yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Room</th>
                <th className="text-right px-4 py-3">Duration</th>
                <th className="text-right px-4 py-3">Views</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {replays.map((r) => (
                <tr key={r._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.title}</td>
                  <td className="px-4 py-3 text-gray-600">{r.roomId?.name || '—'}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{r.durationSeconds}s</td>
                  <td className="px-4 py-3 text-right text-gray-500">{r.views || 0}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(r._id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
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
