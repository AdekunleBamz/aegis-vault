'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-gray-700 text-gray-200',
    success: 'bg-green-900/50 text-green-400 border border-green-700',
    warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
    error: 'bg-red-900/50 text-red-400 border border-red-700',
    info: 'bg-blue-900/50 text-blue-400 border border-blue-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}

interface StatusDotProps {
  status: 'online' | 'offline' | 'pending' | 'error';
  label?: string;
  className?: string;
}

export function StatusDot({ status, label, className = '' }: StatusDotProps) {
  const statusStyles = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    pending: 'bg-yellow-500 animate-pulse',
    error: 'bg-red-500',
  };

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className={`w-2 h-2 rounded-full ${statusStyles[status]}`} />
      {label && <span className="text-sm text-gray-400">{label}</span>}
    </span>
  );
}
