import React, { useState } from 'react';
import { DefaultHabitIcon, PlusIcon } from '../components/Icons';
import { getState, setState } from '../store';

const Settings = () => {
  const [state, setStateLocal] = useState(getState());
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [habitForm, setHabitForm] = useState({
    name: '',
    points: '',
    type: 'positive',
    message: '',
    iconUrl: ''
  });
  const [profileForm, setProfileForm] = useState(state.profile);

  const updateState = (newState) => {
    setState(newState);
    setStateLocal(newState);
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateState({
      ...state,
      profile: profileForm
    });
  };

  const openHabitForm = (habit = null) => {
    // Check if no goals exist when trying to add a habit
    if (!habit && state.goals.length === 0) {
      alert('Please create a goal first before adding habits.');
      return;
    }

    if (habit) {
      setEditingHabit(habit);
      setHabitForm({ ...habit, iconUrl: habit.iconUrl || '' });
    } else {
      setEditingHabit(null);
      setHabitForm({
        name: '',
        points: '',
        type: 'positive',
        message: '',
        iconUrl: ''
      });
    }
    setShowHabitForm(true);
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

    updateState({
      ...state,
      habits: newHabits
    });

    setShowHabitForm(false);
    setEditingHabit(null);
  };

  const deleteHabit = (id) => {
    updateState({
      ...state,
      habits: state.habits.filter(h => h.id !== id)
    });
  };

  return (
    <div className="flex-1 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-text-primary to-text-secondary pt-safe-top px-6 pb-8">
        <div className="pt-4">
          <h1 className="font-poppins font-bold text-2xl text-white mb-2">
            Settings
          </h1>
          <p className="font-inter text-white/80 text-sm">
            Customize your discipline journey
          </p>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center">
              {profileForm.photo ? (
                <img src={profileForm.photo} alt="Profile" className="w-12 h-12 rounded-xl object-cover" />
              ) : (
                <span className="text-2xl text-white">👤</span>
              )}
            </div>
            <div>
              <h2 className="font-poppins font-bold text-lg text-text-primary">
                Profile
              </h2>
              <p className="font-inter text-text-secondary text-sm">
                Your personal information
              </p>
            </div>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block font-inter font-semibold text-text-primary mb-2">
                Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block font-inter font-semibold text-text-primary mb-2">
                Birthdate
              </label>
              <input
                type="date"
                value={profileForm.birthdate}
                onChange={(e) => setProfileForm({ ...profileForm, birthdate: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block font-inter font-semibold text-text-primary mb-2">
                Profile Photo URL
              </label>
              <input
                type="url"
                value={profileForm.photo}
                onChange={(e) => setProfileForm({ ...profileForm, photo: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                placeholder="https://example.com/photo.jpg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Habits Section */}
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-poppins font-bold text-lg text-text-primary">
                Habits Manager
              </h2>
              <p className="font-inter text-text-secondary text-sm">
                {state.habits.length} {state.habits.length === 1 ? 'habit' : 'habits'} configured
              </p>
            </div>
            <button
              onClick={() => openHabitForm()}
              className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center text-white shadow-soft hover:shadow-card transition-all transform hover:scale-105"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          {state.habits.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-gray-400">✨</span>
              </div>
              <h3 className="font-poppins font-bold text-lg text-text-primary mb-2">
                No habits yet
              </h3>
              <p className="font-inter text-text-secondary mb-6">
                Add your first habit to start building discipline.
              </p>
              <button
                onClick={() => openHabitForm()}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
              >
                Add First Habit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {state.habits.map((habit) => (
                <div key={habit.id} className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors">
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
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-inter font-semibold text-text-primary">
                          {habit.name}
                        </h3>
                        <span
                          className={`font-poppins font-bold px-2 py-1 rounded-full text-xs ${
                            habit.type === 'positive'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-negative/10 text-negative'
                          }`}
                        >
                          {habit.points > 0 ? '+' : ''}{habit.points}
                        </span>
                      </div>
                      <p className="font-inter text-text-secondary text-sm">
                        {habit.message}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => openHabitForm(habit)}
                        className="px-3 py-2 bg-secondary/10 text-secondary rounded-xl font-inter font-medium text-sm hover:bg-secondary/20 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="px-3 py-2 bg-negative/10 text-negative rounded-xl font-inter font-medium text-sm hover:bg-negative/20 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Goals Section */}
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center">
              <span className="text-xl text-white">🎯</span>
            </div>
            <div>
              <h2 className="font-poppins font-bold text-lg text-text-primary">
                Goals Manager
              </h2>
              <p className="font-inter text-text-secondary text-sm">
                Manage your goals from the Goals tab
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Habit Form Modal */}
      {showHabitForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-card">
            <h3 className="font-poppins font-bold text-xl text-text-primary mb-6 text-center">
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h3>
            <form onSubmit={handleHabitSubmit} className="space-y-6">
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">
                  Habit Name
                </label>
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
                <label className="block font-inter font-semibold text-text-primary mb-3">
                  Points
                </label>
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
                <label className="block font-inter font-semibold text-text-primary mb-3">
                  Type
                </label>
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
                <label className="block font-inter font-semibold text-text-primary mb-3">
                  Icon URL (Optional)
                </label>
                <input
                  type="url"
                  value={habitForm.iconUrl}
                  onChange={(e) => setHabitForm({ ...habitForm, iconUrl: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                  placeholder="https://example.com/icon.png"
                />
              </div>
              
              <div>
                <label className="block font-inter font-semibold text-text-primary mb-3">
                  Confirmation Message
                </label>
                <textarea
                  value={habitForm.message}
                  onChange={(e) => setHabitForm({ ...habitForm, message: e.target.value })}
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors h-24 resize-none"
                  placeholder="e.g., Ayush, that's awesome that you worked out today!"
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

export default Settings;