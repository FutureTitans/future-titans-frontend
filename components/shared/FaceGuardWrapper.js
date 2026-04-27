'use client';

import dynamic from 'next/dynamic';

// Dynamically import FaceVerificationProvider to avoid SSR issues with camera/face-api
const FaceVerificationProvider = dynamic(
  () => import('@/components/shared/FaceVerificationProvider'),
  { ssr: false }
);

/**
 * Client-side wrapper that conditionally loads the face verification system.
 * Only activates for students with registered face descriptors.
 * Admin, association, and school users pass through unaffected.
 */
export default function FaceGuardWrapper({ children }) {
  return (
    <FaceVerificationProvider>
      {children}
    </FaceVerificationProvider>
  );
}
