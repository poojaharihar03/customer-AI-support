'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const companies = {
  google: {
    name: 'Google',
    logo: '🔍',
    color: 'bg-blue-500',
    overview: 'Known for rigorous technical interviews focusing on algorithms, data structures, and system design.',
    culture: 'Innovation-driven, data-focused decision making, emphasis on impact and scalability.',
    interviewProcess: [
      { round: 'Recruiter Screen', duration: '30 min', description: 'Initial fit assessment and role discussion' },
      { round: 'Technical Phone Screen', duration: '45 min', description: 'Coding on Google Docs, 1-2 algorithm problems' },
      { round: 'Onsite - Coding', duration: '45 min x 2', description: 'Algorithm and data structure problems' },
      { round: 'Onsite - System Design', duration: '45 min', description: 'Design scalable distributed systems' },
      { round: 'Onsite - Behavioral', duration: '45 min', description: 'Googleyness and leadership assessment' }
    ],
    commonQuestions: [
      { category: 'Coding', question: 'Implement LRU Cache', difficulty: 'Medium' },
      { category: 'Coding', question: 'Find median of two sorted arrays', difficulty: 'Hard' },
      { category: 'System Design', question: 'Design Google Search', difficulty: 'Hard' },
      { category: 'System Design', question: 'Design YouTube', difficulty: 'Hard' },
      { category: 'Behavioral', question: 'Tell me about a time you showed initiative', difficulty: 'Medium' }
    ],
    tips: [
      'Practice on Google Docs without IDE features',
      'Focus on communication while coding',
      'Prepare for ambiguous problems',
      'Study distributed systems thoroughly',
      'Know Google products and recent innovations'
    ],
    resources: [
      { name: 'LeetCode Google Tagged Problems', url: '#' },
      { name: 'System Design Primer', url: '#' },
      { name: 'Cracking the Coding Interview', url: '#' }
    ]
  },
  meta: {
    name: 'Meta (Facebook)',
    logo: '👤',
    color: 'bg-blue-600',
    overview: 'Fast-paced interviews with emphasis on coding speed, product sense, and collaboration.',
    culture: 'Move fast, bold thinking, focus on impact, open communication.',
    interviewProcess: [
      { round: 'Recruiter Screen', duration: '30 min', description: 'Background and motivation discussion' },
      { round: 'Technical Screen', duration: '45 min', description: '2 coding problems on CoderPad' },
      { round: 'Onsite - Coding', duration: '45 min x 2', description: 'Algorithm problems with follow-ups' },
      { round: 'Onsite - System Design', duration: '45 min', description: 'Product-focused system design' },
      { round: 'Onsite - Behavioral', duration: '45 min', description: 'Core values and leadership' }
    ],
    commonQuestions: [
      { category: 'Coding', question: 'Valid Parentheses variations', difficulty: 'Medium' },
      { category: 'Coding', question: 'Binary tree problems', difficulty: 'Medium' },
      { category: 'System Design', question: 'Design Facebook News Feed', difficulty: 'Hard' },
      { category: 'System Design', question: 'Design Instagram', difficulty: 'Hard' },
      { category: 'Behavioral', question: 'Describe a project you drove from start to finish', difficulty: 'Medium' }
    ],
    tips: [
      'Speed is important - practice timing yourself',
      'Understand Meta\'s core values deeply',
      'Focus on product metrics and impact',
      'Practice explaining trade-offs clearly',
      'Be ready for rapid follow-up questions'
    ],
    resources: [
      { name: 'LeetCode Meta Tagged Problems', url: '#' },
      { name: 'Meta Careers Blog', url: '#' },
      { name: 'Product Design Interview Guide', url: '#' }
    ]
  },
  amazon: {
    name: 'Amazon',
    logo: '📦',
    color: 'bg-orange-500',
    overview: 'Leadership Principles-driven interviews with strong emphasis on behavioral questions.',
    culture: 'Customer obsession, ownership, bias for action, frugality, earn trust.',
    interviewProcess: [
      { round: 'Online Assessment', duration: '90 min', description: 'Coding problems + work simulation' },
      { round: 'Phone Screen', duration: '45-60 min', description: 'Coding + LP behavioral questions' },
      { round: 'Onsite - Coding', duration: '45 min x 2', description: 'Algorithm problems with LP tie-ins' },
      { round: 'Onsite - System Design', duration: '45 min', description: 'Scalable system architecture' },
      { round: 'Onsite - Bar Raiser', duration: '45 min', description: 'Deep dive on Leadership Principles' }
    ],
    commonQuestions: [
      { category: 'Coding', question: 'Two Sum and variations', difficulty: 'Easy' },
      { category: 'Coding', question: 'Design a parking lot', difficulty: 'Medium' },
      { category: 'System Design', question: 'Design Amazon product page', difficulty: 'Hard' },
      { category: 'LP', question: 'Tell me about a time you disagreed with your manager', difficulty: 'Medium' },
      { category: 'LP', question: 'Describe when you went above and beyond', difficulty: 'Medium' }
    ],
    tips: [
      'Memorize all 16 Leadership Principles',
      'Prepare 2-3 stories per LP using STAR method',
      'Quantify your impact with metrics',
      'Show customer obsession in examples',
      'Be ready for deep follow-up questions'
    ],
    resources: [
      { name: 'Amazon Leadership Principles Guide', url: '#' },
      { name: 'LeetCode Amazon Tagged Problems', url: '#' },
      { name: 'STAR Method Workshop', url: '#' }
    ]
  },
  apple: {
    name: 'Apple',
    logo: '🍎',
    color: 'bg-gray-800',
    overview: 'Design-focused interviews emphasizing attention to detail and excellence.',
    culture: 'Design excellence, secrecy, perfectionism, user experience focus.',
    interviewProcess: [
      { round: 'Recruiter Screen', duration: '30 min', description: 'Initial assessment and role fit' },
      { round: 'Technical Phone Screen', duration: '60 min', description: 'Deep dive on specific domain' },
      { round: 'Onsite - Technical', duration: '45 min x 3', description: 'Domain-specific technical depth' },
      { round: 'Onsite - Design', duration: '45 min', description: 'System or product design' },
      { round: 'Onsite - Cross-functional', duration: '45 min', description: 'Collaboration and communication' }
    ],
    commonQuestions: [
      { category: 'Coding', question: 'String manipulation problems', difficulty: 'Medium' },
      { category: 'Coding', question: 'Memory management questions', difficulty: 'Hard' },
      { category: 'System Design', question: 'Design iCloud sync', difficulty: 'Hard' },
      { category: 'Design', question: 'Critique an Apple product', difficulty: 'Medium' },
      { category: 'Behavioral', question: 'Why Apple? What excites you about our products?', difficulty: 'Medium' }
    ],
    tips: [
      'Show genuine passion for Apple products',
      'Focus on quality over quantity',
      'Be prepared to discuss design decisions',
      'Understand Apple\'s ecosystem deeply',
      'Emphasize attention to detail in your work'
    ],
    resources: [
      { name: 'Apple Developer Documentation', url: '#' },
      { name: 'iOS Development Best Practices', url: '#' },
      { name: 'Human Interface Guidelines', url: '#' }
    ]
  },
  netflix: {
    name: 'Netflix',
    logo: '🎬',
    color: 'bg-red-600',
    overview: 'Culture-fit focused interviews emphasizing autonomy and high performance.',
    culture: 'Freedom and responsibility, context not control, highly aligned, loosely coupled.',
    interviewProcess: [
      { round: 'Recruiter Screen', duration: '30 min', description: 'Culture fit and motivation' },
      { round: 'Hiring Manager Call', duration: '45 min', description: 'Role discussion and expectations' },
      { round: 'Technical Screens', duration: '60 min x 2', description: 'Domain expertise assessment' },
      { round: 'Onsite - Panel', duration: '4-5 hours', description: 'Multiple interviewers, deep dives' },
      { round: 'Reference Checks', duration: '-', description: 'Thorough background verification' }
    ],
    commonQuestions: [
      { category: 'Coding', question: 'Streaming and data processing', difficulty: 'Hard' },
      { category: 'System Design', question: 'Design Netflix streaming service', difficulty: 'Hard' },
      { category: 'Culture', question: 'How do you handle disagreement?', difficulty: 'Medium' },
      { category: 'Culture', question: 'Tell me about receiving difficult feedback', difficulty: 'Medium' },
      { category: 'Technical', question: 'How would you improve Netflix?', difficulty: 'Medium' }
    ],
    tips: [
      'Read the Netflix Culture Deck thoroughly',
      'Be prepared to give and receive candid feedback',
      'Show you can operate with high autonomy',
      'Demonstrate strong judgment and ownership',
      'Be genuine about your strengths and weaknesses'
    ],
    resources: [
      { name: 'Netflix Culture Deck', url: '#' },
      { name: 'Netflix Tech Blog', url: '#' },
      { name: 'Distributed Systems Course', url: '#' }
    ]
  },
  microsoft: {
    name: 'Microsoft',
    logo: '🪟',
    color: 'bg-blue-700',
    overview: 'Balanced interviews testing technical skills, problem-solving, and growth mindset.',
    culture: 'Growth mindset, learn-it-all vs know-it-all, inclusion, making others successful.',
    interviewProcess: [
      { round: 'Recruiter Screen', duration: '30 min', description: 'Initial assessment' },
      { round: 'Technical Phone Screen', duration: '45 min', description: 'Coding and problem solving' },
      { round: 'Onsite - Coding', duration: '45 min x 2', description: 'Algorithm and data structures' },
      { round: 'Onsite - Design', duration: '45 min', description: 'System architecture' },
      { round: 'As Appropriate', duration: '45 min', description: 'Final decision maker interview' }
    ],
    commonQuestions: [
      { category: 'Coding', question: 'Array and string manipulation', difficulty: 'Medium' },
      { category: 'Coding', question: 'Graph traversal problems', difficulty: 'Medium' },
      { category: 'System Design', question: 'Design Microsoft Teams', difficulty: 'Hard' },
      { category: 'System Design', question: 'Design Azure cloud service', difficulty: 'Hard' },
      { category: 'Behavioral', question: 'Describe how you\'ve grown from failure', difficulty: 'Medium' }
    ],
    tips: [
      'Emphasize growth mindset in your examples',
      'Show collaborative problem-solving',
      'Be familiar with Microsoft products',
      'Practice whiteboard coding',
      'Prepare questions about the team and mission'
    ],
    resources: [
      { name: 'LeetCode Microsoft Tagged', url: '#' },
      { name: 'Microsoft Learn Platform', url: '#' },
      { name: 'Azure Architecture Center', url: '#' }
    ]
  }
};

const CompanyPrep = () => {
  const { darkMode } = useTheme();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [completedTopics, setCompletedTopics] = useState({});

  const toggleTopic = (companyId, topicIndex) => {
    setCompletedTopics(prev => ({
      ...prev,
      [`${companyId}-${topicIndex}`]: !prev[`${companyId}-${topicIndex}`]
    }));
  };

  const getCompanyProgress = (companyId) => {
    const company = companies[companyId];
    const totalItems = company.tips.length + company.commonQuestions.length;
    let completed = 0;
    
    company.tips.forEach((_, idx) => {
      if (completedTopics[`${companyId}-tip-${idx}`]) completed++;
    });
    company.commonQuestions.forEach((_, idx) => {
      if (completedTopics[`${companyId}-q-${idx}`]) completed++;
    });
    
    return Math.round((completed / totalItems) * 100);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (!selectedCompany) {
    return (
      <div className={`w-full max-w-6xl mx-auto p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
        <h2 className="text-2xl font-bold mb-2 text-center">Company-Specific Preparation</h2>
        <p className="text-center opacity-70 mb-8">Deep dive modules for top tech companies</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(companies).map(([id, company]) => {
            const progress = getCompanyProgress(id);
            
            return (
              <div
                key={id}
                onClick={() => setSelectedCompany(id)}
                className={`p-6 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
                } border-2 border-transparent hover:border-blue-500`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{company.logo}</span>
                  <div>
                    <h3 className="text-xl font-bold">{company.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${company.color}`}>
                      FAANG
                    </span>
                  </div>
                </div>
                
                <p className="text-sm opacity-70 mb-4 line-clamp-2">{company.overview}</p>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Prep Progress</span>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="mt-4 flex justify-between text-sm opacity-70">
                  <span>{company.interviewProcess.length} rounds</span>
                  <span>{company.commonQuestions.length} questions</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const company = companies[selectedCompany];

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedCompany(null)}
          className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Companies
        </button>
        <span className="text-sm opacity-70">Progress: {getCompanyProgress(selectedCompany)}%</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <span className="text-5xl">{company.logo}</span>
        <div>
          <h2 className="text-2xl font-bold">{company.name}</h2>
          <p className="opacity-70">{company.overview}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {['overview', 'process', 'questions', 'tips', 'resources'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium capitalize whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-blue-500 text-blue-500'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-semibold mb-3">🏢 Company Culture</h3>
            <p>{company.culture}</p>
          </div>

          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className="font-semibold mb-3">📊 Interview Overview</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-500">{company.interviewProcess.length}</p>
                <p className="text-sm opacity-70">Interview Rounds</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-500">{company.commonQuestions.length}</p>
                <p className="text-sm opacity-70">Sample Questions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-500">{company.tips.length}</p>
                <p className="text-sm opacity-70">Pro Tips</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'process' && (
        <div className="space-y-4">
          {company.interviewProcess.map((round, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${company.color}`}>
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{round.round}</h4>
                    <span className="text-sm opacity-70">{round.duration}</span>
                  </div>
                  <p className="text-sm opacity-80 mt-1">{round.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'questions' && (
        <div className="space-y-4">
          {company.commonQuestions.map((q, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={completedTopics[`${selectedCompany}-q-${idx}`] || false}
                    onChange={() => toggleTopic(selectedCompany, `q-${idx}`)}
                    className="rounded"
                  />
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${getDifficultyColor(q.difficulty)}`}>
                    {q.difficulty}
                  </span>
                  <span className="text-sm opacity-70">{q.category}</span>
                </div>
              </div>
              <p className={`font-medium ${completedTopics[`${selectedCompany}-q-${idx}`] ? 'line-through opacity-50' : ''}`}>
                {q.question}
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="space-y-3">
          {company.tips.map((tip, idx) => (
            <label
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <input
                type="checkbox"
                checked={completedTopics[`${selectedCompany}-tip-${idx}`] || false}
                onChange={() => toggleTopic(selectedCompany, `tip-${idx}`)}
                className="mt-1 rounded"
              />
              <span className={completedTopics[`${selectedCompany}-tip-${idx}`] ? 'line-through opacity-50' : ''}>
                {tip}
              </span>
            </label>
          ))}
        </div>
      )}

      {activeTab === 'resources' && (
        <div className="grid md:grid-cols-2 gap-4">
          {company.resources.map((resource, idx) => (
            <a
              key={idx}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 rounded-lg flex items-center gap-3 transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-medium">{resource.name}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyPrep;
