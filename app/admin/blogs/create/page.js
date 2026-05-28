'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { upload } from '@vercel/blob/client';

const RichTextEditor = dynamic(() => import('@/components/shared/RichTextEditor'), { ssr: false, loading: () => <div className="h-[400px] bg-gray-50 animate-pulse rounded-xl"></div> });

export default function CreateBlogPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    coverImage: '',
    content: '',
    status: 'published'
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (e) => {
    const title = e.target.value;
    setFormData({ ...formData, title, slug: generateSlug(title) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalCoverImage = formData.coverImage;

      if (coverImageFile) {
        const result = await upload(`blog-cover-${Date.now()}-${coverImageFile.name}`, coverImageFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        finalCoverImage = result.url;
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/api/blogs`, {
        ...formData,
        coverImage: finalCoverImage
      }, { withCredentials: true });
      router.push('/admin/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating blog');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 rounded-full transition">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Blog</h1>
          <p className="text-gray-500 text-sm mt-1">Publish an article, image, or video to the blog section.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Blog Title *</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-gray-50/50"
              placeholder="e.g. 5 Tips for Young Entrepreneurs"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">URL Slug *</label>
            <input 
              type="text" 
              required
              value={formData.slug}
              onChange={(e) => setFormData({...formData, slug: e.target.value})}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-gray-50/50"
              placeholder="e.g. 5-tips-for-youngpreneurs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cover Image</label>
          <div className="flex items-center gap-4">
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setCoverImageFile(e.target.files[0])}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-gray-50/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#D4AF37]/10 file:text-[#D4AF37] hover:file:bg-[#D4AF37]/20"
            />
          </div>
          {coverImageFile && <p className="text-sm text-gray-500 mt-1">Selected: {coverImageFile.name}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all bg-gray-50/50"
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="space-y-2 pb-16">
          <label className="block text-sm font-medium text-gray-700">Content *</label>
          <div className="h-[450px]">
            <RichTextEditor 
              value={formData.content}
              onChange={(content) => setFormData({...formData, content})}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#B8952E] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Saving...' : 'Publish Blog'}
          </button>
        </div>
      </form>
    </div>
  );
}
