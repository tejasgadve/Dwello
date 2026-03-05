import React from 'react';

const LoadingSpinner = ({ fullScreen = true, size = 'md' }) => {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };
  const spinner = (
    <div className={`${sizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
  );
  if (!fullScreen) return spinner;
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        {spinner}
        <p className="mt-4 text-sm text-gray-500 font-body">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
