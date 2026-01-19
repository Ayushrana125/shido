import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import AuthScreen from './screens/AuthScreen';
import BottomNav from './components/BottomNav';
import Dashboard from './screens/Dashboard';
import Goals from './screens/Goals';
import Calendar from './screens/Calendar';
import Vision from './screens/Vision';
import Settings from './screens/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-poppins font-bold text-3xl bg-gradient-primary bg-clip-text text-transparent mb-2">
            Shido
          </h1>
          <p className="font-inter text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="w-full max-w-6xl mx-auto">
          {renderScreen()}
        </div>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

export default App;