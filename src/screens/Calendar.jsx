import React, { useState } from 'react';
import { getState } from '../store';

const Calendar = () => {
  const [state] = useState(getState());
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getScoreForDate = (date) => {
    if (!date) return 0;
    const dateKey = date.toISOString().split('T')[0];
    return state.dailyLogs[dateKey] || 0;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date) => {
    if (!date) return;
    setSelectedDate(date);
  };

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="flex-1 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-secondary pt-safe-top px-6 pb-8">
        <div className="pt-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <h1 className="font-poppins font-bold text-xl text-white">
                {monthYear}
              </h1>
              <p className="font-inter text-white/80 text-sm">
                Your discipline journey
              </p>
            </div>
            
            <button
              onClick={() => navigateMonth(1)}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Calendar Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-card">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center py-2 sm:py-3 font-inter font-semibold text-text-secondary text-xs sm:text-sm">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-6">
            {days.map((date, index) => {
              const score = getScoreForDate(date);
              const isToday = date && formatDateKey(date) === formatDateKey(new Date());
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(date)}
                  className={`aspect-square flex flex-col items-center justify-center p-1 sm:p-2 rounded-xl text-xs sm:text-sm transition-all transform hover:scale-105 ${
                    !date
                      ? ''
                      : isToday
                      ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-soft'
                      : score > 0
                      ? 'bg-primary/10 border-2 border-primary/20 text-primary hover:bg-primary/20'
                      : 'bg-gray-50 text-text-secondary hover:bg-gray-100'
                  }`}
                  disabled={!date}
                >
                  {date && (
                    <>
                      <span className="font-inter font-semibold mb-1">{date.getDate()}</span>
                      {score !== 0 && (
                        <span className={`text-xs font-poppins font-bold px-1 sm:px-1.5 py-0.5 rounded-full ${
                          isToday ? 'bg-white/20 text-white' : score > 0 ? 'bg-primary text-white' : 'bg-negative text-white'
                        }`}>
                          {score > 0 ? '+' : ''}{score}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats Card */}
        {Object.keys(state.dailyLogs).length > 0 && (
          <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-6 mt-6">
            <h3 className="font-poppins font-bold text-lg text-text-primary mb-4">
              This Month
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="font-poppins font-bold text-2xl text-text-primary">
                  {Object.values(state.dailyLogs).filter(score => score > 0).length}
                </div>
                <div className="font-inter text-text-secondary text-sm">
                  Active Days
                </div>
              </div>
              <div className="text-center">
                <div className="font-poppins font-bold text-2xl text-text-primary">
                  {Math.max(...Object.values(state.dailyLogs), 0)}
                </div>
                <div className="font-inter text-text-secondary text-sm">
                  Best Day
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {Object.keys(state.dailyLogs).length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center shadow-card mt-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <span className="text-2xl text-gray-400">📅</span>
            </div>
            <h3 className="font-poppins font-bold text-lg text-text-primary mb-2">
              Start Your Journey
            </h3>
            <p className="font-inter text-text-secondary leading-relaxed">
              No activity yet. Complete habits to see your progress here.
            </p>
          </div>
        )}
      </div>

      {/* Date detail modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">
                  {selectedDate.getDate()}
                </span>
              </div>
              
              <h3 className="font-poppins font-bold text-lg text-text-primary mb-2">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric'
                })}
              </h3>
              
              <div className="font-poppins font-bold text-3xl text-text-primary mb-1">
                {getScoreForDate(selectedDate)}
              </div>
              <p className="font-inter text-text-secondary text-sm">
                Daily Score
              </p>
            </div>
            
            <button
              onClick={() => setSelectedDate(null)}
              className="w-full py-4 px-6 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;