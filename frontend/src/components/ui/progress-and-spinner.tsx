import React from 'react';

/**
 * PR #13: Progress bars for multi-step processes
 * Animated progress bar component
 */
interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  animated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'red' | 'purple';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  animated = true,
  size = 'md',
  color = 'blue',
}) => {
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <div>
      {label && <p className="text-sm font-medium text-gray-300 mb-2">{label}</p>}
      <div className={`w-full bg-gray-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-300 ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${Math.min(value, 100)}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {(label || value) && (
        <p className="text-xs text-gray-400 mt-1">{value}% complete</p>
      )}
    </div>
  );
};

/**
 * PR #14: Animated loading spinners
 */
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; label?: string }> = ({
  size = 'md',
  label,
}) => {
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        className={`${sizeClasses[size]} animate-spin text-blue-500`}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {label && <p className="text-sm text-gray-400">{label}</p>}
    </div>
  );
};
