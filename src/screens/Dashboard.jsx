import React, { useState, useEffect } from 'react';
import ConfirmModal from '../components/ConfirmModal';
import { DefaultHabitIcon } from '../components/Icons';
import { getCurrentUser } from '../auth';
import { logHabitCompletion, getTodayHabitLogs, getDashboardHabits } from '../habitTrackingService';

const Dashboard = ({ onNavigate }) => {
  const [habits, setHabits] = useState([]);
  const [completedHabits, setCompletedHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [todayScore, setTodayScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [habitsResult, logsResult] = await Promise.all([
        getDashboardHabits(user.user_id),
        getTodayHabitLogs(user.user_id)
      ]);

      if (!habitsResult.error && habitsResult.data) {
        // Sort habits: positive first (highest to lowest), then negative (highest to lowest)
        const sortedHabits = habitsResult.data.sort((a, b) => {
          // First sort by type: positive (0) before negative (1)
          if (a.habit_type !== b.habit_type) {
            return a.habit_type - b.habit_type;
          }
          // Then sort by points: highest to lowest within each type
          return b.points - a.points;
        });
        setHabits(sortedHabits);
      }

      if (!logsResult.error && logsResult.data) {
        setCompletedHabits(logsResult.data.map(log => log.habit_id));
        // Calculate today's score from logs
        const score = logsResult.data.reduce((sum, log) => sum + (log.points || 0), 0);
        setTodayScore(score);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleHabitClick = (habit) => {
    // Check if positive habit is already completed today
    if (habit.habit_type === 0 && completedHabits.includes(habit.habit_id)) {
      return;
    }

    setSelectedHabit(habit);
    setShowModal(true);
  };

  const confirmHabit = async () => {
    try {
      const points = selectedHabit.habit_type === 0 ? selectedHabit.points : -selectedHabit.points;
      
      const { error } = await logHabitCompletion(
        user.user_id,
        selectedHabit.habit_id,
        selectedHabit.points,
        selectedHabit.habit_type,
        selectedHabit.goal_id
      );

      if (error) throw error;

      // Update local state
      setCompletedHabits([...completedHabits, selectedHabit.habit_id]);
      setTodayScore(todayScore + points);
      
      setShowModal(false);
      setSelectedHabit(null);
    } catch (error) {
      alert('Error logging habit: ' + error.message);
    }
  };

  const isHabitDoneToday = (habit) => {
    return habit.habit_type === 0 && completedHabits.includes(habit.habit_id);
  };

  return (
    <div className="min-h-screen">
      {/* Header with proper safe area */}
      <div className="bg-gradient-primary pt-8 px-4 pb-6">
        {/* Header row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-poppins font-bold text-xl text-white">
            Shido
          </h1>
          <div className="text-right">
            <p className="font-inter text-white/90 text-sm font-medium">
              {formatDate(new Date()).split(',')[0]}
            </p>
            <p className="font-inter text-white/70 text-xs">
              {formatDate(new Date()).split(',')[1]?.trim()}
            </p>
          </div>
        </div>
        
        {/* Score Card - Compact */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 border border-white/30 max-w-sm mx-auto">
          <div className="text-center">
            <div className="font-poppins font-bold text-4xl text-white mb-1">
              {todayScore}
            </div>
            <p className="font-inter text-white/90 text-base font-medium mb-1">
              Today's Score
            </p>
          </div>
        </div>
      </div>

      {/* Content with proper spacing */}
      <div className="px-4 space-y-6">
        {/* Section Header */}
        <div className="pt-6">
          <h2 className="font-poppins font-bold text-xl text-text-primary mb-2">
            Today's Habits
          </h2>
          <p className="font-inter text-text-secondary text-sm leading-relaxed">
            Build discipline one action at a time
          </p>
        </div>

        {/* Habits */}
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-card">
            <p className="font-inter text-text-secondary">Loading habits...</p>
          </div>
        ) : habits.length === 0 ? (
          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-card">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-gray-400">✨</span>
              </div>
              <h3 className="font-poppins font-bold text-lg text-text-primary mb-3">
                Ready to start?
              </h3>
              <p className="font-inter text-text-secondary text-sm leading-relaxed mb-6">
                Add habits from Path to start tracking your discipline journey.
              </p>
              <button
                onClick={() => onNavigate('path')}
                className="w-full bg-gradient-primary text-white py-4 px-6 rounded-xl font-inter font-semibold shadow-soft hover:shadow-card transition-all"
              >
                Go to Path
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {habits.map((habit) => {
              const isDone = isHabitDoneToday(habit);
              return (
                <button
                  key={habit.habit_id}
                  onClick={() => handleHabitClick(habit)}
                  disabled={isDone}
                  className={`bg-white rounded-2xl shadow-card text-left transition-all ${
                    isDone ? 'opacity-60' : 'hover:shadow-floating'
                  } ${
                    habit.habit_type === 0 ? 'p-4' : 'p-3 opacity-75'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-xl flex items-center justify-center flex-shrink-0 ${
                      habit.habit_type === 0
                        ? 'w-12 h-12 bg-gradient-to-br from-primary to-secondary' 
                        : 'w-10 h-10 bg-gradient-to-br from-negative to-red-400'
                    }`}>
                      <DefaultHabitIcon className={`text-white ${
                        habit.habit_type === 0 ? 'w-6 h-6' : 'w-5 h-5'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`font-inter font-semibold text-text-primary truncate ${
                          habit.habit_type === 0 ? 'text-sm' : 'text-xs'
                        }`}>
                          {habit.habit_name}
                        </h3>
                        <span
                          className={`font-poppins font-bold rounded-full text-xs flex-shrink-0 ml-2 ${
                            habit.habit_type === 0
                              ? 'bg-primary/10 text-primary px-2 py-1'
                              : 'bg-negative/10 text-negative px-1.5 py-0.5 text-xs'
                          }`}
                        >
                          {habit.habit_type === 0 ? '+' : '-'}{habit.points}
                        </span>
                      </div>
                      
                      {isDone && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <p className="text-xs text-primary font-inter font-medium">
                            Completed today
                          </p>
                        </div>
                      )}
                      
                      {habit.goals_manager && (
                        <p className={`text-secondary font-inter mt-1 ${
                          habit.habit_type === 0 ? 'text-xs' : 'text-xs opacity-75'
                        }`}>
                          Goal: {habit.goals_manager.goal_name}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          }
        </div>
        )}

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-secondary/10 to-primary/10 rounded-2xl p-6 text-center max-w-lg mx-auto">
          <p className="font-inter text-text-primary italic text-sm leading-relaxed">
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