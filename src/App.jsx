import React, { useState } from 'react';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import Goals from './screens/Goals';
import Calendar from './screens/Calendar';
import Vision from './screens/Vision';
import Settings from './screens/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'vision':
        return <Vision />;
      case 'calendar':
        return <Calendar />;
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'goals':
        return <Goals />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Full width like Instagram web */}
      <div className="w-full max-w-6xl mx-auto">
        {renderScreen()}
      </div>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;