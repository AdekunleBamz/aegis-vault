import React from 'react';

/**
 * PR #19: Improved error state design
 * Advanced error display component
 */
interface ErrorStateProps {
  error: string | Error | null;
  title?: string;
  action?: React.ReactNode;
  severity?: 'error' | 'warning' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = 'Something went wrong',
  action,
  severity = 'error',
  dismissible = false,
  onDismiss,
}) => {
  if (!error) return null;

  const bgColors = {
    error: 'bg-red-500/10 border-red-500/30',
    warning: 'bg-yellow-500/10 border-yellow-500/30',
    info: 'bg-blue-500/10 border-blue-500/30',
  };

  const textColors = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
  };

  return (
    <div className={`p-4 rounded-lg border ${bgColors[severity]}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${textColors[severity]}`}>
          {severity === 'error' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${textColors[severity]}`}>{title}</h3>
          <p className={`text-sm mt-1 ${textColors[severity]} opacity-80`}>
            {error instanceof Error ? error.message : String(error)}
          </p>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {dismissible && (
          <button onClick={onDismiss} className={`flex-shrink-0 ${textColors[severity]} hover:opacity-70`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * PR #20: Success notification animations
 */
interface SuccessMessageProps {
  message: string;
  autoHide?: boolean;
  duration?: number;
  onHide?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  autoHide = true,
  duration = 3000,
  onHide,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoHide && isVisible) {
      const timeout = setTimeout(() => {
        setIsVisible(false);
        onHide?.();
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [autoHide, duration, isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div className="animate-slide-up p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 flex items-center gap-2">
      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
};
