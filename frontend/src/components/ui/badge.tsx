import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium' | 'new';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  animated?: boolean;
  icon?: React.ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

const variants = {
  default: 'bg-gray-700 text-gray-300 border-gray-600',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  premium: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-400 border-yellow-500/30',
  new: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
};

const dotColors = {
  default: 'bg-gray-400',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  error: 'bg-red-400',
  info: 'bg-blue-400',
  premium: 'bg-yellow-400',
  new: 'bg-purple-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export function Badge({ 
  variant = 'default', 
  size = 'md',
  children, 
  className = '',
  dot = false,
  animated = false,
  icon,
  removable = false,
  onRemove,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border
        ${variants[variant]} ${sizes[size]} ${className}
        ${animated ? 'animate-pulse' : ''}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${animated ? 'animate-ping' : ''}`} />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {removable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 -mr-1 p-0.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
}

// Status Badge with built-in status indicators
interface StatusBadgeProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'pending';
  label?: string;
  showDot?: boolean;
}

const statusConfig = {
  online: { variant: 'success' as const, label: 'Online', dotColor: 'bg-green-400' },
  offline: { variant: 'default' as const, label: 'Offline', dotColor: 'bg-gray-400' },
  away: { variant: 'warning' as const, label: 'Away', dotColor: 'bg-yellow-400' },
  busy: { variant: 'error' as const, label: 'Busy', dotColor: 'bg-red-400' },
  pending: { variant: 'info' as const, label: 'Pending', dotColor: 'bg-blue-400' },
};

export function StatusBadge({ status, label, showDot = true }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant} dot={showDot}>
      {label || config.label}
    </Badge>
  );
}

// Counter Badge for notifications
interface CounterBadgeProps {
  count: number;
  max?: number;
  variant?: 'default' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export function CounterBadge({ count, max = 99, variant = 'error', size = 'sm' }: CounterBadgeProps) {
  const displayCount = count > max ? `${max}+` : count.toString();
  
  if (count === 0) return null;

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[1.25rem] rounded-full font-bold
        ${size === 'sm' ? 'h-5 px-1.5 text-xs' : 'h-6 px-2 text-sm'}
        ${variant === 'error' ? 'bg-red-500 text-white' : 
          variant === 'info' ? 'bg-blue-500 text-white' : 
          'bg-gray-600 text-gray-200'}`}
    >
      {displayCount}
    </span>
  );
}

// Badge Group for displaying multiple badges
interface BadgeGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function BadgeGroup({ children, max, size = 'md' }: BadgeGroupProps) {
  const childArray = React.Children.toArray(children);
  const displayedChildren = max ? childArray.slice(0, max) : childArray;
  const remaining = max ? childArray.length - max : 0;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayedChildren}
      {remaining > 0 && (
        <Badge variant="default" size={size}>
          +{remaining} more
        </Badge>
      )}
    </div>
  );
}
