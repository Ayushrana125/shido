import React, { useState } from 'react';
import { PlusIcon, DefaultHabitIcon } from '../components/Icons';
import { getState, setState } from '../store';

const Path = () => {
  const [activeTab, setActiveTab] = useState('goals');
  const [state, setStateLocal] = useState(getState());
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [goalForm, setGoalForm] = useState({ name: '', targetPoints: '', phase: 'Energy' });
  const [habitForm, setHabitForm] = useState({
    name: '', points: '', type: 'positive', message: '', iconUrl: ''
  });

  const updateState = (newState) => {
    setState(newState);
    setStateLocal(newState);
  };

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      id: Date.now(),
      name: goalForm.name,
      targetPoints: parseInt(goalForm.targetPoints),
      currentPoints: 0,
      phase: goalForm.phase
    };
    updateState({ ...state, goals: [...state.goals, newGoal] });
    setGoalForm({ name: '', targetPoints: '', phase: 'Energy' });
    setShowGoalForm(false);
  };

  const handleHabitSubmit = (e) => {
    e.preventDefault();
    const habitData = {
      ...habitForm,
      points: parseInt(habitForm.points),
      id: editingHabit ? editingHabit.id : Date.now()
    };

    let newHabits;
    if (editingHabit) {
      newHabits = state.habits.map(h => h.id === editingHabit.id ? habitData : h);
    } else {
      newHabits = [...state.habits, habitData];
    }

    updateState({ ...state, habits: newHabits });
    setShowHabitForm(false);
    setEditingHabit(null);
    setHabitForm({ name: '', points: '', type: 'positive', message: '', iconUrl: '' });
  };

  const openHabitForm = (habit = null) => {
    if (habit) {
      setEditingHabit(habit);
      setHabitForm({ ...habit, iconUrl: habit.iconUrl || '' });
    } else {
      setEditingHabit(null);
      setHabitForm({ name: '', points: '', type: 'positive', message: '', iconUrl: '' });
    }
    setShowHabitForm(true);
  };

  const deleteHabit = (id) => {
    updateState({ ...state, habits: state.habits.filter(h => h.id !== id) });
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

  const primaryGoal = state.goals[0];
  const positiveHabits = state.habits.filter(h => h.type === 'positive');
  const negativeHabits = state.habits.filter(h => h.type === 'negative');

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
            {primaryGoal ? (
              <div className="bg-white rounded-3xl p-6 shadow-card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-poppins font-bold text-lg text-text-primary mb-1">
                      {primaryGoal.name}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-inter font-semibold text-white bg-gradient-to-r ${getPhaseColor(primaryGoal.phase)}`}>
                      {primaryGoal.phase}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-poppins font-bold text-2xl text-text-primary">
                      {Math.round((primaryGoal.currentPoints / primaryGoal.targetPoints) * 100)}%
                    </p>
                    <p className="font-inter text-text-secondary text-sm">
                      {primaryGoal.currentPoints} / {primaryGoal.targetPoints}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${getPhaseColor(primaryGoal.phase)} transition-all duration-500`}
                      style={{ width: `${Math.min((primaryGoal.currentPoints / primaryGoal.targetPoints) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : null}

            <button
              onClick={() => setShowGoalForm(true)}
              className="w-full bg-white rounded-3xl p-6 shadow-card border-2 border-dashed border-gray-200 hover:border-primary transition-colors group"
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-primary/10 rounded-2xl flex items-center justify-center mb-3 transition-colors">
                  <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-poppins font-bold text-text-primary mb-1">Add Goal</h3>
                <p className="font-inter text-text-secondary text-sm">Set your next milestone</p>
              </div>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {positiveHabits.length > 0 && (
              <div>
                <h3 className="font-poppins font-bold text-lg text-text-primary mb-4">Positive Habits</h3>
                <div className="space-y-3">
                  {positiveHabits.map((habit) => (
                    <div key={habit.id} className="bg-white rounded-2xl p-4 shadow-card">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                          {habit.iconUrl ? (
                            <img src={habit.iconUrl} alt={habit.name} className="w-6 h-6" />
                          ) : (
                            <DefaultHabitIcon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-inter font-semibold text-text-primary">{habit.name}</h4>
                            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-poppins font-bold">
                              +{habit.points}
                            </span>
                          </div>
                          <p className="font-inter text-text-secondary text-sm">{habit.message}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => openHabitForm(habit)}
                            className="px-3 py-2 bg-secondary/10 text-secondary rounded-xl font-inter font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="px-3 py-2 bg-negative/10 text-negative rounded-xl font-inter font-medium text-sm"
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
                <h3 className="font-poppins font-bold text-lg text-text-primary mb-4">Negative Habits</h3>
                <div className="space-y-3">
                  {negativeHabits.map((habit) => (
                    <div key={habit.id} className="bg-white rounded-2xl p-4 shadow-card">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-negative to-red-400 rounded-xl flex items-center justify-center">
                          {habit.iconUrl ? (
                            <img src={habit.iconUrl} alt={habit.name} className="w-6 h-6" />
                          ) : (
                            <DefaultHabitIcon className="w-6 h-6 text-white" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-inter font-semibold text-text-primary">{habit.name}</h4>
                            <span className="bg-negative/10 text-negative px-2 py-1 rounded-full text-xs font-poppins font-bold">
                              {habit.points}
                            </span>
                          </div>
                          <p className="font-inter text-text-secondary text-sm">{habit.message}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => openHabitForm(habit)}
                            className="px-3 py-2 bg-secondary/10 text-secondary rounded-xl font-inter font-medium text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteHabit(habit.id)}
                            className="px-3 py-2 bg-negative/10 text-negative rounded-xl font-inter font-medium text-sm"
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

            {state.habits.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl text-gray-400">✨</span>
                </div>
                <h3 className="font-poppins font-bold text-lg text-text-primary mb-2">No habits yet</h3>
                <p className="font-inter text-text-secondary mb-6">Add your first habit to start building discipline.</p>
              </div>
            )}
          </div>
        )}
      </div>

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
                <label className="block font-inter font-semibold text-text-primary mb-3">Icon URL (Optional)</label>
                <input
                  type="url"
                  value={habitForm.iconUrl}
                  onChange={(e) => setHabitForm({ ...habitForm, iconUrl: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                  placeholder="https://example.com/icon.png"
                />
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