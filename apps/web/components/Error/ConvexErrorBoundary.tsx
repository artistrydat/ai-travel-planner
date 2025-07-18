"use client";

import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface ConvexErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const ConvexErrorFallback: React.FC<ConvexErrorFallbackProps> = ({ error, resetError }) => {
  const isConvexError = error.message.includes('convex') || 
                       error.message.includes('CONVEX') ||
                       error.stack?.includes('convex');
  
  const isDevelopmentError = error.message.includes('NEXT_PUBLIC_CONVEX_URL') ||
                            error.message.includes('ConvexReactClient');

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-3">
      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-3 max-w-sm w-full">
        <h2 className="text-yellow-400 text-base font-semibold mb-2 flex items-center gap-1">
          ⚠️ Connection Issue
        </h2>
        
        {isDevelopmentError && (
          <div className="text-yellow-300 mb-2">
            <p className="font-medium text-xs">Configuration Error:</p>
            <p className="text-xs opacity-90">Convex URL not configured properly.</p>
          </div>
        )}
        
        {isConvexError && (
          <div className="text-yellow-300 mb-2">
            <p className="font-medium text-xs">Backend Error:</p>
            <p className="text-xs opacity-90">Unable to connect to backend.</p>
          </div>
        )}
        
        <div className="text-yellow-300 mb-3">
          <p className="font-medium text-xs mb-1">Error Details:</p>
          <p className="text-xs break-words bg-black/30 p-2 rounded leading-relaxed">
            {error.message}
          </p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={resetError}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded transition-colors text-xs font-medium"
          >
            Retry Connection
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded transition-colors text-xs font-medium"
          >
            Reload App
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConvexErrorBoundaryProps {
  children: React.ReactNode;
}

export const ConvexErrorBoundary: React.FC<ConvexErrorBoundaryProps> = ({ children }) => {
  return (
    <ErrorBoundary fallback={ConvexErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};
