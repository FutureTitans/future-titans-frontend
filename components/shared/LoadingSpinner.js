'use client';

export default function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-neutral-light border-t-primary-red rounded-full animate-spin`} />
      {message && <p className="mt-4 text-neutral-medium">{message}</p>}
    </div>
  );
}

