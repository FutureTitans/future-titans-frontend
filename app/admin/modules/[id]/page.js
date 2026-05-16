'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { modules } from '@/lib/api';
import { BookOpen, Plus, Trash2, ArrowLeft, ArrowUp, ArrowDown, CheckCircle, Pencil, X } from 'lucide-react';
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
    title: '', description: '', type: 'text', text: '', videoUrl: '',
    audioUrl: '', pdfUrl: '', subtitles: '', aiPrompt: '', surgeDimensionFocus: '',
  });

  useEffect(() => { if (moduleId) fetchModule(); }, [moduleId]);

  const fetchModule = async () => {
    try { setLoading(true); const data = await modules.getById(moduleId); setModuleData(data); }
    catch (error) { console.error('Failed to fetch module:', error); router.push('/admin/modules'); }
    finally { setLoading(false); }
  };

  const handlePublishModule = async () => {
    try { setSaving(true); await modules.publish(moduleId); await fetchModule(); }
    catch (error) { alert('Failed to publish module'); }
    finally { setSaving(false); }
  };

  const handleCreateChapter = async (e) => {
    e.preventDefault();
    setFormErrors({});
    const errors = {};
    if (!chapterForm.title?.trim()) errors.title = 'Title is required';
    if (!chapterForm.aiPrompt?.trim()) errors.aiPrompt = 'AI Prompt is required';
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    try {
      setSaving(true);
      const content = {
        type: chapterForm.type,
        text: chapterForm.type === 'text' ? chapterForm.text : '',
        videoUrl: chapterForm.type === 'video' ? chapterForm.videoUrl : '',
        audioUrl: chapterForm.type === 'audio' ? chapterForm.audioUrl : '',
        pdfUrl: chapterForm.type === 'pdf' ? chapterForm.pdfUrl : '',
      };

      const payload = {
        title: chapterForm.title, description: chapterForm.description,
        content, subtitles: chapterForm.subtitles,
        aiPrompt: chapterForm.aiPrompt.trim(), surgeDimensionFocus: chapterForm.surgeDimensionFocus,
      };

      if (editingChapterId) {
        await modules.updateChapter(moduleId, editingChapterId, payload);
      } else {
        payload.order = (moduleData?.chapters?.length || 0) + 1;
        await modules.createChapter(moduleId, payload);
      }

      setChapterForm({ title: '', description: '', type: 'text', text: '', videoUrl: '', audioUrl: '', pdfUrl: '', subtitles: '', aiPrompt: '', surgeDimensionFocus: '' });
      setEditingChapterId(null);
      setFormErrors({});
      await fetchModule();
    } catch (error) {
      alert('Failed to save chapter: ' + (error?.error || error?.message || 'Unknown error'));
    } finally { setSaving(false); }
  };

  const handleEditChapter = (chapter) => {
    setEditingChapterId(chapter._id);
    setChapterForm({
      title: chapter.title || '', description: chapter.description || '',
      type: chapter.content?.type || 'text', text: chapter.content?.text || '',
      videoUrl: chapter.content?.videoUrl || '', audioUrl: chapter.content?.audioUrl || '',
      pdfUrl: chapter.content?.pdfUrl || '', subtitles: chapter.subtitles || '',
      aiPrompt: chapter.aiPrompt || '', surgeDimensionFocus: chapter.surgeDimensionFocus || '',
    });
    setFormErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
    setChapterForm({ title: '', description: '', type: 'text', text: '', videoUrl: '', audioUrl: '', pdfUrl: '', subtitles: '', aiPrompt: '', surgeDimensionFocus: '' });
    setFormErrors({});
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!confirm('Delete this chapter?')) return;
    try { setSaving(true); await modules.deleteChapter(moduleId, chapterId); await fetchModule(); }
    catch (error) { alert('Failed to delete chapter'); }
    finally { setSaving(false); }
  };

  const reorder = async (fromIndex, toIndex) => {
    if (!moduleData?.chapters || toIndex < 0 || toIndex >= moduleData.chapters.length) return;
    const newOrder = [...moduleData.chapters];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, moved);
    try { setSaving(true); await modules.reorderChapters(moduleId, { chapterOrder: newOrder.map((c) => c._id) }); await fetchModule(); }
    catch (error) { alert('Failed to reorder'); }
    finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner message="Loading module builder..." />;
  if (!moduleData) return <div className="card text-center py-12"><p className="text-gray-500">Module not found.</p></div>;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button onClick={() => router.push('/admin/modules')} className="flex items-center gap-1.5 text-sm font-medium text-[#B8952E] hover:text-[#D4AF37] transition">
          <ArrowLeft className="w-4 h-4" /> Back to Modules
        </button>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${moduleData.isPublished ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
            {moduleData.isPublished ? 'Published' : 'Draft'}
          </span>
          {!moduleData.isPublished && (
            <button onClick={handlePublishModule} disabled={saving} className="glass-button !px-4 !py-2 text-sm flex items-center gap-1.5 disabled:opacity-50">
              <CheckCircle className="w-3.5 h-3.5" /> Publish
            </button>
          )}
        </div>
      </div>

      {/* Module Info */}
      <div className="card">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8952E] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{moduleData.title}</h1>
            <p className="text-sm text-gray-500 mt-1">{moduleData.description}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
              <span>Difficulty: <span className="font-semibold text-gray-700 capitalize">{moduleData.difficulty}</span></span>
              <span>Duration: <span className="font-semibold text-gray-700">{moduleData.estimatedCompletionTime}min</span></span>
              <span>Chapters: <span className="font-semibold text-gray-700">{moduleData.chapters?.length || 0}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter Form */}
      <div className="card border-2 border-[#D4AF37]/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            {editingChapterId ? <><Pencil className="w-4 h-4 text-[#D4AF37]" /> Edit Chapter</> : <><Plus className="w-4 h-4 text-[#D4AF37]" /> Add Chapter</>}
          </h2>
          {editingChapterId && (
            <button onClick={handleCancelEdit} className="p-2 rounded-lg hover:bg-gray-100 transition"><X className="w-4 h-4 text-gray-500" /></button>
          )}
        </div>
        <form onSubmit={handleCreateChapter} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
              <input type="text" value={chapterForm.title} onChange={(e) => { setChapterForm({ ...chapterForm, title: e.target.value }); if (formErrors.title) setFormErrors({ ...formErrors, title: '' }); }}
                className={`glass-input ${formErrors.title ? '!border-red-400' : ''}`} placeholder="Chapter title" />
              {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Content Type</label>
              <select value={chapterForm.type} onChange={(e) => setChapterForm({ ...chapterForm, type: e.target.value })} className="glass-input">
                <option value="text">Text</option>
                <option value="video">Video (URL)</option>
                <option value="audio">Audio (URL)</option>
                <option value="pdf">PDF (URL)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={chapterForm.description} onChange={(e) => setChapterForm({ ...chapterForm, description: e.target.value })} className="glass-input resize-none h-20" placeholder="Brief description" />
          </div>

          {chapterForm.type === 'text' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Text Content</label>
              <textarea value={chapterForm.text} onChange={(e) => setChapterForm({ ...chapterForm, text: e.target.value })} className="glass-input resize-none h-32" placeholder="Lesson content" />
            </div>
          )}
          {chapterForm.type === 'video' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube URL</label>
              <input type="url" value={chapterForm.videoUrl} onChange={(e) => setChapterForm({ ...chapterForm, videoUrl: e.target.value })} className="glass-input" placeholder="https://youtu.be/..." />
            </div>
          )}
          {chapterForm.type === 'audio' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Audio URL</label>
              <input type="url" value={chapterForm.audioUrl} onChange={(e) => setChapterForm({ ...chapterForm, audioUrl: e.target.value })} className="glass-input" placeholder="https://..." />
            </div>
          )}
          {chapterForm.type === 'pdf' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">PDF URL</label>
              <input type="url" value={chapterForm.pdfUrl} onChange={(e) => setChapterForm({ ...chapterForm, pdfUrl: e.target.value })} className="glass-input" placeholder="https://..." />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Subtitles / Transcript</label>
            <textarea value={chapterForm.subtitles} onChange={(e) => setChapterForm({ ...chapterForm, subtitles: e.target.value })} className="glass-input resize-none h-24" placeholder="Used as AI context for this chapter" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">AI Prompt *</label>
              <textarea value={chapterForm.aiPrompt} onChange={(e) => { setChapterForm({ ...chapterForm, aiPrompt: e.target.value }); if (formErrors.aiPrompt) setFormErrors({ ...formErrors, aiPrompt: '' }); }}
                className={`glass-input resize-none h-24 ${formErrors.aiPrompt ? '!border-red-400' : ''}`} placeholder="Guide the AI for this chapter..." required />
              {formErrors.aiPrompt && <p className="text-xs text-red-500 mt-1">{formErrors.aiPrompt}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">SURGE Focus</label>
              <select value={chapterForm.surgeDimensionFocus} onChange={(e) => setChapterForm({ ...chapterForm, surgeDimensionFocus: e.target.value })} className="glass-input">
                <option value="">None</option>
                <option value="selfAwareness">Self Awareness</option>
                <option value="understandingOpportunities">Understanding Opportunities</option>
                <option value="resilience">Resilience</option>
                <option value="growthExecution">Growth Execution</option>
                <option value="entrepreneurialLeadership">Entrepreneurial Leadership</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            {editingChapterId && (
              <button type="button" onClick={handleCancelEdit} disabled={saving} className="glass-button-secondary !px-5 !py-2.5 text-sm">Cancel</button>
            )}
            <button type="submit" disabled={saving} className="glass-button !px-5 !py-2.5 text-sm flex items-center gap-1.5 disabled:opacity-50">
              {editingChapterId ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {saving ? 'Saving...' : editingChapterId ? 'Update Chapter' : 'Add Chapter'}
            </button>
          </div>
        </form>
      </div>

      {/* Chapters List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">Chapters</h2>
          <p className="text-xs text-gray-500">{moduleData.chapters?.length || 0} chapters</p>
        </div>

        {(!moduleData.chapters || moduleData.chapters.length === 0) ? (
          <div className="text-center py-8">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">No chapters yet. Add one above.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {moduleData.chapters.slice().sort((a, b) => a.order - b.order).map((chapter, index) => (
              <div key={chapter._id} className="glass-subtle rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button onClick={() => reorder(index, index - 1)} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition" disabled={index === 0 || saving}>
                      <ArrowUp className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                    <button onClick={() => reorder(index, index + 1)} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition" disabled={index === moduleData.chapters.length - 1 || saving}>
                      <ArrowDown className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-800 truncate">{index + 1}. {chapter.title}</p>
                    <div className="flex flex-wrap gap-x-3 text-xs text-gray-500 mt-0.5">
                      <span>{chapter.content?.type || 'text'}</span>
                      {chapter.surgeDimensionFocus && <span className="text-[#B8952E]">{chapter.surgeDimensionFocus}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => handleEditChapter(chapter)} disabled={saving} className="p-2 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-[#B8952E] transition disabled:opacity-50">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDeleteChapter(chapter._id)} disabled={saving} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition disabled:opacity-50">
                    <Trash2 className="w-3.5 h-3.5" />
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
