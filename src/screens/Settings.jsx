import React, { useState } from 'react';
import { getState, setState } from '../store';
import { signOut } from '../auth';

const Settings = () => {
  const [state, setStateLocal] = useState(getState());
  const [profileForm, setProfileForm] = useState(state.profile);

  const updateState = (newState) => {
    setState(newState);
    setStateLocal(newState);
  };

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('currentUser');
    window.location.reload();
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateState({
      ...state,
      profile: profileForm
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
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center p-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  {profileForm.photo ? (
                    <img src={profileForm.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                  ) : (
                    <span className="text-3xl">👤</span>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✨</span>
              </div>
            </div>
            
            <h2 className="font-poppins font-bold text-xl text-text-primary mb-1">
              {profileForm.name || 'Your Name'}
            </h2>
            <p className="font-inter text-text-secondary text-sm mb-4">
              Building discipline, one day at a time
            </p>
            
            <div className="flex justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="font-poppins font-bold text-lg text-text-primary">{state.totalScore}</p>
                <p className="font-inter text-text-secondary text-xs">Total Points</p>
              </div>
              <div className="text-center">
                <p className="font-poppins font-bold text-lg text-text-primary">{state.habits.length}</p>
                <p className="font-inter text-text-secondary text-xs">Habits</p>
              </div>
              <div className="text-center">
                <p className="font-poppins font-bold text-lg text-text-primary">{state.goals.length}</p>
                <p className="font-inter text-text-secondary text-xs">Goals</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block font-inter font-semibold text-text-primary mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                placeholder="How should we call you?"
              />
            </div>
            <div>
              <label className="block font-inter font-semibold text-text-primary mb-2">
                Birthday
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
                Profile Picture URL
              </label>
              <input
                type="url"
                value={profileForm.photo}
                onChange={(e) => setProfileForm({ ...profileForm, photo: e.target.value })}
                className="w-full p-4 border-2 border-gray-200 rounded-2xl font-inter focus:border-primary focus:outline-none transition-colors"
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Sign Out Section */}
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <button
            onClick={handleSignOut}
            className="w-full bg-gradient-to-r from-negative to-red-400 text-white py-4 rounded-2xl font-inter font-semibold shadow-soft hover:shadow-card transition-all transform hover:scale-105"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;