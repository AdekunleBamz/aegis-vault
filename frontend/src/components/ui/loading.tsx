import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loading({ size = 'md', className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 flex flex-col items-center gap-4">
        <Loading size="lg" />
        <p className="text-white">Processing...</p>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-gray-700 animate-pulse rounded ${className}`}
    />
  );
}
