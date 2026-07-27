'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Edit, Trash2, Save, X, AlertCircle, RefreshCw,
  Star, ArrowUpDown, Download,
} from 'lucide-react';
import { adminIC } from '@/lib/api';
import { upload } from '@vercel/blob/client';

const RESOURCE_TYPES = ['pdf', 'video', 'article', 'worksheet', 'template', 'toolkit', 'infographic'];
const RESOURCE_LEVELS = ['beginner', 'intermediate', 'advanced'];
const RESOURCE_STAGES = ['ideation', 'validation', 'prototype', 'launch', 'growth', 'general'];

const emptyResource = {
  title: '', description: '', author: '', type: 'pdf', level: 'beginner', stage: 'general',
  fileUrl: '', coverImage: '', duration: '', featured: false, tags: '',
};

export default function ResourceLibraryPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyResource);
  const [saving, setSaving] = useState(false);
  const [sortByDownloads, setSortByDownloads] = useState(false);
  const [resourceFile, setResourceFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminIC.getResources();
      setResources(data.resources || data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openForm = (resource = null) => {
    setResourceFile(null);
    setCoverImageFile(null);
    if (resource) {
      setEditingId(resource._id);
      setForm({
        title: resource.title,
        description: resource.description || '',
        author: resource.author || '',
        type: resource.type || 'pdf',
        level: resource.level || 'beginner',
        stage: resource.stage || 'general',
        fileUrl: resource.fileUrl || '',
        coverImage: resource.coverImage || '',
        duration: resource.duration || '',
        featured: resource.featured || false,
        tags: Array.isArray(resource.tags) ? resource.tags.join(', ') : resource.tags || '',
      });
    } else {
      setEditingId(null);
      setForm(emptyResource);
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyResource);
    setResourceFile(null);
    setCoverImageFile(null);
  };

  const saveResource = async () => {
    if (!form.title) return;
    setSaving(true);
    try {
      let fileUrl = form.fileUrl || '';
      if (resourceFile) {
        const result = await upload(`resource-file-${Date.now()}-${resourceFile.name}`, resourceFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        fileUrl = result.url;
      }
      let coverImage = form.coverImage || '';
      if (coverImageFile) {
        const result = await upload(`resource-cover-${Date.now()}-${coverImageFile.name}`, coverImageFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        coverImage = result.url;
      }
      const payload = {
        ...form,
        fileUrl,
        coverImage,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      };
      if (editingId) {
        await adminIC.updateResource(editingId, payload);
      } else {
        await adminIC.createResource(payload);
      }
      closeForm();
      await fetchData();
    } catch (err) {
      console.error('Error saving resource:', err);
      alert('Failed to save resource.');
    } finally {
      setSaving(false);
    }
  };

  const deleteResource = async (id) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await adminIC.deleteResource(id);
      await fetchData();
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Failed to delete resource.');
    }
  };

  const displayedResources = sortByDownloads
    ? [...resources].sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
    : resources;

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-pulse text-gray-400">Loading resources...</div></div>;
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
          <h1 className="text-2xl font-bold text-gray-900">Resource Library Manager</h1>
          <p className="text-gray-500 text-sm mt-1">Curate and publish learning resources for students.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setSortByDownloads(!sortByDownloads)} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition ${sortByDownloads ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            <ArrowUpDown className="w-4 h-4" /> {sortByDownloads ? 'Sorted by Downloads' : 'Sort by Downloads'}
          </button>
          <button onClick={() => openForm()} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] text-white px-4 py-2 rounded-xl text-sm font-medium transition">
            <Plus className="w-4 h-4" /> Add Resource
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{editingId ? 'Edit Resource' : 'Add Resource'}</h3>
            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Resource title" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Brief description..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input type="text" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="Author name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] bg-white">
                {RESOURCE_TYPES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] bg-white">
                {RESOURCE_LEVELS.map((l) => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37] bg-white">
                {RESOURCE_STAGES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Resource File</label>
              {(resourceFile || form.fileUrl) && (
                <div className="mb-2 flex items-center gap-2">
                  {resourceFile ? (
                    <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg truncate max-w-[200px]">{resourceFile.name}</span>
                  ) : (
                    <a href={form.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#D4AF37] underline truncate max-w-[200px]">{form.fileUrl.split('/').pop()}</a>
                  )}
                  <button
                    onClick={() => { setResourceFile(null); setForm({ ...form, fileUrl: '' }); }}
                    className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0"
                  >x</button>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf,video/mp4,video/webm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) { alert('File must be under 5 MB'); e.target.value = ''; return; }
                  setResourceFile(file);
                }}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37]/10 file:text-[#B8952E] hover:file:bg-[#D4AF37]/20 file:cursor-pointer file:transition-colors"
              />
              <p className="text-[10px] text-gray-400 mt-1">PDF, MP4, WebM, JPEG, PNG, WebP. Max 5 MB.</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Cover Image</label>
              {(coverImageFile || form.coverImage) && (
                <div className="mb-2 relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={coverImageFile ? URL.createObjectURL(coverImageFile) : form.coverImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => { setCoverImageFile(null); setForm({ ...form, coverImage: '' }); }}
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
                  setCoverImageFile(file);
                }}
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-[#D4AF37]/10 file:text-[#B8952E] hover:file:bg-[#D4AF37]/20 file:cursor-pointer file:transition-colors"
              />
              <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP. Max 5 MB.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
              <input type="text" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="e.g. 15 min, 2 hours" />
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]" placeholder="entrepreneurship, AI, marketing" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#D4AF37]/40 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D4AF37]"></div>
              </label>
              <span className="text-sm text-gray-700">Featured Resource</span>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={closeForm} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">Cancel</button>
            <button onClick={saveResource} disabled={saving || !form.title} className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Resource'}
            </button>
          </div>
        </div>
      )}

      {/* Resources Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {displayedResources.length === 0 ? (
          <div className="p-10 text-center text-gray-400 flex flex-col items-center">
            <BookOpen className="w-10 h-10 text-gray-300 mb-3" />
            <p>No resources yet. Add your first resource above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 font-medium">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4">Stage</th>
                  <th className="px-6 py-4">
                    <button onClick={() => setSortByDownloads(!sortByDownloads)} className="flex items-center gap-1 hover:text-[#D4AF37] transition">
                      <Download className="w-3.5 h-3.5" /> Downloads
                    </button>
                  </th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedResources.map((resource) => (
                  <tr key={resource._id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-[200px] truncate">{resource.title}</td>
                    <td className="px-6 py-4">{resource.author || '--'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">{resource.type}</span>
                    </td>
                    <td className="px-6 py-4 capitalize">{resource.level}</td>
                    <td className="px-6 py-4 capitalize">{resource.stage}</td>
                    <td className="px-6 py-4">{resource.downloads || 0}</td>
                    <td className="px-6 py-4">
                      {resource.featured ? <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" /> : <Star className="w-4 h-4 text-gray-300" />}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openForm(resource)} className="p-1.5 text-gray-400 hover:text-[#D4AF37] transition" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => deleteResource(resource._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
  );
}
