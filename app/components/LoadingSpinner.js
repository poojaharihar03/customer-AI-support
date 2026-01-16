'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const { darkMode } = useTheme();
  
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-sm opacity-70">{text}</p>}
    </div>
  );
};

const LoadingCard = () => {
  const { darkMode } = useTheme();
  
  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} animate-pulse`}>
      <div className={`h-4 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded w-3/4 mb-3`}></div>
      <div className={`h-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded w-1/2 mb-2`}></div>
      <div className={`h-3 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded w-2/3`}></div>
    </div>
  );
};

const LoadingGrid = ({ count = 6 }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <LoadingCard key={i} />
      ))}
    </div>
  );
};

export { LoadingSpinner, LoadingCard, LoadingGrid };
export default LoadingSpinner;
