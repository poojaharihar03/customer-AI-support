'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry = null,
  type = 'error' // 'error', 'warning', 'info'
}) => {
  const { darkMode } = useTheme();
  
  const typeStyles = {
    error: {
      bg: darkMode ? 'bg-red-900/30' : 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-600 dark:text-red-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      bg: darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50',
      border: 'border-yellow-500',
      text: 'text-yellow-600 dark:text-yellow-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      bg: darkMode ? 'bg-blue-900/30' : 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const style = typeStyles[type];

  return (
    <div className={`p-4 rounded-lg border-l-4 ${style.bg} ${style.border} flex items-start gap-3`}>
      <span className={style.text}>{style.icon}</span>
      <div className="flex-1">
        <p className={`font-medium ${style.text}`}>{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-blue-500 hover:text-blue-600 hover:underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
