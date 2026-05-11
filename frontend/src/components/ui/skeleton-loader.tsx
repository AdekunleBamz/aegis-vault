import React from 'react';

/**
 * Props for the Skeleton placeholder component.
 * Supports configurable count, dimensions, shape, and pulse animation.
 */
interface SkeletonProps {
  className?: string;
  count?: number;
  height?: string;
  width?: string;
  circle?: boolean;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  count = 1,
  height = '1rem',
  width = '100%',
  circle = false,
  animated = true,
}) => {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className={`
            bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800
            ${animated ? 'animate-pulse' : ''}
            ${circle ? 'rounded-full' : 'rounded-lg'}
            ${className}
          `}
          style={{
            height: circle ? width : height,
            width,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

/**
 * PR #12: Pulse animations for loading states
 */
export const CardSkeleton: React.FC = () => (
  <div className="p-6 space-y-4 bg-gray-800/30 rounded-xl">
    <Skeleton height="1.5rem" width="80%" />
    <Skeleton height="1rem" width="100%" count={2} />
    <Skeleton height="2.5rem" width="100%" />
  </div>
);

/**
 * PR #15: Skeleton grids for data tables
 */
export const SkeletonGrid: React.FC<{ rows?: number; columns?: number; className?: string }> = ({
  rows = 5,
  columns = 4,
  className = '',
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <div key={rowIdx} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, colIdx) => (
          <Skeleton key={`${rowIdx}-${colIdx}`} />
        ))}
      </div>
    ))}
  </div>
);
