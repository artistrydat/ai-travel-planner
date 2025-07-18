import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="max-w-sm mx-auto p-3 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-3 text-sm">{error}</p>
        <button
          onClick={onRetry}
          className="bg-indigo-500 text-white px-3 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
