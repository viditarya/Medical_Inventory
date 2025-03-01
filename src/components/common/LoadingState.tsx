import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      <p className="ml-3 text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default LoadingState;