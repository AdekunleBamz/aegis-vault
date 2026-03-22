'use client';

import React from 'react';

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-3xl border border-destructive/20 bg-destructive/10 text-center">
          <h3 className="text-lg font-bold text-destructive">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-2">Please try refreshing the page.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
