import React from 'react';

/**
 * PR #16: Placeholder states with animations
 * Empty state component with animations
 */
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  animated?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  animated = true,
}) => (
  <div className={`flex flex-col items-center justify-center py-12 px-4 ${animated ? 'animate-fade-in' : ''}`}>
    <div className="text-6xl mb-4 opacity-20">{icon}</div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    {description && <p className="text-gray-400 text-center mb-6 max-w-sm">{description}</p>}
    {action && <div>{action}</div>}
  </div>
);

/**
 * PR #17: Loading state for buttons with icons
 */
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, loadingText = 'Loading...', icon, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg
        bg-blue-500 hover:bg-blue-600 text-white font-medium
        transition-all disabled:opacity-50 disabled:cursor-not-allowed
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {loadingText}
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  )
);

LoadingButton.displayName = 'LoadingButton';

/**
 * PR #18: Stream-like loading for lists
 */
export const StreamLoader: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, idx) => (
      <div key={idx} className="h-16 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg animate-pulse" />
    ))}
  </div>
);
