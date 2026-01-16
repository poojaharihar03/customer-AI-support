
// app/page.js
'use client';

import React, { useState } from 'react';
import Sidebar from './components/sidebar';
import Chat from './components/Chat';
import MockInterview from './components/MockInterview';
import FeedbackSystem from './components/FeedbackSystem';
import ProgressDashboard from './components/ProgressDashboard';
import InterviewScheduler from './components/InterviewScheduler';
import CompanyPrep from './components/CompanyPrep';
import { useTheme } from './context/ThemeContext';

const pageInfo = {
  'chat': {
    title: 'AI Interview Assistant',
    subtitle: 'Ask any questions about interviews and get instant, helpful answers!'
  },
  'mock-interview': {
    title: 'Mock Interview Mode',
    subtitle: 'Practice with timed sessions across behavioral, technical, and system design rounds'
  },
  'feedback': {
    title: 'AI Feedback System',
    subtitle: 'Get AI-powered analysis of your responses with detailed scoring'
  },
  'progress': {
    title: 'Progress Dashboard',
    subtitle: 'Track your improvement over time and identify areas to focus on'
  },
  'scheduler': {
    title: 'Interview Scheduler',
    subtitle: 'Plan and prepare for your upcoming interviews with built-in prep tasks'
  },
  'company-prep': {
    title: 'Company-Specific Preparation',
    subtitle: 'Deep dive into FAANG and top company interview patterns'
  }
};

export default function Home() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('chat');
  const [interviewResults, setInterviewResults] = useState([]);

  const handleInterviewComplete = (results) => {
    setInterviewResults(prev => [results, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <Chat />;
      case 'mock-interview':
        return <MockInterview onComplete={handleInterviewComplete} />;
      case 'feedback':
        return <FeedbackSystem interviewData={interviewResults} />;
      case 'progress':
        return <ProgressDashboard />;
      case 'scheduler':
        return <InterviewScheduler />;
      case 'company-prep':
        return <CompanyPrep />;
      default:
        return <Chat />;
    }
  };

  const currentPage = pageInfo[activeTab] || pageInfo['chat'];

  return (
    <div className={`flex flex-col sm:flex-row min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'} transition-colors duration-200`}>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold">{currentPage.title}</h1>
          <p className="text-lg mt-2 opacity-70">{currentPage.subtitle}</p>
        </div>
        <div className="flex-grow flex items-start justify-center">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}