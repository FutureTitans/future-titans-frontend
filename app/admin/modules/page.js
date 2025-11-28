'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { modules } from '@/lib/api';
import { Plus, Edit, Trash2, Eye, RefreshCw } from 'lucide-react';
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
    mentorProfilePicture: null, // File object
    mentorProfilePictureUrl: '', // Existing URL for display
  });

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const data = await modules.getAll();
      console.log('Fetched modules:', data);
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
      // Prepare data for API call
      const submitData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        estimatedCompletionTime: formData.estimatedCompletionTime,
        aiQuestionsPerChapter: formData.aiQuestionsPerChapter,
        aiInteractionEnabled: true,
      };
      
      // Handle mentor profile picture: if file is selected, use it; otherwise use URL if exists
      if (formData.mentorProfilePicture instanceof File) {
        submitData.mentorProfilePicture = formData.mentorProfilePicture;
      } else if (formData.mentorProfilePictureUrl && formData.mentorProfilePictureUrl.trim()) {
        // Backward compatibility: if URL exists and no new file, use URL
        submitData.mentorProfilePicture = formData.mentorProfilePictureUrl.trim();
      }

      if (editingModule) {
        // Update existing module
        console.log('Updating module with data:', submitData);
        const result = await modules.update(editingModule._id, submitData);
        console.log('Module updated:', result);
        alert('✅ Module updated successfully!');
      } else {
        // Create new module
        console.log('Creating module with data:', submitData);
        const result = await modules.create(submitData);
        console.log('Module created:', result);
        alert('✅ Module created successfully!');
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        difficulty: 'beginner',
        estimatedCompletionTime: 60,
        aiQuestionsPerChapter: 10,
        mentorProfilePicture: null,
        mentorProfilePictureUrl: '',
      });
      setEditingModule(null);
      setShowForm(false);
      
      // Refresh modules list after a short delay to ensure DB has saved
      setTimeout(() => {
        fetchModules();
      }, 1000);
    } catch (error) {
      console.error('Failed to save module:', error);
      alert('❌ Failed to save module: ' + (error.message || 'Unknown error'));
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Module Management</h1>
        <div className="flex gap-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-neutral-light text-neutral-dark px-4 py-2 rounded-lg hover:bg-neutral-border transition disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              // Opening in "create" mode
              setEditingModule(null);
              setFormData({
                title: '',
                description: '',
                difficulty: 'beginner',
                estimatedCompletionTime: 60,
                aiQuestionsPerChapter: 10,
              });
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-darkRed transition"
          >
            <Plus className="w-5 h-5" />
            {editingModule ? 'Edit Module' : 'Create Module'}
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="card mb-8">
          <h3 className="font-bold text-lg mb-4">
            {editingModule ? 'Edit Module' : 'Create New Module'}
          </h3>
          <form onSubmit={handleCreateModule} className="space-y-4">
            <input
              type="text"
              placeholder="Module Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg"
              required
            />
            <textarea
              placeholder="Module Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-border rounded-lg h-24"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                className="px-4 py-2 border border-neutral-border rounded-lg"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <input
                type="number"
                placeholder="Est. Completion Time (minutes)"
                value={formData.estimatedCompletionTime}
                onChange={(e) => setFormData({ ...formData, estimatedCompletionTime: parseInt(e.target.value) })}
                className="px-4 py-2 border border-neutral-border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Default AI Questions per Chapter
                  <span className="block text-xs text-neutral-medium">
                    How many SURGE-style questions the AI should ask after each chapter (default 10).
                  </span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={formData.aiQuestionsPerChapter}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      aiQuestionsPerChapter: parseInt(e.target.value || '10', 10),
                    })
                  }
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Mentor Profile Picture
                  <span className="block text-xs text-neutral-medium">
                    Upload a profile picture for the mentor (optional). This will be shown in the AI chat. Max 5MB, JPG/PNG/WebP.
                  </span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        alert('File size must be less than 5MB');
                        e.target.value = '';
                        return;
                      }
                      setFormData({ ...formData, mentorProfilePicture: file, mentorProfilePictureUrl: '' });
                    }
                  }}
                  className="w-full px-4 py-2 border border-neutral-border rounded-lg"
                />
                {formData.mentorProfilePictureUrl && !formData.mentorProfilePicture && (
                  <div className="mt-2">
                    <p className="text-xs text-neutral-medium mb-1">Current image:</p>
                    <img 
                      src={formData.mentorProfilePictureUrl} 
                      alt="Mentor" 
                      className="w-20 h-20 rounded-full object-cover border border-neutral-border"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                {formData.mentorProfilePicture && (
                  <div className="mt-2">
                    <p className="text-xs text-neutral-medium mb-1">New image selected:</p>
                    <img 
                      src={URL.createObjectURL(formData.mentorProfilePicture)} 
                      alt="Mentor preview" 
                      className="w-20 h-20 rounded-full object-cover border border-neutral-border"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-darkRed transition"
              >
                {editingModule ? 'Save Changes' : 'Create Module'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingModule(null);
                }}
                className="flex-1 bg-neutral-light text-neutral-dark px-4 py-2 rounded-lg hover:bg-neutral-border transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {modulesList.map((module) => (
          <div key={module._id} className="card hover:shadow-lg transition-all">
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{module.title}</h3>
                <span className={`badge ${module.isPublished ? 'badge-success' : 'badge-red'}`}>
                  {module.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-neutral-medium text-sm mb-4">{module.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-neutral-medium">Difficulty</p>
                <p className="font-semibold capitalize">{module.difficulty}</p>
              </div>
              <div>
                <p className="text-neutral-medium">Duration</p>
                <p className="font-semibold">{module.estimatedCompletionTime} min</p>
              </div>
              <div>
                <p className="text-neutral-medium">Chapters</p>
                <p className="font-semibold">{module.chapters?.length || 0}</p>
              </div>
              <div>
                <p className="text-neutral-medium">AI Enabled</p>
                <p className="font-semibold">{module.aiInteractionEnabled ? '✅ Yes' : '❌ No'}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-neutral-border">
              <Link
                href={`/admin/modules/${module._id}`}
                className="flex-1 flex items-center justify-center gap-2 text-primary-red hover:bg-primary-lightRed p-2 rounded transition"
              >
                <Eye className="w-4 h-4" />
                Manage Chapters
              </Link>
              <button
                type="button"
                onClick={() => {
                  // Open form pre-filled for editing
                  setEditingModule(module);
                  setFormData({
                    title: module.title || '',
                    description: module.description || '',
                    difficulty: module.difficulty || 'beginner',
                    estimatedCompletionTime: module.estimatedCompletionTime || 60,
                    aiQuestionsPerChapter:
                      typeof module.aiQuestionsPerChapter === 'number'
                        ? module.aiQuestionsPerChapter
                        : 10,
                    mentorProfilePicture: null,
                    mentorProfilePictureUrl: module.mentorProfilePicture || '',
                  });
                  setShowForm(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 text-primary-red hover:bg-primary-lightRed p-2 rounded transition"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteModule(module._id)}
                className="flex-1 flex items-center justify-center gap-2 text-semantic-error hover:bg-red-50 p-2 rounded transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modulesList.length === 0 && (
        <div className="card text-center">
          <p className="text-neutral-medium">No modules yet. Create one to get started!</p>
        </div>
      )}
    </div>
  );
}

