'use client';

import React from 'react';

export interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const variantStyles = {
  info: {
    container: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    icon: 'text-blue-400',
    defaultIcon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  success: {
    container: 'bg-green-500/10 border-green-500/30 text-green-400',
    icon: 'text-green-400',
    defaultIcon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  warning: {
    container: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    icon: 'text-yellow-400',
    defaultIcon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
  error: {
    container: 'bg-red-500/10 border-red-500/30 text-red-400',
    icon: 'text-red-400',
    defaultIcon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export function Alert({
  variant = 'info',
  title,
  children,
  icon,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`
        flex gap-3 p-4 rounded-xl border
        ${styles.container}
        ${className}
      `}
    >
      <span className={`flex-shrink-0 ${styles.icon}`}>
        {icon || styles.defaultIcon}
      </span>
      
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-medium mb-1">{title}</h4>
        )}
        <div className="text-sm opacity-90">{children}</div>
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Banner Alert - full width, often at top of page
export interface BannerAlertProps extends Omit<AlertProps, 'dismissible'> {
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function BannerAlert({
  variant = 'info',
  children,
  icon,
  action,
  className = '',
}: BannerAlertProps) {
  const styles = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`
        flex items-center justify-center gap-3 px-4 py-3 text-sm
        ${styles.container.replace('rounded-xl', '')}
        ${className}
      `}
    >
      <span className={styles.icon}>
        {icon || styles.defaultIcon}
      </span>
      <span>{children}</span>
      {action && (
        <button
          onClick={action.onClick}
          className="font-medium underline hover:no-underline ml-2"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
