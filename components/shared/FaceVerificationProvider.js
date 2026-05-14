'use client';

// Face verification is handled at the module level by ModuleFaceGuard.
// This provider is kept as a no-op wrapper so the root layout import doesn't break.
export default function FaceVerificationProvider({ children }) {
  return <>{children}</>;
}
