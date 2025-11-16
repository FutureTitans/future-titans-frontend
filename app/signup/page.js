import { Suspense } from 'react';
import SignupPageClient from './SignupPageClient';

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-white-light">
          <div className="text-neutral-medium text-sm">Loading signup...</div>
        </div>
      }
    >
      <SignupPageClient />
    </Suspense>
  );
}

