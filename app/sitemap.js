import axios from 'axios';
import { headers } from 'next/headers';

export default async function sitemap() {
  const headersList = headers();
  const host = headersList.get('host') || 'future-titans-frontend-xi.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  
  // Define static routes
  const routes = [
    '',
    '/blog',
    '/login',
    '/signup',
    '/faq',
    '/contact',
    '/about'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Fetch all published blogs
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://future-titans-backend-sigma.vercel.app/api';
    const { data: blogs } = await axios.get(`${apiUrl}/blogs?status=published`);
    
    // Generate dynamic routes for each blog post
    const blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...routes, ...blogRoutes];
  } catch (error) {
    console.error('Error generating sitemap for blogs:', error.message);
    // If fetching blogs fails, still return the static routes
    return routes;
  }
}
