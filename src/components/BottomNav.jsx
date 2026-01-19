import React from 'react';
import { VisionIcon, CalendarIcon, DashboardIcon, GoalsIcon, SettingsIcon } from './Icons';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'vision', label: 'Vision', Icon: VisionIcon },
    { id: 'calendar', label: 'Calendar', Icon: CalendarIcon },
    { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
    { id: 'goals', label: 'Goals', Icon: GoalsIcon },
    { id: 'settings', label: 'Settings', Icon: SettingsIcon }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-200 z-50">
      <div className="max-w-6xl mx-auto h-full">
        <div className="flex justify-around items-center h-full px-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDashboard = tab.id === 'dashboard';
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? isDashboard
                      ? 'bg-gradient-primary shadow-soft transform scale-105'
                      : 'text-primary'
                    : 'text-text-secondary'
                }`}
              >
                <div className={`mb-1 ${
                  isActive && isDashboard ? 'text-white' : ''
                }`}>
                  <tab.Icon className="w-6 h-6" />
                </div>
                
                <span className={`text-xs font-inter font-medium ${
                  isActive
                    ? isDashboard
                      ? 'text-white'
                      : 'text-primary'
                    : 'text-text-secondary'
                }`}>
                  {tab.label}
                </span>
                
                {isActive && !isDashboard && (
                  <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;