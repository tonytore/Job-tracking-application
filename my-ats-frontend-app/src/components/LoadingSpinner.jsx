// src/components/LoadingSpinner.jsx (example)
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;