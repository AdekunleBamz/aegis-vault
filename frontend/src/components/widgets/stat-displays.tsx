'use client'

import React from 'react'

// ============================================================================
// Stat Display Components
// ============================================================================

interface StatCardProps {
  label: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period?: string
  }
  icon?: React.ReactNode
  trend?: Array<number>
  loading?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  change,
  icon,
  trend,
  loading = false,
  className = '',
}: StatCardProps) {
  const changeColors = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400',
  }

  const changeIcons = {
    increase: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    decrease: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  }

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          
          {change && (
            <div className={`flex items-center gap-1 mt-1 text-sm ${changeColors[change.type]}`}>
              {changeIcons[change.type]}
              <span>{Math.abs(change.value)}%</span>
              {change.period && (
                <span className="text-gray-400 dark:text-gray-500">{change.period}</span>
              )}
            </div>
          )}
        </div>
        
        {icon && (
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
            {icon}
          </div>
        )}
      </div>

      {/* Mini Sparkline */}
      {trend && trend.length > 0 && (
        <div className="mt-4">
          <MiniSparkline data={trend} height={40} color={change?.type === 'decrease' ? '#EF4444' : '#8B5CF6'} />
        </div>
      )}
    </div>
  )
}

// Mini Sparkline Chart
function MiniSparkline({ 
  data, 
  width = 120, 
  height = 40,
  color = '#8B5CF6'
}: { 
  data: number[]
  width?: number
  height?: number
  color?: string
}) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ============================================================================
// Stat Group Component
// ============================================================================

interface StatItem {
  label: string
  value: string | number
  change?: StatCardProps['change']
  icon?: React.ReactNode
}

interface StatGroupProps {
  stats: StatItem[]
  columns?: 2 | 3 | 4
  loading?: boolean
  className?: string
}

export function StatGroup({
  stats,
  columns = 4,
  loading = false,
  className = '',
}: StatGroupProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          icon={stat.icon}
          loading={loading}
        />
      ))}
    </div>
  )
}

// ============================================================================
// Inline Stat
// ============================================================================

interface InlineStatProps {
  label: string
  value: string | number
  suffix?: string
  className?: string
}

export function InlineStat({ label, value, suffix, className = '' }: InlineStatProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {value}
        {suffix && <span className="text-gray-400 ml-1">{suffix}</span>}
      </span>
    </div>
  )
}

// ============================================================================
// Stat with Progress
// ============================================================================

interface StatWithProgressProps {
  label: string
  value: number
  max: number
  format?: (value: number) => string
  showPercentage?: boolean
  color?: 'purple' | 'green' | 'blue' | 'yellow' | 'red'
  className?: string
}

export function StatWithProgress({
  label,
  value,
  max,
  format = (v) => v.toLocaleString(),
  showPercentage = true,
  color = 'purple',
  className = '',
}: StatWithProgressProps) {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0

  const colorClasses = {
    purple: 'bg-purple-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          {format(value)} / {format(max)}
          {showPercentage && (
            <span className="text-gray-400 ml-1">({percentage.toFixed(1)}%)</span>
          )}
        </span>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// ============================================================================
// Large Stat Display
// ============================================================================

interface LargeStatProps {
  label: string
  value: string | number
  subValue?: string
  icon?: React.ReactNode
  gradient?: boolean
  className?: string
}

export function LargeStat({
  label,
  value,
  subValue,
  icon,
  gradient = false,
  className = '',
}: LargeStatProps) {
  return (
    <div 
      className={`
        relative overflow-hidden rounded-2xl p-8
        ${gradient 
          ? 'bg-gradient-to-br from-purple-500 to-blue-600 text-white' 
          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
        }
        ${className}
      `}
    >
      {/* Background Pattern */}
      {gradient && (
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      )}

      <div className="relative flex items-start justify-between">
        <div>
          <p className={`text-sm font-medium mb-2 ${gradient ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
            {label}
          </p>
          <p className={`text-4xl font-bold ${gradient ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
            {value}
          </p>
          {subValue && (
            <p className={`text-sm mt-2 ${gradient ? 'text-white/60' : 'text-gray-400'}`}>
              {subValue}
            </p>
          )}
        </div>
        
        {icon && (
          <div className={`p-4 rounded-xl ${gradient ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900/30'}`}>
            <span className={gradient ? 'text-white' : 'text-purple-600 dark:text-purple-400'}>
              {icon}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default StatCard
