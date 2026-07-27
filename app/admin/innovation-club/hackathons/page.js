'use client';

import { useState, useEffect } from 'react';
import {
  Trophy, Plus, Edit, Trash2, Save, X, AlertCircle, RefreshCw,
  ChevronDown, ChevronUp, Award, Clock,
} from 'lucide-react';
import { adminIC } from '@/lib/api';

const HACKATHON_STATUSES = ['draft', 'upcoming', 'active', 'judging', 'completed'];
const BADGE_OPTIONS = ['', 'winner', 'finalist', 'spotlight'];

const emptyHackathon = {
  title: '', description: '', startDate: '', endDate: '', classes: '',
  prizePool: '', status: 'draft', rulebookUrl: '', coverImage: '', maxTeams: 50,
  timeline: [],
};

export default function HackathonsManagerPage() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyHackathon);
  const [saving, setSaving] = useState(false);
  const [expandedHackathon, setExpandedHackathon] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminIC.getHackathons();
      setHackathons(data.hackathons || data || []);
    } catch (err) {
      console.error('Error fetching hackathons:', err);
      setError('Failed to load hackathons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openForm = (hackathon = null) => {
    if (hackathon) {
      setEditingId(hackathon._id);
      setForm({
        title: hackathon.title,
        description: hackathon.description || '',
        startDate: hackathon.startDate ? hackathon.startDate.slice(0, 10) : '',
        endDate: hackathon.endDate ? hackathon.endDate.slice(0, 10) : '',
        classes: Array.isArray(hackathon.classes) ? hackathon.classes.join(', ') : hackathon.classes || '',
        prizePool: hackathon.prizePool || '',
        status: hackathon.status || 'draft',
        rulebookUrl: hackathon.rulebookUrl || '',
        coverImage: hackathon.coverImage || '',
        maxTeams: hackathon.maxTeams || 50,
        timeline: hackathon.timeline || [],
      });
    } else {
      setEditingId(null);
      setForm(emptyHackathon);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyHackathon);
  };

  const saveHackathon = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        classes: typeof form.classes === 'string' ? form.classes.split(',').map(c => c.trim()).filter(Boolean) : form.classes,
      };
      if (editingId) {
        await adminIC.updateHackathon(editingId, payload);
      } else {
        await adminIC.createHackathon(payload);
      }
      closeForm();
      await fetchData();
    } catch (err) {
      console.error('Error saving hackathon:', err);
      alert('Failed to save hackathon.');
    } finally {
      setSaving(false);
    }
  };

  const deleteHackathon = async (id) => {
    if (!confirm('Are you sure you want to delete this hackathon and all its teams?')) return;
    try {
      await adminIC.deleteHackathon(id);
      if (expandedHackathon === id) setExpandedHackathon(null);
      await fetchData();
    } catch (err) {
      console.error('Error deleting hackathon:', err);
      alert('Failed to delete hackathon.');
    }
  };

  // Timeline management
  const addTimelineStep = () => {
    setForm({ ...form, timeline: [...form.timeline, { label: '', date: '' }] });
  };

  const updateTimelineStep = (idx, field, value) => {
    const updated = [...form.timeline];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, timeline: updated });
  };

  const removeTimelineStep = (idx) => {
    setForm({ ...form, timeline: form.timeline.filter((_, i) => i !== idx) });
  };

  // Team management
  const handleScoreChange = async (teamId, score) => {
    try {
      await adminIC.updateTeamScore(teamId, { score: parseInt(score) || 0 });
      await fetchData();
    } catch (err) {
      console.error('Error updating score:', err);
      alert('Failed to update score.');
    }
  };

  const handleBadgeChange = async (teamId, badge) => {
    try {
      await adminIC.setTeamBadge(teamId, { badge: badge || null });
      await fetchData();
    } catch (err) {
      console.error('Error setting badge:', err);
      alert('Failed to set badge.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-pulse text-gray-400">Loading hackathons...</div></div>;
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hackathons Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage hackathon events and teams.</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Create Hackathon
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Hackathon' : 'Create Hackathon'}</h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Hackathon title" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Describe the hackathon..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classes (comma-separated)</label>
              <input type="text" value={form.classes} onChange={(e) => setForm({ ...form, classes: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="6, 7, 8, 9, 10" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prize Pool</label>
              <input type="text" value={form.prizePool} onChange={(e) => setForm({ ...form, prizePool: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="INR 50,000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] bg-white">
                {HACKATHON_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Teams</label>
              <input type="number" value={form.maxTeams} onChange={(e) => setForm({ ...form, maxTeams: parseInt(e.target.value) || 50 })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" min={1} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rulebook URL</label>
              <input type="url" value={form.rulebookUrl} onChange={(e) => setForm({ ...form, rulebookUrl: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
              <input type="url" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="https://..." />
            </div>
          </div>

          {/* Timeline Editor */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Timeline Steps</label>
              <button onClick={addTimelineStep} className="flex items-center gap-1 text-sm text-[#D4AF37] hover:text-[#B8952E] font-medium">
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>
            {form.timeline.length === 0 ? (
              <p className="text-sm text-gray-400">No timeline steps. Add steps to define the hackathon schedule.</p>
            ) : (
              <div className="space-y-2">
                {form.timeline.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input type="text" value={step.label} onChange={(e) => updateTimelineStep(idx, 'label', e.target.value)} className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Step label" />
                    <input type="date" value={step.date ? step.date.slice(0, 10) : ''} onChange={(e) => updateTimelineStep(idx, 'date', e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" />
                    <button onClick={() => removeTimelineStep(idx)} className="p-1.5 text-gray-400 hover:text-red-500 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button onClick={closeForm} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
            <button onClick={saveHackathon} disabled={saving || !form.title} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Hackathon'}
            </button>
          </div>
        </div>
      )}

      {/* Hackathons Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {hackathons.length === 0 ? (
          <div className="p-10 text-center text-gray-400 flex flex-col items-center">
            <Trophy className="w-10 h-10 text-gray-300 mb-3" />
            <p>No hackathons yet. Create your first one above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Classes</th>
                  <th className="px-6 py-4">Prize Pool</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Teams</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hackathons.map((h) => {
                  const statusColors = { draft: 'bg-gray-100 text-gray-800', upcoming: 'bg-blue-100 text-blue-800', active: 'bg-green-100 text-green-800', judging: 'bg-amber-100 text-amber-800', completed: 'bg-purple-100 text-purple-800' };
                  const isExpanded = expandedHackathon === h._id;
                  const teams = h.teams || [];
                  return (
                    <tr key={h._id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4" colSpan={7}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 flex-1 min-w-0">
                            <span className="font-medium text-gray-900">{h.title}</span>
                            <span className="hidden sm:inline text-gray-500">
                              {h.startDate ? new Date(h.startDate).toLocaleDateString() : '--'} - {h.endDate ? new Date(h.endDate).toLocaleDateString() : '--'}
                            </span>
                            <span className="hidden md:inline text-gray-500">{Array.isArray(h.classes) ? h.classes.join(', ') : h.classes || '--'}</span>
                            <span className="hidden md:inline text-gray-500">{h.prizePool || '--'}</span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[h.status] || 'bg-gray-100 text-gray-800'}`}>{h.status}</span>
                            <span className="text-gray-500">{teams.length}{h.maxTeams ? `/${h.maxTeams}` : ''}</span>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <button onClick={() => setExpandedHackathon(isExpanded ? null : h._id)} className="p-1.5 text-gray-400 hover:text-gray-600 transition" title="Toggle teams">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button onClick={() => openForm(h)} className="p-1.5 text-gray-400 hover:text-[#D4AF37] transition" title="Edit"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => deleteHackathon(h._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>

                        {/* Expanded Teams */}
                        {isExpanded && (
                          <div className="mt-4 bg-gray-50 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Registered Teams ({teams.length})</h4>
                            {teams.length === 0 ? (
                              <p className="text-sm text-gray-400">No teams registered yet.</p>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs text-gray-600">
                                  <thead className="text-gray-500 font-medium">
                                    <tr>
                                      <th className="px-3 py-2">Team Name</th>
                                      <th className="px-3 py-2">Members</th>
                                      <th className="px-3 py-2">Score</th>
                                      <th className="px-3 py-2">Badge</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {teams.map((team) => (
                                      <tr key={team._id}>
                                        <td className="px-3 py-2 font-medium text-gray-800">{team.name}</td>
                                        <td className="px-3 py-2">{team.members?.length || 0}</td>
                                        <td className="px-3 py-2">
                                          <input type="number" defaultValue={team.score || 0} onBlur={(e) => handleScoreChange(team._id, e.target.value)} className="w-20 border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40" min={0} />
                                        </td>
                                        <td className="px-3 py-2">
                                          <select defaultValue={team.badge || ''} onChange={(e) => handleBadgeChange(team._id, e.target.value)} className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#D4AF37]/40 bg-white">
                                            {BADGE_OPTIONS.map((b) => <option key={b} value={b}>{b ? b.charAt(0).toUpperCase() + b.slice(1) : 'None'}</option>)}
                                          </select>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        )}
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
  );
}
