'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const interviewTypes = [
  { id: 'phone', name: 'Phone Screen', duration: 30, color: 'bg-blue-500' },
  { id: 'technical', name: 'Technical Interview', duration: 60, color: 'bg-green-500' },
  { id: 'behavioral', name: 'Behavioral Interview', duration: 45, color: 'bg-purple-500' },
  { id: 'system-design', name: 'System Design', duration: 60, color: 'bg-orange-500' },
  { id: 'onsite', name: 'Onsite Round', duration: 240, color: 'bg-red-500' },
  { id: 'hr', name: 'HR Discussion', duration: 30, color: 'bg-pink-500' }
];

const prepTaskTemplates = {
  'phone': [
    { task: 'Research company background', duration: 30 },
    { task: 'Prepare elevator pitch', duration: 15 },
    { task: 'Review role requirements', duration: 20 },
    { task: 'Prepare questions for interviewer', duration: 15 }
  ],
  'technical': [
    { task: 'Review data structures', duration: 60 },
    { task: 'Practice coding problems', duration: 90 },
    { task: 'Review algorithms complexity', duration: 45 },
    { task: 'Mock coding session', duration: 60 }
  ],
  'behavioral': [
    { task: 'Prepare STAR stories', duration: 45 },
    { task: 'Review company values', duration: 20 },
    { task: 'Practice common questions', duration: 30 },
    { task: 'Mock behavioral interview', duration: 45 }
  ],
  'system-design': [
    { task: 'Review design patterns', duration: 60 },
    { task: 'Study scalability concepts', duration: 45 },
    { task: 'Practice drawing diagrams', duration: 30 },
    { task: 'Mock design session', duration: 60 }
  ],
  'onsite': [
    { task: 'Full technical prep review', duration: 120 },
    { task: 'Behavioral story preparation', duration: 60 },
    { task: 'System design practice', duration: 90 },
    { task: 'Rest and mental preparation', duration: 60 }
  ],
  'hr': [
    { task: 'Research salary ranges', duration: 30 },
    { task: 'Prepare negotiation points', duration: 20 },
    { task: 'Review benefits questions', duration: 15 },
    { task: 'Prepare career goals discussion', duration: 20 }
  ]
};

const InterviewScheduler = () => {
  const { darkMode } = useTheme();
  const [interviews, setInterviews] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newInterview, setNewInterview] = useState({
    company: '',
    role: '',
    type: 'technical',
    date: '',
    time: '',
    notes: '',
    link: ''
  });

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getInterviewsForDate = (date) => {
    if (!date) return [];
    const dateStr = formatDate(date);
    return interviews.filter(i => i.date === dateStr);
  };

  const addInterview = () => {
    if (!newInterview.company || !newInterview.date || !newInterview.time) {
      alert('Please fill in required fields');
      return;
    }

    const interview = {
      id: Date.now(),
      ...newInterview,
      prepTasks: prepTaskTemplates[newInterview.type].map((t, idx) => ({
        ...t,
        id: idx,
        completed: false
      })),
      createdAt: new Date()
    };

    setInterviews(prev => [...prev, interview]);
    setNewInterview({
      company: '',
      role: '',
      type: 'technical',
      date: '',
      time: '',
      notes: '',
      link: ''
    });
    setShowAddModal(false);
  };

  const deleteInterview = (id) => {
    setInterviews(prev => prev.filter(i => i.id !== id));
    setSelectedDate(null);
  };

  const togglePrepTask = (interviewId, taskId) => {
    setInterviews(prev => prev.map(interview => {
      if (interview.id === interviewId) {
        return {
          ...interview,
          prepTasks: interview.prepTasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return interview;
    }));
  };

  const getUpcomingInterviews = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return interviews
      .filter(i => new Date(i.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const interviewDate = new Date(date);
    const diff = Math.ceil((interviewDate - today) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return `${diff} days`;
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={`w-full max-w-6xl mx-auto p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Interview Scheduler</h2>
          <p className="opacity-70">Plan and prepare for your upcoming interviews</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Interview
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium py-2 opacity-70">
                  {day}
                </div>
              ))}
              
              {days.map((date, idx) => {
                const dayInterviews = date ? getInterviewsForDate(date) : [];
                const isToday = date && formatDate(date) === formatDate(today);
                const isSelected = selectedDate && date && formatDate(date) === formatDate(selectedDate);
                
                return (
                  <div
                    key={idx}
                    onClick={() => date && setSelectedDate(date)}
                    className={`min-h-[80px] p-1 rounded-lg cursor-pointer transition-all ${
                      !date ? 'opacity-0' :
                      isSelected ? 'ring-2 ring-blue-500' :
                      isToday ? `${darkMode ? 'bg-blue-900' : 'bg-blue-100'}` :
                      `${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'}`
                    }`}
                  >
                    {date && (
                      <>
                        <span className={`text-sm ${isToday ? 'font-bold text-blue-500' : ''}`}>
                          {date.getDate()}
                        </span>
                        <div className="space-y-1 mt-1">
                          {dayInterviews.slice(0, 2).map(interview => {
                            const type = interviewTypes.find(t => t.id === interview.type);
                            return (
                              <div
                                key={interview.id}
                                className={`text-xs p-1 rounded truncate text-white ${type?.color || 'bg-gray-500'}`}
                              >
                                {interview.company}
                              </div>
                            );
                          })}
                          {dayInterviews.length > 2 && (
                            <div className="text-xs opacity-70">+{dayInterviews.length - 2} more</div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className={`mt-4 rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className="font-semibold mb-3">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h3>
              {getInterviewsForDate(selectedDate).length === 0 ? (
                <p className="opacity-70 text-center py-4">No interviews scheduled</p>
              ) : (
                <div className="space-y-3">
                  {getInterviewsForDate(selectedDate).map(interview => {
                    const type = interviewTypes.find(t => t.id === interview.type);
                    const completedTasks = interview.prepTasks.filter(t => t.completed).length;
                    
                    return (
                      <div
                        key={interview.id}
                        className={`p-4 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`w-3 h-3 rounded-full ${type?.color}`}></span>
                              <span className="font-semibold">{interview.company}</span>
                            </div>
                            <p className="text-sm opacity-70">{interview.role}</p>
                            <p className="text-sm">{type?.name} • {interview.time}</p>
                          </div>
                          <button
                            onClick={() => deleteInterview(interview.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                        
                        {interview.link && (
                          <a
                            href={interview.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 text-sm hover:underline block mb-3"
                          >
                            🔗 Join Interview Link
                          </a>
                        )}

                        <div>
                          <p className="text-sm font-medium mb-2">
                            Prep Tasks ({completedTasks}/{interview.prepTasks.length})
                          </p>
                          <div className="space-y-2">
                            {interview.prepTasks.map(task => (
                              <label
                                key={task.id}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => togglePrepTask(interview.id, task.id)}
                                  className="rounded"
                                />
                                <span className={task.completed ? 'line-through opacity-50' : ''}>
                                  {task.task} ({task.duration}min)
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Upcoming Interviews */}
        <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <h3 className="font-semibold mb-4">📅 Upcoming Interviews</h3>
          {getUpcomingInterviews().length === 0 ? (
            <div className="text-center py-8 opacity-70">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>No upcoming interviews</p>
              <p className="text-sm">Click "Add Interview" to schedule one</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getUpcomingInterviews().map(interview => {
                const type = interviewTypes.find(t => t.id === interview.type);
                const completedTasks = interview.prepTasks.filter(t => t.completed).length;
                const prepProgress = Math.round((completedTasks / interview.prepTasks.length) * 100);
                
                return (
                  <div
                    key={interview.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-white hover:bg-gray-100'}`}
                    onClick={() => setSelectedDate(new Date(interview.date))}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${type?.color}`}></span>
                      <span className="font-medium">{interview.company}</span>
                    </div>
                    <p className="text-sm opacity-70">{interview.role}</p>
                    <p className="text-sm">
                      {new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {interview.time}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs font-medium ${
                        getDaysUntil(interview.date) === 'Today' ? 'text-red-500' :
                        getDaysUntil(interview.date) === 'Tomorrow' ? 'text-orange-500' :
                        'text-blue-500'
                      }`}>
                        {getDaysUntil(interview.date)}
                      </span>
                      <span className="text-xs opacity-70">Prep: {prepProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-1 mt-1">
                      <div
                        className="bg-green-500 h-1 rounded-full transition-all"
                        style={{ width: `${prepProgress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Interview Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-xl font-bold mb-4">Schedule Interview</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company *</label>
                <input
                  type="text"
                  value={newInterview.company}
                  onChange={(e) => setNewInterview(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., Google"
                  className={`w-full p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={newInterview.role}
                  onChange={(e) => setNewInterview(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                  className={`w-full p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Interview Type</label>
                <select
                  value={newInterview.type}
                  onChange={(e) => setNewInterview(prev => ({ ...prev, type: e.target.value }))}
                  className={`w-full p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  {interviewTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    value={newInterview.date}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, date: e.target.value }))}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time *</label>
                  <input
                    type="time"
                    value={newInterview.time}
                    onChange={(e) => setNewInterview(prev => ({ ...prev, time: e.target.value }))}
                    className={`w-full p-2 rounded-lg border ${
                      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Meeting Link</label>
                <input
                  type="url"
                  value={newInterview.link}
                  onChange={(e) => setNewInterview(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="https://..."
                  className={`w-full p-2 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newInterview.notes}
                  onChange={(e) => setNewInterview(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional notes..."
                  rows={3}
                  className={`w-full p-2 rounded-lg border resize-none ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addInterview}
                className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;
