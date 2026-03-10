'use client';

export default function LoadingSpinner({ size = 'md', message = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin`} />
      {message && <p className="mt-4 text-gray-500 text-sm">{message}</p>}
    </div>
  );
}
