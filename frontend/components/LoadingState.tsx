import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
      }}
    >
      <div className="text-center">
        <div 
          className="animate-spin rounded-full h-6 w-6 border-2 border-transparent mx-auto mb-3"
          style={{
            borderTopColor: 'var(--tg-theme-button-color, #3b82f6)',
            borderRightColor: 'var(--tg-theme-button-color, #3b82f6)',
          }}
        ></div>
        <p 
          className="text-xs"
          style={{ color: 'var(--tg-theme-hint-color, #6b7280)' }}
        >
          Loading...
        </p>
      </div>
    </div>
  );
};

export default LoadingState;
