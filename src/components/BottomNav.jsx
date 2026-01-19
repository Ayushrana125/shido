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
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="mb-6">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-floating border border-white/20 max-w-md mx-auto">
            <div className="flex justify-around items-center py-3 px-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const isDashboard = tab.id === 'dashboard';
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 relative ${
                      isActive
                        ? isDashboard
                          ? 'bg-gradient-primary shadow-glow transform scale-105'
                          : 'bg-primary/10'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {isActive && isDashboard && (
                      <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-20 animate-pulse" />
                    )}
                    
                    <div className={`relative z-10 ${
                      isActive
                        ? isDashboard
                          ? 'text-white'
                          : 'text-primary'
                        : 'text-text-secondary'
                    }`}>
                      <tab.Icon className="w-5 h-5 mb-1" />
                    </div>
                    
                    <span className={`text-xs font-inter font-medium relative z-10 ${
                      isActive
                        ? isDashboard
                          ? 'text-white'
                          : 'text-primary'
                        : 'text-text-secondary'
                    }`}>
                      {tab.label}
                    </span>
                    
                    {isActive && !isDashboard && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;