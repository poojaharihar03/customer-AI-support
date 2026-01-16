'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import Fuse from 'fuse.js';

// Define your hard-coded responses in English
const hardCodedResponses = {
  'hello': 'Hello! I am your AI Interview Assistant. How can I help you prepare for your interviews today?',
  'what can you do': 'I can help you with interview preparation, answer questions about common interview topics, and provide tips for success!',
  'hi': 'Hello! How can I help you with your interview preparation today?',
  'how are you': 'I am here and ready to help you ace your interviews!',
  'whats your name': 'I am your AI Interview Assistant. How can I help you today?',
  'help': 'I can help you with: \n• Interview tips and strategies\n• Common interview questions\n• Behavioral interview preparation\n• Technical interview guidance\n• Company-specific preparation',
  'interview tips': 'Here are some key interview tips:\n1. Research the company thoroughly\n2. Practice the STAR method for behavioral questions\n3. Prepare questions to ask the interviewer\n4. Dress appropriately and arrive early\n5. Follow up with a thank-you note',
  'star method': 'The STAR method is a structured way to answer behavioral questions:\n• Situation: Describe the context\n• Task: Explain your responsibility\n• Action: Detail what you did\n• Result: Share the outcome',
  'common questions': 'Common interview questions include:\n• Tell me about yourself\n• Why do you want this job?\n• What are your strengths and weaknesses?\n• Where do you see yourself in 5 years?\n• Why should we hire you?',
  'technical interview': 'For technical interviews:\n• Review data structures and algorithms\n• Practice coding problems on LeetCode/HackerRank\n• Understand system design basics\n• Be ready to explain your thought process\n• Ask clarifying questions',
  'behavioral interview': 'For behavioral interviews:\n• Prepare stories using the STAR method\n• Focus on your achievements and learnings\n• Be specific with examples\n• Show self-awareness and growth mindset\n• Practice with mock interviews'
};

const Chat = () => {
  const { darkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Send introductory message
    const introMessage = { 
      text: 'Hello! I am your AI Interview Assistant. Ask me anything about interview preparation, tips, or common questions!', 
      user: false 
    };
    setMessages([introMessage]);
  }, []);

  const fuse = new Fuse(Object.keys(hardCodedResponses), {
    includeScore: true,
    threshold: 0.4,
  });

  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { text: input, user: true };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Fuzzy match input to hard-coded responses
    const result = fuse.search(input.toLowerCase());
    const matchedKey = result.length > 0 ? result[0].item : null;
    const hardCodedResponse = hardCodedResponses[matchedKey];

    // Simulate a brief delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    let botMessage;
    if (hardCodedResponse) {
      botMessage = { text: hardCodedResponse, user: false };
    } else {
      // Default response when no match found
      botMessage = { 
        text: "I'm not sure about that specific question, but I can help you with:\n• Interview tips and strategies\n• Common interview questions\n• STAR method for behavioral interviews\n• Technical interview preparation\n\nTry asking about any of these topics!", 
        user: false 
      };
    }

    setMessages(prevMessages => [...prevMessages, botMessage]);
    setInput('');
    setIsLoading(false);
  };

  return (
    <div className={`w-full max-w-4xl ${darkMode ? 'bg-zinc-700' : 'bg-slate-100'} rounded-lg shadow-xl p-4 sm:p-6`}>
      <div className="overflow-y-auto h-[50vh] sm:h-[70vh] mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.user ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-2 sm:p-3 rounded-lg max-w-[90%] sm:max-w-[80%] whitespace-pre-wrap ${
                message.user ? 'bg-blue-500 text-white' : `${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}>
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className={`flex-grow p-2 ${darkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-200 text-black border border-gray-300'} rounded-lg`}
          placeholder="Type your question here..."
          disabled={isLoading}
        />
        <button 
          onClick={sendMessage} 
          disabled={isLoading}
          className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chat;