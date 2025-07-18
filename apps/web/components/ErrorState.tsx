import React from 'react';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="max-w-sm mx-auto p-4 min-h-screen flex items-center justify-center">
      <div className="text-center w-full">
        <div className="text-red-500 text-3xl mb-2">⚠️</div>
        <h2 className="text-base font-semibold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-4 text-xs leading-relaxed px-2">{error}</p>
        <button
          onClick={onRetry}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium w-full max-w-[200px]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
