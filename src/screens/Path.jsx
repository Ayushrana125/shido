import React, { useState, useEffect } from 'react';
import { PlusIcon, DefaultHabitIcon } from '../components/Icons';
import { getCurrentUser } from '../auth';
import { saveGoal, getGoals, deleteGoal, calculatePhase } from '../goalsService';
import { saveHabit, getHabits, deleteHabit } from '../habitsService';

const Path = () => {
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [goalForm, setGoalForm] = useState({ name: '', targetPoints: '', phase: 'Energy' });
  const [habitForm, setHabitForm] = useState({
    name: '', points: '', type: 'positive', message: '', goalId: ''
  });
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      loadGoals();
      loadHabits();
    }
  }, [user]);

  const loadGoals = async () => {
    const { data, error } = await getGoals(user.user_id);
    if (!error && data) {
      setGoals(data);
    }
    setLoading(false);
  };

  const loadHabits = async () => {
    const { data, error } = await getHabits(user.user_id);
    if (!error && data) {
      setHabits(data);
    }
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await saveGoal(user.user_id, {
        name: goalForm.name,
        targetPoints: parseInt(goalForm.targetPoints),
        phase: goalForm.phase
      });
      
      if (error) throw error;
      
      setGoals([data, ...goals]);
      setGoalForm({ name: '', targetPoints: '', phase: 'Energy' });
      setShowGoalForm(false);
    } catch (error) {
      alert('Error creating goal: ' + error.message);
    }
  };

  const handleHabitSubmit = async (e) => {
    e.preventDefault();
    try {
      const habitData = {
        name: habitForm.name,
        points: parseInt(habitForm.points),
        type: habitForm.type,
        message: habitForm.message,
        goalId: habitForm.goalId || null
      };

      const { data, error } = await saveHabit(user.user_id, habitData);
      if (error) throw error;

      setHabits([data, ...habits]);
      setHabitForm({ name: '', points: '', type: 'positive', message: '', goalId: '' });
      setShowHabitForm(false);
      setEditingHabit(null);
    } catch (error) {
      alert('Error saving habit: ' + error.message);
    }
  };

  const openHabitForm = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      setHabitForm({
        name: habit.habit_name,
        points: habit.points?.toString() || '',
        type: habit.habit_type === 0 ? 'positive' : 'negative',
        message: habit.message || '',
        goalId: habit.goal_id?.toString() || ''
      });
    } else {
      setEditingHabit(null);
      setHabitForm({ name: '', points: '', type: 'positive', message: '', goalId: '' });
    }
    setShowHabitForm(true);
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      const { error } = await deleteHabit(habitId);
      if (error) throw error;
      
      setHabits(habits.filter(h => h.habit_id !== habitId));
    } catch (error) {
      alert('Error deleting habit: ' + error.message);
    }
  };

  const getPhaseColor = (phase) => {
    const colors = {
      Energy: 'from-red-400 to-orange-400',
      Presence: 'from-blue-400 to-indigo-400', 
      Attraction: 'from-purple-400 to-pink-400',
      Ready: 'from-green-400 to-emerald-400'
    };
    return colors[phase] || colors.Energy;
  };

  const primaryGoal = goals[0];
  const positiveHabits = habits.filter(h => h.habit_type === 0);
  const negativeHabits = habits.filter(h => h.habit_type === 1);

  return (
    <div className="flex-1 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-text-primary to-text-secondary pt-safe-top px-6 pb-8">
        <div className="pt-4">
          <h1 className="font-poppins font-bold text-2xl text-white mb-2">Your Path</h1>
          <p className="font-inter text-white/80 text-sm">Goals and habits that shape your journey</p>
        </div>
      </div>

      {/* Segmented Toggle */}
      <div className="px-6 -mt-4 mb-6">
        <div className="bg-white rounded-2xl p-2 shadow-card">
          <div className="flex">
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 py-3 px-4 rounded-xl font-inter font-semibold text-sm transition-all ${
                activeTab === 'goals'
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Goals
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`flex-1 py-3 px-4 rounded-xl font-inter font-semibold text-sm transition-all ${
                activeTab === 'habits'
                  ? 'bg-primary text-white shadow-soft'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Habits
            </button>
          </div>
        </div>
      </div>

      <div className="px-6">
        {activeTab === 'goals' ? (
          <div className="space-y-4">
            {loading ? (
              <div className="bg-white rounded-3xl p-8 text-center shadow-card">
                <p className="font-inter text-text-secondary">Loading goals...</p>
              </div>
            ) : primaryGoal ? (
              <div className="bg-white rounded-3xl p-6 shadow-card relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full -translate-y-16 translate-x-16" />
                <div className="relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-poppins font-bold text-xl text-text-primary mb-2">
                        {primaryGoal.goal_name}
                      </h3>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-inter font-semibold text-white bg-gradient-to-r ${getPhaseColor(primaryGoal.phase)} shadow-soft`}>
                        {primaryGoal.phase} Phase
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-poppins font-bold text-3xl text-text-primary">
                        {Math.round((primaryGoal.current_points / primaryGoal.target_points) * 100)}%
                      </p>
                      <p className="font-inter text-text-secondary text-sm">
                        {primaryGoal.current_points} / {primaryGoal.target_points} pts
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-full bg-gradient-to-r ${getPhaseColor(primaryGoal.phase)} transition-all duration-1000 ease-out`}
                        style={{ width: `${Math.min((primaryGoal.current_points / primaryGoal.target_points) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-inter text-text-secondary">Progress</span>
                    <span className="font-inter font-semibold text-primary">
                      {primaryGoal.target_points - primaryGoal.current_points} points to go
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowGoalForm(true)}
                className="w-full bg-white rounded-3xl p-8 shadow-card border-2 border-dashed border-gray-200 hover:border-primary transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-primary/20 group-hover:to-secondary/20 rounded-3xl flex items-center justify-center mb-4 transition-all">
                    <PlusIcon className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-text-primary mb-2">Create Your Goal</h3>
                  <p className="font-inter text-text-secondary text-sm">Set a milestone that inspires you</p>
                </div>
              </button>
            )}

            {goals.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-poppins font-bold text-lg text-text-primary">All Goals</h4>
                {goals.map((goal) => (
                  <div key={goal.goal_id} className="bg-white rounded-2xl p-4 shadow-card">
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-inter font-semibold text-text-primary">{goal.goal_name}</h5>
                        <p className="font-inter text-text-secondary text-sm">
                          {goal.current_points} / {goal.target_points} pts • {goal.phase}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-poppins font-bold text-primary">
                          {Math.round((goal.current_points / goal.target_points) * 100)}%
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {positiveHabits.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">✨</span>
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-text-primary">Positive Habits</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-inter font-semibold">
                    {positiveHabits.length} active
                  </span>
                </div>
                <div className="grid gap-3">
                  {positiveHabits.map((habit) => (
                    <div key={habit.habit_id} className="bg-white rounded-2xl p-4 shadow-card hover:shadow-floating transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <DefaultHabitIcon className="w-7 h-7 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-inter font-bold text-text-primary">{habit.habit_name}</h4>
                            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-poppins font-bold shadow-soft">
                              +{habit.points || 0}
                            </span>
                            {habit.goals_manager && (
                              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-inter">
                                {habit.goals_manager.goal_name}
                              </span>
                            )}
                          </div>
                          <p className="font-inter text-text-secondary text-sm leading-relaxed">{habit.message}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => openHabitForm(habit)}
                            className="px-4 py-2 bg-secondary/10 text-secondary rounded-xl font-inter font-medium text-sm hover:bg-secondary/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteHabit(habit.habit_id)}
                            className="px-4 py-2 bg-negative/10 text-negative rounded-xl font-inter font-medium text-sm hover:bg-negative/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {negativeHabits.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-negative to-red-400 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">⚠️</span>
                  </div>
                  <h3 className="font-poppins font-bold text-lg text-text-primary">Negative Habits</h3>
                  <span className="bg-negative/10 text-negative px-3 py-1 rounded-full text-xs font-inter font-semibold">
                    {negativeHabits.length} to avoid
                  </span>
                </div>
                <div className="grid gap-3">
                  {negativeHabits.map((habit) => (
                    <div key={habit.habit_id} className="bg-white rounded-2xl p-4 shadow-card hover:shadow-floating transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-negative to-red-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <DefaultHabitIcon className="w-7 h-7 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-inter font-bold text-text-primary">{habit.habit_name}</h4>
                            <span className="bg-negative text-white px-3 py-1 rounded-full text-xs font-poppins font-bold shadow-soft">
                              -{habit.points || 0}
                            </span>
                            {habit.goals_manager && (
                              <span className="bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-inter">
                                {habit.goals_manager.goal_name}
                              </span>
                            )}
                          </div>
                          <p className="font-inter text-text-secondary text-sm leading-relaxed">{habit.message}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => openHabitForm(habit)}
                            className="px-4 py-2 bg-secondary/10 text-secondary rounded-xl font-inter font-medium text-sm hover:bg-secondary/20 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteHabit(habit.habit_id)}
                            className="px-4 py-2 bg-negative/10 text-negative rounded-xl font-inter font-medium text-sm hover:bg-negative/20 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {habits.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                  <span className="text-3xl text-gray-400">🎯</span>
                </div>
                <h3 className="font-poppins font-bold text-xl text-text-primary mb-3">Build Your Habits</h3>
                <p className="font-inter text-text-secondary mb-8 max-w-sm mx-auto leading-relaxed">
                  Start with small, consistent actions that compound into extraordinary results.
                </p>
                <button
                  onClick={() => openHabitForm()}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
                >
                  Create First Habit
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Add Button for Goals */}
      {activeTab === 'goals' && (
        <button
          onClick={() => setShowGoalForm(true)}
          className="fixed bottom-32 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-floating flex items-center justify-center text-white hover:shadow-glow transition-all transform hover:scale-110 z-40"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}

      {/* Floating Add Button for Habits */}
      {activeTab === 'habits' && (
        <button
          onClick={() => openHabitForm()}
          className="fixed bottom-32 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-floating flex items-center justify-center text-white hover:shadow-glow transition-all transform hover:scale-110 z-40"
        >
          <PlusIcon className="w-6 h-6" />
        </button>
      )}

      {/* Goal Form Modal */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-card">
            <h3 className="font-poppins font-bold text-xl text-text-primary mb-6 text-center">Add New Goal</h3>
            <form onSubmit={handleGoalSubmit} className="space-y-6">
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">Goal Name</label>
                <input
                  type="text"
                  value={goalForm.name}
                  onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g., Build Morning Routine"
                  required
                />
              </div>
              
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">Target Points</label>
                <input
                  type="number"
                  value={goalForm.targetPoints}
                  onChange={(e) => setGoalForm({ ...goalForm, targetPoints: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                  placeholder="1000"
                  required
                />
              </div>
              
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">Phase</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Energy', 'Presence', 'Attraction', 'Ready'].map((phase) => (
                    <button
                      key={phase}
                      type="button"
                      onClick={() => setGoalForm({ ...goalForm, phase })}
                      className={`p-3 rounded-2xl font-inter font-semibold text-sm transition-all ${
                        goalForm.phase === phase
                          ? `bg-gradient-to-r ${getPhaseColor(phase)} text-white shadow-soft`
                          : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                      }`}
                    >
                      {phase}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowGoalForm(false)}
                  className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-2xl font-inter font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Habit Form Modal */}
      {showHabitForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-card">
            <h3 className="font-poppins font-bold text-xl text-text-primary mb-6 text-center">
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h3>
            <form onSubmit={handleHabitSubmit} className="space-y-6">
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">Habit Name</label>
                <input
                  type="text"
                  value={habitForm.name}
                  onChange={(e) => setHabitForm({ ...habitForm, name: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g., Morning workout"
                  required
                />
              </div>
              
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">Points</label>
                <input
                  type="number"
                  value={habitForm.points}
                  onChange={(e) => setHabitForm({ ...habitForm, points: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                  placeholder="10"
                  required
                />
              </div>
              
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setHabitForm({ ...habitForm, type: 'positive' })}
                    className={`p-4 rounded-2xl font-inter font-semibold transition-all ${
                      habitForm.type === 'positive'
                        ? 'bg-primary text-white shadow-soft'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    Positive
                  </button>
                  <button
                    type="button"
                    onClick={() => setHabitForm({ ...habitForm, type: 'negative' })}
                    className={`p-4 rounded-2xl font-inter font-semibold transition-all ${
                      habitForm.type === 'negative'
                        ? 'bg-negative text-white shadow-soft'
                        : 'bg-gray-100 text-text-secondary hover:bg-gray-200'
                    }`}
                  >
                    Negative
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">Associated Goal (Optional)</label>
                <select
                  value={habitForm.goalId}
                  onChange={(e) => setHabitForm({ ...habitForm, goalId: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                >
                  <option value="">No specific goal</option>
                  {goals.map((goal) => (
                    <option key={goal.goal_id} value={goal.goal_id}>
                      {goal.goal_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">Confirmation Message</label>
                <textarea
                  value={habitForm.message}
                  onChange={(e) => setHabitForm({ ...habitForm, message: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors h-24 resize-none"
                  placeholder="e.g., Great job on your workout!"
                  required
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowHabitForm(false)}
                  className="flex-1 py-4 px-6 border-2 border-gray-200 rounded-2xl font-inter font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
                >
                  {editingHabit ? 'Update' : 'Add Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Path;