'use client';

import React from 'react';

// Stats Card Component
export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    period: string;
  };
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  icon,
  trend,
  className = '',
}: StatsCardProps) {
  const trendColors = {
    up: 'text-emerald-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <div className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-400 text-sm">{title}</span>
        {icon && (
          <div className="p-2 bg-gray-700 rounded-lg text-emerald-400">
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              <span className={trendColors[trend || (change.value >= 0 ? 'up' : 'down')]}>
                {change.value >= 0 ? '+' : ''}{change.value}%
              </span>
              <span className="text-gray-500 text-sm">{change.period}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Stats Grid
export interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsGrid({ children, columns = 4, className = '' }: StatsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
}

// Metric Display
export interface MetricProps {
  label: string;
  value: string | number;
  subValue?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Metric({ label, value, subValue, size = 'md', className = '' }: MetricProps) {
  const sizes = {
    sm: { label: 'text-xs', value: 'text-lg' },
    md: { label: 'text-sm', value: 'text-2xl' },
    lg: { label: 'text-base', value: 'text-4xl' },
  };

  return (
    <div className={className}>
      <p className={`text-gray-400 ${sizes[size].label}`}>{label}</p>
      <p className={`font-bold text-white ${sizes[size].value}`}>{value}</p>
      {subValue && (
        <p className="text-gray-500 text-sm mt-1">{subValue}</p>
      )}
    </div>
  );
}

// Key-Value List
export interface KeyValueItem {
  key: string;
  value: React.ReactNode;
  tooltip?: string;
}

export interface KeyValueListProps {
  items: KeyValueItem[];
  divider?: boolean;
  className?: string;
}

export function KeyValueList({ items, divider = true, className = '' }: KeyValueListProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex items-center justify-between ${
            divider && index < items.length - 1 ? 'pb-3 border-b border-gray-700' : ''
          }`}
        >
          <span className="text-gray-400 flex items-center gap-1">
            {item.key}
            {item.tooltip && (
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </span>
          <span className="text-white font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

// Comparison Stat
export interface ComparisonStatProps {
  label: string;
  current: number | string;
  previous: number | string;
  className?: string;
}

export function ComparisonStat({
  label,
  current,
  previous,
  className = '',
}: ComparisonStatProps) {
  const currentNum = typeof current === 'string' ? parseFloat(current) : current;
  const previousNum = typeof previous === 'string' ? parseFloat(previous) : previous;
  const change = previousNum !== 0 ? ((currentNum - previousNum) / previousNum) * 100 : 0;
  const isPositive = change >= 0;

  return (
    <div className={`bg-gray-800/50 rounded-lg p-4 ${className}`}>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xl font-bold text-white">{current}</p>
          <p className="text-xs text-gray-500">Previous: {previous}</p>
        </div>
        <div
          className={`flex items-center gap-1 text-sm ${
            isPositive ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          <svg
            className={`w-4 h-4 ${!isPositive ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span>{Math.abs(change).toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
}

// Sparkline Mini Chart
export interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  className?: string;
}

export function Sparkline({
  data,
  color = '#10B981',
  height = 40,
  className = '',
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 100;
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      style={{ height }}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
