// app/components/Sidebar.js
'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { id: 'chat', label: 'AI Chat', icon: '💬', description: 'Ask questions & get answers' },
  { id: 'mock-interview', label: 'Mock Interview', icon: '🎯', description: 'Practice timed sessions' },
  { id: 'feedback', label: 'AI Feedback', icon: '📝', description: 'Get analysis & scores' },
  { id: 'progress', label: 'Progress Dashboard', icon: '📊', description: 'Track your journey' },
  { id: 'scheduler', label: 'Interview Scheduler', icon: '📅', description: 'Plan your interviews' },
  { id: 'company-prep', label: 'Company Prep', icon: '🏢', description: 'FAANG deep dives' }
];

const Sidebar = ({ activeTab, onTabChange }) => {
  const { darkMode } = useTheme();

  return (
    <div 
      className={`w-full sm:w-72 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} p-4 flex flex-col h-full`}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Interview Guide</h2>
        <p className="text-sm opacity-70">
          Your complete interview preparation platform
        </p>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${
                  activeTab === item.id
                    ? `${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                    : `${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className={`text-xs ${activeTab === item.id ? 'text-blue-100' : 'opacity-60'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
        <p className="text-sm font-medium mb-1">🚀 Pro Tip</p>
        <p className="text-xs opacity-70">
          Practice daily for 30 minutes to see significant improvement in your interview skills!
        </p>
      </div>
    </div>
  );
};

export default Sidebar;