'use client';

import { useState, useEffect } from 'react';
import {
  Users, Plus, Edit, Trash2, Save, X, AlertCircle, RefreshCw, Calendar, Video,
} from 'lucide-react';
import { adminIC } from '@/lib/api';
import { upload } from '@vercel/blob/client';

const TRACKS = ['ai', 'business', 'design', 'finance'];
const FORMATS = ['live', 'recorded'];
const SESSION_STATUSES = ['scheduled', 'upcoming', 'live', 'completed', 'past', 'cancelled'];

const emptyExpert = { name: '', credential: '', bio: '', photo: '', track: 'ai' };
const emptySession = { expert: '', title: '', topic: '', scheduledDate: '', duration: 60, format: 'live', status: 'scheduled', videoUrl: '', thumbnailUrl: '' };

export default function ExpertsManagerPage() {
  const [experts, setExperts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExpertForm, setShowExpertForm] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [expertForm, setExpertForm] = useState(emptyExpert);
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [sessionForm, setSessionForm] = useState(emptySession);
  const [saving, setSaving] = useState(false);
  const [expertPhotoFile, setExpertPhotoFile] = useState(null);
  const [sessionThumbFile, setSessionThumbFile] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminIC.getExperts();
      setExperts(data.experts || data || []);
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Error fetching experts:', err);
      setError('Failed to load experts data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Expert CRUD
  const openExpertForm = (expert = null) => {
    setExpertPhotoFile(null);
    if (expert) {
      setEditingExpert(expert._id);
      setExpertForm({ name: expert.name, credential: expert.credential, bio: expert.bio || '', photo: expert.photo || '', track: expert.track });
    } else {
      setEditingExpert(null);
      setExpertForm(emptyExpert);
    }
    setShowExpertForm(true);
  };

  const closeExpertForm = () => {
    setShowExpertForm(false);
    setEditingExpert(null);
    setExpertForm(emptyExpert);
    setExpertPhotoFile(null);
  };

  const saveExpert = async () => {
    if (!expertForm.name || !expertForm.credential) return;
    setSaving(true);
    try {
      let photo = expertForm.photo || '';
      if (expertPhotoFile) {
        const result = await upload(`expert-photo-${Date.now()}-${expertPhotoFile.name}`, expertPhotoFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        photo = result.url;
      }
      const payload = { ...expertForm, photo };
      if (editingExpert) {
        await adminIC.updateExpert(editingExpert, payload);
      } else {
        await adminIC.createExpert(payload);
      }
      closeExpertForm();
      await fetchData();
    } catch (err) {
      console.error('Error saving expert:', err);
      alert('Failed to save expert.');
    } finally {
      setSaving(false);
    }
  };

  const deleteExpert = async (id) => {
    if (!confirm('Are you sure you want to delete this expert? This will also remove their sessions.')) return;
    try {
      await adminIC.deleteExpert(id);
      await fetchData();
    } catch (err) {
      console.error('Error deleting expert:', err);
      alert('Failed to delete expert.');
    }
  };

  // Session CRUD
  const openSessionForm = (session = null) => {
    setSessionThumbFile(null);
    if (session) {
      setEditingSession(session._id);
      setSessionForm({
        expert: session.expert?._id || session.expert || '',
        title: session.title,
        topic: session.topic || '',
        scheduledDate: session.scheduledDate ? session.scheduledDate.slice(0, 16) : '',
        duration: session.duration || 60,
        format: session.format || 'live',
        status: session.status || 'scheduled',
        videoUrl: session.videoUrl || '',
        thumbnailUrl: session.thumbnailUrl || '',
      });
    } else {
      setEditingSession(null);
      setSessionForm({ ...emptySession, expert: experts[0]?._id || '' });
    }
    setShowSessionForm(true);
  };

  const closeSessionForm = () => {
    setShowSessionForm(false);
    setEditingSession(null);
    setSessionForm(emptySession);
    setSessionThumbFile(null);
  };

  const saveSession = async () => {
    if (!sessionForm.title || !sessionForm.expert) return;
    if (!sessionForm.scheduledDate) { alert('Scheduled date is required.'); return; }
    if (!sessionForm.topic) { alert('Topic is required.'); return; }
    setSaving(true);
    try {
      let thumbnailUrl = sessionForm.thumbnailUrl || '';
      if (sessionThumbFile) {
        const result = await upload(`session-thumb-${Date.now()}-${sessionThumbFile.name}`, sessionThumbFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        thumbnailUrl = result.url;
      }
      const payload = { ...sessionForm, thumbnailUrl };
      if (editingSession) {
        await adminIC.updateSession(editingSession, payload);
      } else {
        await adminIC.createSession(payload);
      }
      closeSessionForm();
      await fetchData();
    } catch (err) {
      console.error('Error saving session:', err);
      alert('Failed to save session.');
    } finally {
      setSaving(false);
    }
  };

  const deleteSession = async (id) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    try {
      await adminIC.deleteSession(id);
      await fetchData();
    } catch (err) {
      console.error('Error deleting session:', err);
      alert('Failed to delete session.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-pulse text-gray-400">Loading experts...</div></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="w-10 h-10 text-red-400" />
        <p className="text-gray-600">{error}</p>
        <button onClick={fetchData} className="flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#B8952E] font-medium"><RefreshCw className="w-4 h-4" /> Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Experts Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Experts Manager</h1>
            <p className="text-gray-500 text-sm mt-1">Manage expert profiles and their sessions.</p>
          </div>
          <button onClick={() => openExpertForm()} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] text-white px-4 py-2 rounded-xl text-sm font-medium transition">
            <Plus className="w-4 h-4" /> Add Expert
          </button>
        </div>

        {/* Expert Form */}
        {showExpertForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{editingExpert ? 'Edit Expert' : 'Add Expert'}</h3>
              <button onClick={closeExpertForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={expertForm.name} onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Dr. Jane Smith" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credential *</label>
                <input type="text" value={expertForm.credential} onChange={(e) => setExpertForm({ ...expertForm, credential: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="PhD in Computer Science, MIT" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea value={expertForm.bio} onChange={(e) => setExpertForm({ ...expertForm, bio: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Brief bio..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Photo</label>
                {(expertPhotoFile || expertForm.photo) && (
                  <div className="mb-2 relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={expertPhotoFile ? URL.createObjectURL(expertPhotoFile) : expertForm.photo}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => { setExpertPhotoFile(null); setExpertForm({ ...expertForm, photo: '' }); }}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >x</button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) { alert('File must be under 5 MB'); e.target.value = ''; return; }
                    setExpertPhotoFile(file);
                  }}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37]/10 file:text-[#B8952E] hover:file:bg-[#D4AF37]/20 file:cursor-pointer file:transition-colors"
                />
                <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP. Max 5 MB.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Track</label>
                <select value={expertForm.track} onChange={(e) => setExpertForm({ ...expertForm, track: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] bg-white">
                  {TRACKS.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={closeExpertForm} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
              <button onClick={saveExpert} disabled={saving || !expertForm.name || !expertForm.credential} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Expert'}
              </button>
            </div>
          </div>
        )}

        {/* Experts Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {experts.length === 0 ? (
            <div className="p-10 text-center text-gray-400 flex flex-col items-center">
              <Users className="w-10 h-10 text-gray-300 mb-3" />
              <p>No experts yet. Add your first expert above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-medium">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Credential</th>
                    <th className="px-6 py-4">Track</th>
                    <th className="px-6 py-4">Sessions</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {experts.map((expert) => (
                    <tr key={expert._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900">{expert.name}</td>
                      <td className="px-6 py-4 max-w-[200px] truncate">{expert.credential}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#D4AF37]/10 text-[#B8952E] capitalize">{expert.track}</span>
                      </td>
                      <td className="px-6 py-4">{expert.sessionCount ?? 0}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openExpertForm(expert)} className="p-1.5 text-gray-400 hover:text-[#D4AF37] transition" title="Edit"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => deleteExpert(expert._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sessions Section */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sessions</h2>
            <p className="text-gray-500 text-sm mt-1">Schedule and manage expert sessions.</p>
          </div>
          <button onClick={() => openSessionForm()} disabled={experts.length === 0} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
            <Plus className="w-4 h-4" /> Add Session
          </button>
        </div>

        {/* Session Form */}
        {showSessionForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{editingSession ? 'Edit Session' : 'Add Session'}</h3>
              <button onClick={closeSessionForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expert *</label>
                <select value={sessionForm.expert} onChange={(e) => setSessionForm({ ...sessionForm, expert: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] bg-white">
                  <option value="">Select expert...</option>
                  {experts.map((ex) => <option key={ex._id} value={ex._id}>{ex.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input type="text" value={sessionForm.title} onChange={(e) => setSessionForm({ ...sessionForm, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Session title" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                <input type="text" value={sessionForm.topic} onChange={(e) => setSessionForm({ ...sessionForm, topic: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Topic of discussion" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                <input type="datetime-local" value={sessionForm.scheduledDate} onChange={(e) => setSessionForm({ ...sessionForm, scheduledDate: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input type="number" value={sessionForm.duration} onChange={(e) => setSessionForm({ ...sessionForm, duration: parseInt(e.target.value) || 60 })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" min={15} max={300} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                <select value={sessionForm.format} onChange={(e) => setSessionForm({ ...sessionForm, format: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] bg-white">
                  {FORMATS.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select value={sessionForm.status} onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] bg-white">
                  {SESSION_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Video URL</label>
                <input type="url" value={sessionForm.videoUrl} onChange={(e) => setSessionForm({ ...sessionForm, videoUrl: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Thumbnail</label>
                {(sessionThumbFile || sessionForm.thumbnailUrl) && (
                  <div className="mb-2 relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={sessionThumbFile ? URL.createObjectURL(sessionThumbFile) : sessionForm.thumbnailUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => { setSessionThumbFile(null); setSessionForm({ ...sessionForm, thumbnailUrl: '' }); }}
                      className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                    >x</button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 5 * 1024 * 1024) { alert('File must be under 5 MB'); e.target.value = ''; return; }
                    setSessionThumbFile(file);
                  }}
                  className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37]/10 file:text-[#B8952E] hover:file:bg-[#D4AF37]/20 file:cursor-pointer file:transition-colors"
                />
                <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP. Max 5 MB.</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-5">
              <button onClick={closeSessionForm} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
              <button onClick={saveSession} disabled={saving || !sessionForm.title || !sessionForm.expert} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Session'}
              </button>
            </div>
          </div>
        )}

        {/* Sessions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {sessions.length === 0 ? (
            <div className="p-10 text-center text-gray-400 flex flex-col items-center">
              <Video className="w-10 h-10 text-gray-300 mb-3" />
              <p>No sessions yet. Create one above after adding an expert.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-medium">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Expert</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Format</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessions.map((session) => {
                    const expertName = typeof session.expert === 'object' ? session.expert?.name : experts.find(e => e._id === session.expert)?.name || 'Unknown';
                    const statusColors = { scheduled: 'bg-blue-100 text-blue-800', live: 'bg-green-100 text-green-800', completed: 'bg-gray-100 text-gray-800', cancelled: 'bg-red-100 text-red-800' };
                    return (
                      <tr key={session._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">{session.title}</td>
                        <td className="px-6 py-4">{expertName}</td>
                        <td className="px-6 py-4">{session.scheduledDate ? new Date(session.scheduledDate).toLocaleDateString() : '--'}</td>
                        <td className="px-6 py-4 capitalize">{session.format}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[session.status] || 'bg-gray-100 text-gray-800'}`}>{session.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openSessionForm(session)} className="p-1.5 text-gray-400 hover:text-[#D4AF37] transition" title="Edit"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => deleteSession(session._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
