import { headers } from 'next/headers';

export default function robots() {
  const headersList = headers();
  const host = headersList.get('host') || 'future-titans-frontend-xi.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/student/', 
        '/association/', 
        '/api/'
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
