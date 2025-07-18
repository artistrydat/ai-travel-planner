
import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-500"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loading;
