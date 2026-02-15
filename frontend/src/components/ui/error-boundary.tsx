import React from 'react';

/**
 * PR #25: Error boundary UI improvements
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-6 rounded-lg bg-red-500/10 border border-red-500/30">
            <h2 className="text-red-400 font-semibold mb-2">Something went wrong</h2>
            <p className="text-red-300 text-sm mb-4">{this.state.error?.message}</p>
            <button
              onClick={this.reset}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * PR #32: Semantic HTML improvements
 */
export const SemanticSection: React.FC<{
  title: string;
  children: React.ReactNode;
  ariaLabel?: string;
}> = ({ title, children, ariaLabel }) => (
  <section aria-label={ariaLabel || title} className="space-y-4">
    <h2 className="text-xl font-semibold text-white">{title}</h2>
    {children}
  </section>
);

/**
 * PR #33: Form field associations
 */
export const AssociatedFormField: React.FC<{
  fieldId: string;
  label: string;
  hint?: string;
  children: React.ReactElement;
}> = ({ fieldId, label, hint, children }) => (
  <fieldset>
    <label htmlFor={fieldId} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    {React.cloneElement(children, { id: fieldId })}
    {hint && (
      <p id={`${fieldId}-hint`} className="mt-1 text-xs text-gray-400">
        {hint}
      </p>
    )}
  </fieldset>
);
