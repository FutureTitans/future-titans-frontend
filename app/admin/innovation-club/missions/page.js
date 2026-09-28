'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2, Save, X, AlertCircle, Loader2 } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { adminICPanel } from '@/lib/api';

const empty = {
  roomId: '',
  title: '',
  description: '',
  difficulty: 'medium',
  submissionType: 'text',
  xpAward: 40,
  deadline: '',
  coverImage: '',
};

export default function AdminMissionsPage() {
  const [missions, setMissions] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(empty);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ms, rms] = await Promise.all([adminICPanel.listMissions(), adminICPanel.listRooms()]);
      setMissions(ms);
      setRooms(rms);
    } catch {
      setError('Failed to load missions');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const roomOptions = useMemo(() => rooms.map((r) => ({ id: r._id, name: r.name })), [rooms]);

  const resetForm = () => {
    setDraft(empty);
    setCoverFile(null);
    setCreating(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = async () => {
    if (!draft.roomId || !draft.title) {
      alert('Room and title required');
      return;
    }
    setSaving(true);
    try {
      let coverImage = draft.coverImage;
      if (coverFile) {
        setUploading(true);
        const res = await upload(
          `ic-mission-cover-${Date.now()}-${coverFile.name}`,
          coverFile,
          { access: 'public', handleUploadUrl: '/api/upload' }
        );
        coverImage = res.url;
        setUploading(false);
      }
      const payload = { ...draft, coverImage };
      if (!payload.deadline) delete payload.deadline;
      await adminICPanel.createMission(payload);
      resetForm();
      load();
    } catch (e) {
      alert(e?.error || 'Failed to create mission');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete mission?')) return;
    await adminICPanel.deleteMission(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
          <p className="text-gray-500 text-sm mt-1">Steps, XP, deadlines. Students submit; you review in Top Builds.</p>
        </div>
        <button onClick={() => (creating ? resetForm() : setCreating(true))} className="inline-flex items-center gap-2 bg-[#0C3B2E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0A2C22]">
          {creating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {creating ? 'Cancel' : 'New mission'}
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
            <select value={draft.difficulty} onChange={(e) => setDraft({ ...draft, difficulty: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {['easy', 'medium', 'hard'].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={draft.submissionType} onChange={(e) => setDraft({ ...draft, submissionType: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
              {['text', 'link', 'file', 'video'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <input type="number" min="0" placeholder="XP" value={draft.xpAward} onChange={(e) => setDraft({ ...draft, xpAward: Number(e.target.value) })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="datetime-local" placeholder="Deadline" value={draft.deadline} onChange={(e) => setDraft({ ...draft, deadline: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <textarea placeholder="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" rows={3} />
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
          </div>

          <button
            onClick={submit}
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#B8952E] disabled:opacity-60"
          >
            {saving || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {uploading ? 'Uploading…' : 'Create'}
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="w-4 h-4" /> {error}</div>
      ) : missions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">No missions yet.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="text-left px-4 py-3">Cover</th>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Room</th>
                <th className="text-left px-4 py-3">Difficulty</th>
                <th className="text-right px-4 py-3">XP</th>
                <th className="text-right px-4 py-3">Completions</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m) => (
                <tr key={m._id} className="border-t border-gray-100">
                  <td className="px-4 py-3">
                    {m.coverImage ? (
                      <img src={m.coverImage} alt="" className="w-16 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-10 rounded bg-gray-100" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{m.title}</td>
                  <td className="px-4 py-3 text-gray-600">{m.roomId?.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{m.difficulty}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{m.xpAward}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{m.completionsCount || 0}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => remove(m._id)} className="text-gray-400 hover:text-red-600">
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
