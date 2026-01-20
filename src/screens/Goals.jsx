import React, { useState, useEffect } from 'react';
import { saveGoal, getGoals, calculatePhase } from '../goalsService';
import { getCurrentUser } from '../auth';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', targetPoints: '' });
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (user) {
      loadGoals();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      const { data, error } = await getGoals(user.user_id);
      if (!error && data) {
        setGoals(data);
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPhaseStatus = (score, target) => {
    const percentage = (score / target) * 100;
    if (percentage < 20) return { name: 'Energy Phase', color: 'from-red-400 to-orange-400' };
    if (percentage < 50) return { name: 'Presence Phase', color: 'from-orange-400 to-yellow-400' };
    if (percentage < 80) return { name: 'Attraction Zone', color: 'from-yellow-400 to-primary' };
    return { name: 'Girlfriend Ready', color: 'from-primary to-secondary' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const { data, error } = await saveGoal(user.user_id, formData);
    if (!error && data) {
      setGoals([data, ...goals]);
      setFormData({ name: '', targetPoints: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary to-primary pt-8 px-4 pb-6">
        <div className="mb-6">
          <h1 className="font-poppins font-bold text-xl text-white mb-2">
            Your Path
          </h1>
          <p className="font-inter text-white/80 text-sm">
            Track your journey to success
          </p>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : goals.length === 0 ? (
          <div className="max-w-sm mx-auto">
            <div className="bg-white rounded-2xl p-8 text-center shadow-card">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-secondary to-primary rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">🎯</span>
              </div>
              <h3 className="font-poppins font-bold text-lg text-text-primary mb-3">
                Set Your First Goal
              </h3>
              <p className="font-inter text-text-secondary text-sm leading-relaxed mb-6">
                Define your target and start your discipline journey today.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-secondary to-primary text-white py-4 px-6 rounded-xl font-inter font-semibold shadow-soft hover:shadow-card transition-all"
              >
                Create Goal
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="pt-6">
              <h2 className="font-poppins font-bold text-xl text-text-primary mb-2">
                Current Goal
              </h2>
              <p className="font-inter text-text-secondary text-sm">
                Your progress towards discipline mastery
              </p>
            </div>
            
            {goals.map((goal) => {
              const progress = Math.min((goal.current_points / goal.target_points) * 100, 100);
              const phase = calculatePhase(goal.current_points, goal.target_points);
              
              return (
                <div key={goal.goal_id} className="bg-white rounded-2xl p-6 shadow-card max-w-lg mx-auto">
                  <div className="text-center mb-6">
                    <h3 className="font-poppins font-bold text-xl text-text-primary mb-4">
                      {goal.goal_name}
                    </h3>
                    
                    <div className="relative mb-6">
                      <div className="w-24 h-24 mx-auto relative">
                        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 120 120">
                          <circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="6"
                          />
                          <circle
                            cx="60"
                            cy="60"
                            r="45"
                            fill="none"
                            stroke="url(#progressGradient)"
                            strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={`${progress * 2.83} 283`}
                            className="transition-all duration-500"
                          />
                          <defs>
                            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#7ED1C1" />
                              <stop offset="100%" stopColor="#8FB9FF" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="font-poppins font-bold text-lg text-text-primary">
                              {Math.round(progress)}%
                            </div>
                            <div className="font-inter text-text-secondary text-xs">
                              Complete
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <div className="flex justify-between items-center text-sm font-inter">
                        <span className="text-text-secondary">Progress</span>
                        <span className="font-semibold text-text-primary">
                          {goal.current_points} / {goal.target_points} points
                        </span>
                      </div>
                    </div>

                    <div className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-inter font-semibold text-sm shadow-soft">
                      {phase}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Add Button */}
      {goals.length > 0 && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-secondary to-primary rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:shadow-xl transition-all z-40"
        >
          +
        </button>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-card">
            <h3 className="font-poppins font-bold text-lg text-text-primary mb-6 text-center">
              Create Your Goal
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-inter font-semibold text-text-primary mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g., Get in shape"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block font-inter font-semibold text-text-primary mb-2">
                  Target Points
                </label>
                <input
                  type="number"
                  value={formData.targetPoints}
                  onChange={(e) => setFormData({ ...formData, targetPoints: e.target.value })}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl font-inter focus:border-primary focus:outline-none transition-colors"
                  placeholder="500"
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl font-inter font-semibold text-text-secondary hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-secondary to-primary text-white rounded-xl font-inter font-semibold shadow-soft hover:shadow-card transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;