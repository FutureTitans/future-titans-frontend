import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import GlobalAIChat from '@/components/student/GlobalAIChat';
import FaceGuardWrapper from '@/components/shared/FaceGuardWrapper';
import { Analytics } from '@vercel/analytics/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#D4AF37',
};

export const metadata = {
  title: {
    default: 'Future Titans Innovation Challenge | AI-Powered Learning for Young Innovators',
    template: '%s | Future Titans',
  },
  description:
    'India\'s premier AI-powered innovation challenge for students. Master entrepreneurship through the SURGE framework, build real ideas, and compete nationally. Join 10,000+ student innovators.',
  keywords: [
    'innovation challenge',
    'student entrepreneurship',
    'AI learning platform',
    'SURGE framework',
    'Future Titans',
    'startup competition India',
    'student innovation',
    'entrepreneurship education',
  ],
  authors: [{ name: 'Future Titans' }],
  creator: 'Future Titans',
  publisher: 'Future Titans',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://future-titans-frontend-xi.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Future Titans Innovation Challenge',
    title: 'Future Titans Innovation Challenge | AI-Powered Learning for Young Innovators',
    description:
      'India\'s premier AI-powered innovation challenge for students. Master entrepreneurship through the SURGE framework and compete nationally.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Future Titans Innovation Challenge',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Future Titans Innovation Challenge',
    description:
      'AI-powered innovation challenge for students. Master entrepreneurship through the SURGE framework.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Future Titans Innovation Challenge',
  description:
    'AI-powered innovation challenge platform for student entrepreneurs in India.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://future-titans-frontend-xi.vercel.app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-cream text-neutral-dark antialiased">
        <Navbar />
        <FaceGuardWrapper>
          <main id="main-content">{children}</main>
        </FaceGuardWrapper>
        <GlobalAIChat />
        <Analytics />
      </body>
    </html>
  );
}
