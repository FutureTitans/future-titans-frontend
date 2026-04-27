import './globals.css';
import Navbar from '@/components/shared/Navbar';
import GlobalAIChat from '@/components/student/GlobalAIChat';
import FaceGuardWrapper from '@/components/shared/FaceGuardWrapper';

export const metadata = {
  title: 'Future Titans Innovation Challenge',
  description: 'Empower the next generation of innovators with AI-powered learning',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-dark">
        <Navbar />
        <FaceGuardWrapper>
          {children}
        </FaceGuardWrapper>
        {/* Global AI chat (only shows for paid students, not on landing/auth/admin) */}
        <GlobalAIChat />
      </body>
    </html>
  );
}
