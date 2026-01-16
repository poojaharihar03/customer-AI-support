'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const analyzeCriteria = {
  clarity: {
    name: 'Clarity & Structure',
    weight: 0.25,
    description: 'How well-organized and clear is the response?'
  },
  relevance: {
    name: 'Relevance',
    weight: 0.25,
    description: 'Does the answer address the question directly?'
  },
  depth: {
    name: 'Depth & Detail',
    weight: 0.20,
    description: 'Level of detail and thoroughness'
  },
  examples: {
    name: 'Examples & Evidence',
    weight: 0.15,
    description: 'Use of concrete examples and data'
  },
  communication: {
    name: 'Communication Style',
    weight: 0.15,
    description: 'Professional tone and articulation'
  }
};

const improvementSuggestions = {
  clarity: [
    "Use the STAR method (Situation, Task, Action, Result) to structure your answers",
    "Start with a brief summary before diving into details",
    "Break complex answers into clear, logical sections",
    "Avoid jargon unless necessary, and explain technical terms"
  ],
  relevance: [
    "Listen carefully to the question and address all parts",
    "Stay focused on what's being asked - avoid tangents",
    "Ask clarifying questions if the question is ambiguous",
    "Connect your experience directly to the role requirements"
  ],
  depth: [
    "Quantify your achievements with specific metrics",
    "Explain your decision-making process",
    "Discuss challenges faced and how you overcame them",
    "Describe the impact of your actions on the team/company"
  ],
  examples: [
    "Prepare 5-7 versatile stories from your experience",
    "Include specific numbers and results in your examples",
    "Use recent and relevant examples when possible",
    "Practice adapting your examples to different question types"
  ],
  communication: [
    "Practice speaking at a moderate pace",
    "Use confident language - avoid 'I think' or 'maybe'",
    "Maintain a positive tone even when discussing challenges",
    "Show enthusiasm for the role and company"
  ]
};

const FeedbackSystem = ({ interviewData }) => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('analyze');
  const [inputText, setInputText] = useState('');
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);

  const analyzeResponse = () => {
    if (!inputText.trim() || !question.trim()) {
      alert('Please enter both a question and your response');
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis with scoring logic
    setTimeout(() => {
      const wordCount = inputText.split(/\s+/).length;
      const hasNumbers = /\d+/.test(inputText);
      const hasExamples = /example|instance|when|situation|project/i.test(inputText);
      const hasStructure = /first|then|finally|result|outcome|impact/i.test(inputText);
      const sentenceCount = inputText.split(/[.!?]+/).filter(s => s.trim()).length;
      
      const scores = {
        clarity: Math.min(100, Math.round(
          (hasStructure ? 40 : 20) + 
          (sentenceCount > 3 && sentenceCount < 15 ? 40 : 20) + 
          Math.random() * 20
        )),
        relevance: Math.min(100, Math.round(
          (wordCount > 50 && wordCount < 300 ? 50 : 30) + 
          Math.random() * 30 + 20
        )),
        depth: Math.min(100, Math.round(
          (wordCount > 100 ? 40 : wordCount / 2.5) + 
          (hasNumbers ? 30 : 10) + 
          Math.random() * 30
        )),
        examples: Math.min(100, Math.round(
          (hasExamples ? 50 : 20) + 
          (hasNumbers ? 30 : 10) + 
          Math.random() * 20
        )),
        communication: Math.min(100, Math.round(
          (wordCount > 50 ? 40 : 25) + 
          (sentenceCount > 2 ? 30 : 15) + 
          Math.random() * 30
        ))
      };

      const overallScore = Math.round(
        Object.entries(scores).reduce((acc, [key, score]) => {
          return acc + score * analyzeCriteria[key].weight;
        }, 0)
      );

      const weakestAreas = Object.entries(scores)
        .sort(([, a], [, b]) => a - b)
        .slice(0, 2)
        .map(([key]) => key);

      const strongestAreas = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([key]) => key);

      const newAnalysis = {
        id: Date.now(),
        question,
        response: inputText,
        scores,
        overallScore,
        weakestAreas,
        strongestAreas,
        timestamp: new Date(),
        suggestions: weakestAreas.flatMap(area => 
          improvementSuggestions[area].slice(0, 2)
        )
      };

      setAnalysis(newAnalysis);
      setFeedbackHistory(prev => [newAnalysis, ...prev]);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const clearAnalysis = () => {
    setAnalysis(null);
    setInputText('');
    setQuestion('');
  };

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      <h2 className="text-2xl font-bold mb-2 text-center">AI Feedback System</h2>
      <p className="text-center opacity-70 mb-6">Get AI-powered analysis and improvement suggestions</p>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('analyze')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'analyze'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          Analyze Response
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'opacity-70 hover:opacity-100'
          }`}
        >
          History ({feedbackHistory.length})
        </button>
      </div>

      {activeTab === 'analyze' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <div className="mb-4">
              <label className="block font-medium mb-2">Interview Question</label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter the interview question..."
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium mb-2">Your Response</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your interview response here..."
                rows={10}
                className={`w-full p-3 rounded-lg border resize-none ${
                  darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <p className="text-sm opacity-70 mt-1">
                {inputText.split(/\s+/).filter(w => w).length} words
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={analyzeResponse}
                disabled={isAnalyzing}
                className={`flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors ${
                  isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Response'}
              </button>
              {analysis && (
                <button
                  onClick={clearAnalysis}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div>
            {isAnalyzing && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p>Analyzing your response...</p>
                </div>
              </div>
            )}

            {analysis && !isAnalyzing && (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className={`p-6 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <p className="text-sm opacity-70 mb-2">Overall Score</p>
                  <p className={`text-5xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </p>
                  <p className="text-sm opacity-70 mt-2">
                    {analysis.overallScore >= 80 ? 'Excellent!' : 
                     analysis.overallScore >= 60 ? 'Good, with room to improve' : 
                     'Needs improvement'}
                  </p>
                </div>

                {/* Detailed Scores */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h3 className="font-semibold mb-4">Detailed Breakdown</h3>
                  <div className="space-y-3">
                    {Object.entries(analysis.scores).map(([key, score]) => (
                      <div key={key}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{analyzeCriteria[key].name}</span>
                          <span className={`text-sm font-medium ${getScoreColor(score)}`}>{score}%</span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${getScoreBgColor(score)}`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
                  <h3 className="font-semibold mb-3">💡 Improvement Suggestions</h3>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <span className="text-yellow-500 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Strengths */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <h3 className="font-semibold mb-2">✨ Strong Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.strongestAreas.map(area => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-full"
                      >
                        {analyzeCriteria[area].name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!analysis && !isAnalyzing && (
              <div className={`flex items-center justify-center h-64 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <div className="text-center opacity-70">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  <p>Enter a question and response to get feedback</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {feedbackHistory.length === 0 ? (
            <div className="text-center py-12 opacity-70">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No feedback history yet</p>
              <p className="text-sm mt-1">Analyze some responses to build your history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbackHistory.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium">{item.question}</p>
                      <p className="text-sm opacity-70">
                        {item.timestamp.toLocaleDateString()} at {item.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`text-2xl font-bold ${getScoreColor(item.overallScore)}`}>
                      {item.overallScore}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2 opacity-80">{item.response}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(item.scores).map(([key, score]) => (
                      <span
                        key={key}
                        className={`px-2 py-1 text-xs rounded ${
                          score >= 70 ? 'bg-green-100 text-green-800' : 
                          score >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {analyzeCriteria[key].name}: {score}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackSystem;
