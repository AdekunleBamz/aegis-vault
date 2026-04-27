'use client';

/**
 * @file Error Boundary component for graceful error handling
 * 
 * Provides a fallback UI when child components throw errors,
 * preventing the entire application from crashing.
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component that catches JavaScript errors in child components.
 * Displays a fallback UI and logs error information.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center min-h-[400px] p-8 rounded-3xl bg-destructive/5 border border-destructive/20"
        >
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">Something went wrong</h2>

          <p className="text-sm text-muted-foreground text-center mb-6 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={this.handleReset}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Try Again
            </Button>

            <Button
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 w-full max-w-lg">
              <summary className="text-xs font-bold uppercase tracking-widest text-muted-foreground cursor-pointer">
                Error Details
              </summary>
              <pre className="mt-2 p-4 rounded-xl bg-muted/50 text-xs overflow-auto max-h-48">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}