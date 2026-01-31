'use client'

import React from 'react'

// ============================================================================
// Skeleton Components
// ============================================================================

interface SkeletonProps {
  className?: string
  animate?: boolean
}

export function Skeleton({ className = '', animate = true }: SkeletonProps) {
  return (
    <div
      className={`
        bg-gray-200 dark:bg-gray-700 rounded
        ${animate ? 'animate-pulse' : ''}
        ${className}
      `}
      aria-hidden="true"
    />
  )
}

export function SkeletonText({ 
  lines = 1, 
  className = '' 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}`}
        />
      ))}
    </div>
  )
}

export function SkeletonAvatar({ 
  size = 'md' 
}: { 
  size?: 'sm' | 'md' | 'lg' | 'xl' 
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  return <Skeleton className={`${sizeClasses[size]} rounded-full`} />
}

export function SkeletonButton({ 
  size = 'md',
  fullWidth = false,
}: { 
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-32',
  }

  return (
    <Skeleton 
      className={`${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} rounded-lg`}
    />
  )
}

// ============================================================================
// Card Skeletons
// ============================================================================

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-6 
        border border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      <div className="flex items-start gap-4">
        <SkeletonAvatar size="lg" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-1/2" />
          <SkeletonText lines={2} />
        </div>
      </div>
    </div>
  )
}

export function SkeletonStatsCard({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-6 
        border border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      <Skeleton className="h-4 w-24 mb-2" />
      <Skeleton className="h-8 w-32 mb-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  )
}

export function SkeletonPositionCard({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-6 
        border border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div>
          <Skeleton className="h-3 w-16 mb-1" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      
      <Skeleton className="h-2 w-full rounded-full mb-4" />
      
      <div className="flex gap-2">
        <SkeletonButton size="sm" />
        <SkeletonButton size="sm" />
      </div>
    </div>
  )
}

export function SkeletonTransactionRow({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 py-4 ${className}`}>
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right">
        <Skeleton className="h-4 w-20 mb-1" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  )
}

// ============================================================================
// Page Layout Skeletons
// ============================================================================

export function SkeletonPageHeader() {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-4 w-72" />
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      <SkeletonPageHeader />
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatsCard key={i} />
        ))}
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonPositionCard key={i} />
          ))}
        </div>
        <div className="space-y-4">
          <SkeletonCard />
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonTransactionRow key={i} className="px-4" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonStakePage() {
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <SkeletonPageHeader />
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
        {/* Amount Input */}
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="flex justify-between mt-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        
        {/* Lock Period */}
        <div>
          <Skeleton className="h-4 w-32 mb-2" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
            ))}
          </div>
        </div>
        
        {/* Summary */}
        <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
        
        {/* Submit Button */}
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 flex-1" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="px-4 py-4 flex gap-4">
            {Array.from({ length: 5 }).map((_, j) => (
              <Skeleton key={j} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Custom Shimmer Animation
// ============================================================================

export function ShimmerBlock({ 
  width, 
  height, 
  className = '' 
}: { 
  width: string | number
  height: string | number
  className?: string 
}) {
  return (
    <div 
      className={`relative overflow-hidden bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={{ width, height }}
    >
      <div 
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
    </div>
  )
}

export default Skeleton
