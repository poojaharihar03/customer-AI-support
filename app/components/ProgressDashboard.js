'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

// Simulated data for demonstration
const generateMockData = () => {
  const categories = ['behavioral', 'technical', 'systemDesign'];
  const lastMonths = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    lastMonths.push(date.toLocaleDateString('en-US', { month: 'short' }));
  }

  return {
    overallProgress: {
      totalSessions: 24,
      totalHours: 18,
      averageScore: 72,
      streak: 5
    },
    monthlyScores: lastMonths.map((month, idx) => ({
      month,
      behavioral: 50 + idx * 5 + Math.floor(Math.random() * 10),
      technical: 45 + idx * 6 + Math.floor(Math.random() * 10),
      systemDesign: 40 + idx * 7 + Math.floor(Math.random() * 10)
    })),
    recentSessions: [
      { id: 1, type: 'Technical', date: '2026-01-15', score: 78, duration: 45 },
      { id: 2, type: 'Behavioral', date: '2026-01-14', score: 85, duration: 30 },
      { id: 3, type: 'System Design', date: '2026-01-12', score: 65, duration: 50 },
      { id: 4, type: 'Technical', date: '2026-01-10', score: 72, duration: 40 },
      { id: 5, type: 'Behavioral', date: '2026-01-08', score: 88, duration: 25 }
    ],
    skillBreakdown: {
      'Problem Solving': 75,
      'Communication': 82,
      'Technical Knowledge': 68,
      'System Design': 62,
      'Code Quality': 70,
      'Time Management': 78
    },
    weaknesses: [
      { area: 'System Design Scalability', score: 55, trend: 'improving' },
      { area: 'Database Optimization', score: 58, trend: 'stable' },
      { area: 'Distributed Systems', score: 52, trend: 'improving' }
    ],
    strengths: [
      { area: 'Communication Skills', score: 88, trend: 'stable' },
      { area: 'Problem Decomposition', score: 85, trend: 'improving' },
      { area: 'Code Clarity', score: 82, trend: 'improving' }
    ]
  };
};

const ProgressDashboard = () => {
  const { darkMode } = useTheme();
  const [data, setData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('6m');

  useEffect(() => {
    // Simulate loading data
    setData(generateMockData());
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getTrendIcon = (trend) => {
    if (trend === 'improving') return '↑';
    if (trend === 'declining') return '↓';
    return '→';
  };

  const getTrendColor = (trend) => {
    if (trend === 'improving') return 'text-green-500';
    if (trend === 'declining') return 'text-red-500';
    return 'text-yellow-500';
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Progress Dashboard</h2>
          <p className="opacity-70">Track your interview preparation journey</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${
            darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
          }`}
        >
          <option value="1m">Last Month</option>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <p className="text-sm opacity-70">Total Sessions</p>
          <p className="text-3xl font-bold text-blue-500">{data.overallProgress.totalSessions}</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
          <p className="text-sm opacity-70">Practice Hours</p>
          <p className="text-3xl font-bold text-green-500">{data.overallProgress.totalHours}h</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
          <p className="text-sm opacity-70">Average Score</p>
          <p className="text-3xl font-bold text-purple-500">{data.overallProgress.averageScore}%</p>
        </div>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
          <p className="text-sm opacity-70">Day Streak 🔥</p>
          <p className="text-3xl font-bold text-orange-500">{data.overallProgress.streak}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Score Chart */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="font-semibold mb-4">Score Progress</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.monthlyScores.map((item, idx) => {
              const avgScore = Math.round((item.behavioral + item.technical + item.systemDesign) / 3);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center gap-1 mb-2">
                    <div
                      className="w-full bg-blue-500 rounded-t transition-all duration-500"
                      style={{ height: `${item.behavioral * 1.5}px` }}
                      title={`Behavioral: ${item.behavioral}%`}
                    ></div>
                    <div
                      className="w-full bg-green-500 rounded transition-all duration-500"
                      style={{ height: `${item.technical * 1.5}px` }}
                      title={`Technical: ${item.technical}%`}
                    ></div>
                    <div
                      className="w-full bg-purple-500 rounded-b transition-all duration-500"
                      style={{ height: `${item.systemDesign * 1.5}px` }}
                      title={`System Design: ${item.systemDesign}%`}
                    ></div>
                  </div>
                  <span className="text-xs opacity-70">{item.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm">Behavioral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-sm">Technical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-sm">System Design</span>
            </div>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="font-semibold mb-4">Skill Breakdown</h3>
          <div className="space-y-4">
            {Object.entries(data.skillBreakdown).map(([skill, score]) => (
              <div key={skill}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{skill}</span>
                  <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score}%</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Recent Sessions */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="font-semibold mb-4">Recent Sessions</h3>
          <div className="space-y-3">
            {data.recentSessions.map((session) => (
              <div
                key={session.id}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{session.type}</p>
                    <p className="text-sm opacity-70">{session.date} • {session.duration}min</p>
                  </div>
                  <span className={`text-lg font-bold ${getScoreColor(session.score)}`}>
                    {session.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas to Improve */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
          <h3 className="font-semibold mb-4">🎯 Areas to Improve</h3>
          <div className="space-y-3">
            {data.weaknesses.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.area}</p>
                    <p className={`text-sm ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)} {item.trend}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-red-500">{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
          <h3 className="font-semibold mb-4">💪 Your Strengths</h3>
          <div className="space-y-3">
            {data.strengths.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.area}</p>
                    <p className={`text-sm ${getTrendColor(item.trend)}`}>
                      {getTrendIcon(item.trend)} {item.trend}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-500">{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
        <h3 className="font-semibold mb-4">📚 Recommended Focus Areas</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
            <p className="font-medium mb-2">System Design Practice</p>
            <p className="text-sm opacity-70">Your system design scores are below target. Consider practicing distributed system scenarios.</p>
            <button className="mt-3 text-blue-500 text-sm font-medium hover:underline">
              Start Practice →
            </button>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
            <p className="font-medium mb-2">Database Deep Dive</p>
            <p className="text-sm opacity-70">Strengthen your database knowledge with SQL and NoSQL comparison exercises.</p>
            <button className="mt-3 text-blue-500 text-sm font-medium hover:underline">
              Start Learning →
            </button>
          </div>
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}>
            <p className="font-medium mb-2">Mock Interview</p>
            <p className="text-sm opacity-70">You haven't practiced in 2 days. Keep your streak alive!</p>
            <button className="mt-3 text-blue-500 text-sm font-medium hover:underline">
              Quick Practice →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
