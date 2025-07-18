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
      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 max-w-sm w-full">
        <h2 className="text-yellow-400 text-lg font-bold mb-3">
          ⚠️ Backend Connection Issue
        </h2>
        
        {isDevelopmentError && (
          <div className="text-yellow-300 mb-3">
            <p className="font-semibold text-sm">Configuration Error:</p>
            <p className="text-xs">The Convex URL might not be properly configured.</p>
          </div>
        )}
        
        {isConvexError && (
          <div className="text-yellow-300 mb-3">
            <p className="font-semibold text-sm">Backend Error:</p>
            <p className="text-xs">Unable to connect to the backend services.</p>
          </div>
        )}
        
        <div className="text-yellow-300 mb-3">
          <p className="font-semibold text-sm">Error Details:</p>
          <p className="text-xs break-words bg-black/30 p-2 rounded">
            {error.message}
          </p>
        </div>
        
        <div className="space-y-1.5">
          <button
            onClick={resetError}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded transition-colors text-sm"
          >
            Retry Connection
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded transition-colors text-sm"
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
