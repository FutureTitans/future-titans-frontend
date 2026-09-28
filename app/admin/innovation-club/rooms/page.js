'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, Save, X, AlertCircle, Loader2, Pencil } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { adminICPanel } from '@/lib/api';

const emptyRoom = {
  slug: '',
  name: '',
  universe: 'BUILD',
  promise: '',
  tags: '',
  iconEmoji: '',
  coverImage: '',
};

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyRoom);
  const [coverFile, setCoverFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

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

  const resetForm = () => {
    setDraft(emptyRoom);
    setCoverFile(null);
    setCreating(false);
    setEditing(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openEdit = (room) => {
    setEditing(room._id);
    setCreating(true);
    setDraft({
      slug: room.slug,
      name: room.name,
      universe: room.universe,
      promise: room.promise || '',
      tags: (room.tags || []).join(', '),
      iconEmoji: room.iconEmoji || '',
      coverImage: room.coverImage || '',
    });
    setCoverFile(null);
  };

  const submit = async () => {
    if (!draft.slug || !draft.name) {
      alert('Slug and name are required.');
      return;
    }
    setSaving(true);
    try {
      let coverImage = draft.coverImage;
      if (coverFile) {
        setUploading(true);
        const res = await upload(
          `ic-room-cover-${Date.now()}-${coverFile.name}`,
          coverFile,
          { access: 'public', handleUploadUrl: '/api/upload' }
        );
        coverImage = res.url;
        setUploading(false);
      }
      const payload = {
        ...draft,
        coverImage,
        tags: draft.tags ? draft.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };
      if (editing) {
        await adminICPanel.updateRoom(editing, payload);
      } else {
        await adminICPanel.createRoom(payload);
      }
      resetForm();
      await load();
    } catch (e) {
      alert(e?.error || 'Failed to save room');
    } finally {
      setSaving(false);
      setUploading(false);
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
          onClick={() => (creating ? resetForm() : setCreating(true))}
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
            <input placeholder="Icon emoji (optional)" value={draft.iconEmoji} onChange={(e) => setDraft({ ...draft, iconEmoji: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Tags (comma separated)" value={draft.tags} onChange={(e) => setDraft({ ...draft, tags: e.target.value })} className="md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <textarea placeholder="Promise / one-liner" value={draft.promise} onChange={(e) => setDraft({ ...draft, promise: e.target.value })} className="md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={2} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Cover image</label>
            <div className="flex items-center gap-3">
              <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="text-sm" />
              {(coverFile || draft.coverImage) && (
                <img
                  src={coverFile ? URL.createObjectURL(coverFile) : draft.coverImage}
                  alt="preview"
                  className="w-24 h-14 object-cover rounded border border-gray-200"
                />
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">Uploaded to Vercel Blob on save.</p>
          </div>

          <button
            onClick={submit}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#B8952E] disabled:opacity-60"
          >
            {saving || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {uploading ? 'Uploading…' : editing ? 'Save changes' : 'Create room'}
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
                <th className="text-left px-4 py-3">Cover</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Universe</th>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-right px-4 py-3">Members</th>
                <th className="w-24"></th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r._id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    {r.coverImage ? (
                      <img src={r.coverImage} alt="" className="w-16 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-10 rounded bg-gray-100 flex items-center justify-center text-lg">{r.iconEmoji || '·'}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.universe}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{r.slug}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{r.memberCount || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(r)} className="text-gray-400 hover:text-[#0C3B2E]" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(r._id)} className="text-gray-400 hover:text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
