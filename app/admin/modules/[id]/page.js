'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { modules } from '@/lib/api';
import { BookOpen, Plus, Trash2, ArrowLeft, ArrowUp, ArrowDown, CheckCircle, Pencil } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AdminModuleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const moduleId = params.id;

  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingChapterId, setEditingChapterId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [chapterForm, setChapterForm] = useState({
    title: '',
    description: '',
    type: 'text',
    text: '',
    videoUrl: '',
    audioUrl: '',
    pdfUrl: '',
    subtitles: '',
    aiPrompt: '', // Required field
    surgeDimensionFocus: '',
  });

  useEffect(() => {
    if (!moduleId) return;
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const data = await modules.getById(moduleId);
      setModuleData(data);
    } catch (error) {
      console.error('Failed to fetch module details:', error);
      router.push('/admin/modules');
    } finally {
      setLoading(false);
    }
  };

  const handlePublishModule = async () => {
    try {
      setSaving(true);
      await modules.publish(moduleId);
      await fetchModule();
      alert('✅ Module published successfully');
    } catch (error) {
      console.error('Failed to publish module:', error);
      alert('❌ Failed to publish module');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setFormErrors({});
    
    // Validate required fields
    const errors = {};
    if (!chapterForm.title || !chapterForm.title.trim()) {
      errors.title = 'Chapter title is required';
    }
    if (!chapterForm.aiPrompt || !chapterForm.aiPrompt.trim()) {
      errors.aiPrompt = 'Custom AI Prompt is required for all chapters';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      
      const content = {
        type: chapterForm.type,
        text: chapterForm.type === 'text' ? chapterForm.text : '',
        videoUrl: chapterForm.type === 'video' ? chapterForm.videoUrl : '',
        audioUrl: chapterForm.type === 'audio' ? chapterForm.audioUrl : '',
        pdfUrl: chapterForm.type === 'pdf' ? chapterForm.pdfUrl : '',
      };

      if (editingChapterId) {
        // Update existing chapter
        await modules.updateChapter(moduleId, editingChapterId, {
          title: chapterForm.title,
          description: chapterForm.description,
          content,
          subtitles: chapterForm.subtitles,
          aiPrompt: chapterForm.aiPrompt.trim(),
          surgeDimensionFocus: chapterForm.surgeDimensionFocus,
        });
        alert('✅ Chapter updated successfully');
      } else {
        // Create new chapter
        const order = (moduleData?.chapters?.length || 0) + 1;
        await modules.createChapter(moduleId, {
          title: chapterForm.title,
          description: chapterForm.description,
          order,
          content,
          subtitles: chapterForm.subtitles,
          aiPrompt: chapterForm.aiPrompt.trim(),
          surgeDimensionFocus: chapterForm.surgeDimensionFocus,
        });
        alert('✅ Chapter created successfully');
      }

      // Reset form
      setChapterForm({
        title: '',
        description: '',
        type: 'text',
        text: '',
        videoUrl: '',
        audioUrl: '',
        pdfUrl: '',
        subtitles: '',
        aiPrompt: '',
        surgeDimensionFocus: '',
      });
      setEditingChapterId(null);
      setFormErrors({});

      await fetchModule();
    } catch (error) {
      console.error('Failed to save chapter:', error);
      alert('❌ Failed to save chapter: ' + (error?.error || error?.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleEditChapter = (chapter) => {
    setEditingChapterId(chapter._id);
    setChapterForm({
      title: chapter.title || '',
      description: chapter.description || '',
      type: chapter.content?.type || 'text',
      text: chapter.content?.text || '',
      videoUrl: chapter.content?.videoUrl || '',
      audioUrl: chapter.content?.audioUrl || '',
      pdfUrl: chapter.content?.pdfUrl || '',
      subtitles: chapter.subtitles || '',
      aiPrompt: chapter.aiPrompt || '',
      surgeDimensionFocus: chapter.surgeDimensionFocus || '',
    });
    setFormErrors({});
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
    setChapterForm({
      title: '',
      description: '',
      type: 'text',
      text: '',
      videoUrl: '',
      audioUrl: '',
      pdfUrl: '',
      subtitles: '',
      aiPrompt: '',
      surgeDimensionFocus: '',
    });
    setFormErrors({});
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!confirm('Are you sure you want to delete this chapter?')) return;
    try {
      setSaving(true);
      await modules.deleteChapter(moduleId, chapterId);
      await fetchModule();
    } catch (error) {
      console.error('Failed to delete chapter:', error);
      alert('❌ Failed to delete chapter');
    } finally {
      setSaving(false);
    }
  };

  const reorder = async (fromIndex, toIndex) => {
    if (!moduleData?.chapters) return;
    if (toIndex < 0 || toIndex >= moduleData.chapters.length) return;

    const newOrder = [...moduleData.chapters];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);

    try {
      setSaving(true);
      await modules.reorderChapters(moduleId, {
        chapterOrder: newOrder.map((c) => c._id),
      });
      await fetchModule();
    } catch (error) {
      console.error('Failed to reorder chapters:', error);
      alert('❌ Failed to reorder chapters');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading module builder..." />;
  }

  if (!moduleData) {
    return (
      <div className="card">
        <p className="text-neutral-medium">Module not found.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/admin/modules')}
            className="text-primary-red hover:text-primary-darkRed transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modules
          </button>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge ${moduleData.isPublished ? 'badge-success' : 'badge-red'}`}>
            {moduleData.isPublished ? 'Published' : 'Draft'}
          </span>
          {!moduleData.isPublished && (
            <button
              onClick={handlePublishModule}
              disabled={saving}
              className="flex items-center gap-2 bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-darkRed transition disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              {saving ? 'Publishing...' : 'Publish Module'}
            </button>
          )}
        </div>
      </div>

      {/* Module Info */}
      <div className="card mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary-light-red flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary-red" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">{moduleData.title}</h1>
            <p className="text-neutral-medium mb-2">{moduleData.description}</p>
            <div className="flex gap-4 text-sm text-neutral-medium">
              <span>Difficulty: <span className="font-semibold capitalize">{moduleData.difficulty}</span></span>
              <span>Duration: <span className="font-semibold">{moduleData.estimatedCompletionTime} min</span></span>
              <span>Chapters: <span className="font-semibold">{moduleData.chapters?.length || 0}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Form */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            {editingChapterId ? (
              <>
                <Pencil className="w-4 h-4" />
                Edit Chapter
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Chapter
              </>
            )}
          </h2>
          {editingChapterId && (
            <button
              onClick={handleCancelEdit}
              className="text-sm text-neutral-medium hover:text-neutral-dark transition"
            >
              Cancel Edit
            </button>
          )}
        </div>
        <form onSubmit={handleCreateChapter} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={chapterForm.title}
                onChange={(e) => {
                  setChapterForm({ ...chapterForm, title: e.target.value });
                  if (formErrors.title) setFormErrors({ ...formErrors, title: '' });
                }}
                className={`w-full px-3 py-2 border rounded-lg ${
                  formErrors.title ? 'border-semantic-error' : 'border-neutral-border'
                }`}
                placeholder="Chapter title"
              />
              {formErrors.title && (
                <p className="text-sm text-semantic-error mt-1">{formErrors.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content Type *</label>
              <select
                value={chapterForm.type}
                onChange={(e) => setChapterForm({ ...chapterForm, type: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg"
              >
                <option value="text">Text</option>
                <option value="video">Video (URL)</option>
                <option value="audio">Audio (URL)</option>
                <option value="pdf">PDF (URL)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Short Description</label>
            <textarea
              value={chapterForm.description}
              onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg h-20"
              placeholder="Brief description of this chapter"
            />
          </div>

          {/* Content fields based on type */}
          {chapterForm.type === 'text' && (
            <div>
              <label className="block text-sm font-medium mb-2">Text Content</label>
              <textarea
                value={chapterForm.text}
                onChange={(e) => setChapterForm({ ...chapterForm, text: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg h-32"
                placeholder="Paste or write the lesson content here"
              />
            </div>
          )}

          {chapterForm.type === 'video' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                YouTube Video URL (unlisted recommended)
                <span className="block text-xs text-neutral-medium">
                  Paste a YouTube link like https://youtu.be/VIDEO_ID or https://www.youtube.com/watch?v=VIDEO_ID
                </span>
              </label>
              <input
                type="url"
                value={chapterForm.videoUrl}
                onChange={(e) => setChapterForm({ ...chapterForm, videoUrl: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                placeholder="https://youtu.be/your-unlisted-video"
              />
            </div>
          )}

          {chapterForm.type === 'audio' && (
            <div>
              <label className="block text-sm font-medium mb-2">Audio URL</label>
              <input
                type="url"
                value={chapterForm.audioUrl}
                onChange={(e) => setChapterForm({ ...chapterForm, audioUrl: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                placeholder="https://..."
              />
            </div>
          )}

          {chapterForm.type === 'pdf' && (
            <div>
              <label className="block text-sm font-medium mb-2">PDF URL</label>
              <input
                type="url"
                value={chapterForm.pdfUrl}
                onChange={(e) => setChapterForm({ ...chapterForm, pdfUrl: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg"
                placeholder="https://..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Subtitles / Transcript (for AI context)</label>
            <textarea
              value={chapterForm.subtitles}
              onChange={(e) => setChapterForm({ ...chapterForm, subtitles: e.target.value })}
              className="w-full px-3 py-2 border border-neutral-border rounded-lg h-24"
              placeholder="Paste subtitles or key transcript here. Used as AI context."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Custom AI Prompt (Required) *
                <span className="block text-xs text-neutral-medium mt-1">
                  This prompt will guide the AI Co-Founder for this specific chapter. It will be combined with the SURGE framework.
                </span>
              </label>
              <textarea
                value={chapterForm.aiPrompt}
                onChange={(e) => {
                  setChapterForm({ ...chapterForm, aiPrompt: e.target.value });
                  if (formErrors.aiPrompt) setFormErrors({ ...formErrors, aiPrompt: '' });
                }}
                className={`w-full px-3 py-2 border rounded-lg h-24 ${
                  formErrors.aiPrompt ? 'border-semantic-error' : 'border-neutral-border'
                }`}
                placeholder="Enter a custom prompt that guides the AI for this chapter. Example: 'Help the student understand market differentiation by asking questions about their favorite products and what makes them unique.'"
                required
              />
              {formErrors.aiPrompt && (
                <p className="text-sm text-semantic-error mt-1">{formErrors.aiPrompt}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">SURGE Focus Dimension (optional)</label>
              <select
                value={chapterForm.surgeDimensionFocus}
                onChange={(e) => setChapterForm({ ...chapterForm, surgeDimensionFocus: e.target.value })}
                className="w-full px-3 py-2 border border-neutral-border rounded-lg"
              >
                <option value="">None</option>
                <option value="selfAwareness">Self Awareness</option>
                <option value="understandingOpportunities">Understanding Opportunities</option>
                <option value="resilience">Resilience</option>
                <option value="growthExecution">Growth Execution</option>
                <option value="entrepreneurialLeadership">Entrepreneurial Leadership</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            {editingChapterId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={saving}
                className="px-6 py-2 border border-neutral-border rounded-lg hover:bg-neutral-light transition disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-primary-red text-white px-6 py-2 rounded-lg hover:bg-primary-darkRed transition disabled:opacity-50"
            >
              {editingChapterId ? (
                <>
                  <Pencil className="w-4 h-4" />
                  {saving ? 'Updating...' : 'Update Chapter'}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Add Chapter'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Chapters List */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">Chapters</h2>
          <p className="text-sm text-neutral-medium">
            Drag order with arrows. Chapters are shown to students in this order.
          </p>
        </div>

        {(!moduleData.chapters || moduleData.chapters.length === 0) ? (
          <p className="text-neutral-medium text-sm">No chapters yet. Add one above to get started.</p>
        ) : (
          <div className="space-y-3">
            {moduleData.chapters
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((chapter, index) => (
                <div
                  key={chapter._id}
                  className="flex items-center justify-between border border-neutral-border rounded-lg px-4 py-3 bg-white"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => reorder(index, index - 1)}
                        className="p-1 rounded hover:bg-neutral-light disabled:opacity-40"
                        disabled={index === 0 || saving}
                      >
                        <ArrowUp className="w-4 h-4 text-neutral-medium" />
                      </button>
                      <button
                        onClick={() => reorder(index, index + 1)}
                        className="p-1 rounded hover:bg-neutral-light disabled:opacity-40"
                        disabled={index === moduleData.chapters.length - 1 || saving}
                      >
                        <ArrowDown className="w-4 h-4 text-neutral-medium" />
                      </button>
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {index + 1}. {chapter.title}
                      </p>
                      <p className="text-xs text-neutral-medium">
                        Type: {chapter.content?.type || 'N/A'} · AI: {chapter.aiInteractionEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                      {chapter.surgeDimensionFocus && (
                        <p className="text-xs text-neutral-medium">
                          SURGE focus: {chapter.surgeDimensionFocus}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditChapter(chapter)}
                      disabled={saving}
                      className="flex items-center gap-2 text-primary-red hover:bg-primary-lightRed px-3 py-2 rounded-lg transition disabled:opacity-50"
                      title="Edit chapter"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteChapter(chapter._id)}
                      disabled={saving}
                      className="flex items-center gap-2 text-semantic-error hover:bg-red-50 px-3 py-2 rounded-lg transition disabled:opacity-50"
                      title="Delete chapter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}


