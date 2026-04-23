'use client';

import dynamic from 'next/dynamic';

const FaceVerification = dynamic(
  () => import('@/components/shared/FaceVerification'),
  { ssr: false }
);

export default function FaceVerifyPage() {
  return <FaceVerification />;
}
