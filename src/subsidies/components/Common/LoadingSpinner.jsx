// src/components/Common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'large', text = 'Loading...', className = '' }) => {
  const sizes = {
    small: 'h-6 w-6',
    medium: 'h-12 w-12',
    large: 'h-16 w-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 ${className}`}>
      <div className={`loading-spinner ${sizes[size]}`}></div>
      {text && (
        <p className="mt-4 text-gray-600 text-lg font-medium">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;