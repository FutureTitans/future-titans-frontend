'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { modules } from '@/lib/api';
import { upload } from '@vercel/blob/client';
import { Plus, Edit, Trash2, Eye, RefreshCw, BookOpen, X } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function ModulesPage() {
  const [modulesList, setModulesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    estimatedCompletionTime: 60,
    aiQuestionsPerChapter: 10,
    mentorName: '',
    mentorProfilePicture: null,
    mentorProfilePictureUrl: '',
    coverImage: null,
    coverImageUrl: '',
  });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await modules.getAll();
      setModulesList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
      setModulesList([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchModules();
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        estimatedCompletionTime: formData.estimatedCompletionTime,
        aiQuestionsPerChapter: formData.aiQuestionsPerChapter,
        mentorName: formData.mentorName,
        aiInteractionEnabled: true,
      };

      if (formData.mentorProfilePicture instanceof File) {
        const mentorBlob = await upload(formData.mentorProfilePicture.name, formData.mentorProfilePicture, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        submitData.mentorProfilePicture = mentorBlob.url;
      } else if (formData.mentorProfilePictureUrl?.trim()) {
        submitData.mentorProfilePicture = formData.mentorProfilePictureUrl.trim();
      }

      if (formData.coverImage instanceof File) {
        const coverBlob = await upload(formData.coverImage.name, formData.coverImage, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        submitData.coverImage = coverBlob.url;
      } else if (formData.coverImageUrl?.trim()) {
        submitData.coverImage = formData.coverImageUrl.trim();
      }

      if (editingModule) {
        await modules.update(editingModule._id, submitData);
      } else {
        await modules.create(submitData);
      }

      setFormData({
        title: '', description: '', difficulty: 'beginner',
        estimatedCompletionTime: 60, aiQuestionsPerChapter: 10,
        mentorName: '', mentorProfilePicture: null, mentorProfilePictureUrl: '',
        coverImage: null, coverImageUrl: '',
      });
      setEditingModule(null);
      setShowForm(false);
      setTimeout(() => fetchModules(), 1000);
    } catch (error) {
      console.error('Failed to save module:', error);
      alert('Failed to save module: ' + (error.message || 'Unknown error'));
    }
  };

  const handleDeleteModule = async (id) => {
    if (confirm('Are you sure you want to delete this module?')) {
      try {
        await modules.delete(id);
        fetchModules();
      } catch (error) {
        console.error('Failed to delete module:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading modules..." />;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Modules</h1>
          <p className="text-sm text-gray-500 mt-1">{modulesList.length} learning modules</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl glass-subtle hover:bg-gray-100 transition disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditingModule(null);
              setFormData({
                title: '', description: '', difficulty: 'beginner',
                estimatedCompletionTime: 60, aiQuestionsPerChapter: 10,
                mentorName: '', mentorProfilePicture: null, mentorProfilePictureUrl: '',
                coverImage: null, coverImageUrl: '',
              });
              setShowForm(!showForm);
            }}
            className="glass-button flex items-center gap-2 !px-4 !py-2.5 text-sm"
          >
            <Plus className="w-4 h-4" />
            Create Module
          </button>
        </div>
      </div>

      {/* Create/Edit Form */}
      {showForm && (
        <div className="card border-2 border-[#D4AF37]/20">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg text-gray-800">
              {editingModule ? 'Edit Module' : 'Create New Module'}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingModule(null); }} className="p-2 rounded-lg hover:bg-gray-100 transition">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleCreateModule} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input
                type="text"
                placeholder="Module Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="glass-input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
              <textarea
                placeholder="Module Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="glass-input resize-none h-24"
                required
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="glass-input"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration (min)</label>
                <input
                  type="number"
                  value={formData.estimatedCompletionTime}
                  onChange={(e) => setFormData({ ...formData, estimatedCompletionTime: parseInt(e.target.value) })}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">AI Questions/Chapter</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={formData.aiQuestionsPerChapter}
                  onChange={(e) => setFormData({ ...formData, aiQuestionsPerChapter: parseInt(e.target.value || '10', 10) })}
                  className="glass-input"
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mentor Name</label>
                <input
                  type="text"
                  placeholder="Instructor Name"
                  value={formData.mentorName}
                  onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mentor Picture</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); e.target.value = ''; return; }
                      setFormData({ ...formData, mentorProfilePicture: file, mentorProfilePictureUrl: '' });
                    }
                  }}
                  className="glass-input"
                />
                {formData.mentorProfilePictureUrl && !formData.mentorProfilePicture && (
                  <img src={formData.mentorProfilePictureUrl} alt="Mentor" className="w-12 h-12 rounded-full object-cover mt-2 border border-gray-200" onError={(e) => { e.target.style.display = 'none'; }} />
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Image</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); e.target.value = ''; return; }
                    setFormData({ ...formData, coverImage: file, coverImageUrl: '' });
                  }
                }}
                className="glass-input"
              />
              {formData.coverImageUrl && !formData.coverImage && (
                <img src={formData.coverImageUrl} alt="Cover" className="h-20 rounded-lg object-cover mt-2 border border-gray-200" onError={(e) => { e.target.style.display = 'none'; }} />
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="glass-button !px-6 !py-2.5 text-sm">
                {editingModule ? 'Save Changes' : 'Create Module'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingModule(null); }}
                className="glass-button-secondary !px-6 !py-2.5 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modules Grid */}
      {modulesList.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No modules yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {modulesList.map((module) => (
            <div key={module._id} className="card !p-0 overflow-hidden group hover:shadow-lg transition-all">
              {module.coverImage ? (
                <img src={module.coverImage} alt={module.title} className="w-full h-36 object-cover" />
              ) : (
                <div className="w-full h-36 bg-gradient-to-br from-[#D4AF37]/10 to-[#F5D76E]/10 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-[#D4AF37]/40" />
                </div>
              )}
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 line-clamp-1">{module.title}</h3>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${module.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                    {module.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{module.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center glass-subtle rounded-lg py-2">
                    <p className="text-xs text-gray-500">Difficulty</p>
                    <p className="text-sm font-semibold text-gray-700 capitalize">{module.difficulty}</p>
                  </div>
                  <div className="text-center glass-subtle rounded-lg py-2">
                    <p className="text-xs text-gray-500">Chapters</p>
                    <p className="text-sm font-semibold text-gray-700">{module.chapters?.length || 0}</p>
                  </div>
                  <div className="text-center glass-subtle rounded-lg py-2">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="text-sm font-semibold text-gray-700">{module.estimatedCompletionTime}m</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/modules/${module._id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-[#B8952E] hover:bg-[#D4AF37]/5 py-2 rounded-lg transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Chapters
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingModule(module);
                      setFormData({
                        title: module.title || '', description: module.description || '',
                        difficulty: module.difficulty || 'beginner',
                        estimatedCompletionTime: module.estimatedCompletionTime || 60,
                        aiQuestionsPerChapter: module.aiQuestionsPerChapter ?? 10,
                        mentorName: module.mentorName || '',
                        mentorProfilePicture: null, mentorProfilePictureUrl: module.mentorProfilePicture || '',
                        coverImage: null, coverImageUrl: module.coverImage || '',
                      });
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 py-2 rounded-lg transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteModule(module._id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
