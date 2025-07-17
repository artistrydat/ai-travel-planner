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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-yellow-400 text-xl font-bold mb-4">
          ⚠️ Backend Connection Issue
        </h2>
        
        {isDevelopmentError && (
          <div className="text-yellow-300 mb-4">
            <p className="font-semibold">Configuration Error:</p>
            <p className="text-sm">The Convex URL might not be properly configured.</p>
          </div>
        )}
        
        {isConvexError && (
          <div className="text-yellow-300 mb-4">
            <p className="font-semibold">Backend Error:</p>
            <p className="text-sm">Unable to connect to the backend services.</p>
          </div>
        )}
        
        <div className="text-yellow-300 mb-4">
          <p className="font-semibold">Error Details:</p>
          <p className="text-sm break-words bg-black/30 p-2 rounded">
            {error.message}
          </p>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={resetError}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
          >
            Retry Connection
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
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
