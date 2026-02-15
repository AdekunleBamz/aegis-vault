import React from 'react';

/**
 * PR #21: Error recovery suggestions
 */
interface ErrorRecoveryProps {
  errorCode?: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({ errorCode, onRetry, onBack }) => {
  const suggestions: Record<string, string[]> = {
    network: [
      'Check your internet connection',
      'Try again in a moment',
      'Contact support if the issue persists',
    ],
    auth: [
      'Reconnect your wallet',
      'Check wallet permissions',
      'Refresh the page and try again',
    ],
    transaction: [
      'Check transaction status',
      'Verify gas fees',
      'Try a smaller amount',
    ],
  };

  const getSuggestions = () => suggestions[errorCode || 'network'] || suggestions.network;

  return (
    <div className="space-y-4">
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-300 font-medium mb-3">Here's what you can try:</h4>
        <ul className="space-y-2">
          {getSuggestions().map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2 text-blue-200 text-sm">
              <span className="mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Try Again
          </button>
        )}
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * PR #22: Inline error with recovery
 */
interface InlineErrorProps {
  error: string;
  recovery?: React.ReactNode;
  icon?: React.ReactNode;
}

export const InlineError: React.FC<InlineErrorProps> = ({ error, recovery, icon }) => (
  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
    <div className="flex items-start gap-2">
      {icon && <div className="text-red-400 mt-0.5">{icon}</div>}
      <div className="flex-1">
        <p className="text-red-400 text-sm font-medium">{error}</p>
        {recovery && <div className="mt-2">{recovery}</div>}
      </div>
    </div>
  </div>
);

/**
 * PR #24: Retry button component
 */
interface RetryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  retryCount?: number;
  maxRetries?: number;
}

export const RetryButton = React.forwardRef<HTMLButtonElement, RetryButtonProps>(
  ({ loading = false, retryCount = 0, maxRetries = 3, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading || retryCount >= maxRetries}
      className={`
        px-4 py-2 rounded-lg font-medium transition-colors
        ${
          retryCount >= maxRetries
            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
            : 'bg-orange-500 hover:bg-orange-600 text-white'
        }
      `}
      {...props}
    >
      {loading ? 'Retrying...' : `Retry${retryCount > 0 ? ` (${retryCount}/${maxRetries})` : ''}`}
    </button>
  )
);

RetryButton.displayName = 'RetryButton';
