"use client";

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error);
    console.error('Error info:', errorInfo);
    
    // Log to console for debugging in Telegram
    console.error('Stack trace:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { error } = this.state;
      
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={error!} resetError={this.resetError} />;
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-3">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-3 max-w-sm w-full">
            <h2 className="text-red-400 text-base font-semibold mb-2 flex items-center gap-1">
              🚨 Application Error
            </h2>
            <div className="text-red-300 mb-2">
              <p className="font-medium text-xs mb-1">Error:</p>
              <p className="text-xs break-words bg-black/30 p-2 rounded">{error?.message || 'Unknown error'}</p>
            </div>
            <div className="text-red-300 mb-3">
              <p className="font-medium text-xs mb-1">Stack:</p>
              <pre className="text-xs bg-black/30 p-2 rounded overflow-auto max-h-20 leading-tight">
                {error?.stack || 'No stack trace available'}
              </pre>
            </div>
            <button
              onClick={this.resetError}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded transition-colors text-xs font-medium w-full"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
