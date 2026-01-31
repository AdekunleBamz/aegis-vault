'use client';

import React from 'react';

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: 'default' | 'light' | 'dark';
  className?: string;
  children?: React.ReactNode;
}

const variantClasses = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

const colorClasses = {
  default: 'border-gray-700',
  light: 'border-gray-600',
  dark: 'border-gray-800',
};

export function Divider({
  orientation = 'horizontal',
  variant = 'solid',
  color = 'default',
  className = '',
  children,
}: DividerProps) {
  const baseClasses = `${variantClasses[variant]} ${colorClasses[color]}`;

  if (children) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className={`flex-1 border-t ${baseClasses}`} />
        <span className="text-gray-500 text-sm">{children}</span>
        <div className={`flex-1 border-t ${baseClasses}`} />
      </div>
    );
  }

  if (orientation === 'vertical') {
    return (
      <div className={`border-l h-full ${baseClasses} ${className}`} />
    );
  }

  return (
    <hr className={`border-t ${baseClasses} ${className}`} />
  );
}

// Spacer - flexible spacing utility
export interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  axis?: 'horizontal' | 'vertical' | 'both';
}

const spacerSizes = {
  xs: { h: 'h-2', w: 'w-2', both: 'p-2' },
  sm: { h: 'h-4', w: 'w-4', both: 'p-4' },
  md: { h: 'h-6', w: 'w-6', both: 'p-6' },
  lg: { h: 'h-8', w: 'w-8', both: 'p-8' },
  xl: { h: 'h-12', w: 'w-12', both: 'p-12' },
  '2xl': { h: 'h-16', w: 'w-16', both: 'p-16' },
};

export function Spacer({ size = 'md', axis = 'vertical' }: SpacerProps) {
  const sizeClass = spacerSizes[size];
  
  if (axis === 'both') {
    return <div className={sizeClass.both} />;
  }
  
  return (
    <div 
      className={axis === 'vertical' ? sizeClass.h : sizeClass.w}
      aria-hidden="true"
    />
  );
}

// Empty State - for showing when no content
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-500">{icon}</span>
        </div>
      )}
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
}

// Section Header - for page sections
export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-6 ${className}`}>
      <div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {subtitle && (
          <p className="text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}
