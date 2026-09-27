'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { adminICPanel } from '@/lib/api';

const emptyRoom = { slug: '', name: '', universe: 'BUILD', promise: '', tags: '' };

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(emptyRoom);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r, m] = await Promise.all([adminICPanel.listRooms(), adminICPanel.getMeta()]);
      setRooms(r);
      setMeta(m);
    } catch (e) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    try {
      const payload = {
        ...draft,
        tags: draft.tags ? draft.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      await adminICPanel.createRoom(payload);
      setDraft(emptyRoom);
      setCreating(false);
      load();
    } catch (e) {
      alert(e?.error || 'Failed to create room');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this room?')) return;
    await adminICPanel.deleteRoom(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-500 text-sm mt-1">Universes host rooms. Rooms hold events, missions and lounges.</p>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="inline-flex items-center gap-2 bg-[#0C3B2E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0A2C22]"
        >
          {creating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {creating ? 'Cancel' : 'New room'}
        </button>
      </div>

      {creating && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Slug (e.g. future-mode)" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <select value={draft.universe} onChange={(e) => setDraft({ ...draft, universe: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {(meta?.universes || []).map((u) => (
                <option key={u.key} value={u.key}>{u.emoji} {u.name}</option>
              ))}
            </select>
            <input placeholder="Tags (comma separated)" value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <textarea placeholder="Promise / one-liner" value={draft.promise} onChange={(e) => setDraft({ ...draft, promise: e.target.value })} className="md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} />
          </div>
          <button onClick={submit} className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#B8952E]">
            <Save className="w-4 h-4" /> Create room
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4" /> {error}</div>
      ) : rooms.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
          No rooms yet. Create the 14 rooms across 6 universes.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Universe</th>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-right px-4 py-3">Members</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r._id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.universe}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.slug}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{r.memberCount || 0}</td>
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
