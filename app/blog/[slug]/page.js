'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ArrowLeft, Calendar, User } from 'lucide-react';

export default function SingleBlogPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/api/blogs/${slug}`);
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        if (error.response?.status === 404) {
          router.push('/blog');
        }
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchBlog();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-[#D4AF37] transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to all articles
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-gray-500 text-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#B8952E] flex items-center justify-center text-white mr-3 shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium text-gray-700">{blog.author || 'Admin'}</span>
            </div>
            <div className="flex items-center text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </header>

        {blog.coverImage && (
          <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-lg">
            <img 
              src={blog.coverImage} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div 
          className="prose prose-lg prose-gray max-w-none prose-headings:text-gray-900 prose-a:text-[#D4AF37] hover:prose-a:text-[#B8952E] prose-img:rounded-2xl prose-img:shadow-md"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

      </div>
    </div>
  );
}
