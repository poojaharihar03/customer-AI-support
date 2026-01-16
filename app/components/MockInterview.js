'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const interviewRounds = {
  behavioral: {
    name: 'Behavioral',
    duration: 30,
    questions: [
      "Tell me about yourself and your background.",
      "Describe a challenging project you worked on. How did you handle it?",
      "Tell me about a time when you had a conflict with a team member. How did you resolve it?",
      "What's your greatest professional achievement?",
      "Describe a situation where you had to meet a tight deadline.",
      "How do you handle criticism or negative feedback?",
      "Tell me about a time you failed. What did you learn?",
      "Why are you interested in this role?",
      "Where do you see yourself in 5 years?",
      "How do you prioritize tasks when you have multiple deadlines?"
    ]
  },
  technical: {
    name: 'Technical',
    duration: 45,
    questions: [
      "Explain the difference between REST and GraphQL APIs.",
      "What is the time complexity of binary search?",
      "Explain how a hash table works.",
      "What are the SOLID principles in software design?",
      "Describe the differences between SQL and NoSQL databases.",
      "What is the difference between a process and a thread?",
      "Explain the concept of closures in JavaScript.",
      "What is dependency injection and why is it useful?",
      "Describe the MVC architecture pattern.",
      "What are microservices and when would you use them?"
    ]
  },
  systemDesign: {
    name: 'System Design',
    duration: 45,
    questions: [
      "Design a URL shortening service like bit.ly.",
      "How would you design Twitter's timeline feature?",
      "Design a distributed cache system.",
      "How would you design a real-time chat application?",
      "Design a video streaming service like Netflix.",
      "How would you design an e-commerce platform?",
      "Design a notification system for a social media app.",
      "How would you design a ride-sharing service like Uber?",
      "Design a scalable file storage system like Google Drive.",
      "How would you design a search autocomplete system?"
    ]
  }
};

const MockInterview = ({ onComplete }) => {
  const { darkMode } = useTheme();
  const [selectedRound, setSelectedRound] = useState(null);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [interviewResults, setInterviewResults] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isInterviewActive && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isInterviewActive, isPaused, timeRemaining]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = (roundType) => {
    setSelectedRound(roundType);
    setIsInterviewActive(true);
    setCurrentQuestionIndex(0);
    setTimeRemaining(interviewRounds[roundType].duration * 60);
    setAnswers([]);
    setCurrentAnswer('');
    setInterviewResults(null);
  };

  const handleTimeUp = () => {
    if (currentAnswer.trim()) {
      saveCurrentAnswer();
    }
    finishInterview();
  };

  const saveCurrentAnswer = () => {
    const question = interviewRounds[selectedRound].questions[currentQuestionIndex];
    setAnswers((prev) => [...prev, { question, answer: currentAnswer, timestamp: new Date() }]);
  };

  const nextQuestion = () => {
    if (currentAnswer.trim()) {
      saveCurrentAnswer();
    }
    setCurrentAnswer('');
    
    if (currentQuestionIndex < interviewRounds[selectedRound].questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    clearInterval(timerRef.current);
    setIsInterviewActive(false);
    
    const totalQuestions = interviewRounds[selectedRound].questions.length;
    const answeredQuestions = answers.length + (currentAnswer.trim() ? 1 : 0);
    const timeUsed = interviewRounds[selectedRound].duration * 60 - timeRemaining;
    
    const results = {
      round: interviewRounds[selectedRound].name,
      totalQuestions,
      answeredQuestions,
      timeUsed,
      completionRate: Math.round((answeredQuestions / totalQuestions) * 100),
      averageTimePerQuestion: Math.round(timeUsed / Math.max(answeredQuestions, 1)),
      answers: [...answers, ...(currentAnswer.trim() ? [{ 
        question: interviewRounds[selectedRound].questions[currentQuestionIndex], 
        answer: currentAnswer 
      }] : [])]
    };
    
    setInterviewResults(results);
    if (onComplete) {
      onComplete(results);
    }
  };

  const resetInterview = () => {
    setSelectedRound(null);
    setIsInterviewActive(false);
    setCurrentQuestionIndex(0);
    setTimeRemaining(0);
    setAnswers([]);
    setCurrentAnswer('');
    setInterviewResults(null);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  if (interviewResults) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
        <h2 className="text-2xl font-bold mb-6 text-center">Interview Complete! 🎉</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
            <p className="text-sm opacity-70">Round</p>
            <p className="text-xl font-bold">{interviewResults.round}</p>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
            <p className="text-sm opacity-70">Completion</p>
            <p className="text-xl font-bold">{interviewResults.completionRate}%</p>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-yellow-50'}`}>
            <p className="text-sm opacity-70">Questions</p>
            <p className="text-xl font-bold">{interviewResults.answeredQuestions}/{interviewResults.totalQuestions}</p>
          </div>
          <div className={`p-4 rounded-lg text-center ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
            <p className="text-sm opacity-70">Avg Time/Q</p>
            <p className="text-xl font-bold">{formatTime(interviewResults.averageTimePerQuestion)}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Responses:</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {interviewResults.answers.map((item, index) => (
              <div key={index} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="font-medium text-blue-500 mb-2">Q{index + 1}: {item.question}</p>
                <p className="text-sm">{item.answer || 'No answer provided'}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={resetInterview}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  if (!selectedRound) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
        <h2 className="text-2xl font-bold mb-2 text-center">Mock Interview Mode</h2>
        <p className="text-center opacity-70 mb-8">Select an interview round to practice</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(interviewRounds).map(([key, round]) => (
            <div
              key={key}
              className={`p-6 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
              } border-2 border-transparent hover:border-blue-500`}
              onClick={() => startInterview(key)}
            >
              <h3 className="text-xl font-bold mb-2">{round.name}</h3>
              <p className="text-sm opacity-70 mb-4">{round.questions.length} questions</p>
              <p className="text-sm">
                <span className="font-medium">Duration:</span> {round.duration} minutes
              </p>
              <button className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
                Start Practice
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">{interviewRounds[selectedRound].name} Interview</h2>
          <p className="text-sm opacity-70">Question {currentQuestionIndex + 1} of {interviewRounds[selectedRound].questions.length}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`text-2xl font-mono font-bold ${timeRemaining < 60 ? 'text-red-500' : timeRemaining < 300 ? 'text-yellow-500' : 'text-green-500'}`}>
            {formatTime(timeRemaining)}
          </div>
          <button
            onClick={togglePause}
            className={`px-4 py-2 rounded-lg transition-colors ${isPaused ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white`}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / interviewRounds[selectedRound].questions.length) * 100}%` }}
        ></div>
      </div>

      <div className={`p-6 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
        <p className="text-lg font-medium">
          {interviewRounds[selectedRound].questions[currentQuestionIndex]}
        </p>
      </div>

      <textarea
        value={currentAnswer}
        onChange={(e) => setCurrentAnswer(e.target.value)}
        disabled={isPaused}
        placeholder="Type your answer here..."
        className={`w-full h-48 p-4 rounded-lg resize-none ${
          darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-black border-gray-300'
        } border focus:outline-none focus:ring-2 focus:ring-blue-500 ${isPaused ? 'opacity-50' : ''}`}
      />

      <div className="flex justify-between mt-6">
        <button
          onClick={resetInterview}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          End Interview
        </button>
        <button
          onClick={nextQuestion}
          disabled={isPaused}
          className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors ${isPaused ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {currentQuestionIndex === interviewRounds[selectedRound].questions.length - 1 ? 'Finish' : 'Next Question'}
        </button>
      </div>
    </div>
  );
};

export default MockInterview;
