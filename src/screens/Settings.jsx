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

        {/* Path Section */}
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center">
              <span className="text-xl text-white">🎯</span>
            </div>
            <div>
              <h2 className="font-poppins font-bold text-lg text-text-primary">
                Path Manager
              </h2>
              <p className="font-inter text-text-secondary text-sm">
                Manage your goals and habits from the Path tab
              </p>
            </div>
          </div>
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