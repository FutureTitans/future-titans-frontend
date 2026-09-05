import { Inter, Oxanium, Rajdhani } from 'next/font/google';
import Script from 'next/script';
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

// Gamified display + body typefaces used across the student portal
const oxanium = Oxanium({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-oxanium',
});

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-rajdhani',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#D4AF37',
};

export const metadata = {
  title: {
    default: 'India\'s First Complete Entrepreneurship and Innovation Capability Ecosystem',
    template: '%s | Future Titans',
  },
  description:
    'India\'s premier AI-powered innovation challenge for age 12-19. Master entrepreneurship through structured learning and compete nationally.',
  keywords: [
    'innovation challenge',
    'student entrepreneurship',
    'AI learning platform',
    'innovation framework',
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
    siteName: 'Future Titans',
    title: 'India\'s First Complete Entrepreneurship and Innovation Capability Ecosystem',
    description:
      'India\'s premier AI-powered innovation challenge for age 12-19. Master entrepreneurship through structured learning and compete nationally.',
    images: [
      {
        url: '/og-logo.png',
        width: 1200,
        height: 630,
        alt: 'Future Titans Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'India\'s First Complete Entrepreneurship and Innovation Capability Ecosystem',
    description:
      'India\'s premier AI-powered innovation challenge for age 12-19. Master entrepreneurship through structured learning and compete nationally.',
    images: ['/og-logo.png'],
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
    icon: '/favicon.png?v=2',
    apple: '/favicon.png?v=2',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Future Titans',
  description:
    'India\'s premier AI-powered innovation challenge for age 12-19. Master entrepreneurship through structured learning and compete nationally.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://future-titans-frontend-xi.vercel.app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${oxanium.variable} ${rajdhani.variable}`}>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/xok1vst.css" />
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
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
        <Analytics />
      </body>
    </html>
  );
}
