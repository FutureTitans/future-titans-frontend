import './globals.css';
import Navbar from '@/components/shared/Navbar';
import GlobalAIChat from '@/components/student/GlobalAIChat';
import FaceMonitor from '@/components/shared/FaceMonitor';

export const metadata = {
  title: 'Future Titans Innovation Challenge',
  description: 'Empower the next generation of innovators with AI-powered learning',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-neutral-dark">
        <Navbar />
        {children}
        {/* Global AI chat (only shows for paid students, not on landing/auth/admin) */}
        <GlobalAIChat />
        {/* Continuous face monitoring (only shows for students with face registered) */}
        <FaceMonitor />
      </body>
    </html>
  );
}

