'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap, Plus, Edit, Trash2, Save, X, AlertCircle, RefreshCw,
  ChevronDown, ChevronUp, Users,
} from 'lucide-react';
import { adminIC } from '@/lib/api';
import { upload } from '@vercel/blob/client';

const FORMATS = ['online', 'offline', 'hybrid'];

const emptyModule = { title: '', description: '', order: 1 };

const emptyCohort = {
  startDate: '', endDate: '', capacity: 30, format: 'online',
  certificateTemplate: '', autoIssueCertificate: false,
  modules: [
    { title: '', description: '', order: 1 },
    { title: '', description: '', order: 2 },
    { title: '', description: '', order: 3 },
    { title: '', description: '', order: 4 },
  ],
};

export default function TrainingManagerPage() {
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyCohort);
  const [saving, setSaving] = useState(false);
  const [expandedCohort, setExpandedCohort] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminIC.getCohorts();
      setCohorts(data.cohorts || data || []);
    } catch (err) {
      console.error('Error fetching cohorts:', err);
      setError('Failed to load training cohorts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openForm = (cohort = null) => {
    setCertificateFile(null);
    if (cohort) {
      setEditingId(cohort._id);
      const modules = cohort.modules && cohort.modules.length > 0
        ? cohort.modules.map((m, i) => ({ title: m.title || '', description: m.description || '', order: m.order || i + 1 }))
        : emptyCohort.modules;
      setForm({
        startDate: cohort.startDate ? cohort.startDate.slice(0, 10) : '',
        endDate: cohort.endDate ? cohort.endDate.slice(0, 10) : '',
        capacity: cohort.capacity || 30,
        format: cohort.format || 'online',
        certificateTemplate: cohort.certificateTemplate || '',
        autoIssueCertificate: cohort.autoIssueCertificate || false,
        modules,
      });
    } else {
      setEditingId(null);
      setForm(JSON.parse(JSON.stringify(emptyCohort)));
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(JSON.parse(JSON.stringify(emptyCohort)));
    setCertificateFile(null);
  };

  const updateModule = (idx, field, value) => {
    const updated = [...form.modules];
    updated[idx] = { ...updated[idx], [field]: value };
    setForm({ ...form, modules: updated });
  };

  const saveCohort = async () => {
    if (!form.startDate || !form.endDate) return;
    setSaving(true);
    try {
      let certificateTemplate = form.certificateTemplate || '';
      if (certificateFile) {
        const result = await upload(`certificate-template-${Date.now()}-${certificateFile.name}`, certificateFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        certificateTemplate = result.url;
      }
      const payload = { ...form, certificateTemplate };
      if (editingId) {
        await adminIC.updateCohort(editingId, payload);
      } else {
        await adminIC.createCohort(payload);
      }
      closeForm();
      await fetchData();
    } catch (err) {
      console.error('Error saving cohort:', err);
      alert('Failed to save cohort.');
    } finally {
      setSaving(false);
    }
  };

  const deleteCohort = async (id) => {
    if (!confirm('Are you sure you want to delete this training cohort?')) return;
    try {
      await adminIC.deleteCohort(id);
      if (expandedCohort === id) setExpandedCohort(null);
      await fetchData();
    } catch (err) {
      console.error('Error deleting cohort:', err);
      alert('Failed to delete cohort.');
    }
  };

  const getCohortStatus = (cohort) => {
    const now = new Date();
    const start = new Date(cohort.startDate);
    const end = new Date(cohort.endDate);
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-pulse text-gray-400">Loading training cohorts...</div></div>;
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
          <h1 className="text-2xl font-bold text-gray-900">Teachers' Training Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Manage training cohorts, modules, and enrolled teachers.</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] text-white px-4 py-2 rounded-xl text-sm font-medium transition">
          <Plus className="w-4 h-4" /> Create Cohort
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Cohort' : 'Create Cohort'}</h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) || 30 })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" min={1} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] bg-white">
                {FORMATS.map((f) => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Certificate Template</label>
              {(certificateFile || form.certificateTemplate) && (
                <div className="mb-2 flex items-center gap-2">
                  {certificateFile ? (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg truncate max-w-[200px]">{certificateFile.name}</span>
                  ) : form.certificateTemplate.match(/\.(jpe?g|png|webp)$/i) ? (
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                      <img src={form.certificateTemplate} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <a href={form.certificateTemplate} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D4AF37] underline truncate max-w-[200px]">{form.certificateTemplate.split('/').pop()}</a>
                  )}
                  <button
                    onClick={() => { setCertificateFile(null); setForm({ ...form, certificateTemplate: '' }); }}
                    className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  >x</button>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) { alert('File must be under 5 MB'); e.target.value = ''; return; }
                  setCertificateFile(file);
                }}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37]/10 file:text-[#B8952E] hover:file:bg-[#D4AF37]/20 file:cursor-pointer file:transition-colors"
              />
              <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP, PDF. Max 5 MB.</p>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.autoIssueCertificate} onChange={(e) => setForm({ ...form, autoIssueCertificate: e.target.checked })} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37]/40 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
              <span className="text-sm text-gray-700">Auto-issue Certificate</span>
            </div>
          </div>

          {/* Modules Editor */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Training Modules (4)</label>
            <div className="space-y-3">
              {form.modules.map((mod, idx) => (
                <div key={idx} className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-500 mb-2">Module {idx + 1}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <input type="text" value={mod.title} onChange={(e) => updateModule(idx, 'title', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Module title" />
                    </div>
                    <div>
                      <input type="text" value={mod.description} onChange={(e) => updateModule(idx, 'description', e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Module description" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button onClick={closeForm} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
            <button onClick={saveCohort} disabled={saving || !form.startDate || !form.endDate} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Cohort'}
            </button>
          </div>
        </div>
      )}

      {/* Cohorts Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {cohorts.length === 0 ? (
          <div className="p-10 text-center text-gray-400 flex flex-col items-center">
            <GraduationCap className="w-10 h-10 text-gray-300 mb-3" />
            <p>No training cohorts yet. Create one above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-4">Cohort Dates</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Seats Booked</th>
                  <th className="px-6 py-4">Format</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cohorts.map((cohort) => {
                  const status = getCohortStatus(cohort);
                  const statusColors = { upcoming: 'bg-blue-100 text-blue-800', active: 'bg-green-100 text-green-800', completed: 'bg-gray-100 text-gray-800' };
                  const isExpanded = expandedCohort === cohort._id;
                  const teachers = cohort.registeredTeachers || cohort.teachers || [];

                  return (
                    <>
                      <tr key={cohort._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {cohort.startDate ? new Date(cohort.startDate).toLocaleDateString() : '--'} - {cohort.endDate ? new Date(cohort.endDate).toLocaleDateString() : '--'}
                        </td>
                        <td className="px-6 py-4">{cohort.capacity || '--'}</td>
                        <td className="px-6 py-4">{teachers.length}</td>
                        <td className="px-6 py-4 capitalize">{cohort.format}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setExpandedCohort(isExpanded ? null : cohort._id)} className="p-1.5 text-gray-400 hover:text-gray-600 transition" title="Toggle teachers">
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button onClick={() => openForm(cohort)} className="p-1.5 text-gray-400 hover:text-[#D4AF37] transition" title="Edit"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => deleteCohort(cohort._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr key={`${cohort._id}-teachers`}>
                          <td colSpan={6} className="px-6 py-4">
                            <div className="bg-gray-50 rounded-xl p-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Registered Teachers ({teachers.length})
                              </h4>
                              {teachers.length === 0 ? (
                                <p className="text-sm text-gray-400">No teachers have registered for this cohort yet.</p>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left text-xs text-gray-600">
                                    <thead className="text-gray-500 font-medium">
                                      <tr>
                                        <th className="px-3 py-2">Name</th>
                                        <th className="px-3 py-2">Email</th>
                                        <th className="px-3 py-2">School</th>
                                        <th className="px-3 py-2">Registered On</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {teachers.map((teacher, idx) => (
                                        <tr key={teacher._id || idx}>
                                          <td className="px-3 py-2 font-medium text-gray-800">{teacher.name || '--'}</td>
                                          <td className="px-3 py-2">{teacher.email || '--'}</td>
                                          <td className="px-3 py-2">{teacher.school || '--'}</td>
                                          <td className="px-3 py-2">{teacher.registeredAt ? new Date(teacher.registeredAt).toLocaleDateString() : '--'}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
