'use client';

import React from 'react';
import { cn } from '@/lib/utils';

// Skeleton variants
export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const roundedClasses = {
  none: '',
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export function Skeleton({
  width,
  height,
  rounded = 'md',
  className = '',
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        "bg-muted/30 animate-pulse",
        roundedClasses[rounded],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

// Pulse loader variant
export function PulseLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };
  return (
    <div className="flex gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            sizes[size],
            "bg-aegis-blue/40 rounded-full animate-pulse"
          )}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// Text skeleton
export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={16}
          width={i === lines - 1 ? '60%' : '100%'}
          rounded="sm"
        />
      ))}
    </div>
  );
}

// Avatar skeleton
export function SkeletonAvatar({ size = 40, className = '' }: { size?: number; className?: string }) {
  return <Skeleton width={size} height={size} rounded="full" className={className} />;
}

// Card skeleton
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <SkeletonAvatar size={48} />
        <div className="flex-1 space-y-2">
          <Skeleton height={20} width="60%" />
          <Skeleton height={14} width="40%" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <div className="flex gap-2 mt-4">
        <Skeleton height={36} width={80} rounded="lg" />
        <Skeleton height={36} width={80} rounded="lg" />
      </div>
    </div>
  );
}

// Table row skeleton
export function SkeletonTableRow({ columns = 4, className = '' }: { columns?: number; className?: string }) {
  return (
    <tr className={className}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton height={20} width={i === 0 ? '70%' : '50%'} />
        </td>
      ))}
    </tr>
  );
}

// Stats skeleton
export function SkeletonStats({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
      <Skeleton height={14} width="40%" className="mb-4" />
      <Skeleton height={32} width="60%" className="mb-2" />
      <Skeleton height={14} width="30%" />
    </div>
  );
}

// List item skeleton
export function SkeletonListItem({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 p-4 ${className}`}>
      <SkeletonAvatar size={40} />
      <div className="flex-1">
        <Skeleton height={18} width="60%" className="mb-2" />
        <Skeleton height={14} width="40%" />
      </div>
      <Skeleton height={24} width={80} rounded="lg" />
    </div>
  );
}

// Chart skeleton
export function SkeletonChart({ height = 200, className = '' }: { height?: number; className?: string }) {
  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <Skeleton height={20} width={120} />
        <div className="flex gap-2">
          <Skeleton height={28} width={60} rounded="md" />
          <Skeleton height={28} width={60} rounded="md" />
        </div>
      </div>
      <div className="flex items-end gap-1" style={{ height }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-700 animate-pulse rounded-t"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Form skeleton
export function SkeletonForm({ fields = 3, className = '' }: { fields?: number; className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton height={14} width={80} className="mb-2" />
          <Skeleton height={44} width="100%" rounded="lg" />
        </div>
      ))}
      <Skeleton height={48} width="100%" rounded="lg" />
    </div>
  );
}

// Card skeleton
export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4 bg-muted/20 rounded-xl border border-border/50">
      <Skeleton height="1.5rem" width="80%" />
      <Skeleton height="1rem" width="100%" className="opacity-50" />
      <Skeleton height="1rem" width="100%" className="opacity-50" />
      <Skeleton height="2.5rem" width="100%" rounded="lg" />
    </div>
  );
}

// Skeleton grid for tables or card lists
export function SkeletonGrid({ rows = 5, columns = 4, className = '' }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={`${rowIdx}-${colIdx}`} height="1.25rem" />
          ))}
        </div>
      ))}
    </div>
  );
}
