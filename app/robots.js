export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://future-titans-frontend-xi.vercel.app';

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
