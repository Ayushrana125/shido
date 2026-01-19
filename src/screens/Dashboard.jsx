import React, { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { DefaultHabitIcon } from '../components/Icons';
import { getState, setState, getTodayKey, formatDate } from '../store';

const Dashboard = ({ onNavigate }) => {
  const [state, setStateLocal] = useState(getState());
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const updateState = (newState) => {
    setState(newState);
    setStateLocal(newState);
  };

  const handleHabitClick = (habit) => {
    const todayKey = getTodayKey();
    const todayActions = state.actionsLog.filter(
      action => action.date === todayKey && action.habitId === habit.id
    );

    if (habit.type === 'positive' && todayActions.length > 0) {
      return; // Already done today
    }

    setSelectedHabit(habit);
    setShowModal(true);
  };

  const confirmHabit = () => {
    const todayKey = getTodayKey();
    const now = new Date().toLocaleTimeString();
    
    const newAction = {
      date: todayKey,
      habitId: selectedHabit.id,
      habitName: selectedHabit.name,
      points: selectedHabit.points,
      time: now
    };

    const newState = {
      ...state,
      todayScore: state.todayScore + selectedHabit.points,
      totalScore: state.totalScore + selectedHabit.points,
      dailyLogs: {
        ...state.dailyLogs,
        [todayKey]: (state.dailyLogs[todayKey] || 0) + selectedHabit.points
      },
      actionsLog: [...state.actionsLog, newAction]
    };

    updateState(newState);
    setShowModal(false);
    setSelectedHabit(null);
  };

  const isHabitDoneToday = (habit) => {
    if (habit.type !== 'positive') return false;
    const todayKey = getTodayKey();
    return state.actionsLog.some(
      action => action.date === todayKey && action.habitId === habit.id
    );
  };

  return (
    <div className="flex-1 pb-32">
      {/* Gradient Header */}
      <div className="bg-gradient-primary pt-safe-top px-4 md:px-8 pb-8">
        <div className="flex justify-between items-center mb-8 pt-4">
          <h1 className="font-poppins font-bold text-2xl md:text-3xl text-white">
            Shido
          </h1>
          <div className="text-right">
            <p className="font-inter text-white/80 text-sm">
              {formatDate(new Date()).split(',')[0]}
            </p>
            <p className="font-inter text-white/60 text-xs">
              {formatDate(new Date()).split(',')[1]}
            </p>
          </div>
        </div>
        
        {/* Score Card */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/30 max-w-md mx-auto md:max-w-lg">
          <div className="text-center">
            <div className="font-poppins font-bold text-5xl md:text-6xl text-white mb-2">
              {state.todayScore}
            </div>
            <p className="font-inter text-white/90 text-lg font-medium mb-1">
              Today's Score
            </p>
            <p className="font-inter text-white/70 text-sm">
              Total: {state.totalScore} / 500
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 -mt-4">
        {/* Section Header */}
        <div className="mb-6 max-w-4xl mx-auto">
          <h2 className="font-poppins font-bold text-xl md:text-2xl text-text-primary mb-2">
            Today's Habits
          </h2>
          <p className="font-inter text-text-secondary text-sm">
            Build discipline one action at a time
          </p>
        </div>

        {/* Habits */}
        <div className="max-w-4xl mx-auto">
          {state.habits.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center shadow-card max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-3xl text-gray-400">✨</span>
              </div>
              <h3 className="font-poppins font-bold text-lg text-text-primary mb-2">
                Ready to start?
              </h3>
              <p className="font-inter text-text-secondary mb-6 leading-relaxed">
                Add habits from Settings to start tracking your discipline journey.
              </p>
              <button
                onClick={() => onNavigate('settings')}
                className="bg-gradient-primary text-white px-8 py-4 rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
              >
                Go to Settings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {state.habits.map((habit) => {
                const isDone = isHabitDoneToday(habit);
                return (
                  <button
                    key={habit.id}
                    onClick={() => handleHabitClick(habit)}
                    disabled={isDone}
                    className={`bg-white rounded-2xl p-6 shadow-card text-left transition-all transform hover:scale-102 ${
                      isDone ? 'opacity-60' : 'hover:shadow-floating'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        habit.type === 'positive' 
                          ? 'bg-gradient-to-br from-primary to-secondary' 
                          : 'bg-gradient-to-br from-negative to-red-400'
                      }`}>
                        {habit.iconUrl ? (
                          <img src={habit.iconUrl} alt={habit.name} className="w-6 h-6" />
                        ) : (
                          <DefaultHabitIcon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-inter font-semibold text-text-primary">
                            {habit.name}
                          </h3>
                          <span
                            className={`font-poppins font-bold px-3 py-1 rounded-full text-sm ${
                              habit.type === 'positive'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-negative/10 text-negative'
                            }`}
                          >
                            {habit.points > 0 ? '+' : ''}{habit.points}
                          </span>
                        </div>
                        
                        {isDone && (
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <p className="text-sm text-primary font-inter font-medium">
                              Completed today
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-6 text-center max-w-2xl mx-auto">
          <p className="font-inter text-text-primary italic leading-relaxed">
            "Every action moves you closer to your goal."
          </p>
        </div>
      </div>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmHabit}
        habit={selectedHabit}
      />
    </div>
  );
};

export default Dashboard;