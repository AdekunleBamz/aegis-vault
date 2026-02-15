import React from 'react';

/**
 * PR #13: Progress bars for multi-step processes
 */
interface MultiStepProgressProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const MultiStepProgress: React.FC<MultiStepProgressProps> = ({
  currentStep,
  totalSteps,
  labels,
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <div key={idx} className="flex items-center">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold
              ${idx < currentStep ? 'bg-green-500 text-white' : idx === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}
            `}
          >
            {idx < currentStep ? '✓' : idx + 1}
          </div>
          {idx < totalSteps - 1 && (
            <div
              className={`w-8 h-0.5 ${idx < currentStep - 1 ? 'bg-green-500' : 'bg-gray-700'}`}
            />
          )}
        </div>
      ))}
    </div>
    {labels && (
      <div className="flex justify-between text-xs text-gray-400">
        {labels.map((label, idx) => (
          <span key={idx}>{label}</span>
        ))}
      </div>
    )}
  </div>
);

/**
 * PR #14: Animated loading spinners
 */
export const GradientSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; label?: string }> = ({
  size = 'md',
  label,
}) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-spin" />
        <div className="absolute inset-1 bg-gray-950 rounded-full" />
      </div>
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  );
};

/**
 * PR #15: Skeleton grids
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, c) => (
          <div key={c} className="h-8 bg-gray-700/50 rounded animate-pulse" />
        ))}
      </div>
    ))}
  </div>
);

/**
 * PR #16: Placeholder states
 */
export const NoDataPlaceholder: React.FC<{ message?: string }> = ({
  message = 'No data available',
}) => (
  <div className="py-12 text-center">
    <svg className="w-12 h-12 mx-auto text-gray-600 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
    <p className="text-gray-400">{message}</p>
  </div>
);
