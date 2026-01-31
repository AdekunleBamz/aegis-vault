import React from 'react';

interface LoadingProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  color?: 'blue' | 'white' | 'green' | 'purple';
  className?: string;
}

const sizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const colorClasses = {
  blue: 'border-blue-500',
  white: 'border-white',
  green: 'border-green-500',
  purple: 'border-purple-500',
};

export function Loading({ 
  size = 'md', 
  variant = 'spinner',
  color = 'blue',
  className = '' 
}: LoadingProps) {
  if (variant === 'dots') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${size === 'lg' ? 'w-3 h-3' : size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2'} 
              rounded-full bg-${color === 'blue' ? 'blue-500' : color === 'white' ? 'white' : color === 'green' ? 'green-500' : 'purple-500'}
              animate-bounce`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} relative`}>
          <div className={`absolute inset-0 rounded-full ${colorClasses[color].replace('border', 'bg')}/30 animate-ping`} />
          <div className={`relative ${sizeClasses[size]} rounded-full ${colorClasses[color].replace('border', 'bg')}`} />
        </div>
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`flex items-end gap-1 h-6 ${className}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-1 bg-${color === 'blue' ? 'blue-500' : color === 'white' ? 'white' : color === 'green' ? 'green-500' : 'purple-500'} 
              rounded-full animate-pulse`}
            style={{ 
              height: '100%',
              animationDelay: `${i * 0.15}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-2 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
  submessage?: string;
  showProgress?: boolean;
  progress?: number;
}

export function LoadingOverlay({ 
  message = 'Processing...', 
  submessage,
  showProgress = false,
  progress = 0,
}: LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800/90 border border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-4 min-w-[280px] shadow-2xl">
        <div className="relative">
          <Loading size="lg" />
          <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
        </div>
        <div className="text-center">
          <p className="text-white font-medium">{message}</p>
          {submessage && (
            <p className="text-gray-400 text-sm mt-1">{submessage}</p>
          )}
        </div>
        {showProgress && (
          <div className="w-full">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-gray-400 text-xs text-center mt-2">{progress}%</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export function LoadingSkeleton({ 
  className = '', 
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%]',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`bg-gray-700 ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Preset skeleton layouts
export function CardSkeleton() {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <LoadingSkeleton variant="text" width="60%" />
          <LoadingSkeleton variant="text" width="40%" />
        </div>
      </div>
      <LoadingSkeleton variant="rounded" height={100} />
      <div className="flex gap-2">
        <LoadingSkeleton variant="rounded" height={36} className="flex-1" />
        <LoadingSkeleton variant="rounded" height={36} className="flex-1" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-700/50">
      {Array.from({ length: columns }).map((_, i) => (
        <LoadingSkeleton 
          key={i} 
          variant="text" 
          className="flex-1" 
          width={i === 0 ? '30%' : '20%'} 
        />
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="space-y-2">
      <LoadingSkeleton variant="text" width="40%" height={14} />
      <LoadingSkeleton variant="text" width="70%" height={28} />
    </div>
  );
}
