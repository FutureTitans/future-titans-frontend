'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Trash2, Save, X, AlertCircle, Loader2 } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { adminICPanel } from '@/lib/api';

const empty = { roomId: '', title: '', videoUrl: '', thumbnailUrl: '', durationSeconds: 0 };

export default function AdminReplaysPage() {
  const [replays, setReplays] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState(empty);
  const [thumbFile, setThumbFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const thumbInputRef = useRef(null);
  const videoInputRef = useRef(null);

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

  const resetForm = () => {
    setDraft(empty);
    setThumbFile(null);
    setVideoFile(null);
    setCreating(false);
    if (thumbInputRef.current) thumbInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const submit = async () => {
    if (!draft.roomId || !draft.title) {
      alert('Room and title required');
      return;
    }
    setSaving(true);
    try {
      let thumbnailUrl = draft.thumbnailUrl;
      let videoUrl = draft.videoUrl;
      if (thumbFile) {
        setUploading(true);
        const t = await upload(
          `ic-replay-thumb-${Date.now()}-${thumbFile.name}`,
          thumbFile,
          { access: 'public', handleUploadUrl: '/api/upload' }
        );
        thumbnailUrl = t.url;
      }
      if (videoFile) {
        setUploading(true);
        const v = await upload(
          `ic-replay-video-${Date.now()}-${videoFile.name}`,
          videoFile,
          { access: 'public', handleUploadUrl: '/api/upload' }
        );
        videoUrl = v.url;
      }
      setUploading(false);
      if (!videoUrl) {
        alert('Video URL or file is required');
        setSaving(false);
        return;
      }
      await adminICPanel.createReplay({ ...draft, thumbnailUrl, videoUrl });
      resetForm();
      load();
    } catch (e) {
      alert(e?.error || 'Failed');
    } finally {
      setSaving(false);
      setUploading(false);
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
        <button onClick={() => (creating ? resetForm() : setCreating(true))} className="inline-flex items-center gap-2 bg-[#0C3B2E] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#0A2C22]">
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
            <input placeholder="Video URL (or upload below)" value={draft.videoUrl} onChange={(e) => setDraft({ ...draft, videoUrl: e.target.value })} className="md:col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input type="number" min="0" placeholder="Duration (seconds)" value={draft.durationSeconds} onChange={(e) => setDraft({ ...draft, durationSeconds: Number(e.target.value) })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Thumbnail image</label>
              <div className="flex items-center gap-3">
                <input ref={thumbInputRef} type="file" accept="image/*" onChange={(e) => setThumbFile(e.target.files?.[0] || null)} className="text-sm" />
                {(thumbFile || draft.thumbnailUrl) && (
                  <img
                    src={thumbFile ? URL.createObjectURL(thumbFile) : draft.thumbnailUrl}
                    alt="preview"
                    className="w-24 h-14 object-cover rounded border border-gray-200"
                  />
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">Video file (optional)</label>
              <input ref={videoInputRef} type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} className="text-sm" />
              <p className="text-xs text-gray-400 mt-1">If provided, replaces the URL above.</p>
            </div>
          </div>

          <button onClick={submit} disabled={saving || uploading} className="inline-flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#B8952E] disabled:opacity-60">
            {saving || uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {uploading ? 'Uploading…' : 'Add replay'}
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
                <th className="text-left px-4 py-3">Thumb</th>
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
                  <td className="px-4 py-3">
                    {r.thumbnailUrl ? (
                      <img src={r.thumbnailUrl} alt="" className="w-16 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-10 rounded bg-gray-100" />
                    )}
                  </td>
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
