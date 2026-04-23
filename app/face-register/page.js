'use client';

import dynamic from 'next/dynamic';

const FaceRegistration = dynamic(
  () => import('@/components/shared/FaceRegistration'),
  { ssr: false }
);

export default function FaceRegisterPage() {
  return <FaceRegistration />;
}
