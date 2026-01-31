'use client';

import React, { useState, useEffect } from 'react';

// =============================================================================
// EMPTY STATE
// =============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: 'py-8 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-8',
  };

  const iconSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]} ${className}`}>
      {icon ? (
        <div className={`${iconSizes[size]} text-zinc-500 mb-4`}>{icon}</div>
      ) : (
        <div className={`${iconSizes[size]} text-zinc-500 mb-4`}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className={`font-semibold text-zinc-100 ${titleSizes[size]} mb-2`}>{title}</h3>
      {description && <p className="text-zinc-400 max-w-sm mb-6">{description}</p>}
      {(action || secondaryAction) && (
        <div className="flex items-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                action.variant === 'secondary'
                  ? 'bg-zinc-700 hover:bg-zinc-600 text-zinc-200'
                  : 'bg-amber-500 hover:bg-amber-400 text-black'
              }`}
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// NO DATA VARIANTS
// =============================================================================

interface NoDataProps {
  type: 'transactions' | 'positions' | 'rewards' | 'notifications' | 'search' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function NoData({ type, action, className = '' }: NoDataProps) {
  const configs = {
    transactions: {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'No Transactions Yet',
      description: 'Your transaction history will appear here once you start staking.',
    },
    positions: {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      title: 'No Active Positions',
      description: 'Start staking to create your first position and earn rewards.',
    },
    rewards: {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'No Rewards Available',
      description: 'Rewards are distributed based on your staking duration and amount.',
    },
    notifications: {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'No Notifications',
      description: "You're all caught up! New notifications will appear here.",
    },
    search: {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'No Results Found',
      description: 'Try adjusting your search or filter criteria.',
    },
    error: {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: 'Something Went Wrong',
      description: 'We encountered an error. Please try again later.',
    },
  };

  const config = configs[type];

  return (
    <EmptyState
      icon={<div className="w-full h-full">{config.icon}</div>}
      title={config.title}
      description={config.description}
      action={action}
      className={className}
    />
  );
}

// =============================================================================
// LOADING STATE
// =============================================================================

interface LoadingStateProps {
  message?: string;
  submessage?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  submessage,
  size = 'md',
  className = '',
}: LoadingStateProps) {
  const sizeClasses = {
    sm: { container: 'py-8', spinner: 'w-8 h-8', text: 'text-sm' },
    md: { container: 'py-12', spinner: 'w-12 h-12', text: 'text-base' },
    lg: { container: 'py-16', spinner: 'w-16 h-16', text: 'text-lg' },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center ${sizes.container} ${className}`}>
      <div className={`${sizes.spinner} mb-4`}>
        <svg className="animate-spin text-amber-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
      <p className={`text-zinc-200 font-medium ${sizes.text}`}>{message}</p>
      {submessage && <p className="text-zinc-500 text-sm mt-1">{submessage}</p>}
    </div>
  );
}

// =============================================================================
// ERROR STATE
// =============================================================================

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <div className="w-16 h-16 text-red-500 mb-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400 text-center max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg font-medium transition-colors"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

// =============================================================================
// SUCCESS STATE
// =============================================================================

interface SuccessStateProps {
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function SuccessState({
  title = 'Success!',
  message = 'Your action was completed successfully.',
  action,
  className = '',
}: SuccessStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <div className="w-16 h-16 text-green-500 mb-4">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400 text-center max-w-sm mb-6">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// =============================================================================
// CONNECTION STATE
// =============================================================================

interface ConnectionStateProps {
  status: 'connecting' | 'disconnected' | 'error';
  onConnect?: () => void;
  onRetry?: () => void;
  className?: string;
}

export function ConnectionState({ status, onConnect, onRetry, className = '' }: ConnectionStateProps) {
  const configs = {
    connecting: {
      icon: (
        <svg className="animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ),
      title: 'Connecting Wallet',
      description: 'Please approve the connection in your wallet...',
      action: null,
    },
    disconnected: {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      title: 'Wallet Not Connected',
      description: 'Connect your wallet to access all features.',
      action: onConnect ? { label: 'Connect Wallet', onClick: onConnect } : null,
    },
    error: {
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Connection Failed',
      description: 'Failed to connect to wallet. Please try again.',
      action: onRetry ? { label: 'Try Again', onClick: onRetry } : null,
    },
  };

  const config = configs[status];
  const iconColor = status === 'error' ? 'text-red-500' : status === 'connecting' ? 'text-amber-500' : 'text-zinc-500';

  return (
    <div className={`flex flex-col items-center justify-center py-12 px-6 ${className}`}>
      <div className={`w-16 h-16 ${iconColor} mb-4`}>{config.icon}</div>
      <h3 className="text-xl font-semibold text-zinc-100 mb-2">{config.title}</h3>
      <p className="text-zinc-400 text-center max-w-sm mb-6">{config.description}</p>
      {config.action && (
        <button
          onClick={config.action.onClick}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg font-medium transition-colors"
        >
          {config.action.label}
        </button>
      )}
    </div>
  );
}
