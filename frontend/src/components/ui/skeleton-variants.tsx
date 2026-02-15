import React from 'react';

/**
 * PR #11: Skeleton loader for cards
 */
export const CardSkeletonLoader: React.FC = () => (
  <div className="p-6 space-y-4 bg-gray-800/30 rounded-xl animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-3/4" />
    <div className="space-y-2">
      <div className="h-4 bg-gray-700 rounded" />
      <div className="h-4 bg-gray-700 rounded w-5/6" />
    </div>
    <div className="h-10 bg-gray-700 rounded" />
  </div>
);

/**
 * PR #12: Pulse loader variant
 */
export const PulseLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`${sizes[size]} bg-blue-500 rounded-full animate-pulse`}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
};
